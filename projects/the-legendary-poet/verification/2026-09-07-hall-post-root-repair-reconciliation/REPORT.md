# The Legendary Poet — Hall post-root repair reconciliation

Date: 2026-09-07
Audit owner: AuditRepo issue #389
Product: `FedorMilovanov/TheLegendaryPoet`

## Scope

This package reconciles the bounded Hall engineering repair chain completed after the terminal Hall v3 architecture root. It does **not** reopen `TLP-HALL-001`, promote a new architecture lane, grant documentary production rights, approve the offline scene, activate production `/hall`, or authorize WebGL/full-museum scale-out.

## Product #440 / PR #441 — material-response remediation

- Reproduced defect: the source-based Pushkin exhibit inherited mathematically sharp exhibit edges and flat/constant material response on locally authored exhibit objects even though the Hall visual acceptance contract required natural bevel/normal response and roughness variation under neutral light.
- Repair: bounded exhibit-local bevel treatment plus deterministic, physically bounded roughness/normal response for charcoal, warm stone, linen, paper and brass.
- Frozen authority preserved: H3 topology, R1 camera, L0 minimal-runtime lighting, metre-scaled UV0, canonical documentary bytes and production boundary.
- Exact certified Product head: `127278125e6a71108101e011bd92193a3349b074`.
- Squash merge: `864a4099f98d2c5087652b22f01cd0573c40ddaa`.
- Evidence completed before merge: ten fixed desktop/mobile stills, 5x2 contact sheet, raw + optimized GLB, Khronos validation, first-slice offline budget, authored 24-second walkthrough, ffprobe verification and semantic evidence validation.
- Disposition: engineering/material-response defect closed; human `offlineVisualApproval` remained false and production/WebGL gates remained false.

## Product #442 / PR #443 — explicit tangent portability

- Reproduced defect: all 16 normal-mapped exhibit primitives relied on runtime-generated tangent space, producing `MESH_PRIMITIVE_GENERATED_TANGENT_SPACE` portability warnings in both raw and optimized GLB validation.
- Repair: Blender 4.5.12 export now explicitly requests tangent attributes; the permanent validator parses both raw and optimized GLB JSON and requires a real `TANGENT` accessor on every normal-mapped primitive.
- Exact certified Product head: `1014ddb2ea3f0c301353ba403110dcdc81626dcf`.
- Squash merge: `f0fd0da0e05079973ceba94bea0e2298fd5e0fa6`.
- Post-merge Product evidence: Hall Pushkin visual-remediation push run #11 completed successfully on the merge SHA; Manual Browser QA also completed successfully on the same Product main.
- Artifact: `hall-pushkin-visual-remediation-f0fd0da0e05079973ceba94bea0e2298fd5e0fa6` (GitHub Actions artifact id `10025554142`, about 56.96 MB at reconciliation time).
- Verified artifact facts: raw and optimized GLBs contain explicit `TANGENT` on all 16/16 normal-mapped primitives; the former generated-tangent-space warning is absent; documentary source bytes remain preserved; the 24-second walkthrough and fixed still/contact-sheet evidence remain present.
- Disposition: tangent portability defect closed without introducing post-export binary surgery or changing visual/production authority.

## Product #445 / PR #446 — browser build-budget evidence hardening

- Scope: close the evidence gap where the Hall first-slice build budget could be asserted from generated/offline artifacts without an equally explicit browser-consumable production-build witness.
- Repair: hardened the browser build-budget evidence path while preserving the existing first-slice performance contract and Hall authority boundaries.
- Squash merge: `623c7812a5c3060d61a028a2e6c03a34b33b0f28`.
- Disposition: build-budget evidence hardening merged as an independent CI/evidence repair; it did not activate production WebGL or widen the Hall rollout.

## Product #448 / PR #449 — exact-head Hall merge certification

- Scope: remove the possibility that a historical Hall success could be treated as current PR merge proof after the visual-remediation head changed.
- Repair: the always-present `merge-certification` aggregate now has a separate conditional Hall visual-remediation lane that waits for and requires the Hall result on the exact PR head while preserving the existing offline-exhibit lane and stable aggregate status.
- Squash merge/current Product main before the final transport repair: `54b9b9e7729eb08fb25e80579af007ca345a4322`.
- Disposition: same-head Hall proof is now a fail-closed merge barrier; older successful Hall artifacts remain diagnostic only.

## Product #444 / PR #447 — redundant UV transport cleanup — pending final merge proof

- Reproduced defect: the lookdev candidate carried redundant UV transport beyond authoritative `UV0` on the bounded Pushkin target set.
- Repair under certification: a post-lookdev cleanup stage retains only authoritative `UV0`, re-saves the candidate blend, re-exports the raw GLB and re-renders all ten fixed stills. A fail-closed validator requires TEXCOORD_0-only lookdev transport and preserves 16/16 explicit tangents.
- Frozen authority remains unchanged: H3/R1/L0/UV0, documentary bytes, visual acceptance contract and all owner/production gates.
- Previous exact-head Hall run #13 completed cleanup, raw/optimized Khronos validation, Meshopt, first-slice budget and contact-sheet construction, then hit the job-level 100-minute execution timeout during the authored walkthrough before ffprobe/final evidence upload. This was an incomplete proof, not accepted merge evidence.
- Execution-budget repair: Hall job timeout is bounded at 130 minutes; render quality, acceptance criteria and evidence semantics are unchanged. Relative to the previous repair head, the effective workflow diff is exactly `timeout-minutes: 100` → `130`.
- Current exact Product head: `bcb246e158be4d69bd98ec2402f3176234f25e49`.
- Required final proof: fresh Hall visual-remediation run #15 plus aggregate `merge-certification` run #38 on that same exact head, followed by artifact-level forensic verification and CAS merge.
- Disposition: **not yet closed** in this report. Final merge SHA and exact-head artifact id must be recorded before the reconciliation can enter the closure ledger.

## Preserved owner-gated boundary

Across the repair chain:

- current machine stage remains `pushkinVerticalSlice`;
- production `/hall` remains the lightweight DOM placeholder;
- production Three/R3F/WebGL remains blocked;
- documentary production rights/credit disposition remains owner/legal-gated;
- `offlineVisualApproval` remains human-owner-only and is not implied by CI, Blender evidence or this reconciliation;
- `webVerticalSlice` and `fullMuseumScaleOut` remain blocked until their own authority/evidence exists;
- forensic branch `archive/deep-research-local-images-20260724` remains evidence-only and untouched.

## Reconciliation conclusion

The completed post-root waves are legitimate closed engineering/evidence repairs, not evidence that the museum itself is production-complete. The reconciliation remains open solely for Product #444/#447 exact-head proof, merge and final provenance recording. AuditRepo must continue to state that no autonomous Hall architecture transaction is selected.
