# Scripts

Утилиты для обслуживания AuditRepo.

## Quick start

```bash
# Создать новый intake для агента
python3 scripts/scaffold_intake.py gb-is-my-strength my-agent-name <YYYY-MM-DD>

# Создать новый проект
python3 scripts/scaffold_project.py <new-project-folder> --source-repo <owner/repo>

# Проверить структуру
python3 scripts/check_auditrepo_structure.py

# Проверить правила репозитория
python3 scripts/validate_audit_repo.py
```

---

## scaffold_intake.py

Создаёт полную intake-папку агента со всеми сабфолдерами новой модели:

```
projects/<project>/incoming/<agent>/<YYYY-MM-DD>/
    README.md      ← identity, scope, status rules, freedom-with-evidence
    REPORT.md      ← универсальный 9-секционный рабочий пакет
    comments/      ← комментарии к чужим находкам (comment-on-*.md)
    proposals/     ← предложения статуса/severity/merge/repair (proposal-*.md)
    evidence/      ← grep output, логи, трассы
    artifacts/     ← патчи, сниппеты, скрины
    commands.log   ← команды аудита
```

### Режим свободного intake

Агент пишет в свой intake всё что хочет:
- **New findings** (секция 1 «New observations»)
- **Confirmations** существующих находок (секция 2 «Confirmations and extensions»)
- **Challenges / Disputes** — оспаривание чужих находок (секция 3)
- **Duplicate / Merge proposals** — кластеры root cause (секция 4 «Root-cause clusters»)
- **Severity proposals** — оценка ценности и стоимости (секция 5 «Value and cost assessment»)
- **Reverify notes** — предлагаемая verification wave (секция 6)
- **Repair lane suggestions** (секция 7 «Suggested repair boundaries»)
- **Owner decisions** (секция 8)
- **Notes for verifier** (секция 9 «Summary for verifier»)

### Комментарии к чужим находкам

Агент **НЕ редактирует** чужой файл. Он создаёт свой comment:

```bash
# После scaffold создать файл в comments/
touch projects/gb-is-my-strength/incoming/my-agent/2026-06-25/comments/comment-on-arena-agent-round3-P1-14.md
```

Шаблон: `projects/_templates/COMMENT_TEMPLATE.md`

### Proposals

Агент создаёт proposals в `proposals/`:

```bash
touch projects/gb-is-my-strength/incoming/my-agent/2026-06-25/proposals/proposal-P1-14-severity-up.md
```

Proposal statuses: proposal-open → proposal-supported → proposal-accepted / proposal-rejected / proposal-conflicted / proposal-superseded

---

## scaffold_project.py

Создаёт структуру нового проекта:

```bash
python3 scripts/scaffold_project.py <project-folder> --source-repo <owner/repo> [--production-url <url>]
```

Создаёт `projects/<project>/` со стандартными папками (`incoming`, `working`, `verification`, `verified`, `repairs`, `reverify`, `legacy`, `archive`), файлами `README.md`, `DOC_MAP.md`, `WORK_QUEUE.md`, `PROJECT_META.yml` и стартовыми `verified/`-документами (`MASTER_BUG_MATRIX.md`, `SYSTEM_THEMES.md`, `CLOSURE_LEDGER.md`).

---

## check_auditrepo_structure.py

Проверяет базовую структуру репозитория:

```bash
python3 scripts/check_auditrepo_structure.py
```

Отсутствие очевидных дыр: нужные папки существуют, README на месте.

---

## validate_audit_repo.py

Более строгая проверка:

```bash
python3 scripts/validate_audit_repo.py
```

---

## scaffold_reverify.py

Создаёт новый reverify-файл под конкретный HEAD SHA:

```bash
python3 scripts/scaffold_reverify.py <project> <YYYY-MM-DD> <sha>
```

---

## scaffold_retirement_review.py

Создаёт review-файл для подозрения на stale / false positive:

```bash
python3 scripts/scaffold_retirement_review.py <project> <BUG-ID> <YYYY-MM-DD>
```

---

## Governance model reference

Канонический lifecycle находки — `AUDITREPO_OPERATING_MODEL.md`, таблица «Жизненный цикл находки»:

```
raw → candidate → verified-at-anchor → selected-for-current-check
→ current-local / systemic-root / duplicate-symptom / owner-decision / parked
→ fixing → closed-by-fix / absorbed-by-system-fix
терминальные (убрать из MASTER): stale / invalid / accepted-risk / not-worth-fixing
```

Evidence labels и пропорциональная планка свидетелей — `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`.

Proposal lifecycle (папка `proposals/` в intake):
  proposal-open → proposal-supported → proposal-accepted (находка меняет статус)
  proposal-open → proposal-conflicted → решается как конфликт в `verification/`
  proposal-open → proposal-rejected
  proposal-open → proposal-superseded

---

## Machine contract

Валидаторы из `scripts/` выполняются CI на каждый PR (workflow `.github/workflows/auditrepo-validate.yml`): структура репозитория, правила intake и regression-тесты скриптов. Документация должна соответствовать фактическим правилам валидаторов, а не наоборот; правки документации не должны ломать CI.
