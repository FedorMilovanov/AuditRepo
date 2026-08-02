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

## Статистика

| Категория | Количество |
|---|---|
| Закрыто (fixed) | 1 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 0 |
| P3 открыто | 0 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **1** |
"""


def write_project(
    root: pathlib.Path,
    entries: dict[str, object],
    ignored=None,
    matrix: str = MATRIX,
) -> pathlib.Path:
    project = root / "project"
    for directory in ("verified", "reverify", "incoming", "working", "archive"):
        (project / directory).mkdir(parents=True, exist_ok=True)
    (project / "verified" / "MASTER_BUG_MATRIX.md").write_text(
        matrix, encoding="utf-8"
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
        assert report["closedRows"] == 1
        assert report["openRows"] == 1
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


    with tempfile.TemporaryDirectory() as temp:
        malformed_matrix = MATRIX.replace(
            "| FIXED-ONE | closed | `abcdef1` |",
            "| FIXED-ONE/TWO | closed | `abcdef1` |",
        )
        project = write_project(pathlib.Path(temp), entries, matrix=malformed_matrix)
        report = build_report(project)
        assert report["problemKinds"]["NONCANONICAL-MATRIX-ID"] == 1
        assert report["problemKinds"]["SECTION-COUNT-MISMATCH"] == 1

    with tempfile.TemporaryDirectory() as temp:
        closed_in_open = MATRIX.replace(
            "| OPEN-ONE | open | reverify/known.md |",
            "| OPEN-ONE | ✅ **CLOSED 2026-08-02** | reverify/known.md |",
        )
        project = write_project(pathlib.Path(temp), entries, matrix=closed_in_open)
        report = build_report(project)
        assert report["problemKinds"]["CLOSED-IN-OPEN"] == 1

    with tempfile.TemporaryDirectory() as temp:
        bad_count = MATRIX.replace("## P1 — ОТКРЫТО (1)", "## P1 — ОТКРЫТО (2)")
        project = write_project(pathlib.Path(temp), entries, matrix=bad_count)
        report = build_report(project)
        assert report["problemKinds"]["SECTION-COUNT-MISMATCH"] == 1


    with tempfile.TemporaryDirectory() as temp:
        missing_count = MATRIX.replace("## P1 — ОТКРЫТО (1)", "## P1 — ОТКРЫТО")
        project = write_project(pathlib.Path(temp), entries, matrix=missing_count)
        report = build_report(project)
        assert report["problemKinds"]["SECTION-COUNT-MISSING"] == 1

    with tempfile.TemporaryDirectory() as temp:
        missing_stat = MATRIX.replace("| P1 открыто | 1 |\n", "")
        project = write_project(pathlib.Path(temp), entries, matrix=missing_stat)
        report = build_report(project)
        assert report["problemKinds"]["STAT-ROW-MISSING"] == 1

    with tempfile.TemporaryDirectory() as temp:
        duplicate_stat = MATRIX.replace(
            "| P1 открыто | 1 |\n",
            "| P1 открыто | 1 |\n| P1 открыто | 1 |\n",
        )
        project = write_project(pathlib.Path(temp), entries, matrix=duplicate_stat)
        report = build_report(project)
        assert report["problemKinds"]["STAT-ROW-DUPLICATE"] == 1

    with tempfile.TemporaryDirectory() as temp:
        category_drift = MATRIX.replace("| P1 открыто | 1 |", "| P1 открыто | 0 |")
        project = write_project(pathlib.Path(temp), entries, matrix=category_drift)
        report = build_report(project)
        assert report["problemKinds"]["STAT-COUNT-MISMATCH"] == 1

    with tempfile.TemporaryDirectory() as temp:
        fixed_without_emoji = MATRIX.replace(
            "| OPEN-ONE | open | reverify/known.md |",
            "| OPEN-ONE | **FIXED 2026-08-02** | reverify/known.md |",
        )
        project = write_project(pathlib.Path(temp), entries, matrix=fixed_without_emoji)
        report = build_report(project)
        assert report["problemKinds"]["CLOSED-IN-OPEN"] == 1

    with tempfile.TemporaryDirectory() as temp:
        fixed = dict(entries)
        fixed["NEW-UNREGISTERED-01"] = {
            "status": "informational",
            "reason": "Test-only evidence label.",
        }
        archived_matrix = MATRIX.replace(
            "| OPEN-ONE | open | reverify/known.md |",
            "| OPEN-ONE | open | archive/old.md |",
        )
        project = write_project(pathlib.Path(temp), fixed, matrix=archived_matrix)
        (project / "reverify" / "known.md").unlink()
        (project / "archive" / "old.md").write_text(
            "# OPEN-ONE — historical witness\n", encoding="utf-8"
        )
        report = build_report(project)
        assert report["archivedOnlyOpenRows"] == 1
        assert report["problemKinds"]["ARCHIVED-ONLY-OPEN"] == 1

    with tempfile.TemporaryDirectory() as temp:
        project = write_project(pathlib.Path(temp), entries)
        (project / "verified" / "MATRIX_ID_ALIASES.json").write_text(
            '{"version":1,"aliases":{"INFO-ONE":{"status":"informational","reason":"a"},'
            '"INFO-ONE":{"status":"retired","reason":"b"}},"ignoredTokens":[]}\n',
            encoding="utf-8",
        )
        expect_value_error(project, "duplicate JSON key")

    print("matrix coverage regression tests: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
