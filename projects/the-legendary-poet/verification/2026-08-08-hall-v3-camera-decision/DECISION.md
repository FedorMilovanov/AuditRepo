# Hall v3 Camera Decision — verified

Lane: `TLP-HALL-001` / Product #369

This record closes the bounded **camera select/reject decision** wave only. It records the approved guided-camera choice from already merged immutable Camera Approval candidate evidence. It intentionally does **not** complete the Camera Approval machine gate and does not authorize materials, lighting, export or web runtime.

## Product result

- Product PR: #383 — `architecture(hall): select R1 camera rig`
- exact tested PR head: `8682789cf78e4e717eba5181246700da09de5c11`
- resulting Product `main`: `07e23ea3feb79fea9d42f29b192e4e3f046713cc`
- base before merge: `779719f88e630acda9dfb84520c913aac239fbf4`
- Hall machine phase after merge: `cameraApproval`
- `cameraApproval=active`
- `materialLightingExportSpike=blocked`
- production `/hall` remains a lightweight DOM placeholder

## Decision

- selected topology: **H3**
- selected rig: **R1**
- reserve rig: **R3**
- rejected rigs: **R0, R2**

The immutable candidate source `camera-rigs.json` remains candidate evidence with `approvedRig=null`; the separate `camera-decision.json` is the decision authority. This avoids rewriting the source after human inspection.

### Selected R1 variable witness

- witness: `pushkinViewing`
- position: `[8.0, 2.5, 1.60]`
- target: `[11.15, 5.45, 1.95]`
- next destination: `[11.15, 5.45, 1.95]`
- lens: `28 mm`

The five other H3 guided journey cameras remain frozen to the benchmark values.

## Frozen evidence referenced by the decision

- candidate-source Git blob: `8c65312a53dbd41c7ec5f0a6128610e3f5428205`
- camera-generator Git blob: `79f8b396b2fe0ca5fe695b49a70eb013f9c9418f`
- original Camera Approval tested head: `7637010ef69248fe05ea37c1a1cf9ee8d2a38193`
- original camera artifact: `9027136608`
- original artifact digest: `sha256:17af431ffb72bd40b5febd8fa9927699f8c792ecdeea795d3b913b9cd6941c04`
- Blender: `4.5.12 LTS`, build `84afd5f785f7`
- H3 layout fingerprint: `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`
- H3 mesh geometry fingerprint: `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`

## Exact-head decision reproduction

PR #383 exact head `8682789cf78e4e717eba5181246700da09de5c11` passed the complete applicable barrier. The Hall Blender workflow:

- checked out the literal PR head and retained the tested-SHA witness;
- revalidated frozen topology selection and shootout provenance;
- revalidated immutable R0/R1/R2/R3 candidate source;
- executed the separate camera-decision validator;
- downloaded and checksum-verified pinned Blender 4.5.12;
- regenerated H1/H2/H3 neutral evidence;
- regenerated R0/R1/R2/R3 camera evidence on H3;
- validated the selected R1 decision against regenerated evidence;
- uploaded fresh exact-head artifacts.

Fresh camera artifact from the decision head:

- artifact ID: `9027560143`
- digest: `sha256:b94c2aace754660689fcb43519d5b36d1f71496f5585c080290767a4f040263d`
- embedded tested commit: `8682789cf78e4e717eba5181246700da09de5c11`

Structural camera metrics, topology fingerprints, runtime identity and rig summaries matched the original #382 evidence. Re-rendered Workbench PNGs showed only negligible ±1-channel rounding in a few pixels; no compositional, geometric or measured-camera drift was found.

## Exact-head barrier

All eleven executable pull-request workflows succeeded on `8682789cf78e4e717eba5181246700da09de5c11` before merge:

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

## Next bounded wave

A separate **Camera Approval gate-promotion** transaction may now:

- mark `cameraApproval=completed`;
- activate only `materialLightingExportSpike`;
- keep H3 topology and R1 camera frozen;
- preserve all candidate/decision evidence unchanged;
- keep Pushkin vertical slice, offline visual approval, web runtime and scale-out blocked;
- keep production `/hall` as the lightweight placeholder.

The promotion transaction must not itself add materials, lights, textures, export assets or WebGL runtime.