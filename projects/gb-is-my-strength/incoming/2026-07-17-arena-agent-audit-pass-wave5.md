# Incoming Audit Pass — Wave 5

## Meta

- Date: 2026-07-17
- Auditor: Arena Agent (arena.ai)
- Project: gb-is-my-strength
- Anchor (SHA): cb3681e1a85b5f8919c9dc537f812a842bbe9235
- Scope: `GENEALOGY-NO-ERROR-BOUNDARY`, `AR-IDX-JS-02-MULTIWRITER`, `SW-PWA-FRESHNESS`, `SECURITY-CSP-GAPS`
- Method: direct source read at anchor

---

## 1. GENEALOGY-NO-ERROR-BOUNDARY — CONFIRMED FAIL

**Files checked:**
- `src/components/genealogy/GenealogyTree.tsx` — no `ErrorBoundary` import, no usage
- `src/pages/rodosloviye/index.astro` — no `ErrorBoundary` wrapping the `<GenealogyTree client:only="react">` island

**Evidence:**
```ts
// GenealogyTree.tsx imports (L1-L14):
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, ... } from '@xyflow/react';
// No: import { ErrorBoundary } from 'react-error-boundary' or similar
```

The `GenealogyTree` component uses `buildLayout(persons, ...)` which calls dagre and custom layout logic. A throw anywhere in the tree (layout error, bad data in genealogy.json, ReactFlow internal error) propagates to the React root uncaught, blanking the entire `/rodosloviye/` island with no fallback UI.

**Classification:** current defect, source-confirmed.
**Minimum closure:** Wrap `GenealogyTree` default export (or the island mount in `rodosloviye/index.astro`) in a React ErrorBoundary with a visible fallback ("Дерево временно недоступно").

---

## 2. AR-IDX-JS-02-MULTIWRITER — CONFIRMED FAIL (both files)

**File 1: `js/enhancements.js`** (minified, confirmed at cb3681e):
```js
localStorage.setItem(
  window.SiteUtils && SiteUtils.themeKey ? SiteUtils.themeKey : "theme",
  dark ? "dark" : "light"
)
```
Falls back to raw `"theme"` key when `SiteUtils.themeKey` is unavailable (e.g., race condition on load, or any page where `site-utils.js` hasn't run yet).

**File 2: `js/site.js` L223** (confirmed at cb3681e):
```js
try { localStorage.setItem('theme', theme) } catch(_) { }
```
Unconditional write to the legacy `'theme'` key with no fallback guard.

**Canonical owner:** `js/reader-preferences.js` — uses `STORAGE_KEY = 'gb:reader-preferences:v1'` (L18). Reads/writes a structured preferences object. Theme preference lives at `gb:reader-preferences:v1`.

**Impact:** Three concurrent writers to two different keys. `site.js` writes `'theme'` unconditionally on every theme change, racing the canonical writer. Whichever script runs last wins. On pages that load only `site.js` (legacy pages), `'theme'` gets written; on reload the canonical reader picks up `'gb:reader-preferences:v1'` and may disagree.

**Classification:** narrowed residual confirmed current at cb3681e.
**Minimum closure:** Remove `localStorage.setItem('theme', ...)` from `site.js` L223; replace `enhancements.js` fallback with `SiteUtils.themeKey` mandatory (no `"theme"` default). Delegate all theme persistence to `reader-preferences.js`.

---

## 3. SW-PWA-FRESHNESS — NARROWED (partially mitigated, residual remains)

**File:** `sw.js` at cb3681e

**What was claimed:** `cacheFirst` without `?v=` prevents updates to `reader-preferences.js` without manual SW version bump.

**What the code actually does:**

`reader-preferences.js` is in the precache list at L44 (no `?v=`). The fetch handler at L334-L339:
```js
} else if (isStaticAsset(url)) {
  event.respondWith(isRevisioned(url)
    ? revisionedStaticNetworkFirst(request)    // ?v= present → network-first
    : isNetworkFirstRuntime(url)
      ? networkFirstWithCache(request, CACHE_STATIC)  // map-engine.js → network-first
      : cacheFirst(request, CACHE_STATIC));            // everything else → cache-first
```

`isRevisioned(url)` returns `true` only when `url.searchParams.has('v')` (L94-L96).
`/js/reader-preferences.js` has no `?v=` parameter in the precache list or any page that references it via `ReaderPreferencesHead.astro` (which uses `assetUrl()`).

**What `assetUrl()` does:** `src/lib/asset-version.js` appends `?v=<hash>` at build time. So at *runtime*, requests for `reader-preferences.js` will include `?v=...` and hit `revisionedStaticNetworkFirst` (network-first), not `cacheFirst`.

**Revised classification:** The `SW-PWA-FRESHNESS` claim as originally stated (`cacheFirst` without `?v=` blocking updates) is **partially mitigated**: pages using `assetUrl()` (all Astro components via `ReaderPreferencesHead`) get versioned URLs and network-first. The residual is: **the precache entry at L44 has no `?v=`**, meaning the SW installs a bare unversioned copy. If a cached bare URL is ever hit (e.g., direct navigation, old SW, or any page that emits the script tag without `assetUrl()`), it gets `cacheFirst` stale content. This is a narrow residual, not the broad claim.

**Classification:** narrowed — original broad claim partially mitigated by `assetUrl()`. Residual: bare precache entry at L44 is version-unaware. Recommend: either remove bare entry from precache (let versioned requests handle caching), or add `?v=` to precache entry at build time.

---

## 4. SECURITY-CSP-GAPS — CONFIRMED, scope narrowed

**File checked:** `src/layouts/BaseLayout.astro` — **no CSP meta tag** present (0 CSP lines in 205-line file).

**Confirmed CSP-less source surfaces at cb3681e:**
- All routes rendered via `BaseLayout.astro` (which emits no CSP)
- This includes: `/hard-texts/genesis-6/` and `/izbrannoe/` (confirmed by MASTER)
- `/app/` and `/rodosloviye/` — also BaseLayout-based variants; MASTER notes these are CSP-present in live/artifact, meaning CSP is injected at hosting layer (Cloudflare/CDN header), not in source

**Root:** CSP is per-page inline `<meta>` in hand-written heads, not a shared layout concern. BaseLayout has no CSP. Routes not using a custom page-head get no source-level CSP.

**Classification:** confirmed current defect — `SECURITY-CSP-GAPS` is accurate; `FRAGMENTED-SECURITY-OWNERSHIP` system lane correctly names the root.
