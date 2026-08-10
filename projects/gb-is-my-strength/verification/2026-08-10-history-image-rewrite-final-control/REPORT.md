# Historical Image Rewrite — Final Control Audit

Date: 2026-08-10 03:30 +03:00  
Product: `FedorMilovanov/gb-is-my-strength`  
Audit authority: `FedorMilovanov/AuditRepo`

## Terminal verdict

**CLOSED — HISTORY REWRITE COMPLETE AND CONTROL AUDIT GREEN**

This is the final independent control pass after the live historical-image rewrite. No further history-image cleanup action is required in this session.

## 1. Canonical Product authority

Fresh GitHub commit search resolves current Product `main` to:

```text
b8c92eda3af96158dbee4ba53803e90c30cce31c
fix(reader): close shared control semantics residuals (#1463)
```

The semantic Product commit remains the already-approved #1463 result; only history identities changed.

## 2. Pull-request terminal state

Fresh Product search returns:

```text
open PRs = 0
```

PR #1460 is:

```text
state = closed
merged = false
draft = true
base = main
base_sha = b8c92eda3af96158dbee4ba53803e90c30cce31c
```

Therefore the diagnostic workflows were not merged into Product `main`.

PR #1463 remains closed/merged and represents the semantic current-main change.

## 3. Branch/ref control

Fresh full branch pagination returns exactly:

```text
remote heads = 99
```

The second pagination page is empty.

Targeted searches return:

```text
audit/history-image-bloat-20260810 = absent
transport/* = absent
```

The rewrite freeze had 100 heads + 99 tags. The diagnostic head was deleted only after successful post-rewrite verification, leaving 99 heads. No tag deletion occurred in the transaction, so the final owner-managed set is 99 heads + 99 tags.

## 4. Temporary history tooling absent from Product main

Fresh Product code search for `history-image` / `history-image-bloat-audit` returns no default-branch results. The temporary diagnostic history workflows are therefore not present in current Product main.

## 5. Final purge and preservation invariant

The final execution recomputed the purge set after cemetery cleanup and proved:

```text
final purge blobs = 510
final purge bytes = 522,386,373 bytes = 498.2 MiB
durably preserved blobs = 510
durably preserved bytes = 522,386,373
PURGE_SET ⊆ DURABLY_PRESERVED_SET = true
new unpreserved purge blobs = 0
```

This exactly satisfies the preservation safety invariant.

## 6. Final dry-run

Fresh final dry-run on the frozen owner-managed graph recorded:

```text
heads = 100
tags = 99
commits before = 5237
commits after = 5231
main tree = 9d194c47acfe04874440851990a8228e88c45fed
main tree identical = true
mirror before ≈ 581.0 MiB
mirror after GC ≈ 135.4 MiB
purge = 510 historical image blobs / 498.2 MiB
```

Pre- and post-rewrite `git fsck --full` passed.

## 7. Fresh rollback durability before destructive push

Before the live force-update, the final frozen recovery bundle and final dry-run evidence were uploaded to:

```text
/ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/final-freeze-48cdbfc6905e-20260810-031908/
```

Receipts:

```text
recovery bundle SHA-256 = 5164d6609dbedb26fdd49c156c29cb506d1dc61b1a1d1a1488fb4fda1d926a20
dry-run evidence SHA-256 = 3c9404b7d06c6345f4de87f6dd3f46b5489b3f42e456feb0ba444e93c8c95f9b
```

The older preservation layer remains durable under `/ARCHIVE/gospod-bog/repo-history/2026-08-image-purge/`.

## 8. Live rewrite and post-rewrite verification

Immediately before the destructive push, the remote owner-managed ref graph exactly matched the graph used for the final dry-run.

One atomic force-push updated the remaining 199 owner-managed heads/tags.

Post-rewrite fresh fetch downloaded the rewritten owner-managed graph at approximately 131.53 MiB and then passed:

```text
git fsck --full = clean
objects checked = 85,566
commits verified = 5,231
```

Final receipt:

```text
OLD MAIN = 48cdbfc6905ef70239319a579d26869addc8bc36
NEW MAIN = b8c92eda3af96158dbee4ba53803e90c30cce31c
MAIN TREE UNCHANGED = 9d194c47acfe04874440851990a8228e88c45fed
PURGED = 510 historical image blobs / 498.2 MiB
```

## 9. GitHub internal pull refs boundary

`refs/pull/*` were intentionally not rewritten. They are GitHub-managed read-only refs and may continue to retain old objects server-side. Consequently GitHub's repository-size metadata may remain much larger than a normal fresh owner-managed clone. This does not invalidate the successful owner-managed history cleanup.

## 10. Resume rule

All clones/worktrees created before the rewrite are stale and must not push old SHA ancestry back to Product.

Canonical resume anchor:

```text
FedorMilovanov/gb-is-my-strength
main@b8c92eda3af96158dbee4ba53803e90c30cce31c
```

Agents may resume normal coordinated Product work only after a fresh clone or explicit hard resynchronization to rewritten `origin/main`.

## Final session disposition

**PASS. SESSION CLOSED.**

There are no remaining open Product PRs, no history diagnostic branch, no `transport/*` heads, no temporary history workflows in Product main, preservation/rollback evidence is durable, and the rewritten Product main has a byte-identical tree with a clean post-rewrite object graph.
