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
    for directory in ('incoming', 'working', 'verification', 'verified', 'repairs', 'reverify', 'archive'):
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
        '# Report intake\n\n## Meta\n- Agent: validator-regression\n- Source commit: 9fcfb6c27d4b1b0d9189e3ee9a83c433bd4c3d95\n',
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


def main() -> int:
    with tempfile.TemporaryDirectory(prefix='auditrepo-validator-') as raw:
        root = Path(raw)
        intake = build_fixture(root)

        # A concrete evidence anchor in README must not allow an untouched
        # REPORT scaffold to bypass the independent report-content invariant.
        write(
            intake / 'REPORT.md',
            '# Agent Audit Report\n\n## Meta\n- Project: fixture-project\n\n## 1. New observations\n'
            '### Observation `<temp-id>`\n- Title:\n- Kind:\n',
        )
        empty = run_validator(root)
        require(empty.returncode == 1, 'anchor-bearing empty REPORT.md unexpectedly passed', empty)
        require(
            'REPORT.md appears empty template' in empty.stdout,
            'empty-report failure did not identify the report-content invariant',
            empty,
        )

        # A real structured observation should pass the same minimal repository.
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

        # Proportional anchors may be artifact/live snapshots rather than Git SHAs.
        write(
            intake / 'README.md',
            '# Report intake\n\n## Meta\n- Agent: validator-regression\n'
            '- Audited anchor (SHA / artifact / live snapshot): https://example.invalid/artifacts/fixture-123\n',
        )
        non_sha_anchor = run_validator(root)
        require(non_sha_anchor.returncode == 0, 'explicit non-SHA evidence anchor failed validator', non_sha_anchor)

        # Missing concrete anchor must still fail.
        write(
            intake / 'README.md',
            '# Report intake\n\n## Meta\n- Agent: validator-regression\n'
            '- Audited anchor (SHA / artifact / live snapshot): <fill me>\n',
        )
        missing_anchor = run_validator(root)
        require(missing_anchor.returncode == 1, 'placeholder evidence anchor unexpectedly passed', missing_anchor)
        require(
            'no concrete evidence anchor' in missing_anchor.stdout,
            'missing-anchor failure did not identify the evidence-anchor invariant',
            missing_anchor,
        )

        write(
            intake / 'README.md',
            '# Report intake\n\n## Meta\n- Agent: validator-regression\n- Source commit: 9fcfb6c27d4b1b0d9189e3ee9a83c433bd4c3d95\n',
        )

        # Canonical heading and statistics counters must remain identical during
        # the legacy matrix transition.
        matrix_path = root / 'projects' / 'fixture-project' / 'verified' / 'MASTER_BUG_MATRIX.md'
        matrix_text = matrix_path.read_text(encoding='utf-8')
        matrix_path.write_text(matrix_text.replace('| Закрыто (fixed) | 1 |', '| Закрыто (fixed) | 9 |'), encoding='utf-8')
        mismatch = run_validator(root)
        require(mismatch.returncode == 1, 'mismatched matrix counters unexpectedly passed', mismatch)
        require(
            'matrix counter mismatch for fixed' in mismatch.stdout,
            'matrix mismatch failure did not identify the divergent counter',
            mismatch,
        )

        matrix_path.write_text(matrix_text.replace('**11**', '**12**'), encoding='utf-8')
        total_mismatch = run_validator(root)
        require(total_mismatch.returncode == 1, 'mismatched total-open counter unexpectedly passed', total_mismatch)
        require(
            'matrix total-open mismatch' in total_mismatch.stdout,
            'total-open mismatch did not identify arithmetic drift',
            total_mismatch,
        )

        matrix_path.write_text(matrix_text, encoding='utf-8')
        restored = run_validator(root)
        require(restored.returncode == 0, 'restored matrix counters failed validator', restored)

    print('AUDITREPO VALIDATOR REGRESSION: PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
