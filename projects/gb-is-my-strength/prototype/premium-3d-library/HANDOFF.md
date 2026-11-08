# Handoff — GB Premium 3D Library

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

**New V5 witness (2026-11-08):** clean Windows `npm ci`, all five lab tests, strict `tsc --noEmit` and Vite production build passed. Isolated Chromium browser tested 1440×900 and mobile-emulated 390×844; NOT XR, FPS, WebKit, real Android or Product/live evidence. Read `QA_V5_REAL_BROWSER.md` and screenshots in `evidence/`. The ZIP is source transport, not a deployable site.

### Invariants

1. Source-owned public catalog only; no 3D hand-authored duplicate of Content/Route SSOT.
2. Lab vault in its own IndexedDB namespace, **not** Product GBReaderLibrary V3.
3. No automatic migration of demo earned XP into any future personal account.
4. Quotes require trustworthy edition/source and reviewed anchor before being presented as verified.
5. Do not ship anonymous local profile as a synced multi-device account.
6. No heavy renderer for default HTML reader/search; remain accessible without WebGL and with reduced motion.
7. Retain one active candidate, immutable originals, bounded evidence and clear promotion gates.
