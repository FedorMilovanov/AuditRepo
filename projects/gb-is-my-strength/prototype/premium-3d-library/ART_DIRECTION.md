# Library Premium Lab — design and engineering directions

Date: 2026-11-08 (research snapshot). Status: local experiment, **NOT Product**.

## Goal

A believable high-end classical scholarly library, with the actual site content
and existing navigation/VR preserved. This is a *performance-conscious 3D design
candidate*, not a photo or a claim of finished photorealism.

## 2026-11-12 — verified target-to-scene gap and admission sequence

**Evidence examined:** checked-in `reference/library-design-target.png` (an aspirational image, **not** a dimensionally verified architectural blueprint), versus actual Chrome `evidence/art-v52/chromium-1440x900.png` and the existing `Architecture.tsx` / `World.tsx` source. Both screenshots refer to this LAB, not a published Product revision. The target and current scene differ in **structure**, not merely texture resolution.

| Target reference | Actual candidate | Required direction |
| --- | --- | --- |
| Longitudinal, two-level gallery with mezzanine and balconies | Radial single-storey room with circular colonnade and domed ceiling | Plan a deliberate architectural layout/second-level concept; avoid attaching a fake balcony to the existing dome |
| Deep masonry barrel/cross-vaults, thick piers and recessed arches | Mostly flat circular dome, cylindrical columns and thin arcs | Author real arch intrados, jamb depths and structural contact, with lighting/bake-aware mesh budgets |
| Very tall daylight windows, outdoor landscape and directional floor shadows | Repeated radial window bays, flat exterior ambience and evenly lit scene | Build one representative window/stone/floor bay first; prove depth, outdoor parallax and shadow response in same-camera A/B |
| Reading tables/chairs, shelving niches and plants scaled as furniture | Flat signs/standees, sparse benches, one source-verified GLB armchair | Make one focal **reading bay** with authentic measured CC0 assets; remove theme-inconsistent ornaments only after visual acceptance |
| Warm stone, timber, brass and natural textiles with restrained visual signage | More schematic geometry and very prominent dark floating information boards | Preserve editorial labels and keyboard/touch access, but visually integrate them with architecture rather than overpower it |

**Do not claim a 1:1 match.** The AI-generated visual target does not specify reliable construction dimensions, a walkable second storey, rights to a mountain panorama, or how 20 existing exhibits fit a longitudinal floorplan. Those are separate design decisions and must not be fabricated or made by moving Product navigation silently.

**Safe staged implementation, all in the current Draft LAB branch:**

1. **One real reference bay (not a whole-building replacement).** Choose a single window-plus-shelf-plus-stone-arch area, with authentic geometry, UV/PBR and natural shadow interaction. Reuse source-licensed GLB/materials only after a source URL, rights, exact checksum, polygon/material/texture counts and compressed decoded-memory budget are recorded. Do not import full source ZIPs.
2. **Three fixed camera witnesses:** arrival/central reading, Article station near the chair, and the reference window bay; compare exact viewport, camera, lighting and graphics preset, Chrome/WebKit desktop and 390×844 touch emulation. Reject clipped reading copy, HUD occlusion, visible z-fighting, floating geometry, and inconsistent wood/stone scale.
3. **Performance before adoption:** record real Chrome RTX 3060 high/low and Windows Playwright WebKit high/low draw calls, rAF p95/p99 and first-load/quality-transition stalls. The independently measured reference is ~60 rAF/s on RTX 3060 Chrome 1440×900, but ~25–29 on Windows Playwright WebKit. Do not infer a physical Apple GPU/Safari result. A cosmetic increase in draw calls that worsens WebKit is not a successful art release.
4. **Navigation and regression:** retain the original 20 `ITEMS` IDs and content rights. Every new solid object needs the **same transform/physical footprint** in rendered meshes and `OBSTACLES`; check 20/20 reachable approaches via `HALL_ROUTE_TOPOLOGY_PASS`, numerical clearance, 65 real-browser cases, context recovery, 2D no-WebGL and genuine touch interaction.
5. **Only after a bay is independently accepted:** discuss the larger floorplan/upper-gallery migration, with complete collision map, daylight/exterior and XR route acceptance. Do not rebuild the entire site or merge to Product merely because the one-bay test passes.

**Hard ART HOLD stays:** an owner-approved architectural design and visible real-scene evidence are missing. A green functional CI or a beautiful static target image does not close artistic acceptance. This design note is an engineering work plan, not approval to deploy or redesign site routes.

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
