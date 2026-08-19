# Comment on Finding

## Identity
- Project: gb-is-my-strength
- Comment by: arena-bugverifikator
- Date: 2026-08-19
- Target report/finding ID: `SERIES-ORDER-INDEX-MISMATCH`
- Audited anchor: Product `main` HEAD `cb3681e1a85b5f8919c9dc537f812a842bbe9235`; source of `gillSeriesData.ts` + `scripts/gill-series-data-consistency-audit.js`; live GET of Gill part3/part4 routes
- Signal class: Product
- Proof state: PASS for intentional product state / FAIL only if the claim is «this is a defect»
- Claim boundary: current Product main + live
- Semantic owner: Gill series engine (`gillSeriesData.ts`); product audit lock in `gill-series-data-consistency-audit.js`

## Comment type
`challenge` — the part4→part3 display order is intentional, not a bug.

## Evidence

```text
scripts/gill-series-data-consistency-audit.js L174-177:
  // Reading order (2026-07-09 display reorder): exegete (part4) now displays as
  // «Часть III» and precedes legacy (part3) which displays as «Часть IV».
  // Internal ids/slugs unchanged; only display order/numbering swapped.
  const expectedOrder = ['context','part1','part2','part4','part3','spravochnik'];

src/.../gillSeriesData.ts GILL_SERIES_ITEMS:
  part4 mark III title «Часть III. Экзегет» href .../chast-4-ekzeget/
  part3 mark IV title «Часть IV. Наследие» href .../chast-3-nasledie/

Live:
  /articles/dzhon-gill-chast-4-ekzeget/ title/H1 «Часть III: Экзегет»
  /articles/dzhon-gill-chast-3-nasledie/ title/H1 «Часть IV: Наследие»
  in-series nav: Экзегет before Наследие; next/prev match display order

site.ts SERIES_ORDER['dzhon-gill'] has same order but is dead code
(only imported by orphan ArticleLayout/SeriesArticleLayout — zero src/pages importers).
```

## Recommended disposition
- Remove from MASTER as a **defect**.
- Optional Work Queue: `GILL-SLUG-DISPLAY-ORDINAL-DRIFT` (slug chast-3/4 vs roman III/IV hygiene / docs).
- Do **not** «fix» by swapping items back — that would fail the product consistency audit.

## What this does not prove
Does not claim the historical internal id `part3`/`part4` naming is ideal; only that current public order is deliberate product state.
