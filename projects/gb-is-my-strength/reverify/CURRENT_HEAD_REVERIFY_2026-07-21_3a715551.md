# CURRENT HEAD REVERIFY — 2026-07-21 — `3a715551`

## Immutable source truth

- Repository: `FedorMilovanov/gb-is-my-strength`
- Source `main`: `3a715551409a01bff0d81e2921a12a45e6973ef3`
- Landed transaction: PR #103, Reader R4 public-surface registry
- Exact deployed SHA: **not independently witnessed; keep `PROD-STALE-DEPLOY-RED` open**

## What changed after `75b236ac`

- Extended all 76 existing route profiles with `surfaceContractVersion`, `surface` and
  `seriesShape` where applicable.
- Canonical distribution: 51 series (27 flat, 24 book), 2 standalone articles,
  9 ordinary pages and 14 special surfaces.
- Kept books declarative as series/book, not a separate engine.
- Added derived chrome/config/settings registry based on resolved import edges and mobile registry.
- Added permanent read-only audit and isolated adversarial mutation tests.
- Wired the registry into strict migration metadata and Route Registry Validators.
- Removed all temporary runners, scripts, triggers and superseded inventory artifacts.

## Verified gates on PR #103 final head `e491bc8`

- Shared Files Guard and actionlint: PASS
- Route Registry Validators: PASS
- public-surface audit and isolated mutation tests: PASS
- migration matrix, provenance, compatibility commands and read-only check: PASS
- Native Source Contract: PASS
- Astro type/template check: PASS
- production-like dist and native article/series output: PASS
- strict migration metadata and embedded R4 registry: PASS
- workflow policy and tracked-tree mutation check: PASS

## Current architecture boundary

- Existing `data/route-profiles` are the explicit surface authority; no second route SSOT exists.
- Chrome owner, config sources and settings capability are derived facts.
- `SeriesReaderChrome` remains the public series/book implementation façade.
- Reader R1 remains the global preferences authority.
- Next isolated lane is R5: overlay lifecycle, focus and scroll-lock coordination.

## Remaining material risks

1. Exact deployed SHA proof remains pending.
2. Direct/local overlay lifecycle and `body.style.overflow` debt remains R5.
3. Unified progress/bookmarks/notes state remains R6.
4. Mobile quality/performance sweep remains after platform lifecycle/state work.
5. Map P0 remainder, Nagornaya dark-theme debt and owner/freeze zones stay separate lanes.
