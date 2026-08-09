# Full-Zero Closure Audit — Wave 02: Branch Forensic

Date: 2026-08-10 (+03)
Product anchor at start: `main@9e9556a2e0a389b351ea4f0490275128a6eed046`
Parent report: [`../2026-08-10-full-zero-wave-01/REPORT.md`](../2026-08-10-full-zero-wave-01/REPORT.md)

## Purpose

Begin branch-cemetery classification by bounded families instead of deleting remote refs by name or age.

Wave 02 inspected the complete current `transport/*` family (13 refs) and sampled the obvious `noop` / `tmp/noop-*` family.

No Product mutation and no branch deletion is performed by this report.

## Rule used

A branch is deletion-safe only when one of these is proven:

1. `ahead_by=0` versus current `main`; or
2. all unique semantic work is proven absorbed by a named merged successor/current main; or
3. the ref is explicitly diagnostic/transaction history and its useful evidence is preserved elsewhere.

A scary `ahead_by>0` does **not** automatically mean unfinished Product work, and a harmless-looking branch name does **not** automatically mean safe delete.

## `transport/*` census — 13/13 inspected

### Tier A — SAFE DELETE by ancestry

These refs have `ahead_by=0` against current Product main and therefore contain no unique commit ancestry:

1. `transport/reader-projection-rebase-20260805`
   - status: behind-only;
   - ahead: **0**;
   - behind: 211.

2. `transport/search-manifest-main-refresh-after-1270-20260808`
   - status: behind-only;
   - ahead: **0**;
   - behind: 124.

These are the first two branches in the current cemetery with direct mathematical deletion proof.

### Tier B — lifecycle transaction history, strong supersession context but final branch-level containment still required

Inspected:

- `transport/lifecycle-retired-identities-20260805` — ahead 1 / behind 224;
- `transport/lifecycle-retired-identities-v2-20260805` — ahead 1 / behind 224;
- `transport/lifecycle-retired-identities-v3-20260805` — ahead 1 / behind 224;
- `transport/lifecycle-retired-identities-v4-20260805` — ahead 2 / behind 224.

The canonical CI-lifecycle repair is no longer unfinished work:

- Product PR `#987` (`fix(ci): retire orphaned failure identities fail-closed`) is **merged**;
- it is the clean successor of `#985`;
- the merged owner permanently implements closed/deleted/fully-integrated identity retirement and explicitly preserves active/ahead identities.

The historical transport refs therefore must not be revived as new Product lanes. However, because their raw ancestry is non-zero, delete them only after a final branch-level check records that their unique commits are materialization/transaction history or are semantically contained by `#987`/current main.

Disposition: **SUPERSEDED/HISTORY-ONLY CANDIDATE — no Product owner**.

### Tier C — legacy-reference transport history, unique ancestry requires named successor mapping

Inspected:

- `transport/legacy-obsolete-writer-20260805` — ahead 1 / behind 219;
- `transport/legacy-obsolete-writer-v2-20260805` — ahead 2 / behind 219;
- `transport/legacy-reference-ledger-20260805` — ahead 2 / behind 222;
- `transport/legacy-reference-ledger-v2-20260805` — ahead 1 / behind 221;
- `transport/legacy-reference-ledger-v3-20260805` — ahead 2 / behind 221;
- `transport/legacy-reference-provenance-20260805` — ahead 1 / behind 220;
- `transport/legacy-reference-provenance-v2-20260805` — ahead 2 / behind 220.

Their compare surfaces contain old ledger/materialization/payload/audit transitions. Current Product has since completed a long canonical Strangler/storage-authority chain and root `#1383` is closed completed, but these seven exact refs still need a direct predecessor→successor/semantic containment receipt before deletion.

Disposition: **MANUAL FORENSIC — likely historical transaction refs, not active work; do not revive, do not delete yet**.

## `noop` / `tmp` sample

### `noop`

- ahead 15 / behind 137;
- despite the name, it is **not** ancestry-empty;
- unique-history compare touches shared Search/modal/browser-contract and many asset-revision projections.

### `tmp/noop-search-ci-tree-20260808`

- ahead 13 / behind 137;
- nearly the same historical Search/revision surface;
- no direct PR text match was found from the branch name alone.

Conclusion: these two refs are **not deletion-safe merely because they say `noop/tmp`**. They require mapping to the canonical merged Search owner/successor chain or a tree/content equivalence proof.

Disposition: **MANUAL FORENSIC — likely transaction/CI materialization history**.

## Important forensic lesson

Raw branch ancestry in this repository is frequently misleading because many old agents used:

- merge-only transport commits;
- generated revision projections;
- one-shot materialization/publisher transactions;
- clean successor PRs after main movement;
- squash merges that preserve semantics but not predecessor commit ancestry.

Therefore branch cemetery must combine:

`ahead/behind + PR state + explicit successor record + changed-owner semantics + current-main containment`.

No one-dimensional “delete every merged-looking/stale branch” rule is safe.

## Current branch results after Wave 02

| Classification | Count in inspected family | Meaning |
|---|---:|---|
| `SAFE DELETE — ahead=0` | 2 | No unique commit ancestry versus current main |
| `SUPERSEDED/HISTORY-ONLY CANDIDATE` | 4 | Canonical lifecycle Product owner is merged; final exact-ref containment receipt still needed |
| `MANUAL FORENSIC — legacy transport` | 7 | Likely historical transaction refs, but exact successor mapping still required |
| `MANUAL FORENSIC — noop/tmp sample` | 2 | Names are misleading; Search/revision unique history exists |

## Next bounded branch wave

Priority order:

1. map the seven legacy-reference transport refs to their canonical Strangler successor PRs and current owners;
2. map `noop` / `tmp/noop-search-ci-tree-20260808` to the Search successor chain;
3. inspect the four old `ci/search-modal-contract-compute*` branches;
4. then process explicit `r2/r3/r4/r5` predecessor families;
5. leave archive authorities and any branch with unexplained unique semantic code until last.

## Wave 02 verdict

The cleanup is feasible, but the repository confirms that branch count cannot be reduced safely by naming convention alone.

Two transport refs are already proven direct deletion candidates. The remaining inspected refs are not evidence of active Product work; they are primarily historical transaction/successor debt requiring one more provenance layer before deletion.
