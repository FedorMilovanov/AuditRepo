# Hall v3 — neutral metric H1/H2/H3 candidate evidence

Date: 2026-08-08
Lane: `TLP-HALL-001`
Product issue: #369
Product PR: #376 — `architecture(hall): author neutral H1 H2 H3 greyboxes`

## Exact production transition

- Product base was refreshed to `main@e2b25ff4742ffc0152d5be572f20e9cb34670b51` after an independent Yesenin Part II media-rights repair advanced `main` during Hall verification.
- Exact tested Hall PR head: `70aeb9c1aca4414d9cade3cb9cdcfb887b7ea806`.
- Squash merge / resulting Product `main`: `66dabcdcff5fa0fc8ad8fde44544432e4a144e4d`.
- Post-merge Product compare proved `main` identical to `66dabcdcff5fa0fc8ad8fde44544432e4a144e4d`.
- Final PR compare before merge was `behind=0`; review submissions and review threads were both empty.

## Scope that merged

The wave authored three materially different **offline neutral metric** Hall candidates under one shared reproducible Blender pipeline. It did not select a topology winner and did not approve a camera rig.

Source authority added/advanced:

- `docs/hall-v3/greybox-layouts.json` — auditable metre-scale H1/H2/H3 geometry/data;
- `docs/hall-v3/greybox-candidates.json` — equal-comparison manifest, all candidates `source-defined`;
- `scripts/hall-greybox/generate-candidates.py` — one common candidate generator;
- `scripts/validate-hall-greybox-candidates.ts` — static and generated-evidence validation;
- `Hall greybox tooling` workflow — exact-head Blender generation/evidence.

Production `/hall` remained a lightweight DOM placeholder. No `src/` or `public/` Hall runtime asset was added. Three/R3F/WebGL, GLB export, materials, lighting, textures and final documentary assets remained outside this transaction.

## Blender/runtime witness

Exact-head Hall workflow run: `31257108424`.

Pinned runtime:

- Blender `4.5.12 LTS`;
- Blender build hash `84afd5f785f7`;
- vendor archive checksum verified before execution;
- Ubuntu headless Workbench uses only the minimal `libegl1` runtime dependency;
- metre scene units, scale `1.0`;
- common human proxy `1.75 m`;
- common comparison lens `35 mm`, explicitly test-only/not approved;
- scene materials `0` and lights `0`.

Exact-head DCC hardening:

- workflow derives `TESTED_SHA` from the literal PR head;
- checkout explicitly uses `ref: TESTED_SHA`;
- `git rev-parse HEAD` must equal `TESTED_SHA` before generation;
- both generated artifacts retain `hall-greybox-tested-head.txt`.

Candidate artifact:

- artifact ID `9021765090`;
- digest `sha256:598b2a60df72d9457e9b7620b5b7ea94fb59af8e0db60e11d334fbaaa94e8318`;
- embedded witness `tested_commit=70aeb9c1aca4414d9cade3cb9cdcfb887b7ea806`.

Tooling artifact:

- artifact ID `9021764647`;
- digest `sha256:cc0a4b1ca670aa14f53ec0e4a836d409b0f2241dbd83cb5ff55b445bdd5bbe67`.

## Candidate metrics

| Candidate | Route length | Forced turns | Evidence disposition after authoring |
| --- | ---: | ---: | --- |
| H1 — orientation court + chronological branches | `32.1462 m` | `2` | viable benchmark/reserve; shortest and clearest, but central composition risks reading as generic/ceremonial |
| H2 — directed chronological promenade + focus bays | `53.8854 m` | `8` | highest route/turn cost and most corridor-like; requires unusually strong compensating benefit to survive selection |
| H3 — asymmetric/diagonal trajectory + side focus rooms | `37.8327 m` | `4` | strongest provisional topology candidate; changing diagonal sightlines and stronger spatial identity at moderate route cost |

These dispositions are **audit observations only**. The merged Product source still has `approvedCandidate=null`.

## Evidence completeness

For each candidate the exact-head artifact contains:

- 6 common desktop camera witnesses;
- 3 equivalent 9:16 mobile witnesses;
- dimensioned plan;
- 2 sections;
- route/sightline diagram;
- generated route length and forced-turn count;
- Pushkin viewing-clearance witness;
- saved `.blend` source-art evidence.

All 18 certified camera witnesses passed. Every `pushkinViewing` ray first hit exactly `EXHIBIT_alexander-pushkin`; walls or other meshes remain blocking occluders. All three Pushkin viewing pockets were clear and met the inherited minimum viewing witness.

The 27 exact-head PNG witnesses were pixel-identical to the prior certified artifact from before the final exact-head CI hardening, proving that the hardening changed provenance/identity evidence rather than Hall composition.

## Blocking defects found and repaired during audit

1. A pre-reload `bpy.context.scene` handle was reused after `.blend` reopen; the generator now reacquires the live scene.
2. Real Workbench rendering reproduced missing `libEGL.so.1`; the workflow installs only `libegl1` rather than broad graphics tooling.
3. H1/H3 source walls physically crossed declared route/certified sightlines; real portal gaps were authored.
4. Static validation now rejects baseline route or certified camera→nextDestination wall crossings before the expensive Blender run.
5. `pushkinViewing` initially treated the intended Pushkin object as an occluder; generated evidence now succeeds only when the **first** ray hit is the intended Pushkin proxy, while every other hit remains failure.
6. Route lengths/turn counts remain generated measurements instead of manually authored outcome values.
7. Pull-request DCC evidence was hardened from default merge-ref semantics to literal exact-head checkout/identity proof.

No validator threshold was weakened to make H1/H2/H3 pass.

## Exact-head merge barrier

On `70aeb9c1aca4414d9cade3cb9cdcfb887b7ea806` all executable PR workflows were terminal success before merge:

- CI;
- Project contracts;
- Hall greybox tooling;
- Manual Browser QA — core Chromium/Android + fresh-process iPhone Safari, WebKit-home, premium desktop and critical iPhone all success;
- Site route integrity audit;
- Brand deep reference/motion audit;
- Brand raster QA;
- Articles catalog acceptance;
- Content model contract;
- Yesenin Part I browser acceptance;
- Yesenin Part II safe publication.

Request Pages deployment was expectedly skipped.

## Visual decision boundary

Neutral evidence supports a separate topology decision, but **not camera approval**:

- H1 has the clearest/shortest circulation but a less distinctive central spatial idea;
- H2 has the greatest chronological promenade emphasis but pays `53.8854 m / 8` turns and reads most corridor-like;
- H3 has the strongest spatial identity and changing diagonal sightlines with a substantially lower route cost than H2;
- the common `35 mm` `pushkinViewing` portrait crop is too close/flat across the three candidates, so approving topology must not silently approve this camera set.

## Next bounded transaction

Run a separate current-head **select/reject topology** wave:

1. start from fresh Product `main@66dabcdcff5fa0fc8ad8fde44544432e4a144e4d` and re-check source PRs/race before mutation;
2. consume the exact candidate artifact/metrics above without changing H1/H2/H3 geometry merely to justify a preferred outcome;
3. make candidate dispositions explicit and machine-readable;
4. evidence currently supports advancing H3 provisionally, retaining H1 as a reserve/orientation benchmark and rejecting or parking H2 for excessive route/turn cost without enough compensating spatial value;
5. keep `approvedRig=null` and the 35 mm set test-only;
6. complete `metricGreybox` only if the topology decision is explicit and reproducible;
7. activate `cameraApproval` as the next separate gate, focused especially on Pushkin approach/view framing and 9:16 composition;
8. keep material/light/export, Pushkin final slice, WebGL runtime and production `/hall` changes blocked.

`TLP-HALL-001` remains open.