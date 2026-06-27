# PremiumControls — current-head truth pointer (2026-06-27)

Use this file before reading older PremiumControls reports.

**Current operational source HEAD inspected:** `gb-is-my-strength origin/main@51dbd0e5`.

Primary current-head reconciliation:

- `reports/PREMIUMCONTROLS_META_RECONCILIATION_AND_OPEN_HOLES_2026-06-27.md`

Important rule:

Older files in this folder are often **baseline-scoped**, not current-truth-scoped. In particular:

- `README.md` still contains PR #19-era open/closed wording.
- `ROADMAP.md` mixes old checklist text with current-head notes.
- `SURGICAL_REPLAY_CURRENT_MAIN_2026-06-27.md` describes pushed lane `6c9b3d06`, which is not an ancestor of current main.
- `reports/PREMIUMCONTROLS_CURRENT_HEAD_SURGICAL_AUDIT_2026-06-27.md` describes an earlier source branch before `origin/main` advanced to `51dbd0e5`.
- `reports/HANDOFF_PLAYBOOK_2026-06-27.md` contains Gill split-world notes that are stale after current Gill v16 convergence.

Current main has many major fixes landed, but still needs audit/control-plane hardening:

1. Integrate `audit:premium-controls` into production-like barriers or deploy workflow.
2. Guard/remove retired `body.fc-single-active` / `body.fc-series-active` CSS.
3. Guard PremiumControls cache-bust/helper drift.
4. Add current-head Playwright visibility witness for Nagornaya/Baptisty/Gill/Hermeneutics.
5. Reconcile docs without deleting historical reports.

Do not raw-merge old remote branches. Extract patches only after checking against current `origin/main`.
