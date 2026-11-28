# HOREB W19E — original CC0 skin/eye/linen lookdev and helper-geometry fix

**ENGINEERING PASS · CINEMATIC PREMIUM ART HOLD · NO W15 PRODUCT INTEGRATION.**

This is an original editable concept of a woman accompanying the Moses infancy story. **No historical claim about the appearance, complexion, dress, specific house, or gestures of Jochebed**. Exodus 1–2 supplies the canonical events, not these imagined visual particulars.

## What is genuinely improved over W18

- Blender 4.5.16 LTS + MPFB 2.0.18 produces the **same real 53-bone game rig**, now with **official CC0 image-based face/body complexion**, separate fitted low-poly eye meshes, eyelashes/eyebrows and original cloth meshes. Two original skinned animation clips remain `Mother_QuietIdle` and `Mother_GestureTowardsBasket`.
- **ROOT DEFECT FIX:** Blender's MakeHuman base mesh contains helper surfaces hidden via the `Mask` modifier, but **glTF export did not honor that viewport-only concealment**. The previous W18/W19B exported these helper strips into the character's face. The W19E exporter first saves the native editable `.blend` **with all original shape keys**, then creates a separate export-time body by applying the helper Mask. This reduces the MPFB body from **19,158 to 13,380 true vertices** while retaining the skinned 53-bone animation in GLB. Export removes the shape keys on this reduced **runtime** body, so **facial expressions / blendshapes are NOT ready**.
- **Verified CC0 linen** from [Poly Haven rough_linen](https://polyhaven.com/a/rough_linen): 1K OpenGL normal map and roughness map with verified independent MD5. Original linen/beige shader stays, without importing a modern blue diffuse color. Authored UVs are added to all handmade garment meshes.
- Native sources `source/build_mother_lookdev_w19e.py`, `source/horeb_mother_lookdev_w19e.blend`; corresponding runtime `../../public/artlab/horeb_mother_lookdev_w19e.glb`, **8.62MB**. Sources remain fully editable; GLB includes body/face texture, linen maps and two bone clips.
- Minimal original, unmodified **CC0 system asset subset** is kept in `source/makehuman_system_assets/`: the one selected skin and its material, eyes and their brown iris material, eyebrows, eyelashes, OBJ/MHCLO dependencies. The official 280,737,770-byte MakeHuman system archive is **not checked into Git**; only the needed resources are. Original official archive SHA-256: `B542127A8E25547C7C29C19F2D1D2ADB9A664C80396ECD694095DBC8028A0107`.
- Binaries `.blend`, `.glb`, `.png`, `.jpg` have SHA-256 `.artifact.json` sidecars, clear CC0 provenance and ART-HOLD retention. The source does **not** include Blender software or any MPFB GPL code.

## First-hand real Chrome visual verdict

Original browser screenshots were actually inspected at desktop 1440×900 and emulated mobile 390×844 (same camera and light as W18). Local audit archive: `H:\HOREB_ArtPipeline\evidence\w18-mother-*.png`, `w19*-mother-*.png`. The quality decisions are **visual**, not inferred from green tests.

- W19A: original 1K CC0 skin + 3 face parts + braid hairstyle. **Visually failed**: braid occluded face, skin badly exposed and eyes uncanny. Only locally retained.
- W19B: lighter CC0 skin + low-poly eyes + no braids. Better visibility, but MakeHuman helper flaps still covered face. Only locally retained.
- **W19C**: proved root cause: 5,778 helper vertices removed by applying Mask for export. Skin face now visible. Eye and mouth still wrong.
- W19D: high-poly eyes **without** eyebrows/lashes did not solve distorted mouth or gaze; local only.
- **W19E**: retained verified W19C helper fix and added authentic woven fabric normal/roughness maps. Some material improvement, but the same fundamentally **underdeveloped character look**.

**ART HOLD — defects still unacceptable:** visibly enlarged/unnatural eyes, red/dark mouth artifacts, bald scalp, no believable hair/linen head covering, costume sleeve/shoulder outlines too geometric, no facial rig/eyelid animation, emotionally shallow gesture, no physical basket manipulation. **Do NOT report 8/10+, Witcher quality or 'finished mother'.** This remains an art-process baseline, not a character to replace an already working NPC.

## Rebuild after source inspection

```powershell
cd <HOREB_3D_REPO_PROJECT_DIR>
$env:BLENDER_USER_RESOURCES='H:\HOREB_ArtPipeline\blender-user'
$env:HOREB_ART_PIPELINE_ROOT="$PWD\art-lab\mother-w19"
& 'H:\HOREB_ArtPipeline\tools\blender-4.5.16-windows-x64\blender.exe' --background --python art-lab\mother-w19\source\build_mother_lookdev_w19e.py
Copy-Item art-lab\mother-w19\export\horeb_mother_lookdev_w19e.glb public\artlab\horeb_mother_lookdev_w19e.glb
# IMPORTANT: update GLB/BLEND SHA-256 sidecars after each rebuild
node tests\verify-mother-w19.mjs
```

The official extension used during authoring is MPFB 2.0.18 from [Blender extensions](https://extensions.blender.org/add-ons/mpfb/) with official extension ZIP SHA-256 `c075b3e9b94b8e5556a5f03f4653602d02ea306de08126e8f55ed6dee28a2dad`. The MPFB source license is GPL3; the separate **CC0** mesh assets are packaged, and its GPL software is **not** embedded into the GLB or game. Verify independent asset licenses before publishing any additional third-party artwork.

## Local W18 → W19 comparison

On the authorized Windows computer:

- W18 baseline: `http://127.0.0.1:5192/actorlab.html`
- W19E **ART HOLD**: `http://127.0.0.1:5192/actorlab-w19e.html`

Use `node tests/browser-mother-w19e.cjs` with the local dev server + actual Chrome for desktop/mobile screenshot and interaction tests. `tests/verify-mother-w19.mjs` guards real GLB skin, 53 joints, clips, exported face mesh not contaminated with extra helpers, embedded image maps, source provenance, hashes and exact cloth MD5. Tests do **not** prove facial quality or historical authenticity.

## Next W20: meaningful art only

Require (1) proper face topology/eyes/lips with a credible likeness-neutral adult character, (2) eyelids and emotionally appropriate facial animation with retained blendshapes **without reintroducing helper faces**, (3) artist-designed fitted full-length linen with convincing shoulder sleeves, hem and folds, (4) hair/head covering that is physically compatible with rig and documented as artistic reconstruction, (5) actual hands touching/holding the basket. Demand paired 1440/390 frames in **identical camera/light** and evaluate artistic credibility independently. Only after ART is accepted should one mother NPC replace a currently working W15 placeholder, with further live browser and hardware FPS gates. Leave all biblical, rights, Product, Research, merge, deployment and public-release gates closed.


## W19H â€” controlled face-material correction (22 Nov 2026)

W19E screenshots had severe eye/mouth artifacts. W19F removing eyebrow/lash meshes did not help; W19G showed the untextured bare basemesh was anatomically intact. W19H keeps the 53-bone original MPFB actor and both skeletal clips, replaces the problematic color texture with a reproducibly muted derivative of the official CC0 skin diffuse, and scales/recesses the CC0 low-poly eye geometry. The skin is NOT premium photoreal, and the eyes are still flat; source skin color is illustrative, never an attested ancient identity.

Separate native Blender scene and scripted rebuild are in source, together with the adapted CC0 PNG. The W19E version is NOT replaced. The preview actorlab-w19h.html is independent; its browser test ran 1440x900 and emulated 390x844 with 53 bones, 6 skinned meshes, two clips, no page errors or horizontal overflow. Native screenshots live only on the authorized Windows computer under HOREB_ArtPipeline/evidence/w19h-mother-*.png. Binary integrity and CC0 provenance are checked through verify-mother-w19h.mjs and SHA sidecars.

**ART HOLD**: skin appears too smooth, eyes remain incomplete, hair absent, draping sleeves stiff, no facial blendshapes or real hand-to-basket manipulation. Do not transfer this asset to W15, main, Product or Research. Do not merge/deploy.
