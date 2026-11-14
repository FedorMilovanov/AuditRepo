# Grok Desktop Reader — Stage 1 Product implementation witness (2026-11-06)

**Classification:** owner-selected, reversible implementation progress; **not a new Product defect or an automatic MASTER row**. Source/UI authority remains Product; design intent remains V26 (and prior V23–V25) in this AuditRepo project.

## Where continuation happens

- **Product PR:** [#2284 — Stage 1 lossless read-only TOC projection](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2284)
- **Product base:** `main@717efc54772edf4224f44254651c102e2af24129`.
- **Stage 1 candidate head at this record:** `ae93e229c3aca79500a4dad8f6f94158484c0c68`.
- **Design/pilot authority:** [V26 plan](../v26/PRODUCT-ROLLOUT-V26.md), [V26 HTML](../v26/REFERENCE-V26.html).
- **Next agent:** open the PR, re-read its *live head* and exact-head CI; do not assume this candidate SHA or status has remained current. No Product UI has yet been changed.

## What was actually added

Exactly **three new files** to the Product PR, with no existing files edited:

1. `src/components/article-pilots/_shared/series/readerTocProjection.ts` — typed, data-only projection from existing SeriesConfig and partToc; book chapter→article→heading; Gill/flat part/endpaper→heading; standalone H2–H6; optional DOM heading inventory for strict historic anchor/order reconciliation and H4–H6 inclusion. Reuses canonical `sectionLabel`; keeps existing href, label, mark and route identity.
2. `scripts/reader-toc-projection-contract-test.cjs` — source-level tests using **declared direct TypeScript devDependency**, not a transitive bundler. Covers seven actual SeriesConfig families, 68 actual page configs, every Gill anchor/label and Baptist chapter, invalid fragments, reordered/missing DOM headings, nested H4–H6.
3. `docs/READER_TOC_GROK_ADAPTER_GATE_2026-11-06.md` — strict Stage 2 preconditions and engine ownership.

**Real defect found before pilot:** published Genesis 6 satellite pages `corpus`/`audit` have `pages[]` entries but no desktop core rail row. Initial adapter wrongly failed. Fixed to return the actual satellite identity with visible **parent part** key/path while leaving the satellite itself in the existing part accordion; no duplicate rail page or false parent-page headings. Seven-series sweep now projects **68/68**.

## Reproducible evidence (isolated read-only checkout)

At the Product PR head, on detached clone of `main`, without editing the user's existing working branch:

- `node scripts/reader-toc-projection-contract-test.cjs`: **15/15 PASS**.
- strict `tsc --noEmit` for adapter: **PASS**.
- `node scripts/check-engine-contracts.js`: **PASS**.
- `node scripts/series-reader-facade-regression-test.js`: **PASS**.
- Library V3 source fixture `reader-library-v3-browser-test.cjs`: **8/8 Chromium/WebKit**.
- V3 resume/daily `reader-library-v3-progress-test.cjs`: **2/2 Chromium/WebKit**.
- Legacy library `reader-library-browser-test.cjs`: **6/6 Chromium/Firefox/WebKit**.
- Independent **live** library smoke on Hermeneutics route at 390×844, 900×480 and 1480×900: **6/6 Chromium/WebKit** opening, Escape focus return, reload and reopen; no page JS exceptions/overflow.
- **Live release identity independently checked**: `https://gospod-bog.ru/deployments/current.json` reported `releaseSha=717efc54772edf4224f44254651c102e2af24129` (same as Product main), and Hermeneutics route returned HTTP 200. Reverify for any later deployment.

**Not green/not executed:** the source checkout has **no `dist`**. `reader-library-premium-browser-contract.cjs` and `gill-pre-v16-submenu-regression-audit.js` require actual production-like dist. Premium's missing `#gb-hl-fab` was a 404 fixture from absent dist, **not demonstrated Product bug**. Run after genuine production-like build; no green claim here.

## Collision and rollout gates

At source capture Product #2283 Library V3 was **merged**. Open neighboring PRs: #2269 print and #2268 dependencies. There was no overlapping reader/TOC PR owner. Do not alter their files or create a second Library V3 implementation.

**Stage 1 is not a UI rollout**: no CSS, no mobile navigation, no browser scroll listeners, no overlay/search/TTS/localStorage changes. Do not transplant prototype JS into Product; the only authority for reader state is the existing ReaderState/GBReaderPreferences/GBSearch/PlayEmber/GBReaderLibrary V3/OverlayRuntime/PrintEngine.

**Next:** let exact-head CI on Product PR #2284 complete, inspect all required checks and then make an owner-approved merge decision. Stage 2 must be a **separate single-route flagged desktop pilot** inside the existing Astro rail, preserving original markup for rollback. Capture baseline screenshots and DOM/reader-axis rectangles on Hermeneutics, Gill and Baptist before changing view. Verify 320/390 mobile no-change, compact 900×300/480 usable TOC, stable Back/Forward, Gill `#sec-gill-last-pages` and original vertical leather ribbons, true 4-vertical-SVG cluster, all three themes, keyboard/inert/focus, WebKit/Firefox/Chromium, real Library V3 import/status/progress, Pagefind search, print A4 and exact live releaseSha. Stop ship on any regression.

No MASTER/WORK_QUEUE/other-project files changed in this bounded AuditRepo evidence note. Historical V26 reference remains unchanged.
