# Consolidated Disposition — arena-sync-assessment 2026-08-01

> Сводная диспозиция по всем находкам для **верификатора**. Один файл — одно решение.
> Все находки — governance/data-sync (не продукт-баги). Лейн не менял канон (README Freedom-with-Evidence:
> агент не правит verified ledger напрямую). Здесь только disposition-предложение.

**AuditRepo HEAD:** `bc067a1cbaf33ed3cafa72cf6f4e5201056125db` (зафиксированный канон).
**Фактический source main:** `2273b8c930eebf383d429b917d3636bc28a80bae` (PR #730; +14 коммитов к канону `efaf2a51`).
**Last exact production:** `abf1edba190280e554dfda085bef9fb6594c896d` (source != production).
**Валидатор:** `validate_audit_repo.py` → PASS. **Матрица:** 356 canonical / 191 open / 165 closed (счётчики корректны).

---

## Сводная таблица

| ID | Sev | Файлы канона | Верифицировано | Диспозиция для верификатора |
|---|---|---|---|---|
| **SD-1** | P3 | `MASTER_BUG_MATRIX.md` закрытая строка `NEW-68/69` | L1, tool | `NEW-68`+`NEW-69` (2 разных бага) в одной строке со слэшем → не считаются каноническим ID. Вариант A: split → 167/357/167. Вариант B: rename → 166/356/166. Вариант C: оставить + note. Инвариант: closed==counter==NEXT_AGENT_PROMPT; total==closed+191. |
| **SD-2** | P3 | `MASTER_BUG_MATRIX.md` `AUDITREPO(4)` включает закрытый AR-006 | L1, sweep (единственный случай) | Решить: AR-006 закрыт → open 190 / AUDITREPO-open 3 (или исключить из счётчика с note). Пропагировать в `## Статистика` + `NEXT_AGENT_PROMPT`. |
| **SD-3** | P3 | `verified/MATRIX_ID_ALIASES.json` | L1, tool (2 UNREGISTERED-EVIDENCE) | Добавить 2 записи `status:informational` + reason для `RIGHT-4Q204-OPEN-SCHEMATIC`, `RIGHT-P72-TEXT-LINK-ONLY` (Research rights, не баги). Не в матрицу, не в ignoredTokens. |
| **SD-4** | P3 | `AUDIT-P3-OG-LCP-MISMATCH` (строка 370) | L1, tool (archived-only) | Свежий reverify на **`2273b8c9`** (после SD-5). Если не воспроизводится → stale/fixed; если да → оставить + свежее evidence. Не закрывать по архивному evidence 07-05. |
| **SD-5** | P1-fresh / P3 | `NEXT_AGENT_PROMPT.md` + мастхед `MASTER_BUG_MATRIX.md` | L1, live `gh api compare` (ahead_by=14) | Authority-only sync: advance source HEAD `efaf2a51`→**`2273b8c9`** + парный `reverify/CURRENT_HEAD_REVERIFY_<date>_2273b8c9_*.md` (14-коммитная дельта, source!=production, не клеймить прод без same-SHA witness). |
| **SD-6** | P2 | открытые Karty/Engine-строки | L1→source-verified на `2273b8c9` | **Fixed (revert-close):** ASTRO-P1-02, ENGINE-P1-21/22/23/28, MAP-P1-14/15. **Open:** MAP-P1-11 (scale bar всё ещё `cfg.W0/view.w`), ENGINE-P1-26. Reverify на `2273b8c9`, закрывать только не-воспроизводящиеся. |
| **SD-7** | P2 | 65 открытых Karty-строк с witness `32ae0d7d` (+7 supplementary) | L1, live API (ahead_by=607/698/658/1105) | Один батчевый Karty reverify-лейн на `2273b8c9` (после SD-5), reuse SD-6 map-engine subset; закрывать только не-воспроизводящиеся; остальное — свежий witness. Combined stale-witness surface ≈ **72 rows**. |
| **SD-8** | P2 | Karty P1-кластер (base-geo.svg, map-engine.js) | L1, source-inspection @ `2273b8c9` | **STILL OPEN (держать):** BASE-P1-01/02, RIVER-P1-01/02/03, QUAL-P1-05. **Likely fixed (browser reverify→close):** QUAL-P1-04. **Partial:** QUAL-P1-06. Fold в SD-7 лейн; не закрывать still-open. |
| **SD-9** | P2 | data-слой (page-ownership, route.json, regions) | L1, live-data @ `2273b8c9` | **STALE/FIXED (close):** QUAL-P2-03 (karty-роуты теперь в page-ownership). **STILL OPEN:** QUAL-P1-07, QUAL-P2-02, REG-P1-01. **PARTIAL:** DATA-P2-01 (avraam paths 8/8, ishod 0/6). Fold в SD-7. |
| **SD-10** | P2 | map-engine/Avraam кластер | L1, source @ `2273b8c9` | **STILL OPEN:** FONT-P1-01, TEXT-P1-01, A11Y-P1-02/03, DRAW-P1-03, MINI-P1-01. **FIXED (browser→close):** A11Y-P1-01. **REVERIFY:** PERF-P1-01, DRAW-P1-01. Fold в SD-7. |
| **SD-11** | P2 | sheet-engine/GATE кластер | L1, source @ `2273b8c9` | **STILL OPEN:** SEA-P1-01, ROUTE-P1-01, ORN-P1-01, GRAT-P1-01, RELIEF-P1-01, HALO-P1-01, GLYPH-P1-01 (partial). **FIXED (close):** GATE-P1-02 (atlas-label-audit теперь проверяет overlap/clipping/safe-area). Fold в SD-7. |
| **SD-12** | P2 | оставшиеся Karty units | L1, source @ `2273b8c9` | **STILL OPEN:** MAP-P1-12, MAP-P1-20, SIG-P1-01, WAYP-P1-01, MEDIA-P1-01, LOD-P1-01 (partial). **FIXED (close):** COMP-P1-01, CSS-P1-01. **BROWSER-CLASS (~25):** MAP-P1-01..19, AVRAAM-P1-*, GATE-P1-*, DRAW-P1-02, SVG-P1-01 → нужен browser reverify. |
| **SD-13** | P2 | tour/story/a11y | L1, source+data @ `2273b8c9` | **STILL OPEN:** MAP-P1-03 (shoftim stage-0), MAP-P1-01 (tour tourStepIdx), MAP-P1-02 (keyboard-only), MAP-P1-13 (markers no role/tabindex). **FIXED (close):** ASTRO-P1-04 (stage_ids/stages). Fold в SD-7. |

---

## Порядок (рекомендуемый)
1. **SD-5** сначала: зафиксировать фактический HEAD `2273b8c9` в каноне + reverify-скелет.
2. **SD-6 + SD-7 + SD-4**: reverify на `2273b8c9` (map-engine кластер → SD-6; батчевый Karty лейн по 65
   строкам → SD-7; OG-LCP → SD-4). Закрыть только подтверждённые (SHA-first).
3. **SD-1/SD-2**: одно решениe по счётчикам (165/191 → целевые) + пропагация в `NEXT_AGENT_PROMPT`.
4. **SD-3**: registry-записи RIGHT-*.

## Инварианты, которые держать
- `closed_canonical == closed_counter == NEXT_AGENT_PROMPT claim`
- `total_canonical == closed_canonical + open(191)` (или пересчитать, если SD-2 меняет open)
- `open_total == Σ(секции открытых)`; закрытый пункт не считается открытым (SD-2)
- канон правит **только** верификатор; source/main остаётся нетронутым

## Boundary
Лейн не менял: ни одной canonical-строки, статуса, severity, счётчика, source-файла, Research/Drive,
production-данных. Все факты — evidence-based (11 evidence-файлов, 6 proposals в этом intake).
