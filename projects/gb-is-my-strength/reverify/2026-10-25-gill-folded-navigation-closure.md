# GBS — закрытие контракта свёрнутой навигации Gill на current main

Дата: 2026-10-25  
Product anchor: `015573af602dd7b8d49feb296638b3447364a529` (merge Product #2192)  
Результат: **`SYS-GILL-NAV-COLLAPSED-FOCUS-EXPOSURE` = FIXED-CURRENT**  
Компактный receipt: `evidence/2026-10-25-gill-folded-navigation-closure.jsonl`

## 1. Вывод

Три ранее объединённых проявления теперь используют один обратимый контракт свёрнутого состояния:

1. неактивные desktop H3-подгруппы scrollspy;
2. целиком свёрнутое desktop-оглавление текущей части;
3. mobile-аккордеоны частей и вложенных статей книжной серии.

`window.gbSetFolded(region, folded, controller)` добавляет `inert` при закрытии, снимает его при открытии и, если закрываемая область содержала живой фокус, возвращает фокус точному контроллеру или стабильному родительскому заголовку. SSR сразу печатает `inert` на исходно закрытых desktop/mobile областях; динамические владельцы вызывают ту же семантику при scrollspy и пользовательском переключении.

Chromium 153 на собранном exact main подтвердил: свёрнутые потомки не попадают в прямой и обратный Tab, отсутствуют в полном CDP AX tree, открытие возвращает их в AX/Tab, а динамическое scrollspy-закрытие эвакуирует фокус на заголовок группы. Поэтому активная системная строка удаляется: **49 → 48 = 27 дефектов + 4 улучшения + 17 system lanes**.

## 2. Source/history/owner reconciliation

Product #2192 слит именно в проверяемый anchor. Помимо заявленной в PR print-работы он добавил:

- общий `gbSetFolded` в `js/site-utils.js`;
- `gbs2Fold` и вызовы в desktop TOC/scrollspy в `js/floating-cluster-controller.js`;
- исходный `inert` в `GillSeriesRail.astro`;
- исходный и динамический `inert` для `.gbat-subs`/`.gbat-artsecs` в `GillPartTocOverlay.astro`.

Открытый Product #2193 проверен до вывода. Он владеет speed-panel keyboard model и association inline-tooltip, а не Gill-fold contract. Пересечение ограничено общим `floating-cluster-controller.js` и cache-bust-проекциями; это не основание переносить или дублировать владельца.

## 3. Build и проекция

На чистом Product exact head выполнены:

- `npm ci` — exit 0; сохранено исходное предупреждение npm об одной moderate dependency vulnerability;
- `npm run strangler:build` — exit 0;
- Astro check: 0 errors, 6 hints;
- 104 страницы собраны, legacy/projection/cache-bust/heading guards прошли.

Шесть Gill-route проверены в 12 исходных профилях: desktop Light и mobile Dark + reduced motion. На всех закрытые mobile regions имеют `inert`; единственные 8 исходно закрытых desktop-подгрупп на Gill-I также все имеют `inert`. Пропусков `closed/collapsed without inert` — 0, horizontal overflow — 0, broken images — 0.

## 4. Browser closure

### 4.1 Desktop subgroup и scrollspy

На `/articles/dzhon-gill-chast-1-chelovek/`:

- исходно закрыты 8 H3-подгрупп, 8/8 `inert`;
- 80 прямых Tab + 80 Shift+Tab: попаданий внутрь `inert` — 0;
- после настоящего mouse-wheel перехода к дальнейшему разделу scrollspy свернул прежнюю группу;
- фокус ушёл с «Самообразование вне университетской траектории» на стабильный H2 «I. Становление и призвание»;
- активная строка стала «Личные высказывания…», счётчик `13 / 15`, число закрытых областей без `inert` = 0;
- metro-line сохранила вычисляемую геометрию (`414.234375px`).

### 4.2 Desktop whole TOC

Нативное нажатие `#gbsTocToggle` синхронно дало:

- close: `inert=true`, `aria-expanded=false`, focus=`#gbsTocToggle`;
- reopen: `inert=false`, `aria-expanded=true`.

Light-профиль: Axe 0, LCP 476 ms, CLS 0.000147. Dark + reduced-motion контроль: LCP 392 ms, CLS 0.000539, overflow/broken images 0. Найденный там `nested-interactive` относится к уже отдельному владельцу составных карточек/подсказок, а не к folded navigation; он не скрыт как глобальный Axe PASS.

### 4.3 Mobile flat/book

Flat Gill-II (390×844, Dark, reduced motion):

- 5 закрытых part regions, все `inert`;
- 80 Tab + 80 Shift+Tab, попаданий в закрытое содержимое 0;
- закрытие текущей части: `inert=true`, `aria-expanded=false`, focus на `.gbat-hd`;
- повторное открытие снимает `inert`; чужая часть также обратимо открывается.

Book shape на `/baptisty-rossii/yuzhnaya-shtunda/`:

- 4 закрытые главы из 5 имеют `inert`;
- 8 из 9 вложенных article regions исходно закрыты и inert;
- переключение вложенной статьи оставляет одну открытую область и сворачивает остальные;
- прямой/обратный Tab не входит в inert descendants.

Полный Chromium CDP AX tree, в отличие от scoped locator-сериализации, дал 0 совпадений для уникального имени потомка закрытой главы «Петербургское пробуждение»; после открытия текущей статьи её пять разделов присутствуют. Это и есть проверка реального AX exclusion/restoration.

## 5. Regressions и границы

- no-JS mobile-контроль оставляет основной article видимым (36 062 символа) и без overflow. SSR-навигация сохраняет прежнее authored folded состояние; repair не обещает новый no-JS accordion.
- Screenshot controls выполнены локально для desktop Light/Dark, mobile flat/book и no-JS; бинарники в Git не добавлены.
- В локальной среде Yandex Metrics дал `net::ERR_CONNECTION_CLOSED`; HTTP 4xx/5xx не было. Это sandbox delivery noise, не Product console defect.
- Mobile Axe также напомнил о двух независимых остатках: keyboard-scroll у двух `.manuscript-table` на Gill-II и contrast `.gbat-num/.gbat-min` закрытых книжных глав. Они не опровергают Tab/AX closure и не выданы за Axe-zero; contrast относится к действующему batch-владельцу, а table-сигнал требует отдельного bounded reconciliation прежде чем менять арифметику.
- Product не изменялся, PR не сливался и не закрывался.

## 6. Disposition

`SYS-GILL-NAV-COLLAPSED-FOCUS-EXPOSURE` удалён из активной MASTER-матрицы и записан в ledger как `FIXED-CURRENT` на exact main. Старый admission report и raw historical evidence сохраняются как история дефекта; новый receipt является resulting-main closure witness, а не переписыванием прошлого.
