#!/usr/bin/env python3
"""Canonical matrix/evidence coverage engine.

The engine treats active matrix tables as the only canonical finding registry,
keeps historical logs as evidence, and distinguishes explicit finding IDs from
ordinary hyphenated prose without a hardcoded prefix allowlist.
"""

from __future__ import annotations

import argparse
import collections
import json
import pathlib
import re
from dataclasses import dataclass
from typing import Iterable

ID_BODY = r"[A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)+"
TOKEN_RE = re.compile(rf"(?<![A-Za-z0-9-])({ID_BODY})(?![A-Za-z0-9-])")
EXACT_ID_RE = re.compile(rf"^{ID_BODY}$")
UPPER_ID_RE = re.compile(r"^[A-Z0-9]+(?:-[A-Z0-9]+)+$")
SHA_RE = re.compile(r"^[0-9a-f]{7,10}$")
FULL_SHA_RE = re.compile(r"^[0-9a-f]{7,40}$")
NON_SHA_OK = {"V3", "V2", "V1", "BY-DESIGN"}
LEXICAL_NON_FINDINGS = {"SHA-256"}
REGISTRY_STATUSES = ("alias", "retired", "informational", "false-positive")
PATH_RE = re.compile(
    r"(?P<path>(?:reverify|incoming|working|archive)/[^`|\s)]+?\.md)"
)
WITNESS_RE = re.compile(
    r"\bverified-(?:source|browser|ci|build)\b[^|\n]{0,180}?"
    r"(?P<sha>[0-9a-f]{7,40})\b",
    re.IGNORECASE,
)
CANONICAL_SECTION_MARKERS = ("ЗАКРЫТО", "ОТКРЫТО", "РЕФАКТОРИНГ", "AUDITREPO")
OPEN_SECTION_MARKERS = ("ОТКРЫТО", "РЕФАКТОРИНГ", "AUDITREPO")
HEADER_IDS = {"ID", "Поле", "Категория", "Статус"}


@dataclass(frozen=True)
class MatrixRow:
    finding_id: str
    section: str
    line_no: int
    line: str
    cells: tuple[str, ...]


@dataclass(frozen=True)
class RegistryEntry:
    finding_id: str
    status: str
    canonical: str | None
    reason: str


def parse_table_cells(line: str) -> list[str]:
    if not line.startswith("| ") or line.startswith("|---"):
        return []
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def is_finding_id(value: str) -> bool:
    return bool(EXACT_ID_RE.fullmatch(value or ""))


def read_markdown(paths: Iterable[pathlib.Path]) -> dict[pathlib.Path, str]:
    result: dict[pathlib.Path, str] = {}
    for path in paths:
        if path.is_file() and path.suffix.lower() == ".md":
            result[path] = path.read_text(encoding="utf-8", errors="ignore")
    return result


def is_canonical_section(section: str) -> bool:
    return any(marker in section for marker in CANONICAL_SECTION_MARKERS)


def parse_matrix(matrix: str) -> tuple[dict[str, MatrixRow], set[str], list[MatrixRow]]:
    rows: dict[str, MatrixRow] = {}
    open_ids: set[str] = set()
    closed_rows: list[MatrixRow] = []
    section = ""

    for line_no, line in enumerate(matrix.splitlines(), 1):
        if line.startswith("## "):
            section = line[3:].strip()
            continue
        if not is_canonical_section(section):
            continue
        cells = parse_table_cells(line)
        if not cells or cells[0] in HEADER_IDS:
            continue
        finding_id = cells[0]
        if not is_finding_id(finding_id):
            continue
        row = MatrixRow(finding_id, section, line_no, line, tuple(cells))
        if finding_id in rows:
            raise ValueError(
                f"duplicate canonical matrix ID {finding_id}: "
                f"lines {rows[finding_id].line_no} and {line_no}"
            )
        rows[finding_id] = row
        if any(marker in section for marker in OPEN_SECTION_MARKERS):
            open_ids.add(finding_id)
        if "ЗАКРЫТО" in section:
            closed_rows.append(row)

    return rows, open_ids, closed_rows



def matrix_integrity_problems(
    matrix: str,
    matrix_rows: dict[str, MatrixRow],
) -> list[str]:
    """Validate matrix row shape and human-declared counters before evidence coverage."""
    problems: list[str] = []
    section = ""
    declared_counts: dict[str, int] = {}
    actual_counts: collections.Counter[str] = collections.Counter()

    for line_no, line in enumerate(matrix.splitlines(), 1):
        if line.startswith("## "):
            section = line[3:].strip()
            if is_canonical_section(section):
                match = re.search(r"\((\d+)\)\s*$", section)
                if match:
                    declared_counts[section] = int(match.group(1))
            continue
        if not is_canonical_section(section):
            continue
        cells = parse_table_cells(line)
        if not cells or cells[0] in HEADER_IDS:
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
            r"^\s*✅\s*\**CLOSED\b", description, re.IGNORECASE
        ):
            problems.append(
                f"CLOSED-IN-OPEN: {finding_id} is explicitly CLOSED in open section "
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
    closed_stat = re.search(
        r"^\|\s*Закрыто \(fixed\)\s*\|\s*\**(\d+)\**\s*\|$",
        matrix,
        re.MULTILINE,
    )
    open_stat = re.search(
        r"^\|\s*\**Всего открыто \(матрица\)\**\s*\|\s*\**(\d+)\**\s*\|$",
        matrix,
        re.MULTILINE,
    )
    if closed_stat and int(closed_stat.group(1)) != closed_actual:
        problems.append(
            f"STAT-COUNT-MISMATCH: closed statistic declares {closed_stat.group(1)} "
            f"but matrix contains {closed_actual} closed canonical rows"
        )
    if open_stat and int(open_stat.group(1)) != open_actual:
        problems.append(
            f"STAT-COUNT-MISMATCH: open statistic declares {open_stat.group(1)} "
            f"but matrix contains {open_actual} open canonical rows"
        )
    return problems

def candidate_is_credible(
    token: str,
    contexts: set[str],
    known_ids: set[str],
    canonical_families: set[str],
) -> bool:
    if token in LEXICAL_NON_FINDINGS:
        return False
    if "table-key" in contexts or token in known_ids:
        return True
    if not UPPER_ID_RE.fullmatch(token):
        return False
    segments = token.split("-")
    return (
        any(char.isdigit() for char in token)
        or segments[0] in canonical_families
        or len(segments) >= 3
    )


def structured_id_occurrences(
    text: str,
    known_ids: set[str],
    canonical_families: set[str],
) -> dict[str, dict[str, object]]:
    """Return credible IDs with exact structural contexts and line numbers."""
    found: dict[str, dict[str, object]] = collections.defaultdict(
        lambda: {"contexts": set(), "lines": set()}
    )

    def record(token: str, context: str, line_no: int) -> None:
        found[token]["contexts"].add(context)
        found[token]["lines"].add(line_no)

    for line_no, line in enumerate(text.splitlines(), 1):
        cells = parse_table_cells(line)
        if cells and is_finding_id(cells[0]):
            record(cells[0], "table-key", line_no)

        if re.match(r"^#{1,6}\s+", line):
            for token in TOKEN_RE.findall(line):
                record(token, "heading", line_no)

        label_match = None
        if not re.match(r"^#{1,6}\s+", line):
            label_match = re.match(
                r"^\s*(?:[-*]\s+)?(?P<label>(?:\*\*|`)?[^:—–]{1,180}?"
                r"(?:\*\*|`)?)(?:\s*[:—–]\s+)",
                line,
            )
        if label_match:
            for token in TOKEN_RE.findall(label_match.group("label")):
                record(token, "label", line_no)

        for content in re.findall(r"`([^`\n]+)`", line):
            if is_finding_id(content):
                record(content, "backtick", line_no)

    result: dict[str, dict[str, object]] = {}
    for token, details in found.items():
        contexts = set(details["contexts"])
        if not candidate_is_credible(token, contexts, known_ids, canonical_families):
            continue
        result[token] = {
            "contexts": sorted(contexts),
            "lines": sorted(set(details["lines"])),
        }
    return result


def structured_ids(
    text: str,
    known_ids: set[str],
    canonical_families: set[str],
) -> dict[str, set[str]]:
    """Compatibility wrapper returning explicit IDs and exposing contexts."""
    return {
        token: set(details["contexts"])
        for token, details in structured_id_occurrences(
            text, known_ids, canonical_families
        ).items()
    }


def load_aliases(
    path: pathlib.Path,
    matrix_ids: set[str],
) -> tuple[
    dict[str, str | None],
    set[str],
    dict[str, RegistryEntry],
    dict[str, int],
]:
    if not path.exists():
        return {}, set(), {}, {status: 0 for status in REGISTRY_STATUSES}
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("version") != 1:
        raise ValueError(f"{path}: expected version 1")

    raw_entries = data.get("aliases", {})
    if not isinstance(raw_entries, dict):
        raise ValueError(f"{path}: aliases must be an object")

    raw_ignored = data.get("ignoredTokens", [])
    if not isinstance(raw_ignored, list) or not all(
        isinstance(item, str) and item.strip() for item in raw_ignored
    ):
        raise ValueError(f"{path}: ignoredTokens must be a list of non-empty strings")
    ignored = set(raw_ignored)
    for token in ignored:
        if is_finding_id(token):
            raise ValueError(
                f"{path}: finding-like ignored token {token!r} must use a reasoned "
                "registry entry instead"
            )
        if token in matrix_ids:
            raise ValueError(f"{path}: ignored token {token!r} is already canonical")

    aliases: dict[str, str | None] = {}
    registry: dict[str, RegistryEntry] = {}
    status_counts: collections.Counter[str] = collections.Counter()

    for finding_id, raw in raw_entries.items():
        if not is_finding_id(finding_id):
            raise ValueError(f"{path}: invalid registry ID {finding_id!r}")
        if finding_id in matrix_ids:
            raise ValueError(f"{path}: registry ID {finding_id} is already canonical")
        if not isinstance(raw, dict):
            raise ValueError(
                f"{path}: registry entry {finding_id} must be an object with "
                "status and reason"
            )

        status = raw.get("status", "alias")
        if status not in REGISTRY_STATUSES:
            raise ValueError(
                f"{path}: unsupported status {status!r} for {finding_id}"
            )
        reason = raw.get("reason")
        if not isinstance(reason, str) or not reason.strip():
            raise ValueError(
                f"{path}: registry entry {finding_id} requires a non-empty reason"
            )

        target = raw.get("canonical")
        if status == "alias":
            if not isinstance(target, str) or not is_finding_id(target):
                raise ValueError(
                    f"{path}: alias {finding_id} requires a valid canonical ID"
                )
            if target not in matrix_ids:
                raise ValueError(
                    f"{path}: alias {finding_id} targets missing canonical ID {target!r}"
                )
            aliases[finding_id] = target
        else:
            if target is not None:
                raise ValueError(
                    f"{path}: non-alias entry {finding_id} must not declare canonical"
                )
            aliases[finding_id] = None
            target = None

        registry[finding_id] = RegistryEntry(
            finding_id=finding_id,
            status=status,
            canonical=target,
            reason=reason.strip(),
        )
        status_counts[status] += 1

    return (
        aliases,
        ignored,
        registry,
        {status: status_counts.get(status, 0) for status in REGISTRY_STATUSES},
    )


def row_direct_witness(row: MatrixRow, project: pathlib.Path) -> tuple[bool, list[str]]:
    problems: list[str] = []
    paths = list(dict.fromkeys(match.group("path") for match in PATH_RE.finditer(row.line)))
    existing_paths = 0
    for relative in paths:
        candidate = project / relative
        if candidate.is_file():
            existing_paths += 1
        else:
            problems.append(
                f"BROKEN-EVIDENCE-PATH: open bug {row.finding_id} "
                f"references missing {relative}"
            )
    immutable_witness = any(
        FULL_SHA_RE.fullmatch(match.group("sha"))
        for match in WITNESS_RE.finditer(row.line)
    )
    return bool(existing_paths or immutable_witness), problems


def build_report(project: pathlib.Path) -> dict[str, object]:
    matrix_path = project / "verified" / "MASTER_BUG_MATRIX.md"
    aliases_path = project / "verified" / "MATRIX_ID_ALIASES.json"
    if not matrix_path.exists():
        raise FileNotFoundError(matrix_path)

    matrix_text = matrix_path.read_text(encoding="utf-8")
    matrix_rows, open_ids, closed_rows = parse_matrix(matrix_text)
    aliases, ignored_tokens, registry, registry_counts = load_aliases(
        aliases_path, set(matrix_rows)
    )
    known_ids = set(matrix_rows) | set(registry) | ignored_tokens
    canonical_families = {finding_id.split("-", 1)[0] for finding_id in matrix_rows}

    evidence_paths: list[pathlib.Path] = []
    for directory_name in ("reverify", "incoming", "working"):
        directory = project / directory_name
        if directory.exists():
            evidence_paths.extend(directory.rglob("*.md"))
    evidence = read_markdown(evidence_paths)

    archive_dir = project / "archive"
    archive = read_markdown(archive_dir.rglob("*.md")) if archive_dir.exists() else {}

    evidence_occurrences: dict[str, list[str]] = collections.defaultdict(list)
    archive_occurrences: dict[str, list[str]] = collections.defaultdict(list)
    reverify_occurrences: dict[str, list[dict[str, object]]] = collections.defaultdict(list)

    for path, text in evidence.items():
        details = structured_id_occurrences(text, known_ids, canonical_families)
        relative = str(path.relative_to(project))
        for finding_id, occurrence in details.items():
            evidence_occurrences[finding_id].append(relative)
            if "reverify" in path.parts:
                reverify_occurrences[finding_id].append(
                    {
                        "file": relative,
                        "lines": occurrence["lines"],
                        "contexts": occurrence["contexts"],
                    }
                )

    for path, text in archive.items():
        for finding_id in structured_ids(text, known_ids, canonical_families):
            archive_occurrences[finding_id].append(str(path.relative_to(project)))

    canonical_evidence = set(evidence_occurrences)
    canonical_archive = set(archive_occurrences)
    for alias, target in aliases.items():
        if target and alias in evidence_occurrences:
            canonical_evidence.add(target)
        if target and alias in archive_occurrences:
            canonical_archive.add(target)

    problems: list[str] = matrix_integrity_problems(matrix_text, matrix_rows)
    archived_only: list[str] = []
    direct_witnessed: list[str] = []
    unregistered_evidence: list[dict[str, object]] = []

    for finding_id in sorted(open_ids):
        row = matrix_rows[finding_id]
        has_direct, path_problems = row_direct_witness(row, project)
        problems.extend(path_problems)
        if finding_id in canonical_evidence:
            continue
        if has_direct:
            direct_witnessed.append(finding_id)
            continue
        if finding_id in canonical_archive:
            archived_only.append(finding_id)
            continue
        problems.append(
            f"ORPHAN-CLAIM: open bug {finding_id} has no explicit evidence ID, "
            "existing evidence path, immutable verified-* witness, or archived evidence"
        )

    for finding_id in sorted(reverify_occurrences):
        if finding_id in matrix_rows or finding_id in registry or finding_id in ignored_tokens:
            continue
        occurrences = reverify_occurrences[finding_id]
        first = occurrences[0]
        first_line = first["lines"][0] if first["lines"] else "?"
        problems.append(
            f"UNREGISTERED-EVIDENCE: reverify explicitly registers {finding_id} at "
            f"{first['file']}:{first_line} but matrix/registry does not"
        )
        unregistered_evidence.append(
            {"id": finding_id, "occurrences": occurrences}
        )

    for row in closed_rows:
        reference = (
            row.cells[-1].strip("`").split()[0].strip("`") if row.cells[-1] else ""
        )
        if reference and not SHA_RE.fullmatch(reference) and reference not in NON_SHA_OK:
            problems.append(
                f"BAD-COMMIT-REF: closed bug {row.finding_id} ref {reference!r} "
                "is not a short SHA or approved immutable marker"
            )

    return {
        "matrixIds": len(matrix_rows),
        "openRows": len(open_ids),
        "evidenceFiles": len(evidence),
        "registryIds": len(registry),
        "aliasIds": registry_counts["alias"],
        "registryStatusCounts": registry_counts,
        "ignoredTokens": len(ignored_tokens),
        "directWitnessedOpenRows": len(direct_witnessed),
        "archivedOnlyOpenRows": len(archived_only),
        "problems": len(problems),
        "problemKinds": dict(
            collections.Counter(item.split(":", 1)[0] for item in problems)
        ),
        "directWitnessedIds": direct_witnessed,
        "archivedOnlyIds": archived_only,
        "unregisteredEvidence": unregistered_evidence,
        "diagnostics": problems,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", default="projects/gb-is-my-strength")
    parser.add_argument("--warn-only", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--json-out")
    args = parser.parse_args(argv)

    root = pathlib.Path(__file__).resolve().parent.parent
    project = root / args.project
    try:
        report = build_report(project)
    except (FileNotFoundError, ValueError, json.JSONDecodeError) as error:
        print(f"FATAL: {error}")
        return 2

    counts = report["registryStatusCounts"]
    print(
        "matrix: {matrixIds} canonical ids, {openRows} open rows; "
        "evidence files: {evidenceFiles}; registry: {registryIds} "
        "(aliases: {aliasIds}, informational: {informational}, "
        "retired: {retired}, false-positive: {false_positive}); "
        "direct witnesses: {directWitnessedOpenRows}; archived-only: "
        "{archivedOnlyOpenRows}".format(
            **report,
            informational=counts["informational"],
            retired=counts["retired"],
            false_positive=counts["false-positive"],
        )
    )
    if args.verbose:
        if report["directWitnessedIds"]:
            print("direct-witnessed:", ", ".join(report["directWitnessedIds"]))
        if report["archivedOnlyIds"]:
            print("archived-only:", ", ".join(report["archivedOnlyIds"]))

    if args.json_out:
        output = pathlib.Path(args.json_out)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    diagnostics = report["diagnostics"]
    if diagnostics:
        print(f"\n{len(diagnostics)} problem(s):")
        for problem in diagnostics:
            print("  -", problem)
        return 0 if args.warn_only else 1

    print("OK: matrix coverage checks passed")
    return 0
