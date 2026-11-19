# Личная библиотека · Premium Lab V4 · implementation record

**Status:** isolated local prototype, **NOT** Product. No PR, push, release or migration. 2026-11-08.

## Why this implementation exists

The 3D library is intended to be a spatial navigation layer for `gospod-bog.ru`, alongside the canonical reading experience and a private reading cabinet. The Product already has `GBReaderLibrary V3`, Favorite Store, `ReaderState`, `GBSearch` and preference owners. **The code in this Lab is not a competing Product authority.** It has a separate database name and unrelated demo identities. Before any implementation in Product, build an adapter from current Product-owned data and confirm owner boundaries.

## Implemented and testable now

- Pure TypeScript domain engine: `src/cabinet/engine.ts`, independent of DOM, React and Three.js.
- Validated bookmark records, excerpts with `exact`/`prefix`/`suffix` (W3C TextQuoteSelector-inspired), source attribution and optional personal note.
- Explicit `anchorStatus: needs-review`; manually pasted excerpts never become verified historical quotations, even if they have source metadata.
- Collections with stable identifiers, duplicate detection, referential validation and cascade cleanup when a saved record is deleted. Deleting a collection **does not** delete its contents.
- Strict same-origin route-shaped path normalization, Unicode-aware quote matching, ambiguous/missing matching detection. The Lab path allowlist is *not* a substitute for the Product's publication/route registry.
- JSON export / fail-closed import with bounded sizes and version schema; invalid imports preserve existing entries. Exports contain potentially private quotes and notes; no automatic uploading.
- `src/cabinet/storage.ts`: dedicated IndexedDB snapshot, commit-completion acknowledgment and atomic compare-and-write protection against two-tab overwrites. User-confirmed full import is the only path which bypasses the expected-state comparison; even then a corrupted current DB cannot be overwritten silently.
- `src/cabinet/CabinetPanel.tsx`: real React lab panel with bookmarks, excerpts and collections, keyboard focus management, feedback, import/export and local persistence.
- 3D scene: opening the personal cabinet suppresses movement controls and cursor lock; the cabinet remains available when WebGL cannot initialize.
- `preview/cabinet.html`: standalone browser preview built from the **same TS domain and persistence source** (`scripts/build-cabinet-preview.cjs`), not a divergent manually implemented points/cabinet engine.

## Source-of-truth and publication boundary

The `SOURCES` list in the local React panel is derived from Arena's selected sample `ITEMS`. Their `contentId` prefix is `lab:`, *not Product canonical content IDs*. Preview fixture sources are similarly demo-only. Do **not** publish this catalog as site truth, award XP for it or assume source anchors/URL availability without checking the current Product registry.

The parent project's `README.md`, `AGENTS.md`, `AGENTS-REFERENCE.md`, current route registries, Product Reader adapters and `docs/REFERENCE_TRANSFER_POLICY.md` remain authoritative. No write to them has been made.

## Focus and failure semantics

- The user may open Cabinet even when 3D fails; keyboard focus starts at the Close button.
- When the panel is active, `App.tsx` and `relock()` suppress 3D navigation. Opening the panel clears any previously depressed movement keys. Closing returns focus to the invoking control through the existing Overlay mechanism.
- If storage is inaccessible or corrupt, `CabinetPanel` fails closed and does not overwrite saved bytes.
- In the independent HTML preview only, the browser's *opaque origin* may deny IndexedDB. In that situation the preview clearly switches to a **volatile demonstration mode**, with explicit warning: the test records disappear when the page closes. The React component does **not** silently switch to volatile mode.
- A conflicting write from another tab aborts atomically instead of overwriting it. The current prototype tells the user to reopen the panel to reload the latest snapshot. An eventual Product adapter needs a fuller merge/conflict UX.

## Verification actually performed

| Test | Observed result | Scope |
|---|---|---|
| `tsc -p tsconfig.lab-cabinet.json` | PASS | strict typing of **cabinet engine and IDB adapter only** |
| `node tests/cabinet.cjs` | PASS | URL boundary, valid source metadata, duplicates, quote selectors, malformed imports, collection references, Unicode offsets |
| `node tests/progression.cjs` | PASS | existing learning-level engine invariants |
| `node scripts/verify-architecture.cjs` | PASS | syntax/import and scene structural checks; not full bundler |
| `python tests/cabinet-browser-smoke.py` | PASS | Chromium 1440×960 / 390×844 / 320×760, quote/bookmark/collection/export/import, XSS text rendering, keyboard controls where applicable, no horizontal overflow |
| `python tests/browser-smoke.py` | PASS | existing progression standalone UX at three sizes |
| `npm run build` / full project `tsc` | **NOT VERIFIED** | incomplete npm dependencies in the local container |
| Real persistent IndexedDB browser transaction / two-tab conflict | **NOT VERIFIED** | sandbox blocks navigation to a non-opaque origin; code reviewed/typechecked but not accepted as browser-proven |
| Real WebGL scene / GPU FPS / mobile GPU | **NOT VERIFIED** | no full scene browser launch or performance witness |

### Reproduce without Product access

```bash
npm ci
npm run lab:cabinet:types
npm run lab:cabinet:test
npm run lab:progression:test
npm run lab:check
node scripts/build-cabinet-preview.cjs
python tests/cabinet-browser-smoke.py
python tests/browser-smoke.py
npm run build
```

The HTML preview can be opened independently. If the browser refuses storage on `file://`, it will visibly use an in-memory demonstration, not assert persistence. Full IndexedDB testing requires a real local HTTP origin and a browser with the required permissions.

## Remaining Product-ready gates

1. Inspect Product's current exact-head `GBReaderLibrary V3`, Favorite Store, `ReaderState` and route registry. Choose a **single semantic owner** for each record; no dual-write runtime.
2. Generate a published-only catalog from Product source, not the Arena `ITEMS`. Validate exact routes, anchors and revisions.
3. Save actual selected text from the reader using a canonical source edition, license/rights checks, normalized prefix/suffix and a verified anchor strategy. Never silently re-anchor an ambiguous excerpt.
4. Define migration from anonymous local data, version upgrades, export/delete, and multi-tab/conflict UX; test IndexedDB transaction behavior under a real origin.
5. Visual review of actual React and WebGL application desktop/mobile screenshots; keyboard-only and reduced-motion; Chromium and WebKit; real GPU loss/restoration and memory/fps measurement.
6. Agree explicit Product owner scope and promotion mode, then separately execute Product-owned PR and production release checks if authorized.

## Primary references

- W3C Web Annotation Data Model: https://www.w3.org/TR/annotation-model/
- Three.js resource lifetime: https://threejs.org/manual/en/how-to-dispose-of-objects.html
- AuditRepo Prototype Lab: https://github.com/FedorMilovanov/AuditRepo/blob/main/references/PROTOTYPE_LAB.md
- Product transfer policy: https://github.com/FedorMilovanov/gb-is-my-strength/blob/main/docs/REFERENCE_TRANSFER_POLICY.md

## Progression hardening in the same V4 pass

- Added strict `inspectProgress` validation; malformed demo-local ledgers are **not silently repaired and overwritten**.
- `record` rejects future-dated events; review delays cannot be circumvented by sending dates in the future.
- Invalid reward wallet, duplicate actions and forged XP are detected by new unit assertions.
- The older compatibility `parseProgress` still exists for tests and non-authoritative recovery, but the live Lab progression panel uses the strict validator.

This does **not** transform local XP into server-trusted certification; only a verified Product event adapter may award real XP later.
