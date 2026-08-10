# WAVE 09 — `/konfessii/` automatic motion / reduced-motion contract

Date: 2026-08-10
Agent: ChatGPT
Status: one current accessibility defect selected for verification

## Anchors

- Product current main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Exact published candidate: deploy run `31379283849`, artifact `9059689652`.
- AuditRepo immediately before write: `61bad0bea228c272f25a5968bada186c12fc67e4`.
- Product open PR: 0 at the current audit preflight.

No Product mutation was performed.

## A. Current route starts continuous decorative motion automatically

Current `KonfessiiPageHead.astro` defines multiple automatic animations on the live Russian Baptist card:

- `.card.live { animation: liveShimmer 4.2s ... infinite }`;
- `.card .live i { animation: liv 2s ease-out infinite }`.

The route-level JS also calls `startCardShimmer(card)` for the live card. That helper runs an interval every 4200 ms and temporarily changes the card's `box-shadow`, then changes it back after 420 ms.

The motion/glow is decorative status emphasis; the card content and link functionality do not depend on the animation.

## B. Exact current Chromium ignores `prefers-reduced-motion: reduce`

The exact published `/konfessii/` route was executed at 1440×1000 in Chromium twice: `no-preference` and `reduce`.

For the live card the computed result was the same in both modes:

- transition duration remained `0.72s` for the reveal/transform projection;
- animation duration remained `4.2s`;
- the infinite live-card animation remained active;
- after ~4.5 seconds the computed `box-shadow` changed in both modes, confirming the periodic shimmer still executes while the operating-system/user preference requests reduced motion.

There is no `@media (prefers-reduced-motion: reduce)` override in the route's current inline style owner.

## C. This is not the already-closed Genealogy reduced-motion false positive

The earlier Genealogy candidate was disproved because current global styling reduced effective animation/transition durations to zero under the reduced-motion media feature.

`/konfessii/` is a separate standalone visual owner. Exact-current computed styles show that the suppression does not reach this route.

Do not merge these two historical observations into one generic site-wide reduced-motion claim.

## D. Keyboard/card semantics negative control

The current live Baptist card itself is a normal labelled anchor (`aria-label="Открыть 3D-карту Русского Баптизма"`) and is reached normally in keyboard Tab order after the Back link. The disabled future cards are not exposed as actionable links.

This wave is therefore about uncontrolled automatic visual motion, not card activation semantics.

## E. Current CI false-green boundary

`konfessii-visual-parity-audit.js` verifies strict-native ownership, page/head/chrome/main composition and preserved content markers. It does not inspect reduced-motion state.

Generic visual/screenshot parity is not a sufficient witness for this class because stabilization can suppress or snapshot only one point of an ongoing animation; the necessary contract is computed/runtime behavior under `prefers-reduced-motion: reduce` or an explicit pause/stop control.

## F. Accessibility disposition

W3C guidance for continuously moving/blinking/auto-updating visual content requires user control when automatic non-essential motion persists alongside other content, and W3C documents `prefers-reduced-motion` as the standard CSS mechanism for suppressing motion for users who request it.

The current route provides neither a route-local reduced-motion suppression nor a pause/stop/hide mechanism for the decorative live shimmer/pulse.

## Required root if verified

One route-local `/konfessii/` motion contract should own all three manifestations:

1. 4.2s infinite live-card shimmer;
2. 2s infinite status-dot pulse;
3. JS interval shimmer every 4.2s.

Do not patch each animation separately without one reduced-motion/animation policy for this page owner.

## Product mutation

None.
