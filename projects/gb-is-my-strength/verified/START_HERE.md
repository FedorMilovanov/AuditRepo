# START_HERE — gb-is-my-strength current truth

> Canonical, human-readable entrypoint for the verified layer. Per
> `CLEANUP_RETENTION_POLICY.md` §3.3, this file names the single canonical ledger
> so multiple matrix copies do not pretend to be current truth.

## Canonical documents (current)
- **`verified/MASTER_BUG_MATRIX.md`** — the one authoritative bug matrix. The
  "GILL pre-v16 submenu + rounded full-frame (2026-07-05)" appendix there tracks
  the latest Gill forensic repair honestly (no false-green claims).
- **`NEXT_AGENT_PROMPT.md`** (project root) — current handoff for the next agent.
- **`PremiumControls/README.md`** — PremiumControls current contract.

## Historical / archive (NOT current truth)
- `archive/2026-07-04-stale-matrix/MASTER_BUG_MATRIX_FULL_2026-07-03.md`
- `archive/2026-07-03-stale-working/…`
- `archive/2026-06-27-*/…`
These are snapshots of earlier waves. Do not treat them as current; the
canonical status lives only in `verified/MASTER_BUG_MATRIX.md`.

## Quick rules (enforced by `scripts/validate_audit_repo.py` + `scripts/check-workflows.js`)
- Every intake needs a commit SHA (SHA-first) — templates without a SHA fail validation.
- `confirmed-current` threshold follows `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`
  (3 witnesses, or strong production-like-dist browser repro, or 2 agents / 1 direct
  evidence with explicit witness-angle label). README and MULTI_WITNESS are now aligned.
- Two distinct submenu items must never share one target; the Gill submenu audit
  rejects duplicate hrefs/labels.
- `deploy.yml` must stay blocked when IndexNow fails (no `== 'failure'` clause).
