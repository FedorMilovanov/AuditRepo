# Verified Bug Matrix — Pass 7 DRAFT

**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Статус:** 🔄 Draft (ожидает верификации после Pass 7)

---

## 📊 Summary: 30 Unique Bugs (after Pass 7)

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 **P1** | 3 | Critical — немедленное исправление |
| 🟡 **P2** | 17 | High — требует исправления |
| 🔵 **P3** | 8 | Medium — можно исправить позже |
| ⚪ **S0** | 2 | Low — документация |

**Изменения от Pass 6:**
- 🆕 NEW-28 → BUG-028 [P2]: Security headers gap (HSTS, X-Frame-Options, Referrer-Policy)
- 🆕 NEW-29 → BUG-029 [P3]: React genealogy components are dead code
- 🆕 NEW-30 → BUG-030 [P2]: CSP mega-duplication (37 copies, 6 variants)
- 🆕 NEW-31 → BUG-031 [P3]: robots meta inconsistency (GillContext)
- ⚠️ BUG-005: P2 → P3 (site-layered.css не загружается ни в одной странице)
- 📝 BUG-002: 39+6 (было 39+5, PostArticle count +1)

---

## 🔴 P1 — Critical (3 bugs)

| ID | Title | Files | Status Pass 7 |
|----|-------|-------|---------------|
| **BUG-001** | Memory leak в floating-cluster-controller.js | `js/floating-cluster-controller.js` | ✅ 38 add, 0 remove — unchanged |
| **BUG-002** | 39 PageHead + 6 PostArticle компонентов | `src/components/**/*PageHead.astro` | ✅ Updated: PostArticle 5→6 |
| **BUG-003** | SW precache gate orchestration | `package.json` | ✅ sw:dist:audit still NOT in validate:static-publication |

---

## 🟡 P2 — High Priority (17 bugs)

| ID | Title | Files | Status Pass 7 |
|----|-------|-------|---------------|
| **BUG-006** | site.js = 163KB — слишком большой файл | `js/site.js` | ✅ Not re-checked (from matrix) |
| **BUG-007** | series.json field name inconsistency | `data/series.json` | ✅ hard-texts: 2 readingTime + 1 readTime |
| **BUG-008** | 17 search-manifest items missing readTime | `data/search-manifest.json` | ✅ Still 17 items missing |
| **BUG-009** | asset-version.js — два API | `src/lib/asset-version.js` | ✅ Not re-checked |
| **BUG-010** | CSS breakpoint chaos — 20 breakpoints | `css/site.css` | ✅ Not re-checked |
| **BUG-011** | CSS breakpoint conflict — 768px overlap | `css/site.css` | ✅ Not re-checked |
| **BUG-012** | MDX vs HTML title mismatch (3 статьи) | `src/content/articles/*.mdx` | ✅ Not re-checked |
| **BUG-013** | Critical CSS не preloaded | `articles/*/index.html` | ✅ Not re-checked |
| **BUG-014** | Race condition между dist scripts | `package.json` | ✅ Not re-checked |
| **BUG-015** | interactive-audit без orchestration | `scripts/interactive-audit.js` | ✅ Not re-checked |
| **BUG-016** | ~62 CSS custom properties не используются | `css/site.css` | ✅ Not re-checked |
| **BUG-017** | Phantom CSS файл в документации | `AGENTS.md` §2 | ✅ Not re-checked |
| **BUG-018** | Документация !important не соответствует | `AGENTS.md` §4.2 | ✅ Not re-checked |
| **BUG-019** | search.js trailing slash bug | `js/search.js` | ✅ Not re-checked |
| **BUG-022** | CSS selector conflicts — 256 multi-defined | `css/site.css` | ✅ Not re-checked |
| **BUG-028** | 🆕 Security headers gap (HSTS, X-Frame, Referrer) | All pages | ✅ NEW |
| **BUG-030** | 🆕 CSP mega-duplication (37 copies, 6 variants) | 37 Astro components | ✅ NEW |

---

## 🔵 P3 — Medium Priority (8 bugs)

| ID | Title | Files | Status Pass 7 |
|----|-------|-------|---------------|
| **BUG-005** | ⚠️ site-layered.css — dead file (278KB) | `css/site-layered.css` | ⚠️ **DOWNGRADED P2→P3** (not loaded anywhere) |
| **BUG-020** | 336 buttons без aria-label | `articles/*/index.html` | ✅ Not re-checked |
| **BUG-021** | 2 короткие meta descriptions | `baptisty-rossii/*/index.html` | ✅ Not re-checked |
| **BUG-023** | Мёртвый атрибут data-gill-current-part | `GillSeriesOverlay.astro` | ✅ Not re-checked |
| **BUG-024** | Мёртвый TypeScript API | `src/lib/asset-version.js` | ✅ Not re-checked |
| **BUG-025** | Устаревшие CSS селекторы в openSearch() | `js/floating-cluster-controller.js` | ✅ Not re-checked |
| **BUG-029** | 🆕 React genealogy components dead code | `src/components/genealogy/*.tsx` | ✅ NEW |
| **BUG-031** | 🆕 robots meta inconsistency (GillContext) | `GillContextPageHead.astro` | ✅ NEW |

---

## ⚪ S0 — Documentation (2 bugs)

| ID | Title | Files | Status Pass 7 |
|----|-------|-------|---------------|
| **BUG-026** | AGENTS.md §12.5.7 дублируется | `AGENTS.md` | ✅ Not re-checked |
| **BUG-027** | AGENTS.md changelog numbering conflicts | `AGENTS.md` | ✅ Not re-checked |

---

## 📈 Pass 7 Changes Summary

| Change | Details |
|--------|---------|
| BUG-002 count | PostArticle 5 → 6 |
| BUG-005 severity | P2 → P3 (dead file, not loaded) |
| +BUG-028 [P2] | Missing HSTS, X-Frame-Options, Referrer-Policy |
| +BUG-029 [P3] | React genealogy components never imported |
| +BUG-030 [P2] | CSP duplicated 37× with 6 variants |
| +BUG-031 [P3] | GillContext robots meta missing max-snippet |

---

**Matrix location:** `AuditRepo/projects/gb-is-my-strength/verified/VERIFIED_BUG_MATRIX_PASS7_DRAFT.md`  
**Status:** DRAFT — pending verification by a second agent
