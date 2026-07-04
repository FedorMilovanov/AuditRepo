# Pass 74 — Deep JS Code Review: enhancements.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** минифицированного файла `js/enhancements.js` (14 строк, 45KB). Файл содержит **15 независимых модулей** (IIFE):

1. FAQ Schema Generator (JSON-LD)
2. Progress Bar (сегментированный)
3. Interactive Quiz
4. Hebrew Text Cards
5. Scripture Background (анимация)
6. Map Popovers
7. FAQ Accordion (улучшенный)
8. Mobile Collapsible Blocks
9. GBS2 TOC (оглавление серии)
10. GBS2 Sheet/Bar
11. GBS2 Controls (theme/search/share/font)
12. GBS2 Progress Tracking
13. GBS2 Swipe Navigation
14. Home Page Rail
15. Additional utilities

Найдены **8 проблем**:

---

## 🔴 P1 — Critical (2)

### BUG-JS-025: Minified code in version control
**Severity:** P1  
**Impact:** Difficult to read, debug, review

**Analysis:**
- 14 строк, но 45KB — полностью минифицирован
- Невозможно прочитать без beautifier
- Git diffs показывают entire lines changed

**Recommended fix:**
- Store unminified source in VCS
- Use build tool для minification
- Add source maps

---

### BUG-JS-026: Duplicate jget/jset functions (defined 3+ times)
**Severity:** P1  
**Impact:** Code duplication, maintenance burden

**Analysis:**
```javascript
// Defined in GBS2 Progress Tracking IIFE
function jget(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}

// Defined again in GBS2 Swipe Navigation IIFE
function jget(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}

// Defined again in Home Page Rail IIFE
function jget(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}}
function jset(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}
```

**Problems:**
1. **3+ definitions** — must update all when changing logic
2. **Identical implementations** — pure duplication
3. **Maintenance burden** — easy to forget to update all

**Recommended fix:**
```javascript
// Define once in SiteUtils
SiteUtils.jget = function(key, defaultValue) {
  try {
    var value = JSON.parse(localStorage.getItem(key));
    return value == null ? defaultValue : value;
  } catch (e) {
    return defaultValue;
  }
};

SiteUtils.jset = function(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Silent fail
  }
};

// Use everywhere
var data = SiteUtils.jget('my-key', {});
SiteUtils.jset('my-key', data);
```

---

## 🟡 P2 — High (3)

### BUG-JS-027: Multiple empty catch blocks
**Severity:** P2  
**Impact:** Hides real errors

**Analysis:**
```javascript
// Line 1 (FAQ Schema)
try{var o=JSON.parse(e.textContent);...}catch(e){}

// Line 5 (GBS2 Progress)
try{history.replaceState(null,"","#"+id)}catch(_){}

// Line 8 (GBS2 Controls)
try{localStorage.setItem(k,String(v))}catch(_){}
```

**Recommended fix:**
```javascript
// Add logging
try {
  var o = JSON.parse(e.textContent);
  // ...
} catch (e) {
  console.error('[FAQ Schema] JSON parse error:', e);
}
```

---

### BUG-JS-028: innerHTML usage without sanitization (20+ instances)
**Severity:** P2  
**Impact:** XSS vulnerability

**Analysis:**
```javascript
// Line 2 (Progress Bar)
t.innerHTML="";

// Line 5 (GBS2 TOC)
tr.innerHTML="<i></i>";

// Line 9 (GBS2 Progress)
toast.innerHTML='<span><small>Вы здесь были</small>...';

// Line 10 (GBS2 Swipe)
sum.innerHTML='<span class="gbs2-sum-dots">'+dots+'</span>...';
el.innerHTML='<span class="gbs2-peek-img"...>';
tip.innerHTML='<svg...>Свайп от края...</svg>';
```

**Recommended fix:**
```javascript
// Use DOMPurify for user data
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Use createElement for static content
const span = document.createElement('span');
span.className = 'gbs2-sum-dots';
sum.appendChild(span);
```

---

### BUG-JS-029: Magic numbers (600, 80, 28, 90, 210, 70, etc.)
**Severity:** P2  
**Impact:** Lack of named constants

**Analysis:**
```javascript
// Line 2 (Progress Bar)
c=setTimeout(u,100)  // 100ms debounce

// Line 5 (GBS2 TOC)
y+12>=pos[i]  // 12px offset
pos[0]-130  // 130px threshold

// Line 9 (GBS2 Progress)
hideT=setTimeout(function(){hT(false)},9000)  // 9s auto-hide
saved.y>500  // 500px scroll threshold
saved.pc<95  // 95% progress threshold

// Line 10 (GBS2 Swipe)
var EDGE=28,TRIG=90  // 28px edge, 90px trigger
Math.abs(t.clientY-sy)>70  // 70px vertical threshold
Math.min(210,amt)  // 210px max peek
setTimeout(...,5200)  // 5.2s tip display
setTimeout(...,2400)  // 2.4s tip delay
```

**Recommended fix:**
```javascript
// Define constants
const CONFIG = {
  DEBOUNCE_MS: 100,
  SCROLL_OFFSET_PX: 12,
  SCROLL_THRESHOLD_PX: 130,
  AUTO_HIDE_MS: 9000,
  RESUME_SCROLL_THRESHOLD_PX: 500,
  RESUME_PROGRESS_THRESHOLD: 95,
  SWIPE_EDGE_PX: 28,
  SWIPE_TRIGGER_PX: 90,
  SWIPE_VERTICAL_THRESHOLD_PX: 70,
  PEEK_MAX_PX: 210,
  TIP_DISPLAY_MS: 5200,
  TIP_DELAY_MS: 2400,
};
```

---

## 🔵 P3 — Medium (3)

### BUG-JS-030: No cleanup system for event listeners
**Severity:** P3  
**Impact:** Memory leaks on SPA navigation

**Analysis:**
- File has 50+ addEventListener calls
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

window._enhancementsCleanup = function() {
  abortCtrl.abort();
  listeners.length = 0;
};

window.addEventListener('beforeunload', window._enhancementsCleanup);
```

---

### BUG-JS-031: Complex functions (GBS2 TOC ~200 lines, GBS2 Progress ~150 lines)
**Severity:** P3  
**Impact:** Difficult to understand, test, maintain

**Analysis:**
- GBS2 TOC IIFE: ~200 lines
- GBS2 Progress Tracking IIFE: ~150 lines
- GBS2 Swipe Navigation IIFE: ~100 lines

**Recommended fix:**
```javascript
// Split into smaller modules
// gbs2-toc.js
function buildTOC(headings) { ... }
function updateScrollSpy() { ... }
function syncSubgroups() { ... }

// gbs2-progress.js
function calculateProgress() { ... }
function updateUI() { ... }
function saveProgress() { ... }

// gbs2-swipe.js
function initSwipeNavigation() { ... }
function handleTouchStart() { ... }
function handleTouchMove() { ... }
function handleTouchEnd() { ... }
```

---

### BUG-JS-032: Multiple setTimeout without cleanup
**Severity:** P3  
**Impact:** Timer leaks

**Analysis:**
```javascript
// Line 3 (Interactive Quiz)
setTimeout(function(){...},150)

// Line 5 (GBS2 TOC)
setTimeout(rebuild,80)

// Line 9 (GBS2 Progress)
setTimeout(function(){toast.classList.add("gbs2-on")},700)
hideT=setTimeout(function(){hT(false)},9000)
setTimeout(function(){if(toast.parentNode)...},400)

// Line 10 (GBS2 Swipe)
setTimeout(function(){if(p2.parentNode)...},250)
setTimeout(function(){tip.classList.add("gbs2-on")},...)
setTimeout(function(){tip.classList.remove("gbs2-on");...},5200)
setTimeout(...,2400)
```

**Recommended fix:**
```javascript
// Store timer IDs and clear on cleanup
const timers = [];

function safeTimeout(fn, delay) {
  const id = setTimeout(fn, delay);
  timers.push(id);
  return id;
}

function clearAllTimers() {
  timers.forEach(clearTimeout);
  timers.length = 0;
}

window.addEventListener('beforeunload', clearAllTimers);
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 2 | Minified code, duplicate jget/jset |
| P2 | 3 | Empty catches, innerHTML, magic numbers |
| P3 | 3 | No cleanup, complex functions, timer leaks |
| **Total** | **8** | |

---

## 🎯 Top 5 Recommendations

### Critical (This Week)
1. **Unminify enhancements.js** — store source in VCS
2. **Deduplicate jget/jset** — define once in SiteUtils

### High Priority (This Month)
3. **Add logging to empty catches** — improve debuggability
4. **Sanitize innerHTML** — prevent XSS
5. **Extract magic numbers** — create named constants

### Medium Priority (This Quarter)
6. **Add cleanup system** — prevent memory leaks
7. **Refactor complex functions** — improve maintainability
8. **Clear timers on cleanup** — prevent timer leaks

---

## 📈 Impact Analysis

### Current State
- **Minified in VCS:** Yes
- **Duplicate code:** 3+ instances of jget/jset
- **Empty catches:** 10+
- **innerHTML risks:** 20+
- **Magic numbers:** 30+
- **Cleanup system:** No
- **Timer leaks:** 10+

### After Refactoring (Estimated)
- **Minified in VCS:** No (unminified source)
- **Duplicate code:** 0
- **Empty catches:** 0 (all have logging)
- **innerHTML risks:** 0 (all sanitized)
- **Magic numbers:** 0 (named constants)
- **Cleanup system:** Yes
- **Timer leaks:** 0 (all cleared)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| Duplicate code | 3+ instances | 0 | 🔴 Critical |
| Empty catches | 10+ | 0 | 🟡 High |
| innerHTML risks | 20+ | 0 | 🟡 High |
| Magic numbers | 30+ | 0 | 🟡 High |
| Cleanup system | No | Yes | 🔵 Medium |
| Timer leaks | 10+ | 0 | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

## 📝 Comparison with Previous Audits

| Metric | Pass 71 (floating-cluster) | Pass 72 (site.js) | Pass 74 (enhancements.js) |
|--------|---------------------------|-------------------|---------------------------|
| Size | 61KB | 167KB | 45KB |
| Minified | No | Yes | **Yes** |
| Empty catches | 77 | 20 | **10+** |
| innerHTML | ? | 61 | **20+** |
| Duplicate code | 1 | 3+ | **3+ (jget/jset)** |
| Cleanup system | Yes | No | **No** |

---

*Pass 74 completed. All findings evidence-based.*
