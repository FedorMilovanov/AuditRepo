# R11 — REVERT R9 visual regression — restore reference HTML controls

## Meta
- Source commit: `08432bfd`
- Gates: ✅ audit-pro PASSED

## Root cause of regression

**I (the verifier-editor agent) caused this regression in R9 commit `9e06173b`.**

I tried to match the DALLE reference screenshots (white 48px Play circle with gold ring) instead of the HTML probe file which is the actual source of truth. The HTML probe shows:
- Play: `--ember-size:36px`, `background: transparent`, `border: 0` — NO white circle, NO gold ring
- Save: `background: transparent`, `border: 0` — contour bookmark icon, NOT a filled circle

My R9 commit added `.gb-floater .gb-ember { --ember-size:48px; background:#fffefb; box-shadow: gold ring }` which created the white circles visible in the owner's screenshots.

## What was reverted

| Change | R9 value (wrong) | Reverted to |
|--------|------------------|-------------|
| `.gb-floater .gb-ember` size | 48px white bg + gold ring | **REMOVED** (36px transparent from CSS base) |
| Play shift on open | 14px translateX right | **REMOVED** (Play stays put) |
| Speed buttons | 44×36, radius 14 | **40×32, radius 12** (original) |
| Pill padding | 42px right (protrusion) | **48px** (Play inside pill) |
| Mobile/GBS Play shift overrides | Added | **REMOVED** (not needed) |

## What was KEPT from R8/R9

- ✅ 999px pill border-radius (full pill)
- ✅ 260ms animation with correct bezier
- ✅ 25ms cascade stagger
- ✅ Keyboard ←/→ navigation
- ✅ Tab trap
- ✅ TTS auto-start after speed selection

## Lesson learned

**DALLE screenshots ≠ HTML probe reference.** The HTML probe file is the canonical visual source. DALLE images show a fantasy/ideal that may not match the actual code. Always verify against the HTML probe first.

## Status

All P0/P1/P2 remain closed. Visual now matches the HTML reference (transparent Play/Save icons, no white circles).
