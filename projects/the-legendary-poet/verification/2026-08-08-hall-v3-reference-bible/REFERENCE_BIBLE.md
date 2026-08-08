# TLP-HALL-001 — Hall v3 Reference Bible wave

Recorded: 2026-08-08  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #369  
Product PR: #374  
Base before wave: `9cce8bb386262172a50f0d65d52372e045e4cd43`  
Exact tested Product head: `9a993399749a818fed5ffe9ac9ee2378807aafc2`  
Product squash merge / resulting main: `cc81858626c8ddcf8e59016231068c45cbb6e246`  
Audit lane: `TLP-HALL-001`

## Disposition

**REFERENCE-BIBLE-WAVE MERGED / lane remains OPEN.**

Gate 0 foundation remains permanently guarded. Gate 1 Reference Bible was promoted in source and verified on the exact PR head. This wave does not choose a building topology or camera winner and does not activate `metricGreybox`; those remain separate later decisions.

## What became current authority

The merged source now contains:

- `docs/hall-v3/REFERENCE_BIBLE.md` — institutional/conservation references annotated as `TAKE / AVOID / WHY / SOURCE`;
- `docs/hall-v3/SPATIAL_BRIEF.md` — common H1/H2/H3 comparison protocol, metric/accessibility witnesses, camera/mobile evidence requirements and automatic rejection rules;
- `docs/hall-v3/reference-bible.json` — machine-readable source inventory, metrics, hypotheses, data-authority boundaries and explicit non-decisions;
- `scripts/validate-hall-reference-bible.ts` — a machine guard against source gaps, metric drift, premature topology/camera decisions and missing workflow wiring;
- persistent `validate-hall-foundation.ts` invariants that continue to keep production `/hall` lightweight and isolated from Hall-v2 / Three-R3F runtime while later gates advance.

`hall-v3-contract.json` advanced from `phase=foundation` to `phase=referenceBible`; `foundation=completed`, `referenceBible=active`, and `metricGreybox` plus all later gates remained blocked in this transaction.

## Evidence principles locked by the wave

The source contract now requires the next spatial work to compare materially different hypotheses rather than refine one favorite concept by inertia. The current candidates are:

- H1 — orientation court + chronological branches;
- H2 — directed chronological promenade + focus bays;
- H3 — asymmetric orientation + strong diagonal/curved trajectory + side focus rooms.

None is approved. Dome/rotunda/four-wing/long-nave/FPS assumptions remain non-decisions.

The greybox brief carries real-world minimum witnesses including 915 mm one-way clear route, 1525 mm two-way/recommended museum-route clearance, approximately 760×1220 mm accessible viewing clearance and 2030 mm headroom. These are minimum constraints, not target proportions.

The design boundary is object-first 3D plus authoritative accessible DOM context. Legacy visual metadata such as `poetMuseumMeta.ts` cannot become Hall-v3 source authority by naming/inertia.

## Exact-head verification

All effective PR-triggered workflows on exact tested head `9a993399749a818fed5ffe9ac9ee2378807aafc2` completed successfully before merge:

- `CI` — run `31239882360`: success;
- `Project contracts` — run `31239882308`: success;
- `Manual Browser QA` — run `31239882338`: success;
- `Site route integrity audit` — run `31239882323`: success;
- `Brand deep reference and motion audit` — run `31239882310`: success;
- `Brand raster QA` — run `31239882298`: success;
- `Content model contract` — run `31239882318`: success;
- `Articles catalog acceptance` — run `31239882297`: success;
- `Yesenin Part I browser acceptance` — run `31239882331`: success;
- `Yesenin Part II safe publication` — run `31239882300`: success.

`Request Pages deployment` — run `31239882311` — was skipped as expected and was not treated as a failed gate.

Project contracts explicitly passed both `Validate Hall v3 foundation invariants` and `Validate Hall v3 Reference Bible contract` on the exact tested head.

Immediately before merge:

- Product `main` remained exact `9cce8bb386262172a50f0d65d52372e045e4cd43`;
- PR #374 was eleven commits ahead / zero behind;
- changed files were exactly eleven Hall/governance/verification files;
- review threads: 0;
- submitted reviews: 0;
- PR head remained `9a993399749a818fed5ffe9ac9ee2378807aafc2`;
- PR was mergeable.

PR #374 was marked ready and squash-merged with `expected_head_sha=9a993399749a818fed5ffe9ac9ee2378807aafc2`.

## Resulting source truth

GitHub produced Product squash merge / resulting `main`:

`cc81858626c8ddcf8e59016231068c45cbb6e246`

The merge commit records that the Reference Bible phase is current while metric greybox and all later production gates remain blocked.

## Next allowed bounded wave

Next work is **metric-greybox tooling/preflight**, not a chosen museum build:

1. start from fresh Product `main@cc81858626c8ddcf8e59016231068c45cbb6e246`;
2. prove a reproducible Blender/headless scene-generation or validation path before committing to art assets;
3. define machine-readable greybox outputs and candidate-equality rules;
4. keep production `/hall` unchanged and keep Three/R3F out of the dormant route;
5. only then activate `metricGreybox` in a separate source transaction;
6. compare H1/H2/H3 under the same neutral-material, camera, mobile and measurement package before any topology winner is recorded.

`TLP-HALL-001` remains open.