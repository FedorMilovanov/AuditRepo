# AuditRepo ref & PR forensic inventory — Agent 2 (repository-history / branch / PR forensics)

**Audit date (UTC):** 2026-09-06
**Scope:** complete current forensic inventory of AuditRepo remote refs and pull-request history.
**Mode:** strictly non-destructive. No branch was created, deleted, merged, closed or repointed. No PR was opened, closed or merged by this analysis. No retirement engine, workflow or MASTER matrix was modified. No raw evidence was rewritten.
**Deliverable:** this report only, plus a proposed cleanup wave that requires a separate explicit owner decision before any execution.

---

## 1. Verification provenance (what was actually run)

Every number in this report came from a command executed during this audit, not from prior state or assumption.

| Check | Command | Result |
|---|---|---|
| Live remote ref universe | `git ls-remote --heads origin` | **48** branches (47 non-main + `main`) |
| Main head | `git ls-remote origin refs/heads/main` | `29450bf8dc3baa69289be770e3fbb64a1728dcee` |
| Main history depth | `git rev-list --count origin/main` | **1490** commits |
| Full PR universe | `gh pr list --state all --limit 1000` | **362** PRs — 294 merged, 60 closed-unmerged, 8 open |
| Repository's own forensic gate | `node scripts/repository_history_forensic_audit.mjs --strict` | **PASS** — `unexplainedRemoteBranches: 0`, `inaccessibleClosedHeads: 0`, `manualReviewCandidates: 0` |
| Content-preservation proof | per-branch `ls-tree` blobs vs `git rev-list --objects origin/main` (9527 objects) | per-ref "unique blobs never on main" count |
| Reviewed retirement requests | all 6 JSONs under `references/ref-retirement/requests/` | **43** targets, **0** still live (all executed) |

### 1.1 Methodological correction made during this audit

The initial clone in this workspace was a **depth-1 shallow clone pinned at `main`** (`.git/shallow` contained `29450bf8…`; `git rev-parse --is-shallow-repository` returned `true`; `remote.origin.fetch` was single-branch `+refs/heads/main:…`).

Under that state `git rev-list --count origin/main` returned **1** and `git merge-base origin/main <any branch>` returned **empty**, which falsely implied that `main` was an unrelated single-commit root and that every branch held 1000+ unmerged commits. That reading was a clone artifact, not a repository fact. After `git fetch --unshallow`, `main` correctly reports **1490** commits and all merge-bases resolve.

**Consequence for any future agent:** never draw ancestry, ahead/behind or "unique commit" conclusions in this repository without first asserting `git rev-parse --is-shallow-repository` is `false`.

---

## 2. Policy cross-check (existing rules, not new ones)

This inventory applies the repository's own current rules. No new retention rule was invented.

| Authority | Rule applied here |
|---|---|
| `references/ref-retirement/README.md` | "A branch may be retired only when its evidence is already reachable from `main`, intentionally preserved under `archive/`, or explicitly superseded by a merged successor. Lower branch count is not sufficient justification." |
| `references/ref-retirement/README.md` (Safety barriers) | The engine refuses to delete `main`, any `archive/*` ref, any retained ref, any open-PR head, a ref whose live SHA changed after review, or any target when live `main` differs from the reviewed base. |
| `references/ref-retirement/README.md` (Request contract) | Every target needs exact branch name, exact expected head SHA, reviewed classification, and either an `ancestor` proof or a `superseded` proof with replacement PRs and an exact changed-path set. |
| `CLEANUP_RETENTION_POLICY.md` → *Branch retention* | "retain intentional `archive/*` refs only when they preserve real forensic authority not safely reducible to normal files/history"; "do not optimize branch count at the cost of losing important evidence". |
| `CLEANUP_RETENTION_POLICY.md` → *Never do this* | "never silently delete raw evidence"; "never maintain two competing active matrices". |
| `scripts/repository_history_forensic_audit.mjs` → `reconcileBranch()` | The repository's own reconciliation taxonomy (`archived-source-ref`, `closed-superseded-pr-head`, `open-pr-head`, `git-ancestor-of-main`, …) is reused verbatim in §5 so this report does not compete with CI. |
| `projects/gb-is-my-strength/verified/closed-unmerged-pr-dispositions.json` | The reviewed closed-unmerged PR disposition ledger (categories `superseded` / `diagnostic` / `prototype` / `archived` / `parked`). |

**Engine capability constraint that shapes this report:** the permanent engine `scripts/retire_reviewed_refs.py` supports only `ancestor` and `superseded` modes. The reviewed requests record explicitly that *"archive-backed retirement requires a separately reviewed engine mode."* That mode does **not** exist today. This report therefore separates proof-complete-but-executable (Wave R0) from proof-complete-but-blocked (Wave R1), and does **not** implement the missing mode.

---

## 3. Baseline state

- `main` = `29450bf8dc3baa69289be770e3fbb64a1728dcee` (merge of PR #363, 2026-09-06), 1490 commits, 1929 files.
- **48** live remote branches; **10** are `archive/*`; **0** tags.
- **362** PRs: 294 merged, 60 closed-unmerged, 8 open.
- Repository's own strict gate: **green** — `0` unexplained refs, `0` inaccessible closed heads, `0` manual review candidates, `missingIntroducedPaths: 75`.

> **Important framing:** because the repository's own gate already reports `unexplainedRemoteBranches: 0`, **no ref in this repository is currently non-compliant**. Nothing here is required for CI. The proposed wave is authority-minimisation hygiene, and it is optional. This is stated explicitly so that branch count is never used as its own justification, per the retirement README.

---

## 4. Universe volatility observed during this audit

Ref state moved while the audit was in progress; conclusions below reflect the refreshed universe.

| Time (UTC) | Branches | Open PRs | `main` |
|---|---|---|---|
| 14:08 (initial) | 45 | 5 | `29450bf8…` |
| 14:20 (refresh) | **48** | 7 | `29450bf8…` (unchanged) |
| 14:22 (engine re-run) | **48** | **8** | `29450bf8…` (unchanged) |

New arrivals during the audit: `arena/01a076fd-auditrepo`, `arena/01a0770c-auditrepo`, `arena/01a0770d-auditrepo` and draft PRs #364, #365, #366 — sibling agents of the live 2026-09-06 five-agent audit. **`main` did not move**, so no conclusion below required re-derivation for main drift. If `main` moves after this point, §3 baseline and every `ahead/behind` figure must be re-derived before execution.

---

## 5. Complete inventory — all 47 non-main refs

`Unique blobs` = count of blobs in that ref's tip tree that appear **nowhere** in `main`'s entire 1490-commit object history. This is the decisive test: `0` means the ref's complete file content is already reducible to `main` history, regardless of commit-graph divergence.

| # | Ref | Head SHA | ahead/behind | Unique blobs | Engine reconciliation | PR disposition | Category |
|---|-----|----------|--------------|--------------|-----------------------|----------------|----------|
| 1 | `agent/bugverifikator-brand-title-authority-20260717` | `e116b7059e1a` | 3/91 | 2 | `open-pr-head` | #328 open | **A** |
| 2 | `arena/01a076fd-auditrepo` | `660f68629562` | 1/0 | 10 | `open-pr-head` | #365 open | **A** |
| 3 | `arena/01a0770c-auditrepo` | `ac643979397b` | 1/0 | 7 | `open-pr-head` | #366 open | **A** |
| 4 | `arena/01a0770d-auditrepo` | `f923b7b59a55` | 1/0 | 4 | `open-pr-head` | #364 open | **A** |
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
| 36 | `agent/arena-lot-main-id-verification-20260717` | `d72ba0ee99f4` | 1/98 | 1 | `closed-superseded-pr-head` | #327 closed/superseded | **D** |
| 37 | `agent/bugverifikator-master-delta-brand-title-20260717` | `7547fabab486` | 2/76 | 2 | `closed-superseded-pr-head` | #331 closed/superseded | **D** |
| 38 | `agent/bugverifikator-master-readmit-wave-20260717` | `2d5ebe09e53b` | 5/76 | 4 | `closed-superseded-pr-head` | #333 closed/superseded | **D** |
| 39 | `agent/gb-arena-master-reverify-20260818` | `90d43752f083` | 1/86 | 3 | `closed-superseded-pr-head` | #329 closed/superseded | **D** |
| 40 | `agent/gb-live-706c-reconciliation-20260809` | `7e6bba95e721` | 2/381 | 2 | `closed-superseded-pr-head` | #285 closed/superseded | **D** |
| 41 | `arena/2026-08-17-gbs-reverify` | `b90dd90991b3` | 1/103 | 2 | `closed-superseded-pr-head` | #325 closed/superseded | **D** |
| 42 | `arena/pr317-322-verifier-synthesis-20260717` | `851c58d843ae` | 2/107 | 4 | `closed-superseded-pr-head` | #324 closed/superseded | **D** |
| 43 | `audit/regression-preservation-wave0-final5-20260807` | `a8cb02f6c270` | 6/470 | 3 | `closed-superseded-pr-head` | #239 closed/superseded | **D** |
| 44 | `maintenance/auditrepo-retire-pr316-ref-20260906` | `99a98481bcd9` | 1/9 | 1 | `closed-superseded-pr-head` | #358 closed/superseded | **D** |
| 45 | `verification/gb-search-ar-idx-09-closure-20260808` | `d73e508e0dd0` | 2/460 | 2 | `closed-superseded-pr-head` | #254 closed/superseded | **D** |
| 46 | `archive/forensic-tlp-hall-material-chain-20260809` | `cbc19abd10c3` | 2/397 | 0 | `archived-recovery-branch` | — | **E** |
| 47 | `verification/gb-zero-direct-defects-next-wave-20260808` | `ae25effd426c` | 2/455 | 2 | `diagnostic-transaction-branch` | — | **E** |

---

## 6. Classification (exactly one category per ref)

Category counts: **A = 12, B = 9, C = 14, D = 10, E = 2** (total 47).

### A — ACTIVE / OPEN-PR OWNED  (12 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `agent/bugverifikator-brand-title-authority-20260717` | `e116b7059e1aab9d2bd71b06cf5026f6ff0d5c21` | `a0ac1c91c69e` | 3 | 91 | 2 | open PR head #328 |
| `arena/01a076fd-auditrepo` | `660f68629562bd6b88cdcddbc990da9c552cf028` | `29450bf8dc3b` | 1 | 0 | 10 | open PR head #365 |
| `arena/01a0770c-auditrepo` | `ac643979397b58b2f1bc4c2e5f0bd59d00be23c0` | `29450bf8dc3b` | 1 | 0 | 7 | open PR head #366 |
| `arena/01a0770d-auditrepo` | `f923b7b59a5586a837c42460ac50c636c4fbbbbd` | `29450bf8dc3b` | 1 | 0 | 4 | open PR head #364 |
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

### C — SAFE RETIREMENT CANDIDATE, PROOF COMPLETE  (14 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `agent/arena-bugverifier-orphaned-guard-wiring-20260818` | `99b28c3311fcc0e717390cee282c768350beccb5` | `d79d080d7331` | 1 | 107 | 6 | exact-SHA twin permanently preserved at archive/forensic-engine-contracts-pr323-2026-09-06 (required:true); engine lacks archive-backed mode |
| `agent/arena-home-resume-dead-20260717` | `2216192058a2c3963ffe9762e23a91bfcb5d3902` | `4ea3586eb7fa` | 1 | 102 | 0 | 0 blobs unique to main history; every branch blob is already reachable from main |
| `agent/arena-master-current-reverify-20260717` | `e1bc115e957070fe61329ef04ca58a555e846d18` | `b4f60182b19b` | 2 | 53 | 15 | exact-SHA twin permanently preserved at archive/forensic-gb-arena-master-reverify-20260717-2026-09-06 (required:true); engine lacks archive-backed mode |
| `agent/tlp-arena-master-reverify-20260818` | `81548c21173c1409c3e3aafd65cee4a4bf769253` | `8ef37c99c8f6` | 1 | 77 | 3 | exact-SHA twin permanently preserved at archive/forensic-tlp-arena-master-reverify-20260818-2026-09-06 (required:true); engine lacks archive-backed mode |
| `arena/019fe0b5-auditrepo` | `11ab74f3c396c2f17539cd9b770c91c3b1e89b6f` | `e50c4c938594` | 11 | 420 | 14 | exact-SHA twin permanently preserved at archive/forensic-arena-019fe0b5-auditrepo-2026-08-13 (required:true); engine lacks archive-backed mode |
| `arena/019fe0c4-auditrepo` | `9239885f8ba8dfc84a4125339bc408c899b495c5` | `e50c4c938594` | 7 | 420 | 8 | exact-SHA twin permanently preserved at archive/forensic-arena-019fe0c4-auditrepo-2026-08-13 (required:true); engine lacks archive-backed mode |
| `audit/gb-control-reconciliation-bc786-20260809` | `08692b0eadea72ea10d50ed97faa6e6ec837d5e9` | `5154a5ef11c2` | 5 | 374 | 5 | exact-SHA twin permanently preserved at archive/forensic-gb-control-reconciliation-bc786-20260809 (required:true); engine lacks archive-backed mode |
| `audit/regression-semantic-wave2a-20260807` | `ee600c3e5dbb9018e7f4f1075e1f1cd16a95c1ac` | `e535c857bd21` | 1 | 470 | 0 | 0 blobs unique to main history; every branch blob is already reachable from main |
| `audit/tlp-hall-001-material-chain` | `70cf0c4f3c860afd877fb4010eb9c26a2d7120ed` | `dae54d23f7da` | 2 | 397 | 2 | exact-SHA twin permanently preserved at archive/forensic-tlp-hall-001-material-chain-20260809 (required:true); engine lacks archive-backed mode |
| `audit/tlp-hall-001-material-chain-current` | `efb906714a670335d1d050ecf88bba562abab45e` | `a8283267ae08` | 2 | 396 | 2 | exact-SHA twin permanently preserved at archive/forensic-tlp-hall-001-material-chain-current-20260809 (required:true); engine lacks archive-backed mode |
| `audit/tlp-hall-001-material-decision` | `bb296ae2d4613408184e41639a95457a1cda4c76` | `44c1b21580fc` | 2 | 391 | 0 | 0 blobs unique to main history; every branch blob is already reachable from main |
| `audit/tlp-hall-material-chain-20260809` | `cbc19abd10c322d5811d8d884212f82b4f252833` | `dae54d23f7da` | 2 | 397 | 0 | exact-SHA twin permanently preserved at archive/forensic-tlp-hall-material-chain-20260809 (required:true); engine lacks archive-backed mode |
| `bugverifikator-audit-2026-07-17` | `f3a6b9700e56248074a475e278d41f6270de8793` | `b4f60182b19b` | 7 | 53 | 14 | exact-SHA twin permanently preserved at archive/forensic-bugverifikator-audit-2026-07-17-2026-09-06 (required:true); engine lacks archive-backed mode |
| `maintenance/auditrepo-archive-proof-retirement-20260906` | `cb068ad7d0dbee05bae7157aa39c8c90754d6a35` | `cb068ad7d0db` | 0 | 10 | 0 | pure ancestor of main: ahead=0, no unique commits, no unique blobs |

### D — NEEDS PRESERVATION BEFORE RETIREMENT  (10 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `agent/arena-lot-main-id-verification-20260717` | `d72ba0ee99f468fdc8f4262b5b3b6912b7794b08` | `b8e3b6592c06` | 1 | 98 | 1 | 1 unique blob(s) preserved only on this branch + PR head ref |
| `agent/bugverifikator-master-delta-brand-title-20260717` | `7547fabab486a719f6f9b3cb794adf227c89c32c` | `f2751126bc11` | 2 | 76 | 2 | 2 unique blob(s) preserved only on this branch + PR head ref |
| `agent/bugverifikator-master-readmit-wave-20260717` | `2d5ebe09e53bb926decaed169c6424fbc61cadf5` | `f2751126bc11` | 5 | 76 | 4 | 4 unique blob(s) preserved only on this branch + PR head ref |
| `agent/gb-arena-master-reverify-20260818` | `90d43752f083fb84c5bdaec1b31a9f2f0b5eaf79` | `8c44a793e0c5` | 1 | 86 | 3 | 3 unique blob(s) preserved only on this branch + PR head ref |
| `agent/gb-live-706c-reconciliation-20260809` | `7e6bba95e721e7e287efc42e246416ed7e1ca4e6` | `ac6406f09be4` | 2 | 381 | 2 | 2 unique blob(s) preserved only on this branch + PR head ref |
| `arena/2026-08-17-gbs-reverify` | `b90dd90991b38ebece385b6d6784a39e8be4cb9b` | `5ce827a3a09c` | 1 | 103 | 2 | 2 unique blob(s) preserved only on this branch + PR head ref |
| `arena/pr317-322-verifier-synthesis-20260717` | `851c58d843ae16ef2fe62eada20b3bba7ef23543` | `d79d080d7331` | 2 | 107 | 4 | 4 unique blob(s) preserved only on this branch + PR head ref |
| `audit/regression-preservation-wave0-final5-20260807` | `a8cb02f6c270e8e55c782570b5201d6b04586bd3` | `e535c857bd21` | 6 | 470 | 3 | 3 unique blob(s) preserved only on this branch + PR head ref |
| `maintenance/auditrepo-retire-pr316-ref-20260906` | `99a98481bcd9712cf4230a7bcf2e17f339a6b351` | `9d09c545be58` | 1 | 9 | 1 | 1 unique blob(s) preserved only on this branch + PR head ref |
| `verification/gb-search-ar-idx-09-closure-20260808` | `d73e508e0dd012b1a5f9af636ed7f5aa46a30591` | `118421f927ac` | 2 | 460 | 2 | 2 unique blob(s) preserved only on this branch + PR head ref |

### E — NEEDS MANUAL REVIEW / PROOF INSUFFICIENT  (2 refs)

| Ref | Head SHA | merge-base | ahead | behind | Unique blobs | Basis |
|-----|----------|------------|-------|--------|--------------|-------|
| `archive/forensic-tlp-hall-material-chain-20260809` | `cbc19abd10c322d5811d8d884212f82b4f252833` | `dae54d23f7da` | 2 | 397 | 0 | archive/* but 0 blobs unique to main history (content fully reducible); relaxing archive protection is an owner decision |
| `verification/gb-zero-direct-defects-next-wave-20260808` | `ae25effd426c34d6985cc17b892f70f5aa7906b3` | `9cb6823ba16e` | 2 | 455 | 2 | unclear ownership |


---

## 7. Findings

### F-1 (HIGH) — A former `archive/*` anchor and its 13 preserved diverged tips are reachable from no live ref

The 2026-08-06 result record states the terminal inventory was "intentionally limited to `main`" plus two archive refs, and `references/ref-retirement/requests/2026-08-06-auditrepo-branch-cleanup.json` lists both as `required: true`:

- `archive/forensic-pr-3-vosk-tts-report-2026-07-24`
- `archive/legacy-diverged-heads-20260801`

Neither exists in the live inventory now. For the second one the preservation model was an octopus "archive anchor": `projects/gb-is-my-strength/legacy/branch-forensics/2026-08-01/legacy-diverged-heads-20260801.json` records *"Each source tip is an additional parent of the archive anchor; full commit history remains reachable."*

Verified in this audit:

| Fact | Evidence |
|---|---|
| Anchor commit exists on GitHub | `2589012b0b08e0faccbe8366f8a86a2e952fe493`, subject `archive: anchor legacy diverged histories` |
| Anchor has 14 parents | `fd4d04fb…` + 13 preserved diverged tips |
| Anchor is **not** an ancestor of `main` | `git merge-base --is-ancestor 2589012b… origin/main` → false |
| Anchor is reachable from **no** live ref | tested against all 46 remote-tracking refs; `git branch -r --contains` → empty |
| All 13 preserved tips still retrievable by SHA | each returned `LIVE` from `GET /repos/…/commits/<sha>` |

**Assessment:** the 13 diverged tips survive today only because GitHub has not garbage-collected them. They are not discoverable by ref enumeration and are one GC cycle away from being unrecoverable. The stated preservation invariant ("full commit history remains reachable") is **currently not satisfied**.

For the first archive ref the gap is benign and already documented: `projects/gb-is-my-strength/verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md` records that its tip `07891373c6c9f488842a9a66e6cfde857ca74bce` remains accessible, both introduced paths exist on `main`, and the added REPORT blob is byte-identical to current `main`.

**Recommended (owner decision, not executed here):** re-create a single `archive/legacy-diverged-heads-20260801` ref at `2589012b0b08e0faccbe8366f8a86a2e952fe493`. This was deliberately **not** performed by this agent: creating a remote ref is a change to the ref universe, and the retirement README's fail-closed barrier aborts execution when "an unreviewed remote branch has appeared", so an unreviewed ref creation could block a future retirement run.

### F-2 (MEDIUM) — All 10 `archive/*` refs are exact-SHA duplicates of a still-live working ref

Every `archive/*` ref resolves to the identical commit as a live non-archive ref:

| `archive/*` ref (protected, `required: true`) | Live source ref at the same SHA | Head SHA |
|---|---|---|
| `archive/forensic-arena-019fe0b5-auditrepo-2026-08-13` | `arena/019fe0b5-auditrepo` | `11ab74f3c396…` |
| `archive/forensic-arena-019fe0c4-auditrepo-2026-08-13` | `arena/019fe0c4-auditrepo` | `9239885f8ba8…` |
| `archive/forensic-bugverifikator-audit-2026-07-17-2026-09-06` | `bugverifikator-audit-2026-07-17` | `f3a6b9700e56…` |
| `archive/forensic-engine-contracts-pr323-2026-09-06` | `agent/arena-bugverifier-orphaned-guard-wiring-20260818` | `99b28c3311fc…` |
| `archive/forensic-gb-arena-master-reverify-20260717-2026-09-06` | `agent/arena-master-current-reverify-20260717` | `e1bc115e9570…` |
| `archive/forensic-gb-control-reconciliation-bc786-20260809` | `audit/gb-control-reconciliation-bc786-20260809` | `08692b0eadea…` |
| `archive/forensic-tlp-arena-master-reverify-20260818-2026-09-06` | `agent/tlp-arena-master-reverify-20260818` | `81548c21173c…` |
| `archive/forensic-tlp-hall-001-material-chain-20260809` | `audit/tlp-hall-001-material-chain` | `70cf0c4f3c86…` |
| `archive/forensic-tlp-hall-001-material-chain-current-20260809` | `audit/tlp-hall-001-material-chain-current` | `efb906714a67…` |
| `archive/forensic-tlp-hall-material-chain-20260809` | `audit/tlp-hall-material-chain-20260809` | `cbc19abd10c3…` |

**Assessment:** the archive refs currently add **zero** forensic authority beyond their live twins — they are the same object. Their archival value is realised only once the source ref is retired. This is exactly the state the reviewed requests anticipated: 7 of the 10 source refs carry the recorded reason *"Exact-SHA archive exists; archive-backed source-ref retirement will be handled separately."* This is the substance of Wave R1.

### F-3 (INFO) — Every previously reviewed retirement request is fully executed

All 6 request JSONs under `references/ref-retirement/requests/` were cross-checked against the live inventory: **43** targets total, **0** still live. There is no pending or partially-executed retirement request in flight. The control plane is in a consistent terminal state.

### F-4 (LOW) — Session-branch name collision

The branch this agent's Arena session is pinned to, `arena/01a0770c-auditrepo`, was pushed to by a sibling agent during this audit and now carries commit `ac643979397b` (`audit(tlp): consolidate active matrix and repair closure provenance`) as the head of draft PR #366, which belongs to the TLP SSOT-matrix agent — not to this ref-forensic agent. This report was therefore committed **on top of** that commit (fast-forward, non-destructive) rather than by force-push, so no other agent's work was discarded. Consequence: this report and the TLP matrix audit share one draft PR. The 4 pre-created session placeholders `arena/auditrepo-*-20260906` and `arena/tlp-ssot-matrix-audit-20260906` remain at `main` with zero commits and were classified **A**, not cleanup candidates, because they belong to the live audit.

### F-5 (LOW) — Historical result document is now stale by design

`references/ref-retirement/results/2026-08-06-reviewed-23-ref-retirement.md` still asserts a terminal inventory of `main` + two archive refs, both of which are gone (F-1). Request JSONs are immutable by policy and result documents are historical records, so **no change is recommended**; this is recorded so the drift is not mistaken for an unexplained regression.

---

## 8. Proposed cleanup wave

**Nothing below has been executed. No retirement request JSON was created. Each sub-wave requires a separate explicit owner decision.**

### Wave R0 — executable today with existing engine modes (4 refs)

Proof-complete and supported by the `ancestor` / `superseded` modes the engine already implements.

| Ref | Head SHA | Mode | ahead | Changed-path set vs merge-base | Replacement authority on `main` |
|---|---|---|---|---|---|
| `maintenance/auditrepo-archive-proof-retirement-20260906` | `cb068ad7d0dbee05bae7157aa39c8c90754d6a35` | `ancestor` | 0 | *(none — merge-base == head)* | Pure ancestor of `main`; every commit already reachable |
| `agent/arena-home-resume-dead-20260717` | `2216192058a2c3963ffe9762e23a91bfcb5d3902` | `superseded` | 1 | `projects/gb-is-my-strength/incoming/arena-bugverifier/2026-07-17/REPORT.md` | Blob `e52a7e8694db` is **byte-identical in `main`'s current tree**, landed by `5915b8acb215` *"evidence(gb): preserve PR #326 homepage resume witness"* (a parent of `main` tip) |
| `audit/regression-semantic-wave2a-20260807` | `ee600c3e5dbb9018e7f4f1075e1f1cd16a95c1ac` | `superseded` | 1 | `projects/gb-is-my-strength/verification/2026-08-07-regression-semantic-wave2a/REPORT.md` | Blob `8b10d3795ea8` byte-identical in `main`'s current tree via merged **PR #247** (`be2ffb62b97e`) |
| `audit/tlp-hall-001-material-decision` | `bb296ae2d4613408184e41639a95457a1cda4c76` | `superseded` | 2 | `projects/the-legendary-poet/WORK_QUEUE.md`; `projects/the-legendary-poet/verification/2026-08-09-hall-v3-material-decision/DECISION.md` | Merged **PR #281** (`9850ebe39f21`) — closed PR #280's successor. `DECISION.md` blob `699b0ccd05d8` is in `main`'s current tree; the `WORK_QUEUE.md` revision `1fdb6d80258c` is a superseded intermediate already in `main` history |

All four have **0 blobs unique to `main`'s history**. Deleting them cannot lose any file content.

### Wave R1 — proof complete, blocked on a missing engine mode (10 refs)

Each ref's exact head commit is permanently preserved at an `archive/*` ref marked `required: true` in reviewed requests. This satisfies the retirement README's *"intentionally preserved under `archive/`"* clause.

**Blocker:** the engine refuses to delete `archive/*` refs and has no archive-backed target mode; the reviewed requests themselves state *"archive-backed retirement requires a separately reviewed engine mode."* Implementing that mode is an engine change and is **explicitly out of this agent's scope**.

| Ref | Head SHA | ahead | Preserved at (identical SHA) | Unique blobs held |
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

Three of these (`agent/arena-bugverifier-orphaned-guard-wiring-20260818`, `agent/arena-master-current-reverify-20260717`, `agent/tlp-arena-master-reverify-20260818`) additionally have a closed `superseded` PR (#323, #335, #330), so they carry **two** independent preservation authorities.

### Wave R2 — preservation required first (10 refs, 10 files to preserve)

These closed-PR heads hold blobs that exist **nowhere** on `main`. Retiring them today would make that content reachable only through GitHub's `refs/pull/<n>/head` (which this audit verified is live for #323, #326, #356, #358, #316, and which the repository's own engine already treats as a recoverability signal via `inaccessibleClosedHeads: 0`). The repository's established pattern — PR #354, *"preserved raw reports byte-for-byte"* — is the correct remedy: materialise the evidence into `main` first, then retire.

Of **24** unique files across this wave, only **10** are genuine evidence obligations; **14** are superseded control-plane revisions that policy forbids preserving as competing matrices.

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
| `maintenance/auditrepo-retire-pr316-ref-20260906` | `99a98481bcd9…` | #358 closed | **none** | `references/ref-retirement/requests/2026-09-06-resolved-intake-316.json` — a rejected draft variant; `main` carries the accepted version (`72e9dc7297c8`) plus `-v2` (`3ab2171d2e44`) |
| `verification/gb-search-ar-idx-09-closure-20260808` | `d73e508e0dd0…` | #254 closed | 1 governed: `verification/2026-08-08-search-ar-idx-09-closure/REPORT.md` | `verified/MASTER_BUG_MATRIX.md` |

Two refs (`agent/bugverifikator-master-delta-brand-title-20260717`, `maintenance/auditrepo-retire-pr316-ref-20260906`) have **zero** evidence obligations — their only unique content is superseded control-plane material. They are the cheapest candidates to promote from D to C once the owner accepts that stale matrix/request revisions are not preservation targets under `CLEANUP_RETENTION_POLICY.md`.

### Wave R3 — owner decision required (2 refs)

| Ref | Head SHA | Why it cannot be auto-classified |
|---|---|---|
| `archive/forensic-tlp-hall-material-chain-20260809` | `cbc19abd10c3…` | An `archive/*` ref holding **0** blobs unique to `main` history — i.e. its content *is* safely reducible to `main`, which is precisely the condition under which `CLEANUP_RETENTION_POLICY.md` says such refs need not be retained. But it is `required: true` in reviewed requests and the engine refuses to delete `archive/*`. Relaxing an archive protection is an owner decision, not an auditor decision. |
| `verification/gb-zero-direct-defects-next-wave-20260808` | `ae25effd426c…` | **Unclear ownership.** No PR has ever used this head, no `archive/*` twin exists, and it holds 2 blobs never on `main`. The engine reconciles it only by name heuristics (`diagnostic-transaction-branch`), which is inference, not review. Deletion would lose content with no PR-head fallback. Needs an explicit owner disposition. |

### Deferred — not in any wave

The four empty session placeholders `arena/auditrepo-evidence-integrity-audit-20260906`, `arena/auditrepo-governance-contract-audit-20260906`, `arena/auditrepo-ref-forensic-audit-20260906`, `arena/tlp-ssot-matrix-audit-20260906` sit at `main` with zero commits. They are trivially retireable in `ancestor` mode, but they belong to the live 2026-09-06 five-agent audit and must not be touched until that audit closes. Revisit afterwards.

---

## 9. Recommended sequencing

1. **Now (owner decision):** Wave R0 — 4 refs, 0 evidence at risk, existing engine modes only. Lowest risk, highest confidence.
2. **Now (owner decision, independent of cleanup):** resolve **F-1** by re-anchoring `archive/legacy-diverged-heads-20260801` at `2589012b0b08e0faccbe8366f8a86a2e952fe493`. This *restores* forensic authority and should precede any deletion wave.
3. **Then:** Wave R2 preservation PRs (10 files, following the PR #354 byte-for-byte precedent), after which those refs move to C.
4. **Only after** a separately reviewed archive-backed engine mode exists: Wave R1 — 10 refs.
5. **Owner disposition:** Wave R3 — 2 refs.

---

## 10. Non-execution statement

This agent performed **no** destructive or ref-mutating action:

- no branch deleted, created, repointed or force-pushed;
- no PR opened, closed, merged, labelled or approved;
- no ref-retirement execution request, wrapper or engine change authored;
- no `archive/*` ref touched;
- no MASTER matrix, WORK_QUEUE, closure ledger or disposition ledger modified;
- no raw evidence rewritten or removed.

The only repository mutation produced by this agent is the addition of this single report file, at a uniquely owned path. The repository's own `--strict` history-forensic gate was re-run after the report's data collection and returned `unexplainedRemoteBranches: 0`, `inaccessibleClosedHeads: 0`, `manualReviewCandidates: 0`.

---

## 11. Reproduction

```bash
# 0. Never trust topology before asserting a full clone
git rev-parse --is-shallow-repository          # must be false
git fetch --unshallow origin                    # if true

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

# 4. Ancestry / divergence proof for a candidate
git merge-base origin/main <ref>
git rev-list --left-right --count origin/main...<ref>
git diff --name-only $(git merge-base origin/main <ref>) <ref>
```
