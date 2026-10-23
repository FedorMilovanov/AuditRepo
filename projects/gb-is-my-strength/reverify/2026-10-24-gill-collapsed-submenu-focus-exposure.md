# Gill collapsed submenu focus/exposure — current receipt

Date: 2026-10-24  
Product anchor: `8d93fe4206e579e766727dbe865e0d07cf30d3c5` (`main`)  
Disposition: **admit one system verification lane** — `SYS-GILL-RAIL-COLLAPSED-SUBMENU-EXPOSURE`.  
Product mutation: none.

## Question

Does the Gill rail's shared collapsible-subgroup owner make folded links unavailable to keyboard and assistive-technology users, or does it only remove their paint and pointer hit testing?

## Shared owner and current reach

`GillSeriesRail.astro` initially adds `gbs2-collapsed` to level-three rows outside the current group. `floating-cluster-controller.js` then moves that class as scrollspy changes group and drives `maxHeight` for animation and metro-line geometry. `floating-cluster.css` defines the closed state with `max-height:0`, `opacity:0`, a transform and `pointer-events:none`.

None of those owners synchronizes `hidden`, `inert`, `aria-hidden`, descendant tab order, or focus evacuation/restoration. The current data makes the defect initially visible on `/articles/dzhon-gill-chast-1-chelovek/`: eight links in the second H2 group start folded while four links in the current group remain open. The five other Gill surfaces sampled have no initially folded level-three rows; this is one shared state-contract defect, not eight route rows.

## Browser proof

Chromium `153.0.8010.0`, production-like build, zero page errors.

A six-route desktop/mobile inventory found eight initially collapsed anchors, all on Gill part 1. At 1440×844 they retain `tabIndex=0` and nonzero anchor boxes while their `li` ancestors compute to `opacity:0`. At 390×844 the desktop rail itself is not rendered, so no mobile sequential-focus claim is made.

Trusted keyboard traversal at desktop width was repeated in Light and Dark:

1. focus starts on the visible parent link `#part-pastor`;
2. the next eight real Tab presses visit, in order, all eight opacity-zero collapsed links;
3. the ninth Tab reaches the next visible row `#sec-quiz`;
4. from `#sec-quiz`, a real Shift+Tab returns to the last invisible collapsed link.

Thus this is not inferred from `tabIndex` and not established by programmatic focus. Natural forward and reverse traversal both enter the folded group.

Chromium ARIA snapshots in both themes also retain the collapsed link names, including «Хорслидаун…», «Евангельская активность…» and «Кеттеринг, Саутварк…». The visual collapse therefore diverges from both keyboard and AX state.

## Existing guard false green

`scripts/gill-pre-v16-submenu-regression-audit.js` is a strong geometry/content/scrollspy guard, but its collapsed-state signature is only a string of `gbs2-collapsed` classes used to stabilize metro-line measurements. It does not inspect:

- sequential focus while rows are folded;
- accessibility-tree exposure;
- focus evacuation if scroll-driven collapse contains the active element;
- restoration of authored focusability after reopening.

The present defect can therefore satisfy the permanent Gill submenu workflow.

## Bounded repair and closure

The shared rail owner must project one state to paint, pointer, keyboard and accessibility surfaces:

- folded rows leave sequential focus and the accessibility tree;
- unfolded rows regain their authored semantics and focusability;
- if scroll-driven group collapse contains focus, focus moves deliberately to the corresponding visible H2 link (or another documented stable owner) before hiding;
- no-JS content remains available under the existing progressive-enhancement contract;
- metro-line geometry, scrollspy, active-row following and animation remain intact.

A synchronized `inert`/visibility contract is preferable to globally rewriting descendant `tabindex`. If `hidden` is used, transition timing cannot become the semantic owner and reduced-motion behavior must remain deterministic.

Required resulting-main proof:

1. Gill part 1 initial Light/Dark forward Tab and reverse Shift+Tab skip all eight folded links;
2. closed link names are absent from the AX snapshot and return after opening;
3. focus inside a group that is then folded is evacuated to a visible stable owner;
4. pointer and keyboard navigation work after reopening;
5. all Gill routes retain scrollspy, one active row, counter, metro-line geometry and active-row visibility at desktop widths;
6. mobile/no-JS/reduced-motion controls remain readable and operable.

## Boundaries

- This does not duplicate `SYS-FAQ-COLLAPSED-FOCUS-EXPOSURE` or `SYS-READER-SPEED-KEYBOARD-MODEL`: the visual anti-pattern is similar, but component, lifecycle, focus restoration and regression owner are distinct.
- The Gill links and targets themselves are valid when the group is open.
- No claim is made that all Gill routes start with folded rows; current data localizes initial exposure to part 1 while the mechanism is shared and scroll-driven.
- Open Product PRs #2188, #2179, #2164 and #2143 do not own the Gill rail or its submenu guard.
- Product source was not changed.

## Evidence

Compact receipt: `evidence/2026-10-24-gill-collapsed-submenu-focus-exposure.jsonl`.
