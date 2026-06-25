# Independent verification + new bugs — gb-is-my-strength — 2026-06-25

## Meta
- Project: gb-is-my-strength / gospod-bog.ru
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-verifier-2`
- Date: 2026-06-25
- Commit audited: HEAD `fb8e4922` (`chore: auto-update cache-bust for floating-cluster-controller.js`)
- Environment: Node v20 sandbox (project requires >=22.12.0 → full `astro build` not run here; verified at source + jsdom runtime + static artifact level)
- Build mode: **source layer + root legacy HTML + jsdom runtime execution of shipped JS.** Не запускал production-like `dist` (Node 20 ограничение), но воспроизвёл P0-краш реальным исполнением файла в DOM.

Цель этого прохода: независимо перепроверить заявления первого агента (`arena-agent`, premium-surface matrix) — что подтвердить, что отменить как устаревшее/исправленное, и добавить собственные находки, которые в матрице отсутствуют.

---

## ЧАСТЬ A — Верификация заявлений первого агента (PS-01 … PS-10)

### ✅ PS-01 — `qs is not defined` — ПОДТВЕРЖДЕНО (severity повышаю, blast radius шире заявленного)

**Это настоящий, доминирующий P0.** Воспроизвёл реальным исполнением `js/floating-cluster-controller.js?v=35a91710` в jsdom.

Структурная причина (точные строки текущего файла):
- `function qs(...)` / `function qsa(...)` — строки **32–33**, объявлены **внутри** IIFE;
- IIFE закрывается на строке **389** (`})();`);
- `initTocPopups` (394), `initActionHandlers` (457), `initPlayExpand` (483) объявлены **после** закрытия IIFE → у них нет доступа к `qs`/`qsa`;
- но они **вызываются изнутри** IIFE-шного `ready()` на строках **346–348**.

Runtime-доказательство (jsdom, реальный shipped-файл):
```
TOP-LEVEL OK
ReferenceError: qs is not defined
    at initTocPopups (...:397:21)
    at Document.eval (...:348:5)   // ← вызов initTocPopups() внутри ready()
html class before click: ""
html class after click : ""
=> theme toggle wired & working? false
window.__gbCluster defined? undefined
```

**Ключевой нюанс, усиливающий severity:** краш происходит на строке 348 (`initTocPopups()`), что **раньше** строки 351 (`roots.forEach(initCluster)`). Значит `ready()` падает ДО привязки кликов к кластерам. Итог: **ВСЕ** premium-контролы (theme/search/play/save/font/speed-panel) мертвы на каждой странице, грузящей контроллер, и `window.__gbCluster` не создаётся.

**Blast radius — 23 страницы, а не 13** (матрица недосчитала, т.к. interactive-audit не гоняет baptisty-rossii):
```
articles/: hermenevtika, kod-da-vinchi, 20-antisovetov, gill ×5  = 8
nagornaya/chast-1..5                                              = 5
baptisty-rossii/* (10 страниц)                                    = 10
ИТОГО                                                             = 23
```
Проверка: `grep -rl floating-cluster-controller.js --include=index.html . | wc -l → 23`.

Рекомендуемый фикс: перенести `initTocPopups`/`initActionHandlers`/`initPlayExpand` **внутрь** IIFE (до `})();`), либо вынести `qs`/`qsa` в общий скоуп. Тривиально по diff, критично по эффекту.

---

### ✅ PS-06 — Hermeneutics hidden readTime 35 vs visible 50 — ПОДТВЕРЖДЕНО
В сгенерированном `articles/hermenevticheskaya-.../index.html`:
- `<span data-pagefind-meta="readTime" hidden="">35</span>` — есть;
- видимый байлайн `⏱ 50 мин`, `data/search-manifest.json` readingTime=50.
Реальный рассинхрон индексной меты. Источник: `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`.

---

### ✅ PS-07 — Duplicate IDs `gbsTheme`/`gbsSearch` на Gill-страницах — ПОДТВЕРЖДЕНО на уровне источника (в `dist`)
`src/components/ui/floating-cluster/GillRailControls.astro` хардкодит `id="gbsTheme"` (стр.43) и `id="gbsSearch"` (стр.66) **без зависимости от `context`**. Этот компонент рендерится **дважды** (context="mobile" + context="rail") в:
- `GillPart1PageChrome.astro` ×2
- `GillPart2PageChrome.astro` ×2
- `GillPart3PageChrome.astro` ×2
- `GillSpravochnikPageChrome.astro` ×2
- `GillContextPageChrome.astro` ×0 (другой shell — исключён, верно)

→ в Astro `dist/` (а это и есть production по README §1) получаются дублирующиеся id на 4 страницах.

**Важная оговорка по методу:** мой первичный `grep` дублей id по **корневым** `articles/*/index.html` дал 0 — потому что **root legacy** gill-страницы используют старый `gbs2`-shell с `data-gbs2-theme`/`data-gbs2-search` (без id), а НЕ `GillRailControls`. Дубли появляются именно в Astro-build. Это подтверждает важность правила «проверять production-like dist, а не root».

---

### ✅ PS-08 / PS-09 — interactive-audit selector drift — ПОДТВЕРЖДЕНО (это аудит-дрифт, не баг маршрута)
`scripts/interactive-audit.js` `visibleThemeHandle()` не знает `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme`; series-checks ждут `.gbs2-rail`/`#gbs2Bbar`/`#gbs2Sheet`, тогда как gill-context перешёл на v16 shell (`gbs-rail`, overlays). Классификация первого агента верна.

---

### ✅ PS-10 — cache-bust drift для контроллера — ПОДТВЕРЖДЕНО и уточнено
`HermenevtikaBody.astro` (src) ссылается на `floating-cluster-controller.js?v=c78a4236`, тогда как реальный md5 файла сейчас = `35a91710` (и корневой HTML уже на `35a91710`). То есть **источник несёт устаревший `?v=`**. Если Astro-build возьмёт src как есть — на странице будет ссылка на несуществующий/иной `?v` → промах кэша/SW. Реальный source-layer баг.

---

### ⛔ PS-05 — Hermeneutics stray `76e7365` — БОЛЬШЕ НЕ ВОСПРОИЗВОДИТСЯ (исправлено после отчёта)
`grep -rn "76e7365"` по `.html`/`.astro` — **0 совпадений**. Хвост `HermenevtikaBody.astro` чист, сгенерированный HTML заканчивается нормально:
```
<script defer src="../../js/floating-cluster-controller.js?v=35a91710"></script>
</body></html>
```
Рекомендация верификатору: пометить PS-05 как **resolved / no longer reproducible** (но оставить аудит-правило на raw-hash у `</body>`, как предлагал task-док P0.3).

---

### ⛔ PS-04 — heart-routes premium markup без контроллера — БОЛЬШЕ НЕ ВОСПРОИЗВОДИТСЯ (исправлено/откатано)
Текущее состояние корня:
```
articles/krajne-li-isporcheno-serdce/index.html:        gb-ember=0 gb-save=0 controller=0
articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/:  gb-ember=0 gb-save=0 controller=0
```
На этих маршрутах premium-разметки больше нет → ownership-конфликт с TTS-гардом `site.js` (`if(document.querySelector(".gb-ember,[data-fc-root]"))return;`) на них не срабатывает. Сам гард в `site.js` всё ещё существует (это правда), но heart-страницы из «плохого среднего состояния» вышли. Пометить PS-04 как **stale/resolved for heart routes**; гард-логику оставить как «watch» для будущего роллаута.

> ВАЖНО: PS-04 переносит проблему. Тот же TTS-гард `.gb-ember` ОСТАЁТСЯ активной проблемой на nagornaya/baptisty — см. ЧАСТЬ B (NEW-2), где premium-ember присутствует, но контроллер мёртв (PS-01) → TTS подавлен И premium play мёртв одновременно.

PS-02 / PS-03 (dead theme/save) — это **следствия PS-01**, не отдельные корневые баги. Подтверждаю как симптомы, корень = PS-01.

---

## ЧАСТЬ B — НОВЫЕ баги, которых нет в матрице первого агента

### 🆕 NEW-1 (P1) — Битые якоря TOC ↔ тело на Gill part 1 и part 3 (ломается навигация по статье)
Не зависит от JS — чистый рассинхрон разметки. Клик по пункту оглавления не скроллит никуда.

- **gill-part1** (`GillPart1PageChrome.astro` → `articles/dzhon-gill-chast-1-chelovek/`):
  - TOC `href="#sec-early-years"` → раздела нет (есть `#part-calling`);
  - TOC `href="#sec-gill-spirituality"` → раздела нет вообще.
- **gill-part3** (`articles/dzhon-gill-chast-3-nasledie/`): 5 битых пунктов:
  `#sec-legacy-main` (есть `part-legacy`/`sec-legacy`), `#sec-rome-proverbs`, `#sec-wesley`, `#sec-coffee-house-polity`, `#sec-evaluations-map` — ни одного id в теле.

Метод: для каждого `href="#x"` нет ни `id="x"`, ни `name="x"` на странице. Проверено и в корневом HTML, и в src-chrome (TOC хардкожен в `*PageChrome.astro`).

### 🆕 NEW-2 (P0/P1) — Premium play-ember визуально «каша» + мёртв на 15 не-мигрированных страницах
На 10 `baptisty-rossii/*` + 5 `nagornaya/chast-*`:
1. **Визуальная поломка:** базовые правила `.gb-ember` и скрытие лишних SVG по состоянию (`.gb-ember__pause{display:none}`, `.gb-ember__check{display:none}` и переключение по `[data-state]`) живут **только** в `css/floating-cluster.css`, который эти страницы **не подключают**. На baptisty `site.css` ещё и форсит `.gbs2-ctl svg{17px}` → все 4 SVG (ring+play+pause+check) показываются наложенными.
   - `grep -c gb-ember__pause css/floating-cluster.css → 12`; `… css/site.css → 0`.
2. **Мёртвый клик:** play-ember помечен `data-fc-action="play"` (на baptisty) / `"play"`+`"save"` (на nagornaya), но обёртки `data-fc-root`/`data-fc-controls` нет → контроллер не привязывает (а он и так крашится — PS-01). Соседние кнопки baptisty работают через `enhancements.js` по `data-gbs2-*`, но `data-fc-action` он НЕ обрабатывает (селектор: `[data-gbs2-theme],[data-gbs2-search],[data-gbs2-share],[data-gbs2-font]`).

Это ровно пункт **P1.3** из `GB_PREMIUM_SVG_CONTROLS_FINAL_AGENT_TASK` (JS/CSS пара рассинхронизирована: контроллер на 23 стр., CSS на 8).

### 🆕 NEW-3 (P1) — Кнопки размера шрифта A−/A+ в сайдбаре Нагорной полностью мертвы
Все 5 `nagornaya/chast-*`: разметка `id="nagFontDec"`/`id="nagFontInc"`, class `.nag-fontsize-btn`. Обработчик в `nagornaya-mobile-toc.js` слушает `[data-fontsize="down"]`/`.nag-fontsize-down` и `[data-fontsize="up"]`/`.nag-fontsize-up`. Таких элементов в проекте нет ни одного → кнопки +/- не привязаны (применение размера `l()` отрабатывает один раз на загрузке, но менять нельзя). Рассинхрон селекторов, не связан с PS-01.

### 🆕 NEW-4 (P1) — Битый skip-link на карте Авраама (a11y)
`karty/avraam/index.html`: `<a href="#svg-map" class="avraam-skip">Перейти к карте</a>`, но `id="svg-map"` не существует (реальные: `#svg`, `#mapFrame`, `#stage`). Единственная карта со skip-линком, и он не работает.

### 🆕 NEW-5 (P1) — feed.xml: неверные дни недели (RFC-822)
9 записей: `Sat, 31 May 2026` (×3, серия Гилла) → реально **Sun**; `Thu, 01 May 2026` (×6, серия Нагорной) → реально **Fri**. Часть RSS-валидаторов/парсеров такие даты считают невалидными.

### 🆕 NEW-6 (P2) — og:image = SVG на 11 страницах baptisty-rossii
`og:image=.../cover-*.svg`, `og:image:type=image/svg+xml`. FB/X/Telegram/VK/WhatsApp не рендерят SVG как og-превью → карточка шеринга без картинки. Остальной сайт использует webp/jpg 1200×630.

### 🆕 NEW-7 (P2) — robots.txt: `Allow: /llms.txt` привязан к группе ImagesiftBot
Строка стоит после `User-agent: ImagesiftBot / Disallow: /`, т.е. применяется только к ImagesiftBot, а не глобально (как намекает замысел). Фактического вреда мало (для `*` покрыто `Allow: /`), но мисплейснутое мёртвое правило.

### 🆕 NEW-8 (P2) — Мёртвые модули с другим ключом темы + рассинхрон precache
- `js/modules/theme.js` и `js/site-modules.js` используют `localStorage['gb-theme']`, тогда как весь живой рантайм — `'theme'` (`site.js` `themeKey:"theme"`, floating-cluster `THEME_KEY="theme"`, inline-бутстрап в `<head>`). Сейчас не стреляет (модули не подключены ни одной HTML), но `site-modules.js` лежит в SW `PRECACHE_ASSETS`. Если включат «как есть» — рассинхрон темы/FOUC.
- `css/site-layered.css`, `js/site-modules.js`, `js/series-cards.js` — в SW precache, но подключены 0 страницами (лишний прекеш).

---

## ЧАСТЬ C — Что проверено и ЧИСТО (чтобы исправители не гонялись за призраками)
- Внутренние ссылки (абсолютные `/…` и относительные), `src`/`srcset` картинок, `<link>`/`<script>` css/js — 0 битых (по корневому HTML).
- JSON-LD блоки валидны; все `data/*.json` парсятся.
- canonical ↔ og:url совпадают; canonical = реальному пути.
- sitemap lastmod все `+03:00`, без будущих дат.
- cache-bust хеши совпадают с содержимым файлов (dry-run без изменений) — **кроме** src-ссылки в HermenevtikaBody.astro (PS-10).
- Дубли id по **корневым** HTML — 0 (дубли PS-07 живут только в Astro `dist`).
- `76e7365`, `?v=INITIAL` — не найдено (PS-05 закрыт).
- Собственные гейты проекта (`audit-pro` 0 errors, `validate`, `seo-audit`, `editorial-lint`, `data:consistency`) — зелёные; перечисленные баги они не ловят (runtime-краш ловится только browser/interactive-audit).

---

## ЧАСТЬ D — Сводка статусов заявлений первого агента

| ID | Статус после независимой проверки |
|---|---|
| PS-01 `qs is not defined` | **CONFIRMED** (P0, blast radius 23 стр., а не 13) |
| PS-02 dead theme | confirmed как СИМПТОМ PS-01 |
| PS-03 dead save | confirmed как СИМПТОМ PS-01 |
| PS-04 heart-route ownership | **STALE/RESOLVED** на heart (gb-ember убран); проблема мигрировала на nagornaya/baptisty → см. NEW-2 |
| PS-05 `76e7365` | **RESOLVED / not reproducible** |
| PS-06 readTime 35 vs 50 | **CONFIRMED** |
| PS-07 duplicate ids gbsTheme/gbsSearch | **CONFIRMED** (в Astro dist, 4 gill-страницы; не в root) |
| PS-08 audit theme selectors | **CONFIRMED** (tooling drift) |
| PS-09 audit gill-context shell | **CONFIRMED** (tooling drift) |
| PS-10 cache-bust drift controller | **CONFIRMED** (src `c78a4236` vs реальный `35a91710`) |

---

## ЧАСТЬ E — Предлагаемое уточнение repair order
К драфту первого агента добавить (не меняя Phase A=PS-01 первым):
- **Phase A.1:** после фикса PS-01 повторить jsdom/браузер-прогон на всех 23 страницах (не 13).
- **Phase B.1 (NEW-2):** на nagornaya/baptisty либо подключить `floating-cluster.css` + обернуть кнопки в `data-fc-root`, либо убрать premium-ember до миграции (иначе «каша» из иконок + мёртвый play + подавленный TTS).
- **Phase D.1 (NEW-1):** синхронизировать TOC-якоря gill-part1 и gill-part3 с реальными id (правка в `*PageChrome.astro`).
- **Phase D.2 (NEW-3):** починить селекторы шрифта в `nagornaya-mobile-toc.js`.
- **Phase D.3 (NEW-4):** починить skip-link на avraam.
- **Phase G (контент/SEO):** NEW-5 (feed weekdays), NEW-6 (svg og), NEW-7 (robots).
- **Phase H (гигиена):** NEW-8 (мёртвые модули/precache), PS-10.

Все находки NEW-1..8 описаны выше с точными файлами/строками/командами; этот отчёт самодостаточен.
