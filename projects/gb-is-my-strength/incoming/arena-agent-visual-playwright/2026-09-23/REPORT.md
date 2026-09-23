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

---

# Wave 2 — ссылки, 404, клавиатура, axe-core WCAG 2.2 AA

Тот же anchor `d0e04a9c` и та же сборка. Проверены открытые Product PR: #2142 (исследование по баптистам, глава 1) и #2138 (dependabot). С поверхностями ниже **не пересекаются**.

## Покрытие wave 2

- Статический обход ссылок по 107 HTML из `dist`: все внутренние `href` + якоря `#frag` (`evidence/links.mjs`).
- Семантика 404 как на GitHub Pages: локальный сервер отдаёт `404.html` с кодом 404 на любой неизвестный путь (`evidence/ghp.mjs`, `evidence/p404.mjs`).
- Проход по Tab: 18 ключевых маршрутов, по 40–50 нажатий. Для каждого фокуса фиксировались видимость, индикатор фокуса и зацикливание (`evidence/kbd.mjs`, `evidence/trap.mjs`, `evidence/keyboard-walk.json`).
- axe-core 4.x, теги `wcag2a/2aa/21a/21aa/22aa`, все 104 маршрута, 1440px, `reducedMotion: reduce` (`evidence/axe.mjs`, `evidence/axe-wcag-aa-104-routes.json`).

## Отрицательные результаты (PASS)

- Внутренние ссылки: 0 битых среди всех href на страницах контента; 0 битых якорей `#fragment`.
- Skip-link есть и стоит первым в порядке Tab на 14 из 18 маршрутов. Остальные — map/app-оболочки, где первым идёт «на главную».
- axe: 0 нарушений по `image-alt`, `label`, `button-name`, `link-name`, `html-lang`, `document-title`, `duplicate-id-aria`, `aria-valid-attr`.

## Находки wave 2

### KBD-01 — keyboard trap в контроле скорости озвучки на частях «Нагорной» — `candidate`, высокая уверенность (SC 2.1.2, уровень A)

- **W4:** на `/nagornaya/chast-1/` и `/nagornaya/chast-3/` Tab уводит фокус в группу `Скорость 1× … 2× → Остановить озвучку` и дальше крутится в ней бесконечно. Из 40 нажатий уникальных целей всего 11, при 54–56 tabbable на странице. Shift+Tab тоже остаётся в группе. Esc группу не закрывает: следующий Tab возвращает фокус в неё же.
- **W2:** `js/floating-cluster-controller.js` ≈2024–2044. Обработчик `keydown`, подписанный на **document**, делает «Tab trap inside speed panel»: пока `panel.is-open`, фокус с `last` переносится на `first`. Панель открывается по `focus` на ember (≈2013) и закрывается по `focusout` с задержкой 120 мс. Но фокус из панели не уходит (его перехватывает trap), поэтому `focusout` не срабатывает. На Esc вызывается `closePanel()`, а фокус остаётся на кнопке внутри группы, и следующий фокус снова открывает панель.
- **Механизм:** модальный focus trap применён к немодальному radiogroup. Для `role="radiogroup"` по ARIA APG нужен roving tabindex: одна точка входа, ←/→ внутри группы, Tab выводит из неё. Стрелки уже реализованы (≈2028), поэтому достаточно убрать ветку Tab.
- **Граница:** на `/articles/serdce-i-telo/` и в `GillSeriesRail` trap не воспроизвёлся (у Gill-rail другая панель). Проверены только эти две части «Нагорной»; `chast-2/4/5` используют тот же `NagornayaCompactBottomBar`, trap там вероятен, но не проверен.

### KBD-02 — невидимые кнопки скорости в порядке Tab на страницах статей — `candidate` (SC 2.4.7 / 2.4.11)

- **W4:** на `/articles/serdce-i-telo/`, `/articles/kod-da-vinchi/`, `/articles/dzhon-gill-chast-1-chelovek/`, `/baptisty-rossii/` пять кнопок `Скорость …` получают фокус, пока контейнер `.gb-ember-expand` имеет `opacity:0`. Нет ни `inert`, ни `aria-hidden`, ни `tabindex=-1`. Позже фокус открывает панель (через 800 мс `opacity=1`), но в момент фокуса кнопка невидима. Скринридер объявляет пять контролов до того, как их видно.
- Тот же владелец, что у KBD-01 (`floating-cluster-controller.js`). Рекомендуемый контракт: у закрытой панели `inert` на `.gb-ember-expand`, у открытой — roving tabindex.

### KBD-03 — индикатор фокуса у кнопок «Поиск» / «Переключить тему» подавлен `!important` — `candidate`, высокая уверенность (SC 2.4.7, уровень AA)

- **W4:** на `/`, `/articles/`, `/hard-texts/genesis-6/`, `/izbrannoe/` при `:focus-visible` у `.gb-nav-search-icon` и `.theme-toggle` стоит `outline-style:none`, `box-shadow:none`, border 0px. Визуально фокус не отличается от обычного состояния (`evidence/kbd4.mjs`).
- **W2:** `css/mobile-hotfix.css`, последний блок: `.gb-nav-search-icon,.h-cp-btn,.theme-toggle{…outline:0!important}` плюс `…:focus,…:hover{…outline:0!important;box-shadow:none!important}`. Правило перебивает и глобальное `:focus-visible{outline:2px solid …}` в том же файле, и `css/command-palette.css:70 .gb-nav-search-icon:focus-visible{…}`. `mobile-hotfix.css` подключается на 88 страницах dist.
- **Механизм:** hotfix, убиравший фон и рамку «пилюли», задел и outline. Лечится выносом `:focus` из селектора и возвратом `:focus-visible` с outline.

### A11Y-06 — вложенный tooltip-trigger в «20 антисоветов» (редакционная разметка) — `candidate`, высокая уверенность

- **W2:** `src/components/article-pilots/antisovetov/AntisovetovBody.astro:655`: `<span class="map-trigger" data-tip="43" role="button" tabindex="0">законничество в Писании именуется <span class="map-trigger" data-tip="19" role="button" tabindex="0">извращением правосудия…</span></span>`. Кнопка вложена в кнопку (axe `nested-interactive`), это единственный такой случай из трёх триггеров на странице.
- **Содержательный симптом:** tip 19 и tip 43 оба называются «Иезавель и Навуфей (3 Цар. 21)», тексты близкие. По виду это двойная вставка одного пояснения при редактуре. Клик по внутреннему фрагменту открывает tip 19, по внешнему — tip 43: одна фраза даёт два почти одинаковых поповера.
- Evidence: `evidence/antisovetov-nested-tooltip.png`. Решение по тексту (какой tip оставить) — за редакцией; технически нужен один плоский trigger.

### A11Y-07 — 404 на вложенных путях теряет стили/скрипты reader-preferences — `candidate`, средняя уверенность

- **W2:** в `404.html` (корень) 3 относительных URL: `js/reader-preferences-head.js`, `css/reader-preferences.css`, `js/reader-preferences.js`. Все остальные ассеты подключены от корня (`/…`).
- **W4 (эмуляция Pages):** на `/nope` все ассеты 200. На `/articles/nope/` и `/articles/kod-da-vinchi/nope/deeper` эти 3 запроса дают 404: браузер резолвит их относительно запрошенного пути. Основная тема на 404 держится (фон тёмный, если в localStorage `dark`), но стили и скрипт настроек чтения на вложенных 404 не загружаются.
- **Граница:** на GitHub Pages 404.html отдаётся по исходному URL, как в эмуляции. Live не проверено (**UNPROVEN**). Небольшое исправление: `/js/…`, `/css/…`.

### A11Y-08 — axe `color-contrast`: 52/104 маршрута, 891 узел — `raw` → нужна triage-волна

Сгруппировано по классам (топ):

| Класс / элемент | Контраст | Где |
|---|---|---|
| `.gbs2-kinetic` (огромная римская цифра за заголовком) | 1.11 | 15 статей «Тёмной стороны»; `aria-hidden` декоративный → **false positive** |
| `#gbs2Pct` (процент прогресса в rail) | 3.42, 11px | 15 статей |
| `.article-byline` / `#gill-search-p-001` `#9a6a2f` на `#f7f3ed` | 4.24, 11px | 14 статей |
| `.article-desc`, `time`, `.sdg` `#6a6a6a` на `#efe7d7` | 4.39 | серия «Баптисты России» |
| `#nagFontDec/#nagFontInc` (кнопки A−/A+) | 3.28 | части «Нагорной» |
| `.gill-card__kicker/__time` | 3.24, 11px | серия Гилла |
| `.article-updated`, `.article-byline__updated` | 3.15, 10px | герменевтика |
| `.h-article-kicker` `#6181bb` | 3.68, 10px | `/nagornaya/seriya/` |

Большинство значений 3.2–4.4:1 на мелком тексте (10–13px), то есть реальное несоответствие AA 4.5:1, но точечное, на уровне токенов. Системный кандидат — вспомогательные токены цвета (`muted/faint`) на тёплых поверхностях. Отдельно `link-in-text-block` (6 страниц): ссылки-источники `#1f4ea3` без подчёркивания отличаются от окружающего текста всего на 1.45–1.71:1 (`/nagornaya/chast-1,3,5`, `/konfessii/`, `/journal/dossiers/g3/`, герменевтика).

### A11Y-09 — родословие: 149 узлов React Flow с `aria-label` на `div` без роли — `raw`

- `/rodosloviye/`: `div.react-flow__node[aria-label="Ева: открыть сведения и семью"]`, `tabindex=-1`, роли нет. Tabbable только 5 узлов из 149. axe `aria-prohibited-attr`. Скринридер может не прочитать label, а текст «открыть сведения» обещает действие, которое с клавиатуры для большинства узлов недоступно.
- **Граница:** у этой поверхности есть отдельные genealogy-гейты (закрытый `SYS-GENEALOGY-WEBKIT-WITNESS`) и, возможно, собственная keyboard-модель (поиск по имени, список). Перед promotion нужна сверка с владельцем genealogy.

### Прочее

- `scrollable-region-focusable`: `/articles/kod-da-vinchi/` `.ctw-body` — прокручиваемая область без фокусируемого содержимого; с клавиатуры не прокрутить.
- `nested-interactive` у сносок `fn-marker` (Гилл ч.1, «Крайне ли испорчено сердце») и `flip-card` (Гилл ч.3): внутри `role=button` есть фокусируемые потомки. Нужна отдельная проверка сносок, вероятно общий корень note-registry.

## Не дефекты (wave 2)

- «Зацикливание» Tab на `/karty/`, `/karty/pavel/`, `/konfessii/`, `/app/`, `/journal/`, `/map/`, `/about/`, `/biografii/`: это нормальный переход body→начало на коротких страницах (≤25 tabbable). **Не trap**.
- Карточки маршрутов на главной (`.h-home-route`): outline `none`, но есть собственный индикатор `:focus-visible` (inset box-shadow на `__surface`), а reveal-анимация доводит opacity до 1 после scroll-into-view. **False positive** эвристики.

## Сводная рекомендация (волны 1+2)

| ID | Предложение | Owner / поверхность |
|---|---|---|
| **SYS-candidate: speed-control keyboard model** (KBD-01 + KBD-02) | один root — модальный trap + отсутствие `inert` у немодального radiogroup; кандидат в MASTER как `SYS-*` после current-check | `js/floating-cluster-controller.js` |
| KBD-03 | current defect, local | `css/mobile-hotfix.css` |
| VIS-01 | current defect, local | `src/pages/karty/avraam/index.astro` |
| A11Y-06 | current defect + editorial decision | `AntisovetovBody.astro` |
| A11Y-07 | current defect, small; live UNPROVEN | `404.html` |
| A11Y-05 + A11Y-08 | одна triage-волна «token contrast + target size» → потом MASTER или Work Queue | design tokens |
| A11Y-09, fn-marker nesting | owner-check | genealogy / note-registry |
| VIS-02, VIS-03 | selected-for-current-check (CI/live-скриншот) | `/app/`, onboarding toast |
| VIS-04 | owner-decision (иллюстрация) | — |

MASTER по-прежнему **не изменён**. Для admission нужны: (1) current-check на exact Product head перед repair, (2) решение владельца, какие кандидаты принимать. Самые сильные доказательства (W2 source + W4 runtime + механизм) у KBD-01, KBD-03, VIS-01, A11Y-06.
