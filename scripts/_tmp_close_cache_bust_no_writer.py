#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
PROMPT = ROOT / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
REVERIFY_REL = "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md"
REVERIFY = ROOT / REVERIFY_REL

SOURCE_FULL = "20ded750327f79e46efa4e50d4d7cd7171e7d9a1"
SOURCE_SHORT = "20ded750"
PROD_FULL = "8a5352671375fdb01b6c30273c25ec4283a13f69"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one anchor, found {count}")
    return text.replace(old, new, 1)


def main() -> None:
    if REVERIFY.exists():
        raise RuntimeError(f"immutable reverify already exists: {REVERIFY_REL}")

    matrix = MATRIX.read_text(encoding="utf-8")
    prompt = PROMPT.read_text(encoding="utf-8")

    open_row = (
        "| CACHE-BUST-NO-WRITER | После read-only миграции нет writer/job, который атомарно обновляет stale `?v=` при merge; "
        "каждый concurrent asset push оставляет `main` красным | Регрессионный live-анализ PR #109 |\n"
    )
    closed_row = (
        "| CACHE-BUST-NO-WRITER | ✅ **FIXED/SUPERSEDED BY FAIL-CLOSED POLICY 2026-07-24.** "
        "Общий metadata auto-writer намеренно запрещён: PR #187 делает блокирующими read-only revision checks на PR и `main`, catch-all readiness до production build и exact-SHA deploy linkage. "
        "Живая мутация `js/search.js` завершилась nonzero и оставила файл побайтно неизменённым. Единственный существующий glossary-autofix разрешён только для явно помеченного `autofix` same-repository PR, с job-scoped write permission, повторным read-only check, `git add -u` и push только в requesting head. "
        "17 adversarial mutations защищают все границы. | `20ded750` PR#187 |\n"
    )

    matrix = replace_once(
        matrix,
        "| Source HEAD | `96b7a20f6d9b65fc2363c04c744c5f1af24e000c` (current source main; homepage PRs #181/#182 plus PR #177 cancellable enhanced-voice download contract) |",
        "| Source HEAD | `20ded750327f79e46efa4e50d4d7cd7171e7d9a1` (current source main; glossary #183, source-aware coverage #186, Bible resolver #185 and fail-closed asset policy #187) |",
        "matrix source head",
    )
    matrix = replace_once(
        matrix,
        "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md` |",
        "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md` |",
        "matrix last reverify",
    )
    matrix = replace_once(
        matrix,
        "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `96b7a20f`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`.",
        "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `20ded750`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`.",
        "matrix authority warning",
    )
    matrix = replace_once(matrix, "## ✅ ЗАКРЫТО (142)", "## ✅ ЗАКРЫТО (143)", "closed heading")
    matrix = replace_once(
        matrix,
        "|---|---|---|\n| TTS-DL-CONSENT |",
        "|---|---|---|\n" + closed_row + "| TTS-DL-CONSENT |",
        "closed row insertion",
    )
    matrix = replace_once(matrix, open_row, "", "remove open cache-bust row")
    matrix = replace_once(matrix, "## 🟠 P1 — ОТКРЫТО (95)", "## 🟠 P1 — ОТКРЫТО (94)", "P1 heading")
    matrix = replace_once(
        matrix,
        "## Статистика (обновлено 2026-07-24: source 96b7a20f + cancellable TTS download contract)",
        "## Статистика (обновлено 2026-07-24: source 20ded750 + fail-closed asset revision policy)",
        "statistics heading",
    )
    matrix = replace_once(matrix, "| Закрыто (fixed) | 142 |", "| Закрыто (fixed) | 143 |", "closed counter")
    matrix = replace_once(matrix, "| P1 открыто | 95 |", "| P1 открыто | 94 |", "P1 counter")
    matrix = replace_once(
        matrix,
        "| **Всего открыто (матрица)** | **193** |",
        "| **Всего открыто (матрица)** | **192** |",
        "total open counter",
    )

    session_entry = (
        "- **2026-07-24 — Source `20ded750`: fail-closed asset revisions instead of a general writer.** "
        "PR #187 permanently mutation-tests read-only cache-bust coverage on every PR/main push, catch-all readiness before build, successful exact-SHA deploy linkage and explicit-only `--write`. "
        "The one pre-existing glossary autofix writer is constrained to an explicitly labeled same-repository PR, job-scoped write permission, tracked-file staging, post-write read-only validation and push-back only to the requesting head. "
        "Exact clean head `c8cd3a03` passed Shared Files Guard `30086484719`; policy run `30086392750` rejected 17 adversarial mutations and proved a stale `js/search.js` fails without rewriting. "
        "Production authority remains `8a535267` pending same-SHA deployment evidence. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`.\n\n"
    )
    matrix = replace_once(
        matrix,
        "> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.\n\n- **2026-07-24 — Source `96b7a20f`:",
        "> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.\n\n" + session_entry + "- **2026-07-24 — Source `96b7a20f`:",
        "session log insertion",
    )

    prompt = replace_once(
        prompt,
        "**Source main:** `96b7a20f6d9b65fc2363c04c744c5f1af24e000c`",
        "**Source main:** `20ded750327f79e46efa4e50d4d7cd7171e7d9a1`",
        "prompt source main",
    )
    prompt = replace_once(
        prompt,
        "**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`",
        "**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`",
        "prompt reverify",
    )
    prompt = replace_once(prompt, "- source `main` is `96b7a20f`;", "- source `main` is `20ded750`;", "prompt short source")
    prompt = replace_once(
        prompt,
        "- homepage PRs #181/#182, Gill PRs #156/#174, audit corpus PR #169, map keyboard PR #173 and cancellable TTS PR #177 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.",
        "- homepage PRs #181/#182, Gill PRs #156/#174, glossary PR #183, Bible PR #185, content-coverage PR #186, audit corpus PR #169, map keyboard PR #173, cancellable TTS PR #177 and fail-closed revision PR #187 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.",
        "prompt authority detail",
    )
    prompt = replace_once(
        prompt,
        "Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`.",
        "Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_20ded750_cache-bust-fail-closed.md`.",
        "prompt canonical evidence",
    )
    prompt = replace_once(
        prompt,
        "- `TTS-DL-CONSENT` — closed by owner-approved PR #177: immediate Web Speech remains, one compact card announces a real model cache miss, `Не загружать` aborts and persists refusal, and permanent source/mutation/desktop/mobile Chromium contracts guard the behavior.\n",
        "- `TTS-DL-CONSENT` — closed by owner-approved PR #177: immediate Web Speech remains, one compact card announces a real model cache miss, `Не загружать` aborts and persists refusal, and permanent source/mutation/desktop/mobile Chromium contracts guard the behavior.\n"
        "- `CACHE-BUST-NO-WRITER` — closed by PR #187 as an obsolete unsafe prescription: general workflow writers are forbidden, stale revisions fail closed before merge/deploy, and the single glossary autofix exception is permanently constrained and mutation-tested.\n",
        "prompt completed cache lane",
    )
    prompt = replace_once(
        prompt,
        "- source PR #180 — current universal glossary v2 lane; it supersedes older glossary branches only after exact-head acceptance and owns a broad cache-bust surface;\n- source PR #178 — strict canonical Bible-reference resolver, intentionally waiting on glossary integration;\n- source PR #136 and #130 — isolated documentation link repairs;\n- Research PR #7 and AuditRepo PR #27 — Gill source corpus and evidence.",
        "- source PR #178 is superseded by merged Bible PR #185 and must not be merged from its stale branch;\n- source PR #136 and #130 — isolated documentation link repairs;\n- glossary PR #183, Bible PR #185, Research PR #7 and AuditRepo Gill PR #27 are merged; refresh their resulting `main` state rather than reopening the retired branches.",
        "prompt concurrent boundaries",
    )

    reverify = f"""# CURRENT HEAD REVERIFY — 2026-07-24 — cache-bust fail-closed policy

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source merge: `{SOURCE_FULL}` — PR #187
- Exact verified PR head: `c8cd3a03c00bdb68606c88b42e25f7f435c0d5e8`
- Last exact production authority remains `{PROD_FULL}`
- This document advances source/CI truth only; it does not claim a new exact Pages deployment.

## Closed canonical row

`CACHE-BUST-NO-WRITER`

The historical row assumed that every stale `?v=` state required a general workflow writer that would mutate source after merge. That prescription is unsafe under concurrent-agent development and is now superseded by a fail-closed policy:

1. Shared Files Guard runs the default read-only `scripts/cache-bust.js` on every pull request and every push to `main`.
2. Metadata & IndexNow Readiness owns every `main` push through its `**` catch-all and checks source revisions before the production-like build.
3. Automatic Pages deploy follows only a successful readiness run and checks out the exact `workflow_run.head_sha`; manual recovery runs the same read-only check.
4. `scripts/cache-bust.js` writes only after explicit operator `--write`; detected drift exits nonzero instead of silently rewriting.
5. Arbitrary workflow writers are forbidden by `workflows:check`.

## Constrained glossary exception

The glossary workflow already contained a deliberate placement/asset autofix job. PR #187 does not widen it. The policy permits that single exception only when all of these remain true:

- pull-request event;
- explicit `autofix` label;
- same-repository head;
- write permission scoped to the autofix job while top-level permissions remain read-only;
- checkout and push-back to the requesting PR head;
- normalizers execute before `cache-bust.js --write`;
- the default read-only cache-bust check executes afterward;
- `git add -u` stages only tracked normalized files; `git add -A` is forbidden.

Any second writer or weakened exception guard is blocking.

## Permanent source scope

1. `scripts/check-workflows.js`
2. `scripts/lib/cache-bust-workflow-policy.js`

No page, content, CSS, runtime asset, route or workflow YAML was changed by PR #187.

## Exact-head evidence

| Contract | Run | Result |
|---|---:|---|
| Cache-bust policy materialization | `30086392750` | baseline topology, 17 adversarial mutations, current read-only state and live stale-asset mutation success |
| Shared Files Guard | `30086484719` | asset revisions, workflow policy, readiness/deploy linkage, shared/runtime regressions, strict guard and actionlint success |

The live adversarial test appended a tracked mutation to `js/search.js`, ran the default cache-bust command, required a nonzero exit, confirmed a stale-file diagnostic and verified that the mutated file hash did not change during the check. The original file was then restored. This demonstrates fail-closed detection without source rewriting.

## Why no general writer was added

A general post-merge writer would race other agents, create moving-main commits after review and make deployment authority harder to prove. The accepted architecture rejects invalid revisions before merge and before deployment. Explicit normalization remains reviewable in the requesting PR, with one narrowly constrained glossary exception.

## Counter transition

- Closed: `142 → 143`
- P1 open: `95 → 94`
- Total matrix open: `193 → 192`
- P0/P2/P3/refactoring/AuditRepo counters unchanged.
"""

    MATRIX.write_text(matrix, encoding="utf-8")
    PROMPT.write_text(prompt, encoding="utf-8")
    REVERIFY.parent.mkdir(parents=True, exist_ok=True)
    REVERIFY.write_text(reverify, encoding="utf-8")
    Path(__file__).unlink()
    print("Closed CACHE-BUST-NO-WRITER as a fail-closed policy supersession with exact source/CI evidence.")


if __name__ == "__main__":
    main()
