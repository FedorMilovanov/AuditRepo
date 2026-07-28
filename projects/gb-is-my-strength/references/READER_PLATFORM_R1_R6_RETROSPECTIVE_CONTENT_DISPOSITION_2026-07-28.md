# Reader Platform R1–R6 retrospective content disposition

**Date:** 2026-07-28  
**Site repository:** `FedorMilovanov/gb-is-my-strength`  
**Audited site main:** `0a5333f35010a8f2597c05cd958b36634342b61d`  
**Forensic anchor commit:** `c4556b9395f6dea00cb10ebbac2e4e045ea458d2`  
**Anchor ref:** `archive/forensic-reader-platform-r1-r6-histories-20260728`

## Rule

The eight historical refs in this review are classified from actual changed files, exact blobs and current implementations. A merged PR title, branch name or age is not sufficient evidence.

The octopus anchor keeps current main plus all eight historical heads reachable. Its tree contains only a recovery manifest. It must never be merged into `main`.

## Reviewed heads

| Stage | Ref / PR | Historical head |
|---|---|---|
| R1 foundation | `lane/system-reader-preferences-foundation-2026-07-21`, closed #100 | `2166975236f027ff0672074159ede413ead0ae63` |
| R1 final | `lane/system-reader-preferences-r1-final-2026-07-21`, merged #101 | `deca733ca2fd102f1cd81da7ac43ef9c6b207aec` |
| R3 facade | `lane/reader-r3-series-facade-2026-07-21`, merged #102 | `a8b34b12130f51f7fb91641128031f1650cbd507` |
| R4 registry | `lane/reader-r4-public-surface-registry-2026-07-21`, merged #103 | `e491bc8902aee6db69c5701c73a4433bd2b33298` |
| R5 overlay | `lane/reader-r5-overlay-runtime-2026-07-21`, merged #104 | `6e31ec540f47ab2b282e0850dddb2f0c008fa586` |
| Special adapters | `lane/special-overlay-adapters-2026-07-21`, merged #106 | `a91505e70434ac436c7dc39f9cb3ba55d8940065` |
| Production smoke | `verify/special-overlay-production-smoke-2026-07-21`, closed #107 | `a519cd562ee710ebb44f41e739e5aa1b699f9260` |
| R6 state | `lane/reader-r6-state-platform-2026-07-24`, merged #191 | `2461198f45033d8cce5f2444a9492d9f8176fa01` |

## R1 foundation #100 versus final #101

The foundation PR changed 161 files. The large scope is mostly route adoption and generated revision updates. It also contained two temporary workflows:

- `.github/workflows/_temp-reader-preferences-full-gate.yml`;
- `.github/workflows/_temp-reader-sync-main.yml`.

The product implementation was not lost when #100 was closed. Exact blob checks against final #101:

- `css/reader-preferences.css`: `45eaba60ad0e6d220ddecd49e7ccfc6ada09ec22` in both heads;
- `js/reader-preferences.js`: `845ab7d6242c7a298bc9702c89146a51ffa4dd7d` in both heads;
- `src/components/reader-platform/ReaderPreferencesHead.astro`: `a4f2de02a92c96c439dbb6cc1cddb4f3c38883f1` in both heads.

Final #101 additionally retained current map/runtime guards and permanent `site-utils`, `engine-sweep` and runtime regression fixes. The two temporary workflows are not production assets and are not recovered.

**Disposition:** #100 is `SUPERSEDED-WITH-BYTE-EVIDENCE`; #101 is the accepted product lineage.

## R1 current evolution

Current `js/reader-preferences.js` has a later blob `4bb17669607ccea9407fd94712985b9b6680dc2a`, but still identifies itself as `GB Reader Preferences v1` and remains the appearance source of truth for series, books, articles and pages. Later modifications extend the platform; they do not remove the R1 model.

**Disposition:** `PRESERVED-AND-EVOLVED`.

## R3 neutral series facade

Historical and current `src/components/article-pilots/_shared/series/SeriesReaderChrome.astro` share the exact blob:

`52bde3cf1548b8852496dec01fe992274506329e`

The facade remains a neutral public entry over the single proven Gill implementation. No second book or series engine exists.

**Disposition:** `PRESERVED-BYTE-FOR-BYTE`.

## R4 public-surface registry

Historical R4 introduced:

- `surface = series | article | page | special`;
- `seriesShape = flat | book`;
- derived chrome/config/settings ownership;
- 76 route profiles;
- registry audit and mutation tests.

Historical registry blob: `2f520b09f56dfd7af16ab7190000c1cbe5d5c637`.

Current registry blob: `3d2de2ccd9c33b19b449db78062356c61c369862`.

The current file is a strict extension, not a replacement loss. It adds:

- `series-landing` and `series-reference` route types;
- explicit page route types;
- derived `reading`, `landing`, `reference`, `application` roles;
- production rejection of `unknown` route metadata;
- landing/reference adapter validation;
- migration-lane and section exposure.

**Disposition:** `PRESERVED-AND-STRICTLY-EXTENDED`.

## R5 canonical OverlayRuntime

Historical and current `js/site-utils.js` share the exact blob:

`d7b1026908cf64bc043aa4733e74e80ce75b2df1`

This preserves the canonical named overlay ownership, reference-counted scroll lock, stack ordering, opener restoration, inert/aria claims and lifecycle cleanup introduced by R5.

**Disposition:** `PRESERVED-BYTE-FOR-BYTE`.

## Special-surface adapters #106

The permanent writer-zero guard is preserved byte-for-byte:

`scripts/special-overlay-writer-regression-test.js` → `65d9ac95986f99459475b09f882c3dcd8dbc98c3`

Current `karty/_engine/map-engine.js` has evolved through later map fixes but still contains the canonical special-overlay contract:

- `window.OverlayRuntime || window.SiteUtils?.OverlayRuntime`;
- namespaced `special:map:<route>:<instance>` owner stem;
- independent panel and photo owners;
- idempotent fallback owner set;
- exact inert/`aria-hidden` state restoration;
- opener focus restoration;
- owner-isolated destroy.

The current map engine therefore preserves the #106 ownership model while extending map state, layers, viewport and rendering.

**Disposition:** `PRESERVED-AND-EVOLVED`.

## Closed production verification #107

The sole changed file is a 185-line read-only workflow:

`.github/workflows/_verification-special-production-smoke.yml`

It contains useful diagnostics not reducible to a branch label:

- source-merge ancestry and immutable blob assertions;
- production-like dist reproduction;
- durable build logs;
- polling the public origin;
- byte comparison of public assets with reproduced dist;
- positive owner markers and negative direct-style-writer checks;
- JSON evidence generation.

The workflow also captured the historical root cause that 113 cache-bust revision mismatches blocked public comparison. It is intentionally not a permanent product workflow and must not be merged unchanged.

Dedicated archive ref:

`archive/forensic-special-overlay-production-smoke-20260721` → `a519cd562ee710ebb44f41e739e5aa1b699f9260`

Current `Deploy Candidate Contract` covers production-like build and publication audit, while active deploy work #485 is extending URL-contract evidence. The exact public/dist smoke remains useful forensic methodology until a permanent production witness fully supersedes it.

**Disposition:** `FORENSIC-ARCHIVE-RETAINED`.

## R6 ReaderState

Historical and current `js/reader-state.js` share the exact blob:

`80f79b8f03ec80583a28400fdcab1bf5f62d2c6d`

The one geometry/progress/active-section/persistence owner and `gb:reader-state-change` event remain intact.

**Disposition:** `PRESERVED-BYTE-FOR-BYTE`.

## Authorized ref normalization

After this record is merged, the following old working refs may be normalized to the exact current site `main` because their content is either byte-preserved, strictly evolved, or explicitly archived:

- `lane/system-reader-preferences-foundation-2026-07-21`;
- `lane/system-reader-preferences-r1-final-2026-07-21`;
- `lane/reader-r3-series-facade-2026-07-21`;
- `lane/reader-r4-public-surface-registry-2026-07-21`;
- `lane/reader-r5-overlay-runtime-2026-07-21`;
- `lane/special-overlay-adapters-2026-07-21`;
- `verify/special-overlay-production-smoke-2026-07-21`;
- `lane/reader-r6-state-platform-2026-07-24`.

Do not normalize or merge the two forensic refs:

- `archive/forensic-reader-platform-r1-r6-histories-20260728`;
- `archive/forensic-special-overlay-production-smoke-20260721`.

## Final conclusion

No Reader Platform R1–R6 product capability is missing from current `main`. The only unique non-product artifact is the #107 public production-smoke methodology, now explicitly retained. All future reader-platform branch cleanup must use the same file-level test rather than names, age or PR status alone.
