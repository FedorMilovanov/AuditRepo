#!/usr/bin/env python3
"""
Scaffold a new agent intake folder in AuditRepo.

Usage:
    python3 scripts/scaffold_intake.py <project> <agent> <YYYY-MM-DD>

Creates:
    projects/<project>/incoming/<agent>/<YYYY-MM-DD>/
        README.md      ← meta, identity, status rules
        REPORT.md      ← universal 8-section report (findings, confirmations, challenges, ...)
        comments/      ← comments on other agents' findings (comment-on-*.md)
        proposals/     ← proposals: status/severity/merge/repair-lane (proposal-*.md)
        evidence/      ← grep output, logs, traces
        artifacts/     ← patches, snippets, screenshots
        commands.log   ← audit commands used
"""
from pathlib import Path
import argparse
import sys

ROOT = Path(__file__).resolve().parent.parent


README_TEMPLATE = """# Intake — {project} — {agent} — {date}

## Identity
- Project: {project}
- Agent: {agent}
- Date: {date}
- Audited branch:
- Audited SHA:
- Current source HEAD at start:
- Environment:
- Build mode:
- Browser / device if used:

## Scope
- Routes checked:
- Files checked:
- Systems checked:
- Out of scope:

## Files in this folder

- `REPORT.md`      — универсальный рабочий пакет (sections 1-8)
- `comments/`      — комментарии к чужим находкам (comment-on-*.md)
- `proposals/`     — предложения статуса/severity/merge/repair (proposal-*.md)
- `evidence/`      — grep output, logs, трассы
- `artifacts/`     — патчи, сниппеты, скрины
- `commands.log`   — команды аудита

## Freedom with Evidence

Любой агент свободен: искать баги, подтверждать, оспаривать, предлагать
merge/split/severity/repair-lane, делать recheck на current HEAD.

Но: все действия — evidence-based. Утверждение без SHA и доказательства
не попадает в canonical ledger.

## Status rules

Allowed here: raw, suspected, reproduced-by-agent (L0), peer-reviewed (L1)
NOT allowed here (need verifier): repair-ready, fixed-current, confirmed-current (L2+) without 2+ agents or direct evidence

## Proposal statuses

proposal-open → proposal-supported → proposal-accepted (bug moves)
proposal-open → proposal-conflicted → resolved in conflicts/
proposal-open → proposal-rejected
proposal-open → proposal-superseded
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
- Build mode: source / dist / production-like dist
- Browser / device if used:

---

## 1. New Findings

### Finding <temp-id>
- Title:
- Severity: P0 / P1 / P2 / P3
- Route(s):
- Source file(s):
- Observed on SHA:
- Repro steps:
- Expected:
- Actual:
- Evidence: (command + output)
- Confidence: high / medium / low
- Verification level: L0 (one agent) / L2 (two agents or direct evidence)
- Suggested repair lane:
- Do not mix with:

---

## 2. Confirmations of Existing Findings

### Confirm <target-id>
- Target report: incoming/<agent>/<date>/REPORT.md
- Target finding:
- My evidence:
- Same bug / related / stronger root cause:
- Recommended status:

---

## 3. Challenges / Disputes

### Challenge <target-id>
- Target report: incoming/<agent>/<date>/REPORT.md
- Target finding:
- Reason for challenge:
- Current HEAD evidence:
- Recommended status: disputed / stale-on-current-head / false-positive / downgrade

---

## 4. Duplicate / Merge Proposals

### Merge proposal
- Finding A:
- Finding B:
- Why same root cause:
- Canonical ID suggestion:

---

## 5. Severity Proposals

- Target bug:
- Current severity:
- Proposed severity:
- Evidence:

---

## 6. Repair Lane Suggestions

- Bug IDs:
- Lane:
- Why together:
- What must NOT be mixed:

---

## 7. Reverify Notes

- Bug:
- Current HEAD:
- Result: confirmed-current / stale / fixed / disputed
- Evidence:

---

## 8. Notes for Verifier

---

## Proposal statuses

proposal-open → proposal-supported → proposal-accepted (bug moves)
proposal-open → proposal-conflicted → resolved in conflicts/
proposal-open → proposal-rejected
proposal-open → proposal-superseded
"""


def main():
    ap = argparse.ArgumentParser(
        description='Scaffold a new agent intake folder in AuditRepo.'
    )
    ap.add_argument('project', help='Project name (e.g. gb-is-my-strength)')
    ap.add_argument('agent', help='Agent identifier (e.g. my-agent-name)')
    ap.add_argument('date', help='Date in YYYY-MM-DD format')
    args = ap.parse_args()

    project_root = ROOT / 'projects' / args.project
    if not project_root.exists():
        print(f'ERROR: project not found: {project_root}', file=sys.stderr)
        sys.exit(1)

    intake = project_root / 'incoming' / args.agent / args.date
    comments = intake / 'comments'
    proposals = intake / 'proposals'
    evidence = intake / 'evidence'
    artifacts = intake / 'artifacts'

    intake.mkdir(parents=True, exist_ok=True)
    comments.mkdir(exist_ok=True)
    proposals.mkdir(exist_ok=True)
    evidence.mkdir(exist_ok=True)
    artifacts.mkdir(exist_ok=True)

    (intake / 'README.md').write_text(
        README_TEMPLATE.format(project=args.project, agent=args.agent, date=args.date),
        encoding='utf-8'
    )
    (intake / 'REPORT.md').write_text(
        REPORT_TEMPLATE.format(project=args.project, agent=args.agent, date=args.date),
        encoding='utf-8'
    )
    (intake / 'commands.log').touch()

    # Write sample comment and proposal files
    sample_comment = """# Comment on Finding

## Identity
- Project: {project}
- Comment by: {agent}
- Date: {date}
- Target report: incoming/<other-agent>/<date>/REPORT.md
- Target finding ID:
- Audited SHA:

## Comment type

confirm / challenge / stale / duplicate / severity-change / evidence-addition / repair-lane-proposal

## Evidence
```
<!-- paste grep / screenshot / build output here -->
```

## Summary
<!-- one paragraph -->

## Recommended action
- Status change:
- Proposal status: proposal-open / proposal-supported / proposal-conflicted
- Conflict registry entry: YES / NO
- Notes for verifier:
""".format(project=args.project, agent=args.agent, date=args.date)

    sample_proposal = """# Proposal

## Identity
- Project: {project}
- Proposed by: {agent}
- Date: {date}
- Target finding ID(s):
- Proposal type: status-change / severity-change / merge / split / repair-lane

## Current state
<!-- what the bug status/severity is now -->

## Proposed change
<!-- what you propose -->

## Evidence
```
<!-- proof for the proposal -->
```

## Why this matters
<!-- one paragraph -->

## Proposal status: proposal-open
""".format(project=args.project, agent=args.agent, date=args.date)

    (comments / 'comment-on-OTHER-AGENT-BUG-ID.md').write_text(
        sample_comment, encoding='utf-8'
    )
    (proposals / 'proposal-TARGET-BUG-ID.md').write_text(
        sample_proposal, encoding='utf-8'
    )

    print('Created:')
    for p in [intake, comments, proposals, evidence, artifacts]:
        print(f'  {p}/')
    for f in ['README.md', 'REPORT.md', 'commands.log']:
        print(f'  {intake / f}')
    print(f'  {comments / "comment-on-OTHER-AGENT-BUG-ID.md"}  ← SAMPLE')
    print(f'  {proposals / "proposal-TARGET-BUG-ID.md"}        ← SAMPLE')


if __name__ == '__main__':
    main()