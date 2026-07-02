# Verified Bug Matrix — Pass 8 Update

**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Pass:** 8 (Security Deep Dive, Accessibility, Performance, Code Quality)  
**Статус:** ✅ Верифицированная матрица (31 багов)

---

## 📊 Summary: 31 Unique Bugs

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 **P1** | 3 | Critical — немедленное исправление |
| 🟡 **P2** | 19 | High — требует исправления |
| 🔵 **P3** | 7 | Medium — можно исправить позже |
| ⚪ **S0** | 2 | Low — документация |

**Изменения от Pass 7:**
- ➕ NEW-31 [P3]: Missing Referrer-Policy header
- ➕ NEW-32 [P3]: Missing Permissions-Policy header
- ✅ Verified: BUG-001, BUG-002, BUG-003 still present
- ✅ Verified: console.log is NOT a bug (protected by debug flag)

---

## 🆕 New Findings (Pass 8)

### NEW-31 [P3]: Missing Referrer-Policy header
**Files:** `articles/*/index.html`  
**Problem:** 0 out of 11 articles have `Referrer-Policy` header  
**Impact:** Browser uses default referrer policy, may leak sensitive URL information  
**Evidence:** `grep -r "Referrer-Policy" articles/` → 0 results  
**Fix:** Add `<meta name="referrer" content="strict-origin-when-cross-origin">` to all articles  
**Note:** This is a privacy/security best practice, not critical

---

### NEW-32 [P3]: Missing Permissions-Policy header
**Files:** `articles/*/index.html`  
**Problem:** 0 out of 11 articles have `Permissions-Policy` header  
**Impact:** Browser allows all features by default (camera, microphone, etc.)  
**Evidence:** `grep -r "Permissions-Policy" articles/` → 0 results  
**Fix:** Add `<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()">`  
**Note:** This is a security best practice, restricts browser features

---

## 🔍 Verification Results (Pass 8)

### ✅ BUG-001: Memory leak — STILL PRESENT
- **addEventListener:** 38 calls
- **removeEventListener:** 0 calls
- **Status:** Confirmed, needs fix

### ✅ BUG-002: PageHead duplication — STILL PRESENT
- **PageHead components:** 39 files
- **Status:** Confirmed, needs consolidation

### ✅ BUG-003: SW precache gate — STILL PRESENT
- **sw:dist:audit in validate:static-publication:** 0 matches
- **Status:** Confirmed, needs orchestration fix

### ✅ console.log — NOT A BUG
- **Location:** js/bookmark-engine.js
- **Context:** Inside `if(n.debug)` check
- **Status:** Protected by debug flag, only logs in debug mode

---

## 🟢 Positive Checks (Pass 8)

| Check | Result |
|-------|--------|
| X-Content-Type-Options | ✅ 11/11 articles |
| Skip links (accessibility) | ✅ 11/11 articles |
| ARIA labels | ✅ 236 uses |
| ARIA roles | ✅ 222 uses |
| Keyboard navigation (tabindex) | ✅ 178 uses |
| Lazy loading | ✅ 91 images |
| Preconnect hints | ✅ 3 domains |
| sitemap.xml | ✅ Exists (15KB) |
| robots.txt | ✅ Exists (2KB) |
| JSON-LD structured data | ✅ 11/11 articles |
| TypeScript strict violations | ✅ 0 violations |
| TODO/FIXME comments | ✅ 1 (acceptable) |
| console.error | ✅ 1 (minimal) |

---

## 📋 Complete Bug List (31 total)

### 🔴 P1 — Critical (3 bugs)
1. **BUG-001:** Memory leak в floating-cluster-controller.js
2. **BUG-002:** 44 компонента с duplication
3. **BUG-003:** SW precache gate orchestration

### 🟡 P2 — High Priority (19 bugs)
4. **BUG-005:** site.css и site-layered.css дублируют (277KB wasted)
5. **BUG-006:** site.js = 162.8KB
6. **BUG-007:** series.json field name inconsistency
7. **BUG-008:** 17 search-manifest items missing readTime
8. **BUG-009:** asset-version.js — два API
9. **BUG-010:** CSS breakpoint chaos (20 breakpoints)
10. **BUG-011:** CSS breakpoint conflict (768px overlap)
11. **BUG-012:** MDX vs HTML title mismatch (3 статьи)
12. **BUG-013:** Critical CSS не preloaded
13. **BUG-014:** Race condition между dist scripts
14. **BUG-015:** interactive-audit требует сервер без orchestration
15. **BUG-016:** ~62 CSS custom properties не используются
16. **BUG-017:** Phantom CSS файл в документации
17. **BUG-018:** Документация !important не соответствует реальности
18. **BUG-019:** search.js trailing slash bug (latent)
19. **NEW-28:** Missing HSTS header (0/11 статей)
20. **NEW-29:** Missing X-Frame-Options (0/11 статей)
21. **NEW-30:** No Lighthouse/performance monitoring

### 🔵 P3 — Medium Priority (7 bugs)
22. **BUG-020:** 336 buttons без aria-label
23. **BUG-021:** 2 короткие meta descriptions
24. **BUG-022:** CSS selector conflicts (256 multi-defined)
25. **BUG-023:** Мёртвый атрибут data-gill-current-part
26. **BUG-024:** Мёртвый TypeScript API
27. **BUG-025:** Устаревшие CSS селекторы в openSearch()
28. **NEW-31:** Missing Referrer-Policy (0/11 статей)
29. **NEW-32:** Missing Permissions-Policy (0/11 статей)

### ⚪ S0 — Documentation (2 bugs)
30. **BUG-026:** AGENTS.md §12.5.7 дублируется
31. **BUG-027:** AGENTS.md changelog r300-r308 numbering conflicts

---

## 🎯 Security Headers Summary

| Header | Status | Count |
|--------|--------|-------|
| Content-Security-Policy | ✅ Present | 11/11 |
| X-Content-Type-Options | ✅ Present | 11/11 |
| X-Frame-Options | ❌ Missing | 0/11 |
| Strict-Transport-Security | ❌ Missing | 0/11 |
| Referrer-Policy | ❌ Missing | 0/11 |
| Permissions-Policy | ❌ Missing | 0/11 |

**Recommendation:** Add all missing security headers to PageHead component

---

## 📈 Priority Matrix

| Priority | Bug IDs | Lane | Effort | Impact |
|----------|---------|------|--------|--------|
| 🔴 **Immediate** | BUG-001 | `lane/floating-cluster-cleanup` | Medium | High (memory leak) |
| 🔴 **Immediate** | BUG-002 | `lane/pagehead-base-component` | High | High (maintenance) |
| 🔴 **Immediate** | BUG-003 | `lane/sw-gate-coupling` | Low | High (CI/CD) |
| 🟡 **High** | NEW-28,29 | `lane/security-headers` | Low | High (security) |
| 🟡 **High** | BUG-005 | `lane/css-deduplication` | Medium | High (performance) |
| 🟡 **High** | BUG-010,11 | `lane/css-breakpoint-consolidation` | Medium | Medium (CSS quality) |
| 🟡 **High** | BUG-012 | `lane/mdx-html-sync` | Low | Medium (SEO) |
| 🔵 **Medium** | NEW-31,32 | `lane/security-headers` | Low | Low (privacy) |

---

**Matrix location:** `AuditRepo/projects/gb-is-my-strength/verified/MATRIX_PASS8_UPDATED_2026-07-02.md`  
**Commit:** pending
