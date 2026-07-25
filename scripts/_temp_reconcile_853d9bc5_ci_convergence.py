#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "projects/gb-is-my-strength"
MATRIX_PATH = PROJECT / "verified/MASTER_BUG_MATRIX.md"
PROMPT_PATH = PROJECT / "NEXT_AGENT_PROMPT.md"
OLD_REVERIFY = PROJECT / "reverify/CURRENT_HEAD_REVERIFY_2026-07-25_733ba309_ledger-projection.md"
NEW_REVERIFY = PROJECT / "reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md"

SOURCE_SHA = "853d9bc5abbe653a23528e444a27689c0b6b8ce6"
PROD_SHA = "f5e29998c5b42cc9e4e7c917b1e1c1072aa52320"


def replace_once(text: str, pattern: str, replacement: str, *, flags=0, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return updated


def replace_row(text: str, finding_id: str, row: str) -> str:
    return replace_once(
        text,
        rf"^\| {re.escape(finding_id)} \|.*$",
        row,
        flags=re.MULTILINE,
        label=f"matrix row {finding_id}",
    )


matrix = MATRIX_PATH.read_text(encoding="utf-8")
if "733ba309e159023ae44682b7cb71b2c042cd8eb6" not in matrix:
    raise SystemExit("matrix source boundary is not the expected 733ba309 snapshot")
if "CI-ALERT-POST-RECOVERY-ORDERING" in matrix:
    raise SystemExit("CI-ALERT-POST-RECOVERY-ORDERING is already canonical")
if "DEPLOY-WITNESS-RAW-RUN-CONCURRENCY" in matrix:
    raise SystemExit("DEPLOY-WITNESS-RAW-RUN-CONCURRENCY is already canonical")
if "DEPLOY-WITNESS-CANONICAL-RUN-LOCK" in matrix:
    raise SystemExit("DEPLOY-WITNESS-CANONICAL-RUN-LOCK is already canonical")

matrix = replace_once(
    matrix,
    r"^\| Source HEAD \|.*$",
    f"| Source HEAD | `{SOURCE_SHA}` (current source main; PR #321 fixed monotonic notifier transition ordering and PR #322 added a non-cancelling deployment-witness lock. Active owners at capture: #309 fonts, #324 redirect-hop policy, #332 canonical deployment-run lock identity) |",
    flags=re.MULTILINE,
    label="matrix Source HEAD",
)
matrix = replace_once(
    matrix,
    r"^\| Deploy \|.*$",
    f"| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `{PROD_SHA[:8]}`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful Pages deployment, exact live pointer and run-addressed provenance. Current source `{SOURCE_SHA[:8]}` is not claimed deployed. Operator marker `5080203496` remains transparent recovery evidence; automated replay is still unobserved. Whole-release identity/build-once remain #292/#295. |",
    flags=re.MULTILINE,
    label="matrix Deploy",
)
matrix = replace_once(
    matrix,
    r"^\| Last reverify \|.*$",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md` |",
    flags=re.MULTILINE,
    label="matrix Last reverify",
)
matrix = replace_once(
    matrix,
    r"^⚠️ Старые deploy-формулировки.*$",
    f"⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `{SOURCE_SHA[:8]}`; exact imported Pages/live/TTS production authority: `{PROD_SHA[:8]}`. Current source is not claimed deployed. PR #332 remains the sole canonical-run concurrency owner; automated ledger replay and generic whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md`.",
    flags=re.MULTILINE,
    label="matrix authority warning",
)

matrix = replace_row(
    matrix,
    "AUDIT-SSOT-CURRENT-HEAD-DRIFT",
    f"| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT records source `main@{SOURCE_SHA[:8]}`, exact deployed authority `{PROD_SHA[:8]}`, merged notifier ordering PR #321, merged intermediate witness lock PR #322, sole canonical follow-up #332 and active #309/#324 ownership without conflating source, production, operator projection or automated replay. | `{SOURCE_SHA[:8]}` source + exact `{PROD_SHA[:8]}` production evidence |",
)
matrix = replace_row(
    matrix,
    "CI-ALERT-NO-RECOVERY-STATE",
    "| CI-ALERT-NO-RECOVERY-STATE | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #308 replaced guessed one-way alerts with a factual workflow+identity lifecycle; commit `4f23a100` added the deployment-ledger edge. PR #321 then closed the post-recovery ordering residual by comparing every failure against monotonic `latestSeen`, with delayed-attempt/duplicate/newer-reopen fixtures and exact Shared Files Guard `30171424913`. | `a105c354` PR#321 |",
)
closed_anchor = "| CI-ALERT-NO-RECOVERY-STATE | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #308 replaced guessed one-way alerts with a factual workflow+identity lifecycle; commit `4f23a100` added the deployment-ledger edge. PR #321 then closed the post-recovery ordering residual by comparing every failure against monotonic `latestSeen`, with delayed-attempt/duplicate/newer-reopen fixtures and exact Shared Files Guard `30171424913`. | `a105c354` PR#321 |"
closed_rows = "\n".join([
    closed_anchor,
    "| CI-ALERT-POST-RECOVERY-ORDERING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** Delayed failure attempts older than a recorded recovery can no longer reopen a closed machine-key alert. `latestSeen` is the global transition cursor; genuinely newer failures still reopen deterministically. | `a105c354` PR#321 |",
    "| DEPLOY-WITNESS-RAW-RUN-CONCURRENCY | ✅ **FIXED AS INTERMEDIATE SOURCE BOUNDARY 2026-07-25.** PR #322 restored one non-cancelling lock across automatic/manual witness projection for the same raw target run ID; exact Shared `30171638400` and TTS `30171638405` passed. Textual aliases of the same numeric run remain a separate open canonicalization residual owned by #332/#320. | `853d9bc5` PR#322 |",
])
matrix = replace_once(
    matrix,
    re.escape(closed_anchor),
    closed_rows,
    label="insert closed CI convergence rows",
)

matrix = replace_row(
    matrix,
    "AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP",
    f"| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful Pages deployment, live pointer and run-addressed provenance are imported for `{PROD_SHA[:8]}`. Operator comment `5080203496` carries the exact marker while preserving historical automated run `30169981463` as failure. Residual gap remains: automated replay is unobserved, current source `{SOURCE_SHA[:8]}` has no exact deployment witness, and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663`; operator comment `5080203496`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md` |",
)
open_anchor = next(
    line for line in matrix.splitlines()
    if line.startswith("| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP |")
)
open_row = "| DEPLOY-WITNESS-CANONICAL-RUN-LOCK | Merged #322 serializes identical raw target IDs, but manual textual aliases such as whitespace/leading zeros can still identify the same numeric deploy run while acquiring different locks. PR #332 is the sole owner: read-only resolver canonicalizes to the API `workflowRun.id`, privileged writer locks on that output and revalidates exact run/SHA. Exact head `a9d3f3e1`; Shared `30172042020` passed, while TTS source contract `30172042018` correctly remains red because one duplicate resolver/writer assertion mutation is vacuous. | source issue #320; PR #332; artifact `8623180869`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md` |"
matrix = replace_once(
    matrix,
    re.escape(open_anchor),
    open_anchor + "\n" + open_row,
    label="insert canonical run lock row",
)

matrix = replace_once(matrix, r"^## ✅ ЗАКРЫТО \(155\)$", "## ✅ ЗАКРЫТО (157)", flags=re.MULTILINE, label="closed counter")
matrix = replace_once(matrix, r"^## 🟠 P1 — ОТКРЫТО \(100\)$", "## 🟠 P1 — ОТКРЫТО (101)", flags=re.MULTILINE, label="P1 counter")


def section_count(pattern: str) -> int:
    match = re.search(pattern, matrix, re.MULTILINE)
    if not match:
        raise SystemExit(f"missing section counter: {pattern}")
    return int(match.group(1))

closed_count = section_count(r"^## ✅ ЗАКРЫТО \((\d+)\)$")
p0_count = section_count(r"^## 🔴 RELEASE-BLOCKING P0/P1 — ОТКРЫТО \((\d+)\)$")
p1_count = section_count(r"^## 🟠 P1 — ОТКРЫТО \((\d+)\)$")
p2_count = section_count(r"^## 🟡 P2 — ОТКРЫТО \((\d+)\)$")
p3_count = section_count(r"^## 🟢 P3 — ОТКРЫТО \((\d+)\)$")
refactor_count = section_count(r"^## .*РЕФАКТОРИНГ \((\d+)\)$")
auditrepo_count = section_count(r"^## .*AUDITREPO \((\d+)\)$")
total_open = p0_count + p1_count + p2_count + p3_count + refactor_count + auditrepo_count

matrix = replace_once(
    matrix,
    r"^## Статистика \(обновлено .*\)$",
    f"## Статистика (обновлено 2026-07-25: source {SOURCE_SHA[:8]} + CI convergence)",
    flags=re.MULTILINE,
    label="statistics heading",
)
for label, value in [
    ("Закрыто \\(fixed\\)", closed_count),
    ("\\*\\*P0 открыто\\*\\*", f"**{p0_count}**"),
    ("P1 открыто", p1_count),
    ("P2 открыто", p2_count),
    ("P3 открыто", p3_count),
    ("Рефакторинг", refactor_count),
    ("AuditRepo", auditrepo_count),
    ("\\*\\*Всего открыто \\(матрица\\)\\*\\*", f"**{total_open}**"),
]:
    matrix = replace_once(
        matrix,
        rf"^\| {label} \| .* \|$",
        lambda _m, label=label, value=value: f"| {re.sub(r'\\\\|\\\\\\*', '', label)} | {value} |",
        flags=re.MULTILINE,
        label=f"statistics row {label}",
    )

# Restore exact visible labels after generic replacements.
matrix = re.sub(r"^\| Закрыто fixed \|", "| Закрыто (fixed) |", matrix, flags=re.MULTILINE)
matrix = re.sub(r"^\| P0 открыто \|", "| **P0 открыто** |", matrix, flags=re.MULTILINE)
matrix = re.sub(r"^\| Всего открыто матрица \|", "| **Всего открыто (матрица)** |", matrix, flags=re.MULTILINE)

session = (
    f"- **2026-07-25 CI convergence (`{SOURCE_SHA[:8]}`)** — PR #321 merged monotonic notifier ordering; "
    "PR #322 merged an intermediate raw-ID witness lock; #320 reopened for canonical numeric identity and #332 is the sole owner. "
    "Closed duplicate #331 without merge. Production authority remains exact `f5e29998`; active source owners are #309/#324/#332."
)
matrix = replace_once(
    matrix,
    r"^(## Session log \(append-only\)\n)",
    rf"\1\n{session}\n",
    flags=re.MULTILINE,
    label="session log insertion",
)
MATRIX_PATH.write_text(matrix, encoding="utf-8")

prompt = f"""# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `{SOURCE_SHA}`
**Exact imported production authority:** ✅ `{PROD_SHA}` for readiness, Pages, Pages artifact, live pointer/provenance and TTS capability witness.
**Current source deployment status:** ⚠️ `{SOURCE_SHA[:8]}` is newer than the imported production witness and is **not** claimed deployed.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md`
**Immutable deep-audit intakes:** `incoming/auditor-brain/2026-07-25-r3/REPORT.md` and `incoming/auditor-brain/2026-07-25-r5/REPORT.md`

## 1) Exact boundary

- Source `main` is `{SOURCE_SHA[:8]}` after merged PR #321 (`a105c354`) and PR #322 (`853d9bc5`).
- PR #321 closes the notifier post-recovery ordering defect: every failure is compared with monotonic `latestSeen`; exact Shared Files Guard `30171424913` passed.
- PR #322 adds a non-cancelling lock for equal raw automatic/manual deploy-run IDs; exact Shared `30171638400` and TTS `30171638405` passed.
- Issue #320 is correctly reopened because raw manual aliases such as whitespace/leading zeros can still acquire different locks for the same numeric run. PR #332 is the sole canonicalization owner.
- Exact production evidence remains `{PROD_SHA[:8]}`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS witness artifact `8622642553`, live pointer and run-addressed provenance.
- Historical automated ledger run `30169981463` remains failure; operator marker `5080203496` is transparent recovery evidence, not automated success.
- #292/#295 still own whole-release digest/provenance and build-once promotion.

## 2) Current active pull requests

Refresh before every action because parallel agents are active.

- **#309 — font integrity owner.** Head `c694b776` remains draft. Architecture is fail-closed/offline and should not be weakened. Exact control-plane artifact `8623016486` shows the current red is a stale expected-message regex after the verifier correctly names the canonical wrong `@font-face` candidate. Update the test expectation, rebase onto current main, then require all 28 real fonts, production-like build and Shared Guard green.
- **#324 — redirect-hop/source-link owner.** Head `a24bd78d`; static Source Link `30172153862` and Shared `30172153863` are green. Remaining acceptance requires malformed-input secret redaction, truthful blocked-hop evidence and an inspected exact manual/scheduled real-network artifact; mocked PR tests do not execute the real pinned lookup adapter.
- **#332 — canonical deployment-witness lock owner.** Head `a9d3f3e1`; Shared `30172042020` passed. TTS source contract `30172042018` is red because one `.replace(...)` mutation removes only the resolver assertion while the writer duplicate still satisfies an unbounded pattern. Preserve the two-stage architecture and mutation-test resolver/writer checks independently.

Closed/superseded convergence:

- #321 merged as `a105c354`; issue #318 closed.
- #322 merged as `853d9bc5`; it is an accepted intermediate raw-ID lock, not final canonical identity.
- #331 closed without merge as duplicate of stronger #332.
- Earlier temporary/validation carriers remain closed without merge.

## 3) Shared-surface ownership

- One active owner per shared surface.
- #309 alone owns font manifests, support manifests, generator/verifier and font workflow wiring.
- #324 alone owns source-link redirect/DNS policy and its workflow.
- #332 alone owns `deployment-witness-ledger.yml` and its source contract until canonical identity is green.
- Do not reopen #331 or create another deployment-witness concurrency lane.
- Before editing: refresh `main`, open PRs, changed filenames, active workflows and intersections.

## 4) CI status semantics

1. **product/system regression** — permanent exact-head contract fails;
2. **protective failure** — guard rejects unsafe ownership/temp writer;
3. **cancelled/superseded** — newer head/concurrency replaced it;
4. **fixture/expectation drift** — production invariant correctly fails but test expects obsolete wording or incomplete mutation;
5. **post-publish projection failure** — Pages may be healthy while repository metadata projection fails;
6. **real-network evidence gap** — deterministic mocks pass but live adapter/path has not been exercised.

Never make production validation permissive merely to turn a fixture green.

## 5) Active work, in order

1. **Finish the three exact owners**
   - #332: bounded resolver/writer mutations; full source/actionlint/Shared/TTS green; then merge and close #320.
   - #309: repair only the stale assertion, inspect the next exact artifact, rebase and require all gates.
   - #324: close redaction/hop-evidence gaps and import a real network artifact before merge.
2. **Reconcile AuditRepo immediately after each merge** without advancing production authority.
3. **Converge whole-release architecture (#292 + #295)**: build once, validate/digest/upload one candidate, deploy the same bytes, then live witness.
4. **Harden privileged control plane (#301 + #64)**: effective permission registry, immutable actions, capability-derived policy.
5. **Continue product preservation**: #298 owner-approved goldens, #299 homepage Chromium/WebKit contract.
6. **Genesis/Research**: one #287 finalizer only; Research #16 authority/supersession/rights manifest; draft/noindex by default.

## 6) Non-negotiable gates

- exact final head, not a cancelled predecessor;
- focused contract plus broad family regression;
- Shared Files Guard/control-plane/actionlint for workflow changes;
- relevant Native/Route/Visual/browser/PDF evidence;
- no `_temp-*` workflow/materializer in final scope;
- no guessed evidence, hidden test-only product override or semantic weakening;
- production authority advances only after exact readiness → same artifact deployment → live witness → truthful downstream record.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses and counters.
- `reverify/` owns immutable current-head witnesses; `incoming/` owns raw forensic evidence.
- Do not delete historical failed runs or relabel operator recovery as automated success.
"""
PROMPT_PATH.write_text(prompt, encoding="utf-8")

if OLD_REVERIFY.exists():
    OLD_REVERIFY.unlink()

reverify = f"""# Current-head reverify — `{SOURCE_SHA[:8]}` CI convergence

## Exact authorities

- Source main: `{SOURCE_SHA}`.
- Exact imported production authority: `{PROD_SHA}`.
- Production evidence remains readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS witness artifact `8622642553`, live pointer and run-addressed provenance.
- Current source is not claimed deployed.

## Source transitions

### Notifier ordering — closed

PR #321 merged as `a105c35482e7b5301e824e0098230b53bed48e6b`.

- `handleFailure()` now orders against `latestSeen || latestFailure`.
- delayed older attempt after recovery is ignored;
- duplicate recovery version is ignored;
- genuinely newer failure reopens the same machine-key issue;
- exact Shared Files Guard `30171424913` passed.

Canonical IDs: `CI-ALERT-NO-RECOVERY-STATE`, `CI-ALERT-POST-RECOVERY-ORDERING`.

### Deployment witness raw-ID serialization — intermediate closure

PR #322 merged as `{SOURCE_SHA}`.

- automatic/manual projection for the same raw target run ID shares one non-cancelling lock;
- exact Shared Files Guard `30171638400` passed;
- exact TTS Download Consent `30171638405` passed.

This closes the absent-lock race only. It does not close textual alias identity.

Canonical ID: `DEPLOY-WITNESS-RAW-RUN-CONCURRENCY`.

### Canonical run identity — open

Issue #320 is reopened and PR #332 is the sole owner.

- head at capture: `a9d3f3e1bcad20bb8afe799b094fb828cc832cad`;
- read-only resolver trims/validates input, resolves exact successful same-repository `main` Pages run and emits API `workflowRun.id`;
- privileged writer locks on `needs.resolve.outputs.run_id`, re-fetches and revalidates exact SHA before mutation;
- Shared Files Guard `30172042020` passed;
- TTS source contract run `30172042018` failed only because mutation `resolved workflow identity check removed` uses one `.replace`, removes the resolver assertion and leaves the writer duplicate satisfying an unbounded pattern;
- artifact `8623180869`, digest `sha256:1eed306374087c919719dc7aae7e2aa9adf16de45bb02704b1b50170f894561e` preserves the exact failure.

Required: independently bound resolver and writer identity/success/repository/SHA checks. Do not weaken defense in depth.

Canonical ID: `DEPLOY-WITNESS-CANONICAL-RUN-LOCK`.

## Active owners at capture

- #309 fonts — draft `c694b776`; exact artifact `8623016486` proves the remaining focused red is obsolete assertion wording after a correct canonical metadata failure.
- #324 source links — head `a24bd78d`; static Source Link `30172153862` and Shared `30172153863` pass, but real-network adapter evidence and evidence-redaction/hop truthfulness remain acceptance boundaries.
- #332 deployment witness canonical identity — sole owner.

PR #331 is closed without merge as duplicate of stronger #332.

## AuditRepo counters after this reconciliation

- closed: {closed_count};
- release-blocking P0/P1: {p0_count};
- P1: {p1_count};
- P2: {p2_count};
- P3: {p3_count};
- refactoring: {refactor_count};
- AuditRepo: {auditrepo_count};
- total open: {total_open}.

## Production boundary

The operator marker `5080203496` is truthful recovery evidence, not an automated success. Historical ledger run `30169981463` remains failed. Automated replay is unobserved. Whole-release identity/build-once remain #292/#295.
"""
NEW_REVERIFY.write_text(reverify, encoding="utf-8")

Path(__file__).unlink()
