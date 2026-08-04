# CURRENT HEAD REVERIFY — Nagornaya dark-theme current residual

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NG-DARK-01`
- Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `a1ae62a06a803824d4dd828bbd06a4cead3dd1b1`
- Narrowing lane: AuditRepo PR #151
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

The scan extracted **114 distinct static color utility tokens / 2947 uses**, resolved every local stylesheet linked by each page, and matched each token only against dark-context selectors in CSS actually loaded by that route.

Across the complete ambient inventory:

- **65 tokens / 2408 uses** have an explicit linked dark-context rule;
- **49 tokens / 539 uses** have no explicit linked dark-context selector;
- no token is only partially covered across the routes where it is used.

Absence of a dedicated dark selector is not automatically a visual defect. Some ambient tokens intentionally describe already-dark sidebar or control surfaces. Therefore the canonical disposition does **not** promote all 49 tokens into `NG-DARK-01`.

## Historical-claim boundary

The July row specifically claimed these families were unremapped:

- `text-{accent}-600`;
- `text-{accent}-700`;
- `text-amber-800`;
- `border-stone-100`;
- `bg-rose-50`;
- `bg-stone-100` and `bg-stone-200`.

Exactly **20 currently used tokens / 467 uses** fall inside that historical boundary.

### Historical tokens now covered

| Utility token | Uses | Routes | Effective linked dark owner |
|---|---:|---:|---|
| `text-amber-600` | 46 | 7 | `css/nagornaya-mobile-toc.css` |
| `text-blue-700` | 23 | 3 | `css/nagornaya-mobile-toc.css` |
| `bg-stone-100` | 18 | 8 | `css/nagornaya-mobile-toc.css` |
| `text-emerald-700` | 15 | 3 | `css/nagornaya-mobile-toc.css` |
| `bg-rose-50` | 13 | 1 | `css/nagornaya-mobile-toc.css` |
| `text-amber-800` | 11 | 3 | `css/nagornaya-mobile-toc.css` |
| `text-amber-700` | 10 | 5 | `css/nagornaya-mobile-toc.css` |
| `text-red-700` | 4 | 3 | `css/nagornaya-mobile-toc.css` |

These **8 tokens / 140 uses** disprove the broad claim that every listed family remains unremapped and that all dark treatment lives only in `mobile-hotfix.css`. In particular:

- body and content `bg-stone-100` are covered;
- `bg-rose-50` is covered;
- `text-amber-800` is covered;
- several 600/700 accent levels are covered.

### Canonical current residual

The following **12 tokens / 327 uses** are both inside the historical claim and still lack an explicit linked dark-context selector:

| Utility token | Uses | Routes using token | Current direct dark rule |
|---|---:|---:|---|
| `border-stone-100` | 167 | 8 | none found |
| `text-blue-600` | 41 | 2 | none found |
| `text-rose-600` | 41 | 1 | none found |
| `text-purple-600` | 40 | 1 | none found |
| `text-emerald-600` | 15 | 4 | none found |
| `text-purple-700` | 12 | 1 | none found |
| `text-teal-600` | 3 | 1 | none found |
| `text-teal-700` | 3 | 1 | none found |
| `bg-stone-200` | 2 | 2 | none found |
| `text-orange-700` | 1 | 1 | none found |
| `text-red-600` | 1 | 1 | none found |
| `text-rose-700` | 1 | 1 | none found |

This is the only source-level residual retained under `NG-DARK-01` by this transaction.

The other **37 tokens / 212 uses** without a direct dark selector are outside the historical row. They are not silently added to the canonical bug. A future browser/computed-style or owner review may classify them separately, but this source-only lane makes no visual-failure claim for them.

## Disposition

`NG-DARK-01` remains **OPEN / CURRENT**, narrowed from the stale “54 classes” statement to **12 historically in-scope tokens / 327 uses**.

Future Product work must verify computed appearance and repair only this bounded set, preferably through linked semantic/chapter variables or explicit governed remaps. It must not recreate fixed `NG-BODY-01`, reopen duplicate rows, or treat every ambient utility without its own selector as broken.

Closed rows `NG-DARK-04` and `NG-DARK-05` remain closed as historical duplicate consolidations. Their old current-source explanations are reconciled: `bg-rose-50` and `bg-stone-100` now have effective linked remaps; `bg-stone-200`, where still used, remains represented only by the narrowed root.

## Evidence boundary

- exact Product source and route-linked CSS only;
- no Product mutation;
- no browser, computed-style, deployed-SHA or live-production claim;
- no TTS inspection or modification;
- canonical arithmetic remains **358 = 213 closed + 145 open**, P1 **70**.
