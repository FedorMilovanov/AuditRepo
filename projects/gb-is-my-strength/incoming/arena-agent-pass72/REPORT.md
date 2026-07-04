# Pass 72 — Deep JS Code Review: site.js (Minified)

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/site.js` (579 строк, 167KB). Найдены **6 критических проблем**:

1. **Минифицированный код в version control** — затрудняет чтение и отладку
2. **Огромный размер** — 167KB (слишком много для одного файла)
3. **Дублирование кода** — функция `tt()` и tooltip logic определены несколько раз
4. **SiteUtils monolith** — объект с слишком много responsibilities
5. **Нет cleanup system** — в отличие от floating-cluster-controller.js
6. **61 innerHTML assignment** — potential XSS риски (уже найдено в Pass 65)

**Positive findings:**
- ✅ Модульная структура (IIFE для каждого компонента)
- ✅ Хорошая feature detection
- ✅ Defensive programming (много try/catch)

---

## 🔴 P1 — Architecture (3)

### BUG-JS-009: Minified code in version control
**Severity:** P1  
**Impact:** Difficult to read, debug, and review

**Analysis:**
- Файл минифицирован — весь код в нескольких длинных строках
- Git diffs показывают entire lines changed для small modifications
- Нет source maps для browser DevTools

**Recommended fix:**
- Store unminified JS в version control
- Use build tool (Terser, esbuild) для minification в production
- Add source maps для debugging

**Repair lane:** js-build-pipeline (1-2 days)

---

### BUG-JS-010: Huge file size (167KB minified)
**Severity:** P1  
**Impact:** Slow loading, difficult to maintain

**Analysis:**
- 167KB minified = ~500KB+ unminified
- Слишком много для одного файла
- Browser must download and parse entire file before execution

**Recommended fix:**
- Split into multiple files:
  - `site-utils.js` (core utilities)
  - `tooltip.js` (tooltip controller)
  - `theme.js` (theme management)
  - `share.js` (share dialog)
  - `quiz.js` (quiz system)
  - `tts.js` (text-to-speech)
  - etc.
- Use code splitting для lazy loading

**Repair lane:** js-architecture-refactor (2-3 weeks)

---

### BUG-JS-011: SiteUtils monolith — too many responsibilities
**Severity:** P1  
**Impact:** Difficult to maintain, test, and understand

**Analysis:**

SiteUtils объект содержит:
- Tooltip controller (makeTooltipController, positionTip)
- Scroll lock system (lockScroll, unlockScroll)
- Theme management (themeKey, barThemeBtn)
- Share dialog (copyText)
- Viewport management (onViewportChange, getViewportMaxH)
- Page type detection (pageType, isArticle, isHome)
- Feature detection (featureToc, featureShare)
- DOM utilities (ready, qs, qsa, scrollRaf)
- Pluralization (pluralRu)
- Keyboard utilities (isEscape)
- And more...

**Problems:**
1. **God object** — слишком много responsibilities
2. **Tight coupling** — все компоненты зависят от SiteUtils
3. **Difficult to test** — must mock entire SiteUtils для testing одного компонента
4. **Difficult to maintain** — changes в одном методе могут сломать другие

**Recommended fix:**
```javascript
// Split into separate modules
window.SiteUtils = { /* core utilities only */ };
window.TooltipController = { /* tooltip logic */ };
window.ScrollLock = { /* scroll lock system */ };
window.ThemeManager = { /* theme management */ };
window.ShareDialog = { /* share dialog */ };
// etc.
```

**Repair lane:** js-architecture-refactor (1-2 weeks)

---

## 🟡 P2 — Code Quality (2)

### BUG-JS-012: Duplicate code — tt() function defined multiple times
**Severity:** P2  
**Impact:** Code duplication, maintenance burden

**Analysis:**

Функция `tt()` (HTML escape) определена несколько раз:
```javascript
// Line 1 (main SiteUtils)
function tt(n){return String(n||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}

// Line 300+ (in quiz IIFE)
function tt(e){return String(null==e?"":e).replace(/[&<>"]/g,function(e){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[e]})}

// Line 400+ (in backlinks IIFE)
function tt(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}
```

**Problems:**
1. **3+ definitions** — must update all when changing escape logic
2. **Slightly different implementations** — one uses object lookup, others use chained replace
3. **Maintenance burden** — easy to forget to update all definitions

**Recommended fix:**
```javascript
// Define once in SiteUtils
SiteUtils.escapeHtml = function(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

// Use everywhere
var escaped = SiteUtils.escapeHtml(userInput);
```

**Repair lane:** js-deduplication (1 hour)

---

### BUG-JS-013: No cleanup system for event listeners
**Severity:** P2  
**Impact:** Memory leaks on SPA navigation

**Analysis:**

В отличие от `floating-cluster-controller.js`, site.js не имеет cleanup system:
- Нет AbortController
- Нет `_registeredListeners` tracking
- Нет `_fcCleanupListeners()` function
- Event listeners накапливаются при re-initialization

**Problems:**
1. **Memory leaks** — listeners не удаляются
2. **Duplicate handlers** — при re-initialization добавляются новые listeners
3. **SPA navigation** — если сайт использует client-side routing, listeners накапливаются

**Recommended fix:**
```javascript
// Add cleanup system like floating-cluster-controller.js
var _registeredListeners = [];
var abortCtrl = new AbortController();

function addCleanListener(target, type, fn, options) {
  var opts = Object.assign({}, options, { signal: abortCtrl.signal });
  target.addEventListener(type, fn, opts);
  _registeredListeners.push({ target, type, fn, opts });
}

window._siteCleanup = function() {
  abortCtrl.abort();
  abortCtrl = new AbortController();
  _registeredListeners = [];
};

// Cleanup on page unload
window.addEventListener('beforeunload', window._siteCleanup);
window.addEventListener('pagehide', window._siteCleanup);
```

**Repair lane:** js-memory-management (2-3 hours)

---

## 🔵 P3 — Performance (1)

### BUG-JS-014: Duplicate tooltip positioning logic
**Severity:** P3  
**Impact:** Code duplication, maintenance burden

**Analysis:**

Tooltip positioning logic дублируется:
- `SiteUtils.positionTip()` (line ~50)
- Inline positioning в backlinks IIFE (line ~450)
- Inline positioning в verse popovers IIFE (line ~500)

**Recommended fix:**
```javascript
// Use SiteUtils.positionTip() everywhere
SiteUtils.positionTip(vTip, el);
SiteUtils.positionTip(owCard, el);
```

**Repair lane:** js-deduplication (30 minutes)

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 3 | Minified code, huge file size, SiteUtils monolith |
| P2 | 2 | Duplicate tt() function, no cleanup system |
| P3 | 1 | Duplicate tooltip positioning |
| **Total** | **6** | |

---

## 🎯 Recommended Actions

### This Quarter (Critical)
1. **BUG-JS-009** — Store unminified JS in version control, minify in build pipeline
   - Estimated effort: 1-2 days
   - Impact: Improves readability, debugging

2. **BUG-JS-013** — Add cleanup system for event listeners
   - Estimated effort: 2-3 hours
   - Impact: Prevents memory leaks

### Next Quarter (High Priority)
3. **BUG-JS-010** — Split site.js into multiple smaller files
   - Estimated effort: 2-3 weeks
   - Impact: Improves maintainability, loading performance

4. **BUG-JS-011** — Refactor SiteUtils monolith into separate modules
   - Estimated effort: 1-2 weeks
   - Impact: Improves maintainability, testability

### Advisory (Low Priority)
5. **BUG-JS-012** — Deduplicate tt() function
   - Estimated effort: 1 hour
   - Impact: Reduces code duplication

6. **BUG-JS-014** — Deduplicate tooltip positioning logic
   - Estimated effort: 30 minutes
   - Impact: Reduces code duplication

---

## 📈 Impact Analysis

### Current State
- **File size:** 167KB minified (~500KB+ unminified)
- **Minified in VCS:** Yes
- **Cleanup system:** No
- **Duplicate code:** 3+ instances
- **Maintainability:** 🔴 Critical (minified, monolith, no cleanup)

### After Refactoring (Estimated)
- **File size:** ~300KB total (split into 10+ files, ~30KB each)
- **Minified in VCS:** No (unminified source, minified build)
- **Cleanup system:** Yes (AbortController + manual tracking)
- **Duplicate code:** 0
- **Maintainability:** 🟢 Good (modular, readable, cleanup)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| File size | 167KB | <50KB per file | 🔴 Critical |
| Cleanup system | No | Yes | 🟡 High |
| Duplicate code | 3+ instances | 0 | 🟡 High |
| God object (SiteUtils) | Yes | No | 🔴 Critical |

**Overall Technical Debt:** 🔴 **Critical** (requires complete refactoring and build pipeline)

---

## 📝 Comparison with floating-cluster-controller.js

| Metric | floating-cluster-controller.js | site.js |
|--------|-------------------------------|---------|
| Lines | 1494 | 579 (minified) |
| Size | 61KB | 167KB (minified) |
| Minified | No | **Yes** |
| Cleanup system | **Yes** | No |
| Duplicate code | 1 instance | **3+ instances** |
| God object | No | **Yes (SiteUtils)** |
| Overall debt | 🟡 High | 🔴 Critical |

**Key differences:**
- **floating-cluster-controller.js** has good structure, cleanup system, but memory leaks and complexity issues
- **site.js** is minified, has no cleanup system, has god object, but modular structure (IIFE)

**Both require refactoring**, but site.js is more critical due to minification and god object.

---

*Pass 72 completed. All findings evidence-based.*
