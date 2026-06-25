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
- `verified/` — final confirmed docs

## Project-specific notes

- build command:
- production-like build command:
- browser audit command:
- known shared runtime areas:
- known route families:
"""

WORKING_README = """# Working

Сюда складываются:
- route maps
- промежуточные matrices
- triage notes
- synthesis in progress
"""

VERIFIED_README = """# Verified

Сюда кладутся:
- final bug matrices
- approved repair orders
- confirmed false-positive registries
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
    incoming = project_dir / 'incoming'
    working = project_dir / 'working'
    verified = project_dir / 'verified'

    for d in [project_dir, incoming, working, verified]:
        d.mkdir(parents=True, exist_ok=True)

    (project_dir / 'README.md').write_text(
        README_TEMPLATE.format(
            project=args.project,
            source_repo=args.source_repo,
            production_url=args.production_url,
        ),
        encoding='utf-8'
    )
    (working / 'README.md').write_text(WORKING_README, encoding='utf-8')
    (verified / 'README.md').write_text(VERIFIED_README, encoding='utf-8')
    (verified / 'PLACEHOLDER.md').write_text(PLACEHOLDER, encoding='utf-8')
    print(f'Created project scaffold: {project_dir}')

if __name__ == '__main__':
    main()
