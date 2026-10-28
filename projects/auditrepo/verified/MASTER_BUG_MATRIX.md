# MASTER BUG MATRIX — AuditRepo

> SSOT только для текущей проверенной необходимой работы по самому AuditRepo. Исторические наблюдения и ограничения остаются в evidence, а не раздувают эту таблицу.

## Current state

| Field | Value |
|---|---:|
| Active work units | **2** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **0** |
| Owner decisions | **2** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 0

| ID | Current problem | Boundary | Evidence |
|---|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why | Evidence |
|---|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 0

| ID | Verified work package | Next boundary | Evidence |
|---|---|---|---|

## OWNER DECISIONS — 2

| ID | Missing decision | Closure boundary | Evidence |
|---|---|---|---|
| `AR-ISSUE-LIFECYCLE-001` | Четыре lifecycle labels созданы и policy формализована, но integration получает HTTP 403 при применении labels/изменении issues. Текущая классификация: #489 diagnostic; #485 evidence; #484 superseded by #485; #437 superseded/contradicted более поздним current TLP matrix. | Owner применяет соответствующие `state:*` labels и решает, закрывать ли четыре административные записи. До этого open-state не является доказательством четырёх активных work items. | [`wave 5`](../verification/2026-10-29-wave-5-issue-lifecycle/REPORT.md) |
| `AR-PR482-DISPOSITION-001` | Content-level reconciliation завершён: все явные IDs и три queue-кандидата поглощены более новыми current owners; stale branch также удаляет поздние queue updates. Whole-merge/import отклонён, exact head `539d7b81…` доступен. | Рекомендация: с явной owner authorization закрыть PR #482 как superseded, не удаляя branch. Ref retirement — только отдельным reviewed exact-SHA протоколом. | [`wave 7`](../verification/2026-10-29-wave-7-pr482-disposition/REPORT.md) |

## Terminal rule

Ряд покидает MASTER в той же волне, где доказано исправление, stale/invalid состояние или принято owner-решение. Ограничение GitHub integration на чтение branch protection записано в baseline evidence и не объявляется дефектом репозитория без независимого подтверждения.
