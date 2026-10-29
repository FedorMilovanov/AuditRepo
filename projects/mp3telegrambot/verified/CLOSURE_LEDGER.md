# Closure Ledger — mp3telegrambot

## 2026-10-29 — baseline and refactor rollback disposition

- Scope: source shape, PR #425, the 385-commit refactor sequence, tests, typing, coverage, import boundaries, exact-head CI, current Product owners and branches.
- Signal class: Product / harness / control-plane / environment.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: wholesale rollback rejected; three verified engineering roots and one narrowed live-canary residual remain.
- Source-repo evidence: PR #425 merged at the exact source anchor; no human repair PR open; only stale/dependency PRs have unique branch commits.
- Regression witness: exact lock full verifier PASS; 4,487 tests; strict 241/241 module slice; import contract PASS; exact-head and post-merge GitHub checks green.
- Live evidence: deterministic/local/CI obtained; real-credential provider canary not claimed.
- Detailed evidence: [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md).

## 2026-10-29 — security and release provenance

- Scope: dependency/secret controls, subprocess and static security candidates, health exposure, workflow permissions and release artifact identity.
- Signal class: Product / control-plane / release.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: static security candidates reconciled without a direct exploit root; one manual-release provenance gap remains.
- Source-repo evidence: dependency audit, CodeQL and full-history gitleaks green; v4.0.0 tag-push release anchored correctly; workflow-dispatch path does not bind input tag to checkout SHA.
- Regression witness: full verifier PASS; Bandit candidates manually source-reviewed; no production `shell=True`, unsafe extraction or unbounded dynamic SQL identifier found.
- Live evidence: existing GitHub release/run metadata obtained; no destructive release action performed.
- Detailed evidence: [`wave 2`](../verification/2026-10-29-wave-2-security-release/REPORT.md).

## 2026-10-29 — process ownership and persistence

- Scope: cancellation, timeout, process-tree ownership, cleanup, SQLite connection policy and schema evolution.
- Signal class: Product / runtime / persistence.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: process ownership retained as a verified strength; required SQLite migrations remain fail-open.
- Source-repo evidence: centralized argv-only cancellable process runner and owned executor boundaries; broad `OperationalError` suppression around required column additions.
- Regression witness: 86 focused process/tree/cancellation/cleanup/migration tests PASS; full Ruff ASYNC scan has no blocking-call finding.
- Live evidence: not applicable; no Product process or database was mutated.
- Detailed evidence: [`wave 3`](../verification/2026-10-29-wave-3-process-persistence/REPORT.md).
