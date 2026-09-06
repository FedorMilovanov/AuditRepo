#!/usr/bin/env python3
"""Canonical matrix/evidence coverage engine.

The engine treats a project's MASTER as the compact active work registry.
Historical evidence may remain in incoming/verification/reverify/legacy/archive,
but retired/evidence-only IDs do not need to remain in MASTER or an alias ledger.
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
FULL_SHA_RE = re.compile(r"^[0-9a-f]{7,40}$")
LEXICAL_NON_FINDINGS = {"SHA-256"}
REGISTRY_STATUSES = ("alias", "retired", "informational", "false-positive")
PATH_RE = re.compile(
    r"(?P<path>(?:reverify|verification|incoming|working|legacy|archive)/[^`|\s)]+?\.md)"
)
WITNESS_RE = re.compile(
    r"\bverified-(?:source|browser|ci|build|artifact|live|lifecycle)\b[^|\n]{0,180}?"
    r"(?P<sha>[0-9a-f]{7,40})\b",
    re.IGNORECASE,
)

ACTIVE_SECTION_MARKERS = (
    "CURRENT DEFECTS",
    "NARROWED RESIDUALS",
    "SYSTEM VERIFICATION LANES",
    "OWNER DECISIONS",
    "NECESSARY IMPROVEMENTS",
    "VERIFIED IMPROVEMENTS",
)
LEGACY_OPEN_SECTION_MARKERS = ("ОТКРЫТО", "РЕФАКТОРИНГ", "AUDITREPO")
LEGACY_CLOSED_SECTION_MARKERS = ("ЗАКРЫТО",)
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


# A project corpus must re-prove coverage when its governed registry inputs
# (matrix, alias registry) change, or when its evidence corpus changes, because
# both sides of the ownership relation can drift.
PROJECT_COVERAGE_TRIGGER_RE = re.compile(
    r"^projects/(?P<project>[^/_][^/]*)/(?:"
    r"verified/(?:MASTER_BUG_MATRIX\.md|MATRIX_ID_ALIASES\.json)"
    r"|(?:reverify|verification|incoming|working|legacy|archive)/"
    r")"
)
# Coverage-engine changes are regression-tested against the canonical corpus.
COVERAGE_ENGINE_TRIGGER_RE = re.compile(
    r"^scripts/(?:check_matrix_coverage|matrix_coverage_)"
    r"|^\.github/workflows/auditrepo-deep-audit\.yml$"
)
DEFAULT_COVERAGE_PROJECT = "gb-is-my-strength"
SAFE_PROJECT_NAME_RE = re.compile(r"^[A-Za-z0-9._-]+$")


def coverage_projects_for_changed_paths(
    changed_paths: Iterable[str],
    root: pathlib.Path | str = ".",
) -> list[str]:
    """Resolve which project corpora must run coverage for a change set.

    The resolver is the single scope authority for the CI coverage step: a
    coverage-triggering change must resolve to at least one project corpus.
    An empty resolution is trigger/scope drift and fails closed instead of
    producing a zero-work success.
    """
    root_path = pathlib.Path(root)
    projects: set[str] = set()
    registry_named: set[str] = set()
    engine_changed = False
    for raw in changed_paths:
        path = str(raw).strip().replace("\\", "/")
        if not path:
            continue
        match = PROJECT_COVERAGE_TRIGGER_RE.match(path)
        if match:
            project = match.group("project")
            projects.add(project)
            if re.search(
                r"/verified/(?:MASTER_BUG_MATRIX\.md|MATRIX_ID_ALIASES\.json)$", path
            ):
                registry_named.add(project)
        elif COVERAGE_ENGINE_TRIGGER_RE.match(path):
            engine_changed = True

    if engine_changed:
        projects.add(DEFAULT_COVERAGE_PROJECT)

    selected: list[str] = []
    for name in sorted(projects):
        if name.startswith("_") or not SAFE_PROJECT_NAME_RE.fullmatch(name):
            continue
        matrix = root_path / "projects" / name / "verified" / "MASTER_BUG_MATRIX.md"
        # A deleted/renamed governed registry must still run (and fail) against
        # its project rather than silently dropping the corpus from scope.
        if matrix.is_file() or name in registry_named:
            selected.append(name)

    if not selected:
        detail = (
            f"; matched but non-coverable project names: {sorted(projects)}"
            if projects
            else ""
        )
        raise ValueError(
            "coverage-triggering change resolved to no project corpus"
            f"{detail}; the trigger pattern and the scope resolver have drifted"
        )
    return selected


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


def section_kind(section: str) -> str | None:
    upper = section.upper()
    if any(marker in upper for marker in ACTIVE_SECTION_MARKERS):
        return "open"
    if any(marker in upper for marker in LEGACY_CLOSED_SECTION_MARKERS):
        return "closed"
    if any(marker in upper for marker in LEGACY_OPEN_SECTION_MARKERS):
        return "open"
    return None


def section_declared_count(section: str) -> int | None:
    match = re.search(r"(?:\((\d+)\)|[—–-]\s*(\d+))\s*$", section)
    if not match:
        return None
    value = match.group(1) or match.group(2)
    return int(value)


def parse_matrix(matrix: str) -> tuple[dict[str, MatrixRow], set[str], list[MatrixRow]]:
    rows: dict[str, MatrixRow] = {}
    open_ids: set[str] = set()
    closed_rows: list[MatrixRow] = []
    section = ""

    for line_no, line in enumerate(matrix.splitlines(), 1):
        if line.startswith("## "):
            section = line[3:].strip()
            continue
        kind = section_kind(section)
        if not kind:
            continue
        cells = parse_table_cells(line)
        if not cells or cells[0] in HEADER_IDS:
            continue
        finding_id = cells[0].strip("`")
        if not is_finding_id(finding_id):
            continue
        row = MatrixRow(finding_id, section, line_no, line, tuple(cells))
        if finding_id in rows:
            raise ValueError(
                f"duplicate canonical matrix ID {finding_id}: "
                f"lines {rows[finding_id].line_no} and {line_no}"
            )
        rows[finding_id] = row
        if kind == "open":
            open_ids.add(finding_id)
        else:
            closed_rows.append(row)

    return rows, open_ids, closed_rows


def _clean_count_value(value: str) -> int | None:
    cleaned = value.replace("*", "").replace("`", "").strip()
    return int(cleaned) if re.fullmatch(r"\d+", cleaned) else None


def matrix_integrity_problems(
    matrix: str,
    matrix_rows: dict[str, MatrixRow],
) -> list[str]:
    """Validate compact active-work shape and declared counters."""
    problems: list[str] = []
    section = ""
    actual_counts: collections.Counter[str] = collections.Counter()
    declared_section_counts: dict[str, int] = {}
    seen_sections: set[str] = set()
    state_rows: dict[str, tuple[int, str]] = {}
    compact_schema = any(marker in matrix.upper() for marker in ACTIVE_SECTION_MARKERS)

    for line_no, line in enumerate(matrix.splitlines(), 1):
        if line.startswith("## "):
            section = line[3:].strip()
            kind = section_kind(section)
            if kind:
                key = re.sub(r"\s*(?:\(\d+\)|[—–-]\s*\d+)\s*$", "", section)
                if key in seen_sections:
                    problems.append(f"SECTION-DUPLICATE: active section {key!r} appears more than once")
                seen_sections.add(key)
                count = section_declared_count(section)
                if count is not None:
                    declared_section_counts[section] = count
            continue

        cells = parse_table_cells(line)
        if section == "Current state" and cells and cells[0] not in HEADER_IDS:
            if len(cells) >= 2:
                state_rows[cells[0].strip()] = (line_no, cells[1].strip())
            continue

        kind = section_kind(section)
        if not kind or not cells or cells[0] in HEADER_IDS:
            continue
        finding_id = cells[0].strip("`")
        if not is_finding_id(finding_id):
            problems.append(
                f"NONCANONICAL-MATRIX-ID: active section {section!r} line {line_no} "
                f"uses invalid table ID {finding_id!r}"
            )
            continue
        actual_counts[section] += 1
        description = cells[1] if len(cells) > 1 else ""
        if kind == "open" and re.match(
            r"^\s*(?:✅\s*)?(?:\*\*)?\s*(?:CLOSED|FIXED|ЗАКРЫТ(?:О|А|Ы)?)\b",
            description,
            re.IGNORECASE,
        ):
            problems.append(
                f"CLOSED-IN-ACTIVE: {finding_id} is explicitly closed in {section!r} at line {line_no}"
            )

    for counted_section, expected in declared_section_counts.items():
        actual = actual_counts[counted_section]
        if actual != expected:
            problems.append(
                f"SECTION-COUNT-MISMATCH: {counted_section!r} declares {expected} but contains {actual} canonical rows"
            )

    if compact_schema:
        closed_rows = [row for row in matrix_rows.values() if section_kind(row.section) == "closed"]
        if closed_rows:
            problems.append(
                f"ACTIVE-MATRIX-CONTAINS-CLOSED: compact MASTER contains {len(closed_rows)} closed row(s); retire them to legacy"
            )

        def count_marker(marker: str) -> int:
            return sum(count for sec, count in actual_counts.items() if marker in sec.upper())

        expected_state = {
            "Active work units": sum(1 for row in matrix_rows.values() if section_kind(row.section) == "open"),
            "Direct current defects": count_marker("CURRENT DEFECTS"),
            "Verified necessary improvements": count_marker("NECESSARY IMPROVEMENTS"),
            "Narrowed residuals": count_marker("NARROWED RESIDUALS"),
            "System verification lanes": count_marker("SYSTEM VERIFICATION LANES"),
            "Owner decisions": count_marker("OWNER DECISIONS"),
            "Closed/stale/duplicate/absorbed rows in MASTER": 0,
        }
        for label, expected in expected_state.items():
            entry = state_rows.get(label)
            if not entry:
                problems.append(f"STATE-ROW-MISSING: Current state row {label!r} is absent")
                continue
            line_no, value = entry
            parsed = _clean_count_value(value)
            if parsed is None:
                problems.append(
                    f"STATE-VALUE-INVALID: Current state row {label!r} at line {line_no} has non-numeric value {value!r}"
                )
            elif parsed != expected:
                problems.append(
                    f"STATE-COUNT-MISMATCH: Current state row {label!r} declares {parsed} but matrix contains {expected}"
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
    if token in known_ids or {"table-key", "backtick", "heading", "label"} & contexts:
        return bool(UPPER_ID_RE.fullmatch(token) or token in known_ids)
    if not UPPER_ID_RE.fullmatch(token):
        return False
    segments = token.split("-")
    return any(char.isdigit() for char in token) or segments[0] in canonical_families or len(segments) >= 3


def structured_id_occurrences(
    text: str,
    known_ids: set[str],
    canonical_families: set[str],
) -> dict[str, dict[str, object]]:
    found: dict[str, dict[str, object]] = collections.defaultdict(
        lambda: {"contexts": set(), "lines": set()}
    )

    def record(token: str, context: str, line_no: int) -> None:
        found[token]["contexts"].add(context)
        found[token]["lines"].add(line_no)

    for line_no, line in enumerate(text.splitlines(), 1):
        cells = parse_table_cells(line)
        if cells:
            key = cells[0].strip("`")
            if is_finding_id(key):
                record(key, "table-key", line_no)

        if re.match(r"^#{1,6}\s+", line):
            for token in TOKEN_RE.findall(line):
                record(token, "heading", line_no)

        if not re.match(r"^#{1,6}\s+", line):
            label_match = re.match(
                r"^\s*(?:[-*]\s+)?(?P<label>(?:\*\*|`)?[^:—–]{1,180}?(?:\*\*|`)?)(?:\s*[:—–]\s+)",
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
        if candidate_is_credible(token, contexts, known_ids, canonical_families):
            result[token] = {
                "contexts": sorted(contexts),
                "lines": sorted(set(details["lines"])),
            }
    return result


def reject_duplicate_json_keys(pairs: list[tuple[str, object]]) -> dict[str, object]:
    result: dict[str, object] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate JSON key {key!r}")
        result[key] = value
    return result


def load_aliases(
    path: pathlib.Path,
    matrix_ids: set[str],
    historical_ids: set[str],
) -> tuple[dict[str, str | None], set[str], dict[str, RegistryEntry], dict[str, int]]:
    if not path.exists():
        return {}, set(), {}, {status: 0 for status in REGISTRY_STATUSES}
    data = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=reject_duplicate_json_keys)
    if data.get("version") != 1:
        raise ValueError(f"{path}: expected version 1")
    raw_entries = data.get("aliases", {})
    if not isinstance(raw_entries, dict):
        raise ValueError(f"{path}: aliases must be an object")
    raw_ignored = data.get("ignoredTokens", [])
    if not isinstance(raw_ignored, list) or not all(isinstance(item, str) and item.strip() for item in raw_ignored):
        raise ValueError(f"{path}: ignoredTokens must be a list of non-empty strings")
    ignored = set(raw_ignored)
    for token in ignored:
        if is_finding_id(token):
            raise ValueError(f"{path}: finding-like ignored token {token!r} must use a reasoned registry entry instead")
        if token in matrix_ids:
            raise ValueError(f"{path}: ignored token {token!r} is already canonical")

    registry_ids = set(raw_entries)
    valid_targets = matrix_ids | historical_ids | registry_ids
    aliases: dict[str, str | None] = {}
    registry: dict[str, RegistryEntry] = {}
    status_counts: collections.Counter[str] = collections.Counter()

    for finding_id, raw in raw_entries.items():
        if not is_finding_id(finding_id):
            raise ValueError(f"{path}: invalid registry ID {finding_id!r}")
        if finding_id in matrix_ids:
            raise ValueError(f"{path}: registry ID {finding_id} is already canonical")
        if not isinstance(raw, dict):
            raise ValueError(f"{path}: registry entry {finding_id} must be an object with status and reason")
        status = raw.get("status", "alias")
        if status not in REGISTRY_STATUSES:
            raise ValueError(f"{path}: unsupported status {status!r} for {finding_id}")
        reason = raw.get("reason")
        if not isinstance(reason, str) or not reason.strip():
            raise ValueError(f"{path}: registry entry {finding_id} requires a non-empty reason")
        target = raw.get("canonical")
        if status == "alias":
            if not isinstance(target, str) or not is_finding_id(target):
                raise ValueError(f"{path}: alias {finding_id} requires a valid canonical ID")
            if target not in valid_targets:
                raise ValueError(f"{path}: alias {finding_id} targets unknown ID {target!r}")
            aliases[finding_id] = target
        else:
            if target is not None:
                raise ValueError(f"{path}: non-alias entry {finding_id} must not declare canonical")
            aliases[finding_id] = None
            target = None
        registry[finding_id] = RegistryEntry(finding_id, status, target, reason.strip())
        status_counts[status] += 1

    return aliases, ignored, registry, {status: status_counts.get(status, 0) for status in REGISTRY_STATUSES}


def row_direct_witness(row: MatrixRow, project: pathlib.Path) -> tuple[bool, list[str]]:
    problems: list[str] = []
    paths = list(dict.fromkeys(match.group("path") for match in PATH_RE.finditer(row.line)))
    active_existing_paths = 0
    for relative in paths:
        candidate = project / relative
        if not candidate.is_file():
            problems.append(f"BROKEN-EVIDENCE-PATH: active work {row.finding_id} references missing {relative}")
            continue
        if relative.startswith(("archive/", "legacy/")):
            continue
        active_existing_paths += 1
    immutable_witness = any(FULL_SHA_RE.fullmatch(match.group("sha")) for match in WITNESS_RE.finditer(row.line))
    return bool(active_existing_paths or immutable_witness), problems


def _occurrence_map(
    documents: dict[pathlib.Path, str],
    project: pathlib.Path,
    known_ids: set[str],
    canonical_families: set[str],
) -> tuple[dict[str, list[str]], dict[str, list[dict[str, object]]]]:
    occurrences: dict[str, list[str]] = collections.defaultdict(list)
    details_map: dict[str, list[dict[str, object]]] = collections.defaultdict(list)
    for path, text in documents.items():
        details = structured_id_occurrences(text, known_ids, canonical_families)
        relative = str(path.relative_to(project))
        for finding_id, occurrence in details.items():
            occurrences[finding_id].append(relative)
            details_map[finding_id].append({"file": relative, **occurrence})
    return occurrences, details_map


def build_report(project: pathlib.Path) -> dict[str, object]:
    matrix_path = project / "verified" / "MASTER_BUG_MATRIX.md"
    aliases_path = project / "verified" / "MATRIX_ID_ALIASES.json"
    if not matrix_path.exists():
        raise FileNotFoundError(matrix_path)

    matrix_text = matrix_path.read_text(encoding="utf-8")
    matrix_rows, open_ids, closed_rows = parse_matrix(matrix_text)
    canonical_families = {finding_id.split("-", 1)[0] for finding_id in matrix_rows}

    historical_paths: list[pathlib.Path] = []
    for directory_name in ("legacy", "archive"):
        directory = project / directory_name
        if directory.exists():
            historical_paths.extend(directory.rglob("*.md"))
    historical_docs = read_markdown(historical_paths)
    historical_occurrences, _ = _occurrence_map(
        historical_docs, project, set(matrix_rows), canonical_families
    )
    historical_ids = set(historical_occurrences)

    aliases, ignored_tokens, registry, registry_counts = load_aliases(
        aliases_path, set(matrix_rows), historical_ids
    )
    known_ids = set(matrix_rows) | set(registry) | historical_ids | ignored_tokens
    canonical_families |= {
        finding_id.split("-", 1)[0]
        for finding_id in known_ids
        if is_finding_id(finding_id)
    }

    evidence_paths: list[pathlib.Path] = []
    for directory_name in ("reverify", "verification", "incoming", "working"):
        directory = project / directory_name
        if directory.exists():
            evidence_paths.extend(directory.rglob("*.md"))
    evidence = read_markdown(evidence_paths)
    evidence_occurrences, evidence_details = _occurrence_map(
        evidence, project, known_ids, canonical_families
    )
    historical_occurrences, _ = _occurrence_map(
        historical_docs, project, known_ids, canonical_families
    )
    historical_ids = set(historical_occurrences)

    canonical_evidence = set(evidence_occurrences)
    canonical_historical = set(historical_occurrences)
    for alias, target in aliases.items():
        if target and alias in evidence_occurrences and target in matrix_rows:
            canonical_evidence.add(target)
        if target and alias in historical_occurrences:
            canonical_historical.add(target)

    problems: list[str] = matrix_integrity_problems(matrix_text, matrix_rows)
    historical_only: list[str] = []
    direct_witnessed: list[str] = []

    for finding_id in sorted(open_ids):
        row = matrix_rows[finding_id]
        has_direct, path_problems = row_direct_witness(row, project)
        problems.extend(path_problems)
        if finding_id in canonical_evidence:
            continue
        if has_direct:
            direct_witnessed.append(finding_id)
            continue
        if finding_id in canonical_historical:
            historical_only.append(finding_id)
            problems.append(
                f"LEGACY-ONLY-ACTIVE: active work {finding_id} is supported only by legacy/archive evidence; current verification is required"
            )
            continue
        problems.append(
            f"ORPHAN-ACTIVE-WORK: {finding_id} has no explicit current evidence ID/path/verified-* witness"
        )

    # Evidence is intentionally allowed to outlive active work. Hundreds of old
    # reverify IDs must not force rows back into MASTER or create a permanent alias
    # registry. Keep them visible as evidence-only diagnostics, but non-blocking.
    evidence_only_ids = sorted(
        finding_id
        for finding_id in evidence_occurrences
        if finding_id not in matrix_rows
        and finding_id not in registry
        and finding_id not in ignored_tokens
        and finding_id not in historical_ids
    )
    # Exact file/line occurrence context for every evidence-only ID. The contexts
    # artifact consumes this key directly; it must never silently default to an
    # empty corpus when the report contract changes.
    unregistered_evidence = [
        {"id": finding_id, "occurrences": evidence_details[finding_id]}
        for finding_id in evidence_only_ids
    ]

    return {
        "matrixIds": len(matrix_rows),
        "closedRows": len(closed_rows),
        "openRows": len(open_ids),
        "evidenceFiles": len(evidence),
        "historicalFiles": len(historical_docs),
        "historicalIds": len(historical_ids),
        "registryIds": len(registry),
        "aliasIds": registry_counts["alias"],
        "registryStatusCounts": registry_counts,
        "ignoredTokens": len(ignored_tokens),
        "directWitnessedOpenRows": len(direct_witnessed),
        "historicalOnlyOpenRows": len(historical_only),
        "evidenceOnlyIds": len(evidence_only_ids),
        "evidenceOnlyIdList": evidence_only_ids,
        "unregisteredEvidence": unregistered_evidence,
        "problems": len(problems),
        "problemKinds": dict(collections.Counter(item.split(":", 1)[0] for item in problems)),
        "directWitnessedIds": direct_witnessed,
        "historicalOnlyIds": historical_only,
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
        "matrix: {matrixIds} active ids, {closedRows} closed rows, {openRows} open rows; "
        "evidence files: {evidenceFiles}; historical files: {historicalFiles}; "
        "legacy/archive ids: {historicalIds}; registry: {registryIds} "
        "(aliases: {aliasIds}, informational: {informational}, retired: {retired}, "
        "false-positive: {false_positive}); direct witnesses: {directWitnessedOpenRows}; "
        "historical-only active: {historicalOnlyOpenRows}; evidence-only ids: {evidenceOnlyIds}".format(
            **report,
            informational=counts["informational"],
            retired=counts["retired"],
            false_positive=counts["false-positive"],
        )
    )
    if args.verbose:
        if report["directWitnessedIds"]:
            print("direct-witnessed:", ", ".join(report["directWitnessedIds"]))
        if report["historicalOnlyIds"]:
            print("historical-only-active:", ", ".join(report["historicalOnlyIds"]))
        if report["evidenceOnlyIdList"]:
            print("evidence-only (non-blocking):", ", ".join(report["evidenceOnlyIdList"]))

    if args.json_out:
        output = pathlib.Path(args.json_out)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    diagnostics = report["diagnostics"]
    if diagnostics:
        print(f"\n{len(diagnostics)} problem(s):")
        for problem in diagnostics:
            print("  -", problem)
        return 0 if args.warn_only else 1

    print("OK: compact active matrix coverage checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
