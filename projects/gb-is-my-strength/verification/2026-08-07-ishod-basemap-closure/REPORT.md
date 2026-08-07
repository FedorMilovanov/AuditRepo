# Ishod basemap closure — MAP-P1-10 + BASE-P1-01 — 2026-08-07

## Scope

- AuditRepo base: `a4c6581a598fa4ccf8d1b2c0376fb4db03d60537`.
- Product repair PR: `FedorMilovanov/gb-is-my-strength#1149`.
- Product final current-main base used for merge authorization: `c5627043c99a820b8acbc1e9bc711a09794e914c`.
- Product final exact repair head: `2d82dc6f0ed26ed2c843c532beefa7365f7c4bbf`.
- Product squash merge: `c42d0d585133e8fea8dfdd43bec851740eedc9e8`.
- Product mutation surface: exactly 4 files.
- Work units closed: `MAP-P1-10` and its implementation dependency `BASE-P1-01`.

## Re-verified current root

Before mutation, current Product source still had the exact public defect:

- canonical `src/components/karty/ishod/IshodMap.astro` called `MapEngine.createMap(...)` without `baseGeoUrl`;
- `karty/_engine/map-engine.js` mounted `#me-base-geo` only when `opts.baseGeoUrl` was supplied;
- therefore the strict-native public Ishod route rendered route/stage/marker information without a geographic base layer.

The historical shared candidate `karty/_engine/base-geo.svg` was also re-read. It remained unsafe to wire directly: its `<defs>` was empty while its body referenced multiple missing gradients, filters, patterns and symbols. The repair did **not** declare that shared asset healthy and did not mutate it.

Current `karty/avraam/base.svg` was the existing self-contained atlas geography source. It carried no `data-place` route-marker layer. MapEngine's loader imports the source SVG's child nodes into its own `#me-base-geo`; it does not import the outer SVG aria label.

## Product repair

PR #1149 kept the large shared owners untouched and made the public dependency explicit:

1. Added route-owned `karty/ishod/base.svg` with Ishod semantics. The small wrapper embeds `/karty/avraam/base.svg` as the existing self-contained geographic atlas source. Ishod route markers, stages and Pihahiroth uncertainty remain owned by Ishod data/runtime.
2. Updated only the tiny canonical route `src/pages/karty/ishod/index.astro` with a one-shot adapter. After `IshodMap` loads `window.MapEngine` but before its `DOMContentLoaded` initialization runs, the adapter supplies `baseGeoUrl: 'base.svg'` to the first `#stage` map creation and immediately restores the original `MapEngine.createMap`.
3. Added `scripts/ishod-basemap-browser-test.mjs` and wired it into the already existing `scripts/route-semantics-browser-test.mjs` owner. No new workflow was invented.

No `MapEngine`, `route.json`, `IshodMap`, shared CSS or shared historical base-geo asset was changed.

Final Product diff:

- `karty/ishod/base.svg` — added;
- `src/pages/karty/ishod/index.astro` — +15 route adapter lines;
- `scripts/ishod-basemap-browser-test.mjs` — added targeted browser contract;
- `scripts/route-semantics-browser-test.mjs` — existing-owner wiring only.

## Exact browser proof

The targeted browser contract runs against production-like `dist` through the existing Route Registry Chromium route-semantics step. It requires both network and rendered-state evidence rather than treating a successful build as a basemap proof.

On final exact Product head `2d82dc6f0ed26ed2c843c532beefa7365f7c4bbf`, the direct GitHub Actions log reported all assertions successful:

- Ishod route HTTP 200;
- `#stage[data-map-state="ready"]` reached;
- `/karty/ishod/base.svg` fetched with HTTP 200;
- nested `/karty/avraam/base.svg` fetched with HTTP 200;
- `#me-base-geo` mounted;
- mounted geography pointed to `/karty/avraam/base.svg`;
- mounted image had nonzero rendered geometry;
- Pihahiroth remained `UNRESOLVED`;
- exactly three Pihahiroth uncertainty corridors remained;
- the historical single Pihahiroth point remained hidden/non-authoritative;
- page errors: 0;
- console errors: 0;
- final line: `Ishod basemap browser contract passed`.

The same browser job also reported:

- public browser matrix: `3831/3831 PASS` across 83 routes;
- route semantics: `1040/1040 passed`;
- Nagornaya epistemic UI: `384/384 PASS`;
- map runtime fallback: Ishod normal render reached `ready`, canvas present, page errors empty.

Route Registry evidence artifact:

- run: `31172412155`;
- artifact ID: `8991718551`;
- artifact SHA-256: `e554ebfcddad065e528a537f8a1541f91e58ffc1fddfc73c084ff46aa920c160`.

## Exact merge boundary and refresh discipline

The first complete repair head `61060d0f14f41c320b97676f89d0df936f5ef124` had already passed the same 11-group matrix and the same targeted browser assertions. During that CI window Product main advanced through two path-disjoint changes: reader regression evidence (#1147) and Home marginalia (#1150).

The repair branch was therefore **not** merged on stale green evidence. It was refreshed with an ordinary two-parent merge, without force, onto current main `c5627043...`. The refreshed exact head was `2d82dc6f...`; compare showed `behind_by=0`, merge-base equal to current main and the same four-file repair diff.

Final exact head `2d82dc6f...` then passed all 11 registered workflow groups:

- Metadata & IndexNow Readiness;
- Glossary Contract;
- Shared Files Guard;
- Scripture Occurrence Index Contract;
- Search Manifest Policy;
- Deploy Candidate Contract;
- Editorial Dateline Contract;
- Native Source Contract;
- Search Modal Contract;
- Visual Parity Guard — pixel-diff;
- Route Registry Validators, including Chromium and WebKit public-surface jobs.

PR review boundary at merge:

- comments: 0;
- review threads: 0;
- submitted reviews: 0;
- mergeable: true;
- `behind_by=0`;
- exact head unchanged.

The PR was squash-merged with `expected_head_sha=2d82dc6f...`, producing Product `c42d0d585133e8fea8dfdd43bec851740eedc9e8`.

Post-merge compare `c5627043... -> c42d0d58...` is exactly one commit and exactly the same four files. No concurrent Product merge entered between final green authorization and squash merge.

## Disposition

### `MAP-P1-10`

Disposition: `closed-by-fix`.

The public strict-native Ishod route now supplies a proven geographic basemap and the route reaches ready state with rendered `#me-base-geo`.

### `BASE-P1-01`

Disposition: `closed-by-replacement`.

The requirement explicitly allowed either repairing the broken shared asset **or replacing it with an explicitly owned equivalent**. #1149 chose the latter: `karty/ishod/base.svg` is route-owned and its real nested geography/network/render behavior is browser-proven.

The historical `karty/_engine/base-geo.svg` is **not** claimed repaired. It simply no longer blocks or owns the public Ishod basemap dependency. Any future cleanup of that historical asset requires a new current-consumer proof; do not revive `BASE-P1-01` merely because the old file remains broken.

MASTER delta for this closure wave:

- active work units: `25 -> 23`;
- direct current defects: `14 -> 13`;
- verified necessary improvements: `5 -> 4`;
- system lanes: `2` unchanged;
- owner decisions: `4` unchanged.

## Next boundary

A compact remaining Karty root is `MAP-P1-11`: scale-bar geometry still needs current-source re-verification before mutation. `NG-INLINE-01` also remains current, but its very large MainShell cannot be safely whole-file rewritten through the present connector and should not be risked merely to preserve sequence.
