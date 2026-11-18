# W12D.3.1 — material art-acceptance correction

## Actual W12D.3 evidence
Full exact-SHA [HOREB QA #44316011221](https://github.com/FedorMilovanov/AuditRepo/actions/runs/44316011221) completed 6/6 SUCCESS (plus Validate and Preflight). Four real PNG witnesses have been downloaded and compared with W12D.2. All fabric meshes bind the shared texture correctly and the physical doorway and 390px view remain unchanged. **However**, the interior closeup shows regular strong crosshatched squares on the sloping gable, walls and floor mat; this reads as *graph paper/checkerboard*, not naturally irregular cloth. A software/CI pass is therefore not ART PASS for the material.

## Targeted correction
- Keep single seamless 128x128 texture, existing UV for rear gable, nine map+bump bindings and explicit texture disposal on WebGL exit.
- Reduce alternating cross-cell term from .029 to .004; lower horizontal/vertical yarn contrast .047/.054 to .027/.017 and lift base exposure of this small map from .908 to .946. Vertical fibres become dominant and crosshatch should recede rather than form large diamond grids.
- Reduce repetition from 8×5 to 6×4 and bump intensity .014 to .007. No new texture, draw call, object, asset or citation.
- Update bounded, deterministic test to check perceptible but restrained local dynamic range (.025..10) and add a maximum adjacent-texel contrast test <.055, plus unchanged tile-periodicity checks. Previous physical, mobile, 42 dossiers, full pedestrian, screenshot, WebGL cleanup and memory gates remain active.
- Isolated to `engine/MidianHomestead.ts`, `tests/run.mjs` and this record. Existing browser gate `wovenTexturePixels===16384`, `bound===9`, and bump >.005/<.03 still applies.

## Release gates
This candidate is NOT pushed until W12D.3 full 6/6 exact-SHA and real PNG inspection, both now done. When pushed, rerun independent 6/6 exact-SHA, Validate, Preflight and compare actual interior/desktop/390px PNG before granting even local material ART approval. Global historic, mobile GPU hardware, Research rights, humans/animals, voices and release remain HOLD. Do not touch user local unfinished Windows `NilePrelude.ts`, or merge PR #543.
