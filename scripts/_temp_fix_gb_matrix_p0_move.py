#!/usr/bin/env python3
from pathlib import Path
import re

path = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
text = path.read_text(encoding='utf-8')

fixed_rows = '''| MAP-P0-02 | ✅ **FIXED 2026-07-21.** Share использует scoped `getState()` внутри `createMap`; `ReferenceError` закрыт, guard проверяет связь с active place/story. | `1f80f12` PR#96 |
| MAP-P0-03 | ✅ **FIXED 2026-07-21.** Delayed search highlight пересчитывает story membership без out-of-scope `inStory`; очистка возвращает opacity `1/.15`. | `1f80f12` PR#96 |
| MAP-P0-08 | ✅ **FIXED 2026-07-21.** Zoom поддерживает обычный click, Enter/Space, programmatic click и press-and-hold без double-fire. | `1f80f12` PR#96 |
| ASTRO-P0-01 | ✅ **FIXED 2026-07-21.** Stage grouping больше не вызывает `.push()` на undefined bucket; production-like/full publication gates green. | `1f80f12` PR#96 |
| ASTRO-P0-02 | ✅ **FIXED 2026-07-21.** Missing/non-integer/out-of-range `stage` отбрасывается до `stagePaths[p.stage].push()`. | `1f80f12` PR#96 |
'''

ids = ['MAP-P0-02', 'MAP-P0-03', 'MAP-P0-08', 'ASTRO-P0-01', 'ASTRO-P0-02']
for bug_id in ids:
    matches = re.findall(rf'^\| {re.escape(bug_id)} \|.*$', text, flags=re.M)
    if len(matches) != 1:
        raise SystemExit(f'{bug_id}: expected one current open row, found {len(matches)}')
    if '✅ **FIXED 2026-07-21.**' in matches[0]:
        raise SystemExit(f'{bug_id}: already fixed; correction must not run twice')
    text = re.sub(rf'^\| {re.escape(bug_id)} \|.*\n', '', text, count=1, flags=re.M)

anchor = '| ID | Описание | Коммит |\n|---|---|---|\n'
if text.count(anchor) != 1:
    raise SystemExit(f'fixed table anchor: expected one, found {text.count(anchor)}')
text = text.replace(anchor, anchor + fixed_rows, 1)

for bug_id in ids:
    matches = re.findall(rf'^\| {re.escape(bug_id)} \|.*$', text, flags=re.M)
    if len(matches) != 1 or '✅ **FIXED 2026-07-21.**' not in matches[0]:
        raise SystemExit(f'{bug_id}: fixed placement verification failed')

open_start = text.index('## 🔴 P0/P1')
open_end = text.index('## 🟠 P1', open_start)
open_block = text[open_start:open_end]
for bug_id in ids:
    if re.search(rf'^\| {re.escape(bug_id)} \|', open_block, flags=re.M):
        raise SystemExit(f'{bug_id}: still present in open P0 block')

path.write_text(text, encoding='utf-8')
print('P0 rows moved from OPEN to FIXED')
