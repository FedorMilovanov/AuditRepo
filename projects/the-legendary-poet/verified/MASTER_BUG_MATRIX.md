# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`; it is not duplicated into the active matrix.

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `CONFIRMED-CURRENT / PUBLIC-INTEGRITY / P1` | `../verification/2026-08-11-community-write-integrity-current/REPORT.md`; Product `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`: client-generated `voter_id` is the sole uniqueness/rate-limit identity for public rating/comment/helpful RPCs, while comments auto-publish | Put write abuse control behind a trusted server-side boundary that does not trust caller-rotatable UUIDs: server-verified challenge/session/throttle, preserve DB uniqueness as defense in depth, and add adversarial burst/rotated-UUID regression proof without requiring account registration. |

## 🟡 P2 — ОТКРЫТО (3)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-DELIVERY-001` | `CONFIRMED-CURRENT / DELIVERY-LIVENESS / SYSTEMIC / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; outbox stops on first failed RPC, has no timer/backoff/startup flush, treats all non-2xx as offline, while client/server comment cooldown scopes differ | Implement typed delivery states and HTTP/RPC error classification, automatic bounded retry/backoff plus startup replay, non-blocking handling of permanent poison operations, aligned rate-limit semantics, and honest local/queued/published acknowledgements. `TLP-COMM-ACK-001` is absorbed here. |
| `TLP-COMM-ORDER-001` | `CONFIRMED-CURRENT / DATA-PRESENTATION / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; backend pages newest-first while default UI `Полезные` and kind filters sort/filter only the already-loaded subset | Make helpful ordering and active kind filtering corpus-truthful with server-supported stable sort/filter pagination, or explicitly scope the UI to loaded rows and provide direct filtered load-more; add an older-high-helpful multi-page browser regression. |
| `TLP-COMM-A11Y-001` | `CONFIRMED-CURRENT / ACCESSIBILITY / P2` | `../verification/2026-08-11-community-delivery-ranking-a11y-current/REPORT.md`; rating/comment/helpful result messages use `ActionToast` without live-region/status semantics; comment sort selection is visual-only | Give mutation results a reusable live-status owner, expose sort selection programmatically, preserve native keyboard behavior, and add Chromium + WebKit accessibility regression proof for all three mutation families and sort state. |

## 🟢 P3 — ОТКРЫТО (0)

No verified-current P3 engineering rows.

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 3 |
| P3 открыто | 0 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **4** |

Current architecture selection: **none**. Hall #369 is terminally closed and remains historical/frozen safety authority, not a current Product lane or defect row; see `../WORK_QUEUE.md` and its terminal Hall closure evidence.

## Explicitly outside this matrix

- Production Supabase variable values are deployment-side state and were not readable from repository source during the 2026-08-11 audit. The deploy workflow injects them optionally and the UI exposes local-vs-shared mode; inability to prove their current values is an evidence boundary, not an additional active defect row.
- Research/source-acquisition/editorial issues such as long-form authoring, archive acquisition, visual-rights review and myth ledgers are not engineering bugs merely because they remain open in the Product issue tracker.
- The Mayakovsky C01–C30 media family is closed for the current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.
- W0–W7 architecture/runtime waves, W6 ref retirement, native-scroll repair, canonical poet authority, semantic audit-harness hardening, Lenis install-dependency cleanup, browser-payload resilience, deterministic simultaneous cross-tab arbitration, precision-safe audio logical ordering and personal-archive cross-tab convergence are historical closure evidence, not current backlog.
- W3 community-scaling remains closed. The active community rows concern write authority, delivery-state liveness, presentation truth and accessibility semantics rather than the closed target-read/pagination/persistence-scaling root.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when it is closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
