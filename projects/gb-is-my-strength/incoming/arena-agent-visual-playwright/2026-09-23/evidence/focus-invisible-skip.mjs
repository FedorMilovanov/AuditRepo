import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const out={};
for(const [v,vp] of [['d',{width:1366,height:900}],['m',{width:390,height:844}]]){
const c=await b.newContext({viewport:vp,serviceWorkers:'block'});
for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(500);
 const d=await p.evaluate(()=>{const sel='a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"])';
  const els=[...document.querySelectorAll(sel)].filter(e=>!e.disabled&&!e.closest('[inert],[hidden],[aria-hidden=true]')&&e.tabIndex>=0);
  const inv=els.filter(e=>{const s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden')return false;let x=e.parentElement;while(x){const t=getComputedStyle(x);if(t.display==='none'||t.visibility==='hidden')return false;x=x.parentElement}
   const R=e.getBoundingClientRect();const clipped=(s.clipPath&&s.clipPath!=='none')||s.clip!=='auto';
   return (R.width<2||R.height<2||+s.opacity===0)&&!clipped&&!/skip|sr-only|visually-hidden/i.test(e.className)});
  const grp={};for(const e of inv){const k=e.tagName+'.'+String(e.className?.baseVal??e.className).split(' ').slice(0,2).join('.')+(e.getAttribute('aria-label')?' "'+e.getAttribute('aria-label').slice(0,25)+'"':'');grp[k]=(grp[k]||0)+1}
  const skip=[...document.querySelectorAll('a[href^="#"]')].find(a=>/перейти|к содержан|к основн|skip/i.test(a.textContent+(a.getAttribute('aria-label')||'')));
  let tgt=null;if(skip){const h=skip.getAttribute('href').slice(1);tgt=!!(h&&document.getElementById(h))}
  return {total:els.length,invisible:inv.length,grp,skip:skip?{txt:skip.textContent.trim().slice(0,30),href:skip.getAttribute('href'),target:tgt}:null}});
 let steps=null;if(v==='d'){await p.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0)});
  for(let i=1;i<=60;i++){await p.keyboard.press('Tab');const inMain=await p.evaluate(()=>{const a=document.activeElement;return !!a&&a!==document.body&&!!a.closest('main, article')&&!a.closest('header,nav,.h-navbar,aside,[class*=rail],[class*=toc],[class*=breadcrumb]')});if(inMain){steps=i;break}}}
 d.tabToContent=steps;(out[v]??={})[r]=d;await p.close()}
await c.close()}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
for(const v of ['d','m']){const o=out[v];const rs=Object.entries(o).filter(([r,d])=>d.invisible>0);const agg={};for(const [r,d] of rs)for(const [k,n] of Object.entries(d.grp)){(agg[k]??={n:0,r:0,ex:r});agg[k].n+=n;agg[k].r++}
 console.log(v,'routes with invisible focusables',rs.length,'/',Object.keys(o).length,'total',rs.reduce((a,[r,d])=>a+d.invisible,0));
 for(const [k,x] of Object.entries(agg).sort((a,b)=>b[1].n-a[1].n).slice(0,14))console.log('   ',x.r,'routes',x.n,'els',k,'e.g.',x.ex);
 if(v==='d'){const sk=Object.values(o).filter(d=>d.skip).length;const bad=Object.entries(o).filter(([r,d])=>d.skip&&!d.skip.target).map(([r])=>r);const slow=Object.entries(o).map(([r,d])=>[r,d.tabToContent]).filter(([r,t])=>t===null||t>15);
  console.log('skip-link present',sk,'/',Object.keys(o).length,'broken target',bad.length,JSON.stringify(bad.slice(0,5)));console.log('Tab-to-content >15 or never(60):',slow.length,JSON.stringify(slow.slice(0,12)));}}
await b.close();
