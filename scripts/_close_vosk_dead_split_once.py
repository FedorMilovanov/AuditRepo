#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / 'projects' / 'gb-is-my-strength'
MATRIX = PROJECT / 'verified' / 'MASTER_BUG_MATRIX.md'
NEXT = PROJECT / 'NEXT_AGENT_PROMPT.md'
REVERIFY = PROJECT / 'reverify' / 'CURRENT_HEAD_REVERIFY_2026-08-02_aed8ed22_vosk-dead-split-closure.md'
SOURCE_MERGE = 'aed8ed2244ad566b0458e490f629d394122dbf95'
PRODUCTION = 'abf1edba190280e554dfda085bef9fb6594c896d'
TARGET_ID = 'NEW-VOSK-DEAD-SPLITSENTENCES'


def cells(line: str) -> list[str]:
    if not line.startswith('| ') or line.startswith('|---'):
        return []
    return [cell.strip() for cell in line.strip().strip('|').split('|')]


def once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected one occurrence, found {count}')
    return text.replace(old, new, 1)


def update_matrix() -> None:
    text = MATRIX.read_text(encoding='utf-8')
    lines = text.splitlines()
    section = ''
    target_index = None
    for index, line in enumerate(lines):
        if line.startswith('## '):
            section = line[3:].strip()
            continue
        row = cells(line)
        if row and row[0] == TARGET_ID:
            if target_index is not None:
                raise RuntimeError('duplicate target row')
            if 'P3' not in section or 'ОТКРЫТО' not in section:
                raise RuntimeError(f'target in unexpected section: {section}')
            target_index = index
    if target_index is None:
        raise RuntimeError('target row missing')
    del lines[target_index]

    closed_heading = next(i for i, line in enumerate(lines) if line.startswith('## ') and 'ЗАКРЫТО' in line)
    separator = next(i for i in range(closed_heading + 1, closed_heading + 12) if lines[i].startswith('|---'))
    closed_row = (
        '| NEW-VOSK-DEAD-SPLITSENTENCES | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** '
        'Source PR #755 removed the unused `splitSentences` definition and public export from '
        '`js/vosk-tts-core.js`; runtime chunking remains owned by `splitTtsChunks`, and a fail-closed '
        'scan found zero source call sites. Exact head `b348e22b79cf1a802b0d32098ed0a37de5d8e67b` '
        'passed Shared Files, Metadata, Deploy Candidate, Print, Visual Parity, Route Registry and '
        'Runtime Interactive workflows. Squash merge `aed8ed2244ad566b0458e490f629d394122dbf95`. '
        'Production is not claimed. | `aed8ed22` PR#755; runs `30756863997`/`30756863994`/'
        '`30756863993`/`30756863988`/`30756863991`/`30756864007`/`30756864014` |'
    )
    lines.insert(separator + 1, closed_row)
    text = '\n'.join(lines) + '\n'

    text = once(text, '## ✅ ЗАКРЫТО (183)', '## ✅ ЗАКРЫТО (184)', 'closed heading')
    text = once(text, '## 🟢 P3 — ОТКРЫТО (49)', '## 🟢 P3 — ОТКРЫТО (48)', 'P3 heading')
    text = once(text, '| Закрыто (fixed) | 183 |', '| Закрыто (fixed) | 184 |', 'closed stat')
    text = once(text, '| P3 открыто | 49 |', '| P3 открыто | 48 |', 'P3 stat')
    text = once(text, '| **Всего открыто (матрица)** | **175** |', '| **Всего открыто (матрица)** | **174** |', 'open stat')

    source_row = re.compile(r'^\| Source verification anchor \|.*\|$', re.MULTILINE)
    if len(source_row.findall(text)) != 1:
        raise RuntimeError('source row not unique')
    text = source_row.sub(
        '| Source verification anchor | `aed8ed2244ad566b0458e490f629d394122dbf95` '
        '(exact source+CI closure anchor for `NEW-VOSK-DEAD-SPLITSENTENCES`; no production claim). |',
        text,
        count=1,
    )
    reverify_row = re.compile(r'^\| Last reverify \|.*\|$', re.MULTILINE)
    text = reverify_row.sub(
        '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_aed8ed22_vosk-dead-split-closure.md` |',
        text,
        count=1,
    )
    marker = '## Session log (append-only)\n'
    if text.count(marker) != 1:
        raise RuntimeError('session marker not unique')
    session = (
        '\n### 2026-08-02 — Vosk dead split closure @ `aed8ed22`\n'
        '- Source PR #755 removed one dead function/export from `js/vosk-tts-core.js`; zero call sites remained.\n'
        '- Seven exact-head workflows passed; source squash merge `aed8ed2244ad566b0458e490f629d394122dbf95`.\n'
        '- Matrix moved to **184 closed / 174 open**; P3 moved **49 → 48**. No production claim.\n'
    )
    text = text.replace(marker, marker + session, 1)
    MATRIX.write_text(text, encoding='utf-8')


def write_next() -> None:
    NEXT.write_text(f'''# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `{SOURCE_MERGE}`
**Last exact production authority:** `{PRODUCTION}`
**Deployment status:** ⚠️ source verification `!=` production; no production claim.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_aed8ed22_vosk-dead-split-closure.md`
**Canonical matrix:** **358 IDs = 184 closed + 174 open**.

## What changed

- Closure wave V1 previously closed 15 fixed/stale source-data findings.
- Source PR #757 removed stale hardcoded route totals from sitemap/SEO contracts and restored registry-derived CI truth: 83 production / 74 indexable / 9 noindex.
- Source PR #755 removed dead Vosk `splitSentences` code and passed seven exact-head workflows; canonical `NEW-VOSK-DEAD-SPLITSENTENCES` is now closed.

## Current counts

- P0: 0
- P1: 85
- P2: 34
- P3: 48
- Refactoring: 4
- AuditRepo: 3
- Total open: 174
- Closed: 184

## Next meaningful work

1. Run the expanded exact-anchor browser/runtime wave for 23 rows, including `AVRAAM-P1-04`, `A11Y-P1-01` and `QUAL-P1-04`.
2. Close every fixed/stale/false/duplicate result; narrow partial findings; retain only confirmed-current residuals.
3. Repair confirmed clusters in bounded lanes: MapEngine runtime, base geography/rivers/SVG, Karty data/schema, sheet/atlas engine and SW/media.
4. Do not modify active source PR #680 or manually edit `migration/route-migration-matrix.json`.
5. Do not create AuditRepo sync solely because source `main` moved.
''', encoding='utf-8')


def write_reverify() -> None:
    if REVERIFY.exists():
        raise RuntimeError('reverify already exists')
    REVERIFY.write_text(f'''# Vosk dead split closure — 2026-08-02

**AuditRepo base:** `e781f897ef271ba47fef508f04a7cb065f51b8bb`  
**Source PR:** #755  
**Exact final source head:** `b348e22b79cf1a802b0d32098ed0a37de5d8e67b`  
**Source squash merge:** `{SOURCE_MERGE}`  
**Last exact production:** `{PRODUCTION}`  
**Production claim:** none

## Verified repair

The historical finding was reproducible before repair: `js/vosk-tts-core.js` defined and exported `splitSentences`, while runtime chunking was owned by `splitTtsChunks`. The bounded source diff removed only that dead definition and export (one file, 21 deletions). A fail-closed scan found zero source call sites; Node syntax, retained export contract and `validate:all` passed.

## Exact-head workflow evidence

- Shared Files Guard `30756863997` — success
- Metadata & IndexNow Readiness `30756863994` — success
- Deploy Candidate Contract `30756863993` — success
- Print Paper Contract `30756863988` — success
- Visual Parity Guard `30756863991` — success
- Route Registry Validators `30756864007` — success
- Runtime Interactive Audit `30756864014` — success

## Disposition and arithmetic

`NEW-VOSK-DEAD-SPLITSENTENCES` → **FIXED-CURRENT / SOURCE+CI VERIFIED**.

```text
canonical IDs: 358 -> 358
closed:        183 -> 184
open:          175 -> 174
P3:             49 -> 48
```

Later source movement does not change this disposition unless the removed symbol is reintroduced. Production remains separately evidenced and is not claimed here.
''', encoding='utf-8')


def validate() -> None:
    sys.path.insert(0, str(ROOT / 'scripts'))
    from matrix_coverage_lib import build_report  # type: ignore
    report = build_report(PROJECT)
    expected = {'matrixIds': 358, 'closedRows': 184, 'openRows': 174, 'problems': 0, 'archivedOnlyOpenRows': 0}
    for key, value in expected.items():
        if report.get(key) != value:
            raise RuntimeError(f'{key}: expected {value}, got {report.get(key)}')


def main() -> int:
    update_matrix()
    write_next()
    write_reverify()
    validate()
    print('Vosk closure staged: 358 = 184 closed + 174 open')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
