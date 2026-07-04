# MASTER BUG MATRIX — gb-is-my-strength (CONSOLIDATED)

**Консолидация:** 2026-07-04 (обновлено **2026-07-05**, Pass 64 deep CI audit + deletions audit)
**HEAD исходного репозитория:** `6e68d7ca` (fix(ci): remove duplicate run: key in deploy.yml — re-enable submenu audit)
**Статус:** ✅ **deploy-green** — BUG-CI-001 fixed, все P0 блокеры закрыты

> ⚠️ Исторические PASS-секции (30–46) перемещены в `archive/2026-07-04-stale-matrix/`.

---

## ✅ ЗАКРЫТО (fixed-current)

| ID | Описание | Коммит |
|---|---|---|
| P0-CRASH-001 | `r is not defined` (highlights.js) | `bced1c69` |
| P0-CRASH-002 | `tt is not defined` (site.js) | `ffc763bc` |
| P1-NAGORNAYA | `SiteUtils is not defined` (script order) | `ffc763bc` |
| P2-NAGORNAYA-SITEUTILS | `SiteUtils` без `window.` prefix | `19062297` |
| P1-CI-DUPE | Дублирование cache-bust в deploy | `6e667978` |
| P1-SITE-XSS | XSS санитизация innerHTML | `47a98da` |
| P1-LAYERED-CSS | 283KB мёртвый CSS удалён | `47a98da` |
| P1-DEPLOY-FAIL | deploy блокировка при indexnow | `29b49df` |
| P0-FC-REC | Бесконечная рекурсия FC controller | `ca6a25a8` |
| NEW-48 | Stored XSS в Favorites.astro | `f284fc60` |
| NEW-46 | llms.txt — 19 missing routes | `f284fc60` |
| BUG-041 | sitemap — 8 missing routes | `36003b91` |
| BUG-001 | Memory leak — addEventListener | `36003b91` |
| NEW-65 | Baptisty visual parity | `914c7fb1` |
| NEW-66 | SW/Pagefind deploy-switch | `d5c65647` |
| NEW-64 | Runtime smoke in deploy | `8d0c12e0` |
| NEW-68/69 | CSP form-action regression | `14574a9a` |
| NEW-70 | sitemap stale lastmod | `a434b45e` |
| NEW-71 | README version drift | `da4a65cd` |
| NEW-59 | hard-texts OG dimensions | `c0ab48fc` |
| NEW-45 | Prefetch hints for navigation | `6e667978` |
| PC-CURRENT-06 | Gill mobile item -> partTOC flow | V3 |
| P2-SEARCH-EAGER | Скрыт — полный lazy loader для всех legacy+astro страниц | `546f7016` |
| UI-GILL-DESKTOP-RAIL-01 | Desktop rail 240→304px + submenu scrollspy | `79eab398` |
| UI-GILL-DESKTOP-TOC-02 | TOC hierarchy: gbs2-sub fix, scrollspy rewrite | `79eab398` |

---

## 🔴 P0 — CRITICAL (0 открытых)

*Все P0 блокеры закрыты.*

| ID | Описание | Коммит |
|---|---|---|
| BUG-CI-001 | deploy.yml двойной `run:` ключ — submenu audit отключён | `6e68d7ca` ✅ FIXED |

## 🟠 P1 — CI GATES (2 открытых) + PERFORMANCE (1)

- **BUG-CI-002:** `validate:static-publication:light` (запускается в indexnow.yml на каждый push) пропускает 3 критические проверки:
  - `astro:audit:article-mdx:strict` (MDX структура, Ukrainian 'мін', 'Сперджен')
  - `astro:audit:baptisty-series` (Baptist series shadow audit)
  - `sw:dist:audit` (Service Worker dist readiness)
  - **FULL:** 37 checks, **LIGHT:** 34 checks. Контент-регрессии могут пройти через indexnow.yml незамеченными.
  - **Repair lane:** ci-gate-alignment

- **BUG-CI-003:** indexnow.yml push retry — silent failure. После 3 неудачных попыток `git push` workflow отчитывается как успешный без `exit 1`, `::error::` или уведомления.
  - **Evidence:** `grep -A5 "for _attempt" .github/workflows/indexnow.yml`
  - **Repair lane:** ci-fix-emergency

- **BUG-PERF-001:** Memory leaks — addEventListener без removeEventListener в 5 JS файлах (64 listeners total). Критические: `nagornaya-mobile-toc.js` (26 listeners), `search.js` (22 listeners).
  - **Mitigation:** MPA (Astro) — менее критично чем в SPA, но стоит добавить cleanup для search palette и mobile TOC.
  - **Repair lane:** perf-cleanup

## 🟡 P2 — CI/SEO (2 открытых)

- **BUG-ARCH-001:** SW PRECACHE_ASSETS содержит `/data/search-manifest.json` и `/js/search.js`, которые теперь lazy-loaded (Pass 56). SW precache загружает оба при install, сводя экономию lazy loading на нет.
  - **Repair lane:** perf-cleanup

- **BUG-SEO-001:** IndexNow submit запускается сразу после `actions/deploy-pages@v4`, до реальной доступности нового контента на GitHub Pages CDN. Поисковики могут краулить старую версию.
  - **Repair lane:** ci-seo

## 🟢 P3 — CODE QUALITY (1 открытый)

- **BUG-SW-001:** `isFont()` в sw.js — двойное отрицание `!(origin !== ... || !pathname...)` эквивалентно `origin === ... && pathname...`. Корректно, но затрудняет аудит.
  - **Repair lane:** perf-cleanup

## 🟣 P3 — CLEANUP (5 открытых)

- **BUG-SEO-002:** robots.txt — `Allow: /llms.txt` применяется только к ImagesiftBot, а не ко всем blocked AI bots. Нужно добавить в каждый User-agent блок или создать глобальный.
- **BUG-CLEANUP-001:** 4 dead scripts (~27KB): `about-leaf-parity-shots.js`, `generate-route-profiles.js`, `premium-mobile-visibility-smoke.js`, `route-impact-report.js`. 0 external references.
- **BUG-CLEANUP-002:** `docs/refactor-2026/lanes/` — 52 файла, 31MB. Все merged. Pass 62 confirmed stale. Archive candidate.
- **BUG-CLEANUP-003:** `AUDIT_HISTORY.md` — 187KB, 51 sections, last updated 2026-06-22. Archive candidate.
- **BUG-CLEANUP-004:** `docs/BUGS_FOUND_2026-06-25.md` — 78KB, все баги исправлены. Archive candidate.

---

## 🟠 P2 — MEDIUM (2 открытых)

- **BUG-011:** 23 уникальных px брейкпоинта, 768px коллизия (reclassified — без визуальной регрессии)
- ~~**P2-SEARCH-EAGER:** search.js / command palette eager initial load~~ ✅ FIXED-CURRENT on `546f7016` for the measured eager-load class:
  - no initial `/js/search.js` network request on sampled root/legacy routes;
  - no initial `.cp-*` DOM;
  - no initial `/data/search-manifest.json` or Pagefind work;
  - search opens on first interaction. Remaining search work is broader refactor debt, not this P2 eager-load bug.

## 🔵 P3 — MEDIUM (2 открытых)

- **NEW-72:** SVG dedup micro-optimization (~1.9KB, downgraded from P2)
- **NEW-54/56/57/58:** Social/SEO metadata bundle (NEW-55/59 fixed)

## 🔵 P3 — REFACTORING (4)

- **R-001:** site.js монолит ~167KB (15 модулей)
- **R-002:** enhancements.js монолит ~48KB
- **R-003:** Нет source maps
- **R-004:** Нет type="module"/tree-shaking

## 🟣 AUDITREPO (3)

- **AR-001/004/005:** validate_audit_repo, verification protocol, reverify automation

---

## 🟢 PASS 56 / SEARCH FULL LAZY LOADER (2026-07-04)

**Source fix commit:** `546f7016b55a147dfbbca8e463e3fb0840686ed0` (`lane/search-full-lazy-loader-2026-07-04`, pushed to `main`).

`P2-SEARCH-EAGER` measured eager-load class is **fixed-current on source main `546f7016`**. Legacy/root pages now use inline lazy loaders instead of direct `search.js` script tags. Sampled routes show 0 initial search script/data/Pagefind requests and 0 `.cp-*` DOM before first interaction.

Verified on `546f7016`:

- custom Playwright smoke on `/articles/kod-da-vinchi/`, `/about/`, `/` ✅
- `node scripts/dist-smoke-audit.js --no-build --production-like` ✅
- `npm run audit:premium-controls` ✅ 87/87
- `npm run validate:all` ✅
- `npm run validate:static-publication` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_search-full-lazy-loader-546f701.md`. Source main now `8a8211ea` (auto cache-bust descendant); remote Deploy green: run `28709565563` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28709565563); Visual Parity green: run `28709548827` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28709548827).

---

## 🟡 PASS 51 / SEARCH LEGACY LAZY INIT (2026-07-04)

**Source fix commit:** `30b9fe46bde22e67bbff7a9418718b4e18f5dab5` (`lane/search-legacy-lazy-init-2026-07-04`, pushed to `main`).

`P2-SEARCH-EAGER` is **partially improved further**. Legacy/full-document pages still download the first-pass `search.js`, but the eager DOM/data work is stopped: no `.cp-*` DOM, no search manifest, no Pagefind until first search interaction.

Verified on `30b9fe46`:

- custom Playwright smoke on `/articles/kod-da-vinchi/`, `/about/`, `/` ✅
- `npm run validate:all` ✅
- `node scripts/dist-smoke-audit.js --no-build --production-like` ✅
- `npm run audit:premium-controls` ✅ 87/87
- `npm run validate:static-publication` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_search-legacy-lazy-init-30b9fe4.md`. Source main now `43a515df` (auto cache-bust descendant); remote Deploy green: run `28708425606` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28708425606).

---


## 🟢 PASS 52b / SEARCH-MANIFEST GENERATEDAT REFRESH (2026-07-04)

**Source fix commit:** `bdaf6e8aa8446e2f9016281ad564e54cc2332f40` (`lane/data-search-manifest-timestamp-2026-07-04`, pushed to `main`).

Pass 52 `search-manifest generatedAt stale` advisory is **fixed-current on source main `bdaf6e8a`**. Only the `generatedAt` field changed; manifest items/content stayed unchanged.

Verified on `bdaf6e8a`:

- `npm run data:consistency` ✅
- `node scripts/audit-pro.js` ✅
- `git diff --check` ✅
- `npm run guard:shared-files` ✅

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_search_manifest_generatedAt_fixed-bdaf6e8.md`. Remote Deploy green: run `28708703645` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28708703645).

---

## 🟡 PASS 52 — DEEP AUDIT VERIFICATION (2026-07-04)

**Verified by:** Arena Agent (deep audit mode)  
**Source HEAD:** `43a515df`  
**Source HEAD (deployed):** `6e667978` (green deploy)  
**All 11 gates passed:** data:consistency, guard:shared-files, workflows:check, production-like build, audit:premium-controls (87/87), dist:css-parity, dist:jsonld, schema:rich-results, gill:context/spravochnik parity, dist-smoke (28/28 routes Playwright) ✅

### Findings

- **P2-SEARCH-EAGER scope confirmed:** lazy search (in BaseLayout) applies ONLY to article detail pages (ArticleLayout→BaseLayout). Catalog/index pages (/, /about/, /articles/, /karty/, /biografii/, /nagornaya/, /baptisty-rossii/) each have their own PageChrome with `<script src="./js/search.js" defer>` — still eager. Already documented as "partially fixed". To fully close, each PageChrome needs its own lazy-load inline script or shared helper.
- **CSS dynamic load confirmed valid:** `enhancements-runtime.css`, `highlights-runtime.css`, `sw-toast.css` are all legitimately loaded at runtime via JS-created `<link>` elements. Not dead code.
- **search-manifest.json:** generatedAt stale advisory fixed by `bdaf6e8a`. All 44 entries still point to valid files; content unchanged.
- **All 9 CSS + 11 JS files** in cache-bust-assets.js ✅
- **Gill v16 markers confirmed:** all 5 routes have `data-gill-v16` and `gb-roman` ✅
- **PremiumControls 87/87:** all PC-CURRENT items closed on current HEAD ✅
- **No XSS vectors:** no eval, new Function, or document.write. All innerHTML is hardcoded/static ✅
- **No stale branches:** only origin/main in both repos ✅

### New items added

None — all findings are refinements of existing open items.



## 🟡 PASS 53 — GARBAGE CLEANUP SCAN (2026-07-04)

**Cleanup scan results — all advisory, no source changes in gb-is-my-strength.**

### Cleanup opportunities found

| # | Severity | Item | Size | Recommendation |
|---|----------|------|------|----------------|
| 1 | 🟡 **P3** | 10 duplicate image pairs (identical MD5) | ~1MB | Responsive src/srcset variants have identical content — either deduplicate (point all uses to one file) or generate proper size variants |
| 2 | 🟢 **INFO** | 50 stale lane docs in `docs/refactor-2026/lanes/` | ~500KB | All branches merged and deleted. Consider archiving to `docs/refactor-2026/lanes/ARCHIVE/` |
| 3 | 🟢 **INFO** | `audit/DEEP_CODE_AUDIT_2026-06-30.md` | 32KB | Tied to stale HEAD `27862d4d` (known from earlier passes). Keep as historical reference |
| 4 | 🟢 **INFO** | `audit/archive/` (9 files) | ~200KB | June 2-10 historical audits. Keep as historical |
| 5 | 🟢 **INFO** | `audit/seo-2026-06-25/` (5 files) | ~200KB | Old SEO audit with Playwright JSON results. Keep as reference |
| 6 | 🟢 **INFO** | `audit/external-checks/` (3 files) | ~52KB | Includes Windows PowerShell audit script. Keep |
| 7 | 🟢 **INFO** | `yandex_*.html` + `google*.html` in root | ~214B | Also exist in `dist/`. Could be removed from root if GH Pages serves from dist/ only |

### Already clean (verified)
- All 14 npm packages used (0 unused)
- All 11 JS files in cache-bust ✅
- All 9 CSS files in cache-bust ✅
- No dead .astro components (all imported)
- No dead images in dist (all referenced)
- No stale branches in either repo
- Root files (CNAME, robots.txt, manifest.json, llms.txt, feed.xml) all valid

### Verdict
No critical garbage found. 7 advisory items above — none blocking. Total potential recovery <2MB.


## 🟡 PASS 54 — DEEPER GARBAGE CLEANUP (2026-07-04)

**Additional findings beyond Pass 53.**

### Migration matrix exclude — stale?
All 5 excluded patterns (`nagornaya/**`, `articles/dzhon-gill-*`, `articles/krajne-li-isporcheno-serdce`, `articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy`, `hard-texts/**`) now have **Astro native pages**. If all are native, the exclude list serves no purpose. However — these routes use legacy PageChrome/PageHead components that load their own runtime (not BaseLayout). Documented as "scope: all-routes-except-nagornaya-gill-heart-hard-texts". **Keep as-is — intentional design boundary.**

### CSS — 120 classes in CSS not found in dist HTML
| Prefix | Count | Nature |
|--------|-------|--------|
| `gbs2-` | 33 | Legacy Gill series — ONLY used in legacy root copies, not in dist Astro pages. By design. |
| `btoc-` | 30 | Nagornaya bottom TOC — injected dynamically by JS, not in static HTML. Valid. |
| `bar-` | 11 | Nagornaya bottom bar — injected dynamically by JS. Valid. |
| `h-` | 20 | Home v20 — some may be stale after home refactor (h-cp-btn, h-home-entry-strip classes) |
| `gb-` | 19 | Various bookmark/toast/feature classes — some dynamic |
| `fc-` | 2 | Floating cluster scoping classes — dynamic |
| `nag-` | 5 | Nagornaya sidebar/fontsize — injected dynamically |

**Actionable cleanup:** `h-cp-btn`, `h-home-entry-strip*` — these home v20 intermediate classes may be dead after final home design. Minimal waste (<1KB).

### React usage confirmed
React (`@astrojs/react` + `react` ^19.2.7) is used **only** for the `/rodosloviye/` (Genealogy) page — `GenealogyTree.tsx` with `@xyflow/react`. Legitimate. Cannot be removed.

### SW CACHE_VERSION
Current `gb-v187-pagefind-bootstrap-20260703` — 1 day behind source HEAD `43a515df`. SW is rebuilt on explicit cache-bust commits (`[skip ci]` does not rebuild). Expected behavior — not stale.

### CSS variables — all used
All CSS custom properties (`--color-*`, `--h-*`, `--gbs2-*`, `--gb-*`) are referenced in CSS rules. No dead variables.


## 🟡 PASS 55 — DOCUMENTATION CLEANUP (2026-07-04)

### AGENTS.md cleanup
- **Removed** 65 lines of stale revision history (r244-r294, refactoring work from June 19-22)
- **Archived** to `docs/archive/AGENTS_REVISION_HISTORY_2026-07-04.md`
- Only **5** AGENTS-r references remain (slim table + 3 inline notes)
- Global git config (`user.name` + `user.email`) now set to survive sessions

### SANDBOX-ENV cleanup
- **Reduced** from 940 lines/71KB → **177 lines/6KB** (81% reduction)
- Removed obsolete sections: external reference pass, timing proof, SVG gate, pixelmatch method, Yandex CSP
- Added explicit "new session != new conversation" warning
- Added git survival guide for rebase/conflict recovery
- Added compact table of what persists/not persists between sessions
- Historical content lives in git history (no archive needed)

### Cleanup results
| Document | Before | After | Reduction |
|---|---|---|---|
| AGENTS.md | 1659 lines | 1593 lines | -66 lines (-4%) |
| SANDBOX-ENV-2026-06-21.md | 940 lines / 71KB | 177 lines / 6KB | -763 lines (-81%) |

### Sandbox survival facts confirmed

**Persists between sessions:** workspace files (ext4), git repos, remote URLs with token, node_modules, ~/.cache/, npm cache, /tmp/

**Does NOT persist:** global git config, ~/.git-credentials, SSH keys, environment variables, bash history/aliases, background processes, terminal state, current working directory

**Every new user message may be a new session.** First thing to do in any session:
1. `pwd` and `ls` to find workspace
2. `git log --oneline -1` to check HEAD
3. `git config user.name` if it fails — set it
4. Check `node -v` (needs 22.12.0) and `export PATH` if needed
5. Check `git remote -v` for token


## 🟠 GILL DESKTOP RAIL — FORENSIC VERIFICATION (2026-07-04)

**Forensic pass against GPT 5.5 audit + independent source verification.** Source HEAD `12f4a50a`.

### Claims verified TRUE (all confirmed in current source) — ALL FIXED in 79eab398

| # | Claim | File:Line | Evidence |
|---|-------|-----------|----------|
| 2.1 | Rail hardcoded at 240px (reference required 304px) | `css/floating-cluster.css:2216,2224` | `grid-template-columns:240px minmax(0,1fr)` — legacy comment says 304px |
| 2.3 | Every chapter gets `gbs2-sub` because class derived from `subtitle` | `GillSeriesRail.astro:54` | `<li class={item.subtitle ? 'gbs2-sub' : ''}>` — all items have non-empty subtitle |
| 2.4 | First/current `partToc` item may lack `href` | `gillSeriesData.ts:26` | `href?: string` — optional. E.g. context page item with `current: true` has no `href` |
| 2.5 | `<span>` directly inside `<ul>` | `GillSeriesRail.astro:51-52` | `<ul class="gbs2-toc"><span aria-hidden="true" class="gbs2-track">...` — invalid HTML |
| 2.6 | Count overwritten by JS | `floating-cluster-controller.js:1275-1276` | `countEl.textContent = headings.length;` — destroys "N / TOTAL" format |
| 2.7 | Scrollspy fragile: empty `topLevelAs` possible | `floating-cluster-controller.js:1411` | `qsa('.gbs2-toc > li:not(.gbs2-sub) > a')` — if all items are gbs2-sub, this returns empty |
| 2.8 | No desktop rail geometry gate exists | — | `scripts/gill-desktop-rail-audit.js` does not exist |

### New bug records (not in previous matrix)

#### UI-GILL-DESKTOP-RAIL-01 — Desktop rail wrong width (240px vs 304px+)
- **Severity:** 🟠 P1 — owner-visible visual regression
- **Status:** ✅ FIXED-CURRENT (79eab398 + 8a8211ea)
- **Root cause:** `css/floating-cluster.css` hardcodes 240px rail; legacy reference was 304px;
  owner reports cramped appearance, truncated titles, horizontal scrollbar
- **Evidence:** `floating-cluster.css:2204` comment says "304px col", but `:2216` uses 240px
- **Fix needed:** Increase `--gill-rail-width` to 304px at ≥80em, 272-288px at 64-80em.
  Add `scripts/gill-desktop-rail-audit.js` + `package.json` script + deploy workflow step.
- **Gating gap:** No desktop rail geometry gate exists (only mobile gates).

#### UI-GILL-DESKTOP-TOC-02 — TOC hierarchy/submenu semantic bug
- **Severity:** 🟠 P1 — functional/UX (scrollspy can fail silently)
- **Status:** verified-current
- **Root cause (3 bugs in one):**
  1. All items get `gbs2-sub` because class derived from `subtitle` existence — scrollspy's
     `topLevelAs` selector `qsa('.gbs2-toc > li:not(.gbs2-sub) > a')` can return empty
  2. First/current `partToc` entry may lack `href` field (`href?: string` in interface) —
     prevents exact hash matching, scrollspy depends on special cases
  3. Count is overwritten: `/` format → single number
- **Fix needed:** Add `level: 2 | 3` field to `GillPartTocItem`; restore `level` logic in rail;
  ensure every item has `href`; preserve `N / TOTAL` count format; fix `<span>` inside `<ul>`.

#### UI-GILL-DESKTOP-FRAME-03 — Frame structure leaks horizontal scroll
- **Severity:** 🟡 P2 — visual regression
- **Status:** verified-current
- **Root cause:** `.gbs-rail` uses `overflow:hidden` but internal `.gbs2-tocscroll` may
  not own overflow correctly; invalid `<span>` inside `<ul>` contributes.
- **Fix needed:** Audit ensures `rail.scrollWidth === rail.clientWidth` and
  `tocscroll.scrollWidth === tocscroll.clientWidth`.

### Current gate coverage gaps

| Area | Current gates | Missing |
|------|---------------|---------|
| Mobile layout | ✅ `gill:mobile-layout:audit`, `gill:mobile-play:smoke` | — |
| Desktop rail geometry | ✅ gill:pre-v16-submenu:audit | 105/105 checks, 5 routes x 6 viewports |
| Desktop TOC scrollspy | ✅ gill:pre-v16-submenu:audit | Static TOC + browser scrollspy assertions |
| PremiumControls | ✅ `audit:premium-controls` 87/87 | Does not prove desktop rail geometry |



## 🟢 PASS 62 — COMPREHENSIVE STALE-CONTENT SCAN (2026-07-05)

**Scan of previously unaudited areas in source repo (`8a8211ea`).**

### Source repo stale files

| File | Size | Status | Action |
|------|------|--------|--------|
| `docs/BUGS_FOUND_2026-06-25.md` | **80KB** | Stale — references commits from 2026-06-25..29, all fixed-current | Archive to docs/archive/ |
| `AUDIT_HISTORY.md` | **191KB** | 51 version sections, last updated 2026-06-22. Contains ancient history | Archive to docs/archive/ |
| `docs/refactor-2026/lanes/` | **52 files** | All lanes merged and deleted. Stale documentation | Archive to docs/archive/ |
| `_check-fonts.mjs` | 3KB | Build-time diagnostic tool | Keep (build tooling) |
| `_check-styles.mjs` | 3KB | Build-time diagnostic tool | Keep |
| `_diag-kod.mjs` | 6KB | Build-time diagnostic tool | Keep |
| `RUN-LOCAL-WINDOWS-AUDIT.cmd` | 1KB | Local Windows tool | Keep |
| `_build-tools/` | 2 dirs | Build-time tooling | Keep |
| `google*.html` / `yandex*.html` | <1KB | Verification tokens — also in dist/ | Redundant but harmless |

### Data / SEO findings

| Check | Result |
|-------|--------|
| search-manifest.json items | 44 — all valid |
| generatedAt | 2026-07-04T16:48:42+03:00 ✅ refreshed |
| Broken references | 0 (biografii/#dzhon-gill-series is a valid anchor on /biografii/) |
| Duplicate image pairs | 10 pairs (~1.9MB, identified in Pass 53) — responsive variants |
| heaviest images | gill-bunhill-fields.jpg (573KB), gill-wesley-debate.jpg (415KB) |

### Layout audit

| Layout | Uses BaseLayout | search.js loading | Status |
|--------|:--------------:|:-----------------:|:------:|
| BaseLayout.astro | — | **Lazy** (inline bootstrap) | ✅ |
| ArticleLayout.astro | ✅ BaseLayout | **Lazy** (inherited) | ✅ |
| SeriesArticleLayout.astro | ✅ BaseLayout | **Lazy** (inherited) | ✅ |

### Remaining open items (10)

| ID | Category | Status |
|----|----------|--------|
| BUG-011 | CSS breakpoints (23 values, 768px overlap) | Reclassified — no visual regression |
| NEW-72 | SVG dedup (~1.9KB) | Advisory P3 |
| NEW-54/56/57/58 | Social/SEO metadata | P3 non-blocking |
| R-001..R-004 | site.js 167KB monolith, enhancements 48KB, source maps, ESM | Refactoring |
| AR-001/004/005 | AuditRepo infra | Accepted |

---


## 🟢 PASS 63 — GILL SERIES IMAGE AUDIT + FIXES (2026-07-05)

**Source fix commit:** `e5942361` (pushed to main as `lane/fix-gill-images-2026-07-05`).

### Bugs found and fixed

| ID | Severity | Description | Fix |
|----|----------|-------------|-----|
| BUG-IMG-01 | P2 | **gill-southwark-sermon**: no full-size master file (only 600w/900w variants) | Created `gill-southwark-sermon.webp` (900x1350) |
| BUG-IMG-02 | P2 | **Missing OG image for chast-1-chelovek**: used `og-gill-authentic-study-cover.webp` as fallback. No dedicated `og-dzhon-gill-chast-1-chelovek.*` existed | Created `og-dzhon-gill-chast-1-chelovek.webp` + 600w variant |
| BUG-IMG-03 | P2 | **Missing OG image for spravochnik**: used `og-gill-five-volumes-shelf.webp` as fallback | Created `og-dzhon-gill-spravochnik.webp` + 600w variant |
| BUG-IMG-04 | P3 | **Misnamed image**: `gill-authentic-study-cover.webp` — filename says "cover" but content is a portrait of Gill at desk | Renamed to `gill-study-portrait.webp` (all references updated) |

### Image placement verification

All 5 Gill articles verified — every image is thematically correct:
- istoricheskiy-kontekst: 6 unique images (library, clarendon acts, persecution, bookshop, southwark sermon, underground meeting)
- chast-1-chelovek: 8 unique images (portrait, baptism, funeral, kettering, horsleydown, succession, pulpit)
- chast-2-uchenyi: 4 unique images (talmud, wesley debate, young boy shop, OG)
- chast-3-nasledie: 4 unique images (bunhill fields, spurgeon, atlantic map, OG)
- spravochnik: 2 unique images (five volumes shelf, OG)

### Remaining concern
- `underground-puritan-meeting.*` (6 files, ~280KB) — used in istoricheskiy-kontekst as historical illustration but not named with `gill-` prefix. Not a functional bug but naming inconsistency.

---


## 🟢 PASS 64 — COMPREHENSIVE IMAGE PLACEMENT AUDIT (2026-07-05)

**Source HEAD:** `629ed89a`

**Full image audit across the entire site — every image checked in context.**

### Coverage

| Area | Images | Status |
|------|--------|--------|
| Gill series (5 articles) | 82 files (incl. variants) | 4 bugs fixed in Pass 63 |
| Baptisty series (10 articles) | 22 files | ✅ All correct (series navigation) |
| Pastor series (1 article) | 9 images | ✅ All correct |
| Krajne/Heart series (2 articles) | 30+ ieremia-* images | ✅ All correct |
| Romans 7 (1 article) | 13 rim7-* images | ✅ All correct |
| Da Vinci Code (1 article) | 4 local + 10 Wiki Commons | ✅ All correct |
| Hermeneutics (1 article) | 1 preview image | ✅ Correct |
| About page | 0 images | ✅ |
| Biografii | 5 images | ✅ |
| Nagornaya | 0 inline images | ✅ |
| Home page | 10 images | ✅ All link to correct articles |

### Orphaned files removed

| File | Reason |
|------|--------|
| `images/gill-authentic-study-cover*` (4 files) | Renamed to gill-study-portrait* in Pass 63 |
| `images/og-gill-authentic-study-cover.webp` | Superseded by og-dzhon-gill-chast-1-chelovek |
| `images/og-gill-five-volumes-shelf.webp` | Superseded by og-dzhon-gill-spravochnik |
| `images/pastor-series/og-hero-600w.webp` | Orphaned variant (900w still used) |

### Cross-article image usage verified

All cross-article image references are in **navigation/related-articles** sections:
- Series nav shows covers of neighboring articles — CORRECT
- Related articles at page bottom show thumbnails — CORRECT
- No alien images in article body content

**Verdict: All images are in their correct context. Zero misplaced images.**

---

## 🟢 PASS 58 — GILL DESKTOP RAIL VERIFICATION (2026-07-04)

**Verified findings from forensics GPT 5.5 audit (Pass 56):**

### UI-GILL-DESKTOP-RAIL-01 — Desktop rail 240px vs 304px ✅ CONFIRMED
- **File:** `css/floating-cluster.css:2216`
- **Evidence:** `grid-template-columns:240px minmax(0,1fr)` (comment on line 2204 references 304px)
- **Root cause:** Gill v16 reduced from 304px to 240px without geometry gate
- **Owner-visible:** Yes — cramped titles, potential scrollbar on narrow screens
- **Fix needed:** Increase to 304px at ≥80em, add `scripts/gill-desktop-rail-audit.js`

### UI-GILL-DESKTOP-TOC-02 — TOC hierarchy bugs ✅ CONFIRMED
1. **`gbs2-sub` over-assignment:** `GillSeriesRail.astro:54` applies class based on subtitle existence — ALL items have subtitle → all items get `gbs2-sub`. Scrollspy (`floating-cluster-controller.js:1411`) selector `.gbs2-toc > li:not(.gbs2-sub) > a` returns empty.
   - **Fallback exists (lines 1424-1432):** climbs `previousElementSibling` — partially mitigates
2. **Count format overwritten:** `floating-cluster-controller.js:1222` → `countEl.textContent = headings.length;` destroys "N / TOTAL" format
3. **href optional:** `gillSeriesData.ts:26` — first/current item can have `href?: string`

### Summary
| Bug | P | File | Evidence |
|-----|---|------|----------|
| UI-GILL-DESKTOP-RAIL-01 | **P1** | floating-cluster.css:2216 | 240px vs 304px |
| UI-GILL-DESKTOP-TOC-02 | **P1** | GillSeriesRail.astro:54 | gbs2-sub prevents scrollspy |
| UI-GILL-DESKTOP-FRAME-03 | P2 | Overflow | `<span>` inside `<ul>` |

### Verified intact
All prior P0/P1/P2 fixes remain intact across the codebase.

---

## 🟢 PASS 57 — DEEP CODE AUDIT (2026-07-04)

**Verified by:** Arena Agent (full codebase walkthrough — all 11 JS, 9 CSS, workflows, sw.js, configs)

### File-by-file audit results

| File | Size | "use strict" | eval/Function | xss-risk | Status |
|------|------|:-----------:|:------------:|:--------:|:------:|
| site-utils.js | 2KB | ✅ | 0 | ✅ | Clean |
| scroll-perf.js | 2KB | ✅ | 0 | ✅ | Clean |
| sw-register.js | 3KB | ✅ | 0 | ✅ | Clean |
| glossary.js | 8KB | ✅ | 0 | ✅ | Clean |
| highlights.js | 9KB | ✅ | 0 | ✅ | P0 fix intact |
| bookmark-engine.js | 10KB | ❌* | 0 | ✅ | Clean |
| nagornaya-mobile-toc.js | 16KB | ✅ | 0 | ✅ | P2 fix intact |
| search.js | 33KB | ✅ | 0 | ✅ | Lazy loader OK |
| enhancements.js | 46KB | ✅ | 0 | ✅ | Clean |
| floating-cluster-controller.js | 61KB | ✅ | 0 | ✅ | P0, PC intact |
| site.js | **167KB** | ✅ | **0** | ✅ | Monolith (R-001) |

*\*bookmark-engine.js has no "use strict" — all vars are local, safe.*

### Zero security findings

- **`eval()` / `new Function()` / `document.write()`** — 0 occurrences across all code
- **XSS via innerHTML** — all user data passes through `tt()/F()` HTML-escape or `safeUrl()` anti-javascript: filter
- **CSP** — `script-src 'self' 'unsafe-inline'` (inline required for legacy HTML, no nonce available)
- **`javascript:` URL injection** — `safeUrl()` catches and returns `#`
- **ARENA_AGENT / INDEXNOW_KEY secrets** — only used in CI workflows, never leaked to client

### All previous fixes verified intact

| Fix | File | Status |
|-----|------|--------|
| `var r` declared (P0-CRASH-001) | highlights.js | ✅ |
| `function tt(n)` defined (P0-CRASH-002) | site.js | ✅ |
| `window.SiteUtils.themeKey` (P2-NAGORNAYA-SITEUTILS) | nagornaya-mobile-toc.js | ✅ 0 bare |
| deploy.yml cache-bust conditional (P1-CI-DUPE) | deploy.yml | ✅ |
| Lazy search loader (P2-SEARCH-EAGER) | search.js/BaseLayout.astro | ✅ |
| Prefetch hints (NEW-45) | BaseLayout.astro | ✅ 6 links |
| search-manifest generatedAt | data/search-manifest.json | ✅ refreshed |

### Open item refinement

- **R-001 (site.js monolith 167KB):** 191 `addEventListener` vs 13 `removeEventListener` (BUG-001 partially remains for non-global listeners, but most are on document/window and live for page lifetime)
- **BUG-011 (CSS breakpoints):** 23 unique px values, 43 media queries in site.css. Reclassified — no visual regression found
- **NEW-72 (SVG dedup):** 4 small patterns (~1.9KB). Advisory only
- **floating-cluster.css:** 135 `!important` (majority in `[data-gill-v16]` scope — intentional override pattern)

---

## 🟢 PASS 64 — DEEP CI/ARCHITECTURE AUDIT (2026-07-05)

**Agent:** arena-agent (Arena.ai Agent Mode)  
**Source HEAD:** `e5942361`  
**Scope:** deploy.yml, indexnow.yml, sw.js, package.json, BaseLayout.astro, AuditRepo documentation

### New findings (6)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-CI-001 | 🔴 P0 | deploy.yml duplicate `run:` key — submenu audit disabled | OPEN |
| BUG-CI-002 | 🟠 P1 | `:light` skips 3 critical gates (MDX strict, baptisty, SW) | OPEN |
| BUG-CI-003 | 🟠 P1 | indexnow.yml push retry — silent failure | OPEN |
| BUG-ARCH-001 | 🟡 P2 | SW precache contradicts lazy search | OPEN |
| BUG-SEO-001 | 🟡 P2 | IndexNow submit before Pages CDN propagation | OPEN |
| BUG-SW-001 | 🟢 P3 | `isFont()` double negation | OPEN |

### False positive retracted

- **BUG-RUNTIME-001 (empty genericRuntime):** FALSE POSITIVE. GitHub raw markdown rendering stripped template literal content. Actual source verified via `git clone`: Yandex Metrika (id: 108353327), `window.SITE_CONFIG`, site-utils.js, scroll-perf.js, site.js, sw-register.js, and lazy search bootstrap all present and correct.

### Repair lanes proposed

1. **ci-fix-emergency:** BUG-CI-001 + BUG-CI-003 (2 files, ~5 lines changed)
2. **ci-gate-alignment:** BUG-CI-002 + BUG-SEO-001 (package.json + deploy.yml)
3. **perf-cleanup:** BUG-ARCH-001 + BUG-SW-001 (sw.js only)

### Evidence

Full report: `incoming/arena-agent-pass63/REPORT.md`

---

## 🟢 PASS 65 — DEEP CODE QUALITY & PERFORMANCE AUDIT (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`

### New findings (8)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-PERF-001 | 🟠 P1 | Memory leaks — 64 addEventListener without removeEventListener (5 files) | OPEN |
| BUG-QUALITY-001 | 🟡 P2 | 6 innerHTML without explicit sanitization (4 safe, 2 need verification) | OPEN |
| BUG-QUALITY-002 | 🟡 P2 | 7 console statements in production code | OPEN |
| BUG-QUALITY-003 | 🟡 P2 | 3 images without WebP versions (~352KB wasted) | OPEN |
| BUG-QUALITY-004 | 🔵 P3 | 2 large images >500KB (gill-bunhill-fields.jpg 560KB) | OPEN |
| BUG-QUALITY-005 | 🔵 P3 | 65 unused CSS variables | OPEN |
| BUG-QUALITY-006 | 🔵 P3 | 565 CSS classes not used in HTML (~215 truly unused) | OPEN |
| BUG-QUALITY-007 | 🔵 P3 | 451 HTML classes not in CSS (Tailwind utilities, not a bug) | INFO |

### Verified clean

✅ Astro components (50 sampled) — no accessibility issues  
✅ Image optimization — 92% with WebP versions  
✅ JSON-LD — 63 blocks, all valid  
✅ Cache-bust — 22 assets, all versions match  

### Full report

`incoming/arena-agent-pass65/REPORT.md`

---

## 🟢 PASS 66 — DATA CONSISTENCY, ERROR HANDLING & ACCESSIBILITY (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`

### New findings (3)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-A11Y-001 | 🟡 P2 | 8 legacy article pages without skip links | OPEN |
| BUG-QUALITY-008 | 🔵 P3 | 77 empty catch blocks (9 files, mostly intentional) | OPEN |
| BUG-A11Y-002 | 🔵 P3 | 3 SPA apps without semantic landmarks | OPEN |

### Verified clean

✅ Data consistency — 68 JSON files valid, no duplicates  
✅ Error handling — 44 catch blocks with fallback (35%)  
✅ Accessibility — all images have alt, all buttons have names, all inputs have labels  

### Full report

`incoming/arena-agent-pass66/REPORT.md`

---

## 🟢 PASS 67 — CRITICAL RENDERING PATH & PERFORMANCE (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`

### New findings (3)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-PERF-002 | 🟡 P2 | 26 files with 5+ render-blocking CSS (~350KB, no critical CSS inlining) | OPEN |
| BUG-PERF-003 | 🔵 P3 | 1 file with 4 render-blocking JS in `<head>` (karty/avraam) | OPEN |
| BUG-PERF-004 | 🔵 P3 | 1 file without font preloading (karty/early-church, FOIT risk) | OPEN |

### Verified good

✅ Fonts preloaded on 29/30 pages  
✅ Yandex Metrika loaded async  
✅ Anti-FOUC script inline  
✅ All pages have proper SEO meta tags  

### Performance impact

**Current:** FCP on 3G ~2.5-3s (350KB CSS blocking)  
**After fix:** FCP on 3G ~1-1.5s (40-50% faster with critical CSS inlining)

### Full report

`incoming/arena-agent-pass67/REPORT.md`

---

## 🟢 PASS 68 — DEEP CSS ARCHITECTURE AUDIT (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`

### New findings (5)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-CSS-001 | 🔴 P1 | 1047 !important declarations (cascade broken) | OPEN |
| BUG-CSS-002 | 🟡 P2 | 938 hardcoded colors (should use CSS variables) | OPEN |
| BUG-CSS-003 | 🟡 P2 | 29 unique breakpoints (should be 3-5 max) | OPEN |
| BUG-CSS-004 | 🔵 P3 | 5864 magic numbers (px values without design tokens) | OPEN |
| BUG-CSS-005 | 🔵 P3 | 27 duplicate selectors (code duplication) | OPEN |

### Key metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| !important | 1047 | <100 | 🔴 Critical |
| Hardcoded colors | 938 | <50 | 🟡 High |
| Breakpoints | 29 | 5 | 🟡 High |
| Magic numbers | 5864 | <1000 | 🔵 Medium |
| Duplicate selectors | 27 | 0 | 🔵 Medium |

**Overall CSS Technical Debt:** 🔴 **Critical** (requires major refactoring)

### Breakdown by file

| File | Size | !important | Hardcoded colors | px values |
|------|------|------------|------------------|-----------|
| site.css | 275KB | 202 | 551 | 3382 |
| floating-cluster.css | 106KB | 524 | 191 | 837 |
| home.css | 76KB | 36 | 34 | 936 |
| mobile-hotfix.css | 18KB | 142 | 47 | 77 |
| command-palette.css | 29KB | 7 | 31 | 381 |
| others | 30KB | 136 | 84 | 251 |
| **Total** | **534KB** | **1047** | **938** | **5864** |

### Full report

`incoming/arena-agent-pass68/REPORT.md`

---

## 🟢 PASS 69 — DEEP CSS CODE REVIEW: floating-cluster.css (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `css/floating-cluster.css` (2882 lines, 106KB) — complete line-by-line audit

### New findings (7)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-CSS-006 | 🔴 P1 | Duplicate :root variable definitions (lines 10-28 and 32-54) | OPEN |
| BUG-CSS-007 | 🔴 P1 | Duplicate .gb-floater mobile styles (lines ~450-480 and ~550-580) | OPEN |
| BUG-CSS-008 | 🔴 P1 | "Specificity wars" — 4 layers of !important overriding !important | OPEN |
| BUG-CSS-009 | 🟡 P2 | MAX_INT z-index values (2147483000, 2147483100) — anti-pattern | OPEN |
| BUG-CSS-010 | 🟡 P2 | Duplicate .gbs-rail-foot definitions (lines ~900 and ~1000) | OPEN |
| BUG-CSS-011 | 🔵 P3 | Architectural problems acknowledged in comments but not fixed | OPEN |
| BUG-CSS-012 | 🔵 P3 | 524 !important in single file (50% of project total) | OPEN |

### Key discoveries

**1. "Specificity wars" — 4 layers of !important:**
- Layer 1: "v16 FINAL LUXURY POLISH" (lines ~1200-1400) — 186 !important
- Layer 2: "v16 OWNER DESIGN SURGICAL FIXES" (lines ~1600-1800) — overrides Layer 1
- Layer 3: "v16 PURITAN ANTIQUE BRASS LUXURY" (lines ~1800-2000) — overrides Layer 2
- Layer 4: "GILL MOBILE REFERENCE LOCK V3" (lines ~2400-2882) — 278 !important, overrides all

**2. "GILL MOBILE REFERENCE LOCK V3" section:**
- 480 lines (17% of file)
- 278 !important (53% of file's !important)
- MAX_INT z-index values
- Comment explicitly acknowledges: "overrides older layered 'luxury polish' rules"

**3. Duplicate :root definitions:**
- First definition (lines 10-28): 19 variables
- Second definition inside @layer (lines 32-54): 23 variables with **different values**
- Creates cascade confusion

### File structure

```
floating-cluster.css (2882 lines, 106KB)
├── :root variables (2 definitions) — BUG-CSS-006
├── @layer components (base components)
├── Gill v16 Series Rail (desktop)
│   └── .gbs-rail-foot — duplicate — BUG-CSS-010
├── Gill v16 Mobile Bar
├── TOC Popups
├── v16 FINAL LUXURY POLISH — BUG-CSS-008 Layer 1
├── v16 OWNER DESIGN SURGICAL FIXES — BUG-CSS-008 Layer 2
├── v16 PURITAN ANTIQUE BRASS LUXURY — BUG-CSS-008 Layer 3
├── Play Ember Speed Pill
├── Favorites Block
├── v16 Layout + Responsive Layer
├── Gill UI Polish Hotfix 2026-06-29
└── GILL MOBILE REFERENCE LOCK V3 — BUG-CSS-008 Layer 4, BUG-CSS-012
    └── 480 lines, 278 !important, MAX_INT z-index — BUG-CSS-009
```

### Impact analysis

**Current state:**
- Lines of code: 2882
- !important: 524 (18% of lines)
- Duplicate blocks: 4+
- Maintainability: 🔴 Critical (specificity wars)

**After refactoring (estimated):**
- Lines of code: ~1200 (60% reduction)
- !important: <50 (90% reduction)
- Duplicate blocks: 0
- Maintainability: 🟢 Good (CSS layers, single source of truth)

**Performance impact:**
- Current: 106KB CSS
- After deduplication: ~85KB (20% reduction)
- After consolidation: ~60KB (43% reduction)

### Full report

`incoming/arena-agent-pass69/REPORT.md`

---

## 🟢 PASS 70 — DEEP CSS CODE REVIEW: site.css (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `css/site.css` (575 lines, 275KB) — complete line-by-line audit

### New findings (6)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-CSS-013 | 🔴 P1 | Minified code in version control (difficult to read, debug, review) | OPEN |
| BUG-CSS-014 | 🔴 P1 | Mixed concerns — single file contains 7+ concerns (base, components, utilities, print, GBS, tooltips, animations) | OPEN |
| BUG-CSS-015 | 🟡 P2 | Duplicate body styles (3 definitions: unlayered Safari fallback + @layer reset + @layer base) | OPEN |
| BUG-CSS-016 | 🟡 P2 | Duplicate html{scroll-behavior:smooth} (defined twice) | OPEN |
| BUG-CSS-017 | 🟡 P2 | Duplicate alias variables in :root and html.dark (20+ aliases duplicated) | OPEN |
| BUG-CSS-018 | 🔵 P3 | Huge inline SVG in fn-marker--dove (~4KB, same path duplicated for light/dark) | OPEN |

### Key discoveries

**1. Minified code in version control:**
- Entire 575-line file is minified
- Difficult to read, debug, and review changes
- Git diffs show entire lines changed for small modifications
- No source maps for browser DevTools

**2. Mixed concerns — 7+ concerns in single file:**
| Concern | Lines (estimated) | % of file |
|---------|-------------------|-----------|
| Base styles (reset, typography) | ~50 | 9% |
| Component styles (breadcrumbs, cards, quiz) | ~250 | 43% |
| Utility classes (Tailwind-like shims) | ~30 | 5% |
| Print styles | ~40 | 7% |
| GBS-specific styles | ~100 | 17% |
| Tooltip styles | ~60 | 10% |
| Animation keyframes | ~25 | 4% |
| Dark mode overrides | ~20 | 3% |

**3. Duplicate body styles (3 definitions):**
- Definition 1 (line 2, unlayered Safari fallback): `body{margin:0;background:#fdfcf9;...}`
- Definition 2 (line 9, @layer reset): `body{margin:0}`
- Definition 3 (line 25, @layer base): `body{background:var(--color-canvas);...}`
- Unlayered styles override layered — cascade confusion

**4. Duplicate alias variables:**
```css
:root {
  --bg: var(--color-canvas);      /* Alias */
  --text: var(--color-text);      /* Alias */
  --border: var(--color-border);  /* Alias */
  /* ... 20+ aliases ... */
}

html.dark {
  --bg: var(--color-canvas);      /* DUPLICATE — not needed */
  --text: var(--color-text);      /* DUPLICATE — not needed */
  --border: var(--color-border);  /* DUPLICATE — not needed */
  /* ... 20+ duplicate aliases ... */
}
```
Aliases reference semantic variables which are already theme-aware — no need to duplicate.

**5. Huge inline SVG (~4KB):**
- fn-marker--dove contains ~2KB inline SVG for light theme
- html.dark .fn-marker--dove contains ~2KB inline SVG for dark theme
- Same SVG path, different fill color
- Should use CSS mask with currentColor instead

### Impact analysis

**Current state:**
- Lines of code: 575 (minified)
- File size: 275KB
- Concerns mixed: 7+ (base, components, utilities, print, GBS, tooltips, animations)
- Maintainability: 🔴 Critical (minified, mixed concerns)

**After refactoring (estimated):**
- Lines of code: ~1200 (unminified, split into 10+ files)
- File size: ~250KB (after deduplication and optimization)
- Concerns separated: Each file has single responsibility
- Maintainability: 🟢 Good (readable, separated concerns)

**Performance impact:**
- Current: 275KB single file (blocks rendering)
- After splitting: ~250KB total, but can load critical CSS first
- Critical CSS: ~30KB (loads immediately)
- Non-critical CSS: ~220KB (loads async)
- FCP improvement: ~40-50% faster (30KB vs 275KB blocking)

### Comparison with floating-cluster.css

| Metric | floating-cluster.css (Pass 69) | site.css (Pass 70) |
|--------|-------------------------------|-------------------|
| Lines | 2882 | 575 |
| Size | 106KB | 275KB |
| !important | 524 | 202 |
| Specificity layers | 4 | 0 |
| Minified | No | **Yes** |
| Concerns mixed | No (single component) | **Yes (7+ concerns)** |
| Duplicate styles | 4+ | 3+ |
| Inline SVG | 0 | **4KB** |
| Overall debt | 🔴 Critical | 🔴 Critical |

**Key differences:**
- **floating-cluster.css** has "specificity wars" (!important overriding !important)
- **site.css** has "mixed concerns" (everything in one file) and minification

**Both require complete refactoring**, but for different reasons.

### Full report

`incoming/arena-agent-pass70/REPORT.md`

---

## 📊 СВОДКА

| Уровень | Открыто | Закрыто |
|---|---|---|
| P0 (Critical) | 0 | 4 |
| P1 (High) | 9 | 8 |
| P2 (Medium) | 15 | 15 |
| P3 (Medium) | 3 | 5 |
| P3 (Refactor) | 4 | 0 |
| P3 (Cleanup) | 18 | 0 |
| AuditRepo | 3 | 0 |
| **Итого** | **52** | **32** |

*P0: BUG-CI-001 fixed in `6e68d7ca`. P1: BUG-CI-002/003 CI gate gaps + BUG-PERF-001 memory leaks (Pass 65) + BUG-CSS-001 1047 !important (Pass 68) + BUG-CSS-006/007/008 floating-cluster.css duplicate definitions + specificity wars (Pass 69) + BUG-CSS-013/014 site.css minified code + mixed concerns (Pass 70). P2: BUG-011 reclassified, BUG-ARCH-001 SW precache, BUG-SEO-001 IndexNow timing, BUG-QUALITY-001/002/003 innerHTML + console + missing WebP (Pass 64-65), BUG-A11Y-001 skip links (Pass 66), BUG-PERF-002 render-blocking CSS (Pass 67), BUG-CSS-002/003 hardcoded colors + breakpoints (Pass 68), BUG-CSS-009/010 MAX_INT z-index + duplicate .gbs-rail-foot (Pass 69), BUG-CSS-015/016/017 site.css duplicate styles (Pass 70). P3: 25 items (Pass 64-70). Deletions audit: all removals verified correct, no regressions. Data consistency: all JSON valid, no duplicates. CSS audit: 534KB total, critical technical debt. floating-cluster.css: 106KB, 524 !important, 4 specificity layers — requires complete refactor. site.css: 275KB, minified, 7+ concerns mixed — requires reorganization and build pipeline.*
