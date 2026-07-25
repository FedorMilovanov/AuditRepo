#!/usr/bin/env python3
from pathlib import Path

MATRIX = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
WORKFLOW = Path('.github/workflows/_temp-fix-matrix-statistics-dab31616.yml')
SELF = Path(__file__)

text = MATRIX.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    text = text.replace(old, new, 1)


replace_once(
    '## ✅ P0/P1 — ОТКРЫТО (0)',
    '## 🔴 RELEASE-BLOCKING P0/P1 — ОТКРЫТО (0)',
    'release-blocking heading',
)

replace_once(
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | PR #283 merged; PR #280 closed; PR #286 sole follow-up |',
    '| ORCH-DUPLICATE-PRINT-SURFACE-OWNERS | ✅ **FIXED 2026-07-25.** PR #283 became the sole accepted PDF product owner and PR #280 closed without merge. A later physical contract found a separate residual back-face product defect; PR #286 is now the sole correction owner rather than a competing implementation. | `d94b5488` PR#283; PR#280 closed; PR#286 sole follow-up |',
    'print closed immutable ref',
)

replace_once(
    '| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | AuditRepo `6cba8af0`; run `30166440002` |',
    '| AUDITREPO-REPORT-SHA-BYPASS | ✅ **FIXED/AUDITREPO CI VERIFIED 2026-07-25.** SHA-bearing empty report scaffolds no longer bypass content validation. New/modified empty intakes block, historical debt remains visible, strict mode and a black-box temporary-tree regression are permanent. | `6cba8af0`; run `30166440002` |',
    'validator closed immutable ref',
)

replace_once(
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `dab31616` are imported. Superseded issue #289 was closed without claiming deployment. | `dab31616` candidate; evidence import pending |',
    '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `dab31616` are imported. Superseded issue #289 was closed without claiming deployment. | `incoming/auditor-brain/2026-07-25-r2/REPORT.md`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md` |',
    'production evidence explicit witness',
)

anchor = '| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `dab31616` are imported. Superseded issue #289 was closed without claiming deployment. | `incoming/auditor-brain/2026-07-25-r2/REPORT.md`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_dab31616_auditor-r2.md` |\n'
editorial = '| EDITORIAL-PROJECTION-51-DRIFT | Projection-only Search/RSS observations must not overwrite canonical editorial dates. Reconcile the 51-field diff by field class and retain human editorial authority; do not add a generic writer to make the workflow green. | source issue #217; `reverify/MULTIAGENT_CONVERGENCE_2026-07-25_d94b5488.md` |\n'
if 'EDITORIAL-PROJECTION-51-DRIFT |' not in text:
    if anchor not in text:
        raise SystemExit('editorial row anchor missing')
    text = text.replace(anchor, anchor + editorial, 1)
else:
    raise SystemExit('editorial row already exists unexpectedly')

replace_once('## 🟠 P1 — ОТКРЫТО (102)', '## 🟠 P1 — ОТКРЫТО (103)', 'P1 heading count')
replace_once('| P1 открыто | 102 |', '| P1 открыто | 103 |', 'P1 statistics count')
replace_once('| **Всего открыто (матрица)** | **198** |', '| **Всего открыто (матрица)** | **199** |', 'total open statistics')

session_anchor = '## Session log (append-only)\n\n'
session = '- **2026-07-25 matrix diagnostics repair (`dab31616`)** — named the empty P0/P1 section as release-blocking, registered `EDITORIAL-PROJECTION-51-DRIFT`, attached explicit evidence to the production-import gap and normalized two immutable closed refs. Matrix coverage diagnostics should return zero problems.\n\n'
if session not in text:
    if session_anchor not in text:
        raise SystemExit('session log anchor missing')
    text = text.replace(session_anchor, session_anchor + session, 1)

MATRIX.write_text(text, encoding='utf-8')

# Final tree must not retain one-shot machinery.
if WORKFLOW.exists():
    WORKFLOW.unlink()
SELF.unlink()
