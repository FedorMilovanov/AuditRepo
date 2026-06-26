# gb-is-my-strength / gospod-bog.ru

**Status: current-head re-verified / priority-reset in progress** (2026-06-27)

## Quick facts
- Source: `FedorMilovanov/gb-is-my-strength`
- Production: `https://gospod-bog.ru`
- Tech: Astro 5 + strangler pattern (root HTML + Astro dist)
- Premium controls: v16 SVG floating cluster (gb-icon, gb-ember, gb-save)

## Current-head note (2026-06-27)

⚠️ **Do not treat older aggregate bug counts in this folder as current operational truth.**

The project moved substantially after the 2026-06-25 synthesis wave. Current verifier position:
- use `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` as the primary current-head truth;
- use `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` for status flips and second-order defects;
- treat `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` as an important historical baseline, **not** as a pure present-state ledger.

## Current live themes (current HEAD)

1. **Workflow-policy mismatch:** `npm run workflows:check` is red while the broader publication gate is green.
2. **Partial route integration:** `/izbrannoe/` exists in source/UI but is not fully reconciled across migration/search/reference contracts.
3. **Gill convergence debt:** Gill pages still span more than one UI family / premium-control structure.
4. **Source-vs-built publication risk:** source-side fixes cannot automatically be treated as publication truth in this hybrid repo.
5. **Ledger / guard drift:** some canonical-looking docs and some guards now lag current architecture or current HEAD reality.

## Working documents

| File | Purpose |
|------|---------|
| `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` | **Primary current-head operational truth** |
| `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` | Status flips, stale-vs-live reset, second-order defects |
| `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` | Priority reset vs stale 2026-06-25 repair instincts |
| `working/STATUS_MATRIX_2026-06-27_current-head-verifier-grade.md` | Quick verifier-grade classification matrix |
| `working/ARENA_DEEP_REVERIFY_2026-06-27_systemic-desync-and-unfinished-implementation.md` | Deep analysis: desync, unfinished implementations, control-plane defects |
| `verified/UNIFIED_BUG_LEDGER_2026-06-25.md` | Historical baseline ledger from the 2026-06-25 synthesis wave |
| `verified/repair-order-unified-2026-06-25.md` | Historical prioritized fix plan from earlier wave |
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

## Current verifier status (2026-06-27)

**Primary current ledger:** `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`  
**Canonical verifier note:** `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md`  
**Priority reset:** `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md`

### Main live issues on current HEAD
- workflow-policy mismatch (`workflows:check` red while full publication gate is green)
- incomplete `/izbrannoe/` route integration across contracts
- Gill split-family convergence debt
- source-vs-built publication risk as an active repo class
- ledger/guard drift across documents and anti-regression logic

## Next step

Implementation and verifier agents should work from the **2026-06-27 current-head documents first**, and consult the 2026-06-25 ledgers only as historical baseline / context.
