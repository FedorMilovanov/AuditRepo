#!/usr/bin/env python3
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / 'projects'

README_TEMPLATE = """# {project}

- Source repo: `{source_repo}`
- Production URL: {production_url}
- Main branch: `main`
- Current status: `intake-only`

## Folder meaning

- `incoming/` — raw agent reports
- `working/` — synthesis in progress
- `verification/` — cross-reference between multiple intake flows
- `verified/` — final confirmed docs
- `repairs/` — implementation tracking
- `reverify/` — current HEAD truth after source repo moves
- `archive/` — historical / stale / fixed snapshots
"""

PROJECT_META_TEMPLATE = """project_id: {project}
display_name: {project}
source_repo: {source_repo}
default_branch: main
production_url: {production_url}
audit_repo_project_path: projects/{project}

rules:
  raw_reports_path: incoming/<agent>/<date>/
  working_path: working/
  verification_path: verification/
  verified_path: verified/
  repairs_path: repairs/
  reverify_path: reverify/
"""

GENERIC_README = """# {name}

Эта папка создана для `{name}`.
"""

PLACEHOLDER = """# Placeholder

Эта папка создана, но ещё не заполнена итоговыми документами.
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project')
    ap.add_argument('--source-repo', required=True)
    ap.add_argument('--production-url', default='(not set)')
    args = ap.parse_args()

    project_dir = PROJECTS / args.project
    folders = {
        'incoming': project_dir / 'incoming',
        'working': project_dir / 'working',
        'verification': project_dir / 'verification',
        'verified': project_dir / 'verified',
        'repairs': project_dir / 'repairs',
        'reverify': project_dir / 'reverify',
        'archive': project_dir / 'archive',
        'archive-fixed': project_dir / 'archive' / 'fixed',
        'archive-stale': project_dir / 'archive' / 'stale',
        'archive-false-positive': project_dir / 'archive' / 'false-positive',
    }

    project_dir.mkdir(parents=True, exist_ok=True)
    for d in folders.values():
        d.mkdir(parents=True, exist_ok=True)

    (project_dir / 'README.md').write_text(
        README_TEMPLATE.format(
            project=args.project,
            source_repo=args.source_repo,
            production_url=args.production_url,
        ),
        encoding='utf-8'
    )
    (project_dir / 'PROJECT_META.yml').write_text(
        PROJECT_META_TEMPLATE.format(
            project=args.project,
            source_repo=args.source_repo,
            production_url=args.production_url,
        ),
        encoding='utf-8'
    )

    for name, folder in folders.items():
        if name == 'verified':
            (folder / 'README.md').write_text(GENERIC_README.format(name=name), encoding='utf-8')
            (folder / 'PLACEHOLDER.md').write_text(PLACEHOLDER, encoding='utf-8')
        else:
            (folder / 'README.md').write_text(GENERIC_README.format(name=name), encoding='utf-8')

    print(f'Created project scaffold: {project_dir}')

if __name__ == '__main__':
    main()
