# Verified current truth — W4-A workflow/performance consolidation

## Status

`production-current / source main@a11f6fa / W4-A closed`

## Closed finding

| ID | Closed production state |
|---|---|
| `TLP-PERF-001` | Production output now has manifest-derived entry, per-route, per-asset and total JS/CSS budgets with a machine-readable CI report. All 14 lazy route modules have named limits and remain outside the eager dependency graph. |

## Advanced but still open

| ID | Current production state |
|---|---|
| `TLP-CI-001` | CI and all four Manual Browser QA jobs share exact Node/npm, deterministic build-tool, locked Playwright and preview-readiness primitives. The standalone community mobile workflow is retired without losing Android/iPhone topology. Other specialized browser workflows still contain direct setup/build/browser blocks and remain W4-B scope. |

## Production identity

- Source PR: `FedorMilovanov/TheLegendaryPoet#318`
- Exact tested head: `6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6`
- Current source production: `a11f6faff984cd599539e04696717c6fb336329b`
- Previous production: `4544bb387108a98641313267beafe29deb71ee81`

## Durable invariants

- `@playwright/test` remains exactly locked to `1.61.1` in the committed dependency graph;
- CI and every Manual Browser QA job use repository-local composite actions for Node/npm setup and deterministic system tools;
- every Manual Browser QA job uses the shared locked-Playwright installer and preview-readiness action;
- temporary Playwright installation, a second embedded Playwright version, `--no-save` and `--no-package-lock` remain forbidden;
- the retired standalone community mobile workflow cannot return without failing the consolidation contract;
- Android community request topology runs inside the mandatory core Chromium/Android job;
- iPhone community request topology runs as a fresh WebKit process inside the mandatory base Safari suite;
- all pre-existing route, interaction, lightbox, brand, hover, premium-home, critical-iPhone and WebKit-home contours remain listed in the permanent workflow contract;
- the Vite manifest must contain exactly 14 distinct lazy route chunks and none may enter the eager dependency graph;
- production build validation always writes `dist/build-budget-report.json`, including failure details;
- CI uploads the exact-head budget report for 14 days.

## Exact production measurements

| Surface | Actual | Budget |
|---|---:|---:|
| Entry JavaScript | `612,810 B` | `665,000 B` |
| Largest additional shared JavaScript asset | `488,822 B` | `665,000 B` single-asset ceiling |
| Total JavaScript | `1,635,465 B` | `1,800,000 B` |
| Total CSS | `250,679 B` | `300,000 B` |
| Named lazy routes | `14` | exactly `14` |

All named route chunks passed their individual limits. The largest route limits are `EssayPage` at `58,000 B`, `PoetDetailPage` at `52,000 B`, `RatingsPage` at `34,000 B` and `HomePage` at `32,000 B`.

## Exact combined evidence

The final head passed Content model, Project contracts, full CI, Articles catalog, both Yesenin publication/browser lines, route integrity, both brand lines and Manual Browser QA 4/4. Pages was skipped by the normal PR condition.

Manual Browser QA retained the complete acceptance surface. The core job finished with `105 passed` and `8 skipped`; Android Pixel 7 Chrome passed all four community request-topology cases; the fresh-process iPhone Safari contour passed the same four cases; and the base WebKit runner completed `12` process-isolated contours.

The first Yesenin Part I job attempt was cancelled by its 30-minute timeout while GitHub's runner was still inside `apt-get`, before dependency installation, build or tests. Only that cancelled job was rerun on the same exact SHA; the retry passed setup, runtime validation, production build, browser installation, preview and all three browser profiles.

## Still open

- `TLP-CI-001` — W4-B migration of remaining specialized browser workflows to the verified primitives, with no acceptance deletion;
- `TLP-QA-001` — broader premium reader-outcome synthesis;
- `TLP-CLEAN-001` — branch and artifact retirement;
- `TLP-GOV-001` — owner-controlled package/license/release decisions;
- source PR `#317` — separate staging-only W3 hardening lane; not reviewed or merged by this closure.

## Evidence map

- Verification: `../verification/WORKFLOW_PERFORMANCE_CONSOLIDATION_2026-08-05.md`
- Reverify: `../reverify/REVERIFY_a11f6fa_2026-08-05.md`
- Working matrix: `../working/MASTER_BUG_MATRIX_2026-08-05.md`
- Working wave plan: `../working/WAVE_REPAIR_PLAN_2026-08-05.md`
