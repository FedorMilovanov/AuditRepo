# Scripts

Небольшие утилиты для обслуживания `AuditRepo`.

## Available

### `scaffold_project.py`
Создаёт структуру нового проекта:

```bash
python3 scripts/scaffold_project.py <project-folder> --source-repo <owner/repo> [--production-url <url>]
```

### `scaffold_intake.py`
Создаёт intake-папку для нового агента/даты:

```bash
python3 scripts/scaffold_intake.py <project-folder> <agent-name> <YYYY-MM-DD>
```

### `check_auditrepo_structure.py`
Проверяет базовую структуру репозитория и отсутствие очевидных дыр:

```bash
python3 scripts/check_auditrepo_structure.py
```
