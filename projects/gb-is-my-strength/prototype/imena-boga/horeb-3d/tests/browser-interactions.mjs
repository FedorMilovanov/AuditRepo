// Browser interaction test: FPS profiling, exhibit interaction, bush approach,
// WebGL renderer info, memory check. Uses Sparticuz Chromium 153 + puppeteer-core.
// FPS is informational only — SwiftShader software rendering is expected to be slow.
//
// Usage: LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-interactions.mjs
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

const CHROME = process.env.HOREB_BROWSER_PATH || '/tmp/chromium';
const BASE = process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173';
const SHOTS = join(process.cwd(), '.test-build/screenshots');

if (!existsSync(SHOTS)) mkdirSync(SHOTS, { recursive: true });

const args = [
  '--no-sandbox', '--disable-setuid-sandbox',
  '--disable-gpu', '--disable-dev-shm-usage',
  '--single-process', '--no-zygote',
  '--headless=shell',
  '--window-size=1440,900',
  '--allow-running-insecure-content',
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

// ── 1. Enter 3D world
await page.goto(BASE + '/?e2e', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => {
  const btns = document.querySelectorAll('button');
  for (const b of btns) { if (b.textContent.includes('Начать')) { b.click(); return; } }
});
await new Promise(r => setTimeout(r, 5000));
t('entered 3D world with live state', await page.evaluate(() => Boolean(window.__horeb?.world && window.__horeb?.state())));

// ── 2. FPS profiling (informational — SwiftShader is slow)
const fpsResult = await page.evaluate(() => {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    function countFrame() {
      frames++;
      if (performance.now() - start < 3000) {
        requestAnimationFrame(countFrame);
      } else {
        resolve({ frames, elapsed: performance.now() - start, fps: frames / ((performance.now() - start) / 1000) });
      }
    }
    requestAnimationFrame(countFrame);
  });
});
console.log(`  FPS (SwiftShader, informational): ${fpsResult.fps.toFixed(1)} FPS (${fpsResult.frames} frames in ${fpsResult.elapsed.toFixed(0)}ms)`);

// ── 3. Walk forward through corridor
const beforeWalk = await page.evaluate(() => window.__horeb?.state()?.z ?? null);
for (let i = 0; i < 4; i++) {
  await page.keyboard.down('KeyW');
  await new Promise(r => setTimeout(r, 2000));
  await page.keyboard.up('KeyW');
  await new Promise(r => setTimeout(r, 500));
}
await page.screenshot({ path: join(SHOTS, '08-walk-forward.png') });
const afterWalk = await page.evaluate(() => window.__horeb?.state()?.z ?? null);
t('walked forward through corridor', Number.isFinite(beforeWalk) && Number.isFinite(afterWalk) && afterWalk < beforeWalk - 0.1, `z ${beforeWalk} -> ${afterWalk}`);

// ── 4. Check interaction prompt system
const promptSystemReady = await page.evaluate(() => {
  const state = window.__horeb?.state();
  return Boolean(state && Object.prototype.hasOwnProperty.call(state, 'prompt') &&
    window.__horeb?.world?.exhibitPos?.length === 42);
});
t('interactive World prompt state wired to all 42 exhibit markers', promptSystemReady);

// ── 5. Try interact (press E)
await page.keyboard.press('KeyE');
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: join(SHOTS, '09-interact.png') });

// ── 6. Walk toward bush area
for (let i = 0; i < 6; i++) {
  await page.keyboard.down('KeyW');
  await new Promise(r => setTimeout(r, 2000));
  await page.keyboard.up('KeyW');
  await new Promise(r => setTimeout(r, 500));
}
await page.screenshot({ path: join(SHOTS, '10-bush-area.png') });

// ── 7. WebGL renderer info
const rendererInfo = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  if (!c) return { found: false };
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  if (!gl) return { found: true, hasGL: false };
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return {
    found: true, hasGL: true,
    renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown',
  };
});
t('WebGL renderer: SwiftShader software rendering', rendererInfo.found && rendererInfo.hasGL, rendererInfo.renderer || 'no GL');

// ── 8. Memory check
const memInfo = await page.evaluate(() => {
  if (performance.memory) {
    return {
      used: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
      total: (performance.memory.totalJSHeapSize / 1048576).toFixed(1),
    };
  }
  return null;
});
if (memInfo) {
  t('JS heap memory under 100MB', parseFloat(memInfo.used) < 100, `${memInfo.used} MB used / ${memInfo.total} MB total`);
} else {
  console.log('INFO: JS heap metric unavailable; memory gate NOT VERIFIED');
}

// ── 9. Reader mode deep test
await page.goto(BASE + '/reader.html', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
const readerContent = await page.evaluate(() => document.body.innerText.length);
t('reader.html has substantial content', readerContent > 500, `${readerContent} chars`);
const readerEntries = await page.evaluate(() => document.querySelectorAll('article, section, .entry, h2, h3').length);
t('reader.html has structured entries', readerEntries > 10, `${readerEntries} elements`);

// ── 10. Noscript fallback
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(() => { /* JS is enabled, just check noscript content */ });
const noscriptContent = await page.evaluate(() => {
  const ns = document.querySelector('noscript');
  return ns ? ns.textContent.length : 0;
});
t('noscript fallback content exists', noscriptContent > 0, `${noscriptContent} chars`);

// ── 11. No console errors
t('no console errors throughout', consoleErrors.length === 0, consoleErrors.slice(0, 3).join('; '));

// Screenshot sizes
const shots = ['08-walk-forward.png', '09-interact.png', '10-bush-area.png'];
let totalSize = 0;
for (const s of shots) {
  const p = join(SHOTS, s);
  if (existsSync(p)) totalSize += statSync(p).size;
}
console.log(`\nInteraction screenshots: ${(totalSize / 1024).toFixed(1)} KB across ${shots.length} files`);

await browser.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
