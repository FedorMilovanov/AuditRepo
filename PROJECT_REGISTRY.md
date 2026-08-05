# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active** | Astro static site (gospod-bog.ru), strangler-миграция. **Старт: [`projects/gb-is-my-strength/DOC_MAP.md`](projects/gb-is-my-strength/DOC_MAP.md).** HEAD/счётчики/статус намеренно НЕ дублируются здесь (правило Single-Writer-Per-Fact, `CLEANUP_RETENTION_POLICY.md` §8) — они в матрице + `NEXT_AGENT_PROMPT.md`. |
| `projects/the-legendary-poet/` | `FedorMilovanov/TheLegendaryPoet` | **active** | Source architecture, W0–W6 extraction и governance закрыты на `main@ccbdebc`; W6 retirement preparation verified, остаётся физическое удаление 32 refs. Старт: [`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md). |

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

- source `main@ccbdebc5e47d275561de9ec78f181e388e4a4e1a`;
- W0 machine-checked project truth — source #303;
- discovery integrity и Safari readiness — source #305;
- W1 zero-loss Article retirement / single Essay model — source #308;
- W2 immutable essay publication — source #311;
- W3 target-scoped community scaling — source #316;
- W4 workflow/performance consolidation — source #318;
- W3 current-production hardening — source #317;
- W5 premium reader certification and archive honesty — source #322;
- post-W5 machine-checked current architecture truth — source #325;
- W6 verified Mayakovsky media/provenance extraction — source #324, production `17d0017`;
- private package/engine/release/licensing governance — source #326, current production `ccbdebc`;
- W6 branch/artifact classification, Arena archive, deep-history preservation and deletion manifest — AuditRepo #185.

Точка входа:

➡️ **[`projects/the-legendary-poet/README.md`](projects/the-legendary-poet/README.md)**

Последняя verified-запись:

➡️ **[`projects/the-legendary-poet/verified/W6_RETIREMENT_PREPARATION_2026-08-05.md`](projects/the-legendary-poet/verified/W6_RETIREMENT_PREPARATION_2026-08-05.md)**

Последний exact source-HEAD reverify:

➡️ **[`projects/the-legendary-poet/reverify/REVERIFY_ccbdebc_2026-08-05.md`](projects/the-legendary-poet/reverify/REVERIFY_ccbdebc_2026-08-05.md)**

Working matrix фиксирует только `TLP-CLEAN-001` как `active-current`. Все кодовые, evidence и path-classification барьеры выполнены; 29 source и 3 AuditRepo stale refs ещё требуют настоящей delete-ref операции и последующей проверки отсутствия. Connected capability не предоставляет удаление refs, поэтому отсутствие этого шага не маскируется формулировкой «закрыто».

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
