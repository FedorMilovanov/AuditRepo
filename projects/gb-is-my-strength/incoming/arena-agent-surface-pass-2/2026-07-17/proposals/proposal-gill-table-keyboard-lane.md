# Proposal — Gill mobile table keyboard lane

- Status: `proposal-open`
- Finding: `GILL-MOBILE-TABLE-KEYBOARD-SCROLL`
- Proposed severity: P2
- Owner: Gill responsive table component/style contract

## Scope
Make each actual horizontal scroll region keyboard-enterable and meaningfully labelled while preserving table semantics, touch scrolling, local overflow and print layout.

## Acceptance
At `390×844`, every table with `scrollWidth > clientWidth` can receive focus through ordinary Tab order and pan horizontally by keyboard. Non-overflowing tables should not gain unnecessary tab stops if conditional enhancement is used. Verify Parts I–III and reference route in Chromium and WebKit; axe `scrollable-region-focusable` passes.

## Exclusions
Do not remove overflow, shrink text/columns to unreadability, or globally add tab stops to all tables without checking actual overflow.
