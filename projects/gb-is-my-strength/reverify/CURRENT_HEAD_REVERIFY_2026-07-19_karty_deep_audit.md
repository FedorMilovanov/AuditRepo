# CURRENT HEAD REVERIFY — 2026-07-19 — Karty Section Deep Audit

- **Date:** 2026-07-19
- **Project:** gb-is-my-strength
- **Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` (main)
- **Audited Commit from Intake:** `c2c339708252`
- **Reverify Focus:** `/karty/` section, MapEngine v0.53, holding maps, Avraam custom map, publication status gates

---

## 1. Context & Objectives

A comprehensive deep audit of the `/karty/` subsystem was submitted by an independent audit agent on 2026-07-19 against commit `c2c339708252`.
This reverify pass confirms the existence, line-level location, and repro of every finding on current source HEAD `32ae0d7d`.

---

## 2. Reverify Findings Summary

### 8 P0 Blockers (Confirmed)
1. **`MAP-P0-01` (Mobile panel overflow):** `karty/_engine/map-engine.js:1054` — `.me-panel` lacks viewport max-height bounds; panel top extends up to -581px on mobile.
2. **`MAP-P0-02` (Share button crash):** `karty/_engine/map-engine.js:919` — calls non-existent function `getState()`, throwing `ReferenceError`.
3. **`MAP-P0-03` (Search callback crash & opacity clear):** `karty/_engine/map-engine.js:863` — search timer uses out-of-scope variable `inStory`, throwing `ReferenceError`; clear search destroys active story dimming.
4. **`MAP-P0-04` (Initial camera overwritten):** `karty/_engine/map-engine.js:2621` — 200ms after init calls `flyTo(first.x, first.y, Math.min(view.w, 900))`, destroying editorial `meta.viewport_init`.
5. **`MAP-P0-05` (Deep links & state restoration):** `karty/_engine/map-engine.js:2622` — `loadFromHash()` ignores `?story=...` query params and fails to sync story chips UI.
6. **`MAP-P0-06` (Layer toggles no-op):** `karty/_engine/map-engine.js:1192` — searches `[data-layer="${layer.id}"]` (`main`, `journey1`), matching 0 elements in SVG DOM.
7. **`MAP-P0-07` (Light theme hardcoded colors):** `karty/_engine/map-engine.js:900-913` — updates CSS vars but SVG and container remain dark `rgb(7, 10, 16)`.
8. **`MAP-P0-08` (Zoom click/keyboard bypass):** `karty/_engine/map-engine.js:1023` — prevents default on `click` without zooming; zoom logic only wired to `mousedown`.

### 20 P1 Findings (Confirmed)
- Tour mode caption/camera desync (`MAP-P1-01`), missing touch controls (`MAP-P1-02`);
- `shoftim` place stage 0 misallocations across all 12 places (`MAP-P1-03`);
- Upper UI collisions (`MAP-P1-04`), low mobile viewport occupancy 3.8%–13.6% (`MAP-P1-05`);
- Archaeology footer rendering under all 7 tabs (`MAP-P1-06`);
- Exact coordinate collisions in Early Church and Life of Jesus routes (`MAP-P1-07`);
- Story filter opacity flash and search clear corruption (`MAP-P1-08`);
- Auto-open first place panel covering mobile map (`MAP-P1-09`);
- Base geography SVG obscured under dark background rect (`MAP-P1-10`);
- Scale bar math error factor 1.32x to 4.87x (`MAP-P1-11`);
- Compass in map space at (50, 80) flying offscreen (`MAP-P1-12`);
- Systemic A11y defects: 113/113 markers no roles/labels, panel no dialog semantics (`MAP-P1-13`);
- Destroy lifecycle event listener leak & shared CSS stripping (`MAP-P1-14`);
- Avraam CTA invisibility timer 1.8s (`AVRAAM-P1-01`), Canaan cluster compression (`AVRAAM-P1-02`), mobile nav duplication (`AVRAAM-P1-03`), tab div A11y (`AVRAAM-P1-04`), landscape desktop rotate overlay block (`AVRAAM-P1-05`);
- Lack of manual `labelAnchor` and `leader` coordinates across 8 engine maps (`KARTY-DATA-P1-01`).

### 3 P2 Findings (Confirmed)
- Avraam heavy payload and duplicate `route.json` fetch (`AVRAAM-P2-01`);
- Hub preview text overlap, QA terms, `/karty/ishod/` published/indexable without hub link (`HUB-P2-01`);
- `maps:validate` & `smoke:maps` false greens (`GATE-P1-01`).

---

## 3. Data Patch Specifications & Specific Fix Strategies

### 3.1 Proposed `shoftim/route.json` Data Fix
Fix `places` array in `karty/shoftim/route.json` to assign correct 0-indexed stages matching declared `stages[0..5]`:
- `hebron`: `stage: 0` (I — Ранние судьи)
- `hazor`, `megiddo`, `tabor`, `kishon`: `stage: 1` (II — Девора и Варак)
- `ophrah`, `harod`: `stage: 2` (III — Гедеон)
- `mizpah_gilead`: `stage: 3` (IV — Иеффай)
- `timnah`, `sorek`, `gaza`: `stage: 4` (V — Самсон)
- `shiloh`: `stage: 0` / `5` (VI — Крах Силоа)

In `stories` definitions:
- `deborah`: `stage_ids: [1]`
- `gideon`: `stage_ids: [2]`
- `jephthah`: `stage_ids: [3]`
- `samson`: `stage_ids: [4]`

### 3.2 Jerusalem Coordinate Offset Strategy
For maps with 0.0 distance overlaps in Jerusalem (`yeshua` and `early-church`):
- `yeshua`:
  - `jerusalem_temple`: `(623, 796)`
  - `jerusalem_passion`: `(623, 804)`
  - `golgotha`: `(618, 799)`
  - `tomb`: `(626, 799)`
- `early-church`:
  - `temple_early`: `(624, 796)`
  - `solomons_porch`: `(624, 804)`

### 3.3 Option 1 Aesthetic Canon & Playwright Visual Suite Alignment
Cross-referencing current `MapEngine v0.53` against the owner's **Option 1 Aesthetic Specification** ("ВАРИАНТ 1: Эстетика: древняя карта в стиле атласа") and Playwright visual checkers (`scripts/atlas-visual-check.js`, `scripts/map-browser-smoke.js`):
1. **Land/Water Contrast:** Dark background `rgb(7, 10, 16)` must be replaced with parchment terrain tokens & high-contrast water bodies.
2. **Topography & Relief:** Base geography SVG layer must not be hidden behind dark overlay rects (`MAP-P1-10`).
3. **Labels & Background Plates:** Playwright 2px BBox collision tolerance is violated on `yeshua` (34 close pairs) and `early-church` (exact overlap); requires label plates and leader line displacement.
4. **Compass & Controls:** Embedded SVG compass at `(50, 80)` must move to fixed screen overlay, scale bar formula fixed to screen canvas width (`MAP-P1-11`, `MAP-P1-12`).
5. **Full Playwright Evidence:** See `incoming/arena-auditor-karty-verification/2026-07-19/EVIDENCE_PLAYWRIGHT_AND_OPTION1_CANON_AUDIT_2026-07-19.md`.

### 3.4 Owner Paradigm Guidance & Basemap Architectural Audit
Following explicit owner clarification:
- **Style Direction vs Pixel Mockup:** The Option 1 reference represents an artistic benchmark ("некоторый стиль — красивой SVG карты") rather than a strict 1-to-1 UI button layout constraint.
- **Node Graph Prohibition:** Maps must NOT render as plain schematic node graphs ("простецкая карта-схема").
- **Basemap Disparity Audit:** 10 out of 11 maps (`ishod`, `pavel`, `shoftim`, `melachim`, `shvatim`, `yeshua`, `maccabim`, `early-church`, `revelation`, `nachalo`) currently have 0 B physical SVG basemaps in their folders and pass `{}` to `MapEngine.createMap`, causing `baseGeoUrl` to remain `undefined` and rendering bare nodes over a black void.
- **Architectural Fix:** Auto-default `baseGeoUrl` to `../_engine/base-geo.svg`, merge `<defs>` gradients/filters into the SVG container, and replace black background rects with parchment design tokens. Full report: `incoming/arena-auditor-karty-verification/2026-07-19/EVIDENCE_PARADIGM_AND_SVG_BASEMAP_AUDIT_2026-07-19.md`.

### 3.5 River Coastline Disconnection & Vector Animation Audit
Specific investigation into river endpoints and coastline animations:
1. **Filter Distortion (`RIVER-P1-01`):** `karty/avraam/base.svg` filter `#waterRipple` applies `feDisplacementMap scale="7"`, dynamically deforming sea shoreline boundaries by ±7 SVG units over a 14s loop while river path mouths remain static. This causes static river mouths (Kishon, Jordan, Nile Delta) to alternate between detaching from shorelines and overshooting into open sea.
2. **Missing Defs (`RIVER-P1-02`):** `karty/_engine/base-geo.svg` references `filter="url(#waterRipple)"` 4 times, but `#waterRipple` is omitted from its `<defs>`, creating broken SVG filter references.
3. **Round Cap Projection (`RIVER-P1-03`):** `stroke-linecap="round"` on 3..5px river strokes projects a 2.5px rounded cap past endpoint coordinates into sea water during `stroke-dashoffset` path reveal transitions.
4. **Layout Unsettled Zero Length (`RIVER-P1-04`):** `getTotalLength()` returning 0 prior to DOM layout settlement sets `stroke-dasharray="0"`, flashing stroke transitions instantly across water bodies.
5. **Full River Evidence:** See `incoming/arena-auditor-karty-verification/2026-07-19/EVIDENCE_RIVER_ANIMATION_AND_VECTOR_DISPLACEMENT_2026-07-19.md`.

### 3.6 Touch Targets, Typography, and Quality Optimization Pass
Deep pass on interactive controls, Hebrew rendering, verse typography, and event delegation:
1. **Touch Target Dimensions (`QUAL-P1-01`):** 15 controls fail WCAG AAA 44px minimum sizing (`.me-back` 36px, `.me-story-chip` 36px, `.me-arch-more` 32px, `.me-panel__resize` 12px width, navigation dots 6-8px).
2. **Hebrew Typography (`QUAL-P1-02`):** 244+ Hebrew words lack declared `font-family: "Noto Serif Hebrew"` and `dir="rtl"` container attributes in dynamic JS rendering.
3. **Verse Citation Formatting (`QUAL-P1-03`):** 39 verse range citations in engine maps use ASCII hyphens `-` instead of Russian typographic en-dashes `–`.
4. **Photo Modal Event Delegation (`QUAL-P1-04` / `ENGINE-P1-28`):** Delegated click listener on `panel` overwrites full-res photo modal image URLs with 320px low-res thumbnails.
5. **Full Quality Evidence:** See `incoming/arena-auditor-karty-verification/2026-07-19/EVIDENCE_TYPOGRAPHY_TOUCH_TARGETS_AND_QUALITY_2026-07-19.md`.

### 3.7 Ajv Draft 2020-12 Schema, Passive Listeners & Timer Leaks Pass
Secondary quality pass inspecting event loop performance and strict schema validation:
1. **Ajv Schema Violations (`QUAL-P1-07`, `QUAL-P2-02`):** Ajv 2020-12 validation against `karty/_shared/route.schema.json` rejects 4 map routes (`early-church`, `melachim`, `revelation` use underscores `_` in story IDs breaking `pattern: "^[a-z0-9-]+$"`; `nachalo` omits root `stories` and `meta` properties).
2. **Non-Passive High-Frequency Listeners (`QUAL-P1-05`):** 16 `wheel`, `touchstart`, `touchmove`, and `mousemove` listeners lack `{ passive: true }`, blocking compositor thread scrolling on mobile devices.
3. **Uncleaned Timer Closures (`QUAL-P1-06`):** 58 `setTimeout` and `requestAnimationFrame` timers run without lifecycle cancellation, executing callbacks on detached DOM nodes.
4. **Full Schema & Performance Evidence:** See `incoming/arena-auditor-karty-verification/2026-07-19/EVIDENCE_AJV_SCHEMA_EVENT_LOOPS_AND_PERFORMANCE_2026-07-19.md`.

### 3.8 OpenGraph, Social Cards & Migration Ownership Registry Pass
Third quality pass inspecting meta elements and page ownership contracts:
1. **Fallback OpenGraph Card Usage (`QUAL-P1-08`):** 8 holding map pages use the generic hub image `https://gospod-bog.ru/images/og-karty-1200x630.webp` with title "визуальный аудит", missing custom route preview graphics.
2. **Route Profile Status Drift (`QUAL-P1-09`):** `data/route-profiles/karty-*.json` files declare `currentStatus: "production-dist"` and `migrationMode: "strict-native-app"` for all 11 map routes, misrepresenting the holding status of 8 placeholder maps.
3. **Page Ownership Omission (`QUAL-P2-03`):** `migration/page-ownership.json` contains 0 entries under `/karty/`, bypassing centralized owner validation.
4. **Full SEO & Registry Evidence:** See `incoming/arena-auditor-karty-verification/2026-07-19/EVIDENCE_SEO_OPENGRAPH_AND_MIGRATION_REGISTRY_2026-07-19.md`.







---

## 4. Recommended Operational Priority

1. **`karty-engine-p0-fixes`**: Repair runtime crashes (`getState`, `inStory`), mobile panel top bounds, `viewport_init` retention, layer toggle selectors, theme tokens, click/keyboard zoom, and deep link query/hash parser.
2. **`karty-engine-p1-ux`**: Tour mode touch button and stage caption sync, archaeology footer scope restriction, scale bar container math, screen-overlay compass, and mobile viewport camera framing.
3. **`karty-data-p1-fixes`**: Fix `shoftim` stage assignments, offset duplicate marker coordinates, and tune `labelAnchor` / `leader` properties for dense maps.
4. **`karty-gates-p1-fixes`**: Enhance `scripts/validate-map-routes.js` and `scripts/karty-smoke-test.js` to assert runtime JS clean console, stage integrity, marker coordinate uniqueness, and panel bounds.

