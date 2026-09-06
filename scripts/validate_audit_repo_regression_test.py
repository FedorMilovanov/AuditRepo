#!/usr/bin/env python3
"""Black-box regressions for validate_audit_repo.py.

The test builds a minimal temporary AuditRepo tree and executes the real validator
through AUDITREPO_ROOT. This catches control-flow regressions without mutating the
repository or depending on the current production matrix.
"""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
VALIDATOR = HERE / 'validate_audit_repo.py'


def write(path: Path, content: str = '') -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def build_fixture(root: Path) -> Path:
    write(root / 'README.md', '# AuditRepo fixture\n')
    write(root / 'AUDITREPO_OPERATING_MODEL.md', '# Operating model fixture\n')
    write(root / 'PROJECT_REGISTRY.md', '# Projects\n')
    (root / 'scripts').mkdir(parents=True)

    project = root / 'projects' / 'fixture-project'
    write(project / 'README.md', '# Fixture project\n')
    write(project / 'PROJECT_META.yml', 'name: fixture-project\n')
    for directory in ('incoming', 'working', 'verification', 'verified', 'repairs', 'reverify', 'legacy', 'archive'):
        (project / directory).mkdir(parents=True, exist_ok=True)
    write(project / 'working' / 'README.md', '# Working\n')
    write(project / 'verification' / 'README.md', '# Verification\n')
    write(project / 'verified' / 'README.md', '# Verified\n')
    write(
        project / 'verified' / 'MASTER_BUG_MATRIX.md',
        '# MASTER BUG MATRIX — fixture\n\n'
        '## ✅ ЗАКРЫТО (1)\n\n'
        '## 🟠 P1 — ОТКРЫТО (2)\n\n'
        '## 🟡 P2 — ОТКРЫТО (3)\n\n'
        '## 🟢 P3 — ОТКРЫТО (4)\n\n'
        '## Статистика\n\n'
        '| Категория | Количество |\n'
        '|---|---|\n'
        '| Закрыто (fixed) | 1 |\n'
        '| **P0 открыто** | **0** |\n'
        '| P1 открыто | 2 |\n'
        '| P2 открыто | 3 |\n'
        '| P3 открыто | 4 |\n'
        '| Рефакторинг | 1 |\n'
        '| AuditRepo | 1 |\n'
        '| **Всего открыто (матрица)** | **11** |\n',
    )

    intake = project / 'incoming' / 'validator-regression' / '2026-07-25'
    write(
        intake / 'README.md',
        '# Report intake\n\n## Meta\n- Agent: validator-regression\n'
        '- Audited anchor (SHA / artifact / live snapshot): 9fcfb6c27d4b1b0d9189e3ee9a83c433bd4c3d95\n',
    )
    return intake


def run_validator(root: Path) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env['AUDITREPO_ROOT'] = str(root)
    env['AUDITREPO_STRICT_REPORT_CONTENT'] = '1'
    return subprocess.run(
        [sys.executable, str(VALIDATOR)],
        text=True,
        capture_output=True,
        env=env,
        check=False,
    )


def require(condition: bool, message: str, result: subprocess.CompletedProcess[str] | None = None) -> None:
    if condition:
        return
    if result is not None:
        message += f'\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}'
    raise AssertionError(message)


def compact_matrix() -> str:
    return (
        '# MASTER BUG MATRIX — compact fixture\n\n'
        '## Current state\n\n'
        '| Поле | Значение |\n'
        '|---|---|\n'
        '| Active work units | **4** |\n'
        '| Direct current defects | **1** |\n'
        '| Verified necessary improvements | **1** |\n'
        '| Narrowed residuals | **0** |\n'
        '| System verification lanes | **1** |\n'
        '| Owner decisions | **1** |\n'
        '| Closed/stale/duplicate/absorbed rows in MASTER | **0** |\n\n'
        '## CURRENT DEFECTS — 1\n\n'
        '| ID | Current problem | Boundary |\n'
        '|---|---|---|\n'
        '| `FIXTURE-BUG-01` | Current defect. | verification/fixture.md |\n\n'
        '## VERIFIED NECESSARY IMPROVEMENTS — 1\n\n'
        '| ID | Needed implementation | Why |\n'
        '|---|---|---|\n'
        '| `FIXTURE-IMPROVE-01` | Needed capability. | verification/fixture.md |\n\n'
        '## NARROWED RESIDUALS — 0\n\n'
        '| ID | Current residual |\n'
        '|---|---|\n\n'
        '## SYSTEM VERIFICATION LANES — 1\n\n'
        '| ID | Verified work package | Next boundary |\n'
        '|---|---|---|\n'
        '| `SYS-FIXTURE-CONTROL` | Shared root. | verification/fixture.md |\n\n'
        '## OWNER DECISIONS — 1\n\n'
        '| ID | Missing decision |\n'
        '|---|---|\n'
        '| `FIXTURE-DECISION-01` | Owner choice. |\n'
    )


def main() -> int:
    with tempfile.TemporaryDirectory(prefix='auditrepo-validator-') as raw:
        root = Path(raw)
        intake = build_fixture(root)

        write(
            intake / 'REPORT.md',
            '# Agent Audit Report\n\n## Meta\n- Project: fixture-project\n\n'
            '## 1. New observations\n\n'
            '### Observation `<temp-id>`\n\n'
            '- Title:\n'
            '- Kind: defect / risk / improvement / system-theme / audit-harness / owner-decision\n'
            '- Suggested impact: critical / high / medium / low / unknown\n'
            '- Evidence type: verified-source / verified-build / verified-artifact / verified-browser / verified-live\n'
            '- Evidence:\n',
        )
        empty = run_validator(root)
        require(empty.returncode == 1, 'option-filled empty REPORT.md unexpectedly passed', empty)
        require(
            'REPORT.md appears empty template' in empty.stdout,
            'empty-report failure did not identify the report-content invariant',
            empty,
        )

        write(
            intake / 'REPORT.md',
            '# Agent Audit Report\n\n## Meta\n- Project: fixture-project\n\n## 1. New observations\n'
            '### AUDIT-VALIDATOR-REGRESSION\n'
            '- Title: Empty report bypass\n'
            '- Kind: audit-harness\n'
            '- Evidence type: verified-source\n'
            '- Evidence: validator black-box fixture\n',
        )
        valid = run_validator(root)
        require(valid.returncode == 0, 'real observation failed validator', valid)
        require('AUDITREPO VALIDATION: PASS' in valid.stdout, 'PASS marker missing', valid)

        write(
            intake / 'REPORT.md',
            '# Historical progress note\n\n'
            '## Findings matrix\n\n'
            '| ID | Severity | Title | Status |\n'
            '|---|---|---|---|\n'
            '| GENEALOGY-PROGRESS-2026-07-17 | P3 / INFO | Curated evidence grew | historical evidence |\n',
        )
        generic_table = run_validator(root)
        require(generic_table.returncode == 0, 'generic historical finding table failed validator', generic_table)

        write(
            intake / 'REPORT.md',
            '# Historical intake index\n\n'
            'Severity: mixed. Source HEAD `14a49be8`.\n\n'
            '1. `AUDIT_cycle1.md` — first evidence package.\n'
            '2. `AUDIT_cycle2.md` — second evidence package.\n',
        )
        evidence_index = run_validator(root)
        require(evidence_index.returncode == 0, 'historical evidence index failed validator', evidence_index)

        write(
            intake / 'REPORT.md',
            '# Agent Audit Report\n\n## 1. New observations\n'
            '### AUDIT-VALIDATOR-REGRESSION\n- Evidence: retained for anchor tests\n',
        )

        write(
            intake / 'README.md',
            '# Report intake\n\n## Meta\n- Agent: validator-regression\n'
            '- Audited anchor (SHA / artifact / live snapshot): artifact fixture-123 digest sha256:abc123\n',
        )
        non_sha_anchor = run_validator(root)
        require(non_sha_anchor.returncode == 0, 'explicit non-SHA evidence anchor failed validator', non_sha_anchor)

        write(
            intake / 'README.md',
            '# Report intake\n\n## Meta\n- Agent: validator-regression\n'
            '- Source repo: https://example.invalid/project\n'
            '- Audited anchor (SHA / artifact / live snapshot):\n',
        )
        unrelated_url = run_validator(root)
        require(unrelated_url.returncode == 1, 'unrelated URL unexpectedly satisfied evidence anchor', unrelated_url)
        require(
            'no explicit labelled evidence anchor' in unrelated_url.stdout,
            'unrelated-URL failure did not identify the strict anchor invariant',
            unrelated_url,
        )

        write(
            intake / 'README.md',
            '# Report intake\n\n## Meta\n- Agent: validator-regression\n'
            '- Audited anchor (SHA / artifact / live snapshot): <fill me>\n',
        )
        missing_anchor = run_validator(root)
        require(missing_anchor.returncode == 1, 'placeholder evidence anchor unexpectedly passed', missing_anchor)
        require(
            'no explicit labelled evidence anchor' in missing_anchor.stdout,
            'missing-anchor failure did not identify the evidence-anchor invariant',
            missing_anchor,
        )

        write(
            intake / 'README.md',
            '# Report intake\n\n## Meta\n- Agent: validator-regression\n'
            '- Source commit: 9fcfb6c27d4b1b0d9189e3ee9a83c433bd4c3d95\n',
        )

        matrix_path = root / 'projects' / 'fixture-project' / 'verified' / 'MASTER_BUG_MATRIX.md'
        matrix_text = matrix_path.read_text(encoding='utf-8')
        matrix_path.write_text(matrix_text.replace('| Закрыто (fixed) | 1 |', '| Закрыто (fixed) | 9 |'), encoding='utf-8')
        mismatch = run_validator(root)
        require(mismatch.returncode == 1, 'mismatched legacy matrix counters unexpectedly passed', mismatch)
        require(
            'matrix counter mismatch for fixed' in mismatch.stdout,
            'legacy matrix mismatch failure did not identify the divergent counter',
            mismatch,
        )

        matrix_path.write_text(matrix_text.replace('**11**', '**12**'), encoding='utf-8')
        total_mismatch = run_validator(root)
        require(total_mismatch.returncode == 1, 'mismatched legacy total-open counter unexpectedly passed', total_mismatch)
        require(
            'matrix total-open mismatch' in total_mismatch.stdout,
            'legacy total-open mismatch did not identify arithmetic drift',
            total_mismatch,
        )

        matrix_path.write_text(matrix_text, encoding='utf-8')
        restored = run_validator(root)
        require(restored.returncode == 0, 'restored legacy matrix counters failed validator', restored)

        # Owner-model regression: compact MASTER is valid without historical
        # fixed/P0/P1/P2/P3 counters and may contain verified improvements.
        write(root / 'projects' / 'fixture-project' / 'verification' / 'fixture.md', '# current verification\n')
        matrix_path.write_text(compact_matrix(), encoding='utf-8')
        compact = run_validator(root)
        require(compact.returncode == 0, 'compact active-work matrix failed validator', compact)

        wrong_count = compact_matrix().replace('| Active work units | **4** |', '| Active work units | **5** |')
        matrix_path.write_text(wrong_count, encoding='utf-8')
        compact_count = run_validator(root)
        require(compact_count.returncode == 1, 'compact active-work count drift unexpectedly passed', compact_count)
        require('STATE-COUNT-MISMATCH' in compact_count.stdout, 'compact count failure was not specific', compact_count)

        closed_in_master = compact_matrix() + (
            '\n## ✅ ЗАКРЫТО (1)\n\n'
            '| ID | Description |\n'
            '|---|---|\n'
            '| `FIXTURE-CLOSED-01` | historical closure |\n'
        )
        matrix_path.write_text(closed_in_master, encoding='utf-8')
        compact_closed = run_validator(root)
        require(compact_closed.returncode == 1, 'closed row inside compact MASTER unexpectedly passed', compact_closed)
        require('ACTIVE-MATRIX-CONTAINS-CLOSED' in compact_closed.stdout, 'closed-row failure was not specific', compact_closed)

        # A project whose entire governed matrix is deleted is an incomplete
        # repository state, not a project whose matrix checks are skipped.
        matrix_path.unlink()
        missing_matrix = run_validator(root)
        require(missing_matrix.returncode == 1, 'deleted MASTER_BUG_MATRIX.md unexpectedly passed', missing_matrix)
        require(
            'missing verified/MASTER_BUG_MATRIX.md' in missing_matrix.stdout,
            'missing-matrix failure was not specific',
            missing_matrix,
        )

    print('AUDITREPO VALIDATOR REGRESSION: PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())