# Final Verified Bug Matrix — Passes 7, 8, 9 Combined

**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Agent:** Deep Auditor (Passes 7, 8, 9)  
**Статус:** ✅ Финальная матрица

---

## 📊 Summary: 34 Unique Bugs

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 **P1** | 4 | Critical — немедленное исправление |
| 🟡 **P2** | 21 | High — требует исправления |
| 🔵 **P3** | 7 | Medium — можно исправить позже |
| ⚪ **S0** | 3 | Low — документация |

**Изменения от матрицы Pass 6 (26 bugs):**
- 🔴 +1: BUG-010 upgraded P2 → P1 (73 media queries, 24+ breakpoints)
- 🟡 +6: NEW-28, NEW-30, NEW-32, NEW-35 (security, CSP, a11y, perf)
- 🔵 +2: NEW-29, NEW-31, NEW-33 (dead code, robots meta, data)
- ⚪ +1: NEW-34 (ad-hoc scripts)
- 🔄 Reclassified: BUG-005 P2→P3 (dead file)

---

## 🔴 P1 — Critical (4 bugs)

| ID | Title | Evidence | Status |
|----|-------|----------|--------|
| **BUG-001** | Memory leak: 38 addEventListener, 0 removeEventListener in floating-cluster-controller.js | grep count unchanged | ✅ Confirmed |
| **BUG-002** | 39 PageHead + 6 PostArticle components — massive duplication | find count: 39+6 | ✅ Confirmed |
| **BUG-003** | validate:static-publication не включает sw:dist:audit | python3 check: False | ✅ Confirmed |
| **BUG-010** | **CSS breakpoint chaos: 73 unique @media queries, 24+ width breakpoints** | grep -ohP shows 73 unique queries | 🔴 **UPGRADED from P2** |

---

## 🟡 P2 — High Priority (21 bugs)

| ID | Title | Source |
|----|-------|--------|
| BUG-006 | site.js = 163KB monolith | Matrix |
| BUG-007 | series.json: hard-texts has `readTime` vs `readingTime` mismatch | Pass 7 verified |
| BUG-008 | 17 search-manifest items missing readTime | Pass 7 verified |
| BUG-009 | asset-version.js exports two APIs | Matrix |
| BUG-011 | CSS breakpoint conflict: max-width:768px vs min-width:768px overlap | Matrix |
| BUG-012 | MDX vs HTML title mismatch (1: 20-antisovetov-pastoru) | Pass 9 verified |
| BUG-013 | Critical CSS not preloaded | Matrix |
| BUG-014 | Race condition: source:links:dist rebuilds dist/ during parallel audits | Matrix |
| BUG-015 | interactive-audit requires server, no orchestration wrapper | Matrix |
| BUG-016 | ~62 CSS custom properties defined but unused | Matrix |
| BUG-017 | AGENTS.md documents 8 CSS files, only 7 exist | Matrix |
| BUG-018 | AGENTS.md !important counts don't match reality | Matrix |
| BUG-019 | search.js trailing slash bug (latent) | Matrix |
| BUG-020 | 336 buttons without aria-label | Matrix |
| BUG-022 | 256 CSS selectors multiply defined | Matrix |
| **BUG-028** | **No HSTS, no X-Frame-Options, no Referrer-Policy** | NEW Pass 7 |
| **BUG-030** | **CSP duplicated 37 times with 6 variants** | NEW Pass 7 |
| **BUG-032** | **40 images without alt AND without aria-hidden** | NEW Pass 8 |
| **BUG-035** | **CSS/JS served with comments (56+53 in CSS), no build minification** | NEW Pass 9 |

---

## 🔵 P3 — Medium Priority (7 bugs)

| ID | Title | Source |
|----|-------|--------|
| BUG-005 | site-layered.css (278KB) — dead file, not loaded anywhere | ⚠️ **DOWNGRADED P2→P3** Pass 7 |
| BUG-021 | 2 short meta descriptions (<100 chars) | Matrix |
| BUG-023 | Dead data-gill-current-part attribute | Matrix |
| BUG-024 | Dead TypeScript API: assetUrl() exported but never imported | Matrix |
| BUG-025 | 7 stale CSS selectors in openSearch() | Matrix |
| **BUG-029** | 5 React TSX components never imported by any page | NEW Pass 7 |
| **BUG-031** | GillContextPageHead: robots meta missing max-snippet directives | NEW Pass 7 |
| **BUG-033** | search-manifest missing `zakon-duha-zhizni-rimlyanam-8` | NEW Pass 8 |

---

## ⚪ S0 — Documentation (3 bugs)

| ID | Title | Source |
|----|-------|--------|
| BUG-026 | AGENTS.md §12.5.7 duplicated | Matrix |
| BUG-027 | AGENTS.md changelog r300-r308 numbering conflicts | Matrix |
| **BUG-034** | 12 scripts in scripts/ not referenced in package.json | NEW Pass 8 |

---

## 📈 Repair Priority Matrix

| Priority | Bug IDs | Lane | Effort | Impact |
|----------|---------|------|--------|--------|
| 🔴 **Immediate** | BUG-001 | `lane/floating-cluster-cleanup` | Medium | High (memory leak) |
| 🔴 **Immediate** | BUG-002 | `lane/pagehead-base-component` | High | High (maintenance) |
| 🔴 **Immediate** | BUG-003 | `lane/sw-gate-coupling` | Low | High (CI/CD) |
| 🔴 **Immediate** | BUG-010 | `lane/css-breakpoint-consolidation` | **High** | **High (every page, every viewport)** |
| 🟡 **High** | BUG-028 | `lane/security-headers` | Low | High (HTTPS, clickjacking) |
| 🟡 **High** | BUG-030 | `lane/security-headers-consolidation` | Medium | High (CSP maintenance) |
| 🟡 **High** | BUG-032 | `lane/a11y-alt-text` | Medium | High (WCAG 1.1.1) |
| 🟡 **High** | BUG-005 | `lane/css-deduplication` | Medium | Medium (dead file removal) |
| 🟡 **High** | BUG-006 | `lane/js-split` | High | Medium (maintainability) |
| 🟡 **High** | BUG-007,008,033 | `lane/data-consistency` | Low | Medium (UX) |
| 🟡 **High** | BUG-011 | `lane/css-breakpoint-consolidation` | Medium | Medium (subsumed by BUG-010) |
| 🟡 **High** | BUG-012 | `lane/mdx-html-sync` | Low | Medium (SEO) |
| 🟡 **High** | BUG-013 | `lane/performance-preload` | Low | Medium (LCP) |
| 🟡 **High** | BUG-014,015 | `lane/script-orchestration` | Medium | Medium (DX) |
| 🟡 **High** | BUG-016,022 | `lane/css-cleanup` | Medium | Low (code quality) |
| 🟡 **High** | BUG-017,018 | `lane/agents-md-reconciliation` | Low | Low (docs) |
| 🟡 **High** | BUG-019 | `lane/search-fix` | Low | Low (latent) |
| 🟡 **High** | BUG-020 | `lane/a11y-aria-labels` | Medium | Medium (WCAG) |
| 🟡 **High** | BUG-035 | `lane/build-minification` | Low | Medium (performance) |
| 🔵 **Medium** | BUG-021 | `lane/seo-meta` | Low | Low (SEO) |
| 🔵 **Medium** | BUG-023,024,025,029 | `lane/dead-code-cleanup` | Low | Low (cleanup) |
| 🔵 **Medium** | BUG-031 | `lane/seo-meta` | Low | Low (SEO) |
| ⚪ **Low** | BUG-026,027,034 | `lane/docs-cleanup` | Low | Low (docs) |

---

## ✅ Positive Checks (25 passed)

All JSON valid, no eval(), no mixed content, no document.write(), cache-bust consistent, lang correct, robots.txt comprehensive, manifest valid, 8/8 workflows monitored, JSON-LD valid, canonical URLs correct, og:image complete, font-display: swap, skip links, focus management, SW precache files exist, links-graph 0 broken, innerHTML safe, target=_blank secured, legacy HTML has CSP, CI/CD no secrets, no deprecated Actions, sitemap valid, internal links valid, cross-reference with other agents complete.

---

## 🔗 Report Files

| Pass | Location |
|------|----------|
| Pass 7 | `incoming/deep-auditor/2026-07-02/REPORT.md` |
| Pass 8 | `incoming/deep-auditor/2026-07-02-pass8/REPORT.md` |
| Pass 9 | `incoming/deep-auditor/2026-07-02-pass9/REPORT.md` |
| Matrix Draft | `verified/VERIFIED_BUG_MATRIX_PASS7_DRAFT.md` |

---

**Audit complete. 3 passes, 34 bugs, 25 positive checks.**
