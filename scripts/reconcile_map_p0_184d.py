#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
WRITE = "--write" in __import__("sys").argv

text = MATRIX.read_text(encoding="utf-8")

old_source = "| Source HEAD | `5636a6a1911c7eb0e7637406e87e749dd65dbaaf` (current source main; map recovery #203 and control-plane #204/#205 layered on homepage, Gill, Reader R6 and all-route Android/WebKit work) |"
new_source = "| Source HEAD | `184d7ed1b50161ec5fa1418ca24539e33977e2a8` (current source main; complete map P0 closure through #218/#224 plus archaeology registry foundation #226, layered on the preserved homepage, Gill, Reader R6 and all-route browser chain) |"
old_reverify = "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_5636a6a1_map-p0-control-plane.md` |"
new_reverify = "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_184d7ed1_map-p0-closure.md` |"
old_authority = "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `5636a6a1`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_5636a6a1_map-p0-control-plane.md`."
new_authority = "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `184d7ed1`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_184d7ed1_map-p0-closure.md`."
old_closed = "## ✅ ЗАКРЫТО (146)"
new_closed = "## ✅ ЗАКРЫТО (148)"
anchor = "| ASTRO-P0-06 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** Ishod and Avraam now expose readable no-JS and runtime fallbacks instead of an opaque black scene when JavaScript is disabled, `route.json` returns 503, the engine asset fails, initialization throws or returns null. Permanent `engine:sweep` covers eight normal/failure scenarios. | `0461faa8` PR#203 |"
closed_rows = """| MAP-P0-01 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #218 constrains shared MapEngine detail panels to the mobile safe-area/viewport and bounds the desktop floating panel; header, tabs and navigation remain fixed while only `.me-content` scrolls with `min-height:0`. Exact head `39569068`: Chromium/WebKit 320×568 and 390×844 contract covers every Ishod marker and real Maccabim data, forced 1500px content and live viewport-height reduction; Shared `30108888569`, Overlay `30108888784` and Visual `30108888609` succeeded. | `d57d49b8` PR#218 |
| DATA-P0-01 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #224 upgrades shared MapEngine to v0.55 and makes valid author-authored `stages[].paths` authoritative: all 15 Avraam cubic Bézier paths preserve exact `d`, order, semantic color, dash state, underlay, arrow, layer membership and stage label; malformed geometry fails closed to generated `M/L`. Exact head `be2b707c`: seven map jobs `30113097520`, Shared `30113097647`, three-engine Overlay `30113097467` and Visual `30113097686` succeeded. | `c27176bf` PR#224 |"""
old_open_heading = "## 🔴 P0/P1 — ОТКРЫТО (2) — release / deploy + karty runtime"
new_open_heading = "## ✅ P0/P1 — ОТКРЫТО (0)"
open_row_1 = "| MAP-P0-01 | 🆕 **Karty P0:** Мобильная панель `.me-panel` уходит выше viewport до -581px (Маккавеи), -212px (Исход); заголовок, крестик и tabs недоступны | verified-browser (c2c339708252) |"
open_row_2 = "| DATA-P0-01 | 🆕 **Karty P0:** MapEngine полностью игнорирует все 15 авторских криволинейных SVG-маршрутов `stages[].paths` в `avraam/route.json`, рисуя прямые `L`-отрезки | verified-source (32ae0d7d) |"

installed = all(token in text for token in [new_source, new_reverify, new_authority, new_closed, closed_rows, new_open_heading]) and open_row_1 not in text and open_row_2 not in text
if installed:
    print("PASS map P0 reconciliation already materialized")
    raise SystemExit(0)

replacements = [
    (old_source, new_source, "source authority"),
    (old_reverify, new_reverify, "last reverify"),
    (old_authority, new_authority, "authority note"),
    (old_closed, new_closed, "closed counter"),
    (old_open_heading, new_open_heading, "open P0/P1 counter"),
]
for old, new, label in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one old anchor, found {count}")
    text = text.replace(old, new, 1)

if text.count(anchor) != 1:
    raise SystemExit(f"closed-row anchor: expected exactly one, found {text.count(anchor)}")
if closed_rows in text:
    raise SystemExit("closed rows already present before insertion")
text = text.replace(anchor, anchor + "\n" + closed_rows, 1)

for row, label in [(open_row_1, "MAP-P0-01 open row"), (open_row_2, "DATA-P0-01 open row")]:
    count = text.count(row)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one, found {count}")
    text = text.replace(row + "\n", "", 1)

required = [new_source, new_reverify, new_authority, new_closed, closed_rows, new_open_heading]
for token in required:
    if token not in text:
        raise SystemExit(f"postcondition missing: {token[:80]}")
for stale in [old_source, old_reverify, old_authority, old_closed, old_open_heading, open_row_1, open_row_2]:
    if stale in text:
        raise SystemExit(f"stale anchor remains: {stale[:80]}")

text = text.rstrip("\n") + "\n"
if WRITE:
    MATRIX.write_text(text, encoding="utf-8")
    print("UPDATED MASTER_BUG_MATRIX.md: source 184d7ed1, closed 148, open P0/P1 0")
else:
    print("PASS guarded map P0 reconciliation anchors")
