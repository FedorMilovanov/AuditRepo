import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:1366,height:900},serviceWorkers:'block'});await c.addInitScript(()=>localStorage.setItem('gb:font-scale','1.25'));
const nested=[],outside=[];
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(250);
 const x=await p.evaluate(()=>{const sel='[data-reader-root] .article-body,[data-gill-v16] .article-body,[data-gill-v16] .page-wrap > main.article-main';const roots=[...document.querySelectorAll(sel)];
  const nest=roots.filter(e=>roots.some(o=>o!==e&&o.contains(e))).length;
  const out=[...document.querySelectorAll('main p')].filter(p=>p.textContent.length>300&&p.offsetParent&&!roots.some(r=>r.contains(p))).length;
  const inn=[...document.querySelectorAll('main p')].filter(p=>p.textContent.length>300&&roots.some(r=>r.contains(p))).length;
  return {roots:roots.length,nest,out,inn}});
 if(x.nest)nested.push(r+' roots='+x.roots+' nested='+x.nest);if(x.out&&x.roots)outside.push(r+' outside='+x.out+' inside='+x.inn);await p.close()}
console.log('DOUBLE-SCALED (nested roots):',nested.length,'\n '+nested.join('\n '));console.log('long prose outside scaled root:',outside.length,'\n '+outside.join('\n '));await b.close();
