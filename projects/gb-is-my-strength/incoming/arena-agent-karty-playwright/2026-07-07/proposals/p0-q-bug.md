# Proposal: P0 — q-bug fix (lane/karty-q-bugfix)

**Source:** `incoming/arena-agent-karty-playwright/2026-07-07/REPORT.md` §1
**Current source HEAD:** `75f807b73` (production)
**LANE branch:** `lane/karty-q-bugfix` (commit `f7e9696`, pushed to GitHub)
**Status:** `proposal-open` (awaiting owner PR review and merge)

## Bug summary

`karty/_engine/map-engine.js:867` — `if (q)` is OUTSIDE the setTimeout callback (line 826-862), but `q` is declared INSIDE (line 828). Causes `ReferenceError: q is not defined` on every keystroke in the map-engine default search input.

**Affected:** `karty/ishod/` (uses map-engine's `me-search`); will affect all future routes loading `_engine/map-engine.js`.

**Reproduction (production, no fix):**
```bash
$ node audit_visual/verify_ishod_prod.js
me-search count: 1
After "Раамсес" - errors: 1
  pageerror: q is not defined
```

## Fix

Move the match-count toast block INSIDE the setTimeout callback, where `q` is in scope.

```diff
_on(searchInput,'input',()=>{
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const q = searchInput.value.toLowerCase().trim();
    // ... uses q ...
+    // Show match count (was: at handler entry; crashed: q not in scope here)
+    if (q) {
+      const mc = markersG.querySelectorAll('g[transform]').length;
+      let visibleCount = 0;
+      markersG.querySelectorAll('g[transform]').forEach(g => {
+        if (g.style.opacity !== '0.08' && g.style.opacity !== '.08') visibleCount++;
+      });
+      if (visibleCount > 0 && visibleCount < mc) {
+        showToast('Найдено: ' + visibleCount, 1500);
+      }
+    }
  }, 200);
-  // Show match count
-  if (q) {
-    ...
-  }
});
```

**Diff:** +11/-11 lines (pure move + comment).

## Verification

| Environment | Search test | Errors |
|-------------|--------------|--------|
| Production (gospod-bog.ru) | type "Раамсес" | 1 (q is not defined) |
| Local with fix (lane/karty-q-bugfix) | type "Раамсес", "Синай", "Мерра" | 0 |

**Reproduction commands:**
```bash
# Confirm bug on production
node audit_visual/verify_ishod_prod.js

# Confirm fix locally (after merge to local main, OR with LANE branch checked out)
git checkout lane/karty-q-bugfix
node -m http.server 8765 &
node audit_visual/verify_ishod.js
```

## Scope of fix

- **1 file:** `karty/_engine/map-engine.js`
- **+11/-11 lines** (pure move)
- **No behavior change** for non-search code paths
- **No new tests** (existing test infrastructure covers this when added to CI; see `playwright-as-ci.md`)

## Why this is FAST-safe (not LANE-required)

Strictly speaking, this is a **shared file** (`map-engine.js` used by ishod + avraam + future routes). But:

- The fix is **non-controversial** (clear bug, minimal change)
- The **LANE branch** follows policy (per `LANE_LOCK_POLICY.md` §1, route/refactor = LANE)
- Rollback point: `0bd344a` (previous production fix)
- After merge, fast-forward to `f7e9696`, deploy

## Recommendation

1. **Owner reviews PR** at https://github.com/FedorMilovanov/gb-is-my-strength/pull/new/lane/karty-q-bugfix
2. **CI passes** (no behavior change for working code)
3. **Merge to main**
4. **Deploy** (next auto-deploy picks it up)
5. **Verify on production** (run `audit_visual/verify_ishod_prod.js` after deploy, expect 0 errors)

## Do not mix with

- KARTY-04 (CSS-in-JS) — separate file, separate fix
- KARTY-05 (hardcoded ID mapping) — separate refactor
- 60+ visual bugs — separate Phase 1 work
