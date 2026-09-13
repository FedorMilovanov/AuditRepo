# Reverify — TLP-DISCOVERY-001 closure

**Date:** 2026-09-13  
**Root:** `TLP-DISCOVERY-001`  
**Product PR:** `FedorMilovanov/TheLegendaryPoet#494`

## Disposition

`TLP-DISCOVERY-001` is closed-by-single-discovery-authority plus exact static-host/browser proof.

The final implementation owns ready/noindex/not-found/loading/error/redirect metadata state and derives runtime head behavior, prerender output, sitemap state and IndexNow delta from one route/change authority.

## Product evidence

- final base: `54bee439734b8a97c08c0f176e9adc74930b1678`
- exact certified head: `13a2ef33d1683531a849425bd46b2e9130cef2df`
- CAS squash/resulting main: `cff9b0f6cbe986a4d8dc79e22661b331a1207592`
- tested tree: `732d7af8deb569cec702f379aeffc04f2b93451d`
- resulting tree: `732d7af8deb569cec702f379aeffc04f2b93451d`
- tested/resulting tree identity: **PASS**

## Closed outcomes

- hydrated 404 no longer recreates canonical, `og:url` or route schema owned by ready pages;
- loading and lazy-render error states replace stale route head before fallback/error UI settles;
- sitemap `lastmod` exists only where an owned editorial date exists;
- coarse site/poet/music pseudo-clocks are retired;
- deterministic per-canonical-URL discovery fingerprints drive deploy deltas;
- IndexNow submits added/changed/deleted canonical URLs instead of the full site on every successful deploy;
- generated discovery fingerprints are stable across CRLF/LF checkout policies;
- the artifact validator is executable on Windows and POSIX and compares canonical text rather than platform line endings;
- Pages-like route QA proves static/hydrated 404 parity, SPA stale-head removal, loading, lazy failure and recovery.

## Exact-head proof

Final exact-head workflows all completed success:
- Project Contracts `34723706271`
- Simonov source gate `34723706276`
- Content Model `34723706314`
- CI `34723706292`
- Brand Deep `34723706274`
- Hall web runtime `34723706281`
- Site Route Integrity `34723706272`
- Articles Catalog `34723706275`
- Manual Browser QA `34723706289`
- initial Merge Certification `34723706305`
- Ready-state Merge Certification `34724767616`

The Manual Browser run completed Chromium/Android, fresh-process base iPhone Safari, premium iPhone, WebKit HOME and analytics-route outcomes successfully.

## Resulting-main proof

Resulting `main@cff9b0f6cbe986a4d8dc79e22661b331a1207592` completed successfully across:
- CI `34724841834`
- Project Contracts `34724841858`
- Content Model `34724841883`
- Site Route Integrity `34724841856`
- Articles Catalog `34724841891`
- Brand Deep `34724841893`
- Brand Raster `34724841905`
- Hall web runtime `34724841847`
- GitHub Pages `34724841864`
- Manual Browser QA `34724841850`
- IndexNow `34725158319`

The resulting-main Manual Browser run completed Chromium/Android and fresh-process iPhone Safari successfully.

## Live production witness

After Pages deployment:
- production sitemap exposes **31** canonical URLs;
- sitemap contains no `priority` or `changefreq`;
- an unknown route returns actual HTTP **404**;
- the 404 document is `noindex,follow`;
- the 404 document has no canonical and no `og:url`;
- `/poets` exposes the expected `https://thelegendarypoet.ru/poets` canonical.

## Scope boundary

This closure does not alter or absorb:
- `TLP-COMM-ABUSE-001`;
- `TLP-ANALYTICS-PROPERTY-001`.

## Matrix disposition

After the preceding Audit closure:
- P1: stays `1`
- P2: `2 → 1`
- P3: stays `0`
- active total: `3 → 2`

Only the human Turnstile proof and external GA4 property/web-stream ownership remain active.
