# MASTER BUG MATRIX — AuditRepo

> SSOT только для текущей проверенной необходимой работы по самому AuditRepo. Исторические наблюдения и ограничения остаются в evidence, а не раздувают эту таблицу.

## Current state

| Field | Value |
|---|---:|
| Active work units | **5** |
| Direct current defects | **1** |
| Verified necessary improvements | **2** |
| Narrowed residuals | **0** |
| System verification lanes | **1** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 1

| ID | Current problem | Boundary | Evidence |
|---|---|---|---|
| `AR-PROJECT-CONTRACT-001` | Structural validator пропускает неодинаковый project contract: `code-audit` имеет MASTER, но не имеет `DOC_MAP.md` и `WORK_QUEUE.md`, а registry одновременно называет его `intake-only` без устойчивого synthesis. | Явно формализовать legacy/intake-only профиль либо привести проект к каноническому контракту; regression должен отвергать неоговорённое промежуточное состояние. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |

## VERIFIED NECESSARY IMPROVEMENTS — 2

| ID | Needed implementation | Why | Evidence |
|---|---|---|---|
| `AR-ARTIFACT-RETENTION-001` | Ввести узкую admission/retention политику для тяжёлых и дублированных evidence-артефактов: manifest/provenance, предпочтение компактного текстового результата, порог/исключение для архивов и проверку точных дублей. | В tracked tree уже 238 файлов типов PNG/WebP/ZIP/PATCH, 28 групп точных дублей ≥1 KiB и ZIP 7.4 MiB с пробелом в имени; текущая политика требует сохранять evidence, но не задаёт технических границ роста/дедупликации. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |
| `AR-ISSUE-LIFECYCLE-001` | Установить назначение, labels и terminal disposition для AuditRepo issues; evidence-only receipts не должны бессрочно выглядеть активной работой. | Из 22 issues 21 без labels; из четырёх открытых #489 — пустой `probe`, #484 помечен как pending и явно superseded #485, а #485 сам говорит, что работа завершена. Это делает open-state ложным backlog-сигналом. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 1

| ID | Verified work package | Next boundary | Evidence |
|---|---|---|---|
| `AR-PROJECT-CURRENCY-001` | Проверить semantic currency активных/нулевых project matrices после релевантных Product-транзакций, не превращая любое движение HEAD в reopen. | Сначала классифицировать изменения после записанных anchors для Milovi Cake, Milovi School и The Legendary Poet; обновлять только затронутые claims/owners и сохранять event-driven правило. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |

## OWNER DECISIONS — 1

| ID | Missing decision | Closure boundary | Evidence |
|---|---|---|---|
| `AR-PR482-DISPOSITION-001` | Единственный открытый AuditRepo PR #482 прямо говорит «PR не мержить», отстаёт от `main` на 168 коммитов и содержит 12 уникальных commits / 33 файла / 9,330 добавленных строк intake evidence без archive-ref или landed copy. | После content-level reconciliation выбрать одно: импортировать полезное уникальное evidence узким пакетом либо сохранить exact head в reviewed archive; затем закрыть PR только с явной owner authorization. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |

## Terminal rule

Ряд покидает MASTER в той же волне, где доказано исправление, stale/invalid состояние или принято owner-решение. Ограничение GitHub integration на чтение branch protection записано в baseline evidence и не объявляется дефектом репозитория без независимого подтверждения.
