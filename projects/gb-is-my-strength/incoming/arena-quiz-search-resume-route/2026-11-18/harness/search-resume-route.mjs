// Read Product state, drive native keys and controls, never write the saved record
// or position via evaluate. Direct URL entries set up surfaces, not outcomes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import path from 'node:path';

const [pArg,iArg,oArg,executablePath,filter]=process.argv.slice(2);
assert.ok(pArg&&iArg&&oArg&&executablePath,'node search-resume-route.mjs PRODUCT PAGEFIND_DIR FRESH_OUT CHROMIUM [id-regexp]');
const P=path.resolve(pArg),dist=path.join(P,'dist'),index=path.resolve(iArg),out=path.resolve(oArg);
const req=createRequire(path.join(P,'package.json')),{chromium}=req('playwright');
const anchor='9edef94ece08012223c1364bec7ddcd561cf5713';
const KEY='/articles/dzhon-gill-chast-2-uchenyi',SOURCE='sec-canticles',ROUTE=KEY+'/',AT=ROUTE+'#'+SOURCE,HOME_TARGET=KEY+'#'+SOURCE;
const OTHER='/articles/anatomiya-padeniya-pyat-stadiy/';
const STORAGE='gb:reader-state:v1:gb-strength:'+KEY, MISS='gill.scholar.canticles', RESUME='Продолжить';
const arms=['home','other-enter','current-enter','other-dismiss'];
const sizes={390:844,1440:900};
const jobs=[...[390,1440].flatMap(width=>arms.map(arm=>({arm,width}))),{arm:'other-preview',width:1440},
  ...['home','other-enter','current-enter'].map(arm=>({arm,width:390,redirect:true}))]
  .map(j=>({...j,redirect:!!j.redirect,height:sizes[j.width],id:j.arm+(j.redirect?'-redirect':'')+'-'+j.width})).filter(j=>!filter||new RegExp(filter,'u').test(j.id));
assert.ok(jobs.length);fs.mkdirSync(out,{recursive:true});assert.equal(fs.readdirSync(out).length,0,'fresh output directory required');
assert.ok(!fs.existsSync(path.join(dist,'pagefind')));
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const indexPins=Object.fromEntries(fs.readdirSync(index,{recursive:true}).sort().filter(f=>fs.statSync(path.join(index,f)).isFile()).map(f=>[f,sha(path.join(index,f))]));
const entry=JSON.parse(fs.readFileSync(path.join(index,'pagefind-entry.json'),'utf8'));assert.equal(entry.version,'1.5.2');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json',
  '.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon',
  '.wav':'audio/wav','.mp3':'audio/mpeg'};
let redirectDirectories=false;
const server=createServer(async (req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
    const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname),pf=p.startsWith('/pagefind/'),root=pf?index:dist;
    // Isolate the fragment omission from the static fixture's slash policy.
    // The optional redirect only adds a slash; the browser handles any hash.
    if(redirectDirectories&&p===KEY){res.writeHead(308,{location:ROUTE,'cache-control':'no-store'}).end();return;}
    let f=path.resolve(root,'.'+(pf?p.slice(9):p));assert.ok(f===root||f.startsWith(root+path.sep));
    if((await stat(f)).isDirectory())f=path.join(f,'index.html');
    const data=await readFile(f);
    res.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream','cache-control':'no-store','content-length':data.length});
    res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404,{'content-type':'text/plain'}).end('not found');}
});
function observe({storage,source}){
  const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
  const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
  const name=e=>!e?.matches?null:e.matches('.cp-input')?'cp-input':e.id||e.classList?.[0]||e.tagName;
  const href=e=>e?.hasAttribute('href')?new URL(e.href).pathname+new URL(e.href).hash:null;
  function geometry(e){
    if(!e)return null;
    const r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
    const top=document.elementFromPoint(x,y);
    return {top:Math.round(r.y*100)/100,center:[x,y],inView:r.width>0&&r.height>0&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight,
      hit:e.contains(top),topNode:name(top)};
  }
  function result(){
    const id=q('.cp-input')?.getAttribute('aria-activedescendant'),e=id?document.getElementById(id):null;
    const a=q('#cp-read-btn');
    return e?{id,role:e.getAttribute('role'),selected:e.getAttribute('aria-selected')==='true',
      label:norm(e.querySelector('.cp-item-title')?.textContent),detail:norm(e.querySelector('.cp-item-sub')?.textContent),
      meta:norm(e.querySelector('.cp-item-meta')?.textContent),group:norm(e.closest('.cp-group')?.querySelector('.cp-group-hd span')?.textContent),
      href:href(a),box:geometry(e),preview:geometry(a)}:null;
  }
  const brief=()=>({doc:performance.timeOrigin,url:location.pathname+location.hash,history:history.length,
    nav:performance.getEntriesByType('navigation').at(-1)?.type??null,focus:name(document.activeElement),scroll:Math.round(scrollY),
    body:[getComputedStyle(document.body).position,document.body.style.top],locks:Object.keys(window.SiteUtils?._scrollLockSources||{}).sort(),
    result:result(),query:q('.cp-input')?.value??null,palette:!!q('.cp-backdrop.is-open')});
  function read(){
    const candidate=window.BookmarkEngine?.getResumeCandidate?.()??null;
    const state=window.GBReaderState?.getState?.()??null;
    // A glossary tooltip can contribute hidden definition text inside the card.
    const direct=e=>norm(e?[...e.childNodes].map(n=>n.nodeType===Node.TEXT_NODE?n.textContent:
      n.getAttribute?.('data-term')||n.querySelector?.('.gtip-trigger')?.textContent||'').join(''):'');
    const home=q('#resumeReadingBlock'),go=q('#resumeReadingLink'),dismiss=q('#resumeReadingDismiss');
    const toast=q('.gbs2-resume'), old=q('#bookmarkToast'), heading=document.getElementById(source);
    return {...brief(),ageMs:Math.round(performance.now()),h1:norm(q('h1')?.textContent),section:geometry(heading),sectionText:heading?norm(heading.textContent):null,
      match:document.querySelector(':target')?.id??null,reading:state?{sectionId:state.sectionId,sectionTitle:state.sectionTitle,progress:state.progress}:null,
      readingLine:window.GBReaderState?.getReadingLine?.()??null,
      saved:JSON.parse(localStorage.getItem(storage)??'null'),candidate,
      home:home?{hidden:home.hidden,href:href(go),meta:direct(q('#resumeReadingMeta')),
        title:norm(q('#resumeReadingTitle')?.textContent),go:geometry(go),dismiss:geometry(dismiss)}:null,
      toast:toast?{on:toast.classList.contains('gbs2-on'),label:norm(toast.querySelector('span')?.textContent),go:geometry(toast.querySelector('.gbs2-resume-go'))}:null,
      legacyToast:old?{hidden:old.hidden,show:geometry(old)}:null,
      acknowledgements:Object.keys(sessionStorage).filter(k=>k.startsWith('gb:reader-resume-offered:v1:')).sort(),
      groups:qa('.cp-group .cp-group-hd span').map(e=>norm(e.textContent)),pagefind:window.__pagefindReady__===true,
      searchHistory:JSON.parse(localStorage.getItem('gb-cp-history')??'[]'),
      quiz:Object.fromEntries(['glsQuizQuestion','glsQuizVerdict','glsQuizExplanation','glsQuizSource','glsQuizConf'].map(id=>{
        const e=document.getElementById(id);return [id,e?[norm(e.textContent),e.hidden,e.getAttribute('href')]:null];
      }))};
  }
  for(const type of ['pageshow','hashchange'])addEventListener(type,e=>console.debug('GB_RESUME_LIFE '+JSON.stringify({type,persisted:e.persisted??null,...brief()})));
  for(const type of ['click','keydown','wheel'])addEventListener(type,e=>{
    if(!e.target?.closest)return;
    let action;
    if(type==='wheel')action='wheel';
    else if(type==='keydown'&&e.key==='Enter'&&e.target.id==='glsQuizSource')action='review';
    else if(type==='keydown'&&e.key==='Enter'&&e.target.matches('.cp-input'))action='enter';
    else if(type==='click')for(const [sel,n] of [['#resumeReadingLink','home'],['#resumeReadingDismiss','dismiss'],['#cp-read-btn','preview'],['.gbs2-resume-go','toast']]){
      if(e.target.closest(sel)){action=n;break;}
    }
    if(action)console.debug('GB_RESUME_ACT '+JSON.stringify({action,type,trusted:e.isTrusted,deltaY:e.deltaY??null,...brief()}));
  },{passive:true,capture:true});
  window.__gbResumeAudit={read};
}
const state=p=>p.evaluate(()=>__gbResumeAudit.read());
const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
async function snap(p,ms=130){await p.waitForTimeout(ms);return state(p);}
async function tabTo(p,target){
  for(let i=0;i<16;i++){
    await p.keyboard.press('Tab');if((await snap(p,55)).focus===target)return;
  }
  throw Error('Tab did not reach '+target);
}
async function learningQuiz(p){
  const settings=await p.locator('#railSettingsBtn').isVisible()?'#railSettingsBtn':'#mobSettingsBtn';
  await p.locator(settings).click();await p.locator('#mobLearningBtn').click();
  await p.locator('#gillLearningOverlay.is-open').waitFor();await p.locator('#tabQuiz').click();
  await p.locator('#glsQuizOptions button').first().waitFor();
}
async function answer(p){
  await learningQuiz(p);const pool=JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for(let i=0;i<pool.length;i++){
    const q=norm(await p.locator('#glsQuizQuestion').innerText());const x=pool.find(e=>norm(e.question)===q);assert.ok(x);
    await p.locator('#glsQuizConfRow [data-conf=sure]').click();
    await p.locator('#glsQuizOptions').getByRole('button',{name:x.answers[(x.correctIndex+1)%x.answers.length],exact:true}).click();
    if(x.id!==MISS){await p.locator('#glsQuizNext').click();continue;}
    const before=await state(p);assert.match(before.quiz.glsQuizVerdict[0],/^Неверно/u);
    return before;
  }
  throw Error('correct authored quiz fixture not found');
}
async function reviewEnter(p){await p.locator('#tabQuiz').click();await tabTo(p,'glsQuizSource');await p.keyboard.press('Enter');}
async function reach(p){
  const before=await answer(p);await reviewEnter(p);
  await p.waitForFunction(id=>location.hash==='#'+id&&document.activeElement?.id===id,SOURCE);
  const s=await snap(p,200);assert.ok(s.section.hit&&s.section.top>340);assert.equal(s.url,AT);assert.deepEqual(s.quiz,before.quiz);
  return s;
}

async function wheelToRead(p,s){
  const dy=Math.ceil(s.section.top-300);assert.ok(dy>0);
  await p.mouse.move(...s.section.center);await p.mouse.wheel(0,dy);
  await p.waitForFunction(({id,key})=>{
    const record=JSON.parse(localStorage.getItem(key)??'null');
    const top=document.getElementById(id).getBoundingClientRect().top;
    return top>250&&top<GBReaderState.getReadingLine()&&record?.sectionId===id&&Math.abs(record.scrollY-scrollY)<1;
  },{id:SOURCE,key:STORAGE});
  const after=await snap(p,180);
  assert.equal(after.doc,s.doc);assert.equal(after.url,s.url);assert.deepEqual(after.quiz,s.quiz);
  assert.ok(after.section.inView&&after.section.hit&&after.saved.progress>=8&&after.saved.progress<92);
  return {dy,after};
}
async function openPalette(p){
  await p.mouse.move(1,1);
  await p.keyboard.press('Control+k');
  await p.waitForFunction(()=>{
    const s=__gbResumeAudit.read();return s.focus==='cp-input'&&s.query===''&&s.pagefind&&s.result;
  });
  const s=await snap(p,345);assert.equal(s.result.group,RESUME,JSON.stringify({result:s.result,groups:s.groups,candidate:s.candidate?.sectionId}));assert.ok(s.result.selected&&s.result.box.hit&&s.result.box.inView);
  assert.equal(s.result.role,'option');assert.deepEqual(s.locks,['overlay:search:command-palette']);
  assert.equal(s.result.href,KEY);assert.equal(s.result.label,norm(s.saved.title));
  assert.equal(s.result.detail,'Раздел: '+norm(s.saved.sectionTitle));
  assert.equal(s.candidate.sectionId,SOURCE);assert.equal(s.candidate.path,KEY);assert.equal(s.candidate.scrollY,s.saved.scrollY);assert.equal(s.candidate.dismissedAt,s.saved.dismissedAt);
  assert.equal(s.result.meta,s.saved.progress+'%');assert.deepEqual(s.searchHistory,[]);
  return s;
}
const shot=(p,r,phase)=>p.screenshot({path:path.join(out,r.id+'-'+phase+'.png'),animations:'disabled'});
async function exercise(p,base,r){
  assert.equal((await p.goto(base+ROUTE,{waitUntil:'load'})).status(),200);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  const initial=await state(p);assert.equal(initial.saved,null);assert.equal(initial.candidate,null);
  r.source=await reach(p);assert.equal(r.source.doc,initial.doc);assert.equal(r.source.history,initial.history+1);
  r.read=await wheelToRead(p,r.source);
  const recorded=r.read.after.saved;
  assert.equal(recorded.sectionId,SOURCE);assert.equal(recorded.routePath,KEY);assert.equal(recorded.scrollY,r.read.after.scroll);
  assert.equal(recorded.dismissedAt,0);assert.equal(recorded.source,'reader-state-v1');
  const current=r.arm==='current-enter',dismiss=r.arm==='other-dismiss',home=r.arm==='home';
  if(!current){
    assert.equal((await p.goto(base+'/',{waitUntil:'load'})).status(),200);
    await p.locator('#resumeReadingBlock').waitFor();
    r.home=await snap(p,200);assert.equal(r.home.home.href,HOME_TARGET);assert.match(r.home.home.meta,/% прочитано$/u);
    assert.equal(r.home.doc===r.source.doc,false);
    const withoutTime=x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!=='savedAt'));
    assert.deepEqual(withoutTime(r.home.saved),withoutTime(recorded));
    assert.ok(r.home.saved.savedAt>=recorded.savedAt);
    if(dismiss){
      await p.locator('#resumeReadingDismiss').click();
      await p.waitForFunction(()=>document.querySelector('#resumeReadingBlock').hidden);
      r.dismiss=await snap(p);assert.ok(r.dismiss.saved.dismissedAt>recorded.savedAt);assert.equal(r.dismiss.home.href,null);
      assert.deepEqual({...r.dismiss.saved,dismissedAt:0},r.home.saved);
    }
  }
  const targetPath=r.redirect?ROUTE:KEY, targetHome=targetPath+'#'+SOURCE;
  let departure;
  if(home){
    const l=p.locator('#resumeReadingLink');
    await p.mouse.move(16,420);await p.mouse.wheel(0,Math.ceil(r.home.home.go.top-455));
    await p.waitForFunction(()=>__gbResumeAudit.read().home.go.hit);
    r.homeReady=await snap(p,210);assert.ok(r.homeReady.home.go.hit);
    if(r.id==='home-390')await shot(p,r,'card');
    departure=r.homeReady;
    await Promise.all([p.waitForURL(base+targetHome,{waitUntil:'load'}),l.click()]);
  }else{
    if(!current){assert.equal((await p.goto(base+OTHER,{waitUntil:'load'})).status(),200);}
    await p.evaluate(()=>document.fonts.ready.then(()=>true));
    r.origin=await snap(p,220);r.palette=await openPalette(p);departure=r.palette;
    assert.deepEqual(r.palette.saved,current?r.origin.saved:dismiss?r.dismiss.saved:r.home.saved);
    if(current)assert.deepEqual(r.palette.quiz,r.source.quiz);
    if(r.id==='other-enter-390'||r.id==='other-preview-1440'||r.id==='other-dismiss-390')await shot(p,r,'palette');
    const nav=p.waitForURL(base+targetPath,{waitUntil:'load'});
    if(r.arm==='other-preview'){assert.ok(r.palette.result.preview.hit);await p.locator('#cp-read-btn').click();}
    else await p.keyboard.press('Enter');
    await nav;
  }
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  r.landing=await snap(p,1420);
  assert.notEqual(r.landing.doc,departure.doc);assert.equal(r.landing.history,departure.history+1);assert.notEqual(r.landing.doc,r.source.doc);
  assert.equal(r.landing.nav,'navigate');assert.match(r.landing.h1,/^Джон Гилл/u);
  assert.ok(!r.landing.palette&&!r.landing.locks.length);
  assert.equal(r.landing.saved?.sectionId,SOURCE);assert.equal(r.landing.saved?.sectionTitle,recorded.sectionTitle);
  if(home){
    assert.equal(r.landing.url,targetHome);assert.equal(r.landing.match,SOURCE);
    assert.ok(r.landing.scroll>1200&&r.landing.section.inView&&r.landing.section.hit);
    assert.deepEqual(r.landing.searchHistory,[]);if(r.id==='home-390')await shot(p,r,'landing');
  }
  else{
    assert.equal(r.landing.url,targetPath);assert.equal(r.landing.match,null);assert.equal(r.landing.scroll,0);
    assert.deepEqual(r.landing.searchHistory,[recorded.title]);assert.ok(!r.landing.section.inView&&!r.landing.section.hit);
    if(r.id==='other-enter-390'||r.id==='other-dismiss-390')await shot(p,r,'landing');
    if(!dismiss){
      const g=p.locator('.gbs2-resume.gbs2-on .gbs2-resume-go');
      assert.ok(r.landing.toast?.on&&r.landing.toast.go.hit);
      await g.click();await p.waitForFunction(()=>!document.querySelector('.gbs2-resume'));
      r.recovered=await snap(p,125);
      assert.equal(r.recovered.doc,r.landing.doc);assert.equal(r.recovered.url,targetPath);assert.equal(r.recovered.history,r.landing.history);
      assert.ok(r.recovered.section.inView&&r.recovered.section.hit);
      if(r.id==='other-enter-390')await shot(p,r,'recovered');
    }else{
      r.later=await snap(p,1150);assert.equal(r.later.scroll,0);assert.equal(r.later.doc,r.landing.doc);
      assert.equal(r.later.toast,null);assert.deepEqual(r.later.saved,r.landing.saved);assert.equal(r.later.saved.dismissedAt,r.dismiss.saved.dismissedAt);assert.ok(!r.later.legacyToast?.show?.inView);
    }
  }
  if(current){
    await learningQuiz(p);r.quizBack=await snap(p);
    assert.deepEqual(r.quizBack.quiz.glsQuizVerdict.slice(0,2),['',true]);
    assert.ok(r.quizBack.quiz.glsQuizSource[1]&&r.quizBack.quiz.glsQuizExplanation[1]);
    await p.keyboard.press('Escape');
  }
}
const pins=new Set(),indexUsed=new Set(),rows=[];let browser;
try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const j of jobs){
    redirectDirectories=j.redirect;
    const r={...j,docs:[],pagefindResponses:[],acts:[],life:[],errors:[]};rows.push(r);
    const ctx=await browser.newContext({viewport:{width:r.width,height:r.height},colorScheme:'light',reducedMotion:'reduce',serviceWorkers:'block'});
    try{
      ctx.setDefaultTimeout(8500);await ctx.addInitScript(observe,{storage:STORAGE,source:SOURCE});
      await ctx.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
      ctx.on('weberror',e=>r.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('requestfailed',q=>{const u=new URL(q.url()),err=q.failure()?.errorText;if(u.origin===base&&err!=='net::ERR_ABORTED')r.errors.push(['request',u.pathname,err]);});
      ctx.on('response',res=>{
        const u=new URL(res.url()),q=res.request(),s=res.status(),t=q.resourceType(),m=q.method(),f=u.pathname;if(u.origin!==base)return;
        if(t==='document')r.docs.push([f,s,res.headers()['cache-control'],res.headers().location??null]);
        if(s>=400)r.errors.push(['http',m,f,s]);
        if(f.startsWith('/pagefind/')){r.pagefindResponses.push([m,f,s]);indexUsed.add(f.slice(10));return;}
        if(res.ok()&&m==='GET'&&(['script','stylesheet','font','document'].includes(t)||f.startsWith('/data/')&&f.endsWith('.json'))){
          let key=f.slice(1).replace(/\/*$/u,'');if(t==='document'&&!key.endsWith('.html'))key=key?key+'/index.html':'index.html';pins.add(key);
        }
      });
      const p=await ctx.newPage();p.on('console',e=>{
        const text=e.text();
        for(const [prefix,k] of [['GB_RESUME_LIFE ','life'],['GB_RESUME_ACT ','acts']])if(text.startsWith(prefix))r[k].push(JSON.parse(text.slice(prefix.length)));
        if(text.includes('Emergency unlock'))r.errors.push(['emergency',text]);
      });
      await exercise(p,base,r);assert.deepEqual(r.errors,[]);assert.equal(ctx.pages().length,1);r.ok=true;
      console.log('OK',r.id,'saved='+r.read.after.saved.sectionId,'url='+r.landing.url,'y='+r.landing.scroll,
        'toast='+Boolean(r.landing.toast?.on),'hit='+Boolean(r.recovered?.section.hit??r.landing.section.hit));
    }catch(e){r.ok=false;r.error=e.stack?.replaceAll(base,'LOCAL')??String(e);r.failedAt=await state(ctx.pages()[0]).catch(()=>null);console.error('FAIL',r.id,r.error);}
    finally{await ctx.close();}
  }
  const witness={anchor,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    method:{cacheControl:'no-store',serviceWorkers:'block',indexMount:'/pagefind/',fixturePath:'same dist directory from slash and no-slash, plus three HTTP 308 slash controls'},
    pagefind:{entry,files:Object.keys(indexPins).length,treeSha256:createHash('sha256').update(JSON.stringify(indexPins)).digest('hex'),
      requestedSha256:Object.fromEntries([...indexUsed].sort().map(f=>{assert.ok(indexPins[f],f);return [f,indexPins[f]];}))},
    distSha256:Object.fromEntries([...pins].sort().map(f=>[f,sha(path.join(dist,f))])),rows};
  fs.writeFileSync(path.join(out,'search-resume-route-witness.json'),JSON.stringify(witness,null,2)+'\n');
  console.log(`${rows.filter(r=>r.ok).length}/${rows.length} measured; ${pins.size} dist + ${indexUsed.size} requested Pagefind files`);
  if(rows.some(r=>!r.ok))process.exitCode=1;
}finally{await browser?.close();await new Promise(r=>server.close(r));}
