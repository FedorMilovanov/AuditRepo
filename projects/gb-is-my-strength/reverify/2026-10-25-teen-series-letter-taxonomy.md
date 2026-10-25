# «Подросток за кадром»: буквы A–D и семантика семи шагов

**Дата:** 2026-10-25  
**Product anchor:** `015573af602dd7b8d49feb296638b3447364a529` (`main`)  
**Disposition:** буквы — намеренное редакционно-инженерное решение; найден один отдельный дефект представления прогресса

## Короткий ответ

Буквы **A–D не появились случайно**. Они отделяют продолжение о совершеннолетних детях от исходной подростковой трилогии I–III:

`I → II → III → A → B → C → D`.

Это закреплено с foundation-коммита `a6eeda417f`, прямо объяснено в `teenSeriesConfig.ts`, нормативном `TEEN-SERIES-PUBLICATION-CONTRACT.md`, release-контракте и на публичном лендинге. Все A–D — полноценные шаги 4–7, не приложения.

В shared engine `mark.kind: 'letter'` означает спутник: такой пункт исключается из обычного rail/previous-next flow. Поэтому A–D намеренно записаны как core `mark.kind: 'label'`. Механически менять их на `letter`, IV–VII или отдельную серию нельзя без редакционного решения владельца.

Но повторное использование `label` создаёт реальный UI-дефект: shared rail понимает label как ненумерованный форзац, считает только `romanItems` и под заголовком **«Прогресс серии»** показывает I–III как «Часть 1/2/3 из 3», а A–D — только «A/B/C/D». Это противоречит канону «семь first-class core reading steps» и лендингу «Шаг N из 7». Буквы сохраняются; исправлять нужно модель/проекцию порядкового прогресса.

## Проверенная модель и история

- Foundation `a6eeda417f` сразу ввёл семь элементов в порядке I, II, III, A, B, C, D.
- Комментарий config прямо говорит: A–D — `first-class core reading steps`; `letter` запрещён из-за satellite semantics.
- `scripts/teen-series-foundation-contract.mjs` требует точный порядок и отклоняет `mark.kind='letter'`.
- `scripts/teen-series-release-contract.mjs` требует те же семь production routes и линейную цепь.
- `data/series.json` публикует семь материалов с теми же display marks.
- Лендинг объясняет читателю: первые три материала — подростковая трилогия, разделы A–D — продолжение после совершеннолетия; буквы не обозначают второстепенные приложения.
- Открытых Product issue/PR с teen/«Подросток»/«взрослый ребёнок» в title/body нет. Текущие PR #2179, #2164, #2143 не владеют этим config/rail.

## Сборка и контракты

На чистом Product head:

- `npm ci` — PASS; npm сообщает существующую 1 moderate advisory;
- `npm run strangler:build` — PASS (`astro check`: 0 errors, 6 hints; 104 Astro pages; 108 final HTML after legacy projection);
- `node scripts/teen-series-release-contract.mjs` — PASS: 8 routes, 7 articles, порядок I→II→III→A→B→C→D, 7/7 bibliography boundaries;
- foundation-contract в опубликованном состоянии закономерно красный: он является prepublication gate и требует draft/noindex/отсутствие production routes. Это не текущий release gate и не evidence против публикации;
- bare `astro:build` недостаточен для post-release contract: bibliography boundary добавляет canonical postbuild projector. После полного `strangler:build` release-contract зелёный.

Product не изменялся.

## Рендер всех семи маршрутов

Production-like `dist` проверен Chromium 153.0.8010.0, dark scheme, `prefers-reduced-motion: reduce`:

- desktop 1440×900 и mobile 390×844/isMobile/hasTouch;
- 14/14 загрузок: правильные URL/H1/document title, `CreativeWorkSeries`, dialog label и 264-минутная серия;
- 14/14: 0 broken images, 0 page errors/console errors, 0 horizontal overflow;
- mobile CLS: 0 на 7/7; desktop стабильные повторы 0.00138–0.02169. Один cold-start A дал 0.26873, но три независимых повтора одинаково дали 0.02003, поэтому одиночный startup outlier не принят как Product-дефект;
- local production-like LCP: 364–740 ms; это сравнительный локальный witness, не production RUM/SLO;
- Axe WCAG A/AA не нашёл отдельного structural defect на этих страницах; `color-contrast` остаётся в уже активном shared contrast backlog и не дублируется teen-строкой;
- accessible dialog names корректно различают I–III и A–D: «Часть I · …», «A · …» и т. д.; overlay содержит все семь top-level items.

Сами заголовки «Раздел A–D» согласованы с явной редакционной границей. Ошибка ограничена строкой порядкового прогресса shared rail: `GillSeriesRail.astro` фильтрует `romanItems`, а для `label` возвращает только mark.

## Нативная навигация и document identity

На Chromium 153 с Navigation API выполнены 12 соседних переходов:

- desktop rail: 6/6 fail;
- mobile overlay: 6/6 fail.

В каждом случае адрес/history меняется на правильный следующий slug, но H1 остаётся исходным и запрос целевого документа не отправляется. Переход III→A ломается так же, как I→II и A→B: буквы не являются причиной.

Это свежо подтверждает уже заведённый `SYS-READER-DOCUMENT-NAVIGATION-INTERCEPTION`, а не создаёт семь teen-дефектов. Critical owner `reader-tts-lifecycle.js` и его browser contract байт-в-байт не изменились между прежним anchor `948ecff…` и текущим `015573af…`; merged #2192 касался print/fold semantics.

Контроль на Chromium 92 переходил успешно, потому что там нет `window.navigation`; он подтверждает зависимость дефекта от Navigation API и не опровергает Chromium 153.

## Нижние карточки / next-part

Teen wrapper `SeriesReaderChrome → GillSeriesChrome` не рендерит `HeartSeriesNext` или иной article-end neighbor block. Каноническая цепь сейчас представлена desktop rail и mobile overlay. Отсутствие отдельной нижней карточки не принято новым дефектом без текущего teen-контракта/owner promise; системный navigation defect уже охватывает существующие bottom-neighbor owners на других сериях.

## Новый bounded defect

### `GBS-TEEN-SERIES-CORE-STEP-PROGRESS`

**Факт:** публичная серия и release contract определяют семь first-class шагов. При этом rail под подписью «Прогресс серии» показывает только римскую трилогию как 1–3 из 3 и не сообщает порядковые позиции 4–7 для A–D.

**Root cause:** shared `label` type совмещает два разных смысла:

1. настоящий форзац/справочник, который нельзя считать частью;
2. teen core continuation step с буквенным display mark.

**Repair boundary:** не менять редакционные marks. Ввести явную семантику core sequence/progress (отдельное поле/type или вычисление из core items) и проецировать «Шаг 1–7 из 7» либо owner-approved эквивалент, сохраняя display marks I–III/A–D. Проверить landing, desktop rail, mobile bar/overlay, accessible names, structured data и линейную цепь. Не превращать A–D в satellites и не маскировать системный document-navigation defect.

## Evidence

Compact records: `evidence/2026-10-25-teen-series-letter-taxonomy.jsonl`.
