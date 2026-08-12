# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT только текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив и не зеркало Product. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER. Current Product truth перечитывается из Product в момент решения.

Current forensic/admission model:
- [`FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md`](./FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md)

Latest terminal control-plane evidence:
- [`CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`](./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md)

Operating authority:
- [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md)

## Current state

| Поле | Значение |
|---|---|
| Active work units | **4** |
| Direct current defects | **1** |
| Verified necessary improvements | **2** |
| Narrowed residuals | **0** |
| System verification lanes | **0** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 1

| ID | Current problem | Boundary |
|---|---|---|
| `SYS-AUDITREPO-HISTORY-FORENSIC-DRIFT` | The disposition for closed-unmerged AuditRepo PR #3 requires a missing archive ref; current strict history mode also does not fail all non-zero debt counters. | Reconcile evidence/ref authority, enforce strict zero semantics, and obtain exact-head plus natural Deep Audit success. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md`. |

## VERIFIED NECESSARY IMPROVEMENTS — 2

| ID | Needed implementation | Why |
|---|---|---|
| `SYS-AUDITREPO-WORKFLOW-PREFLIGHT` | Add an offline deterministic workflow syntax/shape preflight, regression fixtures for the exact de-indented heredoc failure, and immutable external `uses:` validation. | The deleted invalid workflow produced zero-job failures while ordinary AuditRepo Validate remained green. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md`. |
| `SYS-AUDITREPO-POLICY-MIGRATION` | Align active templates, scaffolds and current SSOT prose with compact MASTER, W1–W6, admission, claim/preservation boundary and semantic-owner rules. | Current authoring sources still teach obsolete monolith, closed-row, W1–W4 and stale active-work states. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md`. |

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 0

| ID | Verified work package | Next boundary |
|---|---|---|

## OWNER DECISIONS — 1

| ID | Missing decision |
|---|---|
| `SYS-MAIN-ADMISSION-ENFORCEMENT` | Product and AuditRepo `main` are unprotected and have no rulesets. Choose required always-created PR checks with a documented emergency bypass, or explicitly accept/document post-push red risk. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md`. |

## Terminal disposition

The 2026-08-12 Product closure remains terminal at Product `main` `64bb04bda2b228ef23c20214199b67b987c1eb94`, tree `ecff634b31252cd2bed2f9906e2ad4c3056cbd41`. The four rows above are AuditRepo/control-plane work only and do not reopen Product.

Historical closure evidence remains in `CLOSURE_LEDGER.md`, `CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`, verification/reverify material and Git history; it is intentionally not duplicated as active or closed rows in MASTER.

```text
PRODUCT ZERO
AUDITREPO / CONTROL-PLANE: 4 ACTIVE WORK UNITS
NO CURRENT PRODUCT MUTATION AUTHORIZED
```

Future signals must pass the normal admission gate from fresh current Product evidence. An empty MASTER does not authorize a successor lane, branch cleanup campaign, rerun campaign, global synchronization pass or unrelated audit wave.
