# Witness Matrix — arena-bugverifikator 2026-08-19

Anchor: Product `cb3681e` + live gospod-bog.ru

| ID | W2 source | W3 artifact | W4/live HTTP | W5 lifecycle | Disposition this pass |
|---|---|---|---|---|---|
| RODOSLOVIYE-OG-IMAGE | Y PageHead og-karty | Y committed html | Y live og:image | — | **confirm FAIL** |
| SERIES-ORDER-INDEX-MISMATCH | Y gillSeriesData + audit expectedOrder | Y | Y titles/nav | Y intentional 2026-07-09 reorder | **challenge → not a defect** |
| ARTICLE-AUTHOR-HARDCODED | Y orphan ArticleLayout only | — | Y live bylines OK | dead layout | **challenge → likely invalid** |
| GENEALOGY-NO-ERROR-BOUNDARY | Y GenealogyTree | — | — | — | confirm (source-only) |
| GENEALOGY-ID-INVALID-SPACE | Y genealogy.json | — | — | — | confirm FAIL |
| EDITORIAL-LABEL-INCONSISTENCY | Y Header vs site.ts | — | Y nav label | feeds METADATA-SSOT | confirm FAIL |
| SECURITY-CSP-* / FRAGMENTED-SECURITY | Y BaseLayout no CSP; postbuild hardenCsp | — | Y CSP on live | system ownership | confirm system |
| SW-PWA-FRESHNESS | Y sw.js cacheFirst / CACHE_VERSION | — | — | — | confirm improvement |
| MOBILE-CHROME-REGISTRY-GAPS | Y Genesis6ArticlePage→SeriesReaderChrome→MobileBar | — | Y bottom bar markers | closed-by-fix | **challenge → remove** |
| MOBILECHROME-GENESIS6-BAR-DECISION | same | — | same | decision unblocked | **challenge → drop** |
| AR-IDX-JS-02-MULTIWRITER | Y site.js theme vs reader-preferences | — | — | multi-key | confirm residual |
| MISSING-BUTTON-TYPE | Y ≥38 astro buttons | — | — | — | confirm residual |
| SEARCH-LAZY-LOADER-DRIFT | partial | — | — | — | weak confirm residual |
| METADATA-SSOT-PROLIFERATION | Y multi owners + dead layouts | — | Y label split | system | confirm system |
| GENEALOGY-CHILDREN-UNRESOLVED | Y 59 dangling children | — | — | integrity banner false | **NEW** |

Legend: Y = witnessed this pass; — = not collected / not required for disposition.
