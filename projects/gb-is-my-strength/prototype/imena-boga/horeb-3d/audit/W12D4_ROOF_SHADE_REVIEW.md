# W12D.4 — keep roof shadow casting while reducing inside self-shadow darkness

## Specific evidence
W12D.3.1 exactly passed all six HOREB QA jobs and Validate/Preflight: https://github.com/FedorMilovanov/AuditRepo/actions/runs/44319174711 . We retrieved actual Chromium desktop, mobile390 and interior screenshots and compared the latter with W12D.3. The high-contrast checkerboard cloth texture was markedly softened; the roof's **underside** remained nearly black and tonally detached from the illuminated rear gable and entry, limiting spatial readability. No roof tears or new mobile crop were detected.

## Bounded light/shadow correction, no speculative props
- The two actual double-sided roof meshes **still cast** real shadows onto the walls and woven ground mat. Stop the roof from **receiving its own** GPU shadow map (a thin, two-sided sheet self-darkening from below). Side walls, back drape, gable and ground retain their existing receiveShadow flags.
- Add exactly one deliberately weak shadow-free directional fill (`0xffdfbe`, intensity `0.50`, from the sandy-ground side). It approximates indirect warm ground light, not a second fictional sun, fire, or a historically claimed lighting device. Retain the strong actual sun, same sky, climate, geometry, material, player collision and camera.
- 1 new simple source contract checks bounded light intensity; actual browser counts exactly two roof shadow casters, ZERO roof self-receivers, and one non-shadow sand bounce light, while preserving every earlier 3D mesh, texture, touch/keyboard and teardown witness.
- No extra shadow maps; one extra non-shadow directional contribution per material, so re-evaluate the mobile and SwiftShader effect. The exact GPU performance of physical Android/iOS devices remains separately HOLD.

## Acceptance
This is a visually motivated candidate, NOT historic certainty about Midianite tents. Require new exact-SHA 6/6 HOREB QA, Validate, Preflight and a *visually comparable* interior/desktop/mobile390 PNG set. Explicitly reject washed-out shadows or obviously glowing fabric after visual inspection. No audio, characters, animals, archaeology claims, Research/rights or deployment. Keep PR #543 Draft, no new branches or force push, do not merge main or alter unfinished local Windows W10D `NilePrelude.ts`.
