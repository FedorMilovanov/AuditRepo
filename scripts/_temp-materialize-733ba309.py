#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects" / "gb-is-my-strength"
NEXT_PATH = PROJECT / "NEXT_AGENT_PROMPT.md"
MATRIX_PATH = PROJECT / "verified" / "MASTER_BUG_MATRIX.md"
REVERIFY_NAME = "CURRENT_HEAD_REVERIFY_2026-07-25_733ba309_ledger-projection.md"
REVERIFY_PATH = PROJECT / "reverify" / REVERIFY_NAME

SOURCE_SHA = "733ba309e159023ae44682b7cb71b2c042cd8eb6"
PRODUCTION_SHA = "f5e29998c5b42cc9e4e7c917b1e1c1072aa52320"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise AssertionError(f"{label}: expected exactly one old value, found {count}")
    return text.replace(old, new, 1)


next_content = f'''# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `{SOURCE_SHA}`
**Exact imported production authority:** ✅ `{PRODUCTION_SHA}` for readiness, Pages, Pages artifact, successful GitHub Pages deployment, live pointer/provenance and TTS capability witness.
**Current source deployment status:** ⚠️ `733ba309` is newer than the imported production witness and is **not** claimed deployed.
**Current source reverify:** `reverify/{REVERIFY_NAME}`
**Immutable deep-audit intakes:** `incoming/auditor-brain/2026-07-25-r3/REPORT.md` and `incoming/auditor-brain/2026-07-25-r5/REPORT.md`

## 1) Exact boundary

Source and production remain separate authorities:

- source `main` is `733ba309` after merged PR #312;
- exact production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages deployment `5603663894`, Pages artifact `8622641548` (`sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`) and TTS artifact `8622642553` (`sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`);
- proof artifact `8622690663` (`sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`) contains the exact production checks and preserves the historical ledger failure;
- historical downstream ledger run `30169981463` validated the artifact/report and then failed only on PR comment projection with `403 Resource not accessible by integration`;
- PR #312 merged as `733ba309` and repaired that source surface with exact PR-write permission, main-only exact-run replay, trusted current recorder source, `runner.temp` transport and full-SHA action pins;
- exact operator-recovery marker/comment `5080203496` now exists on merged PR #286. It explicitly does **not** relabel historical run `30169981463` as successful;
- an automated manual replay of `Deployment Witness Ledger` for `deploy_run_id=30169443420` was not executed through this tool session because the connected GitHub surface exposes no workflow-dispatch action. A future replay must be idempotent against the existing marker;
- #292/#295 still own generic whole-release digest/provenance and build-once promotion. TTS evidence remains a capability witness, not whole-site artifact identity;
- do not manufacture a deployment claim for source `733ba309` from source CI.

## 2) Current active pull requests

Refresh before every action because parallel agents are active. At this capture:

- **#309 — active SYSTEM owner:** deterministic offline font manifest/provenance for #302. Do not edit its font manifest, support manifest, downloader/generator or readiness/deploy font validation in another lane.
- **#321 — active SYSTEM owner:** notifier `latestSeen` monotonic ordering residual for #318. Do not edit notifier lifecycle files concurrently.
- **#322 — active SYSTEM owner:** serialize automatic/manual witness projection by target deploy-run identity for #320. It owns the two ledger control-plane files after #312.
- **#324 — active SYSTEM owner:** every-hop redirect/DNS/source policy for #303. Do not edit source-link audit files concurrently.

Closed/superseded convergence:

- #312 merged as `733ba309` after exact source, 26-mutation, actionlint, Shared Guard and Chromium/WebKit evidence;
- #307 closed without merge after artifact `8622690663` was imported through AuditRepo PR #62 / `2edfe200`;
- #308/#314/#319 remain the accepted notifier-subscription/series contracts;
- temporary duplicate/validation carriers remain closed without merge.

## 3) Closed systemic contracts

### Downstream witness permission/replay surface — source fixed

PR #312 now:

- grants PR write only to the dedicated downstream ledger, not Pages deploy;
- validates exact completed successful `main` deploy run identity before artifact access;
- replays current trusted default-branch recorder code against the exact historical deploy artifact;
- keeps checkout credentials disabled and transient run data under `runner.temp`;
- pins privileged `github-script`, `checkout` and `download-artifact` actions by full commit SHA;
- permanently rejects 26 permission/replay/artifact/supply-chain mutations.

This closes the narrow source defect. It does not prove a later automated replay occurred, and it does not close #301's repository-wide permission registry.

### Failure lifecycle — broad architecture fixed, residual owned

The factual notifier architecture remains accepted, but R5 correctly found one post-recovery ordering residual. PR #321/#318 owns the monotonic `latestSeen` correction. Do not reopen the broad one-way-alert architecture row; register/retain the residual separately.

### Shared series capability — fixed

Every reading series must resolve the canonical `SeriesReaderChrome` façade with a bound `defineSeriesConfig(...)` flat/book configuration or one explicit complete owner-approved exception. PR #319 made this a permanent Shared Files Guard contract.

## 4) CI status semantics

Classify every red result before changing code:

1. **product regression** — permanent contract fails on exact head;
2. **protective failure** — a guard rejects unsafe temporary/shared ownership;
3. **cancelled/superseded** — newer head/concurrency replaced it;
4. **post-publish projection failure** — Pages may be healthy while repository metadata projection fails;
5. **temporary evidence-carrier failure** — proof transport failed without proving a live-site defect;
6. **stale alert** — issue remains after newer same-identity success or explicit truthful supersession.

Never call ledger run `30169981463` a deployment failure. Never call operator comment `5080203496` an automated ledger success.

## 5) Active work, in order

1. **Respect and finish active exact owners**
   - #309 font integrity;
   - #321 notifier ordering;
   - #322 witness writer concurrency identity;
   - #324 redirect-hop policy.
   - Review/assist without crossing their file ownership.

2. **Converge whole-release architecture (#292 + #295)**
   - readiness builds and validates one pinned candidate;
   - publish whole-artifact digest plus generic build/routes/Pagefind/sitemap/feed/core identities;
   - deploy promotes the same artifact without a second install/build;
   - capability witnesses remain under extensions such as `extensions.tts`;
   - retain rollback and fail-closed manual recovery.

3. **Reconcile legacy guessed CI alerts**
   - #261/#272/#279/#259/#90/#89;
   - prove a newer success for the same workflow+branch identity, or close as superseded with exact replacement evidence;
   - do not bulk-close by age.

4. **Harden privileged control plane (#301 + #64)**
   - inventory effective write/OIDC/deployment permissions and persisted credentials;
   - register purpose, event, branch/repository boundary and mutation target;
   - pin every privileged external action by full commit SHA;
   - derive policy from capabilities, not shadow-era route names.

5. **Continue R3 hardening without crossing owners**
   - #298 immutable owner-approved product goldens;
   - #299 permanent Chromium/WebKit homepage interaction contract;
   - #287 one Genesis finalizer/activation owner only, draft/noindex by default;
   - Research #16 authority/supersession/rights manifest.

## 6) Non-negotiable gates

Before source merge:

- refresh current main/open PRs/changed paths and shared-file intersections;
- exact-head focused contract plus broad family regression;
- Shared Files Guard/control-plane/actionlint for workflow/package changes;
- relevant Native Source/Route Registry/Visual/browser/PDF gates;
- no `_temp-*` workflow/materializer in final product scope;
- no semantic weakening, guessed evidence or read-only mutation.

After a production-impacting merge:

- exact readiness;
- exact Pages deployment from the same verified artifact identity;
- generic live witness plus capability-specific evidence;
- successful downstream run-addressed acceptance record, or an explicitly labelled operator recovery that does not falsify automated history;
- only then advance production authority in AuditRepo.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses and counters.
- `reverify/` owns immutable current-head witnesses; `incoming/` owns raw forensic evidence.
- no silent evidence deletion, temporary workflow in a final diff or deployment claim without imported run/artifact evidence.
'''

reverify_content = f'''# CURRENT HEAD REVERIFY — 2026-07-25 — `733ba309` ledger projection repair

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `{SOURCE_SHA}`
- Exact imported production SHA: `{PRODUCTION_SHA}`
- AuditRepo authority before reconciliation: `a56c85ca6d158267e1cebfea36c1e412089729ff`
- Imported V2 evidence artifact: `8622690663` (`sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`)
- Deep-audit intake: `incoming/auditor-brain/2026-07-25-r5/REPORT.md`

Source and production remain separate. This document advances source truth to `733ba309`; it does not claim that source SHA deployed.

## Exact production authority retained for `f5e29998`

The imported V2 evidence remains authoritative:

- readiness `30169126149` — success on exact `f5e29998`;
- Pages deploy `30169443420`, attempt 1 — success on the same SHA;
- GitHub Pages deployment `5603663894` — success;
- Pages artifact `8622641548`, 63,124,892 bytes, digest `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`;
- TTS witness artifact `8622642553`, 1,283 bytes, digest `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`;
- exact live report PASS, two real routes, controller/engine/CSS/Service-Worker hashes and `lazyTtsPrecache:false`;
- live `current.json` and `/deployments/f5e29998.../30169443420-1.json` matched at capture.

These facts remain capability-scoped. They do not establish build-once promotion or generic whole-release identity.

## Historical automated ledger result

Run `30169981463`:

1. downloaded the exact TTS artifact;
2. validated non-expiry, artifact ID/size/digest and the exact PASS report;
3. constructed the correct full-SHA witness body;
4. failed only on `POST /issues/286/comments` with `403 Resource not accessible by integration`.

Its conclusion remains **failure**. This document does not rewrite that history.

## Source repair merged in PR #312

PR #312 final head `0d0b7ad7aae282d052d055fd6bc4f9fd0e2cb55f` merged as `{SOURCE_SHA}`.

The exact final source established:

- `pull-requests: write` only on the dedicated ledger writer;
- Pages deploy retains no Issues/PR mutation permission;
- main-only `workflow_dispatch(deploy_run_id)` recovery;
- exact Actions-API validation of run ID, workflow name, completion/success, `main`, same repository and full SHA;
- current trusted recorder code for manual replay, deployed-SHA source for automatic projection;
- `persist-credentials:false` and transient event data under `runner.temp`;
- exact-run artifact download;
- full-SHA pins for privileged `github-script`, `checkout` and `download-artifact` actions.

Exact CI:

- TTS Download Consent `30170949705` — source, recorder/provenance, 26 adversarial mutations, actionlint, Chromium/WebKit lifecycle, production-like build, Gill/standalone real-route matrix and mobile geometry all PASS;
- source artifact `8622897352`, digest `sha256:243e5ae277a7f66fafad335e0d19fa62b3172584c334c96e87bfd011994906af`;
- browser artifact `8622943174`, digest `sha256:e18cdc59427d363f9aac5a125a9edabd434d45b4c32507180e185d92277a82c0`;
- Shared Files Guard `30170949685` — PASS.

## Operator recovery projection

PR #286 now contains one exact marker:

`<!-- deployment-capability-witness:tts:f5e29998c5b42cc9e4e7c917b1e1c1072aa52320:30169443420:1:8622642553 -->`

Comment ID: `5080203496`.

The comment explicitly states:

- projection mode is operator recovery;
- historical automated ledger run remained failure;
- exact readiness/deploy/artifact IDs and digests;
- exact pointer/provenance URLs;
- TTS capability scope and #292/#295 limitation.

The connected GitHub tool exposed no workflow-dispatch operation, so an automated manual replay was not executed in this session. A future replay with `deploy_run_id=30169443420` must be idempotent against the existing marker.

## Temporary evidence carrier disposition

PR #307 was closed without merge after AuditRepo PR #62 imported artifact `8622690663`. It is not an active product/workflow owner.

## Current active source owners at capture

- #309 — deterministic fonts / #302;
- #321 — notifier monotonic `latestSeen` ordering / #318;
- #322 — automatic/manual ledger writer lock by target deploy run / #320;
- #324 — every-hop redirect/source policy / #303.

No reconciliation edit may cross those owners.

## Remaining systemic boundary

- production authority remains exact `f5e29998`;
- source authority is `733ba309` and is newer than the imported production witness;
- automated replay execution remains unobserved, though the source is repaired and an exact operator marker exists;
- #292/#295 remain authoritative for whole-artifact provenance and build-once promotion;
- #301/#64 remain authoritative for repository-wide permission registry and privileged-action policy.

## Acceptance

1. Advance AuditRepo source boundary to `733ba309`.
2. Keep production authority at exact `f5e29998`.
3. Record #312 as source+CI fixed and #307 as imported/closed without merge.
4. Keep `AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP` open, narrowed to automated replay observation, newer-source deployment and whole-release identity.
5. Do not change matrix counters: no row changes severity/open/closed class in this reconciliation.
'''

NEXT_PATH.write_text(next_content, encoding="utf-8")
REVERIFY_PATH.write_text(reverify_content, encoding="utf-8")

matrix = MATRIX_PATH.read_text(encoding="utf-8")

matrix = replace_once(
    matrix,
    "| Source HEAD | `be78785b601aa167c8e5efbc98a4582645b5191c` (current source main; notifier lifecycle #308/#314 and shared series capability gate #319 merged; active source lanes at capture: #309 font integrity, #312 downstream-ledger PR permission, #307 never-merge production evidence) |",
    "| Source HEAD | `733ba309e159023ae44682b7cb71b2c042cd8eb6` (current source main; #312 exact witness permission/replay/pinning repair merged; active source owners at capture: #309 fonts, #321 notifier ordering, #322 ledger concurrency identity, #324 redirect-hop policy) |",
    "matrix source head",
)

matrix = replace_once(
    matrix,
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence is now imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live `current.json` and run-addressed provenance. Downstream ledger run `30169981463` validated the evidence but failed only while posting to merged PR #286 because `pull-requests: write` was missing; #312 owns that repair. Current source `be78785b` is not claimed deployed, and whole-release artifact identity/build-once remain #292/#295. |",
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live pointer and run-addressed provenance. Historical ledger run `30169981463` remains failure after validation because PR projection returned 403. PR #312 merged the permission/manual-replay/full-SHA-pin repair as `733ba309`; operator comment `5080203496` projects the exact marker without falsifying automated history. Current source `733ba309` is not claimed deployed; automated replay observation and whole-release identity/build-once remain open. |",
    "matrix deploy authority",
)

matrix = replace_once(
    matrix,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md` |",
    f"| Last reverify | `reverify/{REVERIFY_NAME}` |",
    "matrix last reverify",
)

matrix = replace_once(
    matrix,
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `be78785b`; exact imported Pages/live/TTS production authority: `f5e29998`; downstream ledger completion remains blocked by the narrow #312 permission defect; whole-release artifact identity/build-once remain #292/#295. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md`.",
    f"⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `733ba309`; exact imported Pages/live/TTS production authority: `f5e29998`. Historical automated ledger run remains failure; #312 fixed the source and operator comment `5080203496` projects the exact marker transparently. Automated replay observation, newer-source deployment and whole-release identity/build-once remain open. Evidence: `reverify/{REVERIFY_NAME}`.",
    "matrix authority warning",
)

matrix = replace_once(
    matrix,
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@be78785b`, exact deployed Pages/live/TTS authority `f5e29998`, active #309/#312/#307 lanes and the remaining whole-release/ledger boundaries without conflating source with production. Immutable R2/R3/R4 intakes preserve prior snapshots. | `be78785b` source + exact `f5e29998` evidence import |",
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@733ba309`, exact deployed Pages/live/TTS authority `f5e29998`, merged #312, closed/imported #307, active #309/#321/#322/#324 ownership and the remaining automated-replay/whole-release boundaries without conflating source, operator projection and production. Immutable R2/R3/R4/R5 intakes preserve prior snapshots. | `733ba309` source + exact `f5e29998` evidence import |",
    "matrix SSOT closure row",
)

matrix = replace_once(
    matrix,
    "| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #297 removed repository mutation and excess permissions from Pages deploy, made the TTS evidence upload fail closed, and moved exact artifact/report validation plus a truthful `extensions.tts` capability witness into a retryable downstream ledger. Whole-site artifact identity remains #292/#295. | `e8c41d54` PR#297; exact head `1ae9c9f5` |",
    "| DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #297 removed repository mutation and excess permissions from Pages deploy and moved truthful `extensions.tts` evidence into a downstream ledger. PR #312 then fixed exact merged-PR projection, added main-only exact-run replay and pinned every privileged action by full SHA; exact run `30170949705` and Shared Guard `30170949685` passed. Whole-site artifact identity remains #292/#295; repository-wide permission registry remains #301/#64. | `e8c41d54` PR#297 + `733ba309` PR#312 |",
    "matrix ledger closure row",
)

matrix = replace_once(
    matrix,
    "| PRINT-REVERSIBLE-BACK-3D-FLOW | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #286 corrected flipped-state selector specificity for all three reversible-card families without adding `!important` or weakening unrelated screen behavior. Exact head `4dc1e155` passed Print Paper run `30168130026`, physical front/back same-page markers, full flattened inner-state/restoration checks, raster audit, Chromium/WebKit route registry and the complete permanent workflow matrix; merged as `f5e29998`. Production deployment remains separately unclaimed. | `f5e29998` PR#286 |",
    "| PRINT-REVERSIBLE-BACK-3D-FLOW | ✅ **FIXED/SOURCE+CI+PRODUCTION-CAPABILITY VERIFIED 2026-07-25.** PR #286 corrected flipped-state selector specificity for all three reversible-card families without adding `!important` or weakening unrelated screen behavior. Exact physical front/back, restoration, raster and Chromium/WebKit contracts passed; merged as `f5e29998`. Exact readiness/Pages/live/TTS production evidence for the same SHA is imported separately in artifact `8622690663`; this does not imply generic whole-release identity. | `f5e29998` PR#286 |",
    "matrix print production row",
)

matrix = replace_once(
    matrix,
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. Residual gap remains: downstream ledger `30169981463` failed only on PR-comment permission and current source `be78785b` has no exact deployment witness; generic whole-release digest/build-once are still #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); source PR #312; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md` |",
    f"| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. PR #312 merged the exact permission/replay/pinning repair and operator comment `5080203496` now carries the unique full marker while explicitly preserving historical automated run `30169981463` as failure. Residual gap remains: an automated replay has not been observed, current source `733ba309` has no exact deployment witness, and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); PR #312/`733ba309`; operator comment `5080203496`; `reverify/{REVERIFY_NAME}` |",
    "matrix production evidence gap",
)

session_marker = "### 2026-07-25 — source `733ba309`, imported `f5e29998`, operator witness projection"
if session_marker not in matrix:
    matrix = matrix.rstrip() + f'''\n\n{session_marker}\n\n- Advanced source SSOT from `be78785b` to merged PR #312 / `733ba309`; production authority remains exact imported `f5e29998`.\n- Recorded exact CI: TTS `30170949705`, Shared Guard `30170949685`, source artifact `8622897352`, browser artifact `8622943174`.\n- Recorded operator-recovery comment `5080203496` with exact marker/artifact IDs and explicit historical ledger failure; automated replay remains unobserved.\n- Recorded #307 closed without merge after V2 evidence import and refreshed active owners #309/#321/#322/#324.\n- No matrix row changed open/closed/severity class; counters remain unchanged.\n'''

MATRIX_PATH.write_text(matrix, encoding="utf-8")

print(f"Materialized {NEXT_PATH.relative_to(ROOT)}")
print(f"Materialized {MATRIX_PATH.relative_to(ROOT)}")
print(f"Created {REVERIFY_PATH.relative_to(ROOT)}")
