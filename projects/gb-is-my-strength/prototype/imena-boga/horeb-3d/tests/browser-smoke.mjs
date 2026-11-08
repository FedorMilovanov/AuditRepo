// Strict headless Chrome browser smoke; no silent PASS/SKIP and no disabled web security.
// HOREB_BASE_URL=http://127.0.0.1:5173 HOREB_BROWSER_PATH=/path/to/chrome npm run test:browser:smoke
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const paths = [process.env.HOREB_BROWSER_PATH, process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/tmp/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean);
const browserPath = paths.find((p) => existsSync(p));
if (!browserPath) throw new Error('BROWSER BLOCKED: Chrome/Chromium not found; set HOREB_BROWSER_PATH');
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const shots = join(process.cwd(), '.test-build', 'screenshots');
mkdirSync(shots, { recursive: true });
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args, protocolTimeout: 90000 });
const failures = [];
let passes = 0;
const check = (name, ok, detail = '') => {
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (detail ? ' — ' + detail : ''));
  if (ok) passes++; else failures.push(name + (detail ? ': ' + detail : ''));
};
const errors = [];
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(75000);
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push('HTTP ' + response.status() + ' ' + response.url());
  });
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const location = m.location();
      errors.push(m.text() + (location.url ? ' @ ' + location.url : ''));
    }
  });
  const response = await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded', timeout: 45000 });
  check('intro HTTP 200', response?.status() === 200, String(response?.status()));
  check('intro title visible', await page.$eval('h1', (h) => h.textContent.includes('ИМЕНА БОГА')).catch(() => false));
  await page.screenshot({ path: join(shots, 'smoke-01-intro.png') });

  await page.evaluate(() => [...document.querySelectorAll('button')]
    .find((b) => b.textContent.includes('Настройки доступности'))?.click());
  check('settings modal opened', (await page.$$('[role="dialog"]')).length === 1);
  check('initial focus remains in modal', await page.evaluate(() =>
    !!document.querySelector('[role="dialog"]')?.contains(document.activeElement)));
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  check('Shift+Tab remains in modal', await page.evaluate(() =>
    !!document.querySelector('[role="dialog"]')?.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  check('Escape closes modal', (await page.$$('[role="dialog"]')).length === 0);

  const start = await page.evaluate(() => [...document.querySelectorAll('button')]
    .find((b) => b.textContent.includes('Начать путешествие'))?.textContent);
  check('WebGL start button available', !!start);
  if (start) {
    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => b.textContent.includes('Начать путешествие'))?.click());
    await page.waitForFunction(() => !!(window.__horeb?.world && window.__horeb?.state()), { timeout: 75000 });
    const before = await page.evaluate(() => ({
      z: window.__horeb.state().z, count: window.__horeb.world.exhibitPos.length,
    }));
    check('42 actual 3D exhibit placements', before.count === 42, String(before.count));
    const labelsByQuality = await page.evaluate(() => {
      let high = 0, low = 0;
      window.__horeb.world.scene.traverse((obj) => {
        if (!obj.isMesh) return;
        const image = obj.material?.map?.image;
        if (image?.width === 640 && image?.height === 900) high++;
        if (image?.width === 384 && image?.height === 540) low++;
      });
      return { high, low, quality: window.__horeb.world.settings.quality };
    });
    const labelsMatch = labelsByQuality.quality === 'high'
      ? labelsByQuality.high === 42 && labelsByQuality.low === 0
      : labelsByQuality.quality === 'low' && labelsByQuality.low === 42 && labelsByQuality.high === 0;
    check('all 42 labels match selected high/low render quality', labelsMatch, JSON.stringify(labelsByQuality));
    // Regression for solid rectangular SpriteMaterial glow panels in all 42 scenes.
    const glowMask = await page.evaluate(() => {
      const uses = new Map();
      window.__horeb.world.scene.traverse((obj) => {
        const tex = obj.isSprite && obj.material?.map;
        if (tex?.image?.width === 128 && tex?.image?.height === 128) uses.set(tex, (uses.get(tex) || 0) + 1);
      });
      const [texture, count] = [...uses.entries()].sort((a, b) => b[1] - a[1])[0] || [];
      const ctx = texture?.image?.getContext?.('2d');
      return { count: count ?? 0, centerAlpha: ctx?.getImageData(64, 64, 1, 1).data[3] ?? -1,
        cornerAlpha: ctx?.getImageData(0, 0, 1, 1).data[3] ?? -1 };
    });
    check('42 scenic glows share a radial alpha mask, not solid square sprites',
      glowMask.count === 42 && glowMask.centerAlpha > 200 && glowMask.cornerAlpha === 0,
      JSON.stringify(glowMask));
    const beacons = await page.evaluate(() => {
      const objects = [];
      window.__horeb.world.scene.traverse((obj) => {
        if (obj.name !== 'original-script-beacon') return;
        objects.push({
          id: obj.userData.exhibitId,
          w: obj.material?.map?.image?.width,
          h: obj.material?.map?.image?.height,
          opacity: obj.material?.opacity,
          depthTest: obj.material?.depthTest,
        });
      });
      return objects;
    });
    const pilotIds = ['elohim','el-elyon','el-shaddai','el-olam','el-roi','yireh','ehyeh','yhwh'];
    const expectedWidth = labelsByQuality.quality === 'high' ? 1024 : 640;
    check('8 original-script pilot beacons retain canonical IDs and canvas resolution',
      beacons.length === 8 && pilotIds.every((id) => beacons.some((b) =>
        b.id === id && b.w === expectedWidth && b.depthTest === true)),
      JSON.stringify(beacons));

    await page.screenshot({ path: join(shots, 'smoke-02-world.png') });

    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 950));
    await page.keyboard.up('KeyW');
    const after = await page.evaluate(() => window.__horeb.state().z);
    // This proves directional movement, not FPS. Software-rendered GitHub Chrome
    // can execute only one animation frame during the test's 950 ms key hold.
    check('W actually moves player forward', after < before.z - 0.025, before.z.toFixed(2) + ' -> ' + after.toFixed(2));

    await page.evaluate(() => [...document.querySelectorAll('button')]
      .find((b) => b.textContent.trim() === 'Настройки')?.click());
    await new Promise((r) => setTimeout(r, 250));
    const freeze = await page.evaluate(() => ({
      t: window.__horeb.world.t, locked: window.__horeb.world.inputLocked,
    }));
    await new Promise((r) => setTimeout(r, 400));
    const frozenAt = await page.evaluate(() => window.__horeb.world.t);
    check('modal pauses GPU animation', freeze.locked && frozenAt === freeze.t);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 450));
    const resumed = await page.evaluate(() => ({
      t: window.__horeb.world.t, locked: window.__horeb.world.inputLocked,
    }));
    check('closing modal resumes animation', !resumed.locked && resumed.t > frozenAt);
  }

  const reader = await page.goto(base + '/reader.html', { waitUntil: 'domcontentloaded', timeout: 45000 });
  const count = await page.$$eval('article[id]', (a) => a.length);
  check('no-JS reader exposes 42 dossiers', reader?.status() === 200 && count === 42,
    'HTTP ' + reader?.status() + ', cards ' + count);
  check('reader has Hebrew RTL', await page.$eval('[lang="he"][dir="rtl"]', () => true).catch(() => false));
  await page.screenshot({ path: join(shots, 'smoke-03-reader.png') });
  await page.close(); // release the desktop WebGL context before mobile QA

  const disabled = await browser.newPage();
  await disabled.evaluateOnNewDocument(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...rest) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(type)) return null;
      return get.call(this, type, ...rest);
    };
  });
  await disabled.goto(base + '/', {waitUntil:'domcontentloaded',timeout:45000});
  check('no-WebGL fallback retains reader', await disabled.evaluate(() =>
    ![...document.querySelectorAll('button')].some((b) => b.textContent.includes('Начать путешествие')) &&
    [...document.querySelectorAll('button')].some((b) => b.textContent.includes('Режим чтения'))));
  await disabled.close();

  const mobile = await browser.newPage();
  await mobile.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await mobile.goto(base + '/?e2e', {waitUntil:'domcontentloaded',timeout:45000});
  const dims = await mobile.evaluate(() => ({document:document.documentElement.scrollWidth, viewport:innerWidth}));
  check('390px intro no horizontal overflow', dims.document <= dims.viewport + 1,
    dims.document + '/' + dims.viewport);
  await mobile.screenshot({path:join(shots,'smoke-04-mobile.png')});
  await mobile.evaluate(() => [...document.querySelectorAll('button')]
    .find((b) => b.textContent.includes('Начать путешествие'))?.click());
  await mobile.waitForFunction(() => !!window.__horeb?.world, {timeout:75000});
  const labels = await mobile.evaluate(() => {
    let small = 0, large = 0;
    window.__horeb.world.scene.traverse((o) => {
      if (!o.isMesh || !o.material?.map?.image) return;
      const {width,height}=o.material.map.image;
      if (width===384 && height===540) small++;
      if (width===640 && height===900) large++;
    });
    return {small,large,quality:window.__horeb.world.settings.quality};
  });
  check('mobile low-quality renders 42 compact labels (384x540)', labels.small === 42 && labels.large === 0 && labels.quality === 'low', JSON.stringify(labels));
  await mobile.screenshot({path:join(shots,'smoke-05-mobile-world.png')});
  await mobile.close();
  check('no page runtime errors', errors.length === 0, errors.slice(0, 2).join(' | '));
} catch (error) {
  failures.push('Uncaught browser-test exception: ' + (error?.stack || String(error)));
} finally {
  await browser.close();
}
console.log('HOREB browser smoke: ' + passes + ' passed, ' + failures.length + ' failed. Chrome=' + browserPath);
for (const failure of failures) console.error('FAIL ' + failure);
if (failures.length) process.exitCode = 1;
