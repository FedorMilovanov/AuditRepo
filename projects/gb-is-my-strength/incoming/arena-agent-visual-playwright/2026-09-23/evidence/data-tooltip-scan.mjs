import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:1366,height:900},serviceWorkers:'block'});const out={};
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(700);
 const d=await p.evaluate(()=>{const t=[...document.querySelectorAll('[data-tooltip]')];if(!t.length)return null;
  const ready=t.filter(e=>e.dataset.gbTooltipReady||e.getAttribute('aria-describedby')||e.tabIndex>=0||e.getAttribute('role'));
  return {n:t.length,ready:ready.length,sample:t[0].dataset.tooltip.slice(0,50),cls:t[0].className}});
 if(d){ // try hover the first non-ready one
  if(d.ready<d.n){const el=p.locator('[data-tooltip]:visible').first();if(await el.count()){await el.hover().catch(()=>{});await p.waitForTimeout(600);d.hoverShows=await p.evaluate(txt=>[...document.querySelectorAll('body *')].some(e=>e.children.length<3&&!e.hasAttribute('data-tooltip')&&e.textContent.includes(txt)&&e.getBoundingClientRect().width>20&&getComputedStyle(e).visibility!=='hidden'&&+getComputedStyle(e).opacity>0.2),d.sample.slice(0,20))}}
  out[r]=d}
 await p.close()}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
for(const [r,d] of Object.entries(out))console.log(r.padEnd(48),'n',d.n,'ready',d.ready,'hoverShows',d.hoverShows,'|',d.sample);
await b.close();
