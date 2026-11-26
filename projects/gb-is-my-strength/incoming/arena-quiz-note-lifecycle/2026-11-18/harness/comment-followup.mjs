// Real authored quiz and real two-tab Library edits. No seeded records, storage
// events, downloads, or edits to the Product runtime. All records are synthetic.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const [pArg,oArg,executablePath,filter]=process.argv.slice(2);
assert.ok(pArg&&oArg&&executablePath,'node comment-followup.mjs PRODUCT FRESH_OUT CHROMIUM [id-regexp]');
const P=path.resolve(pArg),dist=path.join(P,'dist'),out=path.resolve(oArg);
const req=createRequire(path.join(P,'package.json')),{chromium}=req('playwright');
const {serve}=await import(pathToFileURL(path.join(P,'scripts/lib/a04-contract.mjs')));
const anchor='9edef94ece08012223c1364bec7ddcd561cf5713';
const A='/articles/dzhon-gill-chast-2-uchenyi/', B='/articles/otstuplenie-chto-govorit-bibliya/';
const SEC='sec-systematics', Q='gill.scholar.systematics', NOTE_KEY='gb-reader-notes-v1';
const KEY='Это первая систематическая сумма богословия, написанная баптистом';
const NEEDLE='Называть его первым трудом такого рода среди всех баптистов было бы неточно';
const MASK='http://local.invalid';
const words={base:'Исходная заметка: сверить формулировку с абзацем.',
  mine:'Правка из вкладки А: оставить оговорку об историческом приоритете.\nНе сокращать цитату.',
  peer:'Правка из вкладки Б: имя Грэнтема и дата 1678.\nСохранить ссылку.',
  second:'Вторая заметка: отличать справку от ключа вопроса.',
  peerSecond:'Правка второй заметки из вкладки Б.\nПроверить справку отдельно.'};
const jobs=[390,1440].flatMap(width=>['same','delete','distinct'].map(arm=>({arm,width,height:width===390?844:900,id:arm+'-'+width})))
  .filter(j=>!filter||new RegExp(filter,'u').test(j.id));
assert.ok(jobs.length);fs.mkdirSync(out,{recursive:true});assert.equal(fs.readdirSync(out).length,0,'fresh output required');
const sha=x=>createHash('sha256').update(x).digest('hex');
const L=(p,s)=>p.locator(s), norm=x=>String(x??'').replace(/\s+/gu,' ').trim();
const editor='#gb-hl-editor', field='#gb-hl-note-text';
const submit=editor+' button[type=submit]', cards='#gb-hl-list .gb-hl-item[data-type=note]';
const note=(p,id)=>L(p,cards+'[data-id="'+id+'"]');
const shot=(p,r,k)=>p.screenshot({path:path.join(out,r.id+'-'+k+'.png'),animations:'disabled'});
const {base,server}=await serve();

function observe({noteKey,section,needle,mask,key}){
  const rename=x=>x.replaceAll(location.origin,mask);
  const parse=x=>JSON.parse(rename(x||'[]'));
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const text=e=>String(e?.textContent??'').replace(/\s+/gu,' ').trim();
  const name=e=>e?.id||e?.classList?.[0]||e?.tagName||null;
  const loc=(el)=>el?.hasAttribute('href')?new URL(el.href).pathname+new URL(el.href).hash:null;
  const box=el=>{
    if(!el)return null;
    const r=el.getBoundingClientRect(),x=r.x+r.width/2,y=Math.max(r.top,0)+Math.min(r.bottom,innerHeight);
    const yc=y/2, node=document.elementFromPoint(x,yc);
    const inView=r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
    return {top:Math.round(r.top*100)/100,bottom:Math.round(r.bottom*100)/100,inView,hit:inView&&el.contains(node),topNode:name(node)};
  };
  const stamp=()=>({doc:performance.timeOrigin,ageMs:Math.round(performance.now()),url:location.pathname+location.hash});
  const read=()=>{
    const list=q('#gb-hl-list'),field=q('#gb-hl-note-text'),editor=q('#gb-hl-editor'),status=q('#gb-hl-status');
    const h=document.getElementById(section),ps=qa('p').filter(e=>e.textContent.includes(needle));
    const source=q('#glsQuizSource'), pair=e=>[text(e),e?.hidden??null];
    return {...stamp(),nav:performance.getEntriesByType('navigation').at(-1)?.type??null,scroll:Math.round(scrollY),
      history:history.length,focus:name(document.activeElement),locks:Object.keys(window.SiteUtils?._scrollLockSources||{}).sort(),
      library:!!q('#gb-hl-backdrop.is-open'), learning:!!q('#gillLearningOverlay.is-open'),
      editor:editor?{visible:!editor.hidden&&editor.getClientRects().length>0,value:field.value,enabled:!editor.querySelector('[type=submit]').disabled}:null,
      rawNotes:parse(localStorage.getItem(noteKey)), notesKeySet:localStorage.getItem(noteKey)!==null,
      cards:qa('#gb-hl-list .gb-hl-item[data-type=note]').map(x=>({id:x.dataset.id,text:x.querySelector('.gb-hl-quote')?.textContent??null})),
      cardBoxes:qa('#gb-hl-list .gb-hl-item[data-type=note] .gb-hl-quote').map(box),
      listVisible:!!list?.getClientRects().length,empty:text(q('#gb-hl-list .gb-hl-empty-title')),
      status:status?{text:text(status),visible:status.classList.contains('is-visible'),error:status.classList.contains('is-error')}:null,
      markdownAvailable:!!q('#gb-hl-export')?.getClientRects().length, jsonMenuAvailable:!!q('#gb-hl-manage-panel')?.getClientRects().length,
      heading:h?{text:text(h),box:box(h)}:null, paragraphs:ps.map(p=>({text:text(p),box:box(p),links:[...p.querySelectorAll('a')].map(a=>[text(a),a.getAttribute('href')])})),
      quiz:source?{question:text(q('#glsQuizQuestion')),verdict:pair(q('#glsQuizVerdict')),explanation:pair(q('#glsQuizExplanation')),
        conf:text(q('#glsQuizConfRow .is-picked')),progress:text(q('#glsQuizStreak')),
        source:[text(source),source.hidden,loc(source)],options:qa('#glsQuizOptions button').map(b=>[text(b),b.disabled,b.className])}:null};
  };
  const send=(kind,row)=>console.debug('GB_COMMENT_AUDIT '+JSON.stringify({kind,...stamp(),...row}));
  addEventListener('storage',e=>{
    if(e.key===noteKey)send('storage',{trusted:e.isTrusted,source:rename(e.url),old:parse(e.oldValue),next:parse(e.newValue)});
  });
  addEventListener('pageshow',e=>send('pageshow',{persisted:e.persisted}));
  document.addEventListener('submit',e=>{
    if(e.target.id==='gb-hl-editor')send('submit',{trusted:e.isTrusted,value:q('#gb-hl-note-text').value});
  },{capture:true,passive:true});
  document.addEventListener('click',e=>{
    const x=e.target?.closest?.('button, a');if(!x)return;
    let action=null;
    if(x.matches('#glsQuizSource'))action='source';
    if(x.matches('#glsQuizOptions button')&&text(x)===key)action='answer';
    if(x.matches('#gb-hl-export'))action='markdown';
    if(x.matches('[data-research-action=export-json]'))action='backup';
    if(x.matches('[data-library-action=delete]'))action='delete';
    if(x.matches('[data-library-action=edit-note]'))action='edit';
    if(action)send('click',{action,trusted:e.isTrusted,label:text(x),href:loc(x),id:x.closest('.gb-hl-item')?.dataset.id??null});
  },{capture:true,passive:true});
  window.__gbCommentAudit={read};
}
const state=p=>p.evaluate(()=>__gbCommentAudit.read());
async function waitState(p,fn,arg){await p.waitForFunction(fn,arg);return state(p);}
const data=(p)=>p.evaluate(()=>__gbCommentAudit.read().rawNotes);
async function jump(p,path){const res=await p.goto(base+path,{waitUntil:'load'});assert.equal(res.status(),200);assert.equal(res.headers()['cache-control'],'no-store');}
async function openLearning(p,tab){
  const gear=await L(p,'#railSettingsBtn').isVisible()?'#railSettingsBtn':'#mobSettingsBtn';
  await L(p,gear).click();await L(p,'#mobLearningBtn').click();await L(p,'#gillLearningOverlay.is-open').waitFor();await L(p,tab).click();
}
async function reachQuestionAndSource(p,r){
  await jump(p,A);await p.evaluate(()=>document.fonts.ready.then(()=>true));
  const initial=await state(p);assert.deepEqual(initial.rawNotes,[]);assert.equal(initial.notesKeySet,false);
  await openLearning(p,'#tabQuiz');const pool=JSON.parse(await L(p,'#gillQuizData').getAttribute('data-quiz'));
  for(let i=0;i<pool.length;i++){
    const t=norm(await L(p,'#glsQuizQuestion').innerText()), x=pool.find(z=>norm(z.question)===t);assert.ok(x);
    await L(p,'#glsQuizConfRow [data-conf=sure]').click();
    const target=x.id===Q;
    if(target)assert.equal(x.answers[x.correctIndex],KEY);
    await L(p,'#glsQuizOptions').getByRole('button',{name:target?KEY:x.answers[0],exact:true}).click();
    if(!target){await L(p,'#glsQuizNext').click();continue;}
    const picked=await state(p);assert.match(picked.quiz.verdict[0],/^Верно/u);
    assert.match(picked.quiz.explanation[0],/первой полномасштабной/u);
    assert.deepEqual(picked.quiz.source.slice(1),[false,A+'#'+SEC]);
    if(r.id==='same-390')await shot(p,r,'qe-key');
    await L(p,'#glsQuizSource').click();
    const source=await waitState(p,({id,url})=>{
      const s=__gbCommentAudit.read();return s.url===url&&s.focus===id&&s.heading?.box.hit&&!s.learning;
    },{id:SEC,url:A+'#'+SEC});
    assert.equal(source.doc,initial.doc);assert.equal(source.history,initial.history+1);assert.deepEqual(picked.quiz,source.quiz);
    assert.equal(source.paragraphs.length,1);assert.match(source.paragraphs[0].text,/Грэнтем .*1678 году/u);
    const para=source.paragraphs[0];assert.ok(para.box.top>0);
    if(!para.box.hit){
      const delta=Math.ceil(para.box.top-180);assert.ok(delta>0);
      await p.mouse.move(r.width===390?230:850,465);await p.mouse.wheel(0,delta);
    }
    const read=await waitState(p,()=>__gbCommentAudit.read().paragraphs[0]?.box.hit);
    assert.equal(read.doc,initial.doc);assert.equal(read.url,A+'#'+SEC);assert.deepEqual(read.quiz,picked.quiz);
    r.editorial={questionId:Q,key:KEY,selected:picked,source,read};
    if(r.id==='same-390')await shot(p,r,'qe-paragraph');
    return;
  }
  throw Error('authored editorial witness not reached');
}
async function lib(p,mode='fab'){
  if(mode==='learning'){await openLearning(p,'#tabNotes');await L(p,'#manageNotesBtn').click();}
  else await L(p,'#gb-hl-fab').click();
  await L(p,'#gb-hl-backdrop.is-open').waitFor();await L(p,`${cards}, #gb-hl-list .gb-hl-empty-title`).first().waitFor({state:'attached'});
  await L(p,'#gb-hl-manage').waitFor({state:'attached'});
}
async function msg(p,re){
  const r=await waitState(p,source=>{const s=__gbCommentAudit.read().status;return s?.visible&&new RegExp(source,'u').test(s.text);},re.source);
  assert.equal(r.status.error,false);return r;
}
async function createNote(p,text){
  await L(p,'#gb-hl-new-note').click();await L(p,field).fill(text);await L(p,submit).click();
  const s=await msg(p,/^Заметка сохранена\.$/u);const item=s.rawNotes.find(x=>x.text===text);assert.ok(item&&item.id);
  assert.ok(item.savedAt>0);assert.equal(item.url,MASK+A);assert.equal(item.quoteText,'');return item;
}
async function edit(p,row,text){
  await note(p,row.id).locator('[data-library-action=edit-note]').click();
  assert.equal(await L(p,field).inputValue(),row.text);
  await L(p,field).fill(text);
  const s=await state(p);assert.ok(s.editor.visible&&s.editor.enabled);assert.equal(s.editor.value,text);return s;
}
const canonicalText=x=>x.replaceAll(base,MASK);
const markdownText=rows=>['# Моя библиотека · Господь Бог — Сила Моя','',...rows.slice().sort((a,b)=>b.savedAt-a.savedAt)
  .flatMap(x=>['## Заметка — '+x.articleTitle,'',x.text,'','Источник: '+x.url,''])].join('\n');
async function download(p,button,name){
  const [f]=await Promise.all([p.waitForEvent('download'),button.click()]);
  assert.equal(f.suggestedFilename(),name);assert.equal(await f.failure(),null);
  const buf=fs.readFileSync(await f.path()), text=new TextDecoder('utf-8',{fatal:true}).decode(buf);
  return {name,bytes:buf.length,sha256:sha(buf),text};
}
async function markdown(p,rows){
  const b=L(p,'#gb-hl-export');
  if(!rows.length){
    const abort=p.waitForEvent('download',{timeout:650}).then(d=>d.suggestedFilename(),e=>{
      if(e.name==='TimeoutError')return null;throw e;
    });
    await b.click();const s=await msg(p,/^Библиотека пуста\.$/u);assert.equal(await abort,null);
    return {name:null,notice:s.status.text};
  }
  const out=await download(p,b,'gb-moya-biblioteka.md');const text=canonicalText(out.text);assert.equal(text,markdownText(rows));
  return {...out,text,normalizedSha256:sha(text)};
}
async function backup(p,rows){
  const manage=L(p,'#gb-hl-manage');assert.equal(await manage.getAttribute('aria-expanded'),'false');
  await manage.click();const out=await download(p,L(p,'[data-research-action=export-json]'),'gb-library-backup.json');
  const body=JSON.parse(canonicalText(out.text));assert.equal(body.version,3);assert.equal(body.format,'gospod-bog-reader-library');
  assert.ok(Number.isFinite(Date.parse(body.exportedAt)));
  assert.deepEqual(body.data,{quotes:[],notes:rows,favorites:[],tags:{},reading:{},revisit:{}});
  await msg(p,/^Полная резервная копия сохранена\.$/u);await manage.click();
  return {name:out.name,bytes:out.bytes,sha256:out.sha256,body,normalizedDataSha256:sha(JSON.stringify(body.data))};
}
async function waitNotes(p,rows,hidden=false){
  const x=await waitState(p,(expected)=>{
    const s=__gbCommentAudit.read(),ix=Object.fromEntries(s.cards.map(x=>[x.id,x.text]));
    return s.library&&s.rawNotes.length===expected.length&&s.cards.length===expected.length&&expected.every(x=>ix[x.id]===x.text&&s.rawNotes.some(n=>n.id===x.id&&n.text===x.text));
  },rows);
  assert.deepEqual(x.rawNotes,rows);assert.equal(!x.listVisible,hidden);
  assert.equal(x.cardBoxes.length,rows.length);
  for(const b of x.cardBoxes)assert.equal(b.inView&&!hidden,!hidden);
  return x;
}
async function exportPair(p,rows){
  const md=await markdown(p,rows),json=await backup(p,rows);
  assert.deepEqual(await data(p),rows);return {md,json};
}
function detachedCopy(p,rows){return rows.map(x=>x.id===p.id?{...x,text:p.text}:x);}
async function current(p,rows){const s=await waitNotes(p,rows), files=await exportPair(p,rows);return {s,files};}
async function reload(p,rows){
  const old=await state(p), resp=await p.reload({waitUntil:'load'});assert.equal(resp.status(),200);
  assert.equal(resp.headers()['cache-control'],'no-store');
  const page=await state(p);assert.notEqual(page.doc,old.doc);assert.equal(page.nav,'reload');assert.equal(page.url,old.url);
  assert.equal(page.history,old.history);assert.equal(page.library,false);
  await lib(p);return {before:old, ...await current(p,rows)};
}
async function exercise(a,b,r){
  const two=r.arm==='distinct',del=r.arm==='delete';
  await reachQuestionAndSource(a,r);await lib(a,'learning');
  const first=await createNote(a,words.base), second=two?await createNote(a,words.second):null;
  if(two)assert.ok(first.id!==second.id&&first.url===second.url&&first.articleTitle===second.articleTitle);
  r.keys={first:first.id,second:second?.id??null};
  const initial=two?[second,first]:[first];assert.deepEqual(await data(a),initial);
  r.openA=await edit(a,first,words.mine);
  await jump(b,B);await lib(b);r.openB=await waitNotes(b,initial);
  assert.notEqual(r.openB.doc,r.openA.doc);
  const peer=two?{...second,text:words.peerSecond}:{...first,text:words.peer};
  if(del){
    await note(b,first.id).locator('[data-library-action=delete]').click();
    r.peerAction=await msg(b,/^Запись удалена/u);
  }else{
    r.draftB=await edit(b,two?second:first,peer.text);await L(b,submit).click();
    r.peerAction=await msg(b,/^Заметка обновлена\.$/u);
  }
  const before=del?[]:detachedCopy(peer,initial);
  r.before={a:await waitNotes(a,before,true),b:await waitNotes(b,before)};
  assert.ok(r.before.a.editor.visible&&r.before.a.editor.enabled);assert.equal(r.before.a.editor.value,words.mine);
  assert.equal(r.before.a.status.error,false);
  if(r.id==='same-390')await shot(b,r,'peer-saved');
  // Markdown stays available while A still edits. JSON menu does not.
  assert.ok(r.before.a.markdownAvailable&&!r.before.a.jsonMenuAvailable);
  r.beforeExport={aMarkdown:await markdown(a,before),b:await exportPair(b,before)};
  r.preSubmit=await waitNotes(a,before,true);assert.equal(r.preSubmit.editor.value,words.mine);
  assert.ok(r.preSubmit.editor.visible&&r.preSubmit.editor.enabled);
  if(r.id==='same-390')await shot(a,r,'stale-draft');
  await L(a,submit).click();
  r.attempt=await msg(a,/^Заметка обновлена\.$/u);assert.equal(r.attempt.editor.visible,false);
  const final=del?[]:detachedCopy({...first,text:words.mine},before);
  assert.deepEqual(r.attempt.rawNotes,final);
  if(r.id==='delete-390')await shot(a,r,'false-success');
  r.immediate={a:await current(a,final),b:await current(b,final)};
  // Reload only B. A must keep both its visible result and answered quiz.
  r.reloadB=await reload(b,final);
  r.aAfterReloadB=await waitNotes(a,final);
  assert.equal(r.aAfterReloadB.doc,r.openA.doc);assert.equal(r.aAfterReloadB.url,r.openA.url);
  if(r.id==='same-390')await shot(b,r,'after-reload');
  if(r.id==='distinct-1440')await shot(b,r,'distinct-after-reload');
  await L(a,'#gb-hl-close').click();await L(a,'#gb-hl-backdrop.is-open').waitFor({state:'hidden'});
  await openLearning(a,'#tabQuiz');r.quizReturn=await state(a);
  assert.equal(r.quizReturn.doc,r.editorial.source.doc);assert.equal(r.quizReturn.url,A+'#'+SEC);
  assert.equal(r.quizReturn.history,r.editorial.source.history);
  assert.deepEqual(r.quizReturn.quiz,r.editorial.source.quiz);await a.keyboard.press('Escape');
}

const pins=new Set(),rows=[];let browser;
try{
  browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for(const j of jobs){
    const r={...j,docs:[],events:[],downloads:[],errors:[]};rows.push(r);
    const ctx=await browser.newContext({viewport:{width:r.width,height:r.height},colorScheme:'light',reducedMotion:'reduce',acceptDownloads:true,serviceWorkers:'block'});
    async function page(tab){
      const p=await ctx.newPage();p.setDefaultTimeout(7800);
      p.on('console',e=>{
        const s=e.text();if(s.startsWith('GB_COMMENT_AUDIT '))r.events.push({tab,...JSON.parse(s.slice('GB_COMMENT_AUDIT '.length))});
        if(s.includes('Emergency unlock'))r.errors.push([tab,'emergency',s]);
      });
      p.on('download',f=>r.downloads.push([tab,f.suggestedFilename()]));
      p.on('pageerror',e=>r.errors.push([tab,'pageerror',e.message.replaceAll(base,'LOCAL')]));
      p.on('requestfailed',q=>{const u=new URL(q.url()),err=q.failure()?.errorText;if(u.origin===base&&err!=='net::ERR_ABORTED')r.errors.push([tab,'request',u.pathname,err]);});
      p.on('response',res=>{
        const u=new URL(res.url()),q=res.request(),code=res.status(),t=q.resourceType();if(u.origin!==base)return;
        if(t==='document')r.docs.push([tab,u.pathname,code,res.headers()['cache-control']]);
        if(code>=400)r.errors.push([tab,'http',q.method(),u.pathname,code]);
        if(res.ok()&&q.method()==='GET'&&(['script','stylesheet','font','document'].includes(t)||u.pathname.startsWith('/data/')&&u.pathname.endsWith('.json'))){
          let n=u.pathname.slice(1).replace(/\/*$/u,'');if(t==='document'&&!n.endsWith('.html'))n=n?n+'/index.html':'index.html';pins.add(n);
        }
      });
      return p;
    }
    try{
      await ctx.route('**/*',route=>{const u=new URL(route.request().url());return u.origin===base||['data:','blob:'].includes(u.protocol)?route.continue():route.abort();});
      await ctx.addInitScript(observe,{noteKey:NOTE_KEY,section:SEC,needle:NEEDLE,mask:MASK,key:KEY});
      await exercise(await page('A'),await page('B'),r);assert.deepEqual(r.errors,[]);assert.equal(ctx.pages().length,2);
      r.ok=true;console.log('OK',r.id,'QE='+r.editorial.source.url,'notes='+r.reloadB.s.rawNotes.length,'files='+r.downloads.length);
    }catch(e){r.ok=false;r.error=e.stack?.replaceAll(base,'LOCAL')??String(e);r.failedAt=await Promise.all(ctx.pages().map(p=>state(p).catch(()=>null)));console.error('FAIL',r.id,r.error);}
    finally{await ctx.close();}
  }
  const w={anchor,chromium:browser.version(),node:process.versions.node,playwright:req('playwright/package.json').version,
    method:{server:'stock a04-contract serve, no-store',serviceWorkers:'block',outsideOrigin:'blocked',tabs:'new context per case, exactly two pages'},
    words,distSha256:Object.fromEntries([...pins].sort().map(f=>[f,sha(fs.readFileSync(path.join(dist,f)))])),rows};
  fs.writeFileSync(path.join(out,'comment-followup-witness.json'),JSON.stringify(w,null,2)+'\n');
  console.log(`${rows.filter(r=>r.ok).length}/${rows.length} measured; ${pins.size} dist pins`);
  if(rows.some(r=>!r.ok))process.exitCode=1;
}finally{await browser?.close();await new Promise(r=>server.close(r));}
