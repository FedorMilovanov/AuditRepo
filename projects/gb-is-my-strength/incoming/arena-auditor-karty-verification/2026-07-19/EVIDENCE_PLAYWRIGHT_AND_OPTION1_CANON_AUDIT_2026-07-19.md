# EVIDENCE: PLAYWRIGHT GROUND-TRUTH & OPTION 1 AESTHETIC CANON AUDIT

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Reviewer:** `arena-auditor-karty-verification`  
**Reference Specification:** Owner Design Canon "ВАРИАНТ 1: Эстетика: древняя карта в стиле атласа" + Playwright Visual Suite (`atlas-visual-check.js`, `map-browser-smoke.js`)

---

## 1. Owner Design Canon Comparison: "ВАРИАНТ 1 — Древняя карта в стиле атласа"

The owner's design specification defines 8 mandatory visual and structural pillars for biblical maps. The table below evaluates `MapEngine v0.53` and the current production map implementations against this canon:

| # | Canon Pillar (ВАРИАНТ 1) | Specification Requirement | Current MapEngine v0.53 Implementation | Status & Identified Gap |
|---|---|---|---|---|
| 1 | **Land vs Water Contrast** | Distinct parchment terrain background with deep blue textured water bodies (Mediterranean, Dead Sea, Sea of Galilee) | Hardcoded dark background `rgb(7, 10, 16)` with `#0d1d2e` dark SVG fills | ❌ **FAIL (`MAP-P0-07`)** — Light theme toggle produces 0.24% pixel diff; near-black void replaces parchment atlas aesthetic |
| 2 | **Topographic Relief & Shadows** | Mountain ridges and elevation hillshading across Judaea, Galilee, and Transjordan | Abstract node graph over flat dark rect; terrain geography omitted or obscured under dark background rect | ❌ **FAIL (`MAP-P1-10`)** — Base geography layer missing or dimmed behind semi-transparent rect |
| 3 | **3D Illustrative City Glyphs** | Custom architectural icons (tents, altars, walled cities, temples) with unified color coding | Generic flat SVG circles (`r=4.5`) for all places | ⚠️ **PARTIAL** — Missing custom architectural glyph system |
| 4 | **Legible Labels with Background Plates** | Large, legible Russian typography with semi-transparent rounded background rects | Text labels with `fill="rgba(7,10,16,.75)"` rects, but plagued by collisions | ❌ **FAIL (`MAP-P1-05`, `MAP-P1-07`, `KARTY-DATA-P1-01`)** — Unhandled collisions in dense clusters due to 0-5 manual anchors |
| 5 | **Typed Route Lines & Colors** | Distinct line styles (solid, dashed, dotted) and stage colors for different journeys | Single layer paths or no-op layer toggles (`[data-layer="{id}"]`) | ❌ **FAIL (`MAP-P0-06`)** — Layer toggles match 0 DOM nodes; route lines fail to filter |
| 6 | **Epoch Legend Grouping** | Bottom legend strip displaying 8 stages with age milestones ("АВРААМУ 70 ЛЕТ") | Timeline placed at top or bottom as text or colliding with header controls | ❌ **FAIL (`MAP-P1-04`, `MAP-P1-01`)** — Upper UI collisions (stories x timeline 1007x36px); Tour caption desync |
| 7 | **Screen-Fixed Compass & Scale Bar** | Screen-fixed compass rose in corner + accurate kilometer scale indicator | Compass in map SVG coordinates at (50, 80); scale bar formula uses `cfg.W0` (1900) | ❌ **FAIL (`MAP-P1-11`, `MAP-P1-12`)** — Compass flies offscreen on pan; scale bar math off by up to 4.87x |
| 8 | **Overview Minimap Inset** | Bottom-right inset minimap with red viewport bounding box | `#me-mm-rect` minimap missing or unstyled on holding maps | ⚠️ **PARTIAL** — Rect code exists but unlinked in engine templates |

---

## 2. Playwright Visual Gate Mechanics & Metric Boundaries

`scripts/atlas-visual-check.js` establishes machine-verifiable Playwright assertions across 4 zoom levels (1×, 2×, 4×, 8×). Current map code fails several of these automated Playwright criteria:

### 2.1 Screen Pixel Size Tolerances
- **City Dots:** Target `3–13 px` -> `MapEngine` dots fixed at `4.5 px` or `7 px` regardless of screen CTM scaling.
- **Road/Route Stroke Width:** Target `1.0–3.2 px` -> Non-scaling stroke missing on several route SVG paths.
- **Label Font Size:** Target `8–19 px` -> Standard labels use fixed `font-size: 11` in SVG units without responsive scaling.

### 2.2 Label Collision Tolerance (2 px BBox overlap limit)
Playwright checks pairwise bounding boxes of visible `<text>` nodes:
- `yeshua`: 34 close pairs < 30 units, 2 pairs at 0.0 units overlap (`jerusalem_temple`/`jerusalem_passion`, `golgotha`/`tomb`). Playwright collision assertion fails instantly.
- `early-church`: 1 exact duplicate at `(624, 800)` (`temple_early`/`solomons_porch`).

### 2.3 Water Route Traversal Assertion (`isPointInFill()`)
Playwright tests land routes against water polygon fills (`g.base path[fill="url(#seaG)"]`).
- In `ishod` and `avraam`, land routes must not sample >= 3 consecutive water points.

### 2.4 Safe Area Boundary (24 px padding)
Labels must not extend within 24 px of the inner border frame (`.frame`). Low mobile viewport occupancy (`MAP-P1-05`) forces center clusters while labels extend near edges.

---

## 3. Summary & Verification Impact

Comparing current codebase against both the **Option 1 Aesthetic Canon** and **Playwright Automated Checkers** confirms that `MapEngine v0.53` violates **6 out of 8** core visual canon pillars and fails automated Playwright BBox collision & viewport checks.

Resolving `karty-engine-p0-fixes`, `karty-engine-p1-ux`, `karty-data-p1-fixes`, and `karty-avraam-hub` repair lanes is mandatory to achieve full parity with the Option 1 design specification.
