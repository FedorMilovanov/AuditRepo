const puppeteer=require('puppeteer-core');const fs=require('fs');const path=require('path');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const browser=await puppeteer.launch({executablePath:process.env.HOREB_BROWSER_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',headless:true,args:['--ignore-gpu-blocklist'],protocolTimeout:120000});
try{
 const out=process.env.HOREB_ARTLAB_SCREENSHOTS||path.join(process.cwd(),'.test-build','artlab');
 fs.mkdirSync(out,{recursive:true});const errors=[];
 const page=await browser.newPage();page.setDefaultTimeout(55000);
 page.on('pageerror',e=>errors.push(e.stack||e.message));
 page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
 page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
 const url=(process.env.HOREB_ARTLAB_BASE_URL||'http://127.0.0.1:5192').replace(/\/$/,'')+'/actorlab-w19h.html';
 for(const [w,h,mob] of [[1440,900,false],[390,844,true]]){
  await page.setViewport({width:w,height:h,deviceScaleFactor:1,isMobile:mob,hasTouch:mob});
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Number(document.querySelector('[data-testid="mother-bones"]')?.textContent)>=45,{timeout:55000});
  const state=await page.evaluate(()=>({
   bones:+document.querySelector('[data-testid="mother-bones"]').textContent,
   skinned:+document.querySelector('[data-testid="mother-skinned"]').textContent,
   clips:+document.querySelector('[data-testid="mother-clips"]').textContent,
   noOverflow:document.documentElement.scrollWidth<=innerWidth,
   canvas:(()=>{let r=document.querySelector('[data-testid="mother-art-canvas"]').getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})(),
  }));
  if(state.bones<45||state.clips<2||state.skinned<3||!state.noOverflow)throw Error('Actor not loaded '+JSON.stringify(state));
  const size=mob?'mobile390':'desktop1440';
  await sleep(150);
  await page.screenshot({path:path.join(out,'w19h-mother-'+size+'-full.png')});
  await page.click('[data-testid="mother-shot-portrait"]');await sleep(210);
  await page.screenshot({path:path.join(out,'w19h-mother-'+size+'-face.png')});
  await page.click('[data-testid="mother-shot-gesture"]');
  await page.click('[data-testid="mother-clip-gesture"]');
  await sleep(1050);
  await page.screenshot({path:path.join(out,'w19h-mother-'+size+'-gesture.png')});
  const gestureSelected=await page.$eval('[data-testid="mother-clip-gesture"]',el=>el.getAttribute('aria-pressed'));
  if(gestureSelected!=='true')throw Error('Gesture not selected');
  await page.click('[data-testid="mother-animation-pause"]');
  await page.screenshot({path:path.join(out,'w19h-mother-'+size+'-gesture-paused.png')});
  console.log('W19H_BROWSER_RESULT',JSON.stringify({w,h,state,errorCount:errors.length}));
  if(errors.length)throw Error('Browser errors: '+errors.join('; '));
 }
 console.log('W19H_REAL_CC0_WOVEN_LINEN_CHROME_PASS');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
