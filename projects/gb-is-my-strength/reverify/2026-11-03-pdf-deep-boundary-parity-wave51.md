# Глубокая сверка PDF-границ, parity и terminal output — broad wave 51

**Якорь Product:** `c734ad540b526d8e76d524370c71da6a45048e06`.
**Доказательство:** `evidence/2026-11-03-pdf-deep-boundary-parity-wave51.jsonl`.

## Метод и охват

На чистом exact main повторно пройдены Product-инструкции, print contracts и production-like build: gates зелёные, build выдаёт 111 страниц. Все **73/73** print-маршрута открыты в Chromium 153; по реальному видимому control выполнен trusted native click без force/readiness/timing-подмен. Все действия вызвали canonical print ровно один раз, сохранили URL и сбросили preparation-state.

Созданы **73 desktop A4 PDF / 1 425 страниц**. Каждая страница растеризована, а все страницы просмотрены по порядку на восьми последовательных contact sheets; кандидаты дополнительно открыты крупно. Проверены page order, пустые/повторные листы, края, headings/captions, atomic blocks, таблицы, изображения, embedded fonts, terminal sections, link annotations и canonical reader projection. Отдельный mobile-прогон 390×844, `isMobile=true`, Dark + reduced motion повторил native opener→print и создал ещё 73 реальных PDF.

Browser health: broken images 0, page errors 0, preparation reset 73/73, LCP ≤2 420 ms. Axe нашёл только уже принадлежащие owners проявления `nested-interactive` и contrast; высокий cold CLS на пяти маршрутах не образует новый print-owner и остаётся в существующей layout/capacity области. 44 console resource errors и 44 request failures относятся только к заблокированным `mc.yandex.ru`/Wikimedia и маркированы как sandbox egress, не Product failure.

## Постраничный результат

В 1 425 desktop-листах:

- A4, порядок страниц и embedded fonts сохранены;
- exact duplicates, edge-overflow spans, replacement glyphs и malformed PDF links — 0;
- `data-print-atomic`: 0 разрывов;
- автоматические три heading-orphan кандидата визуально опровергнуты: следующий содержательный текст присутствует на том же листе;
- 140 image objects и terminal sections визуально не обрезаны;
- новых пустых interior/tail sheets нет.

Единственный blank — прежняя page 30 `/articles/dzhon-gill-istoricheskiy-kontekst/`: page 29 содержит terminal-карту, page 30 полностью белая. `GBS-GILL-HISTORY-PRINT-TRAILING-BLANK-PAGE` остаётся текущим owner.

Семь таблиц занимают несколько листов. На десяти continuation sheets повторяется header row; крупный просмотр границ строк не показывает разорванной строки, потерянной ячейки или смены порядка. Поэтому отдельный table-owner не допускается.

Text extraction не использовался как доказательство потери: targeted render checks подтвердили, что обычные абзацы и цитата Gill могут быть нарисованы, оставаясь отсутствующими в PyMuPDF text layer.

## Links и PDF-document semantics

Проверены все **2 020** annotations: 432 внутренних URI, 1 234 внешних URI и 354 GOTO. Missing Product paths, missing fragments и out-of-range page destinations — 0.

Все 73 PDF имеют title; у всех пусты author, outline, catalog language и MarkInfo/tag declaration. Это output browser print-to-PDF, которым Product не управляет после открытия системного диалога. Без обещания собственного accessible download эти поля фиксируются как ограничение browser-export, но не как Product owner.

## Двунаправленный разрыв projection ↔ paper

Прямая геометрическая сверка canonical `GBReaderProjection.getPrintNodes()` с print media обнаружила **116 canonical nodes без физической print-геометрии на 33 маршрутах**:

- 52 nodes квиза Diotrophes скрыты целиком;
- 27 FAQ-answer nodes Antisovetov остаются в нулевой высоте collapsed body;
- 30 hero captions скрыты на Heart/Hard Text routes;
- Lawson: lead скрыт, шесть tag items имеют нулевую ширину.

Это обратная сторона уже открытого `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY`: прежнее доказательство показывало painted nodes, исключённые canonical policy; новый corpus показывает canonical inclusion без painted geometry. Новый дублирующий owner не нужен. Closure должен сверять семантическое решение и реальный render **в обе стороны**, включая collapsed/quiz/caption/tag fixtures.

## Mobile и прежние PDF owners

Current-main reverify воспроизводит mobile lock без исключений: 73/73 native clicks вызывают print=1, но оставляют overlay=1 и scroll lock; все 73 Dark/reduced PDF имеют ровно один лист. Это подтверждает текущесть `SYS-READER-MOBILE-PRINT-LOCK-CLIPS-DOCUMENT`, а не создаёт новый симптом.

Desktop labels по-прежнему 68× «Скачать страницу» + 5× «Скачать PDF» при browser print, а не direct download; `SYS-READER-PRINT-ACTION-LABEL-SEMANTICS` остаётся текущим. BaseLayout skip-link также повторяется на 94/95 Lawson и 21/22 Hebrews sheets; owner `GBS-BASELAYOUT-PRINT-SKIP-LINK-REPEATS` остаётся текущим.

## Новое необходимое improvement: микротекст схемы Lot

Единственные sub-6pt spans во всём corpus — семь содержательных ссылок на Писание в SVG «Путь Лота» на page 8: **5.93 pt** (`Быт 11:31` … `Быт 19:30`). Это не декоративный kicker и не WCAG font-size violation; текст читаем при увеличении, не обрезан и встроен в PDF. Но при физическом A4 масштабе семантически важные подписи оказываются ниже premium print hierarchy.

Допускается improvement `GBS-LOT-PRINT-DIAGRAM-MICROTEXT`: исправлять надо printable diagram scale/label token и общий render guard для содержательного SVG-текста, а не глобально увеличивать любой SVG и не растрировать схему.

## Итог

Новый defect/system lane не создаётся. Расширен один существующий system owner и подтверждены четыре прежних PDF owners. Добавляется одно необходимое improvement: **61 → 62**, improvements **7 → 8**; direct 30, residual 1 и system 23 без изменения.

**Broad wave 51 завершена.**
