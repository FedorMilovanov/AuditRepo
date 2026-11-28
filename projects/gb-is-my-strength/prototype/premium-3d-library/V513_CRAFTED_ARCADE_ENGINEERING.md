# Premium 3D Library — V5.13 contiguous crafted bookshelf arcade

**Date:** 2026-11-09. **Existing Draft PR:** [AuditRepo #545](https://github.com/FedorMilovanov/AuditRepo/pull/545). **Starting HEAD:** `e6fbb870293e5551f7fbb5673a49588f4f1ff82f`.

**Decision:** **LAB / DRAFT / ART HOLD**. This is a local gallery-detail refinement, not final artistic acceptance, physical-device certification, Product integration or a deployment.

## 1. Observed architecture gap

Previous V5.2 had one individually dressed reference bay (bay 5) at the end of the window arcade. Three adjacent bookcase sections were left with only generic shelf/pilaster trim, creating a discontinuity between comparable architectural bays. The core shelf geometry and actual section books already exist and must not be relocated.

**Scope in `src/scene/ArchitecturalPolish.tsx`:** extend the existing reference grammar to the contiguous four-bay run **[3, 4, 5, 6]**. All four are existing shelved bays, outside the entrance bay 0 and window bays 7–12. Retain the canonical station positions, old shelves/books, reader/cabinet records and public interaction targets.

The details are the same original physical joinery language: dressed-stone pilasters and imposts, oak stiles and cornices, stepped shelves, inset lower panels, restrained brass strips and dark knobs, and a shallow dressed-stone arch. No emissive/fantasy rings or new light source; no unlicensed external texture.

### Batching and clearance

- `referenceParts(bay)` continues to be the sole geometry grammar; the part lists from all four bays are combined into **three instanced material batches** (oak, stone, brass) instead of creating 3×4 independent meshes.
- All four arches now share one `TubeGeometry`, one PBR stone material and **one InstancedMesh draw**; an initial version using four individual arch meshes was rejected after A/B measurement.
- The per-instance transformation is `position = (sin(a)×15.85, 0, cos(a)×15.85) + rotated(0, 0, -1.08)`, `rotationY = a`, retaining the original bay 5 placement exactly. Bounding spheres are recomputed for the combined instancing.
- The forwardmost curved arch is at radial distance approximately **14.60 m**. The stone plinth at local z=-0.98, depth=0.53 has a forward distance approximately **14.605 m**. Both stay outside the existing **14.50 m** colonnade walking boundary. Nothing is inserted into the player collision corridor.
- The shared material, original PBR texture loading, section data and old book coordinates remain unchanged.

This is more consistent **architectural craftsmanship**, not a complete handcrafted GLB/PBR rebuild. The overall scene still lacks the authored furniture/material fidelity required for final art acceptance.

## 2. Real browser visual acceptance

Before/after were captured by the exact public sitemap/station flow, no camera injection, teleport, direct Zustand mutation or Photoshop repaint. Both use 1440×900 desktop or 390×844 emulated touch, DPR1, reduced-motion, and the same fixed editorial stations.

- [Chrome desktop creeds station, before](evidence/crafted-arcade-v513-chrome-creeds-desktop-before.webp) / [after](evidence/crafted-arcade-v513-chrome-creeds-desktop-after.webp)
- [Chrome desktop article station, before](evidence/crafted-arcade-v513-chrome-article-desktop-before.webp) / [after](evidence/crafted-arcade-v513-chrome-article-desktop-after.webp)
- [WebKit mobile creeds station, before](evidence/crafted-arcade-v513-webkit-creeds-mobile-before.webp) / [after](evidence/crafted-arcade-v513-webkit-creeds-mobile-after.webp)
- [Desktop detail contact sheet — before/after](evidence/crafted-arcade-v513-detail-comparison.jpg)

All six source screenshots are actual browser PNGs losslessly transcoded to WebP and verified for decoded-RGB identity. The side-by-side crop is a comparison aid, not a substitute for the original full-viewport images. [SHA-256 evidence and performance JSON](evidence/crafted-arcade-v513-evidence.json).

The added casing, pilasters and arch details are a **subtle, localized** change. There is no claim that unchanged distant hall areas have improved or that the art target has already been met. In one matching full-frame Chrome desktop view, roughly 2–3% of pixels differed by a luminance difference above 20/255, but this includes rendering/timing noise; **pixel change is not an artistic quality score**.

## 3. GPU performance — reject the expensive variant, keep the instanced one

Playwright Chrome and WebKit on the authorized Windows machine, four individual single-run observations per variant, 3.5-second `requestAnimationFrame` window after entering the hall, identical 1440×900 or 390×844 viewport, DPR1. Results are **diagnostics**, not repeatable physical GPU benchmarks.

| Engine / viewport | Original draws/frame | Four independent arches (rejected) | Shared instanced arches (candidate) |
| --- | ---: | ---: | ---: |
| Chrome 1440×900 | 251.2 | 255.2 | 252.2 |
| Chrome touch 390×844 | 120.6 | 123.6 | 123.6 |
| WebKit 1440×900 | 252.5 | 256.9 | 253.7 |
| WebKit touch 390×844 | 120.6 | 123.7 | 123.6 |

Chrome remained at approximately **60 rAF/s** across both resolutions. WebKit desktop was 28.7 baseline, 25.4 noninstanced, 26.3 instanced rAF/s; WebKit touch was 57.5, 51.0, 57.5 respectively. The difference between one baseline and one candidate WebKit desktop sample **is not enough to exclude a slowdown** under repeatable or real-device conditions. New draw-call overhead is approximately +1 to +3.1 per rendered frame. The independent-arch source experiment was not kept.

Neither rendering these measurements nor this implementation fixes the previously observed slow first quality switch, and no GPU pipeline timing, thermal control, physical iPhone Safari, Android or XR headset benchmark was performed. Therefore **physical performance gate remains OPEN**, no matter the laboratory rAF results.

## 4. Regression gates on the exact final candidate

- Production Vite build and strict TypeScript: **PASS**
- Existing laboratory checks: **5/5 PASS**
- Public-route station/reference tour: **5/5 PASS** in Chrome and Playwright WebKit
- Architectural WebGL/PBR resource browser: **4/4 PASS**
- Central open book and normal entry: **4/4 PASS**
- Mobile HUD: **6/6 PASS**
- Interaction/intro/map keyboard & focus regression: **12/12 PASS**
- Combined browser checks: **31/31 PASS** plus four read-only performance profiles, no observed browser JS errors or 4xx/5xx resource failures in the checked paths

These checks cover scene correctness and absence of regressions, not owner approval of photo realism or assistive-technology certification on actual devices.

## 5. Remaining release and quality gates

1. **Art:** current hall still requires approved reference-matched, custom GLB/PBR joinery and varied furniture, complete material/lighting polish and physical props across the entire library. Four repeated bays are a foundational refinement only.
2. **Performance:** physical iOS Safari, Android and headset GPU/VRAM/thermal/context tests; repeatable WebKit Windows and mobile-quality-switch profiling.
3. **Product and rights:** real content registry and licensing, Reader, cabinet migration, noindex/publication controls. Demo records are not production-approved.
4. **UX:** actual screen-reader + assistive-technology evaluation and touch/navigation assessment on representative physical hardware.

**Do not merge PR #545 or update Product. Keep it Draft / LAB / ART HOLD.**
