# PDF / print-to-PDF: архитектура и поверхности — broad wave 47

**Якорь Product:** `9a68fe214ef592b6bfb99a041d00153fd438f22a` (`main`, исходники не менялись).  
**Доказательство:** `evidence/2026-11-03-pdf-architecture-controls-wave47.jsonl`.

## Метод

До браузера прочитаны `AGENTS.md`, build/CI-команды, все print-селекторы и владельцы, затем на чистом HEAD выполнены:

- `check-print-geometry-contract.js` — green;
- `npm run engine:contracts` — green;
- production-like build — 111 страниц, Astro 0 errors / 0 warnings / 7 hints;
- инвентаризация финального `dist`;
- нативный Chromium-click по видимой desktop-кнопке на **73/73** маршрутах.

Временный Chromium/NSS и PDF-файлы находились вне Git. Product checkout после сборки остался source-clean.

## Как функция действительно работает

Это **не скачивание готового файла**. Capture-phase `GBReaderActions` v1 принимает `[data-action="print"]`, блокирует повторный запуск, вызывает семантическую подготовку `GBPrintEngine` v2.1, ставит `data-gb-print-prepared`, ровно один раз вызывает `window.print()` и снимает состояние через `afterprint`. Физическая геометрия подключена раньше action-runtime, но действует только в `beforeprint`/print media и потребляет канонические atomic/keep-next-маркеры.

Следовательно, конечный файл создаёт сам браузер, только если читатель в системном диалоге выберет «Сохранить как PDF». Product не управляет именем, местом сохранения, браузерными колонтитулами или отменой диалога.

## Поверхности

Финал содержит 146 контролов на 73 маршрутах:

- 68 desktop rail: `aria-label="Скачать страницу"`;
- 68 mobile/TOC: `Распечатать страницу и сохранить в PDF` — честное описание;
- 5 standalone desktop rail: `aria-label="Скачать PDF"`;
- 5 standalone mobile sheet: видимый текст `PDF`.

В desktop-аудите 73/73 нативных события имели `isTrusted=true`; каждый вызвал print ровно один раз, URL и page identity не изменились, prepared-state снялся. Все ответы 200; broken images и page errors — 0. Сорок четыре `ERR_CONNECTION_CLOSED` относятся только к заблокированной sandbox-доставке `mc.yandex.ru` и не являются дефектом Product.

## Решение волны

Архитектура едина и в нормальном desktop-пути не дублирует listener/print-вызов. Но две desktop-формулировки обещают скачивание, которого нет: фактический результат — системный print dialog. Это подтверждено как широкая семантическая граница; строка допускается после cross-profile reconciliation в wave 50, а не дублируется по компонентам.

Текущий Product PR #2256 касается TTS stress; Dependabot PR #2244–#2246 также не владеют PDF/print. Lane collision нет, Product не изменялся.

**Broad wave 47 завершена.**
