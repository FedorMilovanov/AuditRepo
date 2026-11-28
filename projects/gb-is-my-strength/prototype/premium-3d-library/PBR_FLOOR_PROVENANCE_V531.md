# PBR floor material — V5.31 source and acceptance

**Status:** engineered PBR material, source-verified, hardware-Chromium preview and quality transitions passed; **not artistic signoff**. Current exact-head GitHub CI and WebKit evidence must be checked separately before treating any PR revision as accepted. Preserve Draft / ART HOLD and do not deploy to Product.

## Publisher and license

- **Publisher:** [ambientCG](https://ambientcg.com/view?id=Tiles078), material **Tiles 078**, released 2020-11-08, **CC0 1.0** (public domain).
- Original downloaded package: `Tiles078_1K-JPG.zip`, valid archive. Its SHA-256, the three source channel hashes and six derived channel hashes are recorded in [source-owned manifest](src/assets/pbr/floor-tiles078-manifest.json). Original ZIP remains in the private temporary art sandbox and is not required by the browser or stored in this repository.
- Original components: color (sRGB), OpenGL +Y normal (linear), roughness (linear). No fake metallic/displacement maps, no material download at runtime from a remote CDN.

## Authored adaptation

- Source material was highly polished. To create a **honed, pedestrian library floor**, roughness pixels were deliberately remapped from publisher channel brightness `p` (0–255) to `min(255, 174 + floor(p * 0.22))`, not passed off as an unmodified scan. All other source map channels are unchanged except WebP compression and 512px downsampling.
- `Platform.tsx` uses three real texture channels via R3F `useLoader(THREE.TextureLoader, paths)` in an isolated Suspense material boundary. The neutral fallback occupies the same real floor mesh until material load. Synchronized 16×16 UV repetition spans the 32m stone floor. No geometry, camera, navigation or catalog/Reader content changes.
- The 1024px high preset (color WebP, lossless-normal WebP, remapped roughness WebP) and 512px low preset are chosen **by actual graphics quality**. Vite inlines the two very small 512px normal/roughness maps into the JS; this is valid packaging, not a skipped PBR channel. High preset transfers three independent WebP requests; low preset one albedo WebP request plus two inline maps.
- Color: `THREE.SRGBColorSpace`. Normal/roughness: `THREE.NoColorSpace`. Normal intensity: 0.24; roughness multiplier: 0.98; metalness: 0. Cached texture loader avoids per-toggle network and manually disposing shared cache objects.

## Size and test evidence

- **All six sources:** ~566 KB binary output total, verified per-file by static Node SHA-256 / WebP signature test. High preset ~527 KB; low preset ~38.5 KB before Vite inlining.
- The older dynamic Canvas floor allocated a new 2048×2048/1024×1024 RGBA map on quality switches. New material uses 3×1024 / 3×512 maps; theoretical decoded RGBA textures occupy about 12 MiB (high) or 3 MiB (low) before mipmaps and driver overhead. **These are estimates, not measured GPU VRAM.**
- Local Windows 11 **Chrome / NVIDIA RTX 3060 Direct3D11**: 1440×900 and touch-emulated 390×844 real WebGL2 renders and PNGs passed; 0 JS errors/HTTP errors/overflow; all 3 high channels confirmed HTTP 200, low color loaded HTTP 200, and the low encoded channels passed the static SHA-256 check.
- The existing **two-direction graphics quality contract** passed at 1440×900 and 390×844 without replacing WebGL canvas or leaving the transition cover visible.
- Stronger `tests/architectural-art-browser.py` now verifies correct PBR albedo/profile in Chromium and WebKit in addition to oak/limestone. **Exact-head 47/47 Validate remains required after any merge/rebase and on the final commit.**

## Art hold / next material gates

- Fixed-camera side-by-side images show a warmer and more detailed floor; nonetheless the hall's photorealistic artistic quality, authored furniture, subtle stone/wood junctions and approved historical reading-room design are still incomplete.
- No Poly Haven encyclopedia GLB was added: the earlier 67k-triangle decorative set was tiny in the actual Gill shelf view relative to its GPU/texture cost. Its source/CC0 investigation remains in `ART_ASSET_EVALUATION_V530.md` for use only as a close-range curated reference object if reapproved.
- No public product promotion until owner visual approval, actual physical iOS/Android/XR and sustained GPU/thermal evidence, source-owned Reader/routes and rights gates.
