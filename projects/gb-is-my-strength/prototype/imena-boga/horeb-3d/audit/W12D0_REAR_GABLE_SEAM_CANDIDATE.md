# W12D.0 — actual rear gable daylight seam (DETACHED)

## Exact visual evidence
The final `homestead-walk-interior.png` from W12C.3 (`horeb-chromium-witness-44289783785`) shows clear LIGHT/WHITE triangular breaches immediately left and right of the upper rear ridge. The old rear gable was one straight-faced triangle, while the real 36×22 canopy mesh has a curved and rippled edge. Prior unit/browser tests counted exactly one gable but never checked that its actual outline matched the roof. Therefore a six-green CI did NOT certify visual watertightness.

## Physical correction scoped to only Midian homestead
- Expose `homesteadRoofBackHeight(x)` as the same real canopy end-row height function (z=-2.95, v=0, including the 32/17-frequency ripple). Derive `homesteadRearGableTop(x)` from it with a 55 mm overlap, ensuring the rear cloth intercepts light through the previous cracks.
- Replace the single triangle with a 48-segment indexed upper-back fabric mesh (96 actual triangles), with a lower edge overlapping the real drape while positioned at z=-3.065 behind its deepest z=-3.04 folds, avoiding self-intersection and z-fighting. Keep original roof geometry, front open portal and physical collision exactly as-is.
- Make material hue consistent with existing rear textile and add subtle deterministic vertex colours, not an arbitrary dark patch or CSS overlay.
- Node checks 97 sample points across full rear roof edge and proves the gable is behind all existing back-panel folds. Puppeteer checks 96 actual indexed triangles and 1 actual rear-gable mesh, retaining all existing walking, focus, mobile, 42 dossier and cleanup gates.

## Required acceptance
Do not publish this detached commit until current W12C.4 exact-SHA 6/6 QA and Validate/Preflight are terminal-green. Then stage it in the same Draft PR with fast-forward expected-head safety, rerun all six independent jobs on exact SHA and inspect the actual `homestead-walk-interior.png`. A decrease of bright triangular gaps without new detached seams is the ART gate for this single fix. Software SwiftShader witnesses are not physical Android/iOS GPU acceptance.

## Documentary uncertainty
As Ex. 2:18–21 does not establish the historic household plan, this roof is an artist-authored conjectural arrangement. This fix makes the already chosen hypothetical geometry coherent; it is **not** archaeological proof of a Midianite tent.

No new branch, no force-push, no main merge/deployment/Research edits. Keep local Windows W10D `NilePrelude.ts` untouched. Human/animal art, voices, rights, site identification and total ART remain HOLD.
