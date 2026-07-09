# Gill V10 — Source Evidence Index

## Immutable heads

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source branch: `main`
- Initial source SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Functional source tree audited: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`
- Current source HEAD after freshness reverify: `ff55161b6858a1bbb0fad5704a11c6b41c961879`
- Net compare `30d9fb61..ff55161b`: no changed files
- Research repository: `FedorMilovanov/Research`
- Research SHA: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- AuditRepo base SHA: `18713174a343740cc0886df6c6441c51bde61274`

## Witness boundary

This index records one direct source witness:

```text
W1
verified-source
needs-cross-verification
```

The tree-identical freshness reverify to `ff55161b` is not an independent second witness. This index does not prove built-artifact or browser impact and does not promote new Gill candidates to canonical open status.

Mandatory companion corrections:

- `../artifacts/STATUS_AND_CORRECTIONS_2026-07-09.md`
- `REVERIFY_DELTA_30d9fb61.md`
- `REVERIFY_DELTA_ff55161.md`

## Production content representation

Checked:

- `src/pages/articles/dzhon-gill-chast-2-uchenyi/index.astro`
- `src/components/article-pilots/gill-part2/GillPart2MainShell.astro`
- `src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro`
- `src/components/article-pilots/gill-part3/GillPart3ArticleBody.astro`
- `src/components/article-pilots/gill-context/GillContextArticleBody.astro`
- `src/components/article-pilots/gill-part1/GillPart1ArticleBody.astro`

Source observation: live Astro routes import/render Astro article bodies; MDX is not the sole production body.

## Competing content representations

Checked:

- `src/content/articles/dzhon-gill-chast-2-uchenyi.mdx`
- `src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro`
- `scripts/gill-series-data-consistency-audit.js`
- Research `Джон Гилл/00_README_AND_NAVIGATION.md`

Direct divergence witness:

- MDX places 1720 in “the same year” as Salters’ Hall 1719;
- production Astro says Gill came to the pastorate the following year.

This supports a source-of-truth candidate. A production-like artifact witness is still required for canonical promotion.

## Series hardcoding

Checked:

- `data/series.json`
- `src/components/article-pilots/gill-series/gillSeriesData.ts`
- `scripts/gill-series-data-consistency-audit.js`
- `src/components/article-pilots/gill-series/GillSeriesRail.astro`

Current source observations:

- five document IDs/items;
- explicit marks and routes;
- progress total `149` repeated per page;
- hardcoded expected order;
- hardcoded MDX map;
- consistency audit expects exactly five items and total `149`.

### Current-head correction

`GillSeriesRail.astro` filters Roman items and renders numbered progress as `Часть X из 3`. The former `3 из 5` / `5-of-5 labels` display subclaim is stale and excluded from the candidate evidence.

## TOC reconciliation and regression audit

Checked:

- `data/gill-submenu-anchor-reconciliation.json`
- `scripts/gill-pre-v16-submenu-regression-audit.js`
- `src/components/article-pilots/gill-series/gillSeriesData.ts`

Source observations:

- historical labels/order/item count are preserved;
- comments document Part II growth from 6 to 29 sections;
- current regression logic compares rendered row count with historical expected count;
- Part II current `partToc` still contains six rows.

Built outline and browser scrollspy evidence remain required.

## Part II structural evidence

Checked headings/IDs in `GillPart2ArticleBody.astro`, including:

```text
part-theology
part-controversy
sec-trinity
sec-hebrew
sec-canticles
sec-covenant
sec-dd
sec-ordinances
sec-eschatology
sec-commentary
sec-habakkuk
sec-systematics
sec-pactum
sec-ecclesiology
sec-whitby
sec-pastoral
sec-deism-polemic
sec-gill-catholicity
sec-ordo-salutis
sec-gill-solter
sec-sources-part2
sec-quiz
```

Configured Part II TOC has six rows and records `sec-hebrew` as level 2 although the source heading is H3 under `part-theology`.

## Part III structural evidence

Checked in `GillPart3ArticleBody.astro`:

- article begins with H2 `V. Историческое влияние и память`;
- death/burial/epitaph occur before later major chapters;
- a sources section occurs before later substantive article content;
- repeated source clusters exist for Islam, Spurgeon, Toplady, America and final days;
- multiple source headings are not represented in current `partToc`.

This body file was unchanged in the final PR #50 merge. The later no-op source-head advance also changed no files.

## Part I structural evidence

Checked:

- `GillPart1SectionIllnessFamily.astro` → `sec-illness-family`
- `GillPart1SectionLastWordsWife.astro` → `sec-last-words-wife`
- `GillPart1SectionSkeppDetail.astro` → `sec-skepp-detail`

These source H3 sections are absent from the manual TOC. Built/browser impact remains unverified.

## Historical Introduction evidence

Checked current context components:

- `GillContextSectionFromPuritansToBaptists.astro`
- `GillContextSectionParticularVsGeneral.astro`
- `GillContextSectionGreatEjection.astro`
- `GillContextSectionClarendon.astro`
- `GillContextSectionAcademies.astro`
- `GillContextSectionSaltersHall.astro`
- `GillContextSectionCoffeeHouse.astro`
- `GillContextSectionSouthwark.astro`
- `GillContextSectionBooks.astro`
- `GillContextSectionConclusion.astro`

Source observation: the ten-H2 backbone is coherent; `sec-books` contains personal Gill biography while Part I/II also carry overlapping Southwark/Salters’ Hall context. Final ownership requires editorial review.

## TTS / Reader evidence

Checked `js/floating-cluster-controller.js`:

- `getArticleText()` selects `p, h2, h3, li`;
- excludes `.summary-card`, `aside`, `.reading-list-section`, `[data-pagefind-ignore]` and other nodes;
- H4, table and figcaption content is not selected.

Checked `GillContextPageHead.astro`:

- JSON-LD `speakable.cssSelector` includes `.summary-card` and `[data-speakable]`.

Source contradiction: schema declares summary content speakable while custom Play excludes `.summary-card`. Runtime/a11y impact requires build/browser witnesses.

## Restored-figure evidence

Checked in the audited functional tree:

- `src/components/article-pilots/gill-part3/GillPart3MainShell.astro`
- `src/components/article-pilots/gill-part3/GillPart3RestoredFigures.astro`

Observed:

- `GillPart3RestoredFigures` SSR-renders after `GillPart3ArticleBody`;
- figures initially sit outside `<article class="article-body" data-pagefind-body>`;
- inline JS moves the Spurgeon figure by heading/neighbor elements;
- inline JS finds Bunhill placement by exact Russian prose fragments;
- custom TTS selector does not read figure captions.

No-JS/Pagefind/print/TTS/browser impact is pending verification.

## Vosk lifecycle evidence

Checked current functional tree `floating-cluster-controller.js`:

- local opt-out key: `gbx-vosk-warmup`;
- Save-Data only prevents the background warm-up path;
- no-WebSpeech fallback directly loads Vosk and calls `ensureLoaded()`;
- `gb:vosk-model-download-start` is a notification, not a consent gate;
- Stop/cancel controls playback, not the network/model-init lifecycle.

This is an additional source witness for the existing canonical `TTS-DL-CONSENT` row, not a duplicate Gill candidate.

## Research evidence

Checked:

- `Джон Гилл/00_README_AND_NAVIGATION.md`
- `03_STRUCTURE_PROPOSAL.md`
- `04_CONTENT_DEEPENING_AUDIT_AND_EXEGESIS_SET.md`
- `05_BODY_OF_DIVINITY_TOC_AND_ARTICLE_SKELETON.md`
- `07_VVEDENIE_DEEP.md`
- latest dossier 42 registration

Source observations:

- broad Part IV versus focused exegesis proposals;
- seven-text versus expanded working set;
- one dossier serving both historical Introduction and Part IV opening;
- dossier 07 first labels ten million words a modern extrapolation, then attributes that number directly to Rippon.

The proposed “seven disputed + two positive anchors” resolution remains an owner/editorial proposal.

## Limits

- No local source checkout was available through the connector environment.
- No Playwright/browser run.
- No production-like build or deployment verification.
- No claim that source CI is green for `ff55161b` or the audited functional tree.
- No source-code change was made.
- AuditRepo GitHub Actions validates repository structure/rules only, not the source-repo findings.