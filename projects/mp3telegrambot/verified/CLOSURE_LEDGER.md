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

## 2026-10-29 — history and rollback disposition

- Scope: full-history root attribution, refactor boundary and owner/collision census.
- Signal class: Product / history / ownership.
- Exact anchor: `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`.
- Result: roots span May–October mechanisms; no single final-refactor regression supports wholesale rollback.
- Source-repo evidence: line attribution for migration, publication, health, release and Telegram-boundary mechanisms.
- Regression witness: exact-head deterministic strengths and focused wave evidence retained.
- Live evidence: current owner/PR census repeated; no Product mutation performed.
- Detailed evidence: [`wave 9`](../verification/2026-10-29-wave-9-history-disposition/REPORT.md).

## 2026-11-27 — current source reconciliation of nine repaired roots

- Reviewed Product main: [`0ad3cd4a0e3504e1b77ea38e9e449a1fe821bd88`](https://github.com/FedorMilovanov/mp3telegrambot/commit/0ad3cd4a0e3504e1b77ea38e9e449a1fe821bd88). Original evidence remains anchored to `df1d6c67` (2026-10-29), not rewritten.
- Product corrective chain: [#427](https://github.com/FedorMilovanov/mp3telegrambot/pull/427), [`8f86ddc6`](https://github.com/FedorMilovanov/mp3telegrambot/commit/8f86ddc6f71cfde73b4da145fc518d1dbd05b922), [`798268db`](https://github.com/FedorMilovanov/mp3telegrambot/commit/798268dbe43e9fcd332ea94c949bbe02509820e1) (standalone media preflight), [`441fceba`](https://github.com/FedorMilovanov/mp3telegrambot/commit/441fceba6d92e08e71cfbf746c25d76c298c0dd1) (canary JSON guard). Initial `8f86ddc6` CI was red; successor [CI 40895757635](https://github.com/FedorMilovanov/mp3telegrambot/actions/runs/40895757635), Windows full suite and bootstrap succeeded. Latest inspected main [CI 44150451367](https://github.com/FedorMilovanov/mp3telegrambot/actions/runs/44150451367) at `b137382a6601a8165da92368ac44ee4c785353f8`: Python 3.12/3.13 tests, full strict typecheck on 3.12, Windows safety, media provenance, package and dependency jobs all succeeded. Current main is two commits ahead, with only `AGENTS.md` and `docs/agent_direct_dubbing/YOUTUBE_PRESENTATION_BY_SURFACE.md` changed. No claim of a new exact-current full CI run or live provider execution.

| Retired ID | Current implementation and regression witness |
|---|---|
| MP3-DEV-ENV-CONTRACT-001 | `AGENTS.md` documents `requirements-lock.txt` before `tools/verify_repo.py`; `tests/test_agent_contract.py::test_verifier_install_instructions_use_the_exact_lock`. |
| MP3-DB-MIGRATION-FAILOPEN-001 | `core/sqlite_schema.py` introspects via PRAGMA, adds only missing columns, asserts resulting columns; database initialization and schema owners use the helper. `tests/test_database_migrations.py` covers unexpected ALTER failure, idempotency, startup and introspection failure. |
| MP3-LIVEDUB-ROLLBACK-ORPHAN-001 | `services/livedub_delivery_coordinator.py` appends returned message before validating file_id; reverse rollback uses the owned list. `tests/test_explicit_livedub_delivery_transactions.py` tests empty file_id and explicit rollback failure. |
| MP3-HEALTH-QUIET-TRAFFIC-001 | `core/health_report.py` uses polling age, traffic age is informational; `services/polling_reliability_runtime.py` records only successful getUpdates responses. Quiet, stalled, empty poll and failed transport tests in `tests/test_observability_runtime.py` and `tests/test_polling_heartbeat.py`. |
| MP3-HTML-UTF16-LIMIT-001 | `handlers/commands.py` calls shared `safe_trim_caption` and `visible_length`; `tests/test_v3_patch25_archive_commands.py` tests astral emoji, entities, closing tags and archive output. |
| MP3-BOOTSTRAP-ASSURANCE-001 | `pyproject.toml` coverage includes main, bot_new, bot; `tools/check_types.py` uses whole-repository default; executable lifecycle and failure witnesses in `tests/test_main_orchestration.py`, `tests/test_bot_new_orchestration.py`. This is not a real-provider canary. |
| MP3-CI-RUNTIME-MAINT-001 | Current source census of all 20 workflow files found no mutable external action tags or moving hosted runner aliases; CodeQL v4, explicit Ubuntu 24.04/Windows 2025 and immutable pins. `tests/test_all_github_workflow_yaml.py` guards pins/runner labels. Future dependency updates are not revival of this old root. |
| MP3-RELEASE-PROVENANCE-001 | `.github/workflows/release.yml` verifies requested tag checkout and checks out verify-job commit SHA for build/publish; `tests/test_release_tag_provenance.py` tests divergent default branch, moved tag and annotated/lightweight tag binding. No release dispatched. |
| MP3-MEDIA-INTEGRATION-OPTIONAL-001 | CI installs and verifies pinned FFmpeg/FFprobe, sets `MP3_REQUIRE_MEDIA_INTEGRATION=1`; `tests/test_livedub_audio_media_integration.py` fails rather than skips missing tools in authoritative mode; `tests/test_media_tool_ci_contract.py` guards provenance/fail-closed behavior. Successful CI media and test steps observed. |

Disposition: nine bounded roots retired, `MP3-REFACTOR-CANARY-001` remains as the single narrowed residual. No credentials, real Telegram sends, provider billing, release or Product mutation performed. Current source/CI evidence does not establish a deployed runtime canary. Historical reports and original closure entries are preserved.
