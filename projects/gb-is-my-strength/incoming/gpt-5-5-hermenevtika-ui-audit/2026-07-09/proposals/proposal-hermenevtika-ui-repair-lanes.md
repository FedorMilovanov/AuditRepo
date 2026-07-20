# Proposal — Hermeneutics UI repair lanes

- Proposal status: `proposal-open`
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Audited source SHA: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`
- Related candidates: `HERM-UI-001` through `HERM-UI-010`
- Rule: no implementation before current-head verifier promotion and lane ownership check

## Lane A — route-local repair

### Proposed branch

`lane/hermenevtika-ui-popover-mobile-shell-2026-07-09`

### Route

`/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

### Primary findings

- `HERM-UI-001` — nested active Scripture buttons inside footnote popovers;
- `HERM-UI-002` — exact 1200 px responsive dead zone;
- `HERM-UI-003` — mobile TOC modal focus lifecycle and duplicate search state;
- `HERM-UI-004` — unsafe direct scroll-lock mutation;
- `HERM-UI-005` — reading progress scoped to document rather than article;
- `HERM-UI-006` — sheet entry/exit transition lifecycle;
- `HERM-UI-007` — invalid list child;
- `HERM-UI-008` — stale component comments;
- `HERM-UI-010` — route feature-flag ambiguity, if verifier confirms intended semantics.

### Files allowed

- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
- `src/components/article-pilots/hermenevtika/HermenevtikaRail.astro`
- `src/components/article-pilots/hermenevtika/HermenevtikaMobileBar.astro`
- `src/components/article-pilots/hermenevtika/HermenevtikaPageHead.astro` only for truthful route-local configuration/comments; do not change editorial dates without owner/editorial decision
- existing route-specific audit/test files, if present and not shared-owner locked
- lane report under `docs/refactor-2026/lanes/`

### Files forbidden

- `js/site.js`
- `js/site-utils.js`
- `js/floating-cluster-controller.js`
- `css/site.css`
- `css/floating-cluster.css`
- `data/verses.json`
- `data/bible/**`
- `data/glossary.json`
- Gill/Nagornaya/Heart routes and components
- `AGENTS.md`
- package/workflow files

### Preferred implementation order

1. Convert every `.fn-marker .tooltip .bref[data-ref]` in the native Astro body to static citation text while preserving typography and punctuation.
2. Add a route regression predicate that forbids interactive descendants in footnote tooltip content.
3. Normalize the responsive boundary so either desktop or mobile controls are present at 1200 px.
4. Rebuild the mobile TOC sheet lifecycle: named scroll lock, focus entry/trap/return, inert background, coherent search state, transition-safe mounting.
5. Scope progress and time-left to explicit article start/end anchors.
6. Move the decorative rail track outside the `<ul>` or implement it as a pseudo-element.
7. Update stale comments without changing visual behavior.
8. Resolve `footnotes.enabled` semantics after checking whether it refers to this custom footnote subsystem.

### Acceptance gates

Fast loop:

```bash
git diff --check
npm run data:consistency
npm run migration:metadata:check
npm run native:runtime:audit:strict
npm run guard:shared-files
```

Targeted source assertions:

```js
assert(document.querySelectorAll('.fn-marker .tooltip .bref[data-ref]').length === 0)
assert(document.querySelectorAll('.fn-marker .tooltip button, .fn-marker .tooltip a, .fn-marker .tooltip [tabindex], .fn-marker .tooltip [role="button"]').length === 0)
```

Required browser matrix:

- 1199 / 1200 / 1201 / 1366 CSS px;
- 320 / 360 / 390 / 768 px touch emulation;
- Chrome + Firefox + Safari/WebKit-equivalent;
- pointer movement over footnotes 40, 72, 75, 82, 83 and 107;
- keyboard Tab/Shift+Tab/Escape through the TOC dialog;
- nested overlay scroll-lock order;
- article progress reaches 100% at the article end, before related content.

Final barrier before merge:

```bash
npm run validate:static-publication
npm run guard:shared-files
```

## Lane B — optional SYSTEM regression guard

### Proposed branch

`lane/system-tooltip-footnote-nesting-guard-2026-07-09`

### When to open

Only after Lane A or an independent verifier establishes whether the nesting pattern exists outside this route. Lane B is not required for the preferred route-local repair.

### Scope

- add an assertion to an **existing** audit script that rejects active Bible/glossary tooltip triggers nested inside footnote tooltip content;
- optionally add a defensive selector exclusion in shared tooltip initialization only if cross-route evidence shows malformed source can recur and the guard alone is insufficient;
- preserve normal Bible references in article prose and FAQ.

### Files allowed after SYSTEM declaration

- the selected existing audit script;
- `js/site.js` / `js/site-utils.js` only if separately justified by cross-route evidence;
- cache-bust outputs required by project policy;
- system lane report.

### Files forbidden

- Hermeneutics editorial body changes;
- Bible/glossary data changes;
- unrelated UI redesign;
- Gill in-flight work.

### Required checks

```bash
git diff --check
npm run guard:shared-files
npm run workflows:check
npm run migration:metadata:check
npm run native:runtime:audit:strict
npm run validate:static-publication
```

## Separate owner/editorial decision — HERM-UI-009

The visible `Обн. 9 мая 2026` and machine modification metadata must be reconciled against the actual editorial changelog. A UI lane must not guess the date or advance freshness merely because controls/CSS changed. Handle this either:

- in the route lane after an explicit owner/editorial decision, or
- in a separate metadata truth lane.

## What must not be merged into one pass

- route-local semantic cleanup and shared tooltip-controller refactor;
- UI repair and Bible verse-data editing;
- Hermeneutics repair and current Gill PR work;
- technical repair and unapproved editorial date changes.