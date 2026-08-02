#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
LIB = ROOT / "scripts" / "matrix_coverage_lib.py"
TEST = ROOT / "scripts" / "matrix_coverage_regression_test.py"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-08-02_69d1e72a_third-pass-gate-hardening.md"

AUDIT_HEAD = "69d1e72a8b59faafe1e68bd89704cf6fb8cda424"
SOURCE_ANCHOR = "fc1085c805d72e6d43f58a6383c680d4e886183b"
SOURCE_TIP = "6cfa7468e033ed44dac79b9752b127f406d33724"
OWNER_HEAD = "a231a5005f92d5f1e677ea87ece8bfb6a9dc31d7"
PRODUCTION = "abf1edba190280e554dfda085bef9fb6594c896d"
REVERIFY_REL = "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_69d1e72a_third-pass-gate-hardening.md"


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: pathlib.Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one occurrence, got {count}")
    return text.replace(old, new, 1)


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    start_index = text.find(start)
    if start_index < 0:
        raise RuntimeError(f"{label}: start marker missing")
    end_index = text.find(end, start_index + len(start))
    if end_index < 0:
        raise RuntimeError(f"{label}: end marker missing")
    return text[:start_index] + replacement.rstrip() + "\n\n" + text[end_index:]


def update_library() -> None:
    text = read(LIB)

    duplicate_hook = '''def reject_duplicate_json_keys(pairs: list[tuple[str, object]]) -> dict[str, object]:
    """Reject silent JSON object-key overwrites at every nesting level."""
    result: dict[str, object] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate JSON key {key!r}")
        result[key] = value
    return result
'''
    text = replace_once(
        text,
        "\ndef load_aliases(\n",
        "\n" + duplicate_hook + "\ndef load_aliases(\n",
        "strict JSON hook",
    )
    text = replace_once(
        text,
        '    data = json.loads(path.read_text(encoding="utf-8"))\n',
        '    data = json.loads(\n        path.read_text(encoding="utf-8"),\n        object_pairs_hook=reject_duplicate_json_keys,\n    )\n',
        "strict alias JSON load",
    )

    integrity = r'''def matrix_integrity_problems(
    matrix: str,
    matrix_rows: dict[str, MatrixRow],
) -> list[str]:
    """Validate canonical section shape, status semantics and all declared counters."""
    problems: list[str] = []
    section = ""
    declared_counts: dict[str, int] = {}
    actual_counts: collections.Counter[str] = collections.Counter()
    seen_section_keys: set[str] = set()
    statistics_rows: dict[str, list[tuple[int, str]]] = collections.defaultdict(list)

    for line_no, line in enumerate(matrix.splitlines(), 1):
        if line.startswith("## "):
            section = line[3:].strip()
            if is_canonical_section(section):
                section_key = re.sub(r"\s*\(\d+\)\s*$", "", section)
                if section_key in seen_section_keys:
                    problems.append(
                        f"SECTION-DUPLICATE: canonical section {section_key!r} appears more than once"
                    )
                seen_section_keys.add(section_key)

                is_closed = "ЗАКРЫТО" in section
                is_open = any(marker in section for marker in OPEN_SECTION_MARKERS)
                if is_closed and is_open:
                    problems.append(
                        f"SECTION-STATUS-AMBIGUOUS: canonical section {section!r} is both open and closed"
                    )

                match = re.search(r"\((\d+)\)\s*$", section)
                if match:
                    declared_counts[section] = int(match.group(1))
                else:
                    problems.append(
                        f"SECTION-COUNT-MISSING: canonical section {section!r} has no trailing count"
                    )
            continue

        cells = parse_table_cells(line)
        if section.startswith("Статистика") and cells and cells[0] not in HEADER_IDS:
            label = cells[0].strip().strip("*").strip()
            value = cells[1].strip().strip("*").strip() if len(cells) > 1 else ""
            statistics_rows[label].append((line_no, value))
            continue

        if not is_canonical_section(section) or not cells or cells[0] in HEADER_IDS:
            continue
        finding_id = cells[0]
        if not is_finding_id(finding_id):
            problems.append(
                f"NONCANONICAL-MATRIX-ID: canonical section {section!r} line {line_no} "
                f"uses invalid table ID {finding_id!r}"
            )
            continue
        actual_counts[section] += 1
        description = cells[1] if len(cells) > 1 else ""
        if any(marker in section for marker in OPEN_SECTION_MARKERS) and re.match(
            r"^\s*(?:✅\s*)?(?:\*\*)?\s*(?:CLOSED|FIXED|ЗАКРЫТ(?:О|А|Ы)?)\b",
            description,
            re.IGNORECASE,
        ):
            problems.append(
                f"CLOSED-IN-OPEN: {finding_id} is explicitly closed in open section "
                f"{section!r} at line {line_no}"
            )

    for counted_section, expected in declared_counts.items():
        actual = actual_counts[counted_section]
        if actual != expected:
            problems.append(
                f"SECTION-COUNT-MISMATCH: {counted_section!r} declares {expected} "
                f"but contains {actual} canonical rows"
            )

    closed_actual = sum("ЗАКРЫТО" in row.section for row in matrix_rows.values())
    open_actual = sum(
        any(marker in row.section for marker in OPEN_SECTION_MARKERS)
        for row in matrix_rows.values()
    )

    def section_total(pattern: str) -> int:
        return sum(
            count for counted_section, count in actual_counts.items()
            if re.search(pattern, counted_section, re.IGNORECASE)
        )

    expected_statistics = {
        "Закрыто (fixed)": closed_actual,
        "P0 открыто": section_total(r"\bP0\b.*ОТКРЫТО"),
        "P1 открыто": section_total(r"\bP1\b.*ОТКРЫТО"),
        "P2 открыто": section_total(r"\bP2\b.*ОТКРЫТО"),
        "P3 открыто": section_total(r"\bP3\b.*ОТКРЫТО"),
        "Рефакторинг": section_total(r"РЕФАКТОРИНГ"),
        "AuditRepo": section_total(r"AUDITREPO"),
        "Всего открыто (матрица)": open_actual,
    }
    for label, expected in expected_statistics.items():
        entries = statistics_rows.get(label, [])
        if not entries:
            problems.append(f"STAT-ROW-MISSING: statistics row {label!r} is absent")
            continue
        if len(entries) > 1:
            lines = ", ".join(str(line_no) for line_no, _ in entries)
            problems.append(
                f"STAT-ROW-DUPLICATE: statistics row {label!r} appears at lines {lines}"
            )
            continue
        line_no, value = entries[0]
        if not re.fullmatch(r"\d+", value):
            problems.append(
                f"STAT-VALUE-INVALID: statistics row {label!r} at line {line_no} "
                f"has non-numeric value {value!r}"
            )
            continue
        if int(value) != expected:
            problems.append(
                f"STAT-COUNT-MISMATCH: statistics row {label!r} declares {value} "
                f"but matrix contains {expected}"
            )
    return problems
'''
    text = replace_between(
        text,
        "def matrix_integrity_problems(\n",
        "def candidate_is_credible(\n",
        integrity,
        "matrix integrity function",
    )

    witness = r'''def row_direct_witness(row: MatrixRow, project: pathlib.Path) -> tuple[bool, list[str]]:
    problems: list[str] = []
    paths = list(dict.fromkeys(match.group("path") for match in PATH_RE.finditer(row.line)))
    active_existing_paths = 0
    for relative in paths:
        candidate = project / relative
        if not candidate.is_file():
            problems.append(
                f"BROKEN-EVIDENCE-PATH: open bug {row.finding_id} "
                f"references missing {relative}"
            )
            continue
        if relative.startswith("archive/"):
            continue
        active_existing_paths += 1
    immutable_witness = any(
        FULL_SHA_RE.fullmatch(match.group("sha"))
        for match in WITNESS_RE.finditer(row.line)
    )
    return bool(active_existing_paths or immutable_witness), problems
'''
    text = replace_between(
        text,
        "def row_direct_witness(\n",
        "def build_report(\n",
        witness,
        "direct witness function",
    )
    text = replace_once(
        text,
        "        if finding_id in canonical_archive:\n            archived_only.append(finding_id)\n            continue\n",
        "        if finding_id in canonical_archive:\n            archived_only.append(finding_id)\n            problems.append(\n                f\"ARCHIVED-ONLY-OPEN: open bug {finding_id} is supported only by archived evidence\"\n            )\n            continue\n",
        "archive-only blocking",
    )
    text = replace_once(
        text,
        '        "openRows": len(open_ids),\n',
        '        "closedRows": len(closed_rows),\n        "openRows": len(open_ids),\n',
        "closed row report count",
    )
    text = replace_once(
        text,
        '        "matrix: {matrixIds} canonical ids, {openRows} open rows; "\n',
        '        "matrix: {matrixIds} canonical ids, {closedRows} closed rows, "\n        "{openRows} open rows; "\n',
        "coverage console counts",
    )
    write(LIB, text)


def update_tests() -> None:
    text = read(TEST)
    old_matrix = '''| OPEN-ONE | open | reverify/known.md |
"""
'''
    new_matrix = '''| OPEN-ONE | open | reverify/known.md |

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
'''
    text = replace_once(text, old_matrix, new_matrix, "test matrix statistics")
    text = replace_once(
        text,
        '        assert report["registryIds"] == 4\n',
        '        assert report["closedRows"] == 1\n        assert report["openRows"] == 1\n        assert report["registryIds"] == 4\n',
        "base count assertions",
    )
    insertion = r'''
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
'''
    text = replace_once(
        text,
        '    print("matrix coverage regression tests: PASS")\n',
        insertion + '\n    print("matrix coverage regression tests: PASS")\n',
        "new regression fixtures",
    )
    write(TEST, text)


def update_operational_docs() -> None:
    matrix = read(MATRIX)
    matrix = re.sub(
        r"^\| Source verification anchor \|.*$",
        f"| Source verification anchor | `{SOURCE_ANCHOR}` (durable product/evidence anchor verified by PR #121; former canonical `efaf2a51` is 65 commits behind). Source `main` is now exactly `{SOURCE_TIP}` after four workflow/control-plane-only commits; no product or matrix-evidence path changed. |",
        matrix,
        count=1,
        flags=re.MULTILINE,
    )
    matrix = re.sub(
        r"^\| Last reverify \|.*$",
        f"| Last reverify | `{REVERIFY_REL}` |",
        matrix,
        count=1,
        flags=re.MULTILINE,
    )
    matrix = re.sub(
        r"^⚠️ Deploy-формулировки.*$",
        f"⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. Verified product/evidence anchor = `{SOURCE_ANCHOR}`; current source `main` observed exactly at `{SOURCE_TIP}`; last exact production authority = `{PRODUCTION}`. The four post-anchor commits only remove completed workflow writers and pin actions in the Pihahiroth/Wave12 release workflows. No product, Karty/Ishod data, Vosk, genealogy or matrix-evidence path changed, so verdicts remain anchored to `{SOURCE_ANCHOR}`. Any later status change requires a new exact-head reverify. Active source owner: draft PR #680 at `{OWNER_HEAD}`; не вмешиваться в его ветку. Evidence: `{REVERIFY_REL}`.",
        matrix,
        count=1,
        flags=re.MULTILINE,
    )
    session = f'''## Session log (append-only)

### 2026-08-02 — third independent AuditRepo gate pass @ `{AUDIT_HEAD[:8]}`
- Re-read `AuditRepo/main` and source `main`: AuditRepo remained exactly `{AUDIT_HEAD}`; source remained exactly `{SOURCE_TIP}`.
- Preserved matrix arithmetic: **358 canonical = 168 closed + 190 open**; no status was changed without new product evidence.
- Refreshed operational authority from the intermediate source observation to exact `{SOURCE_TIP}` and active NoteRegistry head `{OWNER_HEAD}`.
- Hardened coverage so a canonical section cannot omit its counter, statistics rows cannot be missing/duplicated/non-numeric or drift per category, archive-only open evidence is blocking, and duplicate JSON registry keys are rejected.
- Expanded closed-in-open detection beyond the exact emoji spelling and exposed closed-row totals in machine output.
- Exact evidence and boundary: `{REVERIFY_REL}`.
'''
    matrix = replace_once(matrix, "## Session log (append-only)\n", session, "matrix session log")
    write(MATRIX, matrix)

    next_text = read(NEXT)
    next_text = re.sub(
        r"^\*\*Source main observed after anchor:\*\*.*$",
        f"**Source main observed after anchor:** `{SOURCE_TIP}` (four workflow/control-plane-only commits after the anchor)",
        next_text,
        count=1,
        flags=re.MULTILINE,
    )
    next_text = re.sub(
        r"^\*\*Current reverify:\*\*.*$",
        f"**Current reverify:** `{REVERIFY_REL}`",
        next_text,
        count=1,
        flags=re.MULTILINE,
    )
    next_text = re.sub(
        r"^- two later commits through `f9234dbb`.*$",
        f"- four later commits through `{SOURCE_TIP[:8]}` only remove completed workflow writers and pin actions in the Pihahiroth/Wave12 release workflows; they do not change product, Karty/Ishod data or matrix evidence;",
        next_text,
        count=1,
        flags=re.MULTILINE,
    )
    next_text = re.sub(
        r"^- active source owner: draft PR #680 at `[^`]+`;.*$",
        f"- active source owner: draft PR #680 at `{OWNER_HEAD}`; do not modify its branch or owner files;",
        next_text,
        count=1,
        flags=re.MULTILINE,
    )
    next_text = replace_once(
        next_text,
        "source main later observed = f9234dbbe832d80b4d9a453ce3d2f58da832b24f",
        f"source main later observed = {SOURCE_TIP}",
        "NEXT source code block",
    )
    next_text = replace_once(
        next_text,
        "- noncanonical table IDs, explicit CLOSED rows in open sections, heading/stat counter drift and unregistered reverify IDs are permanent blocking diagnostics.",
        "- noncanonical table IDs, explicit closed rows in open sections, missing/duplicate section or statistics counters, per-category drift, archive-only open evidence, duplicate registry keys and unregistered reverify IDs are permanent blocking diagnostics.",
        "NEXT gate summary",
    )
    write(NEXT, next_text)

    note = f'''# Third independent matrix and AuditRepo gate pass — 2026-08-02

**AuditRepo exact main:** `{AUDIT_HEAD}`
**Verified product/evidence anchor:** `{SOURCE_ANCHOR}`
**Exact source main observed:** `{SOURCE_TIP}`
**Active source owner:** draft PR #680 at `{OWNER_HEAD}`
**Last exact production:** `{PRODUCTION}`
**Production claim:** none

## Revalidation result

The canonical matrix remains **358 IDs = 168 closed + 190 open**. The source repository has not changed since the prior post-merge observation. The four commits after the durable product/evidence anchor modify workflow/control-plane files only, so no product verdict is promoted or closed in this pass.

The operational owner reference was stale: PR #680 advanced to `{OWNER_HEAD}`. The matrix and NEXT handoff now record that exact head while preserving the instruction not to modify the owner branch.

## Newly confirmed control-plane gaps

A third independent read of the coverage engine found bypasses that could still produce a green result:

- removing the numeric suffix from a canonical section heading disabled that section's count comparison;
- deleting a required statistics row disabled that statistic's comparison;
- per-category statistics could drift while the total open count remained correct;
- an open finding supported only by archived evidence was measured but not blocking;
- duplicate keys in the JSON evidence registry were silently overwritten by the standard parser;
- closed-in-open detection depended on one exact emoji-plus-English spelling.

## Permanent hardening

The coverage engine now requires one numeric count on every canonical section, exactly one numeric statistics row for closed/P0/P1/P2/P3/refactoring/AuditRepo/total-open, and exact agreement with physical rows. Archive-only evidence for an open finding is blocking. Registry JSON rejects duplicate keys at every object level. Closed status detection accepts the supported English and Russian status forms at the beginning of an open-row description. Machine output now reports both closed and open row totals.

Regression fixtures exercise every new gate. Exact-head CI, repository structure validation, evidence coverage and repository-history forensic checks are required before merge.

## Boundary

No product source, Research corpus, matrix status, canonical count or production artifact is changed by this transaction. Only AuditRepo governance, operational authority pointers and regression coverage are updated.
'''
    write(REVERIFY, note)


def main() -> int:
    update_library()
    update_tests()
    update_operational_docs()
    print("third-pass matrix hardening staged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
