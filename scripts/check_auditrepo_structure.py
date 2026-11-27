#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
PROJECT_REQUIRED = (
    'README.md', 'PROJECT_META.yml', 'DOC_MAP.md', 'WORK_QUEUE.md',
    'incoming', 'working', 'verification', 'verified', 'repairs', 'reverify', 'legacy', 'archive',
    'verified/MASTER_BUG_MATRIX.md', 'verified/SYSTEM_THEMES.md',
    'verified/CLOSURE_LEDGER.md',
)


def structure_errors(root: Path) -> list[str]:
    errors: list[str] = []
    projects = root / 'projects'
    if not (root / 'README.md').is_file():
        errors.append('Missing root README.md (regular file required)')
    if not (root / 'PROJECT_REGISTRY.md').is_file():
        errors.append('Missing PROJECT_REGISTRY.md (regular file required)')
    if not projects.is_dir():
        errors.append('Missing projects/ directory')
        return errors

    for project in projects.iterdir():
        if not project.is_dir() or project.name.startswith('_'):
            continue
        for rel in PROJECT_REQUIRED:
            path = project / rel
            expected_file = bool(Path(rel).suffix)
            if not (path.is_file() if expected_file else path.is_dir()):
                kind = 'file' if expected_file else 'directory'
                errors.append(f'{project}: missing {rel} ({kind} required)')
    return errors


def main() -> int:
    errors = structure_errors(ROOT)
    if errors:
        print('AUDITREPO STRUCTURE CHECK: FAIL')
        for error in errors:
            print('-', error)
        return 1
    print('AUDITREPO STRUCTURE CHECK: PASS')
    return 0


if __name__ == '__main__':
    sys.exit(main())
