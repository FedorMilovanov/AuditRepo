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

