# Reverify — source `main@e06bdfc`

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Source branch: `main`
- Source SHA: `e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8`
- Final source PR: `#308`
- Final tested head: `efb097c158f2015c7312ed35492caee2f72f281d`
- Date: `2026-08-05`
- Result: `current and closed for W0, discovery/Safari and W1`

## Proof chain

1. Parallel system-contract PR `#303` passed exact-head Project contracts, CI, catalog, route, brand and Manual Browser QA 4/4, then produced source `main@69e5d3931bc1d1af635efeaf98c76cf36ce30f41`.
2. Discovery repair PR `#304` was closed unmerged when production moved.
3. Fresh-base PR `#305` added committed sitemap/feed freshness validation and exposed a Safari route-loading race in the brand-source audit.
4. The race was repaired by waiting for the official route-loading shell to disappear and requiring real raster placements; no sleep or retry bypass was added.
5. PR `#305` passed its complete exact-head matrix and produced source `main@44a36bdb97e22827b2026e5622b79a6908d7af03`.
6. Parallel agent PR `#306` supplied a clean zero-loss Article-retirement commit but was based before `#305`.
7. The agent branch was not rewritten. Its durable head was exact-SHA applied to a separate integration branch through PR `#307`.
8. The combined branch added repository-wide content-model gating and Node 24 targeted execution.
9. Production PR `#308` passed the full exact-head matrix on `efb097c158f2015c7312ed35492caee2f72f281d`.
10. Expected-head squash merge produced source `main@e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8`.
11. Post-merge `main/package.json` was re-read and contains both `validate:discovery-artifacts` and `validate:content-model` in `check:content`.
12. Post-merge `src/types/poet.ts` was re-read and contains no `Article` interface or `Poet.articles` field.
13. The original agent PR was closed as superseded; its subsequently reconstructed branch contains no unique unintegrated production repair.

## Final source workflow matrix

- Content model contract `30998000018` — success
- Project contracts `30997999990` — success
- CI `30998000054` — success
- Brand raster QA `30998000050` — success
- Brand deep reference and motion audit `30998000023` — success
- Site route integrity audit `30998000016` — success
- Articles catalog acceptance `30998000005` — success
- Yesenin Part I browser acceptance `30998000010` — success
- Yesenin Part II safe publication `30997999986` — success
- Manual Browser QA `30997999988` — success, 4/4 jobs
- Request Pages deployment `30998000261` — expected skip

## Current decision

W0, committed discovery integrity, Safari route-readiness QA and W1 are closed on the current source production SHA. W2–W6 remain open and must start from `main@e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8` or a later explicitly reconciled production head.
