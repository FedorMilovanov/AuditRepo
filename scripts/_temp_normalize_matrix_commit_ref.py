#!/usr/bin/env python3
from pathlib import Path

matrix = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
workflow = Path('.github/workflows/_temp-normalize-matrix-commit-ref.yml')
self_path = Path(__file__)

text = matrix.read_text(encoding='utf-8')
old = '| `6cba8af0`; run `30166440002` |'
new = '| `6cba8af0` |'
if text.count(old) != 1:
    raise SystemExit(f'expected one validator ref cell, found {text.count(old)}')
text = text.replace(old, new, 1)
matrix.write_text(text, encoding='utf-8')

if workflow.exists():
    workflow.unlink()
self_path.unlink()
