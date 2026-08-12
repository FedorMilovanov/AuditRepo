#!/usr/bin/env python3
from pathlib import Path
import argparse
import os
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / 'projects'
SAFE_COMPONENT_RE = re.compile(r'^[A-Za-z0-9._-]+$')
RESERVED_PATH_COMPONENTS = {'.', '..'}

README_TEMPLATE = """# {project}

AuditRepo project for `{source_repo}`.

- Source repo: `{source_repo}`
- Production URL: {production_url}

Current source HEAD, branches, CI and deploy remain owned by the source repository and are checked when a work package is selected.

## Start

1. `DOC_MAP.md`
2. `verified/MASTER_BUG_MATRIX.md`
3. `WORK_QUEUE.md`
4. `verified/SYSTEM_THEMES.md`
5. `incoming/`

Repository model: `../../AUDITREPO_OPERATING_MODEL.md`.
"""

DOC_MAP_TEMPLATE = """# DOC MAP — {project}

| Fact | Owner |
|---|---|
| Current code, branches, CI, deploy | source repository `{source_repo}` |
| Raw evidence | `incoming/<agent>/<date>/` |
| Temporary synthesis | `working/` |
| Current verified work | `verified/MASTER_BUG_MATRIX.md` |
| Optional selected work | `WORK_QUEUE.md` |
| Systemic root themes | `verified/SYSTEM_THEMES.md` |
| Compact wave outcomes | `verified/CLOSURE_LEDGER.md` |
| Significant conflicts | `verification/` |
| Significant current checks | `reverify/` |
| Retired material retained for lookup | `legacy/` |
| Historical material | `archive/` |

A source HEAD movement alone does not require an AuditRepo update.
"""

WORK_QUEUE_TEMPLATE = """# Optional Work Queue — {project}

This queue is owner-controlled. It may be empty, reordered or replaced without changing the status of the evidence corpus.
It is not a second bug matrix. A candidate enters current work only after fresh admission into `verified/MASTER_BUG_MATRIX.md`.

## Candidate lanes

<!-- Add selected questions, expected value, first narrow verification and possible outcomes. -->
"""

SYSTEM_THEMES_TEMPLATE = """# System Themes — {project}

System themes group recurring symptoms by shared mechanism. They are not automatically current bugs; revalidate a theme when the owner selects it for work.
Use `active-work` only while an exact canonical row exists in `MASTER_BUG_MATRIX.md`.

<!-- Add themes with manifestations, mechanism, class-level outcome and recheck trigger. -->
"""

CLOSURE_LEDGER_TEMPLATE = """# Closure Ledger — {project}

Append compact verification/repair wave outcomes here.

## Entry format

```md
## YYYY-MM-DD — title
- Scope:
- Signal class: Product / harness / control-plane / environment / historical
- Exact anchor:
- Result: closed / absorbed / stale-invalid / parked-risk / remaining
- Source-repo evidence:
- Regression witness:
- Live evidence: required+obtained / not required / not claimed
- Detailed evidence: optional
```
"""

MASTER_MATRIX_TEMPLATE = """# MASTER BUG MATRIX — {project}

> SSOT for current verified necessary work only. This is a working queue, not an archive and not a mirror of the source repository.

## Current state

| Field | Value |
|---|---|
| Active work units | **0** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **0** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 0

| ID | Current problem | Boundary |
|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual |
|---|---|

## SYSTEM VERIFICATION LANES — 0

| ID | Verified work package | Next boundary |
|---|---|---|

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|

## Terminal disposition

No current work is admitted. A future signal must be classified and verified on a fresh exact anchor before it creates a row. Closed, stale, duplicate, absorbed and superseded rows remain in the closure ledger, evidence and Git history, not in MASTER.
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
  active_matrix_path: verified/MASTER_BUG_MATRIX.md
  legacy_path: legacy/

verification:
  witness_model: proportional-independent-angles
  proof_states: [PASS, FAIL, UNPROVEN, N/A]
  witness_types: [W1-surface, W2-source, W3-artifact, W4-browser-runtime, W5-lifecycle-root-cause, W6-history]
  required_admission_fields: [signal-class, exact-anchor, proof-state, claim-boundary, preservation-boundary, semantic-owner]
"""

VERIFIED_README = """# Verified

`MASTER_BUG_MATRIX.md` is the sole compact registry of current verified work. Store durable classifications, system themes and compact closure history alongside it. Do not mirror every source-repository HEAD and do not retain closed rows in MASTER.

See [`../DOC_MAP.md`](../DOC_MAP.md).
"""


def safe_component(value: str) -> bool:
    if value not in RESERVED_PATH_COMPONENTS and SAFE_COMPONENT_RE.fullmatch(value):
        return True
    print(
        f'ERROR: project must be a safe name using only letters, numbers, dot, underscore or hyphen: {value!r}',
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
        'legacy': project_dir / 'legacy',
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
    (folders['verified'] / 'MASTER_BUG_MATRIX.md').write_text(
        MASTER_MATRIX_TEMPLATE.format(**values), encoding='utf-8'
    )

    print(f'Created project scaffold: {project_dir}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
