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
| Active work units | **1** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **0** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 0

| ID | Current problem | Boundary |
|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 0

| ID | Verified work package | Next boundary |
|---|---|---|

## OWNER DECISIONS — 1

| ID | Missing decision |
|---|---|
| `SYS-MAIN-ADMISSION-ENFORCEMENT` | Product and AuditRepo `main` remain unprotected and required status-check enforcement is off. Choose required always-created PR checks with a documented emergency bypass, or explicitly accept/document post-push red risk. This is a governance owner choice, not a current Product defect or a current release blocker, and this row does not authorize settings mutation. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md`. |

## Freshness-bound terminal attestation — 2026-08-17

The former `PRODUCT ZERO` snapshot at Product `main` `c729f799a7922c3e2641c14b8637c2a94f5e3f9d` remains historical evidence only. This section is the current terminal attestation and is valid only while the anchors and invalidation conditions below remain true.

Current anchors:

- Product `main`: `a2ef67da54dd4ae00aedae154422280620acdf21`;
- Product tree: `9fc8e43a3ecffc4c87f303c837268600facd9a0e`;
- exact pre-merge integration candidate: `6799a1213be673c7fee7f2cdeb13868fb383f73d`, with the **same tree** `9fc8e43a3ecffc4c87f303c837268600facd9a0e`;
- that exact candidate was integrated on top of then-current Product `main` `78bec8d7757d2746275a20ff3b1845d9ed206354` and completed all 20 observed relevant workflows successfully before squash merge, including Atlas Focus State, Native Source, Source Authority, Pagefind Landing Body, Runtime Interactive, Route Registry, Deploy Candidate, Visual Parity, dependency security, shared-files and supporting browser contracts;
- Visual Parity attempt 1 had one external TLS/certificate browser failure in the home progressive-enhancement step; attempt 2 on the **same exact SHA** completed successfully, and the stale notifier was closed as recovered rather than ignored;
- no separate post-merge workflow run was visible immediately for squash SHA `a2ef67da54dd4ae00aedae154422280620acdf21`; no post-merge-run claim is made. The merge is instead bound to the byte-identical tree that completed the exact-head integration suite;
- fresh Product search at this attestation returned **0 open Product issues** and **0 open Product PRs**;
- Research `main`: `8d6e5bc3f303d0a6a2d1a15969e042907f3387db`; fresh Research open-issue search returned **0**;
- AuditRepo issue #225 remains separate rights/outreach coordination. External replies now include limited-quotation conditions/referrals/procedural API paths, but no protected full-corpus licence or TMS authorization has been admitted into Product; therefore it is not a Product mutation row in this MASTER;
- `SYS-MAIN-ADMISSION-ENFORCEMENT` remains the sole non-blocking owner decision and is intentionally not collapsed into Product zero.

Closure of the two previously active Product roots:

- `PROD-SOURCE-LINK-ROT-20260817` — closed after Product PR #1692 merged and the relevant external source scan reported 311 checked links with 0 hard errors and no systemic transport failure;
- `SYS-ATLAS-DRAWER-FOCUS-HANDOFF` — closed after Product PR #1683 merged from an exact current-main integration candidate with Atlas Chromium/WebKit focus lifecycle green and surrounding source/build/runtime/deploy/visual gates green.

This attestation becomes **STALE** and must be revalidated instead of repeated as present-tense truth if any of the following occurs:

1. Product `main` advances beyond the attested tree without fresh reconciliation;
2. a new Product issue/PR or fresh evidence is admitted as a current defect/necessary mutation;
3. an always-relevant or scheduled hard gate turns red in a way that is not classified and recovered with exact evidence;
4. Research authority advances in a way that can change Product admission;
5. rights/provenance evidence changes the admissible Product corpus or publication boundary;
6. branch/ruleset/admission policy materially changes.

Historical closure evidence remains in `CLOSURE_LEDGER.md`, `CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`, verification/reverify material and Git history; it is intentionally not duplicated as active or closed rows in MASTER.

```text
PRODUCT ZERO: CURRENT — FRESHNESS-BOUND ATTESTATION AT a2ef67da54dd4ae00aedae154422280620acdf21
AUDITREPO / CONTROL-PLANE: 0 CURRENT PRODUCT ROOTS; 1 NON-BLOCKING OWNER DECISION
NO RIGHTS-BASED FULL-CORPUS PRODUCT MUTATION AUTHORIZED
```

Future signals must pass the normal admission gate from fresh current Product evidence before they enter MASTER.