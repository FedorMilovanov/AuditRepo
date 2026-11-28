/** W39 real browser gate. Run only inside an admitted, supervised job slot. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {makeServer} from './serve.mjs';
const root=process.env.HOREB_EVIDENCE_ROOT,executablePath=process.env.HOREB_BROWSER_PATH;
if(!root||!executablePath||process.env.HOREB_W39_ADMISSION!=='confirmed')throw Error('Requires exact evidence root, browser path and externally verified admission. Flag is not an admission controller.');
await fs.access(executablePath);
const folder=path.join(root,'W39c-approach-20261128');
const reportPath=path.join(folder,'w39h-browser-report.json');
try{await fs.access(reportPath);throw Error('Existing report; reconcile before rerun')}catch(e){if(e.code!=='ENOENT')throw e}
const server=await makeServer(root);
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
let browser;
const rows=[];
const report={status:'PARTIAL',rows,limitations:['Browser witness only; no physical grip or artistic acceptance.']};
const save=()=>fs.writeFile(reportPath,JSON.stringify(report,null,2));
try{
 await save();
 browser=await puppeteer.launch({executablePath,headless:true,protocolTimeout:90000,args:['--disable-background-networking','--disable-sync',...(process.env.HOREB_SWIFTSHADER==='1'?['--use-angle=swiftshader','--enable-unsafe-swiftshader']:[])]});
 for(const [width,height,isMobile,label] of [[1440,900,false,'desktop'],[390,844,true,'touch390']]){
  const page=await browser.newPage(),errors=[];
  try{
   page.setDefaultTimeout(45000);
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
   page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
   await page.setViewport({width,height,isMobile,hasTouch:isMobile,deviceScaleFactor:1});
   await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelector('#scene')?.dataset.ready==='true'||document.querySelector('#status')?.textContent.startsWith('Ошибка'));
   const state=()=>page.evaluate(()=>{const c=document.querySelector('#scene');return {ready:c.dataset.ready,shot:c.dataset.shot,time:Number(c.dataset.time),basketMeshes:Number(c.dataset.basketMeshes),morphMode:c.dataset.morphMode,morphGpuBytes:Number(c.dataset.estimatedMorphGpuBytes),nativeMorphGpuBytes:Number(c.dataset.nativeMorphGpuBytes),drawCalls:Number(c.dataset.drawCalls),triangles:Number(c.dataset.triangles),overflow:document.documentElement.scrollWidth>innerWidth,canvasWidth:c.width,canvasHeight:c.height,status:document.querySelector('#status').textContent}});
   let s=await state();assert.equal(s.ready,'true',s.status);assert.equal(s.basketMeshes,92);assert.equal(s.morphMode,'hybrid');assert(s.morphGpuBytes<s.nativeMorphGpuBytes*.01);assert(!s.overflow);
   const seek=async t=>{await page.$eval('#time',(el,t)=>{el.value=String(t);el.dispatchEvent(new Event('input',{bubbles:true}))},t);await page.waitForFunction(t=>Math.abs(Number(document.querySelector('#scene').dataset.time)-t)<.002,{},t);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))};
   const canvas=await page.$('#scene');const snap=async()=>Buffer.from(await canvas.screenshot({type:'png'}));
   await seek(0);const first=await snap();
   await seek(4.7);const end=await snap();assert(!first.equals(end),'End image identical to start');
   await seek(1.5);await page.click('[data-shot="hands"]');await page.waitForFunction(()=>document.querySelector('#scene').dataset.shot==='hands');
   const hands=await snap();assert(!hands.equals(end),'Camera did not change image');
   await page.click('[data-shot="house"]');await page.waitForFunction(()=>document.querySelector('#scene').dataset.shot==='house');
   await page.click('[data-shot="action"]');await page.waitForFunction(()=>document.querySelector('#scene').dataset.shot==='action');
   await page.click('#reset');await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.time)<.001);
   await page.click('#play');await page.waitForFunction(()=>Number(document.querySelector('#scene').dataset.time)>.25);
   await page.click('#play');await page.waitForFunction(()=>document.querySelector('#play').getAttribute('aria-pressed')==='false');
   const paused=await state();await new Promise(r=>setTimeout(r,200));assert.equal((await state()).time,paused.time);
   await seek(3.5);await page.click('#shadow');await page.waitForFunction(()=>document.querySelector('#shadow').getAttribute('aria-pressed')==='true');
   // Force a painted shadow frame, then verify the shader/console stayed clean.
   await snap();await page.click('#shadow');
   await seek(4.7);await page.click('#play');await page.waitForFunction(()=>{const t=Number(document.querySelector('#scene').dataset.time);return t>.05&&t<2});
   await page.click('#play');await seek(3.5);
   s=await state();assert(s.drawCalls>0&&s.triangles>0&&!s.overflow);
   const screenshot=path.join(folder,'w39h-'+label+'.png');await fs.writeFile(screenshot,Buffer.from(await page.screenshot({type:'png'})),{flag:'wx'});
   assert.equal(errors.length,0,errors.join('\n'));
   rows.push({label,state:s,firstSha256:createHash('sha256').update(first).digest('hex'),endSha256:createHash('sha256').update(end).digest('hex'),screenshot:path.basename(screenshot),errors});
   await save();
  }finally{await page.close()}
 }
 report.status='ART_HOLD_BROWSER_SAMPLED_PASS';await save();console.log(JSON.stringify(report));
}catch(e){report.status='HOLD_BROWSER_FAILED';report.error=String(e.stack||e);await save();throw e}
finally{try{await browser?.close()}finally{await new Promise(resolve=>server.close(resolve))}}
