# gb-is-my-strength / gospod-bog.ru

**Status: repair-ready** (2026-06-25)

## Quick facts
- Source: `FedorMilovanov/gb-is-my-strength`
- Production: `https://gospod-bog.ru`
- Tech: Astro 5 + strangler pattern (root HTML + Astro dist)
- Premium controls: v16 SVG floating cluster (gb-icon, gb-ember, gb-save)

## Bug counts (confirmed)

| Severity | Count |
|----------|-------|
| P0 critical | 9 |
| P1 high | 13 |
| P2 medium | 15 |
| P3 low | 5 |
| **Total** | **42** (2 false positives closed) |

## Key findings

1. **P0-10:** All 36+ Astro components have stale hardcoded asset hashes — cache-busting broken for Astro-owned pages
2. **PS-01:** `qs is not defined` controller crash on 13 premium routes
3. **P0-6:** CI cascade race condition (indexnow.yml git push)
4. **P0-7 + P0-8:** site-layered.css + site-modules.js in SW precache but not in cache-bust

## Working documents

| File | Purpose |
|------|---------|
| `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` | Complete bug matrix (all agents) |
| `verified/repair-order-unified-2026-06-25.md` | Prioritized fix plan |
| `verification/cross-reference/cross-reference-synthesis-2026-06-25.md` | Cross-agent findings merge |
| `verification/CONFLICT_REGISTRY_2026-06-25.md` | Conflicting claims between agents / evidence layers |
| `verification/RECHECK_PROTOCOL_2026-06-25.md` | How to re-run disputed findings correctly |
| `verification/VERIFICATION_LEVELS.md` | Source/build/browser/prod-like evidence labels |

## Folder structure

```
incoming/
  arena-agent/          ← premium surface + runtime + interactive audit
  arena-agent-round3/   ← system tooling + CI/CD + Astro source-layer
working/
  ... synthesis in progress ...
verification/
  cross-reference/      ← unified synthesis
  ... conflict / recheck / evidence-level docs ...
verified/
  UNIFIED_BUG_LEDGER_2026-06-25.md
  repair-order-unified-2026-06-25.md
repairs/
  ... implementation-agent planning and patch tracking ...
reverify/
  ... current HEAD truth after source repo moves ...
archive/
  ... stale / fixed / historical bundles ...
```

## Intake rule

- `incoming/` не переписывать задним числом;
- каждый агент пишет в свою подпапку;
- сводка идёт только в `working/`, `verification/` или `verified/`.
- баг без `audited SHA` не должен считаться `repair-ready`.

## Агенты, внёсшие отчёты

| Агент | Папка | Дата | Метод |
|---|---|---|---|
| Arena Agent | `incoming/arena-agent/2026-06-25/` | 2026-06-25 | Playwright + production-like dist |
| Arena Agent TOC | `incoming/arena-agent-toc/2026-06-25/` | 2026-06-25 | Static source scan + git history |

## Текущий статус (2026-06-25)

**Финальный Bug Ledger:** `verified/BUG_LEDGER_2026-06-25.md`  
**Верификатор-синтез:** `working/VERIFIER_SYNTHESIS_2026-06-25.md`  
**Repair order:** `working/REPAIR_ORDER_DRAFT_2026-06-25.md`

### Подтверждённых багов: 12
- P0: 4 (body class mismatch, heart sans controller, Gill duplicate IDs, gill-context no Play)
- P1: 5 (cache-bust drift, readTime drift, baptisty BreadcrumbList, baptisty SVG og, sw precache)
- P2: 3 (tooling audit selectors)

### Needs-reverification: 1
- PS-01 (`qs is not defined`) — статически не воспроизводится, нужен Playwright на HEAD

### False positives: 1
- PS-05 (stray "76e7365") — не существует в HEAD

## Следующий шаг

Агент-исправитель берёт `verified/BUG_LEDGER_2026-06-25.md` и чинит в порядке фаз A→F из синтеза.

## Arena Agent TOC additions (2026-06-25)

**Верификация PS-* багов из incoming/arena-agent:**
- PS-01 (qs crash): needs-reverification — статически не воспроизводится в HEAD
- PS-04 (heart без контроллера): **CONFIRMED**
- PS-05 (stray 76e7365): **FALSE POSITIVE** в HEAD
- PS-06 (readTime 35 vs 50): **CONFIRMED**
- PS-07 (duplicate IDs Gill): **CONFIRMED**
- PS-10 (cache-bust drift): **CONFIRMED**

**Финальный Bug Ledger:** `verified/BUG_LEDGER_2026-06-25.md`  
**Верификатор-синтез:** `working/VERIFIER_SYNTHESIS_2026-06-25.md`
