# LEGACY — MAP-P1-20 Karty shared-engine freshness closure — 2026-08-07

This file is **retirement evidence, not active backlog**.

## ID

`MAP-P1-20`

## Historical active formulation

Canonical Ishod loaded the shared `../_engine/map-engine.js` without a revision query. The Service Worker treated unversioned same-origin `.js` as generic static content and served it cache-first, so an already cached MapEngine could remain stale while the user was online.

The older route.json half of the historical claim had already been retired before this closure; the surviving independently actionable root was the shared-engine cache strategy.

Original activation evidence remains in:

- `../verification/2026-08-07-full-matrix-consolidation/REPORT.md`;
- `MATRIX_CLEANUP_2026-08-07.md`;
- the compact MASTER history before Product #1153.

## Closure

Disposition: `closed-by-fix-in-cache-owner`.

Product owner: `FedorMilovanov/gb-is-my-strength#1153`.

Final exact Product head: `dc6f7d1fb8acb3704b050263187c291730e24a34`.

Product squash merge: `c99f15b102494282a41d31f90838b9856475bb1b`.

The engine URL remains unversioned. The defect is retired because the true Service Worker owner now treats exactly `/karty/_engine/map-engine.js` as network-first with `CACHE_STATIC` fallback while preserving generic cache-first behavior for other unversioned static assets.

The existing A07 static audit locks the exact selector/routing order and keeps the engine out of precache. The existing A07 Chromium witness proves real Service Worker behavior: cached `old` engine bytes are replaced by online `new` bytes, then the browser can go offline and still receive the cached `new` bytes without another server request.

Exact browser witness: 10/10 A07 scenarios passed, digest `sha256:79f9bcb2ad69bd9664b63b893d9fa7d5e722c273028b6a550cc02ab82b5cd3ad`.

Deploy Candidate evidence artifact: ID `8993049163`, ZIP SHA-256 `0610129c915868ec55e5a15682541aad850c95ba926f26469400df6dffbc5422`.

Full closure evidence:

`../verification/2026-08-07-map-p1-20-sw-freshness-closure/REPORT.md`.

Do not revive `MAP-P1-20` merely because the public script URL remains unversioned. Revival requires a new current witness that the shared engine can again remain stale while online, or that the exact network-first Service Worker ownership has been lost.
