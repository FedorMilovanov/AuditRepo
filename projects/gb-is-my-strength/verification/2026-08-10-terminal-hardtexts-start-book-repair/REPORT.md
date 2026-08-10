# Terminal implementation receipt — V11-HARDTEXTS-START-BOOK

Date: 2026-08-10
Disposition: `MERGED-GREEN / RESIDUAL NONE`

## Starting authority

- Product starting live main for this root: `dd31df135ffb1e2640ba25536e9dcd94c319b52b`.
- The connected GitHub commit projection used by this executor does not expose the commit tree SHA as a separate field; exact source authority was therefore pinned by the full commit SHA plus scoped blob identities and a `behind=0` compare immediately before merge.
- Root: `V11-HARDTEXTS-START-BOOK`.
- Canonical current-failure report: `../2026-08-10-wave-11-hardtexts-start-book-current/REPORT.md`.

## Original current failure

`/hard-texts/` called its CTA `Начать книгу` / `Начать чтение книги` but hardcoded the target to the Chapter I article while canonical `data/series.json` identifies the published `n=0` Prologue as the first book item.

## Implementation

PR #1551 retained the same inherited branch `agent/hardtexts-start-book-20260810` and was refreshed onto fresh rewritten main. The final Product implementation derives the book-start item from `data/series.json`:

- first `status=published` item is selected from `hard-texts.parts`;
- href is derived from canonical `baseUrl` + slug;
- `n=0` projects as `Пролог`;
- title and reading time come from that same series item;
- no second hardcoded book-start registry remains.

The canonical Scripture occurrence index changed only because the old hardcoded CTA prose/reference disappeared. Generated state was produced by the repository writer rather than hand-edited.

## Exact changed files

Final PR diff contained exactly:

1. `src/components/hard-texts/HardTextsSeriesMapSection.astro`
2. `data/scripture-search-index.json`

The temporary PR-only generator workflow was removed before final proof and is absent from the merged diff.

## Generated-state proof

On exact final PR head `3b80fb289fca0f32baf01df03deb8ccd9269433b`, canonical `Scripture Occurrence Index Contract` run `31411806123` succeeded. Its writer/contract sequence proved:

- canonical `--write` executed under the repository writer lease;
- `--check` reported the committed index current;
- contract passed with `1010` references, `2429` occurrences, `74` indexed routes and `148` curated/canonical text records;
- the post-contract normalization/commit step reported no further Scripture occurrence normalization required, proving the second write was clean.

## Exact-head CI

Exact final head `3b80fb289fca0f32baf01df03deb8ccd9269433b` was `behind=0` against main and all observed applicable PR-head workflows reached terminal SUCCESS:

- Metadata & IndexNow Readiness — run `31411806408`;
- Search Scripture Occurrence Runtime — `31411806404`;
- Deploy Candidate Contract — `31411806187`;
- Scripture Occurrence Index Contract — `31411806123`;
- Editorial Dateline Contract — `31411806132`;
- Native Source Contract — `31411806317`;
- Source Authority Contract — `31411806188`;
- Print Paper Contract — `31411806167`;
- Search Modal Contract — `31411806137`;
- Visual Parity Guard — pixel-diff — `31411806212`;
- Shared Files Guard — `31411806153`;
- Glossary Contract — `31411806125` (autofix/source/browser jobs all SUCCESS).

The pre-merge compare from live `main` to the branch was `ahead=6`, `behind=0`, and showed only the two files above.

## Merge and post-merge proof

- PR: `#1551`.
- Exact proven PR head: `3b80fb289fca0f32baf01df03deb8ccd9269433b`.
- Squash merge SHA: `671e376c0043c9cf4d67138cd84ae12109e57587`.
- Fresh post-merge `main` comparison: merge SHA and `main` were identical.
- Scoped blob equality:
  - `HardTextsSeriesMapSection.astro`: PR-head blob `011e2de6a6a8d46da70b472122da64ff2c0e2c31` = merged-main blob `011e2de6a6a8d46da70b472122da64ff2c0e2c31`;
  - `data/scripture-search-index.json`: PR-head blob `eb402cb7dc58144d23a2c5bf408660b384d129d8` = merged-main blob `eb402cb7dc58144d23a2c5bf408660b384d129d8`.
- The merged implementation branch is no longer present in the live remote branch census.

## MASTER accounting

`V11-HARDTEXTS-START-BOOK` is terminal merged-green and is removed from active MASTER in the same consolidation cycle. No other current root is retired by this receipt.

## Residual

`NONE` for `V11-HARDTEXTS-START-BOOK`.
