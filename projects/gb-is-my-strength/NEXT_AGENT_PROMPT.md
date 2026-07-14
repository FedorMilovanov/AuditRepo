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
