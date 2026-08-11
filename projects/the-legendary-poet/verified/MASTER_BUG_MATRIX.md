# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.  
**Latest current verification:** `../verification/2026-08-11-community-write-integrity-current/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`; it is not duplicated into the active matrix.

## 🟠 P1 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ABUSE-001` | `CONFIRMED-CURRENT / PUBLIC-INTEGRITY / P1` | `../verification/2026-08-11-community-write-integrity-current/REPORT.md`; Product `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`: client-generated `voter_id` is the sole uniqueness/rate-limit identity for public rating/comment/helpful RPCs, while comments auto-publish | Put write abuse control behind a trusted server-side boundary that does not trust caller-rotatable UUIDs: server-verified challenge/session/throttle, preserve DB uniqueness as defense in depth, and add adversarial burst/rotated-UUID regression proof without requiring account registration. |

## 🟡 P2 — ОТКРЫТО (1)

| ID | Status | Current evidence | Required terminal outcome |
|---|---|---|---|
| `TLP-COMM-ACK-001` | `CONFIRMED-CURRENT / UX-HONESTY / P2` | `../verification/2026-08-11-community-write-integrity-current/REPORT.md`; `useCommunityFeedback.addComment()` returns `Комментарий добавлен` after durable local commit while remote outbox flush is still asynchronous | Split acknowledgement states into local-saved/queued/published (and local-only) semantics; only claim publication after remote success; preserve offline durability and add forced-remote-failure browser proof. |

## 🟢 P3 — ОТКРЫТО (0)

No verified-current P3 engineering rows.

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 1 |
| P2 открыто | 1 |
| P3 открыто | 0 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **2** |

Registered Product architecture lanes: **1 outside the defect matrix** — `TLP-HALL-001` / Product #369 is registered in Product source authority and advances through its own staged Hall-v3 gates. It is intentionally excluded from the engineering bug totals above.

## Explicitly outside this matrix

- `TLP-HALL-001` / Product #369 is an owner-selected architecture lane, not a verified engineering defect row. Its Product source registration and Hall v3 phase contracts are current; its exact production status remains governed by the Product repository and should not be inferred from this defect counter surface.
- Production Supabase variable values are deployment-side state and were not readable from repository source during the 2026-08-11 audit. The deploy workflow injects them optionally and the UI exposes local-vs-shared mode; inability to prove their current values is an evidence boundary, not an additional active defect row.
- Research/source-acquisition/editorial issues such as long-form authoring, archive acquisition, visual-rights review and myth ledgers are not engineering bugs merely because they remain open in the Product issue tracker.
- The Mayakovsky C01–C30 media family is closed for the current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.
- W0–W7 architecture/runtime waves, W6 ref retirement, native-scroll repair, canonical poet authority, semantic audit-harness hardening, Lenis install-dependency cleanup, browser-payload resilience, deterministic simultaneous cross-tab arbitration, precision-safe audio logical ordering and personal-archive cross-tab convergence are historical closure evidence, not current backlog.
- W3 community-scaling remains closed. `TLP-COMM-ABUSE-001` and `TLP-COMM-ACK-001` concern write-integrity/abuse authority and acknowledgement semantics rather than the closed target-read/pagination/persistence-scaling root.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when it is closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
