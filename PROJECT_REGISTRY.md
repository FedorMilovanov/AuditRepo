# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active** | Astro static site (gospod-bog.ru), strangler-миграция. **Старт: [`projects/gb-is-my-strength/DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md).** HEAD/счётчики/статус намеренно НЕ дублируются здесь (правило Single-Writer-Per-Fact, `CLEANUP_RETENTION_POLICY.md` §8) — они в матрице + `NEXT_AGENT_PROMPT.md`. |
| `projects/the-legendary-poet/` | `FedorMilovanov/TheLegendaryPoet` | **active** | W0–W5 закрыты на production `main@db6bc3e`; W6 branch/artifact retirement активна. Старт: [`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md). |

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- `repair-ready` — current operational truth reconciled; implementation agents may proceed
- `repair-in-progress` — implementation идёт, но reverify ещё не закрыло цикл
- `reverify-needed` — source repo ушёл вперёд, нужен новый HEAD-pass
- `archived` — проект завершён

## gb-is-my-strength — где правда

Этот registry намеренно **не** хранит HEAD, счётчики и «current truth» проекта — они
дрейфовали, когда жили в 4 файлах сразу (находка AR-014). Единая точка входа и карта
всех документов проекта:

➡️ **[`projects/gb-is-my-strength/DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md)**

Оттуда — к канонам: `verified/MASTER_BUG_MATRIX.md` (баги),
`NEXT_AGENT_PROMPT.md` (текущий HEAD / что дальше),
`verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (системный бэклог, волны W1–W10),
`PremiumControls/README.md` (in-flight зона владельца).

## the-legendary-poet — текущая правда

Проект имеет статус `active`. Текущая verified production точка:

- source `main@db6bc3ea8997f78d1370a05e2736cf20645c80dd`;
- W0 machine-checked project truth — source #303;
- committed discovery integrity и Safari readiness — source #305;
- W1 zero-loss Article retirement / single Essay model — source #308;
- W2 immutable essay publication — source #311;
- W3 target-scoped community scaling — source #316;
- W4 workflow/performance consolidation — source #318;
- W3 current-production hardening — source #317;
- W5 premium reader certification and archive honesty — source #322, production `6f13600`;
- post-W5 machine-checked current architecture truth — source #325, current production `db6bc3e`;
- exact W5 head `0536547e178fb091de1a76c85aecec4409478975` прошёл полный source matrix и Manual Browser QA 4/4;
- exact truth head `c73cdcb35d30091264db5bf8c1db1c2b0cd46135` прошёл Project contracts, CI, route, brand и Manual Browser QA 4/4.

Точка входа:

➡️ **[`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md)**

Последняя verified-запись:

➡️ **[`projects/the-legendary-poet/verified/PREMIUM_READER_AND_CURRENT_TRUTH_2026-08-05.md`](projects/the-legendary-poet/verified/PREMIUM_READER_AND_CURRENT_TRUTH_2026-08-05.md)**

Последний exact-HEAD reverify:

➡️ **[`projects/the-legendary-poet/reverify/REVERIFY_db6bc3e_2026-08-05.md`](projects/the-legendary-poet/reverify/REVERIFY_db6bc3e_2026-08-05.md)**

Working matrix и wave plan фиксируют W6 branch/artifact retirement как `active-current`; owner-governance остаётся отдельным решением. Draft AuditRepo #185 владеет W6-инвентарём и не является closure-доказательством до fresh-base reconciliation.

## How to add a new project

1. Создать папку через scaffold:
   - `python3 scripts/scaffold_project.py <project-folder> --source-repo <owner/repo> [--production-url <url>]`
2. Убедиться, что создан `PROJECT_META.yml`
3. Внести запись в этот registry
4. При первом intake создать:
   - `python3 scripts/scaffold_intake.py <project> <agent> <YYYY-MM-DD>`
5. После первой verified-волны добавить:
   - `verification/START_HERE_<date>.md`
   - `verified/START_HERE_<date>.md`
