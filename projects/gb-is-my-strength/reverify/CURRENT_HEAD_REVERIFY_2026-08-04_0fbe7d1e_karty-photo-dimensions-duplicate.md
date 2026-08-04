# CURRENT HEAD REVERIFY — Karty photo intrinsic dimensions

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical findings: `QUAL-P1-06`, `MAP-P1-24`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `ad1f08679005a54c99522e6c43725a851320a6ab`
- Current production claim: **none**

## Original claims

- `QUAL-P1-06`: 122 Karty photos lack `width`/`height`, causing layout shift and measurable CLS during on-demand loading.
- `MAP-P1-24`: the same 122 photos in nine `route.json` files lack intrinsic dimensions and rely on CSS sizing.

These are two descriptions of one data/rendering root cause, not independent repair lanes.

## Current-head witness

At Product `0fbe7d1ead9ebd1bea867418e254da438ec63329`:

- `karty/avraam/route.json` still contains photo records with `src`, `thumb`, `label`, `type`, `alt` and `credit`, but no `width` or `height`;
- both the full-size and thumbnail URLs encode requested widths, yet the route data exposes no intrinsic aspect-ratio contract to the renderer;
- the current source therefore preserves the layout-stability residual;
- `MAP-P1-24` repeats the exact object population and missing fields already owned by `QUAL-P1-06`.

## Disposition

### `QUAL-P1-06` — confirmed-current / canonical owner

Retain this P1 row as the single owner for adding intrinsic dimensions or an equivalent validated aspect-ratio contract to the complete Karty photo dataset and consuming it without on-demand layout shift.

### `MAP-P1-24` — duplicate / merged into `QUAL-P1-06`

Close this row as an exact duplicate of the same 122-photo intrinsic-dimension defect. No Product mutation is performed by this verifier-only transaction.

## Evidence boundary

This transaction does not claim the CLS defect is fixed, assert a measured current CLS value, choose the final schema shape, close separate thumbnail-size or zoom-clamp findings, or establish deployment of current Product `main`.

## Proposed canonical arithmetic

- Canonical IDs: **358**
- Closed: **199 → 200**
- Open: **159 → 158**
- P1: **72 → 71**
- P2: 33
- P0: 0
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 200 + 158`.
