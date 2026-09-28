import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';
const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
for(const w of [320,360,390,430]){
const c=await b.newContext({viewport:{width:w,height:844},serviceWorkers:'block',isMobile:true,hasTouch:true});
await c.addInitScript(()=>{const s=speechSynthesis;s.speak=()=>{}});
const p=await c.newPage();await p.goto('http://127.0.0.1:8080/articles/lot-i-sodom/');await p.waitForTimeout(500);
await p.locator('button:visible[aria-label="Озвучка"]').first().click();await p.waitForTimeout(800);
const d=await p.evaluate(()=>{const vw=innerWidth;const rr=e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.right),Math.round(r.top),Math.round(r.bottom)]};
 const chips=[...document.querySelectorAll('button')].filter(e=>/^\d(\.\d+)?×$/.test(e.textContent.trim())&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().top<80);
 const cont=chips[0]?.parentElement;const cs=cont?getComputedStyle(cont):null;
 const clipped=chips.filter(e=>{const r=e.getBoundingClientRect(),pr=cont.getBoundingClientRect();return r.right>pr.right+1||r.right>vw}).map(e=>e.textContent.trim());
 const others=[...document.querySelectorAll('header button, header a, [class*=hmtop] button, [class*=hmtop] a')].filter(e=>!chips.includes(e)&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().top<80);
 const ov=[];for(const o of others){const a=o.getBoundingClientRect();for(const ch of chips){const q=ch.getBoundingClientRect();if(a.left<q.right-1&&a.right>q.left+1&&a.top<q.bottom-1&&a.bottom>q.top+1)ov.push((o.getAttribute('aria-label')||o.textContent.trim()).slice(0,20)+'×'+ch.textContent.trim())}}
 const badge=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^1×$/.test(e.textContent.trim())&&!chips.includes(e)&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().top<80).map(rr);
 return {chips:chips.map(e=>e.textContent.trim()),contOverflow:cs&&cs.overflowX,clipped,ov,badge,chipsRect:chips.map(rr)}});
console.log(w,JSON.stringify(d));if(w===320)await p.screenshot({path:E+'/tts-speed-bar-320.png',clip:{x:0,y:0,width:w,height:70}});await c.close()}
await b.close();
