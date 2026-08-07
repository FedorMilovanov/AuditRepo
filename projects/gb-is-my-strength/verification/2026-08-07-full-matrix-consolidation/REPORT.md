# Full matrix consolidation — 2026-08-07

## Scope

- AuditRepo base at wave start: `265ab79cfd83ba805c385846b560878fb5593543`.
- Product current-check anchor: `9a0db0dc4533cb473abfe57f86e27517f04deea6`.
- Product mutation: none.
- Production/live claim: none.
- Historical input: pre-cleanup `verified/MASTER_BUG_MATRIX.md`, 145 rows labelled open.
- Goal: make MASTER a compact working notebook of verified necessary work, not a lifetime history.

The Product anchor advanced during the wave. Comparison from earlier `77b15181cf0aed3b1df35637492e8c7f9e905b0c` to current `9a0db0dc4533cb473abfe57f86e27517f04deea6` changed Reader/Home/search-index surfaces but did **not** change `karty/_engine/map-engine.js` or the Karty route files used here. Current MapEngine remains blob `eaf85cd58ac8381d7d9b3fe6d9745b8ea89e8496`.

## Governance result

```text
raw evidence
→ current verification / re-verification
→ enough witnesses for the risk
→ verified necessary current work in MASTER
→ implementation / owner decision
→ result verification
→ remove from MASTER
→ legacy for useful retirement context
```

MASTER may contain defects, necessary implementations/improvements, bounded system work, required migration/retirement, residuals and owner decisions. Optional/speculative work belongs outside MASTER. A holding/future route is not allowed to inflate the **public runtime defect** count merely because an unfinished route JSON exists.

## Current MASTER result

Current active work is **25 work units**:

- **12** current public/source defects;
- **2** verified necessary improvements;
- **0** narrowed residuals;
- **7** bounded system verification / implementation packages;
- **4** owner decisions.

Closed/stale/duplicate/absorbed/inert rows are absent from active MASTER. Retirement mapping is `../../legacy/MATRIX_CLEANUP_2026-08-07.md`; the full pre-cleanup matrix remains recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`.

## Publication boundary discovered during Karty re-verification

A major correction in this wave was distinguishing **existing route data** from **current public interactive ownership**.

Current canonical sources:

- `/karty/avraam/` — strict-native interactive map (`src/pages/karty/avraam/index.astro` → `AvraamMap.astro`);
- `/karty/ishod/` — strict-native interactive map (`src/pages/karty/ishod/index.astro` → `IshodMap.astro`);
- `/karty/shoftim/` — `KartyHoldingPage`, explicitly “временно на визуальном аудите”;
- `/karty/early-church/` — `KartyHoldingPage`, explicitly “временно на визуальном аудите”;
- `/karty/shvatim/` — `KartyHoldingPage`, explicitly “временно на визуальном аудите”.

Therefore:

- Shoftim's six-stage route-data assignment defect (`MAP-P1-03`) is real source debt but not a current public interactive defect;
- Early Church's exact marker-coordinate overlap (`MAP-P1-07`) is real route readiness debt but not current public interaction failure;
- Shvatim's 13 unused tribal-region polygons (`REG-P1-01`) are real publication/readiness data ownership but not a current public runtime capability gap;
- signature-offset problems are not public on Avraam/Ishod because neither active route currently owns `route.signature`;
- these facts are owned by one `SYS-KARTY-DATA-PROJECTION` package instead of separate direct rows.

This also corrected a temporary consolidation mistake: `MAP-P1-03` is the **Shoftim / Judges** six-stage issue, not Shvatim's three `north/south/transjordan` groups.

## Current direct defects

### Shared / Search

- `S-SEC-01` — current `js/enhancements.js` still uses a fixed blacklist/attribute-stripping HTML sanitizer design.
- `AR-IDX-09` — current global Search shortcut does not reject Alt/Shift-modified Ctrl/Command+K.

### Public Karty strict-native surfaces

- `MAP-P1-01` — MapEngine tour computes actual `sid` but caption/stage highlight use `tourStepIdx`; non-zero story stage IDs can therefore display/highlight the wrong stage. This remains reachable through the current Space/API tour path.
- `MAP-P1-10` — canonical Ishod calls `MapEngine.createMap()` without `baseGeoUrl`; current MapEngine loads `#me-base-geo` only when that option is supplied. Public Ishod therefore lacks a geographic base layer. A naive fix must not simply point at the shared asset: current `karty/_engine/base-geo.svg` has an empty `<defs>` while referencing `#landG`, `#seaG`, `#soft`, `#hill`, `#peak`, `#peak-snow` and other external IDs, so shared-basemap readiness stays coordinated in the data package.
- `MAP-P1-11` — scale bar still derives screen scale from `cfg.W0 / view.w` rather than actual rendered canvas width.
- `MAP-P1-18` — single-photo full-source opening is fixed, but multi-photo gallery images still lack full-source/index binding; delegated modal open receives the thumbnail and never initializes `photoCurrentPlace/photoCurrentIdx`, so modal swipe cannot advance the gallery.
- `WAYP-P1-01` — current verified-waypoint labels use `font-size="7"` map units, opacity `.4`, no screen anchor and no background. Avraam main viewport width 1950 and mobile viewport width 640 resolve those labels to only a few CSS pixels, making the archaeological waypoint names effectively unreadable.
- `ENGINE-P1-26` — search can brighten a matching out-of-story marker while marker interactivity is gated by `inStory`, producing a visible result the user cannot open under the selected story.
- `ENGINE-P2-03` — canonical route data are fetched/resolved before `createMap()`, yet MapEngine still adds a loading overlay and hides the already-available map for a fixed ~600ms on every initialization.
- `ENGINE-P2-04` — story/toast notifications still have no canonical `role=status` / live-region owner.
- `MAP-P1-13` — CSS reduced-motion disables CSS transitions/animations, but `flyTo()` still unconditionally runs duration-based requestAnimationFrame viewBox motion.
- `MAP-P1-20` — canonical Ishod loads `../_engine/map-engine.js` without revision; current SW static-asset ownership serves unversioned `.js` cache-first.

## Verified necessary improvements

- `SEARCH-P3-02` — add truthful total/continuation instead of exposing only Pagefind 10 / fallback 12 matches with no way to reach the rest.
- `AR-IDX-05` — consolidate Home/shared cache-version identity so numeric `SITE_CONFIG.version` and explicit asset `?v=` revisions are not parallel manual authorities.

`MINI-P1-01` was removed from MASTER in this pass: neither active strict-native map enables `showMinimap`, so redesigning the dormant component is future/optional work rather than current necessary Product work.

## Karty runtime package after current-source reduction

`SYS-KARTY-RUNTIME-GEOMETRY` now contains only three unclassified historical candidates:

- `DRAW-P1-01` — legacy label-collision fallback quality under current screen-anchored rendering;
- `PERF-P1-01` — current Avraam `base.svg` still has indefinite 14-second `feTurbulence` water animation, but the old 15–20 fps claim needs a current browser/performance witness before promotion;
- `QUAL-P2-04` — `renderMarkers()` rebuild/GC cost remains source-visible but needs material current runtime impact before it becomes an independent defect.

A large set of old runtime P1/P2 rows was removed from this package because the canonical implementation changed or the old causal statement was invalid:

- `MAP-P1-02`, `MAP-P1-04`, `MAP-P1-05`, `MAP-P1-08`, `MAP-P1-09`, `MAP-P1-12`, `MAP-P1-19`;
- `AVRAAM-P1-01`, `AVRAAM-P1-02`, `AVRAAM-P1-03`, `AVRAAM-P1-05`, `ASTRO-P1-01`, `ASTRO-P1-05`, `AVRAAM-P2-01`, `MAP-P2-02`;
- `DATA-P1-04`, `ENGINE-P1-27`, `ENGINE-P1-29`, `QUAL-P1-01`, `QUAL-P1-05`, `QUAL-P1-06`, `TEXT-P1-01`, `UI-P1-01`, `LOD-P1-01`.

Key reasons include: the old cinematic Avraam app is no longer canonical; Avraam now has explicit desktop/mobile/story viewports and semantic zoom; old rotate/CTA/custom-nav surfaces no longer exist; core controls moved to 44px; the blanket non-passive-listener and timer-leak claims were not valid current failures; and `TEXT-P1-01` confused a background-rectangle width estimate with clipping of the un-clipped SVG text element.

## Karty data/publication package

`SYS-KARTY-DATA-PROJECTION` owns the unfinished/holding map data and shared base/vector readiness instead of pretending each is a current public defect. Current bounded members include:

- holding readiness: `MAP-P1-03`, `MAP-P1-05`, `MAP-P1-07`, `REG-P1-01`, `SIG-P1-01`;
- data/schema candidates: `KARTY-DATA-P1-01`, `DATA-P1-03`, `DATA-P2-01`, `QUAL-P2-02`;
- base/vector candidates: `RIVER-P1-01`, `RIVER-P1-03`, `RIVER-P1-04`, `BASE-P1-01`, `BASE-P1-03`, `SVG-P1-01`, `ROUTE-P1-01`, `BASE-P2-01`.

Current corrections inside this package:

- `RIVER-P1-02` is fixed: canonical Avraam `base.svg` now defines `waterRipple`;
- `BASE-P1-02` old literal 0.5-opacity claim is superseded by current MapEngine/theme CSS ownership;
- `GATE-P1-03` is a control-plane/gate consistency issue and belongs to `SYS-AUDIT-CONTROL-PLANE`, not data projection.

## Other system packages

### `SYS-KARTY-VISUAL-LANGUAGE`

Still pending current screenshot/value classification. Old rows mix genuine legibility/product quality with optional cartographic taste; none are promoted merely because they were historically labelled P1.

### `SYS-AUDIT-CONTROL-PLANE`

Current harness/workflow proof-boundary package. It coordinates with Product #1092/#1097/#1120 and now also owns historical `GATE-P1-03` rather than leaving a gate mismatch inside the data package.

### `SYS-NAGORNAYA-MIGRATION`

Still narrowed to the actual migration residue:

- Part I–V routes use `NagornayaChastNMainShell`;
- the extracted `HeaderHero` / `ArticleBody` / `PostContent` family still exists;
- old Part IV–V scripture metadata and per-part footer-version symptoms are fixed;
- Part I still carries repeated inline `Из библиотеки` palette/structure.

Next boundary remains exact import inventory for all 15 extracted files and one delete-or-restore-componentization decision.

### `SYS-SHARED-CSS-RUNTIME-HYGIENE`

Retained for a bounded current AST/source pass after reader owners settle; historical duplicate/dead-owner claims alone do not authorize edits.

### `SYS-STRANGLER-RETIREMENT`

Retained and collision-owned by Product #1090. Historical `ASTRO-P1-05` is now explicitly strangler/reference context, not a Karty runtime bug.

## Owner decisions retained

- `SEARCH-P2-07` — exact Bible corpus rights/provenance/acquisition/import publication boundary.
- `GENESIS6-ACTIVATION-OWNER-GAP` — canonical Product publication/finalizer decision.
- `REG-001` — hosting/proxy response-header strategy or accepted risk.
- `NG-VIS-04` — author/editor decision on rewriting dense structured content into prose/air.

## Other important retirements established by current evidence

- `BUG-SEO-001` — historical pre-CDN IndexNow writer race no longer exists.
- `NEW-CANONICAL-IZBRANNOE-01-GAP` — route canonical fixed; generic harness questions belong to audit control plane.
- `AR-IDX-10` — legacy/Astro CSP divergence is strangler context, not an independent current route defect.
- `D-1` — no independent deploy-vs-IndexNow writer race remains.
- `D-19` — closed by current Antisovetov headline contract.
- `NEW-OG-SIZE-PARAM` — superseded by configurable SEO dimensions plus shared approved profiles and physical metadata validation.
- `QUAL-P1-09` — false-positive caused by conflating artifact status with indexability.
- `SEARCH-P3-03` — canonical permalink is a truthful share target.

See `../../legacy/MATRIX_CLEANUP_2026-08-07.md` for the complete current retirement map.

## Branch forensic completed

At wave start AuditRepo had `main` plus two intentional `archive/*` refs.

1. `archive/legacy-diverged-heads-20260801` contributed only six unique reviewed forensic ledger/receipt files. PR #228 materialized the exact blobs under project `legacy/branch-forensics/2026-08-01/`; blob identity was checked and GitHub auto-deleted the archive head.
2. `archive/forensic-pr-3-vosk-tts-report-2026-07-24` contributed one unique Vosk report plus stale README history. PR #229 materialized the exact Vosk report blob `97e9472b3019518751cdaa1fc3edb9ff2bed2ba1` without restoring stale README state; GitHub auto-deleted that archive head.

Live AuditRepo refs are therefore `main` plus this consolidation branch until PR #227 is merged.

## Validator / coverage correction

The compact model was made executable rather than merely documented:

- compact MASTER forbids closed rows;
- active rows require current evidence/direct witness and legacy-only active work fails closed;
- historical evidence-only IDs no longer force permanent MASTER/alias registration;
- retired aliases do not require dead canonical targets to remain active;
- the general AuditRepo validator supports compact active-work matrices while retaining compatibility for older project layouts;
- regression fixtures prove improvement sections, active-count drift, closed-row rejection, legacy-only actives, duplicate JSON keys and evidence-only history.

An intermediate regression failed because corrupting the sole improvement row correctly creates two state-count mismatches (total active + improvement count) while the fixture expected one. The fixture was corrected, not the validator weakened.

Checkpoint `ddb352c58753743e45b0350d088adefbb119673d` passed `AuditRepo Validate` fully green. Subsequent classification commits require a new exact-head green before merge.

## Product collision witness

Current relevant Product owners:

- #1097 — dependent tooltip/layout regression guards;
- #1092 — release/live-evidence control plane;
- #1090 — legacy-reference identity/inventory/ledger;
- #1120 — Home/release geometry evidence boundary.

#1095, #1093, #1096 and #1104 are merged in/before the current Product anchor. This AuditRepo wave makes no competing Product runtime mutation.

## Product governance note

Product `AGENTS.md` §4.1 still contains the older “durable registry / close rather than remove rows” wording. A direct connector write was blocked by the platform safety layer; it has not been silently changed. AuditRepo canonical rules in this branch implement the newer owner directive.

## Next checks

1. classify the final three `SYS-KARTY-RUNTIME-GEOMETRY` candidates with current browser/performance/value evidence;
2. continue reducing `SYS-KARTY-DATA-PROJECTION`, especially shared basemap defs and holding/publication boundaries;
3. classify `SYS-KARTY-VISUAL-LANGUAGE` into real necessary visual work vs taste/obsolete sheet-engine claims;
4. complete exact Nagornaya import inventory;
5. inspect shared CSS/runtime hygiene after reader owners settle;
6. require exact-head AuditRepo CI green, then merge PR #227 and continue subsequent verification waves from main.