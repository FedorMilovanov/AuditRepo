# Hall v3 topology selection — verified closure

Date: 2026-08-08
Lane: `TLP-HALL-001`
Product issue: `FedorMilovanov/TheLegendaryPoet#369`
Product PR: `#381`

## Production result

PR #381 selected one Hall v3 topology without approving a camera rig or changing production `/hall`.

- exact tested PR head: `2b0b674e5c1010927f7c50e496b5b33fd6ff781b`;
- squash merge / resulting Product `main`: `b97c851333c6a78869b78f762b2238b1dcd19fa8`;
- post-merge compare proved Product `main` identical to that merge SHA;
- final pre-merge base was `main@b9a01c411cf756b05eb690f9c761d22ac9bea61c`, branch `behind=0`;
- review surface before merge: `reviews=0`, `threads=0`.

## Decision

- `H3` — **advance**: single topology authority for Camera Approval;
- `H1` — **reserve**: route/orientation benchmark only;
- `H2` — **reject** for the current production path;
- `approvedRig=null`;
- common 35 mm shootout lens remains benchmark instrumentation only.

The lane advanced from `phase=metricGreybox` to `phase=cameraApproval`:

- foundation — completed;
- Reference Bible — completed;
- metricGreybox — completed;
- cameraApproval — active;
- materialLightingExportSpike and every later gate — blocked.

## Frozen shootout evidence

The topology decision remains bound to PR #376 exact-head Blender evidence:

- tested head `70aeb9c1aca4414d9cade3cb9cdcfb887b7ea806`;
- artifact `9021765090`;
- digest `sha256:598b2a60df72d9457e9b7620b5b7ea94fb59af8e0db60e11d334fbaaa94e8318`;
- H1 `32.1462 m / 2` forced turns;
- H2 `53.8854 m / 8` forced turns;
- H3 `37.8327 m / 4` forced turns.

PR #381 additionally froze the complete shootout source/provenance:

- `greybox-layouts.json` Git blob `b3def316d855a6539ffd280217ed63e22c6855d9`;
- candidate generator Git blob `7f5dbe64d61880031819a5d4e855e5c6b7285ef3`;
- architecture fingerprints, cameras, Pushkin proxy/document grammar, clearance probes and generator behavior cannot silently drift under the already-recorded decision.

## Exact-head reproduction for selection PR

Hall Blender workflow regenerated the frozen shootout on exact head `2b0b674e5c1010927f7c50e496b5b33fd6ff781b` using Blender 4.5.12 LTS build hash `84afd5f785f7`.

Fresh candidate artifact:

- artifact ID `9026469567`;
- digest `sha256:403b4ab484117a049e0d19cfe8af136b1784e32f859070f100fd4ccd800ffed5`;
- embedded witness `tested_commit=2b0b674e5c1010927f7c50e496b5b33fd6ff781b`;
- H1/H2/H3 route metrics and fingerprints matched the frozen evidence exactly;
- all 18 camera witnesses remained visible;
- all three Pushkin viewing pockets remained clear;
- each candidate retained at least two `1.525 m` stopping/two-way clearance witnesses;
- materials/lights remained `0/0`;
- 27/27 decoded PNG witnesses were pixel-identical to PR #376 evidence;
- 12/12 SVG plan/section/sightline witnesses were byte-identical.

## Guard hardening discovered during verification

The selection wave exposed three permanent-contract gaps and fixed them before merge:

1. Hall foundation validation previously stopped recognizing the lane after `metricGreybox`; it now preserves the legacy/Three/public-placeholder boundary through Camera Approval and declared later phases.
2. Reference Bible validation previously stopped at `metricGreybox`; it now remains completed permanent evidence after greybox.
3. Initial selection fingerprinting froze architecture but not the complete camera/exhibit/generator source; a separate provenance guard now freezes the complete shootout source and restores authoring-era tooling/equality/accessibility/render invariants.

The two authoring-only greybox validators were retired only after their persistent invariants were consolidated into topology-selection/provenance guards.

## Final exact-head barrier

All applicable workflows on `2b0b674e5c1010927f7c50e496b5b33fd6ff781b` were terminal-success before merge:

- Hall greybox tooling;
- Project Contracts;
- CI / typecheck / build / budgets / prerender / SEO;
- Site Route Integrity;
- Content Model;
- Brand raster;
- Brand deep reference/motion;
- Yesenin Part I browser acceptance;
- Yesenin Part II safe publication;
- Articles catalog acceptance;
- Manual Browser QA.

Manual Browser was re-certified after an obsolete earlier-head rerun temporarily superseded a current-head attempt through the PR-level concurrency group. Cancelled contaminated results were discarded. A clean current-head run passed Chromium/Android, fresh-process iPhone Safari, critical iPhone/reduced-motion, premium desktop and WebKit-home. No unrelated runtime patch was made.

## Next bounded wave

Camera Approval only, on frozen H3 topology.

The next transaction must create a separate camera authority rather than editing the historical shootout source. It must compare a small explicit guided rig/lens set and prove desktop, portrait-mobile and reduced-motion framing, with special attention to the known too-close/flat `pushkinViewing` portrait witness.

Still blocked: materials, lighting/export, finished Pushkin exhibit, rights-uncleared media, Three/R3F/WebGL production runtime and production `/hall` replacement.
