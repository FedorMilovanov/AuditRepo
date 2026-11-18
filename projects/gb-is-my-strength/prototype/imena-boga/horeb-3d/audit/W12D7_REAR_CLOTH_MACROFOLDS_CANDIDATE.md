# W12D.7 — staged wider physical folds in the existing rear fabric

## Grounded visual defect
After W12D.6 `dd90c52` 6/6 QA and direct 1024×768 interior PNG comparison with W12D.5.1, the small yarn pattern is calmer but the large rear curtain remains uniformly planar. More contrast or a larger pixel texture does not create a convincing large-scale textile. Earlier front doorway, curved roof edge and sewn gable were already checked and MUST remain unchanged.

## Candidate-only bounded change
- Use the **existing rear 28×14 PlaneGeometry** and the same shared `woven` material, shadow flags, coordinates, indexed faces, UVs, gable overlap, collision envelope and centre entrance.
- Replace rear Z-offset with **one exported deterministic smooth three-band drape function** `homesteadRearDrapeOffset(x,v)`: calculated sample range between -.055m and +.145m relative to `z=-2.97`; adjacent 5cm horizontal segments change less than 2.8cm; no higher-frequency mesh, assets, draw calls, additional light or historical claim.
- Shift existing vertex colours in phase with larger 3D folds, so lighting reads some volume without exaggerated stripes. Roof/gable and baskets remain exactly unchanged.

## Mandatory checks before branch publication
This is a detached candidate on top of the accepted W12D.6 `dd90c52`; independent Windows sparse checkout / new exact SHA source test + build + real Chrome CPU comparison at same 1024×768 interior and 390×844 mobile is required. Reject if gable overlap breaks, cloth intersects support posts, folds look unnaturally deep, rear plane appears pleated uniformly, passage narrows, or mobile is degraded. One CI job cannot establish artistic quality: need independent 6/6 HOREB QA, Validate, Preflight and new PNG review after publication. **General Midian ART remains HOLD; real Android/iOS GPU, people/herds, Research/rights/voice and release also HOLD.** No new branch, force push, main/Research/Product changes or local Windows W10D edits.

## Narrow safety reinforcement before publication
The new source test explicitly converts every sampled drape offset to world `z`, and rejects any rear-cloth vertex at or behind the closing gable (requires >30mm clearance) or outside the already-physical 180mm rear-wall collision margin. The actual independent local Chrome/SwiftShader build at 1024×768 and mobile 390×844 loaded the household chapter, traversed the original open doorway to the backcloth and returned without JS errors. The tested source passed `152/152` source, `198/198` geometry and `8/8` placement, `npm run build` and `tsc --noEmit`. The final new geometric guard is an additional pure source assertion with no runtime geometry change. Final exact-SHA independent GitHub 6/6 QA and new screenshots are still required; only the broader visible fold depth, not a whole-world art pass, is under consideration.
