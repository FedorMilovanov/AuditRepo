# W12C.2 — physical cloth drape and floor weave (detached)

## Observed blocker (real Chromium W12B.1)
The side and rear fabrics rendered as near-solid flat beige slabs; the main family shelter interior was dominated by a perfectly rectangular dark brown floor mat. A plain material tint would not restore real geometric detail. Evidence: `horeb-chromium-witness-44244095919`, homestead walk interior and 390px frame. This is an **art direction issue**, not a claim that fabrics existed at the unlocated Midian episode.

## Small, reversible engineering slice
- Rear wall becomes a finite segmented `PlaneGeometry(5.92,1.46,28,14)`, with tiny irregular Z folds inside the existing true rear-wall walk collision (±0.18 m), vertex gradients, normals, and double-sided fabric shadows.
- Previously flat mat becomes 28×20 subdivided ground-hugging fabric with subtle, actual height relief, woven cross-tone and a restrained border. Avoid transparent floors and speculative furnishings.
- Roof and side drapes gain bounded subdivisions and less repetitive vertex shade and yarn direction. No new textures, shader runtime cost, imported assets, separate objects or invented historical specifics.
- Browser verifies the **actual indexed triangle counts** of the new rear cloth and mat (784 / 1120), not just constant labels; two source checks cap the detail.
- Keep the same frame controller, real open entry, strict A-frame collision footprint and scene dispose. No changes to Nile, well, Horeb world, historical timeline, 42 dossier registry, or Research.

## Mandatory gates
Exact commit HOREB QA 6/6 + Validate + Preflight. Real W12C.2 desktop / walk / interior / mobile PNG should demonstrate distinct textile folds in SW SwiftShader, without visible tears, severe z-fighting or silhouette breaks. SwiftShader screenshots do **not** prove visual quality on real mobile GPU. ART/Research/geographical provenance, human/animal reconstructions, audio, rights, deploy/merge remain **HOLD**.

## State
Detached candidate based on W12C.1 `9198082e`; **not** pushed before W12C.1 independent terminal CI. No force push or new branch. Protect local Windows W10D `NilePrelude.ts`.
