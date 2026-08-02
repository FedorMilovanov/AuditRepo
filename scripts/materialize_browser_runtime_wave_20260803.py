from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
NEXT = ROOT / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
REVERIFY = ROOT / "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-03_1944eb1b_browser-runtime-wave.md"
SELF = ROOT / "scripts/materialize_browser_runtime_wave_20260803.py"
WORKFLOW = ROOT / ".github/workflows/materialize-browser-runtime-wave-20260803.yml"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


matrix = MATRIX.read_text(encoding="utf-8")
matrix = replace_once(
    matrix,
    "| Source verification anchor | `d23546ce177c23c14aa82de511b2b1fc7a1f8bd3` (source merge closing `SHADOW-AUDIT-NARROW`; no production claim). |",
    "| Source verification anchor | `1944eb1b5e594d2d6b5eafa5b9889bc60c9aeef5` (exact source/main browser-runtime finding witness; no production claim). |",
    "source anchor",
)
matrix = replace_once(
    matrix,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_d23546ce_shadow-audit-coverage-closure.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-03_1944eb1b_browser-runtime-wave.md` |",
    "last reverify",
)
matrix = replace_once(matrix, "## ✅ ЗАКРЫТО (186)", "## ✅ ЗАКРЫТО (187)", "closed counter")
closed_marker = "|---|---|---|\n| SHADOW-AUDIT-NARROW |"
closed_row = (
    "|---|---|---|\n"
    "| QUAL-P1-04 | ✅ **STALE-ON-CURRENT-HEAD / SOURCE+CHROMIUM VERIFIED 2026-08-03.** "
    "The historical delegated-click regression is not reproducible on exact source/main anchor "
    "`1944eb1b5e594d2d6b5eafa5b9889bc60c9aeef5`. Production-like Chromium opened the single-photo "
    "Цоар fixture through story `lot`: the visible trigger used the 320px thumbnail while `data-src` "
    "owned the 1280px source; the modal contained exactly one open instance and retained the exact "
    "`width=1280` URL both immediately and after 700 ms, with no reset to `width=320`. Exact workflow "
    "run `30769737659`; artifact `8840166904`, digest "
    "`sha256:eef8df91e454721ba6afdc29138e90420a1e0bfb2ee28323046348310214246a`. "
    "No production claim. | `1944eb1b`; run `30769737659`; artifact `8840166904` |\n"
    "| SHADOW-AUDIT-NARROW |"
)
matrix = replace_once(matrix, closed_marker, closed_row, "closed row insertion")
matrix = replace_once(matrix, "## 🟠 P1 — ОТКРЫТО (84)", "## 🟠 P1 — ОТКРЫТО (83)", "P1 counter")
matrix = replace_once(
    matrix,
    '| AVRAAM-P1-04 | 🆕 **Karty P1:** Вкладки панели Авраама — обычные `<div>` без `role="tab"`, `tabindex` и клавиатурной обработчики | verified-browser (c2c339708252) |',
    '| AVRAAM-P1-04 | 🟡 **PARTIAL-STALE / NARROWED 2026-08-03:** историческая часть про обычные `<div>` и полное отсутствие клавиатуры устарела: на exact source/main `1944eb1b` вкладки — нативные `<button>`, Enter активирует сфокусированную вкладку, цифровой shortcut `2` активирует вторую. Подтверждённый остаток: контейнер без `role="tablist"`; кнопки без `role="tab"`, `aria-selected` и roving `tabindex`; Space не активирует выбранную вкладку, ArrowRight не переводит фокус между вкладками и вместо этого попадает в глобальную навигацию карты. | Chromium run `30769737659`; artifact `8840166904`; exact source `1944eb1b` |',
    "AVRAAM narrowed row",
)
matrix = replace_once(
    matrix,
    '| A11Y-P1-01 | 🆕 **Karty P1:** Во время отображения интро в DOM одновременно находятся два элемента `<h1>` | verified-source (32ae0d7d) |',
    '| A11Y-P1-01 | 🔴 **CONFIRMED-CURRENT / CHROMIUM VERIFIED 2026-08-03:** на exact source/main `1944eb1b` MutationObserver/25ms sampling зафиксировал во время видимого интро одновременно два `<h1>`: статический `h1.sr-only` и `h1.me-intro__title`. Максимум `2`, 23 intro-samples; исторический дефект воспроизводится без двусмысленности. | Chromium run `30769737659`; artifact `8840166904`; exact source `1944eb1b` |',
    "A11Y confirmed row",
)
matrix = replace_once(
    matrix,
    '| QUAL-P1-04 | 🆕 **Karty P1:** Всплывающий клик галереи сбрасывает полноразмерное фото к 320px миниатюре из-за повторного срабатывания делегированного клика панели | verified-source (32ae0d7d) |\n',
    "",
    "QUAL open row removal",
)
session_entry = (
    "## Session log\n\n"
    "- **2026-08-03 — expanded browser/runtime wave @ exact source/main `1944eb1b`.** Production-like Chromium run "
    "`30769737659` confirmed `A11Y-P1-01`, narrowed `AVRAAM-P1-04` to the current ARIA/Space/arrow residual, and "
    "closed `QUAL-P1-04` as stale after the Цоар modal retained the 1280px full source immediately and after 700 ms. "
    "Canonical arithmetic moves 358 IDs from 186 closed / 172 open to **187 closed / 171 open**; P1 84→83. "
    "The parallel Atlas PR-head job is evidence-only and does not replace the source/main disposition anchor. No production claim. "
    "Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-03_1944eb1b_browser-runtime-wave.md`.\n\n"
)
matrix = replace_once(matrix, "## Session log\n\n", session_entry, "session log insertion")

if matrix.count("| QUAL-P1-04 |") != 1:
    raise SystemExit("QUAL-P1-04 must exist exactly once after closure")
if matrix.count("| AVRAAM-P1-04 |") != 1 or matrix.count("| A11Y-P1-01 |") != 1:
    raise SystemExit("open finding identity drift")
MATRIX.write_text(matrix, encoding="utf-8")

next_text = """# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `1944eb1b5e594d2d6b5eafa5b9889bc60c9aeef5`
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Deployment status:** ⚠️ source verification `!=` production; no production claim.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-03_1944eb1b_browser-runtime-wave.md`
**Canonical matrix:** **358 IDs = 187 closed + 171 open**.

## What changed

- Expanded production-like Chromium run `30769737659` tested exact source/main `1944eb1b` and the active Atlas PR head independently.
- `A11Y-P1-01` remains open and is confirmed current: the visible intro coexists with both `h1.sr-only` and `h1.me-intro__title`.
- `AVRAAM-P1-04` remains open but is narrowed: tabs are native buttons and Enter/numeric activation work; the residual is missing ARIA tab semantics, broken Space activation and absent arrow-focus navigation.
- `QUAL-P1-04` is closed as stale on source/main: the Цоар modal retained its 1280px source immediately and after 700 ms and never reset to the 320px thumbnail.

## Current counts

- P0: 0
- P1: 83
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3
- Total open: 171
- Closed: 187

## Next meaningful work

1. Repair `A11Y-P1-01` in a bounded source lane by assigning exactly one page-level heading owner during the intro lifecycle, then re-run the sampled browser witness.
2. Repair only the narrowed `AVRAAM-P1-04` residual in the existing Atlas ownership lane (#759): ARIA tablist/tab state, roving focus, Space and arrow-key isolation.
3. Re-run the full exact-anchor witness after those source changes; do not reopen `QUAL-P1-04` without a reproducible source/main regression.
4. Continue closing fixed/stale/false/duplicate findings and avoid AuditRepo syncs caused only by source HEAD movement.
"""
NEXT.write_text(next_text, encoding="utf-8")

reverify = """# CURRENT HEAD REVERIFY — expanded browser/runtime wave

- Date: 2026-08-03
- Canonical source/main anchor: `1944eb1b5e594d2d6b5eafa5b9889bc60c9aeef5`
- Active Atlas comparison head: `6cc3465fcb047c04d8f3b632ccee41f6f5c3c10e` (PR #759, unmerged)
- Workflow: `Audit Browser Runtime Wave`
- Exact run: `30769737659`
- Production claim: **none**
- Last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`.

## Evidence bundles

### Canonical source/main target

- Job: `witness / source-main-1944eb1b` — success
- Artifact: `8840166904`
- Digest: `sha256:eef8df91e454721ba6afdc29138e90420a1e0bfb2ee28323046348310214246a`
- Build: production-like source build, local static server, headless Chromium
- No failed network requests; only non-blocking preload warnings were recorded.

### Active Atlas PR comparison

- Job: `witness / atlas-pr-head` — success
- Artifact: `8840164723`
- Digest: `sha256:a6850cec4ab95c49b229440724f8070efec65dacdcaefff7fe6410340413d410`
- This comparison is evidence-only. It does not replace the source/main disposition anchor and makes no production claim.

## Finding dispositions

### `A11Y-P1-01` — CONFIRMED CURRENT

The canonical source/main witness sampled heading state every 25 ms while observing DOM mutations. During the visible intro it recorded 23 samples and a maximum of two simultaneous page headings:

1. `h1.sr-only` — the static descriptive page heading;
2. `h1.me-intro__title` — the visual intro heading.

The same two-heading state reproduced on the active Atlas PR head. The finding remains open.

### `AVRAAM-P1-04` — PARTIAL STALE, NARROWED RESIDUAL

The historical claim is overbroad:

- all rendered tabs are native `<button>` elements, not `<div>`;
- Enter activates the focused tab;
- numeric shortcut `2` activates the second visible tab.

The current residual is confirmed:

- `.me-tabs` has no `role="tablist"`;
- tab buttons have no `role="tab"`, `aria-selected` or roving `tabindex` contract;
- Space does not activate the focused tab;
- ArrowRight does not move focus between tabs and is consumed by global map navigation.

The row remains open with this narrower wording. Work belongs in the existing Atlas ownership lane rather than a competing branch.

### `QUAL-P1-04` — STALE ON CURRENT SOURCE/MAIN

The canonical witness selected the only route record with one photo and distinct full/thumbnail URLs: Цоар (`story=lot`, `place=zoar`). Runtime evidence showed:

- visible trigger `src`: Wikimedia URL with `width=320`;
- canonical `data-src`: the same photo with `width=1280`;
- one open photo modal;
- modal `src` immediately after click: exact `width=1280` URL;
- modal `src` after 700 ms: unchanged exact `width=1280` URL;
- no reset to the thumbnail URL.

Therefore the historical repeat-delegation regression is not reproducible at exact source/main `1944eb1b`; the canonical row is closed. The Atlas PR-head comparison did not expose a stable clickable fixture after its own in-branch runtime rerender, so it is not used to reopen or weaken the exact source/main disposition.

## Canonical arithmetic

Before:

- 358 total
- 186 closed
- 172 open
- P1: 84

After:

- 358 total
- 187 closed
- 171 open
- P1: 83
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

Only `QUAL-P1-04` moved from open P1 to closed. `A11Y-P1-01` remains confirmed open; `AVRAAM-P1-04` remains open with narrower current wording.
"""
REVERIFY.write_text(reverify, encoding="utf-8")

# The transport files must not survive in the final PR tree.
SELF.unlink()
WORKFLOW.unlink()
