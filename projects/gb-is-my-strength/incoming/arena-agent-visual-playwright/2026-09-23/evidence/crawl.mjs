import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const B='http://127.0.0.1:8080';
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const vps={d:{width:1440,height:900},m:{width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2}};
const out=[];
for(const [vn,vp] of Object.entries(vps)){
 const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height},isMobile:!!vp.isMobile,hasTouch:!!vp.hasTouch,deviceScaleFactor:vp.deviceScaleFactor||1,serviceWorkers:'block'});
 for(const r of routes){
  const p=await ctx.newPage(); const rec={r,vn,console:[],pageerr:[],bad:[]};
  p.on('console',m=>{if(['error','warning'].includes(m.type()))rec.console.push(m.type()+': '+m.text().slice(0,200))});
  p.on('pageerror',e=>rec.pageerr.push(String(e).slice(0,200)));
  p.on('response',s=>{if(s.status()>=400)rec.bad.push(s.status()+' '+s.url().replace(B,''))});
  p.on('requestfailed',q=>{const u=q.url(); if(!u.startsWith(B)) rec.bad.push('EXT '+u.slice(0,80)); else rec.bad.push('FAIL '+u.replace(B,''))});
  try{await p.goto(B+r,{waitUntil:'load',timeout:30000});await p.waitForTimeout(700);}catch(e){rec.nav=String(e).slice(0,120)}
  rec.m=await p.evaluate(()=>{
   const W=document.documentElement.clientWidth;const res={};
   res.scrollW=document.documentElement.scrollWidth;res.W=W;
   res.over=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);if(s.position==='fixed'||s.visibility==='hidden'||s.display==='none')return false;const b=e.getBoundingClientRect();return b.width>0&&b.right>W+2&&!e.closest('[aria-hidden=true],.sr-only,.visually-hidden')}).slice(0,6).map(e=>e.tagName+'.'+(e.className?.baseVal??e.className).toString().slice(0,40)+' r='+Math.round(e.getBoundingClientRect().right));
   res.brokenImg=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.getAttribute('loading')!=='lazy').map(i=>i.getAttribute('src')).slice(0,5);
   const ids={};document.querySelectorAll('[id]').forEach(e=>ids[e.id]=(ids[e.id]||0)+1);res.dupIds=Object.entries(ids).filter(([k,v])=>v>1).map(([k,v])=>k+'x'+v).slice(0,8);
   const vis=e=>{const b=e.getBoundingClientRect();const s=getComputedStyle(e);return b.width>0&&b.height>0&&s.visibility!=='hidden'};
   res.noName=[...document.querySelectorAll('button,a[href],[role=button]')].filter(vis).filter(e=>!((e.innerText||e.textContent||"").trim()||e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')||e.getAttribute('title')||e.querySelector('img[alt]:not([alt=""]),svg title'))).slice(0,5).map(e=>e.outerHTML.slice(0,120));
   res.imgNoAlt=[...document.images].filter(i=>!i.hasAttribute('alt')).length;
   res.h1=document.querySelectorAll('h1').length;res.title=document.title;res.lang=document.documentElement.lang;
   res.small=[...document.querySelectorAll('button,a[href],[role=button],input,select')].filter(vis).filter(e=>{const b=e.getBoundingClientRect();return (b.width<24||b.height<24)&&!e.closest('p,li,td,figcaption,.prose,article p')}).slice(0,5).map(e=>(e.getAttribute("aria-label")||e.innerText||e.textContent||"").toString().trim().slice(0,30)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height));
   return res;});
  await p.screenshot({path:`/tmp/aud/shots/${vn}${r.replace(/\//g,'_')||'_'}.png`});
  out.push(rec);await p.close();
 }
 await ctx.close();
}
fs.writeFileSync('/tmp/aud/crawl.json',JSON.stringify(out,null,1));await b.close();
