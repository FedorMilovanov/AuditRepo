# Premium 3D Library — V5.9: graphics diagnosis and photo-mode visual repair

**Date:** 2026-11-09. **Existing PR:** [#545](https://github.com/FedorMilovanov/AuditRepo/pull/545).
**Base HEAD:** `6756263e066ed4c995d3e25af1a2951a79cd170b`. **Decision:** LAB / DRAFT / ART HOLD; **not Product or release**.

## 1. Observed issue and precise change

The V5.7 control audit confirmed a flat beige frame during the first ~100 ms of photo mode,
while a settled screenshot at ~650 ms showed the scene again. The V5.8 app code subscribed
`FadeVeil` to `photo`, even though the photo switch only changes the HUD layer and
interaction guards. The WebGL Canvas and scene are **not** recreated by photo mode.

**Repair:** in `src/App.tsx`, remove only `photo` from the fading veil's subscriptions
and effect dependencies. **Keep quality/mode/XR triggers unchanged.** Add a stable
`data-gb-fade-veil` witness selector. This avoids a visual full-frame flash without
a hardcoded delay, new renderer branch, or blanket removal of the quality/VR safeguard.

Test `tests/photo-transition-browser.py` opens photo mode through actual public UI
handlers, checks veil computed opacity at 110 ms, confirms Canvas DOM node identity,
exits photo mode, then checks that the veil remains transparent and page JS/HTTP is
error-free. Four browser/viewport cases **4/4 PASS**: Chrome/WebKit 1440×900 and
touch-emulated 390×844.

**Screenshots are real browser captures, not generated concepts.** The original PNGs
are converted to lossless WebP, checked for identical decoded RGB pixels:

- [Chrome desktop, photo mode at 110 ms](evidence/photo-v59-chrome-desktop-110ms.webp)
- [Chrome touch 390×844, 110 ms](evidence/photo-v59-chrome-mobile-110ms.webp)
- [WebKit desktop, 110 ms](evidence/photo-v59-webkit-desktop-110ms.webp)
- [WebKit touch 390×844, 110 ms](evidence/photo-v59-webkit-mobile-110ms.webp)

The Chrome desktop screenshot has nonuniform scene content (RGB channel standard
deviations ~65, 68, 68), unlike the previous uniform beige transition.

## 2. Identical-viewport graphics diagnostics (read-only)

Source-owned reproducible script: `tests/graphics-backend-profile.py` with
`GB_LIBRARY_TEST_URL` and optional `GB_LIBRARY_GPU_PROFILE_EVIDENCE_DIR`.
It uses the app's own persisted `gb-hall-quality` preference and reports
canvas size, `requestAnimationFrame` cadence and the exposed renderer string.

The following measurements are a **single approximately 4.1-second sample per mode**,
from the **previous exact V5.8 build** (HEAD `6756263`) on the authorized
Windows desktop, DPR 1, Playwright headless browser. Machine-readable raw
results and limitations: [graphics-v59-profile.json](evidence/graphics-v59-profile.json).
They are not stable device benchmarks or GPU frame timing.

| Engine and viewport | High rAF/s | Low rAF/s | Renderer reported |
| --- | ---: | ---: | --- |
| Chrome 1440×900 | 59.82 | 59.81 | ANGLE / NVIDIA RTX 3060 / Direct3D11 |
| WebKit 1440×900 | 25.40 | 26.29 | Apple GPU / Apple Inc. |
| Chrome touch 390×844 | 59.88 | 59.84 | ANGLE / NVIDIA RTX 3060 / Direct3D11 |
| WebKit touch 390×844 | 43.65 | 49.78 | Apple GPU / Apple Inc. |

**Hard limitation:** Playwright WebKit on this Windows machine exposes an
`Apple GPU` identifier, unlike Chrome's identified NVIDIA D3D11 path. It is
not evidence that the physical RTX 3060 rendered WebKit through the same
driver or scheduling path. No `EXT_disjoint_timer_query_webgl2` was
exposed by WebKit in this sample, whereas Chrome exposed it.

A separate **synthetic** same-browser microbenchmark measured the
requestAnimationFrame rate with zero/simple/multiple WebGL draw submissions
at 1440×900. These are deliberately **not** the library scene:

| Synthetic draws per frame | WebKit rAF/s | Chrome rAF/s |
| ---: | ---: | ---: |
| No WebGL / empty rAF | 62.65 | 58.58 |
| 1 | 63.79 | 60.48 |
| 25 | 59.49 | 60.52 |
| 125 | 55.27 | 60.88 |
| 250 | 52.13 | 60.39 |

WebKit's default page scheduler is not capped at ~25 rAF/s, and synthetic
draw-call overhead accounts for *some*, but not the full, difference. A
real-world library render includes heavy geometry, shader/material, shadows,
texturing, fragment fill and scene update costs. The current evidence is
**insufficient to attribute the entire deficit to any one of them**.

**Decision:** no indiscriminate shadow disablement, arbitrary 3D resolution
downgrade or geometry duplication. Next investigate physical mobile Safari
and Android hardware with GPU timing, memory, thermal conditions and a
controlled identical-viewpoint scene profiler. Chrome's 60 rAF/s is probably
vsync-capped, not proof of spare GPU budget.

## 3. Separate legacy quality-transition question

The existing quality-change veil code was deliberately retained. In the
diagnostic after clicking quality, the inline target opacity at 80 ms was
`0` in Chrome desktop and `1` in WebKit desktop; it later returned to
transparent in both. Thus **timing/sufficiency of quality-change protection
is NOT VERIFIED** by this wave; it is a separate follow-up, not silently
called PASS. Crucially, photo mode itself now never turns on this overlay.

## 4. Regression gates and release decision

The photo-mode test is an explicit standalone browser gate. It uses public
React button handlers; in desktop pointer-lock scenarios these are invoked
via DOM `.click()` to avoid pointer-capture intercepting synthetic mouse
input. Therefore it does **not** certify pointer-lock UI hit-testing.

The overall library still requires professional GLB/PBR art direction,
matched reference-view approval, verified Product-owned content/rights,
physical Safari/Android/VR GPU+memory testing and the original stop-ship
gates in [QA_V57_CONTROL_VISUAL_AUDIT.md](QA_V57_CONTROL_VISUAL_AUDIT.md).

**PR #545 remains DRAFT / ART HOLD; do not merge or publish.**
