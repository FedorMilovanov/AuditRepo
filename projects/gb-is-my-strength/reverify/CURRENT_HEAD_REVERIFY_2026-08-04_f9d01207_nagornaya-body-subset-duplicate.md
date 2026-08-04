# CURRENT HEAD REVERIFY — Nagornaya body dark-remap subset

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `NG-BODY-01`
- Remaining broad owner: `NG-DARK-01`
- Current Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `f59571e6690e695a7fcf5d1a4da71c33fb6401aa`
- Current production claim: **none**

## Current source evidence

Exact source scan found **8** current legacy Nagornaya routes whose `<body>` carries both `nagornaya-page` and `bg-stone-100`, and every file links `css/nagornaya-mobile-toc.css`:

  - `nagornaya/chast-1/index.html`
  - `nagornaya/chast-2/index.html`
  - `nagornaya/chast-3/index.html`
  - `nagornaya/chast-4/index.html`
  - `nagornaya/chast-5/index.html`
  - `nagornaya/index.html`
  - `nagornaya/istochniki/index.html`
  - `nagornaya/nakhodki/index.html`

The linked stylesheet contains the specific selector group `html.dark body.nagornaya-page .bg-stone-100,html.dark body.nagornaya-page .bg-stone-50` with `background-color: var(--color-surface-muted) !important`.

This is a deterministic effective-cascade fix for the historical body claim: the dark selector includes `html.dark`, `body.nagornaya-page` and `.bg-stone-100`, uses `!important`, and is loaded by every current legacy body surface. It overrides the lower-specificity Tailwind `.bg-stone-100` light declaration.

## Disposition

`NG-BODY-01` is **FIXED-CURRENT / SOURCE VERIFIED**.

The historical row is stale on the current Product anchor. The dark body remap exists in the dedicated Nagornaya stylesheet; the old statement inspected only `mobile-hotfix.css` and therefore missed the actual owner file.

`NG-DARK-01` is not closed by this transaction because it covers a broader class-remap architecture. Its next current-head reverify must remove the fixed body `bg-stone-100` subset and establish the actual remaining classes before any Product mutation.

## Evidence boundary

- no Product mutation in this AuditRepo transaction;
- current exact-source and effective-cascade verification only;
- no browser, live-production or deployed-SHA claim;
- no disposition for the remaining `NG-DARK-01` classes.

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **212 → 213**
- Open: **146 → 145**
- P0: 0
- P1: **71 → 70**
- P2: 29
- P3: 39
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 213 + 145`.
