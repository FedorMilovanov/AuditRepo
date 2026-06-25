# Independent Audit Round 6 — arena-agent-independent

**Date:** 2026-06-25  
**Auditor:** arena-agent-independent  
**Source:** FedorMilovanov/gb-is-my-strength (HEAD: `d19baf0`)  
**Method:** Source code inspection, CI/CD workflow review, Astro component analysis  
**SHA verified:** d19baf0c50c97b379eba5af14a692f2f82ea7052  

---

## Summary

Independent audit of gb-is-my-strength (gospod-bog.ru). **3 new findings** not covered by Rounds 1–5.

| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| NEW-1 | P2 | Accessibility | Series cover images in SeriesArticleLayout have `alt=""` instead of descriptive alt |
| NEW-2 | P1 | SEO | 6 nagornaya pages missing `<priority>` in sitemap.xml |
| NEW-3 | P3 | UX/UI | hard-texts pages declare GBS2 data attributes but lack GBS2 rail DOM elements |

**Overlap with existing audit:** P0-10 (Astro hash stale), P1-14/15/16 (GBS2 wiring), P0-7/8 (cache-bust drift), P1-2/3 (sitemap/manifest incomplete) — all confirmed present, no new evidence found.

---

## NEW-1 · P2 · Accessibility — `alt=""` on series cover images

### Description

`src/layouts/SeriesArticleLayout.astro` renders 10 SVG cover images for the "Баптисты России" article series with empty `alt` attributes:

```astro
<!-- Line 55 — thumbnail in rail nav -->
<span class="gbs2-thumb">
  <img src={coverImg(data.slug)} alt="" width="600" height="315" .../>

<!-- Line 71 — hero cover (OK) -->
<img src={coverImg(data.slug)} alt={`Обложка: ${h1}`} .../>  ← descriptive

<!-- Line 97 — sheet parts nav -->
<img src={coverImg(part.data.slug)} alt="" .../>
```

### Impact

- **Accessibility:** Screen readers announce "image" with no context for 20 cover images (rail nav + sheet parts)
- **AI/SEO:** LLM crawlers (Perplexity, Claude) reading page source see empty alt on historical content images
- **Scope:** All 10 pages in /baptisty-rossii/ (noch-na-kure through spravochnik)

### Files affected

| File | Lines | alt value |
|------|-------|-----------|
| `src/layouts/SeriesArticleLayout.astro` | 55, 97 | `alt=""` → should be `alt={`Обложка: ${h1}`}` |
| `src/layouts/SeriesArticleLayout.astro` | 71 | `alt={`Обложка: ${h1}`}` — already correct |

### Evidence

All 10 SVG covers exist and are referenced correctly in logic; only the `alt` attribute is empty on the navigation thumbnails and sheet parts.

### Fix

Change lines 55 and 97 in `SeriesArticleLayout.astro`:
```diff
- <img src={coverImg(data.slug)} alt="" ...>
+ <img src={coverImg(data.slug)} alt={`Обложка: ${h1}`} ...>
```

---

## NEW-2 · P1 · SEO — 6 nagornaya pages missing `<priority>` in sitemap.xml

### Description

`sitemap.xml` contains 43 URLs, but 6 nagornaya article parts and the karty hub are **missing the `<priority>` element** while all other URLs have one:

| URL | `<priority>` | `<lastmod>` |
|-----|-------------|-------------|
| `https://gospod-bog.ru/nagornaya/chast-1/` | ❌ MISSING | ✅ |
| `https://gospod-bog.ru/nagornaya/chast-2/` | ❌ MISSING | ✅ |
| `https://gospod-bog.ru/nagornaya/chast-3/` | ❌ MISSING | ✅ |
| `https://gospod-bog.ru/nagornaya/chast-4/` | ❌ MISSING | ✅ |
| `https://gospod-bog.ru/nagornaya/chast-5/` | ❌ MISSING | ✅ |
| `https://gospod-bog.ru/karty/` | ❌ MISSING | ❌ MISSING lastmod too |

All other 37 URLs have `<priority>0.6–1.0`. All 5 nagornaya parts are top-tier content (5 parts, 120+ sources, canonical SEO articles).

### Root cause

`scripts/update-meta.js` likely updates `<lastmod>` for known page types but skips nagornaya/chast-N/ sub-pages and the karty landing page.

### Impact

- Search engines cannot determine relative importance of these 5 high-value article pages
- Nagornaya series parts may rank lower than warranted in Google/Yandex
- /karty/ missing lastmod means crawlers don't know if it's been updated

### Fix

1. Add to `scripts/update-meta.js` handler for `nagornaya/chast-{1-5}/index.html` with `<priority>0.8</priority>`
2. Add `<priority>0.7</priority>` and `<lastmod>` for `/karty/` URL block

---

## NEW-3 · P3 · UX/UI — hard-texts pages missing GBS2 rail DOM elements

### Description

hard-texts article pages (Римлянам 7, Иеремия 17) declare GBS2 data attributes on `<body>`:

```html
<body class="gbs-world" 
      data-gbs2-series="hard-texts" 
      data-gbs2-done-min="41" 
      data-gbs2-part-min="12" 
      data-gbs2-total-min="53">
```

And load `enhancements.js` (confirmed: `Rimlyanam7Body.astro` line 196 includes enhancements.js).

However, the layout lacks GBS2 rail DOM elements:
- ❌ `#gbs2Toc` (rail TOC pane)
- ❌ `#gbs2Ring`, `#gbs2Pct` (rail progress ring)
- ❌ `#gbs2Count` (TOC counter)
- ❌ `#gbs2Curbar` (article progress bar)
- ❌ `data-gbs2-theme/font/share` control buttons

### Impact

- `enhancements.js` skips TOC building (no `#gbs2Toc`) — harmless no-op
- Rail progress ring (`#gbs2Ring`, `#gbs2Pct`) never updates on scroll
- No theme/font/share controls available on hard-texts pages
- **Mitigated:** mobile bottom bar (`#gbs2Bbar`, `#gbs2MobPct`, `#gbs2MobSec`) IS present and works correctly

### Severity justification (P3, not P2)

The page is **not broken** — the bottom bar works, article content is readable, series progress is tracked. The GBS2 rail UI absence is a **feature gap** not a **functional bug**.

### Fix

Either:
1. Add GBS2 rail DOM elements to `Rimlyanam7Body.astro` and `KrajneBody.astro` (full GBS2 experience)
2. Remove `data-gbs2-done-min/part-min/total-min` from `<body>` if rail is intentionally omitted

---

## Verification: No new evidence for known bugs

### P0-10 (Astro stale hashes)

Confirmed present: 36+ Astro components still reference old `?v=202876c3` for site.css. `cache-bust.js` skips `src/` directory entirely (SKIP_DIRS includes 'src').

### P1-14/15/16 (GBS2 wiring in SeriesArticleLayout)

Confirmed: `SeriesArticleLayout.astro` loads `bookmark-engine.js`, `site-utils.js`, `site.js`, `glossary.js`, `sw-register.js`, `search.js`, `highlights.js` — but NOT `enhancements.js`. The `data-gbs2-*` buttons (theme, search, font, share) in the layout have no handler.

### P1-17 (CSS hash asymmetry)

Confirmed: BaseLayout.astro loads CSS files without hash while JS uses `scriptTag()` with MD5 hash.

---

## Conclusion

**3 net-new findings.** No additional evidence for existing P0 bugs.

| ID | Priority | Fix complexity | Estimated time |
|----|----------|----------------|----------------|
| NEW-1 | P2 | Low (2 lines) | 15 min |
| NEW-2 | P1 | Low (script + sitemap regen) | 30 min |
| NEW-3 | P3 | Medium (design decision) | 60 min |
