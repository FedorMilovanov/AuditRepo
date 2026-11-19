# V5.32 — direction-aware bookcase carpentry, PBR source and release gates

**Laboratory prototype, not artistic approval.** The sole existing Draft PR #545 in AuditRepo remains LAB / ART HOLD, with no Product, main, public deployment or Reader writes. Confirm current exact HEAD and CI before relying on claims below.

## Source and design scope

- [ambientCG Wood 049](https://ambientcg.com/view?id=Wood049), source material CC0 1.0; author/publisher provenance and original ZIP, channel and derivative SHA-256 are included in [`src/assets/pbr/wood049-manifest.json`](src/assets/pbr/wood049-manifest.json). The publisher names this asset **Wood 049**, not a verified botanical oak species. Use it as a decorative timber appearance; do not claim verified historical species or sourced theological book titles.
- Verified official `Wood049_1K-JPG.zip` archive, source Color/NormalGL/Roughness maps. The browser never requests an external texture CDN.
- Optimized three-channel high `1024px` preset: **399,138 bytes**; three-channel light `512px` preset: **91,514 bytes**. **490,652 bytes total**. All six browser files signed individually with SHA-256 and WebP RIFF headers; binary output derived from genuine publisher source.
- Color map is `THREE.SRGBColorSpace`; normal/roughness are `THREE.NoColorSpace`. All 3 channels use the same repeating UVs. PBR color tint/roughness adjustment was authored to fit the reading-room cabinetry; source scan not passed off as unaltered.

## No global wood hacks

- New `src/scene/CaseworkWood.tsx` owns the one shared R3F-loaded PBR material for exterior bookcases and the four reference alcoves, with proper React texture cache, material disposal and quality-specific lazy channel loading. On first load and preset switch a Suspense boundary renders real existing casework, not a fake placeholder screenshot.
- Casework is **separate** from `Platform.wood` and all original central furniture: `ArchitecturalPolish.tsx` keeps the previous oak map and normal assigned to the original shared furniture material.
- A real **two-orientation UV design** replaces the incorrect single batch: horizontal planks use original box UVs for longitudinal grain; upright pilasters and full-height back panels use a shared vertical-grain box geometry whose UVs are rotated 90 degrees (u,v) → (v,1-u). Both groups use the **same** one 3-channel PBR material. Repeated details remain instanced and position/collision/navigation unchanged.
- Geometry: unchanged 20 outer bays, 13 shelved bays, 12 shelf rows and 5,928 deterministic decorative folios. This scope does not author or authenticate actual books, nor replace the centre's lectern.

## Evidence and cost

- Isolated Windows 11 NVIDIA RTX 3060 Chrome with production Vite preview: actual high-profile 1440×900 three `wood049-1024` HTTP 200 URLs and low-profile 390×844 three `wood049-512` HTTP 200 URLs, WebGL2, genuine PNG, 0 page errors / HTTP errors / horizontal overflow.
- Original strict **bidirectional** graphics-quality browser test passed in both viewports; old canvas retained, cover painted and dismissed, and settled frames confirmed. Material loading was not bypassed or injected.
- Static `lab:check` owns manifest, source identity/license, six file names/sizes/SHA-256/format, colour-space and UV-rotation contract, React ownership, independent furniture PBR, material size ceiling.
- The new split creates one additional instanced draw per shelved bay plus a vertical joinery instance in each two architectural trim groups (about **15 extra draw calls by structure**, *not* an instrumented GPU measurement). No per-book shader or external GLB prop added. Real sustained draw-call/VRAM/frame-time baseline comparisons remain required.
- A/B 1440×900 hall and close-up at a station show more natural walnut-looking grain; at the full hall distance the improvement is deliberately subtle. No attempt to claim final photorealism or historical authenticity.

## Release gates

1. This code/assets/test revision must reach **Preflight SUCCESS and exact-head 47/47 browser PASS** on GitHub Chromium + WebKit; otherwise do not mark it accepted.
2. Review CI's actual desktop/mobile/landscape PNGs. Check no signage occlusion, material pink/black surfaces, wrong grain direction, lost WebGL recovery or portrait clipping.
3. Separate artistic signoff: architectural cabinetry style, furnishings and light still need genuinely authored cohesive art with sufficient detail.
4. Physical iOS Safari/Android, long-running GPU thermal/VRAM, XR, accessible tech and Product-owned Reader/rights remain **HARD OPEN**.
