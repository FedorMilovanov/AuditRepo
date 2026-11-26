// Native Playwright evidence capture on an existing Product dist; see REPORT.md.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const [productArg, outputArg, mode] = process.argv.slice(2);
if (!productArg || !outputArg || !['articles', 'sheets', 'map', 'diagnostics', 'targeted', 'disclosures'].includes(mode)) {
  throw new Error('Usage: node browser.mjs PRODUCT OUT articles|sheets|map|diagnostics|targeted|disclosures');
}
const root = path.resolve(productArg);
const out = path.resolve(outputArg);
const {chromium} = createRequire(path.join(root,'package.json'))('playwright');
const {serve} = await import(pathToFileURL(path.join(root,'scripts/lib/a04-contract.mjs')));
const census = JSON.parse(fs.readFileSync(path.join(out,'census.json')));
const corpus = JSON.parse(fs.readFileSync(path.join(out,'question-corpus.json')));
const {server,base} = await serve();
const browser = await chromium.launch({executablePath:fs.readFileSync(path.join(out,'chromium-path'),'utf8').trim(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const product = {browser:browser.version(),mode,profiles:{},rows:[]};
const desktop={viewport:{width:1440,height:900},colorScheme:'light',reducedMotion:'reduce'};
const mobile={viewport:{width:390,height:844},isMobile:true,hasTouch:true,colorScheme:'dark',reducedMotion:'reduce'};
product.profiles={desktop,mobile};
const thirdParty = new Set();
const choose=(key,n)=>n===0?key[0]:(key[0]+1)%key[1];
const norm=s=>String(s??'').replace(/\s+/g,' ').trim();
const focusState = async (page) => page.evaluate(() => {
 const n=document.activeElement;
 return {tag:n?.tagName,id:n?.id,cls:typeof n?.className==='string'?n.className:'',name:(n?.getAttribute('aria-label')||n?.textContent||'').trim().replace(/\s+/g,' ').slice(0,n?.tagName==='BODY'?0:95),withinArticleQuiz:!!n?.closest('#quizPlaceholder'),withinSheetQuiz:!!n?.closest('#panelQuiz')};
});
async function setup(context,page,rec) {
 page.setDefaultTimeout(12000);
 page.on('pageerror', e=>rec.pageErrors.push(String(e).slice(0,400)));
 page.on('response',res=>{if(res.url().startsWith(base+'/')&&res.status()>=400)rec.localErrors.push([res.status(),res.url().slice(base.length)]);});
}
async function runJobs(jobs,fn,threads=4) {
 let cursor=0;
 await Promise.all(Array.from({length:threads}, async()=>{
  while(cursor<jobs.length){const [route,profile,meta] = jobs[cursor++];
   const rec = {route,profile,pageErrors:[],localErrors:[]}; product.rows.push(rec);
   const context=await browser.newContext(profile==='mobile'?mobile:desktop);
   // Only block known nonessential cross-origin traffic; local app bytes and data are untouched.
   await context.route(url=>['mc.yandex.ru','fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname),r=>{thirdParty.add(new URL(r.request().url()).hostname);return r.abort();});
   const page=await context.newPage(); await setup(context,page,rec);
   try {
     await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:35000});
     await fn(page,rec,meta);
     rec.ok=true;
   } catch(e){rec.ok=false;rec.error=String(e).slice(0,700);console.error(route,profile,rec.error);}
   finally {await context.close();}
  }
 }));
}
const onSheet=async(page, settings='#mobSettingsBtn')=>{
 await page.locator(settings).click();
 await page.locator('#mobLearningBtn').click();
 await page.waitForFunction(()=>document.getElementById('gillLearningOverlay')?.classList.contains('is-open'));
};
const openedGlossary=async page=>{
 await page.waitForFunction(()=>document.querySelector('#termsList .term-card,#termsList .empty-state'));
 return page.evaluate(()=>({count:document.querySelectorAll('#termsList .term-card').length,defaultTab:document.querySelector('.gill-tab[aria-selected="true"]')?.id, inBody:document.querySelector('[data-pagefind-body]')?.querySelectorAll('.gterm[data-term]').length, fallback:[...document.querySelectorAll('#termsList .term-card__definition')].filter(e=>e.textContent?.includes('Определение раскрывается')).length}));
};
const sheetBits=async page=>page.evaluate(()=>({hash:location.hash,active:document.activeElement?.id,locked:document.body.style.overflow,open:document.querySelector('#gillLearningOverlay').classList.contains('is-open')}));
try {
if(mode==='articles') {
 await runJobs(census.article.flatMap(r=>['desktop','mobile'].map(profile=>[r.route,profile,r])),async(page,rec,r)=>{
  const panel=page.locator('#quizPlaceholder .quiz-wrapper');
  const launch=page.locator('#quizLaunch');
  await launch.click(); rec.answersCorrect=[]; rec.sources=0; rec.markupLeaks=0; rec.correctClicked=0;
  rec.bonusAdvertisedByData=await page.evaluate(()=>window.SITE_CONFIG.quiz.bonusQuestions?.length??0);
  for(const q of r.questions) {
   const options=panel.locator('button.quiz-option');
   assert.equal(await options.count(),q.options);
   assert.equal(await panel.locator('.quiz-progress').textContent(),`Вопрос ${q.n} из ${r.questions.length}`);
   const idx=choose([q.correct,q.options],r.bonus||q.n%2?0:1);
   await options.nth(idx).click();
   const expected=idx===q.correct;
   if (expected) rec.correctClicked++;
   const feedback=panel.locator('.quiz-feedback');
   const actual=await feedback.locator('strong').first().innerText();
   assert.equal(actual,expected?'Верно':'Неверно');
   assert.equal(await options.nth(q.correct).evaluate(n=>n.classList.contains('is-correct')),true);
   assert.equal(await options.evaluateAll(ns=>ns.every(n=>n.disabled)),true);
   assert.ok(norm(await feedback.locator('.quiz-explanation').first().innerText()).length>0);
   rec.sources+=await feedback.locator('a[href]').count();
   if (/<\/?(?:em|span|strong|i|b|u)\b[^>]*>/iu.test(await panel.innerText())) rec.markupLeaks++;
   await panel.locator('button.quiz-next').click();
   rec.answersCorrect.push(expected);
  }
  rec.result=await panel.locator('.quiz-progress').textContent();
  assert.equal(rec.result,`Результат: ${rec.correctClicked} из ${r.questions.length}`);
  rec.bonusButtonCount=await panel.getByRole('button',{name:/бонус|хардкор|сложн/i}).count();
  await panel.getByRole('button',{name:'Пройти ещё раз'}).click();
  assert.equal(await panel.locator('.quiz-progress').textContent(),`Вопрос 1 из ${r.questions.length}`);
 },4);
}
if(mode==='sheets') {
 await runJobs(census.sheet.map(r=>[r.route,'mobile',r]),async(page,rec,r)=>{
   await onSheet(page); rec.terms=await openedGlossary(page);
   await page.locator('#tabOutline').click();
   rec.outline={count:await page.locator('#panelOutline [data-outline-link]').count(),empty:await page.locator('#panelOutline .empty-state').count()};
   assert.equal(rec.outline.count,r.outline.length);
   await page.locator('#tabNotes').click();
   rec.notes={empty:await page.locator('#panelNotes .empty-state').count(),store:await page.evaluate(()=>typeof window.GBHighlights?.getAll==='function')};
   await page.locator('#tabSearch').click();
   const input=page.locator('#learningSearchInput');
   let token=await page.evaluate(()=>{
     const root=document.querySelector('[data-pagefind-body]');
     return (root?.querySelector('h2,h3,p')?.textContent??'').normalize().match(/[А-Яа-яЁё]{4,}/u)?.[0]??'';
   });
   rec.search={token};
   assert.ok(token);
   await input.fill(token);
   const status=page.locator('#learningSearchStatus');
   await page.waitForFunction(()=>document.querySelector('#learningSearchStatus')?.textContent!=='Введите минимум 2 символа');
   rec.search.status=await status.innerText();
   rec.search.results=await page.locator('#learningSearchResults button').count();
   const t=page.locator('#tabQuiz');
   rec.deck=await t.count();
   if(!r.questions.length){assert.equal(rec.deck,0);return;}
   await t.click();
   const seen=[];
   const sourceState=()=>page.locator('#glsQuizSource').evaluate(a=>({hidden:a.hidden,display:getComputedStyle(a).display,href:a.getAttribute('href'),text:a.textContent,box:a.getClientRects().length,tabIndex:a.tabIndex}));
   rec.sourceBeforeAnswer=await sourceState();
   rec.staleSourceTransitions=0;
   for(let i=0;i<r.questions.length;i++){
     const title=await page.locator('#glsQuizQuestion').textContent();
     const item=corpus.learning.find(q=>q.question===title);
     assert.ok(item,title);
     const options=page.locator('#glsQuizOptions button');
     assert.equal(await options.evaluateAll(ns=>ns.filter(n=>n.disabled).length),4);
     await page.locator('#glsQuizConfRow [data-conf="guess"]').click();
     assert.equal(await options.evaluateAll(ns=>ns.filter(n=>!n.disabled).length),4);
     const intended=i%2===0? item.answers[item.correctIndex] : item.answers[(item.correctIndex+1)%item.answers.length];
     await options.getByText(intended,{exact:true}).click();
     const verdict=await page.locator('#glsQuizVerdict').innerText();
     assert.match(verdict,i%2===0?/^Верно/u:/^Неверно/u);
     assert.ok((await page.locator('#glsQuizExplanation').innerText()).length);
     await page.locator('#glsQuizSource').waitFor({state:'visible'});
     assert.equal(await page.locator('#glsQuizSource').getAttribute('href'),item.sourceHref);
     seen.push(item.id);
     await page.locator('#glsQuizNext').click();
     const between=await sourceState();
     if(between.hidden && between.box && between.href===item.sourceHref && between.text) rec.staleSourceTransitions++;
     if(i===0) rec.sourceBeforeSecondAnswer=between;
   }
   rec.deckOrder=seen;
   assert.equal(new Set(seen).size,r.questions.length);
   rec.cycleBoundary=await page.locator('#glsQuizQuestion').textContent()!==corpus.learning.find(q=>q.id===seen.at(-1)).question;
   assert.equal(rec.cycleBoundary,true);
 },5);
}
if(mode==='diagnostics') {
 const keyboardCases=[...census.article.filter(r=>['/articles/lot-i-sodom/','/articles/krajne-li-isporcheno-serdce/','/nagornaya/chast-4/'].includes(r.route)).map(r=>[r.route,'desktop',{type:'keyboard',r}]),...['/articles/dzhon-gill-chast-2-uchenyi/','/articles/otstuplenie-chto-govorit-bibliya/'].map(route=>[route,'mobile',{type:'learning'}]),['/app/','desktop',{type:'app'}]];
 await runJobs(keyboardCases,async(page,rec,meta)=>{
  if(meta.type==='app') {rec.links=await page.locator('a[href^="https://t.me/"]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.getAttribute('href')))]);return;}
  if(meta.type==='keyboard') {
   const p=page.locator('#quizPlaceholder'); const launch=page.locator('#quizLaunch');
   await launch.focus(); await page.keyboard.press('Enter'); rec.launchFocus=await focusState(page);
   await page.keyboard.press('Tab'); rec.firstTabAfterLaunch=await focusState(page);
   const panel=p.locator('.quiz-wrapper');
   for(const [i,q] of meta.r.questions.entries()){
     const option=panel.locator('.quiz-option').nth(meta.r.route.includes('/nagornaya/')?1:(q.correct+1)%q.options);
     await option.focus(); await page.keyboard.press('Enter');
     if(i===0){rec.feedbackFocus=await focusState(page);await page.keyboard.press('Tab');rec.firstTabAfterFeedback=await focusState(page);await page.keyboard.press('Shift+Tab');await page.keyboard.press('Shift+Tab');rec.twoReverseFromAfter=await focusState(page);}
     await panel.locator('.quiz-next').focus(); await page.keyboard.press('Enter');
     if(i===0){rec.nextFocus=await focusState(page);await page.keyboard.press('Tab');rec.firstTabAfterNext=await focusState(page);}
   }
   rec.result=await panel.locator('.quiz-progress').textContent();
   rec.resultFocus=await focusState(page);await page.keyboard.press('Tab');rec.firstTabAfterResult=await focusState(page);
   await panel.locator('.quiz-next').focus();await page.keyboard.press('Enter');rec.restartFocus=await focusState(page);await page.keyboard.press('Tab');rec.firstTabAfterRestart=await focusState(page);
   return;
  }
  await onSheet(page); rec.terms=await openedGlossary(page);
  rec.openFocus=await focusState(page);
  const term=page.locator('#termsList .term-card').first();
  rec.term=await term.innerText();
  await term.click(); rec.termExpanded=await term.getAttribute('aria-expanded');
  await page.locator('#tabOutline').click();
  const firstOutline=page.locator('#outlineList [data-outline-link]').first();
  rec.outlineHref=await firstOutline.getAttribute('href'); await firstOutline.click();rec.afterOutline=await sheetBits(page);
  await onSheet(page); await page.locator('#tabSearch').click();
  await page.locator('#learningSearchInput').fill(rec.route.includes('dzhon')?'Гилл':'отступление');
  await page.locator('#learningSearchResults button').first().click(); rec.afterSearch=await sheetBits(page);
  await onSheet(page); await page.locator('#tabQuiz').click();
  const quiz=page.locator('#panelQuiz');
  const trace=[];
  for(let i=0;i<4;i++){
   const title=await quiz.locator('#glsQuizQuestion').textContent();
   const item=corpus.learning.find(q=>q.question===title);
   const confidence=quiz.locator('[data-conf="guess"]');
   await confidence.focus();await page.keyboard.press('Enter');
   if(!i){rec.confidenceFocus=await focusState(page);await page.keyboard.press('Tab');rec.firstTabAfterConfidence=await focusState(page);}
   const wrong=item.answers[(item.correctIndex+1)%4];
   const b=quiz.getByRole('button',{name:wrong,exact:true});
   await b.focus();await page.keyboard.press('Enter');
   if(!i){rec.feedbackFocus=await focusState(page);await page.keyboard.press('Tab');rec.firstTabAfterFeedback=await focusState(page);}
   trace.push({id:item.id,verdict:await quiz.locator('#glsQuizVerdict').innerText(),meter:await quiz.locator('#glsQuizCalibPct').innerText()});
   const next=quiz.locator('#glsQuizNext'); await next.focus();await page.keyboard.press('Enter');
   if(!i){rec.nextFocus=await focusState(page);await page.keyboard.press('Tab');rec.firstTabAfterNext=await focusState(page);}
  }
  rec.fourWrong=trace;
  await page.reload({waitUntil:'domcontentloaded'});await onSheet(page);await page.locator('#tabQuiz').click();rec.progressAfterReload={meterVisible:await page.locator('#glsQuizCalib').isVisible(),streak:await page.locator('#glsQuizStreak').innerText()};
 },3);
}
if(mode==='targeted') {
 const cases=[
  ['/articles/dzhon-gill-istoricheskiy-kontekst/','mobile','stale'],
  ['/articles/otstuplenie-chto-govorit-bibliya/','mobile','stale'],
  ['/articles/dzhon-gill-chast-1-chelovek/','mobile','notes'],
  ['/baptisty-rossii/dva-sezda-1884/','mobile','notes'],
  ['/articles/lot-i-sodom/','desktop','lot'],
  ...['/articles/dzhon-gill-chast-2-uchenyi/','/articles/otstuplenie-chto-govorit-bibliya/','/baptisty-rossii/dva-sezda-1884/','/articles/krajne-li-isporcheno-serdce/','/hard-texts/blagovestie-mertvym-1-petra-4-5-6/'].map(route=>[route,'desktop','desktop-entry']),
  ['/articles/dzhon-gill-chast-1-chelovek/','mobile','quote-selection'],
  ['/articles/lot-i-sodom/','desktop','quote-selection'],
  ['/hard-texts/genesis-6/','desktop','quote-control'],
  ['/konfessii/russkij-baptizm/','desktop','map-before-answer'],
 ];
 await runJobs(cases,async(page,rec,scenario)=>{
  rec.scenario=scenario;
  if(scenario==='desktop-entry') {
   rec.mobileTrigger=await page.locator('#mobSettingsBtn').isVisible();
   rec.desktopTrigger=await page.locator('#railSettingsBtn').isVisible();
   await onSheet(page,'#railSettingsBtn');
   rec.heading=await page.locator('#gillLearningTitle').innerText();
   rec.terms=(await openedGlossary(page)).count;
   rec.quizTabVisible=await page.locator('#tabQuiz').isVisible();
   return;
  }
  if(scenario==='quote-selection'||scenario==='quote-control') {
   const candidates=page.locator(scenario==='quote-control'?'main article p, main .article-body p':'main p');
   const paragraphIndex=await candidates.evaluateAll(nodes=>nodes.findIndex(p=>[...p.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&n.data.trim().length>=50)&&p.getClientRects().length));
   assert.ok(paragraphIndex>=0,'No visible paragraph with selectable text');
   const paragraph=candidates.nth(paragraphIndex);
   await paragraph.scrollIntoViewIfNeeded();
   // Select a real text node by Range, then use the shipped UI. Do not seed storage.
   rec.selected=await paragraph.evaluate(p=>{
    const node=[...p.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.data.trim().length>=50);
    const excerpt=node?.data.match(/\S+(?:\s+\S+){0,7}/u);
    if(!excerpt)return '';
    const range=document.createRange();
    range.setStart(node,excerpt.index);
    range.setEnd(node,excerpt.index+excerpt[0].length);
    const selection=window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    return selection.toString().replace(/\s+/g,' ').trim();
   });
   assert.ok(rec.selected.length>=8);
   rec.legacySelectionScript=await page.evaluate(()=>[...document.scripts].some(el=>/\/site\.js(?:\?|$)/.test(el.src)));
   const popup=page.locator('#selection-share-popup');
   rec.popupInDOM=await popup.count();
   if(rec.popupInDOM) await page.locator('#selection-share-popup.ss-visible #ss-save').waitFor();
   rec.saveVisible=await page.locator('#ss-save').isVisible();
   rec.noteFromSelectionVisible=await page.locator('#ss-note').isVisible();
   if(!rec.saveVisible)return;
   await page.locator('#ss-save').click();
   await page.waitForFunction(()=>window.GBHighlights?.getAll().length===1);
   rec.storedQuote=await page.evaluate(()=>window.GBHighlights.getAll()[0].text);
   assert.equal(rec.storedQuote,rec.selected);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.GBHighlights?.getAll().length===1);
   rec.quotesAfterReload=await page.evaluate(()=>window.GBHighlights.getAll().length);
   await page.goto(base+'/articles/dzhon-gill-chast-1-chelovek/',{waitUntil:'domcontentloaded'});
   await onSheet(page,'#railSettingsBtn');
   await page.locator('#tabNotes').click();
   rec.notesTabQuote=await page.locator('#notesList .note-card blockquote').first().innerText();
   assert.equal(rec.notesTabQuote,rec.selected);
   rec.actualNotes=await page.evaluate(()=>window.GBHighlights.getNotes().length);
   return;
  }
  if(scenario==='map-before-answer') {
   const quiz=page.frameLocator('#appframe').locator('#quiz');
   const card=quiz.getByRole('heading',{name:corpus.map[0].question,exact:true}).locator('..');
   await card.screenshot({path:path.join(out,'map-before-answer.png'),animations:'disabled'});
   rec.question=corpus.map[0].question;
   rec.topicFilters=[];
   const topics=[['origins','Истоки'],['figures','Фигуры'],['unions','Союзы'],['persecution','Гонения'],['doctrines','Вероучение'],['modern','Современность'],['all','Все темы']];
   for(const [key,label] of topics) {
    const pool=key==='all'?corpus.map:corpus.map.filter(q=>q.topic===key);
    await quiz.getByRole('button',{name:label,exact:true}).click();
    await quiz.getByRole('heading',{name:pool[0].question,exact:true}).waitFor();
    const progress=await quiz.getByText(`1 / ${pool.length}`,{exact:true}).innerText();
    const score=await quiz.getByText('0 правильно',{exact:true}).innerText();
    rec.topicFilters.push({key,label,progress,score,firstQuestion:pool[0].id});
    await quiz.getByRole('button',{name:new RegExp(pool[0].options[pool[0].correctIndex].replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).click();
    await quiz.getByText('1 правильно',{exact:true}).waitFor();
   }
   return;
  }
  if(scenario==='lot') {
   await page.locator('#quizLaunch').click();
   await page.locator('#quizPlaceholder .quiz-option').nth(1).click();
   rec.feedback=await page.locator('#quizPlaceholder .quiz-feedback').innerText();
   return;
  }
  await onSheet(page);
  if(scenario==='stale') {
   await page.locator('#tabQuiz').click();
   const box=page.locator('#panelQuiz');
   rec.question1=await box.locator('#glsQuizQuestion').textContent();
   await box.locator('[data-conf="sure"]').click();await box.locator('.quiz-option').first().click();
   const link=box.locator('#glsQuizSource');
   const source=await link.getAttribute('href');
   await box.locator('#glsQuizNext').click();
   rec.question2=await box.locator('#glsQuizQuestion').textContent();
   rec.previousSource={href:source,readable:await link.isVisible(),still:await link.getAttribute('href'),text:await link.innerText()};
   await link.click(); rec.afterClick=await sheetBits(page);
   return;
  }
  await page.locator('#tabNotes').click();
  await page.locator('#manageNotesBtn').click();
  await page.locator('#gb-hl-new-note').click();
  const sample='Заметка аудита: проверить различия по источнику.';
  await page.locator('#gb-hl-note-text').fill(sample);
  await page.locator('#gb-hl-editor').getByRole('button',{name:'Сохранить заметку'}).click();
  await page.locator('#gb-hl-list').getByText(sample,{exact:true}).waitFor();
  rec.savedVisibleInLibrary=true;
  await page.locator('#gb-hl-close').click();
  await page.reload({waitUntil:'domcontentloaded'});
  await onSheet(page);
  await page.locator('#tabNotes').click();
  rec.panelNotes=await page.locator('#notesList').innerText();
  rec.persisted=await page.evaluate(()=>({notes:window.GBHighlights.getNotes().length,quotes:window.GBHighlights.getAll().length}));
  await page.locator('#manageNotesBtn').click();
  await page.locator('#gb-hl-list').getByText(sample,{exact:true}).waitFor();
  rec.savedVisibleInLibraryAfterReload=true;
 },3);
}
if(mode==='disclosures') {
 await runJobs(census.disclosures.flatMap(r=>['desktop','mobile'].map(profile=>[r.route,profile,r])),async(page,rec,r)=>{
  const section=page.locator('#'+r.sectionId);
  const cards=section.locator('details[data-correct-index]');
  assert.equal(await cards.count(),r.declared);
  rec.title=await section.locator('h2').innerText();
  rec.questions=[];
  for(const [i,q] of r.questions.entries()) {
   const card=cards.nth(i), trigger=card.locator('summary');
   assert.equal(norm(await trigger.innerText()),q.summary);
   const choices=card.locator('li');
   const hiddenBefore=!(await choices.first().isVisible());
   if(rec.profile==='desktop')await trigger.press('Enter');else await trigger.click();
   assert.equal(await card.evaluate(d=>d.open),true);
   assert.ok(await choices.first().isVisible());
   assert.equal(await choices.count(),q.options.length);
   const explanation=norm(await card.locator('p').innerText());
   assert.equal(explanation,q.explanation);
   const items=await choices.evaluateAll(ns=>ns.map(n=>({text:n.innerText,correct:n.dataset.correct==='true',color:getComputedStyle(n).color,role:n.getAttribute('role'),weight:getComputedStyle(n).fontWeight})));
   assert.equal(items.filter(a=>a.correct).length,1);
   assert.equal(items.findIndex(a=>a.correct),q.correct);
   rec.questions.push({summary:q.summary,hiddenBefore,correctIndex:q.correct,items,explanation,answerInputs:await card.locator('button,input,select').count()});
  }
 },2);
}
if(mode==='map') {
 await runJobs([['/konfessii/russkij-baptizm/','desktop',null],['/konfessii/russkij-baptizm/','mobile',null]],async(page,rec)=>{
  const frame=page.frameLocator('iframe[src*="_app"]');
  const quiz=frame.locator('#quiz');
  await quiz.scrollIntoViewIfNeeded({timeout:15000});
  rec.questions=[];
  for(const [i,q] of corpus.map.entries()){
   await quiz.getByRole('heading',{name:q.question,exact:true}).waitFor();
   const buttons=quiz.locator('div.space-y-2\\.5 > button');
   assert.equal(await buttons.count(),4);
   const styles=await buttons.evaluateAll(nodes=>nodes.map(b=>({color:getComputedStyle(b).color,inline:b.style.color,disabled:b.disabled})));
   const stated=q.correctIndex;
   rec.questions.push({id:q.id,correctIndex:stated,preAnswerColors:styles.map(s=>s.color),enabled:styles.every(s=>!s.disabled),correctGreen:styles.filter(s=>s.color==='rgb(110, 231, 183)').length===1&&styles[stated].color==='rgb(110, 231, 183)'});
   await buttons.nth(i%2===0?stated:(stated+1)%4).click();
   assert.ok(await quiz.getByText('Объяснение:',{exact:true}).isVisible());
   await quiz.getByRole('button',{name:/Следующий вопрос|Посмотреть результат/}).click();
  }
  await quiz.getByRole('button',{name:'Пройти снова'}).waitFor();
  rec.result=norm(await quiz.locator('h3').innerText()); rec.sources=await quiz.locator('a').count();
  assert.match(rec.result,/^13\s*\/\s*25/u);
  await quiz.getByRole('button',{name:'Пройти снова'}).click();await quiz.getByRole('heading',{name:corpus.map[0].question,exact:true}).waitFor();
  const hit=quiz.getByRole('button',{name:'Современность',exact:true});await hit.click();
  const demo=corpus.map.find(q=>q.topic==='modern');await quiz.getByRole('heading',{name:demo.question,exact:true}).waitFor();
  rec.topicA11y=await quiz.locator('.filter-pill-active').evaluate(n=>({text:n.textContent,pressed:n.getAttribute('aria-pressed'),selected:n.getAttribute('aria-selected')}));
 },2);
}
} finally {
 product.abortedNonessentialThirdParty=[...thirdParty].sort();
 product.rows.sort((a,b)=>a.route.localeCompare(b.route)||a.profile.localeCompare(b.profile));
 fs.writeFileSync(path.join(out,'browser-'+mode+'.json'),JSON.stringify(product,null,2)+'\n');
 console.log(mode,product.browser,product.rows.length,'ok',product.rows.filter(r=>r.ok).length,'pageErrors',product.rows.flatMap(r=>r.pageErrors).length,'local404',product.rows.flatMap(r=>r.localErrors).length);
 await browser.close();await new Promise(resolve=>server.close(resolve));
}
if(product.rows.some(r=>!r.ok))process.exitCode=1;
