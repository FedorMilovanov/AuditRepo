# Verified current truth — locked Playwright runtime

## Status

`closed-production / source main@1959894`

## Finding

`TLP-RUNTIME-01`: browser evidence used transient Playwright packages installed after `npm ci`, including two different versions and lockfile-bypassing flags.

## Closed state

- exact `@playwright/test 1.61.1` is committed in `package.json`;
- matching test, runner and core packages are committed in `package-lock.json`;
- six browser workflows and eight jobs no longer install test-runner code dynamically;
- browser binaries are installed by the locked CLI;
- `validate:browser-runtime` prevents manifest/lock drift and hidden workflow versions;
- the validator is part of `npm run check`;
- the temporary lock generator was removed before final verification.

## Exact evidence

- tested head: `40eba88a027d6d78dd04ac0dcefb8272d888063f`;
- source PR: `FedorMilovanov/TheLegendaryPoet#302`;
- production merge: `19598947c20cd2dd94abd232fbf6fb8a05c3575a`;
- exact-head workflow results: eight success, Pages expected skip;
- Manual Browser QA: four successful jobs.

## Reopen conditions

Reopen this finding when any of these becomes true:

- a workflow installs `@playwright/test` outside `npm ci`;
- a workflow embeds a different Playwright version;
- manifest and lock versions differ;
- `validate:browser-runtime` leaves the main gate;
- a locked-runtime browser acceptance line becomes red.

## Evidence map

- Raw: `../incoming/gpt-5-6-playwright-runtime/2026-08-05/REPORT.md`
- Verification: `../verification/PLAYWRIGHT_RUNTIME_LOCK_2026-08-05.md`
- Reverify: `../reverify/REVERIFY_1959894_2026-08-05.md`
