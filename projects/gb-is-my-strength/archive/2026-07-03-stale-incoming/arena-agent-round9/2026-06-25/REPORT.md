# Arena Agent Round 9 Report — 2026-06-25

## Session Summary

Continued from Round 8. Fixed P0-NEW (critical SW precache bug), confirmed P1-5 data conflict, detailed P2-17/18/12 analysis, rechecked P1-13.

## Fixes Implemented in Project Source

### P0-NEW — SW precache 404 for site-layered.css + site-modules.js → FIXED

**Root cause confirmed:**
- `site-layered.css`: Phase 2 refactoring pilot ("duplicate of site.css") — NOT imported in any Astro component → Astro build does NOT copy to dist/
- `site-modules.js`: Phase 3 refactoring effort (contains back-to-top) — NOT imported in any Astro component → Astro build does NOT copy to dist/
- Both in sw.js PRECACHE_ASSETS → 404 on all SW-enabled pages

**Fix applied:** Removed both from PRECACHE_ASSETS in /home/user/project/sw.js:
- Removed "/css/site-layered.css" from PRECACHE_ASSETS
- Removed "/js/site-modules.js" from PRECACHE_ASSETS

**Resolution:** P0-NEW resolves P0-7 and P0-8 as side effect (same root cause).

## Bug Verification

### P1-5 — page-ownership.json vs route-migration-matrix.json conflict → CONFIRMED

page-ownership.json: version 1, updated 2026-06-20, 53 routes (build-time strangler ownership manifest)
route-migration-matrix.json: version 2026-06-23.non-excluded.v1, created 2026-06-23, 34 routes
Discrepancy: 19 routes only in page-ownership (nagornaya, gill articles, hard-texts, etc.)
Two independent tracking systems with divergent data.

### P2-17 — AvraamMap pollutes global MapEngine singleton → CONFIRMED (detailed)

IshodMap.astro: uses MapEngine.createMap() only — does NOT add anything to window.MapEngine
AvraamMap.astro lines 31-32: adds window.MapEngine.getPlaceVisual = function(pl) {...} to global singleton
Collision: AvraamMap's getPlaceVisual (lot/cand marker customization) affects IshodMap in same browser session
SW caching keeps both pages in browser cache → session pollution risk
Fix direction: pass getPlaceVisual as createMap(container, route, { getPlaceVisual: fn }) option instead of global pollution

### P2-18 — MapEngine loadFromHash uses location.pathname → CONFIRMED (detailed)

loadFromHash() reads location.hash, updateHash() uses location.pathname
On GitHub Pages with base href="/repo/", pathname includes prefix → fetch(route.json) may fail with relative paths
Fix direction: base-href-aware path construction

### P3-12 — baseGeoUrl without cache-busting → CONFIRMED

AvraamMap.astro line 50: baseGeoUrl: 'base.svg' (no ?v= cache-bust)
Related to P2-18

### P1-13 — theme.js GBS2 wiring → RECHECKED — NOT A BUG

site.js DOES handle data-gbs2-theme buttons at runtime (GBS2 controls logic exists in site.js)
Previous P1-13 was based on incomplete analysis of what theme.js covers
Only P1-14/15/16 (Baptisty GBS2 controls unwired in SeriesArticleLayout) remain as valid bugs

## Validation Results

npm run data:consistency ✅
npm run guard:shared-files ✅

## Bug Count: 61 bugs (9 P0, 20 P1, 19 P2, 13 P3)

Fixed in project source: V2-2, V2-3, V2-4, PS-06, P3-NEW, P0-NEW
Fixed in AuditRepo (pending merge): PS-01, P0-10, PS-06, PS-07, P0-7, P0-8
False positives closed: P3-8, P1-13 (recheck)
Confirmed active: P2-17, P2-18, P3-12, P1-14/15/16, P0-3, P0-6, P1-5

## AuditRepo Push
Commit: 1b07abd — Round 9: P0-NEW FIXED, P1-5 confirmed, P2-17/18/12 detailed, P1-13 recheck
Status: Pushed to FedorMilovanov/AuditRepo ✅
