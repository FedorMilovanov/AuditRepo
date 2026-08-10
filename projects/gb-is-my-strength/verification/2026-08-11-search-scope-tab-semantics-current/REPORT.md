# Current verification — Search scope tab semantics

Date: 2026-08-11
Disposition: `CONFIRMED-CURRENT-A11Y / P3`
Product authority: `main@be8d439aec1e18f268d247967c70a0c318b1dabd`

## Current implementation

The Search command palette renders its four scope filters — `Все`, `Статьи`, `Ссылки`, `Авторы` — as:

- container `role="tablist"`;
- each native button `role="tab"`;
- `aria-selected` toggled on click.

However, current `js/search.js` does not implement the keyboard contract associated with a horizontal tablist:

- no Left Arrow / Right Arrow handling on scope tabs;
- no Home / End handling on scope tabs;
- no roving `tabindex` model where only the active tab is the tab stop;
- all four native buttons remain ordinary sequential Tab stops;
- no associated `tabpanel` relation exists for the selected tab.

The only Arrow/Home/End handler in the current Search UI is attached to the search input and moves the active result in the listbox. The palette-level Tab trap then cycles over all visible buttons/inputs, including the four scope buttons individually.

## Standards contract

WAI-ARIA APG Tabs Pattern defines a horizontal tab list as one Tab entry point with Left/Right movement among tabs; Home/End are supported in the documented tab pattern. WAI-ARIA defines `tab` as the selector for associated tab content and expects the selected tab to represent the currently perceivable associated panel.

The current Search scope controls are filters over one result surface, not a set of tab panels. Their exposed role therefore promises a keyboard/structural model that the implementation does not provide.

## Existing permanent test gap

`search-cold-bootstrap-browser-test.mjs` verifies cold loading, visible/focusable opener, Ctrl+K, focus on the search input, Escape closure and no page errors in Chromium + WebKit. It does not exercise the scope controls' role/keyboard behavior.

This root is independent of the already-closed `V12-SEARCH-COLD-BOOTSTRAP` lane.

## Required terminal outcome

Choose one semantically truthful model and prove it permanently:

### Option A — actual tabs

- retain `tablist/tab` only if scopes are represented as associated tab panels;
- implement roving focus with only the active tab in sequential Tab order;
- Left/Right navigate horizontally and wrap as appropriate;
- Home/End move to first/last;
- activation updates selected state and associated content consistently.

### Option B — scope filters / single-select controls

- remove the misleading tab roles;
- expose a truthful single-select filter model (for example native buttons with pressed/current state or another appropriate grouped selection pattern);
- keep clear accessible group naming and selected-state announcement;
- preserve keyboard access without adding four false tab-widget stops.

Permanent proof must cover Chromium + WebKit, keyboard-only activation, selected-state exposure, focus sequence, and search result semantics without regressing cold bootstrap or listbox navigation.

Residual: **CURRENT / OPEN**.
