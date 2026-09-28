import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const [r,w] of [['/articles/krajne-li-isporcheno-serdce/',390],['/articles/kod-da-vinchi/',390],['/articles/kod-da-vinchi/',320]]){
const c=await b.newContext({viewport:{width:w,height:740},serviceWorkers:'block',isMobile:true,hasTouch:true});const p=await c.newPage();
await p.goto('http://127.0.0.1:8080'+r);await p.waitForTimeout(500);
const sel='.fn-marker';
const all=p.locator(sel+':visible');const n=await all.count();if(!n){console.log(r,'no visible markers');continue}
for(const k of [0,Math.floor(n/2),n-1]){const el=all.nth(k);await el.scrollIntoViewIfNeeded();await p.waitForTimeout(200);
 const mk=await el.boundingBox();await el.tap();await p.waitForTimeout(600);
 const t=await p.evaluate(()=>[...document.querySelectorAll('[role=tooltip]')].map(e=>{const R=e.getBoundingClientRect(),s=getComputedStyle(e);return {vis:s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.1&&R.width>0,pos:s.position,t:Math.round(R.top),b:Math.round(R.bottom),l:Math.round(R.left),r:Math.round(R.right),txt:e.textContent.trim().slice(0,30)}}).filter(x=>x.vis));
 console.log(w,r.split('/')[2],'marker#'+k,'markerTop',Math.round(mk.y),JSON.stringify(t));
 if(t.some(x=>x.t<0||x.b>740))await p.screenshot({path:`${E}/tooltip-clip-${r.split('/')[2]}-${w}-${k}.png`});
 await p.mouse.click(w/2,300);await p.waitForTimeout(300);
 const still=await p.evaluate(()=>[...document.querySelectorAll('[role=tooltip]')].filter(e=>{const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.1&&e.getBoundingClientRect().width>0}).length);console.log('   after outside tap visible:',still);
 await p.keyboard.press('Escape');await p.waitForTimeout(200)}
await c.close()}
await b.close();
