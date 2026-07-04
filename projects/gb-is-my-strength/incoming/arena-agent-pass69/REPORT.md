# SEARCH AUDIT REPORT — Pass 69 (Deep Search Investigation)

**Date:** 2026-07-04  
**Source HEAD:** `629ed89a`  
**Mode:** Pure auditor/verifier — no source changes

---

## Executive Summary

The search system has a **critical architectural gap**: `data-pagefind-meta="scripture"` is missing from almost ALL scripture-heavy pages. The "Писание" (Scripture) search scope — a dedicated tab in the command palette — is effectively broken, returning results from only 3 pages instead of 25+.

---

## Search Architecture Overview

The site uses a **dual search system**:

1. **search.js** (command palette) — Client-side search over `search-manifest.json` (44 items, metadata only). Provides instant results for page titles/descriptions/tags. Falls back to Pagefind for full-text.

2. **Pagefind v1.5.2** — Full-text search index that crawls `data-pagefind-body` content. Indexes 43 pages with 16,411 words.

3. **"Писание" scope** — A dedicated tab that filters results by `meta.scripture` from Pagefind. Shows pages tagged with scripture references.

---

## 🐛 BUG-SEARCH-001: `data-pagefind-meta="scripture"` MISSING on 15+ scripture-heavy pages (P1)

Only **3 pages** have `data-pagefind-meta="scripture"` in their content body:
- `hermenevticheskaya-otsenka` — `2 Тим 3:16` ✅
- `krajne-li-isporcheno-serdce` — `Иер 17:9` ✅
- `rimlyanam-7-veruyushchiy-ili-neveruyushchiy` — `Рим 7:14–25` ✅

Nagornaya chast-1/2/3 have it in their **headers** (not body, but Pagefind scans entire page so this works):

### Missing scripture meta on pages that NEED it:

| Page | Bible refs found | Has scripture meta? | Impact |
|------|:----------------:|:-------------------:|--------|
| **rodosloviye/** | **262+** (Мф, Лк, Рим, Евр, Иак) | ❌ | 🚨 Genealogy of Christ — 0% visible in scripture search |
| **nagornaya/chast-5** | 56+ (Мф, Рим, 2 Кор, Иак) | ❌ | Matt 7 / Sermon on Mount — invisible |
| **nagornaya/chast-4** | 24+ (Ин, Мф, Лк, Рим, 2 Тим) | ❌ | Trusting the Gospels — invisible |
| **hard-texts/** | 26+ (Иер 17:9, Рим 7) | ❌ | WRONG — it's about Jeremiah 17! |
| **nagornaya/chast-1** | 82 | ✅ (in header) | OK |
| **nagornaya/chast-2** | 23 | ✅ (in header) | OK |
| **nagornaya/chast-3** | 60 | ✅ (in header) | OK |
| **nagornaya/istochniki** | 12+ | ❌ | Should reference scripture sources |
| **nagornaya/nakhodki** | 10+ | ❌ | Should reference scripture findings |
| **dzhon-gill-chast-1-chelovek** | 17+ | ❌ | Theology article with heavy NT citation |
| **dzhon-gill-chast-2-uchenyi** | 12+ | ❌ | Theology article |
| **kod-da-vinchi/** | 11+ | ❌ | Apologetics with NT citations |

### Root cause: Where scripture meta SHOULD be set

| Component type | File | Has scripture? |
|---------------|------|:--------------:|
| Generic MDX layouts | `ArticleLayout.astro` | ❌ — NO mechanism for it |
| Generic MDX layouts | `SeriesArticleLayout.astro` | ❌ — NO mechanism for it |
| Nagornaya 1-3 HeaderHero | `NagornayaChast*HeaderHero.astro` | ✅ |
| Nagornaya 1-3 MainShell | `NagornayaChast*MainShell.astro` | ✅ |
| **Nagornaya 4-5 HeaderHero** | `NagornayaChast4/5HeaderHero.astro` | ❌ — **MISSING** |
| **Nagornaya 4-5 MainShell** | `NagornayaChast4/5MainShell.astro` | ❌ — **MISSING** |
| **Nagornaya ArticleBody** | `NagornayaChast*ArticleBody.astro` | ❌ — should be in body! |
| Gill ArticleBody | `GillPart*ArticleBody.astro` | ❌ |
| KodDaVinchi body | `KodDaVinchiArticleBody.astro` | ❌ |
| Rodosloviye body | `RodosloviyeBody.astro` | ❌ |
| HardTexts PageChrome | `HardTextsPageChrome.astro` | ❌ |

---

## 🐛 BUG-SEARCH-002: Nagornaya chast-4 & chast-5 completely missing scripture meta (P2)

**Evidence:**
```
src/components/nagornaya/chast-4/NagornayaChast4HeaderHero.astro — NO scripture meta
src/components/nagornaya/chast-4/NagornayaChast4MainShell.astro — NO scripture meta
src/components/nagornaya/chast-5/NagornayaChast5HeaderHero.astro — NO scripture meta
src/components/nagornaya/chast-5/NagornayaChast5MainShell.astro — NO scripture meta
```

While chast-1/2/3 all have it. Inconsistency during parallel development.

---

## 🐛 BUG-SEARCH-003: ArticleLayout (MDX) has no scripture meta mechanism (P2)

**Evidence:** `src/layouts/ArticleLayout.astro` and `src/layouts/SeriesArticleLayout.astro`

These are the generic layout templates for ALL MDX-based articles. They support `data-pagefind-meta` for:
- `author` ✅
- `readTime` ✅
- `category` ✅
- `image` ✅

But NOT for `scripture`. Any MDX article will never appear in the "Писание" search scope regardless of its biblical content.

**Fix needed:** Add a `scripture` prop to `BaseLayout` and `ArticleLayout`, and render `<span data-pagefind-meta="scripture" hidden>{scripture}</span>` when provided.

---

## 🐛 BUG-SEARCH-004: search-manifest.json has NO scripture field (P3)

**Evidence:** The 44 items in `data/search-manifest.json` have these keys:
```
id, type, url, title, description, section, editor, image, tags, featured, priority, publishedTime, modifiedTime, readTime
```

No `scripture` field exists. The client-side search function `G()` combines title+description+section into a searchable text, but can't distinguish scripture-relevant pages from non-scripture ones.

**Impact:** When Pagefind isn't loaded yet, the "Писание" scope has no data to filter on.

---

## 🐛 BUG-SEARCH-005: "Писание" scope default suggestions return zero results (P3)

**Evidence in `js/search.js`:**
```javascript
"scripture" === C ? (S.innerHTML = '...<div class="cp-suggestions">'+
  ["Ин 3:16", "Мф 5:3", "Рим 8:28", "Иер 17:9"]
```

These 4 suggestions are the default empty-state hints for the "Писание" tab. But:
- "Ин 3:16" → requires `meta.scripture` containing "Ин" on indexed pages → only 3 pages have any scripture meta
- "Мф 5:3" → only nagornaya pages (1-3) have it
- "Рим 8:28" → only 1 page has it (rimlyanam7)
- "Иер 17:9" → only 1 page has it (krajne)

Most queries in the "Писание" scope will return **0 results** because the data isn't there.

---

## Summary of bugs

| ID | Bug | Severity | Affected pages |
|----|-----|----------|----------------|
| SEARCH-001 | scripture meta missing on heavy-Bible pages | 🔴 **P1** | ~15 pages (rodosloviye, nagornaya 4-5, hard-texts, Gill, kod-da-vinchi) |
| SEARCH-002 | Nagornaya chast-4/5 headers lack scripture meta | 🟡 **P2** | 2 pages (chast-4, chast-5) |
| SEARCH-003 | ArticleLayout can't inject scripture meta | 🟡 **P2** | All MDX articles via layouts |
| SEARCH-004 | search-manifest lacks scripture field | 🔵 **P3** | Client-side search scope |
| SEARCH-005 | "Писание" suggestions return empty | 🔵 **P3** | User-visible UX |

---

## What needs to be fixed

### Minimal fix (highest ROI):
1. Add `data-pagefind-meta="scripture"` to:
   - `NagornayaChast4HeaderHero.astro` and `MainShell`
   - `NagornayaChast5HeaderHero.astro` and `MainShell`
   - `NagornayaChast1-5ArticleBody.astro` (move from header to body)
   - `RodosloviyeBody.astro` with `Мф 1, Лк 3`
   - `HardTextsPageChrome.astro` with `Иер 17:9, Рим 7`
   - `KodDaVinchiArticleBody.astro`
   - `GillPart*ArticleBody.astro` with key references

### Architectural fix:
2. Add `scripture` prop to `BaseLayout` → `ArticleLayout` → propagate to `<span data-pagefind-meta="scripture" hidden>`

### Data fix:
3. Add `scripture` field to `search-manifest.json` items for Bible-related pages
4. Regenerate search-manifest


---

## 🐛 BUG-SEARCH-006: No existing audit gate validates scripture meta presence (P2)

**Evidence:** Zero checks for `data-pagefind-meta="scripture"` exist in any of the 13 audit scripts:
- `audit-pro.js` — no scripture checks
- `check-data-consistency.js` — no scripture checks  
- `gill-pagefind-body-audit.js` — only checks word-count floors and body presence
- `sw-dist-readiness-audit.js` — only checks pagefind.js precache
- `dist-publication-audit.js` — only checks pagefind-body presence

**Result:** Even after adding scripture meta, there is no way to detect regressions.

---

## 🐛 BUG-SEARCH-007: Rodosloviye has 262 Bible refs but ZERO pagefind meta tags (P2)

`RodosloviyeBody.astro` has `data-pagefind-body` but:
- NO `<span data-pagefind-meta="author" hidden>`
- NO `<span data-pagefind-meta="readTime" hidden>`
- NO `<span data-pagefind-meta="category" hidden>`
- NO `<span data-pagefind-meta="scripture" hidden>`
- NO `<span data-pagefind-meta="image" hidden>`

Pagefind indexes page content by `data-pagefind-body`, but without meta tags, the search results show no metadata.

---

## 🐛 BUG-SEARCH-008: Nagornaya Chast4/5 have OTHER pagefind meta — just missing scripture (P3)

**Chast-4 and Chast-5 have:** author, readTime, category, image — all present.
**Chast-4 and Chast-5 are MISSING:** scripture meta ONLY.

This is the easiest fix — single line addition to both `HeaderHero.astro` and `MainShell.astro`.

---

## Custom scripture values recommended for each page

| Page | Recommended `data-pagefind-meta="scripture"` value |
|------|---------------------------------------------------|
| rodosloviye/ | `Мф 1, Лк 3, Быт 5,11` |
| nagornaya/chast-4 | `Мф 5-7, Лк 6, Ин 14-16` |
| nagornaya/chast-5 | `Мф 5-7, Лк 6, Рим, Иак` |
| nagornaya/istochniki | `Мф 5-7, Лк 6` |
| nagornaya/nakhodki | `Мф 5-7, Лк 6` |
| hard-texts/ | `Иер 17:9, Рим 7, Рим 8` |
| articles/dzhon-gill-chast-1 | `Деян, 2 Тим, Быт` |
| articles/dzhon-gill-chast-2 | `Пс, Ис, Рим` |
| articles/dzhon-gill-chast-3 | `Мф, 1 Тим, 2 Пет` |
| articles/kod-da-vinchi | `Мф 24, Ин 17, 1 Тим, 2 Тим, Гал, Кол, 2 Пет` |
| articles/20-antisovetov-pastoru | `1 Тим 3, Тит 1, 1 Пет 5` |

---

## Fix plan (priority order)

### Step 1 (P1 — 5 min fix): Add scripture meta to 5 underivable pages
Add `<span data-pagefind-meta="scripture" hidden>` to:
1. `NagornayaChast4MainShell.astro` (line ~11, after readTime)
2. `NagornayaChast4HeaderHero.astro` (line ~13, after category)
3. `NagornayaChast5MainShell.astro` (line ~14, after category)
4. `NagornayaChast5HeaderHero.astro` (line ~13, after category)
5. `HardTextsPageChrome.astro` (anywhere inside `data-pagefind-body` section)

### Step 2 (P2 — 30 min): Add scripture prop to BaseLayout + ArticleLayout
1. Add `scripture?: string` to `BaseLayout.astro` Props
2. Render `<span data-pagefind-meta="scripture" hidden>{scripture}</span>` inside BaseLayout when provided
3. Add `scripture` handling to `ArticleLayout.astro` and `SeriesArticleLayout.astro`
4. Add `scripture` to MDX frontmatter interface in content collection config
5. Update 20 MDX frontmatter files with scripture values

### Step 3 (P2 — 15 min): Add audit gate
1. Add `data-pagefind-meta="scripture"` check to `check-data-consistency.js` or `audit-pro.js`
2. Verify: every page with `data-pagefind-body` and ≥5 Bible references must have scripture meta

### Step 4 (P3): Regenerate search-manifest
1. Add `scripture` field when `data-pagefind-meta="scripture"` is detected
2. Run `npm run pagefind:build:dist` to rebuild indexes

---

## Verification after fix

```bash
# 1. Build dist
npm run strangler:build:production-like

# 2. Rebuild Pagefind index
npm run pagefind:build:dist

# 3. Verify scripture meta present on target pages
grep -l 'data-pagefind-meta="scripture"' dist/*/index.html dist/**/*/index.html

# 4. Run existing gates
node scripts/dist-smoke-audit.js --no-build --production-like
npm run audit:premium-controls
npm run gill:mobile-play:smoke

# 5. Full gate
npm run validate:static-publication
npm run guard:shared-files
```

---

## 🐛 BUG-SEARCH-016 (CRITICAL ARCHITECTURAL): "Писание" scope NEVER calls Pagefind — uses local manifest only (P1)

**Evidence** in `js/search.js`:
```javascript
// xe() function — MAIN search dispatch
function xe(e) {
  if(e && !(e.length<2))
    return W ? (++M, void ye(e)) 
    : void (
        "authors" !== C && "scripture" !== C 
          ? Ee(e)    // ← Pagefind full-text search
          : fe(...)   // ← local manifest search ONLY
      );
}
```

When scope (`C`) is `"scripture"` or `"authors"`, `fe()` is called — which ONLY searches the local `search-manifest.json` (44 items, title/desc/tags only).

When scope is `"all"` or `"articles"`, `Ee()` is called — which uses **Pagefind full-text search** across 43 pages with 16,411 words.

**Impact:** The "Писание" tab:
- ❌ NEVER searches actual article content
- ❌ NEVER finds scripture references in the text
- ❌ ONLY searches page titles and descriptions from manifest
- ❌ `e.scripture` is `null` for all 44 manifest items (no scripture field)
- ✅ Only works if user types words that happen to appear in a page TITLE or DESCRIPTION

**Worse:** The `Ee()` function (Pagefind) actually HAS proper scripture handling — it checks `meta.scripture` from Pagefind results and separates "Писание" results from "Статьи". But it's NEVER CALLED for the scripture scope.

---

## 🐛 BUG-SEARCH-017: G() function composition includes e.scripture but it's always null (P1)

The `G()` function builds a combined search string from manifest item fields:
```
e.title + e.description + e.section + e.author + e.editor + e.scripture + e.tags
```

But `e.scripture` is `undefined` for ALL 44 items because manifest has no `scripture` field. This means the scripture scope searches only titles and descriptions — completely missing the point.

---

## 🐛 BUG-SEARCH-009: Book name normalization only covers 9 of ~70 Bible books (P2)

The `$()` function normalizes only:
```
мф→матфей, мат→матфей, лк→лука, лук→лука, ин→иоанн, иоан→иоанн, 
рим→римлянам, иер→иеремия, кор→коринфянам
```

**MISSING abbreviations (60+):** мк, деян, гал, еф, флп, кол, 1фес, 2фес, 1тим, 2тим, тит, флм, евр, иак, 1пет, 2пет, 1ин, 2ин, 3ин, иуд, откр, быт, исх, лев, чис, втор, нав, суд, руфь, 1цар, 2цар, 3цар, 4цар, 1пар, 2пар, ездр, неем, есф, иов, пс, притч, еккл, песн, ис, плач, иез, дан, ос, иоил, ам, авд, иона, мих, наум, авв, соф, агг, зах, мал

**Impact:** User searching "Мк 1" or "Деян 2" will get ZERO results because the abbreviations aren't normalized to the full book names stored in the content.

---

## 🐛 BUG-SEARCH-021: Two completely separate search corpora (P2)

The search system has two independent indices that never merge for the scripture scope:

| Index | Items | Content | Used by scopes |
|-------|-------|---------|----------------|
| search-manifest.json | 44 | metadata only | Писание, Авторы |
| Pagefind (WASM) | 43 pages, 16K words | full-text | Все, Статьи |

A search for "Иер 17" in the "Писание" tab returns ONLY pages whose title/description contains "Иер" or "17". It NEVER finds the actual content.

A search for "Иер 17" in the "Все" tab uses Pagefind and CAN find content, but doesn't know it's a scripture reference.

---

## 🐛 BUG-SEARCH-023: 406KB dead Pagefind UI assets in dist (P3)

search.js has its own custom command palette UI. Pagefind's built-in UI bundles are never loaded:

| File | Size | Loaded? |
|------|:----:|:-------:|
| pagefind-ui.css + pagefind-ui.js | 131KB | ❌ Custom UI used |
| pagefind-component-ui.css + .js | 211KB | ❌ Custom UI used |
| pagefind-modular-ui.css + .js | 21KB | ❌ Custom UI used |
| pagefind-highlight.js | 43KB | ❌ Not used |
| **Total dead weight** | **406KB** | |

These are deployed to GitHub Pages as part of the dist artifact. They're never requested by users but use up deployment bandwidth and cache space.

---

## Summary of ALL search bugs (SEARCH-001 through SEARCH-023)

| ID | Bug | Severity | Root Cause |
|----|-----|:--------:|------------|
| SEARCH-001 | scripture meta missing on 15+ pages | 🔴 P1 | Components never added it |
| SEARCH-016 | Писание scope never calls Pagefind | 🔴 **P1** | `xe()` branches wrong |
| SEARCH-017 | G() function scripture field always null | 🔴 **P1** | manifest has no scripture |
| SEARCH-003 | ArticleLayout can't inject scripture | 🟡 P2 | Missing prop chain |
| SEARCH-009 | Book abbreviations not normalized (60+ missing) | 🟡 P2 | Incomplete $() function |
| SEARCH-021 | Two separate corpora never merge | 🟡 P2 | Architecture issue |
| SEARCH-006 | No audit gate for scripture meta | 🟡 P2 | Missing gate |
| SEARCH-002 | Nagornaya 4/5 headers lack scripture | 🟡 P2 | Copy-paste gap |
| SEARCH-007 | Rodosloviye has 0 pagefind meta tags | 🟡 P2 | Missing all meta |
| SEARCH-023 | 406KB dead Pagefind UI assets | 🔵 P3 | Not pruned from dist |
| SEARCH-004/5/8/22 | Various minor | 🔵 P3 | Various |


---

## 🐛 BUG-SEARCH-032: 16 Bible book abbreviations missing from $() normalization (P2)

The `$()` function normalizes only 9 abbreviations. **16 book abbreviations found in site content are NOT normalized:**

```
HANDLED: мф, мат, лк, лук, ин, иоан, рим, иер, кор
MISSING: Быт, Исх, Втор, Пс, Ис, Деян, Гал, Еф, Флп, Евр, Иак, Иуд, Откр, Агг, Зах, Наум
```

**Impact:** User searching "Деян 2" or "Евр 11" gets ZERO results for content that actually references these books.

---

## 🐛 BUG-SEARCH-033: hard-texts/ — единственная страница с EAGER search.js загрузкой (P3)

All 37 Astro-native pages correctly use the 642-byte inline lazy bootstrap that loads search.js on first interaction. But hard-texts/index.html still loads search.js eagerly as a direct `<script defer src="./js/search.js">`.

This wastes ~31KB parse+download on initial pageload for the hard-texts series landing page.

**Fix:** Add the lazy search bootstrap to `HardTextsPageChrome.astro` and remove the direct `search.js` script tag.

---

## 🐛 BUG-SEARCH-034: 15 interactive/map pages have zero search (P3)

karty/* (10 pages), konfessii (2 pages), map (1), izbrannoe (1), _app (1) — all lack any search mechanism.

These are `strict-native-app` pages that use their own React/Flow rendering. Search isn't accessible from them at all. Users on these pages must navigate away to use search.

---

## ✅ ALREADY CORRECT: Lazy search bootstrap works well

**37/38 content pages** have optimal lazy loading:
- 642 bytes inline bootstrap (not 31KB)
- 31KB search.js loaded externally on first Ctrl+K or click
- Cached by browser after first load

This confirms the earlier "SEARCH-030" finding was wrong — I incorrectly claimed search.js was inlined.

---

## Summary: Complete search bug taxonomy

| Priority | Count | IDs |
|:--------:|:-----:|-----|
| 🔴 P1 | 3 | SEARCH-001 (scripture meta missing), SEARCH-016 (Pagefind not called), SEARCH-017 (scripture always null) |
| 🟡 P2 | 8 | SEARCH-003, 006, 007, 009, 021, 032 (book normalization), 002, 008 |
| 🔵 P3 | 7 | SEARCH-004, 005, 022, 023 (dead assets), 033 (hard-texts eager), 034 (no search on maps), 011 |


---

## 🧪 БРАУЗЕРНЫЙ ТЕСТ (Playwright) — дефинитивное доказательство SEARCH-016 (2026-07-04)

**Проведён:** Playwright Chromium, production-like dist, реальный поисковый запрос.

### Методология
1. Загружена статья `/articles/krajne-li-isporcheno-serdce/`
2. Открыт поиск (Ctrl+K) → search.js загружен, Pagefind загружен ✅
3. Введён запрос "Иер 17" во вкладке "Все" → записаны результаты
4. Переключено на вкладку "Писание" → записаны результаты

### Результаты: дефинитивное доказательство

| Scope | Результаты | Что показывает |
|-------|:----------:|----------------|
| **"Все"** | `Иер 17:9 → Крайне ли испорчено сердце верующего? [Ссылка]` | ✅ **Pagefind нашёл контент** по `meta.scripture="Иер 17:9"` из Pagefind индекса |
| **"Писание"** | `Крайне ли испорчено сердце верующего? Разбор Иеремии 17:9–10...` (без маркера "Ссылка") | ❌ **Только manifest** — нашёл по описанию/тегам, НЕ по содержанию |

**Экран "Писание" показывает МЕНЬШЕ результатов, чем "Все"!**
Это прямое доказательство: Писание вкладка вызывает `fe()` (manifest), а не `Ee()` (Pagefind).

### Другие подтверждения

| Проверка | Результат |
|----------|----------|
| rodosloviye/ имеет `data-pagefind-body` | ✅ Да (проиндексировано Pagefind) |
| rodosloviye/ имеет `data-pagefind-meta="scripture"` | ❌ НЕТ — 262 библейские ссылки невидимы в Писание поиске |
| Default suggestions (Ин 3:16, Мф 5:3 и т.д.) | ✅ Показываются, но результаты — из manifest, а не из Pagefind |
| Pagefind loaded через search.js | ✅ Загружается и работает |
| Поиск "Римлянам 7" в "Все" | ✅ 5 результатов, включая точное совпадение |


---

## 🧪 PASS 75 — PLAYWRIGHT COMPARISON PROOF: ALL (9 results) vs Писание (2 results) for "Иер 17:9"

**Методология:** Playwright Chromium на production-like dist. Загружена статья, открыт Ctrl+K, введён запрос "Иер 17:9", измерено количество результатов во вкладках "Все" и "Писание".

**Результат:**
| Scope | Результатов | Движок |
|-------|:-----------:|--------|
| **Все** | **9** | Pagefind (полнотекстовый) |
| **Писание** | **2** | Manifest (метаданные, title+description) |
| **Разница** | **7 результатов потеряно** | |

**Доказательство:** Писание вкладка показывает на 7 результатов МЕНЬШЕ, потому что ищет ТОЛЬКО по title/description manifest, а не по полному тексту через Pagefind.

---

## 🐛 BUG-SEARCH-082: search-manifest.json — ПОЛНОСТЬЮ РУЧНОЙ файл, не генерируется (P2)

**Доказательство:**
- `data/search-manifest.json` обновлялся 15+ раз через git, НИ РАЗУ не был сгенерирован скриптом
- `scripts/update-meta.js` НЕ пишет search-manifest (только sitemap + feed.xml)
- В `package.json` нет скрипта для генерации search-manifest
- В `.github/workflows/deploy.yml` нет шага для генерации search-manifest
- Только `indexnow.yml` запускает `update-meta.js`, но тот не трогает manifest

**Кто мог бы генерировать:**
- `scripts/route-impact-report.js` — может писать JSON, но не генерирует manifest
- `scripts/audit-pro.js` — читает и валидирует manifest, но не пишет
- `scripts/check-data-consistency.js` — валидирует, но не генерирует

**Impact:** При добавлении новой статьи нужно вручную:
1. Добавить запись в `data/search-manifest.json`
2. Указать 13+ полей (id, type, url, title, description, section, editor, image, tags, featured, priority, publishedTime, modifiedTime, readTime)
3. Нигде не задокументировано

---

## 🐛 BUG-SEARCH-083: me() — scripture для manifest всегда null (P1, переподтверждение)

**Доказательство:**
```javascript
// me() function — converts manifest item to display item
function me(e) {
  return {
    ...
    article: {
      ...
      scripture: e.scripture || null,  // ← ВСЕГДА null
      ...
    }
  }
}
```

44/44 manifest items have `scripture: undefined`. This is the root cause of why:
1. Писание scope shows no "Ссылка" tag (that's only added by Ee/Pagefind path)
2. Писание scope shows fewer results
3. No scripture-related metadata is searchable via manifest

---

## 🐛 BUG-SEARCH-084: deploy.yml — нет шага для поиска scripture в gate (P2)

**Доказательство:** deploy.yml имеет шаги для:
- `pagefind:build:dist` ✅
- `check dist/pagefind/pagefind.js` ✅  
- `dist-publication-audit --require-pagefind` ✅
- Но НИГДЕ не проверяет: есть ли data-pagefind-meta="scripture" на страницах

---

## Архитектурная карта SEARCH (обновлённая)

```
User presses Ctrl+K
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ 642B inline bootstrap (37 pages)                     │
│ ← creates GBSearch helper object                     │
│ ← binds Ctrl+K, click on search button               │
│ ← DYNAMICALLY loads search.js (~30KB) on FIRST use   │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ search.js command palette (custom UI, not Pagefind) │
│                                                      │
│ 1. Loads /data/search-manifest.json (44 items)       │
│ 2. Shows default results for each scope              │
│ 3. User types → dispatches to appropriate engine:    │
│                                                      │
│    scope="all"       → Ee() → Pagefind WASM search   │
│    scope="articles"  → Ee() → Pagefind WASM search   │
│    scope="scripture" → fe() → LOCAL MANIFEST ONLY  ←│ ❌
│    scope="authors"   → fe() → LOCAL MANIFEST ONLY  ←│ ❌
│                                                      │
│ 4. Pagefind search (Ee) properly handles scripture:  │
│    - Reads meta.scripture from index                 │
│    - Tags results as isScripture=true                │
│    - Adds "Ссылка" badge                            │
│    - Can filter by scripture scope                   │
│                                                      │
│ 5. Manifest search (fe) CANNOT handle scripture:     │
│    - No scripture field in manifest data              │
│    - Scripture scope just filters by title/desc/tags  │
│    - No "Ссылка" badge ever                          │
│    - No scripture scope distinction                  │
└─────────────────────────────────────────────────────┘
```

---

## FIX PLAN (updated priority)

### Phase 1 — Fix the Писание scope (P1, 30 min)
1. Change `xe()` branching: scripture scope → call `Ee()` (Pagefind) instead of `fe()` (manifest)
2. Add `data-pagefind-meta="scripture"` to ALL article body components (15+ files)
3. Rebuild Pagefind index

### Phase 2 — Add missing functionality (P2, 1 hour)
4. Complete `$()` normalization for all 70+ Bible book abbreviations
5. Add scripture field to search-manifest items (auto-detect from pagefind or manual)
6. Add scripture meta check to deploy.yml gate
7. Create script to auto-generate search-manifest from page structure

### Phase 3 — Cleanup (P3)
8. Remove 406KB dead Pagefind UI assets from dist
9. Fix hard-texts/ eager loading → use lazy bootstrap
10. Remove 3 dead image refs from search-manifest


---

## 🧠 PASS 76 — SEARCH ARCHITECTURE FULL DECODE: scoring, debounce, limits, flow

### ge() — Scoring Algorithm (completely decoded)
```
Exact title match:              +120  ← highest priority
Title contains query:            +70
Description contains query:      +28
Per-word in title:               +20  (each word)
Per-word in description:          +8  (each word)
Per-word in e.scripture:         +10  ← ALWAYS ZERO — manifest has no scripture field!
Priority bonus:                  +2× priority (0-100)
```

### Search flow (completely mapped)
```
User types → 180ms debounce → xe(query)
  ├─ if query<2 chars → we() [show default state]
  ├─ if W (pagefind failed) → ye() [use scoring + manifest]
  ├─ if scope=scripture OR authors → fe() [manifest only]
  ├─ if scope=all OR articles → Ee() [pagefind]
  │
  ├─ fe() → loads /data/search-manifest.json
  │   → filters by G() or J() 
  │   → maps via me() [scripture=null]
  │   → max 12 results (ye) or unlimited (fe callback)
  │   → groups by scope name
  │
  └─ Ee() → checks pagefind via HEAD
       → loads pagefind.js dynamically (dynamic import)
       → window.__pagefind__.search(query)
       → processes results: extracts meta.scripture
       → if has scripture meta → isScripture=true, tag "Ссылка"
       → max 10 results
       → groups: Писание section + Статьи section
```

### Max results limits
| Search path | Max | Source |
|------------|:---:|--------|
| Empty state history | 6 | `slice(0,6)` |
| Empty state featured | 5 | `slice(0,5)` |
| ye() fallback (pagefind down) | 12 | `slice(0,12)` |
| Ee() pagefind success | 10 | `slice(0,10)` |

### Debounce
- **180ms** after user stops typing before executing search
- Clear timeout on each new keystroke (no queue buildup)
- No loading during debounce

---

## COMPLETE SEARCH BUG TAXONOMY (24 bugs)

| Priority | Count | IDs |
|:--------:|:-----:|-----|
| 🔴 P1 | 3 | SEARCH-001 (scripture meta missing), SEARCH-016 (Писание не вызывает Pagefind), SEARCH-017 (e.scripture всегда null) |
| 🟡 P2 | 10 | SEARCH-003, 006, 007, 009+032 (book norm), 021 (2 corpora), 082 (manual manifest), 084 (no gate), 002, 008 |
| 🔵 P3 | 11 | SEARCH-004, 005, 022, 023 (406KB dead), 033 (hard-texts eager), 034 (maps no search), 011, 024, 083 |
| **Total** | **24** | |

### Key metrics
- Only **3/43** Pagefind-indexed pages have `data-pagefind-meta="scripture"`
- **0/44** manifest items have `scripture` field
- **16/70** Bible book abbreviations NOT normalized by `$()`
- **406KB** dead Pagefind UI assets deployed
- **180ms** debounce (acceptable)
- **10-12** max results per query
