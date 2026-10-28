# Широкая перепроверка альтернативных представлений и структуры — волна 18

**Дата:** 2026-10-29  
**Product:** `1aff67560d56d8521aaeab81bdc361f33dbd6af6` (`main`)  
**AuditRepo:** ветка `arena/1c8dd3ee-auditrepo`, PR #496  
**Охват:** Krajne reduced-motion quiz, Ishod no-JS/print/AX, общий print-terminal owner, Biografii print, outline/landmark corpus.

## 1. Границы и воспроизводимость

Перед прогоном у Product не было открытых PR. Production-like сборка завершилась успешно: Astro 7.2.9, 105 Astro pages, 109 итоговых HTML; диагностика — 0 errors, 0 warnings, 7 hints. Браузер — настоящий headless Chromium через `playwright-core` и `@sparticuz/chromium`; скриншоты и PDF оставлены вне Git.

Diff от предыдущего широкого якоря `cdf994b104d7b5eaeef407bf60e341e436efe1df` до текущего main содержит 27 путей: новую публикацию об отступлении, её реестры/изображение и genealogy data. Владельцы Krajne, Ishod, About, Biografii, Nagornaya и общий print runtime не менялись. Это не заменяет браузерную проверку, но отделяет новую публикацию от проверяемых владельцев.

В запросах Krajne/About/Biografii единственный console/request шум — заблокированный внешним sandbox запрос `https://mc.yandex.ru/metrika/tag.js?id=108353327` (`ERR_CONNECTION_CLOSED`). Он явно отфильтрован как egress noise, а не Product-дефект. Page errors и broken images — 0.

## 2. Krajne: прежняя строка уже корректно выведена из active arithmetic

`GBS-KRAJNE-REDUCED-MOTION-QUIZ-OCCLUSION` не находится среди активных строк: она уже записана ниже матрицы как former active / `FIXED-CURRENT`. Поэтому повторно удалять её или менять aliases не требуется.

На exact-current выполнены 1440/390 × Light/Dark × normal/reduced, `isMobile=true` для 390. В каждом из 8 профилей нативные focus + Enter прошли launch, все 12 вопросов, «Показать результат», результат и «Пройти ещё раз»; после restart снова отображается вопрос 1/12. Итог: **8/8**, horizontal overflow 0, broken images 0. Контроль производительности: LCP 292–576 ms, CLS max 0.04823. Это подтверждает прежнюю retirement receipt, но не меняет счётчик.

## 3. Ishod: печать/AX исправны, no-JS всё ещё перекрыт

### 3.1 No-JS

Четыре профиля 1440/390 × Light/Dark запускались с `javaScriptEnabled=false`. Текстовая проекция действительно развёрнута: 15 588 символов, высота 8126 px desktop / 15 373 px mobile. Но `[data-pihahiroth-noscript]` остаётся `position:fixed` с почти полным viewport и максимальным z-index. Нативный `elementFromPoint` в центре viewport на top/middle/end документа дал overlay **12/12**; длинная публикация под ним не становится читаемой прокруткой.

Следовательно, `GBS-ISHOD-NOJS-FALLBACK-OWNER-OCCLUSION` остаётся активной без расширения.

### 3.2 Print и AX

В 1440/390 × Light/Dark × reduced текстовая проекция при print имеет 15 732 видимых символа, 17 headings, 34 list items, ширину ровно viewport и overflow 0. Authority-фразы о неутверждаемой точной координате и коридорах неопределённости присутствуют. Full CDP AX tree содержит «Этапы маршрута» и «Пи-Гахироф»; Axe: 0 violations во всех 4 профилях.

При этом три известные склейки rich-блоков (`Аменхотеп II. Средняя Поздняя`, `Средняя Кочевая стоянка`, `Средняя Кочевники`) остаются в final HTML по одному разу. Поэтому `GBS-ISHOD-STATIC-PROJECTION-RICH-BLOCK-FLATTENING` остаётся активной: проблема — утрата границ, а не отсутствие текста. No-JS occlusion принадлежит отдельной строке.

## 4. Print terminal: `/about/` воспроизводит потерю контента

В Light и Dark `GBPrintPagination v1` готовит route успешно, но помечает `terminalFollowers=20`. Print CSS скрывает эти узлы через `display:none`: среди них breadcrumb «Приложение · Библейский тренажёр», блок «Нашли неточность?» и `cite` «Аввакум 3:19».

Реальные Chromium PDF имеют по 4 страницы и 5589 извлечённых символов. Во **2/2** PDF отсутствуют epigraph cite, breadcrumb и accuracy block. Значит, это не только DOM-классификация: `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` остаётся активной.

## 5. Biografii print: остаток stacking подтверждён

Для `.h-hero-tagline` в 1440/390 × Light/Dark print вычисляются положительная геометрия, `display:block`, `opacity:1`, чёрный текст и прозрачный фон. Однако center hit-test во **всех 4/4** профилях возвращает подлежащий `IMG`, не tagline и не его потомка: текстовый слой находится под изображением. Отдельно десять article cards имеют нормальный поток (`position:static`), 0 взаимных пересечений и 0 horizontal overflow; поэтому scope не расширяется на карточки.

`GBS-PRINT-MEDIA-CONTRAST-COLLAPSE` остаётся узко открытой на Biografii hero плюс обязательный 16-route regression contract.

## 6. Outline/landmark: active row стала stale и закрыта

Fresh parser прошёл все **109** итоговых HTML. Три служебных verification/app documents ожидаемо не имеют публикационных h1/main; оставшиеся **106 content documents** имеют ровно один h1, ровно один main и **0 линейных heading-level skips**.

Дополнительно восемь прежних Nagornaya owners (`/nagornaya/`, `chast-1`…`chast-5`, `istochniki`, `nakhodki`) проверены живым Chromium:

- h1: 1 на каждом route;
- main: 1 на каждом route;
- main внутри footer: 0;
- article вне main/`role=main`: 0;
- линейные skips: 0;
- full AX: 1 `main` на каждом route и 152/152 DOM headings представлены AX heading nodes.

Результат не совпадает со старым описанием «22 skips / 5 landmark anomalies», но совпадает между final-corpus parser, живым DOM и full AX. Поскольку владелец не менялся после `cdf994b…`, это reconciliation stale evidence, а не приписывание новой Product-правки. `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT` удалена из active section и зарегистрирована как `VERIFIED_CLOSED_CURRENT`.

## 7. Reconciliation

- удалена одна stale direct row: `GBS-OUTLINE-ORDER-AND-LANDMARK-CONTAINMENT`;
- Krajne receipt подтверждена, но повторного изменения счётчика нет;
- Ishod no-JS, About print terminal и Biografii print остаются в прежних строках, без дублей;
- aliases не менялись: удаляемый direct ID не является alias target/source;
- арифметика: **54 → 53**, direct **28 → 27**; improvements 7, residual 1, systems 18.

Машиночитаемая квитанция: `evidence/2026-10-29-alternative-media-structure-wide-refresh.jsonl`.
