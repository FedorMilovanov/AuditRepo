# EVIDENCE: STYLISTIC PARADIGM & SVG BASEMAP ARCHITECTURE AUDIT

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`  
**Reference Specification:** Owner Visual Directive ("ВАРИАНТ 1: Эстетика: древняя карта в стиле атласа") & Architectural SVG Analysis

---

## 1. Owner Guidance & Visual Paradigm Clarification

The owner provided explicit visual design guidance regarding the reference mockup ("ВАРИАНТ 1: Эстетика: древняя карта в стиле атласа"):

1. **Not a 1-to-1 Pixel Mockup:** Buttons, control buttons, and minor UI arrangement details in the reference image are illustrative layout directions. Strict 1:1 pixel parity of buttons is **not required**.
2. **Mandatory Aesthetic Standard:** Maps MUST NOT be built as oversimplified schematic node graphs ("простецкая карта-схема"), plain black-canvas wireframes, or flat prototypes. They MUST be **rich, expressive, atmospheric historical biblical SVG atlas maps** ("красивая SVG карта с пергаментной текстурой, географией, рельефом и водоёмами").

---

## 2. Basemap Inventory Across All 11 Maps

An inventory of physical SVG basemaps across all 11 map directories in `/karty/` revealed a critical architectural gap:

| Map Folder (`karty/*/`) | `base.svg` Size | `base-geo.svg` Size | Injected Basemap Status in Production | Aesthetic Classification |
|---|---:|---:|---|---|
| `avraam` | **72 877 B** (72 KB) | None | Embedded `base.svg` (113 vector paths, gradients, filters) | 🎨 **Rich Vector Atlas Map** |
| `ishod` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `pavel` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `shoftim` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `melachim` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `shvatim` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `yeshua` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `maccabim` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `early-church` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `revelation` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |
| `nachalo` | **0 B** (Missing) | None | `MapEngine.createMap(stage, route, {})` -> `baseGeoUrl` **undefined** | ❌ **Bare Schematic Node Graph** |

---

## 3. Root Cause Analysis: Why Engine Maps Degrade to "Карта-Схема"

1. **Empty Options Object in HTML:**
   `karty/ishod/index.html:56` initializes `MapEngine.createMap(container, route, {})`. Because `baseGeoUrl` is omitted from `opts`, `MapEngine` skips fetching `base-geo.svg` entirely.

2. **Missing Defs Injection for Gradients:**
   `karty/_engine/base-geo.svg` utilizes gradient fills (`url(#landG)`, `url(#desertG)`, `url(#fertileG)`). However, `karty/_engine/map-engine.js` does not copy `<defs>` from `base-geo.svg` into the map `<svg>`. If `base-geo.svg` is loaded dynamically, the referenced gradients resolve to black/transparent fills according to the SVG specification.

3. **Background Rect Submersion:**
   `map-engine.js:2614` sets `baseGeoG.setAttribute('opacity', '0.5')` and inserts `baseGeoG` behind a dark background rect, which dampens parchment terrain textures into a near-black pitch background.

---

## 4. Technical Roadmap to Deliver the "Beautiful SVG Atlas" Standard

To transform all 10 `MapEngine` maps from schematic node graphs into full-featured biblical SVG atlas maps matching Option 1 aesthetics:

1. **Auto-Default Base Geography:**
   Update `MapEngine.createMap` to automatically default `baseGeoUrl` to `../_engine/base-geo.svg` whenever `opts.baseGeoUrl` is not explicitly passed.

2. **SVG Defs Merger:**
   When loading `base-geo.svg`, extract its `<defs>` block and append all `<linearGradient>`, `<radialGradient>`, and `<filter>` elements into the main `<svg><defs>` block so terrain styling renders correctly.

3. **Parchment Theme Token Integration:**
   Replace the hardcoded pitch-black `rgb(7, 10, 16)` background rect with the warm parchment token (`#f8f5f0` light, `#171411` dark) with semi-transparent paper texture filters (`#paperTex` / `#sandG`).

4. **Regional & City Icon System:**
   Introduce SVG symbol definitions (`<use href="#icon-walled-city"/>`, `#icon-tent`, `#icon-altar`) to replace bare circles with historical architectural symbols as requested in the owner canon.
