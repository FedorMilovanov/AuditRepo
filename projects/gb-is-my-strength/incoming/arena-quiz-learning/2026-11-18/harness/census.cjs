// Reproduce the route/data census from the trusted exact Product dist; see REPORT.md.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createRequire} = require('node:module');
if (process.argv.length !== 4) throw new Error('Usage: node census.cjs PRODUCT OUT');
const root = path.resolve(process.argv[2]);
const out = path.resolve(process.argv[3]);
fs.mkdirSync(out, { recursive: true });
const req = createRequire(path.join(root, 'package.json'));
const parse5 = req('parse5');
const ts = req('typescript');
const walkFiles = (dir) => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e=>e.isDirectory()?walkFiles(path.join(dir,e.name)):[path.join(dir,e.name)]);
const walk = (node, fn) => { fn(node); for (const child of node.childNodes ?? []) walk(child, fn); };
const attrs = (node) => Object.fromEntries((node?.attrs ?? []).map(a=>[a.name, a.value]));
const text = (node) => node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const plain = s => String(s??'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const SITE = 'https://gospod-bog.ru';
function inlineConfig(script, route) {
 const ast = ts.createSourceFile(route, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
 const bindings = new Map();
 let config = null;
 function find(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) bindings.set(node.name.text,node.initializer.getText(ast));
  if (ts.isBinaryExpression(node) && node.left.getText(ast)==='window.SITE_CONFIG') {
    if(ts.isObjectLiteralExpression(node.right)) config=node.right.getText(ast);
    else if(ts.isIdentifier(node.right)) config=bindings.get(node.right.text)??null;
  }
  ts.forEachChild(node, find);
 }
 find(ast);
 return config ? vm.runInNewContext(`(${config})`, Object.create(null),{timeout:500}) : null;
}
const dist = path.join(root,'dist');
const pages = new Map(), disclosures = [], reflectionBlocks = [];
for (const f of walkFiles(dist).filter(s=>s.endsWith('.html')).sort()) {
 const route = '/'+path.relative(dist,f).replace(/index\.html$/,'');
 const doc = parse5.parse(fs.readFileSync(f,'utf8'));
 const ids = Object.create(null), outline = [], scripts = [], staticQuiz = [];
 let reflection = false;
 let pageId = null, seriesTheme = null, type = null, title = null;
 walk(doc,n=>{
   if (!n.tagName) return;
   const a=attrs(n);
   if (a.id) (ids[a.id] ||= []).push(n);
   if ('data-quiz-questions' in a) staticQuiz.push(n);
   if (/^h[1-6]$/.test(n.tagName) && plain(text(n)).includes('Вопросы для личной рефлексии')) reflection = true;
   if ('data-outline-link' in a) outline.push({href:a.href, label:plain(text(n))});
   if (a['data-gill-v16']) {pageId=a['data-gill-v16'];seriesTheme=a['data-series-theme'];}
   if (n.tagName==='title') title=plain(text(n));
   if (n.tagName==='script'&&!a.src&&n.childNodes.length && text(n).length < 500000 && /window\.SITE_CONFIG\s*=/.test(text(n))) scripts.push(text(n));
 });
 if (reflection) reflectionBlocks.push(route);
 for (const section of staticQuiz) {
   const questions = [];
   walk(section,n=>{
     if (n.tagName!=='details' || !('data-correct-index' in attrs(n))) return;
     const choices=[];
     walk(n,d=>{ if (d.tagName==='li') choices.push({text:plain(text(d)),correct:attrs(d)['data-correct']==='true'}); });
     const [summary,,expl] = n.childNodes.filter(c=>c.tagName);
     questions.push({summary:plain(text(summary)),open:'open' in attrs(n),correct:Number(attrs(n)['data-correct-index']),options:choices,explanation:plain(text(expl))});
   });
   disclosures.push({route,sectionId:attrs(section).id,declared:Number(attrs(section)['data-quiz-questions']),questions});
 }
 const configs=scripts.map(s=>inlineConfig(s,route)).filter(Boolean);
 const config=configs[configs.length-1]??null;
 const article=config?.quiz;
 type=config?.page?.type??null;
 const sheet=ids.gillLearningOverlay?.length??0;
 const deck=ids.gillQuizData ? JSON.parse(attrs(ids.gillQuizData[0])['data-quiz']??'[]') : [];
 pages.set(route,{route,title,type,pageId,seriesTheme,configs:configs.length,article,placeholder:ids.quizPlaceholder?.length??0,sheet,deck,opener:ids.mobLearningBtn?.length??0,outline,ids});
}
const anchor = (route, href) => {
 if (!href) return {state:'absent'};
 try {
  const url = new URL(href, SITE + route);
  if (url.origin!==SITE) return {state:'external',href:url.href};
  const page = pages.get(url.pathname)??pages.get(url.pathname+'/');
  const id=decodeURIComponent(url.hash.slice(1));
  if (!page) return {state:'missing-page',href:url.pathname+url.hash};
  if (!id) return {state:'no-fragment',href:url.pathname};
  const nodes=page.ids[id]??[];
  return {state:nodes.length===1?'ok':nodes.length?'duplicate-id':'missing-fragment',href:url.pathname+url.hash,target: nodes.length ? plain(text(nodes[0])).slice(0,280) : undefined,tag:nodes[0]?.tagName};
 } catch (e) {return {state:'invalid-url',href, error:String(e)};}
};
const validateQuestion = (q, options, correct) => ({
 options:options.length,
 duplicateOptions: new Set(options.map(o=>plain(o).toLocaleLowerCase('ru'))).size!==options.length,
 correct, valid: Number.isInteger(correct)&&correct>=0&&correct<options.length,
 explanation: (typeof q.explanation==='string' ? q.explanation : (q.explanation?.full||q.explanation?.short||'')).trim().length>0,
});
const article = [], sheet = [];
for (const p of pages.values()) {
 const a=p.article;
 if (a?.questions?.length || p.placeholder || a?.bonusQuestions?.length) {
  const questions=(a?.questions??[]).map((q,n)=>({...validateQuestion(q,q.options??[],Number(q.correct)),n:n+1,id:q.id??null,source:anchor(p.route,q.sourceRef?.href ?? (typeof q.sourceRef==='string' ? q.sourceRef : undefined)),category:q.category??null,difficulty:q.difficulty??null,full:typeof q.explanation==='object'&&!!q.explanation?.full}));
  const scoreTiers=a?.scores??[];
  const gaps=scoreTiers.length ? Array.from({length:questions.length+1},(_,i)=>i).filter(i=>!scoreTiers.some(t=>i>=Number(t.min)&&(t.max===undefined||t.max===null||t.max===''||i<=Number(t.max)))) : [];
  article.push({route:p.route,title:p.title,configs:p.configs,placeholder:p.placeholder,questions,scoreTiers:scoreTiers.map(({min,max})=>({min,max})),gaps,bonus:a?.bonusQuestions?.length??0});
 }
 if (p.sheet||p.deck.length||p.opener) {
  const questions=p.deck.map(q=>({...validateQuestion(q,q.answers??[],Number(q.correctIndex)),id:q.id,relatedPageId:q.relatedPageId??null,category:q.category,source:anchor(p.route,q.sourceHref)}));
  sheet.push({route:p.route,pageId:p.pageId,theme:p.seriesTheme,opener:p.opener,outline:p.outline.map(o=>({label:o.label,...anchor(p.route,o.href)})),questions});
 }
}
const quizFile = path.join(root,'_build-tools/konfessii-baptizm/reconciled-app/src/data/quizData.ts');
const js=ts.transpile(fs.readFileSync(quizFile,'utf8'), {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022});
const appSource={exports:{}};
vm.runInNewContext(js,appSource,{timeout:500});
const appQuestions=appSource.exports.ALL_QUIZ_QUESTIONS;
const by=(xs,key)=>xs.reduce((o,x)=>(o[key(x)]=(o[key(x)]??0)+1,o),{});
const unique = [...new Map(sheet.flatMap(x=>x.questions).map(q=>[q.id,q])).values()];
const summary={
  htmlPages:pages.size, articleRoutes:article.length, articleQuestions:article.flatMap(r=>r.questions).length,
  articleBySource:by(article.flatMap(r=>r.questions),q=>q.source.state), articleAnswerIndex:by(article.flatMap(r=>r.questions),q=>q.correct),
  articleMissingExplanation:article.flatMap(r=>r.questions).filter(q=>!q.explanation).length,
  articleFullExplanation:article.flatMap(r=>r.questions).filter(q=>q.full).length,
  learningRoutes:sheet.length, learningDecks:sheet.filter(r=>r.questions.length).length,
  learningUnique:unique.length, learningProjected:sheet.flatMap(r=>r.questions).length, learningBySource:by(unique,q=>q.source.state),
  learningOutlineEmpty:sheet.filter(r=>r.outline.length===0).length,
  learningOutlineLinks:sheet.flatMap(r=>r.outline).length, learningOutlineBySource:by(sheet.flatMap(r=>r.outline),o=>o.state),
  disclosureRoutes:disclosures.length, disclosureQuestions:disclosures.flatMap(r=>r.questions).length, reflectionBlocks,
  mapQuestions:appQuestions.length, mapByTopic:by(appQuestions,q=>q.topic), mapSourceLabels:appQuestions.filter(q=>q.source).length, mapAnswerIndex:by(appQuestions,q=>q.correctIndex),
};
const ship=fs.readFileSync(path.join(dist,'konfessii/russkij-baptizm/_app/index.html'),'utf8');
const result={summary,article,sheet,disclosures,map:appQuestions.map(q=>({...validateQuestion(q,q.options,q.correctIndex),id:q.id,topic:q.topic,difficulty:q.difficulty,sourceLabel:q.source??null,questionInBuiltAsset:ship.includes(q.question)}))};
fs.writeFileSync(path.join(out,'census.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(out,'question-corpus.json'),JSON.stringify({article:article.map(({route})=>({route,...pages.get(route).article})),learning:[...new Map([...pages.values()].flatMap(p=>p.deck).map(q=>[q.id,q])).values()],map:appQuestions},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
for (const r of article) console.log('article',r.route,r.placeholder,r.questions.length,JSON.stringify(by(r.questions,q=>q.source.state)), 'score gaps',r.gaps.join(','),'bonus',r.bonus,'key',r.questions.map(q=>q.correct).join(''));
for (const r of sheet) console.log('sheet',r.route,r.pageId,r.theme,r.questions.length,'own',r.questions.filter(q=>q.relatedPageId===r.pageId).length,'outline',r.outline.length,'bad anchors',r.outline.filter(o=>o.state!=='ok').length);
console.log('question schema problems',article.flatMap(r=>r.questions).concat(unique,result.map).filter(q=>q.options<2||!q.valid||q.duplicateOptions||!q.explanation));
console.log('map bundle missing exact title',result.map.filter(q=>!q.questionInBuiltAsset));
