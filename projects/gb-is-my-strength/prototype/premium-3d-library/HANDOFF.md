# Handoff — GB Premium 3D Library

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
