# CURRENT HEAD REVERIFY — Nagornaya visual duplicate and false-positive rows

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `NG-VIS-05`, `NG-VIS-06`, `NG-VIS-07`, `NG-VIS-08`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `ad1f08679005a54c99522e6c43725a851320a6ab`
- AuditRepo consolidation lane: PR #143
- Current production claim: **none**

## Current evidence

### `NG-VIS-05` — false-positive / intentional semantic marker

Current `js/glossary.js` explicitly includes `div.reveal` in its `proseSelectors` runtime policy. The class is therefore consumed by glossary hydration as a semantic prose boundary. The canonical row itself states that animation was neither present nor planned. Treating the lack of a reveal animation as a visual defect is a false-positive; removing the class would instead weaken the current glossary contract.

### `NG-VIS-06` — duplicate / merged into `NG-STRUCT-01`

The row says the chapter-five `font-sans` inconsistency is already combined into `NG-STRUCT-01`. The root owner remains open and explicitly covers chapter-five heading structure and the `font-sans` subset. There is no separate repair lane for `NG-VIS-06`.

### `NG-VIS-07` — duplicate / merged into `NG-DARK-01`

The row attributes loss of chapter colour identity in dark mode to the same missing per-chapter CSS-variable/remap architecture owned by `NG-DARK-01`. Closing the duplicate does not claim the root dark-theme defect is fixed.

### `NG-VIS-08` — duplicate / merged into `NG-DARK-01`

The chapter-three hero contrast drift is another manifestation of the same incomplete dark remap owned by `NG-DARK-01`. It is not independently repairable from that root cause.

## Evidence boundary

This transaction does not close `NG-STRUCT-01`, `NG-DARK-01`, `NG-VIS-04`, or any other Nagornaya content/theme finding. It performs no Product mutation and makes no production claim.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **199 → 203**
- Open: **159 → 155**
- P1: 72
- P2: 33
- P3: **47 → 43**
- P0: 0
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 203 + 155`.
