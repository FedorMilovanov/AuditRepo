# CURRENT HEAD REVERIFY — 2026-07-21 — `75b236ac`

## Immutable source truth

- Repository: `FedorMilovanov/gb-is-my-strength`
- Source `main`: `75b236acd31a779b431406710309f6a086b7f845`
- Landed transaction: PR #102, Reader R3 neutral `SeriesReaderChrome` façade
- Exact deployed SHA: **not independently witnessed; keep `PROD-STALE-DEPLOY-RED` open as deploy-proof task**

## What changed after `ffdba149`

- Added neutral public façade `SeriesReaderChrome` over the existing Gill implementation.
- Migrated 41 production series/book consumers: Gill reference routes, three-level heart book,
  Baptist series and other series articles.
- Kept book declarative as `series.shape='book'`; no separate book engine.
- Added permanent direct-import isolation guard and wired it into Shared Files Guard and
  `engine:contracts`.
- Updated architecture/migration documentation and route-owner descriptions.
- Removed all temporary inventory/recovery/parity workflows before merge.
- Reverted an unnecessary CSS-comment edit so runtime CSS and cache-bust inputs remain unchanged.

## Verified gates on PR #102 final head `a8b34b1`

- Shared Files Guard: PASS
- `series:facade:guard`: PASS, 41 consumers
- Route Registry Validators: PASS
- Native Source Contract: PASS
- Astro type/template check: PASS
- production-like build: PASS
- native article/series output: PASS
- migration metadata coherence and workflow policy: PASS
- tracked-tree mutation check: PASS
- full functional `engine:sweep`: PASS

## Current architecture boundary

- `SeriesReaderChrome` is the public series/book entrypoint.
- `GillSeriesChrome` is the internal historical implementation and may be imported directly only
  by the façade.
- DOM/CSS selectors and runtime behavior remain intentionally stable.
- Next lane is R4: complete public-surface registry (`series/article/page/special`) cross-validated
  against existing ownership/profile/migration authorities, not a second SSOT.

## Remaining material risks

1. Exact deployed SHA proof remains pending.
2. R4 full route/surface registry is not yet landed.
3. Overlay lifecycle/focus/direct `body.style.overflow` debt remains R5.
4. Mobile quality/performance sweep remains after platform registry/lifecycle work.
5. Map P0 remainder, Nagornaya dark-theme debt and owner/freeze zones stay separate lanes.
