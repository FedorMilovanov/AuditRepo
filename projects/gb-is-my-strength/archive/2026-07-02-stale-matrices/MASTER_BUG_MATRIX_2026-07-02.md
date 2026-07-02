# MASTER BUG MATRIX — gb-is-my-strength

**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Passes:** 14 + PremiumControls reverification  
**Verifier:** arena-deep-auditor  
**Status:** ✅ VERIFIED & CONSOLIDATED

---

## 📊 ИТОГИ: 34 Verified Bugs

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 **P1** | 2 | Critical — немедленное исправление |
| 🟡 **P2** | 19 | High — требует исправления |
| 🔵 **P3** | 11 | Medium — можно исправить позже |
| ⚪ **S0** | 2 | Low — документация |

---

## 🔴 P1 — CRITICAL (2 bugs)

### BUG-001 / PC-102: Memory Leak в floating-cluster-controller.js
**File:** `js/floating-cluster-controller.js`  
**Issue:** 38 `addEventListener`, 0 `removeEventListener`  
**Impact:** Memory leak при длительных сессиях  
**Status:** ✅ Confirmed — SOLE remaining P1  
**Repair lane:** `lane/floating-cluster-cleanup`

### BUG-002: 44 компонента с duplication
**Files:** 39 `*PageHead.astro` + 5 `*PostArticle.astro`  
**Issue:** 92-93% copy-paste без base component  
**Impact:** Maintenance complexity, risk of desync  
**Status:** ✅ Confirmed  
**Repair lane:** `lane/pagehead-base-component`

---

## 🟡 P2 — HIGH PRIORITY (19 bugs)

### Security Issues (6)
| ID | Title | Files | Status |
|----|-------|-------|--------|
| **NEW-28** | Missing HSTS header | `articles/*/index.html` | ✅ Confirmed |
| **NEW-29** | Missing X-Frame-Options | `articles/*/index.html` | ✅ Confirmed |
| **NEW-33** | No global error handlers | `js/site.js`, `js/enhancements.js` | ✅ Confirmed |
| **BUG-034** | grid-template-rows: 0fr without fallback | `css/site.css` | ✅ Confirmed |
| **BUG-010** | 20 breakpoints (breakpoint chaos) | `css/site.css` | ✅ Confirmed |
| **NEW-39** | Font preload missing (FOUC) | `articles/*/index.html` | ✅ Confirmed |

### Performance Issues (4)
| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-005** | site.css and site-layered.css duplicate (277KB) | `css/` | ✅ Confirmed |
| **BUG-006** | site.js = 162.8KB (too large) | `js/site.js` | ✅ Confirmed |
| **BUG-013** | Critical CSS not preloaded | `articles/*/index.html` | ✅ Confirmed |
| **NEW-30** | No Lighthouse/performance monitoring | `package.json` | ✅ Confirmed |

### Data Consistency (4)
| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-007** | series.json field name inconsistency | `data/series.json` | ✅ Confirmed |
| **BUG-008** | 17 search-manifest items missing readTime | `data/search-manifest.json` | ✅ Confirmed |
| **BUG-009** | asset-version.js — два API | `src/lib/asset-version.js` | ✅ Confirmed |
| **BUG-012** | MDX vs HTML title mismatch (3 статьи) | `src/content/articles/*.mdx` | ✅ Confirmed |

### Build/Deploy (3)
| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-011** | CSS breakpoint conflict (768px overlap) | `css/site.css` | ✅ Confirmed |
| **BUG-014** | Race condition между dist scripts | `package.json` | ✅ Confirmed |
| **BUG-015** | interactive-audit без server orchestration | `scripts/interactive-audit.js` | ✅ Confirmed |

### Code Quality (2)
| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-017** | Phantom CSS файл в документации | `AGENTS.md` §2 | ✅ Confirmed |
| **PC-101+107** | GillRailControls dead component + dead props | `src/components/ui/floating-cluster/GillRailControls.astro` | ✅ Confirmed (PC-107 new from arena-premiumcontrols-auditor) |

---

## 🔵 P3 — MEDIUM PRIORITY (11 bugs)

| ID | Title | Files | Status |
|----|-------|-------|--------|
| **NEW-31** | Missing Referrer-Policy | `articles/*/index.html` | ✅ Confirmed |
| **NEW-32** | Missing Permissions-Policy | `articles/*/index.html` | ✅ Confirmed |
| **BUG-020** | 336 buttons без aria-label | `articles/*/index.html` | ✅ Confirmed |
| **BUG-021** | 2 короткие meta descriptions | `baptisty-rossii/*/index.html` | ✅ Confirmed |
| **BUG-022** | CSS selector conflicts (256 multi-defined) | `css/site.css` | ✅ Confirmed |
| **BUG-023** | Мёртвый атрибут data-gill-current-part | `GillSeriesOverlay.astro` | ✅ Confirmed |
| **BUG-024** | Мёртвый TypeScript API | `src/lib/asset-version.js` | ✅ Confirmed |
| **BUG-025** | Устаревшие CSS селекторы в openSearch() | `js/floating-cluster-controller.js` | ✅ Confirmed |
| **BUG-035** | FAQ accordion grid-template-rows without fallback | `css/site.css` | ✅ Confirmed |
| **BUG-036** | scrollbar-gutter without fallback | `css/site.css` | ✅ Confirmed |
| **PC-107** | GillRailControls dead TypeScript props | `GillRailControls.astro` | ✅ Confirmed (new) |

---

## ⚪ S0 — DOCUMENTATION (2 bugs)

| ID | Title | Files | Status |
|----|-------|-------|--------|
| **BUG-026** | AGENTS.md §12.5.7 дублируется | `AGENTS.md` | ✅ Confirmed |
| **BUG-027** | AGENTS.md changelog r300-r308 numbering conflicts | `AGENTS.md` | ✅ Confirmed |

---

## ✅ CLOSED / FIXED-CURRENT

| ID | Title | Previous Status | New Status | Evidence |
|----|-------|-----------------|------------|----------|
| **PC-CURRENT-06** | Gill mobile current series item → part TOC flow | needs-manual-check | ✅ **fixed-current** | Browser verified — `gill:mobile-play:smoke` 120+ checks green — `mobPartTocBtn`/`partTocOverlay`/`seriesTocOverlay` all present — code in lines 774-879 |

---

## 🏆 PREMIUM UI SCORES

| Component | Score | Status |
|-----------|-------|--------|
| **Floating Cluster** | 9.5/10 | ✅ World-class |
| **GBS2 Series World** | 9.3/10 | ✅ World-class |
| **Command Palette** | 9/10 | ✅ Excellent |
| **Nagornaya Page** | 9/10 | ✅ Excellent |
| **Premium Controls** | 9/10 | ✅ Excellent |

---

## 🔧 REPAIR PRIORITY MATRIX

### Phase 1: Critical (Week 1)
1. **BUG-001 / PC-102** — Memory leak — add `cleanup()` method
2. **NEW-28, NEW-29** — Add HSTS + X-Frame-Options headers
3. **NEW-39** — Add font preloads (Inter, PlayfairDisplay)

### Phase 2: High (Week 2)
4. **BUG-005** — Remove duplicate css/site-layered.css (277KB savings)
5. **BUG-010** — Consolidate 20 breakpoints → 5-7
6. **BUG-007,008** — Fix readingTime field naming
7. **BUG-012** — Sync MDX and HTML titles
8. **PC-101+107** — Delete/unify GillRailControls

### Phase 3: Medium (Week 3)
9. **BUG-020** — Add aria-labels to 336 buttons
10. **NEW-31,32** — Add Referrer-Policy + Permissions-Policy
11. **BUG-034,35** — Add @supports fallbacks for grid-template-rows: 0fr
12. **BUG-006** — Split site.js into modules

### Phase 4: Low (Week 4+)
13. **BUG-022,23,24,25** — Clean up dead code
14. **BUG-026,27** — Fix AGENTS.md documentation
15. **PC-104** — Remove openSearch dead selectors

---

## 📈 AUDIT COVERAGE

### Passes
| # | Focus | Findings |
|---|-------|----------|
| 1-11 | Runtime/Security/SEO/Performance | 36 bugs |
| 12 | Premium UI Overview | 8.5/10 |
| 13 | Premium UI Detailed | 9.2/10 |
| 14 | GBS2 Series World | 9.3/10 |
| PC-1 | PremiumControls (static) | PC-101..PC-107 |
| PC-2 | PremiumControls (browser) | PC-CURRENT-06 fixed |
| **Verifier** | **Cross-reference + integration** | **34 final** |

### Statistics
- **Total passes:** 16 (14 deep + 2 PremiumControls)
- **Total findings analyzed:** 50+
- **Verified bugs:** 34
- **Fixed bugs:** 1 (PC-CURRENT-06)
- **False positives removed:** 5
- **Positive checks:** 35+

---

## 📁 FILES IN AUDIT REPO

```
AuditRepo/projects/gb-is-my-strength/
├── incoming/
│   ├── arena-deep-auditor/2026-07-02/
│   │   ├── REPORT.md
│   │   ├── CONSOLIDATED_AUDIT_REPORT_FINAL.md
│   │   ├── PREMIUM_UI_AUDIT_REPORT.md
│   │   ├── PREMIUM_UI_DETAILED_ANALYSIS.md
│   │   ├── GBS2_DETAILED_ANALYSIS.md
│   │   ├── PASS9_AUDIT_REPORT.md
│   │   ├── PASS10_AUDIT_REPORT.md
│   │   └── PASS11_AUDIT_REPORT.md
│   └── arena-premiumcontrols-auditor/2026-07-02/
│       ├── REPORT.md
│       ├── REVERIFY_PC_CURRENT_06_2026-07-02.md
│       └── VERIFIER_ADDENDUM_2026-07-02.md
└── verified/
    └── MASTER_BUG_MATRIX_2026-07-02.md  ← THIS FILE
```

---

**Аудитор:** arena-deep-auditor  
**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Статус:** ✅ MASTER MATRIX VERIFIED & CONSOLIDATED
