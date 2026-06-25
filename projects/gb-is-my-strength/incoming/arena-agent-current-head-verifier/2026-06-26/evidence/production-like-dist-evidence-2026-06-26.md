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
