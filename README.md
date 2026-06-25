# AuditRepo

Центральный репозиторий для **мультиагентных аудитов, баг-репортов и верификационных прогонов**.

Идея:
- 5–10 агентов независимо прогоняют проект;
- каждый складывает свои отчёты в `incoming/`;
- сильный верификатор собирает сводную матрицу багов;
- после этого отдельный implementation-агент чинит уже **подтверждённые** баги.

## Структура

```text
projects/
  _templates/                ← шаблоны для агентов и верификаторов
  <project>/
    README.md                ← краткое описание проекта и правил
    incoming/                ← сырые отчёты агентов (не редактировать)
      <agent-name>/
        <YYYY-MM-DD>/
          *.md
    working/                 ← сводные промежуточные документы
    verified/                ← финальные проверенные отчёты / bug ledgers
```

## Правила работы

1. **Не переписывать чужие сырые отчёты** в `incoming/`.
2. Каждый агент кладёт отчёты в свою папку:
   - `projects/<project>/incoming/<agent>/<date>/...`
3. Сводные документы делать в:
   - `projects/<project>/working/`
4. Финально подтверждённые документы переносить/дублировать в:
   - `projects/<project>/verified/`
5. Если баг не подтверждён — помечать как:
   - `suspected`
   - `needs-verification`
6. Если баг подтверждён в браузере / build artifact / production-like сборке — помечать как:
   - `confirmed`

## Рекомендуемый workflow

### Агент-аудитор
- запускает проверки;
- пишет отчёт по шаблону `_templates/AGENT_REPORT_TEMPLATE.md`;
- фиксирует команды, артефакт, route, severity, evidence;
- кладёт в `incoming/<agent>/<date>/`;

### Агент-верификатор
- читает все `incoming/`;
- кросс-сверяет находки двух+ агентов;
- убирает дубли и false positives;
- разделяет: route bugs / shared runtime bugs / tooling drift / false positives;
- собирает `working/VERIFIER_SYNTHESIS_*.md` и `verified/BUG_LEDGER_*.md`;
- использует шаблон `_templates/VERIFIER_SYNTHESIS_TEMPLATE.md`.

### Агент-исправитель
- берёт **только** `verified/BUG_LEDGER_*.md` и подтверждённые пункты;
- не тратит время на ложные срабатывания и несверенные догадки;
- после правки обновляет статус в ledger.

## Важные принципы

- **Метод верификации важен:** указывай, как проверял (Playwright / static / git history).
- **Версия имеет значение:** PS-01 воспроизводился на СТАРОМ dist, в HEAD может быть fixed.
- **Мусор ≠ баг:** dead code не ломает функциональность, но документируется отдельно.
- **Cross-verification:** баг считается confirmed только если подтверждён 2+ агентами или прямым кодом.

## Проекты

Сейчас инициализирован:
- `projects/gb-is-my-strength/` — gospod-bog.ru

Позже можно добавлять другие проекты тем же способом.

## Быстрый старт для новых агентов

1. Найди проект в `PROJECT_REGISTRY.md`
2. Создай intake-папку через:
   - `python3 scripts/scaffold_intake.py <project> <agent> <YYYY-MM-DD>`
3. Положи сырые отчёты в `incoming/`
4. Не пиши сразу в `verified/`
5. Верификатор собирает сводку в `working/`, затем переносит подтверждённое в `verified/`

## Жёсткое правило

```text
If a report is not inside projects/<project>/incoming/<agent>/<YYYY-MM-DD>/,
it is not an official audit input.
```

То есть отчёты вне project-scoped intake-папки должны считаться неофициальными и игнорироваться до нормального intake.

## SHA-first principle

```text
A bug without SHA is not repair-ready.
A bug without evidence is not confirmed.
A bug confirmed on old SHA must be reverified before implementation.
```

AuditRepo — это не source repo. Это слой координации и доказательств.
