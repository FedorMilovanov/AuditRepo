# SW-CACHE-TRANSACTION-GENERATION-GAP

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Service Worker lifecycle/resilience defect + audit common-mode gap
- Disposition: second manifestation under `SW-ROOT-GENERATION-AUTHORITY`; do **not** create a separate Product lane solely for this file
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none

## Finding

The current Service Worker install path treats `CACHE_STATIC` as though it were generation-isolated staging state, but the cache name is derived only from the long-lived source literal:

```js
const CACHE_VERSION = 'gb-v197-bible-legacy-authority-20260804';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
```

Install populates that cache directly and deletes it on any precache failure:

```js
const cache = await caches.open(CACHE_STATIC);
try {
  await cache.addAll(PRECACHE_ASSETS);
} catch (error) {
  await caches.delete(CACHE_STATIC);
  throw error;
}
await self.skipWaiting();
```

That rollback is safe only when an installing successor uses a cache namespace distinct from the currently active worker's static cache.

Current architecture does not guarantee that property. `CACHE_VERSION` remains `v197` while the root worker can enter update/install lifecycle independently of that cache name. The companion corrected semantic census in `SW_SCRIPTURL_ROUTE_VERSION_CHURN.md` shows **70/85** Astro routes register one root scope under **five** distinct script URLs in the same release:

```text
/sw.js?v=1                   x25
/sw.js?v=1781282355          x22
/sw.js?v=1778943682          x19
/sw.js?v=20260802            x2
/sw.js?v=c7f8b6e9            x2
```

There are no current bare `/sw.js` registering routes and no duplicate registration owners on one route; those older census claims were corrected after resolving indirect `BaseLayout` ownership.

A scriptURL change can cause a successor update/install while `CACHE_VERSION` remains unchanged. If that successor's precache fails, its catch deletes the same named `CACHE_STATIC` cache that the still-active controller uses.

```text
active worker generation A ----┐
                               ├-- same CACHE_STATIC name
installing generation B -------┘
             |
B precache failure
             |
caches.delete(CACHE_STATIC)
             |
B fails/redundant, A remains active
             |
A's static fallback cache was also removed
```

The defect is not failed-worker activation. The defect is **failed staging work mutating/deleting active-generation state**.

## Current readiness guard encodes the unsafe assumption

`scripts/sw-dist-readiness-audit.js` requires the `caches.delete(CACHE_STATIC) ... throw error` shape and labels it failed **staging cache cleanup**.

But the guard proves only that source `CACHE_VERSION` matches the migration baseline; it does not prove that `CACHE_STATIC` belongs only to the installing generation.

Current baseline remains an historical cutover relationship (`v192 -> v197`), not a per-successful-release generation ledger. The deploy-switch check can continue to say a bump exists relative to v192 even after multiple later release/update paths reuse v197.

## Browser contract proves a different, safer model

Current `scripts/sw-offline-browser-test.mjs` contains two useful scenarios that do not close this case.

### Forced partial-precache failure

The test starts from a fresh context with no active controller, forces a precache asset failure, and asserts the worker becomes redundant and the current-version cache disappears.

That proves a failed **first install** cannot activate. It does not prove a failed successor preserves an already-active worker using the same cache name.

### Release update

The test deliberately replaces the source `CACHE_VERSION` for the old worker with `oldVersion`, then serves the new worker with `currentVersion` and verifies old-version caches retire after a successful update.

That proves the safe model:

```text
old generation cache name != new generation cache name
```

It does not cover:

```text
old generation cache name == new generation cache name
+ successor install fails
```

which is the current generation-isolation gap.

## System root relationship

The two SW manifestations belong together:

1. **Identity fragmentation:** route-local `SITE_CONFIG.version` creates five script URLs for one root registration in one release.
2. **Transaction non-isolation:** failed successor install can delete a cache namespace still owned by the active worker because cache generation is not tied safely to worker generation.

Together they show that the root-scoped SW lifecycle has no single release/generation authority.

## Durable closure boundary

A systemic repair should guarantee:

1. One release authority owns the root worker identity.
2. Installing generation B cannot mutate/delete cache namespace owned by active generation A.
3. Precache population is staged under a generation-specific namespace; ownership switch/old-cache retirement occurs only after complete success.
4. Failed successor install leaves active worker + active caches usable.
5. Browser contract adds the missing adversarial sequence:
   - install/control generation A;
   - verify A static/offline cache;
   - request successor B with the production-equivalent same-cache collision condition;
   - force one B precache failure;
   - assert B fails, A remains controller, and A cache/offline fallback survives;
   - then permit a valid B and prove one clean transition.
6. Readiness guard proves generation separation instead of merely requiring deletion of a cache it calls “staging”.
7. Keep fail-closed all-or-nothing precache intent.

## What this report does not claim

- No production failed-successor incident was captured.
- No claim `cache.addAll` should become fail-open.
- No claim the active worker itself becomes redundant on successor failure.
- No separate work unit from the SW identity finding.
- No Product mutation is authorized by this evidence file.