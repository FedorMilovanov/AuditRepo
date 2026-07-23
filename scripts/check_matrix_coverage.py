#!/usr/bin/env python3
"""Cross-check the canonical bug matrix against traceable evidence.

The checker deliberately separates three concepts:

1. canonical finding IDs — first-column IDs in active canonical tables of
   MASTER_BUG_MATRIX.md;
2. explicit evidence IDs — IDs used as headings, table keys, labels or exact
   backticked tokens in reverify/incoming/working documents;
3. direct matrix witnesses — existing evidence-document paths or immutable
   ``verified-source/browser/ci/build (<sha>)`` markers recorded in a matrix row.

Historical auditor/session tables are evidence logs rather than a second
canonical registry. The generic ID grammar covers all current families such as
CI, GILL, TTS, D, NG and future families without a hardcoded prefix allowlist.
"""

from __future__ import annotations

import argparse
import collections
import json
import pathlib
import re
import sys
from dataclasses import dataclass
from typing import Iterable

ID_BODY = r'[A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)+'
TOKEN_RE = re.compile(
    rf'(?<![A-Za-z0-9-])({ID_BODY})(?![A-Za-z0-9-])'
)
EXACT_ID_RE = re.compile(rf'^{ID_BODY}$')
UPPER_ID_RE = re.compile(r'^[A-Z0-9]+(?:-[A-Z0-9]+)+$')
SHA_RE = re.compile(r'^[0-9a-f]{7,10}$')
FULL_SHA_RE = re.compile(r'^[0-9a-f]{7,40}$')
NON_SHA_OK = {'V3', 'V2', 'V1', 'BY-DESIGN'}
PATH_RE = re.compile(
    r'(?P<path>(?:reverify|incoming|working|archive)/[^`|\s)]+?\.md)'
)
WITNESS_RE = re.compile(
    r'\bverified-(?:source|browser|ci|build)\b[^|\n]{0,180}?'
    r'(?P<sha>[0-9a-f]{7,40})\b',
    re.IGNORECASE,
)
CANONICAL_SECTION_MARKERS = ('ЗАКРЫТО', 'ОТКРЫТО', 'РЕФАКТОРИНГ', 'AUDITREPO')
OPEN_SECTION_MARKERS = ('ОТКРЫТО', 'РЕФАКТОРИНГ', 'AUDITREPO')


@dataclass(frozen=True)
class MatrixRow:
    finding_id: str
    section: str
    line_no: int
    line: str
    cells: tuple[str, ...]


def parse_table_cells(line: str) -> list[str]:
    if not line.startswith('| ') or line.startswith('|---'):
        return []
    return [cell.strip() for cell in line.strip().strip('|').split('|')]


def is_finding_id(value: str) -> bool:
    return bool(EXACT_ID_RE.fullmatch(value or ''))


def read_markdown(paths: Iterable[pathlib.Path]) -> dict[pathlib.Path, str]:
    result: dict[pathlib.Path, str] = {}
    for path in paths:
        if path.is_file() and path.suffix.lower() == '.md':
            result[path] = path.read_text(encoding='utf-8', errors='ignore')
    return result


def is_canonical_section(section: str) -> bool:
    return any(marker in section for marker in CANONICAL_SECTION_MARKERS)


def parse_matrix(matrix: str) -> tuple[dict[str, MatrixRow], set[str], list[MatrixRow]]:
    rows: dict[str, MatrixRow] = {}
    open_ids: set[str] = set()
    closed_rows: list[MatrixRow] = []
    section = ''

    for line_no, line in enumerate(matrix.splitlines(), 1):
        if line.startswith('## '):
            section = line[3:].strip()
            continue
        if not is_canonical_section(section):
            continue
        cells = parse_table_cells(line)
        if not cells or cells[0] in {'ID', 'Поле', 'Категория', 'Статус'}:
            continue
        finding_id = cells[0]
        if not is_finding_id(finding_id):
            continue
        row = MatrixRow(finding_id, section, line_no, line, tuple(cells))
        if finding_id in rows:
            raise ValueError(
                f'duplicate canonical matrix ID {finding_id}: '
                f'lines {rows[finding_id].line_no} and {line_no}'
            )
        rows[finding_id] = row
        if any(marker in section for marker in OPEN_SECTION_MARKERS):
            open_ids.add(finding_id)
        if 'ЗАКРЫТО' in section:
            closed_rows.append(row)

    return rows, open_ids, closed_rows


def structured_ids(text: str, known_ids: set[str]) -> dict[str, set[str]]:
    """Return explicitly structured IDs and the contexts that exposed them."""
    found: dict[str, set[str]] = collections.defaultdict(set)

    for line in text.splitlines():
        cells = parse_table_cells(line)
        if cells and is_finding_id(cells[0]):
            found[cells[0]].add('table-key')

        if re.match(r'^#{1,6}\s+', line):
            for token in TOKEN_RE.findall(line):
                found[token].add('heading')

        # Strong/bare labels at the beginning of a line, e.g.
        # "- **BUG-01:** ..." or "BUG-01 — ...". Collect all IDs from the
        # label prefix so ranges such as "AR-IDX-01 и AR-IDX-02" do not
        # collapse into a fabricated prefix.
        label_match = re.match(
            r'^\s*(?:[-*]\s+)?(?P<label>(?:\*\*|`)?[^:—–]{1,180}?'
            r'(?:\*\*|`)?)(?:\s*[:—–]\s+)',
            line,
        )
        if label_match:
            for token in TOKEN_RE.findall(label_match.group('label')):
                found[token].add('label')

        for content in re.findall(r'`([^`\n]+)`', line):
            if is_finding_id(content):
                found[content].add('backtick')

    # Backticked prose-like tokens are only considered new evidence IDs when
    # they look like stable uppercase identifiers and contain a numeric
    # discriminator. Existing canonical/alias IDs are always retained.
    filtered: dict[str, set[str]] = {}
    for token, contexts in found.items():
        strong_context = bool(contexts & {'table-key', 'heading', 'label'})
        credible_backtick = (
            token in known_ids
            or (
                bool(UPPER_ID_RE.fullmatch(token))
                and any(char.isdigit() for char in token)
                and not re.fullmatch(r'P[0-3](?:-[A-Z0-9]+)+', token)
            )
        )
        if strong_context or credible_backtick:
            filtered[token] = contexts
    return filtered


def load_aliases(
    path: pathlib.Path,
    matrix_ids: set[str],
) -> tuple[dict[str, str | None], set[str]]:
    if not path.exists():
        return {}, set()
    data = json.loads(path.read_text(encoding='utf-8'))
    if data.get('version') != 1:
        raise ValueError(f'{path}: expected version 1')

    ignored = set(data.get('ignoredTokens', []))
    aliases: dict[str, str | None] = {}
    for alias, raw in data.get('aliases', {}).items():
        if not is_finding_id(alias):
            raise ValueError(f'{path}: invalid alias ID {alias!r}')
        if alias in matrix_ids:
            raise ValueError(f'{path}: alias {alias} is already canonical')
        if isinstance(raw, str):
            target = raw
            status = 'alias'
        elif isinstance(raw, dict):
            target = raw.get('canonical')
            status = raw.get('status', 'alias')
        else:
            raise ValueError(f'{path}: alias {alias} must be string or object')
        if status not in {'alias', 'retired', 'informational', 'false-positive'}:
            raise ValueError(f'{path}: unsupported status {status!r} for {alias}')
        if status == 'alias':
            if target not in matrix_ids:
                raise ValueError(
                    f'{path}: alias {alias} targets missing canonical ID {target!r}'
                )
            aliases[alias] = target
        else:
            aliases[alias] = None
    return aliases, ignored


def row_direct_witness(
    row: MatrixRow,
    project: pathlib.Path,
) -> tuple[bool, list[str]]:
    problems: list[str] = []
    paths = list(
        dict.fromkeys(match.group('path') for match in PATH_RE.finditer(row.line))
    )
    existing_paths = 0
    for rel in paths:
        candidate = project / rel
        if candidate.is_file():
            existing_paths += 1
        else:
            problems.append(
                f'BROKEN-EVIDENCE-PATH: open bug {row.finding_id} '
                f'references missing {rel}'
            )

    immutable_witness = any(
        FULL_SHA_RE.fullmatch(match.group('sha'))
        for match in WITNESS_RE.finditer(row.line)
    )
    return bool(existing_paths or immutable_witness), problems


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--project', default='projects/gb-is-my-strength')
    parser.add_argument('--warn-only', action='store_true')
    parser.add_argument('--verbose', action='store_true')
    parser.add_argument('--json-out')
    args = parser.parse_args()

    root = pathlib.Path(__file__).resolve().parent.parent
    project = root / args.project
    matrix_path = project / 'verified' / 'MASTER_BUG_MATRIX.md'
    aliases_path = project / 'verified' / 'MATRIX_ID_ALIASES.json'
    if not matrix_path.exists():
        print(f'FATAL: {matrix_path} not found')
        return 2

    matrix = matrix_path.read_text(encoding='utf-8')
    try:
        matrix_rows, open_ids, closed_rows = parse_matrix(matrix)
        aliases, ignored_tokens = load_aliases(aliases_path, set(matrix_rows))
    except (ValueError, json.JSONDecodeError) as error:
        print(f'FATAL: {error}')
        return 2

    evidence_paths: list[pathlib.Path] = []
    for directory_name in ('reverify', 'incoming', 'working'):
        directory = project / directory_name
        if directory.exists():
            evidence_paths.extend(directory.rglob('*.md'))
    evidence = read_markdown(evidence_paths)

    archive_dir = project / 'archive'
    archive = read_markdown(archive_dir.rglob('*.md')) if archive_dir.exists() else {}

    known_ids = set(matrix_rows) | set(aliases) | ignored_tokens
    evidence_occurrences: dict[str, list[str]] = collections.defaultdict(list)
    archive_occurrences: dict[str, list[str]] = collections.defaultdict(list)
    reverify_ids: set[str] = set()

    for path, text in evidence.items():
        ids = structured_ids(text, known_ids)
        for finding_id in ids:
            evidence_occurrences[finding_id].append(str(path.relative_to(project)))
            if 'reverify' in path.parts:
                reverify_ids.add(finding_id)

    for path, text in archive.items():
        for finding_id in structured_ids(text, known_ids):
            archive_occurrences[finding_id].append(str(path.relative_to(project)))

    # Historical aliases provide evidence to their canonical target.
    canonical_evidence = set(evidence_occurrences)
    canonical_archive = set(archive_occurrences)
    for alias, target in aliases.items():
        if target and alias in evidence_occurrences:
            canonical_evidence.add(target)
        if target and alias in archive_occurrences:
            canonical_archive.add(target)

    problems: list[str] = []
    archived_only: list[str] = []
    direct_witnessed: list[str] = []

    for finding_id in sorted(open_ids):
        row = matrix_rows[finding_id]
        has_direct, path_problems = row_direct_witness(row, project)
        problems.extend(path_problems)
        if finding_id in canonical_evidence:
            continue
        if has_direct:
            direct_witnessed.append(finding_id)
            continue
        if finding_id in canonical_archive:
            archived_only.append(finding_id)
            continue
        problems.append(
            f'ORPHAN-CLAIM: open bug {finding_id} has no explicit evidence ID, '
            'existing evidence path, immutable verified-* witness, or archived evidence'
        )

    for finding_id in sorted(reverify_ids):
        if (
            finding_id in matrix_rows
            or finding_id in aliases
            or finding_id in ignored_tokens
        ):
            continue
        problems.append(
            f'UNREGISTERED-EVIDENCE: reverify explicitly registers {finding_id} '
            'but matrix/alias registry does not'
        )

    for row in closed_rows:
        ref = (
            row.cells[-1].strip('`').split()[0].strip('`')
            if row.cells[-1]
            else ''
        )
        if ref and not SHA_RE.fullmatch(ref) and ref not in NON_SHA_OK:
            problems.append(
                f'BAD-COMMIT-REF: closed bug {row.finding_id} ref {ref!r} '
                'is not a short SHA or approved immutable marker'
            )

    summary = {
        'matrixIds': len(matrix_rows),
        'openRows': len(open_ids),
        'evidenceFiles': len(evidence),
        'aliasIds': len(aliases),
        'ignoredTokens': len(ignored_tokens),
        'directWitnessedOpenRows': len(direct_witnessed),
        'archivedOnlyOpenRows': len(archived_only),
        'problems': len(problems),
        'problemKinds': dict(
            collections.Counter(item.split(':', 1)[0] for item in problems)
        ),
        'directWitnessedIds': direct_witnessed,
        'archivedOnlyIds': archived_only,
        'diagnostics': problems,
    }

    print(
        'matrix: {matrixIds} canonical ids, {openRows} open rows; '
        'evidence files: {evidenceFiles}; aliases: {aliasIds}; '
        'direct witnesses: {directWitnessedOpenRows}; archived-only: '
        '{archivedOnlyOpenRows}'.format(**summary)
    )
    if args.verbose:
        if direct_witnessed:
            print('direct-witnessed:', ', '.join(direct_witnessed))
        if archived_only:
            print('archived-only:', ', '.join(archived_only))

    if args.json_out:
        output = pathlib.Path(args.json_out)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(
            json.dumps(summary, ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8',
        )

    if problems:
        print(f'\n{len(problems)} problem(s):')
        for problem in problems:
            print('  -', problem)
        return 0 if args.warn_only else 1

    print('OK: matrix coverage checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
