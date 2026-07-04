# MASTER BUG MATRIX — gb-is-my-strength

> Единый реестр всех багов проекта gospod-bog.ru.  
> Дата консолидации: **2026-07-05** (полная реструктуризация из 2174-строчного документа).  
> Source HEAD: `d1941a6d` | AuditRepo HEAD: `e42d865`  
> Предыдущая версия: `archive/2026-07-05-matrix-pre-restructure/`

---

## ✅ ЗАКРЫТО (33 бага)

| ID | Описание | Коммит |
|---|---|---|
| P0-CRASH-001 | `r is not defined` (highlights.js) | `bced1c69` |
| P0-CRASH-002 | `tt is not defined` (site.js) | `ffc763bc` |
| P0-FC-REC | Бесконечная рекурсия FC controller | `ca6a25a8` |
| P1-NAGORNAYA | `SiteUtils is not defined` (script order) | `ffc763bc` |
| P1-CI-DUPE | Дублирование cache-bust в deploy | `6e667978` |
| P1-SITE-XSS | XSS санитизация innerHTML | `47a98da` |
| P1-LAYERED-CSS | 283KB мёртвый CSS удалён | `47a98da` |
| P1-DEPLOY-FAIL | deploy блокировка при indexnow | `29b49df` |
| P2-NAGORNAYA-SITEUTILS | `SiteUtils` без `window.` prefix | `19062297` |
| P2-SEARCH-EAGER | search.js eager load → lazy loader | `546f7016` |
| BUG-001 | Memory leak — addEventListener | `36003b91` |
| BUG-041 | sitemap — 8 missing routes | `36003b91` |
| BUG-CI-001 | deploy.yml двойной `run:` ключ (2 witnesses) | `6e68d7ca` |
| PC-CURRENT-06 | Gill mobile item → partTOC flow | V3 |
| UI-GILL-DESKTOP-RAIL-01 | Desktop rail 240→304px + submenu scrollspy | `79eab398` |
| UI-GILL-DESKTOP-TOC-02 | TOC hierarchy + scrollspy rewrite | `79eab398` |
| NEW-45 | Prefetch hints for navigation | `6e667978` |
| NEW-46 | llms.txt — 19 missing routes | `f284fc60` |
| NEW-48 | Stored XSS в Favorites.astro | `f284fc60` |
| NEW-59 | hard-texts OG dimensions (genuinely fixed) | `6cc68586` |
| NEW-64 | Runtime smoke in deploy | `8d0c12e0` |
| NEW-65 | Baptisty visual parity | `914c7fb1` |
| NEW-66 | SW/Pagefind deploy-switch | `d5c65647` |
| NEW-68/69 | CSP form-action regression | `14574a9a` |
| NEW-70 | sitemap stale lastmod | `a434b45e` |
| NEW-71 | README version drift | `da4a65cd` |
| NEW-README-ANCHOR-01 | README.md TOC stale anchor | `c82a8d4b` |
| NEW-CANONICAL-IZBRANNOE-01 | `/izbrannoe/` canonical relative→absolute | `563e85f3` |
| NEW-IMG-REGRESSION-01 | orphan-image cleanup broken refs | `fc5f94bd` |
| SEC-001-VERIFIER | innerHTML XSS — 3/6 полей без tt() | `3d242b1c` |
| NEW-SAFEURL-XSS-HARDENING | safeUrl() blocked only javascript: | `3d242b1c` |
| NEW-CACHE-BUST-ASTRO | Runtime CSS ?v= empty на 53 Astro-страницах | `6499d42e` |
| NEW-GITCONFIG-COMMITTED | .gitconfig agent identity в корне репо | `6499d42e` |
| BUG-CI-002 | `:light` gate aligned with `:full` — 3 missing checks added | `85a2fd65` |
| AUDIT-P1-CI-GATE-GAP | → merged into BUG-CI-002 (same root cause: indexnow.yml :light gate) | `85a2fd65` |
| BUG-CI-003 | indexnow.yml push retry: exit 1 + ::error:: после 3 fail | `85a2fd65` |
| NEW-ACTIONLINT-CI-GAP | actionlint v1.7.7 wired into shared-files-guard.yml | `85a2fd65` |
| NEW-OG-DIMENSIONS-HARDCODED | Seo.astro og:image:width/height → props с defaults 1200/630 | `85a2fd65` |
| BUG-CLEANUP-001 | 4 dead scripts (~23KB) удалены | `85a2fd65` |
| BUG-SEO-002 | robots.txt: `Allow: /llms.txt` во всех 14 заблокированных AI-ботах | `85a2fd65` |
| NEW-STALE-BRANCHES | 5 merged lane branches удалены с remote | `85a2fd65` |

---

## 🟠 P1 — ОТКРЫТО (2)

| ID | Описание | Witnesses |
|---|---|---|
| AUDIT-P1-FC-IMP | `floating-cluster.css`: 490 `!important`, audit-pro проверяет только site.css. Нет ceiling/ratchet. | АУДИТ 1.0 + verifier |
| BUG-PERF-001 | addEventListener без removeEventListener: 294 add / 16 remove в 5 JS-файлах | 2 witnesses |

## 🟡 P2 — ОТКРЫТО (9)

| ID | Описание | Witnesses |
|---|---|---|
| BUG-SW-BASELINE-DRIFT | SW baseline `v182` vs actual `v187` (5 версий). CI: note(), не bad(). ⚠️ Severity disputed: P0 vs P2. | АУДИТ 1.0, Pass 91 reclassified |
| AUDIT-P2-SW-PRECACHE-4 | SW PRECACHE содержит 4 lazy-loaded ассета (search.js, glossary.js, manifest.json, search-manifest.json) | АУДИТ 1.1 |
| BUG-ARCH-001 | = дубликат AUDIT-P2-SW-PRECACHE-4 (исходное описание: SW precache vs lazy loading) | АУДИТ 1.0 + verifier |
| AUDIT-P2-WORKFLOWS-CHECK-GAP | `check-workflows.js` не проверяет deploy `if:` условия — `|| failure` не ловится | АУДИТ 1.4 |
| AUDIT-P2-MATRIX-DRIFT | route-migration-matrix (35) ≠ page-ownership (54) ≠ sitemap (43). Нет cross-validation. | АУДИТ 1.0 |
| BUG-SEO-001 | IndexNow submit до реальной доступности на CDN | Pass 65 |
| NEW-CANONICAL-IZBRANNOE-01-GAP | canonicalSanityGuard не ловит relative canonical на noindex routes (tooling gap) | Pass 65 |
| BUG-SITEMAP-8-KARTY-MISSING | 8/10 karty/ routes не в sitemap.xml (early-church, maccabim, melachim, pavel, revelation, shoftim, shvatim, yeshua) — invisible to search engines |
| BUG-FRONTMATTER-INCONSISTENCY-01 | 9/20 MDX-статей (baptisty-rossii) без полей `draft`/`noindex`/`sourcesRequired` — системная несогласованность ArticleLayout vs SeriesArticleLayout | Pass 92 |

## 🟢 P3 — ОТКРЫТО (13)

| ID | Описание |
|---|---|
| BUG-SW-001 | sw.js `isFont()` — двойное отрицание, читаемость |
| AUDIT-P3-STYLE-DUP | enhancements/highlights inject CSS `<link>` без ID guard (дубликат при повторной загрузке) |
| AUDIT-P3-QUOTE-NO-CONFIRM | highlights.js delete без confirm() |
| BUG-CLEANUP-002 | `docs/refactor-2026/lanes/` — 31MB stale |
| BUG-CLEANUP-003 | `AUDIT_HISTORY.md` — 187KB stale |
| BUG-CLEANUP-004 | `docs/BUGS_FOUND_2026-06-25.md` — 78KB stale |
| NEW-CSS-BUDGET-01 | audit-pro CSS budget warning на каждом прогоне, не в backlog |
| NEW-OG-SIZE-PARAM | seo-audit.js hardcoded OG size check, нет per-route allowlist |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes: og:image ≠ LCP image |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | SW precache defeats lazy loader strategy |
| BUG-011 | 23 unique breakpoints, 768px collision |
| NEW-72 | SVG dedup micro-optimization (~1.9KB) |
| NEW-PREFETCH-UNCONDITIONAL | 5 prefetch hints на каждой странице включая саму себя |

## 🔵 P3 — РЕФАКТОРИНГ (4)

| ID | Описание |
|---|---|
| R-001 | site.js монолит ~167KB (15 модулей) |
| R-002 | enhancements.js монолит ~48KB |
| R-003 | Нет source maps |
| R-004 | Нет type="module"/tree-shaking |

## 🟣 AUDITREPO (3)

| ID | Описание |
|---|---|
| AR-001 | validate_audit_repo.py hardening |
| AR-004 | verification protocol automation |
| AR-005 | reverify automation |

---

## Примечания

### Дубликаты (объединены):
- **BUG-ARCH-001** = **AUDIT-P2-SW-PRECACHE-4** (одна суть: SW precache содержит lazy assets). Оставлено оба ID для обратной совместимости с reverify-документами.
- **NEW-CACHE-BUST-ASTRO** закрыто (`6499d42e`), но **AUDIT-P3-SEARCH-LAZY-CONFIRMED** и **AUDIT-P2-SW-PRECACHE-4** описывают ту же тему SW/lazy — не дубликаты, разные root causes.

### Severity dispute: BUG-SW-BASELINE-DRIFT
- **Pass 91 (agent):** P2 — "документационный drift, SW корректен, CI осознанно note()"
- **Pass 92 (agent):** P0 — "CI не фейлится при --require-cache-bump, deploy-safety gap"
- **Решение:** требуется owner decision. Помечен P2 с ⚠️.

### False positives (отклонённые находки):
- `AUDIT-P2-NODE-REGEX` — fabricated evidence (функция mustScript не существует). Archive: `archive/false-positive/`
- `AUDIT-P3-REACT-UNDOCUMENTED` — React IS used. Archive: `archive/false-positive/`
- `BUG-ASTRO-CONFIG-001` (Pass 88) — downgraded to INFO.
- `BUG-SITEMAP-8-KARTY-MISSING` — 8 karty/ routes are temporary placeholders with `data-pagefind-ignore`, intentionally excluded from sitemap by `check-map-publication-status.js`.
- `BUG-FRONTMATTER-INCONSISTENCY-01` — Zod schema uses `.default(false)` / `.default(true)`. Omitting fields is valid, not inconsistency.

### Архив:
- 36 incoming pass-папок → `archive/2026-07-05-incoming-consolidated/`
- Предыдущая 2174-строчная матрица → `archive/2026-07-05-matrix-pre-restructure/`
- 41 PASS evidence section из старой матрицы → `archive/2026-07-05-pass-evidence/`

---

## Статистика

| Категория | Количество |
|---|---|
| Закрыто (fixed) | 41 |
| P1 открыто | 2 |
| P2 открыто | 9 |
| P3 открыто | 13 |
| Рефакторинг | 4 |
| AuditRepo | 3 |
| **Всего открыто** | **31** |
| False positives отклонено | 3 |
| Passes processed | 93+ |
## 🟢 PASS 89 — HTML FILES AUDIT: about/index.html (2026-07-05)

**Agent:** arena-agent  
**Source HEAD:** `dea91376` (updated by other agents)  
**Scope:** `about/index.html` (336 lines, 34KB) — about page (sample)


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
>>>>>>> 6858a45 (audit(gb): Pass 80 — SEARCH final round: performance, analytics, offline, FCP, voice)

| ID | Description | Severity |
|----|-------------|----------|
| BUG-HTML-ABOUT-001 | Same inline scripts as index.html (not duplicated) | 🔵 P3 |
| BUG-HTML-ABOUT-002 | Same magic numbers as index.html (not duplicated) | 🔵 P3 |

### Positive Findings

✅ Good SEO meta tags  
✅ Good accessibility (skip-link, aria-labels)  
✅ Semantic HTML structure  
✅ JSON-LD with ProfilePage + Person + BreadcrumbList  
✅ Contact information with rel="me"  

### Conclusion

about/index.html follows same patterns as index.html. No new issues found. Same recommendations apply.

### Full Report

`incoming/arena-agent-pass89/REPORT.md`

