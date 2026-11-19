# Ctrl+K из квиза Гилла: окно закрывается, ответ остаётся

- **Проект:** «Господь Бог — Сила Моя». **Этап 22**, intake `2026-11-18` UTC.
- Audited anchor: Product [`main@9edef94ece08012223c1364bec7ddcd561cf5713`][product], production-like `dist` и владельцы исходников. AuditRepo `arena/9713b5a4-auditrepo`, база `fcf2e69b2c1531fe606d9838c811b7d1b1071db0`. Только аудит: Product и общие реестры не менялись.
- **Свидетельства:** [прогон A][a], [независимый прогон B][b], [квитанция A/B][receipt], [сценарии][harness], [команды](commands.log). Chromium Headless Shell `153.0.8010.0`, Playwright `1.62.1`, Node `22.23.4`.

**Итог.** На Гилле II глобальный поиск **заменяет** «Обучение», а не накладывается на него. Первый Escape закрывает только палитру поиска: квиз к этому моменту уже закрыт. Фокус остаётся на `<body>`, следующий Tab — на статье, не на ответе. В том же документе выбор уверенности и ответ **не теряются**. Если открыть «Обучение» снова, можно ответить и пройти по «Перечитать» клавиатурой. Отдельно, **без поиска**, при открытом квизе на 390 px два Tab после «Следующий вопрос» выводят фокус на ссылку фона — повтор QA‑02.

## 1. Что проверено

На `/articles/dzhon-gill-chast-2-uchenyi/` — два независимых прогона по 16 свежих browser contexts: 390×844 и 1440×900, light, `prefers-reduced-motion: reduce`. Промах воспроизведён на существующем вопросе о самом личном труде Гилла (`gill.scholar.canticles`), после выбора «Точно знаю». В фазе «до ответа» прервали тот же вопрос с **уже выбранной уверенностью** и фокусом на реально доступном варианте. Подготовка — штатными контролами, прерывание и возврат к варианту/источнику — нативными клавишами. Не меняли CSS, storage, фокус или scroll из harness; не открывали палитру вызовом её API. Для warm-проверок один раз заранее открыли/закрыли палитру клавишами на той же странице вне квиза.

| Условие начала | A+B | После поиска и первого Escape | Что можно сделать дальше |
|---|---:|---|---|
| До ответа: `Ctrl+K` с варианта, cold / warm | 4 + 4 | Палитра закрылась; оба листа закрыты, фокус на `<body>` | Открыть «Обучение» → Tab до прежнего варианта → Enter. Уверенность не нужно выбирать заново; показан соответствующий вердикт, «Перечитать» ведёт к источнику **8/8** |
| После промаха: `Ctrl+K` с «Перечитать», cold / warm | 4 + 4 | То же; ни автоматического открытия листа, ни возврата на ссылку | После открытия листа та же вкладка «Тест», вопрос, выбор, вердикт, разбор и `href`; Tab → Enter на ссылке работает **8/8** |
| После промаха: Enter на «Искать по всему сайту» из «Поиска по разделу» | 4 | То же закрытие, не вложение | После повторного открытия остаётся вкладка раздела и её ввод; вернуться на «Тест» → «Перечитать» **4/4** |
| Без поиска, те же две фазы | 8 | Не прерывали «Обучение» | Ответ, если ещё не дан, и переход к источнику **8/8** |
| Отдельно без поиска: Escape / Tab после Next | 4 | См. раздел 3 | Проверяет прежние QA‑02 / QA‑03, а не палитру |

**Граница ввода.** Сам `Ctrl+K` из редактируемого `#learningSearchInput` не открывает глобальный поиск **4/4**: фокус и строка `test` остаются в поле, зарегистрирован только `gill-learning`. Enter на отдельной кнопке открывает глобальную палитру. Это положительный контроль переключения, не доказательство наложения и не проверка выдачи.

**Переход к источнику.** В **28/28** сценариях перехода Enter на `#glsQuizSource` снял lock, закрыл лист, сфокусировал и вывел в viewport `#sec-canticles`; hash и history менялись только тогда (+1 запись, тот же `timeOrigin`, один HTML `200`). Прокрутка 8004 / 5446 px и верх цели 400 / 483 px на двух размерах. До прерывания `Перечитать → Tab → Следующий вопрос → Shift+Tab → Перечитать` остаётся внутри листа **16/16**. Hit-test середины ссылки до прерывания на 1440 px указывает на Next **8/8** (включая контроль без поиска); это не потеря DOM-фокуса и не помешало проверенному Enter. Не делаем вывода о клике по любой точке ссылки.

## 2. Порядок закрытия и точка возврата

1. В `gb:overlay-*` **20/20** раз `close(gill-learning, handle)` происходит **до** `open(search:command-palette)`. Снимки и события не показывают двух зарегистрированных владельцев или двух lock одновременно. В палитре `.cp-input` — активный и доступный для hit-test; статья и skip-link получают `inert` / `aria-hidden=true`. «Настройки» и «Обучение» закрыты и неинтерактивны.
2. Escape на поле палитры виден как trusted key в capture, не в bubble. На срезах **0 / 80 / 250 / 600 мс** после нажатия фокус — `<body>` **20/20**, palette/learning/settings закрыты (`inert`, `aria-hidden=true`), список владельцев и lock пуст, `body` больше не `fixed`. Hash и длина истории не меняются. Последующий Tab виден: **16/20** — «Перейти к содержимому», **4/20** (warm, 1440) — кнопка заметок `#gb-hl-fab`. Обратный Shift+Tab после этого даёт `<body>` / ссылку возврата из примечаний соответственно. Это не Tab из открытого модального окна.
3. **Точная цепочка владельцев.** [Глобальный `Ctrl/⌘+K`][shortcut] отправляет `gb:openSearch`, пропуская editable target. [Обработчик события][closer-listener] контроллера листов [закрывает][closer] `.toc-overlay.is-open` через штатный handle; [кнопка раздела][section-button] сама делает `closeSheet()` до вызова поиска. В cold-пути [bootstrap][bootstrap] может запомнить старый контрол, но к `openReady()` тот уже в закрытом листе; на событии открытия активен `BODY` **12/12** cold (включая кнопку раздела). В warm-пути на том же событии активен ещё прежний вариант/ссылка **8/8**, уже внутри `inert`-листа: это снимок синхронной границы, не рабочий opener. [Палитра][search-owner] сохраняет текущее `document.activeElement` в `ne()` и в `re()` пытается сфокусировать его после снятия собственных claims. У этой цепочки нет точки возврата к видимому управляющему элементу. Ещё одна задержка не сделает скрытый opener интерактивным.

**Сопутствующая граница `inert`, не отдельный пользовательский дефект этого квиза.** У прямого дочернего `#hMobileNav` изначально `hidden`, `aria-hidden=true`, `inert`. При закрытии первого поиска событие `gb:overlay-close` ещё показывает возвращённый исходный `inert=true`, после Escape атрибут уже снят: [`re()`][search-owner] после release безусловно удаляет `inert` с соседей палитры. Видно и в **8/8** warmup-открытий без квиза; у меню при этом остаются `hidden`, `aria-hidden=true`, `display:none`, дочерняя ссылка игнорируется в AX. Tab не попадает в меню в проверенной последовательности. Это повод сохранять claims их владельцев, не доказательство экспозиции закрытого меню.

[До `Ctrl+K`: фокус на «Перечитать»][before-frame] · [После `Ctrl+K → Escape → Tab`: фокус на статье, лист закрыт][escape-frame].

## 3. Отдельный модальный контроль без палитры

- **Точка возврата (QA‑03).** Escape из одних «Настроек» возвращает видимый реальный `#mobSettingsBtn` / `#railSettingsBtn` **4/4**. Из открытого «Обучения» с фокусом на «Перечитать» Escape оставляет `<body>` **4/4**, лист закрыт и lock снят. [Переключатель][settings-to-learning] закрывает Settings и передаёт `#mobLearningBtn` внутри закрытого листа как opener для Learning. Это тот же исходный дефект прямого закрытия, а не новый эффект `Ctrl+K`.
- **Доступность фона (QA‑02).** До Next обход от последнего контрола (`Tab`, `Shift+Tab`) замыкается внутри листа **4/4**. После Enter на Next на 390 px — `<body>`, затем `Tab → <body>`, `Tab → «Перейти к содержимому»`, `Shift+Tab → <body>` **2/2**. [Кадр][solo-frame] показывает реально видимый фокус на фоне **при открытом листе**. Всё это время жив только `gill-learning`, `body fixed`, `aria-hidden=false` у листа. На 1440 px Next остаётся видимым контролом, и все три проверенных перемещения остаются внутри **2/2**; нельзя переносить узкий результат на оба размера.
- **Механизм.** В AX при открытом «Обучении» доступны и именованный диалог, и ссылка фона **4/4**. У диалога есть `aria-modal=true`, но [вызов контроллера][learning-open] включает trap/lock без `inertTargets`, а [общий trap][trap] замыкает только крайние элементы и не перехватывает Tab из `<body>`. Узкий [CSS][next-css] скрывает Next после снятия `is-visible` при новом вопросе; [рендер][render] не назначает новый фокус. Широкий Next, видимый до ответа, уже описан в QA‑01. Оба перехода — допроверка [этапа 4][qa], не новые строки реестра.

## 4. Кому исправлять и как принять

- **Поиск из закрывающегося листа:** совместный контракт `floating-cluster-controller` / bootstrap / `GBSearch`. Если сохранять политику замены, сохранить **видимую, доступную точку возврата** вне закрываемого дерева и явный путь продолжить квиз. Если принят UX «временно поиск, затем обратно к тесту», проверять один Escape → активный лист, фокус на предыдущем варианте/«Перечитать» (или валидный fallback), один его lock, Tab в пределах листа. Нельзя просто убрать закрытие: оно [введено специально][history] против двух одновременно видимых модалов. В обоих вариантах не сбрасывать состояние квиза и не снимать чужой `inert`/lock.
- **Отдельное «Обучение»:** после Next направить фокус на осмысленный контроль нового вопроса, вернуть его к реальному opener при прямом Escape и исключать фон из последовательной навигации и AX на время модальности. Повторить на 390/1440, включая до ответа, после промаха, `Shift+Tab`, редактор и реальный same-document переход по «Перечитать».
- **Дедуп.** Не переоткрывать [#2248][pr2248] (здоровый opener на главной) и не смешивать с [этапом 21][home] (там фокус правильный, после Escape остаётся legacy lock подсказки). Здесь поиск освобождает свой lock; потеря точки возврата — продолжение QA‑03 на границе с другим владельцем. Переход к источнику после повторного открытия по-прежнему работает; не считать это возвратом `GBS-GILL-QUIZ-SOURCE-LINK-MOBILE-NOOP`.

Все 48 пинов dist совпали между A/B и с соответствующими пинами этапа 21; все прежние 66 повторно проверены. Кадр после закрытия идентичен побайтно; два кадра с квизом различаются (порядок вопросов и вариантов), стабильные итоги совпали; в Git оставлен A. Ноль неожиданных локальных HTTP-ошибок и `pageerror`; `HEAD /pagefind/pagefind.js → 404` — единственный ожидаемый промах на context с глобальным поиском: локальная сборка без Pagefind. Это не проверка результатов индекса, Safari/iOS, физического touch или всех маршрутов. Соседние изменения сверены read-only, см. [команды](commands.log). Нативный A4 (`QPDF‑01`) остаётся `PENDING_NATIVE_DIALOG`, вне этого прогона.

[product]: https://github.com/FedorMilovanov/gb-is-my-strength/commit/9edef94ece08012223c1364bec7ddcd561cf5713
[a]: evidence/quiz-search-handoff-witness.json
[b]: evidence/quiz-search-handoff-witness-replay.json
[receipt]: evidence/replay-receipt.json
[harness]: harness/quiz-search-handoff.mjs
[before-frame]: evidence/before-search-390.png
[escape-frame]: evidence/escape-and-tab-390.png
[solo-frame]: evidence/solo-after-next-390.png
[qa]: ../../arena-quiz-accessibility/2026-11-18/REPORT.md#2-панель-обучение-вход-работает-два-перехода-фокуса--нет
[home]: ../../arena-quiz-home-search-focus/2026-11-18/REPORT.md
[history]: ../../branch-hygiene-agent/2026-10-27/source-artifacts/arena--01a0a1ce-gb-is-my-strength--FINDINGS.md#131-что-изменено-файл--суть
[pr2248]: https://github.com/FedorMilovanov/gb-is-my-strength/pull/2248
[shortcut]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/site-utils.js#L290-L327
[closer-listener]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/floating-cluster-controller.js#L1484-L1486
[closer]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/floating-cluster-controller.js#L136-L151
[section-button]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L259-L265
[bootstrap]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/reader-platform/ReaderPreferencesHead.astro#L129-L162
[search-owner]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/search.js#L1
[settings-to-learning]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/floating-cluster-controller.js#L1783-L1806
[learning-open]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/floating-cluster-controller.js#L1635-L1652
[trap]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/js/site-utils.js#L656-L683
[next-css]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/css/floating-cluster.css#L3793-L3798
[render]: https://github.com/FedorMilovanov/gb-is-my-strength/blob/9edef94ece08012223c1364bec7ddcd561cf5713/src/components/article-pilots/gill-series/GillLearningSheet.astro#L386-L425
