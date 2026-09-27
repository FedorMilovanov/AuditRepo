import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const E=process.argv[2];const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const out={};
for(const [v,vp] of [['d',{width:1366,height:900}],['m',{width:390,height:844}]]){
const c=await b.newContext({viewport:vp,forcedColors:'active',serviceWorkers:'block'});
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(500);
 const d=await p.evaluate(()=>{const fc=matchMedia('(forced-colors: active)').matches;
  const ctr=[...document.querySelectorAll('button,a[href],[role=button],[role=switch],[role=radio],input[type=checkbox],input[type=radio]')].filter(e=>{const R=e.getBoundingClientRect();const s=getComputedStyle(e);return R.width>8&&R.height>8&&R.bottom>0&&R.top<innerHeight*3&&s.visibility!=='hidden'&&+s.opacity>0.2});
  const iconOnly=ctr.filter(e=>!e.textContent.trim()&&!e.querySelector('svg,img,input'));
  const noVisual=iconOnly.filter(e=>{const s=getComputedStyle(e),a=getComputedStyle(e,'::before'),bf=getComputedStyle(e,'::after');const hasBorder=parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none';const pseudoTxt=[a,bf].some(x=>x.content&&x.content!=='none'&&x.content!=='""'&&x.content!=="''");return !hasBorder&&!pseudoTxt});
  const grp={};for(const e of noVisual){const k=e.tagName+'.'+String(e.className).split(' ')[0]+(e.getAttribute('aria-label')?' "'+e.getAttribute('aria-label').slice(0,28)+'"':'');grp[k]=(grp[k]||0)+1}
  // forced-color-adjust:none regions (author overrides)
  const fca=[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).forcedColorAdjust==='none'&&e.getBoundingClientRect().width>40).map(e=>e.tagName+'.'+String(e.className).split(' ')[0]).slice(0,5);
  return {fc,n:ctr.length,iconOnly:iconOnly.length,noVisual:noVisual.length,grp,fca}});
 (out[v]??={})[r]=d;await p.close()}
await c.close()}
fs.writeFileSync(E+'/forced-colors-104.json',JSON.stringify(out,null,1));
for(const v of ['d','m']){const o=out[v];console.log(v,'fc active',Object.values(o)[0]?.fc,'routes with invisible icon-only controls',Object.values(o).filter(d=>d.noVisual).length);
 const agg={};for(const [r,d] of Object.entries(o))for(const [k,n] of Object.entries(d.grp)){(agg[k]??={r:0,n:0,ex:r});agg[k].r++;agg[k].n+=n}
 for(const [k,x] of Object.entries(agg).sort((a,b)=>b[1].r-a[1].r).slice(0,12))console.log('   ',x.r,'routes',x.n,'els',k,'e.g.',x.ex);
 const f={};for(const d of Object.values(o))for(const k of d.fca)f[k]=(f[k]||0)+1;console.log('   forced-color-adjust:none',JSON.stringify(f).slice(0,300))}
await b.close();
