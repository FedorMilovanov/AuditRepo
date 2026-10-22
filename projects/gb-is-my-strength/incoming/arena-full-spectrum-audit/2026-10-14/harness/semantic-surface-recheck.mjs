// Current-main capture, not Product PASS. Copy into browser workspace; split WIDTH/SCHEME.
import { chromium } from 'playwright-core';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
const BASE = process.env.BASE || 'http://127.0.0.1:8099', DIST = process.env.DIST || '/home/user/gbs-src/dist';
const OUT = process.env.OUT || './out', width = Number(process.env.WIDTH || 1440), scheme = process.env.SCHEME || 'light';
const htmls = readdirSync(DIST, { recursive: true }).filter(p => p.endsWith('index.html'))
  .map(p => ({ route: '/' + p.slice(0, -10), root: parse(readFileSync(`${DIST}/${p}`, 'utf8')) }));
const noteRoutes = htmls.filter(p => p.root.querySelector('.fn-marker[data-note-id]')).map(p => p.route);
const brefRoutes = htmls.filter(p => p.root.querySelector('.bref[data-ref]')).map(p => p.route);
if (noteRoutes.length !== 5 || brefRoutes.length !== 10) throw new Error('Population changed; inspect rather than skip');
const axe = readFileSync('./axe.min.js', 'utf8'), rows = [];
const hash = s => createHash('sha256').update(s).digest('hex');
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
  isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1,
  serviceWorkers: 'block', reducedMotion: 'reduce', colorScheme: scheme, locale: 'ru-RU' });
await context.addInitScript(() => {
  window.__perf = { lcp: 0, cls: 0 };
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__perf.lcp = Math.max(window.__perf.lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
});
async function ready(route, tooltip = true) {
  const p = await context.newPage(); p.setDefaultTimeout(8000);
  p.__errors = []; p.__console = {};
  p.on('pageerror', e => p.__errors.push(e.message));
  p.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text(), url = m.location().url || '';
    const k = t.includes('Content Security Policy') && t.includes('https://gospod-bog.ru/') ? 'pinned-asset-csp'
      : url.startsWith('https://mc.yandex.ru/') ? 'sandbox-metrika' : 'other';
    p.__console[k] = (p.__console[k] || 0) + 1; if (k === 'other') p.__errors.push(t);
  });
  await p.goto(BASE + route, { waitUntil: 'load' });
  await p.waitForFunction(() => window.GBReaderPreferences?.version === 1);
  await p.evaluate(theme => window.GBReaderPreferences.set({ theme }), scheme);
  if (tooltip) await p.waitForFunction(() => window.GBArticleTooltips?.version === 20);
  await p.evaluate(async () => { await window.__gbGlossaryRuntime?.promise; await document.fonts.ready; });
  await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  return p;
}
async function health(p) {
  return { ...(await p.evaluate(() => ({ fonts: document.fonts.status, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    lcpMs: window.__perf.lcp || null, cls: window.__perf.cls }))), consoleKinds: { ...p.__console }, errors: [...p.__errors] };
}
async function rules(p, selector) {
  return p.evaluate(async s => Object.fromEntries((await window.axe.run({ include: [[s]] },
    { runOnly: ['nested-interactive', 'label-content-name-mismatch'] })).violations.map(v => [v.id, v.nodes.length])), selector);
}
async function ax(p) {
  const cdp = await context.newCDPSession(p), { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-recheck-target]' });
  const { node } = await cdp.send('DOM.describeNode', { nodeId });
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { backendNodeId: node.backendNodeId, fetchRelatives: false });
  await cdp.detach(); const n = nodes[0], description = n.description?.value || '', name = n.name?.value || '';
  return { role: n.role?.value, name, descriptionLength: description.length, descriptionHash: hash(description), ignored: n.ignored };
}
async function popup(p, target, mode, id, associationAB = false) {
  await target.evaluate(e => e.setAttribute('data-recheck-target', '1'));
  await target.scrollIntoViewIfNeeded();
  if (mode === 'focus') await target.focus(); else if (width === 390) await target.tap(); else await target.click();
  await p.waitForFunction(() => !!document.querySelector('body>.gb-floating-tip.is-open'));
  await p.evaluate(() => document.fonts.ready);
  const dom = await target.evaluate(e => { const t = document.querySelector('body>.gb-floating-tip.is-open');
    const described = e.getAttribute('aria-describedby'), controls = e.getAttribute('aria-controls');
    return { expanded: e.getAttribute('aria-expanded'), descriptionRef: !!described,
      descriptionTarget: !!described && described.split(/\s+/).every(id => document.getElementById(id)), controlsTip: !!controls && controls === t?.id,
      tipRole: t?.getAttribute('role'), tipHasId: !!t?.id, textLength: t?.innerText.length,
      placeholder: !!t?.innerText.includes('Ссылка на указанное место Священного Писания.'),
      focus: document.activeElement === e ? 'trigger' : t?.contains(document.activeElement) ? 'tip' : document.activeElement.tagName,
      nestedLinks: e.querySelectorAll('a,button,[tabindex]').length }; });
  const native = await ax(p);
  if (associationAB) {
    const previous = await target.evaluate(e => { const t = document.querySelector('body>.gb-floating-tip.is-open'), old = { id: t.getAttribute('id'), describedby: e.getAttribute('aria-describedby') };
      if (!t.id) t.id = 'recheck-definition-tip'; e.setAttribute('aria-describedby', t.id); return old; });
    const associated = await ax(p);
    await target.evaluate((e, old) => { const t = document.querySelector('body>.gb-floating-tip.is-open'); if (old.id === null) t.removeAttribute('id'); else t.id = old.id;
      if (old.describedby === null) e.removeAttribute('aria-describedby'); else e.setAttribute('aria-describedby', old.describedby); }, previous);
    rows.push({ id: `${id}-association-ab`, before: native.descriptionLength, linked: associated.descriptionLength, restored: (await ax(p)).descriptionLength });
  }
  if (id.includes('key') || id.includes('krajne')) await p.screenshot({ path: `${OUT}/${id}.png` });
  await p.keyboard.press('Escape'); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  return { dom, native, escapeClosed: !(await p.locator('body>.gb-floating-tip.is-open').count()), ...(await health(p)) };
}
try {
  for (const route of noteRoutes) {
    const p = await ready(route); await p.evaluate(axe);
    const census = await p.evaluate(() => { const m = [...document.querySelectorAll('.fn-marker[data-note-id]')].map(e => {
      const c = e.cloneNode(true); c.querySelectorAll('.tooltip').forEach(t => t.remove()); const label = c.textContent.trim(), n = label.match(/\d+/);
      return { id: e.id, label, number: n ? Number(n[0]) : null, ordinal: Number(e.dataset.noteOrdinal) }; });
      return { markers: m.length, numbered: m.filter(x => x.number !== null).length,
        numericMismatch: m.filter(x => x.number !== null && x.number !== x.ordinal).length,
        unnumbered: m.filter(x => x.number === null).length, endnotes: document.querySelectorAll('[data-note-registry-endnotes] li').length }; });
    const closedRules = await rules(p, '.fn-marker[data-note-id]');
    const index = await p.evaluate(() => { const a = [...document.querySelectorAll('.fn-marker[data-note-id]')]; const i = a.findIndex(e => e.querySelector('.tooltip a, .tooltip button')); return i < 0 ? 0 : i; });
    const target = p.locator('.fn-marker[data-note-id]').nth(index), id = `notes-${width}-${scheme}-${noteRoutes.indexOf(route)}`;
    const state = await popup(p, target, 'focus', id);
    rows.push({ id, route, ...census, closedRules, ...state });
    if (route.includes('krajne')) {
      await p.reload({ waitUntil: 'load' }); await p.waitForFunction(() => window.GBArticleTooltips?.version === 20); await p.evaluate(axe);
      for (const ordinal of [1, 2]) {
        const marker = p.locator(`.fn-marker[data-note-ordinal="${ordinal}"]`), selector = `.fn-marker[data-note-ordinal="${ordinal}"]`;
        const before = await rules(p, selector); await marker.focus(); await p.waitForFunction(() => !!document.querySelector('body>.gb-floating-tip.is-open'));
        const open = await rules(p, selector);
        if (ordinal === 2) await p.screenshot({ path: `${OUT}/note-number-${width}-${scheme}.png` });
        await p.keyboard.press('Escape');
        rows.push({ id: `note-isolation-${width}-${scheme}-${ordinal}`, ordinal, before, open });
      }
    }
    await p.close();
  }
  for (const route of brefRoutes) {
    const p = await ready(route), target = p.locator('.bref[data-ref]').first();
    const census = await p.evaluate(() => { const a = [...document.querySelectorAll('.bref[data-ref]')], sources = [window.SITE_CONFIG?.scripture, window.SITE_CONFIG?.bible, window.BIBLE_VERSES, window.SCRIPTURE_DATA];
      return { controls: a.length, configuredTexts: a.filter(e => sources.some(s => { const v = s?.[e.dataset.ref]; return typeof v === 'string' ? !!v.trim() : !!v?.text?.trim(); })).length }; });
    const id = `bref-${width}-${scheme}-${brefRoutes.indexOf(route)}`;
    rows.push({ id, route, ...census, ...(await popup(p, target, 'focus', id, route.includes('krajne'))) }); await p.close();
  }
  for (const [kind, route, text] of [['keyed', '/articles/krajne-li-isporcheno-serdce/', 'Кархемише'], ['keyless', '/baptisty-rossii/podpolnaya-pechat/', 'Братский листок']])
    for (const mode of ['focus', 'pointer']) {
      const p = await ready(route); await p.waitForFunction(t => [...document.querySelectorAll('.gterm')].some(e => e.textContent.trim().startsWith(t) && e.dataset.gbTooltipReady === '1'), text);
      const index = await p.evaluate(t => [...document.querySelectorAll('.gterm')].findIndex(e => e.textContent.trim().startsWith(t)), text);
      const id = `glossary-${kind}-${width}-${scheme}-${mode}`;
      rows.push({ id, route, ...(await popup(p, p.locator('.gterm').nth(index), mode, id, mode === 'focus')) }); await p.close();
    }
  for (const route of [...Array.from({ length: 5 }, (_, i) => `/nagornaya/chast-${i + 1}/`), '/articles/kod-da-vinchi/']) {
    const p = await ready(route, false);
    const data = await p.evaluate(() => ({ publication: document.querySelector('meta[property="article:published_time"]')?.content,
      modified: document.querySelector('meta[property="article:modified_time"]')?.content,
      dates: [...document.querySelectorAll('.article-updated')].map(e => { const t = e.matches('time') ? e : e.querySelector('time'), r = e.getBoundingClientRect();
        return { label: e.textContent.trim(), value: t?.dateTime, publicationSentence: /^Опубликовано:/i.test(e.textContent.trim()), width: r.width, height: r.height }; }) }));
    rows.push({ id: `date-${width}-${scheme}-${route}`, route, ...data, ...(await health(p)) });
    if (route === '/nagornaya/chast-1/') { await p.locator('.article-updated').first().scrollIntoViewIfNeeded(); await p.screenshot({ path: `${OUT}/date-${width}-${scheme}.png` }); }
    await p.close();
  }
  writeFileSync(`${OUT}/semantic-${width}-${scheme}.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log(`SEMANTIC_CAPTURE_DONE: ${rows.length} records; measured faults are NOT Product PASS`);
} catch (e) {
  writeFileSync(`${OUT}/semantic-${width}-${scheme}-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); throw e;
} finally { await context.close(); await browser.close(); }
