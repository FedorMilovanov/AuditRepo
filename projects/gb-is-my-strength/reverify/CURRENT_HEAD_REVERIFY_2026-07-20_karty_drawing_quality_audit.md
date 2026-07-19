# Master Reverify Record: Karten-Sektion / Drawing & Basemap Quality Audit

**Reverify Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit Audited:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Branch:** `arena/019f7b51-auditrepo` on `https://github.com/FedorMilovanov/AuditRepo.git`  
**SSOT Compliance:** Checked against `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`

---

## 1. Executive Status Matrix

| Component Area | Audit Verdict | Severity Summary | Key Root Causes |
| :--- | :--- | :--- | :--- |
| **Shared Basemaps & Geography** | **FAILED (CRUTCH)** | 4 P1 (`BASE-P1-01`..`04`), 1 P2 (`BASE-P2-01`) | Empty `<defs>` & 18 missing ID references (`#hill`, `#peak`, `#canaanRidge`); forced 50% opacity in `map-engine.js`; dark galaxy mode in `avraam/base.svg`; coarse regional vectors |
| **Draft Sheet Topography & Relief** | **FAILED (CRUTCH)** | 1 P1 (`RELIEF-P1-01`) | Mountain relief in "ideal draft engine" `sheet-engine.js` is drawn using geometric `<ellipse>` shapes with line hatches, and is empty (`''`) for `urheimat` |
| **Draft Sheet Route Splines** | **FAILED (CRUTCH)** | 1 P1 (`ROUTE-P1-01`) | Single Catmull-Rom spline forces unbranching route spaghetti bowing into open seas without `route_via` crutch points |
| **Coordinate Mesh & Graticule** | **FAILED (WEAK)** | 1 P1 (`GRAT-P1-01`) | Linear unprojected affine grid math treats Earth as a flat 2D rectangle and lacks grid lines across map body |
| **Sea Wave Texture & Cartouche** | **FAILED (WEAK)** | 2 P1 (`SEA-P1-01`, `ORN-P1-01`) | 20px repeating tile grid creates "bathroom tile" sea patterns; cartouche corners use primitive 3-line arcs |
| **Label Halos & Typography** | **FAILED (WEAK)** | 1 P1 (`HALO-P1-01`), 2 P1 (`TEXT-P1-01`, `FONT-P1-01`), 1 P1 (`QUAL-P1-02`) | Dead `halos` boilerplate array; text CSS stroke eating into small letter counters; monospace text length multiplication |
| **Glyph Dataset Completeness** | **FAILED (INCOMPLETE)** | 1 P1 (`GLYPH-P1-01`) | 9 of 11 map JSON datasets contain zero `glyph` properties, forcing 82% of maps to render plain dots |
| **Territory Regions & Boundaries** | **FAILED (CRUTCH)** | 1 P1 (`REG-P1-01`) | `map-engine.js` omits `route.regions` rendering, failing to draw 13 tribal allotment polygons in `shvatim` |
| **Filter Performance & CPU Jank** | **FAILED (WEAK)** | 1 P1 (`PERF-P1-01`) | Continuous 14s `feTurbulence` animation loop forces canvas re-rasterization and pan/zoom drag jank (15–20 fps) |
| **Engine Architecture & Styles** | **FAILED (CRUTCH)** | 2 P1 (`ARCH-P1-01`, `CSS-P1-01`) | Architectural split: parchment atlas present in offline `sheet-engine.js`, but production `map-engine.js` renders dark schematic; `destroy()` removes shared CSS |
| **Export Asset Pipeline** | **FAILED (CRUTCH)** | 1 P1 (`SVG-P1-01`) | Standalone exported SVGs contain unescaped `&nbsp;` HTML entities crashing XML parsers |
| **Route Path Vector Geometry** | **FAILED (CRUTCH)** | 1 P0 (`DATA-P0-01`), 1 P1 (`RIVER-P1-04`), 1 P2 (`DATA-P2-01`) | Straight `M...L...L...` lines ignoring `stages[].paths`; `getTotalLength()` zero-reflow bug; missing curved paths in 10/11 maps |
| **Place Markers & Glyphs** | **FAILED (WEAK)** | 1 P1 (`DRAW-P1-03`), 1 P1 (`ENGINE-P1-23`) | 100% circle markers (`r=4.5`), zero architectural icons, wrong `nth-child(3)` hover target bug |
| **Minimap & Overlays** | **FAILED (WEAK)** | 3 P1 (`MINI-P1-01`, `WAYP-P1-01`, `SIG-P1-01`) | Bare black minimap without basemap geography; unplated 7px grey waypoint text; hardcoded campaign offsets |
| **Hydrology & Coastal Ripple** | **FAILED (CRUTCH)** | 5 P1 (`RIVER-P1-01`..`05`) | `#waterRipple` scale=7 shoreline deformation detaching static river mouths |
| **Viewport Navigation UI** | **FAILED (WEAK)** | 4 P1 (`MAP-P1-11`..`12`, `15`, `UI-P1-01`) | Unanchored compass rose in world coordinates; mobile scale bar math distortion; header search input absolute position collision on 390px screens |

---

## 2. Verified Ingress Directory Links

All structured evidence and raw findings from this pass are persisted in:
- `projects/gb-is-my-strength/incoming/arena-auditor-karty-verification/2026-07-20/`
  - `README.md`
  - `REPORT.md`
  - `EVIDENCE_BASEMAP_DEFS_AND_PARCHMENT_CANON_AUDIT.md`
  - `EVIDENCE_ROUTE_DRAWING_AND_CURVED_GEOMETRY.md`
  - `EVIDENCE_ARCHITECTURAL_GLYPHS_AND_LABEL_PLATES.md`
  - `EVIDENCE_MISSING_SYMBOLS_AND_DUAL_ENGINE_DIVERGENCE.md`
  - `EVIDENCE_EXPORT_SVG_ENTITY_ERRORS_AND_COARSE_GEOMETRY.md`
  - `EVIDENCE_HEBREW_TYPOGRAPHY_AND_STYLE_CLEANUP_DESTROY_BUG.md`
  - `EVIDENCE_MINIMAP_BLANK_GEOMETRY_AND_CAMPAIGN_HARDCODED_OFFSETS.md`
  - `EVIDENCE_UNRENDERED_REGIONS_AND_PERFORMANCE_OVERLAPS.md`
  - `EVIDENCE_DRAFT_SHEET_ELLIPSE_RELIEF_AND_CATMULL_SPLINES.md`
  - `EVIDENCE_GRATICULE_LINEAR_GRID_AND_WATER_TEXTURE_TILE.md`

---

## 3. Validation Suite Verification

Executed locally in `/home/user/AuditRepo`:
- `python3 scripts/validate_audit_repo.py` -> **PASS**
- `python3 scripts/check_auditrepo_structure.py` -> **PASS**
- `python3 scripts/check_matrix_coverage.py --warn-only` -> **PASS**
