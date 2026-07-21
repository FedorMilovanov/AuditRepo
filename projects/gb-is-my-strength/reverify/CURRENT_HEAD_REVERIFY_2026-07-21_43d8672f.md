# CURRENT HEAD REVERIFY — 2026-07-21 — `43d8672f`

## Immutable source truth

- Repository: `FedorMilovanov/gb-is-my-strength`
- Source `main`: `43d8672f59128de816cfd47c638c132a73d71599`
- Landed transaction: PR #104, Reader R5 unified overlay runtime
- Exact deployed SHA: **not independently witnessed; keep `PROD-STALE-DEPLOY-RED` open**

## What changed after `3a715551`

- Added one protected `window.OverlayRuntime` / `SiteUtils.OverlayRuntime` owner store.
- Added named/reference-counted scroll owners and an ordered overlay stack.
- Added exact restoration of pre-existing body/html styles, classes, attributes and scroll position.
- Centralized focus trapping, exact opener return and top-layer-only Escape handling.
- Added nested inert/aria claims, idempotent reopen and pagehide/beforeunload recovery.
- Replaced the second private `site.js` scroll-lock implementation with canonical delegates.
- Migrated ReaderSettings, Hermenevtika mobile TOC and shared Gill/series TOC, learning, settings and GBS2 sheets.
- Removed transaction-only workflows, patchers, triggers and raw inventory before merge.

## Verified gates on PR #104 final head `6e31ec54`

- Shared Files Guard and overlay static contracts: PASS
- Route Registry Validators: PASS
- Native Source Contract: PASS
- Astro type/template check: PASS
- production-like dist and native article/series output: PASS
- strict migration metadata, workflow policy and tracked-tree mutation check: PASS
- Chromium nested forward/reverse ownership witness: PASS
- Firefox nested forward/reverse ownership witness: PASS
- WebKit nested forward/reverse ownership witness: PASS
- exact scroll/style/focus restoration, inert, Escape, pagehide and reduced-motion cases: PASS

## Current architecture boundary

- Reader overlays use one canonical runtime and no longer own direct body scroll writers.
- `SeriesReaderChrome` remains the public series/book façade.
- Reader R1 remains the global preferences authority.
- Public surface profiles from R4 remain the route classification authority.
- Issue #58 remains open only for special map/3D adapters; do not reopen the reader portion without fresh negative evidence.

## Remaining material risks

1. Exact deployed SHA proof remains pending.
2. Special map/3D direct lock writers need a separate adapter lane before issue #58 closes.
3. Unified progress/bookmarks/notes state remains R6 / issue #59.
4. Mobile quality/performance sweep remains after platform lifecycle/state work.
5. Map rendering/data P0/P1, Nagornaya dark-theme debt and owner/freeze zones stay separate lanes.
