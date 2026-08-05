# Working master bug matrix — The Legendary Poet

**Matrix type:** working synthesis, not canonical verified closure.  
**Source baseline:** `FedorMilovanov/TheLegendaryPoet main@19598947c20cd2dd94abd232fbf6fb8a05c3575a`.

| ID | Sev | Working status | Root cause | Repair lane | Closure evidence required |
|---|---|---|---|---|---|
| TLP-SYS-001 | P1 | repair-open | Current technical truth is distributed across stale and live documents. | W0 / source #303 | merged source SHA + contract workflow + current-doc review |
| TLP-SYS-002 | P1 | repair-open | Workflow path filters are not tree-validated and referenced retired surfaces. | W0 / source #303 | exact-head workflow run and post-merge push trigger proof |
| TLP-SYS-003 | P1 | AuditRepo repair-open | No one working root-cause matrix for open TLP architecture lanes. | This AuditRepo PR | AuditRepo Validate + verifier adoption/promotion decision |
| TLP-RUNTIME-001 | P2 | repair-open | Daily item epoch used local timezone/DST. | W0 / source #303 | deterministic UTC validator + browser smoke after merge |
| TLP-REPRO-001 | P1 | fixed-current | Multiple Playwright versions installed outside lockfile. | Closed by source #302 / AuditRepo #175 | already recorded; do not reopen without regression evidence |
| TLP-ARCH-001 | P1 | confirmed-current | Dead Article model remains beside live Essay model. | W1 | migration ledger, zero unique data loss, no legacy imports, route/browser pass |
| TLP-ARCH-002 | P2 | confirmed-current | Essay publication mutates imported objects. | W2 | immutable builder, schema tests, generated output parity, browser pass |
| TLP-COMM-001 | P1 | confirmed-current | Global startup hydrates full ratings/comments corpus. | W3 | target aggregate RPC/view, paginated comments, offline/failure/browser tests |
| TLP-PERF-001 | P2 | monitor | Entry bundle has limited margin below hard ceiling. | W4 | route chunk budgets and current exact production measurement |
| TLP-CI-001 | P2 | confirmed-current | Repeated workflow setup creates drift. | W4 | reusable primitives with preserved acceptance coverage |
| TLP-QA-001 | P2 | needs-browser-synthesis | Strong implementation contracts need reader-outcome synthesis. | W5 | cross-browser production-like task matrix |
| TLP-CLEAN-001 | P2 | confirmed-current | Old branches and dormant candidates lack retirement classification. | W6 | extraction ledger, archive pointers, zero unclassified remote branches |
| TLP-GOV-001 | P2 | owner-decision | Generic package identity, engine/license/release policy unresolved. | Separate governance | explicit owner decision; agents must not invent license/version |

## Matrix rules

- A source PR does not change a row to `fixed-current` until merge SHA and current-production reverify exist.
- Page-specific symptoms must be linked to one matrix root cause instead of receiving duplicate canonical IDs.
- Closed source #286 and #302 waves remain separate immutable closures.
- Severity and status promotions require evidence under the AuditRepo multi-witness protocol.
