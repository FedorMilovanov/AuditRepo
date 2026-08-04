#!/usr/bin/env python3
"""Build and validate the exact read-only reconciliation tree for AuditRepo PR #156."""

from __future__ import annotations

import json
import os
from pathlib import Path
import re
import subprocess
import sys

REPO = Path.cwd()
SEARCH_SHA = "aba0b1f43201875654d9f39b3cae0fe87e281acc"
ORIGINAL_VALIDATE_BLOB = "e390868339ee5b35c6517e736628fb3b8f7bf9ab"
MATRIX = Path("projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md")
HANDOFF = Path("projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md")
CUSTOM_WORKFLOW = Path(".github/workflows/reconcile-pr156.yml")
TRUSTED_WORKFLOW = Path(".github/workflows/auditrepo-validate.yml")
HELPER = Path("scripts/reconcile_pr156_artifact.py")
OUTPUT = Path("/tmp/reconcile-output")

P1_IDS = ["SEARCH-P1-01", "SEARCH-P1-03", "SEARCH-P1-04"]
P2_IDS = [
    "SEARCH-P2-07",
    "SEARCH-P2-08",
    "SEARCH-P2-09",
    "SEARCH-P2-10",
    "SEARCH-P2-11",
    "SEARCH-P2-12",
]
P3_IDS = ["SEARCH-P3-01", "SEARCH-P3-02", "SEARCH-P3-03"]
ALL_IDS = P1_IDS + P2_IDS + P3_IDS


def run(*args: str, capture: bool = False, check: bool = True) -> str:
    result = subprocess.run(
        args,
        cwd=REPO,
        text=True,
        check=check,
        stdout=subprocess.PIPE if capture else None,
        stderr=None,
    )
    return result.stdout.strip() if capture and result.stdout else ""


def git_show(ref: str, path: Path) -> str:
    return run("git", "show", f"{ref}:{path.as_posix()}", capture=True)


def require_once(text: str, needle: str, label: str) -> str:
    count = text.count(needle)
    if count != 1:
        raise SystemExit(f"{label}: expected one exact anchor, got {count}: {needle}")
    return text


def reconcile_matrix(main_matrix: str, search_matrix: str) -> str:
    search_lines = search_matrix.splitlines()

    def one_row(finding_id: str) -> str:
        prefix = f"| {finding_id} |"
        rows = [line for line in search_lines if line.startswith(prefix)]
        if len(rows) != 1:
            raise SystemExit(
                f"{finding_id}: expected one source row, got {len(rows)}"
            )
        return rows[0]

    rows = {finding_id: one_row(finding_id) for finding_id in ALL_IDS}
    text = main_matrix
    for finding_id in ALL_IDS:
        if re.search(rf"^\| {re.escape(finding_id)} \|", text, re.M):
            raise SystemExit(f"{finding_id}: already exists in current main")

    text, changed = re.subn(
        r"^\| Last reverify \|.*$",
        "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_search-untested-reduction.md` (latest search reduction; refined Nagornaya browser authority remains `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-browser.md`). |",
        text,
        count=1,
        flags=re.M,
    )
    if changed != 1:
        raise SystemExit("Last reverify row drift")

    for old, new in [
        ("## 🟠 P1 — ОТКРЫТО (69)", "## 🟠 P1 — ОТКРЫТО (72)"),
        ("## 🟡 P2 — ОТКРЫТО (26)", "## 🟡 P2 — ОТКРЫТО (32)"),
    ]:
        require_once(text, old, "severity heading drift")
        text = text.replace(old, new, 1)

    p1_anchor = (
        "## 🟠 P1 — ОТКРЫТО (72)\n\n"
        "| ID | Описание | Witnesses |\n|---|---|---|\n"
    )
    p2_anchor = (
        "## 🟡 P2 — ОТКРЫТО (32)\n\n"
        "| ID | Описание | Witnesses |\n|---|---|---|\n"
    )
    require_once(text, p1_anchor, "P1 table anchor drift")
    require_once(text, p2_anchor, "P2 table anchor drift")
    text = text.replace(
        p1_anchor, p1_anchor + "\n".join(rows[x] for x in P1_IDS) + "\n", 1
    )
    text = text.replace(
        p2_anchor, p2_anchor + "\n".join(rows[x] for x in P2_IDS) + "\n", 1
    )

    p3_old = "## 🟢 P3 — ОТКРЫТО (37)"
    p3_new = "## 🟢 P3 — ОТКРЫТО (40)"
    require_once(text, p3_old, "P3 heading drift")
    text = text.replace(
        p3_old + "\n",
        p3_new + "\n" + "\n".join(rows[x] for x in P3_IDS) + "\n",
        1,
    )

    text, changed = re.subn(
        r"^## Статистика \(обновлено 2026-08-04: disposition anchor `f9d01207`; last exact production `abf1edba`; 358 canonical = 219 closed \+ 139 open\)$",
        "## Статистика (обновлено 2026-08-04: disposition anchor `f9d01207`; last exact production `abf1edba`; 370 canonical = 219 closed + 151 open)",
        text,
        count=1,
        flags=re.M,
    )
    if changed != 1:
        raise SystemExit("statistics heading drift")

    for old, new in {
        "| P1 открыто | 69 |": "| P1 открыто | 72 |",
        "| P2 открыто | 26 |": "| P2 открыто | 32 |",
        "| P3 открыто | 37 |": "| P3 открыто | 40 |",
        "| **Всего открыто (матрица)** | **139** |": "| **Всего открыто (матрица)** | **151** |",
    }.items():
        require_once(text, old, "statistic row drift")
        text = text.replace(old, new, 1)

    marker = "### 2026-08-04 — search / Scripture audit intake promoted to matrix"
    position = search_matrix.find(marker)
    if position < 0:
        raise SystemExit("search session log marker missing")
    if marker in text:
        raise SystemExit("search session log already exists in current main")
    session = search_matrix[position:].strip()
    for old, new in {
        "P1 `70 → 73`, P2 `29 → 31`, total open `145 → 150`, closed unchanged `213`": "P1 `69 → 72`, P2 `26 → 28`, total open `139 → 144`, closed unchanged `219`",
        "P2 `31 → 33`, total open `150 → 152`, closed unchanged `213`": "P2 `28 → 30`, total open `144 → 146`, closed unchanged `219`",
        "P2 `33 → 35`, total open `152 → 154`, closed unchanged `213`": "P2 `30 → 32`, total open `146 → 148`, closed unchanged `219`",
        "P3 `39 → 42`, total open `154 → 157`, closed unchanged `213`": "P3 `37 → 40`, total open `148 → 151`, closed unchanged `219`",
    }.items():
        require_once(session, old, "session arithmetic drift")
        session = session.replace(old, new, 1)
    text = text.rstrip() + "\n\n" + session + "\n"

    for finding_id in ALL_IDS:
        count = len(re.findall(rf"^\| {re.escape(finding_id)} \|", text, re.M))
        if count != 1:
            raise SystemExit(f"{finding_id}: merged row multiplicity {count}")

    for token in [
        "## ✅ ЗАКРЫТО (219)",
        "## 🟠 P1 — ОТКРЫТО (72)",
        "## 🟡 P2 — ОТКРЫТО (32)",
        "## 🟢 P3 — ОТКРЫТО (40)",
        "370 canonical = 219 closed + 151 open",
    ]:
        if token not in text:
            raise SystemExit(f"merged matrix missing: {token}")
    return text


def reconcile_handoff(main_handoff: str) -> str:
    text = main_handoff
    text, changed = re.subn(
        r"^\*\*Current reverify:\*\*.*$",
        "**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_search-untested-reduction.md` (latest search reduction; matrix movement: `...search-polish-discovery.md`; refined Nagornaya authority: `...nagornaya-dark-browser.md`).",
        text,
        count=1,
        flags=re.M,
    )
    if changed != 1:
        raise SystemExit("handoff reverify drift")
    text, changed = re.subn(
        r"^\*\*Canonical matrix:\*\*.*$",
        "**Canonical matrix:** **370 IDs = 219 closed + 151 open**.",
        text,
        count=1,
        flags=re.M,
    )
    if changed != 1:
        raise SystemExit("handoff matrix-count drift")

    convergence_key = (
        "Source movement does **not** change canonical AuditRepo counts by itself."
    )
    start = text.find(convergence_key)
    if start < 0:
        raise SystemExit("handoff convergence paragraph missing")
    end = text.find("\n\n", start)
    if end < 0:
        raise SystemExit("handoff convergence paragraph end missing")
    paragraph = text[start:end]
    paragraph += (
        " This reconciliation adds twelve verified current-source "
        "search/Scripture rows without Product mutation, same-SHA production "
        "claim or browser-pixel claim."
    )
    text = text[:start] + paragraph + text[end:]

    active_start = text.index("## Active canonical owner lanes")
    counts_start = text.index("## Current counts", active_start)
    active = """## Active canonical owner lanes

### Product repository

- Product PR #885 (`fix/nagornaya-dark-refined-repair-20260804`) is the bounded non-TTS `NG-DARK-01` repair owner for the refined **9 tokens / 142 uses** Chromium boundary. It remains draft until exact-head checks, final diff and review-thread gates pass.
- Product PRs #875/#876 are disjoint TTS audit/repair lanes and must not be modified or absorbed by search/Nagornaya work.
- Product `main@f9d0120718569c510833dba7a3abd68ce2f6a003` remains source authority; no same-SHA production claim exists for it.

### AuditRepo

- PR #148 is the disjoint TTS evidence lane and remains untouched.
- PR #156 (`arena/019fccbd-auditrepo`) promotes twelve search/Scripture findings plus evidence, reverifies and bounded repair plans while preserving all six current-main closure dispositions.

"""
    text = text[:active_start] + active + text[counts_start:]

    counts_start = text.index("## Current counts")
    next_header = text.index("## Wave A closure this handoff", counts_start)
    counts = """## Current counts

- P0: 0
- P1: 72
- P2: 32
- P3: 40
- Refactoring: 4
- AuditRepo: 3
- Total open: 151
- Closed: 219

"""
    text = text[:counts_start] + counts + text[next_header:]

    next_start = text.index("## Next meaningful work")
    next_text = """## Next meaningful work

1. Merge AuditRepo PR #156 only after exact-head validator, matrix coverage, repository-history forensic, final-diff and review-thread gates pass.
2. Then finish Product PR #885 against only the refined `NG-DARK-01` boundary (**9 tokens / 142 uses**), run exact-head browser/build/static gates, merge safely, and close it in a separate AuditRepo transaction.
3. After the Nagornaya closure, start the bounded search repair sequence with `SEARCH-P1-03`/`SEARCH-P1-04`: truthful Scripture-tab semantics plus a generated `BibleRef → pages/anchors/context/topics` site-occurrence index. Use `working/SEARCH_SCRIPTURE_REPAIR_PLAN_2026-08-04.md` and `working/SEARCH_SCRIPTURE_INDEX_CONTRACT_SPEC_2026-08-04.md`.
4. Preserve `SEARCH-SCRIPTURE-BROKEN` as historically closed; the new rows own higher-standard exact-reference/site-occurrence/corpus defects.
5. `SEARCH-P1-01`, `SEARCH-P2-09`–`12`, `QUAL-P1-06`, narrowed `QUAL-P1-09`, and `MAP-P1-20` remain independent candidates; perform collision pre-flight before mutation.
6. Preserve Single-Writer-Per-Fact and make no production claim without same-SHA live evidence. TTS lanes remain excluded.
"""
    return text[:next_start] + next_text


def main() -> int:
    if not (REPO / ".git").exists():
        raise SystemExit("must run from repository root")

    run("git", "fetch", "origin", "main", "arena/019fccbd-auditrepo", "--prune")
    main_sha = run("git", "rev-parse", "origin/main", capture=True)
    search_sha = run(
        "git", "rev-parse", "origin/arena/019fccbd-auditrepo", capture=True
    )
    if search_sha != SEARCH_SHA:
        raise SystemExit(f"search head drift: expected {SEARCH_SHA}, got {search_sha}")

    main_matrix = git_show(main_sha, MATRIX)
    main_handoff = git_show(main_sha, HANDOFF)
    search_matrix = git_show(search_sha, MATRIX)

    run("git", "checkout", "--detach", search_sha)
    merge = subprocess.run(
        ["git", "merge", "--no-commit", "--no-ff", main_sha],
        cwd=REPO,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    print(merge.stdout)

    conflicts = sorted(
        filter(
            None,
            run("git", "diff", "--name-only", "--diff-filter=U", capture=True).splitlines(),
        )
    )
    expected_conflicts = sorted([MATRIX.as_posix(), HANDOFF.as_posix()])
    if conflicts != expected_conflicts:
        raise SystemExit(
            f"unexpected conflicts: expected {expected_conflicts}, got {conflicts}"
        )

    MATRIX.write_text(
        reconcile_matrix(main_matrix, search_matrix), encoding="utf-8"
    )
    HANDOFF.write_text(reconcile_handoff(main_handoff), encoding="utf-8")
    run("git", "add", MATRIX.as_posix(), HANDOFF.as_posix())

    for path in [CUSTOM_WORKFLOW, HELPER]:
        if path.exists() or run("git", "ls-files", "--error-unmatch", path.as_posix(), check=False) == "":
            run("git", "rm", "-f", "--ignore-unmatch", path.as_posix())

    run(
        "git",
        "update-index",
        "--add",
        "--cacheinfo",
        "100644",
        ORIGINAL_VALIDATE_BLOB,
        TRUSTED_WORKFLOW.as_posix(),
    )
    run("git", "checkout-index", "-f", "--", TRUSTED_WORKFLOW.as_posix())

    unresolved = run(
        "git", "diff", "--name-only", "--diff-filter=U", capture=True
    )
    if unresolved:
        raise SystemExit(f"unresolved files remain: {unresolved}")

    run("git", "diff", "--cached", "--check")
    run(sys.executable, "scripts/validate_audit_repo.py")
    run(sys.executable, "scripts/check_matrix_coverage.py")
    forensic_env = os.environ.copy()
    forensic_env.setdefault("GITHUB_TOKEN", os.environ.get("GITHUB_TOKEN", ""))
    subprocess.run(
        ["node", "scripts/repository_history_forensic_audit.mjs", "--strict"],
        cwd=REPO,
        env=forensic_env,
        check=True,
    )

    OUTPUT.mkdir(parents=True, exist_ok=True)
    canonical = OUTPUT / "canonical"
    canonical.mkdir(parents=True, exist_ok=True)
    (canonical / MATRIX.name).write_text(MATRIX.read_text(encoding="utf-8"), encoding="utf-8")
    (canonical / HANDOFF.name).write_text(HANDOFF.read_text(encoding="utf-8"), encoding="utf-8")

    main_tree = run("git", "rev-parse", f"{main_sha}^{{tree}}", capture=True)
    local_tree = run("git", "write-tree", capture=True)
    changed = run(
        "git", "diff", "--cached", "--name-only", main_sha, capture=True
    ).splitlines()

    deletion_paths = {CUSTOM_WORKFLOW.as_posix(), HELPER.as_posix()}
    canonical_paths = {MATRIX.as_posix(), HANDOFF.as_posix()}
    entries: list[dict[str, str | None]] = []
    for path in changed:
        if path in deletion_paths:
            entries.append({"path": path, "mode": "100644", "type": "blob", "sha": None})
            continue
        if path in canonical_paths:
            entries.append(
                {
                    "path": path,
                    "mode": "100644",
                    "type": "blob",
                    "sha": "CREATE_FROM_ARTIFACT",
                }
            )
            continue
        raw = run("git", "ls-files", "-s", "--", path, capture=True)
        mode, sha, stage_and_path = raw.split(" ", 2)
        stage, listed_path = stage_and_path.split("\t", 1)
        if stage != "0" or listed_path != path:
            raise SystemExit(f"index entry drift for {path}: {raw}")
        entries.append({"path": path, "mode": mode, "type": "blob", "sha": sha})

    if len(entries) != 31:
        raise SystemExit(f"expected 31 final diff entries, got {len(entries)}")
    if not any(
        entry["path"] == TRUSTED_WORKFLOW.as_posix()
        and entry["sha"] == ORIGINAL_VALIDATE_BLOB
        for entry in entries
    ):
        raise SystemExit("trusted workflow restoration entry missing")

    manifest = {
        "main_sha": main_sha,
        "main_tree_sha": main_tree,
        "search_sha": search_sha,
        "search_parent_sha": SEARCH_SHA,
        "local_final_tree_sha": local_tree,
        "original_validate_blob": ORIGINAL_VALIDATE_BLOB,
        "entry_count": len(entries),
        "entries": entries,
    }
    (OUTPUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    (OUTPUT / "diff-stat.txt").write_text(
        run("git", "diff", "--cached", "--stat", main_sha, capture=True) + "\n",
        encoding="utf-8",
    )
    (OUTPUT / "name-status.txt").write_text(
        run("git", "diff", "--cached", "--name-status", main_sha, capture=True)
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps(manifest, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
