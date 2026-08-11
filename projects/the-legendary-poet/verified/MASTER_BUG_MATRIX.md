# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-11-community-reconciliation-readstate-current/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`; it is not duplicated into the active matrix.

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `CONFIRMED-CURRENT / PUBLIC-INTEGRITY / P1` | `../verification/2026-08-11-community-write-integrity-current/REPORT.md`; Product `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`: client-generated `voter_id` is the sole uniqueness/rate-limit identity for public rating/comment/helpful RPCs, while comments auto-publish | Put write abuse control behind a trusted server-side boundary that does not trust caller-rotatable UUIDs: server-verified challenge/session/throttle, preserve DB uniqueness as defense in depth, and add adversarial burst/rotated-UUID regression proof without requiring account registration. |

## 🟡 P2 — ОТКРЫТО (4)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-DELIVERY-001` | `CONFIRMED-CURRENT / DELIVERY-RECONCILIATION / SYSTEMIC / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; `../verification/2026-08-11-community-reconciliation-readstate-current/REPORT.md`; outbox stops on first failed RPC, has no timer/backoff/startup replay, treats all non-2xx as offline, client/server comment cooldown scopes differ, delivered comments remain in the persisted local mirror, and simultaneous tabs write one envelope without lossless arbitration | Implement typed delivery states/error classification, bounded retry/backoff plus startup replay, non-blocking permanent-failure handling, aligned rate-limit semantics, honest local/queued/published acknowledgements, post-success retirement/reconciliation of local comments so server moderation is authoritative, and lossless two-tab mutation arbitration. Add forced-failure, hidden-after-publish and simultaneous-offline-two-tab browser regressions. `TLP-COMM-ACK-001` and the moderation/cross-tab symptoms are absorbed here. |
| `TLP-COMM-ORDER-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; backend pages newest-first while default UI `Полезные` and kind filters sort/filter only the already-loaded subset | Make helpful ordering and active kind filtering corpus-truthful with server-supported stable sort/filter pagination, or explicitly scope the UI to loaded rows and provide direct filtered load-more; add an older-high-helpful multi-page browser regression. |
| `TLP-COMM-A11Y-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; rating/comment/helpful result messages use `ActionToast` without live-region/status semantics; comment sort selection is visual-only | Give mutation results a reusable live-status owner, expose sort selection programmatically, preserve native keyboard behavior, and add Chromium + WebKit accessibility regression proof for all three mutation families and sort state. |
| `TLP-COMM-READSTATE-001` | `CONFIRMED-CURRENT / READ-STATE-TRUTH / P2` | `../verification/2026-08-11-community-reconciliation-readstate-current/REPORT.md`; `CommunityPanel` can render an unavailable first comment page as `Комментариев пока нет`, while `PoetCommunitySummary` maps unresolved/failed summary reads to real-looking `0 оценок / 0 мнений` | Give all community consumers explicit loading/error/ready-empty/ready-data semantics; never coerce unresolved or failed remote reads to zero/empty; preserve loaded pages on pagination failure and add Chromium + WebKit cases for summary failure, initial-comments failure, partial aggregate/comments failure and genuine ready-empty. |

## 🟢 P3 — ОТКРЫТО (0)

No verified-current P3 engineering rows.

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 4 |
| P3 открыто | 0 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **5** |

Current architecture selection: **none**. Hall #369 is terminally closed and remains historical/frozen safety authority, not a current Product lane or defect row; see `../WORK_QUEUE.md` and its terminal Hall closure evidence.

## Explicitly outside this matrix

- Production Supabase variable values are deployment-side state and were not readable from repository source during the 2026-08-11 audit. The deploy workflow injects them optionally and the UI exposes local-vs-shared mode; inability to prove their current values is an evidence boundary, not an additional active defect row.
- Research/source-acquisition/editorial issues such as long-form authoring, archive acquisition, visual-rights review and myth ledgers are not engineering bugs merely because they remain open in the Product issue tracker.
- The Mayakovsky C01–C30 media family is closed for the current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.
- W0–W7 architecture/runtime waves, W6 ref retirement, native-scroll repair, canonical poet authority, semantic audit-harness hardening, Lenis install-dependency cleanup, browser-payload resilience, deterministic audio cross-tab arbitration, precision-safe audio logical ordering and personal-archive cross-tab convergence are historical closure evidence, not current backlog. Those closures do not imply lossless simultaneous community-envelope writes; that current witness is owned by `TLP-COMM-DELIVERY-001`.
- W3 community-scaling remains closed. The active community rows concern write authority, delivery/reconciliation, corpus ordering, read-state truth and accessibility semantics rather than the closed target-read/pagination/persistence-scaling root.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when it is closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
