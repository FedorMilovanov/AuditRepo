// Native cancellation/notice timing capture. Real pinned JS, real pending HTTP + AbortSignal.
// Only worker transport URLs are adapted; no model bytes, ready signals, fake speech/media or Product patch.
import { chromium } from 'playwright-core';
import { readFileSync, existsSync, statSync, createReadStream, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import { createServer } from 'node:http';
const DIST = process.env.DIST || '/home/user/gbs-src/dist', DEPS = process.env.TTS_DEPS || '/tmp/tts-deps';
const OUT = process.env.OUT || './out', width = Number(process.env.WIDTH || 1440), theme = process.env.SCHEME || 'light';
const workerSource = readFileSync(join(DIST, 'js/vosk-tts-worker.js'), 'utf8');
const fflate = readFileSync(join(DEPS, 'fflate/umd/index.js')), ort = readFileSync(join(DEPS, 'onnxruntime-web/dist/ort.min.js'));
const models = new Map(), pendingResponses = new Set(), rows = [];
const metric = key => { if (!models.has(key)) models.set(key, { requests: 0, aborted: 0, open: 0 }); return models.get(key); };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://fixture'), path = decodeURIComponent(url.pathname);
  const cookie = /(?:^|; )tts-case=([^;]+)/.exec(req.headers.cookie || '')?.[1] || 'unset';
  if (path === '/_tts-fixture/model') {
    const m = metric(url.searchParams.get('case') || cookie); m.requests++; m.open++; pendingResponses.add(res);
    res.writeHead(200, { 'content-type': 'application/octet-stream', 'cache-control': 'no-store' }); res.flushHeaders();
    // Deliberately pending transport: never completes, unzips or pretends to be a valid model.
    res.on('close', () => { m.open--; m.aborted++; pendingResponses.delete(res); }); return;
  }
  if (path === '/_tts-fixture/fflate.js' || path === '/_tts-fixture/ort/ort.min.js') {
    res.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' }); res.end(path.includes('fflate') ? fflate : ort); return;
  }
  if (path === '/js/vosk-tts-worker.js') {
    let source = workerSource.replace(/var ORT_DIST = '[^']+';/, 'var ORT_DIST = new URL("/_tts-fixture/ort/", self.location.href).href;')
      .replace(/var FFLATE_SRC = '[^']+';/, 'var FFLATE_SRC = "/_tts-fixture/fflate.js";')
      .replace(/var MODEL_URL = '[^']+';/, `var MODEL_URL = new URL(${JSON.stringify('/_tts-fixture/model?case=' + cookie)}, self.location.href).href;`);
    if (source === workerSource || !source.includes('EXPECTED_MODEL_SHA256')) throw new Error('Transport adaptation failed');
    res.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' }); res.end(source); return;
  }
  const file = resolve(DIST, '.' + path, path.endsWith('/') ? 'index.html' : '');
  if (!file.startsWith(resolve(DIST) + '/') || !existsSync(file) || !statSync(file).isFile()) { res.writeHead(404); res.end('not found'); return; }
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.woff2': 'font/woff2' };
  res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }); createReadStream(file).pipe(res);
});
mkdirSync(OUT, { recursive: true });
await new Promise(r => server.listen(0, '0.0.0.0', r)); const BASE = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
async function nativePlay(page) {
  const index = await page.evaluate(() => [...document.querySelectorAll('[data-fc-action="play"]')].findIndex(e => {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) return false;
    for (let p = e; p; p = p.parentElement) if (getComputedStyle(p).opacity === '0') return false;
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return hit === e || e.contains(hit);
  }));
  if (index < 0) throw new Error('No painted/hit-testable PLAY');
  const target = page.locator('[data-fc-action="play"]').nth(index); if (width === 390) await target.tap(); else await target.click();
}
async function activate(locator) { if (width === 390) await locator.tap(); else await locator.click(); }
async function state(page) {
  return page.evaluate(() => { const n = document.querySelector('.gb-tts-download-notice'); return {
    engine: window.VoskTTSEngine?.getStatus(), noticeExists: !!n, noticeVisible: !!n?.classList.contains('is-visible'),
    noticeAction: n?.querySelector('button')?.dataset.action || null, noticeText: n?.innerText || null,
    originalConnected: !!window.__oldNotice?.isConnected, sameNotice: !!n && n === window.__oldNotice,
    sentinel: localStorage.getItem('audit:unrelated'), optout: localStorage.getItem('gbx-vosk-warmup'),
    readySeen: window.__readySeen || false, neuralAudio: document.querySelectorAll('audio[data-gb-vosk-audio]').length }; });
}
async function waitRequests(key, n) {
  const started = performance.now();
  while (metric(key).requests < n) { if (performance.now() - started > 4000) throw new Error('Pending HTTP request not observed'); await new Promise(r => setTimeout(r, 20)); }
}
async function waitClosed(key) {
  const started = performance.now();
  while (metric(key).open) { if (performance.now() - started > 4000) throw new Error('Native cancellation did not abort pending HTTP'); await new Promise(r => setTimeout(r, 20)); }
}
try {
  for (const timing of ['before-fade', 'during-fade', 'after-removal', 'during-fade-enable']) {
    const key = `${width}-${theme}-${timing}`, c = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1,
      colorScheme: theme, reducedMotion: 'reduce', serviceWorkers: 'block', locale: 'ru-RU' });
    try {
      await c.addCookies([{ url: BASE, name: 'tts-case', value: key }]);
      await c.addInitScript(() => addEventListener('gb:vosk-status', e => { if (e.detail?.ready || e.detail?.phase === 'ready') window.__readySeen = true; }));
      const p = await c.newPage(); await p.goto(BASE + '/articles/dzhon-gill-chast-1-chelovek/');
      await p.waitForFunction(() => window.GBReaderTTS?.version === 2);
      await p.evaluate(t => { GBReaderPreferences.set({ theme: t }); localStorage.setItem('audit:unrelated', 'untouched'); }, theme);
      await p.evaluate(() => document.fonts.ready); await nativePlay(p);
      await p.waitForFunction(() => window.VoskTTSEngine?.getStatus().phase === 'loading');
      await waitRequests(key, 1); const loading = await state(p); if (metric(key).requests !== 1 || loading.readySeen) throw new Error('Pending transport precondition failed');
      await activate(p.locator('.gb-tts-download-notice__action[data-action="cancel"]'));
      await p.waitForFunction(() => VoskTTSEngine.getStatus().phase === 'cancelled'); await waitClosed(key);
      await p.evaluate(() => { window.__oldNotice = document.querySelector('.gb-tts-download-notice'); window.__cancelObserved = performance.now(); });
      const cancelled = await state(p);
      if (timing === 'before-fade') await p.waitForTimeout(150);
      if (timing.startsWith('during-fade')) await p.waitForFunction(() => window.__oldNotice.isConnected && !window.__oldNotice.classList.contains('is-visible'));
      if (timing === 'after-removal') await p.waitForFunction(() => !window.__oldNotice.isConnected);
      const reShowAt = await p.evaluate(() => performance.now() - window.__cancelObserved); await nativePlay(p);
      await p.waitForFunction(() => VoskTTSEngine.getStatus().phase === 'disabled'); const shown = await state(p);
      if (timing === 'during-fade-enable') {
        await activate(p.locator('.gb-tts-download-notice__action[data-action="enable"]'));
        await p.waitForFunction(() => VoskTTSEngine.getStatus().phase === 'loading'); await waitRequests(key, 2);
        const enabledBeforeHide = await state(p); await p.waitForTimeout(650); const activeSettled = await state(p);
        const openWhileNoticeLost = metric(key).open;
        await p.screenshot({ path: `${OUT}/active-notice-lost-${width}-${theme}.png` });
        // The missing cancel control is a captured fault, not a healthy native cancellation.
        // Programmatic cleanup only, so no pending HTTP outlives the diagnostic case.
        await p.evaluate(() => VoskTTSEngine.cancelLoading({ persist: true })); await waitClosed(key);
        await p.reload({ waitUntil: 'load' }); await p.waitForFunction(() => window.GBReaderTTS?.version === 2); await nativePlay(p);
        await p.waitForFunction(() => VoskTTSEngine.getStatus().phase === 'disabled'); const reloaded = await state(p);
        rows.push({ id: key, timing, reShowAt, loading, cancelled, shown, enabledBeforeHide, activeSettled,
          openWhileNoticeLost, cleanup: 'programmatic only because cancel control disappeared', reloaded, transport: { ...metric(key) } });
        if (metric(key).requests !== 2 || metric(key).open || reloaded.readySeen || reloaded.optout !== 'off') throw new Error('Active-race cleanup/persistent refusal failed');
        continue;
      }
      await p.waitForTimeout(timing === 'before-fade' ? 2600 : 650); const settled = await state(p);
      if (timing === 'during-fade') await p.screenshot({ path: `${OUT}/notice-lost-${width}-${theme}.png` });
      let extraPlayNeeded = false;
      if (!settled.noticeExists) { extraPlayNeeded = true; await nativePlay(p); await p.locator('.gb-tts-download-notice__action[data-action="enable"]').waitFor({ state: 'visible' }); }
      await activate(p.locator('.gb-tts-download-notice__action[data-action="enable"]'));
      await p.waitForFunction(() => VoskTTSEngine.getStatus().phase === 'loading'); await waitRequests(key, 2); const enabled = await state(p);
      if (metric(key).requests !== 2 || enabled.optout !== null || enabled.readySeen || enabled.sentinel !== 'untouched') throw new Error('Re-enable control failed');
      await activate(p.locator('.gb-tts-download-notice__action[data-action="cancel"]')); await waitClosed(key);
      const requestsBeforeReload = metric(key).requests; await p.reload({ waitUntil: 'load' });
      await p.waitForFunction(() => window.GBReaderTTS?.version === 2); await nativePlay(p);
      await p.waitForFunction(() => VoskTTSEngine.getStatus().phase === 'disabled'); const reloaded = await state(p);
      rows.push({ id: key, timing, reShowAt, loading, cancelled, shown, settled, extraPlayNeeded, enabled, reloaded,
        transport: { ...metric(key), newModelRequestsAfterReload: metric(key).requests - requestsBeforeReload } });
      if (reloaded.sentinel !== 'untouched' || reloaded.optout !== 'off' || metric(key).requests !== 2 || metric(key).open || reloaded.readySeen) throw new Error('Persistent opt-out/cancellation control failed');
    } finally { await c.close(); }
  }
  writeFileSync(`${OUT}/notice-${width}-${theme}.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log('TTS_NOTICE_CAPTURE_DONE: 4 native timing cases + cancel/enable/reload controls; missing UI remains a recorded failure; NOT model/audio PASS');
} catch (e) { writeFileSync(`${OUT}/notice-${width}-${theme}-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); throw e;
} finally {
  await browser.close(); for (const res of pendingResponses) res.destroy(); server.closeAllConnections(); await new Promise(r => server.close(r));
}
