# Full matrix consolidation — 2026-08-07

## Scope

- AuditRepo base at wave start: `265ab79cfd83ba805c385846b560878fb5593543`.
- Product current-check anchor: `9a0db0dc4533cb473abfe57f86e27517f04deea6`.
- Product mutation: none.
- Production/live claim: none.
- Historical input: pre-cleanup `verified/MASTER_BUG_MATRIX.md`, 145 rows labelled open.
- Goal: make MASTER a compact working notebook of verified necessary current work, not a lifetime history.

The Product anchor advanced during the wave. Comparison from earlier `77b15181cf0aed3b1df35637492e8c7f9e905b0c` to current `9a0db0dc4533cb473abfe57f86e27517f04deea6` changed Reader/Home/search-index surfaces but did not change the Karty engine/route files used by the current source classifications. Current MapEngine remains blob `eaf85cd58ac8381d7d9b3fe6d9745b8ea89e8496`.

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

MASTER may contain defects, verified necessary implementations/improvements, bounded system work and owner decisions. Optional/speculative or measurement-first work belongs outside MASTER. Holding/future routes do not inflate the public runtime defect count merely because unfinished source exists.

## Current MASTER result

Current active work is **26 work units**:

- **13** direct current defects;
- **5** verified necessary improvements;
- **0** narrowed residuals;
- **4** bounded system verification / implementation packages;
- **4** owner decisions.

Closed/stale/duplicate/absorbed/inert rows are absent from active MASTER. Retirement mapping is `../../legacy/MATRIX_CLEANUP_2026-08-07.md`; optional measurement work is in `../../WORK_QUEUE.md`. The full pre-cleanup matrix remains recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`.

## Current direct defects

### Shared / Search

- `S-SEC-01` — current `js/enhancements.js` still uses a fixed blacklist/attribute-stripping HTML sanitizer design.
- `AR-IDX-09` — current global Search shortcut does not reject Alt/Shift-modified Ctrl/Command+K.

### Public Karty strict-native surfaces

- `MAP-P1-01` — tour computes actual `sid`, while caption/stage highlight still use `tourStepIdx`; non-zero story stage IDs can display/highlight the wrong stage.
- `MAP-P1-10` — canonical Ishod calls `MapEngine.createMap()` without `baseGeoUrl`; public Ishod therefore lacks a geographic base layer. Shared basemap readiness remains coordinated because current `karty/_engine/base-geo.svg` has empty `<defs>` while referencing IDs such as `#landG`, `#seaG`, `#soft`, `#hill`, `#peak` and `#peak-snow`.
- `MAP-P1-11` — scale bar derives screen scale from `cfg.W0 / view.w` instead of actual rendered canvas width.
- `MAP-P1-18` — multi-photo gallery images still lack full-source/index binding; modal delegation receives the thumbnail and does not initialize `photoCurrentPlace/photoCurrentIdx`, so swipe cannot advance the multi-photo set.
- `WAYP-P1-01` — verified-waypoint labels are 7 map units at opacity `.4`, without screen anchoring/background; on current Avraam authored view widths they resolve to only a few CSS pixels.
- `ENGINE-P1-26` — search can brighten an out-of-story marker while marker interactivity is gated by `inStory`, yielding a visible result that cannot be opened in the selected story.
- `ENGINE-P2-03` — route data are resolved before `createMap()`, yet MapEngine hides the already-available map behind an unconditional fixed ~600ms loading overlay.
- `ENGINE-P2-04` — story/toast notifications still lack a canonical live-region/status owner.
- `MAP-P1-13` — CSS reduced-motion neutralizes CSS animation/transition, but `flyTo()` still runs duration-based requestAnimationFrame viewBox movement.
- `MAP-P1-20` — canonical Ishod loads unversioned `../_engine/map-engine.js`; current SW static-asset ownership serves unversioned `.js` cache-first.

### Nagornaya

- `NG-INLINE-01` — current public Part I `MainShell` still hardcodes the `Из библиотеки` block with inline `#faf8f5`, `#1c1410`, `#8a7968`, `#b8882a` presentation, bypassing the shared Nagornaya theme/token owner.

## Verified necessary improvements

- `NG-DEAD-01` — remove the 15 unused `NagornayaChastN{HeaderHero,ArticleBody,PostContent}` extraction artifacts or deliberately restore them as the canonical componentization boundary. Exact `0fbe7d1e` verification recorded zero imports; Product delta through `9a0db0dc` did not change those files, the five MainShells or canonical part routes; all five canonical parts render `MainShell` and current edge extraction files still exist.
- `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` — narrowed to exact duplicate CSS ownership: current `site.css` still defines `@keyframes fx-breathe` twice, and current `floating-cluster.css` still repeats the mobile `.gb-floater` owner. The old “33 dead custom props” subclaim is not active repair authority.
- `AUDIT-JS-ESCAPER-DUP-X5` — current `site.js` contains three local HTML escapers, `highlights.js` one and `search.js` one, while `site-utils.js` has no canonical HTML-escape primitive. This is an exact security-sensitive ownership dedupe target: 5→1.
- `SEARCH-P3-02` — add truthful result total/continuation rather than exposing only Pagefind 10 / fallback 12 matches with no way to reach the rest.
- `AR-IDX-05` — consolidate Home/shared cache-version identity so numeric `SITE_CONFIG.version` and explicit asset `?v=` revisions are not parallel manual authorities.

## Karty publication boundary

Current canonical sources distinguish public interactive maps from holding/readiness routes:

- `/karty/avraam/` — strict-native interactive map;
- `/karty/ishod/` — strict-native interactive map;
- `/karty/shoftim/`, `/karty/early-church/`, `/karty/shvatim/` — `KartyHoldingPage`, explicitly held from publication/visual return.

Therefore Shoftim `MAP-P1-03`, Early Church `MAP-P1-07`, Shvatim `REG-P1-01`, signature/data defects and similar unfinished-route claims are real readiness debt but are not mislabeled as current public runtime failures. They are bounded inside `SYS-KARTY-DATA-PROJECTION` until activation or until one root independently blocks an active-map repair.

The public Karty hub and `KartyHoldingPage` explicitly require checks of initial viewport, label collision, desktop/mobile behavior, controls, route readability and overall visual quality before a holding map returns. That published requirement is the basis for `SYS-KARTY-VISUAL-LANGUAGE`; old decorative sheet-engine/glyph/ornament/halo/sea-pattern preferences are not independent P1 requirements.

## Dissolved Karty runtime system lane

`SYS-KARTY-RUNTIME-GEOMETRY` was removed from MASTER after current-source classification. Direct public roots were promoted; stale/inert old formulations were retired. The two remaining performance questions were moved to `WORK_QUEUE.md` because source shape alone did not prove material current harm:

- historical `PERF-P1-01` — Avraam still contains animated water turbulence, but the old 15–20 fps figure lacks a current browser witness;
- historical `QUAL-P2-04` — `renderMarkers()` still rebuilds SVG structures, but current material GC/jank impact is unproven.

Historical `DRAW-P1-01` is now one concrete label-collision check inside the explicit holding-map visual-readiness contract rather than a standalone permanent defect.

## Dissolved Nagornaya migration system lane

`SYS-NAGORNAYA-MIGRATION` was removed after its actual current roots became exact:

- all five canonical Part I–V routes import/render `NagornayaChastNMainShell`;
- exact `0fbe7d1e` verification found zero imports of the 15 extracted `HeaderHero` / `ArticleBody` / `PostContent` files;
- the intervening Product delta did not touch those extraction files, the MainShells or canonical part routes;
- current Part I/Part V edge extraction files still exist;
- Part I current MainShell still contains the hardcoded inline `Из библиотеки` palette;
- old scripture metadata/footer-version symptoms are fixed.

The package is replaced by `NG-DEAD-01` and `NG-INLINE-01`; `NG-VIS-04` remains a separate author/editor decision.

## Dissolved shared CSS/runtime hygiene system lane

`SYS-SHARED-CSS-RUNTIME-HYGIENE` was removed after exact current classification:

- active `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` owns the real duplicate CSS owners;
- active `AUDIT-JS-ESCAPER-DUP-X5` owns the exact 5→1 HTML-escape consolidation;
- `D-4` no longer has its old missing-z-token prerequisite; isolated hardcoded z-index values are cleanup/polish, not a demonstrated current defect;
- `NF-DEAD-ENHANCE-SHIM` is explicitly a legacy shim and bails on canonical v4 markup, so its eventual deletion belongs to strangler retirement;
- `AR-IDX-A11Y-01` is stale/fixed because current global CSS provides visible `a:focus-visible, button:focus-visible` outlines.

## Remaining system packages

### `SYS-KARTY-DATA-PROJECTION`

Holding/publication readiness plus shared data/base dependency needed by active Ishod basemap repair. Shared basemap definitions must be made coherent before wiring the asset into Ishod.

### `SYS-KARTY-VISUAL-LANGUAGE`

One explicit holding-map visual publication-readiness owner based on the public hub/HoldingPage contract. Promote only concrete blockers discovered in current browser review; retire taste-only historical symptoms.

### `SYS-AUDIT-CONTROL-PLANE`

Current audit/workflow proof-boundary package. Historical candidates include workflow proliferation/coverage, stale duplicated marker owners, gate false-green/false-red and generic noindex/canonical harness ownership. It must be re-evaluated against the current open Product owners before any Product mutation.

### `SYS-STRANGLER-RETIREMENT`

Legacy/reference parity-authority migration and bounded retirement. Historical `ASTRO-P1-05` and `NF-DEAD-ENHANCE-SHIM` are context here rather than runtime bugs. Product #1090 has been the active collision owner and must be rechecked before further classification.

## Owner decisions retained

- `SEARCH-P2-07` — exact Bible corpus rights/provenance/acquisition/import publication boundary.
- `GENESIS6-ACTIVATION-OWNER-GAP` — canonical Product publication/finalizer decision.
- `REG-001` — hosting/proxy response-header strategy or accepted risk.
- `NG-VIS-04` — author/editor decision on rewriting dense structured content into prose/air.

## Branch forensic completed

At wave start AuditRepo had `main` plus two intentional `archive/*` refs.

1. `archive/legacy-diverged-heads-20260801` contributed six unique reviewed forensic ledger/receipt files. PR #228 materialized exact blobs under project `legacy/branch-forensics/2026-08-01/`; blob identity was checked and GitHub auto-deleted the archive head.
2. `archive/forensic-pr-3-vosk-tts-report-2026-07-24` contributed one unique Vosk report plus stale README history. PR #229 materialized exact Vosk report blob `97e9472b3019518751cdaa1fc3edb9ff2bed2ba1` without restoring stale README state; GitHub auto-deleted the archive head.

## Validator / coverage correction

The compact model is executable, not merely documented:

- compact MASTER forbids closed rows;
- active rows require current evidence/direct witness and legacy-only active work fails closed;
- historical evidence-only IDs no longer force permanent MASTER/alias registration;
- retired aliases do not require dead canonical targets to remain active;
- the general validator supports compact active-work matrices while retaining compatibility for older project layouts;
- regression fixtures cover improvement sections, active-count drift, closed-row rejection, legacy-only actives, duplicate JSON keys and evidence-only history.

Green exact-head checkpoints already achieved during this wave include `ddb352c58753743e45b0350d088adefbb119673d` and later `e821d85d56d8f43fb052cd78f85047480b800a2e`. Subsequent classification commits require a new exact-head green before merge.

## Product collision note

At the last owner snapshot the relevant Product PRs were #1097, #1092, #1090 and #1120. Their current state must be re-read before reducing `SYS-AUDIT-CONTROL-PLANE` or `SYS-STRANGLER-RETIREMENT`.

Product `AGENTS.md` §4.1 still contains the older “durable registry / close rather than remove rows” wording. A direct connector write was blocked by the platform safety layer; it has not been silently changed. AuditRepo canonical rules in this branch implement the newer owner directive.

## Next checks

1. re-read current Product main and PR owner state;
2. reduce `SYS-AUDIT-CONTROL-PLANE` against the live owner/workflow state;
3. continue reducing `SYS-KARTY-DATA-PROJECTION` and `SYS-KARTY-VISUAL-LANGUAGE` without promoting holding-only issues as public defects;
4. keep `SYS-STRANGLER-RETIREMENT` bounded to actual replacement/parity authority;
5. require exact-head AuditRepo CI green, then merge PR #227 and continue from main.