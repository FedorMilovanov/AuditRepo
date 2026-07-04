# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
`projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active** | Pass 70 deep CSS review + Pass 65 verifier sync (2 independent BUG-CI-001 witnesses, NEW-59 genuinely fixed, orphan-image regression found+fixed same session). 57 open / 34 closed. Latest source HEAD: `8c318010`. Start from `verified/MASTER_BUG_MATRIX.md`. | (audit(gb): Pass 70 — CSS review + Pass 65 verifier sync merged)

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- `repair-ready` — current operational truth reconciled; implementation agents may proceed
- `repair-in-progress` — implementation идёт, но reverify ещё не закрыло цикл
- `reverify-needed` — source repo ушёл вперёд, нужен новый HEAD-pass
- `archived` — проект завершён

## gb-is-my-strength current summary — 2026-07-05 (Pass 70 + Pass 65 merged)

**Current source HEAD:** `8c318010` (merge: seo-fix-og-images lane — includes BUG-CI-001 CI fix, orphan-image regression fix, README anchor fix, /izbrannoe/ canonical fix, NEW-59 real image-resize fix)
**Current AuditRepo HEAD:** Pass 70 (deep CSS review) + Pass 65 (verifier sync — 2 independent BUG-CI-001 witnesses, NEW-59 reopened then genuinely fixed, 6 new findings, 1 new regression found+fixed same session)
**Current status:** active. All P0 blockers closed (2 independent witnesses). 4 source fixes shipped and re-verified this session (all gates green after each). Deep CSS audit (Pass 68-70) found significant technical debt (floating-cluster.css 106KB/524 !important, site.css 275KB minified) requiring dedicated refactor lanes — see MASTER_BUG_MATRIX.md.

### Current truth

- All runtime no-undef issues (`r`, `tt`, `SiteUtils`) — **fixed-current** on `19062297` and earlier.
- PremiumControls: `audit:premium-controls` 87/87 ✅. PC-CURRENT-06 (Gill mobile) verified passing.
- Hermeneutics floater canonical position is `8.5vw` desktop / `4.5vw` mobile.
- Deploy gate (`gill:pre-v16-submenu:audit`, 105 checks) re-confirmed wired correctly via independent `actionlint` re-run (0 issues, all 8 workflow files) on `8c318010`.
- `node scripts/audit-pro.js` on `8c318010`: 165 passed, 0 errors (was 3 errors mid-session due to a concurrent agent's incomplete orphan-image cleanup — found and fixed in the same pass, see MASTER_BUG_MATRIX.md Pass 65 §4).
- `npm run seo-audit` on `8c318010`: 0 errors, 0 warnings (NEW-59 genuinely fixed — image resized, not just relabeled).
- Gill v16 is current base.
- All remote branches merged into main. Zero stale branches in both repos.
- **Runtime layer confirmed solid across Pass 64-70 audits** — no crash bugs, no live-exploit XSS, no visual-parity regressions. Open issues are CI-process, documentation, SEO/metadata-ledger, and CSS technical-debt (Pass 68-70).

### Open items (see MASTER_BUG_MATRIX.md for full detail — 57 open / 34 closed)

**P1:** BUG-CI-002/003 (CI gate gaps), BUG-PERF-001 (memory leaks), BUG-CSS-001/006/007/008/013/014 (CSS technical debt, Pass 68-70).
**P2:** BUG-011, BUG-ARCH-001, BUG-SEO-001, BUG-QUALITY-001/002/003, BUG-A11Y-001, BUG-PERF-002, BUG-CSS-002/003/009/010/015/016/017, NEW-CANONICAL-IZBRANNOE-01-GAP (tooling gap note, underlying bug fixed).
**P3:** BUG-SW-001, NEW-SAFEURL-XSS-HARDENING, BUG-SEO-002, BUG-CLEANUP-001..004, NEW-CSS-BUDGET-01, NEW-OG-SIZE-PARAM, NEW-ACTIONLINT-CI-GAP (high-leverage — recommend fast-track), 25 CSS/quality items from Pass 64-70.
**Refactor:** site.js monolith, source maps, ES modules, floating-cluster.css + site.css complete reorganization (Pass 68-70).
**AuditRepo:** 3 infra items.

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
