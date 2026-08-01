#!/usr/bin/env python3
"""Black-box regressions for matrix registry and evidence coverage semantics."""

from __future__ import annotations

import json
import pathlib
import tempfile

from matrix_coverage_contexts import collect_contexts
from matrix_coverage_lib import build_report

MATRIX = """# matrix

## ✅ ЗАКРЫТО (1)

| ID | Описание | Коммит |
|---|---|---|
| FIXED-ONE | closed | `abcdef1` |

## P1 — ОТКРЫТО (1)

| ID | Описание | Evidence |
|---|---|---|
| OPEN-ONE | open | reverify/known.md |
"""


def write_project(root: pathlib.Path, entries: dict[str, object], ignored=None) -> pathlib.Path:
    project = root / "project"
    for directory in ("verified", "reverify", "incoming", "working", "archive"):
        (project / directory).mkdir(parents=True, exist_ok=True)
    (project / "verified" / "MASTER_BUG_MATRIX.md").write_text(
        MATRIX, encoding="utf-8"
    )
    (project / "verified" / "MATRIX_ID_ALIASES.json").write_text(
        json.dumps(
            {"version": 1, "aliases": entries, "ignoredTokens": ignored or []},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (project / "reverify" / "known.md").write_text(
        "# OPEN-ONE — witness\n", encoding="utf-8"
    )
    (project / "reverify" / "unknown.md").write_text(
        "# NEW-UNREGISTERED-01 — exact finding\n", encoding="utf-8"
    )
    return project


def expect_value_error(project: pathlib.Path, needle: str) -> None:
    try:
        build_report(project)
    except ValueError as error:
        assert needle in str(error), (needle, str(error))
    else:
        raise AssertionError(f"expected ValueError containing {needle!r}")


def main() -> int:
    entries = {
        "ALIAS-ONE": {
            "status": "alias",
            "canonical": "OPEN-ONE",
            "reason": "Same verified root cause.",
        },
        "INFO-ONE": {
            "status": "informational",
            "reason": "Context label, not an active finding.",
        },
        "RETIRED-ONE": {
            "status": "retired",
            "reason": "Historical finding superseded by current source.",
        },
        "FALSE-ONE": {
            "status": "false-positive",
            "reason": "Current source disproves the claim.",
        },
    }

    with tempfile.TemporaryDirectory() as temp:
        project = write_project(pathlib.Path(temp), entries)
        report = build_report(project)
        assert report["registryIds"] == 4
        assert report["aliasIds"] == 1
        assert report["registryStatusCounts"] == {
            "alias": 1,
            "retired": 1,
            "informational": 1,
            "false-positive": 1,
        }
        assert report["problemKinds"] == {"UNREGISTERED-EVIDENCE": 1}
        unresolved = report["unregisteredEvidence"]
        assert unresolved[0]["id"] == "NEW-UNREGISTERED-01"
        occurrence = unresolved[0]["occurrences"][0]
        assert occurrence["file"] == "reverify/unknown.md"
        assert occurrence["lines"] == [1]
        assert occurrence["contexts"] == ["heading"]

        contexts = collect_contexts(project, radius=0)
        exact = contexts["contexts"]["NEW-UNREGISTERED-01"][0]
        assert exact["line"] == 1
        assert exact["structuralContexts"] == ["heading"]
        assert exact["context"] == "1: # NEW-UNREGISTERED-01 — exact finding"

    with tempfile.TemporaryDirectory() as temp:
        fixed = dict(entries)
        fixed["NEW-UNREGISTERED-01"] = {
            "status": "informational",
            "reason": "Rights-policy label, not a product defect.",
        }
        project = write_project(pathlib.Path(temp), fixed)
        report = build_report(project)
        assert report["problems"] == 0
        assert report["registryIds"] == 5
        assert report["aliasIds"] == 1

    with tempfile.TemporaryDirectory() as temp:
        broken = dict(entries)
        broken["BROKEN-INFO"] = {"status": "informational"}
        project = write_project(pathlib.Path(temp), broken)
        expect_value_error(project, "requires a non-empty reason")

    with tempfile.TemporaryDirectory() as temp:
        broken = dict(entries)
        broken["BROKEN-INFO"] = {
            "status": "informational",
            "canonical": "OPEN-ONE",
            "reason": "Invalid suppression shape.",
        }
        project = write_project(pathlib.Path(temp), broken)
        expect_value_error(project, "must not declare canonical")

    with tempfile.TemporaryDirectory() as temp:
        project = write_project(pathlib.Path(temp), entries, ignored=["HIDDEN-FINDING-01"])
        expect_value_error(project, "must use a reasoned registry entry")

    print("matrix coverage regression tests: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
