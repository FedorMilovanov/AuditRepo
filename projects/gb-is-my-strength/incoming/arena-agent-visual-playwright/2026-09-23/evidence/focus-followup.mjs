import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const E=process.argv[2];const o=JSON.parse(fs.readFileSync(E+'/focus-invisible-skip-104.json')).d;
console.log('no skip-link:',Object.entries(o).filter(([r,d])=>!d.skip).map(([r])=>r).join(' '));
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const p=await b.newPage({viewport:{width:1366,height:900}});
await p.goto('http://127.0.0.1:8080/');await p.waitForTimeout(500);
const a=p.locator('a.heading-anchor').first();await a.focus();await p.waitForTimeout(300);
console.log('heading-anchor on focus:',JSON.stringify(await a.evaluate(e=>{const s=getComputedStyle(e),R=e.getBoundingClientRect();return {op:s.opacity,w:R.width,h:R.height,outline:s.outlineStyle+' '+s.outlineWidth}})));
const st=p.locator('button.h-scroll-top');await st.focus();await p.waitForTimeout(300);console.log('scroll-top on focus:',JSON.stringify(await st.evaluate(e=>{const s=getComputedStyle(e),R=e.getBoundingClientRect();return {op:s.opacity,vis:s.visibility,w:R.width,top:R.top}})));
// skip link usage on article
await p.goto('http://127.0.0.1:8080/articles/lot-i-sodom/');await p.waitForTimeout(500);await p.evaluate(()=>document.activeElement.blur());
await p.keyboard.press('Tab');const first=await p.evaluate(()=>{const a=document.activeElement,R=a.getBoundingClientRect();return {txt:a.textContent.trim().slice(0,30),href:a.getAttribute('href'),vis:R.width>2&&R.top>=0&&R.top<100,rect:[R.left,R.top,R.width,R.height].map(Math.round)}});
console.log('1st Tab on article:',JSON.stringify(first));await p.screenshot({path:E+'/skip-link-first-tab.png',clip:{x:0,y:0,width:1366,height:120}});
await p.keyboard.press('Enter');await p.waitForTimeout(400);await p.keyboard.press('Tab');
console.log('after skip Enter+Tab focus:',await p.evaluate(()=>{const a=document.activeElement;return a.tagName+'.'+String(a.className).slice(0,30)+' "'+(a.getAttribute('aria-label')||a.textContent.trim()).slice(0,30)+'" inMain='+!!a.closest('main,article')}));
// tab sequence first 45 on article: what is it
await p.goto('http://127.0.0.1:8080/articles/lot-i-sodom/');await p.waitForTimeout(500);await p.evaluate(()=>document.activeElement.blur());
const seq=[];for(let i=0;i<46;i++){await p.keyboard.press('Tab');seq.push(await p.evaluate(()=>{const a=document.activeElement;const reg=a.closest('header,nav,aside,[class*=rail],[class*=toc],[class*=cluster],[class*=ember],main,footer');return (reg?reg.tagName+'.'+String(reg.className).split(' ')[0]:'?')}))}
const cnt={};seq.forEach(x=>cnt[x]=(cnt[x]||0)+1);console.log('first 46 tab stops by region:',JSON.stringify(cnt));
await b.close();
