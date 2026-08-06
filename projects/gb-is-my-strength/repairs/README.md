# Repairs — gb-is-my-strength

`repairs/` may hold implementation plans or repair summaries when they are useful beyond the Product PR itself.

Example:

```text
repairs/
  2026-08-06/
    <lane-name>/
      PLAN.md
      PATCH_SUMMARY.md
      VERIFICATION.md
```

Rules:

- implementation code lives in the Product repository, not here;
- raw audit evidence remains in `incoming/`;
- a repair begins only after the selected current surface is checked;
- the agent should decide local vs systemic scope before mutation;
- live evidence is required only when the closure claim is live/production;
- one permanent Product regression witness is preferable to repeated AuditRepo exact-head proofs;
- after merge, update AuditRepo in the smallest honest form: active disposition, system theme and/or compact closure-ledger entry;
- a separate reverify document is optional and reserved for significant decisions.

A repair plan may conclude `parked`, `accepted-risk`, `not-worth-fixing` or `owner-decision` without Product mutation.
