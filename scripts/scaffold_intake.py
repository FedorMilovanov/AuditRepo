#!/usr/bin/env python3
from pathlib import Path
import argparse
import sys

ROOT = Path(__file__).resolve().parent.parent

README_TEMPLATE = """# Intake — {project} — {agent} — {date}

## Identity

- Project: {project}
- Source repo:
- Agent: {agent}
- Date: {date}
- Audited branch:
- Audited SHA:
- Current source HEAD at start:
- Environment:
- Report type:
- Build mode:

## Scope

- Routes checked:
- Files checked:
- Systems checked:

## Files in this folder

- `REPORT.md`
- `artifacts/`
- `evidence/`
- `commands.log`

## Status rules

Allowed here:
- raw
- suspected
- reproduced-by-agent
- needs-verification

Forbidden here:
- repair-ready
- fixed-current
- confirmed-current without verifier
"""

REPORT_TEMPLATE = """# Agent Audit Report

## Meta
- Project: {project}
- Source repo:
- Agent: {agent}
- Date: {date}
- Audited branch:
- Audited SHA:
- Current HEAD at start:
- Current HEAD at end:
- Environment:
- Build mode:
- Browser/device if used:

## Scope
- Routes:
- Systems:
- Files:
- Out of scope:

## Findings

### Finding <temporary-id>
- Title:
- Initial severity:
- Category:
- Route(s):
- Source file(s):
- Observed on SHA:
- Repro steps:
- Expected:
- Actual:
- Evidence:
- Confidence:
- Needs verifier:
- Suggested repair lane:
- Do not mix with:

## Suspected / needs verification

## Likely false positives

## Artifacts

## Notes for verifier
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project')
    ap.add_argument('agent')
    ap.add_argument('date')
    args = ap.parse_args()

    project_root = ROOT / 'projects' / args.project
    if not project_root.exists():
        print(f'ERROR: project not found: {project_root}', file=sys.stderr)
        sys.exit(1)
    if not (project_root / 'PROJECT_META.yml').exists():
        print(f'ERROR: missing PROJECT_META.yml for {args.project}', file=sys.stderr)
        sys.exit(1)

    intake = project_root / 'incoming' / args.agent / args.date
    artifacts = intake / 'artifacts'
    evidence = intake / 'evidence'
    intake.mkdir(parents=True, exist_ok=True)
    artifacts.mkdir(parents=True, exist_ok=True)
    evidence.mkdir(parents=True, exist_ok=True)

    (intake / 'README.md').write_text(
        README_TEMPLATE.format(project=args.project, agent=args.agent, date=args.date),
        encoding='utf-8'
    )
    (intake / 'REPORT.md').write_text(
        REPORT_TEMPLATE.format(project=args.project, agent=args.agent, date=args.date),
        encoding='utf-8'
    )
    (intake / 'commands.log').touch()

    print('Created:')
    print(intake)
    print(intake / 'README.md')
    print(intake / 'REPORT.md')
    print(artifacts)
    print(evidence)
    print(intake / 'commands.log')

if __name__ == '__main__':
    main()
