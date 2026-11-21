// Native UI, keyboard, and browser history. No writes from evaluate/initScript to
// product state, scroll, focus, URL, or storage. Built Pagefind is a separate mount.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readFile, stat} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';

const [pArg, indexArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && indexArg && oArg && executablePath,
  'node library-search-navigation.mjs PRODUCT PAGEFIND_DIR FRESH_OUT CHROMIUM [id-regexp]');
const P=path.resolve(pArg), dist=path.join(P,'dist'), index=path.resolve(indexArg), out=path.resolve(oArg);
const req=createRequire(path.join(P,'package.json')), {chromium}=req('playwright');
const product='9edef94ece08012223c1364bec7ddcd561cf5713';
const SRC='/articles/dzhon-gill-chast-2-uchenyi/', NOTE='Черновик: перечитать пояснение к Песни Песней.';
const EDIT='Правка: проверить источник в оригинале.';
const FROM='sec-canticles', TO='sec-deism-polemic', START=SRC+'#'+FROM;
const OTHER='/articles/anatomiya-padeniya-pyat-stadiy/', EXACT=SRC+'#'+TO;
const QUERY='Анатомия падения', REF='Второзаконие 33:8';
const refIndex=JSON.parse(fs.readFileSync(path.join(dist,'data/scripture-search-index.json'),'utf8'));
const hits=refIndex.references.find(r=>r.label===REF)?.occurrences??[];
assert.equal(hits.length,1);assert.equal(hits[0].url+'#'+hits[0].anchor,EXACT);
const GILL_TITLE=hits[0].title;
const MISS='gill.scholar.canticles', SEARCH='overlay:search:command-palette', LIB='highlights';
const INPUT='cp-input', CANCEL='gb-hl-note-cancel', AREA='gb-hl-note-text';
const arms=['route-solo','route-draft','route-saved','route-edit','route-escape','exact-solo','exact-draft'];
const jobs=[...[390,1440].flatMap(width=>arms.map(arm=>({arm,width,height:width===390?844:900}))),
  {arm:'exact-link',width:1440,height:900}]
  .map(j=>({...j,id:j.arm+'-'+j.width})).filter(j=>!only||new RegExp(only,'u').test(j.id));
assert.ok(jobs.length);fs.mkdirSync(out,{recursive:true});
assert.ok(!fs.readdirSync(out).length,'use a fresh output directory');
assert.ok(!fs.existsSync(path.join(dist,'pagefind')),'unmodified dist must not include a local index');
const entry=JSON.parse(fs.readFileSync(path.join(index,'pagefind-entry.json'),'utf8'));
assert.equal(entry.version,'1.5.2');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const pinsHash=pins=>createHash('sha256').update(JSON.stringify(pins)).digest('hex');
const indexPins=Object.fromEntries(fs.readdirSync(index,{recursive:true}).sort().filter(f=>fs.statSync(path.join(index,f)).isFile())
  .map(f=>[f,hash(path.join(index,f))]));
async function serve(){
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css',
    '.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png',
    '.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.wav':'audio/wav','.mp3':'audio/mpeg'};
  const server=createServer(async (q,r)=>{
    try{
      if(q.method!=='GET'&&q.method!=='HEAD'){r.writeHead(405).end();return;}
      const s=decodeURIComponent(new URL(q.url,'http://127.0.0.1').pathname), mount=s.startsWith('/pagefind/');
      const root=mount?index:dist;
      let f=path.resolve(root,'.'+(mount?s.slice(9):s));
      assert.ok(f===root||f.startsWith(root+path.sep));
      if((await stat(f)).isDirectory())f=path.join(f,'index.html');
      const body=await readFile(f);
      r.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream','cache-control':'no-store','content-length':body.length});
      r.end(q.method==='HEAD'?undefined:body);
    }catch{r.writeHead(404,{'content-type':'text/plain'}).end('not found');}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  return {server,base:'http://127.0.0.1:'+server.address().port};
}
function install({from,to,src}){
  const q=s=>document.querySelector(s);
  const name=e=>!e?.matches?null:e.matches('.cp-input')?'cp-input':e.matches('#gb-hl-editor button[type=submit]')?'note-submit':
    e.dataset?.scope?'scope:'+e.dataset.scope:e.id||e.classList?.[0]||e.tagName;
  const layer=e=>e?.closest?.('#gb-hl-backdrop,.cp-backdrop,#gillLearningOverlay')?.matches('#gb-hl-backdrop')?'library':
    e?.closest?.('.cp-backdrop')?'search':e?.closest?.('#gillLearningOverlay')?'learning':null;
  const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
  const href=s=>new URL(s,location.href).pathname+new URL(s,location.href).hash;
  function hit(e){
    if(!e)return null;
    const b=e.getBoundingClientRect(),x=b.x+b.width/2,y=b.y+b.height/2;
    const target=document.elementFromPoint(x,y);
    return {rect:[b.x,b.y,b.width,b.height].map(n=>Math.round(n*100)/100),
      inView:b.width>0&&b.height>0&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight,
      hit:e.contains(target),target:name(target),layer:layer(target),inert:Boolean(e.closest('[inert]'))};
  }
  const shell=e=>e?{open:e.classList.contains('is-open'),aria:e.getAttribute('aria-hidden'),inert:e.inert}:null;
  function selected(){
    const input=q('.cp-input'),id=input?.getAttribute('aria-activedescendant'), el=id?document.getElementById(id):null;
    const link=q('#cp-read-btn');
    return el?{id,role:el.getAttribute('role'),selected:el.getAttribute('aria-selected')==='true',activeClass:el.matches('.is-active'),
      title:norm(el.querySelector('.cp-item-title')?.textContent),group:norm(el.closest('.cp-group')?.querySelector('.cp-group-hd span')?.textContent),
      href:link?href(link.href):null,rendered:el.getClientRects().length>0,hit:hit(el),linkHit:hit(link)}:null;
  }
  function short(){
    const ed=q('#gb-hl-editor'),a=document.activeElement;
    return {url:location.pathname+location.hash,doc:performance.timeOrigin,
      nav:performance.getEntriesByType('navigation').at(-1)?.type??null,history:history.length,
      focus:name(a),scroll:Math.round(scrollY),body:[getComputedStyle(document.body).position,document.body.style.top],
      locks:Object.keys(window.SiteUtils?._scrollLockSources||{}).sort(),
      owners:(window.OverlayRuntime?.snapshot()||[]).map(x=>x.ownerId),
      library:shell(q('#gb-hl-backdrop')),palette:shell(q('.cp-backdrop')),
      editor:ed?{open:!ed.hidden,value:q('#gb-hl-note-text').value}:null,
      searchHistory:JSON.parse(localStorage.getItem('gb-cp-history')??'[]')};
  }
  function state(){
    const raw=JSON.parse(localStorage.getItem('gb:reader-state:v1:gb-strength:'+src.slice(0,-1))??'null');
    const quiz=Object.fromEntries(['glsQuizQuestion','glsQuizVerdict','glsQuizExplanation','glsQuizSource','glsQuizConf','glsQuizStreak'].map(id=>{
      const e=document.getElementById(id);return [id,e?[norm(e.textContent),e.hidden,e.getAttribute('href')]:null];
    }));
    quiz.options=[...document.querySelectorAll('#glsQuizOptions button')].map(e=>[norm(e.textContent),e.disabled]).sort(([a],[b])=>a.localeCompare(b,'ru'));
    return {...short(),
      activeHit:hit(document.activeElement),inputHit:hit(q('.cp-input')),input:q('.cp-input')?.value??null,
      scope:q('.cp-scope-chip[aria-pressed="true"]')?.dataset.scope??null,pagefindReady:window.__pagefindReady__===true,
      selected:selected(),h1:norm(q('h1')?.textContent),from:hit(document.getElementById(from)),to:hit(document.getElementById(to)),
      fragmentTarget:document.querySelector(':target')?.id??null,learning:shell(q('#gillLearningOverlay')),quiz,
      notes:JSON.parse(localStorage.getItem('gb-reader-notes-v1')??'[]').map(n=>({...n,url:href(n.url)})),
      reader:raw?{section:raw.sectionId,scroll:raw.scrollY,source:raw.source}:null};
  }
  const events=[];
  function event(type,e){
    const record={type,trusted:e.isTrusted,persisted:e.persisted??null,...short()};
    console.debug('GB_NAV_LIFECYCLE '+JSON.stringify(record));
  }
  for(const type of ['pageshow','pagehide','popstate','hashchange'])addEventListener(type,e=>event(type,e));
  for(const type of ['click','keydown','submit'])addEventListener(type,e=>{
    if(type==='keydown'&&!['Enter','Escape','ArrowDown','Tab','ArrowUp'].includes(e.key)&&!(e.ctrlKey&&e.key.toLowerCase()==='k'))return;
    const record={type,key:e.key??null,trusted:e.isTrusted,target:name(e.target),layer:layer(e.target),
      ...short(),selected:type==='keydown'&&e.key==='Enter'&&e.target.matches('.cp-input')?selected():null};
    events.push(record);
    if(record.selected)console.debug('GB_NAV_ENTER '+JSON.stringify(record));
  },{capture:true,passive:true});
  for(const type of ['gb:overlay-open','gb:overlay-close'])document.addEventListener(type,e=>{
    const record={type,owner:e.detail?.ownerId,reason:e.detail?.reason,...short()};
    events.push(record);
    if(record.owner==='search:command-palette')console.debug('GB_NAV_OVERLAY '+JSON.stringify(record));
  });
  window.__gbNavAudit={state,events};
}
const snapshot=p=>p.evaluate(()=>__gbNavAudit.state());
const settle=async(p,ms=160)=>{await p.waitForTimeout(ms);return snapshot(p);};
const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
async function tabTo(p,predicate){
  const trace=[];
  for(let i=0;i<17;i++){
    await p.keyboard.press('Tab');const s=await settle(p,55);trace.push(s.focus);
    if(predicate(s.focus))return trace;
  }
  throw Error('Tab target not reached: '+trace.join(', '));
}
async function learning(p,tab){
  await p.locator(await p.locator('#railSettingsBtn').isVisible()?'#railSettingsBtn':'#mobSettingsBtn').click();
  await p.locator('#mobLearningBtn').click();
  await p.locator('#gillLearningOverlay.is-open').waitFor();
  await p.waitForFunction(()=>document.activeElement?.closest('#gillLearningOverlay'));
  await p.locator(tab).click();
}
async function fromMiss(p){
  await learning(p,'#tabQuiz');
  const pool=JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for(let i=0;i<pool.length;i++){
    const question=norm(await p.locator('#glsQuizQuestion').innerText());
    const item=pool.find(x=>norm(x.question)===question);assert.ok(item);
    await p.locator('#glsQuizConfRow [data-conf="sure"]').click();
    await p.locator('#glsQuizOptions').getByRole('button',{name:item.answers[(item.correctIndex+1)%item.answers.length],exact:true}).click();
    if(item.id!==MISS){await p.locator('#glsQuizNext').click();continue;}
    const before=await snapshot(p);
    assert.match(before.quiz.glsQuizVerdict[0],/^Неверно/u);
    assert.match(before.quiz.glsQuizSource[2],/#sec-canticles$/u);
    await p.locator('#tabQuiz').click();await tabTo(p,k=>k==='glsQuizSource');await p.keyboard.press('Enter');
    await p.waitForFunction(id=>location.hash==='#'+id&&document.activeElement?.id===id,FROM);
    const result=await settle(p);
    assert.equal(result.url,START);assert.ok(result.from.hit&&result.from.inView&&result.scroll>400);
    assert.deepEqual(result.locks,[]);assert.deepEqual(result.quiz,before.quiz);
    return result;
  }
  throw Error('authored question not reached');
}
async function library(p){
  await learning(p,'#tabNotes');await tabTo(p,k=>k==='manageNotesBtn');await p.keyboard.press('Enter');
  await p.locator('#gb-hl-backdrop.is-open').waitFor();
  await p.locator('#gb-hl-list :is(.gb-hl-item,.gb-hl-empty-title)').first().waitFor();
  const s=await settle(p,125);assert.deepEqual(s.locks,[LIB]);assert.ok(s.library.open&&!s.learning.open);
  return s;
}
async function compose(p,text,edit=false){
  await p.locator(edit?'#gb-hl-list [data-library-action="edit-note"]':'#gb-hl-new-note').click();
  await p.waitForFunction(id=>document.activeElement?.id===id,AREA);
  if(text){
    if(edit)await p.keyboard.press('Control+a');
    await p.keyboard.insertText(text);
  }
  return snapshot(p);
}
async function save(p){
  const trace=await tabTo(p,k=>k==='note-submit');await p.keyboard.press('Enter');
  await p.locator('#gb-hl-list .gb-hl-item[data-type="note"]').waitFor();
  const s=await settle(p,120);assert.ok(!s.editor.open);assert.equal(s.notes[0]?.text,NOTE);assert.equal(s.notes.length,1);
  return {trace,state:s};
}
async function search(p,row,stack,exact,wanted){
  await p.keyboard.press('Control+k');
  await p.waitForFunction(()=>document.activeElement?.matches('.cp-input')&&document.querySelector('.cp-backdrop.is-open'));
  await p.waitForFunction(()=>window.__pagefindReady__===true);
  if(exact){row.scopeTabs=await tabTo(p,k=>k==='scope:scripture');await p.keyboard.press('Enter');}
  await p.keyboard.insertText(exact?REF:QUERY);
  await p.waitForFunction(({group,exact})=>{
    const s=__gbNavAudit.state();return s.scope===(exact?'scripture':'all')&&s.selected?.group===group;
  },{exact,group:exact?'Точные вхождения':'Статьи'});
  const arrows=[];
  for(let i=0;i<18;i++){
    const s=await settle(p,i?45:370);arrows.push([s.selected?.id,s.selected?.href]);
    if(s.selected?.href===wanted){
      assert.ok(s.selected.selected&&s.selected.activeClass&&s.selected.rendered&&s.selected.hit.inView);
      assert.equal(s.selected.role,'option');assert.equal(s.focus,INPUT);assert.equal(s.input,exact?REF:QUERY);assert.equal(s.inputHit.hit,!stack);
      if(stack){assert.ok(s.library.open&&!s.library.inert);assert.equal(s.inputHit.layer,'library');assert.equal(s.selected.hit.layer,'library');}
      assert.deepEqual(s.locks,stack?[LIB,SEARCH]:[SEARCH]);
      row.arrows=arrows;return s;
    }
    await p.keyboard.press('ArrowDown');
  }
  throw Error('target not reached: '+JSON.stringify(arrows));
}
const shot=(p,r,stage)=>p.screenshot({path:path.join(out,`${r.id}-${stage}.png`),animations:'disabled'});
async function exercise(p,base,r){
  const exact=r.arm.startsWith('exact-'),stack=!['route-solo','exact-solo','exact-link'].includes(r.arm);
  const saving=['route-edit','route-saved'].includes(r.arm), editing=r.arm==='route-edit';
  const activeDraft=stack&&r.arm!=='route-saved';
  assert.equal((await p.goto(base+SRC,{waitUntil:'load'})).status(),200);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  await p.locator('#gb-hl-backdrop').waitFor({state:'attached'});
  const init=await snapshot(p);
  assert.deepEqual(init.notes,[]);assert.equal(init.palette,null);
  r.source=await fromMiss(p);
  if(stack){
    await library(p);
    if(saving){
      await compose(p,NOTE);r.saved=await save(p);
      if(r.arm==='route-saved')await p.locator('#gb-hl-tabs [data-library-tab=note]').click();
    }
    if(activeDraft){
      r.draft=await compose(p,editing?EDIT:NOTE,editing);
      assert.ok(r.draft.editor.open);assert.equal(r.draft.editor.value,editing?EDIT:NOTE);
      r.toCancel=await tabTo(p,k=>k===CANCEL);
    }
  }
  const dst=exact?EXACT:OTHER;
  r.selected=await search(p,r,stack,exact,dst);
  assert.equal(r.selected.doc,r.source.doc);assert.equal(r.selected.url,START);assert.equal(r.selected.history,r.source.history);
  assert.deepEqual(r.selected.quiz,r.source.quiz);assert.deepEqual(r.selected.searchHistory,[]);
  assert.deepEqual(r.selected.notes,saving?r.saved.state.notes:[]);
  if(activeDraft){assert.deepEqual(r.selected.editor,r.draft.editor);}
  if(['route-solo-390','route-draft-390'].includes(r.id))await shot(p,r,'selected');
  if(r.arm==='route-escape'){
    await p.keyboard.press('Escape');r.escaped=await settle(p,500);
    assert.equal(r.escaped.focus,CANCEL);assert.deepEqual(r.escaped.editor,r.draft.editor);
    assert.deepEqual(r.escaped.locks,[LIB]);assert.ok(!r.escaped.palette.open);
    assert.equal(r.escaped.url,START);assert.equal(r.escaped.history,r.source.history);assert.equal(r.escaped.doc,r.source.doc);
    assert.deepEqual(r.escaped.searchHistory,[]);assert.deepEqual(r.escaped.notes,[]);
    r.saved=await save(p);
    await p.locator('#gb-hl-close').click();r.final=await settle(p);
    assert.deepEqual(r.final.quiz,r.source.quiz);assert.equal(r.final.scroll,r.source.scroll);assert.ok(r.final.from.hit);
    return;
  }
  if(r.arm==='exact-link'){
    assert.ok(r.selected.selected.linkHit?.hit);
    await Promise.all([p.waitForURL(base+dst),p.locator('#cp-read-btn').click()]);
  }else{
    const waiting=p.waitForURL(base+dst,{waitUntil:'load'});
    await p.keyboard.press('Enter');await waiting;
  }
  if(exact)await p.waitForFunction(id=>location.hash==='#'+id,TO);
  else await p.locator('h1').first().waitFor();
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  r.destination=await settle(p,520);
  assert.equal(r.destination.url,dst);assert.equal(r.destination.history,r.source.history+1);
  assert.deepEqual(r.destination.searchHistory,[exact?GILL_TITLE:r.selected.selected.title]);
  assert.deepEqual(r.destination.notes,r.selected.notes);
  if(!exact)assert.match(r.destination.h1,/^Анатомия падения/u);
  if(r.id==='exact-solo-1440'||r.id==='exact-link-1440')await shot(p,r,'destination');
  await p.goBack({waitUntil:'commit'});
  await p.waitForURL(base+START,{waitUntil:'load'});
  await p.locator('#gb-hl-backdrop').waitFor({state:'attached'});
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  r.back=await settle(p,520);
  assert.equal(r.back.url,START);assert.equal(r.back.history,r.source.history+1);
  assert.deepEqual(r.back.notes,r.selected.notes);assert.deepEqual(r.back.searchHistory,r.destination.searchHistory);
  if(!exact){
    if(r.width===390&&['route-solo','route-draft'].includes(r.arm))await shot(p,r,'back');
    await learning(p,'#tabQuiz');
    await p.locator('#glsQuizOptions button').first().waitFor();
    r.quizBack=await settle(p);
    await p.keyboard.press('Escape');
    if(stack){
      r.libraryBack=await library(p);
      r.editorBack=await compose(p,null,saving);
      if(r.id==='route-draft-390')await shot(p,r,'reopened');
      await p.locator('#gb-hl-note-cancel').click();await p.locator('#gb-hl-close').click();
    }
  }else if(r.arm!=='exact-link'){
    if(r.back.palette?.open){await p.keyboard.press('Escape');r.afterEscape=await settle(p,380);}
    if(stack&&r.back.library?.open){
      assert.deepEqual(r.afterEscape.editor,r.draft.editor);
      r.saved=await save(p);
      await p.locator('#gb-hl-close').click();
    }
  }
  r.final=await settle(p);
}
const pins=new Set(), fetchedIndex=new Set(), rows=[];
const {server,base}=await serve();let browser;
try{
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const j of jobs){
    const r={...j,docs:[],indexResponses:[],indexJSON:[],lifecycle:[],overlay:[],enter:[],notRestored:[],errors:[]};rows.push(r);
    const ctx=await browser.newContext({viewport:{width:j.width,height:j.height},reducedMotion:'reduce',colorScheme:'light',serviceWorkers:'block'});
    try{
      ctx.setDefaultTimeout(8500);await ctx.addInitScript(install,{from:FROM,to:TO,src:SRC});
      await ctx.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
      ctx.on('weberror',e=>r.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('requestfailed',q=>{
        const url=new URL(q.url()), err=q.failure()?.errorText;
        if(url.origin===base&&err!=='net::ERR_ABORTED')r.errors.push(['request',url.pathname,err]);
      });
      ctx.on('response',res=>{
        const url=new URL(res.url()),q=res.request(),status=res.status(),type=q.resourceType(),method=q.method();
        if(url.origin!==base)return;
        const pathname=url.pathname;
        if(type==='document')r.docs.push([pathname,status,res.headers()['cache-control']]);
        if(status>=400)r.errors.push(['http',method,pathname,status]);
        if(pathname.startsWith('/pagefind/')){
          r.indexResponses.push([method,pathname,status]);fetchedIndex.add(pathname.slice(10));return;
        }
        if(pathname==='/data/scripture-search-index.json')r.indexJSON.push([method,pathname,status]);
        if(res.ok()&&method==='GET'&&(['script','stylesheet','font','document'].includes(type)||pathname.startsWith('/data/')&&pathname.endsWith('.json'))){
          let f=pathname.slice(1).replace(/\/*$/u,'');if(type==='document'&&!f.endsWith('.html'))f=f?f+'/index.html':'index.html';pins.add(f);
        }
      });
      const p=await ctx.newPage(),cd=await ctx.newCDPSession(p);await cd.send('Page.enable');
      cd.on('Page.backForwardCacheNotUsed',e=>r.notRestored.push(e.notRestoredExplanations.map(x=>[x.type,x.reason]).sort()));
      p.on('console',e=>{
        const text=e.text();
        for(const [prefix,k] of [['GB_NAV_LIFECYCLE ','lifecycle'],['GB_NAV_ENTER ','enter'],['GB_NAV_OVERLAY ','overlay']])
          if(text.startsWith(prefix))r[k].push(JSON.parse(text.slice(prefix.length)));
        if(text.includes('Emergency unlock'))r.errors.push(['emergency',text]);
      });
      try{await exercise(p,base,r);}finally{
        r.currentEvents=await p.evaluate(()=>window.__gbNavAudit?.events??[]);
      }
      assert.deepEqual(r.errors,[]);assert.equal(ctx.pages().length,1);r.ok=true;
      console.log('OK',r.id,'dst='+String(r.destination?.url??'-'),'back='+String(r.back?.focus??'-'),
        'HTML='+r.docs.length,'editor='+JSON.stringify(r.editorBack?.editor??r.back?.editor??r.final?.editor));
    }catch(e){r.error=e.stack?.replaceAll(base,'LOCAL')??String(e);r.ok=false;console.error('FAIL',r.id,r.error);}
    finally{await ctx.close();}
  }
  const w={product,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    server:{cacheControl:'no-store',serviceWorkers:'block',network:'local only; external requests aborted',pagefindMount:'/pagefind/'},
    pagefind:{entry,manifestSha256:hash(path.join(index,'pagefind-entry.json')),indexFiles:Object.keys(indexPins).length,treeSha256:pinsHash(indexPins),
      fetchedSha256:Object.fromEntries([...fetchedIndex].sort().map(f=>{assert.ok(indexPins[f],f);return [f,indexPins[f]];}))},
    distSha256:Object.fromEntries([...pins].sort().map(f=>[f,hash(path.join(dist,f))])), rows};
  fs.writeFileSync(path.join(out,'library-search-navigation-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${rows.filter(r=>r.ok).length}/${rows.length} measured; ${pins.size} dist + ${fetchedIndex.size} requested Pagefind files`);
  if(rows.some(r=>!r.ok))process.exitCode=1;
}finally{await browser?.close();await new Promise(r=>server.close(r));}
