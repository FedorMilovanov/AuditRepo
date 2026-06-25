# Round 2: CI cascade, audit drift, tooling issues — 2026-06-25

## Agent: arena-agent-round3

## P0 bugs found

### P0-6: CI cascade race condition — `git push` without retry

**File:** `.github/workflows/indexnow.yml`

**Bug:** `indexnow.yml` runs `cache-bust.js` + `update-meta.js`, commits and pushes via `git push`. If another workflow pushes to main concurrently, `git push` is rejected (non-fast-forward).

**Evidence from git history:**
- `5425b292 fix(ci): resolve IndexNow→Deploy cascade failure` ← first fix
- `20ff3f57 fix(system): full CI recovery` ← broke again
- `b3f6d65e fix(ci): update visual markers` ← third fix

Multiple "CI cascade fix" commits = regression pattern. Each fix breaks the next.

**Impact:** Deploy pipeline unreliable; cache-bust/update-meta may not be pushed.

**Fix:** Use GitHub API for commit creation OR add graceful fallback:
```bash
git push || echo "⚠️ Push rejected (concurrent workflow)"
# Don't exit failure — allow build to continue
```

---

### P0-7: `css/site-layered.css` in SW precache, NOT in cache-bust.js

**Files:** `scripts/cache-bust.js` vs `sw.js` PRECACHE_ASSETS

| Location | Contains site-layered.css? |
|----------|---------------------------|
| `sw.js` PRECACHE_ASSETS | ✅ YES |
| `scripts/cache-bust.js` ASSETS | ❌ NO |

**Impact:** CSS change → HTML not updated → stale CSS from SW cache.

**Fix:** Add `'css/site-layered.css'` to cache-bust.js ASSETS.

---

### P0-8: `js/site-modules.js` in SW precache, NOT in cache-bust.js

**Files:** `scripts/cache-bust.js` vs `sw.js` PRECACHE_ASSETS

| Location | Contains site-modules.js? |
|----------|--------------------------|
| `sw.js` PRECACHE_ASSETS | ✅ YES |
| `scripts/cache-bust.js` ASSETS | ❌ NO |

**Fix:** Add `'js/site-modules.js'` to cache-bust.js ASSETS.

---

## P1 bugs found

### P1-9: `audit-pro.js` CACHE_BUST_ASSETS hardcoded lie

`audit-pro.js` claims: "Same list as scripts/cache-bust.js. If cache-bust.js changes, update this list too."

This is a **dead instruction** — lists have diverged:
- `css/site-layered.css` in audit-pro, not in cache-bust
- `js/site-modules.js` in audit-pro, not in cache-bust

**Fix:** Dynamic parsing from cache-bust.js source instead of hardcoded copy.

---

### P1-10: `build-indexnow-urls.js` — git diff fails on merge commits

When `github.event.before` is not in main history (merge scenario), `git diff --name-only` returns unexpected result → `build-indexnow-urls.js` gets empty stdin → IndexNow receives `["https://gospod-bog.ru/"]` only.

**Fix:** Add graceful fallback to `addAllPublic()` when no files detected.

---

### P1-11: `dist-publication-audit.js` does NOT check asset hash consistency

Audit checks DOM markers and file presence, but **never validates** that `?v=HASH` in HTML matches current cache-bust hashes.

This is why P0-10 (Astro stale hashes) wasn't detected by existing audits.

**Fix:** Add hash validation step:
```js
// After parsing PRECACHE_ASSETS, compare with current cache-bust hashes
// Fail if any HTML uses stale hash
```

---

## P2 bugs found

| ID | Bug |
|----|-----|
| P2-9 | Visual parity coverage gap — screenshots check 12 routes, contract checks 19 |
| P2-10 | sw-dist-readiness-audit missing cache-bust sync cross-reference |
| P2-11 | deploy.yml redundant cache-bust (indexnow already does it) |
| P2-12 | H1 extraction regex fragile on attr-with-`>` edge-case |

---

## P3 bugs found

| ID | Bug |
|----|-----|
| P3-4 | Hardcoded word count floors in audit-pro.js drift from meta pipeline |
| P3-5 | interactive-audit hardcoded URL lists drift |
