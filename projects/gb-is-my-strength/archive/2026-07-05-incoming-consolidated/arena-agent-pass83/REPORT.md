# Pass 83 — Deep HTML Code Review: index.html

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** файла `index.html` (1142 строки, 75KB). Это главная страница сайта.

Основные компоненты:
1. SEO meta tags (title, description, keywords, OG, Twitter, JSON-LD)
2. Accessibility (skip-link, aria-labels, roles)
3. Performance (preconnect, preload)
4. Security (CSP meta tag)
5. Semantic structure (nav, main, section, footer)
6. Inline scripts (SITE_CONFIG, Yandex.Metrika, favorites, search loader)

Найдены **5 проблем**:

---

## 🟡 P2 — High (3)

### BUG-HTML-001: Inline scripts without cleanup (10+ instances)
**Severity:** P2  
**Impact:** Memory leaks, difficult to maintain

**Analysis:**
```html
<!-- SITE_CONFIG -->
<script>
window.SITE_CONFIG = {
  version: 1778943682,
  // ...
};
</script>

<!-- Yandex.Metrika -->
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){ ... })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=108353327','ym');
  // ...
</script>

<!-- Favorites script -->
<script>
(function() {
  var FAV_KEY = 'gb-favorites';
  // ...
  card.innerHTML = imgHtml + '...';
  // ...
})();
</script>

<!-- Search loader -->
<script>
!function(){ ... }();
</script>
```

**Problems:**
1. **10+ inline scripts** — difficult to maintain, no versioning
2. **No cleanup** — event listeners not removed on page unload
3. **Duplicate functionality** — favorites script duplicates bookmark-engine.js

**Recommended fix:**
```javascript
// Move to external files with versioning
<script src="js/site-config.js?v=abc123" defer></script>
<script src="js/favorites-inline.js?v=def456" defer></script>

// Add cleanup
window.addEventListener('beforeunload', function() {
  // Cleanup event listeners
});
```

---

### BUG-HTML-002: innerHTML without sanitization in favorites script
**Severity:** P2  
**Impact:** XSS vulnerability

**Analysis:**
```javascript
// Favorites script (lines ~1100-1120)
card.innerHTML = imgHtml +
  '<div class="favorites-card__body">' +
    section +
    '<span class="favorites-card__title">' + (f.title || 'Статья') + '</span>' +
    (f.description ? '<span class="favorites-card__desc">' + f.description + '</span>' : '') +
  '</div>';
```

**Problems:**
1. **User data in HTML** — f.title, f.description from localStorage
2. **No sanitization** — DOMPurify or similar not used
3. **XSS risk** — malicious localStorage data could inject scripts

**Recommended fix:**
```javascript
// Use DOMPurify
import DOMPurify from 'dompurify';
card.innerHTML = DOMPurify.sanitize(imgHtml + '...');

// Or use createElement
const title = document.createElement('span');
title.className = 'favorites-card__title';
title.textContent = f.title || 'Статья';  // Safe
card.appendChild(title);
```

---

### BUG-HTML-003: Magic numbers (1778943682, 108353327)
**Severity:** P2  
**Impact:** Lack of named constants

**Analysis:**
```html
<!-- SITE_CONFIG version -->
<script>
window.SITE_CONFIG = {
  version: 1778943682,  // Magic number
  // ...
};
</script>

<!-- Yandex.Metrika ID -->
<script>
  ym(108353327, 'init', { ... });  // Magic number
</script>
```

**Recommended fix:**
```javascript
// Use named constants
const CONFIG = {
  VERSION: '1778943682',
  YANDEX_METRIKA_ID: '108353327',
};

window.SITE_CONFIG = {
  version: CONFIG.VERSION,
  // ...
};

ym(CONFIG.YANDEX_METRIKA_ID, 'init', { ... });
```

---

## 🔵 P3 — Medium (2)

### BUG-HTML-004: Duplicate favorites functionality
**Severity:** P3  
**Impact:** Code duplication, maintenance burden

**Analysis:**
- Inline favorites script (lines ~1100-1120) duplicates bookmark-engine.js
- Both use localStorage key 'gb-favorites'
- Both render favorites cards

**Recommended fix:**
```javascript
// Remove inline script, use bookmark-engine.js
// Ensure bookmark-engine.js has favorites rendering functionality
```

---

### BUG-HTML-005: No noscript fallback for interactive elements
**Severity:** P3  
**Impact:** Poor experience for users without JavaScript

**Analysis:**
```html
<!-- Hero search bar -->
<button class="h-hero-search" id="heroSearchBar" data-action="open-search">
  <!-- No noscript fallback -->
</button>

<!-- Mobile dock -->
<nav class="h-mobile-dock">
  <button data-action="open-search">
    <!-- No noscript fallback -->
  </button>
</nav>
```

**Recommended fix:**
```html
<noscript>
  <div class="noscript-search">
    <form action="/search/" method="get">
      <input type="search" name="q" placeholder="Поиск...">
      <button type="submit">Найти</button>
    </form>
  </div>
</noscript>
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P2 | 3 | Inline scripts, innerHTML XSS, magic numbers |
| P3 | 2 | Duplicate functionality, no noscript fallback |
| **Total** | **5** | |

---

## 🎯 Top 5 Recommendations

### High Priority (This Month)
1. **Move inline scripts to external files** — improve maintainability
2. **Sanitize innerHTML** — prevent XSS in favorites script
3. **Extract magic numbers** — create CONFIG object

### Medium Priority (This Quarter)
4. **Remove duplicate favorites functionality** — use bookmark-engine.js
5. **Add noscript fallbacks** — improve accessibility

---

## 📈 Impact Analysis

### Current State
- **Inline scripts:** 10+
- **innerHTML risks:** 1 (favorites)
- **Magic numbers:** 2
- **Duplicate functionality:** Yes (favorites)
- **Noscript fallbacks:** No

### After Refactoring (Estimated)
- **Inline scripts:** 0 (all external)
- **innerHTML risks:** 0 (sanitized)
- **Magic numbers:** 0 (named constants)
- **Duplicate functionality:** No
- **Noscript fallbacks:** Yes

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Inline scripts | 10+ | 0 | 🟡 High |
| innerHTML risks | 1 | 0 | 🟡 High |
| Magic numbers | 2 | 0 | 🟡 High |
| Duplicate functionality | Yes | No | 🔵 Medium |
| Noscript fallbacks | No | Yes | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

*Pass 83 completed. All findings evidence-based.*
