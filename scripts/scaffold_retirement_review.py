#!/usr/bin/env python3
from pathlib import Path
import argparse
import sys

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / 'projects' / '_templates' / 'SUSPECTED_RETIREMENT_TEMPLATE.md'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project')
    ap.add_argument('bug_id')
    ap.add_argument('date')
    args = ap.parse_args()

    project_root = ROOT / 'projects' / args.project
    if not project_root.exists():
        print(f'ERROR: project not found: {project_root}', file=sys.stderr)
        sys.exit(1)

    verification_dir = project_root / 'verification' / 'retirement-reviews'
    verification_dir.mkdir(parents=True, exist_ok=True)
    out = verification_dir / f'{args.bug_id}-retirement-review-{args.date}.md'
    text = TEMPLATE.read_text(encoding='utf-8') if TEMPLATE.exists() else '# Suspected Retirement Review\n'
    out.write_text(text, encoding='utf-8')
    print(out)

if __name__ == '__main__':
    main()
