# CURRENT HEAD REVERIFY — 2026-07-21 — `1f80f12`

## Scope

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source branch: `main`
- Exact source HEAD: `1f80f12d8bea9a9eb2c196ed030ddfc5be3924df`
- Previous AuditRepo baseline: `32ae0d7d62bee81737a9aae1f136946d047fe4fb`
- Verification method: current source reads, pull-request diffs, GitHub Actions jobs and full production-like publication barriers.

## Executive status

The old 2026-07-20 stop-point is no longer current truth. The oversized atlas-export PNG gate was fixed in source PR #94, then runtime-integrity PR #95 and shared map-engine P0 PR #96 landed on `main`.

At PR #96 exact head, all required source/release barriers passed:

- `npm run validate:static-publication` — green;
- `npm run guard:shared-files` — green;
- Shared Files Guard — runtime integrity, map P0 regression guard, strict system policy and actionlint green;
- Native Source Contract — effective matrix, import graph, Astro check, production-like dist, native article/series validation, migration metadata, workflow policy and clean tracked tree green.

Post-merge deployment of exact SHA `1f80f12` has not yet been independently resolved through the available connector. Therefore this reverify records **release gates green / exact deployed SHA proof pending**, not a guessed production-green claim.

## Landed source transactions

### PR #94 — release unblock

Commit before subsequent work: `56b1aee07b9948dfe2bcaa28d1ae2e24dd7739a8`.

- registered the two intentional large atlas-export PNG files in the publication audit;
- fixed Hermenevtika TypeScript errors;
- reported `astro:build` and `validate:static-publication` green.

The old `shvatim-hires.png` / `shvatim-preview.png` blocker is historical and must not remain the next-agent priority.

### PR #95 — shared runtime integrity

Main commit: `779c23c1d705c9561248a641eedc5c2373511e97`.

- coordinated scroll-lock ownership across simultaneous overlays;
- deduplicated saved quotations and cleaned historical duplicates;
- synchronized initial/open `aria-hidden` and `inert` state for the quotation dialog;
- added a permanent dependency-free runtime regression harness.

### PR #96 — map runtime P0s + cache-bust release repair

Main commit: `1f80f12d8bea9a9eb2c196ed030ddfc5be3924df`.

Closed current-source defects:

- `MAP-P0-02`: Share no longer calls an undefined `getState()`;
- `MAP-P0-03`: delayed search highlight no longer reads an out-of-scope `inStory`; clearing search restores story opacity instead of erasing it;
- `MAP-P0-08`: zoom `+` / `−` support click, keyboard/programmatic activation and press-and-hold;
- `ASTRO-P0-01`: stage-path grouping no longer crashes on undefined buckets;
- `ASTRO-P0-02`: stage-less/out-of-range places are rejected before `stagePaths[p.stage].push()`.

The full publication barrier also exposed a separate release regression introduced when `site-utils.js` changed in PR #95: 38 HTML/Astro references still carried the old asset revision. The canonical `scripts/cache-bust.js --write` flow synchronized them to `site-utils.js?v=5ed472a0`; the subsequent full publication barrier passed.

Permanent guard added: `scripts/map-engine-p0-regression-test.js`, executed by `Shared Files Guard` together with `node --check karty/_engine/map-engine.js`.

## Remaining P0 truth

Do not reopen the five fixed rows above without a fresh browser/source witness on `1f80f12` or newer.

Still open and requiring dedicated lanes:

1. `MAP-P0-04` + `MAP-P0-05` — initial viewport/deep-link transaction:
   - unconditional first-place `flyTo` overwrites `meta.viewport_init`;
   - Share writes query parameters while the loader reads hash only;
   - deep-linked story does not fully synchronize story chips/markers;
   - delayed saved state may overwrite explicit URL intent.
2. `MAP-P0-06` — layer toggles use exact `data-layer` matching although rendered elements carry compound layer tokens.
3. `MAP-P0-07` — theme toggle changes CSS variables while most map/SVG colors remain hardcoded.
4. `MAP-P0-01` — mobile panel can escape above the viewport.
5. `ASTRO-P0-03` / `ASTRO-P0-04` — warning-only data validation and conflicting Avraam public counters.
6. `ASTRO-P0-05` / `ASTRO-P0-06` — user-visible error/fallback behavior on initialization or JavaScript failure.
7. `DATA-P0-01` — browser engine ignores authored curved `stages[].paths` and reconstructs straight route segments.
8. `PROD-STALE-DEPLOY-RED` remains open only until an exact deployed-SHA witness is recorded.

## Next repair order

1. One SYSTEM map-engine lane for `MAP-P0-04` + `MAP-P0-05`, with URL precedence tests (`explicit URL > saved state > viewport_init`) and complete story UI synchronization.
2. Separate map-engine lane for `MAP-P0-06` + `MAP-P0-07`; do not combine with visual cartography redesign.
3. Mobile layout lane for `MAP-P0-01` with browser viewport witnesses.
4. Data/validation lane for `ASTRO-P0-03` / `ASTRO-P0-04`.
5. Error-boundary/fallback lane for `ASTRO-P0-05` / `ASTRO-P0-06`.
6. Route geometry lane for `DATA-P0-01`, preserving the owner’s parchment/geographic-map paradigm.

## Guardrails retained

- Do not touch PremiumControls / Floating Cluster / Gill visual freeze without its owner lane.
- Do not edit glossary/Bible-tooltip owner data as collateral work.
- Do not merge old AuditRepo prototype branches wholesale; their useful evidence is already preserved and current source is ahead.
- Do not weaken publication thresholds or remove regression assertions to obtain green CI.
