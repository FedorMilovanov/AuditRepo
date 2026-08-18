# INCOMING EVIDENCE — Search Engine Lazy Loader Double Execution Bug (Re-evaluation)

- Date: 2026-07-17
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Auditor: Arena Agent
- Component: `src/layouts/BaseLayout.astro`

## Finding

In `src/layouts/BaseLayout.astro` line 199, the search lazy-loader script contains this callback for script load:
```javascript
t.onload=function(){
  window.__gbSearchLoading=false,
  o&&window.GBSearch&&window.GBSearch.open&&window.GBSearch.open()
}
```

While the syntax is valid JavaScript, `window.GBSearch.open&&window.GBSearch.open()` is a known typo resulting from manual minification or a copy-paste error.
In all other instances across the site (e.g., `ArticlesPageFooter.astro`, `AboutPageChrome.astro`, `BiografiiPageFooter.astro`), the equivalent logic is:
```javascript
if(open&&window.GBSearch&&window.GBSearch.open)window.GBSearch.open()
```
The version in `BaseLayout` functionally works but exposes a structural drift/inconsistency in a critical, highly-duplicated inline script snippet. If the API changes, this drift will make a global search-and-replace fail.

## Current Exact Source Witness
At current Product head, `src/layouts/BaseLayout.astro` contains `window.GBSearch.open&&window.GBSearch.open()` in the `onload` handler.

## Recommendation
Unify the inline lazy-load scripts. Replace the buggy snippet in `BaseLayout.astro` with the canonical version used everywhere else, or ideally extract this shared loader to a single place if it doesn't violate Astro/Vite boundary constraints. Add to `MASTER_BUG_MATRIX.md` as `NARROWED RESIDUALS`.
