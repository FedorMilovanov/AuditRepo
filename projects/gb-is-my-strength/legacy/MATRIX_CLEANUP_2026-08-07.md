# LEGACY — matrix cleanup 2026-08-07

This file is **not an active backlog**. It is the compact retirement map for the 2026-08-07 MASTER cleanup.

Pre-cleanup MASTER authority is recoverable from Git at AuditRepo `265ab79cfd83ba805c385846b560878fb5593543`, file blob `83e19b6dc96d4e8a43432aa6f4513e27fb0e0f4f`. The old 231-row closed section is intentionally not copied forward into the active matrix.

## Retired from the former open count

The following historical rows were removed from active work because they are fixed, stale, duplicate, absorbed, invalid-as-bug, inert, suspected-only or not worth carrying as a bug:

- `MAP-P1-06` — absorbed/fixed by current archaeology tab ownership.
- `MAP-P1-09` — fixed; current story selection remains map-first instead of auto-opening the first panel.
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
- `BUG-SEO-001` — stale/fixed architecture: current `.github/workflows/indexnow.yml` is a metadata/readiness workflow and does not perform the historical pre-CDN IndexNow submission; production build/candidate/Pages promotion is owned separately by `deploy.yml`.
- `NEW-CANONICAL-IZBRANNOE-01-GAP` — route defect was fixed by Product `563e85f3`; current `/izbrannoe/` source emits an absolute SITE-owned canonical and is a registered strict-native noindex production route. Any remaining generic noindex/canonical harness question is absorbed into `SYS-AUDIT-CONTROL-PLANE`, not an independent SEO row.
- `AR-IDX-10` — legacy/Astro CSP parity is not an independent current route defect under explicit native/reference ownership; any actual current security-header problem needs its own current witness, while legacy/reference divergence belongs to `SYS-STRANGLER-RETIREMENT`.
- `D-1` — stale after the IndexNow control-plane redesign: the current `Metadata & IndexNow Readiness` workflow performs source diagnostics on main and no longer owns a competing production submit/deploy transaction, so the historical deploy-vs-IndexNow writer race no longer exists as an independent defect.
- `D-19` — closed by the current Antisovetov canonical headline owner. `scripts/article-headline-contract.js` requires one canonical headline across `og:title`, `twitter:title`, Article JSON-LD and breadcrumb, while `<title>` may differ only by the explicit site suffix; current `AntisovetovPageHead.astro` matches that contract. Rimlyanam had already been closed earlier.
- `NEW-OG-SIZE-PARAM` — closed/superseded by configurable `Seo.astro` width/height props plus the shared social-image owner introduced by Product #636: approved 1200×630 and 1200×675 profiles are validated and physical image metadata is checked fail-closed. The old “per-route allowlist residual” had no demonstrated current defect after this owner existed.
- `QUAL-P1-09` — false-positive caused by conflating route artifact status with publication/indexability. `currentStatus: "production-dist"` is the strict route-contract value for a route present in the production-like artifact/runtime registry; holding publication semantics are separately represented by `seo.indexable:false` and its reason. Do not rewrite profiles to make these orthogonal fields duplicate each other.

## Historical symptom rows collapsed into current system lanes

These are not closed claims; their **old per-symptom formulations are retired** because current work is owned at the system level. MASTER now carries only the current `SYS-*` rows.

- `SYS-KARTY-RUNTIME-GEOMETRY`: `MAP-P1-01`, `MAP-P1-02`, `MAP-P1-04`, `MAP-P1-05`, `MAP-P1-07`, `MAP-P1-08`, `MAP-P1-10`, `MAP-P1-12`, `AVRAAM-P1-01`, `AVRAAM-P1-02`, `AVRAAM-P1-03`, `AVRAAM-P1-05`, `ASTRO-P1-01`, `MAP-P1-18`, `MAP-P1-19`, `DATA-P1-04`, `ENGINE-P1-26`, `ENGINE-P1-27`, `ENGINE-P1-29`, `QUAL-P1-01`, `QUAL-P1-05`, `QUAL-P1-06`, `DRAW-P1-01`, `TEXT-P1-01`, `WAYP-P1-01`, `PERF-P1-01`, `UI-P1-01`, `LOD-P1-01`, `AVRAAM-P2-01`, `MAP-P2-02`, `ENGINE-P2-03`, `QUAL-P2-04`.
- `SYS-KARTY-DATA-PROJECTION`: `MAP-P1-03`, `KARTY-DATA-P1-01`, `ASTRO-P1-05`, `GATE-P1-03`, `DATA-P1-03`, `RIVER-P1-01`, `RIVER-P1-02`, `RIVER-P1-03`, `RIVER-P1-04`, `BASE-P1-01`, `BASE-P1-02`, `BASE-P1-03`, `SVG-P1-01`, `REG-P1-01`, `ROUTE-P1-01`, `BASE-P2-01`, `DATA-P2-01`, `QUAL-P2-02`.
- `SYS-KARTY-VISUAL-LANGUAGE`: `QUAL-P1-03`, `DRAW-P1-03`, `QUAL-P1-08`, `ARCH-P1-01`, `RELIEF-P1-01`, `GLYPH-P1-01`, `GRAT-P1-01`, `SEA-P1-01`, `ORN-P1-01`, `HALO-P1-01`, `MEDIA-P1-01`, `HUB-P2-01`.
- `SYS-AUDIT-CONTROL-PLANE`: `CI-WORKFLOW-PROLIFERATION`, `S-T-01`, `AUDIT-P2-WORKFLOWS-CHECK-GAP`, `D-2`, `GATE-MARKER-DATA-DRIFT`, `BUG-011`, `NF-GATE-IZ5-STALE`; any residual noindex/canonical harness question from retired `NEW-CANONICAL-IZBRANNOE-01-GAP` also belongs here.
- `SYS-NAGORNAYA-MIGRATION`: `NG-DEAD-01`, `NG-SEO-01`, `NG-TOC-01`, `NG-CROSS-01`, `NG-SERIYA-01`, `NG-A11Y-01`, `NG-VIS-10`, `NG-STRUCT-01`, `NG-INLINE-01`.
- `SYS-SHARED-CSS-RUNTIME-HYGIENE`: `AUDIT-CSS-DEAD-KEYFRAMES-TOKENS`, `AUDIT-CSS-GBFLOATER-DUP-MEDIA`, `AUDIT-JS-ESCAPER-DUP-X5`, `D-4`, `NF-DEAD-ENHANCE-SHIM`, `AR-IDX-A11Y-01`.
- `SYS-STRANGLER-RETIREMENT`: historical `R-007`, duplicate shadow-drift symptoms, and legacy/reference ownership context formerly represented by `AR-IDX-10`.

## Non-defect improvements removed from MASTER

These were not thrown away; they belong to optional work/measurement, not the active matrix:

`AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`, `NEW-CSS-BUDGET-01`, `AUDIT-P3-OG-LCP-MISMATCH`, `D-3`, `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`, `R-001`, `R-002`, `R-003`, `R-004`, `R-005`.

## Policy established by this cleanup

MASTER stays small. A solved or obsolete row leaves MASTER in the same wave. If many historical symptoms reduce to one current root, MASTER keeps the root, not every symptom. Legacy is a retirement/reference sink, not a second backlog. It remains available for future regressions and forensic lookup.