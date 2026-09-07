# The Legendary Poet — Hall post-root repair reconciliation

Date: 2026-09-07
Audit owner: AuditRepo issue #389
Product: `FedorMilovanov/TheLegendaryPoet`

## Scope

This package reconciles two bounded Hall engineering repair waves completed after the terminal Hall v3 architecture root. It does **not** reopen `TLP-HALL-001`, promote a new architecture lane, grant documentary production rights, approve the offline scene, activate production `/hall`, or authorize WebGL/full-museum scale-out.

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
- Squash merge/current Product main at reconciliation selection: `f0fd0da0e05079973ceba94bea0e2298fd5e0fa6`.
- Post-merge Product evidence: Hall Pushkin visual-remediation push run #11 completed successfully on the merge SHA; Manual Browser QA also completed successfully on the same Product main.
- Artifact: `hall-pushkin-visual-remediation-f0fd0da0e05079973ceba94bea0e2298fd5e0fa6` (GitHub Actions artifact id `10025554142`, about 56.96 MB at reconciliation time).
- Verified artifact facts: raw and optimized GLBs contain explicit `TANGENT` on all 16/16 normal-mapped primitives; the former generated-tangent-space warning is absent; documentary source bytes remain preserved; the 24-second walkthrough and fixed still/contact-sheet evidence remain present.
- Disposition: tangent portability defect closed without introducing post-export binary surgery or changing visual/production authority.

## Preserved owner-gated boundary

After both repairs:

- current machine stage remains `pushkinVerticalSlice`;
- production `/hall` remains the lightweight DOM placeholder;
- production Three/R3F/WebGL remains blocked;
- documentary production rights/credit disposition remains owner/legal-gated;
- `offlineVisualApproval` remains human-owner-only and is not implied by CI, Blender evidence or this reconciliation;
- `webVerticalSlice` and `fullMuseumScaleOut` remain blocked until their own authority/evidence exists;
- forensic branch `archive/deep-research-local-images-20260724` remains evidence-only and untouched.

## Reconciliation conclusion

The two post-root engineering repairs are legitimate closed repair waves, not evidence that the museum itself is production-complete. AuditRepo should preserve them as closure provenance while continuing to state that no autonomous Hall architecture transaction is selected.
