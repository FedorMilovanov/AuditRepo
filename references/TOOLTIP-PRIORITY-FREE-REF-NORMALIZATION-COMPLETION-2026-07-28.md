# Tooltip priority-free ref normalization completion — 2026-07-28

## Authority

This record executes the ref disposition in:

- `references/TOOLTIP-PRIORITY-FREE-INTENT-DISPOSITION-2026-07-28.md`.

## Preserved historical state

Before mutation, the exact incomplete intent head was preserved at:

- `archive/forensic-tooltip-priority-free-intent-20260725`;
- head `82e96a03276f6c3996174b7bf338861012842946`.

The underlying PR #280 state remains independently preserved at:

- `archive/forensic-print-decoration-pagination-pr280-20260725`;
- head `ccbdb6959cc32d8b9f650b02793222b6e99d8c2b`.

## Final recheck

Immediately before ref movement:

- `fix/print-decoration-pagination-2026-07-25` still resolved exactly to `82e96a03276f6c3996174b7bf338861012842946`;
- current site `main` still resolved to `b40044713b9fa09e404d5f57b2016d31f4cc88c6`.

## Operation

The working ref:

- `fix/print-decoration-pagination-2026-07-25`

was force-moved to:

- `b40044713b9fa09e404d5f57b2016d31f4cc88c6`.

Result: **success**.

## Boundaries

- branch deletions: **0**;
- product commits created: **0**;
- CSS changes: **0**;
- glossary runtime changes: **0**;
- publication/deploy changes: **0**.

The two historical commits were not transferred because the branch was an internally inconsistent autofix intent: it changed the normalizer contract without materializing `css/site.css`, carried no exact-head Actions proof and added no browser evidence for the changed priority model.

Any future reduction of tooltip priority flags requires a new bounded product lane with complete source materialization and real pointer-hit/browser verification; it must not recover these historical commits by branch name alone.