# Reverify — TLP analytics consent authority closure — 2026-09-12

## Scope

Bounded closure verification for `TLP-ANALYTICS-CONSENT-001` only.

Independent discovery, audit-harness, external GA4 property authority and community-production roots remain outside this closure.

## Product repair

Product PR: `FedorMilovanov/TheLegendaryPoet#504` — `fix(analytics): make consent revocable and cross-tab authoritative`.

Base: `71c3ddf76e0be2fe98e94be9dc09beabe3ade58a`.

Exact certified head: `20823ba47c6cf0955809cf5adea57c9e5be653c2`.

CAS squash/resulting `main`: `3963f2f2da7d6f4ff73d4efd8c23ccf5eca05293`.

Tested tree: `5831a18e74f2dc6cfe6e9b236e7ddff6e6097cf0`.

Resulting tree: `5831a18e74f2dc6cfe6e9b236e7ddff6e6097cf0`.

The tested and resulting trees are identical.

## Root cause and repair

The prior consent implementation had three independent authority gaps:

- consent was cached in a tab-local module value without a browser-wide storage-event convergence owner;
- a later `denied` choice changed local state but did not actively stop providers that were already initialised;
- the normal UI exposed the choice only while unset, while PrivacyPage offered no persistent editor.

The repair establishes one revocable lifecycle authority:

- same-tab changes publish one typed application event;
- cross-tab changes converge through the browser `storage` event;
- blocked localStorage remains fail-closed but the current tab still owns the explicit user decision without cookies/sessionStorage fallback;
- `/privacy` exposes persistent `Allow analytics` / `Disable analytics` controls and a live current-state indicator;
- Google collection follows Consent Mode `analytics_storage` plus the documented `ga-disable-MEASUREMENT_ID` hard kill switch;
- Yandex collection uses the documented `disableYaCounter<ID>` pre-init switch and `ym(id, 'destruct')` to stop an initialized SPA counter;
- provider scripts have explicit ownership markers and are not duplicated on re-grant;
- Google configuration is initialized exactly once in a SPA runtime;
- a revoke resets route-tracker deduplication authority, while re-grant emits exactly one page view for the current settled semantic route;
- navigation while denied emits zero analytics page views.

The production Measurement ID itself is deliberately not changed here. `TLP-ANALYTICS-PROPERTY-001` remains the independent external authority boundary.

## Exact-head proof

At exact Product head `20823ba47c6cf0955809cf5adea57c9e5be653c2`:

- Project Contracts `34712563400`: success;
- CI/source verification `34712563423`: success;
- Site Route Integrity Audit `34712563395`: success;
- Brand Deep Reference and Motion Audit `34712563426`: success;
- Brand Raster QA `34712563396`: success;
- Hall web runtime proof `34712563444`: success;
- Merge Certification `34712563474`: success;
- Yesenin Part I browser acceptance `34712563417`: success;
- Articles catalog acceptance `34712563398`: success;
- Manual Browser QA `34712563408`: success.

The dedicated analytics QA production build uses isolated fake IDs only:

- Google: `G-TLPQA00001`;
- Yandex: `98765432`.

That contour runs both Chromium and iPhone WebKit and proves, with two real same-origin tabs:

1. unset consent loads no provider scripts;
2. grant converges to both tabs;
3. each tab loads exactly one Google and one Yandex provider script;
4. Google config is emitted once;
5. initial Yandex init is emitted once;
6. cross-tab deny converges to both tabs;
7. Google hard-disable becomes true and Consent Mode ends at `analytics_storage=denied`;
8. Yandex disable becomes true and an initialized counter receives exactly one `destruct`;
9. semantic navigation while denied emits zero additional page views;
10. SPA re-grant converges to both tabs without provider-script duplication or duplicate Google config;
11. Yandex is re-initialized in the same runtime after its prior destruct;
12. re-grant emits exactly one current settled-route page view;
13. the existing semantic-route contract remains intact: same-route query/filter mutations still emit zero page views.

Before PR certification the same exact branch also passed local detached production-build validation, TypeScript, build, and the four analytics tests across Chromium + iPhone WebKit.

## Resulting-main proof

Push workflows for resulting `main@3963f2f2da7d6f4ff73d4efd8c23ccf5eca05293` all completed success:

- Project Contracts `34716291754`;
- CI `34716291509`;
- Site Route Integrity Audit `34716291510`;
- Brand Deep Reference and Motion Audit `34716291462`;
- Brand Raster QA `34716291552`;
- Hall web runtime proof `34716291787`;
- Articles catalog acceptance `34716291545`;
- Manual Browser QA `34716291608`;
- Deploy to GitHub Pages `34716291547`;
- Notify IndexNow `34716368955`.

Inside the resulting-main Manual Browser QA, the dedicated analytics route/consent job, premium browser jobs, Chromium/Android base contour and fresh-process iPhone Safari contour all completed success.

## External GA4 boundary reverified after closure

This consent closure does not resolve `TLP-ANALYTICS-PROPERTY-001`.

A fresh independent connector read after Product #504 still finds only two readable GA4 properties in both GSC Wizard and Windsor:

- `537251354` — Milovi Cake;
- `547331637` — The Legendary Poet.

Windsor's Admin/API-backed `measurement_id + stream_id + stream_name + hostname` query returns one row only for Milovi Cake:

- `G-94ZZ5B8YNY`;
- stream `14860814056`;
- `Main Website`;
- `milovicake.ru`.

The TLP property `547331637` returns no measurement/stream/hostname row. Therefore production `G-6NT4248RKK` remains unmapped to the currently readable GA4 properties and must not be guessed or rotated.

## Disposition

`TLP-ANALYTICS-CONSENT-001` is closed-by-lifecycle-authority and leaves the active engineering matrix.

Independent rows remain independent:

- `TLP-COMM-ABUSE-001`;
- `TLP-DISCOVERY-001`;
- `TLP-AUDIT-004`;
- `TLP-ANALYTICS-PROPERTY-001`.

Matrix arithmetic: P1 stays 1, P2 `4 → 3`, P3 stays 0, total active `5 → 4`.
