#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
SELF = ROOT / "scripts/_temp_materialize_6c005e49_source_link_reconcile.py"
WORKFLOW = ROOT / ".github/workflows/_temp-materialize-6c005e49-source-links.yml"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return text.replace(old, new, 1)


text = MATRIX.read_text(encoding="utf-8")

text = replace_once(
    text,
    "| Source HEAD | `f4c60ecbc15b9a6bd5353f9d1c0d81d2d72b6b3e` (current source main; #321 notifier ordering, #324 core redirect-hop policy, #332 canonical witness concurrency and #309 deterministic font pipeline merged; active source owners at capture: #336 source-link residual and #338 homepage browser contract) |",
    "| Source HEAD | `6c005e49deb39c55ee7aa10bd89687bd82c65c1a` (current source main; #336 evidence secrecy/action pins and #346 trustworthy native network acceptance merged; active source owners at capture: #338 homepage browser contract and #348 Genesis 6 Research provenance; CONTENT/RESEARCH issue #352 owns five genuine broken sources) |",
    "source head",
)
text = replace_once(
    text,
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; operator comment `5080203496` is transparent recovery. Current source `f4c60ecb` includes merged deterministic-font PR #309 but is not claimed deployed; automated replay observation and whole-release identity/build-once remain open. |",
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; trusted manual replay `30171194731` later completed successfully without rewriting that history. Current source `6c005e49` includes merged source-link acceptance PRs #336/#346 but is not claimed deployed; whole-release identity/build-once remain open. |",
    "deploy boundary",
)
text = replace_once(
    text,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md` |",
    "last reverify",
)
text = replace_once(
    text,
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `f4c60ecb`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical automated ledger run remains failure; operator comment `5080203496` is transparent recovery. PR #309 closes deterministic font integrity at source+CI only. Automated replay observation, newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md`.",
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `6c005e49`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical ledger run `30169981463` remains failure; trusted manual replay `30171194731` is a separate later success. PRs #336/#346 close SYSTEM source-link acceptance at source+CI+real-network level; issue #352 retains five CONTENT/RESEARCH hard sources. Newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md`.",
    "status note",
)
text = replace_once(text, "## ✅ ЗАКРЫТО (156)", "## ✅ ЗАКРЫТО (157)", "closed count")

font_row = "| FONT-PIPELINE-FAIL-OPEN | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #309 replaced the fail-open production-adjacent downloader with 28 pinned WOFF2 records, a separate support manifest, a fully offline fail-closed verifier, an explicit exact-source transactional maintainer generator and permanent every-declaration/alias adversarial fixtures. Three reviewed upstream drifts are recorded without silently replacing tracked bytes; readiness/deploy perform no font network fetch and issue #302 is closed. Exact head `7a035a42` passed Shared Files Guard `30172960934`, Editorial Metadata v3 `30172960931` and TTS Download Consent `30172960928`; squash merge `f4c60ecb`. No font binary, typography or visible UI was changed. | `f4c60ecb` PR#309; issue #302 |"
source_link_closed = "| SOURCE-LINK-REDIRECT-POLICY-BYPASS | ✅ **FIXED/SOURCE+CI+REAL-NETWORK VERIFIED 2026-07-25.** PR #324 added per-hop redirect/DNS/private-address policy and deterministic chain evidence; PR #336 / `f65795b2` fingerprinted malformed evidence and pinned workflow Actions; PR #346 / `6c005e49` repaired modern Node pinned-lookup callback shapes, fail-closed systemic-warning detection, bounded response probes and bot-block classification. Clean exact head `e30a9b24` passed Source Link `30175072859` and Shared Guard `30175072868`. Post-merge run `30175242133` on exact main published artifact `8624053524` (`sha256:d20c3b57…`): 201 checked, 165 pass, 31 transient warning, 5 hard, 35 hops, `systemicTransportFailure=false`, no evidence-secret leakage. SYSTEM issue #303 is closed; five genuine source records are separated into CONTENT issue #352. | `e8e7c39c` PR#324 + `f65795b2` PR#336 + `6c005e49` PR#346; issue #303 |"
text = replace_once(text, font_row, source_link_closed + "\n" + font_row, "closed source-link row")

text = replace_once(
    text,
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@f4c60ecb`, exact deployed Pages/live/TTS authority `f5e29998`, merged #321/#324/#332/#309, active #336/#338 ownership and the remaining automated-replay/whole-release boundaries without conflating source, operator projection and production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `f4c60ecb` source + exact `f5e29998` evidence import |",
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@6c005e49`, exact deployed Pages/live/TTS authority `f5e29998`, successful trusted replay `30171194731`, merged #336/#346, active #338/#348 ownership and CONTENT issue #352 without conflating source-link evidence, source deployment or production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `6c005e49` source + exact `f5e29998` evidence import |",
    "ssot row",
)
text = replace_once(
    text,
    "| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #297 separated Pages publication from truthful `extensions.tts` evidence; PR #312 fixed PR projection, trusted exact-run replay and full-SHA pins; PR #332 / `7b462b96` added a read-only canonical resolver and one serialized privileged writer, collapsing whitespace/leading-zero aliases to the same deploy-run lock. Exact TTS `30172394177` and Shared Guard `30172394185` passed. Whole-site identity remains #292/#295; repository-wide permission registry remains #301/#64. | `e8c41d54` PR#297 + `733ba309` PR#312 + `7b462b96` PR#332 |",
    "| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI+REPLAY VERIFIED 2026-07-25.** PR #297 separated Pages publication from truthful `extensions.tts` evidence; PR #312 fixed PR projection, trusted exact-run replay and full-SHA pins; PR #332 / `7b462b96` added a read-only canonical resolver and one serialized privileged writer, collapsing whitespace/leading-zero aliases to the same deploy-run lock. Exact TTS `30172394177` and Shared Guard `30172394185` passed; trusted manual replay `30171194731` later completed success for exact deploy run `30169443420`. Historical run `30169981463` remains failure. Whole-site identity remains #292/#295; repository-wide permission registry remains #301/#64. | `e8c41d54` PR#297 + `733ba309` PR#312 + `7b462b96` PR#332; replay `30171194731` |",
    "deployment replay row",
)
text = replace_once(
    text,
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; operator comment `5080203496` preserves historical automated run `30169981463` as failure. Residual gap remains: automated replay has not been observed, current source `f4c60ecb` has no exact deployment witness, and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); PR #312/`733ba309`; PR #332/`7b462b96`; PR #309/`f4c60ecb`; operator comment `5080203496`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md` |",
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; trusted manual replay `30171194731` completed success while historical run `30169981463` remains failure. Residual gap is now only that current source `6c005e49` has no exact readiness/Pages/live deployment witness and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); replay `30171194731`; source `6c005e49`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md` |",
    "production evidence row",
)

text = replace_once(text, "## 🟡 P2 — ОТКРЫТО (37)", "## 🟡 P2 — ОТКРЫТО (38)", "P2 count")
research_row = "| RESEARCH-AUTHORITY-MANIFEST-MISSING | Genesis/Jude/Peter publication still requires manual composition of XLVIII base + XLIX text corrections + L rights decisions + LI precision overlays. Add machine-readable authority/supersession/rights manifest and pinned Research SHA/compiler. | Research issue #16; Research `b654c537` |"
source_link_open = "| SOURCE-LINK-BROKEN-EXTERNAL-5 | Five genuinely broken external source records remain after SYSTEM auditor closure: two Archive.org 404s, Heidelberg→WorldCat HTTP 400, Cambridge HTTP 404 and an expired Grace e-books certificate. Research the exact intended works and replace only with authoritative stable equivalents; do not weaken redirect/status/certificate policy. | source issue #352; post-merge artifact `8624053524`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_6c005e49_source-link-acceptance.md` |"
text = replace_once(text, research_row, research_row + "\n" + source_link_open, "open content source-link row")

session = """

### 2026-07-25 — source `6c005e49`, trustworthy source-link acceptance

- Advanced source SSOT from `f4c60ecb` to merged PR #346 / `6c005e49`; production authority remains exact imported `f5e29998`.
- Closed `SOURCE-LINK-REDIRECT-POLICY-BYPASS` after PRs #324/#336/#346, clean exact-head CI and post-merge real-network artifact `8624053524` (`sha256:d20c3b57…`).
- Recorded 201 checked, 165 pass, 31 transient warning, 5 genuine hard and 35 redirect hops with `systemicTransportFailure=false`; moved the five source records to CONTENT/RESEARCH issue #352.
- Corrected stale replay status: trusted manual ledger run `30171194731` completed success while historical run `30169981463` remains failure.
- Closed count 156 → 157; P2 open count 37 → 38. Active source PR owners at capture: #338 and #348.
"""
if session.strip() in text:
    raise SystemExit("session entry already exists")
text = text.rstrip() + session + "\n"

MATRIX.write_text(text, encoding="utf-8")
SELF.unlink()
WORKFLOW.unlink()
subprocess.run([
    "git", "add",
    "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md",
    "scripts/_temp_materialize_6c005e49_source_link_reconcile.py",
    ".github/workflows/_temp-materialize-6c005e49-source-links.yml",
], cwd=ROOT, check=True)
subprocess.run(["git", "commit", "-m", "audit: reconcile 6c005e49 source-link acceptance"], cwd=ROOT, check=True)
subprocess.run(["git", "push", "origin", "HEAD"], cwd=ROOT, check=True)
