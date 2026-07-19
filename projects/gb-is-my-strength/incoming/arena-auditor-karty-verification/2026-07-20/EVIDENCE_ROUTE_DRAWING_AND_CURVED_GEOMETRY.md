# Evidence Report: Route Drawing Quality & Straight-Line Geometry Crutch

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/_engine/map-engine.js`, `/karty/avraam/route.json`, `/karty/*/route.json`

---

## 1. Executive Summary

An audit of the route line rendering logic in `karty/_engine/map-engine.js` shows that route geometry is constructed by joining place coordinates in series using straight SVG `L` command segments (`M x1,y1 L x2,y2 L x3,y3`).

Even when editorial route definitions (such as `karty/avraam/route.json`) contain hand-authored curved SVG paths (`stages[].paths`) following historical valleys, oases, and trade passes, `MapEngine` completely bypasses `stage.paths` and auto-draws straight line segments cutting straight through impassable mountain ranges (Taurus, Zagros) and open deserts.

---

## 2. Source Code Evidence & Analysis

### Evidence Item 2.1: Straight-Line SVG Path Assembly
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 1293-1298)
      // Stage paths
      const stagePaths=Array.from({length:(route.stages||[]).length},()=>[]);
      allPlaces.forEach(p=>{if(typeof p.stage==='number')stagePaths[p.stage]=stagePaths[p.stage]||[];stagePaths[p.stage].push(p)});
      stagePaths.forEach((places,i)=>{
        if(places.length<2)return;
        const d=places.map((p,j)=>`${j===0?'M':'L'}${p.x},${p.y}`).join(' ');
        const color=STAGE_COLORS[i]||STAGE_COLORS[0];
```
- **Analysis:** `places.map((p,j)=>`${j===0?'M':'L'}${p.x},${p.y}`).join(' ')` generates straight line segments. No check is made for `route.stages[i].paths` or custom path geometry.

### Evidence Item 2.2: Unchecked Stage Indexing (`stagePaths[p.stage]`)
- `allPlaces.forEach(p=>{if(typeof p.stage==='number')...})` guards `push`, but if `p.stage` is `undefined` (as in `avraam/route.json` for places 19–21), executing `stagePaths[undefined]` leads to `TypeError: Cannot read properties of undefined (reading 'push')` or undefined array access.

### Evidence Item 2.3: Unsettled DOM Layout `getTotalLength()` Execution
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 1305-1307)
        path.setAttribute('stroke-dasharray',path.getTotalLength());
        path.setAttribute('stroke-dashoffset',path.getTotalLength());
        path.style.transition = 'stroke-dashoffset 1.5s '+(i*0.3)+'s cubic-bezier(.4,0,.2,1), opacity .4s ease, stroke-width .4s ease, filter .4s ease';
        pathsG.appendChild(path);
```
- **Analysis:** `path.getTotalLength()` is called before browser layout settlement, returning `0`. This breaks initial `stroke-dasharray` values and causes route animations to jump or flash instantly.

---

## 3. Registered Bug IDs & Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **DATA-P0-01** | `MapEngine.js` ignores author curved SVG paths (`stages[].paths`), auto-drawing straight `M...L...L...` line segments | `karty/_engine/map-engine.js:1297` | **VERIFIED OPEN** |
| **RIVER-P1-04** | Execution of `path.getTotalLength()` before DOM layout settlement returns `0`, breaking stroke draw animations | `karty/_engine/map-engine.js:1306` | **VERIFIED OPEN** |
