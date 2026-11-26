# Closure Ledger — Milovi Cake

## 2026-09-12 — suburb sitemap freshness authority

- Scope: all generated suburb landing pages and sitemap freshness metadata.
- Signal class: Product + release/discovery contract.
- Exact anchor: Product `main@b65c5329e1c8a7bedf366697074db98e277fee42`.
- Result: closed.
- Source-repo evidence: authoritative per-suburb `lastmod` moved into `prigorody/_cities.csv`; fail-closed sync/check added to QA.
- Regression witness: GitHub CI green before merge.
- Live evidence: exact Pages release SHA verified; all 14 live suburb timestamps checked; IndexNow/Bing/Yandex submission succeeded.
- Detailed evidence: `../verification/2026-09-12-seo-analytics-baseline/REPORT.md`.

## 2026-11-21 — Current-HEAD reconciliation (`main@8c67865d`)

- Scope: `MC-WEBKIT-RESILIENCE-001` (closed), `MC-LIGHTHOUSE-TBT-DIVERGENCE-001` (superseded/narrowed into `MC-MOBILE-PERF-BUDGET-001` for `Milovi_Cake#100`), and `Milovi_Cake#82` (closed Product tracking item).
- Signal class: Product + release/runtime/CI reconciliation.
- Exact anchor: Product `main@8c67865d37e79f2772558f90c231f3aa2d604fc5` (PR #182, head `ccb2972f40b238f772558f90c231f3aa2d604fc5`, merged `2026-11-21T12:04:28Z`).
- Results:
  - `MC-WEBKIT-RESILIENCE-001`: **closed (`fixed-current`)** and retired from MASTER. Former owner PR #107 (`9d623c0d`) merged `2026-10-30`; PR #181 (`174524cc`) eliminated the test-harness WebKit overload in `cart-accessibility` and `gallery-lightbox`; on PR #182 (`ccb2972f`, [run 44895761496](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44895761496)) all 4 WebKit jobs and 2 Firefox jobs completed `success` (the `if: failure() || cancelled()` diagnostic job `WebKit native process investigation` skipped).
  - `MC-LIGHTHOUSE-TBT-DIVERGENCE-001`: **aliased/narrowed to `MC-MOBILE-PERF-BUDGET-001` (`Milovi_Cake#100`)**. CI `Lighthouse` ([run 44904067510](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44904067510)) and `Lighthouse artifact` ([run 44904067569](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44904067569)) both passed `success` on `8c67865d`, while non-blocking live LCP warnings (`/` `3157.17 ms`, `/meringue-roll/` `2868.61 ms`) and `/` artifact max TBT (`1574 ms`) remain under `#100` per explicit owner policy against closing on green CI alone.
  - `Milovi_Cake#82`: closed `completed` by `FedorMilovanov` on `2026-11-05T16:06:43Z`; removed from `../WORK_QUEUE.md`.
- Detailed evidence: `../reverify/CURRENT_HEAD_REVERIFY_2026-11-21_8c67865.md`.
