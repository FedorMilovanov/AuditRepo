#!/usr/bin/env python3

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects" / "gb-is-my-strength"
NEXT = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
OLD_REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-07-25_7b462b96_canonical-ledger-lock.md"
NEW_REVERIFY = PROJECT / "reverify" / "CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md"

SOURCE_SHA = "f4c60ecbc15b9a6bd5353f9d1c0d81d2d72b6b3e"
SOURCE_SHORT = "f4c60ecb"
PRODUCTION_SHA = "f5e29998c5b42cc9e4e7c917b1e1c1072aa52320"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def replace_line(text: str, prefix: str, replacement: str, label: str) -> str:
    lines = text.splitlines()
    indices = [index for index, line in enumerate(lines) if line.startswith(prefix)]
    if len(indices) != 1:
        raise RuntimeError(f"{label}: expected exactly one line, found {len(indices)}")
    lines[indices[0]] = replacement
    return "\n".join(lines) + "\n"


next_old = NEXT.read_text(encoding="utf-8")
if "**Source main:** `7b462b96f0e776dbd155e19cd7eb01610499e137`" not in next_old:
    raise RuntimeError("NEXT_AGENT_PROMPT source boundary is not the expected 7b462b96 snapshot")
if "#309 — only active source PR" not in next_old:
    raise RuntimeError("NEXT_AGENT_PROMPT owner boundary is not the expected #309 snapshot")

next_new = f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `{SOURCE_SHA}`
**Exact imported production authority:** ✅ `{PRODUCTION_SHA}` for readiness, Pages, Pages artifact, successful GitHub Pages deployment, live pointer/provenance and TTS capability witness.
**Current source deployment status:** ⚠️ `{SOURCE_SHORT}` is newer than the imported production witness and is **not** claimed deployed.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md`
**Immutable deep-audit intakes:** `incoming/auditor-brain/2026-07-25-r3/REPORT.md` and `incoming/auditor-brain/2026-07-25-r5/REPORT.md`

## 1) Exact boundary

- source `main` is `{SOURCE_SHORT}` after merged deterministic-font PR #309;
- exact production authority remains `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages deployment `5603663894`, Pages artifact `8622641548` (`sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`) and TTS artifact `8622642553` (`sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`);
- proof artifact `8622690663` (`sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`) preserves the exact production checks and historical ledger failure;
- historical ledger run `30169981463` remains failure after validating the artifact/report and receiving 403 on PR projection;
- operator-recovery comment `5080203496` on PR #286 carries the exact marker without relabelling that historical run;
- PR #312 (`733ba309`) repaired projection/replay/action pinning and PR #332 (`7b462b96`) canonicalized automatic/manual writer locking;
- PR #309 (`{SOURCE_SHORT}`) closes source issue #302 with offline pinned font verification and no production-time font network path;
- no exact post-merge readiness/Pages/live witness for `{SOURCE_SHORT}` has been imported;
- #292/#295 still own whole-release digest/provenance and build-once promotion;
- never infer deployment of source `{SOURCE_SHORT}` from source CI.

## 2) Current ownership

Refresh before every action. At this capture:

- **#336 — source-link residual owner:** malformed-input evidence redaction, immutable evidence-action pins and final real-network acceptance for #303. Temporary materialization files are branch-only and must be absent from the final diff.
- **#338 — homepage browser-contract owner:** permanent production-like Chromium/WebKit interaction contract for #299, reusing the existing interactive-audit workflow.

Merged/closed convergence:

- #321 merged as `a105c354`, closing notifier monotonic lifecycle ordering;
- #324 merged as `e8e7c39c`, closing the core per-hop redirect/DNS policy while #336 owns the remaining #303 acceptance boundary;
- #332 merged as `7b462b96`, closing #320 with canonical numeric concurrency and a read-only resolver → privileged writer boundary;
- #309 merged as `{SOURCE_SHORT}`, closing #302 after exact-head Shared Guard, editorial metadata and TTS/browser evidence;
- #322/#328/#331 remain superseded/duplicate evidence only;
- #307 remains closed without merge after production evidence import.

## 3) Closed systemic contracts

### Deterministic font pipeline — source fixed

PR #309 now guarantees:

- 28 tracked WOFF2 files are pinned by path, family/style/weight/subset, byte size and SHA-256;
- CSS registry and TTF support assets are pinned separately;
- production verification is offline and rejects missing, undeclared, symlinked, malformed, truncated, hash-drifted and metadata-drifted files;
- every `@font-face` declaration must match base metadata or one explicit alias; duplicate, undeclared, stale and unused aliases fail closed;
- the maintainer generator fetches only exact declared HTTPS sources and replaces the complete directory transactionally;
- three reviewed upstream drifts remain recorded rather than silently applied;
- the legacy downloader exits nonzero and readiness/deploy perform no opportunistic font download;
- exact head `7a035a42` passed Shared Files Guard `30172960934`, Editorial Metadata v3 `30172960931` and TTS Download Consent `30172960928` before squash merge `{SOURCE_SHORT}`.

This is source+CI closure only. Whole-release artifact identity and same-candidate promotion remain #292/#295.

### Deployment witness projection and concurrency — source fixed

PRs #312 and #332 keep Pages deploy read-only, isolate Issues/PR write to the exact-run writer, canonicalize numeric deploy-run aliases before locking and permanently mutation-test replay, artifact and supply-chain boundaries. This does not prove an automated replay occurred and does not close repository-wide #301/#64.

### Failure lifecycle — source fixed

PR #321 closes the R5 ordering residual: lifecycle state is monotonic against the newest seen transition, not only the newest failure. Legacy guessed alerts remain separate evidence cleanup.

### Redirect-hop policy — core fixed, acceptance residual owned

Merged #324 enforces per-hop policy, DNS pinning, blocked-destination privacy for valid URLs and deterministic chain evidence. PR #336 owns malformed unparsable input redaction, retained-action pinning and inspected real-network evidence.

## 4) CI semantics

Classify red states before changing code:

1. product regression;
2. protective guard failure;
3. cancelled/superseded run;
4. post-publish projection failure;
5. temporary evidence-carrier failure;
6. stale lifecycle alert.

Never call ledger `30169981463` a Pages failure. Never call operator comment `5080203496` an automated ledger success.

## 5) Active work, in order

1. **Finish exact owners #336 and #338 without crossing files**
   - #336: final diff only permanent source-link workflow/contracts, no `_temp-*` files;
   - #338: production-like Chromium/WebKit interaction evidence, no duplicate workflow.

2. **Converge #292 + #295 in one release lane**
   - build and validate one pinned candidate in readiness;
   - compute whole-artifact digest and generic build/routes/Pagefind/sitemap/feed/core identities;
   - upload an immutable candidate with exact SHA/run identity;
   - deploy downloads/promotes that same candidate without a second install/build;
   - capability evidence stays under extensions such as `extensions.tts`;
   - retain fail-closed recovery and rollback.

3. **Reconcile legacy guessed CI alerts**
   - #261/#272/#279/#259/#90/#89 only with exact newer same-identity evidence.

4. **Harden privileged control plane (#301 + #64)**
   - capability registry, effective permissions, persisted credentials and full-SHA pins.

5. **Continue R3 hardening without crossing owners**
   - #298 product goldens;
   - #287 one Genesis finalizer/activation owner;
   - Research #16 authority/supersession/rights manifest.

## 6) Non-negotiable gates

Before merge: refresh main/owners, exact-head focused+broad tests, Shared Files Guard/actionlint, relevant browser/PDF/route gates, no `_temp-*` final files, no semantic weakening.

After a production-impacting merge: exact readiness, same-artifact Pages promotion, generic live witness plus capability evidence, successful run-addressed acceptance or explicitly labelled operator recovery, then and only then advance AuditRepo production authority.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses/counters.
- `reverify/` owns immutable current-head witnesses; `incoming/` owns raw evidence.
- no temporary workflow in final canonical scope and no deployment claim without imported evidence.
"""
NEXT.write_text(next_new, encoding="utf-8")

matrix = MATRIX.read_text(encoding="utf-8")
if "## ✅ ЗАКРЫТО (155)" not in matrix or "## 🟠 P1 — ОТКРЫТО (100)" not in matrix:
    raise RuntimeError("matrix counters are not the expected PR #66 snapshot")
if "FONT-PIPELINE-FAIL-OPEN" in matrix:
    raise RuntimeError("FONT-PIPELINE-FAIL-OPEN already exists; refusing duplicate authority")

matrix = replace_line(
    matrix,
    "| Source HEAD |",
    "| Source HEAD | `f4c60ecbc15b9a6bd5353f9d1c0d81d2d72b6b3e` (current source main; #321 notifier ordering, #324 core redirect-hop policy, #332 canonical witness concurrency and #309 deterministic font pipeline merged; active source owners at capture: #336 source-link residual and #338 homepage browser contract) |",
    "source head row",
)
matrix = replace_line(
    matrix,
    "| Deploy |",
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; operator comment `5080203496` is transparent recovery. Current source `f4c60ecb` includes merged deterministic-font PR #309 but is not claimed deployed; automated replay observation and whole-release identity/build-once remain open. |",
    "deploy row",
)
matrix = replace_line(
    matrix,
    "| Last reverify |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md` |",
    "last reverify row",
)
matrix = replace_line(
    matrix,
    "⚠️ Старые deploy-формулировки ниже исторические.",
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `f4c60ecb`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical automated ledger run remains failure; operator comment `5080203496` is transparent recovery. PR #309 closes deterministic font integrity at source+CI only. Automated replay observation, newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md`.",
    "source/production warning",
)
matrix = replace_once(matrix, "## ✅ ЗАКРЫТО (155)", "## ✅ ЗАКРЫТО (156)", "closed heading")

fixed_heading = "## ✅ ЗАКРЫТО (156)"
separator = "|---|---|---|\n"
start = matrix.index(fixed_heading)
insert_at = matrix.index(separator, start) + len(separator)
font_row = (
    "| FONT-PIPELINE-FAIL-OPEN | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** "
    "PR #309 replaced the fail-open production-adjacent downloader with 28 pinned WOFF2 records, a separate support manifest, a fully offline fail-closed verifier, an explicit exact-source transactional maintainer generator and permanent every-declaration/alias adversarial fixtures. Three reviewed upstream drifts are recorded without silently replacing tracked bytes; readiness/deploy perform no font network fetch and issue #302 is closed. Exact head `7a035a42` passed Shared Files Guard `30172960934`, Editorial Metadata v3 `30172960931` and TTS Download Consent `30172960928`; squash merge `f4c60ecb`. No font binary, typography or visible UI was changed. | `f4c60ecb` PR#309; issue #302 |\n"
)
matrix = matrix[:insert_at] + font_row + matrix[insert_at:]

matrix = replace_line(
    matrix,
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT |",
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@f4c60ecb`, exact deployed Pages/live/TTS authority `f5e29998`, merged #321/#324/#332/#309, active #336/#338 ownership and the remaining automated-replay/whole-release boundaries without conflating source, operator projection and production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `f4c60ecb` source + exact `f5e29998` evidence import |",
    "SSOT row",
)
matrix = replace_line(
    matrix,
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP |",
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; operator comment `5080203496` preserves historical automated run `30169981463` as failure. Residual gap remains: automated replay has not been observed, current source `f4c60ecb` has no exact deployment witness, and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); PR #312/`733ba309`; PR #332/`7b462b96`; PR #309/`f4c60ecb`; operator comment `5080203496`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md` |",
    "production evidence gap row",
)
matrix = replace_line(
    matrix,
    "## Статистика (обновлено",
    "## Статистика (обновлено 2026-07-25: source f4c60ecb + exact f5e29998 production import)",
    "statistics heading",
)
matrix = replace_line(matrix, "| Закрыто (fixed) |", "| Закрыто (fixed) | 156 |", "fixed statistics")

session_marker = "## Session log (append-only)\n\n"
new_session = (
    "- **2026-07-25 deterministic font integrity (`f4c60ecb`)** — PR #309 closes source issue #302 without typography redesign: 28 tracked WOFF2 files and support assets are pinned, production verification is offline and fail-closed, the legacy downloader is disabled, exact-source refresh is transactional, every CSS declaration/alias is validated and three reviewed upstream drifts remain explicit. Exact head `7a035a42` passed Shared Files Guard `30172960934`, Editorial Metadata v3 `30172960931` and TTS Download Consent `30172960928` before squash merge. Production authority remains `f5e29998`; no deployment of `f4c60ecb` is claimed. Active source owners are #336 and #338. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f4c60ecb_font-integrity.md`.\n\n"
)
matrix = replace_once(matrix, session_marker, session_marker + new_session, "session log insertion")
MATRIX.write_text(matrix, encoding="utf-8")

if not OLD_REVERIFY.exists():
    raise RuntimeError("expected old 7b462b96 reverify file is missing")
if NEW_REVERIFY.exists():
    raise RuntimeError("new f4c60ecb reverify file already exists")
OLD_REVERIFY.unlink()

reverify = f"""# CURRENT HEAD REVERIFY — 2026-07-25 — `{SOURCE_SHORT}` deterministic font integrity

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `{SOURCE_SHA}`
- Exact imported production SHA: `{PRODUCTION_SHA}`
- AuditRepo base before this reconciliation: `74ad756f5f4a5597d654f80413c505d9e3e4ffc1`
- Source PR: #309, squash merge `{SOURCE_SHA}`

Source and production remain separate. This document advances source truth only.

## Production authority retained

Exact `f5e29998` evidence remains unchanged:

- readiness `30169126149` success;
- deploy `30169443420`, attempt 1, success;
- GitHub Pages deployment `5603663894` success;
- Pages artifact `8622641548`, digest `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`;
- TTS artifact `8622642553`, digest `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`;
- imported proof artifact `8622690663`, digest `sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`;
- exact live pointer/provenance and captured route/asset/CSP/SW checks PASS.

Historical ledger run `30169981463` remains failure at PR projection. Operator comment `5080203496` is transparent recovery, not automated success. No exact post-merge readiness, Pages, live or downstream witness for `{SOURCE_SHORT}` is imported here.

## Deterministic font source closure

Issue #302 documented a production-adjacent downloader that could skip unverified files, accept malformed responses, partially write subsets and continue after failures. PR #309 closes that source defect without changing selected font bytes or visible typography.

### Pinned authority

- all 28 tracked WOFF2 files have canonical path, family, style, weight, subset, byte size and SHA-256 records;
- CSS registry and TTF fallback/support files have separate pinned records;
- 25 current exact upstream sources reproduce tracked bytes;
- Noto Serif Greek 400 and Noto Serif Hebrew 400/500 remain explicit upstream drift, not silently accepted replacements.

### Fail-closed production verifier

The verifier performs no network access and rejects:

- missing manifest files or undeclared font files;
- symbolic links;
- malformed/truncated WOFF2 and malformed SFNT/TTF data;
- size or SHA-256 drift;
- unknown CSS/source references;
- omitted registry entries;
- any `@font-face` declaration whose family/style/weight does not match base metadata or one explicit alias;
- undeclared, duplicate, stale or unused aliases.

### Explicit maintainer generator

- fetches only exact declared HTTPS gstatic URLs;
- validates host, redirect chain, status, content type, size and WOFF2 structure;
- aborts the entire refresh when one source is unavailable or drift is not explicitly accepted;
- stages the complete set and swaps the font directory only after next-manifest verification;
- requires `--accept-upstream` for reviewed drift;
- never runs during ordinary readiness/deploy.

The legacy `scripts/download-fonts.js` now exits nonzero. Readiness, deploy and Shared Files Guard run the offline verifier only.

## Review-required regression fixtures

Permanent fixtures prove:

1. Noto Sans Greek and Noto Serif Greek base-plus-alias declarations pass;
2. a wrong second duplicate declaration fails even if the first declaration is correct;
3. unused and duplicate aliases fail closed.

This directly closes the last review residual recorded in the prior marathon journal.

## Exact-head evidence

Clean PR head: `7a035a4287a82086542a12f9c205d84c4a766b8c`

- one commit directly on then-current `main@7b462b96f0e776dbd155e19cd7eb01610499e137`;
- 11 intended SYSTEM/font-integrity files;
- zero commits behind at merge race-check;
- Shared Files Guard `30172960934` PASS, including all 29 steps, deterministic font contracts, all 28 real assets, control-plane audit and actionlint;
- Editorial Metadata v3 `30172960931` PASS;
- TTS Download Consent `30172960928` PASS, including source/mutation contracts, production-like build, real-route Chromium/WebKit matrix and mobile geometry;
- merged only with `expected_head_sha=7a035a4287a82086542a12f9c205d84c4a766b8c`;
- squash merge `{SOURCE_SHA}`;
- source issue #302 closed as completed.

## Current owner boundary

At capture the open source owners are:

- PR #336 for the remaining #303 malformed-input redaction/action-pin/real-network evidence boundary;
- PR #338 for the permanent homepage Chromium/WebKit interaction contract under #299.

Do not cross their paths or retain their branch-only temporary materialization files in a final product diff.

## Remaining systemic work

1. Finish #336 and #338 on exact heads.
2. Converge #292/#295 build-once and whole-artifact provenance.
3. Reconcile legacy guessed alerts only with exact same-identity evidence.
4. Complete #301/#64 permission/capability registry.
5. Continue #298, #287 and Research #16 without crossing owners.

## Acceptance

- advance source boundary to `{SOURCE_SHA}`;
- close `FONT-PIPELINE-FAIL-OPEN` as source+CI verified;
- add one closed matrix row and increment fixed count `155 → 156`;
- leave P1 count `100` and total-open count `196` unchanged because the R3 font finding was not previously a separate counted open row;
- retain production authority at `{PRODUCTION_SHA}`;
- retain automated replay observation and whole-release identity/build-once gaps;
- make no claim that `{SOURCE_SHORT}` is deployed.
"""
NEW_REVERIFY.write_text(reverify, encoding="utf-8")

Path(__file__).unlink()
