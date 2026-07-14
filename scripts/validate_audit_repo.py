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
    'SANDBOX-ENV-2026-06-21.md',
    'CONCURRENT_EDIT_PROTOCOL.md',
}

def fail(msg, errors):
    errors.append(msg)

def project_dirs():
    if not PROJECTS.exists():
        return []
    return [p for p in PROJECTS.iterdir() if p.is_dir() and not p.name.startswith('_')]

errors = []

# Root hygiene: .md-файлы по allow-list
for p in ROOT.glob('*.md'):
    if p.name not in ALLOWED_ROOT_MD:
        fail(f'unexpected root markdown file: {p.name}', errors)

# AR-006: allow-list КОРНЕВЫХ ДИРЕКТОРИЙ и не-.md файлов — до этого валидатор
# молча пропускал мусор уровня корня (прецедент: verification/atlas/ с 27 PNG).
# verification/ и references/ узаконены: их используют atlas-трек и UI-канон.
ALLOWED_ROOT_DIRS = {
    '.git', '.github', 'projects', 'scripts', 'verification', 'references',
    '_OWNER_DOWNLOADS',
}
ALLOWED_ROOT_FILES = {'.gitignore'}
for p in ROOT.iterdir():
    if p.is_dir():
        if p.name not in ALLOWED_ROOT_DIRS:
            fail(f'unexpected root directory: {p.name}/ (внесите в ALLOWED_ROOT_DIRS осознанно или уберите в projects/<proj>/)', errors)
    elif p.suffix != '.md' and p.name not in ALLOWED_ROOT_FILES:
        fail(f'unexpected root file: {p.name}', errors)

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
                '## Agent', '## Identity', '## Agent identity',
                'Агент:', '- Agent:', 'Role:', 'Arena Agent',
                'intake', 'интейк', 'Independent audit pass',
                '# Agent Work Report', '# PremiumControls', '# Report',
                '## Meta', '**Имя агента:**', '**Аудитор:**',
                '**Проект:**', '**Project:**', '**Дата',
                '## Source commit', '## Source commits',
                '## Gates', '## Fixes',
            ]
            if not any(m in txt for m in markers):
                fail(f'{proj.name}: intake identity file missing recognizable identity markers: {identity_file}', errors)
            # SHA-first principle: an intake must reference a concrete commit SHA
            if not re.search(r'\b[0-9a-f]{7,40}\b', txt):
                fail(f'{proj.name}: intake identity file has no commit SHA (SHA-first evidence required): {identity_file}', errors)

                # REPORT.md must contain at least one real finding/evidence pattern
                # (not just scaffold placeholders). Accept several in-the-wild intake styles:
                #  - scaffold: - Severity:, - Title:
                #  - bold style: - **Severity:** P2
                #  - heading style: ### BUG-ID / ### AUDIT-ID
                #  - table style: | BUG-01 | ... |
                #  - verifier style: explicit issue IDs in body text
                report_file = date_dir / 'REPORT.md'
                if report_file.exists():
                    rtxt = report_file.read_text(encoding='utf-8', errors='ignore')
                    has_real_severity = bool(re.search(
                        r'^(?:-\s*)?(?:- Severity:|\*\*Severity:\*\*)[ \t]*(P0|P1|P2|P3)\b',
                        rtxt, re.MULTILINE))
                    has_real_title = bool(re.search(
                        r'^(?:-\s*)?(?:- Title:|\*\*Title:\*\*)[ \t]*\S+',
                        rtxt, re.MULTILINE))
                    has_real_heading = bool(re.search(
                        r'^###\s+(?!Finding\b|Confirm\b|Challenge\b|Merge proposal\b|Comment on Finding\b)(?!<)(.+\S)',
                        rtxt, re.MULTILINE))
                    has_real_content = bool(re.search(
                        r'^\s*(?:-\s+|\*\*[^*]+:\*\*\s*)(?:Description|Evidence|My evidence|Observed on SHA|Source file|'
                        r'Route/files|Root cause|Target report|Current HEAD evidence|Why same root cause)',
                        rtxt, re.MULTILINE))
                    has_bug_table = bool(re.search(
                        r'^\|\s*(?:BUG|NEW|AUDIT|SEC|SEARCH|UI|AR|R|REG|PC|CSP|CI)-?[A-Z0-9._-]*\s*\|',
                        rtxt, re.MULTILINE))
                    has_issue_id = bool(re.search(
                        r'\b(?:BUG|NEW|AUDIT|SEC|SEARCH|UI|AR|R|REG|PC|CSP|CI)-[A-Z0-9._-]+\b',
                        rtxt))
                    if not (has_real_severity or has_real_title or has_real_heading or has_real_content or has_bug_table or has_issue_id):
                        comments_dir = date_dir / 'comments'
                        has_comments = comments_dir.exists() and any(
                            f.suffix == '.md' and 'comment-on-OTHER' not in f.name
                            for f in comments_dir.iterdir()
                        )
                        if has_comments:
                            print(f'  WARNING: {proj.name}: REPORT.md appears empty template,'
                                  f' but evidence found in comments/: {report_file}')
                        else:
                            fail(f'{proj.name}: REPORT.md appears empty template'
                                 f' (no real severity/title/findings)'
                                 f' and no evidence in comments/: {report_file}', errors)

    # Working + verified + verification should contain at least one README.
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
