// Browser witness: live quiz DOM vs article speech and native print bytes. No Product changes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [, , rootArg, outArg, executablePath, mode = 'all'] = process.argv;
if (!rootArg || !outArg || !executablePath || !['all', 'matrix', 'channels'].includes(mode)) {
  throw new Error('Usage: node quiz-projection.mjs PRODUCT OUT CHROMIUM [all|matrix|channels]');
}
const product = path.resolve(rootArg), out = path.resolve(outArg), dist = path.join(product, 'dist');
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const A = '/articles/anatomiya-padeniya-pyat-stadiy/';
const G = '/articles/dzhon-gill-chast-2-uchenyi/';
const D = '/articles/diotrefy-nashego-vremeni/';
const N = '#quizPlaceholder', S = '#panelQuiz', C = '[data-quiz-questions]';
const small = { width: 390, height: 844 }, wide = { width: 1440, height: 900 };
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const squash = s => String(s).replace(/\s+/gu, '');
const digest = b => createHash('sha256').update(b).digest('hex');
const L = (p, s) => p.locator(s);
const sleepPaint = p => p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const walk = function* (dir) {
  for (const x of fs.readdirSync(dir, { withFileTypes: true })) {
    if (x.isDirectory()) yield* walk(path.join(dir, x.name));
    else if (x.name === 'index.html') yield path.join(dir, x.name);
  }
};
const routes = { native: [], learning: [] };
for (const f of [...walk(dist)].sort()) {
  const html = fs.readFileSync(f, 'utf8');
  const route = '/' + path.relative(dist, f).replace(/index\.html$/, '');
  if (/\bid="quizPlaceholder"/u.test(html)) routes.native.push(route);
  if (/\bid="gillQuizData"/u.test(html)) routes.learning.push(route);
}
assert.deepEqual([routes.native.length, routes.learning.length], [23, 11]);
fs.mkdirSync(out, { recursive: true });
const { base, server } = await serve();
const pins = /^\/(?:_astro\/(?:ReaderActionsRuntime|GillLearningSheet|BaseLayout)|css\/(?:site|floating-cluster)\.css$|js\/(?:site|floating-cluster-controller|reader-preferences)\.js$)/u;
const files = new Set();

async function open(p, route) {
  const res = await p.goto(base + route, { waitUntil: 'load', timeout: 30000 });
  assert.equal(res?.status(), 200);
  await p.waitForFunction(() => window.GBReaderProjection?.getRoot() && window.GBReaderTTS && window.GBPrintEngine);
  await sleepPaint(p);
}
async function checkpoint(p, selector) {
  await sleepPaint(p);
  return p.evaluate(sel => {
    const api = window.GBReaderProjection, root = api.getRoot();
    const host = document.querySelector(sel);
    const parts = api.getTtsSegments().map(x => ({ text: x.text, tag: x.element.tagName,
      quiz: !!x.element.closest(sel), sectionId: x.sectionId,
      closedDisclosure: !!x.element.closest('details:not([open])') }));
    const print = api.getPrintNodes();
    return {
      doc: performance.timeOrigin, root: { name: root.tagName, id: root.id, quizInside: root.contains(host) },
      display: !!host?.getClientRects().length,
      question: host?.querySelector('#quizQuestion,#glsQuizQuestion')?.textContent?.trim() ?? null,
      options: [...(host?.querySelectorAll('button.quiz-option') ?? [])].map(x => ({ text: x.textContent.trim(), disabled: x.disabled })),
      feedback: host?.querySelector('.quiz-feedback > strong,#glsQuizVerdict:not([hidden])')?.textContent?.trim() ?? null,
      explanation: [...(host?.querySelectorAll('.quiz-explanation:not([hidden])') ?? [])].map(x => x.textContent.trim()),
      progress: host?.querySelector('.quiz-progress,#glsQuizStreak')?.textContent?.trim() ?? null,
      result: host?.querySelector('.quiz-result-copy')?.textContent?.trim() ?? null,
      disclosures: [...(host?.querySelectorAll('details[data-correct-index]') ?? [])].map(x => ({
        open: x.open, prompt: x.querySelector('summary')?.textContent.trim(),
        choices: [...x.querySelectorAll('ol > li')].map(y => y.textContent.trim()),
        explanation: x.querySelector('p')?.textContent.trim(),
      })),
      parts, printNodeCount: print.length, quizPrintNodes: print.filter(e => e.closest(sel)).length,
    };
  }, selector);
}
function compact(q) {
  const { doc, parts, ...rest } = q;
  const quiz = parts.filter(x => x.quiz), ordinary = parts.filter(x => !x.quiz);
  return { ...rest, text: { segments: parts.length, sha256: digest(parts.map(x => x.text).join('\n')),
    withoutQuizSha256: digest(ordinary.map(x => x.text).join('\n')), quiz,
    fromClosedDisclosure: quiz.filter(x => x.closedDisclosure).length } };
}
async function answerNative(p, q) {
  const data = await p.evaluate(i => window.SITE_CONFIG.quiz.questions[i], q);
  assert.ok(data && Number.isInteger(Number(data.correct)));
  await L(p, `${N} button.quiz-option`).nth((Number(data.correct) + 1) % data.options.length).click();
  await L(p, `${N} .quiz-feedback > strong`).waitFor();
  assert.equal(await L(p, `${N} .quiz-feedback > strong`).textContent(), 'Неверно');
}
async function enterLearning(p) {
  const settings = await L(p, '#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn';
  await L(p, settings).click();
  await L(p, '#mobLearningBtn').click();
  await L(p, '#gillLearningOverlay.is-open').waitFor();
  await L(p, '#tabQuiz').click();
}
async function answerLearning(p) {
  await L(p, '#glsQuizConfRow [data-conf="sure"]').click();
  await L(p, '#glsQuizOptions button.quiz-option').first().click();
  await L(p, '#glsQuizVerdict:not([hidden])').waitFor();
}
async function closeLearning(p) {
  await L(p, '#gillLearningOverlay .toc-sheet__head [data-overlay-close]').click();
  await L(p, '#gillLearningOverlay.is-open').waitFor({ state: 'hidden' });
}

const channelPlatform = () => {
  // Headless has no usable OS voice/dialog. Capture only the platform calls;
  // actual site handlers, segment collection, queue, styles and PDF are real.
  const web = [], print = [], printEvents = [];
  window.__quizChannels = { web, print, printEvents };
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true,
    value: class { constructor(text) { this.text = String(text); } } });
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
    getVoices: () => [{ name: 'Local capture only', lang: 'ru-RU', localService: true }],
    addEventListener() {}, removeEventListener() {}, cancel() {}, pause() {}, resume() {},
    speak(u) { web.push({ text: u.text, lang: u.lang }); queueMicrotask(() => { u.onstart?.(); u.onend?.(); }); },
  } });
  window.print = () => print.push(window.GBPrintEngine?.getReport());
  for (const name of ['beforeprint', 'afterprint']) window.addEventListener(name, () => {
    printEvents.push({ name, media: matchMedia('print').matches });
  });
};
async function speak(p, state, ordinary) {
  const before = await p.evaluate(() => window.__quizChannels.web.length);
  const controls = L(p, 'button[data-fc-action="play"]:visible:not(:disabled)');
  const hitIndex = () => controls.evaluateAll(nodes => nodes.findIndex(node => {
    const b = node.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    return x > 0 && x < innerWidth && y > 0 && y < innerHeight && node.contains(document.elementFromPoint(x, y));
  }));
  let index = await hitIndex();
  const returnedToTop = index < 0;
  // At a deep link, Play can be in the header above the viewport. Go to it as a reader would.
  if (returnedToTop) {
    await p.keyboard.press('Home');
    await sleepPaint(p);
    for (let n = 0; n < 10 && (index = await hitIndex()) < 0; n++) await sleepPaint(p);
  }
  assert.ok(index >= 0, 'no in-view Play button after returning to the article header');
  await controls.nth(index).click();
  await p.waitForFunction(n => window.__quizChannels.web.length > n && window.GBReaderTTS.getState().phase === 'complete', before);
  const { emitted, run } = await p.evaluate(n => ({ emitted: window.__quizChannels.web.slice(n), run: window.GBReaderTTS.getState() }), before);
  assert.equal(run.engine, 'webspeech'); assert.equal(run.progress, 1);
  assert.equal(run.partCount, emitted.length);
  assert.ok(emitted.every(x => x.lang === 'ru-RU'));
  const full = emitted.map(x => x.text).join(' '), projected = state.parts.map(x => x.text).join(' ');
  // A chunk boundary may add whitespace near punctuation. Do not infer a text change from spacing alone.
  assert.equal(squash(full), squash(projected));
  const quiz = state.parts.filter(x => x.quiz).map(x => x.text);
  // Each segment begins a new utterance run; locate emitted spans by exact non-whitespace character lengths.
  const quizIndices = [];
  let from = 0;
  for (const part of state.parts) {
    let segment = '', stop = from, expected = squash(part.text);
    while (segment.length < expected.length && stop < emitted.length) segment += squash(emitted[stop++].text);
    assert.equal(segment, expected);
    if (part.quiz) for (let i = from; i < stop; i++) quizIndices.push(i);
    from = stop;
  }
  assert.equal(from, emitted.length);
  const quizSet = new Set(quizIndices), articleChunks = emitted.filter((_, i) => !quizSet.has(i)).map(x => x.text);
  const ordinaryHash = digest(articleChunks.join('\n'));
  if (ordinary) assert.equal(ordinaryHash, ordinary);
  return { engine: run.engine, phase: run.phase, returnedToTop, utterances: emitted.length, bodySha256: ordinaryHash,
    allSha256: digest(emitted.map(x => x.text).join('\n')), quizSegments: quiz.length,
    quizUtterances: quizIndices.map(i => ({ i, ...emitted[i] })), whitespaceEqual: norm(full) === norm(projected) };
}

async function print(p, name) {
  await p.evaluate(() => document.fonts.ready);
  await sleepPaint(p);
  const before = await p.evaluate(() => ({ calls: window.__quizChannels.print.length, events: window.__quizChannels.printEvents.length }));
  const mobile = L(p, 'button[data-reader-pdf="save"]:visible').first();
  const button = await mobile.count() ? mobile : L(p, 'button[data-action="print"]:visible').first();
  const label = await button.getAttribute('aria-label');
  await button.click();
  await p.waitForFunction(n => window.__quizChannels.print.length > n, before.calls);
  const request = await p.evaluate(() => window.__quizChannels.print.at(-1));
  assert.equal(request.prepared, true);
  assert.equal(request.source, 'button');
  const file = `${name}.pdf`;
  const bytes = await p.pdf({ path: path.join(out, file), format: 'A4', preferCSSPageSize: true, printBackground: true });
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
  const after = await p.evaluate(n => ({
    events: window.__quizChannels.printEvents.slice(n), reset: window.GBPrintEngine.getReport() === null,
  }), before.events);
  assert.deepEqual(after.events.map(x => x.name), ['beforeprint', 'afterprint']);
  assert.equal(after.reset, true);
  return { file, label, bytes: bytes.length, sha256: digest(bytes), request: request.source, nativeEvents: after.events, reset: after.reset };
}

const jobs = [];
if (mode !== 'channels') {
  for (const route of routes.native) jobs.push({ kind: 'native-matrix', route, viewport: wide, run: async (p, r) => {
    const idle = await checkpoint(p, N);
    assert.equal(await L(p, '#quizLaunch').count(), 1);
    await L(p, '#quizLaunch').click();
    const started = await checkpoint(p, N);
    assert.ok(started.options.length >= 2 && started.options.every(x => !x.disabled));
    await answerNative(p, 0);
    const answered = await checkpoint(p, N);
    assert.equal(answered.question, started.question);
    assert.ok(answered.explanation.length && answered.options.every(x => x.disabled));
    await L(p, `${N} button.quiz-next`).click();
    const next = await checkpoint(p, N);
    assert.notEqual(next.question, answered.question);
    assert.equal(next.feedback, null);
    assert.ok([started, answered, next].every(x => x.doc === idle.doc));
    r.states = Object.fromEntries(Object.entries({ idle, started, answered, next }).map(([k, s]) => [k, compact(s)]));
    r.totalQuestions = await p.evaluate(() => window.SITE_CONFIG.quiz.questions.length);
  } });
  for (const route of routes.learning) jobs.push({ kind: 'learning-matrix', route, viewport: small, run: async (p, r) => {
    const idle = await checkpoint(p, S);
    await enterLearning(p);
    await answerLearning(p);
    const answered = await checkpoint(p, S);
    assert.ok(answered.feedback && answered.options.length === 4 && answered.options.every(x => x.disabled));
    await closeLearning(p);
    const closed = await checkpoint(p, S);
    assert.equal(closed.doc, idle.doc);
    r.states = Object.fromEntries(Object.entries({ idle, answered, closed }).map(([k, s]) => [k, compact(s)]));
  } });
}
if (mode !== 'matrix') {
  for (const [slug, route, viewport] of [['anatomy', A, small], ['gill2', G, wide]]) {
    jobs.push({ kind: 'native-channels', route, viewport, slug, fragment: '#sec-quiz', run: async (p, r) => {
      r.states = {}; r.speech = {}; r.pdf = {};
      const idle = await checkpoint(p, N);
      r.states.idle = compact(idle);
      r.speech.idle = await speak(p, idle);
      // Keep an idle repeat control so a first-print effect is not attributed to quiz state.
      r.pdf.idle = await print(p, `${slug}-idle`);
      r.pdf.idleRepeat = await print(p, `${slug}-idle-repeat`);
      await L(p, '#quizLaunch').click();
      const started = await checkpoint(p, N);
      r.states.started = compact(started);
      r.speech.started = await speak(p, started, r.speech.idle.bodySha256);
      await answerNative(p, 0);
      const answered = await checkpoint(p, N);
      r.states.answered = compact(answered);
      r.speech.answered = await speak(p, answered, r.speech.idle.bodySha256);
      r.pdf.answered = await print(p, `${slug}-answered`);
      assert.deepEqual(compact(await checkpoint(p, N)), compact(answered));
      const count = await p.evaluate(() => window.SITE_CONFIG.quiz.questions.length);
      for (let i = 1; i < count; i++) { await L(p, `${N} button.quiz-next`).click(); await answerNative(p, i); }
      await L(p, `${N} button.quiz-next`).click();
      const result = await checkpoint(p, N);
      assert.equal(result.doc, idle.doc);
      assert.equal(result.progress, `Результат: 0 из ${count}`);
      r.states.result = compact(result);
      r.speech.result = await speak(p, result, r.speech.idle.bodySha256);
      r.pdf.result = await print(p, `${slug}-result`);
      assert.deepEqual(compact(await checkpoint(p, N)), compact(result));
      await L(p, `${N} button.quiz-next`).click();
      const restarted = await checkpoint(p, N);
      r.states.restarted = compact(restarted);
      assert.deepEqual(compact(restarted), compact(started));
    } });
  }
  jobs.push({ kind: 'learning-channels', route: G, viewport: small, slug: 'gill2-learning', run: async (p, r) => {
    const idle = await checkpoint(p, S);
    const a = await speak(p, idle);
    await enterLearning(p);
    await answerLearning(p);
    const answered = await checkpoint(p, S);
    await closeLearning(p);
    const closed = await checkpoint(p, S);
    const b = await speak(p, closed, a.bodySha256);
    assert.equal(closed.doc, idle.doc);
    r.states = { idle: compact(idle), answered: compact(answered), closed: compact(closed) };
    r.speech = { idle: a, closed: b };
  } });
  jobs.push({ kind: 'disclosure-channels', route: D, viewport: small, slug: 'diotrophes', fragment: '#quiz', run: async (p, r) => {
    const closed = await checkpoint(p, C);
    assert.equal(closed.disclosures.length, 10);
    assert.ok(closed.disclosures.every(x => !x.open && x.choices.length === 4 && x.explanation));
    const axClosed = await L(p, C).ariaSnapshot();
    assert.ok(axClosed.includes(closed.disclosures[0].prompt));
    assert.ok(!axClosed.includes(closed.disclosures[0].choices[1]) && !axClosed.includes('Разбор:'));
    const a = await speak(p, closed);
    assert.equal(await L(p, `${C} details[open]`).count(), 0);
    await L(p, `${C} details summary`).first().click();
    const opened = await checkpoint(p, C);
    assert.deepEqual(opened.disclosures.map(x => x.open), [true, false, false, false, false, false, false, false, false, false]);
    const axOpenFirst = await L(p, `${C} details`).first().ariaSnapshot();
    assert.ok(axOpenFirst.includes(opened.disclosures[0].choices[1]) && axOpenFirst.includes('Разбор:'));
    const b = await speak(p, opened, a.bodySha256);
    r.ax = { closed: axClosed, firstOpened: axOpenFirst };
    r.states = { closed: compact(closed), opened: compact(opened) };
    r.speech = { closed: a, opened: b };
  } });
}

let browser;
const results = new Array(jobs.length);
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  let cursor = 0;
  await Promise.all(Array.from({ length: mode === 'channels' ? 2 : 3 }, async () => {
    while (cursor < jobs.length) {
      const i = cursor++, job = jobs[i], { kind, route, viewport } = job;
      const r = results[i] = { kind, route, viewport, errors: { page: [], localHttp: [], localRequests: [] } };
      const context = await browser.newContext({ viewport, serviceWorkers: 'block', colorScheme: 'light', reducedMotion: 'reduce' });
      try {
        if (job.slug) await context.addInitScript(channelPlatform);
        await context.route('**/*', request => {
          const url = new URL(request.request().url());
          if (url.origin !== base || url.pathname === '/js/vosk-tts-engine.js') return request.abort();
          return request.continue();
        });
        const p = await context.newPage();
        p.setDefaultTimeout(12500);
        p.on('pageerror', e => r.errors.page.push(e.message.replaceAll(base, 'LOCAL')));
        p.on('requestfailed', e => {
          const u = new URL(e.url());
          if (u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' && e.failure()?.errorText !== 'net::ERR_ABORTED') {
            r.errors.localRequests.push({ path: u.pathname, error: e.failure()?.errorText });
          }
        });
        p.on('response', res => {
          const u = new URL(res.url());
          if (u.origin !== base) return;
          if (res.status() >= 400) r.errors.localHttp.push({ path: u.pathname, status: res.status() });
          if (res.ok() && res.request().isNavigationRequest()) files.add(u.pathname.slice(1) + 'index.html');
          if (res.ok() && pins.test(u.pathname)) files.add(u.pathname.slice(1));
        });
        await open(p, route + (job.fragment || ''));
        await job.run(p, r);
        assert.deepEqual(r.errors, { page: [], localHttp: [], localRequests: [] });
        r.ok = true;
        console.log('OK', kind, route);
      } catch (error) {
        r.ok = false; r.error = String(error.stack || error).replaceAll(base, 'LOCAL');
        console.error('FAIL', kind, route, r.error);
      } finally { await context.close(); }
    }
  }));
  const summary = { anchor, node: process.versions.node, chromium: browser.version(), playwright: req('playwright/package.json').version, mode,
    total: jobs.length, completed: results.filter(r => r.ok).length, routes,
    distSha256: Object.fromEntries([...files].sort().map(f => [f, digest(fs.readFileSync(path.join(dist, f)))])), results };
  fs.writeFileSync(path.join(out, 'quiz-projection-witness.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(`${summary.completed}/${summary.total} scenarios completed; ${files.size} dist pins`);
  if (summary.completed !== summary.total) process.exitCode = 1;
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
