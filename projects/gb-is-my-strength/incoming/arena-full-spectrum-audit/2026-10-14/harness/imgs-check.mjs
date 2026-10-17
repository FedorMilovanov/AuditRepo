import { chromium } from 'playwright-core';
const EXEC = process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh';
const b = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
for (const [route, vp] of [['/', { width: 1440, height: 900 }], ['/', { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600, colorScheme: 'light', locale: 'ru-RU' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8099' + route, { waitUntil: 'load' });
  await p.waitForTimeout(2000);
  // прокрутить всю страницу, чтобы lazy-картинки загрузились
  await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return { total: imgs.length, broken: imgs.filter(i => i.naturalWidth === 0).map(i => ({ src: (i.currentSrc || i.src).replace(location.origin, ''), loading: i.loading, rect: (x => `${Math.round(x.width)}x${Math.round(x.height)}`)(i.getBoundingClientRect()) })), noAlt: imgs.filter(i => !i.hasAttribute('alt')).length, emptyAlt: imgs.filter(i => i.getAttribute('alt') === '').length, withAlt: imgs.filter(i => (i.getAttribute('alt') || '').length > 0).length };
  });
  console.log(`${route} @${vp.width}:`, JSON.stringify(r));
  await ctx.close();
}
await b.close();
