# Gill Desktop Rail — Forensic Verification Report (2026-07-04)

**Source HEAD:** `12f4a50a`  
**AuditRepo HEAD:** `c7f23ea` (Pass 56)  
**Mode:** Pure auditor/verifier — GPT 5.5 audit cross-check, no source changes  

---

## Executive Summary

GPT 5.5 produced a detailed audit of the Gill desktop rail. **6/6 claims confirmed true** in current source. 
The desktop rail has regressed from the owner's approved reference: cramped 240px width, broken TOC hierarchy, 
invalid HTML, and **zero desktop geometry gates**.

---

## 1. Confirmed Bugs

### UI-GILL-DESKTOP-RAIL-01 — Desktop rail width 240px (need 304px+)

**Claim 2.1:** "Full-page was interpreted only vertically — narrow 240px"

**Evidence:**
```
css/floating-cluster.css:2204  ← comment says "legacy .gbs2-world grid was built for .gbs2-rail (304px col)"
css/floating-cluster.css:2216  ← grid-template-columns:240px minmax(0,1fr);
css/floating-cluster.css:2224  ← width:240px;
```

**Status:** ✅ CONFIRMED. The v16 migration comment itself records 304px as the reference, but 240px was used.  
**Root cause:** Bad constant; owner rejected visually.  
**Fix:** Change to `--gill-rail-width: 304px` at ≥1280px, 272-288px at 1024-1279px.

---

### UI-GILL-DESKTOP-TOC-02a — All chapters get `gbs2-sub` (scrollspy breaks)

**Claim 2.3:** "Every chapter is marked gbs2-sub — scrollspy selector can be empty"

**Evidence:**
```
GillSeriesRail.astro:54  ← <li class={item.subtitle ? 'gbs2-sub' : ''}>
fc-controller.js:1411    ← qsa('.gbs2-toc > li:not(.gbs2-sub) > a')
```

Every `GillPartTocItem` has a non-empty `subtitle` (e.g. "Глава 1", "● Глава 1").  
Therefore 100% of items get `.gbs2-sub`. The scrollspy's `topLevelAs` expects non-sub items.

**Status:** ✅ CONFIRMED.  
**Fix:** Add `level: 2 | 3` field to `GillPartTocItem`. Use `level === 3` for `.gbs2-sub`.

---

### UI-GILL-DESKTOP-TOC-02b — First/current TOC item may lack href

**Claim 2.4:** "current: true items don't always have href"

**Evidence:**
```
gillSeriesData.ts:26  ← href?: string  (OPTIONAL)
```

The `current: true` item for the context page has:
```
{ roman: "I", title: "От пуритан к диссентерам", subtitle: "● Глава 1", current: true }
— NO href field
```

**Status:** ✅ CONFIRMED.  
**Fix:** Every `partToc` item must have an exact `href`, even the current one.

---

### UI-GILL-DESKTOP-TOC-02c — Count overwritten: "N / TOTAL" → single number

**Claim 2.6:** "countEl.textContent = headings.length destroys format"

**Evidence:**
```
GillSeriesRail.astro:47  ← <span class="gbs2-count" id="gbs2Count">1 / {page.partToc.length}</span>
fc-controller.js:1276    ← countEl.textContent = headings.length;
```

**Status:** ✅ CONFIRMED. Astro renders `1 / 10` format, then JS overwrites it with `10`.  
**Fix:** Update count as `current / total` with scrollspy changes.

---

### UI-GILL-DESKTOP-TOC-02d — `<span>` directly inside `<ul>`

**Claim 2.5:** "Direct span child of ul is invalid list markup"

**Evidence:**
```
GillSeriesRail.astro:51-52  ← <ul class="gbs2-toc"><span aria-hidden="true" class="gbs2-track">...
```

**Status:** ✅ CONFIRMED.  
**Fix:** Wrap track in `<div class="gbs2-tocframe">` around the `<ul>`.

---

### UI-GILL-DESKTOP-FRAME-03 — No desktop rail geometry gate

**Claim 2.8 (derived):** No desktop audit exists.

**Evidence:**
```
$ test -f scripts/gill-desktop-rail-audit.js
→ NO (does not exist)

$ npm run | grep desktop  
→ (no results)

$ npm run | grep rail
→ (no results)
```

Only mobile gates exist: `gill:mobile-layout:audit`, `gill:mobile-play:smoke`.

**Status:** ✅ CONFIRMED.  
**Fix:** Create `scripts/gill-desktop-rail-audit.js`, add to `package.json`, add to deploy workflow.

---

## 2. Gate Coverage Map

| UI Area | Current Gate | Covers Desktop? | Covers Mobile? |
|---------|-------------|----------------|----------------|
| Mobile bottom bar | `gill:mobile-layout:audit` | ❌ | ✅ |
| Mobile TOC overlays | `gill:mobile-play:smoke` | ❌ | ✅ |
| RomanNumeral | `audit:premium-controls` | ✅ (static) | ✅ |
| Controller wiring | `audit:premium-controls` | ✅ | ✅ |
| Desktop rail width | ❌ NONE | ❌ | ❌ |
| Desktop scrollspy | ❌ NONE | ❌ | ❌ |
| Desktop overflow | ❌ NONE | ❌ | ❌ |
| CSS scope | `audit:premium-controls` | partially | partially |

---

## 3. Source Files That Must Change

| File | Change required |
|------|----------------|
| `css/floating-cluster.css` | Increase rail width, consolidate desktop rules, fix frame |
| `GillSeriesRail.astro` | Fix span in ul, fix gbs2-sub logic, fix count format, add level |
| `gillSeriesData.ts` | Add `level: 2 \| 3` to `GillPartTocItem`, ensure all items have href |
| `fc-controller.js` | Fix scrollspy for level-2/level-3, fix count format, fix dot track |
| `scripts/gill-desktop-rail-audit.js` | **NEW** — 4 viewports × 5 routes × geometry/overflow/scrollspy assertions |
| `package.json` | Add `gill:desktop-rail:audit` script |
| `.github/workflows/deploy.yml` | Run desktop rail audit in deploy |

---

## 4. Files That Must NOT Change

These are protected by AGENTS.md §3.10 and MUST remain intact:
- Mobile V3 bottom bar (`#mobPartTocBtn`, `data-gill-mobile-bar`, etc.)
- PlayEmber / speed morph / TTS
- RomanNumeral / `gb-roman`
- `data-gill-v16` marker
- `SeriesMark` component
- Other PremiumControls protected contracts

---

## 5. Verification Protocol

After fix:

```bash
# Fast loop
git diff --check
node --check js/floating-cluster-controller.js
npm run gill:series:data:consistency:audit
npm run audit:premium-controls:build
npm run guard:shared-files

# Production-like build
npm run strangler:build:production-like

# New desktop rail audit (5 routes × 4 viewports)
npm run gill:desktop-rail:audit

# Existing mobile gates (must still pass)
npm run gill:mobile-play:smoke
npm run gill:mobile-layout:audit
node scripts/gill-context-visual-parity-audit.js --require-dist
node scripts/gill-spravochnik-visual-parity-audit.js --require-dist
node scripts/dist-smoke-audit.js --no-build --production-like

# Final release barrier
npm run cache-bust
git diff --check
npm run validate:static-publication
npm run guard:shared-files
npm run workflows:check
```

---

## 6. Acceptance Criteria (all must be TRUE)

- [ ] 1280/1440/1920: Gill rail is full-height framed navigation (not floating widget)
- [ ] Rail width ≥304px at ≥1280px, ≥272px at 1024-1279px
- [ ] No title truncation
- [ ] Frame: rounded corners, border, shadow
- [ ] No horizontal scrollbar anywhere
- [ ] Footer fixed at bottom of frame
- [ ] Only `gbs2-tocscroll` owns vertical scrolling
- [ ] Timeline track line centered through dot centers
- [ ] Active/passed chapter states update on scroll
- [ ] `N / TOTAL` count updates correctly
- [ ] Every TOC href resolves to existing element
- [ ] Mobile V3 bottom bar unchanged
- [ ] All PremiumControls still pass
- [ ] All 5 Gill routes pass desktop audit
- [ ] No console/page errors
- [ ] No new late "hotfix" CSS layer appended
- [ ] Owner visually accepts
