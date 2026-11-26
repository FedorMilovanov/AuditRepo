const puppeteer=require('puppeteer-core');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const study=process.env.HOREB_HOUSE_STUDY_DIR;
const actorStudy=process.env.HOREB_ACTOR_STUDY_DIR;
const w28House=process.env.HOREB_W28_HOUSE_OUTPUT;
const pairedProfiles=[
 {name:'w28',dir:process.env.HOREB_W28_ACTOR_OUTPUT,status:'ART_HOLD_W28_STAGED_ACTOR',sha:'e8101ec691c52a5ce3549f0825e925688ecb15ba76ebc8ca2937c6e13d24662a',meshes:9,audit:'w28-pair-reimport-audit.json',manifest:'w28-actor-manifest.json'},
 {name:'w28e',dir:process.env.HOREB_W28E_OUTPUT,status:'ART_HOLD_W28E_TAILORED_LINEN',sha:'6ec8db07064ac848ffe121b6fb7d0ca3eb9869b39390cb9bb2af2241b86a8014',meshes:7,audit:'w28e-glb-audit.json',manifest:'w28e-manifest.json'},
 {name:'w28f',dir:process.env.HOREB_W28F_OUTPUT,status:'ART_HOLD_W28F_NECKLINE_SASH',sha:'d0638cd9f808820e1295e73e0421b003e36fcaf58068e841c0b9b8790497df59',meshes:7,audit:'w28f-glb-audit.json',manifest:'w28f-manifest.json'},
 {name:'w28g',dir:process.env.HOREB_W28G_OUTPUT,status:'ART_HOLD_W28G_HEAD_ARM',sha:'3e1baf347b9197b2a59da935f15245f2ef289302b72cde22047642e563acc488',meshes:7,audit:'w28g-glb-audit.json',manifest:'w28g-manifest.json'},
].filter(p=>p.dir);
if(pairedProfiles.length>1)throw Error('Choose one actor profile');
const pair=pairedProfiles[0],w28Actor=pair?.dir;
const w28=!!(w28House||w28Actor);
if(w28&&(!w28House||!w28Actor||study||actorStudy))throw Error('W28 requires its exact paired assets; no mixed studies');
const actorFile=pair?pair.name+'-actor.glb':null;
const dir=process.env.HOREB_ARTLAB_SCREENSHOTS||path.join(process.cwd(),'.test-build','house-walk');
const m=w28?JSON.parse(fs.readFileSync(path.join(w28House,'w28-house-manifest.json'),'utf8')):study?JSON.parse(fs.readFileSync(path.join(study,'w26-study-manifest.json'),'utf8')):null;
const am=w28?JSON.parse(fs.readFileSync(path.join(w28Actor,pair.manifest),'utf8')):actorStudy?JSON.parse(fs.readFileSync(path.join(actorStudy,'w24-export-manifest.json'),'utf8')):null;
if(w28){
 if(m.status!=='ART_HOLD_W28_COMPACT_HOUSE'||m.glb_sha256!=='fdf603182640b2b4878857b672e635ffae69fcc95070af1814adf14521b49622'||JSON.stringify(am.placement_three)!=='[-0.58,0.015,0.3]')throw Error('Invalid W28 house/placement contract');
 if(am.status!==pair.status||am.glb_sha256!==pair.sha)throw Error('Invalid paired actor');
 if(pair.name==='w28e'&&(am.topology?.faces!==36332||am.topology?.verts!==18390))throw Error('Invalid triangle topology');
 if(pair.name==='w28f'&&JSON.stringify(am.params)!=='[0.025,0.012,0.006]')throw Error('Invalid neckline/sash parameters');
 if(pair.name==='w28g'&&JSON.stringify(am.params)!=='[55,18,0.25]')throw Error('Invalid head/arm parameters');
 const a=JSON.parse(fs.readFileSync(path.join(w28Actor,pair.audit),'utf8'));
 const validRow=r=>pair.name==='w28'?Array.isArray(r.hits)&&!r.hits.length:Array.isArray(r.skin_cloth)&&Array.isArray(r.prop_hits)&&!r.skin_cloth.length&&!r.prop_hits.length&&r.self_pairs===0&&(!['w28f','w28g'].includes(pair.name)||r.sash_pairs===0&&r.sash_self_pairs===0);
 const validClip=(c,name,count,step)=>c?.name===name&&Array.isArray(c.bad)&&c.bad.length===0&&Array.isArray(c.rows)&&c.rows.length===count&&c.rows.every((r,i)=>r?.frame===1+i*step&&validRow(r));
 if(a.actor_sha256!==am.glb_sha256||a.house_sha256!==m.glb_sha256||a.actor_meshes!==pair.meshes||a.props!==98||!Array.isArray(a.clips)||a.clips.length!==2||!validClip(a.clips[0],'Mother_GestureTowardsBasket',417,.25)||!validClip(a.clips[1],'Mother_QuietIdle',144,1))throw Error('Missing full pair clearance');

}else{
 if(m&&(!['w26-house-study.glb','w26b-house-study.glb','w26c-house-study.glb'].includes(m.glb_file||'w26-house-study.glb')||m.status!=='ART_HOLD_W26_HOUSE_STUDY'))throw Error('Invalid study manifest');
 if(am&&(am.status!=='ART_HOLD_LOCAL_W24_WARDROBE'||am.glb_sha256!=='f3d9a470cb2371f600cc8b6c58547fd63aebd8c1d025e80ff327926ef2870cbb'))throw Error('Invalid actor study manifest');
}
const bytes=m?fs.readFileSync(path.join(w28?w28House:study,w28?'w28-house.glb':m.glb_file||'w26-house-study.glb')):null;
const actorBytes=am?fs.readFileSync(path.join(w28?w28Actor:actorStudy,w28?actorFile:'w24-wardrobe-study.glb')):null;
if(bytes&&(crypto.createHash('sha256').update(bytes).digest('hex')!==m.glb_sha256||bytes.length!==m.bytes))throw Error('Asset hash mismatch');
if(actorBytes&&(crypto.createHash('sha256').update(actorBytes).digest('hex')!==am.glb_sha256||actorBytes.length!==am.glb_bytes))throw Error('Actor study hash mismatch');
const contactLimit=w28?10:25;
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
 page.on('request',r=>{if(bytes&&new URL(r.url()).pathname.endsWith(w28?'/artlab/w28-house.glb':'/artlab/horeb_egypt_house_hero_pilot.glb')){requests++;return r.respond({status:200,contentType:'model/gltf-binary',body:bytes});}if(actorBytes&&new URL(r.url()).pathname.endsWith(w28?'/artlab/'+actorFile:'/artlab/horeb_mother_w22_candidate.glb')){actorRequests++;return r.respond({status:200,contentType:'model/gltf-binary',body:actorBytes});}return r.continue();});}
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
 await page.goto((process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5192').replace(/\/$/,'')+'/artlab.html'+(w28?'?study='+pair.name:''),{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>Number(document.querySelector('[data-testid="house-meshes"]')?.textContent)>0);
 if(bytes&&requests<=prior)throw Error('No candidate request');
 await page.click('[data-testid="house-actor-toggle"]');
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='idle');
 if(actorBytes&&actorRequests<=priorActor)throw Error('No exact actor study request');
 const actor=await state();
 if(actor.houseActorBones!=='53'||Number(actor.houseActorSkinned)<2||(pair&&Number(actor.houseActorSkinned)!==pair.meshes))throw Error('Missing real skinning');
 if(actor.houseActorContactMetric!==(w28?'middle-skin-vertex':'wrist-vertex')||(w28&&Number(actor.houseActorSkinSamples)<20))throw Error('Wrong proximity metric '+JSON.stringify(actor));
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

 if(Number(actual.houseActorContactMm)>=contactLimit)throw Error('Actor contact witness misses actual rim: '+JSON.stringify(actual));
 const actorCanvas=await page.$(sel);
 await actorCanvas.screenshot({path:path.join(dir,mobile?'actor-mobile390.png':'actor-desktop1440.png')});
 await until(s=>document.querySelector(s).dataset.houseActorPhase==='complete');
 const endGesture=await state();
 if(Number(endGesture.houseActorTime)<2.91||Number(endGesture.houseActorWorstMm)>=contactLimit||Number(endGesture.houseActorHoldSeconds)<.5)throw Error('Action completion invalid '+JSON.stringify(endGesture));
 console.log('W27A_RIG_CONTACT',JSON.stringify({mobile,peak:actual.houseActorContactMm,completed:endGesture.houseActorContactMm,extent:actual.houseActorFrameExtent,aperture:actual.houseActorAperture,worst:endGesture.houseActorWorstMm,hold:endGesture.houseActorHoldSeconds,bones:actor.houseActorBones,metric:actor.houseActorContactMetric,skinSamples:actor.houseActorSkinSamples,actor:am?.glb_sha256||'canonical W22'}));

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
