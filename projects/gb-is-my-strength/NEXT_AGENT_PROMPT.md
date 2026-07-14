# NEXT AGENT PROMPT — gb-is-my-strength

> **Этот файл — SSOT по «где мы сейчас»** (текущий HEAD + что дальше). Карта всех
> документов и правило Single-Writer-Per-Fact: [`DOC_MAP.md`](./DOC_MAP.md).
>
> **Актуально на 2026-07-14.** Source HEAD: `2ca2af3b` (main; merge «Библейский атлас —
> карта Авраама» + genealogy atlas v1 + heart/mobile-chrome/atlas delta; **+287 commits**
> since previous SSOT `b8459bdf`).  
> **Prod deploy 🔴 RED / STALE** — last GREEN: `007b67def5` @ 2026-07-11T03:46Z
> (run `29138555390`). HEAD deploy run `29338523013` FAIL on **Static publication gates**.
> Since 07-11: ~59 failed + ~25 cancelled deploy runs. **Readers do not see current main.**
>
> **Авторитет при конфликте:** `verified/MASTER_BUG_MATRIX.md` (точечные баги + счётчики)
> и `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог W0–W10).  
> Reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md`.  
> Прежние промпты (2026-07-10 GREEN @ `b8459bdf`; Pass 71; `14a49be8`) устарели.

## Перед началом (обязательно)

```bash
git fetch --all --prune && git checkout main && git pull --ff-only && git rev-parse HEAD
# expect 2ca2af3b… or newer; if newer — write reverify delta first
```

1. Сверь HEAD: если `main` уехал с `2ca2af3b` — сначала reverify-дельта, не работай по этой правде вслепую.
2. Прочитай в source-репо: `AGENTS.md` (полностью, особенно §0, §3.10, §9, §13 Genealogy, «Верификационная дисциплина»), `docs/WORK_MODES.md`, `docs/OWNER-INVARIANTS.md`.
3. Прочитай здесь: `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_2ca2af3b.md`, матрицу (P0 блок), SUPER_AUDIT §0–§3.

## Текущее состояние (одним абзацем)

**Прод устарел.** Main полный контентом (генеалогический атлас v1, серия «Сердце», mobile-chrome, atlas sheets), но **не деплоится**: static gates красные. Канонические P0: `PROD-STALE-DEPLOY-RED`, `DEP-BLOCK-EDITORIAL-REGISTRY` (5 routes missing in editorial-metadata), `DEP-BLOCK-MAPS-VALIDATE` (hub 9≠10 + nachalo + avraam stats), `DEP-BLOCK-CSS-IMPORTANT-CEILING` (210>202), `DEP-BLOCK-AVRAAM-AUDIT`. Счётчики — только в матрице. После разблокировки деплоя — снова W1 системно (concurrency, deterministic build, IndexNow asserts), затем W2–W10.

**Нагорная проповедь — 4 цикла аудита, 21 баг** (аудит 2026-07-14, cycles 1–4). Source HEAD: `21624a3e`. Корневой: **NG-DARK-01** — 374× `text-{accent}-600` + 108× `text-{accent}-700` + 168× `border-stone-100` без dark-ремапа; решение: `data-chapter="N"` + `--ng-accent`/`--ng-accent-text`/`--ng-accent-soft`/`--ng-border-soft` per-chapter CSS custom properties (закрывает 8+ багов). P1: NG-CSS-01 (tw.min.css без dark), NG-BODY-01 (bg-stone-100 на body > dark body), NG-STRUCT-01 (сломанные заголовки ch.2/ch.5 + emoji), NG-INLINE-01 (Из библиотеки inline → Astro-компонент). P2: NG-DEAD-01 (15 мёртвых компонентов), NG-INLINE-02 (152 inline styles), NG-SEO-01 (title≠og:title ×5), NG-TOC-01 (TOC не per-chapter), NG-DARK-04 (bg-rose-50 без dark remap), NG-DARK-05. P3: NG-CROSS-01, NG-SERIYA-01, NG-A11Y-01. Evidence: `incoming/arena-auditor/2026-07-14/evidence/NAGORNAYA_DEEP_AUDIT_CYCLE4_2026-07-14.md`.

## 🔥 Приоритет №1 — разблокировать деплой (один PR / один сабсистем «release-unblock»)

Порядок (из reverify §1.4):

1. `node scripts/editorial-metadata-registry.js --write` (+ review) — 5 missing article routes  
2. Hub: «на аудите» **9 → 10** (legacy `karty/index.html` + Astro `KartyHeroSection`) **или** схема публикации nachalo  
3. `karty/nachalo/route.json` — schema complete **или** exclude draft from live `maps:validate`  
4. Avraam: sync `meta.stats` + HTML place IDs with route.json (babylon/mari/paran-region)  
5. CSS: ceiling ≥210 with note **или** remove ≥8 `!important` from `site.css`  
6. Локально: `npm run validate:static-publication` green → push → confirm deploy GREEN  

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
