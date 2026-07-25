#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
SELF = ROOT / "scripts/_temp_materialize_b594ba82_gill_sources.py"
WORKFLOW = ROOT / ".github/workflows/_temp-materialize-b594ba82-gill-sources.yml"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return text.replace(old, new, 1)


text = MATRIX.read_text(encoding="utf-8")
if "GILL-EXTERNAL-SOURCE-5" in text:
    raise SystemExit("GILL-EXTERNAL-SOURCE-5 already registered")

text = replace_once(
    text,
    "| Source HEAD | `31758828fcc53c005a82108c18c63bd1ad268d25` (current source main; #336/#346 trustworthy source-link acceptance and #338 permanent Chromium/WebKit homepage interaction contract merged; active source owner at capture: #348 Genesis 6 Research provenance; CONTENT/RESEARCH issue #352 owns five genuine broken sources) |",
    "| Source HEAD | `b594ba82afbbefb8cc5c27ea2604d9f308392daa` (current source main; #336/#346 trustworthy source-link acceptance, #338 homepage Chromium/WebKit contract and #354 citation-preserving Gill source repair merged; active source owner at capture: #348 Genesis 6 Research provenance) |",
    "source head",
)
text = replace_once(
    text,
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; trusted manual replay `30171194731` later completed successfully without rewriting that history. Current source `31758828` includes merged source-link acceptance PRs #336/#346 and homepage browser-contract PR #338 but is not claimed deployed; whole-release identity/build-once remain open. |",
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; trusted manual replay `30171194731` later completed successfully without rewriting that history. Current source `b594ba82` includes merged source-link, homepage-browser and Gill source-repair contracts but is not claimed deployed; whole-release identity/build-once remain open. |",
    "deploy boundary",
)
text = replace_once(
    text,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_b594ba82_home-links-clean.md` |",
    "last reverify",
)
text = replace_once(
    text,
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `31758828`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical ledger run `30169981463` remains failure; trusted manual replay `30171194731` is a separate later success. PRs #336/#346 close SYSTEM source-link acceptance, PR #338 closes the homepage browser-contract gap, and issue #352 retains five CONTENT/RESEARCH hard sources. Newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md`.",
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `b594ba82`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical ledger run `30169981463` remains failure; trusted manual replay `30171194731` is a separate later success. PRs #336/#346 close SYSTEM source-link acceptance, PR #338 closes the homepage browser-contract gap, and PR #354 closes the five Gill source defects with zero hard network results. Newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_b594ba82_home-links-clean.md`.",
    "status note",
)
text = replace_once(text, "## ✅ ЗАКРЫТО (158)", "## ✅ ЗАКРЫТО (159)", "closed count")

home_row = "| HOME-BROWSER-CONTRACT-MISSING | ✅ **FIXED/SOURCE+CHROMIUM+WEBKIT VERIFIED 2026-07-25.** PR #338 added a permanent production-like homepage runtime contract for mobile-menu focus trapping/cleanup, BFCache, canonical search shortcuts and lazy Pagefind initialization, Hebrew pointer/keyboard behavior, reading progress, reduced-motion, overflow and JavaScript-disabled reachability. It also fixed the pre-runtime search gate to reject Alt/Shift, IME and editable targets. Exact head `8d39dab1` passed Runtime Interactive Audit `30175417113`, Shared Guard `30175417105`, Native Source `30175417120`, Editorial Dateline `30175417093`, Print Paper `30175417098`, Visual Parity `30175417119` and Glossary `30175417096`; squash merge `31758828`, issue #299 closed. No visual redesign or content rewrite. | `31758828` PR#338; issue #299 |"
gill_row = "| GILL-EXTERNAL-SOURCE-5 | ✅ **FIXED/CONTENT+CI+REAL-NETWORK VERIFIED 2026-07-25.** PR #354 replaced five genuinely broken Gill source records while preserving the intended works: Crosby via Open Library, the 1644/1646 London Confession scans page, Folger ESTC N3754, Cowan’s canonical DOI and the UPenn John Gill bibliographic gateway. Final scope was exactly two source-owner components. Real-network run `30175593224` published artifact `8624151439` (`sha256:2bee8f47…`): 201 checked, 171 pass, 30 warning, **0 hard**, 34 hops, `systemicTransportFailure=false`. Exact head `031368f2` passed Gill `30175919593`, Overlay `30175919620`, Glossary `30175919619`, Shared `30175919626`, Dateline `30175919606`, Native `30175919608`, submenu `30175919621`, Print `30175919607`, Visual `30175919629` and Route Registry `30175919627`; merge `b594ba82`, issue #352 closed. | `b594ba82` PR#354; issue #352; artifact `8624151439` |"
text = replace_once(text, home_row, gill_row + "\n" + home_row, "closed Gill source row")

text = replace_once(
    text,
    "| SOURCE-LINK-REDIRECT-POLICY-BYPASS | ✅ **FIXED/SOURCE+CI+REAL-NETWORK VERIFIED 2026-07-25.** PR #324 added per-hop redirect/DNS/private-address policy and deterministic chain evidence; PR #336 / `f65795b2` fingerprinted malformed evidence and pinned workflow Actions; PR #346 / `6c005e49` repaired modern Node pinned-lookup callback shapes, fail-closed systemic-warning detection, bounded response probes and bot-block classification. Clean exact head `e30a9b24` passed Source Link `30175072859` and Shared Guard `30175072868`. Post-merge run `30175242133` on exact main published artifact `8624053524` (`sha256:d20c3b57…`): 201 checked, 165 pass, 31 transient warning, 5 hard, 35 hops, `systemicTransportFailure=false`, no evidence-secret leakage. SYSTEM issue #303 is closed; five genuine source records are separated into CONTENT issue #352. | `e8e7c39c` PR#324 + `f65795b2` PR#336 + `6c005e49` PR#346; issue #303 |",
    "| SOURCE-LINK-REDIRECT-POLICY-BYPASS | ✅ **FIXED/SOURCE+CI+REAL-NETWORK VERIFIED 2026-07-25.** PR #324 added per-hop redirect/DNS/private-address policy and deterministic chain evidence; PR #336 / `f65795b2` fingerprinted malformed evidence and pinned workflow Actions; PR #346 / `6c005e49` repaired modern Node pinned-lookup callback shapes, fail-closed systemic-warning detection, bounded response probes and bot-block classification. Clean exact head `e30a9b24` passed Source Link `30175072859` and Shared Guard `30175072868`. Diagnostic artifact `8624053524` exposed five genuine content defects; PR #354 then repaired them and artifact `8624151439` proved 201 checked / 0 hard. SYSTEM issue #303 and CONTENT issue #352 are both closed. | `e8e7c39c` PR#324 + `f65795b2` PR#336 + `6c005e49` PR#346 + `b594ba82` PR#354 |",
    "source-link closure wording",
)
text = replace_once(
    text,
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@31758828`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346/#338, active #348 ownership and CONTENT issue #352 without conflating browser/network evidence, source deployment or production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `31758828` source + exact `f5e29998` evidence import |",
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@b594ba82`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346/#338/#354 and active #348 ownership without conflating browser/network evidence, source deployment or production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `b594ba82` source + exact `f5e29998` evidence import |",
    "ssot row",
)
text = replace_once(
    text,
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; trusted manual replay `30171194731` completed success while historical run `30169981463` remains failure. Residual gap is now only that current source `31758828` has no exact readiness/Pages/live deployment witness and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); replay `30171194731`; source `31758828`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md` |",
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; trusted manual replay `30171194731` completed success while historical run `30169981463` remains failure. Residual gap is now only that current source `b594ba82` has no exact readiness/Pages/live deployment witness and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); replay `30171194731`; source `b594ba82`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_b594ba82_home-links-clean.md` |",
    "production evidence row",
)

text = replace_once(text, "## 🟡 P2 — ОТКРЫТО (38)", "## 🟡 P2 — ОТКРЫТО (37)", "P2 count")
open_row = "| SOURCE-LINK-BROKEN-EXTERNAL-5 | Five genuinely broken external source records remain after SYSTEM auditor closure: two Archive.org 404s, Heidelberg→WorldCat HTTP 400, Cambridge HTTP 404 and an expired Grace e-books certificate. Research the exact intended works and replace only with authoritative stable equivalents; do not weaken redirect/status/certificate policy. | source issue #352; post-merge artifact `8624053524`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_31758828_home-source-link.md` |\n"
text = replace_once(text, open_row, "", "remove open Gill source row")

session = """

### 2026-07-25 — source `b594ba82`, Gill source links clean

- Advanced source SSOT from `31758828` to merged PR #354 / `b594ba82`; production authority remains exact imported `f5e29998`.
- Moved `SOURCE-LINK-BROKEN-EXTERNAL-5` from open P2 to closed `GILL-EXTERNAL-SOURCE-5` after exact citation-preserving replacements and real-network artifact `8624151439` (`sha256:2bee8f47…`) with 201 checked and zero hard errors.
- Recorded exact clean-head Gill/Overlay/Glossary/Shared/Dateline/Native/submenu/Print/Visual/Route Registry success.
- Closed count 158 → 159; P2 open count 38 → 37. Active source PR owner at capture: #348.
"""
if session.strip() in text:
    raise SystemExit("b594ba82 session already exists")
text = text.rstrip() + session + "\n"

MATRIX.write_text(text, encoding="utf-8")
SELF.unlink()
WORKFLOW.unlink()
subprocess.run([
    "git", "add",
    "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md",
    "scripts/_temp_materialize_b594ba82_gill_sources.py",
    ".github/workflows/_temp-materialize-b594ba82-gill-sources.yml",
], cwd=ROOT, check=True)
subprocess.run(["git", "commit", "-m", "audit: reconcile b594ba82 Gill source repair"], cwd=ROOT, check=True)
subprocess.run(["git", "push", "origin", "HEAD"], cwd=ROOT, check=True)
