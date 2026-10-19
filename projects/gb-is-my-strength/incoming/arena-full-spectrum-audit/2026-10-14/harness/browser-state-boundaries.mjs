// Continuation 16. Disposable browser origins only; no Product mutation or Storage API replacement.
// Run WIDTH=1440 / WIDTH=390 independently, or omit WIDTH for all profiles. Capture is not product PASS.
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const BASE = process.argv[2] || 'http://127.0.0.1:8099', OUT = process.env.OUT || './out';
const SOURCE = process.env.PRODUCT_DIST || '/home/user/gbs-src/dist';
if (existsSync(`${SOURCE}/pagefind/pagefind.js`)) throw new Error('Run this baseline capture before Pagefind build; use pagefind-history-boundary.mjs afterwards');
const widths = process.env.WIDTH ? [Number(process.env.WIDTH)] : [1440, 390];
const rows = [], AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const article = '/articles/dzhon-gill-chast-1-chelovek/';
const other = '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/';
function objects(v) { return v && typeof v === 'object' ? [v, ...Object.values(v).flatMap(objects)] : []; }
const title = objects(JSON.parse(readFileSync(`${SOURCE}/data/search-manifest.json`, 'utf8'))).find(x => x.url === article)?.title;
if (!title) throw new Error('Search target must resolve in the actual built manifest');
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
async function context(width, colorScheme) {
  const c = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width === 390,
    hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1, colorScheme, reducedMotion: 'reduce', locale: 'ru-RU' });
  await c.addInitScript(() => {
    window.__auditPerf = { lcp: 0, cls: 0 };
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__auditPerf.lcp = Math.max(window.__auditPerf.lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__auditPerf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  return c;
}
function track(page) {
  page.setDefaultTimeout(12000);
  const log = { pageErrors: [], consoleErrors: 0, consoleKinds: {}, unknownConsole: [], failed: [] };
  page.on('pageerror', e => log.pageErrors.push(e.message));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    log.consoleErrors++; const text = m.text(), source = m.location().url || '';
    const kind = text.includes('Content Security Policy') && text.includes('https://gospod-bog.ru/') ? 'pinned-asset-csp'
      : source.startsWith('https://mc.yandex.ru/') ? 'sandbox-metrika'
      : source.includes('/pagefind/') && text.includes('404') ? 'baseline-no-pagefind' : 'other';
    log.consoleKinds[kind] = (log.consoleKinds[kind] || 0) + 1;
    if (kind === 'other') log.unknownConsole.push(text);
  });
  page.on('requestfailed', r => log.failed.push({ host: new URL(r.url()).host, error: r.failure()?.errorText }));
  return log;
}
async function ready(page, route) {
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForFunction(() => window.GBFavoriteStore?.version === 1 && window.GBReaderPreferences?.version === 1);
  await page.evaluate(() => document.fonts.ready);
}
async function fillQuota(page) {
  return page.evaluate(() => {
    const key = 'audit:quota-fill'; let lo = 0, hi = 6 * 1024 * 1024;
    while (lo < hi) { const n = Math.ceil((lo + hi) / 2); try { localStorage.setItem(key, 'x'.repeat(n)); lo = n; } catch (e) { if (e.name !== 'QuotaExceededError') throw e; hi = n - 1; } }
    localStorage.setItem(key, 'x'.repeat(lo));
    let error = ''; try { localStorage.setItem('audit:overflow-probe', '1'); } catch (e) { error = e.name; }
    if (error !== 'QuotaExceededError') throw new Error('Quota precondition was not established');
    return { fillerCharacters: lo, proof: error };
  });
}
async function nativeNames(page, selector) {
  const cdp = await page.context().newCDPSession(page), { root } = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector }), result = [];
  for (const nodeId of nodeIds) {
    const { node } = await cdp.send('DOM.describeNode', { nodeId });
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { backendNodeId: node.backendNodeId, fetchRelatives: false });
    result.push({ role: nodes[0]?.role?.value, name: nodes[0]?.name?.value || '', ignored: nodes[0]?.ignored });
  }
  await cdp.detach(); return result;
}
async function health(page, id) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(AXE);
  const axe = await page.evaluate(async () => (await window.axe.run(document)).violations.map(v => [v.id, v.nodes.length]));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => new Promise(requestAnimationFrame));
  rows.push({ id, ...(await page.evaluate(() => ({ ...window.__auditPerf, fonts: document.fonts.status,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, imageCount: document.images.length,
    visibleBroken: [...document.images].filter(i => { const r = i.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && i.complete && !i.naturalWidth; }).length }))), axe });
  await page.screenshot({ path: `${OUT}/${id}.png` });
}
try {
  for (const width of widths) for (const scheme of ['dark', 'light']) {
    const profile = `${width}-${scheme}`;
    const activate = l => width === 390 ? l.tap() : l.click();
    const save = p => p.locator('[data-fc-action="save"]:visible,.gb-save:visible').first();
    // Real saves, cross-tab projection, reload, removal/confirmation and successful legacy migration.
    const c = await context(width, scheme);
    try {
      const home = await c.newPage(), page = await c.newPage(), log = track(page); track(home);
      await ready(home, '/'); const counts = [];
      for (const [i, route] of [article, other].entries()) {
        await ready(page, route); await activate(save(page));
        await home.waitForFunction(n => document.querySelectorAll('.favorites-card').length === n, i + 1);
        counts.push(await page.evaluate(() => window.GBFavoriteStore.list().length));
      }
      await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => window.GBFavoriteStore?.has(location.pathname));
      rows.push({ id: `normal-saves-${profile}`, counts, reloadHas: await page.evaluate(() => window.GBFavoriteStore.has(location.pathname)), homeNames: await nativeNames(home, '.favorites-card') });
      await ready(page, '/izbrannoe/'); await page.waitForSelector('.izbrannoe-card');
      await health(page, `favorites-health-${profile}`);
      rows.push({ id: `cover-names-${profile}`, count: await page.locator('.izbrannoe-card').count(), names: await nativeNames(page, '.izbrannoe-card__link') });
      await activate(page.locator('.izbrannoe-card__remove').first());
      const afterRemove = await page.locator('.izbrannoe-card').count();
      page.once('dialog', d => d.dismiss()); await activate(page.locator('#izbrannoeClear'));
      const cancelled = await page.locator('.izbrannoe-card').count();
      page.once('dialog', d => d.accept()); await activate(page.locator('#izbrannoeClear'));
      await home.waitForFunction(() => document.querySelectorAll('.favorites-card').length === 0);
      rows.push({ id: `clear-control-${profile}`, afterRemove, cancelled, accepted: await page.locator('.izbrannoe-card').count() });
      await ready(page, article);
      const legacyKey = await page.evaluate(() => { const k = 'fc:saved:' + window.GBFavoriteStore.normalizePath(location.pathname); localStorage.setItem(k, '1'); return k; });
      await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => window.GBFavoriteStore?.has(location.pathname));
      rows.push({ id: `migration-control-${profile}`, oldFlag: await page.evaluate(k => localStorage.getItem(k), legacyKey), canonical: await page.evaluate(() => window.GBFavoriteStore.has(location.pathname)) });
      const wanted = { version: 1, theme: 'sepia', fontScale: 1.15, lineHeight: 'relaxed', measure: 'wide', textMode: 'plain', motion: 'reduced' };
      await page.evaluate(p => window.GBReaderPreferences.set(p), wanted);
      await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => window.GBReaderPreferences?.version === 1);
      const restored = await page.evaluate(() => window.GBReaderPreferences.get());
      await ready(page, other); const otherRoute = await page.evaluate(() => window.GBReaderPreferences.get());
      await home.evaluate(() => window.GBReaderPreferences.set({ fontScale: 1.2 }));
      await page.waitForFunction(() => window.GBReaderPreferences.get().fontScale === 1.2);
      rows.push({ id: `preferences-control-${profile}`, mode: 'public API, not GUI coverage', wanted, restored, otherRoute, crossTabScale: await page.evaluate(() => window.GBReaderPreferences.get().fontScale) });
      rows.push({ id: `normal-errors-${profile}`, ...structuredClone(log) });
    } finally { await c.close(); }
    for (const kind of ['manual', 'migration']) {
      const c = await context(width, scheme);
      try {
        const page = await c.newPage(), log = track(page); await ready(page, article);
        let legacyKey = '';
        if (kind === 'migration') legacyKey = await page.evaluate(() => { const k = 'fc:saved:' + window.GBFavoriteStore.normalizePath(location.pathname); localStorage.setItem(k, '1'); return k; });
        const quota = await fillQuota(page);
        if (kind === 'manual') { await activate(save(page)); await page.locator('.gb-fc-toast.is-open').waitFor({ state: 'visible' }); }
        else { await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => window.GBFavoriteStore?.version === 1); }
        const state = await page.evaluate(k => ({ items: window.GBFavoriteStore.list().length, oldFlag: k ? localStorage.getItem(k) : null,
          pressed: [...document.querySelectorAll('[data-fc-action="save"],.gb-save')].filter(e => e.getClientRects().length).map(e => e.getAttribute('aria-pressed')),
          toast: document.querySelector('.gb-fc-toast.is-open')?.innerText || '' }), legacyKey);
        await page.screenshot({ path: `${OUT}/quota-${kind}-${profile}.png` });
        await page.evaluate(() => localStorage.removeItem('audit:quota-fill'));
        await ready(page, '/izbrannoe/');
        rows.push({ id: `quota-${kind}-${profile}`, quota, ...state, afterSpaceFreed: await page.evaluate(() => window.GBFavoriteStore.list().length), cards: await page.locator('.izbrannoe-card').count(), ...structuredClone(log) });
      } finally { await c.close(); }
    }
    // Bad JSON in the other stores must recover; do not assume every storage consumer is broken.
    const corrupt = await context(width, scheme);
    try {
      const page = await corrupt.newPage(), log = track(page); await ready(page, article);
      await page.evaluate(() => { localStorage.setItem('gb-favorites', '{'); localStorage.setItem('gb:reader-preferences:v1', '{'); });
      await page.reload({ waitUntil: 'load' }); await page.waitForFunction(() => window.GBFavoriteStore?.version === 1);
      const initial = await page.evaluate(() => ({ favorites: window.GBFavoriteStore.list().length, preferences: window.GBReaderPreferences.get() }));
      await activate(save(page)); rows.push({ id: `corruption-control-${profile}`, initial, added: await page.evaluate(() => window.GBFavoriteStore.list().length), ...structuredClone(log) });
    } finally { await corrupt.close(); }
    for (const [kind, seed] of [['missing', null], ['array', '["Гилл"]'], ['syntax', '{'], ['object', '{}'], ['null', 'null'], ['quota', '[]']]) {
      const c = await context(width, scheme);
      try {
        const page = await c.newPage(), log = track(page); await ready(page, '/');
        await page.evaluate(seed => { if (seed === null) localStorage.removeItem('gb-cp-history'); else localStorage.setItem('gb-cp-history', seed); }, seed);
        const quota = kind === 'quota' ? await fillQuota(page) : null;
        await page.keyboard.press('Control+k'); await page.locator('.cp-input').waitFor({ state: 'visible' });
        await page.locator('.cp-input').fill('Гилл');
        const target = page.getByRole('option', { name: title, exact: true }); await target.waitFor({ state: 'visible' });
        if (kind === 'object') await health(page, `search-health-${profile}`);
        const resultCount = await page.locator('.cp-item').count();
        await activate(target); await page.waitForTimeout(400);
        rows.push({ id: `history-${kind}-${profile}`, seed, quota, resultCount, expected: article,
          actual: await page.evaluate(() => location.pathname), ...structuredClone(log) });
        if (kind === 'object' || kind === 'null') await page.screenshot({ path: `${OUT}/history-${kind}-${profile}.png` });
      } finally { await c.close(); }
    }
  }
  writeFileSync(`${OUT}/browser-state-${process.env.WIDTH || 'all'}.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log(`CAPTURE_DONE: ${rows.length} records; not product PASS; widths=${widths.join(',')}`);
} catch (error) {
  writeFileSync(`${OUT}/browser-state-${process.env.WIDTH || 'all'}-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  throw error;
} finally { await browser.close(); }
