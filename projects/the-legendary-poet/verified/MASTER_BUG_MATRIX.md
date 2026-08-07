# Active Bug Matrix — The Legendary Poet

**Role:** current verified engineering work only.  
**Owner of current source truth:** `FedorMilovanov/TheLegendaryPoet`.  
**Historical matrix:** `../archive/superseded/MASTER_BUG_MATRIX_2026-08-05.md`.  
**Consolidation evidence:** `../verification/2026-08-07-matrix-consolidation/REPORT.md`.

This file is intentionally short. Closed, absorbed, stale, invalid and superseded findings do not remain here merely to preserve history. The section/count shape below is retained because AuditRepo's shared validator treats `verified/MASTER_BUG_MATRIX.md` as a machine-readable counter surface.

## ✅ ЗАКРЫТО (0)

Closed history is owned by `CLOSURE_LEDGER.md`, `SYSTEM_THEMES.md`, verification packages and `archive/`; it is not duplicated into the active matrix.

## 🟠 P1 — ОТКРЫТО (0)

No verified-current P1 engineering rows.

## 🟡 P2 — ОТКРЫТО (1)

| ID | Status | Root cause | Source owner | Next gate |
|---|---|---|---|---|
| TLP-RESILIENCE-001 | verified-current / repair-ready | Post-#350 browser essay payload integration makes `catalog.json` a route-wide homepage prerequisite even though the home route only needs its count, and caches rejected catalog/body promises for the whole SPA session so transient failures cannot retry without a document reload. | Product issue #351 | Preserve target-scoped generated payloads; localize homepage catalog Suspense/failure ownership; evict rejected catalog/slug promises; add deterministic failure→retry browser witnesses; full Product check/build/route/browser gates on one exact head. |

## 🟢 P3 — ОТКРЫТО (0)

No verified-current P3 engineering rows.

## Summary

| Категория | Количество |
|---|---:|
| Закрыто (fixed) | 0 |
| **P0 открыто** | **0** |
| P1 открыто | 0 |
| P2 открыто | 1 |
| P3 открыто | 0 |
| Рефакторинг | 0 |
| AuditRepo | 0 |
| **Всего открыто (матрица)** | **1** |

Registered Product architecture lanes: **0**. `TLP-RESILIENCE-001` is a bounded runtime-resilience repair and is not promoted to an architecture lane without separate proof.

## Explicitly outside this matrix

- Research/source-acquisition/editorial issues such as long-form authoring, archive acquisition, visual-rights review and myth ledgers are not engineering bugs merely because they remain open in the Product issue tracker.
- The Mayakovsky C01–C30 media family is closed for the current Product scope: 5 active, 1 verified reserve, 24 terminal exclusions, 0 unresolved.
- W0–W7 architecture/runtime waves, W6 ref retirement, native-scroll repair, canonical poet authority, semantic audit-harness hardening and the completed Lenis install-dependency cleanup are historical closure evidence, not current backlog.

## Lifecycle rule

`VERIFY → one root cause → one owner → PR → exact-head gates → Browser QA where behavior warrants it → merge → AuditRepo closure → remove from this matrix.`

A row leaves this file when it is closed, absorbed, invalid, stale, parked or converted into an owner decision. Durable evidence stays in the closure ledger, system themes, verification report or archive.
