# TLP-HALL-001 — metric-greybox tooling/preflight

Recorded: 2026-08-08  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #369  
Product PR: #375  
Base before wave: `cc81858626c8ddcf8e59016231068c45cbb6e246`  
Exact tested Product head: `4d4c1b8e6c1832dce6eac6a2509d76bce65cc724`  
Product squash merge / resulting main: `c34debc7ec3cf769261779d763f21f617a3500a2`  
Audit lane: `TLP-HALL-001`

## Disposition

**TOOLING/PREFLIGHT MERGED / metric-greybox gate remains ACTIVE / lane remains OPEN.**

This transaction proves the Blender modelling environment and equal-candidate contract before serious Hall geometry is authored. It does not complete Gate 2, choose H1/H2/H3, approve a camera, or publish any 3D runtime.

## Reproducible Blender witness

The exact PR head passed the dedicated `Hall greybox tooling` workflow (run `31246753758`). The workflow:

1. downloaded `blender-4.5.12-linux-x64.tar.xz` from the official Blender 4.5 release archive;
2. downloaded the Blender 4.5.12 vendor checksum index and verified the Linux archive with `sha256sum -c`;
3. launched Blender headlessly with embedded auto-execution disabled and Python exceptions mapped to a non-zero exit code;
4. created a minimal metric smoke scene using repository-owned Python;
5. saved `tooling-smoke.blend` and reopened it;
6. validated the generated JSON witness through the repository machine contract;
7. uploaded the JSON and `.blend` only as temporary CI artifacts, not Product source authority.

Downloaded workflow artifact: `hall-greybox-tooling-4d4c1b8e6c1832dce6eac6a2509d76bce65cc724` / artifact id `9018818728`.

The generated `preflight.json` proves:

- Blender `4.5.12 LTS`;
- version tuple `[4,5,12]`;
- build hash `84afd5f785f7`;
- background/headless mode true;
- scene name `HALL_GREYBOX_TOOLING_PREFLIGHT`;
- unit system `METRIC`;
- length unit `METERS`;
- scale length `1.0`;
- required collections `COLL_CAMERAS`, `COLL_CORE`, `COLL_EXPORT_HELPERS`;
- required objects `CAM_TOOLING_PREFLIGHT`, `HUMAN_PROXY`, `TOOLING_FLOOR`;
- human proxy height `1.75 m`;
- tooling-only camera lens `35 mm`;
- zero materials;
- zero lights;
- save/reopen round trip true;
- rendered false.

The uploaded smoke `.blend` was about 390 KB; the full workflow artifact was about 88 KB compressed by GitHub according to Actions artifact metadata. The tooling witness therefore proves DCC identity and scene semantics without adding a production-art binary to the repository.

## Source contracts merged

Product `main` now carries:

- `docs/hall-v3/greybox-tooling.json` — pinned current-phase Blender runtime and smoke-scene contract;
- `docs/hall-v3/greybox-candidates.json` — H1/H2/H3 equal-comparison manifest;
- `scripts/hall-greybox/blender-tooling-preflight.py` — deterministic Blender smoke source;
- `scripts/validate-hall-greybox-tooling.ts` — static/runtime evidence validator;
- `.github/workflows/hall-greybox-tooling.yml` — path-scoped real-Blender witness with concurrency cancellation;
- persistent foundation and Reference Bible invariants extended through `metricGreybox`.

`hall-v3-contract.json` now records:

- `foundation=completed`;
- `referenceBible=completed`;
- `metricGreybox=active`;
- all later gates blocked;
- production `/hall` still a placeholder with legacy/Three/concept-art prohibitions.

The completed Reference Bible remains provenance/evidence authority. Its topology/camera decisions remain `null`.

## Equal-candidate contract

H1/H2/H3 all remain `unbuilt`; no candidate, camera rig or lens set is approved.

Every eventual candidate inherits:

- metres from first blockout;
- common 1.75 m human proxy;
- 0.915 m one-way route witness;
- 1.525 m two-way/stopping-friendly route witness;
- 0.76×1.22 m accessible viewing clearance;
- 2.03 m clear headroom;
- neutral material only;
- no ornament, bloom, fog, particles or gold-glow rescue;
- no FPS/free-look dependency;
- the same six camera witness positions;
- at least three equivalent mobile crops;
- identical plan/section/sightline/route-metric outputs;
- automatic rejection rules before material work.

## Audit findings caught before merge

The tooling wave itself found and repaired several real contract defects before merge:

1. the persistent foundation guard initially recognized only `foundation` and `referenceBible`; it was extended to keep the same legacy/Three/public-route invariants through `metricGreybox` rather than being disabled;
2. the completed Reference Bible machine state initially disagreed with human `REFERENCE_BIBLE.md` / `SPATIAL_BRIEF.md` status prose; the prose was corrected to Gate 1 completed / Gate 2 active;
3. the first Blender workflow trigger was too broad (`docs/hall-v3/**`) and would have downloaded ~360 MB of Blender for unrelated rights/doc edits; it was narrowed to actual tooling/phase/candidate authority paths;
4. superseded Blender workflow attempts auto-cancel correctly through workflow concurrency, avoiding the earlier generic Project-contract queue-debt pattern.

No extra validator was added solely to police the two corrected prose labels; the project retained machine ownership without turning the audit into check proliferation.

## Exact-head gates

All effective PR-triggered workflows on exact tested head `4d4c1b8e6c1832dce6eac6a2509d76bce65cc724` were terminal green before merge:

- `CI` — run `31246753688`: success;
- `Project contracts` — run `31246753641`: success;
- `Hall greybox tooling` — run `31246753758`: success;
- `Manual Browser QA` — run `31246753671`: success;
- `Site route integrity audit` — run `31246753718`: success;
- `Brand deep reference and motion audit` — run `31246753651`: success;
- `Brand raster QA` — run `31246753675`: success;
- `Content model contract` — run `31246753664`: success;
- `Articles catalog acceptance` — run `31246753645`: success;
- `Yesenin Part I browser acceptance` — run `31246753748`: success;
- `Yesenin Part II safe publication` — run `31246753643`: success.

`Request Pages deployment` — run `31246753705` — was skipped as expected.

Manual Browser was fully green for desktop WebKit, core Chromium/Android, fresh-process iPhone Safari, critical/reduced-motion iPhone and premium desktop/pointer contours.

Immediately before merge:

- Product `main` was still exact `cc81858626c8ddcf8e59016231068c45cbb6e246`;
- branch was seventeen commits ahead / zero behind;
- PR head remained exact `4d4c1b8e6c1832dce6eac6a2509d76bce65cc724`;
- PR was mergeable;
- review threads: 0;
- submitted reviews: 0.

PR #375 was marked ready and squash-merged with expected-head protection for the exact tested SHA.

## Resulting source truth

Product `main` resulting merge:

`c34debc7ec3cf769261779d763f21f617a3500a2`

## Next allowed wave

**Actual H1/H2/H3 neutral metric candidate authoring.**

Start from fresh `main@c34debc7ec3cf769261779d763f21f617a3500a2`. Use the proven Blender environment and author all three candidates under equal-quality constraints. The useful output is comparable offline spatial evidence, not production WebGL.

Do not:

- select the preferred topology before all three comparable evidence packages exist;
- introduce materials/lookdev beyond neutral grey;
- use per-candidate flattering lenses;
- start glTF/WebGL delivery;
- publish greybox art on `/hall`;
- make rights-uncleared documentary images part of the candidate source.

Gate 2 remains active until H1/H2/H3 evidence is comparable and a candidate is selected or all are explicitly rejected.