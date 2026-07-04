# Agent Work Report — Pass 93 (Sitemap + Route Coverage)

## Meta
- **Agent:** arena-agent-pass93
- **Date:** 2026-07-05
- **Source HEAD:** `8c318010` → `2f09c8f` (auto cache-bust only)
- **Mode:** sitemap coverage audit + route inventory

---

## 1. New Findings

### BUG-SITEMAP-8-KARTY-MISSING — 8 karty/ routes missing from sitemap.xml

- **Severity:** P2
- **Evidence (verified-source, `8c318010`):**
  ```
  Karty routes (10 pages):
    ✅ /karty/           — IN sitemap
    ✅ /karty/avraam/    — IN sitemap
    ✅ /karty/ishod/     — IN sitemap
    ❌ /karty/early-church/ — MISSING from sitemap
    ❌ /karty/maccabim/    — MISSING
    ❌ /karty/melachim/    — MISSING
    ❌ /karty/pavel/       — MISSING
    ❌ /karty/revelation/  — MISSING
    ❌ /karty/shoftim/     — MISSING
    ❌ /karty/shvatim/     — MISSING
    ❌ /karty/yeshua/      — MISSING
  ```
- **Root cause:** The sitemap generator (or manual sitemap update) only includes 2/10 karty sub-routes. The remaining 8 are production-dist in page-ownership.json but not reflected.
- **Impact:** 8 interactive map pages (Book of Early Church, Maccabees, Kings, Paul, Revelation, Judges, Tribes, Joshua/Yeshua) are invisible to search engines. These are substantial interactive SPA pages with historical/biblical content.
- **Note:** `/izbrannoe/` correctly excluded (has `robots="noindex, follow"`). `/dev/astro-test/` correctly excluded (build-only).
- **Confidence:** high
- **Repair lane:** seo-sitemap-fix

---

### BUG-SW-PRECACHE-27 — SW PRECACHE has 27 assets, some potentially stale

- **Severity:** P3
- **Evidence:** SW `PRECACHE_ASSETS` = 27 entries:
  ```
  6 CSS: site, home, command-palette, mobile-hotfix, nagornaya-mobile-toc,
         floating-cluster, sw-toast
  1 font CSS: fonts.css
  1 tailwind: nagornaya/tw.min.css
  11 JS: site, site-utils, scroll-perf, bookmark-engine, enhancements,
        highlights, search, sw-register, nagornaya-mobile-toc, glossary,
        floating-cluster-controller
  1 pagefind: /pagefind/pagefind.js
  1 PWA: manifest.json
  3 icons: favicon.ico, favicon-48.png, apple-touch-icon.png
  1 static: 404.html
  1 data: /data/search-manifest.json
  ```
- **Analysis:**
  - `/js/search.js` + `/data/search-manifest.json` are lazy-loaded (Pass 56) → confirmed BUG-ARCH-001 (4 assets, not 2)
  - `/js/glossary.js` — in PRECACHE but loaded dynamically. Confirms audit-1-1 finding.
  - All CSS is precached even though some pages only need a subset.
  - `/pagefind/pagefind.js` precached but only needed when user opens search.
- **Repair lane:** perf-cleanup (already in BUG-ARCH-001)

---

## 2. Confirmations

### Confirm BUG-ARCH-001 — EXPANDED to 4 assets
SW PRECACHE contains: `/js/search.js`, `/data/search-manifest.json`, `/js/glossary.js`, `/pagefind/pagefind.js` — all lazy-loaded or interaction-triggered. Total: 4 assets that should NOT be in install-time precache.

### Confirm BUG-MATRIX-DRIFT-01
- page-ownership: 54 routes (+1 legacy-app `_app/` entry)
- sitemap: 43 routes
- llms.txt: 43 routes
- migration-matrix: 35 routes

---

## 3. Notes for Verifier

### Sitemap update mechanism
The sitemap has 43 entries — exactly matching llms.txt count. This suggests both are generated/maintained together. The 8 missing karty routes are likely an oversight in the manual update process. These routes DO have Astro page files (all in `src/pages/karty/`) and are marked `production-dist` in ownership — they should be discoverable.

### SW PRECACHE audit
The 27-asset PRECACHE installs ~500KB+ before the page is interactive. Of these, ~100KB (4 assets) are search/interaction-triggered and could be deferred. The remaining ~400KB (23 assets) are performance-critical for first paint.
