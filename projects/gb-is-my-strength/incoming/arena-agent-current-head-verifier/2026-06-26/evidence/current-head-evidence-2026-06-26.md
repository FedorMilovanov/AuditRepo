# Current HEAD verification evidence — 2026-06-26
## git
## main...origin/main
02e1a0ff docs: lane report cleanup-double-css-dead-files-2026-06-26

## Node/npm
v20.20.2
10.8.2

## validate:all

> gb-is-my-strength@1.6.3 validate:all
> npm run validate:strict && npm run seo-audit


> gb-is-my-strength@1.6.3 validate:strict
> node scripts/validate.js --strict


🔍  validate.js

  📁  css/
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 960px
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 500px
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 420px
  📁  js/
  📁  inline-scripts/
  📁  html-contracts/
  ✔  [html-contracts] Russian quote policy passed: no English direct quotes in reader-facing Russian text

  📄  20-antisovetov-pastoru
  ⚠️  [20-antisovetov-pastoru] <title> ≠ og:title\n           <title>: "20 антисоветов пастору: как разрушить служение"\n         og:title: "20 антисоветов, как пастору разрушить своё служение"

  📄  dzhon-gill-chast-1-chelovek

  📄  dzhon-gill-chast-2-uchenyi

  📄  dzhon-gill-chast-3-nasledie

  📄  dzhon-gill-istoricheskiy-kontekst

  📄  dzhon-gill-spravochnik

  📄  hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki

  📄  kod-da-vinchi

  📄  krajne-li-isporcheno-serdce

  📄  rimlyanam-7-veruyushchiy-ili-neveruyushchiy
  ⚠️  [rimlyanam-7-veruyushchiy-ili-neveruyushchiy] <title> ≠ og:title\n           <title>: "Римлянам 7: верующий или неверующий?"\n         og:title: "Римлянам 7: верующий, неверующий или человек под законом?"

  🗺  sitemap.xml + feed.xml

──────────────────────────────────────────────────
⚠️  Ошибок: 0  Предупреждений: 5
  → Предупреждения не прерывают workflow. Исправьте при возможности.


> gb-is-my-strength@1.6.3 seo-audit
> node scripts/seo-audit.js

❌ articles/20-antisovetov-pastoru/index.html: visible FAQ without FAQPage JSON-LD
❌ articles/krajne-li-isporcheno-serdce/index.html: visible FAQ without FAQPage JSON-LD

SEO audit failed: 2 errors, 0 warnings.

## audit-pro

══════════════════════════════════════════════════════════════════════════════
GB-IS-MY-STRENGTH — PROFESSIONAL AUDIT
2026-06-25T23:06:36.630Z · 3.50s
══════════════════════════════════════════════════════════════════════════════

Summary: ✅ 158 passed · ⚠️ 3 warnings · ❌ 28 errors · ℹ️ 10 info

── PASSED ──
✅ Structure: exactly 7 CSS files in /css
✅ Structure: exactly 11 JS files in /js
✅ Structure: fonts/fonts.css and nagornaya/tw.min.css exist
✅ JS total 360546 bytes within budget
✅ site.css size 282788 bytes ≥ floor 200000 (anti-deletion guard)
✅ site.css !important within ratchet ceiling: 202 ≤ 202 (long-term goal 200)
✅ css/site.css: braces balanced
✅ css/home.css: braces balanced
✅ css/command-palette.css: braces balanced
✅ css/mobile-hotfix.css: braces balanced
✅ css/site-layered.css: braces balanced
✅ css/floating-cluster.css: braces balanced
✅ css/nagornaya-mobile-toc.css: braces balanced
✅ Dove markers: no dead inline fn-dove-icon SVG in HTML
✅ Dove markers: every fn-marker--dove has tooltip or data-tip content
✅ JS syntax valid (18 files)
✅ Inline script syntax valid (114 blocks)
✅ Quiz source schema is canonical across HTML pages
✅ OpenGraph / article singleton meta uniqueness passed
✅ SITE_CONFIG runtime contract passed across HTML pages
✅ JSON valid (85 files)
✅ HTML span balance: all files balanced
✅ SEO basics passed (52 HTML files)
✅ JSON-LD parse passed (73 blocks)
✅ Russian quote policy passed: no English direct quotes in reader-facing Russian text
✅ Attribution guard passed: Фёдор is not marked as author
✅ Local resources and internal links valid (2454 refs checked)
✅ No duplicate IDs
✅ All images have alt attributes
✅ manifest.json essentials valid
✅ SW CACHE_VERSION
✅ SW install event
✅ SW activate event
✅ SW fetch event
✅ SW skipWaiting
✅ SW clients.claim
✅ SW cache cleanup
✅ SW precache references existing repo files (31 URLs, pagefind skipped)
✅ search-manifest URLs valid (44 items)
✅ Nagornaya series structure checked
✅ CNAME is gospod-bog.ru
✅ robots.txt present
✅ sitemap.xml covers HTML pages (43 loc entries)
✅ feed.xml present
✅ Security hygiene passed (no repo path leaks / eval)
✅ deploy.yml present
✅ notify-on-failure.yml present — failures will open/update GitHub issue
✅ No garbage files (*.py / *.patch / *.bak / *.orig / *.rej / uploads/ / OS turds) anywhere in repo
✅ Image size hygiene: no PNG/JPG > 684 KB in /images/ (allowlist: 0)
✅ Series consistency: 5 series in series.json, all published parts exist on disk
✅ Series landing pages: no cross-series contamination
✅ /articles/ catalog: 7 cards, no duplicates
✅ Unified header: all pages with h-nav-links contain the canonical 5-item set
✅ Nav semantics: no <button> inside <ul class="h-nav-links">
✅ /hard-texts/ landing: all 3 article links are members of the series
✅ Hashed asset URLs: every ?v=… reference resolves to an existing file
✅ .gitignore covers npm/node_modules/OS turds
✅ article-topnav stays buried (AGENTS §9.8)
✅ Dead classes stay dead (5 guarded)
✅ No AI-disclosure spans inside <figcaption>
✅ OG/Twitter meta: no duplicates across pages (checked: og:image, og:title, og:url, og:description, twitter:image, og:type)
✅ All <source srcset> tags wrapped in <picture>
✅ Listener syntax: no broken function(, {…}) patterns
✅ Inline scripts: none larger than 500 LOC except known/guarded map app debt
✅ @keyframes integrity: all blocks have valid stops
✅ sw.js CACHE_VERSION="gb-v176-floating-cluster-gill-all-20260625" looks sane
✅ sitemap.xml: all 43 lastmod dates ≤ today
✅ Single <h1> per page: all content pages have exactly one
✅ Mixed-content: no http:// href/src (web.archive.org & w3.org whitelisted)
✅ target="_blank" links: all carry rel="noopener"
✅ Anchor href values: no href="javascript:…" and no truly-bare href="#"
✅ All content pages have <html lang="…">
✅ Anchors: every <a> has visible text / aria-label / alt
✅ Buttons: every icon-only <button> carries aria-label
✅ Tabindex hygiene: no positive tabindex values
✅ Image references: every src/srcset URL resolves to an existing file
✅ Canonical URLs: present + unique + match own page (51 pages)
✅ Viewport: user zoom allowed on all pages (no user-scalable=no / maximum-scale=1)
✅ No inline event handlers (onclick/onload/…) in HTML — CSP-safe
✅ <meta charset> appears in first 1KB of every page
✅ sw.js precache: every referenced asset exists (27 checked, pagefind/ skipped)
✅ CSP img-src covers every external <img> host found in HTML
✅ feed.xml lastBuildDate is 0 days old (fresh)
✅ JSON-LD shape: every block has valid @context (schema.org) and @type/@graph
✅ Meta descriptions: all ≤ 300 chars (Russian-friendly cap)
✅ JS bundle ratchet OK (6 files watched)
✅ innerHTML hygiene: no untrusted-source assignments (location/cookie/input/fetch/storage)
✅ JSON-LD url fields all match their page canonical
✅ All <link rel="preload" as="image"> resources are actually rendered
✅ CSS vendor prefixes: no dead-since-2015 prefixes present
✅ Article JSON-LD: every /articles/*/ has exactly 1 with headline+datePublished+image
✅ <meta theme-color>: light+dark variants present on every content page
✅ fetchpriority="high": at most 1 unique resource per page (LCP-friendly)
✅ feed.xml: all article references exist on disk
✅ sitemap.xml ↔ feed.xml: article URLs aligned
✅ manifest.json: all required fields present, 4 icons all exist
✅ <html lang>: every page is declared Russian (ru/ru-RU)
✅ RSS alternate consistent: every page → https://gospod-bog.ru/feed.xml
✅ <img> dimensions: every content image has width+height (no CLS surprise)
✅ CSS @import: none in main stylesheets (no serial blocker)
✅ robots.txt: allows crawl, lists sitemap
✅ CNAME matches canonical host: gospod-bog.ru
✅ og:image: every meta-tag URL resolves to a real file
✅ CSS uses design tokens — no bare named colors (red/blue/etc.)
✅ GitHub workflows: every file has permissions; deploy workflows have concurrency
✅ Internal links: every directory href ends with "/" (no 301 redirect hop)
✅ Series landings: all in sitemap.xml
✅ Cache-bust hashes: all ?v=… in valid 6-12 hex format
✅ Portrait images: all 9:16/2:3 figures use article-img--vertical class
✅ Article images: every <figure article-img> carries a <figcaption>
✅ Series-strip placement: appears before summary-card on every series article
✅ Image alt text: no "image of…" / filename / too-short patterns
✅ srcset width descriptors match filename hints (Xw matches -Xw.ext)
✅ Speakable: data-speakable HTML and SpeakableSpecification JSON-LD consistent
✅ Animations: every file with timed motion has prefers-reduced-motion coverage
✅ BreadcrumbList JSON-LD: every article and series-landing has it (14 pages)
✅ Article dates: dateModified ≥ datePublished everywhere
✅ Article JSON-LD: every author has @id reference to /about/#person
✅ Image loading attribute: no above-fold images marked loading="lazy"
✅ GitHub workflows: every `uses:` action pinned to a version tag or SHA
✅ Reading-time series.json ↔ HTML: no severe drift (>20 min)
✅ Preloaded fonts: every <link rel="preload" as="font"> resolves
✅ llms.txt: all 25 referenced URLs exist and are indexable
✅ sitemap.xml: all 43 image:loc URLs resolve
✅ Yandex.Metrika: every page has BOTH ym() init AND <noscript> tracker pixel
✅ No protocol-relative //path URLs
✅ <picture>: every element has an <img> fallback child
✅ JSON-LD images: every image/logo/contentUrl resolves to a real file
✅ <head> integrity: no body-only tags inside <head>
✅ Body/html overflow-x sentinel intact (no mobile sideways scroll possible)
✅ Inline widths: no fixed ≥320px without max-width safeguard
✅ Touch-target sizing: 7 icon buttons ≥44×44 on coarse pointer
✅ Mobile menu: every burger button has #hMobileNav + #hMobileBackdrop wired
✅ Sticky/fixed elements: bottom-bar overlap protection in place
✅ No orphan images: every file in /images/ is referenced somewhere
✅ Source tooltips: no nested fn-marker/tooltip markup
✅ External source hosts: no known SSL-bad blocked hosts
✅ Data files (feed.xml/manifest.json/llms.txt/search-manifest): all referenced assets exist
✅ AGENTS-r257 numeric claim (164 passed) matches audit (~159 R.ok)
✅ Summary cards: no active glossary terms/tooltips inside
✅ Glossary runtime skips summary-card hydration
✅ Quiz mount contract: enabled quizzes have #quizPlaceholder
✅ Interactive controls: no anchors/buttons nested inside buttons
✅ Article meta: every og:type=article page has article:author
✅ 404.html meta: canonical + image alt tags present
✅ Search shortcuts: Ctrl/⌘+F stays native; Ctrl/⌘+K is case-insensitive
✅ GBS world integrity: 18 pages carry full kit, zero legacy series UI
✅ Article word-count floors: 10 articles above minimum thresholds
✅ Home page main content is pagefind-indexable
✅ Home page includes h-mobile-hero-hub first-screen library chooser
✅ Home page includes mobile dashboard quick-start block
✅ Home page includes h-mobile-rail quick-jump navigation
✅ Home page includes h-mobile-paths guided reading section
✅ Home page includes h-mobile-dock bottom quick actions
✅ Home mobile dashboard has 4 quick-start cards
✅ Home mobile dashboard includes required quick-start links
✅ Home guided reading section has 6 path cards
✅ Home mobile dock includes core targets

── WARNINGS (3) ──
⚠️ Core CSS total 504391 bytes exceeds budget 425000
⚠️ CSS variables used bare without fallback and never defined:
  - css/floating-cluster.css: var(--gb-accent-strong) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-ease-out) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-ease-spring) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-accent) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-font-serif-display) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-accent-gold) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-accent-gold-bright) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-font-serif) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-font-sans) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-border) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-text) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-text-muted) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--z-sheet) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-surface) — no fallback, not defined, not in externals
  - css/floating-cluster.css: var(--gb-ease-overshoot) — no fallback, not defined, not in externals
⚠️ Magic z-index numbers (use design tokens):
  - css/floating-cluster.css: z-index: 10 (use --z-* token; see AGENTS-r33)

── ERRORS (28) ──
❌ Cache-bust mismatch: articles/20-antisovetov-pastoru/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/dzhon-gill-chast-1-chelovek/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/dzhon-gill-chast-2-uchenyi/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/dzhon-gill-chast-3-nasledie/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/dzhon-gill-istoricheskiy-kontekst/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/dzhon-gill-spravochnik/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/kod-da-vinchi/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/krajne-li-isporcheno-serdce/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/dva-sezda-1884/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/goneniya-i-sovest/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/iniciativnaya-gruppa/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/noch-na-kure/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/peterburgskaya-liniya/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/podpolnaya-pechat/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/sovetskaya-noch/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/spravochnik/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/vsehib-1944/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: baptisty-rossii/yuzhnaya-shtunda/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: nagornaya/chast-1/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: nagornaya/chast-2/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: nagornaya/chast-3/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: nagornaya/chast-4/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ Cache-bust mismatch: nagornaya/chast-5/index.html → js/floating-cluster-controller.js?v=5c91b618, expected ba4a4019
❌ sitemap.xml lists pages marked noindex (search engines distrust the sitemap):
  - rodosloviye/index.html — robots="noindex, follow, max-snippet:-1, max-image-preview:large" but listed in sitemap
❌ Unexpected noindex (owner asked for maximum openness 2026-06-09):
  - rodosloviye/index.html: robots="noindex, follow, max-snippet:-1, max-image-preview:large" (owner wants max SEO openness; add to NOINDEX_ALLOWLIST only if you really mean it)
❌ sw.js PRECACHE_ASSETS missing live files:
  - /css/site-layered.css
  - /js/series-cards.js
  - /js/site-modules.js

── INFO ──
ℹ️ Gzip wire size: CSS 154192 bytes, JS 100233 bytes, total 254425 bytes
ℹ️ Route-scoped CSS: css/site-layered.css, nagornaya/tw.min.css = 316925 bytes
ℹ️ site.css !important debt remains 2 above long-term goal; current ceiling is hard-ratcheted to 202
ℹ️ CSS dead vars: 29 unused (acceptable; clean when convenient)
ℹ️ SITE_CONFIG.version uses placeholder (1) on 1 pages — fine but could be Unix timestamp
ℹ️ SVG dedup opportunity: 12 icon patterns shared across ≥5 files
ℹ️ color-mix() usage: 276 occurrences (Safari ≥ 15.2 supports; older browsers need fallback)
ℹ️ CSS dead-class heuristic: 145 possibly-unused (runtime state classes excluded; manual review)
ℹ️ AGENTS.md changelog: 64 rows (under 100, healthy)
ℹ️ og:image differs from LCP-priority image (consider aligning for social-share consistency):
  - articles/20-antisovetov-pastoru/index.html: og:image=og-20-antisovetov-pastoru, but LCP-priority images are: mirror
  - articles/kod-da-vinchi/index.html: og:image=og-kod-da-vinchi, but LCP-priority images are: hero-kod-da-vinchi
  - articles/krajne-li-isporcheno-serdce/index.html: og:image=og-krajne-isporcheno, but LCP-priority images are: ieremia-judea-fall
  - index.html: og:image=og-preview-1200x630, but LCP-priority images are: og-nagornaya-propoved
  - pastor-series/index.html: og:image=og-hero, but LCP-priority images are: hero-main

❌ AUDIT FAILED — fix errors before deploy
══════════════════════════════════════════════════════════════════════════════

Report saved: audit/audit-pro-2026-06-25T23-06-36-634Z.md

## content:guard

> gb-is-my-strength@1.6.3 content:guard
> node scripts/check-public-content-baseline.js

❌ Public content baseline failed:
  - missing URL: https://gospod-bog.ru/rodosloviye/ (rodosloviye/index.html)

## strict metadata + native runtime audit

> gb-is-my-strength@1.6.3 migration:metadata:check:strict
> npm run route:profiles:check -- --strict && npm run migration:matrix:check -- --strict && npm run content:sources:check -- --strict


> gb-is-my-strength@1.6.3 route:profiles:check
> node scripts/check-route-profiles.js --strict

=== Route Profiles Check ===
Mode: STRICT

Routes checked: 51
Profiles found: 51

✅ Route profiles coherent with page ownership

> gb-is-my-strength@1.6.3 migration:matrix:check
> node scripts/check-route-migration-matrix.js --strict

=== Route Migration Matrix Check ===
Mode: STRICT

Routes checked against matrix: 34
Matrix entries: 34

✅ Route migration modes are coherent with matrix

> gb-is-my-strength@1.6.3 content:sources:check
> node scripts/check-content-source-coverage.js --strict

=== Content Source Coverage Check ===
Mode: STRICT

Series parts checked: 23
Routes checked: 51
MDX files: 20
Profiles: 53
Search items: 44

✅ Content source coverage is coherent

> gb-is-my-strength@1.6.3 native:runtime:audit:strict
> node scripts/native-runtime-taxonomy-audit.js --strict

=== Native Runtime Taxonomy Audit ===
Mode: STRICT
Routes: 52

| Category | Count | % | Meaning |
|---|---:|---:|---|
| strict-native | 51 | 98.1% | no legacy loader/raw/set:html transport in route closure |
| native-with-legacy-head | 0 | 0.0% | native body/chrome, but legacy head/body attrs remain |
| native-main-with-legacy-chrome | 0 | 0.0% | native semantic main with legacy chrome/head transport |
| hybrid-raw-segments | 0 | 0.0% | ?raw/_legacy/body-segment transport remains in route closure |
| full-body-shadow | 0 | 0.0% | legacy bodyHtml emitted into Astro route |
| legacy-shadow-app-intentional | 1 | 1.9% | interactive/map/built app intentionally shadowed |

Examples (use --details for full route list):
- strict-native: /, /about/, /articles/, /articles/20-antisovetov-pastoru/, /articles/dzhon-gill-chast-1-chelovek/, /articles/dzhon-gill-chast-2-uchenyi/, /articles/dzhon-gill-chast-3-nasledie/, /articles/dzhon-gill-istoricheskiy-kontekst/, /articles/dzhon-gill-spravochnik/, /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/, /articles/kod-da-vinchi/, /articles/krajne-li-isporcheno-serdce/ … +39
- native-with-legacy-head: —
- native-main-with-legacy-chrome: —
- hybrid-raw-segments: —
- full-body-shadow: —
- legacy-shadow-app-intentional: /konfessii/russkij-baptizm/_app/

✅ native runtime taxonomy completed

## FAQPage brittle check evidence
3- * SEO/AEO/GEO audit for gospod-bog.ru
4- *
5- * Checks production canonical consistency, social cards, JSON-LD publisher graph,
6: * FAQPage parity, sitemap image extensions, and AI bot robots policy.
7- *
8- * Run:
9- *   node scripts/seo-audit.js
--
148-
149-  const faq = extractFaq(html);
150-  if (faq.length) {
151:    if (!html.includes('"@type": "FAQPage"')) err(file, 'visible FAQ without FAQPage JSON-LD');
152-    for (const item of faq) {
153-      if (item.words < 60) warn(file, `FAQ answer too short (${item.words} words): ${item.q}`);
154-      if (item.words > 220) warn(file, `FAQ answer too long (${item.words} words): ${item.q}`);
articles/20-antisovetov-pastoru/index.html
  contains exact old needle: False
  regex FAQPage count: 1
articles/krajne-li-isporcheno-serdce/index.html
  contains exact old needle: False
  regex FAQPage count: 1

## rodosloviye conflict evidence
rodosloviye/index.html:11:  <meta name="robots" content="noindex, follow, max-snippet:-1, max-image-preview:large">
rodosloviye/index.html:13:  <link rel="canonical" href="https://gospod-bog.ru/rodosloviye/">
rodosloviye/index.html:14:    <link rel="alternate" hreflang="ru" href="https://gospod-bog.ru/rodosloviye/">
rodosloviye/index.html:15:    <link rel="alternate" hreflang="x-default" href="https://gospod-bog.ru/rodosloviye/">
rodosloviye/index.html:20:  <meta property="og:url" content="https://gospod-bog.ru/rodosloviye/">
rodosloviye/index.html:38:  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://gospod-bog.ru/#organization","name":"Господь Бог — Сила Моя","url":"https://gospod-bog.ru/","logo":{"@type":"ImageObject","url":"https://gospod-bog.ru/icons/icon-512.png","width":512,"height":512},"sameAs":["https://t.me/fedormilovanov","https://vk.com/curtmf"]},{"@type":"WebSite","@id":"https://gospod-bog.ru/#website","name":"Господь Бог — Сила Моя","url":"https://gospod-bog.ru/","inLanguage":"ru","publisher":{"@id":"https://gospod-bog.ru/#organization"},"potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://gospod-bog.ru/?q={search_term_string}"},"query-input":"required name=search_term_string"}},{"@type":"WebPage","@id":"https://gospod-bog.ru/rodosloviye/#webpage","url":"https://gospod-bog.ru/rodosloviye/","name":"Родословие от Адама до Христа","description":"Интерактивное генеалогическое древо от Адама до Христа: библейские родословия, хронология, возрасты патриархов и мессианская линия.","inLanguage":"ru","isPartOf":{"@id":"https://gospod-bog.ru/#website"},"breadcrumb":{"@id":"https://gospod-bog.ru/rodosloviye/#breadcrumb"}},{"@type":"BreadcrumbList","@id":"https://gospod-bog.ru/rodosloviye/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Главная","item":"https://gospod-bog.ru/"},{"@type":"ListItem","position":2,"name":"Родословие","item":"https://gospod-bog.ru/rodosloviye/"}]}]}</script>
rodosloviye/index.html:64:      <p><a class="btn btn-primary" href="/rodosloviye/">Открыть родословие</a> <a class="btn" href="/karty/">К разделу карт и инструментов</a></p>
rodosloviye/index.html:71:    page: { type: 'page', id: 'rodosloviye', title: 'Родословие от Адама до Христа', section: 'Библейские инструменты' },
sitemap.xml:351:  <url><loc>https://gospod-bog.ru/rodosloviye/</loc><lastmod>2026-06-18T00:00:00+03:00</lastmod><changefreq>monthly</changefreq><priority>0.7</priority><image:image><image:loc>https://gospod-bog.ru/images/og-karty-1200x630.webp</image:loc><image:title>Родословие от Адама до Христа</image:title></image:image></url>
data/public-content-baseline.json:301:      "file": "rodosloviye/index.html",
data/public-content-baseline.json:302:      "url": "https://gospod-bog.ru/rodosloviye/",

## public text corruption evidence
src/components/article-pilots/antisovetov/AntisovetovBody.astro:695:<p class="mb-6">Безопасное извинение звучит общо: «если кого-то ранил», «мы все несовершенны». В нём нет имени конкретного греха и пострадавших душ. Это не покаяние — это мягкая смена освещения на сцене. Если обвинения слишком доказаны — стань «мучеником»: «На служителей всегда идут атаки дьявола». Ответственность превращается в гонение, а проверка фактов — в нападение на дело Божье. Настоящая сломленность не прос�тематическом искажении фактов перед общиной. Он выходит на кафедру, пускает слезу и произносит: «Братья, я признаю, что вкралась досадная неточность в коммуникации из-за моей усталости. Прошу прощения, если это кого-то смутило». Зал аплодирует его смирению. Никаких кадровых изменений не происходит, пострадавшие остаются виноватыми, через время ложь повторяется.</p>
src/components/article-pilots/hermenevtika/HermenevtikaBody.astro:309: "Евреям 9:1–13": "Итак и первый завет имел постановления о богослужении, и святилище принадлежащее к этому миру. Ибо устроена была скиния первая, в которой были и светильник, и стол, и хлебы предложения: она называется \"Святое\". А за второй завесой скиния, называемая , .Святое Святых\", имеющая золотой кадильный жертвенник и ковчег завета, обложенный со всех сторон золотом, и в нем сосуд золотой с манной, и жезл Аарона расцветший и скрижали завета, а над ним херувимы славы, осеняющие очистилище, о чём не время говорить подробно. При таком устройстве, в первую скинию постоянно входят священники, совершая служение, но во вторую - один раз в год только первосвященник не без крови, которую он приносит за себя и за грехи неведения народа. Этим Дух Святой показывает, что еще не открыт путь во святилище, пока существует первая скиния. Она есть притча для настоящего времени, согласно которой приносятся дары и жертвы, не могущие сделать в совести совершенным воздающего служение Богу: это только предписания, относящиеся к плоти, с яствами и питиями и различными омовениями, наложенные до времени исправления. Христос же, придя, как Первосвященник будущих благ, чрез большую и совершеннейшую скинию, нерукотворенную, то есть не этого творения, и не чрез кровь козлов и тельцов, но чрез собственную кровь, - вошел раз навсегда во святилище, приобретя вечное искупление. Ибо, если кровь козлов и быков и пепел телицы окроплением осквернённых освящает к чистоте плоти, -",
src/components/article-pilots/hermenevtika/HermenevtikaBody.astro:360: "1 Коринфянам 15:12–14": "Если же о Христе проповедуется, что Он восстал из мёртвых, - кик говорят некоторые между вами, что нет воскресения мёртвых? Если же нет воскресения мёртвых, - то и Христос не восстал; а если Христос не восстал, тщетна наша проповедь, тщетна и вера ваша.",
articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html:884: "Евреям 9:1–13": "Итак и первый завет имел постановления о богослужении, и святилище принадлежащее к этому миру. Ибо устроена была скиния первая, в которой были и светильник, и стол, и хлебы предложения: она называется \"Святое\". А за второй завесой скиния, называемая , .Святое Святых\", имеющая золотой кадильный жертвенник и ковчег завета, обложенный со всех сторон золотом, и в нем сосуд золотой с манной, и жезл Аарона расцветший и скрижали завета, а над ним херувимы славы, осеняющие очистилище, о чём не время говорить подробно. При таком устройстве, в первую скинию постоянно входят священники, совершая служение, но во вторую - один раз в год только первосвященник не без крови, которую он приносит за себя и за грехи неведения народа. Этим Дух Святой показывает, что еще не открыт путь во святилище, пока существует первая скиния. Она есть притча для настоящего времени, согласно которой приносятся дары и жертвы, не могущие сделать в совести совершенным воздающего служение Богу: это только предписания, относящиеся к плоти, с яствами и питиями и различными омовениями, наложенные до времени исправления. Христос же, придя, как Первосвященник будущих благ, чрез большую и совершеннейшую скинию, нерукотворенную, то есть не этого творения, и не чрез кровь козлов и тельцов, но чрез собственную кровь, - вошел раз навсегда во святилище, приобретя вечное искупление. Ибо, если кровь козлов и быков и пепел телицы окроплением осквернённых освящает к чистоте плоти, -",
articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html:935: "1 Коринфянам 15:12–14": "Если же о Христе проповедуется, что Он восстал из мёртвых, - кик говорят некоторые между вами, что нет воскресения мёртвых? Если же нет воскресения мёртвых, - то и Христос не восстал; а если Христос не восстал, тщетна наша проповедь, тщетна и вера ваша.",

## MDX concatenation debt evidence
src/content/articles/dzhon-gill-chast-1-chelovek.mdx:50:Это важный факт для биографии: Гилл вырос не в англиканской умеренности, не в просветительской рациональности, а в среде Особых баптистовОсобые, или партикулярные, баптисты (*Particular Baptists*) — английские кальвинистские баптисты, подчёркивавшие личное избрание, особое искупление Христом Своего народа, действенную благодать и окончательное устояние святых. Риппон приводит сходное определение из правил Фонда партикулярных баптистов. — тех, кто исповедовал личное избрание, особое искупление, действенную благодать. Когда позже Гилл будет защищать Троицу против унитаристов, писать *The Cause of God and Truth* против арминианства, создавать первое систематическое богословие баптистов — он будет защищать не заимствованные догмы, а собственную духовную почву.
src/content/articles/dzhon-gill-chast-3-nasledie.mdx:75:В **1736 году** Гилл подвергся атаке с другой стороны: некий Иов Бёрт (Job Burt) выпустил анонимный памфлет «Некоторые доктрины супралапсарианскойСупралапсарианство — порядок богословских декретов, в котором избрание и отвержение рассматриваются логически до Божьего постановления допустить грехопадение. Сублапсарианство помещает избрание после постановления о грехопадении. Гилл не любил превращать этот порядок в центр проповеди. схемы рассмотрены» (*Some Doctrines in the Supralapsarian Scheme Examined*). Гилл разоблачил аргументы и при этом отверг саму втянутость в этот супра-/сублапсарианский спор — он считал его слишком спекулятивным. Примечательно, что Гилл знал имя Бёрта, но называл его «учёным» — пример полемической сдержанности.
src/content/articles/krajne-li-isporcheno-serdce.mdx:52:Иеремия служил в последние десятилетия Иудейского царства. После битвы при КархемишеБитва при Кархемише (605 г. до н.э.): вавилонский царь Навуходоносор II разгромил египтян и их ассирийских союзников на берегах Евфрата. После этой победы Вавилон стал господствующей силой на Ближнем Востоке. Иудея оказалась в его подчинении, что привело к депортациям 597 г. и разрушению Иерусалима в 587/586 г. до н.э. (605 до н.э.) Вавилон стал доминирующей силой; Иудея превратилась в вассала, а затем пережила кризисы 597 и 587/586 годов, завершившиеся разрушением Иерусалима. Пророчество Иеремии — не отвлечённое рассуждение о человеке, а пророческое слово к народу на краю катастрофы — к народу, который *сохранил религиозные формы*, но внутренне давно ушёл от Бога.
src/content/articles/krajne-li-isporcheno-serdce.mdx:134:Здесь требуется максимальная аккуратность — и богословская, и пастырская. **Первичный смысл** Иер. 17:9 — описание падшего, отвратившегося от Господа сердца; в контексте главы это сердце, которое предпочитает доверие плоти доверию Богу. В этом смысле стих прямо описывает человека вне обновляющей благодати. Гейдельбергский катехизисРеформатский катехизис 1563 г. (Гейдельберг, Германия), составленный Захарием Урсином и Каспаром Олевианом. 129 вопросов-ответов в трёхчастной схеме: «вина» — «освобождение» — «благодарность». Один из трёх символических книг реформатских церквей наряду с Бельгийским исповеданием и Дордрехтскими канонами. формулирует тот же диагноз: падшая природа «совершенно неспособна к какому-либо добру и склонна ко всякому злу».12 Гейдельбергский катехизис. Вопрос 8. Это не приговор для верующего — это точка отсчёта, от которой начинается исцеление благодатью.
src/content/articles/krajne-li-isporcheno-serdce.mdx:196:**Есть ли плоть у неверующего?** Да — и только она. До возрождения человек есть целиком плоть в этом смысле: его воля, разум, чувства и поклонение ориентированы от Бога. Гейдельбергский катехизисРеформатский катехизис 1563 г. (Гейдельберг, Германия), составленный Захарием Урсином и Каспаром Олевианом. 129 вопросов-ответов в трёхчастной схеме: «вина» — «освобождение» — «благодарность». Один из трёх символических книг реформатских церквей наряду с Бельгийским исповеданием и Дордрехтскими канонами. говорит прямо: падший человек «совершенно неспособен к какому-либо добру и склонён ко всякому злу» (В. 8). Это не означает, что неверующий не способен ни на что достойное в человеческих отношениях — но в отношении Бога, в движении к Нему, его сердце мертво (Еф. 2:1). Иер. 17:9 («сердце обманчиво более всего») описывает именно это состояние как исходное.
src/content/articles/krajne-li-isporcheno-serdce.mdx:202:**Что такое новая природа — и когда она появляется?** Новая природа — это не «улучшенная версия» старой и не отдельный «отсек» внутри человека. Это новое начало, вложенное Духом Святым при возрождении: новое сердце (Иез. 36:26), написанный внутри закон (Иер. 31:33), новая склонность к Богу, которой прежде не было. Гейдельбергский катехизисРеформатский катехизис 1563 г. (Гейдельберг, Германия), составленный Захарием Урсином и Каспаром Олевианом. 129 вопросов-ответов в трёхчастной схеме: «вина» — «освобождение» — «благодарность». Один из трёх символических книг реформатских церквей наряду с Бельгийским исповеданием и Дордрехтскими канонами. описывает это как «оживание нового человека» — «сердечная радость о Боге во Христе и желание жить по воле Его» (В. 90). Это не постепенный процесс воспитания, а мгновенное действие Бога: регенерация, которая затем раскрывается в прогрессивном освящении.

## shipped/dead asset contract evidence
1:var CACHE_VERSION="gb-v176-floating-cluster-gill-all-20260625",CACHE_STATIC=CACHE_VERSION+"-static",CACHE_CONTENT=CACHE_VERSION+"-content",CACHE_IMAGES=CACHE_VERSION+"-images",CACHE_PAGEFIND=CACHE_VERSION+"-pagefind",PRECACHE_ASSETS=["/css/site.css","/css/home.css","/css/command-palette.css","/css/mobile-hotfix.css","/css/nagornaya-mobile-toc.css","/css/floating-cluster.css","/fonts/fonts.css","/nagornaya/tw.min.css","/js/site.js","/js/site-utils.js","/js/scroll-perf.js","/js/search.js","/js/highlights.js","/js/bookmark-engine.js","/js/enhancements.js","/js/sw-register.js","/js/nagornaya-mobile-toc.js","/js/glossary.js","/js/floating-cluster-controller.js","/manifest.json","/favicon.ico","/favicon-48.png","/apple-touch-icon.png","/404.html","/pagefind/pagefind.js","/data/search-manifest.json"];function isPagefindData(t){return t.pathname.startsWith("/pagefind/fragment/")||t.pathname.startsWith("/pagefind/index/")}function isPagefindStatic(t){return t.pathname.startsWith("/pagefind/")&&!isPagefindData(t)}function isStaticAsset(t){return/\.(css|js|json|woff2?|ttf|otf|ico|svg|webmanifest)(\?|$)/.test(t.pathname)||t.pathname.startsWith("/icons/")}function isHtmlPage(t){return"navigate"===t.mode||"GET"===t.method&&t.headers.get("accept")&&t.headers.get("accept").includes("text/html")}function isImage(t){return/\.(jpg|jpeg|webp|avif|gif|png)(\?|$)/.test(t.pathname)}function isFont(t){return!(t.origin!==self.location.origin||!t.pathname.startsWith("/fonts/"))||"fonts.gstatic.com"===t.hostname}self.addEventListener("install",function(t){t.waitUntil(caches.open(CACHE_STATIC).then(function(t){return Promise.allSettled(PRECACHE_ASSETS.map(function(e){return t.add(e).catch(function(t){console.warn("[SW] Failed to precache:",e,t)})}))}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(t){var e=[CACHE_STATIC,CACHE_CONTENT,CACHE_IMAGES,CACHE_PAGEFIND];t.waitUntil(caches.keys().then(function(t){return Promise.all(t.filter(function(t){return-1===e.indexOf(t)}).map(function(t){return caches.delete(t)}))}).then(function(){return self.clients.claim()}))});var IMG_CACHE_LIMIT=60,PAGEFIND_CACHE_LIMIT=50,CONTENT_CACHE_LIMIT=30,CACHE_METADATA=new Map;function updateMetadata(t){CACHE_METADATA.set(t,Date.now())}function trimCache(t,e){return t.keys().then(function(n){if(n.length<=e)return Promise.resolve();var a=n.sort(function(t,e){return(CACHE_METADATA.get(t.url)||0)-(CACHE_METADATA.get(e.url)||0)}),i=n.length-e;return Promise.all(a.slice(0,i).map(function(e){return CACHE_METADATA.delete(e.url),t.delete(e)}))})}function cacheFirst(t,e){var n=e===CACHE_IMAGES,a=/[?&]v=/.test(t.url);return caches.open(e).then(function(e){return e.match(t).then(function(i){return i?(updateMetadata(t.url),i):fetch(t).then(function(a){return a&&200===a.status&&"opaque"!==a.type?e.put(t,a.clone()).then(function(){if(n)return trimCache(e,IMG_CACHE_LIMIT)}).catch(function(t){if("QuotaExceededError"===t.name||22===t.code)return trimCache(e,Math.floor(IMG_CACHE_LIMIT/2))}).then(function(){return a}):a}).catch(function(){return function(e){if(!a)return Promise.resolve(void 0);var n=new URL(t.url);return n.search="",e.match(n.pathname)}(e).then(function(e){if(e)return e;throw new Error("[SW] cacheFirst miss and network failed: "+t.url)})})})})}function staleWhileRevalidate(t,e){return caches.open(CACHE_CONTENT).then(function(n){return n.match(t).then(function(a){var i=fetch(t).then(function(e){return e&&200===e.status&&n.put(t,e.clone()).then(function(){return trimCache(n,CONTENT_CACHE_LIMIT)}).catch(function(){}),e}).catch(function(){return a&&updateMetadata(t.url),a||caches.match("/404.html")});return a&&e&&e.waitUntil&&e.waitUntil(i.then(function(){}).catch(function(){})),a||i})})}function networkFirst(t){return fetch(t).catch(function(){return caches.match(t).then(function(e){return e&&updateMetadata(t.url),e||caches.match("/404.html")})})}function networkFirstWithCache(t,e){return caches.open(e).then(function(e){return fetch(t).then(function(n){return n&&200===n.status&&"opaque"!==n.type&&e.put(t,n.clone()).then(function(){return trimCache(e,PAGEFIND_CACHE_LIMIT)}).catch(function(){}),n}).catch(function(){return e.match(t).then(function(e){return e&&updateMetadata(t.url),e||new Response("",{status:503,statusText:"Service Unavailable"})})})})}self.addEventListener("fetch",function(t){var e=t.request;if("GET"===e.method){var n;try{n=new URL(e.url)}catch(t){return}(n.origin===self.location.origin||isFont(n))&&(isFont(n)?t.respondWith(cacheFirst(e,CACHE_STATIC)):isPagefindData(n)?t.respondWith(networkFirstWithCache(e,CACHE_PAGEFIND)):isPagefindStatic(n)?t.respondWith(cacheFirst(e,CACHE_PAGEFIND)):isStaticAsset(n)?t.respondWith(cacheFirst(e,CACHE_STATIC)):isImage(n)?t.respondWith(cacheFirst(e,CACHE_IMAGES)):isHtmlPage(e)?t.respondWith(staleWhileRevalidate(e,t)):t.respondWith(networkFirst(e)))}}),self.addEventListener("message",function(t){if(t.data&&"CACHE_ARTICLE"===t.data.type){var e=t.data.url;if(!e)return;t.waitUntil(caches.open(CACHE_CONTENT).then(function(t){return fetch(e).then(function(n){n&&200===n.status&&t.put(e,n.clone()).catch(function(){})})}).catch(function(){}))}}),self.addEventListener("sync",function(t){if(t.tag&&0===t.tag.indexOf("cache-article:")){var e=t.tag.replace("cache-article:","");t.waitUntil(caches.open(CACHE_CONTENT).then(function(t){return fetch(e).then(function(n){if(n&&200===n.status)return t.put(e,n.clone())})}))}});
scripts/cache-bust.js-32-  'css/nagornaya-mobile-toc.css',
scripts/cache-bust.js-33-  'css/floating-cluster.css',
scripts/cache-bust.js:34:  'css/site-layered.css',       /* BUG P0-7: в SW precache, не было в cache-bust → drift */
scripts/cache-bust.js-35-  'fonts/fonts.css',           /* AUDIT V2 / PERF-1: self-host fonts */
scripts/cache-bust.js-36-  'nagornaya/tw.min.css',
--
scripts/cache-bust.js-46-  'js/glossary.js',
scripts/cache-bust.js-47-  'js/floating-cluster-controller.js',
scripts/cache-bust.js:48:  'js/site-modules.js',         /* BUG P0-8: в SW precache, не было в cache-bust → drift */
scripts/cache-bust.js-49-];
scripts/cache-bust.js-50-
--
scripts/audit-pro.js-38-  'css/command-palette.css',
scripts/audit-pro.js-39-  'css/mobile-hotfix.css',
scripts/audit-pro.js:40:  'css/site-layered.css',
scripts/audit-pro.js-41-  'css/floating-cluster.css',
scripts/audit-pro.js-42-                    'css/nagornaya-mobile-toc.css'
--
scripts/audit-pro.js-57-  'js/glossary.js',
scripts/audit-pro.js-58-  'js/bookmark-engine.js',
scripts/audit-pro.js:59:  'js/series-cards.js',
scripts/audit-pro.js-60-  'js/nagornaya-mobile-toc.js',
scripts/audit-pro.js-61-  'js/sw-register.js',
scripts/audit-pro.js:62:  'js/site-modules.js',
scripts/audit-pro.js-63-  'js/floating-cluster-controller.js',
scripts/audit-pro.js-64-  'js/modules/back-to-top.js',
--
scripts/audit-pro.js-77-  'css/nagornaya-mobile-toc.css',
scripts/audit-pro.js-78-  'css/floating-cluster.css',
scripts/audit-pro.js:79:  'css/site-layered.css',
scripts/audit-pro.js-80-  'fonts/fonts.css',
scripts/audit-pro.js-81-  'nagornaya/tw.min.css',
--
scripts/audit-pro.js-91-  'js/glossary.js',
scripts/audit-pro.js-92-  'js/floating-cluster-controller.js',
scripts/audit-pro.js:93:  'js/site-modules.js'
scripts/audit-pro.js-94-];
scripts/audit-pro.js-95-
--
scripts/audit-pro.js-244-(function sizeBudget() {
scripts/audit-pro.js-245-  // Core budget excludes route-scoped/pilot CSS: nagornaya/tw.min.css is
scripts/audit-pro.js:246:  // Tailwind-route scoped; site-layered.css is a one-route refactor pilot
scripts/audit-pro.js-247-  // duplicate of site.css and must not make the global budget look 2× larger.
scripts/audit-pro.js:248:  const routeScopedCss = new Set(['nagornaya/tw.min.css', 'css/site-layered.css']);
scripts/audit-pro.js-249-  const cssAssetsAll = [...ALLOWED_CSS, ...REQUIRED_EXTRA_CSS].filter(exists);
scripts/audit-pro.js-250-  const cssAssetsCore = cssAssetsAll.filter(f => !routeScopedCss.has(f));
--
scripts/audit-pro.js-306-(function braceBalance() {
scripts/audit-pro.js-307-  for (const f of ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js:308:                   'css/mobile-hotfix.css', 'css/site-layered.css',
scripts/audit-pro.js-309-                   'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css']) {
scripts/audit-pro.js-310-    const p = path.join(ROOT, f);
--
scripts/audit-pro.js-1384-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-1385-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:1386:  'css/site-layered.css',
scripts/audit-pro.js-1387-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-1388-  const offenders = [];
--
scripts/audit-pro.js-1669-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-1670-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:1671:  'css/site-layered.css',
scripts/audit-pro.js-1672-  'css/floating-cluster.css',
scripts/audit-pro.js-1673-                    'nagornaya/tw.min.css'];
--
scripts/audit-pro.js-2136-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-2137-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:2138:  'css/site-layered.css',
scripts/audit-pro.js-2139-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-2140-  let css = '';
--
scripts/audit-pro.js-2310-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-2311-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:2312:  'css/site-layered.css',
scripts/audit-pro.js-2313-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-2314-  const BAD = [
--
scripts/audit-pro.js-2629-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-2630-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:2631:  'css/site-layered.css',
scripts/audit-pro.js-2632-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-2633-  const offenders = [];
--
scripts/audit-pro.js-2713-  }
scripts/audit-pro.js-2714-  if (missing.length) {
scripts/audit-pro.js:2715:    R.err(`sw.js PRECACHE_ASSETS missing live files:\n  - ${missing.join('\n  - ')}`);
scripts/audit-pro.js-2716-  } else {
scripts/audit-pro.js-2717-    R.ok(`sw.js PRECACHE_ASSETS lists all 5 CSS + 11 JS files`);
--
scripts/audit-pro.js-2754-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-2755-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:2756:  'css/site-layered.css',
scripts/audit-pro.js-2757-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-2758-  const NAMED = ['red','blue','green','yellow','purple','pink','cyan','magenta','orange','brown','gray','grey'];
--
scripts/audit-pro.js-2806-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-2807-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:2808:  'css/site-layered.css',
scripts/audit-pro.js-2809-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-2810-  const offenders = [];
--
scripts/audit-pro.js-3185-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-3186-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:3187:  'css/site-layered.css',
scripts/audit-pro.js-3188-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-3189-  const offenders = [];
--
scripts/audit-pro.js-3274-  let total = 0;
scripts/audit-pro.js-3275-  for (const f of ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js:3276:                   'css/mobile-hotfix.css', 'css/site-layered.css',
scripts/audit-pro.js-3277-                   'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css']) {
scripts/audit-pro.js-3278-    const p = path.join(ROOT, f);
--
scripts/audit-pro.js-3371-  const cssFiles = ['css/site.css', 'css/home.css', 'css/command-palette.css',
scripts/audit-pro.js-3372-                    'css/mobile-hotfix.css',
scripts/audit-pro.js:3373:  'css/site-layered.css',
scripts/audit-pro.js-3374-  'css/floating-cluster.css', 'css/nagornaya-mobile-toc.css'];
scripts/audit-pro.js-3375-  let allCss = '';
--
scripts/audit-pro.js-4141-    }
scripts/audit-pro.js-4142-  }
scripts/audit-pro.js:4143:  const seriesJs = fs.readFileSync(path.join(ROOT, 'js/series-cards.js'), 'utf8');
scripts/audit-pro.js-4144-  if (/gb-strip__toggle[\s\S]{0,900}<a\b/.test(seriesJs)) {
scripts/audit-pro.js:4145:    offenders.push('js/series-cards.js: gb-strip__toggle template contains <a>');
scripts/audit-pro.js-4146-  }
scripts/audit-pro.js-4147-  if (offenders.length) {
--
scripts/audit-pro.js-4247-    for (const bad of ['id="reading-progress"', 'id="bottomBar"', 'id="btocOverlay"', 'id="tocSidebar"', 'id="themeToggle"', 'data-series-strip', 'data-series-nav', 'series-next-cta'])
scripts/audit-pro.js-4248-      if (html.includes(bad)) probs.push(`legacy leftover: ${bad}`);
scripts/audit-pro.js:4249:    // dead script: series-cards.js is catalog-only since r99
scripts/audit-pro.js:4250:    if (/js\/series-cards\.js/.test(html)) probs.push('series-cards.js linked on a gbs-world page (dead weight)');
scripts/audit-pro.js-4251-    if (probs.length) offenders.push(`${p}: ${probs.join('; ')}`);
scripts/audit-pro.js-4252-  }
