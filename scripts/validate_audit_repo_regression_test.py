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

    intake = project / 'incoming' / 'validator-regression' / '2026-07-25'
    write(
        intake / 'README.md',
        '# Report intake\n\n## Meta\n- Agent: validator-regression\n- Source commit: 9fcfb6c27d4b1b0d9189e3ee9a83c433bd4c3d95\n',
    )
    return intake


def run_validator(root: Path) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env['AUDITREPO_ROOT'] = str(root)
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

        # Regression: a concrete SHA in README must not allow an untouched
        # REPORT scaffold to bypass the independent report-content invariant.
        write(
            intake / 'REPORT.md',
            '# Agent Work Report\n\n## Meta\n- Project: fixture-project\n\n## 1. New Findings\n### <temp-id>\n- Title:\n- Severity:\n',
        )
        empty = run_validator(root)
        require(empty.returncode == 1, 'SHA-bearing empty REPORT.md unexpectedly passed', empty)
        require(
            'REPORT.md appears empty template' in empty.stdout,
            'empty-report failure did not identify the report-content invariant',
            empty,
        )

        # A real structured finding should pass the same minimal repository.
        write(
            intake / 'REPORT.md',
            '# Agent Work Report\n\n## Meta\n- Project: fixture-project\n\n## 1. New Findings\n'
            '### AUDIT-VALIDATOR-REGRESSION\n'
            '- Title: Empty report bypass\n'
            '- Severity: P1\n'
            '- Evidence: validator black-box fixture\n',
        )
        valid = run_validator(root)
        require(valid.returncode == 0, 'real finding failed validator', valid)
        require('AUDITREPO VALIDATION: PASS' in valid.stdout, 'PASS marker missing', valid)

    print('AUDITREPO VALIDATOR REGRESSION: PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
