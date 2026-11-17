// W11A: real Midian WebGL navigation, desktop/phone controls and lifecycle.
import puppeteer from 'puppeteer-core';
import { existsSync,mkdirSync } from 'node:fs';
import { join } from 'node:path';
const chrome=[process.env.HOREB_BROWSER_PATH,process.env.PUPPETEER_EXECUTABLE_PATH,
 '/usr/bin/google-chrome','/usr/bin/chromium',
 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
 .find(x=>x&&existsSync(x));
if(!chrome)throw Error('MIDIAN needs a real Chromium binary');
const args=process.env.HOREB_SWIFTSHADER==='1'
 ? ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:[];
if(process.env.HOREB_NO_SANDBOX==='1')args.push('--no-sandbox','--disable-setuid-sandbox');
const browser=await puppeteer.launch({executablePath:chrome,headless:true,args,protocolTimeout:120000});
const page=await browser.newPage();
page.setDefaultTimeout(60000);
const out=join(process.cwd(),'.test-build','screenshots');
mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const read=()=>page.$eval('[data-testid="moses-midian-well-3d"]',c=>({
 x:Number(c.dataset.midianX),y:Number(c.dataset.midianY),
 z:Number(c.dataset.midianZ),ground:Number(c.dataset.midianGround),
 yaw:Number(c.dataset.midianYaw),mode:c.dataset.midianMode,
}));
try{
 await page.setViewport({width:1024,height:768,deviceScaleFactor:1});
 const base=(process.env.HOREB_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');
 const response=await page.goto(base+'/?e2e',{waitUntil:'domcontentloaded'});
 if(response?.status()!==200)throw Error('MIDIAN HTTP failed');
 await page.click('[data-testid="moses-origin-start"]');
 for(let i=0;i<3;i++)await page.click('[data-testid="moses-origin-next"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-well-3d"]')?.dataset.midianRendered==='true');
 const shape=await page.$eval('[data-testid="moses-midian-well-3d"]',e=>({
  world:e.dataset.midianWorld,stones:Number(e.dataset.midianWellStones),
  obstacles:e.dataset.midianObstacle,
  troughStones:Number(e.dataset.midianTroughStones),
  ridges:Number(e.dataset.midianRidges),
  twigs:Number(e.dataset.midianScrubTwigs),
  rocks:Number(e.dataset.midianRockInstances),
 }));
 if(shape.world!=='well'||shape.stones!==96||shape.obstacles!=='well,water-trough'||
   shape.ridges!==2||shape.twigs<150||shape.rocks<50||shape.troughStones!==10)
   throw Error('MIDIAN GEOMETRY NOT RENDERED '+JSON.stringify(shape));
 await page.screenshot({path:join(out,'midian-shot-desktop.png')});
 await page.click('[data-testid="midian-explore-start"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-well-3d"]')?.dataset.midianMode==='walk');
 await page.waitForFunction(()=>Number.isFinite(Number(document.querySelector('[data-testid="moses-midian-well-3d"]')?.dataset.midianY)));
 await sleep(100);
 const first=await read();
 const box=await page.$eval('[data-testid="midian-viewport"]',e=>{
   const r=e.getBoundingClientRect();
   return {w:r.width,h:r.height,vw:innerWidth,vh:innerHeight,x:r.x,y:r.y};
 });
 if(box.w<box.vw-2||box.h<box.vh-2||Math.abs(box.x)>1||Math.abs(box.y)>1)
   throw Error('MIDIAN WALK NOT FULLSCREEN '+JSON.stringify(box));
 await page.keyboard.down('w');await sleep(1100);await page.keyboard.up('w');
 await sleep(90);
 const after=await read();
 const dist=Math.hypot(after.x-first.x,after.z-first.z);
 const along=-(after.x-first.x)*Math.sin(.62)-(after.z-first.z)*Math.cos(.62);
 if(after.mode!=='walk'||dist<.19||along<.17||Math.abs(after.y-after.ground-1.68)>.009)
   throw Error('MIDIAN CAMERA DOES NOT WALK ON GROUND '+JSON.stringify({first,after,dist,along}));
 await page.screenshot({path:join(out,'midian-walk-desktop.png')});
 const camera=await page.$('[data-testid="moses-midian-well-3d"]');
 const cb=await camera.boundingBox();if(!cb)throw Error('MIDIAN WALK CANVAS INVISIBLE');
 const yaw=after.yaw;
 await page.mouse.move(cb.x+cb.width*.65,cb.y+cb.height*.58);
 await page.mouse.down();
 await page.mouse.move(cb.x+cb.width*.34,cb.y+cb.height*.41,{steps:8});
 await page.mouse.up();await sleep(80);
 const rotated=await read();
 if(Math.abs(rotated.yaw-yaw)<.2)throw Error('MIDIAN REAL POINTER LOOK NOT WORKING');
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});
 await sleep(180);
 const mobile=await page.$eval('[data-testid="midian-viewport"]',e=>{
   const r=e.getBoundingClientRect();
   return {w:r.width,h:r.height,vw:innerWidth,vh:innerHeight,
    controls:!!e.querySelector('[data-testid="midian-move-forward"]')};
 });
 if(mobile.w<389||mobile.h<843||!mobile.controls)
   throw Error('MIDIAN PHONE SCREEN NOT FULL '+JSON.stringify(mobile));
 const prior=await read();
 const control=await page.$('[data-testid="midian-move-forward"]');
 const hit=await control.boundingBox();if(!hit)throw Error('MIDIAN MOBILE CONTROL HIDDEN');
 await page.mouse.move(hit.x+hit.width/2,hit.y+hit.height/2);
 await page.mouse.down();await sleep(750);await page.mouse.up();
 await sleep(80);
 const moved=await read();
 if(Math.hypot(moved.x-prior.x,moved.z-prior.z)<.15)
   throw Error('MIDIAN MOBILE INPUT INERT '+JSON.stringify({prior,moved}));
 await page.screenshot({path:join(out,'midian-walk-mobile390.png')});
 await page.keyboard.press('Escape');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-well-3d"]')?.dataset.midianMode==='shot');
 const focus=await page.evaluate(()=>({
  story:!!document.querySelector('[data-testid="moses-origin-story"]'),
  target:document.activeElement?.getAttribute('data-testid'),
 }));
 if(!focus.story||focus.target!=='midian-explore-start')
   throw Error('MIDIAN ESC / FOCUS '+JSON.stringify(focus));
 // W12A: stage 1 now has its OWN homestead WebGL canvas. The old well must
 // be unmounted, with exactly one live canvas (never two overlapping worlds).
 await page.click('[data-testid="moses-prehoreb-stage-1"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-homestead-3d"]')?.dataset.midianRendered==='true');
 if((await page.$('canvas')).length!==1 || await page.$('[data-testid="moses-midian-well-3d"]'))
   throw Error('MIDIAN WELL NOT REPLACED BY SINGLE HOMESTEAD CANVAS');
 // The following Gershom narrative is text-only and must release BOTH worlds.
 await page.click('[data-testid="moses-prehoreb-stage-2"]');
 await page.waitForFunction(()=>!document.querySelector('[data-testid="moses-midian-homestead-3d"]'));
 if((await page.$('canvas')).length!==0)throw Error('MIDIAN WEBGL LEAKED INTO GERSHOM');
 await page.click('[data-testid="moses-prehoreb-stage-0"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-midian-well-3d"]')?.dataset.midianRendered==='true');
 if((await page.$$('canvas')).length!==1||errors.length)
   throw Error('MIDIAN REMOUNT / PAGE ERROR '+JSON.stringify(errors));
 console.log('PASS W11A: real Midian well, ground movement, mobile, Esc, WebGL remount');
}finally{await browser.close();}
