# Proposal

## Identity
- Project: gb-is-my-strength
- Proposed by: arena-agent-pass90
- Date: 2026-07-05
- Target finding ID(s): P1-DEPLOY-FAIL
- Proposal type: status-change

## Current state
`P1-DEPLOY-FAIL` is listed in `verified/MASTER_BUG_MATRIX.md` as fixed-current via commit `29b49df`.

## Proposed change
Reopen `P1-DEPLOY-FAIL` on current HEAD `8c318010`.

## Evidence
```text
Current deploy.yml:
  github.event.workflow_run.conclusion == 'success' ||
  github.event.workflow_run.conclusion == 'failure'

Historical fix (29b49df):
  github.event.workflow_run.conclusion == 'success'

workflows:check on current HEAD: PASS
```
Full proof: `evidence/01-deploy-gate-regression.txt`, `evidence/02-workflows-check-pass.txt`.

## Why this matters
The original defect category is back: production deploy is no longer strictly blocked by a failed metadata/gate workflow, while local policy tooling still reports green. This is a current-head semantic regression, not a historical note.

## Proposal status: proposal-open
