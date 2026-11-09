// Confirm that the Vite single-file bundle can be opened from an extracted
// directory, without a dev server or external network services.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const candidatePaths = [
  process.env.HOREB_BROWSER_PATH,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);
const executablePath = candidatePaths.find((path) => existsSync(path));
if (!executablePath) throw new Error('Chrome required for portable local preview test');
const args = process.env.HOREB_SWIFTSHADER === '1'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] : [];
if (process.env.HOREB_NO_SANDBOX === '1') args.push('--no-sandbox', '--disable-setuid-sandbox');

const html = join(process.cwd(), 'dist', 'index.html');
const reader = join(process.cwd(), 'dist', 'reader.html');
if (!existsSync(html) || !existsSync(reader)) throw new Error('Missing offline index.html / reader.html');
const browser = await puppeteer.launch({ executablePath, headless: true, args, protocolTimeout: 90000 });
const errors = [];
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(90000);
  page.on('pageerror', (err) => errors.push(err.message));
  // A forged ?e2e in a production preview must not expose the mutable World.
  const response = await page.goto(pathToFileURL(html).href + '?e2e', { waitUntil: 'domcontentloaded' });
  if (!response || response.status() !== 200) throw new Error('file:// preview cannot be loaded');
  await page.waitForSelector('h1', { timeout: 45000 });
  const title = await page.$eval('h1', (h) => h.textContent);
  if (!title?.includes('ИМЕНА БОГА')) throw new Error('Offline intro title missing');
  const start = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')]
      .find((b) => b.textContent?.includes('Начать путешествие'));
    btn?.click();
    return !!btn;
  });
  if (!start) throw new Error('Offline WebGL start button missing');
  // aria-busy is the public accessibility contract for WebGL readiness:
  // unlike a canvas mount or translated loading text, it waits for WorldState.
  await page.waitForSelector('main[aria-busy="false"] canvas', { timeout: 90000 });
  const screenError = await page.evaluate(() => [...document.querySelectorAll('[role="alert"]')]
    .some((el) => el.textContent?.includes('Не удалось запустить 3D-сцену')));
  if (screenError) throw new Error('Offline WebGL world failed to initialize');
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!await page.evaluate(() => window.__horeb === undefined))
    throw new Error('Production build leaked mutable e2e World API under ?e2e');
  // Production World remains private even with an explicit ?e2e query.
  // The canvas has entered its active rendered state, not merely mounted.
  if (errors.length) throw new Error('Offline runtime errors: ' + errors.join(' | '));
  const read = await page.goto(pathToFileURL(reader).href, { waitUntil: 'domcontentloaded' });
  if (!read || read.status() !== 200) throw new Error('Offline reader cannot load');
  const count = await page.$$eval('article[id]', (nodes) => nodes.length);
  if (count !== 42) throw new Error('Offline reader contains ' + count + ' dossiers');
  console.log('PASS portable local file:// preview: 3D intro and all 42 offline reader dossiers');
} finally {
  await browser.close();
}
