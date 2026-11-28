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
 const rawBase=process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5192'; const base=rawBase.endsWith('/')?rawBase.slice(0,-1):rawBase;
 const page=await browser.newPage();page.setDefaultTimeout(45000);
 // Optional local W26 study only: use the exact bytes specified by the
 // generated manifest. Never replace the tracked W17 GLB in public/.
 const study=process.env.HOREB_HOUSE_STUDY_DIR;
 let studyRequests=0,studySha=null;
 if(study){
   const manifest=JSON.parse(fs.readFileSync(path.join(study,'w26-study-manifest.json'),'utf8'));
   const name=manifest.glb_file||'w26-house-study.glb';
   if(!['w26-house-study.glb','w26b-house-study.glb'].includes(name))throw Error('Unexpected study filename');
   const bytes=fs.readFileSync(path.join(study,name));
   studySha=require('node:crypto').createHash('sha256').update(bytes).digest('hex');
   if(studySha!==manifest.glb_sha256||bytes.length!==manifest.bytes||manifest.status!=='ART_HOLD_W26_HOUSE_STUDY')throw Error('W26 exact study manifest mismatch');
   await page.setCacheEnabled(false);
   await page.setRequestInterception(true);
   page.on('request',req=>{
     if(new URL(req.url()).pathname.endsWith('/artlab/horeb_egypt_house_hero_pilot.glb')){
       studyRequests++;return req.respond({status:200,contentType:'model/gltf-binary',body:bytes});
     }
     return req.continue();
   });
 }
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('console',c=>{if(c.type()==='error')errors.push('console: '+c.text())});
 page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 for(const [width,height,mobile] of [[1440,900,false],[390,844,true]]){
   await page.setViewport({width,height,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
   const previousRequests=studyRequests;
   const resp=await page.goto(base+'/artlab.html',{waitUntil:'domcontentloaded'});
   if(![200,304].includes(resp?.status()))throw Error('Artlab HTTP '+resp?.status());
   await page.waitForFunction(()=>Number(document.querySelector('[data-testid="house-meshes"]')?.textContent)>0);
   await sleep(250);
   if(study&&studyRequests<=previousRequests)throw Error('W26 no exact asset request for viewport '+width);
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
   const capture=async shot=>{
    await page.evaluate(()=>window.scrollTo(0,0));
    await sleep(100);
    await page.screenshot({path:path.join(dir,'house-lookdev-'+id+'-'+shot+'.png')});
    const canvas=await page.$('[data-testid="house-lookdev-canvas"]');
    await canvas.screenshot({path:path.join(dir,'house-canvas-'+id+'-'+shot+'.png')});
   };
   await capture('courtyard');
   await page.click('[data-testid="house-view-threshold"]');
   await sleep(300);
   await capture('threshold');
   await page.click('[data-testid="house-view-room"]');
   await sleep(300);
   await capture('room');
   await page.click('[data-testid="house-view-basket"]');
   await page.waitForFunction(()=>{
    const d=document.querySelector('[data-testid="house-lookdev-canvas"]').dataset;
    return d.houseView==='basket'&&Number.isFinite(Number(d.basketFrameExtent))&&Number(d.basketFrameExtent)<.96&&d.basketBlockedRays==='0';
   });
   await sleep(300);
   await capture('basket');
   await page.click('[data-testid="house-roof-toggle"]');
   const roof=await page.$eval('[data-testid="house-roof-toggle"]',b=>b.textContent);
   await capture('roof-hidden');
   const fit=await page.$eval('[data-testid="house-lookdev-canvas"]',c=>({extent:Number(c.dataset.basketFrameExtent),blocked:Number(c.dataset.basketBlockedRays)}));
   console.log('ARTLAB_GLTF_GATE',JSON.stringify({width,height,init,roof,fit,requests:studyRequests-previousRequests,errors}));
   if(errors.length)throw Error(errors.join('; '));
 }
 if(study&&studyRequests<2)throw Error('W26 missing exact asset requests: '+studyRequests);
 if(study)console.log('W26_EXACT_ASSET_BROWSER_WITNESS',JSON.stringify({studySha,studyRequests}));
 console.log('ARTLAB_GLTF_BROWSER_GATE_PASS (engineering only; ART status HOLD)');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
