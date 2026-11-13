# Premium 3D Library — V5.2 architectural materials and craftsmanship

**Status: LAB / ART HOLD.** This is an incremental 3D material and architectural-detail candidate, **not** a photorealistic accepted product or live deployment. Parent remote PR #545 branch commit at start: `4a0f4504f4f0b414c5175cac0a0216b272d54f33`.

## Source-owned changes

- Four **original** local material tiles: limestone and oak colour/albedo (`.webp`) plus tangent-space normal maps (`.png`), all 768×768. Nothing fetched from third-party photo repositories at runtime.
- `scripts/generate-architecture-materials.py`: source generator, `NumPy` and `Pillow` are **authoring only**, not shipped browser dependencies.
- `src/scene/ArchitecturalPolish.tsx`: shared PBR material configuration, instanced timber casework and stone detailing, recessed window reveals and arches, subtle ceiling trim. Existing content IDs, map entries and navigation positions are unchanged.
- `World.tsx` mounts the detail pass; `Vault.tsx` uses the textured limestone vault material. No UI/Reader/level/account changes.

## Clean independent acceptance

- Fresh isolated clone of the **same PR #545 branch**, no additional branch or Product changes.
- `npm.cmd ci --no-audit --no-fund`: PASS (198 packages).
- Five existing lab checks (`lab:check`, `lab:catalog:test`, `lab:cabinet:test`, `lab:progression:test`, `lab:cabinet:types`): PASS; full `npx.cmd tsc --noEmit`: PASS; `npm.cmd run build`: PASS (Vite 7.3.2, 947 modules).
- `python tests/architectural-art-browser.py` against HTTP-served `dist`: **4/4 PASS** — Chromium and WebKit at 1440×900 and mobile-emulated 390×844. 3D hall loads, WebGL2 context exists, three local PBR resources are observed, zero HTTP 4xx/JS page errors, zero document horizontal overflow.
- Four actual rendered screenshots are in `evidence/art-v52/`. They are **not** generated concept images. Windows RTX 3060; mobile size is emulated on a desktop GPU.
- Initial transfer observed on HTTP-served build: Chrome 3,030,880 bytes; WebKit 3,017,227 bytes. Baseline V5 Chrome initial transfer was about 2,145,423 bytes. This additional ~0.89 MB is a real cost; mobile GPU/performance still needs independent acceptance.
- A separate preliminary rAF witness on the art working copy with RTX 3060 observed ~60 rAF/s, p95 interval ~16.8 ms at desktop/mobile-emulated sizes; **not** GPU frame-time or a real-mobile FPS guarantee.

## Pixel reproducibility versus byte reproducibility

- The authored RGB pixels of the two normal maps compare **identically** between Linux-prepared and Windows-regenerated files (mean absolute pixel difference 0). Colour WebP file bytes also match.
- PNG encoder output differs byte-for-byte across the authoring platforms despite identical decoded RGB pixels. Regeneration on one pinned Windows toolchain is byte-stable. The **committed PNG** is the verified asset snapshot; manifest SHA-256 must validate that snapshot, not a silently re-encoded file.

## Hard remaining art gates

1. The scene remains visibly **procedural and low-detail** in the real screenshots. PBR and casework improve craft, but cannot substitute for architect-authored GLB furniture, a coherent architectural kit, and professionally lit material references.
2. Establish measured draw calls, GPU frame times, memory/texture pressure, context-loss recovery and WebKit/low-tier *real* phone performance. Optional KTX2 normal maps and measured quality scaling are future experiments, not unverified optimizations.
3. Side-by-side owner approval at identical angles/lighting for desktop and mobile, including floor/camera/ceiling balance. No forced migration to WebGPU or new user-facing features.
4. The concurrent mobile HUD changes remain separate; they must pass their own screenshot and manifest checks. This art PR scope does not claim to have fixed them.
5. Product `GBReaderLibrary V3`, GBSearch, routes, source rights, content approvals and live release are untouched and require separate owner-approved transfer.

## Git index normalization

The scoped `V52_ART_MANIFEST.json` hashes **canonical staged Git blob bytes**, not platform-specific CRLF working-tree checkouts. The original V5 source manifest remains unchanged as baseline evidence.
## V5.5 — lossless normal maps and scoped retest (2026-11-09)

This is a transport-only follow-up to the V5.2 art candidate, not a visual redesign or Product promotion. The original committed normal PNG snapshots remain available in Git at `66301f61b042e4c58c322bb42da7950fa39a0b0b`; the current candidate replaces them with **lossless WebP**. No files were fetched from external image collections.

| 768×768 tangent normal | V5.2 PNG | V5.5 lossless WebP | Saving |
| --- | ---: | ---: | ---: |
| Limestone | 448,030 B | 337,436 B | 110,594 B |
| Oak | 424,125 B | 381,692 B | 42,433 B |
| **Total** | **872,155 B** | **719,128 B** | **153,027 B (17.55%)** |

- Both decoded RGB normal maps match the prior PNG **exactly pixel by pixel** (zero changed pixels); albedo maps, material tuning, mesh coordinates and scene composition are unchanged.
- The checked-in generator now writes lossless WebP. Regenerating **all four** colour/normal assets on the authorized Windows tooling produced pixel-**and byte-identical** results.
- Chrome startup transfer on the isolated local HTTP build went from **3,035,131 B to 2,882,106 B** (−153,025 B, about −5.04%); the 2 B delta relative to source asset savings is small build/transport variation. This is not a real-world network-speed or GPU-memory benchmark.
- Standalone Vite production build, strict TypeScript, five lab checks: **PASS**. Source-level browser art witness: **4/4 PASS** in Chromium and WebKit at 1440×900 and touch-emulated 390×844, including required local PBR assets, WebGL2, no JS/HTTP errors or horizontal overflow.
- `GB_LIBRARY_ART_EVIDENCE_DIR` lets a new QA run save screenshots **outside** the historical V5.2 evidence directory; that directory remains a frozen record.
- This is a smaller **network payload**, not evidence of faster material decode, lower decompressed GPU VRAM, improved WebKit frame time, or owner acceptance. **LAB / ART HOLD continues**.
## V5.6 — one reference joinery bay (2026-11-09)

**LAB / ART HOLD.** This is one deliberately scoped experiment in architectural
craftsmanship, not a hall-wide style approval, GLB replacement or public release.

### Source and physical constraints

- Keep all visitor routes, navigation data, cabinet/catalogue, item transforms,
  WebXR paths, textures and scene lighting unchanged.
- A single **bay 5 (90°)** beside the window arcade receives a profiled stone
  arch, structural pilasters with plinths/imposts, timber shelf nosings,
  stepped cornice, recessed cabinet-panel detailing and small metalwork.
- The parts are original deterministic geometry in
  `src/scene/ArchitecturalPolish.tsx` rather than ad hoc meshes at individual
  editorial stations. The `ReferenceBay` component is parameterized by bay;
  **do not clone the effect across all bays** until visual/GPU acceptance.
- A unit BoxGeometry buffer is shared by the existing global trims and all
  three reference-bay instanced groups. Narrow brass details do not cast
  separate GPU shadow passes; larger stone/timber trim retains cast shadows.
- Every new component remains outside the 14.5m colonnade boundary.
  No interaction raycast registration or collision/teleport data is changed.

### Real screenshots and non-acceptance

The same **public sitemap «Подойти» action** positioned the camera in
both builds. Screenshots are original browser renders encoded as
**lossless WebP** (decoded RGB unchanged; no AI-generated scene substitute):

- **Before (V5.5)** — [Chrome, Confessions, 1440×900](evidence/reference-v56-before-creeds-chromium-1440x900.webp)
- **After (V5.6)** — [Chrome, Confessions, 1440×900](evidence/reference-v56-after-creeds-chromium-1440x900.webp)
- **After (V5.6)** — [Chrome touch emulation, 390×844](evidence/reference-v56-after-creeds-chromium-390x844.webp)
- **After (V5.6)** — [WebKit touch emulation, 390×844](evidence/reference-v56-after-creeds-webkit-390x844.webp)

The added trim is **visible but modest**. It does not make the full
rotunda photographic. The original concept
`reference/library-design-target.png` remains a higher-quality design
target, not a screenshot or a promise of matching fidelity.

### Exact-machine costs

At Windows / RTX 3060 / Chrome channel / DPR 1, identical build/start
and rAF sampling method, comparison against base PR #545 commit
`79a920ce537e06f69387141a7335e48e9228dd1b`:

| Engine, 1× DPR | Baseline draws/frame | V5.6 draws/frame | rAF/s baseline → V5.6 |
| --- | ---: | ---: | ---: |
| Chrome 1440×900 | 241.1 | 247.2 (+2.5%) | 60.0 → 60.0 |
| Chrome touch-emulated 390×844 | 126.6 | 126.6 | 60.0 → 60.0 |
| WebKit 1440×900 | 242.4 | 248.5 (+2.5%) | 28.9 → 28.5 |
| WebKit touch-emulated 390×844 | 126.6 | 126.6 | 61.3 → 61.3 |

Chrome initial transfer 2,882,106 → 2,883,572 bytes (+1,466).
WebKit desktop remains a hard performance gate; browser rAF is not GPU
frame timing and WebKit on Windows is **not a physical iPhone benchmark**.
A change of <1 rAF/s here is measurement noise, not evidence of a speedup.

### Technical acceptance versus product/art acceptance

- Full `tsc --noEmit` and Vite production build passed; five existing
  lab checks passed.
- `tests/reference-bay-browser.py` records the real public navigation
  paths at Confessions and the neighboring series: **5/5** Chrome/WebKit
  desktop/mobile captures with no JS/HTTP errors or overflow.
- Existing art, mobile HUD and manifest regression suites remain
  separate gates, tested on the exact candidate before promotion.
- **Still open**: authored architectural GLB kit, professional lighting/
  photogrammetric material reference, genuine mobile GPU and VR testing,
  full GPU memory/texture-pressure and WebGL loss/recovery, accessibility,
  editorial/Product admission and owner approval at matched angles.
- Do not merge this LAB into Product/main or call it production-ready.
