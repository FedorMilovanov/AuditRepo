# SW-CACHE-TRANSACTION-GENERATION-GAP

## Classification

- Project: `gb-is-my-strength`
- Signal class: current Service Worker lifecycle/resilience defect + audit common-mode gap
- Disposition: second manifestation under the existing SW lifecycle/revision work unit; do **not** create a separate Product lane solely for this file
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none

## Finding

The current Service Worker install path treats `CACHE_STATIC` as though it were a generation-isolated staging cache, but the cache name is derived only from the long-lived `CACHE_VERSION`:

```js
const CACHE_VERSION = 'gb-v197-bible-legacy-authority-20260804';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
```

Install uses that cache directly:

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

So the failure rollback is safe only if an installing successor uses a cache namespace different from the currently active worker's static cache.

Current architecture does not guarantee that property. `CACHE_VERSION` remains v197 while Product source/worker registration identity can change independently, including through the route-dependent `sw.js?v=...` identities documented in `SW_SCRIPTURL_ROUTE_VERSION_CHURN.md`.

If a successor Service Worker is installed while using the **same `CACHE_STATIC` name** as the controlling worker and one precache request fails, the catch branch deletes the shared named cache. The successor then becomes redundant/fails installation, but the previously active worker remains the controller with its static fallback cache removed.

This is a generation-isolation violation:

```text
active worker generation A ─┐
                           ├─ same CACHE_STATIC name
installing generation B ───┘
          ↓
B precache failure
          ↓
caches.delete(CACHE_STATIC)
          ↓
B fails, A remains active
          ↓
A's static cache was also deleted
```

The issue is not that a failed worker activates — it does not. The issue is that failed staging work mutates/deletes state owned by the still-active generation.

## Current readiness guard encodes the unsafe assumption

`scripts/sw-dist-readiness-audit.js` explicitly requires this source shape and labels it:

```text
failed staging cache cleanup before rethrow
```

via a regex that demands:

```js
caches.delete(CACHE_STATIC)
...
throw error
```

The guard therefore treats `CACHE_STATIC` as “staging” without proving generation isolation.

It separately validates only that the source `CACHE_VERSION` matches `migration/sw-cache-version-baseline.json`.

Current baseline remains:

```json
{
  "captured": "2026-08-04",
  "lastReviewedDistProductionCacheVersion": "gb-v192-reader-state-20260724",
  "currentDistProductionCacheVersion": "gb-v197-bible-legacy-authority-20260804",
  "currentExpectedCacheVersion": "gb-v197-bible-legacy-authority-20260804"
}
```

The optional/deploy-switch “cache bump” check only rejects the worker when current version equals the old `lastReviewedDistProductionCacheVersion` (v192). It does **not** establish that every successor worker/update after v197 receives a fresh cache namespace.

No repository writer was found that advances `lastReviewedDistProductionCacheVersion` after each successful deployment. The file is an historical cutover baseline, not a per-release generation ledger.

## Browser contract proves a different, safer model

Current `scripts/sw-offline-browser-test.mjs` contains two relevant scenarios.

### Forced partial-precache failure

The test starts a **fresh browser context** with no active worker/controller, forces `/css/site.css` to return 503, registers the worker and asserts:

```text
worker state = redundant
active = false
controller = false
no cache name starting with currentVersion exists
```

It records:

```text
partial precache failure cannot activate — worker redundant; staged cache removed
```

This proves a failed *first install* cannot activate. It does not prove a failed successor preserves an already-active generation using the same cache name.

### Release update scenario

The test then intentionally creates generation isolation that current source does not inherently provide:

- server `state.release='old'` serves `sw.js` after replacing `currentVersion` with `oldVersion`;
- the old worker therefore owns `${oldVersion}-static`;
- server switches to new source with `currentVersion`;
- `registration.update()` installs the new generation;
- test asserts all oldVersion caches are deleted and `${currentVersion}-static` exists.

It reports:

```text
release update over old cache — old caches removed; new route response survives offline
```

That is a valid test for:

```text
old generation cache name != new generation cache name
```

It does not cover:

```text
old generation cache name == new generation cache name
+ successor install fails
```

which is precisely the current risk boundary when `CACHE_VERSION` is reused.

## Interaction with route-dependent SW script identity

The companion SW finding proves that 67 current Astro route graphs can register one root scope under at least five distinct script URLs in the same release because `SITE_CONFIG.version` is route-local.

Under Service Worker registration/update semantics, a changed script URL can cause a new update/install lifecycle even if the worker body is otherwise identical.

That fragmentation increases the number of lifecycle transitions that can encounter this non-generation-isolated install transaction. The two manifestations therefore belong under one broader root:

```text
root-scoped SW lifecycle has no single release/generation authority
```

Manifestation 1: route-local page metadata changes Service Worker script identity.

Manifestation 2: cache transaction rollback assumes a generation-isolated cache name that current source does not guarantee.

## Durable closure boundary

Do not close this merely by removing the catch cleanup or by bumping one literal once.

A systemic SW lifecycle repair should guarantee:

1. One release/generation authority owns the root worker script identity.
2. Installing generation B never mutates/deletes cache namespace still owned by active generation A.
3. Precache population is staged under a generation-specific name; activation performs the ownership switch/retirement only after full success.
4. Failed successor install leaves active worker + active caches byte-for-byte/entry-for-entry usable.
5. Browser contract adds an adversarial sequence:
   - install and control with generation A;
   - populate/verify A static fallback;
   - request successor B;
   - force one B precache asset failure;
   - assert B is redundant/not active;
   - assert A remains controller;
   - assert A's static cache and offline fallback remain present and functional;
   - then allow B to install successfully and assert one clean generation transition.
6. The readiness source guard must prove generation separation instead of requiring `caches.delete(CACHE_STATIC)` and labeling the shared name “staging.”
7. Keep the existing all-or-nothing precache intent and no-partial-activation rule.

## What this report does not claim

- No claim that a failed successor install was captured on production.
- No claim that `cache.addAll` should become fail-open; it should remain fail-closed.
- No claim that the currently active worker becomes redundant on successor failure; the risk is shared cache state deletion while the old worker remains active.
- No need for a separate work unit from `SW-SCRIPTURL-ROUTE-VERSION-CHURN`; both are manifestations of missing root-worker generation authority.
