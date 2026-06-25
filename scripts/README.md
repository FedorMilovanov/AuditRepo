# Scripts

Утилиты для обслуживания AuditRepo.

## Quick start

```bash
# Создать новый intake для агента
python3 scripts/scaffold_intake.py gb-is-my-strength my-agent-name 2026-06-25

# Создать новый проект
python3 scripts/scaffold_project.py gb-is-my-strength --source-repo FedorMilovanov/gb-is-my-strength

# Проверить структуру
python3 scripts/validate_audit_repo.py
```

---

## scaffold_intake.py

Создаёт полную intake-папку агента со всеми сабфолдерами новой модели:

```
projects/<project>/incoming/<agent>/<YYYY-MM-DD>/
    README.md      ← identity, scope, status rules, freedom-with-evidence
    REPORT.md      ← универсальный 8-секционный рабочий пакет
    comments/      ← комментарии к чужим находкам (comment-on-*.md)
    proposals/     ← предложения статуса/severity/merge/repair (proposal-*.md)
    evidence/      ← grep output, логи, трассы
    artifacts/     ← патчи, сниппеты, скрины
    commands.log   ← команды аудита
```

### Режим свободного intake

Агент пишет в свой intake всё что хочет:
- **New findings** (секция 1)
- **Confirmations** существующих багов (секция 2)
- **Challenges / Disputes** — оспаривание чужих находок (секция 3)
- **Duplicate / Merge proposals** (секция 4)
- **Severity proposals** (секция 5)
- **Repair lane suggestions** (секция 6)
- **Reverify notes** — recheck на current HEAD (секция 7)
- **Notes for verifier** (секция 8)

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

Создаёт: `projects/<project>/` + incoming/working/verified/verification + _templates + PROJECT_META.yml

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

### `scaffold_reverify.py`
Создаёт новый reverify-файл под конкретный HEAD SHA:

```bash
python3 scripts/scaffold_reverify.py <project> <YYYY-MM-DD> <sha>
```

### `scaffold_retirement_review.py`
Создаёт review-файл для подозрения на stale / false positive:

```bash
python3 scripts/scaffold_retirement_review.py <project> <BUG-ID> <YYYY-MM-DD>
```

---

## Governance model reference

```
Status movement rules:
  L0 raw → L1 peer-reviewed (one agent confirmed/challenged)
  L1 → L2 confirmed-on-sha (2 agents OR direct evidence)
  L2 → L3 confirmed-current (reverified on HEAD)
  L3 → L4 repair-ready (confirmed + evidence + lane + not-stale)

Proposal lifecycle:
  proposal-open → proposal-supported → proposal-accepted (bug moves)
  proposal-open → proposal-conflicted → resolved in conflicts/
  proposal-open → proposal-rejected
  proposal-open → proposal-superseded
```

Подробнее: README.md секция «Multi-Level Verification Ladder» и «Proposal Status Lifecycle». (feat(auditrepo): add Governed Freedom Model — README, templates, scaffold)
