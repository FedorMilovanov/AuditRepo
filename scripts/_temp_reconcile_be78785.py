#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md"
NEXT = ROOT / "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md"
REVERIFY = ROOT / "projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md"
WORKFLOW = ROOT / ".github/workflows/_temp-reconcile-be78785.yml"
SELF = Path(__file__).resolve()

EXPECTED_MAIN = "ba22689bb6ad33bd8824ce7040b612a387435a60"
EXPECTED_MATRIX_BLOB = "883428b6d93c867590fe77a8c065b7b4999c6e48"
EXPECTED_NEXT_BLOB = "f77d31d4e80aec655611c3b27986397c64202129"
SOURCE_HEAD = "be78785b601aa167c8e5efbc98a4582645b5191c"
DEPLOYED_SHA = "f5e29998c5b42cc9e4e7c917b1e1c1072aa52320"


def run(*args: str) -> str:
    return subprocess.check_output(args, cwd=ROOT, text=True).strip()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


run("git", "fetch", "origin", "main")
if run("git", "rev-parse", "origin/main") != EXPECTED_MAIN:
    raise SystemExit("AuditRepo main drifted; refusing to materialize")
if run("git", "hash-object", str(MATRIX.relative_to(ROOT))) != EXPECTED_MATRIX_BLOB:
    raise SystemExit("MASTER_BUG_MATRIX.md drifted; refusing to materialize")
if run("git", "hash-object", str(NEXT.relative_to(ROOT))) != EXPECTED_NEXT_BLOB:
    raise SystemExit("NEXT_AGENT_PROMPT.md drifted; refusing to materialize")
if REVERIFY.exists():
    raise SystemExit(f"reverify already exists: {REVERIFY.relative_to(ROOT)}")

matrix = MATRIX.read_text(encoding="utf-8")
matrix = replace_once(
    matrix,
    "| Source HEAD | `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320` (current source main; print PR #286 merged after complete exact-head physical PDF and cross-browser proof; no source PR is open) |",
    "| Source HEAD | `be78785b601aa167c8e5efbc98a4582645b5191c` (current source main; notifier lifecycle #308/#314 and shared series capability gate #319 merged; active source lanes at capture: #309 font integrity, #312 downstream-ledger PR permission, #307 never-merge production evidence) |",
    "source head",
)
matrix = replace_once(
    matrix,
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Last fully imported exact production witness remains `8a535267`. Current candidate `f5e29998` includes merged print repair #286, but exact readiness, Pages, run-addressed provenance, witness artifact and downstream ledger result for this merge SHA are not yet imported. Current source is not claimed deployed here. |",
    "| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence is now imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful GitHub Pages deployment, exact live `current.json` and run-addressed provenance. Downstream ledger run `30169981463` validated the evidence but failed only while posting to merged PR #286 because `pull-requests: write` was missing; #312 owns that repair. Current source `be78785b` is not claimed deployed, and whole-release artifact identity/build-once remain #292/#295. |",
    "deploy authority",
)
matrix = replace_once(
    matrix,
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md` |",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md` |",
    "last reverify",
)
matrix = replace_once(
    matrix,
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `f5e29998`; last fully imported exact production witness: `8a535267`; current production candidate requiring evidence import: `f5e29998`; source/orchestration evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md`.",
    "⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `be78785b`; exact imported Pages/live/TTS production authority: `f5e29998`; downstream ledger completion remains blocked by the narrow #312 permission defect; whole-release artifact identity/build-once remain #292/#295. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md`.",
    "authority warning",
)
matrix = replace_once(matrix, "## ✅ ЗАКРЫТО (153)", "## ✅ ЗАКРЫТО (155)", "closed heading")
matrix = replace_once(
    matrix,
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records `main@f5e29998`, merged print repair #286, no open source PR and the fail-closed production-evidence gap. Immutable R2/R3 intakes preserve the drift and self-correction evidence. | `f5e29998` source + AuditRepo R4 reconciliation |",
    "| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT now records source `main@be78785b`, exact deployed Pages/live/TTS authority `f5e29998`, active #309/#312/#307 lanes and the remaining whole-release/ledger boundaries without conflating source with production. Immutable R2/R3/R4 intakes preserve prior snapshots. | `be78785b` source + exact `f5e29998` evidence import |\n"
    "| CI-ALERT-NO-RECOVERY-STATE | ✅ **FIXED/SOURCE+LIVE VERIFIED 2026-07-25.** PR #308 replaced one-way guessed alerts with a machine-marked workflow+PR/branch state machine, exact failed jobs/steps/artifacts, stale-run ordering, recovery closure and trusted-default-branch execution. Shared Files Guard run `30169986781` passed; merge `779ac52b`. Commit `4f23a100` added the downstream `Deployment Witness Ledger` edge and a sixth adversarial mutation. Live issues #310/#317/#311 prove factual PR-separated alerts. Legacy guessed issues remain a separate evidence-backed cleanup task. | `779ac52b` PR#308 + `4f23a100` |\n"
    "| SERIES-CAPABILITY-INTERFACE | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** Every reading `surface: series` route must resolve the canonical shared façade with a `defineSeriesConfig(...)`-bound generic flat/book config or carry one explicit owner-approved capability exception. Existing Nagornaya native routes are machine-registered. PR #319 made the full registry contract a permanent Shared Files Guard owner and added the missing deceptive route-specific `SeriesReaderChrome` name regression; exact run `30170548516` passed and issue #300 closed. | `be78785b` PR#319 |",
    "closed rows",
)
matrix = replace_once(matrix, "## 🟠 P1 — ОТКРЫТО (101)", "## 🟠 P1 — ОТКРЫТО (100)", "p1 heading")
matrix = replace_once(
    matrix,
    "| CI-ALERT-NO-RECOVERY-STATE | Failure notifier has no exact-head recovery/superseded state, does not actually download route-impact evidence, guesses causes/routes, misses the real readiness gateway and subscribes to stale IndexNow workflow ownership while deploy swallows IndexNow failures. | source issue #294; R2 intake |\n",
    "",
    "remove notifier open row",
)
matrix = replace_once(
    matrix,
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | AuditRepo cannot safely advance production authority beyond `8a535267` until exact readiness, Pages, run-addressed provenance, live artifact and downstream capability-witness identifiers for current candidate `f5e29998` are imported. Source CI and merged PR evidence do not prove deployment. | `incoming/auditor-brain/2026-07-25-r3/REPORT.md`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_f5e29998_auditor-r4.md` |",
    "| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful GitHub Pages deployment, live pointer and run-addressed provenance are imported for `f5e29998`. Residual gap remains: downstream ledger `30169981463` failed only on PR-comment permission and current source `be78785b` has no exact deployment witness; generic whole-release digest/build-once are still #292/#295. | artifact `8622690663` (`sha256:79d5735b…`); source PR #312; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md` |",
    "production gap row",
)
matrix = replace_once(
    matrix,
    "## Статистика (обновлено 2026-07-25: source f5e29998 + print source closure)",
    "## Статистика (обновлено 2026-07-25: source be78785b + exact f5e29998 production import)",
    "stats heading",
)
matrix = replace_once(matrix, "| Закрыто (fixed) | 153 |", "| Закрыто (fixed) | 155 |", "fixed count")
matrix = replace_once(matrix, "| P1 открыто | 101 |", "| P1 открыто | 100 |", "p1 count")
matrix = replace_once(matrix, "| **Всего открыто (матрица)** | **197** |", "| **Всего открыто (матрица)** | **196** |", "open total")
matrix = replace_once(
    matrix,
    "## Session log (append-only)\n\n- **2026-07-25 auditor R4 (`f5e29998`)**",
    "## Session log (append-only)\n\n"
    "- **2026-07-25 notifier/series/production reconciliation (`be78785b`)** — merged #308/#314 establish the factual recovery-aware notifier and complete readiness→deploy→ledger subscription; live machine-marked alerts prove PR-separated exact-step evidence. Series issue #300 is closed by registry/interface commits plus merged #319 and exact Shared Files Guard `30170548516`. Audit artifact `8622690663` imports exact readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS artifact `8622642553`, successful Pages deployment and live run-addressed provenance for `f5e29998`. Ledger `30169981463` failed only posting to PR #286; #312 owns the permission fix. Current `be78785b` remains undeployed here.\n\n"
    "- **2026-07-25 auditor R4 (`f5e29998`)**",
    "session log",
)
MATRIX.write_text(matrix, encoding="utf-8")

NEXT.write_text("""# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `be78785b601aa167c8e5efbc98a4582645b5191c`
**Exact imported production authority:** ✅ `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320` for readiness, Pages, Pages artifact, live pointer/provenance and TTS capability witness.
**Current source deployment status:** ⚠️ `be78785b` is newer than the imported production witness and is **not** claimed deployed.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_be78785b_notifier-series-production.md`
**Immutable deep-audit intake:** `incoming/auditor-brain/2026-07-25-r3/REPORT.md`

## 1) Exact boundary

Source and production are separate authorities:

- source `main` is `be78785b` after the factual notifier, downstream-ledger subscription and permanent shared-series capability gate;
- exact production evidence is imported for `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`), TTS artifact `8622642553` (`sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`), successful GitHub Pages deployment, live `current.json` and run-addressed provenance;
- proof artifact `8622690663` (`sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`) contains 13 PASS production checks;
- downstream ledger `30169981463` validated the same evidence, then failed only on `POST /issues/286/comments` because `pull-requests: write` was missing; active PR #312 owns the narrow permission repair;
- #292/#295 still own generic whole-release digest/provenance and build-once artifact promotion; the TTS witness is capability evidence, not whole-site release identity;
- do not manufacture a deployment claim for `be78785b` from source CI.

## 2) Current active pull requests

At capture time:

- **#309 — active product/SYSTEM lane:** deterministic offline font manifest and provenance for issue #302. Respect its current owner; do not edit font manifest/downloader/deploy font validation in another lane.
- **#312 — active SYSTEM lane:** grant only the downstream `Deployment Witness Ledger` the PR-write permission required to post the already-validated witness; preserve Pages deploy least privilege.
- **#307 — temporary never-merge evidence carrier:** its artifact has been imported. After AuditRepo reconciliation, close it without merge and remove/reset its transport branch; it is not a product owner.

Closed/superseded convergence:

- #308 merged as `779ac52b`; #306 is superseded and closed;
- #314/`4f23a100` added ledger subscription; duplicate #313/#315 are closed;
- #319 merged as `be78785b`; validation carrier #316 is closed.

Refresh source `main`, open PRs and exact heads before every action because parallel agents are active.

## 3) Closed systemic contracts

### Failure lifecycle — issue #294 closed

`notify-on-failure.yml` now:

- keys alerts by workflow plus PR/branch identity;
- records exact failed jobs, steps and artifact metadata;
- never guesses route impact or root cause from workflow/commit names;
- ignores cancelled/superseded/external-repository runs;
- orders failures/recoveries by run ID and attempt;
- closes only on a newer exact success;
- executes trusted default-branch code through Contents API, not the triggering branch;
- permanently mutation-tests the readiness, deploy and downstream ledger graph.

Live issues #310/#317/#311 prove the factual machine-marked behavior. Old guessed issues #261/#272/#279/#259/#90/#89 are migration debt: reconcile only with a newer successful run of the same workflow and identity or a truthful superseded disposition.

### Shared series capability — issue #300 closed

Every reading `surface: series` route must either:

1. resolve the canonical `SeriesReaderChrome` façade with a generic `defineSeriesConfig(...)` flat/book config; or
2. use one explicit owner-approved exception enumerating ReaderState, navigation, settings, TTS, print, accessibility and publication evidence.

Permanent Shared Files Guard owns all six adversarial classes, including a route-specific component locally named `SeriesReaderChrome` that resolves to a private path.

## 4) CI status semantics

Classify every red result before changing code:

1. **product regression** — permanent contract fails on exact head;
2. **protective failure** — a guard rejects unsafe temporary/shared ownership;
3. **cancelled/superseded** — newer head/concurrency replaced it;
4. **post-publish ledger failure** — Pages may be healthy while repository projection fails;
5. **temporary evidence-carrier failure** — proof transport failed without proving a live-site defect;
6. **stale alert** — issue remains after newer same-identity success or a clearly superseded temporary lane.

Never call the `30169981463` 403 a deployment failure: exact Pages/live evidence for `f5e29998` passed.

## 5) Active work, in order

1. **Finish #312 and rerun the downstream ledger**
   - exact-head actionlint/source contract/Shared Files Guard green;
   - merge only the least-privilege PR-write delta;
   - rerun ledger against the exact `f5e29998` witness or the next exact deployment;
   - require the machine-marked PR/issue record to succeed.

2. **Close the imported never-merge evidence carrier #307**
   - comment with AuditRepo reverify path and artifact ID/digest;
   - close without merge;
   - reset/delete temporary verifier branch and ensure no temporary workflow becomes a product owner;
   - disposition its machine alert truthfully rather than pretending the failed carrier recovered.

3. **Finish font integrity #309 / issue #302**
   - offline exact manifest, format/size/SHA/metadata checks;
   - no arbitrary HTTP acceptance, partial writes or `|| echo` fail-open deploy path;
   - preserve one owner and exact provenance for all 28 tracked WOFF2 files.

4. **Converge whole-release architecture (#292 + #295)**
   - readiness builds and validates one pinned candidate;
   - publish whole-artifact digest plus generic build/routes/Pagefind/sitemap/feed/core identities;
   - deploy promotes the same artifact without a second install/build;
   - capability witnesses remain under extensions such as `extensions.tts`.

5. **Reconcile legacy guessed CI alerts**
   - #261/#272/#279/#259/#90/#89;
   - prove a newer success for the same workflow+branch identity, or close as superseded with exact replacement evidence;
   - do not bulk-close by age.

6. **Harden privileged control plane (#301 + #64)**
   - inventory write/OIDC/deployment surfaces and persisted credentials;
   - pin privileged third-party Actions by full commit SHA;
   - derive capability policy from the effective registry, not shadow-era route names;
   - keep validation read-only and least privilege.

7. **Continue R3 hardening without crossing owners**
   - #298 immutable owner-approved product goldens;
   - #299 permanent Chromium/WebKit homepage interaction contract;
   - #303 every-hop redirect/source policy;
   - #287 one Genesis finalizer/activation owner only, draft/noindex by default.

8. **Research authority manifest (Research #16)**
   - machine-readable authority/supersedes/applies-to/source-grade/rights state;
   - block cycles, duplicate authority, stale site imports and unresolved image rights.

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
- successful downstream run-addressed acceptance record;
- only then advance production authority in AuditRepo.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses and counters.
- `reverify/` owns immutable current-head witnesses; `incoming/` owns raw forensic evidence.
- no silent evidence deletion, temporary workflow in a final diff or deployment claim without imported run/artifact evidence.
""", encoding="utf-8")

REVERIFY.write_text("""# CURRENT HEAD REVERIFY — 2026-07-25 — `be78785b` notifier, series and production evidence

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Exact source main: `be78785b601aa167c8e5efbc98a4582645b5191c`
- Exact imported production SHA: `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`
- AuditRepo authority before reconciliation: `ba22689bb6ad33bd8824ce7040b612a387435a60`
- Immutable deep-audit intake: `incoming/auditor-brain/2026-07-25-r3/REPORT.md`

Source and production remain separate. This document imports exact production evidence for `f5e29998`; it does not claim current source `be78785b` deployed.

## Source delta: factual CI lifecycle

1. PR #308 exact head `b4fcc8f2a122af520702b4eb7a649d5ced3e5b7a` passed Shared Files Guard run `30169986781` and merged as `779ac52b3d83a97fed2776c5295ac6c34fd169d6`.
2. The notifier now owns a machine-marked workflow+PR/branch lifecycle with exact job/step/artifact evidence, stale run ordering, newer-success recovery and external/cancelled filtering.
3. Privileged `workflow_run` execution fetches the dependency-free notifier from the trusted default branch through the Contents API; it does not checkout or execute the triggering branch.
4. Commit `4f23a100f050a6fb32502b4aeb78fc7f3a9ee02a` added `Deployment Witness Ledger` to the permanent alert graph and mutation-guards that edge.
5. Parallel PR #306 and duplicate follow-ups #313/#315 were closed without merge after convergence.
6. Live machine-marked issues #310, #317 and #311 record separate PR identities and exact failed steps, proving the new source architecture executes in GitHub.

Result: source issue #294 and matrix row `CI-ALERT-NO-RECOVERY-STATE` are closed. Legacy guessed issues remain a separate evidence-reconciliation task.

## Source delta: shared series capability interface

1. Commit `abac889555e702135df5bbdcfb14156852b731d2` registered explicit owner-approved Nagornaya native-reader exceptions with capability evidence.
2. Commit `2c3cf1a9153b0f128eb61a81f7dc0d14a064cef4` added a registry-derived contract requiring canonical shared façade usage with a generic `defineSeriesConfig(...)` binding or one complete exception.
3. Commit `26904bde8dc6c5f2d46508a92b5ee873ae58eee6` wired the contract and mutation suite into the public-surface registry audit.
4. PR #319 exact head `1a6822ce0553a88fd940e73cf9d8342dace6e1f6` added the missing route-specific deceptive-name regression and made the full capability suite a permanent Shared Files Guard step.
5. Shared Files Guard run `30170548516` passed all focused and broad steps; PR #319 merged as `be78785b601aa167c8e5efbc98a4582645b5191c` and issue #300 closed completed.
6. Temporary validation carrier #316 was closed without merge.

Result: every reading-series route is governed by exact resolved-path/interface evidence, not a historical consumer count or a route-specific component name.

## Exact production evidence imported for `f5e29998`

The temporary evidence run `30170154503` uploaded artifact `8622690663` (`production-evidence-f5e29998-v2-30170154503`, digest `sha256:79d5735bc34978b922ceafb7861ca0f7df386aad5e9c3fa66febbe09df11a0ee`). Its report proves:

- readiness run `30169126149` completed successfully on exact SHA `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320`;
- deploy run `30169443420` completed successfully on the same exact SHA;
- Pages artifact `8622641548`, digest `sha256:38a3a138d9f062e43c0e3ed52666113759d310cb0231e2ee388fc522b25e2b2c`, was unique and non-expired at capture;
- TTS live artifact `8622642553`, digest `sha256:bacb0330c7a2201289eeeb7d2b9b9dc832106eec292cd890afc1c5819e1eec7f`, was unique and non-expired;
- the downloaded live report was exact PASS and named readiness `30169126149`, deploy run `30169443420`, attempt 1, two real routes and exact controller/engine/CSS/service-worker revisions and SHA-256 values;
- GitHub Pages deployment `5603663894` succeeded for exact SHA `f5e29998`;
- live `/deployments/current.json` and immutable `/deployments/f5e29998.../30169443420-1.json` matched the exact run-addressed provenance.

These are durable Pages/live/TTS facts. They do not establish generic whole-release artifact identity beyond the capability witness.

## Downstream ledger residual

The same evidence report has only two failed checks:

1. downstream ledger succeeded;
2. exact ledger comment exists.

Ledger run `30169981463` successfully downloaded and validated the exact witness, then failed posting the machine-marked comment to merged PR #286 with `403 Resource not accessible by integration`. The accepted permission set requires `pull_requests: write`; the workflow had only read permission. Active source PR #312 owns the narrow least-privilege repair.

This is a post-publish repository-projection defect, not a Pages deployment failure.

## Current active source lanes at capture

- #309 — deterministic font manifest/provenance and fail-closed offline validation for issue #302;
- #312 — downstream ledger PR-write permission and permanent adversarial contract;
- #307 — temporary never-merge production-evidence carrier; its artifact is imported and it should be closed/reset after this reconciliation.

Parallel agents are active; refresh current heads before acting.

## Remaining systemic owners

- #292 — generic whole-artifact deployment provenance and identity;
- #295 — build once and promote the exact verified artifact;
- #301/#64 — privileged Action pinning, least privilege and workflow-policy migration;
- #298/#299 — immutable product goldens and permanent homepage browser interaction coverage;
- #303 — redirect-hop source policy;
- #287 — Genesis transport/finalizer coordination only;
- Research #16 — authority/supersession/rights manifest.

## Acceptance and disposition

1. Matrix production authority may advance from `8a535267` to exact `f5e29998` for the specifically proven Pages/live/TTS scope.
2. Matrix must keep the production-evidence gap open for current source `be78785b`, downstream ledger completion and generic whole-release identity.
3. PR #312 must pass exact-head CI and merge before the ledger can be rerun truthfully.
4. PR #307 is never-merge transport and should be closed only after this evidence is committed to AuditRepo.
5. Legacy guessed failure issues must be reconciled one identity at a time; age is not recovery evidence.
""", encoding="utf-8")

# Fail closed on expected aggregate counters and no stale authority strings in the status block.
final_matrix = MATRIX.read_text(encoding="utf-8")
for required in (
    "## ✅ ЗАКРЫТО (155)",
    "## 🟠 P1 — ОТКРЫТО (100)",
    "| **Всего открыто (матрица)** | **196** |",
    "be78785b601aa167c8e5efbc98a4582645b5191c",
    "artifact `8622690663`",
):
    if required not in final_matrix:
        raise SystemExit(f"missing required matrix marker: {required}")
if "| CI-ALERT-NO-RECOVERY-STATE | Failure notifier has no" in final_matrix:
    raise SystemExit("stale open notifier row remains")

# Remove temporary infrastructure before the permanent commit.
SELF.unlink()
WORKFLOW.unlink()

subprocess.check_call(["python3", "scripts/check_auditrepo_structure.py"], cwd=ROOT)
subprocess.check_call(["python3", "scripts/validate_audit_repo.py"], cwd=ROOT)
subprocess.check_call(["python3", "scripts/validate_audit_repo_regression_test.py"], cwd=ROOT)
subprocess.check_call(["python3", "scripts/check_matrix_coverage.py", "--verbose"], cwd=ROOT)

subprocess.check_call(["git", "add", "projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md", "projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md", str(REVERIFY.relative_to(ROOT)), str(SELF.relative_to(ROOT)), str(WORKFLOW.relative_to(ROOT))], cwd=ROOT)
subprocess.check_call(["git", "commit", "-m", "audit: import f5 production and reconcile be78785 source"], cwd=ROOT)
subprocess.check_call(["git", "push", "origin", "HEAD"], cwd=ROOT)
print("materialized AuditRepo reconciliation")
