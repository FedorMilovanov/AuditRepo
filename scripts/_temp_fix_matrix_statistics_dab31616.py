#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
MATRIX = ROOT / 'projects' / 'gb-is-my-strength' / 'verified' / 'MASTER_BUG_MATRIX.md'
WORKFLOW = ROOT / '.github' / 'workflows' / '_temp-fix-matrix-statistics-dab31616.yml'
SELF = Path(__file__).resolve()

text = MATRIX.read_text(encoding='utf-8')

expected_headers = {
    'closed': r'^## ✅ ЗАКРЫТО \((\d+)\)$',
    'p0': r'^## ✅ P0/P1 — ОТКРЫТО \((\d+)\)$',
    'p1': r'^## 🟠 P1 — ОТКРЫТО \((\d+)\)$',
    'p2': r'^## 🟡 P2 — ОТКРЫТО \((\d+)\)$',
    'p3': r'^## 🟢 P3 — ОТКРЫТО \((\d+)\)$',
    'refactor': r'^## 🔵 P3 — РЕФАКТОРИНГ \((\d+)\)$',
    'auditrepo': r'^## 🟣 AUDITREPO \((\d+)\)$',
}
counts = {}
for key, pattern in expected_headers.items():
    matches = re.findall(pattern, text, re.MULTILINE)
    if len(matches) != 1:
        raise RuntimeError(f'{key}: expected one section counter, got {matches}')
    counts[key] = int(matches[0])

open_total = counts['p0'] + counts['p1'] + counts['p2'] + counts['p3'] + counts['refactor'] + counts['auditrepo']

stats_pattern = re.compile(
    r'^## Статистика \(обновлено .*?\)\n\n'
    r'\| Категория \| Количество \|\n'
    r'\|---\|---\|\n'
    r'\| Закрыто \(fixed\) \| \d+ \|\n'
    r'\| \*\*P0 открыто\*\* \| \*\*\d+\*\* \|\n'
    r'\| P1 открыто \| \d+ \|\n'
    r'\| P2 открыто \| \d+ \|\n'
    r'\| P3 открыто \| \d+ \|\n'
    r'\| Рефакторинг \| \d+ \|\n'
    r'\| AuditRepo \| \d+ \|\n'
    r'\| \*\*Всего открыто \(матрица\)\*\* \| \*\*\d+\*\* \|',
    re.MULTILINE,
)
replacement = f'''## Статистика (обновлено 2026-07-25: source dab31616 + auditor R2 SSOT reconciliation)

| Категория | Количество |
|---|---|
| Закрыто (fixed) | {counts['closed']} |
| **P0 открыто** | **{counts['p0']}** |
| P1 открыто | {counts['p1']} |
| P2 открыто | {counts['p2']} |
| P3 открыто | {counts['p3']} |
| Рефакторинг | {counts['refactor']} |
| AuditRepo | {counts['auditrepo']} |
| **Всего открыто (матрица)** | **{open_total}** |'''
text, substitutions = stats_pattern.subn(replacement, text, count=1)
if substitutions != 1:
    raise RuntimeError(f'statistics table: expected one replacement, got {substitutions}')

MATRIX.write_text(text, encoding='utf-8')
for temp in (SELF, WORKFLOW):
    if temp.exists():
        temp.unlink()

print('MATRIX STATISTICS RECONCILIATION: PASS')
print(counts)
print({'open_total': open_total})
