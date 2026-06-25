# DEEP ANALYSIS — Genealogy React, Map Engine, Production Live
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, production HTTP requests

---

## 1. GENEALOGY REACT COMPONENTS

### GenealogyTree.tsx Analysis
- 312 lines, 33 React hooks, 21 event handlers
- 9 useMemo calls, 7 useCallback calls
- 1 cleanup function, 1 removeEventListener

### Memory Leak Issue
**Status:** ⚠️ POTENTIAL MEMORY LEAK
**Evidence:**
- ReactFlow instance ref (`rfInstance`) exists but NO cleanup on unmount
- No `dispose()` or `destroy()` call for ReactFlow
- No `onUnmount` handler
- If user navigates away from genealogy page, ReactFlow may leak

**Impact:** Low — static site, page refresh clears memory. But for extended use, memory could grow.

**Recommendation:** Add cleanup function:
```typescript
useEffect(() => {
  return () => {
    if (rfInstance.current) {
      rfInstance.current.destroy();
    }
  };
}, []);
```

### Performance
- 9 useMemo calls — good memoization
- 7 useCallback calls — good callback memoization
- 0 React.memo usage — could add for PersonNode optimization

---

## 2. MAP ENGINE ANALYSIS

### map-engine.js
- 2635 lines, 164KB
- 71 named functions
- 43 addEventListener, 1 removeEventListener
- ⚠️ Potential memory leak (43 adds vs 1 remove)

### avraam-app.js
- 2408 lines, 190KB
- 70 addEventListener, 0 removeEventListener
- 2 localStorage calls
- 8 window.* assignments (global pollution)

### Mitigation
- map-engine.js has `_cleanupAll()` function that bulk-removes all listeners
- avraam-app.js does NOT have cleanup — potential memory leak on extended use

---

## 3. PRODUCTION LIVE CHECK

### All pages working:
| Page | Status | Size |
|---|---|---|
| / | 200 | 62KB |
| /articles/dzhon-gill-chast-1-chelovek/ | 200 | 146KB |
| /nagornaya/chast-1/ | 200 | 133KB |
| /karty/avraam/ | 200 | 7KB |
| /baptisty-rossii/noch-na-kure/ | 200 | 34KB |
| /konfessii/russkij-baptizm/ | 200 | 13KB |

### Production sw.js: ✅ OK

---

## 4. RODOSLOVIYE PAGE

### Status: React island, NO lazy loading
- Uses React island for genealogy tree
- Does NOT use lazy loading — entire React bundle loads on page visit
- Could be optimized with `client:lazy` or `client:visible`

---

## 5. CORRECTED BUG COUNT

### New bugs from this session:
| ID | Sev | Title |
|---|---|---|
| GEN-01 | P3 | Genealogy ReactFlow no cleanup on unmount |
| GEN-02 | P3 | Rodosloviye React island no lazy loading |
| MAP-01 | P3 | avraam-app.js no cleanup (70 listeners) |

### Updated total:
- **Total bugs found:** 31 (28 previous + 3 new)
- **False positives:** 7
- **Net confirmed:** 24
