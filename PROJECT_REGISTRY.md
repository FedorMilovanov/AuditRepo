# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **repair-ready** | Unified bug ledger with 51 confirmed bugs (9 P0, 18 P1, 16 P2, 8 P3) + 2 FP closed. Cross-reference synthesis done. Repair order ready. `arena-agent-2` amendment (1 FP + 2 root-cause corrections + 2 net-new bugs) pending review in `verification/arena-agent-2-corrections-2026-06-25.md`. |

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- **→ `repair-ready`** — unified ledger and repair order in `verified/` — implementation agent can proceed
- `archived` — проект завершён

## gb-is-my-strength summary

**Total confirmed bugs:** 51 (pre arena-agent-2 amendment)
**P0 critical:** 9 (fix immediately)
**Key finding:** P0-10 — All 36+ Astro components have stale hardcoded asset hashes (cache-busting completely broken for Astro-owned pages)

**Unified documents:**
- `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` — complete bug matrix
- `verified/repair-order-unified-2026-06-25.md` — prioritized fix plan
- `verification/cross-reference/cross-reference-synthesis-2026-06-25.md` — cross-agent findings merge
- `verification/CONFLICT_REGISTRY_2026-06-25.md` — disagreements between evidence layers / agents
- `verification/RECHECK_PROTOCOL_2026-06-25.md` — how to re-run disputed findings correctly
- `verification/arena-agent-2-corrections-2026-06-25.md` — root-cause corrections (PS-01, P0-1) + 1 FP flag (P0-2) + 2 net-new bugs (speed panel, sw-register toast)

**Incoming sources:**
- `incoming/arena-agent/2026-06-25/` — Arena Agent (premium surface, runtime, interactive audit)
- `incoming/arena-agent-round3/2026-06-25/` — Arena Agent Round 3 (system tooling, CI, Astro source-layer)
- `incoming/arena-agent-toc/2026-06-25/` — TOC agent intake
- `incoming/arena-agent-2/2026-06-25/` — Arena Agent 2 (runtime Node DOM-stub + root-source grep; cross-validation of P0/P1 + 2 new bugs)

## How to add a new project

1. Создать папку:
   - `projects/<project-name>/`
2. Создать подпапки:
   - `incoming/`
   - `working/`
   - `verified/`
3. Добавить `README.md` проекта
4. Внести запись в этот registry
5. При первом intake создать:
   - `incoming/<agent>/<YYYY-MM-DD>/README.md`
   - `working/CURRENT_INTAKE_INDEX_<YYYY-MM-DD>.md`

## gb-is-my-strength — updated 2026-06-25 (Verifier-2 merge)

**Total confirmed bugs:** 63  
**P0 critical:** 8 (PS-01 primary — fc-controller IIFE defect; P0-10 is systemic cache hash issue)  
**P1 high:** 22 (including V2-1, V2-2 new from Verifier-2)  
**P2 medium:** 21 (including V2-3, V2-4 new from Verifier-2)  
**P3 low:** 12  
**False positives closed:** 4 (P0-2, FP-P0-4, FP-P0-5, FP-PS-05)

**Key corrections from Verifier-2:**
- P0-2 is NOT empty — 1869 lines, 68KB CSS → removed from P0
- PS-01 root cause = lexical IIFE-scope defect (not load-order) — triple-confirmed
- P0-1 (Gill SAVE NOP) folds into PS-01
- 4 net-new bugs found (V2-1: Gill TOC anchors; V2-2: Nagornaya font; V2-3: Avraam skip-link; V2-4: feed.xml weekdays)

**Status:** repair-ready — unified ledger + repair order in `verified/`
