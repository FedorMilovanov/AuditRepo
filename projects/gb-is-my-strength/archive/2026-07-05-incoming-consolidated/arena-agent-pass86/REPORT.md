# Pass 86 — Astro Components Audit: BaseLayout.astro

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** файла `src/layouts/BaseLayout.astro` (177 строк, 7KB). Это основной Astro layout для всех страниц.

Основные компоненты:
1. SEO компонент — вынесен отдельно
2. Header/Footer компоненты
3. Legacy runtime injection через makeGenericRuntime()
4. Lazy search loading
5. Font preloading
6. Navigation prefetch hints

Найдены **0 критических проблем**, **2 рекомендации**:

---

## ✅ Positive Findings

### Good Architecture
- ✅ Clean Astro layout structure
- ✅ SEO component extracted separately
- ✅ Header/Footer components modular
- ✅ Props interface well-defined (20+ props)
- ✅ Default values for optional props

### Good Performance Optimizations
- ✅ Lazy search loading (~31KB saved on initial pageload)
- ✅ Font preloading (3 fonts)
- ✅ Navigation prefetch hints (5 pages)
- ✅ Core CSS loaded efficiently

### Good Code Quality
- ✅ TypeScript props interface
- ✅ Clean function separation
- ✅ Good comments explaining decisions
- ✅ No inline styles
- ✅ Proper HTML semantics

---

## 🔵 P3 — Recommendations (2)

### BUG-ASTRO-001: Large inline script in makeGenericRuntime()
**Severity:** P3  
**Impact:** Difficult to maintain, no versioning

**Analysis:**
```javascript
function makeGenericRuntime(includeMetrika = true) {
  // ...
  const metrika = `<script>\n(function(m,e,t,r,i,k,a){...})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');\nym(108353327,'init',{...});\n</script>\n...`;
  const cfg = `<script>window.SITE_CONFIG=${JSON.stringify(config)};</script>`;
  return [
    includeMetrika ? metrika_preconnect + metrika : '',
    cfg,
    `<script defer src="${assetUrl('js/site-utils.js')}"></script>`,
    // ...
    `<script>!function(){...}();</script>`,  // Lazy search loader
  ].join('\n');
}
```

**Problems:**
1. **Large inline scripts** — Yandex.Metrika, SITE_CONFIG, lazy search loader
2. **No versioning** — inline scripts not versioned
3. **Difficult to maintain** — complex string concatenation

**Recommended fix:**
```javascript
// Move to external files
<script src="/js/metrika.js?v=abc123" defer></script>
<script src="/js/site-config.js?v=def456" defer></script>
<script src="/js/search-loader.js?v=ghi789" defer></script>
```

---

### BUG-ASTRO-002: Magic numbers in makeGenericRuntime()
**Severity:** P3  
**Impact:** Lack of named constants

**Analysis:**
```javascript
const metrika = `...\nym(108353327,'init',{...});\n...`;  // Yandex ID
```

**Recommended fix:**
```javascript
const CONFIG = {
  YANDEX_METRIKA_ID: '108353327',
};

const metrika = `...\nym(${CONFIG.YANDEX_METRIKA_ID},'init',{...});\n...`;
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P3 | 2 | Large inline scripts, magic numbers |
| **Total** | **2** | |

---

## 🎯 Top 2 Recommendations

### Medium Priority (This Quarter)
1. **Move inline scripts to external files** — improve maintainability
2. **Extract magic numbers** — create CONFIG object

---

## 📈 Impact Analysis

### Current State
- **Inline scripts:** 3 large (Metrika, SITE_CONFIG, search loader)
- **Magic numbers:** 1 (Yandex ID)
- **Code quality:** Good
- **Performance:** Good (lazy loading, prefetch)

### After Refactoring (Estimated)
- **Inline scripts:** 0 (all external)
- **Magic numbers:** 0 (named constants)
- **Code quality:** Excellent
- **Performance:** Excellent (better caching)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Inline scripts | 3 large | 0 | 🔵 Medium |
| Magic numbers | 1 | 0 | 🔵 Medium |
| Code quality | Good | Excellent | 🟢 Good |
| Performance | Good | Excellent | 🟢 Good |

**Overall Technical Debt:** 🟢 **Low** (minor improvements needed)

---

*Pass 86 completed. All findings evidence-based.*
