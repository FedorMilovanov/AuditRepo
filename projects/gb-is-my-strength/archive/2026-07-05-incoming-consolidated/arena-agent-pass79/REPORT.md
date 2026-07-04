# Pass 79 — Deep JS Code Review: glossary.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/glossary.js` (2 строки, 7.8KB). Файл содержит **glossary tooltips** для автоматического добавления подсказок к терминам в статьях.

Основные компоненты:
1. Glossary loader — загрузка /data/glossary.json
2. Term detection — поиск терминов в тексте с помощью regex
3. Tooltip creation — создание abbr.gterm с .gtip
4. Hydration — добавление tooltip-ов к существующим .gterm
5. Category system — категории терминов
6. Alias system — алиасы для терминов
7. Detail expansion — кнопка "Подробнее"

Найдены **5 проблем**:

---

## 🔴 P1 — Critical (1)

### BUG-JS-056: Minified code in version control (7.8KB)
**Severity:** P1  
**Impact:** Difficult to read, debug, review

**Analysis:**
- 2 строки, 7.8KB — полностью минифицирован
- ~200+ lines unminified (estimated)
- Невозможно прочитать без beautifier

**Recommended fix:**
- Store unminified source in VCS
- Use build tool (Terser, esbuild) для minification
- Add source maps

---

## 🟡 P2 — High (3)

### BUG-JS-057: innerHTML usage without sanitization (3+ instances)
**Severity:** P2  
**Impact:** XSS vulnerability

**Analysis:**
```javascript
// Tooltip creation
a.innerHTML = function(t, e) {
  // ... builds HTML with term definition
  return b;
}(t, e);

// Detail expansion
host.innerHTML = '<span class="gtip-brief"></span>...' +
  '<button type="button" class="gtip-expand-btn" aria-label="Подробнее" aria-expanded="false" data-gtip-expand>' +
  '<span class="gtip-expand-txt">Подробнее</span>' +
  '<svg class="gtip-expand-ico" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">' +
  '<path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg></button>' +
  '<span class="gtip-detail-wrap" aria-hidden="true">' +
  '<span class="gtip-detail"><span class="gtip-papyrus"></span></span></span>';
```

**Problems:**
1. **3+ innerHTML assignments** — XSS surface
2. **User data in HTML** — term definitions from glossary.json
3. **No sanitization** — DOMPurify or similar not used

**Recommended fix:**
```javascript
// Use DOMPurify for all user data
import DOMPurify from 'dompurify';
a.innerHTML = DOMPurify.sanitize(b);

// Use createElement for static content
const brief = document.createElement('span');
brief.className = 'gtip-brief';
brief.textContent = briefTxt;
host.appendChild(brief);
```

---

### BUG-JS-058: Complex regex for term detection
**Severity:** P2  
**Impact:** Difficult to understand, maintain, debug

**Analysis:**
```javascript
// Build regex from all terms
var c = n.map(function(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}).join("|");

var s = null;
if (c) {
  try {
    // Unicode-aware regex
    s = new RegExp("(^|[^\\p{L}\\p{N}_])(" + c + ")(?=$|[^\\p{L}\\p{N}_])", "giu");
  } catch (t) {
    // Fallback to ASCII-only regex
    try {
      s = new RegExp("(^|[^а-яёА-ЯЁa-zA-Z0-9_])(" + c + ")(?=$|[^а-яёА-ЯЁa-zA-Z0-9_])", "gi");
    } catch (t) {
      s = null;
    }
  }
}
```

**Problems:**
1. **Complex regex construction** — difficult to understand
2. **Two regex patterns** — Unicode and ASCII fallback
3. **No comments** — no explanation of regex logic
4. **Error handling** — silent fail on regex errors

**Recommended fix:**
```javascript
// Extract to helper function with documentation
function buildTermRegex(terms) {
  // Escape special regex characters
  const escaped = terms.map(term => 
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  
  // Join terms with OR operator
  const pattern = escaped.join("|");
  
  // Match term boundaries (not part of larger word)
  // \p{L} = Unicode letter, \p{N} = Unicode number
  const boundaryPattern = `(^|[^\\p{L}\\p{N}_])(${pattern})(?=$|[^\\p{L}\\p{N}_])`;
  
  try {
    // Try Unicode-aware regex first
    return new RegExp(boundaryPattern, "giu");
  } catch (e) {
    // Fallback to ASCII-only regex for older browsers
    console.warn('[Glossary] Unicode regex failed, using ASCII fallback:', e);
    const asciiPattern = `(^|[^а-яёА-ЯЁa-zA-Z0-9_])(${pattern})(?=$|[^а-яёА-ЯЁa-zA-Z0-9_])`;
    return new RegExp(asciiPattern, "gi");
  }
}
```

---

### BUG-JS-059: Magic numbers (10, 1200)
**Severity:** P2  
**Impact:** Lack of named constants

**Analysis:**
```javascript
// Paragraph distance threshold
if (!(void 0 !== i[f] && p - i[f] <= 10)) {
  i[f] = p;
  // ...
}

// Initialization delay
setTimeout(fix, 1200);
```

**Recommended fix:**
```javascript
const CONFIG = {
  // Minimum paragraphs between duplicate term tooltips
  MIN_PARAGRAPH_DISTANCE: 10,
  
  // Delay before fixing accessibility issues
  ACCESSIBILITY_FIX_DELAY_MS: 1200,
};
```

---

## 🔵 P3 — Medium (1)

### BUG-JS-060: No cleanup system for event listeners
**Severity:** P3  
**Impact:** Memory leaks on SPA navigation

**Analysis:**
- File has 5+ addEventListener calls
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
| P1 | 1 | Minified code (7.8KB) |
| P2 | 3 | innerHTML XSS, complex regex, magic numbers |
| P3 | 1 | No cleanup system |
| **Total** | **5** | |

---

## 🎯 Top 5 Recommendations

### Critical (This Week)
1. **Unminify glossary.js** — store source in VCS

### High Priority (This Month)
2. **Sanitize innerHTML** — prevent XSS (3+ instances)
3. **Refactor regex** — extract to helper function with documentation
4. **Extract magic numbers** — create CONFIG object

### Medium Priority (This Quarter)
5. **Add cleanup system** — prevent memory leaks

---

## 📈 Impact Analysis

### Current State
- **Minified in VCS:** Yes (7.8KB)
- **innerHTML risks:** 3+
- **Regex complexity:** High (2 patterns, no comments)
- **Magic numbers:** 2
- **Cleanup system:** No

### After Refactoring (Estimated)
- **Minified in VCS:** No (unminified source)
- **innerHTML risks:** 0 (all sanitized)
- **Regex complexity:** Low (helper function, documented)
- **Magic numbers:** 0 (named constants)
- **Cleanup system:** Yes (AbortController)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| innerHTML risks | 3+ | 0 | 🟡 High |
| Regex complexity | High | Low | 🟡 High |
| Magic numbers | 2 | 0 | 🟡 High |
| Cleanup system | No | Yes | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

*Pass 79 completed. All findings evidence-based.*
