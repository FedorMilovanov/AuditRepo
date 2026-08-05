# Verification — W4 workflow and performance consolidation

## Identity

- Source repository: `FedorMilovanov/TheLegendaryPoet`
- Previous production: `4544bb387108a98641313267beafe29deb71ee81`
- W4 source PR: `#318`
- W4 exact tested head: `6bd27851f7bdd834e4fffaf5afca3e8a2102a4f6`
- W4 merge: `a11f6faff984cd599539e04696717c6fb336329b`
- Subsequent source hardening PR: `#317`
- Hardening exact tested head: `253376bd8107471e1641027d892ac5207c18f73a`
- Current production: `d03f09188cd0360c6c984ed93d03b1432913332c`
- Date: `2026-08-05`
- Result: `passed / production-current`

## Root causes closed

`TLP-PERF-001` had only broad aggregate limits, leaving limited entry margin and no enforceable per-route budget. `TLP-CI-001` duplicated Node/dependency setup, deterministic system tools, browser installation and preview polling across workflow jobs, increasing drift and runner cost.

## Verified repair

- recorded the exact W3 production baseline before changing budgets: one `612.81 KiB` entry asset, one `488.82 KiB` shared asset, 14 route chunks, `1597.1 KiB` total JavaScript and `244.8 KiB` total CSS;
- replaced opaque limits with raw-byte entry, per-asset, total-JS, total-CSS and 14 named route budgets;
- retained Vite manifest-based proof that all named routes are distinct lazy dynamic entries and outside the eager entry graph;
- generated `dist/build-budget-report.json` and retained it as CI evidence;
- introduced four repository-owned composite actions for Node/dependencies, deterministic build tools, locked Playwright browser installation and preview readiness;
- migrated CI and all four Manual Browser jobs to the shared primitives;
- retired the standalone community mobile workflow only after moving Android and iPhone topology into existing mandatory browser jobs;
- preserved all route, content, community, brand, hover, lightbox, premium-home, reduced-motion and critical-iPhone acceptance contours;
- added dependency-free workflow inventory/consolidation validation to CI and Project contracts;
- updated browser-runtime validation to prove the commands inside shared actions while preserving exact Playwright `1.61.1` and lockfile-only dependency rules.

## W4 exact workflow matrix

- CI `31027189279` — success
- Project contracts `31027189299` — success
- Content model contract `31027194200` — success
- Articles catalog acceptance `31027192685` — success
- Yesenin Part I browser acceptance `31027191285` — success
- Yesenin Part II safe publication `31027189583` — success
- Site route integrity audit `31027189272` — success
- Brand raster QA `31027192267` — success
- Brand deep reference and motion audit `31027189290` — success
- Manual Browser QA `31027189628` — success, 4/4 jobs
- Request Pages deployment `31027189364` — expected skip

## Subsequent current-production hardening

Source PR `#317` was independently reviewed and passed the same matrix on exact head `253376bd8107471e1641027d892ac5207c18f73a`. It closed pending-rating baseline corruption, poet-detail N+1 community reads and poison outbox identities without changing W4 workflow or budget contracts.

Hardening evidence included:

- CI `31033207684` — success
- Project contracts `31033207809` — success
- Content model contract `31033207681` — success
- Articles catalog acceptance `31033207794` — success
- Yesenin Part I browser acceptance `31033207694` — success
- Yesenin Part II safe publication `31033207711` — success
- Site route integrity audit `31033207675` — success
- Brand raster QA `31033207719` — success
- Brand deep reference and motion audit `31033207700` — success
- Manual Browser QA `31033207897` — success, 4/4 jobs
- Request Pages deployment `31033207691` — expected skip

## Concurrency disposition

The parallel agent merged source `#318` and `#317` after their exact-head matrices passed. A temporary exact-SHA integration PR `#319` was opened during the second merge race, then closed unmerged as redundant once production `d03f09188cd0360c6c984ed93d03b1432913332c` was confirmed. No agent branch was rewritten or force-pushed.

## Promotion decision

W4 is `fixed-current`. W5 premium browser certification becomes `active-current`. W6 branch/artifact retirement and owner-governance decisions remain separate lanes.
