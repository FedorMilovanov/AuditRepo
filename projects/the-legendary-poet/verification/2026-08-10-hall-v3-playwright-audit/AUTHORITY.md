# TLP-HALL-001 — independent Hall / Playwright audit

Date: 2026-08-10 (Europe/Paris boundary; Product runs occurred 2026-08-09 UTC)

## Authority anchors

- Product repository: `FedorMilovanov/TheLegendaryPoet`
- Hall architecture issue: Product #369 / `TLP-HALL-001`
- pre-audit Product main: `4e9046640d0f070783e60de41afff3ab3c1cb319` (#400)
- audit repair PR: Product #401 — `test(hall): certify Hall route on iPhone Safari`
- final #401 exact tested head: `9849edc9790d3c1dbf2482262c24b75da42dd6b2`
- merged Product authority: `main@5ae4841dbe0e9f586a08fde7efce75d867e88858`
- final Manual Browser QA run: `31339089644` / run #2389
- final WebKit evidence artifact: `9045352641`
- final WebKit artifact digest: `sha256:5f0299a0541b7fbddcbeb9ab73199e846fcef407537ee2eca568ee80b6c16f98`

This audit was performed after the #397–#400 integrity wave. It independently re-read current authority, Playwright configuration/workflows/tests, exact-head workflow results and generated artifacts rather than treating previous green checks as sufficient proof.

## Audit scope

The audit covered:

1. Product current main/open-PR collision state;
2. Playwright version/lockfile/runtime installation authority;
3. Manual Browser QA topology and exact-head checkout behaviour;
4. desktop Chromium, Pixel 7, iPhone Safari/WebKit route coverage;
5. actual generated JSON/PNG browser evidence rather than workflow status alone;
6. production `/hall` placeholder and route-budget/dependency boundary;
7. Hall H3/R1/L0 DCC regeneration and raw/optimized GLB/Khronos evidence;
8. Pushkin source-byte acquisition/hash evidence;
9. rights/gate machine state and external-authority boundary;
10. consistency between current documentation, validators and generated evidence.

## PASS — Playwright/runtime authority before repair

The audit confirmed the browser harness is materially stronger than a nominal smoke suite:

- `@playwright/test` is exact-pinned at `1.61.1`;
- `package-lock.json` is the dependency authority for `@playwright/test`, `playwright` and `playwright-core`;
- the shared Playwright action asserts the resolved version and installs browser binaries through the locked CLI;
- CI mode uses one worker and fail-on-flaky behaviour;
- browser jobs build the production site and exercise a Vite production preview;
- exact tested SHA is checked out/verified before evidence is generated;
- browser evidence is retained as artifacts;
- desktop Chromium and Pixel 7 already contained explicit `/hall` deep-route probes.

## Finding 1 — `/hall` missing from fresh-process iPhone/WebKit route certification

### Reproduction

On pre-audit `main@4e904664...`:

- `qa/deep-routes.spec.mjs` explicitly covered `/hall` on desktop Chromium and Pixel 7;
- exact-head #400 browser evidence contained `desktop-hall` and `pixel7-hall` JSON/PNG evidence;
- the isolated WebKit route matrix and its fresh-process runner listed Poets/Ratings/Articles/Music/Archive/About/NotFound but omitted Hall;
- therefore #400 produced no `iphone-safari-hall-isolated-route` evidence.

This was a real platform-coverage gap, not merely naming drift: the generic WebKit helper was already capable of probing arbitrary routes.

### Repair

Product #401 adds `['hall', '/hall']` to the iPhone Safari route authority and makes the fresh-process WebKit runner execute that contour. The existing `validate:browser-runtime` validator now requires both declarations so Hall cannot silently disappear from Safari route certification.

## Finding 2 — Safari route evidence could be green while screenshotting the intro/loading surface

The first #401 repair head was deliberately inspected beyond workflow status.

Intermediate exact head: `a0baf456031f838556b3c80cc741bb2cb7eadca1`.

Intermediate WebKit evidence artifact: `9045190504`.

That run was green and now did contain an iPhone Safari Hall JSON/PNG file. However manual inspection of the PNG showed a dark screen dominated by the centred spectral brand mark rather than the Hall placeholder. A contact-sheet comparison of the same artifact showed the same problem on Hall/About/Archive/NotFound while several other routes already showed their actual content.

### Root cause

The route helper waited for persistent shell surfaces (`#main-content` and mobile dock) and then used a fixed short settle delay. Those shell surfaces exist before lazy route content is visually settled.

Current application source has two independent visual loading boundaries:

1. first-document `WipeOverlay` / `.page-wipe`, whose animation is approximately 0.72 s and contains the spectral brand mark;
2. React `Suspense` route fallback `RouteLoadingShell`, exposed as `role="status"` with `aria-label="Загрузка страницы"`.

The old helper could therefore satisfy HTTP, shell geometry, overflow and runtime-error assertions while the screenshot still represented the intro/loading state. This is a genuine false-positive visual-evidence class.

### Root repair

Product #401 changes the shared isolated WebKit helper so route evidence cannot proceed until:

- `.page-wipe` is hidden;
- the `Загрузка страницы` Suspense shell is hidden.

The same helper now records:

- `pageWipeVisible`;
- `routeLoadingVisible`.

The common diagnostics fail closed unless both are `false`. `validate:browser-runtime` also guards the presence of these readiness waits/diagnostics so the blind spot cannot quietly return.

This strengthens all isolated Safari route probes, not only Hall.

## Final exact-head browser proof

Final #401 exact tested head:

`9849edc9790d3c1dbf2482262c24b75da42dd6b2`

Final Manual Browser QA run:

`31339089644`

All four jobs were terminal success:

- `browser-qa` — Chromium/Android and base iPhone Safari fresh-process contour;
- `webkit-home-reveal-qa` — isolated WebKit home/route contours;
- `premium-iphone-critical-qa`;
- `premium-home-qa`.

The same head also passed Project Contracts, CI, Site Route Integrity, Brand raster/deep, Articles catalog and Yesenin browser acceptance.

### Final WebKit artifact

Artifact: `9045352641`

Digest: `sha256:5f0299a0541b7fbddcbeb9ab73199e846fcef407537ee2eca568ee80b6c16f98`

The final artifact was inspected structurally and visually.

Routes inspected:

- `/hall`;
- `/about`;
- `/archive`;
- `/articles`;
- `/music`;
- not-found route;
- `/poets`;
- `/ratings`.

For all inspected route JSON records:

- `pageWipeVisible=false`;
- `routeLoadingVisible=false`;
- horizontal overflow = 0;
- page errors = `[]`;
- console errors = `[]`;
- local request failures = `[]`.

The final PNG contact sheet showed actual page content for all eight routes. In particular, the Hall screenshot visibly contains the real production placeholder — `Зал Поэтов`, the development notice and the navigation CTAs — rather than the spectral loading mark.

Therefore both Playwright findings are closed by exact-head execution plus before/after visual evidence.

## PASS — Hall DCC / visual authority consistency

No inconsistency was found between canonical Hall decisions and regenerated #400 evidence:

- H3 layout fingerprint remained `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`;
- H3 mesh fingerprint remained `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`;
- regenerated route length remained approximately 37.8327 m with four forced turns;
- R1 remained the selected 28 mm camera authority;
- L0 remained the readable selected material/light baseline;
- current L1 remained visibly rejected rather than accidentally promoted;
- raw and optimized GLBs both passed Khronos validation with zero errors/warnings;
- optimized output retained the intended Meshopt path;
- raw→optimized browser comparison remained visually close rather than proving only schema validity.

No production DCC or WebGL authority was inferred from these proof assets.

## PASS — source-byte / rights boundary

Exact source-byte evidence remained consistent with canonical records:

- Kiprensky portrait: 10,862,180-byte 3455×4000 JPEG; SHA-256 `316d5f366a46f23cd0a181e570f2d09a6b0d12bc368dab18fdb394b8b8b8bf4b`;
- `Eugene Onegin` 1833 edition: 5,433,794-byte 324-page PDF; SHA-256 `d629c10943cbf6428eabb194ee5c17c1b763c27108a2238eaf72fadb275643e5`.

The audit found no path by which successful byte acquisition promoted either record to rights-approved or production-eligible. Runtime paths remain unset, documentary Blender consumption remains blocked, and Pushkin House remains an actual `not-submitted` institutional-copy dependency.

## PASS — production `/hall` boundary

The production Hall route remained a lightweight placeholder during the audit:

- route budget remains 8 KB;
- the #400 production Hall chunk remained well below that budget;
- foundation validation still rejects Three/R3F/postprocessing and legacy Hall dependency leakage through the reachable Hall graph;
- #401 changes QA/validator files only and does not activate production WebGL.

The correct current Safari assertion is therefore placeholder usability/runtime readiness, not imaginary 3D/FPS claims for a gate that has not been authorized.

## Gate state after audit

Unchanged:

- active gate: `pushkinVerticalSlice`;
- rights workflow: `external-authority-required`;
- approved documentary assets: 0;
- exact acquired-byte hashes: 2;
- final credits: 0;
- documentary runtime paths: 0;
- production manifest allowed: false;
- documentary Blender media consumption allowed: false;
- production WebGL allowed: false;
- `offlineVisualApproval`: blocked;
- `webVerticalSlice`: blocked;
- `fullMuseumScaleOut`: blocked.

## Disposition

The independent current-head audit found two connected Playwright evidence defects and closed both through Product #401. No additional reproduced Hall-specific defect was found in the DCC, source-byte, rights/gate, route-budget or dependency-boundary surfaces reviewed in this pass.

These findings are **closed current engineering outcomes**, not new open MASTER rows. The TLP engineering matrix remains zero.

The architecture lane remains parked at the genuine external owner/legal/institutional boundary. New autonomous Product work requires either materially new external authority or a newly reproduced defect on the then-current Product head.
