#!/usr/bin/env python3
from pathlib import Path
import sys
import re

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / 'projects'
ALLOWED_ROOT_MD = {
    'README.md',
    'PROJECT_REGISTRY.md',
    'CONTRIBUTING.md',
    'CLEANUP_RETENTION_POLICY.md',
    'MULTI_WITNESS_VERIFICATION_PROTOCOL.md',
    # Arena environment passport is intentionally linked from README.md
    # and required for gb-is-my-strength audit agents (Node 22 / strangler build traps).
    'SANDBOX-ENV-2026-06-21.md',
}

def fail(msg, errors):
    errors.append(msg)

def project_dirs():
    if not PROJECTS.exists():
        return []
    return [p for p in PROJECTS.iterdir() if p.is_dir() and not p.name.startswith('_')]

errors = []

# Root hygiene
for p in ROOT.glob('*.md'):
    if p.name not in ALLOWED_ROOT_MD:
        fail(f'unexpected root markdown file: {p.name}', errors)

# Required roots
for required in ['README.md', 'PROJECT_REGISTRY.md', 'projects', 'scripts']:
    if not (ROOT / required).exists():
        fail(f'missing required root path: {required}', errors)

# Project checks
for proj in project_dirs():
    for rel in ['README.md', 'PROJECT_META.yml', 'incoming', 'working', 'verification', 'verified', 'repairs', 'reverify', 'archive']:
        if not (proj / rel).exists():
            fail(f'{proj.name}: missing {rel}', errors)

    # Intake structure
    incoming = proj / 'incoming'
    for date_dir in incoming.glob('*/*'):
        if not date_dir.is_dir():
            continue
        if not re.match(r'^\d{4}-\d{2}-\d{2}(?:-r\d+)?$', date_dir.name):
            fail(f'{proj.name}: invalid intake date folder {date_dir}', errors)
            continue
        readme = date_dir / 'README.md'
        report = date_dir / 'REPORT.md'
        identity_file = readme if readme.exists() else report
        if not identity_file.exists():
            fail(f'{proj.name}: intake folder missing README.md or REPORT.md: {date_dir}', errors)
        else:
            txt = identity_file.read_text(encoding='utf-8', errors='ignore')
            markers = [
                '## Agent',
                '## Identity',
                '## Agent identity',
                'Агент:',
                '- Agent:',
                'Role:',
                'Arena Agent',
                'intake',
                'интейк',
                'Independent audit pass',
                '# Agent Work Report',
                '# PremiumControls',
                '# Report',
                '## Meta',
                '**Имя агента:**',
                '**Аудитор:**',
                '**Проект:**',
                '**Project:**',
                '**Дата',
                '## Source commit',
                '## Source commits',
                '## Gates',
                '## Fixes',
            ]
            if not any(m in txt for m in markers):
                fail(f'{proj.name}: intake identity file missing recognizable identity markers: {identity_file}', errors)
            # SHA-first principle: an intake must reference a concrete commit SHA,
            # otherwise an empty/template report passes the (substring) marker check.
            if not re.search(r'\b[0-9a-f]{7,40}\b', txt):
                fail(f'{proj.name}: intake identity file has no commit SHA (SHA-first evidence required): {identity_file}', errors)

    # Verified should not contain obvious placeholders as the only content, but placeholders are allowed.
    # Working + verified should contain at least one README.
    if not (proj / 'working' / 'README.md').exists():
        fail(f'{proj.name}: working missing README.md', errors)
    if not (proj / 'verified' / 'README.md').exists():
        fail(f'{proj.name}: verified missing README.md', errors)
    if not (proj / 'verification' / 'README.md').exists():
        fail(f'{proj.name}: verification missing README.md', errors)

if errors:
    print('AUDITREPO VALIDATION: FAIL')
    for e in errors:
        print('-', e)
    sys.exit(1)

print('AUDITREPO VALIDATION: PASS')
