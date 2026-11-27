# Current Head Reverify — Milovi Cake (`8c67865`)

## Project
- Project: `milovi-cake`
- Source repo: `FedorMilovanov/Milovi_Cake`
- Current HEAD SHA: `8c67865d37e79f2772558f90c231f3aa2d604fc5`
- Audited anchor: `FedorMilovanov/Milovi_Cake@8c67865d37e79f2772558f90c231f3aa2d604fc5` (merge commit of [PR #182](https://github.com/FedorMilovanov/Milovi_Cake/pull/182), head `ccb2972f40b238f772558f90c231f3aa2d604fc5`, merged `2026-11-21T12:04:28Z`)
- Current tree/event when relevant: `main` after PR #107 (`9d623c0d8983b7a895aec492e7986aeec059ebc9`), PR #180 (`08df56280a5bdf934b4ee10b05519084b5bb0ab`), PR #181 (`174524cc9eb7c230985310234ddf85dbaf9e7edf`), and PR #182 (`8c67865d37e79f2772558f90c231f3aa2d604fc5`); open PRs on `Milovi_Cake` are only #153 (Dependabot) and #159 (draft `docs(agents): Arena Chromium browser fallback`)
- Date: `2026-11-21`
- Verifier: Arena Agent (`AuditRepo` reconciliation against GitHub source/CI API)
- Signal class: `Product + release/runtime/CI`
- Semantic owner and overlap check: Product `main` & issues `#82` (closed), `#84` (open), `#100` (open), `#145` (open); no AuditRepo duplicate or parallel PR lane

## Compared against
- verified ledger: `../verified/MASTER_BUG_MATRIX.md`, `../verified/CLOSURE_LEDGER.md`, `../verified/SYSTEM_THEMES.md`
- repair order: `../WORK_QUEUE.md`
- incoming reports reviewed: `REVERIFY_76675a2_2026-10-29_current-owners.md`, `../verification/2026-09-12-seo-analytics-baseline/REPORT.md`

## Status changes

| Work ID | Previous status | Proof state | Current status | W1–W6 evidence used | Claim boundary |
|---|---|---|---|---|---|
| `MC-WEBKIT-RESILIENCE-001` | `verified-at-anchor` (`76675a2` / PR #107 open) | `PASS` (fixed) | `fixed-current` (closed & retired from MASTER) | W2 + W4 + W6: PR #107 merged `2026-10-30`; PR #181 (`174524cc`) eliminated test-harness WebKit overload (`cart-accessibility`, `gallery-lightbox`); on PR #182 head `ccb2972f` [run 44895761496](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44895761496) all 4 WebKit jobs + 2 Firefox jobs passed `success` (`WebKit native process investigation` skipped via `if: failure() || cancelled()`) | Proves WebKit/Firefox compatibility suite green at `ccb2972f` -> `8c67865d` without retries or weakened contracts |
| `MC-LIGHTHOUSE-TBT-DIVERGENCE-001` -> `MC-MOBILE-PERF-BUDGET-001` | `verified-at-anchor` (repeated CI Lighthouse failures at `76675a2`) | `FAIL` (narrowed residual on live/artifact LCP & TBT tails; CI workflow itself `PASS`) | `still-confirmed` (narrowed residual renamed to `MC-MOBILE-PERF-BUDGET-001`, owner `Milovi_Cake#100`) | W1 + W3 + W6: CI `Lighthouse` ([run 44904067510](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44904067510)) and `Lighthouse artifact` ([run 44904067569](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44904067569)) on `8c67865d` both completed `success` (8 consecutive `success` runs on `main`, `bento-torty` now `1815/2021 ms` LCP & `0/19 ms` TBT), **but** live warnings remain on `/` (`LCP 3157.17 ms > 2500 ms`) and `/meringue-roll/` (`LCP 2868.61 ms > 2500 ms`), and artifact `/` (`n=3`) still hits `LCP 2327/2520 ms` and `TBT 72/1574 ms`; owner in `Milovi_Cake#100` explicitly forbids closing on green CI without proven `mobile LCP <= 2500 ms` / `TBT <= 300 ms` | Sandbox has no outbound access to `milovicake.ru`; findings rest strictly on GitHub Actions CI/annotation artifacts for `8c67865d` and Product `#100` owner records; field CrUX p75 remains unproven |

## Exact-head CI and release witness (`8c67865d37e79f2772558f90c231f3aa2d604fc5`)

- `Deploy to GitHub Pages` ([run 44902091395](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44902091395)): **`success`** (`guard`, `Validate and build exact Pages candidate` — 811 passed, 62 skipped, 1 retry-passed flaky notice in `tests/landing-smoke.spec.js:2053`, `Deploy exact candidate`, `Prove live release, smoke production, notify IndexNow`).
- `Repository hygiene` ([run 44902091427](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44902091427)): **`success`**.
- `Lighthouse` ([run 44904067510](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44904067510)): **`success`**, with two non-blocking `warning` annotations:
  - `https://milovicake.ru/` — `largest-contentful-paint`: expected `<= 2500`, found `3157.169`
  - `https://milovicake.ru/meringue-roll/` — `largest-contentful-paint`: expected `<= 2500`, found `2868.606`
- `Lighthouse artifact` ([run 44904067569](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44904067569)): **`success`** (`n=3` per route):
  - `/` LCP `2327/2520 ms`, TBT `72/1574 ms`
  - `/prigorody/gatchina/` LCP `2328/2329 ms`, TBT `44/46 ms`
  - `/svadebnye-torty/` LCP `2026/2032 ms`, TBT `8/20 ms`
  - `/bento-torty/` LCP `1815/2021 ms`, TBT `0/19 ms`
  - `/gallery/` LCP `1865/1867 ms`, TBT `9/50 ms`
  - `/o-konditere/` LCP `1989/1991 ms`, TBT `0/0 ms`
  - `/zakazat-tort-spb/` LCP `1820/1821 ms`, TBT `0/0 ms`
  - `/privacy/` LCP `1053/1073 ms`, TBT `0/0 ms`
- `Production Smoke` ([run 44916202283](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44916202283)): **`success`**.
- `Browser compatibility` on PR #182 head `ccb2972f` ([run 44895761496](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44895761496)) and PR #181 head `0e28f854` ([run 44834154386](https://github.com/FedorMilovanov/Milovi_Cake/actions/runs/44834154386)): **`success`** across all 4 WebKit jobs and 2 Firefox jobs.

## Product issue & queue reconciliation

- `Milovi_Cake#82` (`analytics: mark generate_lead as a GA4 key event`): **closed (`completed`) on `2026-11-05T16:06:43Z`** by `FedorMilovanov`. Removed from active `WORK_QUEUE.md`.
- `Milovi_Cake#84` (`seo: re-evaluate wedding landing after search settles`): **remains open** in `WORK_QUEUE.md` (settled-data window checkpoint `2026-11-12`; PR #139 prepaint theme bootstrap did not reset the window).
- `Milovi_Cake#100` (`perf: mobile LCP <= 2500ms / TBT <= 300ms`): **remains open**; tracked in `MASTER_BUG_MATRIX.md` as `MC-MOBILE-PERF-BUDGET-001` (preservation boundary: keep `tests` / protected hero / UI contracts intact, no threshold weakening or `content-visibility:auto`).
- `Milovi_Cake#145` (`seo(schema): reconcile GSC Product warnings without inventing stock, offers or ratings`, opened `2026-11-06`): **open** diagnostic/GSC-verification item; parked in `WORK_QUEUE.md` rather than `MASTER_BUG_MATRIX.md` because `tests/test_schema_contract.py` intentionally guards honest markup and closure requires live GSC Product snippets / Merchant listings inspection first.

## Buckets
- still-confirmed: `MC-MOBILE-PERF-BUDGET-001` (`Milovi_Cake#100` — narrowed from `MC-LIGHTHOUSE-TBT-DIVERGENCE-001` because CI Lighthouse is now green while live/artifact LCP and `/` TBT tail remain above strict owner budgets)
- fixed-current: `MC-WEBKIT-RESILIENCE-001` (closed by PR #107, #181, #182; `Browser compatibility` green on `ccb2972f` -> `8c67865d`), `Milovi_Cake#82` (closed `completed` `2026-11-05`)
- stale-on-current-head: `MC-LIGHTHOUSE-TBT-DIVERGENCE-001` framing (repeated CI Lighthouse failures and `bento-torty` TBT divergence are obsolete at `8c67865d`; replaced by canonical `MC-MOBILE-PERF-BUDGET-001`)
- regression: none
- needs-manual-check: `Milovi_Cake#84` (GSC settled data), `Milovi_Cake#145` (live GSC Product snippets / Merchant listings reports without inventing stock or ratings), CrUX field p75 for `#100`
