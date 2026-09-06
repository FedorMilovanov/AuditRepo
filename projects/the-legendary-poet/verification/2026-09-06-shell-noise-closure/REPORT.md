# TLP-SHELL-NOISE-001 — terminal closure

**Status:** `CLOSED-BY-FIX`

## Product authority

- Product repository: `FedorMilovanov/TheLegendaryPoet`
- Product PR: `#435` — `fix(shell): make noise backdrop a persistent singleton`
- certified exact head: `df3aab22ffc2c13e4f0462d9204ef37907ee58a9`
- squash merge on `main`: `62c580c5e4577b8475865638e614be4c91279d51`
- Product base at certification: `facb3caa1b70f82bfb3da45da485bb5cbac5d10c`

## Root cause

The preboot document rendered a fixed `.noise-bg` layer in `index.html`, while React `SiteLayout` rendered a second `.noise-bg` after hydration. Both layers remained active, so the persistent shell carried two full-screen `feTurbulence` surfaces.

## Repair proved

Product #435:

1. retained the preboot `index.html` noise node as the single persistent owner;
2. marked that node with `data-shell-noise="persistent"` and `aria-hidden="true"`;
3. removed the React-owned duplicate from `SiteLayout`;
4. added `qa/shell-noise-singleton.spec.mjs` to prove exactly one active layer after hydration and across a real SPA navigation;
5. wired the regression into canonical Manual Browser QA.

## Exact-head evidence

All pull-request workflows observed on exact head `df3aab22...` reached terminal success before merge:

- `CI` — success, including persistent app shell invariants, typecheck, production build, route splitting/budgets, prerender and SEO verification;
- `Manual Browser QA` — success, including Chromium/Android, fresh-process base iPhone Safari, WebKit home, premium-home and critical-iPhone contours;
- `Site route integrity audit` — success;
- `Project contracts` — success;
- `Content model contract` — success;
- `Articles catalog acceptance` — success;
- `Brand raster QA` — success;
- `Brand deep reference and motion audit` — success.

`Request Pages deployment` was expectedly skipped for the PR head and is not a failure.

## Closure boundary

This closes only `TLP-SHELL-NOISE-001`. The broader `TLP-AUDIT-004` remains active: #435 fixes and directly certifies the shell-singleton manifestation, but does not resolve the other proxy/false-green gaps grouped under that audit-harness root.

## Disposition

`TLP-SHELL-NOISE-001` is retired from `verified/MASTER_BUG_MATRIX.md`.
