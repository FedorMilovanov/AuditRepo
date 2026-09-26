import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const [mob,vp] of [[true,{width:390,height:740}],[false,{width:1366,height:900}]]){
 const c=await b.newContext({viewport:vp,serviceWorkers:'block',isMobile:mob,hasTouch:mob});
 let p=await c.newPage();await p.goto('http://127.0.0.1:8080/articles/20-antisovetov-pastoru/');await p.waitForTimeout(600);
 const t=p.locator('.map-trigger:visible').first();await t.scrollIntoViewIfNeeded();await p.evaluate(()=>scrollBy(0,-150));
 if(mob)await t.tap();else await t.click();await p.waitForTimeout(600);
 const st=await p.evaluate(()=>{const po=document.getElementById('gbStrategicMapPopover')||document.querySelector('.gb-strategic-map-popover');const R=po?.getBoundingClientRect();return po?{hidden:po.hidden,active:po.classList.contains('active'),role:po.getAttribute('role'),rect:R&&[Math.round(R.left),Math.round(R.top),Math.round(R.right),Math.round(R.bottom)],txt:po.textContent.trim().slice(0,60),vw:innerWidth,vh:innerHeight,focus:document.activeElement.className.toString().slice(0,40),inv:document.querySelector('[data-gb-strategic-map-invalid]')?.dataset.gbStrategicMapInvalid||document.documentElement.dataset.gbStrategicMapInvalid||null}:'NO POPOVER'});
 console.log(mob?'m':'d','antisovetov',JSON.stringify(st));
 await p.screenshot({path:`${E}/tip14-antisovetov-${mob?'m':'d'}-after.png`});
 if(!mob){await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('  after Esc hidden:',await p.evaluate(()=>document.querySelector('.gb-strategic-map-popover')?.hidden),'focus back:',await p.evaluate(()=>document.activeElement.classList.contains('map-trigger')))}
 await p.close();
 p=await c.newPage();await p.goto('http://127.0.0.1:8080/nagornaya/chast-1/');await p.waitForTimeout(600);
 const n=p.locator('.tooltip-trigger:visible').nth(1);await n.scrollIntoViewIfNeeded();await p.evaluate(()=>scrollBy(0,-150));
 const siteJs=await p.evaluate(()=>[...document.scripts].map(s=>s.src).filter(s=>/site\.js|enhancements/.test(s)).map(s=>s.split('/').pop()));
 if(mob)await n.tap();else await n.hover();await p.waitForTimeout(700);
 const ns=await p.evaluate(()=>{const tr=document.querySelectorAll('.tooltip-trigger')[1];const cand=[...document.querySelectorAll('body > *, [class*=tooltip], [class*=tip]')].filter(e=>!e.classList.contains('tooltip-trigger')&&e.getBoundingClientRect().width>30&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none'&&+getComputedStyle(e).opacity>0.2&&e.textContent.includes(tr.dataset.tooltip.slice(0,15)));
  const after=getComputedStyle(tr,'::after'),before=getComputedStyle(tr,'::before');
  return {tip:tr.dataset.tooltip.slice(0,40),shownBy:cand.map(e=>e.tagName+'.'+String(e.className).slice(0,30)).slice(0,3),after:after.content.slice(0,40),afterOp:after.opacity,before:before.content.slice(0,30),cursor:getComputedStyle(tr).cursor,border:getComputedStyle(tr).borderBottomStyle,gbTip:tr.dataset.gbTooltipReady||null}});
 console.log(mob?'m':'d','nagornaya',JSON.stringify(ns),'scripts',JSON.stringify(siteJs));
 await p.screenshot({path:`${E}/tip14-nagornaya-${mob?'m':'d'}-after.png`});
 await c.close()}
await b.close();
