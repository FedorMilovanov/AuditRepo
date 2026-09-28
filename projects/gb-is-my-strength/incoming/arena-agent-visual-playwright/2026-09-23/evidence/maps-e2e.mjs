import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const E=process.argv[2];const routes=['/karty/','/karty/avraam/','/karty/early-church/','/karty/ishod/','/karty/maccabim/','/karty/melachim/','/karty/pavel/','/karty/revelation/','/karty/shoftim/','/karty/shvatim/','/karty/yeshua/','/rodosloviye/','/app/'];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote','--use-gl=swiftshader']});
const out=[];
for(const [name,vp,mob] of [['m',{width:390,height:844},true],['d',{width:1366,height:900},false]]){
 const c=await b.newContext({viewport:vp,serviceWorkers:'block',isMobile:mob,hasTouch:mob});
 for(const r of routes){const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,120)));p.on('console',m=>{if(m.type()==='error'&&!/favicon|apple-touch|ERR_CONNECTION|tile|net::/.test(m.text()))errs.push('c:'+m.text().slice(0,120))});
  const fail=[];p.on('requestfailed',q=>{const u=q.url();if(u.startsWith('http://127'))fail.push(u.slice(21,100))});
  await p.goto('http://127.0.0.1:8080'+r,{waitUntil:'load'}).catch(e=>errs.push('goto '+e.message.slice(0,60)));await p.waitForTimeout(1800);
  const d=await p.evaluate(()=>{const vw=innerWidth,vh=innerHeight;const big=[...document.querySelectorAll('svg,canvas,.leaflet-container,.maplibregl-canvas,[class*=map]')].map(e=>{const R=e.getBoundingClientRect();return {t:e.tagName+'.'+String(e.className?.baseVal??e.className).slice(0,30),w:Math.round(R.width),h:Math.round(R.height),top:Math.round(R.top)}}).filter(x=>x.w*x.h>vw*vh*0.2).slice(0,3);
   const inter=[...document.querySelectorAll('main [role=button],main button,[data-place],[data-id],.marker,[class*=marker],[class*=pin],circle[tabindex],g[tabindex]')].filter(e=>{const R=e.getBoundingClientRect();return R.width>0&&R.top>0&&R.top<vh});
   return {big,nInter:inter.length,sw:document.documentElement.scrollWidth,vw,h1:document.querySelector('h1')?.textContent.trim().slice(0,40)||null}});
  let click=null;
  const cand=p.locator('[data-place]:visible, [class*=marker]:visible, [class*=pin]:visible, circle[tabindex]:visible, g[tabindex]:visible').first();
  if(await cand.count()){try{const before=await p.evaluate(()=>document.querySelectorAll('[role=dialog]:not([hidden]),[class*=panel]:not([hidden]),[class*=card][class*=open],[aria-expanded=true]').length);await cand.click({timeout:3000,force:true});await p.waitForTimeout(700);
    const after=await p.evaluate(()=>({n:document.querySelectorAll('[role=dialog]:not([hidden]),[class*=panel]:not([hidden]),[class*=card][class*=open],[aria-expanded=true]').length,focus:document.activeElement.tagName+'.'+String(document.activeElement.className?.baseVal??document.activeElement.className).slice(0,30)}));
    await p.keyboard.press('Escape');await p.waitForTimeout(300);
    const esc=await p.evaluate(()=>document.querySelectorAll('[role=dialog]:not([hidden]),[aria-expanded=true]').length);click={before,after,esc};}catch(e){click={err:e.message.slice(0,80)}}}
  const rec={v:name,r,...d,click,errs:errs.slice(0,4),fail:fail.slice(0,4)};out.push(rec);
  console.log(name,r.padEnd(22),'big',JSON.stringify(d.big).slice(0,110),'inter',d.nInter,'sw',d.sw+'/'+d.vw,'h1',d.h1,'| click',JSON.stringify(click),'| errs',errs.length?JSON.stringify(errs.slice(0,2)):0,fail.length?'FAIL '+fail.slice(0,2):'');
  await p.screenshot({path:`${E}/maps/${name}-${r.split('/').filter(Boolean).join('-')||'root'}.png`}).catch(()=>{});await p.close()}
 await c.close()}
fs.writeFileSync(E+'/maps-e2e.json',JSON.stringify(out,null,1));await b.close();
