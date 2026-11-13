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
const widths=(process.env.VIEWPORTS||'320,340,350,359,360,361,370,375,390,414,430,640,768,1024,1440,1600').split(',').map(Number);
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
   // Font swapping can temporarily widen the 320px layout while the browser
   // is still shaping Hebrew/Cyrillic text. Certify the first *settled*
   // typographic layout, not a pre-font transient. No arbitrary delay.
   await page.evaluate(async()=>{
     await document.fonts.ready;
     await new Promise(resolve=>requestAnimationFrame(resolve));
   });
   const stats=await page.evaluate(()=>{
    const med=document.querySelector('button[title*="Нажмите"]')?.getBoundingClientRect();
    return {viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
      bodyText:document.body.innerText.length,medallion:med?{left:med.left,right:med.right}:null,
      cssLoaded:[...document.styleSheets].some(s=>s.href?.includes('/assets/'))};
   });
   if(stats.bodyText<1000||stats.scroll>stats.viewport+1||errors.length||requests.length||!stats.cssLoaded){
     const overflowDetails=stats.scroll>stats.viewport+1
       ? await page.evaluate(()=>{
           const width=document.documentElement.clientWidth;
           return [...document.body.querySelectorAll('*')].map(element=>{
             const rect=element.getBoundingClientRect(),style=getComputedStyle(element);
             return {tag:element.tagName,cls:String(element.className).slice(0,80),
               left:Math.round(rect.left),right:Math.round(rect.right),
               width:Math.round(rect.width),overflow:style.overflowX};
           }).filter(item=>item.width>0&&(item.right>width+1||item.left< -1))
             .sort((left,right)=>right.right-left.right).slice(0,16);
         })
       : [];
     throw Error('Layout/runtime failure '+JSON.stringify({engine,name,width,stats,errors,requests,overflowDetails}));
   }
   if(name==='atlas'){
    // Readability of the navbar must not depend on backdrop-filter support.
    const navPaint=await page.locator('nav[aria-label="Основная навигация сайта"]')
      .evaluate(el=>getComputedStyle(el).backgroundColor);
    if(!/^rgb\(/.test(navPaint))
      throw Error('Atlas header is translucent over article text '+JSON.stringify({engine,width,navPaint}));
    if(width===1440){
      // Dynamic OS preference change: a medallion already tilted under a
      // normal-motion setting must immediately return to neutral, without
      // requiring mouseleave or another hover event.
      const liveCtx=await browser.newContext({viewport:{width,height:844},
        locale:'ru-RU',reducedMotion:'no-preference'});
      try{
        const motionPage=await liveCtx.newPage();
        if(process.env.FONTS_MODE==='offline')
          await motionPage.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
        await motionPage.goto(base+'/atlas/',{waitUntil:'domcontentloaded'});
        const medallion=motionPage.locator('.gb-hero-medallion-button');
        await medallion.waitFor({state:'visible'});
        await medallion.hover({position:{x:20,y:20}});
        const bounds=await medallion.boundingBox();
        if(!bounds)throw Error('Atlas medallion has no pointer geometry');
        await motionPage.mouse.move(bounds.x+bounds.width*.85,bounds.y+bounds.height*.35);
        await motionPage.waitForFunction(()=>{
          const value=document.querySelector('.gb-hero-medallion-button')?.style.transform;
          return value && value!=='rotateX(0deg) rotateY(0deg)';
        },null,{timeout:5000});
        await motionPage.emulateMedia({reducedMotion:'reduce'});
        await motionPage.waitForFunction(()=>
          document.querySelector('.gb-hero-medallion-button')?.style.transform===
          'rotateX(0deg) rotateY(0deg)',
          null,{timeout:5000});
        const transition=await medallion.evaluate(el=>({
          property:getComputedStyle(el).transitionProperty,
          duration:getComputedStyle(el).transitionDuration,
        }));
        // Chromium can serialize motion-reduce's effectively zero duration as
        // "1e-06s"; parseFloat misreads scientific notation as 1 second.
        // Check actual numeric time, not whether transitionProperty is "none".
        const durationSeconds=transition.duration.split(',').map(time=>{
          const token=time.trim();
          if(token.endsWith('ms'))return Number(token.slice(0,-2))/1000;
          if(token.endsWith('s'))return Number(token.slice(0,-1));
          return NaN;
        });
        if(durationSeconds.length===0||durationSeconds.some(t=>!Number.isFinite(t)||t>0.001))
          throw Error('Atlas OS reduced-motion has a perceptible medallion transition '+
            JSON.stringify({engine,width,transition,durationSeconds}));
      }finally{
        await liveCtx.close();
      }
    }
    // Reflow contract: no Hebrew/Greek original or Russian caption may be
    // clipped when large-text zoom narrows the medallion's inline space.
    if(width===320){
      // Keep resize / focus / carousel state out of the main reading-preferences
      // scenario. Reusing that page made WebKit's subsequent print-panel
      // activation sensitive to the mobile-stress test's interaction history.
      const glyphCtx=await browser.newContext({viewport:{width,height:844},locale:'ru-RU',reducedMotion:'reduce'});
      try{
        const glyphPage=await glyphCtx.newPage();
        if(process.env.FONTS_MODE==='offline')
          await glyphPage.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
        await glyphPage.goto(base+'/atlas/',{waitUntil:'domcontentloaded'});
        await glyphPage.locator('h1').first().waitFor({state:'visible'});
        await glyphPage.evaluate(()=>document.fonts.ready);
        const dots=glyphPage.getByRole('group',{name:'Выбор имени на медальоне'}).locator('button');
        if(await dots.count()!==5)throw Error('Atlas glyph selector lost one of its five controls');
      for(const narrow of [200,240,280,320,430]){
        await glyphPage.setViewportSize({width:narrow,height:844});
        for(let i=0;i<5;i++){
          await dots.nth(i).click();
          const geo=await glyphPage.evaluate(()=>{
            const row=document.querySelector('.gb-hero-medallion-controls');
            const card=document.querySelector('.gb-hero-medallion-button');
            const script=document.querySelector('.gb-hero-medallion-script');
            const caption=document.querySelector('.gb-hero-medallion-caption');
            const prev=document.querySelector('.gb-hero-medallion-prev');
            const next=document.querySelector('.gb-hero-medallion-next');
            const eyebrow=document.querySelector('.gb-hero-eyebrow');
            const actions=[...document.querySelectorAll('header .gb-hero-action')];
            if(!row||!card||!script||!caption||!prev||!next||!eyebrow||actions.length!==2)
              return {error:'missing medallion elements'};
            const bounds=card.getBoundingClientRect(),viewport=document.documentElement.clientWidth;
            const textFits=element=>{
              const range=document.createRange();range.selectNodeContents(element);
              const fragments=[...range.getClientRects()];
              return fragments.length>0&&fragments.every(r=>r.left>=bounds.left+2&&r.right<=bounds.right-2);
            };
            const onscreen=element=>{
              const r=element.getBoundingClientRect();
              return r.width>=1&&r.left>=-1&&r.right<=viewport+1;
            };
            return {display:getComputedStyle(row).display,cardWidth:Math.round(bounds.width),
              glyphText:script.textContent?.trim(),scriptFits:textFits(script),
              captionFits:textFits(caption),arrowsFit:onscreen(prev)&&onscreen(next),
              badgeFits:onscreen(eyebrow),actionsFit:actions.every(onscreen),
              controlsTallEnough:[prev,next].every(el=>el.getBoundingClientRect().height>=44)};
          });
          if(geo.error||geo.display!==(narrow<=280?'grid':'flex')||geo.cardWidth<125||
             !geo.scriptFits||!geo.captionFits||!geo.arrowsFit||!geo.badgeFits||
             !geo.actionsFit||!geo.controlsTallEnough)
            throw Error('Atlas mobile glyph/CTA reflow '+JSON.stringify({engine,narrow,i,geo}));
        }
      }
      }finally{
        await glyphCtx.close();
      }
    }
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
      await page.getByRole('button',{name:'Сводная схема · 36 позиций'}).click();
      const witness=await page.evaluate(()=>window.__readerScrollWitness);
      if(witness.length!==2||witness[0].id!=='article-introduction'||
         witness[1].id!=='constellation-atlas'||witness.some(x=>x.behavior!=='instant'))
        throw Error('Atlas deliberate reader navigation ignored reduced-motion setting '+JSON.stringify(witness));
    }
    if(width<=430){
      const brief=await page.locator('button[aria-controls="atlas-summary-theses"]').evaluate(btn=>{
        const spans=btn.querySelectorAll('span'),svg=btn.querySelector('svg');
        if(spans.length<2||!svg)return null;
        const a=spans[0].getBoundingClientRect();
        const b=spans[1].getBoundingClientRect();
        const v=svg.getBoundingClientRect();
        const outer=btn.getBoundingClientRect();
        return {titleBottom:a.bottom,labelTop:b.top,
          chevLeft:v.left,titleRight:a.right,
          chevInside:v.left>=outer.left&&v.right<=outer.right+1
            &&v.top>=outer.top-1&&v.bottom<=outer.bottom+1,
          minHeight:outer.height};
      });
      if(!brief||!brief.chevInside||brief.labelTop<brief.titleBottom-2||
        brief.chevLeft<brief.titleRight+2||brief.minHeight<44)
        throw Error('Atlas summary disclosure icon orphaned '+JSON.stringify({engine,width,brief}));
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
    if(width>=1440){
      // Full-height skirting rails are desktop-only. At 1024-1439 their
      // hidden DOM nodes have zero rects, so their connector geometry is not a visual witness.
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

      // Word-level integrity is stronger than scrollWidth or clipped buttons:
      // both Greek and Hebrew script must remain whole within all 36 rails.
      const pillarIntegrity=await page.evaluate(()=>{
        const labels=[...document.querySelectorAll(
          'aside[aria-label*="скрижаль"] button .font-greek,aside[aria-label*="скрижаль"] button .font-hebrew')];
        const failures=[];
        let wordCount=0;
        for(const el of labels){
          const original=el.textContent?.trim()||'';
          const tokens=[...el.querySelectorAll('[data-atlas-pillar-token]')];
          if(!tokens.length){failures.push({original,reason:'original-script tokenization missing'});continue}
          for(const token of tokens){
            const word=token.textContent||'';
            if(!/[\p{Script=Hebrew}\p{Script=Greek}]/u.test(word))continue;
            wordCount++;
            const node=token.firstChild;
            if(!(node instanceof Text)){failures.push({original,word,reason:'no token text'});continue}
            const range=document.createRange();
            range.selectNodeContents(token);
            const rects=[...range.getClientRects()].filter(r=>r.width>0.5);
            const rows=[...new Set(rects.map(r=>Math.round(r.y)))];
            const box=el.getBoundingClientRect();
            if(rows.length!==1||rects.some(r=>r.left<box.left-2||r.right>box.right+2))
              failures.push({original,word,rows,rects:rects.map(r=>[r.x,r.width])});
          }
        }
        return {count:labels.length,wordCount,failures};
      });
      if(pillarIntegrity.count!==36||pillarIntegrity.wordCount<36||pillarIntegrity.failures.length)
        throw Error('Atlas lateral scripts fragmented '+JSON.stringify({engine,width,pillarIntegrity}));

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
    // Require whole original-script words on all 36 cards, rather than
    // checking only the overall document scrollWidth. Hebrew niqqud must
    // stay attached to its letter; a single word may not fragment over rows.
    const scriptIntegrity=await page.locator('#constellation-atlas').evaluate(section=>{
      const cards=[...section.querySelectorAll('[data-constellation-result]')];
      const failures=[];
      let testedWords=0;
      for(const card of cards){
        const source=card.querySelector('[data-constellation-original]');
        if(!source){failures.push({reason:'original missing'});continue}
        const tokens=[...source.querySelectorAll('[data-constellation-original-token]')];
        if(!tokens.length){failures.push({reason:'word tokens missing'});continue}
        for(const token of tokens){
          const word=token.textContent||'';
          if(!/[\p{Script=Hebrew}\p{Script=Greek}]/u.test(word))continue;
          testedWords++;
          const range=document.createRange();
          range.selectNodeContents(token);
          const fragments=[...range.getClientRects()].filter(r=>r.width>1&&r.height>1);
          const lines=[...new Set(fragments.map(r=>Math.round(r.y)))];
          const cell=card.getBoundingClientRect();
          const clipped=fragments.some(r=>r.left<cell.left-2||r.right>cell.right+2);
          if(lines.length!==1||clipped)
            failures.push({name:card.querySelector('h4')?.textContent,
              word,lines,clipped});
        }
      }
      return {count:cards.length,testedWords,failures};
    });
    if(scriptIntegrity.count!==36||scriptIntegrity.testedWords<36||
       scriptIntegrity.failures.length)
      throw Error('Atlas original-script word fragmentation '+JSON.stringify({
        engine,width,scriptIntegrity
      }));
    if(!(await input.evaluate(el=>document.activeElement===el)))
      throw Error('Atlas navbar search did not focus immediately '+width);
         if (width <= 390) {
       const filterButton = page.getByRole('button', {name: /^Фильтры/});
       const firstResult = page.locator('[data-constellation-result]').first();
       if ((await filterButton.getAttribute('aria-expanded')) !== 'false')
         throw Error('Atlas mobile filters must start collapsed '+width);
       const resultTop = await firstResult.evaluate(el => el.getBoundingClientRect().top);
       if (resultTop < 0 || resultTop > 700)
         throw Error('Atlas first search result below mobile fold '+JSON.stringify({width,resultTop}));
       await filterButton.click();
       if ((await filterButton.getAttribute('aria-expanded')) !== 'true')
         throw Error('Atlas mobile filters did not open '+width);
       await page.getByRole('button', {name: 'Яхве', exact: true}).click();
       if ((await input.inputValue()) !== 'Яхве')
         throw Error('Atlas quick search tag did not populate input '+width);
       await filterButton.click();
       if ((await filterButton.getAttribute('aria-expanded')) !== 'false')
         throw Error('Atlas mobile filters did not close '+width);
       await input.fill('');
     }
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
    // Initial opening above validates pointer activation. After Escape,
    // reopen via keyboard to certify an independent accessible activation
    // path rather than reusing a WebKit coordinate click during layout churn.
    await settings.focus();
    await page.keyboard.press('Enter');
    await panel.waitFor({state:'visible',timeout:5000});
    if((await settings.getAttribute('aria-expanded'))!=='true')
      throw Error('Atlas settings did not reopen for print '+JSON.stringify({engine,width}));
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
    const printAction=panel.getByRole('button',{name:'Печать / PDF'});
    if(!(await printAction.isVisible()))
      throw Error('Atlas settings has no visible print action '+JSON.stringify({engine,width,content:await panel.innerText()}));
    await printAction.click();
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
    // Compact-viewport pillars are opened from the real header. The former
    // floating ribbon was removed because it obscured mobile reading text.
    if(width<1440){
      const trigger=page.locator('#gb-mobile-atlas-nav-trigger');
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await trigger.waitFor({state:'visible',timeout:10000});
      await page.waitForFunction(()=>
        document.getElementById('atlas-hero')?.getBoundingClientRect().bottom>0);
      const cover=await trigger.evaluate(el=>{
        const rect=el.getBoundingClientRect();
        const overlays=[...document.querySelectorAll('[data-atlas-mobile-ribbon],[data-atlas-launcher-shell]')]
          .filter(node=>{const r=node.getBoundingClientRect(),css=getComputedStyle(node);
            return r.width>0&&r.height>0&&css.visibility!=='hidden'&&css.display!=='none';});
        return {height:rect.height,width:rect.width,top:rect.top,bottom:rect.bottom,
          insideNav:Boolean(el.closest('nav')),overlays:overlays.length,
          label:el.getAttribute('aria-label'),hasPopup:el.getAttribute('aria-haspopup')};
      });
      if(!cover.insideNav||cover.overlays||cover.top<0||cover.bottom>100||
         cover.height<40||cover.width<40||!cover.label||cover.hasPopup!=='dialog')
        throw Error('Atlas header drawer launcher invalid on hero '+
          JSON.stringify({engine,width,cover}));
      await page.locator('#article-introduction').scrollIntoViewIfNeeded();
      await trigger.waitFor({state:'visible',timeout:10000});
      const reading=await trigger.evaluate(el=>{
        const rect=el.getBoundingClientRect();
        return {top:rect.top,bottom:rect.bottom,
          overlays:[...document.querySelectorAll('[data-atlas-mobile-ribbon],[data-atlas-launcher-shell]')]
            .filter(node=>node.getBoundingClientRect().width>0&&node.getBoundingClientRect().height>0).length};
      });
      if(reading.overlays||reading.top<0||reading.bottom>100)
        throw Error('Atlas mobile launcher obscures reading text '+
          JSON.stringify({engine,width,reading}));
      // Document-bubble observer runs after React's click handler.
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
      // Multi-row mobile header protects the whole title from actions.
      const drawerHeading=await drawer.locator('h3').boundingBox();
      if(width<=390 && (!drawerHeading || drawerHeading.height>65))
        throw Error('Mobile drawer title squeezed by header controls '+JSON.stringify({engine,width,drawerHeading}));

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
      // The dossier restores focus to the permanent header trigger.
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
        // Tablet mode now extends through 1439px. Only the actual desktop
        // breakpoint at 1440px should dismiss the mobile drawer.
        await page.setViewportSize({width:1024,height:844});
        if(!(await drawer.isVisible()))
          throw Error('Atlas tablet drawer was prematurely dismissed at 1024px');
        await page.setViewportSize({width:1440,height:844});
        await drawer.waitFor({state:'detached'});
        await page.waitForFunction(() => document.body.style.overflow!=='hidden');
        await page.setViewportSize({width,height:844});
      }
    }
    // Exact last-dossier witness: an article and its Greek noun form one
    // unbreakable typographic token, not an orphaned Omega glyph in WebKit.
    if(width===320){
      const last=page.locator('article[data-name-id]').last();
      await last.scrollIntoViewIfNeeded();
      await last.getByRole('button',{name:'Открыть полное досье'}).click();
      const original=page.locator('[data-modal-original]');
      await original.waitFor({state:'visible'});
      const greekPhrases=await original.locator('[data-greek-original-token]').allTextContents();
      if(!greekPhrases.includes('τὸ\u00a0Ὦ') ||
         !greekPhrases.includes('τὸ\u00a0Ἄλφα'))
        throw Error('Atlas Greek article split exposes orphan symbol '+JSON.stringify({engine,width,greekPhrases}));
      const header=page.locator('#modal-divine-name-title');
      const headerText=await header.innerText();
      if(!headerText.includes('То\u00a0Альфа') ||
         !headerText.includes('то\u00a0О'))
        throw Error('Atlas Greek transliteration not grouped '+JSON.stringify({engine,width,headerText}));
      await page.getByRole('dialog').getByRole('button',{name:'Закрыть окно'}).click();
    }
    // A returning reader must see an inline offer with usable controls,
    // never a fixed 16px floating toast obscuring the article.
    if(width===390){
      const resumed=await ctx.newPage();
      try{
        await resumed.addInitScript(()=>
          localStorage.setItem('gb:imena:atlas:reading-position:v1',
            JSON.stringify({y:3200,at:Date.now()})));
        await resumed.goto(base+'/atlas/',{waitUntil:'domcontentloaded'});
        await resumed.locator('h1').first().waitFor({state:'visible'});
        const card=resumed.locator('[data-resume-reading-inline]');
        await card.waitFor({state:'visible',timeout:10000});
        const witness=await card.evaluate(el=>{
          const box=el.getBoundingClientRect();
          const header=document.querySelector('nav[aria-label]');
          return {position:getComputedStyle(el).position,
            width:box.width,viewport:document.documentElement.clientWidth,
            headerBottom:header?.getBoundingClientRect().bottom??0,
            controls:[...el.querySelectorAll('button')].map(b=>{
              const r=b.getBoundingClientRect();
              return {width:r.width,height:r.height,top:r.top};
            })};
        });
        if(witness.position==='fixed'||witness.width>witness.viewport||
           witness.controls.length!==2||
           witness.controls.some(x=>x.height<44||x.width<44||x.top<witness.headerBottom+2))
          throw Error('Reader resume offer blocks prose or has tiny tap targets '+
            JSON.stringify({engine,width,witness}));
        await card.getByRole('button',{name:'Скрыть предложение продолжить чтение'}).click();
        await card.waitFor({state:'detached'});
        const saved=await resumed.evaluate(()=>
          localStorage.getItem('gb:imena:atlas:reading-position:v1'));
        if(saved!==null)
          throw Error('Dismissed reading position remained persisted');
      }finally{await resumed.close()}
      // Removing an inline recall card must not move the final scroll position.
      const restored=await ctx.newPage();
      try{
        await restored.addInitScript(()=>
          localStorage.setItem('gb:imena:atlas:reading-position:v1',
            JSON.stringify({y:3200,at:Date.now()})));
        await restored.goto(base+'/atlas/',{waitUntil:'domcontentloaded'});
        await restored.locator('h1').first().waitFor({state:'visible'});
        const recall=restored.locator('[data-resume-reading-inline]');
        await recall.waitFor({state:'visible'});
        const firstLabel=await recall.locator('button').first().innerText();
        const percent=Number(firstLabel.match(/(\d+)%/)?.[1]);
        if(!Number.isFinite(percent)||percent<1||percent>99)
          throw Error('Reading recall percent invalid or transient '+JSON.stringify({engine,width,firstLabel,percent}));
        await recall.locator('button').first().click();
        await recall.waitFor({state:'detached'});
        await restored.evaluate(()=>new Promise(done=>
          requestAnimationFrame(()=>requestAnimationFrame(done))));
        const actualY=await restored.evaluate(()=>scrollY);
        if(Math.abs(actualY-3200)>3)
          throw Error('Reading recall layout shifted scroll target '+
            JSON.stringify({engine,width,expectedY:3200,actualY}));
      }finally{await restored.close()}
    }
    // A link copied from the divine-name dossier must reopen that dossier
    // in a clean browser session (not merely scroll behind a closed overlay).
    if(width===390||width===320){
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
      // W71: verify the longer Panorama label in narrow modal at 200% root.
      // Document width alone misses text painted outside the button.
      const counterpartLayout=await direct.evaluate(async()=>{
        const root=document.documentElement, previous=root.style.getPropertyValue('font-size');
        const priority=root.style.getPropertyPriority('font-size');
        root.style.setProperty('font-size','32px');
        await document.fonts.ready;
        await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)));
        const link=document.querySelector('[role="dialog"] a[href^="/imena-boga/#"]');
        const rect=link?.getBoundingClientRect(),range=document.createRange();
        if(link)range.selectNodeContents(link);
        const fragments=link?[...range.getClientRects()]:[];
        const title=link?.querySelector('span');
        const wordNode=title?.firstChild;
        const firstWord=wordNode?.textContent?.trim().split(/\s+/)[0]||'';
        const wordRange=document.createRange();
        if(wordNode?.nodeType===Node.TEXT_NODE&&firstWord)
          wordRange.setStart(wordNode,0),wordRange.setEnd(wordNode,firstWord.length);
        const wordRects=firstWord?[...wordRange.getClientRects()]:[];
        const firstWordSplit=wordRects.length!==1;
        const data={
          found:!!link,text:link?.textContent?.trim(),
          aria:link?.getAttribute('aria-label'),href:link?.getAttribute('href'),
          left:rect?.left,right:rect?.right,
          clientWidth:link?.clientWidth,scrollWidth:link?.scrollWidth,
          firstWord,firstWordSplit,
          fragmentsOutside:!!link&&fragments.some(r=>
            r.left<rect.left-2||r.right>rect.right+2),
          viewport:root.clientWidth,documentWidth:root.scrollWidth,
          rootFont:parseFloat(getComputedStyle(root).fontSize)
        };
        if(previous)root.style.setProperty('font-size',previous,priority);
        else root.style.removeProperty('font-size');
        return data;
      });
      if(!counterpartLayout.found||
         counterpartLayout.text!=='Панорама имён Бога'||
         !counterpartLayout.aria?.includes('в Панораме имён Бога')||
         counterpartLayout.href!=='/imena-boga/#elohim'||
         counterpartLayout.rootFont<31||
         counterpartLayout.left < -2 ||
         counterpartLayout.right>counterpartLayout.viewport+2||
         counterpartLayout.scrollWidth>counterpartLayout.clientWidth+2||
         counterpartLayout.firstWord!=='Панорама'||
         counterpartLayout.firstWordSplit||
         counterpartLayout.fragmentsOutside||
         counterpartLayout.documentWidth>counterpartLayout.viewport+2)
        throw Error('Atlas-to-Panorama 200% dossier link clipped '+
          JSON.stringify({engine,width,counterpartLayout}));
      // W72: CSS visual order must agree with actual keyboard focus order.
      // Prove the painted sequence and exercise real Tab navigation.
      const footerReadingOrder=await direct.evaluate(()=>{
        const footer=document.querySelector('[role="dialog"] [data-modal-footer]');
        if(!footer)return null;
        const items=[...footer.children].filter(n=>n.matches('button,a'));
        const positions=items.map((n,i)=>{const r=n.getBoundingClientRect();return {
          index:i,left:r.left,top:r.top,disabled:n.matches(':disabled'),
          label:n.getAttribute('aria-label')||n.textContent?.trim()||''
        }});
        // Allow subpixel baseline shifts for controls in the same row.
        const spatial=[...positions].sort((a,b)=>
          Math.abs(a.top-b.top)>4?a.top-b.top:a.left-b.left).map(x=>x.index);
        return {count:positions.length,spatial,labels:positions.map(x=>x.label),
          enabled:positions.filter(x=>!x.disabled).map(x=>x.index)};
      });
      if(!footerReadingOrder||footerReadingOrder.count!==4||
         footerReadingOrder.spatial.join(',')!=='0,1,2,3'||
         footerReadingOrder.enabled.join(',')!=='1,2,3'||
         !footerReadingOrder.labels[3].includes('Панораме имён Бога'))
        throw Error('Atlas dossier keyboard/visual order mismatch '+
          JSON.stringify({engine,width,footerReadingOrder}));
      const footer=direct.locator('[role="dialog"] [data-modal-footer]');
      await footer.locator('button').nth(1).focus();
      await direct.keyboard.press('Tab');
      const tabOnArticle=await direct.evaluate(()=>{
        const footer=document.querySelector('[role="dialog"] [data-modal-footer]');
        return document.activeElement===footer?.querySelectorAll('button')[2];
      });
      if(!tabOnArticle)throw Error('Atlas dossier Tab skipped article action '+
        JSON.stringify({engine,width}));
      await direct.keyboard.press('Tab');
      const tabOnPanorama=await direct.evaluate(()=>
        document.activeElement===document.querySelector(
          '[role="dialog"] [data-modal-footer] a[href^="/imena-boga/#"]'));
      if(!tabOnPanorama)throw Error('Atlas dossier Tab skipped Panorama action '+
        JSON.stringify({engine,width}));
      // W74: ensure the first, middle and last dossier all have a matching
      // spatial/DOM/Tab order at normal and 200%-root text sizes.
      for(const entryCase of [
        {id:'elohim',count:4,enabled:[1,2,3]},
        {id:'yhwh',count:4,enabled:[0,1,2,3]},
        {id:'alpha-omega-pantokrator',count:3,enabled:[0,2]},
      ]){
        if(entryCase.id!=='elohim'){
          await direct.goto(base+'/atlas/#name-'+entryCase.id,{waitUntil:'domcontentloaded'});
          await direct.reload({waitUntil:'domcontentloaded'});
          await dossier.waitFor({state:'visible',timeout:20000});
        }
        for(const rootPx of [16,32]){
          await direct.evaluate(px=>document.documentElement.style.setProperty('font-size',px+'px'),rootPx);
          await direct.evaluate(async()=>{
            await document.fonts.ready;
            await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)));
          });
          const layout=await direct.evaluate(()=>{
            const root=document.documentElement,container=
              document.querySelector('[role="dialog"] [data-modal-footer]');
            const dialog=document.querySelector('[role="dialog"] > div');
            const header=dialog?.querySelector('[data-modal-header]');
            const badge=header?.querySelector('[data-modal-position]');
            const tools=header?.querySelector('[data-modal-header-tools]');
            const db=dialog?.getBoundingClientRect();
            const headerRects=[...(header?.querySelectorAll('button')||[])].map((node,i)=>{
              const r=node.getBoundingClientRect();
              return {i,left:r.left,right:r.right,top:r.top,bottom:r.bottom,
                height:r.height,width:r.width};
            });
            const clippedHeaderTargets=headerRects.filter(r=>
              !db||r.left<db.left-2||r.right>db.right+2||r.width<43||r.height<43);
            const overlappingHeaderTargets=[];
            for(let i=0;i<headerRects.length;i++)for(let j=i+1;j<headerRects.length;j++){
              const a=headerRects[i],b=headerRects[j];
              if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&
                 Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2)
                overlappingHeaderTargets.push([i,j]);
            }
            const bb=badge?.getBoundingClientRect();
            const fragments=badge?[...badge.querySelectorAll('span')].flatMap(node=>{
              const range=document.createRange();range.selectNodeContents(node);
              return [...range.getClientRects()];
            }):[];
            const tr=tools?.getBoundingClientRect();
            const toolTops=[...(tools?.querySelectorAll('button')||[])]
              .map(node=>node.getBoundingClientRect().top);
            const toolRows=toolTops.length?
              1+toolTops.slice(1).filter(top=>Math.abs(top-toolTops[0])>4).length:0;
            const headerEvidence={found:!!(dialog&&header&&badge&&tools),
              toolRows,
              targets:headerRects.length,clippedHeaderTargets,overlappingHeaderTargets,
              label:badge?.textContent?.trim(),
              badgeClipped:!bb||!db||bb.left<db.left-2||bb.right>db.right+2||
                fragments.some(r=>r.left<bb.left-2||r.right>bb.right+2),
              toolsClipped:!tr||!db||tr.left<db.left-2||tr.right>db.right+2};
            const nodes=[...(container?.children||[])].filter(n=>n.matches('button,a'));
            const rects=nodes.map((n,i)=>{const r=n.getBoundingClientRect();
              return {i,top:r.top,left:r.left,right:r.right,height:r.height,disabled:n.matches(':disabled')};
            });
            const visual=[...rects].sort((a,b)=>
              Math.abs(a.top-b.top)>4?a.top-b.top:a.left-b.left).map(r=>r.i);
            return {count:nodes.length,visual,enabled:rects.filter(r=>!r.disabled).map(r=>r.i),
              headerEvidence,
              rootPx:parseFloat(getComputedStyle(root).fontSize),viewport:root.clientWidth,
              documentWidth:root.scrollWidth,
              tooSmall:rects.filter(r=>r.height<43),
              outside:rects.filter(r=>r.left< -2||r.right>root.clientWidth+2)};
          });
          if(layout.count!==entryCase.count||
             layout.visual.join(',')!==Array.from({length:entryCase.count},(_,i)=>i).join(',')||
             layout.enabled.join(',')!==entryCase.enabled.join(',')||
             Math.abs(layout.rootPx-rootPx)>1||layout.tooSmall.length||
             layout.outside.length||layout.documentWidth>layout.viewport+2||
             !layout.headerEvidence.found||layout.headerEvidence.targets<3||
             layout.headerEvidence.clippedHeaderTargets.length||
             layout.headerEvidence.overlappingHeaderTargets.length||
             layout.headerEvidence.badgeClipped||layout.headerEvidence.toolsClipped||
             layout.headerEvidence.toolRows!==1||
             !layout.headerEvidence.label?.includes('/36'))
            throw Error('Atlas W76 modal header/footer geometry failed '+
              JSON.stringify({engine,width,entryCase,rootPx,layout}));
          for(let i=0;i<entryCase.enabled.length-1;i++){
            const from=entryCase.enabled[i],to=entryCase.enabled[i+1];
            await footer.locator('button,a').nth(from).focus();
            await direct.keyboard.press('Tab');
            const active=await direct.evaluate(()=>{
              const f=document.querySelector('[role="dialog"] [data-modal-footer]');
              return [...(f?.children||[])].indexOf(document.activeElement);
            });
            if(active!==to)
              throw Error('Atlas W74 Tab focus failed '+
                JSON.stringify({engine,width,id:entryCase.id,rootPx,from,to,active}));
          }
        }
      }
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
    // A single Constellation search hit should be centered, readable and
    // bounded by the content measure at mobile and desktop widths.
    const oneResultInput=page.locator('#sozvezdie input[type="search"]');
    await oneResultInput.fill('эхье');
    const centeredResult=await page.locator('#sozvezdie [data-name-result-grid][data-single-result="true"]')
      .evaluate(grid=>{
        const hit=grid.querySelector('button[aria-label^="Перейти к разделу:"]');
        if(!hit)return null;
        const gr=grid.getBoundingClientRect(),hr=hit.getBoundingClientRect();
        return {count:grid.querySelectorAll('button[aria-label^="Перейти к разделу:"]').length,
          delta:Math.abs((gr.left+gr.width/2)-(hr.left+hr.width/2)),
          width:hr.width,within:hr.left>=gr.left-1&&hr.right<=gr.right+1};
      });
    if(!centeredResult||centeredResult.count!==1||centeredResult.delta>2||
       centeredResult.width>322||!centeredResult.within)
      throw Error('Constellation single search result not centered '+JSON.stringify({engine,width,centeredResult}));
    await oneResultInput.fill('');
    // The prominent divine name is Hebrew, not a Russian/Latin token.
    // Keep correct reading direction and language metadata for assistive tech.
    const heroName=await page.locator('[data-hero-divine-name]').evaluate(el=>({
      text:el.textContent?.trim(),lang:el.getAttribute('lang'),dir:el.getAttribute('dir')
    }));
    if(heroName.text!=='יהוה'||heroName.lang!=='he'||heroName.dir!=='rtl')
      throw Error('Constellation YHWH language/direction contract failed '+
        JSON.stringify({engine,width,heroName}));
    await page.locator('canvas').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const painted=await countPixels(page,'canvas');
    if(!(painted>0))throw Error('Constellation static starfield blank '+width);
    if(width===1440){
      // In-app motion=off must also control hero scroll navigation when
      // the operating system itself has NO reduced-motion preference.
      // Exercise both settings, not only the existing OS-reduce context.
      for(const enabled of [false,true]){
        const motionCtx=await browser.newContext({viewport:{width:1440,height:844},
          locale:'ru-RU',reducedMotion:'no-preference'});
        try{
          await motionCtx.addInitScript(({enabled})=>{
            localStorage.setItem('gb-imena-prefs-v1',
              JSON.stringify({font:'md',measure:'narrow',motion:enabled}));
          },{enabled});
          const motionPage=await motionCtx.newPage();
          if(process.env.FONTS_MODE==='offline')
            await motionPage.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
          await motionPage.goto(base+'/sozvezdie/',{waitUntil:'domcontentloaded'});
          await motionPage.locator('[data-motion]').waitFor({state:'visible'});
          await motionPage.waitForFunction(enabled=>
            document.querySelector('[data-motion]')?.getAttribute('data-motion')===(enabled?'on':'off'),
            enabled,{timeout:5000});
          await motionPage.evaluate(()=>{
            window.__heroScrollWitness=[];
            const original=Element.prototype.scrollIntoView;
            Element.prototype.scrollIntoView=function(options){
              if(this.id==='intro')window.__heroScrollWitness.push(options?.behavior);
              return original.call(this,options);
            };
          });
          await motionPage.getByRole('button',{name:'Перейти к введению'}).click();
          const behavior=await motionPage.evaluate(()=>window.__heroScrollWitness);
          const expected=enabled?'smooth':'instant';
          if(behavior.length!==1||behavior[0]!==expected)
            throw Error('Constellation hero ignores in-app motion setting '+
              JSON.stringify({engine,width,enabled,behavior,expected}));
          // The global search shortcut must use the same in-app motion state,
          // even with OS reduced-motion disabled. Search highlights must also
          // preserve Cyrillic accent marks without capturing adjacent spaces.
          await motionPage.evaluate(()=>{
            window.__gridScrollWitness=[];
            const native=Element.prototype.scrollIntoView;
            Element.prototype.scrollIntoView=function(options){
              if(this.id==='sozvezdie')window.__gridScrollWitness.push(options?.behavior);
              return native.call(this,options);
            };
            if(document.activeElement instanceof HTMLElement)document.activeElement.blur();
          });
          await motionPage.keyboard.press('/');
          const search=motionPage.locator('#sozvezdie input[type="search"]');
          const searchWitness=await motionPage.evaluate(()=>({
            scroll:window.__gridScrollWitness,
            focused:document.activeElement?.matches('#sozvezdie input[type="search"]')
          }));
          if(searchWitness.scroll.length!==1||searchWitness.scroll[0]!==expected||
             !searchWitness.focused)
            throw Error('Constellation search shortcut ignores in-app motion '+
              JSON.stringify({engine,width,enabled,expected,searchWitness}));
          await search.fill('эхье');
          const marks=await motionPage.getByRole('button',{name:/Перейти к разделу: Эхье/})
            .locator('mark').allTextContents();
          if(marks.length!==2||marks.some(value=>value!=='Эхье́'))
            throw Error('Constellation accent highlights captured whitespace or lost marks '+
              JSON.stringify({engine,width,enabled,marks}));
          // The verse-card tilt must obey the in-app toggle independently of
          // OS preferences and reset immediately when OS reduce activates.
          const verseTilt=motionPage.locator('#yhwh [data-reader-tilt]').first();
          await verseTilt.scrollIntoViewIfNeeded();
          // As with the letter card below, wait for Framer's reveal to settle
          // before hovering. During its translating/fading entrance, a mouse
          // can leave the moving element and reset its tilt even though the
          // component correctly handles pointer movement.
          await verseTilt.evaluate(async el=>{
            await new Promise((resolve,reject)=>{
              const start=performance.now();
              const poll=()=>{
                const wrapper=el.parentElement;
                const style=wrapper&&getComputedStyle(wrapper);
                if(style?.transform==='none'&&Number(style.opacity)>0.999){resolve();return}
                if(performance.now()-start>5000){reject(Error('Verse reveal did not settle'));return}
                requestAnimationFrame(poll);
              };
              poll();
            });
          });
          await verseTilt.hover({position:{x:22,y:24}});
          const neutral='perspective(900px) rotateX(0deg) rotateY(0deg)';
          if(enabled){
            await motionPage.waitForFunction(neutral=>
              document.querySelector('#yhwh [data-reader-tilt]')?.style.transform!==neutral,
              neutral,{timeout:5000});
          }else{
            const disabledTilt=await verseTilt.evaluate(el=>el.style.transform);
            if(disabledTilt!==neutral)
              throw Error('Constellation in-app motion-off left active 3D card tilt '+
                JSON.stringify({engine,width,disabledTilt}));
          }
          const letterTilt=motionPage.locator('#tetragrammaton [data-reader-tilt]').first();
          await letterTilt.scrollIntoViewIfNeeded();
          // The containing Framer reveal translates and fades the card into view.
          // Hovering while that reveal moves can trigger pointerleave, resetting
          // the tilt before assertion. Wait for real entrance completion, not a
          // fixed delay or a relaxed motion assertion.
          await letterTilt.evaluate(async el=>{
            await new Promise((resolve,reject)=>{
              const start=performance.now();
              const poll=()=>{
                const wrapper=el.parentElement;
                const style=wrapper&&getComputedStyle(wrapper);
                if(style?.transform==='none'&&Number(style.opacity)>0.999){resolve();return}
                if(performance.now()-start>5000){reject(Error('Letter reveal did not settle'));return}
                requestAnimationFrame(poll);
              };
              poll();
            });
          });
          await letterTilt.hover({position:{x:22,y:24}});
          if(enabled){
            await motionPage.waitForFunction(neutral=>
              document.querySelector('#tetragrammaton [data-reader-tilt]')?.style.transform!==neutral,
              neutral,{timeout:5000});
          }else{
            const disabledLetter=await letterTilt.evaluate(el=>el.style.transform);
            if(disabledLetter!==neutral)
              throw Error('Constellation in-app motion-off left letter-card tilt active '+
                JSON.stringify({engine,width,disabledLetter}));
          }
          await motionPage.emulateMedia({reducedMotion:'reduce'});
          await motionPage.waitForFunction(neutral=>
            [...document.querySelectorAll('#yhwh [data-reader-tilt]')]
              .every(el=>el.style.transform===neutral),
            neutral,{timeout:5000});
          const reducedTransitions=await Promise.all([verseTilt,letterTilt].map(tilt=>tilt.evaluate(el=>{
            const css=getComputedStyle(el);
            return {property:css.transitionProperty,duration:css.transitionDuration};
          })));
          const seconds=token=>{
            const value=token.trim();
            return value.endsWith('ms')?Number(value.slice(0,-2))/1000:
              value.endsWith('s')?Number(value.slice(0,-1)):NaN;
          };
          for(const reducedTransition of reducedTransitions){
            const durations=reducedTransition.duration.split(',').map(seconds);
            // Property 'none' has no active transition regardless of the
            // serialized duration; browsers may also emit 1e-06s for zero.
            if(reducedTransition.property!=='none'&&
               durations.some(t=>!Number.isFinite(t)||t>0.001))
              throw Error('Constellation reduced-motion left a perceivable card transition '+
                JSON.stringify({engine,width,reducedTransition,durations}));
          }
        }finally{
          await motionCtx.close();
        }
      }
      // OS reduced-motion must disable *all* decorative hero motion, even if
      // the in-page motion preference is enabled. React pointer events used
      // to keep the 3D tilt/glow alive despite this browser preference.
      const reducedHero=await page.evaluate(()=>{
        const tilt=document.querySelector('[data-hero-tilt]');
        const glow=document.querySelector('[data-hero-glow]');
        const section=tilt?.closest('section');
        if(!tilt||!glow||!section)return {error:'missing reduced-motion hero witnesses'};
        const read=()=>({
          tilt:getComputedStyle(tilt).transform,
          glow:getComputedStyle(glow).transform,
          pulse:section.querySelectorAll('.animate-glow-pulse').length,
          rings:section.querySelectorAll('.animate-rotate-slow,.animate-rotate-rev').length,
        });
        const before=read(),bounds=section.getBoundingClientRect();
        section.dispatchEvent(new PointerEvent('pointermove',{
          bubbles:true,pointerType:'mouse',
          clientX:bounds.left+bounds.width*.85,
          clientY:bounds.top+bounds.height*.2
        }));
        return {before,prefersReduce:matchMedia('(prefers-reduced-motion: reduce)').matches};
      });
      await page.waitForTimeout(240);
      const reducedAfter=await page.evaluate(()=>{
        const tilt=document.querySelector('[data-hero-tilt]');
        const glow=document.querySelector('[data-hero-glow]');
        const section=tilt?.closest('section');
        return {tilt:getComputedStyle(tilt).transform,
          glow:getComputedStyle(glow).transform,
          pulse:section.querySelectorAll('.animate-glow-pulse').length,
          rings:section.querySelectorAll('.animate-rotate-slow,.animate-rotate-rev').length};
      });
      if(reducedHero.error||!reducedHero.prefersReduce||
         JSON.stringify(reducedHero.before)!==JSON.stringify(reducedAfter)||
         reducedAfter.pulse!==0||reducedAfter.rings!==0)
        throw Error('Constellation disregards reduced-motion for tilt/glow/rings '+
          JSON.stringify({engine,width,reducedHero,reducedAfter}));
    }
    results.push({name,width,painted,cssLoaded:true});
   }
   await ctx.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
 console.log(JSON.stringify({engine,status:'PASS',scenarios:results.length,results},null,2));
})().catch(e=>{console.error(e.stack);server.close();process.exitCode=1});
