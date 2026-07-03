# ХИРУРГИЧЕСКОЕ УГЛУБЛЕНИЕ: RE-VERIFICATION на текущем HEAD (1a288da5)

**Дата:** 2026-06-27
**Проект:** gb-is-my-strength (gospod-bog.ru)
**Аудитируемый HEAD (текущий origin/main):** `1a288da5f90093298dac83c93b9b51f3b4963da6` (2026-06-26 22:44)
**Предыдущий аудированный HEAD:** `49b83365606cec1e65060238cefea210439b882d` (на 7 коммитов старше)
**Режим:** Surgical deepening (хирург, не бульдозер) — re-baseline + коррекция отчётов + новые верифицированные находки
**Агент:** arena-surgeon (Arena.ai Agent Mode)
**Метод:** Multi-witness — source-grep + npm gates + node --check + чтение кода; каждое утверждение привязано к файлу/строке/команде.

---

## 0. Почему этот отчёт — это УГЛУБЛЕНИЕ, а не дубль

Предыдущий хирургический анализ (`DEEP_SURGICAL_ANALYSIS_RASSINKHRON_UNFINISHED_2026-06-27.md`) был сделан на HEAD `49b8336` и дал **обзорную** карту проблем, но фиксировал только low-risk (римские цифры в Gill context), а всё P0/P1 оставил «замороженным для owner-approval». Между `49b8336` и текущим `1a288da5` **другой агент выполнил lane `floating-cluster-finish-2026-06-27`** и применил GILL-A / POS-01 / VR-02 / VR-09 — то, что прошлый хирург держал замороженным.

**Следствие:** ряд «frozen» пунктов предыдущих отчётов уже закрыт, а в самих отчётах есть **внутренние рассинхроны** (противоречивые утверждения между файлами). Этот отчёт:
1. перебазирует правду на текущий HEAD;
2. исправляет ложные/устаревшие утверждения предыдущих отчётов (с evidence);
3. добавляет **новые**, точно верифицированные хирургические находки, которых в предыдущих отчётах не было.

---

## 1. КОРРЕКЦИЯ ОТЧЁТОВ — что в предыдущих surgical-документах НЕВЕРНО или устарело

> Хирург сначала вскрывает ложные находки — они опаснее отсутствующих, потому что уводят будущих агентов от реального root cause.

### 1.1 FALSE-POSITIVE: «P0 SW precache 404 для site-modules.js»
- `DEEP_SURGICAL_ANALYSIS` §2.1 утверждает: «`site-layered.css` и `site-modules.js` существуют в src/, но не попадают в precache SW» и поднимает это как **P0**.
- `CONTINUATION_LOW_RISK_EXHAUSTED` при этом пишет обратное: «site.js (577 строк) + site-layered.css exist separate (**no site-modules.js**)».
- **Верификация на HEAD `1a288da5`:** `ls js/site-modules.js` → **MISSING**. Файла нет.
- **Вывод:** «P0 SW precache для site-modules.js» — **ложная находка**. Невозможно прекэшировать несуществующий файл. `audit-pro.js:2706` корректно перечисляет `site-modules.js` среди «pilot-артефактов, которых не должно быть в precache». Этот «P0» нужно снять с ledger'а.

### 1.2 ИЗМЕНЕНИЕ: izbrannoe-варнинг «переехал»
- `SURGICAL_PROGRESS` пишет: «data:consistency ✅ (izbrannoe warning unchanged)».
- **Верификация:** `npm run data:consistency` → `✅ Data consistency passed`, **варнинга по izbrannoe больше нет** в этом gate. Izbrannoe теперь светится **только** в `migration:metadata:check` (и в strict-режиме внутри `validate:static-publication`) двумя WARN:
  - `⚠️ /izbrannoe/: no entry in route-migration-matrix.json`
  - `⚠️ route /izbrannoe/: production-dist route without search-manifest entry`
- **Вывод:** долг `/izbrannoe/` жив, но его «адрес» в предыдущих отчётах неточен. Точная локализация — §3.4 ниже.

### 1.3 META-РАССИНХРОН: «§3.10 PremiumControls protected subsystem» НЕ приземлился на main
- `SURGICAL_PROGRESS` и `CONTINUATION` утверждают: «PremiumControls added as protected subsystem in AGENTS.md (new `### 3.10`)» и ссылаются на точные инварианты.
- **Верификация на закоммиченном AGENTS.md:** `grep -n "PremiumControls\|RomanNumeral\|floating-cluster-controller" AGENTS.md` → **пусто**. Раздел §3 заканчивается на `### 3.7` (Создание новой статьи). §3.10 не существует.
- Последний коммит, трогавший AGENTS.md: `debf4030` (`lane/system-premiumcontrols-hardening-2026-06-26`) — но protective-текста про «protected subsystem §3.10» там нет.
- **Интерпретация (сдержанная):** AGENTS.md — HIGH-RISK shared-файл (требует lane + интегратор). Сессия, видимо, **черновила** §3.10 локально, но не закоммитила (или потеряла на handoff/compaction). Для верификатора/owner это **рассинхрон между «claimed state» в AuditRepo и реальным закоммиченным состоянием** source-репо. Защитные правила, описанные в отчётах, в закоммиченном AGENTS.md **не действуют**.

---

## 2. УЖЕ ЗАКРЫТО lane `floating-cluster-finish-2026-06-27` (не флагать повторно)

На текущем HEAD присутствуют коммиты, которых не было на `49b8336`:

| Коммит | Что закрыло | Статус |
|---|---|---|
| `3e477231` fix(GILL-A) | vertical text в gbs2-mobile-head на узких экранах | **FIXED** |
| `f372505f` fix(POS-01) | restore EXACT historical `.theme-toggle` position for Hermeneutics | **FIXED** |
| `d6a23cae` fix(VR-02+VR-09) | Gill footer reference-exact + Hermeneutics modifier в built HTML | **FIXED** |
| `82147033` docs+guard | FORBIDDEN_AND_TRUTHS rules + GILL-C safety-net (roman ≠ link-blue) | **LANDED** |

> Эти 6 визуальных багов (GILL-A/B/C, legacy TOC, gbs2-thumb, HERM-position) из предыдущих отчётов в значительной степени отработаны. Свежий браузерный smoke всё ещё рекомендован (ср. §6), но как «frozen/unfixed» их перечислять больше нельзя.

---

## 3. CONFIRMED-CURRENT РАССИНХРОНЫ — точные root cause (ядро отчёта)

Каждый пункт — верифицирован на HEAD `1a288da5` командой с выводом.

### 3.1 🔴 [P1 / release-barrier] `workflows:check` ДЕКОУПЛИНОВАН от барьера релиза

**Самый опасный рассинхрон «под green gate».**

- `npm run workflows:check` → **REAL EXIT=1**:
  ```
  ❌ 1 issue(s):
  - package.json scripts.dist:jsonld:audit: must audit JSON-LD in dist artifact
  ```
- `npm run validate:static-publication` → **EXIT=0 (GREEN)**.
- Почему gate зелёный при красном guard? Потому что **`validate:static-publication` НЕ включает `workflows:check`**:
  ```
  node -e "..." → workflows:check in barrier: false
  ```
  Барьер (`validate:static-publication`) — это цепочка из **35** шагов (`validate:all`, `owner:ui-guard`, 13× `*:visual-parity:audit`, `maps:validate`, `audit-pro`, `data:consistency`, …, `migration:metadata:check:strict`). `workflows:check` среди них **нет**.
- Зато `ci:check` = `cache-bust && validate:static-publication && workflows:check` — он **ВКЛЮЧАЕТ** и потому был бы RED.

**Root cause (точный):** guard-policy (`check-workflows.js`) и canonical release barrier (`validate:static-publication`) — **две разнесённые линии**. AGENTS.md §9.x требует, чтобы `deploy.yml`/`indexnow.yml` запускали `validate:static-publication`. Значит CI деплоит при зелёном барьере, а красный policy-guard **никогда не блокирует релиз** — он может быть красным бесконечно.

**Хирургическая тяжесть:** это именно «рассинхрон под green gate» — тот класс, который просил найти владелец. Не один большой баг, а тихая развязка между двумя «правильными» подсистемами.

**Почему это ещё и «недоделанная реализация»:** guard создан, но **не вшит в финальный барьер** — незакрытый интеграционный шаг.

---

### 3.2 🟠 [P1 / false-red внутри 3.1] `dist:jsonld:audit` — ложная тревога регекса, не реальный пробел

Внутри бага 3.1 кроется второй, уточняющий:

- `check-workflows.js:55` требует, чтобы строка скрипта `dist:jsonld:audit` совпадала с регексом `/dist-jsonld-audit\.js[^\n]*--root\s+dist/` (то есть **буквальное** присутствие флага `--root dist`).
- В `package.json` скрипт выглядит так: `"dist:jsonld:audit": "node scripts/dist-jsonld-audit.js"` — **без** `--root dist`.
- **Но** `dist-jsonld-audit.js` по умолчанию аудирует именно `dist`:
  ```js
  const rootArg = process.argv.includes('--root') ? ... : 'dist';
  ```
  → реализация **корректна**, поведение правильное.

**Root cause (точный):** не JSON-LD-пробел, а **слишком строгий регекс guard'а**, требующий явного флага вместо семантической проверки. guard красный «по косметической причине».

**Хирургический вывод:** «красный `workflows:check`» (ledger B1/B2) — это **ложная тревога регекса**, а не реальный дефект аудита JSON-LD. Это сужает предыдущую формулировку «script wiring does not satisfy workflow guard expectation» до точного root cause. Фикс тривиален: либо добавить `--root dist` в строку скрипта, либо ослабить регекс до семантики.

> ⚠️ Внимание хирургу: **не путать** 3.1 (настоящий дефект — декуплинг guard↔barrier) и 3.2 (косметика регекса). 3.2 «закрашивает» 3.1 ложным описанием. Чинить надо **3.1** (вшить `workflows:check` в барьер) — после этого 3.2 станет виден как отдельная косметическая правка.

---

### 3.3 🔴 [P1 / contract drift] Архитектурный инвентарь AGENTS §2 рассинхронизирован с реальностью

AGENTS.md §2 («Архитектура — единственно верная») провозглашает жёсткие потолки:

```
css/   ← РОВНО 5 ФАЙЛОВ. БОЛЬШЕ НЕ СОЗДАВАТЬ.   (AGENTS.md:321)
js/    ← РОВНО 11 ФАЙЛОВ. БОЛЬШЕ НЕ СОЗДАВАТЬ.  (AGENTS.md:331)
```

**Реальность на HEAD `1a288da5`:**

| Слой | §2 обещает | Реально | Незакаталогизированные |
|---|---|---|---|
| `css/*.css` | **5** | **8** | `floating-cluster.css` (75 КБ), `premium-controls.css` (8.8 КБ), `site-layered.css` (282 КБ) |
| `js/*.js` | **11** | **12** (+ `js/modules/` dir) | `floating-cluster-controller.js` (1050 строк) |

- `floating-cluster.css` и `floating-cluster-controller.js` — живые (загружаются страницами, прекэшируются в SW). Они **документированы** где-то в истории (r297+, PremiumControls work), но **НЕ внесены в §2 canonical inventory** и не упомянуты в закоммиченном AGENTS.md (см. §1.3).
- `site-layered.css` (282 КБ) и `premium-controls.css` (8.8 КБ) — **не загружаются ни одной страницей** (см. §4).

**Root cause (точный):** миграция PremiumControls/Floating-Cluster добавила 3 CSS и 1 JS, но §2 (канонический «архитектурный максимум», на который опираются `audit-pro`-style проверки и будущие агенты) **не был реконсилирован**. Это контракный рассинхрон: §2 утверждает «ровно 5/11», а реально 8/12+modules. Любой агент, читающий §2 как закон, сделает ложный вывод, что новые файлы — «запрещённые».

**Хирургическая рекомендация:** обновить §2 inventory до реальности (перечислить 8 CSS / 12 JS + modules/), а осиротевшие файлы (§4) — удалить. Это снимет рассинхрон между «законом» и «фактами».

---

### 3.4 🟠 [P1 / half-fixed] `/izbrannoe/` — production-видим, но контрактно недозавершён

- `migration/page-ownership.json:324` → `/izbrannoe/` присутствует ✅ (source: `src/pages/izbrannoe/index.astro`).
- `migration/route-migration-matrix.json` → **записи нет** ❌
- `data/search-manifest.json` → **записи нет** ❌
- Создан отдельной задачей: коммит `a38d7e03 feat(premiumcontrols): dedicated /izbrannoe/ favorites page + nav links`.

**Подтверждённые WARN (только в migration:metadata:check / strict):**
```
⚠️ /izbrannoe/: no entry in route-migration-matrix.json (add it before migration)
⚠️ route /izbrannoe/: production-dist route without search-manifest entry
```

**Root cause (точный):** типовой паттерн «feature rollout до завершения контракта» — маршрут выведен в production (есть в ownership + UI-навигация), но не прошёл полный data-pipeline (matrix + search). Это подтверждает ledger B3 и является свежим доказательством того, что паттерн «выкатить раньше, чем закрыть контракт» в репо **активен** (не исторический).

**Хирургическая тяжесть:** WARN не ломает gate, но: (а) маршрут не индексируется Ctrl+K-поиском (search-manifest), (б) будущая миграция споткнётся об отсутствие matrix-записи.

---

### 3.5 🔴 [P1 / architectural] Gill «two worlds» — ТОЧНЫЙ root cause split-family

Предыдущие отчёты говорили абстрактно «Gill pages span more than one UI family». Верификация даёт точную анатомию:

| Gill-маршрут | Семейство рельса | Маркеры (count в PageChrome) |
|---|---|---|
| **context** (`GillContextPageChrome.astro`) | **`gbs-rail` (v16 floating-cluster)** | `data-gill-v16="context"` ×2, `gbs-rail` ×15, `gbs-rail-card` ×21 |
| **part1 / part2 / part3 / spravochnik** | **`gbs2-rail` (legacy GBS series)** | `gbs2-mobile-head` ×1, `gbs2-rail` ×1, `gbs2-sheet` ×18 (у каждого) |

**Root cause (точный):** страница **context** мигрирована на новый рельс `gbs-rail` (floating-cluster v16), а **4 части** остались на старом `gbs2-rail` (legacy GBS-мир). Это и есть «два мира»: theme-toggle / premium-controls / TOC / mobile-sheet **ведут себя по-разному** между context и частями. Это объясняет, почему предыдущий хирург фикcил `initGillRail()` особым образом (итерация по ВСЕМ `[data-fc-controls="gill-rail"]`) — это **компенсация** рассинхрона, а не нормальная архитектура.

**Хирургическая тяжесть:** это живой convergence-debt. Любая правка рельса/контролов должна теперь учитывать **две разные реализации** (context ≠ parts). Это концентратор будущих регрессий (см. §5).

---

## 4. НЕДОДЕЛАННЫЕ ВЕЩИ / ОСИРОТЕВШИЕ АРТЕФАКТЫ (orphaned code)

### 4.1 🟠 `css/site-layered.css` (282 КБ) — забытый пилот r261/r262
- AGENTS-r261 (2026-06-22) создал `site-layered.css` (@layer-архитектура) как пилот Рефакторинга 6.0 Phase 1.
- AGENTS-r262 создал `js/site-modules.js` (бандл из 4 модулей) — **тот удалён**, а CSS-напарник **остался** (282 КБ).
- `grep -rln "site-layered" --include=*.html .` → **0 страниц загружают его**.
- `audit-pro.js:2706` «пропускает» его как pilot-artifact: `// Tooling/pilot artifacts such as css/site-layered.css and js/site-modules.js may physically exist ... but must not force users to download them.`
- **Диагноз:** недозакрытая миграция. Guard маскирует осиротевший файл («всё ок, пропускаем») вместо того, чтобы требовать удаление. 282 КБ мёртвого веса в репо.

### 4.2 🟠 `css/premium-controls.css` (8.8 КБ) — дублирующий источник
- Содержит классы `.gb-ember`, `.premium-control-anchor`, speed-morph (50 совпадений по маркерам).
- **Те же классы продублированы в `floating-cluster.css`** (79 совпадений по тем же маркерам).
- `grep -rln "premium-controls.css" --include=*.html --include=*.astro` → **0 загрузок** страницами. Загружается только `floating-cluster.css` (+ прекэшируется в SW).
- **Диагноз:** «лишняя линия логики» — два CSS под одну фичу; один (`premium-controls.css`) — мёртвый дубликат-источник. Риск: будущий агент правит `premium-controls.css`, думая, что он живой.

### 4.3 🟡 `js/modules/back-to-top.js` — частичная реализация r262
- r262 обещал 4 модуля (`faq-accordion`, `theme`, `img-loaded`, `back-to-top`) в бандле `site-modules.js`.
- Реально: бандл удалён, в `js/modules/` остался **только** `back-to-top.js`.
- Он **живой** — загружается напрямую статьями (`gill-chast-1/2/3`, `krajne`, `rimlyanam-7`) и Gill-хромами.
- **Диагноз:** миграция выполнена наполовину — «back-to-top» выжил как самостоятельный модуль, остальное откатилось. Архитектура `js/modules/` не закрыта (1 файл вместо 4 + bundle).

### 4.4 🟡 Floating-cluster-controller.js (1050 строк) — нет dedicated-теста
- Подтверждено: `scripts/*floating*test*` / `*premium*test*` → **не существует**.
- Это явный P1-долг из предыдущих планов: «Floating controls — вынести в отдельный audited компонент с собственным тестом». Не закрыто. Контроллер — концентратор рецидивирующих регрессий (см. §5), защищён только `premium-controls-rollout-audit.js` (не unit/smoke-тест).

---

## 5. ЛИШНИЕ ЛИНИИ ЛОГИКИ — количественная мера

### 5.1 🟡 80 guard-скриптов из 117 (68%)
- `node -e` по `package.json`: всего **117** npm-скриптов, из них **80** попадают под `audit|parity|guard|check|consistency|validate`.
- Из 80: **13** route-specific `*:visual-parity:audit` + 3 infra (`visual-parity-{baseline,contract,screenshots}` + `guard`/`production`) + множество `astro:audit:*`, `sw:dist:audit:*`, `strangler:audit:*`, `native:runtime:audit(:strict)`, `gill:*:audit`, `baptisty:*:audit`.

### 5.2 🟡 5 пар `:no-build`-вариантов (дублирование логики)
- `astro:audit:home` ↔ `astro:audit:home:no-build`, и так для `baptisty-series`, `ishod`, `legacy-wrappers`, `article-mdx`. Каждый `:no-build` — отдельный скрипт со своей wiring'ой = точка рассинхрона (логика «с build» и «без build» может разъехаться).

### 5.3 🟡 Дублирующий visual-parity boilerplate
- 13 route-specific parity-скриптов повторяют ~60–80 строк шаблона (DOM markers, word/H2 parity, pixel). Общий контракт меняется → править 13 файлов. Антипаттерн к заявленному «один site.js».

**Хирургическая рекомендация (сдержанная, не бульдозер):** не «уничтожить всё», а свести к **1 unified parity-guard + manifest** (по образцу `route-migration-matrix.json`) — как P1-задачу, но **только после** заморозки текущих контрактов (чтобы не породить регрессию самой консолидацией).

---

## 6. РЕЦИДИВИРУЮЩИЕ РЕГРЕССИИ — где концентратор

История коммитов (срез по AGENTS-changelog) показывает, что регрессии **возвращаются в 3 зонах**:

1. **Floating-cluster / premium-controls** — `floating-cluster-finish-2026-06-27` lane (GILL-A, POS-01, VR-02/09), `initGillRail()` компенсация, position-freeze (10–14 дней). **Причина:** Gill two-worlds (§3.5) + 1050-строчный контроллер без теста (§4.4).
2. **Cache-bust / hash drift** после Astro-компонентов — почти каждый fix-коммит сопровождается `chore: auto-update meta, cache-bust [skip ci]` (ручное тушение).
3. **OG ≠ LCP** — постоянно всплывает в `audit-pro` (5 страниц). AGENTS §9.24 фиксирует как «намеренно», но без machine-readable маркера (только комментарии).

**Паттерн:** почти все рецидивы — на стыке **legacy-транспорта** и **новых Astro-компонентов**. Подтверждает тезис предыдущего хирурга, но теперь с привязкой к точным root cause (§3.5, §4.4).

---

## 7. GROUND-TRUTH: полный gate на текущем HEAD

- `npm run validate:static-publication` → **EXIT=0 (GREEN)**. Подтверждает ledger A1/A2: «первого порядка поломки нет».
- Состав барьера: 35 шагов (см. §3.1). `workflows:check` в него **не входит**.
- FAST-loop: `data:consistency` ✅, `migration:metadata:check` WARN (только izbrannoe, §3.4).

> Один абзац-вердикт: **текущий HEAD здоров на «первом порядке» (полный gate зелёный), но несёт живые second-order дефекты — policy-guard декуплинован от барьера релиза (3.1), канонический архитектурный инвентарь AGENTS §2 разошёлся с реальностью (3.3), Gill живёт в двух UI-семействах (3.5), `/izbrannoe/` выкачен без закрытия контракта (3.4), а 282 КБ осиротевшего CSS и 8.8 КБ дублирующего masked-ятся audit-pro'ом (4.1–4.2).**

---

## 8. ХИРУРГИЧЕСКИЙ REPAIR ORDER (low-risk → high-risk)

> Принцип: хирург режет послойно. Сначала — правки, которые **не могут** породить визуальную/рантайм-регрессию (доки, контракты, удаление мёртвого кода, wiring guard'а). Только потом — то, что трогает рантайм.

### Lane A — low-risk / zero runtime impact (можно сейчас, SOLO docs+config)
1. **Закрыть рассинхрон 3.1:** вшить `workflows:check` в `validate:static-publication` (или явно задокументировать, почему policy-guard живёт вне барьера). **Без этого любой «красный guard» — мёртвый сигнал.**
2. **Закрыть ложную тревогу 3.2:** добавить `--root dist` к `dist:jsonld:audit` ИЛИ ослабить регекс `check-workflows.js:55` до семантики.
3. **Реконсилировать AGENTS §2 (3.3):** обновить inventory до 8 CSS / 12 JS + `modules/`; добавить canonical-описание floating-cluster-файлов (и перенести сюда «protected subsystem §3.10», который не приземлился — §1.3).
4. **Завершить `/izbrannoe/` (3.4):** добавить в `route-migration-matrix.json` + `data/search-manifest.json` (или явно решить статус).
5. **Удалить осиротевший `site-layered.css` (4.1):** 282 КБ мёртвого веса; после удаления снять exemption-комментарий в `audit-pro.js:2706`. **(Перед удалением — `git log -p css/site-layered.css` убедиться, что ни один _astro/ билд его не тянет — проверено: 0 загрузок.)**

### Lane B — medium-risk (требует owner-review, визуального smoke)
6. **Удалить/консолидировать `premium-controls.css` (4.2):** убедиться, что floating-cluster.css — единственный источник, убрать дубликат. Проверить `dist:css-parity`.
7. **Закрыть §4.3:** решить судьбу `js/modules/` (1 файл) — либо добрать миграцию, либо вернуть back-to-top в site.js.
8. **Machine-readable OG-LCP маркер (6.3):** поле `ogIsIntentionalLcpMismatch` в route-profiles, чтобы audit-pro переставал поднимать INFO по 5 страницам.

### Lane C — high-risk (только после Lane A/B и visual-parity + pixelmatch smoke)
9. **Gill convergence (3.5):** перевести part1/2/3/spravochnik с `gbs2-rail` на `gbs-rail` (v16) — **по одной странице**, под `visual:parity:guard` + `interactive-audit`. Это уберёт концентратор регрессий (§6.1).
10. **Dedicated-тест для floating-cluster-controller.js (4.4).**
11. **Consolidation parity-guards (5.1–5.3):** 1 unified-guard + manifest, после заморозки контрактов.

---

## 9. ПРИОРИТЕТ ХИРУРГА — что копать следующим скальпелем

Если владелец укажет один участок — мои рекомендации по ROI:

| Участок | Почему сейчас | Риск | ROI |
|---|---|---|---|
| **Lane A (3.1–3.5, 4.1)** | Снимает «мёртвые сигналы» и контрактный рассинхрон; zero runtime-risk | очень низкий | **очень высокий** |
| **Gill two-worlds (3.5)** | Главный концентратор будущих регрессий | высокий (нужен pixel-parity per-page) | высокий |
| **Parity-guard consolidation (5)** | Снижает сложность, но само по себе риск | средний | средний |

---

## 10. EVIDENCE APPENDIX — команды верификации (воспроизводимо)

```bash
# HEAD
git log -1 --format="%H %ci %s"   # → 1a288da5 ... chore: auto-update meta, cache-bust [skip ci]

# 1.1 site-modules.js false-positive
ls js/site-modules.js              # → MISSING
grep -rn "site-modules" scripts/audit-pro.js   # → :2706 pilot-artifact exemption

# 1.3 §3.10 not landed
grep -n "PremiumControls\|RomanNumeral\|floating-cluster-controller" AGENTS.md   # → (empty)

# 3.1 workflows:check decoupled
node scripts/check-workflows.js; echo $?        # → exit 1
node -e "const p=require('./package.json'); console.log(/workflows:check/.test(p.scripts['validate:static-publication']))"   # → false
npm run validate:static-publication; echo $?    # → exit 0

# 3.2 dist:jsonld false-red
grep -n "must audit JSON-LD" scripts/check-workflows.js     # → :55 regex demands --root dist
node -e "console.log(require('./package.json').scripts['dist:jsonld:audit'])"   # → node scripts/dist-jsonld-audit.js  (no --root, defaults to dist)

# 3.3 contract drift
ls -1 css/*.css | wc -l   # → 8 ;  AGENTS.md:321 "РОВНО 5"
ls -1 js/*.js  | wc -l   # → 12 ;  AGENTS.md:331 "РОВНО 11"

# 3.4 izbrannoe
grep -n izbrannoe migration/page-ownership.json      # → present
grep -n izbrannoe migration/route-migration-matrix.json  # → (empty)
grep -n izbrannoe data/search-manifest.json           # → (empty)

# 3.5 Gill two-worlds
grep -oE "gbs-rail|gbs2-rail|data-gill-v16=\"[a-z-]+\"" src/components/article-pilots/gill-context/GillContextPageChrome.astro   # → gbs-rail
grep -oE "gbs2-rail|gbs2-mobile-head|gbs2-sheet" src/components/article-pilots/gill-part1/GillPart1PageChrome.astro              # → gbs2-*

# 4.1 orphan site-layered.css
grep -rln "site-layered" --include=*.html . | grep -v node_modules   # → (empty)

# 4.2 premium-controls.css dup
grep -c "gb-ember\|premium-control-anchor\|speed-morph" css/floating-cluster.css css/premium-controls.css   # → 79 / 50
grep -rln "premium-controls.css" --include=*.html --include=*.astro .   # → (empty)

# 5.1 guard explosion
node -e "const p=require('./package.json'); const g=Object.keys(p.scripts).filter(k=>/audit|parity|guard|check|consistency|validate/.test(k)); console.log(g.length+'/'+Object.keys(p.scripts).length)"
```

---

**Статус:** deepening завершён на HEAD `1a288da5`. Все находки — верифицированы командами (§10). Не сделано ни одной правки source-кода (сессия = аудит/verification, не implementation). Готов к owner-decision по Lane A (low-risk) или к углублению любого конкретного участка дальше.
