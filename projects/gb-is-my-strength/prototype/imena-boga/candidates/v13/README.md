# Имена Бога — v1.3 (bounded, self-hosted type)

Two independent visual prototypes intended as selective references for the Astro Product, not deployable canonical Product routes:

- atlas/: «Атлас имён Бога», light interactive biblical study of 36 provisional entries; technical route name retained.
- sozvezdie/: «Панорама имён Бога», dark interactive overview plus 29 reading sections; technical route name retained, Sinai media rights remain HOLD.

## Precisely bounded changes from v1.2

- Removed Google Fonts stylesheet/preconnect from both HTML shells. At runtime fonts are served only by the same application origin.
- Astro/Product font ownership is not bypassed: package-based font delivery here is for a standalone reference, not an instruction to duplicate fonts in Product.
- Atlas: pinned @fontsource static subsets for Cormorant Garamond, Inter, Playfair Display, Noto Serif Hebrew and Noto Serif (Greek/Greek Extended); @fontsource-variable/lora for the main book face.
- Constellation: @fontsource static subset packages for Cormorant Garamond, EB Garamond, Frank Ruhl Libre, Inter and Noto Serif Hebrew.
- Noto Serif Greek was replaced with the supported Noto Serif family covering Greek. Hebrew glyphs remain on Hebrew-capable fonts.
- Each dependency version is pinned at 5.3.0. Full unmodified SIL OFL-1.1 license text for each family is in public/font-licenses. No standalone font binaries committed manually.
- The QA navigation witness now waits for DOMContentLoaded rather than for every font asset. Font loading is independently checked by checks/font_contract.cjs.
- A separate checks/source_contract.cjs detects missing CSS imports, wrong packages/licenses and the previously found literal backslash-n after a JS comment. This prevents an import silently becoming part of a comment.

## Canonical Sinai media and artifact admission

The original JPEG is stored ONCE at \`reference/sozvezdie/public/images/sinai-dawn.jpg\`, unchanged from the Arena source. Constellation \`src/components/Hero.tsx\` statically imports it via Vite from the immutable reference directory; Vite emits a content-hashed JPEG only at build time. The optimized 140842-byte WebP is stored ONCE in \`candidates/v13/sozvezdie/src/assets/sinai-dawn.webp\` and also emitted content-hashed by Vite.

Therefore building Constellation requires the **sibling \`reference/sozvezdie\` directory** in an AuditRepo checkout. Do not test only \`candidates/v13\` with a sparse checkout lacking the immutable reference. This intentionally enforces one canonical binary source, not symlink/copy duplication in Git.

All four original immutable ZIPs have precise sidecars (schemaVersion/path/sha256/sizeBytes/provenance/purpose/retention). The earlier v12 full source copy is preserved in historical commit 08e8a0c, not HEAD, because the current artifact gate prohibits duplicated JPEG/WebP.

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

## Product integration contract — W117/W118 handoff (not implementation)

The Atlas and Panorama remain separate editorial presentations, not independent Reader platforms. Product owns canonical routes `/imena-boga/atlas/` and `/imena-boga/`, respectively. This branch remains Draft and must not merge/deploy or change Research #379.

Observed on the W116 exact-head Product audit: the Product main tree has no imena-boga route. Both reference builds render an empty root when JS is disabled; the nested-route/browser PASS is not a Product readiness claim.

- **Content:** render complete headings, original-language text, citations, cross-links and article bodies in Astro HTML (SSG/SSR). Preserve the 36 Atlas identifiers and 29 Panorama identifiers. Reuse the existing 24 explicitly verified topic-crosswalk pairs; never infer missing matches or collapse distinct titles/formulas. Keep both reference datasets unchanged until the independent research review admits them.
- **Visual ownership:** one Product BaseLayout, one header/footer, one main landmark. Preserve each hero's editorial art, but scope its CSS to the route or component; no Tailwind preflight/global body reset or duplicate font pipeline in Product. No iframe publication.
- **Preferences:** Product's `js/reader-preferences-head.js` and `js/reader-preferences.js` own `gb:reader-preferences:v1`, root attributes `data-reader-theme`, `data-reader-measure`, `data-reader-motion`, `--gb-reader-font-scale`, `--gb-reader-line-height`, and the `gb:reader-preferences-change` event. Read/subscribe via the supported runtime; do not write a second root-theme owner. Map light/sepia/dark and narrow/normal/wide onto both editorial palettes without changing the artistic hero. Do not copy prototype storage keys over existing Product preferences.
- **Reader state:** Product's `js/reader-state.js` owns canonical route-scoped state and `gb:reader-state-change`. Use its semantic range/headings and existing ReaderProjection/ReaderActionsRuntime/ReaderFloatingControlsRuntime integration; do not run a second document scroll loop or duplicate global shortcuts. Atlas completion and Panorama completion remain distinct domain records until a migration is explicitly reviewed; no destructive conversion.
- **Navigation:** retain `#name-<atlas-id>` and `#<panorama-id>` and the verified crosswalk, including Back/Forward, focus restoration after removal of ephemeral controls and browser history. A deep-linked dossier must have a server-readable destination before JS enhancement.
- **Verification gates:** first-paint HTML with JS disabled; both routes and reciprocal links; 320–1600px, landscape, 200% root text, keyboard/real mobile/screen reader; shared Reader theme/font/measure/progress across route changes; no CSS or shortcut regressions on other GB readers; canonical/search metadata, asset budgets, print, and fail-closed research/image rights/owner review. Run Product exact-head checks only after the Reader coordinator approves the bounded integration lane.

W117/W118 checkpoint: focus recovery after consumed Resume control, narrow title whole-word reflow, and CRLF-portable W107 source assertion. New exact-head CI and physical-device review are pending. W116 acceptance does not transfer.
