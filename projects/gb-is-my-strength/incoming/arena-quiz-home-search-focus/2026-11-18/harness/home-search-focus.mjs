// Exact-distribution experiment. Read focus and ownership; never call Product
// open/close/focus/scroll APIs or supply a generated search index.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [productDir, outputDir, executablePath, filter] = process.argv.slice(2);
assert.ok(productDir && outputDir && executablePath,'node home-search-focus.mjs PRODUCT FRESH_OUT CHROMIUM [id-filter]');
const P=path.resolve(productDir), out=path.resolve(outputDir);
const req=createRequire(path.join(P,'package.json'));
const { chromium }=req('playwright');
const { serve }=await import(pathToFileURL(path.join(P,'scripts/lib/a04-contract.mjs')));
const anchor='9edef94ece08012223c1364bec7ddcd561cf5713';
const ROUTE='/articles/dzhon-gill-chast-2-uchenyi/', STATE_KEY='gb:reader-state:v1:gb-strength:'+ROUTE.slice(0,-1);
const HERO='heroSearchBar', HEADER='gbSearchBtn', LEGACY='tooltip-mobile-sheet';
const OWNER='search:command-palette', PALETTE='overlay:'+OWNER;
const spec=(id,options={})=>({id,width:390,height:844,motion:'reduce',touch:false,via:'quick',close:'escape',hold:0,
  second:false,learning:false,...options});
const cases=[
  spec('empty-quick-escape'),
  spec('empty-quick-normal',{motion:'no-preference'}),
  spec('empty-quick-touch-emulation',{touch:true}),
  spec('empty-quick-held-escape',{hold:3350}),
  spec('empty-quick-second-escape',{second:true}),
  spec('empty-quick-close-enter',{close:'button-enter',hold:700}),
  spec('empty-quick-close-click',{close:'button-click',hold:700}),
  spec('empty-dwell-escape',{via:'dwell'}),
  spec('empty-early-escape',{via:'early-escape'}),
  spec('empty-header-escape',{via:'header'}),
  spec('empty-wide-quick-escape',{width:1440,height:900}),
  spec('learning-quick-escape',{learning:true}),
  spec('learning-quick-second-escape',{learning:true,second:true}),
].filter(s=>!filter||s.id.includes(filter));
assert.ok(cases.length);
fs.mkdirSync(out,{recursive:true});
assert.ok(!fs.existsSync(path.join(out,'home-search-focus-witness.json')),'use a fresh output directory');

function observe() {
  if(location.pathname!=='/'||window!==window.top)return;
  const events=[];
  const id=e=>{if(!e?.matches)return null;
    if(e.matches('.h-hero-desc abbr.gterm'))return 'hero-term';
    if(e.matches('.cp-input'))return 'search-input';
    if(e.matches('.cp-close'))return 'search-close';
    if(e.getAttribute('href')==='#hDirectionsLabel' && e.getAttribute('aria-label')==='Скопировать ссылку на раздел')return 'directions-share';
    return e.id||e.localName;
  };
  const term=()=>document.querySelector('.h-hero-desc abbr.gterm');
  const now=()=>Math.round(performance.now());
  function record(kind,e,extra={}) {events.push({kind,target:id(e.target),trusted:e.isTrusted,ms:now(),...extra});}
  for(const type of ['focusin','focusout']) document.addEventListener(type,e=>{
    if(['hero-term','heroSearchBar','gbSearchBtn','search-input','search-close','resumeReadingLink','directions-share','themeToggle'].includes(id(e.target))) {
      record(type,e,{related:id(e.relatedTarget)});
    }
  },true);
  for(const [surface,node,capture] of [['capture',window,true],['bubble',document,false]]) node.addEventListener('keydown',e=>{
    if(e.key==='Escape'||e.key==='Enter')record('key-'+surface,e,{key:e.key,prevented:e.defaultPrevented});
  },{capture,passive:true});
  document.addEventListener('click',e=>{
    const from=e.target?.closest?.('#heroSearchBar,#gbSearchBtn,.cp-close');
    if(from)record('click',e,{control:id(from),detail:e.detail});
  },{capture:true,passive:true});
  for(const type of ['gb:overlay-open','gb:overlay-close']) document.addEventListener(type,e=>{
    if(e.detail?.ownerId==='search:command-palette') events.push({kind:type,ms:now(),owner:e.detail.ownerId,reason:e.detail.reason});
  });
  function snapshot() {
    const root=document.documentElement, e=document.activeElement, b=e.getBoundingClientRect(), v=visualViewport;
    const tip=document.querySelector('.gtip.gb-floating-tip.is-open');
    const panel=document.querySelector('#gbCommandPalette'), input=panel?.querySelector('.cp-input');
    const h=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);
    return {target:id(e),href:e.getAttribute('href'),focusVisible:e.matches(':focus-visible'),
      top:Math.round(b.top),bottom:Math.round(b.bottom),scrollY:Math.round(scrollY),bodyY:document.body.scrollTop,
      inView:b.top<v.height+v.offsetTop&&b.bottom>v.offsetTop&&b.left<v.width+v.offsetLeft&&b.right>v.offsetLeft&&b.height>0,
      hit:!!(h&&e.contains(h)),viewport:{width:v.width,height:v.height},locked:root.dataset.scrollLocked==='1',
      bodyPosition:getComputedStyle(document.body).position,
      locks:Object.keys(window.SiteUtils?._scrollLockSources||{}).sort(),
      owners:(window.OverlayRuntime?.snapshot?.()||[]).map(({ownerId,lockScroll})=>({ownerId,lockScroll})),
      search:panel?{open:panel.classList.contains('is-open'),hidden:panel.getAttribute('aria-hidden'),inert:panel.inert,
        inputExpanded:input?.getAttribute('aria-expanded'),value:input?.value,
        heroExpanded:document.getElementById('heroSearchBar').getAttribute('aria-expanded')}:null,
      term:{expanded:term()?.getAttribute('aria-expanded')??null,inert:!!term()?.closest('[inert]')},
      tip:tip?{id:tip.id,inert:!!tip.closest('[inert]'),ported:tip.parentElement===document.body,visibility:getComputedStyle(tip).visibility}:null,
      tooltipRootClass:root.classList.contains('gb-tooltip-open'),
      ms:now()};
  }
  window.__homeSearchWitness={snapshot,events};
}
const snap=p=>p.evaluate(()=>__homeSearchWitness.snapshot());
const samples=(p,ticks)=>p.evaluate(async ticks=>{
  const start=performance.now(), result=[];
  for(const after of ticks) {
    while(performance.now()-start<after)await new Promise(requestAnimationFrame);
    result.push({after,...__homeSearchWitness.snapshot()});
  }
  return result;
},ticks);

async function tabTo(p,target,limit=65) {
  for(let i=1;i<=limit;i++){
    await p.keyboard.press('Tab');
    const s=await snap(p);
    if(s.target===target)return s;
    if(target==='search-close')assert.equal(s.search?.open,true);
  }
  throw Error('Tab did not reach '+target);
}
const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
async function recordFromLearning(p,base) {
  assert.equal((await p.goto(base+ROUTE,{waitUntil:'load'})).status(),200);
  const nav=await p.evaluate(()=>performance.timeOrigin);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  await p.locator('#mobSettingsBtn').click();
  await p.locator('#mobLearningBtn').click();
  await p.locator('#tabQuiz').click();
  const deck=JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for(let i=0;i<deck.length;i++) {
    const prompt=norm(await p.locator('#glsQuizQuestion').innerText());
    const current=deck.find(q=>norm(q.question)===prompt);
    assert.ok(current);
    await p.locator('#glsQuizConfRow [data-conf="sure"]').click();
    await p.locator('#glsQuizOptions').getByRole('button',{name:current.answers[(current.correctIndex+1)%current.answers.length],exact:true}).click();
    const verdict=p.locator('#glsQuizVerdict:not([hidden])'); await verdict.waitFor();
    if(current.id==='gill.scholar.canticles') {
      const before=norm(await verdict.innerText()), link=p.locator('#glsQuizSource');
      assert.match(before,/^Неверно/u);
      assert.match(await link.getAttribute('href'),/#sec-canticles$/u);
      await Promise.all([p.waitForURL(u=>u.pathname===ROUTE&&u.hash==='#sec-canticles'), link.click()]);
      await p.waitForFunction(()=>{
        const e=document.getElementById('sec-canticles'),r=e.getBoundingClientRect();
        return e===document.activeElement&&e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
      });
      assert.equal(norm(await verdict.textContent()),before);
      assert.equal(await p.evaluate(()=>performance.timeOrigin),nav);
      return {prompt,fragment:'#sec-canticles',retained:true};
    }
    await p.locator('#glsQuizNext').click();
  }
  throw Error('authored Gill prompt not reached');
}

function assertedLocks(s,locks,owners) {
  assert.deepEqual(s.locks,locks);
  assert.deepEqual(s.owners,owners.map(ownerId=>({ownerId,lockScroll:true})));
  assert.equal(s.locked,locks.length>0);
  assert.equal(s.bodyPosition,locks.length?'fixed':'static');
}
function hit(s,target) {
  assert.equal(s.target,target);
  assert.ok(s.inView&&s.hit);
}
function invisible(s,target) {
  assert.equal(s.target,target);
  assert.ok(s.focusVisible&&s.top>=s.viewport.height&&!s.inView&&!s.hit&&s.scrollY===0);
}

async function exercise(p,base,row) {
  if(row.learning)row.source=await recordFromLearning(p,base);
  assert.equal((await p.goto(base+'/',{waitUntil:'load'})).status(),200);
  const time=await p.evaluate(()=>performance.timeOrigin);
  await p.locator('.h-hero-desc abbr.gterm[data-gtip-upgraded="1"]').waitFor();
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  if(!row.touch)await p.mouse.move(2,2);
  row.card=await p.evaluate(key=>{
    const text=localStorage.getItem(key), r=JSON.parse(text||'null');
    return {hidden:document.getElementById('resumeReadingBlock').hidden,href:document.getElementById('resumeReadingLink').getAttribute('href'),
      saved:r&&{source:r.source,sectionId:r.sectionId,progress:r.progress}};
  },STATE_KEY);
  assert.equal(row.card.hidden,!row.learning);
  if(row.learning) {
    assert.equal(row.card.href,ROUTE.slice(0,-1)+'#sec-hebrew');
    assert.equal(row.card.saved?.source,'reader-state-v1');
    assert.equal(row.card.saved?.sectionId,'sec-hebrew');
    assert.ok(row.card.saved.progress>=4);
  } else assert.deepEqual(row.card,{hidden:true,href:null,saved:null});
  row.initial=await snap(p);
  assert.equal(row.initial.target,'body');
  assert.equal(row.initial.scrollY,0);
  assert.equal(row.initial.search,null,'fresh search must be cold');
  assertedLocks(row.initial,[],[]);
  const narrow=row.width===390, quick=row.via==='quick';
  const existing=narrow&&quick, opener=row.via==='header'?HEADER:HERO;
  if(row.via==='header') row.opener=await tabTo(p,HEADER);
  else {
    row.glossary=await tabTo(p,'hero-term');
    assert.ok(row.glossary.tip?.ported&&row.glossary.term.expanded==='true');
    assertedLocks(row.glossary,narrow?[LEGACY]:[],[]);
    if(row.via==='early-escape') {
      await p.keyboard.press('Escape'); row.early=await snap(p);
      assert.equal(row.early.target,'hero-term');
      assertedLocks(row.early,[],[]);
    }
    if(row.via==='dwell')await p.waitForTimeout(550);
    await p.keyboard.press('Tab'); row.opener=await snap(p);
  }
  hit(row.opener,opener);
  assert.ok(row.opener.focusVisible);
  assertedLocks(row.opener,existing?[LEGACY]:[],[]);
  assert.equal(!!row.opener.tip,quick);
  await p.keyboard.press('Enter');
  await p.waitForFunction(()=>document.activeElement?.matches('.cp-input')&&document.querySelector('#gbCommandPalette.is-open'));
  row.open=await snap(p);
  hit(row.open,'search-input');
  assert.deepEqual(row.open.search,{open:true,hidden:'false',inert:false,inputExpanded:'true',value:'',heroExpanded:'true'});
  const openedLocks=existing?[PALETTE,LEGACY]:[PALETTE];
  assertedLocks(row.open,openedLocks,[OWNER]);
  assert.ok(row.open.term.inert);
  if(quick)assert.ok(row.open.tip?.ported&&row.open.tip.inert&&row.open.term.expanded==='true');
  if(row.hold) {
    if(row.hold>3000)await p.keyboard.insertText('г'); // Real input, below search length threshold.
    await p.waitForTimeout(row.hold);
    row.held=await snap(p);
    hit(row.held,'search-input');
    assertedLocks(row.held,openedLocks,[OWNER]);
    assert.equal(row.held.search.value,row.hold>3000?'г':'');
  }
  if(row.close==='button-enter') {
    row.button=await tabTo(p,'search-close',12);
    hit(row.button,'search-close');
    await p.keyboard.press('Enter');
  } else if(row.close==='button-click') await p.locator('.cp-close').click();
  else await p.keyboard.press('Escape');
  row.closed=await samples(p,[0,80,240]);
  const closed=row.closed.at(-1), residual=existing&&row.close==='escape';
  hit(closed,opener);
  assert.deepEqual(closed.search,{open:false,hidden:'true',inert:true,inputExpanded:'false',value:'',heroExpanded:'false'});
  assertedLocks(closed,residual?[LEGACY]:[],[]);
  assert.equal(closed.term.inert,false);
  if(residual)assert.ok(closed.tip?.ported&&!closed.tip.inert&&closed.term.expanded==='true'&&closed.tooltipRootClass);
  if(existing&&!residual)assert.equal(closed.tip,null);
  if(row.second) {
    await p.keyboard.press('Escape'); row.beforeTabEscape=await snap(p);
    hit(row.beforeTabEscape,opener);
    assertedLocks(row.beforeTabEscape,[],[]);
    assert.equal(row.beforeTabEscape.tip,null);
  }
  const target=row.learning?'resumeReadingLink':row.via==='header'?'themeToggle':'directions-share';
  const stranded=residual&&!row.second;
  await p.keyboard.press('Tab'); row.next=await samples(p,[0,150,500,1000]);
  const next=row.next.at(-1);
  if(stranded) {
    for(const s of row.next) {invisible(s,target); assertedLocks(s,[LEGACY],[]);}
  } else {hit(next,target); assertedLocks(next,[],[]);}
  assert.ok(next.focusVisible);
  if(['empty-quick-escape','empty-quick-second-escape'].includes(row.id)) {
    await p.screenshot({path:path.join(out,row.id+'.png')});
    const after=await snap(p);
    for(const k of ['target','top','scrollY','hit','locked']) assert.equal(after[k],next[k]);
  }
  if(stranded) {
    await p.keyboard.press('Escape'); row.afterTabEscape=(await samples(p,[180])).at(-1);
    invisible(row.afterTabEscape,target);
    assert.equal(row.afterTabEscape.tip,null);
    assertedLocks(row.afterTabEscape,[],[]);
  }
  row.events=await p.evaluate(()=>__homeSearchWitness.events.slice());
  row.sameHome=await p.evaluate(()=>location.pathname==='/'&&!location.hash&&!location.search&&performance.timeOrigin)===time;
  assert.ok(row.sameHome);
  assert.deepEqual(row.documents,(row.learning?[ROUTE,'/']:['/']).map(rel=>[rel,200]));
  assert.deepEqual(row.optionalHead,[['HEAD','/pagefind/pagefind.js',404]]);
  assert.equal(row.emergencyUnlocks,0);
  if(row.glossary) {
    const first=row.events.find(e=>e.kind==='focusin'&&e.target==='hero-term');
    const next=row.events.find(e=>e.kind==='focusout'&&e.target==='hero-term');
    assert.ok(first?.trusted&&next?.trusted&&next.related===HERO);
    row.termDwellMs=next.ms-first.ms;
    assert.ok(row.via==='dwell'?row.termDwellMs>=500:row.termDwellMs>=0&&row.termDwellMs<350);
  }
  const lifecycles=row.events.filter(e=>e.kind.startsWith('gb:overlay-'));
  assert.deepEqual(lifecycles.map(e=>[e.kind,e.owner,e.reason]),[['gb:overlay-open',OWNER,'open'],['gb:overlay-close',OWNER,'close']]);
}

const {server,base}=await serve();
const results=[], paths=new Set();
let browser;
try {
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const c of cases) {
    const row={...c,documents:[],optionalHead:[],errors:[],emergencyUnlocks:0}; results.push(row);
    const ctx=await browser.newContext({viewport:{width:c.width,height:c.height},hasTouch:c.touch,isMobile:c.touch,
      colorScheme:'light',serviceWorkers:'block',reducedMotion:c.motion});
    ctx.setDefaultTimeout(8500);
    try {
      await ctx.addInitScript(observe);
      await ctx.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
      ctx.on('weberror',e=>row.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('console',m=>{if(m.type()==='warning'&&m.text().startsWith('[SiteUtils] Emergency unlock'))row.emergencyUnlocks++;});
      ctx.on('requestfailed',r=>{
        const u=new URL(r.url()),why=r.failure()?.errorText;
        if(u.origin===base&&why!=='net::ERR_ABORTED')row.errors.push(['request',u.pathname,why]);
      });
      ctx.on('response',r=>{
        const u=new URL(r.url()); if(u.origin!==base)return;
        const type=r.request().resourceType(), status=r.status(), method=r.request().method();
        if(type==='document')row.documents.push([u.pathname,status]);
        if(method==='HEAD'&&u.pathname==='/pagefind/pagefind.js')row.optionalHead.push([method,u.pathname,status]);
        else if(status>=400)row.errors.push(['http',method,u.pathname,status]);
        if(r.ok()&&method==='GET'&&(['document','script','stylesheet','font'].includes(type)||u.pathname.startsWith('/data/')&&u.pathname.endsWith('.json'))) {
          let f=u.pathname.slice(1).replace(/\/*$/u,'');
          if(type==='document'&&!f.endsWith('.html'))f=f?f+'/index.html':'index.html';
          paths.add(f);
        }
      });
      await exercise(await ctx.newPage(),base,row);
      assert.deepEqual(row.errors,[]);
      assert.equal(ctx.pages().length,1);
      row.ok=true;
      const n=row.next.at(-1);
      console.log('OK',row.id,'input=yes','opener='+row.closed.at(-1).target,'after='+(row.closed.at(-1).locks.join(',')||'-'),
        'next='+n.target,`y=${n.scrollY} top=${n.top} hit=${n.hit}`);
    } catch(e) {row.ok=false;row.error=e.stack?.replaceAll(base,'LOCAL')||String(e);console.error('FAIL',row.id,row.error);}
    finally { await ctx.close(); }
  }
  const hash=f=>createHash('sha256').update(fs.readFileSync(path.join(P,'dist',f))).digest('hex');
  const w={anchor,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    distSha256:Object.fromEntries([...paths].sort().map(f=>[f,hash(f)])),results};
  fs.writeFileSync(path.join(out,'home-search-focus-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${results.filter(r=>r.ok).length}/${results.length} measured, ${paths.size} dist pins`);
  if(results.some(r=>!r.ok))process.exitCode=1;
} finally {await browser?.close();await new Promise(r=>server.close(r));}
