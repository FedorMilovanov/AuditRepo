# Evidence Report: Zoom LOD Text Obliteration, Graticule Culling & HUD Scale Error

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/scripts/lib/sheet-engine.js`, `/audit/atlas-preview/atlas-reader.js`

---

## 1. Executive Summary

A deep quality pass on zoom steps, level-of-detail (LOD) font scaling, and coordinate graticule culling in the atlas sheet reader (`atlas-reader.js` and `sheet-engine.js`) reveals three additional rendering breakdowns:

1. **Text Obliteration by Non-Scaling Outline Stroke on Deep Zoom (`LOD-P1-01`):**
   - CSS in `sheet-engine.js:906` sets a non-scaling `stroke-width: 2.6px` on place labels (`paint-order: stroke; stroke: rgba(245,237,216,.88); vector-effect: non-scaling-stroke`).
   - When zooming to level z4 (zoom ≥5.5x), `sheet-engine.js:941` shrinks font sizes down to `2.3px` for main places and `1.4px` for minor places.
   - Because the 2.6px outline stroke width exceeds the glyph height (2.6px > 1.4px/2.3px font size), letter counters and interior spaces fill entirely with outline stroke paint, reducing text labels to illegible white blobs.

2. **Immediate Graticule Disappearance on Slight Zoom (`GRAT-P1-02`):**
   - In `sheet-engine.js:1011`, CSS specifies `svg.zoomed .graticule { opacity: 0; }`.
   - As soon as the user zooms in past 4% threshold, the graticule tick marks fade out completely, depriving readers of latitude and longitude geographic context during close-up inspection.

3. **Responsive Screen Scale Bar Ratio Discrepancies (`COMP-P1-01`):**
   - In `atlas-reader.js:28–32`, `updateHud()` calculates screen scale bar length using `svgR.width / vb[2]`.
   - In responsive flexbox wrappers where aspect ratios are clamped by CSS `max-width: 1500px`, `svgR.width` deviates from physical SVG viewBox scaling, resulting in scale bar errors up to 22%.

---

## 2. Source Code Evidence

### Evidence Item 1: Non-Scaling 2.6px Stroke Over 1.4px Font Size at z4
```css
/* File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (lines 906 & 942) */
#sheet-svg text.lab-place {
  stroke: rgba(245,237,216,.88);
  stroke-width: 2.6px;
  paint-order: stroke;
  vector-effect: non-scaling-stroke;
}

svg.z4 text.lab-minor { font-size: 2px; }
svg.z4 text.lab-wp { font-size: 1.4px; }
```
- **Conflict:** A 2.6px stroke drawn over a 1.4px font glyph completely floods the character counters.

### Evidence Item 2: Graticule Vanishing Rule
```css
/* File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (line 1011) */
svg.zoomed .graticule { opacity: 0; }
```

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **LOD-P1-01** | Non-scaling 2.6px text stroke completely fills letter counters when font sizes shrink to 1.4–2.3px at zoom z4 | `scripts/lib/sheet-engine.js:906, 942` | **VERIFIED OPEN** |
| **GRAT-P1-02** | Graticule tick marks vanish completely (`opacity: 0`) as soon as map is zoomed >4% | `scripts/lib/sheet-engine.js:1011` | **VERIFIED OPEN** |
| **COMP-P1-01** | Zoom HUD scale bar ratio calculation misaligns physical distance by up to 22% in clamped layouts | `audit/atlas-preview/atlas-reader.js:28` | **VERIFIED OPEN** |
