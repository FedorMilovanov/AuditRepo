# Agent Work Report — locked Playwright runtime

## Identity

- Project: `the-legendary-poet`
- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Source base: `main@e06d75970cf1262f4dab5bfd941e45328f07f747`
- Source PR: `#302`
- Exact tested head: `40eba88a027d6d78dd04ac0dcefb8272d888063f`
- Production squash merge: `19598947c20cd2dd94abd232fbf6fb8a05c3575a`
- Date: `2026-08-05`

## Confirmed finding

Six browser workflows contained eight post-`npm ci` installations of `@playwright/test`. Seven jobs installed version `1.54.1` with `--no-save --no-package-lock`; Brand raster QA installed `1.55.0` with `--no-save`. The tests therefore ran against transient dependency graphs that differed from the committed `package-lock.json` and from each other.

This was workflow-harness dependency drift, not a reader-facing product defect. It was previously recorded as non-blocking debt in the marathon closure and is closed by this wave.

## Implemented repair

- added exact devDependency `@playwright/test: 1.61.1`;
- committed matching `@playwright/test`, `playwright` and `playwright-core` lock entries at `1.61.1`;
- removed every workflow-time Playwright package installation;
- retained browser binary installation through the locked CLI (`npx playwright install --with-deps ...`);
- added `scripts/validate-browser-runtime.ts`;
- added `validate:browser-runtime` to the repository-wide `npm run check` gate;
- made the validator reject hidden workflow versions, `--no-save`, `--no-package-lock`, missing `npm ci` and lock/manifest disagreement.

## Bootstrap boundary

A temporary workflow generated the lockfile on a clean networked Linux runner and ran `npm audit --audit-level=high`. It was deleted before the final tested head. It is not present in production and is not part of the permanent workflow architecture.

## Final exact-head evidence

| Workflow | Run | Result |
|---|---:|---|
| CI | `30992733097` | success |
| Brand raster QA | `30992733021` | success |
| Brand deep reference and motion audit | `30992732882` | success |
| Site route integrity audit | `30992732993` | success |
| Articles catalog acceptance | `30992733013` | success |
| Yesenin Part I browser acceptance | `30992732925` | success |
| Yesenin Part II safe publication | `30992732989` | success |
| Manual Browser QA | `30992732891` | success; 4/4 jobs |
| Request Pages deployment | `30992733069` | skipped by expected PR condition |

Manual Browser QA passed premium desktop, critical iPhone, Safari reveal/routes, core Chromium/Android and isolated base iPhone Safari processes on the locked runtime.

## Merge proof

- merge method: squash;
- merge guard: `expected_head_sha=40eba88a027d6d78dd04ac0dcefb8272d888063f`;
- production source SHA: `19598947c20cd2dd94abd232fbf6fb8a05c3575a`;
- post-merge `main/package.json` was re-read and contains exact `@playwright/test 1.61.1` plus the repository-wide validator gate.

## Decision

Finding `TLP-RUNTIME-01` is `closed-production`. Any future workflow-time installation of `@playwright/test` or mismatch between manifest and lock must fail the repository gate and reopen a new reverify cycle.
