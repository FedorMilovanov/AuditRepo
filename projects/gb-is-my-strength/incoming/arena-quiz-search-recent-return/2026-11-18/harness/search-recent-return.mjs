// Reader searches through the real palette. Instrumentation is read-only; the
// browser invokes actual keys/clicks. Pagefind has a separate read-only mount.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import path from 'node:path';

const [pArg,iArg,oArg,executablePath,filter]=process.argv.slice(2);
assert.ok(pArg&&iArg&&oArg&&executablePath,'node search-recent-return.mjs PRODUCT PAGEFIND_DIR FRESH_OUT CHROMIUM [id-regexp]');
const P=path.resolve(pArg), dist=path.join(P,'dist'), index=path.resolve(iArg), out=path.resolve(oArg);
const req=createRequire(path.join(P,'package.json')), {chromium}=req('playwright');
const anchor='9edef94ece08012223c1364bec7ddcd561cf5713';
const SRC='/articles/dzhon-gill-chast-2-uchenyi/', ANATOMY='/articles/anatomiya-padeniya-pyat-stadiy/', BIO='/biografii/';
const A={query:'Второзаконие 33:8',target:SRC+'#sec-deism-polemic',scope:'scripture'};
const B={query:'Евреям 10:7',target:SRC+'#sec-pactum',scope:'scripture'};
const C={query:'Анатомия падения',target:ANATOMY,scope:'all'};
const terms={ab:[A,B],ba:[B,A],mixed:[A,C]};
const RECENT='Недавние запросы', EXACT='Точные вхождения', ARTICLE='Статьи', MISS='gill.scholar.canticles';
const jobs=[390,1440].flatMap(width=>Object.keys(terms).map(arm=>({arm,width,height:width===390?844:900,id:arm+'-'+width})))
  .filter(j=>!filter||new RegExp(filter,'u').test(j.id));
assert.ok(jobs.length);fs.mkdirSync(out,{recursive:true});assert.equal(fs.readdirSync(out).length,0,'not fresh output');
assert.ok(!fs.existsSync(path.join(dist,'pagefind')));
const exactIndex=JSON.parse(fs.readFileSync(path.join(dist,'data/scripture-search-index.json'),'utf8'));
const matches=[A,B].map(f=>{
  const items=exactIndex.references.find(x=>x.label===f.query)?.occurrences??[];
  assert.equal(items.length,1);assert.equal(items[0].url+'#'+items[0].anchor,f.target);
  return items[0].title;
});
assert.equal(matches[0],matches[1]);const TITLE=matches[0];
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const indexPins=Object.fromEntries(fs.readdirSync(index,{recursive:true}).sort()
  .filter(f=>fs.statSync(path.join(index,f)).isFile()).map(f=>[f,sha(path.join(index,f))]));
const indexEntry=JSON.parse(fs.readFileSync(path.join(index,'pagefind-entry.json'),'utf8'));
assert.equal(indexEntry.version,'1.5.2');
const treeSha=createHash('sha256').update(JSON.stringify(indexPins)).digest('hex');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css',
  '.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png',
  '.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.mp3':'audio/mpeg','.wav':'audio/wav'};
const server=createServer(async (req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
    const url=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const mounted=url.startsWith('/pagefind/'), root=mounted?index:dist;
    let f=path.resolve(root,'.'+(mounted?url.slice(9):url));
    assert.ok(f===root||f.startsWith(root+path.sep));
    if((await stat(f)).isDirectory())f=path.join(f,'index.html');
    const data=await readFile(f);
    res.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream','cache-control':'no-store','content-length':data.length});
    res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404,{'content-type':'text/plain'}).end();}
});
const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
function observe(recent){
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
  const href=a=>a?new URL(a.href).pathname+new URL(a.href).hash:null;
  const name=e=>e?.matches('.cp-input')?'cp-input':e?.dataset.scope?'scope:'+e.dataset.scope:e?.id||e?.classList[0]||e?.tagName||null;
  const item=e=>({id:e.id,label:norm(e.querySelector('.cp-item-title')?.textContent),role:e.getAttribute('role'),
    selected:e.getAttribute('aria-selected')==='true'});
  const group=e=>norm(e?.querySelector('.cp-group-hd span')?.textContent);
  function geometry(e){
    if(!e)return null;
    const b=e.getBoundingClientRect(),x=b.x+b.width/2,y=b.y+b.height/2;
    const top=document.elementFromPoint(x,y);
    return {inView:b.width>0&&b.height>0&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight,hit:e.contains(top),y:Math.round(b.y*100)/100};
  }
  function current(){
    const id=q('.cp-input')?.getAttribute('aria-activedescendant'), e=id?document.getElementById(id):null;
    const a=q('#cp-read-btn');
    return e?{...item(e),group:group(e.closest('.cp-group')),href:href(a),box:geometry(e),preview:geometry(a)}:null;
  }
  const brief=()=>({doc:performance.timeOrigin,url:location.pathname+location.hash,nav:performance.getEntriesByType('navigation').at(-1)?.type,
    history:history.length,focus:name(document.activeElement),scope:q('.cp-scope-chip[aria-pressed=true]')?.dataset.scope??null,
    input:q('.cp-input')?.value??null,palette:!!q('.cp-backdrop.is-open'),active:current(),
    records:JSON.parse(localStorage.getItem('gb-cp-history')??'[]')});
  const read=()=>({...brief(),loaded:window.__pagefindReady__===true,scroll:Math.round(scrollY),
    h1:norm(q('h1')?.textContent),locks:Object.keys(window.SiteUtils?._scrollLockSources||{}).sort(),
    groups:qa('.cp-list .cp-group').map(g=>({group:group(g),items:[...g.querySelectorAll('[role=option]')].map(item)})),
    recent:qa('.cp-list .cp-group').filter(g=>group(g)===recent).flatMap(g=>[...g.querySelectorAll('[role=option]')].map(item)),
    target:geometry(location.hash?document.getElementById(location.hash.slice(1)):null),
    previewImage:(()=>{const e=q('.cp-preview-img');return e?{attr:e.getAttribute('src'),path:new URL(e.src).pathname,complete:e.complete,width:e.naturalWidth}:null;})(),
    loading:!!q('.cp-loading'),empty:norm(q('.cp-empty-title')?.textContent),status:norm(q('#cp-status')?.textContent),
    quiz:Object.fromEntries(['glsQuizQuestion','glsQuizVerdict','glsQuizExplanation','glsQuizSource','glsQuizConf'].map(id=>{
      const e=document.getElementById(id);return [id,e?[norm(e.textContent),e.hidden,e.getAttribute('href')]:null];
    }))});
  for(const type of ['pageshow','hashchange','popstate'])addEventListener(type,e=>{
    console.debug('GB_RECENT_LIFE '+JSON.stringify({type,persisted:e.persisted??null,...brief()}));
  });
  for(const type of ['keydown','click'])addEventListener(type,e=>{
    if(!e.target?.closest)return;
    const enter=type==='keydown'&&e.key==='Enter'&&e.target.matches('.cp-input');
    const readLink=type==='click'&&e.target.closest('#cp-read-btn');
    if(enter||readLink)console.debug('GB_RECENT_ACT '+JSON.stringify({type,key:e.key??null,action:enter?'Enter':'preview',trusted:e.isTrusted,...brief()}));
  },{passive:true,capture:true});
  window.__gbRecentAudit={read};
}
const state=p=>p.evaluate(()=>window.__gbRecentAudit.read());
async function snap(p,ms=145){await p.waitForTimeout(ms);return state(p);}
async function tabTo(p,target){
  for(let i=0;i<17;i++){
    await p.keyboard.press('Tab');
    if((await snap(p,45)).focus===target)return;
  }
  throw Error('Keyboard Tab did not reach '+target);
}
async function quiz(p){
  const settings=await p.locator('#railSettingsBtn').isVisible()?'#railSettingsBtn':'#mobSettingsBtn';
  await p.locator(settings).click();await p.locator('#mobLearningBtn').click();
  await p.locator('#gillLearningOverlay.is-open').waitFor();await p.locator('#tabQuiz').click();
  const pool=JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for(let i=0;i<pool.length;i++){
    const prompt=norm(await p.locator('#glsQuizQuestion').innerText());
    const x=pool.find(e=>norm(e.question)===prompt);assert.ok(x);
    await p.locator('#glsQuizConfRow [data-conf=sure]').click();
    await p.locator('#glsQuizOptions').getByRole('button',{name:x.answers[(Number(x.correctIndex)+1)%x.answers.length],exact:true}).click();
    if(x.id!==MISS){await p.locator('#glsQuizNext').click();continue;}
    const s=await state(p);assert.match(s.quiz.glsQuizVerdict[0],/^Неверно/u);
    await p.locator('#tabQuiz').click();await tabTo(p,'glsQuizSource');await p.keyboard.press('Enter');
    await p.waitForFunction(()=>location.hash==='#sec-canticles'&&document.activeElement?.id==='sec-canticles');
    const t=await snap(p);assert.deepEqual(t.quiz,s.quiz);assert.ok(t.target.hit&&t.target.inView);
    return t;
  }
  throw Error('authored review not reached');
}
async function open(p){
  await p.keyboard.press('Control+k');
  await p.waitForFunction(()=>window.__pagefindReady__&&document.querySelector('.cp-backdrop.is-open')&&document.activeElement?.matches('.cp-input'));
  const s=await snap(p);assert.equal(s.scope,'all');assert.equal(s.input,'');assert.deepEqual(s.locks,['overlay:search:command-palette']);
  return s;
}
async function close(p){
  await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('.cp-backdrop.is-open'));
  const s=await snap(p,120);assert.deepEqual(s.locks,[]);return s;
}
async function type(p,f,replace=false){
  if(f.scope==='scripture'){
    await tabTo(p,'scope:scripture');await p.keyboard.press('Enter');
  }
  if(replace)await p.keyboard.press('Control+a');
  await p.keyboard.insertText(f.query);
  await p.waitForFunction(({value,scope,group})=>{
    const s=__gbRecentAudit.read();return s.input===value&&s.scope===scope&&!s.loading&&s.active?.group===group;
  },{value:f.query,scope:f.scope,group:f.scope==='scripture'?EXACT:ARTICLE});
  return findOption(p,s=>s.href===f.target);
}
async function findOption(p,match){
  const trail=[];
  for(let i=0;i<18;i++){
    const s=await snap(p,i?50:160);
    if(s.active){trail.push([s.active.group,s.active.label,s.active.href]);
      if(match(s.active)){
        assert.equal(s.focus,'cp-input');assert.equal(s.active.role,'option');assert.ok(s.active.selected&&s.active.box.inView&&s.active.box.hit);
        return s;
      }
    }
    await p.keyboard.press('ArrowDown');
  }
  throw Error('Keyboard option not reached: '+JSON.stringify(trail));
}
async function activate(p,base,s,desired,width){
  const exact=desired.scope==='scripture';
  if(exact&&width===1440){
    assert.ok(s.active.preview?.hit);await Promise.all([p.waitForURL(base+desired.target),p.locator('#cp-read-btn').click()]);
  }else{
    const nav=p.waitForURL(base+desired.target);await p.keyboard.press('Enter');await nav;
    if(exact)await close(p); // known same-document Enter behavior; not the oracle here
  }
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  const after=await snap(p,350);
  assert.equal(after.url,desired.target);assert.ok(!after.palette);assert.equal(after.history,s.history+1);
  if(exact){
    assert.equal(after.doc,s.doc);assert.deepEqual(after.quiz,s.quiz);assert.ok(after.target);
    if(width===1440)assert.ok(after.target.inView&&after.target.hit);
  }else{
    assert.match(after.h1,/^Анатомия падения/u);assert.notEqual(after.doc,s.doc);
  }
  return after;
}
async function fillFromRecent(p,title,chosen){
  await p.keyboard.press('Enter');
  await p.waitForFunction(({title,article})=>{
    const s=__gbRecentAudit.read();return s.input===title&&!s.loading&&(s.active?.group===article||s.empty==='Ничего не найдено');
  },{title,article:ARTICLE});
  const r=await snap(p,370);
  assert.equal(r.url,chosen.url);assert.equal(r.doc,chosen.doc);assert.equal(r.history,chosen.history);
  assert.deepEqual(r.records,chosen.records);assert.equal(r.focus,'cp-input');assert.equal(r.scope,'all');
  return r;
}
async function replay(p,title){
  const chosen=await findOption(p,s=>s.group===RECENT&&s.label===title);assert.equal(chosen.active.href,null);
  return {chosen,replayed:await fillFromRecent(p,title,chosen)};
}
const shot=(p,r,step)=>p.screenshot({path:path.join(out,r.id+'-'+step+'.png'),animations:'disabled'});
async function exercise(p,base,r){
  assert.equal((await p.goto(base+SRC,{waitUntil:'load'})).status(),200);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));r.source=await quiz(p);
  assert.deepEqual(r.source.records,[]);
  r.attempts=[];
  for(const [i,f] of terms[r.arm].entries()){
    const opened=await open(p), selected=await type(p,f);
    assert.deepEqual(selected.records,opened.records); // recognized result does not write history until activation
    const arrived=await activate(p,base,selected,f,r.width);
    await open(p);
    await p.waitForFunction(()=>window.__gbRecentAudit.read().recent.length>0);
    const settled=await state(p);
    r.attempts.push({fixture:f,opened,selected,arrived,reopened:settled});
    if(i===0)await close(p);
  }
  if(r.arm==='mixed'){
    const recentTitle=r.attempts[1].selected.active.label;
    r.articleControl=await replay(p,recentTitle);
    await close(p);await open(p);
  }
  r.chosen=await findOption(p,s=>s.group===RECENT&&s.label===TITLE);assert.equal(r.chosen.active.href,null);
  if(r.id==='ab-390'||r.id==='mixed-1440')await shot(p,r,'recent');
  r.replayed=await fillFromRecent(p,TITLE,r.chosen);
  if(r.id==='ab-390'||r.id==='ba-1440')await shot(p,r,'replayed');
  assert.equal(r.replayed.active.href,BIO);assert.equal(r.replayed.active.label,'Биографии служителей');
  if(r.arm==='ab'){
    const nav=p.waitForURL(base+BIO,{waitUntil:'load'});await p.keyboard.press('Enter');await nav;
    await p.evaluate(()=>document.fonts.ready.then(()=>true));r.landed=await snap(p,360);
    assert.equal(r.landed.url,BIO);assert.match(r.landed.h1,/^Биографии служителей/u);
    assert.notEqual(r.landed.doc,r.replayed.doc);assert.equal(r.landed.history,r.replayed.history+1);
    if(r.id==='ab-390')await shot(p,r,'landed');
    await open(p);
  }else if(r.arm==='ba'){
    const n=r.replayed.groups[0].items.length;
    r.enumerated=[r.replayed.active];
    for(let i=1;i<n;i++){
      await p.keyboard.press('ArrowDown');
      const s=await snap(p,125);assert.equal(s.active.id,r.replayed.groups[0].items[i].id);
      assert.ok(s.active.href&&s.active.box.hit&&s.active.box.inView);r.enumerated.push(s.active);
    }
    assert.ok(r.enumerated.every(x=>!x.href.startsWith(SRC)));
  }
  r.manual=await type(p,terms[r.arm][0],r.arm!=='ab');
  const prior=r.landed??r.replayed;
  assert.equal(r.manual.doc,prior.doc);assert.deepEqual(r.manual.records,prior.records);
  if(r.id==='ab-390')await shot(p,r,'manual');
  if(r.arm==='ab'){
    const nav=p.waitForURL(base+A.target,{waitUntil:'load'});await p.keyboard.press('Enter');await nav;
    await p.evaluate(()=>document.fonts.ready.then(()=>true));r.final=await snap(p,420);
    assert.equal(r.final.url,A.target);assert.notEqual(r.final.doc,prior.doc);assert.ok(!r.final.palette&&!r.final.locks.length);
    assert.ok(r.final.target?.hit&&r.final.target.inView);
    if(r.id==='ab-390')await shot(p,r,'recovered');
  }else{
    r.final=await close(p);assert.deepEqual(r.final.records,prior.records);
  }

}
const pins=new Set(), pf=new Set(), rows=[];let browser;
try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const j of jobs){
    const r={...j,docs:[],indexResponses:[],refResponses:[],acts:[],life:[],errors:[],preview404:[]};rows.push(r);
    const ctx=await browser.newContext({viewport:{width:j.width,height:j.height},colorScheme:'light',reducedMotion:'reduce',serviceWorkers:'block'});
    try{
      ctx.setDefaultTimeout(8500);
      await ctx.addInitScript(observe,RECENT);
      await ctx.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
      ctx.on('weberror',e=>r.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('requestfailed',q=>{const url=new URL(q.url()),why=q.failure()?.errorText;if(url.origin===base&&why!=='net::ERR_ABORTED')r.errors.push(['request',url.pathname,why]);});
      ctx.on('response',res=>{
        const url=new URL(res.url()),q=res.request(),s=res.status(),t=q.resourceType(),m=q.method();if(url.origin!==base)return;
        const f=url.pathname;
        if(t==='document')r.docs.push([f,s,res.headers()['cache-control']]);
        if(s===404&&t==='image'&&m==='GET'&&f==='/articles/images/og-biografii.jpg')r.preview404.push([m,f,s]);
        else if(s>=400)r.errors.push(['http',m,f,s]);
        if(f.startsWith('/pagefind/')){r.indexResponses.push([m,f,s]);pf.add(f.slice(10));return;}
        if(f==='/data/scripture-search-index.json')r.refResponses.push([m,f,s]);
        if(res.ok()&&m==='GET'&&(['script','stylesheet','font','document'].includes(t)||f.startsWith('/data/')&&f.endsWith('.json'))){
          let key=f.slice(1).replace(/\/*$/u,'');if(t==='document'&&!key.endsWith('.html'))key=key?key+'/index.html':'index.html';pins.add(key);
        }
      });
      const p=await ctx.newPage();p.on('console',e=>{
        const text=e.text();for(const [prefix,key] of [['GB_RECENT_LIFE ','life'],['GB_RECENT_ACT ','acts']]){
          if(text.startsWith(prefix))r[key].push(JSON.parse(text.slice(prefix.length)));
        }
        if(text.includes('Emergency unlock'))r.errors.push(['emergency',text]);
      });
      await exercise(p,base,r);assert.deepEqual(r.errors,[]);assert.equal(ctx.pages().length,1);r.ok=true;
      console.log('OK',r.id,'recent='+JSON.stringify(r.chosen.records),'replay='+JSON.stringify([r.replayed.empty,r.replayed.active?.href,r.replayed.status]),'docs='+r.docs.length);
    }catch(e){r.ok=false;r.error=e.stack?.replaceAll(base,'LOCAL')??String(e);console.error('FAIL',r.id,r.error);}
    finally{await ctx.close();}
  }
  const w={anchor,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    server:{cacheControl:'no-store',serviceWorkers:'block',pagefindMount:'/pagefind/'},
    pagefind:{entry:indexEntry,treeSha256:treeSha,files:Object.keys(indexPins).length,
      requestedSha256:Object.fromEntries([...pf].sort().map(f=>{assert.ok(indexPins[f],f);return [f,indexPins[f]];}))},
    fixtures:{A,B,C,title:TITLE},distSha256:Object.fromEntries([...pins].sort().map(f=>[f,sha(path.join(dist,f))])),rows};
  fs.writeFileSync(path.join(out,'search-recent-return-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${rows.filter(r=>r.ok).length}/${rows.length} measured; ${pins.size} dist + ${pf.size} requested Pagefind files`);
  if(rows.some(r=>!r.ok))process.exitCode=1;
}finally{await browser?.close();await new Promise(r=>server.close(r));}
