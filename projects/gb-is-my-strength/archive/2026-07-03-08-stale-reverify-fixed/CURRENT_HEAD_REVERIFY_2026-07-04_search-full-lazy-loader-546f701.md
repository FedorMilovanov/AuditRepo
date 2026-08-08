# Current-head reverify — search full lazy loader for legacy pages

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-04  
**Source main before fix:** `12f4a50a3cbdcd35c7111b087c6f3c81bfbf2009`  
**Source fix commit:** `546f7016b55a147dfbbca8e463e3fb0840686ed0`  
**Source lane/main:** `lane/search-full-lazy-loader-2026-07-04` and `main`

---

## 1. Scope

Close the remaining network side of `P2-SEARCH-EAGER`. Previous fix `30b9fe46` stopped eager command-palette DOM and search data work on legacy/full-document pages, but those pages still downloaded the first-pass `search.js` because the legacy footers still had direct `<script src=".../js/search.js" defer>` tags.

---

## 2. Source changes

Commit `546f7016`:

- Replaced direct legacy/root/Astro footer `search.js` script tags with a tiny inline lazy loader that:
  - listens for `Ctrl/⌘+K`, search button clicks, and `gb:openSearch`;
  - loads `search.js` only on first search interaction;
  - opens the palette after lazy load when the user explicitly requested search.
- Kept the existing `search.js` self-lazy guard from `30b9fe46` compatible with the loader.
- Avoided literal `data-fc-action=` in inline loader text so `premium-controls-rollout-audit.js` does not falsely classify the loader as PremiumControls markup.

---

## 3. Verification

Environment: Node `v22.14.0`, Playwright Chromium/deps installed.

```text
node --check js/search.js                                      PASS
npm run strangler:build:production-like                        PASS
custom Playwright search full-lazy smoke                       PASS
node scripts/dist-smoke-audit.js --no-build --production-like   PASS
npm run audit:premium-controls                                 PASS (87/87)
npm run validate:all                                           PASS (0 errors; 1 pre-existing SEO warning)
npm run validate:static-publication                            PASS
npm run guard:shared-files                                     PASS
```

Custom Playwright smoke routes:

```text
/articles/kod-da-vinchi/
/about/
/
```

Observed before first search interaction on all sampled routes:

```text
.cp-* DOM nodes: 0
GBSearch ready: false
/js/search.js requests: 0
/data/search-manifest.json requests: 0
/pagefind requests: 0
```

After `Ctrl+K`:

```text
/js/search.js requested
/data/search-manifest.json requested
/pagefind requested
GBSearch ready: true
.cp-backdrop.is-open: true
```

---

## 4. Status

`P2-SEARCH-EAGER`: **fixed-current on source main `546f7016` for the measured eager-load class**.

What is fixed:

- no initial `search.js` network request on sampled legacy/root routes;
- no initial command-palette DOM;
- no initial search-manifest or Pagefind work;
- search still opens on first interaction.

Notes:

- Search remains an old non-module runtime script and is still part of broader refactor debt (`R-001`/`R-004`), but the specific eager-load finding is closed.
- Remote GitHub Actions should be observed separately.

---

## 5. Remote workflow

Source main is now `aaaaf7a7805daee271557646913b4657975a523e` (auto cache-bust descendant of `546f7016b55a147dfbbca8e463e3fb0840686ed0`). Remote `Deploy to GitHub Pages` is **green** on run `28709565563` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28709565563). Remote `Visual Parity Guard — pixel-diff` is **green** on run `28709548827` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28709548827).
