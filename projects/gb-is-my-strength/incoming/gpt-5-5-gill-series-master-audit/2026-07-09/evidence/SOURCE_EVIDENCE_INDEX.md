# Gill V10 — Source Evidence Index

## Evidence boundary

- Source repo: `FedorMilovanov/gb-is-my-strength`
- Initial baseline: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Gill evidence reconciled through image lane: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`
- Research evidence HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- Witness produced by this intake: source inspection

The current source HEAD and effects of later commits are maintained only in:

```text
../../../reverify/START_HERE_2026-07-09.md
```

Default status:

```text
verified-source
needs-cross-verification
not repair-ready
```

## Content representations

Checked:

- `src/content/articles/dzhon-gill-*.mdx`
- production Gill Astro route/shell/body components
- `scripts/gill-series-data-consistency-audit.js`
- root legacy Gill HTML shadows
- Research department navigation

Observed:

- published Astro routes render Astro bodies;
- MDX remains an audit/Research input;
- Part II MDX says the 1720 pastorate occurred “in the same year” as Salters’ Hall 1719;
- production Astro says “the following year”.

This supports `GILL-V10-SOURCE-TRUTH`; a second source/artifact witness is required.

## Series manifest

Checked:

- `data/series.json`
- `src/components/article-pilots/gill-series/gillSeriesData.ts`
- `scripts/gill-series-data-consistency-audit.js`
- `GillSeriesRail.astro`

Observed fixed parallel values:

```text
five document IDs/items
marks and routes
expected order
MDX map
reading total 149
consistency audit expecting exactly five items
```

The reconciled rail renders `Часть X из 3`. The former `3 из 5` display claim is excluded.

## TOC and heading contracts

Checked:

- `data/gill-submenu-anchor-reconciliation.json`
- `scripts/gill-pre-v16-submenu-regression-audit.js`
- `gillSeriesData.ts`
- Part I/II/III source headings

Observed:

- historical label/order/count is protected;
- Part II is documented as having expanded beyond six sections;
- Part II `partToc` contains six rows in the evidence baseline;
- source headings exist outside the configured manual TOCs;
- at least one stored TOC level does not match the source heading level.

A built heading↔TOC inventory and browser witness are still required.

## Part III prose structure

Checked `GillPart3ArticleBody.astro`.

Observed:

- death, burial and epitaph precede later major material;
- a sources section appears before later substantive prose;
- topic clusters recur around Islam, Spurgeon, Toplady, America and final days;
- internal H2 numbering begins at V.

The Gill image lane did not reorder this prose.

## Reader projections

Checked `js/floating-cluster-controller.js` and Gill PageHead structured data.

Observed:

- custom TTS selects `p, h2, h3, li`;
- H4, tables and figure captions are excluded;
- `.summary-card` is excluded by custom Play;
- structured data can mark summary content speakable.

Build/browser/TTS/a11y/print evidence remains required.

## Restored Part III figures — Gill image lane

Checked:

- `GillPart3MainShell.astro`
- `GillPart3RestoredFigures.astro`
- `docs/refactor-2026/lanes/gill-image-premium-audit-2026-07-09.md`

Mechanism at the reconciled Gill evidence boundary:

- figures server-render after the article body;
- inline JavaScript removes legacy copies;
- Spurgeon placement searches for the 16 August 1859 paragraph;
- Bunhill placement searches for exact Russian burial prose;
- figures are inserted into the article at runtime.

Independent image-lane evidence establishes:

```text
normal JS-on placement succeeds
exactly one Spurgeon figure
exactly one Bunhill figure
intended visual locations
```

Still unverified:

```text
JavaScript-disabled placement
Pagefind inclusion
print result
custom-TTS inclusion
```

Therefore `GILL-V10-RESTORED-FIGURE-RELOCATION` is narrowed, not closed.

## TTS consent confirmation

The inspected controller source shows Save-Data/opt-out as partial warm-up mitigation rather than explicit consent for every model-load path. This is supporting evidence for existing canonical row `TTS-DL-CONSENT`, not a new Gill candidate.

## Research evidence

Checked:

- `00_README_AND_NAVIGATION.md`
- `03_STRUCTURE_PROPOSAL.md`
- `04_CONTENT_DEEPENING_AUDIT_AND_EXEGESIS_SET.md`
- `05_BODY_OF_DIVINITY_TOC_AND_ARTICLE_SKELETON.md`
- `07_VVEDENIE_DEEP.md`

Observed:

- broad and focused Part IV plans coexist;
- seven-text and expanded sets coexist;
- dossier 07 serves both Introduction and Part IV roles;
- dossier 07 inconsistently handles Rippon and the ten-million-word extrapolation.

Proposed dossier statuses and the seven-plus-two classification require independent review and owner acceptance.

## Limits

- This intake did not run the source-repository build or browser suite.
- Browser claims above come from the independent Gill image lane and apply only to its exact JS-on placement assertions.
- No production deployment claim is made by this intake.
- No Gill candidate is canonical or repair-ready solely from this index.