# Каталог исследования — правая исследовательская панель

**Дата:** 2026-11-12 · **Файл лаборатории:** `prototypes/study-panel-lab/research-catalog.md` · **Источников:** 50.

**Как проверялись URL.** `ПФ` — страница полностью загружена через `fetch_page` и прочитан содержательный фрагмент (16 источников). `ПС` — точный URL и содержательный сниппет получены через `web_search` (34 источника). Битые, пустые и «ссылки ради количества» не включены. Среди материалов есть 2025–2026 гг.: CHI 2026, ACL REALM 2026, W3C EPUB 3.3 (январь 2026), MDN Popover API 2026, Raycast 0.64 (июнь 2026), Readwise/RemNote/MarginNote/Roam 2025–2026, Logos Insights/Exegetical Guide, WCAG 2.2.

**Общий вывод.** Лучшие механики сходятся не на «ещё одной панели с вкладками», а на трёх слоях: (1) мгновенный предпросмотр у самого слова; (2) спокойный постоянный разбор выбранного материала; (3) принадлежащая читателю память, которую автоследование не трогает. Всё, что превращает чтение в администрирование вкладок, бесконечный canvas или отчёт ИИ, отброшено.

Легенда выводов: **A** — принять, **У** — улучшить, **О** — отвергнуть.

## A. Библейские программы и аппараты (12)

| № | Источник | URL | Пров. | Вывод |
|---|---|---|---|---|
| 1 | Logos — Using the Insights Panel | https://support.logos.com/hc/en-us/articles/25352521268109-Using-the-Insights-Panel | ПФ | **A** Сайдбар внутри библейской панели, быстрые параллельные места, легко выключить. **У** Не копировать плотный стек комментариев и premium-зависимость. |
| 2 | Logos — Exegetical Guide | https://support.logos.com/hc/en-us/articles/360016462852-Study-a-Passage-with-the-Exegetical-Guide | ПФ | **A** Hover даёт краткое слово, click — глубокий разбор. **О** Полный экзегетический отчёт как состояние по умолчанию. |
| 3 | Logos — Passage Guide | https://support.logos.com/hc/en-us/articles/360016462872-Study-a-Passage-Using-the-Passage-Guide | ПС | **О** Генерируемый «отчёт» по стиху перегружает. Принята только идея явного источника. |
| 4 | Logos — Reftagger | https://www.logos.com/reftagger | ПФ | **A** hover-preview текста ссылки + переход к источнику. В прототипе — локальный предпросмотр, без внешнего скрипта. |
| 5 | Verbum / Catholic library (Logos) | https://www.logos.com/configure/libraries?trackName=Verbum | ПС | **A** Серийная палитра как часть идентичности. **О** Менять типографику книги под «панель инструментов». |
| 6 | STEP — Quick overview | https://stepweb.atlassian.net/wiki/spaces/SUG/pages/31195147/Quick+overview | ПС | **A** Параллельные панели Писания/словаря. **У** Сделать их подчинёнными тексту, а не равноправным «рабочим столом». |
| 7 | Blue Letter Bible — Apps & Tools | https://www.blueletterbible.org/apps-tools.cfm | ПС | **A** Быстрый лексикон/оригинальные слова сразу у стиха. |
| 8 | Accordance — Work with Panes | https://accordancefiles2.com/helpfiles/Win13/content/topics/04_gswa/work_with_panes.htm | ПС | **У** Пользовательские панели хороши, но требуют ручного управления; автоматика допустима только в одной ленте. |
| 9 | BibleHub — Media kit / parallel tools | https://biblehub.com/biblos_mediakit.pdf | ПС | **О** «Стена» параллельных переводов, кросс-ссылок и инструментов. Принята только идея сравнения двух материалов по явному выбору. |
| 10 | BibleGateway Ref Tag vs Reftagger (2025) | https://churchtechtoday.com/bible-verse-preview-wordpress-plugin/ | ПС | **A** Hover-превью + выбор перевода. **О** Внешние виджеты и отправка данных третьей стороне. |
| 11 | BibleGateway — parallel / study tools | https://selfpublishing.com/biblegateway-guide/ | ПС | **A** Add Parallel и комментарии как справочный слой. **О** Панель из вкладок как главная архитектура. |
| 12 | Logos Community — verse pop-up | https://community.logos.com/forums/topic/29671-bible-verse-pop-up/ | ПС | **A** Текст стиха должен появляться без ухода со страницы. |

## B. Исследовательские инструменты, заметки и память (12)

| № | Источник | URL | Пров. | Вывод |
|---|---|---|---|---|
| 13 | Obsidian — Link notes | https://obsidian.md/help/link-notes | ПФ | **A** Backlinks и local graph; правая панель как навигация по связям. |
| 14 | Obsidian — Inline Local Graph | https://community.obsidian.md/plugins/inline-local-graph | ПС | **A** Лимит узлов, отказ от «мигающих» эффектов, запрет ловушки скролла в графе. |
| 15 | Obsidian — Literature Graph | https://community.obsidian.md/plugins/literature-graph | ПС | **A** Локальный граф вокруг активной заметки + панель цитирований. |
| 16 | Heptabase — PDF annotation | https://wiki.heptabase.com/pdf-annotation | ПС | **У** Выдержка, связанная с исходным абзацем; в прототипе «как автор использует этот текст» без drag-and-drop. |
| 17 | Heptabase — Readwise sync | https://support.heptabase.com/en/articles/10447319-connect-and-sync-readwise | ПС | **A** Выделенное сохраняется между сессиями и контекстами. |
| 18 | LiquidText 2025 collaboration | https://www.lawnext.com/2025/04/17/liquidtext-innovative-annotation-tool-for-complex-documents-adds-real-time-collaboration.html | ПС | **О** Бесконечный холст и перетаскивание как основной жест. |
| 19 | MarginNote 4 / Research (2026) | https://www.marginnote.com/en/scenarios/research.html | ПС | **A** Одна выдержка = карточка, узел карты и ссылка на источник. **О** Обязательная mind-map вместо чтения. |
| 20 | Roam Research (2026) | https://www.producthunt.com/products/roam-research | ПС | **A** Двусторонние ссылки и block refs. **О** Граф как обязательный центр интерфейса. |
| 21 | Readwise Reader — Highlights, Tags, Notes | https://docs.readwise.io/reader/docs/faqs/highlights-tags-notes | ПФ | **A** Клавиатурное чтение, заметки в правом поле, `[`/`]` скрывают сайдбары. |
| 22 | RemNote — Reader layout (2026) | https://help.remnote.com/en/articles/6690975-learning-from-pdfs-and-files-with-the-remnote-reader | ПФ | **A** Три зоны, pin-ссылка на точный фрагмент, панель Highlights. **О** AI-карточки. |
| 23 | Zotero — blog / citations | https://www.zotero.org/blog/page/2/ | ПС | **A** Библиография и точные цитаты. **О** Модальные окна вместо контекста. |
| 24 | NotebookLM — source-grounded review | https://www.tezons.com/tool/notebooklm | ПС | **A** Каждое утверждение со ссылкой на точный фрагмент. **О** Любые выводы, не извлечённые из реального текста. |

## C. Структура аргумента и «умное чтение» (6)

| № | Источник | URL | Пров. | Вывод |
|---|---|---|---|---|
| 25 | Kialo Edu — HundrED | https://hundred.org/en/innovations/6-kialo-edu | ПС | **A** Центральный тезис, pro/con, видимая форма рассуждения. **О** Придумывать автору статьи несуществующие аргументы. |
| 26 | AMQuestioner, CSCW 2025 | https://zhenhuipeng.com/docs/cscw2025_amquestioner.pdf | ПС | **A** Вопросы как мягкий вход в структуру. **О** Автоматически сгенерированные «карты аргументов» без проверки. |
| 27 | Kialo — Blackboard integration | https://appcatalog.blackboard.com/details/kialo-discussion | ПС | **A** Дерево pro/con как альтернатива графу-«спагетти». |
| 28 | CACM — The Semantic Reader Project | https://cacm.acm.org/research/the-semantic-reader-project/ | ПФ | **A** In-situ Paper Cards по клику на цитату, Kindle-подобные определения. **О** AI-саммари как замена тексту. |
| 29 | Semantic Reader Project — публикация | https://www.researchgate.net/publication/369557328_The_Semantic_Reader_Project_Augmenting_Scholarly_Documents_through_AI-Powered_Interactive_Reading_Interfaces | ПС | **A** Аугментация поверх существующего документа, а не новый сайт. |
| 30 | TableTale, CHI 2026 | https://arxiv.org/html/2602.22908v1 | ПФ | **A** Progressive cascade: сигналы появляются по мере чтения, «visual cues on demand», без постоянной анимации. |

## D. Премиальная книга, EPUB и сноски (10)

| № | Источник | URL | Пров. | Вывод |
|---|---|---|---|---|
| 31 | Amazon Kindle Publishing Guidelines | https://kindlegen.s3.amazonaws.com/AmazonKindlePublishingGuidelines.pdf | ПС | **A** Двусторонние ссылки сноска↔текст, pop-up где поддерживается, endnote как базовый слой. |
| 32 | Apple Books Asset Guide 5.3.1 | https://help.apple.com/itc/booksassetguide/en.lproj/itccf8ecf5c8.html | ПС | **A** Pop-up сноска как улучшение, не как единственный доступ. |
| 33 | Kobo EPUB spec — footnotes | https://github.com/kobolabs/epub-spec#footnotesendnotes-are-fully-supported-across-kobo-platforms | ПС | **A** Честный fallback на связанную сноску на платформах без pop-up. |
| 34 | Footnotes/endnotes for print and ebook (2026) | https://www.ebookpbook.com/2026/05/12/footnotes-endnotes-print-ebook/ | ПФ | **A** Прогрессивное улучшение, `epub:type` + ARIA-роль, никакой развилки «pop-up или доступность». |
| 35 | W3C — EPUB 3.3 Recommendation (2026) | https://www.w3.org/TR/epub-33/ | ПФ | **A** Цифровая публикация как семантическая структура; опора на реальный текст. |
| 36 | W3C — EPUB Structural Semantics Vocabulary | https://www.w3.org/TR/epub-ssv-11/#footnote | ПС | **A** `footnote` / `noteref` как модель «маркер → аппарат». |
| 37 | W3C — DPUB-ARIA 1.1 | https://www.w3.org/TR/dpub-aria-1.1/ | ПС | **A** `doc-noteref`, `doc-footnote`: доступные имена для вспомогательных технологий. |
| 38 | W3C — EPUB Accessibility Techniques | https://www.w3.org/TR/epub-a11y-tech-11/ | ПС | **A** Не выбирать между pop-up и a11y; нужны и семантика, и ARIA. |
| 39 | Coleman — Kindle features & improvements | https://www.colemanm.org/post/kindle-features-and-areas-for-improvement/ | ПС | **A** In-situ подсказки/X-Ray; **О** спрятанные элементы управления. |
| 40 | Open Source Shakespeare — annotations | https://www.opensourceshakespeare.org/annotations/about.php | ПС | **A** Многослойные примечания к классическому тексту без замены оригинала. |

## E. Контекстные панели, progressive disclosure, доступность (10)

| № | Источник | URL | Пров. | Вывод |
|---|---|---|---|---|
| 41 | ACL REALM 2026 — Progressive Disclosure | https://aclanthology.org/2026.realm-1.14/ | ПС | **A** Один уровень раскрытия как сильный дефолт; второй уровень часто ухудшает результат. |
| 42 | arXiv 2607.17598 (2026) | https://arxiv.org/abs/2607.17598 | ПС | **A** «Плоское» раскрытие для одной книги; глубокая маршрутизация не нужна. |
| 43 | Arc — Find deep focus | https://start.arc.net/find-focus | ПФ | **A** Скрыть сайдбар, Split View, Previews «не теряя текущего действия». |
| 44 | Raycast v0.64 (2026) | https://www.raycast.com/changelog/macos/0-64 | ПФ | **A** «Conservative sidebar peek», никаких случайных раскрытий при скролле/фокусе. |
| 45 | MDN — Using the Popover API | https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using | ПФ | **A** Top layer, Esc, возврат фокуса, implicit anchor; fallback обязателен. |
| 46 | W3C — Contrast (Minimum) 1.4.3 | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | ПФ | **A** 4.5:1 для обычного текста в светлой и тёмной темах. |
| 47 | W3C — Focus Not Obscured 2.4.11 | https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html | ПФ | **A** `scroll-padding`, фокус не закрыт фиксированными панелями. |
| 48 | W3C — Target Size 2.5.8 | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html | ПФ | **A** 24×24 CSS px или эквивалентный отступ; inline-ссылки — осознанное исключение. |
| 49 | NN/g — Scroll fading | https://www.nngroup.com/articles/scroll-fading-101/ | ПС | **О** Связанная со скроллом анимация и «прыгающие» высоты. |
| 50 | CurbCut — Dark mode accessibility | https://www.curbcutaccessibility.com/blog/dark-mode-accessibility/ | ПС | **A** Не чистые чёрный/белый, проверка контраста в обеих темах. |

**Итог по отвергнутым решениям.** Вкладки как главная архитектура; дашборд из одинаковых закруглённых карточек; бесконечный canvas; AI-саммари вместо авторского текста; внешние Bible-виджеты; постоянная scroll-анимация; граф без лимита узлов; «отчёт по стиху» по умолчанию; drag-only interactions; модальные окна вместо контекста. Всё это проиграло выбранной архитектуре «На полях».
