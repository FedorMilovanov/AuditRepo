# SEARCH-LAZY-LOADER-FAILURE-STATE

## Classification

- Project: `gb-is-my-strength`
- Work unit: `SEARCH-LAZY-LOADER-FAILURE-STATE`
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Signal class: current Product resilience/state-machine defect + browser-contract gap
- Product mutation: none
- MASTER mutation: none
- Collision check: no open Product PR found for the MobileChrome/Search owner at recording time

## Finding

The shared `MobileChromePage` lazy Search loader has a terminal-state deadlock after one failed `search.js` request.

It uses two global state flags:

```text
__gbSearchLoading
__gbSearchBootRequested
```

On first click, when Search is not already ready:

```js
w.__gbSearchOpenAfterLoad = true;
if (w.__gbSearchLoading || w.__gbSearchBootRequested) return;
w.__gbSearchLoading = true;
w.__gbSearchBootRequested = true;
...
s.onload = () => { w.__gbSearchLoading = false; w.GBSearch?.open?.(); };
s.onerror = () => { w.__gbSearchLoading = false; };
```

`onerror` clears only `__gbSearchLoading`.

It never clears `__gbSearchBootRequested`.

Therefore after any transient script load failure:

```text
loading       = false
bootRequested = true
GBSearch      = absent/not ready
```

and every later click reaches:

```js
if (w.__gbSearchLoading || w.__gbSearchBootRequested) return;
```

so no retry script is ever appended.

The search button remains inert until a full document reload or some other independent loader path happens to recover the global state.

## Current route manifestation

A semantic import-graph census of the 85 Astro route entries found two current production routes where `MobileChromePage` is the **only** Search script loader in the route graph:

```text
/karty/
/konfessii/
```

Both route sources explicitly mount `MobileChromePage` through the mobile chrome registry.

### `/karty/`

`src/pages/karty/index.astro` imports and renders `MobileChromePage` around `KartyMain`.

### `/konfessii/`

`src/pages/konfessii/index.astro` imports and renders `MobileChromePage` around `KonfessiiPageChrome/KonfessiiMain`.

No second page-footer/BaseLayout Search loader exists in either effective route graph.

So on these routes the failure sequence is self-contained:

```text
user taps Search
→ MobileChromePage appends search.js
→ transient network/request failure
→ onerror: loading=false, bootRequested remains true

user taps Search again
→ GBSearch not ready
→ loading=false
→ bootRequested=true
→ guard returns
→ no request / no UI / no recovery
```

This does not depend on stale cache-bust hashes; current `search.js` revision authority is otherwise synchronized.

## Why other route families do not automatically remove the bug

Many older page footers have their own document-level lazy loader. Their retry guard usually checks only `__gbSearchLoading`, so a later click can make a fresh request after an error.

That accidental second-owner recovery does not repair `MobileChromePage` itself and does not exist on `/karty/` or `/konfessii/`.

`BaseLayout` also has an independent loader whose `u()` checks only loading state, but it is not part of these two route graphs. In mixed-owner routes, its exact event ordering is an additional reason to prefer one canonical loader state machine rather than relying on competing fallbacks.

## Existing browser-contract gap

Current `scripts/search-cold-bootstrap-browser-test.mjs` exercises cold-load behavior on:

```text
/articles/
/biografii/
/pastor-series/
```

and proves Search is not eager, then opens via interaction/shortcut.

It does not cover:

```text
/karty/
/konfessii/
```

and does not inject a failed `search.js` request followed by retry.

Other Search browser contracts test runtime query/index behavior after the Search runtime exists; Scripture failure injection targets the occurrence index, not the loader script itself.

Thus current CI can remain green while the loader's error terminal state is unrecoverable.

## Root cause

The two flags encode different concepts but are treated as one permanent exclusion condition:

```text
loading       = request currently in flight
bootRequested = a request has ever been requested / bootstrap ownership claimed
```

`bootRequested` is valid as a duplicate-owner suppression signal while a successful Search runtime is taking ownership. It is not a valid permanent reason to suppress retry after the request failed and no `GBSearch.__ready` owner exists.

The state machine has no explicit `failed`/retry transition.

## Durable closure boundary

A systemic repair should not add route-specific retries. Closure should prove one lazy Search loader contract:

1. One canonical owner for Search script loading across shared page/mobile chrome.
2. Explicit states such as `idle -> loading -> ready` and `loading -> failed -> loading`.
3. On script failure, all state that suppresses a new request is released unless a ready Search owner actually exists.
4. Concurrent clicks/keyboard/open events while one request is in flight still deduplicate to one network request.
5. A successful load still opens Search once when `__gbSearchOpenAfterLoad` is pending.
6. Browser contract includes `/karty/` and `/konfessii/` or a fixture using exactly `MobileChromePage` ownership:
   - first `search.js` request forced to fail;
   - assert no palette is falsely reported ready;
   - second user action triggers a second request;
   - second request succeeds;
   - palette opens and input receives focus;
   - no duplicate runtime/script after success.
7. Source contract rejects an error handler that clears `loading` but leaves a permanent boot-suppression flag with no ready owner.

## What this report does not claim

- No claim that Search normally fails to load on every visit.
- No claim current `search.js` hash is stale; independent revision census found it correct.
- No resurrection of the old closed `SEARCH-LAZY-LOADER-DRIFT` finding; that was revision/loader-source drift, while this is an error-state retry deadlock.
- No Product repair is opened by this AuditRepo evidence file.