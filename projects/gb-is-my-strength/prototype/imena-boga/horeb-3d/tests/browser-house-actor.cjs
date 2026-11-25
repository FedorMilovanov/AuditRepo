const puppeteer=require('puppeteer-core');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const study=process.env.HOREB_HOUSE_STUDY_DIR;
const dir=process.env.HOREB_ARTLAB_SCREENSHOTS||path.join(process.cwd(),'.test-build','house-walk');
const m=study?JSON.parse(fs.readFileSync(path.join(study,'w26-study-manifest.json'),'utf8')):null;
if(m&&(!['w26-house-study.glb','w26b-house-study.glb','w26c-house-study.glb'].includes(m.glb_file||'w26-house-study.glb')||m.status!=='ART_HOLD_W26_HOUSE_STUDY'))throw Error('Invalid study manifest');
const bytes=m?fs.readFileSync(path.join(study,m.glb_file||'w26-house-study.glb')):null;
if(bytes&&(crypto.createHash('sha256').update(bytes).digest('hex')!==m.glb_sha256||bytes.length!==m.bytes))throw Error('Asset hash mismatch');
const actorStudy=process.env.HOREB_ACTOR_STUDY_DIR;
const am=actorStudy?JSON.parse(fs.readFileSync(path.join(actorStudy,'w24-export-manifest.json'),'utf8')):null;
const actorBytes=am?fs.readFileSync(path.join(actorStudy,'w24-wardrobe-study.glb')):null;
if(am&&(am.status!=='ART_HOLD_LOCAL_W24_WARDROBE'||am.glb_sha256!=='f3d9a470cb2371f600cc8b6c58547fd63aebd8c1d025e80ff327926ef2870cbb'||crypto.createHash('sha256').update(actorBytes).digest('hex')!==am.glb_sha256||actorBytes.length!==am.glb_bytes))throw Error('Actor study hash mismatch');
const chrome=[process.env.HOREB_BROWSER_PATH,'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','/usr/bin/google-chrome','/usr/bin/chromium'].find(x=>x&&fs.existsSync(x));
if(!chrome)throw Error('Actual Chromium required');
(async()=>{
 const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist',...(process.env.HOREB_NO_SANDBOX==='1'?['--no-sandbox']:[])],protocolTimeout:120000});
 try{
 fs.mkdirSync(dir,{recursive:true});
 const page=await browser.newPage();page.setDefaultTimeout(60000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let requests=0,actorRequests=0;
 if(bytes||actorBytes){await page.setCacheEnabled(false);await page.setRequestInterception(true);
 page.on('request',r=>{if(bytes&&new URL(r.url()).pathname.endsWith('/artlab/horeb_egypt_house_hero_pilot.glb')){requests++;return r.respond({status:200,contentType:'model/gltf-binary',body:bytes});}if(actorBytes&&new URL(r.url()).pathname.endsWith('/artlab/horeb_mother_w22_candidate.glb')){actorRequests++;return r.respond({status:200,contentType:'model/gltf-binary',body:actorBytes});}return r.continue();});}
 const sel='[data-testid="house-lookdev-canvas"]';
 const state=()=>page.$eval(sel,c=>({...c.dataset}));
 const until=(fn)=>page.waitForFunction(fn,{timeout:60000},sel);
 async function hold(key,fn,label='walk'){
  await page.keyboard.down(key);
  try{await page.waitForFunction(fn,{timeout:120000},sel);}
  catch(error){
   console.error('W27_INPUT_FAILURE',JSON.stringify({label,key,state:await state(),focus:await page.evaluate(()=>document.activeElement?.getAttribute('data-testid')),hidden:await page.evaluate(()=>document.hidden)}));
   throw error;
  }finally{await page.keyboard.up(key);}
 }
 async function enterWalk(){
  await page.click('[data-testid="house-walk-toggle"]');
  await until(s=>{const c=document.querySelector(s),d=c.dataset;return d.houseWalk==='true'&&d.houseWalkRegion==='yard'&&Number(d.houseWalkZ)>7.1&&Math.abs(Number(d.houseWalkYaw))<.01&&d.houseObservationReady==='false'&&document.activeElement===c;});
 }
 for(const mobile of [false,true]){
 await page.setViewport({width:mobile?390:1440,height:mobile?844:900,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const prior=requests,priorActor=actorRequests;
 await page.goto((process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5192').replace(/\/$/,'')+'/artlab.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>Number(document.querySelector('[data-testid="house-meshes"]')?.textContent)>0);
 if(bytes&&requests<=prior)throw Error('No candidate request');
 await page.click('[data-testid="house-actor-toggle"]');
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='idle');
 if(actorBytes&&actorRequests<=priorActor)throw Error('No exact actor study request');
 const actor=await state();
 if(actor.houseActorBones!=='53'||Number(actor.houseActorSkinned)<2)throw Error('Missing real skinning');
 await enterWalk();
 const start=await state();
 if(Number(start.houseWalkColliders)<12||start.houseWalkRegion!=='yard')throw Error('Incomplete walk start '+JSON.stringify(start));
 if(!await page.$eval('[data-testid="house-inspect-basket"]',b=>b.disabled))throw Error('Distant basket interaction available');
 await page.keyboard.press('f');
 if(await page.$('[data-testid="house-basket-inspection"]'))throw Error('Distant keyboard interaction allowed');
 if(mobile){
  const touch=await page.target().createCDPSession();
  const b=await page.$('[data-testid="house-walk-w"]');await b.scrollIntoView();
  const rect=await b.boundingBox();const cv=await (await page.$(sel)).boundingBox();
  if(rect.x<cv.x||rect.y<cv.y||rect.x+rect.width>cv.x+cv.width||rect.y+rect.height>cv.y+cv.height)throw Error('Touch controls outside game view');
  const point={x:rect.x+rect.width/2,y:rect.y+rect.height/2,id:1};
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
  try{await until(s=>document.querySelector(s).dataset.houseWalkBlocked==='true');}finally{await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  await touch.detach();
  const stop=await state();
  if(stop.houseWalkRegion!=='room'||Number(stop.houseWalkZ)<.65||Number(stop.houseWalkZ)>1.2)throw Error('Mobile failed actual entrance and table stop '+JSON.stringify(stop));
 }else{
  await hold('w',s=>document.querySelector(s).dataset.houseWalkRegion==='room');
  const room=await state();if(Math.abs(Number(room.houseWalkX))>.05)throw Error('Unexpected sideways motion');
  await hold('w',s=>document.querySelector(s).dataset.houseWalkBlocked==='true');
  const stop=await state();
  if(Number(stop.houseWalkZ)<.65||Number(stop.houseWalkZ)>1.2)throw Error('Workbench stop outside expected range '+JSON.stringify(stop));
 }
 await page.waitForFunction(()=>!document.querySelector('[data-testid="house-inspect-basket"]').disabled);
 // Back away from the table to the marked director position, by real input.
 await hold('s',s=>Number(document.querySelector(s).dataset.houseWalkZ)>=1.92);
 await page.waitForFunction(()=>!document.querySelector('[data-testid="house-actor-perform"]').disabled);
 const observation=await state();
 await page.click('[data-testid="house-actor-perform"]');
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='performing');
 await until(s=>Number.isFinite(Number(document.querySelector(s).dataset.houseActorFrameExtent)));
 const peak=await state();
 if(!Number.isFinite(Number(peak.houseActorContactMm)))await until(s=>Number.isFinite(Number(document.querySelector(s).dataset.houseActorContactMm)));
 const actual=await state();
 if(mobile&&(!actual.houseActorAperture||Number(actual.houseActorAperture.split('x')[0])/Number(actual.houseActorAperture.split('x')[1])<1.35))throw Error('Missing portrait cinema aperture');
 if(Number(actual.houseActorFrameExtent)>.96)throw Error('Actor or rim out of the peak frame: '+JSON.stringify(actual));
 if(actual.houseWalkX!==observation.houseWalkX||actual.houseWalkZ!==observation.houseWalkZ)throw Error('Director moved player');

 if(Number(actual.houseActorContactMm)>=25)throw Error('W27 wrist misses actual rim: '+JSON.stringify(actual));
 const actorCanvas=await page.$(sel);
 await actorCanvas.screenshot({path:path.join(dir,mobile?'actor-mobile390.png':'actor-desktop1440.png')});
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='complete');
 const endGesture=await state();
 if(Number(endGesture.houseActorTime)<2.91||Number(endGesture.houseActorWorstMm)>=25||Number(endGesture.houseActorHoldSeconds)<.5)throw Error('Action completion invalid '+JSON.stringify(endGesture));
 console.log('W27A_RIG_CONTACT',JSON.stringify({mobile,peak:actual.houseActorContactMm,completed:endGesture.houseActorContactMm,extent:actual.houseActorFrameExtent,aperture:actual.houseActorAperture,worst:endGesture.houseActorWorstMm,hold:endGesture.houseActorHoldSeconds,bones:actor.houseActorBones,actor:am?.glb_sha256||'canonical W22'}));

 // A replay must reset contact evidence and cancel on leaving the walk.
 await page.click('[data-testid="house-actor-perform"]');
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='performing');
 if((await state()).houseActorHoldSeconds!==undefined)throw Error('Stale contact on replay');
 await page.click('[data-testid="house-walk-toggle"]');
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='idle'&&document.querySelector(s).dataset.houseWalk==='false');
 if((await state()).houseActorTime!==undefined)throw Error('Stale clip clock after cancellation');
 // A fresh real entry must acknowledge the reset before input, not only
 // dispatch a click and race the React event/focus on slow runners.
 await enterWalk();
 console.log('W27_REENTRY_READY',JSON.stringify(await state()));
 await hold('w',s=>{const d=document.querySelector(s).dataset;return d.houseWalkBlocked==='true'&&d.houseWalkRegion==='room'&&Number(d.houseWalkZ)>.65&&Number(d.houseWalkZ)<1.2;},'re-entry to table');
 await page.waitForFunction(()=>!document.querySelector('[data-testid="house-inspect-basket"]').disabled);
 const beforeInspect=await state();
 if(mobile)await page.tap('[data-testid="house-inspect-basket"]');else await page.keyboard.press('f');
 await page.waitForSelector('[data-testid="house-basket-inspection"]');
 if(await page.$('[data-testid="house-walk-w"]'))throw Error('Walk controls still active in inspection');
 await page.waitForFunction(()=>document.activeElement?.getAttribute('data-testid')==='house-inspect-close');
 await page.keyboard.down('s');await new Promise(r=>setTimeout(r,600));await page.keyboard.up('s');
 const frozen=await state();
 if(frozen.houseWalkX!==beforeInspect.houseWalkX||frozen.houseWalkZ!==beforeInspect.houseWalkZ||frozen.houseInspected!=='true')throw Error('Inspection failed to suspend movement');
 const canvasInspect=await page.$(sel);await canvasInspect.screenshot({path:path.join(dir,mobile?'inspect-mobile390.png':'inspect-desktop1440.png')});
 await page.click('[data-testid="house-inspect-close"]');
 await page.waitForFunction(()=>!document.querySelector('[data-testid="house-basket-inspection"]')&&document.activeElement?.getAttribute('data-testid')==='house-lookdev-canvas');
 const pitchBefore=Number((await state()).houseWalkPitch);
 const cv=await (await page.$(sel)).boundingBox();
 const x=cv.x+cv.width*.52,y=cv.y+cv.height*.38;
 if(mobile){
  const touch=await page.target().createCDPSession();
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:9,x,y}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:9,x,y:y+80}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await touch.detach();
 }else{
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+80,{steps:6});await page.mouse.up();
 }
 await page.waitForFunction((s,p)=>Number(document.querySelector(s).dataset.houseWalkPitch)<p-.15,{timeout:10000},sel,pitchBefore);
 const looked=await page.$(sel);await looked.screenshot({path:path.join(dir,mobile?'look-mobile390.png':'look-desktop1440.png')});

 const end=await state();
 const canvas=await page.$(sel);await canvas.screenshot({path:path.join(dir,mobile?'walk-mobile390.png':'walk-desktop1440.png')});
 await page.click('[data-testid="house-walk-toggle"]');
 await until(s=>document.querySelector(s).dataset.houseWalk==='false');
 await page.click('[data-testid="house-actor-toggle"]');
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='off');
 if((await state()).houseActorBones!==undefined)throw Error('Actor retained after removal');

 if(errors.length)throw Error(errors.join('; '));
 console.log('W27A_HOUSE_ACTOR_PASS',JSON.stringify({mobile,asset:m?.glb_sha256||'canonical W17',start,end,errors}));
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
