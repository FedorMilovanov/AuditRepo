# Verifier Synthesis: Cartographic Drawing Quality & Vector Basemap Audit

**Synthesis Date:** 2026-07-20  
**Target HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Focus Area:** Quality evaluation of basemaps, SVG drawings, route vector rendering, architectural glyphs, label plates, typography, and cartographic aesthetics against Option 1 Aesthetic Canon ("ВАРИАНТ 1").

---

## 1. Synthesis Overview

This synthesis aggregates the findings from our deep quality audit on the vector drawing assets and map rendering pipeline of `/karty/`.

### The Fundamental Quality Gap
The current implementation across the 11 biblical maps is **not top quality**; it is built on placeholder mechanics, crude monospace calculations, unanchored UI elements, and broken architectural abstractions.

Key Structural & Vector Quality Breakdown Items:
1. **Broken / Dark Basemaps & Missing Symbols (`BASE-P1-01`..`04`):**
   Loading `base-geo.svg` fails to resolve fills and mountain symbols because `<defs>` is empty and 18 referenced IDs (including `#hill`, `#peak`, `#peak-snow`, `#canaanRidge`, `#landG`) are missing. `map-engine.js` forces a 50% opacity mask on the background over a dark navy rectangle (`#0d1d2e`).
2. **Dual Engine Divergence (`ARCH-P1-01`):**
   The warm parchment atlas aesthetic (`GEO_DEFS`, symbols, light palette) exists exclusively inside Node.js build tools (`scripts/lib/sheet-engine.js`) for non-interactive static HTML previews. The live production web client (`map-engine.js`) renders a dark schematic map.
3. **Invalid XML Entity Exports (`SVG-P1-01`):**
   Exported standalone SVG assets in `images/atlas-export/*.svg` contain raw `&nbsp;` HTML entities, crashing standard XML parsers.
4. **Incorrect Hebrew Font-Family Fallback (`FONT-P1-01`):**
   `.hw` class in `map-engine.js:463` declares `font-family: Georgia, "Times New Roman"`, forcing system default sans-serif font fallbacks for Hebrew text instead of using `Noto Serif Hebrew`.
5. **Bare Inset Minimap (`MINI-P1-01`):**
   Minimap renders place dots over a bare black box without coastlines, rivers, or terrain contours, and monkey-patches `flyTo` globally.
6. **Destructive Style Cleanup (`CSS-P1-01`):**
   Calling `destroy()` on a map instance removes `<style id="me-base-css">` from `<head>`, stripping styling from any other map instance on the page.
7. **Straight-Line Geometries (`DATA-P0-01`, `DATA-P2-01`):**
   `map-engine.js` draws straight `L` lines across mountains and seas, ignoring `stages[].paths`. Moreover, 10 out of 11 maps lack curved path definitions altogether.
8. **Generic Circle Nodes (`DRAW-P1-03`):**
   Place markers are plain SVG circles (`r=4.5`). Zero architectural icons exist across the dataset.
9. **Clipped Text Plates (`TEXT-P1-01`):**
   Label backgrounds use `length * 0.6 * 10` estimation, cutting off wide Cyrillic and Hebrew text.

---

## 2. Actionable Engineering Recommendations

To bring the biblical maps section to Option 1 Aesthetic Canon quality:

1. **Unify Parchment Definitions into Core Engine (`BASE-P1-01`..`04`, `ARCH-P1-01`):**
   - Populate `karty/_engine/base-geo.svg` with self-contained `<defs>` (including `#hill`, `#peak`, `#peak-snow`, `#canaanRidge`, `#landG`, `#seaG`).
   - Align `map-engine.js` with `sheet-engine.js` to eliminate the dark schematic fallbacks and render a warm parchment atlas.
   - Remove `opacity="0.5"` from `me-base-geo` in `map-engine.js:2612`.

2. **Fix Hebrew Typography & CSS Style Lifecycle (`FONT-P1-01`, `CSS-P1-01`):**
   - Update `.hw` styling in `map-engine.js` to use `font-family: "Noto Serif Hebrew", serif; direction: rtl`.
   - Protect `<style id="me-base-css">` with a reference counter in `_cleanupAll()` so instance destruction does not unstyle sibling maps.

3. **Clean XML Entities in Export Pipeline (`SVG-P1-01`):**
   - Update `atlas-export-sheet.js` to sanitize HTML entities (replace `&nbsp;` with `&#160;` or regular spaces) prior to saving standalone SVG files.

4. **Add Vector Geography to Minimap (`MINI-P1-01`):**
   - Include simplified coastline paths inside the minimap SVG so users see regional contours behind place dots.

5. **Enable Curved SVG Trade Route Path Rendering (`DATA-P0-01`, `DATA-P2-01`):**
   - Refactor `map-engine.js` `renderMarkers`/`renderPaths` to check for `stage.paths` or smooth Bezier spline interpolation between places. Author curved trade route paths for the remaining 10 maps.

6. **Implement Architectural Icon System (`DRAW-P1-03`):**
   - Create a set of handcrafted SVG city glyphs (gate, tower, tent, tabernacle, altar, temple, port, battle) and map `place.icon` in `route.json` to these symbols.

7. **Dynamic SVG Text Measurement for Label Plates (`TEXT-P1-01`):**
   - Replace `length * fontSize * 0.6` estimation with `SVGTextElement.getBBox()` or precise character width tables.
