# HOREB W17 — original art-asset pilot (NOT PREMIUM-ART ACCEPTED)

**Laboratory only / visual ART HOLD / no release or Product merge.** This is a reproducible proof of an authoring pipeline, not a claim that the house of Moses is known and not yet the target visual quality.

## What is physically present
- `source/build_house_pilot.py`: editable Blender 4.5.16 LTS mesh/UV/PBR authoring script (scene rooted at `HOREB_HOUSE_01__RECONSTRUCTION_NOT_ATTESTED`).
- `source/horeb_egypt_house_hero_pilot.blend`: editable Blender scene, **CC0 textures packed**, no external file references required to inspect.
- `source/textures/*`: source maps from Poly Haven, each checked against Poly Haven API's MD5.
- `../../public/artlab/horeb_egypt_house_hero_pilot.glb`: actual 3D model loaded by Three.js, not an AI painting.
- `../../artlab.html`, `../../src/imena-boga-horeb-3d/ui/HouseArtLab.tsx`: independent Vite **dev-only** art review surface with courtyard / threshold / room / wicker basket views and a hide-roof toggle. Not part of the main story.

The geometry includes a room with an open entrance, courtyard wall, roof poles, woven awning, hand-formed clay vessels, clothing, a real 3D wicker basket and an authored work table. **These are a modelled concept**, not archaeologically verified objects belonging to Moses or his family.

## Build
Use the official portable Blender 4.5.16 LTS (or compatible version), no installer required. On this project directory:
```powershell
$env:HOREB_ART_PIPELINE_ROOT = "$PWD\art-lab\house"
& "H:\HOREB_ArtPipeline\tools\blender-4.5.16-windows-x64\blender.exe" --background --factory-startup --python art-lab\house\source\build_house_pilot.py
Copy-Item art-lab\house\export\horeb_egypt_house_hero_pilot.glb public\artlab\horeb_egypt_house_hero_pilot.glb
npm.cmd run dev -- --host 127.0.0.1 --port 5192 --strictPort
```
Open `http://127.0.0.1:5192/artlab.html`. For actual desktop and 390px mobile screenshots:
```powershell
$env:HOREB_ARTLAB_BASE_URL='http://127.0.0.1:5192'
$env:HOREB_BROWSER_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
node tests\browser-house-artlab.cjs
```
This browser test is an **engineering gate**, never automatic visual ART approval. Real Android/iOS hardware and image-by-image aesthetic review remain open.

## Source, license and interpretation
Original HOREB-only mesh geometry is authored locally. Ground and clay wall PBR maps from Poly Haven, licensed **CC0**:
- https://polyhaven.com/a/clay_plaster (Amal Kumar)
- https://polyhaven.com/a/sand_01
- https://polyhaven.com/license

General archaeology reference, **NOT an identification of a biblical house**:
- https://www.ucl.ac.uk/museums-static/digitalegypt/3d/houses.html

The Blender tool itself is GPL, but output GLB and self-authored model geometry are not automatically GPL merely because Blender was used.

## Honest independent ART review after first W17.1 screenshots
- **PASS**: real Blender file, physically loaded GLB, textured earthen walls, distinct working tabletop and wicker geometry, 1440/390 working controls; no JS/page errors.
- **FAIL / HOLD**: house remains architecturally boxy, generic and sparsely populated; wall detailing repeats; original wicker still too stylized; no rigged mother or family interaction, no authentic doorway/street continuity, still no gameplay incorporation.
- **DO NOT** call this an 8/10 art slice. Don't replace W15's visible world with this pilot. Next artist must author a significantly better house/actor and pass close-up and gameplay review. Engineering tests are no substitute for artistic acceptance.

## Retention
Large binary GLB and BLEND carry adjacent `.artifact.json` with SHA-256, byte size, source/rights and retention reason. Never copy Blender ZIP into Git. Original Chromium PNG evidence resides in an isolated local QA folder, not inside the Git tree. This pilot is protected as evidence until another accepted model supersedes it.

## W26 house study (2026-11-24, ART HOLD)

Rebuild from the exact W17 packed Blender file with Blender 4.5.16:
    blender --background --factory-startup --python-exit-code 1 --python art-lab/house/source/build_house_w26_study.py

Set HOREB_W26_ART_OUTPUT to a new output directory; existing evidence is never overwritten. The generator closes the earthen roof, lays a reed ceiling, adds a closed basket base and woven inner floor, and replaces the four thin vessel shells with closed thick-walled clay geometry. Six closed meshes are validated by edge incidence. The original basket rim and W17 canonical BLEND/GLB are untouched. Native Cycles CPU renders and the separate GLB are generated for review. Original geometry and existing packed CC0 textures only.

First export SHA-256: c546269099b2b5de3c4e831279222483f4827f07d6820e42706ca4001b95e4a9, 5590196 bytes. Native source and GLB stay outside Git with the study manifest. This is not yet accepted for gameplay; visual quality, exact tabletop contact, renderer/device performance and integration are separate gates.

To compare in the existing viewer, set HOREB_HOUSE_STUDY_DIR to that output directory and run node tests/browser-house-artlab.cjs. The optional study mode verifies SHA-256 and serves the exact candidate bytes to the original viewer without modifying public assets. Do not claim art approval from a browser pass. The default test continues to use W17.
## W26b daylight and visibility study — ART HOLD

Run Blender 4.5.16 CPU with build_house_w26b_study.py and environment HOREB_W26_INPUT (verified W26a output) and HOREB_W26B_OUTPUT (new directory). The separate W26b GLB SHA-256 is f1149204b64e8d92c5cdaec4290121792d50f615e0aeb37f5136dc5d1e21fac2 (5695240 bytes). It preserves the rim, adds actual folded linen layers and a clay bowl, and uses a native daylight portal. The real-time viewer approximates doorway daylight separately; native lights are not included in glTF.

Actual Chromium SwiftShader: W26b 373 meshes / 100272 triangles, W17 263 / 48268; both pass at 1440x900 and 390x844. All five sample rays to the basket opening are unobstructed in each preset; projected NDC extent for W26b is .8895 desktop and .8663 mobile. This is a preset view witness, not a proof of visibility during arbitrary orbit. Exact study bytes are verified at each viewport; multiple React fetches are permitted. The screenshot harness saves both canvas and viewport evidence. Mobile camera/controls now keep basket and controls readable. Native lighting improves room readability but materials remain too uniform; do not promote to gameplay. No generated binaries or screenshots are committed.
## W26c material study — ART HOLD

Run build_house_w26c_study.py using Blender 4.5.16 CPU with HOREB_W26B_INPUT (the SHA-bound W26b output directory) and HOREB_W26C_OUTPUT (a new directory). Five existing materials receive original analytical colour and tangent-space normal textures. The script checks the baseline hashes and preserves rim coordinates. Export SHA-256 34c1cdc2f005d41f23d0f8c631997ae8029f5536e16066139c422bce5caa234e, 7748580 bytes. All ten generated PNG checksums and embedded glTF material texture references were independently verified. Native room and basket renders completed. Chromium desktop passed; mobile and visual acceptance remain separate. This is an unadmitted lookdev study, not a replacement for W17/W26b or a final historical reconstruction. No binaries committed.

W10 legacy Nile walk regression: keyboard input now remains held until the unchanged physical displacement threshold is reached within a bounded timeout. Local real Chromium SwiftShader full W10 test passed, including touch ownership, terrain and rescue walking.
## W26d playable house lab — ART HOLD

Existing artlab.html supports first-person walking through the authored GLB courtyard and doorway, with 17 major mesh-derived collision bounds, 0.26 m player radius and 1.69 m eye height. WASD/Q,E, mouse drag and real touch controls. Basket inspection requires distance, 3D camera direction and an unobstructed ray; opening pauses movement, hides movement controls and focuses the close button. Closing restores camera focus. The permanent browser-house-walk.cjs test supports HOREB_ARTLAB_BASE_URL and optional HOREB_HOUSE_STUDY_DIR with verified manifest and GLB hash. Final local Chromium SwiftShader: 4/4 passes (canonical W17 and W26c, desktop 1440x900 and mobile 390x844); physical doorway crossing, table stop, rejection of remote interaction, pause/resume, look gesture, no JS errors. TypeScript passed. Evidence saved separately. W26c preset-view browser test also passed both viewports with zero blocked basket rays. The walk is an isolated technical rehearsal, not W15 story integration. Only major obstacles are covered; no final art or animated hand/basket performance is claimed. Native frames show differentiated materials but regular brick patches and stylized basket fibres. ART HOLD remains.

## W27a in-world rehearsal — ART HOLD

Opt-in W22 performer in the authored W17 house, using the actual two GLB clips and 53-bone rig in the same world and renderer. Body footprint excludes the player; actor is enabled outside walk mode and walking is disabled during asynchronous loading. The basket gesture requires an inspection-eligible position. Completion uses the mixer's finished event and left-wrist distance to actual rim vertices sampled in the peak interval. Exit or visibility loss cancels the gesture; no story progression. Local actual Chromium SwiftShader: W17 + W22, desktop 1440 and mobile 390, 2/2 PASS, 53 bones, nine skinned meshes, 5.09 mm minimum distance, no JS errors. browser-house-actor.cjs checks walking, contextual triggering, completion, contact, inspection, look and actor removal. CI runs the canonical test. This is not approved art, a full grip, infant performance or W15 integration. Visual and device acceptance remain open.
