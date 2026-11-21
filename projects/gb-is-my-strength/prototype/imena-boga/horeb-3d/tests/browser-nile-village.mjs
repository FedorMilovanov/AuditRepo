import puppeteer from 'puppeteer-core';
import {mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const fs={mkdirSync},path={join};
(async()=>{
 const chrome=[process.env.HOREB_BROWSER_PATH,'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','/usr/bin/google-chrome','/usr/bin/chromium'].find(x=>x&&existsSync(x));
 if(!chrome)throw Error('W15 Chrome required');
 const args=process.env.HOREB_SWIFTSHADER==='1'?['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:[];
 if(process.env.HOREB_NO_SANDBOX==='1')args.push('--no-sandbox','--disable-setuid-sandbox');
 const browser=await puppeteer.launch({executablePath:chrome,headless:true,args,protocolTimeout:120000});
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 try{
 const page=await browser.newPage();page.setDefaultTimeout(60000);
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 const dir=path.join(process.cwd(),'.test-build','screenshots');fs.mkdirSync(dir,{recursive:true});
 const base=(process.env.HOREB_BASE_URL||'http://127.0.0.1:5173').replace(/\/$/,'');
 const read=()=>page.$eval('[data-testid="nile-village-canvas"]',c=>({x:Number(c.dataset.villageX),z:Number(c.dataset.villageZ),stage:Number(c.dataset.villageStep),mode:c.dataset.villageMode}));
 await page.setViewport({width:1024,height:768});
 await page.goto(base+'/?e2e',{waitUntil:'domcontentloaded'});
 await page.click('[data-testid="moses-origin-start"]');
 if(await page.$('[data-testid="moses-nile-3d"]'))throw Error('W15 duplicate WebGL on game launch');
 await page.waitForFunction(()=>!document.querySelector('[data-testid="nile-village-start"]')?.disabled);
 await page.click('[data-testid="nile-village-start"]');
 const checkpoints=[[3,11],[7,8],[6,3],[6,3],[-5.45,-16.1],[-4.15,-12.5]];
 const go=async (axis,target)=>{
   const cur=await read(),axisVal=cur[axis],delta=target-axisVal;
   if(Math.abs(delta)<.72)return;
   const key=axis==='z'?(delta<0?'w':'s'):(delta<0?'a':'d');
   await page.keyboard.down(key);
   try{await page.waitForFunction(({axis,target})=>{
      const c=document.querySelector('[data-testid="nile-village-canvas"]');
      const v=Number(axis==='x'?c?.dataset.villageX:c?.dataset.villageZ);
      return Number.isFinite(v)&&Math.abs(target-v)<.75;
   },{timeout:120000},{axis,target});}
   finally{await page.keyboard.up(key);}
   await sleep(80);
 };
 for(let i=0;i<checkpoints.length;i++){
   const [x,z]=checkpoints[i];
   await go('x',x);await go('z',z);
   await page.waitForFunction(()=>!document.querySelector('[data-testid="nile-village-interact"]')?.disabled,{timeout:7000});
   const before=await read();
   await page.click('[data-testid="nile-village-interact"]');
   await page.waitForFunction(stage=>Number(document.querySelector('[data-testid="nile-village-canvas"]')?.dataset.villageStep)===stage+1,{timeout:10000},i);
   const after=await read();
   console.log('W15_CHECKPOINT',JSON.stringify({i,position:before,afterStage:after.stage}));
   await page.screenshot({path:path.join(dir,'w15-checkpoint-'+i+'.png')});
 }
 await page.waitForSelector('[data-testid="nile-village-finish"]');
 await page.click('[data-testid="nile-village-finish"]');
 await page.waitForSelector('[data-testid="moses-nile-discovery-3d"]');
 console.log('W15_COMPLETE',JSON.stringify({discovery:true,errors:errs.length}));
 if(errs.length)throw Error(errs.join('; '));
 // W15.3: a genuine touch on the movement control, not desktop page.mouse.
 await page.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await page.goto(base+'/?e2e&nile-village-mobile=1',{waitUntil:'domcontentloaded'});
 await page.click('[data-testid="moses-origin-start"]');
 await page.waitForFunction(()=>!document.querySelector('[data-testid="nile-village-start"]')?.disabled);
 await page.screenshot({path:path.join(dir,'w15-village-intro-mobile390.png')});
 await page.click('[data-testid="nile-village-start"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="nile-village-canvas"]')?.dataset.villageMode==='walk');
 const mobileStart=await read();
 const forward=await page.$('[data-testid="nile-village-move-forward"]');
 const box=await forward?.boundingBox();
 if(!box)throw Error('W15 mobile movement missing');
 const session=await page.createCDPSession();
 const px=box.x+box.width/2,py=box.y+box.height/2;
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',
   touchPoints:[{id:3,x:px,y:py}]});
 try{
   await page.waitForFunction(start=>{
     const c=document.querySelector('[data-testid="nile-village-canvas"]');
     return Math.abs(Number(c?.dataset.villageZ)-start.z)>.30;
   },{timeout:35000},mobileStart);
 }finally{
   await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await session.detach();
 }
 await page.screenshot({path:path.join(dir,'w15-village-walk-mobile390.png')});
 await page.click('[data-testid="nile-village-close"]');
 await page.waitForFunction(()=>document.querySelector('[data-testid="nile-village-canvas"]')?.dataset.villageMode==='preview');
 if(errs.length)throw Error(errs.join('; '));
 console.log('PASS W15 real mobile touch, portrait 390 and safe exit');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
