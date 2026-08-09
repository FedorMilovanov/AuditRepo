# Hall v3 — Material / lighting / export chain verification

Status: **verified merged Product evidence** for `TLP-HALL-001` / Product #369.

This record closes the bounded material authoring, evidence-integrity repair and visual-evidence repeat-spike waves that followed the approved H3 topology + R1 camera chain. It does **not** select the Gate-4 delivery strategy and does not activate `pushkinVerticalSlice`.

## 1. Representative material / light / export authoring — Product PR #386

- exact tested head: `c40bb023426785522ab915e89da20865bc364e73`;
- merge / resulting Product `main`: `5f6d6b4538ab40d8195f2e50e63fcbbf7186eeb4`;
- source authority remained frozen at H3 topology + R1 `pushkinViewing` camera;
- one Pushkin-side representative architectural bay only; no production `/hall` runtime or assets;
- stone proof contract: baseColor = sRGB color; normal/roughness = non-color data; metallic = `0`;
- explicit `TANGENT` required for normal-mapped architecture;
- UV0 = surface material channel; UV1 = explicit external lightmap channel;
- L0 = minimal browser ambient/directional runtime lighting, zero realtime shadow lights;
- L1 = same geometry/material plus external linear-EXR lightmaps on UV1, zero realtime shadow lights;
- pinned Blender `4.5.12 LTS` → raw GLB → Khronos validation → `gltfpack@1.2.0` preservation path → Khronos revalidation → QA-only Three/Chromium witness;
- optimizer preservation flags protect names/materials/extras/UVs and avoid hidden dequantization transforms; preservation is verified from output rather than assumed from flags;
- raw→optimized pixel equivalence is the geometry-visual invariant; total unique-mesh triangle equality is not used because mesh deduplication is legal and was independently observed without visible geometry loss;
- generated `.blend`, GLB, EXR/PNG and screenshots remain Actions artifacts, not production assets.

### Authoring defects discovered during the chain

The authoring wave correctly exposed several transport/evidence details that must remain permanent guards:

1. external Three `lightMap` delivery uses linear EXR + `LinearSRGBColorSpace`, not blanket `NoColorSpace`;
2. `gltfpack` may remove unused attributes, so externally-bound UV1 must be preservation-protected and output-inspected;
3. normal-mapped architecture must export explicit tangent space; Khronos generated-tangent-space warnings are not accepted;
4. mesh optimizer deduplication must not be confused with topology simplification; semantic/node preservation plus pixel equivalence is the relevant bounded check.

## 2. Evidence identity repair — Product PR #387

- exact tested head: `03053de324dcc524aa68ccc69b7a8b5d29280c1c`;
- merge / resulting Product `main`: `d6f695ddd583fbd2b667a5632ac7cc09a321afcc`;
- reproduced false-green evidence defect in merged #386 artifact `9030014873`, digest `sha256:351d0a88a5591367bd45fe55f61f41bd7d117c6bb9d0ce6a2b541b03fe45f8a6`;
- actual final tangent-reexported raw GLB was `20,304 B`, SHA-256 `d0437b522b019448d989c42cb964e74b13ba597204ca84a8139df7c1e31fc102`;
- stale `source-evidence.json` still described the pre-tangent file as `17,152 B`, SHA-256 `8eb41940d79a0700cc295738b6d5921fada61949ae33d2399602b6973daee611`;
- root cause: source evidence was written before tangent re-export overwrote the raw GLB;
- repair now reseals `files.rawGlb` after final tangent export and immediately verifies persisted bytes/SHA;
- a second independent Khronos-wrapper boundary recomputes the final raw identity and refuses validation if declared and actual path/bytes/SHA differ.

Exact repaired witness:

- Hall run `31304552158` passed all 34 DCC/export/browser steps;
- artifact `9035546527`, digest `sha256:280129a250834cd32b7adce5eb1dcd267f83b37b30e055e9183babc65178f91d`;
- actual and declared final raw GLB both `20,304 B`, SHA-256 `d0437b522b019448d989c42cb964e74b13ba597204ca84a8139df7c1e31fc102`;
- `_hallSourceEvidenceIdentity.matches=true`;
- Khronos raw validation remained `0 errors / 0 warnings`.

This is an audit/evidence-boundary repair, not a material-strategy change.

## 3. Visual-evidence repeat-spike — Product PR #388

- exact tested head: `600f28efd2aa59b6d31086b64aeb42da7b03a48e`;
- merge / resulting/current Product `main`: `0ce2e17f6eaa8b1af9c87257b20c9967616b8e4b`;
- Hall run `31307136214`: all 36 DCC/export/browser steps passed;
- complete pull-request fan-out passed at the same head, including CI, Project Contracts, Site route integrity, Brand, Yesenin I/II and Manual Browser QA;
- accepted Hall material artifact: `9036351234`, digest `sha256:dc33af96ba747175794f9f31775c534c224a35645d9943302424459e0bf8cc95`.

### Visual evidence added

The repeat-spike added only QA/material-lab authority; H3, R1 and production `/hall` remained frozen.

- deterministic 256×256 proof textures using existing baseColor/normal/roughness slots;
- UV0 is metre-scaled at approximately `1.5 m / UV unit` on the representative architecture;
- UV1 remains separate for lightmap delivery;
- bounded QA lookdev bevel: `15 mm`, 3 segments, angle-limited; object transforms remain unchanged and evaluated world-bounds delta is `0`;
- close witness: `0.85 m / 55 mm`;
- medium witness: `2.2 m / 45 mm`;
- inspection framing derives the actual wall face from local bounds: thinnest axis = face normal, world-up resolves vertical, remaining axis = tangent, with bounded edge reveal;
- material A/B evidence uses identical geometry/camera/light: full vs `normal-off` at close distance, and full vs `roughness-flat` at medium distance;
- proof material functions are continuously periodic on `u=0↔1` and `v=0↔1` with strict `1e-9` tolerance and rasterize at texel centers for repeat wrapping.

### Two green artifacts were manually rejected before acceptance

Machine green alone was not treated as visual approval.

1. artifact `9036028517`, digest `sha256:94cee8891d6f4f5df607828dbe934c099fac19662271a09a8264cc663a4bb054` — rejected because the first close/medium QA camera did not frame the real wall face; measurable A/B deltas were concentrated in a narrow strip and did not certify scale/seams/bevel;
2. artifact `9036170327`, digest `sha256:cae659f4dbf8b7fe46ec49bdba5314c281ecbfc17ed8ee65af96a01d4112bcb5` — camera framing was fixed, but the repeated proof texture exposed a hard horizontal wrap seam; the source texture function was not periodic.

The accepted artifact `9036351234` is the first authority after both defects were corrected and independently re-run.

### Accepted exact-head measurements

Final raw GLB:

- bytes: `200,672`;
- SHA-256: `10da27398d69397b77298e549af0b399eb2edf53ba430bfbb81a7937082fca7e`;
- source-evidence identity match: true;
- Khronos: `0 errors / 0 warnings`.

Optimized GLB:

- bytes: `141,896`;
- SHA-256: `810865870e5c240af681eab5aa8765a2fc6de44c69c823c8971a097a973ce089`;
- Khronos: `0 errors / 0 warnings`.

Raw→optimized R1 visual equivalence:

- mean absolute channel difference: `0.0047743`;
- maximum channel difference: `2`;
- ratio above delta `2`: `0`.

Material response:

- normal close A/B: meanAbs `1.453125`, max delta `14`, changed-sample ratio above `2` = `25.03%`;
- roughness medium A/B: meanAbs `0.538194`, max delta `14`, changed-sample ratio above `2` = `6.84%`.

Readability / candidate cost:

- L0 mean display luma `0.18037`, dark-sample ratio `0.39366` → `eligible-for-human-review`;
- L1 mean display luma `0.06554`, dark-sample ratio `0.96832` → `reject-current-bake` because mean display luma is below `0.08`;
- L0 GPU texture residency `1,398,096 B`;
- L1 GPU texture residency `1,791,312 B`;
- incremental L1 lightmap residency `393,216 B` for the three 128×128 RGBA HalfFloat lightmaps.

Manual acceptance of the final screenshots confirms:

- the earlier hard repeat seam is gone;
- close/medium material occupies the inspection frame;
- the 15 mm edge treatment reads naturally on the representative wall;
- normal and roughness have visible but non-destructive response;
- no new obvious UV stretch / repeat discontinuity is visible;
- current L1 remains near-black and is not visually approved.

## Current verified Product authority after the material chain

Product `main@0ce2e17f6eaa8b1af9c87257b20c9967616b8e4b` remains:

- topology: **H3**;
- guided camera: **R1**;
- phase: `materialLightingExportSpike`;
- Gate 4 material/light/export strategy: **undecided**;
- production `/hall`: lightweight DOM placeholder; no production Three/R3F/WebGL activation;
- `pushkinVerticalSlice`: blocked;
- later Hall gates: blocked.

## Decision analysis for the next bounded transaction

The evidence no longer supports another open-ended authoring wave by default.

### Candidate L0 — minimal runtime lighting

Current disposition: **eligible for strategy decision**.

Reasons:

- passes material close/medium evidence;
- preserves approved H3/R1;
- requires no external lightmap payload;
- lower texture residency than L1 by `393,216 B` on the small representative bay;
- avoids coupling the first Pushkin slice to a currently failing static-bake exposure;
- raw/optimized transport and browser equivalence are already proven.

### Candidate L1 — external baked lightmap

Current disposition: **reject-current-bake / reserve strategy only**.

Reasons:

- UV1/lightmap transport itself is technically proven;
- current visual delivery is too dark and fails the accepted readability check;
- costs an additional `393,216 B` texture residency on the representative bay;
- repairing exposure/bake could be a later bounded optimization experiment if the vertical slice proves a real need for higher-quality static illumination.

The current evidence does **not** justify blocking the whole Hall on another L1 bake before the first Pushkin slice.

### Recommended next disposition

Open a separate Product **Gate-4 decision transaction**, not another material authoring transaction, with the following default recommendation:

- approve **L0 minimal runtime lighting** as the initial delivery strategy for the Pushkin vertical slice;
- approve UV0 as the surface-material channel;
- preserve UV1 as an explicit optional/reserve static-lightmap channel rather than deleting it;
- approve the current raw Blender → Khronos → preservation-safe `gltfpack@1.2.0` → Khronos transport chain;
- keep the QA 15 mm bevel/material proof parameters as evidence inputs only; do not silently promote synthetic proof textures as final museum assets;
- record L1 external lightmaps as `reserve / current bake rejected`, not as an approved active delivery path;
- keep production `/hall` and `pushkinVerticalSlice` blocked until that decision is separately merged and, if the repository gate model requires it, separately promoted.

Reopen/repeat the material spike only if the decision transaction exposes a new reproduced defect or if the owner explicitly requires an L1 bake before the Pushkin slice.
