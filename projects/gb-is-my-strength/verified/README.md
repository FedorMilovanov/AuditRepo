# Verified

This folder should contain only **current canonical operational truth** and current repair-order truth.

## Primary current files

- `MASTER_BUG_MATRIX.md` — **the single canonical source of truth.** Consolidated on 2026-07-03 with HEAD `932af3f3`, updated for Pass 44 (SiteUtils fix) and HEAD `01ff5ce3`.

## Historical / superseded files

These are retained for evidence but not active truth:

- `CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` — **SUPERSEDED** (has banner). Historical index only.
- `REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` — **SUPERSEDED** (HEAD `6664056`, very stale). See MASTER_BUG_MATRIX.md for current priorities.
- `DEFINITIVE_PREMIUMCONTROLS_FINAL_HANDOFF_2026-06-27.md` — Historical. Current PremiumControls truth: MASTER_BUG_MATRIX.md + audit:premium-controls 87/87.
- `PLAYEMBER_INTERACTION_SPEC_2026-06-27.md` — Active spec, check against current source.

## Rule
If a document is primarily historical, append-only, or superseded by current-head truth, it should not live in this folder root.
