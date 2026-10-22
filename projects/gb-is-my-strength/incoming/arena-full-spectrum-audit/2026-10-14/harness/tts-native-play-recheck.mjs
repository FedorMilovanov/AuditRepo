// Real PLAY capture: no fake SpeechSynthesis events, fake model, media.play stub or autoplay bypass.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8099', OUT = process.env.OUT || './out';
const width = Number(process.env.WIDTH || 1440), theme = process.env.SCHEME || 'light';
const routes = ['/articles/dzhon-gill-chast-1-chelovek/', '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/nagornaya/chast-1/', '/articles/steven-lawson-samoobman-i-publichnyy-golos/'];
mkdirSync(OUT, { recursive: true }); const rows = [];
const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
try {
  for (const route of routes) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: width === 390 ? 2 : 1,
      colorScheme: theme, reducedMotion: 'reduce', serviceWorkers: 'block', locale: 'ru-RU' });
    try {
      await context.addInitScript(() => {
        const probe = window.__playProbe = { events: [], blobs: [], media: [], speechCalls: 0, starts: 0, errors: [], boundaries: 0, clicks: 0 };
        document.addEventListener('click', e => { if (e.target.closest?.('[data-fc-action="play"]')) { probe.clicks++; probe.clickedAt = performance.now(); } }, true);
        for (const name of ['gb:reader-tts-state', 'gb:vosk-status']) addEventListener(name, e => {
          const prev = probe.events.at(-1), key = name + ':' + e.detail?.phase;
          if (prev?.key === key) prev.repeats++; else probe.events.push({ key, at: performance.now(), repeats: 1 });
        });
        const synth = window.speechSynthesis;
        if (synth) { const original = synth.speak.bind(synth); synth.speak = u => {
          probe.speechCalls++; u.addEventListener('start', () => { probe.starts++; probe.firstStartAt ||= performance.now(); });
          u.addEventListener('error', e => probe.errors.push(e.error)); u.addEventListener('boundary', () => probe.boundaries++);
          return original(u); // Native implementation and its real events remain authoritative.
        }; }
        const create = URL.createObjectURL.bind(URL);
        URL.createObjectURL = blob => { const url = create(blob); if (blob instanceof Blob && blob.type.includes('audio')) probe.blobs.push({ url, blob }); return url; };
        for (const name of ['playing', 'pause', 'ended', 'error', 'loadedmetadata']) document.addEventListener(name, e => {
          if (e.target instanceof HTMLMediaElement) probe.media.push({ name, at: performance.now(), time: e.target.currentTime, error: e.target.error?.code || null });
        }, true);
        probe.perf = { lcp: 0, cls: 0 };
        new PerformanceObserver(l => { for (const e of l.getEntries()) probe.perf.lcp = Math.max(probe.perf.lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) probe.perf.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      const page = await context.newPage(), issues = [], network = [];
      page.on('pageerror', e => issues.push({ kind: 'pageerror', text: e.message }));
      page.on('console', m => { if (m.type() === 'error' && /GBReaderTTS|Vosk/.test(m.text())) issues.push({ kind: 'tts-console', text: m.text() }); });
      page.on('requestfailed', r => { if (/vosk|tts-|model|wasm|onnx|fflate/.test(r.url())) network.push({ url: r.url(), error: r.failure()?.errorText }); });
      await page.goto(BASE + route, { waitUntil: 'load' });
      await page.waitForFunction(() => window.GBReaderTTS?.version === 2);
      await page.evaluate(theme => window.GBReaderPreferences?.set({ theme }), theme);
      await page.evaluate(() => document.fonts.ready);
      const painted = () => page.evaluate(() => [...document.querySelectorAll('[data-fc-action="play"]')].findIndex(e => {
        const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0 || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) return false;
        for (let p = e; p; p = p.parentElement) { const s = getComputedStyle(p); if (s.opacity === '0' || s.visibility !== 'visible') return false; }
        const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return hit === e || e.contains(hit);
      }));
      let index = await painted();
      if (index < 0) { await page.evaluate(() => scrollTo(0, 700)); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); index = await painted(); }
      if (index < 0) throw new Error(`No painted/hit-testable PLAY: ${route}`);
      const button = page.locator('[data-fc-action="play"]').nth(index);
      const before = await button.evaluate(e => { const r = e.getBoundingClientRect(); return { label: e.getAttribute('aria-label'), state: e.dataset.state, x: r.x, y: r.y, w: r.width, h: r.height }; });
      if (width === 390) await button.tap(); else await button.click();
      await page.waitForFunction(() => window.VoskTTSEngine?.getStatus().phase === 'error' || window.VoskTTSEngine?.isReady(), null, { timeout: 12000 }).catch(() => {});
      await page.waitForTimeout(300);
      const result = await page.evaluate(async () => {
        const p = window.__playProbe, samples = [];
        for (const { url, blob } of p.blobs) {
          const a = await blob.arrayBuffer(), v = new DataView(a); let peak = 0, square = 0, nonzero = 0;
          if (a.byteLength >= 44) {
            const bits = v.getUint16(34, true);
            const raw = bits === 16 ? new Int16Array(a.slice(44)) : bits === 8 ? new Uint8Array(a, 44) : [];
            for (const value of raw) { const n = bits === 8 ? value - 128 : value; peak = Math.max(peak, Math.abs(n)); square += n*n; if (n) nonzero++; }
            samples.push({ bytes: a.byteLength, bits, sampleRate: v.getUint32(24, true), samples: raw.length, peak, rms: Math.sqrt(square / Math.max(1, raw.length)), nonzero,
              owner: document.querySelector('audio[data-gb-vosk-audio]')?.src === url ? 'neural-tts' : 'other/priming' });
          }
        }
        return { reader: GBReaderTTS.getState(), engine: window.VoskTTSEngine?.getStatus(), voices: speechSynthesis.getVoices().map(v => ({ name: v.name, lang: v.lang })),
          speechCalls: p.speechCalls, starts: p.starts, speechErrors: p.errors, clicks: p.clicks, events: p.events, media: p.media, samples,
          neuralAudioElements: document.querySelectorAll('audio[data-gb-vosk-audio]').length,
          firstStartMs: p.firstStartAt && p.clickedAt ? p.firstStartAt - p.clickedAt : null,
          fonts: document.fonts.status, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, ...p.perf };
      });
      const after = await button.evaluate(e => ({ label: e.getAttribute('aria-label'), phase: e.dataset.ttsPhase, state: e.dataset.state, pressed: e.getAttribute('aria-pressed'), busy: e.getAttribute('aria-busy') }));
      rows.push({ id: `play-${width}-${theme}-${routes.indexOf(route)}`, route, before, after, ...result });
      for (const issue of issues) rows.push({ id: `play-issue-${width}-${theme}-${routes.indexOf(route)}`, ...issue });
      for (const issue of network) rows.push({ id: `play-network-${width}-${theme}-${routes.indexOf(route)}`, ...issue });
      await page.screenshot({ path: `${OUT}/play-${width}-${theme}-${routes.indexOf(route)}.png` });
      const notice = page.locator('.gb-tts-download-notice'); if (await notice.count()) {
        rows.push({ id: `play-notice-${width}-${theme}-${routes.indexOf(route)}`, ...(await notice.evaluate(e => { const r=e.getBoundingClientRect(); return { text:e.innerText, x:r.x,y:r.y,w:r.width,h:r.height,visible:getComputedStyle(e).opacity,action:e.querySelector('button')?.innerText }; })) });
      }
    } finally { await context.close(); }
  }
  writeFileSync(`${OUT}/play-${width}-${theme}.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log(`PLAY_CAPTURE_DONE: ${routes.length} native route clicks, actual speech/media signals; no inference/audibility PASS implied`);
} catch (e) { writeFileSync(`${OUT}/play-${width}-${theme}-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); throw e;
} finally { await browser.close(); }
