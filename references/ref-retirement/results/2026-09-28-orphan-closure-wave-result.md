# AuditRepo orphan-closure-wave retirement result — 2026-09-28

## Scope

- Original immutable request: [`../requests/2026-09-28-orphan-closure-wave.json`](../requests/2026-09-28-orphan-closure-wave.json) (`auditrepo-ref-retirement-orphan-closure-wave-2026-09-28`)
- Permanent tested engine: `scripts/retire_reviewed_refs.py`
- Accepted request PR: #471, merge commit `5dadd52e` into `main`
- Execution channel: permanent push workflow `auditrepo-ref-retirement.yml`, run `36402372728`, all steps success
- Machine-readable evidence artifact: `auditrepo-ref-retirement-36402372728` (attached to run `36402372728`)
- Product, Research and The Legendary Poet source repositories: not mutated
- `MASTER_BUG_MATRIX.md` files and finding dispositions: not changed

## Reviewed outcome

The fail-closed preflight passed inside the execution run and the engine retired both pinned orphan refs that had kept the weekly repository-history forensic audit red since 2026-09-23:

- `closure/tlp-audit-discovery-20260913` @ `0846fa17197131050882c5065c46035fe6ad08e0` — superseded. Comparison base `8dd7be24fd6e23fb9dc29d5ae7ae2865332e224d` remained an ancestor of current `main`; ahead count `5` and the exact five-path changed set matched; merged replacement PR #458 (`816f0521a84d368a6a28b2c72af98f3adeab860e`) carries the branch's two unique reverify blobs byte-identically (`3b5f7955…` audit-harness closure, `5a30ec99…` discovery closure).
- `repair/gb-source-surface-audit-completeness-closure-20260907` @ `dc509dc21b67fde280b127c23ed719186d6c4e30` — archive-preserved. The exact head is preserved by the required archive authority `archive/forensic-gb-source-surface-closure-20260907` at the identical SHA; the raw 114-line reverify bound to Product main `fc2e4570…` remains fully reachable. The closure conclusion itself (`SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`, Product #1829 / merge `4750b649…`) is already recorded in current gb MASTER.

The merged-maintenance source branch of the request PR was removed by the engine after verifying it as the exact head of merged PR #471. There was no partial-retirement state.

## Terminal live inventory

Independent post-execution strict forensic inventory (24 remote branches, 452 PRs, 69 closed-unmerged PRs):

- `inaccessibleClosedHeads`: `0`
- `manualReviewCandidates`: `0`
- `unexplainedRemoteBranches`: `0`

Class reconciliation: `main` (1), intentional `archive/*` recovery authorities (12), explained closed-superseded PR heads (8), pure ancestors of `main` (2), open PR #468 head `arena/01a0d074-auditrepo` (1).

No raw audit evidence was deleted. Removing two source branch names and one merged maintenance branch removed nothing that was not already byte-identical in `main` or preserved under the required archive authority.
