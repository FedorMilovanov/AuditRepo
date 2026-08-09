# Lot audit — current status index

**Updated:** 2026-08-09 — current MASTER consolidation  
**AuditRepo preserved evidence base:** `a8283267ae0810b8d8c91c3dd7981dd001a1da06`  
**Latest Product main observed:** `3c7b3c199dcf3d2464f38a55550d730a3279c171`  
**Active Lot publication:** Product PR `#1339@189dfddbeed537c849dd35b1a92578ead894079d`  
**Fresh ancestry:** `#1339` is `behind=7`, `ahead=10`, merge base `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

This file is the compact entrypoint for the dated Lot audit evidence in this directory. Product current-head verification remains authoritative for code/CI/ownership; the active AuditRepo work root is `LOT-PUBLICATION-READINESS-01` in `verified/MASTER_BUG_MATRIX.md`.

## Confirmed current Lot publication/content residuals

| ID | Severity | Current disposition | Correct owner / next proof |
|---|---|---|---|
| `LOT-SEO-WEBSITE-01` | P1 release | `CONFIRMED-CURRENT` on #1339 | Route-local publication #1339: add canonical JSON-LD `#website`, rerun exact-head registry/SEO browser job. |
| `LOT-HUMAN-REACHABILITY-01` | P1 release | `CONFIRMED-CURRENT / ABSORBED-UPSTREAM` | Product #1348 is the exhaustive `/articles/` catalog owner; no one-off Lot card. Refresh #1339 after #1348. Active MASTER representation: `CATALOG-PROJECTION-01`. |
| `LOT-BIBLE-TOOLTIP-01` | P1 content / P2 interaction | `CONFIRMED-CURRENT` | Lot publication/content integration: canonical `.bref > .btip` + Bible-data projection; positive expected-count browser witness. See [`SCRIPTURE_TOOLTIP_CONTRACT.md`](SCRIPTURE_TOOLTIP_CONTRACT.md). |
| `LOT-TOC-MAP-01` | P2 navigation | `CONFIRMED-CURRENT` | #1339: add live `#sec-map-connection` H2 to canonical TOC; no other normal H2 omission was found in the full census. |
| `LOT-JOURNEY-EGYPT-01` | P2 semantic visual | `CONFIRMED-CURRENT` | Journey SVG must include the explicitly narrated return sequence involving Egypt before the Genesis 13 separation; preserve the no-invented-route boundary. |
| `LOT-SVG-RESPONSIVE-READABILITY-01` | P2 visual/accessibility | `CONFIRMED-CURRENT` | Lot visual/browser lane: responsive/scroll-owned semantic figure presentation; current 390px geometry scales 13-unit labels to ~3.9–4.2 CSS px. See [`SVG_RESPONSIVE_READABILITY.md`](SVG_RESPONSIVE_READABILITY.md). |
| `LOT-QUIZ-CONTENT-QUALITY-01` | P2 content | `CONFIRMED-CURRENT` | Lot quiz content owner: 6/8 `full` explanations below explicit 2–4 sentence standard; replace obvious filler distractors. See [`QUIZ_CONTENT_QUALITY.md`](QUIZ_CONTENT_QUALITY.md). |
| `LOT-SEARCH-ROLE-01` | P2 discovery | `CONFIRMED-CURRENT / ABSORBED-UPSTREAM` | Product #1313 owns new-row author/editor/translator authority; after merge #1339 must rematerialize Search/RSS/sitemap canonically. Active MASTER representation: `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY`. |
| `LOT-SOURCE-LINKS-01` | P3 source verifiability | `VERIFIED-NECESSARY-IMPROVEMENT` | Add direct primary links for already-cited Jaret/Harris and Boslough/Bruno Scientific Reports critiques. |
| `LOT-NUMAYRA-DATE-01` | P3 source annotation | `PARTIAL/NARROWED` | Current EDSP page says ~30% extant site excavated 1979–1983, but broader record includes 1977 fieldwork. Clarify bibliography annotation only. See [`NUMAYRA_DATE_CORRECTION.md`](NUMAYRA_DATE_CORRECTION.md). |

These route/content symptoms are consolidated in active MASTER as **`LOT-PUBLICATION-READINESS-01`** except where the table explicitly says they are absorbed by a separate systemic owner.

## Shared native-runtime defects discovered through Lot

These are **not** route-local Lot hacks. They affect the shared native article quiz contract and were reverified directly on current Product `main@3c7b3c19…` after merged reader #1267.

| ID | Severity | Current disposition | Evidence / owner |
|---|---|---|---|
| `ARTICLE-QUIZ-SCORE-RANGE-01` | P2 shared runtime | `CONFIRMED-CURRENT / SYSTEMIC-MANIFESTATION` | Current native result selector still requires `{min,max}` while accepted configs use ordered `min` thresholds; Lot's four named tiers cannot match and fall back to generic `N из 8`; configured `badge` is also ignored. Product issue **#1369** owns the shared repair. See [`NATIVE_QUIZ_SCORE_CONTRACT.md`](NATIVE_QUIZ_SCORE_CONTRACT.md). |
| `ARTICLE-QUIZ-EXPLANATION-PARITY-01` | P2 shared runtime | `CONFIRMED-CURRENT / SYSTEMIC-MANIFESTATION` | Current native renderer still uses `short || full`; accepted legacy behavior displays short plus distinct full teaching layer. All 8 Lot questions hide `full`. Product issue **#1369** owns the shared repair. See [`NATIVE_QUIZ_EXPLANATION_PARITY.md`](NATIVE_QUIZ_EXPLANATION_PARITY.md). |

Active MASTER collapses both manifestations into **`SYS-ARTICLE-QUIZ-NATIVE-PARITY`**. Product #1369 explicitly forbids hiding the shared defect with Lot-only `max` fields or by deleting `short` explanations.

## Required/in-flight work that is not a shipped regression

| ID / surface | Current disposition |
|---|---|
| `LOT-MEDIA-PLACEMENT-01` | `IN-FLIGHT / NOT RELEASE-READY`. Fresh branch census: 14 conceptual families; **9 publication registry rows / 9 actual `<LotFigure>` placements**; five explicit reserve/kept-out families. `lane/lot-media-20260809` is now **identical to current main** and still contributes zero unique media bytes. `lane/lot-illustration-placement-20260809` is `ahead=11 / behind=4`. Publication #1339 still declares a final **14-raster** browser gate, so owner must either publish 14 or explicitly change the accepted visible count to 9; the browser witness must assert the exact positive count. See [`MEDIA_PLACEMENT_READINESS.md`](MEDIA_PLACEMENT_READINESS.md). |
| Lot-specific OG | `NOT IMPLEMENTED / MEDIA GATE` at the last audit; do not count generic site OG as closure. |
| Scripture occurrence derivative | Writer mechanism is merged to Product main via #1353. Treat the old #1339 red as `READY-TO-REVERIFY` after fresh ancestry/canonical autofix, not as a manual JSON-edit task. |
| `LOT-ANCESTRY-01` | `MERGE-BARRIER`: #1339 is currently behind 7 from observed Product main. Every final check must be re-earned after refresh. |
| Avraam/Tall el-Hammam parity | `OWNED-UPSTREAM #1334/#1298`; active MASTER keeps it separately as `AVRAAM-HAMMAM-RETRACTION-PARITY`. |

## Explicitly closed / disproved

### `LOT-QUIZ-RENDER-01` — `FALSE-POSITIVE / CLOSED`

Do **not** reopen “Lot quiz data is not rendered.” The complete native chain exists on the exact #1339 head:

`lotQuiz.ts → LotPageHead/SITE_CONFIG → ReaderActionsRuntime → article-interactions.js → article-quiz.js → #quizPlaceholder`.

The original missing-renderer audit was corrected in [`QUIZ_RUNTIME_FINDING.md`](QUIZ_RUNTIME_FINDING.md). Current Product #1369 concerns semantic parity **after render**, not missing rendering.

### `Сигор` vs `Цоар`

Not promoted: both are established Russian naming forms in this context; no route policy violation proved.

### Glossary manual markup

Not promoted: absence of hand-written `.gterm` alone is not a defect because the shared glossary runtime can project registered terms and the key archaeology entities are directly explained in prose.

### Back destination to home

Not promoted: known-good standalone article patterns also use the home Back destination; breadcrumb parentage alone does not prove a Back-contract defect.

## Factual verification snapshot

### Verified-pass boundaries

- Tall el-Hammam: the article correctly treats the 2025 Scientific Reports retraction as invalidating the 2021 airburst paper as established positive evidence, without overclaiming that retraction proves the site cannot be biblical Sodom.
- Deir ‘Ain ‘Abata / Agios Lot: the article correctly treats the Byzantine sanctuary, Madaba-map tradition and 606/691 mosaic evidence as late-antique reception/local memory, not direct Bronze Age identification proof.
- Central biblical/canonical claims reviewed in this pass produced no material correction: Lot's family relation, Genesis 13/14/19 arc, 2 Peter's righteous-Lot control, Ezekiel/Jude canonical framing, Moab/Ammon lineage and Ruth→David line remain within the stated source boundaries.

### Narrowed factual/source item

- Numayra excavation-date annotation is no longer classified as a full false positive; see `LOT-NUMAYRA-DATE-01` above.

## Current upstream Product owners

At the latest consolidation census:

- #1339 — Lot publication, draft/open, **behind=7**;
- #1348 — exhaustive Articles catalog/human reachability, draft/open, **behind=2** and deliberately downstream of #1313;
- #1313 — Search new-row author/editor/translator authority, draft/open, **behind=1** after merged #1267;
- #1334 — Avraam Tall el-Hammam retraction parity, draft/open;
- #1369 — shared native quiz parity, open issue with no implementation PR at this checkpoint;
- #1353 — Scripture occurrence writer, **merged**.

Recheck all of these before any new Product mutation. An AuditRepo evidence row is not permission to continue another owner's active lane.

## Global MASTER disposition

The former boundary “MASTER is still waiting on AuditRepo #264” is retired. #264's five unique historical reconciliation reports were preserved into AuditRepo main as `a8283267ae0810b8d8c91c3dd7981dd001a1da06`, and the 2026-08-09 consolidation wave now promotes only current work.

Current promotion mapping:

- route/content/media/SEO/TOC/Scripture-markup/SVG/source residuals → `LOT-PUBLICATION-READINESS-01`;
- human reachability → `CATALOG-PROJECTION-01`;
- Search author/editor/translator drift → `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY`;
- two shared native quiz manifestations → `SYS-ARTICLE-QUIZ-NATIVE-PARITY` / Product #1369;
- Avraam retraction parity → `AVRAAM-HAMMAM-RETRACTION-PARITY`.

The unrelated #1364 Strangler and #1267 reader merges advanced Product ancestry but did not invalidate the Lot defect mechanisms above. This keeps the detailed evidence here while preventing the global MASTER from becoming a duplicate Lot symptom list.