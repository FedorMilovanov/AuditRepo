# Working master bug matrix — The Legendary Poet

**Matrix type:** working synthesis, not canonical verified closure.  
**Initial audit baseline:** `FedorMilovanov/TheLegendaryPoet main@19598947c20cd2dd94abd232fbf6fb8a05c3575a`.  
**Current production after W0:** `69e5d3931bc1d1af635efeaf98c76cf36ce30f41`.

| ID | Sev | Working status | Root cause | Repair lane | Evidence / closure barrier |
|---|---|---|---|---|---|
| TLP-SYS-001 | P1 | fixed-current | Current technical truth was distributed across stale and live documents. | W0 / source #303 | exact tested head `d33203e`, all PR gates success, squash production `69e5d39` |
| TLP-SYS-002 | P1 | fixed-current | Workflow path filters were not tree-validated and referenced retired surfaces. | W0 / source #303 | live filters + dependency-free path validator on production `69e5d39` |
| TLP-SYS-003 | P1 | AuditRepo repair-open | No one working root-cause matrix existed for open TLP architecture lanes. | AuditRepo #177 | AuditRepo Validate is green; becomes fixed only after this PR merges |
| TLP-RUNTIME-001 | P2 | fixed-current | Daily item epoch used local timezone/DST. | W0 / source #303 | deterministic UTC validator, CI and Manual Browser QA 4/4 on tested head |
| TLP-REPRO-001 | P1 | fixed-current | Multiple Playwright versions installed outside lockfile. | Source #302 / AuditRepo #175 | already closed on production `19598947`; do not reopen without regression evidence |
| TLP-ARCH-001 | P1 | repair-open | Dead Article model remains beside live Essay model. | W1 / source #306 | archive 5 exact drafts, remove legacy runtime, preserve redirects, check/build/browser |
| TLP-ARCH-002 | P2 | confirmed-current | Essay publication mutates imported objects. | W2 | immutable builder, schema tests, generated output parity, browser pass |
| TLP-COMM-001 | P1 | confirmed-current | Global startup hydrates full ratings/comments corpus. | W3 | target aggregate RPC/view, paginated comments, offline/failure/browser tests |
| TLP-PERF-001 | P2 | monitor | Entry bundle has limited margin below hard ceiling. | W4 | route chunk budgets and current exact production measurement |
| TLP-CI-001 | P2 | confirmed-current | Repeated workflow setup creates drift. | W4 | reusable primitives with preserved acceptance coverage |
| TLP-QA-001 | P2 | needs-browser-synthesis | Strong implementation contracts need reader-outcome synthesis. | W5 | cross-browser production-like task matrix |
| TLP-CLEAN-001 | P2 | confirmed-current | Old branches and dormant candidates lack retirement classification. | W6 | extraction ledger, archive pointers, zero unclassified remote branches |
| TLP-GOV-001 | P2 | owner-decision | Generic package identity, engine/license/release policy unresolved. | Separate governance | explicit owner decision; agents must not invent license/version |

## Matrix rules

- A source PR does not change a row to `fixed-current` until exact tested head, merge SHA and current-source presence are recorded.
- Page-specific symptoms must be linked to one matrix root cause instead of receiving duplicate canonical IDs.
- Closed source #286 and #302 waves remain separate immutable closures.
- Working statuses are synthesis decisions; canonical verified promotion still follows the AuditRepo multi-witness protocol.
