# Lot audit — current status index

**Updated:** 2026-08-09 — post-Search / post-visual-parity correction  
**Latest Product main observed:** `59e99bfa277e5bcc9e1d153644e73a2fa2c92a24`  
**Active Lot publication:** Product PR `#1339@189dfddbeed537c849dd35b1a92578ead894079d`  
**Fresh ancestry:** `#1339` is `behind=9`, `ahead=10`, merge base `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

Current owner/print corrections: [`../2026-08-09-post-search-merge-audit-correction/REPORT.md`](../2026-08-09-post-search-merge-audit-correction/REPORT.md).

## Confirmed current Lot publication/content residuals

| ID | Severity | Current disposition | Correct owner / next proof |
|---|---|---|---|
| `LOT-SEO-WEBSITE-01` | P1 release | `CONFIRMED-CURRENT` | #1339: add canonical JSON-LD `#website`; rerun exact-head registry/SEO evidence. |
| `LOT-HUMAN-REACHABILITY-01` | P1 release | `CONFIRMED-CURRENT / ABSORBED-UPSTREAM` | #1348 is the exhaustive `/articles/` owner, current-main and role-aware; no one-off Lot card. |
| `LOT-BIBLE-TOOLTIP-01` | P1 content / P2 interaction | `CONFIRMED-CURRENT` | Project required Scripture references through canonical `.bref > .btip` + Bible-data projection and a positive expected-count browser witness. [`SCRIPTURE_TOOLTIP_CONTRACT.md`](SCRIPTURE_TOOLTIP_CONTRACT.md). |
| `LOT-TOC-MAP-01` | P2 navigation | `CONFIRMED-CURRENT` | Add live H2 `#sec-map-connection` to canonical TOC; full census found no second normal H2 omission. |
| `LOT-JOURNEY-EGYPT-01` | P2 semantic visual | `CONFIRMED-CURRENT` | Journey SVG must include the narrated Egypt-return sequence before Genesis 13 separation without inventing unknown route geometry. |
| `LOT-SVG-RESPONSIVE-READABILITY-01` | P2 visual/accessibility | `CONFIRMED-CURRENT` | 390px geometry scales 13-unit semantic labels to ~3.9–4.2 CSS px. Require responsive/scroll-owned semantic presentation and browser geometry witness. [`SVG_RESPONSIVE_READABILITY.md`](SVG_RESPONSIVE_READABILITY.md). |
| `LOT-MEDIA-REVEAL-PRINT-01` | P2 visual/print | `CONFIRMED-CURRENT / PLACEMENT-READINESS` | `LotFigure` uses hidden-base `.reveal`; `view()` timelines are inactive in paged media and no generic print visibility owner was found. Every accepted figure needs explicit print/PDF visibility proof. [`post-Search correction`](../2026-08-09-post-search-merge-audit-correction/REPORT.md). |
| `LOT-QUIZ-CONTENT-QUALITY-01` | P2 content | `CONFIRMED-CURRENT` | 6/8 `full` explanations are below explicit 2–4 sentence standard; replace plainly impossible filler distractors. [`QUIZ_CONTENT_QUALITY.md`](QUIZ_CONTENT_QUALITY.md). |
| `LOT-SEARCH-ROLE-01` | P2 discovery | `MERGED-UPSTREAM / READY-TO-REGENERATE` | #1313 is merged. Refresh #1339 and rematerialize Search/RSS/sitemap canonically; do not keep a Search-writer defect open for Lot. |
| `LOT-SOURCE-LINKS-01` | P3 source verifiability | `VERIFIED-NECESSARY-IMPROVEMENT` | Add direct primary links for already-cited Jaret/Harris and Boslough/Bruno critiques. |
| `LOT-NUMAYRA-DATE-01` | P3 source annotation | `PARTIAL/NARROWED` | Linked EDSP page says ~30% extant site excavated 1979–1983, while broader field history includes 1977. Clarify annotation only. [`NUMAYRA_DATE_CORRECTION.md`](NUMAYRA_DATE_CORRECTION.md). |

All route/content/media/print symptoms remain consolidated under `LOT-PUBLICATION-READINESS-01`, except human reachability under `CATALOG-PROJECTION-01`. Search writer root is merged/retired.

## Shared native quiz defects

The quiz **does render** natively. Product #1365 is closed false-positive. Current shared owner is Product **#1369**:

| ID | Current disposition | Evidence |
|---|---|---|
| `ARTICLE-QUIZ-SCORE-RANGE-01` | `CONFIRMED-CURRENT / SYSTEMIC-MANIFESTATION` | Native selector assumes `{min,max}` while accepted configs use ordered `min` thresholds; named tiers fall through and badge is ignored. [`NATIVE_QUIZ_SCORE_CONTRACT.md`](NATIVE_QUIZ_SCORE_CONTRACT.md). |
| `ARTICLE-QUIZ-EXPLANATION-PARITY-01` | `CONFIRMED-CURRENT / SYSTEMIC-MANIFESTATION` | Native feedback uses `short || full`; all 8 Lot questions hide their deeper full explanation. [`NATIVE_QUIZ_EXPLANATION_PARITY.md`](NATIVE_QUIZ_EXPLANATION_PARITY.md). |

## Media / illustration readiness

Fresh branch census against Product `main@59e99bfa…`:

- `lane/lot-media-20260809` — `ahead=0 / behind=1`; still zero unique media bytes;
- `lane/lot-illustration-placement-20260809` — `ahead=11 / behind=6`, source-only seven-file delta;
- conceptual families: 14;
- publication registry rows: **9**;
- rendered `<LotFigure>` placements: **9**;
- explicit reserves: 5;
- #1339 declared final raster gate: **14**.

Owner must either deliver/test 14 or explicitly accept/test 9. Evidence must assert exact positive count, and every accepted figure must also be visible in print/PDF despite `.reveal`. [`MEDIA_PLACEMENT_READINESS.md`](MEDIA_PLACEMENT_READINESS.md).

Lot-specific OG remains unfinished; generic site OG is not closure.

## Expected derived/replay work, not new bugs

- Scripture occurrence writer #1353 is merged; stale #1339 derivative must refresh canonically.
- Search role authority #1313 is merged; stale Lot generated Search/RSS/sitemap must regenerate canonically.
- `LOT-ANCESTRY-01`: #1339 is **behind=9**; every final check must be re-earned.
- Avraam Tall el-Hammam remains separate under #1334/#1298.

## Explicitly closed / not promoted

- `LOT-QUIZ-RENDER-01` — false-positive/closed; native renderer exists.
- Product #1365 — closed `not_planned`; do not restore/copy legacy `site.js`.
- `Сигор` vs `Цоар`, hand-written `.gterm` absence and Back-to-home destination — no proved route-contract defect.
- Pagefind body/meta placement — exact #1339 Search Manifest Policy built/indexed and policy passed; no defect promoted.
- archaeology `.compare-table` mobile layout — shared block/card CSS + `data-label` contract exists; no defect promoted.

## Factual verification snapshot

- Tall el-Hammam retraction boundary: PASS without overclaim.
- Deir ‘Ain ‘Abata / Agios Lot late-antique reception boundary: PASS.
- central Genesis / 2 Peter / Ezekiel / Jude / Moab-Ammon / Ruth-David source boundaries: no material correction from this audit.
- Numayra remains the single narrowed source-annotation item.

## Current upstream Product owners

- #1339 — Lot publication, draft/open, **behind=9**;
- #1348 — catalog/human reachability, draft/open, current head `e2e6385c…`, current-main based and role-aware;
- #1334 — Avraam retraction parity, draft/open;
- #1369 — shared native quiz parity, open issue, no implementation PR at this checkpoint;
- #1313 — Search role authority, **merged**;
- #1353 — Scripture occurrence writer, **merged**.

Recheck before Product mutation; AuditRepo evidence does not authorize takeover of another lane.