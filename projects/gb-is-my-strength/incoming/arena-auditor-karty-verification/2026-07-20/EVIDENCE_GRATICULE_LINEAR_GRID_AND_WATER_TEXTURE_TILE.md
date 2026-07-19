# Evidence Report: Linear Coordinate Grid, Sea Tile Repetition & Cartouche Primitive Ornaments

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/scripts/lib/sheet-engine.js`

---

## 1. Executive Summary

Continuing our deep quality evaluation of the draft sheet vector engine (`sheet-engine.js`), four additional graphic and mathematical compromises were verified:

1. **Linear Unprojected Affine Grid Equations (`GRAT-P1-01`):**
   - In `sheet-engine.js:437–441`, coordinate conversions (`lonToX` and `latToY`) use naive linear equations (`x = 623 + (lon - 35.22) * 100`).
   - Earth is treated as a flat 2D Cartesian plane without projection curvature.
   - `graticule()` renders tick marks along the frame border only, omitting longitude and latitude grid lines across the map body.

2. **Repetitive 20px Sea Water Tile Pattern (`SEA-P1-01`):**
   - In `sheet-engine.js:52`, `#seaPattern` repeats a 20×20px square containing two sine wave paths across the entire Mediterranean and sea bodies.
   - Across a 1900×1430 map canvas, this generates a mechanical grid tile repetition instead of hand-drawn coastal wave contours.

3. **Primitive 3-Line Corner Ornaments (`ORN-P1-01`):**
   - In `sheet-engine.js:98`, cartouche corner symbol `#cornerOrn` is composed of two basic 1-unit arcs and a circle dot (`<path d="M15,3 H6 Q3,3 3,6 V15"/>`).
   - This primitive 3-line flourish fails to deliver the intricate woodcut engraving aesthetic expected of historical cartouche framing.

4. **Dead `halos` Array & Letterform Stroke Blur (`HALO-P1-01`):**
   - `sheet-engine.js:579, 822` declares `const halos = []` and joins it into the SVG DOM without ever populating it.
   - Text legibility relies on a CSS `stroke: rgba(245,237,216,.88)` on `<text>` elements, which encroaches on letter counters and blurs small 10–11px typography.

---

## 2. Source Code Evidence

### Evidence Item 1: Linear Unprojected Affine Grid Math
```javascript
// File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (lines 437-441)
const GRID = {
  levant: { lonToX: (L) => 623 + (L - 35.22) * 100, latToY: (B) => 800 - (B - 31.78) * 120, lonStep: 2, latStep: 2, maxY: 950 },
  mediterranean: { lonToX: (L) => 40 + (L - 10) * 65, latToY: (B) => 120 + (43 - B) * 82, lonStep: 4, latStep: 2, maxY: Infinity },
  urheimat: { lonToX: (L) => 40 + (L - 38) * 130, latToY: (B) => 60 + (40 - B) * 130, lonStep: 2, latStep: 2, maxY: Infinity },
};
```

### Evidence Item 2: Mechanical 20px Sea Tile Pattern
```xml
<!-- File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (lines 52-55) -->
  <pattern id="seaPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M0,10 Q5,6 10,10 Q15,14 20,10" fill="none" stroke="#5f8c8b" stroke-width=".6" opacity=".34"/>
    <path d="M0,20 Q5,16 10,20 Q15,24 20,20" fill="none" stroke="#5f8c8b" stroke-width=".5" opacity=".24"/>
  </pattern>
```

### Evidence Item 3: Dead `halos` Array
```javascript
// File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (lines 579 & 822)
  const dots = [], labels = [], leaders = [], glyphs = [], halos = [];
...
${halos.join('')}
```

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **GRAT-P1-01** | Linear unprojected affine grid equations cause geographic distortion and lack interior grid lines | `scripts/lib/sheet-engine.js:437` | **VERIFIED OPEN** |
| **SEA-P1-01** | Mechanical 20px `#seaPattern` tiling creates a repeating grid artifact over ocean bodies | `scripts/lib/sheet-engine.js:52` | **VERIFIED OPEN** |
| **ORN-P1-01** | Cartouche corner flourish `#cornerOrn` uses primitive 3-line arcs lacking historical engraving detail | `scripts/lib/sheet-engine.js:98` | **VERIFIED OPEN** |
| **HALO-P1-01** | Unused dead `halos` array and CSS text stroke encroaching on small 10–11px typography counters | `scripts/lib/sheet-engine.js:579` | **VERIFIED OPEN** |
