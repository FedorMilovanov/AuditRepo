#!/usr/bin/env python3
"""One-shot exact-production SSOT writer.

This file is intentionally self-deleting. It waits for the source repository's
trusted deployment-release-witness, verifies the public pointer and immutable
manifest, updates only the three AuditRepo SSOT/evidence files, then removes
itself and its temporary workflow before the workflow commits the final tree.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SOURCE_REPOSITORY = "FedorMilovanov/gb-is-my-strength"
SOURCE_PR = 569
EXPECTED_SHA = "b3ed559f82756ad160c18a90d5405b29caab749d"
AUDIT_BASE_SHA = "3213e449b41041a71c59bf581c276bb0a26d0c67"
BRANCH = "agent/gb-current-head-production-sync-20260731"
WORKFLOW_PATH = ROOT / ".github/workflows/tmp-gb-current-head-sync.yml"
SCRIPT_PATH = Path(__file__).resolve()
MATRIX_PATH = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
NEXT_PATH = ROOT / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
REVERIFY_REL = "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-31_b3ed559f_exact-production-home-closure.md"
REVERIFY_PATH = ROOT / REVERIFY_REL
MARKER_PREFIX = f"<!-- deployment-release-witness:{EXPECTED_SHA}:{EXPECTED_SHA}:"
COMMENTS_URL = f"https://api.github.com/repos/{SOURCE_REPOSITORY}/issues/{SOURCE_PR}/comments?per_page=100"
SOURCE_COMMIT_URL = f"https://api.github.com/repos/{SOURCE_REPOSITORY}/commits/{EXPECTED_SHA}"
SOURCE_PR_URL = f"https://api.github.com/repos/{SOURCE_REPOSITORY}/pulls/{SOURCE_PR}"
CURRENT_URL = "https://gospod-bog.ru/deployments/current.json"
POLL_SECONDS = 20
MAX_POLLS = 330


def request_json(url: str, *, retries: int = 4) -> Any:
    token = os.environ.get("GH_TOKEN", "").strip()
    headers = {
        "Accept": "application/vnd.github+json" if url.startswith("https://api.github.com/") else "application/json",
        "User-Agent": "AuditRepo-exact-production-sync/1.0",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
    }
    if token and url.startswith("https://api.github.com/"):
        headers["Authorization"] = f"Bearer {token}"
        headers["X-GitHub-Api-Version"] = "2022-11-28"
    error: Exception | None = None
    for attempt in range(1, retries + 1):
        cache_busted = url
        if url.startswith("https://gospod-bog.ru/"):
            separator = "&" if "?" in url else "?"
            cache_busted = f"{url}{separator}audit={int(time.time())}-{attempt}"
        try:
            with urllib.request.urlopen(urllib.request.Request(cache_busted, headers=headers), timeout=30) as response:
                if response.status != 200:
                    raise RuntimeError(f"GET {url}: HTTP {response.status}")
                return json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, RuntimeError) as exc:
            error = exc
            if attempt < retries:
                time.sleep(attempt * 2)
    raise RuntimeError(f"GET {url} failed after {retries} attempts: {error}")


def exact_source_boundary() -> None:
    commit = request_json(SOURCE_COMMIT_URL)
    if str(commit.get("sha", "")).lower() != EXPECTED_SHA:
        raise RuntimeError("source commit endpoint did not return the expected exact SHA")
    pull = request_json(SOURCE_PR_URL)
    if not pull.get("merged") or str(pull.get("merge_commit_sha", "")).lower() != EXPECTED_SHA:
        raise RuntimeError("PR #569 is not the exact merged owner of the expected SHA")
    repo = request_json(f"https://api.github.com/repos/{SOURCE_REPOSITORY}")
    default_branch = str(repo.get("default_branch", "main"))
    branch = request_json(f"https://api.github.com/repos/{SOURCE_REPOSITORY}/branches/{default_branch}")
    current = str(branch.get("commit", {}).get("sha", "")).lower()
    if current != EXPECTED_SHA:
        raise RuntimeError(f"source main moved during closure: expected {EXPECTED_SHA}, found {current}")


def parse_envelope(body: str) -> dict[str, Any]:
    match = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", body)
    if not match:
        raise RuntimeError("deployment witness comment lacks the machine JSON envelope")
    value = json.loads(match.group(1))
    if not isinstance(value, dict):
        raise RuntimeError("deployment witness envelope is not an object")
    return value


def wait_for_witness() -> tuple[dict[str, Any], str, int]:
    for poll in range(1, MAX_POLLS + 1):
        comments = request_json(COMMENTS_URL)
        for comment in comments:
            body = str(comment.get("body", ""))
            if MARKER_PREFIX in body:
                envelope = parse_envelope(body)
                return envelope, body, int(comment.get("id", 0))
        if poll % 15 == 0:
            print(f"deployment witness not present yet after {poll * POLL_SECONDS}s", flush=True)
        time.sleep(POLL_SECONDS)
    raise RuntimeError("timed out waiting for the exact deployment-release-witness on PR #569")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def verify_envelope(envelope: dict[str, Any]) -> dict[str, Any]:
    require(envelope.get("schemaVersion") == 3, "unexpected witness schema")
    require(envelope.get("kind") == "deployment-release-witness", "unexpected witness kind")
    require(envelope.get("repository") == SOURCE_REPOSITORY, "witness repository mismatch")
    require(str(envelope.get("releaseSha", "")).lower() == EXPECTED_SHA, "release SHA mismatch")
    require(str(envelope.get("controlPlaneSha", "")).lower() == EXPECTED_SHA, "control-plane SHA mismatch")

    deploy = envelope.get("deploy") or {}
    candidate = envelope.get("releaseCandidate") or {}
    live_artifact = envelope.get("liveWitnessArtifact") or {}
    tts = ((envelope.get("extensions") or {}).get("tts") or {})
    tts_artifact = tts.get("witnessArtifact") or {}

    run_id = int(deploy.get("runId", 0))
    run_attempt = int(deploy.get("runAttempt", 0))
    require(run_id > 0 and run_attempt > 0, "deployment run identity is invalid")
    require(deploy.get("workflow") == "Deploy to GitHub Pages", "deployment workflow identity mismatch")
    require(str(deploy.get("controlPlaneSha", "")).lower() == EXPECTED_SHA, "deploy control-plane mismatch")

    candidate_id = str(candidate.get("candidateId", ""))
    candidate_digest = str(candidate.get("digest", ""))
    immutable_path = str(candidate.get("immutablePath", ""))
    require(candidate_id == f"{EXPECTED_SHA}:{run_id}-{run_attempt}", "candidate ID mismatch")
    require(re.fullmatch(r"sha256:[a-f0-9]{64}", candidate_digest) is not None, "candidate digest invalid")
    require(int(candidate.get("bytes", 0)) > 0 and int(candidate.get("files", 0)) > 0, "candidate size/count invalid")
    require(immutable_path == f"/deployments/{EXPECTED_SHA}/{run_id}-{run_attempt}.json", "immutable path mismatch")

    for label, artifact in (
        ("candidate transport", candidate.get("transportArtifact") or {}),
        ("generic live", live_artifact),
        ("TTS", tts_artifact),
    ):
        require(int(artifact.get("id", 0)) > 0, f"{label} artifact ID missing")
        require(re.fullmatch(r"sha256:[a-f0-9]{64}", str(artifact.get("digest", ""))) is not None, f"{label} artifact digest invalid")
        require(int(artifact.get("bytes", 0)) > 0, f"{label} artifact bytes missing")
    require(tts.get("result") == "PASS", "TTS witness did not pass")

    return {
        "deploy": deploy,
        "candidate": candidate,
        "live_artifact": live_artifact,
        "tts": tts,
        "tts_artifact": tts_artifact,
        "run_id": run_id,
        "run_attempt": run_attempt,
        "candidate_id": candidate_id,
        "candidate_digest": candidate_digest,
        "immutable_path": immutable_path,
    }


def verify_live(data: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    current = request_json(CURRENT_URL)
    require(current.get("schemaVersion") == 3, "live current pointer schema mismatch")
    require(current.get("repository") == SOURCE_REPOSITORY, "live current repository mismatch")
    require(str(current.get("releaseSha", "")).lower() == EXPECTED_SHA, "live current release SHA mismatch")
    require(str(current.get("controlPlaneSha", "")).lower() == EXPECTED_SHA, "live current control-plane SHA mismatch")
    require(current.get("immutablePath") == data["immutable_path"], "live current immutable path mismatch")
    require((current.get("artifact") or {}).get("candidateId") == data["candidate_id"], "live current candidate ID mismatch")
    require((current.get("artifact") or {}).get("digest") == data["candidate_digest"], "live current candidate digest mismatch")
    workflow = current.get("workflow") or {}
    require(int(workflow.get("runId", 0)) == data["run_id"], "live current run ID mismatch")
    require(int(workflow.get("runAttempt", 0)) == data["run_attempt"], "live current run attempt mismatch")
    require(str(workflow.get("controlPlaneSha", "")).lower() == EXPECTED_SHA, "live current workflow SHA mismatch")

    manifest_url = f"https://gospod-bog.ru{data['immutable_path']}"
    manifest = request_json(manifest_url)
    require(manifest.get("schemaVersion") == 4, "live immutable manifest schema mismatch")
    require(manifest.get("repository") == SOURCE_REPOSITORY, "live manifest repository mismatch")
    require(str(manifest.get("releaseSha", "")).lower() == EXPECTED_SHA, "live manifest release SHA mismatch")
    require(str(manifest.get("controlPlaneSha", "")).lower() == EXPECTED_SHA, "live manifest control-plane SHA mismatch")
    require(manifest.get("immutablePath") == data["immutable_path"], "live manifest path mismatch")
    artifact = manifest.get("artifact") or {}
    require(artifact.get("candidateId") == data["candidate_id"], "live manifest candidate ID mismatch")
    require(artifact.get("digest") == data["candidate_digest"], "live manifest candidate digest mismatch")
    require(int(artifact.get("bytes", 0)) == int(data["candidate"].get("bytes", 0)), "live manifest byte count mismatch")
    require(int(artifact.get("files", 0)) == int(data["candidate"].get("files", 0)), "live manifest file count mismatch")
    require((manifest.get("build") or {}).get("node") == "22.23.1", "live manifest Node version mismatch")
    require((manifest.get("build") or {}).get("npm") == "10.9.8", "live manifest npm version mismatch")
    require(bool(manifest.get("criticalAssets")), "live manifest critical assets missing")
    require(bool(((manifest.get("extensions") or {}).get("tts") or {}).get("assets")), "live manifest TTS assets missing")
    return current, manifest


def replace_once(text: str, pattern: str, replacement: str, label: str, *, flags: int = 0) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f"{label}: expected one replacement, got {count}")
    return updated


def build_next(data: dict[str, Any], comment_id: int) -> str:
    candidate = data["candidate"]
    deploy = data["deploy"]
    live_artifact = data["live_artifact"]
    tts_artifact = data["tts_artifact"]
    return f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact source/deploy boundary, active ownership and next execution order.

**Source main:** `{EXPECTED_SHA}`  
**Exact production authority:** ✅ `{EXPECTED_SHA}`  
**Current source deployment status:** ✅ source, release candidate, Pages/live pointer and TTS authority converge on the same exact SHA.  
**Current source reverify:** `reverify/{Path(REVERIFY_REL).name}`  
**AuditRepo base used for this reconciliation:** `{AUDIT_BASE_SHA}`

## 1. Exact current boundary

- source PR #{SOURCE_PR} merged as `{EXPECTED_SHA}`;
- Node/npm toolchain is pinned to `22.23.1` / `10.9.8` across active workflow and release surfaces;
- deploy run `{data['run_id']}` attempt `{data['run_attempt']}` built one immutable candidate and promoted the same candidate bytes;
- release and control-plane SHAs are both `{EXPECTED_SHA}`;
- candidate ID: `{data['candidate_id']}`;
- candidate tree digest: `{data['candidate_digest']}`;
- candidate files / bytes: `{candidate['files']}` / `{candidate['bytes']}`;
- immutable live provenance: `{data['immutable_path']}`;
- candidate transport artifact: ID `{candidate['transportArtifact']['id']}`, `{candidate['transportArtifact']['digest']}`;
- generic live witness artifact: ID `{live_artifact['id']}`, `{live_artifact['digest']}`;
- TTS live witness artifact: ID `{tts_artifact['id']}`, `{tts_artifact['digest']}`;
- source release-ledger comment: PR #{SOURCE_PR}, comment `{comment_id}`.

## 2. Homepage closure

The premium native `/` implementation is complete in current ancestry. The accepted chain includes the premium index rebuild, responsive edge-state closure, semantic H1 dash, source-language/citation corrections, semantic drop-cap guard and the final two marginal-source corrections. Subsequent CI/toolchain commits did not redesign or replace the homepage.

Do not reopen the MAIN INDEX redesign without a new owner decision and current browser/visual evidence. Future Astro/Pixelmatch migrations must prove homepage parity against the existing contracts rather than treating the route as unfinished.

## 3. Production evidence boundary

The exact production claim is based on all of the following agreeing:

```text
source main
= release SHA
= control-plane SHA
= live /deployments/current.json
= immutable run manifest
= generic live PASS
= TTS live PASS
```

A later source merge invalidates only the *current-head convergence claim* and requires a new reverify; it does not erase this immutable release witness.

## 4. Active ownership — do not collide

Refresh before every mutation. At this reconciliation the protected independent lanes were:

- Astro 7 phase one — PR #549;
- Pixelmatch 7 — PR #551;
- Bible/glossary/tooltip ownership A04 — PR #624;
- Baptist book/research integration — PR #625.

Do not reset, rebase, force-push, close, delete or absorb those lanes without explicit owner handoff. The homepage closure lane and this AuditRepo synchronization do not own them.

## 5. Cleanup disposition

- no temporary Node migration writer/exporter/transfer file remains in source `main`;
- this AuditRepo synchronization uses one self-deleting writer/workflow; neither may remain in the final PR diff;
- closed diagnostic branches may be deleted only when their PR records explicitly mark them disposable or transferred and the platform operation is actually available;
- branch deletion is housekeeping, not evidence of source or production correctness.

## 6. Next order

1. Preserve the exact production witness above as immutable evidence.
2. Continue only through the named active lane owners.
3. On the next source-main merge, create a new current-head reverify before claiming source=production again.
4. Do not change matrix counters for this synchronization: it reconciles existing closed status and current authority, not a new bug-class transition.
"""


def patch_matrix(data: dict[str, Any], comment_id: int) -> None:
    text = MATRIX_PATH.read_text(encoding="utf-8")
    candidate = data["candidate"]
    live_artifact = data["live_artifact"]
    tts_artifact = data["tts_artifact"]
    pr_number = os.environ.get("PR_NUMBER", "pending")

    source_row = (
        f"| Source HEAD | `{EXPECTED_SHA}` (current source main; PR #{SOURCE_PR} pinned Node 22.23.1/npm 10.9.8; "
        "premium homepage closure remains in ancestry; active independent lanes remain separately owned) |"
    )
    deploy_row = (
        f"| Deploy | ✅ **SOURCE = PRODUCTION AUTHORITY.** Exact run `{data['run_id']}` attempt `{data['run_attempt']}` built and promoted candidate "
        f"`{data['candidate_id']}` from `{EXPECTED_SHA}`; live pointer and immutable manifest match digest `{data['candidate_digest']}`. "
        f"Candidate artifact `{candidate['transportArtifact']['id']}` (`{candidate['transportArtifact']['digest']}`), generic live `{live_artifact['id']}` "
        f"(`{live_artifact['digest']}`), TTS `{tts_artifact['id']}` (`{tts_artifact['digest']}`). Source ledger comment `{comment_id}`. |"
    )
    last_reverify = f"| Last reverify | `reverify/{Path(REVERIFY_REL).name}` |"
    text = replace_once(text, r"^\| Source HEAD \|.*$", source_row, "Source HEAD row", flags=re.MULTILINE)
    text = replace_once(text, r"^\| Deploy \|.*$", deploy_row, "Deploy row", flags=re.MULTILINE)
    text = replace_once(text, r"^\| Last reverify \|.*$", last_reverify, "Last reverify row", flags=re.MULTILINE)

    current_note = (
        f"⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние соответствующей даты. "
        f"Текущие source и exact production authority совпадают на `{EXPECTED_SHA}`: run `{data['run_id']}` attempt `{data['run_attempt']}`, "
        f"candidate `{data['candidate_id']}`, live/TTS PASS. Главная `/` завершена в текущей ancestry; Astro 7/Pixelmatch/A04/Baptists остаются отдельными активными lanes. "
        f"Evidence: `reverify/{Path(REVERIFY_REL).name}`."
    )
    text = replace_once(
        text,
        r"^⚠️ Старые deploy-формулировки ниже исторические\..*$",
        current_note,
        "current authority note",
        flags=re.MULTILINE,
    )

    evidence_row = (
        f"| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ **FIXED/EXACT PRODUCTION+LEDGER RECONCILED 2026-07-31.** "
        f"Source, release, control plane, live pointer and immutable manifest converge at `{EXPECTED_SHA}`. Run `{data['run_id']}` attempt `{data['run_attempt']}` "
        f"published candidate `{data['candidate_id']}` / `{data['candidate_digest']}`; generic and TTS live artifacts passed and source PR #{SOURCE_PR} received machine ledger comment `{comment_id}`. "
        "A later source merge requires a new current-head witness but does not invalidate this immutable release record. | "
        f"`{EXPECTED_SHA[:8]}` production run `{data['run_id']}` |"
    )
    text = replace_once(
        text,
        r"^\| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP \|.*$",
        evidence_row,
        "production evidence closed row",
        flags=re.MULTILINE,
    )
    ssot_row = (
        f"| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED 2026-07-31.** Operational SSOT records exact source/production authority `{EXPECTED_SHA}`, "
        f"deploy run `{data['run_id']}`, candidate/live/TTS identities, completed homepage closure and protected ownership of active independent lanes. "
        f"AuditRepo synchronization PR #{pr_number} changes no source product code and leaves counters unchanged. | `{EXPECTED_SHA[:8]}` source+production import |"
    )
    text = replace_once(
        text,
        r"^\| AUDIT-SSOT-CURRENT-HEAD-DRIFT \|.*$",
        ssot_row,
        "SSOT drift closed row",
        flags=re.MULTILINE,
    )

    stats_heading = f"## Статистика (обновлено 2026-07-31: source = production `{EXPECTED_SHA[:8]}`; homepage/toolchain exact release reconciled)"
    text = replace_once(text, r"^## Статистика \(обновлено .*\)$", stats_heading, "statistics heading", flags=re.MULTILINE)

    session_entry = (
        f"- **2026-07-31 — source/production convergence `{EXPECTED_SHA[:8]}` and homepage closure reconciliation** — PR #{SOURCE_PR} merged the exact Node 22.23.1/npm 10.9.8 toolchain pin without redesigning the completed premium homepage. "
        f"Deploy run `{data['run_id']}` attempt `{data['run_attempt']}` built candidate `{data['candidate_id']}` (`{data['candidate_digest']}`), promoted the same bytes, and produced generic/TTS live PASS artifacts; `/deployments/current.json` and the immutable manifest were independently read back against the machine envelope. "
        f"AuditRepo PR #{pr_number} synchronizes `NEXT_AGENT_PROMPT`, this masthead/session log and the paired reverify; counters remain 164 closed / 192 open because no bug-class transition occurred. Evidence: `reverify/{Path(REVERIFY_REL).name}`.\n\n"
    )
    text = replace_once(text, r"(## Session log \(append-only\)\n\n)", r"\1" + session_entry, "session log insertion")
    MATRIX_PATH.write_text(text, encoding="utf-8")


def build_reverify(envelope: dict[str, Any], data: dict[str, Any], current: dict[str, Any], manifest: dict[str, Any], comment_id: int) -> str:
    candidate = data["candidate"]
    live_artifact = data["live_artifact"]
    tts_artifact = data["tts_artifact"]
    build = manifest.get("build") or {}
    critical = manifest.get("criticalAssets") or {}
    pr_number = os.environ.get("PR_NUMBER", "pending")
    return f"""# CURRENT HEAD REVERIFY — exact production and homepage closure

**Date:** 2026-07-31  
**Source repository:** `{SOURCE_REPOSITORY}`  
**Exact source main:** `{EXPECTED_SHA}`  
**Source owner PR:** `#{SOURCE_PR}`  
**AuditRepo base:** `{AUDIT_BASE_SHA}`  
**AuditRepo synchronization PR:** `#{pr_number}`  
**Status:** `SOURCE = RELEASE = CONTROL PLANE = LIVE = TTS`

## 1. Scope and authority

This reverify closes only the current-head source/deploy boundary and the stale AuditRepo SSOT. It does not modify source product code, does not continue Astro 7/Pixelmatch/A04/Baptists work and does not reinterpret historical bug counts.

The source repository exact `main` was checked before acceptance and remained `{EXPECTED_SHA}`. PR #{SOURCE_PR} is the exact merged owner of this SHA.

## 2. Homepage result

The native premium `/` route is complete in current ancestry. Its accepted chain includes:

- premium responsive index rebuild;
- five canonical direction objects and native component ownership;
- safe marginalia rails and mobile odd-card behavior;
- reduced-motion suppression;
- semantic authored H1 dash;
- source-language/citation corrections;
- one semantic About lead with CSS `::first-letter` ownership;
- final marginal references to Synodal Ps. 22:1 and 2 Cor. 6:18.

The later Actions and Node toolchain commits changed control-plane/toolchain files, not the homepage design or visual baselines. Therefore MAIN INDEX is not an unfinished implementation lane.

## 3. Exact immutable release

| Field | Exact value |
|---|---|
| Release SHA | `{EXPECTED_SHA}` |
| Control-plane SHA | `{EXPECTED_SHA}` |
| Deploy run | `{data['run_id']}` attempt `{data['run_attempt']}` |
| Candidate ID | `{data['candidate_id']}` |
| Candidate tree digest | `{data['candidate_digest']}` |
| Candidate files | `{candidate['files']}` |
| Candidate bytes | `{candidate['bytes']}` |
| Immutable path | `{data['immutable_path']}` |
| Source ledger comment | `{comment_id}` on PR `#{SOURCE_PR}` |

### Transport and live artifacts

| Artifact | ID | Digest | Bytes |
|---|---:|---|---:|
| `{candidate['transportArtifact']['name']}` | `{candidate['transportArtifact']['id']}` | `{candidate['transportArtifact']['digest']}` | `{candidate['transportArtifact']['bytes']}` |
| `{live_artifact['name']}` | `{live_artifact['id']}` | `{live_artifact['digest']}` | `{live_artifact['bytes']}` |
| `{tts_artifact['name']}` | `{tts_artifact['id']}` | `{tts_artifact['digest']}` | `{tts_artifact['bytes']}` |

## 4. Independent live readback

The writer fetched the public pointer with cache bypass and then fetched its SHA/run-addressed immutable manifest.

Pointer evidence:

```json
{json.dumps(current, ensure_ascii=False, indent=2)}
```

Selected immutable-manifest evidence:

```json
{json.dumps({
    'schemaVersion': manifest.get('schemaVersion'),
    'repository': manifest.get('repository'),
    'releaseSha': manifest.get('releaseSha'),
    'controlPlaneSha': manifest.get('controlPlaneSha'),
    'immutablePath': manifest.get('immutablePath'),
    'workflow': manifest.get('workflow'),
    'artifact': manifest.get('artifact'),
    'build': build,
    'criticalAssets': critical,
    'tts': (manifest.get('extensions') or {}).get('tts'),
}, ensure_ascii=False, indent=2)}
```

The readback matched the trusted machine envelope on SHA, run ID/attempt, candidate ID, digest, file/byte counts and immutable path. The manifest pins Node `{build.get('node')}` and npm `{build.get('npm')}` and includes critical home/sitemap/feed/Pagefind/service-worker plus TTS asset records.

## 5. Machine release envelope

```json
{json.dumps(envelope, ensure_ascii=False, indent=2)}
```

## 6. Active-lane exclusions

The following remain independent protected owners and were not modified or cleaned up by this lane:

- PR #549 — Astro 7;
- PR #551 — Pixelmatch 7;
- PR #624 — Bible/glossary/tooltip A04;
- PR #625 — Baptist book/research integration.

## 7. Cleanup and final-tree contract

- source `main` contains no temporary Node migration writer/exporter/object-transfer files;
- temporary AuditRepo writer and workflow delete themselves before the final synchronization commit;
- final AuditRepo PR diff must contain exactly:
  - `projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md`;
  - `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`;
  - `{REVERIFY_REL}`;
- no counter changes are made;
- remote branch deletion is not used as a substitute for source, CI or production evidence.

## 8. Verdict

`PASS — exact current source, immutable release candidate, live current pointer, immutable manifest, generic live witness and TTS witness converge on {EXPECTED_SHA}. MAIN INDEX is complete; AuditRepo current authority is synchronized without touching active foreign lanes.`
"""


def run(command: list[str]) -> None:
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    if result.returncode != 0:
        raise RuntimeError(f"command failed ({result.returncode}): {' '.join(command)}")


def main() -> None:
    exact_source_boundary()
    envelope, _body, comment_id = wait_for_witness()
    data = verify_envelope(envelope)
    exact_source_boundary()
    current, manifest = verify_live(data)

    NEXT_PATH.write_text(build_next(data, comment_id), encoding="utf-8")
    patch_matrix(data, comment_id)
    REVERIFY_PATH.parent.mkdir(parents=True, exist_ok=True)
    REVERIFY_PATH.write_text(build_reverify(envelope, data, current, manifest, comment_id), encoding="utf-8")

    # The final PR head must not retain the one-shot control plane.
    SCRIPT_PATH.unlink()
    WORKFLOW_PATH.unlink()

    run(["python3", "scripts/validate_audit_repo.py"])
    run(["python3", "scripts/check_auditrepo_structure.py"])
    print(json.dumps({
        "result": "PASS",
        "releaseSha": EXPECTED_SHA,
        "runId": data["run_id"],
        "runAttempt": data["run_attempt"],
        "candidateId": data["candidate_id"],
        "candidateDigest": data["candidate_digest"],
        "commentId": comment_id,
        "finalFiles": [
            "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md",
            "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md",
            REVERIFY_REL,
        ],
    }, indent=2), flush=True)


if __name__ == "__main__":
    main()
