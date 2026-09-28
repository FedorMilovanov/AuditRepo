import {chromium} from '/tmp/gb/node_modules/playwright/index.mjs';import fs from 'fs';
const routes=fs.readFileSync('/tmp/routes.txt','utf8').trim().split('\n');
const b=await chromium.launch({executablePath:'/tmp/chromium',args:['--no-sandbox','--no-zygote']});
const probe=()=>{const ps=[...document.querySelectorAll('main p, article p')].filter(p=>p.textContent.trim().length>80&&p.getBoundingClientRect().width>100);const p=ps[0];
 const vw=innerWidth;const over=[...document.querySelectorAll('main *, article *')].filter(e=>{const R=e.getBoundingClientRect();return R.width>0&&R.right>vw+2&&getComputedStyle(e).position!=='fixed'&&!e.closest('[style*="overflow"],pre,table,.ctw-body,[class*=scroll],[class*=timeline],[class*=carousel],[class*=track]')}).length;
 return {fs:p?parseFloat(getComputedStyle(p).fontSize):null,pw:p?Math.round(p.getBoundingClientRect().width):null,sw:document.documentElement.scrollWidth,vw,over,scaleVar:getComputedStyle(document.documentElement).getPropertyValue('--gb-reader-font-scale').trim()}};
const out={};
for(const [v,vp] of [['m',{width:390,height:844}],['d',{width:1366,height:900}]]){
 for(const [mode,scale,meas] of [['base','1','normal'],['max','1.25','wide']]){
  const c=await b.newContext({viewport:vp,serviceWorkers:'block'});
  await c.addInitScript(([s,m])=>{localStorage.setItem('gb:font-scale',s);localStorage.setItem('gb:gill-measure:v1',m);localStorage.setItem('gb:hm-measure:v1',m)},[scale,meas]);
  for(const r of routes){const p=await c.newPage();await p.goto('http://127.0.0.1:8080'+r).catch(()=>{});await p.waitForTimeout(350);(out[v]??={})[r]??={};out[v][r][mode]=await p.evaluate(probe);await p.close()}
  await c.close()}}
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
for(const v of ['m','d']){const o=out[v];const rows=Object.entries(o).filter(([r,x])=>x.base.fs&&x.max.fs);
 const ignored=rows.filter(([r,x])=>x.max.fs/x.base.fs<1.1);const applied=rows.filter(([r,x])=>x.max.fs/x.base.fs>=1.1);
 const overflow=Object.entries(o).filter(([r,x])=>x.max.sw>x.max.vw+1&&!(x.base.sw>x.base.vw+1));const overEl=Object.entries(o).filter(([r,x])=>x.max.over>x.base.over);
 console.log(v,'pages with prose',rows.length,'scale applied',applied.length,'IGNORED',ignored.length);
 console.log('   ignored:',JSON.stringify(ignored.map(([r,x])=>r+' '+x.base.fs+'→'+x.max.fs).slice(0,40)));
 console.log('   new page overflow at max:',overflow.length,JSON.stringify(overflow.map(([r,x])=>r+' sw='+x.max.sw).slice(0,10)));
 console.log('   new overflowing elements at max:',overEl.length,JSON.stringify(overEl.map(([r,x])=>r+' '+x.base.over+'→'+x.max.over).slice(0,10)));
 if(v==='d'){const mw=rows.filter(([r,x])=>x.max.pw<=x.base.pw);console.log('   measure=wide not widening prose (desktop):',mw.length,'of',rows.length)}}
await b.close();
