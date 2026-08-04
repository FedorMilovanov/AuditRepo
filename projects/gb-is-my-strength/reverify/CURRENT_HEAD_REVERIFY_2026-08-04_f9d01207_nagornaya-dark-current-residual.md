# CURRENT HEAD REVERIFY — Nagornaya dark-theme current residual

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NG-DARK-01`
- Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `a1ae62a06a803824d4dd828bbd06a4cead3dd1b1`
- Closure/narrowing lane: AuditRepo PR #151
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## Exact current-source inventory

The fail-closed scan selected **9** current legacy Nagornaya routes by the semantic body owner `nagornaya-page`:

- `nagornaya/chast-1/index.html`
- `nagornaya/chast-2/index.html`
- `nagornaya/chast-3/index.html`
- `nagornaya/chast-4/index.html`
- `nagornaya/chast-5/index.html`
- `nagornaya/index.html`
- `nagornaya/istochniki/index.html`
- `nagornaya/nakhodki/index.html`
- `nagornaya/seriya/index.html`

It extracted **114 distinct static color utility tokens / 2947 uses** from their markup, resolved every local stylesheet linked by each page, and matched each token only against a dark-context selector in CSS actually loaded by the route.

- Fully covered now: **65 tokens / 2408 uses**.
- Still fully uncovered: **49 tokens**.
- Partially covered across using routes: **0 tokens**.
- Current residual: **49 tokens / 539 uses**.

The current linked CSS covers, among others, `text-stone-500` (296×), `text-stone-700` (283×), `text-stone-800` (275×), `text-stone-600` (259×), `text-stone-400` (254×), `text-stone-300` (219×), `border-stone-200` (131×), `bg-stone-50` (79×), `text-emerald-800` (68×), `text-amber-600` (46×), `bg-emerald-100` (41×), `bg-emerald-50` (41×), `bg-amber-50` (35×), `border-amber-100` (27×), и ещё 51. Therefore the historical “54 classes all missing; remaps only in `mobile-hotfix.css`” wording is stale. In particular, `bg-stone-100` and `bg-rose-50` are governed by linked dark selectors in `css/nagornaya-mobile-toc.css`.

The reproducible current residual is: `border-stone-100` (167×), `text-blue-600` (41×), `text-rose-600` (41×), `text-amber-400` (40×), `text-purple-600` (40×), `bg-stone-900` (30×), `border-amber-400` (21×), `bg-amber-600` (17×), `text-emerald-600` (15×), `bg-stone-800` (13×), `text-purple-700` (12×), `text-red-500` (12×), `text-stone-100` (9×), `border-rose-100` (7×), и ещё 35.

### Current residual inventory

| Utility token | Uses | Routes | Dark coverage | Linked rule files |
|---|---:|---:|---|---|
| `border-stone-100` | 167 | 8 | missing on 8/8 route(s) | — |
| `text-blue-600` | 41 | 2 | missing on 2/2 route(s) | — |
| `text-rose-600` | 41 | 1 | missing on 1/1 route(s) | — |
| `text-amber-400` | 40 | 8 | missing on 8/8 route(s) | — |
| `text-purple-600` | 40 | 1 | missing on 1/1 route(s) | — |
| `bg-stone-900` | 30 | 8 | missing on 8/8 route(s) | — |
| `border-amber-400` | 21 | 3 | missing on 3/3 route(s) | — |
| `bg-amber-600` | 17 | 8 | missing on 8/8 route(s) | — |
| `text-emerald-600` | 15 | 4 | missing on 4/4 route(s) | — |
| `bg-stone-800` | 13 | 8 | missing on 8/8 route(s) | — |
| `text-purple-700` | 12 | 1 | missing on 1/1 route(s) | — |
| `text-red-500` | 12 | 4 | missing on 4/4 route(s) | — |
| `text-stone-100` | 9 | 8 | missing on 8/8 route(s) | — |
| `border-rose-100` | 7 | 1 | missing on 1/1 route(s) | — |
| `border-rose-400` | 7 | 1 | missing on 1/1 route(s) | — |
| `text-amber-500` | 6 | 2 | missing on 2/2 route(s) | — |
| `border-stone-600` | 5 | 1 | missing on 1/1 route(s) | — |
| `text-orange-800` | 5 | 2 | missing on 2/2 route(s) | — |
| `border-stone-300` | 4 | 3 | missing on 3/3 route(s) | — |
| `text-emerald-500` | 4 | 1 | missing on 1/1 route(s) | — |
| `text-orange-500` | 4 | 1 | missing on 1/1 route(s) | — |
| `text-stone-200` | 4 | 1 | missing on 1/1 route(s) | — |
| `border-emerald-400` | 3 | 1 | missing on 1/1 route(s) | — |
| `text-teal-600` | 3 | 1 | missing on 1/1 route(s) | — |
| `text-teal-700` | 3 | 1 | missing on 1/1 route(s) | — |
| `bg-purple-600` | 2 | 2 | missing on 2/2 route(s) | — |
| `bg-stone-200` | 2 | 2 | missing on 2/2 route(s) | — |
| `bg-blue-600` | 1 | 1 | missing on 1/1 route(s) | — |
| `bg-emerald-600` | 1 | 1 | missing on 1/1 route(s) | — |
| `bg-emerald-700` | 1 | 1 | missing on 1/1 route(s) | — |
| `bg-emerald-800` | 1 | 1 | missing on 1/1 route(s) | — |
| `bg-purple-800` | 1 | 1 | missing on 1/1 route(s) | — |
| `bg-rose-600` | 1 | 1 | missing on 1/1 route(s) | — |
| `border-amber-300` | 1 | 1 | missing on 1/1 route(s) | — |
| `border-amber-500` | 1 | 1 | missing on 1/1 route(s) | — |
| `border-blue-500` | 1 | 1 | missing on 1/1 route(s) | — |
| `border-emerald-500` | 1 | 1 | missing on 1/1 route(s) | — |
| `border-red-500` | 1 | 1 | missing on 1/1 route(s) | — |
| `border-rose-200` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-amber-300` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-indigo-200` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-indigo-300` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-orange-700` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-purple-950` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-red-600` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-rose-200` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-rose-700` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-teal-200` | 1 | 1 | missing on 1/1 route(s) | — |
| `text-teal-300` | 1 | 1 | missing on 1/1 route(s) | — |

### Current covered inventory

| Utility token | Uses | Routes | Dark coverage | Linked rule files |
|---|---:|---:|---|---|
| `text-stone-500` | 296 | 9 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-stone-700` | 283 | 9 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-stone-800` | 275 | 9 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-stone-600` | 259 | 8 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-stone-400` | 254 | 8 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `text-stone-300` | 219 | 8 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `border-stone-200` | 131 | 9 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-stone-50` | 79 | 7 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-emerald-800` | 68 | 6 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-amber-600` | 46 | 7 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `bg-emerald-100` | 41 | 3 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-emerald-50` | 41 | 5 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `bg-amber-50` | 35 | 6 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `border-amber-100` | 27 | 5 | covered on every using route | `css/mobile-hotfix.css` |
| `text-blue-800` | 25 | 5 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-blue-700` | 23 | 3 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `border-emerald-300` | 21 | 3 | covered on every using route | `css/mobile-hotfix.css` |
| `border-stone-700` | 19 | 8 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `bg-stone-100` | 18 | 8 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `text-emerald-700` | 15 | 3 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `text-stone-900` | 15 | 8 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `bg-rose-50` | 13 | 1 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `text-red-800` | 13 | 4 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `bg-blue-100` | 12 | 4 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-red-50` | 11 | 6 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `text-amber-800` | 11 | 3 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `bg-blue-50` | 10 | 5 | covered on every using route | `css/mobile-hotfix.css` |
| `border-emerald-100` | 10 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `text-amber-700` | 10 | 5 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `border-red-100` | 9 | 3 | covered on every using route | `css/mobile-hotfix.css` |
| `text-rose-800` | 9 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `border-emerald-200` | 8 | 3 | covered on every using route | `css/mobile-hotfix.css` |
| `text-amber-200` | 8 | 8 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-purple-50` | 7 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-orange-50` | 6 | 2 | covered on every using route | `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css` |
| `border-blue-200` | 6 | 4 | covered on every using route | `css/mobile-hotfix.css` |
| `border-orange-200` | 6 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `border-amber-200` | 5 | 5 | covered on every using route | `css/mobile-hotfix.css` |
| `text-purple-900` | 5 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `border-blue-100` | 4 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `border-orange-100` | 4 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `border-purple-100` | 4 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `border-red-200` | 4 | 4 | covered on every using route | `css/mobile-hotfix.css` |
| `text-purple-300` | 4 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `text-red-700` | 4 | 3 | covered on every using route | `css/nagornaya-mobile-toc.css` |
| `bg-amber-100` | 3 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-emerald-200` | 3 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-red-100` | 3 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `border-blue-300` | 3 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `border-purple-200` | 3 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `text-purple-800` | 3 | 3 | covered on every using route | `css/mobile-hotfix.css` |
| `text-blue-900` | 2 | 2 | covered on every using route | `css/mobile-hotfix.css` |
| `text-emerald-200` | 2 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `text-emerald-900` | 2 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-indigo-100` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-orange-100` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-purple-100` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-teal-100` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `bg-teal-50` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `border-red-300` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `border-teal-200` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `text-amber-900` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `text-indigo-800` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `text-purple-200` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |
| `text-teal-800` | 1 | 1 | covered on every using route | `css/mobile-hotfix.css` |

## Disposition

`NG-DARK-01` remains **OPEN / CURRENT**, but is narrowed to the exact residual inventory above.

This transaction removes fixed/stale subsets from the canonical wording without pretending that the broader dark-theme debt is repaired. Future Product work must use the generated residual table as its acceptance boundary instead of the July count or an assumption that all accent utilities lack dark treatment.

Closed rows `NG-DARK-04` and `NG-DARK-05` remain closed as historical duplicate consolidations. Their old current-source explanations are reconciled: `bg-rose-50` and body `bg-stone-100` now have effective linked remaps; any still-uncovered token is owned only by this narrowed root.

## Evidence boundary

- exact Product source only;
- no Product mutation;
- no browser, deployed-SHA or live-production claim;
- no TTS inspection or modification;
- canonical arithmetic is unchanged at **358 = 213 closed + 145 open**, P1 **70**.
