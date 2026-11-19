# V5.16 — complete-event quality transition acceptance (CI Linux + Windows)

**Date:** 2026-11-10. **Existing Draft PR:** [AuditRepo #545](https://github.com/FedorMilovanov/AuditRepo/pull/545). **Starting HEAD:** `e9f96ee1b07033dbf84714a5f1b6edfffdb5f86e`. **LAB/ART HOLD**, no Product/main merge.

## Root cause, without hiding a regression

On exact commit `e9f96ee`, [required AuditRepo Validate run 42699230183](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42699230183) completed with **FAILURE**. The first six public browser suites completed fully and emitted **35/35 PASS**. The next suite, `tests/quality-transition-browser.py`, failed at Chromium 1440×900 on the first **low → high** toggle while running on software WebGL (GitHub-hosted Ubuntu runner).

The trace recorded `first=Лёгкая, last=Лёгкая`, the quality overlay still visible, and a maximum rAF gap around **1,050 ms**. The old test forcibly returned after **3,400 ms** of elapsed wall time whether or not React/Three.js had finished recompiling the high graphics preset. It therefore conflated an incomplete *sampling interval* with a stuck transition.

This is a **confirmed CI-test timing defect**, not proof that the graphics renderer freezes permanently. The actual first-frame latency remains a **real, separate OPEN performance issue**, and this test does not claim to solve or measure real-device FPS.

## Source-owned fix

Edit only the existing real-browser regression `tests/quality-transition-browser.py` to record the **full state machine** rather than take an arbitrary 3.4-second snapshot:

1. Launch with the actual application/UI. Record the initial user-facing quality label.
2. Click the *real* graphics button and challenge a rapid duplicate click (must not queue a second mutation).
3. Witness the actual rendered transition cover while the *old* label still appears.
4. Witness the *opposite* quality label while the cover is active; then witness the cover removed.
5. Require **two consecutive rendered frames** after the new label is visible and the cover has disappeared. Require the original WebGL canvas identity to be preserved, beige fade opacity zero, and no JS/HTTP errors.
6. Fail strictly on a **20-second bounded deadline** on deliberately software-rendered GitHub CI; **5.5-second deadline** on ordinary locally accelerated browser runs. Each case still tests **both switching directions**. If transition fails to settle before the deadline, the test fails with the full recorded timeline, never SKIP or PASS.

Unlike a fixed delay or unconditional `wait_for_timeout()`, the test now returns as soon as the real transition is complete. The deadline is only a failure cap, not a fabricated success condition. An 800–3,000ms graphical stall can still occur and must be separately fixed as performance work. This change does not touch application graphics settings, React state, WebGL shader code, GPU resources, site paths, or any reader/cabinet data.

## Evidence on the authorized Windows machine

- Existing Playwright **software SwiftShader/low-preference mode**: the new test completed **4/4 engine×viewport scenarios**, checking **8/8 actual low↔high changes**, each with a confirmed painted cover and two settled visible frames; max sampled initial toggle approximately **4,051 ms**, including one observed max rAF gap **2,717 ms**.
- Native Windows GPU Chrome / Playwright WebKit: **4/4 scenarios PASS**, no exception.
- Python compile check: **PASS**. Exact-head required GitHub Validate and Preflight: **PENDING new commit** (older failed jobs are not retroactively accepted).
- Browser timing and draw calls here are not GPU clock timings, and GitHub SwiftShader tests cannot certify real Safari/iPhone/Android/XR frame pacing.

**Release gate unchanged:** required exact-head GitHub `validate` and `preflight` SUCCESS, complete 47/47 browser suite, full art approval, physical-device tests, Product/rights and rollout gates. Do not merge or deploy.
