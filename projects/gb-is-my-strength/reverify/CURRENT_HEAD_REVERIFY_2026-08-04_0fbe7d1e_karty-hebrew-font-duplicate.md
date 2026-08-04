# CURRENT HEAD REVERIFY — Karty Hebrew font and direction residual

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `QUAL-P1-02`, `FONT-P1-01`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `446f36f48a27b02fb27e185c8f087446c811a609`
- AuditRepo consolidation lane: PR #141
- Current production claim: **none**

## Original claims

- `QUAL-P1-02`: dynamic Hebrew content lacks an explicit `Noto Serif Hebrew` family and `dir="rtl"`.
- `FONT-P1-01`: `.hw` uses Georgia/Times instead of `Noto Serif Hebrew`, causing Hebrew fallback.

The second row is the font-family subset of the first row, not a separate repairable root cause.

## Current-head witness

At Product `0fbe7d1ead9ebd1bea867418e254da438ec63329`:

- `karty/_engine/map-engine.js` still styles `.me-content .hw` with `font-family: Georgia,"Times New Roman",serif`;
- the same engine contains no `dir="rtl"` contract for the dynamic Hebrew panel content;
- `he_deep` remains the dynamic source selected for the Hebrew tab;
- therefore the combined font-and-direction defect remains current;
- retaining both canonical rows as independently open would double-count the font half of one residual.

## Disposition

### `QUAL-P1-02` — confirmed-current / canonical owner

Retain this P1 row as the single owner for the two-part residual: apply an explicit Hebrew-capable font stack to dynamic Hebrew tokens and establish the correct RTL direction/semantic boundary in rendered Hebrew content.

### `FONT-P1-01` — duplicate / merged into `QUAL-P1-02`

Close this row as the exact font-family subset of the retained canonical owner. No Product mutation is performed by this verifier-only transaction.

## Evidence boundary

This transaction does not claim the Hebrew rendering defect is fixed, choose the final font-loading strategy, alter translated Russian text, or establish deployment of current Product `main`. The retained P1 row still requires a bounded Product implementation and runtime semantics check.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **198 → 199**
- Open: **160 → 159**
- P1: **73 → 72**
- P2: 33
- P0: 0
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 199 + 159`.
