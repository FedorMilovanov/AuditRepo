#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"


def main() -> int:
    text = MATRIX.read_text(encoding="utf-8")

    deploy_pattern = re.compile(r"^\| Deploy \|.*\|$", re.MULTILINE)
    matches = deploy_pattern.findall(text)
    if len(matches) != 1:
        raise RuntimeError(f"Deploy row count: {len(matches)}")
    replacement = (
        "| Deploy | ⚠️ **FINDING-DISPOSITION ANCHOR ≠ PRODUCTION.** Last exact production "
        "authority remains run `30669840189` attempt `1`, release/control SHA "
        "`abf1edba190280e554dfda085bef9fb6594c896d`, candidate "
        "`abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`, release digest "
        "`sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`. "
        "Closure anchor `3aba5112f0fc37712e027a1ad1d8379debe54377` has no same-SHA production "
        "witness and this verifier-only wave makes no production claim. |"
    )
    text = deploy_pattern.sub(replacement, text, count=1)

    old_map14 = (
        "| MAP-P1-14 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Shared "
        "MapEngine CSS is protected by a bounded lease; destroying one instance removes "
        "per-instance state and cannot strip styles from another live map. Closed by source "
        "PR #709 and preserved through `3aba5112`. | `8bd891b1` |"
    )
    new_map14 = (
        "| MAP-P1-14 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** "
        "`_cleanupAll()` removes every tracked listener with `removeEventListener`, clears timers, "
        "and releases shared MapEngine CSS only after the final active lease; destroying one "
        "instance cannot leak its keydown handlers or strip styles from another live map. Closed "
        "by source PR #709 and preserved through `3aba5112`. | `8bd891b1` |"
    )
    if text.count(old_map14) != 1:
        raise RuntimeError(f"MAP-P1-14 closed row count: {text.count(old_map14)}")
    text = text.replace(old_map14, new_map14, 1)

    MATRIX.write_text(text, encoding="utf-8")

    sys.path.insert(0, str(ROOT / "scripts"))
    from matrix_coverage_lib import build_report  # type: ignore

    report = build_report(PROJECT)
    expected = {
        "matrixIds": 358,
        "closedRows": 183,
        "openRows": 175,
        "problems": 0,
        "archivedOnlyOpenRows": 0,
    }
    for key, value in expected.items():
        if report.get(key) != value:
            raise RuntimeError(f"{key}: expected {value}, got {report.get(key)}")

    print("V1 masthead and MAP-P1-14 evidence reconciled")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
