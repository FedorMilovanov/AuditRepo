# Consolidated Disposition — arena-sync-assessment 2026-08-01

> Сводная диспозиция по всем находкам для **верификатора**. Один файл — одно решение.
> Все находки — governance/data-sync (не продукт-баги). Лейн не менял канон (README Freedom-with-Evidence:
> агент не правит verified ledger напрямую). Здесь только disposition-предложение.
>
> **Машинно-читаемый полный список source/data-вердиктов — [`VERIFIED_DISPOSITIONS.md`](VERIFIED_DISPOSITIONS.md)**
> (SD-6..SD-15: 17 FIXED-кандидатов, 39 STILL-OPEN entries, 17 listed browser/runtime/CI entries).
> **Merge-time revalidation:** `MERGE_TIME_REVALIDATION_2026-08-02_8f17085.md`.
> **Browser-класс:** план + исторический reverify-скелет — `artifacts/BROWSER_REVERIFY_PLAN.md` и
> `artifacts/CURRENT_HEAD_REVERIFY_2026-08-01_2273b8c9_karty-browser.md`; при исполнении подставить
> точный текущий source SHA.

**AuditRepo canonical base:** `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`.
**Merge-time source main:** `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97` (**+45 коммитов** к канону `efaf2a51`).
**Original source inspection:** `2273b8c930eebf383d429b917d3636bc28a80bae`; merge-time delta = **31 commits**.
**Last exact production:** `abf1edba190280e554dfda085bef9fb6594c896d` (source != production; parity не заявляется).
**CI:** `repository-history-forensic`, `validate`, `matrix-coverage` → PASS после восстановления
канонического archive-ref PR #3. **Матрица сейчас:** 356 canonical / 191 open / 165 closed.

---

## Сводная таблица

| ID | Sev | Файлы канона | Верифицировано | Диспозиция для верификатора |
|---|---|---|---|---|
| **SD-1** | P3 | `MASTER_BUG_MATRIX.md` закрытая строка `NEW-68/69` | L1, tool | `NEW-68`+`NEW-69` (2 разных бага) в одной строке со слэшем → не считаются каноническим ID. Вариант A: split → 167 closed / 357 total. Вариант B: rename → 166 closed / 356 total. Вариант C: оставить + note. Инвариант: closed==counter==NEXT_AGENT_PROMPT; total==closed+open. |
| **SD-2** | P3 | `MASTER_BUG_MATRIX.md` `AUDITREPO(4)` включает закрытый AR-006 | L1, sweep | AR-006 закрыт, но считается открытым. Решить: open 190 / AUDITREPO-open 3, либо явно задокументировать исключение. Пропагировать в `## Статистика` + `NEXT_AGENT_PROMPT`. |
| **SD-3** | P3 | `verified/MATRIX_ID_ALIASES.json` | L1, tool | Добавить 2 записи `status:informational` + reason для `RIGHT-4Q204-OPEN-SCHEMATIC`, `RIGHT-P72-TEXT-LINK-ONLY`. Не в матрицу, не в ignoredTokens. |
| **SD-4** | P3 | `AUDIT-P3-OG-LCP-MISMATCH` | L1, archived-only | Свежий reverify на точном текущем source HEAD (merge-review anchor `8f17085d`). Если не воспроизводится → stale/fixed; если да → оставить + свежее evidence. Не закрывать по архивному evidence 07-05. |
| **SD-5** | P1-fresh / P3 | `NEXT_AGENT_PROMPT.md` + мастхед `MASTER_BUG_MATRIX.md` | L1, live compare | Authority-only sync: advance source HEAD `efaf2a51`→**`8f17085d`** (45 commits) либо на более новый exact HEAD, если main снова сдвинулся; приложить парный same-SHA reverify. Не клеймить production без same-SHA witness. |
| **SD-6** | P2 | открытые Karty/Engine-строки | source @ `2273b8c9`, delta-carried to `8f17085d` | **Fixed candidates:** ASTRO-P1-02, ENGINE-P1-21/22/23/28, MAP-P1-14/15. **Open:** MAP-P1-11, ENGINE-P1-26. Закрывать только после exact-HEAD reverify. |
| **SD-7** | P2 | stale Karty witnesses | live compare @ `8f17085d` | 65 строк на `32ae0d7d` теперь 638 behind; supplementary: `2ca2af3` 729, `21624a3` 689, `30bf3f5c` 1136 behind. Один батчевый Karty reverify-лейн на exact current HEAD; combined surface ≈72 rows. |
| **SD-8** | P2 | Karty P1-кластер | source @ `2273b8c9`, unchanged-path carry-forward | **STILL OPEN:** BASE-P1-01/02, RIVER-P1-01/02/03, QUAL-P1-05. **Likely fixed:** QUAL-P1-04 (browser confirm). **Partial:** QUAL-P1-06. |
| **SD-9** | P2 | data-слой | direct registry recheck @ `8f17085d` + unchanged routes | **STALE/FIXED:** QUAL-P2-03; `/karty/` + 10 subroutes remain in page-ownership. **STILL OPEN:** QUAL-P1-07, QUAL-P2-02, REG-P1-01. **PARTIAL:** DATA-P2-01. |
| **SD-10** | P2 | map-engine/Avraam | unchanged-path carry-forward to `8f17085d` | **STILL OPEN:** FONT-P1-01, TEXT-P1-01, A11Y-P1-02/03, DRAW-P1-03, MINI-P1-01. **FIXED candidate:** A11Y-P1-01. **REVERIFY:** PERF-P1-01, DRAW-P1-01. |
| **SD-11** | P2 | sheet-engine/GATE | unchanged-path carry-forward to `8f17085d` | **STILL OPEN:** SEA-P1-01, ROUTE-P1-01, ORN-P1-01, GRAT-P1-01, RELIEF-P1-01, HALO-P1-01, GLYPH-P1-01. **FIXED candidate:** GATE-P1-02. |
| **SD-12** | P2 | оставшиеся Karty units | unchanged-path carry-forward to `8f17085d` | **STILL OPEN:** MAP-P1-12, MAP-P1-20, SIG-P1-01, WAYP-P1-01, MEDIA-P1-01, LOD-P1-01. **FIXED candidates:** COMP-P1-01, CSS-P1-01. Browser/runtime/CI entries не закрывать source-only. |
| **SD-13** | P2 | tour/story/a11y | unchanged-path carry-forward to `8f17085d` | **STILL OPEN:** MAP-P1-03, MAP-P1-01, MAP-P1-02, MAP-P1-13. **FIXED candidate:** ASTRO-P1-04. |
| **SD-14** | P2 | GATE/DRAW | unchanged-path carry-forward to `8f17085d` | **PARTIAL-FIXED:** GATE-P1-01. **FIXED:** GATE-P1-04. **OPEN:** DRAW-P1-02. **BROWSER:** GATE-P1-03. |
| **SD-15** | P2 | Vosk/genealogy | unchanged-path carry-forward to `8f17085d` | **FIXED:** NEW-VOSK-FETCH-NO-ABORT, AR-AUDIT-17. **OPEN:** NEW-VOSK-DEAD-SPLITSENTENCES. **REVERIFY:** NF-DEAD-ENHANCE-SHIM. |

---

## Порядок (рекомендуемый)
1. **SD-5** сначала: зафиксировать exact current source HEAD в каноне + same-SHA reverify.
2. **SD-6 + SD-7 + SD-4**: reverify на том же exact HEAD; закрывать только подтверждённые строки.
3. **SD-1/SD-2**: одно атомарное решение по счётчикам и пропагация в `NEXT_AGENT_PROMPT`.
4. **SD-3**: registry-записи RIGHT-*.
5. Browser/runtime/CI-класс прогнать отдельно; source-only carry-forward не считается browser witness.

## Инварианты, которые держать
- `closed_canonical == closed_counter == NEXT_AGENT_PROMPT claim`
- `total_canonical == closed_canonical + open_canonical`
- `open_total == Σ(секции открытых)`; закрытый пункт не считается открытым (SD-2)
- canonical writer — только отдельная verifier transaction; этот intake остаётся evidence/proposal-only
- source и production не приравнивать без exact same-SHA production witness

## Boundary
Лейн не менял canonical-строки, статусы, severity, счётчики, source-файлы, Research/Drive или
production-данные. Intake содержит 23 evidence-файла, 15 proposals, 2 browser artifacts и merge-time
revalidation note.