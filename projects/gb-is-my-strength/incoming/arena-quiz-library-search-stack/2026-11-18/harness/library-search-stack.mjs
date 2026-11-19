// Real reader flows over unmodified production-like dist. The harness only
// reads product state; changes come from normal browser actions/keyboard.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const [product,output,executablePath,filter]=process.argv.slice(2);
assert.ok(product&&output&&executablePath,'node library-search-stack.mjs PRODUCT FRESH_OUT CHROMIUM [id-filter]');
const P=path.resolve(product),out=path.resolve(output),req=createRequire(path.join(P,'package.json'));
const {chromium}=req('playwright');
const {serve}=await import(pathToFileURL(path.join(P,'scripts/lib/a04-contract.mjs')));
const ANCHOR='9edef94ece08012223c1364bec7ddcd561cf5713';
const routes={gill:['/articles/dzhon-gill-chast-2-uchenyi/','gill.scholar.canticles','sec-canticles'],
  apostasy:['/articles/otstuplenie-chto-govorit-bibliya/','apostasy.p1.lexeme','odno-slovo']};
const arms=['library-only','palette-only','stack-escape-cold','stack-escape-warm','stack-field-click','stack-save-click'];
const cases=[390,1440].flatMap(width=>[...arms.map(arm=>['gill',arm]),['apostasy','stack-escape-cold']]
  .map(([route,arm])=>({id:`${route}-${width}-${arm}`,route,arm,width,height:width===390?844:900})))
  .filter(r=>!filter||r.id.includes(filter));
assert.ok(cases.length);
const DRAFT='Черновик проверки: перечитать подтверждающий абзац.';
const QUERY='Поиск после ответа';
const LIB='highlights', SEARCH='search:command-palette', LEARN='gill-learning';
const CANCEL='gb-hl-note-cancel',SAVE='note-submit',INPUT='palette-input',AREA='gb-hl-note-text';
const OPEN={open:true,aria:'false',inert:false}, CLOSED={open:false,aria:'true',inert:true};
fs.mkdirSync(out,{recursive:true});
assert.ok(!fs.existsSync(path.join(out,'library-search-stack-witness.json')),'use a fresh output directory');

function installWitness(){
  const events=[];
  const q=s=>document.querySelector(s);
  const name=e=>!e?.matches?null:e.matches('.cp-input')?'palette-input':e.matches('#gb-hl-editor button[type=submit]')?'note-submit':
    e.id||e.classList[0]||e.localName;
  const owner=e=> name(e?.closest?.('#gb-hl-backdrop,.cp-backdrop,#gillLearningOverlay'));
  const shell=e=>e?{open:e.classList.contains('is-open'),aria:e.getAttribute('aria-hidden'),inert:e.inert}:null;
  function hit(e){
    if(!e)return null;
    const b=e.getBoundingClientRect(), x=b.x+b.width/2,y=b.y+b.height/2;
    const t=document.elementFromPoint(x,y);
    return {name:name(e),owner:owner(e),point:[x,y],rect:[b.x,b.y,b.width,b.height].map(n=>Math.round(n*100)/100),
      hit:e.contains(t),hitName:name(t),hitOwner:owner(t),focusVisible:e.matches(':focus-visible')};
  }
  const locks=()=>Object.keys(window.SiteUtils?._scrollLockSources||{}).sort();
  const owners=()=> (window.OverlayRuntime?.snapshot()||[]).map(e=>e.ownerId);
  const library=()=>shell(q('#gb-hl-backdrop'));
  function snapshot(){
    const lib=q('#gb-hl-backdrop');
    const backdrop=q('.cp-backdrop'), input=q('.cp-input'), el=document.activeElement;
    return {active:hit(el),searchInput:hit(input),submit:hit(q('#gb-hl-editor button[type=submit]')),
      editor:{open:q('#gb-hl-editor').hidden===false,value:q('#gb-hl-note-text').value},
      notes:JSON.parse(localStorage.getItem('gb-reader-notes-v1')||'[]').map(n=>({text:n.text,path:new URL(n.url,location.origin).pathname,quote:n.quoteText||''})),
      status:q('#gb-hl-status').textContent.trim(), scope:q('#gb-hl-tabs [aria-pressed=true]')?.dataset.libraryTab??null,
      lib:library(),palette:shell(backdrop),learning:shell(q('#gillLearningOverlay')),
      directLib:lib.parentElement===document.body, directPalette:backdrop?backdrop.parentElement===document.body:null,
      article:{inert:q('.gbs2-world').inert,aria:q('.gbs2-world').getAttribute('aria-hidden')},
      query:input?.value??null,ready:window.GBSearch?.__ready===true,bootstrap:window.GBSearchBootstrap?.getState?.().phase??null,
      locks:locks(),owners:owners(),locked:document.documentElement.dataset.scrollLocked==='1',
      bodyPosition:getComputedStyle(document.body).position,scrollY:Math.round(scrollY),
      hash:location.hash,history:history.length};
  }
  for(const type of ['gb:overlay-open','gb:overlay-close'])document.addEventListener(type,e=>events.push({
    type,owner:e.detail?.ownerId,reason:e.detail?.reason,focus:name(document.activeElement),lib:library(),locks:locks(),owners:owners(),
  }));
  for(const capture of [true,false])for(const type of ['click','keydown','submit'])window.addEventListener(type,e=>{
    if(type==='keydown'&&!(e.key==='Escape'||e.key==='Enter'||e.key==='Tab'||e.ctrlKey&&e.key.toLowerCase()==='k'))return;
    events.push({type,phase:capture?'capture':'bubble',key:e.key?.toLowerCase()??null,trusted:e.isTrusted,
      node:name(e.target),owner:owner(e.target),point:type==='click'?[e.clientX,e.clientY]:null,
      prevented:e.defaultPrevented,shift:e.shiftKey??false,ctrl:e.ctrlKey??false});
  },{capture,passive:true});
  window.__librarySearchWitness={snapshot,events,hit};
}
const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
const state=p=>p.evaluate(()=>__librarySearchWitness.snapshot());
const point=(p,s)=>p.evaluate(k=>__librarySearchWitness.hit(document.querySelector(k)),s);
const mark=p=>p.evaluate(()=>__librarySearchWitness.events.length);
const segment=(p,n)=>p.evaluate(i=>__librarySearchWitness.events.slice(i),n);
function locks(s,expected){
  assert.deepEqual(s.locks,expected);
  assert.deepEqual(s.owners,expected.filter(k=>k.startsWith('overlay:')).map(k=>k.slice(8)));
  assert.equal(s.locked,expected.length!==0);
  assert.equal(s.bodyPosition,expected.length?'fixed':'static');
}
const PALETTE_LOCK='overlay:'+SEARCH;
const LEARN_LOCK='overlay:'+LEARN;
const nextTick=p=>p.evaluate(()=>new Promise(requestAnimationFrame)).then(()=>state(p));
const samples=(p,series)=>p.evaluate(async times=>{
  const start=performance.now(), captured=[];
  for(const ms of times){while(performance.now()-start<ms)await new Promise(requestAnimationFrame);captured.push({ms,...__librarySearchWitness.snapshot()});}
  return captured;
},series);
async function key(p,k){await p.keyboard.press(k);return (await samples(p,[90]))[0];}
async function tabUntil(p,target){
  const trace=[];
  for(let i=0;i<16;i++){
    const next=await key(p,'Tab');trace.push(next.active.name);
    if(next.active.name===target)return trace;
  }
  throw new Error(`Tab target ${target} not reached: ${trace.join(' ')}`);
}
async function readAX(ctx,p,selectors){
  const cdp=await ctx.newCDPSession(p);
  try{
    await cdp.send('Accessibility.enable');
    const rows=[];
    for(const [key,sel] of Object.entries(selectors)){
      const {result}=await cdp.send('Runtime.evaluate',{expression:`document.querySelector(${JSON.stringify(sel)})`});
      assert.ok(result.objectId,sel);
      try{
        const {nodes:[n]}=await cdp.send('Accessibility.getPartialAXTree',{objectId:result.objectId,fetchRelatives:false});
        const prop=k=>n.properties?.find(x=>x.name===k)?.value?.value??null;
        rows.push([key,{ignored:n.ignored,role:n.role?.value??null,name:n.name?.value??null,modal:prop('modal'),focusable:prop('focusable')}]);
      }finally{await cdp.send('Runtime.releaseObject',{objectId:result.objectId});}
    }
    return Object.fromEntries(rows);
  }finally{await cdp.detach();}
}
async function paint(ctx,p){
  const cdp=await ctx.newCDPSession(p);
  const fields=['display','visibility','z-index','opacity','background-color','backdrop-filter'];
  try{
    const {strings,documents:[doc]}=await cdp.send('DOMSnapshot.captureSnapshot',{computedStyles:fields,includePaintOrder:true,includeDOMRects:true});
    const has=(at,a,v)=>at?.some((x,i)=>i%2===0&&strings[x]===a&&String(strings[at[i+1]]??'').split(' ').includes(v));
    return Object.fromEntries(Object.entries({lib:['id','gb-hl-backdrop'],panel:['id','gb-hl-panel'],palette:['class','cp-backdrop'],input:['class','cp-input']})
      .map(([k,[a,v]])=>{
        const n=doc.nodes.attributes.findIndex(at=>has(at,a,v)), i=doc.layout.nodeIndex.indexOf(n);
        return [k,i<0?null:{order:doc.layout.paintOrders[i],bounds:doc.layout.bounds[i].map(x=>Math.round(x*100)/100),
          styles:Object.fromEntries(doc.layout.styles[i].map((x,j)=>[fields[j],strings[x]]))}];
      }));
  }finally{await cdp.detach();}
}
async function learning(p){
  await p.locator(await p.locator('#railSettingsBtn').isVisible()?'#railSettingsBtn':'#mobSettingsBtn').click();
  await p.locator('#mobLearningBtn').click(); await p.locator('#gillLearningOverlay.is-open').waitFor();
  await p.waitForFunction(()=>document.activeElement.closest('#gillLearningOverlay'));
}
const review=p=>p.evaluate(()=>Object.fromEntries(['glsQuizQuestion','glsQuizVerdict','glsQuizExplanation','glsQuizSource'].map(id=>{
  const el=document.getElementById(id);return [id,[el.textContent.replace(/\s+/gu,' ').trim(),el.hidden,el.getAttribute('href')]];
})));
async function fromMiss(p,r){
  const [route,target,heading]=routes[r.route];
  await learning(p);await p.locator('#tabQuiz').click();
  const deck=JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for(let i=0;i<deck.length;i++){
    const question=norm(await p.locator('#glsQuizQuestion').innerText());
    const q=deck.find(x=>norm(x.question)===question);assert.ok(q);
    await p.locator('#glsQuizConfRow [data-conf="sure"]').click();
    await p.locator('#glsQuizOptions').getByRole('button',{name:q.answers[(q.correctIndex+1)%q.answers.length],exact:true}).click();
    if(q.id!==target){await p.locator('#glsQuizNext').click();continue;}
    r.answer=await review(p);
    assert.match(r.answer.glsQuizVerdict[0],/^Неверно/u);
    assert.match(r.answer.glsQuizSource[2],new RegExp('#'+heading+'$'));
    await p.locator('#tabQuiz').click();r.toSource=await tabUntil(p,'glsQuizSource');
    await p.keyboard.press('Enter');
    await p.waitForFunction(fragment=>location.hash==='#'+fragment&&document.activeElement?.id===fragment,heading);
    r.source=(await samples(p,[160]))[0];
    assert.ok(r.source.active.hit&&r.source.scrollY>400);locks(r.source,[]);
    assert.deepEqual(r.source.learning,CLOSED);assert.equal(new URL(p.url()).pathname,route);
    return;
  }
  throw Error('authored question was not reached');
}
async function library(p,notes){
  await learning(p);await p.locator('#tabNotes').click();
  const hops=await tabUntil(p,'manageNotesBtn');
  const active=await state(p);locks(active,[LEARN_LOCK]);assert.ok(active.active.hit);
  await p.keyboard.press('Enter');await p.locator('#gb-hl-backdrop.is-open').waitFor();
  await p.locator(notes?'#gb-hl-list .gb-hl-item':'#gb-hl-list .gb-hl-empty-title').first().waitFor();
  const opened=(await samples(p,[130]))[0];locks(opened,[LIB]);
  assert.deepEqual(opened.learning,CLOSED);assert.deepEqual(opened.lib,OPEN);assert.equal(opened.active.name,'gb-hl-close');
  return {hops,active,opened};
}
async function compose(p){
  await p.locator('#gb-hl-new-note').click();
  await p.waitForFunction(()=>document.activeElement?.id==='gb-hl-note-text');
  await p.keyboard.insertText(DRAFT);
  const s=await key(p,'Control+k');
  assert.equal(s.active.name,AREA);assert.equal(s.editor.value,DRAFT);assert.ok(s.editor.open);
  assert.ok(!s.palette?.open);locks(s,[LIB]);
  return s;
}
async function openSearch(p,expected){
  await p.keyboard.press('Control+k');
  await p.waitForFunction(()=>document.activeElement?.matches('.cp-input')&&document.querySelector('.cp-backdrop.is-open'));
  const settled=(await samples(p,[380]))[0];
  assert.equal(settled.active.name,INPUT);assert.ok(settled.ready&&settled.directPalette&&settled.directLib);
  assert.deepEqual(settled.palette,OPEN);locks(settled,expected);
  return settled;
}
async function pressEscape(p){await p.keyboard.press('Escape');return samples(p,[0,80,250,600]);}
async function realClick(p,probe){
  const start=await mark(p);
  await p.mouse.click(...probe.point);
  const after=(await samples(p,[250]))[0],events=await segment(p,start);
  const click=events.find(e=>e.phase==='capture'&&e.type==='click');
  assert.ok(click?.trusted);assert.equal(click.owner,probe.hitOwner);assert.equal(click.node,probe.hitName);
  return {probe,click,after};
}
const shot=(p,name)=>p.screenshot({path:path.join(out,name),animations:'disabled'});
async function save(p,r,viaKeyboard){
  if(viaKeyboard){
    r.toSubmit=await key(p,'Tab');assert.equal(r.toSubmit.active.name,SAVE);assert.ok(r.toSubmit.active.hit);
    await p.keyboard.press('Enter');
  }
  await p.locator('#gb-hl-list .gb-hl-item[data-type="note"]').waitFor();
  r.saved=(await samples(p,[140]))[0];
  assert.equal(r.saved.scope,'note');assert.equal(r.saved.status,'Заметка сохранена.');
  assert.deepEqual(r.saved.notes,[{text:DRAFT,path:routes[r.route][0],quote:''}]);
  assert.equal(r.saved.editor.open,false);
}

async function exercise(ctx,p,base,r){
  const [route,,heading]=routes[r.route];
  assert.equal((await p.goto(base+route,{waitUntil:'load'})).status(),200);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  await p.locator('#gb-hl-backdrop').waitFor({state:'attached'});
  const doc=await p.evaluate(()=>performance.timeOrigin);
  r.initial=await state(p);locks(r.initial,[]);assert.deepEqual(r.initial.lib,CLOSED);
  assert.ok(!r.initial.ready&&!r.initial.notes.length);
  await fromMiss(p,r);
  if(r.arm==='palette-only'){
    r.open=await openSearch(p,[PALETTE_LOCK]);assert.deepEqual(r.open.lib,CLOSED);assert.ok(r.open.searchInput.hit);
    r.paint=await paint(ctx,p);assert.equal(r.paint.lib,null);
    if(r.width===390)await shot(p,'palette-only-390.png');
    r.clicked=await realClick(p,r.open.searchInput);
    assert.equal(r.clicked.click.node,INPUT);assert.ok(r.clicked.after.palette.open);
    r.esc=await pressEscape(p);const s=r.esc.at(-1);assert.equal(s.active.name,heading);locks(s,[]);
  }else{
    if(r.arm==='stack-escape-warm'){
      r.warm=await openSearch(p,[PALETTE_LOCK]);assert.ok(r.warm.searchInput.hit);
      r.warmEsc=await pressEscape(p);assert.equal(r.warmEsc.at(-1).active.name,heading);locks(r.warmEsc.at(-1),[]);
    }
    r.library=await library(p,false);r.editable=await compose(p);
    r.fromCancel=await key(p,'Tab');assert.equal(r.fromCancel.active.name,CANCEL);assert.ok(r.fromCancel.active.hit);
    assert.equal(r.fromCancel.ready,r.arm==='stack-escape-warm');assert.equal(r.fromCancel.editor.value,DRAFT);
    if(r.arm==='library-only'){
      await save(p,r,true);locks(r.saved,[LIB]);assert.equal(r.saved.palette,null);
    }else{
      r.open=await openSearch(p,[LIB,PALETTE_LOCK]);
      assert.deepEqual(r.open.lib,OPEN);assert.deepEqual(r.open.article,{aria:'true',inert:true});
      assert.ok(r.open.editor.open&&!r.open.notes.length);assert.equal(r.open.editor.value,DRAFT);
      assert.equal(r.open.searchInput.hit,false);assert.equal(r.open.searchInput.hitOwner,'gb-hl-backdrop');
      assert.equal(r.open.submit.hit,true);
      r.paint=await paint(ctx,p);assert.ok(r.paint.lib.order>r.paint.input.order&&r.paint.panel.order>r.paint.input.order);
      r.ax=await readAX(ctx,p,{search:'.cp-backdrop',library:'#gb-hl-panel',save:'#gb-hl-editor button[type=submit]',field:'.cp-input'});
      assert.ok(!r.ax.search.ignored&&!r.ax.library.ignored&&r.ax.search.modal&&r.ax.library.modal);
      assert.ok(!r.ax.save.ignored&&r.ax.save.focusable);
      if(r.route==='gill'&&r.arm==='stack-escape-cold')await shot(p,`stacked-${r.width}.png`);
      if(r.arm==='stack-field-click'){
        r.clicked=await realClick(p,r.open.searchInput);
        assert.equal(r.clicked.click.owner,'gb-hl-backdrop');assert.ok(r.clicked.after.palette.open);
        const s=r.clicked.after;const lost=r.width===390;
        assert.equal(s.lib.open,!lost);assert.equal(s.editor.open,!lost);assert.deepEqual(s.notes,[]);
        assert.equal(s.searchInput.hit,lost);locks(s,lost?[PALETTE_LOCK]:[LIB,PALETTE_LOCK]);
        if(!lost){
          r.afterPointerTab=await key(p,'Tab');
          assert.equal(r.afterPointerTab.active.owner,'gb-hl-backdrop');assert.ok(r.afterPointerTab.active.hit);
          assert.deepEqual(r.afterPointerTab.palette,OPEN);locks(r.afterPointerTab,[LIB,PALETTE_LOCK]);
        }
        r.esc=await pressEscape(p);
        if(lost){
          assert.equal(r.clicked.click.node,'gb-hl-backdrop');locks(r.esc.at(-1),[]);
          r.reopened=await library(p,false);await p.locator('#gb-hl-new-note').click();r.reopenEmpty=await nextTick(p);
          assert.ok(r.reopenEmpty.editor.open);assert.equal(r.reopenEmpty.editor.value,'');assert.deepEqual(r.reopenEmpty.notes,[]);
          await shot(p,'reopened-empty-390.png');
          r.discardEmpty=await pressEscape(p);
        }else{
          assert.equal(r.clicked.click.node,'gb-hl-header');assert.equal(r.esc.at(-1).active.name,CANCEL);
          r.remainingDraft=r.esc.at(-1).editor;assert.deepEqual(r.remainingDraft,{open:true,value:DRAFT});
          await save(p,r,true);
        }
      }else if(r.arm==='stack-save-click'){
        r.clicked=await realClick(p,r.open.submit);assert.equal(r.clicked.click.node,SAVE);
        await save(p,r,false);locks(r.saved,[LIB,PALETTE_LOCK]);assert.ok(r.saved.palette.open);
        r.esc=await pressEscape(p);assert.deepEqual(r.esc.at(-1).notes,r.saved.notes);
      }else{
        await p.keyboard.insertText(QUERY);r.typed=(await samples(p,[300]))[0];
        assert.equal(r.typed.query,QUERY);assert.equal(r.typed.editor.value,DRAFT);assert.ok(!r.typed.active.hit);
        r.tab=await key(p,'Tab');r.reverse=await key(p,'Shift+Tab');
        assert.equal(r.tab.active.owner,'cp-backdrop');assert.equal(r.reverse.active.name,INPUT);
        assert.ok(!r.tab.active.hit&&!r.reverse.active.hit);
        r.esc=await pressEscape(p);const s=r.esc.at(-1);locks(s,[LIB]);
        assert.deepEqual(s.palette,CLOSED);assert.deepEqual(s.lib,OPEN);
        assert.equal(s.active.name,CANCEL);assert.ok(s.active.hit);
        assert.deepEqual(s.editor,{open:true,value:DRAFT});assert.deepEqual(s.notes,[]);
        await save(p,r,true);
      }
      assert.deepEqual(r.esc.at(-1).palette,CLOSED);
    }
    r.exit=await pressEscape(p);const s=r.exit.at(-1);
    locks(s,[]);assert.deepEqual(s.lib,CLOSED);assert.deepEqual(s.learning,CLOSED);
    assert.ok(!s.editor.open);assert.equal(s.hash,'#'+heading);assert.equal(s.scrollY,r.source.scrollY);
    if(r.reopenEmpty)assert.deepEqual(s.notes,[]);else assert.deepEqual(s.notes,r.saved.notes);
  }
  r.final=await state(p);r.finalAnswer=await review(p);assert.deepEqual(r.finalAnswer,r.answer);
  assert.equal(r.final.hash,r.source.hash);assert.equal(r.final.history,r.source.history);
  assert.equal(await p.evaluate(()=>performance.timeOrigin),doc);r.sameDocument=true;
  assert.deepEqual(r.documents,[[route,200]]);assert.deepEqual(r.optional,r.arm==='library-only'?[]:[['HEAD','/pagefind/pagefind.js',404]]);
}

let browser;const rows=[], pins=new Set();const {server,base}=await serve();
try{
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const spec of cases){
    const row={...spec,documents:[],optional:[],errors:[]};rows.push(row);
    const ctx=await browser.newContext({viewport:{width:row.width,height:row.height},reducedMotion:'reduce',colorScheme:'light',serviceWorkers:'block'});
    try{
      ctx.setDefaultTimeout(8000);await ctx.addInitScript(installWitness);
      await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
      ctx.on('weberror',e=>row.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('requestfailed',q=>{const url=new URL(q.url()),why=q.failure()?.errorText;if(url.origin===base&&why!=='net::ERR_ABORTED')row.errors.push(['request',url.pathname,why]);});
      ctx.on('response',r=>{
        const url=new URL(r.url()),q=r.request(),status=r.status(),type=q.resourceType(),method=q.method();if(url.origin!==base)return;
        if(type==='document')row.documents.push([url.pathname,status]);
        if(method==='HEAD'&&url.pathname==='/pagefind/pagefind.js')row.optional.push([method,url.pathname,status]);
        else if(status>=400)row.errors.push(['http',method,url.pathname,status]);
        if(r.ok()&&method==='GET'&&(['script','stylesheet','font','document'].includes(type)||url.pathname.startsWith('/data/')&&url.pathname.endsWith('.json'))){
          let f=url.pathname.slice(1).replace(/\/*$/u,'');if(type==='document'&&!f.endsWith('.html'))f=f?f+'/index.html':'index.html';pins.add(f);
        }
      });
      const p=await ctx.newPage();p.on('console',e=>{if(e.text().includes('Emergency unlock'))row.errors.push(['emergency',e.text()]);});
      try{await exercise(ctx,p,base,row);}finally{row.events=await p.evaluate(()=>window.__librarySearchWitness?.events??[]);}
      assert.deepEqual(row.errors,[]);assert.equal(ctx.pages().length,1);row.ok=true;
      console.log('OK',row.id,'paint='+String(row.open?.searchInput.hitOwner??'-'),'click='+String(row.clicked?.click.node??'-'),
        'esc='+String(row.esc?.at(-1).active.name??'-'),'data='+String(row.reopenEmpty?'empty':row.final.notes.length));
    }catch(e){row.ok=false;row.error=e.stack?.replaceAll(base,'LOCAL')??String(e);console.error('FAIL',row.id,row.error);}
    finally{await ctx.close();}
  }
  const sha=f=>createHash('sha256').update(fs.readFileSync(path.join(P,'dist',f))).digest('hex');
  const w={anchor:ANCHOR,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    distSha256:Object.fromEntries([...pins].sort().map(f=>[f,sha(f)])),rows};
  fs.writeFileSync(path.join(out,'library-search-stack-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${rows.filter(r=>r.ok).length}/${rows.length} measured, ${pins.size} assets`);
  if(rows.some(r=>!r.ok))process.exitCode=1;
}finally{await browser?.close(); await new Promise(r=>server.close(r));}
