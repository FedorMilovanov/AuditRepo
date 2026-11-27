# MASTER BUG MATRIX — Milovi Cake

> SSOT for current verified necessary work only.

## Current state

| Field | Value |
|---|---:|
| Active work units | **1** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **1** |
| System verification lanes | **0** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 0

| ID | Current problem | Boundary |
|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 1

| ID | Current residual | Next boundary | Evidence |
|---|---|---|---|
| `MC-MOBILE-PERF-BUDGET-001` | Owner issue `Milovi_Cake#100` remains open: CI `Lighthouse` and `Lighthouse artifact` pass on `main@8c67865d`, but non-blocking warnings remain for `largest-contentful-paint > 2500 ms` on `/` (`3157.17 ms`) and `/meringue-roll/` (`2868.61 ms`), `/` artifact `n=3` hits `LCP 2327/2520 ms` and max `TBT 1574 ms` (median `72 ms`), and field CrUX p75 is unproven. | Trace and reduce cold mobile main-thread Layout/hero paint delay on `/` and `/meringue-roll/` until `LCP <= 2500 ms` and `TBT <= 300 ms` pass across runs without threshold relaxation, `content-visibility:auto`, or protected UI/SEO regressions. | [`reverify 8c67865`](../reverify/CURRENT_HEAD_REVERIFY_2026-11-21_8c67865.md) |

## SYSTEM VERIFICATION LANES — 0

| ID | Verified work package | Next boundary |
|---|---|---|

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|

## Current disposition

The 2026-09-12 suburb sitemap-freshness root and `MC-WEBKIT-RESILIENCE-001` (closed across PRs `#107`, `#181`, and `#182` at `main@8c67865d37e79f2772558f90c231f3aa2d604fc5`) remain closed and absent from MASTER.

`MC-LIGHTHOUSE-TBT-DIVERGENCE-001` is reconciled into `MC-MOBILE-PERF-BUDGET-001` (`Milovi_Cake#100`): CI `Lighthouse` workflows are green, while strict owner mobile LCP/TBT budgets remain unproven in cold runs and field CrUX.

Product issue `#82` closed `completed` on `2026-11-05`. Measurement/GSC wait-for-signal items `#84` and `#145` remain in `../WORK_QUEUE.md`, not MASTER defects.

## Terminal rule

Admit a row only after exact-current evidence proves mandatory work. Solved work leaves this matrix in the same closure wave.
