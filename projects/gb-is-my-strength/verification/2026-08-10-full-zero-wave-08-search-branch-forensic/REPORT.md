# Full Zero Wave 08 — Search / Noop / CI Branch Forensic

Date: 2026-08-10  
Product: `FedorMilovanov/gb-is-my-strength`  
Mode: read / cleanup only; **no Search repair and no Product source changes**

## Live anchor and family

Fresh authority: `main@f0ec90563ec5ae7eec439f78d0729694267af6df`.

All six requested refs existed at preflight:

- `noop`
- `tmp/noop-search-ci-tree-20260808`
- `ci/search-modal-contract-compute-20260805`
- `ci/search-modal-contract-compute2-20260805`
- `ci/search-modal-contract-compute3-20260805`
- `ci/search-modal-contract-compute4-20260805`

Names were not trusted as evidence. Each ref was compared against fresh main and linked to its Search successor chain.

`#1242/#1243` were not modified by this lane.

## Branch table

| branch | current head | ahead/behind vs fresh main | observed tree/tail | canonical successor | disposition | deleted |
|---|---|---:|---|---|---|---|
| `noop` | `e65cba329cd34158ffbf33dd287f126b10fa94d1` | ahead 15 / behind 138 | large historical Search + asset-revision projection tree; final two commits are net-zero CI-trigger history relative to `tmp` | #1207 exact-tree transaction → merged #1209 and later Search authority repairs | **SUPERSEDED — SAFE DELETE** | no — remote branch deletion unavailable |
| `tmp/noop-search-ci-tree-20260808` | `88d3b3d02cfa85306daaa68ff88b0ad0de3ff70e` | ahead 13 / behind 138 | Search semantic files plus broad generated asset-revision projection and deterministic Pagefind fixture/history | #1207 → merged #1209 | **SUPERSEDED — SAFE DELETE** | no |
| `ci/search-modal-contract-compute-20260805` | `2d7cd83bb9431f73c5ac6c9b94ad348edb3ea8b5` | ahead 5 / behind 219 | compute/workflow/test reconciliation; not final clean Product owner | closed #1021 → #1025/#1030/#1034 → merged #1039 | **SUPERSEDED — SAFE DELETE** | no |
| `ci/search-modal-contract-compute2-20260805` | `dc838e1f4d14c9ab9a12580f8a3363cdcb7a0945` | ahead 6 / behind 217 | generic exact-head compute workflow plus Search compute ancestry | closed #1025 → #1030/#1034 → merged #1039 | **SUPERSEDED — SAFE DELETE** | no |
| `ci/search-modal-contract-compute3-20260805` | `e08bfe19b4cb4ce735075275964e1aed42c449e0` | ahead 6 / behind 214 | WebKit/44px reconciliation helper and compute ancestry | closed #1030 → #1034 → merged #1039 | **SUPERSEDED — SAFE DELETE** | no |
| `ci/search-modal-contract-compute4-20260805` | `5245ff89292e0b6d981b9b1eeb7fd0a198acfe64` | ahead 7 / behind 212 | materialized final Search Product tree + generated revision projections; temporary publisher/compute machinery removed in final commit | closed #1034 → clean one-commit merged #1039; later #1209 Search continuation | **SUPERSEDED — SAFE DELETE** | no |

## 1. `noop` and `tmp/noop-search-ci-tree-20260808`

The previous warning that these names hid a large historical Search tail was correct and was reverified. Neither ref is a trivial empty branch by ancestry count.

### Fresh tree facts

Both refs diverge from current main from the same old Search-era merge base (`21b437cb…`) and present a broad changed tree. The changed paths mix four different classes:

1. **semantic Search Product work** — notably `js/search.js`, `css/command-palette.css` and associated Search runtime/source contracts;
2. **generated asset-revision projection** — many HTML/Astro consumers and `src/lib/asset-version.js` whose bytes change when Search CSS/JS revision hashes change;
3. **transport / exact-tree history** — temporary transaction and fixture material used to prove a final Search tree;
4. **diagnostic-only CI triggers** — especially the net-zero tail on `noop`.

Direct comparison `tmp/noop-search-ci-tree-20260808` → `noop` shows `noop` ahead by 2, behind 0, with **no net changed files**. Those two later commits are therefore history-only trigger activity, not a semantic Product fork.

### Canonical Search continuation receipt

PR #1207 is the explicit transaction/evidence predecessor. Its base is the same `21b437cb…` lineage and its record says the final Product tree is handed off unchanged to successor #1209; #1207 is not the merge vehicle.

PR #1209 is merged. It is the canonical truthful Search continuation and owns the current Search semantics across:

- `js/search.js`;
- command-palette presentation;
- Search source/runtime contract;
- browser contract;
- deterministic projection/revision consumers.

The `tmp` tree is an ancestor/materialization stage in that #1207→#1209 chain. `noop` has the same net tree as `tmp` plus two net-zero CI trigger commits. Later current-main Search authority repairs build on #1209 rather than reviving either historical ref.

Therefore the large ahead count is explained: it is a squash/transaction ancestry artifact plus generator projection, not stranded Search work.

Verdict for both: **SUPERSEDED — SAFE DELETE**.

## 2. `ci/search-modal-contract-compute*` chain

The four compute refs were evaluated as an explicit sequential lifecycle, not independently by their names.

### compute1 — PR #1021

Current head: `2d7cd83bb9431f73c5ac6c9b94ad348edb3ea8b5`.

Fresh compare shows Search browser/workflow/reconciliation work. PR #1021 is closed unmerged and explicitly superseded by #1025 with no unique Product repair left behind.

### compute2 — PR #1025

Current head: `dc838e1f4d14c9ab9a12580f8a3363cdcb7a0945`.

The head itself is a compute-control change (`make compute exact-head generic`). PR #1025 is closed unmerged and superseded by #1030. This is control-plane/compute ancestry, not a canonical Search Product owner.

### compute3 — PR #1030

Current head: `e08bfe19b4cb4ce735075275964e1aed42c449e0`.

Its visible forward commit is a reconciliation helper for exact 44px WebKit geometry evidence. #1030 is closed unmerged and its durable logic was carried to #1034 / the clean successor chain.

### compute4 — PR #1034

Current head: `5245ff89292e0b6d981b9b1eeb7fd0a198acfe64`.

This branch is the important squash/semantic case. Its tree contains the materialized accessible top-layer Search modal result plus widespread revision projection, while the final commit also removes temporary compute/publisher machinery. A simple ahead/behind check would therefore be misleading.

PR #1034 explicitly records that the computed final Product tree is superseded by one clean canonical current-main successor, #1039. #1039 merged the final Search modal Product semantics without the temporary compute/patcher/publisher/materializer history.

Merged #1039 is therefore the exact containment receipt for this compute family; merged #1209 and later Search authority repairs subsequently evolved the same Search owners.

Verdict for all four compute refs: **SUPERSEDED — SAFE DELETE**.

## Semantic vs generated vs transport classification

### Semantic Product work

Retained in canonical merged Search lanes (#1039, then #1209 and successors):

- accessible command palette ownership;
- top-layer modal/focus/ARIA behavior;
- Search runtime/source contract;
- Search discovery behavior and truthful continuation.

### Generated asset-revision projection

Historical branches touch many HTML/Astro files because Search CSS/JS revision hashes were regenerated. Those bytes are generator projections tied to a particular Product head. Current main's generator-owned revision state is authoritative; stale revision snapshots are not cherry-pick candidates.

### Transport ancestry

Temporary compute/reconciliation/publisher mechanics were explicitly removed before clean successor merge or excluded by clean replay. They are historical evidence, not Product owners.

### Diagnostic-only commits

`noop`'s final two commits have zero net tree difference from `tmp`; they are pure CI trigger/history.

## No resurrection boundary

No old Search code was transferred back to main. No Search repair PR was created. Issues #1242/#1243 were not edited or implemented.

## Deletion execution boundary

All six refs meet the semantic criteria for deletion. Actual branch deletion was not executed because the GitHub connector surface available in this session has no remote branch/ref delete operation and there is no separately authenticated local `gh` transport. `deleted=no` is therefore a tooling limitation, not a MANUAL REVIEW verdict.

## MASTER recommendation

Classify `noop`, `tmp/noop-search-ci-tree-20260808`, and all four `ci/search-modal-contract-compute*` refs as **SUPERSEDED — SAFE DELETE**. The useful Search semantics are contained in merged #1039, merged #1209 and later current-main Search authority; broad asset-revision differences are generated projection and the remaining transport/diagnostic commits are history-only. Delete the refs directly when remote branch deletion is available; do not replay their Search code.
