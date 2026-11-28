# Premium 3D Library — V5.14 shared vaulted-rib geometry and lifecycle

**Date:** 2026-11-09. **Existing PR:** [AuditRepo #545](https://github.com/FedorMilovanov/AuditRepo/pull/545). **Base HEAD:** `431d8c5969428a9fef6da2b1cf64c837c5b40f91`.

**Release gate:** LAB / DRAFT / ART HOLD. No Product update, release, merge, editorial registry or unrelated branch.

## Observed defect

`src/scene/Vault.tsx` previously built **20 separate `THREE.TubeGeometry` objects** by evaluating the same quadratic rib profile at twenty angular positions. It then rendered twenty separate `<mesh>` elements with the same shared limestone/marble material. Their shape differed only by a rigid Y rotation. The manually memoized `TubeGeometry[]` and `LatheGeometry` shell were not explicitly disposed on unmount.

This meant unnecessary GPU draw calls and memory duplication in an already performance-constrained WebKit scene, without contributing any variation in the architectural detail.

## Exact scoped change

- Use one `TubeGeometry(ribCurve(0), 24, 0.13, 7, false)` and one `InstancedMesh` with **20 transformation matrices**.
- Each transform is a pure rotation `i × 2π/20` about the world Y axis. The base rib already includes the original half-bay angular offset, so all twenty beams retain their prior spatial positions.
- Apply all matrices once at mount through `useLayoutEffect`, then set `instanceMatrix.needsUpdate` and recompute the instance bounding sphere.
- Explicitly dispose both manually created geometries, rib and `LatheGeometry` roof shell, when the vault unmounts. Scene JSX uses `dispose={null}` for these manually managed geometries.
- The roof shell, oculus glazing, cove, metal and wood pendant, sunlight, material textures, station positions and player/collision volumes are **unchanged**.
- No new textures, emissive effects, geometry simplification, lossy geometry merge, hidden shadow switch or VR-specific branch.

## Geometric equivalence: source-owned independent test

`tests/vault-rib-equivalence.mjs` uses actual Three.js `QuadraticBezierCurve3`, `TubeGeometry`, `InstancedMesh` and `Matrix4` math. It checks the production source contract and compares **101 samples across each of the 20 original rib centerlines** against the transformed first rib. It also verifies the generated instance count and finite aggregate bounding sphere.

**PASS:** maximum deviation approximately **1.39 × 10^-14 m** (floating-point roundoff). Thus the centerline geometry remains identical within numerical precision. This test is independent of HTML overlays and camera view, but does not assert pixel-identical surface normal sampling or PBR lighting.

Run:

```sh
node tests/vault-rib-equivalence.mjs
npx tsc --noEmit
npm run build
```

## Real browser evidence

The unchanged reference station viewpoints were entered through the public UI. The application was built and served locally, with matched viewport and DPR=1, reduced motion, and the same actual browser engine.

- [Chrome desktop creeds station before](evidence/vault-v514-chrome-creeds-desktop-before.webp) / [after](evidence/vault-v514-chrome-creeds-desktop-after.webp)
- [Chrome desktop article station before](evidence/vault-v514-chrome-article-desktop-before.webp) / [after](evidence/vault-v514-chrome-article-desktop-after.webp)
- [Playwright WebKit mobile station before](evidence/vault-v514-webkit-creeds-mobile-before.webp) / [after](evidence/vault-v514-webkit-creeds-mobile-after.webp)
- [Ceiling-area contact comparison](evidence/vault-v514-ceiling-comparison.jpg)
- [Machine-readable render measurements, viewport and SHA-256 evidence](evidence/vault-v514-evidence.json)

The six full-viewport original PNG captures were losslessly converted to WebP and verified for pixel-identical decoded RGB. The before/after screenshots were visually inspected. In three full-frame matched station views, the average absolute RGB differences were approximately **0.073, 0.700, and 0.087 on the 0–255 scale**; some differences reflect rendering timing. A small color difference is **not** proof of visual quality or art-target completion.

## WebGL draw call A/B — a measurable reduction

Read-only `tests/render-performance-browser.py` instruments the actual browser's WebGL draw functions and runs a ~3.5-second rAF window after normal entry. Single desktop Windows sample per engine/viewport, no GPU timer and no simulated GPU clocks.

| Engine / viewport | Before draw calls/frame | After draw calls/frame | rAF/s before → after |
| --- | ---: | ---: | ---: |
| Chrome 1440×900 | 252.2 | 239.1 | 60 → 60 |
| Chrome emulated touch 390×844 | 123.6 | 116.6 | 60 → 60 |
| WebKit 1440×900 | 253.4 | 240.5 | 30.0 → 27.8 |
| WebKit emulated touch 390×844 | 123.6 | 116.5 | 58.8 → 62.6 |

Draw-call reduction is **7.0–13.1 calls/frame**, or approximately **5–6% of those browser-view totals**. Not all 20 original rib draws were on screen at once due to frustum culling. With instancing, a whole vault batch is considered for culling, but the combined renderer still submits fewer draws. Surface detail and vertex resolution are unchanged.

**Limitations:** rAF/s is not GPU frame time or FPS certified by physical screens. The WebKit desktop single-shot rAF rate fell slightly; it could be noise or another bottleneck, and only repeated measurements on controlled hardware can distinguish. Browser WebKit on Windows is not a physical Apple Safari GPU path. The change reduces draw-call overhead but does **not prove higher FPS** and does not solve the initial slow first graphics-quality switch.

## Regression gates and remaining work

The final candidate must pass five existing lab npm checks, strict TypeScript, production Vite build, fixed reference-bay browser **5/5**, architectural/PBR browser **4/4**, central book browser **4/4**, mobile HUD **6/6**, intro/sitemap/navigation **12/12**, plus the explicit node geometry equivalence.

Still open: complete authored GLB/PBR architectural and furniture assets; real mobile Safari and Android GPU/VRAM/thermal/gestures; headset XR; slower first graphics-quality transitions; real Product Reader/cabinet content ownership/licensing. The new vault geometry is an internal structural optimization, not acceptance of the full scene.

**Retain the existing PR as Draft / LAB / ART HOLD; do not merge or publish.**
