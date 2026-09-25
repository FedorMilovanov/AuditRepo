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

---

# Wave 3 — печать, тёмная тема, перекрытие фиксированной шапкой, расширение KBD-01

Тот же anchor `d0e04a9c`, та же сборка. Скрипты: `evidence/printall.mjs`, `evidence/dark.mjs`, `evidence/under.mjs`, `evidence/trap2.mjs`.

## PRINT-01 — печать скрывает источники, «сообщить об ошибке» и связанные материалы на 48 из 87 маршрутов с контентом — `candidate`, высокая уверенность, **сильнейшая находка аудита**

- **W4:** `emulateMedia('print')` + `beforeprint`, затем сравнение абзацев/`li`, видимых на экране и в печати. Из 87 маршрутов (без карт, app, konfessii, rodosloviye) у **48** появляются абзацы с `display:none !important` через `[data-print-terminal-follower]` (`evidence/print-terminal-follower-87-routes.json`).
  - Все 24 статьи серии «Тайны сердца» + справочник: целиком пропадает `section#istochniki` (Писание, лексика, первоисточники, перевод). 9–14 абзацев на статью.
  - Почти во всех статьях: `aside.gb-accuracy-block` («Богословскую или техническую — напишите, исправим»).
  - Серия «Подросток за кадром» (7 статей): `teen-correction-boundary`, то есть редакционная граница коррекции и контакты.
  - Гилл ч.4: `sec-primary-source-apparatus` (аппарат первоисточников). `/journal/dossiers/g3/`: абзац раздела `finance`. `/hard-texts/genesis-6/`: 14 карточек каталога.
- Наглядно: `evidence/sources-screen.png` (экран) против `evidence/sources-print.png` (печать). Остаются только заголовок «Источники и сверка» и «Soli Deo Gloria ✝».
- **W2:** `js/reader-preferences-head.js`
  - ≈448–477: для «хвоста» (`.article-end-sdg-wrap` и т.п.) ищется `previousSemanticFlow`. Это последний узел с `[data-print-flow]` или **`[data-print-keep-next]`** до хвоста. В «Сердце» это `<h2>Источники и сверка</h2>` (heading помечен keep-next). `createClosingGroup` **переносит h2 и хвост** в новый `div.gb-print-closing-group` сразу за h2.
  - ≈385–400: `markTerminalRegion(группа)` помечает **каждый узел документа, который идёт после группы**, атрибутом `data-print-terminal-follower`. После переноса абзацы источников оказываются после группы.
  - ≈179: `html body [data-print-terminal-follower] { display: none !important; }`.
- **Механизм (W5):** closing-group склеивает хвост не с последним *контентным* блоком, а с последним *помеченным*, то есть с заголовком секции, и выдёргивает его из секции. Всё, что было между этим заголовком и хвостом, объявляется «после терминала» и скрывается. Гарантия «ничего после Soli Deo Gloria» реализована удалением, а не проверкой, что после хвоста ничего нет. `hasMeaningfulFollowingContent` проверяет, что идёт после *хвоста*, но не то, что оказывается после *группы* после переноса.
- **Тестовый пробел:** `scripts/engine-sweep.mjs` ≈612–640 только **считает** `terminalFollowers` и проверяет break-свойства. Скрытие видимого на экране текста не проверяется. Гейт print-stability проходит зелёным.
- **Эффект:** распечатка / «Сохранить как PDF» богословской статьи выходит без раздела источников, при том что `sources:hygiene`, `content:sources:check` и Metadata SSOT требуют этот раздел. Для исследовательского проекта это прямое противоречие замыслу.
- **Граница:** проверено в Chromium. Логика рантайма JS не зависит от движка, поэтому WebKit/Firefox, скорее всего, ведут себя так же, но это не проверено. Кандидат в MASTER как `SYS-PRINT-TERMINAL-REGION` (один root на все 48 маршрутов).

## THEME-01 — хаб `/hard-texts/genesis-6/` в тёмной теме: заголовок и лид почти невидимы — `candidate`, высокая уверенность

- **W4:** при `html.dark` цвет `h1` = `rgb(75,53,36)` (`#4b3524`, светлый токен) на тёмном фоне hero `rgba(30,23,17,.96)`. axe: 59 узлов, минимум 1.36:1 (`evidence/genesis6-hub-dark-mobile.png`).
- **W2:** `css/series-manuscript.css`: тёмные токены `--manuscript-ink*` определены только в `html.dark body[data-series-theme="manuscript"]` (строка 41), а тёмный фон hero задан безусловно через `html.dark .genesis6-hub__hero` (строка 378). У всех 6 статей серии на `<body>` стоит `data-series-theme="manuscript"`, у хаба — только `<body class="genesis6-hub-page">`.
- **Механизм:** на хабе темнеет фон, а цвет текста остаётся светлым. Небольшое исправление: атрибут на body хаба или добавить `.genesis6-hub-page` в селектор тёмных токенов.

## LAYOUT-01 — фиксированная шапка перекрывает хлебные крошки — `candidate`

- **W4** (`elementFromPoint` возвращает шапку в центре крошек), 104×2 маршрута:
  - `/hard-texts/genesis-6/`, desktop и mobile: `header.astro-header.h-navbar` (fixed, 0–58px) поверх `nav.genesis6-hub__breadcrumb` (32–57px); на mobile логотип наезжает на «Главная / Трудные тексты» (`evidence/genesis6-header-breadcrumb-overlap-mobile.png`).
  - Mobile `/articles/lot-i-sodom/`, `/articles/kod-da-vinchi/`, `/articles/hermenevticheskaya-otsenka-…/`: шапка `header.hmtop` (0–62px) закрывает `nav.breadcrumb` («Главная › Статьи › Лот» проступает под полем «Поиск по разделам…», см. `shots/m_articles_lot-i-sodom_.png` из wave 1).
- Два владельца: хаб genesis-6 (свой layout) и общий шаблон `hmtop` (3 статьи). На остальных 98 маршрутах коллизии нет.

## KBD-01 — расширение

Ловушка клавиатуры подтверждена на **всех 5** частях «Нагорной» (`chast-1…5`). На `istochniki/nakhodki/seriya` и в других сериях её нет. Граница — только `NagornayaCompactBottomBar` + `floating-cluster-controller.js`.

## THEME-02 — прочий контраст в тёмной теме (mobile, 20 маршрутов) — `raw`

- 12 из 20 маршрутов чистые (0 нарушений).
- Повторяющийся шаблон: белый текст на `#d4a574` (2.22:1): `#quizLaunch`, `.author-card-icon`, kicker'ы Гилла, `/articles/kod-da-vinchi/` `.ehrman-label/.ctw-sub`. Единый токен «accent-fill + white ink» — кандидат в triage «token contrast» вместе с A11Y-08.
- `/journal/`: `.journal-kicker` `#7a2e2e` на `#131217` (2.0:1). Светлый акцент не переопределён для тёмной темы.
- `/nagornaya/chast-1/`: `#9ca3af` на `#797a7d` (1.69:1) в блоках Tailwind `text-stone-*` (legacy-оверрайды `mobile-hotfix.css`).
- `/izbrannoe/`: `.izbrannoe-cta` `#d4a574` на `#d97a6c` (1.35:1).

## Печать — прочее

- `/articles/20-antisovetov-pastoru/`: FAQ-аккордеон печатается как кнопки `Q1…Q6`. Раскрыты ли ответы, не проверено (**UNPROVEN**).
- `/nagornaya/chast-1/`: в печати видна кнопка «Открыть меню».

## Обновлённая сводка (волны 1–3)

| Приоритет | ID | Класс | Owner |
|---|---|---|---|
| 1 | **PRINT-01** | `SYS-candidate`, 48 маршрутов, контент исчезает | `js/reader-preferences-head.js` + тест `engine-sweep.mjs` |
| 2 | **KBD-01+02** | `SYS-candidate`, WCAG A (ловушка клавиатуры) | `floating-cluster-controller.js` |
| 3 | THEME-01 | local defect | `genesis-6` body / `series-manuscript.css` |
| 3 | KBD-03 | local defect | `css/mobile-hotfix.css` |
| 3 | VIS-01 | local defect | `karty/avraam/index.astro` |
| 3 | A11Y-06 | local + editorial | `AntisovetovBody.astro` |
| 4 | LAYOUT-01 | 2 local owners | genesis-6 hub, шаблон `hmtop` |
| 4 | A11Y-07 | small, live UNPROVEN | `404.html` |
| triage | A11Y-05/08, THEME-02 | token contrast / target size | design tokens |
| owner | A11Y-09, VIS-04 | — | genealogy, иллюстрации |
| check | VIS-02, VIS-03 | CI/live-скриншот | — |

MASTER по-прежнему не изменён.

---

# Wave 4 — независимое подтверждение PRINT-01 по PDF, перекомпоновка 320px (1.4.10) и интервалы текста (1.4.12)

Песочница перезапустилась. Product `main` по-прежнему `d0e04a9c`. Сборка восстановлена с нуля той же цепочкой: `npm ci` → astro build → `strangler:build:production-like` → pagefind, 104 маршрута.

## PRINT-01 — артефактный свидетель (W3): текст реального PDF

`evidence/pdftxt.mjs`: `page.pdf({format:'A4'})` → извлечение текста через pdfjs-dist → поиск фразы, которая видна на экране.

| Маршрут | На экране | В PDF |
|---|---|---|
| `/articles/serdce-i-telo/` — «Рим. 6:12» (источники) | да | **нет** |
| `/articles/tma-na-serdce/` — «Быт. 1:31; 3:16» (источники) | да | **нет** |
| `/articles/dzhon-gill-chast-4-ekzeget/` — «Macritchie» (аппарат первоисточников) | да | **нет** |
| `/articles/podrostok-za-kadrom-dvoynaya-zhizn/` — «Контакты ниже» (граница коррекции) | да | **нет** |
| контроль `/articles/lot-i-sodom/` — «Лота легко» (основной текст) | да | да |

Теперь PRINT-01 подтверждают четыре независимых свидетеля: W2 (исходник), W4 (вычисленные стили в print), W3 (текст PDF-артефакта) и W5 (механизм closing-group → terminal-follower).

## REFLOW-01 — `/app/` на 320px: горизонтальный скролл страницы — `candidate` (SC 1.4.10, AA)

- `scrollWidth` = 327 при viewport 320. Слово «последовательных» в `h2` раздела «Учебный цикл» («Не механический тест, а четыре последовательных действия.») шире колонки, и страница уезжает вбок. При интервалах по 1.4.12 ширина растёт до 410.
- Та же причина, что у VIS-02: крупный display-кегль без `overflow-wrap`/`hyphens` и без `clamp` по ширине. **VIS-02 и REFLOW-01 объединяются в один `/app/ typography` root.**
- Evidence: `evidence/app-reflow-320-overflow.png`.

## REFLOW-02 — главная на 320px: обрезан логотип «Сила Мо|я» — `candidate`

- `a.h-nav-logo`: `scrollWidth` 156 > `clientWidth` 152 при `overflow:hidden`, последняя буква срезана без многоточия. В `mobile-hotfix.css` есть правила только для `max-width:380px/360px` (уменьшение кегля и сжатие тире), на 320 их не хватает. При интервалах 1.4.12 то же самое на `/articles/`, `/hard-texts/`, `/nagornaya/seriya/`, `/pastor-series/` (218 > 208).
- Evidence: `evidence/home-logo-clipped-320.png`.

## Прочее 320px / 1.4.12 (`evidence/reflow-320-and-text-spacing.txt`)

- `/hard-texts/`: метки временной шкалы `.gbs2-tl-era` («Глава III/IV») выходят за край (r=347/447) без scroll-контейнера. Кандидат, нужен скриншот.
- `/baptisty-rossii/`: кнопка `1.75×` за краем, но панель скорости закрыта (w=0). Это часть KBD-02 (невидимые, но интерактивные кнопки), не отдельный дефект.
- `/journal/dossiers/g3/` «Управление»: внутри горизонтального скроллера `.dossier-nav`. **Не дефект.**
- 1.4.12 дополнительно: `/karty/pavel/`, `/karty/maccabim/` (страницы-заглушки «временно не показывается») получают горизонтальный скролл 342–379; `/podrostok-za-kadrom/` карточка серии обрезает текст; `/nagornaya/chast-1/` ссылка на стих `Мф 5:27–30` выходит за край. Пользовательские стили интервалов — `raw`, низкий приоритет.
- Итог: на 320px без изменения интервалов проблемы есть на 5 из 104 маршрутов (2 реальных дефекта + 1 кандидат + 2 уже учтённых/не дефекта).

## Сводка — изменения относительно wave 3

- PRINT-01: доказательная база усилена (4 свидетеля).
- Новый объединённый root **`/app/` hero/section typography** = VIS-02 + REFLOW-01.
- Новый local: REFLOW-02 (логотип на 320).
- MASTER не изменён.

---

# Wave 5 — тёмная тема на всех 104 маршрутах, квиз

Песочница перезапускалась ещё раз. Product `main` = `d0e04a9c`, сборка восстановлена той же цепочкой. Скрипты: `evidence/dark-all.mjs`, `evidence/quiz-dark.mjs`, `evidence/darkshot.mjs`. Данные: `evidence/dark-axe-104-routes.json`, `evidence/quiz-dark-24-routes.txt`.

## QUIZ-01 — в тёмной теме квиз нечитаем: светлый текст на светлой карточке — `candidate`, высокая уверенность, **23 маршрута**

- **W4:** квиз открыт на каждой из 24 страниц с `.quiz-wrapper` (через `#quizLaunch` или inline). Сломан на **23**: фон карточки `rgba(255,253,248,.92)`, текст `rgb(230,225,215)`, контраст около 1.08:1. Это все статьи «Тёмной стороны кафедры», Гилл ч.1–4 + справочник, «Код да Винчи», «Лот», герменевтика, «Диотрефы» и **все 5 частей «Нагорной»**. На `krajne-li-isporcheno-serdce` квиз не открылся (NOTSHOWN), граница не проверена.
- Evidence: `evidence/diotrefy-dark-invisible-text.png`, `evidence/quiz-dark-chast-2.png`, `evidence/quiz-dark-20-antisovetov-pastoru.png`, `evidence/quiz-dark-dzhon-gill-chast-2-uchenyi.png`.
- **W2:** `src/runtime/article-interactions.css:102–110`: `.quiz-wrapper { background: var(--surface, var(--card-bg, rgb(255 253 248 / 92%))) }`. На всех этих страницах ни `--surface`, ни `--card-bg` не определены (computed `""`), поэтому срабатывает светлый fallback. Текст при этом наследует тёмнотемный `--color-text` `#e6e1d7`. Тёмного оверрайда для `.quiz-wrapper` в CSS нет.
- **Механизм (W5):** общий компонент ссылается на токены, которые не входят в канонический набор токенов сайта (`--color-surface` и т.д.). Один root, одна правка в одном файле: взять `--color-surface` или добавить `html.dark` вариант.
- **Предложение:** `SYS-candidate` (общий runtime-компонент × 23 маршрута).

## QUIZ-02 — квиз выводит HTML-разметку как текст — `candidate`, высокая уверенность

- **W4:** `/nagornaya/chast-2/`, вопрос 1: на экране буквально «Что означает термин `<em>concursus</em>` в классическом консервативном богословии?» (видно на `evidence/quiz-dark-chast-2.png`).
- **W2:** `src/runtime/article-quiz.js` ≈103–140: `title.textContent = question.question`, `button.textContent = option`, `shortExplanation/fullExplanation.textContent`. А в данных квизов (JSON в `*PageHead.astro`) есть inline-разметка `<em>`, `<span class=\"…\">`.
- **Охват (W3, статический разбор dist):** поля `question`/`options` с разметкой — 9 страниц, около 20 полей: «Код да Винчи» (4), Гилл ч.2/3/4, герменевтика (2), «Крайне ли испорчено сердце» (3), «Нагорная» ч.2/4/5. Поля объяснений `short`/`full` с разметкой — до 30 (antisovetov, «Нагорная» ч.2/4/5). Это верхняя оценка: часть `short`/`full` может относиться к JSON подсказок, а не квиза.
- **Решение за владельцем:** либо данные — plain text (убрать теги), либо рантайм рендерит ограниченный безопасный набор тегов (`em/strong/span.lang`). Молча включать `innerHTML` нельзя: это CSP/XSS-поверхность.

## THEME-03 — прочий контраст в тёмной теме по всем 104 маршрутам (mobile)

- 59 из 104 маршрутов с нарушениями, у 56 есть узлы <3:1. Сгруппировано:
  - **quiz-launch** `#quizLaunch`: белый на `#d4a574`, 2.22:1, около 20 статей. Токен accent-fill + white (как THEME-02).
  - `/hard-texts/genesis-6/`: 59 узлов, минимум 1.36. Это THEME-01 (хаб без `data-series-theme`), подтверждено и на карточках каталога.
  - `/journal/dossiers/g3/` (58 узлов, 30 из них <3) и `/journal/` (10): kicker/label `#7a2e2e` на `#0e1116`, 2.0:1 (`evidence/g3-dossier-dark-kicker.png`). Светлый акцент журнала не переопределён для тёмной темы. Local owner — журнал.
  - «Нагорная» ч.1–5 (15–42 узла): `#9ca3af` на `#797a7d` (1.69) и `#7c2d12` на `#292524` (1.61) в Tailwind-блоках источников и claim-карточках ч.4 (`evidence/nagornaya-ch4-dark-claim-card.png`). Legacy Tailwind + неполные оверрайды в `mobile-hotfix.css`.
- Во всех 104 случаях тема применилась (`html.dark` = true), отказов переключения нет.

## Обновлённая приоритизация (волны 1–5)

| # | ID | Охват | Owner |
|---|---|---|---|
| 1 | PRINT-01 | 48 маршрутов, пропадает контент (4 свидетеля) | `js/reader-preferences-head.js` |
| 2 | **QUIZ-01** | 23 маршрута, квиз нечитаем в dark | `src/runtime/article-interactions.css` |
| 3 | KBD-01+02 | 5 частей «Нагорной» (trap), статьи | `floating-cluster-controller.js` |
| 4 | QUIZ-02 | 9+ страниц, разметка как текст | `article-quiz.js` + данные квизов (решение владельца) |
| 5 | THEME-01, KBD-03, VIS-01, A11Y-06, REFLOW-02 | local | см. выше |
| 6 | LAYOUT-01, A11Y-07, `/app/` typography (VIS-02+REFLOW-01) | local | см. выше |
| triage | A11Y-05/08, THEME-02/03 | token contrast / target size / журнал / Tailwind «Нагорной» | tokens |

MASTER не изменён.

---

# Wave 6 — функциональный прогон всех квизов (светлая тема)

Скрипт `evidence/quizflow.mjs` проходит каждый квиз до конца (390×844, светлая тема): открыть квиз, выбрать вариант, проверить подсветку верного и обратную связь, нажать «Следующий вопрос», дойти до результата. Данные: `evidence/quiz-flow-light.json`. Диагностика: `evidence/quiz-stuck.mjs`, CDP `CSS.getMatchedStylesForNode`.

## QUIZ-03 — квиз застревает на первом вопросе: кнопка «Следующий вопрос» скрыта — `candidate`, высокая уверенность, **15 маршрутов**

- **W4:** после ответа на вопрос 1 кнопка `.quiz-next` есть в DOM, но имеет `display:none` (rect 0×0). Пройти дальше вопроса 1 невозможно ни мышью, ни клавиатурой, результат недостижим. Evidence: `evidence/quiz-stuck-gill-1.png`.
- **Маршруты (15):** 20-antisovetov-pastoru, anatomiya-padeniya-pyat-stadiy, cerkovnaya-disciplina…, dzhon-gill-chast-1/2/3/4, dzhon-gill-spravochnik, kogda-uhodit-kogda-ostavatsya, krajne-li-isporcheno-serdce, nesovershennyy-chelovek…, priznaki-zdorovoy-cerkvi, sem-tipov…, teksty-pisaniya…, vernye-i-neizvestnye…. Работают до конца: kod-da-vinchi (10), hermenevticheskaya (10), lot-i-sodom (8), nagornaya 1–5.
- **W2 (CDP):** единственное совпавшее правило для `display` — `css/floating-cluster.css:4062`: `[data-gill-v16] .quiz-next { display:none; … }` + `:4072 [data-gill-v16] .quiz-next.is-visible { display:block }`. `src/runtime/article-quiz.js` (≈152–159) создаёт `.quiz-next` без класса `is-visible` и не добавляет его нигде (`grep is-visible` = 0). Атрибут `data-gill-v16` стоит на всех затронутых страницах. Работающие страницы его не имеют: gbs-paper и nagornaya.
- **Сопутствующий рассинхрон** в том же блоке CSS: `.quiz-option.is-wrong`, а рантайм ставит `.is-incorrect`. Стиль неверного ответа из legacy-блока не применяется.
- **W5:** классический «legacy CSS контракт vs новый runtime». Старый скрипт квиза, видимо, добавлял `is-visible`; после миграции на `article-quiz.js` CSS остался. Один root, два файла. Fix: убрать legacy-блок `[data-gill-v16] .quiz-*` или добавлять `is-visible` в рантайме. Regression-тест: e2e «пройти квиз до результата» на одной странице с `data-gill-v16`.
- **Масштаб контента:** в JSON этих 15 страниц 118 ключей `"question"` (часть может дублироваться). Для читателя доступен только первый вопрос каждой страницы.
- **Предложение:** `SYS-candidate`, приоритет выше QUIZ-01: квиз сломан и в светлой, и в тёмной теме. В сочетании с QUIZ-01 на тех же 15 страницах в dark пользователь не видит даже первый вопрос.
- **Почему пропущено репо-гейтами (гипотеза):** проверки квиза, судя по названиям, статические (наличие данных/разметки). Клик-проход до результата не обнаружен. Не проверялось полностью: `UNPROVEN`.

## QUIZ-04 — «Нагорная»: итог квиза без оценки, только «1 из 3» — `candidate`, средняя уверенность

- **W4:** на всех 5 частях экран результата показывает в заголовке запасной вариант `${score} из ${n}` (`article-quiz.js:68`: `result.title || …`), текст `.quiz-result-copy` пуст. У статей gbs-paper заголовки есть («Агент Лэнгдона», «Нужно перечитать», «Начало положено»).
- Скорее всего, в конфигах квизов «Нагорной» нет таблицы результатов. Это неравенство опыта, а не поломка. Решение владельца: добавить `results` или принять.

## QUIZ-02 — подтверждено в рантайме

Прогон увидел буквальные `<em>`/`<span` в тексте квиза: kod-da-vinchi q2/3/4/6, gill 2/3/4 q1, krajne q1, 20-antisovetov q1, nagornaya ч.2 q1–2, ч.4 q1/3/5, ч.5 q2. На застрявших страницах проверен только q1, поэтому охват там — нижняя граница.

## Проверено без замечаний

- Фокус после ответа корректно переходит на «Следующий вопрос» (там, где он видим). У панели есть live-region.
- Мёртвых `sourceRef`-якорей в обратной связи не найдено (в пределах пройденных вопросов).
- `pageerror` при прохождении — 0.
- diotrefy использует `<details>`-квиз из 10 вопросов, раскрывается нормально (`evidence/diotrefy-quiz-light.png`).

## Приоритеты после волны 6

1. PRINT-01
2. **QUIZ-03** (15 страниц, квиз непроходим)
3. QUIZ-01
4. KBD-01/02
5. QUIZ-02
6. остальное без изменений

MASTER не изменён.

---

# Wave 7 — поиск end-to-end

Скрипты: `evidence/search.mjs` (mobile 390 и desktop 1366, главная), `evidence/artsearch.mjs` (точки входа в поиск на типах страниц), `evidence/lotsearch.mjs`. Текстовый лог не сохранён (скрипт упал на финальной записи после всех проверок); результаты зафиксированы ниже. Скриншоты: `evidence/search-mobile.png`, `evidence/search-desktop.png`, `evidence/search-lot-article-local.png`.

## Работает (проверено)

- Главная, mobile и desktop: кнопка `.gb-nav-search-icon` открывает палитру, фокус сразу в поле.
- Запросы «Гилл», «сердце», «Нагорная проповедь», «бытие 6» дают 10–12 релевантных результатов.
- `ArrowDown`+`Enter` переходит на страницу результата.
- `Ctrl+K` открывает поиск. После `Esc` фокус возвращается на кнопку-триггер: хорошо.
- `pageerror` = 0.

## SEARCH-01 — в «Нагорной» на мобильном нет входа в глобальный поиск — `candidate`, средняя уверенность

- **W4:** `/nagornaya/chast-1/` (390px): на странице нет ни одного видимого элемента поиска. В открытом меню («Открыть меню») тоже нет поля/кнопки/ссылки поиска. Для сравнения, `/hard-texts/genesis-6/` и `/journal/` показывают `.gb-nav-search-icon` / `.mcp-search`.
- На статьях `lot-i-sodom` и Гилла глобальная кнопка `button.gb-icon[aria-label=Поиск]` есть в DOM, но скрыта. Видим только локальный «Поиск по разделам…» (`#hmTocSearch`, ищет по оглавлению: «Гилл» → «Ничего не найдено», это ожидаемо).
- Local owner: shell «Нагорной» и мобильный header статей. Нужно решение владельца, задумано ли, что глобальный поиск на мобильных статьях доступен только через скрытую кнопку (возможно, в другом листе). Проверено не на всех статьях: `UNPROVEN` для охвата.

## SEARCH-02 — бессмысленный запрос даёт результаты — `candidate`, low

- `qwxz` → 3 результата: совпадение по «Q» (гипотеза Q, «Можно ли доверять Евангелиям?»). Это поведение Pagefind (префикс/стемминг), не баг кода. Ухудшает сигнал «ничего не найдено». Triage only.

## Дубль — не новая находка

- Результат «Гилл» → `/articles/dzhon-gill-chast-4-ekzeget/` с заголовком «Часть III: Экзегет», а `chast-3-nasledie` называется «Часть IV». Уже учтено в `WORK_QUEUE.md:145` как `GILL-SLUG-NUMBERING-LEGACY` (осознанно принято, требует 301). В поисковой выдаче это заметно пользователю, но решение владельца уже есть.

## Не баг (артефакт окружения)

- Console CSP: `img-src` блокирует `https://gospod-bog.ru/favicon*.png`. Иконки заданы абсолютными URL продакшн-хоста. На `gospod-bog.ru` это `'self'`, на локальном `127.0.0.1` — чужой origin. В проде не воспроизводится (live-сайт недоступен из песочницы, `UNPROVEN`).

MASTER не изменён.

---

# Wave 8 — reduced-motion, избранное, шапка на планшете

Песочница сбросилась в третий раз. Product `main` = `d0e04a9c` пересобран той же цепочкой (`npm ci` → `strangler:build:production-like` → `pagefind:build:dist`, все гейты сборки зелёные), 104 маршрута из `dist/`.

## HDR-01 — на планшете (768px) шапка выталкивает поиск и переключатель темы за экран — `candidate`, высокая уверенность

- **W4:** 768×800, скан всех 104 маршрутов (`evidence/header-overflow.mjs` → `evidence/header-overflow-104x3.json`). Элементы шапки с `right > innerWidth` на **7 маршрутах**:
  - `/`: «Карты»@782, «Каталог»@857, «Поиск по всему сайту»@925, «Переключить тему»@957
  - `/izbrannoe/`: «Избранное»@804, «Поиск»@848, «Тема»@880
  - `/articles/`, `/biografii/`, `/pastor-series/`: поиск и тема
  - `/hard-texts/`, `/nagornaya/seriya/`: тема
- `html{overflow-x:clip}` прячет переполнение (`scrollWidth` в норме), поэтому контролы просто **недоступны для нажатия**, а горизонтальной прокрутки нет.
- Визуально: главная обрезает пункт меню на «КАРТ…» (`evidence/home-768-header-overflow.png`).
- На 320px то же на `/biografii/` и `/izbrannoe/` (кнопка темы @356, «Открыть меню»). На 390px — 0.
- **W5:** десктопная навигация шапки включается раньше, чем в неё помещается полный набор пунктов. Брейкпоинт или сворачивание пунктов нужно подстроить под диапазон 768–~960px. Local owner — компонент шапки хабов (`astro-header` / home nav). Предложение: `LOCAL-candidate`, приоритет высокий для планшетов (iPad portrait = 768/810/820).
- Не проверено: 810/820/1024. Граница диапазона — `UNPROVEN`.

## MOTION-01 — `scroll-behavior:smooth` игнорирует `prefers-reduced-motion` — `candidate`, средняя уверенность

- **W4:** `reducedMotion:'reduce'`, 104 маршрута (`evidence/reduced-motion.mjs` → `evidence/reduced-motion-104.json`). `getComputedStyle(html).scrollBehavior === 'smooth'` на **81** маршруте.
- **W2:** `css/site.css` (строка 2 и в `@layer`): `html{scroll-behavior:smooth}` без `@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`. Для сравнения, `_astro/index.Bgg_omAc.css` и `GenealogyTree.css` такой guard имеют, то есть в репо это непоследовательность.
- Эффект: прыжки по оглавлению и якорям анимируются у пользователей с вестибулярными нарушениями (WCAG 2.3.3 AAA, но это системная настройка ОС, которую сайт в других местах уважает).
- Fix: одна строка в `css/site.css`. Проверить также JS `scrollIntoView({behavior:'smooth'})`: не сканировалось, `UNPROVEN`.

## MOTION-02 — `/konfessii/russkij-baptizm/_app/` анимирует всё при reduced-motion — `candidate`, средняя уверенность

- **W4:** при `reduce` идут 7 WAAPI-анимаций входа (620–950 мс) на h1, подзаголовках, сетке и **бесконечная** пульсация 2600 мс на `DIV.absolute inset-0 -z-10 rounded-full blur`.
- **W2:** в бандле есть CSS-guard `prefers-reduced-motion:reduce{*{animation-duration:.001ms!important…}}`, но анимации идут через framer-motion (WAAPI/JS: `reducedMotionConfig`, `useReducedMotion` в бандле), и CSS их не касается. `MotionConfig reducedMotion="user"` по результату не действует.
- Local owner — встроенное приложение «Русский баптизм».

## Избранное — работает (проверено)

- Статья → `button[aria-label="Добавить в Избранное"][aria-pressed=false]` → клик → `aria-pressed=true`, «Убрать из Избранного», live-toast «Добавлено в Избранное», запись `gb-favorites` в localStorage. Проверено на lot-i-sodom, Гилл ч.1, «Нагорная» ч.1.
- `/izbrannoe/` показывает «3 статьи», «Убрать» удаляет карточку. `pageerror` = 0. Evidence: `evidence/favorites.mjs`, `evidence/favorites-e2e.json`, `evidence/izbrannoe-after-4-saves.png`.
- На хабе `/hard-texts/genesis-6/` кнопка «Избранное» — это ссылка на страницу избранного, не переключатель. Хаб не добавить в избранное; похоже на задумку, triage.

## Не баг локально — пустые обложки в /izbrannoe/

- Карточки рендерят `izbrannoe-card__img--empty` (градиент). Причина: `src/runtime/favorite-store.js:41–52` `normalizeImage` отбрасывает картинку с другого origin, а `og:image` абсолютный на `https://gospod-bog.ru/…`, т.е. на `127.0.0.1` это чужой origin. На проде совпадёт.
- **Остаток:** у `/articles/dzhon-gill-chast-1-chelovek/` `og:image` пустой (проверено в dist), так что его карточка будет пустой и на проде. Low, triage. Зеркала вроде `www.` / github.io тоже дадут пустые обложки: `UNPROVEN`.

## Приоритеты после волны 8

1. PRINT-01
2. QUIZ-03
3. QUIZ-01
4. KBD-01/02
5. **HDR-01**
6. QUIZ-02
7. MOTION-01/02 и остальное local

MASTER не изменён.

---

# Wave 9 — границы HDR-01, озвучка и «Поделиться»

## HDR-01 — уточнение: затронуты iPad portrait и телефоны в landscape

- **W4:** 10 хабов × 11 размеров (`evidence/header-overflow-widths.mjs` → `evidence/header-overflow-widths.json`). Маршрутов с контролами шапки за правым краем:

| viewport | маршрутов | где |
|---|---|---|
| 800×900 / 810×1080 (iPad 10.2) / 820×1180 (iPad Air) | 5 | `/`, `/articles/`, `/biografii/`, `/izbrannoe/`, `/pastor-series/` |
| 853×1280 | 2 | `/`, `/izbrannoe/` |
| 912×1368, 960×900 | 1 | `/` |
| 1024 и шире | 0 | — |
| **844×390** (iPhone landscape) | 2 | `/`, `/izbrannoe/` |
| **932×430** (iPhone Pro Max landscape) | 1 | `/` |

- Скриншоты: `evidence/home-820x1180-header.png`, `evidence/home-844x390-header.png`. «КАТА…» обрезано, «Каталог», поиск и тема за экраном.
- **W2 (root главной):** `css/home.css`: `@media (max-width:760px){.h-navbar .h-nav-links{display:none!important}}`, а для `761–1100px` только `gap:12px; font-size:12px`. Семь пунктов + три иконки не помещаются примерно до 1000px, сворачивания нет.
- Остальные хабы (`/articles/`, `/biografii/`, `/izbrannoe/`, `/pastor-series/`) используют другой header (`astro-header`) с тем же классом дефекта. Их local owner и брейкпоинт в этой волне не локализованы: `UNPROVEN`.

## TTS-01 — ряд скоростей озвучки обрезан без подсказки прокрутки — `candidate`, low/medium

- **W4:** `/articles/lot-i-sodom/`, запуск «Озвучка» (`evidence/tts-speed-bar.mjs`, `evidence/tts-speed-bar-320.png`, `evidence/tts-lot-i-sodom.png`). Ряд `1× 1.25× 1.5× 1.75× 2×` в шапке — контейнер с `overflow-x:auto`:
  - 320px: «1.75×» обрезан до «1.7», «2×» скрыт за кнопкой «Пауза»;
  - 360–390px: «2×» скрыт.
  Маски, стрелки или fade-края нет, так что пользователь не знает, что скорость 2× существует.
- Родственно KBD-01/02 (тот же speed-radiogroup в `js/floating-cluster-controller.js`), при фиксе стоит учитывать вместе.

## TTS/Share — работает (проверено)

- «Озвучка» запускает `speechSynthesis` (перехвачен `speak`), появляется «Пауза»/«Остановить озвучку». `pageerror` = 0 на 4 статьях (`evidence/tts-share.mjs`, `evidence/tts-share.txt`).
- Уведомление «Улучшенный голос не запустился / Системный голос продолжает работать / Повторить» — корректный fallback в офлайн-песочнице, не баг.
- «Поделиться» вызывает `navigator.share` с корректным URL.

## SHARE-01 — непоследовательные данные share — `candidate`, low

- `title`: на статьях короткий («Лот: праведник у ворот Содома», «20 антисоветов пастору»), на «Нагорной» — полный `<title>` с суффиксом сайта «… — Нагорная проповедь I | Господь Бог — Сила Моя».
- `text`: пуст у lot-i-sodom и 20-antisovetov, заполнен у Гилла, отсутствует у «Нагорной». Косметика: одна точка сборки share-payload стоит того, чтобы её унифицировать.

## TTS-02 — озвучка начинается с кикера, а не с заголовка — observation, low

- Первая реплика: «Экзегеза · Бытие 13–19» (lot), «Серия «Джон Гилл» · Часть I» (Гилл), а не h1. У «Нагорной» и antisovetov начинается с заголовка. Решение владельца: озвучивать ли метаданные.

## Артефакт окружения — не находка

- Перед временем чтения стоит эмодзи `⏱` (U+23F1) в byline, 49 страниц. В песочнице без emoji-шрифта это «тофу». На реальных устройствах, вероятно, отрисуется. Стилистически это единственный эмодзи среди SVG-иконок шапки: `observation`.

MASTER не изменён.
