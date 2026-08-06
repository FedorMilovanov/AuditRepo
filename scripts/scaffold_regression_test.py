#!/usr/bin/env python3
"""Black-box-ish regressions for the project and intake scaffolders."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import sys
import tempfile

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f'cannot load {path}')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_main(module, argv: list[str]) -> int:
    previous = sys.argv
    try:
        sys.argv = argv
        result = module.main()
        return 0 if result is None else int(result)
    finally:
        sys.argv = previous


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    project_scaffold = load_module('auditrepo_scaffold_project', HERE / 'scaffold_project.py')
    intake_scaffold = load_module('auditrepo_scaffold_intake', HERE / 'scaffold_intake.py')

    with tempfile.TemporaryDirectory(prefix='auditrepo-scaffold-') as raw:
        root = Path(raw)
        projects = root / 'projects'
        projects.mkdir(parents=True)

        project_scaffold.ROOT = root
        project_scaffold.PROJECTS = projects
        require(
            run_main(
                project_scaffold,
                [
                    'scaffold_project.py',
                    'fixture-project',
                    '--source-repo',
                    'example/fixture',
                    '--production-url',
                    'https://example.invalid',
                ],
            ) == 0,
            'project scaffold failed',
        )

        project = projects / 'fixture-project'
        required_project_files = [
            project / 'README.md',
            project / 'DOC_MAP.md',
            project / 'WORK_QUEUE.md',
            project / 'PROJECT_META.yml',
            project / 'verified' / 'README.md',
            project / 'verified' / 'SYSTEM_THEMES.md',
            project / 'verified' / 'CLOSURE_LEDGER.md',
        ]
        for path in required_project_files:
            require(path.is_file(), f'project scaffold missing {path.relative_to(root)}')

        project_readme = (project / 'README.md').read_text(encoding='utf-8')
        require('Current source HEAD' in project_readme, 'stable source-authority boundary missing')
        require(
            'remain owned by the source repository' in project_readme,
            'HEAD decoupling wording missing',
        )

        intake_scaffold.ROOT = root
        intake_scaffold.REPORT_TEMPLATE_PATH = (
            REPO_ROOT / 'projects' / '_templates' / 'AGENT_REPORT_TEMPLATE.md'
        )
        require(
            run_main(
                intake_scaffold,
                ['scaffold_intake.py', 'fixture-project', 'fixture-agent', '2026-08-06'],
            ) == 0,
            'intake scaffold failed',
        )

        intake = project / 'incoming' / 'fixture-agent' / '2026-08-06'
        readme = (intake / 'README.md').read_text(encoding='utf-8')
        report = (intake / 'REPORT.md').read_text(encoding='utf-8')

        require(
            '- Audited anchor (SHA / artifact / live snapshot):' in readme,
            'intake evidence-anchor field missing',
        )
        require('Current source HEAD at start' not in readme, 'obsolete HEAD mirror field returned')
        require('## 4. Root-cause clusters' in report, 'root-cause report section missing')
        require('## 5. Value and cost assessment' in report, 'value/cost section missing')
        require('- Project: fixture-project' in report, 'project placeholder was not filled')
        require('- Agent: fixture-agent' in report, 'agent placeholder was not filled')
        require('- Date: 2026-08-06' in report, 'date placeholder was not filled')

    print('AUDITREPO SCAFFOLD REGRESSION: PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
