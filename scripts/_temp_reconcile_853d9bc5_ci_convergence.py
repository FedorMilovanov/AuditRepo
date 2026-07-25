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


def replace_once(text, pattern, replacement, *, flags=0, label):
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return updated


def replace_row(text, finding_id, row):
    return replace_once(
        text,
        rf"^\| {re.escape(finding_id)} \|.*$",
        row,
        flags=re.MULTILINE,
        label=f"matrix row {finding_id}",
    )


matrix = MATRIX_PATH.read_text(encoding="utf-8")
if "733ba309e159023ae44682b7cb71b2c042cd8eb6" not in matrix:
    raise SystemExit("expected 733ba309 source boundary not found")
for finding_id in (
    "CI-ALERT-POST-RECOVERY-ORDERING",
    "DEPLOY-WITNESS-RAW-RUN-CONCURRENCY",
    "DEPLOY-WITNESS-CANONICAL-RUN-LOCK",
):
    if finding_id in matrix:
        raise SystemExit(f"{finding_id} is already canonical")

matrix = replace_once(
    matrix,
    r"^\| Source HEAD \|.*$",
    f"| Source HEAD | `{SOURCE_SHA}` (current source main; PR #321 fixed monotonic notifier transition ordering and PR #322 added a non-cancelling deployment-witness lock. Active owners at capture: #309 fonts, #324 redirect-hop policy, #332 canonical deployment-run lock identity) |",
    flags=re.MULTILINE,
    label="Source HEAD",
)
matrix = replace_once(
    matrix,
    r"^\| Deploy \|.*$",
    f"| Deploy | ⚠️ **SEPARATE AUTHORITIES.** Exact Pages/live/TTS production evidence remains imported for `{PROD_SHA[:8]}`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548` (`sha256:38a3a138…`), TTS witness artifact `8622642553` (`sha256:bacb0330…`), successful Pages deployment, exact live pointer and run-addressed provenance. Current source `{SOURCE_SHA[:8]}` is not claimed deployed. Operator marker `5080203496` remains transparent recovery evidence; automated replay is unobserved. Whole-release identity/build-once remain #292/#295. |",
    flags=re.MULTILINE,
    label="Deploy",
)
matrix = replace_once(
    matrix,
    r"^\| Last reverify \|.*$",
    "| Last reverify | `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md` |",
    flags=re.MULTILINE,
    label="Last reverify",
)
matrix = replace_once(
    matrix,
    r"^⚠️ Старые deploy-формулировки.*$",
    f"⚠️ Старые deploy-формулировки ниже исторические. Current source authority: `{SOURCE_SHA[:8]}`; exact imported Pages/live/TTS production authority: `{PROD_SHA[:8]}`. Current source is not claimed deployed. PR #332 remains the sole canonical-run concurrency owner; automated ledger replay and generic whole-release identity/build-once remain open. Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md`.",
    flags=re.MULTILINE,
    label="authority warning",
)

matrix = replace_row(
    matrix,
    "AUDIT-SSOT-CURRENT-HEAD-DRIFT",
    f"| AUDIT-SSOT-CURRENT-HEAD-DRIFT | ✅ **FIXED/RECONCILED AGAIN 2026-07-25.** Operational SSOT records source `main@{SOURCE_SHA[:8]}`, exact deployed authority `{PROD_SHA[:8]}`, merged notifier ordering PR #321, merged intermediate witness lock PR #322, sole canonical follow-up #332 and active #309/#324 ownership without conflating source, production, operator projection or automated replay. | `{SOURCE_SHA[:8]}` source + exact `{PROD_SHA[:8]}` production evidence |",
)
notifier_row = "| CI-ALERT-NO-RECOVERY-STATE | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** PR #308 replaced guessed one-way alerts with a factual workflow+identity lifecycle; commit `4f23a100` added the deployment-ledger edge. PR #321 then closed the post-recovery ordering residual by comparing every failure against monotonic `latestSeen`, with delayed-attempt/duplicate/newer-reopen fixtures and exact Shared Files Guard `30171424913`. | `a105c354` PR#321 |"
matrix = replace_row(matrix, "CI-ALERT-NO-RECOVERY-STATE", notifier_row)
matrix = replace_once(
    matrix,
    re.escape(notifier_row),
    notifier_row + "\n" +
    "| CI-ALERT-POST-RECOVERY-ORDERING | ✅ **FIXED/SOURCE+CI VERIFIED 2026-07-25.** Delayed failure attempts older than a recorded recovery can no longer reopen a closed machine-key alert. `latestSeen` is the global transition cursor; genuinely newer failures still reopen deterministically. | `a105c354` PR#321 |\n" +
    "| DEPLOY-WITNESS-RAW-RUN-CONCURRENCY | ✅ **FIXED AS INTERMEDIATE SOURCE BOUNDARY 2026-07-25.** PR #322 restored one non-cancelling lock across automatic/manual witness projection for the same raw target run ID; exact Shared `30171638400` and TTS `30171638405` passed. Textual aliases of the same numeric run remain a separate open canonicalization residual owned by #332/#320. | `853d9bc5` PR#322 |",
    label="closed convergence rows",
)

matrix = replace_row(
    matrix,
    "AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP",
    f"| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP | ✅ Exact readiness, Pages deployment, Pages/TTS artifacts, successful Pages deployment, live pointer and run-addressed provenance are imported for `{PROD_SHA[:8]}`. Operator comment `5080203496` carries the exact marker while preserving historical automated run `30169981463` as failure. Residual gap remains: automated replay is unobserved, current source `{SOURCE_SHA[:8]}` has no exact deployment witness, and generic whole-release digest/build-once remain #292/#295. | artifact `8622690663`; operator comment `5080203496`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md` |",
)
production_gap_row = next(line for line in matrix.splitlines() if line.startswith("| AUDIT-PRODUCTION-EVIDENCE-IMPORT-GAP |"))
canonical_lock_row = "| DEPLOY-WITNESS-CANONICAL-RUN-LOCK | Merged #322 serializes identical raw target IDs, but manual textual aliases such as whitespace/leading zeros can still identify the same numeric deploy run while acquiring different locks. PR #332 is the sole owner: a read-only resolver canonicalizes to API `workflowRun.id`, then the privileged writer locks on that output and revalidates exact run/SHA. Exact head `a9d3f3e1`; Shared `30172042020` passed, while TTS source contract `30172042018` remains red because one resolver/writer duplicate assertion mutation is vacuous. | source issue #320; PR #332; artifact `8623180869`; `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md` |"
matrix = replace_once(
    matrix,
    re.escape(production_gap_row),
    production_gap_row + "\n" + canonical_lock_row,
    label="canonical lock open row",
)

matrix = replace_once(matrix, r"^## ✅ ЗАКРЫТО \(155\)$", "## ✅ ЗАКРЫТО (157)", flags=re.MULTILINE, label="closed count")
matrix = replace_once(matrix, r"^## 🟠 P1 — ОТКРЫТО \(100\)$", "## 🟠 P1 — ОТКРЫТО (101)", flags=re.MULTILINE, label="P1 count")


def section_count(pattern):
    match = re.search(pattern, matrix, re.MULTILINE)
    if not match:
        raise SystemExit(f"missing section header {pattern}")
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
for pattern, replacement, label in [
    (r"^\| Закрыто \(fixed\) \| \d+ \|$", f"| Закрыто (fixed) | {closed_count} |", "stats closed"),
    (r"^\| \*\*P0 открыто\*\* \| \*\*\d+\*\* \|$", f"| **P0 открыто** | **{p0_count}** |", "stats P0"),
    (r"^\| P1 открыто \| \d+ \|$", f"| P1 открыто | {p1_count} |", "stats P1"),
    (r"^\| P2 открыто \| \d+ \|$", f"| P2 открыто | {p2_count} |", "stats P2"),
    (r"^\| P3 открыто \| \d+ \|$", f"| P3 открыто | {p3_count} |", "stats P3"),
    (r"^\| Рефакторинг \| \d+ \|$", f"| Рефакторинг | {refactor_count} |", "stats refactor"),
    (r"^\| AuditRepo \| \d+ \|$", f"| AuditRepo | {auditrepo_count} |", "stats AuditRepo"),
    (r"^\| \*\*Всего открыто \(матрица\)\*\* \| \*\*\d+\*\* \|$", f"| **Всего открыто (матрица)** | **{total_open}** |", "stats total"),
]:
    matrix = replace_once(matrix, pattern, replacement, flags=re.MULTILINE, label=label)

session_line = (
    f"- **2026-07-25 CI convergence (`{SOURCE_SHA[:8]}`)** — PR #321 merged monotonic notifier ordering; "
    "PR #322 merged an intermediate raw-ID witness lock; #320 reopened for canonical numeric identity and #332 is the sole owner. "
    "Duplicate #331 closed without merge. Production authority remains exact `f5e29998`; active source owners are #309/#324/#332."
)
matrix = replace_once(
    matrix,
    r"^(## Session log \(append-only\)\n)",
    r"\1\n" + session_line + "\n",
    flags=re.MULTILINE,
    label="session log",
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
- PR #321 closes notifier post-recovery ordering: every failure is compared with monotonic `latestSeen`; Shared `30171424913` passed.
- PR #322 adds a non-cancelling lock for equal raw automatic/manual deploy-run IDs; Shared `30171638400` and TTS `30171638405` passed.
- Issue #320 is reopened because whitespace/leading-zero aliases can still acquire different locks for the same numeric run. PR #332 is the sole canonicalization owner.
- Exact production remains `{PROD_SHA[:8]}`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS artifact `8622642553`, live pointer and run-addressed provenance.
- Historical ledger run `30169981463` remains failure; operator marker `5080203496` is recovery evidence, not automated success.
- #292/#295 still own whole-release identity and build-once promotion.

## 2) Current active pull requests

Refresh before every action because parallel agents are active.

- **#309 — font integrity owner.** Head `c694b776` remains draft. Keep the fail-closed/offline architecture. Artifact `8623016486` proves the current focused red is an obsolete expected-message regex after a correct canonical `@font-face` failure. Repair only the expectation, rebase onto current main, then require all 28 real fonts, production-like build and Shared Guard green.
- **#324 — redirect-hop/source-link owner.** Head `a24bd78d`; static Source Link `30172153862` and Shared `30172153863` are green. Remaining acceptance: malformed-input secret redaction, truthful blocked-hop evidence and an inspected exact manual/scheduled real-network artifact; mocks do not execute the real pinned lookup adapter.
- **#332 — canonical witness-lock owner.** Head `a9d3f3e1`; Shared `30172042020` passed. TTS source contract `30172042018` is red because one `.replace(...)` mutation removes only the resolver assertion while the writer duplicate still satisfies an unbounded pattern. Preserve the two-stage design and mutation-test resolver/writer checks independently.

Closed/superseded:

- #321 merged as `a105c354`; issue #318 closed.
- #322 merged as `853d9bc5`; accepted intermediate raw-ID lock, not final canonical identity.
- #331 closed without merge as duplicate of stronger #332.

## 3) Shared-surface ownership

- #309 alone owns font manifests/generator/verifier/workflow wiring.
- #324 alone owns redirect/DNS/source-link policy and workflow.
- #332 alone owns `deployment-witness-ledger.yml` and its source contract.
- Do not reopen #331 or create another concurrency lane.
- Refresh main, open PRs, changed paths and intersections before editing.

## 4) CI status semantics

1. product/system regression — permanent exact-head contract fails;
2. protective failure — guard rejects unsafe ownership/temp writer;
3. cancelled/superseded — newer head/concurrency replaced it;
4. fixture/expectation drift — invariant correctly fails but test expects obsolete wording or incomplete mutation;
5. post-publish projection failure — Pages may be healthy while metadata projection fails;
6. real-network evidence gap — deterministic mocks pass but live adapter has not been exercised.

Never weaken production validation merely to turn a fixture green.

## 5) Active work, in order

1. Finish #332: bounded resolver/writer mutations; exact source/actionlint/Shared/TTS green; merge and close #320.
2. Finish #309: repair stale assertion only, inspect next artifact, rebase and require all gates.
3. Finish #324: close redaction/hop-evidence gaps and import a real network artifact before merge.
4. Reconcile AuditRepo after each merge without advancing production authority.
5. Converge #292/#295: build once, validate/digest/upload one candidate, deploy identical bytes, then live witness.
6. Harden #301/#64; continue #298/#299; keep one #287 Genesis finalizer and Research #16 authority manifest.

## 6) Non-negotiable gates

- exact final head, not cancelled predecessor;
- focused contract plus broad family regression;
- Shared Files Guard/control-plane/actionlint for workflow changes;
- relevant Native/Route/Visual/browser/PDF evidence;
- no `_temp-*` workflow/materializer in final scope;
- no guessed evidence, hidden test-only override or semantic weakening;
- production authority advances only after exact readiness → same artifact deployment → live witness → truthful downstream record.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` remains static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns statuses and counters.
- `reverify/` owns immutable current-head witnesses; `incoming/` owns raw forensic evidence.
"""
PROMPT_PATH.write_text(prompt, encoding="utf-8")

if OLD_REVERIFY.exists():
    OLD_REVERIFY.unlink()

reverify = f"""# Current-head reverify — `{SOURCE_SHA[:8]}` CI convergence

## Exact authorities

- Source main: `{SOURCE_SHA}`.
- Exact imported production authority: `{PROD_SHA}`.
- Production evidence: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS artifact `8622642553`, live pointer and run-addressed provenance.
- Current source is not claimed deployed.

## Closed source transitions

### `CI-ALERT-POST-RECOVERY-ORDERING`

PR #321 merged as `a105c35482e7b5301e824e0098230b53bed48e6b`. `latestSeen` is now the global terminal-event cursor; delayed attempts/duplicates are ignored and genuinely newer failures reopen deterministically. Shared `30171424913` passed.

### `DEPLOY-WITNESS-RAW-RUN-CONCURRENCY`

PR #322 merged as `{SOURCE_SHA}`. Equal raw automatic/manual target IDs share a non-cancelling writer lock. Shared `30171638400` and TTS `30171638405` passed. This is an intermediate closure only.

## Open canonical identity residual

### `DEPLOY-WITNESS-CANONICAL-RUN-LOCK`

Issue #320 is reopened; PR #332 is the sole owner.

- head `a9d3f3e1bcad20bb8afe799b094fb828cc832cad`;
- read-only resolver canonicalizes to API `workflowRun.id`;
- privileged writer locks on the resolved output and revalidates run/SHA;
- Shared `30172042020` passed;
- TTS source contract `30172042018` failed because mutation `resolved workflow identity check removed` removes only the resolver assertion while the writer duplicate still satisfies an unbounded pattern;
- artifact `8623180869`, digest `sha256:1eed306374087c919719dc7aae7e2aa9adf16de45bb02704b1b50170f894561e` preserves the failure.

Required: independently bound resolver and writer identity/success/repository/SHA checks. Do not weaken defense in depth.

## Active owners

- #309 fonts — draft `c694b776`; artifact `8623016486` proves remaining focused red is obsolete assertion wording after a correct canonical metadata failure.
- #324 source links — head `a24bd78d`; Source Link `30172153862` and Shared `30172153863` pass; real-network adapter evidence and evidence redaction/hop truthfulness remain acceptance boundaries.
- #332 deployment witness canonical identity — sole owner. PR #331 is closed without merge.

## Counters

- closed: {closed_count};
- release-blocking P0/P1: {p0_count};
- P1: {p1_count};
- P2: {p2_count};
- P3: {p3_count};
- refactoring: {refactor_count};
- AuditRepo: {auditrepo_count};
- total open: {total_open}.

## Production boundary

Operator marker `5080203496` is recovery evidence, not automated success. Ledger run `30169981463` remains failed. Automated replay is unobserved. Whole-release identity/build-once remain #292/#295.
"""
NEW_REVERIFY.write_text(reverify, encoding="utf-8")
Path(__file__).unlink()
