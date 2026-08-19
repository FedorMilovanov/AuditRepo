# Proposal — Atlas control accessibility lane

- Status: `proposal-open`
- Findings: `ATLAS-MOBILE-FILTER-UNNAMED`, `ATLAS-SEARCH-COMBOBOX-SEMANTICS`
- Proposed severity: P2 each
- Owner: Atlas control markup/styles/runtime

## Scope
1. Stable filter accessible name independent of hidden responsive text.
2. Valid input/listbox combobox role/state/autocomplete relationship.
3. Preserve current query, Arrow navigation, selection, Escape and responsive focus transfer.

## Acceptance
Chromium and WebKit at mobile/desktop: named filter; combobox accessibility snapshot; expansion/results announced through valid ARIA; no axe `button-name` or `aria-allowed-attr`; existing Atlas state/focus contracts pass.

## Exclusions
No visual redesign, search ranking change, map data change, or unrelated mobile-chrome work.
