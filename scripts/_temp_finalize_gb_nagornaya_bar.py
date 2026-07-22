#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects/gb-is-my-strength"
PROMPT = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX = PROJECT / "verified/MASTER_BUG_MATRIX.md"
REVERIFY = PROJECT / "reverify/CURRENT_HEAD_REVERIFY_2026-07-22_9c3dec16_nagornaya-bar.md"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1)

prompt = PROMPT.read_text(encoding="utf-8")
prompt = prompt.replace(
    "Source `main`: `942a79eb6d9bd7542e47470260dd3bbd69d533d8`",
    "Source `main`: `9c3dec16717563885c36a497f3b47ff793a6bf4f`",
    1,
)
prompt = prompt.replace(
    "PR #119, #123, #125, #128 и #131 завершили release-транзакцию после Reader R5/special overlays.",
    "PR #119, #123, #125, #128 и #131 завершили release-транзакцию; PR #126 закрыл технический P0 Нагорной.",
    1,
)
prompt = prompt.replace(
    "Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md`.",
    "Current reverify: `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_9c3dec16_nagornaya-bar.md`.",
    1,
)
prompt = prompt.replace("# expect 942a79eb… or newer", "# expect 9c3dec16… or newer", 1)
prompt = replace_once(
    prompt,
    "## Current mandatory boundary — land isolated prepared P0 fixes\n\n"
    "1. Revalidate and merge PR #126 (`NG-RUNTIME-BAR-ASSET-01`) from current main.\n"
    "2. Revalidate and merge PR #120 (highlights dedupe/ARIA), then close issue #112.\n"
    "3. Recreate the verified pastoral-safety artifact as a clean separate PR.\n"
    "4. Only then proceed to source-integrity P1 and Reader R6; do not combine these lanes.\n",
    "## Current mandatory boundary — continue isolated fixes\n\n"
    "1. Revalidate and merge PR #120 (highlights dedupe/ARIA), then close issue #112.\n"
    "2. Recreate the verified pastoral-safety artifact as a clean separate PR.\n"
    "3. Proceed to source-integrity P1 and argument/source registry.\n"
    "4. Begin Reader R6 only as a separate state-platform lane; do not combine these tasks.\n",
    "prompt current boundary",
)
prompt = replace_once(
    prompt,
    "### P0 — `NG-RUNTIME-BAR-ASSET-01`\n\n"
    "- all five Part I–V native footers use `nagornaya-bar-extras.js?v=1`;\n"
    "- canonical asset hash is `3c7e0bdd`;\n"
    "- `cache-bust.js` only recognizes eight-hex Astro revisions, so `v=1` bypasses the guard;\n"
    "- checked-in shadow HTML omits the asset;\n"
    "- asset file itself exists and `js/` is copied to dist.\n\n"
    "Clean draft PR #126 already implements this technical P0 and passed source, adversarial, production-like\n"
    "and Chromium checks. It is now synchronized with the v191 SW baseline; refresh from `942a79eb`, rerun\n"
    "standard CI, then merge before other Nagornaya content or UI work.\n",
    "### P0 — `NG-RUNTIME-BAR-ASSET-01` — LANDED PR #126 (`9c3dec16`)\n\n"
    "- five native Part I–V footers and five committed shadow pages load canonical `nagornaya-bar-extras.js?v=3c7e0bdd`;\n"
    "- Astro cache-bust matching now rejects arbitrary stale `?v=` values, including `v=1`;\n"
    "- permanent source/adversarial and 360/390/1024 Chromium contracts are wired into CI;\n"
    "- 11 newly exposed Baptist PageHead revision mismatches were regenerated mechanically; content/UI unchanged;\n"
    "- final Shared Files, Route Registry, Native Source, Editorial Metadata and Chromium/Firefox/WebKit checks passed.\n",
    "prompt Nagornaya runtime block",
)
PROMPT.write_text(prompt, encoding="utf-8")

matrix = MATRIX.read_text(encoding="utf-8")
matrix = matrix.replace(
    "| Source HEAD | `942a79eb6d9bd7542e47470260dd3bbd69d533d8` (main; single-owner exact-SHA deploy topology, v191 SW baseline and witness cleanup landed) |",
    "| Source HEAD | `9c3dec16717563885c36a497f3b47ff793a6bf4f` (main; production witness cleanup and Nagornaya bar asset P0 landed) |",
    1,
)
matrix = matrix.replace(
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_942a79eb_production-witness.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-22_9c3dec16_nagornaya-bar.md` |",
    1,
)
matrix = matrix.replace("## ✅ ЗАКРЫТО (118)", "## ✅ ЗАКРЫТО (119)", 1)
closed_anchor = "| PROD-STALE-DEPLOY-RED | ✅ **FIXED/VERIFIED 2026-07-22.**"
idx = matrix.index(closed_anchor)
line_end = matrix.index("\n", idx) + 1
closed_row = "| NG-RUNTIME-BAR-ASSET-01 | ✅ **FIXED 2026-07-22.** Five native and five shadow Nagornaya Part I–V pages load canonical `nagornaya-bar-extras.js?v=3c7e0bdd`; cache-bust catches arbitrary stale Astro revisions; permanent source/adversarial and Chromium contracts landed. Eleven Baptist PageHead revision updates are generated-only. Final standard and three-browser CI green. | `9c3dec16` PR#126 |\n"
if closed_row not in matrix:
    matrix = matrix[:line_end] + closed_row + matrix[line_end:]
open_row = "| NG-RUNTIME-BAR-ASSET-01 | 🔴 **Нагорная P0 release/runtime.** All five native Part I–V footers reference `nagornaya-bar-extras.js?v=1`, canonical hash is `3c7e0bdd`, and `cache-bust.js` only recognizes eight-hex Astro revisions, so `v=1` bypasses the universal guard. Checked-in shadow HTML omits the asset. Clean draft PR #126 implements regex hardening, five Astro refs, five shadow refs, permanent contracts and Chromium witnesses; synchronized with v191 baseline, still requires current-main revalidation and merge. | PR #126 verified/prepared; not landed |\n"
matrix = replace_once(matrix, open_row, "", "remove open Nagornaya runtime row")
log = """

### 2026-07-22 — Nagornaya bar asset P0 landed

- PR #126 squash-merged as `9c3dec16717563885c36a497f3b47ff793a6bf4f` after Shared Files, Route Registry, Native Source, Editorial Metadata and Chromium/Firefox/WebKit passed.
- `NG-RUNTIME-BAR-ASSET-01` moved from open P0 to closed; count 118 → 119.
- Next isolated source lane is highlights PR #120, followed by pastoral safety and source integrity; Reader R6 remains separate.
"""
if "### 2026-07-22 — Nagornaya bar asset P0 landed" not in matrix:
    matrix = matrix.rstrip() + log
MATRIX.write_text(matrix.rstrip() + "\n", encoding="utf-8")

REVERIFY.write_text(
    """# CURRENT HEAD REVERIFY — 2026-07-22 — Nagornaya bar asset

## Authority

- Source `main`: `9c3dec16717563885c36a497f3b47ff793a6bf4f`.
- Production proof remains Pages run `29910271842` for exact `a0c9c025`; issue #58 is closed.
- PR #131 cleanup: `942a79eb`.
- Nagornaya technical P0 PR #126: `9c3dec16`.

## Verified delta

PR #126 landed only the bar-asset publication contract:

- five native Astro footers and five shadow pages load `nagornaya-bar-extras.js?v=3c7e0bdd`;
- the asset is ordered between mobile TOC and floating-cluster runtime;
- `cache-bust.js` catches non-hash stale Astro revisions such as `?v=1`;
- permanent source/adversarial and browser contracts are present;
- 11 Baptist PageHead changes are generated revision reconciliation only;
- Shared Files Guard, Route Registry, Native Source, Editorial Metadata and Chromium/Firefox/WebKit passed on the exact feature head before squash merge.

## Next boundary

1. Highlights PR #120 and issue #112.
2. Separate pastoral-safety content PR from the verified artifact.
3. Separate source-integrity and argument/source registry P1.
4. Reader R6 / issue #59 only as an independent reader-state lane.
""",
    encoding="utf-8",
)
print("finalized Nagornaya bar merge reconciliation")
