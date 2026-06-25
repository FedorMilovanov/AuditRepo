# PremiumControls current source evidence — 2026-06-26

## Git
## main...origin/main
106f98d chore: auto-update meta, cache-bust [skip ci]

## Gates snapshot
validate:all: PASS on 106f98d (see report summary)
audit-pro: PASS on 106f98d — 162 passed, 0 errors, 3 warnings
content:guard: PASS on 106f98d
native:runtime:audit:strict: PASS on 106f98d — 51/52 strict-native

## Actual hashes
js/floating-cluster-controller.js ba4a4019 31330
css/floating-cluster.css f4bddc5b 70474
css/site.css b880b524 282788
js/site.js f8f0c38c 165938

## Source hardcoded floating controller/css hashes
      1 58c2ea90
     25 ba4a4019
     14 efd81d3a
      1 ccc70580
      8 f4bddc5b

## PremiumControls / floating cluster files
src/components/ui/floating-cluster/ClusterButton.astro
src/components/ui/floating-cluster/FloatingCluster.astro
src/components/ui/floating-cluster/GillRailControls.astro
src/components/ui/floating-cluster/PlayEmber.astro
src/components/ui/floating-cluster/RomanNumeral.astro
src/components/ui/floating-cluster/SaveButton.astro
src/components/ui/floating-cluster/SeriesLiteCluster.astro
src/components/ui/floating-cluster/SingleArticleCluster.astro
-rw-r--r-- 1 user user 69K Jun 25 23:33 css/floating-cluster.css
-rw-r--r-- 1 user user 31K Jun 25 23:33 js/floating-cluster-controller.js

## Missing planned primitives from attached PDF

## Current usages
src/components/article-pilots/antisovetov/AntisovetovBody.astro: FloatingCluster=3, floating-cluster-controller=1
src/components/article-pilots/antisovetov/AntisovetovPageHead.astro: floating-cluster.css=1
src/components/article-pilots/gill-context/GillContextPageChrome.astro: data-fc-root=2, gb-save=1, floating-cluster-controller=1
src/components/article-pilots/gill-context/GillContextPageHead.astro: data-fc-root=1, floating-cluster.css=1
src/components/article-pilots/gill-part1/GillPart1PageChrome.astro: GillRailControls=4, floating-cluster-controller=1
src/components/article-pilots/gill-part1/GillPart1PageHead.astro: floating-cluster.css=1
src/components/article-pilots/gill-part2/GillPart2PageChrome.astro: GillRailControls=4, floating-cluster-controller=1
src/components/article-pilots/gill-part2/GillPart2PageHead.astro: floating-cluster.css=1
src/components/article-pilots/gill-part3/GillPart3PageChrome.astro: GillRailControls=4, floating-cluster-controller=1
src/components/article-pilots/gill-part3/GillPart3PageHead.astro: floating-cluster.css=1
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro: GillRailControls=4, floating-cluster-controller=1
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro: floating-cluster.css=1
src/components/article-pilots/hermenevtika/HermenevtikaBody.astro: FloatingCluster=4, floating-cluster-controller=1
src/components/article-pilots/hermenevtika/HermenevtikaPageHead.astro: floating-cluster.css=1
src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageChrome.astro: FloatingCluster=3
src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageFooter.astro: floating-cluster-controller=1
src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageHead.astro: floating-cluster.css=1
src/components/article-pilots/krajne/KrajneBody.astro: gb-ember=7, gb-save=1, floating-cluster-controller=1
src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro: gb-ember=7, gb-save=1, floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884Body.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884PageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestPageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaPageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiNochNaKureBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiNochNaKurePageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiPageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiPeterburgskayaLiniyaBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiPeterburgskayaLiniyaPageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatPageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochPageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiVsehib1944Body.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiVsehib1944PageHead.astro: floating-cluster.css=1
src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaBody.astro: floating-cluster-controller=1
src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaPageHead.astro: floating-cluster.css=1
src/components/nagornaya/chast-1/NagornayaChast1PageChrome.astro: data-fc-root=1, gb-ember=7, gb-save=1
src/components/nagornaya/chast-1/NagornayaChast1PageFooter.astro: floating-cluster-controller=1
src/components/nagornaya/chast-2/NagornayaChast2PageChrome.astro: data-fc-root=1, gb-ember=7, gb-save=1
src/components/nagornaya/chast-2/NagornayaChast2PageFooter.astro: floating-cluster-controller=1
src/components/nagornaya/chast-3/NagornayaChast3PageChrome.astro: data-fc-root=1, gb-ember=7, gb-save=1
src/components/nagornaya/chast-3/NagornayaChast3PageFooter.astro: floating-cluster-controller=1
src/components/nagornaya/chast-4/NagornayaChast4PageChrome.astro: data-fc-root=1, gb-ember=7, gb-save=1
src/components/nagornaya/chast-4/NagornayaChast4PageFooter.astro: floating-cluster-controller=1
src/components/nagornaya/chast-5/NagornayaChast5PageChrome.astro: data-fc-root=1, gb-ember=7, gb-save=1
src/components/nagornaya/chast-5/NagornayaChast5PageFooter.astro: floating-cluster-controller=1
src/components/ui/floating-cluster/ClusterButton.astro: gb-save=1
src/components/ui/floating-cluster/GillRailControls.astro: GillRailControls=1, data-fc-controls=1, gb-ember=4, gb-save=3
src/components/ui/floating-cluster/PlayEmber.astro: gb-ember=9
src/components/ui/floating-cluster/SaveButton.astro: gb-save=2
src/components/ui/floating-cluster/SeriesLiteCluster.astro: data-fc-root=1, gb-ember=4, gb-save=3
src/components/ui/floating-cluster/SingleArticleCluster.astro: data-fc-root=1, gb-ember=42, gb-save=14

## Controller speed panel / localStorage / disabled semantics
211-  }
212-
213:  function handlePlayClick() {
214-    // В пилоте audioState=none → показываем toast
215-    var ember = qs('.gb-ember');
216-    var state = ember ? ember.dataset.state : 'idle';
217-    if (state === 'idle' || !state) {
218:      showToast('Озвучка ещё не подключена', false);
219-      return;
220-    }
--
314-      if (e.key === 'd' || e.key === 'D') { e.preventDefault(); toggleTheme(); }
315-      if (e.key === 's' || e.key === 'S') { e.preventDefault(); saveCurrent(); }
316:      if (e.key === 't' || e.key === 'T') { e.preventDefault(); handlePlayClick(); }
317-      if (e.key === 'b' || e.key === 'B') { e.preventDefault(); scrollTop(); }
318-    });
--
347-      if (action === 'theme')     { toggleTheme(); }
348-      else if (action === 'search')    { openSearch(btn); }
349:      else if (action === 'play')      { handlePlayClick(); }
350-      else if (action === 'save')      { saveCurrent(btn); }
351-      else if (action === 'scroll-top'){ scrollTop(); }
--
571-      var speeds = [0.75, 1, 1.25, 1.5, 1.75, 2];
572-      var currentRate = 1;
573:      try { currentRate = parseFloat(localStorage.getItem('gbx-tts-rate')) || 1; } catch(_){}
574-
575-      var panel = document.createElement('div');
--
579-      panel.innerHTML = speeds.map(function(s) {
580-        var active = s === currentRate ? ' is-active' : '';
581:        return '<button class="gb-ember-expand__btn' + active + '" type="button" data-speed="' + s + '" aria-label="Скорость ' + s + '\u00d7" aria-pressed="' + (s === currentRate ? 'true' : 'false') + '">' + s + '\u00d7</button>';
582-      }).join('');
583-
--
593-      function openPanel() {
594-        panel.classList.add('is-open');
595:        ember.setAttribute('aria-expanded', 'true');
596-      }
597-      function closePanel() {
598-        panel.classList.remove('is-open');
599:        ember.setAttribute('aria-expanded', 'false');
600-      }
601-
--
607-
608-      panel.addEventListener('click', function(e) {
609:        var btn = e.target.closest('[data-speed]');
610-        if (btn) {
611-          e.stopPropagation();
612:          var speed = parseFloat(btn.getAttribute('data-speed'));
613:          try { localStorage.setItem('gbx-tts-rate', speed); } catch(_){}
614-          panel.querySelectorAll('.gb-ember-expand__btn').forEach(function(b) {
615:            var isThis = parseFloat(b.getAttribute('data-speed')) === speed;
616-            b.classList.toggle('is-active', isThis);
617-            b.setAttribute('aria-pressed', isThis ? 'true' : 'false');

## CSS source duplication signals
src/components/ui/floating-cluster/GillRailControls.astro:197:  .gb-rail-foot .gb-ember,
src/components/ui/floating-cluster/GillRailControls.astro:202:  .gb-rail-foot .gb-ember__ring-track {
src/components/ui/floating-cluster/GillRailControls.astro:205:  .gb-rail-foot .gb-ember__ring-progress {
src/components/ui/floating-cluster/GillRailControls.astro:210:  .gb-rail-foot .gb-save {
src/components/ui/floating-cluster/GillRailControls.astro:214:  .gb-rail-foot .gb-save svg {
src/components/ui/floating-cluster/GillRailControls.astro:221:  .gb-rail-foot .gb-ember[data-tip]::after {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:115:  .gb-floater--series-lite {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:127:  .gb-floater--series-lite > * {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:181:  .gb-floater--pastor .gb-series-chip__eyebrow {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:186:  .gb-floater--heart .gb-series-chip__eyebrow {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:228:  .gb-series-controls .gb-ember,
src/components/ui/floating-cluster/SeriesLiteCluster.astro:229:  .gb-series-controls .gb-save {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:234:  .gb-series-controls .gb-ember {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:242:    .gb-floater--series-lite {
src/components/ui/floating-cluster/SeriesLiteCluster.astro:285:    .gb-floater--series-lite,
src/components/ui/floating-cluster/SingleArticleCluster.astro:102:  .gb-floater {
src/components/ui/floating-cluster/SingleArticleCluster.astro:122:  .gb-floater--hermeneutics {
src/components/ui/floating-cluster/SingleArticleCluster.astro:127:    .gb-floater--hermeneutics {
src/components/ui/floating-cluster/SingleArticleCluster.astro:133:  .gb-floater > * {
src/components/ui/floating-cluster/SingleArticleCluster.astro:251:  .gb-save {
src/components/ui/floating-cluster/SingleArticleCluster.astro:271:    .gb-save:hover {
src/components/ui/floating-cluster/SingleArticleCluster.astro:275:    html.dark .gb-save:hover {
src/components/ui/floating-cluster/SingleArticleCluster.astro:279:  .gb-save:active { transform: scale(.88); transition: transform .12s cubic-bezier(.4,0,.2,1); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:280:  .gb-save:focus-visible { outline: 2px solid var(--color-accent, #7a2e2e); outline-offset: 4px; border-radius: 50%; }
src/components/ui/floating-cluster/SingleArticleCluster.astro:283:  .gb-save.is-saved { color: var(--color-accent-gold-bright, #d8aa6d); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:284:  .gb-save.is-saved svg {
src/components/ui/floating-cluster/SingleArticleCluster.astro:296:  .gb-save svg {
src/components/ui/floating-cluster/SingleArticleCluster.astro:314:  .gb-ember {
src/components/ui/floating-cluster/SingleArticleCluster.astro:338:  .gb-ember::before {
src/components/ui/floating-cluster/SingleArticleCluster.astro:353:    .gb-ember:hover { transform: scale(1.12); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:354:    .gb-ember:hover::before { opacity: 0.4; transform: scale(1); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:356:  .gb-ember:active { transform: scale(.88); transition: transform .12s cubic-bezier(.4,0,.2,1); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:357:  .gb-ember:active::before { opacity: 0.55; transform: scale(1); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:358:  .gb-ember:focus-visible { outline: 2px solid var(--color-accent, #7a2e2e); outline-offset: 4px; border-radius: 50%; }
src/components/ui/floating-cluster/SingleArticleCluster.astro:359:  .gb-ember:focus-visible::before { opacity: 0.55; transform: scale(1); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:362:  .gb-ember__ring-svg {
src/components/ui/floating-cluster/SingleArticleCluster.astro:374:  .gb-ember[data-state="playing"] .gb-ember__ring-svg,
src/components/ui/floating-cluster/SingleArticleCluster.astro:375:  .gb-ember[data-state="paused"]  .gb-ember__ring-svg,
src/components/ui/floating-cluster/SingleArticleCluster.astro:376:  .gb-ember[data-state="complete"] .gb-ember__ring-svg { opacity: 1; }
src/components/ui/floating-cluster/SingleArticleCluster.astro:378:  .gb-ember__ring-track {
src/components/ui/floating-cluster/SingleArticleCluster.astro:384:  .gb-ember__ring-progress {
src/components/ui/floating-cluster/SingleArticleCluster.astro:395:  .gb-ember__glyph {
src/components/ui/floating-cluster/SingleArticleCluster.astro:403:  .gb-ember__pause {
src/components/ui/floating-cluster/SingleArticleCluster.astro:414:  .gb-ember__check {
src/components/ui/floating-cluster/SingleArticleCluster.astro:428:  .gb-ember[data-state="playing"]  .gb-ember__glyph,
src/components/ui/floating-cluster/SingleArticleCluster.astro:429:  .gb-ember[data-state="paused"]   .gb-ember__glyph,
src/components/ui/floating-cluster/SingleArticleCluster.astro:430:  .gb-ember[data-state="complete"] .gb-ember__glyph { display: none; }
src/components/ui/floating-cluster/SingleArticleCluster.astro:432:  .gb-ember[data-state="playing"] .gb-ember__pause,
src/components/ui/floating-cluster/SingleArticleCluster.astro:433:  .gb-ember[data-state="paused"]  .gb-ember__pause  { display: block; }
src/components/ui/floating-cluster/SingleArticleCluster.astro:434:  .gb-ember[data-state="complete"] .gb-ember__check  { display: block; }
src/components/ui/floating-cluster/SingleArticleCluster.astro:437:  .gb-ember[data-state="playing"]  { color: var(--ring-color); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:438:  .gb-ember[data-state="paused"]   { color: var(--ring-color); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:439:  .gb-ember[data-state="complete"] { color: var(--color-accent-gold-bright, #d8aa6d); }
src/components/ui/floating-cluster/SingleArticleCluster.astro:442:  .gb-ember.is-loading::before {
src/components/ui/floating-cluster/SingleArticleCluster.astro:451:  html.dark .gb-ember {
src/components/ui/floating-cluster/SingleArticleCluster.astro:461:    .gb-floater {
src/components/ui/floating-cluster/SingleArticleCluster.astro:478:    html.dark .gb-floater {
src/components/ui/floating-cluster/SingleArticleCluster.astro:558:    .gb-icon, .gb-ember, .gb-save, .gb-theme-toggle svg,
src/components/ui/floating-cluster/SingleArticleCluster.astro:559:    .gb-floater, .gb-fc-toast {
css/floating-cluster.css:16:.gb-floater {
css/floating-cluster.css:28:.gb-floater > * {
css/floating-cluster.css:145:.gb-ember {
css/floating-cluster.css:169:.gb-ember::before {
css/floating-cluster.css:184:  .gb-ember:hover { transform: scale(1.12); }
css/floating-cluster.css:185:  .gb-ember:hover::before { opacity: 0.4; transform: scale(1); }
css/floating-cluster.css:187:.gb-ember:active { transform: scale(.88); transition: transform .12s cubic-bezier(.4,0,.2,1); }
css/floating-cluster.css:188:.gb-ember:active::before { opacity: 0.55; transform: scale(1); }
css/floating-cluster.css:189:.gb-ember:focus-visible { outline: 2px solid var(--color-accent, #7a2e2e); outline-offset: 4px; border-radius: 50%; }
css/floating-cluster.css:190:.gb-ember:focus-visible::before { opacity: 0.55; transform: scale(1); }
css/floating-cluster.css:193:.gb-ember__ring-svg {
css/floating-cluster.css:205:.gb-ember[data-state="playing"]  .gb-ember__ring-svg,
css/floating-cluster.css:206:.gb-ember[data-state="paused"]   .gb-ember__ring-svg,
css/floating-cluster.css:207:.gb-ember[data-state="complete"] .gb-ember__ring-svg { opacity: 1; }
css/floating-cluster.css:209:.gb-ember__ring-track {
css/floating-cluster.css:215:.gb-ember__ring-progress {
css/floating-cluster.css:226:.gb-ember__glyph {
css/floating-cluster.css:234:.gb-ember__pause {
css/floating-cluster.css:245:.gb-ember__check {
css/floating-cluster.css:259:.gb-ember[data-state="playing"]  .gb-ember__glyph,
css/floating-cluster.css:260:.gb-ember[data-state="paused"]   .gb-ember__glyph,
css/floating-cluster.css:261:.gb-ember[data-state="complete"] .gb-ember__glyph { display: none; }
css/floating-cluster.css:263:.gb-ember[data-state="playing"] .gb-ember__pause,
css/floating-cluster.css:264:.gb-ember[data-state="paused"]  .gb-ember__pause  { display: block; }
css/floating-cluster.css:265:.gb-ember[data-state="complete"] .gb-ember__check  { display: block; }
css/floating-cluster.css:268:.gb-ember[data-state="playing"]  { color: var(--ring-color); }
css/floating-cluster.css:269:.gb-ember[data-state="paused"]   { color: var(--ring-color); }
css/floating-cluster.css:270:.gb-ember[data-state="complete"] { color: var(--color-accent-gold-bright, #d8aa6d); }
css/floating-cluster.css:273:.gb-ember.is-loading::before {
css/floating-cluster.css:282:html.dark .gb-ember {
css/floating-cluster.css:292:.gb-save {
css/floating-cluster.css:311:  .gb-save:hover {
css/floating-cluster.css:315:  html.dark .gb-save:hover {
css/floating-cluster.css:319:.gb-save:active { transform: scale(.88); transition: transform .12s cubic-bezier(.4,0,.2,1); }
css/floating-cluster.css:320:.gb-save:focus-visible { outline: 2px solid var(--color-accent, #7a2e2e); outline-offset: 4px; border-radius: 50%; }
css/floating-cluster.css:322:.gb-save.is-saved { color: var(--color-accent-gold-bright, #d8aa6d); }
css/floating-cluster.css:323:.gb-save.is-saved svg {
css/floating-cluster.css:335:.gb-save svg {
css/floating-cluster.css:395:.gb-floater--series-lite {
css/floating-cluster.css:407:.gb-floater--series-lite > * {
css/floating-cluster.css:459:.gb-floater--pastor .gb-series-chip__eyebrow {
css/floating-cluster.css:464:.gb-floater--heart .gb-series-chip__eyebrow {
css/floating-cluster.css:504:.gb-series-controls .gb-ember,
css/floating-cluster.css:505:.gb-series-controls .gb-save {
css/floating-cluster.css:510:.gb-series-controls .gb-ember {
css/floating-cluster.css:518:  .gb-floater {
css/floating-cluster.css:535:  html.dark .gb-floater {
css/floating-cluster.css:545:  .gb-floater--series-lite {
css/floating-cluster.css:559:  .gb-floater--series-lite .gb-series-chip {
css/floating-cluster.css:597:  .gb-icon, .gb-ember, .gb-save, .gb-theme-toggle svg,
css/floating-cluster.css:598:  .gb-floater, .gb-floater--series-lite, .gb-fc-toast {
css/floating-cluster.css:824:[data-gill-v16] .gbs-rail-foot .gb-ember{--ember-size:32px;--ring-color:var(--gb-accent-gold-bright,#d8aa6d);color:#c4a882}
css/floating-cluster.css:825:[data-gill-v16] .gbs-rail-foot .gb-ember__ring-track{stroke:rgba(232,184,120,.22)}
css/floating-cluster.css:826:[data-gill-v16] .gbs-rail-foot .gb-ember__ring-progress{stroke-width:1.5}
css/floating-cluster.css:827:[data-gill-v16] .gbs-rail-foot .gb-save{width:32px;height:32px;color:#c4a882}
css/floating-cluster.css:828:[data-gill-v16] .gbs-rail-foot .gb-save svg{width:17px;height:17px}
css/floating-cluster.css:830:[data-gill-v16] .gbs-rail-foot__btn[data-tip]::after,.gbs-rail-foot .gb-ember[data-tip]::after{
css/floating-cluster.css:845:[data-gill-v16] .gbs-rail-foot .gb-ember[data-tip]:hover::after,.gbs-rail-foot .gb-ember[data-tip]:focus-visible::after{
css/floating-cluster.css:903:[data-gill-v16] .mobile-icon-row .gb-ember{--ember-size:34px}
css/floating-cluster.css:904:[data-gill-v16] .mobile-icon-row .gb-ember__glyph{width:14px;height:14px}
css/floating-cluster.css:905:[data-gill-v16] .mobile-icon-row .gb-ember__pause{width:14px;height:14px}

## Route archetype notes from PDF extracted plan
21:PremiumControlAnchor отвечает за размещение, PremiumControls — за SVG/UI-вариант, 
22:premium-controls-controller.js — за поведение. CSS должен стать единым canonical source;
73:Acceptance criteria должны быть формализованы до кодинга, иначе слабый агент опять уйдёт в
121:single-anchor
154:gill-rail
226:exemplar для article-breadcrumb. Gill-context — не “пример статьи”, а exemplar для gill-
235:PremiumControlAnchor — чисто layout-компонент. Его единственная работа — занять старый
243:series-lite, gill-rail, gill-mobile. Именно здесь должны жить визуальные токены
245:premium-controls-controller.js — runtime-layer . Он инициализирует все roots, реализует
259:Для Hermeneutics и других article-breadcrumb-маршрутов DOM-шаги должны быть почти
263:positioning. Затем в этот же slot вставляется PremiumControlAnchor. Ключевая операция: 
274:anchor="article-breadcrumb">
288:PremiumControlAnchor
345:осознанный gill-rail contract: desktop route chrome с rail-foot root и отдельный mobile-bottom
351:CSS-архитектура и runtime contract
369:js/premium-controls-controller.js         # canonical controller
393:[data-pc-variant="gill-rail"] {
467:Минимальный Playwright contract для article-breadcrumb должен быть таким:
504:а также отсутствие legacy article controls на route chrome. Для gill-rail acceptance важнее не
533:Фазы rollout, file sets и rollback
560:PremiumControlAnchor,
583:article-breadcrumb
682:PremiumControlAnchor,
691:article-breadcrumb
722:PremiumControlAnchor в тот же slot, переносит старые top/right на anchor , а внутренний
734:control system, а не ещё одной плавающей штукой. На article-breadcrumb routes система
736:геометрии. На gill-rail routes она обязана быть частью route chrome. На app/routes и
