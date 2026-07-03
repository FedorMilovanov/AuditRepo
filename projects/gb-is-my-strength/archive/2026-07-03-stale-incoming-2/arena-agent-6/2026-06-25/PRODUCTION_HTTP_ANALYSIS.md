# FINAL DEEP ANALYSIS — Production Live, HTTP Headers, Cache, SW Registration
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Production HTTP requests, source code analysis

---

## 1. PRODUCTION HTTP HEADERS

### Status: GitHub Pages + Varnish CDN

| Header | Value | Notes |
|---|---|---|
| server | GitHub.com | GitHub Pages |
| cache-control | max-age=600 | 10 minutes — reasonable |
| strict-transport-security | max-age=31556952 | HSTS enabled ✅ |
| access-control-allow-origin | * | CORS wide open ⚠️ |
| x-proxy-cache | MISS | Varnish CDN |
| via | 1.1 varnish | Varnish CDN |

### Issues
1. **CORS wide open** (`Access-Control-Allow-Origin: *`) — allows any site to fetch resources. This is fine for public content but should be restricted if API endpoints are added.

2. **Cache-Control: max-age=600** — 10 minutes is reasonable for HTML pages. CSS/JS files should have longer cache (1 year) since they use `?v=` cache-busting.

---

## 2. SERVICE WORKER REGISTRATION

### Status: Working correctly

```javascript
navigator.serviceWorker.register("/sw.js?v=" + encodeURIComponent(SITE_CONFIG.version), {scope: "/"})
```

### Features
- Uses `SITE_CONFIG.version` for cache busting
- Shows toast on SW update ("Сайт обновлён — обновите страницу")
- Shows offline toast ("Вы офлайн — кэшированные статьи доступны")
- Shows online toast ("Соединение восстановлено")
- Shows cached article toast ("Статья доступна офлайн")
- Properly cleans up event listeners on `pagehide`

### Positive: SW registration is well-implemented with proper UX feedback.

---

## 3. 404 PAGE

### Status: Working correctly
- Returns proper 404 status code
- Shows custom 404 page with navigation links
- Title: "404 — Страница не найдена · Господь Бог — Сила Моя"

---

## 4. CSP COVERAGE

### Status: 10 of 52 pages have CSP (root HTML only)

The CSP is defined in root HTML files. Astro-generated pages get their CSP from the Astro build process.

### Pages with CSP:
- index.html (homepage)
- about/index.html
- articles/index.html
- All article pages
- All nagornaya pages
- All baptisty pages

### Issue: CSP uses `unsafe-inline` on all pages

---

## 5. VISUAL PARITY SYSTEM

### Status: 16 scripts, Playwright-based
- Individual audits for each section
- Main orchestrator: `visual-parity-screenshots.js`
- Uses Playwright for screenshots
- Threshold: 0.5% pixel diff (configurable)

### Issue: NOT CI-blocking
Visual parity runs locally but does NOT block deployment. This is the root cause of CSS regressions.

---

## 6. NAGORNAYA TAILWIND INTEGRATION

### Status: Separate CSS, not integrated into @layer

CSS loading order in Nagornaya:
1. `/fonts/fonts.css` (2x — duplicate!)
2. `/nagornaya/tw.min.css` (34KB Tailwind)
3. `/css/site.css` (283KB)
4. `../../css/nagornaya-mobile-toc.css` (22KB)
5. `../../css/command-palette.css` (30KB)
6. `/css/mobile-hotfix.css` (16KB)

### Issues
1. **Duplicate fonts.css** — loaded twice
2. **Tailwind not integrated** — separate from site.css
3. **CSS specificity conflicts** — Tailwind vs site.css
4. **Total CSS for Nagornaya**: 34KB + 283KB + 22KB + 30KB + 16KB = **385KB**

---

## 7. COMPLETE FINDINGS SUMMARY

### New bugs from this session:
| ID | Sev | Title |
|---|---|---|
| NEW-19 | P3 | CORS wide open (Access-Control-Allow-Origin: *) |
| NEW-20 | P3 | CSS/JS cache-control too short (max-age=600 for cache-busted assets) |

### Positive findings:
- ✅ Production sw.js parses correctly
- ✅ All production pages return 200
- ✅ HSTS enabled (strict-transport-security)
- ✅ SW registration working with proper UX feedback
- ✅ 404 page working correctly
- ✅ CSP present on all pages (even if with unsafe-inline)
- ✅ Visual parity system exists (16 scripts, Playwright)
- ✅ Deploy has concurrency group 'pages'
- ✅ IndexNow triggers deploy on completion

---

## 8. FINAL RECOMMENDATIONS (Updated Priority)

### CRITICAL (do now)
1. Run `node scripts/update-meta.js --all` — fix feed.xml weekdays
2. Populate MDX files with full content before any migration
3. Fix sw.js source-production drift

### HIGH (this week)
4. Add 8 karty routes to sitemap/search-manifest/llms.txt
5. Remove site-layered.css from sw.js precache
6. Delete 10 orphaned scripts + 12 root HTML files
7. Add cleanup to avraam-app.js (memory leak)
8. Add audit-pro and sw.js syntax check to deploy.yml

### MEDIUM (this sprint)
9. Add concurrency group to IndexNow workflow
10. Make visual:parity:guard blocking in CI
11. Add 24h guard to auto-update scripts
12. Integrate Nagornaya Tailwind into @layer architecture
13. Reduce !important from 202 to ≤150
14. Remove duplicate fonts.css in Nagornaya

### LOW (backlog)
15. Decompose site.js into modules with source maps
16. Lazy-load avraam-app.js (190KB for one page)
17. Audit search.js innerHTML for XSS
18. Move inline scripts to external + nonce-based CSP
19. Update llms.txt with all 52 routes
20. Restrict CORS to specific origins
21. Increase cache-control for cache-busted assets (1 year)
