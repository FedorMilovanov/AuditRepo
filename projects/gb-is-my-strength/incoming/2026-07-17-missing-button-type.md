# INCOMING EVIDENCE — Missing type="button" on Native Buttons

- Date: 2026-07-17
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Auditor: Arena Agent
- Component: `src/components/hard-texts/HardTextsPageChrome.astro`, `PastorSeriesPageChrome.astro`, `NagornayaSeriyaPageChrome.astro`, `NagornayaSeriyaBody.astro`

## Finding

By default, `<button>` elements inside or outside a form act as `type="submit"` in many browser contexts unless explicitly marked as `type="button"`. This can cause unwanted form submissions or page reloads if the structure changes or if the browser defaults fall back inconsistently. Good component-based engineering requires all JS-driven interactive buttons to have `type="button"`.

The main mobile menu toggle button `id="hMobileMenuBtn"` and the theme toggle `id="themeToggle"` correctly specify `type="button"` on the home page and `/biografii/` but they are missing `type="button"` in several other core page chromes:
- `HardTextsPageChrome.astro` (lines 54, 58, 121)
- `PastorSeriesPageChrome.astro` (lines 33, 37, 148)
- `NagornayaSeriyaPageChrome.astro` (lines 30, 34)
- `NagornayaSeriyaBody.astro` (line 37)

## Current Exact Source Witness
At current Product head, the following code is present in `HardTextsPageChrome.astro`:
```html
<button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">
<button class="h-mobile-menu-btn" id="hMobileMenuBtn" aria-label="Открыть меню" aria-expanded="false">
```
It is missing `type="button"`.

## Recommendation
This is a `NARROWED RESIDUAL` (visual parity/HTML structure missing a robust attribute). Add `type="button"` to all JS-driven interactive `<button>` elements across the `Astro` page chrome components.
