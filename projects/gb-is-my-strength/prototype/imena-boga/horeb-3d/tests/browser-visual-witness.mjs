// Deterministic screenshot witness for all 8 HOREB zones.
// It checks that a *newly rendered frame* follows each zone transition;
// a correct state label without a WebGL frame is not visual evidence.
// Images are CI artifacts for human art direction, NOT aesthetic PASS claims.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const chromePaths = [
  process.env.HOREB_BROWSER_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const chromePath = chromePaths.find((path) => existsSync(path));
if (!chromePath) throw new Error('Visual witness cannot run: Chrome binary missing.');
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const output = join(process.cwd(), '.test-build');
const shots = join(output, 'screenshots');
mkdirSync(shots, { recursive: true });
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');

const witness = {
  timestamp: new Date().toISOString(),
  browser: chromePath,
  renderingMode: process.env.HOREB_SWIFTSHADER === '1' ? 'software-SwiftShader' : 'browser-default-not-verified-GPU',
  desktop: [], mobile: [], closeBush: null, errors: [],
};
const browser = await puppeteer.launch({
  executablePath: chromePath, headless: true, args, protocolTimeout: 90000,
});
const attachErrors = (page, prefix) => {
  page.on('pageerror', (err) => witness.errors.push(prefix + ': ' + err.message));
  page.on('response', (response) => {
    if (response.status() >= 400) witness.errors.push(prefix + ': HTTP ' + response.status() + ' ' + response.url());
  });
};
const startWorld = async (page) => {
  // New pages in one Chromium browser can share HTTP cache. A conditional
  // navigation may return 304 even though the scene is fine; demand a fresh
  // document response for each independent visual witness instead.
  await page.setCacheEnabled(false);
  const response = await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
  if (response?.status() !== 200) throw new Error('Unexpected intro HTTP status ' + response?.status());
  const clicked = await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')]
      .find((element) => element.textContent.includes('Начать путешествие'));
    button?.click();
    return !!button;
  });
  if (!clicked) throw new Error('WebGL start button missing');
  await page.waitForFunction(() => !!window.__horeb?.world && !!window.__horeb?.state(), { timeout: 90000 });
};
const waitForRenderedFrame = async (page, before, zone) => {
  await page.waitForFunction(({ previousFrame, expectedZone }) => {
    const debug = window.__horeb;
    return !!debug && debug.state()?.zone === expectedZone &&
      debug.world.renderer.info.render.frame > previousFrame;
  }, { polling: 200, timeout: 60000 }, { previousFrame: before, expectedZone: zone });
};
const captureZone = async (page, zone, prefix) => {
  const priorFrame = await page.evaluate(() => window.__horeb.world.renderer.info.render.frame);
  await page.evaluate((index) => window.__horeb.world.teleportZone(index), zone);
  await waitForRenderedFrame(page, priorFrame, zone);
  const state = await page.evaluate(() => {
    const s = window.__horeb.state();
    const world = window.__horeb.world;
    return {
      zone: s.zone, fps: s.fps, calls: s.calls, triangles: s.tris,
      quality: world.settings.quality, pixelRatio: world.renderer.getPixelRatio(),
      frame: world.renderer.info.render.frame,
    };
  });
  const file = 'visual-' + prefix + '-zone-' + zone + '.png';
  await page.screenshot({ path: join(shots, file) });
  return { requestedZone: zone, screenshot: file, ...state };
};
try {
  const desktop = await browser.newPage();
  attachErrors(desktop, 'desktop');
  await desktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await startWorld(desktop);
  for (let zone = 0; zone < 8; zone++) {
    const evidence = await captureZone(desktop, zone, 'desktop');
    witness.desktop.push(evidence);
    console.log('PASS desktop zone ' + zone + ' screenshot ' + evidence.screenshot);
  }
  // The arrival screenshot is far from the bush. Capture the physical outer
  // boundary as a second, strictly shod view; never bypass the sacred perimeter.
  const beforeClose = await desktop.evaluate(() => window.__horeb.world.renderer.info.render.frame);
  await desktop.evaluate(() => window.__horeb.world.teleportTo(0, -351));
  await desktop.waitForFunction((frame) => {
    const w = window.__horeb?.world, state = window.__horeb?.state();
    return !!w && !!state && state.zone === 7 &&
      state.distBush >= 14 && state.distBush < 17 &&
      w.renderer.info.render.frame > frame;
  }, { polling: 200, timeout: 60000 }, beforeClose);
  await desktop.screenshot({ path: join(shots, 'visual-desktop-bush-boundary.png') });
  witness.closeBush = await desktop.evaluate(() => {
    const world = window.__horeb.world;
    const hud = document.querySelector('.hud');
    return {
      distance: window.__horeb.state().distBush,
      shoes: window.__horeb.state().shoes,
      zone: window.__horeb.state().zone,
      hudOpacity: hud ? Number(getComputedStyle(hud).opacity) : 0,
      ambientIntensity: world.ambient.intensity,
      hemisphereIntensity: world.hemi.intensity,
      moonIntensity: world.moon.intensity,
    };
  });
  if (witness.closeBush.hudOpacity < 0.99)
    throw new Error('BUSH UX: navigation becomes translucent at the sacred boundary');
  if (witness.closeBush.ambientIntensity < 0.70 ||
      witness.closeBush.hemisphereIntensity < 0.90 ||
      witness.closeBush.moonIntensity < 1.00)
    throw new Error('BUSH VISUAL: outdoor terrain fill is below audited visibility baseline');
  console.log('PASS outer bush boundary screenshot, legible navigation and predawn fill');
  await desktop.close();

  const mobile = await browser.newPage();
  attachErrors(mobile, 'mobile-emulation');
  await mobile.setViewport({
    width: 390, height: 844, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
  });
  await startWorld(mobile);
  for (const zone of [0, 4, 7]) {
    const evidence = await captureZone(mobile, zone, 'mobile-emulation');
    witness.mobile.push(evidence);
    console.log('PASS mobile-emulated zone ' + zone + ' screenshot ' + evidence.screenshot);
  }
  await mobile.close();
} catch (error) {
  witness.errors.push('UNCAUGHT: ' + (error?.stack || String(error)));
} finally {
  await browser.close();
  writeFileSync(join(output, 'visual-witness.json'), JSON.stringify(witness, null, 2) + '\n');
}
const ok = witness.desktop.length === 8 && witness.mobile.length === 3 &&
  witness.closeBush?.shoes === 'shod' && witness.errors.length === 0;
console.log('Visual witness: ' + witness.desktop.length + '/8 desktop, ' +
  witness.mobile.length + '/3 mobile-emulated screenshots; errors=' + witness.errors.length +
  '. Software/remote browser snapshots are NOT art-direction approval.');
if (!ok) for (const error of witness.errors) console.error('FAIL ' + error);
process.exitCode = ok ? 0 : 1;
