// home-listings.mjs — что главная реально перечисляет/предлагает: секции, ссылки, картинки, метрики.
// Запуск: node home-listings.mjs [baseURL] [outDir]
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = process.argv[3] || process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const EXEC = process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh';

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const result = { base: BASE, at: new Date().toISOString(), desktop: {}, mobile: {} };

for (const [label, viewport, isMobile] of [
  ['desktop', { width: 1440, height: 900 }, false],
  ['mobile', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport, isMobile, hasTouch: isMobile, colorScheme: 'light', locale: 'ru-RU' });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('requestfailed', r => failedRequests.push(`${r.failure()?.errorText} ${r.url().slice(0, 120)}`));

  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const norm = s => (s || '').replace(/\s+/g, ' ').trim();
    const sections = [];
    document.querySelectorAll('main section, main > div > section').forEach(sec => {
      const links = [...sec.querySelectorAll('a[href]')].map(a => ({
        href: a.getAttribute('href'),
        text: norm(a.textContent).slice(0, 120),
        ariaLabel: a.getAttribute('aria-label') || null,
        cls: a.className.slice(0, 60),
      }));
      sections.push({
        id: sec.id || null,
        label: norm(sec.querySelector('.h-section-label')?.textContent || '').slice(0, 60) || null,
        heading: norm(sec.querySelector('h1, h2, h3')?.textContent || '').slice(0, 90) || null,
        headingTag: (sec.querySelector('h1, h2, h3')?.tagName || '').toLowerCase() || null,
        sectionHeadings: [...sec.querySelectorAll('h1, h2, h3, h4')].map(h => `${h.tagName.toLowerCase()}:${norm(h.textContent).slice(0, 70)}`),
        linkCount: links.length,
        links,
      });
    });
    const imgs = [...document.querySelectorAll('main img, header img, footer img')].map(i => ({
      src: (i.currentSrc || i.src || '').replace(location.origin, ''),
      alt: i.getAttribute('alt'),
      naturalWidth: i.naturalWidth,
      naturalHeight: i.naturalHeight,
      loading: i.getAttribute('loading') || null,
      width: i.getAttribute('width') || null,
      height: i.getAttribute('height') || null,
    }));
    const h1s = [...document.querySelectorAll('h1')].map(h => norm(h.textContent));
    const articleLinks = [...document.querySelectorAll('a[href*="/articles/"]')].map(a => a.getAttribute('href'));
    return { title: document.title, h1s, sections, imgs, articleLinks, url: location.href };
  });

  data.consoleErrors = consoleErrors;
  data.failedRequests = failedRequests.slice(0, 20);
  result[label] = data;
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/home-listings.json`, JSON.stringify(result, null, 1));
console.log(JSON.stringify({
  desktop: {
    title: result.desktop.title,
    h1s: result.desktop.h1s,
    sections: result.desktop.sections.map(s => ({ id: s.id, label: s.label, h2: s.heading, links: s.linkCount })),
    imgs: result.desktop.imgs.length,
    imgBroken: result.desktop.imgs.filter(i => i.naturalWidth === 0).length,
    articleLinks: [...new Set(result.desktop.articleLinks)],
    consoleErrors: result.desktop.consoleErrors.length,
  },
  mobile: { imgs: result.mobile.imgs.length, imgBroken: result.mobile.imgs.filter(i => i.naturalWidth === 0).length, sections: result.mobile.sections.length, consoleErrors: result.mobile.consoleErrors.length },
}, null, 1));
