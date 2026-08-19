# MASTER BUG MATRIX — gb-is-my-strength

> SSOT for current verified necessary work only. This is not a history table or a mirror of every source-repository signal.

## Current state

| Field | Value |
|---|---|
| Active work units | **16** |
| Direct current defects | **13** |
| Verified necessary improvements | **1** |
| Narrowed residuals | **0** |
| System verification lanes | **2** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 13

| ID | Current problem | Boundary |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | `/rodosloviye/` head incorrectly uses `/karty/` OG/Twitter image. | HEAD 485db8c |
| `ARTICLE-LAYOUT-SERIES-HARDCODE` | `ArticleLayout.astro` lacks mapping for `genesis-6` series; breadcrumbs show raw key. | HEAD 485db8c |
| `SERIES-ORDER-INDEX-MISMATCH` | `site.ts` defines John Gill Part 4 before Part 3, breaking navigation sequence. | HEAD 485db8c |
| `ANCESTOR-TRACING-INCOMPLETE` | `layout.ts` ignores maternal lines in focus lineage (linear pointer instead of tree/queue). | HEAD 485db8c |
| `ARTICLE-AUTHOR-HARDCODED` | Author/Translation logic in `ArticleLayout.astro` is hardcoded to single author string. | HEAD 485db8c |
| `GENEALOGY-NO-ERROR-BOUNDARY` | `GenealogyTree.tsx` (React island) has no ErrorBoundary; runtime crash = blank page. | HEAD 485db8c |
| `MOBILE-CHROME-REGISTRY-GAPS` | Routes like `/pastor-series/` and Genesis 6 articles missing from mobile bottom-bar registry. | HEAD 485db8c |
| `GENEALOGY-ID-INVALID-SPACE` | Leading space in ID `" lud_shem"` in `genealogy.json` breaks graph integrity. | HEAD 485db8c |
| `UI-DUPLICATE-SEARCH-BUTTONS` | Double search icons on routes where both Header.astro and ReaderPreferencesHead.astro act. | HEAD 485db8c |
| `METADATA-FUTURE-DATED` | `/app/` landing page claims future publication date (2026-08-17). | HEAD 485db8c |
| `SECURITY-CSP-GAPS` | Articles lack Content-Security-Policy meta tags present on other pages. | HEAD 485db8c |
| `SECURITY-CSP-INCONSISTENCY` | Biografii CSP misses `gospod-bog.ru` in `img-src`, potentially breaking absolute paths. | HEAD 485db8c |
| `EDITORIAL-LABEL-INCONSISTENCY`| `Header.astro` uses non-canonical label for `hard-texts` section. | HEAD 485db8c |

## VERIFIED NECESSARY IMPROVEMENTS — 1

| ID | Needed implementation | Why |
|---|---|---|
| `TRACE-GOLDEN-PATH-PERF` | Refactor `traceGoldenPath` to use Map for $O(1)$ lookups instead of $O(N^2)$ `find` in loop. | Scalability for genealogy data. |

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 2

| ID | Verified work package | Next boundary |
|---|---|---|
| `METADATA-SSOT-PROLIFERATION` | Centralize metadata (series labels, author roles) from layout hardcode to `site.ts`. | Verify removal of hardcode. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | Centralize CSP generation to avoid gaps (articles) and inconsistency (img-src). | Unified security head. |

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|

## Terminal disposition

The matrix may be empty. Admit a row only after signal classification, exact-anchor applicability, current necessity and ownership are established. Remove solved, stale, duplicate, absorbed and superseded rows in the same closure transaction.
