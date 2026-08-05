# Verification — W4-A workflow/performance consolidation

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Previous production: `4544bb387108a98641313267beafe29deb71ee81`
- Source PR: `#318`
- Exact tested head: `6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6`
- Production merge: `a11f6faff984cd599539e04696717c6fb336329b`
- Date: `2026-08-05`
- Result: `W4-A passed / production-current`

## Root causes addressed

1. The entry bundle had only limited margin below one broad ceiling, while route chunks could grow to 1.3 MB and total JavaScript to 9 MB before failing.
2. CI and four Manual Browser jobs copied Node/npm, apt, Playwright and preview-readiness implementations.
3. The dedicated community mobile workflow paid for a fifth independent dependency install, production build, browser install and preview despite proving contours already compatible with mandatory Manual Browser QA.
4. Existing static validators were coupled to literal workflow commands and the retired standalone mobile workflow path rather than the durable behavior.

## Verified repair

- four repository-local composite actions now own exact Node/npm setup, deterministic apt tools, locked Playwright browser installation and preview readiness;
- CI and all four Manual Browser jobs use those actions;
- browser-runtime validation accepts only direct committed-lockfile commands or the verified shared actions;
- consolidation validation prohibits temporary Playwright installation, duplicate embedded versions and return of the retired mobile workflow;
- the consolidation validator also requires every pre-existing browser acceptance suite to remain present;
- Android community topology moved into the existing core Chromium/Android job;
- iPhone community topology moved into the existing fresh-process WebKit suite;
- the Vite manifest now drives one entry budget, fourteen route-specific budgets, a single-JavaScript-asset ceiling and total JS/CSS ceilings;
- the build validator writes a JSON report before returning success or failure;
- CI retains the report as exact-head evidence;
- no content, community runtime, backend schema, brand art, package lock or generated public artifact changed in this lane.

## Measured budget evidence

The exact CI artifact `build-output-budget-6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6` recorded:

- entry: `612,810 / 665,000 B`;
- total JavaScript: `1,635,465 / 1,800,000 B`;
- total CSS: `250,679 / 300,000 B`;
- fourteen distinct lazy route chunks;
- all route and asset measurements passed;
- no failures.

Named route results:

- `HomePage` `23,801 / 32,000 B`;
- `HallPage` `3,275 / 8,000 B`;
- `PoetsPage` `7,990 / 12,000 B`;
- `PoetDetailPage` `39,264 / 52,000 B`;
- `RatingsPage` `22,905 / 34,000 B`;
- `ArticlesPage` `6,630 / 12,000 B`;
- `EssayPage` `42,299 / 58,000 B`;
- `MusicPage` `21,448 / 32,000 B`;
- `TrackDetailPage` `14,854 / 23,000 B`;
- `AboutPage` `9,067 / 15,000 B`;
- `EditorialPolicyPage` `6,091 / 12,000 B`;
- `PrivacyPage` `5,973 / 12,000 B`;
- `MyArchivePage` `14,598 / 23,000 B`;
- `NotFoundPage` `2,053 / 6,000 B`.

## Exact-head workflow evidence

- Content model contract `31027194200` — success
- Articles catalog acceptance `31027192685` — success
- Brand raster QA `31027192267` — success
- Yesenin Part I browser acceptance `31027191285` — success after same-SHA retry of one apt-timeout job
- Yesenin Part II safe publication `31027189583` — success
- Project contracts `31027189299` — success
- CI `31027189279` — success
- Site route integrity audit `31027189272` — success
- Brand deep reference and motion audit `31027189290` — success
- Manual Browser QA `31027189628` — success, 4/4 jobs
- Request Pages deployment `31027189364` — expected PR skip

## Browser evidence

Manual Browser logs prove that removal of the standalone community workflow did not remove its behavior:

- Chromium core passed all four community topology cases;
- Android Pixel 7 Chrome passed all four community topology cases;
- the core Chromium/Android suite completed `105 passed`, `8 skipped`;
- fresh-process iPhone Safari ran the shared topology file and passed all four cases;
- the base Safari runner completed `12` fresh-process contours;
- premium desktop, critical iPhone and independent WebKit home/reveal jobs all passed.

## Concurrency and merge barrier

- source `main` remained `4544bb387108a98641313267beafe29deb71ee81` immediately before merge;
- PR head remained `6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6`;
- compare result was `behind=0`;
- review threads were empty;
- source `#317` remained an explicitly staging-only draft and shared only `package.json` with W4-A;
- `#318` was marked ready only after all required checks were terminal;
- expected-head squash merge produced `a11f6faff984cd599539e04696717c6fb336329b`.

## Post-merge production readback

- `package.json` on production contains `validate:workflow-consolidation`, includes it in repository-wide `check`, and keeps exact Playwright `1.61.1`;
- `.github/workflows/manual-browser-qa.yml` on production uses all four shared actions in all four jobs and runs Android community topology in the core suite;
- `scripts/run-webkit-process-isolated.mjs` on production includes the community request-topology suite for iPhone Safari;
- `scripts/validate-workflow-consolidation.mjs` on production requires the four actions, preserved suites, retired standalone workflow and budget constants;
- `.github/workflows/community-scaling-browser.yml` is absent from production as intended.

## Promotion decision

Promote `TLP-PERF-001` to `fixed-current` on source production `a11f6faff984cd599539e04696717c6fb336329b`.

Keep `TLP-CI-001` as `active-current`, narrowed to W4-B migration of remaining specialized workflows. This closure does not claim full workflow convergence, broader reader-outcome certification, branch retirement or owner-controlled governance decisions.
