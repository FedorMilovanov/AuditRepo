# Verification — Wave 10 shared ReaderChrome SSR speed-rail focus

Date: 2026-08-10
Disposition: `CONFIRMED-CURRENT / P2` shared SSR/pre-hydration accessibility defect.

## Current authority

- Product: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Published candidate: deploy run `31379283849`, artifact `9059689652`.
- Raw evidence:
  - `../../incoming/chatgpt/2026-08-10/WAVE-10-READER-SPEEDRAIL-SSR-HIDDEN-FOCUS.md`
  - `../../incoming/chatgpt/2026-08-10/WAVE-10-READER-SPEEDRAIL-SSR-EVIDENCE.json`
- No matching open Product issue or AuditRepo speed-rail SSR focus root was found in deduplication.

No Product mutation was performed.

## V10-READER-SPEEDRAIL-SSR-FOCUS — CONFIRMED-CURRENT / P2

### Current failure

The shared mobile reader speed rail is server-rendered as `aria-hidden="true"` while all six native button descendants retain their default sequential tabindex.

Exact-current no-JS Chromium at 390×844 proves this is not only a source-level inconsistency. Starting from the visible `Справка` control, the next six Tab presses enter the visually hidden speed rail:

1. `0.8×`;
2. `1×`;
3. `1.25×`;
4. `1.5×`;
5. `1.75×`;
6. `2×`;
7. only then the visible Play control.

The rail is `aria-hidden=true`, `display:flex`, `visibility:visible`, `opacity:0`; its child buttons have non-zero geometry and `tabIndex=0` before hydration.

Independent no-JS witnesses reproduce the identical six-hidden-control sequence on three different reader families:

- `/articles/krajne-li-isporcheno-serdce/`;
- `/baptisty-rossii/noch-na-kure/`;
- `/hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/`.

### Shared scope

Exact published-output census finds 48 routes with the same `.mobile-speedrail[aria-hidden="true"]` projection and six speed buttons lacking server-side tabindex on every route.

The canonical shared source owner is `GillSeriesMobileBar.astro`, reached through `SeriesReaderChrome` / `GillSeriesChrome` across these reader families. This must not become 48 route-specific fixes.

### Why the root stays narrow

A whole-release static census also found other `aria-hidden=true` containers with focusable markup. Browser no-JS verification separated them:

- TOC/Learning/Settings overlays are `display:none` while closed and therefore do not participate in sequential focus;
- shared `h-mobile-nav` is `visibility:hidden` while closed and therefore does not participate in sequential focus;
- the speed rail is the current exception because it remains laid out/visible to focus mechanics while only opacity hides it.

Therefore the repair-ready root is the speed-rail SSR state, not a generic claim that all hidden overlays are broken.

### Standards mapping

The current server projection directly matches the W3C ACT rule for an `aria-hidden="true"` element containing descendants that participate in sequential focus navigation. The rule is mapped to WCAG 4.1.2 Name, Role, Value.

### Hydrated negative control

Do not open a hydrated speed-radio navigation bug. Current `ReaderActionsRuntime` already supplies:

- roving tabindex;
- `aria-checked` synchronization;
- ArrowLeft/Right/Up/Down;
- Home/End;
- Enter/Space;
- focus management when the rail is active.

The defect is specifically the server / pre-hydration / no-JS boundary.

### Existing CI false-green boundary

`gill-v16-mobile-play-smoke.js` deeply exercises TTS and rate changes after runtime load. In inline speed mode it locates the target speed button and invokes `.click()` directly.

It therefore does not assert:

- server-side initial tabindex;
- no-JS sequential focus;
- pre-hydration hidden focus descendants;
- validity of the initial `aria-hidden` state.

A green current TTS smoke is compatible with this defect.

### Required terminal outcome

A bounded shared ReaderChrome repair must establish:

- when the server-rendered speed rail is hidden, none of its radio buttons participate in sequential focus;
- the initial server accessibility state is valid without waiting for JavaScript to repair it;
- the hydrated open state preserves the existing roving-radio keyboard model;
- closing the rail returns to a valid hidden state without invisible Tab stops;
- no-JS readers remain readable and free of hidden speed-control focus traps;
- permanent browser coverage includes no-JS/pre-hydration 390px witnesses from representative Articles, Hard Texts and Baptists routes, plus a built-output census/contract preventing hidden speed controls from regressing across the full shared family.

## Product mutation

None. This report changes AuditRepo classification only.
