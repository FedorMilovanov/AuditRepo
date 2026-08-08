# Hall v3 Camera Approval gate promotion — verified

Lane: `TLP-HALL-001` / Product #369

This record closes the bounded **camera gate promotion** transaction. It advances machine state only; it does not add materials, lighting, export assets, Pushkin media or web runtime.

## Product result

- Product PR: #384 — `architecture(hall): promote R1 camera gate to material spike`
- exact tested PR head: `f559a06f51483c4ea2a95795a7dad266940ddd70`
- resulting Product `main`: `a873a427c8dda34bd28baa12d8e34fc110f3268c`
- base before merge: `07e23ea3feb79fea9d42f29b192e4e3f046713cc`

Machine state after merge:

- `foundation=completed`
- `referenceBible=completed`
- `metricGreybox=completed`
- `cameraApproval=completed`
- `materialLightingExportSpike=active`
- `pushkinVerticalSlice=blocked`
- `offlineVisualApproval=blocked`
- `webVerticalSlice=blocked`
- `fullMuseumScaleOut=blocked`
- production `/hall` remains the lightweight DOM placeholder

## Frozen spatial authority

- selected topology: H3
- topology reserve: H1
- rejected topology: H2
- selected camera: R1
- camera reserve: R3
- rejected cameras: R0, R2
- H3 layout fingerprint: `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`
- H3 mesh geometry fingerprint: `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`
- approved R1 `pushkinViewing`: position `[8.0,2.5,1.60]`, target/destination `[11.15,5.45,1.95]`, lens `28 mm`

Promotion pins the already certified source blobs:

- greybox layouts `b3def316d855a6539ffd280217ed63e22c6855d9`
- greybox generator `7f5dbe64d61880031819a5d4e855e5c6b7285ef3`
- camera-rigs `8c65312a53dbd41c7ec5f0a6128610e3f5428205`
- camera generator `79f8b396b2fe0ca5fe695b49a70eb013f9c9418f`
- camera decision `fedf0c0d269822655a9db15b95914222c815769f`

## Current authority migration

Completed topology/camera authoring validators remain available for forensic reproduction but are no longer the mandatory current-phase guards. Current Hall validation keeps:

- permanent foundation invariants;
- completed Reference Bible invariants;
- frozen topology provenance;
- persistent post-camera H3/R1 authority.

The post-camera authority validates exact source blobs and, when generated Actions evidence is present, verifies regenerated Blender H3/R1 fingerprints as well.

## Exact-head Blender reproduction

Hall workflow run `31279551029` completed successfully on exact head `f559a06f51483c4ea2a95795a7dad266940ddd70` and:

- checked out literal PR head;
- checksum-verified Blender 4.5.12 LTS;
- ran metre-scale save/reopen tooling proof;
- regenerated H1/H2/H3 neutral evidence;
- regenerated R0/R1/R2/R3 camera evidence;
- verified frozen H3/R1 under the promoted gate;
- uploaded exact-head evidence artifacts.

Camera artifact:

- artifact ID `9028023600`
- digest `sha256:0704219f3be2a420d317131d67a9ffd985fe2d1846731226f9227b3601c5f254`
- embedded witness: `tested_commit=f559a06f51483c4ea2a95795a7dad266940ddd70`
- regenerated H3/R1 metrics matched the already approved camera evidence.

## Exact-head barrier

All eleven executable pull-request workflows succeeded on `f559a06f51483c4ea2a95795a7dad266940ddd70` before merge; Request Pages was skipped as expected.

Manual Browser QA passed all four jobs, including Chromium/Android and fresh-process iPhone Safari.

## Active next wave

`materialLightingExportSpike` is now the only active Hall production gate.

The first bounded spike should use **one representative H3 architectural bay** and prove delivery before scale-out:

1. frozen-H3-derived bay source;
2. raw GLB export;
3. Khronos glTF 2.0 validation;
4. preservation of required names/extras/UV sets through optimization;
5. measured raw-vs-optimized asset report;
6. only then controlled PBR/material/static-light alternatives.

The active spike must not texture/light the full Hall, change H3/R1, add final Pushkin documentary media or activate production Three/R3F/WebGL.