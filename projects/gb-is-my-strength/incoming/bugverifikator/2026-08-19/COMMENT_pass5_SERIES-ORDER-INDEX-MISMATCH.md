# Comment on Finding

## Identity
- Project: gb-is-my-strength
- Comment by: bugverifikator
- Date: 2026-08-19
- Target report: `incoming/2026-07-17-arena-agent-surface-pass-5.md`
- Target finding ID: `SERIES-ORDER-INDEX-MISMATCH`
- Audited anchor (SHA / artifact / live snapshot): Product `main` HEAD `cb3681e`; source witness of `src/components/article-pilots/gill-series/gillSeriesData.ts`; live HTTP fetch of `https://gospod-bog.ru/articles/dzhon-gill-chast-3-nasledie/` and `…/dzhon-gill-chast-4-ekzeget/` on 2026-08-19
- Signal class: Product
- Proof state: FAIL (defect confirmed live, but the cited carrier is dead code)
- Claim boundary: current Product `main` HEAD cb3681e + live production
- Semantic owner / overlap check: Gill series engine owner (`gillSeriesData.ts` / `seriesConfig.ts`); no competing lane.

## Comment type
`challenge` — оспариваю cited root + severity; defect is real but the report points at dead code.

## Evidence

```
# Carrier cited by the report — src/data/site.ts SERIES_ORDER['dzhon-gill'] @ cb3681e
  'dzhon-gill': [ '…istoricheskiy-kontekst','chast-1-chelovek','chast-2-uchenyi',
                   'chast-4-ekzeget','chast-3-nasledie','spravochnik' ]   # Part4 before Part3 — malformed, BUT
# → SERIES_ORDER is imported only by src/layouts/ArticleLayout.astro and src/layouts/SeriesArticleLayout.astro.
#   Full-tree scan: ZERO src/ importers of either layout on cb3681e (only docs/** reference them).
#   So site.ts SERIES_ORDER is DEAD CODE and does NOT cause the live symptom.

# ACTIVE carrier — src/components/article-pilots/gill-series/gillSeriesData.ts @ cb3681e, GILL_SERIES_ITEMS (L56-98)
  { id:"context" … }, { id:"part1", mark:{roman:"I"} … }, { id:"part2", mark:{roman:"II"} … },
  { id:"part4", mark:{ kind:"roman", value:"III" }, href:"/articles/dzhon-gill-chast-4-ekzeget/" },   # ← Part4 BEFORE Part3, labelled III
  { id:"part3", mark:{ kind:"roman", value:"IV" },  href:"/articles/dzhon-gill-chast-3-nasledie/" },   # ← Part3 AFTER Part4, labelled IV
  { id:"spravochnik" … }

# LIVE witness (HTTP, 2026-08-19)
  /articles/dzhon-gill-chast-3-nasledie/  next-cards: ../dzhon-gill-chast-4-ekzeget/ , ../dzhon-gill-spravochnik/
  /articles/dzhon-gill-chast-4-ekzeget/  next-cards: ../dzhon-gill-chast-2-uchenyi/ (prev), ../dzhon-gill-chast-3-nasledie/ (next)
  → the live in-series sequence is …part2 → part4 → part3 → spravochnik, with part4 shown as "Часть III" and part3 as "Часть IV".
```

## Summary
The report is right that there is a Part4-before-Part3 inversion, but it attributes it to `src/data/site.ts` `SERIES_ORDER`, which is **dead code** on cb3681e (its only consumers, `ArticleLayout.astro` and `SeriesArticleLayout.astro`, are orphaned — zero `src/` importers). The **production-active** source of the order is `gillSeriesData.ts` `GILL_SERIES_ITEMS`, which places `part4` before `part3` AND labels `part4` as roman `III` and `part3` as roman `IV`. Live HTTP fetch confirms the distortion ships to production (from Part 4 you go "next" to Part 3; Part 4 is rendered as "Часть III"). So the defect is real and **user-visible** — the report's `low (ordering only)` impact understates it. The repair lane must target `gillSeriesData.ts`, not `site.ts`.

## Recommended action
- Status change: keep `SERIES-ORDER-INDEX-MISMATCH` as `current-local`, but **re-anchor root** `src/data/site.ts` → `src/components/article-pilots/gill-series/gillSeriesData.ts` (`GILL_SERIES_ITEMS`); **raise impact low → medium** (user-visible navigation + part numbering on the live Gill series).
- Proposal status: proposal-conflicted (the report's proposed fix site is wrong/dead; correct site is `gillSeriesData.ts`).
- Conflict registry entry: YES — record that the active root is `gillSeriesData.ts`, not `site.ts`, so no future lane wastes effort on the dead `SERIES_ORDER`.
- Notes for verifier: owner-sanity-check recommended — confirm intended Gill part3/part4 reading order. If the order is intentional, only the roman numerals are wrong (part4 must not be "III"); if the order is wrong, both order and numerals need swapping. Cleanup: also fix or delete the dead `SERIES_ORDER['dzhon-gill']` in `site.ts` so the two sources stop disagreeing.
