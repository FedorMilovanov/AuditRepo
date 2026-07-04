# Pass 78 — Deep JS Code Review: highlights.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/highlights.js` (1 строка, 8.7KB). Файл содержит **quote saver** для сохранения цитат из статей.

Основные компоненты:
1. GBHighlights — основной объект (open, close, getAll)
2. localStorage management — сохранение/загрузка цитат (gb-highlights-v1)
3. UI — panel с цитатами (gb-hl-backdrop, gb-hl-panel, gb-hl-list)
4. FAB button — floating action button
5. Export — экспорт в Markdown
6. Selection tracking — отслеживание выделенного текста
7. Touch gestures — свайп для закрытия

Найдены **5 проблем**:

---

## 🔴 P1 — Critical (1)

### BUG-JS-051: Minified code in version control (8.7KB)
**Severity:** P1  
**Impact:** Difficult to read, debug, review

**Analysis:**
- 1 строка, 8.7KB — полностью минифицирован
- ~220+ lines unminified (estimated)
- Невозможно прочитать без beautifier

**Recommended fix:**
- Store unminified source in VCS
- Use build tool (Terser, esbuild) для minification
- Add source maps

---

## 🟡 P2 — High (3)

### BUG-JS-052: innerHTML usage without sanitization (5+ instances)
**Severity:** P2  
**Impact:** XSS vulnerability

**Analysis:**
```javascript
// Panel creation
a.innerHTML = '<div id="gb-hl-panel">...</div>';

// List rendering
e.innerHTML = n.map(function(n) {
  return `<div class="gb-hl-item" data-id="${n.id}">
    <div class="gb-hl-quote">${i(n.text)}</div>
    <div class="gb-hl-meta">
      <a href="${i(n.url)}" target="_blank" rel="noopener">${i(n.articleTitle||"Статья")}</a>
      ...
    </div>
  </div>`;
}).join("");

// Empty state
e.innerHTML = '<div class="gb-hl-empty">...</div>';

// FAB button
l.innerHTML = '<svg>...</svg><span id="gb-hl-fab-count">0</span>';

// Save button
i.innerHTML = '<svg>...</svg><span>Сохранить</span>';
```

**Problems:**
1. **5+ innerHTML assignments** — XSS surface
2. **User data in HTML** — quote text, article title, URL
3. **Escaping function exists** (`i()`) but not used everywhere

**Recommended fix:**
```javascript
// Use DOMPurify for all user data
import DOMPurify from 'dompurify';
e.innerHTML = DOMPurify.sanitize(n.map(function(n) {
  return `<div class="gb-hl-item" data-id="${i(n.id)}">
    <div class="gb-hl-quote">${i(n.text)}</div>
    <div class="gb-hl-meta">
      <a href="${i(n.url)}" target="_blank" rel="noopener">${i(n.articleTitle||"Статья")}</a>
      ...
    </div>
  </div>`;
}).join(""));

// Use createElement for static content
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
// ... append children
```

---

### BUG-JS-053: Magic numbers (80, 200, 500, 200, 2000, 3000, 12, 8, 50, 25)
**Severity:** P2  
**Impact:** Lack of named constants

**Analysis:**
```javascript
// Touch gesture threshold
e > 80 && f();  // 80px swipe to close

// Maximum highlights
r.length > 200 && (r = r.slice(0, 200));  // 200 max

// Initialization delays
setTimeout(v, 500);  // 500ms delay for selection share
setTimeout(d, 200);  // 200ms delay for list update

// Feedback timeouts
setTimeout(function() { l.textContent = a }, 2000);  // 2s feedback
setTimeout(function() { l.textContent = a }, 1800);  // 1.8s error feedback
setTimeout(function() { URL.revokeObjectURL(i) }, 3000);  // 3s blob cleanup

// Minimum text length
e.length >= 12  // 12 chars minimum
r.length < 8  // 8 chars minimum

// Touch threshold
e > 80  // 80px swipe
```

**Recommended fix:**
```javascript
const CONFIG = {
  // Touch gestures
  SWIPE_THRESHOLD_PX: 80,
  
  // Storage limits
  MAX_HIGHLIGHTS: 200,
  
  // Initialization delays
  SELECTION_SHARE_DELAY_MS: 500,
  LIST_UPDATE_DELAY_MS: 200,
  
  // Feedback timeouts
  SUCCESS_FEEDBACK_MS: 2000,
  ERROR_FEEDBACK_MS: 1800,
  BLOB_CLEANUP_MS: 3000,
  
  // Text validation
  MIN_SELECTION_LENGTH: 12,
  MIN_SAVE_LENGTH: 8,
};
```

---

### BUG-JS-054: Empty catch blocks (5+ instances)
**Severity:** P2  
**Impact:** Hides real errors

**Analysis:**
```javascript
// Storage operations
try { return JSON.parse(localStorage.getItem(n) || "[]") } catch (n) { return [] }
try { return localStorage.setItem(n, JSON.stringify(t)), !0 } catch (o) { ... }
try { return localStorage.setItem(n, JSON.stringify(t.slice(0, 50))), !0 } catch (n) {}
try { console.warn("[highlights] localStorage write failed:", ...) } catch (n) {}
```

**Recommended fix:**
```javascript
// Add logging
try {
  return JSON.parse(localStorage.getItem(n) || "[]");
} catch (e) {
  console.error('[Highlights] Parse error:', e);
  return [];
}
```

---

## 🔵 P3 — Medium (1)

### BUG-JS-055: No cleanup system for event listeners
**Severity:** P3  
**Impact:** Memory leaks on SPA navigation

**Analysis:**
- File has 15+ addEventListener calls
- 2 removeEventListener calls (keydown, touchend)
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

// Automatic cleanup on page unload
window.addEventListener('beforeunload', function() {
  abortCtrl.abort();
  listeners.length = 0;
});
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 1 | Minified code (8.7KB) |
| P2 | 3 | innerHTML XSS, magic numbers, empty catches |
| P3 | 1 | No cleanup system |
| **Total** | **5** | |

---

## 🎯 Top 5 Recommendations

### Critical (This Week)
1. **Unminify highlights.js** — store source in VCS

### High Priority (This Month)
2. **Sanitize innerHTML** — prevent XSS (5+ instances)
3. **Extract magic numbers** — create CONFIG object
4. **Add logging to empty catches** — improve debuggability

### Medium Priority (This Quarter)
5. **Add cleanup system** — prevent memory leaks

---

## 📈 Impact Analysis

### Current State
- **Minified in VCS:** Yes (8.7KB)
- **innerHTML risks:** 5+
- **Magic numbers:** 10+
- **Empty catches:** 5+
- **Cleanup system:** No

### After Refactoring (Estimated)
- **Minified in VCS:** No (unminified source)
- **innerHTML risks:** 0 (all sanitized)
- **Magic numbers:** 0 (named constants)
- **Empty catches:** 0 (all have logging)
- **Cleanup system:** Yes (AbortController)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| innerHTML risks | 5+ | 0 | 🟡 High |
| Magic numbers | 10+ | 0 | 🟡 High |
| Empty catches | 5+ | 0 | 🟡 High |
| Cleanup system | No | Yes | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

*Pass 78 completed. All findings evidence-based.*
