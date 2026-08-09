# Lot audit — current status index

**Updated:** 2026-08-09  
**AuditRepo base:** `188b95b8c65e2b7f0403ddb084a74ff1a5a640cd`  
**Latest Product main observed:** `3a0f21b0ec01e423a2625becf13f600a07a6ddb5`  
**Active Lot publication:** Product PR `#1339@189dfddbeed537c849dd35b1a92578ead894079d`  
**Fresh ancestry:** `#1339` is `behind=5`, `ahead=10`, merge base `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

This file is the compact entrypoint for the dated Lot audit evidence in this directory. It is **not** a replacement for Product current-head verification or the global `verified/MASTER_BUG_MATRIX.md`.

## Confirmed current Lot publication/content residuals

| ID | Severity | Current disposition | Correct owner / next proof |
|---|---|---|---|
| `LOT-SEO-WEBSITE-01` | P1 release | `CONFIRMED-CURRENT` on #1339 | Route-local publication #1339: add canonical JSON-LD `#website`, rerun exact-head registry/SEO browser job. |
| `LOT-HUMAN-REACHABILITY-01` | P1 release | `CONFIRMED-CURRENT / OWNED-UPSTREAM` | Product #1348 is the exhaustive `/articles/` catalog owner; no one-off Lot card. Refresh #1339 after #1348. |
| `LOT-BIBLE-TOOLTIP-01` | P1 content / P2 interaction | `CONFIRMED-CURRENT` | Lot publication/content integration: canonical `.bref > .btip` + Bible-data projection; positive expected-count browser witness. See [`SCRIPTURE_TOOLTIP_CONTRACT.md`](SCRIPTURE_TOOLTIP_CONTRACT.md). |
| `LOT-TOC-MAP-01` | P2 navigation | `CONFIRMED-CURRENT` | #1339: add live `#sec-map-connection` H2 to canonical TOC; no other normal H2 omission was found in the full census. |
| `LOT-JOURNEY-EGYPT-01` | P2 semantic visual | `CONFIRMED-CURRENT` | Journey SVG must include the explicitly narrated return sequence involving Egypt before the Genesis 13 separation; preserve the no-invented-route boundary. |
| `LOT-SVG-RESPONSIVE-READABILITY-01` | P2 visual/accessibility | `CONFIRMED-CURRENT` | Lot visual/browser lane: responsive/scroll-owned semantic figure presentation; current 390px geometry scales 13-unit labels to ~3.9–4.2 CSS px. See [`SVG_RESPONSIVE_READABILITY.md`](SVG_RESPONSIVE_READABILITY.md). |
| `LOT-QUIZ-CONTENT-QUALITY-01` | P2 content | `CONFIRMED-CURRENT` | Lot quiz content owner: 6/8 `full` explanations below explicit 2–4 sentence standard; replace obvious filler distractors. See [`QUIZ_CONTENT_QUALITY.md`](QUIZ_CONTENT_QUALITY.md). |
| `LOT-SEARCH-ROLE-01` | P2 discovery | `CONFIRMED-CURRENT / OWNED-UPSTREAM` | Product #1313 owns new-row author/editor authority; after merge #1339 must rematerialize Search/RSS/sitemap canonically. |
| `LOT-SOURCE-LINKS-01` | P3 source verifiability | `VERIFIED-NECESSARY-IMPROVEMENT` | Add direct primary links for already-cited Jaret/Harris and Boslough/Bruno Scientific Reports critiques. |
| `LOT-NUMAYRA-DATE-01` | P3 source annotation | `PARTIAL/NARROWED` | Current EDSP page says ~30% extant site excavated 1979–1983, but broader record includes 1977 fieldwork. Clarify bibliography annotation only. See [`NUMAYRA_DATE_CORRECTION.md`](NUMAYRA_DATE_CORRECTION.md). |

## Shared native-runtime defects discovered through Lot

These are **not** route-local Lot hacks. They affect the native article quiz contract and need collision-safe SYSTEM ownership in Product.

| ID | Severity | Current disposition | Evidence |
|---|---|---|---|
| `ARTICLE-QUIZ-SCORE-RANGE-01` | P2 shared runtime | `CONFIRMED-CURRENT / SYSTEMIC-ROOT` | Native result selector requires `{min,max}` but accepted configs use ordered `min` thresholds; Lot's four named tiers can never match and always fall back to generic `N из 8`. Configured `badge` is also ignored. See [`NATIVE_QUIZ_SCORE_CONTRACT.md`](NATIVE_QUIZ_SCORE_CONTRACT.md). |
| `ARTICLE-QUIZ-EXPLANATION-PARITY-01` | P2 shared runtime | `CONFIRMED-CURRENT / SYSTEMIC-ROOT` | Native renderer uses `short || full`; accepted legacy behavior displays short plus distinct full teaching layer. All 8 Lot questions currently hide `full`. See [`NATIVE_QUIZ_EXPLANATION_PARITY.md`](NATIVE_QUIZ_EXPLANATION_PARITY.md). |

## Required/in-flight work that is not a shipped regression

| ID / surface | Current disposition |
|---|---|
| `LOT-MEDIA-PLACEMENT-01` | `IN-FLIGHT / NOT RELEASE-READY`. At the last bounded media audit: 14 conceptual families, 9 metadata rows, 6 actual `<LotFigure>` placements, and no unique media-byte delta in `lane/lot-media-20260809`. Publication #1339 still declares a final 14-raster gate. See [`MEDIA_PLACEMENT_READINESS.md`](MEDIA_PLACEMENT_READINESS.md). |
| Lot-specific OG | `NOT IMPLEMENTED / MEDIA GATE` at the last audit; do not count generic site OG as closure. |
| Scripture occurrence derivative | Writer mechanism is now merged to Product main via #1353. Treat the old #1339 red as `READY-TO-REVERIFY` after fresh ancestry/canonical autofix, not as a manual JSON-edit task. |
| `LOT-ANCESTRY-01` | `MERGE-BARRIER`: #1339 is currently behind 5 from observed Product main. Every final check must be re-earned after refresh. |
| Avraam/Tall el-Hammam parity | `OWNED-UPSTREAM #1334/#1298`; do not duplicate in Lot Product scope. |

## Explicitly closed / disproved

### `LOT-QUIZ-RENDER-01` — `FALSE-POSITIVE / CLOSED`

Do **not** reopen “Lot quiz data is not rendered.” The complete native chain exists on the exact #1339 head:

`lotQuiz.ts → LotPageHead/SITE_CONFIG → ReaderActionsRuntime → article-interactions.js → article-quiz.js → #quizPlaceholder`.

The original missing-renderer audit was corrected in [`QUIZ_RUNTIME_FINDING.md`](QUIZ_RUNTIME_FINDING.md). The real current quiz problems are the shared score-range and explanation-parity defects plus route content quality.

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

At the last live census:

- #1339 — Lot publication, still draft/open;
- #1348 — exhaustive Articles catalog/human reachability, draft/open;
- #1313 — Search new-row author/editor authority, draft/open;
- #1334 — Avraam Tall el-Hammam retraction parity, draft/open;
- #1353 — Scripture occurrence writer, **merged**.

Recheck all of these before any new Product mutation. An AuditRepo evidence row is not permission to continue another owner's active lane.

## Global MASTER boundary

The global MASTER remains under a broader disposition-reconciliation context (#264) and is materially stale relative to current Product. This Lot audit deliberately does not patch its counts piecemeal.

After the broader reconciliation lane resolves, promote only unresolved current defects that are not already fully represented by a live Product owner—especially the two shared native quiz roots—and remove/retire stale historical rows in the same transaction. Do not simply append Lot rows to the old counts.
