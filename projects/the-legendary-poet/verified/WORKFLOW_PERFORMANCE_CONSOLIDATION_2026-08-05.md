# Verified current truth — W4 workflow and performance consolidation

## Status

`production-current / source main@d03f091`

## Closed findings

| ID | Closed production state |
|---|---|
| `TLP-PERF-001` | Production build output is measured against one entry budget, 14 named lazy-route budgets, a per-JavaScript-asset ceiling and total JavaScript/CSS ceilings. CI persists a machine-readable budget report. |
| `TLP-CI-001` | Repeated Node/dependency, deterministic build-tool, Playwright-browser and preview-readiness blocks are centralized in four repository-owned composite actions without deleting acceptance coverage. |

## Production identity

- W4 source PR: `FedorMilovanov/TheLegendaryPoet#318`
- W4 exact tested head: `6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6`
- W4 squash production: `a11f6faff984cd599539e04696717c6fb336329b`
- Subsequent W3 production-hardening PR: `FedorMilovanov/TheLegendaryPoet#317`
- Hardening exact tested head: `253376bd8107471e1641027d892ac5207c18f73a`
- Current source production: `d03f09188cd0360c6c984ed93d03b1432913332c`

## Durable W4 invariants

- exact Node/npm setup is shared through `.github/actions/setup-node-deps`;
- deterministic FFmpeg/ImageMagick installation is shared through `.github/actions/install-build-tools`;
- browser binaries are installed from the committed Playwright `1.61.1` runtime through `.github/actions/install-playwright`;
- production preview readiness is shared through `.github/actions/start-preview`;
- all four Manual Browser QA jobs use the shared primitives;
- the standalone community mobile workflow is retired, while Android topology remains in the core browser job and iPhone topology remains in the fresh-process WebKit suite;
- every previous route, content, brand, interaction, premium-desktop and critical-iPhone acceptance contour remains mandatory;
- the production entry and every emitted JavaScript asset have a `665,000` byte ceiling;
- total JavaScript has a `1,800,000` byte ceiling and total CSS a `300,000` byte ceiling;
- all 14 route modules remain distinct lazy dynamic chunks with explicit route-specific budgets;
- CI writes and uploads `dist/build-budget-report.json`;
- dependency-free workflow consolidation validation runs in CI and the fast Project contracts gate;
- browser-runtime validation accepts only direct committed-lockfile commands or the audited shared actions and still rejects temporary Playwright installs, secondary versions and ephemeral dependency flags.

## Current W3 hardening retained after W4

Current production additionally preserves the first server baseline across repeated edits of one pending rating, repairs invalid persisted device UUIDs, discards malformed outbox operations before retry and prevents poet-detail N+1 reads by keeping quick navigation passive and compact poem panels user-activated.

## Exact evidence

The W4 exact head passed CI, Project contracts, Content model, Articles catalog, both Yesenin lines, route integrity, both brand lines and Manual Browser QA 4/4. Pages was skipped by the normal PR condition. The subsequent hardening head passed the same complete matrix and Manual Browser QA 4/4 without changing W4 budgets or workflow primitives.

## Still open

- `TLP-QA-001` — active W5 premium browser and reader-outcome certification;
- `TLP-CLEAN-001` — W6 branch and artifact retirement;
- `TLP-GOV-001` — owner-controlled package/license/release decisions.

## Evidence map

- Verification: `../verification/WORKFLOW_PERFORMANCE_CONSOLIDATION_2026-08-05.md`
- Reverify: `../reverify/REVERIFY_d03f091_2026-08-05.md`
- Working matrix: `../working/MASTER_BUG_MATRIX_2026-08-05.md`
- Working wave plan: `../working/WAVE_REPAIR_PLAN_2026-08-05.md`
