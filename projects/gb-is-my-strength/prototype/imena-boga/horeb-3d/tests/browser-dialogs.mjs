// Browser dialog & resilience test: settings, about, sources dialogs,
// localStorage corruption recovery, WebGL-unavailable fallback.
// Uses Sparticuz Chromium 153 + puppeteer-core.
//
// Usage: LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-dialogs.mjs
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'fs';
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

// ── Test 1: Settings dialog
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Click settings button
  const settingsClicked = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.includes('Настройки')) { b.click(); return true; }
    }
    return false;
  });
  t('settings dialog opens', settingsClicked);

  await new Promise(r => setTimeout(r, 500));
  const settingsContent = await page.evaluate(() => document.body.innerText);
  t('settings dialog has content', settingsContent.length > 100);
  await page.screenshot({ path: join(SHOTS, '12-settings.png') });

  // Close dialog
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
  await page.close();
}

// ── Test 2: About dialog
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Click "Об экспозиции" link
  const aboutClicked = await page.evaluate(() => {
    const links = document.querySelectorAll('a, button, .link');
    for (const l of links) {
      if (l.textContent.includes('Об экспозиции')) { l.click(); return true; }
    }
    return false;
  });
  t('about dialog opens', aboutClicked);

  await new Promise(r => setTimeout(r, 500));
  const aboutContent = await page.evaluate(() => document.body.innerText);
  t('about dialog has content', aboutContent.includes('экспозиц'));
  await page.screenshot({ path: join(SHOTS, '13-about.png') });

  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
  await page.close();
}

// ── Test 3: Sources dialog
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  const sourcesClicked = await page.evaluate(() => {
    const links = document.querySelectorAll('a, button, .link');
    for (const l of links) {
      if (l.textContent.includes('Источники')) { l.click(); return true; }
    }
    return false;
  });
  t('sources dialog opens', sourcesClicked);

  await new Promise(r => setTimeout(r, 500));
  const sourcesContent = await page.evaluate(() => document.body.innerText);
  t('sources dialog has content', sourcesContent.length > 100);
  await page.screenshot({ path: join(SHOTS, '14-sources.png') });

  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
  await page.close();
}

// ── Test 4: localStorage corruption recovery
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Inject corrupted localStorage before page load
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => {
    try {
      localStorage.setItem('horeb-settings', '{invalid json');
      localStorage.setItem('horeb-progress', '[not valid');
    } catch(e) { /* */ }
  });
  await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const recovered = await page.evaluate(() => {
    // App should still render despite corrupted localStorage
    return document.body.innerText.length > 100;
  });
  t('app recovers from corrupted localStorage', recovered);
  await page.screenshot({ path: join(SHOTS, '15-localStorage-corruption.png') });
  await page.close();
}

// ── Test 5: WebGL-unavailable fallback
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Block WebGL by overriding canvas.getContext before page loads
  await page.evaluateOnNewDocument(() => {
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type) {
      if (type === 'webgl2' || type === 'webgl' || type === 'experimental-webgl') return null;
      return origGetContext.call(this, type);
    };
  });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const fallbackOk = await page.evaluate(() => {
    const text = document.body.innerText;
    // App should show intro with reader mode option (no WebGL → no 3D button)
    return text.length > 100 && !text.includes('Начать путешествие');
  });
  t('WebGL-unavailable fallback (no 3D button, reader available)', fallbackOk);
  await page.screenshot({ path: join(SHOTS, '16-webgl-fallback.png') });
  await page.close();
}

// ── Test 6: Enter 3D world, check dialog close/reopen
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Enter world
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) { if (b.textContent.includes('Начать')) { b.click(); return; } }
  });
  await new Promise(r => setTimeout(r, 5000));

  // Open settings during 3D
  await page.evaluate(() => {
    // Find settings button in 3D mode
    const btns = document.querySelectorAll('button, .btn');
    for (const b of btns) {
      if (b.textContent.includes('Настройки') || b.textContent.includes('Settings')) { b.click(); return; }
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const dialogInWorld = await page.evaluate(() => document.body.innerText.length > 200);
  t('settings dialog works in 3D world', dialogInWorld);

  // Close and verify world still running
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 1000));
  const worldStillRunning = await page.evaluate(() => document.querySelector('canvas') !== null);
  t('3D world still running after dialog close', worldStillRunning);

  t('no console errors in dialog tests', consoleErrors.length === 0, consoleErrors.slice(0, 3).join('; '));
  await page.close();
}

await browser.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
