// Diagnostic A/B only: no Product mutation and no shippable CSS fix. Native click/tap is never forced.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8099', OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] }), rows = [];
async function snapshot(page) {
  return page.evaluate(() => {
    const size = s => { const e = document.querySelector(s), r = e.getBoundingClientRect(), c = getComputedStyle(e);
      return { h: r.height, position: c.position, height: c.height, minHeight: c.minHeight, aspectRatio: c.aspectRatio }; };
    const e = document.querySelector('#quizLaunch'), r = e.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { mediaReduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
      targetHit: hit === e || e.contains(hit), hitClass: hit?.className,
      card: size('.heart-flip-card'), inner: size('.heart-flip-inner'), front: size('.heart-flip-front'), back: size('.heart-flip-back') };
  });
}
try {
  for (const width of [1440, 390]) for (const motion of ['reduce', 'no-preference']) {
    const c = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width === 390,
      hasTouch: width === 390, colorScheme: 'light', reducedMotion: motion, serviceWorkers: 'block' });
    try {
      const page = await c.newPage(), url = BASE + '/articles/krajne-li-isporcheno-serdce/';
      const ready = async () => { await page.goto(url, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready);
        await page.locator('#quizLaunch').scrollIntoViewIfNeeded(); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); };
      const activate = () => width === 390 ? page.locator('#quizLaunch').tap({ timeout: 1500 }) : page.locator('#quizLaunch').click({ timeout: 1500 });
      await ready(); const before = await snapshot(page);
      let nativeOpened = false;
      try { await activate(); nativeOpened = await page.locator('#quizPlaceholder .quiz-wrapper').isVisible(); } catch (e) {
        if (e.name !== 'TimeoutError') throw e;
      }
      rows.push({ id: `card-control-${width}-${motion}`, width, motion, nativeOpened, ...before });
      if (motion === 'no-preference') { if (!nativeOpened || !before.targetHit) throw new Error('Normal-motion control failed'); continue; }
      if (nativeOpened || before.targetHit) throw new Error('Reduced-motion blocker did not reproduce');
      await page.screenshot({ path: `${OUT}/card-blocked-${width}.png` });
      const style = await page.addStyleTag({ content: '.heart-flip-card,.heart-flip-inner{height:auto!important;aspect-ratio:auto!important;}' });
      await page.locator('#quizLaunch').scrollIntoViewIfNeeded();
      const changed = await snapshot(page); await activate();
      const diagnosticOpened = await page.locator('#quizPlaceholder .quiz-wrapper').isVisible();
      if (!changed.targetHit || !diagnosticOpened) throw new Error('Disposable static-height A/B did not restore native activation');
      await style.evaluate(e => e.remove()); await ready(); const restored = await snapshot(page);
      if (restored.targetHit) throw new Error('Original blocker did not return after removing diagnostic CSS and reload');
      rows.push({ id: `card-ab-${width}`, width, diagnosticOpened, changed, restored });
    } finally { await c.close(); }
  }
  writeFileSync(`${OUT}/card-motion.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log('CARD_MOTION_CAPTURE_DONE: 4 motion controls + 2 reversible A/B; not a Product fix');
} catch (e) {
  writeFileSync(`${OUT}/card-motion-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); throw e;
} finally { await browser.close(); }
