# Premium 3D Library — current engineering truth and admission gates

## V5.31 floor-material candidate — current source

The active Draft PR #545 now contains a source-verified ambientCG CC0 **honed stone PBR floor** (color/normal/roughness in 1024/512px presets). Provenance, roughness remapping, SHA-256, colour spaces and target-size budget: [PBR_FLOOR_PROVENANCE_V531.md](PBR_FLOOR_PROVENANCE_V531.md). Local NVIDIA RTX 3060 Chrome (1440×900 and touch-emulated 390×844) checked WebGL2, actual CDN-free material loads, viewport images and both directions of graphics quality without errors. **Do not infer the latest SHA's 47/47 from the former exact-head V5.30 green run; check current GitHub Actions.** The artistic quality gate and real mobile/XR performance remain HARD OPEN. No Product/main writes or deployment.

---

## Current verified checkpoint — 2026-11-10, V5.30

**Active engineering candidate:** sole existing [AuditRepo Draft PR #545](https://github.com/FedorMilovanov/AuditRepo/pull/545), branch `lane/gb-premium-3d-library-lab-20261108`; source of truth is the latest **exact PR HEAD** from GitHub. The historical 2026-11-09 and V5.23–V5.26 sections below are **superseded** and must not be read as current unclosed defects.

**Latest verified exact-head CI:**
- SHA `0754519ab904d934c00b5801dd0522e12155dfd9`: [AuditRepo Workflow Preflight #42829675469](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675469) **SUCCESS**; [AuditRepo Validate #42829675732](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675732) **SUCCESS**; its log explicitly reports **9/9 suites, 47/47 browser cases PASS** on one SHA. Evidence: [59 genuine PNGs](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675732/artifacts/13773466543), Chromium and Playwright WebKit at desktop/portrait/landscape resolutions, including six WebGL recovery tests and genuine two-tab cabinet persistence.
- Prior [#42824278435](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42824278435) at `e0f5b7c` was likewise **47/47 PASS** after the sitemap scrollport fix: heading remains stationary after search and independently scrollable results. Do not aggregate cases across SHAs.
- The latest artistic-scale source introduces immutable `src/scene/caseworkScale.ts`, shared by `Architecture.tsx` and `ArchitecturalPolish.tsx`. Outer bay geometry and circulation remain unchanged. Thirteen shelved bays × twelve shelves × 38 slim books = **5,928** GPU-instanced decorative folios, rather than 1,716 oversized volumes; book heights 0.31–0.48 world metres, shelf pitch 0.59m. `scripts/verify-architecture.cjs` validates the real shared geometry: book-width/height clearance, upper cornice clearance, expected bay and instance count. **A procedural folio is decorative geometry, not a claimed source-verified title.**
- Screenshot witness review: the increased shelf density improves scale and reduces empty gaps; portrait plaque title remains readable on both engines; site-map title remains visible in WebKit after search, and the tour/minimap no longer overlap. **These are tested code and image observations, not an approval of photorealistic design.**
- The isolated Windows NVIDIA RTX 3060 Direct3D11 and Windows SwiftShader real-browser tests confirmed genuine WebGL loss→restoration and 2D fallback on same prior SHA. Short 180-frame rAF sampling was approximately 60Hz, but is **not GPU frame-time or sustained performance certification**.

**Still HARD OPEN, without waivers:**
1. **Art direction:** real high-fidelity licensed/owned glTF/UV/PBR reference prop(s), correct lighting/material identity, lifelike joinery and furniture, source provenance, actual side-by-side screenshots and owner's visual approval. Procedural book count is not itself a premium-art acceptance gate.
2. **Physical-device performance:** actual iPhone Safari, Android, XR headset, assisted tech and 15+ minute cold/warm GPU frame-time, VRAM/thermal/long-session sampling on target devices. Linux CI SwiftShader and Windows RTX/Chrome are not substitutes.
3. **Product/readers/rights:** Product-owned content route/catalog/Reader/data rights approval and migration policy remain separate; no transfer of lab-local IndexedDB profiles to real user accounts by assumption.
4. **No live deployment, merge, main changes or additional branches**. Keep PR Draft / LAB / ART HOLD.

---
**Historical evidence below — retained for traceability, superseded as live status by V5.30 above.**


## Current live checkpoint — 2026-11-10, V5.23–V5.26

**Single candidate:** existing [Draft PR #545](https://github.com/FedorMilovanov/AuditRepo/pull/545), branch `lane/gb-premium-3d-library-lab-20261108`. The active SHA is whatever GitHub reports for that PR, **not the V5.14 historical baseline below**. No Product/main writes, new branch, deployment, merge or approved premium art release.

### Verified browser evidence, not projections

- [Validate #42802193147](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42802193147) on `200ece88`: **FAILURE**, but the first eight suites completed **41/41 PASS** (12 interaction, 4 architecture, 4 central book, 6 touch HUD, 5 reference bay, 4 photo, 4 true bidirectional quality transitions, 2 real-origin IndexedDB cabinet tests). 52 real screenshot artifacts. **WebGL recovery suite failed at first Chromium 1440×900 software renderer case** after a context restore attempt.
- [Validate #42805542724](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42805542724) on `0a6d960`: **FAILURE** at the first WebGL loss overlay witness; all previous 41 browser cases were PASS again, including explicit manually-owned texture lifetime changes. This is a *different failure stage*, not a validated recovery. Browser snapshot and runtime fault-event evidence is needed to determine whether the renderer throws, the lost event is missing, or an alternate UI replaces the overlay.
- Current later PR commits add **fail-closed lost-event diagnostics with screenshot** and a true separately loaded 2D cabinet bootstrap. Require fresh **exact-head** CI to accept those changes; do **not** combine older PASS results across SHAs or claim 47/47.
- [Actual old-run visual audit](https://github.com/FedorMilovanov/AuditRepo/pull/545#issuecomment-6764874310) and [implementation report](https://github.com/FedorMilovanov/AuditRepo/pull/545#issuecomment-6765457215): the fixed overlay-card double lettering, portrait plaque fitting (both engines), readable opaque sitemap and tablet tour/minimap separation have source changes and 41-case browser evidence. Initial map vs search-scrolled map are now distinct screenshots. These do not imply owner-approved premium architectural art.
- Software-GPU quality-switch latency and screenshot readback remain costly on Chromium SwiftShader; no real-device GPU frame-time, mobile thermal or VRAM certification. The production renderer uses the tested R3F/WebGL stack, not an unreviewed WebGPU swap.

### Current hard-open admission gates

1. **WebGL loss + restore**: retain strict evidence of actual `webglcontextlost` cancellation and `webglcontextrestored` from the same context. 2D cabinet and original-site fallback must remain functional when restoration is impossible. Six recovery cases and exact-head **47/47** remain unaccepted until a full terminal-green Validate run.
2. **Visual premium art**: current screenshots are real but still too schematic (repetitive books, sparse authored furniture, uniform flooring, stylized displays). Build and approve a genuine glTF/UV/PBR architectural reference bay with original/CC0-licensed provenance and performance budgets, then expand it; never treat concept art as real screenshot evidence.
3. **Physical devices/performance**: actual desktop GPU, physical iOS Safari/Android, XR, assistive technologies, thermal/VRAM, cold/warm shader compilation and sustained use remain not tested.
4. **Product/readers/rights**: only verified Product-owned route/catalog/Reader state and publication rights may cross the lab boundary by separately approved PR; independent local IndexedDB lab demo never automatically migrates.

The **V5.14 matrix that follows is historical**, and its 31-case Windows/lab measurements have been superseded by later 47-case exact-head checks.

**Updated:** 2026-11-09. **One candidate:** AuditRepo [Draft PR #545](https://github.com/FedorMilovanov/AuditRepo/pull/545), branch `lane/gb-premium-3d-library-lab-20261108`. **Last independently confirmed pre-CI baseline:** `63db5d5347c5662ed7cb01bdfebde2267ca52158` (V5.14). For the current PR head, always query GitHub; do not infer it from a versioned report. The branch must stay Draft / LAB / ART HOLD until each release gate below passes.

**Product:** [FedorMilovanov/gb-is-my-strength](https://github.com/FedorMilovanov/gb-is-my-strength). This AuditRepo lab is **not** Product, and no content, saved bookmarks, Reader or main branch has been updated by its V5.0–V5.14 lab waves. No production URL or deployment is asserted. A Windows localhost `dist/` preview is not an externally reachable deployment.

## Source-of-truth ordering

1. **Current code and tests** under `src/`, `tests/` and `scripts/`.
2. **GitHub exact-head job logs**, including the new conditional library check inside the existing required `AuditRepo Validate` workflow; distinguish repo-level preflight from actual 3D build and browser journeys.
3. **Evidence and immutable manifests** for specific V5.7–V5.14 commits in `evidence/` and `V5*_MANIFEST.json`.
4. **Historic V5 docs** (`QA_V5_REAL_BROWSER.md`, `QA_V57_CONTROL_VISUAL_AUDIT.md`, `ART_DIRECTION.md` and early sections of `README-LAB.md`): observations when written, not live admission statuses.
5. AI-generated `reference/library-design-target.png` is a **mood target only**, never a captured browser frame or ground truth for achieved artistic fidelity.

Do not count a historical PASS for a later SHA. A clean `AuditRepo Validate` without the library branch trigger is only a repo-rules PASS; to certify the 3D candidate, inspect the exact-head job and the individual lab steps. The new conditional workflow requires a real run before its Linux browser behavior can be marked accepted.

## Current system matrix (V5.14 engineering state)

| Area | Implemented and locally witnessed | Not certified / remaining gate |
| --- | --- | --- |
| WebGL2 Hall | Real React/Three.js scene; normal entry, walk/tour, station cards, deterministic instanced bookshelf books | Artistic realism and physical hardware stability |
| Geometry and scene | Daylight architecture, limestone/dark timber, windows, domed roof, PBR details in four contiguous shelf bays; 20 vaulted ribs share one instance geometry; inclined central open book | Professionally authored, complete coherent GLB/UV/PBR furniture and architecture; owner reference-matched approval |
| UX and accessibility | P0 small-landscape entry and P1 sitemap modal/focus repaired V5.8; photo veil repaired V5.9; quality transition coverage V5.10; portrait camera V5.11; browser screenshot witnesses | Real assistive technology, physical touch/VR; focus and WebGL context recovery across devices |
| Static cab/progression | Demo IndexedDB vault, local import guard, rank/XP simulator and optional cosmetic unlocks; bounded pure-engine tests | Product GBReaderLibrary V3 data, cross-tab/origin and real-user data lifecycle, cloud sync and exact quote provenance |
| Public catalog | Fail-closed, read-only adapter accepts supplied route policy and metadata | Live Product content/route/rights/noindex projection not implemented |
| Performance | Chrome desktop measured around 60 rAF/s in short tests; instanced art lowered submitted draw calls; WebKit emulation observed around 25–30 rAF/s on desktop | Repeatable controlled GPU frame timings, VRAM/thermals, actual iOS Safari, Android, VR; unresolved first graphics-quality switch stall |
| Quality gates | On the V5.14 candidate, five lab checks, TS, production build, 31/31 public browser cases, geometry equivalence and GitHub AuditRepo structural/preflight checks passed | Mandatory automatic **exact-head library** CI newly authored here; require actual GitHub success on its first run and future changes |
| Publication | One Draft PR with checked provenance and screenshot evidence | Owner signoff, Product promotion PR, genuine publicly accessible preview and deployment |

### Precision on performance

Browser `requestAnimationFrame` cadence is not measured GPU frame time. The Windows Playwright WebKit backend is not actual iPhone Safari, and mobile viewports are emulated on the Windows machine. The V5.14 roof optimization reduced observed draw calls per frame by **7–13**, not a proof of guaranteed real-world frame-rate gains. Initial quality changes can still delay the renderer ~0.8–2 seconds. Unproven tweaks (permanent shadow quality or frozen floor texture resolution) were tested in V5.11 and **rejected**, not silently shipped.

### Previously observed P0/P1 closure details

- V5.7 A-01 inaccessible landscape CTA: fixed with scrollable responsive cover in V5.8, tested in 12 browser scenarios including 844×390.
- V5.7 A-02 inaccessible sitemap dialog: real dialog with focus trap/restore, named search and close action, inert app background in V5.8.
- V5.7 A-03 incomplete art fidelity: **OPEN**. Additional joinery in V5.13 is not proof of whole-hall premium architecture.
- V5.7 A-04 slow desktop WebKit: **OPEN**, hardware and GPU timing not proven.
- V5.7 A-05 Product catalog/cabinet mismatch: **OPEN**.
- V5.7 A-06 portrait framing: improved V5.11 on 320/390 touch emulation; physical-device signoff OPEN.
- V5.7 A-07 photo veil: fixed V5.9 with a dedicated browser witness. First-quality-switch **runtime stall** is still open.
- V5.7 A-08 QA automation: source-owned regressions exist; new conditional GitHub CI must pass and remain enforced.
- V5.7 A-09 heavy initial JS: ~1.46 MB minified main JS (~414 KB gzip), while large XR chunks are already lazy. Coverage/long-task profiling required, not blind file splitting.

## Permanent check commands (from lab root)

```sh
npm ci --no-audit --no-fund
npm run lab:check
npm run lab:catalog:test
npm run lab:cabinet:test
npm run lab:progression:test
npm run lab:cabinet:types
node tests/vault-rib-equivalence.mjs
npx tsc --noEmit
npm run build
python tests/browser-runner-contract.py
# Python Playwright 1.62.0 and browser binaries must be installed.
python scripts/run-browser-regression.py
```

The final runner serves `dist/` on ephemeral loopback and demands nine non-skipped suites: **12 interaction + 4 architecture + 4 central book + 6 mobile HUD + 5 reference bay + 4 photo + 4 quality + 2 cabinet IndexedDB + 6 WebGL recovery/fallback = 47 cases** (quality also checks both switch directions). Screenshot witnesses go into an external temporary directory, not tracked `evidence/`. No runtime patch or debug camera teleport is allowed.

## Wave sequence and safe ownership

- **Wave 0: baseline audit and ownership** — maintain one branch and one Draft PR, immutable original ZIPs, no interference with other AuditRepo agents/PRs, no Product writes. **Complete.**
- **Wave 1: required library-specific CI** — existing repo Validate must run Node lab/typecheck/build, exact 3D scene browser journeys, fail-closed witness and geometry checks when this lab changes. **Implementation in progress; gate closes only after exact-head GitHub success.**
- **Wave 2: truthful current documentation** — this status is canonical; update README/HANDOFF/blueprint front matter, retain historical audit evidence and stop calling old FAIL current. **In progress.**
- **Wave 3: art asset standard** — build one human-approved convincing architecture/reading bay with UV/PBR and authentic furniture, with licensed authored glTF/GLB provenance and fixed-camera before/after. Expand only after owner approval, without scattering independent decorative primitives. **OPEN.**
- **Wave 4: renderer stability and mobile hardware** — instrument main thread/GL compile/long tasks/context loss with reproducible runs; physical Safari/Android/VR and thermal/VRAM testing. No GPU hacks or unsupported FPS claims. **OPEN.**
- **Wave 5: source-owned Product bridge** — implement read-only catalog projection, verified rights/noindex and reader/cabinet contracts on an approved Product head; migrate no demo XP or personal data implicitly. **OPEN.**
- **Wave 6: staging/live promotion** — accessible 2D fallback + security/rights/privacy checks + owner's artistic signoff; only then exact-head separate Product PR, staging and release. **OPEN.**

**Stop condition:** No merge, publication, Product copy, cloud sync or claim of "full zero" while any Wave 3–6 acceptance is still open. Passing a CI gate is necessary but insufficient for premium artistic acceptance.
