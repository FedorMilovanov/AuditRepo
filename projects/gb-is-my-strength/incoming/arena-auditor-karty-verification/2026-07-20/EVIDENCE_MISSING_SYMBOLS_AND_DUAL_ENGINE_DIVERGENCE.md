# Evidence Report: Missing Symbol Definitions & Dual Engine Architecture Divergence

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/_engine/base-geo.svg`, `/karty/_engine/map-engine.js`, `/scripts/lib/sheet-engine.js`

---

## 1. Executive Summary

A deep technical inspection of the vector symbol linkage and rendering pipelines reveals two major architectural breakdowns:

1. **18 Missing ID Linkages in `karty/_engine/base-geo.svg`:**
   - Mountain peak symbols (`#hill`, `#peak`, `#peak-snow`) and terrain label paths (`#canaanRidge`) referenced in `base-geo.svg` are completely undefined.
   - An XML symbol cross-reference check shows 18 referenced definition IDs missing from `base-geo.svg`:
     `['canaanRidge', 'desertG', 'desertStipple', 'edgeFog', 'fertileG', 'hill', 'jordanG', 'landG', 'mountainHatch', 'mtG', 'negevG', 'peak', 'peak-snow', 'seaG', 'seaPattern', 'sinaiG', 'soft', 'waterRipple']`.
   - Result: Mountain ranges across Lebanon, Hermon, Ebal, Gerizim, Sinai, and Judea render with invisible or broken peak symbols when loaded by `map-engine.js`.

2. **Dual Engine Architecture Divergence (`map-engine.js` vs `sheet-engine.js`):**
   - The production client-side engine (`karty/_engine/map-engine.js`) used on live web routes (`/karty/ishod/`, `/karty/avraam/`, holding pages) fetches raw `base-geo.svg` with empty `<defs>` and applies `opacity="0.5"`.
   - Rich parchment definition sets (`GEO_DEFS`, `#peak`, `#peak-snow`, `#hill`, `#cornerOrn`, `#camel`) exist ONLY inside Node.js build scripts (`scripts/lib/sheet-engine.js`) used for static preview pages (`audit/atlas-preview/sheet-*.html`).
   - The live web app renders a dark, broken schematic map, while the parchment atlas aesthetic is isolated in non-interactive build previews.

---

## 2. Source Code Evidence

### Evidence Item 1: Missing Peak Uses in `karty/_engine/base-geo.svg`
```xml
<!-- File: /home/user/gb-is-my-strength/karty/_engine/base-geo.svg (lines 47-50) -->
  <g opacity=".5">
    <use href="#hill" x="700" y="472" width="14" height="8"/>
    <use href="#peak-snow" x="688" y="490" width="18" height="14"/>
    <use href="#peak" x="678" y="516" width="15" height="11"/>
  </g>
```
- **Analysis:** `#hill`, `#peak-snow`, and `#peak` do not exist anywhere in `base-geo.svg`.

### Evidence Item 2: Defs Isolation in `scripts/lib/sheet-engine.js`
```javascript
// File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (lines 35-120)
const GEO_DEFS = `<defs>
  <linearGradient id="landG" ...>
  <symbol id="peak" ...>
  <symbol id="peak-snow" ...>
  <symbol id="hill" ...>
`;
```
- **Analysis:** `GEO_DEFS` is hardcoded inside a Node.js module and unavailable to client-side `map-engine.js`.

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **BASE-P1-04** | 18 missing ID references in `base-geo.svg` including mountain peak symbols (`#hill`, `#peak`, `#peak-snow`, `#canaanRidge`) | `karty/_engine/base-geo.svg:47` | **VERIFIED OPEN** |
| **ARCH-P1-01** | Dual engine architecture divergence between live `map-engine.js` (dark schematic) and Node.js `sheet-engine.js` (parchment atlas) | `karty/_engine/map-engine.js:2603` | **VERIFIED OPEN** |
