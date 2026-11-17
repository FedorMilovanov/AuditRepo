// W12A: truly independent WebGL Midian family encampment; grounded movement
// through a real rendered tent opening, mobile controls and WebGL lifecycle.
import puppeteer from 'puppeteer-core';
import {existsSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
const browserExe=[process.env.HOREB_BROWSER_PATH,process.env.PUPPETEER_EXECUTABLE_PATH,
 '/usr/bin/google-chrome','/usr/bin/chromium',
 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
 .find(v=>v&&existsSync(v));
if(!browserExe)throw Error('W12A needs a real Chromium binary');
const args=process.env.HOREB_SWIFTSHADER==='1'
 ?['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:[];
if(process.env.HOREB_NO_SANDBOX==='1')args.push('--no-sandbox','--disable-setuid-sandbox');
const browser=await puppeteer.launch({executablePath:browserExe,headless:true,args,protocolTimeout:120000});
const page=await browser.newPage();
page.setDefaultTimeout(60000);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const out=join(process.cwd(),'.test-build','screenshots');mkdirSync(out,{recursive:true});
const read=()=>page.$eval('[data-testid="moses-midian-homestead-3d"]',e=>({
  x:Number(e.dataset.midianX),z:Number(e.dataset.midianZ),
  y:Number(e.dataset.midianY),ground:Number(e.dataset.midianGround),
  yaw:Number(e.dataset.midianYaw),world:e.dataset.midianWorld,
  mode:e.dataset.midianMode,
}));
try{
  await page.setViewport({width:1024,height:768,deviceScaleFactor:1});
  const base=(process.env.HOREB_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');
  const response=await page.goto(base+'/?e2e',{waitUntil:'domcontentloaded'});
  if(response?.status()!==200)throw Error('HOMESTEAD not loaded over HTTP');
  await page.click('[data-testid="moses-origin-start"]');
  for(let i=0;i<3;i++)await page.click('[data-testid="moses-origin-next"]');
  await page.click('[data-testid="moses-prehoreb-stage-1"]');
  await page.waitForFunction(()=>
    document.querySelector('[data-testid="moses-midian-homestead-3d"]')?.dataset.midianRendered==='true');
  const witness=await page.$eval('[data-testid="moses-midian-homestead-3d"]',e=>({
    world:e.dataset.midianWorld,
    roof:e.dataset.homesteadShelter,
    door:e.dataset.homesteadDoor,hills:e.dataset.homesteadHills,
    roofPanels:Number(e.dataset.homesteadRoofPanels),
    sidePanels:Number(e.dataset.homesteadSidePanels),
    posts:Number(e.dataset.homesteadPosts),
    rear:Number(e.dataset.homesteadRearGables),
  }));
  if(witness.world!=='homestead'||witness.roof!=='3d-woven-fabric-and-posts'||
     witness.door!=='walkable'||witness.hills!=='1'||
     witness.roofPanels!==2||witness.sidePanels!==2||
     witness.posts!==6||witness.rear!==1)
    throw Error('HOMESTEAD 3D CONTRACT '+JSON.stringify(witness));
  await page.screenshot({path:join(out,'homestead-shot-desktop.png')});
  await page.click('[data-testid="midian-homestead-explore-start"]');
  await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-homestead-3d"]')?.dataset.midianMode==='walk');
  await sleep(130);
  const a=await read();
  const dims=await page.$eval('[data-testid="midian-viewport"]',e=>{
    const r=e.getBoundingClientRect();
    return {w:r.width,h:r.height,vw:innerWidth,vh:innerHeight};
  });
  if(dims.w<dims.vw-2||dims.h<dims.vh-2)throw Error('HOMESTEAD not fullscreen');
  await page.keyboard.down('w');await sleep(900);await page.keyboard.up('w');await sleep(90);
  const b=await read();
  const distance=Math.hypot(b.x-a.x,b.z-a.z);
  if(distance<.19||a.z-b.z<.17||Math.abs(b.y-b.ground-1.68)>.01)
    throw Error('HOMESTEAD GROUNDED WALK '+JSON.stringify({a,b,distance}));
  await page.screenshot({path:join(out,'homestead-walk-desktop.png')});
  const canvas=await page.$('[data-testid="moses-midian-homestead-3d"]');
  const rect=await canvas.boundingBox();
  if(!rect)throw Error('HOMESTEAD canvas not visible');
  await page.mouse.move(rect.x+rect.width*.6,rect.y+rect.height*.54);
  await page.mouse.down();
  await page.mouse.move(rect.x+rect.width*.31,rect.y+rect.height*.43,{steps:6});
  await page.mouse.up();await sleep(65);
  if(Math.abs((await read()).yaw-b.yaw)<.19)throw Error('HOMESTEAD pointer look broken');
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await sleep(140);
  const mobile=await page.$eval('[data-testid="midian-viewport"]',e=>{
    const r=e.getBoundingClientRect();
    return {w:r.width,h:r.height,hasKeys:!!e.querySelector('[data-testid="midian-move-forward"]')};
  });
  if(mobile.w<389||mobile.h<843||!mobile.hasKeys)
    throw Error('HOMESTEAD mobile controls hidden '+JSON.stringify(mobile));
  await page.screenshot({path:join(out,'homestead-walk-mobile390.png')});
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-homestead-3d"]')?.dataset.midianMode==='shot');
  const focus=await page.evaluate(()=>document.activeElement?.getAttribute('data-testid'));
  if(focus!=='midian-homestead-explore-start')throw Error('HOMESTEAD nested ESC/focus '+focus);
  await page.click('[data-testid="moses-prehoreb-stage-2"]');
  await page.waitForFunction(()=>!document.querySelector('[data-testid="moses-midian-homestead-3d"]'));
  if((await page.$$('canvas')).length!==0)throw Error('HOMESTEAD leaked WebGL into Gershom');
  await page.click('[data-testid="moses-prehoreb-stage-1"]');
  await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-homestead-3d"]')?.dataset.midianRendered==='true');
  if((await page.$$('canvas')).length!==1||errors.length)
    throw Error('HOMESTEAD WebGL remount/errors '+JSON.stringify(errors));
  console.log('PASS W12A: independent 3D homestead, physical walk, 390px, focus and remount');
}finally{await browser.close();}
