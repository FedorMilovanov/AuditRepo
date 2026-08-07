# LEGACY — matrix cleanup 2026-08-07

This file is **not an active backlog**. It is the compact retirement map for the 2026-08-07 MASTER cleanup.

Pre-cleanup MASTER authority is recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`, file blob `83e19b6dc96d4e8a43432aa6f4513e27fb0e0f4f`. The old 231-row closed section is intentionally not copied forward into the active matrix.

## Retired from the former open count

The following historical rows were removed from active work because they are fixed, stale, duplicate, absorbed, invalid-as-bug, inert, suspected-only or not worth carrying as a bug.

### Karty current-source retirements

- `MAP-P1-02` — stale requirement after the canonical Avraam redesign. Current `AvraamMap.astro` explicitly replaces the old cinematic-only app with free exploration; the old “tour needs a touch CTA” expectation is no longer a demonstrated Product requirement. A reachable Space/API tour state bug remains separately as `MAP-P1-01`.
- `MAP-P1-04` — fixed/stale. Desktop search/theme/share boxes no longer geometrically overlap; mobile has separate 44px chrome placement and old timeline/stage rails are suppressed by the premium map-first owner.
- `MAP-P1-05` — old browser percentages were for maps now published as holding/audit surfaces (including Shoftim/Shvatim); they are not current public strict-native runtime evidence. Any future holding-map viewport readiness belongs to `SYS-KARTY-DATA-PROJECTION`.
- `MAP-P1-06` — absorbed/fixed by current archaeology tab ownership.
- `MAP-P1-08` — fixed/stale. Search clear restores opacity from `visiblePlaces()`, and story entrance explicitly keeps `data-story-active="0"` markers hidden.
- `MAP-P1-09` — fixed; current story selection remains map-first instead of auto-opening the first panel.
- `MAP-P1-12` — fixed/inert. `applyViewBox()` re-anchors the compass using view + units-per-pixel, and premium chrome currently hides `#me-compass`.
- `MAP-P1-19` — fixed/stale. Current mobile/desktop panel owners bound panel height to the viewport instead of allowing the historical short-landscape negative-top overflow.
- `MINI-P1-01` — inert on current public strict-native maps. Neither canonical Avraam nor canonical Ishod passes `showMinimap`; a redesign of a disabled component is future/optional work, not current MASTER work.
- `AVRAAM-P1-01` — stale with the removed cinematic app; canonical source has no old “Начать кинотур” CTA.
- `AVRAAM-P1-02` — old initial-camera complaint belongs to the removed implementation. Current Avraam route owns explicit desktop/mobile initial viewports, story-specific mobile viewports and semantic zoom; no current browser witness establishes the historical framing as a defect.
- `AVRAAM-P1-03` — stale with the removed custom Avraam navigation; canonical source uses the shared MapEngine panel/nav owner.
- `AVRAAM-P1-05` — stale; canonical Avraam source contains no historical “Разверните устройство” orientation blocker.
- `ASTRO-P1-01` — fixed by explicit route-owned initial viewports; current MapEngine resolves initial state from `viewport_init`/mobile viewport rather than centering on the first place.
- `ASTRO-P1-05` — not an independent bug under the current strict-native route contract. `data/route-profiles/karty-avraam.json` intentionally distinguishes canonical Astro source from `legacyPath`; renderer divergence belongs to strangler/reference ownership, not Karty runtime.
- `DATA-P1-04` — fixed. Current MapEngine has authored semantic-zoom configuration plus overview/region/detail buckets and density thresholds.
- `ENGINE-P1-27` — fixed. Escape closes an open photo modal and returns before the parent panel close path.
- `ENGINE-P1-29` — retired as an unproven bug formulation. Double-click intentionally zooms to the selected marker; neighboring places leaving the viewport is normal zoom behavior unless a current Product contract requires story-wide context preservation.
- `QUAL-P1-01` — old “15 controls violate 44px” count is stale. Core interactive controls are now 44px; remaining small/dead/context-specific selectors do not establish a current P1 without a project-wide enhanced-target requirement.
- `QUAL-P1-05` — overbroad/misclassified. High-frequency listeners that call `preventDefault` correctly use `passive:false`; read-only touch listeners use `passive:true`.
- `QUAL-P1-06` — old “58 timers/rAF without lifecycle cleanup” formulation is stale. Current engine tracks/removes listeners, tracked timeouts, animation frame and tour timer. A few raw short-lived UI/loading callbacks self-clear and do not prove a material retained-lifecycle leak.
- `TEXT-P1-01` — false causal wording. `labelText.length * fontSize * 0.6` sizes the background rectangle only; the SVG `<text>` itself is not clipped. A background-width quality issue may be revisited with a current visual witness, but “wide letters are cut off” is not supported by current source.
- `UI-P1-01` — fixed/stale. Current mobile search has its own bounded width/right offset and no longer uses the historical `right:48px` collision geometry.
- `LOD-P1-01` — stale after the current screen-anchored marker/label model; current place-label text is not rendered with the historical non-scaling 2.6px text stroke that supposedly flooded glyph interiors.
- `AVRAAM-P2-01` — stale payload architecture. Canonical Avraam explicitly replaced the old GSAP/cinematic app with shared MapEngine; the historical “60 GSAP animations + duplicate fetch” bundle is no longer the public implementation.
- `MAP-P2-02` — fixed/stale with the old Avraam implementation; canonical Avraam source has no route preload and performs the governed route fetch before MapEngine initialization.
- `RIVER-P1-02` — fixed. Current canonical Avraam `base.svg` defines `id="waterRipple"` with turbulence + displacement map; the old “filter referenced but undefined” claim is false on current source.
- `BASE-P1-02` — old forced `opacity="0.5"` formulation is superseded by current MapEngine CSS/theme ownership of `#me-base-geo` opacity; the literal 0.5 presentation attribute is no longer the effective standalone styling authority.

### Other retirements

- `BUG-PERF-001` — listener-count inequality alone is not evidence of a leak; reopen only with a concrete retained-listener/runtime witness.
- `GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD` — stale deploy-state formulation.
- `CI-WEBKIT-TOC-NONDETERMINISTIC` — closed by Product `a130ca01` readiness repair.
- `ATLAS-D-NAMESPACE-COLLISION` — historical working/atlas coordination debt; D-16…D-19 were closed in that historical register.
- `AR-IDX-JS-02` — fixed; current `site.js` uses `themeKey: "theme"`.
- `AR-IDX-03` — absorbed by Product PR #1079 platform-aware Search labels.
- `HOME-P3-FOOTER-EDGE-CONSOLE` — closed by Product PR #1079.
- `SEARCH-P3-01` — closed by Product PR #1079.
- `NEW-72` — ~1.9KB SVG micro-optimization; not a current bug.
- `STRANGLER-HYGIENE` — obsolete symptom/count; replaced by one current `SYS-STRANGLER-RETIREMENT` owner.
- `D-7` — harmless repository-relative documentation locator; not a defect.
- `NF-STRANGLER-BAR-DRIFT` — duplicate strangler symptom.
- `NEW-HARDTEXTS-CSP-MISSING-HFCDN` — inert on a route without the relevant Listen capability; reopen only with a current network/capability witness.
- `NEW-HIGHLIGHTS-NO-REINIT-GUARD` — historical row was explicitly suspected-only; no verified failure witness.
- `NEW-SAVE-QUOTE-TIMER-RACE` — historical row was explicitly suspected-only; no verified failure witness.
- `AR-IDX-04` — stale Home structure; current navigation no longer has the historical class-parity shape.
- `AR-IDX-06` — stale/fixed; current Home reading-progress hook is intentionally hidden and the feature is enabled through the scroll-top ring owner.
- `AR-IDX-CSS-02` — stale/absorbed by the current Home ambient viewport-rail owner and breakpoint handling.
- `R-006` — absorbed by current lazy Worker-owned TTS architecture.
- `AR-001` — closed by AuditRepo validator/scaffold hardening.
- `AR-004` — absorbed by operating-model v2 proportional verification waves.
- `AR-005` — retired blanket-reverify obligation.
- `BUG-SEO-001` — stale/fixed architecture: current IndexNow workflow is metadata/readiness diagnostics and no longer performs the historical pre-CDN submission transaction.
- `NEW-CANONICAL-IZBRANNOE-01-GAP` — route defect fixed by Product `563e85f3`; any generic noindex/canonical harness question belongs to `SYS-AUDIT-CONTROL-PLANE`.
- `AR-IDX-10` — legacy/Astro CSP parity is reference/strangler context, not an independent current route defect.
- `D-1` — stale after IndexNow control-plane redesign; no independent deploy-vs-IndexNow writer race remains.
- `D-19` — closed by the current Antisovetov canonical headline owner.
- `NEW-OG-SIZE-PARAM` — closed/superseded by configurable `Seo.astro` width/height plus shared approved social-image profiles and physical metadata validation.
- `QUAL-P1-09` — false-positive semantics: `production-dist` describes artifact/runtime presence while `seo.indexable:false` independently describes publication semantics.
- `SEARCH-P3-03` — canonical production permalink is a truthful “Скопировать ссылку” result; no current requirement proves current-origin copying is preferable.

## Current Karty IDs promoted out of system packages

These historical IDs were **not retired**: current public evidence proves a narrow independently actionable root, so they live directly in MASTER.

- `MAP-P1-01` — reachable tour stage-id/caption ownership defect.
- `MAP-P1-10` — canonical strict-native Ishod omits a geographic base layer; shared-basemap readiness is coordinated separately in the data package.
- `MAP-P1-11` — current scale-bar rendered-width math defect.
- `MAP-P1-18` — current multi-photo modal full-source/swipe-context defect.
- `WAYP-P1-01` — current public waypoint-label readability defect.
- `ENGINE-P1-26` — current search/story interaction ownership defect.
- `ENGINE-P2-03` — current unconditional post-data 600ms loading-overlay delay.
- `ENGINE-P2-04` — current live-region/status a11y defect.
- `MAP-P1-13` — current scripted reduced-motion defect.
- `MAP-P1-20` — current unversioned shared-engine/SW cache-first defect.

## Historical symptoms still collapsed into current system lanes

These are not individually open rows. Their old wording is not repair authority; the package owns the current decision until each claim is reverified.

- `SYS-KARTY-RUNTIME-GEOMETRY`: `DRAW-P1-01`, `PERF-P1-01`, `QUAL-P2-04`.
- `SYS-KARTY-DATA-PROJECTION`: holding/publication readiness `MAP-P1-03`, `MAP-P1-05`, `MAP-P1-07`, `REG-P1-01`, `SIG-P1-01`; plus `KARTY-DATA-P1-01`, `DATA-P1-03`, `RIVER-P1-01`, `RIVER-P1-03`, `RIVER-P1-04`, `BASE-P1-01`, `BASE-P1-03`, `SVG-P1-01`, `ROUTE-P1-01`, `BASE-P2-01`, `DATA-P2-01`, `QUAL-P2-02`.
- `SYS-KARTY-VISUAL-LANGUAGE`: `QUAL-P1-03`, `DRAW-P1-03`, `QUAL-P1-08`, `ARCH-P1-01`, `RELIEF-P1-01`, `GLYPH-P1-01`, `GRAT-P1-01`, `SEA-P1-01`, `ORN-P1-01`, `HALO-P1-01`, `MEDIA-P1-01`, `HUB-P2-01`.
- `SYS-AUDIT-CONTROL-PLANE`: `CI-WORKFLOW-PROLIFERATION`, `S-T-01`, `AUDIT-P2-WORKFLOWS-CHECK-GAP`, `D-2`, `GATE-MARKER-DATA-DRIFT`, `BUG-011`, `NF-GATE-IZ5-STALE`, `GATE-P1-03`; any residual noindex/canonical harness question from retired `NEW-CANONICAL-IZBRANNOE-01-GAP` also belongs here.
- `SYS-NAGORNAYA-MIGRATION`: `NG-DEAD-01`, `NG-SEO-01`, `NG-TOC-01`, `NG-CROSS-01`, `NG-SERIYA-01`, `NG-A11Y-01`, `NG-VIS-10`, `NG-STRUCT-01`, `NG-INLINE-01`.
- `SYS-SHARED-CSS-RUNTIME-HYGIENE`: `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS`, `AUDIT-CSS-GBFLOATER-DUP-MEDIA`, `AUDIT-JS-ESCAPER-DUP-X5`, `D-4`, `NF-DEAD-ENHANCE-SHIM`, `AR-IDX-A11Y-01`.
- `SYS-STRANGLER-RETIREMENT`: historical `R-007`, duplicate shadow-drift symptoms, `ASTRO-P1-05` context, and legacy/reference ownership formerly represented by `AR-IDX-10`.

## Non-defect improvements removed from MASTER

These were not thrown away; they belong to optional work/measurement, not the active matrix:

`AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`, `NEW-CSS-BUDGET-01`, `AUDIT-P3-OG-LCP-MISMATCH`, `D-3`, `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`, `R-001`, `R-002`, `R-003`, `R-004`, `R-005`.

## Policy established by this cleanup

MASTER stays small. A solved or obsolete row leaves MASTER in the same wave. If many historical symptoms reduce to one current root, MASTER keeps the root, not every symptom. Holding/future route problems are not mislabeled as current public runtime defects; they stay in a bounded publication-readiness package until activation. Legacy is a retirement/reference sink, not a second backlog.