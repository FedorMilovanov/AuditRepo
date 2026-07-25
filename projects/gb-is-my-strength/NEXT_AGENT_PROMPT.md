# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived. Bug status and counters belong to `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary, shared-surface ownership and next execution order.

**Source main:** `853d9bc5abbe653a23528e444a27689c0b6b8ce6`
**Exact imported production authority:** ✅ `f5e29998c5b42cc9e4e7c917b1e1c1072aa52320` for readiness, Pages, Pages artifact, live pointer/provenance and TTS capability witness.
**Current source deployment status:** ⚠️ `853d9bc5` is newer than the imported production witness and is **not** claimed deployed.
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-25_853d9bc5_ci-convergence.md`
**Immutable deep-audit intakes:** `incoming/auditor-brain/2026-07-25-r3/REPORT.md` and `incoming/auditor-brain/2026-07-25-r5/REPORT.md`

## 1) Exact boundary

- Source `main` is `853d9bc5` after merged PR #321 (`a105c354`) and PR #322 (`853d9bc5`).
- PR #321 closes the notifier post-recovery ordering defect: every failure is compared with monotonic `latestSeen`; exact Shared Files Guard `30171424913` passed.
- PR #322 adds a non-cancelling lock for equal raw automatic/manual deploy-run IDs; exact Shared `30171638400` and TTS `30171638405` passed.
- Issue #320 is correctly reopened because raw manual aliases such as whitespace/leading zeros can still acquire different locks for the same numeric run. PR #332 is the sole canonicalization owner.
- Exact production evidence remains `f5e29998`: readiness `30169126149`, deploy `30169443420`, Pages artifact `8622641548`, TTS witness artifact `8622642553`, live pointer and run-addressed provenance.
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
