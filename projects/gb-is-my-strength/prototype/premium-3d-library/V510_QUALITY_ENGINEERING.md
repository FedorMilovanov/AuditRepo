# Premium 3D Library - V5.10 graphics-quality transition lifecycle

**Date:** 2026-11-09. **Scope:** Existing AuditRepo [PR #545](https://github.com/FedorMilovanov/AuditRepo/pull/545), branch `lane/gb-premium-3d-library-lab-20261108` only.

**Base HEAD:** `620b1e316b11c9641a0eb551fcd7b61dd65ac317`.

**Release status:** LAB / DRAFT / ART HOLD. This candidate is **not** a Product change, production release, photographic-art acceptance, physical-device test, or performance certification.

## 1. Observed and reproduced fault

V5.9 had separated photo mode from the beige screen-wide fade, but the original `FadeVeil` still subscribed to graphic quality changes. It relied on a `setTimeout(520 ms)` to remove a CSS opacity transition.

On the baseline build, first quality changes (high to low, or low to high) frequently had an expensive rAF pause. An observed Chrome desktop 1440x900 first switch had a **817.3 ms** gap; WebKit desktop also exhibited an approximately **818 ms** gap. The CSS opacity change to opaque could happen while the page could not paint; the removal timer could expire before a visible protective frame. A follow-up run showed that quality switches in WebKit mobile emulation can be substantially slower and variable.

**Conclusion:** Wall-clock timeout is not a reliable completion condition for this visual transition. This is an observed presentation-lifecycle problem, not proof that shader compilation is the sole cause of the underlying GPU/renderer delay.

## 2. Source change - narrow and explicit

Only the existing `src/store.ts` and `src/App.tsx` change application behavior:

- A new `qualityTransitioning` state represents the pending graphics-quality switch and prevents repeated requests while the prior switch is active.
- `toggleQuality()` shows a subdued, labeled overlay first, waits for two animation callbacks (giving the previous quality a presentation opportunity), **then** changes the quality setting and persists it. The change is not initiated before the overlay has had an opportunity to paint.
- The cover is removed after two animation callbacks once frames resume. A long rendering stall does not make the cover time out behind the user's back.
- If quality, XR mode, desktop/cardboard mode, phase, or fatal state changes *during the preparation stage*, the stale quality action is canceled instead of applying an outdated setting.
- The transition has `role="status"` and `aria-live="polite"`; while displayed, pointer input is intercepted to avoid accidental interaction with a half-updated 3D scene.
- The pre-existing beige `FadeVeil` remains for mode/XR transitions only. Photo mode and quality switching do not trigger the beige veil.

No geometry, textures, PBR materials, lights, shaders, station data, cabinet, 3D navigation destinations, Product, Research, or `main` were changed.

**Important boundary:** rAF is a *presentation scheduling signal*, not a GPU fence, GPU frame-time metric, `gl.finish()` result, or proof that a physical mobile display has completed presentation. Background tabs may throttle rAF; a pending transition may therefore wait until the browser resumes animation. This is preferable to falsely declaring a background GPU operation finished, but must be tested on actual target devices.

## 3. Reproducible automated acceptance

Run `npm run build` and serve its `dist/` at the value of `GB_LIBRARY_TEST_URL`. The new `tests/quality-transition-browser.py` uses the application's public quality controls (rather than directly mutating Zustand), probes **both directions**, checks the covered old-quality frames, confirms final button state and protection removal, and verifies that the original WebGL canvas was not replaced.

| Browser / viewport | Transition test | First direction: overlay removal | Largest measured rAF gap |
| --- | --- | ---: | ---: |
| Chrome desktop 1440x900 | PASS | approximately 0.93 s | 867 ms |
| Chrome touch emulation 390x844 | PASS | approximately 0.24 s | 183 ms |
| Playwright WebKit desktop 1440x900 | PASS | approximately 0.97 s | 824 ms |
| Playwright WebKit touch emulation 390x844 | PASS | approximately 1.79 s | 1641 ms |

**Result:** Four configurations PASS, two switches each (eight total). Every case showed the cover while the old quality remained selected for at least two callbacks; then the updated quality appeared and the cover was removed. The beige fade remained transparent, the Canvas DOM identity was preserved, and no JavaScript page errors or HTTP 4xx/5xx were observed in these cases.

Independent regressions on the same local candidate:

| Gate | Observed result |
| --- | --- |
| Strict TypeScript check and Vite production build | PASS |
| Existing laboratory checks | 5/5 PASS |
| Photo-mode browser test after removing its unrelated quality assertion | 4/4 PASS |
| Existing interaction regression (intro, sitemap, keyboard, focus) | 12/12 PASS |
| Existing mobile HUD checks | 6/6 PASS |
| Existing architectural browser checks | 4/4 PASS |
| Reference-bay fixed-camera browser checks | 5/5 PASS on rerun |

An initial reference-bay run reported `net::ERR_CONNECTION_REFUSED` because the isolated local test HTTP server temporarily became unavailable. On the next run, the server returned HTTP 200 and all five reference-bay cases passed. The initial infrastructure failure was **not** counted as a successful app test.

### Real browser screenshot witnesses

- [WebKit desktop during graphics switch](evidence/quality-v510-webkit-desktop-transition.webp): the status text is shown on a dimmed but still recognizable library view.
- [Chrome desktop after switch](evidence/quality-v510-chrome-desktop-after.webp).
- [WebKit mobile emulation after switch](evidence/quality-v510-webkit-mobile-after.webp).

These are genuine Playwright browser screenshots, converted from PNG to lossless WebP. Decoded RGB pixels were verified identical to the captured PNG source. They are not AI-generated 3D concepts.

### Raw, machine-readable evidence

See [quality-v510-observations.json](evidence/quality-v510-observations.json) for:

- Four baseline recordings of the old wall-clock fade and frame stalls.
- Four completed V5.10 quality-transition regression records, each with both directions.
- Three isolated WebGL API timing probes, instrumented only within disposable browser pages (no production monkeypatch or instrumentation shipped).

The WebGL probes did not identify a single synchronously timed JavaScript WebGL call explaining the full frame stall. The largest wrapped call in one WebKit touch sample was around 34 ms for `texSubImage2D`, whereas the rAF pause was about 1.6 s. **Do not infer the root cause from these incomplete timings.** Sampling, browser driver differences, GPU compilation, pipeline scheduling and profiler side effects all remain potential factors.

## 4. Command-line QA contract

```sh
npm run lab:check
npm run lab:catalog:test
npm run lab:cabinet:test
npm run lab:progression:test
npm run lab:cabinet:types
npx tsc --noEmit
npm run build
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/quality-transition-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/photo-transition-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/interaction-regression-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/mobile-hud-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/architectural-art-browser.py
GB_LIBRARY_TEST_URL=http://127.0.0.1:18773/ python tests/reference-bay-browser.py
```

## 5. Remaining hard gates: NOT zero

- **Performance:** First quality switch can still stall the render/scheduler. The cover is a correct user-facing lifecycle signal; it does not make the GPU pipeline faster. Determine actual causes with controlled, statistically repeatable CPU/GPU timings and device profiling.
- **Art direction:** Full library visual fidelity, coherent architecture, proper materials and owner-approved matched-angle comparisons against the architectural target remain open.
- **Real devices and XR:** No real iPhone Safari, Android low-tier or VR headset validation of gesture accessibility, GPU time, VRAM, temperature, thermal throttling, driver/context recovery and XR stability.
- **Product boundary:** Demo catalogue, route/research ownership, content licensing, approved publication and reader/cabinet integration remain separate release gates.
- **Mode/XR transitions:** Existing beige fade remains in use for mode and XR. V5.10 does not certify these distinct pathways.

**Decision: continue in the same Draft PR under ART HOLD; do not merge, deploy or announce a complete release.**
