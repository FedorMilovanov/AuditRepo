# Evidence Report: Hebrew Typography Omission & Global Style Cleanup Bug

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/_engine/map-engine.js`

---

## 1. Executive Summary

A deep quality audit of font declarations and CSS style lifecycle management in `karty/_engine/map-engine.js` reveals two significant defects:

1. **Incorrect Hebrew Font Fallbacks (`FONT-P1-01`):**
   - Line 463 in `map-engine.js` defines Hebrew text styling as `.me-content .hw { font-family: Georgia, "Times New Roman", serif; }`.
   - Neither Georgia nor Times New Roman contains Hebrew glyphs.
   - Browsers force a fallback to system default sans-serif fonts, ignoring the project's dedicated `Noto Serif Hebrew` font asset available in `fonts/fonts.css`.

2. **Global CSS Removal on Map Destroy (`CSS-P1-01`):**
   - Lines 380–381 in `map-engine.js` execute `document.getElementById('me-base-css').remove()` inside `_cleanupAll()`.
   - When a map instance is destroyed (e.g. during SPA view navigation or multi-map unmounting), `<style id="me-base-css">` is completely removed from `<head>`.
   - Any remaining map instance or subsequent map element on the page immediately loses all CSS styling, resulting in broken controls, unstyled panels, and layout corruption.

---

## 2. Source Code Evidence

### Evidence Item 1: Incompatible Hebrew Font-Family Declaration
```css
/* File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (line 463) */
.me-content .hw{color:#e8c879;font-size:20px;font-family:Georgia,"Times New Roman",serif}
```

### Evidence Item 2: Unconditional `#me-base-css` Removal in Destroy Handler
```javascript
// File: /home/user/gb-is-my-strength/karty/_engine/map-engine.js (lines 379-382)
      // Remove injected CSS
      const css = document.getElementById('me-base-css');
      if (css) css.remove();
```

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **FONT-P1-01** | Omission of `Noto Serif Hebrew` in `map-engine.js` forcing system sans-serif font fallback for Hebrew words | `karty/_engine/map-engine.js:463` | **VERIFIED OPEN** |
| **CSS-P1-01** | Map instance `destroy()` removes global `<style id="me-base-css">`, stripping CSS from remaining instances | `karty/_engine/map-engine.js:380` | **VERIFIED OPEN** |
