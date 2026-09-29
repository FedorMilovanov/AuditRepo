# AuditRepo closed-superseded-heads-and-ancestors retirement result — 2026-09-29

## Scope

- Original immutable request: [`../requests/2026-09-29-closed-superseded-heads-and-ancestors.json`](../requests/2026-09-29-closed-superseded-heads-and-ancestors.json) (`auditrepo-ref-retirement-closed-superseded-heads-and-ancestors-2026-09-29`)
- Permanent tested engine: `scripts/retire_reviewed_refs.py`
- Accepted request PR: #473, merge commit `9169db35c63c07cc90c4bc6427922f6c06e7fe6e` into `main` (2026-09-29T18:19:41Z). The request was prepared on `main` `38cd473263d2f4646afaba4f438cefa6411ca4b3`, an ancestor of the executed `main`.
- Execution channel: permanent push workflow `auditrepo-ref-retirement.yml`, run `36611264129` (2026-09-29T18:19:44Z to 18:21:35Z), `completed` / `success`, every step success. No fallback channel was needed.
- Machine-readable evidence artifact: `auditrepo-ref-retirement-36611264129` (attached to run `36611264129`, 90-day retention, expires 2026-12-28)
- Product, Research and The Legendary Poet source repositories: not mutated
- `MASTER_BUG_MATRIX.md` files and finding dispositions: not changed

## Reviewed outcome

The fail-closed preflight passed inside the execution run and the engine retired all 10 pinned refs: 2 pure ancestors of `main` and 8 superseded closed-PR heads. Every target was verified as HTTP 404 by the engine after deletion and again independently after the run. There was no partial-retirement state.

### Pure ancestors (2)

`audit/tlp-audit004-evidence-20260913` and `audit/tlp-discovery-evidence-20260913`, both @ `44ee4bb22678ce9965e18c7e1490d5bd2e7d0c52`. They were duplicate refs at one head and never owned a pull request. GitHub compare of `main` against that head reports `ahead_by=0` (status `behind`), and the commit is an ancestor of `main` in the full git graph, so neither ref held anything that `main` lacks.

### Superseded closed-PR heads (8)

| Retired ref | Exact head | Closed PR | Merged replacement |
|---|---|---|---|
| `audit/gb-security-accepted-20260913` | `f65925225a043881265e4ae9910221eda672246d` | #450 | #457 |
| `audit/gb-security-accepted-final-20260913` | `f65925225a043881265e4ae9910221eda672246d` | #456 | #457 |
| `audit/tlp-analytics-property-terminal-20260913` | `dd854683468233756533ac8c56dc2d210031c752` | #462 | #461 |
| `closure/tlp-audit-discovery-final-20260913` | `afdf7a5ad80e6d9f4e2874e3c9008995ca1086ea` | #453 | #458 |
| `closure/tlp-audit-discovery-final2-20260913` | `cfb84515cb688aafad261d2e72943f239493a2f8` | #455 | #458 |
| `reconcile/article-capability-closure-20260908` | `8a5136040ad90f607fa9b13be1c674d17644e90d` | #394 | #395 |
| `reconcile/metadata-ssot-closure-20260908-v2` | `677d5397b273373d0d37abb519dc5ed7e3a068ac` | #400 | #398 |
| `reconcile/metadata-ssot-closure-20260908-v3` | `fd8bca94df100cc8504dbe705ed2019ec6522506` | #401 | #398 |

For every superseded target the reviewed comparison base remained an ancestor of current `main`, and the exact ahead count and changed-path set matched the request. Merged replacement PRs: #457 (`d1e9207d474dee16d46eeb531636fd4a0b101089`), #461 (`c6fb8e4e1eaa0a914b60118668adf90423aaa7c4`), #458 (`816f0521a84d368a6a28b2c72af98f3adeab860e`), #395 (`219410524d92278947044e5409eb3686f85c55ab`) and #398 (`2afb84205cbb14d429c1913b6c89b7fc9998f069`).

Per-target proofs, and the few identifier-level differences that remain only on a closed head (short-form SHAs and one prose mention of Product PR #1873), are enumerated in each target's `reason` in the immutable request.

## Terminal live inventory

The live GitHub branch inventory after execution is exactly 13 branches, with no open pull requests:

- `main` @ `9169db35c63c07cc90c4bc6427922f6c06e7fe6e`;
- the 12 intentional `archive/*` recovery authorities that the request names as required `retainedRefs`. They were never targets and are not cleanup debt.

The request PR's source branch `arena/01a0ee50-auditrepo` (head `0cb02baf86f4c3702b5bf0c5d53ad2ceb199ad7f` of merged PR #473) is absent from that inventory. Result/cleanup PR heads are temporary and are removed by normal post-merge branch cleanup.

Strict forensic inventory (13 remote branches, 454 PRs, 69 closed-unmerged PRs). The run's own `Run post-retirement deep audit` step passed with these zero conditions, and an independent strict re-run of `node scripts/repository_history_forensic_audit.mjs --strict` against the live repository (2026-09-29T18:37Z, `main` `9169db35c63c07cc90c4bc6427922f6c06e7fe6e`) reproduced them:

- `inaccessibleClosedHeads`: `0`
- `manualReviewCandidates`: `0`
- `unexplainedRemoteBranches`: `0`

Class reconciliation: `main` (1) and intentional `archive/*` recovery authorities (12). No open-PR heads, explained closed-PR heads, pure-ancestor refs or orphan refs remain. The 8 closed PRs whose branch names were retired (#394, #400, #401, #450, #453, #455, #456, #462) remain closed-unmerged and classified `superseded`, and their heads stay accessible through GitHub and through `refs/pull/N/head` at the exact reviewed SHAs.

No raw audit evidence was deleted. Removing the 10 branch names removed nothing that was not already reachable from `main` (the 2 ancestors) or recoverable at the identical SHA from the closed PR head (the 8 superseded refs). The archive authorities were not touched.

The run artifact expires on 2026-12-28. This record and the immutable request are the permanent account of the reviewed allowlist and the terminal state.
