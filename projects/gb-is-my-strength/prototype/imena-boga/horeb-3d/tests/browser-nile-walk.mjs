// W10: verify that the Nile scene is a physically navigable 3D shoreline,
// not a cosmetic animated shot. Tests real Chrome keyboard and pointer input.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const chrome=[process.env.HOREB_BROWSER_PATH,
 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
 '/usr/bin/google-chrome','/usr/bin/chromium'].find(x=>x&&existsSync(x));
if(!chrome)throw new Error('A real Chromium/Chrome binary is required');
const args=process.env.HOREB_SWIFTSHADER==='1'
 ? ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:[];
if(process.env.HOREB_NO_SANDBOX==='1')args.push('--no-sandbox','--disable-setuid-sandbox');
const browser=await puppeteer.launch({executablePath:chrome,headless:true,args,protocolTimeout:120000});
const out=join(process.cwd(),'.test-build','screenshots');
mkdirSync(out,{recursive:true});
const page=await browser.newPage();
await page.setViewport({width:1024,height:768,deviceScaleFactor:1});
page.setDefaultTimeout(45000);
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=(process.env.HOREB_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');
const read=()=>page.$eval('[data-testid="moses-nile-3d"]',c=>({
 mode:c.dataset.nileMode,x:Number(c.dataset.nileCameraX),
 z:Number(c.dataset.nileCameraZ),y:Number(c.dataset.nileWalkY),
 rendered:c.dataset.nileRendered==='true',
 bounds:c.dataset.nileWalkBounds,
}));
const sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
try{
 const response=await page.goto(base+'/?e2e',{waitUntil:'domcontentloaded'});
 if(response?.status()!==200)throw new Error('Intro HTTP failure');
 await page.click('[data-testid="moses-origin-start"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-nile-3d"]')?.dataset.nileRendered==='true');
 await page.click('[data-testid="nile-explore-start"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-nile-3d"]')?.dataset.nileCameraPhase==='walk');
 const first=await read();
 const size=await page.$eval('[data-testid="nile-viewport"]',el=>{
   const r=el.getBoundingClientRect();
   return {x:r.x,y:r.y,width:r.width,height:r.height,winX:innerWidth,winY:innerHeight};
 });
 if(!first.rendered||first.bounds!=='4.3,8.9,-15,8'||
    size.width<size.winX-2||size.height<size.winY-2||Math.abs(size.x)>1||Math.abs(size.y)>1)
   throw new Error('W10 MUST BE FULLSCREEN REAL 3D '+JSON.stringify({first,size}));
 await page.keyboard.down('w');await sleep(800);await page.keyboard.up('w');
 await sleep(90);
 const next=await read();
 if(!(Math.hypot(next.x-first.x,next.z-first.z)>.75)&&next.mode==='walk')
   throw new Error('W10 KEYBOARD DOES NOT MOVE GROUNDED 3D CAMERA '+JSON.stringify({first,next}));
 if(!Number.isFinite(next.y)||next.x<4.3||next.x>8.9||next.z< -15||next.z>8)
   throw new Error('W10 NAV GROUND BOUNDARY FAILED '+JSON.stringify(next));
 await page.screenshot({path:join(out,'w10-nile-walking-desktop.png')});
 // Prove pointer drag changes actual camera orientation, not a decorative UI.
 const cam=await page.$('[data-testid="moses-nile-3d"]');
 const rect=await cam.boundingBox();
 if(!rect)throw new Error('NILE CANVAS IS NOT VISIBLE');
 const lookStart=await page.$eval('[data-testid="moses-nile-3d"]',c=>Number(c.dataset.nileLookYaw));
 await page.mouse.move(rect.x+rect.width*.65,rect.y+rect.height*.55);
 await page.mouse.down();await page.mouse.move(rect.x+rect.width*.35,rect.y+rect.height*.35,{steps:8});
 await sleep(100);
 const lookChanged=await page.$eval('[data-testid="moses-nile-3d"]',c=>Number(c.dataset.nileLookYaw));
 if(Math.abs(lookChanged-lookStart)<.22)
   throw new Error('W10 POINTER DRAG DID NOT TURN PHYSICAL CAMERA '+JSON.stringify({lookStart,lookChanged}));
 // Return the view to its intentional composition before mobile captures.
 await page.mouse.move(rect.x+rect.width*.65,rect.y+rect.height*.55,{steps:8});
 await page.mouse.up();
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});
 await sleep(170);
 const mobile=await page.$eval('[data-testid="nile-viewport"]',el=>{
   const r=el.getBoundingClientRect();
   return {width:r.width,height:r.height,winX:innerWidth,winY:innerHeight,
     hasControls:!!el.querySelector('[data-testid="nile-move-forward"]')};
 });
 if(mobile.width<389||mobile.height<843||!mobile.hasControls)
   throw new Error('W10 MOBILE WALK VIEWPORT '+JSON.stringify(mobile));
 const beforeTouch=await read();
 const forward=await page.$('[data-testid="nile-move-forward"]');
 const box=await forward.boundingBox();
 if(!box)throw new Error('MOBILE WALK CONTROL HIDDEN');
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
 await page.mouse.down();await sleep(530);await page.mouse.up();await sleep(95);
 const afterTouch=await read();
 if(Math.hypot(afterTouch.x-beforeTouch.x,afterTouch.z-beforeTouch.z)<.2)
   throw new Error('W10 MOBILE POINTER MOVEMENT INERT '+JSON.stringify({beforeTouch,afterTouch}));
 await page.screenshot({path:join(out,'w10-nile-walking-phone.png')});
 await page.click('[data-testid="nile-explore-close"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-nile-3d"]')?.dataset.nileMode==='shot');
 if(await page.$('[data-testid="nile-explore-start"]')===null)throw new Error('CINEMATIC MODE NOT RESTORED');
 // The rescue moment must be independently walkable in the same physical
 // Nile environment; new figures are geometry, not a static picture.
 await page.click('[data-testid="moses-origin-next"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-nile-discovery-3d"]')?.dataset.nileRendered==='true');
 const figures=await page.$eval('[data-testid="moses-nile-discovery-3d"]',c=>Number(c.dataset.nileFigures));
 if(figures!==3)throw new Error('RESCUE WORLD LOST ALL THREE FIGURES');
 await page.click('[data-testid="nile-explore-start"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="moses-nile-discovery-3d"]')?.dataset.nileCameraPhase==='walk');
 const beforeRescue=await page.$eval('[data-testid="moses-nile-discovery-3d"]',c=>Number(c.dataset.nileCameraZ));
 await page.keyboard.down('a');await sleep(500);await page.keyboard.up('a');await sleep(80);
 const afterRescue=await page.$eval('[data-testid="moses-nile-discovery-3d"]',c=>Number(c.dataset.nileCameraZ));
 if(Math.abs(afterRescue-beforeRescue)<.16)
   throw new Error('RESCUE WORLD CAMERA CANNOT WALK '+JSON.stringify({beforeRescue,afterRescue}));
 await page.screenshot({path:join(out,'w10-nile-rescue-walking.png')});
 await page.click('[data-testid="nile-explore-close"]');
 if(errors.length)throw new Error('PAGE ERRORS '+JSON.stringify(errors));
 console.log('PASS W10 real Nile walking: fullscreen desktop/mobile, keyboard, bounded ground, pointer move, cinematic return');
}finally{await browser.close();}
