#!/usr/bin/env python3
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
OLD_REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-08-02_5373c985_matrix-reconciliation.md"
NEW_REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-08-02_fc1085c8_matrix-reconciliation.md"

OLD = "5373c9854b3f1bb767cf18c4539de82db26b7b7a"
NEW = "fc1085c805d72e6d43f58a6383c680d4e886183b"
PROD = "abf1edba190280e554dfda085bef9fb6594c896d"
PR120 = "8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97"
PR680_HEAD = "282ee9aec770b6f7c91145d39f935ea14136d29e"
NEW_REL = "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_fc1085c8_matrix-reconciliation.md"


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


def regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    result, count = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if count != 1:
        raise RuntimeError(f"{label}: expected one match, got {count}")
    return result


def update_matrix() -> None:
    text = read(MATRIX)
    text = regex_once(
        text,
        r"^\| Source HEAD \|.*$",
        f"| Source HEAD | `{NEW}` (exact source main at final verifier review; 65 commits ahead of former canonical `efaf2a51`; includes Pihahiroth/Ishod and Wave12/search discovery lanes; source-only authority, no production claim) |",
        "source row",
    )
    text = regex_once(
        text,
        r"^\| Deploy \|.*$",
        f"| Deploy | ⚠️ **SOURCE ≠ PRODUCTION.** Last exact production remains run `30669840189` attempt `1`, release/control SHA `{PROD}`, candidate `{PROD}:30669840189-1`, release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`. Current source `{NEW}` requires a new same-SHA production witness. |",
        "deploy row",
    )
    text = regex_once(
        text,
        r"^\| Last reverify \|.*$",
        f"| Last reverify | `{NEW_REL}` |",
        "reverify row",
    )
    text = regex_once(
        text,
        r"^⚠️ Deploy-формулировки.*$",
        f"⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. Current source = `{NEW}`; last exact production authority = `{PROD}`. Source is 65 commits ahead of former canonical `efaf2a51`; the 20-commit delta after AuditRepo PR #120 includes the Pihahiroth/Ishod lane plus Wave12/search discovery work. The last 11 commits after `{OLD[:8]}` do not touch the earlier Karty/Vosk/genealogy evidence-critical paths, but Ishod browser/runtime verdicts still require a fresh exact-head witness. Active source owner: draft PR #680 at `{PR680_HEAD}`; не вмешиваться в его ветку. Evidence: `{NEW_REL}`.",
        "authority warning",
    )
    text = regex_once(
        text,
        r"^## Статистика \(обновлено.*\)$",
        f"## Статистика (обновлено 2026-08-02: source `{NEW[:8]}`; last exact production `{PROD[:8]}`; 358 canonical = 168 closed + 190 open)",
        "statistics heading",
    )
    text = text.replace(OLD, NEW)
    text = text.replace(
        "reverify/CURRENT_HEAD_REVERIFY_2026-08-02_5373c985_matrix-reconciliation.md",
        NEW_REL,
    )
    text = text.replace("source `5373c985`", "source `fc1085c8`")
    text = text.replace("(**54 commits**", "(**65 commits**")
    text = text.replace("(**54 commits**,", "(**65 commits**,")
    text = text.replace("@ source `5373c985`", "@ source `fc1085c8`")
    write(MATRIX, text)


def update_next() -> None:
    content = f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Source main:** `{NEW}`
**Last exact production authority:** `{PROD}`
**Current source deployment status:** ⚠️ `source != production`; same-SHA production witness для текущего source отсутствует.
**Current reverify:** `{NEW_REL}`
**Canonical matrix:** **358 IDs = 168 closed + 190 open**.

## 1. Точная граница source

- exact source `main` at final verifier review = `{NEW}`;
- former canonical source `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` is **65 commits behind**;
- AuditRepo PR #120 merge-time anchor `{PR120}` is **20 commits behind**;
- prior matrix-review anchor `{OLD}` is **11 commits behind**;
- those final 11 commits affect Wave12/search/visual-policy files only; they do not touch the earlier Karty/Vosk/genealogy evidence-critical paths;
- the preceding Pihahiroth/Ishod delta did touch Ishod projection files, so Ishod browser/runtime verdicts still require a fresh exact-head witness and are not inherited source-only;
- active source owner: draft PR #680 at `{PR680_HEAD}`; do not modify its branch or owner files;
- no post-`{PROD[:8]}` source merge is production without a separate same-SHA witness.

## 2. Last exact production

- deploy `30669840189`, attempt `1`, event `push`;
- release SHA = control-plane SHA = `{PROD}`;
- candidate `{PROD}:30669840189-1`;
- release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- candidate artifact `8808656612`; generic live `8808666936`; TTS `8808667707`;
- release ledger comment `5148074092`; physical Windows witness `5148209495`.

```text
current source = {NEW}
last exact production = {PROD}
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

1. Do not promote `{NEW[:8]}` to production authority without exact same-SHA readiness → candidate → Pages/live → TTS → ledger evidence.
2. Do not interfere with active owner PR #680.
3. Re-run Ishod/Pihahiroth browser/runtime verification on the exact current source before changing related matrix statuses.
4. Keep canonical counters synchronized atomically between this file and `MASTER_BUG_MATRIX.md`.
"""
    write(NEXT, content)


def update_reverify() -> None:
    if not OLD_REVERIFY.exists():
        raise RuntimeError(f"missing old reverify {OLD_REVERIFY}")
    content = f"""# Current-head matrix reconciliation — 2026-08-02 — `{NEW[:8]}`

**AuditRepo base:** `a4ac63a1bfaa2549766cf911f3de886f21873875` (PR #120 merge)
**Exact source main at final verifier review:** `{NEW}`
**Former canonical source:** `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` (**65 commits behind**)
**PR #120 merge-time source anchor:** `{PR120}` (**20 commits behind**)
**Intermediate matrix-review anchor:** `{OLD}` (**11 commits behind**)
**Last exact production:** `{PROD}`
**Production claim:** no; `source != production`

## Why this transaction exists

The post-PR-120 independent audit found four canonical/control-plane defects:

1. `NEW-68/69` was a physical closed-table row but not a canonical ID because `/` violates the matrix ID grammar. It represented two distinct bugs and counted as zero IDs.
2. `AR-006` was explicitly marked CLOSED while remaining in the open AUDITREPO section and in the 191-open total.
3. Two rights-policy evidence IDs were visible in reverify but absent from matrix/registry: `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY`.
4. The supposedly blocking coverage job piped `check_matrix_coverage.py` into `tee` without `pipefail`; the script returned 1 for the diagnostics, but Bash returned the status of `tee`, so CI was falsely green.

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

The first 9 commits after PR #120's source anchor add the Pihahiroth uncertainty release lane and change Ishod projection surfaces, including `IshodMap.astro` and `IshodPageHead.astro`. Ishod/browser/runtime classifications therefore remain open pending a fresh exact-head witness.

The final 11 commits from `{OLD[:8]}` to `{NEW[:8]}` change Wave12/search/visual-policy surfaces only:

- Wave12 release and canonical-discovery workflows/contracts;
- search-manifest policy and sitemap normalization;
- Diotrophes metadata/route profile;
- visual-parity baseline and pastor-series visual policy.

They do not touch the earlier Karty/Vosk/genealogy evidence-critical paths, so this authority refresh does not silently reclassify those rows.

Draft source PR #680 is active at `{PR680_HEAD}`. Its branch and owner files are outside this AuditRepo transaction.

## Permanent control-plane changes

- noncanonical IDs in canonical tables are blocking;
- an explicit CLOSED description inside an open section is blocking;
- section heading and statistics drift are blocking;
- unregistered reverify IDs remain blocking;
- workflow uses `set -o pipefail`, so `check_matrix_coverage.py | tee` preserves the checker exit status;
- regression fixtures cover slash IDs, closed-in-open rows and heading count drift.

## Boundary

No product source, Research corpus or production artifact is modified. This is an AuditRepo canonical verifier transaction. Exact-head CI and post-merge re-read are required before declaring completion.
"""
    write(NEW_REVERIFY, content)
    OLD_REVERIFY.unlink()


def main() -> int:
    if NEW_REVERIFY.exists():
        raise RuntimeError(f"new reverify already exists: {NEW_REVERIFY}")
    update_matrix()
    update_next()
    update_reverify()
    print("authority refresh staged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
