# Owner Start Here — gb-is-my-strength AuditRepo

AuditRepo is the evidence and verification workspace for `gb-is-my-strength`.

## One active matrix

[`MASTER_BUG_MATRIX.md`](./MASTER_BUG_MATRIX.md) is the **single active work matrix**. Despite the historical filename, it is not limited to bugs. It contains only verified work that still needs action:

- current defects;
- genuinely necessary implementations or improvements;
- system/root-cause work;
- narrowed residuals;
- owner decisions that block real work.

MASTER is a working notebook, not project history. Solved, stale, duplicate, absorbed, invalid or abandoned rows are removed in the same closure/consolidation wave.

## Evidence flow

```text
raw audit evidence
→ verification / re-verification
→ enough independent witnesses for the risk
→ compact current work in MASTER
→ implementation / owner decision
→ result verification
→ remove from MASTER
→ legacy when useful
```

Evidence lives in `incoming/`, `verification/` and `reverify/`. High-risk security, rights, release or data-loss conclusions should use multiple independent evidence angles. Ordinary local work may need only one strong current witness plus a clear mechanism.

## Necessary improvements are valid work

A MASTER row does not need to describe something visibly broken. A verified implementation/improvement belongs there when evidence shows it is genuinely needed to remove a current risk, complete a required capability, finish a migration, improve a system owner, or satisfy a real product requirement. Speculative refactors and taste-only polish do not.

## Optional work

[`../WORK_QUEUE.md`](../WORK_QUEUE.md) is for useful measurement-first performance work, refactors and polish that are not yet mandatory verified work. It is not a second bug matrix.

## System themes

[`SYSTEM_THEMES.md`](./SYSTEM_THEMES.md) is causal context. A theme becomes active work only after a current verification wave selects it. When many symptoms share one root, MASTER should contain one `SYS-*` work unit rather than dozens of symptom rows.

## Legacy

`../legacy/` is the retirement/reference area. Finished, stale, duplicate and superseded material may be preserved there so a future regression or dispute can be investigated. Legacy is never an active backlog: anything taken from it must first be re-verified against current Product.

## Continuous cleanup

The matrix is cleaned continuously. Solve → verify → remove. If 30 historical claims reduce to one current root, MASTER keeps one root. Git and evidence retain the old detail; MASTER stays small enough to drive actual work.

Before any Product edit, inspect current Product HEAD, open PRs/branches and owner surfaces so a new lane does not collide with work already in flight.

Canonical rules: [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md).