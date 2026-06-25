# Project Registry

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **repair-ready** | Unified bug ledger with 51 confirmed bugs (9 P0, 18 P1, 16 P2, 8 P3) + 2 FP closed. Cross-reference synthesis done. Repair order ready. |

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- **→ `repair-ready`** — unified ledger and repair order in `verified/` — implementation agent can proceed
- `archived` — проект завершён

## gb-is-my-strength summary

**Total confirmed bugs:** 40  
**P0 critical:** 9 (fix immediately)  
**Key finding:** P0-10 — All 36+ Astro components have stale hardcoded asset hashes (cache-busting completely broken for Astro-owned pages)

**Unified documents:**
- `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` — complete bug matrix
- `verified/repair-order-unified-2026-06-25.md` — prioritized fix plan
- `verification/cross-reference/cross-reference-synthesis-2026-06-25.md` — cross-agent findings merge
- `verification/CONFLICT_REGISTRY_2026-06-25.md` — disagreements between evidence layers / agents
- `verification/RECHECK_PROTOCOL_2026-06-25.md` — how to re-run disputed findings correctly

**Incoming sources:**
- `incoming/arena-agent/2026-06-25/` — Arena Agent (premium surface, runtime, interactive audit)
- `incoming/arena-agent-round3/2026-06-25/` — Arena Agent Round 3 (system tooling, CI, Astro source-layer)
