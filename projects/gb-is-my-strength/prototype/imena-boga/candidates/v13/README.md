# Имена Бога — v1.3 (bounded, self-hosted type)

Two independent visual prototypes intended as selective references for the Astro Product, not deployable canonical Product routes:

- atlas/: bright Astrolabe, 36 unverified research records.
- sozvezdie/: dark cinematic Constellation, 29 unverified research records, WebP Sinai image with original JPEG fallback.

## Precisely bounded changes from v1.2

- Removed Google Fonts stylesheet/preconnect from both HTML shells. At runtime fonts are served only by the same application origin.
- Astro/Product font ownership is not bypassed: package-based font delivery here is for a standalone reference, not an instruction to duplicate fonts in Product.
- Atlas: pinned @fontsource static subsets for Cormorant Garamond, Inter, Playfair Display, Noto Serif Hebrew and Noto Serif (Greek/Greek Extended); @fontsource-variable/lora for the main book face.
- Constellation: @fontsource static subset packages for Cormorant Garamond, EB Garamond, Frank Ruhl Libre, Inter and Noto Serif Hebrew.
- Noto Serif Greek was replaced with the supported Noto Serif family covering Greek. Hebrew glyphs remain on Hebrew-capable fonts.
- Each dependency version is pinned at 5.3.0. Full unmodified SIL OFL-1.1 license text for each family is in public/font-licenses. No standalone font binaries committed manually.
- The QA navigation witness now waits for DOMContentLoaded rather than for every font asset. Font loading is independently checked by checks/font_contract.cjs.
- A separate checks/source_contract.cjs detects missing CSS imports, wrong packages/licenses and the previously found literal backslash-n after a JS comment. This prevents an import silently becoming part of a comment.

## Reproduce in a clean checkout

In atlas/ and sozvezdie/: npm ci, npm run build, npx tsc --noEmit.

In checks/: npm ci, npm run qa:source, node font_contract.cjs, npm test (ENGINE=webkit or ENGINE=chromium), npm run qa:delivery, npm run qa:failure, npm run qa:image. For Chromium on Windows, set CHROMIUM_PATH to installed Chrome. Constellation additional full browser test: npm run qa.

No Product changes, no Research #379 changes, no external publication.

## Lab evidence and acceptance

- Two builds + strict TypeScript: PASS on working candidate.
- 45/45 active font CSS imports and 11/11 package licenses: PASS.
- Actual browser font loads: 6 Atlas + 5 Constellation in Chromium and WebKit; zero external Google Fonts requests; zero local font HTTP errors; PASS.
- WebKit and Chromium responsive Canvas CSS smoke across 320, 390, 768 and 1440px: 8/8 + 8/8 PASS.
- Interactive delivery 5/5, optional network-failure isolation 1/1, WebP delivery 4/4 PASS.
- Full 78 Constellation functional scenarios need the recorded exact test result; see research/FONT_V13_LAB.md.

The 390px CPU×4/1.6Mbps synthetic cold-load samples indicate the hybrid Atlas has about 546KB of transferred first page resources and sample median CLS 0.092; these are laboratory approximations, not field Core Web Vitals or a guarantee of speed. A fontless baseline is not an equitable typography performance comparator.

## Publication blockers remain

Confirm Sinai image copyright/source. Complete corpus/references in Research #379. Owner review of full screenshots. Actual iOS Safari and slow Android devices with touch/focus and LCP/CLS/INP. Astro route-local Product implementation, SSR SEO/Reader/Search and Product exact-head certification. No full SPA conversion and no automatic merge to Production.
