// Physical Windows/Linux Firefox smoke, optional manual QA.
// Install Firefox and run the isolated Vite preview first.
// This uses camera transitions, not physical walking or human art sign-off.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const executablePath = [
  process.env.HOREB_FIREFOX_PATH,
  'C:/Program Files/Mozilla Firefox/firefox.exe',
  '/usr/bin/firefox',
].filter(Boolean).find((path) => existsSync(path));
if (!executablePath) throw new Error('Firefox is not installed: no fake SKIP/PASS');
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const browser = await puppeteer.launch({
  browser: 'firefox', protocol: 'webDriverBiDi', headless: true,
  executablePath, timeout: 45000,
});
const output = join(process.cwd(), '.test-build');
const shots = join(output, 'screenshots');
mkdirSync(shots, { recursive: true });
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
  // Allow hydration: a click on the unbound initial DOM would be a false failure.
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const clicked = await page.evaluate(() => {
    const button = document.querySelector('button');
    button?.click();
    return !!button;
  });
  if (!clicked) throw new Error('Firefox intro start button missing');
  await page.waitForFunction(() => !!window.__horeb?.state?.(), { timeout: 45000 });
  const zones = [];
  for (let z = 0; z < 8; z++) {
    const before = await page.evaluate((zone) => {
      const w = window.__horeb.world;
      const oldFrame = w.renderer.info.render.frame;
      w.teleportZone(zone); // visual QA only; DO NOT claim pedestrian acceptance
      return oldFrame;
    }, z);
    await page.waitForFunction(({ zone, frame }) =>
      window.__horeb?.state?.()?.zone === zone &&
      window.__horeb.world.renderer.info.render.frame > frame,
      { timeout: 25000 }, { zone: z, frame: before });
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const state = await page.evaluate(() => {
      const w = window.__horeb.world, s = window.__horeb.state();
      return { zone: s.zone, fps: s.fps, calls: s.calls,
        canvasCount: document.querySelectorAll('canvas').length,
        contextLost: w.renderer.getContext().isContextLost(),
        webgl2: w.renderer.getContext() instanceof WebGL2RenderingContext };
    });
    if (state.zone !== z || state.canvasCount !== 1 || state.contextLost || !state.webgl2)
      throw new Error('Firefox scene failed: ' + JSON.stringify(state));
    if (z === 0 || z === 4 || z === 7)
      await page.screenshot({ path: join(shots, 'firefox-zone-' + z + '.png') });
    zones.push(state);
    console.log('PASS Firefox zone ' + z + ' ' + JSON.stringify(state));
  }
  if (errors.length) throw new Error('Firefox runtime errors: ' + JSON.stringify(errors));
  writeFileSync(join(output, 'firefox-witness.json'), JSON.stringify({
    browser: executablePath, viewport: '1366x768',
    method: 'camera-only, not a pedestrian route', zones, errors,
  }, null, 2) + '\n');
  console.log('FIREFOX 8/8 PASS: WebGL2, 1 canvas, no context loss or runtime error');
} finally {
  await browser.close();
}
