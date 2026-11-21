// Independent PDF tail witness. Serves the anchored dist; never writes to Product.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [productArg, outArg, executablePath] = process.argv.slice(2);
assert.ok(productArg && outArg && executablePath, 'node print-tail.mjs PRODUCT OUT CHROMIUM');
const product = path.resolve(productArg), out = path.resolve(outArg);
const requireProduct = createRequire(path.join(product, 'package.json'));
const { chromium } = requireProduct('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const neighbor = '0b9576278d2ec5ea89da804934823d460720501a';
const A = '/articles/anatomiya-padeniya-pyat-stadiy/';
const G = '/articles/dzhon-gill-chast-2-uchenyi/';
const sha = buffer => createHash('sha256').update(buffer).digest('hex');
const fontRoot = process.env.GB_TAIL_FONT_ROOT;
const assets = [
  'fonts.css', 'Lora/lora-latin-500.woff2', 'Lora/lora-latin-500i.woff2',
  'PlayfairDisplay/playfairdisplay-latin-400.woff2', 'PlayfairDisplay/playfairdisplay-latin-400i.woff2',
  'PlayfairDisplay/playfairdisplay-latin-600.woff2', 'PlayfairDisplay/playfairdisplay-latin-700.woff2',
  'SourceSans3/sourcesans3-latin-500.woff2', 'SourceSans3/sourcesans3-latin-600.woff2',
].map(p => 'fonts/' + p);
const overlay = new Map(fontRoot ? assets.map(p => [p, fs.readFileSync(path.join(fontRoot, p))]) : []);
const plan = fontRoot ? [
  ['anatomy', 390, 'button', 2], ['anatomy', 390, 'font-warm', 2], ['gill2', 1440, 'button', 1],
] : [
  ['anatomy', 390, 'button', 3], ['anatomy', 390, 'direct', 2], ['anatomy', 390, 'delay', 2],
  ['anatomy', 390, 'font-warm', 3], ['anatomy', 390, 'print-media', 2],
  ['anatomy', 1440, 'button', 2], ['gill2', 1440, 'button', 2],
];
fs.mkdirSync(out, { recursive: true });
assert.equal(fs.readdirSync(out).length, 0, 'use an empty output directory');
const { base, server } = await serve();
const files = new Set(), results = [];

const settle = p => p.evaluate(async () => {
  await document.fonts.ready;
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
});

// Installed after the production listeners. No computed style/layout reads here.
function instrument(useButton) {
  const media = matchMedia('print');
  const events = [], mediaEvents = [], requests = [];
  const snapshot = () => {
    const engine = window.GBPrintEngine.getReport();
    const geometry = window.GBPrintPagination.getReport()?.geometry;
    const scope = sel => {
      const node = document.querySelector(sel);
      return node ? {
        follower: !!node.closest('[data-print-terminal-follower]'),
        closingGroup: !!node.closest('.gb-print-closing-group'),
      } : null;
    };
    return {
      printMedia: media.matches, fontStatus: document.fonts.status,
      prepared: engine?.prepared ?? null, source: engine?.source ?? null,
      geometry: geometry ? [geometry.status, geometry.considered, geometry.stabilized] : null,
      groups: document.querySelectorAll('.gb-print-closing-group').length,
      scrollLock: document.documentElement.getAttribute('data-scroll-locked'),
      author: scope('.author-card'), feedback: scope('.gb-accuracy-block'), signature: scope('.article-end-sdg-wrap'),
      launch: !!document.querySelector('#quizLaunch'), question: !!document.querySelector('#quizQuestion'),
      document: performance.timeOrigin,
    };
  };
  window.__auditPrint = { snapshot, events, mediaEvents, requests };
  for (const name of ['beforeprint', 'afterprint']) {
    window.addEventListener(name, () => events.push({ name, ...snapshot() }));
  }
  media.addEventListener('change', e => mediaEvents.push({ match: e.matches, fonts: document.fonts.status }));
  // Only the platform dialog is unavailable; the real article action prepares it.
  if (useButton) window.print = () => requests.push(snapshot());
}

let browser;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const [article, width, mode, repetitions] of plan) {
    for (let rep = 1; rep <= repetitions; rep++) {
      const route = article === 'anatomy' ? A : G;
      const id = `${article}-${width}-${mode}-${rep}`;
      const button = mode !== 'direct';
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
        colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block',
      });
      const errors = { page: [], localHttp: [], localRequests: [] };
      const overrides = new Set(), fonts = [];
      const result = { id, article, route, width, mode, rep, errors, prints: [] };
      results.push(result);
      try {
        await context.route('**/*', req => {
          const url = new URL(req.request().url());
          if (url.origin !== base || url.pathname === '/js/vosk-tts-engine.js') return req.abort();
          const f = url.pathname.slice(1);
          if (!overlay.has(f)) return req.continue();
          overrides.add(f);
          return req.fulfill({ body: overlay.get(f), contentType: f.endsWith('.woff2') ? 'font/woff2' : 'text/css',
            headers: { 'cache-control': 'no-store' } });
        });
        const page = await context.newPage();
        page.setDefaultTimeout(12000);
        page.on('pageerror', e => errors.page.push(e.message.replaceAll(base, 'LOCAL')));
        page.on('request', r => {
          const u = new URL(r.url());
          if (u.origin === base && r.resourceType() === 'font') fonts.push(u.pathname.slice(1));
        });
        page.on('requestfailed', req => {
          const u = new URL(req.url()), reason = req.failure()?.errorText;
          if (u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' && reason !== 'net::ERR_ABORTED') errors.localRequests.push([u.pathname, reason]);
        });
        page.on('response', res => {
          const u = new URL(res.url());
          if (u.origin !== base) return;
          if (res.status() >= 400) errors.localHttp.push([u.pathname, res.status()]);
          const f = u.pathname.slice(1) + (u.pathname.endsWith('/') ? 'index.html' : '');
          if (res.ok() && !overlay.has(f) && ['document', 'stylesheet', 'script', 'font'].includes(res.request().resourceType())) files.add(f);
        });
        assert.equal((await page.goto(base + route + '#sec-quiz', { waitUntil: 'load', timeout: 30000 })).status(), 200);
        await page.waitForFunction(() => window.GBPrintEngine && window.GBPrintPagination?.geometryVersion === 3 && document.querySelector('#quizLaunch'));
        await page.evaluate(instrument, button);
        const control = page.locator(width === 390 ? 'button[data-reader-pdf="save"]:visible' : 'button[data-action="print"]:visible').first();
        result.control = button ? await control.getAttribute('aria-label') : null;
        for (let attempt = 1; attempt <= 2; attempt++) {
          if (mode === 'print-media') await page.emulateMedia({ media: null });
          await settle(page);
          const fm = fonts.length;
          const start = await page.evaluate(() => {
            const { snapshot, events, mediaEvents, requests } = window.__auditPrint;
            return { state: snapshot(), ev: events.length, me: mediaEvents.length, rq: requests.length };
          });
          assert.ok(start.state.launch && !start.state.question && !start.state.scrollLock && !start.state.printMedia);
          assert.equal(start.state.fontStatus, 'loaded');
          let loadedWeight500 = [];
          if (mode === 'delay') await page.waitForTimeout(200); // time-only negative control
          if (mode === 'font-warm') {
            loadedWeight500 = await page.evaluate(async () => {
              const faces = await document.fonts.load('500 14px "Source Sans 3"', 'Писание выше личности и системы Email Telegram');
              return [...new Set(faces.filter(f => f.status === 'loaded' && f.weight === '500').map(f => f.unicodeRange))].sort();
            });
            assert.ok(loadedWeight500.length > 0);
            await settle(page);
          }
          if (button) await control.click();
          if (mode === 'print-media') {
            await page.emulateMedia({ media: 'print' });
            await settle(page);
          }
          const before = await page.evaluate(() => window.__auditPrint.snapshot());
          const fpdf = fonts.length;
          const file = `${id}-${attempt}.pdf`;
          const bytes = await page.pdf({ path: path.join(out, file), format: 'A4', preferCSSPageSize: true, printBackground: true });
          assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
          const after = await page.evaluate(({ ev, me, rq }) => {
            const { snapshot, events, mediaEvents, requests } = window.__auditPrint;
            return { state: snapshot(), events: events.slice(ev), media: mediaEvents.slice(me), requests: requests.slice(rq) };
          }, start);
          assert.deepEqual(after.events.map(x => x.name), ['beforeprint', 'afterprint']);
          assert.equal(after.events[0].source, button ? 'button' : 'native');
          assert.equal(after.events[0].printMedia, mode === 'print-media');
          assert.equal(after.requests.length, button ? 1 : 0);
          if (button) assert.ok(after.requests[0].prepared && after.requests[0].source === 'button');
          assert.ok(after.state.launch && !after.state.question && !after.state.scrollLock);
          assert.equal(after.state.prepared, null);
          assert.equal(after.state.document, start.state.document);
          result.prints.push({ file, bytes: bytes.length, sha256: sha(bytes), start: start.state, before, after,
            loadedWeight500, fontsBefore: [...new Set(fonts.slice(fm, fpdf))].sort(),
            fontsDuring: [...new Set(fonts.slice(fpdf))].sort() });
        }
        result.overrides = [...overrides].sort();
        if (fontRoot) assert.ok(overrides.has('fonts/fonts.css') && result.overrides.some(f => f.endsWith('.woff2')));
        assert.ok(Object.values(errors).every(e => !e.length));
        result.ok = true;
        console.log('OK', id);
      } catch (error) {
        result.ok = false;
        result.error = String(error.stack ?? error).replaceAll(base, 'LOCAL');
        console.error('FAIL', id, result.error);
      } finally { await context.close(); }
    }
  }
  const receipt = { anchor, overlayRef: fontRoot ? neighbor : null, chromium: browser.version(),
    playwright: requireProduct('playwright/package.json').version, node: process.versions.node, results,
    distSha256: Object.fromEntries([...files].sort().map(f => [f, sha(fs.readFileSync(path.join(product, 'dist', f)))])),
    overlaySha256: Object.fromEntries([...overlay].map(([f, bytes]) => [f, sha(bytes)])),
  };
  fs.writeFileSync(path.join(out, 'browser.json'), JSON.stringify(receipt, null, 2) + '\n');
  console.log(`${results.filter(r => r.ok).length}/${results.length} completed`);
  if (results.some(r => !r.ok)) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
