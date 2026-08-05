# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active** | Astro static site (gospod-bog.ru), strangler-миграция. **Старт: [`projects/gb-is-my-strength/DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md).** HEAD/счётчики/статус намеренно НЕ дублируются здесь (правило Single-Writer-Per-Fact, `CLEANUP_RETENTION_POLICY.md` §8) — они в матрице + `NEXT_AGENT_PROMPT.md`. |
| `projects/the-legendary-poet/` | `FedorMilovanov/TheLegendaryPoet` | **active** | Марафонская repair-волна закрыта на production `main@e06d759`; source/library intake сохранён отдельной линией. Старт: [`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md). |

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

Проект переведён из `intake-only` в `active` после первой полной verified repair-волны.
Source PR `FedorMilovanov/TheLegendaryPoet#286` прошёл точную PR-матрицу на head
`25cfa99e7b20af4d1c78b3ed1c7fd219878f8a81` и был squash-merged в production
`main@e06d75970cf1262f4dab5bfd941e45328f07f747`.

Точка входа:

➡️ **[`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md)**

Каноническая verified-запись:

➡️ **[`projects/the-legendary-poet/verified/START_HERE_2026-08-05.md`](projects/the-legendary-poet/verified/START_HERE_2026-08-05.md)**

Exact-HEAD reverify:

➡️ **[`projects/the-legendary-poet/reverify/REVERIFY_e06d759_2026-08-05.md`](projects/the-legendary-poet/reverify/REVERIFY_e06d759_2026-08-05.md)**

Governed source-library intake остаётся отдельным доказательным пакетом и не заменён
repair-закрытием.

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
