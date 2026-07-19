# EVIDENCE: DEEP GEOMETRIC, TOPOLOGICAL AND CODEBASE AUDIT OF KARTY SUBSYSTEM

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`

---

## 1. Geometric Bounding Box & Density Metrics Across All 11 Maps

| Map Slug | Places | Bounding Box (minX, minY) -> (maxX, maxY) | Span (W x H) | Exact Duplicates | Close Pairs (<30 SVG units) |
|---|---:|---|---|---:|---:|
| `avraam` | 22 | (235, 159) -> (1710, 1002) | 1475 x 843 | 0 | 4 |
| `early-church` | 11 | (550, 184) -> (731, 830) | 181 x 646 | 1 | 3 |
| `ishod` | 11 | (210, 800) -> (690, 1280) | 480 x 480 | 0 | 0 |
| `maccabim` | 12 | (91, 266) -> (718, 872) | 627 x 606 | 0 | 7 |
| `melachim` | 17 | (580, 594) -> (1543, 872) | 963 x 278 | 0 | 10 |
| `nachalo` | 9 | (672, 172) -> (1093, 1235) | 421 x 1063 | 0 | 2 |
| `pavel` | 10 | (201, 211) -> (1740, 1040) | 1539 x 829 | 0 | 0 |
| `revelation` | 7 | (1154, 437) -> (1282, 543) | 128 x 106 | 0 | 0 |
| `shoftim` | 12 | (547, 651) -> (679, 833) | 132 x 182 | 0 | 8 |
| `shvatim` | 18 | (575, 625) -> (692, 875) | 117 x 250 | 0 | 10 |
| `yeshua` | 15 | (622, 624) -> (670, 809) | **48 x 185** | **2** | **34** |

---

## 2. Critical Collision Analysis & Coordinate Exact Match Breakdown

### 2.1 `yeshua` Extreme Jerusalem Cluster Overcrowding
- **`jerusalem_temple` <-> `jerusalem_passion`**: Exact match at `(623, 800)` (distance: 0.0 units).
- **`golgotha` <-> `tomb`**: Exact match at `(622, 799)` (distance: 0.0 units).
- **`jerusalem_temple` <-> `golgotha`**: Distance **1.41 SVG units**.
- **`jerusalem_temple` <-> `gethsemane`**: Distance **3.61 SVG units**.
- **`bethany` <-> `gethsemane`**: Distance **4.47 SVG units**.
- **`bethlehem` <-> `jerusalem_temple`**: Distance **9.06 SVG units**.

*Impact:* All Jerusalem sites (Temple, Upper Room / Passion, Gethsemane, Golgotha, Tomb) render directly on top of each other inside a tiny 5x5 SVG pixel square. Mouse clicks register exclusively on the topmost SVG node.

### 2.2 `early-church` Exact Match
- **`temple_early` <-> `solomons_porch`**: Exact match at `(624, 800)` (distance: 0.0 units).
- **`jerusalem_upper` <-> `temple_early`**: Distance **1.0 SVG unit** at `(623, 800)`.

---

## 3. Data Patch Proposals for `shoftim` & Coordinate Overlaps

### 3.1 Proposed `shoftim/route.json` Stage Patch
Currently all 12 places have `"stage": 0`.
The correct mapping according to the 6 declared stages (`stages[0..5]`):

| Place ID | Name | Current Stage | Proposed Stage | Stage Title |
|---|---|---:|---:|---|
| `hebron` | Хеврон | 0 | **0** | Stage I (Ранние судьи) |
| `shiloh` | Силом | 0 | **0 / 5** | Stage I / VI (Силом) |
| `hazor` | Асор | 0 | **1** | Stage II (Девора и Варак) |
| `megiddo` | Мегиддо | 0 | **1** | Stage II (Девора и Варак) |
| `tabor` | Фавор | 0 | **1** | Stage II (Девора и Варак) |
| `kishon` | Поток Киссон | 0 | **1** | Stage II (Девора и Варак) |
| `ophrah` | Офра | 0 | **2** | Stage III (Гедеон) |
| `harod` | Эйн-Харод | 0 | **2** | Stage III (Гедеон) |
| `mizpah_gilead` | Массифа Галаадская | 0 | **3** | Stage IV (Иеффай) |
| `timnah` | Фимнафа | 0 | **4** | Stage V (Самсон) |
| `sorek` | Долина Сорек | 0 | **4** | Stage V (Самсон) |
| `gaza` | Газа | 0 | **4** | Stage V (Самсон) |

#### Story `stage_ids` Fix:
- `early`: `stage_ids: [0, 1]` -> change to `[0]`
- `deborah`: `stage_ids: [2]` -> change to `[1]`
- `gideon`: `stage_ids: [3]` -> change to `[2]`
- `jephthah`: `stage_ids: [4]` -> change to `[3]`
- `samson`: `stage_ids: [5]` -> change to `[4]`

---

## 4. Codebase Line-Level Reference Summary

| Bug ID | File | Line Numbers | Exact Code Snippet / Root Cause |
|---|---|---|---|
| `MAP-P0-01` | `karty/_engine/map-engine.js` | 1054 | `.me-panel` lacks max-height constraint; expands offscreen up to -581px |
| `MAP-P0-02` | `karty/_engine/map-engine.js` | 919 | `const st=getState();` — `getState` function undefined |
| `MAP-P0-03` | `karty/_engine/map-engine.js` | 863 | `inStory` referenced inside search timeout callback where it is out of scope |
| `MAP-P0-04` | `karty/_engine/map-engine.js` | 2621 | `_tm(()=>flyTo(first.x,first.y,Math.min(view.w,900)),200)` overwrites `meta.viewport_init` |
| `MAP-P0-05` | `karty/_engine/map-engine.js` | 2622 | `loadFromHash()` only parses location hash, ignoring query string and active chip state |
| `MAP-P0-06` | `karty/_engine/map-engine.js` | 1192 | `[data-layer="${layer.id}"]` searches for layer ID `main`/`journey1` on markers tagged `stage-0` |
| `MAP-P0-07` | `karty/_engine/map-engine.js` | 900–913 | Theme toggle sets CSS custom properties but map container and SVG use hardcoded dark colors |
| `MAP-P0-08` | `karty/_engine/map-engine.js` | 1023 | `_on(btn, 'click', (e) => { e.preventDefault(); })` prevents zoom action on click/keyboard |
| `MAP-P1-06` | `karty/_engine/map-engine.js` | 1817 | `_renderArchaeologyFooter(place)` called unconditionally at end of `renderTab()` |
| `MAP-P1-11` | `karty/_engine/map-engine.js` | 1037 | `(cfg.W0 / view.w) * pxPerKm` uses fixed `cfg.W0=1900` instead of canvas pixel width |
| `MAP-P1-12` | `karty/_engine/map-engine.js` | 796, 816 | `svg.appendChild(compass)` puts compass element inside world SVG instead of screen fixed overlay |
| `MAP-P1-14` | `karty/_engine/map-engine.js` | 380 | `css.remove()` in `destroy()` strips shared `<style id="me-base-css">` for remaining instances |
| `AVRAAM-P1-05` | `karty/avraam/index.html` | 1063 | `@media (orientation:landscape) and (max-height:500px)` blocks desktop landscape 1024x450 |
