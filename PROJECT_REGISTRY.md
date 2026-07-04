# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
| `projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **repair-ready** | Runtime P0 blockers closed. All CI-P0/P1 fixed. Deploy green on `932af3f3` (workflow_dispatch). Latest source main HEAD: `01ff5ce3`. Start from `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`. |

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- `repair-ready` — current operational truth reconciled; implementation agents may proceed
- `repair-in-progress` — implementation идёт, но reverify ещё не закрыло цикл
- `reverify-needed` — source repo ушёл вперёд, нужен новый HEAD-pass
- `archived` — проект завершён

## gb-is-my-strength current summary — 2026-07-03

**Current source HEAD:** `01ff5ce3` (auto cache-bust after SiteUtils fix)
**Current AuditRepo HEAD:** `8ecb405` (Pass 33 — SiteUtils fix record)
**Current status:** repair-ready. All P0 runtime blockers closed.

### Current truth

- All runtime no-undef issues (`r`, `tt`, `SiteUtils`) — **fixed-current** on `19062297` and earlier.
- PremiumControls: `audit:premium-controls` 87/87 ✅. PC-CURRENT-06 (Gill mobile) verified passing.
- Hermeneutics floater canonical position is `8.5vw` desktop / `4.5vw` mobile.
- Deploy to GitHub Pages: **green** on manual run (workflow_dispatch, `932af3f3`). Auto-deploy on latest `01ff5ce3` is pending.
- Gill v16 is current base.
- All remote branches merged into main.

### Open items (non-blocking)

- P2: Nagornaya `SiteUtils.themeKey` / `SiteUtils.copyText` — **fixed-current on `19062297`** (window. prefix added).
- P2/P3: code duplication in PageHead components, CSS breakpoint cleanup, SVG dedup.
- Prevention gap: runtime no-undef smoke not yet auto-gating deploy.

### Primary current documents

1. `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` — consolidated bug matrix.
2. `projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md` — top-block current handoff.
3. `projects/gb-is-my-strength/PremiumControls/README.md` — PremiumControls current contract.

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

<!-- 2026-07-04: gb-is-my-strength dist CSP form-action/karty CSP fixed on source main `14574a9a`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_dist-csp-form-action-fixed-14574a9.md. -->

<!-- 2026-07-04: gb-is-my-strength README version drift fixed on source main `da4a65cd`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_readme-version-drift-fixed-da4a65c.md. -->

<!-- 2026-07-04: gb-is-my-strength sitemap lastmod drift fixed on source main `a434b45e`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_sitemap-lastmod-fixed-a434b45.md. -->

<!-- 2026-07-04: gb-is-my-strength NEW-67 dead scripts reclassified as false-positive/manual tooling; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_dead-scripts-new67-reclassified.md. -->

<!-- 2026-07-04: gb-is-my-strength NEW-72 SVG dedup downgraded to P3 advisory; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_svg-dedup-new72-downgrade.md. -->

<!-- 2026-07-04: gb-is-my-strength NEW-59 hard-texts OG dimensions fixed on source main `c0ab48fc`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_hardtexts-og-dimensions-fixed-c0ab48f.md. -->
