# Широкая волна 13: owners взаимодействий и семантический вывод

Дата: **2026-10-28**
Product: exact `1a67c65cf2a30b06200480b7245abab873447a47` = `origin/main`, чистое дерево, открытых Product PR нет.
Область: семь уже принятых строк; новые строки не создавались.
Машинный receipt: `evidence/2026-10-28-interaction-semantic-wide-refresh.jsonl`.

## Итог

Одна прямая строка закрыта на current main:

- `GBS-INLINE-TOOLTIP-DEFINITION-ASSOCIATION` → **FIXED-CURRENT**.

Шесть системных строк сохранены без дублирования:

- `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY`;
- `SYS-FAQ-STRUCTURED-DATA-ANSWER-PARITY`;
- `SYS-FAQ-COLLAPSED-FOCUS-EXPOSURE`;
- `SYS-READING-TABLE-KEYBOARD-SCROLL`;
- `SYS-STRATEGIC-MAP-DIALOG-FOCUS-ENTRY`;
- `SYS-REVERSIBLE-CARD-DESCENDANT-ACTIVATION-COLLISION`.

Арифметика: **63 → 62 active**, direct **37 → 36**; остальные категории неизменны: `62 = 36 + 7 + 1 + 18`.

## 1. Единственный owner подсказок и геометрия

Полный production-like census нашёл 23 маршрута с `.gterm/.fn-marker/.bref`. Для desktop/mobile получено 46 профилей:

- `GBArticleTooltips.version === 20`: 46/46;
- legacy-контроллеров для owned-селекторов: 0;
- popup открылся естественным pointer/tap: 46/46;
- popup помещён в viewport: 46/46;
- page errors: 0;
- закрытых, но не inert payload: 0.

Это сохраняет repaired boundary shared owner. Строка `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY` остаётся активной: current census не опровергает уже воспроизведённый portal-focus цикл полного native Tab-порядка.

## 2. Закрытие связи trigger ↔ definition

Исправление пришло в Product commit `571ee693cf` (`fix(tooltips): associate opened inline definitions with their triggers`). На exact current main проверены 390/1280 × Light/Dark:

- keyed `.gterm`;
- keyless `.gterm`;
- `.bref`;
- сохранённый footnote control.

Все 16/16 образцов после естественного открытия имеют отношение к popup и непустое computed AX description. Для glossary/reference динамически выставляется `aria-describedby=gb-tip-1`; footnote сохраняет `aria-controls` и relation. Ранний отрицательный exploratory результат был ошибкой выбора другого AX node и не является evidence.

Closure-health для keyed witness: четыре screenshots вне Git, mobile/desktop и обе схемы; broken images 0, page errors 0, console errors 0, LCP 432–556 ms. Axe association не выдаёт нарушения; один общий dark contrast signal и наблюдаемый layout-shift принадлежат уже существующим contrast/capacity boundaries и не опровергают relation. Поэтому прямая строка удалена из active matrix, без требования уравнять разные авторские briefs. Исторический alias `GBS-GLOSSARY-DEFINITION-PROVENANCE` переведён из alias в retired receipt: после закрытия canonical target он не должен указывать на неизвестный active ID.

## 3. FAQ: enhanced state, no-JS и schema parity

Полная матрица 4 маршрута × 390/1280 × Light/Dark × reduced/normal:

- 168/168 изначально закрытых answer bodies имеют `inert`;
- 168/168 имеют нулевую rendered height;
- естественное открытие возвращает положительную высоту и снимает `inert`: 32/32;
- закрытие снова даёт inert + нулевую высоту: 32/32;
- focus возвращается точному вопросу: 32/32.

No-JS residual сохраняется: 8/8 route/viewport probes оставляют текст в DOM, но `height=0` и `scrollHeight=0`; readable 0/8. Поэтому `SYS-FAQ-COLLAPSED-FOCUS-EXPOSURE` не закрыт.

Block-aware serialization устранил ложные склейки соседних блоков. Итог DOM↔`FAQPage.acceptedAnswer.text`:

- Hermenevtika 3/3;
- Kod Da Vinci 8/8;
- Krajne 3/3;
- Antisovetov 6/7;
- всего 20/21.

Единственный настоящий mismatch — Antisovetov Q1: schema по-прежнему теряет заключительное предложение и содержит отличающийся brief «Практический тест». `SYS-FAQ-STRUCTURED-DATA-ANSWER-PARITY` остаётся активной.

## 4. Табличные overflow-регионы

Census всех 105 сгенерированных index-маршрутов при 390/1440 дал:

- 22 настоящих mobile overflow-региона;
- восемь маршрутов;
- только два региона с `tabindex=0`;
- Axe `scrollable-region-focusable`: 18 nodes.

Отдельный probe Nagornaya I подтвердил реальную видимую геометрию всех четырёх wrappers: 22 — текущий corpus, а не hidden duplicate. Полный 700-Tab прогон блокируется более ранней tooltip topology и не использован как ложное доказательство отсутствия authored tabindex. `SYS-READING-TABLE-KEYBOARD-SCROLL` остаётся активной; счётчики уточнены с 21/20 до 22/18.

## 5. Strategic map

Desktop Light/Dark сохраняет ранее доказанные 78/78 pointer+keyboard open → named close focus → Escape exact return.

Исправленный mobile probe сначала естественно прокручивает trigger и не считает offscreen geometry отсутствием. Результат в каждой схеме:

- 39 trigger nodes;
- 36 `.fn-marker.map-trigger` имеют zero-size own box;
- три plain `.map-trigger` (`42`, `43`, `19`) имеют положительную геометрию;
- эти три естественно открывают dialog, вводят focus и возвращают opener: 3/3;
- forced clicks/programmatic focus: 0.

Следовательно, repaired dialog-entry owner сохраняется, но mobile hit/focus boundary не закрыт. `SYS-STRATEGIC-MAP-DIALOG-FOCUS-ENTRY` остаётся активной.

## 6. Reversible cards

Полный селектор `.flip-card,.error-flip-card,.heart-flip-card` подтверждает 17 cards на четырёх маршрутах. Gill III содержит четыре cards и три projected heading links внутри role-button hosts. При 1440px (где ссылки действительно видимы) × Light/Dark × reduced/normal:

- native descendant actions без ancestor flip: 12/12;
- interactive descendants: три на профиль;
- Axe `nested-interactive`: 12 nodes суммарно.

Event collision исправлен, structural composition — нет. Скрытие ссылок при 1280/mobile не считается решением. Системная строка остаётся активной.

## 7. Контракты и красные проверки

PASS:

- article capability owner contract;
- FAQ JSON-LD text contract;
- tooltip icon audit: 380 markers, 0 invalid;
- tooltip trigger/style normalizers;
- effective native article audit: 67 routes;
- capability browser contract: 5 Chromium cases, включая bounded hanging-clipboard fallback.

WebKit: `skipped: sandbox engine`; Chromium evidence обязательно и получено.

Строгий `article-native-contract-audit.js` остаётся **pre-existing red**: 46 current native routes отсутствуют в `route-migration-matrix`. Effective audit проходит с 47 warnings. Это не исправлялось в audit wave и не превращено в дубль текущего content-authoring/publication boundary.

Первый параллельный запуск browser contract попал в `dist:clean` соседнего native audit и дал transient `route did not load`; последовательный rerun на завершённом exact build прошёл. Это orchestration race evidence, не Product defect.

## Решение

Широкая волна **13** завершена: одна stale direct строка закрыта по exact-main AX evidence, шесть shared-system строк честно сохранены и уточнены. Product не изменялся; Product PR не создавался.
