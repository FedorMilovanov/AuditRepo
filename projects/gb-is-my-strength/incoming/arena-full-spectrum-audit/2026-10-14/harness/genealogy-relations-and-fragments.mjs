// Continuation 14: capture facts, not a product PASS. Copy to the rebuilt harness workspace before running.
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = process.env.OUT || './out';
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
const rows = [];
const profiles = width => ({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width === 390,
  hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1, reducedMotion: 'reduce', locale: 'ru-RU' });
const active = page => page.evaluate(() => {
  const e = document.activeElement;
  return { tag: e?.tagName, href: e?.getAttribute('href'), y: Math.round(e?.getBoundingClientRect().top || 0), scrollY: Math.round(scrollY) };
});
try {
  for (const route of ['/journal/', '/biografii/', '/rodosloviye/']) for (const width of [1440, 390]) for (const colorScheme of ['dark', 'light']) {
    const context = await browser.newContext({ ...profiles(width), colorScheme });
    try {
      await context.addInitScript(() => {
        window.__auditPerf = { lcp: 0, cls: 0 };
        new PerformanceObserver(list => { for (const e of list.getEntries()) window.__auditPerf.lcp = Math.max(window.__auditPerf.lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__auditPerf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      const page = await context.newPage(), errors = [], consoleErrors = [], failed = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
      page.on('requestfailed', r => failed.push({ url: r.url(), reason: r.failure()?.errorText }));
      const response = await page.goto(BASE + route, { waitUntil: 'load' });
      if (route === '/rodosloviye/') await page.waitForSelector('[data-genealogy-app]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const metrics = await page.evaluate(() => ({ ...window.__auditPerf, fonts: document.fonts.status,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        pendingBeforeScroll: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length,
        imageCount: document.images.length, dark: document.documentElement.classList.contains('dark') }));
      // naturalWidth=0 before a lazy image enters the viewport is not evidence of breakage.
      for (const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.images].every(i => i.complete));
      const images = await page.evaluate(() => ({ broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc) }));
      await page.locator('h1').scrollIntoViewIfNeeded();
      await page.evaluate(AXE);
      const axe = await page.evaluate(async () => {
        const result = await window.axe.run(document);
        return { rules: result.violations.map(v => [v.id, v.nodes.length]),
          contrastPairs: [...new Set((result.violations.find(v => v.id === 'color-contrast')?.nodes || []).map(n => {
            const d = n.any[0]?.data;
            return `${d?.fgColor}/${d?.bgColor}=${d?.contrastRatio}`;
          }))] };
      });
      const tag = `${route.replaceAll('/', '')}-${width}-${colorScheme}`;
      rows.push({ id: `health-${tag}`, route, width, colorScheme, status: response.status(), ...metrics, ...images,
        axe: axe.rules, pageErrors: errors.length, consoleErrors: consoleErrors.length, failed });
      if (route === '/journal/' && colorScheme === 'dark') rows.push({ id: `journal-contrast-${width}`, pairs: axe.contrastPairs });
      await page.screenshot({ path: `${OUT}/recheck-${tag}.png` });
      if (route === '/rodosloviye/' && colorScheme === 'dark') {
        const search = page.getByRole('combobox', { name: 'Поиск по имени' });
        for (const [person, name] of [['adam', 'Адам'], ['cain', 'Каин'], ['eve', 'Ева'], ['joseph_nt', 'Иосиф (Обручник)'], ['jesus', 'Иисус Христос']]) {
          await search.fill(name);
          await page.waitForFunction(id => document.querySelector('[data-genealogy-app]')?.getAttribute('data-genealogy-search-person') === id, person);
          await page.locator(`.react-flow__node[data-id="${person}"] .genealogy-node`).click();
          const details = page.locator('[data-genealogy-details]');
          await details.waitFor({ state: 'visible' });
          rows.push(await details.evaluate((d, args) => ({ id: `relations-${args.person}-${args.width}`, ...args,
            family: [...d.querySelectorAll('.genealogy-family-person')].map(e => e.innerText.replaceAll('\n', ' · ')),
            relations: [...d.querySelectorAll('.genealogy-person-relation')].map(e => [e.querySelector('strong')?.innerText, e.querySelector('.genealogy-person-relation__main > span')?.innerText]) }), { width, person }));
          await details.locator('.genealogy-person-relations').scrollIntoViewIfNeeded();
          await page.screenshot({ path: `${OUT}/recheck-relations-${person}-${width}.png` });
          if (person === 'adam') {
            await details.locator('.genealogy-person-relation').filter({ hasText: 'Каин' }).click();
            rows.push({ id: `inspector-adam-cain-${width}`, text: await page.locator('[data-genealogy-relation-details]').innerText() });
            await page.getByRole('button', { name: 'Закрыть сведения о связи' }).click();
          } else await page.getByRole('button', { name: 'Закрыть панель', exact: true }).click();
        }
      }
    } finally { await context.close(); }
  }
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ ...profiles(width), colorScheme: 'dark' });
    try {
      const page = await context.newPage();
      await page.goto(BASE + '/biografii/#dzhon-gill-series', { waitUntil: 'load' });
      await page.waitForTimeout(900);
      const before = await active(page), trace = [];
      for (let i = 0; i < 3; i++) { await page.keyboard.press('Tab'); trace.push(await active(page)); }
      rows.push({ id: `fragment-direct-${width}`, before, trace });
      await page.goto(BASE + '/articles/', { waitUntil: 'load' });
      await page.locator('a[href="/biografii/#dzhon-gill-series"]').first().click();
      await page.waitForURL('**/biografii/#dzhon-gill-series');
      await page.waitForTimeout(600);
      const clickBefore = await active(page);
      await page.keyboard.press('Tab');
      rows.push({ id: `fragment-click-${width}`, before: clickBefore, after: await active(page) });
    } finally { await context.close(); }
  }
  const noJS = await browser.newContext({ ...profiles(1440), colorScheme: 'dark', javaScriptEnabled: false });
  try {
    const page = await noJS.newPage();
    await page.goto(BASE + '/rodosloviye/', { waitUntil: 'load' });
    const fallback = page.locator('.genealogy-island-fallback').first();
    await fallback.scrollIntoViewIfNeeded();
    rows.push({ id: 'genealogy-no-js', fallback: await fallback.innerText(), methodology: await page.locator('#genealogy-methodology').count(), app: await page.locator('[data-genealogy-app]').count() });
    await page.screenshot({ path: `${OUT}/recheck-genealogy-no-js.png` });
  } finally { await noJS.close(); }
  const serialized = rows.map(row => JSON.stringify(row)).join('\n') + '\n';
  writeFileSync(`${OUT}/genealogy-relations-and-fragments.jsonl`, serialized);
  console.log(`CAPTURE_DONE: ${rows.length} records (not a product PASS); output: ${OUT}`);
} finally { await browser.close(); }
