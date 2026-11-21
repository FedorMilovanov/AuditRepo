# Visual Flagships v0.7 — scoped visual-engine corrections

**Date:** 2026-11-07. **Owner:** AuditRepo prototype laboratory for `gb-is-my-strength`. **State:** reference/candidate only; no Product branch, deploy, Research corpus edit, or live claim.

## Candidate lineage

Arena A/B original ZIP (four unique late/early snapshots preserved in this PR) → v0.1–v0.6 candidates → v0.7 combined bundle created in the associated ChatGPT work session.

v0.7 source artifacts from that session:
- `imena_boga_atlas_v07_source.zip` — SHA-256 `9ba471b1a32b5e3a0e6b47045b00d36498df5474d627aea6e0ca151b47ced53c`;
- `imena_boga_sozvezdie_v07_source.zip` — SHA-256 `95b0c95b798e630eb43c884ebfea2e727c96975203ce207fdfddaa9a5041d71e`;
- combined `imena_boga_two_flagships_v07_bundle.zip` — SHA-256 `c370de3e4291d4ec2349c99f89ed9a7b0f539743b8d1a11e98bb3775eede5227`.

**These ZIPs are attached to the conversation, not uploaded to AuditRepo by this documentation-only commit.** The originals in `originals/` and `reference/` are unchanged. We must import a complete candidate into this laboratory or Product only after an exact-file verification rather than claiming the document contains code.

## Four bounded source differences relative to v0.6

1. `atlas/src/components/SacredAstrolabeHero.tsx`: glyph autoplay now subscribes to live `prefers-reduced-motion` media query and `visibilitychange`, with one current timer, cleanup and focus/hover pause.
2. `sozvezdie/src/components/Hero.tsx`: hero Sinai landscape moves from root-absolute CSS `bg-[url('/images/sinai-dawn.jpg')]` to a decorative real `<img>` with eager/high-priority decode and `import.meta.env.BASE_URL`. Same source photo bytes; no generated replacement.
3. `sozvezdie/vite.config.ts`: standalone Vite `base:'./'` for nested deployment/prototype preview only. Product Astro will own its image pipeline and canonical route.
4. `sozvezdie/scripts/qa.mjs`: inspect actual loaded image and `naturalWidth`, rather than assuming the root path. Hero also makes entry/scroll-cue motion conditional on both OS and user preference.

## Evidence actually executed on candidate v0.7

- Source/regression guards: **190 / 190 PASS** (85 source, 6 v0.2, 13 v0.3, 24 v0.4, 22 v0.5, 16 v0.6, 24 v0.7).
- TS/TSX **syntax** parse: **41 files, 0 errors**. This is not full `tsc --noEmit`.
- Executed actual callbacks with deterministic mocks: Starfield **9/9**, orbit keyboard **7/7**, medallion autoplay **10/10** — total **26/26**.
- `git apply --check` and reconstruction of both candidate source trees from the exact original late Arena ZIPs + a recorded source patch: **all files byte-equal**. Transport patch SHA-256 (uncompressed) `915284b5a68b7970f5b3d08f6bd275eb873f71bfcebb0ba9eb962edfba13a206`.
- Source data `src/data/divineNames.ts`, `src/data/names.ts`, and Sinai JPG: unchanged vs v0.6.

**Not run on exact v0.7:** `npm ci`, Vite production build, full TS typecheck, final-browser Chromium/WebKit or performance/LCP. Previous successful Windows builds / Chromium belonged to earlier Arena source plus a bounded visual proxy; they do not certify v0.7.

## Next precise browser test

`checks/browser_v07.cjs` serves built standalone `sozvezdie/dist` under nested `/preview/imena-boga/` and verifies:
- true decoded hero image (>500px wide) at the nested base, not a 404;
- documentWidth <= viewport at 320/390/768/1440;
- reduced motion hides scroll-cue animation;
- no JS errors and no HTTP >= 400.

Run it only **after** building the exact sources; do not substitute static guard PASS. Existing `browser_v06.cjs` still covers keyboard orbit/focus and responsive layouts. Product adoption remains **Astro + route-local React islands**, with current Product route registry/Reader/Search/SEO ownership and owner visual approval.

Research [PR #379](https://github.com/FedorMilovanov/Research/pull/379) remains independent and active; no transfer of blocked corpus data to public surfaces.
