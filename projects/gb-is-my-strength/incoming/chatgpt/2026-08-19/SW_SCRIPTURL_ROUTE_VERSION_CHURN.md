# SW-SCRIPTURL-ROUTE-VERSION-CHURN

## Classification

- Project: `gb-is-my-strength`
- Signal class: Product runtime ownership + audit-harness false-green
- Proof state: current-source + normative algorithm witness; unrestricted browser lifecycle capture not available in this environment
- Audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Product mutation: none
- MASTER mutation: none
- Suggested themes: `ST-CACHE`, `ST-AUDIT-HARNESS`, `ST-SOURCE-GUARD-CLOSURE`

## Finding

The root service worker registration uses **page-local `window.SITE_CONFIG.version` as part of the service-worker script URL** while all affected pages register the same root scope `/`:

```js
var siteVersion = window.SITE_CONFIG && window.SITE_CONFIG.version || '';
var workerUrl = '/sw.js' + (siteVersion ? '?v=' + encodeURIComponent(siteVersion) : '');
navigator.serviceWorker.register(workerUrl, { scope: '/' });
```

`SITE_CONFIG.version` is not release-global. Current route families that definitely load `js/sw-register.js` publish incompatible values, for example:

| Route family | Current source owner | `SITE_CONFIG.version` | SW registration loader |
|---|---|---:|---|
| `/` | `src/components/home/HomePageChrome.astro` | `1778943682` | `./js/sw-register.js?v=e61e1210` |
| `/rodosloviye/` | `src/components/rodosloviye/RodosloviyeBody.astro` | `1` | `/js/sw-register.js?v=e61e1210` |
| `/baptisty-rossii/` | `BaptistyRossiiPageHead.astro` + `BaptistyRossiiBookLanding.astro` | `1781282355` | `../js/sw-register.js?v=e61e1210` |

Therefore a client can register, for the **same scope `/` and same deployed `sw.js` bytes**, different script URLs merely by navigating across route families:

```text
/sw.js?v=1778943682
/sw.js?v=1
/sw.js?v=1781282355
```

This makes route metadata participate in root Service Worker identity.

## Why query-only differences are semantically material

The current Service Workers specification states that `register(scriptURL, options)` creates or updates the registration for a scope. In the Register algorithm, the existing-registration fast path requires the incoming job script URL to equal the newest worker script URL. If that equality does not hold, the algorithm proceeds to Update.

In Update, `hasUpdatedResources` is set to true when the newest worker's script URL is not the fetched URL, independently of whether the response body is byte-for-byte identical. When updated resources are true, a new Service Worker is created and the Install algorithm is invoked.

Primary authority:

- Service Workers Nightly: `https://w3c.github.io/ServiceWorker/`
- Register algorithm: current lines around 2690–2704
- Update resource identity: current lines around 2812–2817
- new worker → Install: current lines around 2859–2884

The query component is part of the script URL, so the three URLs above are distinct Service Worker script URLs.

## Product consequence from current source

The current `sw.js` install/activate policy makes such an update non-trivial:

- `install` opens `CACHE_STATIC`, runs `cache.addAll(PRECACHE_ASSETS)`, then `skipWaiting()`;
- `activate` deletes obsolete governed caches, calls `clients.claim()`, then broadcasts `GB_SW_ACTIVATED`;
- `sw-register.js` listens for `registration.updatefound`; when an installing worker reaches `installed` with a pre-existing controller it displays `Доступно обновление сайта`;
- `controllerchange` can display `Сайт обновлён`.

Thus route-local scriptURL drift can cause update/install work and user-facing update lifecycle signals without a Product release. This report does not quantify frequency or network cost because unrestricted browser navigation is blocked in the audit environment; the mechanism itself is source + specification proven.

## Existing guard false-green

The repository already has a guard that explicitly teaches the opposite ownership model.

`scripts/audit-pro.js` G66 says:

```text
INFO only: SITE_CONFIG.version is NOT the actual cache-buster
(that's done via ?v=hash on URLs). Many articles have version: 1 as
placeholder and that's fine.
```

That statement is false for current runtime ownership:

1. `js/sw-register.js` uses `SITE_CONFIG.version` directly in `/sw.js?v=...`;
2. `js/enhancements.js` uses it in `/css/enhancements-runtime.css?v=...`;
3. other runtime code also consumes it as a revision value.

For the Service Worker case, it is more than a cache-key cosmetic: it participates in the registration's script URL.

Other existing SW contracts do not close this class:

- `scripts/sw-dist-readiness-audit.js` verifies that `sw-register.js` calls `navigator.serviceWorker.register(workerUrl, { scope: '/' })`, but does not prove that all SW-registering public route families resolve the same `workerUrl` for one release;
- `scripts/sw-offline-browser-test.mjs` deliberately registers fixed fixture URLs and tests offline/update behavior, but does not navigate between two product pages whose `SITE_CONFIG.version` values differ while the deployed worker bytes stay constant;
- the existing `SW-PWA-FRESHNESS` MASTER residual concerns unversioned cache requests and is a different mechanism;
- the parked `PAGEFIND-STATIC-FRESHNESS-MEASUREMENT` concerns Pagefind loader/index freshness and is also distinct.

## Root cause

```text
page-local SITE_CONFIG.version
        ↓
shared sw-register.js treats it as SW script revision
        ↓
root scope / receives route-dependent scriptURL
        ↓
Service Worker registration algorithm sees URL identity change
        ↓
Update → hasUpdatedResources=true → Install
        ↓
precache/skipWaiting/claim/updatefound/controllerchange lifecycle
        ↓
route navigation can masquerade as a software release
```

The architectural error is **revision-authority conflation**. A page/content metadata field is being used as the release identity of a root-scoped lifecycle owner.

## Suggested closure boundary for a future owned Product lane

Do not repair this by normalizing the current numeric literals one by one. A durable closure should establish one release-level Service Worker identity authority.

Minimum properties:

1. Every current public route that registers the root SW resolves the same SW `scriptURL` for the same Product release.
2. Page-local metadata/revision values cannot alter root SW identity.
3. A real worker release changes that identity exactly when intended, or the application relies on byte/update semantics with a stable script URL — but not route-local values.
4. Add a class-level source/build guard enumerating all SW-registering route families and asserting one resolved root-worker identity.
5. Add an adversarial browser witness: install on route family A, navigate to route family B with deliberately different page metadata but identical `sw.js`, and assert no Product-update lifecycle (`updatefound`/new install/controller replacement/update toast) occurs; then mutate the real release authority and prove exactly one update occurs.
6. Preserve offline behavior and real release freshness.
7. Correct or retire G66's statement that `SITE_CONFIG.version` is not an actual cache-buster/identity input.

## Collision boundary

At recording time there is no open Product PR found for `service worker` or `sw`. This evidence package still opens no Product repair; it is intended for verifier admission/synthesis first.

## What this report does not claim

- No measured production frequency or performance budget failure.
- No claim that every route sets a distinct version.
- No claim that Pagefind freshness is the same defect.
- No claim that a single registration call with a stable URL is problematic.
- No Product mutation is authorized by this evidence file alone.
