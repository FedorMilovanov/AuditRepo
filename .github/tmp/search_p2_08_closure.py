#!/usr/bin/env python3
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

BASE_SHA = "c5d729375165a9690046e11401965249505d21a3"
PRODUCT_HEAD = "c99af2f104194d022e7f55092af6ad35e561de7b"
PRODUCT_MERGE = "b8882bf04a178d7a1d798a0377083ba57d29ce8a"
PRODUCT_PR = 901
MATRIX = Path("projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md")
PROMPT = Path("projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md")
REVERIFY = Path(
    "projects/gb-is-my-strength/reverify/"
    "CURRENT_HEAD_REVERIFY_2026-08-05_b8882bf0_legacy-verse-authority-closure.md"
)
HELPER = Path(".github/tmp/search_p2_08_closure.py")
WORKFLOW = Path(".github/workflows/tmp-search-p2-08-closure.yml")
PERMANENT = {MATRIX.as_posix(), PROMPT.as_posix(), REVERIFY.as_posix()}
TEMPORARY = {HELPER.as_posix(), WORKFLOW.as_posix()}


def run(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, check=check, text=True, capture_output=True)


def output(*args: str) -> str:
    return run(*args).stdout.strip()


def replace_one(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def replace_regex_one(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one regex match, found {count}")
    return updated


def changed_from_base() -> set[str]:
    return set(filter(None, output("git", "diff", "--name-only", BASE_SHA, "--").splitlines()))


def assert_initial_branch() -> None:
    if output("git", "merge-base", BASE_SHA, "HEAD") != BASE_SHA:
        raise SystemExit("AuditRepo branch is not based on the exact closure base")
    committed = set(filter(None, output("git", "diff", "--name-only", f"{BASE_SHA}...HEAD").splitlines()))
    if committed != TEMPORARY:
        raise SystemExit(f"unexpected committed pre-transaction scope: {sorted(committed)}")
    if output("git", "status", "--porcelain"):
        raise SystemExit("working tree must be clean before apply")


def build_prompt() -> str:
    return f"""# NEXT AGENT PROMPT — gb-is-my-strength

## Exact authority

- AuditRepo rollback/base before this transaction: `{BASE_SHA}`.
- Current Product source/disposition anchor: `{PRODUCT_MERGE}` (PR #{PRODUCT_PR}).
- Product exact closure head: `{PRODUCT_HEAD}`; squash merge: `{PRODUCT_MERGE}`.
- Last exact production authority is unchanged: release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, deploy run `30669840189` attempt `1`. Do not treat the Product source anchor as deployed.
- Canonical reverify: `reverify/{REVERIFY.name}`.

## Canonical matrix

- **371 total = 223 closed + 148 open**.
- Open severity counts: P0 `0`, P1 `70`, P2 `32`, P3 `39`, refactoring `4`, AuditRepo `3`.
- `SEARCH-P2-08` is closed: the deprecated legacy verse authority and dead `.gbx-verse` runtime/CSS were removed; strict and adversarial contracts now fail closed on reintroduction.
- `SEARCH-P2-07` remains open: the corpus is sparse and cannot be truthfully closed without an authoritative/licensed source plus rights/provenance.

## Product evidence retained

- Product PR #{PRODUCT_PR} deleted the 94-entry `data/verses.json` authority instead of copying disputed legacy text into `data/bible/**`.
- The dead `.gbx-verse` fetch runtime and matching CSS were removed atomically; governed `.bref > .btip` plus `data/bible/**` remain the sole current Bible text/tooltip authority.
- Original self-clean executor: run `30949083337`, job `92126343999`.
- Permanent exact-head Bible contract: run `30959007910`, job `92158545297`; full Runtime `30959007826`; Deploy Candidate `30959007936`; Route Registry `30959007945`.
- Exact head `{PRODUCT_HEAD}` passed all 23 triggered workflows before squash merge `{PRODUCT_MERGE}`.
- Final Product diff: 125 permanent files, `+267/-339`; revision synchronization accounts for the broad count; no TTS/Vosk paths.

## Next bounded search lanes

1. `SEARCH-P2-09`: implement the advertised `/?q={{search_term_string}}` SearchAction target as a real search-open/query state.
2. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence and without weakening existing keyboard/fallback behavior.
3. `SEARCH-P1-01`: extend the unified command palette to the remaining searchable app/tool routes.
4. `SEARCH-P2-07`: proceed only after authoritative/licensed corpus and rights/provenance evidence; do not infer completeness from the 66-book registry.
5. Search P3 polish rows.

No active Product mutation lane is owned by this AuditRepo closure transaction. Re-read live Product `main` and source-owner blobs before opening the next lane.
"""


def build_reverify(run_id: str) -> str:
    return f"""# Current-head reverify — legacy verse authority closure

**Date:** 2026-08-05  
**AuditRepo base:** `{BASE_SHA}`  
**Product exact head:** `{PRODUCT_HEAD}`  
**Product squash merge:** `{PRODUCT_MERGE}` (PR #{PRODUCT_PR})

## Disposition

`SEARCH-P2-08` is **FIXED-CURRENT / SOURCE+CI VERIFIED**.

The former authority-drift finding is closed by removing the deprecated flat authority rather than projecting disputed text into the sparse canonical corpus.

## Product authority closure

- Product PR #{PRODUCT_PR} deleted the 94-entry `data/verses.json` authority. The 51 legacy-only references and 38 text divergences recorded by the audit were not copied into `data/bible/**`.
- The dead `.gbx-verse` fetch runtime in `js/site.js` and its matching CSS were removed atomically.
- Governed `.bref > .btip` markup plus `data/bible/**` remain the sole current Bible text/tooltip authority.
- `scripts/bible-reference-contract.mjs --strict` now rejects the legacy file, source/runtime consumers and public `.gbx-verse` / `data-verse` markup.
- `scripts/bible-legacy-authority-regression-test.mjs` adversarially reintroduces the legacy authority, requires a blocking failure, removes the fixture and proves the tree is restored. The regression runs in both the dedicated Bible workflow and global Shared Files Guard.
- Revision owners were synchronized for `js/site.js` (`38b94307 → 8009e039`) and `css/site.css` (`6c30f93f → e3f745d1`); SW cache moved to v197.

## Exact Product evidence

- Original self-clean executor run `30949083337`, job `92126343999`, passed strict/adversarial checks, production-like build, Pagefind, SW deploy-switch and full static-publication validation before publishing the permanent tree.
- Exact-head Bible Reference Contract run `30959007910`, job `92158545297`, passed syntax, strict validation, fail-closed regression, actionlint and clean-tree restoration.
- Exact-head Runtime Interactive Audit `30959007826`, Deploy Candidate Contract `30959007936` and Route Registry Validators `30959007945` passed.
- Exact head `{PRODUCT_HEAD}` passed all 23 triggered workflows before squash merge `{PRODUCT_MERGE}`.
- Final Product diff: **125 permanent files, +267/-339**. The broad count is governed revision synchronization; no TTS/Vosk paths are present.

## AuditRepo transaction evidence

- Self-clean closure executor run `{run_id}` is bounded to the matrix, `NEXT_AGENT_PROMPT.md` and this paired reverify.
- Before publishing the clean head it runs structure validation, repository rules/regressions, matrix coverage and strict repository-history forensic.
- Temporary workflow/helper files are removed before the permanent commit.

## Boundaries retained

- `SEARCH-P2-07` remains open: 66-book registry coverage is not an authoritative/licensed full verse corpus, and rights/provenance remain required.
- No full-corpus, licensing or rights claim is made.
- No production deployment is claimed. Last exact production authority remains release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, run `30669840189` attempt `1`.
- No TTS/Vosk disposition is claimed.

## SSOT arithmetic

Total canonical IDs remain **371**. This one row moves from P2 open to closed:

- closed: `222 → 223`
- open: `149 → 148`
- P2: `33 → 32`
- P0/P1/P3/refactoring/AuditRepo unchanged
"""


def apply() -> None:
    assert_initial_branch()
    if REVERIFY.exists():
        raise SystemExit(f"reverify already exists: {REVERIFY}")

    matrix = MATRIX.read_text(encoding="utf-8")
    matrix = replace_regex_one(
        matrix,
        r"^\| Source verification anchor \|.*$",
        f"| Source verification anchor | `{PRODUCT_MERGE}` (Product PR #{PRODUCT_PR} legacy verse authority closure: `SEARCH-P2-08` fixed-current; `SEARCH-P2-07` remains open; no production or TTS/Vosk claim). |",
        "matrix source anchor",
    )
    matrix = replace_regex_one(
        matrix,
        r"^\| Deploy \|.*$",
        "| Deploy | ⚠️ **FINDING-DISPOSITION ANCHOR ≠ PRODUCTION.** Last exact production authority remains run `30669840189` attempt `1`, release/control SHA `abf1edba190280e554dfda085bef9fb6594c896d`, candidate `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`, release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`. Product source/disposition anchor `b8882bf04a178d7a1d798a0377083ba57d29ce8a` has no same-SHA production witness; this closure makes no production claim. |",
        "matrix deploy boundary",
    )
    matrix = replace_regex_one(
        matrix,
        r"^\| Last reverify \|.*$",
        f"| Last reverify | `reverify/{REVERIFY.name}` (Product PR #{PRODUCT_PR} legacy authority removal; `SEARCH-P2-07` remains open). |",
        "matrix last reverify",
    )
    matrix = replace_one(matrix, "## ✅ ЗАКРЫТО (222)", "## ✅ ЗАКРЫТО (223)", "closed count")
    matrix = replace_one(matrix, "## 🟡 P2 — ОТКРЫТО (33)", "## 🟡 P2 — ОТКРЫТО (32)", "P2 count")

    open_pattern = r"^\| SEARCH-P2-08 \|.*\n"
    matrix, removed = re.subn(open_pattern, "", matrix, count=1, flags=re.MULTILINE)
    if removed != 1:
        raise SystemExit(f"expected one open SEARCH-P2-08 row, removed {removed}")
    if re.search(open_pattern, matrix, flags=re.MULTILINE):
        raise SystemExit("duplicate open SEARCH-P2-08 row remains")

    closed_row = (
        f"| SEARCH-P2-08 | ✅ **FIXED-CURRENT / SOURCE+CI VERIFIED 2026-08-05.** "
        f"Product PR #{PRODUCT_PR} removed the 94-entry legacy `data/verses.json` authority instead of projecting disputed text into the sparse canonical corpus: the 51 legacy-only references and 38 text divergences were not copied into `data/bible/**`. The dead `.gbx-verse` fetch runtime and matching CSS were removed atomically; governed `.bref > .btip` plus `data/bible/**` remain the sole current Bible text/tooltip authority. `scripts/bible-reference-contract.mjs --strict` now fails if the legacy file, a source/runtime consumer, or public `.gbx-verse` / `data-verse` markup reappears, and the adversarial regression proves blocking failure plus clean-tree restoration in the dedicated Bible workflow and Shared Files Guard. Exact head `{PRODUCT_HEAD}` passed all 23 triggered workflows before squash merge `{PRODUCT_MERGE}`. `SEARCH-P2-07` remains open; no production deployment or TTS/Vosk claim. | `{PRODUCT_MERGE[:8]}` PR#{PRODUCT_PR}; `reverify/{REVERIFY.name}` |\n"
    )
    insertion_anchor = "| NG-BODY-01 |"
    anchor_index = matrix.find(insertion_anchor)
    if anchor_index < 0:
        raise SystemExit("closed-row insertion anchor not found")
    if "| SEARCH-P2-08 |" in matrix:
        raise SystemExit("SEARCH-P2-08 unexpectedly remains before closed insertion")
    matrix = matrix[:anchor_index] + closed_row + matrix[anchor_index:]

    session = f"""

### 2026-08-05 — Product legacy verse authority closure

- Closed `SEARCH-P2-08` from Product PR #{PRODUCT_PR}, exact head `{PRODUCT_HEAD}`, squash merge `{PRODUCT_MERGE}`.
- Deleted the 94-entry legacy `data/verses.json` authority instead of copying disputed text into `data/bible/**`; removed the dead `.gbx-verse` runtime/CSS atomically.
- Strict and adversarial contracts now reject reintroduction and prove clean-tree restoration in Bible Reference Contract and Shared Files Guard.
- Exact head passed all 23 triggered Product workflows; final diff 125 permanent files, `+267/-339`, no TTS/Vosk paths.
- `SEARCH-P2-07` remains open; no corpus-completeness, rights, production deployment or TTS/Vosk claim.
- Canonical arithmetic: total remains **371**; closed `222 → 223`, open `149 → 148`, P2 `33 → 32`.
"""
    if "### 2026-08-05 — Product legacy verse authority closure" in matrix:
        raise SystemExit("session entry already exists")
    matrix = matrix.rstrip() + session + "\n"

    if matrix.count("| SEARCH-P2-08 |") != 1:
        raise SystemExit("SEARCH-P2-08 must occur exactly once after closure")
    if "## ✅ ЗАКРЫТО (223)" not in matrix or "## 🟡 P2 — ОТКРЫТО (32)" not in matrix:
        raise SystemExit("canonical count headings were not updated")

    MATRIX.write_text(matrix, encoding="utf-8")
    PROMPT.write_text(build_prompt(), encoding="utf-8")
    REVERIFY.parent.mkdir(parents=True, exist_ok=True)
    REVERIFY.write_text(build_reverify(os.environ.get("GITHUB_RUN_ID", "local")), encoding="utf-8")

    actual = changed_from_base()
    expected = PERMANENT | TEMPORARY
    if actual != expected:
        raise SystemExit(f"unexpected transaction scope after apply: {sorted(actual)}")
    print("Applied bounded SEARCH-P2-08 closure to exactly three permanent owners.")


def finalize() -> None:
    actual = changed_from_base()
    expected = PERMANENT | TEMPORARY
    if actual != expected:
        raise SystemExit(f"unexpected pre-finalize scope: {sorted(actual)}")

    for path in (HELPER, WORKFLOW):
        path.unlink(missing_ok=False)

    run("git", "add", "-A")
    staged = set(filter(None, output("git", "diff", "--cached", "--name-only").splitlines()))
    if staged != PERMANENT:
        raise SystemExit(f"final staged scope is not exactly three SSOT files: {sorted(staged)}")
    if output("git", "diff", "--cached", "--name-only", "--diff-filter=ACMRD").count("\n") + 1 != 3:
        raise SystemExit("final staged file count is not three")

    run("git", "config", "user.name", "github-actions[bot]")
    run("git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com")
    run("git", "commit", "-m", "audit(search): close SEARCH-P2-08")
    head_ref = os.environ.get("HEAD_REF", "").strip()
    if not head_ref:
        raise SystemExit("HEAD_REF is required")
    run("git", "push", "origin", f"HEAD:{head_ref}")
    print(f"Published clean three-file SSOT head to {head_ref}.")


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] not in {"apply", "finalize"}:
        raise SystemExit("usage: search_p2_08_closure.py <apply|finalize>")
    if sys.argv[1] == "apply":
        apply()
    else:
        finalize()


if __name__ == "__main__":
    main()
