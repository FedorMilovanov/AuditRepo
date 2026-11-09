// Verify a REAL live profile transition: a new canvas/renderer/42-atlas
// scene and preserved safe checkpoint. This is not a GPU stress benchmark.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
const chrome = [process.env.HOREB_BROWSER_PATH, process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find((p) => p && existsSync(p));
if (!chrome) throw new Error('QUALITY BLOCKED: real Chromium binary missing');
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');
const browser = await puppeteer.launch({
  executablePath: chrome, headless: true, args, protocolTimeout: 120000,
});
const base = (process.env.HOREB_BASE_URL || 'http://127.0.0.1:5173').replace(/\/$/, '');
const errors = [];
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(90000);
  await page.setViewport({ width: 960, height: 640, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => errors.push(String(e)));
  const response = await page.goto(base + '/?e2e', { waitUntil: 'domcontentloaded' });
  if (response?.status() !== 200) throw new Error('Intro HTTP ' + response?.status());
  // Choose high through the real introductory settings UI. Pre-seeding
  // storage between DOMContentLoaded and React's first effect is racy: the
  // initial "auto" write may overwrite the seed on slow GitHub runners.
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some((b) =>
    (b.textContent || '').trim() === 'Настройки доступности'), { timeout: 30000 });
  const introSettings = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((button) =>
      (button.textContent || '').trim() === 'Настройки доступности');
    b?.click(); return !!b;
  });
  if (!introSettings) throw new Error('Intro quality settings action missing');
  await page.waitForSelector('[role="dialog"] input[name="q"]');
  const choseHigh = await page.evaluate(() => {
    const radio = [...document.querySelectorAll('input[name="q"]')].find((input) =>
      input.closest('label')?.textContent?.includes('Высокое'));
    radio?.click(); return !!radio;
  });
  if (!choseHigh) throw new Error('High quality radio missing');
  await page.waitForFunction(() => {
    const input = [...document.querySelectorAll('input[name="q"]')].find((x) =>
      x.closest('label')?.textContent?.includes('Высокое'));
    return !!input?.checked;
  }, { timeout: 5000 });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'),
    { timeout: 10000 });
  const started = await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')].find((b) =>
      /^(Начать|Продолжить) путешествие$/.test((b.textContent || '').trim()));
    button?.click();
    return !!button;
  });
  if (!started) throw new Error('World start action missing');
  try {
    await page.waitForFunction(() => window.__horeb?.world?.settings.quality === 'high',
      { polling: 200, timeout: 60000 });
  } catch (e) {
    const diagnostic = await page.evaluate(() => ({
      quality: window.__horeb?.world?.settings.quality ?? null,
      saved: localStorage.getItem('imena-horeb.settings.v1'),
      status: document.querySelector('[role="status"]')?.textContent ?? null,
      alert: document.querySelector('[role="alert"]')?.textContent ?? null,
    }));
    throw new Error('HIGH PROFILE DID NOT START: ' +
      JSON.stringify({ diagnostic, errors, original: String(e) }));
  }
  await page.evaluate(() => {
    const world = window.__horeb.world;
    // Direct position only seeds a SAFE point; the real journey is verified
    // independently by tests/browser-journey.mjs with actual keyboard input.
    world.teleportTo(0, -80);
    window.__qualityOldWorld = world;
    window.__qualityOldCanvas = world.renderer.domElement;
  });
  const opened = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((button) =>
      (button.textContent || '').trim() === 'Настройки');
    b?.click();
    return !!b;
  });
  if (!opened) throw new Error('World settings action missing');
  await page.waitForSelector('[role="dialog"] input[name="q"]');
  const selected = await page.evaluate(() => {
    const radio = [...document.querySelectorAll('input[name="q"]')]
      .find((element) => element.closest('label')?.textContent?.includes('Низкое'));
    radio?.click();
    return !!radio;
  });
  if (!selected) throw new Error('Low-power radio control missing');
  await page.waitForFunction(() => window.__horeb?.world &&
    window.__horeb.world !== window.__qualityOldWorld &&
    window.__horeb.world.settings.quality === 'low',
    { polling: 200, timeout: 90000 });
  const evidence = await page.evaluate(() => {
    const world = window.__horeb.world;
    let high = 0, low = 0;
    world.scene.traverse((object) => {
      if (!object.isMesh) return;
      const image = object.material?.map?.image;
      if (image?.width === 640 && image?.height === 900) high++;
      if (image?.width === 384 && image?.height === 540) low++;
    });
    return { freshCanvas: world.renderer.domElement !== window.__qualityOldCanvas,
      oneCanvas: document.querySelectorAll('canvas').length === 1,
      oldDisposed: window.__qualityOldWorld.disposed,
      quality: world.settings.quality, low, high,
      position: world.position, shoes: world.shoes,
      contextLost: world.contextLost };
  });
  if (!evidence.freshCanvas || !evidence.oneCanvas || !evidence.oldDisposed ||
      evidence.quality !== 'low' || evidence.low !== 42 || evidence.high !== 0 ||
      Math.abs(evidence.position.x) > 0.5 || Math.abs(evidence.position.z + 80) > 2 ||
      evidence.shoes !== 'shod' || evidence.contextLost || errors.length)
    throw new Error('QUALITY REBUILD FAIL: ' + JSON.stringify({ ...evidence, errors }));
  console.log('PASS high→low graphics switch: new canvas, old renderer disposed, 42 compact atlases, safe checkpoint');
} finally {
  await browser.close();
}
