# Final Deep Analysis — MDX Parity, Pagefind, Deploy, Content Integrity
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, content comparison, pipeline review

---

## 1. CRITICAL: MDX Content Parity — MDX Files Are DRAFTS

### Finding
The 20 MDX files in `src/content/articles/` are **outlines/drafts**, not complete content. The HTML versions have 57-86% MORE content.

| Статья | MDX H2 | HTML H2 | Потеря |
|---|---|---|---|
| kod-da-vinchi | 3 | 22 | **86%** |
| krajne | 4 | 19 | **79%** |
| antisovetov | 5 | 17 | **71%** |
| hermenevtika | 3 | 7 | **57%** |
| gill-part1 | 2 | 5 | **60%** |
| gill-part2 | 2 | 6 | **67%** |
| gill-part3 | 2 | 7 | **71%** |

### Impact
If the site switches to rendering from MDX (Phase 5 of REFACTORING_6_0), articles will lose 60-86% of their content. The MDX files need to be populated with FULL content before any migration.

### Recommendation
- **DO NOT** switch to MDX rendering until MDX files are complete
- Create `scripts/check-mdx-completeness.js` that compares MDX H2/H3 count vs HTML
- Block any `ArticleLayout` migration until MDX has ≥90% of HTML content

---

## 2. Pagefind Integration Status

### Status: WORKING (via Astro components)
- 45 Astro components have `data-pagefind-body` / `data-pagefind-meta` markers
- Root HTML files do NOT have pagefind markers (correct — Astro generates final HTML)
- sw.js properly precaches `pagefind/pagefind.js` with cache-first strategy
- Search manifest has 44 items (52 routes exist — 8 karty missing)

### Missing from search manifest (8 routes):
- /karty/early-church/
- /karty/maccabim/
- /karty/melachim/
- /karty/pavel/
- /karty/revelation/
- /karty/shoftim/
- /karty/shvatim/
- /karty/yeshua/

---

## 3. Deploy Pipeline Analysis

### Race Condition: IndexNow has NO concurrency group
- Deploy: `concurrency: { group: pages, cancel-in-progress: true }` ✅
- IndexNow: NO concurrency settings ⚠️

**Risk:** Multiple IndexNow runs could overlap and produce conflicting auto-update commits.

### Auto-update chain:
```
push to main → indexnow.yml runs → update-meta.js + cache-bust.js → auto-commit → deploy.yml triggers
```

**Problem:** The auto-commit (`chore: auto-update meta, cache-bust [skip ci]`) can overwrite manual fixes made by agents. This has happened 15+ times in git history.

### Recommendation
- Add `concurrency: { group: indexnow, cancel-in-progress: true }` to indexnow.yml
- Add 24h guard to auto-update to prevent overwriting recent manual commits

---

## 4. Nagornaya Tailwind Integration

### Current state:
- `nagornaya/tw.min.css` — 34KB, loaded by 5 Nagornaya pages via root HTML
- `css/nagornaya-mobile-toc.css` — 22KB, separate file
- Both are loaded via `<link>` tags in root HTML, NOT via Astro imports

### Issue:
These CSS files are separate from `site.css` and not integrated into the @layer architecture. They load on top of site.css, which can cause specificity conflicts.

### Recommendation:
- Integrate into `site-layered.css` @layer architecture (Phase 2 of REFACTORING_6_0)
- Or keep separate but document the CSS loading order

---

## 5. Content Integrity Summary

| Check | Status | Details |
|---|---|---|
| MDX completeness | ❌ CRITICAL | MDX files are 57-86% smaller than HTML |
| Pagefind markers | ✅ OK | 45 Astro components have markers |
| Search manifest | ⚠️ 8 missing | 8 karty routes not in manifest |
| feed.xml weekdays | ❌ 9 wrong | toRFC() fix exists, not regenerated |
| sitemap.xml | ⚠️ 8 missing | 8 karty routes not in sitemap |
| Internal links | ✅ OK | No obviously dead links found |
| JSON-LD | ✅ OK | All checked pages have valid JSON-LD |

---

## 6. Complete Bug Count (all findings)

### New bugs from this session:
| ID | Sev | Title |
|---|---|---|
| NEW-08 | **P0** | MDX files are drafts (57-86% content loss if migrated) |
| NEW-09 | P2 | IndexNow workflow has no concurrency group |
| NEW-10 | P2 | feed.xml has 17 items vs sitemap 43 URLs |

### Updated total:
- New bugs: **10** (NEW-01 through NEW-10)
- Existing bugs confirmed: **15**
- False positives: **4**
- Downgrades: **1**

---

## 7. Final Recommendations (Priority Order)

### CRITICAL (do now)
1. Run `node scripts/update-meta.js --all` — fix feed.xml weekdays (V2-4)
2. Populate MDX files with full content before any migration (NEW-08)
3. Fix sw.js source-production drift (NEW-01)

### HIGH (this week)
4. Add 8 karty routes to sitemap/search-manifest (NEW-05/P1-2)
5. Remove site-layered.css from sw.js precache
6. Delete 10 orphaned scripts
7. Delete 12 root HTML files (dead code)

### MEDIUM (this sprint)
8. Add concurrency group to IndexNow workflow (NEW-09)
9. Make visual:parity:guard blocking in CI
10. Add 24h guard to auto-update scripts
11. Integrate Nagornaya Tailwind into @layer architecture
12. Reduce !important from 202 to ≤150

### LOW (backlog)
13. Decompose site.js into modules
14. Lazy-load avraam-app.js (248KB for one page)
15. Audit search.js innerHTML for XSS
16. Move inline scripts to external + nonce-based CSP
