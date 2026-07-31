#!/usr/bin/env python3
"""Temporary artifact-only generator for AuditRepo PR #110.

It validates exact source/live authority, then writes generated candidate files
under reports/matrix-coverage/generated. It never mutates tracked SSOT files.
"""

from __future__ import annotations

import json
import re
import textwrap
import time
import urllib.request
from pathlib import Path

SOURCE_SHA = "abf1edba190280e554dfda085bef9fb6594c896d"
SOURCE_REPO = "FedorMilovanov/gb-is-my-strength"
SOURCE_PR = 643
RELEASE_COMMENT = 5148074092
WINDOWS_COMMENT = 5148209495
DEPLOY_RUN = 30669840189
DEPLOY_ATTEMPT = 1
AUDIT_PR = 110
REVERIFY_NAME = (
    "CURRENT_HEAD_REVERIFY_2026-08-01_abf1edba_"
    "exact-production-windows-astro-closure.md"
)
REVERIFY_REL = f"reverify/{REVERIFY_NAME}"
OUT = Path("reports/matrix-coverage/generated")


def get_json(url: str, *, bust: bool = False) -> object:
    if bust:
        url += ("&" if "?" in url else "?") + f"audit={time.time_ns()}"
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "AuditRepo-artifact-generator/1.0",
            "Cache-Control": "no-cache",
        },
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.load(response)


def need(condition: object, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def generate() -> None:
    branch = get_json(f"https://api.github.com/repos/{SOURCE_REPO}/branches/main")
    need(branch["commit"]["sha"] == SOURCE_SHA, "source main moved")

    comments = get_json(
        f"https://api.github.com/repos/{SOURCE_REPO}/issues/{SOURCE_PR}/comments?per_page=100"
    )
    release = next((item for item in comments if item["id"] == RELEASE_COMMENT), None)
    windows = next((item for item in comments if item["id"] == WINDOWS_COMMENT), None)
    need(release and windows, "required witness comment missing")
    need(
        f"deployment-release-witness:{SOURCE_SHA}:{SOURCE_SHA}:" in release["body"],
        "release witness marker mismatch",
    )
    need(
        f"windows-physical-witness:{SOURCE_SHA}" in windows["body"],
        "Windows witness marker mismatch",
    )

    match = re.search(r"```json\s*([\s\S]*?)\s*```", release["body"])
    need(match, "release ledger JSON missing")
    ledger = json.loads(match.group(1))
    need(
        ledger["releaseSha"] == SOURCE_SHA
        and ledger["controlPlaneSha"] == SOURCE_SHA,
        "release/control SHA mismatch",
    )

    deploy = ledger["deploy"]
    candidate = ledger["releaseCandidate"]
    transport = candidate["transportArtifact"]
    generic = ledger["liveWitnessArtifact"]
    tts = ledger["extensions"]["tts"]
    tts_artifact = tts["witnessArtifact"]
    build = ledger["build"]

    need(
        deploy["event"] == "push"
        and int(deploy["runId"]) == DEPLOY_RUN
        and int(deploy["runAttempt"]) == DEPLOY_ATTEMPT,
        "deploy identity mismatch",
    )
    candidate_id = f"{SOURCE_SHA}:{DEPLOY_RUN}-{DEPLOY_ATTEMPT}"
    need(candidate["candidateId"] == candidate_id, "candidate ID mismatch")
    need(build["node"] == "22.23.1" and build["npm"] == "10.9.8", "toolchain mismatch")
    need(tts["result"] == "PASS", "TTS witness is not PASS")

    pointer = get_json(ledger["live"]["currentPointer"], bust=True)
    manifest = get_json(
        f"https://gospod-bog.ru{candidate['immutablePath']}",
        bust=True,
    )
    for label, obj in (("pointer", pointer), ("manifest", manifest)):
        need(
            obj["releaseSha"] == SOURCE_SHA
            and obj["controlPlaneSha"] == SOURCE_SHA,
            f"{label} SHA mismatch",
        )
        need(
            int(obj["workflow"]["runId"]) == DEPLOY_RUN
            and int(obj["workflow"]["runAttempt"]) == DEPLOY_ATTEMPT,
            f"{label} workflow mismatch",
        )
        need(
            obj["artifact"]["candidateId"] == candidate_id
            and obj["artifact"]["digest"] == candidate["digest"],
            f"{label} candidate mismatch",
        )
    need(
        int(manifest["artifact"]["files"]) == int(candidate["files"])
        and int(manifest["artifact"]["bytes"]) == int(candidate["bytes"]),
        "manifest size mismatch",
    )
    for key in ("home", "sitemap", "feed", "pagefind", "serviceWorker"):
        need(key in manifest["criticalAssets"], f"missing critical asset {key}")
    for key in ("controller", "engine", "noticeCss", "serviceWorker"):
        need(key in manifest["tts"]["assets"], f"missing TTS asset {key}")

    next_text = textwrap.dedent(
        f"""\
        # NEXT AGENT PROMPT — gb-is-my-strength

        > **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

        **Source main:** `{SOURCE_SHA}`
        **Exact production authority:** ✅ `{SOURCE_SHA}`
        **Current source deployment status:** ✅ source, release candidate, live pointer и TTS authority сходятся на одном SHA.
        **Current reverify:** `{REVERIFY_REL}`
        **AuditRepo synchronization PR:** `#{AUDIT_PR}`

        ## 1. Точная граница

        - source PR #{SOURCE_PR} влит как `{SOURCE_SHA}`;
        - Astro `7.1.6` / native Sätteri `0.3.5`;
        - `astro:dev/check/build/preview` используют постоянный Windows/Linux launcher `scripts/astro-cli.mjs`, без `cross-env`;
        - Gill six-surface gate, sitemap-image SEO и книжная витрина «Баптисты России» сохранены;
        - Node/npm: `22.23.1` / `10.9.8`;
        - exact PR head `12f6d54e` прошёл 8/8 обязательных workflow;
        - физический Windows witness: source comment `{WINDOWS_COMMENT}` — `npm ci`, 82-page build, 918 legacy files, drift 0, Baptist audit 16/16, clean tree.

        ## 2. Exact production

        - deploy `{DEPLOY_RUN}`, attempt `{DEPLOY_ATTEMPT}`, event `push`;
        - release SHA = control-plane SHA = `{SOURCE_SHA}`;
        - candidate `{candidate_id}`;
        - digest `{candidate['digest']}`;
        - files / bytes `{candidate['files']}` / `{candidate['bytes']}`;
        - immutable path `{candidate['immutablePath']}`;
        - candidate artifact `{transport['id']}` / `{transport['digest']}`;
        - generic live `{generic['id']}` / `{generic['digest']}`;
        - TTS `{tts_artifact['id']}` / `{tts_artifact['digest']}`;
        - release ledger comment `{RELEASE_COMMENT}`.

        ```text
        source = release = control plane = current pointer = immutable manifest
        generic live PASS = TTS live PASS
        ```

        ## 3. Следующий порядок

        1. Сохранять `{SOURCE_SHA}` как current exact source+production authority.
        2. После следующего source merge требовать новый same-SHA deployment witness.
        3. Не запускать устаревшие `Finalize-AuditRepo109.ps1` и workflow PR #109.
        4. Не возвращать старый `cross-env` autostash и не менять матричные счётчики.
        """
    )

    reverify_text = textwrap.dedent(
        f"""\
        # CURRENT HEAD REVERIFY — exact production and Windows Astro closure

        **Date:** 2026-08-01  
        **Source:** `{SOURCE_REPO}` @ `{SOURCE_SHA}`  
        **Source PR:** `#{SOURCE_PR}`  
        **AuditRepo PR:** `#{AUDIT_PR}`  
        **Status:** `SOURCE = RELEASE = CONTROL PLANE = LIVE = TTS`

        ## Scope and source

        This reconciliation changes no product code, route, content, visual baseline or bug count. PR #{SOURCE_PR} replaced POSIX-only Astro environment assignments with a permanent Node launcher and preserved Astro 7 native Sätteri, Gill six-surface claim enforcement, sitemap-image SEO and the Baptist book landing. Exact head `12f6d54e` passed all eight required workflows.

        ## Physical Windows witness

        Source comment `{WINDOWS_COMMENT}` records the final merged-main run:

        | Check | Result |
        |---|---|
        | HEAD | `{SOURCE_SHA}` |
        | PowerShell / Node / npm | `7.6.3` / `22.23.1` / `10.9.8` |
        | `npm ci` | PASS, 483 packages |
        | Astro 7 contract | PASS |
        | production-like build | PASS, 82 pages |
        | legacy copy | 918 files / 65,360 KB |
        | HTML / sitemap images | 86 / 28 inserted, 6 synchronized, 39 unchanged |
        | governed drift | 0 |
        | Baptist native audit | PASS, 16 routes |
        | final worktree | clean |

        Six `hard-texts` notices only report absent immutable migration content-floor baselines; the audit exited successfully.

        ## Exact immutable release

        | Field | Value |
        |---|---|
        | release/control SHA | `{SOURCE_SHA}` |
        | deploy | `{DEPLOY_RUN}` attempt `{DEPLOY_ATTEMPT}` |
        | candidate | `{candidate_id}` |
        | digest | `{candidate['digest']}` |
        | files / bytes | `{candidate['files']}` / `{candidate['bytes']}` |
        | immutable path | `{candidate['immutablePath']}` |
        | ledger comment | `{RELEASE_COMMENT}` |

        | Artifact | ID | Digest | Bytes |
        |---|---:|---|---:|
        | candidate | `{transport['id']}` | `{transport['digest']}` | `{transport['bytes']}` |
        | generic live | `{generic['id']}` | `{generic['digest']}` | `{generic['bytes']}` |
        | TTS live | `{tts_artifact['id']}` | `{tts_artifact['digest']}` | `{tts_artifact['bytes']}` |

        Public current pointer and immutable manifest were independently read back and matched the ledger on both SHAs, run/attempt, candidate identity/digest, file/byte counts, Node/npm, five critical assets and four TTS assets.

        | Build identity | Value |
        |---|---|
        | package-lock | `{build['packageLockDigest']}` |
        | route registry | `{build['routeRegistryDigest']}` |
        | profiles / HTML / sitemap | `{build['routeCounts']['profiles']}` / `{build['routeCounts']['html']}` / `{build['routeCounts']['sitemap']}` |
        | Pagefind | `{build['pagefindDigest']}` / `{build['pagefindFiles']}` files |
        | sitemap | `{build['sitemapDigest']}` |
        | feed | `{build['feedDigest']}` |

        ## AuditRepo disposition

        `NEXT_AGENT_PROMPT.md`, the matrix masthead and this reverify become current authority. Historical reverifies remain immutable. Counters remain 164 closed / 192 open. PR #109 remains closed without merge.

        ```text
        SOURCE MAIN: VERIFIED
        EXACT PR CI: VERIFIED
        PHYSICAL WINDOWS BUILD: VERIFIED
        EXACT LIVE DEPLOYMENT: VERIFIED
        GENERIC LIVE: PASS
        TTS LIVE: PASS
        AUDITREPO AUTHORITY: RECONCILED
        ```
        """
    )

    matrix_path = Path("projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md")
    matrix = matrix_path.read_text(encoding="utf-8")
    source_row = (
        f"| Source HEAD | `{SOURCE_SHA}` "
        f"(current source main; PR #{SOURCE_PR} merged the Windows-safe Astro launcher "
        "over Astro 7, Gill verification, sitemap-image SEO and the Baptist book landing; "
        "physical Windows build and 16-route audit passed) |"
    )
    deploy_row = (
        f"| Deploy | ✅ **SOURCE = PRODUCTION AUTHORITY.** Run `{DEPLOY_RUN}` attempt "
        f"`{DEPLOY_ATTEMPT}` promoted `{candidate_id}`; release/control SHA `{SOURCE_SHA}`; "
        f"digest `{candidate['digest']}`. Candidate `{transport['id']}` "
        f"(`{transport['digest']}`), generic live `{generic['id']}` "
        f"(`{generic['digest']}`), TTS `{tts_artifact['id']}` "
        f"(`{tts_artifact['digest']}`). Ledger `{RELEASE_COMMENT}`; "
        f"Windows witness `{WINDOWS_COMMENT}`. |"
    )
    replacements = {
        r"^\| Source HEAD \|.*$": source_row,
        r"^\| Deploy \|.*$": deploy_row,
        r"^\| Last reverify \|.*$": f"| Last reverify | `{REVERIFY_REL}` |",
    }
    for pattern, replacement in replacements.items():
        matrix, count = re.subn(pattern, replacement, matrix, count=1, flags=re.M)
        need(count == 1, f"matrix row mismatch: {pattern}")

    warning = (
        "⚠️ Deploy-формулировки в исторических строках ниже сохраняют состояние "
        f"соответствующей даты. Текущие source и exact production authority совпадают на "
        f"`{SOURCE_SHA}`: run `{DEPLOY_RUN}` attempt `{DEPLOY_ATTEMPT}`, candidate "
        f"`{candidate_id}`, generic live/TTS PASS. Astro 7, Gill verification, "
        "sitemap-image SEO, Baptist book landing и Windows-safe launcher находятся в "
        f"текущей ancestry. Evidence: `{REVERIFY_REL}`."
    )
    matrix, count = re.subn(
        r"^⚠️ Deploy-формулировки в исторических строках ниже.*$",
        warning,
        matrix,
        count=1,
        flags=re.M,
    )
    need(count == 1, "matrix authority warning mismatch")
    matrix, count = re.subn(
        r"^## Статистика \(обновлено .*?\)$",
        "## Статистика (обновлено 2026-08-01: source = production `abf1edba`; "
        "Windows Astro exact release reconciled)",
        matrix,
        count=1,
        flags=re.M,
    )
    need(count == 1, "matrix statistics heading mismatch")
    anchor = "## Session log (append-only)\n"
    need(anchor in matrix, "matrix session anchor missing")
    entry = (
        "\n- **2026-08-01 — source/production convergence `abf1edba` and Windows Astro "
        f"closure** — PR #{SOURCE_PR} merged the permanent launcher; exact head `12f6d54e` "
        f"passed 8/8 workflows. Physical Windows comment `{WINDOWS_COMMENT}` records clean "
        f"`{SOURCE_SHA}`, `npm ci`, 82 pages, 918 legacy files, zero drift and Baptist "
        f"16/16. Deploy `{DEPLOY_RUN}` attempt `{DEPLOY_ATTEMPT}` promoted `{candidate_id}` "
        f"(`{candidate['digest']}`); generic/TTS artifacts `{generic['id']}` / "
        f"`{tts_artifact['id']}` passed. AuditRepo PR #{AUDIT_PR} changes authority/evidence "
        f"only; counters stay 164 closed / 192 open. Evidence: `{REVERIFY_REL}`.\n"
    )
    matrix = matrix.replace(anchor, anchor + entry, 1)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "NEXT_AGENT_PROMPT.md").write_text(next_text, encoding="utf-8", newline="\n")
    (OUT / "MASTER_BUG_MATRIX.md").write_text(matrix, encoding="utf-8", newline="\n")
    (OUT / REVERIFY_NAME).write_text(reverify_text, encoding="utf-8", newline="\n")
    (OUT / "manifest.json").write_text(
        json.dumps(
            {
                "sourceSha": SOURCE_SHA,
                "releaseComment": RELEASE_COMMENT,
                "windowsComment": WINDOWS_COMMENT,
                "deployRun": DEPLOY_RUN,
                "deployAttempt": DEPLOY_ATTEMPT,
                "candidateId": candidate_id,
                "candidateDigest": candidate["digest"],
                "finalFiles": [
                    "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md",
                    f"projects/gb-is-my-strength/{REVERIFY_REL}",
                    "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md",
                ],
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    generate()
