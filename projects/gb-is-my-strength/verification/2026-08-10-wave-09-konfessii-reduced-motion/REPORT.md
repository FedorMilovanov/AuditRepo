# Verification — Wave 09 `/konfessii/` automatic motion

Date: 2026-08-10
Disposition: `CONFIRMED-CURRENT / P2` route-local accessibility defect.

## Current authority

- Product: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`.
- Published candidate: deploy run `31379283849`, artifact `9059689652`.
- Raw evidence: `../../incoming/chatgpt/2026-08-10/WAVE-09-KONFESSII-AUTOMOTION-REDUCED-MOTION.md`.
- No matching open Product issue or AuditRepo `liveShimmer`/Konfessii reduced-motion root was found in deduplication.

No Product mutation was performed.

## V09-KONFESSII-AUTOMOTION — CONFIRMED-CURRENT / P2

### Current failure

The `/konfessii/` live card automatically runs decorative motion indefinitely while the rest of the page remains readable/interactable:

- `liveShimmer` every 4.2 seconds, infinite;
- live status-dot pulse every 2 seconds, infinite;
- route JS shimmer interval every 4.2 seconds.

Exact published-route Chromium execution with `prefers-reduced-motion: reduce` still computes the 4.2s animation and 0.72s transitions and still changes the live card `box-shadow` after ~4.5 seconds. The reduced-motion preference therefore does not suppress the decorative route motion.

### Current source mechanism

`KonfessiiPageHead.astro` owns the infinite CSS animations and contains no reduced-motion branch. `KonfessiiPageChrome.astro` independently starts an interval-based shimmer for `.card.live` without checking the media preference or a user pause state.

This is one route-local motion-policy root. A bounded repair should govern all current decorative motion for the Konfessii catalog rather than patching individual keyframes/timers separately.

### Accessibility basis

The current motion starts automatically, is non-essential decoration/status emphasis, continues indefinitely in parallel with the page content, and has no pause/stop/hide control. Current W3C guidance for Pause/Stop/Hide covers automatically started moving/blinking/auto-updating visual information that persists alongside other content; W3C also documents `prefers-reduced-motion` as a sufficient technique for suppressing non-essential motion when users request it.

### CI false-green boundary

The current Konfessii source-contract guard validates native composition and content markers, not runtime reduced-motion behavior. Snapshot/parity evidence at one time point does not establish whether the infinite animation/timer is suppressed under the media preference.

### Required terminal outcome

A bounded Konfessii motion repair must establish:

- non-essential automatic card/status motion is suppressed when `prefers-reduced-motion: reduce` is active, or an equivalent truthful user control satisfies the motion contract;
- the JS shimmer timer does not continue changing the visual state under the reduced-motion mode;
- normal no-preference presentation remains owner-approved;
- a permanent browser contract asserts computed animation/transition behavior and a time-delayed state check under both reduced and normal motion preferences.

## Negative control

Do not reopen the earlier Genealogy reduced-motion claim: its current effective styles already suppress motion. The Konfessii route is a separate current owner with a different result.

## Product mutation

None.
