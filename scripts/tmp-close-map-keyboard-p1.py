from pathlib import Path
import re

SOURCE = "bd537dc107bd4b80c72075357f452690cbc39781"
SOURCE8 = SOURCE[:8]
FINAL_HEAD = "64e36c82d6d70bb25a3e88793f7c61c2982ad1f8"
EVIDENCE = "reverify/CURRENT_HEAD_REVERIFY_2026-07-24_bd537dc1_map-keyboard-contract.md"
ROOT = Path("projects/gb-is-my-strength")


def sub_once(text, pattern, replacement, label, flags=0):
    out, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 replacement, got {count}")
    return out


# NEXT_AGENT_PROMPT.md
prompt_path = ROOT / "NEXT_AGENT_PROMPT.md"
prompt = prompt_path.read_text(encoding="utf-8")
prompt = sub_once(prompt, r"\*\*Source main:\*\* `[^`]+`", f"**Source main:** `{SOURCE}`", "prompt source")
prompt = sub_once(prompt, r"\*\*Current source reverify:\*\* `[^`]+`", f"**Current source reverify:** `{EVIDENCE}`", "prompt evidence")
prompt = sub_once(prompt, r"- source `main` is `[^`]+`;", f"- source `main` is `{SOURCE8}`;", "prompt boundary source")
prompt = sub_once(
    prompt,
    r"- homepage rebuild `4ee73bb2` and audit corpus PR #169 \(`73c49e99`\) are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment\.",
    "- homepage rebuild, Gill PRs #156/#174, audit corpus PR #169 and map keyboard PR #173 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.",
    "prompt boundary details",
)
prompt = sub_once(prompt, r"Canonical evidence: `reverify/[^`]+`\.", f"Canonical evidence: `{EVIDENCE}`.", "prompt canonical evidence")
completed_anchor = "- `AUDIT-PRO-ROOT-ONLY` — closed by PR #169: the source HTML corpus is registry-owned, 52 committed production shadows and 23 dist-only routes are explicit, unregistered root HTML is blocking, duplicated HTML scans use one corpus, and adversarial mutations are permanent CI.\n"
if completed_anchor not in prompt:
    raise SystemExit("prompt completed anchor missing")
prompt = prompt.replace(
    completed_anchor,
    completed_anchor
    + "- `MAP-P1-16` — closed by PR #173: editable fields, IME composition and Alt/Ctrl/Meta chords are isolated from global MapEngine shortcuts while Escape remains the overlay close command.\n"
    + "- `MAP-P1-17` — closed by PR #173: numeric navigation derives the actual visible DOM tab order, reaches `sci` through the canonical click handler, and permanently separates shared `ishod` MapEngine smoke from bespoke legacy `avraam`.\n",
    1,
)
prompt = prompt.replace("- source PR #156 — Gill editorial/research corrections;\n", "", 1)
prompt_path.write_text(prompt, encoding="utf-8")


# MASTER_BUG_MATRIX.md
matrix_path = ROOT / "verified/MASTER_BUG_MATRIX.md"
matrix = matrix_path.read_text(encoding="utf-8")
matrix = sub_once(
    matrix,
    r"\| Source HEAD \| `[^`]+` \([^\n]+\) \|",
    f"| Source HEAD | `{SOURCE}` (current source main; Gill source-truth PRs #156/#174 plus PR #173 input-safe, DOM-driven MapEngine keyboard contract) |",
    "matrix source",
)
matrix = sub_once(matrix, r"\| Last reverify \| `[^`]+` \|", f"| Last reverify | `{EVIDENCE}` |", "matrix evidence")
matrix = sub_once(
    matrix,
    r"⚠️ Старые deploy-формулировки ниже исторические\. Current source authority: `[^`]+`; last exact production authority: `8a535267`; source/CI evidence: `[^`]+`\.",
    f"⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `{SOURCE8}`; last exact production authority: `8a535267`; source/CI evidence: `{EVIDENCE}`.",
    "matrix authority",
)
matrix = matrix.replace("## ✅ ЗАКРЫТО (139)", "## ✅ ЗАКРЫТО (141)", 1)
closed_anchor = "## ✅ ЗАКРЫТО (141)\n\n| ID | Описание | Коммит |\n|---|---|---|\n"
if matrix.count(closed_anchor) != 1:
    raise SystemExit(f"matrix closed anchor count={matrix.count(closed_anchor)}")
closed_rows = (
    "| MAP-P1-16 | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** PR #173 isolates `input`, `textarea`, `select`, active `contenteditable`, `role=textbox`, IME composition and Alt/Ctrl/Meta chords before any global MapEngine shortcut; Escape remains the canonical overlay close command. Exact final head `64e36c82`: Map Keyboard Contract `30049773607`, Shared Files Guard `30049773605`, Chromium/Firefox/WebKit Overlay Runtime Browser `30049773623` and Visual Parity `30049773601` all succeeded. Exact smoke artifact `8580550637` records `ishod` routes 4/4, signature/story/scientific/keyboard `ok`, 1366px map width, zero overflow and zero console errors. | `bd537dc1` PR#173 |\n"
    "| MAP-P1-17 | ✅ **FIXED AS SAME ROOT 2026-07-24.** Number keys now query visible `.me-tab[data-tab]` nodes in actual DOM order and invoke the canonical `.click()` handler, so `sci` cannot be skipped by a duplicate `TAB_KEYS.filter` policy. Permanent source regression blocks direct `renderTabContent`, hardcoded tab availability and reclassification of bespoke legacy `avraam` as shared MapEngine; `ishod` is the canonical live engine fixture. | `bd537dc1` PR#173 |\n"
)
matrix = matrix.replace(closed_anchor, closed_anchor + closed_rows, 1)
matrix = matrix.replace("## 🟠 P1 — ОТКРЫТО (98)", "## 🟠 P1 — ОТКРЫТО (96)", 1)
for canonical_id in ("MAP-P1-16", "MAP-P1-17"):
    pattern = rf"^\| {re.escape(canonical_id)} \|.*\n"
    matrix, count = re.subn(pattern, "", matrix, count=1, flags=re.M)
    if count != 1:
        raise SystemExit(f"{canonical_id}: expected exactly one open row removal, got {count}")
    if matrix.count(f"| {canonical_id} |") != 1:
        raise SystemExit(f"{canonical_id}: canonical row count is not exactly one after move")

matrix = matrix.replace(
    "## Статистика (обновлено 2026-07-24: source 73c49e99 + registry-owned audit-pro corpus)",
    "## Статистика (обновлено 2026-07-24: source bd537dc1 + MapEngine keyboard contracts)",
    1,
)
matrix = matrix.replace("| Закрыто (fixed) | 139 |", "| Закрыто (fixed) | 141 |", 1)
matrix = matrix.replace("| P1 открыто | 98 |", "| P1 открыто | 96 |", 1)
matrix = matrix.replace("| **Всего открыто (матрица)** | **196** |", "| **Всего открыто (матрица)** | **194** |", 1)
session_anchor = "- **2026-07-24 — Source `73c49e99`: registry-owned audit-pro source corpus.**"
if session_anchor not in matrix:
    raise SystemExit("matrix session anchor missing")
new_session = (
    f"- **2026-07-24 — Source `{SOURCE8}`: input-safe, DOM-driven MapEngine keyboard contract.** PR #173 closed `MAP-P1-16` and `MAP-P1-17` without touching homepage, Gill, glossary or route HTML ownership. Editable/IME/modifier input is isolated; number keys follow visible DOM tabs and canonical click behavior; `ishod` is the shared MapEngine fixture while `avraam` remains explicit bespoke legacy. Exact final head `64e36c82` passed Map Keyboard `30049773607`, Shared Guard `30049773605`, Overlay Browser `30049773623` and Visual Parity `30049773601`; artifact `8580550637` records a clean live smoke. Production authority remains `8a535267` pending a same-SHA deploy witness. Evidence: `{EVIDENCE}`.\n\n"
)
matrix = matrix.replace(session_anchor, new_session + session_anchor, 1)
matrix_path.write_text(matrix, encoding="utf-8")


# Immutable reverify evidence
evidence_path = ROOT / EVIDENCE
evidence_path.write_text(
    f"""# CURRENT HEAD REVERIFY — `{SOURCE8}` — MapEngine keyboard contract

Date: 2026-07-24

## Boundary

- Current source `main`: `{SOURCE}`.
- Exact pre-merge PR head used by all cited checks: `{FINAL_HEAD}`.
- Last exact deployed source remains `8a5352671375fdb01b6c30273c25ec4283a13f69`.
- This record closes two source/CI defects. It does **not** claim that `{SOURCE8}` is already the exact GitHub Pages deployment.
- Gill PRs #156 and #174 were already present in the tested merge state and are file-disjoint from the four map-contract files.

## Closed canonical rows

### `MAP-P1-16`

Global MapEngine keyboard handling now leaves editable and system input alone:

- `input`, `textarea`, `select`, active `contenteditable` and `role=textbox` are excluded;
- IME composition is excluded;
- Alt/Ctrl/Meta chords are excluded;
- Space, digits, arrows, PageUp/PageDown, Home/End and help shortcuts remain map commands only outside those contexts;
- Escape remains the canonical overlay close command.

### `MAP-P1-17`

Numeric tab navigation no longer owns a second content-availability policy:

- visible `.me-tab[data-tab]` elements are read in actual DOM order;
- the selected tab is activated through its canonical `.click()` handler;
- direct keyboard calls to `renderTabContent` and `TAB_KEYS.filter` are permanently forbidden;
- the scientific `sci` tab is reachable at its rendered numeric position;
- `ishod` is the shared MapEngine live fixture;
- `avraam` is explicitly classified as a separate bespoke legacy engine and is not run through incompatible `.me-*` selectors.

## Exact source verification

Final PR head: `{FINAL_HEAD}`.

- Map Keyboard Contract `30049773607` — source contract and Chromium contract success.
- Shared Files Guard `30049773605` — success, including actionlint and all shared/runtime guards.
- Overlay Runtime Browser `30049773623` — Chromium, Firefox and WebKit success.
- Visual Parity Guard `30049773601` — production-like build, pixel diagnostics, owner-approved route policy and screenshot artifact upload success.
- Exact keyboard smoke artifact `8580550637`, digest `sha256:72ecffd9898edeb2af24e029e8574302c5126fbec6039777302e849ab3fc9d2d`.
- Smoke payload: `ishod` routes 4/4; signature toggle, story flyTo, scientific tab and keyboard contract all `ok`; map width 1366px; overflow 0px; console errors 0.

## Final source diff

Exactly four permanent files:

1. `.github/workflows/map-keyboard-contract.yml`;
2. `karty/_engine/map-engine.js`;
3. `scripts/map-browser-smoke.js`;
4. `scripts/map-keyboard-contract-test.js`.

No temporary workflow, staging block, reconciler or route implementation file remained in source PR #173.

## Matrix effect

- closed: 139 → 141;
- P1 open: 98 → 96;
- total open rows: 196 → 194;
- P0, P2, P3, refactoring and AuditRepo counts are unchanged;
- no canonical row was aliased or silently deleted;
- source authority advances to `{SOURCE8}` while production authority remains `8a535267`.

## Remaining execution order

Continue verified P0/P1 work from the matrix only after refreshing current source `main` and active PR file intersections. The 34 PR #167 editorial warnings and Reader R6 remain separate lanes; active source PR #161 and AuditRepo PR #27 must not be overwritten.
""",
    encoding="utf-8",
)

for path in (prompt_path, matrix_path, evidence_path):
    content = path.read_text(encoding="utf-8")
    if not content.strip():
        raise SystemExit(f"empty output: {path}")

if matrix.count("| MAP-P1-16 |") != 1 or matrix.count("| MAP-P1-17 |") != 1:
    raise SystemExit("canonical map row uniqueness failed")
if "## 🟠 P1 — ОТКРЫТО (96)" not in matrix:
    raise SystemExit("P1 heading was not updated")
if "| **Всего открыто (матрица)** | **194** |" not in matrix:
    raise SystemExit("total-open statistic was not updated")
