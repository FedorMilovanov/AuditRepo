#!/usr/bin/env python3
from pathlib import Path
import argparse
import os
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / 'projects'
SAFE_COMPONENT_RE = re.compile(r'^[A-Za-z0-9._-]+$')

README_TEMPLATE = """# {project}

AuditRepo project for `{source_repo}`.

- Source repo: `{source_repo}`
- Production URL: {production_url}

Current source HEAD, branches, CI and deploy remain owned by the source repository and are checked when a work package is selected.

## Start

1. `DOC_MAP.md`
2. `WORK_QUEUE.md`
3. `verified/SYSTEM_THEMES.md`
4. `incoming/`

Repository model: `../../AUDITREPO_OPERATING_MODEL.md`.
"""

DOC_MAP_TEMPLATE = """# DOC MAP — {project}

| Fact | Owner |
|---|---|
| Current code, branches, CI, deploy | source repository `{source_repo}` |
| Raw evidence | `incoming/<agent>/<date>/` |
| Temporary synthesis | `working/` |
| Optional selected work | `WORK_QUEUE.md` |
| Systemic root themes | `verified/SYSTEM_THEMES.md` |
| Compact wave outcomes | `verified/CLOSURE_LEDGER.md` |
| Significant conflicts | `verification/` |
| Significant current checks | `reverify/` |
| Historical material | `archive/` |

A source HEAD movement alone does not require an AuditRepo update.
"""

WORK_QUEUE_TEMPLATE = """# Optional Work Queue — {project}

This queue is owner-controlled. It may be empty, reordered or replaced without changing the status of the evidence corpus.

## Candidate lanes

<!-- Add selected questions, expected value, first narrow verification and possible outcomes. -->
"""

SYSTEM_THEMES_TEMPLATE = """# System Themes — {project}

System themes group recurring symptoms by shared mechanism. They are not automatically current bugs; revalidate a theme when the owner selects it for work.

<!-- Add themes with manifestations, mechanism, class-level outcome and recheck trigger. -->
"""

CLOSURE_LEDGER_TEMPLATE = """# Closure Ledger — {project}

Append compact verification/repair wave outcomes here.

## Entry format

```md
## YYYY-MM-DD — title
- Scope:
- Result: closed / absorbed / stale-invalid / parked-risk / remaining
- Source-repo evidence:
- Regression witness:
- Live evidence: required+obtained / not required / not claimed
- Detailed evidence: optional
```
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
  work_queue_path: WORK_QUEUE.md
  system_themes_path: verified/SYSTEM_THEMES.md
  closure_ledger_path: verified/CLOSURE_LEDGER.md
"""

VERIFIED_README = """# Verified

Store durable classifications, active guidance, system themes and compact closure history here. Do not mirror every source-repository HEAD.

See [`../DOC_MAP.md`](../DOC_MAP.md).
"""


def safe_component(value: str) -> bool:
    if SAFE_COMPONENT_RE.fullmatch(value):
        return True
    print(
        f'ERROR: project must contain only letters, numbers, dot, underscore or hyphen: {value!r}',
        file=sys.stderr,
    )
    return False


def folder_readme(name: str, folder: Path, project_dir: Path) -> str:
    doc_map = os.path.relpath(project_dir / 'DOC_MAP.md', folder).replace(os.sep, '/')
    return (
        f'# {name}\n\n'
        'This folder is part of the AuditRepo evidence/synthesis lifecycle. '
        f'See [`{doc_map}`]({doc_map}) and the root operating model for its role.\n'
    )


def main() -> int:
    parser = argparse.ArgumentParser(description='Create a project using the proportional AuditRepo model.')
    parser.add_argument('project')
    parser.add_argument('--source-repo', required=True)
    parser.add_argument('--production-url', default='(not set)')
    args = parser.parse_args()

    if not safe_component(args.project):
        return 1

    project_dir = PROJECTS / args.project
    if project_dir.exists():
        print(
            f'ERROR: project already exists and will not be overwritten: {project_dir}',
            file=sys.stderr,
        )
        return 1

    folders = {
        'incoming': project_dir / 'incoming',
        'working': project_dir / 'working',
        'verification': project_dir / 'verification',
        'verified': project_dir / 'verified',
        'repairs': project_dir / 'repairs',
        'reverify': project_dir / 'reverify',
        'archive': project_dir / 'archive',
        'archive-closed': project_dir / 'archive' / 'closed',
        'archive-stale': project_dir / 'archive' / 'stale',
        'archive-invalid': project_dir / 'archive' / 'invalid',
        'archive-accepted-risk': project_dir / 'archive' / 'accepted-risk',
    }

    for directory in folders.values():
        directory.mkdir(parents=True, exist_ok=False)

    values = {
        'project': args.project,
        'source_repo': args.source_repo,
        'production_url': args.production_url,
    }

    (project_dir / 'README.md').write_text(README_TEMPLATE.format(**values), encoding='utf-8')
    (project_dir / 'DOC_MAP.md').write_text(DOC_MAP_TEMPLATE.format(**values), encoding='utf-8')
    (project_dir / 'WORK_QUEUE.md').write_text(WORK_QUEUE_TEMPLATE.format(**values), encoding='utf-8')
    (project_dir / 'PROJECT_META.yml').write_text(PROJECT_META_TEMPLATE.format(**values), encoding='utf-8')

    for name, folder in folders.items():
        readme = VERIFIED_README if name == 'verified' else folder_readme(name, folder, project_dir)
        (folder / 'README.md').write_text(readme, encoding='utf-8')

    (folders['verified'] / 'SYSTEM_THEMES.md').write_text(
        SYSTEM_THEMES_TEMPLATE.format(**values), encoding='utf-8'
    )
    (folders['verified'] / 'CLOSURE_LEDGER.md').write_text(
        CLOSURE_LEDGER_TEMPLATE.format(**values), encoding='utf-8'
    )

    print(f'Created project scaffold: {project_dir}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
