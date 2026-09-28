import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const log=[];const L=(...a)=>{console.log(...a);log.push(a.join(' '))};
for(const [name,vp,start] of [['mobile',{width:390,height:844},'/'],['desktop',{width:1366,height:900},'/'],['mobile-article',{width:390,height:844},'/articles/lot-i-sodom/']]){
 const c=await b.newContext({viewport:vp,serviceWorkers:'block',isMobile:name.startsWith('mobile'),hasTouch:name.startsWith('mobile')});const p=await c.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push('console:'+m.text().slice(0,120)));
 await p.goto('http://127.0.0.1:8080'+start);await p.waitForTimeout(500);
 const trig=await p.evaluate(()=>[...document.querySelectorAll('button,a,[role=button]')].filter(e=>/поиск|search|найти/i.test((e.getAttribute('aria-label')||'')+e.textContent+(e.dataset?Object.keys(e.dataset).join():''))&&e.getBoundingClientRect().width>0).map(e=>({t:e.tagName,l:e.getAttribute('aria-label'),txt:e.textContent.trim().slice(0,20),href:e.getAttribute('href'),cls:e.className.toString().slice(0,50)})));
 L(name,'triggers',JSON.stringify(trig));
 let opened=false;
 if(trig.length){const t=trig[0];const loc=t.l?p.locator(`[aria-label="${t.l}"]:visible`).first():p.getByText(t.txt).first();await loc.click().catch(e=>L('click fail',e.message.slice(0,80)));await p.waitForTimeout(600);}
 const inp=p.locator('input[type=search]:visible, input[placeholder*="оиск"]:visible, [role=combobox]:visible, [role=searchbox]:visible').first();
 if(await inp.count()){opened=true;L(name,'url after open',p.url().replace('http://127.0.0.1:8080',''),'focused input:',await inp.evaluate(e=>e===document.activeElement));
  for(const q of ['Гилл','сердце','Нагорная проповедь','qwxz','бытие 6']){await inp.fill('');await inp.type(q,{delay:30});await p.waitForTimeout(1500);
   const r=await p.evaluate(()=>{const items=[...document.querySelectorAll('.pagefind-ui__result, [role=option], .search-result, [data-search-result], .cmdk-item, [class*=result] a')].filter(e=>e.getBoundingClientRect().height>0);return {n:items.length,first:items.slice(0,3).map(e=>(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,60)),empty:(document.body.innerText.match(/ничего не найдено|нет результатов|не найдено/i)||[''])[0]}});
   L(name,'q='+q,JSON.stringify(r));
   if(q==='Гилл'){await p.screenshot({path:`${E}/search-${name}.png`});}
  }
  await inp.fill('');await inp.type('Гилл',{delay:30});await p.waitForTimeout(1500);
  await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');await p.waitForTimeout(1500);
  L(name,'after ArrowDown+Enter url',p.url().replace('http://127.0.0.1:8080',''),'status title',await p.title());
 } else L(name,'NO SEARCH INPUT after trigger; url',p.url());
 if(name==='desktop'){await p.goto('http://127.0.0.1:8080/');await p.waitForTimeout(400);await p.keyboard.press('Control+k');await p.waitForTimeout(500);L('ctrl+k opens input:',await p.locator('input:visible').evaluateAll(a=>a.some(e=>e===document.activeElement)));await p.keyboard.press('Escape');await p.waitForTimeout(300);L('after Esc focus:',await p.evaluate(()=>document.activeElement.tagName+'.'+document.activeElement.className.toString().slice(0,40)));}
 L(name,'errors',JSON.stringify(errs.slice(0,5)));await c.close();}
require=null;await b.close();
import('fs').then(f=>f.writeFileSync(E+'/search-e2e.txt',log.join('\n')));
