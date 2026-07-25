#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects" / "gb-is-my-strength"
NEXT_PATH = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX_PATH = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
REVERIFY_NAME = "CURRENT_HEAD_REVERIFY_2026-07-25_7b462b96_canonical-ledger-lock.md"
REVERIFY_PATH = PROJECT / "reverify" / REVERIFY_NAME
SOURCE_SHA = "7b462b96f0e776dbd155e19cd7eb01610499e137"
PRODUCTION_SHA = "f5e29998c5b42cc9e4e7c917b1e1c1072aa52320"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise AssertionError(f"{label}: expected exactly one old value, found {count}")
    return text.replace(old, new, 1)


NEXT_PATH.write_text(f'''# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `{SOURCE_SHA}`
**Exact imported production authority:** ✅ `{PRODUCTION_SHA}` for readiness, Pages, Pages artifact, successful GitHub Pages deployment, live pointer/provenance and TTS capability witness.
**Current source deployment status:** ⚠️ `7b462b96` is newer than the imported production witness and is **not** claimed deployed.
**Current source reverify:** `reverify/{REVERIFY_NAME}`
**Immutable deep-audit intakes:** `incoming/auditor-brain/2026-07-25-r3/REPORT.md` and `incoming/auditor-brain/2026-07-25-r5/REPORT.md`

## 1) Exact boundary

- source `main` is `7b462b96` after merged canonical witness-lock PR #332;
- exact production authority remains `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages deployment `5603663894`, Pages artifact `8622641548` (`sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`) and TTS artifact `8622642553` (`sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`);
- proof artifact `8622690663` (`sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`) preserves the exact production checks and historical ledger failure;
- historical ledger run `30169981463` remains failure after validating the artifact/report and receiving 403 on PR projection;
- operator-recovery comment `5080203496` on PR #286 carries the exact marker without relabelling that historical run;
- PR #312 (`733ba309`) repaired PR-write/manual-replay/action pinning; PR #332 (`7b462b96`) then split read-only resolution from the privileged writer and canonicalized all automatic/manual textual aliases to one numeric deploy-run lock;
- no automated manual replay was observed through the connected tool surface;
- #292/#295 still own whole-release digest/provenance and build-once promotion;
- never infer deployment of source `7b462b96` from source CI.

## 2) Current ownership

Refresh before every action. At this capture:

- **#309 — only active source PR:** deterministic offline font manifest/provenance for #302. Do not cross its font manifest, generator/downloader or readiness/deploy font-validation files.

Merged/closed convergence:

- #321 merged as `a105c354`, closing notifier monotonic lifecycle ordering;
- #324 merged as `e8e7c39c`, closing the core per-hop redirect/DNS policy; issue #303 remains open for malformed-input evidence redaction, immutable evidence-action pins and one inspected real-network artifact;
- #332 merged as `7b462b96`, closing #320 with canonical numeric concurrency and a read-only resolver → privileged writer boundary;
- #322/#328/#331 remain superseded/duplicate evidence only;
- #307 remains closed without merge after production evidence import.

## 3) Closed systemic contracts

### Deployment witness projection and concurrency — source fixed

PRs #312 and #332 together now guarantee:

- Pages deploy has no repository-mutation permission;
- only the writer job owns Issues/PR write;
- manual replay is main-only and resolves a completed successful exact Pages run;
- leading-zero/whitespace aliases map to `String(workflowRun.id)` before locking;
- one job-level lock `deployment-witness-<canonical-run-id>` serializes automatic/manual writes with `cancel-in-progress:false`;
- the writer re-fetches and revalidates exact ID/name/status/success/main/repository/SHA after acquiring the lock;
- checkout credentials remain disabled, artifacts are exact-run, external actions are full-SHA pinned;
- 44 adversarial mutations and unsafe-ID fixtures are permanent.

This does not prove an automated replay occurred and does not close repository-wide #301/#64.

### Failure lifecycle — source fixed

PR #321 closes the R5 ordering residual: lifecycle state is monotonic against the newest seen transition, not only the newest failure. Legacy guessed alerts remain separate evidence cleanup.

### Redirect-hop policy — core fixed, acceptance residual open

Merged #324 enforces per-hop policy, DNS pinning, blocked destination privacy for valid URLs and deterministic chain evidence. Issue #303 stays open until malformed unparsable inputs cannot leak raw credentials/query values, retained evidence actions are commit-SHA pinned and one real-network chain artifact is inspected.

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

1. **Finish exact owner #309**
   - keep stronger production font validation;
   - repair only the stale semantic fixture expectation;
   - require focused real-binary/offline/generator contracts plus Shared Guard and production-like build.

2. **Converge #292 + #295 in one release lane**
   - build and validate one pinned candidate in readiness;
   - compute whole-artifact digest and generic build/routes/Pagefind/sitemap/feed/core identities;
   - upload immutable candidate with exact SHA/run identity;
   - deploy downloads/promotes that same candidate without a second install/build;
   - capability evidence stays under extensions such as `extensions.tts`;
   - retain fail-closed recovery and rollback.

3. **Finish #303 residual acceptance**
   - redact malformed unparsable URL evidence;
   - full-SHA pin evidence workflow actions;
   - inspect a real scheduled/manual network-chain artifact.

4. **Reconcile legacy guessed CI alerts**
   - #261/#272/#279/#259/#90/#89 only with exact newer same-identity evidence.

5. **Harden privileged control plane (#301 + #64)**
   - capability registry, effective permissions, persisted credentials and full-SHA pins.

6. **Continue R3 hardening without crossing owners**
   - #298 product goldens;
   - #299 homepage Chromium/WebKit contract;
   - #287 one Genesis finalizer/activation owner;
   - Research #16 authority/supersession/rights manifest.

## 6) Non-negotiable gates

Before merge: refresh main/owners, exact-head focused+broad tests, Shared Files Guard/actionlint, relevant browser/PDF/route gates, no `_temp-*` final files, no semantic weakening.

After production-impacting merge: exact readiness, same-artifact Pages promotion, generic live witness plus capability evidence, successful run-addressed acceptance or explicitly labelled operator recovery, then and only then advance AuditRepo production authority.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses/counters.
- `reverify/` owns immutable current-head witnesses; `incoming/` owns raw evidence.
- no temporary workflow in final canonical scope and no deployment claim without imported evidence.
''', encoding='utf-8')

REVERIFY_PATH.write_text(f'''# CURRENT HEAD REVERIFY — 2026-07-25 — `7b462b96` canonical deployment-witness lock

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `{SOURCE_SHA}`
- Exact imported production SHA: `{PRODUCTION_SHA}`
- AuditRepo authority before reconciliation: `74ad756f5f4a5597d654f80413c505d9e3e4ffc1`
- Imported production proof: artifact `8622690663`, digest `sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`

Source and production remain separate. This advances source truth only.

## Production authority retained

Exact `f5e29998` evidence remains unchanged:

- readiness `30169126149` success;
- deploy `30169443420`, attempt 1, success;
- GitHub Pages deployment `5603663894` success;
- Pages artifact `8622641548`, digest `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`;
- TTS artifact `8622642553`, digest `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`;
- exact live report, two routes, asset/CSP/SW checks and captured pointer/provenance PASS.

Historical ledger run `30169981463` remains failure at PR projection. Operator comment `5080203496` is transparent recovery, not automated success.

## Source progression after `733ba309`

### Notifier ordering

PR #321 merged as `a105c35482e7b5301e824e0098230b53bed48e6b` and closed the newest-transition ordering residual without reopening the broader notifier architecture.

### Redirect-hop policy

PR #324 merged as `e8e7c39c15642f0ab70999779b9d734c29c70f77` after exact Source Link Audit `30171741109` and Shared Guard `30171741122` success. Core per-hop scheme/host/private-address/redirect-chain policy and DNS pinning are source fixed. Issue #303 remains open for malformed-input evidence privacy, immutable evidence-action pins and real-network artifact acceptance.

### Canonical witness writer lock

PR #332 final head `73a0417ed1e522c43d1cced584d4651d4bf8a0f7` merged as `{SOURCE_SHA}` and closed #320.

Architecture:

- workflow defaults to contents read only;
- read-only resolver canonicalizes numeric deploy-run identity and validates exact workflow/status/success/main/repository/SHA;
- privileged writer alone owns Issues/PR write;
- job-level concurrency uses only `needs.resolve.outputs.run_id` with cancellation disabled;
- writer re-fetches and revalidates the target after acquiring the lock;
- exact-run artifact, disabled credentials and full-SHA action pins remain.

Exact evidence:

- TTS Download Consent `30172394177` PASS: source, recorder/provenance, 44 adversarial mutations, canonical alias/unsafe-ID fixtures, actionlint, Chromium/WebKit lifecycle, production build, real routes and mobile geometry;
- source artifact `8623271965`, digest `sha256:282aeba9e05cf27fb3c3a5fe46392f304a469ad8f6c247976c9848df92143a6b`;
- browser artifact `8623312279`, digest `sha256:c9980c26a3d5b54b559d7a618342479b1caa96adc3615dbe5d583ebac63c1f02`;
- Shared Files Guard `30172394185` PASS.

## Current owner boundary

At capture only PR #309 remains open. It owns deterministic font integrity and its readiness/deploy integration. Its current focused jobs are green; the known Shared Guard failure was stale fixture-message drift after stronger validation and has been reported to the owner.

## Remaining systemic work

1. Finish #309 without weakening production validation.
2. Converge #292/#295 build-once + whole-artifact provenance.
3. Finish #303 privacy/evidence/pinning residuals.
4. Reconcile legacy guessed alerts.
5. Complete #301/#64 permission registry.

## Acceptance

- advance source boundary to `7b462b96`;
- retain production authority at `f5e29998`;
- record #320 closed by canonical lock;
- record #303 core merged but acceptance residual open;
- retain automated replay observation and whole-release identity gaps;
- leave matrix counters unchanged.
''', encoding='utf-8')

matrix = MATRIX_PATH.read_text(encoding='utf-8')
matrix = replace_once(matrix,
"| Source HEAD | `733ba309e159023ae44682b7cb71b2c042cd8eb6` (current source main; #312 exact witness permission/replay/pinning repair merged; active source owners at capture: #309 fonts, #321 notifier ordering, #322 ledger concurrency identity, #324 redirect-hop policy) |",
"| Source HEAD | `7b462b96f0e776dbd155e19cd7eb01610499e137` (current source main; #321 notifier ordering, #324 core redirect-hop policy and #332 canonical witness concurrency merged; only active source PR at capture: #309 fonts) |",
"source head")
matrix = replace_once(matrix,
"| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation because PR projection returned 403. PR #312 merged the permission/manual-replay/full-SHA-pin repair as `733ba309`; operator comment `5080203496` projects the exact marker without falsifying automated history. Current source `733ba309` is not claimed deployed; automated replay observation and whole-release identity/build-once remain open. |",
"| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation; operator comment `5080203496` is transparent recovery. PR #332 merged canonical automatic/manual writer locking as `7b462b96`. Current source `7b462b96` is not claimed deployed; automated replay observation and whole-release identity/build-once remain open. |",
"deploy")
matrix = replace_once(matrix,
"| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_733ba309_ledger-projection.md` |",
f"| Last reverify | `reverify/{REVERIFY_NAME}` |",
"reverify")
matrix = replace_once(matrix,
"⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `733ba309`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical automated ledger run remains failure; #312 fixed the source and operator comment `5080203496` projects the exact marker transparently. Automated replay observation, newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_733ba309_ledger-projection.md`.",
f"⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `7b462b96`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical automated ledger run remains failure; operator comment `5080203496` is transparent recovery, while #332 closes canonical writer concurrency only. Automated replay observation, newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/{REVERIFY_NAME}`.",
"authority warning")
matrix = replace_once(matrix,
"| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@733ba309`, exact deployed Pages/live/TTS authority `f5e29998`, merged #312, closed/imported #307, active #309/#321/#322/#324 ownership and the remaining automated-replay/whole-release boundaries without conflating source, operator projection and production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `733ba309` source + exact `f5e29998` evidence import |",
"| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@7b462b96`, exact deployed Pages/live/TTS authority `f5e29998`, merged #321/#324/#332, sole active #309 ownership and the remaining #303/automated-replay/whole-release boundaries without conflating source, operator projection and production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `7b462b96` source + exact `f5e29998` evidence import |",
"SSOT row")
matrix = replace_once(matrix,
"| CI-ALERT-NO-RECOVERY-STATE | ✅ **FIXED/SOURCE+LIVE VERIFIED 2026-07-25.** PR #308 replaced one-way guessed alerts with a machine-marked workflow+PR/branch state machine, exact failed jobs/steps/artifacts, stale-run ordering, recovery closure and trusted-default-branch execution. Shared Files Guard run `30169986781` passed; merge `779ac52b`. Commit `4f23a100` added the downstream `Deployment Witness Ledger` edge and a sixth adversarial mutation. Live issues #310/#317/#311 prove factual PR-separated alerts. Legacy guessed issues remain a separate evidence-backed cleanup task. | `779ac52b` PR#308 + `4f23a100` |",
"| CI-ALERT-NO-RECOVERY-STATE | ✅ **FIXED/SOURCE+LIVE VERIFIED 2026-07-25.** PR #308 replaced one-way guessed alerts with a machine-marked workflow+PR/branch state machine, exact failed jobs/steps/artifacts, stale-run ordering, recovery closure and trusted-default-branch execution. `4f23a100` added the ledger lifecycle edge; PR #321 / `a105c354` then made transition ordering monotonic against the newest seen lifecycle event. Live issues #310/#317/#311 prove factual PR-separated alerts. Legacy guessed issues remain separate evidence cleanup. | `779ac52b` PR#308 + `4f23a100` + `a105c354` |",
"notifier row")
matrix = replace_once(matrix,
"| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #297 removed repository mutation and excess permissions from Pages deploy and moved truthful `extensions.tts` evidence into a downstream ledger. PR #312 then fixed exact merged-PR projection, added main-only exact-run replay and pinned every privileged action by full SHA; exact run `30170949705` and Shared Guard `30170949685` passed. Whole-site artifact identity remains #292/#295; repository-wide permission registry remains #301/#64. | `e8c41d54` PR#297 + `733ba309` PR#312 |",
"| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #297 separated Pages publication from truthful `extensions.tts` evidence; PR #312 fixed PR projection, trusted exact-run replay and full-SHA pins; PR #332 / `7b462b96` added a read-only canonical resolver and one serialized privileged writer, collapsing whitespace/leading-zero aliases to the same deploy-run lock. Exact TTS `30172394177` and Shared Guard `30172394185` passed. Whole-site identity remains #292/#295; repository-wide permission registry remains #301/#64. | `e8c41d54` PR#297 + `733ba309` PR#312 + `7b462b96` PR#332 |",
"ledger row")
matrix = replace_once(matrix,
"| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PR #312 merged the exact permission/replay/pinning repair and operator comment `5080203496` now carries the unique full marker while explicitly preserving historical automated run `30169981463` as failure. Residual gap remains: an automated replay has not been observed, current source `733ba309` has no exact deployment witness, and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); PR #312/`733ba309`; operator comment `5080203496`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_733ba309_ledger-projection.md` |",
f"| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PRs #312/#332 fixed truthful projection, trusted replay and canonical concurrency; operator comment `5080203496` preserves historical automated run `30169981463` as failure. Residual gap remains: automated replay has not been observed, current source `7b462b96` has no exact deployment witness, and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); PR #312/`733ba309`; PR #332/`7b462b96`; operator comment `5080203496`; `reverify/{REVERIFY_NAME}` |",
"production gap")

marker = "### 2026-07-25 — source `7b462b96`, canonical witness lock"
if marker not in matrix:
    matrix = matrix.rstrip() + f'''\n\n{marker}\n\n- Advanced source SSOT to merged #332 / `7b462b96`; retained production authority at exact `f5e29998`.\n- Recorded #321 notifier ordering and #324 core redirect-hop merge; #303 remains open for privacy/evidence/pinning residuals.\n- Recorded TTS `30172394177`, Shared Guard `30172394185`, source artifact `8623271965` and browser artifact `8623312279`.\n- Refreshed active ownership to sole PR #309.\n- No row changed open/closed/severity class; counters remain unchanged.\n'''
MATRIX_PATH.write_text(matrix, encoding='utf-8')
print('materialized canonical 7b462b96 SSOT')
