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
    !qAtlasPillars.includes('cardActionsNearDock') ||
    !qAtlasPillars.includes('Указатель выражений Писания'))
  throw Error('Visual regression: mobile drawer or reading-action clearance lost');
if (!qAtlasCard.includes('data-atlas-card-actions') ||
    !qAtlasCard.includes('min-h-11') ||
    qAtlasCard.includes('<span>Исполнение во Христе Иисусе</span>'))
  throw Error('Visual regression: Atlas actions or editorial interpretation labels lost');
if (!qDarkDock.includes('opacity-0 pointer-events-none') ||
    !qDarkDock.includes('bg-ink-950 px-1.5'))
  throw Error('Visual regression: dark reader dock obscures text while scrolling');
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
