#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
REVERIFY_REL = "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_d23546ce_shadow-audit-coverage-closure.md"
REVERIFY = PROJECT / REVERIFY_REL
SOURCE_MERGE = "d23546ce177c23c14aa82de511b2b1fc7a1f8bd3"
SOURCE_HEAD = "019cbf2f56d9107883f390b169f92b2f70af0ae8"
WITNESS_HEAD = "202b4e9a8fad64c6defa00ae1aa78349c0918ede"
PRODUCTION = "abf1edba190280e554dfda085bef9fb6594c896d"
TARGET_ID = "SHADOW-AUDIT-NARROW"

matrix = MATRIX.read_text(encoding="utf-8")
lines = matrix.splitlines()

matches = [i for i, line in enumerate(lines) if line.startswith(f"| {TARGET_ID} |")]
if len(matches) != 1:
    raise SystemExit(f"expected exactly one {TARGET_ID} row, found {len(matches)}")
row_index = matches[0]

p3_heading = next(i for i, line in enumerate(lines) if line.startswith("## 🟢 P3 — ОТКРЫТО"))
refactor_heading = next(i for i, line in enumerate(lines) if line.startswith("## 🔧 РЕФАКТОРИНГ"))
if not (p3_heading < row_index < refactor_heading):
    raise SystemExit(f"{TARGET_ID} is not physically inside P3-open section")

old_row = lines.pop(row_index)
if "только 7/52" not in old_row or "13%" not in old_row:
    raise SystemExit("target row no longer matches the narrow seven-route claim")

closed_heading = lines.index("## ✅ ЗАКРЫТО (185)")
header_index = closed_heading + 3
if lines[closed_heading + 1] != "" or not lines[closed_heading + 2].startswith("| ID |"):
    raise SystemExit("closed section shape changed")
closed_row = (
    f"| {TARGET_ID} | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** "
    "Source PR #780 replaced the manually maintained seven-route sample in `scripts/legacy-shadow-wrapper-audit.js` with an ownership-registry-derived set: every route with `owner=astro`, `status=production-dist` and a committed root HTML shadow becomes an obligation. The audit now fails on malformed ownership data, empty discovery, duplicate shadow files and stale overrides, and checks canonical ownership, required title/description/H1, committed-shadow indexability disposition, route-specific structural markers and retained reader-text ratio. Exact witness head `202b4e9a8fad64c6defa00ae1aa78349c0918ede` discovered and passed **52 routes** in production-like build run `30766785459`; the same permanent script blob was retained on clean head `019cbf2f56d9107883f390b169f92b2f70af0ae8`, which passed Metadata `30766961604` and Shared Files Guard `30766961603`. Squash merge `d23546ce177c23c14aa82de511b2b1fc7a1f8bd3`. No production claim. | `d23546ce` PR#780; runs `30766785459`/`30766785503`/`30766961604`/`30766961603` |"
)
lines.insert(header_index + 1, closed_row)

text = "\n".join(lines) + "\n"
replacements = {
    "## ✅ ЗАКРЫТО (185)": "## ✅ ЗАКРЫТО (186)",
    "## 🟢 P3 — ОТКРЫТО (48)": "## 🟢 P3 — ОТКРЫТО (47)",
    "| Закрыто (fixed) | 185 |": "| Закрыто (fixed) | 186 |",
    "| P3 открыто | 48 |": "| P3 открыто | 47 |",
    "| **Всего открыто (матрица)** | **173** |": "| **Всего открыто (матрица)** | **172** |",
}
for old, new in replacements.items():
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"expected one occurrence of {old!r}, found {count}")
    text = text.replace(old, new, 1)

status_lines = text.splitlines()
source_anchor_updates = 0
last_reverify_updates = 0
stats_updates = 0
for i, line in enumerate(status_lines):
    if line.startswith("| Source verification anchor |"):
        status_lines[i] = f"| Source verification anchor | `{SOURCE_MERGE}` (source merge closing `{TARGET_ID}`; no production claim). |"
        source_anchor_updates += 1
    elif line.startswith("| Last reverify |"):
        status_lines[i] = f"| Last reverify | `{REVERIFY_REL}` |"
        last_reverify_updates += 1
    elif line.startswith("## Статистика (обновлено 2026-08-02:"):
        status_lines[i] = f"## Статистика (обновлено 2026-08-02: source `{SOURCE_MERGE[:8]}`; last exact production `{PRODUCTION[:8]}`; 358 canonical = 186 closed + 172 open)"
        stats_updates += 1
if (source_anchor_updates, last_reverify_updates, stats_updates) != (1, 1, 1):
    raise SystemExit(
        f"status update shape changed: source={source_anchor_updates}, reverify={last_reverify_updates}, stats={stats_updates}"
    )
text = "\n".join(status_lines) + "\n"

session_marker = "## Session log (append-only)\n"
if text.count(session_marker) != 1:
    raise SystemExit("session log marker missing or duplicated")
session = (
    "\n### 2026-08-02 — registry-derived shadow-audit closure @ `d23546ce`\n"
    f"- Closed `{TARGET_ID}` after source PR #780 replaced the seven-route sample with ownership-registry-derived coverage.\n"
    "- Exact production-like witness discovered and passed 52 committed-shadow routes; clean one-file head passed Metadata and Shared Files Guard.\n"
    "- Canonical arithmetic moved from **185 closed / 173 open** to **186 closed / 172 open**; P3 moved from **48** to **47**. No production claim.\n"
)
text = text.replace(session_marker, session_marker + session, 1)
MATRIX.write_text(text, encoding="utf-8")

NEXT.write_text(f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `{SOURCE_MERGE}`
**Last exact production authority:** `{PRODUCTION}`
**Deployment status:** ⚠️ source verification `!=` production; no production claim.
**Current reverify:** `{REVERIFY_REL}`
**Canonical matrix:** **358 IDs = 186 closed + 172 open**.

## What changed

- Closure wave V1 closed 15 fixed/stale source-data findings.
- Source PR #755 removed dead Vosk `splitSentences`; its canonical row is closed.
- `AR-IDX-CSS-01` is closed as stale because the shared Home z-index tokens are defined and consumed.
- Source PR #780 / merge `{SOURCE_MERGE}` closed `{TARGET_ID}`: the legacy shadow audit now derives all applicable committed-shadow routes from the ownership registry and passed a 52-route production-like witness.

## Current counts

- P0: 0
- P1: 84
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3
- Total open: 172
- Closed: 186

## Next meaningful work

1. Run the expanded exact-anchor browser/runtime wave, including `AVRAAM-P1-04`, `A11Y-P1-01` and `QUAL-P1-04`.
2. Close every fixed/stale/false/duplicate result; narrow partial findings; retain only confirmed-current residuals.
3. Repair confirmed-current clusters in independent bounded lanes, respecting active source PR ownership.
4. Do not create an AuditRepo sync solely because source `main` moved; update only material finding/evidence/handoff facts.
""", encoding="utf-8")

REVERIFY.write_text(f"""# CURRENT HEAD REVERIFY — registry-derived shadow-audit closure

**Date:** 2026-08-02  
**AuditRepo base:** `b0ab4ac9b21b7b9636e7558b92bb769f63c87787`  
**Source clean head:** `{SOURCE_HEAD}`  
**Source witness head:** `{WITNESS_HEAD}`  
**Source squash merge:** `{SOURCE_MERGE}`  
**Last exact production authority:** `{PRODUCTION}`  
**Canonical finding:** `{TARGET_ID}`  
**Production claim:** none

## Claim rechecked

The open row asserted that `legacy-shadow-wrapper-audit.js` checked only seven of 52 applicable production-dist routes.

Source PR #780 changed exactly that audit owner:

- route discovery now comes from `migration/page-ownership.json`;
- every `owner=astro`, `status=production-dist` route with a committed root HTML shadow is included;
- malformed ownership data, empty discovery, duplicate shadow paths and stale overrides fail closed;
- canonical URL, required title/description/H1, committed-shadow noindex disposition, structural markers and retained text ratio are enforced.

Exact witness run `30766785459` on `{WITNESS_HEAD}` built the production-like dist, discovered **52 routes** and passed all obligations. Node Toolchain `30766785503` also passed. The temporary witness workflow was removed without changing the permanent script blob; clean head `{SOURCE_HEAD}` passed Metadata `30766961604` and Shared Files Guard `30766961603`. Squash merge: `{SOURCE_MERGE}`.

## Disposition

`{TARGET_ID}` is **FIXED-CURRENT / SOURCE+CI VERIFIED**. No product route/content and no production deployment is claimed.

## Arithmetic

- canonical IDs: 358
- closed: 185 → 186
- open: 173 → 172
- P3: 48 → 47
- all other category counts unchanged
""", encoding="utf-8")

print("materialized shadow-audit closure: 358 = 186 closed + 172 open")
