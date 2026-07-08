# Reverify delta — source `ac26d8e` → `30d9fb61`

## Meta

- Initial audited source SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- New source `main`: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`
- Trigger: Merge PR #50 — restore lost Gill Part III illustrations
- Date checked: 2026-07-09

## Changed scope relevant to Gill

The delta adds/restores:

- `src/components/article-pilots/gill-part3/GillPart3RestoredFigures.astro`
- two lines in `GillPart3MainShell.astro` to render the component after `GillPart3ArticleBody`
- Gill/Floating Cluster CSS changes
- Gill rail/chrome changes
- technical PageHead/cache-bust metadata updates

`GillPart3ArticleBody.astro` did **not** change in this delta.

## Effect on existing V10 findings

The following findings remain current because their owning article body/data/audit sources did not change:

- `GILL-V10-SOURCE-TRUTH`
- `GILL-V10-SERIES-MANIFEST`
- `GILL-V10-HISTORICAL-TOC-CONTRACT`
- `GILL-V10-ROMAN-NUMBER-COLLISION`
- `GILL-V10-PART3-NARRATIVE`
- `GILL-V10-PART4-OWNERSHIP`
- `GILL-V10-RESEARCH-CANON`
- `GILL-V10-INTRO-OWNERSHIP`
- `GILL-V10-READER-PROJECTIONS`
- `GILL-V10-CLAIM-PROVENANCE`

No prior V10 structural finding is closed by the image-restoration merge.

## New current-head finding

### GILL-V10-RESTORED-FIGURE-RELOCATION

- Severity proposal: P2
- Verification: source-confirmed design risk; browser/Pagefind/print witness pending
- Files:
  - `GillPart3MainShell.astro`
  - `GillPart3RestoredFigures.astro`

### Source behavior

Server render order:

```text
GillPart3HeaderHero
GillPart3ArticleBody
GillPart3RestoredFigures
GillPart3PostArticle
```

The restored figures are therefore initially outside:

```html
<article class="article-body" data-pagefind-body>
```

An inline client script then:

- finds the article;
- searches for `#sec-spurgeon-legacy`;
- inserts the Spurgeon figure after nearby paragraphs;
- scans article paragraphs for Russian text containing `Его похоронили на` and `Банхилл-Филдс`;
- inserts the Bunhill figure after that paragraph;
- removes the fallback wrapper if empty.

### Risks

1. No-JS render leaves both figures after the entire article instead of at their semantic sections.
2. Initial static `data-pagefind-body` does not contain the figures/captions.
3. Bunhill placement depends on exact Russian prose text, not a stable semantic anchor.
4. The figures are invisible to the existing TTS extractor because it neither reads `figure/figcaption` nor sees a semantic Reader block.
5. Print/snapshot behavior can differ depending on whether client relocation has executed.
6. Duplicate-detection uses image `src*` queries rather than canonical figure ownership.

### Recommended correction

Render each figure directly in its owning article section or project it from the proposed Reader AST/content graph. Do not use runtime DOM relocation as the canonical placement mechanism.

### Relation to existing findings

This is a concrete new instance of:

- `GILL-V10-READER-PROJECTIONS`
- `GILL-V10-SOURCE-TRUTH`
- the need for stable content ownership and generated projections.

It remains a separate P2 row because it was introduced after the initial V10 baseline and has a precise repair target.
