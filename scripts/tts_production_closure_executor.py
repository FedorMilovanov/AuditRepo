#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects" / "gb-is-my-strength"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
PACKAGE = PROJECT / "incoming" / "tts-deep-current-head-audit-2026-08-04"
CLOSURE = PACKAGE / "CLOSURE.md"
FINAL = PACKAGE / "FINAL-VALIDATION.md"
REVERIFY_REL = "reverify/CURRENT_HEAD_REVERIFY_2026-08-05_38b25703_tts-production-closure.md"
REVERIFY = PROJECT / REVERIFY_REL

PRODUCT_REPO = "FedorMilovanov/gb-is-my-strength"
CORE_MERGE = "0d60315d37efd5b47c76795f8167e99398a5b7e3"
PLAYEMBER_MERGE = "e63dbf7d2a925501587df81ff5fb84b816e4e95f"
RELEASE_SHA = "38b257030afb7cfa8a7b1128f8c86539fd36dec0"
RUN_ID = 30960174778
RUN_ATTEMPT = 1
READINESS_JOB = 92162173520
PROMOTION_JOB = 92165278471
CANDIDATE_ID = f"{RELEASE_SHA}:{RUN_ID}-{RUN_ATTEMPT}"
CANDIDATE_DIGEST = "sha256:973369f7753f89b9a4fae4d19f523f89aa2a50808a0d11cbe8448e79b793c9ef"
TRANSPORT_ARTIFACT_ID = 8912983035
TRANSPORT_DIGEST = "sha256:e7784d18a33e256da4da52a2d0d0a46d5587fb5c6659602047c6be7d8b71108e"
LIVE_ARTIFACT_ID = 8912993840
TTS_ARTIFACT_ID = 8912994737
IMMUTABLE_PATH = f"/deployments/{RELEASE_SHA}/{RUN_ID}-{RUN_ATTEMPT}.json"


def fail(message: str) -> None:
    raise SystemExit(message)


def fetch_json(url: str) -> object:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "auditrepo-tts-production-closure/1.0",
        "Cache-Control": "no-cache",
    }
    token = os.environ.get("GH_TOKEN", "").strip()
    if token and "api.github.com" in url:
        headers["Authorization"] = f"Bearer {token}"
        headers["X-GitHub-Api-Version"] = "2022-11-28"
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=45) as response:
        if response.status != 200:
            fail(f"GET {url}: HTTP {response.status}")
        return json.loads(response.read().decode("utf-8"))


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        fail(f"{label}: expected exactly one match, got {count}")
    return text.replace(old, new, 1)


def regex_replace_once(text: str, pattern: str, replacement: str, label: str, flags: int = 0) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        fail(f"{label}: expected exactly one regex match, got {count}")
    return updated


def verify_product_evidence() -> None:
    run = fetch_json(f"https://api.github.com/repos/{PRODUCT_REPO}/actions/runs/{RUN_ID}")
    if not isinstance(run, dict):
        fail("workflow run response is not an object")
    expected = {
        "name": "Deploy to GitHub Pages",
        "event": "push",
        "head_branch": "main",
        "head_sha": RELEASE_SHA,
        "status": "completed",
        "conclusion": "success",
        "run_attempt": RUN_ATTEMPT,
    }
    for key, value in expected.items():
        if run.get(key) != value:
            fail(f"workflow run {key}: expected {value!r}, got {run.get(key)!r}")

    jobs_payload = fetch_json(f"https://api.github.com/repos/{PRODUCT_REPO}/actions/runs/{RUN_ID}/jobs?per_page=100")
    if not isinstance(jobs_payload, dict) or not isinstance(jobs_payload.get("jobs"), list):
        fail("workflow jobs response is malformed")
    jobs = {job.get("id"): job for job in jobs_payload["jobs"] if isinstance(job, dict)}
    required_jobs = {
        READINESS_JOB: "Build and validate immutable release candidate",
        PROMOTION_JOB: "Promote exact readiness candidate",
    }
    required_steps = {
        READINESS_JOB: {
            "Gill mobile TOC and PlayEmber smoke",
            "Write generic immutable release provenance",
            "Verify prepared release candidate",
            "Upload immutable release candidate",
        },
        PROMOTION_JOB: {
            "Verify downloaded candidate identity",
            "Deploy exact candidate to GitHub Pages",
            "Verify generic live release contract",
            "Verify live TTS capability extension",
        },
    }
    for job_id, name in required_jobs.items():
        job = jobs.get(job_id)
        if not job:
            fail(f"missing required job {job_id}")
        if job.get("name") != name or job.get("status") != "completed" or job.get("conclusion") != "success":
            fail(f"job {job_id} is not the expected successful job")
        step_map = {step.get("name"): step for step in job.get("steps", []) if isinstance(step, dict)}
        for step_name in required_steps[job_id]:
            step = step_map.get(step_name)
            if not step or step.get("status") != "completed" or step.get("conclusion") != "success":
                fail(f"required step not successful: {step_name}")

    pointer = fetch_json("https://gospod-bog.ru/deployments/current.json?auditrepo_tts_closure=1")
    if not isinstance(pointer, dict):
        fail("live pointer is not an object")
    pointer_expected = {
        "releaseSha": RELEASE_SHA,
        "controlPlaneSha": RELEASE_SHA,
        "immutablePath": IMMUTABLE_PATH,
        "repository": PRODUCT_REPO,
    }
    for key, value in pointer_expected.items():
        if pointer.get(key) != value:
            fail(f"live pointer {key}: expected {value!r}, got {pointer.get(key)!r}")
    workflow = pointer.get("workflow") or {}
    artifact = pointer.get("artifact") or {}
    if workflow.get("runId") != RUN_ID or workflow.get("runAttempt") != RUN_ATTEMPT:
        fail("live pointer workflow identity mismatch")
    if artifact.get("candidateId") != CANDIDATE_ID or artifact.get("digest") != CANDIDATE_DIGEST:
        fail("live pointer candidate identity mismatch")

    manifest = fetch_json(f"https://gospod-bog.ru{IMMUTABLE_PATH}?auditrepo_tts_closure=1")
    if not isinstance(manifest, dict):
        fail("live manifest is not an object")
    if manifest.get("releaseSha") != RELEASE_SHA or manifest.get("controlPlaneSha") != RELEASE_SHA:
        fail("live manifest SHA mismatch")
    if (manifest.get("artifact") or {}).get("candidateId") != CANDIDATE_ID:
        fail("live manifest candidate ID mismatch")
    if (manifest.get("artifact") or {}).get("digest") != CANDIDATE_DIGEST:
        fail("live manifest candidate digest mismatch")
    tts = (manifest.get("extensions") or {}).get("tts")
    if not isinstance(tts, dict):
        fail("live manifest has no TTS extension")
    required_tts_keys = {"controller", "engine", "worker", "noticeCss"}
    if not required_tts_keys.issubset(tts):
        fail(f"live manifest TTS extension missing keys: {sorted(required_tts_keys - set(tts))}")


def update_matrix() -> None:
    text = MATRIX.read_text(encoding="utf-8")
    if "## ✅ ЗАКРЫТО (223)" not in text or "## 🟡 P2 — ОТКРЫТО (32)" not in text:
        fail("matrix counters/base changed; refusing stale closure")

    open_ids = ["TTS-DL-UNZIP-SYNC", "TTS-DL-NO-TABLOCK"]
    lines = text.splitlines()
    removed: dict[str, str] = {}
    kept: list[str] = []
    for line in lines:
        matched = next((bug_id for bug_id in open_ids if line.startswith(f"| {bug_id} |")), None)
        if matched:
            if matched in removed:
                fail(f"duplicate open row for {matched}")
            removed[matched] = line
        else:
            kept.append(line)
    if set(removed) != set(open_ids):
        fail(f"missing open TTS rows: {sorted(set(open_ids) - set(removed))}")
    text = "\n".join(kept) + ("\n" if text.endswith("\n") else "")

    closed_rows = (
        "| TTS-DL-UNZIP-SYNC | ✅ **FIXED-CURRENT / SOURCE+REAL-MODEL+CI+PRODUCTION-LIVE VERIFIED 2026-08-05.** Product PR #876 moved the ~280 MB model acquisition, integrity verification, archive extraction, IndexedDB persistence, ORT session creation and inference off the main thread into the governed worker boundary; current `vosk-tts-engine.js` selects `SharedWorker` first and a dedicated-worker fallback, and the real-model witness bounded the maximum UI gap at **32.7 ms**. Final PR #929 added the unchanged canonical Gill PlayEmber smoke as a permanent PR gate and repaired the trailing synthetic-click deploy blocker. Pages run `30960174778` deployed descendant `38b257030afb7cfa8a7b1128f8c86539fd36dec0`; readiness job `92162173520`, Gill smoke, immutable candidate verification/upload, promotion job `92165278471`, generic live contract and live TTS extension all passed. | `0d60315d` PR#876; `e63dbf7d` PR#929; deploy `30960174778` |\n"
        "| TTS-DL-NO-TABLOCK | ✅ **FIXED-CURRENT / SHARED-OWNER+MULTITAB+CI+PRODUCTION-LIVE VERIFIED 2026-08-05.** Product PR #876 replaced page-local duplicate ownership with one SharedWorker-first model/session owner and deterministic follower reuse; the real-model and multitab contracts proved exactly one acquisition with follower/shared reuse while preserving the bounded dedicated-worker fallback. All 19 exact-head workflow groups passed before merge `0d60315d37efd5b47c76795f8167e99398a5b7e3`. Final PR #929/merge `e63dbf7d2a925501587df81ff5fb84b816e4e95f` closed the remaining Gill mobile deploy blocker without weakening assertions. The deployed live TTS witness on run `30960174778` verified the versioned controller/engine/worker assets, required CSP directives, exact asset hashes and `lazyTtsPrecache: false` on Gill and Antisovetov routes. | `0d60315d` PR#876; `e63dbf7d` PR#929; live artifact `8912994737` |\n"
    )
    closed_header = "## ✅ ЗАКРЫТО (223)\n\n| ID | Описание | Коммит |\n|---|---|---|\n"
    if closed_header not in text:
        fail("closed table header drifted")
    text = text.replace(closed_header, closed_header + closed_rows, 1)

    text = replace_once(text, "## ✅ ЗАКРЫТО (223)", "## ✅ ЗАКРЫТО (225)", "closed heading")
    text = replace_once(text, "## 🟡 P2 — ОТКРЫТО (32)", "## 🟡 P2 — ОТКРЫТО (30)", "P2 heading")
    text = replace_once(text, "| Закрыто (fixed) | 223 |", "| Закрыто (fixed) | 225 |", "closed stats")
    text = replace_once(text, "| P2 открыто | 32 |", "| P2 открыто | 30 |", "P2 stats")
    text = replace_once(text, "| **Всего открыто (матрица)** | **148** |", "| **Всего открыто (матрица)** | **146** |", "open stats")

    text = regex_replace_once(
        text,
        r"^\| Source verification anchor \|.*$",
        "| Source verification anchor | `38b257030afb7cfa8a7b1128f8c86539fd36dec0` (production-deployed Product descendant containing core TTS PR #876 and final PlayEmber PR #929; two TTS P2 delivery/runtime rows closed with exact source, real-model, CI, immutable candidate and live evidence). |",
        "source anchor",
        flags=re.MULTILINE,
    )
    text = regex_replace_once(
        text,
        r"^\| Deploy \|.*$",
        f"| Deploy | ✅ **EXACT PRODUCTION AUTHORITY.** Run `{RUN_ID}` attempt `{RUN_ATTEMPT}`, release/control SHA `{RELEASE_SHA}`, candidate `{CANDIDATE_ID}`, candidate digest `{CANDIDATE_DIGEST}`, transport artifact `{TRANSPORT_ARTIFACT_ID}` digest `{TRANSPORT_DIGEST}`. Readiness job `{READINESS_JOB}`, unchanged Gill mobile PlayEmber smoke, immutable candidate verification/upload, promotion job `{PROMOTION_JOB}`, Pages deployment, generic live contract and live TTS extension all passed. |",
        "deploy masthead",
        flags=re.MULTILINE,
    )
    text = regex_replace_once(
        text,
        r"^\| Last reverify \|.*$",
        f"| Last reverify | `{REVERIFY_REL}` (core TTS #876 + final PlayEmber #929 + exact Pages/live closure; Product issue #61 remains open for non-TTS ReaderProjection/search/accessibility/save scope). |",
        "last reverify",
        flags=re.MULTILINE,
    )
    text = regex_replace_once(
        text,
        r"^⚠️ Deploy-формулировки.*$",
        f"⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. Current exact production authority is run `{RUN_ID}` attempt `{RUN_ATTEMPT}`, release/control SHA `{RELEASE_SHA}`, candidate digest `{CANDIDATE_DIGEST}`. The matrix is a durable verified backlog; later source movement does not silently reopen or close rows without a new applicable reverify.",
        "production note",
        flags=re.MULTILINE,
    )
    text = regex_replace_once(
        text,
        r"^## Статистика \(обновлено .*\)$",
        f"## Статистика (обновлено 2026-08-05: source/deploy anchor `38b25703`; exact production run `{RUN_ID}`; 371 canonical = 225 closed + 146 open)",
        "stats heading",
        flags=re.MULTILINE,
    )

    session_heading = "## Session log"
    session_pos = text.find(session_heading)
    if session_pos < 0:
        fail("Session log heading missing")
    first_entry = text.find("\n### ", session_pos)
    if first_entry < 0:
        fail("Session log first entry missing")
    session_entry = f"""

### 2026-08-05 — TTS production closure @ exact Product `{RELEASE_SHA[:8]}`
- Closed `TTS-DL-UNZIP-SYNC` and `TTS-DL-NO-TABLOCK` from Product core PR #876 / merge `{CORE_MERGE}` plus final PlayEmber PR #929 / merge `{PLAYEMBER_MERGE}`.
- Real-model evidence retained: worker-owned acquisition/extraction/IDB/ORT/inference, maximum UI gap **32.7 ms**, exactly one model acquisition and follower/shared reuse; all 19 core workflow groups passed.
- Exact production authority: Pages run `{RUN_ID}` attempt `{RUN_ATTEMPT}`, release/control `{RELEASE_SHA}`, candidate `{CANDIDATE_ID}`, digest `{CANDIDATE_DIGEST}`.
- Readiness job `{READINESS_JOB}` passed the unchanged Gill mobile PlayEmber smoke and immutable candidate barrier; promotion job `{PROMOTION_JOB}` passed exact candidate identity, Pages deploy, generic live release and live TTS extension.
- Live evidence artifacts: generic `{LIVE_ARTIFACT_ID}`, TTS `{TTS_ARTIFACT_ID}`; deployed TTS routes and versioned assets/hash/CSP/SW boundaries passed.
- Product issue #474 recovered; #61 remains open only for independent non-TTS ReaderProjection/speakable-search, accessibility slot/radiogroup, popup semantics and save-store scope.
- Canonical arithmetic: total remains **371**; closed `223 → 225`, open `148 → 146`, P2 `32 → 30`.
"""
    text = text[:first_entry] + session_entry + text[first_entry:]

    MATRIX.write_text(text, encoding="utf-8")


def write_documents() -> None:
    closure = f"""# TTS Deep Current-Head Audit — Closure

## Disposition

**CLOSED / FIXED-CURRENT / PRODUCTION-LIVE VERIFIED.**

The immutable baseline and original evidence remain in `REPORT.md`. This document records the completed implementation and deployment chain.

## Product implementation chain

- Baseline audit: Product PR #875.
- Core TTS/Vosk implementation: PR #876, merge `{CORE_MERGE}`.
- Final mobile PlayEmber long-press repair and permanent canonical Gill PR gate: PR #929, merge `{PLAYEMBER_MERGE}`.
- Production-deployed descendant: `{RELEASE_SHA}`.

The core implementation moved model acquisition, integrity verification, archive extraction, IndexedDB persistence, ORT session creation and inference into the worker boundary. SharedWorker-first ownership provides one shared model/session owner with deterministic follower reuse; the bounded dedicated-worker fallback is retained. Real-model validation recorded a maximum UI gap of **32.7 ms**, exactly one acquisition and follower/shared reuse. All 19 core workflow groups passed.

The final PlayEmber repair consumes exactly one browser-generated trailing click after a confirmed touch/pen long-press stop. The unchanged `gill:mobile-play:smoke` is now a permanent TTS PR gate and passed on the final exact head and in production readiness.

## Exact production authority

- Workflow: `Deploy to GitHub Pages`
- Run: `{RUN_ID}`, attempt `{RUN_ATTEMPT}`
- Release/control SHA: `{RELEASE_SHA}`
- Readiness job: `{READINESS_JOB}` — success
- Promotion job: `{PROMOTION_JOB}` — success
- Candidate ID: `{CANDIDATE_ID}`
- Candidate digest: `{CANDIDATE_DIGEST}`
- Candidate size/files: `85,278,223` bytes / `1,179` files
- Immutable manifest: `{IMMUTABLE_PATH}`
- Transport artifact: `{TRANSPORT_ARTIFACT_ID}` / `{TRANSPORT_DIGEST}`

Readiness passed the full source/build/runtime barrier, the unchanged Gill mobile TOC and PlayEmber smoke, provenance generation, candidate verification and upload. Promotion passed same-run candidate identity, Pages deployment, the generic live release contract and the live TTS capability extension.

## Live evidence

- Generic live evidence artifact: `{LIVE_ARTIFACT_ID}` — PASS.
- TTS live evidence artifact: `{TTS_ARTIFACT_ID}` — PASS.
- Live TTS witness routes: `/articles/dzhon-gill-chast-1-chelovek/` and `/articles/20-antisovetov-pastoru/`.
- Versioned controller, engine, worker and notice CSS were discovered from live routes and matched their deployed hashes.
- CSP `connect-src`, `media-src` and `worker-src` boundaries passed.
- Deployed service worker passed with `lazyTtsPrecache: false`.

## Canonical matrix disposition

Close exactly these P2 rows:

1. `TTS-DL-UNZIP-SYNC`;
2. `TTS-DL-NO-TABLOCK`.

Canonical arithmetic after this transaction: **371 total = 225 closed + 146 open**; P2 open becomes **30**.

## Issue boundary

- Product deploy lifecycle #474 recovered and is closed with exact run evidence.
- Product umbrella #61 remains open for independent non-TTS ReaderProjection/speakable-search policy, inactive speed/search accessibility exposure and roving keyboard model, popup semantics, and canonical save metadata/store work.
"""
    final = f"""# TTS Deep Current-Head Audit — Final Validation

## Verdict

**PASS — source, real-model, CI, immutable release and live production evidence agree.**

## Validation ledger

| Layer | Evidence | Result |
|---|---|---|
| Baseline | Immutable `REPORT.md` package | PASS |
| Core source | PR #876 / `{CORE_MERGE}` | PASS |
| Real model / responsiveness | worker-owned model path; max UI gap 32.7 ms | PASS |
| Shared ownership | exactly one acquisition; follower/shared reuse | PASS |
| Core CI | 19/19 workflow groups | PASS |
| Final Gill blocker | PR #929 / `{PLAYEMBER_MERGE}` | PASS |
| Permanent regression barrier | unchanged canonical Gill smoke in TTS PR workflow | PASS |
| Production readiness | run `{RUN_ID}`, job `{READINESS_JOB}` | PASS |
| Immutable candidate | `{CANDIDATE_ID}` / `{CANDIDATE_DIGEST}` | PASS |
| Pages promotion | job `{PROMOTION_JOB}` | PASS |
| Generic live release | artifact `{LIVE_ARTIFACT_ID}` | PASS |
| Live TTS capability | artifact `{TTS_ARTIFACT_ID}` | PASS |

## Production checks witnessed

- `Gill mobile TOC and PlayEmber smoke` succeeded unchanged.
- Candidate provenance, verification and upload succeeded.
- The exact same-run candidate was downloaded, reverified and deployed.
- `/deployments/current.json` and `{IMMUTABLE_PATH}` agreed on repository, run, SHA, candidate ID and digest.
- Live Gill and Antisovetov routes exposed the expected versioned TTS assets and CSP directives.
- Live controller/engine/worker/CSS hashes matched the deployed manifest.
- Service worker TTS assets remained lazy (`lazyTtsPrecache: false`).

## Closure decision

`TTS-DL-UNZIP-SYNC` and `TTS-DL-NO-TABLOCK` are fixed-current and production-live verified. No other matrix row is closed by this package. Product #61 stays open for its non-TTS scope.
"""
    next_prompt = f"""# NEXT AGENT PROMPT — gb-is-my-strength

## Exact authority

- AuditRepo base incorporated before this transaction: `75f6aa9a11fa46c02bfe03272f52dec5f5eead15`.
- Product source and production anchor: `{RELEASE_SHA}`.
- Core TTS merge: `{CORE_MERGE}` (PR #876).
- Final PlayEmber merge: `{PLAYEMBER_MERGE}` (PR #929).
- Exact production authority: run `{RUN_ID}` attempt `{RUN_ATTEMPT}`, readiness job `{READINESS_JOB}`, promotion job `{PROMOTION_JOB}`.
- Candidate: `{CANDIDATE_ID}`; digest `{CANDIDATE_DIGEST}`.
- Canonical reverify: `{REVERIFY_REL}`.

## Canonical matrix

- **371 total = 225 closed + 146 open**.
- Open severity counts: P0 `0`, P1 `70`, P2 `30`, P3 `39`, refactoring `4`, AuditRepo `3`.
- `TTS-DL-UNZIP-SYNC` is closed: model acquisition/extraction/IDB/ORT/inference are worker-owned and production-live verified.
- `TTS-DL-NO-TABLOCK` is closed: SharedWorker-first single ownership and follower reuse passed real-model/multitab and production-live evidence.
- `SEARCH-P2-08` remains closed from Product PR #901; `SEARCH-P2-07` remains open pending authoritative/licensed corpus plus rights/provenance.

## Production evidence retained

- Readiness passed the unchanged canonical Gill mobile PlayEmber smoke and immutable candidate barrier.
- Generic live artifact `{LIVE_ARTIFACT_ID}` and TTS live artifact `{TTS_ARTIFACT_ID}` both passed.
- Live TTS evidence verified Gill and Antisovetov routes, versioned controller/engine/worker/CSS, exact hashes, CSP and `lazyTtsPrecache: false`.
- Product issue #474 recovered and is closed.

## Remaining Reader controls boundary

Product umbrella #61 intentionally remains open for independent work:

1. unify ReaderProjection with speakable/search/summary/print policy;
2. remove inactive speed/search controls from Tab/accessibility exposure;
3. complete the radiogroup roving keyboard model and popup semantics;
4. move save/favorite metadata to the canonical route metadata/store contract.

## Next bounded search lanes retained

1. `SEARCH-P2-09`: implement the advertised `/?q={{search_term_string}}` SearchAction target as a real search-open/query state.
2. `SEARCH-P2-10`, `SEARCH-P2-11`, `SEARCH-P2-12`: complete AT/modal/touch contracts with browser evidence.
3. `SEARCH-P1-01`: extend the unified command palette to remaining searchable app/tool routes.
4. `SEARCH-P2-07`: proceed only with authoritative/licensed corpus and rights/provenance evidence.
5. Search P3 polish rows.

Re-read live Product `main`, the current deployment pointer and source-owner blobs before opening a new mutation lane.
"""
    reverify = f"""# Current-Head Reverify — TTS Production Closure

- Project: `gb-is-my-strength`
- Date: 2026-08-05
- AuditRepo base incorporated: `75f6aa9a11fa46c02bfe03272f52dec5f5eead15`
- Product deployed source/control SHA: `{RELEASE_SHA}`
- Core TTS merge: `{CORE_MERGE}` (PR #876)
- Final PlayEmber merge: `{PLAYEMBER_MERGE}` (PR #929)
- Deploy run: `{RUN_ID}` attempt `{RUN_ATTEMPT}`

## Question

Are the two canonical P2 TTS delivery findings still open on the selected current/deployed Product authority?

## Findings

### `TTS-DL-UNZIP-SYNC`

**Result: FIXED-CURRENT / PRODUCTION-LIVE VERIFIED.**

The model acquisition, integrity, extraction, persistence, ORT session and inference path is worker-owned. Real-model evidence bounded the maximum UI gap at 32.7 ms. The final deployed readiness job passed the unchanged canonical Gill mobile PlayEmber smoke and immutable candidate verification.

### `TTS-DL-NO-TABLOCK`

**Result: FIXED-CURRENT / PRODUCTION-LIVE VERIFIED.**

SharedWorker-first ownership supplies one shared model/session owner; exact real-model/multitab evidence proved one acquisition and follower/shared reuse. The deployed live witness verified the versioned controller/engine/worker extension and service-worker lazy boundary.

## Exact deployment chain

- Readiness job `{READINESS_JOB}`: success.
- Promotion job `{PROMOTION_JOB}`: success.
- Candidate ID: `{CANDIDATE_ID}`.
- Candidate digest: `{CANDIDATE_DIGEST}`.
- Immutable manifest: `{IMMUTABLE_PATH}`.
- Generic live artifact `{LIVE_ARTIFACT_ID}`: PASS.
- TTS live artifact `{TTS_ARTIFACT_ID}`: PASS.

## Live surface evidence

The TTS contract passed on Gill and Antisovetov routes, including versioned asset discovery, exact hashes, CSP worker/media/connect directives and `lazyTtsPrecache: false`.

## Canonical action

Move exactly `TTS-DL-UNZIP-SYNC` and `TTS-DL-NO-TABLOCK` from P2 open to closed. Arithmetic becomes **371 = 225 closed + 146 open**, P2 **30**. Keep Product #61 open for non-TTS ReaderProjection/search/accessibility/save scope.
"""
    CLOSURE.write_text(closure, encoding="utf-8")
    FINAL.write_text(final, encoding="utf-8")
    NEXT.write_text(next_prompt, encoding="utf-8")
    if REVERIFY.exists():
        fail(f"reverify already exists: {REVERIFY}")
    REVERIFY.write_text(reverify, encoding="utf-8")


def postconditions() -> None:
    matrix = MATRIX.read_text(encoding="utf-8")
    for bug_id in ("TTS-DL-UNZIP-SYNC", "TTS-DL-NO-TABLOCK"):
        if matrix.count(f"| {bug_id} |") != 1:
            fail(f"{bug_id}: expected exactly one canonical row after closure")
    required = [
        "## ✅ ЗАКРЫТО (225)",
        "## 🟡 P2 — ОТКРЫТО (30)",
        "| Закрыто (fixed) | 225 |",
        "| P2 открыто | 30 |",
        "| **Всего открыто (матрица)** | **146** |",
        CANDIDATE_DIGEST,
        REVERIFY_REL,
    ]
    for token in required:
        if token not in matrix:
            fail(f"matrix missing postcondition token: {token}")
    combined = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (CLOSURE, FINAL, NEXT, REVERIFY)
    )
    for token in (RELEASE_SHA, str(RUN_ID), CANDIDATE_DIGEST, PLAYEMBER_MERGE, CORE_MERGE):
        if token not in combined:
            fail(f"final docs missing evidence token: {token}")


def main() -> None:
    branch = os.environ.get("GITHUB_REF_NAME", "")
    if branch and branch != "lane/tts-production-closure-20260805":
        fail(f"unexpected branch: {branch}")
    verify_product_evidence()
    update_matrix()
    write_documents()
    postconditions()
    print(json.dumps({
        "result": "PASS",
        "releaseSha": RELEASE_SHA,
        "runId": RUN_ID,
        "candidateDigest": CANDIDATE_DIGEST,
        "matrix": {"total": 371, "closed": 225, "open": 146, "p2": 30},
    }, indent=2))


if __name__ == "__main__":
    main()
