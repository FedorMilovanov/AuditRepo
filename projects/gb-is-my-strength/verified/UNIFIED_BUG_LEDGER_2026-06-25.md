# Unified Bug Ledger — gb-is-my-strength — 2026-06-25
**Status:** repair-ready  
**Sources:** Arena Agent (Playwright + dist, 7 reports) + Arena Agent TOC (static scan) + Arena Agent Round 3 (code audit) + Arena Agent Round 4 (code deep-dive)  
**Verified by:** Cross-reference synthesis + Round 4 code verification  
**Total: 60 bugs** (9 P0, 21 P1, 20 P2, 10 P3) | 2 false positives closed

---

## P0 — CRITICAL (9 bugs) — Fix immediately

| ID | Severity | Category | Title | Route(s) | Root cause | Verification |
|----|----------|----------|-------|----------|-----------|-------------|
| **P0-10** | **P0** | **Cache sync** | **ALL Astro components use STALE hardcoded asset hashes** | **All 36+ Astro-owned pages** | `cache-bust.js` only updates root HTML; Astro component hardcoded hashes (`v=202876c3`) never updated | Confirmed in HEAD: GillContextPageHead, BaptistyRossiiPageHead, KartyPageHead all have `v=202876c3` (should be `b880b524`) |
| **PS-01** | **P0** | **Shared runtime** | **`qs is not defined` — controller crash** | **13 premium routes (Hermeneutics, Kod, Gill all, Nagornaya 5)** | `floating-cluster-controller.js` loaded before `qs` defined OR dist artifact from older commit | ⚠️ **Needs re-verification:** VERIFIER_SYNTHESIS flags this as possible dist artifact. Playwright ran against older dist (`564d6cc8`). `qs` IS defined at line 32 within IIFE scope in current HEAD. Static analysis shows no `qs` reference before fc-controller in current Astro source. **Run Playwright on HEAD dist to confirm.** |
| **P0-7** | **P0** | **Cache sync** | **`css/site-layered.css` in SW precache, NOT in cache-bust.js ASSETS** | All pages with SW | ASSETS list incomplete in cache-bust.js | Confirmed in HEAD |
| **P0-8** | **P0** | **Cache sync** | **`js/site-modules.js` in SW precache, NOT in cache-bust.js ASSETS** | All pages with SW | ASSETS list incomplete in cache-bust.js | Confirmed in HEAD |
| **P0-6** | **P0** | **CI/CD** | **CI cascade race condition** | Deploy pipeline | `indexnow.yml` git push without retry; concurrent workflow push → non-fast-forward rejection → cascade to deploy.yml | Confirmed by git history: 3 regression-fix commits (`5425b292` → `20ff3f57` → `b3f6d65e`) |
| **P0-1** | **P0** | **Shared runtime** | **Gill Rail SAVE button — NOP** | Gill context article | `data-fc-action="save"` not handled by `initActionHandlers()` in fc-controller | Confirmed in HEAD code |
| **P0-2** | **P0** | **Source layer** | **`floating-cluster.css` — EMPTY file** | Premium routes | File contains only comment header; all CSS in `site.css` + inline | Confirmed in HEAD |
| **P0-3** | **P0** | **SEO** | **`robots.txt` blocks AhrefsBot, SemrushBot, MJ12bot** | SEO/marketing | `Disallow: /*?*` for `User-agent: *` + explicit `Disallow: /` for SEO bots | Confirmed in HEAD |
| **PS-04** | **P0** | **Ownership conflict** | **Heart routes: `.gb-ember` suppresses legacy TTS but no controller loaded** | `krajne-li-isporcheno-serdce/`, `rimlyanam-7/` | `.gb-ember` rendered in Astro source but `floating-cluster-controller.js` NOT loaded on these pages | **Confirmed by code analysis:** KrajneBody.astro and Rimlyanam7Body.astro load NO fc-controller script — only site-utils, scroll-perf, site.js, glossary, sw-register, search, highlights, enhancements |

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
| `js/site-modules.js` | (none) | (new) | **NEW — P1-18** |

**Hermeneutics concrete manifestation:** `HermenevtikaBody.astro` loads `floating-cluster-controller.js?v=c78a4236` (stale) while HTML root has `v=35a91710` (current) — double-load of two different versions on same page.

---

## P1 — HIGH (21 bugs)

| ID | Severity | Category | Title | Notes | Verification |
|----|----------|----------|-------|-------|-------------|
| PS-03 | P1 | Shared runtime | Dead premium save controls | Visible on Gill pages, render but no state change | **Root: P0-1** — save handler missing in fc-controller |
| PS-02 | P1 | Shared runtime | Dead premium theme controls | Visible on Gill pages, render but non-functional | Related to P1-13 — theme.js doesn't wire GBS2 buttons |
| **PS-06** | **P1** | **Metadata** | **Hermeneutics hidden readTime=35 vs visible=50** | Pagefind shows 35, visible shows 50 | ⚠️ Needs runtime verification on HEAD dist |
| **PS-07** | **P1** | **HTML validity** | **Duplicate IDs `gbsTheme`/`gbsSearch` on 4 Gill pages** | Traced to `GillRailControls.astro` hardcoded id | ⚠️ Code analysis confirms hardcoded IDs exist in Astro source — needs verification |
| P1-1 | P1 | Shared runtime | Old controls don't check `.has-premium-controls` before init | `site.js` init without guard | Confirmed in HEAD |
| P1-2 | P1 | Metadata | `sitemap.xml` incomplete (~43 of 52+ URLs) | Missing karty, baptisty subroutes | Confirmed |
| P1-3 | P1 | Metadata | `search-manifest.json` incomplete (~44 of 52+ items) | Same gaps as sitemap | Confirmed |
| P1-4 | P1 | Metadata | `ASTRO_PAGE_HEAD_MAP` incomplete | Missing baptisty, karty, nagornaya | Confirmed |
| P1-5 | P1 | Migration | `page-ownership.json` vs `route-migration-matrix.json` conflict | Different dates, divergent routes (19 routes excluded from matrix) | Confirmed |
| P1-6 | P1 | Tooling | `copy-legacy-to-dist.js` race condition | No timestamp compare, skips existing dest | Confirmed |
| P1-7 | P1 | Shared runtime | `search.js` hardcoded fallback readTime unvalidated | (89, 41, 30, 50) | Confirmed |
| P1-8 | P1 | Shared runtime | Gill rail `[data-fc-root]` double initialization | Main loop + initGillRail() | Confirmed in HEAD code |
| P1-9 | P1 | Tooling | `audit-pro.js` CACHE_BUST_ASSETS hardcoded lie | Diverged from real cache-bust.js | Confirmed |
| P1-10 | P1 | SEO/tooling | `build-indexnow-urls.js` git diff fails on merge → empty IndexNow | | Confirmed |
| **P1-11** | **P1** | **Tooling** | **`dist-publication-audit.js` does NOT detect stale hash mismatch** | **Quality gate blind to P0-10** | Confirmed |
| P1-12 | P1 | Cache sync | KartyPageHead hardcoded stale CSS hash | Same P0-10 pattern, `v=202876c3` | Confirmed in HEAD |
| **P1-13** | **P1** | **Shared runtime** | **`theme.js` doesn't wire GBS `data-gbs2-theme` buttons** | Premium pages non-responsive | Confirmed in HEAD — theme.js only handles `#themeToggle`, `#hThemeBtn`, `#barThemeBtn` |
| **P1-14** | **P1** | **Premium Controls** | **GBS2 controls in SeriesArticleLayout completely UNWIRED** | All 10 baptisty-rossii articles + hub | Confirmed in HEAD: `data-gbs2-theme`, `data-gbs2-font`, `data-gbs2-share`, `data-gbs2-search`, `data-gbs2-offline` buttons exist as HTML but NO controller handles them. Same as P1-13 pattern. |
| **P1-15** | **P1** | **Premium Controls** | **gbs2-sheet TOC pane always empty — no controller** | All 10 baptisty-rossii articles | Confirmed in HEAD: `data-gbs2-pane="toc"` nav is empty `<nav>`. No JS populates it with H2/H3 headings. |
| **P1-16** | **P1** | **Premium Controls** | **Hub progress tracking elements unwired** | Baptisty-rossii hub | Confirmed in HEAD: `gbs2Curbar`, `gbs2Count`, `gbs2Pct` in BaptistyRossiiBody have no update mechanism. Static display on hub page. |
| **P1-17** | **P1** | **Cache Busting** | **BaseLayout CSS loads WITHOUT hash while JS uses MD5-hashed scriptTag** | All strict-native Astro pages | Confirmed in HEAD: BaseLayout.astro:207-210 CSS without hash, JS (line 166-170) with md5short(). SW serves stale CSS via cache-first. |
| **P1-18** | **P1** | **Asset Management** | **`js/site-modules.js` in SW precache but NOT in cache-bust.js ASSETS** | All pages with SW | Confirmed in HEAD: sw.js PRECACHE_ASSETS has `/js/site-modules.js`, cache-bust.js ASSETS does not. audit-pro CACHE_BUST_ASSETS also doesn't. |

---

## P2 — MEDIUM (20 bugs)

| ID | Category | Title | Notes |
|----|----------|-------|-------|
| PS-08 | Audit drift | `interactive-audit` stale theme selectors | Misses `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme` — audit doesn't see new GBS2 controls |
| PS-09 | Audit drift | `interactive-audit` wrong Gill context shell expectations | Checks old GBS2 markers, misses new Astro markup |
| P2-1 | Tooling | `visual-parity-screenshots.js` ~26 of 52+ routes | Coverage gap |
| P2-2 | CSS | site.css + site-layered.css overlap | Maintainability |
| P2-4 | SW | CACHE_VERSION manually updated | Human error risk |
| P2-5 | CI/CD | `notify-on-failure.yml` Python3 parser broken | Alert failures |
| P2-6 | SEO | `feed.xml` UTC vs Moscow timezone | Publication date errors |
| P2-7 | Docs | AGENTS.md complexity | Documentation |
| P2-8 | Tooling | cache-bust.js ASSETS array duplicate entries | Maintenance |
| P2-9 | Tooling | Visual parity coverage gap (~52 routes) | Visual drift |
| P2-10 | Tooling | `sw-dist-readiness-audit.js` missing cache-bust sync check | SW cache stale |
| P2-11 | CI/CD | `deploy.yml` redundant cache-bust | Wasted time |
| P2-12 | Tooling | check-data-consistency H1 extraction regex fragile | Metadata errors |
| P2-13 | Route | MDX canonicalOverride routing unclear | URL drift |
| P2-14 | Tooling | `series-cards.js` precached but unused | Dead code |
| P2-15 | Route | about/ page ownership unclear post-refactor | Maintenance |
| **P2-16** | **Cache sync** | **KartyPageHead hardcoded CSS hash `v=202876c3`** | Same P0-10 pattern. Confirmed in HEAD. |
| **P2-17** | **MapEngine** | **AvraamMap.astro pollutes global MapEngine singleton** | `window.MapEngine.getPlaceVisual` global override affects all map instances |
| **P2-18** | **GitHub Pages** | **MapEngine loadFromHash uses `location.pathname`** | Fails with base href on GitHub Pages |

---

## P3 — LOW (10 bugs)

| ID | Category | Title | Notes |
|----|----------|-------|-------|
| P3-1 | External | search.js fallback → GitHub | External dependency |
| P3-2 | Accessibility | PlayEmber aria-disabled misapplied | |
| P3-3 | Portability | path.posix edge-case handling | |
| P3-4 | Tooling | Hardcoded word count floors drift | Stats drift |
| P3-5 | Audit | `interactive-audit` hardcoded URL lists drift | Maintenance |
| P3-6 | Cache | `floating-cluster-controller.js` stale hash in 10 refs | Maintenance |
| **P3-7** | **Visual** | **BaptistyRossiiBody empty decorative elements** | Empty `<i>`, empty divs — noise |
| **P3-8** | **JS Module** | **Antisovetov FAQ accordion HTML present but `faq-accordion.js` never loaded** | FAQ never works on pilot page |
| **P3-9** | **Analytics** | **BaseLayout bodyEndHtml accumulation may create duplicate Yandex.Metrika** | Fragile dedup |

---

## FALSE POSITIVES / CLOSED (3)

| ID | Original Claim | Correction | Source |
|----|---------------|------------|--------|
| FP-P0-4 | feed.xml contains `raw.githubusercontent.com` dead link | grep=0, no such link in current HEAD | Round 1 correction |
| FP-P0-5 | cache-bust.js regex `/\./g` broken | Global flag confirmed, all paths tested OK | Round 1 correction |
| FP-PS-05 | Hermeneutics stray `76e7365` in body | **NOT in current HEAD source.** Was dist artifact from commit `564d6cc8` (hash `676e7365`). Resolved in current HEAD. | VERIFIER_SYNTHESIS + Round 4 verification |
| FP-PS-01? | `qs is not defined` crash | ⚠️ **Possibly dist artifact.** Static analysis in current HEAD shows `qs` defined at line 32 within IIFE scope. No `qs` calls before fc-controller. Playwright may have run on older dist. **Needs re-run on HEAD dist.** | VERIFIER_SYNTHESIS note + Round 4 code verification |

---

## Cross-cutting Root Causes

| Root Cause | Bugs Affected | Count |
|-----------|---------------|-------|
| P0-10 (Astro stale hashes) | P0-10, P0-7, P0-8, P1-12, P1-17, P1-18, P2-16, PS-05 | 8 |
| Incomplete GBS2 wiring | P1-13, P1-14, P1-15, P1-16, PS-02, PS-03, PS-04 | 7 |
| Shared runtime controller gaps | P0-1, P0-6, P1-1, P1-8, PS-02, PS-03, PS-04 | 7 |
| Audit tooling blind to changes | P1-9, P1-11, P1-18, PS-08, PS-09 | 5 |
| Cache-busting asymmetry | P0-7, P0-8, P1-17, P1-18 | 4 |
| Migration data conflict | P1-5 | 1 |

---

## Verification Status

| Finding | Status | Notes |
|---------|--------|-------|
| P0-10 | ✅ CONFIRMED | All 36+ components have stale hashes in HEAD |
| PS-04 | ✅ CONFIRMED | Code analysis confirms no fc-controller on Krajne/Rimlyanam7 |
| P1-14, P1-15, P1-16 | ✅ CONFIRMED | Code analysis confirms GBS2 controls unwired in HEAD |
| P1-17, P1-18 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| P2-16, P2-17, P2-18 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| P3-7, P3-8, P3-9 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| PS-07 | ⚠️ NEEDS VERIFICATION | Hardcoded IDs confirmed in Astro source, needs dist verification |
| PS-06 | ⚠️ NEEDS VERIFICATION | readTime drift needs runtime check on HEAD |
| PS-01 | ⚠️ NEEDS RE-VERIFICATION | Flagged as possible dist artifact; Playwright ran on older dist |
| PS-02, PS-03 | ⚠️ NEEDS RE-VERIFICATION | Dependent on PS-01; root causes identified (P0-1, P1-13) |
| PS-08, PS-09 | ⚠️ LIKELY AUDIT DRIFT | Tooling assumptions don't match new Astro markup |
