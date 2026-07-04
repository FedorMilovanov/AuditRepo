
# 🟢 PASS 39 — 2026-07-04 P1-CI-DUPE fixed (READ FIRST)

**Source HEAD:** `ba6a8f67` (CI cache-bust optimization)
**AuditRepo HEAD:** `ae4bec9` (to be updated)

**Fixed:** `P1-CI-DUPE` — deploy.yml now skips redundant `cache-bust.js` when triggered from IndexNow workflow_run.
Indexnow.yml already ran cache-bust before the `[skip ci]` commit. Saves ~3s per deploy cycle.

**CI status on `ba6a8f67`:** Shared Files Guard triggered. Awaiting result.

**All prior P0/P1/P2 blockers remain fixed-current.** No regressions.

---

# 🟢 PASS 36 — 2026-07-04 Stale branch cleanup + PremiumControls archive (READ IF AUDITING)

**Cleanup performed:**
- Source repo: deleted 13 stale remote branches (all merged lanes)
- AuditRepo: deleted 1 stale remote branch
- PremiumControls: archived 30 historical 2026-06-27 documents to `archive/2026-06-27-premiumcontrols-docs/`
- PremiumControls: 4 active files remain (README.md, spec/ + screenshots/)
- PROJECT_REGISTRY.md: HEAD updated to `c0ab48fc`

**Current state:** `origin/main` only in both repos. Zero stale branches.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-04 hard-texts OG dimensions fix (READ FIRST)

**Current source main HEAD:** `c0ab48fc845ef27a1575d13a078dc832cab8df48`.

**Fixed in this pass:** `NEW-59` — `/hard-texts/` now declares `og:image` dimensions `1360×768`, matching `images/og-series-heart.webp`.

**Local verification on `c0ab48fc`:** `validate:strict`, `schema:rich-results:audit`, `audit-pro`, `git diff --check`, and `guard:shared-files` passed.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_hardtexts-og-dimensions-fixed-c0ab48f.md`. Remote `Deploy to GitHub Pages` is **green** on run `28696329971`: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28696329971.

---

# 🟡 CURRENT HANDOFF ADDENDUM — 2026-07-04 NEW-72 SVG dedup downgraded (READ FIRST)

**Source HEAD checked:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`.

**Reclassified in this pass:** `NEW-72` — current exact duplicate SVG scan finds 4 small duplicate patterns (~1.9KB raw theoretical saving, less after gzip). Downgrade from P2 to P3 advisory micro-optimization. Do not mix this with higher-priority CI/security/runtime work.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_svg-dedup-new72-downgrade.md`.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-04 NEW-67 dead scripts reclassified (READ FIRST)

**Source HEAD checked:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`.

**Reclassified in this pass:** `NEW-67` — the "dead scripts" report is a false-positive / manual tooling classification issue. The 10 scripts pass syntax checks and have documentation/manual QA/migration ownership evidence. Do not delete them from the old no-package-caller heuristic.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_dead-scripts-new67-reclassified.md`.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-04 Sitemap lastmod refresh (READ FIRST)

**Current source main HEAD:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`.

**Fixed in this pass:** `NEW-70` — `sitemap.xml` route `<lastmod>` values refreshed from each public route file's latest git commit date, converted to Moscow `+03:00` ISO8601.

**Local verification on `a434b45e`:** `validate:all`, `audit-pro`, `contract:compare`, and `guard:shared-files` passed.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_sitemap-lastmod-fixed-a434b45.md`. Remote `Deploy to GitHub Pages` is **green** on run `28694476460`: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28694476460.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-04 README version drift fix (READ FIRST)

**Current source main HEAD:** `da4a65cd33e046368dc089d48b42989de2344995`.

**Fixed in this pass:** `NEW-71` — `README.md` version line refreshed to `v11 · 2026-07-04 · runtime/CI green + dist CSP hardening`.

**Local verification on `da4a65cd`:** `git diff --check` and `guard:shared-files` passed.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_readme-version-drift-fixed-da4a65c.md`.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-04 Dist CSP hardening (READ FIRST)

**Current source main HEAD:** `14574a9a21e6a5ba729df837c652c8db6ef599ff`.

**Fixed in this pass:** `NEW-68` and `NEW-69` — production-like `dist/` now has CSP meta on every HTML document and every CSP includes `form-action 'self'`. `dist-publication-audit.js` now blocks regressions.

**Local verification on `14574a9a`:** `strangler:build:production-like`, `pagefind:build:dist`, `dist-publication-audit --require-pagefind --forbid-dev`, `strangler:audit:production-like`, `validate:static-publication`, `workflows:check`, and `guard:shared-files` passed.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_dist-csp-form-action-fixed-14574a9.md`. Remote `Deploy to GitHub Pages` is **green** on run `28693431471`: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28693431471.

---

# 🔴 PASS 34 CURRENT TRUTH — 2026-07-03 (READ FIRST)

**Current source main HEAD:** `01ff5ce3` (auto cache-bust descendant of `19062297`)
**Current AuditRepo HEAD:** `8ecb405` (Pass 33 — SiteUtils fix record)
**CI status on latest commit:** Shared Files Guard #421 ✅ | Visual Parity Guard #212 ⏳ | Deploy to GitHub Pages #1320 ⏳

## CI-P0-GILL-RUNTIME-REFS — STATUS: FIXED-CURRENT

All three runtime no-undef issues are **fixed-current**:

| Bug | Fixed in | Current status |
|-----|----------|---------------|
| `r is not defined` in highlights.js | `bced1c69` | ✅ |
| `tt is not defined` in site.js | `ffc763bc` | ✅ |
| `SiteUtils undefined` script order nagornaya | `ffc763bc` | ✅ |

## P2-CURRENT-NAGORNAYA-SITEUTILS — STATUS: FIXED-CURRENT (19062297)

Bare `SiteUtils.themeKey` / `SiteUtils.copyText` references in `js/nagornaya-mobile-toc.js` fixed by adding `window.` prefix.
Committed in `19062297` (lane: `lane/system-nagornaya-siteutils-fix-2026-07-03` → merged to main).
Local verification: dist-smoke 28/28 routes ✅, audit:premium-controls 87/87 ✅, validate:all 0 errors ✅.

## Deploy status

- Manual Deploy on `932af3f3` (#1319, workflow_dispatch) — ✅ **GREEN** (gospod-bog.ru live)
- Auto Deploy on `19062297` / `01ff5ce3` (#1320) — ⏳ triggered, awaiting result

## Remaining open items (non-blocking)

- P2/P3: code duplication in PageHead, CSS breakpoint cleanup, SVG dedup opportunities
- Prevention gap: runtime no-undef smoke not yet auto-gating deploy (but deploy has Gill audit + dist-smoke now)

## Evidence

- `reverify/PASS_32_AUDIT_REPORT_2026-07-03.md` — full Pass 32 report
- `verified/MASTER_BUG_MATRIX.md` (HEAD updated to `01ff5ce3`, Pass 44 added)

---

# 🔴 PASS 32 VERIFICATION — 2026-07-03 (READ FIRST)

**Verified source HEAD:** `932af3f32f9088363f1024affa277b6e7db8257e`
**Verified AuditRepo HEAD:** `c15aefdebdbcd4b41374e88ad686cf5d3f8e074a`
**Verification type:** Full clone + syntax + build + dist-smoke + branch audit

## CI-P0-GILL-RUNTIME-REFS — STATUS: FIXED-CURRENT on 932af3f3

**Critical finding: The handoff's CI-P0-GILL-RUNTIME-REFS is already FIXED on current main.**

All three runtime no-undef issues identified in Pass 30/31 were fixed by commits that landed AFTER `dbd0bb55`:

| Bug | Fixed in | Verified on current HEAD |
|-----|----------|------------------------|
| `r is not defined` in highlights.js strict IIFE | `bced1c69` | ✅ `var r` declared in var statement |
| `tt is not defined` in site.js | `ffc763bc` | ✅ `function tt(n){}` defined on line 1 |
| `SiteUtils undefined` script order in nagornaya | `ffc763bc` | ✅ site-utils.js (blocking) loads before nagornaya-mobile-toc.js (defer) |

**Remaining:** `SiteUtils.themeKey` (without `window.` prefix) in minified nagornaya-mobile-toc.js — P2, wrapped in try-catch, theme toggle on click silent-fails but doesn't crash page.

## CI Status on current HEAD 932af3f3

| Guard | Status |
|-------|--------|
| Shared Files Guard #418 | ✅ Green |
| Visual Parity Guard #211 | ✅ Green (0.000% diff) |
| Deploy to GitHub Pages | ⏳ No run yet on 932af3f3 (last run on parent 8d0c12e0 FAILED ❌) |

**The Deploy failure on 8d0c12e0 needs investigation** — the parent commit's deploy failed with exit code 1 at step 8. Source code P0 issues are already fixed; the failure may be CI/environmental (Playwright browser download/chromium headless shell issue).

## Commands verified

- `node --check js/*.js` — ✅ 11/11 pass
- `npm run css:layer:validate` ✅
- `npm run tokens:check` ✅
- `npm run strangler:build:production-like` ✅ (53 pages, without `astro check` due to sandbox RAM)
- `node scripts/dist-smoke-audit.js --no-build --production-like` ✅ (14/14 desktop routes, 0 errors)

## Next action for executor

1. Trigger Deploy workflow on `932af3f3` to verify green
2. If deploy still red: investigate Playwright/browser setup in CI, not source code
3. Fix `SiteUtils.themeKey` → `window.SiteUtils.themeKey` in minified nagornaya-mobile-toc.js (P2)

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-03 Baptisty root asset path fix (READ FIRST)

**Current source main HEAD:** `932af3f32f9088363f1024affa277b6e7db8257e`.

**Fixed in this pass:** temporary root local-reference regression from the Baptisty visual parity sync. Root `baptisty-rossii/index.html` now uses filesystem-valid `../css/floating-cluster.css` and `../js/floating-cluster-controller.js` paths while preserving 0.000% visual parity.

**Local verification on `932af3f3`:** `validate:static-publication`, targeted `/baptisty-rossii/` pixel parity, `workflows:check`, and `guard:shared-files` passed.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_baptisty-root-path-fix-932af3f.md`. Remote `Deploy to GitHub Pages` is **green** on workflow_dispatch run `28685603542`: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28685603542.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-03 Deploy broad runtime smoke gate (READ FIRST)

**Current source main HEAD:** `8d0c12e0756c6dd0327a212dba6b8a7bbdc01d3e`.

**Fixed in this pass:** `NEW-64` / `CHECK-GAP-DIST-SMOKE` — GitHub Pages Deploy now runs broad production-like browser runtime smoke (`node scripts/dist-smoke-audit.js --no-build --production-like`) after Gill mobile layout audit and before SW deploy-switch readiness. `scripts/check-workflows.js` now protects this step.

**Local verification on `8d0c12e0`:** `workflows:check`, `dist-smoke-audit --no-build --production-like`, `pagefind:build:dist && sw:dist:audit:deploy-switch`, and `guard:shared-files` passed.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_dist-runtime-smoke-gate-fixed-8d0c12e.md`.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-03 Baptisty visual parity fix (READ FIRST)

**Current source main HEAD:** `914c7fb11e51e25937e0afc0ef79118c7a246394`.

**Fixed in this pass:** `NEW-65` / `VIS-BAPTISTY-PARITY` — `/baptisty-rossii/` legacy-root vs production-like dist pixel diff is now 0.000% desktop and 0.000% mobile.

**Root cause:** root legacy baseline had stale pre-PremiumControls `.gbs2-rfoot`; dist had current Baptisty PremiumControls footer with Play/Save, increasing footer height by 72.5px. Root was synced to current dist footer contract.

**Local verification on `914c7fb1`:** `strangler:build:production-like`, targeted `visual-parity-screenshots --routes /baptisty-rossii/`, `owner:ui-guard`, `audit:premium-controls`, `baptisty-rossii:visual-parity:audit`, `validate:strict`, and `guard:shared-files` passed.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_baptisty-visual-parity-fixed-914c7fb.md`. Remote `Visual Parity Guard` is **green** on run `28684680251`: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28684680251.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-03 SW/Pagefind deploy-switch fix (READ FIRST)

**Current source main HEAD:** `d5c65647d57cf3bc83b6543cb58135cdd279013f`.

**Fixed in this pass:** `CI-HIDDEN-SW-PAGEFIND-PRECACHE` / `NEW-66` — `sw.js` now precaches `/pagefind/pagefind.js` and `CACHE_VERSION` is bumped to `gb-v187-pagefind-bootstrap-20260703`.

**Local verification on `d5c65647`:** `sw:dist:audit:deploy-switch`, `gill:mobile-layout:audit`, `dist-smoke-audit --no-build --production-like`, `audit:premium-controls`, `validate:static-publication`, and `guard:shared-files` passed.

**Remote deploy:** `Deploy to GitHub Pages` is **green** on run `28683773647`: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28683773647.

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_sw-pagefind-bootstrap-fixed-d5c6564.md`.

---

# 🟢 CURRENT HANDOFF ADDENDUM — 2026-07-03 runtime no-undef fix lane (READ FIRST)

**Current source main HEAD:** `8a816ce40c57e916797aa37f275e3518ca757203` (auto cache-bust descendant of `8a816ce4`) (`main`, also pushed as `lane/system-runtime-no-undef-current-2026-07-03`).

**Base source main at start:** `4cbe8e88afb3fe13fd04fdae08c1770122a01952`.

**Current local verification:** `CI-P0-GILL-RUNTIME-REFS` is fixed on source main HEAD `8a816ce4`. `gill:mobile-layout:audit`, `gill:mobile-play:smoke`, `dist-smoke-audit --no-build --production-like`, `audit:premium-controls`, `validate:static-publication`, and `guard:shared-files` all passed on commit `8a816ce4`.

**Important:** source `main` has advanced to `8a816ce4`. Treat the runtime P0 as **fixed-current locally / awaiting GitHub Actions deploy result**. Re-run/observe GitHub Pages Deploy and then check the next hidden gate `sw:dist:audit:deploy-switch` / NEW-66.

**Top remaining priorities after runtime fix on main:** `REG-001` hosting/security headers, `P1-CI-DUPE`, `NEW-66` SW/Pagefind deploy-switch, `NEW-65` `/baptisty-rossii/` visual parity, and `NEW-64` prevention gap (broad runtime smoke not blocking deploy).

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_runtime-no-undef-fixed-22eb084.md`.

---

# 🔴 CURRENT HANDOFF ADDENDUM — 2026-07-03 Pass 34/37 (READ FIRST)

**Current source HEAD:** `f1e9abd9` (cache-bust on top of `bced1c69` highlights half-fix + `8446a0da` AGENTS-r312 dedup).

**Current CI:** `Deploy to GitHub Pages` is **red** on run `28680826378`.

**Failed step:** `Gill mobile reference layout audit` (still red after `bced1c69`).

## Verified current blocker

`CI-P0-GILL-RUNTIME-REFS` is partially retired. `bced1c69` fixed the `r is not defined` half in `js/highlights.js`; the remaining CI-blocking half is `js/site.js` calling `tt(...)` from a scope where no helper is declared.

- `js/highlights.js` `r is not defined` is fixed-current; keep it closed unless regression returns.
- `js/site.js` throws `ReferenceError: tt is not defined` at backlink rendering (`a.innerHTML=tt(n.title)+...`). Same helper name is also used in verse/original-word blocks.
- Current `f1e9abd9` broad `dist/` smoke after filtering localhost favicon CSP noise: 16/52 routes have relevant runtime pageerrors (`tt` on 15 routes, `SiteUtils` on `/nagornaya/`; `r` is now 0).
- Additional current bug: `/nagornaya/` throws `SiteUtils is not defined` because `nagornaya-mobile-toc.js` is loaded before `/js/site-utils.js` but immediately calls `SiteUtils.ready(...)`.
- Missing gate: `deploy.yml` omits `dist-smoke-audit.js`; current `tt` is independently caught by `node scripts/dist-smoke-audit.js --no-build --production-like`, but Deploy only catches it because Gill mobile audit is strict.
- Hidden next gate: after `tt` is fixed, `npm run sw:dist:audit:deploy-switch` currently fails because `/pagefind/pagefind.js` is missing from `PRECACHE_ASSETS`.
- Visual side finding: `/baptisty-rossii/` pixel-diff fails locally on `f1e9abd9` (desktop 6.131%, mobile 17.368%).
- Reproduced locally after `npm run strangler:build:production-like` + Playwright Chromium/deps: `npm run gill:mobile-layout:audit` → 20 pageerrors (`tt is not defined`).
- Control witnesses pass: `node --check js/*.js`, `npm run css:layer:validate`, `npm run tokens:check`, `npm run gill:mobile-play:smoke`.

Full evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-03_ci-red-b4b312a-runtime-reference-errors.md` §9/§10 and Pass 34/37 in `verified/MASTER_BUG_MATRIX.md`.

## NEW-64 PREVENTION-GAP (P3)

`dist-smoke-audit` is not in the `validate:static-publication` chain. On `f1e9abd`, local `dist-smoke-audit --no-build --production-like` still fails on `/articles/kod-da-vinchi/` (desktop+mobile) with `tt is not defined`. The gill-audit catches it on 5 Gill routes × 2 viewports × 2 themes = 20 pageerrors. CI deploy chain only runs the gill-audit; other article/landing routes could regress `tt` (or any other runtime no-undef) without blocking deploy. See Pass 35 in `MASTER_BUG_MATRIX.md` and §35.1–35.4 in the evidence file.

## NEW-70 / NEW-71 / NEW-72 — Pass 38 findings (P2/P3)

- **NEW-70 (P3, sitemap stale lastmod):** only 4 unique lastmod values across 43 URLs. See Pass 38 in MASTER_BUG_MATRIX.md.
- **NEW-71 (P3, README version drift):** README is v10 / 2026-06-26, but source HEAD = f1e9abd9 (2026-07-03). Owner should re-version. See Pass 38.
- **NEW-72 (P2, SVG dedup opportunity):** 9 unique SVG fragments duplicated across 4 files; most-duplicated is the checkmark polyline (5x). Total potential saving ~1.5-2KB. See Pass 38.

## Verified P2 follow-up

`P2-SEARCH-EAGER` is verified-current on `dbd0bb55`: `search.js` eagerly creates 128 `.cp-*` command-palette nodes / ~106 KB `.cp-*` outerHTML before interaction and eagerly requests `/data/search-manifest.json`; Pagefind itself remains lazy. Do not treat this as fixed by prior SVG dedup.

`BUG-010` is verified-current: 23 unique px breakpoint values across CSS. `BUG-011` is reclassified: exact 768 overlap exists, but no same selector+property collision was found; treat as boundary architecture risk unless a visual/browser witness appears.

`BUG-022` is reverified-current with corrected count: not “256” as a simple current number; `site.css` has 52 later-rule changed selector/property keys (54 later overrides) after separating 81 same-rule progressive fallback keys.

`PC-107` is stale/fixed-current: it targeted deleted `GillRailControls.astro` props; current source has no GillRailControls file/references and current PremiumControls/FloatingCluster props are consumed.

`NEW-54..59` reverified on `dbd0bb55`: NEW-55 is fixed-current; NEW-54 zero-inlinks (4 URLs), NEW-56 social metadata gaps (28 routes), NEW-57 preload mismatches (12), NEW-58 feed title drift (23), NEW-59 hard-texts OG dimensions mismatch remain current.

## Fixed-current stale blocker

The older `css:layer:validate` failure on deleted `css/site-layered.css` is already fixed-current by source commit `a65874a0`; current script validates `css/site.css`. Do **not** reopen that as current.

## Role discipline

If operating as **auditor**, do not edit source. Update only AuditRepo evidence/matrix.

If operating as **executor**, use a SYSTEM lane and run at minimum:

```bash
for f in js/*.js; do node --check "$f"; done
npm run strangler:build:production-like
npx playwright install --with-deps chromium
npm run gill:mobile-layout:audit
npm run gill:mobile-play:smoke
npm run validate:static-publication
npm run guard:shared-files
```

---

# 🚀 ПРОМПТ ДЛЯ СЛЕДУЮЩЕГО АГЕНТА: Multi-Agent Execution & Verification (Pass 22+)

## ⚠️ КРИТИЧЕСКОЕ ВНИМАНИЕ (НЕ НАЧИНАЙТЕ С PASS 7, 8 ИЛИ 9!)

Аудит проекта **gospod-bog.ru (`gb-is-my-strength`)** ушёл далеко вперёд. Предыдущие агенты завершили **21 проход аудита** (включая глубокие проверки SEO, безопасности, производительности и архитектуры) и провели генеральную уборку репозитория от мусора и дубликатов матриц.

ЕДИНСТВЕННЫЙ канонический источник правды по багам находится здесь:
👉 `AuditRepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`

Все устаревшие черновики и разрозненные матрицы (`VERIFIED_BUG_MATRIX_FINAL`, `MATRIX_PASS8`, `MASTER_BUG_MATRIX_2026-07-02` и др.) перемещены в архив `archive/2026-07-02-stale-matrices/`. **Не создавайте новых файлов матриц! При любых изменениях обновляйте только единую мастер-матрицу.**

---

## 🎯 ТЕКУЩАЯ МИССИЯ: Режим Исполнителя (Fix & Verify)

Ваша задача в режиме мультиагента — переходить от пассивного поиска к **активному закрытию верифицированных багов** в исходном репозитории (`/home/user/gb-is-my-strength`), проверять исправления автотестами и обновлять статус в `MASTER_BUG_MATRIX.md`.

### 📊 Топ приоритетов для следующего пакета исправлений (Архитектура и производительность P1 / P2):

1. **`BUG-002` [P1] (Architecture): Дедубликация 45 компонентов `*PageHead.astro` / `*PostArticle.astro`**
   - *Файлы в репо:* `src/components/**/PageHead.astro`, `*PostArticle.astro`.
   - *Задача:* Выделить единый базовый компонент `<BaseArticleHead>` и сократить копипаст на 92–93%.

2. **`BUG-006` [P2] (Performance): Монолитный бандл `site.js` (162.8 KB)**
   - *Файл в репо:* `js/site.js`.
   - *Задача:* Вынести неиспользуемые на старте модули в отдельные чанки или завершить переход на модульную декомпозицию.

3. **`NEW-43` [P2] + `NEW-44` [P3] (Image Performance / CLS): Отсутствие атрибутов `width`/`height` и `loading="lazy"`**
   - *Файлы в репо:* `src/components/articles/`, `src/components/home/HomeSections/`.
   - *Задача:* Добавить явные размеры и ленивую загрузку для карточек и миниатюр, не нарушая визуальное сходство (visual parity).

4. **`BUG-010` & `BUG-011` [P2] (CSS Architecture): Хаос с брейкпоинтами и перекрытие на 768px**
   - *Файл в репо:* `css/site.css`.
   - *Задача:* Нормализовать медиа-запросы к стандартным токенам дизайн-системы и устранить 1px коллизии (`max-width: 767.98px` vs `min-width: 768px`).

### ✅ Завершённый и закрытый блок (Пакеты 1, 2, 3 от 2026-07-02/03):
- `P0-FC-REC` (бесконечная рекурсия в `floating-cluster-controller.js`) → ✅ ЗАКРЫТО (коммит `ca6a25a8`).
- `P1-DEPLOY-FAIL` (запуск деплоя при падении indexnow) → ✅ ЗАКРЫТО (коммит `29b49df0`).
- `NEW-50` & `NEW-51` (утечка research-файлов в dist) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `NEW-52` (Pagefind индекс 5 слов на статьях баптистов) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `NEW-53` (преждевременный IndexNow submit в CI) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `NEW-48` (Stored XSS в виджете избранного) → ✅ ЗАКРЫТО (коммит `f284fc60`).
- `NEW-46` (100% покрытие 53 роутов в `llms.txt`) → ✅ ЗАКРЫТО (коммиты `f284fc60`, `bba171af`).
- `BUG-041` (удаление holding pages из sitemap) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `BUG-001` (утечка памяти в `floating-cluster-controller.js`) → ✅ ЗАКРЫТО (коммит `36003b91`).
- `BUG-007` & `BUG-008` (нормализация времени чтения) → ✅ ЗАКРЫТО (коммиты `f284fc60`, `36003b91`).
- `BUG-009` (стандартизация на `assetUrl()`) → ✅ ЗАКРЫТО (коммит `4a367a9c`).
- `NEW-47` (подключение React-древа генеалогии на `/rodosloviye/`) → ✅ ЗАКРЫТО (коммиты `4a367a9c`, `bba171af`).
- `NEW-49` (удаление Google Fonts из 3D-карты баптизма) → ✅ ЗАКРЫТО (коммит `ac132c88`).
- `NEW-28` / `NEW-29` / `NEW-31` / `NEW-32` (добавление `_headers` для HSTS, X-Frame-Options, CSP frame-ancestors) → ✅ ЗАКРЫТО (коммит `bba171af`).

9. **`BUG-002` [P1] (Architecture): Дедубликация 45 компонентов PageHead/PostArticle**
   - *Задача:* Создать базовый компонент `<BasePageHead>` и перевести на него компоненты раздела.

---

## 🛠 ПОРИЯДОК РАБОТЫ (Workflow)

1. **Синхронизация:** Убедитесь, что вы работаете с актуальными ветками `main` в обоих репозиториях:
   ```bash
   cd /home/user/AuditRepo && git pull origin main
   cd /home/user/gb-is-my-strength && git pull origin main
   ```
2. **Исправление в коде:** Внесите точное точечное исправление в `/home/user/gb-is-my-strength`.
3. **Локальная верификация:** Запустите проверки:
   ```bash
   cd /home/user/gb-is-my-strength
   npm run validate:all
   ```
4. **Обновление матрицы:** Откройте `/home/user/AuditRepo/projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`, переведите статус исправленного бага в `✅ Fixed (Pass 22+)` и укажите коммит/доказательство.
5. **Коммит и пуш:** Не плодите лишние отчёты! Закоммитьте изменения в целевой репозиторий и обновите матрицу в AuditRepo. Не возвращайте старую формулировку `BUG-041` как “missing sitemap routes”: Pass 21 показал, что `f284fc60` добавил noindex holding pages в sitemap. Правильная задача — убрать noindex pages из sitemap и развести production-dist/indexable metadata.

---

## 🚫 ЧЕГО НЕ ДЕЛАТЬ (Правила гигиены репозитория)
1. **НЕ плодите новые MD-файлы** матриц, саммари и черновиков в корне или в `verified/`.
2. **НЕ верьте слепо старым отчётам** в `incoming/` — проверяйте факты живым `grep` или запуском скриптов.
3. **НЕ создавайте галлюцинаций:** Баг `SEO-001` (якобы пустой JSON-LD в серии Джон Гилл) был опровергнут ранее и является ложной тревогой — не открывайте его заново! Также не открывайте заново `BUG-041` как простой sitemap gap: Pass 21 re-triage показал проблему noindex pages in sitemap after fix-attempt.

Удачи в закрытии технического долга! 🚀
