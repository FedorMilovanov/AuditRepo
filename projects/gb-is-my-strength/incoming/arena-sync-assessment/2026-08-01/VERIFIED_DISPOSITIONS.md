# VERIFIED DISPOSITIONS — source/data-verified verdicts on actual HEAD 2273b8c9

> Машинно-читаемая сводка всех вердиктов source/data-верификации (SD-6..SD-14) для верификатора.
> Формат: `ID | verdict | evidence-file`. Фактический source HEAD = `2273b8c9`; канон AuditRepo = `efaf2a51` (stale, SD-5).
> Лейн НЕ менял канон; всё — L1 evidence-based; закрытие/реклассификация — за верификатором (SHA-first).

## FIXED (source/data-verified — кандидаты на reverify-close)
| ID | Evidence |
|---|---|
| ENGINE-P1-21 | sd6_verified_on_2273b8c9.txt |
| ENGINE-P1-22 | sd6_verified_on_2273b8c9.txt |
| ENGINE-P1-23 | sd6_verified_on_2273b8c9.txt |
| ENGINE-P1-28 | sd6_verified_on_2273b8c9.txt |
| ASTRO-P1-02 | sd6_verified_on_2273b8c9.txt |
| MAP-P1-14 | sd6_verified_on_2273b8c9.txt |
| MAP-P1-15 | sd6_verified_on_2273b8c9.txt |
| A11Y-P1-01 | sd10_browser_engine_clusters.txt |
| QUAL-P2-03 | sd9_data_validation.txt |
| GATE-P1-02 | sd11_sheet_engine_gate.txt |
| GATE-P1-04 | sd14_gate_draw.txt |
| COMP-P1-01 | sd12_remaining_units.txt |
| CSS-P1-01 | sd12_remaining_units.txt |
| ASTRO-P1-04 | sd13_tour_a11y.txt |
| QUAL-P1-04 | sd8_verified_still_open.txt (likely; browser confirm) |

## STILL OPEN (source/data-verified — держать открытыми, свежий witness)
| ID | Evidence |
|---|---|
| MAP-P1-11 | sd6_verified_on_2273b8c9.txt (scale bar cfg.W0/view.w) |
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
| MAP-P1-10 | (baseOpacity/me-base-geo 0.5, this pass) |

## BROWSER/RUNTIME/CI CLASS (не source-verifiable — нужен browser reverify на 2273b8c9)
- MAP-P1-04,05,06,08,09,18,19; AVRAAM-P1-01,02,03,04,05; GATE-P1-03; GATE-P1-01 (browser JS-crash part);
  SVG-P1-01 (artifact); DRAW-P1-01 (needs visual); PERF-P1-01 (feTurbulence animated?). ~20 rows.

## Aggregate
- FIXED candidates: ~15 rows.
- STILL OPEN confirmed: ~38 rows.
- BROWSER class: ~20 rows.
- Plus governance findings SD-1..SD-5 (counters, registry, OG-LCP, authority drift) — not product rows.
