# W12D.0.1 — Chromium portrait-state readiness (QA regression fix)

## Exact observed failure, do not hide
W12D.0 `2a30240a8f689ccaf71a4f077a20f6b73cea4e0d`, [HOREB QA #44295360767](https://github.com/FedorMilovanov/AuditRepo/actions/runs/44295360767), `actual-chromium` failed **after** 108/108 baseline Chrome smoke and after the previous three Midian walking tests. At `tests/browser-homestead-walk.mjs:114` it asserted phone starting z=14.5 but read **z=1.837** (old interior location), with `homesteadCameraVerticalFov=72`. The app changes `midianMode` immediately on entry; the displayed `midianX/Z` values update from `requestAnimationFrame`, so the former 180 ms fixed sleep is not a reliable synchronization with software WebGL. This is a test-readiness race; we do **not** waive the real position requirement.

## Exact corrective scope
- Wait for actual rendered DOM dataset to report `mode=walk`, `x≈0`, `z≈14.5` and 72° portrait FOV, timeout 20 s. No silent recovery by teleport or position override.
- Replace fragile keyboard `820ms` and touch `1150ms` waiting with wait-for-real-z-displacement bounded at 12/15 s. Continue asserting >0.12 m of actual movement. Always release W and touch even if a wait fails.
- Preserve all actual Chromium input injection through `Input.dispatchTouchEvent`; preserve touch-release no-stuck-motion check, reader 42, entry/focus/remount, and all PNGs.
- No Three.js scene or frontend changes, only `tests/browser-homestead-walk.mjs` + this audit note. Do not classify a test failure as an art failure; conversely, red exact SHA is **not** GREEN.

## Required gate
Push only after initial W12D.0 run reaches a terminal state, with the original failure retained. New exact-SHA 6/6 HOREB QA, Validate and Preflight required. Only then inspect four new real screenshot PNGs to judge rear roof seams.
