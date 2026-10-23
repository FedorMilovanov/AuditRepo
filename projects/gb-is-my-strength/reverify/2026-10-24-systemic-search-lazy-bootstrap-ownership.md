# Systemic search lazy-bootstrap ownership — current receipt

Date: 2026-10-24  
Product anchor: `8d93fe4206e579e766727dbe865e0d07cf30d3c5` (`main`)  
Disposition: **consolidate one direct manifestation into one system verification lane** — `GBS-MOBILE-CHROME-SEARCH-TOUCH-LOAD-RACE` → `SYS-SEARCH-LAZY-BOOTSTRAP-OWNERSHIP`.  
Product mutation: none.

## Question

Is the confirmed HardTexts first-touch loss a route-local handler defect, or a manifestation of fragmented ownership of one search bootstrap state machine?

## Current ownership graph

Search acquisition is not owned by one executable primitive:

- 18 Astro component files carry inline `__gbSearchLazyBound` loaders;
- the rebuilt final artifact projects one such loader onto 83 of 105 routes;
- `MobileChromePage.astro` separately owns loading/boot/pending/terminal flags and script insertion on four catalog routes;
- `js/search.js` is both the full runtime and a bootstrap stub: when `__gbSearchBootRequested` is absent, its first evaluation installs a `GBSearch.__ready=false` stub and returns; a later request/evaluation installs the full palette;
- Home has another expanded loader variant with its own terminal handling.

Most copied inline loaders set `__gbSearchBootRequested=true` before loading `search.js`, so its first evaluation reaches the full runtime. HardTexts is the only current source variant that preloads on the first generic click/touch with `load(false)` and does **not** set that flag. On a first tap of MobileChrome Search, its document-level `touchstart` starts the shell-only evaluation; the later click records pending-open but sees the in-flight load and returns. The shell evaluation does not consume pending-open. A second activation drives the stub into the full runtime.

This is therefore a collision among copied bootstrap, shared script and MobileChrome state owners, not a search result or palette defect.

## Fresh current browser evidence

Chromium `153.0.8010.0`, rebuilt production-like Product `8d93fe42`, `/hard-texts/`, mobile/touch at 320×844 and 390×844. MobileChrome was exposed through non-touch wheel scrolling before the first touch. The `search.js` response was delayed 500 ms to make the already-proven in-flight ordering deterministic without changing application code.

At both widths, one trusted tap produced:

- one `search.js` request completed;
- no `.cp-backdrop.is-open`;
- `GBSearch.__ready === false`;
- `__gbSearchOpenAfterLoad === true`;
- focus remained on `.mcp-search`;
- zero page errors.

The second trusted tap opened the palette and focused `.cp-input` at both widths. This exactly reconfirms the existing direct manifestation on current main; the delay only controls network ordering and does not synthesize activation or force visibility.

## Existing protection is composition-blind

The mandatory `Search Cold Bootstrap Contract` is green but cannot catch this state:

- its browser routes are only `/articles/`, `/biografii/` and `/pastor-series/`;
- it tests Ctrl+K, not touchstart→click ordering;
- HardTexts source is absent from the workflow path filter;
- `search-loader-retry-contract-test.js` validates only the isolated `MobileChromePage.astro` terminal/error branches and currently passes.

None of these checks composes the HardTexts preloader, MobileChrome click owner and the two-stage `search.js` evaluator.

## Consolidation boundary

The existing direct row is absorbed without changing active-unit count. Historical `SEARCH-LAZY-LOADER-DRIFT` concerned revision/source drift and remains closed; this lane is the current open-intent and terminal-state ownership contract.

No universal failure is claimed across all 83 routes. The exact current user-visible failure remains bounded to HardTexts first touch with an already visible toolbar. The wider census establishes why route-local patching is fragile and what must be governed to prevent another variant.

## Bounded closure

Provide one shared bootstrap API/state owner for trigger, shortcut, preload and retry callers:

1. every open request survives an in-flight preload and is consumed exactly once when the full runtime becomes ready;
2. preload and open do not require two evaluations of the same script to reach readiness;
3. success, loaded-without-runtime and network failure have one terminal state and a retryable generation;
4. all 18 component copies are removed or reduced to declarative use of the shared owner;
5. the build fails when a new independent writer of the bootstrap globals appears;
6. browser coverage includes first pointer/touch/Enter/Ctrl+K, preload→open interleaving, failure→retry and warm reuse on all current shell families, including HardTexts and MobileChrome;
7. focus enters the palette on success and returns to the exact opener on close.

Do not solve this with a timeout, synthetic second click, eager global search load, or a HardTexts-only flag assignment without owner consolidation.

## Evidence

Compact receipt: `evidence/2026-10-24-systemic-search-lazy-bootstrap-ownership.jsonl`.
