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
   !atlasModal.includes('<strong>Значение и перевод:</strong>') ||
   !atlasModal.includes('Христианское прочтение во свете Христа'))
  throw Error('Atlas expanded dossier must distinguish textual type, translation and Christian interpretation');
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


const readerSection=fs.readFileSync(path.join(root,'sozvezdie','src','components','NameSection.tsx'),'utf8');
const readerEpilogue=fs.readFileSync(path.join(root,'sozvezdie','src','components','Epilogue.tsx'),'utf8');
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
if (!qAtlasModal.includes('inline-block whitespace-nowrap') ||
    !qAtlasModal.includes('data-modal-original') ||
    !qAtlasModal.includes("entry.original.replace(/(τὸ|"))
  throw Error('Visual regression: Greek articles can become orphan glyphs');
if (!qAtlasModal.includes('sm:flex-row sm:items-center sm:justify-between') ||
    !qAtlasModal.includes('min-h-11 min-w-11'))
  throw Error('Visual regression: narrow dossier header has inaccessible controls');
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
    !atlasReaderText.includes('само&shy;откровение') ||
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
if((readerEpilogueContacts.match(/inline-flex min-h-11 items-center gap-2 rounded-lg px-2/g)||[]).length!==2||
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
