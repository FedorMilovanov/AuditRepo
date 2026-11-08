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
    if(width===390){
      // In the reduced-motion browser context, hero navigation must not
      // animate the document even if the desktop/mobile designs differ.
      await page.evaluate(()=>{
        window.__readerScrollWitness=[];
        const native=Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView=function(options){
          if(this.id==='article-introduction'||this.id==='constellation-atlas')
            window.__readerScrollWitness.push({id:this.id,behavior:options?.behavior});
          return native.call(this,options);
        };
      });
      await page.getByRole('button',{name:'Начать последовательное чтение'}).click();
      await page.getByRole('button',{name:'Созвездие 36 рассмотренных имён'}).click();
      const witness=await page.evaluate(()=>window.__readerScrollWitness);
      if(witness.length!==2||witness[0].id!=='article-introduction'||
         witness[1].id!=='constellation-atlas'||witness.some(x=>x.behavior!=='instant'))
        throw Error('Atlas deliberate reader navigation ignored reduced-motion setting '+JSON.stringify(witness));
    }
    if(width===320){
      // A stale stored ID (or a corrupted non-string value) must never
      // count as an additional studied name after the corpus changes.
      const seededContext=await browser.newContext({viewport:{width,height:844},locale:'ru-RU'});
      try{
        await seededContext.addInitScript(()=>{
          localStorage.setItem('gb:imena:atlas:names-studied:v1',
            JSON.stringify(['elohim','obsolete-name',42,null,'el','elohim']));
        });
        const seededPage=await seededContext.newPage();
        await seededPage.goto(base+'/atlas/',{waitUntil:'domcontentloaded'});
        await seededPage.locator('h1').first().waitFor({state:'visible'});
        await seededPage.waitForFunction(()=>{
          const ids=JSON.parse(localStorage.getItem('gb:imena:atlas:names-studied:v1')||'[]');
          return Array.isArray(ids)&&ids.length===2&&ids[0]==='elohim'&&ids[1]==='el';
        },null,{timeout:5000});
        const studiedLabel=await seededPage.locator('button[title^="Изучено "]').getAttribute('title');
        if(!studiedLabel?.includes('Изучено 2 из 36'))
          throw Error('Atlas progress includes obsolete/corrupted IDs '+studiedLabel);
      }finally{
        await seededContext.close();
      }
    }
    if(width>=1024){
      const rail=await page.evaluate(()=>{
        const columns=[...document.querySelectorAll('aside[aria-label*="скрижаль имён Бога"]')];
        const cards=columns.flatMap(col=>[...col.querySelectorAll('.thin-sacred-scroll > div')]);
        const lineOverlaps=columns.filter((col,index)=>{
          const line=col.querySelector('.sacred-filament')?.getBoundingClientRect();
          const card=col.querySelector('.thin-sacred-scroll > div')?.getBoundingClientRect();
          if(!line||!card)return true;
          return index===0 ? line.right > card.left-2 : line.left < card.right+2;
        }).length;
        const clippedButtons=columns.flatMap(col=>[...col.querySelectorAll('.thin-sacred-scroll button')])
          .filter(button=>button.scrollWidth>button.clientWidth+2).length;
        return {columns:columns.length,cards:cards.length,
          faded:cards.filter(el=>Number(getComputedStyle(el).opacity)<0.95).length,
          placeholders:columns.filter(el=>el.textContent?.includes('Явится при чтении')).length,
          lineOverlaps,clippedButtons};
      });
      if(rail.columns!==2||rail.cards!==36||rail.faded!==0||rail.placeholders!==0||rail.lineOverlaps!==0||rail.clippedButtons!==0)
        throw Error('Atlas lateral-name rails illegible/clipped '+JSON.stringify({engine,width,rail}));
      const siteBrand=await page.locator('nav[aria-label="Основная навигация сайта"] a[aria-label*="в начало статьи"] > span').first().evaluate(el=>
        ({visible:getComputedStyle(el).display!=='none',width:el.clientWidth,scrollWidth:el.scrollWidth}));
      if(!siteBrand.visible||siteBrand.scrollWidth>siteBrand.width+1)
        throw Error('Atlas desktop site name truncated '+JSON.stringify({engine,width,siteBrand}));
    }
    if(width<=390&&stats.medallion&&(stats.medallion.left<0||stats.medallion.right>width))
      throw Error('Medallion clipped '+width);
    let painted=await countPixels(page,'header canvas');
    const started=Date.now();
    while(!(painted>0)&&Date.now()-started<4000){await page.waitForTimeout(120);painted=await countPixels(page,'header canvas')}
    if(!(painted>0))throw Error('Atlas Canvas blank '+width);
    // Verify *rendered* small-label contrast against its actual card surface
    // in every reader theme, not just the declared CSS tokens.
    const assertGoldInkContrast = async (expectedTheme) => {
      await page.waitForFunction(mode => document.documentElement.getAttribute('data-reader-theme') === mode, expectedTheme);
      const witness = await page.evaluate(() => {
        const title = [...document.querySelectorAll('span')].find(el =>
          el.textContent?.trim() === 'Четыре тезиса исследования'
        );
        const card = title?.closest('section');
        if (!title || !card) throw Error('Gold label/card missing');
        const fg = getComputedStyle(title).color;
        const bg = getComputedStyle(card).backgroundColor;
        const luminance = (color) => {
          const channels = (color.match(/[0-9.]+/g) || []).slice(0, 3).map(Number);
          if (channels.length !== 3 || channels.some(n => !Number.isFinite(n))) throw Error('Invalid computed color '+color);
          const linear = channels.map(n => {
            const x = n / 255;
            return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
        };
        const a = luminance(fg), b = luminance(bg);
        return { fg, bg, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
      });
      if (witness.ratio < 4.5) throw Error('Gold text below WCAG AA: '+JSON.stringify({engine,width,expectedTheme,witness}));
      return witness.ratio;
    };
    // The short introductory abstract starts collapsed: it should not take
    // over the reading viewport, but must remain a reversible keyboard action.
    const summary=page.locator('section[aria-label="Коротко о главном"]');
    const summaryToggle=summary.locator('button[aria-controls="atlas-summary-theses"]');
    const summaryContent=summary.locator('#atlas-summary-theses');
    if((await summaryToggle.getAttribute('aria-expanded'))!=='false' ||
       (await summaryContent.getAttribute('aria-hidden'))!=='true')
      throw Error('Atlas summary not collapsed by default '+width);
    await summaryContent.evaluate(el=>{
      if(!el.inert)throw Error('Collapsed summary is not inert');
    });
    await page.waitForFunction(()=>{
      const el=document.getElementById('atlas-summary-theses');
      return !!el&&el.getBoundingClientRect().height<2;
    });
    await summaryToggle.click();
    if((await summaryToggle.getAttribute('aria-expanded'))!=='true'||
       (await summaryContent.getAttribute('aria-hidden'))!=='false'||
       (await summaryContent.locator('p').count())!==4)
      throw Error('Atlas summary did not expose four theses '+width);
    await page.waitForFunction(()=>{
      const el=document.getElementById('atlas-summary-theses');
      return !!el&&el.getBoundingClientRect().height>50;
    });
    await summaryToggle.focus();
    await page.keyboard.press('Enter');
    if((await summaryToggle.getAttribute('aria-expanded'))!=='false'||
       (await summaryContent.getAttribute('aria-hidden'))!=='true')
      throw Error('Atlas summary keyboard collapse failed '+width);
    await page.waitForFunction(()=>{
      const el=document.getElementById('atlas-summary-theses');
      return !!el&&el.getBoundingClientRect().height<2;
    });
    // Search command owns focus synchronously, and cannot steal it
    // again after the reader has moved to another control.
    const navSearch=page.getByRole('button',{name:'Открыть поиск по именам'});
    await navSearch.click();
    const input=page.locator('#constellation-search-input');
    if(!(await input.evaluate(el=>document.activeElement===el)))
      throw Error('Atlas navbar search did not focus immediately '+width);
    await navSearch.focus();
    await page.waitForTimeout(550);
    if(!(await navSearch.evaluate(el=>document.activeElement===el)))
      throw Error('Atlas navbar search stole focus after an unrelated action '+width);

    const lightContrast = await assertGoldInkContrast('light');
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
    const sepiaContrast = await assertGoldInkContrast('sepia');
    await panel.getByRole('button',{name:'Ночная'}).click();
    const darkContrast = await assertGoldInkContrast('dark');
    await panel.getByRole('button',{name:'Сепия'}).click();
    await page.waitForFunction(() => document.documentElement.getAttribute('data-reader-theme') === 'sepia');
    const previousSize=await page.locator('main').first().evaluate(el=>el.style.fontSize);
    await panel.getByRole('button',{name:'Увеличить размер текста в настройках'}).click();
    // Wait for the React commit; browser-specific text autosizing can change
    // computed px values independently of the app's inline rem contract.
    await page.waitForFunction(previous=>{
      const next=document.querySelector('main')?.style.fontSize;
      return !!next&&parseFloat(next)>parseFloat(previous);
    },previousSize,{timeout:5000});
    const nextSize=await page.locator('main').first().evaluate(el=>el.style.fontSize);
    if(!(parseFloat(nextSize)>parseFloat(previousSize)))
      throw Error('Reader font scale did not change '+JSON.stringify({width,previousSize,nextSize}));
    await page.keyboard.press('Escape');
    if(await panel.count()||(await settings.getAttribute('aria-expanded'))!=='false')
      throw Error('Escape did not close settings '+width);
    const focusReturned=await settings.evaluate(el=>document.activeElement===el);
    if(!focusReturned)throw Error('Escape did not return focus '+width);
    // A print/PDF request must invoke the browser synchronously inside the
    // click dispatch. A setTimeout can lose browser user-activation privileges.
    await settings.click();
    await page.evaluate(()=>{
      window.__printCalls=0;
      window.__printWasImmediate=false;
      window.print=()=>{window.__printCalls++};
      // Check at document bubble: React's delegated click handler has run.
      // A microtask queued in capture may run before React sees the click,
      // falsely reporting that a synchronous print call was deferred.
      document.addEventListener('click',event=>{
        const target=event.target;
        if(target instanceof Element && target.closest('button')?.textContent?.includes('Печать / PDF')){
          window.__printWasImmediate=window.__printCalls===1;
        }
      },{once:true});
    });
    await panel.getByRole('button',{name:'Печать / PDF'}).click();
    const printWitness=await page.evaluate(()=>({
      calls:window.__printCalls,
      synchronous:window.__printWasImmediate
    }));
    if(printWitness.calls!==1||!printWitness.synchronous)
      throw Error('Print/PDF did not run inside click activation '+JSON.stringify({width,printWitness}));
    const method=page.locator('section[aria-labelledby="gb-methodology-title"]');
    if(await method.count()!==1)throw Error('Research methodology is missing '+width);
    await method.locator('summary').click();
    if(!(await method.locator('details').evaluate(el=>el.hasAttribute('open'))))
      throw Error('Method disclosure not expandable '+width);
    // Mobile/tablet scripture pillars are a true keyboard modal.
    if(width<1024){
      const trigger=page.getByRole('button',{name:'Открыть скрижали имён Бога'});
      // Document-bubble observer runs after the React root's click handler.
      // A requestAnimationFrame-based focus transition must fail this witness,
      // even if later Playwright assertions happen to run after the frame.
      await page.evaluate(()=>{
        window.__atlasImmediateDrawerFocus=null;
        document.addEventListener('click',event=>{
          if(!(event.target instanceof Element) ||
             !event.target.closest('button[aria-label="Открыть скрижали имён Бога"]')) return;
          const dialog=document.querySelector('[role="dialog"][aria-label="Скрижали имён Бога"]');
          window.__atlasImmediateDrawerFocus=Boolean(dialog &&
            dialog.contains(document.activeElement) &&
            document.activeElement?.getAttribute('aria-label')==='Закрыть скрижаль');
        },{once:true});
      });
      await trigger.click();
      const synchronousFocus=await page.evaluate(()=>window.__atlasImmediateDrawerFocus);
      if(synchronousFocus!==true)
        throw Error('Atlas mobile drawer did not receive focus in opening click '+JSON.stringify({width,synchronousFocus}));
      const drawer=page.getByRole('dialog',{name:'Скрижали имён Бога'});
      await drawer.waitFor({state:'visible'});
      const mobileNames=await drawer.locator('button').evaluateAll(buttons=>
        buttons.filter(button=>button.textContent?.includes('Читать'))
          .map(button=>({text:button.textContent?.trim().slice(0,60),
            opacity:Number(getComputedStyle(button).opacity)})));
      if(mobileNames.length!==36||mobileNames.some(item=>item.opacity<0.98))
        throw Error('Atlas unread mobile names are illegibly faded '+JSON.stringify({width,mobileNames}));
      // The mobile name index must expose complete names, not ellipses.
      // Inspect each rendered text fragment; global page scrollWidth misses it.
      const atlasText=await drawer.evaluate(dialog=>{
        const entries=[...dialog.querySelectorAll('button')]
          .filter(button=>button.querySelector('[data-atlas-mobile-text="russian"]'));
        const invalid=[];
        for(const entry of entries){
          const card=entry.getBoundingClientRect();
          for(const label of entry.querySelectorAll('[data-atlas-mobile-text]')){
            const computed=getComputedStyle(label);
            const range=document.createRange();
            range.selectNodeContents(label);
            const fragments=[...range.getClientRects()];
            if(computed.whiteSpace==='nowrap'||computed.textOverflow==='ellipsis'||
               !fragments.length||fragments.some(rect=>
                  rect.left<card.left+3||rect.right>card.right-3))
              invalid.push({kind:label.getAttribute('data-atlas-mobile-text'),
                value:label.textContent?.trim().slice(0,60)});
          }
        }
        return {count:entries.length,invalid};
      });
      if(atlasText.count!==36||atlasText.invalid.length)
        throw Error('Atlas mobile labels truncated or clipped '+JSON.stringify({width,...atlasText}));
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label')==='Закрыть скрижаль');
      if((await trigger.getAttribute('aria-expanded'))!=='true')
        throw Error('Pillars trigger not expanded '+width);
      const buttons=drawer.locator('button');
      await buttons.first().focus();
      await page.keyboard.press('Shift+Tab');
      if(!(await buttons.last().evaluate(el=>document.activeElement===el)))
        throw Error('Pillars reverse Tab leaked past dialog '+width);
      await page.keyboard.press('Tab');
      if(!(await buttons.first().evaluate(el=>document.activeElement===el)))
        throw Error('Pillars forward Tab did not wrap '+width);
      await page.keyboard.press('Escape');
      await drawer.waitFor({state:'detached'});
      await page.waitForFunction(() => document.body.style.overflow!=='hidden');
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label')==='Открыть скрижали имён Бога');
      if((await trigger.getAttribute('aria-expanded'))!=='false')
        throw Error('Pillars trigger stuck expanded '+width);
      // The dossier captures the persistent ribbon as its restore target.
      await trigger.click();
      await drawer.locator('button').nth(2).click();
      // The dossier must own focus as soon as the click commits. Waiting for
      // a timer here previously concealed an actual keyboard accessibility bug.
      const initialDossierFocus=await page.evaluate(()=>{
        const modal=document.querySelector('[role="dialog"][aria-modal="true"]');
        return {exists:Boolean(modal), inside:Boolean(modal?.contains(document.activeElement)),
          focus:document.activeElement?.getAttribute('aria-label')};
      });
      if(!initialDossierFocus.exists||!initialDossierFocus.inside||
         initialDossierFocus.focus!=='Закрыть окно')
        throw Error('Atlas name dossier initially leaves focus outside modal '+
          JSON.stringify({width,initialDossierFocus}));
      const dossier=page.getByRole('dialog');
      await dossier.waitFor({state:'visible'});
      // Related names contain canonical Russian titles; never silently
      // ellipsize them inside modal cards even when page scrollWidth is zero.
      const relatedGeometry=await dossier.locator('[data-related-name-text]').evaluateAll(labels=>{
        const invalid=[];
        for(const label of labels){
          const card=label.closest('button');
          if(!card){ invalid.push({reason:'missing button'}); continue; }
          const box=card.getBoundingClientRect(),style=getComputedStyle(label);
          const range=document.createRange();range.selectNodeContents(label);
          const fragments=[...range.getClientRects()];
          if(style.textOverflow==='ellipsis'||style.whiteSpace==='nowrap'||
             !fragments.length||fragments.some(r=>r.left<box.left+3||r.right>box.right-3))
            invalid.push({text:label.textContent?.trim().slice(0,80),type:label.getAttribute('data-related-name-text')});
        }
        return {count:labels.length,invalid};
      });
      if(!relatedGeometry.count||relatedGeometry.invalid.length)
        throw Error('Atlas related names clipped/truncated in dossier '+
          JSON.stringify({width,relatedGeometry}));
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label')==='Закрыть окно');
      await dossier.getByRole('button',{name:'Закрыть окно'}).click();
      await dossier.waitFor({state:'detached'});
      await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label')==='Открыть скрижали имён Бога');
      if(width===768){
        await trigger.click();
        await drawer.waitFor({state:'visible'});
        await page.setViewportSize({width:1024,height:844});
        await drawer.waitFor({state:'detached'});
        await page.waitForFunction(() => document.body.style.overflow!=='hidden');
        await page.setViewportSize({width,height:844});
      }
    }
    // A link copied from the divine-name dossier must reopen that dossier
    // in a clean browser session (not merely scroll behind a closed overlay).
    if(width===390){
      const direct=await ctx.newPage();
      await direct.goto(base+'/atlas/#name-elohim',{waitUntil:'domcontentloaded'});
      const dossier=direct.getByRole('dialog');
      await dossier.waitFor({state:'visible',timeout:20000});
      const heading=await dossier.locator('#modal-divine-name-title').innerText();
      if(!heading.toLowerCase().includes('элохим'))
        throw Error('Shared Atlas name hash opened the wrong dossier: '+heading);
      await direct.waitForFunction(()=>
        document.activeElement?.getAttribute('aria-label')==='Закрыть окно'
      );
      if(new URL(direct.url()).hash!=='#name-elohim')
        throw Error('Atlas direct dossier link hash changed unexpectedly');
      await dossier.getByRole('button',{name:'Закрыть окно'}).click();
      await dossier.waitFor({state:'detached'});
      if(new URL(direct.url()).hash)
        throw Error('Closing direct-link dossier left a stale hash '+direct.url());
      await direct.close();
    }
    const finalLayout=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth
    }));
    if(finalLayout.scroll>finalLayout.viewport+1||errors.length||requests.length)
      throw Error('Reader preferences regression '+JSON.stringify({width,finalLayout,errors,requests}));
    results.push({name,width,painted,cssLoaded:true,readerPrefs:true,methodDisclosure:true,contrastRatios:{light:lightContrast,sepia:sepiaContrast,dark:darkContrast}});
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
