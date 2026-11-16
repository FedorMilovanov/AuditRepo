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
 // Egypt reading must be directly accessible from the intro and never
 // require a successful WebGL scene or traversal to the southern lookout.
 await page.waitForSelector('[data-testid="egypt-reading-intro"]');
 await page.click('[data-testid="egypt-reading-intro"]');
 await page.waitForSelector('[data-testid="egypt-intro-reading"]');
 const introSource=await page.evaluate(()=>({
   four:document.querySelectorAll('[data-testid="egypt-reading-sequence"] > li').length,
   noWebGL:window.__horeb===undefined,
   note:document.querySelector('[data-testid="egypt-intro-reading"]')?.textContent||'',
 }));
 if(introSource.four!==4||!introSource.noWebGL||
    !introSource.note.includes('ещё не построена')||
    !introSource.note.includes('не добавляет новых имён Бога'))
   throw new Error('EGYPT READING INTRO MUST NOT REQUIRE 3D '+JSON.stringify(introSource));
 // The five first-episode text beats are visible without WebGL; a native
 // details/summary disclosure is focusable and does not start a 3D world.
 await page.click('[data-testid="egypt-return-notes"] summary');
 const returnEvidence=await page.$$eval('[data-testid="egypt-return-beat"]',
   nodes=>nodes.map(node=>node.textContent||''));
 const beatRefs=['Исх. 4:18–20','Исх. 4:21–23','Исх. 4:24–26',
   'Исх. 4:27–28','Исх. 4:29–31'];
 if(returnEvidence.length!==5||
    returnEvidence.some((s,i)=>!s.includes(beatRefs[i]))||
    !returnEvidence[2].includes('неясные местоимения')||
    !returnEvidence[3].includes('у горы Божией'))
   throw new Error('EGYPT RETURN TEXT / AMBIGUITY '+JSON.stringify(returnEvidence));
 await page.screenshot({path:join(out,'smoke-egypt-return-five-beats.png')});
 await page.click('[data-testid="egypt-pharaoh-notes"] summary');
 const pharaohRefs=await page.$$eval('[data-testid="egypt-pharaoh-beat"]',
   nodes=>nodes.map(node=>node.textContent||''));
 const expectedPharaoh=['Исх. 5:1–5','Исх. 5:6–14','Исх. 5:15–21',
   'Исх. 5:22–6:1','Исх. 6:2–13','Исх. 6:14–27','Исх. 6:28–7:7'];
 const museum=await page.$eval('[data-testid="egypt-brickwork-context"]',el=>({
   text:el.textContent||'',
   href:el.querySelector('a')?.href||''
 }));
 if(pharaohRefs.length!==7||
    pharaohRefs.some((s,i)=>!s.includes(expectedPharaoh[i]))||
    !pharaohRefs[1].includes('НЕ приказ делать кирпичи вообще без соломы')||
    !pharaohRefs[4].includes('имя YHWH')||
    !museum.text.includes('не доказывает')||
    museum.href!=='https://www.metmuseum.org/art/collection/search/544649')
   throw new Error('PHARAOH READING EVIDENCE '+JSON.stringify({pharaohRefs,museum}));
 await page.screenshot({path:join(out,'smoke-egypt-pharaoh-seven-beats.png')});
 await page.keyboard.press('Escape');
 await page.waitForFunction(()=>!document.querySelector('[role="dialog"]'),{timeout:15000});
 // New main narrative starts with the infant on the Nile. The existing
 // direct Horeb launch remains for QA and repeat visits, but is secondary.
 await page.click('[data-testid="moses-origin-start"]');
 await page.waitForSelector('[data-testid="moses-origin-story"]');
 const expectedOrigins=['Младенец у Нила','Дочь фараона','Выбор и бегство',
   'Колодец в Мадиаме','Бог услышал стенания','Пастух на пути к Хориву'];
 for(let i=0;i<expectedOrigins.length;i++){
   const t=await page.$eval('[data-testid="moses-origin-title"]',el=>el.textContent||'');
   const step=await page.$eval('[data-testid="moses-origin-progress"]',el=>el.textContent||'');
   if(t!==expectedOrigins[i]||step.trim()!==`${i+1} / 6`)
     throw new Error('MOSES STORY ORDER '+JSON.stringify({i,t,step}));
   if(i===0){
     await page.waitForFunction(()=>
       document.querySelector('[data-testid="moses-nile-3d"]')?.dataset.nileRendered==='true',
       {timeout:30000});
     const rendered=await page.$eval('[data-testid="moses-nile-3d"]',c=>{
       const canvas=c;
       return !!canvas.getContext('webgl2') || !!canvas.getContext('webgl');
     });
     if(!rendered)throw new Error('NILE WEBGL PHYSICAL DIORAMA NOT INITIALIZED');
     const nileGeometry=await page.$eval('[data-testid="moses-nile-3d"]',canvas=>({
       shoreOffset:Number(canvas.dataset.nileShoreOffset),
       stems:Number(canvas.dataset.nilePapyrusCount),
       rays:Number(canvas.dataset.nileUmbelRays),
     }));
     if(!(nileGeometry.shoreOffset>0&&nileGeometry.shoreOffset<1)||
        nileGeometry.stems!==104||nileGeometry.rays!==936)
       throw new Error('NILE GEOMETRY MUST KEEP BASKET BY PAPYRUS SHORE '+JSON.stringify(nileGeometry));
     const warning=await page.$eval('[data-testid="moses-origin-limitation"]',el=>el.textContent||'');
     if(!warning.includes('среди тростника')||!warning.includes('долгого путешествия'))
       throw new Error('MOSES NILE CORRECTION MISSING');
     await page.screenshot({path:join(out,'smoke-moses-baby-first.png')});
     await page.setViewport({width:390,height:844,deviceScaleFactor:1});
     const mobilePrelude=await page.evaluate(()=>{
       const modal=document.querySelector('[role="dialog"]');
       const r=modal?.getBoundingClientRect();
       const title=document.querySelector('[data-testid="moses-origin-title"]');
       const next=document.querySelector('[data-testid="moses-origin-next"]');
       return {visible:!!modal&&!!title&&!!next,
         fits:!!r&&r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,
         noSideScroll:!!modal&&modal.scrollWidth<=modal.clientWidth+1};
     });
     if(!mobilePrelude.visible||!mobilePrelude.fits||!mobilePrelude.noSideScroll)
       throw new Error('MOSES STORY PHONE WIDTH '+JSON.stringify(mobilePrelude));
     await page.screenshot({path:join(out,'smoke-moses-baby-phone.png')});
     await page.setViewport({width:1024,height:768,deviceScaleFactor:1});
   }
   if(i===1){
     // The former cradle canvas must be gone. This is a NEW scene on
     // the same engine, with THREE grounded anonymous figures.
     await page.waitForFunction(()=>
       document.querySelector('[data-testid="moses-nile-discovery-3d"]')?.dataset.nileRendered==='true',
       {timeout:30000});
     const discovery=await page.$eval('[data-testid="moses-nile-discovery-3d"]',c=>({
       moment:c.dataset.nileMoment,
       figures:Number(c.dataset.nileFigures),
       stems:Number(c.dataset.nilePapyrusCount),
       canvasCount:document.querySelectorAll('canvas').length,
     }));
     if(discovery.moment!=='discovery'||discovery.figures!==3||
        discovery.stems!==104||discovery.canvasCount!==1||
        await page.$('[data-testid="moses-nile-3d"]'))
       throw new Error('NILE DISCOVERY SCENE FAILED '+JSON.stringify(discovery));
     await page.screenshot({path:join(out,'smoke-moses-discovery-desktop.png')});
     await page.setViewport({width:390,height:844,deviceScaleFactor:1});
     const mobileDiscovery=await page.evaluate(()=>{
       const modal=document.querySelector('[role="dialog"]');
       const r=modal?.getBoundingClientRect();
       const c=document.querySelector('[data-testid="moses-nile-discovery-3d"]');
       return {visible:!!c&&c.dataset.nileRendered==='true',
         fits:!!r&&r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,
         noSideScroll:!!modal&&modal.scrollWidth<=modal.clientWidth+1};
     });
     if(!mobileDiscovery.visible||!mobileDiscovery.fits||!mobileDiscovery.noSideScroll)
       throw new Error('NILE DISCOVERY PHONE LAYOUT '+JSON.stringify(mobileDiscovery));
     await page.screenshot({path:join(out,'smoke-moses-discovery-phone.png')});
     await page.setViewport({width:1024,height:768,deviceScaleFactor:1});
   }
   if(i<5){
     await page.click('[data-testid="moses-origin-next"]');
     if(i===0){
       await page.waitForFunction(()=>
         !document.querySelector('[data-testid="moses-nile-3d"]')&&
         !!document.querySelector('[data-testid="moses-nile-discovery-3d"]'));
     }
     if(i===1){
       await page.waitForFunction(()=>
         !document.querySelector('[data-testid="moses-nile-discovery-3d"]'));
       if((await page.$$('canvas')).length!==0)
         throw new Error('NILE DISCOVERY WEBGL CANVAS LEAKED INTO THIRD EPISODE');
     }
   }
 }
 if(await page.evaluate(()=>!!window.__horeb))throw new Error('MOSES PRELUDE STARTED WEBGL EARLY');
 await page.screenshot({path:join(out,'smoke-moses-horeb-transition.png')});
 await page.click('[data-testid="moses-origin-enter-horeb"]');
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
 if(await page.$('[data-testid="horeb-departure-preview"]'))
   throw new Error('LEGACY MUST NOT SHOW FUTURE EGYPT CHAPTER');
 await page.close(); // release the desktop WebGL context before phone QA
 // Recheck the NEW chapter on a phone-sized touch viewport. The existing
 // general smoke's prompt witness is in the 42-object archive, so it alone
 // cannot prove both chapter stones retain readable touch interactions.
 for (const [id,strafe,direction,turn] of [
   ['ehyeh','a',-1,'ArrowLeft'], ['yhwh','d',1,'ArrowRight'],
 ]) {
   const phone=await browser.newPage();
   try {
     await phone.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
     await phone.goto(base+'/?e2e',{waitUntil:'domcontentloaded',timeout:45000});
     await phone.click('[data-testid="horeb-chapter-start"]');
     await phone.waitForFunction(()=>window.__horeb?.world?.renderer?.info?.render?.frame,
       {timeout:90000});
     await phone.keyboard.down('w');
     await phone.waitForFunction(()=>window.__horeb.world.position.z<-344.5,
       {timeout:90000});
     await phone.keyboard.up('w');
     await phone.keyboard.down(strafe);
     await phone.waitForFunction((sign)=>sign<0
       ? window.__horeb.world.position.x<-8 : window.__horeb.world.position.x>8,
       {timeout:90000},direction);
     await phone.keyboard.up(strafe);
     await phone.keyboard.down(turn);
     await phone.waitForFunction((expected)=>window.__horeb?.state()?.prompt?.id===expected,
       {timeout:60000},id);
     await phone.keyboard.up(turn);
     const evidence=await phone.evaluate(()=>{
       const b=document.querySelector('[data-testid="interaction-prompt"]');
       const a=document.querySelector('[data-testid="touch-action"]');
       const joy=document.querySelector('[data-testid="movement-joystick"]');
       const r=b?.getBoundingClientRect(), ar=a?.getBoundingClientRect(),
         jr=joy?.getBoundingClientRect();
       return {mode:window.__horeb.world.expeditionMode,
         ids:window.__horeb.world.exhibitPos.map(p=>p.e.id),
         prompt:window.__horeb.state()?.prompt?.id,
         oneTextGroup:b?.childElementCount===1 && b.firstElementChild?.tagName==='SPAN',
         containsSource:b?.textContent?.includes('Исх. 3:'),
         width:r?.width,height:r?.height,overflow:!!b&&b.scrollWidth>b.clientWidth+1,
         clearsControls:!!r&&!!ar&&!!jr&&r.bottom+8<Math.min(ar.top,jr.top)};
     });
     if(evidence.mode!=='horeb'||evidence.ids.join('|')!=='ehyeh|yhwh'||
        evidence.prompt!==id||!evidence.oneTextGroup||!evidence.containsSource||
        evidence.width<300||evidence.height>105||evidence.overflow||
        !evidence.clearsControls)
       throw new Error('MOBILE HOREB WITNESS '+id+' '+JSON.stringify(evidence));
     await phone.screenshot({path:join(out,'smoke-chapter-mobile-'+id+'.png')});
     await phone.tap('[data-testid="interaction-prompt"]');
     await phone.waitForSelector('[role="dialog"]',{timeout:12000});
     const dossier=await phone.$eval('[role="dialog"]',el=>el.textContent||'');
     if(!dossier.includes(id==='ehyeh'?'Я буду':'Тетраграмматон'))
       throw new Error('MOBILE HOREB DOSSIER '+id);
   }finally{await phone.close();}
 }
 // Phone-landscape guard: the verse and sandal action must never cover the
 // bottom-left touch joystick. One REAL shod walk, then responsive viewport
 // changes on the SAME live world (not teleport or fabricated World state).
 const landscape=await browser.newPage();
 try {
   await landscape.setViewport({width:844,height:390,deviceScaleFactor:2,isMobile:true,hasTouch:true});
   await landscape.goto(base+'/?e2e',{waitUntil:'domcontentloaded',timeout:45000});
   await landscape.click('[data-testid="horeb-chapter-start"]');
   await landscape.waitForFunction(()=>window.__horeb?.world?.renderer?.info?.render?.frame,
     {timeout:90000});
   await landscape.keyboard.down('w');
   await landscape.waitForFunction(()=>window.__horeb?.world?.position?.z<-351.2,{timeout:90000});
   await landscape.keyboard.up('w');
   await landscape.waitForSelector('[data-testid="sandal-action"]',{timeout:12000});
   for(const [width,height] of [[844,390],[667,375],[568,320]]){
     await landscape.setViewport({width,height,deviceScaleFactor:2,isMobile:true,hasTouch:true});
     const layout=await landscape.evaluate(()=>{
       const rect=s=>document.querySelector(s)?.getBoundingClientRect()||null;
       const g=rect('[role="alert"]'),j=rect('[data-testid="movement-joystick"]'),
         a=rect('[data-testid="touch-action"]'),b=rect('[data-testid="sandal-action"]');
       const overlap=(x,y)=>!!x&&!!y&&x.left<y.right+8&&x.right+8>y.left&&
         x.top<y.bottom+8&&x.bottom+8>y.top;
       const panel=document.querySelector('[role="alert"]');
       return {ready:!!g&&!!j&&!!a&&!!b,
         complete:panel?.textContent?.includes('Не подходи')&&
           panel?.textContent?.includes('Исх. 3:5'),
         buttonVisible:!!b&&!!g&&b.top>=0&&b.bottom<=innerHeight&&
           b.left>=g.left&&b.right<=g.right,
         fits:!!g&&g.top>=0&&g.bottom<=innerHeight&&
           g.left>=0&&g.right<=innerWidth&&panel.scrollHeight<=panel.clientHeight+1,
         avoidsControls:!overlap(g,j)&&!overlap(g,a),
         viewport:[innerWidth,innerHeight]};
     });
     if(!layout.ready||!layout.complete||!layout.buttonVisible||
        !layout.fits||!layout.avoidsControls)
       throw new Error('HOREB LANDSCAPE GATE '+JSON.stringify(layout));
     await landscape.screenshot({path:join(out,`smoke-chapter-landscape-${width}x${height}.png`)});
   }
   await landscape.tap('[data-testid="sandal-action"]');
   await landscape.waitForFunction(()=>window.__horeb?.world?.shoes==='unshod',
     {timeout:90000});
 }finally{await landscape.close();}
 // Only the trigger/UI is posed here: the existing side-journey shader QA
 // separately proves the eight real walking waypoints to the same outlook.
 // This programmatic safe-position fixture MUST NOT be counted as a walk.
 const next=await browser.newPage();
 try{
   await next.setViewport({width:1024,height:768,deviceScaleFactor:1});
   await next.goto(base+'/?e2e',{waitUntil:'domcontentloaded',timeout:45000});
   await next.click('[data-testid="horeb-chapter-start"]');
   await next.waitForFunction(()=>window.__horeb?.world?.renderer?.info?.render?.frame,
     {timeout:90000});
   if(await next.$('[data-testid="horeb-departure-preview"]'))
     throw new Error('DEPARTURE CARD VISIBLE AT HOREB ENTRANCE');
   await next.evaluate(()=>{
     const w=window.__horeb.world;
     w.teleportTo(-8,-433); // safe test-only UI pose; NOT proof of travel
     w.emit(true);
   });
   await next.waitForSelector('[data-testid="horeb-departure-preview"]',{timeout:12000});
   await next.screenshot({path:join(out,'smoke-chapter-departure-outlook.png')});
   await next.click('[data-testid="horeb-departure-preview"]');
   await next.waitForSelector('[data-testid="horeb-departure-context"]',{timeout:12000});
   const claim=await next.$eval('[data-testid="horeb-departure-context"]',
     el=>el.textContent||'');
   if(!claim.includes('Исх. 3:12')||!claim.includes('Исх. 4:18–20')||
       !claim.includes('не построена')||!claim.includes('нет телепорта'))
     throw new Error('DEPARTURE MUST MARK NEXT CHAPTER UNBUILT AND NON-GEOGRAPHICAL');
   const episodes=await next.$$eval('[data-testid="egypt-reading-sequence"] > li',
     nodes=>nodes.map(node=>node.textContent||''));
   const expectedRefs=['Исх. 4:18–31','Исх. 5:1–7:7',
     'Исх. 7:8–11:10','Исх. 12:1–51'];
   if(episodes.length!==4||episodes.some((s,i)=>!s.includes(expectedRefs[i]))||
      episodes.some((s)=>s.includes('готовая 3D-сцена')))
     throw new Error('EGYPT READING ACTS WRONG '+JSON.stringify(episodes));
   await next.screenshot({path:join(out,'smoke-chapter-departure-reader.png')});
   // Width-only responsive reflow: toggling isMobile on an already-open
   // Puppeteer page reloads it and destroys the active dialog.
   await next.setViewport({width:390,height:844,deviceScaleFactor:2});
   const modalLayout=await next.evaluate(()=>{
     const m=document.querySelector('[role="dialog"]');
     return {modal:!!m,refs:[...document.querySelectorAll('[data-testid="egypt-reading-sequence"] > li')].length,
       height:m?.clientHeight,scrollHeight:m?.scrollHeight,screenHeight:innerHeight,
       noSideOverflow:!!m&&m.scrollWidth<=m.clientWidth+1};
   });
   if(!modalLayout.modal||modalLayout.refs!==4||!modalLayout.noSideOverflow||
      modalLayout.height>modalLayout.screenHeight*.9||modalLayout.scrollHeight<=modalLayout.height)
     throw new Error('EGYPT READING MOBILE SCROLL '+JSON.stringify(modalLayout));
   await next.evaluate(()=>{
     const m=document.querySelector('[role="dialog"]');
     m.scrollTop=m.scrollHeight;
   });
   const bottomAccessible=await next.evaluate(()=>{
     const m=document.querySelector('[role="dialog"]');
     const b=[...m.querySelectorAll('button')].find(n=>n.textContent?.includes('Атлас имён Бога'));
     const a=b?.getBoundingClientRect(),r=m.getBoundingClientRect();
     return !!a&&a.top>=r.top&&a.bottom<=r.bottom&&a.width>100;
   });
   if(!bottomAccessible)throw new Error('EGYPT MOBILE BOTTOM ACTION NOT REACHABLE');
   await next.screenshot({path:join(out,'smoke-chapter-departure-mobile.png')});
   await next.keyboard.press('Escape');
   await next.waitForFunction(()=>!document.querySelector('[role="dialog"]'),
     {timeout:12000});
   await next.evaluate(()=>{
     const w=window.__horeb.world;
     w.teleportTo(-8,-425); // exit the UI-only viewpoint, safe by production nav
     w.emit(true);
   });
   await next.waitForFunction(()=>!document.querySelector('[data-testid="horeb-departure-preview"]'),
     {timeout:12000});
 }finally{await next.close();}
 console.log('PASS W5F chapter: 2 Exodus witnesses, 3 landscape gates, 42 archive, bounded departure text; errors=0');
 writeFileSync(join(process.cwd(),'.test-build','chapters-witness.json'),
   JSON.stringify({chapter,legacy,physicalChapterWalk:{origin,south,outer,outerDistance,inner,innerDistance,north},errors,
     source:'actual Chromium/WebGL keyboard + scene mesh inspection'},null,2));
}catch(e){throw e}finally{await browser.close()}
