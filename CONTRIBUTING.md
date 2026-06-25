# Contributing / Agent Workflow

Этот репозиторий задуман как **multi-agent audit intake hub**.

## Core rule

```text
incoming = raw evidence
working  = synthesis in progress
verified = confirmed final truth
```

Нельзя перескакивать сразу в `verified/` без сверки.

---

## Folder contract

Для ускорения можно использовать встроенные скрипты:

```bash
python3 scripts/scaffold_project.py <project-folder> --source-repo <owner/repo> [--production-url <url>]
python3 scripts/scaffold_intake.py <project-folder> <agent-name> <YYYY-MM-DD>
python3 scripts/check_auditrepo_structure.py
```

### Raw intake

```text
projects/<project>/incoming/<agent-name>/<YYYY-MM-DD>/
```

Что туда класть:
- сырые отчёты
- route scans
- bug ledgers
- logs / markdown summaries
- screenshots, если нужно (лучше рядом подпапкой `artifacts/`)

### Working synthesis

```text
projects/<project>/working/
```

Что туда класть:
- промежуточные bug matrices
- route maps
- duplicate-finding cleanup docs
- shared runtime vs route bug triage
- repair-order drafts

### Verified

```text
projects/<project>/verified/
```

Что туда класть:
- только подтверждённые итоговые документы
- final bug ledger
- verifier-approved repair order
- false-positive registry, если он уже подтверждён

---

## Naming rules

### Reports

Рекомендуемый формат:

```text
<topic>-YYYY-MM-DD.md
<topic>-round2-YYYY-MM-DD.md
<topic>-matrix-YYYY-MM-DD.md
```

Примеры:
- `runtime-bug-ledger-2026-06-25.md`
- `interactive-audit-drift-round2-2026-06-25.md`
- `premium-surface-bug-matrix-2026-06-25.md`

### Agent names

Использовать стабильное имя агента:

```text
arena-agent
cursor-agent-1
claude-auditor
gemini-scan-02
```

Не использовать абстрактные папки вроде:
- `tmp`
- `new`
- `reports`

---

## Verifier protocol

Верификатор должен:

1. Прочитать всё в `incoming/`
2. Свести дубликаты
3. Разделить:
   - shared runtime bugs
   - route-level bugs
   - metadata/content bugs
   - audit false positives
   - source-layer drift
4. Сформировать bug matrix в `working/`
5. Только после подтверждения перенести итог в `verified/`

---

## Implementation handoff protocol

Implementation-агент должен читать:
- `verified/`
- при необходимости итоговый matrix в `working/`

Implementation-агент **не должен** начинать с сырых intake-отчётов, если уже есть verified synthesis.

---

## What not to do

- не переписывать чужие intake-отчёты
- не удалять старые входящие файлы без причины
- не считать каждый audit failure автоматически route bug
- не смешивать source-layer drift и production artifact bugs
- не класть непроверенные догадки в `verified/`
