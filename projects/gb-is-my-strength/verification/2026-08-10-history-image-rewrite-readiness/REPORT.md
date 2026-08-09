# Historical Image Rewrite — Pre-Rewrite Freeze / Final Readiness

Date: 2026-08-10  
Product: `FedorMilovanov/gb-is-my-strength`  
Audit authority: `FedorMilovanov/AuditRepo`  
Product diagnostic vehicle: PR `#1460`, branch `audit/history-image-bloat-20260810`

## Terminal status

**BLOCKED_ON_PRESERVATION_RECEIPT**

The technical preparation is strong enough to proceed to a fresh final dry-run after a repository-wide freeze, but destructive remote history rewrite is **not authorized now** for two independent reasons:

1. Phase-2 branch/ref convergence is still moving and the Product ref graph is not frozen.
2. This verifier cannot access the user's private Filen account and therefore cannot prove that the preservation/recovery set is physically durable at `/ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/`.

No remote `git filter-repo` push, force-push, branch/tag rewrite, branch-protection change, mass ref deletion, or Product diagnostic merge is performed by this preparation pass.

---

## 1. Fresh live Product preflight

### 1.1 Current `main`

Fresh Product `main` is:

```text
283d8ca3affcf6d5f1e83a60499b7e38d6381c2c
```

Latest main change is merged PR `#1462`:

```text
fix(ci): derive shared ownership from live merge-base (#1462)
```

This is important coordination evidence: the previous Lot/convergence anchor `f0ec9056...` is no longer current main. A live history rewrite now would invalidate SHA-based evidence under active Phase-2 convergence.

### 1.2 Open Product PRs

Fresh search found exactly one open Product PR:

```text
#1460 — audit(repo): inventory historical image bloat
state=open
draft=true
merged=false
```

There are **zero open Product implementation/release PRs** at this instant. However this does not constitute a repository freeze: the main tip moved through SYSTEM PR #1462 after the previous convergence anchor, and branch-cemetery/ref cleanup remains incomplete.

### 1.3 Remote branch count

Fresh full branch pagination returned:

```text
remote branches = 123 total (including main)
```

Namespace census of the live branch names:

```text
agent/*      25
lane/*       53
transport/*  13
system/*      8
fix/*         7
cleanup/*     2
audit/*       4
ci/*          4
release/*     3
tmp/*         1
archive/*     1
noop           1
main           1
TOTAL        123
```

This is still far above a final KEEP-only rewrite surface. AuditRepo cemetery waves already classified multiple transport/Lot/Search refs, but several remotely present refs are only deletion-authorized, not yet deleted. Therefore final rewrite must wait for the branch cemetery to finish its intended-delete refs.

### 1.4 Tags

The latest verified pre-rewrite recovery inventory associated with the diagnostic work contains:

```text
heads = 123
tags  = 99
managed refs total = 222
```

The current live branch count still independently equals 123. The available GitHub connector does not expose a direct live tag-list endpoint in this session, so **99 tags is retained as the latest verified tag inventory, not as a future rewrite-time invariant**.

The final freeze procedure MUST freshly enumerate `refs/tags/*` again and record every tag name + old SHA before any rewrite.

### 1.5 Phase-2 branch activity

Provable merge-intended Product PR heads at this exact preflight: **none**. The only open Product PR is diagnostic #1460.

But Phase-2 is not globally frozen:

- Product main advanced after the previous convergence report through merged SYSTEM #1462;
- the #1462 implementation branch (`fix/shared-live-merge-base-20260810`) is already deleted after merge, showing cleanup is actively changing refs;
- 123 remote branches still exist;
- recent AuditRepo branch-cemetery reports classify additional refs as SAFE DELETE / SUPERSEDED while explicitly recording that some could not yet be deleted by their tool surface.

Therefore absence of open implementation PRs at one instant must **not** be interpreted as permission to rewrite history.

---

## 2. Stabilization authority

Fresh issue checks:

```text
#1295 Lot publication: closed / completed
#1403 stabilization convergence: closed / completed
```

This satisfies the stabilization-terminal prerequisite itself, but it does not override the new global Phase-2/ref-freeze coordination requirement.

---

## 3. Diagnostic PR #1460 — current disposition

Current state:

```text
PR: #1460
state: open
merged: false
draft: true
head: audit/history-image-bloat-20260810
head SHA: 4f535a6920413bd9e7fdc59d7c9711c81ec8dae0
current main: 283d8ca3affcf6d5f1e83a60499b7e38d6381c2c
compare status: diverged
ahead_by: 7
behind_by: 1
merge base: f0ec90563ec5ae7eec439f78d0729694267af6df
```

Current Product delta is exactly five temporary diagnostic workflows:

1. `.github/workflows/history-image-bloat-audit.yml`
2. `.github/workflows/history-image-preservation-export.yml`
3. `.github/workflows/history-image-rewrite-dry-run.yml`
4. `.github/workflows/history-pr-ref-impact.yml`
5. `.github/workflows/history-pre-rewrite-bundle.yml`

There is no application source, dependency, runtime, content, generated publication file, image asset, migration registry, or production deployment mutation in the current PR delta.

The original #1460 body says `Exactly one temporary workflow`; that description is stale because the diagnostic vehicle later accumulated the additional preservation/dry-run/recovery workflows above. The **actual diff remains diagnostic-only**, which is the controlling safety fact.

Disposition:

**KEEP TEMPORARILY — DIAGNOSTIC ONLY. DO NOT MERGE. DO NOT REFRESH MERELY BECAUSE MAIN MOVES.**

After final rewrite is either completed or explicitly abandoned and the evidence is durable in AuditRepo/external storage, #1460 must be CLOSED NOT MERGED and its diagnostic branch removed during cleanup. None of its five temporary workflows belongs in production main.

---

## 4. Previous preservation evidence — strong but graph-specific

The following is prior verified evidence from the existing diagnostic graph. It demonstrates feasibility and preservation construction. It is **not** automatically the final purge authority after branch cemetery/freeze.

### 4.1 Historical-only image inventory

```text
historical-only image blobs = 510
raw bytes = 522,386,373
raw MiB = 498.186
historical-only image blobs >= 1 MiB = 96
large-image bytes >= 1 MiB ~= 453.9 MiB
```

Largest historical groups included:

```text
images/atlas-export        ~= 326.94 MiB historical-only
old Gill image revisions    ~= 53.84 MiB
old docs/dalle-refs         ~= 47.01 MiB
old Nagornaya visual diffs  ~= 30.12 MiB
old pastor-series images    ~= 10.32 MiB
```

The old `avraam-hires.png` revision family alone accounted for roughly 280 MiB across historical blob versions.

### 4.2 Preservation archive

Prior preservation export materialized every one of the 510 historical-only image blobs by Git OID and generated:

- `MANIFEST.csv`;
- `MANIFEST.json`;
- representative historical path;
- blob byte size;
- archive filename;
- SHA-256 of extracted bytes.

Preservation artifact archive receipt in this working session:

```text
historical-only-images-preservation.zip
bytes = 522,804,227
sha256 = 6bdc127c03d73619f8dfabebb10f5e0b5d18419052d4933137a10c6f3fac6027
```

### 4.3 Recovery bundle

A full pre-rewrite Git bundle for owner-managed `refs/heads/* + refs/tags/*` was created, verified, split into three parts, reassembled, and verified again.

Full raw reassembled bundle:

```text
bytes = 605,939,887
sha256 = 32e203d0567ae722937dd6650263a8d1e6ac58e7b020366525321f2fed4df49d
```

Downloaded split artifact receipts:

```text
pre-image-purge-recovery-part-00.zip
bytes = 262,217,764
sha256 = a41f8d0ecc0390566f5a181a6dd445ed12854d85c15e7fabfffac37ab4cc21f6

pre-image-purge-recovery-part-01.zip
bytes = 262,144,210
sha256 = 598e4ec6660aa7133b21ce0f1ebbc2b17ad5387accd4db86b2c6889dffd878f5

pre-image-purge-recovery-part-02.zip
bytes = 81,652,097
sha256 = db42223dc3ca57e28477eb4f4a10a5faaf473eb2384955cf780931001a1f713e
```

### 4.4 Evidence package

Current consolidated evidence package:

```text
repo-history-image-cleanup-evidence-v2-2026-08.zip
bytes = 212,488
sha256 = d4b9befda6aa95edfa449b2effe9bf2e416f9830155c9c8343653323533e840d
```

It includes the historical image inventory, preservation manifests, dry-run summary, purge OIDs, ref lists, recovery bundle verification metadata, and PR-ref retention evidence.

---

## 5. Previous rewrite dry-run — feasibility evidence only

Previous local/bare owner-managed dry-run used pinned `git-filter-repo 2.47.0` and performed **NO remote push**.

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

This proves that the historical-image cleanup is technically capable of drastically reducing ordinary owner-managed clone/history weight while preserving current Product tree contents.

It does **not** authorize a future force-push because:

- Product main is now `283d8ca3...`, not the old anchor;
- branch cemetery changes the managed ref graph;
- final purge set may differ from 510;
- final KEEP branches/tags are not frozen yet;
- Filen durability is not verified by this agent.

---

## 6. GitHub internal `refs/pull/*` limitation

Prior dedicated analysis established:

```text
advertised GitHub refs/pull refs = 854
managed purge candidate blobs = 510 / 498.186 MiB
purge blobs reachable from refs/pull = 510 / 498.186 MiB
affected PR numbers = 853
```

GitHub internal `refs/pull/*` are read-only to repository owners and are outside the owner-managed rewrite surface.

Therefore the final result must distinguish two claims:

### Owner-managed clone/history improvement

A successful rewrite of final KEEP `refs/heads/*` and `refs/tags/*` can make normal canonical history dramatically smaller and prevent old owner-managed branches/tags from carrying the image blobs.

### GitHub internal object retention

GitHub may continue retaining old objects through internal PR refs. Do not promise that GitHub repository metadata/storage will fall by 76.69%, and do not attempt to force-push/delete `refs/pull/*` or erase PR history.

This limitation is acceptable and must remain documented.

---

## 7. Durable Filen preservation receipt — NOT YET PROVED

Target durable path:

```text
/ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/
```

This agent has no authenticated access to the user's private Filen account and therefore cannot inspect that cloud path.

Accordingly:

**Preservation is prepared but NOT declared durable.**

Required external receipt before status can advance from `BLOCKED_ON_PRESERVATION_RECEIPT`:

### A. Local hash-verification receipt

The upload session must show SHA-256 verification for at least:

```text
6bdc127c03d73619f8dfabebb10f5e0b5d18419052d4933137a10c6f3fac6027  historical-only-images-preservation.zip
a41f8d0ecc0390566f5a181a6dd445ed12854d85c15e7fabfffac37ab4cc21f6  pre-image-purge-recovery-part-00.zip
598e4ec6660aa7133b21ce0f1ebbc2b17ad5387accd4db86b2c6889dffd878f5  pre-image-purge-recovery-part-01.zip
db42223dc3ca57e28477eb4f4a10a5faaf473eb2384955cf780931001a1f713e  pre-image-purge-recovery-part-02.zip
d4b9befda6aa95edfa449b2effe9bf2e416f9830155c9c8343653323533e840d  repo-history-image-cleanup-evidence-v2-2026-08.zip
```

### B. Filen cloud-listing receipt

Provide terminal output for:

```powershell
filen ls -l '/ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/'
filen statfs
```

The cloud listing must visibly contain the five archives above. Manifests/checksums are contained inside the preservation/evidence packages and must remain recoverable from those uploaded archives.

Preferred receipt is the complete final output of the prepared upload helper ending in:

```text
PRESERVATION UPLOAD COMPLETE.
Remote: /ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/
```

Do not delete the local copies until the eventual rewrite and post-rewrite verification are complete.

---

## 8. Final rewrite preconditions

### Precondition A — repository freeze

All items are mandatory immediately before destructive rewrite:

1. open implementation/release Product PRs = 0;
2. no agent is preparing a merge/push from an old Product checkout;
3. current `main` is explicitly declared the rewrite anchor;
4. branch cemetery has completed intended-delete transport/tmp/ci/superseded branches;
5. final KEEP branch inventory is frozen;
6. final KEEP tag inventory is frozen;
7. #1295 and #1403 remain terminal;
8. no release/deploy transaction is in flight;
9. all participating agents are told that pre-rewrite local clones/worktrees become stale after the operation;
10. no unrelated SYSTEM change is allowed to move main after the freeze snapshot.

Current state: **NOT SATISFIED — Phase-2 ref convergence remains active.**

### Precondition B — durable preservation

Required:

1. preservation image archive physically durable in Filen;
2. all three recovery bundle parts physically durable in Filen;
3. evidence/inventory package physically durable in Filen;
4. listed archive SHA-256 values independently verified before upload;
5. reassembled raw bundle SHA-256 `32e203d0...df49d` documented;
6. `git bundle verify` procedure documented and previously passed;
7. cloud listing receipt preserved in AuditRepo/final operator record.

Current state: **NOT PROVED — BLOCKED ON FILEN RECEIPT.**

### Precondition C — fresh final inventory after branch cleanup

After repository freeze, recalculate from scratch. Do NOT require the answer to remain 510.

Capture:

- final current `main` SHA;
- final main tree SHA;
- every owner-managed `refs/heads/*` name + SHA;
- every `refs/tags/*` name + SHA;
- final KEEP vs intended-delete classification;
- commit count;
- object count / `git count-objects -vH`;
- packed size;
- `git fsck --full`;
- final historical-image purge OID set relative to final managed graph;
- final purge bytes;
- preservation manifest hashes.

Machine invariant before rewrite:

```text
PURGE_SET ⊆ DURABLY_PRESERVED_SET
```

If the final set differs from the previous 510:

1. compute added/removed OID delta;
2. explain which branch/tag cemetery change caused the delta where possible;
3. any newly purgeable OID must be extracted and durably preserved BEFORE rewrite;
4. update preservation manifest/evidence;
5. never purge an OID missing from durable preservation.

---

## 9. Final dry-run — must occur AFTER freeze

The old dry-run proves feasibility only. A fresh final dry-run must be run on the exact frozen final refs.

### BEFORE evidence

Persist:

```text
main commit SHA
main tree SHA
all managed head refs + old SHA
all tag refs + old SHA
commit count
object count
packed size
git fsck result
final PURGE_SET OIDs + bytes
preservation manifest hash(es)
```

### Local rewrite only

Use a fresh bare/mirror owner-managed repository created after freeze. Use pinned `git-filter-repo` version and the exact final OID purge set. No remote push in the dry-run.

### Required AFTER invariants

Every invariant is blocking:

1. frozen current-main TREE is byte-identical before/after;
2. every intended KEEP branch exists after rewrite;
3. every intended KEEP tag exists after rewrite;
4. no accidental new/deleted ref names;
5. every `PURGE_SET` OID is unreachable from owner-managed KEEP refs;
6. all current-main production blobs not in purge set remain present;
7. `git fsck --full` is clean;
8. generated/runtime/source files in final main tree are identical because the main tree itself is identical;
9. exact before/after packed size is recorded;
10. exact old-ref-SHA -> rewritten-ref-SHA mapping is saved for every rewritten KEEP branch/tag;
11. final purge set is machine-proved as subset of durable preservation manifest;
12. no remote write occurred during the dry-run.

If any invariant fails:

```text
NOT_READY
```

and no remote rewrite is permitted.

---

## 10. Final destructive rewrite runbook — DO NOT EXECUTE UNTIL COORDINATOR COMMAND

Required coordinator command:

```text
EXECUTE FINAL HISTORY REWRITE
```

Only after Precondition A+B+C and the final dry-run pass.

### Stage 1 — freeze receipt

- record exact live Product `main`;
- record final branch/tag refs and old SHAs;
- prove open implementation PR = 0;
- prove no deploy/release transaction is in flight;
- announce old clones/worktrees frozen;
- prevent unrelated pushes for the short rewrite window through coordination, not by ad-hoc policy weakening.

### Stage 2 — final recovery checkpoint

- create a fresh recovery bundle from the exact final owner-managed KEEP refs;
- verify `git bundle verify`;
- SHA-256 bundle and any split parts;
- preserve it durably;
- preserve final refs table and rewrite plan.

### Stage 3 — final preservation delta

- generate the exact final purge set;
- compare to durable manifest;
- export any new OIDs;
- verify `PURGE_SET ⊆ DURABLY_PRESERVED_SET` machine-readable;
- stop if not proven.

### Stage 4 — rewrite locally

- operate on fresh frozen bare/mirror owner-managed refs;
- remove only final purge OIDs;
- retain intended KEEP branches/tags;
- run all final dry-run invariants again after GC;
- produce old SHA -> new SHA mapping.

### Stage 5 — remote transaction

- re-read remote refs immediately before push and prove every old remote SHA still equals the frozen expected SHA;
- if any ref/main moved: ABORT and repeat freeze/inventory/dry-run;
- update only explicit intended KEEP `refs/heads/*` and `refs/tags/*`;
- use guarded explicit force/lease semantics tied to saved old SHAs;
- do **not** use blind `git push --mirror`;
- do **not** touch GitHub internal `refs/pull/*`;
- do **not** delete unrelated refs as a side effect of rewrite;
- temporary protection changes, if ever required, need separate coordinator authorization and immediate restoration — they are not pre-authorized by this report.

### Stage 6 — post-rewrite verification

From a brand-new clone:

- fetch branch/tag inventory and compare to intended KEEP list;
- verify rewritten main tree equals frozen pre-rewrite main tree;
- `git fsck --full`;
- recompute history/image bloat inventory;
- confirm purge OIDs absent from owner-managed refs;
- run required Product build/source/route/runtime checks for unchanged main tree as a post-rewrite integrity witness;
- verify deployment/live production is unchanged in content identity or perform the canonical redeploy if the release-control plane requires the new commit SHA identity;
- record rewritten main SHA and full old->new ref map in AuditRepo.

### Stage 7 — clone hygiene

- archive/delete stale pre-rewrite developer/agent clones and worktrees;
- do not push from them;
- recreate active work from fresh clones of rewritten refs;
- communicate that old SHA ancestry must not be reintroduced.

### Stage 8 — diagnostic disposal

After rewrite is completed or explicitly abandoned and all evidence is durable:

```text
PR #1460 -> CLOSED NOT MERGED
audit/history-image-bloat-20260810 -> delete in cleanup
```

The five temporary diagnostic workflows must never enter Product main.

---

## 11. Rollback procedure

If the remote rewrite must be rolled back:

1. stop all Product writes again;
2. obtain all three pre-rewrite recovery parts from durable storage;
3. reassemble the raw bundle in lexical order;
4. verify raw bundle SHA-256 exactly:

```text
32e203d0567ae722937dd6650263a8d1e6ac58e7b020366525321f2fed4df49d
```

5. run `git bundle verify`;
6. reconstruct/fetch the old owner-managed refs into an isolated bare recovery repository;
7. compare reconstructed old refs against saved pre-rewrite `REFS.txt` / final freeze refs table;
8. only under a new coordinated freeze, explicitly restore affected branch/tag refs using old expected/new values — no blind `--mirror`;
9. freshly clone and re-run integrity checks;
10. retain both the failed rewritten map and restored old ref map in AuditRepo.

The preservation image archive provides object-level recovery of removed historical images; the Git bundle provides commit/ref graph recovery for owner-managed heads/tags.

---

## 12. Security/dependency scope boundary

This lane performs no npm/security repair.

Do not change here:

- Astro;
- Vite;
- npm dependencies;
- `package-lock.json`;
- general GitHub Actions versions;
- application source.

Any devDependency audit warnings remain separate backlog/owned Phase-2 work.

---

## 13. Final readiness decision

### What is ready

- historical-image bloat has been measured precisely;
- all previous 510 historical-only image blobs were extracted with OID/path/size/SHA manifests;
- a full owner-managed Git recovery bundle was built, split, reassembled and verified;
- rewrite feasibility was successfully dry-run with identical main tree and clean fsck;
- GitHub internal `refs/pull/*` retention is understood and explicitly out of owner-managed scope;
- final freeze, preservation, inventory, dry-run, rewrite, rollback and post-rewrite procedures are specified;
- #1460 is confirmed diagnostic-only and remains do-not-merge.

### What is not ready

- repository-wide Phase-2 ref graph is not frozen;
- branch cemetery is not yet reduced to the intended KEEP set;
- final purge set has not been recomputed after that cemetery;
- Filen durable preservation has not been independently proved to this verifier.

## TERMINAL STATUS

```text
BLOCKED_ON_PRESERVATION_RECEIPT
```

Once the Filen receipt is supplied, this preparation can be reclassified to:

```text
READY_FOR_REWRITE_AFTER_GLOBAL_FREEZE
```

without performing the rewrite. The destructive transaction still requires the separate coordinator command `EXECUTE FINAL HISTORY REWRITE` after Phase 2, branch cemetery, final ref freeze, fresh final inventory and fresh final dry-run all succeed.
