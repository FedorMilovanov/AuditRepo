#!/usr/bin/env python3
from pathlib import Path

matrix = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
workflow = Path('.github/workflows/_temp-materialize-matrix-e8c41d54.yml')
self_path = Path(__file__)
text = matrix.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    text = text.replace(old, new, 1)


replace_once('## ✅ P0/P1 — ОТКРЫТО (0)', '## 🔴 RELEASE-BLOCKING P0/P1 — ОТКРЫТО (0)', 'release-blocking heading')
replace_once(
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | PR #283 merged; PR #280 closed; PR #286 sole follow-up |',
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | `d94b5488` |',
    'print immutable ref',
)
replace_once(
    '| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | AuditRepo `6cba8af0`; run `30166440002` |',
    '| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | `6cba8af0` |',
    'validator immutable ref',
)
old_gap = '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `e8c41d54` are imported. Superseded issue #289 was closed without claiming deployment. | `e8c41d54` candidate; evidence import pending |'
new_gap = '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `e8c41d54` are imported. Superseded issue #289 was closed without claiming deployment. | `incoming/auditor-brain/2026-07-25-r2/REPORT.md`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_e8c41d54_auditor-r2.md` |'
replace_once(old_gap, new_gap, 'production evidence witness')
editorial = '| EDITORIAL-PROJECTION-51-DRIFT | Projection-only Search/RSS observations must not overwrite canonical editorial dates. Reconcile the 51-field diff by field class and retain human editorial authority; do not add a generic writer merely to make the workflow green. | source issue #217; `reverify/MULTIAGENT_CONVERGENCE_2026-07-25_d94b5488.md` |'
if 'EDITORIAL-PROJECTION-51-DRIFT |' in text:
    raise SystemExit('editorial row already registered')
text = text.replace(new_gap + '\n', new_gap + '\n' + editorial + '\n', 1)
replace_once('## 🟠 P1 — ОТКРЫТО (101)', '## 🟠 P1 — ОТКРЫТО (102)', 'P1 heading')
replace_once('| P1 открыто | 101 |', '| P1 открыто | 102 |', 'P1 stats')
replace_once('| **Всего открыто (матрица)** | **197** |', '| **Всего открыто (матрица)** | **198** |', 'total stats')
session_anchor = '## Session log (append-only)\n\n'
session = '- **2026-07-25 matrix diagnostics zeroed (`e8c41d54`)** — named the release-blocking P0/P1 section, registered editorial projection drift, attached explicit production-gap evidence, normalized immutable closed refs and aligned counters.\n\n'
if session not in text:
    if session_anchor not in text:
        raise SystemExit('session anchor missing')
    text = text.replace(session_anchor, session_anchor + session, 1)

matrix.write_text(text, encoding='utf-8')
if workflow.exists():
    workflow.unlink()
self_path.unlink()
