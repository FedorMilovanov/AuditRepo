import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=['/','/articles/','/biografii/','/izbrannoe/','/pastor-series/','/hard-texts/','/nagornaya/seriya/','/journal/','/karty/','/app/'];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const out={};
for(const [w,h] of [[800,900],[810,1080],[820,1180],[853,1280],[912,1368],[960,900],[1024,1366],[1100,900],[1180,820],[844,390],[932,430]]){
 const c=await b.newContext({viewport:{width:w,height:h},serviceWorkers:'block'});const row={};
 for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(250);
  const o=await p.evaluate(()=>{const vw=innerWidth;return [...document.querySelectorAll('button,a')].filter(e=>{const R=e.getBoundingClientRect();const cs=getComputedStyle(e);return R.width>0&&R.top<120&&R.top>-5&&R.right>vw+2&&cs.visibility!=='hidden'&&(cs.position==='fixed'||cs.position==='sticky'||e.closest('header,nav,.astro-header'))}).map(e=>(e.getAttribute('aria-label')||e.textContent.trim().slice(0,12)))});
  if(o.length)row[r]=o;await p.close()}
 out[w+'x'+h]=row;console.log((w+'x'+h).padEnd(10),Object.keys(row).length,Object.entries(row).map(([r,v])=>r+'['+v.length+']').join(' '));await c.close()}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));await b.close();
