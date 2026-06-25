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

## Folder structure

```
incoming/
  arena-agent/          ← premium surface + runtime + interactive audit
  arena-agent-round3/   ← system tooling + CI/CD + Astro source-layer
working/
  (legacy from first agent)
verified/
  UNIFIED_BUG_LEDGER_2026-06-25.md
  repair-order-unified-2026-06-25.md
verification/
  cross-reference/      ← unified synthesis
```

## Baptisty-rossii note

Content in baptisty-rossii/ is known placeholder — not a bug, will be filled later.
