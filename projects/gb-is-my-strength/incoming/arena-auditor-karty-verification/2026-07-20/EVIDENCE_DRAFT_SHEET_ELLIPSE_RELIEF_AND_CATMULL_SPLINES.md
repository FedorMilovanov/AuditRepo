# Evidence Report: Draft Sheet Quality Audit — Primitive Ellipse Relief, Catmull-Rom Splines & Missing Glyphs

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/scripts/lib/sheet-engine.js`, `/karty/*/route.json`

---

## 1. Executive Summary

Addressing the user's specific inquiry regarding whether the offline visual draft sheets (`sheet-engine.js` and `audit/atlas-preview/sheet-*.html`) represent "top quality" prior to porting:

A deep technical evaluation of `scripts/lib/sheet-engine.js` demonstrates that **even the draft visual sheet engine relies on primitive geometric shortcuts, crude Catmull-Rom math splines, and incomplete data sets**:

1. **Primitive Stretched Ellipse Mountains (`RELIEF-P1-01`):**
   - Mountain ranges in `sheet-engine.js:182–203` are not drawn as authentic cartographic hachured ridges or topographic contours, but as stretched geometric SVG `<ellipse>` shapes (`<ellipse cx="678" cy="538" rx="10" ry="62" ... fill="url(#mountainHatch)"/>`) with a 45-degree line hatch pattern.
   - For the entire Mediterranean region, mountains are represented by just 3 rotated ellipses.
   - For `urheimat` (Genesis 1–11 / Prologue), mountain relief is completely empty (`urheimat: ''`).

2. **Sequential Unbranching Catmull-Rom Path Spaghetti (`ROUTE-P1-01`):**
   - `sheet-engine.js:531` constructs trade routes by executing a single Catmull-Rom spline interpolation through all `routeStops` (`catmullRom(routePts)`).
   - Sequential Catmull-Rom splines cannot model branching trade routes or return loops, forcing a single continuous line through all points.
   - Without manual `route_via` crutch points inserted in `route.json`, the spline bows into sea polygons and mountain lakes.

3. **Zero Glyphs Across 9 Out Of 11 Map Datasets (`GLYPH-P1-01`):**
   - Even though `sheet-engine.js` contains a `glyphSvg` function for rendering architectural city icons, 9 out of 11 route JSON files (`early-church`, `ishod`, `maccabim`, `melachim`, `pavel`, `revelation`, `shoftim`, `shvatim`, `yeshua`) contain **zero places with `glyph` or `glyph2` properties**.
   - As a result, 82% of all maps render as generic circles even when rendered with `sheet-engine.js`.

---

## 2. Source Code Evidence

### Evidence Item 1: Geometric Ellipse Relief in `sheet-engine.js`
```javascript
// File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (lines 182-195)
const RELIEF = {
  levant: `
  <g class="relief" aria-hidden="true">
    <ellipse cx="678" cy="538" rx="10" ry="62" fill="url(#mtG)" transform="rotate(14 678 538)" opacity=".55"/>
    <ellipse cx="704" cy="530" rx="12" ry="72" fill="url(#mountainHatch)" transform="rotate(16 704 530)"/>
    <ellipse cx="676" cy="524" rx="15" ry="82" fill="url(#mountainHatch)" transform="rotate(14 676 524)" opacity=".7"/>
...
  </g>`,
  urheimat: '',
```

### Evidence Item 2: Unbranching Catmull-Rom Spline Assembly
```javascript
// File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (line 531)
  const routePath = catmullRom(routePts);
```

### Evidence Item 3: Glyph Dataset Distribution across 11 `route.json` Files
- `avraam`: 14 places with glyphs
- `nachalo`: 3 places with glyphs
- `early-church`, `ishod`, `maccabim`, `melachim`, `pavel`, `revelation`, `shoftim`, `shvatim`, `yeshua`: 0 places with glyphs

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **RELIEF-P1-01** | Topography in `sheet-engine.js` drawn using stretched geometric `<ellipse>` shapes, and missing for `urheimat` | `scripts/lib/sheet-engine.js:182` | **VERIFIED OPEN** |
| **ROUTE-P1-01** | Catmull-Rom splines in `sheet-engine.js` fail on branching/return routes and bow into seas without `route_via` crutch points | `scripts/lib/sheet-engine.js:531` | **VERIFIED OPEN** |
| **GLYPH-P1-01** | 9 out of 11 map JSON datasets contain zero `glyph` properties, causing 82% of maps to render plain dots | `karty/*/route.json` | **VERIFIED OPEN** |
