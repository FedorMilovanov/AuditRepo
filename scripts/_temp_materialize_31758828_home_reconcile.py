#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
SELF = ROOT / "scripts/_temp_materialize_31758828_home_reconcile.py"
WORKFLOW = ROOT / ".github/workflows/_temp-materialize-31758828-home.yml"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return text.replace(old, new, 1)


text = MATRIX.read_text(encoding="utf-8")
if "HOME-BROWSER-CONTRACT-MISSING" in text:
    raise SystemExit("HOME-BROWSER-CONTRACT-MISSING already registered")

text = replace_once(
    text,
    "| Source HEAD | `6c005e49deb39c55ee7aa10bd89687bd82c65c1a` (current source main; #336 evidence secrecy/action pins and #346 trustworthy native network acceptance merged; active source owners at capture: #338 homepage browser contract and #348 Genesis 6 Research provenance; CONTENT/RESEARCH issue #352 owns five genuine broken sources) |",
    "| Source HEAD | `31758828fcc53c005a82108c18c63bd1ad268d25` (current source main; #336/#346 trustworthy source-link acceptance and #338 permanent Chromium/WebKit homepage interaction contract merged; active source owner at capture: #348 Genesis 6 Research provenance; CONTENT/RESEARCH issue #352 owns five genuine broken sources) |",
    "source head",
)
text = replace_once(
    text,
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; trusted manual replay `30171194731` later completed successfully without rewriting that history. Current source `6c005e49` includes merged source-link acceptance PRs #336/#346 but is not claimed deployed; whole-release identity/build-once remain open. |",
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; trusted manual replay `30171194731` later completed successfully without rewriting that history. Current source `31758828` includes merged source-link acceptance PRs #336/#346 and homepage browser-contract PR #338 but is not claimed deployed; whole-release identity/build-once remain open. |",
    "deploy boundary",
)
text = replace_once(
    text,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md` |",
    "last reverify",
)
text = replace_once(
    text,
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `6c005e49`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical ledger run `30169981463` remains failure; trusted manual replay `30171194731` is a separate later success. PRs #336/#346 close SYSTEM source-link acceptance at source+CI+real-network level; issue #352 retains five CONTENT/RESEARCH hard sources. Newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md`.",
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `31758828`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical ledger run `30169981463` remains failure; trusted manual replay `30171194731` is a separate later success. PRs #336/#346 close SYSTEM source-link acceptance, PR #338 closes the homepage browser-contract gap, and issue #352 retains five CONTENT/RESEARCH hard sources. Newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md`.",
    "status note",
)
text = replace_once(text, "## ✅ ЗАКРЫТО (157)", "## ✅ ЗАКРЫТО (158)", "closed count")

source_link_row = "| SOURCE-LINK-REDIRECT-POLICY-BYPASS | ✅ **FIXED/SOURCE+CI+REAL-NETWORK VERIFIED 2026-07-25.** PR #324 added per-hop redirect/DNS/private-address policy and deterministic chain evidence; PR #336 / `f65795b2` fingerprinted malformed evidence and pinned workflow Actions; PR #346 / `6c005e49` repaired modern Node pinned-lookup callback shapes, fail-closed systemic-warning detection, bounded response probes and bot-block classification. Clean exact head `e30a9b24` passed Source Link `30175072859` and Shared Guard `30175072868`. Post-merge run `30175242133` on exact main published artifact `8624053524` (`sha256:d20c3b57…`): 201 checked, 165 pass, 31 transient warning, 5 hard, 35 hops, `systemicTransportFailure=false`, no evidence-secret leakage. SYSTEM issue #303 is closed; five genuine source records are separated into CONTENT issue #352. | `e8e7c39c` PR#324 + `f65795b2` PR#336 + `6c005e49` PR#346; issue #303 |"
home_row = "| HOME-BROWSER-CONTRACT-MISSING | ✅ **FIXED/SOURCE+CHROMIUM+WEBKIT VERIFIED 2026-07-25.** PR #338 added a permanent production-like homepage runtime contract for mobile-menu focus trapping/cleanup, BFCache, canonical search shortcuts and lazy Pagefind initialization, Hebrew pointer/keyboard behavior, reading progress, reduced-motion, overflow and JavaScript-disabled reachability. It also fixed the pre-runtime search gate to reject Alt/Shift, IME and editable targets. Exact head `8d39dab1` passed Runtime Interactive Audit `30175417113`, Shared Guard `30175417105`, Native Source `30175417120`, Editorial Dateline `30175417093`, Print Paper `30175417098`, Visual Parity `30175417119` and Glossary `30175417096`; squash merge `31758828`, issue #299 closed. No visual redesign or content rewrite. | `31758828` PR#338; issue #299 |"
text = replace_once(text, source_link_row, home_row + "\n" + source_link_row, "home closed row")

text = replace_once(
    text,
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@6c005e49`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346, active #338/#348 ownership and CONTENT issue #352 without conflating source-link evidence, source deployment or production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `6c005e49` source + exact `f5e29998` evidence import |",
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@31758828`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346/#338, active #348 ownership and CONTENT issue #352 without conflating browser/network evidence, source deployment or production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `31758828` source + exact `f5e29998` evidence import |",
    "ssot row",
)
text = replace_once(
    text,
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; trusted manual replay `30171194731` completed success while historical run `30169981463` remains failure. Residual gap is now only that current source `6c005e49` has no exact readiness/Pages/live deployment witness and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); replay `30171194731`; source `6c005e49`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md` |",
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; trusted manual replay `30171194731` completed success while historical run `30169981463` remains failure. Residual gap is now only that current source `31758828` has no exact readiness/Pages/live deployment witness and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); replay `30171194731`; source `31758828`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md` |",
    "production evidence row",
)
text = replace_once(
    text,
    "| SOURCE-LINK-BROKEN-EXTERNAL-5 | Five genuinely broken external source records remain after SYSTEM auditor closure: two Archive.org 404s, Heidelberg→WorldCat HTTP 400, Cambridge HTTP 404 and an expired Grace e-books certificate. Research the exact intended works and replace only with authoritative stable equivalents; do not weaken redirect/status/certificate policy. | source issue #352; post-merge artifact `8624053524`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md` |",
    "| SOURCE-LINK-BROKEN-EXTERNAL-5 | Five genuinely broken external source records remain after SYSTEM auditor closure: two Archive.org 404s, Heidelberg→WorldCat HTTP 400, Cambridge HTTP 404 and an expired Grace e-books certificate. Research the exact intended works and replace only with authoritative stable equivalents; do not weaken redirect/status/certificate policy. | source issue #352; post-merge artifact `8624053524`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md` |",
    "open source-link witness",
)

session = """

### 2026-07-25 — source `31758828`, homepage Chromium/WebKit contract

- Advanced source SSOT from `6c005e49` to merged PR #338 / `31758828`; production authority remains exact imported `f5e29998`.
- Added closed `HOME-BROWSER-CONTRACT-MISSING` after production-like Chromium/WebKit/no-JS interaction proof and exact Shared/Native/Print/Visual/Glossary gates; source issue #299 is closed.
- Recorded the pre-runtime search shortcut correction and preserved #298 product-golden work as a separate visual-approval boundary.
- Closed count 157 → 158; open severity counts remain unchanged. Active source PR owner at capture: #348; CONTENT/RESEARCH issue #352 remains open.
"""
if session.strip() in text:
    raise SystemExit("31758828 session already exists")
text = text.rstrip() + session + "\n"

MATRIX.write_text(text, encoding="utf-8")
SELF.unlink()
WORKFLOW.unlink()
subprocess.run([
    "git", "add",
    "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md",
    "scripts/_temp_materialize_31758828_home_reconcile.py",
    ".github/workflows/_temp-materialize-31758828-home.yml",
], cwd=ROOT, check=True)
subprocess.run(["git", "commit", "-m", "audit: reconcile 31758828 homepage browser contract"], cwd=ROOT, check=True)
subprocess.run(["git", "push", "origin", "HEAD"], cwd=ROOT, check=True)
