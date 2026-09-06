#!/usr/bin/env python3
"""Black-box-ish regressions for the project and intake scaffolders."""

from __future__ import annotations

import importlib.util
import os
from pathlib import Path
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f'cannot load {path}')
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    try:
        spec.loader.exec_module(module)
    except Exception:
        sys.modules.pop(name, None)
        raise
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
        project_args = [
            'scaffold_project.py',
            'fixture-project',
            '--source-repo',
            'example/fixture',
            '--production-url',
            'https://example.invalid',
        ]
        require(run_main(project_scaffold, project_args) == 0, 'project scaffold failed')

        project = projects / 'fixture-project'
        required_project_files = [
            project / 'README.md',
            project / 'DOC_MAP.md',
            project / 'WORK_QUEUE.md',
            project / 'PROJECT_META.yml',
            project / 'verified' / 'README.md',
            project / 'verified' / 'SYSTEM_THEMES.md',
            project / 'verified' / 'CLOSURE_LEDGER.md',
            project / 'verified' / 'MASTER_BUG_MATRIX.md',
            project / 'legacy' / 'README.md',
        ]
        for path in required_project_files:
            require(path.is_file(), f'project scaffold missing {path.relative_to(root)}')

        project_readme = (project / 'README.md').read_text(encoding='utf-8')
        require('Current source HEAD' in project_readme, 'stable source-authority boundary missing')
        require(
            'remain owned by the source repository' in project_readme,
            'HEAD decoupling wording missing',
        )
        require(
            'verified/MASTER_BUG_MATRIX.md' in project_readme,
            'compact active matrix is missing from project start order',
        )

        matrix = (project / 'verified' / 'MASTER_BUG_MATRIX.md').read_text(encoding='utf-8')
        matrix_lib = load_module('auditrepo_matrix_coverage_lib', HERE / 'matrix_coverage_lib.py')
        rows, open_ids, closed_rows = matrix_lib.parse_matrix(matrix)
        require(not rows and not open_ids and not closed_rows, 'new compact matrix is not zero')
        require(
            not matrix_lib.matrix_integrity_problems(matrix, rows),
            'new compact matrix violates canonical counters or sections',
        )

        project_meta = (project / 'PROJECT_META.yml').read_text(encoding='utf-8')
        require('active_matrix_path: verified/MASTER_BUG_MATRIX.md' in project_meta, 'matrix owner missing from project metadata')
        require('witness_model: proportional-independent-angles' in project_meta, 'proportional witness model missing')
        require('W6-history' in project_meta, 'W1-W6 witness model is incomplete')
        require('proof_states: [PASS, FAIL, UNPROVEN, N/A]' in project_meta, 'four-state proof model missing')

        for root_document in ('README.md', 'AUDITREPO_OPERATING_MODEL.md', 'PROJECT_REGISTRY.md'):
            (root / root_document).write_text(f'# {root_document}\n', encoding='utf-8')
        (root / 'scripts').mkdir()
        validator = subprocess.run(
            [sys.executable, str(HERE / 'validate_audit_repo.py')],
            env={**os.environ, 'AUDITREPO_ROOT': str(root)},
            text=True,
            capture_output=True,
            check=False,
        )
        require(
            validator.returncode == 0,
            f'new project fails canonical repository validator:\n{validator.stdout}\n{validator.stderr}',
        )

        nested_archive_readme = (project / 'archive' / 'closed' / 'README.md').read_text(encoding='utf-8')
        require(
            '[`../../DOC_MAP.md`](../../DOC_MAP.md)' in nested_archive_readme,
            'nested archive README points to the wrong DOC_MAP path',
        )

        sentinel = project / 'README.md'
        original_project_readme = sentinel.read_text(encoding='utf-8')
        require(
            run_main(project_scaffold, project_args) == 1,
            'existing project was unexpectedly overwritten',
        )
        require(
            sentinel.read_text(encoding='utf-8') == original_project_readme,
            'failed project scaffold mutated existing project files',
        )
        require(
            run_main(
                project_scaffold,
                ['scaffold_project.py', '..', '--source-repo', 'example/escape'],
            ) == 1,
            'reserved dot-dot project unexpectedly passed',
        )
        require(
            run_main(
                project_scaffold,
                ['scaffold_project.py', '.', '--source-repo', 'example/current'],
            ) == 1,
            'reserved dot project unexpectedly passed',
        )

        intake_scaffold.ROOT = root
        intake_scaffold.REPORT_TEMPLATE_PATH = (
            REPO_ROOT / 'projects' / '_templates' / 'AGENT_REPORT_TEMPLATE.md'
        )
        intake_args = ['scaffold_intake.py', 'fixture-project', 'fixture-agent', '2026-08-06']
        require(run_main(intake_scaffold, intake_args) == 0, 'intake scaffold failed')

        intake = project / 'incoming' / 'fixture-agent' / '2026-08-06'
        readme_path = intake / 'README.md'
        report_path = intake / 'REPORT.md'
        readme = readme_path.read_text(encoding='utf-8')
        report = report_path.read_text(encoding='utf-8')

        require(
            '- Audited anchor (SHA / artifact / live snapshot):' in readme,
            'intake evidence-anchor field missing',
        )
        require('Current source HEAD at start' not in readme, 'obsolete HEAD mirror field returned')
        require('## 4. Root-cause clusters' in report, 'root-cause report section missing')
        require('## 5. Value and cost assessment' in report, 'value/cost section missing')
        require('- Signal class:' in report, 'signal-class field missing')
        require('- Proof state:' in report, 'proof-state field missing')
        require('- Claim boundary:' in report, 'claim-boundary field missing')
        require('- Preservation boundary:' in report, 'preservation-boundary field missing')
        require('- Semantic owner:' in report, 'semantic-owner field missing')
        require('- Project: fixture-project' in report, 'project placeholder was not filled')
        require('- Agent: fixture-agent' in report, 'agent placeholder was not filled')
        require('- Date: 2026-08-06' in report, 'date placeholder was not filled')

        report_path.write_text(report + '\nSENTINEL-EVIDENCE\n', encoding='utf-8')
        require(
            run_main(intake_scaffold, intake_args) == 1,
            'existing intake was unexpectedly overwritten',
        )
        require(
            'SENTINEL-EVIDENCE' in report_path.read_text(encoding='utf-8'),
            'failed intake scaffold destroyed existing evidence',
        )

        require(
            run_main(
                intake_scaffold,
                ['scaffold_intake.py', 'fixture-project', '../escape', '2026-08-06'],
            ) == 1,
            'unsafe agent path unexpectedly passed',
        )
        require(
            run_main(
                intake_scaffold,
                ['scaffold_intake.py', 'fixture-project', '..', '2026-08-06'],
            ) == 1,
            'reserved dot-dot agent unexpectedly passed',
        )
        require(
            run_main(
                intake_scaffold,
                ['scaffold_intake.py', 'fixture-project', '.', '2026-08-06'],
            ) == 1,
            'reserved dot agent unexpectedly passed',
        )
        require(
            run_main(
                intake_scaffold,
                ['scaffold_intake.py', 'fixture-project', 'fixture-agent-2', '2026-02-31'],
            ) == 1,
            'invalid calendar date unexpectedly passed',
        )
        require(
            run_main(
                intake_scaffold,
                ['scaffold_intake.py', 'fixture-project', 'fixture-agent-2', '2026-8-6'],
            ) == 1,
            'non-zero-padded date unexpectedly passed',
        )
        require(
            not (project / 'incoming' / 'fixture-agent-2').exists(),
            'rejected date created a partial intake path',
        )

        reverify_scaffold = load_module(
            'auditrepo_scaffold_reverify', HERE / 'scaffold_reverify.py'
        )
        retirement_scaffold = load_module(
            'auditrepo_scaffold_retirement_review', HERE / 'scaffold_retirement_review.py'
        )
        reverify_scaffold.ROOT = root
        reverify_scaffold.TEMPLATE = (
            REPO_ROOT / 'projects' / '_templates' / 'CURRENT_HEAD_REVERIFY_TEMPLATE.md'
        )
        retirement_scaffold.ROOT = root
        retirement_scaffold.TEMPLATE = (
            REPO_ROOT / 'projects' / '_templates' / 'SUSPECTED_RETIREMENT_TEMPLATE.md'
        )

        reverify_args = ['scaffold_reverify.py', 'fixture-project', '2026-08-06', '1e57c6b']
        require(run_main(reverify_scaffold, reverify_args) == 0, 'reverify scaffold failed')
        reverify_file = project / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-08-06_1e57c6b.md'
        require(reverify_file.is_file(), 'reverify scaffold did not create the expected file')
        require(
            run_main(reverify_scaffold, reverify_args) == 1,
            'existing reverify file was unexpectedly overwritten',
        )

        for unsafe_project in ('..', '../..', '.'):
            require(
                run_main(
                    reverify_scaffold,
                    ['scaffold_reverify.py', unsafe_project, '2026-08-06', '1e57c6b'],
                ) == 1,
                f'unsafe reverify project unexpectedly passed: {unsafe_project}',
            )
        for unsafe_sha in ('../../escape', 'a/b', '.'):
            require(
                run_main(
                    reverify_scaffold,
                    ['scaffold_reverify.py', 'fixture-project', '2026-08-06', unsafe_sha],
                ) == 1,
                f'unsafe reverify sha unexpectedly passed: {unsafe_sha}',
            )
        for invalid_date in ('2026-02-31', '2026-8-6', 'not-a-date'):
            require(
                run_main(
                    reverify_scaffold,
                    ['scaffold_reverify.py', 'fixture-project', invalid_date, '1e57c6b'],
                ) == 1,
                f'invalid reverify date unexpectedly passed: {invalid_date}',
            )
        require(
            run_main(
                reverify_scaffold,
                ['scaffold_reverify.py', 'no-such-project', '2026-08-06', '1e57c6b'],
            ) == 1,
            'missing project unexpectedly passed reverify scaffold',
        )
        require(
            sorted(path.name for path in (project / 'reverify').iterdir())
            == ['CURRENT_HEAD_REVERIFY_2026-08-06_1e57c6b.md', 'README.md'],
            'rejected reverify invocations created stray files',
        )

        retirement_args = [
            'scaffold_retirement_review.py',
            'fixture-project',
            'FIXTURE-BUG-01',
            '2026-08-06',
        ]
        require(
            run_main(retirement_scaffold, retirement_args) == 0,
            'retirement-review scaffold failed',
        )
        review_file = (
            project / 'verification' / 'retirement-reviews'
            / 'FIXTURE-BUG-01-retirement-review-2026-08-06.md'
        )
        require(review_file.is_file(), 'retirement-review scaffold did not create the expected file')
        require(
            run_main(retirement_scaffold, retirement_args) == 1,
            'existing retirement review was unexpectedly overwritten',
        )
        for unsafe_bug_id in ('../../escape', 'a/b', '.'):
            require(
                run_main(
                    retirement_scaffold,
                    ['scaffold_retirement_review.py', 'fixture-project', unsafe_bug_id, '2026-08-06'],
                ) == 1,
                f'unsafe retirement bug id unexpectedly passed: {unsafe_bug_id}',
            )
        require(
            run_main(
                retirement_scaffold,
                ['scaffold_retirement_review.py', 'fixture-project', 'FIXTURE-BUG-01', '2026-13-99'],
            ) == 1,
            'invalid retirement-review date unexpectedly passed',
        )
        require(
            run_main(
                retirement_scaffold,
                ['scaffold_retirement_review.py', 'no-such-project', 'FIXTURE-BUG-01', '2026-08-06'],
            ) == 1,
            'missing project unexpectedly passed retirement-review scaffold',
        )
        require(
            sorted(
                path.name
                for path in (project / 'verification' / 'retirement-reviews').iterdir()
            )
            == ['FIXTURE-BUG-01-retirement-review-2026-08-06.md'],
            'rejected retirement-review invocations created stray files',
        )

    print('AUDITREPO SCAFFOLD REGRESSION: PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
