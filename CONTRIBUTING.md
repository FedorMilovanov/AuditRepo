# Contributing / Agent Workflow

Этот репозиторий задуман как **multi-agent audit intake hub**.

## Core rule

```text
incoming = raw evidence
working  = synthesis in progress
verified = confirmed final truth
```

Нельзя перескакивать сразу в `verified/` без сверки.

## Official input rule

```text
Reports outside projects/<project>/incoming/<agent>/<YYYY-MM-DD>/ are ignored.
```

Если агент положил отчёт в корень репо, в чужую project-папку или сразу в `verified/`,
такой отчёт не должен считаться официальным входом в аудит, пока не будет переложен в
правильную intake-структуру.

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
4. Собрать **2–3 witness view** где возможно:
   - source witness
   - artifact witness
   - browser witness
   - optional history witness
5. Сформировать bug matrix в `working/`
6. Только после подтверждения перенести итог в `verified/`

Если баг начал выглядеть устаревшим или ложным, его нельзя сразу удалять.
Сначала открыть retirement / stale review и только после перепроверки по нескольким witness-углам переводить в `false-positive` / `fixed-current` / `stale-on-current-head`.

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
