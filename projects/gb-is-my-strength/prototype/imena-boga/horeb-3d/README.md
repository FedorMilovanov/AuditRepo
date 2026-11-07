# HOREB 3D — living names of God (Arena prototype)

**Lab status:** INTAKE — original source pending import from the user-supplied Arena ZIP. **Not Product, not production, not editorially approved.**

This is a **new third prototype** alongside Atlas and Sozvezdie, not a replacement for either. Purpose: maintain and incrementally improve an existing Three.js / React / TypeScript first-person 3D pilgrimage toward the burning bush, with a separate scene/exhibit for each biblical context.

## Immutable intake identity
- Source supplied to ChatGPT 2026-11-08: `---.zip`
- SHA-256 of original ZIP: `c2267894e1369f96244f0df9b78b51acfc5ccfeb4838f25037b2ec1551b14fa9`
- Inspected: 54 entries; archive contains source, tests, docs, generated .test-build, generated HTML reader; no traversal, symlink, or encrypted entries.
- Existing 25 content cards, eight zones, Three.js scene and engine. Not yet 42 distinct canonical scenes.
- Imported precompiled unit checks run locally at intake: **24/24 PASS**. Not proof of a fresh production build.
- Fresh npm install/build/browser runs **not repeated in ChatGPT sandbox**, where network/npm dependencies were unavailable.
- `public/fonts/*.woff2` were **absent** in ZIP; generator `tests/generate-reader.mjs` expects `@fontsource` npm dependencies and generates these files.
- The archive will be stored at `original/arena-horeb-original.zip` when imported, with source unpacked directly in this folder. Preserve the original ZIP and its SHA permanently.

## Working contract
1. Check `SOURCE_PROVENANCE.md` and `AGENT_HANDOFF.md`. **Do not create an unrelated rebuild** when the source has not yet been imported.
2. AuditRepo is the prototype lab. Research [#379](https://github.com/FedorMilovanov/Research/pull/379) is scholarly evidence; still publication HOLD. Atlas/Sozvezdie are independent working siblings under [AuditRepo #538](https://github.com/FedorMilovanov/AuditRepo/pull/538).
3. No changes to `gb-is-my-strength`, the live `gospod-bog.ru` site, or Research without separate owner-approved Product handoff.
4. One canonical HOREB branch and one draft PR; do not create version-folder forks, overwrite other agents' work or silently merge/deploy.
5. Continue existing source, run actual tests and browser screenshot checks, and keep each item's scriptural reference, historical speaker/referent, and editorial HOLD precise.

**Current handoff blocker:** ZIP source must be pushed into this branch with SHA match. This README and the draft PR alone do **not** mean that source was imported.
