const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
let imports=0,licenses=0;
for(const project of ['atlas','sozvezdie']){
 const base=path.join(root,project);
 const main=fs.readFileSync(path.join(base,'src','main.tsx'),'utf8');
 const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
 // Research content is not yet publication-approved. Any standalone Vite
 // artifact must explicitly opt out of indexing until Product owns release.
 const robots=html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
 if(!robots||!['noindex','nofollow'].every(token=>
   robots[1].split(/\s*,\s*/).includes(token)))
   throw Error(project+' prototype unexpectedly indexable before Research release');
 if(/fonts\.(googleapis|gstatic)\.com/.test(html))throw Error(project+' has external font CDN');
 if(/\/\/[^\n]*\\nimport/.test(main))throw Error(project+' has a font import hidden in a comment');
 const matches=[...main.matchAll(/import\s+["'](@fontsource(?:-variable)?\/([^/"']+)\/([^"']+\.css))["'];/g)];
 if(matches.length<10)throw Error(project+' insufficient font stylesheet imports: '+matches.length);
 const deps=require(path.join(base,'package.json')).dependencies||{};
 for(const [,full,family,css] of matches){
  const isVariable=full.startsWith('@fontsource-variable/');
  const prefix=isVariable?'@fontsource-variable':'@fontsource';
  const pkg=prefix+'/'+family;
  if(deps[pkg]!=='5.3.0')throw Error('Unpinned '+pkg);
  const dir=path.join(base,'node_modules',prefix,family);
  if(!fs.existsSync(path.join(dir,css)))throw Error('Unknown font CSS '+full);
  const metadata=require(path.join(dir,'package.json'));
  if(metadata.license!=='OFL-1.1')throw Error('License unknown '+pkg);
  const licenseFile=path.join(base,'public','font-licenses',pkg.replace('/','--').replace('@','')+'-OFL.txt');
  if(!fs.existsSync(licenseFile)||!fs.readFileSync(licenseFile,'utf8').includes('SIL OPEN FONT LICENSE'))throw Error('Missing distributed OFL '+pkg);
  imports++;
 }
 const counts=new Set(matches.map(x=>(x[1].startsWith('@fontsource-variable/')?'@fontsource-variable/':'@fontsource/')+x[2]));
 licenses+=counts.size;
 console.log('PASS',project,'CSS_IMPORTS',matches.length,'LICENSE_PACKAGES',counts.size);
}
console.log('V13_SOURCE_CONTRACT_PASS',JSON.stringify({imports,licensePackages:licenses}));

// The seven Johannine predicate sayings are not seven separate Hebrew proper names.
// Keep thematic OT references distinct from literal name-equivalences.
const sevenIAm=fs.readFileSync(path.join(root,'atlas','src','components','SevenIAmStatements.tsx'),'utf8');
const thematicFields=[...sevenIAm.matchAll(/otThematicParallel:\s*'/g)];
if(thematicFields.length!==7)throw Error('Seven I-am sayings must carry seven explicit thematic OT contexts: '+thematicFields.length);
for(const banned of [
 'Ветхозаветное имя-параллель',
 'Эль-Бетель (Врата небесные)',
 'Яхве-Цидкену (Путь святых',
 'Произнесено во дворе храма в праздник Кущей',
 'пастух ночью сам ложился в проёме'
])if(sevenIAm.includes(banned))throw Error('Unsafe thematic equivalence returned: '+banned);
if(!sevenIAm.includes('Ветхозаветный тематический контекст: {current.otThematicParallel}')||
   !sevenIAm.includes('Слова Ин. 8:58 рассматриваются отдельно'))
 throw Error('Seven I-am theological classification note missing');
console.log('V13_IAM_THEMATIC_SCOPE_PASS',thematicFields.length);

const atlasModal=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
if(!atlasModal.includes('data-atlas-expression-type') ||
   !atlasModal.includes('Тип библейского выражения: {entry.category}') ||
   !atlasModal.includes('<strong>Смысл в контексте:</strong> {entry.literalMeaning}') ||
   !atlasModal.includes('Христианское прочтение во свете Христа'))
  throw Error('Atlas expanded dossier must distinguish textual type, contextual sense and Christian interpretation');
if(atlasModal.includes('<strong>Буквальное значение:</strong>'))
  throw Error('Atlas still asserts contested etymology as a literal meaning');
console.log('V13_ATLAS_MODAL_CLASSIFICATION_PASS');

// Displayed counts describe editorial expressions, not 29/36 distinct personal names.
const readerTree=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameTree.tsx'),'utf8');
const atlasExplorer=fs.readFileSync(path.join(root,'atlas','src','components','DivineConstellationExplorer.tsx'),'utf8');
if(!readerTree.includes('Девять выражений с ЯХВЕ') || readerTree.includes('Девять имён с ЯХВЕ') ||
   readerTree.includes('the nine compound names built on'))
 throw Error('Reader constellation incorrectly treats YHWH place/altar/city titles as nine proper names');
if(!atlasExplorer.includes('36 исследуемых библейских выражений') ||
   atlasExplorer.includes('36 рассмотренных имён и титулов Бога'))
 throw Error('Atlas catalogue wrongly presents 36 positions as canonical proper names');
console.log('V13_SCOPE_LANGUAGE_CONTRACT_PASS');

// A position count is not a count of personal divine names. Preserve this
// editorial distinction in visible summaries and accessible control titles.
const atlasUiSummary=fs.readFileSync(path.join(root,'atlas','src','App.tsx'),'utf8');
const atlasUiNavbar=fs.readFileSync(path.join(root,'atlas','src','components','SiteNavbar.tsx'),'utf8');
const atlasUiPillars=fs.readFileSync(path.join(root,'atlas','src','components','LateralNamePillars.tsx'),'utf8');
if (!atlasUiSummary.includes("label: 'библейских выражений'") ||
    !atlasUiSummary.includes('{sectionCount} позиций') ||
    !atlasUiSummary.includes('{sectionNames.length} исследуемых выражений') ||
    atlasUiSummary.includes("label: 'имён и титулов Бога'") ||
    atlasUiSummary.includes('{sectionCount} имён') ||
    atlasUiNavbar.includes('из ${totalCount} имён') ||
    atlasUiNavbar.includes('36 рассмотренных имён') ||
    atlasUiPillars.includes('36 рассмотренных имён и титулов'))
 throw Error('Atlas editorial count regressed from positions to proper names');
console.log('V13_ATLAS_EDITORIAL_POSITION_COUNT_PASS');

const atlasUiHero=fs.readFileSync(path.join(root,'atlas','src','components','SacredAstrolabeHero.tsx'),'utf8');
if (!atlasUiHero.includes('Сводная схема · 36 позиций') ||
    atlasUiHero.includes('Созвездие 36 рассмотренных имён') ||
    atlasUiHero.includes('36 именований и формул (еврейский'))
 throw Error('Atlas hero mislabeled its internal 36-position overview as canonical names');
console.log('V13_ATLAS_HERO_SCOPE_PASS');
// W70 reader-facing names: sober and accurate; legacy identifiers remain stable.
// No URL/storage-key, research, immutable source or Product migration in this PR.
const brandAtlasHtml=fs.readFileSync(path.join(root,'atlas','index.html'),'utf8');
const brandReaderHtml=fs.readFileSync(path.join(root,'sozvezdie','index.html'),'utf8');
const brandAtlasHero=fs.readFileSync(path.join(root,'atlas','src','components','SacredAstrolabeHero.tsx'),'utf8');
const brandReaderHero=fs.readFileSync(path.join(root,'sozvezdie','src','components','Hero.tsx'),'utf8');
const brandReaderIndex=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameGrid.tsx'),'utf8');
const brandReaderMap=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameTree.tsx'),'utf8');
const brandReaderSection=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameSection.tsx'),'utf8');
const brandAtlasArticle=fs.readFileSync(path.join(root,'atlas','src','App.tsx'),'utf8');
const brandAtlasIndex=fs.readFileSync(path.join(root,'atlas','src','components','DivineConstellationExplorer.tsx'),'utf8');
const brandAtlasModal=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
if (!brandAtlasHtml.includes('<title>Атлас имён Бога — библейское исследование') ||
    !brandAtlasHtml.includes('"headline": "Атлас имён Бога — библейское исследование"') ||
    !brandReaderHtml.includes('<title>Панорама имён Бога — чтение') ||
    !brandReaderHtml.includes('"headline": "Панорама имён Бога — исследование Писания"') ||
    !brandAtlasHero.includes('Панорама имён Бога · 29 разделов') ||
    !brandReaderHero.includes('Атлас имён Бога · 36 исследуемых выражений') ||
    !brandAtlasIndex.includes('Атлас имён Бога · интерактивный указатель') ||
    !brandReaderIndex.includes('Панорама имён') ||
    !brandReaderMap.includes('Навигация по схеме') ||
    !brandReaderSection.includes('Атлас имён Бога · открыть разбор') ||
    !brandReaderSection.includes('в Атласе имён Бога') ||
    brandAtlasArticle.includes('даёт нам целое созвездие имён') ||
    brandAtlasArticle.includes('«созвездие» имён') ||
    !brandAtlasModal.includes('в Панораме имён Бога') ||
    !brandAtlasModal.includes('min-w-0 break-normal text-center">Панорама имён Бога</span>') ||
    !brandAtlasModal.includes('hidden h-3.5 w-3.5 shrink-0 sm:block') ||
    !brandAtlasModal.includes('data-modal-footer') ||
    brandAtlasModal.includes('font-ui order-4') ||
    brandAtlasModal.includes('font-ui order-3') ||
    brandAtlasModal.includes('font-ui order-2') ||
    brandAtlasModal.includes('font-ui order-1') ||
    !brandAtlasModal.includes('col-span-2 inline-flex min-h-[44px]') ||
    !brandAtlasModal.includes('sm:col-auto sm:min-h-11') ||
    brandAtlasModal.includes('в Созвездии') ||
    [brandAtlasHtml,brandReaderHtml,brandAtlasHero,brandReaderHero,
     brandReaderIndex,brandReaderMap,brandReaderSection,brandAtlasIndex,brandAtlasModal].some(
      s=>/Астролябия имён|астролябию|астролябия и атлас|Созвездие имён|Созвездие складывается|Фокус созвездия|Другой флагман|Второй флагман/.test(s)))
  throw Error('W70 editorial naming and cross-format links mismatch');
console.log('W70_EDITORIAL_NAMING_PASS');

// W74: authored Russian breaks must survive 200%-root font reflow.
// 44px minimum modal footer control height must not silently regress.
if(!brandAtlasArticle.includes('data-atlas-intro-title')||
   !brandAtlasArticle.includes('Почему Бог откры&shy;вает')||
   !brandAtlasArticle.includes("overflowWrap: 'normal'")||
   !brandAtlasArticle.includes("hyphens: 'manual'")||
   brandAtlasModal.slice(brandAtlasModal.indexOf('data-modal-footer')).includes('min-h-10'))
 throw Error('W74 Russian intro hyphenation or dossier control height drift');
console.log('V13_W74_RUSSIAN_REFLOW_FOOTER_TARGETS_PASS');

// W76: keep the zoomed Atlas dossier header navigable and entirely visible.
if(!brandAtlasModal.includes('data-modal-header')||
   !brandAtlasModal.includes('data-modal-position')||
   !brandAtlasModal.includes('data-modal-header-tools')||
   !brandAtlasModal.includes('max-w-full flex-wrap items-center justify-end')||
   brandAtlasModal.includes('min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap'))
 throw Error('W76 dossier header reflow contract failure');
console.log('V13_W76_DOSSIER_HEADER_REFLOW_PASS');

// W78: icon-only buttons retain a 44px target at 200%-root text while
// the real textual badge and study label still enlarge and reflow naturally.
if(!brandAtlasModal.includes('data-modal-header-tools className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-end gap-[6px]')||
   !brandAtlasModal.includes('h-[44px] w-[44px] shrink-0 cursor-pointer')||
   !brandAtlasModal.includes('sm:h-11 sm:w-11'))
 throw Error('W78 zoomed icon controls no longer fit a single accessible row');
console.log('V13_W78_ZOOMED_ICON_CONTROLS_PASS');

// W79: preserve 44px targets and full a11y names while letting 200%-zoom
// mobile visitors actually read the dossier rather than only its toolbars.
if(!brandAtlasModal.includes('data-modal-studied')||
   !brandAtlasModal.includes('aria-pressed={isStudied}')||
   !brandAtlasModal.includes('aria-label={prevEntry ?')||
   !brandAtlasModal.includes('aria-label={nextEntry ?')||
   !brandAtlasModal.includes('<span className="sm:hidden">Назад</span>')||
   !brandAtlasModal.includes('<span className="sm:hidden">Далее</span>')||
   !brandAtlasModal.includes('grid grid-cols-2 gap-[6px] border-t')||
   !brandAtlasModal.includes('min-h-[44px] w-full min-w-0 cursor-pointer')||
   !brandAtlasModal.includes('sm:col-auto sm:min-h-11'))
 throw Error('W79 compact dossier controls/a11y/reading layout regressed');
console.log('V13_W79_DOSSIER_READING_ROOM_PASS');

// W80: text must reflow inside clipped cards, not merely inside page width.
if(!brandAtlasModal.includes('data-modal-name-banner')||
   !brandAtlasModal.includes('id="modal-divine-name-title"')||
   !brandAtlasModal.includes('min-w-0 break-words [overflow-wrap:anywhere]')||
   !brandAtlasModal.includes("hyphens: 'manual'")||
   !brandAtlasModal.includes("entry.transliteration.replace(/Тетраграмматон/gu, 'Тетра"+String.fromCharCode(92)+"u00adграмматон')"))
 throw Error('W80 Atlas long title inside clipping banner has no verified break');
const w80Verse=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameSection.tsx'),'utf8');
if(!w80Verse.includes('data-verse-card')||
   !w80Verse.includes('data-verse-copy-action')||
   !w80Verse.includes('data-verse-copy-label')||
   !w80Verse.includes('min-w-0 max-w-full flex-col items-center justify-center')||
   w80Verse.includes('inline-flex shrink-0 items-center gap-1.5 rounded-full'))
 throw Error('W80 Reader verse action is clipped or lacks regression landmarks');
console.log('V13_W80_LOCAL_CLIP_GLYPH_CONTRACT_PASS');

// W81: full 200%-root zoom must retain intact Cyrillic words, not
// paint the copy-verse action as an accessible-but-unreadable letter column.
if(!w80Verse.includes('data-verse-card className="card-parchment sheen relative overflow-hidden rounded-2xl border border-gold-500/25 p-[16px]')||
   !w80Verse.includes('min-h-[44px] min-w-0 max-w-full flex-col')||
   !w80Verse.includes('tracking-normal text-cream-400')||
   !w80Verse.includes('sm:flex-row')||
   !w80Verse.includes('min-w-0 whitespace-normal break-normal [overflow-wrap:normal]')||
   !w80Verse.includes('sm:tracking-[0.35em]')||
   w80Verse.includes('data-verse-copy-label className="min-w-0 break-words [overflow-wrap:anywhere]'))
 throw Error('W81 copy-verse typography or card spacing regression');
console.log('V13_W81_READABLE_VERSE_ACTION_PASS');


const readerSection=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameSection.tsx'),'utf8');
const readerEpilogue=fs.readFileSync(path.join(root,'sozvezdie','src','components','Epilogue.tsx'),'utf8');

// W82: footer interaction must fit the viewport at 200% root text.
// Cropping under overflow-hidden is not an acceptable responsive strategy.
if(!readerEpilogue.includes('data-library-return-link')||
   !readerEpilogue.includes('data-library-return-text')||
   !readerEpilogue.includes('data-library-further-link')||
   !readerEpilogue.includes('max-w-3xl px-[16px]')||
   !readerEpilogue.includes('min-h-[44px] min-w-0 max-w-full flex-wrap')||
   !readerEpilogue.includes('tracking-normal text-cream-500')||
   !readerEpilogue.includes('min-w-0 break-all [overflow-wrap:anywhere]')||
   readerEpilogue.includes('inline-flex items-center gap-3 rounded-full border border-gold-500/30 bg-ink-900/70 px-8'))
 throw Error('W82 zoomed footer links/return CTA would clip');
console.log('V13_W82_FOOTER_REFLOW_PASS');

// W86: the email is one exact mailto target; a semantic wrapping opportunity
// after @ replaces the indiscriminate break-all orphan at 200% root text.
if(!readerEpilogue.includes('href="mailto:viktorcoy2012@gmail.com"')||
   !readerEpilogue.includes('data-footer-email-link')||
   !readerEpilogue.includes('data-footer-email-address className="min-w-0 [overflow-wrap:anywhere] [word-break:normal]"')||
   !readerEpilogue.includes('viktorcoy2012@<wbr />gmail.com')||
   readerEpilogue.includes('className="min-w-0 break-all [overflow-wrap:anywhere]">viktorcoy2012@gmail.com'))
 throw Error('W86 email wrapping or mailto content regression');
const w86Visual=fs.readFileSync(path.join(root,'checks','visual_review.cjs'),'utf8');
if(!w86Visual.includes('panorama-footer-email-word-integrity-root200')||
   !w86Visual.includes('d.footerEmail.domainRows!==1')||
   !w86Visual.includes('d.footerEmail.localRows!==1')||
   !w86Visual.includes("'-root200-footer-email'"))
 throw Error('W86 screenshot and per-glyph address witness missing');
console.log('V13_W86_EMAIL_SEMANTIC_REFLOW_PASS');

// W87: reader settings must fit a short landscape viewport with 200% text,
// retaining keyboard Escape and a scrollable, reachable last action.
const w87Navbar=fs.readFileSync(path.join(root,'atlas','src','components','SiteNavbar.tsx'),'utf8');
const w87Visual=fs.readFileSync(path.join(root,'checks','visual_review.cjs'),'utf8');
if(!w87Navbar.includes('max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain')||
   !w87Visual.includes('async function visitShortLandscape(')||
   !w87Visual.includes('atlas-short-landscape-settings-last-action')||
   !w87Visual.includes('atlas-short-landscape-panel-outside-viewport')||
   !w87Visual.includes('atlas-short-landscape-escape')||
   !w87Visual.includes('[[568,320],[844,390]]'))
 throw Error('W87 landscape reader settings boundary witness missing');
console.log('V13_W87_LANDSCAPE_READER_SETTINGS_PASS');

// W87b: compact brand is deliberate at 568px with 200% text, rather
// than a clipped first name plus a two-line extension. Browser acceptance
// must also prove Escape completion, not call a Python-only Playwright API.
if(w87Navbar.includes('min-[440px]:inline')||
   (w87Navbar.match(/min-\[640px\]:inline/g)||[]).length!==2||
   !w87Visual.includes('atlas-short-landscape-header-brand')||
   !w87Visual.includes('atlas-short-landscape-brand-clipped')||
   !w87Visual.includes("await trigger.getAttribute('aria-expanded')")||
   w87Visual.includes("trigger.get_attribute(")||
   !w87Visual.includes('panelWidth:r.width,panelHeight:r.height'))
 throw Error('W87b short-landscape header brand or test API regression');
console.log('V13_W87B_LANDSCAPE_BRAND_PASS');

// W83: the visual-harness must prove image decode and actual in-article
// 1440px rails before capture; arbitrary sleeps are not acceptance evidence.
const w83Visual=fs.readFileSync(path.join(root,'checks','visual_review.cjs'),'utf8');
if(!w83Visual.includes('async function waitPanoramaHeroImage(')||
   !w83Visual.includes('await el.decode()')||
   !w83Visual.includes('panorama-sinai-image-ready')||
   !w83Visual.includes('contentViewportWidth:viewport')||
   !w83Visual.includes('containerWidth:container?.width')||
   !w83Visual.includes('evidence.width<evidence.containerWidth-2')||
   w83Visual.includes('evidence.width<width-2')||
   !w83Visual.includes('async function expectPanoramaReaderRails(')||
   !w83Visual.includes('panorama-reader-rails-visible')||
   !w83Visual.includes('panorama-reader-rails-not-ready')||
   !w83Visual.includes('minButtonOpacity')||
   !w83Visual.includes('Number(s.opacity)>.98')||
   !w83Visual.includes("expectPanoramaReaderRails(page,engine,width,'03-reader')")||
   !w83Visual.includes("expectPanoramaReaderRails(page,engine,width,'04-hebrew')")||
   !w83Visual.includes("expectPanoramaReaderRails(page,engine,width,'05-deep')")||
   !w83Visual.includes("expectPanoramaReaderRails(page,engine,width,'07-letter-detail')"))
 throw Error('W83 screenshot witness must wait for loaded Sinai and visible reader rails');
console.log('V13_W83_SCREENSHOT_LIFECYCLE_WITNESSES_PASS');

// W85: responsive rails must be visible in WebKit's 1430px *content*
// viewport when the outer configured window is 1440px. Use deliberate
// layout thresholds, not a WebKit UA special case or hidden screenshots.
const w85Rails=fs.readFileSync(path.join(root,'sozvezdie','src','components','Rails.tsx'),'utf8');
if(!w85Rails.includes('wide ? "2xl:block" : "min-[1400px]:block"')||
   w85Rails.includes('min-[1440px]:block')||
   !w83Visual.includes('panorama-rail-timeout-diagnostics')||
   !w83Visual.includes("mq1400:matchMedia('(min-width: 1400px)').matches")||
   !w83Visual.includes('evidence.rails[0].right>evidence.measure.left-8')||
   !w83Visual.includes('evidence.rails[1].left<evidence.measure.right+8'))
 throw Error('W85 responsive rails or overlap witness regressed');
console.log('V13_W85_WEBKIT_RAIL_BREAKPOINT_PASS');
if(readerSection.includes('«Я есмь» и составные имена') ||
   !readerSection.includes('«Я есмь» и связанные выражения') ||
   !readerEpilogue.includes('но не {NAMES.length}') ||
   readerEpilogue.includes('Все имена этой страницы'))
 throw Error('Reader related-section or epilogue reintroduced false proper-name counts');
console.log('V13_READER_SEMANTIC_SCOPE_PASS');

// These guards target the visual-system regressions found in the 138-frame
// manual review. They complement (not replace) real browser screenshots.
const qAtlasModal=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
const qAtlasNavbar=fs.readFileSync(path.join(root,'atlas','src','components','SiteNavbar.tsx'),'utf8');
const qAtlasPillars=fs.readFileSync(path.join(root,'atlas','src','components','LateralNamePillars.tsx'),'utf8');
const qAtlasCard=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameTiltCard.tsx'),'utf8');
const qDarkDock=fs.readFileSync(path.join(root,'sozvezdie','src','components','ReaderDock.tsx'),'utf8');
const qMobileIndex=fs.readFileSync(path.join(root,'sozvezdie','src','components','MobileIndex.tsx'),'utf8');
const qReaderApp=fs.readFileSync(path.join(root,'sozvezdie','src','App.tsx'),'utf8');
if(!qDarkDock.includes('createPortal(toolbar, headerSlot)')||
   !qMobileIndex.includes('createPortal(')||
   !qMobileIndex.includes('bg-ink-950 xl:hidden')||
   qMobileIndex.includes('bg-ink-950/96')||
   qMobileIndex.includes('fixed left-1/2 z-40')||
   !qReaderApp.includes('sozvezdie-header-index-slot')||
   !qReaderApp.includes('sozvezdie-header-reader-slot'))
  throw Error('Sozvezdie P1: compact controls must be header-only and index opaque');
if (!qAtlasNavbar.includes("backgroundColor: 'var(--gb-bg)'") ||
    qAtlasNavbar.includes("backdropFilter: 'blur(18px) saturate(150%)'"))
  throw Error('Visual regression: header text shines through the nav');
if (!qAtlasModal.includes('inline-block max-w-full whitespace-normal [overflow-wrap:anywhere]') ||
    !qAtlasModal.includes('data-modal-original') ||
    !qAtlasModal.includes('data-greek-original-token') ||
    !qAtlasModal.includes("entry.original.replace(/(τὸ|"))
  throw Error('Visual regression: Greek articles can become orphan glyphs');
if (!qAtlasModal.includes('sm:flex-row sm:flex-wrap sm:items-center sm:justify-between') ||
    !qAtlasModal.includes('data-modal-header-tools') ||
    !qAtlasModal.includes('max-w-full flex-wrap items-center justify-end') ||
    !qAtlasModal.includes('h-[44px] w-[44px] shrink-0') ||
    !qAtlasModal.includes('sm:min-h-11 sm:min-w-11'))
  throw Error('Visual regression: narrow dossier header must keep 44px icon controls');
if (!qAtlasPillars.includes('sm:flex-row sm:items-center sm:justify-between') ||
    !qAtlasPillars.includes('onMobileDrawerOpenChange') ||
    qAtlasPillars.includes('data-atlas-mobile-ribbon') ||
    !qAtlasPillars.includes('Указатель выражений Писания'))
  throw Error('Visual regression: mobile drawer or reading-action clearance lost');
if (!qAtlasCard.includes('data-atlas-card-actions') ||
    !qAtlasCard.includes('min-h-11') ||
    qAtlasCard.includes('<span>Исполнение во Христе Иисусе</span>'))
  throw Error('Visual regression: Atlas actions or editorial interpretation labels lost');
if (!qDarkDock.includes('createPortal(toolbar, headerSlot)') ||
    qDarkDock.includes('opacity-0 pointer-events-none') ||
    qDarkDock.includes('fixed bottom-[5.2rem]') ||
    !qDarkDock.includes('relative z-10') ||
    !qDarkDock.includes('bg-ink-950 px-1.5'))
  throw Error('Visual regression: reader controls must be integrated in the header, not over prose');
let darkTiny=0, darkFiles=0;
for (const file of fs.readdirSync(path.join(root,'sozvezdie','src','components'))) {
  if (!file.endsWith('.tsx')) continue;
  const source=fs.readFileSync(path.join(root,'sozvezdie','src','components',file),'utf8');
  darkTiny+=(source.match(/text-\[(?:7|8|8\.5|9|9\.5|10|10\.5|11)px\]/g)||[]).length;
  darkFiles++;
}
if (darkTiny || /text-\[(?:7|8|8\.5|9|9\.5|10|10\.5|11)px\]/.test(
 fs.readFileSync(path.join(root,'sozvezdie','src','App.tsx'),'utf8')))
  throw Error('Visual regression: metadata scale below 12px');
console.log('V13_VISUAL_SYSTEM_CONTRACT_PASS',JSON.stringify({darkFiles,tinyUtilityCount:darkTiny}));


// VIS-02/03/07: a desktop-only ribbon may not return over mobile prose;
// long Russian editorial headings need actual discretionary word boundaries.
const atlasReaderText=fs.readFileSync(path.join(root,'atlas','src','App.tsx'),'utf8');
const atlasReaderCss=fs.readFileSync(path.join(root,'atlas','src','index.css'),'utf8');
if (!qAtlasNavbar.includes('id="gb-mobile-atlas-nav-trigger"') ||
    qAtlasPillars.includes('data-atlas-launcher-shell') ||
    !qAtlasNavbar.includes('min-[1440px]:hidden inline-flex') ||
    !atlasReaderText.includes('закли&shy;нание') ||
    !atlasReaderText.includes('само&shy;от&shy;кро&shy;ве&shy;ние') ||
    !atlasReaderCss.includes('hyphens: auto;') ||
    qAtlasPillars.includes('text-[10px]') ||
    qAtlasPillars.includes('text-[11px]')) {
  throw Error('VIS02/VIS03/VIS07 regression: mobile dock or editorial typography');
}
if (!atlasReaderText.includes('data-resume-reading-inline') ||
    atlasReaderText.includes('no-print fixed bottom-20 left-4')) {
  throw Error('Reader resume prompt must be inline with accessible targets');
}
const visualAtlasBrowserContract=fs.readFileSync(path.join(root,'checks','browser.cjs'),'utf8');
if (/\?{3,}/.test(atlasReaderText) || /\?{3,}/.test(visualAtlasBrowserContract)) {
  throw Error('Corrupted multi-question-mark UI strings detected; preserve Cyrillic UTF-8');
}
console.log('V13_VISUAL_PROSE_AND_HEADER_TRIGGER_PASS');


const atlasCatalog=fs.readFileSync(path.join(root,'atlas','src','components','DivineConstellationExplorer.tsx'),'utf8');
const atlasTable=fs.readFileSync(path.join(root,'atlas','src','components','NamesIndexTable.tsx'),'utf8');
const atlasScripture=fs.readFileSync(path.join(root,'atlas','src','components','ScriptureRefPill.tsx'),'utf8');
if(atlasCatalog.includes('inline-flex cursor-pointer items-center gap-1 hover:underline')||
   atlasCatalog.includes('inline-flex cursor-pointer items-center gap-1 font-semibold hover:underline')||
   !atlasCatalog.includes('min-h-11')||
   !atlasTable.includes('min-h-11')||
   !atlasScripture.includes('min-h-11'))
  throw Error('Touch-target regression: catalog/tag/table/reference actions undersized');
console.log('V13_TOUCH_TARGET_SCOPE_PASS');

const readerEpilogueContacts=fs.readFileSync(path.join(root,'sozvezdie','src','components','Epilogue.tsx'),'utf8');
const readerIntroduction=fs.readFileSync(path.join(root,'sozvezdie','src','components','Intro.tsx'),'utf8');
// W82: contacts keep explicit 44px mobile hit targets; desktop returns to
// min-h-11. Do not demand the obsolete pre-reflow class string.
if((readerEpilogueContacts.match(/inline-flex min-h-\[44px\] min-w-0 max-w-full flex-wrap items-center justify-center gap-\[6px\]/g)||[]).length!==2||
   (readerEpilogueContacts.match(/sm:min-h-11 sm:gap-2 sm:px-2/g)||[]).length!==2||
   !readerIntroduction.includes('inline-flex min-h-11 items-center text-gold-400'))
  throw Error('Reader footer/contact touch targets must remain 44px accessible');
console.log('V13_FOOTER_TOUCH_CONTRACT_PASS');


// Research #379 content alignment: keep exact Hebrew referents and the
// boundary between lexical form, biblical witness and theological reading.
// These checks protect already verified corrections; they are not independent
// scholarly peer review or a grant of publication rights.
const researchAtlasData=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
const researchReaderData=fs.readFileSync(path.join(root,'sozvezdie','src','data','names.ts'),'utf8');
const researchNegative=[
 ['atlas Adonai misquote',researchAtlasData,'«Сказал Яхве Адонаю моему»'],
 ['atlas Exodus 6 certainty',researchAtlasData,'Патриархи знали сам звук этого имени'],
 ['atlas Sabaoth Ark claim',researchAtlasData,'в 1 Цар. 1:3 у ковчега завета'],
 ['atlas Isaiah epithet origin',researchAtlasData,'родившееся из его видения в храме'],
 ['reader Jacob return claim',researchReaderData,'Иакову — возвращение в землю (Быт 35:11)'],
 ['reader nine proper names',researchReaderData,'Девять имён Писания прямо содержат ЯХВЕ'],
 ['reader Yireh forced etymology',researchReaderData,'Усмотреть здесь значит «увидеть заранее и приготовить»'],
 ['reader Adonai chronology',researchReaderData,'с глубокой древности не произносили тетраграмматон'],
];
for(const [name,source,unsafe] of researchNegative){
 if(source.includes(unsafe))throw Error('Research content regression '+name);
}
for(const [name,source,required] of [
 ['Psalm 110 Hebrew form',researchAtlasData,'לַאדֹנִי («моему господину», adoni), а не אֲדֹנָי'],
 ['Exodus 6 differing interpretations',researchAtlasData,'толкователи объясняют по-разному'],
 ['Isaiah 1:4 epithet locus',researchAtlasData,'встречается уже в Ис. 1:4'],
 ['1 Samuel 1:3 scope',researchAtlasData,'поклонение Господу Саваофу в Силоме'],
 ['Genesis 35 promise verses',researchReaderData,'обещание земли следует в стихе 12'],
 ['Genesis 22 verb distinction',researchReaderData,'во второй части 22:14 употреблена иная глагольная форма'],
 ['Jeremiah Old Greek omission',researchReaderData,'Иер. 33:14–26 отсутствует в древнегреческой версии'],
 ['Sabaoth historical uncertainty',researchReaderData,'историческое происхождение титула'],
 ['Site proper-name classification',researchReaderData,'не образуют девять новых собственных имён Бога'],
]){
 if(!source.includes(required))throw Error('Research content evidence guard missing '+name);
}
console.log('V13_RESEARCH_CONTENT_RECONCILIATION_PASS',JSON.stringify({negative:researchNegative.length,positive:9,source:'Research PR379 ledger ad62d11b; digital verse context; unapproved for Product'}));


// Second research-pass controls: exact biblical chronology, semantic/lexical
// separation and MT/LXX/Matthew edition scope. A site build is not a peer review.
const readerSecondPass=fs.readFileSync(path.join(root,'sozvezdie','src','data','names.ts'),'utf8');
const atlasSecondPass=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
for(const [id,text,forbidden] of [
 ['Hagar chronology',readerSecondPass,'Вернувшись, она говорит'],
 ['El Gibbor and Sabaoth roots',readerSecondPass,'Это язык того же корня, что и «Господь воинств»'],
 ['El Gibbor psalm lexical conflation',readerSecondPass,'«Господь сил» в молитвах псалмов — это обращение к Эль Гиббо́ру'],
 ['El Gibbor identity without referent',readerSecondPass,'Исаия осмеливается приложить это слово к Самому Богу'],
 ['Immanuel MT/LXX surface merged',readerSecondPass,'Пророк Исаия обещает дому Давидову знамение: «Се, Дева'],
 ['Healer mistaken proper-name coinage',readerSecondPass,'Имя дано сразу после чуда'],
 ['Leviticus 20 incorrect single-verse join',readerSecondPass,'(Лев 20:8; см. Исх 31:13)'],
 ['Immanuel incarnation as lexical gloss',atlasSecondPass,'С нами Сильный Бог (Эль) в личном воплощении'],
]){
 if(text.includes(forbidden))throw Error('Second-pass Research factual regression: '+id);
}
for(const [id,text,required] of [
 ['Hagar at the spring',readerSecondPass,'Именно там, прежде чем рассказ сообщает о рождении Измаила'],
 ['Mighty God Isaiah 10 referent',readerSecondPass,'В Ис. 10:21 выражение относится к Богу'],
 ['Gibbor and hosts different words',readerSecondPass,'«Гиббор» и «Саваоф» происходят от разных еврейских слов'],
 ['Isaiah 9 Hebrew numbering',readerSecondPass,'Ис. 9:5 по еврейской нумерации'],
 ['Isaiah 7 Hebrew form',readerSecondPass,'Еврейский текст употребляет הָעַלְמָה'],
 ['Isaiah 7 Greek form',readerSecondPass,'ἡ παρθένος'],
 ['Healing conditional predication',readerSecondPass,'условном обращении к Израилю'],
 ['Leviticus 20 context range',readerSecondPass,'Лев. 20:7–8'],
 ['Isaiah 1:4 prior biblical mention',readerSecondPass,'Эпитет встречается уже в Ис. 1:4'],
 ['Immanuel literal meaning bounded',atlasSecondPass,'В Ис. 7:14 «Эммануил» — пророческое имя ребёнка'],
]){
 if(!text.includes(required))throw Error('Second-pass Research assertion missing: '+id);
}
console.log('V13_RESEARCH_SECOND_PASS_PASS',JSON.stringify({negative:8,positive:10,authority:'Research #379 draft, 11 Nov 2026, no independent approval'}));

// Training surfaces must preserve exact verse-level translation, not replace
// Hebrew words by thematically adjacent Greek titles.
const trainingQuiz=fs.readFileSync(path.join(root,'atlas','src','components','TheologicalQuiz.tsx'),'utf8');
const trainingMatrix=fs.readFileSync(path.join(root,'atlas','src','components','HebrewGreekLexiconMatrix.tsx'),'utf8');
const trainingRequired=[
 ['Genesis17 LXX textual form',trainingQuiz,'ἐγώ εἰμι ὁ θεός σου'],
 ['Jeremiah33 Old Greek omission',trainingQuiz,'33:14–26 отсутствует в древнегреческой версии'],
 ['Abba differing speakers',trainingQuiz,'в Гал. 4:6 в их сердцах взывает Дух Сына'],
 ['Revelation22:13 speaker',trainingQuiz,'имя Иисуса прямо названо в стихе 16'],
 ['LXX Genesis17 Greek matrix',trainingMatrix,"lxxGreek: 'ἐγώ εἰμι ὁ θεός σου'"],
 ['Psalm109 adoni vs Adonai',trainingMatrix,'לַאדֹנִי (adoni), не אֲדֹנָי'],
 ['Greek translation rows source scope',trainingMatrix,'примеры не всегда буквальные эквиваленты'],
 ['Accessible table choice',trainingMatrix,'aria-pressed={isSelected} onClick={() => setSelectedRowId(row.id)}'],
 ['No uninspected BHS apparatus claim',trainingMatrix,'Еврейский текст (MT)']
];
for(const [name,source,value] of trainingRequired){
 if(!source.includes(value))throw Error('V13 research training regression: '+name);
}
const trainingForbidden=[
 ['Genesis17 false LXX title',trainingQuiz,'в Септуагинте — Пантократор'],
 ['Matrix false Genesis17 equivalence',trainingMatrix,"lxxGreek: 'Παντοκράτωρ'"],
 ['Single lineage LXX to Synodal',trainingQuiz,'откуда в Синодальный перевод пришло слово «Господь»'],
 ['Thomas false Hebrew citation',trainingMatrix,'соединяет Адонай и Элохим'],
 ['Revelation unqualified attribution',trainingQuiz,'Иисус Христос прямо относит к Себе'],
 ['Mouse only row click',trainingMatrix,'onClick={() => setSelectedRowId(row.id)}\n                  className="cursor-pointer']
];
for(const [name,source,value] of trainingForbidden){
 if(source.includes(value))throw Error('V13 research training reintroduced error: '+name);
}
console.log('V13_RESEARCH_TRAINING_SURFACES_PASS',JSON.stringify({positive:trainingRequired.length,negative:trainingForbidden.length,study:'LXX Genesis17:1, MT psalm, independent review pending'}));
// LXX locus-accurate display: don't print generic dictionary nominatives or
// mix separate translation traditions into one supposed verse quotation.
const greekLocusAtlas20261111=fs.readFileSync(path.join(root,'atlas','src','components','HebrewGreekLexiconMatrix.tsx'),'utf8');
const namesQuizScope20261111=fs.readFileSync(path.join(root,'atlas','src','components','TheologicalQuiz.tsx'),'utf8');
if (!greekLocusAtlas20261111.includes("lxxGreek: 'τοῦ θεοῦ τοῦ ὑψίστου'") ||
    !greekLocusAtlas20261111.includes("Быт. 14:18 LXX") ||
    greekLocusAtlas20261111.includes("lxxGreek: 'Θεὸς Ὕψιστος'"))
  throw Error('LXX Gen 14:18 must show its actual genitive phrase, not a dictionary nominative');
if (!greekLocusAtlas20261111.includes("lxxGreek: 'κύριος σαβαωθ'") ||
    !greekLocusAtlas20261111.includes("Ис. 6:3 LXX") ||
    greekLocusAtlas20261111.includes("lxxGreek: 'Κύριος Σαβαώθ / τῶν δυνάμεων'"))
  throw Error('LXX Isa 6:3 must be verse-specific, not a conflation of translation traditions');
if (!namesQuizScope20261111.includes('обозначение Бога «Элохим»') ||
    namesQuizScope20261111.includes('в Бытии 1:1 имя Элохим'))
  throw Error('Quiz must not call Elohim a personal divine name on grammar alone');
console.log('V13_LXX_LOCUS_QUOTATION_AND_NAMING_SCOPE_PASS');

// Flagship content verification 2026-11-11: Research PR379 Wave44 and
// primary biblical editions; distinguish original speakers/lexemes from
// editorial typology on both Reader and Atlas. This guards known reversions,
// not the independently reviewed scholarly or rights release gates.
const flagshipReaderNov11=fs.readFileSync(path.join(root,'sozvezdie','src','data','names.ts'),'utf8');
const flagshipAtlasNov11=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
const flagshipRequired=[
  [flagshipReaderNov11, 'В Дан. 4:29 о власти Всевышнего говорит небесный голос'],
  [flagshipReaderNov11, 'исповедание царя появляется позднее (4:31–32)'],
  [flagshipReaderNov11, 'именно это обозначение Бога встречается в начале книги Бытия'],
  [flagshipAtlasNov11, 'не является актом наречения Бога новым личным именем'],
  [flagshipAtlasNov11, 'не означают, что греческий текст Иоанна буквально называет Иисуса еврейским словом'],
  [flagshipAtlasNov11, 'царское именование ребёнка включает אֵל גִּבּוֹר'],
  [flagshipAtlasNov11, 'В стихе 18 его впервые в данном повествовании сообщает рассказчик'],
  [flagshipAtlasNov11, 'собственное исповедание Навуходоносора после наказания начинается в Дан. 4:31–32'],
  [flagshipAtlasNov11, 'эту этимологическую реконструкцию нельзя выдавать за бесспорную'],
  [flagshipAtlasNov11, 'В песне избавленного Израиля у Чермного моря (Исх. 15:2) краткая форма יָהּ'],
  [flagshipAtlasNov11, 'Пс. 21 прямо не называет страдающего «Пастырем»'],
  [flagshipAtlasNov11, 'Павел не воспроизводит еврейское название жертвенника'],
  [flagshipAtlasNov11, 'название жертвенника Моисея в Исх. 17:15 не является дословным пророчеством'],
  [flagshipAtlasNov11, 'Гал. 6:16 имеет обсуждаемые толкования'],
  [flagshipAtlasNov11, 'точная историческая этимология не доказана']
];
const flagshipForbidden=[
  [flagshipReaderNov11, 'Навуходоносор впоследствии признаёт, что «Бог Всевышний»'],
  [flagshipReaderNov11, 'именно это имя открывает книгу Бытия'],
  [flagshipAtlasNov11, 'в первом же стихе Библии имя Элохим встречается'],
  [flagshipAtlasNov11, 'Сам вечный Элохим, через Которого'],
  [flagshipAtlasNov11, 'прямо называет грядущего Младенца'],
  [flagshipAtlasNov11, 'Впервые звучит из уст таинственного царя'],
  [flagshipAtlasNov11, 'вынужден признать, что «Всевышний владычествует'],
  [flagshipAtlasNov11, 'עוֹלָם (олам) происходит от корня'],
  [flagshipAtlasNov11, 'Впервые оно рождается на устах спасённого'],
  [flagshipAtlasNov11, 'в Пс. 21 Пастырь отдаёт душу'],
  [flagshipAtlasNov11, 'Апостол Павел прямо называет Христа этим именем'],
  [flagshipAtlasNov11, 'стал тем самым Знаменем для всех народов'],
  [flagshipAtlasNov11, 'Иисус Христос открывает Себя как истинный Израиль и Глава нового Израиля Божия']
];
for(const [src,needle] of flagshipRequired)if(!src.includes(needle))
  throw Error('Flagship Research guard missing required scoped formulation: '+needle);
for(const [src,needle] of flagshipForbidden)if(src.includes(needle))
  throw Error('Flagship Research guard found disproven formulation: '+needle);
console.log('V13_FLAGSHIP_RESEARCH_RECHECK_20261111_PASS',flagshipRequired.length,flagshipForbidden.length);

// Second flagship source precision sweep: the Tetragrammaton reading convention
// and distinctions between proper names, divine epithets, poetry and typology.
const secondReaderNov11=fs.readFileSync(path.join(root,'sozvezdie','src','data','names.ts'),'utf8');
const secondAtlasNov11=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
const secondMust=[
  [secondReaderNov11,'«Яхве» — распространённая научная реконструкция произношения'],
  [secondReaderNov11,'масоретские огласовки тетраграмматона отражают традицию заместительного чтения'],
  [secondReaderNov11,'Этот божественный титул звучит'],
  [secondReaderNov11,'Этот титул говорит о Боге'],
  [secondReaderNov11,'Этот божественный эпитет нельзя читать'],
  [secondAtlasNov11,'В Быт. 15:2 Авраам обращается к Богу этим титулом'],
  [secondAtlasNov11,'Эта поэтическая метафора выражает'],
  [secondAtlasNov11,'Здесь слово Элоах относится'],
  [secondAtlasNov11,'Это поэтическое исповедание соединяет'],
  [secondAtlasNov11,'Титул Бога, Который стоит'],
  [secondAtlasNov11,'В Иис. Нав. 3:10 сочетание'],
  [secondAtlasNov11,'Это условное Божье самоописание, а не новый акт наречения собственного имени'],
  [secondAtlasNov11,'В Исх. 31:13 Божье самоописание'],
  [secondAtlasNov11,'Одно из наиболее личных поэтических исповеданий'],
  [secondAtlasNov11,'Вывод о Его единственности и независимости от творения относится к богословию']
];
const secondMustNot=[
  [secondReaderNov11,'Реконструкция огласовок «Яхве» общепринята'],
  [secondReaderNov11,'иудеи читают тетраграмматон как Адона́й или Хаше́м'],
  [secondAtlasNov11,'Впервые это имя произносит Авраам'],
  [secondAtlasNov11,'Это имя выражает моральное и онтологическое постоянство'],
  [secondAtlasNov11,'Здесь это имя подчёркивает исключительное право'],
  [secondAtlasNov11,'Это имя соединяет величие Создателя галактик'],
  [secondAtlasNov11,'Имя Бога, Который стоит над потоком времени'],
  [secondAtlasNov11,'Впервые сочетание אֵל חַי'],
  [secondAtlasNov11,'Здесь Бог впервые называет Себя יְהוָה רֹפְאֶךָ'],
  [secondAtlasNov11,'Примечательно, что впервые это имя даётся'],
  [secondAtlasNov11,'Самое нежное и интимное имя в Псалтири'],
  [secondAtlasNov11,'в Библии оно очищено от всякой мифологии']
];
for(const [textValue,snippet] of secondMust)if(!textValue.includes(snippet))throw Error('Second source boundary absent: '+snippet);
for(const [textValue,snippet] of secondMustNot)if(textValue.includes(snippet))throw Error('Second source boundary reverted: '+snippet);
console.log('V13_FLAGSHIP_SECOND_PASS_QERE_NAMING_PASS', secondMust.length, secondMustNot.length);


// Geographic/editorial evidence gate: Chebar in Babylonia and Patmos in the
// Aegean cannot share one coordinate on a stylized Palestine/Sinai diagram.
const nov11MapData=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
const nov11MapUi=fs.readFileSync(path.join(root,'atlas','src','components','CovenantAltarsAtlas.tsx'),'utf8');
const nov11MapApp=fs.readFileSync(path.join(root,'atlas','src','App.tsx'),'utf8');
if(nov11MapData.includes("id: 'altar-babylon-patmos'") ||
   nov11MapData.includes("placeName: 'Ховар и Патмос'") ||
   nov11MapUi.includes('Connecting Covenant Pilgrim Path') ||
   nov11MapUi.includes('Открытое здесь Имя Бога') ||
   !nov11MapUi.includes('За пределами схемы · Ховар и Патмос') ||
   !nov11MapUi.includes('Места библейских событий и связанные выражения') ||
   !nov11MapApp.includes("value: '9', label: 'мест библейских событий'") ||
   !nov11MapApp.includes('9 мест'))
 throw Error('Atlas historical geography / expression-classification regression');
const nov11MappedBlock=nov11MapData.split('export const COVENANT_ALTARS:')[1]?.split('\n];')[0] || '';
const nov11MappedCount=(nov11MappedBlock.match(/\n\s+id:\s+'altar-/g)||[]).length;
if(nov11MappedCount!==9)throw Error('Atlas expected nine schematized places: '+nov11MappedCount);
console.log('V13_ATLAS_CARTOGRAPHY_SEMANTIC_GATE_PASS',nov11MappedCount);


// Mobile map labels cannot obscure one another; its complete 44px waypoint
// strip and labelled pins preserve access to all nine biblical places.
const mapControlsNov11=fs.readFileSync(path.join(root,'atlas','src','components','CovenantAltarsAtlas.tsx'),'utf8');
for(const needle of [
 'data-covenant-map-stage',
 'data-covenant-map-pin',
 'data-covenant-pin-label',
 'data-covenant-waypoint',
 'aria-pressed={isSelected}',
 'font-ui pointer-events-none absolute whitespace-nowrap rounded',
 'min-h-11 items-center cursor-pointer',
 'flex h-9 w-9 items-center justify-center'
])if(!mapControlsNov11.includes(needle))
 throw Error('Atlas schematic mobile control regression: '+needle);
console.log('V13_ATLAS_MAP_MOBILE_ACCESS_SCOPE_PASS');


// The exact visual audit caught labels 1/2 overlapping at 768 px and the
// cramped 'Open analysis' CTA wrapping vertically in the 1440 px rail layout.
// Ensure adaptive labels and full-width card actions are kept together.
const schematicPostAudit=fs.readFileSync(path.join(root,'atlas','src','components','CovenantAltarsAtlas.tsx'),'utf8');
for(const guard of [
 "isSelected ? 'hidden sm:block' : 'hidden xl:block'",
 'data-covenant-map-nav',
 'min-h-11 min-w-11',
 'data-covenant-card-actions',
 'sm:flex-row lg:flex-col',
 'whitespace-nowrap',
 'sm:w-auto lg:w-full'
])if(!schematicPostAudit.includes(guard))
 throw Error('Atlas label/button collision regression: '+guard);
console.log('V13_ATLAS_LABEL_AND_CARD_ACTION_GEOMETRY_PASS');


// Browser screenshot evidence 04b69f95: the large-screen default labels for
// Horeb and Rephidim intersected by 26–27 × 5–6 px in both browser engines.
// This is a purely diagram-label layout constraint, not a geographical claim.
const mappedRephidimNov11=nov11MappedBlock.split("id: 'altar-rephidim'")[1]?.split('\n  },')[0] || '';
if(!mappedRephidimNov11.includes("labelAlign: 'bottom'"))
 throw Error('Atlas schematic labels Horeb/Rephidim alignment regressed');
console.log('V13_ATLAS_HOREB_REPHIDIM_LABEL_ALIGNMENT_PASS');

// Wide 1440px state index 1: Beersheba label overlapped Beer-lahai-roi in
// Chromium and WebKit (65x2 px); the strict selected-state browser check
// and a dedicated Beersheba JPG remain mandatory.
const w54Beersheba=nov11MappedBlock.split("id: 'altar-beersheba'")[1]?.split('\n  },')[0]||'';
if(!w54Beersheba.includes('x: 37,')||
   !w54Beersheba.includes('y: 62,')||
   !w54Beersheba.includes("labelAlign: 'top'"))
 throw Error('W54 Beersheba label / fixed-coordinate source regression');
console.log('V13_W54_BEERSHEBA_GEOMETRY_SOURCE_PASS');


// Wave55: pin selection remains legible on small screens while all nine
// pin tooltips remain visually hidden; languages in the rail do not compete
// for a narrow horizontal row.
for(const token of [
 'data-covenant-mobile-selection','justify-between gap-2',
 'data-covenant-sea-watermark','aria-live="polite"',
 'data-covenant-linked-expression','data-covenant-linked-original',
 'data-covenant-linked-transliteration','data-covenant-linked-russian',
 'mt-1.5 flex min-w-0 flex-col gap-2'
])if(!nov11MapUi.includes(token))
 throw Error('Wave55 mobile-caption / bilingual-card regression: '+token);
console.log('V13_W55_SELECTED_MOBILE_CAPTION_BILINGUAL_CARD_PASS');


// Wave56: selected caption is outside the map canvas. Names at the top
// (especially Ophrah) must remain interactive and never be overlaid.
const w56Badge=nov11MapUi.indexOf('data-covenant-mobile-selection');
const w56Stage=nov11MapUi.indexOf('data-covenant-map-stage');
if(w56Badge<0||w56Stage<0||w56Badge>=w56Stage||
   !nov11MapUi.includes('mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2'))
 throw Error('Wave56 separate mobile caption row regressed');
console.log('V13_W56_MOBILE_CAPTION_OUTSIDE_MAP_PASS');


// Wave59: the mobile status message must have an audible punctuation boundary
// between the ordinal and the selected place; the animated halo must stop
// for OS users requesting reduced motion. Do not remove pin keyboard focus.
for(const token of [
 'data-covenant-mobile-selection','role="status"',
 "из {COVENANT_ALTARS.length}.{' '}",
 'data-covenant-selected-halo','motion-reduce:animate-none'
])if(!nov11MapUi.includes(token))
 throw Error('Wave59 accessible caption or motion preference regressed: '+token);
console.log('V13_W59_MOTION_KEYBOARD_SCREEN_READER_SOURCE_PASS');

// W61: 200% rem-root text reflow is explicitly covered in BOTH candidates.
// This is not a substitute for native mobile OS/browser UI zoom.
const w61Script=fs.readFileSync(path.join(root,'checks','visual_review.cjs'),'utf8');
for(const term of [
 'root-font-resize-200-reflow','root-font-resize-200-reflow-failed',
 "app==='atlas'?'#article-introduction h2':'#yhwh h3'",
 "style.setProperty('font-size','200%','important')",
 'd.headingScrollWidth>d.headingClientWidth+2'
])if(!w61Script.includes(term))
 throw Error('W61 root-font witness missing: '+term);
console.log('V13_W61_BOTH_CANDIDATES_ROOT_FONT_200_PASS');

// W73: all reciprocal deep links must remain structurally valid. A mapping
// identifies a corresponding study topic, NOT necessarily identical lexemes.
// Standalone Atlas/Panorama copies are immutable in identity until Product
// establishes one canonical shared data owner; fail on any drift.
const atlasCrosswalk=fs.readFileSync(path.join(root,'atlas','src','data','topicCrosswalk.ts'),'utf8');
const readerCrosswalk=fs.readFileSync(path.join(root,'sozvezdie','src','data','topicCrosswalk.ts'),'utf8');
if(atlasCrosswalk!==readerCrosswalk)
  throw Error('Atlas/Panorama topic crosswalk copies drifted');
const pairs=[...atlasCrosswalk.matchAll(/^\s*\["([^"]+)", "([^"]+)"\],?$/gm)]
  .map(([,atlas,reader])=>({atlas,reader}));
if(pairs.length!==24||new Set(pairs.map(x=>x.atlas)).size!==24||
   new Set(pairs.map(x=>x.reader)).size!==24)
  throw Error('Crosswalk is not a 24-pair bijection');
const atlasNamesSource=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
const readerNamesSource=fs.readFileSync(path.join(root,'sozvezdie','src','data','names.ts'),'utf8');
const atlasEntries=atlasNamesSource.split('export const DIVINE_NAMES: DivineNameEntry[] = [')[1];
const readerEntries=readerNamesSource.split('export const NAMES: NameEntry[] = [')[1];
if(!atlasEntries||!readerEntries)throw Error('Missing authoritative study entry arrays');
const atlasIds=[...atlasEntries.matchAll(/^\s{4}id: '([^']+)'/gm)].map(m=>m[1]);
const readerIds=[...readerEntries.matchAll(/^\s{4}id: "([^"]+)"/gm)].map(m=>m[1]);
if(atlasIds.length!==36||new Set(atlasIds).size!==36||
   readerIds.length!==29||new Set(readerIds).size!==29)
  throw Error('Study entry count or identity drifted (36 Atlas, 29 Panorama)');
const atlasSet=new Set(atlasIds),readerSet=new Set(readerIds);
for(const {atlas,reader} of pairs){
  if(!atlasSet.has(atlas)||!readerSet.has(reader))
    throw Error('Crosswalk points to missing entry: '+atlas+' / '+reader);
}
const atlasDossier=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
const w73ReaderSection=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameSection.tsx'),'utf8');
if(!atlasDossier.includes('atlasToReader.get(entry.id)')||
   !atlasDossier.includes('href={`/imena-boga/#${encodeURIComponent(counterpartId)}`}')||
   !w73ReaderSection.includes('readerToAtlas.get(name.id)')||
   !w73ReaderSection.includes('href={`/imena-boga/atlas/#name-${encodeURIComponent(counterpartId)}`}'))
  throw Error('Crosswalk no longer drives the reciprocal user links');
console.log('W73_TOPIC_CROSSWALK_24_PASS',JSON.stringify({pairs:pairs.length,atlas:atlasIds.length,panorama:readerIds.length}));

// W91 research-to-visual semantic safeguard: preserve speakers, manuscript
// status and edition distinctions in the two *publicly blocked* prototypes.
// These are source-text regressions, not independent scholarly sign-off.
const researchEntry=(source,id,quote)=>{
 const tag='id: '+quote+id+quote;
 const pos=source.indexOf(tag);
 if(pos<0)throw Error('Missing research UI entry '+id);
 const next=source.indexOf('\n  {\n    id:',pos+tag.length);
 return source.slice(pos,next<0?source.length:next);
};
for(const [source,id,quote,required,forbidden] of [
 [researchReaderData,'el-shaddai','"', ['Божья речь', 'Аврааму и Иакову','В Быт. 28:3 Эль-Шаддай упоминает Исаак','Руфь 1:20–21','Иов 5:17','Иов 42:7–9'],['Аврааму, Исааку, Иакову']],
 [researchReaderData,'el-elyon','"', ['Быт. 14:18 называет Мелхиседека','14:19–20','Быт. 14:22','Κύριος'],['Мелхиседек, Быт 14:18']],
 [researchReaderData,'el-roi','"', ['Говорящая', 'Это исповедание Агари'],['Кто открыл']],
 [researchReaderData,'nissi','"', ['Исх. 17:16','כֵּס יָהּ','כסיה','BHS и Göttingen Exodus'],[]],
 [researchAtlasData,'el-shaddai',"'",['Быт. 28:3 Исаак сам благословляет Иакова','Руфь 1:20–21','Иов 5:17','Иов 42:7–9'],['Исааку при благословении Иакова']],
 [researchAtlasData,'el-elyon',"'",['масоретском тексте Быт. 14:22','Κύριος','критический аппарат'],[]],
 [researchAtlasData,'yhwh-nissi',"'",['17:16','כֵּס יָהּ','כסיה','Göttingen Exodus'],[]],
]){
 const entry=researchEntry(source,id,quote);
 for(const token of required)if(!entry.includes(token))throw Error('W91 Research UI evidence missing: '+id+' / '+token);
 for(const token of forbidden)if(entry.includes(token))throw Error('W91 Research UI overclaim returned: '+id+' / '+token);
}
console.log('W91_RESEARCH_UI_SPEAKER_VARIANT_PASS',JSON.stringify({cards:7,release:'BLOCKED',externalScholarReviews:0}));

// W91 methodology disclosure is readable, restrained prose, not a release gate.
const w91Intro=fs.readFileSync(path.join(root,'sozvezdie','src','components','Intro.tsx'),'utf8');
for(const token of ['Это рабочая исследовательская редакция','по критическим аппаратам','спорные этимологии','Независимая научная рецензия ещё не']){
 if(!w91Intro.includes(token))throw Error('Panorama research methodology boundary vanished: '+token);
}
console.log('W91_PANORAMA_METHOD_SCOPE_PASS');

// W91 visual hierarchy: long multi-lexeme Strong identifiers belong to the
// full dossier (and index), not the narrow preview card header.
const w91PreviewCard=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameTiltCard.tsx'),'utf8');
const w91FullDossier=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
const w91Index=fs.readFileSync(path.join(root,'atlas','src','components','NamesIndexTable.tsx'),'utf8');
if(!w91PreviewCard.includes("entry.strongs.length > 22 ? 'Индексы Стронга · в досье' : entry.strongs") ||
   !w91PreviewCard.includes('title={entry.strongs.length > 22 ?') ||
   !w91FullDossier.includes('{entry.strongs}') ||
   !w91Index.includes('{item.strongs}'))
 throw Error('W91 long Hebrew lexical codes must be condensed in preview and preserved in dossier/index');
console.log('W91_LEXICAL_CODES_PREMIUM_PREVIEW_PASS');


// W92: referential accuracy and lexical-vs-theological-label reader safeguards.
// Source: Synodal Proverbs 18:10; Gill, A Body of Doctrinal Divinity I.3.
// A valid interface distinguishes lexeme, human confession and translation.
const w92AtlasIntro=fs.readFileSync(path.join(root,'atlas','src','App.tsx'),'utf8');
const w92AtlasCard=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameTiltCard.tsx'),'utf8');
for(const token of [
 'reference="Притч. 18:10"',
 'Баптистский богослов XVIII века',
 'Это пересказ, а не дословная русская цитата',
 'названия мест или жертвенников',
])if(!w92AtlasIntro.includes(token))throw Error('W92 Atlas theological/source accuracy missing: '+token);
for(const token of ['reference="Притч. 18:11"','пуританский баптистский богослов','ожидать глубокого познания самой сущности','произносит Свои имена']){
 if(w92AtlasIntro.includes(token))throw Error('W92 Atlas old overclaim returned: '+token);
}
if(!w92AtlasCard.includes('Смысл в контексте: <span') ||
    w92AtlasCard.includes('Буквально: <span'))
 throw Error('W92 Atlas preview conflates contextual theology with literal lexeme meaning');
console.log('W92_ATLAS_PROVERBS_GILL_LEXICAL_SCOPE_PASS');

// W93: Jeremiah 23:6 and 33:16 have different grammatical referents.
// Quote the exact title fragment in the Atlas IV epigraph, not a hybrid
// of their two clauses. Christian application must remain interpretive.
const w93AtlasData=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
for(const token of [
 "epigraph: '«Господь — оправдание наше!»'",
 'Как ветхозаветные свидетельства осмысляются в свете откровения об Отце, Сыне и Духе'
])if(!w93AtlasData.includes(token))throw Error('W93 research-aware epigraph/pastoral scope missing: '+token);
for(const token of [
 "epigraph: '«И нарекли имя Его: Господь — оправдание наше»'",
 'Как все ветхозаветные имена сходятся'
])if(w93AtlasData.includes(token))throw Error('W93 mixed referent or overclaim reappeared: '+token);
console.log('W93_JEREMIAH_23_6_REF_SCOPE_PASS');

// W94: 200%-root zoom must not visually ellipsize the 320/390px site
// identity. Let fixed-header content reflow without shrinking 44px buttons.
const w94AtlasNavbar=fs.readFileSync(path.join(root,'atlas','src','components','SiteNavbar.tsx'),'utf8');
const w94PanoramaApp=fs.readFileSync(path.join(root,'sozvezdie','src','App.tsx'),'utf8');
const w94Visual=fs.readFileSync(path.join(root,'checks','visual_review.cjs'),'utf8');
for(const [source,tokens,forbidden] of [
 [w94AtlasNavbar,['max-w-[1680px] min-w-0 flex-wrap','group flex min-w-0 shrink-0','ml-auto flex shrink-0 items-center'],['min-w-0 truncate whitespace-nowrap text-base']],
 [w94PanoramaApp,['max-w-7xl flex-wrap items-center','min-w-0 shrink-0 items-center','ml-auto flex shrink-0 items-center'],['min-w-0 truncate sm:hidden']],
 [w94Visual,['const headerBrandTextClipped=','d.headerBrandPaintOverflow||d.headerBrandTextClipped'],[]]
]){
 for(const token of tokens)if(!source.includes(token))throw Error('W94 responsive brand guard missing: '+token);
 for(const token of forbidden)if(source.includes(token))throw Error('W94 stale brand ellipsis returned: '+token);
}
console.log('W94_ZOOM_200_HEADER_BRAND_REFLOW_PASS');

// W95: Research 08 fixes speaker/source distinctions in the New Testament.
// Mk 14:36: Jesus addresses the Father; Rom 8:15: believers cry;
// Gal 4:6: the Spirit of the Son cries; Revelation designations separately.
const w95AtlasIntro=fs.readFileSync(path.join(root,'atlas','src','App.tsx'),'utf8');
for(const token of [
 'Иисус обращается к Отцу «Авва, Отче» (Мк. 14:36)',
 'в Рим. 8:15 так взывают верующие, а в Гал. 4:6 — Дух Сына',
 '«Я есмь» и «Альфа и Омега» требуют отдельного анализа говорящего и контекста',
])if(!w95AtlasIntro.includes(token))throw Error('W95 Research source/speaker distinction missing: '+token);
if(w95AtlasIntro.includes('вся полнота Божественного Имени сосредоточена в Иисусе Христе —'))
 throw Error('W95 New Testament speaker overclaim returned');
console.log('W95_ABBA_SPEAKER_SEPARATION_PASS');

// W96: the W92 semantic-label correction must cover every consumer of
// the explanatory `literalMeaning` field, not only the compact preview.
// Full dossier copy, speech synthesis and visible UI share one honest label.
const w96Modal=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
if(w96Modal.split('Смысл в контексте:').length-1!==3 ||
   w96Modal.includes('Значение и перевод:') ||
   w96Modal.split('Смысл в контексте: ${entry.literalMeaning}').length-1!==2 ||
   !w96Modal.includes('<strong>Смысл в контексте:</strong> {entry.literalMeaning}'))
 throw Error('W96 full Atlas dossier semantic-label mismatch across view/copy/speech');
console.log('W96_ATLAS_DOSSIER_CONTEXT_LABEL_PASS');


// W97: Research/16 (Jer 23:6 king vs Jer 33:16 city; MT vs Greek)
 // and Research/08 (Abba addresses Father; ego eimi is not a stand-alone proper name).
const w97Data=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
function w97Entry(id,nextId) {
  const start=w97Data.indexOf("id: '"+id+"'");
  const end=w97Data.indexOf("id: '"+nextId+"'",start+1);
  if(start<0||end<start)throw Error('W97 entry boundaries missing: '+id);
  return w97Data.slice(start,end);
}
const w97Jer=w97Entry('yhwh-tsidkenu','yhwh-shoftenu');
for(const required of ['Иер. 33:16 — к Иерусалиму','Христианское мессианское прочтение','не доказываются одной грамматикой','иную формулу с именем Иоседек']){
  if(!w97Jer.includes(required))throw Error('W97 Jeremiah context/edition guard missing: '+required);
}
for(const banned of ['что доказывает Его истинное Божество','Как подчеркивали Жан Кальвин']){
  if(w97Jer.includes(banned))throw Error('W97 Jeremiah unverified attribution/lexical proof returned: '+banned);
}
const w97Abba=w97Entry('abba-ho-pater','ruach-parakletos');
for(const required of ['Ин. 1:1, 14','Ин. 20:17; Рим. 8:15','не является собственным именем Бога','Ин. 9:9','Ин. 8:58']){
  if(!w97Abba.includes(required))throw Error('W97 Abba vs ego eimi role guard missing: '+required);
}
if(w97Abba.includes('семи великих образах спасения'))
  throw Error('W97 fused seven predicate sayings into literal proper name');
console.log('W97_RESEARCH_PROPHETIC_ABBA_SEPARATION_PASS');


// W98: lexical form of YAH must not assert a verified first syllable
// of the disputed historical YHWH pronunciation; QANNA does not authorize
// unsourced quotations from named Puritans.
const w98Data=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
function w98Between(startId,nextId){
 const a=w98Data.indexOf("id: '"+startId+"'"),b=w98Data.indexOf("id: '"+nextId+"'",a+1);
 if(a<0||b<a)throw Error('W98 missing stable cards: '+startId);
 return w98Data.slice(a,b);
}
const w98Yah=w98Between('yah','ehyeh-asher-ehyeh');
for(const snippet of ['краткая форма божественного имени יהוה','нельзя достоверно установить древнейшее произношение','«Хвалите Ях!»','не становится ещё одним самостоятельным личным именем']){
 if(!w98Yah.includes(snippet))throw Error('W98 YAH lexical/translation guard absent: '+snippet);
}
for(const bad of ['сокращённую форму первого слога','перешёл без перевода во все языки Церкви','он призывает древнее заветное имя']){
 if(w98Yah.includes(bad))throw Error('W98 YAH historical overclaim restored: '+bad);
}
const w98Qanna=w98Between('el-qanna','yhwh-yireh');
for(const snippet of ['Исх. 34:14 и Втор. 4:24','исключительной верности','богословская аналогия, а не буквальный перевод']){
 if(!w98Qanna.includes(snippet))throw Error('W98 QANNA semantic guard missing: '+snippet);
}
if(w98Qanna.includes('Как отмечали пуританские богословы (Стивен Чарнок, Томас Уотсон)'))
 throw Error('W98 unverified named Puritan quotation returned');

if(!w98Qanna.includes('קַנָּא שְׁמוֹ') || w98Qanna.includes('שְׁמוֹ קַנָּא'))
 throw Error('W98b Exodus 34:14 Hebrew word-order regression');
console.log('W98B_QANNA_MT_WORD_ORDER_PASS');
console.log('W98_YAH_QANNA_SOURCE_HONESTY_PASS');


// W99: preserve quoted Synodal Russian verses exactly; locate Hebrew
// annotations in separate note fields rather than within the quotations.
const w99Src=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
const w99Start=w99Src.indexOf("id: 'yah'"), w99Finish=w99Src.indexOf("id: 'ehyeh-asher-ehyeh'",w99Start+1);
if(w99Start<0||w99Finish<w99Start)throw Error('W99 stable Yah id bounds missing');
const w99Yah=w99Src.slice(w99Start,w99Finish);
for(const required of [
"synodal: '«Господь крепость моя и слава моя, Он был мне спасением».',",
"synodal: '«Пойте Богу нашему, пойте имени Его, превозносите Шествующего на небесах; имя Ему: Господь, и радуйтесь пред лицем Его».',",
"note: 'Синодальная цитата без редакторских вставок;",
"note: 'В еврейском тексте за русским «Господь» стоит יָהּ"
])if(!w99Yah.includes(required))throw Error('W99 Synodal and original distinction missing: '+required);
for(const old of ['Господь [יָהּ] — сила моя','Он соделался моим спасением','имя Ему: Господь [יָהּ]','В повествовании Исх. 15:2'])
 if(w99Yah.includes(old))throw Error('W99 mixed or inaccurate quotation returned: '+old);
console.log('W99_YAH_SYNODAL_VERBATIM_PASS');


// W100: originals in square brackets are editorial additions, not words
// found in the chosen Russian translation; copied snippets must disclose
// this status instead of silently passing annotations as Scripture.
const w100Modal=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
for(const required of [
'Слова оригинала в квадратных скобках — редакторские пояснения',
'многоточия обозначают сокращения',
'const hasEditorialOriginal =',
'const editorialNote = hasEditorialOriginal',
'слова оригинала в квадратных скобках добавлены к русской цитате',
'await navigator.clipboard.writeText(`${synodal} (${ref})${editorialNote}${editorialOmissionNote}`)'
])if(!w100Modal.includes(required))throw Error('W100 quoted-text attribution/copy guard missing: '+required);
if(w100Modal.includes('await navigator.clipboard.writeText(`${synodal} (${ref})`);'))
 throw Error('W100 bare annotated verse copy returned without source clarification');
console.log('W100_EDITED_SCRIPTURE_GLOSS_COPY_PASS');


// W101: static checks alone cannot certify actual per-verse clipboard behavior.
// The pinned Chromium/WebKit visual QA must click the real copied-text control,
// compare annotated + clean cases, and record failures.
const w101Qa=fs.readFileSync(path.join(root,'checks','visual_review.cjs'),'utf8');
for(const required of [
 'async function auditAtlasClipboard(browser,engine,base)',
 'await auditAtlasClipboard(browser,engine,base);',
 "id:'elohim',text:'В начале сотворил Бог [אֱלֹהִים]'",
 "id:'yah',text:'Господь крепость моя и слава моя, Он был мне спасением'",
 "Object.defineProperty(navigator,'clipboard'",
 "getByRole('button',{name:'Копировать стих'})",
 "record('atlas-clipboard-browser'",
 "problem('BLOCKER','atlas-clipboard-browser-mismatch'"
])if(!w101Qa.includes(required))throw Error('W101 real browser clipboard witness missing: '+required);
console.log('W101_ATLAS_COPY_BROWSER_COVERAGE_PASS');

// W102: isolated UI clipboard copy needs a second, independent warning for
// incomplete scripture excerpts; annotations and ellipses can coexist.
const w102Modal=fs.readFileSync(path.join(root,'atlas','src','components','DivineNameModal.tsx'),'utf8');
const w102Visual=fs.readFileSync(path.join(root,'checks','visual_review.cjs'),'utf8');
for(const required of [
 'const editorialOmissionNote = /…|\\.{3}/u.test(synodal)',
 'Редакторские сокращения: многоточия обозначают пропущенные фрагменты цитаты.',
 'await navigator.clipboard.writeText(`${synodal} (${ref})${editorialNote}${editorialOmissionNote}`)'
])if(!w102Modal.includes(required))throw Error('W102 missing independent ellipsis disclosure: '+required);
for(const required of [
 "id:'el',text:'Господь, Господь, Бог [אֵל]'",
 "id:'yhwh-roi',text:'Как пастырь Он будет пасти стадо Своё'",
 'hasOmissionNote===x.ellipsis',
 'verseIndex:1',
 'hasOmissionNote,disclosure'
])if(!w102Visual.includes(required))throw Error('W102 browser 4-case coverage missing: '+required);
console.log('W102_ELLIPSIS_COPY_DISCLOSURE_PASS');


// W103: Deut. 32 uses tsur for different poetic referents (not six direct
// divine names). Distinguish Paul's Christological reading from Hebrew lexeme.
const w103Atlas=fs.readFileSync(path.join(root,'atlas','src','data','divineNames.ts'),'utf8');
const w103Start=w103Atlas.indexOf("id: 'ha-tsur'"),w103End=w103Atlas.indexOf("id: 'goel'",w103Start+1);
if(w103Start<0||w103End<=w103Start)throw Error('W103 ha-tsur boundaries unavailable');
const w103Tsur=w103Atlas.slice(w103Start,w103End);
for(const required of [
 'слово צוּר («скала», «твердыня») используется с разными референтами',
 'ст. 31 противопоставляет «нашу Скалу» и «их скалу»',
 'В ст. 37–38 Бог иронически обличает бесполезность ложного прибежища',
 'а не доказательство, что каждое употребление צוּר во Втор. 32',
 'референт «камня» в котором по-разному истолковывают христианские традиции'
])if(!w103Tsur.includes(required))throw Error('W103 scoped referent guard missing: '+required);
for(const forbidden of [
 'Моисей шесть раз называет Бога «Твердыней»',
 'Сам Господь называет Своё слово и исповедание о Себе тем Камнем'
])if(w103Tsur.includes(forbidden))throw Error('W103 overclaim restored: '+forbidden);
console.log('W103_TSUR_REFERENT_SCOPE_PASS');
