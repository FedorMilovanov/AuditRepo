#!/usr/bin/env python3

from pathlib import Path

# Synchronize-only exact-match materializer; it deletes itself before publish.
ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_counter-home-residual.md"


def replace_exact(path: Path, replacements: list[tuple[str, str]]) -> None:
    text = path.read_text(encoding="utf-8")
    for old, new in replacements:
        count = text.count(old)
        if count != 1:
            raise RuntimeError(f"{path}: expected exactly one match, found {count}: {old}")
        text = text.replace(old, new, 1)
    path.write_text(text, encoding="utf-8")


replace_exact(
    MATRIX,
    [
        (
            "issue #299 is reopened for the narrower lifecycle/shortcut evidence residual owned by PR #361.",
            "issue #299 is reopened for the narrower lifecycle/shortcut evidence residual owned by clean PR #365; staging PR #361 is superseded and closed without merge.",
        ),
        (
            "| `31758828` PR#338; reopened residual PR#361 |",
            "| `31758828` PR#338; residual PR#365; #361 superseded staging |",
        ),
        (
            "merged #348 provenance, active test-only owner #361, successful trusted replay",
            "merged #348 provenance, active test-only owner #365, successful trusted replay",
        ),
        (
            "PR #361 is the sole owner and may change only the existing Runtime Interactive Audit workflow plus one permanent lifecycle contract script.",
            "Clean PR #365 is the sole owner and may change only the existing Runtime Interactive Audit workflow plus one permanent lifecycle contract script; staging PR #361 is closed without merge.",
        ),
        (
            "| issue #299 reopened; PR #361; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_counter-home-residual.md` |",
            "| issue #299 reopened; PR #365; #361 superseded staging; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_9407cc92_counter-home-residual.md` |",
        ),
        (
            "under sole test-only PR #361; the broad #338 contract remains accepted.",
            "under sole clean test-only PR #365; staging PR #361 is superseded and closed without merge, while the broad #338 contract remains accepted.",
        ),
    ],
)

replace_exact(
    REVERIFY,
    [
        (
            "Active PR #361 owns exactly:",
            "Clean PR #365 owns exactly; superseded staging PR #361 is closed without merge:",
        ),
        (
            "PR #361 is test-only and owns only `.github/workflows/interactive-audit.yml` plus `scripts/home-browser-lifecycle-contract.mjs`.",
            "PR #365 is test-only and owns only `.github/workflows/interactive-audit.yml` plus `scripts/home-browser-lifecycle-contract.mjs`; PR #361 is retained only as superseded staging history.",
        ),
        (
            "register only the reopened #299 residual as P1 under #361;",
            "register only the reopened #299 residual as P1 under clean owner #365, with #361 recorded as superseded staging;",
        ),
    ],
)

Path(__file__).unlink()
