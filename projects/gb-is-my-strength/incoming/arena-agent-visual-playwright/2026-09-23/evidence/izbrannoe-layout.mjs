import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const w of [320,390,768]){
const c=await b.newContext({viewport:{width:w,height:844},serviceWorkers:'block'});const p=await c.newPage();
await p.goto('http://127.0.0.1:8080/articles/lot-i-sodom/');await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.setItem('gb-favorites',JSON.stringify([{schemaVersion:1,path:'/articles/lot-i-sodom',routeId:'lot-i-sodom',type:'article'}]))});
await p.goto('http://127.0.0.1:8080/izbrannoe/');await p.waitForTimeout(1200);
console.log(w,JSON.stringify(await p.evaluate(()=>{const vw=innerWidth;const off=[...document.querySelectorAll('header *, nav *, .site-header *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>vw+1}).map(e=>e.tagName+'.'+String(e.className?.baseVal??e.className).slice(0,30)+' "'+(e.getAttribute('aria-label')||'')+'" right='+Math.round(e.getBoundingClientRect().right)).slice(0,5);
 const card=document.querySelector('main article, main li, [class*=card]');const img=card?.querySelector('img');
 return {sw:document.documentElement.scrollWidth,vw,off,img:img?{src:img.getAttribute('src'),nw:img.naturalWidth,complete:img.complete}:'NO IMG',cover:card?[...card.querySelectorAll('[class*=cover],[class*=img],[class*=media],[class*=thumb]')].map(e=>e.className+' bg='+getComputedStyle(e).backgroundImage.slice(0,60)).slice(0,3):null}})));
if(w===390)await p.locator('header, .site-header, nav').first().screenshot({path:process.argv[2]+'/izbrannoe-header-clipped-390.png'}).catch(()=>{});
await c.close()}
await b.close();
