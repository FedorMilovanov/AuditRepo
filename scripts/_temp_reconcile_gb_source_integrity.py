#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects/gb-is-my-strength"
PROMPT = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX = PROJECT / "verified/MASTER_BUG_MATRIX.md"
REVERIFY = PROJECT / "reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2599844b_source-integrity.md"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1)

prompt = PROMPT.read_text(encoding="utf-8")
prompt = prompt.replace(
    "Source `main`: `5650c96b838c78dcda3c37b75f8e58755469cacd`",
    "Source `main`: `2599844b2ea0962f728824564ed6fa6ef9592270`",
    1,
)
prompt = prompt.replace(
    "Release-транзакция завершена; PR #126 закрыл технический P0 Нагорной, PR #120 — highlights/ARIA, PR #138 — pastoral safety.",
    "Release-транзакция завершена; PR #126, #120, #138 и #141 закрыли технический, runtime, pastoral и source-integrity lanes Нагорной.",
    1,
)
prompt = prompt.replace(
    "Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_5650c96_highlights-pastoral.md`.",
    "Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2599844b_source-integrity.md`.",
    1,
)
prompt = prompt.replace("# expect 5650c96… or newer", "# expect 2599844b… or newer", 1)
prompt = replace_once(
    prompt,
    "## Current mandatory boundary — source integrity next\n\n"
    "1. Implement issue #140 (`NG-SOURCE-INTEGRITY-01`) as one bibliography/attribution PR.\n"
    "2. Build the source-role registry and arguments/alternatives architecture separately.\n"
    "3. Capture browser baselines before neutral comparison UI changes.\n"
    "4. Begin Reader R6 only as an independent state-platform lane; do not combine these tasks.\n",
    "## Current mandatory boundary — source-role architecture next\n\n"
    "1. Implement issue #142 (`NG-SOURCE-REGISTRY-01` + `NG-EPISTEMIC-MODEL-LAYERS-01`) as a data/schema pilot.\n"
    "2. Capture browser baselines before neutral comparison UI changes.\n"
    "3. Keep Reader R6 issue #59 as an independent state-platform lane.\n"
    "4. Do not combine registry, UI redesign and ReaderState in one PR.\n",
    "current boundary",
)
prompt = replace_once(
    prompt,
    "### P1 source integrity — `NG-SOURCE-INTEGRITY-01`\n\n"
    "- Green is TMSJ 12/1 **pp. 49–68**, not 49–74;\n"
    "- Thomas Jesus Seminar is `tmsj7d.pdf`, TMSJ 7/1, pp. 75–105;\n"
    "- `tmsj7h.pdf` is Nichols, TMSJ 7/2, pp. 213–239;\n"
    "- individual TMSJ author argument ≠ automatic institutional TMS position.\n\n"
    "Implement through issue #140 as the next isolated bibliography/attribution PR.\n",
    "### P1 source integrity — `NG-SOURCE-INTEGRITY-01` — LANDED PR #141 (`2599844b`)\n\n"
    "- Green / `tmsj12d.pdf` corrected to TMSJ 12/1, pp. 49–68;\n"
    "- Thomas Jesus Seminar linked to exact `tmsj7d.pdf`, TMSJ 7/1, pp. 75–105;\n"
    "- Nichols Davidic Kingdom linked to exact `tmsj7h.pdf`, TMSJ 7/2, pp. 213–239;\n"
    "- a permanent negative contract forbids Jesus Seminar metadata resolving to `tmsj7h.pdf`;\n"
    "- universal verification wording is bounded by available objects/last-checked state;\n"
    "- Part IV distinguishes Green's article, TMSJ venue and the series' confessional synthesis;\n"
    "- issue #140 closed after full publication and Native Source contracts passed.\n",
    "source-integrity section",
)
prompt = prompt.replace(
    "### P1 architecture — argument/source transparency",
    "### P1 architecture — argument/source transparency — ACTIVE ISSUE #142",
    1,
)
PROMPT.write_text(prompt, encoding="utf-8")

matrix = MATRIX.read_text(encoding="utf-8")
matrix = matrix.replace(
    "| Source HEAD | `5650c96b838c78dcda3c37b75f8e58755469cacd` (main; Nagornaya bar P0, highlights/ARIA and pastoral safety landed) |",
    "| Source HEAD | `2599844b2ea0962f728824564ed6fa6ef9592270` (main; Nagornaya technical, highlights, pastoral and source-integrity lanes landed) |",
    1,
)
matrix = matrix.replace(
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_5650c96_highlights-pastoral.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_2599844b_source-integrity.md` |",
    1,
)
matrix = matrix.replace("## ✅ ЗАКРЫТО (121)", "## ✅ ЗАКРЫТО (122)", 1)
anchor = "| NG-PASTORAL-SAFETY-01 | ✅ **FIXED 2026-07-22.** Part V retains the warning about persistent fruitlessness but replaces omniscient/final-verdict wording with self-examination, repentance, pastoral support, Christ's final judgment and protection for contrite believers. Native/shadow parity and permanent regression landed. | `5650c96` PR#138 |\n"
closed_row = "| NG-SOURCE-INTEGRITY-01 | ✅ **FIXED 2026-07-22.** Green corrected to 49–68; Thomas and Nichols linked to exact official `tmsj7d.pdf` / `tmsj7h.pdf`; negative object regression added; source-verification claim bounded; Part IV separates Green's argument, venue and series synthesis. Issue #140 closed; full publication and Native Source green. | `2599844b` PR#141 |\n"
if closed_row not in matrix:
    matrix = replace_once(matrix, anchor, anchor + closed_row, "closed row anchor")
open_row = "| NG-SOURCE-INTEGRITY-01 | 🟠 **Нагорная P1 source integrity.** Green is TMSJ 12/1 pp. **49–68**, not 49–74; Thomas Jesus Seminar is `tmsj7d.pdf` (7/1, 75–105), while `tmsj7h.pdf` is Nichols (7/2, 213–239). Current prose also promotes individual TMSJ author arguments into institutional TMS verdicts. | verified-source + official TMS PDFs; C51/C60/C61 |\n"
matrix = replace_once(matrix, open_row, "", "remove open source-integrity row")
log = """

### 2026-07-22 — source integrity landed

- PR #141 squash-merged as `2599844b2ea0962f728824564ed6fa6ef9592270`; issue #140 closed.
- Exact TMSJ objects/pages and author-vs-institution attribution are permanently guarded in native + shadow layers.
- Closed count 121 → 122. Next isolated lane: issue #142 / source-role and argument-layer registry.
"""
if "### 2026-07-22 — source integrity landed" not in matrix:
    matrix = matrix.rstrip() + log
MATRIX.write_text(matrix.rstrip() + "\n", encoding="utf-8")

REVERIFY.write_text(
    """# CURRENT HEAD REVERIFY — 2026-07-22 — source integrity

## Authority

- Source `main`: `2599844b2ea0962f728824564ed6fa6ef9592270`.
- Production proof remains Pages run `29910271842` for exact `a0c9c025`; issue #58 closed.
- Highlights/ARIA: PR #120 / `26efb711`; issue #112 closed.
- Nagornaya pastoral safety: PR #138 / `5650c96`.
- Nagornaya source integrity: PR #141 / `2599844b`; issue #140 closed.

## Verified delta

- Green / `tmsj12d.pdf`: TMSJ 12/1, pp. 49–68;
- Thomas / `tmsj7d.pdf`: TMSJ 7/1, pp. 75–105;
- Nichols / `tmsj7h.pdf`: TMSJ 7/2, pp. 213–239;
- negative regression prevents Jesus Seminar metadata using `tmsj7h.pdf`;
- source verification statement is bounded rather than universal;
- Part IV labels Donald Green's article and the series' synthesis separately while preserving the conservative conclusion and legacy hash anchor;
- transaction `29915770159`, Shared Files Guard `29916650069` and Native Source `29916650130` passed.

## Next boundary

1. Issue #142: source-role and argument-layer registry pilot.
2. Browser baseline before neutral comparison UI.
3. Reader R6 / issue #59 as an independent state-platform lane.
4. Do not combine registry, UI redesign and ReaderState.
""",
    encoding="utf-8",
)

print("reconciled source-integrity merge")
