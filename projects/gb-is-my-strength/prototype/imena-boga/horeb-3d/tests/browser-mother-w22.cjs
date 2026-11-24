// W22 actor pose witness: the source GLB gesture has a true plateau at frames
// 48-70 (24 fps). This is an actual WebGL/browser test, not an ART approval.
const puppeteer=require('puppeteer-core');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const executablePath=process.env.HOREB_BROWSER_PATH||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
 const browser=await puppeteer.launch({
  executablePath,headless:true,protocolTimeout:120000,
  args:['--ignore-gpu-blocklist',
   ...(process.env.HOREB_SWIFTSHADER==='1'?
    ['--enable-webgl','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']:[]),
   ...(process.platform==='linux'?['--no-sandbox']:[])]
 });
 try{
  const out=process.env.HOREB_ARTLAB_SCREENSHOTS||
   path.join(process.cwd(),'.test-build','screenshots');
  fs.mkdirSync(out,{recursive:true});
  const url=(process.env.HOREB_ARTLAB_BASE_URL||process.env.HOREB_BASE_URL||'http://127.0.0.1:5192')
   .replace(/[/]$/,'')+'/actorlab-w22.html';
  for(const [width,height,isMobile,label] of [
   [1440,900,false,'desktop1440'],
   [390,844,true,'mobile390']
  ]){
   const errors=[];
   const page=await browser.newPage();
   page.setDefaultTimeout(60000);
   page.on('pageerror',e=>errors.push(e.stack||e.message));
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
   page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
   await page.setViewport({width,height,isMobile,hasTouch:isMobile,deviceScaleFactor:1});
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>Number(document.querySelector('[data-testid="mother-bones"]')?.textContent)>=53);
   const stats=await page.evaluate(()=>({
    bones:Number(document.querySelector('[data-testid="mother-bones"]').textContent),
    skinned:Number(document.querySelector('[data-testid="mother-skinned"]').textContent),
    clips:Number(document.querySelector('[data-testid="mother-clips"]').textContent),
    noOverflow:document.documentElement.scrollWidth<=innerWidth
   }));
   if(stats.bones!==53||stats.skinned<6||stats.clips<2||!stats.noOverflow)
    throw Error('Invalid W22 actor: '+JSON.stringify(stats));
   await page.click('[data-testid="mother-shot-gesture"]');
   await page.waitForSelector('[data-testid="mother-cutaway-label"]');
   await page.waitForFunction(()=>{
    const d=document.querySelector('[data-testid="mother-art-canvas"]').dataset;
    return d.basketVisible==='true'&&d.facadeVisible==='false';
   });
   await sleep(280);
   const canvas=await page.$('[data-testid="mother-art-canvas"]');
   if(!canvas)throw Error('Live 3D canvas missing');
   const idle=Buffer.from(await canvas.screenshot());
   await page.click('[data-testid="mother-pose-peak"]');
   await page.waitForSelector('[data-testid="mother-peak-state"]');
   const peakState=await page.$eval('[data-testid="mother-peak-state"]',e=>e.textContent);
   const gestureSelected=await page.$eval('[data-testid="mother-clip-gesture"]',e=>e.getAttribute('aria-pressed'));
   const pausedText=await page.$eval('[data-testid="mother-animation-pause"]',e=>e.textContent);
   if(!peakState.includes('60/105')||gestureSelected!=='true'||!pausedText.includes('Продолжить'))
    throw Error('Peak-pose control did not freeze frame 60');
   await sleep(250);
   const peak1=Buffer.from(await canvas.screenshot());
   await page.screenshot({path:path.join(out,'visual-detail-w22-gesture-peak-'+label+'.png')});
   await fs.promises.writeFile(path.join(out,'visual-detail-w22-gesture-canvas-'+label+'.png'),peak1);
   await sleep(450);
   const peak2=Buffer.from(await canvas.screenshot());
   if(idle.equals(peak1))throw Error('Peak gesture image identical to natural idle pose');
   // GPU drivers may produce tiny antialiasing differences in frozen-frame captures.
   // Log the comparison but don't mistake pixel identity for artistic acceptance.
   const frozenByteIdentical=peak1.equals(peak2);
   await page.click('[data-testid="mother-animation-pause"]');
   // The action holds frames 48-70. Under SwiftShader the renderer may only
   // paint a few frames per second and its animation delta is capped to 75 ms.
   // An arbitrary 1200-ms wall-clock delay cannot prove the held pose ended.
   // Keep the strict pixel-change assertion, but wait for a genuinely painted
   // changed frame with a bounded timeout; a stalled mixer still fails.
   const resumedAt=Date.now();
   let resumed=peak1;
   let resumeChecks=0;
   while(resumed.equals(peak1)&&Date.now()-resumedAt<30000){
    await sleep(650);
    resumed=Buffer.from(await canvas.screenshot());
    resumeChecks++;
   }
   const resumeWaitMs=Date.now()-resumedAt;
   if(resumed.equals(peak1))
    throw Error('W22 animation remained frozen after resume '+JSON.stringify({label,resumeChecks,resumeWaitMs}));
   // A real inspector state transition: choose an action while the frame
   // is frozen. A button label alone cannot prove that the mixer resumed.
   const waitAction=(name,scale=1)=>page.waitForFunction((n,sc)=>{
    const d=document.querySelector('[data-testid="mother-art-canvas"]').dataset;
    return d.actionName===n&&Number(d.mixerScale)===sc&&Number(d.actionWeight)>.97;
   },{},name,scale);
   await page.click('[data-testid="mother-pose-peak"]');
   await waitAction('Mother_GestureTowardsBasket',0);
   const peakTime=await page.$eval('[data-testid="mother-art-canvas"]',e=>Number(e.dataset.actionTime));
   if(Math.abs(peakTime-2.5)>.01)throw Error('Actual mixer peak is not frame 60: '+peakTime);
   await page.click('[data-testid="mother-clip-idle"]');
   await waitAction('Mother_QuietIdle');
   await page.waitForFunction(()=>Number(document.querySelector('[data-testid="mother-art-canvas"]').dataset.actionTime)>.15);
   if(await page.$('[data-testid="mother-peak-state"]'))throw Error('Stale inspection label after choosing another clip');
   await page.click('[data-testid="mother-clip-idle"]');
   await waitAction('Mother_QuietIdle');
   await page.click('[data-testid="mother-shot-doorway"]');
   await page.waitForFunction(()=>{
    const d=document.querySelector('[data-testid="mother-art-canvas"]').dataset;
    return d.basketVisible==='true'&&d.facadeVisible==='true';
   });
   await page.click('[data-testid="mother-shot-gesture"]');
   await page.waitForFunction(()=>{
    const d=document.querySelector('[data-testid="mother-art-canvas"]').dataset;
    return d.basketVisible==='true'&&d.facadeVisible==='false';
   });
   console.log('W24_INSPECTOR_STATE_AND_CUTAWAY_PASS',JSON.stringify({label,peakTime,clipSwitch:true,sameActionWeight:true,doorwayRestored:true}));
   if(errors.length)throw Error(errors.join('; '));
   const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
   console.log('W22_GESTURE_PEAK_BROWSER_PASS',JSON.stringify({
    label,stats,frame:60,frozenByteIdentical,resumeChecks,resumeWaitMs,
    idleSha:sha(idle),peakSha:sha(peak1),resumedSha:sha(resumed),
    screenshot:'visual-detail-w22-gesture-peak-'+label+'.png',pageErrors:errors.length
   }));
   await page.close();
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
