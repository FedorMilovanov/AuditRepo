# Verifier Synthesis: Cartographic Drawing Quality & Vector Basemap Audit

**Synthesis Date:** 2026-07-20  
**Target HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Focus Area:** Quality evaluation of basemaps, SVG drawings, route vector rendering, architectural glyphs, label plates, and cartographic aesthetics against Option 1 Aesthetic Canon ("ВАРИАНТ 1").

---

## 1. Synthesis Overview

This synthesis aggregates the findings from our deep quality audit on the vector drawing assets and map rendering pipeline of `/karty/`.

### The Fundamental Quality Gap
The current implementation across the 11 biblical maps is **not top quality**; it is built on placeholder mechanics, crude monospace calculations, unanchored UI elements, and broken architectural abstractions.

While the project's documentation references historical research and coordinate spaces, the actual rendered result in `MapEngine` defaults to:
1. **Broken / Dark Basemaps:** Loading `base-geo.svg` fails to resolve fill colors because `<defs>` is empty. `map-engine.js` forces a 50% opacity mask on the background and renders dark navy rectangles (`#0d1d2e`).
2. **Straight-Line Geometries:** Rather than following curved trade routes (`stages[].paths`), `map-engine.js` draws straight `L` lines across mountains and seas.
3. **Generic Circle Nodes:** Place markers are plain SVG circles (`r=4.5`). Zero architectural icons exist across the dataset.
4. **Clipped Text Plates:** Label backgrounds use `length * 0.6 * 10` estimation, cutting off wide Cyrillic and Hebrew text.
5. **Floating Rivers & Distorted Compass:** Sea ripple displacement scale=7 detaches river mouths, and the compass rose pans/zooms in world space instead of locking to the viewport UI.

---

## 2. Actionable Engineering Recommendations

To bring the biblical maps section to Option 1 Aesthetic Canon quality:

1. **Fix Basemap Defs & Warm Parchment Palette (`BASE-P1-01`..`03`):**
   - Populate `karty/_engine/base-geo.svg` with self-contained `<defs>` or have `MapEngine.createMap` automatically inject a standardized parchment palette (`#f4eee0` land, `#2e4d6b` stroke, warm ivory label plates, high-contrast aquatic blue sea).
   - Remove `opacity="0.5"` from `me-base-geo` in `map-engine.js:2612`.
   - Remove dark mode charcoal fill and night sky star overlay from `avraam/base.svg`.

2. **Enable Curved SVG Trade Route Path Rendering (`DATA-P0-01`):**
   - Refactor `map-engine.js` `renderMarkers`/`renderPaths` to check for `stage.paths` array or smooth Bezier spline interpolation (`M...C...` / `M...Q...`) between places.

3. **Implement Architectural Icon System (`DRAW-P1-03`):**
   - Create a set of handcrafted SVG city glyphs (gate, tower, tent, tabernacle, altar, temple, port, battle) and map `place.icon` in `route.json` to these symbols.

4. **Dynamic SVG Text Measurement for Label Plates (`TEXT-P1-01`):**
   - Replace `length * fontSize * 0.6` estimation with `SVGTextElement.getBBox()` or precise character width tables, wrapped in warm vellum/parchment plate rectangles with subtle drop shadows.

5. **Anchor Compass and Fix Mobile Scale Bar (`MAP-P1-11`..`12`):**
   - Move `#me-compass` into a viewport UI layer outside the panning `<svg>` space.
   - Update `updateScaleBar()` to use `container.clientWidth` instead of constant `W0 = 1900`.
