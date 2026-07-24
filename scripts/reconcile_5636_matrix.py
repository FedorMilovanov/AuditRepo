from pathlib import Path

path = Path('projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md')
text = path.read_text(encoding='utf-8')

replacements = {
    '| Source HEAD | `c8b47201f5b7210d69809c38808bfbda15695dcd` (current source main; ReaderState R6 #191 and all-route Android/WebKit #200 layered on current INDEX, Gill and Nagornaya work) |':
    '| Source HEAD | `5636a6a1911c7eb0e7637406e87e749dd65dbaaf` (current source main; map recovery #203 and control-plane #204/#205 layered on homepage, Gill, Reader R6 and all-route Android/WebKit work) |',
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_c8b47201_reader-r6-matrix-closure.md` |':
    '| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_5636a6a1_map-p0-control-plane.md` |',
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `c8b47201`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_c8b47201_reader-r6-matrix-closure.md`.':
    '⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `5636a6a1`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_5636a6a1_map-p0-control-plane.md`.'
}

for old, new in replacements.items():
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'guard failed: expected exactly one occurrence, found {count}: {old[:120]}')
    text = text.replace(old, new, 1)

closed_old = '''## ✅ ЗАКРЫТО (144)

| ID | Описание | Коммит |
|---|---|---|
'''
closed_new = '''## ✅ ЗАКРЫТО (146)

| ID | Описание | Коммит |
|---|---|---|
| ASTRO-P0-05 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #203 replaces console-only MapEngine initialization failures with a route-owned accessible recovery surface: `.me-error[role="alert"]`, synchronized `data-map-state`/`aria-busy`, safe text rendering, retry and return controls ≥44 px. Exact head `1338f71f` passed Shared, Native Source, Route Registry Chromium/WebKit, Overlay, Glossary and Visual Parity. | `0461faa8` PR#203 |
| ASTRO-P0-06 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** Ishod and Avraam now expose readable no-JS and runtime fallbacks instead of an opaque black scene when JavaScript is disabled, `route.json` returns 503, the engine asset fails, initialization throws or returns null. Permanent `engine:sweep` covers eight normal/failure scenarios. | `0461faa8` PR#203 |
'''
if text.count(closed_old) != 1:
    raise SystemExit(f'guard failed: closed-table anchor count={text.count(closed_old)}')
text = text.replace(closed_old, closed_new, 1)

open_old = '''## 🔴 P0/P1 — ОТКРЫТО (4) — release / deploy + karty runtime

| ID | Описание | Witnesses |
|---|---|---|
| MAP-P0-01 | 🆕 **Karty P0:** Мобильная панель `.me-panel` уходит выше viewport до -581px (Маккавеи), -212px (Исход); заголовок, крестик и tabs недоступны | verified-browser (c2c339708252) |
| ASTRO-P0-05 | 🆕 **Karty P0:** Исключение инициализации MapEngine перехватывается только в console; пользователь видит рабочий, но пустой чёрный экран без `.me-error` | verified-browser (c2c339708252) |
| ASTRO-P0-06 | 🆕 **Karty P0:** Выключение JavaScript или сбой загрузки `route.json` блокирует экран сплошным `#070a10` поверх `<noscript>` и sr-only контента | verified-browser (c2c339708252) |
| DATA-P0-01 | 🆕 **Karty P0:** MapEngine полностью игнорирует все 15 авторских криволинейных SVG-маршрутов `stages[].paths` in `avraam/route.json`, рисуя прямые `L`-отрезки | verified-source (32ae0d7d) |
'''
open_new = '''## 🔴 P0/P1 — ОТКРЫТО (2) — release / deploy + karty runtime

| ID | Описание | Witnesses |
|---|---|---|
| MAP-P0-01 | 🆕 **Karty P0:** Мобильная панель `.me-panel` уходит выше viewport до -581px (Маккавеи), -212px (Исход); заголовок, крестик и tabs недоступны | verified-browser (c2c339708252) |
| DATA-P0-01 | 🆕 **Karty P0:** MapEngine полностью игнорирует все 15 авторских криволинейных SVG-маршрутов `stages[].paths` in `avraam/route.json`, рисуя прямые `L`-отрезки | verified-source (32ae0d7d) |
'''
if text.count(open_old) != 1:
    raise SystemExit(f'guard failed: open-P0 block count={text.count(open_old)}')
text = text.replace(open_old, open_new, 1)

marker = '### 2026-07-24 — map failure recovery and control-plane closure (`5636a6a1`)'
if marker in text:
    raise SystemExit('guard failed: session marker already exists')

session = '''

### 2026-07-24 — map failure recovery and control-plane closure (`5636a6a1`)

- Source advanced through map recovery PR #203 (`0461faa8`), control-plane integrity PR #204 (`f11749ee`) and warning-convergence PR #205 (`5636a6a1`).
- PR #203 permanently covers Ishod/Avraam normal, no-JS, `route.json` 503 and engine-asset failure scenarios; `ASTRO-P0-05` and `ASTRO-P0-06` move to source+CI verified closed status.
- PR #204 removed the settled write-capable Gill temporary workflow and added filesystem-derived local-reference/control-plane auditing plus a checksum-verified actionlint runner.
- PR #205 removed deleted editorial branch triggers and migrated Bible, Glossary and TTS workflow linting to the shared runner. Exact artifact: 19 workflows, 151 npm scripts, 452 references, 0 hard issues and 3 bounded warnings.
- Current source has no open PRs. Reader R6 issue #127, Nagornaya umbrella #117 and stale aggregate CI alerts #12/#17 were closed after source verification.
- Production authority intentionally remains `8a535267`; exact readiness → Pages → live evidence for `5636a6a1` has not been established.
'''

path.write_text(text.rstrip() + session.rstrip() + '\n', encoding='utf-8')
