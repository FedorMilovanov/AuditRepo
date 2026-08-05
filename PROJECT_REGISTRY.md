# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active** | Astro static site (gospod-bog.ru), strangler-миграция. **Старт: [`projects/gb-is-my-strength/DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md).** HEAD/счётчики/статус намеренно НЕ дублируются здесь (правило Single-Writer-Per-Fact, `CLEANUP_RETENTION_POLICY.md` §8) — они в матрице + `NEXT_AGENT_PROMPT.md`. |
| `projects/the-legendary-poet/` | `FedorMilovanov/TheLegendaryPoet` | **active** | W0–W2 закрыты на production `main@a248abd`; следующая линия — W3 community scaling. Старт: [`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md). |

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

- source `main@a248abd54007bd839ffc149b9195dc4e79dc5dd3`;
- W0 machine-checked project truth — source #303;
- committed discovery integrity и Safari readiness — source #305;
- W1 zero-loss Article retirement / single Essay model — source #308;
- W2 immutable essay publication — source #311;
- финальный exact W2 head `8eaeaa4abc7f80eb6b96de0657df0b3e255d96d3` прошёл Content model, Project contracts, CI, catalog, все Yesenin/Duncan publication gates, brand, routes и Manual Browser QA 4/4.

Точка входа:

➡️ **[`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md)**

Последняя verified-запись:

➡️ **[`projects/the-legendary-poet/verified/IMMUTABLE_ESSAY_PUBLICATION_2026-08-05.md`](projects/the-legendary-poet/verified/IMMUTABLE_ESSAY_PUBLICATION_2026-08-05.md)**

Последний exact-HEAD reverify:

➡️ **[`projects/the-legendary-poet/reverify/REVERIFY_a248abd_2026-08-05.md`](projects/the-legendary-poet/reverify/REVERIFY_a248abd_2026-08-05.md)**

Working matrix и wave plan сохраняют открытыми W3–W6. Предыдущие marathon, Playwright, system/content и source-library evidence-линии не перезаписаны.

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
