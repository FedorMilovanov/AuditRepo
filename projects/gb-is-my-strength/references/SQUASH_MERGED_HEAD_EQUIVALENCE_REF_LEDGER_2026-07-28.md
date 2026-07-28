# Squash-merged head-equivalence ref ledger — 2026-07-28

**Status:** verified pre-normalization authority  
**Source repository:** `FedorMilovanov/gb-is-my-strength`  
**Inventory run:** `30321213288`  
**Current site main at review start:** `0f7cefbb20abb17c65872e53c00c733c480f2a97`

## Proof standard

Each branch below was classified `SQUASH_PATCH_EQUIVALENCE_REVIEW` because its commits diverge from current `main` after squash merge. For every branch, GitHub PR metadata proves that the current branch SHA exactly equals the head SHA of a successfully merged PR. Therefore the branch tree was the reviewed input to the recorded squash merge; the product result is represented in `main`, while the original branch state remains recoverable from this ledger.

| Branch | Original/current branch SHA | Merged PR | PR head SHA | Merge commit | Proof |
|---|---|---:|---|---|---|
| `fix/gill-editorial-content-integrity` | `600fd33ffdf6ff6070e43bb35d4600543f8efe91` | `#76` | `600fd33ffdf6ff6070e43bb35d4600543f8efe91` | `323d2dd03934d29f640455562c5559f5e08aeed6` | exact head equality |
| `fix/gill-part4-propagate-sibling-grids` | `810e723c614631d43815e8154b83b2b602ab4f31` | `#71` | `810e723c614631d43815e8154b83b2b602ab4f31` | `b8459bdf43a87c7d7a12716515802cd0eebaa847` | exact head equality |
| `lane/system-map-engine-p0-runtime-2026-07-21` | `c959291b7304198e073e3f81edca7a2eb452d37e` | `#96` | `c959291b7304198e073e3f81edca7a2eb452d37e` | `1f80f12d8bea9a9eb2c196ed030ddfc5be3924df` | exact head equality |
| `lane/system-map-initial-state-2026-07-21` | `4cbbf2e6273294bcb43aa458b1cb0e18d21b0dc9` | `#97` | `4cbbf2e6273294bcb43aa458b1cb0e18d21b0dc9` | `1a66bd8ef6c0316842deef75371db9598f7a16c6` | exact head equality |
| `lane/system-runtime-integrity-2026-07-21` | `a14f56af652e5e4208224d773b9402db8dffbb21` | `#95` | `a14f56af652e5e4208224d773b9402db8dffbb21` | `779c23c1d705c9561248a641eedc5c2373511e97` | exact head equality |
| `research/reader-platform-inventory-2026-07-21` | `9fe3a4b871d3e0c1492910ea6b48308efe2118a9` | `#99` | `9fe3a4b871d3e0c1492910ea6b48308efe2118a9` | `57be673ec7606f2a6bec6e497b9440514eb85f2f` | exact head equality |

## Scope notes

- PR `#71`: Gill sibling-series grid propagation.
- PR `#76`: Gill editorial-content integrity and language semantics.
- PR `#95`: shared runtime integrity, scroll-lock coordination and quote hardening.
- PR `#96`: map runtime P0 fixes and publication-gate restoration.
- PR `#97`: map initial-state/deep-link unification.
- PR `#99`: reader-platform source inventory merged as research evidence.

## Normalization authority

After this ledger merges, these six refs may be moved with `force: true` to the exact current site `main`, because a fast-forward is impossible after squash merge. No branch deletion is authorized. An old state remains recoverable by creating a forensic branch from the recorded original SHA.
