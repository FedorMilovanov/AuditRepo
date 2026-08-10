# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER; provenance хранится в `verification/`, GitHub issues/PR и Git history.

Latest control audit:
- [`../verification/2026-08-10-full-zero-wave-10-post-rewrite-system-abcd-audit/REPORT.md`](../verification/2026-08-10-full-zero-wave-10-post-rewrite-system-abcd-audit/REPORT.md)

Previous Full-Zero chain:
- [`../verification/2026-08-10-full-zero-wave-01/REPORT.md`](../verification/2026-08-10-full-zero-wave-01/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-02-branch-forensic/REPORT.md`](../verification/2026-08-10-full-zero-wave-02-branch-forensic/REPORT.md)
- [`../verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md`](../verification/2026-08-10-full-zero-wave-03-issue-zeroing/REPORT.md)

## Current state

| Field | Count |
|---|---:|
| Active work units | 4 |
| Direct current defects | 0 |
| Verified necessary improvements | 0 |
| Narrowed residuals | 0 |
| System verification lanes | 4 |
| Owner decisions | 0 |
| Closed/stale/duplicate/absorbed rows in MASTER | 0 |

The current Full-Zero program has four active verification/closure lanes. Historical closed roots, branch inventories, exact prior Product SHAs and completed-wave narratives remain in the linked verification packages and Git history instead of being duplicated into this active matrix.

## SYSTEM VERIFICATION LANES — 4

| ID | Status | Required terminal outcome |
|---|---|---|
| `DEP-1538-DISPOSITION` | `ACTIVE / RED CANDIDATE` | Open Dependabot #1538 (`@dagrejs/dagre 3.0.0→3.1.0`, `astro 7.1.6→7.2.0`) must end as exact-head GREEN+MERGED or explicitly CLOSED-NOT-MERGED. Never merge red merely for zero. |
| `BRANCH-CI-CEMETERY` | `ACTIVE / FORENSIC` | Classify the historical non-main refs by bounded families; delete only with successor/tree/unique-tail proof. Close automated CI-failure issues only for identities proven retired/deleted without falsely claiming CI recovery. |
| `NON-CI-ISSUE-ZEROING` | `ACTIVE / VERIFY` | Terminally disposition the remaining non-CI issue family. Repair only a freshly proven current defect. Preserve future work in AuditRepo queue/roadmap before closing GitHub backlog items when strict open-issue zero is desired. |
| `FINAL-ZERO-AUDIT` | `BLOCKED ON ABOVE 3` | After dependency + branch/CI + non-CI lanes terminate, run one sole fresh-main census/audit. PASS only with open PR=0, no unexplained live red, no orphan required work, terminal branch dispositions, terminal issue dispositions, current main green, MASTER=0. Then STOP. |

## Execution boundaries

- Do not reopen completed roots without fresh current-main evidence.
- Do not delete branches by name or age alone; require successor/tree/unique-tail disposition.
- Do not rerun ancient CI merely to color historical refs green.
- Future/optional work belongs in `WORK_QUEUE.md` or roadmap, not this active defect matrix.
- Current Product HEAD, open PRs, branch census and CI identity are re-read from Product at execution time rather than copied here as durable truth.
- When a lane reaches terminal disposition it leaves this matrix in the same consolidation wave; durable provenance remains in verification/Git history.

## Full-zero Definition of Done

```text
current main green
AND open PR = 0
AND no unexplained intended-to-merge CI red
AND every open issue has terminal disposition
AND every surviving non-main branch is intentionally KEEP
AND every intended-delete branch is actually deleted
AND no orphan release-required unique work
AND future work lives in queue/roadmap instead of bug inventory
AND AuditRepo MASTER active units = 0
→ FULL ZERO
→ STOP
```
