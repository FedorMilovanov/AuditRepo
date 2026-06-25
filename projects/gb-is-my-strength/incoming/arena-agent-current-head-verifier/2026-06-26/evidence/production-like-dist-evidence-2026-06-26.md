# Production-like dist evidence — 2026-06-26

## Environment
v22.12.0
10.9.0

## Last strangler:build:production-like log tail
[7m38[0m   <script src="/js/sw-register.js?v=8a077d35" defer></script>
[7m  [0m [93m          ~~~[0m
[96msrc/components/rodosloviye/RodosloviyeBody.astro[0m:[93m37[0m:[93m11[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m37[0m   <script src="/js/search.js?v=c9d65577" defer></script>
[7m  [0m [93m          ~~~[0m
[96msrc/components/rodosloviye/RodosloviyeBody.astro[0m:[93m36[0m:[93m11[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m36[0m   <script src="/js/site.js?v=133dfac1" defer></script>
[7m  [0m [93m          ~~~[0m

[96msrc/components/ui/floating-cluster/GillRailControls.astro[0m:[93m33[0m:[93m3[0m - [93mwarning[0m[90m ts(6133): [0m'homeHref' is declared but its value is never read.

[7m33[0m   homeHref,
[7m  [0m [93m  ~~~~~~~~[0m
[96msrc/components/ui/floating-cluster/GillRailControls.astro[0m:[93m32[0m:[93m3[0m - [93mwarning[0m[90m ts(6133): [0m'context' is declared but its value is never read.

[7m32[0m   context = 'rail',
[7m  [0m [93m  ~~~~~~~[0m

Result (408 files): 
- 0 errors
- 0 warnings
- 13 hints

23:14:16 [content] Syncing content
23:14:16 [content] Synced content
23:14:16 [types] Generated 703ms
23:14:16 [build] output: "static"
23:14:16 [build] mode: "static"
23:14:16 [build] directory: /home/user/gb-is-my-strength/dist/
23:14:16 [build] Collecting build info...
23:14:16 [build] ✓ Completed in 741ms.
23:14:16 [build] Building static entrypoints...
23:14:21 [WARN] [vite] 
../images/og-karty-1200x630.webp referenced in ../images/og-karty-1200x630.webp didn't resolve at build time, it will remain unchanged to be resolved at runtime
23:14:23 [vite] ✓ built in 6.64s
23:14:24 [vite] ✓ built in 885ms
23:14:24 [build] Rearranging server assets...

 generating static routes 
23:14:24   ├─ /about/index.html (+16ms) 
23:14:24   ├─ /articles/20-antisovetov-pastoru/index.html (+22ms) 
23:14:24   ├─ /articles/dzhon-gill-chast-1-chelovek/index.html (+13ms) 
23:14:24   ├─ /articles/dzhon-gill-chast-2-uchenyi/index.html (+8ms) 
23:14:24   ├─ /articles/dzhon-gill-chast-3-nasledie/index.html (+9ms) 
23:14:24   ├─ /articles/dzhon-gill-istoricheskiy-kontekst/index.html (+6ms) 
23:14:24   ├─ /articles/dzhon-gill-spravochnik/index.html (+6ms) 
23:14:24   ├─ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html (+70ms) 
23:14:24   ├─ /articles/kod-da-vinchi/index.html (+12ms) 
23:14:24   ├─ /articles/krajne-li-isporcheno-serdce/index.html (+9ms) 
23:14:24   ├─ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html (+5ms) 
23:14:24   ├─ /articles/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/dva-sezda-1884/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/goneniya-i-sovest/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/iniciativnaya-gruppa/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/noch-na-kure/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/peterburgskaya-liniya/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/podpolnaya-pechat/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/sovetskaya-noch/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/spravochnik/index.html (+5ms) 
23:14:24   ├─ /baptisty-rossii/vsehib-1944/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/yuzhnaya-shtunda/index.html (+4ms) 
23:14:24   ├─ /baptisty-rossii/index.html (+3ms) 
23:14:24   ├─ /biografii/index.html (+5ms) 
23:14:24   ├─ /dev/astro-test/index.html (+17ms) 
23:14:24   ├─ /hard-texts/index.html (+18ms) 
23:14:24   ├─ /karty/avraam/index.html (+3ms) 
23:14:24   ├─ /karty/early-church/index.html (+4ms) 
23:14:24   ├─ /karty/ishod/index.html (+3ms) 
23:14:24   ├─ /karty/maccabim/index.html (+3ms) 
23:14:24   ├─ /karty/melachim/index.html (+2ms) 
23:14:24   ├─ /karty/pavel/index.html (+3ms) 
23:14:24   ├─ /karty/revelation/index.html (+3ms) 
23:14:24   ├─ /karty/shoftim/index.html (+3ms) 
23:14:24   ├─ /karty/shvatim/index.html (+3ms) 
23:14:24   ├─ /karty/yeshua/index.html (+3ms) 
23:14:24   ├─ /karty/index.html (+3ms) 
23:14:24   ├─ /konfessii/russkij-baptizm/index.html (+4ms) 
23:14:24   ├─ /konfessii/index.html (+5ms) 
23:14:24   ├─ /map/index.html (+4ms) 
23:14:24   ├─ /nagornaya/chast-1/index.html (+6ms) 
23:14:24   ├─ /nagornaya/chast-2/index.html (+5ms) 
23:14:24   ├─ /nagornaya/chast-3/index.html (+6ms) 
23:14:24   ├─ /nagornaya/chast-4/index.html (+7ms) 
23:14:24   ├─ /nagornaya/chast-5/index.html (+6ms) 
23:14:24   ├─ /nagornaya/istochniki/index.html (+5ms) 
23:14:24   ├─ /nagornaya/nakhodki/index.html (+5ms) 
23:14:24   ├─ /nagornaya/seriya/index.html (+3ms) 
23:14:24   ├─ /nagornaya/index.html (+4ms) 
23:14:24   ├─ /pastor-series/index.html (+4ms) 
23:14:24   ├─ /rodosloviye/index.html (+3ms) 
23:14:24   ├─ /index.html (+5ms) 
23:14:24 ✓ Completed in 412ms.

23:14:24 [build] ✓ Completed in 8.02s.
23:14:24 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
23:14:24 [build] 52 page(s) built in 8.78s
23:14:24 [build] Complete!
   Copy operation manifest: reports/dist-copy-manifest.json
✅ copy-legacy-to-dist: copied 578 files (46491 KB)
   Astro-owned legacy pages skipped: /articles/20-antisovetov-pastoru/, /articles/dzhon-gill-chast-1-chelovek/, /articles/dzhon-gill-chast-2-uchenyi/, /articles/dzhon-gill-chast-3-nasledie/, /articles/dzhon-gill-istoricheskiy-kontekst/, /articles/dzhon-gill-spravochnik/, /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/, /articles/, /articles/kod-da-vinchi/, /articles/krajne-li-isporcheno-serdce/, /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/, /about/, /baptisty-rossii/dva-sezda-1884/, /baptisty-rossii/goneniya-i-sovest/, /baptisty-rossii/, /baptisty-rossii/iniciativnaya-gruppa/, /baptisty-rossii/noch-na-kure/, /baptisty-rossii/peterburgskaya-liniya/, /baptisty-rossii/podpolnaya-pechat/, /baptisty-rossii/sovetskaya-noch/, /baptisty-rossii/spravochnik/, /baptisty-rossii/vsehib-1944/, /baptisty-rossii/yuzhnaya-shtunda/, /biografii/, /hard-texts/, /karty/avraam/, /karty/early-church/, /karty/, /karty/ishod/, /karty/maccabim/, /karty/melachim/, /karty/pavel/, /karty/revelation/, /karty/shoftim/, /karty/shvatim/, /karty/yeshua/, /konfessii/, /konfessii/russkij-baptizm/, /map/, /nagornaya/chast-1/, /nagornaya/chast-2/, /nagornaya/chast-3/, /nagornaya/chast-4/, /nagornaya/chast-5/, /nagornaya/, /nagornaya/istochniki/, /nagornaya/nakhodki/, /nagornaya/seriya/, /pastor-series/
   Build-only Astro routes omitted: /dev/astro-test/
   Partial Astro sitemap files removed: sitemap-0.xml, sitemap-index.xml

⚡  astro-cache-bust-postbuild.js

  HTML files scanned: 56
  Files touched:      36
  Hash replacements:  527

✅  dist/ hash drift → 0 (next cache-bust legacy pass will converge)

## page-ownership:dist:production-like

> gb-is-my-strength@1.6.3 page-ownership:dist:production-like
> node scripts/check-page-ownership.js --dist --production-like

PAGE OWNERSHIP CHECK (manifest + dist, production-like)
✅ Astro src/pages ownership declared (52 route file(s))
✅ ownership manifest parsed (53 explicit route(s))
✅ dist/ exists
✅ dist system files present (8)
✅ /: Astro-owned route exists in dist
✅ /about/: Astro-owned route exists in dist
✅ /articles/: Astro-owned route exists in dist
✅ /articles/20-antisovetov-pastoru/: Astro-owned route exists in dist
✅ /articles/dzhon-gill-chast-1-chelovek/: Astro-owned route exists in dist
✅ /articles/dzhon-gill-chast-2-uchenyi/: Astro-owned route exists in dist
✅ /articles/dzhon-gill-chast-3-nasledie/: Astro-owned route exists in dist
✅ /articles/dzhon-gill-istoricheskiy-kontekst/: Astro-owned route exists in dist
✅ /articles/dzhon-gill-spravochnik/: Astro-owned route exists in dist
✅ /karty/ishod/: Astro-owned route exists in dist
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/: Astro-owned route exists in dist
✅ /articles/kod-da-vinchi/: Astro-owned route exists in dist
✅ /articles/krajne-li-isporcheno-serdce/: Astro-owned route exists in dist
✅ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/: Astro-owned route exists in dist
✅ /biografii/: Astro-owned route exists in dist
✅ /dev/astro-test/: build-only route absent from production-like dist
✅ /hard-texts/: Astro-owned route exists in dist
✅ /karty/: Astro-owned route exists in dist
✅ /konfessii/: Astro-owned route exists in dist
✅ /konfessii/russkij-baptizm/_app/: built-app entry copied to dist
✅ /konfessii/russkij-baptizm/_app/: built-app remains noindex
✅ /nagornaya/: Astro-owned route exists in dist
✅ /nagornaya/istochniki/: Astro-owned route exists in dist
✅ /nagornaya/nakhodki/: Astro-owned route exists in dist
✅ /nagornaya/seriya/: Astro-owned route exists in dist
✅ /pastor-series/: Astro-owned route exists in dist
✅ /baptisty-rossii/: Astro-owned route exists in dist
✅ /baptisty-rossii/noch-na-kure/: Astro-owned route exists in dist
✅ /baptisty-rossii/yuzhnaya-shtunda/: Astro-owned route exists in dist
✅ /baptisty-rossii/dva-sezda-1884/: Astro-owned route exists in dist
✅ /baptisty-rossii/peterburgskaya-liniya/: Astro-owned route exists in dist
✅ /baptisty-rossii/goneniya-i-sovest/: Astro-owned route exists in dist
✅ /baptisty-rossii/sovetskaya-noch/: Astro-owned route exists in dist
✅ /baptisty-rossii/vsehib-1944/: Astro-owned route exists in dist
✅ /baptisty-rossii/iniciativnaya-gruppa/: Astro-owned route exists in dist
✅ /baptisty-rossii/podpolnaya-pechat/: Astro-owned route exists in dist
✅ /baptisty-rossii/spravochnik/: Astro-owned route exists in dist
✅ /konfessii/russkij-baptizm/: Astro-owned route exists in dist
✅ /map/: Astro-owned route exists in dist
✅ /nagornaya/chast-1/: Astro-owned route exists in dist
✅ /nagornaya/chast-2/: Astro-owned route exists in dist
✅ /nagornaya/chast-3/: Astro-owned route exists in dist
✅ /nagornaya/chast-4/: Astro-owned route exists in dist
✅ /nagornaya/chast-5/: Astro-owned route exists in dist
✅ /karty/avraam/: Astro-owned route exists in dist
✅ /karty/pavel/: Astro-owned route exists in dist
✅ /karty/shoftim/: Astro-owned route exists in dist
✅ /karty/melachim/: Astro-owned route exists in dist
✅ /karty/shvatim/: Astro-owned route exists in dist
✅ /karty/yeshua/: Astro-owned route exists in dist
✅ /karty/maccabim/: Astro-owned route exists in dist
✅ /karty/early-church/: Astro-owned route exists in dist
✅ /karty/revelation/: Astro-owned route exists in dist
✅ /rodosloviye/: Astro-owned route exists in dist
✅ baseline public URLs resolve in dist (43)
✅ explicit Astro baseline route(s): /, /about/, /articles/, /articles/20-antisovetov-pastoru/, /articles/dzhon-gill-chast-1-chelovek/, /articles/dzhon-gill-chast-2-uchenyi/, /articles/dzhon-gill-chast-3-nasledie/, /articles/dzhon-gill-istoricheskiy-kontekst/, /articles/dzhon-gill-spravochnik/, /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/, /articles/kod-da-vinchi/, /articles/krajne-li-isporcheno-serdce/, /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/, /baptisty-rossii/, /baptisty-rossii/dva-sezda-1884/, /baptisty-rossii/goneniya-i-sovest/, /baptisty-rossii/iniciativnaya-gruppa/, /baptisty-rossii/noch-na-kure/, /baptisty-rossii/peterburgskaya-liniya/, /baptisty-rossii/podpolnaya-pechat/, /baptisty-rossii/sovetskaya-noch/, /baptisty-rossii/spravochnik/, /baptisty-rossii/vsehib-1944/, /baptisty-rossii/yuzhnaya-shtunda/, /biografii/, /hard-texts/, /karty/, /karty/avraam/, /karty/ishod/, /konfessii/, /konfessii/russkij-baptizm/, /map/, /nagornaya/, /nagornaya/chast-1/, /nagornaya/chast-2/, /nagornaya/chast-3/, /nagornaya/chast-4/, /nagornaya/chast-5/, /nagornaya/istochniki/, /nagornaya/nakhodki/, /nagornaya/seriya/, /pastor-series/, /rodosloviye/
ℹ️ implicit legacy baseline route(s): 0; these remain copied legacy pages until individually promoted

✅ page ownership check passed
ℹ️ Ownership notes are expected while some baseline pages are still copied from legacy root into dist.

## dist publication audit
DIST PUBLICATION AUDIT (pagefind optional, dev forbidden)
✅ required dist files present (45)
✅ no private/build directories copied to dist
✅ no partial Astro sitemap-index/sitemap-N files in dist
✅ sitemap.xml locs resolve in dist (43)
✅ robots.txt points to canonical sitemap.xml
✅ /about/ in dist is Astro-owned via full-document visual parity
✅ /about/ dist keeps legacy marker: about-page
✅ /about/ dist keeps legacy marker: about-resources
✅ /about/ dist keeps legacy marker: about-contact-card
✅ /about/ dist keeps legacy marker: gb-accuracy-block
✅ /about/ has no old generic/shadow-wrapper Astro about markers
✅ /about/ has no technical scaffold copy
✅ /articles/ in dist is full-document visual-parity catalog output
✅ /articles/ has no generic Astro catalog markers
✅ /articles/ is indexable in dist
✅ /articles/ canonical is public URL
✅ /biografii/ in dist is Astro-owned landing/full-document shadow output
✅ /biografii/ is indexable in dist
✅ /biografii/ canonical is public URL
✅ /hard-texts/ in dist is Astro-owned landing/full-document shadow output
✅ /hard-texts/ is indexable in dist
✅ /hard-texts/ canonical is public URL
✅ /pastor-series/ in dist is Astro-owned landing/full-document shadow output
✅ /pastor-series/ is indexable in dist
✅ /pastor-series/ canonical is public URL
✅ /nagornaya/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/ is indexable in dist
✅ /nagornaya/ canonical is public URL
✅ /nagornaya/chast-1/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/chast-1/ is indexable in dist
✅ /nagornaya/chast-1/ canonical is public URL
✅ /nagornaya/chast-2/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/chast-2/ is indexable in dist
✅ /nagornaya/chast-2/ canonical is public URL
✅ /nagornaya/chast-3/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/chast-3/ is indexable in dist
✅ /nagornaya/chast-3/ canonical is public URL
✅ /nagornaya/chast-4/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/chast-4/ is indexable in dist
✅ /nagornaya/chast-4/ canonical is public URL
✅ /nagornaya/chast-5/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/chast-5/ is indexable in dist
✅ /nagornaya/chast-5/ canonical is public URL
✅ /nagornaya/seriya/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/seriya/ is indexable in dist
✅ /nagornaya/seriya/ canonical is public URL
✅ /nagornaya/istochniki/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/istochniki/ is indexable in dist
✅ /nagornaya/istochniki/ canonical is public URL
✅ /nagornaya/nakhodki/ in dist is Astro-owned landing/full-document shadow output
✅ /nagornaya/nakhodki/ is indexable in dist
✅ /nagornaya/nakhodki/ canonical is public URL
✅ /karty/ in dist is Astro-owned landing/full-document shadow output
✅ /karty/ is indexable in dist
✅ /karty/ canonical is public URL
✅ /karty/avraam/ in dist is Astro-owned landing/full-document shadow output
✅ /karty/avraam/ is indexable in dist
✅ /karty/avraam/ canonical is public URL
✅ /karty/ishod/ in dist is Astro-owned landing/full-document shadow output
✅ /karty/ishod/ is indexable in dist
✅ /karty/ishod/ canonical is public URL
✅ /konfessii/ in dist is Astro-owned landing/full-document shadow output
✅ /konfessii/ is indexable in dist
✅ /konfessii/ canonical is public URL
✅ /konfessii/russkij-baptizm/ in dist is Astro-owned landing/full-document shadow output
✅ /konfessii/russkij-baptizm/ is indexable in dist
✅ /konfessii/russkij-baptizm/ canonical is public URL
✅ /map/ in dist is Astro-owned landing/full-document shadow output
✅ /map/ is indexable in dist
✅ /map/ canonical is public URL
✅ /articles/dzhon-gill-spravochnik/ in dist is full-document/shadow-breakout visual output
✅ /articles/dzhon-gill-spravochnik/ has no generic Astro article markers
✅ /articles/dzhon-gill-spravochnik/ has no pilot copy
✅ /articles/dzhon-gill-spravochnik/ is indexable in dist
✅ /articles/dzhon-gill-spravochnik/ canonical is public URL
✅ /articles/dzhon-gill-istoricheskiy-kontekst/ in dist is full-document/shadow-breakout visual output
✅ /articles/dzhon-gill-istoricheskiy-kontekst/ has no generic Astro article markers
✅ /articles/dzhon-gill-istoricheskiy-kontekst/ has no pilot copy
✅ /articles/dzhon-gill-istoricheskiy-kontekst/ is indexable in dist
✅ /articles/dzhon-gill-istoricheskiy-kontekst/ canonical is public URL
✅ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ in dist is full-document/shadow-breakout visual output
✅ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ has no generic Astro article markers
✅ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ has no pilot copy
✅ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ is indexable in dist
✅ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ canonical is public URL
✅ /articles/kod-da-vinchi/ in dist is full-document/shadow-breakout visual output
✅ /articles/kod-da-vinchi/ has no generic Astro article markers
✅ /articles/kod-da-vinchi/ has no pilot copy
✅ /articles/kod-da-vinchi/ is indexable in dist
✅ /articles/kod-da-vinchi/ canonical is public URL
✅ /articles/dzhon-gill-chast-1-chelovek/ in dist is full-document/shadow-breakout visual output
✅ /articles/dzhon-gill-chast-1-chelovek/ has no generic Astro article markers
✅ /articles/dzhon-gill-chast-1-chelovek/ has no pilot copy
✅ /articles/dzhon-gill-chast-1-chelovek/ is indexable in dist
✅ /articles/dzhon-gill-chast-1-chelovek/ canonical is public URL
✅ /articles/dzhon-gill-chast-2-uchenyi/ in dist is full-document/shadow-breakout visual output
✅ /articles/dzhon-gill-chast-2-uchenyi/ has no generic Astro article markers
✅ /articles/dzhon-gill-chast-2-uchenyi/ has no pilot copy
✅ /articles/dzhon-gill-chast-2-uchenyi/ is indexable in dist
✅ /articles/dzhon-gill-chast-2-uchenyi/ canonical is public URL
✅ /articles/dzhon-gill-chast-3-nasledie/ in dist is full-document/shadow-breakout visual output
✅ /articles/dzhon-gill-chast-3-nasledie/ has no generic Astro article markers
✅ /articles/dzhon-gill-chast-3-nasledie/ has no pilot copy
✅ /articles/dzhon-gill-chast-3-nasledie/ is indexable in dist
✅ /articles/dzhon-gill-chast-3-nasledie/ canonical is public URL
✅ /articles/krajne-li-isporcheno-serdce/ in dist is full-document/shadow-breakout visual output
✅ /articles/krajne-li-isporcheno-serdce/ has no generic Astro article markers
✅ /articles/krajne-li-isporcheno-serdce/ has no pilot copy
✅ /articles/krajne-li-isporcheno-serdce/ is indexable in dist
✅ /articles/krajne-li-isporcheno-serdce/ canonical is public URL
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ in dist is full-document/shadow-breakout visual output
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ has no generic Astro article markers
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ has no pilot copy
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ is indexable in dist
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ canonical is public URL
✅ /articles/20-antisovetov-pastoru/ in dist is full-document/shadow-breakout visual output
✅ /articles/20-antisovetov-pastoru/ has no generic Astro article markers
✅ /articles/20-antisovetov-pastoru/ has no pilot copy
✅ /articles/20-antisovetov-pastoru/ is indexable in dist
✅ /articles/20-antisovetov-pastoru/ canonical is public URL
✅ /dev/astro-test/ absent from production-like dist
✅ /dev/article-mdx-pilot/ absent from production-like dist
✅ sw.js precache assets resolve in dist (26, pagefind optional)
ℹ️ Pagefind not present in dist (allowed before deploy-switch; use --require-pagefind for deploy-like audit)

✅ dist publication audit passed

## contract:compare:dist

> gb-is-my-strength@1.6.3 contract:extract:dist
> node scripts/extract-url-contract.js --root dist --out-json reports/url-contract-dist.json --out-md reports/url-contract-dist.md

✅ URL contract extracted from dist: 43 public pages, 0 issue(s)
   JSON: reports/url-contract-dist.json
   MD:   reports/url-contract-dist.md

> gb-is-my-strength@1.6.3 contract:compare:dist
> node scripts/compare-url-contract.js --baseline data/public-content-baseline.json --current reports/url-contract-dist.json

❌ URL contract compare failed (1 error(s))
  - word-count drop: https://gospod-bog.ru/karty/avraam/ 594 → 23 (floor 427)

Warnings (3):
  - title changed: https://gospod-bog.ru/articles/20-antisovetov-pastoru/ — "20 антисоветов, как пастору разрушить своё служение | Господь Бог — Сила Моя" → "20 антисоветов пастору: как разрушить служение | Господь Бог"
  - title changed: https://gospod-bog.ru/articles/kod-da-vinchi/ — "«Код да Винчи»: мифы о Марии Магдалине и Никее | Господь Бог — Сила Моя" → "«Код да Винчи»: мифы о Марии Магдалине и Никее | Господь Бог"
  - title changed: https://gospod-bog.ru/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ — "Римлянам 7: верующий, неверующий или человек под законом? | Господь Бог — Сила Моя" → "Римлянам 7: верующий или неверующий? | Господь Бог — Сила Моя"

## karty/avraam word-count probe
--- karty/avraam/index.html
words: 963 bytes: 170403
title: Путь Авраама: интерактивная карта Бытия 11–25 | Господь Бог — Сила Моя
robots: <meta name="robots" content="index, follow">
data-pagefind-body: False
--- dist/karty/avraam/index.html
words: 36 bytes: 6363
title: Путь Авраама: интерактивная карта Бытия 11–25 | Господь Бог — Сила Моя
robots: <meta name="robots" content="index, follow">
data-pagefind-body: True
--- src/pages/karty/avraam/index.astro
words: 54 bytes: 539
title: 
robots: 
data-pagefind-body: False
--- src/components/karty/avraam/AvraamMap.astro
words: 63 bytes: 2491
title: 
robots: 
data-pagefind-body: True

## dist corruption grep after production-like build
dist/articles/20-antisovetov-pastoru/index.html:771:</div> <div class="note-box"> <div class="anti-kicker" style="margin-bottom:12px">Как это выглядит на практике</div> <p class="mb-4"><strong>Процессуальный барьер:</strong> Пострадавший член церкви приносит совету свидетельства давления со стороны пастора. Совет отвечает: «Вы нарушили библейскую процедуру. Вы не поговорили с пастором трижды наедине в закрытой комнате, вы нарушили тон братского общения. Мы не можем принять это письмо». Суть жалобы полностью проигнорирована.</p> <p><strong>Библейский критерий:</strong> Матфей 18:15–17 создан для разрешения конфликтов между братьями, а не для защиты пасторов от проверок за системный грех. В других случаях Писание прямо говорит об открытом обличении согрешающих старейшин: «Согрешающих обличай перед всеми, чтобы и прочие страх имели» (1 Тим. 5:20). Использование Матфея 18 как щита — это перекручивание текста. Матфей 18 — путь к братскому примирению, а не процедура защиты неприкасаемости.</p> </div> <h3 class="text-3xl heading-serif font-semibold mb-4" id="point-20">20. Минимизируй зло и кайся так, чтобы ничего не менять</h3> <p class="mb-6">И наконец — финальный аккорд. Когда всё уже вскрылось и отрицать факты невозможно, остаётся последний приём: фальшивая уязвимость. Признай ровно столько, сколько не разрушит твоё положение на кафедре. Не называй ложь ложью — скажи, что допустил «неточность в коммуникации». Не называй жёсткое давление давлением — скажи, что «был, возможно, излишне резок». Люди поплачут вместе с тобой на сцене — и ты останешься у прежних рычагов власти. Ничего не изменится. Никто из пострадавших не получит ни объяснения, ни защиты, ни извинения по имени. <span class="fn-marker fn-marker--dove map-trigger" data-tip="20" role="button" tabindex="0"></span> Пройдёт полгода, и цикл повторится снова. <span class="fn-marker fn-marker--dove map-trigger" data-tip="20" role="button" tabindex="0"></span></p> <div class="info-box"> <div style="font-weight:600;color:var(--accent);margin-bottom:8px;display:flex;align-items:center;gap:8px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;margin-top:2px;"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Здоровое покаяние звучит так</span></div> <p style="font-style:italic;">«Я согрешил вот в этом конкретном деле. Мои действия были неправдой. Мне нужны не только ваши молитвы, но и реальные последствия и исправление.»</p> </div> <div class="note-box"> <div class="anti-kicker">Модели сломленности</div> <div class="grid md:grid-cols-2 gap-6 text-[15px] leading-7"> <div> <h4 class="anti-kicker" style="margin-bottom:8px;margin-top:12px;letter-spacing:.1em">Истинное покаяние</h4> <ul class="list-disc pl-5 space-y-2"> <li>«Согрешил я пред Господом» — без пресс-релизов, самооправданий и условий.</li> <li>Готовность принять Божьи, общественные и административные последствия.</li> <li>Плоды характера: прозрачность, исправление, возмещение ущерба там, где оно возможно.</li> </ul> </div> <div> <h4 class="anti-kicker" style="margin-bottom:8px;margin-top:12px;letter-spacing:.1em">Управление ущербом</h4> <ul class="list-disc pl-5 space-y-2"> <li>«Я согрешил, но почти меня ныне перед старейшинами народа моего» (1 Цар. 15:30).</li> <li>Борьба за сохранение рычагов, кафедры и прежнего образа святости.</li> <li>Частичная правда используется как щит для защиты центра власти.</li> </ul> </div> </div> </div> <p class="mb-6">Безопасное извинение звучит общо: «если кого-то ранил», «мы все несовершенны». В нём нет имени конкретного греха и пострадавших душ. Это не покаяние — это мягкая смена освещения на сцене. Если обвинения слишком доказаны — стань «мучеником»: «На служителей всегда идут атаки дьявола». Ответственность превращается в гонение, а проверка фактов — в нападение на дело Божье. Настоящая сломленность не прос�тематическом искажении фактов перед общиной. Он выходит на кафедру, пускает слезу и произносит: «Братья, я признаю, что вкралась досадная неточность в коммуникации из-за моей усталости. Прошу прощения, если это кого-то смутило». Зал аплодирует его смирению. Никаких кадровых изменений не происходит, пострадавшие остаются виноватыми, через время ложь повторяется.</p> <div class="note-box"> <span style="display:inline-flex;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);font-weight:700;margin-bottom:12px;">Ложные наветы на верных пастырей</span> <h4 class="heading-serif text-2xl font-bold mb-3">Двустороннее зеркало: ложные наветы на верных пастырей</h4> <p class="mb-4">Та же спираль, которая позволяет лидеру прятаться за репутацией, может работать и в обратную сторону. Апостол Павел оставил церкви ясное правило: «Обвинение на пресвитера не иначе принимай, как при двух или трёх свидетелях» (1 Тим. 5:19). Это не сословная привилегия лидера, а защита истины: ни один человек, несущий слово обличения, не должен быть лишён служения по доносу одного раздражённого голоса.</p> <p>Верные пастыри, говорящие неудобную правду, нередко становятся мишенью клеветы. Можно собрать коалицию, переписать одни и те же события в нужной интонации, превратить законное библейgrep: dist/images/gill-clarendon-code-acts.webp: binary file matches
grep: dist/images/gill-library-shelf.webp: binary file matches
grep: dist/images/gill-southwark-sermon-600w.webp: binary file matches
grep: dist/images/gill-wesley-debate.jpg: binary file matches
grep: dist/images/og-dzhon-gill-chast-3-nasledie.webp: binary file matches
ское обличение в «травлю», а требование покаяния — в «тиранический контроль». Ложные свидетельства, вырванные из контекста фразы и заранее заготовленный образ «угнетателя» — это другая сторона той же тьмы. Здоровая община выбирает суд по двум-трём свидетелям, по фактам, при свете Писания, без партий и без охоты на ведьм.</p> <p><strong>И ещё одно зеркало:</strong> члены общины тоже могут имитировать покаяние, чтобы избежать дисциплины, — извиняются на словах, но не меняют поведения. Гордость может быть и снизу: не только лидер, но и прихожанин может считать себя незаменимым и отказываться от исправления. Писание обращает свои увещевания ко всем: «Братия, если и впадет человек в какое согрешение, вы, духовные, исправляйте такового в духе кротости, наблюдая каждый за собою, чтобы не быть искушённым» (Гал. 6:1). Обратите внимание: духовные исправляют согрешившего — и при этом сами следят, чтобы не впасть в гордость и самоправедность. Это работает в обе стороны.</p> </div> <div class="divider">· · ·</div> <h2 class="heading-serif text-4xl font-bold mt-16 mb-8 border-b border-[#e6e1d5] dark:border-[#2e2c27] pb-4" id="itog">Итог</h2> <div class="note-box" style="border-left:4px solid var(--muted)"> <strong>Ловушка «утопленных затрат».</strong> Почему умные и искренние люди годами остаются в сложной, тяжёлой или внутренне некомфортной церковной ситуации? Иногда дело не в слепоте и не в согласии со всем происходящим. Человек вложил годы жизни, дружбы, семейную историю, труд, служение, деньги, память. Уход тогда переживается не как простая смена адреса, а как потеря целого мира. Поэтому он остаётся: иногда мудро и терпеливо, иногда из страха, иногда ради семьи или людей, которых любит, иногда потому что пока не видит другого доброго пути.
dist/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html:747: "Евреям 9:1–13": "Итак и первый завет имел постановления о богослужении, и святилище принадлежащее к этому миру. Ибо устроена была скиния первая, в которой были и светильник, и стол, и хлебы предложения: она называется \"Святое\". А за второй завесой скиния, называемая , .Святое Святых\", имеющая золотой кадильный жертвенник и ковчег завета, обложенный со всех сторон золотом, и в нем сосуд золотой с манной, и жезл Аарона расцветший и скрижали завета, а над ним херувимы славы, осеняющие очистилище, о чём не время говорить подробно. При таком устройстве, в первую скинию постоянно входят священники, совершая служение, но во вторую - один раз в год только первосвященник не без крови, которую он приносит за себя и за грехи неведения народа. Этим Дух Святой показывает, что еще не открыт путь во святилище, пока существует первая скиния. Она есть притча для настоящего времени, согласно которой приносятся дары и жертвы, не могущие сделать в совести совершенным воздающего служение Богу: это только предписания, относящиеся к плоти, с яствами и питиями и различными омовениями, наложенные до времени исправления. Христос же, придя, как Первосвященник будущих благ, чрез большую и совершеннейшую скинию, нерукотворенную, то есть не этого творения, и не чрез кровь козлов и тельцов, но чрез собственную кровь, - вошел раз навсегда во святилище, приобретя вечное искупление. Ибо, если кровь козлов и быков и пепел телицы окроплением осквернённых освящает к чистоте плоти, -",
dist/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html:798: "1 Коринфянам 15:12–14": "Если же о Христе проповедуется, что Он восстал из мёртвых, - кик говорят некоторые между вами, что нет воскресения мёртвых? Если же нет воскресения мёртвых, - то и Христос не восстал; а если Христос не восстал, тщетна наша проповедь, тщетна и вера ваша.",

## FAQPage root-vs-dist detector nuance
articles/20-antisovetov-pastoru/index.html oldneedle False regex 1
articles/krajne-li-isporcheno-serdce/index.html oldneedle False regex 1
dist/articles/20-antisovetov-pastoru/index.html oldneedle True regex 1
dist/articles/krajne-li-isporcheno-serdce/index.html oldneedle True regex 1
