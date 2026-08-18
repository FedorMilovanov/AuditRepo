# INCOMING EVIDENCE — AR-IDX-JS-02 Multi-writer Theme Surface

- Date: 2026-07-17
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Auditor: Arena Agent
- Component: `js/enhancements.js`, `js/site.js` vs `src/runtime/reader-preferences.js`

## Finding

Historical finding `AR-IDX-JS-02` indicated that theme persistence now has a canonical owner `gb:reader-preferences:v1` in `reader-preferences.js`. However, older runtime scripts `enhancements.js` and `site.js` still contain legacy write operations utilizing the fallback `"theme"` key.

Current inspection reveals in `js/enhancements.js`:
```javascript
localStorage.setItem(window.SiteUtils&&SiteUtils.themeKey?SiteUtils.themeKey:"theme",dark?"dark":"light")
```
Similar fallback logic remains scattered across the older runtime layers. This preserves a multi-writer surface for the theme state, conflicting with the canonical owner `reader-preferences.js`.

## Current Exact Source Witness
At current Product head, `js/enhancements.js` and potentially `js/site.js` continue to access/write `localStorage.setItem` using the `"theme"` key fallback.

## Recommendation
Strip the legacy `localStorage` theme-writing logic from `enhancements.js` and delegate all theme persistence to the canonical `gb:reader-preferences:v1` mechanism. Track this in `MASTER_BUG_MATRIX.md` under `NARROWED RESIDUALS`.
