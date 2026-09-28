import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const [vn,vp] of [['d',{width:1440,height:900}],['m',{width:390,height:844}]]){
const c=await b.newContext({viewport:vp,isMobile:vn=='m',hasTouch:vn=='m',serviceWorkers:'block',reducedMotion:'reduce'});
for(const r of routes){const p=await c.newPage();try{await p.goto('http://127.0.0.1:8080'+r,{timeout:30000});await p.waitForTimeout(500);
const hit=await p.evaluate(()=>{
 const fixed=[...document.querySelectorAll('header,nav,[class*=navbar],[class*=topbar],[class*=top-bar]')].filter(e=>{const s=getComputedStyle(e);const b=e.getBoundingClientRect();return (s.position==='fixed'||s.position==='sticky')&&b.top<=2&&b.height>20&&b.height<140&&s.visibility!=='hidden'&&parseFloat(s.opacity)>0.1});
 if(!fixed.length)return null;const hb=Math.max(...fixed.map(e=>e.getBoundingClientRect().bottom));
 const texts=[...document.querySelectorAll('h1,h2,p,a,li,span,time')].filter(e=>{if(fixed.some(f=>f.contains(e)))return false;const s=getComputedStyle(e);if(s.position==='fixed'||s.visibility==='hidden'||parseFloat(s.opacity)<0.2)return false;if(e.closest('[aria-hidden=true],.sr-only,.skip-link,[class*=skip]'))return false;const b=e.getBoundingClientRect();return b.width>20&&b.height>8&&b.top>=0&&b.top<hb-4&&e.textContent.trim().length>2&&e.children.length<3});
 // verify actually occluded: elementFromPoint center returns header
 const occ=texts.filter(e=>{const b=e.getBoundingClientRect();const x=b.left+Math.min(b.width/2,40),y=b.top+b.height/2;if(y>=innerHeight)return false;const t=document.elementFromPoint(x,y);return t&&fixed.some(f=>f.contains(t))}).slice(0,3);
 return occ.length?{hb:Math.round(hb),occ:occ.map(e=>e.tagName+':'+e.textContent.trim().slice(0,30)+'@'+Math.round(e.getBoundingClientRect().top))}:null});
if(hit)console.log(vn,r,JSON.stringify(hit));}catch(e){console.log('ERR',r)}await p.close();}
await c.close();}
await b.close();
