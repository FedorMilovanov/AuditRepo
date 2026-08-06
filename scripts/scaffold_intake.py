#!/usr/bin/env python3
"""Scaffold a new multi-agent audit intake folder.

Usage:
    python3 scripts/scaffold_intake.py <project> <agent> <YYYY-MM-DD>

The generated report uses the canonical Agent Audit Report template. An intake
records the evidence anchor actually inspected; it is not rewritten when the
source repository later moves.
"""
from pathlib import Path
from datetime import datetime
import argparse
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
REPORT_TEMPLATE_PATH = ROOT / 'projects' / '_templates' / 'AGENT_REPORT_TEMPLATE.md'
SAFE_COMPONENT_RE = re.compile(r'^[A-Za-z0-9._-]+$')
RESERVED_PATH_COMPONENTS = {'.', '..'}


README_TEMPLATE = """# Intake — {project} — {agent} — {date}

## Identity

- Project: {project}
- Agent: {agent}
- Date: {date}
- Audited branch/ref:
- Audited anchor (SHA / artifact / live snapshot):
- Environment:
- Build mode: source / build / production-like dist / live
- Browser / device if used:

## Scope

- Routes checked:
- Owners/files checked:
- Systems checked:
- Explicit exclusions:

## Files in this folder

- `REPORT.md` — observations, evidence, root-cause clusters and recommendations;
- `comments/` — comments on other findings;
- `proposals/` — optional classification/priority/root-cause proposals;
- `evidence/` — logs, screenshots and command output;
- `artifacts/` — traces, patches and machine-readable output;
- `commands.log` — commands used during the pass.

## Evidence rule

The anchor records what this pass actually inspected. It may be a Git SHA, an
artifact identity or a concrete live snapshot URL. Do not update this intake
merely because the source repository later moved.

## Allowed intake language

Use `raw`, `candidate`, `reproduced-by-agent` and explicit evidence labels such as
`verified-source`, `verified-build`, `verified-browser` or `verified-live`.

Durable classifications belong to a verifier synthesis or accepted ledger decision.

## Operating model

See [`AUDITREPO_OPERATING_MODEL.md`](../../../../../AUDITREPO_OPERATING_MODEL.md).
"""


SAMPLE_COMMENT = """# Comment on Finding

## Identity

- Project: {project}
- Comment by: {agent}
- Date: {date}
- Target report: incoming/<other-agent>/<date>/REPORT.md
- Target finding ID:
- Evidence anchor:

## Comment type

confirm / challenge / stale / invalid / duplicate / root-cause / priority / evidence-addition

## Evidence angle

source / artifact / browser / lifecycle / history

## Evidence

```text
<paste evidence here>
```

## Summary

## Recommended classification or action

- Result:
- Reason:
- Notes for verifier:
"""


SAMPLE_PROPOSAL = """# Proposal

## Identity

- Project: {project}
- Proposed by: {agent}
- Date: {date}
- Target finding ID(s):
- Proposal type: classification / merge / split / systemic-root / work-queue / owner-decision

## Current understanding

## Proposed change

## Evidence

```text
<paste evidence here>
```

## Value / cost / risk

## Possible outcomes

fix-now / verify-first / system-lane / park / accepted-risk / not-worth-fixing / owner-decision
"""


def fill_report_template(project: str, agent: str, date: str) -> str:
    if not REPORT_TEMPLATE_PATH.is_file():
        raise FileNotFoundError(f'missing report template: {REPORT_TEMPLATE_PATH}')
    text = REPORT_TEMPLATE_PATH.read_text(encoding='utf-8')
    replacements = [
        ('- Project:\n', f'- Project: {project}\n'),
        ('- Agent:\n', f'- Agent: {agent}\n'),
        ('- Date:\n', f'- Date: {date}\n'),
    ]
    for before, after in replacements:
        if before not in text:
            raise ValueError(f'report template missing expected marker: {before.strip()}')
        text = text.replace(before, after, 1)
    return text


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
    parser = argparse.ArgumentParser(
        description='Scaffold a new agent intake folder in AuditRepo.'
    )
    parser.add_argument('project', help='Project name, for example gb-is-my-strength')
    parser.add_argument('agent', help='Stable agent identifier')
    parser.add_argument('date', help='Date in YYYY-MM-DD format')
    args = parser.parse_args()

    if not safe_component(args.project, 'project'):
        return 1
    if not safe_component(args.agent, 'agent'):
        return 1
    if not valid_date(args.date):
        return 1

    project_root = ROOT / 'projects' / args.project
    if not project_root.is_dir():
        print(f'ERROR: project not found: {project_root}', file=sys.stderr)
        return 1

    intake = project_root / 'incoming' / args.agent / args.date
    if intake.exists():
        print(
            f'ERROR: intake already exists and will not be overwritten: {intake}',
            file=sys.stderr,
        )
        return 1

    comments = intake / 'comments'
    proposals = intake / 'proposals'
    evidence = intake / 'evidence'
    artifacts = intake / 'artifacts'

    comments.mkdir(parents=True)
    proposals.mkdir()
    evidence.mkdir()
    artifacts.mkdir()

    (intake / 'README.md').write_text(
        README_TEMPLATE.format(project=args.project, agent=args.agent, date=args.date),
        encoding='utf-8',
    )
    (intake / 'REPORT.md').write_text(
        fill_report_template(args.project, args.agent, args.date),
        encoding='utf-8',
    )
    (intake / 'commands.log').touch()

    (comments / 'comment-on-OTHER-AGENT-BUG-ID.md').write_text(
        SAMPLE_COMMENT.format(project=args.project, agent=args.agent, date=args.date),
        encoding='utf-8',
    )
    (proposals / 'proposal-TARGET-BUG-ID.md').write_text(
        SAMPLE_PROPOSAL.format(project=args.project, agent=args.agent, date=args.date),
        encoding='utf-8',
    )

    print('Created:')
    for path in [intake, comments, proposals, evidence, artifacts]:
        print(f'  {path}/')
    for filename in ['README.md', 'REPORT.md', 'commands.log']:
        print(f'  {intake / filename}')
    print(f'  {comments / "comment-on-OTHER-AGENT-BUG-ID.md"}  ← SAMPLE')
    print(f'  {proposals / "proposal-TARGET-BUG-ID.md"}        ← SAMPLE')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
