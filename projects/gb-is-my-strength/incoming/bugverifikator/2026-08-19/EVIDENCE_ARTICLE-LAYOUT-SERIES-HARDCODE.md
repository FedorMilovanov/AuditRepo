# Evidence — ARTICLE-LAYOUT-SERIES-HARDCODE  (CORRECTION / audit-drift)

bugverifikator · 2026-08-19 · gb-is-my-strength · current-HEAD reverify (cb3681e)

## Status change proposed: `current-local` → **invalid / stale (dead-code carrier)**

This evidence **corrects** the disposition this agent gave in its first pass (REPORT.md §2), where `ARTICLE-LAYOUT-SERIES-HARDCODE` was kept as current-local based on reading `src/layouts/ArticleLayout.astro`. That read was correct about the file's contents but **did not verify the file is actually used in production**. It is not.

## What the first pass got right
- `src/layouts/ArticleLayout.astro` at cb3681e (L77-83) has a `seriesNames` map containing only `dzhon-gill`, `russian-baptism`, `hard-texts`, `pastor-series` — it lacks `genesis-6`, so `seriesLabel = data.series` would render the raw key `genesis-6` if this layout rendered Genesis-6 articles.

## What the first pass missed (the correction)
- **The carrier is orphaned/dead code on cb3681e.** A full-tree scan of all `src/**/*.{astro,ts,tsx,js}` files for the token `ArticleLayout` returns **zero code references** to it (excluding the file itself). The only references to `ArticleLayout` anywhere in the repo are in `docs/**` (history, plans, inventories) and `AUDIT_HISTORY.md` — documentation, not imports.
  - No `.astro`/`.ts`/`.tsx`/`.js` file under `src/` does `import … ArticleLayout`.
- The sibling `src/layouts/SeriesArticleLayout.astro` (which also reads `SERIES_ORDER`) is **also orphaned**: a full-tree scan for `SeriesArticleLayout` returns zero `src/` code importers.
- Genesis-6 article pages render via `src/components/article-pilots/genesis6/Genesis6ArticlePage.astro` (verified: it imports only `css/mobile-hotfix.css`, no `ArticleLayout`/`SeriesArticleLayout`). Other article pilots render via their own `*PageHead`/`*Body`/`*PageChrome` components (e.g. `AntisovetovBody` → `SeriesReaderChrome` → `GillSeriesChrome`).

## Witness angle
- **W2 source** (`verified-source`): tree-wide token census on cb3681e — `ArticleLayout` token present only in `src/layouts/ArticleLayout.astro` (self) and `docs/**`; no `src/` importer. `SeriesArticleLayout` likewise has no `src/` importer.
- **W5 lifecycle** (`verified-lifecycle`): the active series engine is `src/components/article-pilots/_shared/series/seriesConfig.ts` + `…/gill-series/gillSeriesData.ts` (`GILL_SERIES_ITEMS`), consumed by the live `GillSeriesChrome`/`SeriesReaderChrome` path — not `ArticleLayout`'s `seriesNames` map.

## Mechanism
Because the layout containing the `seriesNames` hardcode is dead code, the "breadcrumbs show raw `genesis-6` key" symptom described in MASTER **does not occur in production** on cb3681e. The symptom is only reachable if someone re-wires a page to `ArticleLayout`/`SeriesArticleLayout`, which nothing currently does.

## Impact
none in production on cb3681e (dead code). The *code smell* (a layout with a stale series-name map still in the tree) is a cleanup/Work-Queue item, not an active defect.

## Owner / collision
- Semantic owner: layout cleanup / refactor owner.
- Open Product branch check (2026-08-19): no open branch references `ArticleLayout.astro`. No collision.

## Proposal (for the verification/consolidation wave)
- **Remove `ARTICLE-LAYOUT-SERIES-HARDCODE` from MASTER** as invalid/stale (dead-code carrier; symptom not reproducible in production).
- Optional: a Work-Queue item to delete the orphaned `ArticleLayout.astro` / `SeriesArticleLayout.astro` (or re-wire them if they are meant to be the future unified article layout) so the stale `seriesNames` map and dead `SERIES_ORDER` consumers stop confusing audits. This is cleanup, not a current defect.
- Re-anchor note: the original MASTER row pointed at `HEAD 485db8c`; even there, the layout appears orphaned (this pass did not separately confirm 485db8c importer status, but cb3681e is unambiguously orphaned).

## What this evidence does NOT prove
- Whether `ArticleLayout`/`SeriesArticleLayout` were live on `485db8c` (the original MASTER anchor). They are dead on cb3681e. If a verifier wants to be thorough, a 485db8c importer census can confirm whether this was ever a live defect or was always pointing at dead code (possible audit-drift from the original filing).
- That the `seriesNames` hardcode pattern doesn't exist *elsewhere* in active code. The active series engine uses `seriesConfig.ts` labels, which is a separate (non-defective) path not inspected here for the same hardcode.

## Labels
`verified-source`, `verified-lifecycle`, `invalid`, `audit-drift` (first-pass disposition was wrong because carrier usage was not checked)
