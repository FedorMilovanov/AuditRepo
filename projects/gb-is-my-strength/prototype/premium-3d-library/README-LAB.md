# Господь Бог — сила моя / Premium 3D Library Lab

**Experimental candidate V5 — 8 November 2026. Prototype Lab only; not Product or production.**

Original reference: `interactive-3d-card-cover(1).zip` (Arena Battle hall second edition).
The original archive is NOT overwritten; this is a derived standalone working tree.
The first Arena card edition is used for the missing `immersive-vr` capability check.

## Direction

Natural daylight, limestone shell, deep timber shelves, real reading tables,
physically shaded non-emissive materials. Inspiration image lives in
`reference/library-design-target.png` and is an **AI concept, not a running-app screenshot**.
The current source is a structural/lighting study, not claimed to match that photo.

## Current V5 checks and unresolved visual quality (2026-11-08)

Authorized Windows: clean npm install, five lab checks, full strict TypeScript and Vite split-assets build **PASS**. Separate headless Chromium opened cabinet, progression and actual hall at 1440×900 / 390×844. **3D art is still visibly schematic; mobile HUD has layout overlap.** Neither visual approval nor GPU FPS, XR, WebKit or Product integration is claimed. See `QA_V5_REAL_BROWSER.md` and real screenshots in `evidence/`. Earlier V3/V4 QA descriptions below are historical snapshots.

Default Vite build uses cached split JS/CSS/assets with relative base, rather than forced 8.16MB single HTML. `GB_LIBRARY_SINGLE_FILE=1` is reserved for optional archival export.

## Run after dependency installation

```sh
npm ci
npm run lab:check
npx tsc --noEmit
npm run build
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/`. Optional `?debug3d=1` prints periodic client FPS and
DPR to the browser developer console. Preserve folder `public/covers` when
hosting in a subdirectory or packaging a one-file HTML build.

## QA snapshot (original 3D scene; new cabinet checks separately below)

- PASS: static syntax parser on 24 TS/TSX files, local import resolution, scene
  invariants, VR detection presence, and required cover assets.
- NOT RUN: npm dependency install, full TS typecheck, Vite build, live browser
  screenshot, device-specific FPS, WebXR session, or real GPU-loss recovery.
  This environment had no network access to the npm registry; partial
  `node_modules` installation was intentionally excluded from the archive.

## Architecture

- The intro camera now moves slowly inside the architecture rather than orbiting outside the new bookcase envelope. Reduced-motion users get a fixed view.

- Three.js / React Three Fiber WebGL2 remains the primary renderer. Do not
  switch to WebGPU before porting GLSL shader materials to TSL and verifying
  parity for XR and postprocessing.
- Architecture uses deterministic book instancing rather than hundreds of
  individual React components; 13 bays x 6 shelves x 22 books = **1,716**
  rectangular placeholder books in one instanced mesh.
- High resolution floor texture 2048²; low resolution 1024².
- GPU fill-rate mitigation: gradual DPR adaptation before binary auto-quality
  downgrade (thresholds are hypotheses until real benchmark).
- Editorial content and route ownership stay in Product; this lab is not a
  duplicated source-of-truth for the published site.

See `ART_DIRECTION.md` for detailed source links and next quality gates.

## V5: content catalog admission and multi-layer design

- Read-only Product-policy projection: `src/catalog/adapter.ts` with `tests/catalog.cjs`. Noindex, non-searchable and unpublished routes do not appear in catalog; historical `src/data.ts` remains a standalone Arena fixture until replaced through Product-owned registry.
- Canonical timestamps and bounded journal in progression, preserving compatibility with previous valid UTC strings.
- Full cabinet import uses optimistic compare-and-write, so another tab cannot silently overwrite data during file confirmation.
- `EXPERIENCE_BLUEPRINT_V5.md` defines seven spatial levels, cabinet, rewards, 2D fallback, GPU/a11y and Product admission.
- `HANDOFF.md` defines collaboration and next reproducible gates.

## Extension RFC

The reader cabinet / spatial sitemap concept (proposal only) is documented in `PERSONAL_LIBRARY_RFC.md`. It does not replace Product reader/Favorite Store owners or implement account sync.

## V4: личный кабинет — реализованная лабораторная вертикаль

- **Working domain and UI:** `src/cabinet/engine.ts`, `storage.ts`, `CabinetPanel.tsx` — локальные закладки, атрибутированные личные выписки, тематические полки, JSON export/import и явные ошибки.
- **Data safety:** fail-closed import, validated same-origin routes, text rather than HTML for personal excerpts, optimistic two-tab conflict prevention in an IndexedDB transaction; no Product private-storage keys touched.
- **Accessibility/3D:** modal focus handling, suppressed camera keys/pointer lock, available when WebGL fails.
- **Direct preview:** `preview/cabinet.html`, from `node scripts/build-cabinet-preview.cjs`; standalone browser mode transparently switches to volatile data when loaded from an opaque origin. It does not claim persistent storage there.
- **Verification:** TS typecheck of both cabinet and progression engines plus cabinet storage; pure-engine tests; Chromium standalone UX smoke tests on 1440×960, 390×844 and 320×760. **Not yet verified:** full React/Vite build, persistent IndexedDB at a real origin, WebGL/FPS, Product adapter.

See `CABINET_LAB_IMPLEMENTATION.md` for the real acceptance matrix and open Product integration gates.

## Учебные уровни — новая локальная экспериментальная версия

- `PROGRESSION_SYSTEM_RFC.md`: десять ступеней, очки за подтверждённое изучение, награды, защита от накрутки, библиография.
- `src/progression/engine.ts`: единый расчёт очков и жетонов, дедупликация, сроки повторений и косметические приобретения.
- `src/progression/ProgressPanel.tsx`: панель «Путь исследователя» в локальном 3D-прототипе; в меню есть отдельная кнопка.
- `preview/progression.html`: самостоятельный просмотр **без React/3D/npm**, тестовые действия и симуляция кабинета, не связан с реальными данными сайта.
- `node tests/progression.cjs`: тесты инвариантов. `node scripts/build-progression-preview.cjs`: пересборка standalone HTML из общего движка.
- Поскольку `node_modules` в предоставленной среде оказались неполными, **Vite build / browser WebGL / production integration не подтверждены**. HTML-просмотр — лабораторная демонстрация, не релиз Product.

### Browser evidence for independent HTML panel

PASS (2026-11-08): Chromium/Playwright standalone HTML tested at 1440×960, 390×844, 320×760. Tabs, XP simulation, dedup, reward purchase, token deduction, badges, reset and no horizontal overflow; no page errors. Screenshots: `preview/progression-1440.png`, `preview/progression-390.png`, `preview/progression-320.png`. The browser test uses `page.set_content()` because the sandbox restricts direct `file://` and localhost navigation. **This does not validate the full WebGL/React app**.

## V4 progress-integrity correction

The progression panel now uses strict `inspectProgress` for stored demo ledger imports. Future-dated XP, malformed entries and impossible token purchases cannot be silently credited; bad saved state is not overwritten without an explicit reset. See `PROGRESSION_SYSTEM_RFC.md`.

## V5.2 — architecture craftsmanship (lab / art hold)

See [ART_V52_ENGINEERING.md](ART_V52_ENGINEERING.md) and the real Chromium/WebKit snapshots in evidence/art-v52/. Source-owned procedural PBR maps and instanced architectural trims are **experimental**, not a photorealistic sign-off. Product, Reader and user account remain unchanged.
