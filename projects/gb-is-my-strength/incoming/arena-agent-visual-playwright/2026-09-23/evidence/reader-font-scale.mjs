import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const probe=()=>{const ps=[...document.querySelectorAll('p')].filter(p=>p.getBoundingClientRect().width>200&&!p.closest('header,nav,footer,aside,[class*=card],[class*=quiz],[class*=hero]'));ps.sort((a,b)=>b.textContent.length-a.textContent.length);const p=ps[0];return p?{fs:parseFloat(getComputedStyle(p).fontSize),cls:(p.closest('[class]')?.className||'').toString().slice(0,40),len:p.textContent.length}:null};
const res={};
for(const [mode,s] of [['base','1'],['max','1.25']]){const c=await b.newContext({viewport:{width:1366,height:900},serviceWorkers:'block'});await c.addInitScript(x=>localStorage.setItem('gb:font-scale',x),s);
 for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(300);(res[r]??={})[mode]=await p.evaluate(probe);await p.close()}await c.close()}
const rows=Object.entries(res).filter(([r,x])=>x.base&&x.max&&x.base.len>200);
const ign=rows.filter(([r,x])=>x.max.fs/x.base.fs<1.1),ok=rows.filter(([r,x])=>x.max.fs/x.base.fs>=1.1);
fs.writeFileSync(process.argv[2],JSON.stringify(res,null,1));
console.log('pages with body prose',rows.length,'scale applied',ok.length,'IGNORED',ign.length);
const fam={};for(const [r,x] of ign){const k=r.split('/').slice(0,3).join('/').replace(/\/[^/]*$/,'/')+'…';(fam[r.split('/')[1]]??=[]).push(r)}
for(const [k,v] of Object.entries(fam))console.log('  ',k,v.length,v.slice(0,6).join(' '));
console.log('applied on:',ok.map(([r])=>r).join(' '));
await b.close();
