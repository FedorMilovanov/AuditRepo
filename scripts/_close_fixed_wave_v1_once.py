#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-08-02_3aba5112_fixed-source-wave-v1.md"
ANCHOR = "3aba5112f0fc37712e027a1ad1d8379debe54377"
PRODUCTION = "abf1edba190280e554dfda085bef9fb6594c896d"

CLOSURES = {
    "ASTRO-P1-02": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Extended stage colors no longer collapse after the sixth palette entry: the shared MapEngine normalizes stage color resolution across timeline, legend, dots and layers. Source PR #709 closed the defect and its exact head passed eight triggered workflows; the owner file is unchanged through verifier anchor `3aba5112`.",
        "8bd891b1",
    ),
    "ENGINE-P1-21": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Screen-to-SVG projection now models centered `preserveAspectRatio=meet` letterboxing with the effective scale and offsets. Source PR #709 closed the 1.63x ruler-coordinate error; the MapEngine owner file is unchanged through `3aba5112`.",
        "8bd891b1",
    ),
    "ENGINE-P1-22": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Distance calculation now uses governed `cfg.kmPerUnit` through the canonical distance helper instead of a hardcoded `0.92` multiplier. Closed by source PR #709 and preserved through `3aba5112`.",
        "8bd891b1",
    ),
    "ENGINE-P1-23": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Marker animation targets the semantic marker-dot owner; the stale `circle:nth-child(3)` runtime selector is absent. Closed by source PR #709 and preserved through `3aba5112`.",
        "8bd891b1",
    ),
    "ENGINE-P1-28": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Gallery opening has one delegated owner and resolves the canonical full-size source once, so a thumbnail click no longer overwrites the full image. Closed by source PR #709 and preserved through `3aba5112`.",
        "8bd891b1",
    ),
    "MAP-P1-14": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Shared MapEngine CSS is protected by a bounded lease; destroying one instance removes per-instance state and cannot strip styles from another live map. Closed by source PR #709 and preserved through `3aba5112`.",
        "8bd891b1",
    ),
    "MAP-P1-15": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** The toolbar now has one governed distance-measure button and owner; the dead duplicate `#me-ruler-btn` is absent. Closed by source PR #709 and preserved through `3aba5112`.",
        "8bd891b1",
    ),
    "CSS-P1-01": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-02.** Same resolved root cause as `MAP-P1-14`: the shared `me-base-css` node is removed only after the final active lease, not when any one map is destroyed. Source PR #709; unchanged through `3aba5112`.",
        "8bd891b1",
    ),
    "GATE-P1-02": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** `atlas-label-audit.js` now measures label-label, label-marker and marker-marker overlap, clipping and safe-area hits, emits a report and includes adversarial assertions. The original zero-work audit claim is not reproducible at exact anchor `3aba5112`.",
        "3aba5112",
    ),
    "COMP-P1-01": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** Atlas preview scale derives pixels per unit from the rendered SVG `getBoundingClientRect()` width and viewBox, eliminating the adaptive max-width estimate that produced the reported error. Reverified at `3aba5112`.",
        "3aba5112",
    ),
    "ASTRO-P1-04": (
        "P1",
        "✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** Story/tour membership accepts both canonical `story.stages` and legacy `story.stage_ids`, and route validation applies the same compatibility rule. Reverified at `3aba5112`.",
        "3aba5112",
    ),
    "GATE-P1-04": (
        "P2",
        "✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** Dist smoke diagnostics filter the known local CSP/Yandex/favicon transport noise before recording page and console errors, while retaining real failures. Reverified at `3aba5112`.",
        "3aba5112",
    ),
    "QUAL-P2-03": (
        "P2",
        "✅ **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED 2026-08-02.** The absence claim is obsolete: the current page-ownership registry contains the Karty hub and all governed Karty routes, including Avraam, Ishod, Early Church, Maccabim, Melachim, Pavel, Revelation, Shoftim, Shvatim and Yeshua. Directly rechecked at `3aba5112`.",
        "3aba5112",
    ),
    "NEW-VOSK-FETCH-NO-ABORT": (
        "P3",
        "✅ **FIXED-CURRENT / SOURCE VERIFIED 2026-08-02.** The model download owns an `AbortController` and aborts the active request during cancellation/cleanup; the historical uncancellable 280 MB fetch claim is no longer reproducible. Relevant Vosk owner files are unchanged through `3aba5112`.",
        "3aba5112",
    ),
    "AR-AUDIT-17": (
        "P3",
        "✅ **STALE-ON-CURRENT-HEAD / SOURCE VERIFIED 2026-08-02.** The genealogy templates are build-time placeholder sources, not inputs to the claimed `validate:all` inline-script check; generated atlas output contains substituted data. The reported two-error gate failure is not reproducible at `3aba5112`.",
        "3aba5112",
    ),
}

EXPECTED_OLD = {"P1": 96, "P2": 36, "P3": 51, "CLOSED": 168, "OPEN": 190}
EXPECTED_NEW = {"P1": 85, "P2": 34, "P3": 49, "CLOSED": 183, "OPEN": 175}


def parse_cells(line: str) -> list[str]:
    if not line.startswith("| ") or line.startswith("|---"):
        return []
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def section_kind(heading: str) -> str | None:
    if "ЗАКРЫТО" in heading:
        return "CLOSED"
    if "P1" in heading and "ОТКРЫТО" in heading:
        return "P1"
    if "P2" in heading and "ОТКРЫТО" in heading:
        return "P2"
    if "P3" in heading and "ОТКРЫТО" in heading and "РЕФАКТОРИНГ" not in heading:
        return "P3"
    return None


def replace_exact_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one occurrence of {old!r}, found {count}")
    return text.replace(old, new, 1)


def update_matrix() -> None:
    text = MATRIX.read_text(encoding="utf-8")
    lines = text.splitlines()
    current_heading = ""
    found: dict[str, tuple[int, str, str]] = {}

    for index, line in enumerate(lines):
        if line.startswith("## "):
            current_heading = line[3:].strip()
            continue
        cells = parse_cells(line)
        if not cells:
            continue
        finding_id = cells[0]
        if finding_id in CLOSURES:
            if finding_id in found:
                raise RuntimeError(f"duplicate canonical row for {finding_id}")
            found[finding_id] = (index, section_kind(current_heading) or "OTHER", line)

    missing = sorted(set(CLOSURES) - set(found))
    if missing:
        raise RuntimeError(f"missing candidate rows: {', '.join(missing)}")

    for finding_id, (index, actual_section, _line) in found.items():
        expected_section = CLOSURES[finding_id][0]
        if actual_section != expected_section:
            raise RuntimeError(
                f"{finding_id}: expected section {expected_section}, found {actual_section}"
            )

    remove_indexes = {details[0] for details in found.values()}
    lines = [line for index, line in enumerate(lines) if index not in remove_indexes]

    closed_heading_index = next(
        index for index, line in enumerate(lines)
        if line.startswith("## ") and "ЗАКРЫТО" in line
    )
    separator_index = None
    for index in range(closed_heading_index + 1, min(closed_heading_index + 12, len(lines))):
        if lines[index].startswith("|---"):
            separator_index = index
            break
    if separator_index is None:
        raise RuntimeError("closed table separator not found")

    closed_rows = []
    for finding_id in CLOSURES:
        _section, description, reference = CLOSURES[finding_id]
        closed_rows.append(f"| {finding_id} | {description} | `{reference}` |")
    lines[separator_index + 1:separator_index + 1] = closed_rows
    text = "\n".join(lines) + "\n"

    for key in ("CLOSED", "P1", "P2", "P3"):
        if key == "CLOSED":
            old = f"## ✅ ЗАКРЫТО ({EXPECTED_OLD[key]})"
            new = f"## ✅ ЗАКРЫТО ({EXPECTED_NEW[key]})"
        else:
            old = f"{key} — ОТКРЫТО ({EXPECTED_OLD[key]})"
            new = f"{key} — ОТКРЫТО ({EXPECTED_NEW[key]})"
        text = replace_exact_once(text, old, new, f"{key} heading")

    stats = {
        "| Закрыто (fixed) | 168 |": "| Закрыто (fixed) | 183 |",
        "| P1 открыто | 96 |": "| P1 открыто | 85 |",
        "| P2 открыто | 36 |": "| P2 открыто | 34 |",
        "| P3 открыто | 51 |": "| P3 открыто | 49 |",
        "| **Всего открыто (матрица)** | **190** |": "| **Всего открыто (матрица)** | **175** |",
    }
    for old, new in stats.items():
        text = replace_exact_once(text, old, new, f"statistics {old}")

    status_line = re.compile(r"^\| Source verification anchor \|.*\|$", re.MULTILINE)
    matches = status_line.findall(text)
    if len(matches) != 1:
        raise RuntimeError(f"source anchor row count: {len(matches)}")
    new_status = (
        "| Source verification anchor | `3aba5112f0fc37712e027a1ad1d8379debe54377` "
        "(exact closure-wave V1 anchor). Fifteen source/data findings were independently "
        "reverified: eight MapEngine rows remain fixed by source PR #709 with their owner "
        "file unchanged, and seven additional rows are fixed/stale on this exact anchor. "
        "This is a finding-disposition anchor, not a production claim. |"
    )
    text = status_line.sub(new_status, text, count=1)

    last_reverify = re.compile(r"^\| Last reverify \|.*\|$", re.MULTILINE)
    if len(last_reverify.findall(text)) != 1:
        raise RuntimeError("Last reverify row is not unique")
    text = last_reverify.sub(
        "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_3aba5112_fixed-source-wave-v1.md` |",
        text,
        count=1,
    )

    warning_pattern = re.compile(
        r"^⚠️ Deploy-формулировки.*?\n\n_История сессий",
        re.MULTILINE | re.DOTALL,
    )
    if len(warning_pattern.findall(text)) != 1:
        raise RuntimeError("status warning paragraph is not unique")
    warning = (
        "⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. "
        "Exact finding-disposition anchor for closure wave V1 = `3aba5112f0fc37712e027a1ad1d8379debe54377`; "
        "last exact production authority remains `abf1edba190280e554dfda085bef9fb6594c896d`. "
        "The matrix is a durable verified backlog, not per-commit telemetry. Fifteen findings are closed "
        "because their claims are fixed or stale on the selected anchor; later source movement does not "
        "silently reopen or close rows without a new applicable reverify. Active source PR #680 remains "
        "outside this AuditRepo-only lane. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_3aba5112_fixed-source-wave-v1.md`.\n\n"
        "_История сессий"
    )
    text = warning_pattern.sub(warning, text, count=1)

    session_marker = "## Session log (append-only)\n"
    if text.count(session_marker) != 1:
        raise RuntimeError("Session log marker is not unique")
    session = (
        "\n### 2026-08-02 — fixed-source closure wave V1 @ `3aba5112`\n"
        "- Reverified 15 source/data candidates against exact source anchor `3aba5112f0fc37712e027a1ad1d8379debe54377`.\n"
        "- Closed 11 P1, 2 P2 and 2 P3 rows as `FIXED-CURRENT` or `STALE-ON-CURRENT-HEAD`; no browser-only row was promoted.\n"
        "- Canonical arithmetic moved from **168 closed / 190 open** to **183 closed / 175 open** while retaining **358 total IDs**.\n"
        "- `A11Y-P1-01` and `QUAL-P1-04` remain open pending exact-anchor browser evidence. No product or production mutation is claimed.\n"
    )
    text = text.replace(session_marker, session_marker + session, 1)
    MATRIX.write_text(text, encoding="utf-8")


def write_next() -> None:
    content = f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Meaningful handoff only.** The matrix is a durable verified backlog, not per-commit source telemetry.

**Exact finding-disposition anchor:** `{ANCHOR}`
**Last exact production authority:** `{PRODUCTION}`
**Deployment status:** ⚠️ source verification `!=` production; this closure wave makes no production claim.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_3aba5112_fixed-source-wave-v1.md`
**Canonical matrix:** **358 IDs = 183 closed + 175 open**.

## What changed

Closure wave V1 independently reverified and closed 15 source/data findings:

- 11 P1 rows: `ASTRO-P1-02`, `ASTRO-P1-04`, `ENGINE-P1-21`, `ENGINE-P1-22`, `ENGINE-P1-23`, `ENGINE-P1-28`, `MAP-P1-14`, `MAP-P1-15`, `GATE-P1-02`, `COMP-P1-01`, `CSS-P1-01`;
- 2 P2 rows: `GATE-P1-04`, `QUAL-P2-03`;
- 2 P3 rows: `NEW-VOSK-FETCH-NO-ABORT`, `AR-AUDIT-17`.

Eight MapEngine rows are fixed by source PR #709 / merge `8bd891b1371d4ac2438f9026e40a9c723856556b`; their owner file is unchanged through the selected anchor. The remaining rows were directly carried forward or rechecked on `{ANCHOR}`. Browser-only candidates were not closed.

## Current counts

- P0: 0
- P1: 85
- P2: 34
- P3: 49
- Refactoring: 4
- AuditRepo: 3
- Total open: 175
- Closed: 183

## Next meaningful work

1. Run the expanded exact-anchor browser/runtime wave for 23 rows, including `AVRAAM-P1-04`, `A11Y-P1-01` and `QUAL-P1-04` in addition to the previous plan.
2. Close every browser result as fixed/stale/false/duplicate or narrow it to the real residual; keep only confirmed-current findings open.
3. Repair confirmed-current clusters in independent bounded lanes: MapEngine runtime, base geography/rivers/SVG, Karty data/schema, sheet/atlas engine, SW/media and Vosk cleanup.
4. Do not modify active source PR #680 or manually edit `migration/route-migration-matrix.json`.
5. Do not create an AuditRepo sync solely because source `main` moved; update only material finding/evidence/handoff facts.
"""
    NEXT.write_text(content, encoding="utf-8")


def write_reverify() -> None:
    rows = []
    for finding_id, (section, description, reference) in CLOSURES.items():
        disposition = "STALE-ON-CURRENT-HEAD" if "STALE-ON-CURRENT-HEAD" in description else "FIXED-CURRENT"
        rows.append(f"| `{finding_id}` | {section} | {disposition} | `{reference}` |")
    table = "\n".join(rows)
    content = f"""# Fixed-source closure wave V1 — exact anchor `3aba5112`

**AuditRepo base:** `f58b8c73af9e095833d563e2d67d74dd97c7b234`  
**Exact source verification anchor:** `{ANCHOR}`  
**Last exact production authority:** `{PRODUCTION}`  
**Production claim:** none

## Purpose

Reduce the verified backlog using the owner workflow: verify first, close fixed/stale findings canonically, and leave browser-only or still-current claims open. This transaction changes no product source and does not treat source movement as a reason for authority-only synchronization.

## Boundary and method

- The 17 fixed candidates from the SD-6..SD-15 intake were re-read.
- `A11Y-P1-01` and `QUAL-P1-04` remain open because their final disposition requires browser evidence.
- Source PR #709 / merge `8bd891b1371d4ac2438f9026e40a9c723856556b` explicitly closed the MapEngine runtime cluster and passed eight exact-head workflows. Comparing that merge to `{ANCHOR}` shows no later change to `karty/_engine/map-engine.js`.
- Comparing the earlier inspection anchor `2273b8c930eebf383d429b917d3636bc28a80bae` to `{ANCHOR}` shows no changes to the remaining evidence-critical owner files except `migration/page-ownership.json`; that registry was directly re-read on the exact anchor and contains the governed Karty routes.
- No still-open disposition from the 39 confirmed-current source/data set is changed here.

## Closed dispositions

| ID | Former section | Final disposition | Immutable/source reference |
|---|---:|---|---|
{table}

## Arithmetic

```text
canonical IDs: 358 -> 358
closed:        168 -> 183
open:          190 -> 175
P0:              0 -> 0
P1:             96 -> 85
P2:             36 -> 34
P3:             51 -> 49
Refactoring:     4 -> 4
AuditRepo:       3 -> 3
```

## Evidence sources

- `incoming/arena-sync-assessment/2026-08-01/VERIFIED_DISPOSITIONS.md`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd6_verified_on_2273b8c9.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd9_data_validation.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd11_sheet_engine_gate.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd12_remaining_units.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd13_tour_a11y.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd14_gate_draw.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd15_vosk_genealogy.txt`
- source PR #709 exact-head CI and merge evidence
- direct exact-anchor read of `migration/page-ownership.json`

## Next gate

The next verifier wave is browser/runtime evidence for 23 rows. Product repairs begin only for rows that remain `CONFIRMED-CURRENT` after that wave, in independent bounded lanes.
"""
    if REVERIFY.exists():
        raise RuntimeError(f"reverify already exists: {REVERIFY}")
    REVERIFY.write_text(content, encoding="utf-8")


def validate() -> None:
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


def main() -> int:
    update_matrix()
    write_next()
    write_reverify()
    validate()
    print("fixed-source closure wave V1 staged: 358 = 183 closed + 175 open")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
