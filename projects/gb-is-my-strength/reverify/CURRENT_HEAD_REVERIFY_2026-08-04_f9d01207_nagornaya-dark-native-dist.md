# CURRENT HEAD REVERIFY — Nagornaya native/dist dark-theme authority correction

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NG-DARK-01`
- Duplicate subset: `NG-BODY-01`
- Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `0142b93de01160b77eda71cb9fd2f72fd8a4fbdc`
- Authority-correction lane: AuditRepo PR #152
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## Why this correction exists

AuditRepo PR #151 correctly rejected the stale broad July wording but counted legacy shadow HTML. Current Product authority is native Astro: `scripts/nagornaya-visual-parity-audit.js` requires all nine routes to own native pages/components and forbids legacy full-document transport.

This reverify supersedes PR #151 for source authority and also supersedes PR #150’s `NG-BODY-01` **FIXED-CURRENT** explanation. The canonical inventory comes from a successful `strangler:build:production-like`, followed by exact inspection of built `dist/nagornaya/**/index.html` and CSS/inline styles actually linked by each built page.

## Native production-like route boundary

The build produced all nine expected native routes:

- `nagornaya/index.html`
- `nagornaya/chast-1/index.html`
- `nagornaya/chast-2/index.html`
- `nagornaya/chast-3/index.html`
- `nagornaya/chast-4/index.html`
- `nagornaya/chast-5/index.html`
- `nagornaya/seriya/index.html`
- `nagornaya/istochniki/index.html`
- `nagornaya/nakhodki/index.html`

Every built route contains `nagornaya-page` and `main-content`; the native parity audit passed all nine routes.

Native body ownership is mixed:

- `nagornaya/chast-1/` through `chast-5/` use `bg-stone-900`;
- `nagornaya/`, `nagornaya/istochniki/` and `nagornaya/nakhodki/` use `bg-stone-100`;
- `nagornaya/seriya/` has no stone body utility.

## Historical-scope native-dist inventory

The built output contains **20 historically in-scope tokens / 456 uses**.

Only **1 token / 13 uses** has a direct linked dark-context rule on every built route where it is used:

| Utility token | Uses | Native-dist status |
|---|---:|---|
| `bg-rose-50` | 13 | covered on every using route |

The authoritative source residual is **19 tokens / 443 uses**:

| Utility token | Uses | Native-dist direct dark coverage |
|---|---:|---|
| `border-stone-100` | 167 | missing on using routes |
| `text-amber-600` | 45 | missing on using routes |
| `text-blue-600` | 41 | missing on using routes |
| `text-rose-600` | 41 | missing on using routes |
| `text-purple-600` | 40 | missing on using routes |
| `text-blue-700` | 22 | missing on using routes |
| `text-emerald-700` | 15 | missing on using routes |
| `text-emerald-600` | 14 | missing on using routes |
| `bg-stone-100` | 13 | missing on using routes, including three body owners |
| `text-purple-700` | 12 | missing on using routes |
| `text-amber-800` | 11 | missing on using routes |
| `text-amber-700` | 8 | missing on using routes |
| `text-red-700` | 3 | missing on using routes |
| `text-teal-600` | 3 | missing on using routes |
| `text-teal-700` | 3 | missing on using routes |
| `bg-stone-200` | 2 | missing on using routes |
| `text-orange-700` | 1 | missing on using routes |
| `text-red-600` | 1 | missing on using routes |
| `text-rose-700` | 1 | missing on using routes |

## Canonical dispositions

`NG-DARK-01` remains **OPEN / CURRENT** with the authoritative native-dist source boundary above.

`NG-BODY-01` is **CURRENT**, not fixed. It remains in the closed section only as **DUPLICATE / MERGED INTO `NG-DARK-01`**, so there is one repair owner rather than two. The three built `bg-stone-100` body routes are mandatory browser/computed-style acceptance cases for the root.

Missing direct coverage is still a source-level obligation, not proof of a visual contrast failure. Future browser verification must operate on native production-like output and classify the 19-token set before Product mutation.

Closed cross-reference rows are aligned to the same authority: `NG-DARK-04` remains a covered duplicate; `NG-DARK-05` keeps current `bg-stone-100/200` only under root `NG-DARK-01`; `NG-MOBILE-01` points its body subset to that root rather than treating closed `NG-BODY-01` as a second open owner.

## Evidence boundary

- exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003`;
- successful native parity contract and production-like build;
- exact built HTML plus route-linked CSS/inline styles;
- no Product mutation;
- no browser, computed-style, deployed-SHA or live-production claim;
- no TTS inspection or modification;
- canonical arithmetic remains **358 = 213 closed + 145 open**, P1 **70**.
