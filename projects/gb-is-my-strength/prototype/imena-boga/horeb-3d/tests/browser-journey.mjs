// End-to-end pedestrian witness. Every metre is traversed by production
// keyboard motion and WebGL frames: no teleport, direct position mutation,
// controller bypass or synthetic clock fast-forward.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const chrome = [process.env.HOREB_BROWSER_PATH, process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find((p) => p && existsSync(p));
if (!chrome) throw new Error('JOURNEY BLOCKED: real Chromium executable required');
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const output = join(process.cwd(), '.test-build');
const screenshots = join(output, 'screenshots');
mkdirSync(screenshots, { recursive: true });
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');
const browser = await puppeteer.launch({ executablePath: chrome, headless: true,
  args, protocolTimeout: 120000 });
const evidence = { source: 'physical keyboard / active animation loop',
  rendering: process.env.HOREB_SWIFTSHADER === '1' ? 'SwiftShader (not hardware performance proof)' : 'browser default',
  forward: [], reverse: [], samples: [], errors: [], screenshots: [] };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let page;
const state = () => page.evaluate(() => {
  const w = window.__horeb?.world;
  if (!w) return null;
  const p = w.position;
  const s = window.__horeb.state();
  return { x: p.x, z: p.z, zone: s?.zone, shoes: w.shoes,
    frame: w.renderer.info.render.frame, fps: w.fps,
    blocked: s?.block, inputLocked: w.inputLocked, contextLost: w.contextLost,
    distance: Math.hypot(p.x, p.z + 366), simTime: w.t };
});
const requireState = (s, label) => {
  if (!s || !Number.isFinite(s.x) || !Number.isFinite(s.z) ||
      Math.abs(s.x) > 26 || s.contextLost ||
      s.distance < (s.shoes === 'unshod' ? 6.48 : 13.98))
    throw new Error('JOURNEY unsafe or missing world at ' + label + ': ' + JSON.stringify(s));
};
const travel = async (label, key, targetZ, direction, timeout = 200000) => {
  await page.keyboard.down(key);
  const start = Date.now();
  let prev = await state(), lastMotion = Date.now();
  let sampleAt = Date.now();
  try {
    while (Date.now() - start < timeout) {
      await sleep(200);
      const s = await state();
      requireState(s, label);
      if (Math.abs(s.z - prev.z) > 0.08) lastMotion = Date.now();
      if (Date.now() - sampleAt > 2500) {
        evidence.samples.push({ label, ...s });
        sampleAt = Date.now();
      }
      if ((s.z - targetZ) * direction >= 0) {
        evidence[direction < 0 ? 'forward' : 'reverse'].push({ label, ...s });
        return s;
      }
      if (Date.now() - lastMotion > 15000) {
        throw new Error('JOURNEY STALLED after 15 seconds (' + label + ', '
          + key + '): ' + JSON.stringify({ targetZ, state: s }));
      }
      prev = s;
    }
    throw new Error('JOURNEY TIMEOUT ' + label + ' target z=' + targetZ +
      ' state=' + JSON.stringify(await state()));
  } finally {
    await page.keyboard.up(key);
  }
};

try {
  page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 640, height: 480, deviceScaleFactor: 1 });
  page.on('pageerror', (err) => evidence.errors.push('pageerror: ' + err.message));
  page.on('console', (m) => { if (m.type() === 'error') evidence.errors.push('console: ' + m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) evidence.errors.push('HTTP ' + r.status() + ' ' + r.url()); });
  const response = await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (response?.status() !== 200) throw new Error('Intro HTTP ' + response?.status());
  const started = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((b) =>
      /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()));
    b?.click(); return !!b;
  });
  if (!started) throw new Error('Journey intro start button missing');
  await page.waitForFunction(() => !!window.__horeb?.world && !!window.__horeb?.state(),
    { polling: 200, timeout: 90000 });
  const initial = await state();
  requireState(initial, 'spawn');
  if (Math.abs(initial.z + 2) > 0.5 || initial.shoes !== 'shod')
    throw new Error('Unexpected starting state ' + JSON.stringify(initial));
  const forward = [
    ['zone-1', -8, 1], ['zone-2', -68, 2], ['zone-3', -122, 3],
    ['zone-4', -178, 4], ['zone-5', -235, 5],
    ['zone-6', -290, 6], ['zone-7', -326, 7],
    ['outer-threshold', -350.2, 7],
  ];
  for (const [label, target, zone] of forward) {
    const s = await travel(label, 'w', target, -1);
    if (s.zone !== zone) throw new Error('Wrong zone at ' + label + ': ' + JSON.stringify(s));
    if (Math.abs(s.x) > 2.5) throw new Error('Unexpected lateral displacement at ' + label + ': ' + s.x);
    if (zone === 6) {
      await page.waitForFunction(() =>
        !!document.querySelector('[data-testid="quiet-menu"]') &&
        !document.querySelector('[data-testid="journey-progress-hud"]') &&
        !document.querySelector('[data-testid="world-keyboard-help"]'), { timeout: 5000 });
      // Keep all secondary features reachable even when the scene is calmer.
      await page.click('[data-testid="quiet-menu"]');
      await page.waitForFunction(() => !!document.querySelector('[role="dialog"][aria-label="Управление экспозицией"]'),
        { timeout: 5000 });
      const access = await page.evaluate(() => {
        const menu = document.querySelector('[role="dialog"][aria-label="Управление экспозицией"]');
        const labels = [...menu.querySelectorAll('button')].map((b) => (b.textContent || '').trim());
        const help = menu.querySelector('[data-testid="world-controls-help"]')?.textContent || '';
        return ['Схема маршрута','Настройки доступности','Источники и ограничения',
          'Читать экспозицию','Выйти из прогулки'].every((name) => labels.includes(name)) &&
          help.includes('W A S D') && help.includes('Esc') && help.includes('F');
      });
      if (!access) throw new Error('QUIET HUD blocked accessible navigation');
      await page.click('[role="dialog"] button[aria-label="Закрыть (Esc)"]');
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 5000 });
      console.log('PASS zone-six calm HUD with full accessible menu in physical journey');
    }
    const file = 'journey-forward-' + label + '.png';
    await page.screenshot({ path: join(screenshots, file) });
    evidence.screenshots.push(file);
    console.log('PASS physical walk ' + label + ' z=' + s.z.toFixed(2) + ' frame=' + s.frame);
  }
  await page.keyboard.press('e'); // real interaction: remove sandals only in reach of the threshold
  await page.waitForFunction(() => window.__horeb?.world?.shoes === 'unshod',
    { polling: 200, timeout: 60000 });
  let barefoot = await state();
  requireState(barefoot, 'after sandals');
  if (!barefoot || barefoot.shoes !== 'unshod' || barefoot.distance < 6.5)
    throw new Error('Sandal gate failed ' + JSON.stringify(barefoot));
  await travel('inner-approach', 'w', -358.2, -1, 60000);
  // Deliberately approach the physical inner guard without crossing it.
  await page.keyboard.down('w'); await sleep(3500); await page.keyboard.up('w');
  barefoot = await state();
  requireState(barefoot, 'inner guard');
  if (barefoot.distance < 6.48 || barefoot.distance > 8)
    throw new Error('Inner boundary not enforced at arrival: ' + JSON.stringify(barefoot));
  await page.screenshot({ path: join(screenshots, 'journey-inner-boundary.png') });
  evidence.screenshots.push('journey-inner-boundary.png');
  console.log('PASS real input at holy inner guard: ' + barefoot.distance.toFixed(2) + 'm');

  // Return through every threshold by genuine reverse keyboard travel.
  // Reverse locomotion tests the same collision/navigation system and does
  // not shortcut the original route through any debug helper.
  const reverse = [
    ['return-6', -316, 6], ['return-5', -284, 5],
    ['return-4', -225, 4], ['return-3', -167, 3],
    ['return-2', -112, 2], ['return-1', -58, 1],
    ['return-0', -2.8, 0],
  ];
  for (const [label, target, zone] of reverse) {
    const s = await travel(label, 's', target, 1);
    if (s.zone !== zone) throw new Error('Wrong return zone ' + label + ': ' + JSON.stringify(s));
    if (zone === 5) {
      await page.waitForFunction(() =>
        !document.querySelector('[data-testid="quiet-menu"]') &&
        !!document.querySelector('[data-testid="journey-progress-hud"]'), { timeout: 5000 });
      console.log('PASS normal navigation restored after returning from quiet passage');
    }
    console.log('PASS physical return ' + label + ' z=' + s.z.toFixed(2));
  }
  const finish = await state();
  if (Math.abs(finish.z - initial.z) > 2.0 || evidence.errors.length)
    throw new Error('Journey return/runtime errors: ' + JSON.stringify({ finish, errors: evidence.errors }));
  console.log('PASS FULL PEDESTRIAN OUT-AND-BACK 8 zones, no teleport, shoes safe, Chrome runtime errors=0');
} catch (error) {
  evidence.failure = String(error?.stack || error);
  console.error(evidence.failure);
  process.exitCode = 1;
} finally {
  if (page) {
    try { await page.keyboard.up('w'); await page.keyboard.up('s'); } catch { /* close */ }
  }
  writeFileSync(join(output, 'journey-witness.json'), JSON.stringify(evidence, null, 2));
  await browser.close();
}
