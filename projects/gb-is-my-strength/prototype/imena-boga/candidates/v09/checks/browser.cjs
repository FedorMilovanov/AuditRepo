#!/usr/bin/env node
// Cross-browser visual smoke for independently built Vite references.
// Run after building both experiences and npm ci in checks/.
const {chromium,webkit}=require('playwright-core');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),engine=process.env.ENGINE||'webkit';
const selected={chromium,webkit}[engine];
if(!selected)throw Error('ENGINE must be chromium or webkit');
const widths=(process.env.VIEWPORTS||'320,390,768,1440').split(',').map(Number);
const alpha=async(page,selector)=>page.evaluate(selector=>{
 const c=document.querySelector(selector);
 if(!c) return null;
 const ctx=c.getContext('2d');
 if(!ctx) return null;
 const bytes=ctx.getImageData(0,0,c.width,c.height).data;
 let count=0;
 for(let n=3;n<bytes.length;n+=16)if(bytes[n]>3)count++;
 return count;
},selector);
(async()=>{
 const options={headless:true};
 if(engine==='chromium'&&process.env.CHROMIUM_PATH)options.executablePath=process.env.CHROMIUM_PATH;
 const browser=await selected.launch(options);
 const results=[];
 try{
 for(const name of ['atlas','sozvezdie'])for(const width of widths){
  const html=path.join(root,name,'dist','index.html');
  if(!fs.existsSync(html))throw Error('Missing production build '+html);
  const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
  // Explicit fallback mode tests the experience without third-party fonts.
  // Never confuse this with the online-font visual witness.
  if(process.env.FONTS_MODE==='offline')
    await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file:///'+html.replace(/\\/g,'/'),{waitUntil:'domcontentloaded'});
  // Fonts are fetched from an external stylesheet in the standalone prototype.
  // DOMContentLoaded alone can precede the application's CSS; measuring then
  // produces unstyled text and false overflow reports. Wait for actual styles.
  await page.waitForFunction(() => document.readyState === 'complete' && document.styleSheets.length > 0, null, {timeout:30000});
  await page.waitForTimeout(250);
  const ui=await page.evaluate(()=>{
   const r=document.querySelector('button[title*="Нажмите"]')?.getBoundingClientRect();
   return {client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
     text:document.body.innerText.length,medallion:r?{left:r.left,right:r.right}:null};
  });
  if(errors.length||ui.text<1000||ui.scroll>ui.client+1)throw Error(JSON.stringify({engine,name,width,ui,errors}));
  if(name==='atlas'){
   if(width<400&&ui.medallion&&(ui.medallion.left<0||ui.medallion.right>width))throw Error('Clipped medallion at '+width);
   let c=await alpha(page,'header canvas');
   if(!(c>0))throw Error('Atlas still canvas not painted: '+engine+' '+width+' '+c);
   results.push({name,width,canvasPixels:c,overflow:0});
  }else{
   // The first starfield is below the hero; intentionally offscreen at load.
   // Enter its viewport before inspecting the static Canvas.
   await page.locator('canvas').first().scrollIntoViewIfNeeded();
   await page.waitForTimeout(280);
   let c=await alpha(page,'canvas');
   if(!(c>0))throw Error('Static starfield not painted in viewport: '+engine+' '+width+' '+c);
   results.push({name,width,canvasPixels:c,overflow:0});
  }
  await page.close();
 }
 }finally{await browser.close()}
 console.log(JSON.stringify({status:'PASS',engine,scenarios:results.length,results},null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
