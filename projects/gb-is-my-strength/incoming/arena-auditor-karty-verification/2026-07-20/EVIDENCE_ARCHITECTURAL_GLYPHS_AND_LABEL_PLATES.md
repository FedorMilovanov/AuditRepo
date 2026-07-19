# Evidence Report: Architectural Glyphs & Label Plate Rendering Audit

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/_engine/map-engine.js`, `/karty/*/route.json`

---

## 1. Executive Summary

An audit of marker rendering and label layout in `karty/_engine/map-engine.js` across all 11 map routes reveals two major graphic design deficits:

1. **Complete Absence of Custom Architectural Glyphs:**
   - Across all 11 map routes, 100% of place markers are rendered as simple generic SVG circles (`r=4.5`).
   - `custom_icons` set in `route.json` files is empty across the entire repository.
   - None of the historical places feature handcrafted architectural glyphs (gate, tower, tent, tabernacle, altar, temple, port, battle) as required by the Owner Aesthetic Canon ("ВАРИАНТ 1: Эстетика: древняя карта в стиле атласа").

2. **Crude Text Width Calculations for Label Background Plates:**
   - `map-engine.js:1550` calculates label background box width using a fixed monospace multiplier: `labelText.length * fontSize * 0.6`.
   - On wide Cyrillic (`Ш`, `Ж`, `М`, `Ю`) and Hebrew (`ש`, `מ`, `ת`) characters, this formula severely underestimates text width, causing glyphs to spill out past background rectangle bounds. On narrow characters (`1`, `i`), it overestimates width, producing oversized blank margins.
   - Label plates are styled as modern dark charcoal translucent rectangles (`rgba(7,10,16,.75)`), contradicting the warm parchment/vellum plate aesthetic of Option 1 Canon.

3. **Wrong-Target Mouse Hover Animation:**
   - `map-engine.js:1492` queries `circle:nth-child(3)` for mouseenter/mouseleave hover scaling. Because the dashed stage badge circle (`badge`) is child 3, hover actions scale the background stage ring rather than the core marker dot (`dot`, child 4).

---

## 2. Source Code Evidence

### Evidence Item 3.1: Monospace Text Width Multiplier
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 1550 & 1610)
        const textWidth=labelText.length*fontSize*0.6;
...
        const bgX = ap.ta==='end' ? lx-textWidth-3 : ap.ta==='middle' ? lx-textWidth/2-3 : lx-3;
        const labelBg=document.createElementNS('http://www.w3.org/2000/svg','rect');
        labelBg.setAttribute('x',String(bgX));
        labelBg.setAttribute('y',String(ly-11));
        labelBg.setAttribute('width',textWidth+6);
        labelBg.setAttribute('height','14');
        labelBg.setAttribute('rx','3');
        labelBg.setAttribute('fill','rgba(7,10,16,.75)');
```

### Evidence Item 3.2: Hover Target Selector Bug (`circle:nth-child(3)`)
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 1492 & 1542)
        g.addEventListener('mouseenter',()=>{if(inStory){const d=g.querySelector('circle:nth-child(3)');if(d){d.setAttribute('r','6');d.setAttribute('filter','url(#me-gold-glow)');}...}});
```

---

## 3. Registered Bug IDs & Status

| Bug ID | Summary | Target File / Line | Status |
| :--- | :--- | :--- | :--- |
| **DRAW-P1-03** | Absence of architectural place symbols/glyphs — all places render as generic circles (`r=4.5`) | `karty/_engine/map-engine.js:1528` | **VERIFIED OPEN** |
| **ENGINE-P1-23** | Hover animation queries `circle:nth-child(3)`, animating background dashed badge ring instead of core dot | `karty/_engine/map-engine.js:1492` | **VERIFIED OPEN** |
| **TEXT-P1-01** | Label background width calculation `length * fontSize * 0.6` causes glyph clipping on wide Cyrillic/Hebrew text | `karty/_engine/map-engine.js:1550` | **VERIFIED OPEN** |
