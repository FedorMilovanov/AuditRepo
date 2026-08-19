# SW-SCRIPTURL-ROUTE-VERSION-CHURN

## Classification

- Project: `gb-is-my-strength`
- Signal class: Product runtime ownership + audit-harness false-green
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none
- Parent/system work unit: `SW-ROOT-GENERATION-AUTHORITY`

## Finding

The root Service Worker registration uses route-local `window.SITE_CONFIG.version` as part of the worker script URL while all registering pages use one root scope `/`:

```js
var siteVersion = window.SITE_CONFIG && window.SITE_CONFIG.version || '';
var workerUrl = '/sw.js' + (siteVersion ? '?v=' + encodeURIComponent(siteVersion) : '');
navigator.serviceWorker.register(workerUrl, { scope: '/' });
```

`SITE_CONFIG.version` is not release-global. Current route families publish incompatible values, so one deployed root worker can be registered under different script URLs merely by navigating between route families.

Examples:

```text
/                              -> /sw.js?v=1778943682
/rodosloviye/                  -> /sw.js?v=1
/baptisty-rossii/              -> /sw.js?v=1781282355
/articles/diotrefy-nashego-vremeni/ -> /sw.js?v=20260802
/hard-texts/genesis-6/         -> /sw.js?v=c7f8b6e9
```

The last value is not a page literal: `BaseLayout.astro` sets `runtimeConfig.version = ASSET_VERSIONS['js/glossary.js']`, currently `c7f8b6e9`, then writes that config into `window.SITE_CONFIG` before its generic runtime-script array registers `js/sw-register.js`.

## Corrected semantic route census

An earlier version of this evidence reported `67/85` registering routes and a seven-route bare `/sw.js` group. That was **wrong** and is explicitly superseded here.

Root cause of the audit error: the first scanner primarily looked for literal `<script ... sw-register.js>` carriers. Current `BaseLayout.astro` registers indirectly:

```js
const runtimeScripts = [
  assetUrl('js/site-utils.js'),
  assetUrl('js/scroll-perf.js'),
  ...(includeLegacySiteScript ? [assetUrl('js/site.js')] : []),
  assetUrl('js/sw-register.js'),
];
...
{runtimeScripts.map((src) => <script is:inline defer src={src}></script>)}
```

A literal-tag scanner can therefore miss a real registration owner. The same earlier pass also inferred “no SITE_CONFIG writer” too mechanically instead of resolving route composition and BaseLayout's hash-derived config.

The corrected census resolves Astro import graphs, excludes mere registry/helper string mentions such as `src/lib/asset-version.js`, recognizes generic runtime arrays as real carriers, and resolves the effective route config owner.

### Final current census

- **85** Astro route entries examined.
- **70 / 85** have a real `sw-register.js` registration owner.
- **15 / 85** do not register on first load from their own route graph.
- **0 / 70** have two real registration owners in the same route graph.
- **0 / 70** registering routes resolve to bare `/sw.js`.
- Those 70 routes resolve to exactly **five** root-worker script identities in one Product release:

| Registering route graphs | Effective `SITE_CONFIG.version` | Resulting worker URL |
|---:|---|---|
| 25 | `1` | `/sw.js?v=1` |
| 22 | `1781282355` | `/sw.js?v=1781282355` |
| 19 | `1778943682` | `/sw.js?v=1778943682` |
| 2 | `20260802` | `/sw.js?v=20260802` |
| 2 | `c7f8b6e9` via `ASSET_VERSIONS['js/glossary.js']` | `/sw.js?v=c7f8b6e9` |

The two hash-derived BaseLayout routes are:

```text
/hard-texts/genesis-6/
/izbrannoe/
```

The 15 current non-registering route entries are:

```text
/app/
/map/
/konfessii/
/konfessii/russkij-baptizm/
/karty/
/karty/avraam/
/karty/early-church/
/karty/ishod/
/karty/maccabim/
/karty/melachim/
/karty/pavel/
/karty/revelation/
/karty/shoftim/
/karty/shvatim/
/karty/yeshua/
```

This non-registration set is recorded as a coverage boundary, not automatically a Product defect: a root-scoped worker previously installed elsewhere can still control these pages, and no route-complete first-entry PWA-registration invariant has been established.

## Why the five URLs are semantically material

For one Service Worker scope, `register(scriptURL, {scope})` compares the incoming worker script URL against the existing newest worker's script URL. A different URL prevents the same-scriptURL fast path and participates in the Update algorithm; script URL inequality is itself update-significant even if fetched bytes are identical.

Therefore query-only differences such as:

```text
/sw.js?v=1
/sw.js?v=1781282355
```

are not merely cosmetic cache keys. They can create a new update/install lifecycle for the one registration at scope `/`.

## User-visible consequence

`sw-register.js` does not compare a release SHA/cache generation before announcing an update. It reacts to lifecycle signals:

- `updatefound -> installed` with an existing controller -> `Доступно обновление сайта`;
- `controllerchange` -> `Сайт обновлён`.

Thus route-local metadata can masquerade as Product release identity and trigger update/install work and update UI even though the deployed `sw.js` body did not represent a new release.

## Existing guard false-green

`scripts/audit-pro.js` G66 says, in substance, that `SITE_CONFIG.version` is not an actual cache-buster and that route placeholders such as `version: 1` are harmless.

That ownership model is false for current runtime because `js/sw-register.js` directly uses the value in the root worker script URL. Existing SW readiness/source checks verify registration mechanics but do not enumerate all registering route graphs and assert one release identity.

## Root cause

```text
route-local SITE_CONFIG.version
        -> shared sw-register.js
        -> one root scope gets route-dependent scriptURL
        -> Service Worker update/install semantics see identity change
        -> precache/skipWaiting/claim + updatefound/controllerchange lifecycle
```

This is **revision-authority conflation**: page/content metadata is acting as the release identity of a root-scoped lifecycle owner.

## Durable closure boundary

A future Product repair should establish one release-level root-worker identity authority rather than editing numeric literals route by route:

1. Every route that registers the root SW resolves the same worker script URL for one Product release.
2. Page-local metadata cannot alter root SW identity.
3. Real worker release identity changes exactly when intended.
4. A route-graph/build guard enumerates real registration owners, including indirect/generic runtime arrays, and asserts one resolved identity.
5. The guard asserts its own route census so a future scan cannot silently shrink coverage.
6. Browser evidence installs on route family A, navigates to B with different page metadata and identical worker body, and proves no release-update lifecycle occurs; then a real worker release proves one update.
7. Correct or retire G66's false statement about `SITE_CONFIG.version`.

## Audit self-correction boundary

The superseded `67/85` / `bare ×7` census had already passed AuditRepo structural validation. That is intentional evidence about evidence: repository CI can validate report shape and governance without proving the auditor's semantic import-graph model. The correction was made as soon as indirect `BaseLayout` ownership was found.

## What this report does not claim

- No duplicate registration on a single route: corrected census is **0/70**.
- No bare `/sw.js` identity among current registering Astro routes: corrected census is **0/70**.
- No claim that all 15 non-registering routes are broken first-entry PWA surfaces.
- No measured production frequency/performance budget failure.
- No Pagefind-freshness equivalence claim.
- No Product mutation is authorized by this evidence file.