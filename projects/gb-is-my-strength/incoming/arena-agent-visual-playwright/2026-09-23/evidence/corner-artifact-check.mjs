import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:740},serviceWorkers:'block',isMobile:true,hasTouch:true});
const hits={};
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(300);
 await p.evaluate(()=>scrollTo(0,1500));await p.waitForTimeout(400);
 const d=await p.evaluate(()=>{const e=document.elementFromPoint(8,8);if(!e)return null;const R=e.getBoundingClientRect();if(R.width>60||R.height>60)return null;const s=getComputedStyle(e);return e.tagName+'#'+e.id+'.'+String(e.className).slice(0,40)+' '+Math.round(R.width)+'x'+Math.round(R.height)+' bg='+s.backgroundColor+' z='+s.zIndex+' pos='+s.position});
 if(d)(hits[d]??=[]).push(r);await p.close()}
for(const [k,v] of Object.entries(hits))console.log(v.length,k,v.slice(0,4).join(' '));await b.close();
