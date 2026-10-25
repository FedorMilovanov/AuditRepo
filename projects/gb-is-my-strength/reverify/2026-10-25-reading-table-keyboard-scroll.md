# GBS — системный контракт keyboard-scroll для читательских таблиц

Дата: 2026-10-25  
Product anchor: `015573af602dd7b8d49feb296638b3447364a529`  
Disposition: **admit `SYS-READING-TABLE-KEYBOARD-SCROLL`**  
Evidence: `evidence/2026-10-25-reading-table-keyboard-scroll.jsonl`

## 1. Вывод

Это не новый одиночный дефект двух таблиц Gill-II. Текущая проверка восстановила предложенный, но так и не канонизированный в июле 2026 общий root `READING-TABLE-KEYBOARD-SCROLL`.

Три разных производителя создают один и тот же разрыв:

1. Gill `table.manuscript-table` сам становится `overflow-x:auto`;
2. Gill-context прокручивает authored `.table-scroll` вокруг `compare-table`;
3. Nagornaya прокручивает `.overflow-x-auto` вокруг `min-w-96` таблиц.

Во всех случаях pointer/touch может двигать локальную область, но авторский DOM не задаёт устойчивого focus/name/keyboard контракта. Результат зависит от эвристики браузера: Chromium 153 иногда автоматически включает `tabIndex=-1` scroll container в последовательность, иногда нет; даже при попадании ArrowRight не всегда сдвигает область. Axe 4.14 справедливо продолжает отмечать отсутствие авторского focus owner.

Строка принимается как **один system lane**, а не как таблица×маршрут. Матрица: **48 → 49 = 27 direct + 4 improvements + 18 system lanes**.

## 2. История и отсутствие владельца

Пакеты 2026-07-17 уже зафиксировали:

- `GILL-MOBILE-TABLE-KEYBOARD-SCROLL`: 9 Gill-таблиц на четырёх маршрутах;
- `NAGORNAYA-MOBILE-TABLE-KEYBOARD-SCROLL`: 5 областей на трёх маршрутах;
- verifier proposal: объединить их под `READING-TABLE-KEYBOARD-SCROLL`.

Предложение осталось во входящих материалах и не вошло в MASTER/ledger. Последующего closure witness для общего root нет.

Текущие Product PR #2193, #2179, #2164 и #2143 проверены. #2193 касается speed-panel keyboard model и tooltip association; его многочисленные head/cache-bust изменения пересекают файлы проекции, но не владеют таблицами или условным scroll-region primitive. Параллельный table repair не заявлен.

## 3. Source contract

- `css/site.css`: универсальное `article table { display:block; overflow-x:auto }` создаёт потенциальный scroll owner на самом `<table>`, не добавляя ни имени, ни явной фокусируемости, ни focus-visible.
- `GillSeriesResponsiveStyles.astro`: повторяет scroll ownership на `table.manuscript-table`.
- Gill-context вручную печатает семь `.table-scroll`; у них нет `tabindex`, `role`, имени или keyboard owner.
- Nagornaya печатает `.overflow-x-auto`; при `≤359px` часть таблиц перестраивается и перестаёт переполняться, но на 390 px реальные scroll regions остаются без контракта.
- В кодовой базе есть правильный локальный контрпример: `.ng-observation-matrix__scroll` имеет `tabindex=0`, `role=region`, осмысленное имя и `:focus-visible`. Это не закрывает соседние generic wrappers.

В старом собранном `site.js` присутствует попытка оборачивать `.manuscript-table` в `.table-scroll[tabindex=0]`, но на текущих Astro Gill pages реальным scroll owner остаётся сама таблица. Даже там, где wrapper существует, фокус wrapper без передачи scroll ownership не гарантирует панорамирование дочерней таблицы. Следовательно, «рядом есть focusable div» не является closure.

## 4. Current-main browser census

Production-like build + Pagefind прошли: 104 страницы, 95 search pages, Astro 0 errors / 6 hints. Из итогового dist выделены все 15 маршрутов с таблицами. Chromium 153 проверил их в 45 профилях:

| Ширина | Реальные локальные X-scroll regions | Axe serious `scrollable-region-focusable` | Page overflow | Broken images / page errors |
|---:|---:|---:|---:|---:|
| 320 | 19 | 18 | 0 | 0 / 0 |
| 390 | 22 | 20 | 0 | 0 / 0 |
| 641 | 9 | 1 | 0 | 0 / 0 |

Это локальная клавиатурная недоступность, а не глобальный viewport-overflow.

### 390 px — основные текущие свидетели

- Gill-I: 1 region, Axe 1, 0 native Tab hits после 1200 переходов.
- Gill-II: 2 regions, Axe 2, 0/1200 Tab hits; настоящий horizontal wheel сдвигает первую таблицу `0→157px`.
- Gill-IV/Nasledie route: region автоматически получил фокус Chromium, но ArrowRight оставил `scrollLeft 0→0`.
- Gill context: 7 authored wrappers, Axe 7, 0 native Tab hits.
- Gill reference: 5 regions; Chromium 153 автоматически фокусирует и двигает их, хотя DOM сообщает `tabIndex=-1` и Axe даёт 5 нарушений. Это важная граница: UA-эвристика одного движка не является авторским или WebKit-контрактом.
- Nagornaya-I: 3 generic unowned regions; native Tab hits 0, настоящий horizontal wheel `0→26px`. Именованная observation matrix — отдельный здоровый контроль.
- Nagornaya-III и IV: по одной unowned region, Axe 1 и native Tab hits 0 на каждой.

Скриншоты Gill-II и Nagornaya-I сохранены локально, в Git бинарники не добавлены. Dark/reduced mobile health: Gill LCP 324 ms / CLS 0.097922; Nagornaya LCP 224 ms / CLS 0; overflow, broken images и page errors — 0. CLS Gill записан как наблюдение, но не приписан таблицам без отдельной причинной проверки.

## 5. Границы и дедупликация

- Контент таблиц присутствует и доступен pointer/touch; не заявляется потеря текста.
- Не каждая таблица переполняется на каждой ширине. Постоянный `tabindex=0` на всех таблицах создаст лишние остановки и не является желательным исправлением.
- Закрытый `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL` не переоткрывается: у timeline уже есть именованный, focus-visible 641px owner, а на `≤640px` контент перестраивается без X-overflow.
- `.ng-observation-matrix__scroll` также остаётся положительным контролем, а не дефектом.
- Axe count — повторные проекции, не 39 отдельных work units.
- Chromium auto-focus поведения недостаточно для заявления о WebKit; историческое требование WebKit остаётся acceptance boundary, а не выдуманным текущим PASS.

## 6. Условия закрытия

Нужен один общий conditional overflow primitive с декларативными вызовами владельцев:

1. только фактически переполняющаяся область получает focus stop;
2. focus owner совпадает с реальным scroll owner либо явно передаёт ему keyboard pan;
3. область имеет осмысленное доступное имя и видимый `:focus-visible`;
4. native Tab/Shift+Tab достигает её, Arrow/Home/End сдвигают содержимое;
5. resize/reflow обратимо снимает лишний focus stop, не стирая authored attributes;
6. browser contract покрывает Gill manuscript/context, Nagornaya wrappers и generic article-table producer, включая Chromium и WebKit;
7. pointer/touch, print и no-JS читаемость не регрессируют.

Product в этом проходе не изменялся.
