# LEGACY — matrix cleanup 2026-08-07

This file is **not an active backlog**. It is the compact retirement map for the 2026-08-07 MASTER cleanup.

Pre-cleanup MASTER authority is recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`, file blob `83e19b6dc96d4e8a43432aa6f4513e27fb0e0f4f`. The old 231-row closed section is intentionally not copied forward into the active matrix.

## Retired from the former open count

The following historical rows were removed from active work because they are fixed, stale, duplicate, absorbed, invalid-as-bug, inert, suspected-only or not worth carrying as a bug.

### Karty current-source retirements

- `MAP-P1-02` — stale requirement after canonical Avraam moved from the old cinematic-only app to shared free exploration; no current Product requirement proves a touch tour CTA is required. The reachable tour-state defect remains separately as `MAP-P1-01`.
- `MAP-P1-04` — fixed/stale top-chrome overlap formulation.
- `MAP-P1-05` — old viewport percentages were for maps now published as holding/audit surfaces; future holding-map viewport readiness belongs to bounded Karty publication-readiness owners.
- `MAP-P1-06` — absorbed/fixed by current archaeology tab ownership.
- `MAP-P1-08` — fixed/stale story/search opacity formulation.
- `MAP-P1-09` — fixed; story selection remains map-first instead of auto-opening a panel.
- `MAP-P1-12` — fixed/inert; compass is screen-reanchored and premium chrome currently hides it.
- `MAP-P1-19` — fixed/stale short-landscape panel overflow formulation.
- `MINI-P1-01` — inert/optional: neither public strict-native Avraam nor Ishod enables `showMinimap`.
- `AVRAAM-P1-01`, `AVRAAM-P1-03`, `AVRAAM-P1-05`, `AVRAAM-P2-01`, `MAP-P2-02` — stale with removal of the old custom/cinematic Avraam implementation.
- `AVRAAM-P1-02`, `ASTRO-P1-01` — current Avraam owns explicit desktop/mobile/story viewports and semantic zoom; old first-point/framing claims are not current defects.
- `ASTRO-P1-05` — renderer divergence is intentional strict-native vs legacy/reference ownership, not a current Karty runtime defect; context belongs to strangler retirement.
- `DATA-P1-04` — fixed; current MapEngine implements authored semantic zoom with overview/region/detail buckets.
- `ENGINE-P1-27` — fixed; Escape closes the photo modal and returns before parent-panel close.
- `ENGINE-P1-29` — unproven bug formulation; intentional double-click zoom is not wrong merely because neighboring places leave the viewport.
- `QUAL-P1-01` — old “15 controls below 44px” count is stale; core current interactive controls are 44px and no project-wide enhanced-target requirement proves the old P1.
- `QUAL-P1-05` — overbroad; current non-passive pinch/wheel listeners intentionally call `preventDefault`, while read-only touch listeners use passive ownership.
- `QUAL-P1-06` — stale “58 timers/rAF without lifecycle cleanup” formulation; current engine has centralized listener/timer/rAF/tour cleanup and no material retained-lifecycle witness was found.
- `TEXT-P1-01` — false causal wording: the monospace estimate sizes the label background rectangle; SVG text itself is not clipped by that estimate.
- `UI-P1-01` — fixed/stale old mobile search collision geometry.
- `LOD-P1-01` — stale after current screen-anchored marker/label rendering.
- `RIVER-P1-02` — fixed; current Avraam `base.svg` defines `waterRipple`.
- `BASE-P1-02` — old literal 0.5-opacity formulation superseded by current MapEngine/theme CSS ownership.

### Shared CSS/runtime retirements

- `AUDIT-CSS-GBFLOATER-DUP-MEDIA` — absorbed into the narrowed active `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` improvement so duplicate CSS ownership has one repair transaction rather than two overlapping rows.
- `D-4` — old prerequisite is stale because current global z-stack tokens exist. Two remaining hardcoded z-index values alone are cleanup/polish, not a demonstrated current defect.
- `NF-DEAD-ENHANCE-SHIM` — not a shared-runtime bug. Current source explicitly calls it a legacy shim, and it immediately bails on canonical v4 markup. Its eventual deletion is strangler/reference retirement work.
- `AR-IDX-A11Y-01` — stale/fixed. Current global CSS supplies visible `a:focus-visible, button:focus-visible` outlines, so Home link cards do not require a dedicated class-specific rule to obtain keyboard focus visibility.

### Control-plane retirements

- `CI-WORKFLOW-PROLIFERATION` — retired as an overbroad count-based problem statement. Current `repository-control-plane-audit.mjs` explicitly enumerates every workflow, filesystem-derived local reference, effective permission set and registered privileged job; Shared Files requires both that audit and actionlint. Workflow count alone is no longer evidence of missing control-plane ownership.
- `S-T-01` — fixed/superseded. Current Workflow Policy v2 derives production route coverage from `migration/page-ownership.json`, while `validate:static-publication` composes page-ownership checks with route-family native/visual audits; the old “full Astro route parity absent” statement is no longer current.
- `GATE-MARKER-DATA-DRIFT` and `NF-GATE-IZ5-STALE` — fixed/stale exact symptom. The old hardcoded forbidden marker `«Часть 1 из 5»` is absent from current Product search, so that concrete vacuous-guard instance cannot remain open.
- `GATE-P1-03` — stale. The historical `atlas:gate` split is no longer a current package script owner; current `maps:validate` runs route validation plus publication-status ownership and map browser smoke exists separately. Reopen only with a current false-green mismatch, not the removed gate name.
- `BUG-011` — historical “23 breakpoints / 768px collision” count is not an independently actionable current failure after multiple responsive-owner migrations; no current exact collision witness was established in this wave.

`AUDIT-P2-WORKFLOWS-CHECK-GAP` and `D-2` are **not retired**; their current exact roots were promoted into MASTER and the old `SYS-AUDIT-CONTROL-PLANE` package was dissolved.

### Other retirements

- `BUG-PERF-001` — listener-count inequality alone is not evidence of a leak.
- `GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD` — stale deploy-state formulation.
- `CI-WEBKIT-TOC-NONDETERMINISTIC` — closed by Product readiness repair.
- `ATLAS-D-NAMESPACE-COLLISION` — historical coordination debt.
- `AR-IDX-JS-02` — fixed; current `site.js` uses `themeKey: "theme"`.
- `AR-IDX-03`, `HOME-P3-FOOTER-EDGE-CONSOLE`, `SEARCH-P3-01` — absorbed/closed by current Home/Search implementation.
- `NEW-72` — SVG micro-optimization, not a current bug.
- `STRANGLER-HYGIENE`, `NF-STRANGLER-BAR-DRIFT` — obsolete/duplicate symptoms; one current strangler owner remains.
- `D-7` — harmless repository-relative documentation locator.
- `NEW-HARDTEXTS-CSP-MISSING-HFCDN` — inert on a route without the relevant Listen capability.
- `NEW-HIGHLIGHTS-NO-REINIT-GUARD`, `NEW-SAVE-QUOTE-TIMER-RACE` — historical suspected-only rows without current failure witnesses.
- `AR-IDX-04`, `AR-IDX-06`, `AR-IDX-CSS-02` — stale/fixed Home formulations after current owner changes.
- `R-006` — absorbed by current lazy Worker-owned TTS architecture.
- `AR-001`, `AR-004`, `AR-005` — AuditRepo governance/validator work is superseded by the current operating model.
- `BUG-SEO-001`, `D-1` — historical IndexNow/deploy writer-race architecture no longer exists.
- `NEW-CANONICAL-IZBRANNOE-01-GAP` — route canonical fixed; generic harness concerns were reverified separately rather than retained as that old row.
- `AR-IDX-10` — legacy/Astro CSP divergence is strangler/reference context, not an independent route defect.
- `D-19` — closed by current Antisovetov canonical headline contract.
- `NEW-OG-SIZE-PARAM` — superseded by configurable SEO dimensions plus shared approved social-image profiles and physical metadata validation.
- `QUAL-P1-09` — false-positive caused by conflating artifact status with indexability.
- `SEARCH-P3-03` — canonical production permalink is a truthful share target.

## Exact current work promoted out of former system packages

### Control plane

- `AUDIT-P2-WORKFLOWS-CHECK-GAP` — narrowed current defect on Product main `e678b6c8`: both live verifiers can fail preflight before JSON report creation, while deploy evidence-upload steps use bare `if: always()`. Early generic failure can therefore erase/compound forensic evidence rather than preserve it. Active Product PR #1092 is the exact repair owner; AuditRepo must not create a competing Product lane.
- `D-2` — current necessary validator repair: `css-layer-validator.js` advertises declared-order enforcement but never compares actual block sequence against `declaredLayers`; it also reports target ≥80% while its only threshold is a `<50%` warning. Make the contract truthful instead of preserving the historical vague control-plane package.

### Karty public strict-native defects

`MAP-P1-01`, `MAP-P1-10`, `MAP-P1-11`, `MAP-P1-18`, `WAYP-P1-01`, `ENGINE-P1-26`, `ENGINE-P2-03`, `ENGINE-P2-04`, `MAP-P1-13`, `MAP-P1-20` live directly in MASTER because current public Avraam/Ishod evidence proves independently actionable roots.

### Nagornaya

- `NG-INLINE-01` — direct current public theme/ownership defect: Part I `Из библиотеки` still carries inline hardcoded light-palette presentation.
- `NG-DEAD-01` — verified necessary cleanup: the 15 auto-extracted `HeaderHero` / `ArticleBody` / `PostContent` files have a recorded zero-import witness, their canonical consumers did not change through the current Product anchor, the files still exist, and all five native routes render `MainShell`.

The old `SYS-NAGORNAYA-MIGRATION` package was dissolved rather than kept as a permanent container. Other old Nagornaya symptoms are fixed/stale, optional design debt, or the separate owner decision `NG-VIS-04`.

### Shared CSS/runtime

- `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` — narrowed active improvement. Only the verified current duplicate-owner part is retained: `site.css` still defines `fx-breathe` twice and `floating-cluster.css` still repeats the mobile `.gb-floater` owner.
- `AUDIT-JS-ESCAPER-DUP-X5` — exact active improvement. Current `site.js` has three independent HTML escapers, `highlights.js` one and `search.js` one; `site-utils.js` has no shared HTML-escape primitive. Current target is 5→1 canonical ownership.

The old `SYS-SHARED-CSS-RUNTIME-HYGIENE` package was dissolved after these exact roots were classified.

## Historical symptoms still collapsed into current system lanes

These are **not** individually open rows. Their old wording is not repair authority; the package owns current verification/implementation until a root is promoted or retired.

- `SYS-KARTY-DATA-PROJECTION`: holding/publication readiness `MAP-P1-03`, `MAP-P1-05`, `MAP-P1-07`, `REG-P1-01`, `SIG-P1-01`; data/base/vector candidates `KARTY-DATA-P1-01`, `DATA-P1-03`, `RIVER-P1-01`, `RIVER-P1-03`, `RIVER-P1-04`, `BASE-P1-01`, `BASE-P1-03`, `SVG-P1-01`, `ROUTE-P1-01`, `BASE-P2-01`, `DATA-P2-01`, `QUAL-P2-02`.
- `SYS-KARTY-VISUAL-LANGUAGE`: one published holding-map visual-readiness contract (initial viewport, label collision, desktop/mobile, controls, route readability, overall quality). Historical decorative rows such as glyph/ornament/halo/sea-pattern/sheet-engine style are not requirements by themselves.
- `SYS-STRANGLER-RETIREMENT`: historical `R-007`, `NF-DEAD-ENHANCE-SHIM`, `ASTRO-P1-05`, duplicate shadow/reference drift symptoms and legacy/reference ownership context.

## Optional / measurement-first work removed from MASTER

These are retained only when useful in `WORK_QUEUE.md`, not as active defects:

- Home/runtime performance: `AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`.
- Budget/measurement: `NEW-CSS-BUDGET-01`, `D-3`, `AUDIT-P3-OG-LCP-MISMATCH`.
- Karty runtime measurement: `PERF-P1-01`, `QUAL-P2-04`.
- Dormant/optional Karty UI: `MINI-P1-01`.
- Generic refactor/polish: `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`, `R-001`, `R-002`, `R-003`, `R-004`, `R-005`, current residual `D-4` cosmetic z-index cleanup.

## Policy established by this cleanup

MASTER stays small. A solved or obsolete row leaves MASTER in the same wave. If many historical symptoms reduce to one current root, MASTER keeps the root, not every symptom. Holding/future route problems are not mislabeled as current public runtime defects. Legacy is a retirement/reference sink, not a second backlog; optional measurement work belongs in `WORK_QUEUE.md`.