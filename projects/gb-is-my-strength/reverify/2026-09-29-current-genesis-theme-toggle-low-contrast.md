# Current-main browser reverify — theme toggle contrast on Genesis 6 (2026-09-29)

## Disposition

**Admit one narrow current non-text contrast defect:** in the light reader theme on `/hard-texts/genesis-6/`, the header theme-toggle moon icon is nearly indistinguishable from its dark header surface. Fresh Chromium measurement gives **1.06:1**, below the 3:1 non-text contrast threshold.

ID: `GBS-GENESIS6-THEME-TOGGLE-LOW-CONTRAST`. The historical home-page portion of HDR-02 is **not included**: a fresh screenshot-pixel measurement on `/` gives 3.81:1 at the tested 1280px viewport, above 3:1. This row is separate from the theme-toggle keyboard-focus indicator defect, which concerns focus state rather than the resting icon contrast.

## Identity, overlap and scope

- Product `main` and `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Live `releaseSha` and `controlPlaneSha` from the 2026-09-29 release document: the same SHA.
- Open Product PRs #2142–#2145 do not touch header/theme-toggle styling. The focused open issue search for theme-toggle / Genesis 6 contrast returned no matches.
- Product source was not changed. The result is from a local production-like build at the exact current Product SHA, not a direct live-site browser run.

## Fresh browser measurement

Playwright Chromium `153.0.8010.0` rendered the current `dist` at 1280×900. On `/hard-texts/genesis-6/`, the 44×44 `.theme-toggle` has a transparent button surface and SVG stroke `rgb(26, 26, 26)`. Screenshot pixels sampled in the unpainted area of the same control give the underlying dark header/background as approximately `rgb(19, 20, 24)`. The resulting contrast is 1.06:1. The current body surface is `rgb(14, 17, 22)`; the sampled pixels account for the actual rendered header/backdrop rather than assuming the button's transparent CSS background is a color.

On `/`, at the same viewport, the SVG stroke is semi-transparent `color(srgb 0.364706 0.419608 0.431373 / 0.88)` over screenshot pixels averaging `rgb(243, 239, 230)`, yielding 3.81:1. The live browser connection attempt from this sandbox ended with `net::ERR_CONNECTION_CLOSED`; the local exact-SHA measurement is used. Current contrast screenshots and measurement JSON: `evidence/2026-09-29-theme-contrast-genesis6.png`, `evidence/2026-09-29-theme-contrast-home.png`, and `evidence/2026-09-29-target-and-contrast-reverify.json`.

## Historical comparison

The archived 2026-09-23 Wave 18 run reported 1.06:1 on `/hard-texts/genesis-6/` and 2.24:1 on `/`. The current browser independently reproduces the Genesis 6 failure but does **not** reproduce the home-page threshold failure; the latter is excluded from this admission.

## Closure boundary

Provide a theme-toggle icon color that meets at least 3:1 against the actual header surface in the default/light reader theme on `/hard-texts/genesis-6/`, without regressing its other theme states or focus visibility. Resulting-main proof should sample the actual rendered surface at representative responsive widths and include forced-colors behavior. Do not treat the separate focus-indicator row as closed by a contrast-only repair.
