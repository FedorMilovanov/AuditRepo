// Actual painted PLAY ink vs the same underlay with only glyph visibility hidden; not a CSS repair.
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire((process.env.PRODUCT_DIR || '/home/user/gbs-src') + '/package.json');
const { PNG } = require('pngjs'), BASE = process.env.BASE || 'http://127.0.0.1:8099', OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true }); const rows = [];
const luminance = v => v.map(x => { x /= 255; return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; })
  .reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
try {
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
      deviceScaleFactor: 2, colorScheme: theme, reducedMotion: 'reduce', serviceWorkers: 'block' });
    try {
      const p = await context.newPage(); await p.goto(BASE + '/nagornaya/chast-1/');
      await p.waitForFunction(() => window.GBReaderTTS?.version === 2);
      await p.evaluate(t => GBReaderPreferences.set({ theme: t }), theme); await p.evaluate(() => document.fonts.ready);
      await p.evaluate(() => scrollTo(0, 1100)); await p.waitForTimeout(350);
      const button = p.locator('[data-fc-action="play"]').filter({ visible: true }).last(), glyph = button.locator('.gb-ember__glyph');
      const style = await button.evaluate(e => ({ disabled: e.disabled, box: [e.getBoundingClientRect().width, e.getBoundingClientRect().height],
        fill: getComputedStyle(e.querySelector('.gb-ember__glyph')).fill,
        ancestorOpacity: [e, e.parentElement, e.parentElement.parentElement].map(e => getComputedStyle(e).opacity) }));
      const png = await button.screenshot(), before = PNG.sync.read(png);
      const previous = await glyph.evaluate(e => { const s = e.style.cssText; e.style.visibility = 'hidden'; return s; });
      const after = PNG.sync.read(await button.screenshot()); await glyph.evaluate((e, s) => e.style.cssText = s, previous);
      let max = 1, pair = null, pixels = 0;
      for (let i = 0; i < before.data.length; i += 4) {
        const ink = [...before.data.slice(i, i + 3)], underlay = [...after.data.slice(i, i + 3)];
        if (ink.reduce((s, x, k) => s + Math.abs(x - underlay[k]), 0) < 35) continue;
        pixels++; const a = luminance(ink), b = luminance(underlay), ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
        if (ratio > max) { max = ratio; pair = { ink, underlay }; }
      }
      rows.push({ theme, viewport: [390, 844], style, changedPixels: pixels, maxPaintedContrast: max, pair });
      writeFileSync(`${OUT}/play-glyph-${theme}.png`, png);
    } finally { await context.close(); }
  }
} finally { await browser.close(); writeFileSync(`${OUT}/play-icon-contrast.json`, JSON.stringify(rows)); }
console.log('PLAY_ICON_CONTRAST_CAPTURE_DONE: paired dark/light pixel data, not a whole-theme PASS');
