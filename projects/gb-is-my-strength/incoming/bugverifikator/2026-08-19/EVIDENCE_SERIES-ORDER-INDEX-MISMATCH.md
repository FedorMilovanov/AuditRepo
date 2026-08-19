# Evidence — SERIES-ORDER-INDEX-MISMATCH  (CORRECTION: root relocated; still current-local)

bugverifikator · 2026-08-19 · gb-is-my-strength · current-HEAD reverify (cb3681e + live)

## Status: `current-local` — KEPT, but **root cause relocated** (first pass cited the wrong file)

This evidence **corrects** the file this agent cited in its first pass (REPORT.md §2), where `SERIES-ORDER-INDEX-MISMATCH` was attributed to `src/data/site.ts` `SERIES_ORDER['dzhon-gill']`. The *site.ts* entry is malformed too, but it is **dead code**; the **production-active** source of the order is `src/components/article-pilots/gill-series/gillSeriesData.ts`. The defect is real and live, but the MASTER row / repair lane must point at the active carrier.

## Witness angles
- **W2 source** (`verified-source`): `src/components/article-pilots/gill-series/gillSeriesData.ts` at cb3681e, `GILL_SERIES_ITEMS` (L56-98), order is:
  `context, part1, part2, part4, part3, spravochnik`
  - L82-86: `id: "part4"` with `mark: { kind: "roman", value: "III" }` and `href: "/articles/dzhon-gill-chast-4-ekzeget/"`.
  - L90-94: `id: "part3"` with `mark: { kind: "roman", value: "IV" }` and `href: "/articles/dzhon-gill-chast-3-nasledie/"`.
  - So in the active engine, **part4 is ordered before part3 AND labelled "Часть III", while part3 is labelled "Часть IV"** — the part order and the roman numerals are inverted relative to the canonical Part 3 / Part 4 content.
- **W4 runtime/live** (`verified-live`): HTTP fetch of live Gill pages on 2026-08-19:
  - `/articles/dzhon-gill-chast-3-nasledie/` → next-card hrefs: `../dzhon-gill-chast-4-ekzeget/` then `../dzhon-gill-spravochnik/`.
  - `/articles/dzhon-gill-chast-4-ekzeget/` → next-card hrefs: `../dzhon-gill-chast-2-uchenyi/` (prev) and `../dzhon-gill-chast-3-nasledie/` (next).
  - The live in-series navigation is therefore distorted: from Part 4 you go "next" to Part 3 (Part 3 is rendered after Part 4 in the sequence), confirming the `part4 → part3` inversion ships to production.
- **W5 lifecycle** (`verified-lifecycle`):
  - `SERIES_ORDER` in `src/data/site.ts` is consumed only by `src/layouts/ArticleLayout.astro` and `src/layouts/SeriesArticleLayout.astro`, **both orphaned** (zero `src/` importers — see `EVIDENCE_ARTICLE-LAYOUT-SERIES-HARDCODE.md`). `scripts/check-data-consistency.js` also reads it but as a data check, not a render path.
  - The **active** series nav consumer is `seriesConfig.ts` → `GILL_SERIES_ITEMS` (`gillSeriesData.ts`), rendered by `GillSeriesChrome`/`SeriesReaderChrome`. So the production symptom comes from `gillSeriesData.ts`, not `site.ts`.

## Mechanism
The active `GILL_SERIES_ITEMS` array places `part4` before `part3` and assigns roman numerals III/IV respectively. The live Gill-series reader renders prev/next cards from this array, so the on-site sequence goes …part2 → part4 → part3 → spravochnik, with part4 labelled "III" and part3 labelled "IV". This inverts the canonical part order and misnumbers the parts. (The `site.ts` `SERIES_ORDER['dzhon-gill']` has the same Part4-before-Part3 inversion, but as dead code it does not cause the live symptom.)

## Impact
medium — user-visible in-series navigation and part numbering on the live Gill series is wrong (Part 4 appears as "Часть III" and precedes Part 3 "Часть IV").

## Owner / collision
- Semantic owner: Gill series engine owner (`gillSeriesData.ts` / `seriesConfig.ts`).
- Open Product branch check (2026-08-19): no open branch touches `gillSeriesData.ts` ordering. No collision.

## Proposal (for the verification/consolidation wave)
- **Keep `SERIES-ORDER-INDEX-MISMATCH` in MASTER as `current-local`**, but **re-anchor the root** from `src/data/site.ts` to `src/components/article-pilots/gill-series/gillSeriesData.ts` (`GILL_SERIES_ITEMS`): swap the `part3`/`part4` entries so order is `…part2, part3, part4…` and assign `part3` roman `III`, `part4` roman `IV` (and matching hrefs/mark).
- As a cleanup, also fix the dead `SERIES_ORDER['dzhon-gill']` in `site.ts` (or delete the orphaned layouts) so the two sources don't disagree again.
- Closure boundary: live Gill pages `/articles/dzhon-gill-chast-3-nasledie/` prev = part2 / next = part4, and `/articles/dzhon-gill-chast-4-ekzeget/` prev = part3 / next = spravochnik; part3 labelled "III", part4 labelled "IV"; `check-data-consistency` green; row removed from MASTER.

## What this evidence does NOT prove
- The editorial intent: it is *conceivable* the owner intended part4 ("Экзегет") to be read before part3 ("Наследие"). The roman numerals (III on part4, IV on part3) and the canonical part numbering strongly indicate this is an inversion, but the owner should confirm the intended reading order before reordering. If the order is intentional, only the **roman numerals** are wrong (part4 should not be "III"); if the order is wrong, both order and numerals are wrong. Flagged as owner-sanity-check before repair.
- A full Gill-series cross-link audit (TOC, rail, mobile bar all derive from `GILL_SERIES_ITEMS`; only the live next/prev cards were checked here).

## Labels
`verified-source`, `verified-live`, `verified-lifecycle`, `current-confirmed-for-work`, `audit-drift` (first pass cited dead `site.ts` as the root; production-active root is `gillSeriesData.ts`)
