#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
PROMPT = ROOT / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
REVERIFY_REL = "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md"
REVERIFY = ROOT / REVERIFY_REL

SOURCE_FULL = "96b7a20f6d9b65fc2363c04c744c5f1af24e000c"
SOURCE_SHORT = "96b7a20f"
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

    closed_row = (
        "| TTS-DL-CONSENT | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-24.** "
        "Owner-approved PR #177 preserves immediate Web Speech and shows one compact post-start card only on a real ~280 MB model cache miss. "
        "`Не загружать` aborts the active transfer through `AbortController`, persists the opt-out and leaves the ordinary voice working. "
        "Exact final head `1c38a8b6`: TTS Download Consent `30083527472`, Shared Files Guard `30083527643`, Route Registry Validators `30083527432` and Visual Parity `30083527431` all succeeded; the production-like 75-route Chromium matrix, route semantics and Nagornaya UI remained green. "
        "Manual review also fixed and mutation-guarded a disconnected loading-pulse keyframe. | `96b7a20f` PR#177 |\n"
    )

    open_row = (
        "| TTS-DL-CONSENT | Неявная загрузка ~280 МБ модели: первый клик «Слушать» молча качает нейромодель в фоне "
        "(`warmVoskInBackground`→`ensureLoaded`, floating-cluster-controller.js:344/363), пользователь не спрошен и на этой сессии хорошего голоса не слышит. "
        "**Меняет UX → решение владельца.** Верификация V12 (GPT-5.5) построчно подтверждена | `incoming/tts-delivery-architecture-verification-2026-07-08/REPORT.md` |\n"
    )

    matrix = replace_once(
        matrix,
        "| Source HEAD | `bd537dc107bd4b80c72075357f452690cbc39781` (current source main; Gill source-truth PRs #156/#174 plus PR #173 input-safe, DOM-driven MapEngine keyboard contract) |",
        "| Source HEAD | `96b7a20f6d9b65fc2363c04c744c5f1af24e000c` (current source main; homepage PRs #181/#182 plus PR #177 cancellable enhanced-voice download contract) |",
        "matrix source head",
    )
    matrix = replace_once(
        matrix,
        "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_bd537dc1_map-keyboard-contract.md` |",
        "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md` |",
        "matrix last reverify",
    )
    matrix = replace_once(
        matrix,
        "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `bd537dc1`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_bd537dc1_map-keyboard-contract.md`.",
        "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `96b7a20f`; last exact production authority: `8a535267`; source/CI evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`.",
        "matrix authority warning",
    )
    matrix = replace_once(matrix, "## ✅ ЗАКРЫТО (141)", "## ✅ ЗАКРЫТО (142)", "closed heading")
    matrix = replace_once(
        matrix,
        "|---|---|---|\n| MAP-P1-16 |",
        "|---|---|---|\n" + closed_row + "| MAP-P1-16 |",
        "closed row insertion",
    )
    matrix = replace_once(matrix, open_row, "", "remove open TTS consent row")
    matrix = replace_once(matrix, "## 🟠 P1 — ОТКРЫТО (96)", "## 🟠 P1 — ОТКРЫТО (95)", "P1 heading")
    matrix = replace_once(
        matrix,
        "| TTS-DL-NO-TABLOCK | Нет межвкладочного лока: `_voskWarmupStarted` — page-local (controller:343), `navigator.locks`/`BroadcastChannel` отсутствуют → 2 вкладки могут качать 280 МБ дважды. Низкая частота; fix осмыслен только вместе с TTS-DL-CONSENT | V12 W1-CI-39, verified |",
        "| TTS-DL-NO-TABLOCK | Нет межвкладочного лока: `_voskWarmupStarted` — page-local, `navigator.locks`/`BroadcastChannel` отсутствуют → 2 вкладки всё ещё могут качать модель дважды. Consent UX закрыт PR #177, но cross-tab ownership остаётся самостоятельным P2 runtime-долгом. | V12 W1-CI-39, verified; PR#177 residual |",
        "cross-tab residual wording",
    )
    matrix = replace_once(
        matrix,
        "## Статистика (обновлено 2026-07-24: source bd537dc1 + MapEngine keyboard contracts)",
        "## Статистика (обновлено 2026-07-24: source 96b7a20f + cancellable TTS download contract)",
        "statistics heading",
    )
    matrix = replace_once(matrix, "| Закрыто (fixed) | 141 |", "| Закрыто (fixed) | 142 |", "closed counter")
    matrix = replace_once(matrix, "| P1 открыто | 96 |", "| P1 открыто | 95 |", "P1 counter")
    matrix = replace_once(
        matrix,
        "| **Всего открыто (матрица)** | **194** |",
        "| **Всего открыто (матрица)** | **193** |",
        "total open counter",
    )

    session_entry = (
        "- **2026-07-24 — Source `96b7a20f`: owner-approved cancellable enhanced-voice download.** "
        "PR #177 preserves immediate Web Speech, announces the real ~280 MB cache-miss transfer through one compact post-start card, aborts it with `AbortController` on `Не загружать`, persists refusal and keeps the ordinary voice available. "
        "Exact final head `1c38a8b6` passed TTS Download Consent `30083527472`, Shared Files Guard `30083527643`, Route Registry Validators `30083527432` and Visual Parity `30083527431`; all 75 public routes, route semantics and Nagornaya UI stayed green. "
        "Manual review fixed a silent pulse-keyframe disconnect and added a sixth adversarial mutation. `TTS-DL-NO-TABLOCK` and `TTS-DL-UNZIP-SYNC` remain open. Production authority remains `8a535267` pending same-SHA deploy evidence. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`.\n\n"
    )
    matrix = replace_once(
        matrix,
        "> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.\n\n- **2026-07-24 — Source `bd537dc1`:",
        "> чистым статусом**. Новое — сверху. Детали каждого HEAD — в парном `reverify/` доке.\n\n" + session_entry + "- **2026-07-24 — Source `bd537dc1`:",
        "session log insertion",
    )

    prompt = replace_once(
        prompt,
        "**Source main:** `bd537dc107bd4b80c72075357f452690cbc39781`",
        "**Source main:** `96b7a20f6d9b65fc2363c04c744c5f1af24e000c`",
        "prompt source main",
    )
    prompt = replace_once(
        prompt,
        "**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_bd537dc1_map-keyboard-contract.md`",
        "**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`",
        "prompt reverify",
    )
    prompt = replace_once(prompt, "- source `main` is `bd537dc1`;", "- source `main` is `96b7a20f`;", "prompt short source")
    prompt = replace_once(
        prompt,
        "- homepage rebuild, Gill PRs #156/#174, audit corpus PR #169 and map keyboard PR #173 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.",
        "- homepage PRs #181/#182, Gill PRs #156/#174, audit corpus PR #169, map keyboard PR #173 and cancellable TTS PR #177 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.",
        "prompt authority detail",
    )
    prompt = replace_once(
        prompt,
        "Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_bd537dc1_map-keyboard-contract.md`.",
        "Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_96b7a20f_tts-download-consent.md`.",
        "prompt canonical evidence",
    )
    prompt = replace_once(
        prompt,
        "- `MAP-P1-17` — closed by PR #173: numeric navigation derives the actual visible DOM tab order, reaches `sci` through the canonical click handler, and permanently separates shared `ishod` MapEngine smoke from bespoke legacy `avraam`.\n",
        "- `MAP-P1-17` — closed by PR #173: numeric navigation derives the actual visible DOM tab order, reaches `sci` through the canonical click handler, and permanently separates shared `ishod` MapEngine smoke from bespoke legacy `avraam`.\n"
        "- `TTS-DL-CONSENT` — closed by owner-approved PR #177: immediate Web Speech remains, one compact card announces a real model cache miss, `Не загружать` aborts and persists refusal, and permanent source/mutation/desktop/mobile Chromium contracts guard the behavior.\n",
        "prompt completed TTS lane",
    )
    prompt = replace_once(
        prompt,
        "- source PR #161 — universal glossary contract; preserve removal of the unpublished Baptist research href during rebase;\n- source PR #136 and #130 — isolated documentation link repairs;",
        "- source PR #180 — current universal glossary v2 lane; it supersedes older glossary branches only after exact-head acceptance and owns a broad cache-bust surface;\n- source PR #178 — strict canonical Bible-reference resolver, intentionally waiting on glossary integration;\n- source PR #136 and #130 — isolated documentation link repairs;",
        "prompt concurrent boundaries",
    )
    prompt = replace_once(
        prompt,
        "- `TTS-DL-NO-TABLOCK` — no current proof of cross-tab ownership for the large model download.\n- `REG-001`",
        "- `TTS-DL-NO-TABLOCK` — no current proof of cross-tab ownership for the large model download; consent UX is fixed, duplicate downloads remain possible.\n- `TTS-DL-UNZIP-SYNC` — the full archive is still synchronously unzipped on the main thread.\n- `REG-001`",
        "prompt open TTS residuals",
    )

    reverify = f"""# CURRENT HEAD REVERIFY — 2026-07-24 — TTS download consent

## Authority boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source merge: `{SOURCE_FULL}` — PR #177
- Exact verified PR head: `1c38a8b6c9c31d7b9b98a54ab08b46f2f7e4a012`
- Last exact production authority remains `{PROD_FULL}`
- This document advances source/CI truth only; it does not claim a new exact Pages deployment.

## Closed canonical row

`TTS-DL-CONSENT`

The owner-approved behavior is post-start and non-blocking: ordinary Web Speech begins immediately. Only a real enhanced-model cache miss creates one compact status card. The card states that the ordinary voice already works and exposes one primary `Не загружать` action. That action aborts the active model fetch through `AbortController`, records `gbx-vosk-warmup=off`, prevents later automatic retries and does not interrupt the ordinary voice.

## Permanent source scope

1. `.github/workflows/tts-download-consent.yml`
2. `css/tts-download-notice.css`
3. `js/vosk-tts-engine.js`
4. `scripts/audit-pro.js`
5. `scripts/tts-download-consent-contract-test.js`
6. `scripts/tts-download-notice-browser-test.js`

No homepage, map, glossary, article, route mirror or shared `site.css` file was changed by PR #177.

## Exact-head evidence

| Contract | Run | Result |
|---|---:|---|
| TTS Download Consent | `30083527472` | source/mutation and desktop/mobile Chromium jobs success |
| Shared Files Guard | `30083527643` | shared/system, runtime, workflow and actionlint gates success |
| Route Registry Validators | `30083527432` | registry contracts, production-like build, SEO, search/index, 75 public routes, route semantics and Nagornaya UI success |
| Visual Parity Guard | `30083527431` | production build, screenshot diagnostics and owner-approved route policy success |

The final source contract rejects six adversarial mutations: missing `AbortSignal`, missing persisted refusal, removed cancel action, undersized coarse-pointer target, stale stylesheet revision and a disconnected loading-pulse keyframe. The browser fixture verifies desktop and mobile-dark layout, pointer and keyboard activation, actual request abortion, repeat opt-out behavior and absence of a hidden-control focus trap.

Manual review found the pulse animation referencing `wb-tts-download-pulse` while the declared keyframe was `gb-tts-download-pulse`. The mismatch was fixed and made permanently blocking rather than left as untested decoration.

## Audit integration

The isolated stylesheet is registered in `audit-pro`; CSS/JS structure success text derives from the canonical allowlist sizes instead of literal counts. The full registry-owned source corpus and 75-route production browser matrix remained green.

## Deliberately open residuals

- `TTS-DL-NO-TABLOCK`: two tabs can still initiate separate large downloads because no cross-tab ownership/lock exists.
- `TTS-DL-UNZIP-SYNC`: the complete archive is still synchronously decompressed on the main thread.

Those are separate runtime/performance debts and are not silently absorbed into the consent closure.

## Counter transition

- Closed: `141 → 142`
- P1 open: `96 → 95`
- Total matrix open: `194 → 193`
- P0/P2/P3/refactoring/AuditRepo counters unchanged.
"""

    MATRIX.write_text(matrix, encoding="utf-8")
    PROMPT.write_text(prompt, encoding="utf-8")
    REVERIFY.parent.mkdir(parents=True, exist_ok=True)
    REVERIFY.write_text(reverify, encoding="utf-8")
    Path(__file__).unlink()
    print("Closed TTS-DL-CONSENT with exact source/CI evidence; residual TTS debts preserved.")


if __name__ == "__main__":
    main()
