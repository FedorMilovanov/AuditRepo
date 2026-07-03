# Round 10 Audit Report — FedorMilovanov/gb-is-my-strength

**Date:** 2026-06-25  
**Agent:** Arena Agent (Round 10)  
**HEAD:** 3b105dc8  
**AuditRepo Push:** Round 10

---

## Executive Summary

P0-NEW critical bug fixed (SW precache 404), P3-NEW fixed (back-to-top.js module missing), P2-17 fixed (MapEngine global pollution), P3-12 fixed (baseGeoUrl cache-busting). P1-14/15/16 confirmed as real bugs (Baptisty GBS2 unwired).

---

## ✅ FIXES IMPLEMENTED

### P0-NEW — SW precache 404 (CRITICAL) ✅

**File:** `/home/user/project/sw.js`

**Problem:** PRECACHE_ASSETS contained references to files not in Astro's dist:
- `"/css/site-layered.css"`
- `"/js/site-modules.js"`

These files exist in the project but are NOT imported in any Astro component, so they never appear in `dist/`. On SW-enabled pages, these 404s trigger.

**Fix Applied:**
```javascript
// Removed from PRECACHE_ASSETS (lines ~45-65):
- "/css/site-layered.css",
- "/js/site-modules.js",
```

**Verification:**
```bash
grep -c "site-layered\|site-modules" /home/user/project/sw.js
# Output: 0 (clean)
```

---

### P3-NEW — back-to-top.js missing on 7 pages ✅

**Problem:** back-to-top.js module exists but not loaded on 7 key pages, breaking scroll-to-top functionality.

**Pages Fixed:**
1. `src/components/article-pilots/gill-part1/GillPart1PageChrome.astro`
2. `src/components/article-pilots/gill-part2/GillPart2PageChrome.astro`
3. `src/components/article-pilots/gill-part3/GillPart3PageChrome.astro`
4. `src/components/article-pilots/antisovetov/AntisovetovBody.astro`
5. `src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageFooter.astro`
6. `src/components/article-pilots/krajne/KrajneBody.astro`
7. `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`

**Fix Applied:** Added to each:
```astro
<script is:inline defer src="../../js/modules/back-to-top.js"></script>
```

---

### P2-17 — MapEngine getPlaceVisual global pollution ✅

**Files:**
- `src/components/karty/avraam/AvraamMap.astro`
- `karty/_engine/map-engine.js`

**Problem:** `window.MapEngine.getPlaceVisual` polluted global namespace.

**Before:**
```javascript
window.MapEngine.getPlaceVisual = function(pl) {
  const color=STAGE_COLORS[place.stage]||STAGE_COLORS[0];
  // ... 
};
```

**After (isolated):**
```javascript
function avraamGetPlaceVisual(pl) {
  const color=STAGE_COLORS[place.stage]||STAGE_COLORS[0];
  // ...
  return { label, color };
}
MapEngine.createMap(container, {
  getPlaceVisual: avraamGetPlaceVisual
});
```

---

### P3-12 — baseGeoUrl cache-busting ✅

**File:** `src/components/karty/avraam/AvraamMap.astro`

**Problem:** baseGeoUrl loaded base.svg without cache-busting, causing stale map tiles.

**Fix:**
```javascript
baseGeoUrl: 'base.svg?v=' + (route.meta && route.meta.version || '1')
```

route.json meta.version = "2.0" (generated 2026-06-14)

---

## ✅ VERIFICATIONS

### P1-13 — theme.js GBS2 wiring → FALSE POSITIVE (reconfirmed) ✅

**Evidence:** `src/js/site.js` lines 74-77:
```javascript
document.documentElement.classList.toggle('dark', dark);
```

**Handlers registered for:** `#themeToggle`, `#hThemeBtn`, `#barThemeBtn`, `.gb-fc-theme`, `.nag-sidebar-theme-btn`

**Conclusion:** Dark mode bridge works on ALL pages including those with `data-gbs2-theme` buttons. **P1-13 is NOT a bug.**

---

### P1-14/15/16 — Baptisty GBS2 controls unwired → CONFIRMED REAL BUGS ✅

**Evidence:** Baptisty pages use `BaptistyRossiiBody.astro` (own components, NOT SeriesArticleLayout)

**Loaded scripts:**
- site-utils.js, scroll-perf.js, site.js, glossary.js, sw-register.js, search.js, highlights.js, enhancements.js

**NOT wired in site.js:**
- `data-gbs2-theme` (font size toggle)
- `data-gbs2-font-up/down` (font resize)
- `data-gbs2-share` (share buttons)
- `data-gbs2-search` (search toggle)
- `gbs2Bbar` (bottom bar)
- `gbs2Curbar` (current reading bar)
- `gbs2MobPct` (mobile progress)
- `gbs2Sheet` (TOC pane)

**Root cause:** site.js lacks GBS2-specific control handlers.

**Impact:** All 10 Baptisty pages have completely unwired GBS2 controls.

---

### P2-18 — MapEngine loadFromHash base href issue → CONFIRMED ✅

**Location:** `karty/_engine/map-engine.js` lines 2462-2481

**Problem:** `location.pathname` includes GitHub Pages base href prefix, causing fetch to wrong URL.

**Example:** With base href `/gb-is-my-strength/`, pathname = `/gb-is-my-strength/karty/avraam/` → fetch `/karty/avraam/hash/saved.json` (404).

**Note:** Fix planned for next round.

---

## 📋 BUG LEDGER STATUS

**Total bugs:** 61 (9 P0, 20 P1, 19 P2, 13 P3)

| Status | Count |
|--------|-------|
| Fixed in project | V2-2, V2-3, V2-4, PS-06, P3-NEW, P0-NEW, P2-17, P3-12 |
| Fixed in AuditRepo (pending) | PS-01, P0-10, PS-06, PS-07, P0-7, P0-8 |
| FALSE POSITIVE | P3-8, P1-13 |
| **Active** | **~52** |

---

## 🔜 NEXT STEPS

1. **P2-18 Fix** — Implement base href-aware path construction in MapEngine
2. **P1-14/15/16 Fix** — Add GBS2 control handlers to Baptisty pages (either in site.js or via enhancements)
3. **P1-5 Resolution** — Address page-ownership.json vs route-migration-matrix.json conflict
4. Continue exploration of `_build-tools/`, `docs/`, refactor areas

---

## Validation Results

| Check | Status |
|-------|--------|
| `npm run data:consistency` | ✅ |
| `npm run migration:metadata:check` | ✅ |
| `npm run native:runtime:audit:strict` | ✅ |
| `npm run workflows:check` | ✅ |
| `npm run guard:shared-files` | ✅ |
| `npm run content:parity` | ✅ |
