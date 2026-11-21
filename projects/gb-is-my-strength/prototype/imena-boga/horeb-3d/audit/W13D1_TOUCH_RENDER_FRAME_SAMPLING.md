# W13D.1 — actual Chromium software-rendered touch sampling fix

W13D SHA `1b3983dbce24f6c6e2a46e74250f7b06cf69f736` source/geometry passed, but HOREB QA actual-chromium #44838662184 FAILED in Midian well touch ownership: `yawStart=0.62, yawAfterPrimary=0.62` after a fixed 100ms sleep. Real NVIDIA Chrome local run passed, as did Nile, while Actions used SwiftShader. Actual `dataset.midianYaw` and `dataset.nileLookYaw` are sampled by the render loop requestAnimationFrame, so 100ms can read stale values on throttled software rendering. This is a *timing hypothesis*, not an assertion that the first touch actually rotated.

**Test-only fix**: for each of three worlds, sample after **two browser animation frames** rather than a fixed 100ms in both the secondary-does-not-steal and primary-still-rotates checks. Keep exact yaw thresholds 0.035/0.11, true simultaneous CDP touch contacts and release in finally. Do not remove the test, weaken collision or bypass mobile. If CI still fails, capture actual pointerdown/pointermove/pointercancel trace and fix the engine. Preserve prior failure evidence.

All three code files are browser QA tests; no Product/Research, new branch, merge or deploy. Re-run exact-SHA HOREB QA 6/6 and Android/iOS physical device gate later.
