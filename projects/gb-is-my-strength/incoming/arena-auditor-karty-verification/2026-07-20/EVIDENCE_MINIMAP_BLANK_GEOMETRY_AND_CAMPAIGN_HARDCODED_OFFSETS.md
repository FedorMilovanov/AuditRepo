# Evidence Report: Blank Inset Minimap & Hardcoded Overlay Geometry

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/_engine/map-engine.js`

---

## 1. Executive Summary

An audit of the inset minimap, verified waypoints, and signature campaign overlays in `karty/_engine/map-engine.js` highlights three quality breakdowns:

1. **Bare Black Minimap Container Without Basemap Geography (`MINI-P1-01`):**
   - Lines 1123–1168 in `map-engine.js` construct the inset minimap using a blank SVG element (`<rect fill="rgba(7,10,16,.6)">`) containing only place circles (`#me-mm-dots`) and a viewport rect (`#me-mm-rect`).
   - Coastlines, land contours, sea polygons, and rivers are completely absent from the minimap, creating a floating dots effect over a black rectangle.
   - Minimap setup monkey-patches `flyTo` and queries non-unique `document.getElementById('me-mm-rect')`, creating DOM conflicts when multiple maps exist.

2. **Unplated Archaeology Waypoint Labels & Straight Connections (`WAYP-P1-01`):**
   - Lines 1318–1335 draw archaeology waypoints using 3px dots, unplated 7px grey text, and straight dashed lines (`M...L...`).
   - Text labels lack background plates or text halos, causing gray labels to overlap with background mountain hatching and coastline strokes.

3. **Hardcoded Pixel Offsets in Signature Overlays (`SIG-P1-01`):**
   - Campaign overlays (`water-split`, `hanukkah-lights`, `split-kingdom`) in lines 1388–1430 calculate Bezier curves using fixed pixel offsets relative to place coordinates (e.g. `origin.x - 74`, `origin.y - 86`).
   - Fixed pixel offsets distort when maps are rendered at non-standard initial zoom scales or non-1900 viewBox aspect ratios.

---

## 2. Source Code Evidence

### Evidence Item 1: Bare Minimap SVG Injection
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 1125-1127)
      mm.innerHTML = '<svg viewBox="0 0 1900 1430" preserveAspectRatio="xMidYMid meet"><rect x="0" y="0" width="1900" height="1430" fill="rgba(7,10,16,.6)" stroke="rgba(255,255,255,.15)" stroke-width="2"/><g id="me-mm-dots"></g><rect id="me-mm-rect" fill="rgba(232,200,121,.08)" stroke="rgba(232,200,121,.4)" stroke-width="1" rx="4" style="transition: all .2s ease"/></svg>';
```

### Evidence Item 2: Unplated Waypoint Labels & Straight Connecting Lines
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 1321-1330)
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x','8');t.setAttribute('y','3');
        t.setAttribute('fill','#9aa2ae');t.setAttribute('font-size','7');t.textContent=wp.name||'';
...
        const wpD = wps.map((wp,j) => `${j===0?'M':'L'}${wp.x},${wp.y}`).join(' ');
```

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **MINI-P1-01** | Minimap lacks land/sea vector geography, displaying floating dots over a bare black rectangle | `karty/_engine/map-engine.js:1126` | **VERIFIED OPEN** |
| **WAYP-P1-01** | Waypoint labels render as unplated 7px grey text connected by straight dashed `L` lines | `karty/_engine/map-engine.js:1321` | **VERIFIED OPEN** |
| **SIG-P1-01** | Signature campaign overlays use hardcoded pixel offsets (`origin.x - 74`) distorting on zoom | `karty/_engine/map-engine.js:1388` | **VERIFIED OPEN** |
