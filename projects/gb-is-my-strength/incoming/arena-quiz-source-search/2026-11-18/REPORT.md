# Аудит квизов: как найти подтверждение в статье после ответа

- **Проект:** «Господь Бог — Сила Моя» (`gospod-bog.ru`). **Дата:** 18 ноября 2026 UTC.
- Agent: Arena Quiz Source Search, этап 5. Продолжает [перепись][stage1], [сверку ключей][stage2], [цикл после ошибки][stage3] и [клавиатурный аудит][stage4].
- Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][product], исходники и точная локальная production-like сборка. AuditRepo `arena/9713b5a4-auditrepo`, первые четыре пакета в `5a18e920b`, [Draft #570][draft].
- **Разделение:** проверяются «Обучение → Поиск по разделу» и путь к найденному месту. Поиск по всему сайту и «Конспект» — контроли, а не предмет полного аудита. [Трассы][data] · [Скриншот выдачи][shot] · [Воспроизведение](commands.log).

**Главное:** если напечатать точно ту фразу, которая видна в абзаце, поиск иногда отвечает «Ничего не найдено». При этом он находит слова из закрытой сноски или подсказки и ведёт к абзацу, где этих слов не видно. Хотя панель уже умеет закрываться и показывать нужное место, её поисковый индекс не совпадает с текстом, который читает человек.

## QS-01 · Закрытые примечания разрывают текст индекса

Открыть **«Настройки чтения → Обучение → Поиск по разделу»** (кнопка с лупой) и ввести фразу. Результаты совпали на 390×844 dark/touch и 1440×900 light:

| Статья | Цитата из обычного абзаца — **0** | Контроль из того же абзаца — **1** | В закрытой подсказке — тоже **1** |
|---|---|---|---|
| Гилл I, [начало раздела о самообразовании][g1] | `23 ноября 1697 года по старому стилю в Кеттеринге` | `23 ноября 1697 года` | `Nov. 23, o. s. 1697` — сноска Риппона |
| «Крайне ли испорчено сердце?», [исторический фон][k] | `Кархемише (605 до н.э.)` | `Иеремия служил в последние десятилетия` | `Навуходоносор II разгромил египтян` — определение в подсказке |

**Результат перехода.** Нажатие результата для текста подсказки закрывает окно, снимает scroll lock, прокручивает страницу к выделенному абзацу; `elementFromPoint` попадает в него. Но подсказка не раскрывается и искомых слов в читаемом тексте этого абзаца нет. Это **не** ошибка прокрутки. Для Гилла I есть и отдельная запись сноски во втором `[data-pagefind-body]` (`.gb-note-endnotes`): в исходном состоянии она [визуально свёрнута][note-css] и поиск туда не ведёт. Не утверждаем, что примечание отсутствует или недоступно читателю вообще.

**Почему.** [Локальный индекс][index] берёт `textContent` каждого `p` и других выбранных тегов. Проверка `el.closest(...)` отбрасывает блоки *внутри* исключённых элементов, но не удаляет вложенный текст подсказок из родительского абзаца. [Сборка][projection-build] уже маркирует payload как `data-pagefind-ignore` и добавляет скрытые разделители; в локальном сниппете эти разделители всё равно видны (`⟦сноска:` / `⟦определение:`). Живые элементы скрыты по-разному: у сноски Гилла `visibility:hidden` на 390 и `opacity:0` на 1440, поэтому одного `innerText` для проверки было бы недостаточно. Для сравнения, [`GBReaderProjection.getSearchText()`][reader-text] на тех же страницах содержит обе видимые фразы и не содержит обеих фраз из подсказок. Это отдельный локальный потребитель, а не основание переоткрыть исправление Pagefind или [#1714][pr1714] (у поля есть имя «Найти в этой статье»).

## QS-02 · Пропущенные форматы, дубли и счётчик результатов

- **Гилл II:** три уникальных фрагмента из основного `article[data-pagefind-body]` дали **0** в обоих профилях: `Перо и чернильница — символ многолетней` ([подпись, обновлённая в браузере][caption]), `Сопоставление цитат ВЗ с масоретским текстом` ([ячейка][table-cell]), `Богословие будучи ничем иным` ([оформленная цитата в `div`][quote-div]). Обычный абзац `Называть его первым трудом такого рода` находится (**1**). Локальный селектор — `h2,h3,p,blockquote,li`, так что это не проблема склонения или поиска по всему сайту. Общая проекция включает проверенную подпись, но сама по себе **не** покрывает эту ячейку и `div`.
- **«Отступление», §1:** полная цитата «Лексема — доказательство внутри контекста, а не готовая система спасения» возвращает **два** одинаковых сниппета. Первый обычным Tab/Enter открывает `blockquote`, второй — его дочерний `p`; это одно место, не два текстовых свидетельства. См. [MDX][quote-mdx] и обе трассы.
- **Лимит:** на Гилле II запрос `Гилл` совпал со **100 блоками** по действующему правилу отбора, но видны только первые **20** и «Найдено: 20» без оговорки. Это не число слов и не число уникальных мест. Лимит сам по себе допустим; нужно явно показать, что выдача усечена. Контроль: `Г` даёт подсказку о минимуме двух символов и убирает старую выдачу.

## QS-03 · Поиск после промаха возвращает к тексту, но не ставит на него фокус

В панели «Отступления» неверно ответили на `apostasy.p1.lexeme` ([вопрос][lexeme]); нужную карточку получили обычными ответами в пределах одного перемешанного набора, без подмены состояния. Затем в «Поиске» ввели полную цитату и нажали **Tab → Enter** на первом результате (390) или **Tab → Tab → Enter** на втором (1440). Текст появился в viewport и прошёл hit-test; `<body>` остался активным и через 520 мс, фокус у цитаты не появился. Карточка «Конспекта» к `#odno-slovo` в обоих случаях также приводила визуально к правильному заголовку, но не фокусировала его. Поиск и [карточки «Конспекта»][outline] используют [`jumpTo`][jump]. Это не [переход из вердикта квиза][quiz-source], где явный перевод фокуса уже есть. Не требуем менять hash для каждой кнопки результата: синтетический `gill-search-p-*` не обещан как публичный якорь.

**Что уже работает.** Документ при поиске не меняется. После повторного открытия панели остаются запрос, тот же вопрос, вердикт/разбор, счётчик и калибровка. «Искать по всему сайту» закрывает «Обучение» и фокусирует глобальное поле; оно пустое, запрос `Грэнтем` нужно ввести снова. После ввода реальная глобальная выдача на обоих профилях показала нужное место статьи Гилла II и загрузила локальные ресурсы Pagefind. Это контроль работающей альтернативы, не утверждение о полном покрытии Pagefind. Перенос запроса — небольшое улучшение, отдельно от исправления QS-01.

## Приёмка и координация

1. **Приоритет QS-01.** Отдельно индексировать читаемый текст и, если нужно, примечания с явной маркировкой и рабочей целью. Проверить обе точные видимые фразы, отсутствие закрытого payload в сниппете основной прозы и достижимость реальных сносок. Не выкидывать всё латинское/английское вместе с примечаниями. [Существующая проекция][reader-text] — кандидат на повторное использование, но не готовая замена индекса с адресами блоков.
2. **QS-02 / QS-03.** Одно место — один результат; оговорённый лимит; учесть видимые смысловые блоки на примерах выше. После перехода проверить закрытие, прокрутку, попадание в текст и фокус на осмысленной цели, не обнуляя отвеченный вопрос. Сохранить штатный `#2222` для источников квиза и независимый глобальный поиск.
3. **Соседние изменения.** [AuditRepo #562][neighbor-a] меняет строку MASTER по редакционным источникам девяти статей, [#557][neighbor-b] — документацию браузерного окружения. [Product #2338][neighbor-j] меняет Journal/G3 и его реестры; общего владельца локального поиска не меняет. В опубликованных Arena-ветках и открытых PR совпадающей правки не обнаружено. Для [Product #2328][neighbor-g] подтверждена граница: статья/оглавление исправлены, [QE-01][stage2] остаётся именно в ключе теста. [#2332][neighbor-m] менял историю и reader-facing подписи в карте, не `QuizHub` и не этот поиск. Замечание для владельца Гилла оставлено в [комментарии к AuditRepo #570](https://github.com/FedorMilovanov/AuditRepo/pull/570#issuecomment-6983861606); запись в Product недоступна GitHub App.

**Метод и пределы:** четыре маршрута, **10 браузерных сценариев × два самостоятельных прогона**, 28 запросов/проверок состояния поля в каждом, без локальных HTTP ≥400 и `pageerror`. HTML-перепись — 68 панелей, включая 11 с банком; у трёх маршрутов второй корень `data-pagefind-body` с endnotes. Это не 68 проверенных вручную поисков. Источники и чекпоинты из [трасс][data] связывают семь файлов `dist` по SHA-256. Chromium `153.0.8010.0`, Playwright `1.62.1`, Node `22.23.4`; локальный сервер, SW и разрешение имён внешних хостов отключены, reduced motion. Ограничение проверки видимости: сравнивали конкретные блоки с учётом `display`, `visibility` и `opacity`; это не универсальный парсер отрисованного текста и не аудит речи скринридера. Не проверяли публичный домен, реальный телефон или другой браузерный движок. Product, MASTER и ledger не менялись; `QS-*` — наблюдения intake.

Полные JSON по ссылкам ведут на исходный снимок. [Проверяемый архив и восстановление локальных путей](../../arena-quiz-draft-review/2026-11-18/REPORT.md#архив-и-повторная-проверка).

[stage1]: ../../arena-quiz-learning/2026-11-18/REPORT.md
[stage2]: ../../arena-quiz-editorial/2026-11-18/REPORT.md
[stage3]: ../../arena-quiz-review-loop/2026-11-18/REPORT.md
[stage4]: ../../arena-quiz-accessibility/2026-11-18/REPORT.md
[data]: https://github.com/FedorMilovanov/AuditRepo/blob/3940425bb5371fa0590163686d04620d4d45dbe3/projects/gb-is-my-strength/incoming/arena-quiz-source-search/2026-11-18/evidence/search-witness.json
[shot]: evidence/footnote-in-search.png
[draft]: https://github.com/FedorMilovanov/AuditRepo/pull/570
[neighbor-a]: https://github.com/FedorMilovanov/AuditRepo/pull/562
[neighbor-b]: https://github.com/FedorMilovanov/AuditRepo/pull/557
[neighbor-j]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2338
[neighbor-g]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2328
[neighbor-m]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2332
[product]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[pr1714]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/1714
[g1]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-part1/GillPart1SectionIntro.astro#L1-L8
[k]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/krajne/KrajneBody.astro#L52-L59
[note-css]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/runtime/note-registry.css#L1-L20
[index]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L171-L191
[projection-build]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/scripts/project-reader-linear-text-to-dist.mjs#L248-L256
[reader-text]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/runtime/reader-projection.js#L125-L165
[caption]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-part2/GillPart2ImageCorrections.astro#L11-L28
[table-cell]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro#L95-L104
[quote-div]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-part2/GillPart2ArticleBody.astro#L463-L469
[quote-mdx]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/content/articles/otstuplenie-chto-govorit-bibliya.mdx#L65-L73
[lexeme]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/apostasy-series/apostasyLearningData.ts#L24-L32
[jump]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L208-L250
[outline]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L600-L606
[quiz-source]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L575-L598
