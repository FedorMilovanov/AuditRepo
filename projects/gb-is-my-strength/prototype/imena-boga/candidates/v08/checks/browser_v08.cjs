#!/usr/bin/env node
/* Browser regression tests for the exact, locally built v0.8 candidate.
   No production writes; browser launch requires CHROMIUM_PATH or Playwright chromium. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
// Works both in the conversation bundle (experiences/*) and in AuditRepo
// candidates/v08 (atlas/*, sozvezdie/*). No duplicate test ownership.
const experiences = fs.existsSync(path.join(root, 'experiences', 'sozvezdie', 'package.json'))
  ? path.join(root, 'experiences') : root;
const { chromium } = createRequire(path.join(experiences, 'sozvezdie', 'package.json'))('playwright-core');
const aliases = new Map([
  ['/atlas/', path.join(experiences, 'atlas', 'dist')],
  ['/sozvezdie/', path.join(experiences, 'sozvezdie', 'dist')],
]);
for (const dir of aliases.values()) {
  if (!fs.existsSync(path.join(dir, 'index.html'))) throw new Error(`Missing build: ${dir}`);
}
const mime = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const prefix = [...aliases.keys()].find(x => url.pathname.startsWith(x));
    if (!prefix) { res.writeHead(404).end('Not found'); return; }
    const dir = aliases.get(prefix);
    const requested = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
    const file = path.resolve(dir, requested);
    if (file !== path.join(dir, 'index.html') && !file.startsWith(dir + path.sep)) {
      res.writeHead(403).end('Forbidden'); return;
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  } catch (e) { res.writeHead(500).end('Server error'); }
});
let browser;
const checks = [];
function assert(value, message, detail = '') {
  if (!value) throw new Error(`FAIL ${message}${detail ? ': ' + detail : ''}`);
  checks.push(message);
}
async function newPage(width, motion = 'reduce') {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: motion, locale: 'ru-RU' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith('http://127.0.0.1:')) errors.push(`${r.status()} ${r.url()}`); });
  return { context, page, errors };
}
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  try {
    for (const width of [320, 390, 768, 1440]) {
      for (const slug of ['atlas', 'sozvezdie']) {
        const { context, page, errors } = await newPage(width);
        await page.goto(`${base}/${slug}/`, { waitUntil: 'domcontentloaded' });
        const dims = await page.evaluate(() => [document.documentElement.clientWidth, document.documentElement.scrollWidth]);
        assert(dims[1] <= dims[0] + 2, `${slug} ${width} no root horizontal overflow`, dims.join('/'));
        assert(errors.length === 0, `${slug} ${width} no JS/network errors`, errors.join('; '));
        if (slug === 'atlas') {
          const trigger = page.locator('button[title*="Нажмите, чтобы открыть глубокий разбор"]');
          await trigger.click();
          const dialog = page.getByRole('dialog');
          await dialog.waitFor({ state: 'visible' });
          await page.waitForTimeout(100);
          const dialogFocus = await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
          assert(dialogFocus, `atlas ${width} opening moves focus into dossier`);
          await dialog.getByRole('button', { name: 'Перейти в статье' }).click();
          await dialog.waitFor({ state: 'detached' });
          const state = await page.evaluate(() => ({ activeId: document.activeElement?.id, tabIndex: document.activeElement?.tabIndex }));
          assert(state.activeId === 'name-yhwh' && state.tabIndex === -1, `atlas ${width} jump focuses article landmark`, JSON.stringify(state));
          await page.locator('button[title*="Нажмите, чтобы открыть глубокий разбор"]').click();
          await dialog.waitFor({ state: 'visible' });
          await page.waitForTimeout(90);
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'detached' });
          const focusedTrigger = await trigger.evaluate(el => el === document.activeElement);
          assert(focusedTrigger, `atlas ${width} Escape restores opener focus`);
        }
        await context.close();
      }
    }
    {
      const { context, page, errors } = await newPage(1440, 'no-preference');
      await page.goto(`${base}/sozvezdie/`, { waitUntil: 'domcontentloaded' });
      const center = page.locator('#tsentr [data-orbit-name="yhwh"]');
      await center.scrollIntoViewIfNeeded();
      await center.focus();
      await page.keyboard.press('ArrowRight');
      assert(await page.locator('#tsentr [data-orbit-name="ehyeh"]').evaluate(el => el === document.activeElement), 'orbit ArrowRight from center reaches first satellite');
      await page.keyboard.press('Home');
      assert(await center.evaluate(el => el === document.activeElement), 'orbit Home returns to center');
      await page.keyboard.press('End');
      assert(await page.locator('#tsentr [data-orbit-name="sabaoth"]').evaluate(el => el === document.activeElement), 'orbit End reaches final satellite');
      await page.keyboard.press('Enter');
      assert(await page.evaluate(() => window.location.hash) === '#sabaoth', 'orbit Enter activates focused satellite');
      await page.evaluate(() => {
        const original = Element.prototype.scrollIntoView;
        window.__v08scrolls = [];
        Element.prototype.scrollIntoView = function(arg) {
          window.__v08scrolls.push({ id: this.id, behavior: typeof arg === 'object' ? arg.behavior : undefined });
          return original.call(this, arg);
        };
      });
      const grid = page.locator('#sozvezdie');
      await grid.scrollIntoViewIfNeeded();
      await grid.locator('button[aria-label*="Эль Шадда"]').first().click();
      const initialBehavior = await page.evaluate(() => window.__v08scrolls.filter(x => x.id === 'el-shaddai').at(-1)?.behavior);
      assert(initialBehavior === 'smooth', 'reader motion enabled uses smooth anchored navigation', initialBehavior);
      const dockToggle = page.locator('[data-reader-dock] button[aria-label="Анимации"]');
      await dockToggle.waitFor({ state: 'visible' });
      await dockToggle.click();
      assert(await dockToggle.getAttribute('aria-pressed') === 'true', 'reader motion preference toggled off');
      // Click the same grid card once more: this exercises App.scrollTo without
      // depending on the optional, viewport-sensitive header index pill.
      await grid.locator('button[aria-label*="Эль Шадда"]').first().click();
      const offBehavior = await page.evaluate(() => window.__v08scrolls.filter(x => x.id === 'el-shaddai').at(-1)?.behavior);
      assert(offBehavior === 'instant', 'reader motion disabled uses instant anchored navigation', offBehavior);
      assert(errors.length === 0, 'reader keyboard and motion interactions: no runtime errors', errors.join('; '));
      await context.close();
    }
    {
      const { context, page, errors } = await newPage(1440, 'reduce');
      await page.goto(`${base}/sozvezdie/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        const original = Element.prototype.scrollIntoView;
        window.__v08scrolls = [];
        Element.prototype.scrollIntoView = function(arg) {
          window.__v08scrolls.push({ id: this.id, behavior: typeof arg === 'object' ? arg.behavior : undefined });
          return original.call(this, arg);
        };
      });
      await page.locator('#sozvezdie button[aria-label*="Эль Шадда"]').first().click();
      const osBehavior = await page.evaluate(() => window.__v08scrolls.filter(x => x.id === 'el-shaddai').at(-1)?.behavior);
      assert(osBehavior === 'instant', 'OS reduced-motion uses instant navigation', osBehavior);
      assert(errors.length === 0, 'OS reduced-motion interaction: no runtime errors', errors.join('; '));
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ status: 'PASS', total: checks.length, checks }, null, 2));
}
main().catch(e => { console.error(e.stack); if (browser) browser.close().catch(() => {}); server.close(); process.exitCode = 1; });
