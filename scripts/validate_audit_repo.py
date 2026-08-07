#!/usr/bin/env python3
from pathlib import Path
import os
import sys
import re

DEFAULT_ROOT = Path(__file__).resolve().parent.parent
ROOT = Path(os.environ.get('AUDITREPO_ROOT', DEFAULT_ROOT)).resolve()
PROJECTS = ROOT / 'projects'
STRICT_REPORT_CONTENT = os.environ.get('AUDITREPO_STRICT_REPORT_CONTENT') == '1'
CHANGED_PATHS_FILE = os.environ.get('AUDITREPO_CHANGED_PATHS_FILE', '').strip()
ALLOWED_ROOT_MD = {
    'README.md',
    'AUDITREPO_OPERATING_MODEL.md',
    'PROJECT_REGISTRY.md',
    'CONTRIBUTING.md',
    'CLEANUP_RETENTION_POLICY.md',
    'MULTI_WITNESS_VERIFICATION_PROTOCOL.md',
    'SANDBOX-ENV-2026-06-21.md',
    'CONCURRENT_EDIT_PROTOCOL.md',
}

ANCHOR_LABEL_RE = re.compile(
    r'^(?:-\s*)?(?:Audited anchor(?:\s*\([^)]*\))?|Evidence anchor|Observed on anchor|'
    r'Source commit(?:s)?|Artifact(?: identity)?|Live snapshot):\s*(?P<value>.+?)\s*$',
    re.IGNORECASE,
)
PLACEHOLDER_VALUE_RE = re.compile(
    r'^(?:<[^>]*>|TBD|TODO|N/?A|NONE|UNKNOWN|NOT SET|SHA / ARTIFACT / LIVE SNAPSHOT)$',
    re.IGNORECASE,
)
FINDING_ID_BODY = r'[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+'
COMPACT_MATRIX_MARKERS = (
    '## CURRENT DEFECTS',
    '## VERIFIED NECESSARY IMPROVEMENTS',
    '## NARROWED RESIDUALS',
    '## SYSTEM VERIFICATION LANES',
    '## OWNER DECISIONS',
)


def fail(msg, errors):
    errors.append(msg)


def project_dirs():
    if not PROJECTS.exists():
        return []
    return [p for p in PROJECTS.iterdir() if p.is_dir() and not p.name.startswith('_')]


def load_changed_paths():
    if not CHANGED_PATHS_FILE:
        return set()
    source = Path(CHANGED_PATHS_FILE)
    if not source.is_file():
        return set()
    return {
        line.strip().replace('\\', '/')
        for line in source.read_text(encoding='utf-8', errors='ignore').splitlines()
        if line.strip()
    }


def intake_was_changed(date_dir, changed_paths):
    if STRICT_REPORT_CONTENT:
        return True
    try:
        prefix = date_dir.relative_to(ROOT).as_posix().rstrip('/') + '/'
    except ValueError:
        return False
    return any(path == prefix[:-1] or path.startswith(prefix) for path in changed_paths)


def concrete_value(value):
    value = value.strip().strip('`').strip()
    if not value or PLACEHOLDER_VALUE_RE.fullmatch(value):
        return False
    if re.fullmatch(r'[A-Za-z0-9_-]+(?:\s*/\s*[A-Za-z0-9_-]+){2,}', value):
        return False
    return bool(re.search(r'[A-Za-z0-9А-Яа-яЁё]', value))


def has_explicit_evidence_anchor(text):
    """Require a concrete value on an anchor-labelled line for new/changed intake."""
    for raw_line in text.splitlines():
        normalized = raw_line.replace('**', '').replace('__', '').strip()
        match = ANCHOR_LABEL_RE.match(normalized)
        if match and concrete_value(match.group('value')):
            return True
    return False


def has_legacy_evidence_anchor(text):
    """Compatibility fallback for untouched historical intake only."""
    if has_explicit_evidence_anchor(text):
        return True
    if re.search(r'\b[0-9a-f]{7,40}\b', text):
        return True
    if re.search(r'https?://\S+', text):
        return True
    return bool(re.search(
        r'^##\s+(?:Source commit|Source commits|Artifact|Live snapshot)\b',
        text,
        re.MULTILINE | re.IGNORECASE,
    ))


def report_has_real_evidence(report_file):
    """Reject untouched scaffolds while accepting established and historical report styles."""
    rtxt = report_file.read_text(encoding='utf-8', errors='ignore')

    has_real_title = bool(re.search(
        r'^(?:-\s*)?(?:- Title:|\*\*Title:\*\*)[ \t]*(?!<|TBD\b|TODO\b|N/?A\b)\S.+$',
        rtxt,
        re.MULTILINE | re.IGNORECASE,
    ))
    has_real_heading = bool(re.search(
        r'^###\s+(?!Finding\b|Observation\b|Confirm\b|Challenge\b|Merge proposal\b|'
        r'Comment on Finding\b)(?!.*<[^>]+>)(.+\S)',
        rtxt,
        re.MULTILINE | re.IGNORECASE,
    ))
    has_real_content = bool(re.search(
        r'^\s*(?:-\s+)?(?:\*\*)?(?:Description|Evidence|My evidence|Actual|Expected|'
        r'Observed on SHA|Observed on anchor|Source file|Route/files|Root cause|Possible mechanism|'
        r'Target report|Current HEAD evidence|Why same root cause|Limitations of this method|'
        r'User/operator impact)(?:\*\*)?:\s*(?!<|TBD\b|TODO\b|N/?A\b)\S.+$',
        rtxt,
        re.MULTILINE | re.IGNORECASE,
    ))
    has_finding_table = bool(re.search(
        rf'^\|\s*{FINDING_ID_BODY}\s*\|',
        rtxt,
        re.MULTILINE,
    ))
    has_finding_id = bool(re.search(
        rf'(?<![A-Z0-9-]){FINDING_ID_BODY}(?![A-Z0-9-])',
        rtxt,
    ))
    has_evidence_index = bool(re.search(
        r'^\s*\d+\.\s+`[^`\n]+\.md`\s+[—-]\s+\S.+$',
        rtxt,
        re.MULTILINE,
    ))
    has_summary_prose = bool(re.search(
        r'^##\s+Summary\b[^\n]*\n(?:\s*\n)*(?:[-*]\s+\S.+|(?!(?:#|<!--|---))\S.{20,})$',
        rtxt,
        re.MULTILINE | re.IGNORECASE,
    ))
    return any((
        has_real_title,
        has_real_heading,
        has_real_content,
        has_finding_table,
        has_finding_id,
        has_evidence_index,
        has_summary_prose,
    ))


def validate_matrix_summary(proj, errors):
    """Validate compact active-work matrices; retain legacy counter compatibility."""
    matrix = proj / 'verified' / 'MASTER_BUG_MATRIX.md'
    if not matrix.is_file():
        return

    text = matrix.read_text(encoding='utf-8', errors='ignore')

    # Current owner model: MASTER is a compact active-work notebook. Reuse the
    # canonical coverage parser so the generic validator never forces old closed/
    # severity counters back into a cleaned matrix.
    if '## Current state' in text and any(marker in text for marker in COMPACT_MATRIX_MARKERS):
        try:
            from matrix_coverage_lib import parse_matrix, matrix_integrity_problems
            rows, _open_ids, _closed_rows = parse_matrix(text)
            for problem in matrix_integrity_problems(text, rows):
                fail(f'{proj.name}: {problem}', errors)
        except (ImportError, ValueError) as exc:
            fail(f'{proj.name}: compact matrix validation failed: {exc}', errors)
        return

    # Compatibility for projects that have not yet migrated from the historical
    # fixed/P0/P1/P2/P3 counter schema.
    def capture(pattern, label):
        match = re.search(pattern, text, re.MULTILINE)
        if not match:
            fail(f'{proj.name}: matrix counter missing: {label}', errors)
            return None
        return int(match.group(1))

    headings = {
        'fixed': capture(r'^## ✅ ЗАКРЫТО \((\d+)\)$', 'fixed heading'),
        'p1': capture(r'^## 🟠 P1 — ОТКРЫТО \((\d+)\)$', 'P1 heading'),
        'p2': capture(r'^## 🟡 P2 — ОТКРЫТО \((\d+)\)$', 'P2 heading'),
        'p3': capture(r'^## 🟢 P3 — ОТКРЫТО \((\d+)\)$', 'P3 heading'),
    }
    summary = {
        'fixed': capture(r'^\| Закрыто \(fixed\) \| (\d+) \|$', 'fixed summary'),
        'p0': capture(r'^\| \*\*P0 открыто\*\* \| \*\*(\d+)\*\* \|$', 'P0 summary'),
        'p1': capture(r'^\| P1 открыто \| (\d+) \|$', 'P1 summary'),
        'p2': capture(r'^\| P2 открыто \| (\d+) \|$', 'P2 summary'),
        'p3': capture(r'^\| P3 открыто \| (\d+) \|$', 'P3 summary'),
        'refactoring': capture(r'^\| Рефакторинг \| (\d+) \|$', 'refactoring summary'),
        'auditrepo': capture(r'^\| AuditRepo \| (\d+) \|$', 'AuditRepo summary'),
        'total': capture(r'^\| \*\*Всего открыто \(матрица\)\*\* \| \*\*(\d+)\*\* \|$', 'total-open summary'),
    }

    for key in ('fixed', 'p1', 'p2', 'p3'):
        if headings[key] is not None and summary[key] is not None and headings[key] != summary[key]:
            fail(
                f'{proj.name}: matrix counter mismatch for {key}: heading={headings[key]} summary={summary[key]}',
                errors,
            )

    total_parts = [summary[key] for key in ('p0', 'p1', 'p2', 'p3', 'refactoring', 'auditrepo')]
    if summary['total'] is not None and all(value is not None for value in total_parts):
        calculated = sum(total_parts)
        if calculated != summary['total']:
            fail(
                f'{proj.name}: matrix total-open mismatch: calculated={calculated} summary={summary["total"]}',
                errors,
            )


errors = []
changed_paths = load_changed_paths()
legacy_empty_reports = []

for p in ROOT.glob('*.md'):
    if p.name not in ALLOWED_ROOT_MD:
        fail(f'unexpected root markdown file: {p.name}', errors)

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

for required in ['README.md', 'AUDITREPO_OPERATING_MODEL.md', 'PROJECT_REGISTRY.md', 'projects', 'scripts']:
    if not (ROOT / required).exists():
        fail(f'missing required root path: {required}', errors)

for proj in project_dirs():
    for rel in ['README.md', 'PROJECT_META.yml', 'incoming', 'working', 'verification', 'verified', 'repairs', 'reverify', 'legacy', 'archive']:
        if not (proj / rel).exists():
            fail(f'{proj.name}: missing {rel}', errors)

    validate_matrix_summary(proj, errors)

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
        changed_intake = intake_was_changed(date_dir, changed_paths)
        if not identity_file.exists():
            fail(f'{proj.name}: intake folder missing README.md or REPORT.md: {date_dir}', errors)
        else:
            txt = identity_file.read_text(encoding='utf-8', errors='ignore')
            markers = [
                '## Agent', '## Identity', '## Agent identity',
                'Агент:', '- Agent:', 'Role:', 'Arena Agent',
                'intake', 'интейк', 'Independent audit pass',
                '# Agent Work Report', '# Agent Audit Report', '# PremiumControls', '# Report',
                '## Meta', '**Имя агента:**', '**Аудитор:**',
                '**Проект:**', '**Project:**', '**Дата',
                '## Source commit', '## Source commits',
                '## Gates', '## Fixes',
            ]
            if not any(m in txt for m in markers):
                fail(f'{proj.name}: intake identity file missing recognizable identity markers: {identity_file}', errors)

            has_anchor = (
                has_explicit_evidence_anchor(txt)
                if changed_intake
                else has_legacy_evidence_anchor(txt)
            )
            if not has_anchor:
                requirement = 'explicit labelled evidence anchor' if changed_intake else 'concrete evidence anchor'
                fail(
                    f'{proj.name}: intake identity file has no {requirement} '
                    f'(SHA, artifact identity or live snapshot required): {identity_file}',
                    errors,
                )

        report_file = date_dir / 'REPORT.md'
        if report_file.exists() and not report_has_real_evidence(report_file):
            comments_dir = date_dir / 'comments'
            has_comments = comments_dir.exists() and any(
                f.suffix == '.md' and 'comment-on-OTHER' not in f.name
                for f in comments_dir.iterdir()
            )
            if has_comments:
                print(f'  WARNING: {proj.name}: REPORT.md appears empty template,'
                      f' but evidence found in comments/: {report_file}')
            elif changed_intake:
                fail(f'{proj.name}: REPORT.md appears empty template'
                     f' (no real observation/evidence content)'
                     f' and no evidence in comments/: {report_file}', errors)
            else:
                legacy_empty_reports.append(report_file)

    if not (proj / 'working' / 'README.md').exists():
        fail(f'{proj.name}: working missing README.md', errors)
    if not (proj / 'verified' / 'README.md').exists():
        fail(f'{proj.name}: verified missing README.md', errors)
    if not (proj / 'verification' / 'README.md').exists():
        fail(f'{proj.name}: verification missing README.md', errors)

if legacy_empty_reports:
    print(f'AUDITREPO LEGACY REPORT DEBT: {len(legacy_empty_reports)} untouched empty scaffold(s)')
    for report_file in legacy_empty_reports:
        try:
            shown = report_file.relative_to(ROOT)
        except ValueError:
            shown = report_file
        print('-', shown)
    print('New or modified intake folders are blocking; historical debt remains visible for staged cleanup.')

if errors:
    print('AUDITREPO VALIDATION: FAIL')
    for e in errors:
        print('-', e)
    sys.exit(1)

print('AUDITREPO VALIDATION: PASS')