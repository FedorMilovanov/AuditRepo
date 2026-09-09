# TERMINAL REVERIFY — TLP-HOME-MEDIA-PERF-001

Date: 2026-09-09  
Audit owner: `TLP-HOME-MEDIA-PERF-001`  
Audit issue: #420  
Product issue: `FedorMilovanov/TheLegendaryPoet#471`  
Product PR: `FedorMilovanov/TheLegendaryPoet#472`

## Terminal verdict

`TLP-HOME-MEDIA-PERF-001` is closed by a bounded Product repair and exact-head browser/static certification. Product #472 was certified at exact head `4d7b9c506dc7d959b770ebb0c00a941b0d684ee6` against base `304771e0b7f22e90c0ec7e36b9d361cb95cba79a`, then CAS-squash merged with that expected head as Product `main@11e086ef289e3dc1ab55bff8a6664c78d2cb2761`.

Tested and resulting Product trees are identical: `132238e81b4a8caf09083b4641aac624fb20427c`. No untested source-tree delta entered through the squash merge. Product issue #471 closed as `completed` with the merge.

## Bounded implementation

The permanent Product diff remained exactly 20 HOME-media files after the final merge-forward; `behind=0` and no reader/Hall/package/metadata surface remained in the diff.

The repair establishes one explicit home-portrait lifecycle:

1. only the first two hero portraits are critical and use `loading=eager` + `fetchPriority=high`;
2. portraits 3–6 are not released until the real browser `window.load` boundary and the next animation frame;
3. all six portraits expose real 320w/480w responsive JPEG candidates while the 1000w originals remain the authoritative top candidate;
4. the fallback `src` is itself bounded to 320w, avoiding a transient full-size request while responsive metadata settles;
5. `ResilientImage` keeps responsive candidates inside the primary-source authority lane so fallback semantics cannot be bypassed by stale `srcset`;
6. layout proof uses transform-independent offset geometry rather than transient compositor transforms.

## Static fail-closed authority

`scripts/validate-home-media-perf.mjs` owns the permanent source/build contract. It verifies all 12 derivative files and dimensions (`320x400` / `480x600`), critical byte ceilings, lifecycle/source policy and permanent runner wiring, and explicitly rejects the invalid proof mechanisms found during the candidate cycle (Resource Timing dependence, Playwright callback ordering as load authority, intercepted-response gating as load authority, and `getBoundingClientRect()` as the layout-stability denominator).

Critical first-pair budgets are:

- 320w: `18,987 B <= 32 KiB`;
- 480w: `37,962 B <= 56 KiB`.

## Exact-head workflow proof

All merge-authoritative PR-triggered workflows completed on exact head `4d7b9c506dc7d959b770ebb0c00a941b0d684ee6`:

- CI #3931 — run `34339693516` — `success`;
- Project contracts #1042 — run `34339693554` — `success`;
- Site route integrity audit #1937 — run `34339693506` — `success`;
- Brand deep reference and motion audit #1954 — run `34339693511` — `success`;
- Manual Browser QA #2990 — run `34339693502` — `success`;
- Merge certification #80 — run `34339693520` — `success`;
- Request Pages deployment #2309 — expected `skipped`.

Manual Browser #2990 completed all four jobs successfully: `browser-qa`, `webkit-home-reveal-qa`, `premium-iphone-critical-qa`, and `premium-home-qa`.

The core Chromium/Android matrix completed with `154 passed / 14 skipped / 0 failed`. The base iPhone Safari harness then executed 17 fresh-process contours and all 17 passed. The inherited `reader-journeys` contour passed 5/5 in its first fresh-process run, so the final HOME certification does not rely on a retry of the earlier reader stabilization failure.

## Browser artifacts

Exact-head browser artifacts recorded for the terminal wave:

- core Manual Browser evidence: artifact `10100354498`, digest `sha256:ed1cd8f0e24276722a28e1c12284a519d2e32c1e1ccb27f904c62ddef726caef`, size `162,557,589 B`;
- WebKit HOME reveal: artifact `10099916463`, digest `sha256:eee6489d802245e0adb582d76f236e87d505d1c587ef612fef48d9daba50c40a`;
- premium HOME: artifact `10099898223`, digest `sha256:ba1a27d20563f433eca6ee7bc38748a5f8e18c50c3724d4d59afd196ae0e2ea8`;
- premium iPhone critical: artifact `10099800200`, digest `sha256:d4d9d6ae1b5ae711e6f224a7c4738bb627f84600250ce379db1c6c9253bfcd24`;
- production-build diagnostics: artifact `10099797761`, digest `sha256:faedd28cdba3688a0bc385726263dce50c354d44c2f87941021016f976fe14d8`.

The focused HOME browser contract proves the real browser-side `window.load` timestamp precedes all four deferred releases, exactly six bounded derivative portrait requests occur, the selected `currentSrc` belongs to the expected candidate universe, all six portraits decode, and layout geometry remains stable.

## Final race and matrix disposition

Immediately before CAS merge:

- Product `main` remained `304771e0b7f22e90c0ec7e36b9d361cb95cba79a`;
- PR head remained `4d7b9c506dc7d959b770ebb0c00a941b0d684ee6`;
- compare was `behind=0`;
- permanent diff was exactly 20 HOME files;
- submitted reviews = 0;
- review threads = 0.

Audit disposition: remove only `TLP-HOME-MEDIA-PERF-001`. P1 remains 1, P2 remains 11, P3 changes `2 -> 1`, and total active changes `14 -> 13`. `TLP-AUDIT-004` is narrowed by this exact outcome proof but remains active for its other independent proxy/false-green gaps. No other engineering root, Hall documentary/rightsholder boundary, or live Cloudflare/D1 production gate is reclassified by this transaction.
