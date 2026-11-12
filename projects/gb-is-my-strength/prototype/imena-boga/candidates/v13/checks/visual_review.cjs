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
// Capture only after the intended subject is inside the viewport.
async function anchorShot(page,label,selector,top=112){
 const loc=page.locator(selector).first();
 await loc.waitFor({state:'visible',timeout:10000});
 // WebKit may apply asynchronous scroll anchoring after 200% font reflow.
 // Re-measure the same DOM element over two settled frames rather than
 // capturing a different paragraph or weakening the viewport contract.
 let pos;
 let stable=0;
 for(let attempt=1;attempt<=6;attempt++){
  await loc.evaluate((el,offset)=>{
   const rect=el.getBoundingClientRect();
   window.scrollTo({top:Math.max(0,window.scrollY+rect.top-offset),behavior:'instant'});
  },top);
  await page.evaluate(async()=>{
   await document.fonts.ready;
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  pos=await loc.evaluate(el=>{
   const r=el.getBoundingClientRect();
   return {top:r.top,bottom:r.bottom,width:r.width,viewportHeight:innerHeight,
    scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};
  });
  record('screenshot-anchor-settle',{label,selector,attempt,actualTop:pos.top,targetTop:top});
  stable=Math.abs(pos.top-top)<=2?stable+1:0;
  if(stable>=2)break;
 }
 record('screenshot-anchor',{label,selector,...pos});
 if(Math.abs(pos.top-top)>3||pos.width<1||pos.scrollWidth>pos.clientWidth+2){
  problem('BLOCKER','screenshot-anchor-invalid',{label,selector,...pos});
  // Capture painted pixels before failing, without waiving the geometry requirement.
  try { await shot(page,label+'-INVALID'); } catch(e) {
   record('screenshot-anchor-invalid-capture-failed',{label,error:String(e).slice(0,300)});
  }
  throw Error('Bad screenshot anchor: '+label);
 }
 await shot(page,label);
 if(pos.bottom>pos.viewportHeight){
  // A 200%-resized heading may be taller than one viewport. The first
  // capture proves its top, and this second capture proves its final lines.
  await loc.evaluate(el=>{
   const r=el.getBoundingClientRect();
   window.scrollTo({top:Math.max(0,window.scrollY+r.bottom-(innerHeight-80)),behavior:'instant'});
  });
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const tail=await loc.evaluate(el=>{
   const r=el.getBoundingClientRect();
   return {top:r.top,bottom:r.bottom,width:r.width,viewportHeight:innerHeight,
    scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};
  });
  record('screenshot-anchor-tail',{label,selector,...tail});
  if(Math.abs(tail.bottom-(tail.viewportHeight-80))>3||
     tail.top>=tail.viewportHeight||tail.width<1||
     tail.scrollWidth>tail.clientWidth+2){
   problem('BLOCKER','screenshot-anchor-tail-invalid',{label,selector,...tail});
   throw Error('Bad screenshot anchor tail: '+label);
  }
  await shot(page,label+'-tail');
 }
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
   // A 1x1 off-screen sr-only skip link is keyboard-accessible but is not
   // a visually exposed touch target. Its intersection begins only on focus.
   const onscreen=r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;
   const visible=onscreen&&r.width>0&&r.height>0&&
    cs.visibility!=='hidden'&&cs.display!=='none';
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

/**
 * Hard visual geometry gate: checks every Atlas card (not only the document),
 * the overlapping-rail breakpoint and readable Constellation catalog text.
 */
async function layoutContract(page,app,engine,width){
 const data=await page.evaluate(({name,width})=>{
  const faults=[];
  const fault=(kind,info)=>faults.push({kind,info});
  if(name==='atlas'){
   const sectionLinks=[...document.querySelectorAll('[data-atlas-section-link]')];
   // The links are inside a parent hidden below xl. CSS display on the
   // child is still "inline-flex"; inspect rendered geometry so hidden
   // descendants aren't mistaken for 0x0 touch targets.
   const visibleLinks=sectionLinks.filter(el=>{
    const rect=el.getBoundingClientRect();
    const css=getComputedStyle(el);
    return rect.width>0&&rect.height>0&&css.visibility!=='hidden';
   });
   if(width>=1280&&visibleLinks.length!==5)
    fault('atlas-section-links-missing',{count:visibleLinks.length});
   visibleLinks.forEach((el,i)=>{
    const rect=el.getBoundingClientRect();
    if(rect.height<36||rect.width<36)
     fault('atlas-section-link-small-hitbox',{index:i+1,width:rect.width,height:rect.height});
   });
   const sidebars=[...document.querySelectorAll('aside[aria-label*="скрижаль"]')];
   const visible=sidebars.filter(node=>getComputedStyle(node).display!=='none');
   if(sidebars.length!==2)fault('atlas-rail-count',{count:sidebars.length});
   if(width<1440&&visible.length)fault('atlas-rail-overlaps-reader',{count:visible.length});
   if(width>=1440&&visible.length!==2)fault('atlas-rail-vanished',{count:visible.length});
   const articles=[...document.querySelectorAll('article[data-name-id]')];
   if(articles.length!==36)fault('atlas-article-count',{count:articles.length});
   articles.forEach((article,i)=>{
    const group=article.querySelector('[data-name-display]');
    const title=article.querySelector('[data-name-primary-title]');
    const original=article.querySelector('[data-name-original]');
    if(!group||!title||!original){fault('atlas-card-witness-missing',{index:i+1});return;}
    const box=group.getBoundingClientRect(), tr=title.getBoundingClientRect(), or=original.getBoundingClientRect();
    if(tr.width<Math.min(150,box.width-4))
     fault('atlas-card-title-collapsed',{index:i+1,titleWidth:tr.width,available:box.width});
    if(title.scrollWidth>title.clientWidth+2)
     fault('atlas-card-title-overflow',{index:i+1,scroll:title.scrollWidth,client:title.clientWidth});
    if(original.scrollWidth>original.clientWidth+2 || or.left<box.left-2 || or.right>box.right+2)
     fault('atlas-card-original-overflow',{index:i+1,scroll:original.scrollWidth,
      client:original.clientWidth,left:or.left,right:or.right,groupLeft:box.left,groupRight:box.right});
   });
   const hero=document.querySelector('h1')?.getBoundingClientRect();
   if(hero)visible.forEach((sidebar,i)=>{
    const r=sidebar.getBoundingClientRect();
    if(hero.left<r.right&&hero.right>r.left&&hero.top<r.bottom&&hero.bottom>r.top)
     fault('atlas-hero-behind-rail',{side:i,hero:[hero.left,hero.right],sidebar:[r.left,r.right]});
   });
  }else{
   const labels=[...document.querySelectorAll('[data-name-translit]')];
   if(labels.length!==29)fault('sozvezdie-index-count',{count:labels.length});
   labels.forEach((el,i)=>{
    const px=parseFloat(getComputedStyle(el).fontSize);
    if(px<11.5)fault('sozvezdie-small-transliteration',{index:i+1,px});
    if(el.scrollWidth>el.clientWidth+2)
     fault('sozvezdie-transliteration-clipped',{index:i+1,scroll:el.scrollWidth,client:el.clientWidth});
   });
  }
  return {faults};
 },{name:app,width});
 record('layout-contract',{app,engine,width,faultCount:data.faults.length});
 data.faults.forEach(f=>problem('BLOCKER',f.kind,{app,engine,width,info:f.info}));
}

async function safeAction(page,label,action){
 try{await action();record('interaction',{label,status:'PASS'});}
 catch(e){problem('HIGH','interaction-failed',{label,error:String(e).slice(0,480)});record('interaction',{label,status:'FAIL'});}
}

// Automated WCAG A/AA audits supplement physical keyboard/AT review.
// Atlas tests its persisted reader theme instead of repainting CSS by hand.
async function wcagAudit(page,app,engine,width){
 if(![390,1440].includes(width))return;
 const storageKey='gb:imena:atlas:reader-preferences:v1';
 const themes=app==='atlas'?['light','sepia','dark']:['default'];
 for(const theme of themes){
  if(app==='atlas'&&theme!=='light'){
   await page.evaluate(({key,value})=>
    localStorage.setItem(key,JSON.stringify({theme:value})),
    {key:storageKey,value:theme});
   await page.reload({waitUntil:'domcontentloaded',timeout:30000});
   await waitVisual(page);
  }
  const themeState=await page.evaluate(()=>{
   const html=document.documentElement;
   const computed=getComputedStyle(html);
   return {attribute:html.getAttribute('data-reader-theme'),
    inkSecondary:computed.getPropertyValue('--gb-ink-secondary').trim(),
    surface:computed.getPropertyValue('--gb-surface').trim()};
  });
  record('axe-theme-state',{app,engine,width,theme,...themeState});
  if(app==='atlas'&&themeState.attribute!==theme)
   problem('HIGH','axe-theme-state-mismatch',{app,engine,width,theme,...themeState});
  // WCAG measures painted pixels and colors. Let WebKit commit two frames
  // after the persisted theme's React/CSS update before inspecting contrast.
  // This does not waive any violation; it avoids auditing a transient repaint.
  await page.evaluate(async()=>{
   await document.fonts.ready;
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const violations=await page.evaluate(async()=>{
   const r=await window.axe.run(document,{
    runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']},
    resultTypes:['violations']
   });
   return r.violations.map(v=>({
    id:v.id,impact:v.impact,count:v.nodes.length,
    examples:v.nodes.slice(0,4).map(n=>({
     selector:n.target,summary:(n.failureSummary||'').slice(0,180)
    }))
   }));
  });
  record('axe-wcag-a-aa',{app,engine,width,theme,rules:violations.length,
   nodes:violations.reduce((sum,v)=>sum+v.count,0),
   status:violations.length?'FAIL':'PASS'});
  violations.forEach(v=>problem('HIGH','axe-'+v.id,{app,engine,width,theme,...v}));
  if(app==='atlas'){
   // Explicit same-anchor snapshots of all three real reader themes.
   // axe passing by itself does not prove the intended visual composition.
   await safeAction(page,engine+'-atlas-'+width+'-theme-'+theme,async()=>{
    await anchorShot(page,engine+'-atlas-'+width+'-theme-'+theme+'-reader',
     '#article-introduction h2',112);
   });
  }
 }
 if(app==='atlas'){
  await page.evaluate(k=>localStorage.removeItem(k),storageKey);
  await page.reload({waitUntil:'domcontentloaded',timeout:30000});
  await waitVisual(page);
 }
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
  await wcagAudit(page,app,engine,width);
  await layoutContract(page,app,engine,width);
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
   if(app==='sozvezdie'){
    // Anchor to the SAME semantic heading in both engines. A percentage of
    // total document height is not a comparable cross-browser screenshot.
    const deepAnchor=page.locator('#adonai');
    await deepAnchor.waitFor({state:'visible',timeout:10000});
    await deepAnchor.evaluate(el=>{
      window.scrollTo({top:Math.max(0,window.scrollY+el.getBoundingClientRect().top-150),behavior:'instant'});
    });
    await page.evaluate(async()=>{
      await document.fonts.ready;
      await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)));
    });
    const nameTop=await deepAnchor.evaluate(el=>el.getBoundingClientRect().top);
    record('semantic-deep-anchor',{engine,width,name:'adonai',top:nameTop});
    if(Math.abs(nameTop-150)>5)
      problem('BLOCKER','semantic-deep-anchor-mismatch',{engine,width,top:nameTop});
   }else{
    await page.evaluate(()=>window.scrollTo({top:Math.round((document.documentElement.scrollHeight-innerHeight)*.72),behavior:'instant'}));
    await page.waitForTimeout(180);
   }
   if(app==='sozvezdie'){
    if(width<1280){
     const controls=await page.evaluate(()=>{
      const index=document.querySelector('#sozvezdie-mobile-index-trigger');
      const dock=document.querySelector('[data-reader-dock]');
      const header=document.querySelector('header');
      return {indexParent:index?.parentElement?.id,dockParent:dock?.parentElement?.id,
       indexBottom:index?.getBoundingClientRect().bottom,
       dockBottom:dock?.getBoundingClientRect().bottom,
       headerBottom:header?.getBoundingClientRect().bottom,
       dockPosition:dock?getComputedStyle(dock).position:null};
     });
     record('mobile-reader-controls-outside-prose',{engine,width,...controls});
     if(controls.indexParent!=='sozvezdie-header-index-slot'||
        controls.dockParent!=='sozvezdie-header-reader-slot'||
        controls.dockPosition==='fixed'||controls.indexBottom>controls.headerBottom+2||
        controls.dockBottom>controls.headerBottom+2)
      problem('BLOCKER','mobile-controls-cover-prose',{engine,width,controls});
    }
    await page.waitForFunction(()=>{
     const label=document.querySelector('[data-reader-dock] button[aria-label^="Прочитано"]')?.getAttribute('aria-label');
     const pct=Number(label?.match(/Прочитано (\d+)%/)?.[1]);
     const max=document.documentElement.scrollHeight-innerHeight;
     const expected=max>0?Math.round(100*scrollY/max):0;
     return Number.isFinite(pct)&&Math.abs(pct-expected)<=2;
    },null,{timeout:5000});
    const witness=await page.evaluate(()=>{
     const label=document.querySelector('[data-reader-dock] button[aria-label^="Прочитано"]')?.getAttribute('aria-label');
     const shown=Number(label?.match(/Прочитано (\d+)%/)?.[1]);
     const max=document.documentElement.scrollHeight-innerHeight;
     return {shown,expected:max>0?Math.round(100*scrollY/max):0,scrollY:Math.round(scrollY),maxScroll:max};
    });
    record('reader-progress-exact',{engine,width,...witness});
   }
   await shot(page,engine+'-'+app+'-'+width+'-05-deep');
  }
  if(width===320&&app==='atlas'){
   await safeAction(page,engine+'-atlas-'+width+'-search',async()=>{
    await page.getByRole('button',{name:'Открыть поиск по именам'}).click();
    await page.locator('#constellation-search-input').fill('Элохим');
    const hit=page.locator('[data-constellation-result]').first();
    const top=await hit.evaluate(el=>el.getBoundingClientRect().top);
    record('atlas-search-result-in-frame',{engine,width,resultTop:top});
    if(top<0||top>700)
     problem('BLOCKER','atlas-search-results-too-low',{engine,width,resultTop:top});
    await shot(page,engine+'-atlas-'+width+'-08-search-results');
   });
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
     if(width===390){
       const filters=page.getByRole('button',{name:/^Фильтры/});
       if((await filters.getAttribute('aria-expanded'))!=='false')
        problem('BLOCKER','atlas-mobile-filters-not-collapsed',{engine,width});
       const resultTop=await page.locator('[data-constellation-result]').first()
        .evaluate(el=>el.getBoundingClientRect().top);
       record('atlas-search-result-in-frame',{engine,width,resultTop});
       if(resultTop<0||resultTop>700)
        problem('BLOCKER','atlas-search-results-too-low',{engine,width,resultTop});
      }
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
     const results=page.locator('#sozvezdie button[aria-label^="Перейти к разделу:"]');
     await results.first().waitFor({state:'visible',timeout:10000});
     const query=await field.inputValue(),count=await results.count();
     record('search-evidence',{engine,width,query,count});
     if(query!=='эхье'||count<1)throw Error('Search results absent from evidence');
     await anchorShot(page,engine+'-sozvezdie-'+width+'-06-search',
      '#sozvezdie input[type="search"]',145);
     const resultTop=await results.first().evaluate(el=>el.getBoundingClientRect().top);
     record('search-result-in-frame',{engine,width,resultTop});
     if(resultTop>844||resultTop<0)
      problem('BLOCKER','search-results-outside-frame',{engine,width,resultTop});
     await field.fill('');
    });
    await safeAction(page,engine+'-sozvezdie-'+width+'-letter-tab',async()=>{
     const vavTab=page.locator('#tetragrammaton [role="tab"]').nth(2);
     await vavTab.click();
     // Animate tab state and exit text independently, so wait for the actual
     // visible letter panel to agree before capturing the comparison.
     await page.waitForFunction(()=>{
       const tab=document.querySelector('#tetragrammaton [role="tab"][aria-selected="true"]');
       const panel=document.querySelector('#letter-panel');
       return tab?.textContent?.includes('Вав') && panel?.textContent?.includes('Вав')
         && !panel?.textContent?.includes('Йод');
     },null,{timeout:5000});
     await shot(page,engine+'-sozvezdie-'+width+'-07-letter-detail');
    });
    if(width===390||width===320)await safeAction(page,engine+'-sozvezdie-'+width+'-mobile-index',async()=>{
     await page.locator('#yhwh').scrollIntoViewIfNeeded();
     await page.getByRole('button',{name:'Открыть список имён'}).click();
     const dialog=page.getByRole('dialog',{name:'Указатель библейских выражений'});
     await dialog.waitFor({state:'visible'});
     await page.waitForFunction(()=>{
       const el=document.querySelector('[data-mobile-index-dialog]');
       return !!el&&Number(getComputedStyle(el).opacity)>=0.99;
     },null,{timeout:5000});
     const surface=await dialog.evaluate(el=>({color:getComputedStyle(el).backgroundColor,
       filter:getComputedStyle(el).backdropFilter}));
     record('mobile-index-opaque-surface',{engine,width,...surface});
     if(!/^rgb\(/.test(surface.color)||surface.filter!=='none')
       problem('BLOCKER','mobile-index-translucent',{engine,width,surface});
     await shot(page,engine+'-sozvezdie-'+width+'-08-mobile-index');
     await page.keyboard.press('Escape');
    });
   }
  }

  if(app==='atlas' && [320,390,768,1440].includes(width)){
   // Capture the historical schematic itself in both engines. Unlike the
   // old percentage-scroll images, this is an exact semantic anchor.
   await safeAction(page,engine+'-atlas-'+width+'-map-stage',async()=>{
     const actual=await page.evaluate(()=>{
       const root=document.querySelector('#covenant-altars-atlas');
       const pins=[...root.querySelectorAll('[data-covenant-map-pin]')];
       const waypoints=[...root.querySelectorAll('[data-covenant-waypoint]')];
       const labels=[...root.querySelectorAll('[data-covenant-pin-label]')];
       const nav=[...root.querySelectorAll('[data-covenant-map-nav]')];
       const actions=[...root.querySelectorAll('[data-covenant-card-actions] button')];
        const badge=root.querySelector('[data-covenant-mobile-selection]');
        const sea=root.querySelector('[data-covenant-sea-watermark]');
        const stage=root.querySelector('[data-covenant-map-stage]').getBoundingClientRect();
        const badgeRect=badge?.getBoundingClientRect();
        const seaRect=sea?.getBoundingClientRect();
        const badgeVisible=!!badge&&getComputedStyle(badge).display!=='none';
        const original=root.querySelector('[data-covenant-linked-original]')?.getBoundingClientRect();
        const russian=root.querySelector('[data-covenant-linked-russian]')?.getBoundingClientRect();
        const card=root.querySelector('[data-covenant-linked-expression]')?.getBoundingClientRect();
        const badgeOverlapsSea=badgeVisible&&seaRect&&badgeRect&&
          Math.min(badgeRect.right,seaRect.right)-Math.max(badgeRect.left,seaRect.left)>1&&
          Math.min(badgeRect.bottom,seaRect.bottom)-Math.max(badgeRect.top,seaRect.top)>1;
       const visibleRects=labels.filter(el=>getComputedStyle(el).display!=='none')
         .map(el=>el.getBoundingClientRect());
       const overlaps=[];
       for(let a=0;a<visibleRects.length;a++)for(let b=a+1;b<visibleRects.length;b++){
         const first=visibleRects[a],second=visibleRects[b];
         const intersectionW=Math.min(first.right,second.right)-Math.max(first.left,second.left);
         const intersectionH=Math.min(first.bottom,second.bottom)-Math.max(first.top,second.top);
         if(intersectionW>1&&intersectionH>1)overlaps.push([a,b,Math.round(intersectionW),Math.round(intersectionH)]);
       }
       return {labelOverlaps:overlaps,navCount:nav.length,
         navMinHeight:Math.min(...nav.map(el=>el.getBoundingClientRect().height)),
         actionCount:actions.length,
         actionMinHeight:Math.min(...actions.map(el=>el.getBoundingClientRect().height)),
         actionTextFits:actions.every(el=>el.scrollWidth<=el.clientWidth+2),
         actionNoWrap:actions.every(el=>getComputedStyle(el).whiteSpace==='nowrap'),
         pins:pins.length,waypoints:waypoints.length,labels:labels.length,
         selectedPins:pins.filter(el=>el.getAttribute('aria-pressed')==='true').length,
         selectedWaypoints:waypoints.filter(el=>el.getAttribute('aria-pressed')==='true').length,
         pinMinHeight:Math.min(...pins.map(el=>el.getBoundingClientRect().height)),
         waypointMinHeight:Math.min(...waypoints.map(el=>el.getBoundingClientRect().height)),
         visibleLabels:labels.filter(el=>getComputedStyle(el).display!=='none').length,
         labelsAccessible:pins.every(el=>!!el.getAttribute('aria-label')),
          badgeVisible,badgeText:badge?.textContent?.trim()||'',
          badgeOutsideStage:!!badgeRect&&badgeRect.bottom<=stage.top-1&&
            badgeRect.left>=root.getBoundingClientRect().left-1&&
            badgeRect.right<=root.getBoundingClientRect().right+1,
          badgeOverlapsSea:!!badgeOverlapsSea,
          bilingualStackFits:!!original&&!!russian&&!!card&&
            original.top>=russian.bottom-2&&original.left>=card.left-1&&original.right<=card.right+1};
     });
     record('atlas-nine-place-controls',{engine,width,...actual});
     if(actual.pins!==9||actual.waypoints!==9||actual.labels!==9||
        actual.selectedPins!==1||actual.selectedWaypoints!==1||
        actual.pinMinHeight<35||actual.waypointMinHeight<43||
        actual.navCount!==2||actual.navMinHeight<43||
        actual.actionCount!==2||actual.actionMinHeight<43||
        !actual.actionTextFits||!actual.actionNoWrap||actual.labelOverlaps.length>0||
        !actual.labelsAccessible||!actual.bilingualStackFits||
        (width<640&&(!actual.badgeVisible||!actual.badgeOutsideStage||
          actual.badgeOverlapsSea||!actual.badgeText.includes('Гора Мориа')))||
        (width>=640&&actual.badgeVisible)||
        (width<640&&actual.visibleLabels!==0)||
        (width>=640&&width<1280&&actual.visibleLabels!==1)||
        (width>=1280&&actual.visibleLabels!==9))
       problem('BLOCKER','atlas-nine-place-controls-failed',{engine,width,...actual});
     await anchorShot(page,engine+'-atlas-'+width+'-11-map-stage',
       '[data-covenant-map-stage]',145);
     if(width===390||width===1440)await anchorShot(page,
       engine+'-atlas-'+width+'-12-map-actions','[data-covenant-card-actions]',300);
     // Exercise all nine small-screen selected captions above the map,
     // sea watermark and the same pin/waypoint state as the wide map.
     if(width===320||width===390)for(let activeIndex=0;activeIndex<9;activeIndex++){
       await page.locator('[data-covenant-waypoint]').nth(activeIndex).click();
       const m=await page.evaluate(expected=>{
         const root=document.querySelector('#covenant-altars-atlas');
         const badge=root.querySelector('[data-covenant-mobile-selection]');
         const sea=root.querySelector('[data-covenant-sea-watermark]');
         const stage=root.querySelector('[data-covenant-map-stage]').getBoundingClientRect();
         const a=badge.getBoundingClientRect(),b=sea.getBoundingClientRect();
         const wp=[...root.querySelectorAll('[data-covenant-waypoint]')];
         const pins=[...root.querySelectorAll('[data-covenant-map-pin]')];
         const raw=(wp[expected]?.textContent||'').trim();
         const expectedName=raw.slice(raw.indexOf('.')+1).trim();
         return {expected,expectedName,caption:badge.textContent?.trim()||'',
           visible:getComputedStyle(badge).display!=='none',
           aboveMap:a.bottom<=stage.top-1&&
             a.left>=root.getBoundingClientRect().left-1&&
             a.right<=root.getBoundingClientRect().right+1,
           seaOverlap:Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&
             Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1,
           visibleLabels:[...root.querySelectorAll('[data-covenant-pin-label]')].filter(el=>getComputedStyle(el).display!=='none').length,
           selectedPins:pins.flatMap((el,i)=>el.getAttribute('aria-pressed')==='true'?[i]:[]),
           selectedWaypoints:wp.flatMap((el,i)=>el.getAttribute('aria-pressed')==='true'?[i]:[])};
       },activeIndex);
       record('atlas-mobile-map-selected-caption',{engine,width,...m});
       if(!m.visible||!m.aboveMap||m.seaOverlap||m.visibleLabels!==0||
          !m.caption.includes(m.expectedName)||
          !m.caption.includes('Место '+(activeIndex+1)+' из 9')||
          m.selectedPins.length!==1||m.selectedWaypoints.length!==1||
          m.selectedPins[0]!==activeIndex||m.selectedWaypoints[0]!==activeIndex)
         problem('BLOCKER','atlas-mobile-caption-selection-failed',{engine,width,...m});
       if(width===390&&activeIndex===1)await anchorShot(page,
         engine+'-atlas-'+width+'-14-beersheba-mobile',
         '[data-covenant-map-stage]',145);
     }
     // Reduce-motion is not proven by screenshots alone: explicitly compare
     // the live selected-halo animation under both OS preference values.
     // Keyboard testing verifies native Enter/Space activation of the map,
     // selected state and mobile status-announcement separation.
     if(width===390){
       const halo=page.locator('[data-covenant-selected-halo]');
       await page.emulateMedia({reducedMotion:'no-preference'});
       const normal=await halo.evaluate(el=>({
         name:getComputedStyle(el).animationName,
         duration:getComputedStyle(el).animationDuration,
         iterations:getComputedStyle(el).animationIterationCount
       }));
       await page.emulateMedia({reducedMotion:'reduce'});
       const reduced=await halo.evaluate(el=>({
         name:getComputedStyle(el).animationName,
         duration:getComputedStyle(el).animationDuration
       }));
       record('atlas-reduced-motion-halo',{engine,width,normal,reduced});
       if(normal.name==='none'||normal.iterations!=='infinite'||reduced.name!=='none')
         problem('BLOCKER','atlas-reduced-motion-halo-failed',{engine,width,normal,reduced});
       await page.locator('[data-covenant-map-pin]').nth(1).focus();
       await page.keyboard.press('Enter');
       const byPin=await page.evaluate(()=>{
         const root=document.querySelector('#covenant-altars-atlas');
         const pins=[...root.querySelectorAll('[data-covenant-map-pin]')];
         const waypoints=[...root.querySelectorAll('[data-covenant-waypoint]')];
         const status=root.querySelector('[data-covenant-mobile-selection]');
         return {pin:pins.findIndex(x=>x.getAttribute('aria-pressed')==='true'),
           waypoint:waypoints.findIndex(x=>x.getAttribute('aria-pressed')==='true'),
           focusOnPin:document.activeElement===pins[1],text:status?.textContent||'',
           role:status?.getAttribute('role'),live:status?.getAttribute('aria-live')};
       });
       await page.locator('[data-covenant-map-nav]').nth(1).focus();
       await page.keyboard.press('Space');
       const byNext=await page.evaluate(()=>{
         const root=document.querySelector('#covenant-altars-atlas');
         const pins=[...root.querySelectorAll('[data-covenant-map-pin]')];
         const waypoints=[...root.querySelectorAll('[data-covenant-waypoint]')];
         const next=[...root.querySelectorAll('[data-covenant-map-nav]')][1];
         const status=root.querySelector('[data-covenant-mobile-selection]');
         return {pin:pins.findIndex(x=>x.getAttribute('aria-pressed')==='true'),
           waypoint:waypoints.findIndex(x=>x.getAttribute('aria-pressed')==='true'),
           focusOnNext:document.activeElement===next,text:status?.textContent||''};
       });
       record('atlas-keyboard-map-and-live-status',{engine,width,byPin,byNext});
       if(byPin.pin!==1||byPin.waypoint!==1||!byPin.focusOnPin||
          byPin.role!=='status'||byPin.live!=='polite'||
          !byPin.text.includes('Место 2 из 9. Вирсавия')||
          byNext.pin!==2||byNext.waypoint!==2||!byNext.focusOnNext||
          !byNext.text.includes('Место 3 из 9. Гора Мориа'))
         problem('BLOCKER','atlas-keyboard-live-status-failed',{engine,width,byPin,byNext});
     }
     // Exercise all nine selected states at the wide breakpoint. An
     // initially clean map can still collide once a different label becomes
     // active. Geometry is measured after the state update, never guessed
     // from schematic coordinates.
     if(width===1440)for(let activeIndex=0;activeIndex<9;activeIndex++){
       await page.locator('[data-covenant-waypoint]').nth(activeIndex).click();
       const state=await page.evaluate(expected=>{
         const root=document.querySelector('#covenant-altars-atlas');
         const pins=[...root.querySelectorAll('[data-covenant-map-pin]')];
         const waypoints=[...root.querySelectorAll('[data-covenant-waypoint]')];
         const labels=[...root.querySelectorAll('[data-covenant-pin-label]')]
           .filter(el=>getComputedStyle(el).display!=='none')
           .map(el=>el.getBoundingClientRect());
         const overlaps=[];
         for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
           const x=Math.min(labels[i].right,labels[j].right)-Math.max(labels[i].left,labels[j].left);
           const y=Math.min(labels[i].bottom,labels[j].bottom)-Math.max(labels[i].top,labels[j].top);
           if(x>1&&y>1)overlaps.push([i,j,Math.round(x),Math.round(y)]);
         }
         return {expected,overlaps,selectedPins:pins.flatMap((el,i)=>el.getAttribute('aria-pressed')==='true'?[i]:[]),
           selectedWaypoints:waypoints.flatMap((el,i)=>el.getAttribute('aria-pressed')==='true'?[i]:[])};
       },activeIndex);
       record('atlas-wide-map-each-selection',{engine,width,...state});
       if(state.overlaps.length||state.selectedPins.length!==1||
          state.selectedWaypoints.length!==1||
          state.selectedPins[0]!==activeIndex||state.selectedWaypoints[0]!==activeIndex)
         problem('BLOCKER','atlas-wide-map-selection-label-overlap',{engine,width,...state});
       if(activeIndex===1)await anchorShot(page,
         engine+'-atlas-'+width+'-14-beersheba-selected',
         '[data-covenant-map-stage]',145);
       if(activeIndex===7)await anchorShot(page,
         engine+'-atlas-'+width+'-13-rephidim-selected',
         '[data-covenant-map-stage]',145);
     }
     await page.locator('[data-covenant-waypoint]').first().click();
     const selected=await page.locator('[data-covenant-map-pin]').first().getAttribute('aria-pressed');
     if(selected!=='true')
       problem('BLOCKER','atlas-waypoint-selection-failed',{engine,width,selected});
   });
   // Historical bug V-02 was captured on a percentage-of-page screenshot
   // and the after image landed on a different name. Pin a reproducible,
   // exact record (ordinal 32) in both engines for visual before/after review.
   await safeAction(page,engine+'-atlas-'+width+'-exact-name32',async()=>{
    const card=page.locator('article[data-name-id]').nth(31);
    const titleNode=card.locator('[data-name-primary-title]');
    await titleNode.scrollIntoViewIfNeeded();
    await page.evaluate(async()=>{await document.fonts.ready});
    // A tall mobile article can be larger than the viewport: scrolling the
    // whole card centers its body, leaving the heading outside the JPG.
    // Anchor the evidence on the heading itself, below the fixed navbar.
    await titleNode.evaluate(el=>{
      const headingTop=window.scrollY+el.getBoundingClientRect().top;
      window.scrollTo({top:Math.max(0,headingTop-110),behavior:'instant'});
    });
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    const title=await titleNode.evaluate(el=>({
      value:el.textContent?.trim(),width:el.getBoundingClientRect().width,
      scroll:el.scrollWidth,client:el.clientWidth
    }));
    record('atlas-exact-name32',{engine,width,...title});
    if(title.width<150||title.scroll>title.client+2)
      problem('BLOCKER','atlas-exact-name32-title-collapse',{engine,width,details:title});
    await shot(page,engine+'-atlas-'+width+'-exact-name32');
   });
   await safeAction(page,engine+'-atlas-'+width+'-long-name',async()=>{
    const name=page.locator('article[data-name-id]').last();
    await name.locator('button[title="Нажмите, чтобы открыть полное досье"]').click();
    const original=page.locator('[data-modal-original]');
    await original.waitFor({state:'visible',timeout:10000});
    await page.evaluate(async()=>{await document.fonts.ready});
    const m=await original.evaluate(el=>({
     scroll:el.scrollWidth,client:el.clientWidth,right:el.getBoundingClientRect().right,
     parentRight:el.parentElement?.getBoundingClientRect().right
    }));
    record('atlas-last-modal',{engine,width,...m});
    if(m.scroll>m.client+2||m.right>(m.parentRight||0)+2)
     problem('BLOCKER','atlas-long-modal-original-overflow',{engine,width,measure:m});
    await shot(page,engine+'-atlas-'+width+'-last-modal');
    await page.keyboard.press('Escape');
    await original.waitFor({state:'hidden',timeout:8000});
    if(width<1440){
     // The floating launcher intentionally yields to nearby card actions.
     // After closing a dossier, return to a stable reading anchor.
     const intro=page.locator('#article-introduction');
     await intro.evaluate(el=>{
      const top=window.scrollY+el.getBoundingClientRect().top;
      window.scrollTo({top:Math.max(0,top-110),behavior:'instant'});
     });
     const launcher=page.getByRole('button',{name:'Открыть скрижали имён Бога'});
     await launcher.waitFor({state:'visible',timeout:8000});
     if(width<1440){
      const floatingVisible=await page.locator('[data-atlas-mobile-ribbon]').isVisible();
      const navVisible=await page.locator('#gb-mobile-atlas-nav-trigger').isVisible();
      record('atlas-mobile-header-trigger',{engine,width,floatingVisible,navVisible});
      if(floatingVisible||!navVisible)
       problem('BLOCKER','atlas-mobile-launcher-obscures-prose',{engine,width,floatingVisible,navVisible});
     }
     // Verify its real bounds do not overlap article actions.
     const overlappingCardActions=await launcher.evaluate(el=>{
      const ribbon=el.getBoundingClientRect();
      return [...document.querySelectorAll('[data-atlas-card-actions]')].filter(node=>{
       const card=node.getBoundingClientRect();
       return card.width>0 && card.height>0 &&
        ribbon.left<card.right && ribbon.right>card.left &&
        ribbon.top<card.bottom && ribbon.bottom>card.top;
      }).length;
     });
     record('atlas-launcher-clearance',{engine,width,overlappingCardActions});
     if(overlappingCardActions)
      problem('BLOCKER','atlas-launcher-overlaps-card-actions',{engine,width,overlappingCardActions});
     await launcher.click();
     const drawer=page.getByRole('dialog',{name:'Скрижали имён Бога'});
     await drawer.waitFor({state:'visible'});
     const names=await drawer.locator('[data-atlas-mobile-original]').evaluateAll(els=>els.map((el,i)=>({
      n:i+1,scroll:el.scrollWidth,client:el.clientWidth,
      right:el.getBoundingClientRect().right,parentRight:el.closest('button')?.getBoundingClientRect().right
     })));
     record('atlas-mobile-originals',{engine,width,count:names.length});
     if(names.length!==36)problem('BLOCKER','atlas-mobile-original-count',{engine,width,count:names.length});
     names.forEach(n=>{
      if(n.scroll>n.client+2||n.right>(n.parentRight||0)+2)
       problem('BLOCKER','atlas-mobile-original-clipped',{engine,width,measure:n});
     });
     await shot(page,engine+'-atlas-'+width+'-last-drawer');
     await page.keyboard.press('Escape');
    }
   });
  }
  if(app==='sozvezdie'&&width===768){
   await safeAction(page,engine+'-sozvezdie-tablet-dock',async()=>{
    await page.locator('#yhwh').scrollIntoViewIfNeeded();
    const dock=page.locator('[data-reader-dock]');
    await dock.waitFor({state:'visible',timeout:7500});
    const d=await dock.evaluate(el=>({
     flex:getComputedStyle(el).flexDirection,top:el.getBoundingClientRect().top,screen:innerHeight
    }));
    record('tablet-reader-dock',{engine,width,...d});
    if(d.flex!=='row'||d.top<0||d.top>85||
       (await dock.evaluate(el=>el.parentElement?.id))!=='sozvezdie-header-reader-slot')
     problem('BLOCKER','tablet-dock-not-in-header',{engine,width,measure:d});
    await shot(page,engine+'-sozvezdie-'+width+'-tablet-dock');
   });
  }

  // Wave61: root-font scaling reflow on both candidates (not native UI zoom).
  if([320,390].includes(width))await safeAction(page,engine+'-'+app+'-'+width+'-root-font-200',async()=>{
   const selector=app==='atlas'?'#article-introduction h2':'#yhwh h3';
   const heading=page.locator(selector).first();
   await heading.waitFor({state:'visible'});
   await page.evaluate(()=>document.documentElement.style.setProperty('font-size','200%','important'));
   await page.evaluate(async()=>{await document.fonts.ready;await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)))});
   await heading.scrollIntoViewIfNeeded();
   const d=await page.evaluate(({app,selector})=>{
    const root=document.documentElement,target=document.querySelector(selector);
    const h=target?.getBoundingClientRect();
    const menu=document.querySelector(app==='atlas'?'[data-covenant-map-nav]':'#sozvezdie-mobile-index-trigger');
    const m=menu?.getBoundingClientRect();
    // A page-width-only test missed real root-200% glyph collisions in the fixed header.
    // Measure actual visible controls and check whether truncated brand text can paint
    // outside its own DOM box. The full brand must remain available to assistive tech.
    const header=document.querySelector(app==='atlas'?'nav[aria-label="Основная навигация сайта"]':'header');
    const brand=header?.querySelector(app==='atlas'?'a[href="#top"]':'a[href="https://gospod-bog.ru"]');
    const b=brand?.getBoundingClientRect();
    const brandStyle=brand?getComputedStyle(brand):null;
    const headerControls=[...(header?.querySelectorAll('a,button')||[])].filter(el=>{
      if(el===brand) return false;
      const r=el.getBoundingClientRect(),style=getComputedStyle(el);
      return r.width>0&&r.height>0&&style.display!=='none'&&style.visibility!=='hidden';
    }).map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};});
    const headerBrandPaintOverflow=!!brand&&brand.scrollWidth>brand.clientWidth+2&&
      !['hidden','clip'].includes(brandStyle?.overflowX);
    const headerOverlap=!!b&&headerControls.some(r=>
      Math.min(b.right,r.right)-Math.max(b.left,r.left)>2 &&
      Math.min(b.bottom,r.bottom)-Math.max(b.top,r.top)>2);
    const headerControlsOutOfBounds=headerControls.some(r=>r.left< -2||r.right>root.clientWidth+2);
    const headerUndersizedControls=headerControls.filter(r=>r.right-r.left<43||r.bottom-r.top<43).length;
    // The section kicker formerly clipped “Часть” inside overflow-clip while
    // the document width stayed correct. Check both semantic labels' actual boxes.
    const kicker=app==='sozvezdie'?document.querySelector('#yhwh [data-name-section-kicker]'):null;
    const countLabel=kicker?.querySelector('[data-name-section-count]'),
      partLabel=kicker?.querySelector('[data-name-section-part]');
    const countBox=countLabel?.getBoundingClientRect(),
      partBox=partLabel?.getBoundingClientRect();
    const kickerLabelsFound=!!(countBox&&partBox);
    const kickerOverflow=!!kickerLabelsFound&&(
      [countBox,partBox].some(r=>r.left< -2||r.right>root.clientWidth+2||r.width<1)||
      countLabel.scrollWidth>countLabel.clientWidth+2||
      partLabel.scrollWidth>partLabel.clientWidth+2);
    const kickerOverlap=!!kickerLabelsFound&&
      Math.min(countBox.right,partBox.right)-Math.max(countBox.left,partBox.left)>2&&
      Math.min(countBox.bottom,partBox.bottom)-Math.max(countBox.top,partBox.top)>2;
    return {rootFontPx:parseFloat(getComputedStyle(root).fontSize),
      headerBrandFound:!!b,headerBrandWidth:b?.width??null,
      headerBrandAccessible:!!brand?.getAttribute('aria-label'),
      headerBrandPaintOverflow,headerOverlap,headerControlsOutOfBounds,headerUndersizedControls,
      headerControlsCount:headerControls.length,
      kickerLabelsFound,kickerOverflow,kickerOverlap,
      kickerCountBox:countBox?{left:countBox.left,right:countBox.right,top:countBox.top,bottom:countBox.bottom}:null,
      kickerPartBox:partBox?{left:partBox.left,right:partBox.right,top:partBox.top,bottom:partBox.bottom}:null,
      viewport:root.clientWidth,documentWidth:root.scrollWidth,
      headingFound:!!h,headingLeft:h?.left??null,headingRight:h?.right??null,
      headingClientWidth:target?.clientWidth??null,headingScrollWidth:target?.scrollWidth??null,
      controlFound:!!m,controlLeft:m?.left??null,controlRight:m?.right??null,
      controlWidth:m?.width??null,
      // Strict evidence: record the actual DOM boxes that force document width.
      // Do not infer offenders from a screenshot of a different scroll anchor.
      overflowCandidates:[...document.body.querySelectorAll('*')].map(el=>{
       const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
       return {tag:el.tagName,cls:String(el.className).slice(0,110),
        id:el.id||null,role:el.getAttribute('role'),
        x:Math.round(r.x),right:Math.round(r.right),
        width:Math.round(r.width),scrollWidth:el.scrollWidth,
        minWidth:cs.minWidth,position:cs.position,
        parentClass:String(el.parentElement?.className||'').slice(0,95),
        text:(el.textContent||'').trim().slice(0,50)};
      }).filter(el=>el.width>0&&el.right>root.clientWidth+2&&
        el.position!=='fixed').sort((a,b)=>b.right-a.right).slice(0,20)};
   },{app,selector});
   record('root-font-resize-200-reflow',{app,engine,width,...d});
   if(d.rootFontPx<30||!d.headingFound||d.documentWidth>d.viewport+2||
      d.headingLeft< -2||d.headingRight>d.viewport+2||
      d.headingScrollWidth>d.headingClientWidth+2||
      !d.controlFound||d.controlLeft< -2||d.controlRight>d.viewport+2||d.controlWidth<24||
      !d.headerBrandFound||d.headerBrandWidth<48||!d.headerBrandAccessible||d.headerBrandPaintOverflow||
      d.headerOverlap||d.headerControlsOutOfBounds||d.headerUndersizedControls>0||d.headerControlsCount<1||
      (app==='sozvezdie'&&(!d.kickerLabelsFound||d.kickerOverflow||d.kickerOverlap)))
    problem('BLOCKER','root-font-resize-200-reflow-failed',{app,engine,width,...d});
   await shot(page,engine+'-'+app+'-'+width+'-15-root-font-200');
   await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
   await page.evaluate(async()=>{
     await document.fonts.ready;
     await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)));
   });
  });

  if(app==='atlas' && [320,390].includes(width)){
   // A root-font 200% probe runs earlier on this page. Reload before text-only
   // enlargement so WebKit mobile text inflation / asynchronous style recalculation
   // cannot accidentally compound two independent 200% stress scenarios.
   await page.reload({waitUntil:'domcontentloaded',timeout:30000});
   await waitVisual(page);
   // WebKit can defer mobile text autosizing until an offscreen heading is laid out.
   // Focus the actual target before taking the clean baseline and applying 200%.
   await page.locator('#article-introduction h2').scrollIntoViewIfNeeded();
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const textBaseline=await page.evaluate(()=>{
    const title=document.querySelector('#article-introduction h2');
    const root=document.documentElement;
    return {rootFontPx:parseFloat(getComputedStyle(root).fontSize),
      titleFontPx:title?parseFloat(getComputedStyle(title).fontSize):null,
      viewport:root.clientWidth,documentWidth:root.scrollWidth};
   });
   record('atlas-text-resize-200-fresh-baseline',{engine,width,...textBaseline});
   if(Math.abs(textBaseline.rootFontPx-16)>0.5||!textBaseline.titleFontPx||
      textBaseline.documentWidth>textBaseline.viewport+2)
    problem('BLOCKER','atlas-text-resize-200-invalid-baseline',{engine,width,...textBaseline});
   // WCAG text-only resize stress. Unlike browser page zoom, this keeps
   // responsive breakpoints unchanged while enlarging text to 200%.
   // Never hide horizontal scrolling as a substitute for reflow.
   await safeAction(page,engine+'-atlas-'+width+'-text-resize-200',async()=>{
    const count=await page.evaluate(()=>{
     const selector='h1,h2,h3,h4,h5,p,li,button,summary,input,[data-name-primary-title],[data-name-original],[data-name-translit]';
     const nodes=[...document.querySelectorAll(selector)].filter(el=>el.getBoundingClientRect().width>0);
     const fontSizes=nodes.map(el=>parseFloat(getComputedStyle(el).fontSize));
     nodes.forEach((el,i)=>el.style.setProperty('font-size',fontSizes[i]*2+'px','important'));
     return nodes.length;
    });
    // A single frame occasionally saw WebKit's pre-resize 24px value while
    // the subsequent screenshot already painted at 48px. Require two consecutive
    // settled frames at the exact intended 200%; never accept 100% as success.
    const fontSettle=await page.evaluate(async expected=>{
     const title=document.querySelector('#article-introduction h2');
     const samples=[];let stable=0;
     for(let attempt=0;attempt<24;attempt++){
      await document.fonts.ready;
      await new Promise(resolve=>requestAnimationFrame(resolve));
      const px=title?parseFloat(getComputedStyle(title).fontSize):null;
      samples.push({attempt:attempt+1,px,inline:title?.style.getPropertyValue('font-size')||''});
      stable=px!==null&&Math.abs(px-expected)<0.5?stable+1:0;
      if(stable>=2)break;
     }
     return {stable:stable>=2,expected,samples};
    },textBaseline.titleFontPx*2);
    record('atlas-text-resize-200-font-settle',{engine,width,...fontSettle});
    if(!fontSettle.stable)
     problem('BLOCKER','atlas-text-resize-200-unstable-font',{engine,width,...fontSettle});
    const result=await page.evaluate(()=>{
     const doc=document.documentElement;
     const button=[...document.querySelectorAll('button')].find(el=>el.textContent?.includes('Развернуть все 36 разборов'));
     const rect=button?.getBoundingClientRect();
     const parent=button?.parentElement?.getBoundingClientRect();
     const title=document.querySelector('#article-introduction h2');
     return {viewport:doc.clientWidth,documentWidth:doc.scrollWidth,
      rootFontPx:parseFloat(getComputedStyle(doc).fontSize),
      titleFontPx:title?parseFloat(getComputedStyle(title).fontSize):null,
      buttonFound:!!button,buttonRight:rect?.right??null,parentRight:parent?.right??null,
      titleFound:!!title,titleWidth:title?.getBoundingClientRect().width??null,
      titleScrollWidth:title?.scrollWidth??null,titleClientWidth:title?.clientWidth??null,
      titleWrap:title?getComputedStyle(title).overflowWrap:null,
      titleWordBreak:title?getComputedStyle(title).wordBreak:null,
      titleWhiteSpace:title?getComputedStyle(title).whiteSpace:null,
      titleHyphens:title?getComputedStyle(title).hyphens:null,
      overflowCandidates:[...document.body.querySelectorAll('*')].map(el=>{
       const r=el.getBoundingClientRect();
       return {tag:el.tagName,id:el.id||null,cls:String(el.className).slice(0,100),
        right:Math.round(r.right),width:Math.round(r.width),scrollWidth:el.scrollWidth};
      }).filter(el=>el.width>0&&el.right>doc.clientWidth+2).slice(0,15)};
    });
    record('atlas-text-resize-200',{engine,width,count,...result});
    if(!result.buttonFound || !result.titleFound ||
       Math.abs(result.rootFontPx-textBaseline.rootFontPx)>0.5||
       Math.abs(result.titleFontPx-2*textBaseline.titleFontPx)>0.5||
       result.titleScrollWidth>result.titleClientWidth+2 ||
       result.documentWidth>result.viewport+2 ||
       (result.buttonRight!==null && result.parentRight!==null &&
        result.buttonRight>result.parentRight+2))
     problem('BLOCKER','atlas-text-resize-200-overflow',{engine,width,...result});
    await anchorShot(page,engine+'-atlas-'+width+'-text-resize-200',
     '#article-introduction h2',112);
   });
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
  for(const [engine,widths] of [['chromium',[320,340,350,360,361,370,375,390,430,768,1024,1440]],['webkit',[320,340,350,360,361,370,375,390,430,768,1024,1440]]]){
   const spec={chromium,webkit}[engine],options={headless:true};
   if(engine==='chromium'&&process.env.CHROMIUM_PATH)options.executablePath=process.env.CHROMIUM_PATH;
   const browser=await spec.launch(options);
   try{for(const app of ['atlas','sozvezdie'])for(const width of widths)
    await visit(browser,engine,app,width,base);
   }finally{await browser.close()}
  }
 }finally{
  fs.writeFileSync(path.join(out,'visual-report.json'),JSON.stringify({
   head:process.env.PR_HEAD_SHA||process.env.GITHUB_SHA||'local',checkoutMergeSha:process.env.GITHUB_SHA||null,generatedAt:new Date().toISOString(),
   shots,checks,findings},null,2));
  server.close();
 }
 const blockers=findings.filter(f=>f.level==='BLOCKER'||f.level==='HIGH');
 if(blockers.length)process.exitCode=1;
 console.log(JSON.stringify({status:blockers.length?'VISUAL_CONTRACT_FAIL':'EVIDENCE_CAPTURED',shots:shots.length,
   sessions:checks.filter(c=>c.name==='session').length,findings:findings.length,
   high:findings.filter(f=>f.level==='HIGH').length,output:out}));
})().catch(e=>{console.error(e.stack);process.exitCode=1;server.close()});
