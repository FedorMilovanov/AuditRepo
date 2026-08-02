# VERIFIED DISPOSITIONS — source/data verdicts carried to merge-time source `8f17085d`

> Explicit source/data-verification summary for SD-6..SD-15.
> Original evidence was collected at `2273b8c930eebf383d429b917d3636bc28a80bae`.
> `MERGE_TIME_REVALIDATION_2026-08-02_8f17085.md` reviewed the 31-commit delta to
> `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97`: all evidence-critical paths were unchanged except
> `migration/page-ownership.json`, which was directly rechecked and preserves the SD-9 verdict.
> Canonical AuditRepo source authority is still `efaf2a51` and remains stale (SD-5).
> This lane does not change canonical statuses; close/reclassify only in an exact-HEAD verifier transaction.

## FIXED candidates (source/data-verified; reverify before canonical close)
| ID | Evidence |
|---|---|
| ENGINE-P1-21 | sd6_verified_on_2273b8c9.txt |
| ENGINE-P1-22 | sd6_verified_on_2273b8c9.txt |
| ENGINE-P1-23 | sd6_verified_on_2273b8c9.txt |
| ENGINE-P1-28 | sd6_verified_on_2273b8c9.txt |
| ASTRO-P1-02 | sd6_verified_on_2273b8c9.txt |
| MAP-P1-14 | sd6_verified_on_2273b8c9.txt |
| MAP-P1-15 | sd6_verified_on_2273b8c9.txt |
| A11Y-P1-01 | sd10_browser_engine_clusters.txt (browser confirm before close) |
| QUAL-P2-03 | sd9_data_validation.txt + merge-time page-ownership recheck |
| GATE-P1-02 | sd11_sheet_engine_gate.txt |
| GATE-P1-04 | sd14_gate_draw.txt |
| COMP-P1-01 | sd12_remaining_units.txt |
| CSS-P1-01 | sd12_remaining_units.txt |
| ASTRO-P1-04 | sd13_tour_a11y.txt |
| QUAL-P1-04 | sd8_verified_still_open.txt (likely; browser confirm) |
| NEW-VOSK-FETCH-NO-ABORT | sd15_vosk_genealogy.txt |
| AR-AUDIT-17 | sd15_vosk_genealogy.txt (stale/fixed) |

**Listed FIXED candidates: 17.**

## STILL OPEN (source/data-verified; keep open with fresh witness)
| ID | Evidence |
|---|---|
| MAP-P1-11 | sd6_verified_on_2273b8c9.txt (scale bar `cfg.W0/view.w`) |
| ENGINE-P1-26 | sd6_verified_on_2273b8c9.txt |
| BASE-P1-01 | sd8_verified_still_open.txt |
| BASE-P1-02 | sd8_verified_still_open.txt |
| RIVER-P1-01 | sd8_verified_still_open.txt (root RIVER-P1-02) |
| RIVER-P1-02 | sd8_verified_still_open.txt |
| RIVER-P1-03 | sd8_verified_still_open.txt |
| QUAL-P1-05 | sd8_verified_still_open.txt |
| QUAL-P1-06 | sd8_verified_still_open.txt (partial) |
| QUAL-P1-07 | sd9_data_validation.txt |
| QUAL-P2-02 | sd9_data_validation.txt |
| REG-P1-01 | sd9_data_validation.txt |
| DATA-P2-01 | sd9_data_validation.txt (partial) |
| FONT-P1-01 | sd10_browser_engine_clusters.txt |
| TEXT-P1-01 | sd10_browser_engine_clusters.txt |
| A11Y-P1-02 | sd10_browser_engine_clusters.txt |
| A11Y-P1-03 | sd10_browser_engine_clusters.txt |
| DRAW-P1-03 | sd10_browser_engine_clusters.txt |
| MINI-P1-01 | sd10_browser_engine_clusters.txt |
| SEA-P1-01 | sd11_sheet_engine_gate.txt |
| ROUTE-P1-01 | sd11_sheet_engine_gate.txt |
| ORN-P1-01 | sd11_sheet_engine_gate.txt |
| GRAT-P1-01 | sd11_sheet_engine_gate.txt |
| RELIEF-P1-01 | sd11_sheet_engine_gate.txt |
| HALO-P1-01 | sd11_sheet_engine_gate.txt |
| GLYPH-P1-01 | sd11_sheet_engine_gate.txt (partial: avraam 14/22) |
| MAP-P1-12 | sd12_remaining_units.txt |
| MAP-P1-20 | sd12_remaining_units.txt |
| SIG-P1-01 | sd12_remaining_units.txt |
| WAYP-P1-01 | sd12_remaining_units.txt |
| MEDIA-P1-01 | sd12_remaining_units.txt |
| LOD-P1-01 | sd12_remaining_units.txt (partial) |
| MAP-P1-03 | sd13_tour_a11y.txt (shoftim stage-0) |
| MAP-P1-01 | sd13_tour_a11y.txt |
| MAP-P1-02 | sd13_tour_a11y.txt |
| MAP-P1-13 | sd13_tour_a11y.txt |
| DRAW-P1-02 | sd14_gate_draw.txt |
| NEW-VOSK-DEAD-SPLITSENTENCES | sd15_vosk_genealogy.txt |
| MAP-P1-10 | baseOpacity / `me-base-geo` 0.5 (this pass) |

**Listed STILL OPEN entries: 39.**

## BROWSER / RUNTIME / CI class

These entries are not closed by source inspection or merge-time path carry-forward. Execute browser/runtime
verification on the exact source HEAD used by the verifier transaction:

- MAP-P1-04
- MAP-P1-05
- MAP-P1-06
- MAP-P1-08
- MAP-P1-09
- MAP-P1-18
- MAP-P1-19
- AVRAAM-P1-01
- AVRAAM-P1-02
- AVRAAM-P1-03
- AVRAAM-P1-04
- AVRAAM-P1-05
- GATE-P1-03
- GATE-P1-01 (browser JS-crash part)
- SVG-P1-01 (artifact)
- DRAW-P1-01 (visual)
- PERF-P1-01 (`feTurbulence` runtime behavior)

**Listed browser/runtime/CI entries: 17.**

## Authority / stale-witness update

- Merge-time source: `8f17085d`
- Canonical source authority: `efaf2a51` → **45 commits behind**
- Original inspection SHA: `2273b8c9` → **31 commits behind**
- `32ae0d7d` → **638 commits behind**
- `2ca2af3` → **729 commits behind**
- `21624a3` → **689 commits behind**
- `30bf3f5c` → **1136 commits behind**

Governance findings SD-1..SD-5 remain separate from product-row verdicts.