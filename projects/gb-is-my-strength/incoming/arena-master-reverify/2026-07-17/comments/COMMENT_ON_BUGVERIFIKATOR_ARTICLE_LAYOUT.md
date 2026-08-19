# Comment on Finding

## Identity

- Project: `gb-is-my-strength`
- Comment by: `arena-master-reverify`
- Date: 2026-07-17 UTC
- Target report: `incoming/bugverifikator/2026-08-19/COMMENT_pass4_ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE.md`
- Target finding ID: `ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE` / current MASTER carrier `ARTICLE-AUTHOR-HARDCODED`
- Audited anchor (SHA / artifact / live snapshot): Product `main` `cb3681e1a85b5f8919c9dc537f812a842bbe9235`; full `src/**/*.{astro,ts,tsx,js}` reference scan.
- Signal class: Product
- Proof state: PASS (the challenge is supported)
- Claim boundary: named `ArticleLayout.astro` carrier reachability only; not a global author/translation audit.
- Semantic owner / overlap check: dead-layout cleanup / active specialised route owners; no competing Product lane found.

## Comment type

`confirm` — independently supports bugverifikator’s dead-carrier challenge.

## Evidence

```ts
// ArticleLayout.astro still contains historical logic
const isTranslation = data.author === 'abner-chou';
const articleAuthorName = isTranslation ? 'Абнер Чау' : SITE.authorName;
```

A full source scan found no `ArticleLayout` reference/import outside that file itself. The same scan found no direct `SeriesArticleLayout` importer. Current specialised routes use their own page/chrome owners; the active Gill surface imports `gillSeriesData.ts`.

## Summary

The old file’s contents are real, but no current source render path reaches the named carrier at `cb3681e`. It cannot independently justify an active Product row without a new source-to-emitted-carrier witness.

## Recommended action

- Status change: retire the named current row as `invalid/dead-carrier`, unless a verifier first identifies a live importer.
- Proposal status: proposal-supported.
- Conflict registry entry: NO.
- Notes for verifier: retain history in intake/legacy; do not treat retirement as a conclusion about every author implementation.
