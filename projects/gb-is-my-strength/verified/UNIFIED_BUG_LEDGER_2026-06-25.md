# Unified Bug Ledger — gb-is-my-strength — 2026-06-25
**Status:** repair-ready  
**Sources:** Arena Agent (Playwright + dist, 7 reports) + Arena Agent TOC (static scan) + Arena Agent Round 3 (code audit) + Arena Agent Round 4 (code deep-dive) + Arena Agent Verifier-2 (runtime + cross-validation)  
**Verified by:** Cross-reference synthesis + Round 4 code verification + Verifier-2 runtime pass  
**Total: 61 bugs** (9 P0, 20 P1, 19 P2, 13 P3) | 5 false positives / status corrections closed

---

## P0 — CRITICAL (8 bugs) — Fix immediately

| ID | Severity | Category | Title | Route(s) | Root cause | Verification |
|----|----------|----------|-------|----------|-----------|-------------|
| **PS-01** | **P0** | **Shared runtime** | **`qs is not defined` — lexical IIFE-scope defect** | **23 premium pages** | `floating-cluster-controller.js` IIFE: `qs` defined at line 32 but init aborts before use — lexical scope issue, not load-order. NOT a dist artifact; triple-confirmed (Playwright + Node stub + jsdom). | Triple-confirmed by Verifier-2; also confirmed by Round 4 static analysis (within IIFE, qs defined before use, but init chain breaks). **P0-1 (Gill SAVE NOP) folds into PS-01** — `data-fc-action="save"` attribute is correct, but dead because fc-controller init aborts. |
| **P0-10** | **P0** | **Cache sync** | **ALL Astro components use STALE hardcoded asset hashes** | **All 36+ Astro-owned pages** | `cache-bust.js` only updates root HTML; Astro component hardcoded hashes (`v=202876c3`) never updated | Confirmed in HEAD: GillContextPageHead, BaptistyRossiiPageHead, KartyPageHead all have stale hashes. HermenevtikaBody has two different versions of fc-controller (c78a4236 + 35a91710) loaded simultaneously. |
| **P0-7** | **P0** | **Cache sync** | **`css/site-layered.css` in SW precache, NOT in cache-bust.js ASSETS** | All pages with SW | ASSETS list incomplete in cache-bust.js | Confirmed in HEAD |
| **P0-8** | **P0** | **Cache sync** | **`js/site-modules.js` in SW precache, NOT in cache-bust.js ASSETS** | All pages with SW | ASSETS list incomplete in cache-bust.js | Confirmed in HEAD |
| **P0-6** | **P0** | **CI/CD** | **CI cascade race condition** | Deploy pipeline | `indexnow.yml` git push without retry; concurrent workflow push → non-fast-forward rejection → cascade to deploy.yml | Confirmed by git history: 3 regression-fix commits |
| **P0-3** | **P0** | **SEO** | **`robots.txt` blocks AhrefsBot, SemrushBot, MJ12bot** | SEO/marketing | `Disallow: /*?*` for `User-agent: *` + explicit `Disallow: /` for SEO bots | Confirmed in HEAD |
| **PS-04** | **P0** | **Ownership conflict** | **Heart routes: `.gb-ember` suppresses legacy TTS but no controller loaded** | `krajne-li-isporcheno-serdce/`, `rimlyanam-7/` | `.gb-ember` rendered in Astro source but `floating-cluster-controller.js` NOT loaded | Confirmed by code analysis (Verifier-2 + Round 4 independently): KrajneBody/Rimlyanam7Body load NO fc-controller |
| **PS-07** | **P0** | **HTML validity** | **Duplicate IDs `gbsTheme`/`gbsSearch` on Gill pages** | Gill Part1-3 + Context + Spravochnik | `GillRailControls.astro` hardcoded `id="gbsTheme"` + `id="gbsSearch"` used twice per page (mobile + rail instances) | Confirmed in HEAD Astro source (Verifier-2): hardcoded IDs exist in component at lines 43, 66. 4+ Gill pages each render two instances. |
| **P0-NEW** | **P0** | **Service Worker** | **SW precache 404 for `site-layered.css` + `site-modules.js`** | All SW-enabled pages | Files exist in `src/` but are NEVER imported in any Astro component → Astro build does NOT copy them to `dist/` → SW precache gets 404 | Confirmed: `grep site-layered site-modules src/ --include="*.astro"` → 0 results; `ls dist/css/site-layered.css` → No such file. Deeper root of P0-7/P0-8: these bugs aren't just cache-bust asymmetry — the assets don't exist in dist at all. |

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

**Hermeneutics concrete manifestation:** `HermenevtikaBody.astro` loads `fc-controller.js?v=c78a4236` (stale) while correct version is `v=35a91710` — **two different versions loaded simultaneously**.

---

## P1 — HIGH (20 bugs)

| ID | Severity | Category | Title | Notes | Verification |
|----|----------|----------|-------|-------|-------------|
| PS-03 | P1 | Shared runtime | Dead premium save controls | Visible on Gill pages, render but no state change | **Root: PS-01** — controller init aborts → all actions dead |
| PS-02 | P1 | Shared runtime | Dead premium theme controls | Visible on Gill pages, render but non-functional | **Root: PS-01 + P1-13** — controller init aborts + theme.js doesn't wire GBS2 |
| **PS-06** | **P1** | **Metadata** | ~~**Hermeneutics hidden readTime=35 vs visible=50**~~ → FIXED | Pagefind shows 35, visible shows 50 | ✅ FIXED: `data-pagefind-meta readTime` updated 35→50 in HermenevtikaBody.astro. Confirmed in project source. Duplicate of FIXED section entry. |
| P1-1 | P1 | Shared runtime | Old controls don't check `.has-premium-controls` before init | `site.js` init without guard | Confirmed |
| P1-2 | P1 | Metadata | ~~`sitemap.xml` incomplete (~43 of 52+ URLs)~~ → ⚠️ **RECHECK** | Gap = 8 karty stub pages (early-church, maccabim, melachim, pavel, revelation, shoftim, shvatim, yeshua) + home page. Stubs are placeholders per owner design — intentional omission, not a bug. Baptisty subroutes ARE in sitemap. | Confirmed intentional design: stub pages should not be indexed. | Confirmed |
| P1-3 | P1 | Metadata | ~~`search-manifest.json` incomplete (~44 of 52+ items)~~ → ⚠️ **RECHECK** | 44 items vs 51 Astro pages. Gap = 8 karty stubs (should not be indexed) + / (home page). Home page IS in sitemap — search still functional. | Confirmed intentional: stubs excluded from search index. | Confirmed |
| P1-4 | P1 | Metadata | `ASTRO_PAGE_HEAD_MAP` incomplete | Missing baptisty, karty, nagornaya | Confirmed |
| P1-5 | P1 | Migration | `page-ownership.json` vs `route-migration-matrix.json` conflict | Different dates, divergent routes | Confirmed |
| P1-6 | P1 | Tooling | `copy-legacy-to-dist.js` race condition | No timestamp compare | Confirmed |
| P1-7 | P1 | Shared runtime | `search.js` hardcoded fallback readTime unvalidated | (89, 41, 30, 50) | Confirmed |
| P1-8 | P1 | Shared runtime | Gill rail `[data-fc-root]` double initialization | Main loop + initGillRail() | Confirmed in HEAD code |
| P1-9 | P1 | Tooling | `audit-pro.js` CACHE_BUST_ASSETS hardcoded lie | Diverged from real cache-bust.js | Confirmed |
| P1-10 | P1 | SEO/tooling | `build-indexnow-urls.js` git diff fails on merge → empty IndexNow | | Confirmed |
| **P1-11** | **P1** | **Tooling** | **`dist-publication-audit.js` does NOT detect stale hash mismatch** | **Quality gate blind to P0-10** | Confirmed |
| P1-12 | P1 | Cache sync | KartyPageHead hardcoded stale CSS hash | Same P0-10 pattern, `v=202876c3` | Confirmed in HEAD |
| **P1-13** | **P1** | **Shared runtime** | **`theme.js` doesn't wire GBS `data-gbs2-theme` buttons** | Premium pages non-responsive | Confirmed in HEAD — theme.js only handles `#themeToggle`, `#hThemeBtn`, `#barThemeBtn` |
| **P1-14** | **P1** | **Premium Controls** | **GBS2 controls in SeriesArticleLayout completely UNWIRED** | All 10 baptisty-rossii articles + hub | Confirmed: `data-gbs2-theme`, `data-gbs2-font`, `data-gbs2-share`, `data-gbs2-search`, `data-gbs2-offline` exist as HTML but NO controller |
| **P1-15** | **P1** | **Premium Controls** | **gbs2-sheet TOC pane always empty — no controller** | All 10 baptisty-rossii articles | Confirmed: `data-gbs2-pane="toc"` nav is empty |
| **P1-16** | **P1** | **Premium Controls** | **Hub progress tracking elements unwired** | Baptisty-rossii hub | Confirmed: `gbs2Curbar`, `gbs2Count`, `gbs2Pct` have no update mechanism |
| **P1-17** | **P1** | **Cache Busting** | **BaseLayout CSS loads WITHOUT hash while JS uses MD5-hashed scriptTag** | All strict-native Astro pages | Confirmed: BaseLayout.astro CSS without hash, JS with md5short() |
| **P1-18** | **P1** | **Asset Management** | **`js/site-modules.js` in SW precache but NOT in cache-bust.js ASSETS** | All pages with SW | Confirmed: sw.js has it, cache-bust.js doesn't |
| **V2-1** | **P1** | **Route content** | ~~**Gill TOC↔body anchor mismatch**~~ → PARTIAL FIX | Gill Part1, Part3 | Part1: `#sec-early-years` FIXED (wrapper added), `#sec-gill-spirituality` removed from TOC. Part3: `#part-legacy` fixed (was `#sec-legacy-main`), `#sec-wesley` heading added, 3 broken entries removed. Remaining: semantic grouping concern (Wesley content embedded in sec-controversy). |
| ~~**V2-2**~~ | ~~P1~~ | **Premium Controls** | ~~**Nagornaya font controls dead — selector mismatch**~~ → ✅ FIXED | All 5 Nagornaya articles | Markup now has `data-fontsize="down"` and `data-fontsize="up"` on all 6 pages (chast-1..chast-5 + index). JS selector `[data-fontsize="down/up"]` now matches. |

---

## P2 — MEDIUM (19 bugs)

| ID | Category | Title | Notes |
|----|----------|-------|-------|
| PS-08 | Audit drift | `interactive-audit` stale theme selectors | Misses `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme` |
| PS-09 | Audit drift | `interactive-audit` wrong Gill context shell expectations | Checks old GBS2 markers, misses new Astro markup |
| ~~**V2-3**~~ | ~~A11y~~ | **A11y** | ~~**Avraam skip-link `#svg-map` → no such id**~~ → ✅ FIXED | karty/avraam/ | `#svg-map` → `#stage` via sed. `id="stage"` is the main map container (line 1177). Skip-link now functional. |
| ~~**V2-4**~~ | ~~SEO~~ | ~~**`feed.xml` RFC-822 weekday names wrong**~~ → ✅ **FIXED** | `Sat,31 May` → Sunday ×3; `Thu,01 May` → Friday ×6. All 17 entries corrected in feed.xml. `toRFC()` in update-meta.js replaced with timezone-safe version. |
| P2-1 | Tooling | `visual-parity-screenshots.js` ~26 of 52+ routes | Coverage gap |
| P2-2 | CSS | site.css + site-layered.css overlap | Maintainability |
| P2-4 | SW | CACHE_VERSION manually updated | Human error risk |
| P2-5 | CI/CD | `notify-on-failure.yml` Python3 parser broken | Alert failures |
| ~~P2-6~~ | ~~SEO~~ | ~~`feed.xml` UTC vs Moscow timezone~~ → ✅ RESOLVED | Merged into V2-4. toRFC replaced — all pubDates now correctly +0300 Moscow. |
| P2-7 | Docs | AGENTS.md complexity | Documentation |
| P2-8 | Tooling | cache-bust.js ASSETS array duplicate entries | Maintenance |
| P2-9 | Tooling | Visual parity coverage gap (~52 routes) | Visual drift |
| P2-10 | Tooling | `sw-dist-readiness-audit.js` missing cache-bust sync check | SW cache stale |
| P2-11 | CI/CD | `deploy.yml` redundant cache-bust | Wasted time |
| P2-12 | Tooling | check-data-consistency H1 extraction regex fragile | Metadata errors |
| P2-13 | Route | MDX canonicalOverride routing unclear | URL drift |
| P2-14 | Tooling | `series-cards.js` precached but unused | Dead code |
| P2-15 | Route | about/ page ownership unclear post-refactor | Maintenance |
| **P2-16** | **Cache sync** | **KartyPageHead hardcoded CSS hash `v=202876c3`** | Same P0-10 pattern |
| **P2-17** | **MapEngine** | **AvraamMap.astro pollutes global MapEngine singleton** | `window.MapEngine.getPlaceVisual` global override |
| **P2-18** | **GitHub Pages** | **MapEngine loadFromHash uses `location.pathname`** | Fails with base href on GitHub Pages |

---

## P3 — LOW (13 bugs)

| ID | Category | Title | Notes |
|----|----------|-------|-------|
| P3-1 | External | search.js fallback → GitHub | External dependency |
| P3-2 | Accessibility | PlayEmber aria-disabled misapplied | |
| P3-3 | Portability | path.posix edge-case handling | |
| P3-4 | Tooling | Hardcoded word count floors drift | Stats drift |
| P3-5 | Audit | `interactive-audit` hardcoded URL lists drift | Maintenance |
| P3-6 | Cache | `floating-cluster-controller.js` stale hash in 10 refs | Maintenance |
| **P3-7** | **Visual** | **BaptistyRossiiBody empty decorative elements** | Empty `<i>`, empty divs |
| ~~P3-8~~ | ~~JS Module~~ | ~~Antisovetov FAQ accordion~~ → ❌ **FALSE POSITIVE** | Playwright (arena-agent-2, SHA 03e01a0): accordion works via js/enhancements.js. faq-accordion.js is dead code. Cleanup: remove unused js/modules/faq-accordion.js. |
| **P3-9** | **Analytics** | **BaseLayout bodyEndHtml accumulation may create duplicate Yandex.Metrika** | Fragile dedup |
| P3-10 | A11y | Nagornaya article TOC scroll target issues | V2-2 related |
| P3-11 | Cache | site-modules.js cache-bust drift (related to P1-18) | |
| P3-12 | Route | AvraamMap baseGeoUrl without cache-busting (related to P2-18) | |
| **P3-NEW** | **UX / JS Module** | `back-to-top.js` NEVER loaded on any page | Gill Part1-3 (32/39/54 min), Krajne, Rimlyanam7. Button visible but scroll-visibility (600px) and click-to-top broken. enhancements.js does not handle this. |



## FALSE POSITIVES / CLOSED (4)

| ID | Original Claim | Correction | Source |
|----|---------------|------------|--------|
| **FP-P0-2** | `floating-cluster.css` — EMPTY file | **CONFIRMED NOT EMPTY.** File = 1869 lines, 68KB CSS. Contains v16 floating cluster styles (gb-icon, gb-ember, gb-save, gb-floater). Was marked empty in Round 1 — incorrect. **REMOVE from P0 list.** | Verifier-2 + Round 4 correction |
| FP-P0-4 | feed.xml contains `raw.githubusercontent.com` dead link | grep=0, no such link in current HEAD | Round 1 correction |
| FP-P0-5 | cache-bust.js regex `/\./g` broken | Global flag confirmed, all paths tested OK | Round 1 correction |
| **FP-P3-8** | FAQ accordion module never loaded | **CONFIRMED NOT A BUG.** Playwright verified (arena-agent-2, SHA 03e01a0): accordion WORKS via js/enhancements.js. faq-accordion.js is duplicate/dead module. Only cleanup: remove unused js/modules/faq-accordion.js. |

| **FP-PS-05** | Hermeneutics stray `76e7365` in body | **NOT in current HEAD source.** Was dist artifact from commit `564d6cc8`. Resolved in current HEAD. | VERIFIER_SYNTHESIS + Round 4 |

---

## Cross-cutting Root Causes

| Root Cause | Bugs Affected | Count |
|-----------|---------------|-------|
| PS-01 (fc-controller IIFE abort) | PS-01, PS-02, PS-03, PS-04, P0-1, P0-6, P1-8 | 7 |
| P0-10 (Astro stale hashes) | P0-10, P0-7, P0-8, P1-12, P1-17, P1-18, P2-16, P2-17, P2-18, P3-11, P3-12 | 11 |
| Incomplete GBS2 wiring | P1-13, P1-14, P1-15, P1-16, V2-2, PS-02, PS-04 | 7 |
| Cache-busting asymmetry | P0-7, P0-8, P1-17, P1-18 | 4 |
| Migration data conflict | P1-5 | 1 |
| Gill TOC structure issues | V2-1 | 1 |
| **P0-NEW: SW precache missing assets** | **P0-NEW** (standalone: assets don't exist in dist/) | 1 |

---

## Verification Status

| Finding | Status | Notes |
|---------|--------|-------|
| P0-10 | ✅ CONFIRMED | All 36+ components have stale hashes in HEAD |
| PS-01 + P0-1 | ✅ CONFIRMED | Lexical IIFE-scope defect; triple-confirmed by Verifier-2 |
| PS-04 | ✅ CONFIRMED | No fc-controller on Krajne/Rimlyanam7 (Verifier-2 + Round 4) |
| PS-07 | ✅ CONFIRMED | Hardcoded IDs in GillRailControls.astro at lines 43, 66 (Verifier-2) |
| P1-14, P1-15, P1-16 | ✅ CONFIRMED | Code analysis confirms GBS2 controls unwired in HEAD |
| P1-17, P1-18 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| V2-1 | 🟡 PARTIAL FIX | Anchor works, semantic grouping could improve. Part1: sec-early-years added, sec-gill-spirituality removed. Part3: 4 fixed, 1 semantic concern. |
| V2-2 | ✅ FIXED | data-fontsize="down/up" added to all 6 Nagornaya pages (chast-1..chast-5 + index) |
| V2-3 | ✅ FIXED | `#svg-map` → `#stage` in karty/avraam/index.html |
| V2-4 | ✅ FIXED | feed.xml: 17/17 pubDate corrected (9 wrong weekdays Sat->Sun, Thu->Fri + timezone +0000->+0300). toRFC() in update-meta.js replaced with toLocaleString(Europe/Moscow). Python verified. |
| P2-6 | ✅ RESOLVED | Merged into V2-4. toRFC double-conversion bug caused both weekday and timezone errors. All pubDates now correctly +0300 Moscow. |
| P2-16, P2-17, P2-18 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| P3-7, P3-8, P3-9 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| PS-06 | ✅ FIXED | readTime 35→50 in HermenevtikaBody.astro (duplicate of FIXED section) |
| PS-08, PS-09 | ⚠️ LIKELY AUDIT DRIFT | Tooling assumptions don't match new Astro markup |
| P0-2 | ❌ FALSE POSITIVE | File = 1869 lines, 68KB CSS; not empty |
| **P0-NEW** | ✅ CONFIRMED | `find . -name site-layered.css` → exists in src/, NOT in dist/; grep `site-layered` src/ → 0 Astro imports |

---

## Repair-ready — see `repair-order-unified-2026-06-25.md`

---

## Amendments — Arena Agent Verifier-2 (2026-06-25)

**Source:** `incoming/arena-agent-verifier-2/2026-06-25/NET-NEW-bugs-not-in-unified-ledger-2026-06-25.md`  
**Conflicts resolved:** `verification/CONFLICT_REGISTRY_2026-06-25.md` C-04…C-06

### Verifier-2 corrections to existing rows:
- **P0-2 → CLOSE / false positive** (1869 lines / 68KB verified by two agents)
- **PS-01 root cause** = lexical IIFE-scope defect (not load-order); triple-confirmed (Playwright + Node stub + jsdom); blast radius 23 pages (C-04)
- **P0-1 → fold into PS-01** (`data-fc-action="save"` is correct; dead only because init aborts)

### Verifier-2 net-new bugs:
- V2-1: Gill TOC↔body anchor mismatch (Part1: 2 broken; Part3: 5 broken)
- V2-2: Nagornaya font A−/A+ dead — selector mismatch (markup vs JS)
- V2-3: Avraam skip-link `#svg-map` → no such id (a11y dead)
- V2-4: feed.xml RFC-822 weekday names wrong (9 entries × wrong weekday)

### Count impact:
+4 net-new (V2-1..V2-4). P0-2 false-positive −1 (P0 9→8). Final: **63 bugs (8 P0, 22 P1, 21 P2, 12 P3)**.

---

## FIXED — resolved in lane/fix-ps01-iife-scope-2026-06-25 (commit c1bd605)

| ID | Status | Fix |
|---|---|---|
| PS-01 | ✅ FIXED | Moved `})();` to EOF — initTocPopups/initActionHandlers/initPlayExpand now inside IIFE |
| P0-10 | ✅ FIXED | 72 Astro files updated with correct ?v=HASH |
| PS-06 | ✅ FIXED | readTime 35→50 in HermenevtikaBody.astro |
| PS-07 | ✅ FIXED | Removed hardcoded id=gbsTheme/gbsSearch from GillRailControls.astro |
| P0-7 | ✅ FIXED | Removed /css/site-layered.css from sw.js PRECACHE_ASSETS |
| P0-8 | ✅ FIXED | Removed /js/site-modules.js from sw.js PRECACHE_ASSETS |
| V2-2 | ✅ FIXED | Added `data-fontsize="down/up"` to all 6 Nagornaya PageChrome components (chast-1..chast-5 + index). JS `[data-fontsize]` selector now matches. |
| V2-3 | ✅ FIXED | Changed Avraam skip-link `href="#svg-map"` → `href="#stage"` in karty/avraam/index.html. `#stage` is the main map container (id at line 1177). |

## Additional false positives closed

| ID | Status | Reason |
|---|---|---|
| P0-1 | ❌ FALSE | data-fc-action="save" IS handled in initCluster() |
| P0-2 | ❌ FALSE | floating-cluster.css is 68KB real CSS |
| P0-3 | ❌ POLICY | robots.txt SEO blocks are intentional editorial policy |
| BUG-007 | ❌ FALSE | GillContextPageChrome already has <PlayEmber> + <SaveButton> |

## Cascades expected resolved (need Playwright verify)

- PS-02 (dead theme) — cascade of PS-01 → should auto-fix
- PS-03 (dead save) — cascade of PS-01 → should auto-fix
- PS-05 (stray hash) — cascade of P0-10 → should auto-fix



### Round 7 amendments (2026-06-25):
**Source:** 
**Changes:** 1 new bug found; P1-2/P1-3 rechecked; P0-6 design reviewed.

**Net-new bugs:**
- P3-NEW:  module never loaded anywhere — 5 articles (Gill Part1-3, Krajne, Rimlyanam7) have button HTML but no scroll-visibility or click-to-top. Repair lane: same as P3-8 (faq-accordion-wiring).

**Scope changes:**
- P3-8: expanded from 1 page (Antisovetov) to 5 pages (add Hermenevtika, KodDaVinchi, Krajne, Rimlyanam7)
- P1-2: gap = 8 karty stub pages + home — intentional design, stubs should not be indexed
- P1-3: gap = 8 karty stubs + home — intentional design
- P0-6: CI cascade appears intentionally designed per deploy.yml comment; git history shows 3 regression-fix commits may have addressed earlier issues

**Bug count:** 61 bugs (9 P0, 20 P1, 19 P2, 13 P3)


### Round 6 amendments (2026-06-25):
**Source:** `incoming/arena-agent-round6/2026-06-25/IMPLEMENTATION_AUDIT_ROUND6.md`
**Changes:** Implemented fixes for 4 bugs directly in project source. FAST verification (`data:consistency`, `migration:metadata:check`, `native:runtime:audit:strict`) all passed.
**Fixes implemented:**
- V2-1 Part1: added `<section id="sec-early-years">` wrapper in GillPart1ArticleBody.astro; removed `#sec-gill-spirituality` from TOC
- V2-1 Part3: added `<h3 id="sec-wesley">` heading in GillPart3ArticleBody.astro; fixed `#sec-legacy-main`→`#part-legacy`; removed 3 dead TOC entries (`#sec-rome-proverbs`, `#sec-coffee-house-polity`, `#sec-evaluations-map`)
- V2-2: added `data-fontsize="down/up"` to all 6 Nagornaya PageChrome files (chast-1..chast-5 + index)
- V2-3: changed Avraam skip-link `#svg-map` → `#stage`
- PS-06: updated HermenevtikaBody.astro `data-pagefind-meta="readTime"` from 35→50 (duplicate of FIXED section entry)
**Verification:** All 13 changed files verified with targeted grep. Total count: **60 bugs (9 P0, 20 P1, 19 P2, 12 P3)**.

### Round 5 amendments (2026-06-25):
**Source:** `incoming/arena-agent-round5/2026-06-25/VERIFICATION_AUDIT_ROUND5.md`
**Changes:** All 63 existing bugs verified in HEAD 3b105dc8 of FedorMilovanov/gb-is-my-strength. **1 net-new P0 bug discovered** (P0-NEW).
**P0-NEW detail:** `site-layered.css` and `site-modules.js` referenced in `sw.js` PRECACHE_ASSETS but NOT imported in any Astro component → NOT copied to `dist/` → 404 on all SW-enabled pages. Deeper root of P0-7/P0-8: these files don't even exist in dist/.
**Note:** The FIXED section above documents implementation progress in AuditRepo's lane/ branch. Actual project repo (FedorMilovanov/gb-is-my-strength, HEAD 3b105dc8) still has bugs unfixed until those commits are merged into the project. Verification target is the project repo.
**Count impact:** P0 8→9 (P0-NEW). Final: **60 bugs (9 P0, 20 P1, 19 P2, 12 P3)** (Round 6: 4 fixed: V2-2, V2-3, PS-06, V2-1 PARTIAL) in project repo.


---

## PLAYWRIGHT-VERIFIED — 2026-06-25 (second round, commit 2f2e2bb)

### Дополнительно исправлено и верифицировано Playwright:

| Bug | Status | Evidence |
|---|---|---|
| PS-04 heart series без контроллера | ✅ FIXED+VERIFIED | Playwright: krajne cluster=✅ save_works=✅ |
| Controller early-return bug | ✅ FIXED | initGillRail() moved before `if (!roots.length) return` |
| Nagornaya data-fc-root missing | ✅ FIXED | Root HTML: data-fc-root + data-fc-mode=nagornaya |
| PS-02 theme на Hermeneutics | ✅ VERIFIED working | Playwright: theme_works=true |
| PS-03 save на Krajne | ✅ VERIFIED working | Playwright: save_works=true |
| PS-05 stray hash | ✅ VERIFIED not present | Playwright: body_stray=false all routes |
| PS-07 duplicate IDs | ✅ VERIFIED clean | Playwright: dup_ids=none all Gill routes |

### Установлено:
- GillPart1 theme_btn=false в тесте — НЕ баг: root HTML использует data-gbs2-theme (обрабатывается site.js, не fc-controller)

### Playwright test environment:
- Node.js v22.23.1, Playwright Chromium, static HTTP server
- Tested root HTML (legacy), not Astro dist


---

## ROUND 3 PLAYWRIGHT FIXES — commit 30b2031

| Bug | Status | Playwright evidence |
|---|---|---|
| P1-13 gbs2-theme wiring | ✅ FIXED | GillPart1 theme_works=true |
| V2-1 Gill TOC anchors | ✅ FIXED | 7 broken anchors corrected |
| V2-4 feed weekdays | ✅ FIXED | 9 pubDates corrected |
| P1-2 sitemap incomplete | ❌ FALSE POSITIVE | All missing = noindex/protected |
| P1-8 double initGillRail | ❌ FALSE POSITIVE | Only 1 call in ready() |

---

## Round 8 Amendments (2026-06-25)

**Source:** `incoming/arena-agent-round8/2026-06-25/REPORT.md`

### P3-NEW — back-to-top.js NEVER loaded → ✅ FIXED IN PROJECT SOURCE

**Bug:** `back-to-top.js` module never loaded on any page. Button HTML present on 7 pages but:
- Scroll-based visibility (600px threshold) never triggers
- Click-to-scroll-to-top non-functional
- enhancements.js does NOT handle back-to-top

**Pages affected (expanded from 5 → 7):**
- GillPart1PageChrome.astro (line 89: script added)
- GillPart2PageChrome.astro (line 89: script added)
- GillPart3PageChrome.astro (line 90: script added)
- AntisovetovBody.astro (line 1699: script added) ← expanded from Round 7
- KodDaVinchiPageFooter.astro (line 147: script added) ← expanded from Round 7
- KrajneBody.astro (line 592: script added)
- Rimlyanam7Body.astro (line 197: script added)

**Fix:** Added `<script is:inline defer src="../../js/modules/back-to-top.js"></script>` after last JS script tag on each page.

**Verification:** Module correctly adds `.visible` class at 600px scroll and implements smooth scroll-to-top on click.

### V2-4 — feed.xml pubDates ✅ VERIFIED FIXED IN PROJECT SOURCE

- All 17 pubDate entries use correct +0300 Moscow timezone
- All weekday names correct (Python verified)
- toLocaleString('en-US', { timeZone: 'Europe/Moscow' }) in update-meta.js — no double-conversion

### P2-17 — AvraamMap pollutes global MapEngine singleton ✅ CONFIRMED

**Location:** `src/components/karty/avraam/AvraamMap.astro` lines 31-32
**Code:** `window.MapEngine.getPlaceVisual = function(pl) {...}` — adds to global singleton
**Issue:** AvraamMap overrides IshodMap's getPlaceVisual when both loaded on same page
**Fix direction:** Isolate to local scope or pass as MapEngine option parameter

### P2-18 — MapEngine loadFromHash uses location.pathname ✅ CONFIRMED

**Location:** `karty/_engine/map-engine.js` lines 2462-2481
**Code:** `loadFromHash()` reads `location.hash`; `updateHash()` uses `location.pathname`
**Issue:** On GitHub Pages with base href, pathname includes prefix → fetch(route.json) fails
**Fix direction:** Replace `location.pathname` with base-href-aware path construction

### P3-12 — baseGeoUrl without cache-busting ✅ CONFIRMED

**Location:** AvraamMap.astro line 50: `baseGeoUrl: 'base.svg'` (no ?v=)
**Related to:** P2-18

### Module Parity Audit Results

| Module | Status | Verdict |
|--------|--------|---------|
| `modules/back-to-top.js` | ✅ NOW LOADED (7 pages) | Fixed — was dead, now alive |
| `modules/faq-accordion.js` | ❌ Dead code | P3-8 FALSE POSITIVE confirmed — FAQ works via enhancements.js inline |
| `modules/theme.js` | ✅ Not an issue | Extracted from site.js; site.js handles inline |
| `modules/img-loaded.js` | ✅ Not an issue | Extracted from site.js; site.js handles inline |

**Dead code:** faq-accordion.js removal is non-blocking cleanup. Only recommendation: remove it to avoid confusion.

### SEO Meta Audit

- canonical: unique per route — no duplicates
- og:url: correct on all checked pages
- pagefind-meta: present on all major content pages (About, Antisovetov, Hermenevtika, KodDaVinchi, Krajne, Rimlyanam7, Nagornaya 1-5, ArticleLayout, SeriesArticleLayout)
- Gill pages (Part1-3, Context, Spravochnik): no pagefind-meta — intentional (GBS2 has own search/nav)
- Baptisty: uses SeriesArticleLayout with pagefind-meta ✅

### Gill Duplicate IDs (PS-07 Related)

- GillPart1/2/3/Spravochnik render 2× GillRailControls (mobile + rail)
- GillRailControls.astro: `id="gbsTheme"` (line 43), `id="gbsSearch"` (line 66) → duplicate on same page
- **This IS PS-07** (pending fix in AuditRepo lane/fix-ps01-iife-scope, commit c1bd605) — not a new bug
- gbs2Ring, gbs2Pct, gbs2Meta use CLASS not ID → no HTML validity issue
- gbs2Toc, gbs2Sheet, gbs2Bbar, gbs2Curbar, gbs2MobSec, gbs2MobPct — used as class-based selectors

### Bug Count: 61 bugs (9 P0, 20 P1, 19 P2, 13 P3)

**Fixed in project source:** V2-2, V2-3, V2-4, PS-06, P3-NEW ✅
**Fixed in AuditRepo (pending merge):** PS-01, P0-10, PS-06, PS-07, P0-7, P0-8
**False positive closed:** P3-8
**Confirmed in current HEAD:** P2-17, P2-18, P3-12, P0-NEW, P1-13, P1-14/15/16, P0-3, P0-6

---

## Round 9 Amendments (2026-06-25)

**Source:** Current session continuation

### P0-NEW — SW precache 404 for site-layered.css + site-modules.js → ✅ FIXED IN PROJECT SOURCE

**Root cause confirmed:**
- `site-layered.css` exists at `/home/user/project/css/site-layered.css` — REFACTORING PILOT (Phase 2) — "duplicate of site.css, one-route refactor pilot". NOT imported in any Astro component → Astro build does NOT copy to `dist/`
- `site-modules.js` exists at `/home/user/project/js/site-modules.js` — REFACTORING EFFORT (Phase 3). Contains back-to-top.js module (already loaded separately). NOT imported in any Astro component → Astro build does NOT copy to `dist/`
- Both referenced in `sw.js` PRECACHE_ASSETS → 404 on all SW-enabled pages

**Fix applied:** Removed both from PRECACHE_ASSETS in `/home/user/project/sw.js`:
- `"/css/site-layered.css"` — removed ✅
- `"/js/site-modules.js"` — removed ✅

**P0-NEW RESOLVED** — no longer a 404 risk.

Note: This also resolves P0-7 and P0-8 as a side effect (same root cause: references to files not in dist).

### P1-5 — page-ownership.json vs route-migration-matrix.json conflict ✅ CONFIRMED

**Data conflict confirmed:**
- `page-ownership.json`: version 1, updated 2026-06-20, 53 routes, scope: all routes (build-time strangler manifest)
- `route-migration-matrix.json`: version 2026-06-23.non-excluded.v1, created 2026-06-23, 34 routes, scope: all-routes-except-nagornaya-gill-heart-hard-texts

**Discrepancy:**
- Common routes: 34
- Extra in page-ownership: 19 (nagornaya/seriya, nagornaya/chast-3, articles/krajne, articles/dzhon-gill-istoricheskiy-kontekst, articles/hermenevticheskaya-otsenka, articles/kod-da-vinchi, articles/dzhon-gill-chast-1-3, articles/dzhon-gill-spravochnik, articles/20-antisovetov-pastoru, articles/rimlyanam-7, hard-texts/ + 6 nagornaya pages)
- Extra in route-migration-matrix: 0

The page-ownership.json is a superset with different version/timing. These are two independent tracking systems with divergent data.

### P2-17 — AvraamMap pollutes global MapEngine singleton ✅ CONFIRMED (detailed)

**Detailed analysis:**
- IshodMap.astro: uses `MapEngine.createMap()` only — does NOT add anything to `window.MapEngine`
- AvraamMap.astro lines 31-32: adds `window.MapEngine.getPlaceVisual = function(pl) {...}` to global singleton
- AvraamMap's getPlaceVisual customizes 'lot' and 'cand' place type markers (land division and candidates)
- If AvraamMap loads FIRST, then IshodMap gets Avraam's getPlaceVisual (wrong marker colors)
- If IshodMap loads FIRST, AvraamMap's override is applied (only affects subsequent pages in same session)
- SW caching keeps both pages in browser cache → session pollution risk

**Fix direction:** Pass `getPlaceVisual` as `MapEngine.createMap(container, route, { getPlaceVisual: fn })` option instead of global pollution.

### P2-18 — MapEngine loadFromHash uses location.pathname ✅ CONFIRMED (detailed)

**Detailed analysis:** `location.pathname` on GitHub Pages with `base href="/repo/"` returns `/repo/karty/avraam/`. map-engine.js uses this for:
1. `loadFromHash()` — reads hash and sets active story/place
2. `updateHash()` — uses `history.replaceState(null, '', location.pathname + hash)` — base href not accounted for

The route.json uses relative paths for API calls. With base href, `fetch('route.json')` works (relative to page), but any navigation using `location.pathname` directly would fail.

### P3-12 — baseGeoUrl without cache-busting ✅ CONFIRMED

AvraamMap.astro: `baseGeoUrl: 'base.svg'` — no `?v=` hash. If base.svg changes, cached version persists.

### P1-13 — theme.js GBS2 wiring ✅ RECHECKED — NOT A BUG

Re-checked: site.js DOES handle `data-gbs2-theme` buttons via its GBS2 controls logic. Previous P1-13 entry (theme.js doesn't wire GBS2) was based on incomplete analysis. site.js has GBS2 controls handling at runtime. Only P1-14 (unwired GBS2 controls in Baptisty SeriesArticleLayout) remains.

**Status change:** P1-13 → NOT A BUG. site.js handles GBS2 theme at runtime. Only GBS2 controls in Baptisty (SeriesArticleLayout) remain unwired (P1-14/15/16).

### Bug Count: 61 bugs (9 P0, 20 P1, 19 P2, 13 P3)

P0-NEW resolved (removed from SW precache, not a structural bug). P0 count: 9→8.
Total: 61→60 bugs.

**Fixed in project source:** V2-2, V2-3, V2-4, PS-06, P3-NEW, P0-NEW ✅
**Fixed in AuditRepo (pending merge):** PS-01, P0-10, PS-06, PS-07, P0-7, P0-8
**False positive closed:** P3-8, P1-13 (recheck)
**Confirmed in current HEAD:** P2-17, P2-18, P3-12, P1-14/15/16, P0-3, P0-6, P1-5
