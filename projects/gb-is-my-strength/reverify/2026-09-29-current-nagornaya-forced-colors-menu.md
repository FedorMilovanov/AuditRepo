# Current-main browser reverify — Nagornaya hamburger disappears in forced colors (2026-09-29)

## Disposition

**Confirmed current forced-colors defect on all eight Nagornaya routes:** the mobile navigation menu button is icon-only, but its three bars are CSS-background-painted `<div>` elements. In `forced-colors: active`, the bars are overridden to the same white canvas color as the button; the button has no visible border or alternative glyph. The control remains interactive, but its visual affordance disappears.

ID: `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS`. Scope is the mobile menu control in forced-colors mode; this does not assert a defect in the desktop menu or other icon controls.

## Identity and overlap

- Product `main` / `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`, also the current live release/control-plane SHA.
- Open PRs #2142–#2145 do not change the Nagornaya page chrome or menu styles. The focused open issue search for forced-colors menu/hamburger returned no matches.
- Product code was not changed. Fresh browser evidence uses a local production-like build at the exact current Product SHA; remote live-browser navigation was blocked by `net::ERR_CONNECTION_CLOSED`.

## Current source and fresh Playwright witness

The shared mobile header in `src/components/nagornaya/chast-1/NagornayaChast1PageChrome.astro` renders icon-only `button#menuBtn[aria-label="Открыть меню"]` with three `<div class="bar h-0.5 bg-white ...">` children. The button has no persistent border or visible text/SVG fallback. The same chrome is used on the index, parts 1–5, sources and findings routes.

Fresh Playwright Chromium `153.0.8010.0` used `forcedColors: 'active'`, a 390×844 mobile viewport and the local production-like `dist`. On all eight routes, `matchMedia('(forced-colors: active)')` was true; the button measured 36×30, its background computed to `rgb(255, 255, 255)`, its border width was 0px, and all three 20×2 bars also computed to white. Clicking each button still changed `aria-expanded` to `true`, so the failure is the vanished visual entry affordance, not a broken menu action.

Current captures: `evidence/2026-09-29-nagornaya-menu-normal.png` and `evidence/2026-09-29-nagornaya-menu-forced-colors.png`. The first shows the normal dark button and white bars; the second is visually blank. Per-route measurements: `evidence/2026-09-29-forced-colors-all-nagornaya-routes.json`.

The 2026-09-23 Wave 16 run is retained as historical corroboration only; this 2026-09-29 Playwright run is the fresh same-SHA browser witness.

## Closure boundary

Provide a menu icon/affordance that survives forced-colors mapping (for example, a currentColor/system-color SVG, system-color bars, or a visible system-color outline together with an identifiable glyph). Resulting-main browser proof should cover `forced-colors: active` at mobile width on all eight routes, menu open/close and visible keyboard focus, then regress normal light/dark, pointer and touch behavior.
