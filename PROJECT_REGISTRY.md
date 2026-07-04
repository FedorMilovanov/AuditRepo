# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
`projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **reverify-needed** | ⚠️ P0 CI blocker open (BUG-CI-001: deploy.yml duplicate `run:` key disables submenu audit). Latest source HEAD: `e5942361`. 16 open / 31 closed. Start from `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`. | (audit(gb): Pass 64 — deep CI audit) 

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- `repair-ready` — current operational truth reconciled; implementation agents may proceed
- `repair-in-progress` — implementation идёт, но reverify ещё не закрыло цикл
- `reverify-needed` — source repo ушёл вперёд, нужен новый HEAD-pass
- `archived` — проект завершён

## gb-is-my-strength current summary — 2026-07-05

**Current source HEAD:** `e5942361` (fix(images): Gill series image audit fixes)
**Current AuditRepo HEAD:** pending (Pass 64 — deep CI audit)
**Current status:** reverify-needed. P0 CI blocker open (BUG-CI-001).

### Current truth

- All runtime no-undef issues (`r`, `tt`, `SiteUtils`) — **fixed-current** on `19062297` and earlier.
- PremiumControls: `audit:premium-controls` 87/87 ✅. PC-CURRENT-06 (Gill mobile) verified passing.
- Hermeneutics floater canonical position is `8.5vw` desktop / `4.5vw` mobile.
- Deploy to GitHub Pages: **green** on auto-deploy #1329 (`43a515df`). All CI gates green.
- Gill v16 is current base.
- All remote branches merged into main. Zero stale branches in both repos.

### Open items

**P0 (blocking):**
- BUG-CI-001: deploy.yml duplicate `run:` key — submenu audit disabled (Pass 64)

**P1:**
- BUG-CI-002: `:light` validation skips 3 critical gates (Pass 64)
- BUG-CI-003: indexnow.yml push retry — silent failure (Pass 64)

**P2 (non-blocking):**
- BUG-011: CSS breakpoints (reclassified, no visual regression).
- BUG-ARCH-001: SW precache contradicts lazy search (Pass 64)
- BUG-SEO-001: IndexNow submit before Pages CDN propagation (Pass 64)
- P3: SVG dedup (advisory), social metadata bundle.
- P3/Refactor: site.js monolith, source maps, ES modules.
- AuditRepo: 3 infra items.

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

<!-- 2026-07-04: gb-is-my-strength P2-SEARCH-EAGER legacy DOM/data eager work partially fixed on source main `30b9fe46`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_search-legacy-lazy-init-30b9fe4.md. -->

<!-- 2026-07-04: gb-is-my-strength search-manifest generatedAt refreshed on source main `bdaf6e8a`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_search_manifest_generatedAt_fixed-bdaf6e8.md. -->

<!-- 2026-07-04: gb-is-my-strength P2-SEARCH-EAGER measured eager-load class fixed on source main `546f7016`; see projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-04_search-full-lazy-loader-546f701.md. -->
