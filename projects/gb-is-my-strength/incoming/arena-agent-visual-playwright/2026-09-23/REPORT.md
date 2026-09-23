# Visual / Playwright audit — gb-is-my-strength

| Field | Value |
|---|---|
| project | gb-is-my-strength |
| source_repo | FedorMilovanov/gb-is-my-strength |
| audited_anchor | `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (Product `main` = заявленный live releaseSha в MASTER) |
| branch_or_event_context | чистый shallow clone `main`, без открытых PR |
| agent | arena-agent |
| date | 2026-09-23 |
| environment | Node 22.22.3; `npm ci`; `astro build` → `strangler:build:production-like` → `pagefind:build:dist`; `dist/` раздаётся через `python3 -m http.server` на `127.0.0.1:8080`; Playwright 1.62.1 + Chromium из `@sparticuz/chromium` (Playwright CDN недоступен); service workers заблокированы; системные шрифты ограничены |
| report_type | browser-audit + visual-audit |
| live witness | **UNPROVEN** — `gospod-bog.ru` из песочницы недоступен (TLS `SSL_ERROR_SYSCALL`), live-проверки нет |

## Покрытие

- 104 dist-маршрута × 2 viewport (1440×900 desktop, 390×844 mobile touch DPR2) = 208 загрузок страниц со скриншотами.
- Проверки на каждой странице: горизонтальный overflow, pageerror, console error/warning, HTTP ≥400/failed-запросы, битые eager-изображения, дубли `id`, интерактивные элементы без доступного имени, число `<h1>`, `<img>` без `alt`, touch-цели <24px.
- Кликовые сценарии: поиск на главной (Ctrl+K dialog), Esc/возврат фокуса, мобильное меню + Esc, мобильный reader chrome статьи (Справка / Настройки / Поделиться / Озвучка), интро карты Авраама → маркер → панель.
- Скрипты: `evidence/crawl.mjs`, `evidence/click.mjs`; свод: `evidence/crawl-summary.txt`.

## Чистые отрицательные результаты (PASS)

- 0 маршрутов с горизонтальным скроллом на 390px и 1440px.
- 0 `pageerror` на 208 загрузках; 0 same-origin 4xx/5xx.
- 0 дублей `id`, 0 `<img>` без `alt`, 0 видимых кнопок/ссылок без доступного имени.
- Мобильное меню: 9 ссылок, закрывается по Esc. Шторки «Справка» и «Настройки» открываются как диалоги, закрываются по Esc.
- Карта Авраама: 22 маркера, клик открывает панель места (`1 / 22`), ошибок нет.

## Находки

### VIS-01 — `/karty/avraam/` удаляет свой единственный `<h1>` после загрузки карты — `candidate`, высокая уверенность

- **W4 runtime:** после `data-map-state="ready"` в документе 0 `<h1>` (desktop и mobile). Для сравнения `/karty/ishod/` оставляет `<h1 class="sr-only">`, `/karty/pavel/` — видимый `<h1>`.
- **W2 source:** `src/pages/karty/avraam/index.astro`, строки 16–30: inline-скрипт находит `h1.sr-only[data-pagefind-body]` и делает `fallbackHeading.remove()`, как только stage переходит в `ready`. Движок карты рендерит только `<h2>`.
- **Изоляция:** при отключённом JS `<h1>` на месте; если заблокировать `map-engine.js`, `<h1>` тоже остаётся; MutationObserver показывает удаление из inline-модуля (`index.html:147`).
- **Эффект:** у пользователей скринридеров нет заголовка первого уровня / навигации по `h1` на интерактивной карте; расходится с контрактом соседних карт. Pagefind индексирует статический HTML, поэтому для поиска удаление не нужно.
- **Граница claim:** возможно, это сделано специально, чтобы визуальный заголовок движка «Путь Авраама» не дублировался. Но движок выводит его как `<h2>`, так что после удаления документ остаётся без `h1`. Нужна проверка владельца: либо оставить sr-only `h1` как у ishod, либо повысить заголовок движка.
- Evidence: `evidence/avraam-intro-desktop.png`.

### VIS-02 — `/app/` desktop: italic-строка hero «Возвращайтесь» выходит за колонку и наезжает на макет устройства — `candidate`, средняя уверенность (зависит от шрифта)

- **W4:** на 1280/1440/1920 ширина блока `h1` ≈558–562px, а у строки `scrollWidth` = 706px; на 1280 правый край текста ≈706+50 > `app-device.left` = 731. На скриншоте 1440 глиф «ь» срезан/перекрыт карточкой устройства.
- **Граница claim:** `document.fonts` не загрузил ни одного шрифта, сработал fallback `Georgia, "Times New Roman", serif` (в окружении это DejaVu/Liberation). С продовым webfont метрики могут отличаться, поэтому до live/CI-скриншота это **UNPROVEN**. Кандидатный механизм: 94px italic-строка без `overflow-wrap`/`clamp` в фиксированной колонке.
- Evidence: `evidence/app-hero-1440.png`.

### VIS-03 — мобильная статья: onboarding-toast «Свайп по статье — соседняя часть серии» перекрывает шторку «Настройки» — `candidate`, средняя уверенность

- **W4:** на `/articles/chto-bibliya-nazyvaet-serdcem/` (390px) после открытия «Настройки чтения» тёмный toast висит поверх модальной шторки и закрывает ряд «Ширина статьи». Toast появляется по таймеру первого визита и не прячется, когда открыта модалка.
- Evidence: `evidence/article-settings-sheet-toast-overlap-mobile.png`. Timing-зависимо; повторить на CI-браузере.

### VIS-04 — пролог серии «Тайны сердца»: плашка серии перекрывает заголовок, запечённый в hero-картинке — `raw`

- На mobile и desktop плашка `СЕРИЯ «ТАЙНЫ ЧЕЛОВЕЧЕСКОГО СЕРДЦА» · ПРОЛОГ` лежит поверх второй строки текста, вшитого в изображение («называет сердцем»), и видны полуобрезанные буквы. Похоже на композиционный дефект именно этой обложки: у других частей серии в картинке только номер. Вердикт — за владельцем визуального ряда.
- Evidence: `evidence/heart-prolog-hero-overlap-mobile.png`.

### A11Y-05 — touch-цели меньше 24×24 в reader chrome статей — `candidate`

Свод по 63 мобильным загрузкам статей (`crawl-summary.txt`):

| Элемент | Размер |
|---|---|
| кнопки скорости озвучки `1× / 1.25× / 1.5× / 1.75×` | 51×22 |
| «Свернуть оглавление части» | 22×22 |
| «Скопировать ссылку на раздел» (скрепка у заголовков) | 14×14 (×43 страницы) |

WCAG 2.2 SC 2.5.8 (AA) требует ≥24×24 или достаточные отступы. Скрепка 14×14 рядом с заголовком — главный кандидат; кнопки скорости могут пройти по исключению spacing, это нужно проверить.

### Не дефекты / артефакты окружения (не продвигать)

- CSP-ошибки для `https://gospod-bog.ru/favicon*.png` в 45 шаблонах (статьи, nagornaya, hard-texts): `img-src` не содержит абсолютный origin, но на проде это `'self'`. Артефакт localhost, **N/A**. Замечание о гигиене: favicon в этих шаблонах подключён абсолютным URL, а в остальных — относительным (два способа, не баг).
- Запрос `https://gospod-bog.ru/images/og-nagornaya-propoved.webp` из JSON-LD/og в `/nagornaya/`, `/map/` — внешняя сеть недоступна, файл в dist есть. **N/A**.
- `[SW Register] TypeError … addEventListener` — вызван `serviceWorkers:'block'` в Playwright. **N/A**; при случае стоит проверить, что `js/sw-register.js` корректно обрабатывает `navigator.serviceWorker === undefined` (сейчас бросает, но ловит и выводит warn).
- `⏱` (U+23F1) в byline статей отрисован как tofu — в песочнице нет emoji-шрифта. На реальных ОС обычно есть, **UNPROVEN**. При желании заменить эмодзи на inline-SVG ради единообразия; это Work Queue, не MASTER.
- Предупреждения preload `route.json` / `pihahiroth-authority.json` «credentials mode does not match» на `/karty/ishod/`, `/karty/avraam/`: preload без `crossorigin`, а fetch идёт в режиме `cors`, поэтому JSON грузится дважды. Perf-полировка → Work Queue.

## Рекомендуемая классификация

| ID | Предложение | Следующий шаг |
|---|---|---|
| VIS-01 | кандидат в MASTER как current defect после current-check владельцем | решить: sr-only `h1` как у ishod или повышение heading движка; затем удалить inline-скрипт |
| VIS-02 | selected-for-current-check | CI/live-скриншот `/app/` на 1280–1440 с продовыми шрифтами |
| VIS-03 | selected-for-current-check | повторить в CI-браузере; ожидаемый контракт — toast подавляется при открытой модалке |
| VIS-04 | owner-decision (визуальный ряд) | — |
| A11Y-05 | selected-for-current-check | hit-area ≥24px у скрепки; измерить spacing у кнопок скорости |

MASTER в этом проходе **не менялся**: по протоколу до мутации нужна current-check/проверка владельцем.
