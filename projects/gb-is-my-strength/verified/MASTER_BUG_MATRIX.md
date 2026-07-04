# MASTER BUG MATRIX — gb-is-my-strength (CONSOLIDATED)

**Консолидация:** 2026-07-04
**HEAD исходного репозитория:** `43a515df` (auto cache-bust [skip ci] after `30b9fe46` lazy-search)
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

Evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-04_search-legacy-lazy-init-30b9fe4.md`.

---


## 🟡 PASS 52 — DEEP AUDIT VERIFICATION (2026-07-04)

**Verified by:** Arena Agent (deep audit mode)  
**Source HEAD:** `43a515df`  
**Source HEAD (deployed):** `6e667978` (green deploy)  
**All 11 gates passed:** data:consistency, guard:shared-files, workflows:check, production-like build, audit:premium-controls (87/87), dist:css-parity, dist:jsonld, schema:rich-results, gill:context/spravochnik parity, dist-smoke (28/28 routes Playwright) ✅

### Findings

- **P2-SEARCH-EAGER scope confirmed:** lazy search (in BaseLayout) applies ONLY to article detail pages (ArticleLayout→BaseLayout). Catalog/index pages (/, /about/, /articles/, /karty/, /biografii/, /nagornaya/, /baptisty-rossii/) each have their own PageChrome with `<script src="./js/search.js" defer>` — still eager. Already documented as "partially fixed". To fully close, each PageChrome needs its own lazy-load inline script or shared helper.
- **CSS dynamic load confirmed valid:** `enhancements-runtime.css`, `highlights-runtime.css`, `sw-toast.css` are all legitimately loaded at runtime via JS-created `<link>` elements. Not dead code.
- **search-manifest.json:** generatedAt=2026-06-18 (16 days stale). All 44 entries point to valid files. 0 dead references (the `#dzhon-gill-series` anchor exists on `/biografii/`). Content valid but timestamp stale.
- **All 9 CSS + 11 JS files** in cache-bust-assets.js ✅
- **Gill v16 markers confirmed:** all 5 routes have `data-gill-v16` and `gb-roman` ✅
- **PremiumControls 87/87:** all PC-CURRENT items closed on current HEAD ✅
- **No XSS vectors:** no eval, new Function, or document.write. All innerHTML is hardcoded/static ✅
- **No stale branches:** only origin/main in both repos ✅

### New items added

None — all findings are refinements of existing open items.


## 📊 СВОДКА

| Уровень | Открыто | Закрыто |
|---|---|---|
| P0 (Critical) | 0 | 3 |
| P1 (High) | 0 | 6 |
| P2 (Medium) | 2* | 14 |
| P3 (Medium) | 2 | 5 |
| P3 (Refactor) | 4 | 0 |
| AuditRepo | 3 | 0 |
| **Итого** | **11** | **28** |

*P2: BUG-011 reclassified, SEARCH-EAGER partially fixed (Astro-native pages), REG-001 accepted risk (GitHub Pages limitation)*
