# Branch cleanup summary — 2026-08-01

## Archive authority

- Archive branch: `archive/legacy-diverged-heads-20260801`
- Current archive anchor before this summary: `765dfa5cec27de3667406ee81feefa9037966488`
- Full legacy histories were preserved as additional parents before their original refs were deleted.
- Exact merged PR heads were deleted only after matching branch name, tip SHA, merged PR head SHA and absence of an open PR.
- Contained refs were deleted only after ancestry verification against exact `main`.

## Preserved active or recent refs

- `agent/bug-hunt-current-head-reverify-20260801` — exact merged PR #111, retained temporarily because younger than 24 hours at forensic capture.
- `agent/gb-current-head-production-sync-20260731` — exact merged PR #108, retained temporarily because younger than 24 hours at forensic capture.
- `agent/gb-exact-production-sync-abf1edba-20260801` — exact merged PR #110, retained temporarily because younger than 24 hours at forensic capture.
- `arena/019fb9c9-auditrepo` — recent arena ref, retained for safety-window review.
- `arena/019fbded-auditrepo` — active current assessment, 3 commits ahead of main at capture; adds the 2026-08-01 arena sync assessment and proposals.

## Permanent refs after temporary forensic cleanup

- `main`
- `archive/legacy-diverged-heads-20260801`
- the five active/recent refs listed above

## Temporary refs scheduled for deletion

- `audit/full-branch-disposition-20260801`
- `audit/full-branch-details-20260801`

These temporary refs contain only the forensic workflows, generated reports, branch cards and deletion receipts used during this cleanup. Their durable conclusions and recovery provenance are represented by the ledgers on this archive branch and GitHub PR history.
