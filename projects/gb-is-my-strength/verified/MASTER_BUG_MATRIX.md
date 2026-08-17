# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT только текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив и не зеркало Product. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER. Current Product truth перечитывается из Product в момент решения.

Current forensic/admission model:
- [`FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md`](./FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md)

Latest historical terminal control-plane evidence:
- [`CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`](./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md)

Operating authority:
- [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md)

## Current state

| Поле | Значение |
|---|---|
| Active work units | **3** |
| Direct current defects | **1** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **1** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 1

| ID | Current problem | Boundary |
|---|---|---|
| `PROD-SOURCE-LINK-ROT-20260817` | Current Source Link Audit evidence found two hard 404 archival sources: the January 1870 *Missionary Magazine* item used by two Baptist-series pages and the 20 July 1956 JORF mirror used by the Da Vinci article. | Repair is isolated in Product PR #1692 with institutional replacements and unchanged audit policy. Close/remove this row only after the exact source-link/build hard gates are green and the fix is merged. |

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 1

| ID | Verified work package | Next boundary |
|---|---|---|
| `SYS-ATLAS-DRAWER-FOCUS-HANDOFF` | The Atlas responsive focus lifecycle can leave keyboard focus inside the desktop sidebar when the `981px → 980px` transition turns that sidebar into an inert closed drawer; WebKit provided the current browser witness. PR #1683 is the existing shared-file owner. | Keep the fix in the existing owner lane; do not bypass Shared Files Guard. Closure requires exact-head Atlas Focus State Contract success, regression-safe surrounding gates, and a clean current-main integration path. |

## OWNER DECISIONS — 1

| ID | Missing decision |
|---|---|
| `SYS-MAIN-ADMISSION-ENFORCEMENT` | Product and AuditRepo `main` remain unprotected and have no rulesets. Choose required always-created PR checks with a documented emergency bypass, or explicitly accept/document post-push red risk. This is a governance owner choice, not a current Product defect or a current release blocker, and this row does not authorize settings mutation. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md`. |

## Freshness / terminal disposition

The former visible `PRODUCT ZERO` statement was an evidence snapshot at Product `main` `c729f799a7922c3e2641c14b8637c2a94f5e3f9d`. It is **STALE as current evidence** and must not be reused as a present-tense zero claim.

Fresh current-state anchors for this consolidation wave (2026-08-17):

- Product `main`: `45218e95962af904a542507ff56733e054262fe4` (tree `9d318c5d0162020ef948a9e3877899171d269417`);
- current Product mutation/evidence lanes include #1683 (dependency + Atlas shared-file owner), #1689 (home navigation contract update) and #1692 (source-link remediation);
- the Atlas browser hard gate had a current WebKit focus witness and is being revalidated on an exact successor head before any merge claim;
- Research `main`: `8d6e5bc3f303d0a6a2d1a15969e042907f3387db`; fresh open-issue check returned zero Research issues;
- AuditRepo #225 remains separate rights/outreach coordination evidence: mixed external responses exist, but there is no protected full-corpus licence or TMS authorization and therefore no Product corpus mutation is admitted from it.

Historical closure evidence remains in `CLOSURE_LEDGER.md`, `CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`, verification/reverify material and Git history; it is intentionally not duplicated as active or closed rows in MASTER.

```text
PRODUCT ZERO: STALE — REVALIDATION/REPAIR ACTIVE
AUDITREPO / CONTROL-PLANE: 2 CURRENT PRODUCT ROOTS; 1 NON-BLOCKING OWNER DECISION
NO RIGHTS-BASED FULL-CORPUS PRODUCT MUTATION AUTHORIZED
```

When the two current Product roots are merged and their exact relevant hard gates are green, remove their rows in the same closure wave and write a new freshness-bound terminal attestation instead of reviving the old zero paragraph. Future signals must pass the normal admission gate from fresh current Product evidence.