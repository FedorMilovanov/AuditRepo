# Comment on Finding

## Identity
- Project: gb-is-my-strength
- Comment by: bugverifikator
- Date: 2026-08-19
- Target report: `incoming/2026-08-19-arena-agent-surface-pass-4.md`
- Target finding ID: `ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE` (MASTER alias `ARTICLE-LAYOUT-SERIES-HARDCODE`)
- Audited anchor (SHA / artifact / live snapshot): Product `main` HEAD `cb3681e`; full-tree census of `src/**/*.{astro,ts,tsx,js}`
- Signal class: Product
- Proof state: PASS (symptom not reachable in production — carrier is orphaned)
- Claim boundary: current Product `main` HEAD cb3681e
- Semantic owner / overlap check: layout refactor/cleanup owner; no competing lane.

## Comment type
`challenge` — оспариваю (the carrier is dead code, so the symptom does not reproduce).

## Evidence

```
# The report cites src/layouts/ArticleLayout.astro L76-82 seriesNames map (lacks 'genesis-6').
# Contents are exactly as quoted on cb3681e. BUT carrier usage census on cb3681e:

# Token 'ArticleLayout' across ALL src/**/*.{astro,ts,tsx,js}:  ZERO importers (only self + docs/**).
# Token 'SeriesArticleLayout' across ALL src/**/*.{astro,ts,tsx,js}: ZERO importers.
# Genesis-6 article pages render via src/components/article-pilots/genesis6/Genesis6ArticlePage.astro
#   (imports only css/mobile-hotfix.css — no ArticleLayout / SeriesArticleLayout).
# Other article pilots render via their own *PageHead/*Body/*PageChrome (e.g. AntisovetovBody → SeriesReaderChrome → GillSeriesChrome).
# Active series label source: seriesConfig.ts / gillSeriesData.ts (GILL_SERIES_ITEMS), NOT ArticleLayout.seriesNames.
```

## Summary
The finding's *file contents* are accurate, but it was filed as a defect without checking that the carrier is actually wired into production. On cb3681e `ArticleLayout.astro` (and its sibling `SeriesArticleLayout.astro`) are **orphaned/dead code** — no `src/` file imports either. Genesis-6 articles and all other article pilots render through their own components and the active `seriesConfig`/`gillSeriesData` engine, never through `ArticleLayout.seriesNames`. Therefore the described symptom ("breadcrumbs/nav show raw `genesis-6` key") does **not occur in production**. The code smell (a stale series-name map sitting in an orphaned layout) is a cleanup/Work-Queue item, not a current defect. (Note: this is the same dead-code carrier as `ARTICLE-AUTHOR-HARDCODED` from pass-5 §4 — that finding shares the carrier and warrants the same re-check.)

## Recommended action
- Status change: `ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE` / `ARTICLE-LAYOUT-SERIES-HARDCODE` → **invalid (dead-code carrier; not reproducible)**; remove from MASTER.
- Proposal status: proposal-conflicted (the proposed fix edits a file nothing renders).
- Conflict registry entry: YES — flag the shared dead carrier `ArticleLayout.astro`/`SeriesArticleLayout.astro` so `ARTICLE-AUTHOR-HARDCODED` is re-evaluated against it too.
- Notes for verifier: optionally add a Work-Queue item to delete the orphaned layouts (or re-wire if they are the intended future unified layout) so audits stop reading them as live. This pass confirmed orphaned status only on cb3681e, not on the original 485db8c anchor — a 485db8c importer census could show whether this was ever live or was always audit-drift.
