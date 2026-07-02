# Verified Bug Matrix — Pass 7 Update

**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Pass:** 7 (Security/Performance/TypeScript)  
**Статус:** ✅ Верифицированная матрица (29 багов)

---

## 📊 Summary: 29 Unique Bugs

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 **P1** | 3 | Critical — немедленное исправление |
| 🟡 **P2** | 17 | High — требует исправления |
| 🔵 **P3** | 7 | Medium — можно исправить позже |
| ⚪ **S0** | 2 | Low — документация |

**Изменения от Pass 6:**
- ➕ NEW-28 [P2]: Missing HSTS header
- ➕ NEW-29 [P2]: Missing X-Frame-Options
- ➕ NEW-30 [P3]: No Lighthouse/performance monitoring

---

## 🆕 New Findings (Pass 7)

### NEW-28 [P2]: Missing HSTS header in ALL articles
**Files:** `articles/*/index.html`  
**Problem:** 0 out of 10 articles have `Strict-Transport-Security` header  
**Impact:** No HTTPS enforcement, vulnerable to protocol downgrade attacks  
**Evidence:** `grep -r "Strict-Transport-Security" articles/` → 0 results  
**Fix:** Add `<meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains">` to all articles

---

### NEW-29 [P2]: Missing X-Frame-Options in ALL articles
**Files:** `articles/*/index.html`  
**Problem:** 0 out of 10 articles have `X-Frame-Options` header  
**Impact:** Vulnerable to clickjacking attacks  
**Evidence:** `grep -r "X-Frame-Options" articles/` → 0 results  
**Fix:** Add `<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">` to all articles

---

### NEW-30 [P3]: No Lighthouse/performance monitoring scripts
**Files:** `package.json`, `scripts/`  
**Problem:** No dedicated scripts for Core Web Vitals tracking (LCP, FID, CLS)  
**Impact:** Cannot monitor performance regression  
**Evidence:** `grep -r "lighthouse\|web-vitals" package.json scripts/` → only 1 comment in audit-pro.js  
**Fix:** Add `npm run lighthouse:ci` or integrate Web Vitals tracking

---

## 🔴 P1 — Critical (3 bugs)

| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-001** | Memory leak в floating-cluster-controller.js | `js/floating-cluster-controller.js` | ✅ Still present |
| **BUG-002** | 44 компонента с duplication | `src/components/**/PageHead.astro`, `*PostArticle.astro` | ✅ Still present |
| **BUG-003** | SW precache gate orchestration | `sw.js`, `package.json` | ✅ Still present |

---

## 🟡 P2 — High Priority (17 bugs)

| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-005** | site.css и site-layered.css дублируют друг друга | `css/site.css`, `css/site-layered.css` | ✅ Still present |
| **BUG-006** | site.js = 162.8KB | `js/site.js` | ✅ Still present |
| **BUG-007** | series.json field name inconsistency | `data/series.json` | ✅ Still present |
| **BUG-008** | 17 search-manifest items missing readTime | `data/search-manifest.json` | ✅ Still present |
| **BUG-009** | asset-version.js — два API | `src/lib/asset-version.js` | ✅ Still present |
| **BUG-010** | CSS breakpoint chaos — 20 разных breakpoints | `css/site.css` | ✅ Still present |
| **BUG-011** | CSS breakpoint conflict — max-width:768px vs min-width:768px | `css/site.css` | ✅ Still present |
| **BUG-012** | MDX vs HTML title mismatch (3 статьи) | `src/content/articles/*.mdx`, `articles/*/index.html` | ✅ Still present |
| **BUG-013** | Critical CSS не preloaded | `articles/*/index.html` | ✅ Still present |
| **BUG-014** | Race condition между dist scripts | `package.json` | ✅ Still present |
| **BUG-015** | interactive-audit требует сервер без orchestration | `scripts/interactive-audit.js` | ✅ Still present |
| **BUG-016** | ~62 CSS custom properties не используются | `css/site.css` | ✅ Still present |
| **BUG-017** | Phantom CSS файл в документации | `AGENTS.md` §2 | ✅ Still present |
| **BUG-018** | Документация !important не соответствует реальности | `AGENTS.md` §4.2 | ✅ Still present |
| **BUG-019** | search.js trailing slash bug (latent) | `js/search.js` | ✅ Still present |
| **NEW-28** | Missing HSTS header | `articles/*/index.html` | 🆕 NEW |
| **NEW-29** | Missing X-Frame-Options | `articles/*/index.html` | 🆕 NEW |

---

## 🔵 P3 — Medium Priority (7 bugs)

| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-020** | 336 buttons без aria-label | `articles/*/index.html` | ✅ Still present |
| **BUG-021** | 2 короткие meta descriptions | `baptisty-rossii/*/index.html` | ✅ Still present |
| **BUG-022** | CSS selector conflicts — 256 multi-defined | `css/site.css` | ✅ Still present |
| **BUG-023** | Мёртвый атрибут data-gill-current-part | `GillSeriesOverlay.astro` | ✅ Still present |
| **BUG-024** | Мёртвый TypeScript API | `src/lib/asset-version.js` | ✅ Still present |
| **BUG-025** | Устаревшие CSS селекторы в openSearch() | `js/floating-cluster-controller.js` | ✅ Still present |
| **NEW-30** | No Lighthouse/performance monitoring | `package.json`, `scripts/` | 🆕 NEW |

---

## ⚪ S0 — Documentation (2 bugs)

| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-026** | AGENTS.md §12.5.7 дублируется | `AGENTS.md` | ✅ Still present |
| **BUG-027** | AGENTS.md changelog r300-r308 numbering conflicts | `AGENTS.md` | ✅ Still present |

---

## ✅ Positive Checks (Pass 7)

| Check | Result |
|-------|--------|
| Content-Security-Policy | ✅ 10/10 articles have CSP |
| TypeScript configuration | ✅ tsconfig.json exists, strict mode enabled |
| TypeScript files | ✅ 12 files, 1932 lines total |
| Error handling in JS | ✅ try/catch blocks present |
| All previous checks | ✅ Still valid (see Pass 6) |

---

## 🎯 Security Audit Summary

### Present ✅
- Content-Security-Policy: 10/10 articles

### Missing ❌
- Strict-Transport-Security (HSTS): 0/10 articles
- X-Frame-Options: 0/10 articles
- Referrer-Policy: not checked
- Permissions-Policy: not checked

### Recommendation
Add security headers to all articles:
```html
<meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

---

**Matrix location:** `AuditRepo/projects/gb-is-my-strength/verified/MATRIX_PASS7_UPDATED_2026-07-02.md`  
**Commit:** pending
