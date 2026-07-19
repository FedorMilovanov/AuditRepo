# Verifier Synthesis: Cartographic Drawing Quality & Vector Basemap Audit

**Synthesis Date:** 2026-07-20  
**Target HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Focus Area:** Quality evaluation of basemaps, SVG drawings, route vector rendering, architectural glyphs, label plates, typography, region rendering, filter performance, and draft sheet pipeline against Option 1 Aesthetic Canon ("ВАРИАНТ 1").

---

## 1. Synthesis Overview

This synthesis aggregates the findings from our deep quality audit on both the live web engine (`map-engine.js`) and the offline draft visual sheet engine (`sheet-engine.js`).

### The Fundamental Quality Gap in Both Engines
The current implementation across the 11 biblical maps is **not top quality in either pipeline**.
Even the offline "visual draft sheets" (`sheet-engine.js`) built to establish the ideal visual design rely on primitive geometric shortcuts, crude Catmull-Rom math splines, and missing data:

Key Draft Visual Sheet Breakdown Items (`sheet-engine.js`):
1. **Geometric Stretched Ellipse Mountain Relief (`RELIEF-P1-01`):**
   Mountain ranges in `sheet-engine.js:182–203` are represented by primitive rotated SVG `<ellipse>` shapes with 45-degree diagonal line hatching. The Mediterranean world uses only 3 ellipses for all mountain chains, and `urheimat` (Genesis 1–11) has zero relief (`''`).
2. **Sequential Unbranching Catmull-Rom Spline Bowing (`ROUTE-P1-01`):**
   Trade routes in `sheet-engine.js` are constructed using a single Catmull-Rom spline, which bows into sea polygons unless artificial `route_via` support points are manually inserted after place IDs in `route.json`.
3. **Glyph Data Absence Across 82% of Datasets (`GLYPH-P1-01`):**
   9 out of 11 route JSON datasets (`early-church`, `ishod`, `maccabim`, `melachim`, `pavel`, `revelation`, `shoftim`, `shvatim`, `yeshua`) contain zero `glyph` properties, rendering 82% of maps as plain circles even in `sheet-engine.js`.

Key Live Engine Breakdown Items (`map-engine.js`):
1. **Unrendered `route.regions` Polygons (`REG-P1-01`):**
   `map-engine.js` lacks code to render `route.regions`, leaving the 12 Tribes map (`shvatim`) without any tribal allotment borders or color fills.
2. **`feTurbulence` Animation Loop Jank (`PERF-P1-01`):**
   Continuous 14s SVG animation on sea turbulence forces full-canvas CPU/GPU re-rasterization on every frame, causing frame drops (15–20 fps) during drag/zoom gestures on mobile GPUs.
3. **Broken / Dark Basemaps & Missing Symbols (`BASE-P1-01`..`04`):**
   Loading `base-geo.svg` fails to resolve fills and mountain symbols because `<defs>` is empty and 18 referenced IDs are missing. `map-engine.js` forces a 50% opacity mask on the background over a dark navy rectangle (`#0d1d2e`).
4. **Dual Engine Divergence (`ARCH-P1-01`):**
   The warm parchment atlas aesthetic (`GEO_DEFS`, symbols, light palette) exists exclusively inside Node.js build tools (`scripts/lib/sheet-engine.js`).

---

## 2. Actionable Engineering Recommendations

To achieve Option 1 Aesthetic Canon quality:

1. **Replace Stretched Ellipses with Authentic Cartographic Hachure / Shaded Ridge Artwork (`RELIEF-P1-01`):**
   - Refactor mountain rendering in `base-geo.svg` and `sheet-engine.js` to use detailed vector mountain ridge paths (`#peak`, `#peak-snow`, `#hill`) with non-scaling strokes and northwest lighting highlights.

2. **Implement Multi-Segment & Branching Route Geometry (`ROUTE-P1-01`):**
   - Replace single Catmull-Rom splines with explicit stage-by-stage Bezier curves (`stages[].paths`) or multi-path splines that respect land barriers.

3. **Complete Architectural Icon Sets for All 11 Maps (`GLYPH-P1-01`, `DRAW-P1-03`):**
   - Author `glyph` properties for places across all 11 `route.json` datasets (gates, towers, tents, altars, tabernacles, temples, ports).

4. **Implement `route.regions` Territory Rendering in Engine (`REG-P1-01`):**
   - Add region polygon rendering (`<path class="region-fill"/>` and `<path class="region-border"/>`) to `map-engine.js` so `shvatim` and other territorial maps render their respective allotment borders and tint fills.

5. **Optimize Filter Performance (`PERF-P1-01`):**
   - Replace continuous JS/SVG `baseFrequency` animation loops on heavy `feTurbulence` filters with CSS static noise or low-overhead SVG patterns.
