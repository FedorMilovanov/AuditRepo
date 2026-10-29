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

## 2026-10-29 — media runtime correctness

- Scope: encode/probe postconditions, duration authority, process ownership, transactional outputs and real-media CI execution.
- Signal class: Product / runtime / assurance.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: deterministic media contracts are strong; the only real encode/probe integration witness may silently skip.
- Source-repo evidence: explicit stream/duration/silence/tail guards and module-level FFmpeg/FFprobe skip without CI fail-fast provisioning.
- Regression witness: 129 focused tests PASS; real LiveDub media integration SKIP due absent tools in the clean audit environment.
- Live evidence: exact-main CI jobs are green, but success metadata cannot distinguish this explicit skip; no audible/provider claim made.
- Detailed evidence: [`wave 4`](../verification/2026-10-29-wave-4-media-runtime/REPORT.md).

## 2026-10-29 — publication transactions

- Scope: Telegram publication ordering, companion cache commit, rollback, single-flight and source-audio deferral.
- Signal class: Product / runtime / publication.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: explicit commit-after-complete design retained; one pre-ownership rollback hole proven.
- Source-repo evidence: helper validates returned `audio.file_id` before caller appends the visible message to its rollback list.
- Regression witness: 68 focused delivery/transaction tests PASS; executable empty-file-ID probe yields `sent 1`, `deleted []`, `rolled back=0/0`.
- Live evidence: no Telegram credentials or messages used; network ambiguity remains separately bounded.
- Detailed evidence: [`wave 5`](../verification/2026-10-29-wave-5-publication-transactions/REPORT.md).

## 2026-10-29 — operability and health semantics

- Scope: health/readiness, polling heartbeat, maintenance, owner alerting and restart policy.
- Signal class: Product / runtime / operability.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: structured health retained; inbound demand is incorrectly used as service-liveness evidence.
- Source-repo evidence: `record_update()` runs only on received updates while `collect_problems()` makes age above 300 seconds fatal.
- Regression witness: 60 focused tests PASS; pure healthy-state probe with one old update returns `503 ['updates_stale']`.
- Live evidence: no production monitor or bot process mutated.
- Detailed evidence: [`wave 6`](../verification/2026-10-29-wave-6-operability-health/REPORT.md).

## 2026-10-29 — Telegram HTML and length safety

- Scope: escaping, entity/tag-safe trimming, Telegram UTF-16 limits and archive-derived output.
- Signal class: Product / runtime / presentation.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: escaping is strong; shared message trimming uses the wrong width model.
- Source-repo evidence: `_html_message_limit` budgets with Python `len()` while caption code already uses UTF-16-aware `visible_length`.
- Regression witness: 29 focused tests PASS; emoji archive probe returns Python length 3560 but UTF-16 width 6791.
- Live evidence: deterministic Telegram boundary proof; no message was sent.
- Detailed evidence: [`wave 7`](../verification/2026-10-29-wave-7-telegram-html/REPORT.md).

## 2026-10-29 — generated-content quality

- Scope: prompt leakage, канцелярит, theological terms, title policy, Synopsis/Study/Reflection, glossary, Telegraph repair and publication completeness.
- Signal class: Product / content / deterministic assurance.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: no new deterministic root; existing content architecture has broad behavior-level guards.
- Source-repo evidence: anti-leakage, source-specific synthesis, transcript fidelity, multipart navigation, title fallback and repair-history contracts.
- Regression witness: 419 focused semantic tests PASS.
- Live evidence: provider output unavailable; runtime quality remains owned by the existing canary residual.
- Detailed evidence: [`wave 8`](../verification/2026-10-29-wave-8-content-quality/REPORT.md).
