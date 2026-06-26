# START HERE — Verified entrypoint — 2026-06-25

Если implementation-агенту нужен **минимальный набор подтверждённых документов**, начинать отсюда.

## Primary canonical docs

1. `CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`
   - основной current-head operational ledger; использовать первым для работы по состоянию на 2026-06-27

2. `../verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md`
   - current-head status flips, stale/live correction, second-order defects

3. `REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md`
   - приоритеты исправления после current-head reset

## Historical baseline docs

4. `UNIFIED_BUG_LEDGER_2026-06-25.md`
   - основной сводный verified bug ledger предыдущей волны; важен как baseline, но не как чистая текущая истина

5. `repair-order-unified-2026-06-25.md`
   - согласованный порядок исправления предыдущей волны

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
- сначала смотреть `CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`
- затем `../verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md`
- затем `REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md`
- и только потом `UNIFIED_BUG_LEDGER_2026-06-25.md` как historical baseline
