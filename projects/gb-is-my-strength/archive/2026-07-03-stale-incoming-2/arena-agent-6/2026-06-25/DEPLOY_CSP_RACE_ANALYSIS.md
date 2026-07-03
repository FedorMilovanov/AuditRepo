# Final Deep Analysis — CSP, Auto-Update Race, Deploy Pipeline
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, workflow analysis, CSP audit

---

## 1. CSP IMPLEMENTATION

### Status: All pages have CSP with unsafe-inline

| Page Type | CSP Issues |
|---|---|
| about | 1 issue (unsafe-inline) |
| gill articles | 1 issue (unsafe-inline) |
| nagornaya | 1 issue (unsafe-inline) |
| karty maps | 1 issue (unsafe-inline) |
| baptisty | 1 issue (unsafe-inline) |

### Impact
`unsafe-inline` allows inline `<script>` tags, which weakens CSP against XSS. The site uses many inline scripts (theme init, SITE_CONFIG, etc.).

### Recommendation
- Move all inline scripts to external files
- Use nonce-based CSP: `script-src 'self' 'nonce-abc123'`
- Or use strict-dynamic with hashes

---

## 2. AUTO-UPDATE RACE CONDITION

### Finding: IndexNow has NO concurrency settings

The auto-update chain:
```
push to main → indexnow.yml runs → update-meta.js + cache-bust.js → auto-commit → deploy.yml triggers
```

### Problem
- IndexNow workflow has NO `concurrency` settings
- Multiple IndexNow runs could overlap
- Auto-commit (`chore: auto-update meta, cache-bust [skip ci]`) can overwrite manual fixes
- This has happened 15+ times in git history

### Recommendation
- Add `concurrency: { group: indexnow, cancel-in-progress: true }` to indexnow.yml
- Add 24h guard to auto-update to prevent overwriting recent manual commits

---

## 3. DEPLOY PIPELINE ANALYSIS

### Status

| Check | Status | Notes |
|---|---|---|
| Visual parity guard | ✅ Present | In deploy.yml |
| audit-pro | ⚠️ NOT present | Not in deploy.yml |
| sw.js syntax check | ⚠️ NOT present | Not in deploy.yml |
| Concurrency group | ✅ Present | `pages` with cancel-in-progress |
| IndexNow trigger | ✅ Present | workflow_run on completed |

### Missing from deploy.yml
1. **audit-pro.js** — should be blocking gate
2. **sw.js syntax validation** — should be blocking gate
3. **feed.xml weekday validation** — should be advisory gate

### Recommendation
Add to deploy.yml:
```yaml
- name: Validate sw.js syntax
  run: node -e "new Function(require('fs').readFileSync('sw.js','utf8'))"

- name: Run audit-pro
  run: node scripts/audit-pro.js
```

---

## 4. VISUAL PARITY SYSTEM

### Status: 16 scripts, Playwright-based
- Individual audits for each section
- Main orchestrator: `visual-parity-screenshots.js`
- Uses Playwright for screenshots
- Threshold: 0.5% pixel diff (configurable)

### Issue: NOT CI-blocking
Visual parity runs locally but does NOT block deployment. This is the root cause of CSS regressions.

### Recommendation
- Make `visual:parity:guard` blocking in deploy.yml
- Add `continue-on-error: false` to visual parity step

---

## 5. NAGORNAYA TAILWIND INTEGRATION

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

### Recommendation
- Remove duplicate fonts.css
- Integrate Tailwind into site-layered.css @layer
- Or keep separate but document CSS loading order

---

## 6. COMPLETE FINDINGS SUMMARY

### New bugs from this session:
| ID | Sev | Title |
|---|---|---|
| NEW-15 | P2 | Deploy pipeline missing audit-pro and sw.js syntax check |
| NEW-16 | P2 | Nagornaya loads fonts.css twice (duplicate) |
| NEW-17 | P3 | All pages have CSP unsafe-inline |
| NEW-18 | P3 | Visual parity not CI-blocking |

### Positive findings:
- ✅ All pages have CSP (even if with unsafe-inline)
- ✅ Visual parity system exists (16 scripts, Playwright)
- ✅ Deploy has concurrency group 'pages'
- ✅ IndexNow triggers deploy on completion

---

## 7. FINAL RECOMMENDATIONS (Updated Priority)

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
