# Regression / Preservation Wave 3 — retained lane archaeology

Date: 2026-08-07

## Purpose

Perform one bounded read-only disposition pass over the Product repository's currently retained `lane/*` refs. The goal is not to minimize branch count; it is to prove whether any retained lane still contains approved functionality/evidence that is absent from current `main` and not already represented by a successor.

Current Product anchor used for graph checks during the pass: `main@778b787f491e91d8cd1f0e1c58cf79d999e18ade` (Wave 1A merged).

## Result

Current retained `lane/*` refs inspected: **37**.

- active current Product lane: **1** (`lane/nagornaya-library-theme-2026-08-07`, PR #1179 / `NG-INLINE-01`);
- lost approved capability requiring recovery: **0**;
- `UNIQUE_REVIEW` after disposition: **0**;
- all non-active lanes are merged/integrated, superseded, diagnostic/evidence-only, or explicitly rejected/obsolete.

This closes the bounded archaeology requirement of the 2026-08-07 forensic campaign. It does **not** require deleting useful forensic refs; branch cleanup is optional governance hygiene after their disposition is known.

## Disposition vocabulary

- `MERGED_OR_INTEGRATED` — branch payload is in current main or graph has `ahead_by=0`.
- `SUPERSEDED` — a named successor carried the intended payload and the old lane is explicitly do-not-merge.
- `DIAGNOSTIC_ONLY` — branch existed only to attribute/test a failure; durable evidence or repair landed elsewhere.
- `EVIDENCE_TRANSFERRED` — audit lane completed and its durable evidence was transferred to AuditRepo/permanent guards.
- `REJECTED_OBSOLETE` — experiment/workflow change explicitly rejected because a smaller/correct owner solved the need.
- `REIMPLEMENTED` — PR itself stayed unmerged but current main contains the capability through a later implementation.
- `ACTIVE_CURRENT` — not archaeology; current Product work with its own owner.

---

## Complete current lane ledger

| # | Branch | Disposition | Evidence / successor |
|---:|---|---|---|
| 1 | `lane/diag-reader-clientbox-center-20260807` | `DIAGNOSTIC_ONLY` | PR #1137 proved body-client-box centring; final Product #1140 and permanent guard #1147 carried the result. |
| 2 | `lane/diag-release-phase-complete-20260807` | `DIAGNOSTIC_ONLY` | PR #1141 was proof-only; final release-control-plane successor #1156 merged. |
| 3 | `lane/diag-single-shell-permanent-guard-20260807` | `DIAGNOSTIC_ONLY` | PR #1130 proof-only; Product #1140 + permanent #1147 are canonical. |
| 4 | `lane/diag-webkit-kdv-adapter-20260807` | `DIAGNOSTIC_ONLY` | PR #1112 isolated KDV WebKit overflow; final single-shell repair landed through #1140. |
| 5 | `lane/diag-webkit-measure-canvas-20260807` | `DIAGNOSTIC_ONLY` | PR #1113 isolated interaction cause; no independent payload required after #1140. |
| 6 | `lane/diag-webkit-reader-settings-20260807` | `DIAGNOSTIC_ONLY` | PR #1111 isolated ReaderSettings; final architecture landed through #1140. |
| 7 | `lane/diotrophes-source-links-wave-d-ct-20260805` | `SUPERSEDED` | PR #974 explicitly replaced by current-main successor #976, which merged. |
| 8 | `lane/hermenevtika-reader-layout-20260806` | `SUPERSEDED` | PR #1094 replaced by shared reader-layout Product #1095 and later final single-shell #1140. |
| 9 | `lane/home-footer-settled-contract-20260807-r2` | `MERGED_OR_INTEGRATED` | PR #1129 merged the settled-frame Home footer contract. |
| 10 | `lane/home-footer-settled-contract-20260807` | `SUPERSEDED` | PR #1128 replaced by #1129/#1145 current-main versions. |
| 11 | `lane/nagornaya-library-theme-2026-08-07` | `ACTIVE_CURRENT` | PR #1179 owns `NG-INLINE-01`; two-file themed-library component extraction. Excluded from archaeology conclusions. |
| 12 | `lane/reader-layout-final-alignment-20260807-r2` | `SUPERSEDED` | PR #1124 replaced by single-shell successors. |
| 13 | `lane/reader-layout-final-alignment-20260807-r3` | `SUPERSEDED` | PR #1131 explicitly says superseded by #1139; final #1140 merged. |
| 14 | `lane/reader-layout-final-alignment-20260807` | `SUPERSEDED` | Earlier alignment lane in same successor chain; no canonical payload beyond #1139/#1140. |
| 15 | `lane/reader-single-shell-current-20260807` | `SUPERSEDED` | PR #1139 exact-green evidence, superseded by current-main final #1140. |
| 16 | `lane/release-live-evidence-final-20260807-r2` | `SUPERSEDED` | PR #1152 explicitly superseded by #1156. |
| 17 | `lane/release-live-evidence-final-20260807` | `SUPERSEDED` | PR #1151 replaced by later current-main successors; final #1156 merged. |
| 18 | `lane/standalone-reader-single-shell-20260807` | `SUPERSEDED` | PR #1132 replaced by #1139/#1140. |
| 19 | `lane/system-ci-lifecycle-retired-identities-20260805` | `SUPERSEDED` | PR #985 replaced by #987, which merged the fail-closed inactive-identity reconciliation. |
| 20 | `lane/system-diotrophes-cross-wave-guard-20260805` | `REJECTED_OBSOLETE` | PR #957 explicitly OBSOLETE: #956 solved the same source-link transfer without the proposed workflow/system mutation. Do not revive. |
| 21 | `lane/system-favorites-store-20260805` | `SUPERSEDED` | PR #1040 explicitly superseded by clean canonical Favorite Store #1061. |
| 22 | `lane/system-hermenevtika-regression-guards-20260806` | `EVIDENCE_TRANSFERRED` | PR #1097 explicitly superseded by clean one-commit permanent evidence #1147 after Product repairs. |
| 23 | `lane/system-home-searchaction-query-entry-20260805` | `SUPERSEDED` | PR #960 explicitly superseded by clean Home SearchAction successor #968. |
| 24 | `lane/system-legacy-reference-path-api-20260805` | `SUPERSEDED` | PR #1027 replaced by #1029 then canonical #1032. |
| 25 | `lane/system-legacy-reference-path-api-v2-20260805` | `SUPERSEDED` | PR #1029 replaced by current-main #1032, which merged. |
| 26 | `lane/system-reader-controls-a11y-2026-08-05` | `SUPERSEDED` | PR #972 → #973 → #977 → final #988 merged. |
| 27 | `lane/system-reader-controls-a11y-clean-2026-08-05` | `SUPERSEDED` | PR #977 explicitly superseded by #988. |
| 28 | `lane/system-reader-controls-a11y-current-2026-08-05` | `SUPERSEDED` | PR #973 replaced by #977/#988. |
| 29 | `lane/system-reader-controls-audit-2026-08-05` | `DIAGNOSTIC_ONLY` | PR #963 diagnostic; superseded by #965. |
| 30 | `lane/system-reader-controls-audit-current-2026-08-05` | `DIAGNOSTIC_ONLY` | PR #965 diagnostic; superseded by exact-head #970. |
| 31 | `lane/system-reader-controls-audit-exact-2026-08-05` | `EVIDENCE_TRANSFERRED` | PR #970 explicitly `AUDIT COMPLETE — EVIDENCE IN AUDITREPO #169`; temporary Product audit was not merge intent. |
| 32 | `lane/system-reader-favorites-store-20260805` | `MERGED_OR_INTEGRATED` | Current graph check against `main@778b787f...`: `ahead_by=0`, `behind_by=39`, no unique commits. |
| 33 | `lane/system-reader-layout-followup-20260807` | `SUPERSEDED` | PR #1123 follow-up; later bounded/single-shell repairs #1124/#1140 supersede it. |
| 34 | `lane/system-route-overflow-diagnostics-20260807` | `DIAGNOSTIC_ONLY` | PR #1114 explicitly diagnostic, retained only as attribution evidence after #1140 removed the KDV double-geometry owner. |
| 35 | `lane/system-source-links-main-trigger-20260805` | `SUPERSEDED` | PR #961 predecessor; later corrected successor chain led to permanent #967. |
| 36 | `lane/system-source-links-main-trigger-v2-20260805` | `REIMPLEMENTED` | PR #964 stayed unmerged, but current `.github/workflows/source-links.yml` has the exact main-only governed-source push capability; commit `ff73bd8c...` / PR #967 landed it permanently. |
| 37 | `lane/test-tooltip-geometry-contract-20260806` | `EVIDENCE_TRANSFERRED` | PR #1098 dependent tooltip contract; final canonical tooltip/layout regression evidence merged via #1147. |

---

## High-value archaeology conclusions

### 1. Unmerged PR does not imply lost work

`lane/system-source-links-main-trigger-v2-20260805` / #964 is the concrete example. The PR is closed and unmerged, but the capability exists in current main through #967:

- `push` is restricted to `main`;
- the workflow/auditor source is not broadly triggered;
- exactly the governed reader-source owners launch the real-network Source Link Audit;
- a permanent main-trigger contract exists.

Therefore branch archaeology must compare **capability in current owners**, not merge flags alone.

### 2. Diagnostic branches are valuable evidence but not Product backlog

The reader/WebKit/tooltip diagnostic lanes successfully isolated geometry and harness causes. Their value is historical attribution. The final Product and permanent guards already contain the accepted result.

### 3. Explicit rejected experiments must stay rejected

`system-diotrophes-cross-wave-guard` #957 is not a missing system hardening opportunity. Its own disposition says the workflow/system change became unnecessary once #956 solved the same problem with a smaller owner boundary.

### 4. Active work is not archaeology

`lane/nagornaya-library-theme-2026-08-07` / #1179 is current work for `NG-INLINE-01`. It is not classified as old orphaned material and must be handled by ordinary Product/MASTER lifecycle.

## Wave 3 verdict

**CLOSED — no lost approved lane capability found. `UNIQUE_REVIEW=0`.**

No Product recovery PR is required from retained `lane/*` archaeology.

Optional future branch cleanup may delete/retire clearly superseded/diagnostic refs after governance review, but deletion is not part of this forensic closure and branch count is not a quality target.
