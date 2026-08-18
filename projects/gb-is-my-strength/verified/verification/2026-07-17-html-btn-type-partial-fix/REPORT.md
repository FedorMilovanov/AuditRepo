# Verification Report: HTML-BTN-TYPE (Re-verification)

**Date:** 2026-07-17
**Status:** OPEN (PARTIAL FIX)

## Current Evidence
Checked multiple shell components for `type="button"` on interactive buttons.

| Component / Page | button#themeToggle | button#hMobileMenuBtn |
|---|---|---|
| **Home (gospod-bog.ru)** | OK | OK |
| **HardTexts (/hard-texts/)** | **FAIL** (Missing type) | **FAIL** (Missing type) |
| **PastorSeries (/articles/...)** | Not found | OK |
| **Nagornaya (/nagornaya/)** | OK | Not found |

### Details for HardTexts:
- `themeToggle`: `<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">`
- `hMobileMenuBtn`: `<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" ...>`

## Conclusion
The defect is **still present** in `HardTextsPageChrome`. The previous closure was premature due to incomplete surface coverage. The row is restored to MASTER with narrowed boundary.
