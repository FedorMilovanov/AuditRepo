# Unified Bug Ledger — gb-is-my-strength — 2026-06-25

**Status:** `repair-ready`  
**Sources:** Arena Agent (premium surface) + Arena Agent Round 3 (system tooling)  
**Verified by:** Cross-reference synthesis, 2026-06-25

---

## P0 — CRITICAL (9 bugs) — Fix immediately

| ID | Severity | Category | Title | Route(s) | Root cause | Verified by |
|----|----------|----------|-------|----------|-----------|-------------|
| **P0-10** | **P0** | **Cache sync** | **ALL Astro components use stale hardcoded asset hashes** | **All Astro-owned pages** | `cache-bust.js` only updates root HTML; Astro component hardcoded hashes never updated | Round 3 code audit |
| **PS-01** | **P0** | **Shared runtime** | **`qs is not defined` — controller crash** | **13 premium routes** | `floating-cluster-controller.js` loads before `qs` defined | Arena Agent browser verification |
| **P0-7** | **P0** | **Cache sync** | **`css/site-layered.css` in SW precache, not in cache-bust** | All pages with SW | ASSETS list incomplete in cache-bust.js | Round 3 code audit |
| **P0-8** | **P0** | **Cache sync** | **`js/site-modules.js` in SW precache, not in cache-bust** | All pages with SW | ASSETS list incomplete in cache-bust.js | Round 3 code audit |
| **P0-6** | **P0** | **CI/CD** | **CI cascade race condition** | Deploy pipeline | `indexnow.yml` git push without retry; concurrent workflow pushes rejected | Round 3 git history analysis |
| **P0-1** | **P0** | **Shared runtime** | **Gill Rail SAVE button — NOP** | Gill context article | `data-action="save"` not handled by fc-controller | Round 3 code audit |
| **P0-2** | **P0** | **Source layer** | **`floating-cluster.css` — EMPTY file** | Premium routes (no styles) | File contains only comment header; all CSS in `site.css` + inline | Round 1 confirmed |
| **P0-3** | **P0** | **SEO** | **`robots.txt` blocks AhrefsBot, SemrushBot, MJ12bot** | SEO/marketing | `Disallow: /*?*` for `*` + explicit `Disallow: /` for SEO bots | Round 1 confirmed |
| **PS-04** | **P0** | **Ownership conflict** | **Heart routes: premium markers suppress TTS, no controller loaded** | `krajne-li-isporcheno-serdce/`, `rimlyanam-7/` | `.gb-ember` suppresses legacy TTS, but no premium controller loaded | Arena Agent verification |

### P0-10 Detail (THE BIGGEST FINDING)

**36+ Astro components** contain hardcoded `?v=HASH` that NEVER update when CSS/JS changes.

| Asset | Hardcoded in Astro | Should be (cache-bust) | Components |
|-------|-------------------|------------------------|------------|
| `css/site.css` | `202876c3` | `b880b524` | **36** |
| `css/command-palette.css` | `48f8ed38` | `afe33045` | **36** |
| `css/mobile-hotfix.css` | `decfea58` | `c1f7664e` | **36** |
| `js/site.js` | `fed3ec3b` | `133dfac1` | **36** |
| `js/floating-cluster-controller.js` | `c78a4236` | `35a91710` | **10** |
| `js/nagornaya-mobile-toc.js` | `f25219b0` | `ffd00d98` | **9** |

**Affected pages:** articles catalog, all series (Gill, baptisty-rossii, nagornaya, karty, about, biografii, hard-texts, pastor-series, rodosloviye)

---

## P1 — HIGH (13 bugs)

| ID | Severity | Category | Title | Notes |
|----|----------|----------|-------|-------|
| PS-03 | P1 | Shared runtime | Dead premium save controls | Confirmed by Arena Agent |
| PS-02 | P1 | Shared runtime | Dead premium theme controls | Confirmed by Arena Agent |
| PS-05 | P1 | Route content | Hermeneutics stray `76e7365` in body | Confirmed in production-like dist |
| PS-06 | P1 | Metadata | Hermeneutics hidden readTime=35 vs visible=50 | Confirmed in production-like dist |
| PS-07 | P1 | HTML validity | Duplicate IDs `gbsTheme`/`gbsSearch` on 4 Gill pages | Traced to `GillRailControls.astro` |
| P1-1 | P1 | Shared runtime | Old controls don't check `.has-premium-controls` | `site.js` init without guard |
| P1-2 | P1 | Metadata | `sitemap.xml` incomplete (~43 of 52+ URLs) | Missing karty, baptisty subroutes |
| P1-3 | P1 | Metadata | `search-manifest.json` incomplete (~44 of 52+ items) | Same gaps as sitemap |
| P1-4 | P1 | Metadata | `ASTRO_PAGE_HEAD_MAP` incomplete | Missing baptisty, karty, nagornaya |
| P1-5 | P1 | Migration | `page-ownership.json` vs `route-migration-matrix.json` conflict | Different dates, divergent routes |
| P1-6 | P1 | Tooling | `copy-legacy-to-dist.js` race condition | No timestamp compare |
| P1-7 | P1 | Shared runtime | `search.js` hardcoded fallback readTime unvalidated | (89, 41, 30, 50) |
| P1-8 | P1 | Shared runtime | Gill rail `[data-fc-root]` double initialization | Main loop + initGillRail() |
| P1-9 | P1 | Tooling | `audit-pro.js` CACHE_BUST_ASSETS hardcoded lie | Diverged from real cache-bust.js |
| P1-10 | P1 | SEO/tooling | `build-indexnow-urls.js` git diff fails on merge → empty IndexNow | |
| **P1-11** | **P1** | **Tooling** | **`dist-publication-audit.js` does NOT detect stale hash mismatch** | **Quality gate blind to P0-10** |
| P1-12 | P1 | Cache sync | KartyPageHead hardcoded stale CSS hash | Same as P0-10 pattern |
| P1-13 | P1 | Shared runtime | `theme.js` doesn't wire GBS `data-gbs2-theme` buttons | Premium pages non-responsive |

---

## P2 — MEDIUM (15 bugs)

| ID | Title | Category |
|----|-------|----------|
| P2-1 | `visual-audit.js` covers ~26 of 52+ routes (~50%) | Tooling |
| P2-2 | CSS duplication: `site.css` + `site-layered.css` | Tooling |
| P2-3 | `floating-cluster.css` false comment claim | Source layer |
| P2-4 | `sw.js` CACHE_VERSION manual, not synced with cache-bust | Tooling |
| P2-5 | `notify-on-failure.yml` Python3 artifact parser broken | Tooling |
| P2-6 | feed.xml UTC +0000 instead of Moscow +0300 | Metadata |
| P2-7 | AGENTS.md 700+ lines, 41 version history | Documentation |
| P2-8 | `cache-bust.js` ASSETS hardcoded duplicate in `audit-pro.js` | Tooling |
| P2-9 | Visual parity coverage gap (12/19 contracts) | Tooling |
| P2-10 | sw-dist-readiness-audit missing cache-bust sync check | Tooling |
| P2-11 | deploy.yml redundant cache-bust after indexnow | CI/CD |
| P2-12 | check-data-consistency H1 extraction regex fragile | Tooling |
| P2-13 | MDX canonicalOverride routing unclear | Route |
| P2-14 | `series-cards.js` precached but unused in strict-native pages | Tooling |
| P2-15 | about/ page ownership unclear (legacy vs Astro-native) | Route |

---

## P3 — LOW (5 bugs)

| ID | Title |
|----|-------|
| P3-1 | `search.js` fallback → GitHub at network error |
| P3-2 | PlayEmber `aria-disabled="true"` but active |
| P3-3 | check-data-consistency `path.posix` edge-case |
| P3-4 | Hardcoded word count floors drift from meta pipeline |
| P3-5 | interactive-audit hardcoded URL lists drift |
| P3-6 | `floating-cluster-controller.js` stale hash in 10 Astro refs |

---

## CLOSED (false positives)

| Original ID | Reason |
|-------------|--------|
| P0-4 | feed.xml does NOT contain `raw.githubusercontent.com` dead link — grep=0 |
| P0-5 | `cache-bust.js` regex works correctly — `/\./g` has global flag |

---

## Summary counts

| Severity | Count | Status |
|----------|-------|--------|
| P0 | 9 | All confirmed |
| P1 | 13 | All confirmed |
| P2 | 15 | All confirmed |
| P3 | 5 | All confirmed |
| **Total** | **42** | |
| Closed | 2 | False positives |
| **Net confirmed** | **40** | |

---

## Repair-ready — see `repair-order-unified-2026-06-25.md`

---

## Amendments — arena-agent-verifier-2 (2026-06-25)

> Additive only; existing rows untouched. Full evidence: `incoming/arena-agent-verifier-2/2026-06-25/NET-NEW-bugs-not-in-unified-ledger-2026-06-25.md`. Conflicts/resolutions: `verification/CONFLICT_REGISTRY_2026-06-25.md` C-04…C-06.

### Net-new bugs (not previously in ledger)

| ID | Sev | File(s) | Bug | Note |
|----|-----|---------|-----|------|
| V2-1 | P1 | `GillPart1PageChrome.astro`, gill-part3 chrome | TOC↔body anchor mismatch: part1 `#sec-early-years`(→`#part-calling`),`#sec-gill-spirituality`(missing); part3 5 broken (`#sec-legacy-main`,`#sec-rome-proverbs`,`#sec-wesley`,`#sec-coffee-house-polity`,`#sec-evaluations-map`) | NOT masked by PS-01 (pure markup); broken in-page nav |
| V2-2 | P1 | `js/nagornaya-mobile-toc.js` + 5 `Nagornaya*PageChrome.astro` | Font A−/A+ dead: markup `#nagFontDec`/`.nag-fontsize-btn`, JS listens `[data-fontsize]`/`.nag-fontsize-down/up` (no such elements) | NOT masked by PS-01 |
| V2-3 | P1 | `karty/avraam/index.html` | Skip-link `href="#svg-map"` → no such id (real: `#svg`/`#mapFrame`/`#stage`); a11y skip dead | only map with a skip-link |
| V2-4 | P2 | `feed.xml` | RFC-822 weekday names wrong: `Sat,31 May`→Sunday ×3, `Thu,01 May`→Friday ×6 | distinct from P2-6 (timezone); both real |

### Status corrections to existing rows (see arena-agent-2 corrections + my independent confirm)
- **P0-2** (`floating-cluster.css` empty) → **CLOSE / false positive** (verified 1869 lines / 68KB by two agents). C-05.
- **PS-01** root cause = lexical IIFE-scope defect (not load-order); triple-confirmed (Playwright + Node stub + jsdom); blast radius **23** pages. C-04.
- **P0-1** (Gill SAVE "data-action") → fold into PS-01 (attribute `data-fc-action` is correct; dead only because init aborts). 

### Headline count impact
Net-new +4 (V2-1..V2-4). P0-2 false-positive −1 (P0 9→8). Final verifier should re-tally.
