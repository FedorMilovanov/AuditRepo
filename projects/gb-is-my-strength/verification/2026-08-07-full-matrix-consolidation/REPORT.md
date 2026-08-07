# Full matrix consolidation — 2026-08-07

## Scope

- AuditRepo base at wave start: `265ab79cfd83ba805c385846b560878fb5593543`.
- Product current-check anchor: `9a0db0dc4533cb473abfe57f86e27517f04deea6`.
- Product mutation: none.
- Production/live claim: none.
- Historical input: pre-cleanup `verified/MASTER_BUG_MATRIX.md`, 145 rows labelled open.
- Goal: make MASTER a compact working notebook of verified necessary work, not a lifetime history.

The Product anchor advanced during the wave. Comparison from the earlier `77b15181cf0aed3b1df35637492e8c7f9e905b0c` anchor to `9a0db0dc4533cb473abfe57f86e27517f04deea6` changed Reader/Home/search-index surfaces but did **not** change `karty/_engine/map-engine.js` or the Karty route files used by the current classifications below. The MapEngine blob remains `eaf85cd58ac8381d7d9b3fe6d9745b8ea89e8496`, so source-level Karty verdicts were re-anchored without pretending unrelated Product changes invalidated them.

## Governance result

```text
raw evidence
→ verification / re-verification
→ enough independent witnesses for the risk
→ verified necessary work in MASTER
→ implementation / owner decision
→ result verification
→ remove from MASTER
→ legacy for useful retirement context
```

MASTER can contain defects, necessary implementations/improvements, system work, required migration/retirement, residuals and owner decisions. Optional/speculative improvement belongs in `WORK_QUEUE.md` until necessity is verified.

## Current MASTER result

Current active work is **29 work units**:

- **14** current defects;
- **4** verified necessary improvements;
- **0** narrowed residuals;
- **7** system verification / implementation packages;
- **4** owner decisions.

Closed/stale/duplicate/absorbed rows are not retained in active MASTER. Retirement mapping is `../../legacy/MATRIX_CLEANUP_2026-08-07.md`; the full pre-cleanup matrix remains recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`.

The count can rise or fall during current-checks. A historical symptom is promoted only when current evidence proves an independently actionable root; at the same time, fixed/stale historical formulations are removed from their `SYS-*` package rather than kept forever.

## Current Product collision witness

Current active Product owners relevant to this AuditRepo wave include:

- #1097 — dependent tooltip/layout regression guards;
- #1092 — release/live-evidence control plane;
- #1090 — legacy-reference identity/inventory/ledger;
- #1120 — Home/release geometry evidence boundary.

#1095 is now merged in the current Product anchor. #1093, #1096 and #1104 are also merged. This wave therefore keeps Product runtime mutation separate and does not collide with those owners while current work is still being classified.

## Current defects retained / promoted

### Shared / Search

- `S-SEC-01` — current `js/enhancements.js` still uses a fixed blacklist/attribute-stripping HTML sanitizer design.
- `AR-IDX-09` — current global Search shortcut does not reject Alt/Shift-modified Ctrl/Command+K.

### Karty — current direct roots

- `MAP-P1-01` — current tour computes the actual `sid` but caption/stage highlight still use `tourStepIdx`; stories whose authored stage IDs do not start at zero can therefore display/highlight the wrong stage.
- `MAP-P1-02` — current public MapEngine exposes tour start through API/Space-key ownership but has no discoverable touch/click start-tour affordance.
- `MAP-P1-03` — current `karty/shoftim/route.json` has six authored stages and stories referencing stage IDs through 5, while current places remain `stage:0`; exact current-file search finds no `"stage": 1`. The temporary three-stage `north/south/transjordan` wording that appeared during this consolidation pass was a route-name mix-up with Shvatim and is corrected here. The defect is Shoftim / Judges six-stage data assignment.
- `MAP-P1-07` — current `karty/early-church/route.json` still gives `temple_early` and `solomons_porch` the exact same `(624,800)` coordinate, next to `jerusalem_upper` at `(623,800)`. Current MapEngine creates an interactive marker group for each in-story place and adds a transparent hit circle `r=22`, so those physical targets stack. This is a current geometry/interaction defect, not an old screenshot artifact.
- `MAP-P1-10` — narrowed current root. The canonical route profile points `/karty/ishod/` to `src/pages/karty/ishod/index.astro`, which delegates to `src/components/karty/ishod/IshodMap.astro`. That component calls `MapEngine.createMap(container, adapted, { archaeologyProjection: ... })` without `baseGeoUrl`. Current MapEngine loads the shared `#me-base-geo` layer only inside `if (opts.baseGeoUrl)`. Therefore canonical strict-native Ishod currently omits the shared geographic base layer. The old broader “missing or obscured by overlay” wording is not carried forward.
- `MAP-P1-11` — current MapEngine scale bar still derives pixel scale from configured map width / viewBox width rather than actual rendered canvas width.
- `MAP-P1-13` — the old broad marker/panel a11y claim was mostly repaired, but the exact remaining motion bug is current-confirmed: CSS reduced-motion rules remove transitions/animations while `flyTo()` still unconditionally drives viewBox movement through duration-based `requestAnimationFrame`; zoom/reset/tour callers therefore keep scripted motion for users requesting reduced motion.
- `MAP-P1-18` — narrowed current root. Single-photo cards now carry `data-src=ph.src` and can open full-size. Multi-photo gallery images still render `ph.thumb||ph.src` without a full-source/index binding; delegated modal open uses `dataset.src || currentSrc || src` and never passes `place`/`idx`, so it opens the thumbnail and does not initialize `photoCurrentPlace/photoCurrentIdx`. The modal swipe handler therefore has no multi-photo context to advance.
- `MAP-P1-20` — the route.json half of the historical cache claim is stale, but the shared-engine half is current-confirmed: canonical Ishod loads `../_engine/map-engine.js` without a revision, and the current SW static-asset owner serves unversioned `.js` cache-first.
- `SIG-P1-01` — current signature renderer still contains fixed map-unit offsets such as `origin.x - 74`.
- `ENGINE-P1-26` — current search iterates all rendered markers and can brighten a matching out-of-story marker while marker interactivity is gated by `inStory`; search can visually find a place that cannot be opened in the selected story.
- `ENGINE-P2-04` — current story/toast notifications have no proven canonical live-region/status owner.

## Verified necessary improvements retained / promoted

- `MINI-P1-01` — current Karty minimap remains blank rectangle + dots + viewport and synchronizes by wrapping/reassigning `flyTo`; this is a current usability/ownership improvement, not taste-only polish.
- `REG-P1-01` — current `karty/shvatim/route.json` contains 13 authored territorial `regions` polygons (the substantive geography of a 12 Tribes allotment map), while current MapEngine has no `route.regions` consumer. This is promoted as necessary work: either project the authored regions through the canonical layer owner or make an explicit owner decision to retire the unused schema/data rather than silently carry content that cannot render.
- `SEARCH-P3-02` — Pagefind exposes only the first 10 results and fallback 12 even when the corpus has more matches; add truthful continuation/total ownership.
- `AR-IDX-05` — Home currently carries both numeric `SITE_CONFIG.version` and explicit asset `?v=` revision authorities; consolidate cache/version identity after checking the active legacy/reference owner.

## Karty historical formulations retired in this current-source pass

These IDs do not stay hidden in `SYS-KARTY-RUNTIME-GEOMETRY`; current source now disproves or supersedes the old formulation:

- `MAP-P1-04` — current top chrome no longer has the historical search/theme/share overlaps; mobile has separate 44px placement and the historical timeline/stage rails are suppressed by the premium map-first chrome owner.
- `MAP-P1-08` — search clear now restores opacity from `visiblePlaces()`, while marker entrance explicitly preserves `data-story-active="0"` hiding. The historical story-filter/search-clear corruption formulation is stale.
- `MAP-P1-12` — `applyViewBox()` now reanchors the compass using view coordinates and units-per-pixel, and premium chrome currently hides the compass. Historical map-space fly-away is fixed/inert.
- `MAP-P1-19` — current panel CSS bounds mobile/desktop max-height to the viewport, superseding the old short-landscape negative-top formulation.
- `DATA-P1-04` — semantic zoom is now implemented with authored `semantic_zoom` configuration and overview/region/detail buckets.
- `ENGINE-P1-27` — Escape closes the photo modal and returns before parent-panel close.
- `QUAL-P1-05` — current pinch/wheel listeners intentionally use `passive:false` because they call `preventDefault`; read-only touch listeners use `passive:true`. The old blanket “non-passive listener = defect” formulation is not a valid performance finding.

`MAP-P1-18` is not retired: its old absolute formulation was narrowed to the still-current multi-photo path described above.

## Karty package state after this pass

### `SYS-KARTY-RUNTIME-GEOMETRY`

The package is now smaller. Direct current roots (`MAP-P1-01`, `MAP-P1-02`, `MAP-P1-07`, `MAP-P1-10`, `MAP-P1-18`, `ENGINE-P1-26`) and the fixed/stale rows above are excluded. Remaining historical candidates still needing current classification include viewport occupancy/framing, Avraam-specific camera/landscape/CTA behavior, `ENGINE-P1-29` double-click zoom semantics, remaining touch-target/lifecycle claims, label-background/anchor collision quality and a few performance/LOD claims. They are not assumed current until verified.

### `SYS-KARTY-DATA-PROJECTION`

`MAP-P1-03` and `REG-P1-01` are no longer hidden here. Remaining candidates include route/schema/base/generated-artifact and river/vector claims that still need exact current owner checks.

### `SYS-KARTY-VISUAL-LANGUAGE`

Historical P1 wording mixes correctness with visual-quality targets. Current screenshots + owner/value evidence must decide which improvements are genuinely necessary before Product work.

## Nagornaya package state

### `SYS-NAGORNAYA-MIGRATION`

Narrowed substantially:

- all inspected Part I–V routes currently import `NagornayaChastNMainShell`;
- the 15 extracted `HeaderHero` / `ArticleBody` / `PostContent` files still exist, so the old extraction residue is real, but exact import inventory is required before deletion;
- Parts IV–V now expose `data-pagefind-meta="scripture"`, closing that old SEO symptom;
- part footers delegate to shared `NagornayaPageFooterRuntime`, so old per-part footer-version drift is stale;
- Part I `MainShell` still carries repeated inline `Из библиотеки` color/background/style ownership;
- per-chapter TOC accent differences are not assumed to be defects without an owner requirement.

Next boundary: exact import inventory for all 15 files, then one bounded delete-or-restore-componentization decision plus shared library-block ownership.

## Other system packages retained

### `SYS-AUDIT-CONTROL-PLANE`

Current harness/workflow proof-boundary package. It absorbs any remaining generic noindex/canonical guard question and must coordinate with #1092/#1097/#1120 rather than opening a parallel Product lane.

### `SYS-SHARED-CSS-RUNTIME-HYGIENE`

Retained for a current AST/source pass after the active reader UI work. Historical duplicate/dead-owner claims alone do not authorize edits.

### `SYS-STRANGLER-RETIREMENT`

Retained and collision-owned by Product #1090. Retirement requires replacement parity/reference authority before bounded deletion.

## Owner decisions retained

- `SEARCH-P2-07` — exact Bible corpus rights/provenance/acquisition/import publication boundary.
- `GENESIS6-ACTIVATION-OWNER-GAP` — canonical Product publication/finalizer decision.
- `REG-001` — hosting/proxy response-header strategy or accepted risk.
- `NG-VIS-04` — author/editor decision on rewriting dense structured content into prose/air.

## Other important retirements established by current evidence

- `BUG-SEO-001` — current IndexNow workflow is metadata/readiness diagnostics; the historical pre-CDN submit writer race no longer exists.
- `NEW-CANONICAL-IZBRANNOE-01-GAP` — `/izbrannoe/` current source has an absolute SITE canonical; any generic harness residual belongs to audit control plane.
- `AR-IDX-10` — legacy/Astro CSP divergence is reference/strangler context, not an independent route defect.
- `D-1` — no independent deploy-vs-IndexNow writer race remains under the current split ownership.
- `D-19` — current Antisovetov headline contract requires canonical equality across OG/Twitter/Article JSON-LD/breadcrumb and the current PageHead complies.
- `NEW-OG-SIZE-PARAM` — `Seo.astro` already exposes per-route image width/height while the shared social-image owner accepts 1200×630 / 1200×675 and verifies physical metadata fail-closed.
- `QUAL-P1-09` — false-positive semantics: `currentStatus: production-dist` is artifact/runtime presence, while holding publication semantics are independently `seo.indexable:false`.
- `SEARCH-P3-03` — canonical production permalink is a truthful result of “Скопировать ссылку”; no current requirement proves current-origin copying is preferable.

See `../../legacy/MATRIX_CLEANUP_2026-08-07.md` for retirement mapping.

## Branch forensic completed

At wave start AuditRepo had `main` plus two intentional `archive/*` refs.

1. `archive/legacy-diverged-heads-20260801` was compared against the consolidation branch. Its only unique current-tree material was six reviewed forensic ledger/receipt files. PR #228 squash-materialized those exact blobs, they were byte/blob checked after merge, and the head branch was auto-deleted by GitHub. The files now live under `../../legacy/branch-forensics/2026-08-01/` rather than as a new root directory.
2. `archive/forensic-pr-3-vosk-tts-report-2026-07-24` contained one unique 346-line Vosk report plus stale project README history. The README tree entry was aligned to the exact current README blob, PR #229 squash-materialized the report, and the merged report retains exact source blob `97e9472b3019518751cdaa1fc3edb9ff2bed2ba1`. The project README retained its current blob. GitHub auto-deleted the archive head.

After these steps, live AuditRepo branches are only `main` and `agent/gb-full-matrix-consolidation-20260807`. Once PR #227 merges, the remaining working branch is expected to auto-delete as well.

## Validator / coverage correction

Exact-head CI exposed the old-model assumptions rather than being bypassed:

- six forensic ledger files were moved byte-identically from an unapproved root into project `legacy/branch-forensics/`;
- `scripts/validate_audit_repo.py` no longer requires historical fixed/P0/P1/P2/P3 counters for a compact active matrix;
- closed rows are forbidden in compact MASTER and must move to legacy;
- active work without current evidence remains fail-closed;
- historical/evidence-only IDs in `reverify/` no longer force permanent MASTER/alias registration merely because they exist in historical evidence;
- alias retirement no longer requires dead canonical targets to remain active forever.

Black-box regression tests cover compact improvements, active/count drift, closed-row rejection, legacy-only active rows, duplicate JSON keys and evidence-only historical IDs. The latest CI red encountered during this pass was a fixture accounting error: corrupting the sole improvement row correctly creates **two** state-count mismatches (total active + improvement count), while the old test expected one. The fixture was corrected rather than weakening the validator.

## Product governance note

Current Product `AGENTS.md` §4.1 still contains the older “durable registry / close rather than remove rows” wording. No relevant active Product PR owns that file, but the connector safety layer blocked the attempted direct contents mutation. AuditRepo canonical rules in this wave implement the owner's newer directive; Product wording remains a known governance follow-up, not silently changed.

## Next checks

1. drive exact-head AuditRepo CI to green after the final compact-matrix/fixture updates;
2. continue shrinking `SYS-KARTY-RUNTIME-GEOMETRY`, next checking `ENGINE-P1-29`, current touch-target semantics, lifecycle residuals and label geometry with current witnesses;
3. classify remaining Karty data/base/vector candidates instead of preserving the package indefinitely;
4. complete exact Nagornaya import inventory;
5. inspect shared CSS/runtime hygiene after reader owners settle;
6. merge PR #227 only after exact-head CI and repository state are clean, then continue subsequent verification waves from the new main.