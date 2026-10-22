// Native shared Header bootstrap controls. Cold search.js delivery is delayed, never replaced.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8099', OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] }), rows = [];
try {
  for (const width of [390, 1280]) for (const theme of ['light', 'dark'])
    for (const route of ['/izbrannoe/', '/hard-texts/genesis-6/', '/articles/']) {
      const c = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
        isMobile: width === 390, hasTouch: width === 390, serviceWorkers: 'block', reducedMotion: 'reduce', colorScheme: theme });
      try {
        await c.route('**/js/search.js*', async request => {
          await new Promise(resolve => setTimeout(resolve, 300)); await request.continue();
        });
        const p = await c.newPage(), errors = [], consoleKinds = {};
        p.on('pageerror', e => errors.push(e.message));
        p.on('console', m => {
          if (m.type() !== 'error') return;
          const text = m.text(), source = m.location().url || '';
          const kind = text.includes('Content Security Policy') && text.includes('https://gospod-bog.ru/') ? 'pinned-asset-csp'
            : source.startsWith('https://mc.yandex.ru/') ? 'sandbox-metrika' : 'other';
          consoleKinds[kind] = (consoleKinds[kind] || 0) + 1; if (kind === 'other') errors.push(text);
        });
        await p.goto(BASE + route, { waitUntil: 'load' });
        await p.waitForFunction(() => window.GBReaderPreferences?.version === 1);
        await p.evaluate(theme => window.GBReaderPreferences.set({ theme }), theme);
        await p.evaluate(() => document.fonts.ready);
        await p.evaluate(() => { window.__opens = 0; window.addEventListener('gb:openSearch', () => window.__opens++); });
        const button = p.locator('#hCpBtnNav,#gbSearchBtn').first(), original = await button.elementHandle();
        if (width === 390) await button.tap(); else await button.click();
        await p.locator('.cp-input').waitFor({ state: 'visible' });
        const clickOpens = await p.evaluate(() => window.__opens);
        await p.locator('.cp-input').fill('Гилл'); await p.locator('.cp-item').first().waitFor({ state: 'visible' });
        const results = await p.locator('.cp-item').count(); await p.evaluate(() => document.fonts.ready);
        if (route !== '/articles/') await p.screenshot({ path: `${OUT}/header-${width}-${theme}-${route.includes('genesis') ? 'genesis' : 'favorites'}.png` });
        await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('.cp-backdrop.is-open'));
        const escapeFocus = await original.evaluate(e => document.activeElement === e);
        await p.evaluate(() => window.__opens = 0); await p.keyboard.press('Control+k');
        await p.locator('.cp-input').waitFor({ state: 'visible' });
        const shortcutOpens = await p.evaluate(() => window.__opens), dialogs = await p.locator('.cp-backdrop.is-open').count();
        if (width === 390) await p.locator('.cp-close').tap(); else await p.locator('.cp-close').click();
        await p.waitForFunction(() => !document.querySelector('.cp-backdrop.is-open'));
        const closeFocus = await original.evaluate(e => document.activeElement === e);
        await p.evaluate(() => window.__opens = 0); await p.keyboard.press('Meta+k');
        await p.locator('.cp-input').waitFor({ state: 'visible' });
        const metaOpens = await p.evaluate(() => window.__opens);
        await p.keyboard.press('Escape'); await p.waitForFunction(() => !document.querySelector('.cp-backdrop.is-open'));
        const metaFocus = await original.evaluate(e => document.activeElement === e);
        rows.push({ id: `header-${width}-${theme}-${route}`, width, theme, route, coldDelayMs: 300,
          clickOpens, shortcutOpens, metaOpens, results, dialogs, escapeFocus, closeFocus, metaFocus, consoleKinds, errors });
        if (clickOpens !== 1 || shortcutOpens !== 1 || metaOpens !== 1 || dialogs !== 1 || !results || !escapeFocus || !closeFocus || !metaFocus || errors.length)
          throw new Error(`Header bootstrap failed: ${width}/${theme}/${route}`);
      } finally { await c.close(); }
    }
  writeFileSync(`${OUT}/header-postclosure.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log('HEADER_RECHECK_DONE: 12 cold native click/shortcut/query/focus controls; not global Product PASS');
} catch (e) {
  writeFileSync(`${OUT}/header-postclosure-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); throw e;
} finally { await browser.close(); }
