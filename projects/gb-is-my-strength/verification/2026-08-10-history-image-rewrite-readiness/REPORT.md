# Historical Image Rewrite — Pre-Rewrite Freeze / Final Readiness

Date: 2026-08-10  
Product: `FedorMilovanov/gb-is-my-strength`  
Audit authority: `FedorMilovanov/AuditRepo`  
Product diagnostic vehicle: PR `#1460`, branch `audit/history-image-bloat-20260810`

## Terminal status

**READY_FOR_REWRITE_AFTER_GLOBAL_FREEZE**

Durable preservation is now proven by an operator-side Filen receipt, and the historical-image cleanup remains technically feasible from the previous read-only inventory/export/dry-run work. The destructive rewrite is **still explicitly prohibited now** because Product Phase 2 is active again and the owner-managed ref graph is not frozen.

No remote `git filter-repo` push, force-push, rewrite of `main`, mass branch/tag rewrite, branch-protection change, Product ref deletion, dependency/security work, or merge of diagnostic PR #1460 was performed by this readiness pass.

The eventual destructive transaction requires the separate coordinator command:

```text
EXECUTE FINAL HISTORY REWRITE
```

and may occur only after every freeze/final-inventory/fresh-dry-run precondition in this report is satisfied.

---

## 1. Fresh live Product preflight after preservation receipt

### 1.1 Current `main`

Fresh Product `main` remains:

```text
283d8ca3affcf6d5f1e83a60499b7e38d6381c2c
```

Latest current-main change:

```text
fix(ci): derive shared ownership from live merge-base (#1462)
```

This is newer than the Lot/convergence anchor `f0ec90563ec5ae7eec439f78d0729694267af6df`. Therefore no old rewrite anchor or old ref census is allowed to authorize a live force-rewrite.

### 1.2 Open Product PRs

Fresh search now finds exactly **two** open Product PRs:

```text
#1463 — fix(reader): close shared control semantics residuals
state=open
draft=true
head=fix/reader-control-residuals-20260810
head_sha=0439edc652c26608e9648f7cc74b11c31df0dd1a
classification=ACTIVE PHASE-2 SYSTEM IMPLEMENTATION

#1460 — audit(repo): inventory historical image bloat
state=open
draft=true
head=audit/history-image-bloat-20260810
head_sha=4f535a6920413bd9e7fdc59d7c9711c81ec8dae0
classification=DIAGNOSTIC ONLY / DO NOT MERGE
```

The appearance of #1463 after the earlier preflight is direct evidence that the repository is **not globally frozen**. This readiness owner does not interfere with #1463.

### 1.3 Remote branch count

Fresh full pagination returned:

```text
remote branches = 124 total (including main)
```

This changed from the preceding 123-branch snapshot. The ref graph is therefore still moving.

Notable currently visible Phase-2/cleanup-related refs include:

```text
fix/reader-control-residuals-20260810   # active via PR #1463
audit/history-image-bloat-20260810      # this diagnostic vehicle
```

Many historical `agent/*`, `lane/*`, `transport/*`, `system/*`, `release/*`, `tmp/*` and other refs remain present. Branch cemetery is owned elsewhere; this history-image owner neither deletes nor refreshes them.

### 1.4 Tags

The latest verified recovery inventory from the previous graph contained:

```text
heads = 123
tags = 99
managed refs = 222
```

The live branch count has since moved to 124, proving that this inventory is no longer a final rewrite-time graph. The available connector does not expose a complete live tag-list authority in this pass, so **99 is historical evidence only**.

Immediately before the destructive rewrite, the final operator must freshly enumerate and freeze every `refs/tags/*` name + SHA and every intended KEEP `refs/heads/*` name + SHA.

### 1.5 Stabilization authority

Previously verified terminal roots remain:

```text
#1295 Lot publication = closed/completed
#1403 stabilization convergence = closed/completed
```

That satisfies the stabilization prerequisite itself, but does not override active Phase-2 #1463 or the unfinished branch cemetery.

---

## 2. Diagnostic PR #1460 disposition

Current diagnostic authority:

```text
PR #1460
state=open
merged=false
draft=true
head=audit/history-image-bloat-20260810
head_sha=4f535a6920413bd9e7fdc59d7c9711c81ec8dae0
current main=283d8ca3affcf6d5f1e83a60499b7e38d6381c2c
compare=diverged
ahead_by=7
behind_by=1
merge_base=f0ec90563ec5ae7eec439f78d0729694267af6df
```

Its actual Product delta remains exactly five temporary diagnostic workflows:

1. `.github/workflows/history-image-bloat-audit.yml`
2. `.github/workflows/history-image-preservation-export.yml`
3. `.github/workflows/history-image-rewrite-dry-run.yml`
4. `.github/workflows/history-pr-ref-impact.yml`
5. `.github/workflows/history-pre-rewrite-bundle.yml`

No application source, dependency, runtime, content, production asset, generated publication owner or deployment source belongs to this PR.

Disposition:

**KEEP TEMPORARILY — DIAGNOSTIC ONLY. DO NOT MERGE. DO NOT REFRESH MERELY BECAUSE MAIN MOVES.**

After the final rewrite is completed or explicitly abandoned and the durable evidence is preserved, #1460 must be **CLOSED NOT MERGED** and its diagnostic branch removed by the appropriate cleanup owner. Its five temporary workflows must never enter Product `main`.

---

## 3. Previous historical-image evidence — feasibility, not final purge authority

The previous graph-specific audit found:

```text
historical-only image blobs = 510
raw bytes = 522,386,373
raw MiB = 498.186
historical-only image blobs >= 1 MiB = 96
large-image bytes >= 1 MiB ~= 453.9 MiB
```

Largest historical groups included approximately:

```text
images/atlas-export         326.94 MiB historical-only
old Gill image revisions     53.84 MiB
old docs/dalle-refs           47.01 MiB
old Nagornaya visual diffs    30.12 MiB
old pastor-series images      10.32 MiB
```

Old `avraam-hires.png` revisions alone represented roughly 280 MiB across different historical Git blobs.

These numbers remain useful feasibility evidence but are **not required to remain 510 / 498.186 MiB after final branch cemetery**.

---

## 4. Durable preservation — PROVED

Target durable Filen path:

```text
/ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/
```

The operator executed the SHA-verifying upload helper and supplied the complete terminal receipt.

### 4.1 Local preservation integrity proof

Before upload, all required files passed the helper's SHA-256 validation.

The three split preservation parts were streamed in order and proven to reconstruct the original preservation ZIP exactly:

```text
combined bytes = 522,804,227
combined SHA-256 = 6bdc127c03d73619f8dfabebb10f5e0b5d18419052d4933137a10c6f3fac6027
result = PASS
```

The split parts are therefore transport pieces of one preservation archive, not three independent or duplicate preservation sets.

### 4.2 Filen durable cloud listing receipt

The cloud listing at the target path contains:

```text
historical-only-images-preservation.zip.part-00   180.00 MiB
historical-only-images-preservation.zip.part-01   180.00 MiB
historical-only-images-preservation.zip.part-02   138.58 MiB
PRESERVATION_SPLIT_MANIFEST.json                   790 B

pre-image-purge-recovery-part-00.zip               250.07 MiB
pre-image-purge-recovery-part-01.zip               250.00 MiB
pre-image-purge-recovery-part-02.zip                77.87 MiB

repo-history-image-cleanup-evidence-v2-2026-08.zip 207.51 KiB
```

Filen storage receipt:

```text
Used: 1.11 GiB
Max: 10 GiB
```

The uploader terminated with:

```text
PRESERVATION UPLOAD COMPLETE.
Remote: /ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/
Original preservation ZIP SHA256: 6bdc127c03d73619f8dfabebb10f5e0b5d18419052d4933137a10c6f3fac6027
```

Therefore durable preservation is no longer a blocker.

### 4.3 Preservation archive semantics

The preservation manifest maps every previously selected historical-only image blob by Git OID to:

- representative historical path;
- byte size;
- archive filename;
- SHA-256 of extracted bytes.

The preservation archive intentionally includes distinct old image revisions (including many Avraam revisions) because they are different Git blobs that will become unreachable from owner-managed history after purge. A given Git blob is preserved once by OID.

### 4.4 Recovery bundle

The full pre-rewrite owner-managed Git recovery bundle was previously created and verified, then split into three uploadable recovery archives. Previous independent reconstruction evidence:

```text
raw reassembled bundle bytes = 605,939,887
raw reassembled bundle SHA-256 = 32e203d0567ae722937dd6650263a8d1e6ac58e7b020366525321f2fed4df49d
`git bundle verify` = PASS
```

Verified recovery archive SHA-256 receipts used by the uploader:

```text
pre-image-purge-recovery-part-00.zip
a41f8d0ecc0390566f5a181a6dd445ed12854d85c15e7fabfffac37ab4cc21f6

pre-image-purge-recovery-part-01.zip
598e4ec6660aa7133b21ce0f1ebbc2b17ad5387accd4db86b2c6889dffd878f5

pre-image-purge-recovery-part-02.zip
db42223dc3ca57e28477eb4f4a10a5faaf473eb2384955cf780931001a1f713e
```

### 4.5 Evidence package

Durable evidence package:

```text
repo-history-image-cleanup-evidence-v2-2026-08.zip
SHA-256 = d4b9befda6aa95edfa449b2effe9bf2e416f9830155c9c8343653323533e840d
```

It contains the previous inventory, manifests/checksums, dry-run evidence, purge OIDs, managed ref evidence, recovery metadata and GitHub pull-ref retention analysis.

### 4.6 Preservation precondition verdict

**PRECONDITION B = SATISFIED for the existing preserved set.**

Important: final branch cleanup can change the future final purge set. Any newly discovered purge blob not already in durable preservation must be preserved and verified before the final rewrite.

Permanent invariant:

```text
PURGE_SET ⊆ DURABLY_PRESERVED_SET
```

---

## 5. Previous rewrite dry-run — strong feasibility evidence only

Previous local owner-managed dry-run used pinned `git-filter-repo 2.47.0` and performed **NO remote push**.

Results:

```text
main tree before = 44de23df426b1fcbc2386ef0c0b6dd9a26c7f46c
main tree after  = 44de23df426b1fcbc2386ef0c0b6dd9a26c7f46c
main tree identical = true

managed ref names preserved = true
managed refs at that snapshot = 222

commit count = 5320 -> 5314
mirror size  = 580.92 MiB -> 135.40 MiB
reduction    = 445.52 MiB / 76.69%

git fsck = clean
remote push = NO
```

This proves feasibility. It is **not** permission for a future force-push because the current main/ref graph is different and branch cemetery is still moving.

---

## 6. GitHub internal `refs/pull/*` boundary

Previous dedicated analysis established for the old graph:

```text
advertised GitHub refs/pull refs = 854
managed purge candidate blobs = 510 / 498.186 MiB
purge blobs reachable from refs/pull = 510 / 498.186 MiB
affected PR numbers = 853
```

GitHub internal `refs/pull/*` are read-only to repository owners and are outside the owner-managed rewrite surface.

The final report must distinguish:

### Owner-managed clone/history improvement

Final KEEP `refs/heads/*` and `refs/tags/*` can be rewritten so old preserved image blobs are no longer reachable through normal owner-managed canonical history. Ordinary clone/fetch history can therefore become dramatically smaller.

### GitHub internal object retention

GitHub may continue retaining historical objects through internal PR refs. Do **not** promise that GitHub's server-side repository-size metadata will fall by the same 76.69%, and do not attempt to force-push/delete `refs/pull/*` or erase PR history.

---

## 7. Final rewrite preconditions

### Precondition A — repository freeze

Immediately before destructive rewrite, prove all of the following:

1. open implementation/release Product PRs = 0;
2. no active agent intends to merge/push from an old checkout;
3. current `main` is explicitly declared the rewrite anchor;
4. branch cemetery has finished intended-delete transport/tmp/ci/superseded refs;
5. final KEEP branch inventory is frozen;
6. final KEEP tag inventory is frozen;
7. #1295 and #1403 remain terminal;
8. no deployment/release transaction is in flight;
9. all participating agents know that pre-rewrite clones/worktrees become stale;
10. no unrelated SYSTEM change may move main after the freeze snapshot.

Current state:

**NOT SATISFIED.** Active implementation PR #1463 exists, and live branch count moved to 124.

### Precondition B — durable preservation

Required:

1. historical-image preservation bytes physically durable;
2. all three recovery bundle parts physically durable;
3. manifest/checksum data physically durable;
4. evidence package physically durable;
5. hashes verified before upload;
6. recovery reconstruction/verify procedure documented.

Current state:

**SATISFIED for the currently preserved set.**

### Precondition C — fresh final inventory after branch cleanup

After global freeze, compute everything again from scratch. Do **not** require the old answer to remain 510.

Capture BEFORE:

- final current `main` SHA;
- final main tree SHA;
- every managed `refs/heads/*` name + SHA;
- every `refs/tags/*` name + SHA;
- final KEEP vs intended-delete classification;
- commit count;
- object count / `git count-objects -vH`;
- packed size;
- `git fsck --full`;
- final historical-image purge OID set relative to final managed graph;
- final purge bytes;
- durable preservation manifest hashes.

Then machine-prove:

```text
PURGE_SET ⊆ DURABLY_PRESERVED_SET
```

If final purge set contains blobs not already durable:

1. compute the delta;
2. export every new blob;
3. append/update preservation manifest;
4. verify hashes;
5. upload the delta durably;
6. only then rerun the final rewrite dry-run.

---

## 8. Final fresh dry-run — mandatory after freeze

The previous successful dry-run cannot authorize the live rewrite.

On a fresh mirror of the exact frozen final graph, record BEFORE:

- current main SHA;
- main tree SHA;
- every managed head/tag ref + SHA;
- commit count;
- object count;
- packed size;
- `git fsck` result;
- final purge OIDs;
- preservation manifest hashes.

Perform local rewrite + GC only, with **NO remote push**.

Then prove all of these AFTER invariants:

1. current `main` TREE is byte-identical;
2. every intended KEEP branch exists;
3. every intended KEEP tag exists;
4. no unintended ref is created/deleted;
5. final purge set is no longer reachable through owner-managed KEEP refs;
6. current non-purge production blobs remain present;
7. `git fsck --full` is clean;
8. generated/runtime/source files in current main are identical;
9. exact packed size before/after is recorded;
10. exact old-ref-SHA -> rewritten-ref-SHA mapping is saved;
11. `PURGE_SET ⊆ DURABLY_PRESERVED_SET` is machine-proved against the durable manifest.

If any invariant fails:

```text
NOT_READY
```

and no remote push is allowed.

---

## 9. Final live rewrite runbook — preparation only

Do not execute until coordinator explicitly issues `EXECUTE FINAL HISTORY REWRITE` after global freeze.

1. Freeze repository and announce no-merge/no-push window.
2. Re-fetch all final owner-managed heads/tags into a clean mirror.
3. Record final main/trees/refs/tags/object counts/packed size/fsck.
4. Recalculate final historical-image purge set from the frozen graph.
5. Compare final purge set to durable preservation manifest.
6. Preserve/upload any new delta; require `PURGE_SET ⊆ DURABLY_PRESERVED_SET`.
7. Create a **fresh** final full recovery bundle for the frozen KEEP graph and durably archive/verify it.
8. Run the mandatory local final rewrite dry-run with pinned rewrite tooling.
9. Require every invariant in section 8 to pass.
10. Save old->new mapping for every rewritten KEEP branch/tag.
11. Re-confirm branch protection/required checks/deployment expectations for rewritten SHA identities without weakening policy.
12. Only under the separate execution command, push rewritten owner-managed KEEP refs in the controlled transaction.
13. Do not attempt to rewrite GitHub internal `refs/pull/*`.
14. Immediately fetch a clean post-rewrite mirror and prove refs/trees/fsck/purge-unreachability again.
15. Run required Product source/build/runtime/deploy verification on rewritten `main`.
16. Notify all agents/operators to discard or reclone stale pre-rewrite checkouts.
17. Preserve final rewrite receipts and post-rewrite mapping in AuditRepo.
18. Close #1460 unmerged and delete its diagnostic branch when its evidence is no longer needed.

---

## 10. Rollback procedure

If the destructive transaction later produces a post-push invariant failure:

1. stop all further Product writes;
2. use the final pre-rewrite recovery bundle created at the frozen graph, not a guessed old clone;
3. reassemble its parts in order;
4. verify the recorded full bundle SHA-256;
5. run `git bundle verify`;
6. restore the exact frozen old refs according to the saved old-ref-SHA map using the separately authorized rollback transaction;
7. fetch a fresh mirror and prove the pre-rewrite main tree and KEEP refs are restored;
8. keep the preservation archive untouched;
9. record the failed rewrite and rollback in AuditRepo before any second attempt.

The older bundle currently durable in Filen remains valuable disaster-recovery evidence, but the final execution must create a new bundle from the exact frozen final ref graph.

---

## 11. Explicit exclusions

This readiness lane does not own and does not perform:

- Phase-2 implementation PR #1463;
- branch cemetery/ref deletions;
- npm/Astro/Vite/security upgrades;
- dependency lockfile changes;
- application feature changes;
- deployment changes;
- branch-protection weakening;
- GitHub internal pull-ref manipulation.

Previously observed dev/build dependency warnings remain a separate backlog/security owner and are irrelevant to history-image rewrite readiness.

---

## 12. Final decision

Preservation is now physically durable and verified. Technical feasibility is proven by the previous successful local rewrite simulation. The preparation/runbook is complete.

However the repository is **not globally frozen**:

- active implementation PR #1463 exists;
- remote branch count has moved to 124;
- branch cemetery has not completed the final KEEP/delete surface;
- final tag/ref inventory has not been frozen;
- a fresh final purge inventory and final dry-run have not yet been run on the future frozen graph.

Therefore the terminal status for this preparation pass is:

```text
READY_FOR_REWRITE_AFTER_GLOBAL_FREEZE
```

**STOP. Do not execute the destructive remote rewrite until the coordinator later issues `EXECUTE FINAL HISTORY REWRITE` after all global-freeze preconditions are satisfied.**
