# Gill navigation collapsed-focus exposure — current receipt

Date: 2026-10-24
Product anchor: `8d93fe4206e579e766727dbe865e0d07cf30d3c5` (`main`)
Disposition: **admit one system verification lane** — `SYS-GILL-NAV-COLLAPSED-FOCUS-EXPOSURE`.
Product mutation: none.

## Question

Do Gill navigation disclosures make folded links unavailable to keyboard and assistive-technology users, or do the three current state machines only remove paint and pointer hit testing?

## Shared root and three manifestations

The Gill navigation family repeats one incomplete collapsed-state contract:

1. `GillSeriesRail.astro` initially marks inactive level-three rows `gbs2-collapsed`; scrollspy in `floating-cluster-controller.js` moves that class between groups. CSS uses `max-height:0`, `opacity:0`, transform and `pointer-events:none`.
2. The desktop `#gbsTocToggle` adds `toc-collapsed` to the whole current-part panel and synchronizes only the toggle's `aria-expanded`/label. CSS makes `.gbs2-tocscroll` zero-height, opacity-zero and pointer-inert.
3. `GillPartTocOverlay.astro` independently toggles `open` on mobile part/article accordions and synchronizes only each header/chevron's `aria-expanded`. CSS folds regions with `grid-template-rows:0fr` and makes their links opacity-zero.

None of these state owners synchronizes `hidden`, `inert`, `aria-hidden`, descendant tab order, or focus evacuation/restoration. The repeated mechanism should be repaired through one Gill disclosure-state contract rather than three more CSS exceptions.

## Browser proof

Chromium `153.0.8010.0`, production-like build, zero page errors.

### Inactive desktop subgroup

A six-route desktop/mobile inventory found eight links initially marked `gbs2-collapsed`, all on Gill part 1. At 1440×844 they retain `tabIndex=0` and nonzero anchor boxes while their `li` ancestors compute to `opacity:0`. At 390×844 the desktop rail itself is not rendered, so no mobile claim is made for this specific surface.

Trusted traversal in desktop Light and Dark:

- focus starts on visible parent `#part-pastor`;
- eight real Tab presses visit all eight opacity-zero collapsed links;
- the ninth reaches visible `#sec-quiz`;
- Shift+Tab from `#sec-quiz` returns to the last invisible link.

Chromium ARIA snapshots retain collapsed names including «Хорслидаун…», «Евангельская активность…» and «Кеттеринг, Саутварк…».

### Whole desktop TOC disclosure

On each of six Gill routes, activating the real `#gbsTocToggle` produces `aria-expanded=false` and an opacity-zero `.gbs2-tocscroll`, but every link remains `tabIndex=0`: **70 repeated instances** across the six built pages (6–16 per route).

On Gill part 1 Light and Dark, a trusted Tab from the collapsed toggle immediately enters hidden `#part-calling`; all 15 links in that closed panel remain sequentially active. The collapsed panel's ARIA snapshot still includes current-part navigation names.

### Mobile part/article accordions

After opening the real `#mobPartTocBtn`, each route has five closed part regions. Across the six Gill pages, **380 repeated folded link instances** remain `tabIndex=0` and opacity-zero (59–69 per built page, including closed nested article regions).

On Gill part 1 mobile Light and Dark, focus was placed on the first closed part header and the next trusted Tab entered its opacity-zero «Перейти к части» link despite `aria-expanded=false`. The open dialog's ARIA snapshot retains that closed-region link.

These are natural forward/reverse keyboard results, not success inferred from `tabIndex` or established through direct focus.

## Existing guards are false green for this property

- `gill-pre-v16-submenu-regression-audit.js` reads `gbs2-collapsed` signatures only to stabilize metro-line geometry; it never checks focus or AX exclusion.
- `reader-controls-residual-browser-contract.mjs` verifies that mobile headers/chevrons have valid `aria-controls` targets and that `aria-expanded` changes after click. It does not inspect folded descendants, AX exposure, or focus evacuation.
- the overlay a11y contract protects the top-level closed dialog and speed rails; it does not establish nested accordion semantics once the dialog is open.

All three current manifestations can therefore pass permanent CI while folded links remain keyboard/AX active.

## Bounded repair and closure

Create one reusable Gill disclosure-state primitive (or equivalent single contract) and use it for subgroup, whole-TOC and mobile part/article transitions:

- folded regions leave sequential focus and the accessibility tree;
- unfolded regions regain authored semantics and focusability;
- collapse containing focus first moves focus to its exact visible controller or a documented stable parent;
- transition geometry is presentational and never owns semantic state;
- no-JS content remains available under existing progressive enhancement;
- do not globally rewrite descendant `tabindex` without reversible ownership.

Required resulting-main proof:

1. initial inactive subgroup forward/reverse traversal and AX exclusion in Light/Dark;
2. desktop whole-TOC close/open across all Gill routes, including focus inside at collapse;
3. mobile part and nested article accordion close/open across flat and book shapes, including focus inside at collapse;
4. folded descendants absent from Tab/AX and restored when open;
5. pointer and keyboard navigation remain valid after reopen;
6. scrollspy, one active row, counter, active-row following and metro-line geometry remain intact;
7. mobile/no-JS/reduced-motion controls remain readable and operable.

## Boundaries

- This does not duplicate FAQ or reader-speed lanes: the anti-pattern is similar, but the Gill components, lifecycle, restoration owners and permanent guards are distinct.
- Link destinations are valid while their regions are open.
- Counts are repeated built-page instances, not claims of 450 unique content defects.
- Open Product PRs #2188, #2179, #2164 and #2143 do not own Gill navigation or its guards.
- Product source was not changed.

## Evidence

Compact receipt: `evidence/2026-10-24-gill-collapsed-submenu-focus-exposure.jsonl`.
