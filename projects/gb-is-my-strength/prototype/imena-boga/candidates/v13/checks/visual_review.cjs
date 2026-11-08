#!/usr/bin/env node
// Read-only visual acceptance evidence from the tested Vite dist outputs.
// No deployment, no public URL, no credentials or user profile.
const {chromium,webkit}=require('playwright-core');
const fs=require('node:fs');
const path=require('node:path');
const {createServer}=require('node:http');
const root=path.resolve(__dirname,'..');
const out=path.resolve(process.env.VISUAL_OUT||path.join(__dirname,'visual-evidence'));
fs.mkdirSync(out,{recursive:true});
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
'.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
'.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
const server=createServer((req,res)=>{
 try{
  const match=/^\/(atlas|sozvezdie)\/(.*)$/.exec(new URL(req.url,'http://127.0.0.1').pathname);
  if(!match){res.writeHead(404).end();return}
  const base=path.resolve(root,match[1],'dist');
  const file=path.resolve(base,decodeURIComponent(match[2]||'index.html'));
  if(file!==path.join(base,'index.html')&&!file.startsWith(base+path.sep)){res.writeHead(403).end();return}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
  res.writeHead(200,{'content-type':MIME[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(500).end('Server error')}
});
const findings=[],shots=[],checks=[];
const record=(name,data)=>checks.push({name,...data});
const problem=(level,name,info)=>findings.push({level,name,...info});
async function shot(page,label){
 const file=label+'.jpg';
 await page.screenshot({path:path.join(out,file),type:'jpeg',quality:84,animations:'disabled',timeout:25000});
 shots.push({file,label,url:page.url(),scrollY:await page.evaluate(()=>Math.round(scrollY))});
}
async function waitVisual(page){
 await page.locator('h1').first().waitFor({state:'visible',timeout:20000});
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(resolve))});
}
async function diag(page,app,engine,width,stage){
 const d=await page.evaluate(()=>{
  const ww=document.documentElement.clientWidth;
  const elements=[...document.querySelectorAll('button,a,input,[role="button"],[role="tab"]')];
  const targets=elements.map(el=>{
   const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
   const visible=r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none';
   return {text:(el.getAttribute('aria-label')||el.getAttribute('title')||el.textContent||'').trim().slice(0,64),
     tag:el.tagName,width:Math.round(r.width),height:Math.round(r.height),x:Math.round(r.x),y:Math.round(r.y),visible,
     tiny:visible&&(r.width<24||r.height<24)};
  });
  const overflow=[...document.body.querySelectorAll('*')].map(el=>{
   const r=el.getBoundingClientRect();return {tag:el.tagName,cls:String(el.className).slice(0,80),
   left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)}
  }).filter(el=>el.width>0&&(el.right>ww+2||el.left< -2)).sort((a,b)=>b.right-a.right).slice(0,15);
  return {viewport:ww,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,
  documentHeight:document.documentElement.scrollHeight,targets:targets.length,
  tinyTargets:targets.filter(el=>el.tiny&&el.y>=0&&el.y<innerHeight).slice(0,16),overflow};
 });
 record('geometry',{app,engine,width,stage,...d});
 if(d.documentWidth>d.viewport+1)problem('HIGH','horizontal-page-overflow',{app,engine,width,stage,details:d.overflow});
 if(d.tinyTargets.length)problem('REVIEW','small-visible-touch-targets',{app,engine,width,stage,targets:d.tinyTargets});
}
async function safeAction(page,label,action){
 try{await action();record('interaction',{label,status:'PASS'});}
 catch(e){problem('HIGH','interaction-failed',{label,error:String(e).slice(0,480)});record('interaction',{label,status:'FAIL'});}
}
async function visit(browser,engine,app,width,base){
 const ctx=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1,
  isMobile:width<768,hasTouch:width<768,locale:'ru-RU',reducedMotion:'reduce'});
 const page=await ctx.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push(r.status()+' '+r.url())});
 try{
  await page.goto(base+'/'+app+'/',{waitUntil:'domcontentloaded',timeout:30000});
  await waitVisual(page);
  await diag(page,app,engine,width,'hero');
  await shot(page,engine+'-'+app+'-'+width+'-01-hero');
  const checkpoint=app==='atlas'
    ?page.locator('section[aria-label="Коротко о главном"]')
    :page.locator('#sozvezdie');
  if(await checkpoint.count()){
   await checkpoint.first().scrollIntoViewIfNeeded();
   await page.waitForTimeout(130);
   await diag(page,app,engine,width,'overview');
   await shot(page,engine+'-'+app+'-'+width+'-02-overview');
  }
  if([320,390,768,1440].includes(width)){
   const section=app==='atlas'?page.locator('main').first():page.locator('#yhwh');
   if(await section.count()){
    await section.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(130);
    await shot(page,engine+'-'+app+'-'+width+'-03-reader');
   }
   if(app==='sozvezdie'&&await page.locator('#tetragrammaton').count()){
    await page.locator('#tetragrammaton').scrollIntoViewIfNeeded();
    await shot(page,engine+'-'+app+'-'+width+'-04-hebrew');
   }
   await page.evaluate(()=>window.scrollTo(0,Math.round((document.documentElement.scrollHeight-innerHeight)*.72)));
   await page.waitForTimeout(180);
   await shot(page,engine+'-'+app+'-'+width+'-05-deep');
  }
  if(width===390||width===1440){
   if(app==='atlas'){
    await safeAction(page,engine+'-atlas-'+width+'-summary',async()=>{
     const btn=page.locator('section[aria-label="Коротко о главном"] button[aria-controls="atlas-summary-theses"]');
     await btn.click();await shot(page,engine+'-atlas-'+width+'-06-summary-open');
    });
    await safeAction(page,engine+'-atlas-'+width+'-settings',async()=>{
     await page.getByRole('button',{name:'Настройки чтения и шрифта'}).click();
     await shot(page,engine+'-atlas-'+width+'-07-settings-open');
     await page.keyboard.press('Escape');
    });
    await safeAction(page,engine+'-atlas-'+width+'-search',async()=>{
     await page.getByRole('button',{name:'Открыть поиск по именам'}).click();
     await page.locator('#constellation-search-input').fill('Элохим');
     await shot(page,engine+'-atlas-'+width+'-08-search-results');
    });
    if(width===390)await safeAction(page,engine+'-atlas-mobile-drawer',async()=>{
     await page.getByRole('button',{name:'Открыть скрижали имён Бога'}).click();
     await page.getByRole('dialog',{name:'Скрижали имён Бога'}).waitFor({state:'visible'});
     await shot(page,engine+'-atlas-'+width+'-09-mobile-drawer');
     await page.getByRole('dialog',{name:'Скрижали имён Бога'}).locator('button').nth(2).click();
     await page.getByRole('dialog').waitFor({state:'visible'});
     await shot(page,engine+'-atlas-'+width+'-10-name-dialog');
     await page.keyboard.press('Escape');
    });
   }else{
    await safeAction(page,engine+'-sozvezdie-'+width+'-search',async()=>{
     const field=page.locator('#sozvezdie input[type="search"]');
     await field.fill('эхье');
     await shot(page,engine+'-sozvezdie-'+width+'-06-search');
     await field.fill('');
    });
    await safeAction(page,engine+'-sozvezdie-'+width+'-letter-tab',async()=>{
     await page.locator('#tetragrammaton [role="tab"]').nth(2).click();
     await shot(page,engine+'-sozvezdie-'+width+'-07-letter-detail');
    });
    if(width===390)await safeAction(page,engine+'-sozvezdie-'+width+'-mobile-index',async()=>{
     await page.locator('#yhwh').scrollIntoViewIfNeeded();
     await page.getByRole('button',{name:'Открыть список имён'}).click();
     await page.getByRole('dialog',{name:'Указатель имен Бога'}).waitFor({state:'visible'});
     await shot(page,engine+'-sozvezdie-'+width+'-08-mobile-index');
     await page.keyboard.press('Escape');
    });
   }
  }
  if(errors.length)problem('HIGH','runtime-errors',{app,engine,width,errors});
  if(failed.length)problem('HIGH','resource-errors',{app,engine,width,failed});
  record('session',{app,engine,width,status:'complete',errorCount:errors.length,resourceErrors:failed.length});
 }catch(e){
  problem('HIGH','session-failed',{app,engine,width,error:String(e).slice(0,600)});
  try{await shot(page,engine+'-'+app+'-'+width+'-ERROR')}catch{}
 }finally{await ctx.close()}
}
(async()=>{
 await new Promise((resolve,reject)=>server.listen(0,'127.0.0.1',resolve).on('error',reject));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  for(const [engine,widths] of [['chromium',[320,360,375,390,430,768,1024,1440]],['webkit',[320,390,768,1440]]]){
   const spec={chromium,webkit}[engine],options={headless:true};
   if(engine==='chromium'&&process.env.CHROMIUM_PATH)options.executablePath=process.env.CHROMIUM_PATH;
   const browser=await spec.launch(options);
   try{for(const app of ['atlas','sozvezdie'])for(const width of widths)
    await visit(browser,engine,app,width,base);
   }finally{await browser.close()}
  }
 }finally{
  fs.writeFileSync(path.join(out,'visual-report.json'),JSON.stringify({
   head:process.env.GITHUB_SHA||'local',generatedAt:new Date().toISOString(),
   shots,checks,findings},null,2));
  server.close();
 }
 console.log(JSON.stringify({status:'EVIDENCE_CAPTURED',shots:shots.length,
   sessions:checks.filter(c=>c.name==='session').length,findings:findings.length,
   high:findings.filter(f=>f.level==='HIGH').length,output:out}));
})().catch(e=>{console.error(e.stack);process.exitCode=1;server.close()});
