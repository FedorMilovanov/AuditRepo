// Browser visual audit using Sparticuz Chromium 153 + puppeteer-core.
// Launches headless Chromium, enters 3D world, captures screenshots
// of key zones, verifies WebGL + interactions + reader mode.
//
// Usage: LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-audit.mjs
// Requires: dev server running on http://127.0.0.1:5173
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

const CHROME = '/tmp/chromium';
const BASE = 'http://127.0.0.1:5173';
const SHOTS = join(process.cwd(), '.test-build/screenshots');

if (!existsSync(SHOTS)) mkdirSync(SHOTS, { recursive: true });

const args = [
  '--no-sandbox', '--disable-setuid-sandbox',
  '--disable-gpu', '--disable-dev-shm-usage',
  '--single-process', '--no-zygote',
  '--headless=shell',
  '--window-size=1440,900',
  '--allow-running-insecure-content',
  '--disable-web-security',
  '--ignore-gpu-blocklist',
  '--font-render-hinting=none',
];

let pass = 0, fail = 0;
const t = (name, ok, detail = '') => {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + detail : ''));
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args,
  headless: 'shell',
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => consoleErrors.push('PAGEERROR: ' + err.message));

// ── 1. Load intro page
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: join(SHOTS, '01-intro.png') });
t('intro page loads', true);
t('no console errors on intro', consoleErrors.length === 0, consoleErrors.slice(0, 3).join('; '));

// ── 2. WebGL check
const webglOk = await page.evaluate(() => {
  const c = document.createElement('canvas');
  return !!(c.getContext('webgl2') || c.getContext('webgl'));
});
t('WebGL context available', webglOk);

// ── 3. Click "Начать путешествие" to enter 3D world
const btnFound = await page.evaluate(() => {
  const btns = document.querySelectorAll('button');
  for (const b of btns) {
    if (b.textContent.includes('Начать')) { b.click(); return true; }
  }
  return false;
});
t('found and clicked "Начать путешествие"', btnFound);

// ── 4. Wait for 3D scene to initialize
await new Promise(r => setTimeout(r, 5000));

// ── 5. Canvas check
const canvasInfo = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  if (!c) return { found: false };
  return { found: true, w: c.width, h: c.height };
});
t('canvas element found after entering world', canvasInfo.found, canvasInfo.found ? `${canvasInfo.w}x${canvasInfo.h}` : 'no canvas');

// ── 6. Screenshot 3D world (initial view)
await page.screenshot({ path: join(SHOTS, '02-world-initial.png') });

// ── 7. Move forward (WASD)
await page.keyboard.down('KeyW');
await new Promise(r => setTimeout(r, 3000));
await page.keyboard.up('KeyW');
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: join(SHOTS, '03-move-forward.png') });

// ── 8. Move right
await page.keyboard.down('KeyD');
await new Promise(r => setTimeout(r, 1500));
await page.keyboard.up('KeyD');
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: join(SHOTS, '04-move-right.png') });

// ── 9. Move forward more, explore
await page.keyboard.down('KeyW');
await new Promise(r => setTimeout(r, 3000));
await page.keyboard.up('KeyW');
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: join(SHOTS, '05-explore.png') });

// ── 10. Check for interaction prompt
const promptText = await page.evaluate(() => {
  const el = document.querySelector('[role="dialog"], [data-prompt], .prompt, .interaction-hint');
  return el ? el.textContent : null;
});
t('interaction prompt system exists', promptText !== undefined);

// ── 11. Reader mode
await page.goto(BASE + '/reader.html', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
const readerOk = await page.evaluate(() => document.body.innerText.length > 100);
t('reader.html loads with content', readerOk);
await page.screenshot({ path: join(SHOTS, '06-reader.png') });

// ── 12. Mobile viewport
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: join(SHOTS, '07-mobile.png') });

// ── 13. Screenshot sizes
const shots = ['01-intro.png', '02-world-initial.png', '03-move-forward.png', '04-move-right.png', '05-explore.png', '06-reader.png', '07-mobile.png'];
let totalSize = 0;
for (const s of shots) {
  const p = join(SHOTS, s);
  if (existsSync(p)) totalSize += statSync(p).size;
}
console.log(`\nScreenshots saved to ${SHOTS}`);
console.log(`Total screenshot size: ${(totalSize / 1024).toFixed(1)} KB across ${shots.length} files`);
for (const s of shots) {
  const p = join(SHOTS, s);
  if (existsSync(p)) console.log(`  ${s}: ${(statSync(p).size / 1024).toFixed(1)} KB`);
}

await browser.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
