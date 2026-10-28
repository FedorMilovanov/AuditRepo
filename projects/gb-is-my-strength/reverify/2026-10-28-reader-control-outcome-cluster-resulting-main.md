# Широкая волна 7 — reader controls, opener semantics и outcome ownership

**Дата:** 2026-10-28
**Product resulting main:** `d056a19cfabe84dc2dbc59fc37ff4b03288917f1`
**Режим:** read-only SYSTEM reverify; Product не изменялся
**Охват:** `SYS-READER-SPEED-KEYBOARD-MODEL`, `SYS-TTS-RECOVERY-STATUS-OWNERSHIP`, `SYS-INJECTED-HEADER-CONTROL-HOST`, `SYS-ARTICLE-IMAGE-VIEWER-OPENER-SEMANTICS`, `SYS-READER-SHARE-COPY-OUTCOME-CONTRACT`.

## 1. Точная база и коллизии

Волна началась на `68e60300…`. Во время прогона Product #2210 с пятью `draft:true`/`noindex:true` MDX был влит как `d056a19c…`; checkout fast-forward-обновлён, `npm run validate` и production-like build повторены на новом точном HEAD. Публикуемый набор сохранился: 108 HTML, 72 approved, 0 blocked. Runtime-владельцы пяти строк не менялись. Единственный открытый Product PR #2211 изменяет только genealogy v2 data и с этой волной не пересекается.

Чистые baseline-гейты прошли: `npm run validate`; `npm run strangler:build:production-like`; Vosk retry contract. Build сохранил прежние семь Astro hints, предупреждения Shiki о `greek` fallback и module-directive warnings; это не новый red и не исправлялось. Два штатных Playwright-контракта reader-controls не стартовали только из-за отсутствующего скачанного browser bundle (`~/.cache/ms-playwright/...`), не из-за assertion Product. Обязательный Chromium 153 выполнен отдельно через `@sparticuz/chromium` и его AL2023 NSS bundle, без forced click/focus для измеряемых недоступных целей.

## 2. Нативный browser reverify

### Скорость чтения — `FIXED-CURRENT`

На `/nagornaya/chast-1/`, desktop 1280×800, Dark, reduced motion закрытая `.gb-ember-expand` имеет `inert`: шесть формально `tabIndex=0` кнопок исключены браузером из Tab/AX навигации. Фокус на Play раскрывает панель; первый Tab входит на выбранное радио `1×`, последующие шесть Tab нативно выходят на Save, не замыкая цикл. Shift+Tab от Play выходит назад на font control. Escape из панели закрывает её и возвращает точный Play opener. Ранее зафиксированные hidden stops, двусторонняя ловушка и отсутствие Escape-return больше не проявляются.

### Injected header host — `FIXED-CURRENT`

`/articles/` на 320/390/768/1280 получил ровно один runtime opener внутри явного `[data-gb-search-host="chrome"]`. Search и theme имеют по 44×44 px, overlap = 0 и полностью лежат во viewport на всех четырёх ширинах. `/biografii/` и `/pastor-series/` также дают один named-host opener. Home остаётся отрицательным контролем: native `#gbSearchBtn`, без injected duplicate. Light/Dark и reduced-motion профили включены.

### Image viewer opener — `FIXED-CURRENT`

Nagornaya desktop/mobile, Antisovetov mobile и Krajne desktop дают настоящую opener-семантику: `tabIndex=0`, `role=button`, содержательное имя. Нативные pointer, Enter и Space открывают viewer, фокус входит на Close; Escape возвращает exact image opener. Изолированный повтор с ожиданием завершения overlay restore прошёл 5/5; первоначальный немедленный sample после pointer Escape был снят до асинхронного restore frame и не считается дефектом. Статический поиск не нашёл выбранных viewer-изображений внутри authored links. No-JS сохраняет обычное изображение без ложной button-роли и без созданного viewer.

### Share/copy — сужено, но не закрыто

На Gill I desktop/mobile нативный видимый share trigger проверен через реальный click при отсутствии Web Share/Async Clipboard:

- fallback `true`: `copied`, «Ссылка скопирована», textarea удалён;
- fallback `false`: `failed`, «Не удалось скопировать ссылку», textarea удалён — прежний false-success исправлен;
- fallback throw: `failed`, «Не удалось поделиться», **textarea остаётся в DOM** (1/1 в обоих профилях).

Причина узкая: `area.remove()` стоит после `document.execCommand('copy')`, а не в `finally`. Строка остаётся системной, но теперь описывает cleanup при исключении и недостающий полный executable outcome matrix, а не уже исправленный boolean false.

### TTS recovery/status — сужено, но не закрыто

`node scripts/vosk-loader-retry-contract-test.js` проходит: terminal process-wide dependency failure больше не остаётся sticky после Retry. Однако два объединённых проявления сохраняются:

1. `showStatus('preparing'|'dependencies-ready'|'connected')` всё ещё сообщает «Системный голос уже работает» до доказанного native start/error;
2. `hideNotice()` отслеживает только внешний timeout. Детерминированная последовательность `selected(autoHide=20)` → новый `error` до внутреннего 360 ms удаления приводит к удалению нового статуса (`exists:false`).

Следовательно, строка остаётся активной с generation-owned notice removal и доказанным native fallback outcome; sticky-retry часть из неё удалена.

## 3. Quality/no-JS границы

Representative Gill I: 0 broken images, CLS `0.000224`, LCP entry 180 ms; console содержит только отфильтрованный `ERR_CONNECTION_CLOSED` внешней метрики в sandbox. Axe WCAG 2 A/AA возвращает два уже существующих `color-contrast` node; это не причинно связано с пятью владельцами и не дублируется новой строкой. No-JS `/articles/` не инжектирует search opener; No-JS Nagornaya сохраняет 25 778 символов текста и обычное hero image без viewer control semantics. Print не является исполняющим каналом для этих runtime-контролов и в этой волне не заявляется как отдельная closure surface.

## 4. Итог reconciliation

Удалены из активной матрицы как `FIXED-CURRENT` три system lane:

- `SYS-READER-SPEED-KEYBOARD-MODEL`;
- `SYS-INJECTED-HEADER-CONTROL-HOST`;
- `SYS-ARTICLE-IMAGE-VIEWER-OPENER-SEMANTICS`.

Сужены без дублирования:

- `SYS-READER-SHARE-COPY-OUTCOME-CONTRACT` — только throw-cleanup + полный outcome guard;
- `SYS-TTS-RECOVERY-STATUS-OWNERSHIP` — sticky Retry исправлен, остаются truthful fallback start/error и generation-safe notice.

Арифметика: **73 → 70 active units**, system lanes **21 → 18**; direct/improvements/residual остаются **43/8/1**. Product не мутировался.
