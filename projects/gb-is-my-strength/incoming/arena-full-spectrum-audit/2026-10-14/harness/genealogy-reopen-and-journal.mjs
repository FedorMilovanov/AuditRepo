// Continuation 15. Capture runtime facts; successful capture is not a product PASS.
import { chromium } from 'playwright-core';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
const rows = [];
try {
  for (const route of ['/rodosloviye/', '/journal/dossiers/g3/']) for (const width of [1440, 390]) for (const colorScheme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1, colorScheme, reducedMotion: 'reduce', locale: 'ru-RU' });
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
      // Isolate touch gestures from Chromium/ReactFlow double-tap recognition; do not retry a failed action.
      const activate = async locator => { if (width === 390) { await page.waitForTimeout(650); await locator.tap(); } else await locator.click(); };
      const response = await page.goto(BASE + route, { waitUntil: 'load' });
      if (route === '/rodosloviye/') await page.waitForSelector('[data-genealogy-app]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      const metrics = await page.evaluate(() => ({ ...window.__auditPerf, fonts: document.fonts.status,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        imageCount: document.images.length, brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).length }));
      await page.evaluate(AXE);
      const accessibility = await page.evaluate(async () => {
        const result = await window.axe.run(document), colors = {};
        for (const n of result.violations.find(v => v.id === 'color-contrast')?.nodes || []) {
          const d = n.any[0]?.data, key = `${d?.fgColor}/${d?.bgColor}=${d?.contrastRatio}`;
          colors[key] = (colors[key] || 0) + 1;
        }
        return { rules: result.violations.map(v => [v.id, v.nodes.length]), colors,
          colorOnly: result.violations.find(v => v.id === 'link-in-text-block')?.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) || [] };
      });
      const tag = `${route.replaceAll('/', '-')}-${width}-${colorScheme}`;
      rows.push({ id: `health${tag}`, route, width, colorScheme, status: response.status(), ...metrics, axe: accessibility.rules });
      await page.screenshot({ path: `${OUT}/cont15-health${tag}.png` });
      if (route === '/rodosloviye/') {
        const app = page.locator('[data-genealogy-app]');
        const search = page.getByRole('combobox', { name: 'Поиск по имени' });
        const personNode = id => page.locator(`.react-flow__node[data-id="${id}"] .genealogy-node`);
        const state = () => app.evaluate(e => ({ level: e.getAttribute('data-genealogy-level'), active: e.getAttribute('data-genealogy-active-person'),
          panel: !!e.querySelector('[data-genealogy-details]'), focusedNode: document.activeElement?.getAttribute('data-id') }));
        for (const [person, name, closeBy] of [['adam', 'Адам', 'button'], ['noah', 'Ной', 'Escape']]) {
          await search.fill(name);
          await page.waitForFunction(id => document.querySelector('[data-genealogy-app]')?.getAttribute('data-genealogy-search-person') === id, person);
          await activate(personNode(person));
          await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Закрыть панель');
          const opened = await state();
          if (closeBy === 'Escape') await page.keyboard.press('Escape');
          else await activate(page.getByRole('button', { name: 'Закрыть панель', exact: true }));
          await page.waitForSelector('[data-genealogy-details]', { state: 'detached' });
          const closed = await state();
          await activate(personNode(person));
          const first = await state();
          await page.screenshot({ path: `${OUT}/cont15-reopen-${person}-${width}-${colorScheme}.png` });
          let second = null;
          if (!first.panel) { await activate(personNode(person)); second = await state(); }
          rows.push({ id: `reopen-${person}-${width}-${colorScheme}`, closeBy, opened, closed, first, second });
          await activate(page.getByRole('button', { name: 'Закрыть панель', exact: true }));
        }
        await activate(page.getByRole('button', { name: 'Обзор древа', exact: true }));
        const before = await state();
        await activate(personNode('adam'));
        await page.waitForFunction(() => document.querySelector('[data-genealogy-app]')?.getAttribute('data-genealogy-level') === '2');
        const first = await state();
        let second = null, third = null;
        if (!first.panel) { await activate(personNode('adam')); second = await state(); }
        if (!(second || first).panel) { await activate(personNode('adam')); third = await state(); }
        rows.push({ id: `overview-${width}-${colorScheme}`, before, first, second, third });
        await activate(page.getByRole('button', { name: 'Закрыть панель', exact: true }));
        // Closing already restores focus to the actual node; no synthetic node.focus() is needed.
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Закрыть панель');
        const opened = await state();
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => document.activeElement?.getAttribute('data-id') === 'adam');
        const closed = await state();
        await page.keyboard.press('Enter');
        await page.waitForSelector('[data-genealogy-details]');
        rows.push({ id: `keyboard-control-${width}-${colorScheme}`, opened, closed, reopened: await state() });
        await activate(page.getByRole('button', { name: 'Закрыть панель', exact: true }));
        await activate(app.getByRole('button', { name: 'Каинова', exact: true }));
        await search.fill('Исаак');
        await page.waitForFunction(() => document.querySelector('[data-genealogy-app]')?.getAttribute('data-genealogy-search-person') === 'isaac');
        await page.waitForFunction(() => [...document.querySelectorAll('.genealogy-filter-tools button')].find(e => e.textContent === 'Все')?.getAttribute('aria-pressed') === 'true');
        const filterCleared = await app.getByRole('button', { name: 'Все', exact: true }).getAttribute('aria-pressed');
        await search.fill('Иосиф (Лк)');
        await page.getByRole('listbox').waitFor({ state: 'visible' });
        const choices = await page.getByRole('listbox').getByRole('option').count();
        await search.press('ArrowDown');
        const option = await search.getAttribute('aria-activedescendant');
        await search.press('Enter');
        const chosen = await app.getAttribute('data-genealogy-search-person');
        rows.push({ id: `search-control-${width}-${colorScheme}`, filterCleared, choices, option, chosen, listRemaining: await page.getByRole('listbox').count() });
      } else {
        rows.push({ id: `journal-colors-${width}-${colorScheme}`, pairs: accessibility.colors, colorOnly: accessibility.colorOnly });
        rows.push(await page.evaluate(({ width, colorScheme }) => {
          const references = [...document.querySelectorAll('.claim-ref')], links = [...document.querySelectorAll('main a[href]')];
          const external = links.map(a => a.href).filter(h => /^https?:/.test(h) && new URL(h).origin !== location.origin);
          return { id: `bibliography-${width}-${colorScheme}`, references: references.length, refTags: [...new Set(references.map(e => e.tagName))],
            interactiveReferences: references.filter(e => e.matches('a,button,[role=button],[role=link],[tabindex]') || e.querySelector('a,button')).length,
            sourceCards: document.querySelectorAll('.document-grid article').length, sourceCardLinks: document.querySelectorAll('.document-grid a[href]').length,
            externalLinks: external.length, externalUnique: [...new Set(external)] };
        }, { width, colorScheme }));
        await page.locator('#documents').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${OUT}/cont15-source-cards-${width}-${colorScheme}.png` });
        await activate(page.locator('.dossier-nav a[href="#finance"]'));
        await page.waitForTimeout(300);
        const financeReached = await page.evaluate(() => location.hash === '#finance');
        const measure = () => page.evaluate(() => ({ navY: document.querySelector('.dossier-nav').getBoundingClientRect().top,
          bodyX: getComputedStyle(document.body).overflowX, bodyY: getComputedStyle(document.body).overflowY,
          rootY: document.scrollingElement.scrollTop, scrolling: document.scrollingElement.tagName }));
        const before = await measure();
        await page.screenshot({ path: `${OUT}/cont15-sticky-before-${width}-${colorScheme}.png` });
        const original = await page.evaluate(() => ['overflow-x', 'overflow-y'].map(k => [k, document.body.style.getPropertyValue(k), document.body.style.getPropertyPriority(k)]));
        // Disposable causal A/B, NOT an accepted repair. Revert before the next user action.
        await page.evaluate(() => { document.body.style.overflowX = 'clip'; document.body.style.overflowY = 'visible'; });
        const diagnostic = await measure();
        await page.screenshot({ path: `${OUT}/cont15-sticky-diagnostic-not-fix-${width}-${colorScheme}.png` });
        await page.evaluate(original => { for (const [k, v, priority] of original) { if (v) document.body.style.setProperty(k, v, priority); else document.body.style.removeProperty(k); } }, original);
        const restored = await measure();
        rows.push({ id: `sticky-ab-${width}-${colorScheme}`, before, diagnostic, restored, mutation: 'disposable browser CSS only; restored, no Product edit' });
        const targets = await page.locator('.dossier-nav a').evaluateAll(links => links.map(a => [a.hash, !!document.querySelector(a.hash)]));
        await activate(page.locator('.dossier-nav a[href="#timeline"]'));
        rows.push({ id: `anchor-control-${width}-${colorScheme}`, financeReached, nextHash: await page.evaluate(() => location.hash), targets });
      }
      rows.push({ id: `errors${tag}`, pageErrors: errors, consoleErrors, failed });
    } finally { await context.close(); }
  }
  const text = rows.map(row => JSON.stringify(row)).join('\n') + '\n';
  writeFileSync(`${OUT}/genealogy-reopen-and-journal.jsonl`, text);
  console.log(`CAPTURE_DONE: ${rows.length} records; not a product PASS. ${OUT}/genealogy-reopen-and-journal.jsonl`);
} catch (error) {
  writeFileSync(`${OUT}/genealogy-reopen-and-journal-INCOMPLETE.jsonl`, rows.map(row => JSON.stringify(row)).join('\n'));
  throw error;
} finally { await browser.close(); }
