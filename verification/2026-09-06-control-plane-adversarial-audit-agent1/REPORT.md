# Control-Plane Adversarial Audit — Agent 1 (AuditRepo CI & validation)

- **Date:** 2026-09-06
- **Auditor:** Arena Agent 1 of 5 (total AuditRepo audit)
- **Audited base:** `29450bf8dc3baa69289be770e3fbb64a1728dcee` (merge of #363), single-commit shallow checkout
- **Scope:** AuditRepo control plane only — `.github/workflows/**`, `scripts/` validation/checking code and its regression tests, this report
- **Out of scope (untouched):** Product repositories, both Product projects' `MASTER_BUG_MATRIX.md`, `WORK_QUEUE.md`, raw incoming reports, historical evidence, branch-retirement execution
- **Method:** baseline run of every applicable validator/test on the untouched checkout → implementation review → adversarial fixtures → reproduction tests → smallest systemic fixes with fails-before/passes-after regressions

---

## 1. Baseline (untouched checkout, exact commands and results)

| # | Command | Result |
|---|---|---|
| 1 | `python3 scripts/check_auditrepo_structure.py` | PASS (exit 0) |
| 2 | `python3 scripts/check_workflow_syntax_regression_test.py` | PASS (exit 0) |
| 3 | `python3 scripts/check_workflow_syntax.py` | PASS (5 workflows; PyYAML 6.0.3 checksum verified) |
| 4 | `python3 scripts/validate_audit_repo.py` | PASS (exit 0) |
| 5 | `python3 scripts/validate_audit_repo_regression_test.py` | PASS (exit 0) |
| 6 | `python3 scripts/scaffold_regression_test.py` | PASS (exit 0) |
| 7 | `python3 scripts/retire_reviewed_refs_regression_test.py` | PASS (exit 0) |
| 8 | `python3 scripts/matrix_coverage_regression_test.py` | PASS (exit 0) |
| 9 | `python3 scripts/check_matrix_coverage.py --verbose` (default project `gb-is-my-strength`) | PASS — 9 active ids, 0 problems, **1066 evidence-only ids** |
| 10 | `python3 scripts/matrix_coverage_contexts.py --json-out … --markdown-out …` | **"contexts: 0 unresolved IDs"** (exit 0) — see D1 |
| 11 | `python3 scripts/check_matrix_coverage.py --project projects/code-audit` | **exit 1** — `ORPHAN-ACTIVE-WORK: INSECURE-SHELL-INTERACTION` — see D2/R1 |
| 12 | `python3 scripts/check_matrix_coverage.py --project projects/the-legendary-poet` | PASS (24 active ids, 3 closed rows, 37 evidence-only) |
| 13 | `node --check scripts/repository_history_forensic_audit.mjs` (+ regression test) | PASS (exit 0) |
| 14 | `node -e "JSON.parse(require('node:fs').readFileSync('projects/gb-is-my-strength/verified/closed-unmerged-pr-dispositions.json','utf8'))"` | parse OK |
| 15 | `python3 -m py_compile scripts/*.py` | PASS (exit 0) |
| 16 | `git diff --exit-code` | clean (exit 0) |

Not executable offline at baseline: `repository_history_forensic_audit.mjs --strict` (needs live GitHub API + full remote refs). **Executed later the same session with full history — see §8: strict PASS on the live remote state.**

---

## 2. Verified defects (each reproduced before the fix, fixed, and covered by a fails-before/passes-after regression)

### D1 — `matrix_coverage_contexts.py` was a silent no-op (contract drift + silent empty corpus)
- **Class:** VERIFIED DEFECT
- **Where:** `scripts/matrix_coverage_contexts.py` vs `scripts/matrix_coverage_lib.py`; executed by `auditrepo-validate.yml`, `auditrepo-deep-audit.yml`, `auditrepo-ref-retirement.yml`
- **Mechanism:** the contexts tool read `build_report(...).get("unregisteredEvidence", [])`. A later engine refactor replaced the blocking `UNREGISTERED-EVIDENCE` model with non-blocking evidence-only diagnostics (documented in `projects/gb-is-my-strength/working/MATRIX_COVERAGE_CONTROL_PLANE_AUDIT_2026-08-01.md`, which still documents the old contract at line 111) and dropped the `unregisteredEvidence` return key — while keeping the occurrence-details computation dead. The `.get(..., [])` default swallowed the drift: every CI run printed `contexts: 0 unresolved IDs`, exited 0 and uploaded an empty artifact, while the real corpus had 1066 evidence-only IDs.
- **Reproduction (before fix):**
  ```bash
  python3 - <<'PY'
  import sys; sys.path.insert(0, 'scripts')
  from matrix_coverage_lib import build_report
  import pathlib
  r = build_report(pathlib.Path('projects/gb-is-my-strength'))
  print('unregisteredEvidence' in r, r['evidenceOnlyIds'])   # False 1066
  PY
  python3 scripts/matrix_coverage_contexts.py --json-out /tmp/c.json --markdown-out /tmp/c.md
  # → "contexts: 0 unresolved IDs", exit 0
  ```
- **Fix:** `build_report` again returns `unregisteredEvidence` (id + exact file/line/structural-context occurrences, built from the previously dead `evidence_details`); the contexts tool reads the key directly (a missing key now fails loudly instead of defaulting to empty) and caches file reads.
- **Regression:** `matrix_coverage_regression_test.py` asserts the entries, the contexts output (file/line/structural context/snippet), and the empty case after registration.

### D2 — coverage scope false-green: any project's matrix change validated only `gb-is-my-strength`
- **Class:** VERIFIED DEFECT
- **Where:** `.github/workflows/auditrepo-validate.yml` (trigger grep `(^|/)MASTER_BUG_MATRIX\.md$` + step running `check_matrix_coverage.py` with no `--project`)
- **Mechanism:** the trigger fired for **any** project's matrix change, then the step validated only the default corpus. A corrupted matrix in `code-audit` or `the-legendary-poet` passed CI green.
- **Reproduction (before fix):** the code-audit corpus is genuinely red on current main (`python3 scripts/check_matrix_coverage.py --project projects/code-audit` → exit 1, orphan `INSECURE-SHELL-INTERACTION`), yet the workflow logic for a PR changing only `projects/code-audit/verified/MASTER_BUG_MATRIX.md` ran the default-project check and exited 0:
  ```bash
  printf 'projects/code-audit/verified/MASTER_BUG_MATRIX.md\n' > /tmp/chg.txt
  grep -Eq '(^|/)MASTER_BUG_MATRIX\.md$|(^|/)finding-aliases\.json$|^scripts/(check_matrix_coverage|matrix_coverage_)|^\.github/workflows/auditrepo-deep-audit\.yml$' /tmp/chg.txt && echo RUN_MATRIX_COVERAGE=1
  python3 scripts/check_matrix_coverage.py --json-out /tmp/r.json; echo "default-project exit=$?"   # 0 → false green
  ```
- **Fix:** new testable resolver `matrix_coverage_lib.coverage_projects_for_changed_paths()` maps changed paths to the project corpora that must run; the workflow loops over the resolved corpora with per-project `report.json/log`, `contexts.json/md` artifacts, and refuses zero-work success when a coverage trigger resolves to no corpus.

### D3 — alias-registry path-filter gap (`finding-aliases.json` exists nowhere)
- **Class:** VERIFIED DEFECT
- **Where:** `auditrepo-validate.yml` trigger; real registry is `projects/<p>/verified/MATRIX_ID_ALIASES.json`
- **Mechanism:** the trigger alternation `(^|/)finding-aliases\.json$` references a filename that does not exist anywhere in the repository (`grep -rn finding-aliases` → only the workflow). A PR changing only `MATRIX_ID_ALIASES.json` set `RUN_MATRIX_COVERAGE=0` and skipped coverage entirely, even though a corrupted registry is a hard `FATAL` (exit 2) when the engine runs.
- **Reproduction (before fix):** trigger simulation (skips) + synthetic corpus with `{"aliases":{"ALIAS-ONE":{"status":"alias","canonical":"NO-SUCH-TARGET","reason":"drifted target"}}}` → `check_matrix_coverage.py --project project` → `FATAL: alias ALIAS-ONE targets unknown ID 'NO-SUCH-TARGET'` (exit 2).
- **Fix:** trigger anchored on `^projects/[^/_][^/]*/verified/(MASTER_BUG_MATRIX\.md|MATRIX_ID_ALIASES\.json)$`; the same regex drives the scope resolver.

### D4 — evidence-corpus path-filter gap (deleting row evidence stayed green)
- **Class:** VERIFIED DEFECT
- **Where:** `auditrepo-validate.yml` trigger (watched only matrix/aliases/engine)
- **Mechanism:** deleting an evidence file referenced by an active row produces `BROKEN-EVIDENCE-PATH` + `ORPHAN-ACTIVE-WORK` (exit 1) when coverage runs — but an evidence-only change never triggered the step.
- **Reproduction (before fix):** synthetic corpus: with `verification/current.md` present → `OK` (exit 0); after `rm project/verification/current.md` → 2 problems, exit 1 — while the old trigger computed `RUN_MATRIX_COVERAGE=0` for a PR deleting only that file.
- **Fix:** trigger extended to `^projects/[^/_][^/]*/(reverify|verification|incoming|working|legacy|archive)/` — matching the step's own name ("matrix/**evidence** owners") and the operating model's automation contract ("глубокий matrix/evidence forensic — только когда меняются соответствующие owners"). Evidence additions cannot create problems (IDs are non-blocking evidence-only diagnostics); deletions/moves now fail closed.

### D5 — validator accepted a project with no `MASTER_BUG_MATRIX.md` at all
- **Class:** VERIFIED DEFECT
- **Where:** `scripts/validate_audit_repo.py` (`validate_matrix_summary` returned silently when the matrix was missing); `check_auditrepo_structure.py` also did not require it
- **Mechanism:** deleting a project's entire active-work registry passed both checks — an incomplete repository state accepted as valid. The operating model requires exactly one active matrix per project ("одной активной problem matrix для каждого проекта").
- **Reproduction (before fix):** fixture project with all required dirs/READMEs but no `verified/MASTER_BUG_MATRIX.md` → `AUDITREPO VALIDATION: PASS` and `AUDITREPO STRUCTURE CHECK: PASS`.
- **Fix:** `validate_audit_repo.py` now fails with `<project>: missing verified/MASTER_BUG_MATRIX.md`. For `gb-is-my-strength` this was already caught indirectly (the coverage step runs on matrix deletion and fails `FATAL`); it is now caught uniformly for every project and before any conditional step.

### D6 — unvalidated scaffold tools: path traversal, junk dates, silent overwrite, never compiled
- **Class:** VERIFIED DEFECT (tool-contract drift vs. sibling scaffolders)
- **Where:** `scripts/scaffold_reverify.py`, `scripts/scaffold_retirement_review.py` (documented in `scripts/README.md`, but not compiled or executed by any workflow)
- **Mechanism:** unlike `scaffold_intake.py`/`scaffold_project.py`, these accepted any string: `python3 scripts/scaffold_reverify.py '../..' 2026-09-06 deadbeef` wrote **outside the repository root** (verified: `/tmp/reverify/…` created, exit 0); a traversal `bug_id` escaped `verification/retirement-reviews/`; dates like `2026-13-99` were accepted; existing files were silently overwritten.
- **Fix:** same safe-component + real zero-padded date validation as the sibling scaffolders, overwrite protection, `SystemExit(main())` contract; both scripts added to the validate workflow's "Compile core Python tools" step (closing the documented-but-never-checked gap).
- **Regression:** `scaffold_regression_test.py` now covers valid creation, all traversal rejections, invalid dates, missing projects, overwrite refusal and no-stray-files.

---

## 3. Fix regression proof (fails before / passes after)

New tests were run against the pristine pre-fix code (staged from `29450bf` into a temp tree):

| New regression suite | Against original code | Against fixed code |
|---|---|---|
| `matrix_coverage_regression_test.py` (extended) | **FAIL** — `ImportError: cannot import name 'coverage_projects_for_changed_paths'` (and `unregisteredEvidence` absent) | PASS |
| `validate_audit_repo_regression_test.py` (extended) | **FAIL** — deleted `MASTER_BUG_MATRIX.md` passed validation (`AUDITREPO VALIDATION: PASS` leaked through the assert) | PASS |
| `scaffold_regression_test.py` (extended) | **FAIL** — `AssertionError: existing reverify file was unexpectedly overwritten` (traversal cases follow) | PASS |

Workflow-step end-to-end simulation (exact `run:` block extracted from the edited YAML and executed locally with `AUDITREPO_CHANGED_PATHS_FILE` fixtures):

| Changed paths | RUN_MATRIX_COVERAGE | Corpora resolved | Step exit |
|---|---|---|---|
| `projects/code-audit/verified/MASTER_BUG_MATRIX.md` | 1 | code-audit | **1** (real orphan surfaced; was false-green 0) |
| `projects/gb-is-my-strength/verified/MATRIX_ID_ALIASES.json` | 1 (was **0**) | gb-is-my-strength | 0, contexts: 1066 IDs |
| `projects/the-legendary-poet/verified/MASTER_BUG_MATRIX.md` | 1 | the-legendary-poet | 0, contexts: 37 IDs |
| this PR's file set (engine+validator+workflow+report) | 1 | gb-is-my-strength | 0 |
| `projects/_templates/COMMENT_TEMPLATE.md` | 0 (correctly skipped) | — | — |
| `projects/stray-inbox/incoming/…` (no such project) | 1 | — | **1** — "refusing zero-work success" (fail-closed; the same PR also fails `validate_audit_repo.py` for the incomplete project) |

---

## 4. Findings refuted / not defects (FALSE POSITIVE after adversarial testing)

- **FP1 — pull_request merge-ref usage:** `auditrepo-validate.yml` diffs `HEAD^1..HEAD` on the PR merge ref (correct PR semantics); `auditrepo-ref-retirement.yml` cross-checks `github.event.pull_request.base.sha` against **live** main and fails closed on movement (`main moved before execution`), restricts the label channel to same-repo PRs, and `retire_reviewed_refs.py` re-verifies every target head SHA, protected refs, open-PR heads, required retained refs and unreviewed-branch appearance before the first DELETE, then verifies HTTP-404 absence afterward.
- **FP2 — retirement numeric/mode inputs:** missing/None `expectedAhead`, string/number mismatches, unsupported modes, empty target lists and duplicate branch names all fail closed (covered by `retire_reviewed_refs_regression_test.py`).
- **FP3 — workflow preflight:** vendor manifest+SHA-256 verification, duplicate-YAML-key detection, immutable action pins, single-document/jobs-shape checks and the strict-history `fetch-depth: 0` rule all fail closed; each has a regression fixture. All five current workflows pass it, including this PR's edit.
- **FP4 — generated-workspace poisoning:** `reports/` is rejected by the root-dir allowlist; the workflows either create reports **after** validation (`auditrepo-validate.yml`) or remove them before re-validating (`auditrepo-ref-retirement.yml`); `git diff --exit-code` guards tracked-tree mutation in every mutating workflow.
- **FP5 — empty-corpus handling in the engine itself:** duplicate matrix IDs → `FATAL` (exit 2); wiped compact sections → `STATE-ROW-MISSING`/`SECTION-COUNT-MISMATCH`; legacy matrix without counters → counter-missing failure; missing default-project matrix → `FATAL`. No zero-work success found in the engine — the zero-work bugs were the trigger scope (D2–D4) and the contexts contract (D1), now fixed.
- **FP6 — forensic strict summary:** non-integer/negative/float summary values are rejected by `strictSummaryProblems` (regression-covered), and all three workflows that invoke `--strict` check out with `fetch-depth: 0` (enforced by the preflight).

### Hardening-only observations (documented, deliberately not changed — no manufacturing)

- **H1:** on unmergeable PRs `refs/pull/N/merge` can lag the head, so changed-path capture reflects a stale merge. Bounded: conflicted PRs cannot merge, and conflict resolution triggers a fresh `synchronize` run (`cancel-in-progress` keeps the latest). Accepted risk.
- **H2:** `check_workflow_syntax.strict_history_checkout_error` matches the literal `repository_history_forensic_audit.mjs --strict`; an indirection (e.g. `$STRICT_FLAG`) would evade the fetch-depth check. No current workflow indirections.
- **H3:** `report_has_real_evidence` is an anti-scaffold gate, not a quality gate — a single uppercase-hyphen token satisfies it. Tightening risks false-reds on legitimate historical styles.
- **H4:** `check_auditrepo_structure.py` enforces a strict subset of `validate_audit_repo.py` (no `legacy/`, `DOC_MAP.md`, `WORK_QUEUE.md`, matrix). The union is enforced in CI; left as-is.
- **DUPLICATE check:** no cross-agent dedup possible from this lane; historical evidence-only IDs seen in the gb corpus (`SYS-AUDITREPO-WORKFLOW-PREFLIGHT`, `SYS-AUDITREPO-HISTORY-FORENSIC-DRIFT`, `AUDITREPO-VALIDATOR-ROOT-DIR-GAP`, …) are non-blocking evidence-only diagnostics and were not promoted or suppressed by this audit.

---

## 5. Remaining risks

1. **R1 — code-audit corpus debt (owner action required, outside this PR's ownership):** `INSECURE-SHELL-INTERACTION` is an active row with no evidence anywhere in the corpus (`check_matrix_coverage.py --project projects/code-audit` → exit 1 on current main). After D2, any PR touching the code-audit corpus will now (correctly) fail until the corpus owner adds current evidence or retires the row. `the-legendary-poet` is currently green.
2. **R2 — deep-audit scope:** the weekly `auditrepo-deep-audit.yml` job still smoke-tests only the canonical `gb-is-my-strength` corpus. Extending it to all projects is deliberately deferred (it would be permanently red until R1 is reconciled); this is recorded in the workflow comment.
3. **R3 — H1/H2/H3 accepted low-probability risks** (conflicted-PR staleness, preflight literal-match bypass, anti-scaffold-only report gate).
4. **R4 — trigger/resolver duplication:** the YAML grep and the Python resolver express the same rule in two places. The resolver is unit-tested and the zero-work guard converts any drift into a loud failure rather than a silent skip, but a future pattern edit must touch both.
5. **R5 — `RUN_REF_FORENSIC` trigger set** audited and found aligned (results dir, forensic scripts, dispositions ledger); not expanded (e.g. request-file changes do not trigger the strict live-graph audit — requests are inputs, results are proof, and execution owns the post-delete proof).

---

## 6. Files owned by this PR (complete list)

| File | Change |
|---|---|
| `.github/workflows/auditrepo-validate.yml` | D2/D3/D4 trigger + per-project coverage loop + zero-work guard; D6 compile list |
| `scripts/matrix_coverage_lib.py` | D1 `unregisteredEvidence` restoration; D2 `coverage_projects_for_changed_paths` |
| `scripts/matrix_coverage_contexts.py` | D1 loud contract + file-read cache |
| `scripts/validate_audit_repo.py` | D5 missing-matrix failure |
| `scripts/scaffold_reverify.py` | D6 validation hardening |
| `scripts/scaffold_retirement_review.py` | D6 validation hardening |
| `scripts/matrix_coverage_regression_test.py` | D1/D2 regressions |
| `scripts/validate_audit_repo_regression_test.py` | D5 regression |
| `scripts/scaffold_regression_test.py` | D6 regressions |
| `verification/2026-09-06-control-plane-adversarial-audit-agent1/REPORT.md` | this report (new) |

Not touched: `projects/**` (all projects, all matrices, WORK_QUEUEs, incoming, evidence), `MASTER_BUG_MATRIX.md` files, `references/**`, other workflows, vendor manifest, root governance documents.

---

## 7. Exact validation results at the final head

Recorded in the PR body at the final head (all commands re-run after the final rebase/reconcile against `main`): structure check, workflow preflight (+regression), repository validation (+regression), scaffold regression, ref-retirement regression, matrix coverage regression, per-project coverage for `gb-is-my-strength` (green, 1066 evidence-only IDs with contexts) and `the-legendary-poet` (green, 37), `code-audit` documented red (R1), node syntax checks + forensic regression, dispositions JSON parse, `py_compile` of all scripts including the two scaffolders, and `git diff --exit-code` clean.

---

## 8. Phase 2 addendum (same session, follow-up pass on the same PR)

After the first push, the checkout was unshallowed (`git fetch origin --unshallow '+refs/heads/*:refs/remotes/origin/*'`, 1491 commits, 48 remote branches) and the previously-unauditable surfaces were exercised.

### 8.1 Live strict forensic audit — PASS (baseline gap closed)

Executed exactly as the CI step does:

```bash
export GITHUB_TOKEN=… GITHUB_REPOSITORY=FedorMilovanov/AuditRepo
node scripts/repository_history_forensic_audit.mjs --strict
python3 - <<'PY'   # the workflow's own zero-debt enforcement
import json; from pathlib import Path
s = json.loads(Path('reports/repository-history-forensic-audit.json').read_text())['summary']
assert all(s[k] == 0 for k in ('inaccessibleClosedHeads','manualReviewCandidates','unexplainedRemoteBranches'))
PY
```

Result on the live remote (2026-09-06): **48 branches, 362 PRs, 60 closed-unmerged PRs; 0 inaccessible closed heads, 0 manual review candidates, 0 unexplained remote branches; strict exit 0; zero-debt check PASS.** Reconciliation breakdown: 1 main, 5 git-ancestor-of-main, 8 open-pr-head, 15 closed-superseded, 1 closed-diagnostic, 10 archived-recovery, 7 archived-source-ref, 1 diagnostic-transaction. The `Validate retirement result history` step and the deep-audit forensic job are therefore verified green against current reality, not just syntactically sound. (Environment note: the audit sandbox intercepts TLS, so Node needed `NODE_EXTRA_CA_CERTS` pointing at the sandbox CA — a sandbox artifact, not a repository defect; GitHub runners reach api.github.com directly.)

### 8.2 Historical instantiation of D2 (the false-green really happened)

Commit `0568fc6` (2026-08-19, *"verified: initialize master bug matrix for code-audit"*, on `origin/main`) changed **exactly one file** — `projects/code-audit/verified/MASTER_BUG_MATRIX.md` — and admitted the `INSECURE-SHELL-INTERACTION` active row that has no evidence anywhere in the corpus. The workflow at that commit already contained the any-project matrix trigger (line 43) and the default-only coverage step (line 143). Verified:

```bash
git show --stat 0568fc6                                   # 1 file: the code-audit matrix
git show 0568fc6:.github/workflows/auditrepo-validate.yml # trigger any-project; step runs default project only
python3 scripts/check_matrix_coverage.py --project projects/code-audit   # exit 1 (orphan row)
```

So the control plane green-lit a corpus admission it never inspected. The D2 fix makes exactly this change red.

### 8.3 Drift dating (full history)

- **D1:** `d7d5ed4` (2026-08-01, PR #113) introduced the `unregisteredEvidence` contract in both producer and consumer; `c3d6f84` (2026-08-07, PR #227, *"compact master into verified active work"*) removed the key from `matrix_coverage_lib.py` but left `matrix_coverage_contexts.py` reading it with a silent `.get(..., [])` default. The contexts artifact has been an empty no-op for **~1 month of CI runs** (validate on matrix changes, weekly deep audit, ref-retirement post-passes) while reporting success.
- **D3:** the governed registry `MATRIX_ID_ALIASES.json` was created `419e638` (2026-07-23). The coverage trigger was written `1fd204f` (2026-08-06, PR #196) referencing `finding-aliases.json` — a filename that **has never existed in any commit on any ref** (`git log --all -- '*finding-aliases.json'` is empty), and the real name never appeared in the workflow before this PR's fix. The registry was never trigger-covered from the day the pattern was written.

### 8.4 Additional edges probed in Phase 2 (no new defects)

- **Merge-ref assumptions vs real history:** for the real merge commit `29450bf` (PR #363), `git diff --name-only HEAD^1 HEAD` yields exactly the PR's two files; the root commit `24a1169` correctly falls back to `diff-tree`; squash-shaped commits diff correctly against their single parent. FP1 strengthened from code-reading to executed proof.
- **Retirement request deletion (push to main):** simulated the exact `Select exactly one reviewed request` bash in a scratch repo where C2 deletes `references/ref-retirement/requests/r1.json` → step exits 1 (`Expected one wrapper or one direct request, found 0`). The `paths:` filter matches deletions, so this is **correct retention-policy enforcement** (requests must be kept permanently), not a false red. A failing `git diff` inside the process substitution (e.g. zero `BEFORE_SHA` after force-push) degenerates to the same loud failure — never to a silent zero.
- **`crosswire_module_custody.py` (full review):** fail-closed end to end — HTTPS + CrossWire host allowlist re-checked after redirects, 32 MB cap, ZIP CRC validation, zip-slip member guards, exactly-one embedded conf, strict authority field pins, compact CI diagnostic on any exception, no writes outside `--output-dir`. Hardening-only gap: its pure helpers (`_safe_member`, `_parse_sword_conf`, `_normalize_text`) have no offline unit tests (the tool is a live-network verifier by design).
- **Forensic engine internals:** `reviewPriority` correctly escalates unclassified/parked closed-unmerged PRs without a reviewed ledger disposition into `manualReviewCandidates` (strict-red); `validateLedger` re-proves every ledger entry against live PR state, merged replacements, landed-commit ancestry and archive refs; non-strict mode intentionally only logs (documented in the workflow comment). Observations, not defects: closed-PR classification is keyword-heuristic with the reviewed ledger as authority (documented "Interpretation boundary"), and the disposition ledger path is hardcoded to the gb-is-my-strength lane (future TLP/code-audit retirement waves will need their own reviewed ledger or keyword evidence).
- **Offline-validation boundary (extends H3):** a matrix row can satisfy the direct-witness rule with any `verified-*` + 7–40-hex token (e.g. `verified-source deadbeef`), and intake anchors accept any concrete labelled value — the validators cannot prove SHA/artifact authenticity offline by design. Current corpora show no abuse; the boundary is the corpus owner's responsibility.

### 8.5 Phase 2 conclusion

No new verified defects. Phase 2 (a) converted the one baseline "not executable" item into a passing live verification, (b) produced executed/git-archaeological proof for D1–D3 (drift dates, phantom-filename proof, the historical false-green commit), and (c) refuted the remaining suspected false-red/false-green paths. The Phase 1 fix set stands as the complete defect list for this lane.

---

## 9. Phase 3 addendum (same session): regression-coverage pins for fail-closed enforcement

Phase 2 self-review surfaced that several **fail-closed enforcement paths had no regression fixtures at all**, including the most dangerous one: the destructive retirement engine's `superseded` mode (non-ancestor branch deletion) was completely untested. Classification: **HARDENING (missing regression coverage)** — the audited code is correct per review and live behavior; the gap was the absence of pins that would catch a future silent weakening. No new code defects.

### 9.1 New regression fixtures (test-only, no behavior change)

- `retire_reviewed_refs_regression_test.py`:
  - **superseded mode, happy path** (dry-run + execute): comparisonBase-ancestor proof, ahead-count evidence, normalized/sorted changed-path set, merged-replacement evidence, deletion limited to the reviewed target;
  - **four drift refusals, each proven to fail before the first DELETE**: ahead-count drift, changed-path-set drift, comparisonBase not an ancestor of main, no/none merged replacement PR;
  - **merged-source deletion**: source branch whose exact head is a merged PR head is deleted as `merged-maintenance-source` with PR evidence;
  - **mismatched-source refusal**: a source head that is only an older merged head (or an unmerged PR head) is refused and never deleted.
- `matrix_coverage_regression_test.py`: pins for the three ownership-enforcement primitives — `ORPHAN-ACTIVE-WORK` (active row with no evidence anywhere), `BROKEN-EVIDENCE-PATH` (row references a vanished evidence file; also orphaned), and the `verified-* <sha>` immutable direct-witness acceptance (`directWitnessedIds`, zero problems). Plus a case pinning the improved non-coverable-project-name error.
- `validate_audit_repo_regression_test.py`: pins that a generated `reports/` directory fails validation (`unexpected root directory: reports/`) — the exact invariant the ref-retirement workflow relies on when it removes generated diagnostics before re-validating.
- `matrix_coverage_lib.py` (only code change in Phase 3, diagnosability only): the fail-closed scope error now names matched-but-non-coverable project names (e.g. a path with a space, forbidden by the scaffold contract) instead of only reporting trigger/resolver drift.

### 9.2 Mutant proof — every new pin catches its targeted weakening

Each mutant was applied to a scratch copy of `scripts/` and the corresponding suite run against it:

| Mutant (weakening applied to the copy) | Result |
|---|---|
| `ORPHAN-ACTIVE-WORK` emission removed | **caught** — `KeyError: 'ORPHAN-ACTIVE-WORK'` |
| missing-evidence-file problem skipped (`BROKEN-EVIDENCE-PATH`) | **caught** |
| immutable `verified-*` witness disabled | **caught** (witnessed row becomes orphan → problems ≠ 0) |
| superseded ahead-count drift check removed | **caught** — "superseded drift unexpectedly passed: ahead count drifted" |
| superseded changed-path-set drift check removed | **caught** — "superseded drift unexpectedly passed: changed-path set drifted" |
| merged-source exact-head equality replaced with `True` | **caught** — "mismatched source branch head unexpectedly passed" |
| `reports/` added to `ALLOWED_ROOT_DIRS` | **caught** — "generated reports/ directory unexpectedly passed validation" |

### 9.3 Phase 3 conclusion

No new defects; the fail-closed semantics that Phases 1–2 depend on (and that D1–D4 unmasked as unenforced) are now pinned by tests that demonstrably fail under targeted weakening. Full battery re-run green after the additions (structure, preflight, validation, all five regression suites, per-project coverage, forensic regression, `py_compile`).
