# Library Premium Lab — design and engineering directions

Date: 2026-11-08 (research snapshot). Status: local experiment, **NOT Product**.

## Goal

A believable high-end classical scholarly library, with the actual site content
and existing navigation/VR preserved. This is a *performance-conscious 3D design
candidate*, not a photo or a claim of finished photorealism.

## Implemented in local source

- Daylight sky and shadow-casting sun replace purple sunset, glowing environment
  lights, additive bloom and aurora.
- Solid light-stone lathed dome, skylight and fixed pendant replace transparent
  oscillating fantasy vault.
- Central open Bible-like book and wooden reading table replace animated orb,
  floating energy rings and the vertical beam.
- Limestone outer walls, 6 large windows and full timber shelves, with 1,716
  deterministic instanced book meshes in a SINGLE geometry/draw-call family.
- Calm travertine floor, deterministic 1024/2048 textures, no mirror render pass.
- Removes animated portal/forcefield, coloured stained glass and path sparks from
  the active scene without disturbing the existing interaction/store architecture.
- Restores explicit VR support detection lost from the previous prototype.
- Safe localStorage fallbacks, fail-closed WebGL2 check, existing context-loss UI.

## Initial source-patch questions (historic 2026-11-08)

The following bullet list describes the **first source-only patch**.
Windows installation, TypeScript, build, browser Chrome/WebKit checks and
several scene repairs are now witnessed on later commits. Refer to
[CURRENT_STATUS.md](CURRENT_STATUS.md) for current status. Physical-device
WebGL/VR memory/performance, complete high-fidelity art and Product routes
remain open.


- Dependency installation/build/browser FPS on target devices: offline container
  does not provide npm packages; source patch is not a production artifact.
- Mobile UX, collisions at new peripheral furniture, shadow acne, VR readability.
- Rights/accuracy of any referenced public site content and links.

## Follow-up quality bar

1. Build in a connected clean environment with exact lockfile.
2. Visual QA at 390x844, 768x1024, 1440x900, 2560x1440; mouse/touch.
3. Test WebGL context loss, XR unsupported/supported, pointer lock recovery, and
   click targets after geometry additions.
4. 15-minute FPS capture and frame-time p95 on low/mid/high GPUs; only then set
   quality targets and reduce geometry, lights, and texture resolution if needed.
5. Replace procedural hero assets with properly licensed low-poly and high-detail
   glTF + Meshopt + KTX2 materials, measured against draw calls and VRAM.
6. Confirm editorial/site route ownership in Product before any integration.

## Primary current references

- Three.js WebGPURenderer official manual: https://threejs.org/manual/pages/webgpurenderer
- Three.js Migration Guide (r187, 2026-10-16): https://github.com/mrdoob/three.js/wiki/Migration-Guide
- React Three Fiber scaling performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- Khronos glTF asset guidelines v2: https://www.khronos.org/blog/introducing-asset-creation-guidelines-2.0-siggraph-2025
- Khronos KTX artist guide: https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md

## Renderer strategy

The existing app uses WebGL2 via React Three Fiber, so this revision stays on
that tested backend. The official Three.js WebGPURenderer exposes WebGL2 fallback
but can require TSL material conversion, nontrivial postprocessing migration,
and device-specific QA. Do NOT swap it into a working legacy R3F/XR stack just
for perceived quality; run a separate side-by-side measured spike instead.
