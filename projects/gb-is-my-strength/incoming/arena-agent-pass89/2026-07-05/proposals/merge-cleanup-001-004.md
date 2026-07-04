# Proposal: Merge — BUG-CLEANUP-001..004 + BUG-CONFIG-003 → CLEANUP-ALL

## Identity
- **Project:** gb-is-my-strength
- **Proposed by:** arena-agent-pass89
- **Date:** 2026-07-05
- **Target finding ID(s):** BUG-CLEANUP-001, BUG-CLEANUP-002, BUG-CLEANUP-003, BUG-CLEANUP-004, BUG-CONFIG-003
- **Proposal type:** merge

## Current state
5 отдельных P3 багов в матрице:
| ID | Description | Size |
|----|-------------|------|
| BUG-CLEANUP-001 | 4 dead scripts | ~27KB |
| BUG-CLEANUP-002 | 52 lane files | 31MB |
| BUG-CLEANUP-003 | AUDIT_HISTORY.md | 187KB |
| BUG-CLEANUP-004 | BUGS_FOUND doc | 78KB |
| BUG-CONFIG-003 | Outdated description | 1 строка |

## Proposed change
Объединить в **CLEANUP-ALL** с подпунктами:
- (a) Удалить/архивировать 4 dead scripts
- (b) Архивировать 52 lane files
- (c) Архивировать AUDIT_HISTORY.md
- (d) Архивировать BUGS_FOUND doc
- (e) Обновить package.json description

## Why same root cause
Все 5 — dead/stale files cleanup. Один repair-прогон решает всё. 5 отдельных bug-ID в матрице создают ненужный шум.

## Canonical ID suggestion
**CLEANUP-ALL** → после исправления закрыть как fixed-current одной строкой.

## Proposal status: proposal-open
