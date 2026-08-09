# Hall v3 — Material / lighting / export chain verification

Status: **verified merged evidence** for `TLP-HALL-001` / Product #369.

This package consolidates the material-spike authoring, evidence-integrity repair and visual-evidence repeat-spike that followed the approved H3/R1 camera chain. It does **not** close the Hall lane and it does **not** approve a Gate-4 delivery strategy by itself.

## Current Product authority

- Product repository: `FedorMilovanov/TheLegendaryPoet`.
- Current verified Product `main`: `0ce2e17f6eaa8b1af9c87257b20c9967616b8e4b`.
- Current phase: `materialLightingExportSpike`.
- H3 topology remains frozen.
- Approved guided camera remains R1.
- Production `/hall` remains a lightweight DOM placeholder; no production Three/R3F/WebGL activation was introduced by this chain.
- `pushkinVerticalSlice` and every later Hall gate remain blocked.

## 1. Material authoring / transport spike — Product PR #386

Exact tested head: `c40bb023426785522ab915e89da20865bc364e73`.
Resulting Product merge: `5f6d6b4538ab40d8195f2e50e63fcbbf7186eeb4`.

The wave proved the representative H3 bay can traverse pinned Blender → GLB → Khronos validation → `gltfpack` optimization → isolated Three browser rendering while preserving required Hall semantics.

Accepted technical evidence from the exact-head Hall artifact:

- Blender `4.5.12 LTS`;
- H3 source fingerprint and approved R1 authority preserved;
- raw GLB after tangent re-export: `20,304 B`;
- optimized GLB: `13,964 B`;
- raw/optimized Khronos validation: `0 errors / 0 warnings`;
- raw→optimized visible sample difference was negligible: mean absolute channel delta `0.0001085`, max channel delta `1`, ratio above delta `2` = `0`;
- L0 optimized GPU texture residency at the original 128px proof-texture stage: `87,376 B`;
- L1 optimized GPU texture residency: `480,592 B`;
- incremental L1 lightmap residency: `393,216 B`, exactly three `128×128 RGBA HalfFloat` lightmaps without mipmaps.

### Reproduced evidence-integrity defect in #386

Manual audit of merged artifact `9030014873` (`sha256:351d0a88a5591367bd45fe55f61f41bd7d117c6bb9d0ce6a2b541b03fe45f8a6`) found a false-green evidence boundary:

- actual final tangent-reexported `material-spike-raw.glb`: `20,304 B`, SHA-256 `d0437b522b019448d989c42cb964e74b13ba597204ca84a8139df7c1e31fc102`;
- `source-evidence.json -> files.rawGlb` still described the pre-tangent file: `17,152 B`, SHA-256 `8eb41940d79a0700cc295738b6d5921fada61949ae33d2399602b6973daee611`.

Root cause: source evidence was written before the later tangent re-export overwrote the raw GLB. Khronos/browser checks were using the final GLB, but the canonical identity record was stale.

Disposition: **repeat-spike integrity repair**, not Gate-4 decision.

## 2. Final raw-GLB evidence identity repair — Product PR #387

Exact tested head: `03053de324dcc524aa68ccc69b7a8b5d29280c1c`.
Resulting Product merge: `d6f695ddd583fbd2b667a5632ac7cc09a321afcc`.

Repair mechanism:

1. tangent re-export computes final raw-GLB bytes and SHA-256 after writing the actual file;
2. it atomically reseals `source-evidence.json -> files.rawGlb`;
3. it immediately re-reads and fail-fast checks the persisted identity;
4. the next independent Khronos wrapper recomputes the same identity before validation and refuses to continue on any mismatch;
5. the Khronos report records `_hallSourceEvidenceIdentity` as a second evidence angle.

Exact-head witness:

- Hall run `31304552158`: all 34 DCC/export/browser steps passed;
- artifact `9035546527`, digest `sha256:280129a250834cd32b7adce5eb1dcd267f83b37b30e055e9183babc65178f91d`;
- actual and declared final raw GLB both `20,304 B` / SHA-256 `d0437b522b019448d989c42cb964e74b13ba597204ca84a8139df7c1e31fc102`;
- `_hallSourceEvidenceIdentity.matches=true`;
- raw Khronos remained `0 errors / 0 warnings`;
- full repository browser fan-out passed before merge.

The repair changed only the Hall QA/export evidence boundary. H3, R1, production `/hall` and Gate-4 strategy state remained unchanged.

## 3. Visual-acceptance repeat-spike — Product PR #388

Exact accepted head: `600f28efd2aa59b6d31086b64aeb42da7b03a48e`.
Resulting/current Product merge: `0ce2e17f6eaa8b1af9c87257b20c9967616b8e4b`.

The purpose was to close the remaining `VISUAL_ACCEPTANCE.md` evidence gap without selecting a production lighting strategy.

### DCC / material proof added

- deterministic QA-only 256×256 baseColor/normal/roughness proof textures;
- UV0 metre-scaled by direct headless box projection at `1.5 m / UV unit`;
- UV1 remains the separate baked-lightmap channel;
- bounded QA lookdev bevel: `15 mm`, `3` segments, angle-limited;
- object matrices unchanged and evaluated world-bounds delta `0` on the representative architecture nodes;
- headless preparer explicitly forbids the previously crash-prone context-sensitive path (`bpy.ops.uv.cube_project`, `modifier_apply`, `image.reload()`);
- final glTF exports evaluated modifiers rather than mutating frozen source geometry;
- material functions are proven continuously periodic at `u=0↔1` and `v=0↔1`, then rasterized at texel centers for repeat wrapping.

Strict periodicity evidence in accepted artifact:

- baseColor max boundary delta: `5.684e-14 / 5.684e-14`;
- normal: `7.105e-14 / 8.527e-14`;
- roughness: `1.137e-13 / 5.684e-14`;
- required tolerance: `1e-9`.

### Browser visual proof added

The isolated QA viewer now captures controlled material inspection views off the actual wall face rather than modifying approved R1 authority:

- medium: `2.2 m / 45 mm`;
- close: `0.85 m / 55 mm`;
- wall local basis is derived explicitly: thinnest axis = surface normal, world-up resolves vertical, remaining axis = tangent;
- bounded edge-reveal angle makes the 15-mm bevel inspectable;
- identical A/B geometry/camera/light compares `full` vs `normal-off` and `full` vs `roughness-flat`.

Accepted exact-head response metrics:

- normal close A/B: mean absolute channel delta `1.453125`, max `14`, changed-above-2 ratio `25.03%`;
- roughness medium A/B: mean absolute channel delta `0.538194`, max `14`, changed-above-2 ratio `6.84%`;
- raw→optimized R1 sample delta remains negligible: mean `0.0047743`, max `2`, ratio above `2` = `0`.

### Readability / lighting candidate evidence

Current L0 neutral/minimal-runtime candidate:

- mean display luma `0.18037`;
- dark-sample ratio below `0.08` = `0.39366`;
- disposition: **eligible for human review**.

Current L1 external-lightmap bake:

- mean display luma `0.06554`;
- dark-sample ratio below `0.08` = `0.96832`;
- disposition: **reject-current-bake** due mean display luma below the explicit dark threshold.

No bloom/fog/vignette/mirror-floor/post-processing rescue was used to change that verdict.

GPU texture residency at the accepted 256px visual-evidence stage:

- L0: `1,398,096 B`;
- L1: `1,791,312 B`;
- incremental lightmaps: `393,216 B`.

### Accepted exact-head artifact

- Hall run `31307136214`: all 36 material/DCC/export/browser steps passed;
- artifact `9036351234`, digest `sha256:dc33af96ba747175794f9f31775c534c224a35645d9943302424459e0bf8cc95`;
- final raw GLB: `200,672 B`, SHA-256 `10da27398d69397b77298e549af0b399eb2edf53ba430bfbb81a7937082fca7e`;
- optimized GLB: `141,896 B`, SHA-256 `810865870e5c240af681eab5aa8765a2fc6de44c69c823c8971a097a973ce089`;
- raw/optimized Khronos: `0 errors / 0 warnings`;
- final raw identity reseal/match remained true;
- CI, Project Contracts, content/route/brand/Yesenin gates and the full Manual Browser QA fan-out all passed on exact head before merge.

### Two green artifacts explicitly rejected by manual audit

Machine green was not treated as artistic acceptance.

1. Artifact `9036028517` (`sha256:94cee8891d6f4f5df607828dbe934c099fac19662271a09a8264cc663a4bb054`) from head `0f0fd7076b37401573bd64c2e37ffaaf8dd39a19` passed all 36 steps but was rejected because the material camera looked along the wrong local wall axis, leaving the meaningful response in a narrow strip.
2. Artifact `9036170327` (`sha256:cae659f4dbf8b7fe46ec49bdba5314c281ecbfc17ed8ee65af96a01d4112bcb5`) from head `51954dd077df5fea5b6ae769e0ee784dcb5bcb93` fixed the wall-face camera but was rejected because the repeated proof textures exposed a hard horizontal wrap seam.

The final accepted artifact corrected both defects and added class-level guards so those false-green evidence modes cannot silently return.

## Current Gate-4 decision evidence

What is now proved:

- H3 topology is not the material-spike problem;
- R1 camera is not the material-spike problem;
- UV0 surface scale and UV1 lightmap separation can survive Blender → GLB → optimization → Three;
- explicit tangent semantics survive;
- raw/optimized delivery can preserve names, extras, camera and UV contracts;
- normal and roughness channels have measurable browser-visible effect at controlled close/medium distances;
- the current L1 external-lightmap bake is visually unacceptable because it buries the architectural/exhibit hierarchy in darkness;
- L0 remains viable enough for human review and has lower GPU texture residency than L1;
- the current evidence does **not** prove that QA PNG proof textures are the final production texture format, and it does not authorize full-Hall lookdev.

## Recommended next bounded Product transaction

Disposition: **`approve-spike-contract` decision transaction**, but with the current L1 bake explicitly rejected rather than carried forward.

The decision should be separate from gate promotion and should select only what the accepted spike actually proves:

1. lighting baseline: L0/minimal-runtime neutral PBR for the Pushkin vertical slice; no current external-lightmap bake;
2. UV strategy: UV0 metre-scaled surface materials; retain UV1 as an available reserved static-bake channel, not a mandatory delivery path;
3. optimizer: the proved `gltfpack` preservation-safe path (`-cc -kn -km -ke -kv -vpf`) with Khronos validation before and after;
4. texture policy: preserve color/data ownership and correct color spaces; do **not** declare the 256px QA PNG proof maps a production texture-format decision;
5. production `/hall` remains untouched in the decision transaction;
6. `pushkinVerticalSlice` remains blocked until a separate gate-promotion transaction consumes the approved material decision.

If the decision validator cannot express “L0 approved, UV1 reserved, final production texture encoding deferred” without lying about evidence, fix the decision schema first. Do not force a fake value merely to advance the gate.

## Collision / ownership state at this verification

- Product #388 is merged; no competing Hall Product PR existed at merge preflight.
- AuditRepo PR #264 changes only `projects/gb-is-my-strength/**` verification files and does not overlap this TLP evidence package.
- TLP verified engineering matrix remains **0**; no new bug row is warranted by this architecture evidence chain.

## Next-state rule

`TLP-HALL-001` remains open. The next Product mutation may decide the material/light/export spike contract, but it may not simultaneously activate the Pushkin slice or edit frozen H3/R1 authority.
