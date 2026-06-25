# Premium SVG / strict-native pages bug investigation — 2026-06-25

## Scope investigated

User request focused on:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- Gill strict-native pages, especially:
  - `/articles/dzhon-gill-istoricheskiy-kontekst/`
  - `/articles/dzhon-gill-spravochnik/`
  - `/articles/dzhon-gill-chast-1-chelovek/`
  - `/articles/dzhon-gill-chast-2-uchenyi/`
  - `/articles/dzhon-gill-chast-3-nasledie/`

## Docs / contracts reviewed first

- `AGENTS.md`
- `docs/WORK_MODES.md`
- `docs/LANE_LOCK_POLICY.md`
- `migration/route-migration-matrix.json`
- `docs/SANDBOX-ENV-2026-06-21.md`
- `docs/refactor-2026/PILOT_IMPLEMENTATION_GILL_CONTEXT_2026-06-22.md`
- `docs/refactor-2026/PILOT_IMPLEMENTATION_GILL_SPRAVOCHNIK_2026-06-22.md`
- `docs/refactor-2026/lanes/gill-full-native-closeout-2026-06-23.md`
- `docs/refactor-2026/lanes/content-system-polish-2026-06-25.md`

## Verification performed

### Static / contract checks

Passed:
- `npm run migration:metadata:check`
- `npm run native:runtime:audit:strict`
- `npm run gill:context:visual-parity:audit`
- `npm run gill:spravochnik:visual-parity:audit`
- `npm run gill:pagefind:audit`
- `npm run validate:static-publication`

### Runtime / browser checks

Using Playwright against `dist` on local server:
- direct page opens for Hermeneutics + Gill routes
- console/pageerror capture
- interaction checks on theme / mobile TOC
- `npm run interactive-audit`

Result:
- `interactive-audit` FAILED with 29 issues
- core repeated runtime failure: `PAGE_ERROR: qs is not defined`

---

## Confirmed bugs

## 1. Shared JS runtime regression: `qs is not defined`

### Symptom

Browser runtime throws:

```txt
ReferenceError: qs is not defined
    at initTocPopups (js/floating-cluster-controller.js:375:21)
```

### Root cause

In `js/floating-cluster-controller.js`, the main IIFE is closed too early:

- helper functions `qs` / `qsa` are defined **inside** the IIFE
- functions `initTocPopups`, `initActionHandlers`, `initPlayExpand` are defined **after** `})();`
- those functions still call `qs` / `qsa`, but they are now out of scope

So the file is structurally split wrong, and runtime dies during `ready()` initialization.

### Exact file

- `js/floating-cluster-controller.js`

### Practical impact

This is not cosmetic. It breaks the controller on every route that loads it.

Confirmed affected routes in `dist`:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/dzhon-gill-istoricheskiy-kontekst/`
- `/articles/dzhon-gill-spravochnik/`
- `/articles/dzhon-gill-chast-1-chelovek/`
- `/articles/dzhon-gill-chast-2-uchenyi/`
- `/articles/dzhon-gill-chast-3-nasledie/`
- plus wider blast radius on 13 routes total (also Kod, 20 antisovetov, Nagornaya pages)

### Broken UI as a result

Confirmed by browser checks:
- floating theme toggle on Hermeneutics page does not switch theme
- Gill mobile TOC button `#mobTocBtn` does not open `#seriesTocOverlay`
- cluster/rail actions initialized by this controller are effectively dead

### Why CI missed it

`validate:static-publication` passed green because the relevant route audits are largely source/contract based.
The runtime failure is caught by browser interaction checks, not by the current static parity gates.

---

## 2. Hermeneutics Astro body has stray garbage text at the end

### Symptom

Built page contains literal stray text near the end of `<body>`:

```txt
76e7365">
```

This is visible in built output and appears in body text.

### Exact source

- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
- tail of file contains:

```txt
<script is:inline defer="" src="../../js/floating-cluster-controller.js?v=c78a4236"></script>
76e7365"></script>
```

### Production artifact evidence

- `dist/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html`
- fragment found in built HTML:

```txt
<script defer="" src="../../js/floating-cluster-controller.js?v=c78a4236"></script>
76e7365"> </body></html>
```

### Scope

This one is Hermeneutics-specific and appears introduced in the Astro component tail, not in the legacy source page.

---

## 3. Hermeneutics read-time mismatch inside pagefind meta

### Symptom

Hermeneutics route has inconsistent reading time values:

- visible byline: `⏱ 50 мин`
- `SITE_CONFIG.page.readingTime`: `50`
- `data/search-manifest.json`: `50`
- but page body still contains hidden pagefind meta:

```html
<span data-pagefind-meta="readTime" hidden="">35</span>
```

### Exact files

- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
- `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html`

### Impact

Search / indexing metadata for the page can drift from the visible canonical value.
This is an old inconsistency that survived into the strict-native route.

---

## 4. Interactive audit already confirms the runtime breakage

`npm run interactive-audit` produced 29 issues, including:

- `console-error /articles/dzhon-gill-istoricheskiy-kontekst/: ["PAGE_ERROR: qs is not defined"]`
- `console-error /articles/dzhon-gill-chast-1-chelovek/: ["PAGE_ERROR: qs is not defined"]`
- `console-error /articles/dzhon-gill-chast-2-uchenyi/: ["PAGE_ERROR: qs is not defined"]`
- `console-error /articles/dzhon-gill-chast-3-nasledie/: ["PAGE_ERROR: qs is not defined"]`
- `console-error /articles/dzhon-gill-spravochnik/: ["PAGE_ERROR: qs is not defined"]`
- `mobile-theme-page-error /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/: "qs is not defined"`
- `mobile-theme-control-not-visible /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

Important: some `gbs-* missing` findings for Gill context are partly audit-contract drift because this route now uses v16 marker names (`gbs-rail`, overlays) instead of the older `gbs2-*` expectations. But the `qs is not defined` runtime error is genuine.

---

## Priority assessment

### P0
1. `js/floating-cluster-controller.js` scope break (`qs/qsa` unavailable outside IIFE)

### P1
2. Hermeneutics stray tail garbage `76e7365"></script>`

### P1
3. Hermeneutics hidden pagefind read time `35` vs canonical `50`

---

## Short conclusion

The strict-native page contracts are mostly green on static checks, but the runtime layer is not healthy.

Main real bug:
- shared `floating-cluster-controller.js` is structurally broken and crashes on load

Hermeneutics-specific bugs:
- stray garbage text at end of built page
- stale hidden pagefind `readTime=35`

So yes: there are real bugs, and the most serious one is not in the SVG markup itself, but in the shared controller powering the premium controls on these pages.
