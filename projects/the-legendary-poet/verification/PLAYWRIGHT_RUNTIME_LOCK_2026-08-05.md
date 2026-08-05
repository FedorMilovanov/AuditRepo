# Verification — Playwright runtime lock

## Verification identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Source PR: `#302`
- Previous production SHA: `e06d75970cf1262f4dab5bfd941e45328f07f747`
- Exact tested head: `40eba88a027d6d78dd04ac0dcefb8272d888063f`
- New production SHA: `19598947c20cd2dd94abd232fbf6fb8a05c3575a`
- Result: `passed`

## Promotion decision

The raw workflow-harness finding is promoted to verified current production truth. Promotion is based on a reproducible lockfile, an executable anti-regression validator, all affected workflows running against the same committed Playwright line and a SHA-guarded squash merge.

## Verified invariants

1. `@playwright/test` is an exact devDependency, not a workflow-installed package.
2. `@playwright/test`, `playwright` and `playwright-core` resolve to `1.61.1` in `package-lock.json`.
3. Six browser workflows install dependencies through `npm ci`.
4. Browser jobs install only Chromium/WebKit binaries through the locked CLI.
5. Workflow YAML contains no `npm install @playwright/test`, embedded Playwright version, `--no-save` or `--no-package-lock`.
6. `npm run check` executes `validate:browser-runtime`.
7. The temporary lock generator is absent from the final head and production tree.

## Evidence matrix

- CI `30992733097` — success, including `npm ci` and repository gates.
- Brand raster `30992733021` — success.
- Brand deep/motion `30992732882` — success.
- Route integrity `30992732993` — success.
- Articles catalog `30992733013` — success.
- Yesenin Part I browser `30992732925` — success.
- Yesenin Part II publication `30992732989` — success.
- Manual Browser QA `30992732891` — success, all four jobs.
- Pages request `30992733069` — expected skip.

The clean lock-generation runner also completed high-severity dependency audit successfully before the final head was produced.

## Verification boundary

This wave does not claim new reader-facing functionality. It makes the existing browser evidence reproducible and closes the harness debt explicitly left open by the preceding marathon repair wave.

## Canonical records

- Raw report: `../incoming/gpt-5-6-playwright-runtime/2026-08-05/REPORT.md`
- Verified compact state: `../verified/PLAYWRIGHT_RUNTIME_LOCK_2026-08-05.md`
- Exact source reverify: `../reverify/REVERIFY_1959894_2026-08-05.md`
