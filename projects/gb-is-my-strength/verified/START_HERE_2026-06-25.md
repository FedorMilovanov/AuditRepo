# START HERE — Verified entrypoint — 2026-06-25

Если implementation-агенту нужен **минимальный набор подтверждённых документов**, начинать отсюда.

## Primary canonical docs

1. `UNIFIED_BUG_LEDGER_2026-06-25.md`
   - основной сводный verified bug ledger

2. `repair-order-unified-2026-06-25.md`
   - согласованный порядок исправления

## Secondary verified docs

3. `BUG_LEDGER_2026-06-25.md`
   - более ранний verified ledger, полезен для cross-check, но при расхождении приоритет у `UNIFIED_BUG_LEDGER_2026-06-25.md`

## Templates / placeholders

Эти файлы не являются текущей истиной по проекту, они только шаблоны:
- `FINAL_BUG_MATRIX_TEMPLATE.md`
- `FALSE_POSITIVES_REGISTRY_TEMPLATE.md`
- `REPAIR_ORDER_APPROVED_TEMPLATE.md`
- `BUG_LEDGER_PLACEHOLDER.md`

## Rule

Если найдено противоречие между несколькими verified-файлами:
- сначала смотреть `UNIFIED_BUG_LEDGER_2026-06-25.md`
- затем `repair-order-unified-2026-06-25.md`
- затем cross-reference документы в `verification/`
