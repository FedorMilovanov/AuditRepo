# Deep Audit Report — gb-is-my-strength

**Дата:** 2026-07-02  
**Аудитор:** Arena Agent (Deep Auditor)  
**HEAD:** d5d9388b  
**Методология:** 4-проходной аудит (Runtime, Data, CSS, HTML/SEO/A11y)

---

## 📊 Summary: 28 Findings

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 **P1** | 2 | Critical — немедленное исправление |
| 🟡 **P2** | 12 | High — требует исправления |
| 🔵 **P3** | 11 | Medium — можно исправить позже |
| ⚪ **S0** | 3 | Low — документация |

---

## 🔴 P1 — Critical Bugs

### NEW-01: Memory Leak в floating-cluster-controller.js
**File:** `js/floating-cluster-controller.js`  
**Problem:** 38 `addEventListener`, 0 `removeEventListener`  
**Impact:** Memory leak при длительных сессиях  
**Evidence:**
```bash
grep -c 'addEventListener' js/floating-cluster-controller.js  # 38
grep -c 'removeEventListener' js/floating-cluster-controller.js  # 0
```

---

### NEW-02: Массовое дублирование PageHead компонентов
**Files:** 39 `*PageHead.astro` files (~11,000 lines)  
**Problem:** 92-93% copy-paste между компонентами  
**Evidence:** Gill части 1/2/3 differ only in 4 lines

---

## 🟡 P2 — High Priority

### NEW-03: Документация !important не соответствует реальности
**File:** `AGENTS.md` §4.2  
**Discrepancies:**
- `home.css`: documented 20 → actual 36 (+80%)
- `mobile-hotfix.css`: documented 74 → actual 142 (+92%)
- `nagornaya-mobile-toc.css`: documented 122 → actual 135 (+11%)
- `site.css`: documented 202 → actual 202 ✅

---

### NEW-04: Phantom CSS файл
**File:** `AGENTS.md` §2  
**Problem:** Документирует 8 CSS файлов, на диске только 7  
**Missing:** `css/premium-controls.css` не существует

---

### NEW-05: search.js trailing slash bug (latent)
**File:** `js/search.js`  
**Problem:** `te()` не нормализует trailing slash перед depth calculation  
**Status:** Confirmed from DEEP_CODE_AUDIT_2026-06-30.md

---

### NEW-13: series.json field name inconsistency
**File:** `data/series.json`  
**Problem:** 23 parts use `readingTime`, 1 part uses `readTime`  
**Details:** `zakon-duha-zhizni-rimlyanam-8` использует неправильное имя поля

---

### NEW-14: 17 search-manifest items missing readTime
**File:** `data/search-manifest.json`  
**Problem:** Все 10 baptisty-rossii статей и 7 других страниц без `readTime`  
**Impact:** Search UI не показывает время чтения

---

### NEW-17: asset-version.js — два API
**File:** `src/lib/asset-version.js`  
**Problem:** Exports both `ASSET_VERSIONS` (object) и `assetUrl()` (function)  
**Impact:** Разные компоненты используют разные API

---

### NEW-18: CSS breakpoint inconsistency — 20 разных breakpoints
**File:** `css/site.css`  
**Problem:** Использует 20 разных breakpoints, создавая chaos  
**Examples:** 760px, 768px, 680px, 700px (все очень близко)

---

### NEW-19: CSS breakpoint conflict — max-width:768px vs min-width:768px
**File:** `css/site.css`  
**Problem:** Same breakpoint used with both `max-width` (6 uses) и `min-width` (1 use)  
**Impact:** Стили перебивают друг друга на 768px

---

### NEW-20: CSS near-duplicate breakpoints — 760px vs 768px
**File:** `css/site.css`  
**Problem:** `max-width: 760px` (4 uses) и `max-width: 768px` (17 uses) only 8px apart  
**Impact:** Creates gaps in responsive behavior

---

### NEW-24: SW precache ссылается на несуществующий файл
**File:** `sw.js`  
**Problem:** PRECACHE_ASSETS включает `/pagefind/pagefind.js`, но файла нет на disk  
**Impact:** Файл генерируется при build (`npm run pagefind:build:dist`), но в source tree отсутствует  
**Note:** Это работает в production (после build), но может быть проблемой при первом посещении до build

---

### NEW-26: MDX vs HTML title mismatch (3 статьи)
**Files:** `src/content/articles/*.mdx` vs `articles/*/index.html`  
**Problem:** Titles не совпадают между MDX frontmatter и legacy HTML

**Mismatches:**
1. **20-antisovetov-pastoru:**
   - MDX: `20 антисоветов, как пастору разрушить своё служение | Господь Бог — Сила Моя`
   - HTML: `20 антисоветов пастору: как разрушить служение | Господь Бог`
   - Diff: 16 chars

2. **kod-da-vinchi:**
   - MDX: `«Код да Винчи»: мифы о Марии Магдалине и Никее | Господь Бог — Сила Моя`
   - HTML: `«Код да Винчи»: мифы о Марии Магдалине и Никее | Господь Бог`
   - Diff: 11 chars (suffix mismatch)

3. **rimlyanam-7:**
   - MDX: `Римлянам 7: верующий, неверующий или человек под законом? | Господь Бог — Сила Моя`
   - HTML: `Римлянам 7: верующий или неверующий? | Господь Бог — Сила Моя`
   - Diff: 21 chars (completely different!)

**Impact:** SEO inconsistency, potential duplicate content issues

---

### NEW-28: CSS files не preloaded (performance)
**File:** `articles/*/index.html`  
**Problem:** Critical CSS (`site.css`) не имеет `<link rel="preload">` hint  
**Impact:** Render-blocking resource, влияет на LCP (Largest Contentful Paint)  
**Evidence:** Проверено 5 articles, все без preload для site.css  
**Note:** AGENTS.md §9.10 упоминает FOUC для шрифтов, но не решает CSS preload

---

## 🔵 P3 — Medium Priority

### NEW-06: Мёртвый атрибут data-gill-current-part
**File:** `src/components/article-pilots/gill-series/GillSeriesOverlay.astro`  
**Problem:** Generated in HTML but not used in JavaScript

---

### NEW-07: Мёртвый TypeScript API
**File:** `src/lib/asset-version.js`  
**Problem:** Exports `assetUrl()` but some components don't import it

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
- `article p` has 5 definitions with different text-align

---

### NEW-22: CSS .summary-card .gterm defined twice with conflicting styles
**File:** `css/site.css`  
**Problem:** Same selector defined on lines 133 and 333 with contradictory styles  
**Line 133:** `text-decoration: underline`  
**Line 333:** `text-decoration: none`  
**Impact:** Second definition overrides first

---

### NEW-23: validate:static-publication:light skips 2 checks
**File:** `package.json`  
**Problem:** Light version skips `astro:audit:article-mdx:strict` and `astro:audit:baptisty-series`  
**Impact:** indexnow.yml uses light version, may miss MDX validation errors

---

### NEW-25: 336 buttons без aria-label или title (accessibility)
**Files:** `articles/*/index.html`  
**Problem:** Buttons без aria-label или title attribute  
**Examples:**
- FAQ accordion buttons (`<button aria-expanded="false" class="faq-accordion__q">`)
- Bookmark toast buttons (`bookmarkToastResume`, `bookmarkToastRestart`)
- Gill series controls (`data-fc-action="save"`)

**Impact:** Violates WCAG 2.1 Level A guidelines (1.3.1 Info and Relationships, 4.1.2 Name, Role, Value)  
**Note:** Большинство — FAQ accordion buttons, которые имеют текст внутри, но screen readers могут не корректно их читать

---

### NEW-27: 2 короткие meta descriptions (< 100 chars)
**Files:** `baptisty-rossii/*/index.html`  
**Problem:** Meta descriptions короче 100 символов (SEO best practice: 150-160 chars)

**Short descriptions:**
1. `iniciativnaya-gruppa`: 85 chars
2. `noch-na-kure`: 96 chars

**Impact:** Search engines may show incomplete snippets

---

## ⚪ S0 — Documentation

### NEW-03 (also P2): !important counts out of sync
### NEW-04 (also P2): Phantom CSS file
### NEW-10 (also P3): CSS count conflict

---

## ✅ Positive Checks

| Check | Result |
|-------|--------|
| All 10 karty/*/route.json | ✅ Valid JSON |
| CSS brace balance | ✅ 0 (balanced) |
| eval()/Function() in JS | ✅ 0 occurrences |
| http:// mixed content | ✅ 0 insecure links |
| SW CACHE_VERSION | ✅ Up-to-date (v182, 20260702) |
| Scheduled workflows | ✅ 3 weekly schedules |
| MDX files readingTime | ✅ All 20 files have readingTime |
| Image references | ✅ All 213 references valid |
| JSON-LD validity | ✅ All valid (0 broken) |
| Canonical URLs | ✅ All match og:url |
| Duplicate titles | ✅ None found |
| AGENTS.md §2 JS inventory | ✅ Matches reality |

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
| `lane/sw-precache-fix` | NEW-24 | Fix SW precache list |
| `lane/a11y-aria-labels` | NEW-25 | Add aria-labels to buttons |
| `lane/mdx-html-sync` | NEW-26 | Sync MDX and HTML titles |
| `lane/seo-meta-descriptions` | NEW-27 | Extend short meta descriptions |
| `lane/performance-preload` | NEW-28 | Add preload hints for critical CSS |

---

## 📝 Priority Matrix

| Priority | Bug IDs | Action |
|----------|---------|--------|
| **Immediate** | NEW-01 | Fix memory leak (production impact) |
| **High** | NEW-02, NEW-13,14, NEW-26 | Fix data/title inconsistencies (affects UX/SEO) |
| **Medium** | NEW-03,04,18,19,20, NEW-24,25,28 | Fix CSS/SW/A11y/performance issues |
| **Low** | NEW-05,06,07,08,09,15,16,17,21,22,23,27 | Clean up minor issues |
| **Deferred** | NEW-10,11,12 | Documentation cleanup |

---

## 📊 Audit Coverage

**Total files analyzed:**
- 20 legacy HTML articles
- 20 MDX content files
- 7 CSS files
- 12 JS files
- 39 Astro PageHead components
- 8 GitHub workflows
- 5 data JSON files
- 1 Service Worker
- 1 AGENTS.md

**Total lines of code scanned:**
- ~4,500 lines CSS
- ~2,100 lines JS
- ~11,000 lines Astro components
- ~20,000 lines legacy HTML
- ~10,000 lines MDX content

**Audit duration:** 4 passes  
**Pass 1:** Runtime/Architecture/Docs (12 findings)  
**Pass 2:** Data Consistency (4 findings)  
**Pass 3:** CSS/Workflows/Asset-version (7 findings)  
**Pass 4:** HTML/SEO/A11y/Performance (5 findings)

---

**Report location:** `AuditRepo/projects/gb-is-my-strength/incoming/arena-deep-auditor/2026-07-02/`  
**Commit:** pending
