# CURRENT HEAD REVERIFY — 2026-07-21 — `1bbebc2d`

## Immutable source truth

- Repository: `FedorMilovanov/gb-is-my-strength`
- Source `main`: `1bbebc2d9fcfe8a0af7c32e3a6796379927d48b8`
- Landed transactions: PR #106 special overlay adapters, PR #108 revision reconciliation, PR #109 pre-merge/deploy guard
- Exact deployed SHA: **not independently witnessed; keep `PROD-STALE-DEPLOY-RED` open**

## What changed after `43d8672f`

### PR #106 — special overlay adapters (`39f6c3ac`)

- Map place panel/photo nesting, MindMap3D fullscreen and committed built launcher use canonical owner IDs.
- Global image viewer and mobile-menu fallback writers delegate to OverlayRuntime.
- Direct production body/html lock writers are forbidden outside the canonical runtime/bridge.
- Foreign-owner isolation, double destroy, fallback MapEngine and built-output witnesses were added.
- Chromium, Firefox and WebKit special-overlay matrix passed.

### PR #108 — deploy revision reconciliation (`869558cd`)

- Read-only production reproduction found 62 stale source files / 113 revision mismatches.
- Explicit `node scripts/cache-bust.js --write` changed only generated HTML/Astro/helper outputs.
- Subsequent read-only check, publication, production-like build, ownership, URL contract, JSON-LD and writer guards passed.
- `js/site.js`, `karty/_engine/map-engine.js` and normalized MindMap app remained behaviorally unchanged.
- Temporary transaction workflow was removed before the permanent merge.

### PR #109 — permanent prevention (`1bbebc2d`)

- Every PR runs read-only asset revision drift and workflow-policy checks in Shared Files Guard.
- Direct/manual Pages deploy no longer swallows a stale revision failure.
- Workflow-only changes cannot bypass actionlint or workflow policy.
- No write permission, generator behavior or runtime implementation was added.

## Verified gates

- PR #106 static source contracts and Chromium/Firefox/WebKit special-overlay matrix: PASS
- PR #108 Shared Files Guard, Route Registry, Native Source, Astro/build and Chromium/Firefox/WebKit: PASS
- PR #109 asset revision, workflow policy, runtime/overlay/map/reader/facade, shared-files guard and actionlint: PASS
- Exact current GitHub Pages deployment/run SHA: PENDING

## Current architecture boundary

- `series` covers flat series and `seriesShape=book`; there is no fifth book engine.
- `SeriesReaderChrome` is the public series/book façade.
- Reader preferences and overlay lifecycle are global shared infrastructure.
- `special` surfaces use canonical adapters without owning a second scroll-lock implementation.
- Mass query-string rewriting remains a migration bridge; generated manifest work belongs to #56/#64.

## Next transaction

1. Obtain immutable Pages run/deployment SHA and verify production revision/runtime blobs.
2. Only then close `PROD-STALE-DEPLOY-RED` and issue #58.
3. Proceed to R6 / issue #59 unified progress, bookmarks and notes state.
4. Keep map data/render P0/P1, visual redesign and content edits in separate lanes.
