# V5.35 — real reduced-motion policy and capability-first 2D bootstrap

**Scope:** isolated Premium 3D Library LAB in the existing AuditRepo Draft PR #545.
**Baseline:** V5.34 candidate commit `fdb702a29f5dcd059ac797b2cf30985775e97068`.
No Product, AuditRepo main, user IndexedDB, deployment, merge, release or new branch.

## Reproduced issues and actual changes

1. **Motion accessibility:** several scene artefacts advanced with clock time even when the browser advertised `prefers-reduced-motion: reduce`. A central `useReducedMotion()` hook uses `useSyncExternalStore` and media-query `change` subscriptions. Source-owned station animations, cards, destination pulse and head-bob now honor the setting. User-requested navigation, targeting and XR inputs remain functional; ordinary camera flights snap when reduced. Intro orbit already respected the preference. The active `World` uses static `@react-three/drei` Sky; the unused alternative `scene/Sky.tsx` was deliberately left unchanged.
2. **Unnecessary 3D transport without WebGL:** previously `main.tsx` imported `App` and `App.tsx` statically imported `World` before the WebGL2 check. Now the bootstrap tests WebGL2 **before** importing App or Three-based dependencies and opens a separate, accessible `NoWebGL` 2D entry. The lab cabinet loads on demand; the normal page continues to use a lazily imported `World` chunk, with a React error boundary and fallback.

## Source-owned test contracts

- `tests/webgl-recovery-browser.py`: keep six actual WebGL loss/restore and 2D fallback cases. Both no-WebGL cases now verify request traffic did not include `App-` or `World-` JS chunks, then open the actual cabinet (not a placeholder).
- `tests/reduced-motion-browser.py`: four public-browser cases, **Chromium + WebKit** × **reduce + no-preference** at 1440×900. Navigate to the real Series station via public map. Capture two time-separated, same-camera 820×590 screenshot crops. Under reduce the **entire PNG bytes must remain identical**; under no-preference **must differ**. Both PNGs and hashes are preserved. There is no mocked camera state or graphics engine.
- `scripts/run-browser-regression.py` and `tests/browser-runner-contract.py` now enforce **11 suites / 57 browser cases** including both motion settings and the no-3D-network requirement. No skips or weakening of the previous 53 cases.

## Local Windows 11 GPU/browser acceptance

- Node installation 198 packages, TS strict type-check, Vite production build and `lab:check` PASSED on this candidate. Five laboratory commands and output checks are required again after final source edits.
- Six existing recovery cases PASSED in Chromium and WebKit on a locally HTTP-served build: 2 restoration paths and 1 truly disabled WebGL2 fallback per engine, with the same original canvas restored and working cabinet; no JS errors.
- The four new actual browser cases PASSED (Chromium/WebKit; reduce/no-preference). Pixel drift from an independent local Pillow analysis on the center crop was **0.0 mean difference under reduce in both engines**, versus **5.996 Chromium / 5.667 WebKit** RGB mean difference under normal settings; roughly 10% of pixels changed in normal settings. The mandatory test uses PNG byte/hash identity, not Pillow, and therefore adds no new Python image dependencies.
- These are actual Windows desktop browser runs, **not a physical Safari/Android/VR certification**. CPU-only Linux GitHub Actions **must independently PASS on the exact new commit**, including the 57/57 matrix; old 47/47 and 53/53 are not admissible for V5.35.

## Explicitly still HARD OPEN

Full photorealistic art/reference composition, author-approved full hall, actual physical iOS/Android/VR tests, sustained GPU frame-time and thermal/VRAM budgets, Product canonical catalog/Reader/rights integration and a separate release approval. A valid reduced-motion experience is not the same as GPU performance improvement. Keep Draft / LAB / ART HOLD; DO NOT merge, deploy or promote to Product.
