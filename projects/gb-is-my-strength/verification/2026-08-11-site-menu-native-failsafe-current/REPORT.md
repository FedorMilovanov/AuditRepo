# Current verification — Site Sections Menu native fail-safe

Date: 2026-08-11
Disposition: `CONFIRMED-CURRENT-FAILSAFE / P3`
Product authority: `main@be8d439aec1e18f268d247967c70a0c318b1dabd` at verification snapshot
Repair lane: Product PR #1584, head `9a8d71a5cbd546b8880072132f1d869d0ae2cf55`

## Scope boundary

This is not a resurrection of the closed full-site menu ownership root from Product #1558. #1558 correctly closed opener ownership, overlay lifecycle, scroll lock, focus restore, no-JS navigation and normal rich presentation.

The current residual is narrower and newly verified: **native closed-state safety when authored presentation is unavailable/broken before or around runtime ownership**.

## Current-main proof

On current main, shared `SiteSectionsMenu.astro` renders the rich backdrop and rich navigation surface with semantic closed-state attributes, but:

- the backdrop has no native `hidden`;
- the panel has `inert` but no native `hidden`;
- rich chevron SVGs have `viewBox` only and no native `width`, `height`, `fill` or `stroke` bounds.

Current `SiteSectionsMenuRuntime.astro` version 1 toggles class, inert and ARIA state, but does not use native hidden as the closed rendering fail-safe.

`inert` removes interaction but does not itself make the element non-rendering. The shared rich card therefore still depends on authored CSS to stay visually absent. If that presentation is unavailable, raw SVG fallback geometry/fill is also not bounded by markup.

This is deterministic current source evidence for a fail-safe defect. It does not claim that normal CSS-loaded production currently displays the broken state.

## Existing bounded repair

Product PR #1584 is an open draft changing exactly three files:

- `SiteSectionsMenu.astro`;
- `SiteSectionsMenuRuntime.astro`;
- `scripts/site-sections-menu-visual-contract.mjs`.

It adds:

- native `hidden` to rich panel and backdrop while keeping panel inert;
- native 13×13, fill-none, currentColor-stroke SVG attributes;
- runtime version bump and native hidden lifecycle;
- immediate native closure when no transition exists / reduced motion is active;
- cross-browser contract assertions for mobile closed state, no-CSS state, backdrop, ARIA, Escape/backdrop focus restore, geometry and horizontal overflow;
- registry-derived route discovery rather than one handpicked page.

## Current evidence limitation

The PR's canonical browser contract has not yet completed on its current stale branch because source/cache-bust control-plane checks fail before the browser steps due unrelated terminal/generated revision drift. Therefore the current classification is deliberately limited:

- current fail-safe source defect: **confirmed**;
- normal CSS-loaded user-visible regression: **not claimed**;
- proposed repaired cross-browser lifecycle: **must be re-proved from fresh final main**.

## Required terminal outcome

1. Replay the exact three-file repair from fresh final main.
2. Production-like build must emit rich shared menus natively hidden/inert when closed, with bounded native SVG geometry.
3. Chromium + WebKit must prove mobile closed state before any desktop fallback.
4. Remove authored styles in-browser and prove panel/backdrop remain non-rendering; open/close must restore native safe state.
5. Escape and backdrop close must restore opener focus and leave correct ARIA state.
6. Run across registry-derived production routes using the shared menu owner.
7. Merge only from fresh main and rerun permanent proof on current main.

Residual until then: **CURRENT / OPEN**.
