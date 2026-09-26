import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const E=process.argv[2];const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const res=[];let shots=0;
for(const w of [320,390]){const c=await b.newContext({viewport:{width:w,height:740},serviceWorkers:'block',isMobile:true,hasTouch:true});
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(400);
 const idx=await p.evaluate(()=>{const t=[...document.querySelectorAll('.tooltip-trigger,.gtip,.fn-marker')].filter(e=>e.getBoundingClientRect().width>0);t.forEach((e,i)=>e.dataset.auTip=i);
  const byX=[...t].sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right);const pick=new Set([t[0],byX[0],byX[1],[...t].sort((a,b)=>a.getBoundingClientRect().left-b.getBoundingClientRect().left)[0],t[t.length-1]].filter(Boolean).map(e=>e.dataset.auTip));return [...pick]});
 if(!idx.length){await p.close();continue}
 for(const i of idx){const el=p.locator(`[data-au-tip="${i}"]`);await el.scrollIntoViewIfNeeded().catch(()=>{});await p.evaluate(()=>scrollBy(0,-200));await p.waitForTimeout(150);
  const kind=await el.getAttribute('class');const txt=(await el.textContent()).trim().slice(0,25);
  await el.tap({timeout:2000}).catch(()=>{});await p.waitForTimeout(450);
  const pop=await p.evaluate(()=>{const vw=innerWidth,vh=innerHeight;const c=[...document.querySelectorAll('[role=tooltip],[role=dialog],.tooltip,.gb-tooltip,[class*=tooltip-pop],[class*=popover],[class*=tip-box],[class*=fn-pop],[class*=note-pop],[class*=sheet]')].filter(e=>{const R=e.getBoundingClientRect();const cs=getComputedStyle(e);return R.width>40&&R.height>20&&cs.visibility!=='hidden'&&cs.display!=='none'&&+cs.opacity>0.1&&!e.classList.contains('tooltip-trigger')&&R.bottom>0&&R.top<vh});
   const e=c.sort((a,b)=>b.getBoundingClientRect().width*b.getBoundingClientRect().height-0)[0];if(!e)return null;const R=e.getBoundingClientRect();
   return {cls:String(e.className).slice(0,40),role:e.getAttribute('role'),l:Math.round(R.left),r:Math.round(R.right),t:Math.round(R.top),b:Math.round(R.bottom),vw,vh,out:R.left<-1||R.right>vw+1||R.top<-1||R.bottom>vh+1,scrollable:e.scrollHeight>e.clientHeight+2}});
  const url=p.url();
  let closed=null;if(pop){await p.mouse.click(5,Math.round(740/2)).catch(()=>{});await p.waitForTimeout(300);closed=await p.evaluate(c=>![...document.querySelectorAll('.'+c.split(' ')[0])].some(e=>{const R=e.getBoundingClientRect();const s=getComputedStyle(e);return R.width>40&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.1}),pop.cls||'x').catch(()=>null)}
  const rec={w,r,kind,txt,pop,closed,nav:url!=='http://127.0.0.1:8080'+r?url.slice(21):null};res.push(rec);
  if(pop?.out&&shots<6){shots++;await el.tap().catch(()=>{});await p.waitForTimeout(400);await p.screenshot({path:`${E}/tooltip-out-${shots}-${w}.png`})}
  await p.keyboard.press('Escape');await p.waitForTimeout(100);}
 await p.close()}
await c.close()}
fs.writeFileSync(E+'/tooltips-mobile.json',JSON.stringify(res,null,1));
const tot=res.length,nopop=res.filter(x=>!x.pop&&!x.nav),out=res.filter(x=>x.pop?.out),notclosed=res.filter(x=>x.pop&&x.closed===false);
console.log('taps',tot,'routes',new Set(res.map(x=>x.r)).size,'no-popup',nopop.length,'out-of-viewport',out.length,'not closed by outside tap',notclosed.length,'navigated',res.filter(x=>x.nav).length);
for(const x of out.slice(0,15))console.log(' OUT',x.w,x.r,x.kind,'"'+x.txt+'"',JSON.stringify(x.pop));
const g=a=>Object.entries(a.reduce((m,x)=>{const k=x.r+' ['+x.kind+']';m[k]=(m[k]||0)+1;return m},{})).slice(0,12);
console.log('NOPOP',JSON.stringify(g(nopop)));console.log('NOTCLOSED',JSON.stringify(g(notclosed)));
await b.close();
