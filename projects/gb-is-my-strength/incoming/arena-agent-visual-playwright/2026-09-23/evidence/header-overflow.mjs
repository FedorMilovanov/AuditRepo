import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const res={};
for(const w of [320,390,768]){const c=await b.newContext({viewport:{width:w,height:800},serviceWorkers:'block'});
 for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(250);
  const o=await p.evaluate(()=>{const vw=innerWidth;return [...document.querySelectorAll('button,a')].filter(e=>{const R=e.getBoundingClientRect();const cs=getComputedStyle(e);return R.width>0&&R.top<120&&R.top>-5&&R.right>vw+2&&cs.visibility!=='hidden'&&(cs.position==='fixed'||cs.position==='sticky'||e.closest('header,nav,.astro-header'))}).map(e=>(e.getAttribute('aria-label')||e.textContent.trim().slice(0,15))+'@'+Math.round(e.getBoundingClientRect().right))});
  if(o.length)(res[w]??={})[r]=o;await p.close()}
 await c.close();console.log(w,'routes with header controls past viewport:',Object.keys(res[w]||{}).length);
 const agg={};for(const v of Object.values(res[w]||{}))for(const x of v){const k=x.split('@')[0];agg[k]=(agg[k]||0)+1}console.log('  ',JSON.stringify(agg).slice(0,300),'| e.g.',Object.keys(res[w]||{}).slice(0,4).join(' '))}
fs.writeFileSync(process.argv[2],JSON.stringify(res,null,1));
const c=await b.newContext({viewport:{width:390,height:800},serviceWorkers:'block'});const p=await c.newPage();await p.goto('http://127.0.0.1:8080/articles/lot-i-sodom/');await p.waitForTimeout(500);
await p.locator('[aria-label="Добавить в Избранное"]:visible').first().click();await p.waitForTimeout(300);
console.log('stored:',await p.evaluate(()=>localStorage['gb-favorites']));await b.close();
