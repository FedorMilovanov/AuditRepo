import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n').filter(r=>!/karty|konfessii|^\/map|^\/app|rodosloviye/.test(r));
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:1000,height:1400},serviceWorkers:'block'});
const rows=[];
for(const r of routes){const p=await c.newPage();try{await p.goto('http://127.0.0.1:8080'+r,{timeout:30000});await p.waitForTimeout(500);
 const tag=()=>p.evaluate(()=>{let i=0;for(const e of document.querySelectorAll('main p, main li, article p, article li')){e.dataset.auditP=e.dataset.auditP||String(i++)}});
 await tag();
 const scr=await p.evaluate(()=>[...document.querySelectorAll('[data-audit-p]')].filter(e=>e.getBoundingClientRect().height>0&&e.textContent.trim().length>20).map(e=>e.dataset.auditP));
 await p.emulateMedia({media:'print'});await p.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await p.waitForTimeout(400);
 const lost=await p.evaluate(ids=>ids.map(id=>document.querySelector(`[data-audit-p="${id}"]`)).filter(e=>e&&e.getBoundingClientRect().height===0).map(e=>{const s=e.closest('section[id],aside,section,footer');return {why:getComputedStyle(e).display==='none'&&e.hasAttribute('data-print-terminal-follower')?'terminal':'other',sec:s?(s.id||s.className.toString().slice(0,30)):'-',t:e.textContent.trim().slice(0,40)}}),scr);
 const term=lost.filter(x=>x.why==='terminal');
 const secs=[...new Set(term.map(x=>x.sec))];
 rows.push({r,scr:scr.length,lost:lost.length,terminal:term.length,secs});
 if(term.length)console.log(r.padEnd(60),'screen',scr.length,'terminal-hidden',term.length,'sections:',secs.slice(0,4).join(', '),'| first:',term[0].t);
}catch(e){console.log('ERR',r,String(e).slice(0,80))}await p.close();}
fs.writeFileSync('/tmp/aud/printall.json',JSON.stringify(rows,null,1));
console.log('ROUTES',rows.length,'AFFECTED',rows.filter(x=>x.terminal).length);
await b.close();
