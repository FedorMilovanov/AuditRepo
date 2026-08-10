# WAVE 07 — Atlas focus-state ownership + Karty semantic control

Date: 2026-08-10
Agent: ChatGPT
Status: raw current evidence; one Atlas root selected for verification, two candidates held

## Anchors

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652` (`pages-release-candidate-31379283849-1`).
- AuditRepo immediately before write: `ffdd89af0b3d7ef29fc87de7ba81d7e2adbbd819`.
- Product open PR immediately before write: 0.
- No matching active Product branch was found for `map` or `karty` in the preflight search.

No Product mutation was performed.

## Browser evidence boundary

Direct browser navigation to localhost is blocked by the current environment. The Atlas interaction witness therefore used an explicit audit transport built from the exact release artifact:

- `/map/index.html` from artifact `9059689652`;
- its exact inlined Atlas CSS;
- exact `/js/atlas-runtime.js`;
- exact `/data/relations.compiled.json`;
- external/non-Atlas resources and CSP removed only from the audit document;
- the compiled-data request fulfilled locally from the exact candidate bytes.

This is a real Chromium DOM/keyboard execution of the current published Atlas state machine, but it is not claimed as a direct production-origin browser session. WebKit is not installed in the current container and was not claimed.

Viewports exercised: 390×844, 680×900, 681×900, 1440×1000.

## A. Atlas focus-state lifecycle — current defect class

The Atlas is structurally functional: the runtime reports 42 compiled nodes, roving node Arrow navigation works, Enter opens a focused node, node-level Escape can close detail while preserving node focus, search result `aria-activedescendant` selection works, and responsive graph profiles switch at 680/681.

The defect appears when state transitions hide or replace the element that currently owns keyboard focus.

### A1. Closing detail strands focus on the closed control

At 390×844:

1. open a graph node;
2. focus `#atlasDetailClose`;
3. press Enter.

The detail state closes, but `document.activeElement` remains `#atlasDetailClose`. On mobile the button is then below the viewport at about `y=884` while the viewport is 844 px high.

The same focus retention occurs on desktop after detail closes; the desktop detail becomes hidden by CSS but the active element remains its close button.

### A2. Detail-to-related-node navigation destroys the focused element

The detail renderer creates related-node buttons (`data-detail-focus`). Activating one calls another focus transaction that replaces the detail subtree. After activation the new node/detail state is correct, but `document.activeElement` falls to `BODY`.

This reproduces at 390, 680, 681 and 1440.

### A3. Desktop list → graph navigation loses focus

At 1440 the `Карта / Список` switch is visible. In List mode, focusing a `На карте` button and pressing Enter:

- changes the state to graph;
- opens the target detail;
- hides the list that contained the focused button;
- leaves `document.activeElement === BODY`.

### A4. Mobile theme selection auto-closes drawer but focus remains offscreen

At 390/680/681 the sidebar is an off-canvas drawer. A theme button can receive focus; selecting it calls group state + `closeFilters()`.

After the drawer closes, focus remains on that theme button while its bounding box is hundreds of pixels to the left of the viewport (representative 390 result: `x≈-351`).

### A5. Mobile drawer close leaves focus inside the offscreen drawer

Focusing `#atlasFilterClose` and activating it closes the drawer, but focus remains on the close button as it moves offscreen (representative 390 settled witness already negative-x; 680/681 roughly `x≈-81`).

### A6. Closed mobile drawer and closed detail are keyboard-visible even before opening

A fresh 390×844 Tab traversal on the closed initial state shows no semantic hiding for the off-canvas controls:

- Tab 5: closed `#atlasFilterClose`, `x≈-81`;
- Tab 6–14: all theme buttons, `x≈-356`;
- Tab 15–18: four relation-filter inputs, `x≈-348`;
- Tab 24: closed `#atlasDetailClose`, below viewport at `y≈884`.

All of these controls reported no `[hidden]`, `[inert]` or `aria-hidden="true"` ancestor. The drawer/detail are visually moved offscreen with transforms rather than removed from the sequential focus order.

This is the strongest manifestation because the user does not need to open any panel first: normal Tab navigation enters invisible/offscreen UI in the initial mobile state.

## B. Source mechanism — one state owner, not six unrelated symptoms

Current Atlas runtime state helpers are visual/data-state owners but do not own focus:

- `closeFilters()` only removes `.is-open` and updates `aria-expanded`;
- `setGroup()` clears data focus, applies filters and calls `closeFilters()`, without transferring keyboard focus;
- `setView()` toggles `hidden` between graph/list but does not move focus when the active element belongs to the view being hidden;
- detail rendering uses `replaceChildren()`, so focused relation controls can be destroyed;
- `clearFocus()` closes detail visual/state ownership but does not restore a meaningful focus target;
- mobile CSS moves sidebar/detail offscreen but does not make their closed controls inert or otherwise remove them from sequential navigation.

One bounded Atlas focus-state owner can therefore explain the full class. Do not create one MASTER row per button.

## C. Why current Atlas CI can remain green

Current `engine:sweep` includes `atlas-browser-contract.mjs` and `atlas-state-browser-contract.mjs`.

Those contracts are strong for:

- exact compiled-data request ownership;
- runtime node/edge counts;
- desktop geometry/detail expansion;
- zoom;
- search data state;
- list rendering;
- mobile 390 geometry and 44 px controls;
- mobile filter open/close by click;
- mobile detail sheet geometry;
- no-JS compiler-backed list fallback;
- focus URL/query state and relation filtering.

But they drive the relevant transitions by click/tap and do not assert `document.activeElement`, offscreen sequential focus order, focus restore after view replacement, or inertness of closed mobile drawers/sheets.

Therefore a green Atlas browser sweep does not contradict this focus-lifecycle defect; it defines the exact false-green boundary.

## D. Atlas mobile accessible-list parity — current candidate, not promoted here

`AtlasBody.astro` describes List mode as `Доступное представление`. Current CSS hides `.atlas-view-switch` at every width `<=980px`, while the runtime still supports list state and no-JS fallback exposes a list.

Direct current browser/source evidence:

- 390: list switch not visible;
- 680: not visible;
- 681: not visible;
- 1440: visible and functional.

No second visible mobile control for switching to List mode was found. `?view=list` can represent the state, but it is not a discoverable UI control.

Disposition: hold as `CANDIDATE / ACCESSIBILITY+FEATURE PARITY`. The graph itself has keyboard node semantics, so lack of the alternate view is not promoted to mandatory work without a more explicit AT/owner-intent decision.

## E. Shared MapEngine negative control and separate semantic candidate

Current shared `karty/_engine/map-engine.js` uses a substantially stronger overlay lifecycle than the Atlas:

- canonical `OverlayRuntime` when available;
- fallback opener capture;
- inert/`aria-hidden` ownership for underlay targets;
- focus target inside the panel;
- focus restore on close;
- Escape and nested photo overlay handling.

This is useful negative control: the Atlas focus defect should not be generalized to all maps.

However, the MapEngine place panel has a separate semantics question. The current engine creates `.me-panel` with `aria-hidden`/`inert`, but no `role`, `aria-modal`, `aria-label` or `aria-labelledby`. Yet opening it delegates to OverlayRuntime with focus trapping, background inertness, scroll locking and focus restoration — behavior that is modal in practice.

Disposition: hold as `CANDIDATE / SEMANTIC CONTRACT`. A current accessibility-tree/AT witness should decide whether the panel needs truthful dialog/modal semantics or whether the intended UI contract should instead be non-modal and stop inerting the background. Do not promote from source mismatch alone.

## F. Negative controls / not findings

- Atlas node roving keyboard navigation itself worked.
- Enter from a focused graph node opens its detail.
- Escape from that focused node/detail pathway can close detail while focus remains on the node.
- Atlas search keeps focus in the search input while `aria-activedescendant` moves through options; this was not classified as a focus-loss defect.
- Shared MapEngine was not claimed broken from the stripped audit transport fallback path; current production ownership depends on `site-utils.js`/OverlayRuntime, so that stripped result is intentionally excluded.

## Disposition

Selected for verification:

- one route-level current root: **Atlas focus-state lifecycle / offscreen sequential focus**.

Held outside MASTER:

- mobile List-mode discoverability/parity;
- MapEngine modal-semantics mismatch.

Product mutation: none.
