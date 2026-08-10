# Verification — Wave 08 shared MapEngine Intro focus exposure

Date: 2026-08-10
Disposition: one `CONFIRMED-CURRENT / P2` direct defect; three adjacent semantics candidates remain outside MASTER.

## Current authority

- Product: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Published candidate: deploy run `31379283849`, artifact `9059689652`.
- Current manifestation: `/karty/ishod/` shared MapEngine Intro.
- Raw evidence:
  - `../../incoming/chatgpt/2026-08-10/WAVE-08-MAPENGINE-INTRO-OVERLAY-SEMANTICS.md`
  - `../../incoming/chatgpt/2026-08-10/WAVE-08-MAPENGINE-INTRO-EVIDENCE.json`

No Product mutation was performed.

## V08-MAPENGINE-INTRO-FOCUS — CONFIRMED-CURRENT / P2

### User-visible failure

The current MapEngine Intro visually covers the interactive map and presents one visible CTA, `Начать изучение`, but the sequential keyboard order enters the controls underneath the cover first.

Exact-current Chromium execution reproduces the same order at 390×844 and 1440×1000:

1. story `Выход из Египта`;
2. story `Синайский период`;
3. story `40 лет странствий`;
4. map search;
5. theme;
6. share;
7. zoom in;
8. zoom out;
9. center;
10. measure;
11. layers;
12. only then `Начать изучение`.

The first eleven focus targets are geometrically behind the visible Intro. A keyboard user therefore traverses hidden-under-cover controls before reaching the only visible Intro action.

When the Intro CTA is explicitly focused and activated, Intro removal leaves `document.activeElement === BODY` rather than transferring focus to a stable map control.

### Current source mechanism

The shared engine builds Intro as `div.me-intro`, appends it after the underlying controls already exist, and handles only pointer dismissal on the CTA/background. It does not register Intro with the engine's existing `openSpecialOverlay()` / `closeSpecialOverlay()` mechanism, does not inert or otherwise semantically hide the underlay, and does not establish focus entry or post-dismissal focus ownership.

This is a bounded shared-engine root. A repair should establish one Intro overlay/focus lifecycle rather than patching the eleven underlying controls individually.

### Existing CI false-green boundary

Current MapEngine browser coverage can remain green because:

- `map-browser-smoke.js` drives story changes with direct clicks and validates fly-to, layers/signatures, scientific content, numeric shortcuts and Hebrew semantics;
- `map-mobile-smoke.js` validates map width/viewBox/touch-action/overflow and visible 44 px controls.

Neither test traverses the initial Tab order while Intro covers the map or asserts focus after Intro dismissal.

### Required terminal outcome

A bounded shared MapEngine Intro repair must establish:

- when Intro is visible, controls behind it are not reachable in sequential focus navigation;
- focus enters the visible Intro surface or its primary action deterministically;
- keyboard dismissal is available with an explicit lifecycle appropriate to the Intro contract;
- after dismissal, focus lands on a meaningful surviving map owner instead of `BODY`;
- pointer dismissal preserves the same focus/state invariants;
- permanent browser regression coverage asserts initial Tab order and dismissal focus at narrow mobile and desktop; include WebKit in normal CI.

## Held outside MASTER

### Place-panel / photo-modal semantics

Current shared engine behavior makes these surfaces modal-like through `openSpecialOverlay()` / OverlayRuntime ownership (focus entry/restore, inert underlay, close request, default scroll lock), while the containers themselves do not declare dialog/modal/name semantics.

This is current source evidence but remains a semantic candidate pending a production accessibility-tree/AT witness and a decision on the intended modal-vs-nonmodal contract.

### Story tabs pattern

The engine declares a `tablist` and story `tab` elements, but exact current Chromium shows no ArrowRight focus movement and normal Tab proceeds through unselected story tabs. Keep as a lower-severity ARIA-pattern candidate pending a targeted accessibility decision.

### Stage dots

The six I–VI stage controls are clickable `div` elements without role/tabindex/key handling. Keep as a keyboard-equivalence candidate until the necessity of that shortcut, versus redundant map navigation, is explicitly verified.

## Product mutation

None. This report changes AuditRepo classification only.
