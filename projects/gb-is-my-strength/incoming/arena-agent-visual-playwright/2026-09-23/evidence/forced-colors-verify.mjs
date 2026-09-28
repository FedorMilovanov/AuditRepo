import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const [fc,tag] of [['active','fc'],['none','normal']]){
 let c=await b.newContext({viewport:{width:390,height:844},forcedColors:fc,isMobile:true,hasTouch:true});let p=await c.newPage();
 await p.goto('http://127.0.0.1:8080/nagornaya/chast-1/');await p.waitForTimeout(700);
 const m=p.locator('button[aria-label="Открыть меню"]').first();
 console.log(tag,'menu btn',JSON.stringify(await m.evaluate(e=>{const s=getComputedStyle(e);return {html:e.innerHTML.slice(0,160),bg:s.backgroundImage.slice(0,60),mask:s.maskImage||s.webkitMaskImage,rect:e.getBoundingClientRect().toJSON()}})));
 const bb=await m.boundingBox();await p.screenshot({path:`${E}/fc-nagornaya-menu-${tag}.png`,clip:{x:Math.max(0,bb.x-60),y:Math.max(0,bb.y-10),width:Math.min(390-Math.max(0,bb.x-60),160),height:bb.height+20}});
 await c.close();
 c=await b.newContext({viewport:{width:1366,height:900},forcedColors:fc});p=await c.newPage();await p.goto('http://127.0.0.1:8080/articles/20-antisovetov-pastoru/');await p.waitForTimeout(700);
 const t=p.locator('.map-trigger:visible').first();await t.scrollIntoViewIfNeeded();
 console.log(tag,'dove',JSON.stringify(await t.evaluate(e=>{const a=getComputedStyle(e,'::before'),s=getComputedStyle(e);return {txt:e.textContent,beforeContent:a.content.slice(0,30),beforeBg:a.backgroundImage.slice(0,50),beforeMask:(a.maskImage||a.webkitMaskImage||'').slice(0,50),bg:s.backgroundImage.slice(0,50),mask:(s.maskImage||s.webkitMaskImage||'').slice(0,50),w:e.getBoundingClientRect().width}})));
 const tb=await t.boundingBox();await p.screenshot({path:`${E}/fc-antisovetov-dove-${tag}.png`,clip:{x:Math.max(0,tb.x-220),y:Math.max(0,tb.y-20),width:260,height:50}});
 await p.goto('http://127.0.0.1:8080/map/');await p.waitForTimeout(700);
 console.log(tag,'map inputs',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width>8).map(i=>({type:i.type,label:i.labels?.[0]?.textContent.trim().slice(0,20)||i.getAttribute('aria-label'),app:getComputedStyle(i).appearance,w:Math.round(i.getBoundingClientRect().width)})))));
 await p.screenshot({path:`${E}/fc-map-${tag}.png`});await c.close()}
await b.close();
