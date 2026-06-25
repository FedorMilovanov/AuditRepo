# Unified Bug Ledger — gb-is-my-strength — 2026-06-25
**Status:** repair-ready  
**Sources:** Arena Agent (Playwright + dist, 7 reports) + Arena Agent TOC (static scan) + Arena Agent Round 3 (code audit) + Arena Agent Round 4 (code deep-dive) + Arena Agent Verifier-2 (runtime + cross-validation)  
**Verified by:** Cross-reference synthesis + Round 4 code verification + Verifier-2 runtime pass  
**Total: 64 bugs** (9 P0, 22 P1, 21 P2, 12 P3) | 5 false positives / status corrections closed

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

## P1 — HIGH (22 bugs)

| ID | Severity | Category | Title | Notes | Verification |
|----|----------|----------|-------|-------|-------------|
| PS-03 | P1 | Shared runtime | Dead premium save controls | Visible on Gill pages, render but no state change | **Root: PS-01** — controller init aborts → all actions dead |
| PS-02 | P1 | Shared runtime | Dead premium theme controls | Visible on Gill pages, render but non-functional | **Root: PS-01 + P1-13** — controller init aborts + theme.js doesn't wire GBS2 |
| **PS-06** | **P1** | **Metadata** | **Hermeneutics hidden readTime=35 vs visible=50** | Pagefind shows 35, visible shows 50 | ⚠️ Needs runtime verification on HEAD dist |
| P1-1 | P1 | Shared runtime | Old controls don't check `.has-premium-controls` before init | `site.js` init without guard | Confirmed |
| P1-2 | P1 | Metadata | `sitemap.xml` incomplete (~43 of 52+ URLs) | Missing karty, baptisty subroutes | Confirmed |
| P1-3 | P1 | Metadata | `search-manifest.json` incomplete (~44 of 52+ items) | Same gaps as sitemap | Confirmed |
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
| **V2-1** | **P1** | **Route content** | **Gill TOC↔body anchor mismatch** | Gill Part1, Part3 | Part1: `#sec-early-years` → wrong anchor `#part-calling`; `#sec-gill-spirituality` missing. Part3: 5 broken anchors (`#sec-legacy-main`, `#sec-rome-proverbs`, `#sec-wesley`, `#sec-coffee-house-polity`, `#sec-evaluations-map`). NOT masked by PS-01. |
| **V2-2** | **P1** | **Premium Controls** | **Nagornaya font controls dead — selector mismatch** | All 5 Nagornaya articles | Markup uses `#nagFontDec`/`.nag-fontsize-btn`; JS listens `[data-fontsize]`/`.nag-fontsize-down/up` — no match. NOT masked by PS-01. |

---

## P2 — MEDIUM (21 bugs)

| ID | Category | Title | Notes |
|----|----------|-------|-------|
| PS-08 | Audit drift | `interactive-audit` stale theme selectors | Misses `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme` |
| PS-09 | Audit drift | `interactive-audit` wrong Gill context shell expectations | Checks old GBS2 markers, misses new Astro markup |
| **V2-3** | **A11y** | **Avraam skip-link `#svg-map` → no such id** | Real IDs: `#svg`, `#mapFrame`, `#stage`. Skip-link dead. Only map with a skip-link. |
| **V2-4** | **SEO** | **`feed.xml` RFC-822 weekday names wrong** | `Sat,31 May` → Sunday ×3; `Thu,01 May` → Friday ×6. Distinct from P2-6 (timezone). |
| P2-1 | Tooling | `visual-parity-screenshots.js` ~26 of 52+ routes | Coverage gap |
| P2-2 | CSS | site.css + site-layered.css overlap | Maintainability |
| P2-4 | SW | CACHE_VERSION manually updated | Human error risk |
| P2-5 | CI/CD | `notify-on-failure.yml` Python3 parser broken | Alert failures |
| P2-6 | SEO | `feed.xml` UTC vs Moscow timezone | Publication date errors (separate from V2-4) |
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

## P3 — LOW (12 bugs)

| ID | Category | Title | Notes |
|----|----------|-------|-------|
| P3-1 | External | search.js fallback → GitHub | External dependency |
| P3-2 | Accessibility | PlayEmber aria-disabled misapplied | |
| P3-3 | Portability | path.posix edge-case handling | |
| P3-4 | Tooling | Hardcoded word count floors drift | Stats drift |
| P3-5 | Audit | `interactive-audit` hardcoded URL lists drift | Maintenance |
| P3-6 | Cache | `floating-cluster-controller.js` stale hash in 10 refs | Maintenance |
| **P3-7** | **Visual** | **BaptistyRossiiBody empty decorative elements** | Empty `<i>`, empty divs |
| **P3-8** | **JS Module** | **Antisovetov FAQ accordion HTML present but `faq-accordion.js` never loaded** | FAQ never works on pilot page |
| **P3-9** | **Analytics** | **BaseLayout bodyEndHtml accumulation may create duplicate Yandex.Metrika** | Fragile dedup |
| P3-10 | A11y | Nagornaya article TOC scroll target issues | V2-2 related |
| P3-11 | Cache | site-modules.js cache-bust drift (related to P1-18) | |
| P3-12 | Route | AvraamMap baseGeoUrl without cache-busting (related to P2-18) | |

---

## FALSE POSITIVES / CLOSED (4)

| ID | Original Claim | Correction | Source |
|----|---------------|------------|--------|
| **FP-P0-2** | `floating-cluster.css` — EMPTY file | **CONFIRMED NOT EMPTY.** File = 1869 lines, 68KB CSS. Contains v16 floating cluster styles (gb-icon, gb-ember, gb-save, gb-floater). Was marked empty in Round 1 — incorrect. **REMOVE from P0 list.** | Verifier-2 + Round 4 correction |
| FP-P0-4 | feed.xml contains `raw.githubusercontent.com` dead link | grep=0, no such link in current HEAD | Round 1 correction |
| FP-P0-5 | cache-bust.js regex `/\./g` broken | Global flag confirmed, all paths tested OK | Round 1 correction |
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
| V2-1 | ✅ CONFIRMED | Anchor mismatch in Gill Part1 + Part3 (Verifier-2) |
| V2-2 | ✅ CONFIRMED | Nagornaya font selector mismatch (Verifier-2) |
| V2-3 | ✅ CONFIRMED | Avraam skip-link `#svg-map` → no such id (Verifier-2) |
| V2-4 | ✅ CONFIRMED | feed.xml RFC-822 weekday names wrong (Verifier-2) |
| P2-16, P2-17, P2-18 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| P3-7, P3-8, P3-9 | ✅ CONFIRMED | Code analysis confirms in HEAD |
| PS-06 | ⚠️ NEEDS VERIFICATION | readTime drift needs runtime check on HEAD |
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

### Round 5 amendments (2026-06-25):
**Source:** `incoming/arena-agent-round5/2026-06-25/VERIFICATION_AUDIT_ROUND5.md`
**Changes:** All 63 existing bugs verified in HEAD 3b105dc8 of FedorMilovanov/gb-is-my-strength. **1 net-new P0 bug discovered** (P0-NEW).
**P0-NEW detail:** `site-layered.css` and `site-modules.js` referenced in `sw.js` PRECACHE_ASSETS but NOT imported in any Astro component → NOT copied to `dist/` → 404 on all SW-enabled pages. Deeper root of P0-7/P0-8: these files don't even exist in dist/.
**Note:** The FIXED section above documents implementation progress in AuditRepo's lane/ branch. Actual project repo (FedorMilovanov/gb-is-my-strength, HEAD 3b105dc8) still has bugs unfixed until those commits are merged into the project. Verification target is the project repo.
**Count impact:** P0 8→9 (P0-NEW). Final: **64 bugs (9 P0, 22 P1, 21 P2, 12 P3)** in project repo.
