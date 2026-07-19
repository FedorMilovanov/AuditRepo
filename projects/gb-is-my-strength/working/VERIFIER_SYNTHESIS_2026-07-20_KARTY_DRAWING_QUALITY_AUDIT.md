# Verifier Synthesis: Cartographic Drawing Quality & Vector Basemap Audit

**Synthesis Date:** 2026-07-20  
**Target HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Focus Area:** Quality evaluation of basemaps, SVG drawings, route vector rendering, architectural glyphs, label plates, typography, region rendering, filter performance, and cartographic aesthetics against Option 1 Aesthetic Canon ("ВАРИАНТ 1").

---

## 1. Synthesis Overview

This synthesis aggregates the findings from our deep quality audit on the vector drawing assets and map rendering pipeline of `/karty/`.

### The Fundamental Quality Gap
The current implementation across the 11 biblical maps is **not top quality**; it is built on placeholder mechanics, crude monospace calculations, unanchored UI elements, and broken architectural abstractions.

Key Structural & Vector Quality Breakdown Items:
1. **Unrendered `route.regions` Polygons (`REG-P1-01`):**
   `map-engine.js` completely lacks logic for rendering `route.regions`. On the 12 Tribes of Israel map (`shvatim`), 13 tribal allotment polygons fail to render entirely, leaving an empty map without territory borders or tint fills.
2. **`feTurbulence` Animation Loop Jank (`PERF-P1-01`):**
   Continuous 14s SVG animation on sea turbulence forces full-canvas CPU/GPU re-rasterization on every frame, causing frame drops (15–20 fps) during drag/zoom gestures on mobile GPUs.
3. **Broken / Dark Basemaps & Missing Symbols (`BASE-P1-01`..`04`):**
   Loading `base-geo.svg` fails to resolve fills and mountain symbols because `<defs>` is empty and 18 referenced IDs (including `#hill`, `#peak`, `#peak-snow`, `#canaanRidge`, `#landG`) are missing. `map-engine.js` forces a 50% opacity mask on the background over a dark navy rectangle (`#0d1d2e`).
4. **Dual Engine Divergence (`ARCH-P1-01`):**
   The warm parchment atlas aesthetic (`GEO_DEFS`, symbols, light palette) exists exclusively inside Node.js build tools (`scripts/lib/sheet-engine.js`) for non-interactive static HTML previews. The live production web client (`map-engine.js`) renders a dark schematic map.
5. **Invalid XML Entity Exports (`SVG-P1-01`):**
   Exported standalone SVG assets in `images/atlas-export/*.svg` contain raw `&nbsp;` HTML entities, crashing standard XML parsers.
6. **Incorrect Hebrew Font-Family Fallback (`FONT-P1-01`):**
   `.hw` class in `map-engine.js:463` declares `font-family: Georgia, "Times New Roman"`, forcing system default sans-serif font fallbacks for Hebrew text instead of using `Noto Serif Hebrew`.
7. **Bare Inset Minimap (`MINI-P1-01`):**
   Minimap renders place dots over a bare black box without coastlines, rivers, or terrain contours, and monkey-patches `flyTo` globally.
8. **Destructive Style Cleanup (`CSS-P1-01`):**
   Calling `destroy()` on a map instance removes `<style id="me-base-css">` from `<head>`, stripping styling from any other map instance on the page.
9. **Straight-Line Geometries (`DATA-P0-01`, `DATA-P2-01`):**
   `map-engine.js` draws straight `L` lines across mountains and seas, ignoring `stages[].paths`. Moreover, 10 out of 11 maps lack curved path definitions altogether.
10. **Generic Circle Nodes (`DRAW-P1-03`):**
   Place markers are plain SVG circles (`r=4.5`). Zero architectural icons exist across the dataset.
11. **Clipped Text Plates (`TEXT-P1-01`):**
   Label backgrounds use `length * 0.6 * 10` estimation, cutting off wide Cyrillic and Hebrew text.

---

## 2. Actionable Engineering Recommendations

To bring the biblical maps section to Option 1 Aesthetic Canon quality:

1. **Implement `route.regions` Territory Rendering in Engine (`REG-P1-01`):**
   - Add region polygon rendering (`<path class="region-fill"/>` and `<path class="region-border"/>`) to `map-engine.js` so `shvatim` and other territorial maps render their respective allotment borders and tint fills.

2. **Optimize Filter Performance (`PERF-P1-01`):**
   - Replace continuous JS/SVG `baseFrequency` animation loops on heavy `feTurbulence` filters with CSS static noise or low-overhead SVG patterns to maintain 60 fps during pan/zoom drag.

3. **Unify Parchment Definitions into Core Engine (`BASE-P1-01`..`04`, `ARCH-P1-01`):**
   - Populate `karty/_engine/base-geo.svg` with self-contained `<defs>` (including `#hill`, `#peak`, `#peak-snow`, `#canaanRidge`, `#landG`, `#seaG`).
   - Align `map-engine.js` with `sheet-engine.js` to eliminate the dark schematic fallbacks and render a warm parchment atlas.
   - Remove `opacity="0.5"` from `me-base-geo` in `map-engine.js:2612`.

4. **Fix Hebrew Typography & CSS Style Lifecycle (`FONT-P1-01`, `CSS-P1-01`):**
   - Update `.hw` styling in `map-engine.js` to use `font-family: "Noto Serif Hebrew", serif; direction: rtl`.
   - Protect `<style id="me-base-css">` with a reference counter in `_cleanupAll()` so instance destruction does not unstyle sibling maps.

5. **Clean XML Entities in Export Pipeline (`SVG-P1-01`):**
   - Update `atlas-export-sheet.js` to sanitize HTML entities (replace `&nbsp;` with `&#160;` or regular spaces) prior to saving standalone SVG files.

6. **Add Vector Geography to Minimap (`MINI-P1-01`):**
   - Include simplified coastline paths inside the minimap SVG so users see regional contours behind place dots.

7. **Enable Curved SVG Trade Route Path Rendering (`DATA-P0-01`, `DATA-P2-01`):**
   - Refactor `map-engine.js` `renderMarkers`/`renderPaths` to check for `stage.paths` or smooth Bezier spline interpolation between places. Author curved trade route paths for the remaining 10 maps.

8. **Implement Architectural Icon System (`DRAW-P1-03`):**
   - Create a set of handcrafted SVG city glyphs (gate, tower, tent, tabernacle, altar, temple, port, battle) and map `place.icon` in `route.json` to these symbols.

9. **Dynamic SVG Text Measurement for Label Plates (`TEXT-P1-01`):**
   - Replace `length * fontSize * 0.6` estimation with `SVGTextElement.getBBox()` or precise character width tables.
