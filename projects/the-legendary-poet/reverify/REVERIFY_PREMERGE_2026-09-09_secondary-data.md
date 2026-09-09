# PREMERGE REVERIFY — TLP-SECONDARY-DATA-001

Date: 2026-09-09  
Audit owner: `TLP-SECONDARY-DATA-001`  
Audit issue: #422  
Product issue: `FedorMilovanov/TheLegendaryPoet#475`  
Product PR: `FedorMilovanov/TheLegendaryPoet#476`

## Current Product candidate

- Product base: `11e086ef289e3dc1ab55bff8a6664c78d2cb2761`.
- Candidate exact head: `7082451d9a9ae51649f3d00ead01e891401d9019`.
- Candidate compare at creation: `behind=0`, one commit, permanent diff exactly 8 bounded secondary-data files.
- PR is open and mergeable. No Product merge is claimed here.

## Defect reproduced on the base

The active Audit row is current on Product base `11e086e…`:

1. `PoetDetailPage` renders `RelatedEssays` directly inside the primary biography tree.
2. `RelatedEssays` directly `use()`s `getBrowserEssayCatalog(location.key)` with no local Suspense/failure containment.
3. `EssayPage` performs a page-level `use(getBrowserEssayCatalog(location.key))` for series navigation.
4. Production `getBrowserEssayBySlug()` itself uses `Promise.all([getBrowserEssayCatalog(...), body fetch])`, so an optional catalog failure can prevent an otherwise valid requested essay payload from becoming primary route authority.

That is the exact `TLP-SECONDARY-DATA-001` mechanism; it is not merely a generic ErrorBoundary/topology concern.

## Candidate repair under certification

Candidate #476 currently:

- makes the requested essay JSON the primary `getBrowserEssayBySlug` authority, preserving explicit payload 404, slug identity, blocks and sources validation;
- adds a stable fail-soft optional catalog promise layered over the existing visit-scoped raw catalog request;
- moves `RelatedEssays` behind local null-fallback Suspense and onto the optional catalog authority;
- removes page-level catalog ownership from `EssayPage` and moves series navigation behind its own local null-fallback Suspense boundary;
- strengthens `validate:essay-browser-data` so primary loader/catalog separation and both containment boundaries fail closed;
- adds `qa/secondary-data-failure.spec.mjs`, wired into Articles Catalog acceptance across Chromium, Pixel 7 Chromium and iPhone Safari, forcing `catalog.json` to HTTP 503 while requiring the primary poet biography and primary essay body to remain available.

## Hard closure boundary

This is pre-merge evidence only. Do **not** remove `TLP-SECONDARY-DATA-001` from MASTER, decrement P2/total, or append a terminal closure entry until:

- Product #476 current exact head has terminal required static/build/browser/merge-certification success;
- the three-profile forced-catalog-failure acceptance is green;
- Product base/head remain current with `behind=0`, reviews/threads clean;
- #476 is CAS-squash merged with its exact tested head;
- resulting Product main/tree identity is recorded.

If those conditions are met, the expected matrix disposition is `P2 11 → 10`, total active `13 → 12`; P1=1 and P3=1 remain unchanged. No other root is implied closed.
