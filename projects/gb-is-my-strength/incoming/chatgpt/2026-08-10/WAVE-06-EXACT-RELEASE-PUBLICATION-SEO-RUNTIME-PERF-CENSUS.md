# WAVE 06 — exact-release publication / SEO / runtime / performance census

Date: 2026-08-10
Agent: ChatGPT
Status: raw negative assurance + measurement candidates; no new MASTER promotion

## Anchors

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact release candidate: deploy run `31379283849`, artifact `9059689652`, 1,178 files / 86,924,625 candidate bytes.
- AuditRepo immediately before intake: `e3b98b59dae393dbd56eb8c023895756f4a657b1`.

## 1. Whole-sitemap static publication census

All 75 sitemap routes were parsed from the exact candidate output.

Positive controls:

- 75/75 sitemap routes have exactly one `<h1>`.
- duplicate IDs: 0 routes.
- broken same-page or cross-route fragments: 0.
- missing local images in parsed publication HTML: 0.
- `<img>` without `alt`: 0 content routes in the census.
- unsafe `target="_blank"` links lacking a noopener/noreferrer relation: 0.
- plain HTTP links: 0.
- server-rendered buttons without a visible/ARIA/title name: 0.
- server-rendered form controls without any label/ARIA/title/placeholder/label wrapper signal: 0 in the first static pass.

### False positive closed: `/izbrannoe/`

A sitemap-only target lookup initially reported two links to `/izbrannoe/` as broken (Home and `/hard-texts/genesis-6/`). This was an audit bug, not a Product bug.

The exact candidate contains `/izbrannoe/index.html` plus `data/route-profiles/izbrannoe.json`; it is intentionally `noindex, follow` and therefore excluded from sitemap. Do not reopen a broken-link defect for these links.

## 2. Sitemap exclusion / noindex reconciliation

Exact candidate contains 85 public HTML route outputs and 75 sitemap routes. The ten HTML routes excluded from sitemap are all explicitly non-indexable:

- `/izbrannoe/` — `noindex, follow`;
- eight temporary Karty visual-audit routes (`early-church`, `maccabim`, `melachim`, `pavel`, `revelation`, `shoftim`, `shvatim`, `yeshua`) — `noindex, follow`;
- `/konfessii/russkij-baptizm/_app/` — `noindex` app shell.

Results:

- sitemap route with `noindex`: 0;
- excluded HTML route without `noindex`: 0.

Disposition: no fresh SEO/discovery defect from the 85↔75 difference.

## 3. Missing width/height noise resolved

52 sitemap routes initially appeared to contain an `<img>` without explicit width/height. Representative inspection showed the repeated element is the Yandex counter pixel (`https://mc.yandex.ru/watch/...`), not reader-facing article media. Do not turn that count into a CLS finding.

## 4. Three above-fold Heart-series hero images are lazy — measurement-first only

Exactly three current `gbs2-hero` content images are marked `loading="lazy"` without `fetchpriority`:

- `/articles/chto-bibliya-nazyvaet-serdcem/`;
- `/articles/krajne-li-isporcheno-serdce/`;
- `/articles/serdce-spravochnik/`.

Exact candidate CSS geometry confirms each image is above the fold at both 390×844 and 1440×1000. Representative position is y≈217..390 mobile and y≈212..545 desktop, before the H1.

Raw image sizes are small:

- 16,196 bytes;
- 27,986 bytes;
- 13,358 bytes.

Disposition: **not a current performance defect without LCP evidence**. Browsers may still fetch near-viewport lazy content promptly, and raw bytes are modest. Preserve as a targeted measurement candidate only if a Web Vitals/LCP lane is scheduled; do not invent a threshold.

## 5. Multi-family exact-bundle classic-runtime smoke

The exact candidate HTML/CSS/local classic JS was executed in Chromium at 390×844 and 1440×1000 for:

- `/`;
- `/articles/`;
- `/biografii/`;
- `/hard-texts/genesis-6/`;
- `/map/`;
- `/karty/`;
- `/konfessii/`;
- `/pastor-series/`.

Within the audit transport boundary (local candidate scripts/styles inlined because direct origin networking is blocked):

- no new Product page errors after excluding opaque-origin localStorage noise;
- no new console errors after excluding unavailable external-resource noise;
- no horizontal document overflow at either tested width;
- each route retained one H1.

Search-trigger counts independently reproduced the already-recorded search cold-start family: Home/Map expose a search bootstrap control, while Articles/Biografii/Pastor-series do not. This is **not a new Wave-06 defect**; it belongs to the earlier search verification evidence.

## 6. Map input false positive closed by browser accessibility state

Static `/map/` HTML has `#atlasSearchInput` with a placeholder but no literal static `aria-label`. Current runtime upgrades its accessibility state: Chromium exposes the searchbox name `Найти материал в Атласе`. Do not open an unlabeled-map-search bug from static markup alone.

## 7. Heading and skip-link candidates held outside MASTER

Static census found heading-level jumps on seven routes and no explicit skip-link on five special surfaces (`/hard-texts/genesis-6/`, `/karty/`, `/karty/ishod/`, `/konfessii/`, `/map/`). These are not promoted from syntax alone:

- heading level jumps can be legitimate component/card hierarchy and are not by themselves a WCAG failure;
- several no-skip routes are distinct app/special shells and still expose main/landmark structure.

A keyboard/AT-focused contract is needed before treating either class as mandatory work.

## 8. Route-shell raw byte census

Raw HTML + directly referenced local JS/CSS (before transfer compression/cache) highlights expected heavy surfaces:

- Baptist `_app`: ~2.31 MB shell raw, including ~2.246 MB HTML;
- large reader routes: roughly 1.27–1.53 MB raw shell, dominated by shared `site.css`, `floating-cluster.css`, controller/runtime and article HTML.

These numbers are **not transfer/LCP metrics**. The Baptist built-app size is already known in Work Queue as `R-005`; do not duplicate it. Reader-shell raw totals require gzip/cache/Web Vitals context before any performance defect claim.

## 9. Current live release witness coverage boundary

The exact `release-live-deployment-contract.json` for `29770e1...` proves release/control-plane identity and fetches:

- Home bytes and its refutations stylesheet;
- sitemap;
- feed;
- Pagefind runtime;
- service worker.

It does not perform a 75-route interactive click/keyboard matrix. Therefore a PASS live release witness is strong deployment-integrity evidence but must not be interpreted as proof that special route interaction states (for example `/rodosloviye/` Fit View/SplitView) passed live interaction tests.

## Disposition

- New direct current defects: **0** in Wave 06.
- MASTER changes: **0**.
- New measurement-first candidates: three above-fold lazy Heart heroes, low urgency until actual LCP data exists.
- False positives closed: `/izbrannoe/` broken-link signal; common missing image dimensions; `/map/` unlabeled-search suspicion.
- Product mutation: **none**.
