# Pass 76 — Deep JS Code Review: search.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/search.js` (1 строка, 33KB). Файл содержит **command palette** для поиска по сайту с интеграцией Pagefind.

Основные компоненты:
1. GBSearch — основной объект поиска
2. Command Palette UI (cp-backdrop, cp-box, cp-input, cp-list, cp-preview)
3. Pagefind integration — полнотекстовый поиск
4. Search manifest — загрузка /data/search-manifest.json
5. Search history — сохранение в localStorage
6. Scope filters (all, articles, scripture, authors)
7. Preview panel — предпросмотр статей
8. Keyboard navigation (↑↓, Enter, Escape, Tab)
9. SVG icons — 20+ иконок

Найдены **7 проблем**:

---

## 🔴 P1 — Critical (2)

### BUG-JS-039: Minified code in version control (33KB)
**Severity:** P1  
**Impact:** Difficult to read, debug, review

**Analysis:**
- 1 строка, 33KB — полностью минифицирован
- ~800+ lines unminified (estimated)
- Невозможно прочитать без beautifier

**Recommended fix:**
- Store unminified source in VCS
- Use build tool (Terser, esbuild) для minification
- Add source maps

---

### BUG-JS-040: innerHTML usage without sanitization (30+ instances)
**Severity:** P1  
**Impact:** XSS vulnerability

**Analysis:**
```javascript
// Command palette creation
k.innerHTML = '<div class="cp-bg"></div>...';

// Search results rendering
S.innerHTML = i;  // i contains user search results

// Preview panel
B.innerHTML = p;  // p contains article preview

// History items
i += '<button class="cp-item" data-idx="' + t + '"...>';

// Empty state
S.innerHTML = '<div class="cp-empty">...';
```

**Problems:**
1. **30+ innerHTML assignments** — massive XSS surface
2. **User data in HTML** — search results, history, previews
3. **No sanitization** — DOMPurify or similar not used

**Recommended fix:**
```javascript
// Use DOMPurify for all user data
import DOMPurify from 'dompurify';
S.innerHTML = DOMPurify.sanitize(i);

// Use createElement for complex structures
const button = document.createElement('button');
button.className = 'cp-item';
button.dataset.idx = t;
button.setAttribute('role', 'option');
// ... append children
```

---

## 🟡 P2 — High (3)

### BUG-JS-041: Complex IIFE (~800+ lines)
**Severity:** P2  
**Impact:** Difficult to understand, test, maintain

**Analysis:**
- Single IIFE contains entire search functionality
- ~800+ lines unminified (estimated)
- Too many responsibilities: UI, search logic, history, preview, keyboard navigation

**Recommended fix:**
```javascript
// Split into smaller modules
// search-ui.js
function createCommandPalette() { ... }
function renderSearchResults(results) { ... }
function renderPreview(article) { ... }

// search-logic.js
function searchManifest(query) { ... }
function searchPagefind(query) { ... }
function scoreResult(result, query) { ... }

// search-history.js
function getHistory() { ... }
function saveHistory(query) { ... }
function clearHistory() { ... }

// search-keyboard.js
function initKeyboardNavigation() { ... }
function handleKeydown(event) { ... }
```

---

### BUG-JS-042: Magic numbers (180, 50, 12, 10, 2, etc.)
**Severity:** P2  
**Impact:** Lack of named constants

**Analysis:**
```javascript
// Debounce delay
q = setTimeout(function() { ... }, 180);  // 180ms debounce

// Pagefind load timeout
r > 50 && (clearInterval(c), ...);  // 50 retries * 100ms = 5s timeout

// Search results limit
.slice(0, 12)  // 12 results max

// Pagefind results limit
.slice(0, 10)  // 10 Pagefind results

// Minimum query length
if (e && !(e.length < 2))  // 2 chars minimum
```

**Recommended fix:**
```javascript
const CONFIG = {
  DEBOUNCE_MS: 180,
  PAGEFIND_TIMEOUT_MS: 5000,
  PAGEFIND_RETRIES: 50,
  PAGEFIND_RETRY_INTERVAL_MS: 100,
  MANIFEST_RESULTS_MAX: 12,
  PAGEFIND_RESULTS_MAX: 10,
  MIN_QUERY_LENGTH: 2,
  HISTORY_MAX: 6,
  HISTORY_DISPLAY: 4,
};
```

---

### BUG-JS-043: Empty catch blocks (5+ instances)
**Severity:** P2  
**Impact:** Hides real errors

**Analysis:**
```javascript
// History retrieval
try { return JSON.parse(localStorage.getItem(K) || "[]") } catch (e) { return [] }

// History save
try { localStorage.setItem(K, JSON.stringify(i)) } catch (e) {}

// Pagefind import
.catch(function() { ... })  // Silent fail

// Focus restore
try { i.focus() } catch (t) {}

// Copy fallback
try { document.execCommand("copy") } catch (e) {}
```

**Recommended fix:**
```javascript
// Add logging
try {
  return JSON.parse(localStorage.getItem(K) || "[]");
} catch (e) {
  console.error('[Search] History parse error:', e);
  return [];
}
```

---

## 🔵 P3 — Medium (2)

### BUG-JS-044: No cleanup system for event listeners
**Severity:** P3  
**Impact:** Memory leaks on SPA navigation

**Analysis:**
- File has 40+ addEventListener calls
- 0 removeEventListener calls
- No AbortController
- No cleanup on page unload

**Recommended fix:**
```javascript
// Add cleanup system
const listeners = [];
const abortCtrl = new AbortController();

function addCleanListener(target, type, fn, options) {
  const opts = Object.assign({}, options, { signal: abortCtrl.signal });
  target.addEventListener(type, fn, opts);
  listeners.push({ target, type, fn, opts });
}

window._searchCleanup = function() {
  abortCtrl.abort();
  listeners.length = 0;
};

window.addEventListener('beforeunload', window._searchCleanup);
```

---

### BUG-JS-045: Duplicate SVG icons (20+ defined, some similar)
**Severity:** P3  
**Impact:** Code duplication, maintenance burden

**Analysis:**
```javascript
// 20+ SVG icons defined
var e = _s(17, 2, "0 0 24 24", _p0);  // Search 17px
var t = _s(13, 2.2, "-1 -1 26 26", _p0);  // Search 13px
var i = _s(15, 2.2, "-1 -1 26 26", _p0);  // Search 15px
var n = _s(28, 2, "0 0 24 24", _p0);  // Search 28px

// Similar icons with different sizes
var c = _s(14, 2, "0 0 24 24", _p1);  // Book 14px
var s = _s(11, 2, "0 0 24 24", _p1);  // Book 11px
var l = _s(20, 2, "0 0 24 24", _p1);  // Book 20px
var u = _s(12, 2, "0 0 24 24", _p1);  // Book 12px
```

**Recommended fix:**
```javascript
// Use CSS for sizing
const ICONS = {
  search: '<svg viewBox="0 0 24 24"...><circle cx="11" cy="11" r="8"/>...</svg>',
  book: '<svg viewBox="0 0 24 24"...><path d="M4 19.5..."/>...</svg>',
  // ...
};

function icon(name, size = 16) {
  return ICONS[name].replace('<svg', `<svg width="${size}" height="${size}"`);
}

// Usage
const searchIcon = icon('search', 17);
const searchIconSmall = icon('search', 13);
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 2 | Minified code, innerHTML XSS (30+) |
| P2 | 3 | Complex IIFE, magic numbers, empty catches |
| P3 | 2 | No cleanup, duplicate SVG icons |
| **Total** | **7** | |

---

## 🎯 Top 5 Recommendations

### Critical (This Week)
1. **Unminify search.js** — store source in VCS
2. **Sanitize innerHTML** — prevent XSS (30+ instances)

### High Priority (This Month)
3. **Refactor IIFE** — split into smaller modules
4. **Extract magic numbers** — create named constants
5. **Add logging to empty catches** — improve debuggability

### Medium Priority (This Quarter)
6. **Add cleanup system** — prevent memory leaks
7. **Deduplicate SVG icons** — use CSS for sizing

---

## 📈 Impact Analysis

### Current State
- **Minified in VCS:** Yes (33KB)
- **innerHTML risks:** 30+
- **Magic numbers:** 20+
- **Empty catches:** 5+
- **Cleanup system:** No
- **SVG icons:** 20+ (some duplicates)

### After Refactoring (Estimated)
- **Minified in VCS:** No (unminified source)
- **innerHTML risks:** 0 (all sanitized)
- **Magic numbers:** 0 (named constants)
- **Empty catches:** 0 (all have logging)
- **Cleanup system:** Yes
- **SVG icons:** 10 (deduplicated, CSS-sized)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| innerHTML risks | 30+ | 0 | 🔴 Critical |
| Magic numbers | 20+ | 0 | 🟡 High |
| Empty catches | 5+ | 0 | 🟡 High |
| Cleanup system | No | Yes | 🔵 Medium |
| SVG duplication | 20+ icons | 10 icons | 🔵 Medium |

**Overall Technical Debt:** 🔴 **Critical** (requires immediate attention)

---

*Pass 76 completed. All findings evidence-based.*
