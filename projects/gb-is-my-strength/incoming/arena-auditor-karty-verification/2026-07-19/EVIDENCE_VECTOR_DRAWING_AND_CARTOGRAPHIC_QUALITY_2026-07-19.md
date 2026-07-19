# EVIDENCE: FORENSIC AUDIT OF VECTOR DRAWING QUALITY, CARTOGRAPHIC PRIMITIVES, AND "NACHALO" DRAFT SHEET

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`  
**Subsystem:** Vector Topology, Cartographic Precision, `nachalo` Draft Sheet, Route Geometry, and Drawing Architecture

---

## 1. Executive Verdict: Top Quality Basemaps vs Engine Drawing Crutches

A comprehensive vector geometry and code audit was conducted on all SVG basemaps (`base.svg`, `base-geo.svg`) and MapEngine rendering routines:

### Where the Project Achieves "Top Quality" ("Топ Качество")
- **Base Hydrography & Coastlines:** The underlying geographic shapes in `avraam/base.svg` (72 KB, 113 paths) and `_engine/base-geo.svg` (87 paths) feature **high-precision Bezier vector curves** (77 smooth Bezier paths, 574 vector control nodes). The Mediterranean shoreline, Dead Sea, Sea of Galilee, Euphrates, Tigris, and Jordan rivers are authentic, hand-crafted historical vector shapes.

### Where the Implementation Relies on "Hacks & Crutches" ("Костыли и слабые решения")

1. **Straight-Line Auto-Routing Crutch (`DATA-P0-01`):**
   - **File:** `karty/_engine/map-engine.js:1297`
   - **Crutch:** MapEngine connects places using crude straight `L` line segments (`${j===0?'M':'L'}${p.x},${p.y}`). Instead of following curved historical roads (Via Maris, King's Highway) or river valleys, it draws rigid geometric zig-zags directly through mountains and deserts, downgrading an atmospheric map into a primitive schematic node graph.

2. **Hardcoded Fixed-Offset Collision Crutch (`DRAW-P1-01`):**
   - **File:** `karty/_engine/map-engine.js:1509–1512`
   - **Crutch:** Label placement uses a hardcoded 100×16px distance check that applies a fixed `12px` shift. It lacks dynamic multi-quadrant anchor placement or leader line raycasting. In dense clusters (Jerusalem, Judaea, Galilee), labels overlap or obscure city dots.

3. **Missing Filter Defs & Doubled Channel Hack (`RIVER-P1-02`, `RIVER-P1-05` / `DRAW-P1-02`):**
   - **File:** `karty/_engine/base-geo.svg`
   - **Crutch:** `<g filter="url(#waterRipple)">` is declared on sea polygons, but the `#waterRipple` filter definition was omitted from `<defs>`. Rather than restoring the filter, developer notes acknowledge leaving overlapping duplicate river paths:
     `<!-- с waterRipple дублировал легаси-русло и дал «сдвоенную линию» -->`
     This produces visible doubled river channels near coastlines.

4. **Unconstrained Water Displacement Distortion (`RIVER-P1-01`):**
   - **File:** `karty/avraam/base.svg:33`
   - **Crutch:** `#waterRipple` applies `scale="7"` in `feDisplacementMap`. This distorts sea shoreline boundaries by ±7 SVG pixels during a 14s animation loop while river path endpoints remain static, causing river mouths to detach or shoot into open water.

5. **Uniform Flat Circle Marker Primitive (`DRAW-P1-03`):**
   - **File:** `karty/_engine/map-engine.js:1546`
   - **Crutch:** Every historical place (walled capitals, altars, tents, mountain peaks, battlefields) is rendered as a generic flat circle (`r=4.5`), failing to utilize an architectural symbol library.

---

## 2. Audit of `nachalo` (Eden to Babylon) Draft Sheet

Inspection of `karty/nachalo/route.json`:
- **Content:** 9 places (`eden`, `ararat`, `nineveh`, `calah`, `akkad`, `babylon`, `uruk-city`, `ur`, `resen`).
- **Data Defects:**
  1. `resen` has `"stage": null` (triggering `stagePaths[undefined].push` crash in MapEngine).
  2. `stories` array is empty (`stories: []`), breaking story selection chips UI.
  3. `meta` lacks required schema properties (`id`, `era`, `stats`), causing Ajv Draft 2020-12 validation to fail.
- **Classification:** `nachalo` is an incomplete draft Atlas sheet. It must remain excluded from live publication until schema fields and place stages are completed.
