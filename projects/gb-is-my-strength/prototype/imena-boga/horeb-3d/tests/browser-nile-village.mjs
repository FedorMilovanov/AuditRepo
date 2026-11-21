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
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

[executed on device: DESKTOP-O3FDOA4 (dcfca44d-427d-4b25-8515-7666448433c4)]