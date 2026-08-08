# Hall v3 Camera Approval candidate evidence — verified

Lane: `TLP-HALL-001` / Product #369

This record closes the bounded **H3 Camera Approval candidate-authoring/evidence** wave only. It does not approve a camera rig and it does not advance the Hall machine gate.

## Product source result

- Product PR: #382 — `architecture(hall): author H3 Camera Approval candidates`
- exact tested PR head: `7637010ef69248fe05ea37c1a1cf9ee8d2a38193`
- resulting Product `main`: `779719f88e630acda9dfb84520c913aac239fbf4`
- base before merge: `b97c851333c6a78869b78f762b2238b1dcd19fa8`
- current Hall phase after merge: `cameraApproval`
- `approvedRig=null` in immutable candidate source
- production `/hall` remained the lightweight DOM placeholder

## Exact Blender evidence

Camera artifact:

- artifact ID: `9027136608`
- digest: `sha256:17af431ffb72bd40b5febd8fa9927699f8c792ecdeea795d3b913b9cd6941c04`
- embedded checkout witness: `tested_commit=7637010ef69248fe05ea37c1a1cf9ee8d2a38193`
- Blender: `4.5.12 LTS`
- Blender build hash: `84afd5f785f7`
- selected topology: H3
- frozen H3 layout fingerprint: `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`
- frozen H3 mesh geometry fingerprint: `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`
- materials/lights: `0 / 0`
- all 36 manifest-listed PNG outputs were independently checked against recorded SHA-256 and byte length
- H3 mesh geometry fingerprint remained identical before/after all camera rendering
- the five non-problem H3 journey witnesses remained parameter-identical across R0/R1/R2/R3

The exact-head workflow also regenerated the frozen H1/H2/H3 topology evidence before camera rendering, so the camera wave did not silently rely on a stale or changed H3 source scene.

## Candidate findings

### R0 — benchmark only

- lens: `35 mm`
- Pushkin viewing distance: `3.5082 m`
- frozen H3 benchmark
- known failure retained: too close/flat, weak room/document context; portrait-mobile Pushkin framing is clipped

### R1 — surviving candidate

- lens: `28 mm`
- Pushkin viewing distance: `4.3342 m`
- Pushkin ray reaches `EXHIBIT_alexander-pushkin` first
- desktop anchor remains vertically cropped (`fullyInsideFrame=false`, visible-area fraction about `0.41413`)
- portrait-mobile anchor is fully inside frame (`fullyInsideFrame=true`, visible-area fraction about `0.49311`)
- desktop document-case visible-area fractions about `0.05750 / 0.06434`

### R2 — generated-evidence reject

- lens: `32 mm`
- Pushkin viewing distance: `4.7101 m`
- reproducible automatic failure: `pushkinViewing` hits `HUMAN_PROXY` before `EXHIBIT_alexander-pushkin`
- rejected evidence retained rather than deleted or moved until it passed

### R3 — surviving reserve candidate

- lens: `35 mm`
- Pushkin viewing distance: `5.4116 m`
- Pushkin ray reaches `EXHIBIT_alexander-pushkin` first
- desktop anchor remains vertically cropped (`fullyInsideFrame=false`, visible-area fraction about `0.41691`)
- portrait-mobile anchor is fully inside frame (`fullyInsideFrame=true`, visible-area fraction about `0.47527`)
- desktop document-case visible-area fractions about `0.05238 / 0.06007`

## Human artifact audit

Manual review of the exact artifact ranked **R1 above R3** for the later decision transaction. Both restore substantially more room/exhibit context than R0. R1 gives the stronger approach→focus-zone balance in the current neutral evidence; R3 remains a valid calmer 35 mm reserve. This ranking was deliberately **not** encoded as approval inside PR #382.

A wording error in the PR description was caught during post-evidence audit: the `fullyInsideFrame=true` values for R1/R3 apply to the portrait-mobile framing, not desktop framing. The generated artifact and validators were already correct; only PR metadata needed correction.

## Exact-head barriers

All applicable pull-request workflows on `7637010ef69248fe05ea37c1a1cf9ee8d2a38193` completed successfully before merge, including:

- CI
- Project contracts
- Hall greybox tooling
- Manual Browser QA
- Site route integrity audit
- Brand raster QA
- Brand deep reference and motion audit
- Content model contract
- Articles catalog acceptance
- Yesenin Part I browser acceptance
- Yesenin Part II safe publication

Request Pages deployment was skipped as expected.

## Frozen boundaries after merge

- selected topology remains H3
- `greybox-layouts.json` and frozen greybox generator remain unchanged
- no mesh geometry/exhibit proxy/material/light/texture/export/runtime change was authorized
- no Three/R3F/WebGL production Hall was activated
- camera candidate source remains evidence, not a post-hoc selected-rig rewrite

## Next bounded wave

The next Hall source transaction is a **separate Camera Decision**:

- may select one exact rig from the already merged evidence;
- must retain the candidate source and artifact identity unchanged;
- must keep H3 frozen;
- may retain a reserve and explicit rejects;
- must not open material/light/export in the same transaction;
- after a verified decision merge, a separate gate-promotion transaction may complete Camera Approval and activate only `materialLightingExportSpike`.
