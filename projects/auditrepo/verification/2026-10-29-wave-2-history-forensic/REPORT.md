# Wave 2 — fail-closed repository history forensic

**Anchor before repair:** `main@eca8b551ab9cfa62720ab91c462beb577663f156`  
**Tested branch head:** to be bound by the wave commit  
**Result:** `AR-HISTORY-STRICT-001` closed

## Root cause

Closed-unmerged PR prose was classified by regex as `superseded`/`diagnostic`. The same unreviewed classification set `reviewPriority=0`, could explain a live branch and let `--strict` pass. Thus recoverability was checked, but durable human disposition was optional.

## Repair

- Every closed-unmerged PR without a permanent ledger entry now receives review priority, regardless of prose classification.
- Strict summary now requires `unledgeredClosedUnmergedPrs=0`.
- Branch reconciliation uses a closed PR category only when that PR has a ledger disposition.
- An `archiveRef` disposition now proves exact SHA equality with the PR head, not only ref existence.
- Regression covers the critical counterexample: heuristic `superseded` + accessible head + references still remains a manual candidate without a ledger entry.

## Reconciliation

The 25 gaps were reviewed against current PR files, closure comments, referenced merged PRs, current path state and exact heads:

- 24 classified `superseded`;
- 1 classified `diagnostic` (#326, later repaired in Product);
- #330 and #335 are preserved by named `archive/*` refs at exact PR-head SHA;
- missing transaction wrapper #213 is replaced by merged #214;
- missing evidence paths in #329 and #462 are covered by named merged successors;
- no head is inaccessible.

Permanent ledger coverage is now **69/69**. The ledger is current-state validated: every replacement PR is merged, landed commit is reachable from `origin/main`, and named archive ref exists at the exact closed PR head.

## Verification

- history forensic regression: PASS;
- production forensic via `gh api` transport: **480 PR, 69 closed-unmerged, 0 unledgered, 0 inaccessible heads, 0 manual candidates, 0 unexplained refs**;
- strict run: PASS after this branch became open PR #502;
- no remote ref was deleted and no historical PR was merged/reopened.

Node direct `fetch` remains unavailable in this sandbox; transport substitution changes only HTTP delivery, not production audit logic.
