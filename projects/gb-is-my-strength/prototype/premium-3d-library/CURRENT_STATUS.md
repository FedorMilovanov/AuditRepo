# Premium 3D Library — current engineering truth and admission gates

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
