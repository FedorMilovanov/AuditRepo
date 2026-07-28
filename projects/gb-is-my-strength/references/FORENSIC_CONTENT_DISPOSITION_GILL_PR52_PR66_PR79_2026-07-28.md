# Forensic content disposition — Gill PR #52, #66 and #79 — 2026-07-28

**Status:** `FILE-LEVEL REVIEW COMPLETE / UNIQUE CONTENT PRESERVED`  
**Source repository:** `FedorMilovanov/gb-is-my-strength`  
**Current product baseline reviewed:** `main@0f7cefbb20abb17c65872e53c00c733c480f2a97`

## Review rule

No conclusion in this record is based only on a branch name, age or PR state. Every package was inspected by changed-file list, patch/content and comparison with the current implementation.

## PR #79 — `fix/gill-editorial-integrity`

Original head: `7106dfe8998243047b0788ea80112f620000faa6`  
Archive ref: `archive/forensic-pr-79-gill-witness-2026-07-24`

### Changed files and disposition

1. `src/components/article-pilots/gill-series/GillWitness.astro`
   - **Unique:** absent from current `main` and not found under another component name.
   - Implements a five-tone witness/voice/critic/archive/marginalia callout; Russian translation is first; the original is hidden in `<details>` and excluded from Pagefind/TTS by attributes.
   - **Preserved now:** exact source copied to `projects/gb-is-my-strength/forensics/gill/GILL_WITNESS_SOURCE_SNAPSHOT_7106dfe8.astro.txt`.
   - **Product decision:** do not merge unchanged. It predates the present reader-platform ownership and uses component-local typography/CSS and comments tied to the older TTS implementation. It remains a selective-recovery prototype.

2. `src/components/article-pilots/gill-context/GillContextSectionSummaryIntro.astro`
   - Branch version replaces the summary card with a shorter narrative introduction and a direct lineage formulation around Witsius/Hussey/Skepp.
   - Current `main` contains a later, substantially more qualified rewrite: it distinguishes post-1689 toleration from equality, marks source/biographer limitations, corrects the ten-thousand-page tradition, and explicitly rejects an overly simple Witsius → Hussey → Skepp → Gill chain.
   - **Product decision:** current `main` is the authoritative editorial version; restoring the branch file would reduce precision.

3. `src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro`
   - Branch delta is limited to importing `GillWitness` and inserting the Toplady sentence “If any one man can be supposed to have trod the whole circle of human learning…” after the Hebrew-language dissertation paragraph.
   - Current `main` has since rebuilt the relevant section with explicit boundaries on the Aberdeen degree, reception nicknames and the historical status of Gill’s Hebrew-vowel thesis.
   - The inserted quotation lacks a source page/work in the component call and should not be restored as a reader-facing claim without exact source control.
   - **Product decision:** preserve the prototype and quotation lead, but do not merge the old insertion.

### Ref disposition

- Keep `archive/forensic-pr-79-gill-witness-2026-07-24` as the single branch-level full-tree archive.
- The ordinary branch `fix/gill-editorial-integrity` may be normalized after this record merges because it is byte-identical to the retained archive head and the unique component source now also exists in AuditRepo.

## PR #52 — Gill premium image/crop audit

Original/archive head: `4a9164aee10c86e724a101090b7c116610037f40`  
Archive ref: `archive/forensic-pr-52-gill-image-polish-2026-07-24`

### Changed files and disposition

1. `GillSeriesChrome.astro`
   - Old patch removes the desktop context-cover override `--gbs2-cover-position: 100% 50%`.
   - Current `main` contains that override under an explicit comment: “Final calibration from the 390/768/1440 Playwright witness.”
   - **Product decision:** old removal is superseded by later measured calibration.

2. `GillSeriesImagePremium.astro`
   - Old patch moves figure captions from overlapping glass cards to boxed labels below images, changes rail-cover gradients/heights, and switches mobile pulpit/bookshop strips from 16:9 `cover` crops to full-width `contain` panoramas.
   - Current `main` contains a later owner decision for captions: plain centered text without border/background/shadow/blur. Restoring the old boxed labels would directly reverse that decision.
   - Current rail composition/crop settings were later recalibrated separately.
   - The mobile panorama idea is **not** represented in current code: current strips still use 16:9 `cover` with explicit left/right object positions. This remains a valid future visual-test candidate, but it lacks a current 320/390/768 witness and must not be merged from an old branch on assumption.

### Ref disposition

Keep `archive/forensic-pr-52-gill-image-polish-2026-07-24` unchanged as the sole full-tree archive and selective-recovery source. No normalization is performed in this transaction.

## PR #66 — premium submenu prototypes

Original head/blob: `c56c80c82f4b65b28b9c851b9607401578a166ff` / `a9fde36d0693579d48612b9118829249465f04e4`  
Canonical archive ref: `archive/forensic-pr-66-submenu-prototypes-2026-07-24`  
Duplicate archive ref: `archive/forensic-pr-66-submenu-showcase-2026-07-24`

### Internal content

The package is a standalone 1717-line file:

`_build-tools/SUBMENU-VARIANTS/premium-submenu-showcase.html`

It contains five independently styled and scripted concepts:

1. accordion spoiler with `aria-expanded` and CSS-grid open animation;
2. floating dropdown panel with capped scroll area and outside-click close;
3. compact split pill with a separate expand control;
4. progress strip with current-series percentage and keyboard Enter/Space activation;
5. minimalist one-line expand control.

The prototype also contains light/dark tokens, reduced-motion handling, mobile fixed bottom sheets for three variants, Escape-to-close behavior and fallback code for browsers without `grid-template-rows: 0fr` support.

### Comparison with current product

Current `main` has a production `GillSeriesOverlay` modal bottom sheet driven from typed series configuration and a much broader `GillSeriesMobileBar` integrated with the shared mobile shell, reader preferences, TTS, progress, sharing and focus/scroll-lock ownership.

Therefore the old showcase is not a production implementation to copy wholesale. It remains useful as a **design pattern library**: especially the compact pill, progress strip and minimalist trigger concepts.

### Ref disposition

- Keep `archive/forensic-pr-66-submenu-prototypes-2026-07-24` as the canonical full-file archive.
- `archive/forensic-pr-66-submenu-showcase-2026-07-24` points to the exact same commit and is a pure duplicate; it may be normalized after this record merges.

## Overall conclusion

The five forensic refs are not one homogeneous cleanup class.

- **Preserve as explicit archives:** PR #52, PR #66 canonical prototype archive, PR #79 witness archive.
- **Normalize only proven duplicates:** ordinary PR #79 branch and duplicate PR #66 archive.
- **Do not merge old product files wholesale.** Unique ideas are preserved, while later source decisions remain authoritative.
