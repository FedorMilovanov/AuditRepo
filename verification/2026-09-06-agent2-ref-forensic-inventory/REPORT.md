# AuditRepo ref & PR forensic inventory — Agent 2 (repository-history / branch / PR forensics)

**Audit date (UTC):** 2026-09-06 · **Revision:** 2 (re-verified)
**Scope:** complete current forensic inventory of AuditRepo remote refs and pull-request history.
**Mode:** strictly non-destructive. No branch created, deleted, merged, closed or repointed. No PR opened, closed, merged, labelled or approved. No retirement request, execution wrapper or engine/workflow change authored. No MASTER matrix, WORK_QUEUE, closure ledger or disposition ledger modified. No raw evidence rewritten.
**Deliverable:** this report only, plus a proposed cleanup wave that requires a separate explicit owner decision before any execution.

> **Revision 2 note.** This revision re-derives the entire inventory from scratch and adds a second-pass verification (§12). It corrects one substantive claim from revision 1 — see §12.2 — and refreshes three volatile rows. `main` has not moved, so no baseline conclusion changed.

---

## 1. Verification provenance (what was actually run)

Every number below came from a command executed during this audit.

| Check | Command | Result |
|---|---|---|
| Shallow-clone guard | `git rev-parse --is-shallow-repository` | **false** |
| Live remote ref universe | `git ls-remote --heads origin` | **48** branches (47 non-main + `main`) |
| Main head | `git ls-remote origin refs/heads/main` | `29450bf8dc3baa69289be770e3fbb64a1728dcee` |
| Main history depth | `git rev-list --count origin/main` | **1490** commits |
| Main object universe | `git rev-list --objects origin/main` | **9527** objects |
| Full PR universe | `gh pr list --state all --limit 1000` | **362** PRs — 294 merged, 60 closed-unmerged, 8 open |
| Repository's own forensic gate | `node scripts/repository_history_forensic_audit.mjs --strict` | **PASS** — `unexplainedRemoteBranches: 0`, `inaccessibleClosedHeads: 0`, `manualReviewCandidates: 0` |
| Content-preservation proof | per-branch `ls-tree` blobs vs the 9527-object main universe | per-ref "unique blobs never on main" |
| Reviewed retirement requests | all 6 JSONs under `references/ref-retirement/requests/` | **43** targets, **0** still live |
| Closed-PR head fallback | `gh api …/git/refs/pull/N/head` for every D-wave PR | **10/10** match the live branch head |

### 1.1 Methodological correction retained from revision 1

The initial workspace clone was a **depth-1 shallow clone pinned at `main`** (`.git/shallow` contained `29450bf8…`; `remote.origin.fetch` was single-branch). Under that state `git rev-list --count origin/main` returned **1** and `git merge-base origin/main <any branch>` returned **empty**, falsely implying `main` was an unrelated single-commit root and that every branch held 1000+ unmerged commits. `git cat-file -p` contradicted this by showing two parents, which exposed the artifact. After `git fetch --unshallow`, `main` reports **1490** commits and all merge-bases resolve.

**Standing rule for any future agent:** never draw ancestry, ahead/behind or "unique commit" conclusions here without first asserting `git rev-parse --is-shallow-repository` is `false`. The workspace can also be re-created in shallow form between sessions, so re-assert it every time.

---

## 2. Policy cross-check (existing rules, not new ones)

No new retention rule was invented.

| Authority | Rule applied here |
|---|---|
| `references/ref-retirement/README.md` | "A branch may be retired only when its evidence is already reachable from `main`, intentionally preserved under `archive/`, or explicitly superseded by a merged successor. Lower branch count is not sufficient justification." |
| `references/ref-retirement/README.md` (Safety barriers) | Engine refuses to delete `main`, any `archive/*` ref, any retained ref, any open-PR head, a ref whose live SHA changed after review, or any target when live `main` differs from the reviewed base, or when an unreviewed remote branch has appeared. |
| `CLEANUP_RETENTION_POLICY.md` → *Branch retention* | "retain intentional `archive/*` refs only when they preserve real forensic authority not safely reducible to normal files/history"; "do not optimize branch count at the cost of losing important evidence". |
| `CLEANUP_RETENTION_POLICY.md` → *Never do this* | "never silently delete raw evidence"; "never maintain two competing active matrices". |
| `scripts/repository_history_forensic_audit.mjs` → `reconcileBranch()` | The repository's own reconciliation taxonomy is reused verbatim in §5/§6 so this report does not compete with CI. |
| `projects/gb-is-my-strength/verified/closed-unmerged-pr-dispositions.json` | Reviewed closed-unmerged PR disposition ledger. |

### 2.1 Engine requirements actually enforced (read from source, not assumed)

`scripts/retire_reviewed_refs.py` enforces, per target:

- `expectedHead` must equal the live head SHA, else abort;
- **`ancestor` mode:** `compare(current_main, head).ahead_by` must be **0**;
- **`superseded` mode:** `comparisonBase` must be an ancestor of current `main`; `compare(base, head).ahead_by` must equal `expectedAhead`; the compare file list must equal `allowedChangedPaths` **exactly**; and every `replacementPullRequests` entry must be a **merged** PR (`merged_pr()` raises `replacement PR #N is not merged` otherwise), with at least one;
- any other `mode` → `unsupported target mode`.

Every proof in §8 is expressed in exactly these fields. Wave R1 is blocked because **no `archive`-backed mode exists** — the reviewed requests themselves record *"archive-backed retirement requires a separately reviewed engine mode."* This agent does not implement it.

### 2.2 What `missingIntroducedPaths: 75` does and does not mean

`STRICT_ZERO_SUMMARY_KEYS` is frozen to exactly three keys: `inaccessibleClosedHeads`, `manualReviewCandidates`, `unexplainedRemoteBranches`. `missingIntroducedPaths` is **not** among them, so **75 is informational, not a failure**. It counts, across the 60 closed-unmerged PRs, files with status `added`/`renamed` whose path no longer exists in the checked-out tree (`currentPathExists` → `fs.existsSync`). It is a re-triage hint, not evidence loss.

---

## 3. Baseline state

- `main` = `29450bf8dc3baa69289be770e3fbb64a1728dcee` (merge of PR #363, 2026-09-06), 1490 commits, 1929 files.
- **48** live remote branches; **10** are `archive/*`; **0** tags.
- **362** PRs: 294 merged, 60 closed-unmerged, 8 open.
- Strict gate **green**: `0` unexplained refs, `0` inaccessible closed heads, `0` manual review candidates.

> **Framing.** Because the repository's own gate already reports `unexplainedRemoteBranches: 0`, **no ref is currently non-compliant**. Nothing here is required for CI. The proposed wave is authority-minimisation hygiene and is optional — stated explicitly so branch count is never its own justification.

---

## 4. Universe volatility

| Time (UTC) | Branches | Open PRs | `main` |
|---|---|---|---|
| 14:08 (rev 1 start) | 45 | 5 | `29450bf8…` |
| 14:22 (rev 1 finalise) | 48 | 8 | `29450bf8…` |
| 15:07 (rev 2 re-verify) | **48** | **8** | `29450bf8…` |

Branch **count** is stable at 48 and `main` never moved. Three live sibling-agent branches advanced their heads between revisions (§12.1). If `main` moves, §3 and every `ahead/behind` figure must be re-derived before execution.

---

## 5. Complete inventory — all 47 non-main refs

`Unique blobs` = blobs in that ref's tip tree appearing **nowhere** in `main`'s entire 1490-commit object history (9527 objects). `0` means the ref's complete file content is already reducible to `main`, regardless of commit-graph divergence.

| # | Ref | Head SHA | ahead/behind | Unique blobs | Engine reconciliation | PR disposition | Category |
|---|-----|----------|--------------|--------------|-----------------------|----------------|----------|
| 1 | `agent/bugverifikator-brand-title-authority-20260717` | `e116b7059e1a` | 3/91 | 2 | `open-pr-head` | #328 open | **A** |
| 2 | `arena/01a076fd-auditrepo` | `617aeaa111ca` † | 4/0 | 11 | `open-pr-head` | #365 open | **A** |
| 3 | `arena/01a0770c-auditrepo` | *(this commit)* † | 4/0 | 9 | `open-pr-head` | #366 open | **A** |
| 4 | `arena/01a0770d-auditrepo` | `167ea7c2d2d4` † | 5/0 | 14 | `open-pr-head` | #364 open | **A** |
| 5 | `arena/auditrepo-evidence-integrity-audit-20260906` | `29450bf8dc3b` | 0/0 | 0 | `git-ancestor-of-main` | — | **A** |
| 6 | `arena/auditrepo-governance-contract-audit-20260906` | `29450bf8dc3b` | 0/0 | 0 | `git-ancestor-of-main` | — | **A** |
| 7 | `arena/auditrepo-ref-forensic-audit-20260906` | `29450bf8dc3b` | 0/0 | 0 | `git-ancestor-of-main` | — | **A** |
| 8 | `arena/gb-atlas-gill-a11y-20260717` | `cd7d8ad21742` | 1/32 | 12 | `open-pr-head` | #337 open | **A** |
| 9 | `arena/gb-baptisty-contrast-20260717` | `14725606fd95` | 1/26 | 12 | `open-pr-head` | #341 open | **A** |
| 10 | `arena/gb-data-consistency-public-assets-20260717` | `4cbc1417cbc0` | 3/53 | 14 | `open-pr-head` | #334 open | **A** |
| 11 | `arena/gb-nagornaya-a11y-20260717` | `d3f2ad581cf7` | 1/24 | 13 | `open-pr-head` | #342 open | **A** |
| 12 | `arena/tlp-ssot-matrix-audit-20260906` | `29450bf8dc3b` | 0/0 | 0 | `git-ancestor-of-main` | — | **A** |
| 13 | `archive/forensic-arena-019fe0b5-auditrepo-2026-08-13` | `11ab74f3c396` | 11/420 | 14 | `archived-recovery-branch` | — | **B** |
| 14 | `archive/forensic-arena-019fe0c4-auditrepo-2026-08-13` | `9239885f8ba8` | 7/420 | 8 | `archived-recovery-branch` | — | **B** |
| 15 | `archive/forensic-bugverifikator-audit-2026-07-17-2026-09-06` | `f3a6b9700e56` | 7/53 | 14 | `archived-recovery-branch` | — | **B** |
| 16 | `archive/forensic-engine-contracts-pr323-2026-09-06` | `99b28c3311fc` | 1/107 | 6 | `archived-recovery-branch` | #323 closed/superseded | **B** |
| 17 | `archive/forensic-gb-arena-master-reverify-20260717-2026-09-06` | `e1bc115e9570` | 2/53 | 15 | `archived-recovery-branch` | #335 closed/superseded | **B** |
| 18 | `archive/forensic-gb-control-reconciliation-bc786-20260809` | `08692b0eadea` | 5/374 | 5 | `archived-recovery-branch` | — | **B** |
| 19 | `archive/forensic-tlp-arena-master-reverify-20260818-2026-09-06` | `81548c21173c` | 1/77 | 3 | `archived-recovery-branch` | #330 closed/superseded | **B** |
| 20 | `archive/forensic-tlp-hall-001-material-chain-20260809` | `70cf0c4f3c86` | 2/397 | 2 | `archived-recovery-branch` | — | **B** |
| 21 | `archive/forensic-tlp-hall-001-material-chain-current-20260809` | `efb906714a67` | 2/396 | 2 | `archived-recovery-branch` | — | **B** |
| 22 | `agent/arena-bugverifier-orphaned-guard-wiring-20260818` | `99b28c3311fc` | 1/107 | 6 | `closed-superseded-pr-head` | #323 closed/superseded | **C** |
| 23 | `agent/arena-home-resume-dead-20260717` | `2216192058a2` | 1/102 | 0 | `closed-diagnostic-pr-head` | #326 closed/diagnostic | **C** |
| 24 | `agent/arena-master-current-reverify-20260717` | `e1bc115e9570` | 2/53 | 15 | `closed-superseded-pr-head` | #335 closed/superseded | **C** |
| 25 | `agent/tlp-arena-master-reverify-20260818` | `81548c21173c` | 1/77 | 3 | `closed-superseded-pr-head` | #330 closed/superseded | **C** |
| 26 | `arena/019fe0b5-auditrepo` | `11ab74f3c396` | 11/420 | 14 | `archived-source-ref` | — | **C** |
| 27 | `arena/019fe0c4-auditrepo` | `9239885f8ba8` | 7/420 | 8 | `archived-source-ref` | — | **C** |
| 28 | `audit/gb-control-reconciliation-bc786-20260809` | `08692b0eadea` | 5/374 | 5 | `archived-source-ref` | — | **C** |
| 29 | `audit/regression-semantic-wave2a-20260807` | `ee600c3e5dbb` | 1/470 | 0 | `closed-superseded-pr-head` | #242 closed/superseded | **C** |
| 30 | `audit/tlp-hall-001-material-chain` | `70cf0c4f3c86` | 2/397 | 2 | `archived-source-ref` | — | **C** |
| 31 | `audit/tlp-hall-001-material-chain-current` | `efb906714a67` | 2/396 | 2 | `archived-source-ref` | — | **C** |
| 32 | `audit/tlp-hall-001-material-decision` | `bb296ae2d461` | 2/391 | 0 | `closed-superseded-pr-head` | #280 closed/superseded | **C** |
| 33 | `audit/tlp-hall-material-chain-20260809` | `cbc19abd10c3` | 2/397 | 0 | `archived-source-ref` | — | **C** |
| 34 | `bugverifikator-audit-2026-07-17` | `f3a6b9700e56` | 7/53 | 14 | `archived-source-ref` | — | **C** |
| 35 | `maintenance/auditrepo-archive-proof-retirement-20260906` | `cb068ad7d0db` | 0/10 | 0 | `git-ancestor-of-main` | — | **C** |
| 36 | `maintenance/auditrepo-retire-pr316-ref-20260906` | `99a98481bcd9` | 1/9 | 1 | `closed-superseded-pr-head` | #358 closed/superseded | **C** |
| 37 | `agent/arena-lot-main-id-verification-20260717` | `d72ba0ee99f4` | 1/98 | 1 | `closed-superseded-pr-head` | #327 closed/superseded | **D** |
| 38 | `agent/bugverifikator-master-delta-brand-title-20260717` | `7547fabab486` | 2/76 | 2 | `closed-superseded-pr-head` | #331 closed/superseded | **D** |
| 39 | `agent/bugverifikator-master-readmit-wave-20260717` | `2d5ebe09e53b` | 5/76 | 4 | `closed-superseded-pr-head` | #333 closed/superseded | **D** |
| 40 | `agent/gb-arena-master-reverify-20260818` | `90d43752f083` | 1/86 | 3 | `closed-superseded-pr-head` | #329 closed/superseded | **D** |
| 41 | `agent/gb-live-706c-reconciliation-20260809` | `7e6bba95e721` | 2/381 | 2 | `closed-superseded-pr-head` | #285 closed/superseded | **D** |
| 42 | `arena/2026-08-17-gbs-reverify` | `b90dd90991b3` | 1/103 | 2 | `closed-superseded-pr-head` | #325 closed/superseded | **D** |
| 43 | `arena/pr317-322-verifier-synthesis-20260717` | `851c58d843ae` | 2/107 | 4 | `closed-superseded-pr-head` | #324 closed/superseded | **D** |
| 44 | `audit/regression-preservation-wave0-final5-20260807` | `a8cb02f6c270` | 6/470 | 3 | `closed-superseded-pr-head` | #239 closed/superseded | **D** |
| 45 | `verification/gb-search-ar-idx-09-closure-20260808` | `d73e508e0dd0` | 2/460 | 2 | `closed-superseded-pr-head` | #254 closed/superseded | **D** |
| 46 | `archive/forensic-tlp-hall-material-chain-20260809` | `cbc19abd10c3` | 2/397 | 0 | `archived-recovery-branch` | — | **E** |
| 47 | `verification/gb-zero-direct-defects-next-wave-20260808` | `ae25effd426c` | 2/455 | 2 | `diagnostic-transaction-branch` | — | **E** |

† **Volatile live-agent heads — SHA column is a point-in-time sample, not an invariant.** The three `arena/01a07*-auditrepo` refs are the working branches of the in-flight 2026-09-06 five-agent audit. Their owners push continuously: during this audit alone `arena/01a076fd-auditrepo` moved `660f6862` → `8689b296` → `617aeaa1` and `arena/01a0770d-auditrepo` moved `f923b7b5` → `b3d742a1` → `167ea7c2`. Two further movements were observed *while this revision was being written*, so any pinned SHA for these three is stale by the time it is committed.

The authoritative value is always `git ls-remote --heads origin refs/heads/<branch>`. What **is** invariant, and what the classification rests on, is that each is an **open-PR head** (#364/#365/#366) and therefore category **A** — a status the retirement engine also enforces dynamically by protecting every open-PR head. `arena/01a0770c-auditrepo` is additionally **self-referential**: it is the branch this report is committed to. A cell can never contain the SHA of the commit that contains it — writing the SHA changes the SHA — so that row deliberately reads *(this commit)* rather than pinning a value that is false the instant it is committed. Its `ahead`/`behind`/unique-blob figures are unaffected by amending and are current.

**No other ref in §5 carries this caveat.** The remaining 44 refs were byte-stable across both verification passes.

---

## 6. Classification (exactly one category per ref)

Category counts: **A = 12, B = 9, C = 15, D = 9, E = 2** (total 47).

### A — ACTIVE / OPEN-PR OWNED  (12 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `agent/bugverifikator-brand-title-authority-20260717` | `e116b7059e1aab9d2bd71b06cf5026f6ff0d5c21` | `a0ac1c91c69e` | 3 | 91 | 2 | open PR head #328 |
| `arena/01a076fd-auditrepo` | `617aeaa111caed709f27e09974fdcca048ed8e26` † | `29450bf8dc3b` | 4 | 0 | 11 | open PR head #365 |
| `arena/01a0770c-auditrepo` | *(this commit — self-referential)* † | `29450bf8dc3b` | 4 | 0 | 9 | open PR head #366 |
| `arena/01a0770d-auditrepo` | `167ea7c2d2d4037acfb6f2cf0ce235976936a550` † | `29450bf8dc3b` | 5 | 0 | 14 | open PR head #364 |
| `arena/auditrepo-evidence-integrity-audit-20260906` | `29450bf8dc3baa69289be770e3fbb64a1728dcee` | `29450bf8dc3b` | 0 | 0 | 0 | live 2026-09-06 five-agent audit session placeholder (0 commits, == main) |
| `arena/auditrepo-governance-contract-audit-20260906` | `29450bf8dc3baa69289be770e3fbb64a1728dcee` | `29450bf8dc3b` | 0 | 0 | 0 | live 2026-09-06 five-agent audit session placeholder (0 commits, == main) |
| `arena/auditrepo-ref-forensic-audit-20260906` | `29450bf8dc3baa69289be770e3fbb64a1728dcee` | `29450bf8dc3b` | 0 | 0 | 0 | live 2026-09-06 five-agent audit session placeholder (0 commits, == main) |
| `arena/gb-atlas-gill-a11y-20260717` | `cd7d8ad217427bd1def58d5d05dd8f5ac6ff42b0` | `c55b5b5d50b7` | 1 | 32 | 12 | open PR head #337 |
| `arena/gb-baptisty-contrast-20260717` | `14725606fd9518522e0788163ca6570a5d7964b6` | `5445949017ab` | 1 | 26 | 12 | open PR head #341 |
| `arena/gb-data-consistency-public-assets-20260717` | `4cbc1417cbc0de9d72719d7dfd0c36700e1bef80` | `b4f60182b19b` | 3 | 53 | 14 | open PR head #334 |
| `arena/gb-nagornaya-a11y-20260717` | `d3f2ad581cf7f0f9e8077453a1c4820a6c0a6f4a` | `5fbe3cd4a4df` | 1 | 24 | 13 | open PR head #342 |
| `arena/tlp-ssot-matrix-audit-20260906` | `29450bf8dc3baa69289be770e3fbb64a1728dcee` | `29450bf8dc3b` | 0 | 0 | 0 | live 2026-09-06 five-agent audit session placeholder (0 commits, == main) |

### B — KEEP, UNIQUE FORENSIC AUTHORITY  (9 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `archive/forensic-arena-019fe0b5-auditrepo-2026-08-13` | `11ab74f3c396c2f17539cd9b770c91c3b1e89b6f` | `e50c4c938594` | 11 | 420 | 14 | archive/* forensic authority: 14 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-arena-019fe0c4-auditrepo-2026-08-13` | `9239885f8ba8dfc84a4125339bc408c899b495c5` | `e50c4c938594` | 7 | 420 | 8 | archive/* forensic authority: 8 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-bugverifikator-audit-2026-07-17-2026-09-06` | `f3a6b9700e56248074a475e278d41f6270de8793` | `b4f60182b19b` | 7 | 53 | 14 | archive/* forensic authority: 14 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-engine-contracts-pr323-2026-09-06` | `99b28c3311fcc0e717390cee282c768350beccb5` | `d79d080d7331` | 1 | 107 | 6 | archive/* forensic authority: 6 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-gb-arena-master-reverify-20260717-2026-09-06` | `e1bc115e957070fe61329ef04ca58a555e846d18` | `b4f60182b19b` | 2 | 53 | 15 | archive/* forensic authority: 15 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-gb-control-reconciliation-bc786-20260809` | `08692b0eadea72ea10d50ed97faa6e6ec837d5e9` | `5154a5ef11c2` | 5 | 374 | 5 | archive/* forensic authority: 5 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-tlp-arena-master-reverify-20260818-2026-09-06` | `81548c21173c1409c3e3aafd65cee4a4bf769253` | `8ef37c99c8f6` | 1 | 77 | 3 | archive/* forensic authority: 3 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-tlp-hall-001-material-chain-20260809` | `70cf0c4f3c860afd877fb4010eb9c26a2d7120ed` | `dae54d23f7da` | 2 | 397 | 2 | archive/* forensic authority: 2 blob(s) never present anywhere in main history; required:true in reviewed requests |
| `archive/forensic-tlp-hall-001-material-chain-current-20260809` | `efb906714a670335d1d050ecf88bba562abab45e` | `a8283267ae08` | 2 | 396 | 2 | archive/* forensic authority: 2 blob(s) never present anywhere in main history; required:true in reviewed requests |

### C — SAFE RETIREMENT CANDIDATE, PROOF COMPLETE  (15 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `agent/arena-bugverifier-orphaned-guard-wiring-20260818` | `99b28c3311fcc0e717390cee282c768350beccb5` | `d79d080d7331` | 1 | 107 | 6 | exact-SHA twin permanently preserved at archive/forensic-engine-contracts-pr323-2026-09-06 (required:true); engine lacks archive-backed mode |
| `agent/arena-home-resume-dead-20260717` | `2216192058a2c3963ffe9762e23a91bfcb5d3902` | `4ea3586eb7fa` | 1 | 102 | 0 | 0 blobs unique to main history; every branch blob already reachable from main |
| `agent/arena-master-current-reverify-20260717` | `e1bc115e957070fe61329ef04ca58a555e846d18` | `b4f60182b19b` | 2 | 53 | 15 | exact-SHA twin permanently preserved at archive/forensic-gb-arena-master-reverify-20260717-2026-09-06 (required:true); engine lacks archive-backed mode |
| `agent/tlp-arena-master-reverify-20260818` | `81548c21173c1409c3e3aafd65cee4a4bf769253` | `8ef37c99c8f6` | 1 | 77 | 3 | exact-SHA twin permanently preserved at archive/forensic-tlp-arena-master-reverify-20260818-2026-09-06 (required:true); engine lacks archive-backed mode |
| `arena/019fe0b5-auditrepo` | `11ab74f3c396c2f17539cd9b770c91c3b1e89b6f` | `e50c4c938594` | 11 | 420 | 14 | exact-SHA twin permanently preserved at archive/forensic-arena-019fe0b5-auditrepo-2026-08-13 (required:true); engine lacks archive-backed mode |
| `arena/019fe0c4-auditrepo` | `9239885f8ba8dfc84a4125339bc408c899b495c5` | `e50c4c938594` | 7 | 420 | 8 | exact-SHA twin permanently preserved at archive/forensic-arena-019fe0c4-auditrepo-2026-08-13 (required:true); engine lacks archive-backed mode |
| `audit/gb-control-reconciliation-bc786-20260809` | `08692b0eadea72ea10d50ed97faa6e6ec837d5e9` | `5154a5ef11c2` | 5 | 374 | 5 | exact-SHA twin permanently preserved at archive/forensic-gb-control-reconciliation-bc786-20260809 (required:true); engine lacks archive-backed mode |
| `audit/regression-semantic-wave2a-20260807` | `ee600c3e5dbb9018e7f4f1075e1f1cd16a95c1ac` | `e535c857bd21` | 1 | 470 | 0 | 0 blobs unique to main history; every branch blob already reachable from main |
| `audit/tlp-hall-001-material-chain` | `70cf0c4f3c860afd877fb4010eb9c26a2d7120ed` | `dae54d23f7da` | 2 | 397 | 2 | exact-SHA twin permanently preserved at archive/forensic-tlp-hall-001-material-chain-20260809 (required:true); engine lacks archive-backed mode |
| `audit/tlp-hall-001-material-chain-current` | `efb906714a670335d1d050ecf88bba562abab45e` | `a8283267ae08` | 2 | 396 | 2 | exact-SHA twin permanently preserved at archive/forensic-tlp-hall-001-material-chain-current-20260809 (required:true); engine lacks archive-backed mode |
| `audit/tlp-hall-001-material-decision` | `bb296ae2d4613408184e41639a95457a1cda4c76` | `44c1b21580fc` | 2 | 391 | 0 | 0 blobs unique to main history; every branch blob already reachable from main |
| `audit/tlp-hall-material-chain-20260809` | `cbc19abd10c322d5811d8d884212f82b4f252833` | `dae54d23f7da` | 2 | 397 | 0 | exact-SHA twin permanently preserved at archive/forensic-tlp-hall-material-chain-20260809 (required:true); engine lacks archive-backed mode |
| `bugverifikator-audit-2026-07-17` | `f3a6b9700e56248074a475e278d41f6270de8793` | `b4f60182b19b` | 7 | 53 | 14 | exact-SHA twin permanently preserved at archive/forensic-bugverifikator-audit-2026-07-17-2026-09-06 (required:true); engine lacks archive-backed mode |
| `maintenance/auditrepo-archive-proof-retirement-20260906` | `cb068ad7d0dbee05bae7157aa39c8c90754d6a35` | `cb068ad7d0db` | 0 | 10 | 0 | pure ancestor of main: ahead_by=0, no unique commits, no unique blobs |
| `maintenance/auditrepo-retire-pr316-ref-20260906` | `99a98481bcd9712cf4230a7bcf2e17f339a6b351` | `9d09c545be58` | 1 | 9 | 1 | only unique blob is a rejected draft of a control-plane request JSON; accepted version + v2 are on main via merged PRs #359/#360 |

### D — NEEDS PRESERVATION BEFORE RETIREMENT  (9 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `agent/arena-lot-main-id-verification-20260717` | `d72ba0ee99f468fdc8f4262b5b3b6912b7794b08` | `b8e3b6592c06` | 1 | 98 | 1 | 1 unique blob(s) preserved only on this branch + refs/pull head |
| `agent/bugverifikator-master-delta-brand-title-20260717` | `7547fabab486a719f6f9b3cb794adf227c89c32c` | `f2751126bc11` | 2 | 76 | 2 | 2 unique blob(s) preserved only on this branch + refs/pull head |
| `agent/bugverifikator-master-readmit-wave-20260717` | `2d5ebe09e53bb926decaed169c6424fbc61cadf5` | `f2751126bc11` | 5 | 76 | 4 | 4 unique blob(s) preserved only on this branch + refs/pull head |
| `agent/gb-arena-master-reverify-20260818` | `90d43752f083fb84c5bdaec1b31a9f2f0b5eaf79` | `8c44a793e0c5` | 1 | 86 | 3 | 3 unique blob(s) preserved only on this branch + refs/pull head |
| `agent/gb-live-706c-reconciliation-20260809` | `7e6bba95e721e7e287efc42e246416ed7e1ca4e6` | `ac6406f09be4` | 2 | 381 | 2 | 2 unique blob(s) preserved only on this branch + refs/pull head |
| `arena/2026-08-17-gbs-reverify` | `b90dd90991b38ebece385b6d6784a39e8be4cb9b` | `5ce827a3a09c` | 1 | 103 | 2 | 2 unique blob(s) preserved only on this branch + refs/pull head |
| `arena/pr317-322-verifier-synthesis-20260717` | `851c58d843ae16ef2fe62eada20b3bba7ef23543` | `d79d080d7331` | 2 | 107 | 4 | 4 unique blob(s) preserved only on this branch + refs/pull head |
| `audit/regression-preservation-wave0-final5-20260807` | `a8cb02f6c270e8e55c782570b5201d6b04586bd3` | `e535c857bd21` | 6 | 470 | 3 | 3 unique blob(s) preserved only on this branch + refs/pull head |
| `verification/gb-search-ar-idx-09-closure-20260808` | `d73e508e0dd012b1a5f9af636ed7f5aa46a30591` | `118421f927ac` | 2 | 460 | 2 | 2 unique blob(s) preserved only on this branch + refs/pull head |

### E — NEEDS MANUAL REVIEW / PROOF INSUFFICIENT  (2 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `archive/forensic-tlp-hall-material-chain-20260809` | `cbc19abd10c322d5811d8d884212f82b4f252833` | `dae54d23f7da` | 2 | 397 | 0 | archive/* but 0 blobs unique to main history (content fully reducible); relaxing archive protection is an owner decision |
| `verification/gb-zero-direct-defects-next-wave-20260808` | `ae25effd426c34d6985cc17b892f70f5aa7906b3` | `9cb6823ba16e` | 2 | 455 | 2 | unclear ownership: no PR ever used this head, no archive twin, unique content |


---

## 7. Findings

### F-1 (HIGH) — A former `archive/*` anchor and its 13 preserved diverged tips are reachable from no live ref

The 2026-08-06 result record states the terminal inventory was limited to `main` plus two archive refs, and `references/ref-retirement/requests/2026-08-06-auditrepo-branch-cleanup.json` lists both as `required: true`:

- `archive/forensic-pr-3-vosk-tts-report-2026-07-24`
- `archive/legacy-diverged-heads-20260801`

Neither exists now. For the second, the preservation model was an octopus "archive anchor": `projects/gb-is-my-strength/legacy/branch-forensics/2026-08-01/legacy-diverged-heads-20260801.json` records *"Each source tip is an additional parent of the archive anchor; full commit history remains reachable."*

Re-verified in revision 2:

| Fact | Evidence |
|---|---|
| Anchor commit exists | `2589012b0b08e0faccbe8366f8a86a2e952fe493`, subject `archive: anchor legacy diverged histories`, `git cat-file -t` → `commit` |
| Anchor has **14** parents | `git log -1 --format='%P'` → 14 entries (`fd4d04fb…` + 13 preserved diverged tips) |
| Anchor is **not** an ancestor of `main` | `git merge-base --is-ancestor … origin/main` → non-zero |
| Reachable from **no** live ref | `git branch -r --contains` → empty; tested against all 46 remote-tracking refs |
| All 13 preserved tips still retrievable by SHA | each returned `LIVE` from `GET /repos/…/commits/<sha>` |
| The archive ref is gone | `git ls-remote --heads origin refs/heads/archive/legacy-diverged-heads-20260801` → 0 rows |

**Assessment:** the 13 diverged tips survive only because GitHub has not garbage-collected them. They are undiscoverable by ref enumeration and one GC cycle from being unrecoverable. The stated invariant *"full commit history remains reachable"* is **currently not satisfied**.

For the first archive ref the gap is benign and already documented: `projects/gb-is-my-strength/verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md` records that tip `07891373c6c9f488842a9a66e6cfde857ca74bce` remains accessible, both introduced paths exist on `main`, and the added REPORT blob is byte-identical to current `main`.

**Recommended (owner decision, not executed):** re-create `archive/legacy-diverged-heads-20260801` at `2589012b0b08e0faccbe8366f8a86a2e952fe493`. Deliberately **not** performed here: the retirement README aborts execution when "an unreviewed remote branch has appeared", so an unreviewed ref creation could block a future retirement run.

### F-2 (MEDIUM) — All 10 `archive/*` refs are exact-SHA duplicates of a still-live working ref

Re-verified in revision 2 — every `archive/*` ref resolves to the identical commit as a live non-archive ref, and **no** archive ref is a sole holder:

| `archive/*` ref (protected, `required: true`) | Live source ref at the same SHA | Head SHA | Unique blobs |
|---|---|---|---|
| `archive/forensic-arena-019fe0b5-auditrepo-2026-08-13` | `arena/019fe0b5-auditrepo` | `11ab74f3c396…` | 14 |
| `archive/forensic-arena-019fe0c4-auditrepo-2026-08-13` | `arena/019fe0c4-auditrepo` | `9239885f8ba8…` | 8 |
| `archive/forensic-bugverifikator-audit-2026-07-17-2026-09-06` | `bugverifikator-audit-2026-07-17` | `f3a6b9700e56…` | 14 |
| `archive/forensic-engine-contracts-pr323-2026-09-06` | `agent/arena-bugverifier-orphaned-guard-wiring-20260818` | `99b28c3311fc…` | 6 |
| `archive/forensic-gb-arena-master-reverify-20260717-2026-09-06` | `agent/arena-master-current-reverify-20260717` | `e1bc115e9570…` | 15 |
| `archive/forensic-gb-control-reconciliation-bc786-20260809` | `audit/gb-control-reconciliation-bc786-20260809` | `08692b0eadea…` | 5 |
| `archive/forensic-tlp-arena-master-reverify-20260818-2026-09-06` | `agent/tlp-arena-master-reverify-20260818` | `81548c21173c…` | 3 |
| `archive/forensic-tlp-hall-001-material-chain-20260809` | `audit/tlp-hall-001-material-chain` | `70cf0c4f3c86…` | 2 |
| `archive/forensic-tlp-hall-001-material-chain-current-20260809` | `audit/tlp-hall-001-material-chain-current` | `efb906714a67…` | 2 |
| `archive/forensic-tlp-hall-material-chain-20260809` | `audit/tlp-hall-material-chain-20260809` | `cbc19abd10c3…` | 0 |

**Assessment:** the archive refs currently add **zero** forensic authority beyond their twins — same object. Their archival value is realised only once the source ref is retired. This is exactly the state the reviewed requests anticipated: 7 of the 10 source refs carry the recorded reason *"Exact-SHA archive exists; archive-backed source-ref retirement will be handled separately."* This is the substance of Wave R1.

### F-3 (INFO) — Every previously reviewed retirement request is fully executed

All 6 request JSONs re-checked against the live inventory in revision 2: **43** targets, **0** still live. No pending or partially-executed request in flight; the control plane is in a consistent terminal state.

### F-4 (LOW) — Session-branch name collision

`arena/01a0770c-auditrepo`, the branch this agent's Arena session is pinned to, is shared with a sibling agent. The TLP SSOT-matrix agent pushed `ac643979397b` there and opened draft PR #366, then pushed a further commit `f1b16cd0b590` mid-audit. This agent integrated both without disturbing them: revision 1 was committed on top as a fast-forward (`23a8a7550e85`), and revision 2 was **rebased** onto `f1b16cd0b590` after the push was rejected as non-fast-forward. The rebase was conflict-free because the two agents touch disjoint paths — theirs is `projects/the-legendary-poet/**`, this agent's is a single file under `verification/`.

One later amend of this agent's own revision-2 commit required `git push --force-with-lease` pinned to this agent's own prior SHA (`8e0be162…`). That rewrote **only this agent's commit**; both sibling commits remain ancestors of the branch head and the sibling's report file is intact. This is disclosed rather than described as "no force-push", because a forced update did occur on the shared branch name even though no other author's work was affected.

Consequence: one draft PR carries two agents' work, and PR #366's `projects/the-legendary-poet/**` files are **not** this agent's. The 4 pre-created placeholders `arena/auditrepo-*-20260906` and `arena/tlp-ssot-matrix-audit-20260906` sit at `main` with zero commits and are classified **A**, not cleanup candidates.

### F-5 (LOW) — Historical result document is stale by design

`references/ref-retirement/results/2026-08-06-reviewed-23-ref-retirement.md` still asserts a terminal inventory of `main` + two archive refs, both now gone (F-1). Request JSONs are immutable and result documents are historical records, so **no change is recommended**; recorded so the drift is not mistaken for an unexplained regression.

---

## 8. Proposed cleanup wave

**Nothing below has been executed. No retirement request JSON was created. Each sub-wave requires a separate explicit owner decision.** Every proof is stated in the exact fields §2.1 shows the engine enforces.

### Wave R0 — executable today with existing engine modes (4 refs)

| Ref | `expectedHead` | mode | `comparisonBase` | `expectedAhead` | `allowedChangedPaths` | `replacementPullRequests` (all verified **MERGED**) |
|---|---|---|---|---|---|---|
| `maintenance/auditrepo-archive-proof-retirement-20260906` | `cb068ad7d0dbee05bae7157aa39c8c90754d6a35` | `ancestor` | *(n/a — base == head)* | `ahead_by` must be 0 ✔ | *(none)* | *(n/a)* |
| `agent/arena-home-resume-dead-20260717` | `2216192058a2c3963ffe9762e23a91bfcb5d3902` | `superseded` | `4ea3586eb7fa59bfa3ed2e720712f9919b4f7d9d` | 1 | `projects/gb-is-my-strength/incoming/arena-bugverifier/2026-07-17/REPORT.md` | **#362** |
| `audit/regression-semantic-wave2a-20260807` | `ee600c3e5dbb9018e7f4f1075e1f1cd16a95c1ac` | `superseded` | `e535c857bd2149bd1cbecc2df03857ab5ff5f545` | 1 | `projects/gb-is-my-strength/verification/2026-08-07-regression-semantic-wave2a/REPORT.md` | **#247** |
| `audit/tlp-hall-001-material-decision` | `bb296ae2d4613408184e41639a95457a1cda4c76` | `superseded` | `44c1b21580fcbf6b92a39ac726ce932e40497472` | 2 | `projects/the-legendary-poet/WORK_QUEUE.md`; `projects/the-legendary-poet/verification/2026-08-09-hall-v3-material-decision/DECISION.md` | **#281** |

Replacement authority, each traced to a **merged** PR (the engine rejects unmerged ones):

| Candidate | Preservation commit on `main` | Merged PR | Verified |
|---|---|---|---|
| `agent/arena-home-resume-dead-20260717` | `5915b8acb215415436972c859179d6e0768bde19` — *"evidence(gb): preserve PR #326 homepage resume witness"* | **#362** (`maintenance/auditrepo-preserve-pr326-resume-evidence-20260906`) | MERGED 2026-09-06T06:44:06Z; the branch's only changed blob `e52a7e8694db` is **byte-identical in `main`'s current tree** |
| `audit/regression-semantic-wave2a-20260807` | `be2ffb62b97e609fa966c76afb00b8d3e7bddfcb` | **#247** (`audit/regression-semantic-wave2a-current-20260807`) | MERGED 2026-08-07T20:16:03Z; merge commit **is** `be2ffb62b97e`; blob `8b10d3795ea8` byte-identical in `main`'s current tree |
| `audit/tlp-hall-001-material-decision` | `9850ebe39f21…` | **#281** (`audit/tlp-hall-001-material-decision-current`) | MERGED 2026-08-09T13:51:29Z; merge commit **is** `9850ebe39f21`; `DECISION.md` blob `699b0ccd05d8` in `main`'s current tree, `WORK_QUEUE.md` revision `1fdb6d80258c` a superseded intermediate already in `main` history |

Note the clean supersession chain: closed PR #242 → merged clean rebuild **#247**; closed PR #280 → merged clean rebuild **#281**; closed PR #326 → merged preservation **#362**. All four R0 refs have **0** blobs unique to `main` history, so deleting them cannot lose file content.

**Additionally promote-ready (moved D → C in this revision):**

| Ref | `expectedHead` | mode | `comparisonBase` | `expectedAhead` | `allowedChangedPaths` | `replacementPullRequests` |
|---|---|---|---|---|---|---|
| `maintenance/auditrepo-retire-pr316-ref-20260906` | `99a98481bcd9712cf4230a7bcf2e17f339a6b351` | `superseded` | `9d09c545be58f7c0239eeffc030b4542178d48fa` | 1 | `references/ref-retirement/requests/2026-09-06-resolved-intake-316.json` | **#359**, **#360** |

Its single unique blob is a **rejected draft** of an immutable control-plane request JSON (closed PR #358). `main` carries the accepted version via merged **#359** (`72e9dc7297c8`) and the retry via merged **#360** (`3ab2171d2e44`), and the request's own target `agent/arena-source-link-concurrency-20260717` is already gone. Policy forbids preserving competing control-plane revisions. The exact rejected bytes remain retrievable at `refs/pull/358/head` (verified identical to the branch head), so recoverability survives deletion.

### Wave R1 — proof complete, blocked on a missing engine mode (10 refs)

Each head commit is permanently preserved at an `archive/*` ref marked `required: true` in reviewed requests, satisfying the README's *"intentionally preserved under `archive/`"* clause. **Blocker:** no archive-backed target mode exists and the engine refuses to delete `archive/*`.

| Ref | Head SHA | ahead | Preserved at (identical SHA) | Unique blobs |
|---|---|---|---|---|
| `arena/019fe0b5-auditrepo` | `11ab74f3c396c2f17539cd9b770c91c3b1e89b6f` | 11 | `archive/forensic-arena-019fe0b5-auditrepo-2026-08-13` | 14 |
| `arena/019fe0c4-auditrepo` | `9239885f8ba8dfc84a4125339bc408c899b495c5` | 7 | `archive/forensic-arena-019fe0c4-auditrepo-2026-08-13` | 8 |
| `audit/gb-control-reconciliation-bc786-20260809` | `08692b0eadea72ea10d50ed97faa6e6ec837d5e9` | 5 | `archive/forensic-gb-control-reconciliation-bc786-20260809` | 5 |
| `audit/tlp-hall-001-material-chain` | `70cf0c4f3c860afd877fb4010eb9c26a2d7120ed` | 2 | `archive/forensic-tlp-hall-001-material-chain-20260809` | 2 |
| `audit/tlp-hall-001-material-chain-current` | `efb906714a670335d1d050ecf88bba562abab45e` | 2 | `archive/forensic-tlp-hall-001-material-chain-current-20260809` | 2 |
| `audit/tlp-hall-material-chain-20260809` | `cbc19abd10c322d5811d8d884212f82b4f252833` | 2 | `archive/forensic-tlp-hall-material-chain-20260809` | 0 |
| `bugverifikator-audit-2026-07-17` | `f3a6b9700e56248074a475e278d41f6270de8793` | 7 | `archive/forensic-bugverifikator-audit-2026-07-17-2026-09-06` | 14 |
| `agent/arena-bugverifier-orphaned-guard-wiring-20260818` | `99b28c3311fcc0e717390cee282c768350beccb5` | 1 | `archive/forensic-engine-contracts-pr323-2026-09-06` | 6 |
| `agent/arena-master-current-reverify-20260717` | `e1bc115e957070fe61329ef04ca58a555e846d18` | 2 | `archive/forensic-gb-arena-master-reverify-20260717-2026-09-06` | 15 |
| `agent/tlp-arena-master-reverify-20260818` | `81548c21173c1409c3e3aafd65cee4a4bf769253` | 1 | `archive/forensic-tlp-arena-master-reverify-20260818-2026-09-06` | 3 |

Three of these additionally carry a closed `superseded` PR (#323, #335, #330), i.e. **two** independent preservation authorities.

### Wave R2 — preservation required first (9 refs, 9 must-preserve files)

These closed-PR heads hold blobs existing **nowhere** on `main`. Retiring them today would leave that content reachable only via `refs/pull/<n>/head` — which revision 2 verified **live and SHA-identical for all 10 original D refs**, and which the repository's own engine already treats as recoverability evidence (`headAccessible = Boolean(commit)`, feeding `inaccessibleClosedHeads`). The established remedy is the PR #354 pattern: *"preserved raw reports byte-for-byte"* into `main` first, then retire.

Of the original 24 unique files, only **10** were genuine evidence obligations; **14** were superseded control-plane revisions policy forbids preserving. After the promotion above, this wave holds **9 must-preserve files**.

| Ref | Head SHA | PR | Must-preserve files | Superseded control-plane revisions (do not preserve) |
|---|---|---|---|---|
| `agent/arena-lot-main-id-verification-20260717` | `d72ba0ee99f4…` | #327 closed | 1 raw-intake: `incoming/arena-lot-main-id-verifier/2026-07-17/REPORT.md` | — |
| `agent/bugverifikator-master-delta-brand-title-20260717` | `7547fabab486…` | #331 closed | **none** | `incoming/bugverifikator/2026-07-17/README.md`; `verified/MASTER_BUG_MATRIX.md` |
| `agent/bugverifikator-master-readmit-wave-20260717` | `2d5ebe09e53b…` | #333 closed | 2 raw-intake: `MASTER_READMIT_WAVE.md`, `REPORT_matrix_integrity.md` | `incoming/bugverifikator/2026-07-17/README.md`; `verified/MASTER_BUG_MATRIX.md` |
| `agent/gb-arena-master-reverify-20260818` | `90d43752f083…` | #329 closed | 1 raw-intake + 1 governed: `incoming/arena-agent/2026-08-18/REPORT.md`; `verification/2026-08-18-arena-agent-master-reverify/REPORT.md` | `incoming/arena-agent/2026-08-18/README.md` |
| `agent/gb-live-706c-reconciliation-20260809` | `7e6bba95e721…` | #285 closed | 1 governed: `verification/2026-08-09-main-706c-live-audit/REPORT.md` | `verified/MASTER_BUG_MATRIX.md` |
| `arena/2026-08-17-gbs-reverify` | `b90dd90991b3…` | #325 closed | 1 governed: `verification/2026-08-17-arena-current-head-reverify-gbs/REPORT.md` | `verified/MASTER_BUG_MATRIX.md` |
| `arena/pr317-322-verifier-synthesis-20260717` | `851c58d843ae…` | #324 closed | 1 governed: `verification/2026-07-17-arena-pr317-322-synthesis/REPORT.md` | 2 × `README.md`; `verified/MASTER_BUG_MATRIX.md` |
| `audit/regression-preservation-wave0-final5-20260807` | `a8cb02f6c270…` | #239 closed | 1 governed: `verification/2026-08-07-regression-preservation-wave0/REPORT.md` | `WORK_QUEUE.md`; `verified/MASTER_BUG_MATRIX.md` |
| `verification/gb-search-ar-idx-09-closure-20260808` | `d73e508e0dd0…` | #254 closed | 1 governed: `verification/2026-08-08-search-ar-idx-09-closure/REPORT.md` | `verified/MASTER_BUG_MATRIX.md` |

`agent/bugverifikator-master-delta-brand-title-20260717` has **zero** evidence obligations and is promotion-ready on the same reasoning as the #316 draft — but only after the owner confirms that **open** PR #328 supersedes closed PR #331's matrix delta. Until then it stays in D.

### Wave R3 — owner decision required (2 refs)

| Ref | Head SHA | Why it cannot be auto-classified |
|---|---|---|
| `archive/forensic-tlp-hall-material-chain-20260809` | `cbc19abd10c3…` | An `archive/*` ref holding **0** blobs unique to `main` history — its content *is* safely reducible to `main`, the exact condition under which `CLEANUP_RETENTION_POLICY.md` says such refs need not be retained. But it is `required: true` in reviewed requests and the engine refuses to delete `archive/*`. Relaxing an archive protection is an owner decision. |
| `verification/gb-zero-direct-defects-next-wave-20260808` | `ae25effd426c…` | **Unclear ownership.** No PR ever used this head, no `archive/*` twin exists, and it holds 2 blobs never on `main`. The engine reconciles it only by name heuristics (`diagnostic-transaction-branch`) — inference, not review. Deletion would lose content with **no** PR-head fallback. Needs explicit owner disposition. |

### Deferred — not in any wave

The four empty session placeholders `arena/auditrepo-evidence-integrity-audit-20260906`, `arena/auditrepo-governance-contract-audit-20260906`, `arena/auditrepo-ref-forensic-audit-20260906`, `arena/tlp-ssot-matrix-audit-20260906` sit at `main` with zero commits — trivially retireable in `ancestor` mode, but they belong to the live 2026-09-06 five-agent audit. Revisit after that audit closes.

---

## 9. Completeness cross-check — every closed-unmerged PR with a live head is accounted for

Of the 60 closed-unmerged PRs, **44** have head SHAs that are no longer any live branch head (nothing to retire), and **16** still do. All 16 map onto a wave above — there is no unaccounted ref:

| Closed-unmerged PR | Category | Live ref(s) at that head | Wave |
|---|---|---|---|
| #242 | superseded | `audit/regression-semantic-wave2a-20260807` | R0 |
| #280 | superseded | `audit/tlp-hall-001-material-decision` | R0 |
| #326 | diagnostic | `agent/arena-home-resume-dead-20260717` | R0 |
| #358 | superseded | `maintenance/auditrepo-retire-pr316-ref-20260906` | R0 (promoted) |
| #323 | superseded | `agent/arena-bugverifier-orphaned-guard-wiring-20260818` + its archive twin | R1 |
| #330 | superseded | `agent/tlp-arena-master-reverify-20260818` + its archive twin | R1 |
| #335 | superseded | `agent/arena-master-current-reverify-20260717` + its archive twin | R1 |
| #239 | superseded | `audit/regression-preservation-wave0-final5-20260807` | R2 |
| #254 | superseded | `verification/gb-search-ar-idx-09-closure-20260808` | R2 |
| #285 | superseded | `agent/gb-live-706c-reconciliation-20260809` | R2 |
| #324 | superseded | `arena/pr317-322-verifier-synthesis-20260717` | R2 |
| #325 | superseded | `arena/2026-08-17-gbs-reverify` | R2 |
| #327 | superseded | `agent/arena-lot-main-id-verification-20260717` | R2 |
| #329 | superseded | `agent/gb-arena-master-reverify-20260818` | R2 |
| #331 | superseded | `agent/bugverifikator-master-delta-brand-title-20260717` | R2 (zero evidence) |
| #333 | superseded | `agent/bugverifikator-master-readmit-wave-20260717` | R2 |

4 + 3 + 9 = **16**. ✔

---

## 10. Recommended sequencing

1. **Now (owner decision):** Wave R0 — 5 refs (4 original + 1 promoted), **0 evidence at risk**, existing engine modes only. Lowest risk, highest confidence.
2. **Now (owner decision, independent of cleanup):** resolve **F-1** by re-anchoring `archive/legacy-diverged-heads-20260801` at `2589012b0b08e0faccbe8366f8a86a2e952fe493`. This *restores* forensic authority and should precede any deletion wave.
3. **Then:** Wave R2 preservation PRs (9 files, PR #354 byte-for-byte precedent), after which those refs move to C.
4. **Only after** a separately reviewed archive-backed engine mode exists: Wave R1 — 10 refs.
5. **Owner disposition:** Wave R3 — 2 refs.

---

## 11. Non-execution statement

This agent performed **no** destructive or ref-mutating action:

- no branch deleted, created or repointed. One `git push --force-with-lease=arena/01a0770c-auditrepo:8e0be162…` was used on this agent's **own** session branch to amend this agent's **own** commit (revision-2 text correction). The lease was pinned to this agent's own prior SHA, and both sibling commits `ac643979397b` and `f1b16cd0b590` were re-verified present in the branch history afterwards, with the sibling's file `projects/the-legendary-poet/verification/2026-09-06-ssot-matrix-integrity-audit/REPORT.md` intact. No other agent's commit was rewritten or discarded;
- no PR opened, closed, merged, labelled or approved;
- no ref-retirement execution request, wrapper or engine change authored;
- no `archive/*` ref touched;
- no MASTER matrix, WORK_QUEUE, closure ledger or disposition ledger modified;
- no raw evidence rewritten or removed.

The only repository mutation produced by this agent is this single report file at a uniquely owned path. The `--strict` history-forensic gate was re-run after data collection and returned `unexplainedRemoteBranches: 0`, `inaccessibleClosedHeads: 0`, `manualReviewCandidates: 0`.

---

## 12. Second-pass re-verification (revision 2)

The whole inventory was re-derived from scratch — new clone state, rebuilt main object universe, fresh `ls-remote`, fresh PR universe, fresh engine run — and diffed row-by-row against revision 1's committed table.

### 12.1 Result of the row-by-row diff

- Refs present in both: **47/47**. None missing, none extra.
- Rows reproducing **exactly** (head SHA, ahead, behind, unique-blob count, engine reconciliation, category): **44/47**.
- Rows that differed: **3**, all live sibling-agent branches that advanced between revisions:

| Ref | Rev 1 head → Rev 2 head | ahead | Unique blobs | Category |
|---|---|---|---|---|
| `arena/01a076fd-auditrepo` | `660f68629562` → `617aeaa111ca` † | 1 → 4 | 10 → 11 | A → **A** (unchanged) |
| `arena/01a0770c-auditrepo` | `ac643979397b` → *(this commit)* † | 1 → 4 | 7 → 9 | A → **A** (unchanged) |
| `arena/01a0770d-auditrepo` | `f923b7b59a55` → `167ea7c2d2d4` † | 1 → 5 | 4 → 14 | A → **A** (unchanged) |

The `arena/01a0770c-auditrepo` movement is this agent's **own** report commit. No classification changed; these rows are now refreshed in §5/§6. Branch count stayed 48 and `main` stayed `29450bf8`, so no other conclusion required re-derivation.

### 12.2 Substantive correction

**Revision 1 claimed** the preservation authority for `agent/arena-home-resume-dead-20260717` was the bare commit `5915b8acb215`, described as "a parent of `main` tip", and named **no merged PR**.

**That was incomplete and, against the engine, unusable.** `scripts/retire_reviewed_refs.py` requires every `replacementPullRequests` entry to be a merged PR and aborts with `replacement PR #N is not merged` otherwise; a bare commit cannot satisfy it. Revision 2 queried `GET /repos/…/commits/5915b8ac…/pulls` and found **PR #362** (`maintenance/auditrepo-preserve-pr326-resume-evidence-20260906`), verified **MERGED** at 2026-09-06T06:44:06Z. Wave R0 is now fully engine-expressible for all four original candidates. The same query established merged PRs **#247**, **#281**, **#359** and **#360** for the other candidates.

### 12.3 Additional proofs added in revision 2

| Claim | Revision 1 | Revision 2 |
|---|---|---|
| D-wave heads preserved by `refs/pull/N/head` | spot-checked 5 PRs | **all 10** verified SHA-identical |
| Wave R0 fields satisfy the engine | asserted from the README contract | verified against `retire_reviewed_refs.py` source (`ancestor`/`superseded` validation blocks) |
| `missingIntroducedPaths: 75` severity | mentioned without explanation | proven **informational** — not in `STRICT_ZERO_SUMMARY_KEYS` |
| Closed-unmerged PR coverage | mapped only PRs that had branches | all **60** enumerated; the **16** with live heads each mapped to a wave (§9) |
| Archive twins | 10 pairs found | re-verified **10/10**, and confirmed **no** archive ref is a sole holder |
| Reviewed requests executed | 43 targets, 0 live | re-checked: **43** targets, **0** live |
| F-1 anchor unreachable | verified | re-verified: `commit`, 14 parents, not an ancestor of `main`, contained in no live ref, archive ref absent |

### 12.4 One classification change

`maintenance/auditrepo-retire-pr316-ref-20260906` moved **D → C** once merged replacement PRs #359/#360 were identified, making its proof engine-expressible. Category counts are therefore **A=12, B=9, C=15, D=9, E=2** (revision 1 had C=14, D=10).

---

## 13. Reproduction

```bash
# 0. Never trust topology before asserting a full clone
git rev-parse --is-shallow-repository           # must be false
git fetch --unshallow origin                     # if true
git fetch origin '+refs/heads/*:refs/remotes/origin/*' --prune

# 1. Live universe
git ls-remote --heads origin | wc -l
gh pr list --repo FedorMilovanov/AuditRepo --state all --limit 1000 --json number,state,headRefName

# 2. Repository's own authoritative gate
GITHUB_TOKEN=... NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt \
  node scripts/repository_history_forensic_audit.mjs --strict

# 3. Decisive content-preservation test for any ref
git rev-list --objects origin/main | awk 'NF>=2{print $1}' | sort -u > /tmp/main_objects
git ls-tree -r --format='%(objectname) %(path)' <ref> | \
  while read -r blob path; do grep -qx "$blob" /tmp/main_objects || echo "UNIQUE $path"; done

# 4. Engine-shaped proof fields for a candidate
git merge-base origin/main <ref>                                  # comparisonBase
git rev-list --count origin/main..<ref>                           # expectedAhead
git diff --name-only $(git merge-base origin/main <ref>) <ref>    # allowedChangedPaths

# 5. Replacement PR must be MERGED, not merely closed
gh api repos/FedorMilovanov/AuditRepo/commits/<preservation-sha>/pulls --jq '.[].number'
gh pr view <N> --repo FedorMilovanov/AuditRepo --json state,mergedAt

# 6. Closed-PR head fallback
gh api repos/FedorMilovanov/AuditRepo/git/refs/pull/<N>/head --jq .object.sha
```
