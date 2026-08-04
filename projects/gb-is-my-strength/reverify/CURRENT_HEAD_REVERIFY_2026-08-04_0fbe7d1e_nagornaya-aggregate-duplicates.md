# CURRENT HEAD REVERIFY — Nagornaya aggregate duplicate rows

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `NG-INLINE-02`, `NG-STRUCT-02`, `NG-MOBILE-01`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `1445d688e50fb5b7c997ae565e27462e4c6cc1e9`
- AuditRepo consolidation lane: PR #144
- Current production claim: **none**

## Disposition

### `NG-INLINE-02` — duplicate / merged into `NG-INLINE-01`

The row is explicitly labelled as a refinement of `NG-INLINE-01`. Both describe the same five-copy inline-style architecture in the “Из библиотеки” blocks; the later row adds the measured count of 172 attributes but does not establish another root cause or independently mergeable repair lane. The P1 owner remains open.

### `NG-STRUCT-02` — duplicate / merged into `NG-STRUCT-01`

The row is explicitly labelled as a refinement of `NG-STRUCT-01`. Its bare headings, missing wrappers, emoji/SVG drift and chapter-five `font-sans` subset are already contained by the open P1 structural owner. Closing the duplicate does not claim the Product structure is fixed.

### `NG-MOBILE-01` — aggregate duplicate / merged into existing owners

This row contains no independent mobile root cause:

- body `bg-stone-100` remap → open owner `NG-BODY-01`;
- chapter-specific TOC accent → open owner `NG-TOC-01`;
- inline hero height/adaptivity → open owner `NG-A11Y-01`.

The aggregate row double-counts those existing owners and has no separately bounded implementation.

## Evidence boundary

This transaction leaves `NG-INLINE-01`, `NG-STRUCT-01`, `NG-BODY-01`, `NG-TOC-01` and `NG-A11Y-01` open. It performs no Product mutation and makes no production claim.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **203 → 206**
- Open: **155 → 152**
- P1: 72
- P2: **33 → 31**
- P3: **43 → 42**
- P0: 0
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 206 + 152`.
