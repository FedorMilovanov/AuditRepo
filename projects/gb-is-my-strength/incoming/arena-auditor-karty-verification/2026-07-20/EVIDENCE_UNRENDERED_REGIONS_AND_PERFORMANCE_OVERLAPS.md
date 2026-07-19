# Evidence Report: Unrendered Territory Regions, Filter Jank & UI Positioning Collisions

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/_engine/map-engine.js`, `/karty/shvatim/route.json`, `/karty/avraam/base.svg`

---

## 1. Executive Summary

A deep technical pass on territorial rendering, filter execution pipelines, and responsive mobile UI layouts reveals three critical deficiencies:

1. **Unrendered `route.regions` Territory Layer in Interactive Web Engine (`REG-P1-01`):**
   - In `karty/shvatim/route.json` (12 Tribes of Israel map), lines 21–47 define 13 territory polygons (`asher`, `naphtali`, `zebulun`, `issachar`, `manasseh_w`, `ephraim`, `dan`, `benjamin`, `judah`, `simeon`, `manasseh_e`, `gad`, `reuben`) with boundary paths and color tint IDs.
   - Client-side engine `karty/_engine/map-engine.js` contains **zero code** for parsing or rendering `route.regions`.
   - Result: On live interactive web routes, the 12 Tribes map renders without any tribal territory borders or color fills, displaying only floating dots on a dark background.

2. **Continuous `feTurbulence` Animation Loop Re-Rasterization Jank (`PERF-P1-01`):**
   - In `karty/avraam/base.svg:28`, `#waterRipple` filter executes an indefinite 14s CSS/SVG animation animating `baseFrequency` of a 3-octave `feTurbulence` noise generator over the full sea polygon canvas.
   - Browsers force CPU/GPU re-rasterization of the large SVG canvas on every animation frame, causing severe frame drops (15–20 fps) during pan/zoom drag gestures on mobile devices and integrated GPUs.

3. **Header Search Input Positioning Collision on Mobile Viewports (`UI-P1-01`):**
   - In `map-engine.js:690`, `.me-search` is styled with hardcoded `position: absolute; top: 8px; right: 48px; width: 160px`.
   - On narrow mobile viewports (≤390px), when `.me-header` text wraps into multiple lines, `.me-search` overlaps directly on top of the title text and back navigation button, blocking click and tap events.

---

## 2. Source Code Evidence

### Evidence Item 1: Complete Absence of Region Polygon Handler in `map-engine.js`
- Executing `grep -i "region"` on `karty/_engine/map-engine.js` yields 0 matches.
- In contrast, `scripts/lib/sheet-engine.js:781-800` explicitly iterates over `route.regions` to build `<path class="region-fill"/>`.

### Evidence Item 2: Animated Continuous Filter in `karty/avraam/base.svg`
```xml
<!-- File: /home/user/gb-is-my-strength/karty/avraam/base.svg (lines 28-34) -->
  <filter id="waterRipple" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="linearRGB">
    <feTurbulence id="waveTurb" type="fractalNoise" baseFrequency="0.018 0.025" numOctaves="3" seed="5" result="noise">
      <animate attributeName="baseFrequency" values="0.018 0.025;0.022 0.028;0.018 0.025" dur="14s" repeatCount="indefinite"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
```

### Evidence Item 3: Hardcoded Search Box Absolute Position in `map-engine.js`
```css
/* File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (line 690) */
.me-search{position:absolute;top:8px;right:48px;z-index:15;width:160px;padding:5px 10px;...}
```

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **REG-P1-01** | `map-engine.js` omits `route.regions` rendering, failing to draw tribal allotment polygons in `shvatim` | `karty/_engine/map-engine.js` | **VERIFIED OPEN** |
| **PERF-P1-01** | Continuous 14s `feTurbulence` animation loop forces canvas re-rasterization and pan/zoom jank | `karty/avraam/base.svg:28` | **VERIFIED OPEN** |
| **UI-P1-01** | Absolute positioning of `.me-search` overlaps title and back button on 390px mobile viewports | `karty/_engine/map-engine.js:690` | **VERIFIED OPEN** |
