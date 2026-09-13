# CURRENT HEAD REVERIFY — mobile overflow + telemetry harness live closure

- Date: 2026-09-13
- Product repository: `FedorMilovanov/gb-is-my-strength`
- Product current-main anchor: `c0ebdc461b16a33fa6a317a933f6cbab43d78549`
- Live release anchor: `c0ebdc461b16a33fa6a317a933f6cbab43d78549`
- AuditRepo base: `8dd7be24fd6e23fb9dc29d5ae7ae2865332e224d`
- Scope: bounded closure of the two mobile horizontal-overflow defects discovered by the full public-surface browser matrix, plus the CI telemetry-classification root that initially produced a false Visual Parity red while verifying the App repair.
- MASTER arithmetic: unchanged. This receipt does **not** reopen or add a Product work unit.

## Terminal disposition

Closed:

1. `/app/` mobile horizontal overflow at 320 and 390 CSS px.
2. `/karty/maccabim/` holding-page mobile horizontal overflow at 320 CSS px.
3. Home progressive-enhancement CI false-red caused by observed Yandex Metrica transport hosts not covered by the existing narrow telemetry classifier.

Not closed / not absorbed here:

- `FRAGMENTED-SECURITY-OWNERSHIP` remains an architectural owner decision.
- `GBS-SEARCH-CONTROL-PLANE-001` remains an external Search Console owner/authentication decision.
- Native Product `main` admission is already independently closed by the separate 2026-09-13 branch-protection receipt and is not part of this wave.

Current MASTER therefore remains correctly at **0 direct defects + 0 improvements + 0 residuals + 0 system lanes + 2 owner decisions**.

## 1. Baseline defect proof

A clean production-like build at Product `main@7bf6da9fcf9a1be4eae44df8336379fb8f97cbdb` completed 103 pages and then the full `public-surface-browser-matrix.mjs` completed all **309/309** route/viewport cases with **4863/4866** contracts passing.

The three failures were exactly:

- `/app/`, 320×760: document/root width 349 vs client 320, **+29 px** horizontal overflow.
- `/app/`, 390×844: document/root width 422 vs client 390, **+32 px** horizontal overflow.
- `/karty/maccabim/`, 320×760: document/root width 333 vs client 320, **+13 px** horizontal overflow.

This converted earlier TinyFish mobile observations from hypotheses into deterministic current-source defects.

## 2. App root cause and repair

Source owner: `src/pages/app/index.astro`.

The App defect had two independent causes:

1. the <=980px hero grid used `1fr`, so its intrinsic minimum could exceed the mobile shell;
2. the <=720px premium type scale made long unbreakable Russian words wider than the available container.

Targeted probes proved:

- replacing the mobile hero track with `minmax(0, 1fr)` shrank the grid/child track correctly but did **not** by itself remove root overflow;
- remaining internal overwidth was localized to `.app-title` / its emphasized long word and, at 320 px, the bridge heading;
- disabling pseudo-elements did not change root width and was rejected as a cause.

Repair in Product PR **#2022**:

- <=980px hero: `grid-template-columns: minmax(0, 1fr)`;
- <=720px App H1: `font-size: clamp(40px, 12.5vw, 72px)`;
- <=720px bridge H2: `font-size: clamp(27px, 8vw, 34px)`.

No `overflow-x:hidden`, body clipping, text rewriting, or global responsive override was introduced.

Exact final PR head:

`04ea598cd777bf66a18574b0dc97b6ed1fecb5c3`

Merge:

`580e7081d870fcc57d259e720f406a3825630f1f`

Fresh final-base Product evidence on that head:

- production-like build: **103 pages**, 0 errors, 0 warnings, postbuild drift 0;
- full browser matrix: **309/309 cases, 4866/4866 contracts PASS, 0 failures**;
- Bible App Deep Browser Contract: Chromium SUCCESS + WebKit SUCCESS;
- Route Registry: Chromium public matrix/semantics/touch-scroll SUCCESS + WebKit touch/scroll SUCCESS;
- Source Authority SUCCESS;
- Visual Parity SUCCESS;
- Shared Files Guard SUCCESS;
- Deploy Candidate SUCCESS.

## 3. Karty root cause and repair

Source owner: `src/components/karty/KartyHoldingPage.astro`.

Repeated exact browser probes at 320 px showed the single overflowing bounding box was the holding-page `<main>`:

- baseline root: 333 / 320;
- `main` extended to approximately x=333 while body padding left only 264 px content width.

The centered CSS Grid permitted the grid item to retain its intrinsic minimum width. Long heading text under the audit font path expanded the implicit grid track.

Targeted injection proved `main { min-width: 0 }` alone reduced the root to **320 / 320**. A body-grid rewrite was unnecessary.

Repair in Product PR **#2023**:

- exactly one semantic geometry change: `min-width: 0` on the shared holding-page `main`.

No overflow hiding, no text mutation, no body-wide layout rewrite.

Exact final PR head:

`7534f786d1c5b8c2a9ae1a484898ffd7e6be5b72`

Merge:

`37e89af29ae0b8aaa7a18c82778b504d646e40b4`

Independent Karty-only matrix after the repair completed all 309 cases with **4864/4866** contracts PASS: the Karty failure was gone and the only two remaining failures were the still-independent App 320/390 defects. This is the isolation witness that the Karty repair did not mask App overflow.

## 4. Telemetry CI false-red root and repair

While verifying App PR #2022, the Visual Parity workflow's production visual-parity contract itself passed, but the following Home progressive-enhancement browser test failed on external XHR TLS errors:

- `https://hdrc.yandex.net/`
- `https://mdd.yandex.net/`
- `ERR_CERT_AUTHORITY_INVALID`

The existing classifier recognized only `*.mc.yandex.ru/com`, so these observed Metrica transport failures were incorrectly promoted to Product application failures.

Repair in Product PR **#2024**:

- allowlist only the two observed Metrica transport hosts `hdrc.yandex.net` and `mdd.yandex.net`;
- keep unrelated `*.yandex.net` requests fatal;
- add positive assertions for both observed tuples;
- add a negative assertion proving an unrelated `api.yandex.net` error remains fatal.

No `*.yandex.net` wildcard and no generic certificate/network suppression was added.

Exact head:

`6cd2333fb0219359688a0dce549cc3188682e140`

Merge:

`9bf46679f3aab3f72d540dc9f344903bc94bf868`

Exact-head server evidence included the previously failing Home progressive-enhancement step passing, plus full Visual Parity, Source Authority and Deploy Candidate success.

## 5. Combined Product closure

A clean integration tree from current Product main at the time plus only the independent App and Karty leaf fixes completed:

- production-like build: PASS;
- 103 public routes × 3 viewports;
- **309/309 cases completed**;
- **4866/4866 contracts PASS**;
- **0 failures**.

Gill mobile layout and PlayEmber/mobile-play contracts also passed on the integrated tree.

After sequential SYSTEM → Karty → App merges, the real App PR head reproduced the same **4866/4866** result, so the zero matrix was not dependent on an unmerged synthetic branch.

## 6. Production release evidence

### First Product live release containing both overflow repairs

Deploy workflow run **34723425508** promoted merge `580e7081d870fcc57d259e720f406a3825630f1f`.

Both jobs were SUCCESS.

Readiness included:

- static publication source gates;
- one production-like build;
- ownership / Pagefind / publication / URL / JSON-LD / rich-schema audits;
- PremiumControls;
- Gill strict audits;
- Home box-model browser witness;
- Gill pre-v16 live traversal;
- Gill mobile PlayEmber smoke;
- Gill mobile reference-layout audit;
- broad runtime smoke;
- content coverage;
- SW deploy-switch readiness;
- frozen editorial projections;
- immutable candidate provenance and identity verification.

Promotion included:

- exact candidate download by artifact ID;
- candidate identity verification;
- GitHub Pages deployment;
- generic live release contract SUCCESS;
- live TTS contract SUCCESS;
- IndexNow step SUCCESS.

The live deployment record changed from prior `37e89af29ae0b8aaa7a18c82778b504d646e40b4` to `580e7081d870fcc57d259e720f406a3825630f1f`.

Candidate digest:

`sha256:f6c78f1568e1f262789a0a2037120acd7f1b46c5d44ce0181f664c6e56c1c8a7`

### Current-main/live alignment after unrelated follow-up

Product later advanced by PR #2025 to:

`c0ebdc461b16a33fa6a317a933f6cbab43d78549`

The complete comparison from `580e7081...` to `c0ebdc46...` changed only:

`scripts/search-modal-browser-contract.mjs`

Therefore neither App source nor Karty source was modified by the follow-up.

Deploy workflow run **34724501081** then completed SUCCESS for `c0ebdc46...`, including:

- readiness candidate SUCCESS;
- Pages promotion SUCCESS;
- generic live release contract SUCCESS;
- live TTS contract SUCCESS;
- IndexNow step SUCCESS.

Final live `/deployments/current.json` proves:

- `releaseSha = c0ebdc461b16a33fa6a317a933f6cbab43d78549`;
- `controlPlaneSha = c0ebdc461b16a33fa6a317a933f6cbab43d78549`;
- immutable path `/deployments/c0ebdc461b16a33fa6a317a933f6cbab43d78549/34724501081-1.json`;
- candidate digest `sha256:2f10cb5dd80a65b36045c0df045e83e5f28179a44136df17c17a3e15dbf4ee3a`.

At receipt creation time Product `main` and the live release SHA are therefore exact.

## 7. Independent live mobile DOM witness

After the final `c0ebdc46...` production promotion, a separate headless Chromium/Playwright run navigated directly to live production and measured actual DOM geometry.

### `https://gospod-bog.ru/app/`

320×760:

- `window.innerWidth = 320`
- `documentElement.clientWidth = 320`
- `documentElement.scrollWidth = 320`
- `body.scrollWidth = 320`
- horizontal overflow = **0 px**
- visible bounding-box offenders = **0**

390×844:

- `window.innerWidth = 390`
- `documentElement.clientWidth = 390`
- `documentElement.scrollWidth = 390`
- `body.scrollWidth = 390`
- horizontal overflow = **0 px**
- visible bounding-box offenders = **0**

### `https://gospod-bog.ru/karty/maccabim/`

320×760:

- `window.innerWidth = 320`
- `documentElement.clientWidth = 320`
- `documentElement.scrollWidth = 320`
- `body.scrollWidth = 320`
- horizontal overflow = **0 px**
- visible bounding-box offenders = **0**

390×844:

- `window.innerWidth = 390`
- `documentElement.clientWidth = 390`
- `documentElement.scrollWidth = 390`
- `body.scrollWidth = 390`
- horizontal overflow = **0 px**
- visible bounding-box offenders = **0**

This is independent live geometry evidence, not inference from screenshots or source.

## 8. TinyFish disposition

TinyFish run:

`603613ae-59e5-4190-a73d-9bdbe02c8b9d`

was intentionally asked for the same runtime DOM measurements across both pages and both mobile viewport sizes.

It terminated with a wall-clock timeout after 55 steps and returned **no measurement result**.

Therefore:

- it is **not** counted as a PASS;
- its timeout is **not** treated as a Product failure;
- closure authority is the deterministic local/full browser matrix, exact-head CI, immutable production promotion/live contracts, and the independent post-promotion Playwright DOM witness above.

This prevents a failed external browser-agent task from being misrepresented as positive evidence.

## 9. Concurrency and current boundaries

At final verification:

- Product current main: `c0ebdc461b16a33fa6a317a933f6cbab43d78549`;
- live release: exact same SHA;
- subsequent Product open PR #2026 is a separate Baptist historical-media lane and is not used as closure evidence or modified by this wave;
- AuditRepo had no open PR when this receipt lane was created.

No competing Product lane was reset, rebased, force-pushed, closed, or modified.

## Closure statement

The two newly discovered Product mobile overflow defects are closed at source, exact-head browser-contract, integrated-matrix, merge, immutable-release, and live-DOM levels.

The related telemetry false-red root is closed without weakening application-network failure semantics.

No current Product defect or system-verification lane is admitted by this wave. The existing MASTER remains authoritative with **2 owner decisions** outside this closure scope.

## 10. Post-closure current-main advance: TEEN-only release `b896774a`

After the original closure receipt was merged, Product `main` advanced by exactly one commit:

- Product PR **#2027** / merge `b896774acb386784d63a2ebb98135f5e9f9467b0`;
- change theme: TEEN symbolic series artwork/media metadata.

A direct compare from the prior live/current anchor `c0ebdc461b16a33fa6a317a933f6cbab43d78549` to `b896774acb386784d63a2ebb98135f5e9f9467b0` shows changes only in:

- TEEN series WebP assets;
- `src/components/article-pilots/_shared/series/teenSeriesMedia.ts`;
- seven TEEN article MDX metadata rows.

No App source, Karty holding-page source, shared/global layout, or Home telemetry classifier file changed.

Current-source re-read at `b896774a...` confirms the repairs remain present:

- App <=980px hero still uses `grid-template-columns: minmax(0, 1fr)`;
- App <=720px title remains `clamp(40px, 12.5vw, 72px)`;
- App bridge H2 remains `clamp(27px, 8vw, 34px)`;
- `KartyHoldingPage.astro` still has `main{...;min-width:0;...}`;
- Home telemetry classifier still recognizes only `mc.yandex.ru/com` plus exact `hdrc|mdd.yandex.net` transport hosts, with unrelated `api.yandex.net` explicitly asserted fatal.

Deploy workflow run **34725402441** then completed both jobs SUCCESS for `b896774a...`:

- immutable readiness candidate SUCCESS;
- Pages promotion SUCCESS;
- generic live release contract SUCCESS;
- live TTS capability extension SUCCESS;
- IndexNow step SUCCESS.

Final live `/deployments/current.json` at this addendum proves:

- `releaseSha = b896774acb386784d63a2ebb98135f5e9f9467b0`;
- `controlPlaneSha = b896774acb386784d63a2ebb98135f5e9f9467b0`;
- immutable path `/deployments/b896774acb386784d63a2ebb98135f5e9f9467b0/34725402441-1.json`;
- candidate digest `sha256:3860bb20d93d82594eec895e2c471e9da999e24d7db70c29f510c266c0bf4be7`.

Because the only intervening Product change is TEEN-specific and the repaired owners are byte/source-unchanged, the existing live mobile DOM witness remains applicable to the closed App/Karty roots; no new admission signal reopens either defect.

Concurrency note: AuditRepo PR #450 is a separate owner-decision lane for the GitHub Pages transport-header limitation. It does not touch this receipt and is intentionally not merged or modified by this closure wave.
