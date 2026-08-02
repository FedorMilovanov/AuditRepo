#!/usr/bin/env python3
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX_PATH = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT_PATH = PROJECT / "NEXT_AGENT_PROMPT.md"
ALIASES_PATH = PROJECT / "verified" / "MATRIX_ID_ALIASES.json"
LIB_PATH = ROOT / "scripts" / "matrix_coverage_lib.py"
TEST_PATH = ROOT / "scripts" / "matrix_coverage_regression_test.py"
WORKFLOW_PATH = ROOT / ".github" / "workflows" / "auditrepo-validate.yml"
REVERIFY_PATH = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-08-02_5373c985_matrix-reconciliation.md"

SOURCE = "5373c9854b3f1bb767cf18c4539de82db26b7b7a"
PRODUCTION = "abf1edba190280e554dfda085bef9fb6594c896d"
REVERIFY_REL = "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_5373c985_matrix-reconciliation.md"


def read(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: pathlib.Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one occurrence, got {count}")
    return text.replace(old, new, 1)


def regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one regex match, got {count}")
    return updated


def update_matrix() -> None:
    text = read(MATRIX_PATH)

    text = regex_once(
        text,
        r"^\| Source HEAD \|.*$",
        f"| Source HEAD | `{SOURCE}` (current source main; 54 commits ahead of previous canonical `efaf2a51`; includes the Pihahiroth uncertainty release lane; source-only authority, no production claim) |",
        "matrix source head",
    )
    text = regex_once(
        text,
        r"^\| Deploy \|.*$",
        f"| Deploy | ⚠️ **SOURCE ≠ PRODUCTION.** Last exact production remains run `30669840189` attempt `1`, release/control SHA `{PRODUCTION}`, candidate `{PRODUCTION}:30669840189-1`, release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`. Current source `{SOURCE}` requires a new same-SHA production witness. |",
        "matrix deploy row",
    )
    text = regex_once(
        text,
        r"^\| Last reverify \|.*$",
        f"| Last reverify | `{REVERIFY_REL}` |",
        "matrix last reverify",
    )
    text = regex_once(
        text,
        r"^⚠️ Deploy-формулировки.*$",
        f"⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. Current source = `{SOURCE}`; last exact production authority = `{PRODUCTION}`. Source is 54 commits ahead of the former canonical `efaf2a51`; the final nine commits after AuditRepo PR #120 include the Pihahiroth/Ishod release lane, so Ishod browser/runtime verdicts require a fresh exact-head witness. Active source owner at capture: draft PR #680 NoteRegistry, based on `{SOURCE}`; не вмешиваться в его ветку. Evidence: `{REVERIFY_REL}`.",
        "matrix authority warning",
    )

    text = replace_once(text, "## ✅ ЗАКРЫТО (165)", "## ✅ ЗАКРЫТО (168)", "closed heading")
    text = replace_once(
        text,
        "| NEW-68/69 | CSP form-action regression | `14574a9a` |",
        "| NEW-68 | Dist CSP omitted `form-action 'self'` | `14574a9a` |\n"
        "| NEW-69 | Astro Karty routes omitted the CSP meta projection | `14574a9a` |\n"
        "| AR-006 | ✅ **CLOSED 2026-07-14 / CANONICALIZED 2026-08-02.** AuditRepo root allowlists and structure validation were hardened; stray root/intake violations were moved or completed without deleting evidence, and both validators passed. The row was previously marked CLOSED while physically counted in the open AUDITREPO section. | `4c069662` |",
        "split NEW-68/69 and move AR-006",
    )
    text = replace_once(text, "## 🟣 AUDITREPO (4)", "## 🟣 AUDITREPO (3)", "auditrepo heading")
    text = regex_once(
        text,
        r"^\| AR-006 \|.*\n",
        "",
        "remove AR-006 from open section",
    )

    text = regex_once(
        text,
        r"^## Статистика \(обновлено.*\)$",
        f"## Статистика (обновлено 2026-08-02: source `{SOURCE[:8]}`; last exact production `{PRODUCTION[:8]}`; 358 canonical = 168 closed + 190 open)",
        "statistics heading",
    )
    text = replace_once(text, "| Закрыто (fixed) | 165 |", "| Закрыто (fixed) | 168 |", "closed stats")
    text = replace_once(text, "| AuditRepo | 4 |", "| AuditRepo | 3 |", "auditrepo stats")
    text = replace_once(
        text,
        "| **Всего открыто (матрица)** | **191** |",
        "| **Всего открыто (матрица)** | **190** |",
        "open total stats",
    )

    session_entry = f"""## Session log (append-only)

### 2026-08-02 — verifier matrix reconciliation @ source `{SOURCE[:8]}`
- Authority advanced from stale `efaf2a51` to exact current source `{SOURCE}` (**54 commits**, source-only; production remains `{PRODUCTION}`).
- Corrected canonical identity: combined noncanonical row `NEW-68/69` became two distinct closed IDs `NEW-68` and `NEW-69`; total canonical count therefore increases by **2**, not 1.
- Moved `AR-006` from the open AUDITREPO table to closed; open AUDITREPO 4→3, total open 191→190, closed 165→168, total canonical 356→358.
- Registered `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` as informational rights-policy evidence IDs.
- Hardened matrix coverage against noncanonical table IDs, explicit CLOSED rows inside open sections, section/stat counter drift, and fixed the `tee`/missing-`pipefail` false-green in CI.
- Exact rationale and source-delta boundary: `{REVERIFY_REL}`.
"""
    text = replace_once(text, "## Session log (append-only)\n", session_entry, "session log entry")
    write(MATRIX_PATH, text)


def update_aliases() -> None:
    data = json.loads(read(ALIASES_PATH))
    aliases = data["aliases"]
    for finding_id in ("NEW-68", "NEW-69"):
        removed = aliases.pop(finding_id, None)
        if removed is None:
            raise RuntimeError(f"missing expected registry entry {finding_id}")
    aliases["RIGHT-4Q204-OPEN-SCHEMATIC"] = {
        "status": "informational",
        "reason": "Research rights-policy evidence label for an open schematic; it is not a product defect and does not belong in the bug matrix.",
    }
    aliases["RIGHT-P72-TEXT-LINK-ONLY"] = {
        "status": "informational",
        "reason": "Research rights-policy evidence label limiting P72 to a text link; it is not a product defect and does not belong in the bug matrix.",
    }
    write(ALIASES_PATH, json.dumps(data, ensure_ascii=False, indent=2))


def update_next() -> None:
    content = f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Source main:** `{SOURCE}`  
**Last exact production authority:** `{PRODUCTION}`  
**Current source deployment status:** ⚠️ `source != production`; same-SHA production witness для текущего source отсутствует.  
**Current reverify:** `{REVERIFY_REL}`  
**Canonical matrix:** **358 IDs = 168 closed + 190 open**.

## 1. Точная граница source

- current source `main` = `{SOURCE}`;
- previous canonical source `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` is **54 commits behind**;
- AuditRepo PR #120 merge-time anchor `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97` is **9 commits behind**;
- the final nine commits add the Pihahiroth uncertainty release lane and modify Ishod projection files (`src/components/karty/ishod/IshodMap.astro`, `IshodPageHead.astro`, authority/contract/workflow files); therefore Ishod browser/runtime verdicts require a fresh exact-head witness and are not inherited source-only;
- active source owner: draft PR #680 NoteRegistry, based on `{SOURCE}`; do not modify its branch or owner files;
- no post-`{PRODUCTION[:8]}` source merge is production without a separate same-SHA witness.

## 2. Last exact production

- deploy `30669840189`, attempt `1`, event `push`;
- release SHA = control-plane SHA = `{PRODUCTION}`;
- candidate `{PRODUCTION}:30669840189-1`;
- release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- candidate artifact `8808656612`; generic live `8808666936`; TTS `8808667707`;
- release ledger comment `5148074092`; physical Windows witness `5148209495`.

```text
current source = {SOURCE}
last exact production = {PRODUCTION}
source != production
```

## 3. Матрица и AuditRepo

- `NEW-68` and `NEW-69` are separate closed canonical IDs; the former slash row counted as zero IDs, so the repair adds two canonical IDs;
- `AR-006` is closed and no longer counted in the open AUDITREPO section;
- counters: P0 0, P1 96, P2 36, P3 51, Refactoring 4, AuditRepo 3; total open 190; closed 168;
- rights-policy labels `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` are informational registry entries, not bugs;
- matrix coverage is blocking and must report zero diagnostics; CI uses `pipefail`, so `check_matrix_coverage.py | tee` cannot hide a non-zero exit;
- noncanonical table IDs, explicit CLOSED rows in open sections, heading/stat counter drift and unregistered reverify IDs are permanent blocking diagnostics.

## 4. Следующий порядок

1. Do not promote `{SOURCE[:8]}` to production authority without exact same-SHA readiness → candidate → Pages/live → TTS → ledger evidence.
2. Do not interfere with active owner PR #680.
3. Re-run Ishod/Pihahiroth browser/runtime verification on the exact current source before changing related matrix statuses.
4. Keep canonical counters synchronized atomically between this file and `MASTER_BUG_MATRIX.md`.
"""
    write(NEXT_PATH, content)


def update_coverage_lib() -> None:
    text = read(LIB_PATH)
    helper = r'''

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
'''
    text = replace_once(text, "\ndef candidate_is_credible(\n", helper + "\ndef candidate_is_credible(\n", "insert matrix integrity helper")
    text = replace_once(
        text,
        '    matrix_rows, open_ids, closed_rows = parse_matrix(\n        matrix_path.read_text(encoding="utf-8")\n    )\n',
        '    matrix_text = matrix_path.read_text(encoding="utf-8")\n    matrix_rows, open_ids, closed_rows = parse_matrix(matrix_text)\n',
        "retain matrix text",
    )
    text = replace_once(
        text,
        "    problems: list[str] = []\n    archived_only: list[str] = []\n",
        "    problems: list[str] = matrix_integrity_problems(matrix_text, matrix_rows)\n    archived_only: list[str] = []\n",
        "seed structural problems",
    )
    write(LIB_PATH, text)


def update_regression_tests() -> None:
    text = read(TEST_PATH)
    text = replace_once(
        text,
        "def write_project(root: pathlib.Path, entries: dict[str, object], ignored=None) -> pathlib.Path:\n",
        "def write_project(\n    root: pathlib.Path,\n    entries: dict[str, object],\n    ignored=None,\n    matrix: str = MATRIX,\n) -> pathlib.Path:\n",
        "test helper signature",
    )
    text = replace_once(
        text,
        "        MATRIX, encoding=\"utf-8\"\n",
        "        matrix, encoding=\"utf-8\"\n",
        "test helper matrix parameter",
    )
    insertion = r'''

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
'''
    text = replace_once(
        text,
        "\n    print(\"matrix coverage regression tests: PASS\")\n",
        insertion + "\n    print(\"matrix coverage regression tests: PASS\")\n",
        "add matrix shape regressions",
    )
    write(TEST_PATH, text)


def update_workflow() -> None:
    text = read(WORKFLOW_PATH)
    text = replace_once(
        text,
        "      - name: Enforce matrix evidence coverage\n        run: |\n          mkdir -p reports/matrix-coverage\n",
        "      - name: Enforce matrix evidence coverage\n        run: |\n          set -o pipefail\n          mkdir -p reports/matrix-coverage\n",
        "workflow pipefail",
    )
    write(WORKFLOW_PATH, text)


def create_reverify() -> None:
    content = f"""# Current-head matrix reconciliation — 2026-08-02 — `{SOURCE[:8]}`

**AuditRepo base:** `a4ac63a1bfaa2549766cf911f3de886f21873875` (PR #120 merge)  
**Exact source main:** `{SOURCE}`  
**Previous canonical source:** `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` (**54 commits behind**)  
**PR #120 merge-time source anchor:** `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97` (**9 commits behind**)  
**Last exact production:** `{PRODUCTION}`  
**Production claim:** no; `source != production`

## Why this transaction exists

The post-PR-120 independent audit found four canonical/control-plane defects:

1. `NEW-68/69` was a physical closed-table row but not a canonical ID because `/` violates the matrix ID grammar. It represented two distinct bugs and counted as zero IDs.
2. `AR-006` was explicitly marked CLOSED while remaining in the open AUDITREPO section and in the 191-open total.
3. Two rights-policy evidence IDs were visible in reverify but absent from matrix/registry: `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY`.
4. The supposedly blocking coverage job piped `check_matrix_coverage.py` into `tee` without `pipefail`; the script returned 1 for the two diagnostics, but Bash returned the status of `tee`, so CI was falsely green.

## Correct arithmetic

Before repair:

- 356 canonical IDs = 165 closed + 191 open;
- `NEW-68/69` contributed **0** canonical IDs;
- `AR-006` contributed one canonical ID to open despite its CLOSED state.

After repair:

- split `NEW-68/69` → `NEW-68` + `NEW-69`: **+2 canonical closed IDs**;
- move `AR-006` open → closed: total unchanged, closed +1, open −1;
- final: **358 canonical IDs = 168 closed + 190 open**;
- section totals: P0 0, P1 96, P2 36, P3 51, Refactoring 4, AuditRepo 3.

The older proposal “split → 357 total” was rejected as arithmetically incorrect: replacing a zero-count slash row with two canonical IDs increases 356 to 358.

## Source delta boundary

The 9-commit delta from `8f17085d` to `{SOURCE[:8]}` adds the Pihahiroth uncertainty release lane and changes Ishod projection surfaces, including `IshodMap.astro` and `IshodPageHead.astro`. Therefore Ishod/browser/runtime classifications from the earlier source-only carry-forward are not auto-closed here. This transaction updates authority and matrix governance only.

Draft source PR #680 NoteRegistry is active and based on `{SOURCE}`. Its branch and owner files are outside this AuditRepo transaction.

## Permanent control-plane changes

- noncanonical IDs in canonical tables are blocking (`NONCANONICAL-MATRIX-ID`);
- an explicit CLOSED description inside an open section is blocking (`CLOSED-IN-OPEN`);
- section heading and statistics drift are blocking (`SECTION-COUNT-MISMATCH`, `STAT-COUNT-MISMATCH`);
- unregistered reverify IDs remain blocking;
- workflow uses `set -o pipefail`, so `check_matrix_coverage.py | tee` preserves the checker exit status;
- regression fixtures cover slash IDs, closed-in-open rows and heading count drift.

## Boundary

No product source, Research corpus or production artifact is modified. This is an AuditRepo canonical verifier transaction. Exact-head CI and post-merge re-read are required before declaring completion.
"""
    if REVERIFY_PATH.exists():
        raise RuntimeError(f"reverify already exists: {REVERIFY_PATH}")
    write(REVERIFY_PATH, content)


def main() -> int:
    update_matrix()
    update_aliases()
    update_next()
    update_coverage_lib()
    update_regression_tests()
    update_workflow()
    create_reverify()
    print("matrix reconciliation staged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
