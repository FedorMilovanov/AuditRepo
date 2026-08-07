# TLP-AUDIT-003 Closure — semantic runtime guard hardening

Date: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
AuditRepo row: `TLP-AUDIT-003`  
Product issue: #340  
Product PR: #345

## Disposition

**CLOSED-BY-FIX / exact-head source + browser verified.**

The selected current manifestation of `ST-TLP-AUDIT-HARNESS` is closed. High-risk app-shell and document-scroll source contracts no longer depend on the selected exact source spellings where equivalent refactors or alternate forbidden syntax could create false failures or false passes.

This is a bounded harness repair, not a Product runtime regression claim and not a new architecture lane.

## Product repair

Product PR #345 added one small TypeScript-AST source-contract helper and hardened the selected app-shell/document-scroll guards while leaving Product runtime behavior unchanged.

The retained contracts include:

- no global Lenis/document scroller ownership;
- no wheel interception;
- no `preventDefault` cancellation of native document movement;
- explicit `tlp-scroll-top` command ownership;
- passive native scroll observers;
- ReadingProgress RAF coalescing and cancellation;
- SPA focus settlement with `preventScroll: true`.

Mutation fixtures prove that equivalent extracted event/options syntax remains acceptable while materially unsafe alternatives are rejected.

## Review discoveries fixed before merge

Independent review of the initial AST helper found two additional defects inside the harness implementation itself. Both were repaired before closure:

1. **Object spread precedence.** An options object such as `{ passive: true, ...unsafeOptions }` can be overridden to `passive: false`. The first implementation returned the first direct property and could false-pass the unsafe later spread. The final helper evaluates properties/spreads left-to-right with JavaScript last-write-wins semantics and includes both unsafe-later-spread and safe-later-explicit mutation witnesses.
2. **Lexical const shadowing.** The first implementation collected one global map of const bindings, so an unrelated later `const passive = false` in another function could shadow a safe local `const passive = true` and create a false failure. The final resolver selects the nearest lexical binding and includes a dedicated cross-scope mutation witness.

## Exact-head evidence

Exact tested Product head:

`c7b1c9e8dfe26028d1d52852f3e1db20ba2b6407`

Observed successful runs on that exact head:

- CI run `31193878514`: full verify job success, including app-shell invariants, interaction runtime, hover/compositor, route architecture, typecheck, build, asset budgets, prerender and SEO/discovery.
- Project contracts run `31193878626`: success.
- Brand deep reference and motion audit run `31193878503`: success.
- Site route integrity audit run `31193878697`: success, including production build and 35+ URL crawl.
- Manual Browser QA run `31193878516`: **4/4 jobs success**.
  - critical iPhone first viewport + reduced motion: success;
  - desktop WebKit home reveal/route: success;
  - premium homepage/pointer-performance matrix: success;
  - core Chromium + Android Chrome + fresh-process base iPhone Safari: success.

The exact PR head did not move after these gates and the Product base remained `9ac572ef4219a69a93a6e62a545ce3c6e0198c37` through the merge preflight.

## Merge evidence

Product PR #345 was squash-merged with an expected-head guard.

Squash merge:

`b6f731263211208a31de1e36ed7830d7a46ffa87`

Product issue #340 then reported `closed / completed`.

## Matrix effect

`TLP-AUDIT-003` leaves the active engineering matrix. The only remaining current verified engineering row is:

- `TLP-DEPS-001` / Product #335 — remove the unused install-only Lenis dependency and exact lock ownership without reopening native-scroll runtime ownership.

Active engineering count becomes `1` (`P3=1`).

## Governance boundary

The selected current manifestation is closed, but `ST-TLP-AUDIT-HARNESS` remains useful as an **absorbed/closed class with reverify triggers**. A future concrete validator that measures implementation text instead of meaningful contract behavior must be independently reproduced and verified before it can re-enter the active matrix. Closed exact-prose, Lenis-required, grammatical-exact-string and this source-literal manifestation are not automatically reopened by source movement alone.
