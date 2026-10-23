// Current-main closure probe; Pages-style 404 response, not an independent live-site witness.
// Copy into the browser harness workspace. BASE defaults to the local production-like build.
import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8099';
const DIST = process.env.DIST || '/home/user/gbs-src/dist', OUT = process.env.OUT || './out';
const html = readFileSync(`${DIST}/404.html`, 'utf8'), axe = readFileSync('./axe.min.js', 'utf8');
const assetPaths = ['/js/reader-preferences-head.js', '/css/reader-preferences.css', '/js/reader-preferences.js'];
const nested = ['/deep/nested/missing/', '/a/b/'], negativePath = '/audit-negative/deep/missing/';
let oldHtml = html;
for (const path of assetPaths) {
  if (!html.includes(`="${path}?`)) throw new Error(`Built reference not root-relative: ${path}`);
  oldHtml = oldHtml.replace(`="${path}?`, `="${path.slice(1)}?`);
}
mkdirSync(OUT, { recursive: true });
const rows = [], browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
try {
  for (const width of [1440, 390]) for (const theme of ['light', 'dark', 'sepia']) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1,
      // SW fetches bypass Playwright routing and would return Python's generic 404, not Pages HTML.
      // This probe isolates URL resolution/bootstrap; it does not certify service-worker behavior.
      serviceWorkers: 'block', colorScheme: theme === 'dark' ? 'dark' : 'light', reducedMotion: 'reduce', locale: 'ru-RU' });
    try {
      await context.addInitScript(() => {
        window.__perf = { lcp: 0, cls: 0 };
        new PerformanceObserver(l => { for (const e of l.getEntries()) window.__perf.lcp = Math.max(window.__perf.lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      await context.route('**/*', route => {
        const path = new URL(route.request().url()).pathname;
        if (route.request().isNavigationRequest() && (nested.includes(path) || path === negativePath))
          return route.fulfill({ status: 404, contentType: 'text/html; charset=utf-8', body: path === negativePath ? oldHtml : html });
        return route.continue();
      });
      const page = await context.newPage(), events = [], responses = [];
      page.on('pageerror', e => events.push({ type: 'pageerror', message: e.message }));
      page.on('console', m => { if (m.type() === 'error') events.push({ type: 'console', message: m.text(), source: m.location().url }); });
      page.on('response', r => { if (r.url().includes('reader-preferences')) responses.push([new URL(r.url()).pathname, r.status()]); });
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await page.waitForFunction(() => window.GBReaderPreferences?.version === 1);
      await page.evaluate(theme => window.GBReaderPreferences.set({ theme }), theme);
      for (const [index, path] of ['/404.html', ...nested, ...(theme === 'sepia' ? [negativePath] : [])].entries()) {
        events.length = 0; responses.length = 0;
        const response = await page.goto(BASE + path, { waitUntil: 'load' });
        const negative = path === negativePath, id = `404-${width}-${theme}-${negative ? 'negative' : index}`;
        if (!negative) await page.waitForFunction(theme => window.GBReaderPreferences?.get().theme === theme, theme);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        const state = await page.evaluate(() => ({ theme: document.documentElement.dataset.readerTheme || null,
          apiTheme: window.GBReaderPreferences?.get().theme || null, bg: getComputedStyle(document.body).backgroundColor,
          fonts: document.fonts.status, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).length,
          recovery: [...document.querySelectorAll('.not-found-actions a')].map(a => a.getAttribute('href')),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null, ...window.__perf }));
        const assets = structuredClone(responses), log = structuredClone(events);
        await page.evaluate(axe);
        const violations = await page.evaluate(async () => (await window.axe.run(document)).violations.map(v => [v.id, v.nodes.length]));
        await page.evaluate(() => document.fonts.ready);
        const consoleKinds = {}, unexpected = [];
        for (const event of log) {
          const kind = event.type === 'pageerror' ? 'pageerror'
            : event.message.includes('Content Security Policy') && event.message.includes('https://gospod-bog.ru/') ? 'pinned-asset-csp'
            : event.message.includes('404') && event.source === BASE + path ? 'expected-document-404'
            : negative && event.message.includes('404') && event.source.includes('reader-preferences') ? 'negative-asset-404' : 'other';
          consoleKinds[kind] = (consoleKinds[kind] || 0) + 1;
          if (kind === 'pageerror' || kind === 'other') unexpected.push(event);
        }
        rows.push({ id, path, status: response.status(), negative, ...state, assets, axe: violations,
          consoleKinds, otherEvents: unexpected.length });
        for (const event of unexpected) rows.push({ id: `${id}-event`, ...event });
        if (!negative && theme === 'sepia' && path === nested[0]) {
          const details = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['color-contrast'] })).violations
            .flatMap(v => v.nodes.map(n => ({ target: n.target, data: n.any.find(a => a.id === 'color-contrast')?.data }))));
          for (const [i, detail] of details.entries()) rows.push({ id: `${id}-contrast-${i}`, ...detail });
        }
        if (!negative && unexpected.length) throw new Error(`Unexpected page/console error: ${id}`);
        await page.screenshot({ path: `${OUT}/${id}.png`, fullPage: true });
        if (!negative && (state.theme !== theme || state.apiTheme !== theme || assets.length !== 3 || assets.some(([p, s]) => !assetPaths.includes(p) || s !== 200)))
          throw new Error(`Positive 404 contract failed: ${id}`);
        if (negative && (state.apiTheme !== null || assets.filter(([, s]) => s === 404).length !== 3))
          throw new Error(`Negative control did not expose relative asset failure: ${id}`);
        if (!negative && state.recovery.join(',') !== '/,/articles/,/nagornaya/') throw new Error(`Recovery URLs changed: ${id}`);
        if (!negative && theme === 'sepia' && path === nested[1]) {
          await page.getByRole('link', { name: 'На главную', exact: true }).focus();
          await page.keyboard.press('Enter'); await page.waitForURL(BASE + '/');
          const home = new URL(page.url()).pathname;
          await page.goto(BASE + path, { waitUntil: 'load' });
          const catalog = page.getByRole('link', { name: 'Все статьи', exact: true });
          if (width === 390) await catalog.tap(); else await catalog.click();
          await page.waitForURL(BASE + '/articles/');
          rows.push({ id: `404-recovery-${width}`, homeKeyboard: home, catalogPointer: new URL(page.url()).pathname });
        }
      }
    } finally { await context.close(); }
  }
  writeFileSync(`${OUT}/404-postclosure.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log(`404_RECHECK_DONE: ${rows.filter(r => 'negative' in r && !r.negative).length} positive + ${rows.filter(r => r.negative).length} negative controls; not live-site PASS`);
} catch (error) {
  writeFileSync(`${OUT}/404-postclosure-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  throw error;
} finally { await browser.close(); }
