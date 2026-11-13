# Premium 3D Library — V5.11: mobile portrait entry composition and graphics A/B investigation

**Date:** 2026-11-09. **Existing PR:** [AuditRepo #545](https://github.com/FedorMilovanov/AuditRepo/pull/545).
**Starting HEAD:** `4c4338dfed890786857b274b726d2e90579d1f05`.
**Status:** **LAB / DRAFT / ART HOLD** — not Product, no merge, no public release.

## 1. User-facing composition repair

V5.7 found the mobile hall composition too ceiling-heavy and the central reading table visually small. V5.10 did not change the starting viewpoint. The original scene spawned in both desktop and mobile with `SPAWN.pitch = 0.02` radians.

**Actual code change:** only `src/scene/Player.tsx`:

- Introduce one named, intentional `PORTRAIT_TOUCH_SPAWN_PITCH = -0.08` radians, chosen through before/after visual comparison.
- Apply it when entering the hall in `(pointer: coarse) and (orientation: portrait)`; retain `SPAWN.pitch` for all desktop, landscape, other screen modes and XR paths.
- Do **not** alter x/z spawn coordinates, eye height, collision boundaries, input sensitivity, player navigation, station positions, geometry, textures, lights, shaders, HTML Reader, user data or Product.
- The viewport is evaluated at actual entry. Orientation changes after entering remain under the visitor's manual camera control instead of forcibly resetting their pose.

This is a **responsive camera composition preset**, not a CSS zoom, geometry duplication or GPU-quality downgrade. The default goal is a better initial composition, not a photography-grade rework of the whole hall.

## 2. Same-camera screenshot acceptance

A clean browser context entered through the normal public CTA; viewport and DPR were held fixed, with `prefers-reduced-motion: reduce`. Captures were taken roughly 1.35 seconds after the intro exit. The before images were captured on the exact V5.10 source before changing Player; the after images were captured from the rebuilt V5.11 candidate.

| Browser, viewport | What the visual comparison establishes | Quantitative context |
| --- | --- | --- |
| Chrome 390×844 portrait touch | Less empty ceiling; table and open book rise toward the readable central region | Mean absolute pixel difference ~32.19/255 |
| Chrome 320×760 portrait touch | Same improvement at narrower viewport; top navigation retained | ~32.71/255 |
| Playwright WebKit 390×844 portrait touch | Same framing behavior in the independent browser engine | ~32.10/255 |
| Chrome 1440×900 desktop | No intended camera change; minimal time-driven rendering variance | ~0.12/255 |
| Chrome 844×390 touch landscape | No intended camera change; minimal time-driven rendering variance | ~0.02/255 |

**Important:** pixel difference is **not** a visual quality score. It measures that portrait scenes changed while the desktop and landscape baselines stayed effectively identical; screenshots also include minor independent animation/timing differences. These are desktop GPU browser emulations, not actual phone testing.

### Real browser screenshots

- [Chrome 390×844 — before](evidence/mobile-camera-v511-chrome-390-before.webp) / [after](evidence/mobile-camera-v511-chrome-390-after.webp)
- [Chrome 320×760 — before](evidence/mobile-camera-v511-chrome-320-before.webp) / [after](evidence/mobile-camera-v511-chrome-320-after.webp)
- [WebKit 390×844 — before](evidence/mobile-camera-v511-webkit-390-before.webp) / [after](evidence/mobile-camera-v511-webkit-390-after.webp)
- [Chrome 390×844 — side-by-side contact sheet](evidence/mobile-camera-v511-comparison.jpg)

All six original before/after PNGs were encoded into lossless WebP and checked for **pixel-identical decoded RGB**; SHA-256 and file sizes are in the [evidence manifest](evidence/mobile-camera-v511-evidence.json).

## 3. Graphics quality timing — negative control experiments

To investigate the initial WebKit quality-change stall before making any optimization, three isolated local builds on the same starting code were measured. Each case is one fresh browser context, a short first quality toggle, fixed Chrome/WebKit at 1440×900, DPR 1. This is **not** a statistical CPU/GPU benchmark.

| Engine and initial quality | Baseline ms | Stable global shadow mode ms | Frozen texture resolution ms |
| --- | ---: | ---: | ---: |
| Chrome high → low | 838.6 | 865.7 | 798.7 |
| Chrome low → high | 260.5 | 261.0 | 174.8 |
| WebKit high → low | 981.0 | 992.0 | 940.0 |
| WebKit low → high | 2022.0 | 2010.0 | 1865.0 |

**Both experiments rejected and their source modifications reverted:**

1. **Stable shadow-mode toggle:** keep `Canvas.shadows` globally set to percentage, while the directional light retains quality-dependent `castShadow`. No useful improvement: the main WebKit delay remained ~0.94–2.01 seconds.
2. **Freeze floor CanvasTexture at initial quality:** skip the `useMemo` quality dependency. The delay also persisted, and this would violate the correct texture/memory budget after toggling (a low-start canvas would remain 1024 px in high mode, a high-start canvas would retain 2048 px in low mode). It was used **only for causal diagnosis**, never accepted as a product change.

The observations are preserved in machine-readable [A/B evidence](evidence/mobile-camera-v511-evidence.json). With a single sample per case, small differences cannot be interpreted as proof of benefit. Current browser profiling remains insufficient to attribute the remaining long frame stall to one GPU operation; never solve this by disabling shadows arbitrarily or harming art fidelity.

## 4. Acceptance and release boundary

Source checks: TypeScript, Vite production build, five laboratory npm commands. Real browser QA: mobile HUD (6 expected cases), intro/map/navigation (12 expected cases), architectural smoke (4 expected cases) and fixed camera reference-bay (5 expected cases). These must all be green before committing.

No physical Safari/iPhone, low-end Android or headset benchmarks were performed. Full architectural GLB/PBR and furniture art direction, editorial content and rights, persistent Reader/cabinet Product alignment and physical hardware performance remain stop-ship gates.

**Decision:** keep existing PR #545 **Draft / LAB / ART HOLD**; no merge, production publication, new branch or unrelated repository modification.
