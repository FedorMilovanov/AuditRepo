# Incoming Audit Pass — Wave 6: SEARCH-LAZY-LOADER-DRIFT

## Meta

- Date: 2026-07-17
- Auditor: Arena Agent (arena.ai)
- Project: gb-is-my-strength
- Anchor (SHA): cb3681e1a85b5f8919c9dc537f812a842bbe9235
- Scope: `SEARCH-LAZY-LOADER-DRIFT`
- Method: direct source read — BaseLayout, all identified chrome/body components

---

## Finding: three distinct search.js loading patterns coexist

### Pattern A — BaseLayout lazy (canonical, dynamic)
**File:** `src/layouts/BaseLayout.astro` (L197-L200)

Inline bootstrap uses `define:vars={{ __gbSearchSrc: searchSrc }}` where `searchSrc = assetUrl('js/search.js')`. Hash resolved at build time from `ASSET_VERSIONS`. Lazy: loads `search.js` only on first Ctrl+K / click / touch. No hardcoded hash in source.

**Used by:** all pages routed through `BaseLayout.astro`.

---

### Pattern B — Hardcoded lazy (5 legacy chrome components)
**Files:**
- `src/components/pastor-series/PastorSeriesPageChrome.astro`
- `src/components/about/AboutPageChrome.astro`
- `src/components/nagornaya/seriya/NagornayaSeriyaBody.astro`
- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
- `src/components/article-pilots/gill-series/GillSeriesChrome.astro`

All five embed a self-contained lazy-loader IIFE with a **hardcoded version hash `v=106d65f6`** and a hardcoded relative path.

**Hash status at cb3681e:** `ASSET_VERSIONS['js/search.js'] = '106d65f6'` in `src/lib/asset-version.js` L31. The hardcoded hash **currently matches** the canonical hash — no stale asset today.

**Risk:** whenever `js/search.js` is updated and `cache-bust.js` is run, `ASSET_VERSIONS` is bumped automatically. The 5 Pattern-B files are **not** updated by `cache-bust.js` (they do not use `assetUrl()`). After the next search.js change the 5 files will serve a stale `?v=` hash — SW cache miss, old search bundle on those routes.

---

### Pattern C — Eager direct load (1 file)
**File:** `src/components/hard-texts/HardTextsPageChrome.astro` L138

```astro
<script is:inline src={assetUrl('js/search.js')} defer></script>
```

Uses `assetUrl()` so hash is always current. But loads `search.js` **eagerly on every page load** — no lazy bootstrap, no Ctrl+K gate. Costs ~31KB on initial load for all `/hard-texts/` visitors regardless of whether they use search.

---

## Classification

| Pattern | Files | Hash stale risk | Load cost | Verdict |
|---|---|---|---|---|
| A — BaseLayout lazy | 1 | None (`assetUrl`) | Lazy | Canonical — no defect |
| B — Hardcoded lazy | 5 | **Yes** (next search.js bump) | Lazy | **Defect: stale hash on next update** |
| C — Eager direct | 1 | None (`assetUrl`) | Eager (always) | **Defect: unnecessary eager load ~31KB** |

**Root cause:** Routes that do not use `BaseLayout` each re-implement the search loader independently. `asset-version.js` / `cache-bust.js` only covers components that call `assetUrl()`. Pattern-B files bypass both.

**Current state:** Pattern B latently broken — not stale at cb3681e today (hash matches), but will break on the next `cache-bust.js` run that bumps `js/search.js`. Pattern C is a confirmed performance defect (eager load).

---

## Minimum closure

- **Pattern B → A migration:** replace hardcoded IIFE + literal `?v=` in all 5 files with `assetUrl()` inside a lazy bootstrap matching `BaseLayout` pattern, or consolidate into a shared `SearchLazyLoader.astro` component.
- **Pattern C fix:** convert `HardTextsPageChrome` to use the same lazy bootstrap.
- **Closure check:** grep `search.js?v=` across `src/` — zero hits expected after fix.
