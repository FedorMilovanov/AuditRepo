#!/usr/bin/env python3
from pathlib import Path
import argparse
import sys

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / 'projects' / '_templates' / 'CURRENT_HEAD_REVERIFY_TEMPLATE.md'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('project')
    ap.add_argument('date')
    ap.add_argument('sha')
    args = ap.parse_args()

    project_root = ROOT / 'projects' / args.project
    if not project_root.exists():
        print(f'ERROR: project not found: {project_root}', file=sys.stderr)
        sys.exit(1)

    reverify_dir = project_root / 'reverify'
    reverify_dir.mkdir(parents=True, exist_ok=True)
    out = reverify_dir / f'CURRENT_HEAD_REVERIFY_{args.date}_{args.sha}.md'
    text = TEMPLATE.read_text(encoding='utf-8') if TEMPLATE.exists() else '# Current Head Reverify\n'
    out.write_text(text, encoding='utf-8')
    print(out)

if __name__ == '__main__':
    main()
