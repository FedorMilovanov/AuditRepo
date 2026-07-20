# NEXT AGENT PROMPT — gb-is-my-strength

> **Этот файл — SSOT по «где мы сейчас»** (текущий HEAD + что дальше). Карта всех
> документов и правило Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-20.** Source HEAD: `32ae0d7d62bee81737a9aae1f136946d047fe4fb`
> (`main`; genealogy atlas уже ушёл дальше milestone v1 — 256 этимологий, book-mode серии
> «Сердце» в коде уже landed, karty deep-audit на этом же HEAD).
> **Prod deploy 🔴 RED / STALE** — last GREEN: `007b67def5` @ 2026-07-11T03:46:58Z
> (run `29138555390`). Current HEAD deploy run `29621961761` FAIL на шаге
> **Static publication gates**. Локальное воспроизведение на current HEAD:
> `npm run validate:static-publication` падает в `audit-pro.js` на oversized raw atlas-export PNG:
> `images/atlas-export/shvatim-hires.png` и `images/atlas-export/shvatim-preview.png`.
> **Readers do not see current main.**
>
> **Авторитет при конфликте:** `verified/MASTER_BUG_MATRIX.md` (точечные баги + счётчики)
> и `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог W0–W10).  
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-20_32ae0d7d.md`.
> Прежние промпты (`2ca2af3b`, `b8459bdf`, `14a49be8`) устарели.

## Перед началом (обязательно)

```bash
git fetch --all --prune && git checkout main && git pull --ff-only && git rev-parse HEAD
# expect 32ae0d7d… or newer; if newer — write reverify delta first
```

1. Сверь HEAD: если `main` уехал с `32ae0d7d` — сначала reverify-дельта, не работай по этой правде вслепую.
2. Прочитай в source-репо: `AGENTS.md` (полностью, особенно §0, §3.10, §9, §13 Genealogy, «Верификационная дисциплина»), `docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`.
3. Прочитай здесь: `reverify/CURRENT_HEAD_REVERIFY_2026-07-20_32ae0d7d.md`, матрицу (masthead + P0 блок), SUPER_AUDIT §0–§3.

## Текущее состояние (одним абзацем)

**Прод устарел.** Main ушёл далеко вперёд (genealogy atlas уже 256 этимологий; серия «Сердце» book-shaped в коде; karty-audit на HEAD `32ae0d7d`), но **не деплоится**: current stop-point = `Static publication gates` → `audit-pro.js` красный на oversized raw atlas-export PNG (`shvatim-hires.png`, `shvatim-preview.png`). Старые 2026-07-14 блокеры `DEP-BLOCK-EDITORIAL-REGISTRY` / `DEP-BLOCK-MAPS-VALIDATE` / `DEP-BLOCK-CSS-IMPORTANT-CEILING` / `DEP-BLOCK-AVRAAM-AUDIT` больше не являются текущим стопом — они исторические/fixed и требуют последующей уборки строк в матрице без потери provenance. После разблокировки деплоя — снова W1 системно (concurrency, deterministic build, IndexNow asserts), затем W2–W10.

**Раздел карт /karty/ — глубокий аудит и аудит качества прорисовки (2026-07-19..20, 32ae0d7d62bee81737a9aae1f136946d047fe4fb): 88 багов в матрице (20 P0 + 78 P1 + 33 P2 + 45 P3 + 7 AuditRepo = 183 открытых).**  
- **Production Blockers:** `ASTRO-P0-01` (`TypeError: Cannot read properties of undefined (reading 'push')` на `/karty/avraam/`), `MAP-P0-01` (мобильная панель уходит до -581px за экран), `MAP-P0-02` (`getState is not defined`), `MAP-P0-03` (`inStory is not defined`), `DATA-P0-01` (игнорирование авторских кривых `stages[].paths` и авто-отрисовка прямых `L`-линий через горы и пустыни).
- **Quality & Vector Geography Crutches:** `BASE-P1-01` (пустой `<defs>` и 18 отсутствующих ID-линковок в `base-geo.svg`, `base-geo-mediterranean.svg`, `base-geo-urheimat.svg`, включая вершины гор `#hill`, `#peak`, `#peak-snow`, `#canaanRidge`, роняющие градиенты суши/моря/гор при загрузке движком), `BASE-P1-02` (принудительное `opacity="0.5"` в `map-engine.js:2612`, гасящее рельеф географии в 2 раза), `BASE-P1-03` (угольно-чёрная заливка `#22241f` и 6 слоев анимированного звёздного неба в `avraam/base.svg`, заслоняющие карту), `ARCH-P1-01` (раскол движков: пергаментный стиль изолирован в оффлайн-скрипте `sheet-engine.js`, а веб-клиент `map-engine.js` отдает тёмную схему), `MEDIA-P1-01` (100% фотографий мест — 312 ссылок — загружаются напрямую с внешнего CDN Wikimedia Commons без локального кэша в билде), `LOD-P1-01` (нескейлящаяся обводка 2.6px полностью затапливает просветы букв при сжатии шрифтов до 1.4–2.3px на ступени зума z4), `COMP-P1-01` (ошибка адаптивного расчёта экранной линейки масштаба до 22%), `RELIEF-P1-01` (горы в «эталонном» черновике `sheet-engine.js` выполнены примитивными SVG-овалами `<ellipse>` с штриховкой, а у `urheimat` рельеф пуст), `ROUTE-P1-01` (сплайны Катмулла-Рома заплывают в воду без костылей `route_via`), `GRAT-P1-01` (непроекционная аффинная сетка координат с отключением засечек `opacity: 0` при зуме >4%), `SEA-P1-01` (20px плиточный узор волн даёт эффект «кафельной плитки»), `ORN-P1-01` (3-линейные орнаменты уголков, русская «С» в компасе и формулы ширины картуша `length * 14.6`), `HALO-P1-01` (неиспользуемый массив `halos` и заплыв шрифта обводкой), `GLYPH-P1-01` (9 из 11 наборов данных карт имеют 0 иконок `glyph`, вырождаясь в обычные кружки), `SVG-P1-01` (неэкранированные `&nbsp;` в экспортированных SVG `images/atlas-export/*.svg`), `FONT-P1-01` (`font-family: Georgia, "Times New Roman"` для иврита в `.hw` `map-engine.js:463` вместо `Noto Serif Hebrew`), `MINI-P1-01` (миникарта без рельефа и морей + monkey-patch `flyTo`), `WAYP-P1-01` (неплашированные серые подписи археологии), `CSS-P1-01` (`destroy()` вырезает общий CSS-стиль), `SIG-P1-01` (жесткие пиксельные смещения в оверлеях кампаний), `DRAW-P1-03` (100% мест рендерятся плоскими кружками `r=4.5`, 0 архитектурных иконок во всех 11 `route.json`), `TEXT-P1-01` (моноширинный расчёт ширины плашек `length * 0.6` обрезает кириллический и еврейский текст).
- **Парадигма владельца (ВАРИАНТ 1):** карта должна быть красивой географической SVG-картой Ближнего Востока (пергамент, рельеф, синяя акватория, иконки мест, выноски-плашки, дуговые пути), а НЕ простой «картой-схемой» на чёрном фоне. Evidence: `incoming/arena-auditor-karty-verification/2026-07-20/EVIDENCE_BASEMAP_DEFS_AND_PARCHMENT_CANON_AUDIT.md`.

**Book mode / «Сердце».** Важно: source-код уже ушёл дальше старых prototype-веток AuditRepo. На `32ae0d7d` книжная модель **уже landed** в прод-коде: `shape:'book'`, главы `tier:'chapter'`, статьи `mark.kind:'arabic'`, chapter/article rail и 3-level TOC уже есть в `hardTextsSeriesConfig.ts`, `seriesConfig.ts`, `GillSeriesRail.astro`, `GillPartTocOverlay.astro`. Все book-ветки AuditRepo теперь — **историческое research/prototype evidence**, не текущий source-of-truth.

**Нагорная проповедь — 4 цикла аудита, 21 баг** (аудит 2026-07-14, cycles 1–4). Source HEAD: `21624a3e`. Корневой: **NG-DARK-01** — 374× `text-{accent}-600` + 108× `text-{accent}-700` + 168× `border-stone-100` без dark-ремапа; решение: `data-chapter="N"` + `--ng-accent`/`--ng-accent-text`/`--ng-accent-soft`/`--ng-border-soft` per-chapter CSS custom properties (закрывает 8+ багов). P1: NG-CSS-01 (tw.min.css без dark), NG-BODY-01 (bg-stone-100 на body > dark body), NG-STRUCT-01 (сломанные заголовки ch.2/ch.5 + emoji), NG-INLINE-01 (Из библиотеки inline → Astro-компонент). P2: NG-DEAD-01 (15 мёртвых компонентов), NG-INLINE-02 (152 inline styles), NG-SEO-01 (title≠og:title ×5), NG-TOC-01 (TOC не per-chapter), NG-DARK-04 (bg-rose-50 без dark remap), NG-DARK-05. P3: NG-CROSS-01, NG-SERIYA-01, NG-A11Y-01. Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md`.

## 🔥 Приоритет №1 — разблокировать деплой (один PR / один сабсистем «release-unblock»)

Текущий порядок (по `reverify/CURRENT_HEAD_REVERIFY_2026-07-20_32ae0d7d.md`):

1. Подтвердить текущий fail локально: `npm run validate:static-publication`
2. Починить/переместить/сжать oversized raw atlas-export PNG, из-за которых краснеет `audit-pro.js`:
   - `images/atlas-export/shvatim-hires.png`
   - `images/atlas-export/shvatim-preview.png`
3. Проверить, не требуют ли такого же решения соседние raw atlas-export артефакты (`avraam-*`)
4. Прогнать заново: `npm run validate:static-publication` → green
5. Пуш → подтвердить deploy GREEN на exact HEAD и только потом возвращаться к product/backlog lanes

**Не смешивать** с PremiumControls polish, mass glossary edits, Bible corpus, new feature work.

## Зоны in-flight — НЕ ТРОГАТЬ без владельца

- **PremiumControls / Floating Cluster / Gill-визуал** — freeze AGENTS §3.10  
- **Глоссарий (data/glossary.json) и Библия-тултипы** — данные владельца  
- **Genealogy visual language** — AGENTS §13; paradigm locked; continue atlas track only after deploy green unless owner says otherwise  

## Нагорная проповедь — актуальное состояние (3 цикла аудита 2026-07-14)

**20 багов** (6 P1 + 10 P2 + 4 P3). Архитектурный корень: **NG-CSS-01** — `tw.min.css` содержит 0 dark-селекторов, вся тёмная тема — `!important` хаки в `mobile-hotfix.css`.

**Ключевые P1:**
- **NG-DARK-01** → 54 Tailwind-класса без dark-ремапа (168× text-600, 47× text-700, 52× border-stone-100)
- **NG-CSS-01** → tw.min.css без dark-вариантов (архитектурная причина NG-DARK-01)
- **NG-BODY-01** → `bg-stone-100` на body не ремапится, фон светло-серый в dark
- **NG-STRUCT-01** → Секции ch.2–5 без group-wrapper (регресс Astro-миграции), emoji вместо SVG
- **NG-INLINE-01** → «Из библиотеки» на inline стилях, невидимы в dark

**Единое решение:** `data-chapter="N"` + per-chapter `--ng-accent`/`--ng-accent-soft` CSS custom properties → закрывает NG-CSS-01 + NG-BODY-01 + NG-DARK-01 + NG-DARK-04/05.

**Дальнейшие шаги:**
1. Создать `css/nagornaya-chapter-vars.css` с per-chapter CSS vars (light + dark)
2. Добавить `data-chapter="N"` на `<body>` в 5 `index.astro`
3. Заменить accent Tailwind-классы на `var(--ng-accent)` в Section-компонентах
4. Создать `NagornayaLibraryLinks.astro` → убирает ~98 inline style=
5. Удалить 15 мёртвых компонентов
6. Fix NG-SEO-01 (add scripture meta ch.4/5, update footer version)

Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_DEEP_AUDIT_CYCLE3_2026-07-14.md`

## Жёсткие правила (не обсуждаются)

1. Один сабсистем на PR. Волны SUPER_AUDIT не смешивать.  
2. SHA-first: любой фикс/закрытие — immutable SHA + команда + результат.  
3. Зелёный шаг workflow ≠ доказательство (IndexNow `|| true`; `[skip ci]` HEAD).  
4. Паритет Astro↔legacy ≠ правда контента.  
5. Не ослаблять гейты «чтобы задеплоить» без замещающего контракта.  
6. Не переоткрывать ЗАКРЫТО (см. матрицу) и опровергнутое SUPER_AUDIT §1.  
7. Позитивные заявления — только invariant + environment + negative test (GATE-29).  
8. AuditRepo: матрица + этот файл атомарно с правдой HEAD/deploy.

## Формат финального отчёта

```text
Source functional SHA / bot SHA / deployed SHA:
AuditRepo SHA:
Canonical IDs (матрица/SUPER_AUDIT):
Root cause:
Fix + files:
Tests / mutation tests:
Production-like result (какая цепочка, точный SHA):
Remaining risks:
AuditRepo update (коммит):
```
