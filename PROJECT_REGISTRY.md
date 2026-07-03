# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **repair-ready-after-current-truth-cleanup** | Current operational truth is no longer the 2026-06-25 “60 confirmed bugs / 9 P0” ledger. Source HEAD checked: `66640561919501e68dd9d3cd290ff9afe53d3068`; AuditRepo HEAD before cleanup: `c3a9ae27df749c09a88650ae0e16e348db61c1c7`. Start from `projects/gb-is-my-strength/verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`. |

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- `current-head-reconciliation-needed` — source ушёл вперёд, active docs/ledgers ещё не сведены к одной правде
- **→ `repair-ready-after-current-truth-cleanup`** — current operational truth reconciled; implementation agents may proceed from current repair order, not old aggregate counts
- `repair-in-progress` — implementation идёт, но reverify ещё не закрыло цикл
- `reverify-needed` — source repo ушёл вперёд, нужен новый HEAD-pass
- `archived` — проект завершён

## gb-is-my-strength current summary — 2026-06-27

**Current source HEAD checked:** `66640561919501e68dd9d3cd290ff9afe53d3068`
**AuditRepo HEAD before cleanup:** `c3a9ae27df749c09a88650ae0e16e348db61c1c7`
**Current status:** repair-ready after current-truth cleanup; not old 2026-06-25 repair-ready.

### Active current truth

- `npm run workflows:check` on source HEAD passes; old `dist:jsonld:audit --root dist` workflow-red item is **fixed-current / stale-on-current-head**.
- Gill v16 is the current base; do **not** revert to legacy `gbs2-rail` / `gbs2-sheet` as target architecture.
- PremiumControls are partially green, not complete. PC-CURRENT-02/03/04/05/06 remain open unless a fresh source+dist+browser reverify closes them.
- Hermeneutics floater canonical position is `8.5vw` desktop / `4.5vw` mobile; old `calc(... - 28px)` is SUPERSEDED / WRONG / POS-01 / NEVER REINTRODUCE.
- Historical aggregate bug counts remain useful as evidence baseline only, not operational planning truth.

## Primary current documents

1. `projects/gb-is-my-strength/verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` — current-only operational truth.
2. `projects/gb-is-my-strength/verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` — current repair order.
3. `projects/gb-is-my-strength/verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` — status flips and stale/current classification.
4. `projects/gb-is-my-strength/PremiumControls/README.md` — PremiumControls current contract and open PC-CURRENT items.

## Historical / superseded baseline

The 2026-06-25 synthesis remains archived evidence, not active truth:

- `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- `verified/repair-order-unified-2026-06-25.md`
- `verification/cross-reference/cross-reference-synthesis-2026-06-25.md`
- older incoming agent folders under `projects/gb-is-my-strength/incoming/`

Do not promote “60 confirmed bugs / 9 P0 / repair-ready” into new prompts without the current-head ledger above.

## How to add a new project

1. Создать папку через scaffold:
   - `python3 scripts/scaffold_project.py <project-folder> --source-repo <owner/repo> [--production-url <url>]`
2. Убедиться, что создан `PROJECT_META.yml`
3. Внести запись в этот registry
4. При первом intake создать:
   - `python3 scripts/scaffold_intake.py <project> <agent> <YYYY-MM-DD>`
5. После первой verified-волны добавить:
   - `verification/START_HERE_<date>.md`
   - `verified/START_HERE_<date>.md`

<!-- 2026-07-03: gb-is-my-strength runtime no-undef fix verified on source lane `22eb0840`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_runtime-no-undef-fixed-22eb084.md. -->

<!-- 2026-07-03: gb-is-my-strength SW/Pagefind deploy-switch fixed on source main `d5c65647`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_sw-pagefind-bootstrap-fixed-d5c6564.md. -->

<!-- 2026-07-03: gb-is-my-strength /baptisty-rossii/ visual parity fixed on source main `914c7fb1`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_baptisty-visual-parity-fixed-914c7fb.md. -->

<!-- 2026-07-03: gb-is-my-strength deploy broad runtime smoke gate fixed on source main `8d0c12e0`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_dist-runtime-smoke-gate-fixed-8d0c12e.md. -->

<!-- 2026-07-03: gb-is-my-strength Baptisty root PremiumControls asset paths fixed on source main `932af3f3`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_baptisty-root-path-fix-932af3f.md. -->
