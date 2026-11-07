# Имена Бога — v0.6 Visual Interaction & Motion Research

**2026-11-07. Статус:** source candidate v0.6 generated separately from the immutable Arena originals. `gb-is-my-strength` Product, live pages and [Research #379](https://github.com/FedorMilovanov/Research/pull/379) were not modified. This document is a QA/evidence handoff, **not** a claim that v0.6 complete source was uploaded into this PR or merged.

## Changes (bounded, three source files relative to v0.5)

- **Atlas / SacredAstrolabeHero:** focus within medallion now holds autoplay; bubbling `blur` from its child buttons no longer restarts the rotating name while keyboard users operate the dots. On coarse-pointer devices Canvas DPR capped at 1.5; desktop retains up to 2.
- **Constellation / NameTree:** orbit buttons gain `ArrowLeft/ArrowRight`, `Home/End` traversal, a visible keyboard focus outline and accessible group instructions. Tab/Enter remain native controls.
- **Constellation / Starfield:** listen to live OS `prefers-reduced-motion` changes and stop/restart requestAnimationFrame accordingly, also on tab visibility; clean up matchMedia listener on unmount.

These changes are visual/interaction/performance only. `src/data/divineNames.ts`, `src/data/names.ts` and `public/images/sinai-dawn.jpg` remain byte-for-byte unchanged versus v0.5. Hebrew/Greek, attribution, rights and published textual correctness remain held for Research.

## Verification performed on v0.6 source

- Existing static guards: 85 + 6 + 13 + 24 + 22 = **150/150 PASS**.
- New visual/interaction guards: **16/16 PASS** (total static **166/166**).
- TypeScript syntax parser: **41 TS/TSX files, 0 syntax diagnostics**.
- Executed exact `Starfield.tsx` effect with deterministic DOM/RAF mocks: **9 lifecycle assertions PASS** (start, OS motion change stop/restart, visibility stop/restart, full cleanup).
- Executed exact `NameTree.tsx` keyboard handler with deterministic focus mocks: **7 assertions PASS** (arrow wrap, Home/End, native Enter not stolen).
- ZIP package integrity: **PASS**; two separately downloadable sources and combined bundle.
- **Not verified:** exact v0.6 `npm ci`, `vite build`, full `tsc --noEmit`, Chromium/WebKit route/interaction screenshots or performance measurements. These must run before promotion; any successful build of Arena originals or isolated v0.5 visual proxy is not a v0.6 build.

## Preservation / next steps

Candidate delivered in current ChatGPT artifact `imena_boga_two_flagships_v06_bundle.zip` (SHA256 `9b025686e46a63ee7f6fb5da35d895bb4e29b657144e858827bcd7b7cee3544e`). User must retain/export that artifact: **this PR currently records the evidence, not the v0.6 source**.

For next technical wave: rehydrate exact candidate under `projects/gb-is-my-strength/prototype/imena-boga/candidates/v06/`, after checking current owners. Run standalone build + browser QA, compare in owner-reviewed screenshots at 320/390/768/1440/1920 and reduced motion. Carry only approved interactions as Astro React islands into Product in a separate bounded lane. Do not make Research's blocked data public or replace Product's canonical Reader/Search/SEO.
