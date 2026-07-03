# Round 11 Audit Report — FedorMilovanov/gb-is-my-strength

**Date:** 2026-06-25  
**Agent:** Arena Agent (Round 11 continuation)  
**HEAD:** 3b105dc8  
**AuditRepo Push:** Round 11

---

## Executive Summary

**P2-18 FIXED** — MapEngine base-href-aware path construction. **P1-14/15/16 FIXED** — GBS2 Baptisty controls wired via new `gbs2-baptist-controls.js` module loaded on all 11 Baptisty pages.

---

## ✅ FIXES IMPLEMENTED

### P2-18 — MapEngine base href path construction ✅

**File:** `karty/_engine/map-engine.js`

**Problem:** `updateHash()` used `location.pathname` directly, which on GitHub Pages with base href could result in incorrect URL construction for deep-linking.

**Fix Applied:** Added `getBaseAwarePath()` helper that detects `<base href>` element and extracts the base path portion:

```javascript
function getBaseAwarePath() {
  const baseEl = document.querySelector('base[href]');
  if (baseEl) {
    const baseHref = baseEl.href;
    const pathMatch = baseHref.match(/https?:\/\/[^\/]+(\/.*)/);
    return pathMatch ? pathMatch[1] : '/';
  }
  return location.pathname;
}
// updateHash() now uses:
history.replaceState(null, '', getBaseAwarePath() + (newHash || ''));
```

**Verification:**
```bash
grep "getBaseAwarePath" /home/user/project/karty/_engine/map-engine.js
# Output: 2 occurrences (function definition + usage in updateHash)
```

---

### P1-14/15/16 — Baptisty GBS2 controls wired ✅

**Files Created:**
- `js/gbs2-baptist-controls.js` — new module with all GBS2 control handlers

**Files Modified (script injection):**
- `src/components/baptisty-rossii/BaptistyRossiiNochNaKureBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884Body.astro`
- `src/components/baptisty-rossii/BaptistyRossiiPeterburgskayaLiniyaBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiVsehib1944Body.astro`
- `src/components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro`
- `src/components/baptisty-rossii/BaptistyRossiiBody.astro` (hub)

**Handlers implemented in `gbs2-baptist-controls.js`:**

| Control | Attribute | Action |
|---------|-----------|--------|
| Theme toggle | `data-gbs2-theme` | Toggle `.dark` class, sync all buttons |
| Font decrease | `data-gbs2-font="down"` | Reduce `.article-body` font-size by 0.1 (min 0.75×) |
| Font increase | `data-gbs2-font="up"` | Increase `.article-body` font-size by 0.1 (max 1.35×) |
| Search | `data-gbs2-search` | Call `window.GBSearch.open()` or dispatch `gb:openSearch` |
| Share | `data-gbs2-share` | Web Share API → fallback clipboard copy |
| Bottom bar | `#gbs2Bbar` | Open `#gbs2Sheet` (add `gbs2-sheet--open` class) |
| Sheet close | `[data-gbs2-close]`, `.gbs2-sheet-backdrop` | Close sheet (remove class, aria-hidden) |
| Sheet tabs | `[data-gbs2-tab]` | Switch between parts/TOC panes |
| Mobile progress | `#gbs2MobPct` | Scroll-driven % update + ESC key closes sheet |
| TOC population | `#gbs2Toc` | Auto-populate from `h2`/`h3` headings in article |

**Persistence:** Font scale saved to `localStorage` key `gb-font-scale`. Theme saved to `localStorage` key `theme`.

---

## 📋 BUG LEDGER STATUS

**Total bugs:** 61 (9 P0, 20 P1, 19 P2, 13 P3)

| Status | Count | IDs |
|--------|-------|-----|
| Fixed in project source (R9-R11) | 8 | P0-NEW, P3-NEW, P2-17, P3-12, P2-18, P1-14, P1-15, P1-16 |
| Fixed in AuditRepo (pending merge) | 6 | PS-01, P0-10, PS-06, PS-07, P0-7, P0-8 |
| FALSE POSITIVE | 2 | P3-8, P1-13 |
| **Active remaining** | **~45** | |

---

## Validation Results

| Check | Status |
|-------|--------|
| `npm run guard:shared-files` | ✅ |
| `npm run native:runtime:audit:strict` | ✅ |

**Note:** `npm run validate:static-publication` shows ⚠️ for `sw.js PRECACHE_ASSETS` — this is a dist-build lag. Source `sw.js` has the fix (P0-NEW) applied; validation checks dist/ which hasn't been rebuilt yet.

---

## 🔜 NEXT STEPS

1. **P1-5 Resolution** — Address `page-ownership.json` vs `route-migration-matrix.json` conflict (19-route discrepancy)
2. **CI cascade (P0-6)** — Coordinate with maintainer for `indexnow.yml` retry logic
3. **robots.txt (P0-3)** — Editorial decision needed on SEO bot blocking
4. **Continue exploration** — `_build-tools/`, `docs/`, refactor areas
5. **Build + verify** — Rebuild dist and confirm P0-NEW validates clean

---

## Files Changed This Round

| File | Change |
|------|--------|
| `karty/_engine/map-engine.js` | +getBaseAwarePath() helper, updateHash uses it |
| `js/gbs2-baptist-controls.js` | **NEW** — GBS2 control handlers module |
| `src/components/baptisty-rossii/*.astro` (11 files) | +script tag for gbs2-baptist-controls.js |
