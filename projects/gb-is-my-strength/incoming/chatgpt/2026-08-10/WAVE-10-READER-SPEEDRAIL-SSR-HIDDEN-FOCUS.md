# WAVE 10 — shared ReaderChrome SSR hidden speed-rail focus

Date: 2026-08-10
Agent: ChatGPT
Status: shared current accessibility defect selected for verification

## Anchors

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652`.
- AuditRepo fresh pre-write head: `d91ccf58cf9277f6f870fe9103211ce24d3384fe` (parallel TLP-only work had advanced main after the prior gb wave).

No Product mutation was performed.

## A. Canonical shared SSR owner

`GillSeriesMobileBar.astro` renders an inline TTS speed rail:

```html
<div class="mobile-speedrail" id="mobileSpeedrail"
     role="radiogroup" aria-label="Скорость озвучки" aria-hidden="true">
  <button class="mobile-speed" role="radio" ...>0.8×</button>
  ...
  <button class="mobile-speed" role="radio" ...>2×</button>
</div>
```

All six server-rendered radio buttons omit `tabindex`. As native buttons their initial sequential-navigation tabindex is therefore 0 even while the parent rail declares `aria-hidden="true"`.

The hydrated `ReaderActionsRuntime` is substantially better: it synchronizes `aria-checked`, implements roving tabindex, ArrowLeft/Right/Up/Down, Home/End, Enter/Space and closes/restores the inline rail state. The defect is specifically the SSR / pre-hydration / no-JS boundary, not the hydrated speed-control keyboard model.

## B. Exact-release scope census

The exact current release contains **48 routes** with `.mobile-speedrail[aria-hidden="true"]` and six speed buttons lacking server-side tabindex on every route.

The affected family spans at least:

- ordinary `/articles/` reader routes including Heart and Gill;
- `/hard-texts/` reader routes;
- `/baptisty-rossii/` reader routes.

This is therefore one shared ReaderChrome projection root, not a local article bug.

## C. Exact no-JS sequential-focus witness

At 390×844, using exact current `/articles/krajne-li-isporcheno-serdce/` HTML/CSS with JavaScript disabled:

1. focus visible `#mobLearningBtn` (`Справка`);
2. press Tab.

The next six sequential targets are:

1. `0.8×` — `.mobile-speed`, inside `aria-hidden=true`;
2. `1×` — same;
3. `1.25×` — same;
4. `1.5×` — same;
5. `1.75×` — same;
6. `2×` — same;
7. only then the visible Play ember.

The hidden rail is styled with opacity 0 in this state, but its child buttons remain visible/focusable at the DOM/CSS level and are directly reached by Tab.

Independent current no-JS witnesses reproduced the identical six-hidden-control sequence on:

- `/baptisty-rossii/noch-na-kure/`;
- `/hard-texts/duhi-v-temnice-noi-kreshchenie-pobeda/`.

This proves the shared-family scope across three independent content families.

## D. Standards mapping

W3C ACT rule `Element with aria-hidden has no content in sequential focus navigation` applies to any `aria-hidden="true"` element and expects that none of its descendants are both focusable and part of sequential focus navigation. The rule maps to WCAG 4.1.2 Name, Role, Value.

The current server projection fails this condition directly.

## E. Existing TTS/mobile smoke false-green boundary

`gill-v16-mobile-play-smoke.js` performs extensive current TTS/play/rate testing. For the inline Gill speed mode it finds the desired `.mobile-speedrail [data-speed]` button and calls `.click()` directly.

That is valid for hydrated TTS behavior but does not test:

- SSR initial tabindex;
- JavaScript-disabled rendering;
- pre-hydration sequential focus order;
- focusable descendants under `aria-hidden=true`.

Thus a green current TTS smoke is compatible with this SSR accessibility defect.

## F. Required root

One shared ReaderChrome SSR/hydration contract should own:

- hidden speed rail must not contain sequentially focusable controls before hydration;
- hydrated open state should preserve the existing roving-radio behavior;
- no-JS reader remains readable without invisible Tab traps;
- runtime opening/closing should not rely on repairing an invalid initial accessibility state.

A likely bounded source owner is `GillSeriesMobileBar.astro` plus the permanent server/runtime contract, not 48 route-specific patches.

## Negative controls

- Do not open a hydrated speed-radio keyboard bug: current ReaderActionsRuntime already implements the expected directional/roving model.
- Do not classify the mobile Play button itself as hidden; after the six invisible speed controls the Play control is visible and normally focusable.

## Product mutation

None.
