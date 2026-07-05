#!/usr/bin/env python3
"""check_matrix_coverage.py — cross-check MASTER_BUG_MATRIX vs evidence surfaces.

Recreated 2026-07-05 (original was lost with a fallen agent workspace that was
never pushed). Purpose (AR-004 lineage): keep the canonical matrix honest.

Checks per project (default: projects/gb-is-my-strength):
  1. Every OPEN bug ID in MASTER_BUG_MATRIX.md is mentioned in at least one
     evidence surface (reverify/, incoming/, working/) — otherwise it is an
     "orphan claim" (no traceable evidence).
  2. Every bug ID mentioned in reverify/ docs exists in the matrix (open,
     closed, or notes) — otherwise it is "unregistered evidence" (finding
     never landed in the canon).
  3. Closed-table commit references look like short SHAs (7-10 hex) or an
     explicit non-SHA marker (e.g. V3).

Exit code 1 if any check fails (strict mode, default); use --warn-only to
always exit 0.
"""
import argparse
import pathlib
import re
import sys

ID_RE = re.compile(r'\b((?:P[0-3]|BUG|NEW|AUDIT|SEC|UI|PC|R|AR|SEARCH|DATA|GATE|CONTENT|CACHE|DEPLOY|SEO|VALIDATE|IMAGE|SHADOW|NOINDEX|STRANGLER|DEAD)[A-Z0-9]*(?:-[A-Za-z0-9]+)+)\b')
SHA_RE = re.compile(r'^[0-9a-f]{7,10}$')
NON_SHA_OK = {'V3', 'V2', 'V1'}

def extract_ids(text):
    return set(m.group(1) for m in ID_RE.finditer(text))

def read_all(paths):
    out = {}
    for p in paths:
        if p.is_file() and p.suffix == '.md':
            out[p] = p.read_text(encoding='utf-8', errors='ignore')
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--project', default='projects/gb-is-my-strength')
    ap.add_argument('--warn-only', action='store_true')
    args = ap.parse_args()

    root = pathlib.Path(__file__).resolve().parent.parent
    proj = root / args.project
    matrix_path = proj / 'verified' / 'MASTER_BUG_MATRIX.md'
    if not matrix_path.exists():
        print(f'FATAL: {matrix_path} not found'); return 2
    matrix = matrix_path.read_text(encoding='utf-8')

    # --- Parse matrix: open IDs (rows in tables of the ОТКРЫТО sections) and all IDs.
    all_matrix_ids = extract_ids(matrix)
    open_ids = set()
    section = None
    for line in matrix.splitlines():
        if line.startswith('## '):
            section = line
        if section and ('ОТКРЫТО' in section or 'РЕФАКТОРИНГ' in section or 'AUDITREPO' in section):
            m = re.match(r'\|\s*([A-Z][A-Za-z0-9-]+)\s*\|', line)
            if m and '-' in m.group(1):
                open_ids.add(m.group(1))

    evidence_files = []
    for sub in ('reverify', 'incoming', 'working'):
        d = proj / sub
        if d.exists():
            evidence_files += list(d.rglob('*.md'))
    evidence = read_all(evidence_files)
    evidence_ids = set()
    for t in evidence.values():
        evidence_ids |= extract_ids(t)

    # Weaker tier: archived evidence still counts (matrix restructures move
    # processed intake into archive/), but is reported separately at -v.
    archive_ids = set()
    d = proj / 'archive'
    if d.exists():
        for t in read_all(list(d.rglob('*.md'))).values():
            archive_ids |= extract_ids(t)

    problems = []
    archived_only = []

    # Check 1: orphan open claims.
    for bid in sorted(open_ids):
        if bid not in evidence_ids:
            if bid in archive_ids:
                archived_only.append(bid)
            else:
                problems.append(f'ORPHAN-CLAIM: open bug {bid} has no evidence in reverify/incoming/working/archive')

    # Check 2: unregistered evidence (reverify only — incoming may be raw noise).
    reverify_ids = set()
    for p, t in evidence.items():
        if 'reverify' in str(p):
            reverify_ids |= extract_ids(t)
    for bid in sorted(reverify_ids):
        if bid not in all_matrix_ids:
            problems.append(f'UNREGISTERED-EVIDENCE: reverify mentions {bid} but matrix does not')

    # Check 3: closed-table commit refs.
    in_closed = False
    for line in matrix.splitlines():
        if line.startswith('## '):
            in_closed = 'ЗАКРЫТО' in line
            continue
        if in_closed:
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            if len(cells) >= 3 and '-' in cells[0] and not cells[0].startswith('--'):
                ref = cells[-1].strip('`').split()[0].strip('`') if cells[-1] else ''
                if ref and not SHA_RE.match(ref) and ref not in NON_SHA_OK:
                    problems.append(f'BAD-COMMIT-REF: closed bug {cells[0]} ref {ref!r} is not a short SHA')

    print(f"matrix: {len(all_matrix_ids)} ids total, {len(open_ids)} open rows; evidence files: {len(evidence)}; archived-only evidence: {len(archived_only)}")
    if problems:
        print(f'\n{len(problems)} problem(s):')
        for p in problems:
            print('  -', p)
        return 0 if args.warn_only else 1
    print('OK: matrix coverage checks passed')
    return 0

if __name__ == '__main__':
    sys.exit(main())
