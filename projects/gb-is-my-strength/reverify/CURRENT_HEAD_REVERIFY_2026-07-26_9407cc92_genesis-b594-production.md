# CURRENT HEAD REVERIFY — 2026-07-26 — `9407cc92` Genesis provenance + `b594ba82` production

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `9407cc92eb22dc6eab76f831df35a09429663e3e`
- AuditRepo base before this reconciliation: `7ae396dae5a45a4c9f9b50ed3d190264de8c64da`
- Research authority main: `9bba3d45d3475468798f69e4b6067acae673b79c`
- Exact production/live authority: `b594ba82afbbefb8cc5c27ea2604d9f308392daa`

Source, CI, publication and production are separate authorities. Source `9407cc92` is newer than production `b594ba82` and is not claimed deployed.

## Genesis Research provenance closure

PR #348 squash-merged as one source-main commit `9407cc92` over `b594ba82`. Final tree changed exactly:

- `.github/workflows/genesis6-research-provenance.yml`;
- `data/genesis6-research-provenance.json`;
- `scripts/genesis6-research-provenance-contract.mjs`.

The site binding pins:

- Research commit `9bba3d45d3475468798f69e4b6067acae673b79c`;
- authority base `b654c5375a7b212ff9b42c08bb0193eeaad70746`;
- manifest SHA-256 `95320cc56c678fcacf4f24985f96150c231b1d91338349c19005e277b16125dd`;
- four ordered article bundles for Articles 6–9;
- rights decisions `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY`.

Both checkouts use full-SHA `actions/checkout` with `persist-credentials: false`; the evidence upload action is full-SHA pinned and `if-no-files-found: error`. Workflow permissions are read-only.

Exact pre-merge head `ce75fcde235d8542d7cde8e7ab07270455234739` passed:

- Genesis provenance `30176399705`, artifact `8624332266` (`sha256:1f6403dbaeb990d2e325eb189bb1b6422e48b5ff5856c6bccbbe0976a7efcbed`);
- Shared Files Guard `30176399710`, artifact `8624333583` (`sha256:e7bc4d61560f4206039e8ae275532ff419e18dfa423ef4bc76658082f2196e72`);
- Visual Parity `30176399701`, artifact `8624394907` (`sha256:f34885772619b8c9a4703446302fa99550d7ca7b0bd91b70b04d85c0fe055823`).

Post-merge Genesis run `30177457077` passed on exact `main@9407cc92`; artifact `8624610690` is 558 bytes with digest `sha256:527d55f98e33c4ff0c57cc8b27fd669fd2002030304429889577c8d1333396cd`.

Artifact logs report:

- Research validator PASS: 21 documents, 4 bundles, 2 rights decisions;
- site contract PASS: exact Research commit, four article bundles and exact manifest digest.

Safe publication state remains `draft-noindex`. No route, MDX, cover, theme/CSS, generated output or publication activation was added.

## Exact production authority: `b594ba82`

Production is separately proven for the preceding source commit:

- readiness run `30176319427` — success, exact checkout `b594ba82`;
- readiness artifact `8624387433` — `sha256:1615e5115512e0433f7d3d6239578d7ab59e1c0d14ba352a2625b030e35ddd77`;
- deploy run `30176621679` — success, exact checkout `b594ba82`; all 33 substantive deploy steps succeeded;
- Pages artifact `8624531252` — 63,129,406 bytes, `sha256:5d634570ba74435aea54b2176086822262efb2d45f10ec662b7b9bd6b715e9a4`;
- TTS witness artifact `8624532125` — 1,283 bytes, `sha256:9d7dcbedd75825acc4ffa6da8fa174697bbccbdee2d5b8158fdd967490fb8bb5`;
- live `/deployments/current.json` binds `b594ba82` to deploy `30176621679` attempt 1 and readiness `30176319427`;
- immutable live provenance is `/deployments/b594ba82afbbefb8cc5c27ea2604d9f308392daa/30176621679-1.json`;
- live TTS contract passed on attempt 1 and repository projection was recorded on PR #354.

This proves Pages/live/TTS capability for `b594ba82`. It does not prove readiness built the same whole artifact that deploy published: readiness still builds without uploading the candidate, while deploy repeats install/build. Issues #292/#295 remain open.

## Runtime same-identity recovery

Historical run `30175901907` on `31758828` attempt 1 passed Chromium and no-JS but failed WebKit at `canonical Ctrl+K did not focus search input`. Artifact `8624233132` (`sha256:f98876c557f835c334514ba26e8f1b8a049d7b9b8b32525874577c3fd994d42f`) contains `result.json` and `webkit-failure.png`; the screenshot shows the search surface open. Exact failed-job rerun attempt 2 used job `89728735517`, passed all four browser modes with the unchanged contract, and uploaded artifact `8624672432` (232 bytes, `sha256:2d45251b7dafc5a55b6663019c182d056b999d47fc42430d4403b1137488e8aa`). The notifier closed issue #357 at `2026-07-25T22:30:31Z` as same-identity recovery. Classification: CI/browser timing flake; no product change and no assertion weakening.

## SSOT and counter transaction

- Advanced only the exact production authority from `f5e29998` to `b594ba82`.
- Added the post-merge Genesis and same-identity Runtime recovery evidence missing from the preceding reverify.
- Added `HOME-BROWSER-LIFECYCLE-RESIDUAL` for active PR #365 (superseding closed staging #361) / reopened issue #299: P1 100 → 101.
- Repaired stale summary values to match accepted headings: closed 156 → 160 and P2 37 → 36; total open remains 196 because the P1 addition and prior P2 closure offset.
- Added a permanent validator and black-box regressions for heading/summary/total consistency; previous immutable reverify files remain unchanged.

## Residuals

- #365/#299: test-only real-history homepage lifecycle and shortcut evidence; no product redesign.
- #301/#64: effective permission registry, persisted-credential and full-SHA privileged-action enforcement.
- #292/#295: whole-artifact provenance and build-once promotion.
- `GENESIS6-ACTIVATION-OWNER-GAP`: no current product owner; provenance closure does not publish content and archived #287 must not be reused.
