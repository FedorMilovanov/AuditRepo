import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');const E=process.argv[2];
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const probe=()=>{const vw=innerWidth;const vis=e=>{const s=getComputedStyle(e),R=e.getBoundingClientRect();return R.width>2&&R.height>2&&s.visibility!=='hidden'&&+s.opacity>0.05};
 const hdr=document.querySelector('header')||document.querySelector('[class*=header]');const ctl=hdr?[...hdr.querySelectorAll('a,button')].filter(vis):[];
 const off=ctl.filter(e=>{const R=e.getBoundingClientRect();return R.right>vw+1||R.left<-1}).map(e=>(e.getAttribute('aria-label')||e.textContent).trim().slice(0,25));
 const ov=[];for(let i=0;i<ctl.length;i++)for(let j=i+1;j<ctl.length;j++){const a=ctl[i].getBoundingClientRect(),c=ctl[j].getBoundingClientRect();if(ctl[i].contains(ctl[j])||ctl[j].contains(ctl[i]))continue;const w=Math.min(a.right,c.right)-Math.max(a.left,c.left),h=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top);if(w>4&&h>4)ov.push([ctl[i],ctl[j]].map(e=>(e.getAttribute('aria-label')||e.textContent).trim().slice(0,18)).join(' ⟂ '))}
 const h1=document.querySelector('h1');let h1c=null;if(h1&&vis(h1)){const R=h1.getBoundingClientRect();if(R.right>vw+1||h1.scrollWidth>h1.clientWidth+2)h1c=Math.round(R.right)}
 return {sw:document.documentElement.scrollWidth,vw,off,ov:ov.slice(0,4),h1c}};
const res={};
for(const w of [1024,1112,1180,1280]){const c=await b.newContext({viewport:{width:w,height:800},serviceWorkers:'block'});
 for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(300);const x=await p.evaluate(probe);(res[w]??={})[r]=x;
  if((x.off.length||x.ov.length||x.sw>w+1)&&!res['shot'+r]){res['shot'+r]=1;await p.screenshot({path:`${E}/w18-${w}-${r.replace(/\W+/g,'_')}.png`,clip:{x:0,y:0,width:w,height:160}})}await p.close()}await c.close()}
fs.writeFileSync(E+'/w18-midwidths-104.json',JSON.stringify(res,null,1));
for(const w of [1024,1112,1180,1280]){const o=Object.entries(res[w]);const f=k=>o.filter(([r,x])=>k(x));
 const a=f(x=>x.sw>x.vw+1),bb=f(x=>x.off.length),c=f(x=>x.ov.length),d=f(x=>x.h1c);
 console.log(w,'overflow',a.length,'hdr-offscreen',bb.length,'hdr-overlap',c.length,'h1-clipped',d.length);
 for(const [n,L] of [['OF',a],['OFF',bb],['OV',c],['H1',d]])if(L.length)console.log('  ',n,JSON.stringify(L.slice(0,6).map(([r,x])=>r+' '+(n=='OF'?x.sw:n=='OFF'?x.off:n=='OV'?x.ov[0]:x.h1c))))}
await b.close();
