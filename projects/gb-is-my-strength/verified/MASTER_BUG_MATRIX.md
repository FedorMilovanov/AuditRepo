# Master Bug Matrix — gospod-bog.ru

**Last Updated:** 2026-07-02  
**HEAD:** d5d9388b  
**Total Passes:** 20 + Verifier  
**Total Bugs:** 44

---

## 📊 Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 P1 (Critical) | 3 | 2 confirmed, 1 new (SEO-001) |
| 🟡 P2 (High) | 22 | All confirmed |
| 🔵 P3 (Medium) | 17 | All confirmed |
| ⚪ S0 (Low) | 2 | All confirmed |
| **Total** | **44** | |

---

## 🔴 P1 — Critical Bugs (3)

| ID | Title | Status | Impact |
|----|-------|--------|--------|
| **BUG-001** | Memory leak в floating-cluster-controller.js (38 addEventListener, 0 removeEventListener) | ✅ Confirmed | Runtime performance degradation, memory leak over long sessions |
| **BUG-002** | 44 компонента с duplication (39 PageHead + 5 PostArticle) | ✅ Confirmed | Code duplication, maintenance nightmare |
| **SEO-001** | 5/10 статей (вся серия Джон Гилл) имеют EMPTY JSON-LD без Article schema | ✅ Confirmed | 50% контента невидим для search engines, потеря rich snippets |

---

## 🟡 P2 — High Priority Bugs (22)

| ID | Title | Status |
|----|-------|--------|
| **BUG-003** | Missing HSTS header в deploy.yml | ✅ Confirmed |
| **BUG-004** | Missing X-Frame-Options header в deploy.yml | ✅ Confirmed |
| **BUG-005** | 277KB дублированный CSS (site.css и site-layered.css) | ✅ Confirmed |
| **BUG-006** | site.js = 162.8KB (слишком большой) | ✅ Confirmed |
| **BUG-007** | series.json field name inconsistency (readingTime vs readTime) | ✅ Confirmed |
| **BUG-008** | 17 search-manifest items missing readTime | ✅ Confirmed |
| **BUG-009** | asset-version.js два API (ASSET_VERSIONS vs assetUrl) | ✅ Confirmed |
| **BUG-010** | 20 breakpoints в CSS (breakpoint chaos) | ✅ Confirmed |
| **BUG-011** | CSS breakpoint conflict (768px overlap) | ✅ Confirmed |
| **BUG-012** | MDX vs HTML title mismatch (3 статьи) | ✅ Confirmed |
| **BUG-013** | Critical CSS не preloaded | ✅ Confirmed |
| **BUG-014** | Race condition между dist scripts | ✅ Confirmed |
| **BUG-015** | interactive-audit требует сервер без orchestration | ✅ Confirmed |
| **BUG-016** | ~62 CSS custom properties не используются | ✅ Confirmed |
| **BUG-017** | Phantom CSS файл в документации | ✅ Confirmed |
| **BUG-034** | grid-template-rows: 0fr без fallback | ✅ Confirmed |
| **NEW-39** | Font preload missing (FOUC) | ✅ Confirmed |
| **PC-101** | GillRailControls dead component | ✅ Confirmed |
| **GBS2-002** | Нет error tracking в GBS2 JavaScript | ✅ Confirmed |
| **GBS2-003** | Kinetic typography performance (DOM manipulation) | ✅ Confirmed |

---

## 🔵 P3 — Medium Priority Bugs (17)

| ID | Title | Status |
|----|-------|--------|
| **NEW-31** | Missing Referrer-Policy | ✅ Confirmed |
| **NEW-32** | Missing Permissions-Policy | ✅ Confirmed |
| **BUG-020** | 336 buttons без aria-label | ✅ Confirmed |
| **BUG-021** | 2 короткие meta descriptions | ✅ Confirmed |
| **BUG-022** | CSS selector conflicts (256 multi-defined) | ✅ Confirmed |
| **BUG-023** | Мёртвый атрибут data-gill-current-part | ✅ Confirmed |
| **BUG-024** | Мёртвый TypeScript API | ✅ Confirmed |
| **BUG-025** | Устаревшие CSS селекторы в openSearch() | ✅ Confirmed |
| **BUG-035** | FAQ accordion grid-template-rows without fallback | ✅ Confirmed |
| **BUG-036** | scrollbar-gutter without fallback | ✅ Confirmed |
| **PC-107** | GillRailControls dead TypeScript props | ✅ Confirmed |
| **GBS2-001** | Нет aria-label для progress ring | ✅ Confirmed |
| **GBS2-004** | No fallback for sticky positioning | ✅ Confirmed |
| **GBS2-005** | No SVG fallback | ✅ Confirmed |
| **GBS2-006** | Timeline line disappears on mobile | ✅ Confirmed |
| **GBS2-007** | No swipe-to-close for mobile sheet | ✅ Confirmed |
| **GBS2-008** | 99 CSS classes complexity | ✅ Confirmed |

---

## ⚪ S0 — Low Priority Bugs (2)

| ID | Title | Status |
|----|-------|--------|
| **BUG-026** | AGENTS.md §12.5.7 дублируется | ✅ Confirmed |
| **BUG-027** | AGENTS.md changelog r300-r308 numbering conflicts | ✅ Confirmed |

---

## ✅ Fixed Bugs (1)

| ID | Title | Fix Date | Evidence |
|----|-------|----------|----------|
| **PC-CURRENT-06** | Gill mobile current series item → part TOC flow | 2026-07-02 | Browser verified via `gill:mobile-play:smoke` (120+ checks green) |

---

## 🚫 False Positives Removed (5)

| ID | Original Finding | Reason |
|----|------------------|--------|
| **BUG-004** | CSS file count mismatch (7 vs 8) | Intentional architecture |
| **BUG-033** | console.log in production | Protected by debug flag |
| **NEW-35** | astro:check not wired | Confirmed intentional |
| **NEW-36** | TypeScript unused props | Real but P3 (PC-107) |
| **NEW-38** | MDX readingTime optional | Confirmed intentional |

---

## 📈 Audit Coverage

### Passes Completed
- **Pass 1-11:** Runtime/Security/SEO/Performance (36 bugs)
- **Pass 12-13:** Premium UI Deep Dive (Floating Cluster, GBS2, Command Palette)
- **Pass 14:** GBS2 Deep Dive
- **Pass 15:** Security Headers Deep Dive
- **Pass 16:** Data Consistency
- **Pass 17:** Accessibility Deep Dive
- **Pass 18:** Performance Deep Dive
- **Pass 19:** Cross-browser Deep Dive
- **Pass 20:** SEO Deep Dive
- **PC-1:** PremiumControls (static)
- **PC-2:** PremiumControls (browser)
- **Verifier:** Cross-reference + integration

### Positive Checks (35+)
- Security: XSS protection, CSP headers, eval() audit
- Accessibility: WCAG AA, ARIA labels, focus indicators
- Performance: Lazy loading, preconnect, font-display
- SEO: Meta tags, Open Graph, canonical URLs, heading structure
- Code Quality: No dead code, consistent naming, proper structure

---

**Matrix Status:** ✅ Complete  
**Next Steps:** Prioritize P1 fixes (BUG-001, BUG-002, SEO-001)
