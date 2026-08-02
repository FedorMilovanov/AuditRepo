#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
MATRIX = ROOT / "projects" / "gb-is-my-strength" / "verified" / "MASTER_BUG_MATRIX.md"
ANCHOR = "fc1085c805d72e6d43f58a6383c680d4e886183b"
OBSERVED = "f9234dbbe832d80b4d9a453ce3d2f58da832b24f"
PROD = "abf1edba190280e554dfda085bef9fb6594c896d"
REVERIFY = "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_fc1085c8_matrix-reconciliation.md"

text = MATRIX.read_text(encoding="utf-8")


def sub_once(pattern: str, replacement: str, label: str) -> None:
    global text
    text, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"{label}: expected one match, got {count}")


sub_once(
    r"^\| Source HEAD \|.*$",
    f"| Source verification anchor | `{ANCHOR}` (exact product/evidence anchor verified by this transaction; former canonical `efaf2a51` is 65 commits behind this anchor). Source `main` was later observed at `{OBSERVED}` after two control-plane-only cleanup commits; those commits do not alter product or evidence-critical paths. |",
    "source anchor row",
)
sub_once(
    r"^\| Deploy \|.*$",
    f"| Deploy | ⚠️ **VERIFIED SOURCE ANCHOR ≠ PRODUCTION.** Last exact production remains run `30669840189` attempt `1`, release/control SHA `{PROD}`, candidate `{PROD}:30669840189-1`, release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`. Anchor `{ANCHOR}` has no same-SHA production witness. Later cleanup-only source tips do not create a production claim. |",
    "deploy row",
)
sub_once(
    r"^⚠️ Deploy-формулировки.*$",
    f"⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. Verified product/evidence anchor = `{ANCHOR}`; last exact production authority = `{PROD}`. Source `main` was subsequently observed at `{OBSERVED}`: the two post-anchor commits only removed a completed normalization writer and pinned actions in the Pihahiroth release workflow. No product, Karty/Ishod data, Vosk, genealogy or matrix-evidence path changed, so verdicts remain anchored to `{ANCHOR}`. Any later status change still requires a new exact-head reverify. Active source owner: draft PR #680 at `282ee9aec770b6f7c91145d39f935ea14136d29e`; не вмешиваться в его ветку. Evidence: `{REVERIFY}`.",
    "authority warning",
)
text = text.replace(
    "Authority advanced from stale `efaf2a51` to exact current source",
    "Verification anchor advanced from stale `efaf2a51` to exact source snapshot",
)
MATRIX.write_text(text.rstrip() + "\n", encoding="utf-8")
print("source-anchor semantics staged")
