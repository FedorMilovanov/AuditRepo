import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const c=await b.newContext({viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'});
const out={};
for(const r of routes){const p=await c.newPage();try{await p.goto('http://127.0.0.1:8080'+r,{timeout:20000});await p.waitForTimeout(600);
 await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight/3));await p.waitForTimeout(400);
 const d=await p.evaluate(()=>{const run=document.getAnimations().filter(a=>a.playState==='running').map(a=>{const t=a.effect?.target;const tm=a.effect?.getComputedTiming?.()||{};return {n:a.animationName||a.transitionProperty||a.constructor.name,dur:tm.duration,iter:tm.iterations,el:t?(t.tagName+'.'+String(t.className?.baseVal??t.className).slice(0,40)):''}});
  return {run:run.filter(a=>a.iter===Infinity||a.dur>600),smooth:getComputedStyle(document.documentElement).scrollBehavior,vids:document.querySelectorAll('video[autoplay]').length,motionAttr:document.documentElement.dataset.readerMotion}});
 if(d.run.length||d.smooth==='smooth'||d.vids) out[r]=d;}catch(e){out[r]={err:e.message.slice(0,80)}} await p.close();}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
const agg={};for(const [r,d] of Object.entries(out))for(const a of d.run||[]){const k=a.n+' dur='+a.dur+' iter='+a.iter+' @ '+a.el;(agg[k]??=[]).push(r)}
for(const [k,v] of Object.entries(agg).sort((a,b)=>b[1].length-a[1].length))console.log(v.length,k,'|',v.slice(0,3).join(' '));
console.log('smooth-scroll routes:',Object.values(out).filter(d=>d.smooth==='smooth').length,'autoplay video:',Object.values(out).filter(d=>d.vids).length,'errs:',Object.values(out).filter(d=>d.err).length);
await b.close();
