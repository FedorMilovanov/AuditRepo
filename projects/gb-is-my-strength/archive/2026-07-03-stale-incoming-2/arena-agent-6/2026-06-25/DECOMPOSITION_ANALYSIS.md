# DEEP ANALYSIS — site.js Decomposition, CSS Specificity, SEO Completeness
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, production comparison

---

## 1. SITE.JS DECOMPOSITION ANALYSIS

### Current State
- **166KB** minified, no source map
- Contains **13 logical modules** that could be extracted
- Already has 4 extracted modules in `js/modules/` (back-to-top, faq-accordion, img-loaded, theme)

### Extractable Modules (by reference count)

| Module | References | Priority |
|---|---|---|
| quiz | 229 | HIGH — largest section |
| scroll-progress | 121 | HIGH — complex |
| tooltip | 50 | MEDIUM |
| footnote | 9 | LOW |
| theme-toggle | 5 | LOW — already extracted |
| lazy-image | 5 | LOW |
| faq-accordion | 3 | LOW — already extracted |
| glossary | 2 | LOW |
| back-to-top | 1 | LOW — already extracted |
| reading-time | 1 | LOW |
| bookmark | 1 | LOW |
| highlight | 1 | LOW |

### Recommendation
- Extract **quiz** module first (229 references, largest)
- Extract **scroll-progress** module (121 references)
- Extract **tooltip** module (50 references)
- Keep theme-toggle, faq-accordion, back-to-top, img-loaded as already extracted
- Use esbuild/rollup for bundling with source maps

---

## 2. CSS SPECIFICITY ANALYSIS

### site.css
- **202 !important** declarations (target: ≤150)
- **115 unique !important rules**
- Top prefixes: `html` (12), `body` (10), `html:not(` (9)
- 8 @layer declarations (reset, base, components, utilities, fallback)
- 173 @media queries
- 206 CSS custom properties

### floating-cluster.css
- **207 !important** declarations
- 2 @layer declarations

### Nagornaya Tailwind (tw.min.css)
- 34KB separate file
- Not integrated into @layer architecture
- Potential specificity conflicts with site.css

### Recommendation
- Reduce !important from 202 to ≤150
- Integrate Tailwind into site-layered.css @layer
- Audit unlayered overlap by key selectors

---

## 3. SEO COMPLETENESS

### Articles (11 checked): ✅ ALL COMPLETE
All articles have: title, description, canonical, og:image, og:title, json-ld, h1, robots

### Nagornaya (10 checked): ✅ ALL COMPLETE

### Baptisty (12 checked): ✅ ALL COMPLETE

### Missing from sitemap/search-manifest:
- 8 karty subroutes
- 1 konfessii app route (not a real page)

---

## 4. INTERNAL LINKS

### Gill Part1 internal links: 5 found
- https://gospod-bog.ru/articles/dzhon-gill-chast-1-chelovek/
- ../../biografii/ (2x)
- /articles/dzhon-gill-chast-2-uchenyi/
- /articles/dzhon-gill-chast-3-nasledie/

### No obviously dead links found

---

## 5. PRODUCTION LIVE CHECK

### All pages working:
| Page | Status | Size |
|---|---|---|
| / | 200 | 62KB |
| /articles/dzhon-gill-chast-1-chelovek/ | 200 | 146KB |
| /nagornaya/chast-1/ | 200 | 133KB |
| /karty/avraam/ | 200 | 7KB |
| /baptisty-rossii/noch-na-kure/ | 200 | 34KB |
| /konfessii/russkij-baptizm/ | 200 | 13KB |

### CSS file sizes:
- site.css: 283KB
- floating-cluster.css: 69KB
- mobile-hotfix.css: 16KB

---

## 6. CORRECTED BUG COUNT

### No new bugs from this session — verification only

### Updated total:
- **Total bugs found:** 31
- **False positives:** 7
- **Net confirmed:** 24
