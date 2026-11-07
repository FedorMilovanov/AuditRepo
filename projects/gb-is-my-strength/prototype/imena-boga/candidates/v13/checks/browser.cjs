#!/usr/bin/env node
// Cross-browser nested-route tests for split-asset Vite builds.
// No production writes, no dependency on original user browser profile.
const {chromium,webkit}=require('playwright-core');
const {createServer}=require('node:http');
const fs=require('node:fs'), path=require('node:path');
const root=path.resolve(__dirname,'..');
const engine=process.env.ENGINE || 'webkit';
const selected={chromium,webkit}[engine];
if(!selected) throw Error('Unsupported ENGINE');
const widths=(process.env.VIEWPORTS||'320,390,768,1440').split(',').map(Number);
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=createServer((req,res)=>{
 try{
  const pathname=new URL(req.url||'/','http://127.0.0.1').pathname;
  const match=/^\/(atlas|sozvezdie)\/(.*)$/.exec(pathname);
  if(!match){res.writeHead(404).end('Not found');return}
  const dist=path.resolve(root,match[1],'dist');
  const file=path.resolve(dist,decodeURIComponent(match[2]||'index.html'));
  if(file!==path.join(dist,'index.html')&&!file.startsWith(dist+path.sep)){res.writeHead(403).end('Forbidden');return}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end('Not found');return}
  res.writeHead(200,{'content-type':MIME[path.extname(file)]||'application/octet-stream','cache-control':'public, max-age=60'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500).end('Server error')}
});
const countPixels=async(page,selector)=>page.evaluate((selector)=>{
 const canvas=document.querySelector(selector),ctx=canvas?.getContext('2d');
 if(!ctx) return null;
 const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
 let positive=0;
 for(let n=3;n<pixels.length;n+=16)if(pixels[n]>3)positive++;
 return positive;
},selector);
(async()=>{
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',resolve).on('error',reject));
 const base='http://127.0.0.1:'+server.address().port;
 const opts={headless:true};
 if(engine==='chromium'&&process.env.CHROMIUM_PATH)opts.executablePath=process.env.CHROMIUM_PATH;
 let browser;
 const results=[];
 try{
  browser=await selected.launch(opts);
  for(const name of ['atlas','sozvezdie'])for(const width of widths){
   const ctx=await browser.newContext({viewport:{width,height:844},locale:'ru-RU',reducedMotion:'reduce'});
   const page=await ctx.newPage();
   const errors=[],requests=[];
   if(process.env.FONTS_MODE==='offline')await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
   page.on('pageerror',err=>errors.push(err.message));
   page.on('response',resp=>{if(resp.url().startsWith(base)&&resp.status()>=400)requests.push(resp.url()+' '+resp.status())});
   await page.goto(base+'/'+name+'/',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>document.readyState==='complete'&&[...document.styleSheets].some(s=>s.href&&s.href.includes('/assets/')),{timeout:30000});
   // Wait for React, not a fixed guessed network delay.
   await page.locator('h1').first().waitFor({state:'visible'});
   const stats=await page.evaluate(()=>{
    const med=document.querySelector('button[title*="Нажмите"]')?.getBoundingClientRect();
    return {viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
      bodyText:document.body.innerText.length,medallion:med?{left:med.left,right:med.right}:null,
      cssLoaded:[...document.styleSheets].some(s=>s.href?.includes('/assets/'))};
   });
   if(stats.bodyText<1000||stats.scroll>stats.viewport+1||errors.length||requests.length||!stats.cssLoaded)
    throw Error('Layout/runtime failure '+JSON.stringify({engine,name,width,stats,errors,requests}));
   if(name==='atlas'){
    if(width<=390&&stats.medallion&&(stats.medallion.left<0||stats.medallion.right>width))
      throw Error('Medallion clipped '+width);
    let painted=await countPixels(page,'header canvas');
    const started=Date.now();
    while(!(painted>0)&&Date.now()-started<4000){await page.waitForTimeout(120);painted=await countPixels(page,'header canvas')}
    if(!(painted>0))throw Error('Atlas Canvas blank '+width);
    // Arena-derived reader settings must stay usable at every viewport size.
    const settings=page.getByRole('button',{name:'Настройки чтения и шрифта'});
    if(!(await settings.isVisible()))throw Error('Reader settings trigger hidden '+width);
    await settings.click();
    const panel=page.getByRole('region',{name:'Настройки чтения'});
    if(!(await panel.isVisible())||(await settings.getAttribute('aria-expanded'))!=='true')
      throw Error('Reader preferences panel not opened '+width);
    const bounds=await panel.boundingBox();
    if(!bounds||bounds.x<0||bounds.x+bounds.width>width+1)
      throw Error('Reader preferences clipped '+JSON.stringify({width,bounds}));
    await panel.getByRole('button',{name:'Сепия'}).click();
    const theme=await page.evaluate(()=>({
      mode:document.documentElement.getAttribute('data-reader-theme'),
      chrome:document.querySelector('meta[name="theme-color"]')?.getAttribute('content')
    }));
    if(theme.mode!=='sepia'||theme.chrome!=='#f4ede0')
      throw Error('Theme did not update browser chrome '+JSON.stringify({width,theme}));
    const previousSize=await page.locator('main').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
    await panel.getByRole('button',{name:'Увеличить размер текста в настройках'}).click();
    const nextSize=await page.locator('main').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
    if(!(nextSize>previousSize))throw Error('Reader font scale did not change '+width);
    await page.keyboard.press('Escape');
    if(await panel.count()||(await settings.getAttribute('aria-expanded'))!=='false')
      throw Error('Escape did not close settings '+width);
    const focusReturned=await settings.evaluate(el=>document.activeElement===el);
    if(!focusReturned)throw Error('Escape did not return focus '+width);
    const method=page.locator('section[aria-labelledby="gb-methodology-title"]');
    if(await method.count()!==1)throw Error('Research methodology is missing '+width);
    await method.locator('summary').click();
    if(!(await method.locator('details').evaluate(el=>el.hasAttribute('open'))))
      throw Error('Method disclosure not expandable '+width);
    const finalLayout=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth
    }));
    if(finalLayout.scroll>finalLayout.viewport+1||errors.length||requests.length)
      throw Error('Reader preferences regression '+JSON.stringify({width,finalLayout,errors,requests}));
    results.push({name,width,painted,cssLoaded:true,readerPrefs:true,methodDisclosure:true});
   }else{
    await page.locator('canvas').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const painted=await countPixels(page,'canvas');
    if(!(painted>0))throw Error('Constellation static starfield blank '+width);
    results.push({name,width,painted,cssLoaded:true});
   }
   await ctx.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
 console.log(JSON.stringify({engine,status:'PASS',scenarios:results.length,results},null,2));
})().catch(e=>{console.error(e.stack);server.close();process.exitCode=1});
