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
   const names=[];
   w.zones.group.traverse(o=>{if(o.name)names.push(o.name)});
   const natural=[];const museum=[];
   w.scene.traverse(o=>{
     if(o.name==='horeb-natural-witness-rock')natural.push(o);
     if(o.name==='legacy-exhibit-stele')museum.push(o);
   });
   return {mode:w.expeditionMode,ids:w.exhibitPos.map(p=>p.e.id),groups,
     naturalRocks:natural.length,museumSteles:museum.length,
     pos:w.position,shoes:w.shoes,colliderCount:w.obstacles.length,
     terrain:names.includes('horeb-exterior-terrain'),
     cave:names.some(n=>['cave-vault-continuous','cave-floor-continuous',
       'horeb-outer-rock-face','chasm-deep-floor'].includes(n)),
     err:w.contextLost,canvasCount:document.querySelectorAll('canvas').length,
     zoneHud:document.querySelector('.hud')?.textContent||''};
 });
 if(chapter.mode!=='horeb'||chapter.ids.join('|')!=='ehyeh|yhwh'||
    new Set(chapter.groups).size!==2||
    !chapter.groups.every(id=>chapter.ids.includes(id))||
    chapter.pos.z > -322 || chapter.pos.z < -346 ||
    chapter.shoes!=='shod'||chapter.err||chapter.canvasCount!==1||
    !chapter.terrain||chapter.cave||chapter.naturalRocks!==2||chapter.museumSteles!==0||
    !chapter.zoneHud.includes('Призвание Моисея'))
   throw new Error('WRONG PHYSICAL HOREB CHAPTER '+JSON.stringify(chapter));
 // Art witnesses must include the visitor's REAL first impression, not
 // only the north-facing rock after a controlled camera turn. A screenshot
 // alone is evidence for human review, never automatic visual acceptance.
 await page.screenshot({path:join(out,'smoke-chapter-horeb-entry.png')});
 // A shared historical map shortcut must not open a hidden legacy dialog
 // and freeze controls inside the independent Horeb chapter.
 await page.keyboard.press('m');
 await new Promise(resolve=>setTimeout(resolve,250));
 const keyM=await page.evaluate(()=>({
   dialog:!!document.querySelector('[role="dialog"]'),
   locked:window.__horeb.world.inputLocked,
 }));
 if(keyM.dialog||keyM.locked)throw new Error('HOREB legacy map key locked chapter '+JSON.stringify(keyM));
 // Visiting zone 7 in Horeb must never write the legacy eight-zone
 // completion journal, even while the scene is fully rendered.
 const savedBefore=await page.evaluate(()=>
   JSON.parse(localStorage.getItem('imena-horeb.progress.v1')||'null'));
 if(savedBefore && ((savedBefore.visited||[]).some(z=>z!==0)||savedBefore.last))
   throw new Error('CHAPTER POLLUTED LEGACY PROGRESS '+JSON.stringify(savedBefore));
 // Walk by real keyboard in the chapter toward the sacred threshold,
 // then back to the physically sculpted northern rock. No teleport,
 // test state rewrites, fake doors, or weakened holy boundaries.
 const actualState=()=>page.evaluate(()=>{
   const w=window.__horeb.world;
   return {x:w.position.x,z:w.position.z,shoes:w.shoes,frame:w.renderer.info.render.frame,
     contextLost:w.contextLost};
 });
 const origin=await actualState();
 await page.keyboard.down('w');
 await page.waitForFunction(()=>window.__horeb?.world?.position?.z<-343,
   {polling:200,timeout:24000});
 await page.keyboard.up('w');
 const south=await actualState();
 if(south.z>=origin.z-4 || south.z<-352 || south.contextLost)
   throw new Error('W5B physical southward walk invalid '+JSON.stringify({origin,south}));
 await page.screenshot({path:join(out,'smoke-chapter-horeb-approach.png')});
 // The short chapter must enforce the SAME two sacred boundaries as the
 // archive, with actual keyboard movement and a real E interaction. Prior
 // geometry-only tests cannot prove that the visitor can remove sandals.
 await page.keyboard.down('w');
 await page.waitForFunction(()=>window.__horeb?.world?.position?.z<-350.1,
   {polling:200,timeout:40000});
 await page.keyboard.up('w');
 const outer=await actualState();
 const outerDistance=Math.hypot(outer.x,outer.z+366);
 if(outerDistance<13.98||outer.shoes!=='shod'||outer.contextLost)
   throw new Error('HOREB OUTER GUARD '+JSON.stringify({outer,outerDistance}));
 await page.screenshot({path:join(out,'smoke-chapter-horeb-outer.png')});
 await page.keyboard.press('e');
 await page.waitForFunction(()=>window.__horeb?.world?.shoes==='unshod',
   {polling:200,timeout:45000});
 await page.keyboard.down('w');
 await page.waitForFunction(()=>window.__horeb?.world?.position?.z<-358.1,
   {polling:200,timeout:45000});
 await page.keyboard.up('w');
 await page.keyboard.down('w');
 await new Promise(resolve=>setTimeout(resolve,1700));
 await page.keyboard.up('w');
 const inner=await actualState();
 const innerDistance=Math.hypot(inner.x,inner.z+366);
 if(innerDistance<6.48||innerDistance>8.0||inner.shoes!=='unshod'||inner.contextLost)
   throw new Error('HOREB INNER GUARD '+JSON.stringify({inner,innerDistance}));
 await page.screenshot({path:join(out,'smoke-chapter-horeb-inner.png')});
 await page.keyboard.down('s');
 await page.waitForFunction(()=>window.__horeb?.world?.position?.z>=-332.65,
   {polling:200,timeout:60000});
 await page.keyboard.up('s');
 const north=await actualState();
 if(north.z>-332.30||north.z<-334||Math.abs(north.x)>0.5||
    north.shoes!=='unshod'||north.contextLost)
   throw new Error('W5B real northern rock boundary failed '+JSON.stringify({south,north}));
 // Only camera direction changes here, by real arrow-key input, to
 // expose the rock escarpment in actual rendered screenshot evidence.
 await page.keyboard.down('ArrowRight');
 await new Promise(resolve=>setTimeout(resolve,1900));
 await page.keyboard.up('ArrowRight');
 await page.screenshot({path:join(out,'smoke-chapter-horeb-scarp.png')});
 await page.screenshot({path:join(out,'smoke-chapter-horeb.png')});
 // Chapter's own reset action returns to intro without deleting the
 // historical lab checkpoints (or marking its zone-7 walk as completed).
 await page.evaluate(()=>{
   const b=[...document.querySelectorAll('button')].find(x=>x.textContent?.trim()==='Настройки');
   b?.click();
 });
 await page.waitForSelector('[role="dialog"]');
 const reset=await page.evaluate(()=>{
   const b=[...document.querySelectorAll('[role="dialog"] button')].find(x=>
     x.textContent?.trim()==='Сбросить маршрут и выйти');
   b?.click();return !!b;
 });
 if(!reset)throw new Error('Chapter reset action missing');
 await page.waitForSelector('[data-testid="legacy-journey-start"]');
 const savedAfter=await page.evaluate(()=>
   JSON.parse(localStorage.getItem('imena-horeb.progress.v1')||'null'));
 if(savedAfter && ((savedAfter.visited||[]).some(z=>z!==0)||savedAfter.last))
   throw new Error('CHAPTER RESET ERASED/MUTATED LEGACY DATA '+JSON.stringify(savedAfter));
 await page.click('[data-testid="legacy-journey-start"]');
 await page.waitForFunction(()=>window.__horeb?.world?.expeditionMode==='legacy',{timeout:90000});
 const legacy=await page.evaluate(()=>{
   const w=window.__horeb.world;
   const ids=[];let steles=0;let natural=0;
   w.scene.traverse(o=>{
     if(o.userData?.exhibitId)ids.push(o.userData.exhibitId);
     if(o.name==='legacy-exhibit-stele')steles++;
     if(o.name==='horeb-natural-witness-rock')natural++;
   });
   return {mode:w.expeditionMode,exhibits:w.exhibitPos.length,steles,natural,
      groups:ids.length,unique:new Set(ids).size,pos:w.position,shoes:w.shoes,
      hasCave:!!w.zones.group.getObjectByName('cave-vault-continuous'),
      canvases:document.querySelectorAll('canvas').length};
 });
 if(legacy.mode!=='legacy'||legacy.exhibits!==42||legacy.groups<42||
    legacy.unique!==42||legacy.steles!==42||legacy.natural!==0||
    !legacy.hasCave||Math.abs(legacy.pos.z+2)>0.5||
    legacy.shoes!=='shod'||legacy.canvases!==1||errors.length)
   throw new Error('LEGACY REGRESSION '+JSON.stringify({legacy,errors}));
 await page.screenshot({path:join(out,'smoke-chapter-legacy.png')});
 console.log('PASS W5C chapter: 2 Exodus-3 objects, 42 legacy, actual shod outer + unshod inner and north return; errors=0');
 writeFileSync(join(process.cwd(),'.test-build','chapters-witness.json'),
   JSON.stringify({chapter,legacy,physicalChapterWalk:{origin,south,outer,outerDistance,inner,innerDistance,north},errors,
     source:'actual Chromium/WebGL keyboard + scene mesh inspection'},null,2));
}catch(e){throw e}finally{await browser.close()}
