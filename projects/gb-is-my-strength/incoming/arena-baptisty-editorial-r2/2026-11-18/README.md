# «Баптисты России» — редакторская очередь R2

## Agent

- Агент: Arena Agent; дата 2026-11-18 (UTC).
- Проект: `gb-is-my-strength`. Режим: **локальная редактура на ревью**, не публикация.
- Audited anchor (SHA / artifact / live snapshot): Product [`9edef94ece08012223c1364bec7ddcd561cf5713`](https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713), `main` на момент проверки и точка отката. Research: [`c30348dcd519b0bfe23f336801756ad7f3c78844`](https://github.com/FedorMilovanov/Research/commit/c30348dcd519b0bfe23f336801756ad7f3c78844) — справочный якорь, не результат нового Research admission. AuditRepo: `arena/d608fa54-auditrepo`, base `fcf2e69b2c1531fe606d9838c811b7d1b1071db0`.
- Signal class: Product editorial / historical evidence. Proof state: **PASS** для локальной примерки, сборок и проверенных поверхностей; **UNPROVEN** для публикации, архивных оригиналов 1971 и прав.
- Semantic owner: редактор серии и владельцы шести native `Body.astro` в `src/components/baptisty-rossii/`; архивная экспертиза остаётся у владельца источников.
- Claim boundary: шесть точечных текстовых правок; различены источник текста, библиографическая запись и свидетельство о событии. Preservation boundary: сайт, Research, Drive и реестры статусов не изменены; нативная структура и соседние страницы проверены против точного Product base.

## Файлы

| Файл | Назначение |
|---|---|
| [REPORT.md](REPORT.md) | «Было → стало → источник/локатор → предел», результаты, условия передачи владельцу |
| [chronology-and-voronin.patch](patches/chronology-and-voronin.patch) | Ново-Васильевка 1884, Воронин, декрет 1918, Совет 1944: A3/A4/A6/A7 |
| [underground-press-and-1971.patch](patches/underground-press-and-1971.patch) | Алексеева и раздельные документы 1971: A9/Справочник |
| [SOURCES.md](evidence/SOURCES.md) | Источники, локаторы, что видели в R2 и на каких местах использовали прежнюю перепроверку |
| [CHECKS.md](evidence/CHECKS.md) | Инструкция воспроизведения и указатель к результатам, SHA-256 и журналам |

## Для verifier

Оба патча фактически применены и обращены на локальной копии. В отчёте сравниваются две сборки на одном Product SHA, а не исправления на другом HEAD и не срез live. Предыдущий [контрольный аудит](../../arena-baptisty-editorial/2026-11-18/REPORT.md) остаётся отдельным наблюдением с другим якорем; его скриншоты не являются доказательствами R2. Пакет — `candidate`, не MASTER и не разрешение на merge/deploy или перенос сканов.
