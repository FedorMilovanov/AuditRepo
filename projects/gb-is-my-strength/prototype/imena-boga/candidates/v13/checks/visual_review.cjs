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
   return {top:r.top,bottom:r.bottom,width:r.width,viewportHeight:innerHeight};
  });
  record('screenshot-anchor-settle',{label,selector,attempt,actualTop:pos.top,targetTop:top});
  stable=Math.abs(pos.top-top)<=2?stable+1:0;
  if(stable>=2)break;
 }
 record('screenshot-anchor',{label,selector,...pos});
 if(Math.abs(pos.top-top)>3||pos.bottom>pos.viewportHeight||pos.width<1){
  problem('BLOCKER','screenshot-anchor-invalid',{label,selector,...pos});
  throw Error('Bad screenshot anchor: '+label);
 }
 await shot(page,label);
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
 const themes=app==='atlas'?['light','dark']:['default'];
 for(const theme of themes){
  if(theme==='dark'){
   await page.evaluate(k=>localStorage.setItem(k,JSON.stringify({theme:'dark'})),storageKey);
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
   await page.evaluate(()=>window.scrollTo({top:Math.round((document.documentElement.scrollHeight-innerHeight)*.72),behavior:'instant'}));
   await page.waitForTimeout(180);
   if(app==='sozvezdie'){
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
     await page.locator('#tetragrammaton [role="tab"]').nth(2).click();
     await shot(page,engine+'-sozvezdie-'+width+'-07-letter-detail');
    });
    if(width===390)await safeAction(page,engine+'-sozvezdie-'+width+'-mobile-index',async()=>{
     await page.locator('#yhwh').scrollIntoViewIfNeeded();
     await page.getByRole('button',{name:'Открыть список имён'}).click();
     await page.getByRole('dialog',{name:'Указатель библейских выражений'}).waitFor({state:'visible'});
     await shot(page,engine+'-sozvezdie-'+width+'-08-mobile-index');
     await page.keyboard.press('Escape');
    });
   }
  }

  if(app==='atlas' && [320,390,768,1440].includes(width)){
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
    if(d.flex!=='row'||d.top<d.screen-180)
     problem('BLOCKER','tablet-dock-overlaps-text',{engine,width,measure:d});
    await shot(page,engine+'-sozvezdie-'+width+'-tablet-dock');
   });
  }

  if(app==='atlas' && [320,390].includes(width)){
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
    await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(resolve))});
    const result=await page.evaluate(()=>{
     const doc=document.documentElement;
     const button=[...document.querySelectorAll('button')].find(el=>el.textContent?.includes('Развернуть все 36 разборов'));
     const rect=button?.getBoundingClientRect();
     const parent=button?.parentElement?.getBoundingClientRect();
     return {viewport:doc.clientWidth,documentWidth:doc.scrollWidth,
      buttonFound:!!button,buttonRight:rect?.right??null,parentRight:parent?.right??null};
    });
    record('atlas-text-resize-200',{engine,width,count,...result});
    if(!result.buttonFound || result.documentWidth>result.viewport+2 ||
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
