// Follow real browser Tab positions on the exact home bundle. No focus(),
// scrollIntoView(), styling changes, seeded storage or direct overlay commands.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node resume-focus.mjs PRODUCT FRESH_OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const A = '/articles/anatomiya-padeniya-pyat-stadiy/', ROUTE = '/articles/dzhon-gill-chast-2-uchenyi/';
const TARGET = 'sec-canticles', CTA = 'resumeReadingLink', DISMISS = 'resumeReadingDismiss', HERO = 'heroSearchBar';
const heroTerm = '.h-hero-desc abbr.gterm';
const LEGACY_LOCK = 'tooltip-mobile-sheet';
const key = r => 'gb:reader-state:v1:gb-strength:' + r.slice(0,-1);
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const defs = ['reduce','no-preference'].flatMap(motion => ['quick','dwell','escape'].map(arm => ['learning',390,motion,arm]));
defs.push(['learning',1440,'reduce','quick'], ['anatomy-reading',390,'reduce','quick'],
  ['empty',390,'reduce','quick'], ['empty',390,'reduce','dwell'], ['gill-reading',390,'reduce','quick']);
for(const width of [390,1440]) for(const scenario of ['dismiss-one','dismiss-two']) defs.push([scenario,width,'reduce','escape']);
const cases = defs.map(([scenario,width,motion,arm]) => ({ id:`${scenario}-${width}-${motion}-${arm}`, scenario, motion, arm,
  viewport:{width,height:width===390?844:900} })).filter(r=>!only||r.id.includes(only));
assert.ok(cases.length);
fs.mkdirSync(out,{recursive:true});
assert.ok(!fs.existsSync(path.join(out,'resume-focus-witness.json')), 'use fresh output');

function observeFocus() {
  if (location.pathname !== '/' || window !== window.top) return;
  const events = [], root = () => document.documentElement;
  const tag = el => el?.id || el?.localName || null;
  const identify = e => e?.matches('.h-hero-desc abbr.gterm') ? 'hero-term'
    : e?.matches('#resumeReadingMeta abbr.gterm') ? 'card-term'
    : e?.getAttribute('href')==='#hDirectionsLabel' && e.getAttribute('aria-label')==='Скопировать ссылку на раздел' ? 'directions-share'
    : tag(e);
  const text = e => e?.matches('abbr.gterm') ? e.firstChild?.textContent : e?.getAttribute('aria-label') || e?.textContent;
  const state = () => {
    const e = document.activeElement, b = e.getBoundingClientRect(), style = getComputedStyle(e), v = visualViewport;
    const hit = document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);
    const full = b.left>=v.offsetLeft && b.top>=v.offsetTop && b.right<=v.offsetLeft+v.width && b.bottom<=v.offsetTop+v.height && b.height>0;
    const inView = b.right>v.offsetLeft && b.bottom>v.offsetTop && b.left<v.offsetLeft+v.width && b.top<v.offsetTop+v.height && b.height>0;
    const u = window.SiteUtils;
    const expanded = document.querySelector('abbr.gterm.is-open[aria-expanded="true"]');
    return {target:identify(e), text:e===document.body?'':(text(e)||'').replace(/\s+/gu,' ').trim().slice(0,95),
      href:e.getAttribute('href'), focusVisible:e.matches(':focus-visible'), hovered:e.matches(':hover'),
      scrollY:Math.round(scrollY), bodyY:document.body.scrollTop, viewportHeight:v.height,
      top:Math.round(b.top), bottom:Math.round(b.bottom), full, inView, hit:!!(hit&&e.contains(hit)),
      visibility:style.visibility, opacity:Number(style.opacity),
      locked:root().getAttribute('data-scroll-locked') === '1', bodyPosition:getComputedStyle(document.body).position,
      lockSources:Object.keys(u?._scrollLockSources||{}).sort(),
      overlays:(window.OverlayRuntime?.snapshot?.()||[]).map(({ownerId,lockScroll})=>({ownerId,lockScroll})),
      articleOwner:root().getAttribute('data-gb-article-tooltips-owner'),
      definitionOpener:identify(expanded), mobileWidth:matchMedia('(max-width: 768px)').matches,
      openDefinitions:[...document.querySelectorAll('.gb-floating-tip.is-open')].map(t=>t.id),
      primaryHidden:document.getElementById('resumeReadingBlock')?.hidden };
  };
  for(const type of ['focusin','focusout']) document.addEventListener(type,event=>{
    const from=identify(event.target), to=identify(event.relatedTarget);
    if(['hero-term','heroSearchBar','card-term','resumeReadingLink','resumeReadingDismiss','directions-share'].includes(from)) {
      events.push({kind:type,from,to,ms:Math.round(performance.now()),trusted:event.isTrusted});
    }
  },true);
  window.__resumeFocusEvidence = {state, events};
}
const state = p => p.evaluate(() => __resumeFocusEvidence.state());
const timeline = (p,milestones=[0,250,600,1200]) => p.evaluate(async ticks => {
  const t0=performance.now(), result=[];
  for (const ms of ticks) {
    while (performance.now()-t0<ms) await new Promise(requestAnimationFrame);
    result.push({ms,...__resumeFocusEvidence.state()});
  }
  return result;
},milestones);
const cardData = p => p.evaluate(() => ({
  hidden:document.getElementById('resumeReadingBlock').hidden,
  title:document.getElementById('resumeReadingTitle').textContent.trim(),
  chapterTerm:document.querySelector('#resumeReadingMeta abbr.gterm')?.firstChild?.textContent ?? null,
  href:document.getElementById('resumeReadingLink').getAttribute('href'),
  remaining:[...document.querySelectorAll('#resumeList .resume-list-item')].map(a=>a.getAttribute('href')),
  listHidden:document.getElementById('resumeListBlock').hidden,
}));
const readStorage = p => p.evaluate(ks=>ks.map(k=>{
  const r=JSON.parse(localStorage.getItem(k)||'null');
  return r && { source:r.source,sectionId:r.sectionId,progress:r.progress,scrollY:r.scrollY,routePath:r.routePath,
    dismissed:r.dismissedAt>0 };
}),[key(A),key(ROUTE)]);

async function reachLearningSource(p) {
  await p.locator(await p.locator('#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn').click();
  await p.locator('#mobLearningBtn').click();
  await p.locator('#tabQuiz').click();
  const deck = JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for (let i=0; i<deck.length; i++) {
    const prompt = norm(await p.locator('#glsQuizQuestion').innerText());
    const item = deck.find(q => norm(q.question) === prompt);
    assert.ok(item, 'visible prompt must be in authored deck');
    await p.locator('#glsQuizConfRow [data-conf="sure"]').click();
    await p.locator('#glsQuizOptions').getByRole('button', {name:item.answers[(item.correctIndex+1)%item.answers.length],exact:true}).click();
    const verdict = p.locator('#glsQuizVerdict:not([hidden])');
    await verdict.waitFor();
    if (item.id === 'gill.scholar.canticles') {
      const before = norm(await verdict.innerText());
      assert.match(before,/^Неверно/u);
      const link = p.locator('#glsQuizSource');
      const href = await link.getAttribute('href');
      assert.ok(href.endsWith(`#${TARGET}`));
      await Promise.all([p.waitForURL(u => u.pathname===ROUTE && u.hash===`#${TARGET}`), link.click()]);
      assert.equal(norm(await verdict.textContent()),before);
      return {prompt,href,retained:true};
    }
    await p.locator('#glsQuizNext').click();
  }
  throw new Error('target never appeared in render');
}
async function readArticle(p,base,row,route,heading,learning=false) {
  assert.equal((await p.goto(base+route,{waitUntil:'load'})).status(),200);
  const doc = await p.evaluate(()=>performance.timeOrigin);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  if (learning) row.quiz=await reachLearningSource(p);
  const l=p.locator('#'+heading);
  if (!learning) {
    const dy=await l.evaluate(e=>Math.round(e.getBoundingClientRect().top-175));
    assert.ok(dy>500);
    await p.mouse.move(row.viewport.width/2,330);
    await p.mouse.wheel(0,dy);
    await p.waitForFunction(h=>document.getElementById(h).getBoundingClientRect().top<250,heading);
    assert.ok(await p.locator('#quizLaunch').isVisible());
    assert.equal(await p.locator('#quizPlaceholder .quiz-option').count(),0);
    assert.equal(await p.locator('#gillLearningOverlay.is-open').count(),0);
  }
  const v=await l.evaluate(async el=>{
    let prev='', t=performance.now();
    while(performance.now()-t<125) {
      await new Promise(requestAnimationFrame);
      const now=[scrollY,el.getBoundingClientRect().top].join('/');
      if(now!==prev) {prev=now;t=performance.now();}
    }
    const b=el.getBoundingClientRect(), hit=el.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2));
    return {doc:performance.timeOrigin,top:Math.round(b.top),scrollY:Math.round(scrollY),hit,focused:el===document.activeElement};
  });
  assert.equal(v.doc,doc);
  assert.ok(v.hit && v.scrollY>500 && (!learning||v.focused));
  const {doc:_unused,...position}=v;
  row.reads.push({route,heading,...position});
}
async function walkToTerm(p) {
  for(let n=1;n<=65;n++) {
    await p.keyboard.press('Tab');
    const s=await state(p);
    if(s.target==='hero-term') return {s,n};
    assert.notEqual(s.target,HERO,'skipped the real hero glossary stop');
  }
  throw Error('failed to reach glossary by native Tab');
}
async function escapeDefinition(p,target) {
  await p.keyboard.press('Escape');
  const s=await state(p);
  assert.equal(s.target,target);
  assert.ok(!s.locked&&s.openDefinitions.length===0);
  return s;
}
async function readyHome(p) {
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  await p.locator(heroTerm+'[data-gtip-upgraded="1"]').waitFor();
}
async function pressAndSettle(p,k) {
  await p.keyboard.press(k);
  return (await timeline(p,[250])).at(-1);
}
function assertLegacy(s,target,mobile) {
  assert.equal(s.definitionOpener,target);
  assert.equal(s.openDefinitions.length,1);
  assert.equal(s.mobileWidth,mobile);
  assert.equal(s.articleOwner,null);
  assert.deepEqual(s.overlays,[]);
  assert.deepEqual(s.lockSources,mobile?[LEGACY_LOCK]:[]);
  assert.equal(s.locked,mobile);
  assert.equal(s.bodyPosition,mobile?'fixed':'static');
}
function assertOffscreen(s,target,height) {
  assert.equal(s.target,target);
  assert.ok(s.focusVisible&&!s.inView&&!s.hit&&s.scrollY===0&&s.top>=height);
}
function assertHit(s,target) {
  assert.equal(s.target,target);
  assert.ok(s.focusVisible&&s.inView&&s.hit&&!s.hovered&&!s.locked);
}
async function reachFallbackAfterReload(p) {
  await walkToTerm(p);
  await escapeDefinition(p,'hero-term');
  const hero=await pressAndSettle(p,'Tab');
  assert.equal(hero.target,HERO);
  const cta=await pressAndSettle(p,'Tab');
  assertHit(cta,CTA);
  return cta;
}
async function follow(p,base,href) {
  const first=await p.evaluate(()=>performance.timeOrigin);
  await Promise.all([p.waitForURL(base+href,{waitUntil:'load'}),p.keyboard.press('Enter')]);
  const result=await p.evaluate(()=>({url:location.pathname+location.hash,target:document.querySelector(':target')?.id??null,
    nav:performance.getEntriesByType('navigation')[0]?.type, doc:performance.timeOrigin}));
  assert.ok(result.doc!==first && result.nav==='navigate');
  assert.equal(result.target,href.split('#')[1]);
  assert.equal(result.url,href);
  const {doc,...geo}=result;
  return geo;
}

async function exercise(p,base,row) {
  const {scenario,arm,viewport} = row, empty=scenario==='empty', dismiss=scenario.startsWith('dismiss');
  const narrow=viewport.width===390;
  row.reads=[];
  if (scenario==='dismiss-two'||scenario==='anatomy-reading') await readArticle(p,base,row,A,'metod');
  if (dismiss||scenario==='gill-reading') await readArticle(p,base,row,ROUTE,TARGET);
  if (scenario==='learning') await readArticle(p,base,row,ROUTE,TARGET,true);
  assert.equal((await p.goto(base+'/',{waitUntil:'load'})).status(),200);
  const homeDoc=await p.evaluate(()=>performance.timeOrigin);
  await readyHome(p);
  await p.mouse.move(2,2); // Neutral; never hover the definition or the CTA.
  row.start=await state(p);
  assert.ok(row.start.target==='body'&&!row.start.locked&&row.start.scrollY===0);
  row.cardBefore=await cardData(p);
  row.savedBefore=await readStorage(p);
  assert.equal(row.cardBefore.hidden,empty);
  const last=row.reads.at(-1);
  if(empty) {
    assert.deepEqual(row.savedBefore,[null,null]);
    assert.equal(row.cardBefore.href,null);
  } else {
    const current = row.savedBefore[last.route===A?0:1];
    assert.ok(current?.source==='reader-state-v1' && !current.dismissed);
    assert.equal(current.scrollY,last.scrollY);
    assert.equal(row.cardBefore.href,current.routePath+'#'+current.sectionId);
    assert.equal(current.sectionId,scenario==='learning'?'sec-hebrew':last.heading);
    assert.deepEqual(row.cardBefore.remaining,scenario==='dismiss-two'?[A.slice(0,-1)+'#metod']:[]);
  }
  const start=await walkToTerm(p);
  row.glossary=start.s;
  row.tabsToTerm=start.n;
  assert.ok(row.glossary.focusVisible && !row.glossary.hovered && row.glossary.text==='Экзегеза');
  assertLegacy(row.glossary,'hero-term',narrow);
  if(arm==='escape') row.escaped=await escapeDefinition(p,'hero-term');
  if(arm==='dwell') {
    await p.waitForTimeout(550); // Dwell on the opener through the legacy 350 ms grace period.
    row.dwell=await state(p);
    assertLegacy(row.dwell,'hero-term',narrow);
  }
  await p.keyboard.press('Tab');
  row.hero=await state(p);
  assert.equal(row.hero.target,HERO);
  if(arm==='quick') {
    assertLegacy(row.hero,'hero-term',narrow);
  } else assert.ok(!row.hero.locked&&row.hero.openDefinitions.length===0);
  await p.keyboard.press('Tab');
  row.entry=await timeline(p);
  const entered=row.entry.at(-1);
  const target=empty?'directions-share':(dismiss||scenario==='gill-reading')?'card-term':CTA;
  assert.equal(entered.target,target);
  assert.ok(entered.focusVisible && !entered.hovered);
  if(arm==='quick'&&narrow) {
    for(const s of row.entry) assertOffscreen(s,target,viewport.height);
    assertLegacy(entered,target==='card-term'?'card-term':'hero-term',true);
  } else if(target!=='card-term') assertHit(entered,target);
  if(target==='card-term') {
    assert.equal(entered.text,'Песнь Песней');
    assertLegacy(entered,'card-term',narrow);
    if(dismiss) row.cardTermEscaped=await escapeDefinition(p,'card-term');
    await p.keyboard.press('Tab');
    row.cardTermExit=await timeline(p);
    assertHit(row.cardTermExit.at(-1),CTA);
  }
  row.focusEvents=await p.evaluate(()=>__resumeFocusEvidence.events.slice());
  const first=row.focusEvents.find(e=>e.kind==='focusin'&&e.from==='hero-term');
  const leave=row.focusEvents.find(e=>e.kind==='focusout'&&e.from==='hero-term');
  assert.ok(first?.trusted && leave?.trusted && leave.to===HERO);
  row.heroTermDwellMs=leave.ms-first.ms;
  assert.ok(arm==='dwell'?row.heroTermDwellMs>=500:row.heroTermDwellMs<350);
  assert.equal(await p.evaluate(()=>performance.timeOrigin),homeDoc);
  if(['learning-390-reduce-quick','learning-390-reduce-dwell'].includes(row.id)) {
    await p.screenshot({path:path.join(out,`resume-focus-${arm}-390.png`)});
    const after=await state(p);
    for(const k of ['target','href','top','scrollY','hit','locked']) assert.equal(entered[k],after[k]);
  }
  if(row.id==='learning-390-reduce-quick') {
    await p.waitForFunction(()=>!document.documentElement.hasAttribute('data-scroll-locked'),null,{timeout:4400});
    row.afterRecovery=(await timeline(p,[250])).at(-1);
    row.recoverySinceGlossaryMs=Math.round(await p.evaluate(()=>performance.now())-first.ms);
    assertOffscreen(row.afterRecovery,CTA,viewport.height);
    assert.ok(!row.afterRecovery.locked && row.afterRecovery.openDefinitions.length===1);
    assert.equal(row.emergencyUnlocks,1);
  }
  if(dismiss) {
    row.atDismiss=await pressAndSettle(p,'Tab');
    assertHit(row.atDismiss,DISMISS);
    const stamp=await p.evaluate(()=>Date.now());
    await p.keyboard.press('Enter');
    row.dismissal=await timeline(p);
    row.cardAfter=await cardData(p);
    row.savedAfter=await readStorage(p);
    assert.deepEqual(row.savedAfter,[row.savedBefore[0],{...row.savedBefore[1],dismissed:true}]);
    row.stampChangedInAction=await p.evaluate(([k,lo])=>{
      const n=JSON.parse(localStorage.getItem(k)).dismissedAt;
      return Number.isFinite(n)&&n>=lo&&n<=Date.now();
    },[key(ROUTE),stamp]);
    assert.ok(row.stampChangedInAction);
    assert.equal(await p.evaluate(()=>performance.timeOrigin),homeDoc);
    row.next=await pressAndSettle(p,'Tab');
    assertHit(row.next,'directions-share');
    row.previous=await pressAndSettle(p,'Shift+Tab');
    if(scenario==='dismiss-one') {
      assert.ok(row.cardAfter.hidden&&row.cardAfter.listHidden&&row.cardAfter.href===null);
      // Blink can report the hidden button until focus fixup on the next frame.
      assert.ok(row.dismissal.every(s=>s.primaryHidden&&!s.hit));
      assert.ok(['body',DISMISS].includes(row.dismissal[0].target));
      assert.ok(row.dismissal.slice(1).every(s=>s.target==='body'));
      assertHit(row.previous,HERO);
    } else {
      assert.ok(row.dismissal.every(s=>s.target===DISMISS&&s.hit&&!s.primaryHidden));
      assert.ok(!row.cardAfter.hidden&&row.cardAfter.listHidden&&row.cardAfter.href===A.slice(0,-1)+'#metod');
      assertHit(row.previous,DISMISS);
      row.fallback=await pressAndSettle(p,'Shift+Tab');
      assertHit(row.fallback,CTA);
      assert.equal(row.fallback.href,row.cardAfter.href);
    }
    assert.equal((await p.reload({waitUntil:'load'})).status(),200);
    await readyHome(p);
    row.reload={card:await cardData(p),saved:await readStorage(p),type:await p.evaluate(()=>performance.getEntriesByType('navigation')[0]?.type)};
    assert.ok((await p.evaluate(()=>performance.timeOrigin))!==homeDoc);
    assert.equal(row.reload.type,'reload');
    assert.deepEqual(row.reload.saved,row.savedAfter);
    for(const k of ['hidden','listHidden','href','remaining']) assert.deepEqual(row.reload.card[k],row.cardAfter[k]);
    if(scenario==='dismiss-two') {
      const cta=await reachFallbackAfterReload(p);
      assert.equal(cta.href,row.cardAfter.href);
      row.activated=await follow(p,base,row.cardAfter.href);
    }
  } else if(!empty) {
    assert.equal((await state(p)).target,CTA);
    row.activated=await follow(p,base,row.cardBefore.href);
  }
  const paths=[...row.reads.map(x=>x.route),'/',...(dismiss?['/']:[]),...(row.activated?[row.activated.url.split('#')[0]]:[])];
  assert.deepEqual(row.responses,paths.map(path=>({path,status:200})));
}

const {server,base}=await serve();
let browser;
const results=[], pins=new Set();
try {
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const spec of cases) {
    const row={...spec,responses:[],errors:[],emergencyUnlocks:0}; results.push(row);
    const ctx=await browser.newContext({viewport:row.viewport,colorScheme:'light',reducedMotion:row.motion,serviceWorkers:'block'});
    ctx.setDefaultTimeout(8500);
    try {
      await ctx.addInitScript(observeFocus);
      await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
      ctx.on('weberror',e=>row.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('console',m=>{if(m.type()==='warning'&&m.text().startsWith('[SiteUtils] Emergency unlock')) row.emergencyUnlocks++;});
      ctx.on('requestfailed',r=>{
        const u=new URL(r.url()), why=r.failure()?.errorText;
        if(u.origin===base&&why!=='net::ERR_ABORTED') row.errors.push(['request',u.pathname,why]);
      });
      ctx.on('response',r=>{
        const u=new URL(r.url()); if(u.origin!==base)return;
        const type=r.request().resourceType(), status=r.status();
        if(type==='document') row.responses.push({path:u.pathname,status});
        if(status>=400) row.errors.push(['http',u.pathname,status]);
        if(r.ok()&&(['document','script','stylesheet','font'].includes(type)
            || /^\/data\/glossary(?:-policy)?\.json$/u.test(u.pathname))) {
          let rel=u.pathname.slice(1).replace(/\/*$/u,'');
          if(type==='document'&&!rel.endsWith('.html')) rel=rel?rel+'/index.html':'index.html';
          pins.add(rel);
        }
      });
      await exercise(await ctx.newPage(),base,row);
      assert.deepEqual(row.errors,[]);
      assert.equal(ctx.pages().length,1);
      row.ok=true;
      const v=row.entry.at(-1);
      console.log('OK',row.id,`${v.target} top=${v.top} y=${v.scrollY} hit=${v.hit} lock=${v.locked}`,`dwell=${row.heroTermDwellMs}ms dismissed=${row.dismissal?.at(-1).target||'-'} next=${row.next?.target||'-'}`);
    } catch(e) {row.ok=false;row.error=e.stack?.replaceAll(base,'LOCAL')??String(e);console.error('FAIL',row.id,row.error);}
    finally {await ctx.close();}
  }
  const digest=f=>createHash('sha256').update(fs.readFileSync(path.join(product,'dist',f))).digest('hex');
  const w={anchor,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    method:'Real Tab/Shift+Tab/Escape/Enter; fresh native progress records; passive observation of focus, geometry, and scroll/overlay diagnostics.',
    distSha256:Object.fromEntries([...pins].sort().map(f=>[f,digest(f)])),results};
  fs.writeFileSync(path.join(out,'resume-focus-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${results.filter(r=>r.ok).length}/${results.length} measured, ${pins.size} dist pins`);
  if(results.some(r=>!r.ok)) process.exitCode=1;
} finally {await browser?.close();await new Promise(r=>server.close(r));}
