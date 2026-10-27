# Финальная структура и техническая гигиена — current HEAD, 2026-10-27

## 1. Якорь и границы

Проверен неизменённый Product `21dcfdd9f9018607a708c5118383e287ec1a3fed`. Канонический `npm run strangler:build:production-like` завершился успешно и выпустил 108 HTML-документов. Эта волна квалифицирует шесть build-warning об empty heading, статическую техническую утечку и динамическую проекцию relation inspector. Product не изменялся.

Машинное свидетельство: `evidence/2026-10-27-final-output-structural-hygiene.jsonl`. Скриншоты и полный browser output остались вне Git в `/tmp/wave4`.

## 2. Шесть empty heading Gill: warning реален синтаксически, отдельного дефекта экспозиции нет

Parsed census всех 108 документов нашёл ровно шесть пустых heading, и все они — один shared placeholder `h4#glsQuizQuestion.quiz-question` из `GillLearningSheet.astro` на шести Gill routes. Других пустых `h1`–`h6` нет.

На каждой из шести routes проверены desktop Chromium 1440×900 и mobile Chromium 390×844 `isMobile`, Dark, reduced motion. До начала quiz placeholder имеет `aria-hidden="true"`, не нарисован и отсутствует среди non-ignored AX nodes. Нативный click по штатной кнопке начала quiz сначала записывает вопрос, затем снимает скрытие: heading получает непустой текст, рисуется и входит в AX tree с тем же именем. Искусственное снятие атрибутов, forced click и timing-only ожидания не применялись.

Контроли: 12 route/profile loads, Axe 0, broken images 0, page errors 0, console errors 0; максимальные LCP 376 ms и CLS 0.000894. Значит, build checker видит корректный inert dynamic placeholder, но его сообщение недостаточно квалифицировано для defect. `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT` не расширяется: там уже находится реальный Gill heading-level owner, а пустой exposed heading не подтверждён.

## 3. Статический технический текст: отрицательный результат и его граница

Unicode/DOM-aware scan visible Text nodes по 108 final HTML проверил `TODO/FIXME`, `undefined/null/NaN`, localhost, source paths, Astro filenames, сырой data/ARIA-like синтаксис и близкие технические фрагменты. Hits: **0**. Hidden/script/style/template содержимое не выдавалось за reader text.

Это узкий отрицательный результат: runtime payload, появляющийся только после взаимодействия, в статический HTML не входит. Именно поэтому дополнительно нативно проверен genealogy relation inspector.

## 4. Genealogy relation inspector: extension существующего leakage owner

В publishable relation data 181 relation. У 42 есть `evidence.confidence`: `certain` ×1, `certain-textual-genealogy` ×40, `disputed` ×1. Current shared inspector печатает значения verbatim после русского `Уверенность:`. Нативная цепочка «поиск человека → click карточки → click связи» доказала все три значения на desktop и mobile; panel нарисован, присутствует в AX tree, а фокус штатно переходит на close button.

Тот же panel выводит relation `note` как «Редакционная пометка». Из 42 notes 40 целиком английские; один смешивает русский с operational `legal` / `source-derived`; только один русский. В частности, связь Иаков → Иосиф публикует английское объяснение `Matthew 1 directly states ... 'begat' ...`, а не локализованное читательское ограничение.

Это не новый route-level defect и не расширение `GBS-GENEALOGY-RELATION-LABEL-DIRECTION`: данные направления здесь правильны. Причина совпадает с уже активным `GBS-PUBLICATION-RESEARCH-SCAFFOLD-READER-LEAK` — internal enum и untranslated editorial claim проецируются прямо в русскую reader UI. В matrix расширен этот существующий owner; арифметика остаётся **47 direct + 8 improvements + 0 residuals + 23 systems = 78**.

## 5. Reconcile с Product PR #2204

После начала волны появился Product PR #2204, head `92b7d38a9175fd0dd5ef1d4654d071e939f7a096`. Он локализует три текущих confidence value и меняет caption. Это точное частичное владение confidence manifestation, но не полное закрытие extension:

- mapping покрывает текущие 3/3 значения;
- неизвестное будущее значение намеренно падает обратно в raw enum, поэтому exhaustive source contract отсутствует;
- 40 English-only notes и одна mixed operational note PR не меняет.

Следовательно, параллельный Product repair не создавался. Для закрытия existing owner нужны typed/exhaustive localized confidence labels и reader-facing локализованная проекция notes с сохранением доказательных оговорок; metadata может хранить raw enums и исследовательский оригинал. Broad Latin/English ban недопустим для имён, цитат и библиографии.

## 6. Browser health и известный Axe owner

Genealogy desktop: Axe 0, broken images/page errors/console errors 0, LCP 272 ms, CLS 0.000687. Mobile: broken images/page errors/console errors 0, LCP 216 ms, CLS 0. После reload Axe воспроизвёл один `label-content-name-mismatch` на shared `.mcp-search`; это уже класс `GBS-CHROME-LABEL-IN-NAME-MISMATCH`, не relation-inspector finding и не новый счётчик. Сетевых ошибок в этих запусках не было.

## 7. Итог

1. Шесть Gill empty-heading warnings закрыты как healthy hidden→populated transition, без нового backlog.
2. Статический visible technical-text scan чист на всех 108 документах.
3. Динамический inspector подтвердил 42 raw confidence projection и 41 нелокализованную/operational note projection; это durability extension существующего publication-scaffold owner.
4. Product #2204 признан частичным текущим owner; дубликат confidence row и отдельный Product PR не создаются.
