#!/usr/bin/env python3
"""Scaffold a current-HEAD reverify file for a project.

Usage:
    python3 scripts/scaffold_reverify.py <project> <YYYY-MM-DD> <sha>

All path-bearing arguments are validated as safe single path components so a
typo or hostile value can never write outside the project's reverify/ folder.
"""
from pathlib import Path
from datetime import datetime
import argparse
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / 'projects' / '_templates' / 'CURRENT_HEAD_REVERIFY_TEMPLATE.md'
SAFE_COMPONENT_RE = re.compile(r'^[A-Za-z0-9._-]+$')
RESERVED_PATH_COMPONENTS = {'.', '..'}


def safe_component(value: str, label: str) -> bool:
    if value not in RESERVED_PATH_COMPONENTS and SAFE_COMPONENT_RE.fullmatch(value):
        return True
    print(
        f'ERROR: {label} must be a safe name using only letters, numbers, dot, underscore or hyphen: {value!r}',
        file=sys.stderr,
    )
    return False


def valid_date(value: str) -> bool:
    try:
        parsed = datetime.strptime(value, '%Y-%m-%d')
    except ValueError:
        print(f'ERROR: date must be a real YYYY-MM-DD value: {value!r}', file=sys.stderr)
        return False
    if parsed.strftime('%Y-%m-%d') != value:
        print(f'ERROR: date must use zero-padded YYYY-MM-DD format: {value!r}', file=sys.stderr)
        return False
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('project')
    ap.add_argument('date')
    ap.add_argument('sha')
    args = ap.parse_args()

    if not safe_component(args.project, 'project'):
        return 1
    if not valid_date(args.date):
        return 1
    if not safe_component(args.sha, 'sha'):
        return 1

    project_root = ROOT / 'projects' / args.project
    if not project_root.exists():
        print(f'ERROR: project not found: {project_root}', file=sys.stderr)
        return 1

    reverify_dir = project_root / 'reverify'
    reverify_dir.mkdir(parents=True, exist_ok=True)
    out = reverify_dir / f'CURRENT_HEAD_REVERIFY_{args.date}_{args.sha}.md'
    if out.exists():
        print(f'ERROR: reverify file already exists and will not be overwritten: {out}', file=sys.stderr)
        return 1
    text = TEMPLATE.read_text(encoding='utf-8') if TEMPLATE.exists() else '# Current Head Reverify\n'
    out.write_text(text, encoding='utf-8')
    print(out)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
