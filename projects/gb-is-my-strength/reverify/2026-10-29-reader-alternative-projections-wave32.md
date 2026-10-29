# Broad wave 32 — TTS, Pagefind и print-проекции новых статей

Дата: 2026-10-29  
Product PR: #2217, exact head `36066273b6e06f0c156a31531cf551ebfce98bf5`  
Current-main source control: `54877be73a590b1e29f4d701724b39ed41c17e14`

## Охват и метод

После свежего `npm run strangler:build:production-like` (111 страниц, exit 0) отдельно построен настоящий Pagefind index командой `npm run pagefind:build:dist` (exit 0). Пять новых статей проверены в Chromium в двух профилях:

- desktop 1440×900, Light;
- mobile 390×844, Dark, `isMobile:true`, `hasTouch:true`, reduced motion.

Для каждого маршрута измерены `GBReaderProjection.getTtsSegments()`, `getSearchText()`, `getPrintNodes()`, ledger, все article headings, фактически переданный `SpeechSynthesisUtterance`, observer lifecycle после динамического include/exclude и реальный DOM под `media:print`. Pagefind проверялся не наличием API, а загрузкой итоговой записи из собранного индекса. Print проверялся painted geometry и element screenshot, а не только PDF/text-layer presence.

После обнаружения print-расхождения выполнен current-main контроль на семи неизменённых Teen routes и `TeenSeriesCorrectionBoundary`; component/routes не отличаются между main и PR head.

## TTS: здоровый consumer и порядок

Во всех 10 profile-route загрузках:

- 146–198 canonical segments на статью;
- все 24–33 допустимых headings присутствуют, пропусков 0;
- `getSearchText()` точно равен нормализованной последовательности TTS segments;
- `getPrintNodes()` сохраняет ту же element identity/order;
- correction boundary и «Следующий вопрос» отсутствуют в TTS/search API;
- реальный `GBReaderTTS.play()` входит в `playing` и передаёт SpeechSynthesis первый canonical segment («Отступники · Часть I–V»), а не chrome/quiz text;
- page errors — 0.

Observer lifecycle также работает без ручного `refresh()`: динамический canonical `<p>` входит в TTS/search/print, соседний `[data-reader-exclude]` не входит никуда, после удаления canonical текст исчезает. Это закрывает риск «API существует, но живёт только на initial load» для этих маршрутов.

## Pagefind: итоговый индекс соответствует политике

Все пять route records найдены в реально собранном Pagefind index. В каждой записи:

- есть начало основного body;
- есть «Источники и сверка» и source copy;
- нет correction/safeguarding boundary;
- нет quiz action «Следующий вопрос».

То есть searchable output, в отличие от одной runtime-функции, реально проверен на конечном индексе. Нового TTS/search дефекта эта волна не обнаружила.

## Print: declared projection расходится с фактической бумагой

На всех пяти новых маршрутах `getPrintNodes()` корректно исключает `.apostasy-correction-boundary`: сам компонент имеет `data-reader-exclude data-pagefind-ignore`. Но под реальным `media:print` boundary остаётся painted:

- desktop: примерно 659×300 px;
- mobile print-width control: примерно 359×504 px;
- `display:block`, `visibility:visible`;
- `data-print-policy` отсутствует;
- `inPrintApi=false`.

Скриншот показывает напечатанные «Исправления и сообщения о неточностях», редакционный transport и crisis disclaimer. Одновременно source section остаётся видимым, а выбранные first/middle/final canonical print nodes имеют положительную геометрию — это не общий content-loss сигнал.

Current-main контроль показывает тот же разрыв на **7/7 неизменённых Teen routes × 2 ширины = 14/14**: `.teen-correction-boundary` имеет `data-reader-exclude`, отсутствует в `getPrintNodes()`, но печатается с геометрией 659×295 или 359×506 px. Следовательно, новые статьи не создали root cause; они повторили существующий конфликт между semantic projection и независимым print owner.

`reader-projection-source-contract.mjs` проверяет только то, что print owner «остаётся отдельным» и API существует. Он не сравнивает фактически painted print DOM с `getPrintNodes()`/policy. Это системная ошибка admission contract, а не слабость автора статьи.

## Классификация

Новый system lane: `SYS-READER-PRINT-EXCLUSION-POLICY-PARITY`.

Matrix: system lanes 19→20; active total 55→56. Direct defects остаются 28. Это не утверждение, что correction copy обязательно надо скрыть: дефект — недекларированное расхождение двух владельцев. Если редакция сознательно хочет печатать boundary, это должно быть явным print-policy include и semantic API обязан согласиться; если `data-reader-exclude` является решением, реальная печать обязана его соблюдать.

## Граница исправления

1. Объявить одно явное решение для correction/safeguarding boundary: print include либо exclude.
2. Согласовать `getPrintNodes()`, runtime markers и painted print DOM; независимый geometry owner допустим, независимая semantic policy — нет.
3. Добавить browser contract на current Teen + generic series adapter: first/middle/final canonical body и sources видимы, chrome/quiz скрыты, correction outcome точно равен объявленной policy.
4. Negative fixture: `[data-reader-exclude]` без отдельного print override не может молча расходиться с фактической печатью.
5. Проверять rendered geometry/screenshot или page render, не считать presence в DOM/PDF text layer достаточной.

Product не изменялся; комментарии в #2217 не оставлялись из-за active-owner collision.
