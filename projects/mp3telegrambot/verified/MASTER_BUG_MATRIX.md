# MASTER BUG MATRIX — mp3telegrambot

> SSOT for current verified necessary work only. Current Product code, branches, CI and runtime remain owned by `FedorMilovanov/mp3telegrambot`.

## Current state

| Field | Value |
|---|---:|
| Active work units | **7** |
| Direct current defects | **2** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **1** |
| System verification lanes | **4** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 2

| ID | Current problem | Closure boundary | Evidence |
|---|---|---|---|
| `MP3-DEV-ENV-CONTRACT-001` | The documented `requirements-dev.txt` install does not reproduce the verifier environment: `colorama` is absent on Linux and the lock-metadata test false-reds; installing the exact lock makes the complete verifier pass. | Provide one documented clean install that passes `tools/verify_repo.py`, or make the metadata proof platform-aware without weakening CI lock closure. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |
| `MP3-DB-MIGRATION-FAILOPEN-001` | Required SQLite column migrations suppress every `OperationalError` as “already exists,” so lock/read-only/I/O/schema failures can be hidden until a later user path assumes the missing column. | Introspect/version schema, migrate missing columns transactionally, propagate unexpected failures and assert the post-migration schema before healthy startup. | [`wave 3`](../verification/2026-10-29-wave-3-process-persistence/REPORT.md) |

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why | Evidence |
|---|---|---|---|

## NARROWED RESIDUALS — 1

| ID | Current residual | Next boundary | Evidence |
|---|---|---|---|
| `MP3-REFACTOR-CANARY-001` | Deterministic exact-head evidence strongly rejects a wholesale rollback, but current-SHA real-provider end-to-end behavior is not independently witnessed. | Reuse sanitized current-SHA production telemetry or run an operator-safe canary across Telegram, Local Bot API, media, provider, publication/delivery and restart boundaries. Never store credentials or user media here. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |

## SYSTEM VERIFICATION LANES — 4

| ID | Verified work package | Next boundary | Evidence |
|---|---|---|---|
| `MP3-BOOTSTRAP-ASSURANCE-001` | The strict 241-module and 71.94% coverage claims omit root production entrypoints; `main.py` retains a 974-line orchestration function with little executable boundary coverage. | Add executable orchestration witnesses and bring the supported root path under typing/coverage, or establish a small typed/tested facade without fake readiness. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |
| `MP3-CI-RUNTIME-MAINT-001` | Exact-main annotations prove Node 20 action debt, CodeQL v3 deprecation, moving runner aliases and 55 mutable action tags. | Resolve current releases to immutable commits, pin a proven runner image and require completely green exact-head CI; do not import stale PR #203/#224 wholesale. | [`wave 1`](../verification/2026-10-29-wave-1-baseline/REPORT.md) |
| `MP3-RELEASE-PROVENANCE-001` | Manual release rebuild accepts a tag string but checks out/builds the workflow run ref; same-version divergent `main` can pass tag/version checks without proving artifact bytes came from the tag commit. | Checkout and peel the requested tag, bind verify/build/publish to one exact SHA, and add a negative divergent-ref test. | [`wave 2`](../verification/2026-10-29-wave-2-security-release/REPORT.md) |
| `MP3-MEDIA-INTEGRATION-OPTIONAL-001` | Real FFmpeg media integration silently becomes a successful pytest skip when FFmpeg/FFprobe are absent; required CI does not provision or fail-fast on the tool boundary. | Pin/prove media-tool provenance and make the authoritative integration lane fail when real encode/probe execution is unavailable. | [`wave 4`](../verification/2026-10-29-wave-4-media-runtime/REPORT.md) |

## OWNER DECISIONS — 0

| ID | Missing decision | Evidence |
|---|---|---|

## Current disposition

The recent refactor is not a rollback candidate on available evidence. Product mutation must remain collision-aware because another agent is active; re-read current Product heads and owners before every repair or merge decision.