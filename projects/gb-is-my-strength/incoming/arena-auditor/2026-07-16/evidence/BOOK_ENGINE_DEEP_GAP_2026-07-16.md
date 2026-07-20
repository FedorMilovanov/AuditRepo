# Book engine deep gap — Heart vs polished prototype

**HEAD:** `f5e2b4ff`  
**Prototype:** `working/book-visual-prototype-2026-07-15/GBS-book-polished.html` (v7)  
**Data owner:** `hardTextsSeriesConfig.ts` HEART_CHAPTERS  

---

## Data (landed)

| Item | Count / fact |
|---|---|
| Chapters `tier:'chapter'` | 4 (I–IV) |
| Articles under chapters (arabic) | 4 leads + 18 former satellites = **22** |
| Labels | Пролог + Справочник |
| `pages[id].partToc` | per article |
| Validator | `defineSeriesConfig` enforces parent/chapter/arabic |
| `isBookSeries()` | present, implicit (no `shape` field) |
| Bodies on HARD_TEXTS_SERIES | **25** components |

## UI surfaces

| Surface | Book depth | Notes |
|---|---|---|
| `GillPartTocOverlay` | chapter → articles → **current** article sections | structure OK |
| `GillSeriesRail` current card TOC | current **page** H2/H3 only | not multi-article accordion |
| `GillSeriesRail` kids | flat «В этой главе» list | no nested sections per article |
| Progress copy | «Прогресс **серии**» | prototype: «книги» |
| Dual progress mobile | series + article rings exist | labels may still say series |
| Queue player / sticky heads / stagger | prototype only | |

## Interaction with deploy P0

Book visual work is **blocked for prod visibility** by DEP-BLOCK-DIST-PUBLICATION-AUDIT.  
Even after deploy green, book rail remains **below** prototype until SeriesTree port.

## Repair order (do not mix)

1. Gate marker fix (deploy)  
2. SSOT reverify  
3. Book rail nested TOC + copy via existing GillSeries* only  
