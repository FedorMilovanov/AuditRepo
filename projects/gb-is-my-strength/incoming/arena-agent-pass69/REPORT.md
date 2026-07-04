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
