# Current-head reverify — search legacy lazy init

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-04  
**Source main before fix:** `6e66797834dfd203ae0111070848adadee5c76b8`  
**Source fix commit:** `30b9fe46bde22e67bbff7a9418718b4e18f5dab5`  
**Source lane/main:** `lane/search-legacy-lazy-init-2026-07-04` and `main`

---

## 1. Scope

Continue `P2-SEARCH-EAGER` after the earlier Astro-native lazy script-loading fix. Legacy/full-document pages still included `search.js` directly; the direct script built `.cp-*` command-palette DOM and requested search data during initial page load.

This lane focuses on stopping eager DOM/data work on those pages without replacing every legacy footer script tag.

---

## 2. Source changes

Commit `30b9fe46`:

- `js/search.js`: added a self-lazy bootstrap guard.
  - First eager execution installs a `GBSearch` stub and event listeners, then returns.
  - First `Ctrl/⌘+K`, search button click, or `gb:openSearch` event loads/reruns `search.js` for full initialization.
  - Pending open intent opens the command palette after full initialization.
- `src/layouts/BaseLayout.astro`: updated the existing lazy loader so `Ctrl/⌘+K` opens after the lazy script loads, while generic first click/touch only preloads.
- Ran `npm run cache-bust`: `js/search.js` hash updated to `fb5cf04f` across root HTML, Astro sources, and `src/lib/asset-version.js`.
- Added lane report: `docs/refactor-2026/lanes/search-legacy-lazy-init-2026-07-04.md`.

---

## 3. Verification

```text
node --check js/search.js                                      PASS
npm run cache-bust                                             PASS
npm run strangler:build:production-like                        PASS
custom Playwright search lazy smoke                             PASS
npm run validate:all                                           PASS (0 errors; 1 pre-existing SEO warning)
node scripts/dist-smoke-audit.js --no-build --production-like   PASS
npm run audit:premium-controls                                 PASS (87/87)
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
GBSearch stub present: true
/data/search-manifest.json requests: 0
/pagefind requests: 0
```

After `Ctrl+K`:

```text
full search initialized: true
.cp-backdrop.is-open: true
```

---

## 4. Status

`P2-SEARCH-EAGER`: **partially improved further on source main `30b9fe46`**.

What is fixed:

- eager command-palette DOM construction is stopped on legacy/full-document pages;
- eager `/data/search-manifest.json` / Pagefind work is stopped until first search interaction.

What remains:

- legacy pages still download the first-pass `search.js` file because script tags remain. That first pass is now a lightweight bootstrap return, but full network lazy-loading of legacy script tags would require a separate higher-risk footer/loader migration.

---

## 5. Remote workflow

Source main is now `43a515df3aa409cda59d59cb188f8c60c9ba1ebe` (auto cache-bust descendant of `30b9fe46bde22e67bbff7a9418718b4e18f5dab5`). Remote `Deploy to GitHub Pages` is **green** on run `28708425606` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28708425606).
