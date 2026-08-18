# DEEP AUDIT REPORT — P1-13, P1-14, GBS2

- **Date:** 2026-07-17
- **Auditor:** Arena Agent

## 1. P1-14: Editorial Metadata Fan-out Asymmetry
- **Finding:** The metadata registry audit script (`eligibleRecords` in `scripts/lib/editorial-metadata.js`) only includes `article` and `series-article` route types.
- **Asymmetry Witness:** `nagornaya` routes are typed as `series-chapter` (see `data/route-profiles/nagornaya-chast-1.json`), so they are excluded from the centralized metadata management.
- **Root Cause:** Narrow filter in `eligibleRecords()`.

## 2. P1-13: Metadata Drift and Parallel Surfaces
- **Witness:** Article `/articles/20-antisovetov-pastoru/`.
- **Drift Details:**
  - **Title:** MDX says `... | Господь Бог — Сила Моя`, while `data/editorial-metadata.json` says `... | Господь Бог`.
  - **Modified Date:** MDX `updatedAt` (June 12) vs Registry `editorialModifiedAt` (July 8) vs RSS (July 11).
- **Root Cause:** Multiple SSOTs (MDX Frontmatter vs Registry JSON vs observations from dist).

## 3. GBS2 Wiring: Orphan Layout and Hardcoding
- **Finding 1 (Orphan):** `src/layouts/SeriesArticleLayout.astro` is intended as the GBS2 shell, but `baptisty-rossii` and `nagornaya` pages are currently manually wiring their own components instead of using this layout.
- **Finding 2 (Hardcoded Paths):** `SeriesArticleLayout.astro` has hardcoded image paths for `baptisty-rossii` (e.g., `/images/baptisty-rossii/`), making it non-reusable for other series like `pastor-series`.
- **Finding 3 (Missing Data):** `pastor-series` is missing from `SERIES_ORDER` in `src/data/site.ts`, which would break navigation if the layout were applied to it.
