# Gill V10 — Source Evidence Index

## Immutable heads

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source branch: `main`
- Initial source SHA: `ac26d8efa2b952df6dc46eef05908e6d65287e82`
- Current source SHA at end: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`
- Research repository: `FedorMilovanov/Research`
- Research SHA: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`
- AuditRepo base SHA: `18713174a343740cc0886df6c6441c51bde61274`

The current-head delta is documented in `REVERIFY_DELTA_30d9fb61.md`. It did not modify `GillPart3ArticleBody.astro`, so the baseline content/outline findings remain current.

## Production content truth

Checked:

- `src/pages/articles/dzhon-gill-chast-2-uchenyi/index.astro`
- `src/components/article-pilots/gill-part2/GillPart2MainShell.astro`
- `src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro`
- `src/components/article-pilots/gill-part3/GillPart3ArticleBody.astro`
- `src/components/article-pilots/gill-context/GillContextArticleBody.astro`
- `src/components/article-pilots/gill-part1/GillPart1ArticleBody.astro`

Conclusion: live routes render Astro article bodies; MDX is not the sole production body.

## Competing canonical sources

Checked:

- `src/content/articles/dzhon-gill-chast-2-uchenyi.mdx`
- `src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro`
- `scripts/gill-series-data-consistency-audit.js`
- Research `Джон Гилл/00_README_AND_NAVIGATION.md`

Direct divergence witness:

- MDX wording places 1720 in “the same year” as Salters’ Hall 1719;
- production Astro body says Gill came to the pastorate one year later.

## Series hardcoding

Checked:

- `data/series.json`
- `src/components/article-pilots/gill-series/gillSeriesData.ts`
- `scripts/gill-series-data-consistency-audit.js`

Observed hardcoding:

- five documents;
- marks and route maps;
- progress totals `149`;
- expected order;
- MDX map;
- previous/next labels such as `3 из 5`, `5 из 5`.

## TOC reconciliation and regression audit

Checked:

- `data/gill-submenu-anchor-reconciliation.json`
- `scripts/gill-pre-v16-submenu-regression-audit.js`
- `src/components/article-pilots/gill-series/gillSeriesData.ts`

Critical policy:

- historical labels + order + item count are preserved;
- Part II is documented as having grown from 6 to 29 sections;
- regression audit requires current row count to equal historical expected count.

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

Configured TOC has only six rows.

## Part III structural evidence

Checked in `GillPart3ArticleBody.astro`:

- article begins at H2 `V. Историческое влияние и память`;
- death/burial/epitaph occur before later major doctrinal and biographical chapters;
- sources occur before later substantive article sections;
- repeated clusters exist for Islam, Spurgeon, Toplady, America and final days;
- many independent H3 IDs are absent from `partToc`.

This body file was unchanged between `ac26d8e` and `30d9fb61`.

## Part I structural evidence

Checked:

- `GillPart1SectionIllnessFamily.astro` → `sec-illness-family`
- `GillPart1SectionLastWordsWife.astro` → `sec-last-words-wife`
- `GillPart1SectionSkeppDetail.astro` → `sec-skepp-detail`

These are independent current H3 sections absent from the manual TOC.

## Historical Introduction evidence

Checked current context section components:

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

The ten-H2 backbone is coherent. Main ownership issue: `sec-books` narrates personal Gill biography already owned by Part I, while Part I/II repeat Southwark and Salters’ Hall.

## TTS / Reader evidence

Checked `js/floating-cluster-controller.js`:

- `getArticleText()` selects `p, h2, h3, li`;
- excludes `.summary-card`, `aside`, `.reading-list-section`, `[data-pagefind-ignore]` and other nodes;
- H4 titles and tables are not spoken.

Checked `GillContextPageHead.astro`:

- JSON-LD `speakable.cssSelector` includes `.summary-card` and `[data-speakable]`.

Contradiction: schema declares the summary speakable; custom Play excludes it.

## Current-head restored-figure evidence

Checked at `30d9fb61`:

- `src/components/article-pilots/gill-part3/GillPart3MainShell.astro`
- `src/components/article-pilots/gill-part3/GillPart3RestoredFigures.astro`

Observed:

- `GillPart3RestoredFigures` is SSR-rendered after `GillPart3ArticleBody`;
- figures initially sit outside `<article class="article-body" data-pagefind-body>`;
- inline JS moves the Spurgeon figure by heading/neighbor elements;
- inline JS finds the Bunhill placement by exact Russian prose fragments;
- TTS reads neither figures nor captions.

This supports `GILL-V10-RESTORED-FIGURE-RELOCATION`. Impact on no-JS/Pagefind/print requires browser/artifact witness.

## Vosk lifecycle evidence

Checked current `floating-cluster-controller.js`:

- local opt-out key: `gbx-vosk-warmup`;
- Save-Data only prevents background warm-up path;
- `_voskWarmupStarted` is set before the opt-out return;
- no-WebSpeech fallback directly loads Vosk and calls `ensureLoaded()`;
- `gb:vosk-model-download-start` triggers a toast but is not a consent gate;
- Stop/cancel controls playback, not the network/model-init lifecycle.

## Research evidence

Checked:

- `Джон Гилл/00_README_AND_NAVIGATION.md`
- `03_STRUCTURE_PROPOSAL.md`
- `04_CONTENT_DEEPENING_AUDIT_AND_EXEGESIS_SET.md`
- `05_BODY_OF_DIVINITY_TOC_AND_ARTICLE_SKELETON.md`
- `07_VVEDENIE_DEEP.md`
- latest dossier 42 registration

Conflicts:

- broad Part IV versus focused exegesis;
- seven disputed texts versus nine undifferentiated texts;
- one dossier used for both historical Introduction and Part IV opening;
- ten-thousand-sheet primary statement versus ten-million-word modern extrapolation.

## Limits

- No Playwright/browser run in this intake.
- No production deployment verification.
- No claim that current CI is green for source `30d9fb61`.
- No source-code change was made.
- AuditRepo validation commands were not executable through the connector and must run before merge.
