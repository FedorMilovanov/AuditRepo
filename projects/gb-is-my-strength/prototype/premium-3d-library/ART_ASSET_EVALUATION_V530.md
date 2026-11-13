# Premium 3D Library — real PBR asset research and admission log

Date: 2026-11-10. **Art evaluation only.** The code in sole existing AuditRepo Draft PR #545 remains LAB / ART HOLD. Product, main, public deployment and editorial data are not modified by this research.

## Current authenticated baseline

The current 12-row procedural casework uses a physically plausible 0.31–0.48 m folio height and 0.59 m shelf pitch; its deterministic 5,928 instances are **one GPU-instanced decorative set**, not source-verified theological book titles. Exact-head [CI #42829675732](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675732) on `0754519` ended **47/47 browser PASS** and Preflight SUCCESS, with [59 real PNGs](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675732/artifacts/13773466543). Latest actual screenshots still show flat, relatively repetitive distant bookspines, sparse furnishings and very uniform pale floor. This is an unsatisfied **visual direction gate**, not a functional failure.

## Candidate PBR shelf prop, source and rights

- **Publisher:** Poly Haven, **Book Encyclopedia Set 01**, by **John Malcolm**, [publisher page](https://polyhaven.com/a/book_encyclopedia_set_01) and [CC0 policy](https://polyhaven.com/license). CC0 permits adaptation and distribution; still label the model as *decorative encyclopedias*, never authenticated Christian-book content or a sourced theological edition.
- **Publisher 1K glTF:** eight source files, verified to match publisher-provided MD5 values, **3,261,046 bytes** in total; 20 meshes, 67,306 triangles, two glTF PBR materials, six 1K texture maps. No binaries imported into this PR.
- **Isolated Windows transformation:** `@gltf-transform/cli@4.5.1` packed source into a **3,236,272-byte GLB**. WebP-texture/Meshopt optimized candidate **568,720 bytes** with glTF validator **zero errors** but tangent-space warnings for two normal-mapped mesh primitives. Do not use until those warnings are resolved for portable cross-engine PBR. Initial tangent-generation candidate was **1,293,900 bytes**, before final optimization and screenshot certification.
- **Alternative:** [ambientCG Leather 019](https://ambientcg.com/view?id=Leather019) 1K source ZIP downloaded, archive verified; visual review found near-uniform dark albedo and fine normal noise, unsuitable as the only main-shot premium material. No asset committed.

### Evaluation implementation / evidence state

A *temporary, isolated, detached-checkout* Windows prototype tested importing the optimized GLB into one reference shelf using Drei `useGLTF(..., false, true)` for Meshopt and a discrete React Suspense boundary. The optional authored prop is **restricted to the high graphics preset**, deliberately not included in WebGL-less cabinet, low-quality mode, navigation hit targets, editorial IDs or saved user data. TypeScript `tsc --noEmit` and Vite production build **passed locally**, but the Desktop Commander agent restarted during the real browser GLB/network/screenshot test: **no valid final PNG, no verified 200 response and no full browser acceptance for this model**. The candidate is therefore **NOT in GitHub**, not accepted as an asset, not a new branch, not shipped; retry the actual preview only on the exact source commit and clean up temporary files after confirmation.

This avoids a classic false positive: asset optimizes and compiles without proving that its colors, normal directions, tangent space, position, performance or frame composition are correct in either browser.

## Acceptance checklist before any binary lands in PR

1. Resolve both glTF tangent-space warnings or document a verified equivalent normal-map strategy. Confirm glTF validator **zero errors, zero portable-material warnings**, WebP color vs linear texture channels, Meshopt decode in the actually bundled Three.js/R3F version. Preserve original author/source/CC0/license provenance and hashes.
2. Stage **one** detailed reference shelf in a separate local checkout. Compare actual **fixed-camera** PNG before/after in Chromium and Playwright WebKit, plus at least one real GPU browser. Verify mesh physically rests on the shelf and does not penetrate joinery, occlude signage or alter walking bounds.
3. Measure model request/decoded texture size and real GPU timing/VRAM delta vs baseline; inspect both graphics presets and 390x844, 844x390, 1440x900. Decorative mesh must not block hall startup or WebGL-free reader, and must fail visibly in test if referenced file is missing.
4. After source inclusion, add fail-closed reproducibility tests for file existence, license inventory, clean model validator, successful real network loading, screenshot evidence, no JS/HTTP failures, and all **47/47** original browser cases on the **new exact SHA**. No test waivers, fake camera state, placeholder art or binary-only undocumented imports.
5. Only then decide whether the single artwork materially improves the interior. A complete premium library still needs coherent authored timber/stone, historically literate furnishings, architectural lighting and controlled real-device sustained performance. A lone 67K-triangle prop cannot replace this art pass.

Keep Draft / ART HOLD until visual owner approval, physical mobile/XR/performance and separate Product/Reader/rights gates.
