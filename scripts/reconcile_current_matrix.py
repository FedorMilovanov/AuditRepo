#!/usr/bin/env python3
"""Apply the reviewed 2026-07-23 current-source matrix reconciliation.

The transaction is intentionally narrow and idempotent:
- promote five exact-current findings from open tables to the closed table;
- normalize the historical P0/P1 table as an explicit open canonical section;
- add the external hosting/security-header decision as REG-001;
- add reviewed historical dispositions;
- preserve every removed row in archive evidence;
- recalculate canonical heading/statistics counts.
"""

from __future__ import annotations

import collections
import json
import pathlib
import re
import sys
from dataclasses import dataclass

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
ALIASES = PROJECT / "verified" / "MATRIX_ID_ALIASES.json"
ARCHIVE = (
    PROJECT
    / "archive"
    / "fixed"
    / "2026-07-23-current-truth-cleanup"
    / "CURRENT_SOURCE_FORENSIC_CLOSURES.md"
)
REPORT = ROOT / "reports" / "matrix-reconcile" / "report.json"

ID_RE = re.compile(r"^[A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)+$")
HEADER_IDS = {"ID", "Поле", "Категория", "Статус"}

CLOSURES = {
    "AUDIT-ATLAS-DOC-PATH-LEAK": {
        "description": (
            "✅ **FIXED/VERIFIED 2026-07-23.** PR #160 replaced two workspace-specific "
            "Atlas documentation paths; PR #162 removed the final `AuditRepo/projects/...` "
            "reference from `PremiumControlAnchor.astro`. The final source uses explicit "
            "repository identity plus repository-relative paths."
        ),
        "commit": "0f5b3307",
    },
    "AUDIT-FORBIDDEN-JS-NAGORNAYA": {
        "description": (
            "✅ **FIXED/VERIFIED CURRENT.** `js/nagornaya-bar-extras.js` is in canonical "
            "`ALLOWED_JS`; exact current `audit-pro` passes 170 checks with 0 errors."
        ),
        "commit": "a73f609f",
    },
    "GATE-CSS-IMPORTANT-RATCHET": {
        "description": (
            "✅ **FIXED/VERIFIED CURRENT.** `css/site.css` uses 183 `!important` declarations "
            "against the hard ceiling 200; `css:layer:validate` and `audit-pro` both pass."
        ),
        "commit": "a73f609f",
    },
    "ASTRO-P0-03": {
        "description": (
            "✅ **FIXED/VERIFIED CURRENT.** `validate-map-routes.js` now promotes stats "
            "mismatches to fatal `bad(...)` diagnostics; exact `maps:validate` passes all 11 routes."
        ),
        "commit": "a73f609f",
    },
    "ASTRO-P0-04": {
        "description": (
            "✅ **FIXED/VERIFIED CURRENT.** Exact `avraam:audit` proves one canonical set of "
            "19 non-context places in HTML and route data; all 27 Avraam assertions pass."
        ),
        "commit": "a73f609f",
    },
}

DISPOSITIONS = {
    "CSS-DEAD-004": {
        "status": "retired",
        "reason": (
            "Exact current-source forensic run 29971872480 found the historical empty "
            "dark-mode rule absent; css-tree parses all guarded stylesheets."
        ),
    },
    "CSS-SYNTAX-001": {
        "status": "retired",
        "reason": (
            "Exact historical malformed reduced-motion selector pattern is absent on "
            "a73f609f; CSS AST contracts pass."
        ),
    },
    "CSS-SYNTAX-002": {
        "status": "retired",
        "reason": "Exact dangling selector pattern is absent on a73f609f; CSS AST contracts pass.",
    },
    "CSS-SYNTAX-003": {
        "status": "retired",
        "reason": "Exact @supports-in-selector pattern is absent on a73f609f; CSS AST contracts pass.",
    },
    "CSS-SYNTAX-005": {
        "status": "retired",
        "reason": "Exact malformed backlinks rgba selector is absent on a73f609f; CSS AST contracts pass.",
    },
    "DEP-BLOCK-AVRAAM-AUDIT": {
        "status": "retired",
        "reason": "Historical deploy blocker no longer active: exact avraam:audit is 27/27 on a73f609f.",
    },
    "DEP-BLOCK-CSS-IMPORTANT-CEILING": {
        "status": "retired",
        "reason": (
            "Historical deploy blocker no longer active: site.css is 183 against ceiling 200 "
            "and exact CSS gates pass."
        ),
    },
    "DEP-BLOCK-EDITORIAL-REGISTRY": {
        "status": "retired",
        "reason": (
            "Historical deploy blocker no longer active: editorial registry has 43/43 "
            "eligible records and the exact check exits 0."
        ),
    },
    "DEP-BLOCK-MAPS-VALIDATE": {
        "status": "retired",
        "reason": (
            "Historical deploy blocker no longer active: exact maps:validate passes all 11 "
            "route files; detailed current map findings remain canonical separately."
        ),
    },
    "UI-GILL-DESKTOP-FRAME-03": {
        "status": "retired",
        "reason": (
            "Historical missing-prevention-gate claim is superseded by permanent Gill "
            "submenu/layout/browser gates and exact Pages deployment success."
        ),
    },
}

REG_ROW = (
    "| REG-001 | 🟡 **Hosting/security-header decision.** GitHub Pages live responses expose "
    "HSTS but no response-level CSP, X-Frame-Options, Referrer-Policy or Permissions-Policy. "
    "Closing requires a proxy/hosting decision or explicit by-design acceptance. | "
    "`reverify/CURRENT_OPEN_EVIDENCE_2026-07-23_a73f609f.md` |"
)


@dataclass
class RowLocation:
    finding_id: str
    line_no: int
    section: str
    line: str


def table_cells(line: str) -> list[str]:
    if not line.startswith("| ") or line.startswith("|---"):
        return []
    return [cell.strip() for cell in line.strip("|").split("|")]


def normalize_heading(line: str) -> str:
    if line.startswith("## 🔴 P0/P1"):
        return "## 🔴 P0/P1 — ОТКРЫТО — release / deploy + karty runtime"
    return line


def section_row_counts(lines: list[str]) -> dict[str, int]:
    counts: dict[str, int] = collections.Counter()
    section = ""
    for line in lines:
        if line.startswith("## "):
            section = line[3:].strip()
            section = re.sub(r"\s*\(\d+\)\s*", " ", section)
            section = re.sub(r"\s+", " ", section).strip()
            continue
        if not any(
            marker in section
            for marker in ("ЗАКРЫТО", "ОТКРЫТО", "РЕФАКТОРИНГ", "AUDITREPO")
        ):
            continue
        cells = table_cells(line)
        if cells and cells[0] not in HEADER_IDS and ID_RE.fullmatch(cells[0]):
            counts[section] += 1
    return dict(counts)


def count_for_prefix(counts: dict[str, int], prefix: str) -> int:
    matches = [value for key, value in counts.items() if key.startswith(prefix)]
    if len(matches) != 1:
        raise RuntimeError(f"expected one section count for {prefix!r}, found {matches}")
    return matches[0]


def rewrite_headings(lines: list[str]) -> tuple[list[str], dict[str, int]]:
    counts = section_row_counts(lines)
    closed = count_for_prefix(counts, "✅ ЗАКРЫТО")
    p0 = count_for_prefix(counts, "🔴 P0/P1 — ОТКРЫТО")
    p1 = count_for_prefix(counts, "🟠 P1 — ОТКРЫТО")
    p2 = count_for_prefix(counts, "🟡 P2 — ОТКРЫТО")
    p3 = count_for_prefix(counts, "🟢 P3 — ОТКРЫТО")
    refactor = count_for_prefix(counts, "🔵 P3 — РЕФАКТОРИНГ")
    auditrepo = count_for_prefix(counts, "🟣 AUDITREPO")

    rewritten: list[str] = []
    for line in lines:
        if line.startswith("## ✅ ЗАКРЫТО"):
            line = f"## ✅ ЗАКРЫТО ({closed})"
        elif line.startswith("## 🔴 P0/P1"):
            line = f"## 🔴 P0/P1 — ОТКРЫТО ({p0}) — release / deploy + karty runtime"
        elif line.startswith("## 🟠 P1 — ОТКРЫТО"):
            line = f"## 🟠 P1 — ОТКРЫТО ({p1})"
        elif line.startswith("## 🟡 P2 — ОТКРЫТО"):
            line = f"## 🟡 P2 — ОТКРЫТО ({p2})"
        elif line.startswith("## 🟢 P3 — ОТКРЫТО"):
            line = f"## 🟢 P3 — ОТКРЫТО ({p3})"
        elif line.startswith("## 🔵 P3 — РЕФАКТОРИНГ"):
            line = f"## 🔵 P3 — РЕФАКТОРИНГ ({refactor})"
        elif line.startswith("## 🟣 AUDITREPO"):
            line = f"## 🟣 AUDITREPO ({auditrepo})"
        rewritten.append(line)

    return rewritten, {
        "closed": closed,
        "p0": p0,
        "p1": p1,
        "p2": p2,
        "p3": p3,
        "refactor": refactor,
        "auditrepo": auditrepo,
        "openTotal": p0 + p1 + p2 + p3 + refactor + auditrepo,
    }


def rewrite_statistics(lines: list[str], counts: dict[str, int]) -> list[str]:
    replacements = {
        "| Закрыто (fixed) |": f"| Закрыто (fixed) | {counts['closed']} |",
        "| **P0 открыто** |": f"| **P0 открыто** | **{counts['p0']}** |",
        "| P1 открыто |": f"| P1 открыто | {counts['p1']} |",
        "| P2 открыто |": f"| P2 открыто | {counts['p2']} |",
        "| P3 открыто |": f"| P3 открыто | {counts['p3']} |",
        "| Рефакторинг |": f"| Рефакторинг | {counts['refactor']} |",
        "| AuditRepo |": f"| AuditRepo | {counts['auditrepo']} |",
        "| **Всего открыто (матрица)** |": (
            f"| **Всего открыто (матрица)** | **{counts['openTotal']}** |"
        ),
    }
    result: list[str] = []
    for line in lines:
        replaced = False
        for prefix, replacement in replacements.items():
            if line.startswith(prefix):
                line = replacement
                replaced = True
                break
        result.append(line)
    return result


def reconcile() -> dict[str, object]:
    original_matrix = MATRIX.read_text(encoding="utf-8")
    original_aliases = ALIASES.read_text(encoding="utf-8")
    lines = original_matrix.splitlines()

    output: list[str] = []
    removed: list[RowLocation] = []
    section = ""
    existing_closed: set[str] = set()
    for line_no, raw_line in enumerate(lines, 1):
        line = normalize_heading(raw_line)
        if line.startswith("## "):
            section = line[3:].strip()
        cells = table_cells(line)
        finding_id = cells[0] if cells else ""
        if finding_id in CLOSURES:
            if "ЗАКРЫТО" in section:
                existing_closed.add(finding_id)
            elif "ОТКРЫТО" in section or section.startswith("🔴 P0/P1"):
                removed.append(RowLocation(finding_id, line_no, section, raw_line))
                continue
        output.append(line)

    removed_ids = {item.finding_id for item in removed}
    unresolved = set(CLOSURES) - removed_ids - existing_closed
    if unresolved:
        raise RuntimeError(f"closure rows not found in canonical tables: {sorted(unresolved)}")

    if removed:
        closed_heading = next(
            index for index, line in enumerate(output) if line.startswith("## ✅ ЗАКРЫТО")
        )
        separator = next(
            index
            for index in range(closed_heading, len(output))
            if output[index].startswith("|---")
        )
        rows_to_insert = [
            f"| {finding_id} | {CLOSURES[finding_id]['description']} | "
            f"`{CLOSURES[finding_id]['commit']}` |"
            for finding_id in CLOSURES
            if finding_id in removed_ids
        ]
        output[separator + 1 : separator + 1] = rows_to_insert

    if not any(line.startswith("| REG-001 |") for line in output):
        p2_heading = next(
            index for index, line in enumerate(output) if line.startswith("## 🟡 P2")
        )
        separator = next(
            index
            for index in range(p2_heading, len(output))
            if output[index].startswith("|---")
        )
        output.insert(separator + 1, REG_ROW)

    output, counts = rewrite_headings(output)
    output = rewrite_statistics(output, counts)
    new_matrix = "\n".join(line.rstrip() for line in output) + "\n"

    aliases = json.loads(original_aliases)
    alias_changes: list[str] = []
    for finding_id, record in DISPOSITIONS.items():
        existing = aliases["aliases"].get(finding_id)
        if existing is None:
            aliases["aliases"][finding_id] = record
            alias_changes.append(finding_id)
        elif existing != record:
            raise RuntimeError(
                f"alias disposition conflict for {finding_id}: {existing!r} != {record!r}"
            )
    new_aliases = json.dumps(aliases, ensure_ascii=False, indent=2) + "\n"

    if removed or not ARCHIVE.exists():
        ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
        doc = [
            "# Current-source forensic closures — 2026-07-23",
            "",
            "Exact source audit: run `29971872480`, artifact `8550022319` on `a73f609f`.",
            "Corrected mobile map witness: run `29972226716`, artifact `8550155361`.",
            "Final workspace-path source closure: PR #162 / `0f5b3307`.",
            "",
            "The rows below were removed from open sections and promoted to the canonical closed table. Original wording is preserved verbatim.",
        ]
        for item in removed:
            doc.extend(
                [
                    "",
                    f"## {item.finding_id}",
                    "",
                    f"- Original line: {item.line_no}",
                    f"- Original section: {item.section}",
                    "",
                    item.line,
                ]
            )
        ARCHIVE.write_text("\n".join(doc) + "\n", encoding="utf-8")

    MATRIX.write_text(new_matrix, encoding="utf-8")
    ALIASES.write_text(new_aliases, encoding="utf-8")

    report = {
        "matrixChanged": new_matrix != original_matrix,
        "aliasesChanged": new_aliases != original_aliases,
        "removedOpenRows": [item.finding_id for item in removed],
        "existingClosedRows": sorted(existing_closed),
        "aliasChanges": alias_changes,
        "counts": counts,
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    return report


def main() -> int:
    try:
        report = reconcile()
    except Exception as error:
        REPORT.parent.mkdir(parents=True, exist_ok=True)
        REPORT.write_text(
            json.dumps({"error": type(error).__name__, "message": str(error)}, indent=2)
            + "\n"
        )
        print(f"matrix reconciliation failed: {type(error).__name__}: {error}", file=sys.stderr)
        return 1
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
