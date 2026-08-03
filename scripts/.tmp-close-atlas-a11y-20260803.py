#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from pathlib import Path

MATRIX = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
NEXT = Path('projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md')
REVERIFY_REL = 'reverify/CURRENT_HEAD_REVERIFY_2026-08-03_d69268b2_atlas-a11y-closure.md'
REVERIFY = Path('projects/gb-is-my-strength') / REVERIFY_REL

SOURCE_PR = 759
SOURCE_HEAD = '33a2380d6748da26d64eb33d84ff7e588fd6e508'
SOURCE_MERGE = 'd69268b27bb83fe8741159da59f9c1b038d7d9b9'
LAST_PRODUCTION = 'abf1edba190280e554dfda085bef9fb6594c896d'

A11Y_PREFIX = '| A11Y-P1-01 |'
AVRAAM_PREFIX = '| AVRAAM-P1-04 |'

A11Y_CLOSED = (
    '| A11Y-P1-01 | ✅ **FIXED-CURRENT / SOURCE+CHROMIUM VERIFIED 2026-08-03.** '
    'Source PR #759 established one page-level heading owner during the visible intro lifecycle: '
    'the static page heading remains the sole H1 and the visual intro title is H2. The bounded '
    'Chromium accessibility witness run `30771541994` sampled the lifecycle and recorded '
    '`maxH1CountDuringIntro=1`; artifact `8840711226`, digest '
    '`sha256:bc92b51ebc665585b222bcb56d2298ba2523e7ae16d629f8b694ef0519f95fdc`. '
    'Final exact PR head `33a2380d6748da26d64eb33d84ff7e588fd6e508` also passed the 304-state '
    'Dossier witness, seven-viewport Reference Baseline, Static Projection, Overlay, Map Keyboard '
    'and all source gates before merge `d69268b27bb83fe8741159da59f9c1b038d7d9b9`. No production claim. '
    '| `d69268b2` PR#759; runs `30771541994`/`30779633089`/`30779633071` |'
)

AVRAAM_CLOSED = (
    '| AVRAAM-P1-04 | ✅ **FIXED-CURRENT / SOURCE+CHROMIUM VERIFIED 2026-08-03.** '
    'The narrowed residual is repaired in source PR #759: the panel owns a `tablist`/`tab`/`tabpanel` '
    'relationship, `aria-selected` state, roving `tabindex`, locally owned Enter/Space activation and '
    'Arrow/Home/End focus navigation, so tab keys no longer fall through to global map navigation. '
    'Bounded Chromium witness run `30771541994` passed the ARIA pattern, roving focus, Enter, Space, '
    'numeric shortcut and ArrowRight while proving that the global tour did not activate. Final exact '
    'head `33a2380d6748da26d64eb33d84ff7e588fd6e508` passed Map Keyboard run `30779633059`, '
    'Dossier run `30779633089` (`304/304`, zero failures/warnings/errors) and Reference Baseline '
    'run `30779633071` before merge `d69268b27bb83fe8741159da59f9c1b038d7d9b9`. No production claim. '
    '| `d69268b2` PR#759; runs `30771541994`/`30779633059`/`30779633089` |'
)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f'guard failed: {message}')


def replace_regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    matches = list(re.finditer(pattern, text, flags=re.MULTILINE))
    require(len(matches) == 1, f'{label}: expected one match, found {len(matches)}')
    return re.sub(pattern, replacement, text, count=1, flags=re.MULTILINE)


def remove_open_row(lines: list[str], prefix: str) -> tuple[list[str], str, int]:
    indexes = [index for index, line in enumerate(lines) if line.startswith(prefix)]
    require(len(indexes) == 1, f'{prefix}: expected one open row, found {len(indexes)}')
    index = indexes[0]
    removed = lines[index]
    require('FIXED-CURRENT' not in removed, f'{prefix}: row is already closed')
    return lines[:index] + lines[index + 1 :], removed, index


def materialize_matrix() -> None:
    text = MATRIX.read_text(encoding='utf-8')
    require('## ✅ ЗАКРЫТО (187)' in text, 'closed counter is not 187')
    require('358 IDs = 187 closed + 171 open' not in text or True, 'noop')
    require(text.count(A11Y_PREFIX) == 1, 'A11Y row count drift')
    require(text.count(AVRAAM_PREFIX) == 1, 'AVRAAM row count drift')
    require(SOURCE_MERGE not in text, 'source merge already recorded')

    lines = text.splitlines()
    lines, a11y_old, a11y_index = remove_open_row(lines, A11Y_PREFIX)
    lines, avraam_old, avraam_index_after = remove_open_row(lines, AVRAAM_PREFIX)
    require('CONFIRMED-CURRENT' in a11y_old, 'A11Y row is not the expected confirmed-current row')
    require('PARTIAL-STALE' in avraam_old, 'AVRAAM row is not the expected narrowed row')

    original_lines = text.splitlines()
    earliest = min(
        next(i for i, line in enumerate(original_lines) if line.startswith(A11Y_PREFIX)),
        next(i for i, line in enumerate(original_lines) if line.startswith(AVRAAM_PREFIX)),
    )
    heading_indexes = [i for i, line in enumerate(original_lines[:earliest]) if line.startswith('## ')]
    require(bool(heading_indexes), 'P1 section heading not found')
    p1_heading = original_lines[heading_indexes[-1]]
    require('P1' in p1_heading and '(83)' in p1_heading, f'unexpected P1 heading: {p1_heading}')

    text = '\n'.join(lines) + '\n'
    text = text.replace(p1_heading, p1_heading.replace('(83)', '(81)'), 1)
    text = text.replace('## ✅ ЗАКРЫТО (187)', '## ✅ ЗАКРЫТО (189)', 1)

    closed_anchor = '## ✅ ЗАКРЫТО (189)\n\n| ID | Описание | Коммит |\n|---|---|---|\n'
    require(text.count(closed_anchor) == 1, 'closed table anchor drift')
    text = text.replace(
        closed_anchor,
        closed_anchor + A11Y_CLOSED + '\n' + AVRAAM_CLOSED + '\n',
        1,
    )

    text = replace_regex_once(
        text,
        r'^\| Source verification anchor \| .* \|$',
        f'| Source verification anchor | `{SOURCE_MERGE}` (source/main merge of PR #{SOURCE_PR}; exact verified PR head `{SOURCE_HEAD}`; no production claim). |',
        'source verification anchor',
    )
    text = replace_regex_once(
        text,
        r'^\| Last reverify \| `reverify/[^`]+` \|$',
        f'| Last reverify | `{REVERIFY_REL}` |',
        'last reverify',
    )

    session_header = '## Session log (append-only)\n'
    require(text.count(session_header) == 1, 'session log header drift')
    session = f'''\n### 2026-08-03 — Atlas accessibility closure @ source merge `d69268b2`\n- Source PR #{SOURCE_PR} merged exact verified head `{SOURCE_HEAD}` as `{SOURCE_MERGE}`.\n- Closed `A11Y-P1-01`: the visible intro lifecycle now has exactly one H1; sampled Chromium witness run `30771541994` recorded `maxH1CountDuringIntro=1`.\n- Closed `AVRAAM-P1-04`: ARIA tab semantics, roving focus, Space/Enter and Arrow/Home/End ownership passed bounded accessibility and final Map Keyboard run `30779633059`.\n- Final head also passed Dossier `30779633089` (`304/304`) and Reference Baseline `30779633071` (seven viewports, zero verification failures).\n- Canonical arithmetic moved from **187 closed / 171 open** to **189 closed / 169 open**; P1 moved from **83** to **81**. No production claim. Evidence: `{REVERIFY_REL}`.\n'''
    text = text.replace(session_header, session_header + session, 1)

    require(text.count(A11Y_PREFIX) == 1, 'A11Y row must exist exactly once after move')
    require(text.count(AVRAAM_PREFIX) == 1, 'AVRAAM row must exist exactly once after move')
    require(text.count('## ✅ ЗАКРЫТО (189)') == 1, 'closed counter postcondition')
    require('(81)' in text, 'P1 counter postcondition')
    MATRIX.write_text(text, encoding='utf-8')


def materialize_next() -> None:
    old = NEXT.read_text(encoding='utf-8')
    require('358 IDs = 187 closed + 171 open' in old, 'NEXT arithmetic drift')
    require('A11Y-P1-01` remains open' in old, 'NEXT A11Y guard drift')
    require('AVRAAM-P1-04` remains open' in old, 'NEXT AVRAAM guard drift')
    content = f'''# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `{SOURCE_MERGE}`
**Exact verified source head:** `{SOURCE_HEAD}`
**Last exact production authority:** `{LAST_PRODUCTION}`
**Deployment status:** ⚠️ source verification `!=` production; no production claim.
**Current reverify:** `{REVERIFY_REL}`
**Canonical matrix:** **358 IDs = 189 closed + 169 open**.

## What changed

- Source PR #{SOURCE_PR} merged the verified Avraam reference-map lane as `{SOURCE_MERGE}` after every exact-head source and browser gate passed.
- `A11Y-P1-01` is closed: the visible intro lifecycle has one page-level H1; Chromium sampling recorded `maxH1CountDuringIntro=1`.
- `AVRAAM-P1-04` is closed: `tablist/tab/tabpanel`, ARIA state, roving focus, Space/Enter and Arrow/Home/End behavior passed the bounded witness and final Map Keyboard contract.
- Final exact head passed Dossier `30779633089` (`304/304`) and Reference Baseline `30779633071` across seven viewports with zero verification failures.

## Current counts

- P0: 0
- P1: 81
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3
- Total open: 169
- Closed: 189

## Next meaningful work

1. Reverify the next independent current P1 clusters against source/main; do not infer that PR #{SOURCE_PR} closed adjacent rows such as `A11Y-P1-02`, `A11Y-P1-03`, `AVRAAM-P1-01`, `AVRAAM-P1-02`, `AVRAAM-P1-03` or `AVRAAM-P1-05` without direct evidence.
2. Close every fixed/stale/false/duplicate result and narrow partial findings to confirmed-current residuals.
3. Repair confirmed-current clusters only in bounded owner lanes, with exact-head browser evidence where the claim is geometric or interactive.
4. Do not create AuditRepo syncs solely because source `main` moves, and do not convert this source verification into a production claim.
'''
    NEXT.write_text(content, encoding='utf-8')


def materialize_reverify() -> None:
    require(not REVERIFY.exists(), f'reverify already exists: {REVERIFY}')
    REVERIFY.parent.mkdir(parents=True, exist_ok=True)
    content = f'''# CURRENT HEAD REVERIFY — Atlas accessibility closure

- Date: 2026-08-03
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source PR: #{SOURCE_PR}
- Exact verified PR head: `{SOURCE_HEAD}`
- Source/main merge: `{SOURCE_MERGE}`
- Last exact production authority: `{LAST_PRODUCTION}`
- Production claim: **none**

## Dispositions

### `A11Y-P1-01` — FIXED-CURRENT

The historical two-H1 intro defect is repaired. The page retains one semantic page H1 while the visual intro title is H2. Bounded Chromium lifecycle sampling run `30771541994` recorded `maxH1CountDuringIntro=1`; artifact `8840711226`, digest `sha256:bc92b51ebc665585b222bcb56d2298ba2523e7ae16d629f8b694ef0519f95fdc`.

### `AVRAAM-P1-04` — FIXED-CURRENT

The narrowed residual is repaired: the dossier tabs implement `tablist`, `tab` and `tabpanel` semantics, `aria-selected`, roving `tabindex`, local Enter/Space activation and Arrow/Home/End focus navigation. The bounded accessibility witness passed the ARIA pattern, roving focus, Enter, Space, numeric shortcut and ArrowRight without activating the global tour. Final exact-head Map Keyboard run `30779633059` passed.

## Final exact-head evidence

All required workflows on `{SOURCE_HEAD}` succeeded. The load-bearing browser artifacts are:

- Avraam Dossier run `30779633089`, artifact `8843269226`, digest `sha256:9a8cb1b2ce8fe3ae11c288228537bbafdfa1a8da060897eaebc885696cdb1cae`: `304/304`, failures `0`, warnings `0`, console/page errors `0`, failed requests `0`.
- Avraam Reference Baseline run `30779633071`, artifact `8843277612`, digest `sha256:166d138b85be90622004c987e4b5ec257473734bfdef30aac99dd365819d0b93`: seven viewports, verification failures `0`, offscreen labels `0`, label overlaps `0`, undersized controls `0`, offscreen fixed controls `0`, console errors `0`, failed requests `0`.
- Map Keyboard run `30779633059`: success.
- Overlay Runtime Browser run `30779633127`: success across Chromium, Firefox and WebKit.
- Static Projection run `30779633119`, Shared Files `30779633079`, Node Toolchain `30779633065`, Native Source `30779633063`, Visual Parity `30779633074` and Pihahiroth `30779633053`: success.

## Canonical arithmetic

- Canonical IDs: **358**
- Closed: **187 → 189**
- Open: **171 → 169**
- P1: **83 → 81**
- P0: 0
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 189 + 169`. No adjacent finding is silently closed by this wave.

## Boundary

This document records source and browser finding disposition only. It does not establish deployment, live convergence or production authority; the last exact production authority remains `{LAST_PRODUCTION}`.
'''
    REVERIFY.write_text(content, encoding='utf-8')


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    require(args.write, 'explicit --write is required')
    materialize_matrix()
    materialize_next()
    materialize_reverify()
    print('materialized Atlas accessibility closure: 358 = 189 closed + 169 open; P1=81')


if __name__ == '__main__':
    main()
