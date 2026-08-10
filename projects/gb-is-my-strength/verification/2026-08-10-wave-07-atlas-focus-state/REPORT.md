# Verification — Wave 07 Atlas focus-state lifecycle

Date: 2026-08-10
Disposition: one `CONFIRMED-CURRENT / P2` Atlas focus-state root; mobile List parity and MapEngine panel semantics remain unpromoted candidates.

## Current authority

- Product: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Published candidate: deploy run `31379283849`, artifact `9059689652`.
- Raw evidence:
  - `../../incoming/chatgpt/2026-08-10/WAVE-07-ATLAS-FOCUS-STATE-KARTY-SEMANTICS.md`
  - `../../incoming/chatgpt/2026-08-10/WAVE-07-ATLAS-FOCUS-EVIDENCE.json`
- No open Product issue/PR or AuditRepo evidence matching this Atlas focus root was found in the pre-promotion deduplication pass.

No Product mutation was performed.

## V07-ATLAS-FOCUS-STATE — CONFIRMED-CURRENT / P2

### Current user-visible defect class

The Atlas visual/data state machine does not consistently own keyboard focus when it hides, moves or replaces an active control.

Current exact-release Chromium evidence establishes all of the following manifestations:

1. **Closed mobile controls remain in the Tab sequence from the initial state.** At 390×844 normal Tab navigation enters `#atlasFilterClose`, all theme controls, relation checkboxes and `#atlasDetailClose` while their drawer/sheet are visually offscreen and still have no hidden/inert semantic ancestor.
2. **Detail close strands focus.** Activating `#atlasDetailClose` closes the detail state, but focus remains on that control; on narrow mobile it is then below the viewport/offscreen.
3. **Related-node navigation destroys focus.** Activating a related-node control causes detail `replaceChildren()` projection and focus falls to `BODY`.
4. **Desktop List → Graph loses focus.** Activating `На карте` hides the list containing the active button, opens the graph/detail state and leaves focus on `BODY`.
5. **Mobile theme selection closes the drawer but strands focus inside it.** After group selection the focused theme control remains active while the sidebar has moved hundreds of pixels offscreen.
6. **Mobile drawer close strands focus on the close control.** The close button remains active after its drawer moves offscreen.

These reproduce across both sides of the Atlas layout boundary (680 compact / 681 desktop-world) and at 390 + 1440 representative mobile/desktop widths. Node-level Arrow navigation and the node Enter→Escape path were retained as negative controls and worked.

### Common source mechanism

This is one state-ownership root, not six button bugs:

- closed mobile drawer/detail visibility is primarily transform/pointer-state based, leaving controls sequentially focusable;
- `closeFilters()` changes visual/open state but does not move focus or set closed-region inertness;
- `setGroup()` invokes that close path without focus ownership;
- `clearFocus()` owns data/detail state but not DOM focus restoration;
- related-node detail rendering replaces the subtree containing the active element;
- `setView()` hides one representation and exposes the other without transferring focus when the old representation owned it.

A repair should centralize focus semantics around Atlas state transitions instead of adding unrelated `focus()` calls to each symptom.

### CI false-green boundary

Current Atlas browser coverage is strong for compiled data, graph/list state, desktop/mobile geometry, 44 px targets, detail sheet dimensions, no-JS fallback, URL focus state and relation filtering.

But the relevant tests use click/tap transitions and do not assert:

- `document.activeElement` after state transitions;
- sequential Tab traversal through a closed off-canvas region;
- inert/semantic hiding of closed mobile drawer/detail;
- focus transfer when a view/subtree containing the active element is hidden or replaced.

Therefore green existing Atlas tests do not disprove this current defect.

### Required terminal outcome

A bounded Atlas focus-state repair must establish these invariants:

- closed mobile drawer/detail controls are not sequentially focusable;
- opening/closing drawer has explicit focus entry/restore behavior appropriate to its non-modal drawer contract;
- detail close restores focus to a meaningful surviving graph/search/list origin;
- related-node replacement gives focus to a stable meaningful owner instead of `BODY`;
- List→Graph and Graph/List transitions never hide the active element without deterministic focus transfer;
- Escape/close/group/history/resize transitions preserve a logical focus destination;
- permanent route-specific browser guard covers 390/680/681/1440 and asserts `activeElement` plus offscreen/hidden-region focusability; add WebKit when the project CI environment runs it.

## Held outside MASTER

### Atlas mobile List-mode discoverability

The List representation is explicitly described in source as an accessible representation, but `.atlas-view-switch` is hidden at `<=980px`; exact browser checks show no switch at 390/680/681 and a working switch at 1440. The runtime and no-JS fallback still support List mode.

This is current evidence, but the graph itself has keyboard semantics. Keep as a candidate until an AT/owner-intent check establishes that exposing the alternate representation on mobile is mandatory rather than optional responsive simplification.

### MapEngine panel semantics

Shared `karty/_engine/map-engine.js` creates `.me-panel` with no `role`, `aria-modal`, `aria-label` or `aria-labelledby`, while its open path delegates to OverlayRuntime/fallback behavior that traps focus, inerts the background, locks scrolling and restores focus.

This is a real semantic mismatch candidate, but whether the intended contract should be modal-dialog semantics or a non-modal panel is an accessibility/owner-intent question. Do not promote until an accessibility-tree/AT witness resolves the intended semantics.

## Negative controls

- Do not generalize the Atlas root to all map engines. Shared MapEngine already has explicit overlay/focus ownership machinery that the Atlas lacks.
- Do not use the stripped MapEngine audit transport as evidence of current production focus behavior because that transport can alter canonical SiteUtils/OverlayRuntime availability.
- Atlas search `aria-activedescendant` behavior and graph node Arrow navigation were not classified as defects in this wave.

## Product mutation

None. This verification changes AuditRepo classification only.
