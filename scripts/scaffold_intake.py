#!/usr/bin/env python3
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parent.parent

README_TEMPLATE = """# Intake README

## Agent
- Name: {agent}
- Date: {date}
- Source repo state:
- Commit / branch audited:

## Files in this folder
- report 1
- report 2
- artifacts/

## Notes for verifier
- what is confirmed
- what is suspected
- what still needs browser verification
"""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project')
    ap.add_argument('agent')
    ap.add_argument('date')
    args = ap.parse_args()

    intake = ROOT / 'projects' / args.project / 'incoming' / args.agent / args.date
    intake.mkdir(parents=True, exist_ok=True)
    (intake / 'README.md').write_text(
        README_TEMPLATE.format(agent=args.agent, date=args.date),
        encoding='utf-8'
    )
    print(f'Created intake scaffold: {intake}')

if __name__ == '__main__':
    main()
