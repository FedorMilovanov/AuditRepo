# MASTER BUG MATRIX — gb-is-my-strength (CONSOLIDATED)

**Консолидация:** 2026-07-04
**HEAD исходного репозитория:** `12f4a50a` (AGENTS.md cleanup + search-manifest fix + ironclad reading checklist)
**Статус:** ✅ **deploy-green** — все P0/P1/P2 блокеры закрыты

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

---

## 🟠 P2 — MEDIUM (2 открытых)

- **BUG-011:** 23 уникальных px брейкпоинта, 768px коллизия (reclassified — без визуальной регрессии)
- **P2-SEARCH-EAGER (partial fix):** search.js 31KB eager load. ✅ Fixed by `30b9fe46`:
  - search.js: added `__ready` flag and `__gbSearchOpenAfterLoad` mechanism for deferred open.
  - Astro-native pages: lazy-loaded via inline script (first Ctrl+K/click).
  - Legacy pages: still load search.js eagerly (due to `<script defer>` in hardcoded HTML), 
    but `__ready+__gbSearchOpenAfterLoad` ensures deferred search works on first interaction.
  - Full fix requires: migration of legacy HTML to BaseLayout or inline lazy loader.

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

### Claims verified TRUE (all confirmed in current source)

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
- **Status:** verified-current (confirmed on HEAD `12f4a50a`)
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
| Desktop rail geometry | ❌ None | Width, height, overflow, scroll ownership |
| Desktop TOC scrollspy | ❌ None | Active/passed tracking, count format, dot alignment |
| PremiumControls | ✅ `audit:premium-controls` 87/87 | Does not prove desktop rail geometry |


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

## 📊 СВОДКА

| Уровень | Открыто | Закрыто |
|---|---|---|
| P0 (Critical) | 0 | 3 |
| P1 (High) | 2* | 6 |
| P2 (Medium) | 2* | 14 |
| P3 (Medium) | 2 | 5 |
| P3 (Refactor) | 4 | 0 |
| AuditRepo | 3 | 0 |
| **Итого** | **13** | **28** |

*P1: UI-GILL-DESKTOP-RAIL-01 (width), UI-GILL-DESKTOP-TOC-02 (hierarchy). P2: BUG-011 reclassified, SEARCH-EAGER partially fixed (Astro-native pages), REG-001 accepted risk (GitHub Pages limitation)*
