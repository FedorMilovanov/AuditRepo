# TLP-A11Y-STATUS-001 — terminal closure

**Status:** `CLOSED-BY-FIX`

## Product authority

- Product repository: `FedorMilovanov/TheLegendaryPoet`
- Product PR: `#437` — `fix(a11y): make poets result changes a stable polite status`
- certified exact head: `c84de737a6fbe57c76129b9ae2a373d109662d75`
- squash merge on `main`: `45c5ef403a7aa7b1697c132beac298d975af1db9`
- Product base at certification: `62c580c5e4577b8475865638e614be4c91279d51`

## Root cause

`/poets` visibly updated its result count and zero-result state as the reader changed search or filters, but the count had no stable status/live semantics. A screen-reader user could therefore keep focus in the active control while meaningful result changes occurred without one authoritative polite announcement target.

## Repair proved

Product #437:

1. made the existing visible result count the single `role="status"` owner;
2. added `aria-live="polite"` and `aria-atomic="true"` to that stable owner;
3. deliberately kept the zero-result copy non-live so the same transition does not generate competing announcements;
4. added `qa/poets-status.spec.mjs` to prove one status owner, one-result/zero-result/restored-result updates and preserved search focus;
5. wired that regression into the canonical Chromium/Android browser list and the fresh-process base iPhone Safari suite.

## Certification failure was not bypassed

The first browser-certified head exposed a real harness-inventory defect: the new regression passed Chromium/Android but the isolated iPhone Safari runner returned `No tests found` because `playwright.config.mjs` did not include `poets-status` in the shared mobile-spec allowlist. The PR was not merged or waived. The shared browser inventory and isolated WebKit suite were repaired, producing the final certified head above.

## Exact-head evidence

All pull-request workflows observed on exact head `c84de737...` reached terminal success before merge:

- `CI` — success, including typecheck, production build, budgets, prerender and SEO verification;
- `Manual Browser QA` — success: `browser-qa`, `webkit-home-reveal-qa`, `premium-home-qa` and `premium-iphone-critical-qa` all terminal green; the core job passed Chromium/Android and fresh-process base iPhone Safari;
- `Site route integrity audit` — success;
- `Project contracts` — success;
- `Articles catalog acceptance` — success;
- `Yesenin Part I browser acceptance` — success;
- `Brand raster QA` — success;
- `Brand deep reference and motion audit` — success.

`Request Pages deployment` was expectedly skipped for the pull-request head and is not a failure. Inline review threads were empty before merge. The merge used the exact expected head SHA, so no stale-head evidence was accepted.

## Closure boundary

This closes only `TLP-A11Y-STATUS-001`. It does not close `TLP-A11Y-RUNTIME-001`, `TLP-A11Y-MOTION-001` or the broader `TLP-AUDIT-004`; those retain independent root causes and terminal outcomes.

## Disposition

`TLP-A11Y-STATUS-001` is retired from `verified/MASTER_BUG_MATRIX.md`.
