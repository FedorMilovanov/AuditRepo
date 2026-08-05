# Working master bug matrix — The Legendary Poet

**Matrix type:** working synthesis, with fixed rows backed by exact source production.  
**Initial audit baseline:** `FedorMilovanov/TheLegendaryPoet main@19598947c20cd2dd94abd232fbf6fb8a05c3575a`.  
**Current production after W0 + discovery/Safari + W1 + W2:** `a248abd54007bd839ffc149b9195dc4e79dc5dd3`.

| ID | Sev | Working status | Root cause | Repair lane | Evidence / closure barrier |
|---|---|---|---|---|---|
| TLP-SYS-001 | P1 | fixed-current | Current technical truth was distributed across stale and live documents. | W0 / source #303 | exact tested head `d33203e`, all PR gates success, squash production `69e5d39` |
| TLP-SYS-002 | P1 | fixed-current | Workflow path filters were not tree-validated and referenced retired surfaces. | W0 / source #303 | live filters + dependency-free path validator on production `69e5d39` |
| TLP-SYS-003 | P1 | fixed-current | No one working root-cause matrix existed for open TLP architecture lanes. | AuditRepo #177 | matrix, branch ledger and wave plan merged as `9ab07e7`; closure promoted in current verification |
| TLP-RUNTIME-001 | P2 | fixed-current | Daily item epoch used local timezone/DST. | W0 / source #303 | deterministic UTC validator, CI and Manual Browser QA 4/4 on tested head |
| TLP-REPRO-001 | P1 | fixed-current | Multiple Playwright versions installed outside lockfile. | Source #302 / AuditRepo #175 | closed on production `19598947`; retained by later matrices |
| TLP-DISC-001 | P1 | fixed-current | CI proved regenerated sitemap/feed idempotence but did not prove committed files matched canonical data. | Inter-wave / source #305 | byte-level committed artifact validator in `check:content`; production `44a36bd`, retained in current production |
| TLP-QA-002 | P2 | fixed-current | Safari brand-source audit enumerated placements before the route-loading shell settled. | Inter-wave / source #305 | official readiness wait + real raster count; exact Manual Browser QA 4/4 |
| TLP-ARCH-001 | P1 | fixed-current | Dead Article model remained beside live Essay model. | W1 / source #308 | 5 drafts archived with SHA-256, runtime schema/export removed, redirects retained, content-model gate, production `e06bdfc` |
| TLP-ARCH-002 | P2 | fixed-current | Essay publication mutated imported authoring objects and wrote derived metadata in place. | W2 / source #311 | exact head `8eaeaa4`; clone/override/derived-read-time/deep-freeze boundary; raw-before-index snapshot validator; all 13 PR workflows successful; Manual Browser QA 4/4; production `a248abd` |
| TLP-COMM-001 | P1 | active-current | `App` unconditionally starts remote hydration; the client can page through 20,000 ratings plus 20,000 comments, persists the global corpus, then target stores filter it locally. | W3 | zero community reads on generic startup; target aggregate endpoint/view; bounded cursor comments; aggregate-only leaderboard; preserved outbox/offline/cooldown/helpful/cross-tab behavior; exact-head browser request-topology proof |
| TLP-PERF-001 | P2 | monitor | Entry bundle has limited margin below hard ceiling. | W4 | route chunk budgets and current exact production measurement |
| TLP-CI-001 | P2 | confirmed-current | Repeated workflow setup creates drift. | W4 | reusable primitives with preserved acceptance coverage |
| TLP-QA-001 | P2 | needs-browser-synthesis | Strong implementation contracts need broader reader-outcome synthesis. | W5 | cross-browser production-like task matrix |
| TLP-CLEAN-001 | P2 | confirmed-current | Old branches and dormant candidates lack retirement classification. | W6 | extraction ledger, archive pointers, zero unclassified remote branches |
| TLP-GOV-001 | P2 | owner-decision | Generic package identity, engine/license/release policy unresolved. | Separate governance | explicit owner decision; agents must not invent license/version |

## Matrix rules

- A source PR does not change a row to `fixed-current` until exact tested head, merge SHA and current-source presence are recorded.
- Page-specific symptoms must be linked to one matrix root cause instead of receiving duplicate canonical IDs.
- Closed source #286, #302, #303, #305, #308 and #311 waves remain separately attributable even when a later production SHA contains all repairs.
- `active-current` means the root cause is confirmed on current production and owns the next isolated source lane; it does not imply partial closure.
- Working statuses are synthesis decisions; canonical verified state is recorded under `verified/` and `reverify/`.
