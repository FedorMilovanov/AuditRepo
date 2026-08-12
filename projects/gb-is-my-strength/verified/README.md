# Verified — gb-is-my-strength

`verified/` contains durable classifications and active guidance. It is not a mirror of every current Product commit.

## Current set

- [`MASTER_BUG_MATRIX.md`](./MASTER_BUG_MATRIX.md) — sole compact registry of current verified necessary work. It may be empty and contains no closed rows.
- [`SYSTEM_THEMES.md`](./SYSTEM_THEMES.md) — recurring root-cause classes and system questions.
- [`CLOSURE_LEDGER.md`](./CLOSURE_LEDGER.md) — compact append-only results of new waves and meaningful closures.
- [`START_HERE.md`](./START_HERE.md) — owner-facing explanation of how to use this layer.
- `SUPER_AUDIT_2026-07-06_14a49be8.md` — rich historical system diagnosis on its recorded anchor; source of hypotheses, not automatically current truth.

Other verified documents may remain as specifications or evidence. Their anchor and role must be explicit.

---

## What belongs here

- active local findings;
- verified-at-anchor classifications;
- systemic root themes;
- owner decisions;
- parked/accepted-risk dispositions;
- compact closure summaries;
- stable specifications that still have a named purpose.

## What does not belong here

- raw observations;
- per-session scratch notes;
- copied current Product HEAD/deploy facts;
- a new “current truth” document after every merge;
- verbose repetition of workflow runs already preserved in Product PRs;
- temporary control-plane instructions.

---

## Admission and closure rule

Future waves should:

1. classify the signal as Product, harness, control-plane, environment or historical;
2. name the exact anchor, proof state, claim boundary, preservation boundary and semantic owner;
3. admit only current defects, verified necessary improvements, narrowed residuals, system verification lanes or owner decisions;
4. remove solved, stale, duplicate, absorbed and superseded rows in the same closure transaction;
5. preserve history in `CLOSURE_LEDGER.md`, verification/evidence, `legacy/` when needed, and Git history.

The goal is a short active backlog and a rich historical corpus, not a permanently synchronized second Product repository. A Product commit, CI signal or agent suggestion alone does not require an AuditRepo update.
