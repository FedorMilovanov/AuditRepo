# Pass 82 — Deep JS Code Review: scroll-perf.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/scroll-perf.js` (1 строка, 1.7KB). Файл содержит **scroll performance optimization** и **visual viewport tracking**.

Основные компоненты:
1. ScrollBus — pub/sub system для scroll events
2. Visibility tracking — document.hidden для pause/resume
3. Visual viewport tracking — window.visualViewport для keyboard height
4. Hebrew measure scheduler — scheduleHebrewMeasure для отложенных измерений

Найдены **3 проблемы**:

---

## 🔴 P1 — Critical (1)

### BUG-JS-068: Minified code in version control (1.7KB)
**Severity:** P1  
**Impact:** Difficult to read, debug, review

**Analysis:**
- 1 строка, 1.7KB — полностью минифицирован
- ~50+ lines unminified (estimated)
- Невозможно прочитать без beautifier

**Recommended fix:**
- Store unminified source in VCS
- Use build tool (Terser, esbuild) для minification
- Add source maps

---

## 🟡 P2 — High (1)

### BUG-JS-069: Magic numbers (120, 100)
**Severity:** P2  
**Impact:** Lack of named constants

**Analysis:**
```javascript
// Hebrew measure delay
window.SiteUtils.scheduleHebrewMeasure = function(e) {
  clearTimeout(o);
  o = setTimeout(function() {
    requestAnimationFrame(e);
  }, 120);  // 120ms delay
};

// Visual viewport debounce
function c() {
  clearTimeout(r);
  r = setTimeout(function() {
    var e = window.visualViewport.height || window.innerHeight;
    var t = window.innerHeight - e;
    document.documentElement.style.setProperty("--visual-viewport-h", e + "px");
    document.documentElement.style.setProperty("--keyboard-height", Math.max(0, t) + "px");
  }, 100);  // 100ms debounce
}
```

**Recommended fix:**
```javascript
const CONFIG = {
  HEBREW_MEASURE_DELAY_MS: 120,
  VISUAL_VIEWPORT_DEBOUNCE_MS: 100,
};

window.SiteUtils.scheduleHebrewMeasure = function(e) {
  clearTimeout(o);
  o = setTimeout(function() {
    requestAnimationFrame(e);
  }, CONFIG.HEBREW_MEASURE_DELAY_MS);
};
```

---

## 🔵 P3 — Medium (1)

### BUG-JS-070: Empty catch block (1 instance)
**Severity:** P3  
**Impact:** Hides real errors

**Analysis:**
```javascript
// ScrollBus subscriber error handling
e.forEach(function(e) {
  try {
    e(n);
  } catch (e) {}
});
```

**Recommended fix:**
```javascript
// Add logging
e.forEach(function(e) {
  try {
    e(n);
  } catch (e) {
    console.error('[ScrollBus] Subscriber error:', e);
  }
});
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 1 | Minified code (1.7KB) |
| P2 | 1 | Magic numbers (120, 100) |
| P3 | 1 | Empty catch block |
| **Total** | **3** | |

---

## 🎯 Top 3 Recommendations

### Critical (This Week)
1. **Unminify scroll-perf.js** — store source in VCS

### High Priority (This Month)
2. **Extract magic numbers** — create CONFIG object

### Medium Priority (This Quarter)
3. **Add logging to empty catch** — improve debuggability

---

## 📈 Impact Analysis

### Current State
- **Minified in VCS:** Yes (1.7KB)
- **Magic numbers:** 2
- **Empty catches:** 1

### After Refactoring (Estimated)
- **Minified in VCS:** No (unminified source)
- **Magic numbers:** 0 (named constants)
- **Empty catches:** 0 (has logging)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| Magic numbers | 2 | 0 | 🟡 High |
| Empty catches | 1 | 0 | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

*Pass 82 completed. All findings evidence-based.*
