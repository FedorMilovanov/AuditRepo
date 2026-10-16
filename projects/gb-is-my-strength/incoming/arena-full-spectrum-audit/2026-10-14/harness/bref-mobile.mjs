// Проблемные .bref на узком экране: ширина шита против вьюпорта, обрезка, консоль.
import { chromium } from 'playwright-core';
const EXE='/tmp/gbchrome/chrome.sh', BASE='http://127.0.0.1:8099';
const ROUTES=['/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/','/articles/kod-da-vinchi/','/articles/krajne-li-isporcheno-serdce/'];
const b=await chromium.launch({executablePath:EXE,args:['--no-sandbox']});
const out=[];
for(const route of ROUTES){
  const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3});
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,100))});
  await p.goto(BASE+route,{waitUntil:'load'}); await p.waitForTimeout(1200);
  const el=await p.evaluate(()=>{const e=document.querySelector('.bref[data-ref]');if(!e)return null;e.scrollIntoView({block:'center'});e.focus();e.click();return e.dataset.ref;});
  await p.waitForTimeout(450);
  const tip=await p.evaluate(()=>{const t=document.querySelector('body > .btip');if(!t)return{open:false};const r=t.getBoundingClientRect();
    return{open:true,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height),
      overflowRight:Math.round(r.right-window.innerWidth),overflowLeft:Math.round(-r.left),clipped:r.right>window.innerWidth+1||r.left<-1,
      scrollX:window.scrollX,docW:document.documentElement.scrollWidth,vw:window.innerWidth,
      text:t.innerText.trim().replace(/\s+/g,' ').slice(0,120)};});
  const horiz=await p.evaluate(()=>({docW:document.documentElement.scrollWidth,vw:window.innerWidth}));
  out.push({route,ref:el,tip,horizontalOverflow:horiz.docW>horiz.vw+1,overflowPx:horiz.docW-horiz.vw,consoleErrors:errs.slice(0,2)});
  await p.close();
}
await b.close();
console.log(JSON.stringify(out,null,1));
