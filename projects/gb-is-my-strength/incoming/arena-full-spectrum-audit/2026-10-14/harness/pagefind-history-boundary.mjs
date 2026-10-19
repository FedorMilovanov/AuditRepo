// Continuation 16 companion: run AFTER the canonical npm run pagefind:build:dist.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.argv[2] || 'http://127.0.0.1:8099', OUT = process.env.OUT || './out';
const targetPath = '/articles/dzhon-gill-chast-1-chelovek/', rows = [];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
try {
  for (const width of [1440, 390]) for (const scheme of ['dark', 'light']) for (const [kind, seed] of [['array', '[]'], ['object', '{}'], ['null', 'null']]) {
    const c = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width === 390,
      hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1, colorScheme: scheme, reducedMotion: 'reduce', locale: 'ru-RU' });
    try {
      const page = await c.newPage(), errors = [], consoleLog = { count: 0, kinds: {}, unknown: [] }, resources = { module200: false, wasm200: false };
      page.setDefaultTimeout(12000);
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => {
        if (m.type() !== 'error') return; consoleLog.count++;
        const t = m.text(), kind = t.includes('Content Security Policy') && t.includes('https://gospod-bog.ru/') ? 'pinned-asset-csp' : m.location().url.startsWith('https://mc.yandex.ru/') ? 'sandbox-metrika' : 'other';
        consoleLog.kinds[kind] = (consoleLog.kinds[kind] || 0) + 1; if (kind === 'other') consoleLog.unknown.push(t);
      });
      page.on('response', r => {
        const p = new URL(r.url()).pathname;
        if (p === '/pagefind/pagefind.js') resources.module200 = r.status() === 200;
        if (p.startsWith('/pagefind/wasm.')) resources.wasm200 = r.status() === 200;
      });
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await page.evaluate(s => localStorage.setItem('gb-cp-history', s), seed);
      await page.keyboard.press('Control+k');
      await page.locator('.cp-input').fill('Многотомный');
      await page.waitForFunction(() => window.__pagefindReady__ === true);
      // Derive the target label from the actual index, not the different legacy manifest title.
      const indexed = await page.evaluate(async target => {
        const r = await window.__pagefind__.search('Многотомный');
        const data = await Promise.all(r.results.map(x => x.data()));
        const found = data.find(x => new URL(x.url, location.origin).pathname === target);
        return found ? { url: found.url, title: found.meta.title } : null;
      }, targetPath);
      if (!indexed) throw new Error('Target missing from the actual Pagefind index');
      const option = page.getByRole('option', { name: indexed.title, exact: true });
      await option.waitFor({ state: 'visible' });
      const resultCount = await page.locator('.cp-item').count();
      if (width === 390) await option.tap(); else await option.click();
      await page.waitForTimeout(400);
      rows.push(structuredClone({ id: `pagefind-history-${kind}-${width}-${scheme}`, seed, indexed, resultCount, resources,
        expected: targetPath, actual: await page.evaluate(() => location.pathname), pageErrors: errors, console: consoleLog }));
      if (kind === 'object') await page.screenshot({ path: `${OUT}/pagefind-history-${width}-${scheme}.png` });
    } finally { await c.close(); }
  }
  writeFileSync(`${OUT}/pagefind-history-boundary.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log(`CAPTURE_DONE: ${rows.length} Pagefind records; capture is not product PASS`);
} finally { await browser.close(); }
