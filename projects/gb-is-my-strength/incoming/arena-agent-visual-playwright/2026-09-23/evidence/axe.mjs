import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const axe=fs.readFileSync('/tmp/chr/node_modules/axe-core/axe.min.js','utf8');
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const ctx=await b.newContext({viewport:{width:1440,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
const agg={};
for(const r of routes){const p=await ctx.newPage();
 try{await p.goto('http://127.0.0.1:8080'+r,{waitUntil:'load',timeout:30000});await p.waitForTimeout(600);
 await p.addScriptTag({content:axe});
 const res=await p.evaluate(async()=>{const o=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']},resultTypes:['violations']});return o.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,n:v.nodes.length,ex:v.nodes.slice(0,3).map(n=>({t:n.target.join(' ').slice(0,90),s:(n.any[0]?.message||n.failureSummary||'').slice(0,140)}))}))});
 for(const v of res){(agg[v.id]??={impact:v.impact,help:v.help,pages:{},total:0});agg[v.id].pages[r]=v.ex;agg[v.id].total+=v.n}}catch(e){console.log('ERR',r,String(e).slice(0,100))}
 await p.close();}
fs.writeFileSync('/tmp/aud/axe.json',JSON.stringify(agg,null,1));
for(const [k,v] of Object.entries(agg).sort((a,b)=>Object.keys(b[1].pages).length-Object.keys(a[1].pages).length))console.log(k.padEnd(28),v.impact.padEnd(9),'pages',String(Object.keys(v.pages).length).padStart(3),'nodes',v.total,'|',v.help);
await b.close();
