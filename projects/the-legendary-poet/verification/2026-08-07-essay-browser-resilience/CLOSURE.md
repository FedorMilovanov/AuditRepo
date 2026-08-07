# TLP-RESILIENCE-001 closure — browser essay payload recovery

Date: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #351  
Product repair: PR #353  
Exact tested Product head: `c72ca2bd54b9a3ed18b116e2530e17691517054d`  
Product squash merge: `67d614bc186b52c408ad6cef4c84cf57d4e78a45`  
AuditRepo row: `TLP-RESILIENCE-001`

## Disposition

**CLOSED-BY-FIX / P2 removed from active engineering matrix.**

The target-scoped browser essay payload architecture introduced by Product #350 remains in place. The repair did not restore eager full-corpus browser imports, duplicate content ownership, hardcoded essay counts or larger JavaScript budgets.

## Root-cause repair

The earlier failed implementation attempt synchronously evicted a rejected promise. Under React Suspense that allowed the same failed render to call the getter again and start request #2 before the user performed a later navigation. The acceptance test briefly masked that behavior by accepting the immediate second request; that false-green witness was rejected during review.

The final repair instead gives each cache entry an explicit `pending | fulfilled | rejected` state plus the set of React Router `location.key` visit identities that already waited on it:

- pending work stays single-flight across concurrent consumers;
- fulfilled payloads remain cached;
- a rejected payload remains the stable rejected promise for the same visit, preventing an automatic same-visit retry loop;
- a genuinely later SPA navigation with a new `location.key` may start exactly one fresh request;
- Home no longer makes `catalog.json` route-critical merely to compute the research-count statistic; a catalog failure is localized to that statistic with a bounded `—` fallback while Hero/static content remains available.

## Deterministic regression witness

Articles catalog acceptance on the exact final head passed **18/18** across Chromium, Android Pixel 7 and iPhone Safari. The suite now proves all of these boundaries directly:

1. homepage catalog `503` leaves the page usable, issues one request only, does not enter a page ErrorBoundary, and retries only after a later SPA return;
2. `/articles` catalog `503` reaches a stable ErrorBoundary with no automatic request #2; a later SPA visit performs request #2 and recovers;
3. a valid essay-body `503` reaches a stable ErrorBoundary with body request count `1`; revisiting the same slug under a new navigation key performs request #2 and recovers;
4. successful catalog/body payloads remain cached on later visits;
5. all recovery scenarios preserve `documentRequests === 1`, proving same-document SPA recovery rather than hard reload;
6. target-scoped request topology and honest unknown-slug behavior remain intact.

## Exact-head Product gates

On `c72ca2bd54b9a3ed18b116e2530e17691517054d`:

- project/content/publication contracts: green;
- TypeScript / full CI / production build / prerender / SEO / existing budgets: green;
- route integrity: green;
- Articles catalog acceptance: green, 18/18 across Chromium/Android/iPhone;
- Manual Browser QA: **4/4 green** — Chromium/Android, fresh-process base iPhone Safari, critical iPhone/reduced-motion and desktop WebKit/home reveal;
- the earlier WebKit first-attempt opacity flake did not reproduce on the refreshed base, so no reveal timing, opacity threshold or arbitrary sleep workaround was added;
- final PR review-thread/review surface was empty and the PR remained mergeable on the exact tested head.

PR #353 was then squash-merged with expected-head protection as `67d614bc186b52c408ad6cef4c84cf57d4e78a45`; Product #351 closed automatically as completed.

## Matrix effect

Current verified engineering rows after this closure:

- P0: `0`;
- P1: `0`;
- P2: `0`;
- P3: `0`;
- total active engineering rows: `0`;
- registered Product architecture lanes: `0`.

Fresh engineering bug hunting resumes only from new current-head evidence. Editorial/research work such as Yesenin Part II #269 remains outside the engineering bug matrix unless a new independently reproduced engineering defect is found.

## Durable evidence

- activation/root-cause report: `REPORT.md`;
- final Product PR: #353;
- exact tested head: `c72ca2bd54b9a3ed18b116e2530e17691517054d`;
- Product merge: `67d614bc186b52c408ad6cef4c84cf57d4e78a45`.
