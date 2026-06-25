#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / 'projects'
errors = []

if not (ROOT / 'README.md').exists():
    errors.append('Missing root README.md')
if not (ROOT / 'PROJECT_REGISTRY.md').exists():
    errors.append('Missing PROJECT_REGISTRY.md')
if not PROJECTS.exists():
    errors.append('Missing projects/ directory')

for p in PROJECTS.iterdir() if PROJECTS.exists() else []:
    if not p.is_dir() or p.name.startswith('_'):
        continue
    for rel in ['README.md', 'incoming', 'working', 'verified']:
        if not (p / rel).exists():
            errors.append(f'{p}: missing {rel}')

if errors:
    print('AUDITREPO STRUCTURE CHECK: FAIL')
    for e in errors:
        print('-', e)
    sys.exit(1)

print('AUDITREPO STRUCTURE CHECK: PASS')
