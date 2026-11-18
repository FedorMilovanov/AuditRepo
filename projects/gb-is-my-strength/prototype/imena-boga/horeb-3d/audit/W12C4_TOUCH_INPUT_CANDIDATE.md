# W12C.4 — true touchscreen forward and release QA (detached)

## Coverage gap
As of W12C.3, the 390×844 browser smoke confirms touch controls exist but the action that advances the mobile player is still `page.keyboard.down('w')`. A visible arrow can be broken while this falsely passes. In particular, `onPointerDown`, capture, `onPointerUp` and cancellation on `MidianCanvas.tsx` need real browser input, not a DOM-only check.

## Minimal independent QA-only improvement
- In the already real 390px WebGL mobile stage, use Chrome's `Input.dispatchTouchEvent` with actual screen coordinates of the visible forward control.
- Hold ~1150 ms, verify player z decreases over collision-checked camera ground.
- Release the touch with `touchEnd`, wait for settlement, then assert no persistent movement over a further ~470 ms.
- Use try/finally to release an active touch even when the scene fails during hold.
- Preserve existing mobile keyboard, portrait start, focus and WebGL remount checks; all four required PNGs continue as before.
- No component or 3D rendering changes. No artificial teleport, no injected DOM events, no external test fixture.

## Gates
This commit is **DETACHED**, parent `beef162` (W12C.3 fix). Do NOT push until W12C.3 exact-SHA HOREB QA is terminal green and visual witnesses have been inspected. Then run independent exact-SHA HOREB QA 6/6 + Validate + Preflight; a failing actual touch test is actionable and must not be suppressed. Physical Android/iOS hardware remains a separate HOLD.
