# TLP-RESILIENCE-001 verification — browser essay payload recovery

Date: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #351  
Source anchor: `4affe36ab3a63b7759144d7342406ffed439c02c`  
AuditRepo row: `TLP-RESILIENCE-001`

## Disposition

**VERIFIED-CURRENT / repair-ready / P2.**

The browser essay payload architecture introduced by Product PR #350 remains the intended architecture and is not being reverted. The current defect is a bounded resilience integration problem inside that architecture: noncritical browser essay metadata can own the whole homepage render, while transient catalog/body failures remain cached as rejected promises for the lifetime of the SPA document.

This is not an architecture lane. The repair must preserve target-scoped generated payloads and the bundle reduction from #350.

## Current-source evidence

### 1. Rejected catalog promise is permanently memoized

`src/data/essays/browserEssayData.ts` owns module-level state:

- `let catalogPromise: Promise<readonly EssaySummary[]> | undefined`;
- `const essayPromises = new Map<string, Promise<Essay | undefined>>()`.

`getBrowserEssayCatalog()` assigns the production `catalog.json` fetch through `catalogPromise ??= ...`. There is no rejection handler that clears the memoized promise. If that request rejects, every later call in the same document receives the same rejected promise and performs no new network request.

### 2. Rejected per-slug promise is permanently memoized

`getBrowserEssayBySlug(slug)` returns an existing entry from `essayPromises` and stores each new production request with `essayPromises.set(slug, request)`. There is no rejection-time deletion. A transient failure for a valid essay body therefore poisons that slug for the rest of the SPA document.

Successful single-flight caching is useful and should remain. The defect is specifically that failed work is cached as final state.

### 3. The homepage makes noncritical catalog data route-critical

`src/pages/HomePage.tsx` calls `use(getBrowserEssayCatalog())` at the top of `HomePage`. The resulting value is used there only for `essayCatalog.length`, passed into the statistics section as the count of large studies.

The Hero, navigation calls-to-action, featured poets, quotation and other static homepage content do not require the essay catalog, yet all of them are downstream of the route-level `use()` suspension.

A delayed or failed `/data/essays/catalog.json` request therefore delays or errors the entire homepage instead of only the one catalog-dependent statistic.

### 4. Existing route boundary cannot perform an SPA retry

`src/App.tsx` wraps the entire route outlet in one page ErrorBoundary and one route-level Suspense fallback. `src/components/ErrorBoundary.tsx` can reset its visual error state when the pathname changes, but its explicit recovery action is a full `window.location.reload()`.

Changing route and returning can reset the ErrorBoundary component state, but it cannot clear the module-level rejected promise in `browserEssayData.ts`. The same rejected promise is consumed again immediately.

### 5. Existing guards do not cover this failure mode

`scripts/validate-essay-browser-data.ts` proves:

- generated payload parity with canonical published essays;
- exact expected payload filenames;
- no eager full-corpus browser import;
- expected browser consumers use the browser adapter.

Those are valuable #350 contracts, but they do not exercise network failure, promise eviction or retry semantics.

The existing route/browser suites verify happy-path direct links, target-scoped requests, honest unknown slugs and broad browser behavior. They do not inject a transient first failure and then prove recovery in the same SPA document, nor do they prove the homepage Hero is independent of `catalog.json` availability.

## Deterministic reproduction model

### Catalog poison

1. Open a production-style route that calls `getBrowserEssayCatalog()`.
2. Make the first `/data/essays/catalog.json` request fail or abort.
3. The promise rejects and remains assigned to `catalogPromise`.
4. The route-level ErrorBoundary catches the render error.
5. Navigate to another pathname so the ErrorBoundary resets, then return without reloading the document.
6. `getBrowserEssayCatalog()` returns the already-rejected `catalogPromise`.
7. No fresh catalog request is issued; the route fails again.

### Essay-body poison

1. Ensure the catalog can load.
2. Open a valid `/essays/:slug` and fail the first body JSON request.
3. The rejected request remains stored under that slug in `essayPromises`.
4. Navigate away and revisit the same slug in the same document.
5. `getBrowserEssayBySlug(slug)` returns the same rejected promise; no fresh body request is issued.

### Homepage availability regression

1. Open `/` in production mode with `/data/essays/catalog.json` delayed or failed.
2. `HomePage` suspends at its top-level `use()` before returning Hero/static content.
3. The route-wide Suspense shell or ErrorBoundary owns the whole page although only the essay-count statistic needs the catalog.

## Severity rationale

**P2** is appropriate because the defect can turn a transient same-origin data request problem into whole-route unavailability and can strand the affected route for the rest of the SPA session until a hard reload. The homepage impact is disproportionate to the data dependency: a noncritical statistics count can block the project’s primary landing experience.

There is no evidence of data corruption, security impact or irreversible persistence loss. A document reload can recover once the network/deployment condition is healthy, so this is not P0/P1.

## Required repair boundary

### Adapter recovery

- clear `catalogPromise` when the currently memoized catalog request rejects;
- remove a slug from `essayPromises` when the currently memoized request for that slug rejects;
- later calls in the same document must be able to issue a fresh request after failure;
- successful promises remain cached and single-flight.

The eviction must be identity-safe so an older rejected request cannot clear a newer in-flight/successful request.

### Homepage isolation

- Hero and other static homepage content must render without waiting for the essay catalog;
- only the essay-dependent statistic/section may own asynchronous catalog loading or a bounded fallback;
- a catalog failure must not replace the entire homepage with the page ErrorBoundary;
- do not hardcode the essay count as a substitute for correct ownership.

### Preserve #350 architecture

- no eager browser import of `src/data/essays/index.ts` or individual full essay bodies;
- `/articles` still needs only the lightweight catalog;
- `/essays/:slug` still needs only the catalog plus the requested body;
- unknown valid slugs remain the existing honest article-not-found state;
- development continues to use live canonical authoring data;
- no bundle-budget increase or duplicate content source.

## Required regression witnesses

Deterministic tests must prove all of the following:

1. first production-style catalog request fails; a later same-document attempt issues a new request and can succeed;
2. first valid essay body request fails; revisiting the same slug in the SPA issues a new request and can succeed;
3. homepage Hero/static content remains available while catalog loading is delayed or fails, with only a bounded essay-count fallback;
4. successful catalog and body requests remain single-flight cached;
5. #350 target-scoped request topology remains green;
6. unknown valid essay slugs retain the current not-found/`noindex` behavior.

## Validation gates

Product repair is not closure-ready until one exact PR head passes:

- `npm ci`;
- `npm run validate:essay-browser-data`;
- full `npm run check`;
- production build and existing budgets without increases;
- route integrity;
- Articles catalog and essay payload-targeting acceptance;
- Manual Browser QA including Chromium/Android, desktop WebKit and fresh-process iPhone Safari.

## Matrix effect

The previously clean current engineering matrix moves from `0` to `1` active row:

- P0: `0`;
- P1: `0`;
- P2: `1` — `TLP-RESILIENCE-001`;
- P3: `0`;
- total active engineering rows: `1`;
- registered Product architecture lanes: `0`.

## Closure rule

After the Product fix is merged and reverified on the resulting source head, AuditRepo must remove `TLP-RESILIENCE-001` from the active matrix and retain this report plus the final repair evidence as durable history. Fresh bug hunting resumes only from current-head evidence rather than replaying historical rows.
