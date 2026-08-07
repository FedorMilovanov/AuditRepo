# LEGACY — matrix cleanup 2026-08-07

This file is **not an active backlog**. It is the compact retirement map for the 2026-08-07 MASTER cleanup.

Pre-cleanup MASTER authority is recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`, file blob `83e19b6dc96d4e8a43432aa6f4513e27fb0e0f4f`. The old closed-history table is intentionally not copied into the active matrix.

## Karty retirements and absorption

Current public interactive maps are Avraam and Ishod. Shoftim, Early Church and Shvatim are canonical `KartyHoldingPage` routes; their unfinished route/data/visual issues therefore belong to one activation transaction rather than the public-runtime defect count.

Retired or absorbed current-source formulations:

- `MAP-P1-02` — stale requirement after canonical Avraam moved from the old cinematic-only app to shared free exploration; the current reachable tour-state bug remains `MAP-P1-01`.
- `MAP-P1-04`, `MAP-P1-08`, `MAP-P1-09`, `MAP-P1-12`, `MAP-P1-19`, `UI-P1-01`, `LOD-P1-01` — fixed/stale after current shared MapEngine chrome/state/label ownership.
- `MAP-P1-05`, `MAP-P1-03`, `MAP-P1-07`, `REG-P1-01`, `SIG-P1-01`, `KARTY-DATA-P1-01`, `QUAL-P2-02` — not current public-runtime defects; concrete readiness is absorbed into `SYS-KARTY-HOLDING-PUBLICATION-READINESS` and is rechecked immediately before activation.
- `MAP-P1-06` — fixed/absorbed by current archaeology-tab ownership.
- `MINI-P1-01` — inert/optional: neither public Avraam nor Ishod enables `showMinimap`.
- `AVRAAM-P1-01`, `AVRAAM-P1-03`, `AVRAAM-P1-05`, `AVRAAM-P2-01`, `MAP-P2-02` — stale with removal of the old custom/cinematic Avraam implementation.
- `AVRAAM-P1-02`, `ASTRO-P1-01` — current Avraam owns explicit desktop/mobile/story viewports and semantic zoom; no current witness proves the old framing defect.
- `ASTRO-P1-05` — strict-native vs legacy/reference renderer divergence is strangler context, not a Karty runtime bug.
- `DATA-P1-03` — “era must change palette” is an authoring/design requirement, not an independently proven failure.
- `DATA-P1-04` — fixed; current MapEngine implements authored semantic zoom with overview/region/detail buckets.
- `DATA-P2-01` — missing authored `stages[].paths` is not itself a defect because current MapEngine can generate route paths; any bad result is caught by activation visual/readiness review.
- `ENGINE-P1-27` — fixed; Escape closes the photo modal and returns before parent-panel close.
- `ENGINE-P1-29` — intentional double-click zoom is not wrong merely because neighboring places leave the viewport.
- `QUAL-P1-01` — historical control-size count is stale; core current controls are 44px and no project-wide enhanced-target contract proves the old P1.
- `QUAL-P1-05` — overbroad; current non-passive pinch/wheel listeners intentionally call `preventDefault`, while read-only touch paths use passive ownership.
- `QUAL-P1-06` — stale lifecycle formulation; current engine has centralized listener/timer/rAF/tour cleanup and no material retained-lifecycle witness was found.
- `TEXT-P1-01` — false causal wording: the monospace estimate sizes the label background rectangle; SVG text itself is not clipped by that estimate.
- `RIVER-P1-01` — current Avraam defines `waterRipple` but does not apply `filter="url(#waterRipple)"`; the displacement therefore cannot be the claimed current shoreline defect.
- `RIVER-P1-02` — fixed; `waterRipple` is defined in current Avraam `base.svg`.
- `RIVER-P1-03` — round linecaps alone do not prove a visible river/coast failure; no current visual witness remains.
- `RIVER-P1-04` — historical detached-`getTotalLength()` explanation was not a reproduced current browser failure.
- `BASE-P1-02` — old literal 0.5-opacity formulation is superseded by current MapEngine/theme CSS ownership.
- `BASE-P1-03` — old `#22241f` land formulation no longer matches the current Avraam base asset; “stars obscure relief” without a current browser witness is aesthetic, not P1.
- `SVG-P1-01` — current Product search no longer finds the historical unescaped `&nbsp;` atlas-export symptom.
- `ROUTE-P1-01`, `RELIEF-P1-01`, `GLYPH-P1-01`, `GRAT-P1-01`, `SEA-P1-01`, `ORN-P1-01`, `HALO-P1-01`, `ARCH-P1-01` — historical `sheet-engine.js` / decorative-reference concerns are not canonical browser-runtime requirements. Holding-map visual readiness may choose any implementation that meets the published readability/quality contract.
- `QUAL-P1-03`, `DRAW-P1-03`, `QUAL-P1-08`, `MEDIA-P1-01`, `HUB-P2-01` — not retained as independent permanent P1/P2 rows; any real publication blocker is reverified through the one holding activation/readiness transaction.

`BASE-P1-01` is **not retired**. It was promoted to an exact necessary improvement because the public Ishod repair (`MAP-P1-10`) needs a valid geographic base asset, while current shared `karty/_engine/base-geo.svg` has empty `<defs>` but references `#landG`, `#seaG`, `#soft`, `#hill`, `#peak`, `#peak-snow` and other unresolved IDs.

The former `SYS-KARTY-DATA-PROJECTION` and `SYS-KARTY-VISUAL-LANGUAGE` rows were replaced by one bounded `SYS-KARTY-HOLDING-PUBLICATION-READINESS` owner.

## Shared CSS/runtime retirements

- `AUDIT-CSS-GBFLOATER-DUP-MEDIA` — absorbed into active `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS`; duplicate CSS owners have one repair transaction.
- `D-4` — old missing-z-token prerequisite is stale; residual isolated hardcoded z-index values are cleanup/polish, not a demonstrated current defect.
- `NF-DEAD-ENHANCE-SHIM` — explicit legacy shim that bails on canonical v4 markup; eventual deletion belongs to strangler retirement.
- `AR-IDX-A11Y-01` — stale/fixed because current global CSS supplies visible `a:focus-visible, button:focus-visible` outlines.

Active exact replacements are `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS` (duplicate `fx-breathe` + mobile `.gb-floater` ownership) and `AUDIT-JS-ESCAPER-DUP-X5` (five current local HTML escapers → one canonical primitive).

## Control-plane retirements

- `CI-WORKFLOW-PROLIFERATION` — workflow count alone is no longer a valid problem statement; current repository-control-plane audit inventories workflows, local references, effective permissions and privileged jobs, and Shared Files requires it plus actionlint.
- `S-T-01` — superseded by Workflow Policy v2 and current page-ownership/route-family publication validation.
- `GATE-MARKER-DATA-DRIFT`, `NF-GATE-IZ5-STALE` — old exact `«Часть 1 из 5»` marker is absent from current Product source.
- `GATE-P1-03` — historical `atlas:gate` is no longer a current package-script owner; current `maps:validate` owns route/publication validation.
- `BUG-011` — old breakpoint-count statement has no independently reproduced current collision witness.

The former `SYS-AUDIT-CONTROL-PLANE` was dissolved. Exact current roots promoted to MASTER are:

- `AUDIT-P2-WORKFLOWS-CHECK-GAP` — current live-release evidence lifecycle can lose/compound evidence on early verifier failure; Product PR #1092 is the repair owner.
- `D-2` — current CSS-layer validator advertises declared-order / ≥80% semantics it does not actually enforce.

## Nagornaya

The former `SYS-NAGORNAYA-MIGRATION` was dissolved into exact work:

- `NG-INLINE-01` — public Part I `Из библиотеки` still owns hardcoded inline light-palette presentation.
- `NG-DEAD-01` — 15 auto-extracted `HeaderHero` / `ArticleBody` / `PostContent` files remain zero-consumer artifacts while all five canonical routes render `MainShell`.

Other historical Nagornaya symptoms are fixed/stale, optional design debt, or the separate author/editor decision `NG-VIS-04`.

## Other retirements

- `BUG-PERF-001` — listener-count inequality alone is not evidence of a leak.
- `GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD` — stale deploy-state formulation.
- `CI-WEBKIT-TOC-NONDETERMINISTIC` — closed by current readiness repair.
- `ATLAS-D-NAMESPACE-COLLISION` — historical coordination debt.
- `AR-IDX-JS-02` — fixed; current `site.js` uses `themeKey: "theme"`.
- `AR-IDX-03`, `HOME-P3-FOOTER-EDGE-CONSOLE`, `SEARCH-P3-01` — absorbed/closed by current Home/Search implementation.
- `NEW-72` — SVG micro-optimization, not a current bug.
- `STRANGLER-HYGIENE`, `NF-STRANGLER-BAR-DRIFT` — obsolete/duplicate strangler symptoms; one bounded current strangler owner remains.
- `D-7` — harmless repository-relative documentation locator.
- `NEW-HARDTEXTS-CSP-MISSING-HFCDN` — inert on a route without the relevant Listen capability.
- `NEW-HIGHLIGHTS-NO-REINIT-GUARD`, `NEW-SAVE-QUOTE-TIMER-RACE` — historical suspected-only rows without current failure witnesses.
- `AR-IDX-04`, `AR-IDX-06`, `AR-IDX-CSS-02` — stale/fixed Home formulations.
- `R-006` — absorbed by current lazy Worker-owned TTS architecture.
- `AR-001`, `AR-004`, `AR-005` — superseded by the current AuditRepo operating model/validators.
- `BUG-SEO-001`, `D-1` — historical IndexNow/deploy writer-race architecture no longer exists.
- `NEW-CANONICAL-IZBRANNOE-01-GAP` — route canonical fixed; generic harness concerns were reverified separately.
- `AR-IDX-10` — legacy/Astro CSP divergence is strangler/reference context, not an independent route defect.
- `D-19` — closed by current Antisovetov canonical headline contract.
- `NEW-OG-SIZE-PARAM` — superseded by configurable SEO dimensions plus approved social-image profiles and physical metadata validation.
- `QUAL-P1-09` — false-positive caused by conflating artifact status with indexability.
- `SEARCH-P3-03` — canonical production permalink is a truthful share target.

## Remaining system ownership

- `SYS-KARTY-HOLDING-PUBLICATION-READINESS` — one activation transaction per held map, using current browser/screenshots plus route/publication validators. Old symptom IDs are evidence context only.
- `SYS-STRANGLER-RETIREMENT` — replacement parity / immutable identity / classification / physical-retirement readiness. Product PR #1090 is the active collision owner; do not open a parallel Product lane.

## Optional / measurement-first work

`WORK_QUEUE.md` retains only useful non-active work such as `PERF-P1-01`, `QUAL-P2-04`, dormant minimap ideas, Home/runtime measurements, CSS budget measurements and bounded refactor/polish candidates.

## Policy

MASTER stays small. A solved/obsolete row leaves MASTER in the same wave. Many historical symptoms with one current transaction become one work unit. Holding-route issues are activation readiness until they become independently current. Legacy is reference evidence, never a second backlog.