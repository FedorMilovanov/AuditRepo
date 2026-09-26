import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const visTips=p=>p.evaluate(()=>{const vw=innerWidth,vh=innerHeight;return [...document.querySelectorAll('body *')].filter(e=>{if(e.closest('.tooltip-trigger')&&!e.matches('[role=tooltip]'))return false;const s=getComputedStyle(e);const R=e.getBoundingClientRect();return (e.matches('[role=tooltip],.tooltip,.gb-tooltip,[class*=tooltip-bubble],[class*=tooltip-pop],[data-tooltip-popup]')||(s.position==='fixed'||s.position==='absolute')&&/tooltip|tip/i.test(e.className))&&R.width>30&&R.height>14&&R.bottom>0&&R.top<vh&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.2}).map(e=>{const R=e.getBoundingClientRect();return {c:String(e.className).slice(0,30),t:e.textContent.trim().slice(0,40),l:Math.round(R.left),r:Math.round(R.right),top:Math.round(R.top),b:Math.round(R.bottom)}})});
const pageSets=[['/nagornaya/chast-1/','.tooltip-trigger'],['/nagornaya/chast-4/','.tooltip-trigger'],['/articles/20-antisovetov-pastoru/','.map-trigger'],['/articles/kod-da-vinchi/','.fn-marker']];
for(const [r,sel] of pageSets){
 // mobile tap
 let c=await b.newContext({viewport:{width:390,height:740},serviceWorkers:'block',isMobile:true,hasTouch:true});let p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(500);
 const attrs=await p.evaluate(s=>{const t=[...document.querySelectorAll(s)];return {n:t.length,tabbable:t.filter(e=>e.tabIndex>=0).length,role:t.filter(e=>e.getAttribute('role')).length,label:t.filter(e=>e.getAttribute('aria-describedby')||e.getAttribute('aria-label')).length,title:t.filter(e=>e.title).length}},sel);
 const base=(await visTips(p)).length;
 const el=p.locator(sel).nth(1);await el.scrollIntoViewIfNeeded().catch(()=>{});await p.evaluate(()=>scrollBy(0,-150));await el.tap({timeout:3000}).catch(()=>{});await p.waitForTimeout(500);
 const mt=await visTips(p);await p.screenshot({path:`${E}/tip14-mobile-${r.split('/').filter(Boolean).join('-')}.png`});
 await c.close();
 // desktop hover + keyboard
 c=await b.newContext({viewport:{width:1366,height:900},serviceWorkers:'block'});p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(500);
 const d=p.locator(sel).nth(1);await d.scrollIntoViewIfNeeded().catch(()=>{});await d.hover().catch(()=>{});await p.waitForTimeout(500);const ht=await visTips(p);
 await p.mouse.move(5,5);await p.waitForTimeout(400);
 await d.evaluate(e=>e.focus());const focused=await d.evaluate(e=>document.activeElement===e);await p.waitForTimeout(400);const ft=await visTips(p);
 await p.keyboard.press('Enter');await p.waitForTimeout(400);const et=await visTips(p);await p.keyboard.press('Escape');await p.waitForTimeout(300);const esc=await visTips(p);
 console.log(r,sel,JSON.stringify(attrs),'| base',base,'| mobileTap',mt.length,JSON.stringify(mt[0]||null).slice(0,120),'| hover',ht.length,'| focusable',focused,'focusShows',ft.length,'enter',et.length,'afterEsc',esc.length);
 await c.close()}
await b.close();
