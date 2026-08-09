# Hall v3 — Pushkin rights-first source authority verification

Status: **verified merged Product source-authority wave** for `TLP-HALL-001` / Product #369.

This record follows `verification/2026-08-09-hall-v3-material-promotion/PROMOTION.md`. It verifies the first bounded `pushkinVerticalSlice` rights/source transaction only. It does **not** approve documentary media, authorize a production Hall manifest, start final Blender exhibit authoring, activate WebGL, or advance any later Hall gate.

## Product transaction

- Product PR: **#391 — `architecture(hall): establish Pushkin rights-first slice authority`**;
- exact tested head: `d4811372e2681484422fb5408035d45d92c10edd`;
- merge / resulting Product `main`: `c74fa70032894b6d231cbafaf6f8893345905278`;
- base Product authority: `7337c61b07709b04ecb947491d1d59b499b81ceb` from merged #390.

The final PR scope was **11 governance/docs/validator/workflow/package files** with:

- zero `src/` changes;
- zero `public/` changes;
- zero documentary media bytes;
- zero source-file hashes asserted for documentary media;
- zero Hall documentary runtime paths;
- zero Blender source-exhibit authoring;
- zero production Three/R3F/WebGL activation.

## Exact-head certification

Final exact head `d4811372e2681484422fb5408035d45d92c10edd` passed:

- Project Contracts;
- full CI, typecheck, build, production budgets, prerender and SEO;
- both Pushkin rights/source validators in CI and Project Contracts;
- both Pushkin rights/source validators in the Hall workflow **before Blender download**;
- full Hall Blender 4.5.12 LTS H1/H2/H3 and R0/R1/R2/R3 regeneration;
- representative H3 material bay regeneration;
- raw GLB Khronos validation;
- preservation-safe `gltfpack@1.2.0` optimization;
- optimized GLB Khronos validation;
- persistent post-material structural/semantic authority;
- Chromium selected/rejected material browser witness;
- Brand deep reference/motion audit;
- Brand raster QA;
- Articles catalog acceptance;
- Site route integrity audit;
- Yesenin Part I browser acceptance;
- Yesenin Part II safe-publication gate;
- Content model contract;
- complete Manual Browser QA: Chromium/Android, fresh-process base iPhone Safari, desktop WebKit reveal, premium homepage matrix and critical iPhone/reduced-motion path.

Pages deployment request was skipped as expected for the PR and is not a failed quality gate.

## Manual pre-merge audit correction

An earlier #391 head, `fc94e8af064feb6f89b63b9cdec3e6f70414e200`, had already passed CI, Project Contracts and the Hall DCC workflow. It was **not accepted as merge authority**.

Manual policy audit found that the first registry version preserved the intended rights evidence semantically but left several fields required literally by `docs/hall-v3/RIGHTS_REGISTER.md` only inside nested `objectProvenance` / `reproduction` structures rather than on the canonical documentary record.

That was a real governance defect because a future consumer could read the canonical record shape directly and miss policy-required fields even though a semantic validator was green.

The final head repaired the defect by:

1. exposing the canonical top-level documentary fields required by repository policy;
2. preserving nested evidence rather than deleting it;
3. adding a second independent fail-closed validator, `scripts/validate-hall-pushkin-rights-policy-schema.ts`;
4. making that validator check top-level/nested evidence consistency and its own package/CI/Project/Hall wiring;
5. running both semantic and literal-schema rights barriers before Blender in the Hall workflow.

Disposition: **green-but-policy-incomplete head rejected; corrected exact head accepted**.

## Current machine authority

Product now registers two separate machine-readable Pushkin authorities:

- `docs/hall-v3/pushkin-rights.json` — documentary object/reproduction/intended-use rights registry;
- `docs/hall-v3/pushkin-slice.json` — one-exhibit H3/R1/L0 source/offline slice contract.

Two validators enforce different layers:

- `scripts/validate-hall-pushkin-rights.ts` — Hall semantics, phase/gates, H3/R1/L0/UV authority, documentary status transitions, production-manifest/runtime boundary and offline-slice evidence requirements;
- `scripts/validate-hall-pushkin-rights-policy-schema.ts` — literal canonical documentary record shape required by `RIGHTS_REGISTER.md`, top-level/nested evidence agreement and fail-closed approval fields.

This separation is deliberate: a structurally well-shaped record is not automatically publication-approved, and a semantically plausible nested record may not bypass the canonical policy schema.

## Frozen Hall authority preserved

The rights/source transaction does not reopen earlier decisions:

- topology: **H3**;
- H3 layout fingerprint: `5d5d0ddd8b150aa64afb73a2a3d9e00c6005e99fc935a6d4707a49ecd475fe65`;
- H3 geometry fingerprint: `b3de770858a423305db8fcab15b405414e66b3d3de93ab1deaa5b3b35b418777`;
- guided camera: **R1**;
- Pushkin viewing witness: position `[8.0,2.5,1.60]`, target `[11.15,5.45,1.95]`, lens `28 mm`;
- selected lighting: **L0-minimal-runtime**;
- surface UV: **UV0** at accepted `1.5 m / UV unit`;
- optional static-bake reserve: **UV1**;
- current `L1-external-lightmap` bake: **`reject-current-bake`**;
- production texture encoding: still deferred until measured on the actual first Pushkin slice.

Gate state remains:

- `pushkinVerticalSlice`: **active**;
- `offlineVisualApproval`: blocked;
- `webVerticalSlice`: blocked;
- `fullMuseumScaleOut`: blocked.

Production `/hall` remains the lightweight DOM placeholder. Production Three/R3F/WebGL remains forbidden.

## Documentary registry disposition after #391

Current **production-approved documentary assets: 0**.

### `pushkin-kiprensky-1827-portrait`

- object: Orest Kiprensky, Pushkin portrait, 1827;
- institution: State Tretyakov Gallery;
- exact object source recorded through Google Arts & Culture;
- State Catalogue of the Museum Fund of Russia artwork ID `4574813`;
- Tretyakov accession `168`;
- object provenance: `source-verified`;
- reproduction/intended-use status: `rights-pending`;
- `creditLine=null`;
- `sourceFileHash=null`;
- `runtimeAssetPath=null`;
- production manifest eligible: **false**.

### `pushkin-onegin-1833-edition`

- object: `Евгений Онегин: роман в стихах`, 1833;
- institution: Russian State Library;
- RSL record `01003570012`;
- holdings/call-number evidence retained in registry;
- object provenance: `source-verified`;
- reproduction/intended-use status: `rights-pending`;
- `creditLine=null`;
- `sourceFileHash=null`;
- `runtimeAssetPath=null`;
- production manifest eligible: **false**.

### `pushkin-onegin-autograph-weak-mirror`

- public mirror/Commons metadata was insufficient to establish an exact primary archive object/call number;
- object provenance: `blocked`;
- reproduction status: `blocked`;
- `sourceInstitution=null`;
- `objectIdOrCallNumber=null`;
- `sourceFileHash=null`;
- `runtimeAssetPath=null`;
- production manifest eligible: **false**.

Its purpose in the registry is a useful fail-closed regression case: a public-domain declaration or attractive image cannot repair weak documentary object provenance.

## Canonical approval contract

Each documentary record now exposes the repository-policy fields at canonical top level, including:

- `assetId`;
- `poetId`;
- `kind`;
- `sourceTitle`;
- `sourceInstitution`;
- `sourceUrlOrArchiveAddress`;
- `objectIdOrCallNumber`;
- `sourceDate`;
- `rightsStatus`;
- `rightsBasis`;
- `creditLine`;
- `sourceFileHash`;
- `runtimeAssetPath`;
- `verificationStatus`;
- `notes`.

A future `approved` record must additionally prove, at minimum:

- source-verified object identity;
- approved reproduction-rights/intended-use disposition;
- final credit line;
- exact `sha256:<64 hex>` source-file hash from actually acquired bytes;
- Hall v3 runtime asset path;
- consistency between canonical and nested evidence;
- `productionManifestEligible=true` only after the full approval contract is satisfied.

Non-approved records may not claim final runtime paths or enter a production Hall manifest.

## New active bounded question

The registry/source contract is now established. The next transaction is **not another schema/policy PR** and is **not WebGL**.

Next bounded question:

> Which exact documentary source bytes can now be acquired, hashed, credited and independently dispositioned for the intended Hall use, and which unresolved candidate must be replaced by a stronger primary institutional object record before one offline Pushkin exhibit is authored?

### Stronger manuscript provenance found during read-only follow-up

The weak autograph mirror now has a substantially stronger object-provenance replacement candidate in the official Manuscript Department of the Pushkin House / Institute of Russian Literature archive:

- Pushkin fund: **Ф. 244**;
- inventory: **оп. 12**;
- unit: **ед. хр. 6**;
- described object: Pushkin self-portrait with Onegin on the Neva, auto-illustration to chapter 1 of `Eugene Onegin`, at the letter to L. S. Pushkin dated 1–10 November 1824;
- source description also points to the original **оп. 1, №1261, л. 34** and museum facsimile reference **ГМП кн.п. 7374 (факсимиле 7)**.

This is materially stronger **object provenance** than the weak mirror. It is not, by itself, a licence for a digital reproduction.

The same institution states that copy requests should identify the researcher, work/topic, intended purpose such as publication/illustration/exhibition, and exact archive cipher. Therefore an exact Pushkin House reproduction may require an explicit institutional/human request and may not be auto-approved by an agent.

## Next bounded transaction

Disposition: **exact source acquisition/hash + independent rights/credit disposition**.

It may:

- replace or retire the weak autograph mirror with the official Pushkin House object record as provenance evidence;
- acquire exact source bytes only where a legitimate source/download path is actually available;
- compute SHA-256 only from the bytes that were actually acquired;
- preserve separate object-provenance and reproduction/intended-use evidence;
- record final credits where independently supported;
- move a documentary record to `approved` only if the entire canonical approval contract is genuinely satisfied;
- keep unresolved records `rights-pending` or `blocked` without blocking source-only geometry/material work that does not ship those media.

It may not:

- invent or copy a hash from metadata when the exact bytes were not obtained;
- infer permission from public visibility, age or a Commons badge alone;
- treat an institutional object record as automatic digital-reproduction permission;
- bypass an institutional copy/permission request where it is actually required;
- put a `rights-pending` or `blocked` record into the production Hall manifest;
- use AI as a historical facsimile/manuscript/signature;
- start production WebGL;
- redesign H3/R1;
- revive the rejected current L1 bake;
- promote `offlineVisualApproval`, `webVerticalSlice` or `fullMuseumScaleOut`.

Only after this acquisition/disposition checkpoint may one complete Blender/source offline Pushkin exhibit consume documentary media that the registry actually authorizes.
