# Net-new bugs NOT in unified ledger + PS-01 third-method corroboration — 2026-06-25

**Agent:** `arena-agent-verifier-2`
**Method:** source scan of fresh clone @ HEAD `fb8e4922` + real jsdom execution of shipped JS.
**Intent:** дополнение, не перезапись. Unified ledger и чужие отчёты не трогаю.

После чтения всего `incoming/` + `verified/UNIFIED_BUG_LEDGER` + `verification/arena-agent-2-corrections` я НЕ дублирую уже найденное. Здесь только:
1. Третья независимая проверка PS-01 (совпадает с arena-agent-2);
2. Подтверждение, что P0-2 (empty css) = false positive (совпадает с arena-agent-2);
3. **Четыре бага, которых нет ни в unified ledger, ни в чужих отчётах.**

---

## 0. Corroboration (совпадает с уже принятым — для веса голосов)

- **PS-01 / CR-FCC-01 `qs is not defined`** — подтверждаю **третьим методом** (jsdom, реальный shipped `?v=35a91710`):
  ```
  ReferenceError: qs is not defined at initTocPopups(...:397) at Document.eval(...:348)
  theme click → html class не меняется; window.__gbCluster === undefined
  ```
  Согласен с arena-agent-2: это **лексический scope-дефект** (функции вне IIFE), НЕ load-order. Фикс = перенести `initTocPopups`/`initActionHandlers`/`initPlayExpand` внутрь IIFE. Blast radius — **23 страницы** (8 articles + 5 nagornaya + 10 baptisty), не 13.
- **P0-2 `floating-cluster.css` empty** — подтверждаю как **FALSE POSITIVE**: файл 1869 строк / 68596 байт / 374+ селекторов. Поддерживаю downgrade→CLOSED.

---

## 1. NEW V2-1 (P1) — TOC ↔ body anchor mismatch на Gill part 1 и part 3
Не зависит от JS (то есть НЕ маскируется PS-01). Клик по пункту оглавления не скроллит.

**gill-part1** (`src/components/article-pilots/gill-part1/GillPart1PageChrome.astro` → `articles/dzhon-gill-chast-1-chelovek/`):
- TOC `href="#sec-early-years"` → нет такого id (есть `#part-calling`);
- TOC `href="#sec-gill-spirituality"` → нет вообще.

**gill-part3** (`articles/dzhon-gill-chast-3-nasledie/`) — 5 битых:
`#sec-legacy-main` (есть `part-legacy`/`sec-legacy`), `#sec-rome-proverbs`, `#sec-wesley`, `#sec-coffee-house-polity`, `#sec-evaluations-map`.

Метод: для каждого `href="#x"` нет ни `id="x"`, ни `name="x"`. Воспроизводится и в root HTML, и в src-chrome (TOC хардкожен в `*PageChrome.astro`).

---

## 2. NEW V2-2 (P1) — Кнопки размера шрифта A−/A+ в сайдбаре Нагорной мертвы (5 страниц)
Рассинхрон селекторов, НЕ связан с PS-01.
- Разметка (`Nagornaya*PageChrome.astro`): `<button id="nagFontDec" class="nag-fontsize-btn">A−</button>` / `id="nagFontInc"`.
- Обработчик (`js/nagornaya-mobile-toc.js`): слушает `[data-fontsize="down"], .nag-fontsize-down` и `[data-fontsize="up"], .nag-fontsize-up`.
- В проекте нет ни одного элемента с `data-fontsize`/`.nag-fontsize-down`/`.nag-fontsize-up`/`.btoc-fontsize-dot` → кнопки +/- не привязаны. Применение размера `l()` отрабатывает один раз на загрузке (восстановление сохранённого), но изменить нельзя.
- Затрагивает: `nagornaya/chast-1..5`.

---

## 3. NEW V2-3 (P1, a11y) — Битый skip-link на карте Авраама
`karty/avraam/index.html`: первый элемент `<a href="#svg-map" class="avraam-skip">Перейти к карте</a>`, но `id="svg-map"` не существует. Реальные id: `#svg` (SVG), `#mapFrame`, `#stage`. Единственная карта со skip-линком, и он не работает (фокус никуда не прыгает).

---

## 4. NEW V2-4 (P2, SEO) — feed.xml: неверные ДНИ НЕДЕЛИ в pubDate
Отличается от P2-6 (та про таймзону +0000 vs +0300); этот — про несоответствие weekday↔date по RFC-822. Могут сосуществовать.
- `Sat, 31 May 2026 …` ×3 (серия Гилла) → 31 мая 2026 = **Sunday**;
- `Thu, 01 May 2026 …` ×6 (серия Нагорной) → 1 мая 2026 = **Friday** (рядом есть и корректный `Fri, 01 May`).
Часть RSS-валидаторов/парсеров считают такие даты невалидными.

---

## 5. Хигиена (вероятно уже частично в ledger как P0-7/P0-8/P2-14 — отмечаю для полноты)
- `js/modules/theme.js` + `js/site-modules.js` используют ключ темы `gb-theme` вместо живого `theme` (мёртвый код; `site-modules.js` в SW precache). Если включат «как есть» — рассинхрон темы/FOUC.
- robots.txt: `Allow: /llms.txt` стоит внутри группы `User-agent: ImagesiftBot`, а не глобально (low-impact, мисплейснутое правило).

---

## Предложение для финального верификатора
Добавить в unified ledger: **V2-1 (P1), V2-2 (P1), V2-3 (P1), V2-4 (P2)** — они не пересекаются с существующими записями. V2-1/V2-2/V2-3 НЕ маскируются PS-01 (чистая разметка/селекторы), поэтому останутся багами и после фикса контроллера.
