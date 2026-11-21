// ART LOOKDEV gate — actual browser screenshot and interaction. This does not
// claim that the subject is historically identified or premium-art accepted.
const puppeteer=require('puppeteer-core');
const fs=require('node:fs');
const path=require('node:path');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const chrome=[process.env.HOREB_BROWSER_PATH,
   'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
   '/usr/bin/google-chrome','/usr/bin/chromium'].find(x=>x&&fs.existsSync(x));
 if(!chrome)throw Error('Actual local Chromium required; no browser QA skip');
 const browser=await puppeteer.launch({executablePath:chrome,headless:true,
   args:process.env.HOREB_SWIFTSHADER==='1'
     ?['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
     :['--ignore-gpu-blocklist'],protocolTimeout:120000});
 try{
 const dir=process.env.HOREB_ARTLAB_SCREENSHOTS||path.join(process.cwd(),'.test-build','artlab');
 fs.mkdirSync(dir,{recursive:true});
 const base=(process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5192').replace(/\\/$/,'');
 const page=await browser.newPage();page.setDefaultTimeout(45000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('console',c=>{if(c.type()==='error')errors.push('console: '+c.text())});
 page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 for(const [width,height,mobile] of [[1440,900,false],[390,844,true]]){
   await page.setViewport({width,height,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
   const resp=await page.goto(base+'/artlab.html',{waitUntil:'domcontentloaded'});
   if(![200,304].includes(resp?.status()))throw Error('Artlab HTTP '+resp?.status());
   await page.waitForFunction(()=>Number(document.querySelector('[data-testid="house-meshes"]')?.textContent)>0);
   await sleep(250);
   const init=await page.evaluate(()=>({
     meshes:Number(document.querySelector('[data-testid="house-meshes"]')?.textContent),
     triangles:Number(document.querySelector('[data-testid="house-triangles"]')?.textContent),
     canvas:(()=>{const c=document.querySelector('[data-testid="house-lookdev-canvas"]');const r=c?.getBoundingClientRect();return {w:Math.round(r?.width||0),h:Math.round(r?.height||0)}})(),
     webgl:!!document.querySelector('canvas')?.getContext('webgl2'),
     ready:!document.querySelector('[data-testid="house-lookdev-status"]'),
     xOverflow:document.documentElement.scrollWidth>innerWidth
   }));
   if(!init.ready||init.meshes<5||!init.webgl||init.canvas.w<250||init.xOverflow)
     throw Error('Invalid GLB/WebGL scene '+JSON.stringify(init));
   const id=mobile?'mobile390':'desktop1440';
   await page.screenshot({path:path.join(dir,'house-lookdev-'+id+'-courtyard.png')});
   await page.click('[data-testid="house-view-room"]');
   await sleep(300);
   await page.screenshot({path:path.join(dir,'house-lookdev-'+id+'-room.png')});
   await page.click('[data-testid="house-view-basket"]');
   await sleep(300);
   await page.screenshot({path:path.join(dir,'house-lookdev-'+id+'-basket.png')});
   await page.click('[data-testid="house-roof-toggle"]');
   const roof=await page.$eval('[data-testid="house-roof-toggle"]',b=>b.textContent);
   await page.screenshot({path:path.join(dir,'house-lookdev-'+id+'-roof-hidden.png')});
   console.log('ARTLAB_GLTF_GATE',JSON.stringify({width,height,init,roof,errors}));
   if(errors.length)throw Error(errors.join('; '));
 }
 console.log('ARTLAB_GLTF_BROWSER_GATE_PASS (engineering only; ART status HOLD)');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
