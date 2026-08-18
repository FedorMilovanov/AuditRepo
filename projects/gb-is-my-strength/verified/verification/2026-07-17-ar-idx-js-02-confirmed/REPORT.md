# Verification Report: AR-IDX-JS-02

**Date:** 2026-07-17
**Status:** CONFIRMED (CURRENT DEFECT)

## Evidence
Confirmed the persistence of multi-writer logic for the `theme` localStorage key.

1. **Legacy Writer (`js/enhancements.js`)**:
   - URL: [https://gospod-bog.ru/js/enhancements.js](https://gospod-bog.ru/js/enhancements.js)
   - Code: `localStorage.setItem(window.SiteUtils&&SiteUtils.themeKey?SiteUtils.themeKey:"theme",dark?"dark":"light")`
   - Context: This script is active on the homepage, `/hard-texts/`, and `/#about`. It handles binary theme switching without awareness of the extended themes (e.g., `sepia`) introduced in the new system.

2. **Canonical Owner (`js/reader-preferences.js`)**:
   - URL: [https://gospod-bog.ru/js/reader-preferences.js](https://gospod-bog.ru/js/reader-preferences.js)
   - Code: `safeSet('theme', state.theme === 'dark' ? 'dark' : 'light');`
   - Context: Managed as part of the `gb:reader-preferences:v1` state, but explicitly writes back to the legacy `theme` key for backward compatibility.

## Conclusion
The multi-writer surface exists. Both scripts are attempting to manage the same key. The legacy script (`enhancements.js`) should be retired or stripped of its theme-writing logic to ensure `reader-preferences.js` remains the single source of truth.
