# Evidence Report: Media Hotlinking, Cartouche Magic Multipliers & Compass Rose Styling

**Audit Date:** 2026-07-20  
**Target Repository:** `FedorMilovanov/gb-is-my-strength`  
**HEAD Commit:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb` on `main`  
**Audit Scope:** `/karty/*/route.json`, `/scripts/lib/sheet-engine.js`

---

## 1. Executive Summary

Continuing our deep quality evaluation of the draft sheet vector engine (`sheet-engine.js`) and asset architecture, three critical quality vulnerabilities were verified:

1. **Uncached Third-Party Media Hotlinking (`MEDIA-P1-01`):**
   - 100% of archaeology and place photos across all 11 map datasets (312 image URLs) depend on direct hotlinking to external third-party CDNs (`upload.wikimedia.org` x226, `commons.wikimedia.org` x82, `ritmeyer.com` x2, `tile.loc.gov` x2).
   - Zero image files are stored locally in the repository's build pipeline or media directories.
   - This subjects the app to severe third-party dependency risks, network latency, CORS blocks, broken links on Wikipedia file renames, and complete failure of offline/PWA caching.

2. **Magic Multiplier Cartouche Bounding Box Calculations (`CART-P1-01`):**
   - In `sheet-engine.js:745`, cartouche title box width uses hardcoded magic float multipliers (`title.length * 14.6` and `subtitle.length * 6.6`).
   - Cyrillic titles with wide character distributions overflow the plate bounds or leave disproportionate blank padding.

3. **Modern Russian Letter `С` in Classical Compass Rose (`ROSE-P1-01`):**
   - In `sheet-engine.js:731`, the cardinal indicator below the compass rose is rendered as a plain modern Russian letter `С` (`font-size="13"`), creating an aesthetic clash against the classical 18th-century compass rose engraving.

---

## 2. Source Code Evidence

### Evidence Item 1: Domain Distribution of 312 External Image Links
- `upload.wikimedia.org`: 226 links
- `commons.wikimedia.org`: 82 links
- `www.ritmeyer.com`: 2 links
- `tile.loc.gov`: 2 links
- **Local image assets in `route.json`:** 0

### Evidence Item 2: Magic Multiplier Box Calculation
```javascript
// File: /home/user/gb-is-my-strength/scripts/lib/sheet-engine.js (line 745)
  const cartW = Math.max(400, 46 + Math.max((meta.title || slug).length * 14.6, ((meta.subtitle || '').length) * 6.6)) * k;
```

---

## 3. Registered Bug IDs & Verification Status

| Bug ID | Summary | Source Reference | Status |
| :--- | :--- | :--- | :--- |
| **MEDIA-P1-01** | 100% of map photos (312 URLs) rely on uncached third-party hotlinking to Wikimedia | `karty/*/route.json` | **VERIFIED OPEN** |
| **CART-P1-01** | Cartouche width formula using magic floats (`length * 14.6`) causes text clipping | `scripts/lib/sheet-engine.js:745` | **VERIFIED OPEN** |
| **ROSE-P1-01** | Compass rose renders modern Russian letter `С` instead of classical cardinal engraving | `scripts/lib/sheet-engine.js:731` | **VERIFIED OPEN** |
