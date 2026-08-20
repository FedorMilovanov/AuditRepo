# SW-REVISIONED-CANONICAL-DOWNGRADE

## Classification

- Parent work unit: `SW-ROOT-GENERATION-AUTHORITY`
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Signal class: current offline/update freshness mechanism + browser/readiness common-mode gap
- Product mutation: none
- MASTER mutation: none
- Recommended synthesis: absorb the older `SW-PWA-FRESHNESS` residual into the broader SW generation authority package.

## Finding

Current pages deliberately request static runtime assets with content revisions such as:

```text
/js/site-utils.js?v=661c6cc1
/js/reader-preferences.js?v=63b588b5
/css/site.css?v=d1015157
```

The Service Worker correctly treats revisioned static requests as network-first, but its offline/failure fallback deliberately **drops the revision query**:

```js
async function revisionedStaticNetworkFirst(request) {
  const cache = await caches.open(CACHE_STATIC);
  try {
    const response = await fetch(request);
    if (cacheable(response)) await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const exact = await cache.match(request);
    if (exact) return exact;
    const url = new URL(request.url);
    const canonical = await cache.match(canonicalUrl(url));
    if (canonical) return canonical;
    throw error;
  }
}
```

Install simultaneously precaches unversioned canonical assets such as:

```text
/js/site-utils.js
/js/reader-preferences.js
/css/site.css
```

Therefore the revision hash is not an invariant during fallback. A request for `asset?v=B` may receive cached canonical bytes from generation A.

## Cross-generation failure sequence

The existing same-generation offline test is safe only because it assumes the canonical precache represents the same release as the requesting page.

A normal update/partial-connectivity boundary can violate that assumption:

```text
1. Service Worker generation A controls the page.
2. A's CACHE_STATIC contains bare /js/foo.js with A bytes.
3. Navigation is network-first and successfully receives new release-B HTML.
4. B HTML requests /js/foo.js?v=B_HASH.
5. A is still the controlling worker while update/install/controllerchange is pending or has not happened.
6. Network fails for that subresource.
7. revisionedStaticNetworkFirst():
     exact /js/foo.js?v=B_HASH -> MISS
     canonical /js/foo.js     -> HIT (A bytes)
8. New release-B document executes release-A runtime bytes.
```

The query hash therefore stops proving byte identity precisely at the offline/update boundary where it matters most.

This does not require a permanently offline user. A successful navigation followed by a transient subresource failure is sufficient.

## Current blast radius

Current `PRECACHE_ASSETS` contains **30** entries.

An exact current-equivalent intersection against `src/lib/asset-version.js` finds **26 / 30** precache entries that are also managed by content revision hashes:

```text
/css/site.css
/css/home.css
/css/command-palette.css
/css/mobile-hotfix.css
/css/nagornaya-mobile-toc.css
/css/floating-cluster.css
/css/series-samizdat.css
/css/reader-preferences.css
/css/enhancements-runtime.css
/css/highlights-runtime.css
/css/sw-toast.css
/fonts/fonts.css
/nagornaya/tw.min.css
/js/nagornaya-bar-extras.js
/js/site.js
/js/site-utils.js
/js/scroll-perf.js
/js/bookmark-engine.js
/js/enhancements.js
/js/highlights.js
/js/sw-register.js
/js/nagornaya-mobile-toc.js
/js/floating-cluster-controller.js
/js/reader-preferences-head.js
/js/reader-preferences.js
/js/reader-state.js
```

Not every route loads every asset, but the fallback policy is class-wide, not specific to `reader-preferences.js`.

## Existing guards bless the same unsafe assumption

### Source/readiness guard

`scripts/sw-dist-readiness-audit.js` explicitly requires the revisioned strategy and requires a `canonicalUrl(url)` fallback, describing it as:

```text
canonical precache fallback
```

So the guard does not merely miss the behavior; it requires it.

### Browser contract

`scripts/sw-offline-browser-test.mjs` installs one fixture generation, goes offline, requests:

```text
/js/site-utils.js?v=a07-offline
```

and expects `200`, reporting:

```text
revisioned static offline fallback — exact miss resolved through canonical current precache
```

That is valid as a **same-generation** offline convenience test.

It does not exercise:

```text
A controls + A canonical cache
B HTML/revision URL
asset network failure before B becomes controller
```

Nor does it assert that returned bytes match the requested revision hash.

This is a common-mode oracle gap: source guard and browser test both treat canonical fallback as inherently current without proving generation equivalence.

## Relationship to the other SW manifestations

This strengthens one root rather than creating another row:

1. `SW_SCRIPTURL_ROUTE_VERSION_CHURN.md` — root worker identity is route-dependent (70 registering routes, five script identities).
2. `SW_CACHE_TRANSACTION_GENERATION_GAP.md` — failed successor staging can delete cache state still owned by the active generation.
3. **This file** — revisioned subresource fallback can cross generation boundaries by dropping the requested hash and serving canonical active-generation bytes.

All three arise because worker identity, cache generation and asset revision are governed by different authorities.

## Relationship to old `SW-PWA-FRESHNESS`

The old residual focused narrowly on a bare precache entry such as `/js/reader-preferences.js` and an unversioned request reaching cache-first stale state.

The current mechanism is broader and stronger:

- the caller may correctly request a revisioned `?v=...` URL;
- the worker itself discards that revision on fallback;
- the class affects 26 revision-managed precache assets;
- safety depends on an unproved assumption that canonical cache generation equals document/revision generation.

Verifier should therefore prefer one `SW-ROOT-GENERATION-AUTHORITY` package and absorb the narrow old residual rather than count both.

## Durable closure boundary

A systemic repair needs an explicit generation contract. Options may differ, but closure must prove:

1. A revisioned request never receives bytes from a different revision/generation merely because network failed.
2. Exact revision cache identity is preserved for revisioned assets, or any canonical fallback is cryptographically/build-proven equivalent to the requested revision.
3. A controlled generation-A page that successfully receives generation-B HTML cannot silently execute A runtime under a B revision URL.
4. Browser test adds the adversarial cross-generation sequence with distinguishable A/B asset bytes and a forced B subresource failure.
5. The test asserts **body identity**, not only HTTP 200/length.
6. Readiness guard stops requiring canonical fallback unless generation equivalence is itself proven.
7. Offline availability remains honest: if the exact requested revision was never cached and no equivalent generation can be proven, a controlled failure is preferable to executing mismatched runtime.

## What this report does not claim

- No claim that every offline request today returns stale bytes.
- No claim that canonical fallback is always wrong within one generation.
- No captured production incident is required for the algorithmic cross-generation defect.
- No Product mutation is performed by this evidence.