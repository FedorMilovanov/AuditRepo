from pathlib import Path
import re

path = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
text = path.read_text(encoding='utf-8')

closed_anchor = "## ✅ ЗАКРЫТО (141)\n\n| ID | Описание | Коммит |\n|---|---|---|\n"
if text.count(closed_anchor) != 1:
    raise SystemExit(f'closed table anchor count={text.count(closed_anchor)}')

closed_rows = (
    "| MAP-P1-16 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #173 isolates `input`, `textarea`, `select`, active `contenteditable`, `role=textbox`, IME composition and Alt/Ctrl/Meta chords before any global MapEngine shortcut; Escape remains the canonical overlay close command. Exact final head `64e36c82`: Map Keyboard Contract `30049773607`, Shared Files Guard `30049773605`, Chromium/Firefox/WebKit Overlay Runtime Browser `30049773623` and Visual Parity `30049773601` all succeeded. Exact smoke artifact `8580550637` records `ishod` routes 4/4, signature/story/scientific/keyboard `ok`, 1366px map width, zero overflow and zero console errors. | `bd537dc1` PR#173 |\n"
    "| MAP-P1-17 | ✅ **FIXED AS SAME ROOT 2026-07-24.** Number keys now query visible `.me-tab[data-tab]` nodes in actual DOM order and invoke the canonical `.click()` handler, so `sci` cannot be skipped by a duplicate `TAB_KEYS.filter` policy. Permanent source regression blocks direct `renderTabContent`, hardcoded tab availability and reclassification of bespoke legacy `avraam` as shared MapEngine; `ishod` is the canonical live engine fixture. | `bd537dc1` PR#173 |\n"
)

for canonical_id in ('MAP-P1-16', 'MAP-P1-17'):
    open_pattern = rf"^\| {canonical_id} \| 🆕 \*\*Karty P1:\*\*.*\n"
    text, count = re.subn(open_pattern, '', text, count=1, flags=re.M)
    if count != 1:
        raise SystemExit(f'{canonical_id}: expected one explicit open row, removed {count}')

text = text.replace(closed_anchor, closed_anchor + closed_rows, 1)

for canonical_id in ('MAP-P1-16', 'MAP-P1-17'):
    matching = [line for line in text.splitlines() if line.startswith(f'| {canonical_id} |')]
    if len(matching) != 1:
        raise SystemExit(f'{canonical_id}: expected exactly one canonical row, found {len(matching)}')
    if '✅ **FIXED' not in matching[0]:
        raise SystemExit(f'{canonical_id}: canonical row is not closed')
    if '🆕 **Karty P1:**' in matching[0]:
        raise SystemExit(f'{canonical_id}: stale open marker remains')

if '## 🟠 P1 — ОТКРЫТО (96)' not in text:
    raise SystemExit('P1 heading drifted')
if '| Закрыто (fixed) | 141 |' not in text:
    raise SystemExit('closed statistic drifted')
if '| **Всего открыто (матрица)** | **194** |' not in text:
    raise SystemExit('total-open statistic drifted')

path.write_text(text, encoding='utf-8')
