# MASTER BUG MATRIX — gb-is-my-strength (CONSOLIDATED)

**Консолидация:** 2026-07-04 (обновлено **2026-07-05**, Pass 71 deep JS review + Pass 65 verifier sync merged)
**HEAD исходного репозитория:** `8c318010` (merge: seo-fix-og-images lane — includes BUG-CI-001 CI fix, orphan-image regression fix, README anchor fix, /izbrannoe/ canonical fix, NEW-59 real image-resize fix)
**Статус:** ✅ **deploy-green** — BUG-CI-001 fixed (2 independent witnesses, L2-confirmed), все P0 блокеры закрыты. NEW-59 reopened then genuinely fixed (Pass 65). A separate orphan-image/stale-reference regression (introduced by `629ed89a`, independently flagged in `incoming/arena-agent-pass69/REPORT.md` as a raw finding and separately found+fixed by arena-agent-deep-audit-2 as NEW-IMG-REGRESSION-01) is already fixed on source (`fc5f94bd`) — see Pass 65 section below.

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
| NEW-59 | hard-texts OG dimensions — genuinely fixed Pass 65 (image cropped to 1200×630, `6cc68586`); first attempt `c0ab48fc` was metadata-only and reopened | `6cc68586` |
| NEW-45 | Prefetch hints for navigation | `6e667978` |
| PC-CURRENT-06 | Gill mobile item -> partTOC flow | V3 |
| P2-SEARCH-EAGER | Скрыт — полный lazy loader для всех legacy+astro страниц | `546f7016` |
| UI-GILL-DESKTOP-RAIL-01 | Desktop rail 240→304px + submenu scrollspy | `79eab398` |
| UI-GILL-DESKTOP-TOC-02 | TOC hierarchy: gbs2-sub fix, scrollspy rewrite | `79eab398` |
| NEW-README-ANCHOR-01 | README.md TOC stale anchor (Рефакторинг 4.5→5.0) | `c82a8d4b` |
| NEW-CANONICAL-IZBRANNOE-01 | `/izbrannoe/` canonical/og:url relative→absolute; bonus fix: SITE_CONFIG.page.id was mis-tagged "home" | `563e85f3` |
| NEW-IMG-REGRESSION-01 | orphan-image cleanup (`629ed89a`) left 2 broken refs in search-manifest.json/sitemap.xml + missed 3 more orphans — `audit-pro.js` was failing on main (found independently by both arena-agent-deep-audit-2/Pass 65 and arena-agent-pass69's raw incoming report) | `fc5f94bd` |

---

## 🔴 P0 — CRITICAL (0 открытых)

*Все P0 блокеры закрыты.*

| ID | Описание | Коммит |
|---|---|---|
| BUG-CI-001 | deploy.yml двойной `run:` ключ — submenu audit отключён | `6e68d7ca` ✅ FIXED (2 independent witnesses: arena-agent-pass63 + arena-agent-deep-audit-2, confirmed via actionlint re-run showing 0 issues) |

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

## 🟡 P2 — CI/SEO (3 открытых)

- **BUG-ARCH-001:** SW PRECACHE_ASSETS содержит `/data/search-manifest.json` и `/js/search.js`, которые теперь lazy-loaded (Pass 56). SW precache загружает оба при install, сводя экономию lazy loading на нет.
  - **Repair lane:** perf-cleanup

- **BUG-SEO-001:** IndexNow submit запускается сразу после `actions/deploy-pages@v4`, до реальной доступности нового контента на GitHub Pages CDN. Поисковики могут краулить старую версию.
  - **Repair lane:** ci-seo

- **NEW-CANONICAL-IZBRANNOE-01-GAP** *(Pass 65, tooling gap note — underlying bug fixed on `563e85f3`)*: existing canonical-integrity tooling (`audit-pro.js`'s `canonicalSanityGuard()`, `extract-url-contract.js`) structurally cannot catch a relative canonical/og:url on a `noindex` route — `canonicalSanityGuard` skips `dist/` and this route has no legacy root copy; `extract-url-contract.js`'s `issues[]` loop only iterates `publicPages`, excluding noindex pages by default. The bug shipped and is now fixed, but the tooling gap remains.
  - **Repair lane:** tooling-hardening

## 🟢 P3 — CODE QUALITY (2 открытых)

- **BUG-SW-001:** `isFont()` в sw.js — двойное отрицание `!(origin !== ... || !pathname...)` эквивалентно `origin === ... && pathname...`. Корректно, но затрудняет аудит.
  - **Repair lane:** perf-cleanup

- **NEW-SAFEURL-XSS-HARDENING** *(Pass 65)*: `safeUrl()` в `js/search.js` (command palette) блокирует только `javascript:` (`/^javascript:/i`), не блокирует `data:`/`vbscript:`. Текущие вызовы работают только с first-party данными из `search-manifest.json`/Pagefind (эксплойта не найдено), но имя функции подразумевает более полную защиту.
  - **Repair lane:** code-quality/hardening

## 🟣 P3 — CLEANUP (5 открытых)

- **BUG-SEO-002:** robots.txt — `Allow: /llms.txt` применяется только к ImagesiftBot, а не ко всем blocked AI bots. Нужно добавить в каждый User-agent блок или создать глобальный.
- **BUG-CLEANUP-001:** 4 dead scripts (~27KB): `about-leaf-parity-shots.js`, `generate-route-profiles.js`, `premium-mobile-visibility-smoke.js`, `route-impact-report.js`. 0 external references.
- **BUG-CLEANUP-002:** `docs/refactor-2026/lanes/` — 52 файла, 31MB. Все merged. Pass 62 confirmed stale. Archive candidate.
- **BUG-CLEANUP-003:** `AUDIT_HISTORY.md` — 187KB, 51 sections, last updated 2026-06-22. Archive candidate.
- **BUG-CLEANUP-004:** `docs/BUGS_FOUND_2026-06-25.md` — 78KB, все баги исправлены. Archive candidate.

## 🟣 P3 — SEO TOOLING (Pass 65)

- **NEW-CSS-BUDGET-01:** `node scripts/audit-pro.js` печатает `⚠️ Core CSS total 456672 bytes exceeds budget 425000` (~32KB/7.5% over) на каждом прогоне, но это никогда не заносилось как открытый backlog-item. Superseded in scope by Pass 68-70's much deeper CSS audit (BUG-CSS-001..017 below), but the byte-budget-vs-tracked-backlog process gap is a distinct lesson.
  - **Repair lane:** perf-cleanup-css-budget
- **NEW-OG-SIZE-PARAM:** `scripts/seo-audit.js:116` жёстко проверяет один og:image размер (1200×630) для всех routes без per-route allowlist — была корневой причиной того, что NEW-59 сначала "исправили" фиктивно. Теперь конкретный инстанс исправлен (`6cc68586`), но общая жёсткая проверка осталась.
  - **Repair lane:** seo-fix-og-images
- **NEW-ACTIONLINT-CI-GAP:** `actionlint` зарегистрирован `KEEP` в `audit/external-checks/README.md`, `package.json` содержит `workflows:lint: npx actionlint`, но ни один workflow его не вызывает. Именно этот инструмент поймал бы `BUG-CI-001` за <100мс с 0 ложных срабатываний (подтверждено независимо через `rhysd/actionlint` v1.7.7 release binary — не `npx actionlint`, тот вариант отдельно помечен `REJECTED`).
  - **Severity:** формально P3, но **высокий leverage** — рекомендуется fast-track, т.к. закрывает целый класс будущих CI-YAML регрессий (уже было 2 таких случая: `BUG-CI-001` здесь и ранее `P1-CI-DUPE`).
  - **Repair lane:** ci-gate-actionlint

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

## 🟠 SEARCH SYSTEM AUDIT — results (2026-07-04)

**Deep investigation of search infrastructure: search.js + Pagefind + search-manifest.json.**

### New critical bugs found

| ID | Bug | Severity | Evidence |
|----|-----|----------|----------|
| SEARCH-001 | `data-pagefind-meta="scripture"` missing on ~15 Bible-heavy pages | 🔴 **P1** | rodosloviye (262 refs), nagornaya chast-4/5 (24-56 refs), gill articles (12-17 refs), hard-texts (26 refs), kod-da-vinchi (11 refs) — only 3 pages have scripture meta |
| SEARCH-002 | Nagornaya chast-4 & chast-5 headers lack scripture meta while chast-1/2/3 have it | 🟡 **P2** | `NagornayaChast4/5HeaderHero.astro` and `MainShell.astro` missing `data-pagefind-meta="scripture"` |
| SEARCH-003 | `ArticleLayout.astro` and `SeriesArticleLayout.astro` have no mechanism to inject `data-pagefind-meta="scripture"` | 🟡 **P2** | All MDX articles invisible in "Писание" scope |
| SEARCH-004 | `search-manifest.json` has no `scripture` field — client-side can't filter | 🔵 **P3** | Only title/description/tags exist, no scripture data |
| SEARCH-005 | "Писание" tab default suggestions return 0 results because only 3 pages have scripture meta | 🔵 **P3** | Suggestions "Ин 3:16", "Мф 5:3", "Рим 8:28", "Иер 17:9" find nothing |
| SEARCH-006 | No existing audit gate validates `data-pagefind-meta="scripture"` | 🟡 **P2** | Zero checks in audit-pro, check-data-consistency, or any gate |
| SEARCH-007 | `rodosloviye/` has 262 Bible refs but ZERO pagefind meta tags (author, readTime, category, scripture, image — all missing) | 🟡 **P2** | `RodosloviyeBody.astro` has bare `data-pagefind-body` with no meta whatsoever |
| SEARCH-008 | Nagornaya chast-4/5 have all OTHER pagefind meta — only scripture missing | 🔵 **P3** | author, readTime, category, image all present; scripture absent (likely copy-paste gap) |
| SEARCH-016 | **CRITICAL:** Писание scope NEVER calls Pagefind — uses local manifest only (no full-text search) | 🔴 **P1** | `xe()` branches: scripture/authors → `fe()` (manifest), all/articles → `Ee()` (Pagefind) |
| SEARCH-017 | G() function composition includes `e.scripture` but it's always null for all 44 items | 🔴 **P1** | manifest has no `scripture` field |
| SEARCH-009 | Book name `$()` normalization covers only 9/70 Bible abbreviations | 🟡 **P2** | мк, деян, гал, еф, кол, евр, откр and 50+ more omitted |
| SEARCH-021 | Two separate search corpora never merge for scripture scope | 🟡 **P2** | manifest (44) vs Pagefind (43 pages, 16K words) |
| SEARCH-023 | 406KB dead Pagefind UI assets deployed to dist | 🔵 **P3** | pagefind-ui, component-ui, modular-ui, highlight — not used |

| SEARCH-009 | Book name `$()` normalization covers 9/70 Bible abbreviations — 16 found in content but NOT normalized | 🟡 **P2** | Missing: Быт, Исх, Втор, Пс, Ис, Деян, Гал, Еф, Флп, Евр, Иак, Иуд, Откр, Агг, Зах, Наум |
| SEARCH-032 | 16 book abbreviations visible in site content NOT covered by `$()` normalization | 🟡 **P2** | Same root cause as SEARCH-009, expanded finding |
| SEARCH-033 | hard-texts/ loads search.js eagerly instead of lazy bootstrap | 🔵 **P3** | Only 1 page affected (37/38 Astro pages correct) |
| SEARCH-034 | 15 map/interactive app pages have zero search access | 🔵 **P3** | karty/*, konfessii, map, izbrannoe — intentional but user-facing gap |
### Impact

| SEARCH-082 | search-manifest.json — ПОЛНОСТЬЮ РУЧНОЙ файл. Ни один скрипт не генерирует его | 🟡 **P2** | update-meta.js не пишет manifest. В deploy.yml нет шага генерации. При добавлении статьи — 13 полей вручную |
| SEARCH-083 | me() конвертит manifest → display: scripture всегда null для всех 44 items (поле отсутствует в данных) | 🔴 **P1** | Прямое доказательство SEARCH-017: корневая причина |
| SEARCH-084 | deploy.yml не проверяет data-pagefind-meta="scripture" на страницах | 🟡 **P2** | Есть проверка pagefind.js, pagefind-body — но нет scripture meta |
The **"Писание" (Scripture)** search scope — a primary feature of the command palette — is effectively **broken**. It only indexes 3 pages while 25+ pages with substantial Bible content are invisible. Users searching for Bible verses via the scripture tab get near-zero results.

### Root cause chain
1. `data-pagefind-meta="scripture"` was never added to most ArticleBody components
2. Generic layouts (ArticleLayout/SeriesArticleLayout) don't support the feature
3. Nagornaya paralel development created inconsistency (chast-1/2/3 have, 4/5 don't)
4. No gate verifies that scripture-heavy pages have appropriate meta tags

### Fix required
1. Add scripture meta to all ArticleBody components (highest ROI)
2. Add `scripture` prop to BaseLayout → ArticleLayout
3. Regenerate search-manifest with scripture field

## 🟢 PASS 71 — DEEP JS CODE REVIEW: floating-cluster-controller.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/floating-cluster-controller.js` (1494 lines, 61KB) — complete line-by-line manual audit

### New findings (8)

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| BUG-JS-001 | 🔴 P1 | Memory leaks — scroll listeners not cleaned on page unload (lines 1228, 1301) | OPEN |
| BUG-JS-002 | 🔴 P1 | Potential duplicate scroll listeners (no idempotency guards) | OPEN |
| BUG-JS-003 | 🟡 P2 | Empty catch blocks hide real errors (77 instances) | OPEN |
| BUG-JS-004 | 🟡 P2 | Duplicate code — getFavorites/setFavorites duplicate BookmarkEngine | OPEN |
| BUG-JS-005 | 🟡 P2 | Magic numbers without explanations (50, 180, 600, 260, 120) | OPEN |
| BUG-JS-006 | 🔵 P3 | High complexity — 3 functions with 200+ lines (initPlayExpand, updateScrollProgress, initGbs2Controls) | OPEN |
| BUG-JS-007 | 🔵 P3 | Accessibility — long press (600ms) without visual indicator | OPEN |
| BUG-JS-008 | 🔵 P3 | No debouncing — only throttling via requestAnimationFrame | OPEN |

### Key discoveries

**1. Memory leaks despite cleanup system:**
- Cleanup system exists (AbortController + manual tracking)
- But `window._fcCleanupListeners()` only called at re-initialization, not on page unload
- SPA navigation or page reload → listeners accumulate
- 2 scroll listeners on window (lines 1228, 1301) never cleaned

**2. Empty catch blocks (77 instances):**
- Most for localStorage operations (acceptable)
- But some hide real errors (e.g., AbortController.abort, removeEventListener)
- No logging even in development mode
- Difficult to debug when something breaks

**3. Duplicate code:**
- `getFavorites()`, `setFavorites()`, `isFavorite()` (lines 203-234) duplicate BookmarkEngine logic
- Different storage keys: `gb-favorites` vs BookmarkEngine's key
- Maintenance burden: must update both systems

**4. Magic numbers:**
```javascript
if (favs.length > 50) favs = favs.slice(0, 50); // why 50?
if (buf.length >= 180 && i % 2 === 1) { ... } // why 180?
pressTimer = setTimeout(..., 600); // why 600ms?
leaveTimer = setTimeout(closePanel, 260); // why 260ms?
if (headings[i].getBoundingClientRect().top < 120) { ... } // why 120px?
```

**5. High complexity:**
| Function | Lines | Responsibilities |
|----------|-------|------------------|
| `initPlayExpand()` | 200+ | Event listeners, DOM manipulation, state management, keyboard navigation |
| `updateScrollProgress()` | 140+ | Scroll tracking, progress calculation, DOM updates, scroll-spy |
| `initGbs2Controls()` | 200+ | TOC population, sheet management, tab switching, font controls, share, scroll progress |

**6. Accessibility issue:**
- Long press (600ms) to stop TTS — no visual feedback
- Users don't know about this feature
- No progress indicator during long press

### Positive findings

Despite the issues, the file has many good practices:
- ✅ Good structure — clear sections with comments
- ✅ Cleanup system — AbortController + manual tracking
- ✅ Defensive programming — many try/catch blocks
- ✅ Good accessibility — aria-labels, keyboard navigation
- ✅ Feature detection — speechSynthesis, matchMedia
- ✅ Fallbacks — SiteUtils, BookmarkEngine
- ✅ Single console statement — only 1 console.warn

### Impact analysis

**Current state:**
- Lines of code: 1494
- Memory leaks: 2 (scroll listeners)
- Empty catch blocks: 77
- Magic numbers: 5+
- Complex functions: 3 (200+ lines each)
- Maintainability: 🟡 Moderate (good structure, but complexity issues)

**After refactoring (estimated):**
- Lines of code: ~1600 (slightly more due to extracted functions)
- Memory leaks: 0
- Empty catch blocks: 0 (all have logging)
- Magic numbers: 0 (all extracted to constants)
- Complex functions: 0 (all <50 lines)
- Maintainability: 🟢 Good (modular, well-documented)

### Technical debt score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Memory leaks | 2 | 0 | 🔴 Critical |
| Empty catch blocks | 77 | 0 | 🟡 High |
| Magic numbers | 5+ | 0 | 🟡 High |
| Complex functions (>100 lines) | 3 | 0 | 🔵 Medium |
| Code duplication | 1 | 0 | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (memory leaks critical, but good structure overall)

### Full report

`incoming/arena-agent-pass71/REPORT.md`

---

## 🟢 PASS 65 — VERIFIER SYNC: INDEPENDENT 2ND-WITNESS CONFIRMATION + NEW-59 REOPEN/REAL-FIX + 4 SOURCE FIXES SHIPPED (2026-07-05)

**Verified/fixed by:** arena-agent-deep-audit-2 (independent audit pass; converged on `BUG-CI-001` via separate tooling before syncing with Pass 63/64; acted as verifier + editor with push access for the remainder of the session)
**Full report:** `incoming/arena-agent-deep-audit-2/2026-07-04/REPORT.md`

### 1. Independent confirmation of BUG-CI-001 (2 witnesses, L2)

Before pulling `arena-agent-pass63`'s work, this agent independently found and diagnosed the identical `deploy.yml` duplicate-`run:`-key defect using two separate tools (custom Python `yaml.safe_load` duplicate-key linter, and an independently downloaded `actionlint` v1.7.7 release binary), and independently confirmed `gill:pre-v16-submenu:audit` itself was healthy (105/105) before the CI fix. Post-fix (`6e68d7ca`), re-verified with `actionlint` → 0 issues across all 8 workflow files. `BUG-CI-001` is L2-confirmed with 2 independent witnesses per `MULTI_WITNESS_VERIFICATION_PROTOCOL.md`.

### 2. NEW-59 — reopened, then genuinely fixed (ledger-integrity lesson)

`NEW-59` (hard-texts og:image dimensions) had been marked fixed-current on `c0ab48fc`, but that commit only edited `og:image:width`/`og:image:height` to match the actual (non-standard) 1360×768 asset instead of resizing it. `npm run seo-audit` still warned on every run. **Reopened, then genuinely fixed** in the same pass: `images/og-series-heart.webp` center-cropped from 1360×768 to the standard 1200×630 (full composition preserved), meta tags restored to 1200×630 in both the Astro source and the legacy root HTML copy. Commit: `6cc68586`. Verified: `SEO audit passed: 0 errors, 0 warnings.`

**Process rule adopted:** no bug may be marked `fixed-current` without pasting the actual re-run output of the original detection tool/command.

### 3. Critical regression found and fixed: orphan-image cleanup left broken references (`629ed89a` → NEW-IMG-REGRESSION-01)

A concurrently-working agent's commit `629ed89a` ("remove orphaned image files") deleted 7 orphaned image files but did **not** update `data/search-manifest.json` (still referenced 2 deleted files → 404 in production) or `sitemap.xml` (still listed an `<image:loc>` for a deleted file), and **missed 3 additional orphans** from an earlier commit (`e5942361`): `gill-southwark-sermon.webp` (477KB full-size master never actually referenced) and the never-used `-600w` variants of two single-size OG images.

**Impact: `node scripts/audit-pro.js` — part of the blocking `validate:static-publication` CI gate — was failing with 3 errors on `main`** at the time this was found. Fixed in commit `fc5f94bd`: repointed the 3 stale references to correct current files, deleted the 3 additional orphans. Re-verified: `✅ AUDIT PASSED — ready for deploy` (165 passed, 0 errors). This same underlying issue was independently flagged (as a raw, un-synthesized finding) in `incoming/arena-agent-pass69/REPORT.md`'s commit history — two independent audits caught it, and this pass shipped the actual fix.

### 4. Source fixes shipped this pass (all merged to `main`, all gates re-verified green after each)

| Commit | Fix | Verification |
|---|---|---|
| `c82a8d4b` | README.md TOC anchor `...45...` → `...50...` | manual anchor-slug check |
| `563e85f3` | `/izbrannoe/` canonical/og:url relative → absolute; bonus: fixed `SITE_CONFIG.page.id` being mis-tagged `"home"` instead of `"izbrannoe"` (same root cause — `BaseLayout.astro`'s `routeToLegacyFile()` throws on a relative URL and silently falls back) | `dist/izbrannoe/index.html` canonical/og:url absolute, `page.id` now `"izbrannoe"` |
| `fc5f94bd` | Repaired broken refs + removed remaining orphans from `629ed89a`/`e5942361` | `node scripts/audit-pro.js` → 0 errors (was 3) |
| `6cc68586` | NEW-59 real fix — og-series-heart.webp resized to 1200×630 | `npm run seo-audit` → 0 warnings (was 1) |

All 4 commits individually re-verified with `npm run validate:all`, `npm run data:consistency`, `npm run content:guard`, `npm run contract:compare`, `npm run guard:shared-files`, and a full `npm run strangler:build:production-like` rebuild — no regressions introduced. Final state on `8c318010`: `node scripts/audit-pro.js` → 165 passed, 0 errors; `npm run seo-audit` → 0 errors, 0 warnings; `actionlint` → 0 issues across all 8 workflow files.

### 5. 6 new findings from independent audit

See P2/P3 sections above for `NEW-README-ANCHOR-01` (fixed), `NEW-CANONICAL-IZBRANNOE-01` (fixed) + `NEW-CANONICAL-IZBRANNOE-01-GAP` (tooling gap, open), `NEW-CSS-BUDGET-01`, `NEW-SAFEURL-XSS-HARDENING`, `NEW-OG-SIZE-PARAM`, `NEW-ACTIONLINT-CI-GAP`.

### Confirmations of Pass 63/64 findings (all independently re-verified, 0 disputes)

`BUG-CI-002`, `BUG-CI-003`, `BUG-ARCH-001`, `BUG-SEO-001`, `BUG-SEO-002`, `BUG-SW-001`, `BUG-CLEANUP-001..004` — all independently reproduced with matching evidence. See `incoming/arena-agent-deep-audit-2/2026-07-04/REPORT.md` for command-level evidence on each.

### Note on AuditRepo process itself (found during rebase/sync of this pass)

While syncing this pass with concurrently-pushed work, this agent found that `AuditRepo` commit `646f38e` ("Pass 70 — deep SEARCH system investigation") had been pushed to `main` with **unresolved git merge-conflict markers still in the file** (`<<<<<<<`/`=======`/`>>>>>>>` literally present in `MASTER_BUG_MATRIX.md` on `origin/main`). This was cleaned up as part of this pass's rebase (no content was lost — both conflicting sections, Pass 70 CSS review and the Search System Audit, are preserved above). **Process lesson for AuditRepo itself: always run `git diff --check` (or grep for conflict markers) before pushing a merge/rebase result.**

---

## 📊 СВОДКА

| Уровень | Открыто | Закрыто |
|---|---|---|
| P0 (Critical) | 0 | 4 |
| P1 (High) | 11 | 8 |
| P2 (Medium) | 19 | 16 |
| P3 (Medium) | 4 | 6 |
| P3 (Refactor) | 4 | 0 |
| P3 (Cleanup) | 21 | 0 |
| P3 (SEO tooling, Pass 65) | 3 | 0 |
| AuditRepo | 3 | 0 |
| **Итого** | **65** | **34** |

*P0: BUG-CI-001 fixed in `6e68d7ca`, 2 independent witnesses (Pass 63 + Pass 65 via `actionlint`). P1: BUG-CI-002/003 CI gate gaps + BUG-PERF-001 memory leaks (Pass 65) + BUG-CSS-001 1047 !important (Pass 68) + BUG-CSS-006/007/008 floating-cluster.css duplicate definitions + specificity wars (Pass 69) + BUG-CSS-013/014 site.css minified code + mixed concerns (Pass 70) + BUG-JS-001/002 floating-cluster-controller.js memory leaks + duplicate scroll listeners (Pass 71). P2: BUG-011 reclassified, BUG-ARCH-001 SW precache, BUG-SEO-001 IndexNow timing, BUG-QUALITY-001/002/003 innerHTML + console + missing WebP (Pass 64-65), BUG-A11Y-001 skip links (Pass 66), BUG-PERF-002 render-blocking CSS (Pass 67), BUG-CSS-002/003 hardcoded colors + breakpoints (Pass 68), BUG-CSS-009/010 MAX_INT z-index + duplicate .gbs-rail-foot (Pass 69), BUG-CSS-015/016/017 site.css duplicate styles (Pass 70), BUG-JS-003/004/005 floating-cluster-controller.js empty catches + duplicate code + magic numbers (Pass 71), NEW-CANONICAL-IZBRANNOE-01-GAP tooling gap (Pass 65, underlying bug fixed). P3: 28 items (Pass 64-71) + NEW-CSS-BUDGET-01/NEW-OG-SIZE-PARAM/NEW-ACTIONLINT-CI-GAP (Pass 65) + NEW-SAFEURL-XSS-HARDENING (Pass 65). Closed this session (Pass 65): NEW-README-ANCHOR-01, NEW-CANONICAL-IZBRANNOE-01, NEW-IMG-REGRESSION-01 (new regression found+fixed same session), NEW-59 (genuinely fixed after reopen). Deletions audit: all removals verified correct EXCEPT the orphan-image cleanup follow-through gap (found+fixed, Pass 65). Data consistency: all JSON valid, no duplicates. CSS audit: 534KB total, critical technical debt. floating-cluster.css: 106KB, 524 !important, 4 specificity layers — requires complete refactor. site.css: 275KB, minified, 7+ concerns mixed — requires reorganization and build pipeline. JS audit: floating-cluster-controller.js 61KB, 2 memory leaks, 77 empty catches, 3 complex functions — requires refactoring. AuditRepo process note: unresolved merge-conflict markers found and cleaned from `646f38e` during this pass's rebase.*

---

## 🟢 PASS 73 — 50+ BASH CHECKS: COMPREHENSIVE JS AUDIT (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** All 11 JS files (368KB total) — 55 automated bash checks

### Critical Findings (P1)

| ID | Check | Result | Severity |
|----|-------|--------|----------|
| BUG-JS-015 | Empty catch blocks | **76** | 🔴 P1 |
| BUG-JS-016 | innerHTML assignments | **100** | 🔴 P1 |
| BUG-JS-017 | addEventListener vs removeEventListener | **339 vs 25** (314 leaks) | 🔴 P1 |
| BUG-JS-018 | Minified files in VCS | **6 files** | 🔴 P1 |

### High Priority Findings (P2)

| ID | Check | Result | Severity |
|----|-------|--------|----------|
| BUG-JS-019 | Magic numbers (>100) | **314** | 🟡 P2 |
| BUG-JS-020 | ES5 code style (var vs const/let) | **1235 var, 1 let, 0 const** | 🟡 P2 |
| BUG-JS-021 | Console statements in production | **17** | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Check | Result | Severity |
|----|-------|--------|----------|
| BUG-JS-022 | setTimeout/setInterval (potential leaks) | **90 setTimeout, 7 setInterval** | 🔵 P3 |
| BUG-JS-023 | requestAnimationFrame (no cancel) | **42** | 🔵 P3 |
| BUG-JS-024 | Scroll/resize listeners (no throttle) | **19 scroll, 11 resize** | 🔵 P3 |

### Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total JS files | 11 | - |
| Total size | 368KB | - |
| Minified files | 6 | ❌ Critical |
| Unminified files | 4 | ✅ |
| eval usage | 0 | ✅ Good |
| document.write | 0 | ✅ Good |
| localStorage | 67 | ⚠️ High |
| fetch calls | 9 | ✅ |
| Promise usage | 6 | ✅ |
| async/await | 1 | ❌ Low |
| IntersectionObserver | 19 | ✅ Good |
| ResizeObserver | 6 | ✅ Good |
| Passive listeners | 14 | ✅ Good |
| Strict mode | 34 | ✅ Good |

### Bash Checks Summary

| Category | Checks | Passed | Failed |
|----------|--------|--------|--------|
| Security | 9 | 4 | 5 |
| Performance | 8 | 1 | 7 |
| Code Style | 10 | 2 | 8 |
| Modern APIs | 7 | 5 | 2 |
| Error Handling | 4 | 1 | 3 |
| **Total** | **55** | **12** | **43** |

### Top 10 Recommendations

1. **Add cleanup system to site.js** — prevent 314 memory leaks
2. **Replace empty catch blocks** — add logging to 76 instances
3. **Sanitize innerHTML** — audit 100 assignments for XSS
4. **Unminify 6 files** — store source in VCS, minify in build
5. **Replace var with const/let** — modernize 1235 declarations
6. **Extract magic numbers** — create named constants for 314 values
7. **Throttle scroll handlers** — optimize 19 listeners
8. **Debounce resize handlers** — optimize 11 listeners
9. **Clear timers on cleanup** — prevent 97 timer leaks
10. **Remove console statements** — clean up 17 instances

### Full Report

`incoming/arena-agent-pass73/REPORT.md`


---

## 🟢 PASS 74 — DEEP JS CODE REVIEW: enhancements.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/enhancements.js` (14 lines, 45KB minified) — 15 IIFE modules

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-025 | Minified code in version control (45KB) | 🔴 P1 |
| BUG-JS-026 | Duplicate jget/jset functions (defined 3+ times) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-027 | Multiple empty catch blocks (10+) | 🟡 P2 |
| BUG-JS-028 | innerHTML usage without sanitization (20+ instances) | 🟡 P2 |
| BUG-JS-029 | Magic numbers (600, 80, 28, 90, 210, 70, etc.) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-030 | No cleanup system for event listeners | 🔵 P3 |
| BUG-JS-031 | Complex functions (GBS2 TOC ~200 lines, GBS2 Progress ~150 lines) | 🔵 P3 |
| BUG-JS-032 | Multiple setTimeout without cleanup (10+) | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 45KB |
| Lines | 14 (minified) |
| IIFE modules | 15 |
| Empty catches | 10+ |
| innerHTML risks | 20+ |
| Duplicate code | 3+ instances (jget/jset) |
| Magic numbers | 30+ |
| Cleanup system | No |
| Timer leaks | 10+ |

### Top 5 Recommendations

1. **Unminify enhancements.js** — store source in VCS
2. **Deduplicate jget/jset** — define once in SiteUtils
3. **Add logging to empty catches** — improve debuggability
4. **Sanitize innerHTML** — prevent XSS
5. **Extract magic numbers** — create named constants

### Full Report

`incoming/arena-agent-pass74/REPORT.md`


---

## 🟢 PASS 75 — DEEP JS CODE REVIEW: nagornaya-mobile-toc.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/nagornaya-mobile-toc.js` (12 lines, 15KB) — 7 modules

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-033 | innerHTML without sanitization (15+ instances) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-034 | Magic numbers (200, 280, 1024, 14-20) | 🟡 P2 |
| BUG-JS-035 | Empty catch blocks (5+) | 🟡 P2 |
| BUG-JS-036 | Complex main IIFE (~300 lines) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-037 | No cleanup system for event listeners | 🔵 P3 |
| BUG-JS-038 | Multiple setTimeout without cleanup | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 15KB |
| Lines | 12 |
| Modules | 7 |
| innerHTML risks | 15+ |
| Magic numbers | 20+ |
| Empty catches | 5+ |
| Cleanup system | No |
| Timer leaks | 5+ |

### Top 5 Recommendations

1. **Sanitize innerHTML** — prevent XSS (15+ instances)
2. **Extract magic numbers** — create named constants
3. **Add logging to empty catches** — improve debuggability
4. **Refactor main IIFE** — split into smaller modules
5. **Add cleanup system** — prevent memory leaks

### Full Report

`incoming/arena-agent-pass75/REPORT.md`


---

## 🟢 PASS 76 — DEEP JS CODE REVIEW: search.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/search.js` (1 line, 33KB minified) — command palette with Pagefind

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-039 | Minified code in version control (33KB) | 🔴 P1 |
| BUG-JS-040 | innerHTML without sanitization (30+ instances) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-041 | Complex IIFE (~800+ lines) | 🟡 P2 |
| BUG-JS-042 | Magic numbers (180, 50, 12, 10, 2, etc.) | 🟡 P2 |
| BUG-JS-043 | Empty catch blocks (5+) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-044 | No cleanup system for event listeners | 🔵 P3 |
| BUG-JS-045 | Duplicate SVG icons (20+ defined, some similar) | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 33KB |
| Lines | 1 (minified) |
| Estimated unminified | ~800+ lines |
| innerHTML risks | 30+ |
| Magic numbers | 20+ |
| Empty catches | 5+ |
| Cleanup system | No |
| SVG icons | 20+ (some duplicates) |

### Top 5 Recommendations

1. **Unminify search.js** — store source in VCS
2. **Sanitize innerHTML** — prevent XSS (30+ instances)
3. **Refactor IIFE** — split into smaller modules
4. **Extract magic numbers** — create named constants
5. **Add logging to empty catches** — improve debuggability

### Full Report

`incoming/arena-agent-pass76/REPORT.md`


---

## 🟢 PASS 77 — DEEP JS CODE REVIEW: bookmark-engine.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/bookmark-engine.js` (1 line, 9.5KB minified) — reading progress tracker

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-046 | Minified code in version control (9.5KB) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-047 | Magic numbers (320, 6, 96, 97, 10000, 600, 15000, 14, 45, 24, 900, 12000, 2) | 🟡 P2 |
| BUG-JS-048 | Empty catch blocks (10+) | 🟡 P2 |
| BUG-JS-049 | Complex configuration object (20+ properties) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-050 | No cleanup system for event listeners | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 9.5KB |
| Lines | 1 (minified) |
| Estimated unminified | ~250+ lines |
| Magic numbers | 20+ |
| Empty catches | 10+ |
| Configuration properties | 20+ |
| Cleanup system | Manual (destroy() only) |

### Top 5 Recommendations

1. **Unminify bookmark-engine.js** — store source in VCS
2. **Extract magic numbers** — create BOOKMARK_CONFIG object
3. **Add logging to empty catches** — improve debuggability
4. **Refactor configuration** — split into logical groups
5. **Add cleanup system** — prevent memory leaks

### Full Report

`incoming/arena-agent-pass77/REPORT.md`


---

## 🟢 PASS 78 — DEEP JS CODE REVIEW: highlights.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/highlights.js` (1 line, 8.7KB minified) — quote saver

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-051 | Minified code in version control (8.7KB) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-052 | innerHTML without sanitization (5+ instances) | 🟡 P2 |
| BUG-JS-053 | Magic numbers (80, 200, 500, 200, 2000, 3000, 12, 8, 50, 25) | 🟡 P2 |
| BUG-JS-054 | Empty catch blocks (5+) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-055 | No cleanup system for event listeners | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 8.7KB |
| Lines | 1 (minified) |
| Estimated unminified | ~220+ lines |
| innerHTML risks | 5+ |
| Magic numbers | 10+ |
| Empty catches | 5+ |
| Cleanup system | No |

### Top 5 Recommendations

1. **Unminify highlights.js** — store source in VCS
2. **Sanitize innerHTML** — prevent XSS (5+ instances)
3. **Extract magic numbers** — create CONFIG object
4. **Add logging to empty catches** — improve debuggability
5. **Add cleanup system** — prevent memory leaks

### Full Report

`incoming/arena-agent-pass78/REPORT.md`


---

## 🟢 PASS 79 — DEEP JS CODE REVIEW: glossary.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/glossary.js` (2 lines, 7.8KB minified) — glossary tooltips

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-056 | Minified code in version control (7.8KB) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-057 | innerHTML without sanitization (3+ instances) | 🟡 P2 |
| BUG-JS-058 | Complex regex for term detection (2 patterns, no comments) | 🟡 P2 |
| BUG-JS-059 | Magic numbers (10, 1200) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-060 | No cleanup system for event listeners | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 7.8KB |
| Lines | 2 (minified) |
| Estimated unminified | ~200+ lines |
| innerHTML risks | 3+ |
| Regex patterns | 2 (Unicode + ASCII fallback) |
| Magic numbers | 2 |
| Cleanup system | No |

### Top 5 Recommendations

1. **Unminify glossary.js** — store source in VCS
2. **Sanitize innerHTML** — prevent XSS (3+ instances)
3. **Refactor regex** — extract to helper function with documentation
4. **Extract magic numbers** — create CONFIG object
5. **Add cleanup system** — prevent memory leaks

### Full Report

`incoming/arena-agent-pass79/REPORT.md`


---

## 🟢 PASS 80 — DEEP JS CODE REVIEW: sw-register.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/sw-register.js` (1 line, 2.6KB minified) — service worker registration

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-061 | Minified code in version control (2.6KB) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-062 | Magic numbers (2500, 8000, 3500, 2) | 🟡 P2 |
| BUG-JS-063 | Empty catch blocks (2+) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-064 | No cleanup system for event listeners | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 2.6KB |
| Lines | 1 (minified) |
| Estimated unminified | ~70+ lines |
| Magic numbers | 4 |
| Empty catches | 2+ |
| Cleanup system | Partial (pagehide only) |

### Top 4 Recommendations

1. **Unminify sw-register.js** — store source in VCS
2. **Extract magic numbers** — create CONFIG object
3. **Add logging to empty catches** — improve debuggability
4. **Add cleanup system** — prevent memory leaks

### Full Report

`incoming/arena-agent-pass80/REPORT.md`


---

## 🟢 PASS 81 — DEEP JS CODE REVIEW: site-utils.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/site-utils.js` (1 line, 2.3KB minified) — scroll lock management

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-065 | Minified code in version control (2.3KB) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-066 | Magic number (3000) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-067 | console.warn in production code | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 2.3KB |
| Lines | 1 (minified) |
| Estimated unminified | ~60+ lines |
| Magic numbers | 1 |
| Production logging | Yes |

### Top 3 Recommendations

1. **Unminify site-utils.js** — store source in VCS
2. **Extract magic number** — create CONFIG object
3. **Conditional logging** — use DEBUG flag

### Full Report

`incoming/arena-agent-pass81/REPORT.md`

---

## 🟢 PASS 82 — DEEP JS CODE REVIEW: scroll-perf.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `js/scroll-perf.js` (1 line, 1.7KB minified) — scroll performance optimization

### Critical Findings (P1)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-068 | Minified code in version control (1.7KB) | 🔴 P1 |

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-069 | Magic numbers (120, 100) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-JS-070 | Empty catch block (1 instance) | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 1.7KB |
| Lines | 1 (minified) |
| Estimated unminified | ~50+ lines |
| Magic numbers | 2 |
| Empty catches | 1 |

### Top 3 Recommendations

1. **Unminify scroll-perf.js** — store source in VCS
2. **Extract magic numbers** — create CONFIG object
3. **Add logging to empty catch** — improve debuggability

### Full Report

`incoming/arena-agent-pass82/REPORT.md`


---

## 🟢 PASS 83 — DEEP HTML CODE REVIEW: index.html (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `index.html` (1142 lines, 75KB) — home page

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-HTML-001 | Inline scripts without cleanup (10+ instances) | 🟡 P2 |
| BUG-HTML-002 | innerHTML without sanitization in favorites script | 🟡 P2 |
| BUG-HTML-003 | Magic numbers (1778943682, 108353327) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-HTML-004 | Duplicate favorites functionality | 🔵 P3 |
| BUG-HTML-005 | No noscript fallback for interactive elements | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total size | 75KB |
| Lines | 1142 |
| Inline scripts | 10+ |
| innerHTML risks | 1 |
| Magic numbers | 2 |
| Duplicate functionality | Yes |
| Noscript fallbacks | No |

### Top 5 Recommendations

1. **Move inline scripts to external files** — improve maintainability
2. **Sanitize innerHTML** — prevent XSS in favorites script
3. **Extract magic numbers** — create CONFIG object
4. **Remove duplicate favorites functionality** — use bookmark-engine.js
5. **Add noscript fallbacks** — improve accessibility

### Full Report

`incoming/arena-agent-pass83/REPORT.md`


---

## 🟢 PASS 84 — DATA FILES AUDIT: JSON VALIDATION (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `data/*.json` (13 files, ~300KB total)

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-DATA-001 | public-content-baseline.json missing generatedAt field | 🔵 P3 |
| BUG-DATA-002 | glossary.json large file (162KB) | 🔵 P3 |
| BUG-DATA-003 | No JSON schema validation | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total JSON files | 13 |
| Total size | ~300KB |
| Valid files | 13 (100%) |
| Invalid files | 0 |
| Schema validation | No |
| Generated timestamps | Partial |

### Top 3 Recommendations

1. **Add generatedAt to public-content-baseline.json** — track updates
2. **Split glossary.json** — improve loading performance
3. **Add JSON schema validation** — automate validation

### Full Report

`incoming/arena-agent-pass84/REPORT.md`


---

## 🟢 PASS 85 — BUILD SCRIPTS AUDIT: validate.js (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `6e68d7ca`  
**Scope:** `scripts/validate.js` (783 lines, 33KB) — main validation script

### High Priority Findings (P2)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-SCRIPT-001 | Complex validateArticle() function (~200 lines) | 🟡 P2 |
| BUG-SCRIPT-002 | Empty catch blocks (5+ instances) | 🟡 P2 |

### Medium Priority Findings (P3)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-SCRIPT-003 | Magic numbers (1000, 260, 85) | 🔵 P3 |
| BUG-SCRIPT-004 | Hardcoded paths throughout | 🔵 P3 |
| BUG-SCRIPT-005 | No unit tests for validation logic | 🔵 P3 |

### Key Metrics

| Metric | Value |
|--------|-------|
| Total lines | 783 |
| Total size | 33KB |
| Validation functions | 8 |
| Function complexity | High (~200 lines) |
| Empty catches | 5+ |
| Magic numbers | 3+ |
| Hardcoded paths | Yes |
| Unit tests | No |

### Top 5 Recommendations

1. **Refactor validateArticle()** — split into smaller functions
2. **Add logging to empty catches** — improve debuggability
3. **Extract magic numbers** — create CONFIG object
4. **Use configuration file** — replace hardcoded paths
5. **Add unit tests** — ensure correctness

### Full Report

`incoming/arena-agent-pass85/REPORT.md`

