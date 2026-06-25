# Repair Order — gb-is-my-strength — 2026-06-25
**Status:** unified, repair-ready  
**Sources:** Unified Bug Ledger (63 bugs), Cross-reference synthesis, Round 4 verification, Verifier-2 runtime pass  
**Order:** Phase 0 → Phase 6 (incremental)  
**Critical note:** P0-2 is FALSE POSITIVE — `floating-cluster.css` = 1869 lines, 68KB CSS, not empty. Remove from Phase 0.

---

## Phase 0 — Immediate (P0 only, no build needed)

### P0-3: robots.txt
```
# Remove "Disallow: /*?*" for User-agent:* or add explicit exclusions:
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: *
Disallow: /*?
```
Risk: LOW — simple text change

---

## Phase 1 — Shared runtime / fc-controller (PS-01 is primary P0)

### PS-01: fc-controller IIFE lexical scope defect (primary P0 — affects 23 pages)

```
# Root cause: fc-controller.js IIFE — init chain aborts before qs is used
# Fix: ensure init sequence doesn't abort; add defensive qs guard

File: js/floating-cluster-controller.js

1. Add defensive qs check at start of initCluster():
if (typeof qs !== 'function') {
  console.warn('[fc] qs not defined, retrying...');
  setTimeout(function() { initCluster(); }, 100);
  return;
}

2. OR restructure init to use qsa early and cache results before any early returns

3. For PS-04 (krajne/rimlyanam7): Add fc-controller script to these pages
   OR remove .gb-ember markup until rollout complete

4. For PS-07 (Gill duplicate IDs): Make GillRailControls IDs unique via prop:
   interface Props { controlId?: string; }
   id={`${controlId || 'gill'}-theme`} instead of id="gbsTheme"
   Update all 5 Gill pages to pass unique controlId per page/instance
```
Risk: MEDIUM — structural JS change, but additive/defensive

### P0-10 + P0-7 + P0-8 + P1-17 + P1-18: Systemic cache-busting fix

**Step 1: Update cache-bust.js ASSETS**
```javascript
const ASSETS = [
  '/css/site.css', '/css/home.css', '/css/command-palette.css',
  '/css/mobile-hotfix.css', '/css/nagornaya-mobile-toc.css',
  '/css/site-layered.css',   // ← ADDED (P0-7)
  '/css/floating-cluster.css',
  '/fonts/fonts.css',
  '/js/site.js', '/js/site-modules.js',  // ← ADDED (P0-8, P1-18)
  '/js/floating-cluster-controller.js',
  '/js/nagornaya-mobile-toc.js', '/js/series-cards.js',
  '/js/glossary.js', '/js/highlights.js', '/js/enhancements.js',
  '/js/search.js', '/js/site-utils.js', '/js/scroll-perf.js',
  '/js/sw-register.js',
];
```

**Step 2: Add CSS hash support to BaseLayout.astro**
```javascript
function cssLink(rel) {
  const hash = md5short(rel);
  return `<link rel="stylesheet" href="${rel}${hash ? `?v=${hash}` : ''}" />`;
}
// Replace hardcoded CSS links with Fragment set:html={cssLink('/css/...')}
```

**Step 3: Update audit-pro.js CACHE_BUST_ASSETS to match cache-bust.js**

**Step 4: Astro component hash sync** (the hard part — 36+ components):
```javascript
// Option: Build-time Astro integration that injects cache-bust hashes
// Option: Replace hardcoded ?v=XXXXXXXX with runtime hash computation
```
Risk: MEDIUM — changes asset loading, needs visual regression

---

## Phase 2 — GBS2 wiring (P1-13, P1-14, P1-15, P1-16, V2-2)

### P1-13: theme.js extend to handle data-gbs2-theme
```javascript
// Add to js/modules/theme.js init():
var gbs2Btns = document.querySelectorAll('[data-gbs2-theme]');
gbs2Btns.forEach(function(btn) {
  btn.addEventListener('click', toggleTheme, { signal: signal });
});
```

### V2-2: Nagornaya font controls — fix selector mismatch
```
# Current markup: #nagFontDec / .nag-fontsize-btn
# Current JS: [data-fontsize] / .nag-fontsize-down / .nag-fontsize-up
# Fix: align markup to JS selectors OR JS to markup
# Decision: align JS to markup (fewer files to change)
```

### P1-14, P1-15, P1-16: GBS2 controls SeriesArticleLayout
Priority: theme (P1-14) → share → search → offline → font → TOC (P1-15) → progress (P1-16)

---

## Phase 3 — CI/CD reliability (P0-6)

### P0-6: CI cascade race condition
```yaml
# indexnow.yml: add retry for git push:
for i in 1 2 3; do
  if git push --force-with-lease origin HEAD:indexnow-trigger && break; then
    sleep 5
  fi
done
```

---

## Phase 4 — Metadata completeness (P1-2, P1-3, P1-4, P1-5, PS-06, V2-1)

### V2-1: Gill TOC anchor fixes
```
# Part1: Fix #sec-early-years anchor (→ #part-calling wrong)
# Part1: Add missing #sec-gill-spirituality id to body
# Part3: Fix 5 broken anchors in article body
```

### PS-06: Hermeneutics readTime drift
```
# Check data-pagefind-meta readTime vs visible byline
# Verify readingTime in article frontmatter
```

---

## Phase 5 — MapEngine fixes (P2-17, P2-18, V2-3)

### V2-3: Avraam skip-link fix
```
# Current: href="#svg-map"
# Fix: href="#stage" (the container id in AvraamMap.astro)
```

---

## Phase 6 — Low priority (P3, P2, remaining)

| Bug | Action |
|-----|--------|
| V2-4 | Fix feed.xml RFC-822 weekday names (Sat→Sat, Thu→Thu) |
| P2-1 | Add remaining ~26 routes to visual-parity coverage |
| P2-4 | Automate CACHE_VERSION in deploy.yml |
| P2-5 | Fix notify-on-failure.yml Python parser |
| P2-6 | Fix feed.xml timezone to Moscow (separate from V2-4) |
| P2-7 | Simplify AGENTS.md structure |
| P2-8 | Deduplicate cache-bust.js ASSETS |
| P2-9 | Add visual parity checks for GBS2 pages |
| P2-10 | Add hash-sync check to sw-dist-readiness-audit |
| P2-11 | Remove redundant cache-bust from deploy.yml |
| P2-12 | Make check-data-consistency H1 extraction robust |
| P2-13 | Clarify MDX canonicalOverride routing docs |
| P2-14 | Remove or wire series-cards.js |
| P2-15 | Clarify about/ page ownership |
| P3-7 | Clean empty decorative elements from BaptistyRossiiBody |
| P3-8 | Wire faq-accordion.js on Antisovetov or remove HTML |
| P3-9 | Add dedup check for Yandex.Metrika in BaseLayout |
| P3-10 | Nagornaya TOC scroll target fixes |
| P3-11 | site-modules.js cache-bust integration |
| P3-12 | AvraamMap baseGeoUrl cache-busting |

---

## Verification Checklist

After each phase:
1. `node scripts/audit-pro.js` — should PASS
2. `node scripts/check-data-consistency.js` — should PASS  
3. `npm run visual:parity:production` — visual regression
4. `node scripts/check-mdx-html-parity.js` — content parity

---

## Rollback Plan

| Change | Rollback |
|--------|----------|
| fc-controller defensive qs guard | Remove timeout retry (safe) |
| BaseLayout CSS hash | Revert to non-hashed links (safe) |
| cache-bust.js ASSETS | Revert ASSETS array (safe, SW has cache) |
| theme.js gbs2-theme wiring | Remove event listeners (safe) |
| GillRailControls ID refactor | Revert to hardcoded IDs (safe) |
| CI retry logic | Revert indexnow.yml (safe) |
| V2-1 anchor fixes | Revert TOC/body IDs (safe) |
| V2-2 selector fix | Revert to markup selectors (safe) |
