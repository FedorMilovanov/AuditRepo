// Actual-worker failure/recovery capture. Requires exact pinned npm dependencies served at MIRROR.
// Does not fake readiness, synthesize replacement audio, bypass model SHA or claim original CDN availability.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8099', MIRROR = process.env.MIRROR || 'http://127.0.0.1:8101';
const OUT = process.env.OUT || './out'; mkdirSync(OUT, { recursive: true }); const rows = [];
async function sharedTarget(browser) {
  const root = await browser.newBrowserCDPSession(), { targetInfos } = await root.send('Target.getTargets');
  const target = targetInfos.find(t => t.type === 'shared_worker' && t.url.includes('vosk-tts-worker'));
  if (!target) throw new Error('No actual Vosk SharedWorker');
  const { sessionId } = await root.send('Target.attachToTarget', { targetId: target.targetId, flatten: false });
  let seq = 0; const pending = new Map();
  root.on('Target.receivedMessageFromTarget', e => {
    if (e.sessionId !== sessionId) return; const m = JSON.parse(e.message), p = pending.get(m.id);
    if (!p) return; pending.delete(m.id); clearTimeout(p.timer);
    if (m.error) p.reject(new Error(JSON.stringify(m.error))); else p.resolve(m.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq, timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP observation timeout')); }, 12000);
    pending.set(id, { resolve, reject, timer });
    root.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id, method, params }) }).catch(reject);
  });
  await send('Runtime.enable');
  return { evaluate: async expression => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value;
  } };
}
try {
  for (const mode of ['shared', 'dedicated']) {
    const browser = await chromium.launch({ executablePath: '/tmp/gbchrome/chrome.sh', args: ['--no-sandbox'] });
    try {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
      if (mode === 'dedicated') await context.addInitScript(() => Object.defineProperty(window, 'SharedWorker', { configurable: true, value: undefined }));
      const page = await context.newPage();
      const dedicated = mode === 'dedicated' ? page.waitForEvent('worker') : null;
      await page.goto(BASE + '/articles/dzhon-gill-chast-1-chelovek/');
      await page.waitForFunction(() => window.GBReaderTTS?.version === 2);
      await page.locator('[data-fc-action="play"]').first().click();
      await page.waitForFunction(() => window.VoskTTSEngine?.getStatus().phase === 'error');
      const failed = await page.evaluate(() => VoskTTSEngine.getStatus());
      if (!failed.reason?.includes('importScripts')) throw new Error('This environment did not establish a dependency-import failure; no retry conclusion');
      const worker = mode === 'shared' ? await sharedTarget(browser) : await dedicated;
      rows.push({ id: `${mode}-baseline`, forcedCapability: mode === 'dedicated', engine: failed,
        worker: await worker.evaluate('({ready:state.ready,dependencies:!!state.dependencies,loading:!!state.loading})') });
      await worker.evaluate(`self.__imports=0;self.__fetches=[];self.__importNative=importScripts.bind(self);
        self.importScripts=function(...u){self.__imports++;return self.__importNative(...u);};
        self.__fetchNative=fetch.bind(self);self.fetch=function(...a){const x={url:String(a[0])};self.__fetches.push(x);
          const p=self.__fetchNative(...a);p.then(r=>x.status=r.status,e=>x.error=e.message);return p;};
        ORT_DIST=${JSON.stringify(MIRROR + '/onnxruntime-web/dist/')};ORT_SRC=ORT_DIST+'ort.min.js';
        FFLATE_SRC=${JSON.stringify(MIRROR + '/fflate/umd/index.js')};true`);
      await page.locator('.gb-tts-download-notice__action[data-action="retry"]').click();
      await page.waitForTimeout(450);
      const sticky = await worker.evaluate('({imports:self.__imports,fetches:self.__fetches,phase:state.phase,ready:state.ready})');
      rows.push({ id: `${mode}-retry-after-delivery-restored`, worker: sticky, engine: await page.evaluate(() => VoskTTSEngine.getStatus()) });
      if (sticky.imports !== 0 || sticky.ready) throw new Error('Sticky dependency hypothesis not reproduced');
      await worker.evaluate('state.dependencies=null;true'); // Diagnostic A/B only; no source/ready/model changes.
      await page.locator('.gb-tts-download-notice__action[data-action="retry"]').click();
      let observation = 'settled';
      try { await page.waitForFunction(() => ['ready', 'error'].includes(VoskTTSEngine.getStatus().phase), null, { timeout: 45000 }); }
      catch { observation = '45s budget, NOT completed'; }
      const reset = await worker.evaluate('({imports:self.__imports,fetches:self.__fetches,phase:state.phase,ready:state.ready,fflate:typeof self.fflate,ort:typeof self.ort})');
      rows.push({ id: `${mode}-reset-rejected-dependency-only`, observation, worker: reset, engine: await page.evaluate(() => VoskTTSEngine.getStatus()) });
      if (reset.imports !== 1 || reset.fflate !== 'object' || reset.ort !== 'object'
        || !reset.fetches.some(x => x.url.includes('model-quant.zip'))) throw new Error('Verified real dependencies did not advance to actual model request');
      if (observation !== 'settled') await page.locator('.gb-tts-download-notice__action[data-action="cancel"]').click();
      await context.close();
    } finally { await browser.close(); }
  }
  writeFileSync(`${OUT}/tts-retry.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
  console.log('TTS_RETRY_CAPTURE_DONE: native SharedWorker + real Dedicated Worker control, not inference/audio PASS');
} catch (e) { writeFileSync(`${OUT}/tts-retry-INCOMPLETE.jsonl`, rows.map(r => JSON.stringify(r)).join('\n') + '\n'); throw e; }
