# NEXT AGENT PROMPT — gb-is-my-strength

> **Этот файл — SSOT по «где мы сейчас»** (текущий HEAD + что дальше). Карта всех
> документов и правило Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-21.** Source HEAD: `1a66bd8ef6c0316842deef75371db9598f7a16c6`
> (`main`; PR #94–96 release/runtime fixes и PR #97 initial-state/deep-link transaction landed).
> **Release gates 🟢 GREEN / exact deployed SHA proof pending.** На PR #97 exact source tree прошли
> `validate:static-publication`, `guard:shared-files`, Shared Files Guard и Native Source Contract.
> Старый PNG stop-point (`shvatim-hires.png`, `shvatim-preview.png`) закрыт PR #94; последующий
> hash-drift `site-utils.js` на 38 HTML/Astro ссылках синхронизирован штатным cache-bust в PR #96.
> Не утверждать post-merge production GREEN, пока exact deployed SHA `1a66bd8` не подтверждён отдельным witness.
> 
> **Авторитет при конфликте:** `verified/MASTER_BUG_MATRIX.md` (точечные баги + счётчики)
> и `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог W0–W10).  
> Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md`.
> Прежние reverify (`32ae0d7d`, `2ca2af3b`, `b8459bdf`, `14a49be8`) исторические.

## Перед началом (обязательно)

```bash
git fetch --all --prune && git checkout main && git pull --ff-only && git rev-parse HEAD
# expect 1a66bd8… or newer; if newer — write reverify delta first
```

1. Сверь HEAD: если `main` уехал с `1a66bd8` — сначала reverify-дельта, не работай по этой правде вслепую.
2. Прочитай в source-репо: `AGENTS.md` (полностью, особенно §0, §3.10, §9, §13 Genealogy, «Верификационная дисциплина»), `docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`.
3. Прочитай здесь: `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md`, матрицу (masthead + P0 block), SUPER_AUDIT §0–§3.

## Текущее состояние (одним абзацем)

**Source release gates зелёные на `1a66bd8`.** PR #94 снял старый atlas-export PNG blocker; PR #95 закрыл дубли цитат, ARIA и конкурентный scroll-lock; PR #96 закрыл `MAP-P0-02`, `MAP-P0-03`, `MAP-P0-08`, `ASTRO-P0-01`, `ASTRO-P0-02`, добавил постоянный regression guard и исправил обнаруженный full-gate hash-drift `site-utils.js` в 38 HTML/Astro ссылках. Exact post-merge deployed SHA пока не подтверждён доступным connector witness, поэтому `PROD-STALE-DEPLOY-RED` не закрывать декларативно.

**Раздел карт /karty/ — живой P0 остаток после PR #97:** `MAP-P0-01` (mobile panel escape), `MAP-P0-06` (inert layer toggles), `MAP-P0-07` (theme variables не управляют hardcoded palette), `ASTRO-P0-03`..`ASTRO-P0-06` (warning/data counters/error fallback) и `DATA-P0-01` (authored curved paths игнорируются). `MAP-P0-04/05` закрыты единой initial-state транзакцией и browser witnesses на `ishod`/`avraam`; не переоткрывать без fresh witness на `1a66bd8` или новее.

- **Следующий обязательный SYSTEM lane:** `MAP-P0-06` + `MAP-P0-07` — рабочее membership-переключение слоёв и единая theme palette без визуального редизайна.
- **Затем:** mobile panel, data validation/fallback и authored route geometry отдельными lanes.
- **Парадигма владельца (ВАРИАНТ 1):** карта должна быть красивой географической SVG-картой Ближнего Востока (пергамент, рельеф, синяя акватория, иконки мест, выноски-плашки, дуговые пути), а НЕ простой «картой-схемой» на чёрном фоне.

**Book mode / «Сердце».** Важно: source-код уже ушёл дальше старых prototype-веток AuditRepo. На `1a66bd8` книжная модель **уже landed** в прод-коде: `shape:'book'`, главы `tier:'chapter'`, статьи `mark.kind:'arabic'`, chapter/article rail и 3-level TOC уже есть в `hardTextsSeriesConfig.ts`, `seriesConfig.ts`, `GillSeriesRail.astro`, `GillPartTocOverlay.astro`. Все book-ветки AuditRepo теперь — **историческое research/prototype evidence**, не текущий source-of-truth.

**Нагорная проповедь — 4 цикла аудита, 21 баг** (аудит 2026-07-14, cycles 1–4). Source HEAD: `21624a3e`. Корневой: **NG-DARK-01** — 374× `text-{accent}-600` + 108× `text-{accent}-700` + 168× `border-stone-100` без dark-ремапа; решение: `data-chapter="N"` + `--ng-accent`/`--ng-accent-text`/`--ng-accent-soft`/`--ng-border-soft` per-chapter CSS custom properties (закрывает 8+ багов). P1: NG-CSS-01 (tw.min.css без dark), NG-BODY-01 (bg-stone-100 на body > dark body), NG-STRUCT-01 (сломанные заголовки ch.2/ch.5 + emoji), NG-INLINE-01 (Из библиотеки inline → Astro-компонент). P2: NG-DEAD-01 (15 мёртвых компонентов), NG-INLINE-02 (152 inline styles), NG-SEO-01 (title≠og:title ×5), NG-TOC-01 (TOC не per-chapter), NG-DARK-04 (bg-rose-50 без dark remap), NG-DARK-05. P3: NG-CROSS-01, NG-SERIYA-01, NG-A11Y-01. Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md`.

## 🔥 Приоритет №1 — восстановить рабочие layers и реальную theme palette карт

Текущий порядок (по `reverify/CURRENT_HEAD_REVERIFY_2026-07-21_1a66bd8.md`):

1. Создать SYSTEM lane только для `MAP-P0-06` + `MAP-P0-07`.
2. Нормализовать layer membership: один элемент может принадлежать нескольким слоям, toggle не должен зависеть от exact equality одного `data-layer`.
3. Зафиксировать единый layer registry и проверять реальные DOM-match counts на `ishod` и `avraam`.
4. Вынести используемые SVG/DOM цвета в theme palette или CSS variables; toggle должен менять карту, маршруты, подписи и панели, а не только иконку.
5. Добавить static/pure guard и Chromium pixel/DOM witnesses минимум на двух live routes.
6. Перед merge: полный `validate:static-publication`, `guard:shared-files`, production-like build и browser witnesses.
7. Отдельно подтвердить exact deployed SHA `1a66bd8` или более новый и только тогда закрыть `PROD-STALE-DEPLOY-RED`.

**Не смешивать** с cartography redesign, mobile panel, authored path geometry, PremiumControls, glossary или content lanes.

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
