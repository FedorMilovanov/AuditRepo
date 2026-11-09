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

