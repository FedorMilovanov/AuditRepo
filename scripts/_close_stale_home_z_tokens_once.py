#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
REVERIFY_REL = "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_b251c4b9_home-z-token-stale-closure.md"
REVERIFY = PROJECT / REVERIFY_REL
SOURCE = "b251c4b99265a9915881048c5fbde61f810d8c96"
PRODUCTION = "abf1edba190280e554dfda085bef9fb6594c896d"
TARGET_ID = "AR-IDX-CSS-01"

matrix = MATRIX.read_text(encoding="utf-8")
lines = matrix.splitlines()

matches = [i for i, line in enumerate(lines) if line.startswith(f"| {TARGET_ID} |")]
if len(matches) != 1:
    raise SystemExit(f"expected exactly one {TARGET_ID} row, found {len(matches)}")
row_index = matches[0]

p1_heading = next(i for i, line in enumerate(lines) if line.startswith("## 🟠 P1 — ОТКРЫТО"))
p2_heading = next(i for i, line in enumerate(lines) if line.startswith("## 🟡 P2 — ОТКРЫТО"))
if not (p1_heading < row_index < p2_heading):
    raise SystemExit(f"{TARGET_ID} is not physically inside P1-open section")

old_row = lines.pop(row_index)
if "18 `--z-*` CSS variables" not in old_row or "НЕ ОПРЕДЕЛЕНЫ" not in old_row:
    raise SystemExit("target row no longer matches the stale absence claim")

closed_heading = lines.index("## ✅ ЗАКРЫТО (184)")
header_index = closed_heading + 3
if lines[closed_heading + 1] != "" or not lines[closed_heading + 2].startswith("| ID |"):
    raise SystemExit("closed section shape changed")
closed_row = (
    f"| {TARGET_ID} | ✅ **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED 2026-08-02.** "
    "The historical root-cause claim is obsolete: `css/site.css` now defines the shared z-index scale in `:root`, including "
    "`--z-elevated`, `--z-dropdown-high`, `--z-sticky`, `--z-bottom-bar`, `--z-tooltip-low` and `--z-toast-high`, while "
    "`css/home.css` consumes those tokens. The original inference that Home fixed/sticky layers fall back to `z-index:auto` because the tokens are absent is therefore not reproducible. This disposition does not claim that every independent stacking interaction is perfect; it closes only this canonical missing-token claim. Exact source anchor `b251c4b99265a9915881048c5fbde61f810d8c96`; the intervening NoteRegistry merge did not touch either CSS owner. No production claim. | `b251c4b9` source reverify |"
)
lines.insert(header_index + 1, closed_row)

text = "\n".join(lines) + "\n"
replacements = {
    "## ✅ ЗАКРЫТО (184)": "## ✅ ЗАКРЫТО (185)",
    "## 🟠 P1 — ОТКРЫТО (85)": "## 🟠 P1 — ОТКРЫТО (84)",
    "| Закрыто (fixed) | 184 |": "| Закрыто (fixed) | 185 |",
    "| P1 открыто | 85 |": "| P1 открыто | 84 |",
    "| **Всего открыто (матрица)** | **174** |": "| **Всего открыто (матрица)** | **173** |",
    "358 canonical = 184 closed + 174 open": "358 canonical = 185 closed + 173 open",
}
for old, new in replacements.items():
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"expected one occurrence of {old!r}, found {count}")
    text = text.replace(old, new, 1)

status_lines = text.splitlines()
for i, line in enumerate(status_lines):
    if line.startswith("| Source verification anchor |"):
        status_lines[i] = f"| Source verification anchor | `{SOURCE}` (exact source reverify anchor for stale closure `{TARGET_ID}`; no production claim). |"
    elif line.startswith("| Last reverify |"):
        status_lines[i] = f"| Last reverify | `{REVERIFY_REL}` |"
    elif line.startswith("## Статистика (обновлено 2026-08-02:"):
        status_lines[i] = f"## Статистика (обновлено 2026-08-02: source `{SOURCE[:8]}`; last exact production `{PRODUCTION[:8]}`; 358 canonical = 185 closed + 173 open)"
text = "\n".join(status_lines) + "\n"

session_marker = "## Session log (append-only)\n"
if text.count(session_marker) != 1:
    raise SystemExit("session log marker missing or duplicated")
session = (
    "\n### 2026-08-02 — stale Home z-token closure @ `b251c4b9`\n"
    f"- Closed `{TARGET_ID}` as stale after exact source reverify: the shared z-index tokens are defined in `css/site.css` and consumed by `css/home.css`.\n"
    "- The NoteRegistry delta from `7e43efa1` to `b251c4b9` touched neither CSS owner.\n"
    "- Canonical arithmetic moved from **184 closed / 174 open** to **185 closed / 173 open**; P1 moved from **85** to **84**. No production claim.\n"
)
text = text.replace(session_marker, session_marker + session, 1)
MATRIX.write_text(text, encoding="utf-8")

NEXT.write_text(f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `{SOURCE}`
**Last exact production authority:** `{PRODUCTION}`
**Deployment status:** ⚠️ source verification `!=` production; no production claim.
**Current reverify:** `{REVERIFY_REL}`
**Canonical matrix:** **358 IDs = 185 closed + 173 open**.

## What changed

- Closure wave V1 closed 15 fixed/stale source-data findings.
- Source PR #755 removed dead Vosk `splitSentences`; its canonical row is closed.
- `{TARGET_ID}` is closed as stale: the Home z-index token scale is defined in `css/site.css` and consumed by `css/home.css` at exact source anchor `{SOURCE}`.
- Source PR #777 is independently widening `legacy-shadow-wrapper-audit.js` from a seven-route sample to the registry-derived committed-shadow surface; do not pre-close `SHADOW-AUDIT-NARROW` until that PR merges and its exact-head witness is green.

## Current counts

- P0: 0
- P1: 84
- P2: 34
- P3: 48
- Refactoring: 4
- AuditRepo: 3
- Total open: 173
- Closed: 185

## Next meaningful work

1. Finish PR #777 and close `SHADOW-AUDIT-NARROW` only after source merge and exact-head evidence.
2. Run the expanded exact-anchor browser/runtime wave, including `AVRAAM-P1-04`, `A11Y-P1-01` and `QUAL-P1-04`.
3. Close every fixed/stale/false/duplicate result; narrow partial findings; retain only confirmed-current residuals.
4. Respect active source PR ownership (#773 Home, #759 Atlas) and do not create AuditRepo sync solely because source `main` moved.
""", encoding="utf-8")

REVERIFY.write_text(f"""# CURRENT HEAD REVERIFY — stale Home z-token closure

**Date:** 2026-08-02  
**AuditRepo base:** `844f66cda807ff2e807e94e6bdf0e1c1c8d39407`  
**Exact source anchor:** `{SOURCE}`  
**Last exact production authority:** `{PRODUCTION}`  
**Canonical finding:** `{TARGET_ID}`  
**Production claim:** none

## Claim rechecked

The open row asserted that Home uses 18 `--z-*` variables without definitions, causing fixed/sticky layers to fall back to `z-index:auto`.

At exact source anchor `{SOURCE}`:

- `css/site.css` defines the shared z-index scale in `:root`, including `--z-elevated`, `--z-dropdown-high`, `--z-sticky`, `--z-bottom-bar`, `--z-tooltip-low` and `--z-toast-high`;
- `css/home.css` consumes those variables for the reading progress, navbar, mobile navigation and related Home controls;
- the single commit between `7e43efa1a691052314599a9ff96613126b5de099` and `{SOURCE}` is the NoteRegistry core and does not modify `css/site.css` or `css/home.css`.

## Disposition

`{TARGET_ID}` is **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED**. The missing-definition root cause is no longer present. This closure does not certify every unrelated stacking interaction and makes no production claim.

## Arithmetic

- canonical IDs: 358
- closed: 184 → 185
- open: 174 → 173
- P1: 85 → 84
- all other category counts unchanged
""", encoding="utf-8")

print("materialized stale Home z-token closure: 358 = 185 closed + 173 open")
