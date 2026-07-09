# Reverify delta — source `ac26d8e` → `30d9fb61`

## Meta

- Initial audited source SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Final source `main`: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`
- Range size: 7 commits
- Date checked: 2026-07-09
- Witness type: W1 source/history review only

## Scope clarification

The full range is not identical to PR #50.

### Intervening commits in the range

The compare includes Gill rail/Floating Cluster/PageHead/cache-bust changes before the final image-restoration merge.

Relevant reviewed files include:

- `src/components/article-pilots/gill-series/GillSeriesRail.astro`
- `src/components/ui/floating-cluster/SingleArticleCluster.astro`
- `css/floating-cluster.css`
- Gill PageHead files

### PR #50 itself

Merge PR #50 added/restored:

- `src/components/article-pilots/gill-part3/GillPart3RestoredFigures.astro`
- import/render lines in `GillPart3MainShell.astro`
- route-lane documentation

It did not modify `GillPart3ArticleBody.astro`.

## Effect on baseline candidate predicates

The current-head review confirms that the source predicates behind these candidates are still observable:

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

This is **not** a promotion to `confirmed-current`. Their status remains:

```text
verified-source
needs-cross-verification
```

## Stale subclaim removed

Current `GillSeriesRail.astro` now does:

```text
romanItems = GILL_SERIES_ITEMS.filter(mark.kind === 'roman')
seriesMeta = Часть X из romanItems.length
```

Therefore it correctly displays three numbered parts and no longer exhibits the old `Часть 3 из 5` defect.

Consequences:

- remove `5-of-5 labels` from current evidence;
- do not reopen that display bug;
- retain only the broader candidate that five documents/order/maps/total remain hardcoded in data/audit layers.

## New current-head candidate

### GILL-V10-RESTORED-FIGURE-RELOCATION

- Proposed severity: P2
- Current status: `W1 / verified-source / needs-cross-verification`
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

The restored figures initially sit outside:

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

### Source-derived risks requiring witnesses

1. No-JS keeps both figures after the article rather than at semantic sections.
2. The figures/captions are initially outside `data-pagefind-body`; built Pagefind behavior must be measured.
3. Bunhill placement depends on exact Russian prose text.
4. Existing custom TTS selector does not read `figure` or `figcaption`.
5. Print/snapshot result may depend on whether relocation ran.
6. Duplicate detection uses `img[src*=...]` rather than section ownership.

### Required next evidence

- built static HTML and Pagefind index check;
- JavaScript-disabled render;
- print output before/after relocation;
- custom TTS extraction check;
- browser placement check.

## Result

- One stale subclaim was removed.
- One new source candidate was added.
- No Gill candidate was promoted to canonical open or repair-ready status.
- No source code was changed by this AuditRepo intake.