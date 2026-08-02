#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-08-02_69d1e72a_third-pass-gate-hardening.md"

ANCHOR = "fc1085c805d72e6d43f58a6383c680d4e886183b"
START_TIP = "6cfa7468e033ed44dac79b9752b127f406d33724"
FINAL_TIP = "92bfa45a02e53d7b735af73025a79d99ffe75b67"
OWNER = "f95948ebd3f84791e150445ed505772965e180f7"
PRODUCTION = "abf1edba190280e554dfda085bef9fb6594c896d"
REVERIFY_REL = "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_69d1e72a_third-pass-gate-hardening.md"


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: pathlib.Path, text: str) -> None:
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def sub_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"{label}: expected one match, got {count}")
    return updated


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one occurrence, got {count}")
    return text.replace(old, new, 1)


def update_matrix() -> None:
    text = read(MATRIX)
    text = sub_once(
        text,
        r"^\| Source verification anchor \|.*$",
        f"| Source verification anchor | `{ANCHOR}` (durable product/evidence anchor verified by PR #121; former canonical `efaf2a51` is 65 commits behind). During this third pass source `main` was observed first at `{START_TIP}` and finally at `{FINAL_TIP}`. The eight-commit delta changes feed/sitemap, Wave12/search workflows and audit/registry scripts, but not Karty/Ishod data, Vosk, genealogy or matrix-evidence paths. |",
        "matrix source row",
    )
    text = sub_once(
        text,
        r"^⚠️ Deploy-формулировки.*$",
        f"⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. Verified product/evidence anchor = `{ANCHOR}`; final source `main` observation in this pass = `{FINAL_TIP}`; last exact production authority = `{PRODUCTION}`. The eight commits after `{START_TIP[:8]}` touch generated feed/sitemap, Wave12/search control-plane and pastor-series/public-surface audit scripts. They do not touch Karty/Ishod data, Vosk, genealogy or matrix-evidence paths, so verdicts remain anchored to `{ANCHOR}`. Any later status change requires a new exact-head reverify. Active source owner: draft PR #680 at `{OWNER}`; не вмешиваться в его ветку. Evidence: `{REVERIFY_REL}`.",
        "matrix authority warning",
    )
    text = replace_once(
        text,
        f"- Re-read `AuditRepo/main` and source `main`: AuditRepo remained exactly `69d1e72a8b59faafe1e68bd89704cf6fb8cda424`; source remained exactly `{START_TIP}`.",
        f"- Re-read `AuditRepo/main` and source `main`: AuditRepo remained exactly `69d1e72a8b59faafe1e68bd89704cf6fb8cda424`; source was observed at `{START_TIP}` at gate start and `{FINAL_TIP}` before merge.",
        "matrix session source observation",
    )
    text = replace_once(
        text,
        f"- Refreshed operational authority from the intermediate source observation to exact `{START_TIP}` and active NoteRegistry head `a231a5005f92d5f1e677ea87ece8bfb6a9dc31d7`.",
        f"- Refreshed operational authority through final source observation `{FINAL_TIP}` and active NoteRegistry head `{OWNER}`; the intervening source delta is path-bounded and does not change matrix verdicts.",
        "matrix session authority",
    )
    write(MATRIX, text)


def update_next() -> None:
    text = read(NEXT)
    text = sub_once(
        text,
        r"^\*\*Source main observed after anchor:\*\*.*$",
        f"**Source main observed after anchor:** `{FINAL_TIP}` (final observation in this verifier pass; source movement after the durable anchor is not itself a matrix verdict)",
        "NEXT source observation",
    )
    text = sub_once(
        text,
        r"^- four later commits through `6cfa7468`.*$",
        f"- source movement through `{FINAL_TIP[:8]}` includes the earlier four workflow-only commits plus eight later commits affecting feed/sitemap, Wave12/search workflows and audit/registry scripts; no Karty/Ishod data, Vosk, genealogy or matrix-evidence path changed;",
        "NEXT source delta",
    )
    text = sub_once(
        text,
        r"^- active source owner: draft PR #680 at `[^`]+`;.*$",
        f"- active source owner: draft PR #680 at `{OWNER}`; do not modify its branch or owner files;",
        "NEXT owner",
    )
    text = replace_once(
        text,
        f"source main later observed = {START_TIP}",
        f"source main finally observed in this pass = {FINAL_TIP}",
        "NEXT source code block",
    )
    write(NEXT, text)


def update_reverify() -> None:
    text = read(REVERIFY)
    text = replace_once(
        text,
        f"**Exact source main observed:** `{START_TIP}`",
        f"**Source main at gate start:** `{START_TIP}`\n**Final source main observation:** `{FINAL_TIP}`",
        "reverify source header",
    )
    text = replace_once(
        text,
        f"**Active source owner:** draft PR #680 at `a231a5005f92d5f1e677ea87ece8bfb6a9dc31d7`",
        f"**Active source owner:** draft PR #680 at `{OWNER}`",
        "reverify owner header",
    )
    text = replace_once(
        text,
        "The canonical matrix remains **358 IDs = 168 closed + 190 open**. The source repository has not changed since the prior post-merge observation. The four commits after the durable product/evidence anchor modify workflow/control-plane files only, so no product verdict is promoted or closed in this pass.",
        f"The canonical matrix remains **358 IDs = 168 closed + 190 open**. Source `main` moved during this pass from `{START_TIP}` to `{FINAL_TIP}`. The eight-commit delta changes generated feed/sitemap, Wave12/search workflows and audit/registry scripts, but does not touch Karty/Ishod data, Vosk, genealogy or matrix-evidence paths. No product verdict is promoted or closed in this pass.",
        "reverify result paragraph",
    )
    text = replace_once(
        text,
        "The operational owner reference was stale: PR #680 advanced to `a231a5005f92d5f1e677ea87ece8bfb6a9dc31d7`. The matrix and NEXT handoff now record that exact head while preserving the instruction not to modify the owner branch.",
        f"The operational owner reference moved again during verification: PR #680 is finally observed at `{OWNER}`. The matrix and NEXT handoff record that exact observation while preserving the instruction not to modify the owner branch.",
        "reverify owner paragraph",
    )
    addition = f'''\n## Final source-delta review\n\nThe compare from `{START_TIP}` to `{FINAL_TIP}` is eight commits and seven paths:\n\n- `feed.xml` and `sitemap.xml`;\n- Wave12 and search workflow policy;\n- sitemap normalization and public-surface regression scripts;\n- pastor-series visual-parity audit logic.\n\nNo file in the Karty/Ishod data plane, Vosk evidence, genealogy evidence or AuditRepo matrix/evidence corpus changed. This is a path-impact carry-forward only; browser/runtime and production authority are not inferred from it.\n'''
    text = replace_once(text, "\n## Boundary\n", addition + "\n## Boundary\n", "reverify delta section")
    write(REVERIFY, text)


def main() -> int:
    update_matrix()
    update_next()
    update_reverify()
    print("third-pass authority refresh staged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
