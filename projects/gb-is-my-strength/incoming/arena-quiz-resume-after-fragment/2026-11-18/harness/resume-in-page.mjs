// Same authored destination with and without a URL fragment, starting with an
// already visible resume toast. All writes/moves come from Product UI actions.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {keyAction} from './quiz-keyboard.mjs';

const [pArg,oArg,executablePath,filter]=process.argv.slice(2);
assert.ok(pArg&&oArg&&executablePath,'node resume-in-page.mjs PRODUCT FRESH_OUT CHROMIUM [id-regexp|quiz|quiz-keys[-1|-2]|quiz-focus[-press|-timer]]');
const P=path.resolve(pArg),dist=path.join(P,'dist'),out=path.resolve(oArg);
const req=createRequire(path.join(P,'package.json')),{chromium}=req('playwright');
const {serve}=await import(pathToFileURL(path.join(P,'scripts/lib/a04-contract.mjs')));
const anchor='9edef94ece08012223c1364bec7ddcd561cf5713';
const TO='/articles/dzhon-gill-chast-2-uchenyi/', FROM='/articles/dzhon-gill-chast-1-chelovek/';
const A='sec-canticles', B='sec-hebrew', QUIZ='gill.scholar.canticles';
const KEY='gb:reader-state:v1:gb-strength:'+TO.slice(0,-1);
const ACK='gb:reader-resume-offered:v1:gb-strength:'+TO.slice(0,-1);
const arms=filter==='quiz'?['quiz']:['plain','toc','outline'];
const focusMode=/^quiz-focus(?:-(?:press|timer))?$/u.test(filter??'');
const keysMode=focusMode||/^quiz-keys(?:-[12])?$/u.test(filter??'');
const jobs=(focusMode?['press','timer'].map(dismiss=>({arm:'quiz-focus',dismiss,width:390,height:844,id:'quiz-focus-'+dismiss}))
  :keysMode?[1,2].map(i=>({arm:'quiz-keys',width:390,height:844,id:'quiz-keys-'+i}))
  :[390,1440].flatMap(width=>arms.map(arm=>({arm,width,height:width===390?844:900,id:arm+'-'+width}))))
  .filter(j=>!filter||new RegExp(filter,'u').test(j.id));
const quizArm=r=>r.arm==='quiz'||r.arm==='quiz-keys'||r.arm==='quiz-focus';
assert.ok(jobs.length);fs.mkdirSync(out,{recursive:true});assert.equal(fs.readdirSync(out).length,0,'fresh output required');
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const l=(p,s)=>p.locator(s), norm=x=>String(x??'').replace(/\s+/gu,' ').trim();
const shown=b=>b?.inView&&b.hit;
const showTimes={offerBy:3800,settle:1120,actByMount:5900};
const shot=(p,r,stage)=>p.screenshot({path:path.join(out,`${r.id}-${stage}.png`),animations:'disabled'});
const {base,server}=await serve();

function observe({a,b,key,ack,to,from,keysMode,focusMode}){
  const q=s=>document.querySelector(s), id=s=>document.getElementById(s);
  const norm=s=>String(s??'').replace(/\s+/gu,' ').trim();
  const name=e=>e?.id||e?.classList?.[0]||e?.tagName||null;
  const href=e=>e?.hasAttribute('href')?new URL(e.href).pathname+new URL(e.href).hash:null;
  const box=e=>{
    if(!e)return null;
    const r=e.getBoundingClientRect(),x=(r.left+r.right)/2,y=(r.top+r.bottom)/2;
    const node=document.elementFromPoint(x,y);
    return {top:Math.round(r.top*100)/100,center:[x,y],inView:r.width>0&&r.height>0&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight,
      hit:e.contains(node),topNode:name(node)};
  };
  const point=s=>{const e=id(s);return e?{id:s,text:norm(e.textContent),...box(e)}:null;};
  const stamp=()=>({doc:performance.timeOrigin,ageMs:Math.round(performance.now()),path:location.pathname,hash:location.hash,
    y:Math.round(scrollY),history:history.length,match:q(':target')?.id??null,focus:name(document.activeElement)});
  const saved=()=>JSON.parse(localStorage.getItem(key)??'null');
  const transitions=[],scrolls=[];
  let phase='absent';
  new MutationObserver(()=>{
    const t=q('.gbs2-resume'),next=t?(t.classList.contains('gbs2-on')?'on':'off'):'absent';
    if(next!==phase){phase=next;transitions.push({phase,...stamp()});}
  }).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  addEventListener('scroll',()=>{scrolls.push([Math.round(performance.now()),Math.round(scrollY)]);},{passive:true});
  const send=(kind,x)=>console.debug('GB_INPAGE '+JSON.stringify({kind,...stamp(),...x}));
  for(const k of ['pageshow','hashchange','popstate'])addEventListener(k,e=>send(k,{trusted:e.isTrusted,persisted:e.persisted??null}));
  addEventListener('wheel',e=>send('wheel',{trusted:e.isTrusted,deltaY:e.deltaY,deltaMode:e.deltaMode}),{passive:true,capture:true});
  function focusRecord(el=document.activeElement){
    return {name:name(el),tag:el?.tagName??null,body:el===document.body,
      label:el?.getAttribute('aria-label')||(/^(A|BUTTON|H[1-6])$/u.test(el?.tagName??'')?norm(el.textContent).slice(0,180):null),
      href:el?.hasAttribute('href')?href(el):null,inMain:!!el?.closest('main'),visible:el===document.body?null:box(el)};
  }
  if(focusMode){
    const chapter=()=>location.hash==='#'+b&&!q('#gillLearningOverlay.is-open');
    addEventListener('keydown',e=>{
      if(e.key==='Tab'&&chapter())send('after-source-tab',{trusted:e.isTrusted,shift:e.shiftKey,
        active:focusRecord(),toastPhase:phase});
    },{capture:true,passive:true});
    addEventListener('focusin',e=>{
      if(chapter())send('after-source-focus',{trusted:e.isTrusted,active:focusRecord(e.target),toastPhase:phase});
    },{capture:true,passive:true});
  }
  function read(chosen=b){
    const t=q('.gbs2-resume'),s=q('#glsQuizSource'),verdict=q('#glsQuizVerdict');
    return {...stamp(),nav:performance.getEntriesByType('navigation').at(-1)?.type??null,
      ...(focusMode?{active:focusRecord(),pageFocus:document.hasFocus()}:{}),
      saved:saved(),ack:sessionStorage.getItem(ack),A:point(a),B:point(chosen??b),
      live:window.GBReaderState?.getActiveSection?.()??null,line:window.GBReaderState?.getReadingLine?.()??null,
      toast:t?{on:t.classList.contains('gbs2-on'),label:norm(t.querySelector('span')?.textContent),go:box(t.querySelector('.gbs2-resume-go'))}:null,
      legacy:!!q('#bookmarkToast.show'),overlays:[...document.querySelectorAll('.toc-overlay.is-open,.gill-settings-overlay.is-open,.cp-backdrop.is-open')].map(name),
      locked:getComputedStyle(document.body).position==='fixed',transitions:transitions.slice(),scrolls:scrolls.slice(),
      quiz:s?{q:norm(q('#glsQuizQuestion')?.textContent),verdict:[norm(verdict?.textContent),verdict?.hidden??null],
        source:[href(s),s.hidden],progress:norm(q('#glsQuizStreak')?.textContent),options:[...document.querySelectorAll('#glsQuizOptions button')].map(el=>[norm(el.textContent),el.disabled,el.className])}:null};
  }
  const quizAction=el=>el.id==='glsQuizSource'?'quiz-source':el.id==='glsQuizNext'?'quiz-next':
    el.matches('#glsQuizConfRow button')?'quiz-confidence':el.matches('#glsQuizOptions button')?'quiz-answer':null;
  if(keysMode)addEventListener('keydown',e=>{
    const el=e.target;
    if(e.key!=='Enter'||!el?.matches)return;
    const action=quizAction(el);
    if(action)send('quiz-keydown',{action,key:e.key,trusted:e.isTrusted,toastPhase:phase,
      question:norm(q('#glsQuizQuestion')?.textContent),focusIsTarget:el===document.activeElement});
  },{capture:true,passive:true});
  document.addEventListener('click',e=>{
    const el=e.target?.closest?.('button,a');if(!el)return;
    const link=href(el);let action;
    if(el.matches('.gbs2-resume-go'))action='continue';
    else if(el.id==='glsQuizSource')action='quiz-source';
    else if(keysMode&&quizAction(el))action=quizAction(el);
    else if(location.pathname===from&&link===to)action='entry';
    else if(link===to+'#'+b){
      if(el.matches('[data-outline-link]'))action='outline';
      else if(el.matches('.gbs2-toc a'))action='rail';
      else if(el.matches('#partTocOverlay a.gbat-sub'))action='sheet';
    }
    if(action){
      send('click',{action,link,trusted:e.isTrusted,detail:e.detail,button:e.button,hit:box(el)?.hit??false,
        toastPhase:phase,saved:saved(),label:norm(el.textContent),...(keysMode&&action.startsWith('quiz-')?{
        question:norm(q('#glsQuizQuestion')?.textContent),focusIsTarget:el===document.activeElement,
      }:{})});
    }
  },{capture:true,passive:true});
  window.__gbInPage={read};
}
const state=(p,section=null)=>p.evaluate(s=>__gbInPage.read(s),section);
async function until(p,fn,arg=null,timeout=6000){await p.waitForFunction(fn,arg,{timeout});return state(p);}
async function goto(p,route){const res=await p.goto(base+route,{waitUntil:'load'});assert.equal(res.status(),200);assert.equal(res.headers()['cache-control'],'no-store');}
async function learning(p,tab){
  const gear=await l(p,'#railSettingsBtn').isVisible()?'#railSettingsBtn':'#mobSettingsBtn';
  await l(p,gear).click();await l(p,'#mobLearningBtn').click();await l(p,'#gillLearningOverlay.is-open').waitFor();await l(p,tab).click();
}
async function saveFromQuiz(p,r){
  await goto(p,TO);await p.evaluate(()=>document.fonts.ready.then(()=>true));
  const initial=await state(p);assert.equal(initial.saved,null);assert.equal(initial.ack,null);
  await learning(p,'#tabQuiz');const pool=JSON.parse(await l(p,'#gillQuizData').getAttribute('data-quiz'));
  let selected=false;
  for(let i=0;i<pool.length;i++){
    const q=norm(await l(p,'#glsQuizQuestion').innerText()),x=pool.find(a=>norm(a.question)===q);assert.ok(x);
    await l(p,'#glsQuizConfRow [data-conf=sure]').click();
    await l(p,'#glsQuizOptions').getByRole('button',{name:x.answers[(x.correctIndex+1)%x.answers.length],exact:true}).click();
    if(x.id!==QUIZ){await l(p,'#glsQuizNext').click();continue;}
    selected=true;const answered=await state(p);assert.match(answered.quiz.verdict[0],/^Неверно/u);
    assert.deepEqual(answered.quiz.source,[TO+'#'+A,false]);
    await l(p,'#glsQuizSource').click();r.source=await until(p,id=>{
      const s=__gbInPage.read();return s.hash==='#'+id&&s.focus===id&&s.A?.hit&&!s.overlays.length;
    },A);
    assert.equal(r.source.doc,initial.doc);assert.equal(r.source.history,initial.history+1);
    assert.deepEqual(r.source.quiz,answered.quiz);break;
  }
  assert.ok(selected);
  const dy=Math.ceil(r.source.A.top-300);assert.ok(dy>0);r.wheelDelta=dy;
  await p.mouse.move(...r.source.A.center);await p.mouse.wheel(0,dy);
  r.produced=await until(p,({a})=>{
    const s=__gbInPage.read();return s.A?.hit&&s.A.top>250&&s.A.top<s.line&&s.saved?.sectionId===a&&s.saved.scrollY===s.y;
  },{a:A});
  assert.ok(r.produced.saved.progress>=8&&r.produced.saved.progress<=92&&!r.produced.saved.completed);
  assert.equal(r.produced.saved.dismissedAt,0);
}
async function reenter(p,r){
  await goto(p,FROM);r.origin=await state(p);
  assert.notEqual(r.origin.doc,r.produced.doc);assert.equal(r.origin.ack,null);
  assert.ok(r.origin.saved.savedAt>=r.produced.saved.savedAt);
  assert.deepEqual({...r.origin.saved,savedAt:r.produced.saved.savedAt},r.produced.saved);
  let link;
  if(r.width===390){
    await l(p,'#mobPartTocBtn').click();await l(p,'#partTocOverlay.is-open').waitFor();
    await l(p,'#partTocOverlay button[aria-controls="gbat-part-region-part2"]').click();
    link=l(p,`#gbat-part-region-part2 a.gbat-go[href="${TO}"]`);
  }else link=l(p,`.gill-card__cta[href="${TO}"]`);
  assert.equal(await link.count(),1);
  await Promise.all([p.waitForURL(base+TO,{waitUntil:'load'}),link.click()]);
  await p.evaluate(()=>document.fonts.ready.then(()=>true));
  r.offer=await until(p,limit=>{const s=__gbInPage.read();return (s.toast?.on&&s.toast.go.hit&&s.toast.go.inView)||s.ageMs>=limit;},showTimes.offerBy);
  assert.notEqual(r.offer.doc,r.origin.doc);assert.notEqual(r.offer.doc,r.produced.doc);
  assert.equal(r.offer.path,TO);assert.equal(r.offer.hash,'');assert.equal(r.offer.history,r.origin.history+1);
  assert.equal(r.offer.match,null);assert.equal(r.offer.nav,'navigate');assert.equal(r.offer.y,0);
  assert.deepEqual(r.offer.saved,r.origin.saved);assert.ok(!r.offer.legacy&&!r.offer.locked&&!r.offer.overlays.length);
  assert.ok(!shown(r.offer.A)&&!shown(r.offer.B));
  assert.ok(r.offer.toast?.on&&shown(r.offer.toast.go),'plain return did not show a hittable toast: '+JSON.stringify(r.offer.transitions));
  assert.equal(r.offer.ack,'1');
}
async function changeSection(p,r){
  const native=r.arm==='toc';let link;
  if(native&&r.width===390){
    await l(p,'#mobPartTocBtn').click();await l(p,'#partTocOverlay.is-open').waitFor();
    link=l(p,`#gbat-part-region-part2 a.gbat-sub[href="#${B}"]`);
  }else if(native)link=l(p,`.gbs2-toc a[href="#${B}"]`);
  else{
    await learning(p,'#tabOutline');link=l(p,`#panelOutline [data-outline-link][href="#${B}"]`);
  }
  assert.equal(await link.count(),1);r.link={label:norm(await link.innerText()),href:await link.getAttribute('href')};
  await link.click();
  r.landed=await until(p,hash=>{
    const s=__gbInPage.read();return s.hash===hash&&s.B?.hit&&s.B.inView&&!s.overlays.length&&!s.locked;
  },native?'#'+B:'',2700);
  assert.equal(r.landed.doc,r.offer.doc);assert.equal(r.landed.path,TO);
  assert.equal(r.landed.history,r.offer.history+(native?1:0));assert.equal(r.landed.match,native?B:null);
  assert.deepEqual(r.landed.quiz,r.offer.quiz);assert.ok(shown(r.landed.B)&&!shown(r.landed.A));
  // Allow the ordinary ReaderState debounce to run. This is not a forced
  // write, and the toast remains within its ordinary 6.5s lifetime.
  await p.waitForTimeout(showTimes.settle);
}
// Timed follow-up: choose the first authored in-article source other than A.
// Read the hit point or let Playwright scroll a clipped sheet control into
// view, then send a real pointer click. No shuffle, timer or runtime patch.
async function pointer(p,r,selector,label=null){
  const probe=()=>p.evaluate(({selector,label})=>{
    const nodes=[...document.querySelectorAll(selector)];
    const el=label===null?nodes[0]:nodes.find(x=>x.textContent.replace(/\s+/gu,' ').trim()===label);
    if(!el||el.disabled)return {};
    const b=el.getBoundingClientRect(), x=(b.left+b.right)/2, y=(b.top+b.bottom)/2;
    const hit=(x,y)=>document.elementFromPoint(x,y);
    const covered=hit(x,y)?.closest('.gbs2-resume.gbs2-on');
    const rect=covered?.getBoundingClientRect(), body=el.closest('.toc-sheet__body'), panel=body?.getBoundingClientRect();
    const vw=innerWidth, vh=innerHeight;
    const points=[[x,y],...[.2,.8].flatMap(i=>[.25,.75].map(j=>[b.x+b.width*i,b.y+b.height*j]))];
    const point=points.find(([x,y])=>x>=0&&x<vw&&y>=0&&y<vh&&el.contains(hit(x,y)))??null;
    const scrollTop=body?.scrollTop??null;
    const wheelY=panel&&rect?Math.min(rect.top-32,panel.bottom-32,Math.max(panel.top+18,vh*.52)):null;
    const wheelXY=wheelY!==null&&body.contains(hit(vw/2,wheelY))?[vw/2,wheelY]:null;
    return {point,center:[x,y],covered:!!covered,blocker:hit(x,y)?.classList?.[0]??null,scrollTop,
      wheelXY,delta:wheelXY?Math.min(body.scrollHeight-body.clientHeight-scrollTop,Math.max(80,Math.ceil(y-rect.top+68))):0};
  },{selector,label});
  const awaitAutoDismiss=async(entry)=>{
    // No forced click. Use natural auto-dismiss as a same-question control.
    entry.stalled=await state(p);
    await p.waitForFunction(()=>!document.querySelector('.gbs2-resume'),null,{timeout:7400});
    const current=await probe();entry.afterTimeout=current;entry.cleared=await state(p);return current;
  };
  let hit=await probe();
  if(hit.covered){
    const entry={selector,label,before:hit};r.pointerInterference.push(entry);
    if(!hit.point&&hit.wheelXY&&hit.delta>0){
      await p.mouse.move(...hit.wheelXY);await p.mouse.wheel(0,hit.delta);
      // Read after the real scroll event/frame, never assign scrollTop.
      await p.waitForTimeout(95);hit=await probe();entry.afterWheel=hit;
    }
    if(hit.covered&&!hit.point)hit=await awaitAutoDismiss(entry);
  }
  if(hit.point){await p.mouse.click(...hit.point);return;}
  const locator=label===null?l(p,selector):l(p,'#glsQuizOptions').getByRole('button',{name:label,exact:true});
  try{await locator.click({timeout:1100});}
  catch(error){
    // Scroll-into-view can move a clipped control under the toast. Only
    // classify it as an overlap when a passive sample actually finds one.
    hit=await probe();if(!hit.covered||hit.point)throw error;
    const entry={selector,label,before:hit,afterScrollIntoViewAttempt:true};r.pointerInterference.push(entry);
    hit=await awaitAutoDismiss(entry);
    if(hit.point)await p.mouse.click(...hit.point);
    else await locator.click({timeout:1100});
  }
}
async function changeSectionFromQuiz(p,r){
  await learning(p,'#tabQuiz');const pool=JSON.parse(await l(p,'#gillQuizData').getAttribute('data-quiz'));
  r.questionWalk=[];r.pointerInterference=[];
  const keys=r.arm==='quiz-keys'||r.arm==='quiz-focus';
  if(keys)r.keyActions=[];
  const act=(step,selector,label,question,ordinal)=>keys
    ?keyAction(p,r,{step,selector,label,question,ordinal})
    :pointer(p,r,selector,label);
  for(let i=0;i<pool.length;i++){
    const q=norm(await l(p,'#glsQuizQuestion').textContent()),x=pool.find(e=>norm(e.question)===q);assert.ok(x);
    const u=new URL(x.sourceHref,base+TO), id=u.hash.slice(1);
    const target=u.pathname===TO&&id&&id!==A&&(r.arm!=='quiz-focus'||id===B);
    r.questionWalk.push(x.id);
    await act('confidence','#glsQuizConfRow [data-conf=sure]',null,x.id,i+1);
    await act('answer','#glsQuizOptions button',norm(x.answers[(x.correctIndex+1)%x.answers.length]),x.id,i+1);
    if(!target){await act('next','#glsQuizNext',null,x.id,i+1);continue;}
    r.target=id;r.answered=await state(p,id);
    assert.equal(r.answered.hash,'');assert.equal(r.answered.doc,r.offer.doc);
    assert.equal(r.answered.history,r.offer.history);
    assert.match(r.answered.quiz.verdict[0],/^Неверно/u);
    assert.deepEqual(r.answered.quiz.source,[TO+'#'+id,false]);
    r.link={href:await l(p,'#glsQuizSource').getAttribute('href'),label:norm(await l(p,'#glsQuizSource').textContent())};
    await act('source','#glsQuizSource',null,x.id,i+1);
    await p.waitForFunction(target=>{
      const s=__gbInPage.read(target);return s.hash==='#'+target&&s.focus===target&&s.B?.inView&&s.B.hit&&!s.overlays.length&&!s.locked;
    },id,{timeout:2000});
    r.landed=await state(p,id);
    assert.equal(r.landed.doc,r.offer.doc);assert.equal(r.landed.path,TO);assert.equal(r.landed.history,r.offer.history+1);
    assert.deepEqual(r.landed.quiz,r.answered.quiz);assert.ok(!shown(r.landed.A)&&shown(r.landed.B));
    await p.waitForTimeout(110);
    return;
  }
  throw Error('no authored in-page source other than the saved section');
}
async function measureNextTab(p,r){
  r.before=await state(p,r.target);
  const mount=r.before.transitions[0];
  const eligible=r.before.toast?.on&&shown(r.before.toast.go);
  const inTime=eligible&&r.before.ageMs-mount.ageMs<showTimes.actByMount;
  if(r.dismiss==='press'&&inTime){
    await l(p,'.gbs2-resume.gbs2-on .gbs2-resume-go').click({timeout:950});
    r.dismissal='pointer-cta';
  }else r.dismissal=eligible&&r.dismiss==='timer'?'timer-control':'out-of-offer-window';
  await p.waitForFunction(()=>!document.querySelector('.gbs2-resume'),null,{timeout:r.dismissal==='pointer-cta'?1450:7800});
  // Use the same post-removal observation window in both arms. No input
  // between activation/expiry and these first two forward Tab presses.
  await p.waitForTimeout(125);
  r.after=await state(p,r.target);
  r.tabs=[];
  for(let i=0;i<2;i++){
    const before=i?r.tabs[i-1].after:r.after;
    await p.keyboard.press('Tab');
    await p.waitForTimeout(125);
    r.tabs.push({before,after:await state(p,r.target)});
  }
  r.outcome=r.dismissal;
  console.log('FOCUS',r.id,r.before.focus+'→'+r.after.focus+'→'+r.tabs.map(t=>t.after.focus).join('→'),
    'Y='+[r.before.y,r.after.y,...r.tabs.map(t=>t.after.y)].join('→'));
}
async function exercise(p,r){
  await saveFromQuiz(p,r);await reenter(p,r);
  if(quizArm(r))await changeSectionFromQuiz(p,r);
  else if(r.arm!=='plain')await changeSection(p,r);
  if(r.arm==='quiz-focus')return measureNextTab(p,r);
  // Preserve the natural timeout instead of retrying a late shuffle position.
  if(quizArm(r)){
    const candidate=await state(p,r.target), mount=candidate.transitions[0];
    if(!candidate.toast?.on||!shown(candidate.toast.go)||candidate.ageMs-mount.ageMs>=showTimes.actByMount){
      r.before=candidate;
      await p.waitForFunction(()=>!document.querySelector('.gbs2-resume'),null,{timeout:7800});
      r.after=await state(p,r.target);r.outcome='no-action-in-offer-window';return;
    }
  }
  if(r.arm!=='plain'&&r.width===390&&!quizArm(r))await shot(p,r,'before');
  r.before=await state(p,r.target);
  assert.ok(r.before.toast?.on&&shown(r.before.toast.go),'toast no longer actionable: '+JSON.stringify(r.before.transitions));
  const mount=r.before.transitions.find(e=>e.phase==='off');
  assert.ok(mount&&r.before.ageMs-mount.ageMs<showTimes.actByMount,'missed click window');
  assert.deepEqual(r.before.overlays,[]);assert.ok(!r.before.locked);
  assert.equal(r.before.toast.label,r.offer.toast.label);
  await l(p,'.gbs2-resume.gbs2-on .gbs2-resume-go').click({timeout:950});
  await p.waitForFunction(()=>!document.querySelector('.gbs2-resume'),null,{timeout:1450});
  await p.waitForTimeout(1000);
  r.after=await state(p,r.target);
  for(const k of ['doc','path','hash','history','match','quiz','ack'])assert.deepEqual(r.after[k],r.before[k],k);
  assert.equal(r.after.toast,null);assert.ok(!r.after.legacy&&!r.after.locked&&!r.after.overlays.length);
  const clicks=r.events.filter(e=>e.kind==='click'&&e.action==='continue');assert.equal(clicks.length,1);
  const [click]=clicks,[off,removed]=r.after.transitions.slice(-2);assert.ok(click.trusted&&click.hit&&click.toastPhase==='on');
  assert.equal(off.phase,'off');assert.equal(removed.phase,'absent');
  r.delays={off:off.ageMs-click.ageMs,removed:removed.ageMs-click.ageMs};
  assert.ok(r.delays.off>=0&&r.delays.off<=50&&r.delays.removed>=375&&r.delays.removed<=600);
  const scrollAfter=r.after.scrolls.filter(([ms])=>ms>=click.ageMs);
  if(r.arm==='toc'||quizArm(r)){
    assert.equal(r.after.y,click.y);assert.equal(r.before.y,click.y);assert.ok(shown(r.after.B)&&!shown(r.after.A));
    assert.deepEqual(scrollAfter,[]);r.outcome='visible-toast-click-no-return';
  }else{
    assert.ok(shown(r.after.A)&&!shown(r.after.B)&&r.after.y>1200&&r.after.y!==click.y&&scrollAfter.length);
    r.outcome='saved-heading-restored';
  }
  if(r.arm!=='plain'&&r.width===390&&!quizArm(r))await shot(p,r,'after');
}
const pins=new Set(),rows=[];let browser;
try{
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const j of jobs){
    const r={...j,docs:[],events:[],errors:[],searchAssets:[]};rows.push(r);
    const ctx=await browser.newContext({viewport:{width:r.width,height:r.height},colorScheme:'light',reducedMotion:'reduce',serviceWorkers:'block'});
    try{
      ctx.setDefaultTimeout(5200);
      await ctx.addInitScript(observe,{a:A,b:B,key:KEY,ack:ACK,to:TO,from:FROM,keysMode,focusMode});
      await ctx.route('**/*',route=>{const u=new URL(route.request().url());return u.origin===base||['blob:','data:'].includes(u.protocol)?route.continue():route.abort();});
      const p=await ctx.newPage();
      p.on('console',e=>{const s=e.text();if(s.startsWith('GB_INPAGE '))r.events.push(JSON.parse(s.slice(10)));
        if(s.includes('Emergency unlock'))r.errors.push(['emergency',s]);});
      p.on('pageerror',e=>r.errors.push(['pageerror',e.message.replaceAll(base,'LOCAL')]));
      p.on('requestfailed',q=>{const u=new URL(q.url()),err=q.failure()?.errorText;if(u.origin===base&&err!=='net::ERR_ABORTED')r.errors.push(['request',u.pathname,err]);});
      p.on('response',res=>{
        const u=new URL(res.url()),q=res.request(),status=res.status(),t=q.resourceType(),f=u.pathname;if(u.origin!==base)return;
        if(t==='document')r.docs.push([f,status,res.headers()['cache-control']]);
        if(f.startsWith('/pagefind/')||f==='/data/scripture-search-index.json')r.searchAssets.push([f,status]);
        if(status>=400)r.errors.push(['http',q.method(),f,status]);
        if(res.ok()&&q.method()==='GET'&&(['document','script','stylesheet','font'].includes(t)||f.startsWith('/data/')&&f.endsWith('.json'))){
          let name=f.slice(1).replace(/\/*$/u,'');if(t==='document'&&!name.endsWith('.html'))name=name?name+'/index.html':'index.html';pins.add(name);
        }
      });
      await exercise(p,r);assert.deepEqual(r.errors,[]);assert.deepEqual(r.searchAssets,[]);assert.equal(ctx.pages().length,1);
      r.ok=true;console.log('OK',r.id,'hash='+r.after.hash,'Y='+r.before.y+'→'+r.after.y,'stored='+r.offer.saved.sectionId+'→'+r.before.saved.sectionId+'→'+r.after.saved.sectionId,r.outcome);
    }catch(e){r.ok=false;r.error=e.stack?.replaceAll(base,'LOCAL')??String(e);r.failedAt=await state(ctx.pages()[0]).catch(()=>null);console.error('FAIL',r.id,r.error);}
    finally{await ctx.close();}
  }
  const w={anchor,node:process.versions.node,playwright:req('playwright/package.json').version,chromium:browser.version(),
    method:{viewport:'light/reduced-motion',cache:'no-store',sw:'block',outsideOrigin:'blocked',timing:showTimes},
    distSha256:Object.fromEntries([...pins].sort().map(f=>[f,sha(path.join(dist,f))])),rows};
  fs.writeFileSync(path.join(out,'resume-in-page-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${rows.filter(r=>r.ok).length}/${rows.length} measured; ${pins.size} dist pins`);
  if(rows.some(r=>!r.ok))process.exitCode=1;
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
