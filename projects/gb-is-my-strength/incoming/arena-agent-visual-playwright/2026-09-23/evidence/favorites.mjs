import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',isMobile:true,hasTouch:true});
const res={};
for(const r of ['/articles/lot-i-sodom/','/articles/dzhon-gill-chast-1-chelovek/','/nagornaya/chast-1/','/hard-texts/genesis-6/']){
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(600);
 const btn=p.locator('[aria-label*="збранн"]:visible, [data-gb-favorite]:visible, button[aria-pressed][aria-label*="охран"]:visible').first();
 const n=await btn.count();
 if(!n){res[r]={found:false,errs};await p.close();continue}
 const before=await btn.evaluate(e=>({l:e.getAttribute('aria-label'),pressed:e.getAttribute('aria-pressed'),t:e.textContent.trim().slice(0,30)}));
 await btn.click();await p.waitForTimeout(500);
 const after=await btn.evaluate(e=>({l:e.getAttribute('aria-label'),pressed:e.getAttribute('aria-pressed'),t:e.textContent.trim().slice(0,30)}));
 const toast=await p.evaluate(()=>[...document.querySelectorAll('[role=status],[aria-live],.toast,[class*=toast]')].map(e=>e.textContent.trim()).filter(Boolean).join(' | ').slice(0,120));
 const ls=await p.evaluate(()=>Object.keys(localStorage).filter(k=>/fav|izbr|bookmark/i.test(k)).map(k=>k+'='+localStorage[k].slice(0,120)));
 res[r]={found:true,before,after,toast,ls,errs};await p.close();}
const p=await c.newPage();await p.goto('http://127.0.0.1:8080/izbrannoe/');await p.waitForTimeout(1000);
res.izbrannoe=await p.evaluate(()=>({h1:document.querySelector('h1')?.textContent.trim(),links:[...document.querySelectorAll('main a[href*="/articles/"],main a[href*="/nagornaya/"],main a[href*="/hard-texts/"]')].map(a=>a.getAttribute('href')).slice(0,10),empty:/пока пуст|нет сохран|ничего/i.test(document.body.innerText)}));
await p.screenshot({path:E+'/izbrannoe-after-4-saves.png',fullPage:false});
// remove from izbrannoe
const rm=p.locator('main button:visible').filter({hasText:/удал|убрать|×/i}).first();res.removeBtn=await rm.count();
if(res.removeBtn){await rm.click();await p.waitForTimeout(400);res.afterRemove=await p.evaluate(()=>[...document.querySelectorAll('main a[href*="/articles/"],main a[href*="/nagornaya/"],main a[href*="/hard-texts/"]')].length)}
console.log(JSON.stringify(res,null,1));await b.close();
