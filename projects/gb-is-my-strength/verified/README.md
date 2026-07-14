# Verified

Здесь живёт только **текущая каноническая правда**. Всё историческое — в `../archive/`.

## Текущий канонический набор (source HEAD — см. `MASTER_BUG_MATRIX.md`)

- `MASTER_BUG_MATRIX.md` — канон точечных багов (единый HEAD, счётчики пересобраны, D-строки arena влиты).
- `SUPER_AUDIT_2026-07-06_14a49be8.md` — канон системного бэклога: верифицированные находки, опровергнутые формулировки, план волн W0–W10, правила закрытия.
- `START_HERE.md` — сводка для владельца (регенерируется при каждой волне).

## Примечания

- `PLAYEMBER_INTERACTION_SPEC_2026-06-27.md` — спека PlayEmber; зона PremiumControls in-flight у владельца, спеку сверять с текущим source перед использованием.
- Устаревшие доки (`ACTION_PLAN`, `CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27`, `REPAIR_ORDER_DELTA_2026-06-27`, `DEFINITIVE_PREMIUMCONTROLS_FINAL_HANDOFF_2026-06-27`) перенесены в `../archive/2026-07-06-stale-verified/` (2026-07-06).

## Правило

Один канонический документ на слой. Новые находки — через `incoming/` → матрица/SUPER_AUDIT,
не параллельными «current»-доками. Исторические/superseded файлы не живут в корне этой папки.
