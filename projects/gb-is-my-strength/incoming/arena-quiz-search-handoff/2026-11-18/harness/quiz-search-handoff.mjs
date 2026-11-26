// Observe the real Gill II quiz and global palette. No Product API calls,
// seeded storage, patching inert, or programmatic focus/scroll in the harness.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const [arg,output,executablePath,filter]=process.argv.slice(2);
assert.ok(arg&&output&&executablePath,'node quiz-search-handoff.mjs PRODUCT FRESH_OUT CHROMIUM [id-filter]');
const P=path.resolve(arg), out=path.resolve(output);
const req=createRequire(path.join(P,'package.json'));
const {chromium}=req('playwright');
const {serve}=await import(pathToFileURL(path.join(P,'scripts/lib/a04-contract.mjs')));
const GILL='/articles/dzhon-gill-chast-2-uchenyi/', KEY='sec-canticles';
const SEARCH='search:command-palette', LEARN='gill-learning', SETTINGS='gill-settings';
const SOURCE='glsQuizSource', NEXT='glsQuizNext';
const anchor='9edef94ece08012223c1364bec7ddcd561cf5713';
const flows=[['after-miss',['no-search','shortcut-cold','shortcut-warm','section-button']],
  ['before-answer',['no-search','shortcut-cold','shortcut-warm']],['solo',['escape-and-next']]];
const cases=[390,1440].flatMap(width=>flows.flatMap(([phase,arms])=>arms.map(arm=>({
  id:`${width}-${phase}-${arm}`,phase,arm,width,height:width===390?844:900,
})))).filter(c=>!filter||c.id.includes(filter));
assert.ok(cases.length);
fs.mkdirSync(out,{recursive:true});
assert.ok(!fs.existsSync(path.join(out,'quiz-search-handoff-witness.json')),'use fresh output directory');

function observe() {
  const events=[];
  const query=s=>document.querySelector(s);
  const name=e=>{
    if(!e?.matches)return null;
    if(e.matches('body'))return 'body';
    if(e.matches('.cp-input'))return 'palette-input';
    if(e.matches('.skip-link'))return 'skip-link';
    if(e.matches('#gillLearningOverlay [data-overlay-close]'))return e.matches('.toc-sheet__handle')?'learning-handle':'learning-close';
    return e.id||e.classList[0]||e.localName;
  };
  const owners=()=> (window.OverlayRuntime?.snapshot?.()||[]).map(o=>o.ownerId);
  const locks=()=>Object.keys(window.SiteUtils?._scrollLockSources||{}).sort();
  const claims=s=>{const e=query(s);return {aria:e.getAttribute('aria-hidden'),inert:e.inert};};
  const nav=()=>{const el=query('#hMobileNav');return {direct:el.parentElement===document.body,inert:el.inert,
    hidden:el.hidden,aria:el.getAttribute('aria-hidden'),display:getComputedStyle(el).display};};
  function shell(s){const el=query(s); return el?{open:el.classList.contains('is-open'),aria:el.getAttribute('aria-hidden'),inert:el.inert}:null;}
  const admitted=(e,kind)=>((e.key.toLowerCase()==='k'&&(e.ctrlKey||e.metaKey))||['Escape','Enter'].includes(e.key))&&events.push({
    kind,key:e.key.toLowerCase(),target:name(e.target),trusted:e.isTrusted,ctrl:e.ctrlKey,prevented:e.defaultPrevented,
  });
  window.addEventListener('keydown',e=>admitted(e,'key-capture'),{capture:true,passive:true});
  window.addEventListener('keydown',e=>admitted(e,'key-bubble'),{passive:true});
  for(const k of ['gb:overlay-open','gb:overlay-close'])document.addEventListener(k,e=>events.push({
    kind:k,owner:e.detail?.ownerId,reason:e.detail?.reason,owners:owners(),locks:locks(),nav:nav(),focus:name(document.activeElement),
  }));
  function snapshot() {
    const e=document.activeElement,b=e.getBoundingClientRect(),v=visualViewport;
    const hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);
    return {focus:name(e),tag:e.tagName,activeTabIndex:e.tabIndex,focusVisible:e.matches(':focus-visible'),
      insideLearning:!!e.closest('#gillLearningOverlay'),insideNav:!!e.closest('#hMobileNav'),
      inView:b.top<v.offsetTop+v.height&&b.bottom>v.offsetTop&&b.left<v.offsetLeft+v.width&&b.right>v.offsetLeft&&b.width>0&&b.height>0,
      hit:!!(hit&&e.contains(hit)),hitTarget:name(hit),scrollY:Math.round(scrollY),top:Math.round(b.top),
      owners:owners(),locks:locks(),locked:document.documentElement.dataset.scrollLocked==='1',
      bodyPosition:getComputedStyle(document.body).position,
      settings:shell('#gillSettingsOverlay'),learning:shell('#gillLearningOverlay'),palette:shell('.cp-backdrop'),nav:nav(),
      world:claims('.gbs2-world'),skip:claims('.skip-link'),
      activeLearningTab:query('#gillLearningOverlay [role="tab"][aria-selected="true"]')?.id??null,
      partInput:query('#learningSearchInput')?.value??null,
      ready:window.GBSearch?.__ready===true,
      searchBootstrap:window.GBSearchBootstrap?.getState?.().phase??null,
      hash:location.hash,historyLength:history.length};
  }
  window.__quizSearchHandoff={events,snapshot};
}
const state=p=>p.evaluate(()=>__quizSearchHandoff.snapshot());
const sample=(p,ticks)=>p.evaluate(async times=>{
  const start=performance.now(),v=[];
  for(const ms of times){while(performance.now()-start<ms)await new Promise(requestAnimationFrame);v.push({ms,...__quizSearchHandoff.snapshot()});}
  return v;
},ticks);
const text=s=>String(s??'').replace(/\s+/gu,' ').trim();
const quizView=p=>p.evaluate(()=>{
  const by=id=>document.getElementById(id);
  const get=id=>by(id).textContent.replace(/\s+/gu,' ').trim();
  return {question:get('glsQuizQuestion'),verdict:get('glsQuizVerdict'),verdictHidden:by('glsQuizVerdict').hidden,
    explanation:get('glsQuizExplanation'),calibration:get('glsQuizCalibPct'),streak:get('glsQuizStreak'),
    chosenConfidence:by('glsQuizConfRow').querySelector('.is-picked')?.dataset.conf??null,
    sourceText:get('glsQuizSource'),
    sourceHref:by('glsQuizSource').getAttribute('href'),sourceHidden:by('glsQuizSource').hidden,
    options:[...by('glsQuizOptions').querySelectorAll('button')].map(b=>[b.textContent.replace(/\s+/gu,' ').trim(),b.className,b.disabled])};
});
async function tabsTo(p,expected,limit=12){
  const steps=[];
  const reaches=typeof expected==='string'?s=>s.focus===expected:expected;
  for(let i=0;i<limit;i++) {
    await p.keyboard.press('Tab');
    const s=(await sample(p,[34]))[0]; steps.push({focus:s.focus,insideLearning:s.insideLearning,hit:s.hit});
    if(reaches(s))return steps;
  }
  throw Error(`Tab did not reach intended control: ${JSON.stringify(steps)}`);
}
async function axis(c,p) {
  const sess=await c.newCDPSession(p);
  await sess.send('Accessibility.enable');
  return async selector=>{
    const {result}=await sess.send('Runtime.evaluate',{expression:`document.querySelector(${JSON.stringify(selector)})`});
    assert.ok(result.objectId);
    try {
      const {nodes}=await sess.send('Accessibility.getPartialAXTree',{objectId:result.objectId,fetchRelatives:false});
      const n=nodes[0];
      return {role:n.role?.value??null,name:n.name?.value??null,ignored:n.ignored,focusable:n.properties?.find(x=>x.name==='focusable')?.value.value??false};
    }finally{await sess.send('Runtime.releaseObject',{objectId:result.objectId});}
  };
}
function lockState(s,chain){
  assert.deepEqual(s.owners,chain);
  assert.deepEqual(s.locks,chain.map(x=>'overlay:'+x).sort());
  assert.equal(s.locked,chain.length>0);
  assert.equal(s.bodyPosition==='fixed',chain.length>0);
}
const openPanel={open:true,aria:'false',inert:false};
const shutPanel={open:false,aria:'true',inert:true};
async function intoLearning(p,width){
  const btn=p.locator(width===390?'#mobSettingsBtn':'#railSettingsBtn');
  assert.ok(await btn.isVisible());
  await btn.click(); await p.locator('#gillSettingsOverlay.is-open').waitFor();
  await p.locator('#mobLearningBtn').click(); await p.locator('#gillLearningOverlay.is-open').waitFor();
  await p.waitForFunction(()=>document.getElementById('gillLearningOverlay').contains(document.activeElement));
  const s=await state(p);
  assert.deepEqual(s.learning,openPanel); assert.deepEqual(s.settings,shutPanel); lockState(s,[LEARN]);
  return s;
}
async function reachQuestion(p,stopBeforeAnswer){
  await p.locator('#tabQuiz').click();
  const deck=JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for(let i=0;i<deck.length;i++){
    const prompt=text(await p.locator('#glsQuizQuestion').innerText());
    const q=deck.find(t=>text(t.question)===prompt);assert.ok(q);
    const bad=q.answers[(q.correctIndex+1)%q.answers.length];
    await p.locator('#glsQuizConfRow [data-conf="sure"]').click();
    if(stopBeforeAnswer&&q.id==='gill.scholar.canticles')return bad;
    await p.locator('#glsQuizOptions').getByRole('button',{name:bad,exact:true}).click();
    await p.locator('#glsQuizVerdict:not([hidden])').waitFor();
    if(q.id==='gill.scholar.canticles')return bad;
    await p.locator('#glsQuizNext').click();
  }
  throw Error('authored answer target not reached');
}
function checkMiss(view) {
  assert.match(view.verdict,/^Неверно — а уверенность была высокой/u);
  assert.match(view.sourceHref,new RegExp('#'+KEY+'$'));assert.match(view.sourceText,/Перечитать/u);
  assert.equal(view.verdictHidden,false);assert.equal(view.sourceHidden,false);
  assert.equal(view.chosenConfidence,'sure');
}
async function toAnswer(p,bad){
  await p.locator('#tabQuiz').click();
  return tabsTo(p,s=>s.focus==='quiz-option'&&s.insideLearning&&s.hit&&s.activeTabIndex===0,4).then(async steps=>{
    for(let j=0;j<4;j++) {
      const button=p.locator('#glsQuizOptions').getByRole('button',{name:bad,exact:true});
      if(await button.evaluate(e=>document.activeElement===e))return steps;
      await p.keyboard.press('Tab');const s=(await sample(p,[34]))[0];
      steps.push({focus:s.focus,insideLearning:s.insideLearning,hit:s.hit});
      assert.equal(s.focus,'quiz-option');assert.ok(s.insideLearning);
    }
    throw Error('Wrong authored option not reached by Tab');
  });
}
async function fromTabToSource(p){
  await p.locator('#tabQuiz').click();return tabsTo(p,SOURCE);
}
async function openedSearch(p){
  await p.waitForFunction(()=>document.activeElement?.matches('.cp-input')&&document.querySelector('.cp-backdrop.is-open'));
  const s=(await sample(p,[90]))[0];
  assert.equal(s.focus,'palette-input');assert.ok(s.hit&&s.inView&&s.ready);
  assert.deepEqual(s.palette,openPanel); lockState(s,[SEARCH]);
  assert.equal(s.learning.open,false);
  assert.deepEqual(s.world,{aria:'true',inert:true});assert.deepEqual(s.skip,{aria:'true',inert:true});
  return s;
}
async function escapeSearch(p){
  await p.keyboard.press('Escape');
  const samples=await sample(p,[0,80,250,600]);
  assert.deepEqual(samples.at(-1).palette,shutPanel);lockState(samples.at(-1),[]);
  return samples;
}
async function land(p,base,doc,beforeHistory){
  await Promise.all([p.waitForURL(base+GILL+'#'+KEY),p.keyboard.press('Enter')]);
  await p.waitForFunction(k=>{
    const e=document.getElementById(k), b=e.getBoundingClientRect();
    return document.activeElement===e&&e.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2));
  },KEY);
  const s=(await sample(p,[160]))[0];
  assert.equal(await p.evaluate(()=>performance.timeOrigin),doc);
  assert.equal(s.hash,'#'+KEY); assert.equal(s.focus,KEY); assert.ok(s.hit&&s.scrollY>500);
  assert.equal(s.historyLength,beforeHistory+1); lockState(s,[]);assert.deepEqual(s.learning,shutPanel);
  return s;
}

async function keyboardSample(p,key,ms=130){
  await p.keyboard.press(key);return (await sample(p,[ms]))[0];
}
async function closeSheetByEscape(p){
  await p.keyboard.press('Escape');const snapshots=await sample(p,[0,80,250,600]);
  lockState(snapshots.at(-1),[]);return snapshots;
}
async function backgroundControl(p,ax,r){
  const {width}=r;
  await p.locator(width===390?'#mobSettingsBtn':'#railSettingsBtn').click();
  await p.locator('#gillSettingsOverlay.is-open').waitFor();lockState(await state(p),[SETTINGS]);
  r.settingsEscape=await closeSheetByEscape(p);
  const dest=r.settingsEscape.at(-1);assert.equal(dest.focus,width===390?'mobSettingsBtn':'railSettingsBtn');assert.ok(dest.hit);
  r.sheet=await intoLearning(p,width);
  await reachQuestion(p,false);r.quizBefore=await quizView(p);checkMiss(r.quizBefore);
  r.toSource=await fromTabToSource(p);r.atSource=await state(p);
  r.learningEscape=await closeSheetByEscape(p);
  const closed=r.learningEscape.at(-1);assert.equal(closed.focus,'body');assert.deepEqual(closed.learning,shutPanel);
  r.reopened=await intoLearning(p,width);r.quizAfterReopen=await quizView(p);assert.deepEqual(r.quizAfterReopen,r.quizBefore);
  r.toSourceAgain=await tabsTo(p,SOURCE);
  r.nextBeforeWrap=await keyboardSample(p,'Tab');assert.equal(r.nextBeforeWrap.focus,NEXT);
  r.wrapped=await keyboardSample(p,'Tab');assert.equal(r.wrapped.focus,width===390?'learning-handle':'heading-anchor');assert.ok(r.wrapped.insideLearning);
  r.wrappedReverse=await keyboardSample(p,'Shift+Tab');assert.equal(r.wrappedReverse.focus,NEXT);
  r.axWhileOpen={dialog:await ax('#gillLearningOverlay [role="dialog"]'),background:await ax('.skip-link')};
  assert.equal(r.axWhileOpen.dialog.role,'dialog');assert.ok(!r.axWhileOpen.dialog.ignored);
  assert.ok(!r.axWhileOpen.background.ignored&&r.axWhileOpen.background.focusable);
  await p.keyboard.press('Enter');
  await p.waitForFunction(before=>document.getElementById('glsQuizQuestion').textContent.replace(/\s+/gu,' ').trim()!==before,r.quizBefore.question);
  r.afterNextQuiz=await quizView(p);assert.notEqual(r.afterNextQuiz.question,r.quizBefore.question);assert.ok(r.afterNextQuiz.verdictHidden);
  r.afterNext=(await sample(p,[90]))[0];
  r.afterNextKeys=[];for(const key of ['Tab','Tab','Shift+Tab'])r.afterNextKeys.push(await keyboardSample(p,key));
  for(const v of r.afterNextKeys){lockState(v,[LEARN]);assert.deepEqual(v.learning,openPanel);}
  if(width===390){
    assert.ok(r.afterNextKeys.slice(0,2).some(v=>v.focus!=='body'&&!v.insideLearning));
    r.narrowShotState=r.afterNextKeys[1];
    // In the narrow trace the second Tab selects the first background link.
    assert.equal(r.narrowShotState.focus,'skip-link');
    // Restore that exact keyboard position for the screenshot after the reverse probe.
    assert.equal((await keyboardSample(p,'Tab')).focus,'skip-link');
    await p.screenshot({path:path.join(out,'solo-after-next-390.png'),animations:'disabled'});
  }else assert.ok(r.afterNextKeys.every(v=>v.insideLearning));
  r.exitAfterNext=await closeSheetByEscape(p);
  assert.deepEqual(r.exitAfterNext.at(-1).learning,shutPanel);
}

async function exercise(ctx,p,base,r) {
  const {arm,width}=r;
  assert.equal((await p.goto(base+GILL,{waitUntil:'load'})).status(),200);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  await p.mouse.move(2,2);
  const doc=await p.evaluate(()=>performance.timeOrigin);
  r.initial=await state(p);
  assert.equal(r.initial.palette,null);assert.ok(!r.initial.ready&&r.initial.nav.direct&&r.initial.nav.inert&&r.initial.nav.hidden);
  lockState(r.initial,[]);assert.deepEqual(r.initial.world,{aria:null,inert:false});
  const ax=await axis(ctx,p);
  r.navAxBefore=await ax('#hMobileNav a');assert.ok(r.navAxBefore.ignored);
  if(arm==='shortcut-warm'){
    await p.keyboard.press('Control+k');
    r.warmupOpen=await openedSearch(p);
    r.warmupClosed=await escapeSearch(p);
    assert.ok(!r.warmupClosed.at(-1).nav.inert&&r.warmupClosed.at(-1).nav.hidden);
  }
  if(r.phase==='solo')await backgroundControl(p,ax,r);
  else {
    r.sheet=await intoLearning(p,width);
    const beforeAnswer=r.phase==='before-answer';
    const wrong=await reachQuestion(p,beforeAnswer);
    r.quizBefore=await quizView(p);
    if(beforeAnswer){
      assert.ok(r.quizBefore.verdictHidden&&r.quizBefore.sourceHidden);
      assert.equal(r.quizBefore.chosenConfidence,'sure');
      assert.ok(r.quizBefore.options.every(entry=>!entry[2]));
      r.toAnswer=await toAnswer(p,wrong);
      r.atAnswer=await state(p);assert.equal(r.atAnswer.focus,'quiz-option');assert.ok(r.atAnswer.insideLearning);
    }else{
      checkMiss(r.quizBefore);r.toSource=await fromTabToSource(p);
      r.atSource=await state(p);
      assert.equal(r.atSource.focus,SOURCE);assert.ok(r.atSource.insideLearning&&r.atSource.inView);
      r.withoutSearchNext=await keyboardSample(p,'Tab');
      assert.equal(r.withoutSearchNext.focus,NEXT);assert.ok(r.withoutSearchNext.insideLearning);
      r.reverse=await keyboardSample(p,'Shift+Tab');
      assert.equal(r.reverse.focus,SOURCE);assert.ok(r.reverse.insideLearning);
    }
    const pre=await state(p);const actualHistory=pre.historyLength;assert.equal(pre.hash,'');
    if(arm==='no-search')assert.ok(pre.nav.inert&&pre.nav.hidden);
    else {
      if(arm==='section-button'){
        await p.locator('#tabSearch').click();
        r.toInput=await tabsTo(p,'learningSearchInput');
        await p.keyboard.type('test');
        await p.keyboard.press('Control+k');r.editable=(await sample(p,[400]))[0];
        assert.equal(r.editable.focus,'learningSearchInput');assert.equal(r.editable.partInput,'test');
        assert.equal(r.editable.palette,null);lockState(r.editable,[LEARN]);
        r.toGlobal=await tabsTo(p,'globalSearchBtn');
      }
      r.beforeSearch=await state(p);
      assert.equal(r.beforeSearch.focus,arm==='section-button'?'globalSearchBtn':beforeAnswer?'quiz-option':SOURCE);
      assert.equal(r.beforeSearch.ready,arm==='shortcut-warm');
      if(r.id==='390-after-miss-shortcut-cold')await p.screenshot({path:path.join(out,'before-search-390.png'),animations:'disabled'});
      await p.keyboard.press(arm==='section-button'?'Enter':'Control+k');r.open=await openedSearch(p);
      assert.deepEqual(r.open.learning,shutPanel);assert.equal(r.open.hash,'');assert.equal(r.open.historyLength,actualHistory);
      r.searchClosed=await escapeSearch(p);
      const closed=r.searchClosed.at(-1);
      assert.equal(closed.focus,'body');assert.equal(closed.tag,'BODY');
      assert.deepEqual(closed.learning,shutPanel);assert.deepEqual(closed.settings,shutPanel);
      assert.equal(closed.hash,'');assert.equal(closed.historyLength,actualHistory);
      assert.ok(closed.nav.hidden&&!closed.nav.inert&&closed.nav.aria==='true'&&closed.nav.display==='none');
      assert.deepEqual(closed.world,r.initial.world);assert.deepEqual(closed.skip,r.initial.skip);
      r.navAxAfter=await ax('#hMobileNav a');assert.ok(r.navAxAfter.ignored);
      r.quizAfterSearch=await quizView(p);assert.deepEqual(r.quizAfterSearch,r.quizBefore);
      r.nextAfterSearch=await keyboardSample(p,'Tab');
      assert.match(r.nextAfterSearch.focus,/^(?:skip-link|gb-hl-fab)$/);
      assert.ok(r.nextAfterSearch.hit&&!r.nextAfterSearch.insideLearning&&!r.nextAfterSearch.insideNav);
      if(r.id==='390-after-miss-shortcut-cold')await p.screenshot({path:path.join(out,'escape-and-tab-390.png'),animations:'disabled'});
      r.reverseAfterSearch=await keyboardSample(p,'Shift+Tab');
      assert.ok(!r.reverseAfterSearch.insideLearning&&!r.reverseAfterSearch.insideNav);lockState(r.reverseAfterSearch,[]);
      r.reopened=await intoLearning(p,width);
      r.quizAfterReopen=await quizView(p);assert.deepEqual(r.quizAfterReopen,r.quizBefore);
      if(arm==='section-button'){
        assert.equal(r.reopened.activeLearningTab,'tabSearch');assert.equal(r.reopened.partInput,'test');
        await p.locator('#tabQuiz').click();
      }else assert.equal(r.reopened.activeLearningTab,'tabQuiz');
      if(beforeAnswer)r.toAnswerAgain=await toAnswer(p,wrong);
      else r.toSourceAgain=await tabsTo(p,SOURCE);
    }
    if(beforeAnswer){
      await p.keyboard.press('Enter');await p.locator('#glsQuizVerdict:not([hidden])').waitFor();
      r.quizAnswered=await quizView(p);checkMiss(r.quizAnswered);
      assert.equal(r.quizAnswered.question,r.quizBefore.question);
      r.toSourceAfterAnswer=await fromTabToSource(p);
    }
    r.landed=await land(p,base,doc,actualHistory);
    r.finalQuiz=await quizView(p);assert.deepEqual(r.finalQuiz,r.quizAnswered??r.quizBefore);
  }
  assert.equal(await p.evaluate(()=>performance.timeOrigin),doc);
  assert.deepEqual(r.documents,[[GILL,200]]);
  assert.deepEqual(r.optionalHead,r.open?[['HEAD','/pagefind/pagefind.js',404]]:[]);
}

const {server,base}=await serve();let browser;
const rows=[], pins=new Set();
try{
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const spec of cases){
    const r={...spec,errors:[],documents:[],optionalHead:[]};rows.push(r);
    const ctx=await browser.newContext({viewport:{width:r.width,height:r.height},reducedMotion:'reduce',colorScheme:'light',serviceWorkers:'block'});
    ctx.setDefaultTimeout(8500);
    try{
      await ctx.addInitScript(observe);await ctx.route('**/*',h=>new URL(h.request().url()).origin===base?h.continue():h.abort());
      ctx.on('weberror',e=>r.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('requestfailed',q=>{const u=new URL(q.url()),why=q.failure()?.errorText;if(u.origin===base&&why!=='net::ERR_ABORTED')r.errors.push(['request',u.pathname,why]);});
      ctx.on('response',v=>{
        const u=new URL(v.url()),q=v.request(),type=q.resourceType(),method=q.method(),status=v.status();if(u.origin!==base)return;
        if(type==='document')r.documents.push([u.pathname,status]);
        if(method==='HEAD'&&u.pathname==='/pagefind/pagefind.js')r.optionalHead.push([method,u.pathname,status]);
        else if(status>=400)r.errors.push(['http',method,u.pathname,status]);
        if(v.ok()&&method==='GET'&&(['document','script','stylesheet','font'].includes(type)||u.pathname.startsWith('/data/')&&u.pathname.endsWith('.json'))){
          let f=u.pathname.slice(1).replace(/\/*$/u,'');if(type==='document'&&!f.endsWith('.html'))f=f?f+'/index.html':'index.html';pins.add(f);
        }
      });
      const page=await ctx.newPage();
      try{await exercise(ctx,page,base,r);}
      finally{r.events=await page.evaluate(()=>window.__quizSearchHandoff?.events.slice()??[]);}
      assert.deepEqual(r.errors,[]);assert.equal(ctx.pages().length,1);r.ok=true;
      console.log('OK',r.id,'owned-search='+(r.open?.owners.join(',')||'-'),'return='+(r.searchClosed?.at(-1).focus||'-'),
        'next='+(r.nextAfterSearch?.focus||'-'),'nav-inert='+(r.searchClosed?.at(-1).nav.inert??'-'),'landed='+(r.landed?.focus||'-'),'solo='+(r.afterNextKeys?.map(x=>x.focus).join('/')||'-'));
    }catch(e){r.ok=false;r.error=e.stack?.replaceAll(base,'LOCAL')||String(e);console.error('FAIL',r.id,r.error);}
    finally{await ctx.close();}
  }
  const digest=f=>createHash('sha256').update(fs.readFileSync(path.join(P,'dist',f))).digest('hex');
  const w={anchor,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    distSha256:Object.fromEntries([...pins].sort().map(f=>[f,digest(f)])),results:rows};
  fs.writeFileSync(path.join(out,'quiz-search-handoff-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${rows.filter(r=>r.ok).length}/${rows.length} measured, ${pins.size} pins`);
  if(rows.some(r=>!r.ok))process.exitCode=1;
}finally{await browser?.close();await new Promise(r=>server.close(r));}
