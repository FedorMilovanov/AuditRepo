# Lot audit — current status index

**Updated:** 2026-08-09 — post-Search correction  
**Latest Product main observed:** `c389f88ed06eb8e30cebf2a1c4f0d5764c18522f`  
**Active Lot publication:** Product PR `#1339@189dfddbeed537c849dd35b1a92578ead894079d`  
**Fresh ancestry:** `#1339` is `behind=8`, `ahead=10`, merge base `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

This is the compact current entrypoint. Detailed history remains in sibling evidence files; current owner/search/print corrections are recorded in [`../2026-08-09-post-search-merge-audit-correction/REPORT.md`](../2026-08-09-post-search-merge-audit-correction/REPORT.md).

## Confirmed current Lot publication/content residuals

| ID | Severity | Current disposition | Correct owner / next proof |
|---|---|---|---|
| `LOT-SEO-WEBSITE-01` | P1 release | `CONFIRMED-CURRENT` | #1339: add canonical JSON-LD `#website`; rerun exact-head registry/SEO evidence. |
| `LOT-HUMAN-REACHABILITY-01` | P1 release | `CONFIRMED-CURRENT / ABSORBED-UPSTREAM` | #1348 is the exhaustive `/articles/` owner. It is now on current Product main and role-aware; no one-off Lot card. |
| `LOT-BIBLE-TOOLTIP-01` | P1 content / P2 interaction | `CONFIRMED-CURRENT` | Project required Scripture references through canonical `.bref > .btip` + Bible-data projection and a positive expected-count browser witness. See [`SCRIPTURE_TOOLTIP_CONTRACT.md`](SCRIPTURE_TOOLTIP_CONTRACT.md). |
| `LOT-TOC-MAP-01` | P2 navigation | `CONFIRMED-CURRENT` | Add live H2 `#sec-map-connection` to canonical TOC; full census found no second normal H2 omission. |
| `LOT-JOURNEY-EGYPT-01` | P2 semantic visual | `CONFIRMED-CURRENT` | Journey SVG must include the explicitly narrated Egypt-return sequence before Genesis 13 separation, without inventing unknown route geometry. |
| `LOT-SVG-RESPONSIVE-READABILITY-01` | P2 visual/accessibility | `CONFIRMED-CURRENT` | Current 390px geometry scales 13-unit semantic labels to ~3.9–4.2 CSS px. Require a responsive/scroll-owned semantic presentation and browser geometry witness. See [`SVG_RESPONSIVE_READABILITY.md`](SVG_RESPONSIVE_READABILITY.md). |
| `LOT-MEDIA-REVEAL-PRINT-01` | P2 visual/print | `CONFIRMED-CURRENT / PLACEMENT-READINESS` | Current `LotFigure` uses `class="article-img reveal"`; hidden base state is `opacity:0`, while the intended `view()` reveal timeline is inactive in paged/print media and no generic print `.reveal` visibility override/controller was found. Whichever final figure count is accepted must be explicitly visible in print/PDF. Full source/spec boundary: [`post-Search correction`](../2026-08-09-post-search-merge-audit-correction/REPORT.md). |
| `LOT-QUIZ-CONTENT-QUALITY-01` | P2 content | `CONFIRMED-CURRENT` | 6/8 `full` explanations are below the explicit 2–4 sentence teaching standard; replace plainly impossible filler distractors. See [`QUIZ_CONTENT_QUALITY.md`](QUIZ_CONTENT_QUALITY.md). |
| `LOT-SEARCH-ROLE-01` | P2 discovery | `MERGED-UPSTREAM / READY-TO-REGENERATE` | Product #1313 is merged in `main@c389f88…`. Do not keep a Search-writer defect open for Lot; refresh #1339 and rematerialize Search/RSS/sitemap through the canonical writer. |
| `LOT-SOURCE-LINKS-01` | P3 source verifiability | `VERIFIED-NECESSARY-IMPROVEMENT` | Add direct primary links for already-cited Jaret/Harris and Boslough/Bruno Scientific Reports critiques. |
| `LOT-NUMAYRA-DATE-01` | P3 source annotation | `PARTIAL/NARROWED` | The linked EDSP page says ~30% extant site excavated 1979–1983, but broader field history includes 1977. Clarify the bibliography annotation only. See [`NUMAYRA_DATE_CORRECTION.md`](NUMAYRA_DATE_CORRECTION.md). |

All route/content/media/print symptoms above remain consolidated under active MASTER `LOT-PUBLICATION-READINESS-01`, except human reachability which belongs to `CATALOG-PROJECTION-01`. The Search-role writer root is merged and is no longer an active MASTER lane.

## Shared native quiz defects discovered through Lot

The quiz **does render** through the native chain. Product #1365 is closed `not_planned` as a false-positive extraction root.

Current shared owner is Product **#1369**:

| ID | Current disposition | Evidence |
|---|---|---|
| `ARTICLE-QUIZ-SCORE-RANGE-01` | `CONFIRMED-CURRENT / SYSTEMIC-MANIFESTATION` | Native result selector assumes `{min,max}` but accepted configs use ordered `min` thresholds; Lot's named tiers therefore fall through. Configured badge is also ignored. [`NATIVE_QUIZ_SCORE_CONTRACT.md`](NATIVE_QUIZ_SCORE_CONTRACT.md). |
| `ARTICLE-QUIZ-EXPLANATION-PARITY-01` | `CONFIRMED-CURRENT / SYSTEMIC-MANIFESTATION` | Native feedback uses `short || full`; all 8 Lot questions have both and therefore hide the deeper full explanation. [`NATIVE_QUIZ_EXPLANATION_PARITY.md`](NATIVE_QUIZ_EXPLANATION_PARITY.md). |

MASTER consolidates both as `SYS-ARTICLE-QUIZ-NATIVE-PARITY` / Product #1369. Do not hide them with Lot-only config edits.

## Media / illustration readiness

Fresh branch census against Product `main@c389f88…`:

- `lane/lot-media-20260809` — **identical to current main**, zero unique media bytes;
- `lane/lot-illustration-placement-20260809` — `ahead=11 / behind=5`, source-only seven-file delta;
- conceptual families: 14;
- publication registry rows: **9**;
- actual rendered `<LotFigure>` placements: **9**;
- explicit reserve families: 5;
- #1339 declared final raster gate: **14**.

Current source therefore encodes a 9-visible editorial set while publication wording still promises 14. Owner must either deliver/test 14 or explicitly accept/test 9. Browser evidence must assert the exact positive expected count; print/PDF evidence must also prove every accepted figure is visible despite `.reveal`. See [`MEDIA_PLACEMENT_READINESS.md`](MEDIA_PLACEMENT_READINESS.md).

Lot-specific OG remains a separate unfinished media gate; generic site OG is not closure.

## Expected derived/replay work, not new bugs

- Scripture occurrence writer #1353 is merged; stale #1339 derivative must be refreshed canonically after ancestry replay.
- Search role authority #1313 is merged; stale Lot generated Search/RSS/sitemap must be regenerated, not manually edited.
- `LOT-ANCESTRY-01`: #1339 is **behind=8**; every final route/source/media/browser check must be re-earned on current ancestry.
- Avraam Tall el-Hammam parity remains separate under #1334/#1298.

## Explicitly closed / not promoted

- `LOT-QUIZ-RENDER-01` — `FALSE-POSITIVE / CLOSED`; native renderer exists.
- Product #1365 — closed `not_planned`; do not restore/copy legacy `site.js`.
- `Сигор` vs `Цоар` — not a proved route-policy violation.
- absence of hand-written `.gterm` — not a defect by itself; shared glossary projection/direct prose explanation can own terms.
- Back-to-home destination — not a proved standalone reader-contract defect.
- Pagefind body/meta placement — current exact #1339 Search Manifest Policy built/indexed successfully and route/search policy passed; no current defect promoted.
- archaeology `.compare-table` mobile layout — shared CSS already supplies a block/card layout using the route's `data-label` cells; no current responsive defect promoted.

## Factual verification snapshot

Verified-pass boundaries remain:

- Tall el-Hammam: the 2025 Scientific Reports retraction invalidates the 2021 airburst paper as established positive evidence without proving the site cannot be biblical Sodom.
- Deir ‘Ain ‘Abata / Agios Lot: late-antique sanctuary/Madaba/mosaic evidence is presented as reception/local memory, not direct Bronze Age identification proof.
- central Genesis / 2 Peter / Ezekiel / Jude / Moab-Ammon / Ruth-David claims reviewed in this audit remain within their stated evidence boundaries.

Numayra remains the single narrowed source-annotation item rather than a substantive archaeological reversal.

## Current upstream Product owners

- #1339 — Lot publication, draft/open, **behind=8**;
- #1348 — exhaustive Articles catalog/human reachability, draft/open, current head `b526a175…`, **behind=0** and already role-aware;
- #1334 — Avraam Tall el-Hammam retraction parity, draft/open;
- #1369 — shared native quiz parity, open issue, no implementation PR at this checkpoint;
- #1313 — Search new-row role authority, **merged**;
- #1353 — Scripture occurrence writer, **merged**.

Recheck before Product mutation. AuditRepo evidence never grants permission to take over another active implementation lane.