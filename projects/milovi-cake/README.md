# Milovi Cake

- Source repo: `FedorMilovanov/Milovi_Cake`
- Production URL: https://milovicake.ru
- Main branch: `main`
- AuditRepo status: `active / 1 narrowed residual (Milovi_Cake#100)`

Current Product/CI/deploy truth remains in the source repository. AuditRepo records exact-anchor evidence and current necessary work; it does not mirror every Product commit.

## Current audit position

Reconciled against `FedorMilovanov/Milovi_Cake@8c67865d37e79f2772558f90c231f3aa2d604fc5` (PR `#182`, `2026-11-21`):

- `MC-WEBKIT-RESILIENCE-001` is **closed** (PR `#107` merged; PR `#181` eliminated WebKit harness overload; PR `#182` passed all 4 WebKit and 2 Firefox jobs).
- `MC-LIGHTHOUSE-TBT-DIVERGENCE-001` is reconciled into `MC-MOBILE-PERF-BUDGET-001` (`Milovi_Cake#100`): CI `Lighthouse` and `Lighthouse artifact` now pass (`8` consecutive `success` runs), while non-blocking live LCP warnings (`/` and `/meringue-roll/`) and `/` artifact max TBT tails keep `#100` open under owner policy.
- `Milovi_Cake#82` closed `completed` (`2026-11-05`). Wait-for-signal/GSC items `Milovi_Cake#84` and `Milovi_Cake#145` are parked in `WORK_QUEUE.md`.

## Navigation

- `DOC_MAP.md` — fact ownership and placement rules.
- `verified/MASTER_BUG_MATRIX.md` — sole active current-work matrix.
- `verified/CLOSURE_LEDGER.md` — closed/superseded audit dispositions.
- `WORK_QUEUE.md` — non-defect follow-ups and measurement-first work.
- `reverify/CURRENT_HEAD_REVERIFY_2026-11-21_8c67865.md` — latest current-HEAD verification (`8c67865d`).
- `reverify/REVERIFY_76675a2_2026-10-29_current-owners.md` — prior `76675a2` verification record.
- `verification/2026-09-12-seo-analytics-baseline/REPORT.md` — 2026-09-12 SEO/analytics baseline evidence.
