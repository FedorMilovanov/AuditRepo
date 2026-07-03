# Current-head reverify — SW/Pagefind deploy-switch fixed

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-03  
**Source main before fix:** `8a816ce40c57e916797aa37f275e3518ca757203`  
**Source fix commit:** `d5c65647d57cf3bc83b6543cb58135cdd279013f`  
**Source lane/main:** `lane/system-sw-pagefind-bootstrap-2026-07-03` and `main`

---

## 1. Scope

After `CI-P0-GILL-RUNTIME-REFS` was fixed, GitHub Pages Deploy reached the next hidden blocker:

```text
Failed step: Service Worker deploy-switch readiness
Failure: Pagefind bootstrap /pagefind/pagefind.js missing from PRECACHE_ASSETS
```

This was the previously tracked `NEW-66` / `CI-HIDDEN-SW-PAGEFIND-PRECACHE` class.

---

## 2. Source changes

Commit `d5c65647`:

- `sw.js`: added `/pagefind/pagefind.js` to `PRECACHE_ASSETS`.
- `sw.js`: bumped `CACHE_VERSION` from `gb-v186-sw-toast-css-20260703` to `gb-v187-pagefind-bootstrap-20260703`.
- Added source lane report: `docs/refactor-2026/lanes/system-sw-pagefind-bootstrap-2026-07-03.md`.

No PremiumControls/Gill geometry or visual CSS changed.

---

## 3. Verification

Environment: Node `v22.14.0`, Playwright Chromium/deps already installed.

```text
node --check sw.js                                                PASS
git diff --check                                                  PASS
npm run strangler:build:production-like                           PASS
npm run pagefind:build:dist                                       PASS
npm run sw:dist:audit:deploy-switch                              PASS
node scripts/dist-smoke-audit.js --no-build --production-like      PASS
npm run gill:mobile-layout:audit                                  PASS
npm run audit:premium-controls                                    PASS (87/87)
npm run validate:static-publication                               PASS
npm run guard:shared-files                                        PASS after lane commit
```

`sw:dist:audit:deploy-switch` proof after fix:

```text
✅ PRECACHE_ASSETS parsed (29)
✅ PRECACHE_ASSETS entries resolve in dist (pagefind required)
✅ Pagefind bootstrap is included in PRECACHE_ASSETS
✅ SW dist readiness audit passed
```

---

## 4. Status

- `CI-HIDDEN-SW-PAGEFIND-PRECACHE` / `NEW-66`: **fixed-current on source main `d5c65647` by local deploy-switch evidence**.
- GitHub Pages Deploy must still be observed on remote Actions for final deploy-green conclusion.

---

## 5. Remaining known non-runtime blockers

Separate from this fix:

- `NEW-65` `/baptisty-rossii/` visual parity failure may still affect Visual Parity Guard.
- `REG-001` security headers require hosting/CDN decision.
- `P1-CI-DUPE` remains an optimization issue.
- `NEW-64` prevention gap remains: broad runtime smoke is still not a universal deploy blocker unless wired separately.
