# Evidence Report: Basemap Definitions Breakdown & Parchment Canon Parity Audit

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/_engine/base-geo.svg`, `/karty/avraam/base.svg`, `/data/atlas/base/base-geo-mediterranean.svg`, `/data/atlas/base/base-geo-urheimat.svg`, `/karty/_engine/map-engine.js`

---

## 1. Executive Summary & Root Cause Analysis

A systematic vector analysis of the 3 shared basemap files (`base-geo.svg`, `base-geo-mediterranean.svg`, `base-geo-urheimat.svg`) and the Avraam standalone basemap (`avraam/base.svg`) reveals that the current implementation relies heavily on broken assumptions, missing definitions, and dark night-mode placeholders, rather than top-tier cartographic vector artwork matching the Owner Aesthetic Canon ("ВАРИАНТ 1: Эстетика: древняя карта в стиле атласа").

### Key Findings
1. **Empty `<defs>` in Shared Basemaps (The "Kraski U Potrebitelya" Anti-Pattern):**
   - `karty/_engine/base-geo.svg`: Contains `<defs></defs>` (0 elements).
   - `data/atlas/base/base-geo-mediterranean.svg`: Contains `<defs></defs>` (0 elements).
   - `data/atlas/base/base-geo-urheimat.svg`: Contains `<defs></defs>` (0 elements).
   - All three files reference missing gradients and filters (`fill="url(#landG)"`, `fill="url(#desertG)"`, `fill="url(#fertileG)"`, `fill="url(#mtG)"`, `use href="#hill"`, `use href="#peak"`).
   - When loaded via `MapEngine.createMap()` (`opts.baseGeoUrl`), `map-engine.js` fails to inject these definitions into `<defs>`, causing all background terrain shapes to fail rendering or fall back to missing solid black fills.

2. **Unconditional 50% Translucency Dimming (`opacity="0.5"`):**
   - `map-engine.js:2612` applies `opacity="0.5"` to the entire `<g id="me-base-geo">` container upon loading `opts.baseGeoUrl`.
   - This dims all topography, mountain hatching, rivers, and coastlines to half contrast, resulting in a washed-out, ghosted schematic appearance.

3. **Dark Night-Mode & Starry Galaxy Visual Noise in `avraam/base.svg`:**
   - `karty/avraam/base.svg:4` defines `landG` as a dark charcoal gradient (`#22241f` to `#1d1c14`) and `seaG` as dark navy (`#0d1d2e`), directly violating the Owner Aesthetic Canon requirement for warm antique parchment/vellum land and vibrant water bodies.
   - `karty/avraam/base.svg:715-850` renders 6 layers of 30+ animated night-sky galaxy stars, shooting stars (60s/79s CSS animation loops), and nebulas directly over the geography, cluttering land terrain and obscuring place markers and labels.

4. **Single River Channel Doubled Lines in `base-geo.svg`:**
   - Overlapping legacy river paths in `base-geo.svg` combined with stroke filters create visible doubled river channel outlines along coastal estuaries.

---

## 2. Line-Level Source Code Evidence

### Evidence Item 1.1: Empty `<defs>` in `karty/_engine/base-geo.svg`
```xml
<!-- File: /home/user/gb-is-my-strength/karty/_engine/base-geo.svg (lines 10-13) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1900 1430" id="base-geo">
<defs>
  <!-- Все фильтры и градиенты из основного файла -->
  <!-- Импортируются в конкретную карту через <use> или inline -->
</defs>
<g id="terrain" data-layer="base-geo">
  <rect x="-400" y="-400" width="2700" height="2230" fill="url(#landG)"/>
```
- **Analysis:** `#landG` is unresolvable because `<defs>` is empty.

### Evidence Item 1.2: `map-engine.js` Failure to Inject Defs and Forced Opacity
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 2603-2616)
    if (opts.baseGeoUrl) {
      fetch(opts.baseGeoUrl).then(r => r.text()).then(svgText => {
        const parser = new DOMParser();
        const geoDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const geoRoot = geoDoc.querySelector('svg');
        if (geoRoot) {
          // Insert base-geo as first child of SVG (behind paths/markers)
          const baseGeoG = document.createElementNS('http://www.w3.org/2000/svg','g');
          baseGeoG.id = 'me-base-geo';
          baseGeoG.setAttribute('opacity','0.5'); // FORCED 50% DIMMING
          while (geoRoot.firstChild) baseGeoG.appendChild(geoRoot.firstChild);
          svg.insertBefore(baseGeoG, svg.firstChild);
        }
      }).catch(e => console.warn('Base geo load failed:', e));
    }
```
- **Analysis:** Nodes are moved into `<g id="me-base-geo" opacity="0.5">`. Any `<defs>` inside `geoRoot` get wrapped inside a 50% opacity group, and missing definitions like `#landG` are never auto-populated.

### Evidence Item 1.3: Dark Charcoal Gradient in `avraam/base.svg`
```xml
<!-- File: /home/user/gb-is-my-strength/karty/avraam/base.svg (lines 4-10) -->
  <linearGradient id="landG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#22241f"/>
    <stop offset=".45" stop-color="#262318"/>
    <stop offset="1" stop-color="#1d1c14"/>
  </linearGradient>
  <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0d1d2e"/>
    <stop offset="1" stop-color="#0a1522"/>
  </linearGradient>
```
- **Analysis:** Flat dark gray/black background instead of atmospheric historical parchment.

---

## 3. Registered Master Bug IDs & Verification Status

| Bug ID | Summary | Target File / Line | Status |
| :--- | :--- | :--- | :--- |
| **BASE-P1-01** | Empty `<defs>` in shared basemaps (`base-geo.svg`, `base-geo-mediterranean.svg`, `base-geo-urheimat.svg`) causing missing gradient/filter references | `karty/_engine/base-geo.svg:10` | **VERIFIED OPEN** |
| **BASE-P1-02** | Forced 50% opacity dimming (`opacity="0.5"`) on `me-base-geo` group in `map-engine.js` | `karty/_engine/map-engine.js:2612` | **VERIFIED OPEN** |
| **BASE-P1-03** | Dark charcoal land gradient and 6-layer starry sky overlay in `avraam/base.svg` degrading cartographic legibility | `karty/avraam/base.svg:4,715` | **VERIFIED OPEN** |
