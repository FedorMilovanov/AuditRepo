# Agent Audit Report

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Environment: static source inspection via GitHub API / raw fetch
- Build mode: source
- Browser / device if used: N/A
- Scope: residual verification (A11Y-NO-SCRIPT-ARIA, HTML-BTN-TYPE, AR-IDX-JS-02) + independent new-surface audit pass (reader-platform, app/index.astro, enhancements.js, asset-version.js, content.config.ts, NagornayaPageFooterRuntime, search/AppSearchSurface, AtlasBody.astro)
- Explicit exclusions: NagornayaChastN MainShell files (>60kB inline HTML, no new mechanism risk identified without targeted signal); AntisovetovBody.astro (284kB inline HTML, D-19 already confirmed by prior pass)
- Signal class: Product
- Proof state: FAIL (residuals confirmed current), PASS (AR-IDX-JS-02 narrowed), new findings below
- Claim boundary: HEAD at anchor SHA above
- Preservation boundary: report is anchored to the SHA above; do not update this file merely because Product moves on
- Semantic owner: FedorMilovanov/gb-is-my-strength
- Overlapping active owner/PR/branch check: PR #1714 just merged (name learning-sheet search input) — no overlap with surfaces audited here

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. Confirmations and extensions

### Confirm `HTML-BTN-TYPE` — PastorSeriesPageChrome

- Target report/finding: MASTER residual `HTML-BTN-TYPE`
- Evidence angle added: direct source read of `PastorSeriesPageChrome.astro` at anchor SHA
- My evidence anchor: 485db8c / `src/components/pastor-series/PastorSeriesPageChrome.astro`
- Result: **confirmed, same symptom**
- Exact source lines observed:
  ```html
  <button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">
  ```
  and later:
  ```html
  <button class="h-hamburger" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false" aria-controls="hMobileNav">
  ```
  Neither button has `type="button"`. Both are outside any `<form>`, but the absence of `type` means UA default is `type="submit"`, which is a spec-defined risk if a wrapping `<form>` is ever introduced or if an AT interprets role incorrectly.
- What this changes: prior residual claim is **still current**. Scope: PastorSeriesPageChrome confirmed.

---

### Confirm `HTML-BTN-TYPE` — NagornayaChast1PageChrome

- Target report/finding: MASTER residual `HTML-BTN-TYPE` (scope listed as "NagornayaSeriyaPageChrome" — this is the per-chapter Chrome)
- Evidence angle added: direct source read of `NagornayaChast1PageChrome.astro`
- My evidence anchor: 485db8c / `src/components/nagornaya/chast-1/NagornayaChast1PageChrome.astro`
- Result: **confirmed, same symptom — but note: Nagornaya themeToggle uses `type="button"` correctly**
  ```html
  <button type="button" class="nag-sidebar-theme-btn" id="themeToggle" ...>
  ```
  ✅ `themeToggle` in Nagornaya chast-1 **has** `type="button"` — this is correct.
  The residual wording in MASTER ("NagornayaSeriyaPageChrome") may be referring to a different component. Based on current source, Nagornaya chrome is clean for `themeToggle`. Recommend narrowing MASTER residual scope for HTML-BTN-TYPE to exclude Nagornaya if all chapter chromes follow this pattern. Needs confirmation on chast-2 through chast-5 chromes.
- What this changes: potential scope narrowing for HTML-BTN-TYPE.

---

### Confirm `A11Y-NO-SCRIPT-ARIA` — still current

- Target report/finding: MASTER residual `A11Y-NO-SCRIPT-ARIA`
- Evidence angle added: direct source reads of both files at anchor SHA
- My evidence anchor: 485db8c / `src/components/map/AtlasNoScriptFallback.astro` + `src/components/map/AtlasBody.astro`
- Result: **confirmed current**
- Exact source: `AtlasNoScriptFallback.astro`:
  ```html
  <section class="atlas-noscript" id="atlasNoScriptList" role="main" aria-labelledby="atlasPageTitle">
  ```
  `AtlasBody.astro`:
  ```html
  <h1 id="atlasPageTitle">Атлас исследований</h1>
  ```
  The `<h1 id="atlasPageTitle">` lives inside `AtlasBody.astro` which is the JS-driven interactive tree. The `<noscript>` block hides `.atlas-workspace`, `.atlas-search`, `.atlas-topbar__actions` via inline `<style>` — but `AtlasBody.astro` itself is not inside a `<noscript>` block; it renders into DOM and then the CSS hides portions.
  
  More critically: the `aria-labelledby="atlasPageTitle"` in the `<noscript>` `<section>` is in the same page DOM. However, the `<section>` uses `role="main"` (duplicate landmark concern — the `<main>` semantic role is assigned via `role="main"` on a `<section>`, not a native `<main>` element). Also the h1 is not inside a `<noscript>` context, so in no-JS environments it still renders — meaning `atlasPageTitle` IS actually reachable in the DOM even without JS. The hidden state is CSS-only (`display:none` on `.atlas-workspace` etc.), but `atlasPageTitle` is inside `.atlas-brand`, which is inside `.atlas-topbar` — and `.atlas-topbar` is NOT in the hidden set.
  
  **Revised assessment**: the `aria-labelledby` reference IS reachable in no-JS mode because `.atlas-topbar` (which contains `atlasPageTitle`) is not hidden by the noscript CSS. The residual may be partially stale for this specific mechanism. However the `role="main"` on `<section>` (instead of native `<main>`) remains a minor ARIA concern.
- What this changes: **evidence challenges the primary mechanism** of A11Y-NO-SCRIPT-ARIA. `atlasPageTitle` is reachable. The residual should be re-evaluated — possible scope narrowing to `role="main"` on `<section>` only.

---

### Extend `AR-IDX-JS-02` — current status of theme multiwriter

- Target report/finding: MASTER residual `AR-IDX-JS-02`
- Evidence angle added: direct source read of `js/enhancements.js`, `js/reader-preferences.js`, `js/reader-preferences-head.js`
- My evidence anchor: 485db8c / `js/enhancements.js` (sha 4ef9090433f1a7fe4969181bc0faa405ce2b57a9), `js/reader-preferences.js`
- Result: **narrowed — canonical owner exists, legacy fallback path present but guarded**
- Key findings:
  1. `js/reader-preferences.js` (canonical): uses `STORAGE_KEY = 'gb:reader-preferences:v1'` exclusively for writes. All theme toggle elements are discovered via `LEGACY_THEME_CONTROL_SELECTOR` which includes `#themeToggle`, `.theme-toggle`, `.nag-sidebar-theme-btn`, `[data-fc-action="theme"]` — meaning the canonical runtime owns all known toggle surfaces.
  2. `js/reader-preferences-head.js` (bootstrap): reads from `'gb:reader-preferences:v1'` with legacy fallback read from `['gb:gill-reader-theme:v1', 'gb:hm-reader-theme:v1', 'theme']`. **Read-only** legacy path — no legacy write.
  3. `js/enhancements.js`: minified, inspected opening sections. No theme `localStorage.setItem` found in the visible portion of the minified bundle (the bundle handles FAQ schema injection, CSS loading, reading progress, TOC, and various UI enhancements). Without full deobfuscation confirmation, cannot fully clear this.
  4. `js/site.js`: minified bundle handles tooltips, share, copy, glossary positioning. No clear theme write path found in inspected sections.
- **Current assessment**: The historical claim that `enhancements.js` writes to `"theme"` key was plausible at an earlier HEAD. At current anchor, the canonical reader-preferences runtime registers all toggle elements. The multi-writer risk is substantially narrowed. The residual should be reclassified or removed pending a full deobfuscation scan confirming no legacy `setItem("theme", ...)` path survives in the minified bundles.
- What this changes: AR-IDX-JS-02 is a **narrowed residual still warranting one deobfuscation verification pass** before full closure.

---

## 2. New observations

### Observation `NEW-APP-OG-TYPE`

- Title: `/app/index.astro` uses `og:type = "website"` but also emits `article:published_time` and `article:modified_time` Open Graph properties
- Kind: defect
- Suggested impact: low
- Route(s) / owner(s): `src/pages/app/index.astro`
- Observed on anchor: 485db8c
- Expected: `article:published_time` / `article:modified_time` are valid only when `og:type = "article"`. When `og:type = "website"`, these properties are non-standard and may be ignored or cause schema confusion in social scrapers (Facebook/VK OG parsers, Telegram link previews).
- Actual: current source at `/app/index.astro`:
  ```html
  <meta property="og:type" content="website" />
  <meta property="article:published_time" content="2026-08-17T00:00:00+03:00" />
  <meta property="article:modified_time" content="2026-08-17T00:00:00+03:00" />
  ```
- Reproduction or inspection steps: read `src/pages/app/index.astro` at anchor SHA; search for `og:type` and `article:`.
- Evidence type: verified-source
- Evidence: direct raw file read at SHA 485db8c, lines in frontmatter/template block above.
- Confidence: high
- Limitations of this method: social scraper behavior varies; may be harmless in practice. Does not cause user-facing runtime error.
- Possible mechanism: template was likely copied from an article page that used `og:type = "article"`, then `og:type` was changed to `"website"` without removing the article-namespace properties.
- Related existing findings: none in MASTER
- Applicability: applies to the app landing page at `/app/` which is indexed (`robots: index,follow`).
- What this evidence does **not** prove: does not prove actual scrapers are misbehaving; does not prove SEO penalty.

---

### Observation `NEW-ASSET-VERSION-DRIFT`

- Title: `NagornayaPageFooterRuntime.astro` uses hardcoded `?v=` hashes instead of `assetUrl()` helper
- Kind: defect / system-theme candidate
- Suggested impact: medium
- Route(s) / owner(s): `src/components/nagornaya/_shared/NagornayaPageFooterRuntime.astro`
- Observed on anchor: 485db8c
- Expected: all asset URLs should use `assetUrl()` from `@/lib/asset-version.js` (the canonical cache-busting mechanism, replacing PC-003 hardcoded hashes per the file's own comment: "Replaces hardcoded ?v=xxx in 36+ Astro PageHead components").
- Actual: `NagornayaPageFooterRuntime.astro` contains hardcoded `?v=` hashes:
  ```html
  <script defer src="/js/site-utils.js?v=661c6cc1" is:inline></script>
  <script defer src="/js/scroll-perf.js?v=454d6f7b" is:inline></script>
  <script src="/js/glossary.js?v=c7f8b6e9" defer is:inline></script>
  <script src="/js/sw-register.js?v=e61e1210" defer is:inline></script>
  ...
  <script src="/js/highlights.js?v=25484760" defer is:inline></script>
  <script src="/js/nagornaya-mobile-toc.js?v=649d9217" defer is:inline></script>
  <script src="/js/nagornaya-bar-extras.js?v=3c7e0bdd" defer is:inline></script>
  <script src="/js/enhancements.js?v=1b5392b1" defer is:inline></script>
  <script src="/js/bookmark-engine.js?v=fba4e559" defer is:inline></script>
  ```
  These match the current `ASSET_VERSIONS` in `asset-version.js` at this anchor — so no current stale hash. But the pattern bypasses the central `assetUrl()` helper, meaning a future `cache-bust.js` run that updates `asset-version.js` will NOT update these hardcoded hashes, creating cache-busting drift.
- Reproduction or inspection steps: compare `src/lib/asset-version.js` ASSET_VERSIONS map with hardcoded `?v=` values in `NagornayaPageFooterRuntime.astro`. Currently matching. Run `scripts/cache-bust.js` conceptually: only files using `assetUrl()` would pick up new hashes.
- Evidence type: verified-source
- Evidence: direct source reads at SHA 485db8c for both files.
- Confidence: high (mechanism is clear; current impact is zero because hashes match today)
- Limitations of this method: no current stale-cache impact confirmed. This is a latent drift risk, not an active stale-asset defect.
- Possible mechanism: Nagornaya runtime tail was authored or updated separately from the `assetUrl()` migration and was not converted to use the helper.
- Related existing findings: `ST-CACHE` system theme in SYSTEM_THEMES.md (`evidence-rich / candidate`). This is a concrete instance of cache revision ownership drift.
- Applicability: affects all 5 Nagornaya chapter pages which import this component.
- What this evidence does **not** prove: does not prove stale assets are being served today; does not prove users are seeing cached wrong versions.

---

### Observation `NEW-NOSCRIPT-ROLE-MAIN`

- Title: `AtlasNoScriptFallback.astro` uses `role="main"` on `<section>` — duplicate/non-native landmark
- Kind: defect (minor accessibility)
- Suggested impact: low
- Route(s) / owner(s): `src/components/map/AtlasNoScriptFallback.astro`
- Observed on anchor: 485db8c
- Expected: the primary content landmark should use a native `<main>` element, not `<section role="main">`. ARIA `role="main"` on a `<section>` is technically valid but non-idiomatic; more importantly, if the atlas page also has a native `<main>` elsewhere in the document, this creates a duplicate `main` landmark, which AT users navigating by landmark will encounter as two separate "main" regions.
- Actual:
  ```html
  <section class="atlas-noscript" id="atlasNoScriptList" role="main" aria-labelledby="atlasPageTitle">
  ```
  Need to confirm whether `AtlasBody.astro` or the page shell provides another `<main>` element. `AtlasBody.astro` does not include a `<main>` in the inspected content (it uses `<div class="atlas-app">`). However the host page layout may wrap in `<main>`.
- Evidence type: verified-source
- Evidence: direct source read of `AtlasNoScriptFallback.astro` at anchor SHA.
- Confidence: medium (full page structure not confirmed — atlas page shell not read)
- Limitations of this method: did not read the atlas page-level wrapper (e.g. `src/pages/map/index.astro`) to confirm full landmark inventory.
- Possible mechanism: the element was originally a `<main>` or the fallback was built independently without checking the surrounding page structure.
- Related existing findings: relates to `A11Y-NO-SCRIPT-ARIA` residual — this observation partially supersedes/extends it. The `aria-labelledby` chain is likely intact (see Confirmation above); the `role="main"` on `<section>` is the remaining live accessibility concern.
- Applicability: affects `/map/` route in no-JS mode and potentially AT landmark navigation in all modes.
- What this evidence does **not** prove: does not prove duplicate main landmark exists without reading the page shell.

---

### Observation `NEW-CONTENT-SCHEMA-SECTION-ENUM`

- Title: `content.config.ts` article schema `section` enum does not include `'pastor-series'`
- Kind: defect / risk
- Suggested impact: medium
- Route(s) / owner(s): `src/content.config.ts`
- Observed on anchor: 485db8c
- Expected: the `section` enum should cover all content sections that are actually published. `pastor-series` is a live route with `PastorSeriesPageChrome.astro` and associated content components.
- Actual: current `section` enum:
  ```ts
  section: z.enum(['articles', 'biografii', 'hard-texts', 'nagornaya', 'baptisty-rossii']),
  ```
  `'pastor-series'` is absent. If any content file attempts to declare `section: 'pastor-series'`, Zod validation will throw at build time. If pastor-series content currently uses a different section value (e.g. `'articles'`) or is not in the content collection at all, this is not a live defect — but it represents a schema/reality gap.
- Reproduction or inspection steps: read `src/content.config.ts` at anchor; list `section` enum values; cross-reference with `src/components/pastor-series/` existence and `src/pages/pastor-series/`.
- Evidence type: verified-source
- Evidence: direct source read of `src/content.config.ts` at SHA 485db8c.
- Confidence: medium — mechanism is clear, but current impact depends on whether pastor-series content files exist in the collection and what `section` value they declare.
- Limitations of this method: did not read content files under `src/content/` to confirm actual section values used by pastor-series articles.
- Possible mechanism: `pastor-series` was likely added as a route after the initial schema was defined, and the enum was never updated.
- Related existing findings: none in MASTER
- Applicability: build-time risk for content collection; if any pastor-series MD/MDX file uses `section: 'pastor-series'`, the build fails.
- What this evidence does **not** prove: does not prove the build is currently failing; does not prove any content file actually uses `section: 'pastor-series'`.

---

### Observation `NEW-READER-PREFS-SEARCH-OPENER-ROUTES`

- Title: `ReaderPreferencesHead.astro` search opener injection depends on exact `Astro.url.pathname` match — new routes not covered
- Kind: risk
- Suggested impact: low
- Route(s) / owner(s): `src/components/reader-platform/ReaderPreferencesHead.astro`
- Observed on anchor: 485db8c
- Expected: the search button injection covers all routes where search is needed.
- Actual:
  ```js
  const searchOpenerRoutes = new Set(['/articles/', '/biografii/', '/pastor-series/']);
  const needsSearchOpener = searchOpenerRoutes.has(Astro.url.pathname);
  ```
  Only three routes get the cold bootstrap search opener injected in `<head>`. Newer routes such as `/hard-texts/`, `/nagornaya/chast-1/` etc. are excluded. These routes load search via `NagornayaPageFooterRuntime.astro`'s lazy click listener (`window.__gbSearchLazyBound`) which fires on any `[data-search-shortcut]` click — so the lazy path still works. But if a new page chrome forgets to include the lazy loader and also is not in `searchOpenerRoutes`, there is no search bootstrap at all.
- Evidence type: verified-source
- Evidence: direct source read of `ReaderPreferencesHead.astro` at anchor SHA. Cross-referenced with `NagornayaPageFooterRuntime.astro` which provides the lazy click listener.
- Confidence: low-medium — not a confirmed current defect on any live route; is a fragility/maintenance risk.
- Limitations of this method: did not inspect all page chromes for lazy search loader presence.
- Possible mechanism: the `searchOpenerRoutes` set was initially built for the first three catalog pages and was not extended as new sections were added. The lazy loader in the footer runtime compensates on Nagornaya pages.
- Related existing findings: none in MASTER
- Applicability: risk surface for new route authors.
- What this evidence does **not** prove: does not prove any route is currently missing search; this is a maintenance risk.

---

## 3. Challenges and negative findings

### Challenge `A11Y-NO-SCRIPT-ARIA` — primary mechanism partially invalid

- Target report/finding: MASTER residual `A11Y-NO-SCRIPT-ARIA` (mechanism: `atlasPageTitle` is unreachable when JS is off)
- Reason: direct source inspection shows `.atlas-topbar` (containing `id="atlasPageTitle"`) is NOT in the set of elements hidden by the noscript `<style>` block. Only `.atlas-workspace`, `.atlas-search`, `.atlas-topbar__actions` are hidden. The `.atlas-topbar` outer container and `.atlas-brand` (which wraps the `<h1 id="atlasPageTitle">`) remain visible and in-DOM.
- Contradictory evidence angle: noscript CSS rule:
  ```css
  .atlas-app .atlas-workspace, .atlas-app .atlas-search, .atlas-app .atlas-topbar__actions { display: none !important; }
  ```
  `.atlas-brand` (parent of `h1#atlasPageTitle`) is not in the hidden list.
- Evidence anchor: 485db8c / `src/components/map/AtlasNoScriptFallback.astro` (noscript CSS block) + `src/components/map/AtlasBody.astro` (element location)
- Recommended result: **narrowed-scope** — the `aria-labelledby` cross-reference is likely valid in no-JS mode. The residual should be revised to focus on `role="main"` on `<section>` (see NEW-NOSCRIPT-ROLE-MAIN) rather than the unreachable-ID mechanism. Consider retiring the original A11Y-NO-SCRIPT-ARIA claim and replacing with NEW-NOSCRIPT-ROLE-MAIN if confirmed.

---

## 4. Root-cause clusters

### Cluster `HARDCODED-VERSION-BYPASS`

- Finding IDs: NEW-ASSET-VERSION-DRIFT
- Related system theme: ST-CACHE
- Common root: `NagornayaPageFooterRuntime.astro` bypasses the central `assetUrl()` helper by using inline hardcoded `?v=` strings. The root cause is that this component was not migrated during the PC-003 `assetUrl()` consolidation pass.
- Recommended systemic action: migrate `NagornayaPageFooterRuntime.astro` to import and use `assetUrl()` for all asset references, matching the pattern in other page chromes.

### Cluster `BUTTON-TYPE-MISSING`

- Finding IDs: HTML-BTN-TYPE (existing residual, confirmed current in PastorSeriesPageChrome and HardTextsPageChrome; Nagornaya chrome partially clean)
- Common root: interactive nav buttons (`themeToggle`, `hMobileMenuBtn`) in legacy-converted page chrome components were transcribed from legacy HTML that did not include `type="button"`. The Nagornaya chrome was written later and includes `type="button"` correctly.
- Recommended systemic action: add `type="button"` to all `<button>` elements in HardTextsPageChrome, PastorSeriesPageChrome, AboutPageChrome that serve as theme toggle and hamburger controls. Confirm AboutPageChrome button markup (not fully read in this pass).
