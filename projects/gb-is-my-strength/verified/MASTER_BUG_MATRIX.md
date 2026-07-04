# MASTER BUG MATRIX — gb-is-my-strength (CONSOLIDATED)

**Консолидация:** 2026-07-04
**HEAD исходного репозитория:** `48dcda89` (docs-only descendant of search-manifest generatedAt refresh `bdaf6e8a`)
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
