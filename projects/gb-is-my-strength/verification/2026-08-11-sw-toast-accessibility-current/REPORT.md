# Current verification — Service Worker toast accessibility

Date: 2026-08-11
Disposition: `CONFIRMED-CURRENT-A11Y / P3`
Product authority: `main@be8d439aec1e18f268d247967c70a0c318b1dabd`

## Current behavior

`js/sw-register.js` creates `#gb-sw-toast` as a plain `div` and uses it for:

- offline-state messages;
- connection-restored messages;
- cached-page hints;
- update-available / site-updated messages.

When an update requires reload, the code adds `.toast-reload` and a `click` listener that reloads the page. It does not make the element a native button or add button role, sequential focus, Enter/Space handling, or a dedicated child button.

The same toast also has no `role="status"`, `aria-live`, or equivalent live-region semantics for advisory messages.

`css/sw-toast.css` adds pointer cursor for `.toast-reload`, but CSS does not supply keyboard or accessibility-tree semantics.

## Accessibility impact

Two related failures exist in the same owner:

1. **Status announcement gap** — offline/update/advisory text is inserted visually into a generic div, so assistive technology has no explicit live-region contract for a status change.
2. **Reload action gap** — the visually clickable update toast is not a keyboard-focusable command and has no Enter/Space activation contract.

This does not mean Service Worker caching itself is broken. Current `sw.js` still uses network-first HTML/data behavior where intended and bypasses cache for Range/audio/video/TTS/model paths. The defect is the update/offline notification interaction layer.

## Standards contract

WAI-ARIA defines `role="status"` as an advisory live region with implicit polite/atomic announcement semantics. WAI-ARIA APG Button Pattern requires an action button to be focusable and activatable with Enter and Space; a plain clickable div does not receive those semantics automatically.

## Required terminal outcome

- expose passive offline/online/cache/update notices through a real status/live-region owner;
- when user action is offered, render a real `<button type="button">` inside the notice or implement the complete button widget contract;
- ensure Enter and Space activate reload and the control appears in a logical Tab sequence while actionable;
- remove/disable the action cleanly when the toast expires;
- preserve visual styling and existing update/offline behavior;
- permanent Chromium + WebKit proof should assert live-region semantics, keyboard focus/activation and cleanup without requiring a real production SW release race.

Residual: **CURRENT / OPEN**.
