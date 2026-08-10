# WAVE 08 — shared MapEngine intro focus exposure + overlay semantics

Date: 2026-08-10
Agent: ChatGPT
Status: one direct current defect selected for verification; overlay/tab/stage semantic candidates held

## Anchors

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652` (`pages-release-candidate-31379283849-1`).
- AuditRepo immediately before write: `4d9500d2c8cb4ebd62788280c51b2224c3fce1c3`.
- Product open PR: 0 at fresh pre-write check.

No Product mutation was performed.

## Browser evidence boundary

The exact-current `/karty/ishod/` MapEngine was executed in Chromium from the published release artifact using an audit transport composed from the exact route HTML, exact shared `map-engine.js`, exact route JSON / authority JSON / base SVG, and current map CSS required for geometry. Direct localhost navigation is blocked by the current environment; no direct production-origin browser claim is made.

The Intro finding below is transport-stable because its defect mechanism is entirely inside the MapEngine Intro code path: Intro creation/dismissal does not delegate to `SiteUtils`/`OverlayRuntime`.

WebKit was not installed in the current container and was not claimed.

## A. MapEngine Intro exposes covered controls to sequential keyboard focus

Current source creates `.me-intro` after the map controls already exist. The Intro is a full-cover visual layer with one visible action, `Начать изучение`, but it does not:

- register as an overlay owner;
- inert or `aria-hidden` the underlying map controls;
- move focus into Intro when shown;
- expose dialog/region semantics;
- handle Escape;
- restore/move focus when dismissed.

Dismissal only animates opacity/scale, sets `pointerEvents='none'`, then removes the Intro after 450 ms.

### Exact current keyboard witness

At both 390×844 and 1440×1000, with the Intro visibly covering the route, fresh Tab traversal produces the same order:

1. underlying story tab `Выход из Египта`;
2. underlying story tab `Синайский период`;
3. underlying story tab `40 лет странствий`;
4. underlying map search input;
5. underlying theme button `🌙`;
6. underlying share button `↗`;
7. underlying zoom `+`;
8. underlying zoom `−`;
9. underlying center `⌂`;
10. underlying measure `↔`;
11. underlying layers control `Слои`;
12. only then the visible Intro action `Начать изучение`.

All first eleven controls are geometrically covered by the Intro. The first keyboard target presented to the user is therefore not the visible Intro CTA but an invisible-behind-overlay story control.

When the Intro CTA itself is explicitly focused and activated, the Intro is removed and `document.activeElement` falls to `BODY` rather than to a meaningful map control.

This is a direct keyboard-accessibility defect, not merely missing ARIA decoration.

## B. Source mechanism is bounded

Current `karty/_engine/map-engine.js` Intro path creates a plain `div.me-intro`, appends it to the map container, and only binds pointer click dismissal to the visible button/background. It does not use the engine's existing `openSpecialOverlay()` / `closeSpecialOverlay()` ownership mechanism used elsewhere for the place panel and nested photo modal.

A bounded repair should give Intro one explicit keyboard/overlay lifecycle rather than adding tabindex hacks to the underlying controls.

## C. Existing MapEngine browser coverage does not catch Intro focus exposure

Current `map-browser-smoke.js` covers rich MapEngine behavior including:

- route rendering;
- signatures/layers;
- story fly-to behavior;
- archaeology/scientific tabs;
- keyboard numeric shortcuts inside/outside inputs;
- Hebrew direction/font semantics.

Its story-flow setup uses direct `.click()` on story chips and does not walk the initial sequential Tab order while Intro is covering the route.

Current `map-mobile-smoke.js` checks map geometry, viewBox, touch-action, overflow and visible controls below 44 px. It also does not inspect Intro focus entry/order/dismissal.

Therefore these tests can remain green while the first eleven Tab stops are hidden behind the Intro.

## D. Shared MapEngine modal-surface semantics — current candidate

The same engine has two explicit overlay-owned surfaces:

1. `.me-panel` place/details panel;
2. `.me-photo-modal` nested photo viewer.

Current source clearly treats them as modal-like owners:

- captures an opener;
- uses canonical `OverlayRuntime` when available (fallback otherwise);
- makes underlay targets inert/`aria-hidden`;
- moves focus to the active surface;
- uses Escape/onRequestClose;
- restores the opener on close;
- locks scrolling by default through overlay ownership.

But current container semantics do not declare that behavior:

- `.me-panel`: no `role`, no `aria-modal`, no `aria-label`/`aria-labelledby`;
- `.me-photo-modal`: no `role`, no `aria-modal`, no accessible container name.

The photo close button itself is labelled `Закрыть`; the place-panel close is only the visible symbol `×`.

This is a real current semantic mismatch. Hold as `CANDIDATE / SHARED OVERLAY SEMANTICS` pending one production accessibility-tree/AT witness. Do not use the stripped audit transport's fallback focus behavior as production truth.

## E. Story selector claims tabs but does not implement the tabs keyboard model — candidate

Current source declares:

- stories container `role="tablist"`, label `Сюжеты карты`;
- every story chip `role="tab"` with `aria-selected`.

But `renderStories()` gives every story chip normal button tab behavior and only binds click; it does not implement roving `tabindex` or Left/Right Arrow handling.

Exact-current Chromium probe with four story tabs:

- first selected tab had no explicit tabindex;
- `ArrowRight` left focus and selection unchanged;
- `Tab` moved to the second, unselected story tab.

Disposition: `CANDIDATE / ARIA-PATTERN`. Keyboard users can still reach story buttons with Tab, so this is not promoted to a direct defect in this wave.

## F. Stage dots are pointer-only controls — candidate

Current `renderStages()` creates six interactive `div.me-stage-dot` elements for I–VI with `cursor:pointer` and click handlers that open the first visible place of that stage.

Exact current state:

- tag: `DIV`;
- role: none;
- tabindex: none;
- no key handler.

Disposition: `CANDIDATE / KEYBOARD SEMANTICS`. The map exposes other navigation routes, so mandatory-work status needs a feature-equivalence/accessibility check before promotion.

## G. Negative controls / exclusions

- Do not generalize the Intro defect to the place panel's focus lifecycle: the latter is explicitly wired to `openSpecialOverlay()` and canonical OverlayRuntime when available.
- Do not treat the stripped audit transport's missing OverlayRuntime behavior as a Product regression.
- `flyTo()` has its own reduced-motion handling; no general MapEngine reduced-motion defect is opened from this wave.

## Disposition

Selected for verification:

- one direct current root: **MapEngine Intro focus exposure / covered Tab sequence**.

Held outside MASTER:

- place-panel/photo modal semantics mismatch;
- story tabs ARIA keyboard model;
- stage-dot pointer-only semantics.

Product mutation: none.
