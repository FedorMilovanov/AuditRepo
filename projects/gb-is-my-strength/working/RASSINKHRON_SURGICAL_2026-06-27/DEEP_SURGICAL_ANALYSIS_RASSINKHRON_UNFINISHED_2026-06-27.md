# ГЛУБОКИЙ ХИРУРГИЧЕСКИЙ АНАЛИЗ: RASSINKHRON, ЛИШНЯЯ ЛОГИКА, НЕВЫПОЛНЕННЫЕ ЗАДУМКИ, НЕДОДЕЛКИ, РЕГРЕССИИ

**Дата:** 2026-06-27  
**Проект:** gb-is-my-strength (gospod-bog.ru)  
**HEAD:** 49b83365606cec1e65060238cefea210439b882d  
**Режим:** Surgical (хирург, не бульдозер) — AuditRepo multi-witness подход  
**Источники:** AGENTS.md (r297+), AUDIT_HISTORY, route-migration-matrix.json, page-ownership.json, scripts/audit-pro.js + 20+ parity guards, данные из fast gates + история коммитов.

---

## 1. Executive Summary (хирургический приговор)

**Общее состояние:** Проект демонстрирует **исключительную дисциплину** (5 CSS + 11 JS, visual-parity-first, contracts everywhere). Однако за последние 4–6 месяцев накопился **системный слой "тонких рассинхронов"** и **недоделанных миграций**, которые маскируются под "green gates".

**Главные категории проблем (по приоритету хирурга):**

| Категория | Кол-во | Уровень | Root cause |
|-----------|--------|---------|------------|
| **Rassinkhron (build vs runtime / legacy vs Astro / data vs HTML)** | 8–10 | P0–P1 | strangler + post-build cache-bust + Astro islands |
| **Недоделанные реализации (intended but not closed)** | 6–7 | P1 | Gill MDX target, full Maps, 3D sync |
| **Лишняя / дублирующая логика** | 5–6 | P2 | 12+ отдельных visual-parity-* скриптов + дубли в guards |
| **Рецидивирующие регрессии** | 4–5 | P0–P1 | Floating controls, hash drift, OG/LCP, SW precache |
| **Незавершённые контракты** | 3 | P2 | izbrannoe, site-modules in SW, strict-native-app definition |

**Ключевой диагноз:**  
Миграция 5.0–6.0 (shadow → native/component) сделана **через тысячу маленьких парадных дверей** (по одному guard'у на landing). Это создало **фрагментированную архитектуру** вместо единого контракта. Каждый новый кусок требует своего audit-скрипта → растёт сложность → растут шансы на рассинхрон.

---

## 2. Rassinkhron — самые опасные рассинхроны

### 2.1 SW / Cache-bust / Dist (P0, recurring)

**Симптомы (подтверждено в AuditRepo + текущий HEAD):**
- `site-layered.css` и `site-modules.js` существуют в `src/`, но **не попадают в precache** SW для Astro-owned страниц.
- `cache-bust.js` работает до Astro build; `copy-legacy-to-dist` + postbuild скрипт не всегда синхронизируют новые модули.
- Последние коммиты показывают "chore: auto-update meta, cache-bust" после почти каждого fix'а — классический признак ручного тушения пожара.

**Evidence:**
- AuditRepo Round 5: "1 net-new P0: SW precache 404 for site-layered.css + site-modules.js"
- `sw:dist:audit:deploy-switch` требует `--require-cache-bump`, но не ловит все Astro-острова.
- `dist/` после `strangler:build:production-like` часто содержит stale hashes для новых извлечённых модулей.

**Хирургическая рекомендация:**  
Единый `post-strangler-cache-bust.js` (или расширение cache-bust), который **всегда** сканирует `dist/_astro/` + `dist/js/` и обновляет `sw.js` + manifest. Запретить ручные "auto-update meta".

### 2.2 OG image vs LCP-priority image (P1, documented debt)

**Симптом:**
В `audit-pro.js` (и в fast guard) постоянно:
- `articles/20-antisovetov-pastoru/` — og = og-20-..., LCP = mirror
- `kod-da-vinchi`, `krajne`, `/`, `pastor-series` — то же самое.

**AGENTS §9.24** говорит: "намеренно для dedicated social-share".  
Но:
- Нет единого механизма маркировки "это intentional OG ≠ LCP".
- Каждый новый агент видит это как баг и либо фиксит, либо игнорирует.

**Рассинхрон:** SEO-контракт (OG) vs visual LCP-контракт расходятся, и это **не задокументировано в machine-readable виде** (только в комментариях).

### 2.3 Data vs HTML readingTime / series.json drift (было P0, сейчас почти закрыто, но рецидив возможен)

**Текущее состояние (fast gate):**
- `data:consistency` ✅ (с 1 warning по `/izbrannoe/`)
- Gill: 149 мин (5 частей) — синхронизировано после r295.
- russian-baptism: 229 мин.

**Остаточный риск:**
- `/izbrannoe/` — production-dist, но **отсутствует в search-manifest**.
- `data/series.json` и HTML карточки на home/articles иногда расходятся после ручных правок (история показывает многократные фиксы).

### 2.4 JS runtime desync внутри site.js (29 модулей)

- Модуль 29 (gbFloatingControls) — **рецидивирующий** (последние 4 коммита: VR-07, position override, fc-single-active, revert R9).
- TTS (speechSynthesis) — недавно фиксили race + "читает только русский текст".
- MapEngine — 43 addEventListener, `_on()` helper, но document-level listeners в панелях всё ещё риск (хотя частично закрыто).

**Рассинхрон:** Один огромный `site.js` + извлечённые `site-modules.js` + `site-layered.css` (pilot) создают **три источника правды** для runtime.

---

## 3. Невыполненные задуманные реализации (intended but incomplete)

### 3.1 Полная MDX-миграция статей (цель заявлена, не достигнута)

- `migration/route-migration-matrix.json` для большинства article routes: `"targetMode": "mdx-native-article"`
- Реально:
  - Gill spravochnik/context — частично componentized (11 sections), но **не MDX**.
  - Kod-da-vinchi, 20-antisovetov, hermenevtika, krajne, rim7 — `strict-native` (native shell + legacy body fragments).
- **Недоделка:** "hand-authored MDX" обещана, но большинство статей всё ещё на raw fragments.

### 3.2 Карты (karty/*) — 1 из 10 полностью живая

- `karty/avraam/` — flagship, 23/23 audit, MapEngine extraction идёт.
- Остальные 9: `strict-native-app`, но многие — holding pages или engine-only без полного контента.
- `route.json` есть у всех, но визуальный/контентный слой неравномерен.

### 3.3 3D баптизм (konfessii/russkij-baptizm) — изолирован, но не интегрирован

- Защищён как `built-app`.
- Timeline + article previews + BWA stats — есть.
- **Недоделка:** нет глубокой синхронизации с серией baptisty-rossii (10 статей) на уровне узлов/маршрутов.

### 3.4 /izbrannoe/ и другие "production-dist без manifest"

- В page-ownership: есть.
- В search-manifest: нет (warning в data:consistency).
- Это типичная "тень" — route объявлен, но не прошёл полный data pipeline.

### 3.5 PremiumControls / Floating cluster — вечный WIP

Из истории:
- Модуль 29 извлечён.
- Постоянные правки позиционирования, hitbox, single-active.
- `floating-cluster.css` + `js/floating-cluster-controller.js`.

**Задумка:** единый канонический блок.  
**Реальность:** рецидивы каждые 1–2 недели.

---

## 4. Лишние линии логики и дублирование

### 4.1 Explosion of visual-parity guards (P2 architectural smell)

Сейчас существует отдельный скрипт почти на каждый landing:
- `about-visual-parity-audit.js`
- `biografii-visual-parity-audit.js`
- `hard-texts-...`
- `pastor-series-...`
- `articles-...`
- `konfessii-...`
- `karty-...`
- `baptisty-rossii-...`
- `home-...`
- `nagornaya-...`
- `catalogs-...`
- `gill:context:...` + `gill:spravochnik:...`

**Проблема:** 
- Каждый guard дублирует ~60–80 строк boilerplate (DOM markers, word parity, H2 parity, pixel).
- Когда меняется общий контракт — нужно править 12 файлов.
- Это **анти-паттерн** к заявленному "один site.js".

**Предложение хирурга:** Один `visual-parity-guard.js` + конфиг-манифест (аналогично route-migration-matrix).

### 4.2 Дубли в CI gates

- `validate:static-publication` тянет **все** visual-parity + `audit-pro` + `data:consistency` + `migration:metadata:check:strict`.
- При этом есть отдельные `npm run xxx:visual-parity:audit`.
- В workflows и локальных скриптах — частичное дублирование проверок.

### 4.3 site-layered.css + site-modules.js (pilot, но живёт)

- Упоминается в SANDBOX-ENV и audit.
- Извлечение модулей из site.js (r262) было пилотом.
- Сейчас часть кода в `site-modules.js`, но не везде последовательно подключено.
- Это создаёт **две параллельные runtime-системы**.

---

## 5. Рецидивирующие регрессии (что возвращается)

1. **Floating controls / theme / search** — 4–5 фиксов за последние 2 недели (позиция, hitbox, single-active, revert R9).
2. **Cache-bust / hash drift** после Astro-компонентов.
3. **Tooltip nesting** (`.fn-marker .tooltip`) — было массово в v50, возвращается при правках сносок.
4. **Blanket shadow-wrap** — r260 вернул 19 routes в full shadow (была попытка native).
5. **OG vs LCP** — постоянно всплывает в audit-pro.

**Паттерн:** Почти все регрессии — на стыке **legacy transport** и **новых Astro компонентов**.

---

## 6. Положительные аспекты (чтобы не только критика)

- **Контрактная дисциплина** на уровне AGENTS.md и матриц — одна из лучших, что я видел.
- **Visual parity как религия** — правильно.
- **Multi-witness история** в AuditRepo — правильный подход.
- Чтение времени и data consistency в основном синхронизированы (большая работа проделана).
- Не создают новых CSS/JS файлов (жёстко держат).

---

## 7. Приоритетный repair order (хирургический план)

**P0 (сейчас):**
1. SW precache для site-layered.css + site-modules.js + всех Astro islands.
2. Единый post-strangler cache-bust механизм.
3. /izbrannoe/ → добавить в search-manifest или убрать из production-dist.

**P1:**
4. Унифицировать visual-parity guards (1 скрипт + manifest).
5. Закрыть OG/LCP debt: добавить поле `ogIsIntentionalLcpMismatch` в route profiles.
6. Завершить Gill Spravochnik + Context до реального MDX (или явно задокументировать "componentized legacy body" как целевое состояние).
7. Floating controls — вынести в отдельный audited компонент с собственным тестом (не внутри 29 модуля site.js).

**P2 (архитектурная гигиена):**
- Удалить/объединить дублирующие parity скрипты.
- Сделать `strict-native-app` чётко определённым (уже частично сделано в матрице 2026-06-26).
- Аудит site-modules.js vs site.js — что реально используется.

---

## 8. Рекомендации по процессу (для будущих агентов)

1. **Перед любой работой с runtime/JS/CSS** — обязательно `npm run guard:shared-files` + `migration:metadata:check`.
2. **При работе с Astro components** — всегда запускать **соответствующий** `xxx-visual-parity-audit` + pixelmatch, а не только audit-pro.
3. **Никогда не править cache-bust вручную** — только через скрипт.
4. Любое изменение в floating controls / gbs2 / premium — требует `interactive-audit` + browser smoke.
5. При добавлении новой статьи/карты — сразу проверять `data:consistency` + `content:guard`.

---

**Заключение хирурга:**

Проект не "сломан". Он **перегружен защитными слоями**, которые сами стали источником рассинхронов. 

Самая большая опасность — не один большой баг, а **множество маленьких, хорошо замаскированных под "green gate"** рассинхронов между:
- build-артефактом (dist)
- runtime (site.js + modules)
- данными (series/search)
- визуальным контрактом (legacy HTML)

Рекомендую следующий спринт: **"Contract Consolidation"** — один unified parity + cache contract вместо 12 отдельных.

Готов углублять любой конкретный пункт (с evidence + точными файлами/строками). 

**Следующий шаг:** укажите, какой участок копать хирургическим скальпелем (Gill? Maps? Floating? SW? MDX target?).