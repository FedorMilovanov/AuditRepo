# Pass 80 — Deep JS Code Review: sw-register.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/sw-register.js` (1 строка, 2.6KB). Файл содержит **service worker registration** и **toast notifications**.

Основные компоненты:
1. Service Worker registration — register /sw.js with version
2. Update detection — updatefound event listener
3. Toast notifications — gb-sw-toast для уведомлений
4. Online/offline detection — online/offline events
5. Offline hint — подсказка о доступности офлайн
6. Message handler — navigator.serviceWorker message listener

Найдены **4 проблемы**:

---

## 🔴 P1 — Critical (1)

### BUG-JS-061: Minified code in version control (2.6KB)
**Severity:** P1  
**Impact:** Difficult to read, debug, review

**Analysis:**
- 1 строка, 2.6KB — полностью минифицирован
- ~70+ lines unminified (estimated)
- Невозможно прочитать без beautifier

**Recommended fix:**
- Store unminified source in VCS
- Use build tool (Terser, esbuild) для minification
- Add source maps

---

## 🟡 P2 — High (2)

### BUG-JS-062: Magic numbers (2500, 8000, 3500, 2)
**Severity:** P2  
**Impact:** Lack of named constants

**Analysis:**
```javascript
// Offline hint delay
setTimeout(function() {
  if (!e && !document.hidden) {
    // ...
  }
}, 2500);  // 2.5s delay

// Reload toast timeout
o = setTimeout(function() {
  i && (a.removeEventListener("click", i), i = null);
  d();
}, 8000);  // 8s auto-hide

// Regular toast timeout
o = setTimeout(d, 3500);  // 3.5s auto-hide

// Offline hint count limit
var n = "gb-offline-hint-count";
try {
  var t = parseInt(localStorage.getItem(n) || "0", 10);
  t < 2 && navigator.serviceWorker.controller && // ...
}
```

**Recommended fix:**
```javascript
const CONFIG = {
  // Timing
  OFFLINE_HINT_DELAY_MS: 2500,
  RELOAD_TOAST_AUTO_HIDE_MS: 8000,
  REGULAR_TOAST_AUTO_HIDE_MS: 3500,
  
  // Limits
  MAX_OFFLINE_HINT_COUNT: 2,
};
```

---

### BUG-JS-063: Empty catch blocks (2+ instances)
**Severity:** P2  
**Impact:** Hides real errors

**Analysis:**
```javascript
// localStorage operations
try {
  var t = parseInt(localStorage.getItem(n) || "0", 10);
  t < 2 && navigator.serviceWorker.controller && window.caches && 
    caches.match(location.href).then(function(o) {
      // ...
    }).catch(function() {});
} catch (e) {}
```

**Recommended fix:**
```javascript
// Add logging
try {
  var t = parseInt(localStorage.getItem(n) || "0", 10);
  // ...
} catch (e) {
  console.error('[SW Register] localStorage error:', e);
}
```

---

## 🔵 P3 — Medium (1)

### BUG-JS-064: No cleanup system for event listeners
**Severity:** P3  
**Impact:** Memory leaks on SPA navigation

**Analysis:**
- File has 10+ addEventListener calls
- 2 removeEventListener calls (click, pagehide)
- No AbortController
- Partial cleanup only (pagehide event)

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
| P1 | 1 | Minified code (2.6KB) |
| P2 | 2 | Magic numbers, empty catches |
| P3 | 1 | No cleanup system |
| **Total** | **4** | |

---

## 🎯 Top 4 Recommendations

### Critical (This Week)
1. **Unminify sw-register.js** — store source in VCS

### High Priority (This Month)
2. **Extract magic numbers** — create CONFIG object
3. **Add logging to empty catches** — improve debuggability

### Medium Priority (This Quarter)
4. **Add cleanup system** — prevent memory leaks

---

## 📈 Impact Analysis

### Current State
- **Minified in VCS:** Yes (2.6KB)
- **Magic numbers:** 4
- **Empty catches:** 2+
- **Cleanup system:** Partial (pagehide only)

### After Refactoring (Estimated)
- **Minified in VCS:** No (unminified source)
- **Magic numbers:** 0 (named constants)
- **Empty catches:** 0 (all have logging)
- **Cleanup system:** Yes (AbortController)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| Magic numbers | 4 | 0 | 🟡 High |
| Empty catches | 2+ | 0 | 🟡 High |
| Cleanup system | Partial | Full | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

*Pass 80 completed. All findings evidence-based.*
