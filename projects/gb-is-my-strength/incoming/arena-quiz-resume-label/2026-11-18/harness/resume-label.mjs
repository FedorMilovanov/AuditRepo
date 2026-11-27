// Audit actual ReaderState and homepage CTA on the untouched dist. Only a
// separately labelled contrast diagnostic temporarily sets one inline color.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node resume-label.mjs PRODUCT FRESH_OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const ROUTE = '/articles/dzhon-gill-chast-2-uchenyi/', KEY = ROUTE.slice(0, -1);
const STORAGE = 'gb:reader-state:v1:gb-strength:' + KEY;
const TARGET = 'sec-canticles', CTA = '#resumeReadingLink', CARD = '#resumeReadingBlock';
const cases = [[390,false],[1440,false],[390,true]].flatMap(([width,touch]) => ['light','dark'].flatMap(theme =>
  (touch ? ['learning'] : ['learning','reading']).map(pathway => ({ id: `${pathway}-${width}-${theme}-${touch ? 'touch' : 'pointer'}`,
    pathway, theme, touch, viewport: { width, height: width === 390 ? 844 : 900 } })))).filter(({id}) => !only || id.includes(only));
assert.ok(cases.length);
fs.mkdirSync(out, { recursive: true });
assert.ok(!fs.existsSync(path.join(out, 'resume-label-witness.json')), 'use fresh output');
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const saved = p => p.evaluate(key => {
  const r = JSON.parse(localStorage.getItem(key) ?? 'null');
  return r && { sectionId:r.sectionId, scrollY:r.scrollY, progress:r.progress, source:r.source };
}, STORAGE);
const visibleHeading = (p, heading) => p.evaluate(id => {
  const node = document.getElementById(id), b = node.getBoundingClientRect();
  const inView = b.top >= 0 && b.bottom <= innerHeight && b.height > 0;
  return { top:Math.round(b.top), hit:inView && node.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)),
    y:Math.round(scrollY), active:document.activeElement === node };
}, heading);

async function reachLearningSource(p, act) {
  await act(p.locator(await p.locator('#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn'));
  await act(p.locator('#mobLearningBtn'));
  await act(p.locator('#tabQuiz'));
  const deck = JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for (let i=0; i<deck.length; i++) {
    const prompt = norm(await p.locator('#glsQuizQuestion').innerText());
    const item = deck.find(q => norm(q.question) === prompt);
    assert.ok(item, 'visible prompt must be in authored deck');
    await act(p.locator('#glsQuizConfRow [data-conf="sure"]'));
    await act(p.locator('#glsQuizOptions').getByRole('button', {name:item.answers[(item.correctIndex+1)%item.answers.length],exact:true}));
    const verdict = p.locator('#glsQuizVerdict:not([hidden])');
    await verdict.waitFor();
    if (item.id === 'gill.scholar.canticles') {
      const before = norm(await verdict.innerText());
      assert.match(before,/^Неверно/u);
      const link = p.locator('#glsQuizSource');
      const href = await link.getAttribute('href');
      assert.ok(href.endsWith(`#${TARGET}`));
      await Promise.all([p.waitForURL(u => u.pathname===ROUTE && u.hash===`#${TARGET}`), act(link)]);
      assert.equal(norm(await verdict.textContent()),before);
      return { prompt, href, retained:true };
    }
    await act(p.locator('#glsQuizNext'));
  }
  throw new Error('target never appeared in render');
}

// Freeze no animations; wait for the real color/background transitions and fonts.
async function stable(link) {
  await link.evaluate(async (el) => {
    await document.fonts.ready;
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    await frame();
    await Promise.all(el.getAnimations().filter(a => a.effect?.getTiming()?.iterations === 1).map(a => a.finished.catch(() => {})));
    await frame();
  });
}
function luminance(s) {
  assert.match(s,/^rgb\(\d+, \d+, \d+\)$/u, 'expected opaque sRGB for exact contrast');
  const f = s.match(/\d+/gu).map(n => Number(n)/255).map(v => v <= 0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4);
  return f[0]*0.2126 + f[1]*0.7152 + f[2]*0.0722;
}
function ratio(a,b) {
  const x = luminance(a), y = luminance(b);
  return Math.round(10000*(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05))/10000;
}
async function appearance(link, requireHit = true) {
  await stable(link);
  const v = await link.evaluate(el => {
    const s = getComputedStyle(el), box = el.getBoundingClientRect();
    const full = box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight && box.height > 0;
    const hitNode = document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);
    const hit = !!(hitNode && el.contains(hitNode));
    const hitReceiver = hitNode?.id || hitNode?.localName || null;
    const compositing = [];
    for (let e=el; e; e=e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.opacity !== '1' || cs.filter !== 'none' || cs.mixBlendMode !== 'normal') compositing.push(e.localName);
    }
    return { color:s.color, textFill:s.webkitTextFillColor, background:s.backgroundColor, backgroundImage:s.backgroundImage,
      textShadow:s.textShadow, fontSize:s.fontSize, fontWeight:s.fontWeight, visibility:s.visibility, compositing,
      accent:getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim(),
      dark:document.documentElement.classList.contains('dark'), hovered:el.matches(':hover'), focusVisible:el.matches(':focus-visible'),
      focused:document.activeElement===el, full, hit, hitReceiver, box:[box.x,box.y,box.width,box.height].map(n => Math.round(n*100)/100),
      href:el.getAttribute('href'), label:el.innerText.trim() };
  });
  assert.equal(v.color,v.textFill);
  assert.equal(v.backgroundImage,'none');
  assert.equal(v.textShadow,'none');
  assert.equal(v.visibility,'visible');
  assert.deepEqual(v.compositing,[]);
  assert.ok(v.label==='Продолжить' && (!requireHit || (v.full && v.hit)), JSON.stringify(v));
  return { ...v, ratio:ratio(v.textFill,v.background), whiteOnFill:ratio('rgb(255, 255, 255)',v.background) };
}
async function readCascade(context, p) {
  const cdp = await context.newCDPSession(p), sheets = new Map();
  try {
    await cdp.send('DOM.enable');
    cdp.on('CSS.styleSheetAdded',({header}) => sheets.set(header.styleSheetId,header));
    await cdp.send('CSS.enable');
    const {root} = await cdp.send('DOM.getDocument');
    const {nodeId} = await cdp.send('DOM.querySelector', {nodeId:root.nodeId,selector:CTA});
    const {matchedCSSRules} = await cdp.send('CSS.getMatchedStylesForNode', {nodeId});
    return matchedCSSRules.filter(r => r.rule.origin==='regular').flatMap(({rule,matchingSelectors}) => {
      const properties = rule.style.cssProperties.filter(x => x.parsedOk!==false && !x.disabled && !x.implicit && x.range
          && ['color','background','background-color','-webkit-text-fill-color'].includes(x.name))
        .map(x => ({ name:x.name, value:x.value, important:!!x.important }));
      const sheet = sheets.get(rule.styleSheetId);
      return properties.length && sheet?.sourceURL ? [{ file:new URL(sheet.sourceURL).pathname, line:rule.selectorList.selectors[0]?.range?.startLine+1,
        selectors:matchingSelectors.map(i => rule.selectorList.selectors[i].text), properties }] : [];
    });
  } finally { await cdp.detach(); }
}
async function colorProbe(link, before, card, shot) {
  const foreground = before.whiteOnFill >= 4.5 ? '#fff' : '#000';
  const inline = await link.getAttribute('style');
  let after;
  try {
    await link.evaluate((el,val) => el.style.setProperty('color',val,'important'), foreground);
    after = await appearance(link);
    for (const k of ['background','box','href','label','hovered','focused','accent','fontSize','fontWeight']) assert.deepEqual(before[k],after[k],k);
    assert.ok(after.ratio >= 4.5);
    if (shot) await card.screenshot({path:path.join(out,shot)});
  } finally {
    await link.evaluate((el,val) => val===null ? el.removeAttribute('style') : el.setAttribute('style',val), inline);
  }
  assert.deepEqual(await appearance(link),before,'one-property experiment must be fully reverted');
  return { property:'color', value:foreground, important:true, after, reverted:true };
}
async function exercise(p, context, base, row) {
  const act = locator => row.touch ? locator.tap() : locator.click();
  const link = p.getByRole('link',{name:'Продолжить',exact:true}).and(p.locator(CTA));
  const card = p.locator(`${CARD} .resume-reading-card`);
  assert.equal((await p.goto(base+'/',{waitUntil:'load'})).status(),200);
  assert.equal(await p.locator(CARD).getAttribute('hidden'),'');
  assert.equal(await p.locator(CTA).getAttribute('href'),null);
  assert.equal(await saved(p),null);
  row.freshCardHidden = true;
  assert.equal((await p.goto(base+ROUTE,{waitUntil:'load'})).status(),200);
  const firstDoc = await p.evaluate(() => performance.timeOrigin);
  await p.evaluate(() => document.fonts.ready.then(() => true));
  if (row.pathway === 'learning') row.quiz = await reachLearningSource(p,act);
  else {
    const heading = p.locator(`#${TARGET}`), y = await heading.evaluate(el => el.getBoundingClientRect().top);
    await p.mouse.move(row.viewport.width/2,330);
    await p.mouse.wheel(0,Math.round(y-175));
    await p.waitForFunction(id => document.getElementById(id)?.getBoundingClientRect().top < 250, TARGET);
    assert.ok(await p.locator('#quizLaunch').isVisible());
    assert.equal(await p.locator('#quizPlaceholder .quiz-option').count(),0);
    assert.equal(await p.locator('#gillLearningOverlay.is-open').count(),0);
  }
  await p.waitForFunction(id => {
    const b = document.getElementById(id).getBoundingClientRect();
    return b.top >= 0 && b.bottom <= innerHeight && document.getElementById(id).contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2));
  },TARGET);
  await stable(p.locator(`#${TARGET}`));
  row.source = await visibleHeading(p,TARGET);
  assert.ok(row.source.hit && row.source.y>500 && (row.pathway!=='learning' || row.source.active));
  assert.equal(await p.evaluate(() => performance.timeOrigin),firstDoc);
  assert.equal((await p.goto(base+'/',{waitUntil:'load'})).status(),200);
  const homeDoc = await p.evaluate(() => performance.timeOrigin);
  assert.notEqual(homeDoc,firstDoc);
  row.saved = await saved(p);
  assert.ok(row.saved?.sectionId && row.saved.source==='reader-state-v1' && row.saved.scrollY === row.source.y);
  await link.waitFor();
  if (!row.touch) await p.mouse.move(2,2);
  await link.scrollIntoViewIfNeeded();
  row.ax = (await link.ariaSnapshot()).trim();
  assert.match(row.ax,/^- link "Продолжить":/u);
  row.rest = await appearance(link);
  assert.ok(!row.rest.hovered && !row.rest.focusVisible && row.rest.dark===(row.theme==='dark'));
  assert.equal(row.rest.href,`${KEY}#${row.saved.sectionId}`);
  row.restCascade = await readCascade(context,p);
  const shot = row.id === 'learning-390-light-pointer' || row.id === 'learning-390-dark-pointer';
  if (shot) await card.screenshot({path:path.join(out,`home-resume-${row.theme}-rest.png`)});
  if (row.rest.ratio < 4.5) row.restProbe = await colorProbe(link,row.rest,card,shot ? 'home-resume-dark-color-probe.png' : null);
  if (row.touch) {
    await Promise.all([p.waitForURL(base+row.rest.href,{waitUntil:'load'}),link.tap()]);
    row.action = 'tap';
  } else {
    await link.hover();
    row.hover = await appearance(link);
    assert.ok(row.hover.hovered && !row.hover.focused);
    row.hoverCascade = await readCascade(context,p);
    if (shot && row.theme==='light') await card.screenshot({path:path.join(out,'home-resume-light-hover.png')});
    if (row.hover.ratio < 4.5) row.hoverProbe = await colorProbe(link,row.hover,card,null);
    await p.mouse.move(2,2);
    for (let i=1; i<=80; i++) {
      await p.keyboard.press('Tab');
      if (await link.evaluate(e => e===document.activeElement)) { row.tabSteps=i; break; }
    }
    assert.ok(row.tabSteps,'known visible link must be keyboard reachable');
    // Contrast is independent of the browser's automatic focus scroll/clipping.
    row.keyboard = await appearance(link,false);
    assert.ok(row.keyboard.focusVisible && row.keyboard.focused && !row.keyboard.hovered);
    await Promise.all([p.waitForURL(base+row.rest.href,{waitUntil:'load'}),p.keyboard.press('Enter')]);
    row.action = 'Enter';
  }
  const homeDeparture = await p.evaluate(() => ({url:location.pathname+location.hash,target:document.querySelector(':target')?.id,nav:performance.getEntriesByType('navigation')[0]?.type,doc:performance.timeOrigin}));
  assert.equal(homeDeparture.url,row.rest.href);
  assert.equal(homeDeparture.target,row.saved.sectionId);
  assert.ok(homeDeparture.doc!==firstDoc && homeDeparture.doc!==homeDoc && homeDeparture.nav==='navigate');
  row.returned = { url:homeDeparture.url, target:homeDeparture.target, nav:homeDeparture.nav };
  assert.deepEqual(row.responses,[ '/',ROUTE,'/',KEY ].map(path => ({path,status:200})));
}

const {server,base} = await serve();
const assets = new Set(), results = [];
let browser;
try {
  browser = await chromium.launch({executablePath,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  for (const spec of cases) {
    const row = {...spec,responses:[],errors:[]}; results.push(row);
    const ctx=await browser.newContext({viewport:row.viewport,hasTouch:row.touch,isMobile:row.touch,colorScheme:row.theme,reducedMotion:'reduce',serviceWorkers:'block'});
    ctx.setDefaultTimeout(8500);
    try {
      await ctx.route('**/*',route => new URL(route.request().url()).origin===base ? route.continue() : route.abort());
      ctx.on('weberror', e => row.errors.push(['pageerror',e.error().message.replaceAll(base,'LOCAL')]));
      ctx.on('requestfailed', r => {
        const u=new URL(r.url()), reason=r.failure()?.errorText;
        if (u.origin===base && reason!=='net::ERR_ABORTED') row.errors.push(['request',u.pathname,reason]);
      });
      ctx.on('response', r => {
        const u=new URL(r.url()); if (u.origin!==base) return;
        const type=r.request().resourceType(), status=r.status();
        if (type==='document') row.responses.push({path:u.pathname,status});
        if (status>=400) row.errors.push(['http',u.pathname,status]);
        if (r.ok() && ['document','script','stylesheet','font'].includes(type)) {
          let rel=u.pathname.slice(1).replace(/\/*$/u,'');
          if (type==='document' && !rel.endsWith('.html')) rel=rel ? rel+'/index.html' : 'index.html';
          assets.add(rel);
        }
      });
      await exercise(await ctx.newPage(),ctx,base,row);
      assert.equal(ctx.pages().length,1);
      assert.deepEqual(row.errors,[]);
      row.ok=true;
      console.log('OK',row.id,`rest=${row.rest.ratio} hover=${row.hover?.ratio??'-'} focus=${row.keyboard?.ratio??'-'} href=${row.rest.href}`);
    } catch(e) {row.ok=false;row.error=e.stack?.replaceAll(base,'LOCAL')??String(e);console.error('FAIL',row.id,row.error);}
    finally {await ctx.close();}
  }
  const sha=f => createHash('sha256').update(fs.readFileSync(path.join(product,'dist',f))).digest('hex');
  const data={anchor,chromium:browser.version(),playwright:req('playwright/package.json').version,node:process.versions.node,
    method:'Fresh native UI writes. Rest, real hover, Tab/Enter or touch tap; CSS CDP read only. Inline foreground-only diagnostic reverted.',
    distSha256:Object.fromEntries([...assets].sort().map(f=>[f,sha(f)])),results};
  fs.writeFileSync(path.join(out,'resume-label-witness.json'),JSON.stringify(data,null,2)+'\n');
  console.log(`${results.filter(x=>x.ok).length}/${results.length} measured, ${assets.size} dist pins`);
  if (results.some(x=>!x.ok)) process.exitCode=1;
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
