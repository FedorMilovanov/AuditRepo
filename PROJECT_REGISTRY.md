# Project Registry

Список проектов, которые проходят мультиагентные аудиты в этом репозитории.

## Active projects

| Project folder | Source repo | Status | Notes |
|---|---|---|---|
`projects/gb-is-my-strength/` | `FedorMilovanov/gb-is-my-strength` | **active / repair-in-progress** | 2026-07-06 fable-super-audit: единый консолидированный аудит + план волн W0–W10. Матрица: 87 закрыто / 37 открыто (P1×1, P2×9, P3×20, рефакторинг×4, AR×3) + системный бэклог в SUPER_AUDIT. Source HEAD: `14a49be8` (на проде, run 28794737410). Start: `verified/MASTER_BUG_MATRIX.md` → `verified/SUPER_AUDIT_2026-07-06_14a49be8.md`. |

## Status glossary

- `active` — проект в работе
- `intake-only` — сырые отчёты есть
- `verifying` — идёт сводка и дедупликация
- `repair-ready` — current operational truth reconciled; implementation agents may proceed
- `repair-in-progress` — implementation идёт, но reverify ещё не закрыло цикл
- `reverify-needed` — source repo ушёл вперёд, нужен новый HEAD-pass
- `archived` — проект завершён

## gb-is-my-strength current summary — 2026-07-06 (fable-super-audit)

**Current source HEAD:** `14a49be83ab57212c0bbd26a8249b75ac026511d` (Merge PR#48) — **на проде** (run `28794737410`, workflow_dispatch, success, артефакт `8110554604`).
**Current status:** active / repair-in-progress. Точечные баги — в матрице (87 закрыто / 37 открыто). Системная работа — волнами W0–W10 из `verified/SUPER_AUDIT_2026-07-06_14a49be8.md` (W0 гигиена правды выполнена 2026-07-06).

### Current truth (кратко)

- Прод = main; штатные гейты зелёные. НО: зелёный IndexNow-шаг ≠ принятая нотификация (`|| true`); транзакция релиза (валидированный/собранный/задеплоенный SHA) не гарантирована — W1.
- Массовые `modified_time 2026-07-06T02:10:54+03:00` на проде — техническая, не редакционная свежесть (петля bot-дат) — W2.
- In-flight зоны владельца: **PremiumControls/Gill** (freeze) и **глоссарий/Библия-тултипы** — не трогать без координации.
- Опровергнутые старые формулировки (lane-ветки, «64 bugs», quiz-хоткеи, «izbrannoe чист», «TTS надёжен» и др.) — см. SUPER_AUDIT §1; не переносить их дальше.

### Primary current documents

1. `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` — канон точечных багов.
2. `projects/gb-is-my-strength/verified/SUPER_AUDIT_2026-07-06_14a49be8.md` — канон системного бэклога + план волн.
3. `projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md` — handoff для следующего агента.
4. `projects/gb-is-my-strength/PremiumControls/README.md` — PremiumControls contract (in-flight, owner).

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
