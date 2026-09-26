import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const r of ['/articles/lot-i-sodom/','/articles/dzhon-gill-chast-1-chelovek/','/nagornaya/chast-1/','/hard-texts/genesis-6/','/journal/']){
const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',isMobile:true,hasTouch:true});const p=await c.newPage();
await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(500);
const o=await p.evaluate(()=>({searchEls:[...document.querySelectorAll('[aria-label*="оиск"],[data-search-shortcut],.gb-nav-search-icon,[class*=search]')].map(e=>{const R=e.getBoundingClientRect();return e.tagName+'.'+e.className.toString().slice(0,30)+' "'+(e.getAttribute('aria-label')||'')+'" vis='+(R.width>0&&R.height>0&&getComputedStyle(e).visibility!=='hidden')}).slice(0,6),
 menu:[...document.querySelectorAll('button')].filter(b=>/меню|menu/i.test(b.getAttribute('aria-label')||b.textContent)&&b.getBoundingClientRect().width>0).map(b=>b.getAttribute('aria-label')||b.textContent.trim()).slice(0,3)}));
console.log(r,JSON.stringify(o));
// try Ctrl+K equivalent unavailable on mobile; try opening menu and look for search
const m=p.locator('button[aria-label*="еню"]:visible').first();if(await m.count()){await m.click().catch(()=>{});await p.waitForTimeout(500);console.log('  in menu search visible:',await p.evaluate(()=>[...document.querySelectorAll('input[type=search],[aria-label*="оиск"],a[href*="search"]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.tagName+':'+(e.getAttribute('aria-label')||e.getAttribute('placeholder')||e.textContent.trim().slice(0,20)))))}
await c.close()}
await b.close();
