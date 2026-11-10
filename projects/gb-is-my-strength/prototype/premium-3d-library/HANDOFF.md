# Handoff — GB Premium 3D Library

## V5.32 handoff — separate casework from furniture, test every SHA

See [CASEWORK_GRAIN_PROVENANCE_V532.md](CASEWORK_GRAIN_PROVENANCE_V532.md). The new `CaseworkWoodProvider` is a real shared PBR-material owner with quality-profile loading, not global mutation of central furniture. Horizontal shelves and vertical uprights use different UV geographies through shared instanced geometries, preserving 20 bays and editorial navigation. Source CC0 six-channel manifest, no Poly Haven GLB. Local RTX3060 A/B and two-direction graphics quality passed. Require GitHub Preflight and full exact-head 47/47 Chromium/WebKit plus real PNG art review before engineering acceptance. Keep Draft / ART HOLD, no Product deploy.

---

## V5.31 material ownership — latest source

See [PBR_FLOOR_PROVENANCE_V531.md](PBR_FLOOR_PROVENANCE_V531.md) and the exact PR HEAD checks. The lab includes a honed CC0 stone floor with correctly color-managed 1024/512 PBR channels, shared R3F texture loader cache and byte-perfect signed source manifest; the old generated Canvas floor was retired. Local NVIDIA Chrome preview and bidirectional quality-switch witnesses were green. **Full exact-head GitHub Chromium/WebKit 47/47 remains mandatory after this source change**; do not project previous greens. Draft / ART HOLD, no public deployment or Product integration. Prior V5.30 notes below are historical evidence.

---

## Latest accepted engineering handoff — 2026-11-10, V5.30 (read first)

**Only working branch:** `lane/gb-premium-3d-library-lab-20261108`, existing [Draft PR #545](https://github.com/FedorMilovanov/AuditRepo/pull/545) in AuditRepo. No new branch or Product/main modifications; never merge or deploy without separate release approval. Confirm current PR SHA in GitHub before any modification.

**Terminal-green on exact commit `0754519`:** [Preflight #42829675469](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675469) SUCCESS and [Validate #42829675732](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675732) SUCCESS. The latter explicitly ended **nine suites / 47 cases PASS**, including six WebGL lost/restored/recovery/fallback cases, real two-tab IndexedDB cabinet, portrait/landscape UI, and bidirectional graphics quality. [59 real PNGs are attached](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42829675732/artifacts/13773466543). Do not repeat obsolete V5.23–V5.26 claims of an unclosed WebGL/CI gate; the older section below is archival.

**New architecture:** `src/scene/caseworkScale.ts` synchronizes shelf and decorative book sizes across `Architecture.tsx`, `ArchitecturalPolish.tsx` and fail-closed `scripts/verify-architecture.cjs`. 13 outer shelved bays × 12 rows × 38 volumes = **5,928 deterministic GPU instances**, correct 0.31–0.48 m tall books at a 0.59 m row pitch; preserved 20-bay hall and original input/navigation/data IDs. Not a photorealistic art certification.

**Priority:** approve one source-verified high-fidelity reference architectural area / GLB-PBR prop with comparative screenshots, texture provenance and measured draw calls/VRAM; then mobile and XR hardware evidence, accessible labels, Product rights/Reader integration. At least 15 minutes sustained target-device tests for GPU frame-time/thermal. The lab has a separate light 2D cabinet route `?panel=cabinet` and real context-loss fallback. Maintain readable UI and 47/47 on **every new SHA**, no test waivers.

**Everything below is a historical handoff excerpt, not current release status.**

---

## Current 2026-11-10 checkpoint (read first)

The sole active code is the existing [AuditRepo Draft PR #545](https://github.com/FedorMilovanov/AuditRepo/pull/545), branch `lane/gb-premium-3d-library-lab-20261108`. Confirm HEAD and exact-head runs in GitHub. **Do not merge, deploy, branch or change Product.** For full details and admission decisions consult [CURRENT_STATUS.md](CURRENT_STATUS.md); older V5.14/V5.7 reports remain historical, not current accepted evidence.

**Proven browser gates:** the mandatory [Validate #42802193147](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42802193147) proved 41 of the 47 browser journeys PASS, including both real-tab IndexedDB cases and both directions of graphical quality switching. [Validate #42805542724](https://github.com/FedorMilovanov/AuditRepo/actions/runs/42805542724) passed those 41 again but failed on loss-overlay visibility in the first WebGL recovery case. Both runs are **FAILURE** and **not equivalent to 47/47**; all six WebGL recovery scenarios remain a blocking gate.

**Code since those runs:** fail-closed event/UI diagnostics with real screenshot on WebGL loss, first-class visible 2D fallback, and **true lazy module separation**: `src/main.tsx` selects the public `?panel=cabinet` 2D entry without importing the WebGL/XR hall; normal hall still enters through `src/App.tsx`. CanvasTexture lifetime is explicitly owned by cards, tomes, plaques, center, floor, lectern and reading tablets, with StrictMode resource reupload. These changes need their own exact-head CI, updated PNG comparison and physical GPU evidence.

**Next order:** close the genuine WebGL loss/restore test without skipping or timeouts-as-PASS; terminal exact-head 47/47; real screenshots in Chrome/WebKit and real GPU; owner-approved premium GLB/UV/PBR authored reference bay and matching visual signoff; separately reviewed Product source, reader rights/privacy and staging. Keep the 2D fallback available even without WebGL. No claims that programming stability equals artistic signoff.


## CURRENT 2026-11-09 handoff (not the historical 2026-11-08 baseline)

**Read [CURRENT_STATUS.md](CURRENT_STATUS.md) first.** The sole active candidate
is existing AuditRepo Draft PR #545; its head is identified by GitHub, not by a
hard-coded historic SHA. V5.14 has source-owned real-browser witnesses and
performance controls; structural/Workflow Preflight success is **not** evidence
the library's own build and Playwright journeys have run in CI.

The conditional library-specific steps are now authored into the existing
AuditRepo Validate workflow. They run only when the lab path changes and
must pass on an exact PR head before any new technical acceptance claim.
The local regression runner demands nine suites / 47 browser scenarios,
plus Node lab/TypeScript/build/geometry checks. No new branches, no Product
repository writes and no hidden relaxation or skipping of errors.

**Still hard open:** naturalistic authored asset/GLB-PBR approval, controlled
GPU/device benchmark including iPhone Safari/Android/XR, persistent user-data
Product adapter, source-verified content licensing, public staging and owner
visual signoff. Real browser screenshots are separate from AI concept art.
Do not merge this Draft PR.


**2026-11-08; Lab V5.** Canonical candidate directory: `projects/gb-is-my-strength/prototype/premium-3d-library/`. Product is `FedorMilovanov/gb-is-my-strength`, not this AuditRepo directory. Keep one prototype lane and one draft PR. Do not touch AuditRepo #538, #543, #544 or Product PRs.

## Original provenance

- Primary: `originals/interactive-3d-card-cover(1).zip`, Arena Battle second card-cover version, SHA-256 recorded in `provenance.json`.
- Donor: `originals/interactive-3d-card-cover.zip`, first version for VR capability detection; preserve original bytes.
- `reference/library-design-target.png` is generated concept art only; it is not a screenshot and cannot be used to assert runtime parity.

## Entry points

`README-LAB.md` → `EXPERIENCE_BLUEPRINT_V5.md` → `CABINET_LAB_IMPLEMENTATION.md` / `PROGRESSION_SYSTEM_RFC.md` → current `src/` → `tests/`.

### Commands

```sh
npm ci
npm run lab:check
npm run lab:catalog:test
npm run lab:cabinet:test
npm run lab:progression:test
npm run lab:cabinet:types
npm run build
```

**Historical V5 baseline (2026-11-08; superseded by CURRENT_STATUS.md):** clean Windows `npm ci`, all five lab tests, strict `tsc --noEmit` and Vite production build passed. Isolated Chromium browser tested 1440×900 and mobile-emulated 390×844; NOT XR, FPS, WebKit, real Android or Product/live evidence. Read `QA_V5_REAL_BROWSER.md` and screenshots in `evidence/`. The ZIP is source transport, not a deployable site.

### Invariants

1. Source-owned public catalog only; no 3D hand-authored duplicate of Content/Route SSOT.
2. Lab vault in its own IndexedDB namespace, **not** Product GBReaderLibrary V3.
3. No automatic migration of demo earned XP into any future personal account.
4. Quotes require trustworthy edition/source and reviewed anchor before being presented as verified.
5. Do not ship anonymous local profile as a synced multi-device account.
6. No heavy renderer for default HTML reader/search; remain accessible without WebGL and with reduced motion.
7. Retain one active candidate, immutable originals, bounded evidence and clear promotion gates.
