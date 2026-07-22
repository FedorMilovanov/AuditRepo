#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects/gb-is-my-strength"
PROMPT = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX = PROJECT / "verified/MASTER_BUG_MATRIX.md"
REVERIFY = PROJECT / "reverify/CURRENT_HEAD_REVERIFY_2026-07-22_5650c96_highlights-pastoral.md"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1)


prompt = PROMPT.read_text(encoding="utf-8")
prompt = prompt.replace(
    "Source `main`: `9c3dec16717563885c36a497f3b47ff793a6bf4f`",
    "Source `main`: `5650c96b838c78dcda3c37b75f8e58755469cacd`",
    1,
)
prompt = prompt.replace(
    "PR #119, #123, #125, #128 и #131 завершили release-транзакцию; PR #126 закрыл технический P0 Нагорной.",
    "Release-транзакция завершена; PR #126 закрыл технический P0 Нагорной, PR #120 — highlights/ARIA, PR #138 — pastoral safety.",
    1,
)
prompt = prompt.replace(
    "Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_9c3dec16_nagornaya-bar.md`.",
    "Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_5650c96_highlights-pastoral.md`.",
    1,
)
prompt = prompt.replace("# expect 9c3dec16… or newer", "# expect 5650c96… or newer", 1)
prompt = replace_once(
    prompt,
    "## Current mandatory boundary — continue isolated fixes\n\n"
    "1. Revalidate and merge PR #120 (highlights dedupe/ARIA), then close issue #112.\n"
    "2. Recreate the verified pastoral-safety artifact as a clean separate PR.\n"
    "3. Proceed to source-integrity P1 and argument/source registry.\n"
    "4. Begin Reader R6 only as a separate state-platform lane; do not combine these tasks.\n",
    "## Current mandatory boundary — source integrity next\n\n"
    "1. Implement issue #140 (`NG-SOURCE-INTEGRITY-01`) as one bibliography/attribution PR.\n"
    "2. Build the source-role registry and arguments/alternatives architecture separately.\n"
    "3. Capture browser baselines before neutral comparison UI changes.\n"
    "4. Begin Reader R6 only as an independent state-platform lane; do not combine these tasks.\n",
    "prompt current boundary",
)
prompt = replace_once(
    prompt,
    "## Prepared but not landed — highlights / issue #112 / PR #120\n\n"
    "The matrix previously claimed highlight dedupe/ARIA was fixed by PR #95, but current `main`\n"
    "does not contain it. The clean rebuilt implementation is in draft PR #120:\n\n"
    "- compact old duplicate saved quotes by normalized path + text;\n"
    "- prevent new same-page duplicates while preserving same text on another page;\n"
    "- preserve 200-item cap and storage schema;\n"
    "- synchronize dialog `aria-hidden` initial/open/close state;\n"
    "- dependency-free regression and full `validate:static-publication:light` already passed.\n\n"
    "PR #120 has already been rebuilt cleanly and synchronized with the release fixes. Revalidate from current\n"
    "`main`, merge only the permanent runtime/test/generated-revision diff, then close issue #112.\n",
    "## Highlights hardening — LANDED PR #120 (`26efb711`)\n\n"
    "- legacy same-page/same-text duplicates compact on read with newest stable ordering;\n"
    "- new same-page duplicates are blocked while identical text on another route remains valid;\n"
    "- 200-item cap and `gb-highlights-v1` compatibility are preserved;\n"
    "- dialog `aria-hidden=true → false → true` is synchronized across initial/open/close state;\n"
    "- dependency-free regression is permanent in Shared Files Guard; issue #112 closed.\n",
    "prompt highlights section",
)
prompt = replace_once(
    prompt,
    "### P0 pastoral safety — `NG-PASTORAL-SAFETY-01`\n\n"
    "Part V currently says:\n\n"
    "> «Полное отсутствие плодов — смертный приговор вере» … «Мф 7:21 относится к нему».\n\n"
    "Preserve the warning against self-deception, but replace final-verdict/omniscient language with\n"
    "pastorally calibrated evidence and explicit safeguards. Separate owner-reviewable content PR.\n",
    "### P0 pastoral safety — `NG-PASTORAL-SAFETY-01` — LANDED PR #138 (`5650c96`)\n\n"
    "- Christ's warning against self-deception and the necessity of fruit remain explicit;\n"
    "- final-verdict wording and direct assignment of Matt 7:21 to a reader were removed;\n"
    "- persistent fruitlessness now triggers serious self-examination, repentance and pastoral support;\n"
    "- final judgment of the heart is explicitly reserved to Christ;\n"
    "- mechanical application to a contrite believer fighting sin is forbidden;\n"
    "- two Astro layers, committed shadow and permanent regression are synchronized.\n",
    "prompt pastoral section",
)
prompt = prompt.replace(
    "Fix as a separate bibliography/attribution PR after P0s.",
    "Implement through issue #140 as the next isolated bibliography/attribution PR.",
    1,
)
PROMPT.write_text(prompt, encoding="utf-8")

matrix = MATRIX.read_text(encoding="utf-8")
matrix = matrix.replace(
    "| Source HEAD | `9c3dec16717563885c36a497f3b47ff793a6bf4f` (main; production witness cleanup and Nagornaya bar asset P0 landed) |",
    "| Source HEAD | `5650c96b838c78dcda3c37b75f8e58755469cacd` (main; Nagornaya bar P0, highlights/ARIA and pastoral safety landed) |",
    1,
)
matrix = matrix.replace(
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_9c3dec16_nagornaya-bar.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_5650c96_highlights-pastoral.md` |",
    1,
)
matrix = matrix.replace("## ✅ ЗАКРЫТО (119)", "## ✅ ЗАКРЫТО (121)", 1)
anchor = "| NG-RUNTIME-BAR-ASSET-01 | ✅ **FIXED 2026-07-22.** Five native and five shadow Nagornaya Part I–V pages load canonical `nagornaya-bar-extras.js?v=3c7e0bdd`; cache-bust catches arbitrary stale Astro revisions; permanent source/adversarial and Chromium contracts landed. Eleven Baptist PageHead revision updates are generated-only. Final standard and three-browser CI green. | `9c3dec16` PR#126 |\n"
rows = (
    "| RUNTIME-HIGHLIGHT-DEDUPE-01 | ✅ **FIXED 2026-07-22.** Legacy duplicates compact by normalized route+text; new same-page duplicates are blocked; cross-page same text and 200-item cap remain valid; dialog ARIA lifecycle is synchronized and permanently guarded. Issue #112 closed. | `26efb711` PR#120 |\n"
    "| NG-PASTORAL-SAFETY-01 | ✅ **FIXED 2026-07-22.** Part V retains the warning about persistent fruitlessness but replaces omniscient/final-verdict wording with self-examination, repentance, pastoral support, Christ's final judgment and protection for contrite believers. Native/shadow parity and permanent regression landed. | `5650c96` PR#138 |\n"
)
if rows not in matrix:
    matrix = replace_once(matrix, anchor, anchor + rows, "closed rows anchor")
open_highlight = "| RUNTIME-HIGHLIGHT-DEDUPE-01 | 🟠 **MATRIX CORRECTION 2026-07-22.** The PR #95/`779c23c` closure is not present in current `main`: saved quotes still use unconditional insertion and dialog state lacks the required ARIA lifecycle. Clean fix is prepared and transaction-verified in draft PR #120 but not landed. | current-source negative witness + issue #112 / PR #120 |\n"
open_pastoral = "| NG-PASTORAL-SAFETY-01 | 🔴 **Нагорная P0 pastoral safety.** Part V green verdict says «Полное отсутствие плодов — смертный приговор вере» and directly assigns Matt 7:21 to the reader without operational limits for time, evidence, trauma/illness/disability or weak/hidden fruit. Preserve warning against self-deception but remove omniscient/final-verdict language. | verified-source `NagornayaChast5MainShell.astro`; C92 |\n"
matrix = replace_once(matrix, open_highlight, "", "remove open highlight")
matrix = replace_once(matrix, open_pastoral, "", "remove open pastoral")
log = """

### 2026-07-22 — highlights and pastoral safety landed

- PR #120 squash-merged as `26efb71193b4fbc370755b71f7c7fa1a88e305e7`; issue #112 closed after dedupe/ARIA permanent regression and standard source/browser CI.
- PR #138 squash-merged as `5650c96b838c78dcda3c37b75f8e58755469cacd`; `NG-PASTORAL-SAFETY-01` closed after artifact SHA verification, exact fresh-source replacement, full publication barrier and permanent regression.
- Closed count 119 → 121. Next isolated lane: issue #140 / `NG-SOURCE-INTEGRITY-01`.
"""
if "### 2026-07-22 — highlights and pastoral safety landed" not in matrix:
    matrix = matrix.rstrip() + log
MATRIX.write_text(matrix.rstrip() + "\n", encoding="utf-8")

REVERIFY.write_text(
    """# CURRENT HEAD REVERIFY — 2026-07-22 — highlights and pastoral safety

## Authority

- Source `main`: `5650c96b838c78dcda3c37b75f8e58755469cacd`.
- Production proof remains Pages run `29910271842` for exact `a0c9c025`; issue #58 is closed.
- Nagornaya technical bar P0: PR #126 / `9c3dec16`.
- Highlights/ARIA: PR #120 / `26efb711`; issue #112 closed.
- Pastoral safety: PR #138 / `5650c96`.

## Verified delta

### Highlights

- legacy duplicate compaction by normalized path + text;
- no new same-page duplicates, identical cross-page text preserved;
- stable ordering, storage schema and 200-item cap preserved;
- dialog `aria-hidden` synchronized initial/open/close;
- permanent Shared Files Guard regression; standard source and three-browser CI green.

### Nagornaya pastoral safety

- grave warning against self-deception remains;
- “смертный приговор вере” and direct assignment of Matt 7:21 removed;
- self-examination, repentance and pastoral support made operational;
- final judgment reserved to Christ;
- contrite believers fighting sin protected from mechanical application;
- two Astro layers, committed shadow and permanent regression synchronized;
- artifact transaction, full publication barrier, Shared Files Guard and Native Source Contract green.

## Next boundary

1. Issue #140 / `NG-SOURCE-INTEGRITY-01`: exact Green/Thomas/Nichols objects and author-vs-institution attribution.
2. Source-role registry and arguments/alternatives architecture as a separate P1.
3. Browser baseline before neutral comparison UI.
4. Reader R6 / issue #59 only as an independent state-platform lane.
""",
    encoding="utf-8",
)

print("reconciled highlights and pastoral safety")
