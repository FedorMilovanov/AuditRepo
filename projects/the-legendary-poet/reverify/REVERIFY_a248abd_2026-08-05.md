# Reverify — source `main@a248abd`

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Source branch: `main`
- Source SHA: `a248abd54007bd839ffc149b9195dc4e79dc5dd3`
- Source PR: `#311`
- Exact tested head: `8eaeaa4abc7f80eb6b96de0657df0b3e255d96d3`
- Date: `2026-08-05`
- Result: `current and closed for W2`

## Proof chain

1. Two overlapping W2 proposals, source `#309` and `#310`, were closed unmerged after collision detection.
2. Source `#311` became the sole integration branch from production `main@e06bdfc42ada0a6111f0cde6e39dd7f48204f2c8`.
3. The integrated six-file diff added one immutable publication boundary, catalog duplicate guards, raw-authoring snapshots, canonical-consumer enforcement and exact-checkout workflow coverage.
4. The final head passed every required source workflow, including Manual Browser QA 4/4.
5. Production `main` was rechecked immediately before expected-head merge and still matched the declared base.
6. Expected-head squash merge produced source `main@a248abd54007bd839ffc149b9195dc4e79dc5dd3`.
7. Post-merge `src/data/essays/publishEssay.ts` was re-read from `main` and contains clone, stable identity protection, derived reading time, recursive freeze and duplicate catalog guards.
8. Post-merge `scripts/validate-essay-publication.ts` was re-read from `main` and proves raw snapshots, stable catalog identity, deep freeze, read-time parity and canonical consumer boundaries.

## Final source workflow matrix

- Content model contract `31001131944` — success
- Project contracts `31001131962` — success
- CI `31001131954` — success
- Articles catalog acceptance `31001131923` — success
- Yesenin Part I safe publication `31001131852` — success
- Yesenin Part I browser acceptance `31001131889` — success
- Yesenin Part II safe publication `31001131849` — success
- Yesenin Duncan safe publication `31001131855` — success
- Site route integrity audit `31001131888` — success
- Brand raster QA `31001131880` — success
- Brand deep reference and motion audit `31001131933` — success
- Manual Browser QA `31001131881` — success, 4/4 jobs
- Request Pages deployment `31001131882` — expected skip

## Current decision

W2 is closed on current source production. W3 community scaling is the next implementation lane and must start from `main@a248abd54007bd839ffc149b9195dc4e79dc5dd3` or a later explicitly reconciled production head.
