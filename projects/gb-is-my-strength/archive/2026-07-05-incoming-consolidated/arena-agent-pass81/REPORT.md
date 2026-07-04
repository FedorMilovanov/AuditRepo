# Pass 81 — Deep JS Code Review: site-utils.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/site-utils.js` (1 строка, 2.3KB). Файл содержит **scroll lock management** для блокировки прокрутки при открытых модалках.

Основные компоненты:
1. Scroll lock system — lockScroll/unlockScroll с именованными замками
2. Emergency timer — setInterval каждые 3 секунды проверяет зависшие замки
3. Emergency unlock — принудительная разблокировка если модалок нет, но замки висят
4. Cleanup — pagehide/beforeunload event listeners

Найдены **3 проблемы**:

---

## 🔴 P1 — Critical (1)

### BUG-JS-065: Minified code in version control (2.3KB)
**Severity:** P1  
**Impact:** Difficult to read, debug, review

**Analysis:**
- 1 строка, 2.3KB — полностью минифицирован
- ~60+ lines unminified (estimated)
- Невозможно прочитать без beautifier

**Recommended fix:**
- Store unminified source in VCS
- Use build tool (Terser, esbuild) для minification
- Add source maps

---

## 🟡 P2 — High (1)

### BUG-JS-066: Magic number (3000)
**Severity:** P2  
**Impact:** Lack of named constant

**Analysis:**
```javascript
// Emergency timer interval
window.SiteUtils._startEmergencyTimer = function() {
  o || (o = setInterval(l, 3000));  // 3s interval
};
```

**Recommended fix:**
```javascript
const CONFIG = {
  EMERGENCY_TIMER_INTERVAL_MS: 3000,
};

window.SiteUtils._startEmergencyTimer = function() {
  o || (o = setInterval(l, CONFIG.EMERGENCY_TIMER_INTERVAL_MS));
};
```

---

## 🔵 P3 — Medium (1)

### BUG-JS-067: console.warn in production code
**Severity:** P3  
**Impact:** Information leakage, performance overhead

**Analysis:**
```javascript
// Emergency unlock logging
if (!t && o) {
  console.warn("[SiteUtils] Emergency unlock — модалок нет, замки висят:", e);
  // ...
}
```

**Recommended fix:**
```javascript
// Conditional logging
const DEBUG = window.SITE_CONFIG && window.SITE_CONFIG.debug;

if (!t && o) {
  if (DEBUG) {
    console.warn("[SiteUtils] Emergency unlock — модалок нет, замки висят:", e);
  }
  // ...
}
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 1 | Minified code (2.3KB) |
| P2 | 1 | Magic number (3000) |
| P3 | 1 | console.warn in production |
| **Total** | **3** | |

---

## 🎯 Top 3 Recommendations

### Critical (This Week)
1. **Unminify site-utils.js** — store source in VCS

### High Priority (This Month)
2. **Extract magic number** — create CONFIG object

### Medium Priority (This Quarter)
3. **Conditional logging** — use DEBUG flag

---

## 📈 Impact Analysis

### Current State
- **Minified in VCS:** Yes (2.3KB)
- **Magic numbers:** 1
- **Production logging:** Yes (console.warn)

### After Refactoring (Estimated)
- **Minified in VCS:** No (unminified source)
- **Magic numbers:** 0 (named constant)
- **Production logging:** No (conditional)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| Magic numbers | 1 | 0 | 🟡 High |
| Production logging | Yes | No | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

*Pass 81 completed. All findings evidence-based.*
