// Exact-build quiz traversal. Run WIDTH=1440 / 390 in the browser workspace; capture is not global Product PASS.
import { chromium } from 'playwright-core';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8099', DIST = process.env.DIST || '/home/user/gbs-src/dist';
const OUT = process.env.OUT || './out', widths = process.env.WIDTH ? [Number(process.env.WIDTH)] : [1440, 390];
const routes = readdirSync(DIST, { recursive: true }).filter(p => p.endsWith('index.html'))
  .filter(p => /["']?quiz["']?\s*:\s*\{\s*["']?questions["']?\s*:/.test(readFileSync(`${DIST}/${p}`, 'utf8')))
  .map(p => '/' + p.slice(0, -'index.html'.length)).sort();
if (routes.length !== 23) throw new Error(`Quiz census changed: ${routes.length}; inspect rather than silently skip`);
const axe = readFileSync('./axe.min.js', 'utf8'), rows = [];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
try {
  for (const width of widths) for (const scheme of (process.env.SCHEME ? [process.env.SCHEME] : ['light', 'dark'])) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1,
      serviceWorkers: 'block', reducedMotion: 'reduce', colorScheme: scheme, locale: 'ru-RU' });
    try {
      await context.addInitScript(() => {
        window.__perf = { lcp: 0, cls: 0 };
        new PerformanceObserver(l => { for (const e of l.getEntries()) window.__perf.lcp = Math.max(window.__perf.lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = [], consoleKinds = {};
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => {
        if (m.type() !== 'error') return;
        const text = m.text(), url = m.location().url || '';
        const kind = text.includes('Content Security Policy') && text.includes('https://gospod-bog.ru/') ? 'pinned-asset-csp'
          : url.startsWith('https://mc.yandex.ru/') ? 'sandbox-metrika' : 'other';
        consoleKinds[kind] = (consoleKinds[kind] || 0) + 1;
        if (kind === 'other') errors.push(text);
      });
      let seeded = false, sampledGill = false, sampledControl = false, negativeDone = false;
      for (const route of routes) {
        errors.length = 0; for (const k of Object.keys(consoleKinds)) delete consoleKinds[k];
        await page.goto(BASE + route, { waitUntil: 'load' });
        if (!seeded) {
          await page.waitForFunction(() => window.GBReaderPreferences?.version === 1);
          await page.evaluate(theme => window.GBReaderPreferences.set({ theme }), scheme); seeded = true;
        }
        await page.waitForFunction(theme => document.documentElement.dataset.readerTheme === theme, scheme);
        const host = page.locator('#quizPlaceholder'), panel = host.locator('.quiz-wrapper');
        await host.locator('#quizLaunch').waitFor({ state: 'visible' });
        const config = await page.evaluate(() => ({
          questions: window.SITE_CONFIG.quiz.questions.filter(q => q && Array.isArray(q.options) && q.options.length >= 2).length,
          underGill: !!document.querySelector('#quizPlaceholder')?.closest('[data-gill-v16]') }));
        if (!config.questions || config.questions > 50) throw new Error(`Unexpected question count: ${route}`);
        let pointerPass = true;
        const keyboardActivate = async target => {
          await target.focus();
          if (!(await target.evaluate(e => document.activeElement === e))) throw new Error('Keyboard recovery did not focus target');
          await page.keyboard.press('Enter');
        };
        const activate = async target => {
          if (!pointerPass) return keyboardActivate(target); // Diagnostic recovery, explicitly NOT pointer PASS.
          try { if (width === 390) await target.tap({ timeout: 2000 }); else await target.click({ timeout: 2000 }); }
          catch (error) {
            pointerPass = false;
            const blocker = await target.evaluate(e => {
              const r = e.getBoundingClientRect(), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
              return { target: e.id || e.className, x: r.x, y: r.y, w: r.width, h: r.height,
                hitTag: hit?.tagName, hitClass: hit?.className, heartFlip: !!hit?.closest('.heart-flip-wrap') };
            });
            rows.push({ id: `quiz-pointer-blocked-${width}-${scheme}-${route}`, route, error: error.name, ...blocker });
            await page.screenshot({ path: `${OUT}/quiz-blocked-${width}-${scheme}.png` });
            await keyboardActivate(target);
          }
        };
        await activate(host.locator('#quizLaunch')); await page.evaluate(() => document.fonts.ready);
        const sampled = config.underGill ? !sampledGill : !sampledControl;
        if (sampled) {
          await page.evaluate(axe);
          const violations = await page.evaluate(async () => (await window.axe.run(document)).violations.map(v => [v.id, v.nodes.length]));
          // The representative screenshot is taken after answer 1, when the actual next button exists.
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
          rows.push({ id: `quiz-health-${width}-${scheme}-${config.underGill ? 'gill' : 'control'}`, route, axe: violations,
            ...(await page.evaluate(() => ({ ...window.__perf, fonts: document.fonts.status,
              overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }))) });
          if (config.underGill) sampledGill = true; else sampledControl = true;
        }
        let literalFrames = 0, minWidth = Infinity, minHeight = Infinity;
        for (let index = 0; index < config.questions; index++) {
          const progress = await panel.locator('.quiz-progress').textContent();
          if (progress !== `Вопрос ${index + 1} из ${config.questions}`) throw new Error(`Question progress mismatch: ${route}`);
          const option = panel.locator('.quiz-option').first();
          if (index === 0) { await option.focus(); await page.keyboard.press('Enter'); } else await activate(option);
          if (/<\/?(?:em|span)(?:\s|>)/i.test(await panel.innerText())) literalFrames++;
          const next = panel.locator('.quiz-next'); await next.waitFor({ state: 'visible' });
          const box = await next.boundingBox(); minWidth = Math.min(minWidth, box.width); minHeight = Math.min(minHeight, box.height);
          if (width === 390 && config.underGill && !negativeDone) {
            const style = await page.addStyleTag({ content: '[data-gill-v16] .quiz-next { display:none; }' });
            const hidden = !(await next.isVisible()); await style.evaluate(n => n.remove());
            await next.waitFor({ state: 'visible' }); if (!hidden) throw new Error('Old broad-rule negative control did not fail');
            rows.push({ id: `quiz-negative-${width}-${scheme}`, route, oldBroadRuleHidden: hidden, restored: true }); negativeDone = true;
          }
          if (index === 0 && sampled) {
            await next.scrollIntoViewIfNeeded(); await page.evaluate(() => document.fonts.ready);
            await page.screenshot({ path: `${OUT}/quiz-${width}-${scheme}-${config.underGill ? 'gill' : 'control'}.png` });
          }
          if (index === 0) { await next.focus(); await page.keyboard.press('Enter'); } else await activate(next);
        }
        const result = await panel.locator('.quiz-progress').textContent();
        if (!result.startsWith('Результат:')) throw new Error(`No result: ${route}`);
        await activate(panel.getByRole('button', { name: /^Пройти ещё раз$/i }));
        const restart = await panel.locator('.quiz-progress').textContent();
        if (restart !== `Вопрос 1 из ${config.questions}`) throw new Error(`Restart failed: ${route}`);
        rows.push({ id: `quiz-flow-${width}-${scheme}-${route}`, ...config, route, result: true, restart: true,
          firstQuestionKeyboard: true, pointerPass, keyboardOnlyRecovery: !pointerPass, literalFrames, nextMinWidth: minWidth, nextMinHeight: minHeight,
          consoleKinds: structuredClone(consoleKinds), errors: [...errors] });
        if (errors.length) throw new Error(`Unexpected browser error: ${route}`);
      }
    } finally { await context.close(); }
  }
  writeFileSync(`${OUT}/quiz-${process.env.WIDTH || 'all'}-${process.env.SCHEME || 'both'}.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log(`QUIZ_RECHECK_DONE: ${rows.filter(r => r.id.startsWith('quiz-flow-')).length} result/restart captures; pointer failures/recovery are explicit, not global Product PASS`);
} catch (error) {
  writeFileSync(`${OUT}/quiz-${process.env.WIDTH || 'all'}-${process.env.SCHEME || 'both'}-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); throw error;
} finally { await browser.close(); }
