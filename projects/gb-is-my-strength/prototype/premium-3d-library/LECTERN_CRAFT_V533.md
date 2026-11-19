# V5.33 — central reading-table craft and visual acceptance

**Status:** sole author-owned Draft PR #545, no production deployment, Product or main writes. All A/B comparisons are *real Chrome screenshots* on an isolated RTX 3060 / Direct3D11 with matching 1440×900 camera, viewport, browser and graphics preset. Content, original Russian pages, Reader URLs, navigation and editorial IDs are unchanged.

## Actual defect

The former `Center.tsx` placed a `torusGeometry` radius 2.10m around the table **without rotation**. Three.js torus defaults to the XY plane; this produced an accidental **vertical metal hoop 4.2m in diameter** around the central book rather than an edge inlay. The original screenshots demonstrate this intrusive vertical arch.

V5.33 places the brass rim on the **horizontal tabletop** at y=1.605m using `rotation-x={Math.PI / 2}`, with a physically fine tubular radius of 9mm and major radius 2.104m. The giant decorative ring no longer intersects the main sightline.

## Authored architecture, no fake props

- One solid `THREE.LatheGeometry` lectern pedestal with a genuine multi-point carved profile from y=0.26m to 1.49m, resting on the existing stone plinth (top 0.24m). The tapered shaft has 24 shallow sinusoidal flutes (max relief 1.5cm), physically faded into base and capital. Recalculate real vertex normals and bounding sphere. This replaces an oversized unprofiled cylinder rather than adding per-flute meshes.
- One 128-segment lathed hardwood table with bevels and real underside moulding replaces the flat cylindrical tabletop. The book's world transform, physical support members and Russian pages are unchanged.
- Both geometries are disposed on unmount, React hooks are imported explicitly and the shared original `wood` material is retained. No extra GLB, textures, runtime requests or dependencies. The change adds triangles to only two authored static meshes, not 5,928 repeated folios.

## Verified local witnesses

- Side-by-side original V5.32 and V5.33 at an **identical NVIDIA GPU and camera** (both 1440×900 and portrait 390×844), with central sightline close-ups; giant hoop removed, book still on table and titles readable.
- Windows 11 / Chrome RTX 3060: actual production Vite build and TypeScript PASS; WebGL2, no JS/HTTP faults, no body overflow at 1440×900 and mobile-emulated 390×844. Real PNGs saved from production builds, not generated or faked.
- Mandatory quality transition both ways PASS at both viewport widths, old canvas identity preserved, cover removed and 2 settled frames; original hardware WebGL loss→restoration PASS and WebGL-less 2D cabinet fallback PASS.
- `scripts/verify-architecture.cjs` now requires lathed pedestal/table, normal recalculation, geometry disposal and horizontal gold rim and rejects old cylinders. A *negative fixture* removed rim rotation, yielded actual script FAIL, then original source restored and PASS.
- Existing source PBR/wood signature tests, catalog, cabinet, progression and cabinet type tests PASS.

## Still HARD OPEN

The new exact-head GitHub CI must independently reach **Preflight SUCCESS + 47/47 Validate SUCCESS** including WebKit; the prior V5.32 success is not proof for V5.33. Review actual current CI PNGs after completion. Benches, stone/wood joints, historical furnishing style, lighting, real-device Safari/Android/XR and sustained VRAM/thermal plus Product rights/Reader remain unaccepted. Keep Draft / ART HOLD, no merge/deployment.
