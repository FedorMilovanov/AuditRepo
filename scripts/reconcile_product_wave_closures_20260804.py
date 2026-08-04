#!/usr/bin/env python3
"""Exact, fail-closed AuditRepo reconciliation for the 2026-08-04 Product wave."""

from __future__ import annotations

import argparse
from pathlib import Path
import re

ROOT = Path.cwd()
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
HANDOFF = ROOT / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
REVERIFY = ROOT / "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-08-04_83875378_product-wave-closures.md"

AUDIT_BASE = "549b0d070a16a2cdb6a72fa91e5448fe6c02834e"
PRODUCT_NAGORNAYA = "7118ad80c3474112f203c2c3b8df7cdc44de0a84"
PRODUCT_SEARCH = "83875378a31436e235f1296f13d22c816b2945df"
SEARCH_HEAD = "0c20368ff0e4f90c992784530d15c9c7d722e0dd"
SEARCH_EXECUTOR_RUN = "30931175556"
SEARCH_EXECUTOR_JOB = "92065964404"
NEW_CI_ID = "CI-WEBKIT-TOC-NONDETERMINISTIC"


def require_once(text: str, needle: str, label: str) -> None:
    count = text.count(needle)
    if count != 1:
        raise SystemExit(f"{label}: expected one exact anchor, got {count}: {needle}")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    require_once(text, old, label)
    return text.replace(old, new, 1)


def replace_regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.M)
    if count != 1:
        raise SystemExit(f"{label}: expected one regex match, got {count}")
    return updated


def extract_row(text: str, finding_id: str) -> str:
    matches = re.findall(rf"^\| {re.escape(finding_id)} \|.*$", text, flags=re.M)
    if len(matches) != 1:
        raise SystemExit(f"{finding_id}: expected one matrix row, got {len(matches)}")
    return matches[0]


def remove_row(text: str, finding_id: str) -> str:
    row = extract_row(text, finding_id)
    return replace_once(text, row + "\n", "", f"remove {finding_id}")


def insert_after_table_header(text: str, heading: str, row: str, label: str) -> str:
    marker = f"{heading}\n\n| ID | Описание | Witnesses |\n|---|---|---|\n"
    if heading.startswith("## ✅"):
        marker = f"{heading}\n\n| ID | Описание | Коммит |\n|---|---|---|\n"
    require_once(text, marker, label)
    return text.replace(marker, marker + row + "\n", 1)


def reconcile_matrix(source: str) -> str:
    # Guard the exact canonical starting state.
    for token in [
        "## ✅ ЗАКРЫТО (219)",
        "## 🟠 P1 — ОТКРЫТО (72)",
        "## 🟡 P2 — ОТКРЫТО (32)",
        "## 🟢 P3 — ОТКРЫТО (40)",
        "370 canonical = 219 closed + 151 open",
        "| P1 открыто | 72 |",
        "| P2 открыто | 32 |",
        "| P3 открыто | 40 |",
        "| **Всего открыто (матрица)** | **151** |",
    ]:
        require_once(source, token, "canonical matrix start-state drift")

    extract_row(source, "NG-DARK-01")
    extract_row(source, "SEARCH-P1-03")
    if re.search(rf"^\| {re.escape(NEW_CI_ID)} \|", source, re.M):
        raise SystemExit(f"{NEW_CI_ID}: already exists")

    text = source
    text = remove_row(text, "SEARCH-P1-03")
    text = remove_row(text, "NG-DARK-01")

    ng_closed = (
        "| NG-DARK-01 | ✅ **FIXED-CURRENT / SOURCE+CHROMIUM+CI VERIFIED 2026-08-04.** "
        "Product PR #887 replaced the refined nine-token / 142-use dark residual with higher-specificity "
        "unlayered selectors in `css/nagornaya-mobile-toc.css`, without adding any `!important`: the governed "
        "count remains exactly **134**. Its permanent production-like Chromium witness covered 9 Nagornaya routes "
        "× 3 viewports and passed **384/384** assertions; build, Pagefind/offline/SW contracts, visual parity, "
        "runtime interactive audit and the full static-publication barrier passed before squash merge "
        f"`{PRODUCT_NAGORNAYA}`. The predecessor #885 is superseded; its eight extra `!important` declarations and "
        "blanket CSP suppression were intentionally not retained. A separate nondeterministic WebKit TOC harness "
        "finding remains open. No production deployment or TTS/Vosk claim. | "
        f"`{PRODUCT_NAGORNAYA[:8]}` PR#887; Chromium 384/384 |"
    )
    search_closed = (
        "| SEARCH-P1-03 | ✅ **FIXED-CURRENT / SOURCE+PAGEFIND+CHROMIUM+CI VERIFIED 2026-08-04.** "
        "Product PR #890 closed only the misleading exact-Bible S0: public wording now says `Ссылки` / "
        "`Ссылки в материалах`, the UI no longer promises a word/full-Scripture search, and the four public "
        "suggestions (`Иер 17:9`, `Рим 7:14–25`, `1 Тим 3`, `Тит 1`) are parsed by the canonical 66-book resolver "
        "and required to own exact `data/search-manifest.json` records. Old unsupported suggestions and labels are "
        "permanently forbidden. Exact head "
        f"`{SEARCH_HEAD}` passed executor run `{SEARCH_EXECUTOR_RUN}` job `{SEARCH_EXECUTOR_JOB}`: bounded clean diff, "
        "production-like build, strict Pagefind inventory, real browser discovery queries, SW deploy-switch audits "
        f"and full `validate:static-publication`; squash merge `{PRODUCT_SEARCH}`. `SEARCH-P1-04`, `SEARCH-P2-07` "
        "and `SEARCH-P2-08` remain open. No production deployment or TTS/Vosk claim. | "
        f"`{PRODUCT_SEARCH[:8]}` PR#890; run `{SEARCH_EXECUTOR_RUN}` |"
    )
    ci_open = (
        f"| {NEW_CI_ID} | 🆕 **CI/WebKit P2 — nondeterministic public-surface TOC readiness.** "
        "During exact-head validation of Product PR #887, the same two WebKit TOC assertions failed first on "
        "`/articles/krajne-li-isporcheno-serdce/` and then, on a bounded rerun with the same unchanged product tree, "
        "on `/baptisty-rossii/goneniya-i-sovest/`. Neither route was in the Nagornaya diff; the permanent Nagornaya "
        "Chromium contract, visual parity and runtime audit were green. The migration of the failure between "
        "unchanged routes proves a harness/readiness nondeterminism rather than a `NG-DARK-01` regression. Repair "
        "must stabilize deterministic TOC readiness/waits without weakening assertions or absorbing unrelated "
        "product scopes. No production or TTS/Vosk claim. | "
        f"`reverify/{REVERIFY.name}`; Product PR#887 |"
    )

    text = replace_once(text, "## ✅ ЗАКРЫТО (219)", "## ✅ ЗАКРЫТО (221)", "closed heading")
    text = insert_after_table_header(text, "## ✅ ЗАКРЫТО (221)", ng_closed + "\n" + search_closed, "closed table")
    text = replace_once(text, "## 🟠 P1 — ОТКРЫТО (72)", "## 🟠 P1 — ОТКРЫТО (71)", "P1 heading")
    text = replace_once(text, "## 🟡 P2 — ОТКРЫТО (32)", "## 🟡 P2 — ОТКРЫТО (33)", "P2 heading")
    text = insert_after_table_header(text, "## 🟡 P2 — ОТКРЫТО (33)", ci_open, "P2 table")
    text = replace_once(text, "## 🟢 P3 — ОТКРЫТО (40)", "## 🟢 P3 — ОТКРЫТО (39)", "P3 heading")

    text = replace_regex_once(
        text,
        r"^\| Source verification anchor \|.*$",
        "| Source verification anchor | `83875378a31436e235f1296f13d22c816b2945df` "
        "(Product closure wave: `NG-DARK-01` merged as `7118ad80`; truthful Scripture-suggestion S0 "
        "`SEARCH-P1-03` merged as `83875378`; separate WebKit TOC nondeterminism remains open; no production or TTS claim). |",
        "source verification anchor",
    )
    text = replace_regex_once(
        text,
        r"^\| Last reverify \|.*$",
        f"| Last reverify | `reverify/{REVERIFY.name}` (Product PR #887/#890 closure reconciliation and separate WebKit TOC CI finding). |",
        "last reverify",
    )

    text = replace_regex_once(
        text,
        r"^## Статистика \(обновлено 2026-08-04: disposition anchor `f9d01207`; last exact production `abf1edba`; 370 canonical = 219 closed \+ 151 open\)$",
        "## Статистика (обновлено 2026-08-04: disposition anchor `83875378`; last exact production `abf1edba`; 371 canonical = 221 closed + 150 open)",
        "statistics heading",
    )
    for old, new in [
        ("| Закрыто (fixed) | 219 |", "| Закрыто (fixed) | 221 |"),
        ("| P1 открыто | 72 |", "| P1 открыто | 71 |"),
        ("| P2 открыто | 32 |", "| P2 открыто | 33 |"),
        ("| P3 открыто | 40 |", "| P3 открыто | 39 |"),
        ("| **Всего открыто (матрица)** | **151** |", "| **Всего открыто (матрица)** | **150** |"),
    ]:
        text = replace_once(text, old, new, "statistics row")

    session_header = "## Session log (append-only)\n"
    require_once(text, session_header, "session header")
    session = f"""
### 2026-08-04 — Product Nagornaya + truthful Scripture S0 closure reconciliation

- Closed `NG-DARK-01` from Product PR #887 / merge `{PRODUCT_NAGORNAYA}`: cascade-safe dark remaps, **134** governed `!important`, permanent 9-route × 3-viewport Chromium **384/384**, full build/static/runtime evidence. PR #885 is superseded and its broader repair was not retained.
- Closed `SEARCH-P1-03` from Product PR #890 / merge `{PRODUCT_SEARCH}`: truthful `Ссылки в материалах` semantics and four exact manifest-backed suggestions governed by the canonical 66-book resolver. Exact executor head `{SEARCH_HEAD}`, run `{SEARCH_EXECUTOR_RUN}`, job `{SEARCH_EXECUTOR_JOB}` passed production-like, Pagefind/browser/SW and full static-publication barriers.
- Added open P2 `{NEW_CI_ID}` after identical WebKit TOC assertions migrated between two unchanged, unrelated routes on bounded reruns. This is a separate harness/readiness owner, not a Nagornaya regression.
- `SEARCH-P1-04`, `SEARCH-P2-07` and `SEARCH-P2-08` remain open. No production deployment or TTS/Vosk claim.
- Canonical arithmetic: total `370 → 371`, closed `219 → 221`, open `151 → 150`; P1 `72 → 71`, P2 `32 → 33`, P3 `40 → 39`.
"""
    text = text.replace(session_header, session_header + session, 1)

    # Final invariants.
    expected = {
        "NG-DARK-01": 1,
        "SEARCH-P1-03": 1,
        "SEARCH-P1-04": 1,
        NEW_CI_ID: 1,
    }
    for finding_id, expected_count in expected.items():
        count = len(re.findall(rf"^\| {re.escape(finding_id)} \|", text, re.M))
        if count != expected_count:
            raise SystemExit(f"{finding_id}: final row multiplicity {count}")
    for token in [
        "## ✅ ЗАКРЫТО (221)",
        "## 🟠 P1 — ОТКРЫТО (71)",
        "## 🟡 P2 — ОТКРЫТО (33)",
        "## 🟢 P3 — ОТКРЫТО (39)",
        "371 canonical = 221 closed + 150 open",
    ]:
        if token not in text:
            raise SystemExit(f"final matrix invariant missing: {token}")
    return text


def reconcile_handoff(source: str) -> str:
    text = source
    text = replace_regex_once(
        text,
        r"^\*\*AuditRepo base before this handoff:\*\*.*$",
        f"**AuditRepo base before this handoff:** `{AUDIT_BASE}`",
        "handoff base",
    )
    text = replace_regex_once(
        text,
        r"^\*\*Exact finding-disposition anchor:\*\*.*$",
        f"**Exact finding-disposition anchor:** `{PRODUCT_SEARCH}`",
        "handoff disposition anchor",
    )
    text = replace_regex_once(
        text,
        r"^\*\*Current Product main:\*\*.*$",
        f"**Current Product main:** `{PRODUCT_SEARCH}`",
        "handoff Product main",
    )
    text = replace_regex_once(
        text,
        r"^\*\*Deployment status:\*\*.*$",
        f"**Deployment status:** ⚠️ source/CI verification `!=` production; no same-SHA production claim for `{PRODUCT_SEARCH[:8]}`.",
        "handoff deployment",
    )
    text = replace_regex_once(
        text,
        r"^\*\*Current reverify:\*\*.*$",
        f"**Current reverify:** `reverify/{REVERIFY.name}`.",
        "handoff reverify",
    )
    text = replace_regex_once(
        text,
        r"^\*\*Canonical matrix:\*\*.*$",
        "**Canonical matrix:** **371 IDs = 221 closed + 150 open**.",
        "handoff matrix",
    )

    convergence_anchor = (
        "- `f9d0120718569c510833dba7a3abd68ce2f6a003` — Product PR #873 bounded `QUAL-P1-02` repair: "
        "Hebrew-capable font stack, isolated RTL token semantics, explicit Hebrew title boundaries and permanent source/Chromium witnesses; exact PR head `cf128cc429ccfa1c48fce4638b3f489f8dc27135` passed 11/11 workflows.\n"
    )
    require_once(text, convergence_anchor, "handoff convergence list")
    new_bullets = (
        f"- `{PRODUCT_NAGORNAYA}` — Product PR #887 closed `NG-DARK-01` with cascade-safe dark remaps, 134 governed `!important` and permanent Chromium 384/384.\n"
        f"- `{PRODUCT_SEARCH}` — Product PR #890 closed only `SEARCH-P1-03` S0 with truthful manifest-backed reference search; the site-wide occurrence index remains open under `SEARCH-P1-04`.\n"
    )
    text = text.replace(convergence_anchor, convergence_anchor + new_bullets, 1)

    active_start = text.index("## Active canonical owner lanes")
    counts_start = text.index("## Current counts", active_start)
    active = f"""## Active canonical owner lanes

### Product repository

- Product `main@{PRODUCT_SEARCH}` is the current source authority after PR #887 and PR #890. No same-SHA production claim exists.
- Product PRs #875/#876 are disjoint TTS audit/repair lanes and must not be modified or absorbed.
- The next non-TTS Product lane is `SEARCH-P1-04` S1: a deterministic source-owned `BibleRef → occurrences` index. It must reuse the canonical 66-book resolver, allow `canonicalText: null`, use `dist` only as a witness and avoid invented anchors/deep links.

### AuditRepo

- PR #148 is the disjoint TTS evidence lane and remains untouched.
- This reconciliation owns only the two Product closures, the separate WebKit TOC CI finding, paired reverify and exact SSOT arithmetic.

"""
    text = text[:active_start] + active + text[counts_start:]

    counts_start = text.index("## Current counts")
    wave_start = text.index("## Wave A closure this handoff", counts_start)
    counts = """## Current counts

- P0: 0
- P1: 71
- P2: 33
- P3: 39
- Refactoring: 4
- AuditRepo: 3
- Total open: 150
- Closed: 221

"""
    text = text[:counts_start] + counts + text[wave_start:]

    next_start = text.index("## Next meaningful work")
    next_work = f"""## Next meaningful work

1. Merge the AuditRepo reconciliation only after exact-head `AuditRepo Validate`, matrix coverage, repository-history forensic, final-diff and review-thread gates pass.
2. Start Product `SEARCH-P1-04` S1 from exact `main@{PRODUCT_SEARCH}`: deterministic source-owned occurrence index, canonical 66-book resolver, page/title/context/anchor/source provenance, no invented canonical text and no runtime UI claim yet.
3. Then integrate exact-reference-first runtime results before Pagefind as a separate S2 lane with Chromium evidence. Do not conflate this with `SEARCH-P2-07` corpus population or `SEARCH-P2-08` legacy-authority reconciliation.
4. Stabilize `{NEW_CI_ID}` independently with deterministic WebKit TOC readiness/waits; do not weaken assertions or edit unrelated route content.
5. Preserve Single-Writer-Per-Fact. Make no production claim without same-SHA live evidence. TTS/Vosk lanes remain excluded.
"""
    text = text[:next_start] + next_work
    return text


def reverify_text() -> str:
    return f"""# Current-head reverify — Product wave closures and WebKit TOC isolation

**Date:** 2026-08-04  
**AuditRepo base:** `{AUDIT_BASE}`  
**Product source anchor after wave:** `{PRODUCT_SEARCH}`  
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`  
**Production claim:** none  
**TTS/Vosk mutation:** none

## 1. Scope

This reconciliation reads the complete current canonical matrix and the supplied search/Nagornaya audit chain, then changes only three dispositions:

1. `NG-DARK-01` open → closed from Product PR #887;
2. `SEARCH-P1-03` open → closed from Product PR #890;
3. add a separate open P2 `{NEW_CI_ID}` for the nondeterministic WebKit TOC harness.

`SEARCH-P1-04`, `SEARCH-P2-07` and `SEARCH-P2-08` remain open. Historical `SEARCH-SCRIPTURE-BROKEN` remains closed and is not reopened.

## 2. `NG-DARK-01` closure

Product PR #887 squash-merged as `{PRODUCT_NAGORNAYA}`.

Verified boundary retained from the refined audit:

- nine Nagornaya routes;
- three viewports;
- permanent production-like Chromium computed-style contract;
- **384/384** assertions;
- zero new `!important`; governed total remains **134**;
- higher-specificity unlayered selectors rather than blanket escalation;
- SW/cache transaction v194;
- production-like build, Pagefind/offline/SW contracts, visual parity, runtime interactive audit and full static-publication barrier.

The predecessor PR #885 is superseded. Its eight additional `!important` declarations and broad CSP suppression were not retained.

## 3. `SEARCH-P1-03` closure

Product PR #890 exact final head `{SEARCH_HEAD}` squash-merged as `{PRODUCT_SEARCH}`.

Executor run `{SEARCH_EXECUTOR_RUN}`, job `{SEARCH_EXECUTOR_JOB}` completed successfully:

- exact base/blob guards;
- explicit fail-closed eight-anchor writer;
- self-cleaned bounded diff;
- permanent truthful-suggestion contract;
- canonical 66-book resolver parsing;
- exact manifest ownership for `Иер 17:9`, `Рим 7:14–25`, `1 Тим 3`, `Тит 1`;
- old unsupported suggestions and misleading wording forbidden;
- production-like build and strict Pagefind inventory;
- real browser discovery queries;
- SW dist/deploy-switch audits;
- full `validate:static-publication`.

The public surface now says `Ссылки` / `Ссылки в материалах` and does not promise full Bible-text search. Seven legacy manifest reference forms remain outside this S0, as do the occurrence-index and corpus-authority debts.

## 4. WebKit TOC isolation

During exact-head PR #887 validation, a WebKit public-surface TOC job produced two assertions on `/articles/krajne-li-isporcheno-serdce/`. A bounded rerun on the same unchanged product tree produced the same two assertion types on `/baptisty-rossii/goneniya-i-sovest/` instead.

Neither route belonged to the Nagornaya diff. Chromium Nagornaya, visual parity and runtime interactive evidence were green. Because the failure migrated between unchanged unrelated routes, the supported disposition is a separate readiness/harness nondeterminism finding, not reopening `NG-DARK-01` and not mutating those routes speculatively.

## 5. Canonical arithmetic

Before:

- total 370;
- closed 219;
- open 151;
- P1 72;
- P2 32;
- P3 40;
- Refactoring 4;
- AuditRepo 3.

After:

- total **371**;
- closed **221**;
- open **150**;
- P1 **71**;
- P2 **33**;
- P3 **39**;
- Refactoring **4**;
- AuditRepo **3**.

The total increases by one because the independent WebKit CI finding is new; two existing open rows move to closed.

## 6. Next bounded lane

`SEARCH-P1-04` S1 must generate a deterministic source-owned occurrence index before any full runtime promise:

- normalize with the existing 66-book registry/resolver;
- retain page URL, title, context, anchor and source provenance;
- allow `canonicalText: null` when the curated corpus has no record;
- treat `dist` only as a verification witness;
- never invent anchors, verse text or corpus authority;
- keep `SEARCH-P2-07` and `SEARCH-P2-08` separate.
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    if not args.write:
        raise SystemExit("explicit --write is required")

    matrix_source = MATRIX.read_text(encoding="utf-8")
    handoff_source = HANDOFF.read_text(encoding="utf-8")
    matrix_next = reconcile_matrix(matrix_source)
    handoff_next = reconcile_handoff(handoff_source)

    MATRIX.write_text(matrix_next, encoding="utf-8")
    HANDOFF.write_text(handoff_next, encoding="utf-8")
    REVERIFY.parent.mkdir(parents=True, exist_ok=True)
    if REVERIFY.exists():
        raise SystemExit(f"reverify path already exists: {REVERIFY}")
    REVERIFY.write_text(reverify_text(), encoding="utf-8")
    print("Exact Product-wave AuditRepo reconciliation applied.")


if __name__ == "__main__":
    main()
