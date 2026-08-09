# Hall v3 — Gate-4 material delivery decision verification

Status: **verified merged Product decision** for `TLP-HALL-001` / Product #369.

This record follows the accepted material evidence package in `verification/2026-08-09-hall-v3-material-chain/MATERIAL_CHAIN.md`. It verifies the decision transaction only. It does **not** promote `pushkinVerticalSlice` and does not authorize production `/hall` runtime changes.

## Product transaction

- Product PR: **#389 — `architecture(hall): select material delivery contract`**;
- exact tested head: `6a843479987b1022da562f342bbe9e61ff1214fc`;
- merge / resulting Product `main`: `022c25b84aa3e4228fff3fbff6f4cef11e2d36c7`;
- merged material-decision Git blob: `9282a3b75694c7e0198f95a148c5d0bbb52f0b28`;
- source phase remains `materialLightingExportSpike`;
- Gate 4 remains `active`;
- `pushkinVerticalSlice` and all later Hall gates remain `blocked`;
- production `/hall` remains the lightweight DOM placeholder with production Three/R3F/WebGL still forbidden.

Exact-head certification on `6a843479987b1022da562f342bbe9e61ff1214fc` passed:

- Content model contract;
- Project Contracts;
- full CI, typecheck, build, route budgets, prerender and SEO;
- Hall Blender/export/browser workflow, including the material-decision validator before DCC and again against generated evidence;
- Brand deep reference/motion and Brand raster QA;
- Yesenin Part I and II gates;
- Articles catalog acceptance;
- Site route integrity audit;
- complete Manual Browser QA: Chromium/Android, fresh-process base iPhone Safari, desktop WebKit reveal, premium homepage matrix and critical iPhone/reduced-motion path.

Pages deployment request was skipped as expected for the PR and is not a failed quality gate.

## Selected delivery contract

### Lighting

Selected baseline for the **Pushkin vertical slice**:

- `L0-minimal-runtime`;
- no external lightmap required;
- zero realtime shadow lights in the proved baseline;
- accepted evidence remains `eligible-for-human-review`, not a claim of final art approval;
- accepted L0 mean display luma `0.18037`;
- dark-sample ratio below `0.08`: `0.39366`;
- GPU texture residency: `1,398,096 B`.

Current L1 disposition:

- `L1-external-lightmap` = **`reject-current-bake`**;
- mean display luma `0.06554`;
- dark-sample ratio below `0.08`: `0.96832`;
- GPU texture residency `1,791,312 B`;
- incremental lightmap **GPU resident** bytes: `393,216 B`;
- UV1/lightmap transport remains technically available for a later bounded experiment, but this bake may not silently become approved.

The decision deliberately names `393,216 B` as GPU residency rather than ambiguous generic "lightmap bytes".

### UV ownership

- UV0 / `TEXCOORD_0`: selected surface-material channel;
- accepted surface scale: metre-scaled box mapping at `1.5 m / UV unit`;
- UV1 / `TEXCOORD_1`: preserved as `reserved-not-required` static-bake channel;
- a lightmap is **not mandatory** for the Pushkin baseline.

### Material semantics

- baseColor: color, `sRGB`, UV0;
- normal: data, `Non-Color`, UV0, explicit tangent required;
- roughness: data, `Non-Color`, UV0;
- stone metallic factor: `0`;
- any future external lightmap: linear illuminance, `LinearSRGBColorSpace`, UV1.

### Export / optimization

Selected transport:

`Blender 4.5.12 LTS → raw GLB → Khronos → gltfpack 1.2.0 → Khronos → semantic/pixel/browser validation`

Approved optimizer arguments:

`-cc -kn -km -ke -kv -vpf`

Required preservation remains:

- named nodes;
- named materials;
- node extras;
- UV0;
- UV1;
- tangents;
- approved camera node;
- `poetId` extra;
- metric scale.

The decision freezes the accepted evidence identities from Product #388 rather than rewriting candidate evidence:

- material artifact `9036351234`, digest `sha256:dc33af96ba747175794f9f31775c534c224a35645d9943302424459e0bf8cc95`;
- accepted material head `600f28efd2aa59b6d31086b64aeb42da7b03a48e`;
- raw GLB `200,672 B`, SHA-256 `10da27398d69397b77298e549af0b399eb2edf53ba430bfbb81a7937082fca7e`;
- optimized GLB `141,896 B`, SHA-256 `810865870e5c240af681eab5aa8765a2fc6de44c69c823c8971a097a973ce089`;
- raw/optimized Khronos `0 errors / 0 warnings`;
- final raw source-evidence identity matched;
- both manually rejected machine-green visual artifacts `9036028517` and `9036170327` remain explicit non-authority.

## Texture-delivery boundary

The decision is intentionally narrower than a production texture-format choice:

- accepted 256px PNG proof maps remain QA evidence only;
- they are **not production assets**;
- final production texture encoding is `deferred-to-pushkin-vertical-slice`;
- KTX2 is `deferred-not-default` until the vertical slice supplies measured evidence.

This prevents an experimental proof texture format from becoming production authority merely because the material lab passed.

## Pre-merge audit corrections

The first decision head was not accepted as merge authority even after initial green checks. Two issues were repaired and the full exact-head certification was rerun:

1. `docs/CURRENT_STATE.md` and `docs/hall-v3/README.md` still described material selection as unfinished. They now agree with machine authority: delivery is selected, Gate 4 is still active, and only a separate promotion may activate Pushkin.
2. The L1 incremental `393,216` measurement was renamed from ambiguous `incrementalLightmapBytes` to `incrementalLightmapResidentBytes`; the validator now requires GPU-residency semantics.

Only final head `6a843479987b1022da562f342bbe9e61ff1214fc` is merge authority.

## Frozen authority after the decision

- topology remains **H3**;
- approved guided camera remains **R1**;
- H3 geometry may not change in the material decision/promotion path;
- R1 may not change without a new camera approval transaction;
- current L1 bake may not be reused as approved;
- full-Hall lookdev may not start;
- production Hall runtime may not activate;
- final Pushkin portrait/documentary assets remain undecided and rights-gated.

## Next bounded transaction

Disposition: **separate Gate-4 promotion**.

The next Product transaction may only promote the already-selected material contract:

`materialLightingExportSpike → pushkinVerticalSlice`

Expected state transition:

- `phase`: `materialLightingExportSpike` → `pushkinVerticalSlice`;
- `gates.materialLightingExportSpike`: `active` → `completed`;
- `gates.pushkinVerticalSlice`: `blocked` → `active`;
- every later Hall gate remains blocked.

Promotion must pin this merged decision authority and must **not**:

- add Pushkin portrait/document assets;
- activate production Three/R3F/WebGL;
- alter H3 or R1;
- start full-Hall lookdev;
- select the rejected L1 current bake;
- invent a final production texture encoding;
- combine promotion with Pushkin slice authoring.

After that promotion is merged and audited, the first Pushkin-slice authoring wave must respect `RIGHTS_REGISTER.md`: documentary hero assets need explicit source/provenance/rights records and only `approved` records may enter a production Hall manifest. Current Product search shows no completed Pushkin Hall rights record yet, so rights/source acquisition is an early slice blocker rather than something to postpone until WebGL integration.
