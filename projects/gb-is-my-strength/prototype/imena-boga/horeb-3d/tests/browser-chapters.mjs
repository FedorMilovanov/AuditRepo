// W5A: independently verify two ACTUAL 3D scene modes, not merely hidden UI.
// The primary Horeb chapter may physically construct only Exodus 3 props.
// Legacy 42-item QA remains available, using the same World engine.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const chrome=[process.env.HOREB_BROWSER_PATH,process.env.PUPPETEER_EXECUTABLE_PATH,
 '/usr/bin/google-chrome','/usr/bin/chromium',
 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
 .find(x=>x&&existsSync(x));
if(!chrome)throw new Error('CHAPTERS: real Chrome missing');
const args=process.env.HOREB_SWIFTSHADER==='1'
 ? ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:[];
if(process.env.HOREB_NO_SANDBOX==='1')args.push('--no-sandbox','--disable-setuid-sandbox');
const browser=await puppeteer.launch({executablePath:chrome,headless:true,args,protocolTimeout:120000});
const base=(process.env.HOREB_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');
const out=join(process.cwd(),'.test-build','screenshots');
mkdirSync(out,{recursive:true});
let page;
try{
 page=await browser.newPage();
 await page.setViewport({width:1024,height:768,deviceScaleFactor:1});
 page.setDefaultTimeout(60000);
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(base+'/?e2e',{waitUntil:'domcontentloaded',timeout:45000});
 if(response?.status()!==200)throw new Error('Intro HTTP '+response?.status());
 await page.waitForSelector('[data-testid="horeb-chapter-start"]');
 await page.click('[data-testid="horeb-chapter-start"]');
 await page.waitForFunction(()=>!!window.__horeb?.world?.renderer?.info?.render?.frame,{timeout:90000});
 const chapter=await page.evaluate(()=>{
   const w=window.__horeb.world;
   const groups=[];
   w.scene.traverse(o=>{if(o.userData?.exhibitId)groups.push(o.userData.exhibitId);});
   return {mode:w.expeditionMode,ids:w.exhibitPos.map(p=>p.e.id),groups,
     pos:w.position,shoes:w.shoes,colliderCount:w.obstacles.length,
     err:w.contextLost,canvasCount:document.querySelectorAll('canvas').length,
     zoneHud:document.querySelector('.hud')?.textContent||''};
 });
 if(chapter.mode!=='horeb'||chapter.ids.join('|')!=='ehyeh|yhwh'||
    chapter.groups.sort().join('|')!=='ehyeh|yhwh'||
    chapter.pos.z > -322 || chapter.pos.z < -346 ||
    chapter.shoes!=='shod'||chapter.err||chapter.canvasCount!==1||
    !chapter.zoneHud.includes('Призвание Моисея'))
   throw new Error('WRONG PHYSICAL HOREB CHAPTER '+JSON.stringify(chapter));
 await page.screenshot({path:join(out,'smoke-chapter-horeb.png')});
 // Explicit exit is a real UI action. Legacy must still contain 42 scene
 // objects and use its previous independent start/progress.
 const exited=await page.evaluate(()=>{
   const b=[...document.querySelectorAll('button')].find(x=>x.textContent?.trim()==='Выйти');
   b?.click();return !!b;
 });
 if(!exited)throw new Error('Chapter exit control missing');
 await page.waitForSelector('[data-testid="legacy-journey-start"]');
 await page.click('[data-testid="legacy-journey-start"]');
 await page.waitForFunction(()=>window.__horeb?.world?.expeditionMode==='legacy',{timeout:90000});
 const legacy=await page.evaluate(()=>{
   const w=window.__horeb.world;
   const ids=[];
   w.scene.traverse(o=>{if(o.userData?.exhibitId)ids.push(o.userData.exhibitId);});
   return {mode:w.expeditionMode,exhibits:w.exhibitPos.length,
      groups:ids.length,unique:new Set(ids).size,pos:w.position,shoes:w.shoes,
      canvases:document.querySelectorAll('canvas').length};
 });
 if(legacy.mode!=='legacy'||legacy.exhibits!==42||legacy.groups!==42||
    legacy.unique!==42||Math.abs(legacy.pos.z+2)>0.5||
    legacy.shoes!=='shod'||legacy.canvases!==1||errors.length)
   throw new Error('LEGACY REGRESSION '+JSON.stringify({legacy,errors}));
 await page.screenshot({path:join(out,'smoke-chapter-legacy.png')});
 console.log('PASS W5A 2 Exodus-3 scene objects in Horeb and 42 in separate legacy scene; one WebGL engine; errors=0');
 writeFileSync(join(process.cwd(),'.test-build','chapters-witness.json'),
   JSON.stringify({chapter,legacy,errors,source:'actual Chromium/WebGL'},null,2));
}catch(e){throw e}finally{await browser.close()}
