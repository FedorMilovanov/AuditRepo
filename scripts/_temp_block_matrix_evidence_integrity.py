#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
MATRIX = ROOT / 'projects' / 'gb-is-my-strength' / 'verified' / 'MASTER_BUG_MATRIX.md'
VALIDATE_WORKFLOW = ROOT / '.github' / 'workflows' / 'auditrepo-validate.yml'
TEMP_WORKFLOW = ROOT / '.github' / 'workflows' / '_temp-block-matrix-evidence-integrity.yml'
SELF = Path(__file__).resolve()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected exactly one match, got {count}')
    return text.replace(old, new, 1)


matrix = MATRIX.read_text(encoding='utf-8')

matrix = replace_once(
    matrix,
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | PR #283 merged; PR #280 closed; PR #286 sole follow-up |',
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | `d94b5488` PR#283 merged; PR#280 closed; PR#286 sole follow-up |',
    'immutable print ownership ref',
)
matrix = replace_once(
    matrix,
    '| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | AuditRepo `6cba8af0`; run `30166440002` |',
    '| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | `6cba8af0` AuditRepo PR#49; run `30166440002` |',
    'immutable validator ref',
)

production_row = '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `e8c41d54` are imported. Superseded issue #289 was closed without claiming deployment. | `e8c41d54` candidate; evidence import pending |'
production_fixed = '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `e8c41d54` are imported. Superseded issue #289 was closed without claiming deployment. | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md`; source candidate `e8c41d54` |'
matrix = replace_once(matrix, production_row, production_fixed, 'production evidence path')

editorial_row = '| EDITORIAL-PROJECTION-51-DRIFT | Exact freeze audit proves 51 projection-only differences after Search/Index normalization: 43 RSS timestamps and 8 search-manifest fields. Reconcile only those observations/provenance; preserve canonical editorial dates/review states and do not introduce an automatic editorial writer. | source issue #217; reverify/MULTIAGENT_CONVERGENCE_2026-07-25_d94b5488.md; exact artifact `8601838939` |'
if 'EDITORIAL-PROJECTION-51-DRIFT' in matrix:
    raise RuntimeError('EDITORIAL-PROJECTION-51-DRIFT already registered')
matrix = replace_once(matrix, production_fixed, production_fixed + '\n' + editorial_row, 'register editorial projection drift')
matrix = replace_once(matrix, '## 🟠 P1 — ОТКРЫТО (101)', '## 🟠 P1 — ОТКРЫТО (102)', 'P1 counter')

# Recalculate the summary from the canonical section counters.
patterns = {
    'closed': r'^## ✅ ЗАКРЫТО \((\d+)\)$',
    'p0': r'^## ✅ P0/P1 — ОТКРЫТО \((\d+)\)$',
    'p1': r'^## 🟠 P1 — ОТКРЫТО \((\d+)\)$',
    'p2': r'^## 🟡 P2 — ОТКРЫТО \((\d+)\)$',
    'p3': r'^## 🟢 P3 — ОТКРЫТО \((\d+)\)$',
    'refactor': r'^## 🔵 P3 — РЕФАКТОРИНГ \((\d+)\)$',
    'auditrepo': r'^## 🟣 AUDITREPO \((\d+)\)$',
}
counts = {}
for key, pattern in patterns.items():
    found = re.findall(pattern, matrix, re.MULTILINE)
    if len(found) != 1:
        raise RuntimeError(f'{key}: expected one counter, got {found}')
    counts[key] = int(found[0])
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
stats = f'''## Статистика (обновлено 2026-07-25: blocking matrix evidence integrity)

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
matrix, substitutions = stats_pattern.subn(stats, matrix, count=1)
if substitutions != 1:
    raise RuntimeError(f'statistics replacement count: {substitutions}')

session_match = re.search(r'^## Session log(?: \(append-only\))?\n', matrix, re.MULTILINE)
if not session_match:
    raise RuntimeError('session log header not found')
entry = '\n- **2026-07-25 matrix evidence integrity** — exact coverage artifact had four actionable diagnostics, not 174 orphan claims: one orphan production-evidence row, one unregistered `EDITORIAL-PROJECTION-51-DRIFT`, and two non-immutable closed-row refs. All four were repaired and matrix coverage became blocking instead of `--warn-only`.\n'
matrix = matrix[:session_match.end()] + entry + matrix[session_match.end():]
MATRIX.write_text(matrix, encoding='utf-8')

workflow = VALIDATE_WORKFLOW.read_text(encoding='utf-8')
workflow = replace_once(workflow, '  matrix-coverage-diagnostic:\n', '  matrix-coverage:\n', 'coverage job name')
workflow = replace_once(workflow, '          python3 scripts/check_matrix_coverage.py \\\n            --warn-only \\\n            --verbose \\\n', '          python3 scripts/check_matrix_coverage.py \\\n            --verbose \\\n', 'remove warn-only')
VALIDATE_WORKFLOW.write_text(workflow, encoding='utf-8')

for temp in (SELF, TEMP_WORKFLOW):
    if temp.exists():
        temp.unlink()

print('BLOCKING MATRIX EVIDENCE INTEGRITY: PASS')
print(counts)
print({'open_total': open_total})
