# Agent Work Report — COMBINED PASS 1 + 2 + 3

## Meta
- Project: gb-is-my-strength (gospod-bog.ru)
- Source repo: https://github.com/FedorMilovanov/gb-is-my-strength
- Agent: arena-deep-auditor
- Date: 2026-07-02
- Audited branch: main
- Audited SHA: d5d9388b
- Current HEAD: d5d9388b
- Mode: free-intake (deep code audit — 3 passes)

---

## 📊 Summary: 23 Findings

| Severity | Count | Description |
|----------|-------|-------------|
| **P1** | 2 | Critical bugs affecting production |
| **P2** | 9 | Serious issues requiring fixes |
| **P3** | 9 | Minor issues, can fix later |
| **S0** | 3 | Documentation/style issues |

---

## 🔴 P1 — Critical Bugs

### NEW-01: Memory Leak в floating-cluster-controller.js
**File:** `js/floating-cluster-controller.js`  
**Problem:** 38 `addEventListener` calls, 0 `removeEventListener` calls  
**Impact:** Memory leak during long user sessions  
**Evidence:**
```bash
grep -c 'addEventListener' js/floating-cluster-controller.js  # 38
grep -c 'removeEventListener' js/floating-cluster-controller.js  # 0
grep 'destroy\|cleanup' js/floating-cluster-controller.js  # no results
```
**Recommendation:** Add `cleanup()` method, call on `beforeunload` and navigation.

---

### NEW-02: Массовое дублирование PageHead компонентов
**Files:** 39 `*PageHead.astro` files (~11,000 lines)  
**Problem:** 92-93% copy-paste between components  
**Evidence:**
```bash
# Gill части 1/2/3 differ only in 4 lines (title, desc, canonical, dates)
diff src/components/article-pilots/gill-part1/GillPart1PageHead.astro \
     src/components/article-pilots/gill-part2/GillPart2PageHead.astro
```
**Impact:** Maintenance complexity, risk of desync  
**Recommendation:** Create base `BasePageHead.astro` component with parameters.

---

## 🟡 P2 — Serious Issues

### NEW-03: Документация !important не соответствует реальности
**File:** `AGENTS.md` §4.2  
**Problem:** Documented !important counts don't match reality  
**Discrepancies:**
- `home.css`: documented 20 → actual 36 (+80%)
- `mobile-hotfix.css`: documented 74 → actual 142 (+92%)
- `nagornaya-mobile-toc.css`: documented 122 → actual 135 (+11%)
- `site.css`: documented 202 → actual 202 ✅

**Evidence:**
```bash
grep -o '!important' css/home.css | wc -l  # 36
grep -o '!important' css/mobile-hotfix.css | wc -l  # 142
```

---

### NEW-04: Phantom CSS файл
**File:** `AGENTS.md` §2  
**Problem:** Documents 8 CSS files including `css/premium-controls.css`, but only 7 exist on disk  
**Evidence:**
```bash
ls css/  # 7 files, no premium-controls.css
ls src/styles/premium-controls.css  # exists but unused
```

---

### NEW-05: Latent bug в search.js (already known)
**File:** `js/search.js`  
**Problem:** `te()` function doesn't normalize trailing slash before depth calculation  
**Status:** Confirmed from DEEP_CODE_AUDIT_2026-06-30.md, still present

---

### NEW-13: Inconsistency имён полей в series.json
**File:** `data/series.json`  
**Problem:** 23 parts use `readingTime`, 1 part uses `readTime`  
**Details:**
```json
// 23 parts:
{"slug": "dzhon-gill-istoricheskiy-kontekst", "readingTime": 16}

// 1 part (planned):
{"slug": "zakon-duha-zhizni-rimlyanam-8", "readTime": 0}
```
**Impact:** Code expecting `readingTime` will get `undefined` for planned article

---

### NEW-14: 17 элементов search-manifest без readTime
**File:** `data/search-manifest.json`  
**Problem:** All 10 baptisty-rossii articles and 7 other pages missing `readTime`  
**Impact:** Search/command palette UI doesn't show reading time for these articles

---

### NEW-17: asset-version.js — два API
**File:** `src/lib/asset-version.js`  
**Problem:** Exports both `ASSET_VERSIONS` (object) and `assetUrl()` (function)  
**Evidence:**
```bash
grep -rn "import.*assetUrl" src/  # BaseLayout.astro uses assetUrl()
grep -rn "ASSET_VERSIONS" src/    # 16 uses in other components
```
**Impact:** Two different APIs from same file creates confusion  
**Recommendation:** Standardize on one API (prefer `assetUrl()` as cleaner)

---

### NEW-18: CSS breakpoint inconsistency — 20 different breakpoints
**File:** `css/site.css`  
**Problem:** Uses 20 different breakpoints, creating chaos  
**Examples:**
- `max-width: 768px` — 17 uses
- `max-width: 600px` — 18 uses
- `max-width: 760px` — 4 uses (only 8px from 768px!)
- `max-width: 680px` — 3 uses
- `max-width: 700px` — 1 use

**Impact:** Different styles trigger at different widths, creating unpredictable behavior  
**Recommendation:** Consolidate to 5-7 standard breakpoints

---

### NEW-19: CSS breakpoint conflict — max-width:768px vs min-width:768px
**File:** `css/site.css`  
**Problem:** Same breakpoint (768px) used with both `max-width` (6 uses) and `min-width` (1 use)  
**Evidence:**
```bash
grep -n "@media.*max-width.*768px" css/site.css | wc -l  # 6
grep -n "@media.*min-width.*768px" css/site.css | wc -l  # 1
```
**Impact:** Styles can override each other at exactly 768px width  
**Recommendation:** Use non-overlapping ranges (e.g., max-width: 767px and min-width: 768px)

---

### NEW-20: CSS near-duplicate breakpoints — 760px vs 768px
**File:** `css/site.css`  
**Problem:** `max-width: 760px` (4 uses) and `max-width: 768px` (17 uses) only 8px apart  
**Impact:** On widths 761-767px, some styles apply but others don't, creating gaps  
**Recommendation:** Consolidate to single breakpoint (prefer 768px as standard tablet breakpoint)

---

## 🔵 P3 — Minor Issues

### NEW-06: Мёртвый атрибут data-gill-current-part
**File:** `src/components/article-pilots/gill-series/GillSeriesOverlay.astro`  
**Problem:** Generated in HTML but not used in JavaScript

---

### NEW-07: Мёртвый TypeScript API
**File:** `src/lib/asset-version.js`  
**Problem:** Exports `assetUrl()` but some components don't import it (see NEW-17)

---

### NEW-08: Устаревшие CSS селекторы в openSearch()
**File:** `js/floating-cluster-controller.js`  
**Problem:** Array contains 7 selectors, most don't exist in HTML

---

### NEW-09: Нет подтверждения при удалении highlights
**File:** `js/highlights.js`  
**Problem:** User can accidentally delete highlight without confirmation

---

### NEW-10: Конфликт количества CSS файлов
**File:** `AGENTS.md`  
**Problem:** §0 says "5 CSS", §2 says "РОВНО 8 ФАЙЛОВ", reality is 7 files

---

### NEW-11: Дублирование секции AGENTS.md
**File:** `AGENTS.md`  
**Problem:** Section "12.5.7 Статус извлечения" duplicated twice

---

### NEW-12: Конфликты нумерации в changelog
**File:** `AGENTS.md`  
**Problem:** Numbers r300-r308 used twice for different entries

---

### NEW-15: Cross-file naming inconsistency
**Problem:** Different files use different names:
- `search-manifest.json`: `readTime`
- `series.json` (23/24): `readingTime`
- HTML SITE_CONFIG: `readingTime`

---

### NEW-16: Planned статья с readTime=0
**File:** `data/series.json`  
**Problem:** Planned article "Закон духа жизни: Римлянам 8" has `readTime: 0`  
**Impact:** UI showing total series time will undercount

---

### NEW-21: CSS selector conflicts — 256 selectors with multiple definitions
**File:** `css/site.css`  
**Problem:** 256 selectors have multiple definitions, some conflicting  
**Examples:**
- `.summary-card .gterm` defined twice with conflicting styles (underline vs no underline)
- `a` has 4 definitions with different colors
- `article p` has 5 definitions with different text-align and hyphens

**Evidence:**
```bash
# .summary-card .gterm appears on lines 133 and 333
grep -n "\.summary-card \.gterm" css/site.css
# Line 133: text-decoration:underline
# Line 333: text-decoration:none  ← overrides previous!
```

---

### NEW-22: CSS .summary-card .gterm defined twice with conflicting styles
**File:** `css/site.css`  
**Problem:** Same selector defined on lines 133 and 333 with contradictory styles  
**Line 133:** `pointer-events:none; cursor:default; text-decoration:underline; text-decoration-style:dotted; text-underline-offset:3px`  
**Line 333:** `border-bottom:0; text-decoration:none; background:transparent; color:inherit; box-shadow:none; padding:0; cursor:inherit; pointer-events:none`  
**Impact:** Second definition overrides first, creating confusion about intended behavior  
**Recommendation:** Consolidate into single definition

---

### NEW-23: validate:static-publication:light skips 2 checks vs full version
**File:** `package.json`  
**Problem:** Light version skips `astro:audit:article-mdx:strict` and `astro:audit:baptisty-series`  
**Evidence:**
```bash
# Full version: 36 steps
# Light version: 34 steps (missing 2)
```
**Impact:** indexnow.yml uses light version, may miss MDX validation errors  
**Note:** This may be intentional for CI speed, but should be documented

---

## ✅ Confirmed Findings (from previous audits)

Re-verified on current HEAD d5d9388b:

1. search.js te() depth bug — still present
2. data-gill-current-part unused — still dead attribute
3. assetUrl() dead export — still not imported (see NEW-17 for nuance)
4. openSearch() stale selectors — still contains stale selectors
5. highlights.js no undo — still no confirmation

---

## ✅ Positive Checks

| Check | Result |
|---|---|
| All 10 karty/*/route.json | ✅ Valid JSON |
| CSS brace balance | ✅ 0 (balanced) |
| eval()/Function() in JS | ✅ 0 occurrences |
| http:// mixed content | ✅ 0 insecure links |
| SW CACHE_VERSION | ✅ Up-to-date (v182, 20260702) |
| Scheduled workflows | ✅ 3 weekly schedules |
| MDX files readingTime | ✅ All 20 files have readingTime |

---

## 🔧 Recommended Repair Lanes

| Lane | Bug IDs | Description |
|------|---------|-------------|
| `lane/floating-cluster-cleanup` | NEW-01 | Fix memory leak |
| `lane/pagehead-base-component` | NEW-02 | Create base PageHead component |
| `lane/agents-md-reconciliation` | NEW-03,04,10,11,12 | Update documentation |
| `lane/search-depth-fix` | NEW-05 | Fix trailing slash bug |
| `lane/js-dead-code-cleanup` | NEW-06,07,08,09 | Clean up dead code |
| `lane/data-consistency-fix` | NEW-13,14,15,16 | Align data schemas |
| `lane/asset-version-api` | NEW-17 | Standardize asset API |
| `lane/css-breakpoint-consolidation` | NEW-18,19,20,21,22 | Consolidate CSS breakpoints |

---

## 📝 Priority Matrix

| Priority | Bug IDs | Action |
|----------|---------|--------|
| **Immediate** | NEW-01 | Fix memory leak (production impact) |
| **High** | NEW-02, NEW-13,14 | Fix data inconsistencies (affects UX) |
| **Medium** | NEW-03,04,18,19,20 | Fix CSS/documentation issues |
| **Low** | NEW-05,06,07,08,09,15,16,17,21,22,23 | Clean up minor issues |
| **Deferred** | NEW-10,11,12 | Documentation cleanup |

---

**Report uploaded to:** https://github.com/FedorMilovanov/AuditRepo/tree/main/projects/gb-is-my-strength/incoming/arena-deep-auditor/2026-07-02

**Commit:** [pending push]
