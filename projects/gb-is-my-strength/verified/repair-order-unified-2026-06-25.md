# Repair Order — gb-is-my-strength — 2026-06-25
**Status:** unified, repair-ready  
**Sources:** Unified Bug Ledger (60 bugs), Cross-reference synthesis, Round 4 verification  
**Order:** Phase 0 → Phase 6 (incremental)

---

## Phase 0 — Immediate (P0 only, no build needed)

### P0-3: robots.txt
```
# Change: remove "Disallow: /*?*" for User-agent:*
# Or add explicit User-agent exclusions for AhrefsBot, SemrushBot, MJ12bot
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: *
Disallow: /*?
```
Risk: LOW — simple text change, no code

### P0-2: floating-cluster.css
```
# File is empty (comment header only)
# Option A: Delete file and update sw.js PRECACHE_ASSETS (remove it)
# Option B: Populate with minimal required styles (gb-icon, gb-ember, gb-save, gb-floater)
# Decision: Option A (file is unused in current architecture)
```
Risk: LOW — file deletion, remove from SW precache

---

## Phase 1 — Shared runtime + GBS2 wiring (P0 + P1, high value)

### P0-1: Gill Rail SAVE button NOP
```
File: js/floating-cluster-controller.js
Add to initActionHandlers():
"save": function(btn) {
  if (window.BookmarkEngine) {
    BookmarkEngine.toggle(btn.dataset.slug || location.pathname);
  } else {
    console.warn('[fc] BookmarkEngine not available');
  }
}
```
Risk: LOW — additive handler only

### PS-04: Heart routes — add fc-controller or remove premium markers
```
# Option A: Load floating-cluster-controller.js on krajne and rimlyanam7 pages
# Option B: Remove .gb-ember from KrajneBody.astro and Rimlyanam7Body.astro
# Decision: Option B is safer — these routes are heart/complex content, 
#           premium controls rollout not complete yet.
```
Risk: MEDIUM — remove visual elements vs load new JS

### P1-14, P1-15, P1-16: GBS2 controls wiring — SeriesArticleLayout
```
# 5 issues to fix for SeriesArticleLayout.astro + BaptistyRossiiBody.astro

# 1. data-gbs2-theme: Wire to existing theme.js OR create gbs2-theme handler
#    Simplest fix: extend theme.js to also listen for [data-gbs2-theme]

# 2. data-gbs2-font="up"/"down": Add font-size control to fc-controller or site.js
#    Store font-size in localStorage, apply to :root { --article-font-size }

# 3. data-gbs2-share: Implement Web Share API with fallback
#    navigator.share() with copy-to-clipboard fallback

# 4. data-gbs2-search: Wire to existing search.js command palette

# 5. data-gbs2-offline: Wire to SW CACHE_ARTICLE message

# 6. gbs2-sheet TOC pane: Create JS that reads H2/H3 from article body
#    and populates [data-gbs2-pane="toc"] nav with links

# 7. gbs2Curbar/gbs2Count/gbs2Pct: Add update mechanism or remove
#    For hub page: these metrics don't apply (no single "current" part)
#    Decision: hide/remove these elements from hub, keep for article pages

Priority order: theme (P1-14) → share → search → offline → font → TOC (P1-15) → progress (P1-16)
```
Risk: MEDIUM — new controller code, but additive

### P1-13: theme.js — extend to handle data-gbs2-theme buttons
```
File: js/modules/theme.js
Add at init():
var gbs2Btns = document.querySelectorAll('[data-gbs2-theme]');
gbs2Btns.forEach(function(btn) {
  btn.addEventListener('click', toggleTheme, { signal: signal });
});
```
Risk: LOW — extends existing function

---

## Phase 2 — Cache busting fix (P0-7, P0-8, P1-11, P1-17, P1-18)

### P0-10 + P0-7 + P0-8 + P1-17 + P1-18: Systemic cache-busting fix

**Step 2a: Update cache-bust.js ASSETS**
```javascript
// scripts/cache-bust.js — ADD missing assets
const ASSETS = [
  '/css/site.css',
  '/css/home.css',
  '/css/command-palette.css',
  '/css/mobile-hotfix.css',
  '/css/nagornaya-mobile-toc.css',
  '/css/site-layered.css',     // ← ADDED (was missing — P0-7)
  '/css/floating-cluster.css',
  '/fonts/fonts.css',
  '/js/site.js',
  '/js/site-modules.js',       // ← ADDED (was missing — P0-8, P1-18)
  '/js/floating-cluster-controller.js',
  '/js/nagornaya-mobile-toc.js',
  '/js/series-cards.js',
  '/js/glossary.js',
  '/js/highlights.js',
  '/js/enhancements.js',
  '/js/search.js',
  '/js/site-utils.js',
  '/js/scroll-perf.js',
  '/js/sw-register.js',
];
```

**Step 2b: Add CSS hash support to BaseLayout.astro**
```javascript
// src/layouts/BaseLayout.astro
function cssLink(rel) {
  const hash = md5short(rel);
  return `<link rel="stylesheet" href="${rel}${hash ? `?v=${hash}` : ''}" />`;
}
// Replace hardcoded links:
<link rel="stylesheet" href="/fonts/fonts.css" />
// With:
<Fragment set:html={cssLink('/fonts/fonts.css')} />
<Fragment set:html={cssLink('/css/site.css')} />
// etc.
```
Risk: MEDIUM — changes asset loading, needs visual regression check

**Step 2c: Update audit-pro.js CACHE_BUST_ASSETS**
```javascript
// scripts/audit-pro.js — sync with cache-bust.js ASSETS array
```
Risk: LOW — maintenance

**Step 2d: Update sw.js PRECACHE_ASSETS** (if needed, currently correct)
Verify sw.js PRECACHE_ASSETS matches cache-bust.js ASSETS after step 2a.

**Step 2e: Astro component hash sync — the hard part**
```javascript
// Option: Create a build-time Astro integration that injects cache-bust hashes
// into all Astro component files at build time.
// Option: Replace all hardcoded ?v=XXXXXXXX with ?v=astroBuildHash()
// Currently: 36+ components need manual hash updates or build-time fix
```

---

## Phase 3 — CI/CD reliability (P0-6)

### P0-6: CI cascade race condition
```yaml
# .github/workflows/indexnow.yml
# Add retry logic for git push:
- name: Push IndexNow URLs
  run: |
    for i in 1 2 3; do
      if git push --force-with-lease origin HEAD:indexnow-trigger && break; then
        echo "Push attempt $i failed, retrying..."
        sleep 5
      fi
    done
```
Risk: LOW — CI configuration change

---

## Phase 4 — Metadata completeness (P1-2, P1-3, P1-4, P1-5, PS-06, PS-07)

### P1-2, P1-3: sitemap.xml + search-manifest.json
```javascript
// Run after astro build:
node scripts/update-meta.js --all
```
Risk: LOW — data generation script

### P1-4: ASTRO_PAGE_HEAD_MAP
```javascript
// scripts/update-meta.js — ADD missing entries:
const ASTRO_PAGE_HEAD_MAP = {
  // ... existing 10 ...
  // ADD:
  'noch-na-kure': 'src/components/baptisty-rossii/BaptistyRossiiNochNaKurePageHead.astro',
  'yuzhnaya-shtunda': 'src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaPageHead.astro',
  // ... all 10 baptisty-rossii ...
  'avraam': 'src/components/karty/avraam/AvraamPageHead.astro',
  // ... all karty pages ...
  // nagornaya pages ...
};
```
Risk: LOW — data map extension

### P1-5: migration conflict
```javascript
// Decision: prefer route-migration-matrix.json (2026-06-23, more complete)
// Update page-ownership.json to match, OR merge into single authoritative file
```
Risk: MEDIUM — migration data coordination

### PS-07: Duplicate Gill IDs
```javascript
// GillRailControls.astro — replace hardcoded id with unique id via prop:
interface Props {
  controlId?: string;  // e.g., "gill-rail-part1"
}
// In template: id={`${controlId}-theme`} instead of id="gbsTheme"
// Update all Gill article pages to pass unique controlId
```
Risk: MEDIUM — ID refactor, needs visual check

---

## Phase 5 — MapEngine fixes (P2-17, P2-18)

### P2-17: AvraamMap singleton pollution
```javascript
// Option A: Pass getPlaceVisual as option to createMap(), not global
// Option B: Check for existing override before setting
// Decision: Option A — cleaner, pass per-map overrides
MapEngine.createMap(container, routeData, {
  getPlaceVisual: function(pl) { ... },
  baseGeoUrl: 'base.svg'
});
```
Risk: MEDIUM — API change to MapEngine

### P2-18: MapEngine GitHub Pages compatibility
```javascript
// map-engine.js loadFromHash():
// Change: use location.pathname + base href
// Add: detect GitHub Pages base from <base> tag or meta
const baseHref = document.querySelector('base')?.href || '/';
history.replaceState(null, '', baseHref + location.pathname.replace(/^\/[^\/]+\//, '/') + (newHash || ''));
```
Risk: MEDIUM — URL handling change

---

## Phase 6 — Low priority cleanup (P3, P2, remaining P1)

| Bug | Action |
|-----|--------|
| P2-1 | Add remaining ~26 routes to visual-parity coverage |
| P2-4 | Automate CACHE_VERSION in deploy.yml |
| P2-5 | Fix notify-on-failure.yml Python parser |
| P2-6 | Fix feed.xml timezone to Moscow |
| P2-7 | Simplify AGENTS.md structure |
| P2-8 | Deduplicate cache-bust.js ASSETS |
| P2-9 | Add visual parity checks for GBS2 pages |
| P2-10 | Add hash-sync check to sw-dist-readiness-audit |
| P2-11 | Remove redundant cache-bust from deploy.yml |
| P2-12 | Make check-data-consistency H1 extraction more robust |
| P2-13 | Clarify MDX canonicalOverride routing docs |
| P2-14 | Remove or wire series-cards.js |
| P2-15 | Clarify about/ page ownership |
| P3-7 | Clean empty decorative elements from BaptistyRossiiBody |
| P3-8 | Wire faq-accordion.js on Antisovetov page or remove HTML |
| P3-9 | Add dedup check for Yandex.Metrika in BaseLayout |

---

## Verification Checklist

After each phase, run:
1. `node scripts/audit-pro.js` — should PASS
2. `node scripts/check-data-consistency.js` — should PASS  
3. `npm run visual:parity:production` — visual regression check
4. `node scripts/check-mdx-html-parity.js` — content parity check

---

## Rollback Plan

| Change | Rollback |
|--------|----------|
| BaseLayout CSS hash | Revert to non-hashed links (safe) |
| cache-bust.js ASSETS | Revert ASSETS array (safe, SW has cache) |
| theme.js gbs2-theme wiring | Remove event listeners (safe) |
| GBS2 controls in Astro markup | Remove buttons (safe) |
| CI retry logic | Revert indexnow.yml (safe) |
| MapEngine changes | Revert to old loadFromHash (safe) |
