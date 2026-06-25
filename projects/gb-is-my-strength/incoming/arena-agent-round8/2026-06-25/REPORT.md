# Arena Agent Round 8 Report — 2026-06-25

## Session Summary

Continued from Round 7. Implemented P3-NEW fix, verified V2-4, studied MapEngine (P2-17/P2-18), completed module parity audit.

## Fixes Implemented in Project Source

### P3-NEW — back-to-top.js module NEVER loaded → ✅ FIXED

**Scope:** 7 pages (not 5 — Antisovetov and KodDaVinchi added after code analysis):
- GillPart1PageChrome.astro (line 89), GillPart2PageChrome.astro (line 89)
- GillPart3PageChrome.astro (line 90), AntisovetovBody.astro (line 1699)
- KodDaVinchiPageFooter.astro (line 147), KrajneBody.astro (line 592), Rimlyanam7Body.astro (line 197)

**Fix:** Added `<script is:inline defer src="../../js/modules/back-to-top.js"></script>` after last JS script on each page.

### V2-4 — feed.xml pubDates ✅ VERIFIED FIXED IN SOURCE

- All 17/17 entries: +0300 Moscow timezone, correct weekdays (Python verified)
- toLocaleString('en-US', { timeZone: 'Europe/Moscow' }) in update-meta.js

## Bug Verification

### P2-17 — AvraamMap pollutes global MapEngine singleton ✅ CONFIRMED
- `window.MapEngine.getPlaceVisual` override in AvraamMap.astro line 31-32
- IshodMap and AvraamMap both use same global MapEngine → collision risk

### P2-18 — MapEngine loadFromHash uses location.pathname ✅ CONFIRMED
- `loadFromHash()` / `updateHash()` in map-engine.js lines 2462-2481
- Fails on GitHub Pages with base href (pathname includes base prefix)

### P3-12 — baseGeoUrl without cache-busting ✅ CONFIRMED
- AvraamMap.astro line 50: `baseGeoUrl: 'base.svg'` (no ?v=)

## Module Parity Audit

| Module | Status |
|--------|--------|
| modules/back-to-top.js | ✅ NOW LOADED (7 pages) |
| modules/faq-accordion.js | ❌ Dead code — FAQ works via enhancements.js inline |
| modules/theme.js | ✅ site.js handles inline |
| modules/img-loaded.js | ✅ site.js handles inline |

## Validation Results

```
npm run data:consistency ✅
npm run migration:metadata:check ✅
npm run native:runtime:audit:strict ✅
npm run workflows:check ✅
npm run guard:shared-files ✅
npm run content:parity ✅
```

## Bug Count: 61 bugs (9 P0, 20 P1, 19 P2, 13 P3)

- Fixed in project source: V2-2, V2-3, V2-4, PS-06, P3-NEW
- Fixed in AuditRepo (pending merge): PS-01, P0-10, PS-07, P0-7, P0-8
- False positive closed: P3-8
