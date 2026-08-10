# Full Zero Wave 12A — Post-Rewrite Product→Research Release Witness Repair

Date: 2026-08-10

Status: **MERGED — POST-REWRITE RELEASE WITNESS GREEN**

## Scope

Product: `FedorMilovanov/gb-is-my-strength`

Starting Product main: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`

Sole lifecycle root: Product issue `#753 — Product to Research release witness [branch main]`.

Known failing run: `31352503654`.

Known failing step: `Validate immutable and scoped Wave 12 transaction`.

This was a SYSTEM/control-plane repair after the repository history rewrite. It was not a Product feature, not a new Diotrophes wave, and did not republish or alter Diotrophes content.

## Root cause

The failing workflow performed a complete Product checkout (`fetch-depth: 0`) correctly. The first real failure was the historical ancestry probe against the retired pre-rewrite release boundary:

```text
git merge-base --is-ancestor 8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97 HEAD
fatal: Not a valid commit name 8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97
```

The active release witness and permanent Wave 12 transaction validator still used pre-history-rewrite commit objects. Those objects were no longer members of current owner-managed Product history, so `git merge-base`, `git show`, and `git worktree add` could not use them even though the historical publication proof itself remained valid.

## Rewritten identity mapping

| Authority | Retired pre-rewrite identity | Proven post-rewrite identity |
| --- | --- | --- |
| `PRE_WAVE12` | `2273b8c930eebf383d429b917d3636bc28a80bae` | `289cea9b1f8fb4284aac0c712e23e83fb25b00f0` |
| `RELEASE_BOUNDARY` | `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97` | `fbd305a54ded904931275eb9510647994c32b5ea` |
| `HISTORICAL_VALIDATOR` | `b90103f1bf4020873c89454a36b6cd367c6348a6` | `aaf0ba7ff95afcd1c6f1488de9798c2a48b4386b` |

No explicit durable old→new commit-map artifact was found. Therefore no replacement SHA was accepted merely because its commit message looked similar. Equivalence was reconstructed from the retained history-rewrite receipt, post-rewrite ancestry, exact relevant blob identities, and the Wave 12 transaction semantics below.

## Equivalence proof

The prior history-rewrite control receipt in AuditRepo (`projects/gb-is-my-strength/verification/2026-08-10-history-image-rewrite-final-control/REPORT.md`, receipt commit `a58da5ba08554fe0bc0108fe61feb3fc5f389079`) records that owner-managed commit identities were rewritten while semantic Product content/tree authority was preserved.

Post-rewrite ancestry was proven in the required order:

```text
289cea9b1f8fb4284aac0c712e23e83fb25b00f0
  → aaf0ba7ff95afcd1c6f1488de9798c2a48b4386b
  → fbd305a54ded904931275eb9510647994c32b5ea
  → current main
```

The historical validator source is byte-identical at the old and rewritten historical-validator identities:

- old `b90103f1bf4020873c89454a36b6cd367c6348a6`: `scripts/diotrophes-wave12-release-contract.mjs` blob `b17f707254ac340d04016a27b1865124d5326864`;
- rewritten `aaf0ba7ff95afcd1c6f1488de9798c2a48b4386b`: the same blob `b17f707254ac340d04016a27b1865124d5326864`.

The release-boundary validator is also byte-identical at the old and rewritten boundary:

- old `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97`: blob `c360c489927a0879a3c64e6e901a48b426c141ea`;
- rewritten `fbd305a54ded904931275eb9510647994c32b5ea`: the same blob `c360c489927a0879a3c64e6e901a48b426c141ea`.

All five transaction-critical registry blobs are identical between old and rewritten `PRE_WAVE12`:

- `migration/page-ownership.json`: `9deac175d7d99924cd5cb7763900720c2b33f356`;
- `migration/route-migration-matrix.json`: `5564906910841f19278c9765f0a737fe413cd4e1`;
- `data/route-search-policy.json`: `2d6172058c9b7412fcb9331ef9145f7349a71315`;
- `data/search-manifest.json`: `fed2f6ff783d6381a201e21452fdec959233a8e1`;
- `data/series.json`: `361e5361480372b2c7f1000287ab0d9c82fcd64f`.

The corresponding five transaction-critical registry blobs are likewise identical between old and rewritten `RELEASE_BOUNDARY`:

- `migration/page-ownership.json`: `364e4ebfeb439061fcdb1311f3be9e4cc5a1b00d`;
- `migration/route-migration-matrix.json`: `b6f2fbb18782c353f4574f8fab46629ebee859fe`;
- `data/route-search-policy.json`: `6049553f0ecc016dd52b3062a3223d535584f2fd`;
- `data/search-manifest.json`: `952cfbd8b276fc7e877a784660fb4481dc8bd83f`;
- `data/series.json`: `0664f92102940056ac4f31ea62ab36d8627be94a`.

The old immutable `productBaseSha` in the release manifest was deliberately not rewritten. It remains historical publication provenance. The repair separates that immutable provenance identity from executable Git anchors used by current-history `merge-base`, `show`, and `worktree` operations.

## Repair

Exactly one implementation branch was created from the exact starting main:

`agent/post-rewrite-release-witness-20260810`

Exactly one Product PR was used: `#1544 — fix(ci): rebind release witnesses to post-rewrite history`.

Exactly five Product control-plane files changed:

1. `.github/workflows/product-research-release-witness.yml`
2. `.github/workflows/diotrophes-wave12-release.yml`
3. `scripts/diotrophes-wave12-transaction-scope-contract.mjs`
4. `scripts/diotrophes-wave12-release-contract.mjs`
5. `scripts/diotrophes-wave12-history-anchor-contract.mjs` (new permanent regression contract)

The new machine contract is fail-closed and verifies all of the following:

- executable anchors are exact 40-character commit SHAs;
- each executable anchor exists as a commit object in the current full-history checkout;
- ancestry remains `PRE_WAVE12 → HISTORICAL_VALIDATOR → RELEASE_BOUNDARY → HEAD`;
- the historical validator source remains pinned to exact blob `b17f707254ac340d04016a27b1865124d5326864`;
- immutable pre-rewrite `productBaseSha` provenance still agrees with the pinned historical validator and the release manifest;
- both release workflows and current transaction/release contracts agree on the rewritten executable identities;
- an active current control-plane contract cannot silently retain the retired pre-rewrite executable `PRE_WAVE12` identity;
- temporary historical-validator rebinding is allowed only from an exact byte copy of the pinned historical validator and only at the two structurally verified identity/provenance assertions.

The transaction-scope validator still compares the same PRE→BOUNDARY semantic transaction and retains all previous preservation/addition assertions. Merge-base assertions were not removed. The release witness was not disabled. No `continue-on-error` was introduced. Notifier coverage was not reduced.

No Diotrophes article/content/data release authority was changed. `data/diotrophes-wave12-release-manifest.json` was not changed. Product issues `#54` and `#1244` were not touched. Cemetery refs were not touched.

## Pre-merge proof

Final pre-merge topology:

- base/current main: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`;
- exact PR head: `33cd37ce2948d9bd136da67c2b1a78a1fd237e92`;
- behind current main: `0`;
- mergeable: `true`;
- review submissions: `0`;
- unresolved review threads: `0`;
- diff: exactly the five control-plane files listed above.

Exact-head CI on `33cd37ce2948d9bd136da67c2b1a78a1fd237e92`:

| Gate | Run | Result |
| --- | --- | --- |
| Node Toolchain Contract | `31374467519` | SUCCESS |
| Shared Files Guard | `31374467533` | SUCCESS |
| Metadata & IndexNow Readiness | `31374467562` | SUCCESS |
| Product to Research release witness | `31374467868` | SUCCESS |
| Diotrophes Wave 12 release | `31374467483` | SUCCESS |

The exact-head Product→Research witness `31374467868` passed the rewritten immutable/scoped Wave 12 transaction proof, current Wave 10–12/canonical authorities, Pihahiroth authority, registries/types/publication policy, production-like build, Pihahiroth desktop/mobile/no-JS browser witness, Wave 12 Chromium/WebKit/no-JS/print witness, and tracked-source immutability.

The independent exact-head Diotrophes Wave 12 release `31374467483` also passed historical/scoped transaction authority, registries/Astro checks, production-like build/Pagefind, Chromium/WebKit/no-JS/print, and tracked-source immutability. This independently proves the repair was not made green only for one workflow path.

## Merge

PR `#1544` was squash-merged with expected head `33cd37ce2948d9bd136da67c2b1a78a1fd237e92`.

Merge SHA: `9156ccb714acbf1a1ba5eef4d0972abd4a7bf83f`.

A fresh post-merge read confirmed Product `main` at exactly:

`9156ccb714acbf1a1ba5eef4d0972abd4a7bf83f`.

## Mandatory post-merge recovery witness

A new push-to-main **Product to Research release witness** ran on the actual merged current-main SHA:

- run ID: `31375330382`;
- SHA: `9156ccb714acbf1a1ba5eef4d0972abd4a7bf83f`;
- conclusion: **SUCCESS**;
- job: `93413160674`;
- completed: `2026-08-10T09:51:37Z`.

Every required post-merge job stage completed successfully, including:

- exact complete Product history checkout;
- immutable/scoped Wave 12 transaction validation;
- current Wave 10–12 and canonical discovery validation;
- Pihahiroth authority/map projection;
- current registry/type/publication-policy checks;
- production-like build;
- Pihahiroth desktop/mobile/no-JS browser witness;
- Wave 12 Chromium/WebKit/no-JS/print witness;
- tracked-source immutability;
- combined release evidence upload.

The notifier then automatically closed lifecycle issue `#753` as `completed`/recovered against this exact run and SHA at `2026-08-10T09:51:39Z`. No manual closure was used.

## Audit disposition

This file is the verification receipt for the terminal repair.

`MASTER.md` was not edited.

Work Queue was not edited because there is no unresolved incompatibility or follow-up defect from this repair.

Residual: **NONE**.
