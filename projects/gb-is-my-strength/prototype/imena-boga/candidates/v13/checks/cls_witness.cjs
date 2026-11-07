#!/usr/bin/env node
// Diagnostic only. Measures cold-load layout shifts without changing the prototypes.
// Run after building both apps; Chromium/Playwright Core are already QA dependencies.
const { chromium } = require('playwright-core');
const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const widths = (process.env.VIEWPORTS || '390').split(',').map(Number);
const repeats = Number(process.env.CLS_RUNS || 3);
const maxCls = process.env.MAX_CLS === undefined ? null : Number(process.env.MAX_CLS);
if (!widths.length || widths.some(n => !Number.isInteger(n) || n < 280 || n > 2560)) throw Error('Invalid VIEWPORTS');
if (!Number.isInteger(repeats) || repeats < 1 || repeats > 10) throw Error('CLS_RUNS must be 1..10');
if (maxCls !== null && (!Number.isFinite(maxCls) || maxCls < 0)) throw Error('Invalid MAX_CLS');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  try {
    const pathname = new URL(req.url || '/', 'http://127.0.0.1').pathname;
    const match = /^\/(atlas|sozvezdie)\/(.*)$/.exec(pathname);
    if (!match) { res.writeHead(404).end(); return; }
    const dir = path.resolve(root, match[1], 'dist');
    const file = path.resolve(dir, decodeURIComponent(match[2] || 'index.html'));
    if (!file.startsWith(dir + path.sep)) { res.writeHead(403).end(); return; }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch (e) { res.writeHead(500).end(); }
});
function maxSessionWindow(entries) {
  let best = 0, sum = 0, first = 0, previous = 0;
  for (const entry of entries) {
    if (!sum || entry.startTime - previous > 1000 || entry.startTime - first > 5000) {
      sum = 0; first = entry.startTime;
    }
    sum += entry.value; previous = entry.startTime; best = Math.max(best, sum);
  }
  return Number(best.toFixed(5));
}
function median(values) {
  const a = values.slice().sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return Number((a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2).toFixed(5));
}
(async () => {
  for (const app of ['atlas', 'sozvezdie']) {
    if (!fs.existsSync(path.join(root, app, 'dist', 'index.html'))) throw Error('Build both apps first: missing ' + app + '/dist/index.html');
  }
  await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).on('error', reject));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const launch = { headless: true };
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  let browser;
  const runs = [];
  try {
    browser = await chromium.launch(launch);
    for (const app of ['atlas', 'sozvezdie']) for (const width of widths) for (let trial = 1; trial <= repeats; trial++) {
      // A fresh context means no font/image cache sharing between trials.
      const context = await browser.newContext({ viewport: { width, height: 844 }, locale: 'ru-RU', reducedMotion: 'reduce' });
      try {
        const page = await context.newPage();
        const externalFonts = [], failed = [], errors = [];
        page.on('request', req => { if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) externalFonts.push(req.url()); });
        page.on('pageerror', e => errors.push(e.message));
        page.on('requestfailed', req => failed.push(req.url() + ': ' + (req.failure()?.errorText || 'requestfailed')));
        page.on('response', resp => {
          if (resp.url().startsWith(origin) && resp.status() >= 400 && !resp.url().endsWith('/favicon.ico')) failed.push(resp.url() + ': HTTP ' + resp.status());
        });
        await page.addInitScript(() => {
          window.__layoutWitness = { supported: PerformanceObserver.supportedEntryTypes.includes('layout-shift'), entries: [] };
          if (window.__layoutWitness.supported) {
            new PerformanceObserver(list => {
              for (const e of list.getEntries()) {
                if (e.hadRecentInput) continue;
                const sources = (e.sources || []).slice(0, 8).map(s => ({
                  node: s.node ? s.node.tagName.toLowerCase() + (s.node.id ? '#' + s.node.id : '') + (s.node.classList ? '.' + [...s.node.classList].slice(0, 2).join('.') : '') : '(detached)',
                  previous: s.previousRect ? { x: s.previousRect.x, y: s.previousRect.y, width: s.previousRect.width, height: s.previousRect.height } : null,
                  current: s.currentRect ? { x: s.currentRect.x, y: s.currentRect.y, width: s.currentRect.width, height: s.currentRect.height } : null
                }));
                window.__layoutWitness.entries.push({ startTime: e.startTime, value: e.value, sources });
              }
            }).observe({ type: 'layout-shift', buffered: true });
          }
        });
        const cdp = await context.newCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 200000 });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        await page.goto(origin + '/' + app + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.locator('h1').first().waitFor({ state: 'visible', timeout: 60000 });
        const fontSettled = await page.evaluate(async () => { await document.fonts.ready; return performance.now(); });
        await page.waitForTimeout(500); // Observation tail, not a substitute for font readiness.
        const witness = await page.evaluate(() => ({
          ...window.__layoutWitness,
          fontStatus: document.fonts.status,
          fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family),
          fontRequests: performance.getEntriesByType('resource').filter(r => /\.woff2?(?:\?|$)/.test(r.name)).length,
          viewport: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth
        }));
        if (!witness.supported || witness.fontStatus !== 'loaded' || witness.scrollWidth > witness.viewport + 1 || errors.length || failed.length || externalFonts.length)
          throw Error(JSON.stringify({ app, width, trial, witness, errors, failed, externalFonts }));
        const entries = witness.entries.sort((a, b) => a.startTime - b.startTime);
        runs.push({ app, width, trial, cls: maxSessionWindow(entries), fontSettledMs: Math.round(fontSettled), fontRequests: witness.fontRequests,
          loadedFamilies: [...new Set(witness.fonts)].sort(), shifts: entries });
        console.log(app + ' ' + width + 'px run ' + trial + '/' + repeats + ': CLS ' + runs[runs.length - 1].cls);
      } finally { await context.close(); }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const groups = [];
  for (const app of ['atlas', 'sozvezdie']) for (const width of widths) {
    const subset = runs.filter(r => r.app === app && r.width === width);
    groups.push({ app, width, medianCLS: median(subset.map(r => r.cls)), minCLS: Math.min(...subset.map(r => r.cls)), maxCLS: Math.max(...subset.map(r => r.cls)) });
  }
  const report = { kind: 'synthetic-lab-diagnostic-not-field-web-vitals', settings: { widths, repeats, latencyMs: 150, downloadBytesPerSec: 200000, cpuThrottling: 4, reducedMotion: true }, groups, runs };
  console.log(JSON.stringify(report, null, 2));
  if (maxCls !== null && groups.some(g => g.maxCLS > maxCls)) { console.error('CLS threshold exceeded: MAX_CLS=' + maxCls); process.exitCode = 1; }
})().catch(e => { console.error(e.stack); server.close(); process.exitCode = 1; });
