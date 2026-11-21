# W13A · Ecology-led nature, staged visual candidate

## Brief
User's reference to The Witcher means high-quality multi-scale environmental storytelling (atmosphere, landscape depth, natural clusters and interaction), NOT reproducing assets, creatures, geography, period claims or fantasy. The actual original W12E.5 Midian PNG #14618415326 displays a flat beige ground, repetitive low-poly bushes, sparse gravel, smooth artificial distant massifs and simplistic lighting. This first wave does NOT claim Witcher-level visual fidelity.

## Actual implementation scope
- A pure `MidianBiome.ts` provides a winding **dry** wadi influence, scree exposure and low-frequency grain. Same habitat influences existing ground vertex colors and the position/size of existing shrub instance types.
- Shrubs: 124 deterministic seeds, independent source preflight 121 valid/49 close to dry wash; previously 76 seeds were distributed annularly. Twig and leaf draw calls remain 2; no historically identified species or implausibly lush forest.
- Pebbles: 440 seeds, independent preflight 419 accepted; a **single Octahedron InstancedMesh** with 8 triangles each (~3352 tris total) adds the third scale of mineral detail, all vertices placed on exact `midianGround`, never creating physical blockers or invading the protected approach. One new draw call and one small shared material/geometry; not zero GPU cost.
- Existing 92×100 ground vertex geometry, `midianGround` height physics, 94 larger stone positions/colliders, wells/trough, camera, narrative, other worlds and 42 dossiers are unchanged. No images/textures downloaded or provenance asserted.

## Exact acceptance
**Stage only** until parent W12F.1 `39177f9` finishes independent 6/6 HOREB QA, Validate/Preflight and screenshot audit. Then separate fast-forward W13A on the SAME branch/PR, its own source test (expected 163/163 total), 198/198 geometry, 8/8 placement, full browser and 4 walking groups, Validate/Preflight. Compare original midian-shot-desktop, midian-walk-desktop, midian-walk-mobile390 against W12F.1 before ART PASS; reject patterns resembling a painted road, noisy static pebbles, artificial repetitive flora, unnatural bright colors, obstruction, shadow artifacts or poor view framing.

## Next genuinely interactive step
Proximity-based field observation tied to real well/trough/shelter locations; separate **scriptural facts vs illustrative reconstruction**; no made-up Bible dialogue, no divine figure, and persistent mastery + accessible reading-mode equivalent. The existing lesson journal is not a proxy for actual spatial interaction. This is a distinct follow-up milestone, not secretly included here.

All historical rights/Research, real Android/iOS GPU, complete high-end ART, people/animals, voice and release remain HOLD. Preserve sole Draft PR #543 and lane branch, main/Product/Research/dirty Windows W10D, no new branch/force push/merge/deploy.
