#!/usr/bin/env python3
"""Black-box regressions for compact MASTER and evidence coverage semantics."""

from __future__ import annotations

import json
import pathlib
import tempfile

from matrix_coverage_lib import build_report

MATRIX = """# MASTER

## Current state

| Поле | Значение |
|---|---|
| Active work units | **4** |
| Direct current defects | **1** |
| Verified necessary improvements | **1** |
| Narrowed residuals | **1** |
| System verification lanes | **1** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 1

| ID | Current problem | Evidence |
|---|---|---|
| `OPEN-ONE` | current defect | verification/current.md |

## VERIFIED NECESSARY IMPROVEMENTS — 1

| ID | Needed implementation | Evidence |
|---|---|---|
| `IMPROVE-ONE` | verified necessary capability | verification/current.md |

## NARROWED RESIDUALS — 1

| ID | Current residual | Evidence |
|---|---|---|
| `RESIDUAL-ONE` | bounded remainder | verification/current.md |

## SYSTEM VERIFICATION LANES — 1

| ID | Verified work package | Evidence |
|---|---|---|
| `SYS-ROOT-ONE` | shared root package | verification/current.md |

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|
"""


def write_project(
    root: pathlib.Path,
    entries: dict[str, object],
    ignored=None,
    matrix: str = MATRIX,
) -> pathlib.Path:
    project = root / "project"
    for directory in (
        "verified", "verification", "reverify", "incoming", "working", "legacy", "archive"
    ):
        (project / directory).mkdir(parents=True, exist_ok=True)
    (project / "verified" / "MASTER_BUG_MATRIX.md").write_text(matrix, encoding="utf-8")
    (project / "verified" / "MATRIX_ID_ALIASES.json").write_text(
        json.dumps(
            {"version": 1, "aliases": entries, "ignoredTokens": ignored or []},
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    (project / "verification" / "current.md").write_text(
        "# Current verification\n\n"
        "`OPEN-ONE` `IMPROVE-ONE` `RESIDUAL-ONE` `SYS-ROOT-ONE`\n",
        encoding="utf-8",
    )
    (project / "reverify" / "unknown.md").write_text(
        "# NEW-UNREGISTERED-01 — historical evidence-only finding\n", encoding="utf-8"
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
            "reason": "Context label, not active work.",
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
        assert report["closedRows"] == 0
        assert report["openRows"] == 4
        assert report["registryIds"] == 4
        assert report["aliasIds"] == 1
        assert report["registryStatusCounts"] == {
            "alias": 1,
            "retired": 1,
            "informational": 1,
            "false-positive": 1,
        }
        assert report["problems"] == 0
        assert report["evidenceOnlyIds"] == 1
        assert report["evidenceOnlyIdList"] == ["NEW-UNREGISTERED-01"]

    with tempfile.TemporaryDirectory() as temp:
        fixed = dict(entries)
        fixed["NEW-UNREGISTERED-01"] = {
            "status": "informational",
            "reason": "Test-only evidence label.",
        }
        project = write_project(pathlib.Path(temp), fixed)
        report = build_report(project)
        assert report["problems"] == 0
        assert report["registryIds"] == 5
        assert report["evidenceOnlyIds"] == 0

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
        malformed = MATRIX.replace("`IMPROVE-ONE`", "`IMPROVE-ONE/TWO`", 1)
        project = write_project(pathlib.Path(temp), entries, matrix=malformed)
        report = build_report(project)
        assert report["problemKinds"]["NONCANONICAL-MATRIX-ID"] == 1
        assert report["problemKinds"]["SECTION-COUNT-MISMATCH"] == 1
        # Removing the sole valid improvement row drifts both the total active
        # count and the dedicated improvement count. The regression must prove
        # both counters fail closed rather than treating one as redundant.
        assert report["problemKinds"]["STATE-COUNT-MISMATCH"] == 2

    with tempfile.TemporaryDirectory() as temp:
        closed_in_active = MATRIX.replace(
            "| `OPEN-ONE` | current defect | verification/current.md |",
            "| `OPEN-ONE` | ✅ **CLOSED 2026-08-07** | verification/current.md |",
        )
        project = write_project(pathlib.Path(temp), entries, matrix=closed_in_active)
        report = build_report(project)
        assert report["problemKinds"]["CLOSED-IN-ACTIVE"] == 1

    with tempfile.TemporaryDirectory() as temp:
        bad_section_count = MATRIX.replace("## CURRENT DEFECTS — 1", "## CURRENT DEFECTS — 2")
        project = write_project(pathlib.Path(temp), entries, matrix=bad_section_count)
        report = build_report(project)
        assert report["problemKinds"]["SECTION-COUNT-MISMATCH"] == 1

    with tempfile.TemporaryDirectory() as temp:
        bad_state_count = MATRIX.replace(
            "| Active work units | **4** |", "| Active work units | **5** |"
        )
        project = write_project(pathlib.Path(temp), entries, matrix=bad_state_count)
        report = build_report(project)
        assert report["problemKinds"]["STATE-COUNT-MISMATCH"] == 1

    with tempfile.TemporaryDirectory() as temp:
        missing_state = MATRIX.replace("| System verification lanes | **1** |\n", "")
        project = write_project(pathlib.Path(temp), entries, matrix=missing_state)
        report = build_report(project)
        assert report["problemKinds"]["STATE-ROW-MISSING"] == 1

    with tempfile.TemporaryDirectory() as temp:
        retired_from_master = MATRIX.replace(
            "## CURRENT DEFECTS — 1\n\n| ID | Current problem | Evidence |\n|---|---|---|\n"
            "| `OPEN-ONE` | current defect | verification/current.md |\n",
            "## CURRENT DEFECTS — 0\n\n| ID | Current problem | Evidence |\n|---|---|---|\n",
        ).replace("| Active work units | **4** |", "| Active work units | **3** |").replace(
            "| Direct current defects | **1** |", "| Direct current defects | **0** |"
        )
        project = write_project(pathlib.Path(temp), entries, matrix=retired_from_master)
        (project / "legacy" / "retired.md").write_text(
            "# Retirement\n\n`OPEN-ONE` — fixed and removed from MASTER.\n", encoding="utf-8"
        )
        report = build_report(project)
        assert "OPEN-ONE" not in report["historicalOnlyIds"]
        assert report["openRows"] == 3

    with tempfile.TemporaryDirectory() as temp:
        fixed = dict(entries)
        fixed["NEW-UNREGISTERED-01"] = {
            "status": "informational",
            "reason": "Test-only evidence label.",
        }
        project = write_project(pathlib.Path(temp), fixed)
        (project / "verification" / "current.md").unlink()
        (project / "legacy" / "old.md").write_text(
            "# Historical witness\n\n`OPEN-ONE` `IMPROVE-ONE` `RESIDUAL-ONE` `SYS-ROOT-ONE`\n",
            encoding="utf-8",
        )
        report = build_report(project)
        assert report["historicalOnlyOpenRows"] == 4
        assert report["problemKinds"]["LEGACY-ONLY-ACTIVE"] == 4

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