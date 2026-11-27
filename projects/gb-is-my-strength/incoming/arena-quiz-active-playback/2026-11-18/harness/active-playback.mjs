// Audit actual article Play and quiz controls. Only Web Speech platform delivery is held.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node active-playback.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const A = '/articles/anatomiya-padeniya-pyat-stadiy/', G = '/articles/dzhon-gill-chast-2-uchenyi/';
const Q = '#quizPlaceholder', next = `${Q} button.quiz-next`;
const squash = s => String(s).replace(/\s+/gu, '');
const hash = s => createHash('sha256').update(s).digest('hex');
const selected = [
  ['anatomy-start', A, 390, 'start', 'reduce'], ['gill2-start', G, 1440, 'start', 'reduce'],
  ['anatomy-feedback', A, 390, 'feedback', 'reduce'], ['gill2-feedback', G, 1440, 'feedback', 'reduce'],
  ['anatomy-next', A, 390, 'next', 'no-preference'], ['gill2-next', G, 1440, 'next', 'no-preference'],
  ['gill2-paused-next', G, 1440, 'paused-next', 'reduce'], ['gill2-rate-next', G, 1440, 'rate-next', 'reduce'],
  ['gill2-stop-next', G, 1440, 'stop-next', 'reduce'], ['gill2-retry', G, 1440, 'retry', 'no-preference'],
  ['gill2-learning', G, 390, 'learning', 'reduce'],
].filter(([id]) => !only || id.includes(only));
assert.ok(selected.length > 0);
fs.mkdirSync(out, { recursive: true });
assert.ok(!fs.existsSync(path.join(out, 'active-playback-witness.json')), 'use a fresh output folder');

function holdWebSpeech(observeDetachedScroll) {
  const spoken = [], platform = { started: 0, ended: 0, paused: 0, resumed: 0, canceled: 0, cancelCalls: 0 };
  const quizEvents = [], projectionEvents = [], detachedScroll = [];
  let active = null, held = false;
  const info = () => window.GBReaderTTS?.getState();
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class {
    constructor(text) { this.text = String(text); }
  } });
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
    getVoices: () => [{ name: 'Controlled capture only', lang: 'ru-RU', localService: true }],
    addEventListener() {}, removeEventListener() {},
    pause() { held = true; platform.paused++; },
    resume() { held = false; platform.resumed++; },
    cancel() { if (active) platform.canceled++; active = null; held = false; platform.cancelCalls++; },
    speak(utterance) {
      if (active) throw new Error('unexpected overlapping Web Speech request');
      active = utterance;
      spoken.push({ index: info().index, text: utterance.text, lang: utterance.lang, rate: utterance.rate });
      queueMicrotask(() => {
        if (active !== utterance) return;
        platform.started++;
        utterance.onstart?.();
      });
    },
  } });
  document.addEventListener('gb:quiz-rendered', () => quizEvents.push(spoken.length));
  window.addEventListener('gb:reader-projection-ready', e => projectionEvents.push({ reason: e.detail.reason, at: spoken.length }));
  if (observeDetachedScroll) {
    const browserScroll = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (...args) {
      if (!this.isConnected) detachedScroll.push({ index: info()?.index, tag: this.tagName,
        text: this.textContent.replace(/\s+/gu, ' ').trim(), options: args[0] });
      return Reflect.apply(browserScroll, this, args);
    };
  }
  window.__activePlayback = {
    spoken, platform, quizEvents, projectionEvents, detachedScroll, refs: {},
    current: () => active?.text ?? null,
    markBoundary() {
      const i = active && active.text.indexOf(' ') + 1;
      if (!i || held) throw new Error('no valid word boundary in the active phrase');
      active.onboundary?.({ charIndex: i, name: 'word' });
      return i;
    },
    // Release a platform boundary/end, not any Product method or custom UI event.
    async advanceUntil(text) {
      for (let n = 0; n < 1000 && active && active.text !== text; n++) {
        if (held) throw new Error('attempt to finish a platform-paused utterance');
        const u = active;
        active = null;
        u.onboundary?.({ charIndex: Math.floor(u.text.length / 2), name: 'word' });
        platform.ended++;
        u.onend?.();
        await Promise.resolve();
      }
      if (text !== null && active?.text !== text) throw new Error('no matching held utterance: ' + text);
      if (text === null && active) throw new Error('expected completed speech');
      return info();
    },
  };
}
const L = (p, s) => p.locator(s);
const paint = p => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
async function startPage(p, base, route) {
  assert.equal((await p.goto(base + route + '#sec-quiz', { waitUntil: 'load', timeout: 30000 })).status(), 200);
  await p.waitForFunction(() => GBReaderProjection?.getRoot() && GBReaderTTS?.getState().phase === 'idle' && document.querySelector('#quizLaunch'));
  await paint(p);
}
async function playControl(p) {
  const buttons = L(p, '[data-fc-action="play"]:visible:not(:disabled)');
  const find = () => buttons.evaluateAll(bs => bs.findIndex(b => {
    const box = b.getBoundingClientRect(), x = box.x + box.width / 2, y = box.y + box.height / 2;
    return x > 0 && x < innerWidth && y > 0 && y < innerHeight && b.contains(document.elementFromPoint(x, y));
  }));
  let i = await find();
  if (i < 0) {
    await p.keyboard.press('Home');
    for (let tick = 0; tick < 14 && (i = await find()) < 0; tick++) await paint(p);
  }
  assert.ok(i >= 0, 'no hittable Play control');
  return buttons.nth(i);
}
async function clickPlay(p, ...labels) {
  const button = await playControl(p);
  const actual = await button.getAttribute('aria-label');
  assert.ok(labels.includes(actual), `unexpected Play label ${actual}; expected ${labels.join(' or ')}`);
  await button.click();
  return actual;
}
async function speedPanelAction(p, selector, expected) {
  const button = await playControl(p);
  await button.hover();
  const chip = L(p, `.gb-ember-expand.is-open:not([inert]) button${selector}:visible`);
  const label = await chip.getAttribute('aria-label');
  assert.equal(label, expected);
  await chip.click();
  return label;
}
async function metrics(p) {
  return p.evaluate(() => {
    const w = __activePlayback;
    const rings = [...document.querySelectorAll('[data-fc-action="play"]')].map(b => Number(b.style.getPropertyValue('--p')));
    return { state: GBReaderTTS.getState(), rings, platform: { ...w.platform }, calls: w.spoken.length, live: w.current(),
      renders: w.quizEvents.length, refreshes: w.projectionEvents.length, doc: performance.timeOrigin, at: location.hash };
  });
}
async function projection(p, label) {
  return p.evaluate(label => {
    const q = document.querySelector('#quizPlaceholder'), l = document.querySelector('#panelQuiz');
    const segments = GBReaderProjection.getTtsSegments();
    __activePlayback.refs[label] = segments.filter(x => q.contains(x.element)).map(x => x.element);
    return { parts: segments.map(({text, element}) => ({ text, quiz: q.contains(element), panel: !!l?.contains(element) })),
      progress: q.querySelector('.quiz-progress')?.textContent ?? null,
      question: q.querySelector('#quizQuestion')?.textContent?.trim() ?? null,
      verdict: q.querySelector('.quiz-feedback strong')?.textContent ?? null,
      learningInRoot: l ? GBReaderProjection.getRoot().contains(l) : null,
      launch: !document.querySelector('#quizLaunch').hidden };
  }, label);
}
function compact(s) {
  return { progress: s.progress, question: s.question, verdict: s.verdict, launch: s.launch, projected: s.parts.length,
    quiz: s.parts.filter(x => x.quiz).map(x => x.text), panel: s.parts.filter(x => x.panel).length,
    ordinarySha256: hash(s.parts.filter(x => !x.quiz).map(x => x.text).join('\n')), learningInRoot: s.learningInRoot };
}
async function wrong(p, index) {
  const meta = await p.evaluate(i => {
    const q = SITE_CONFIG.quiz.questions[i];
    return { correct: Number(q.correct), count: q.options.length };
  }, index);
  assert.ok(Number.isInteger(meta.correct));
  await L(p, `${Q} button.quiz-option`).nth((meta.correct + 1) % meta.count).click();
  await L(p, `${Q} .quiz-feedback strong`).waitFor();
  assert.equal(await L(p, `${Q} .quiz-feedback strong`).textContent(), 'Неверно');
}
async function begin(p, ...labels) {
  const offset = (await metrics(p)).calls;
  const action = await clickPlay(p, ...labels);
  await p.waitForFunction(count => __activePlayback.spoken.length === count + 1 && GBReaderTTS.getState().phase === 'playing', offset);
  return { offset, action };
}
async function drive(p, text) { return p.evaluate(text => __activePlayback.advanceUntil(text), text); }
function summarize(rows, state, { afterOrdinal = 0, prefix = false } = {}) {
  let offset = 0;
  const ordinary = [], quiz = [];
  for (const part of state.parts) {
    if (prefix && offset === rows.length) break;
    let actual = '';
    const expected = squash(part.text);
    while (actual.length < expected.length && offset < rows.length) {
      const row = rows[offset];
      assert.equal(row.index, offset);
      assert.equal(row.lang, 'ru-RU');
      actual += squash(row.text);
      if (part.quiz) quiz.push({ index: offset, text: row.text, afterChange: offset >= afterOrdinal });
      else ordinary.push(row.text);
      offset++;
    }
    assert.equal(actual, expected);
  }
  assert.equal(offset, rows.length);
  return { total: rows.length, sha256: hash(rows.map(r => r.text).join('\n')), bodySha256: hash(ordinary.join('\n')), quiz };
}
async function learning(p) {
  const settings = await L(p, '#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn';
  await L(p, settings).click(); await L(p, '#mobLearningBtn').click(); await L(p, '#tabQuiz').click();
  await L(p, '#glsQuizConfRow [data-conf="sure"]').click();
  await L(p, '#glsQuizOptions button.quiz-option').first().click();
  await L(p, '#glsQuizVerdict:not([hidden])').waitFor();
  const observed = { open: await L(p, '#gillLearningOverlay.is-open').count(),
    verdictVisible: await L(p, '#glsQuizVerdict').isVisible(),
    projectionSegments: (await projection(p, 'learning-open')).parts.filter(x => x.panel).length };
  await L(p, '#gillLearningOverlay .toc-sheet__head [data-overlay-close]').click();
  await L(p, '#gillLearningOverlay.is-open').waitFor({ state: 'hidden' });
  assert.deepEqual(observed, { open: 1, verdictVisible: true, projectionSegments: 0 });
  return observed;
}

async function exercise(p, row) {
  const { kind } = row;
  if (kind !== 'learning' && kind !== 'start') {
    await L(p, '#quizLaunch').click();
    if (kind !== 'feedback') await wrong(p, 0);
    if (kind === 'retry') {
      const size = await p.evaluate(() => SITE_CONFIG.quiz.questions.length);
      for (let i = 1; i < size; i++) { await L(p, next).click(); await wrong(p, i); }
      await L(p, next).click();
    }
  }
  await paint(p);
  const before = await projection(p, 'start');
  const start = await begin(p, 'Озвучка', 'Озвучить статью');
  assert.equal(start.offset, 0);
  const quizIndex = before.parts.findIndex(x => x.quiz);
  if (quizIndex >= 0) {
    assert.equal(before.parts[quizIndex - 1]?.text, 'Проверь себя');
    // The default pivot is the ordinary heading immediately before any quiz phrases.
    // In these two cases the Q1 prompt has already reached the platform; rationale has not.
    await drive(p, ['paused-next', 'rate-next'].includes(kind) ? before.parts[quizIndex + 1].text : 'Проверь себя');
  }
  if (kind === 'paused-next') row.simulatedBoundary = await p.evaluate(() => __activePlayback.markBoundary());
  const initial = await metrics(p);
  assert.equal(initial.state.phase, 'playing');
  assert.equal(initial.state.engine, 'webspeech');
  if (kind === 'paused-next') {
    row.pauseLabel = await clickPlay(p, 'Пауза');
    const paused = await metrics(p);
    assert.equal(paused.state.phase, 'paused');
    assert.equal(paused.state.offset, row.simulatedBoundary);
    assert.equal(paused.state.progress, initial.state.progress);
  }
  const preChange = await metrics(p);
  row.quizAction = kind === 'feedback' ? 'Неверный вариант Q1' : kind === 'learning' ? 'Ответ в панели «Обучение»' :
    await L(p, kind === 'start' ? '#quizLaunch' : next).textContent();
  if (kind === 'start') await L(p, '#quizLaunch').click();
  else if (kind === 'feedback') await wrong(p, 0);
  else if (kind === 'learning') row.learning = await learning(p);
  else await L(p, next).click();
  if (kind !== 'learning') await p.waitForFunction(({ renders, refreshes }) =>
    __activePlayback.quizEvents.length > renders && __activePlayback.projectionEvents.slice(refreshes).some(x => x.reason === 'gb:quiz-rendered'), preChange);
  await paint(p);
  const after = await projection(p, 'changed');
  const postChange = await metrics(p);
  const oldRefs = await p.evaluate(() => __activePlayback.refs.start.map(n => ({ tag: n.tagName, connected: n.isConnected })));
  assert.equal(postChange.doc, preChange.doc);
  assert.deepEqual(postChange.platform, preChange.platform);
  assert.equal(postChange.calls, preChange.calls);
  assert.equal(postChange.live, preChange.live);
  assert.deepEqual(postChange.state, preChange.state);
  assert.deepEqual(postChange.rings, preChange.rings);
  assert.equal(preChange.calls, preChange.state.index + 1);
  const b = compact(before), a = compact(after);
  assert.equal(b.ordinarySha256, a.ordinarySha256);
  assert.deepEqual([b.panel, a.panel], [0, 0]);
  if (kind === 'start') {
    assert.deepEqual([b.launch, a.launch, b.quiz.length, a.quiz.length], [true, false, 0, 2]);
    assert.match(a.progress, /^Вопрос 1 из \d+$/u);
  } else if (kind === 'feedback') {
    assert.equal(b.question, a.question);
    assert.deepEqual([b.quiz.length, a.quiz.length, a.verdict], [2, 4, 'Неверно']);
    assert.ok(oldRefs.every(ref => ref.connected));
  } else if (kind === 'learning') {
    assert.deepEqual(a, b); assert.equal(b.launch, true); assert.equal(b.learningInRoot, false);
  } else {
    assert.ok(oldRefs.length > 0 && oldRefs.every(x => !x.connected));
    assert.notEqual(b.question, a.question);
    assert.match(a.progress, kind === 'retry' ? /^Вопрос 1 из \d+$/u : /^Вопрос 2 из \d+$/u);
    if (kind === 'retry') assert.match(b.progress, /^Результат: 0 из \d+$/u);
  }
  if (kind === 'paused-next') {
    row.resumeLabel = await clickPlay(p, 'Продолжить озвучку');
    const resumed = await metrics(p);
    assert.equal(resumed.state.phase, 'playing');
    assert.equal(resumed.calls, postChange.calls);
    assert.equal(resumed.live, postChange.live);
    assert.deepEqual(resumed.state, { ...postChange.state, phase: 'playing' });
    assert.deepEqual([resumed.platform.paused, resumed.platform.resumed], [1, 1]);
    row.resumed = { index: resumed.state.index, offset: resumed.state.offset, progress: resumed.state.progress,
      calls: resumed.calls, platform: resumed.platform };
  }
  if (kind === 'rate-next') {
    const old = await metrics(p);
    assert.equal(old.live, b.quiz[1]); assert.equal(old.state.rate, 1);
    const label = await speedPanelAction(p, '[data-speed="1.5"]', 'Скорость 1.5×');
    const updated = await metrics(p);
    assert.equal(updated.calls, old.calls + 1);
    assert.deepEqual(updated.state, { ...old.state, rate: 1.5 });
    assert.equal(updated.platform.canceled, old.platform.canceled + 1);
    const resent = await p.evaluate(() => __activePlayback.spoken.at(-1));
    assert.equal(resent.text, old.live); assert.equal(resent.rate, 1.5);
    assert.notEqual(resent.text, a.quiz[1]);
    row.rateChange = { label, before: old.state.rate, after: updated.state.rate, resent,
      callOrdinal: updated.calls, platform: updated.platform };
  }
  const stop = kind === 'stop-next';
  if (stop) {
    row.stopLabel = await speedPanelAction(p, '[data-fc-action="stop"]', 'Остановить озвучку');
    await paint(p);
  } else await drive(p, null);
  const firstEnd = await metrics(p);
  const done = firstEnd.state;
  assert.equal(done.phase, stop ? 'idle' : 'complete');
  assert.equal(done.progress, stop ? 0 : 1);
  assert.equal(firstEnd.live, null); assert.ok(firstEnd.rings.every(r => r === done.progress));
  if (stop) {
    assert.deepEqual([done.partCount, done.index, done.engine], [0, 0, null]);
    assert.equal(firstEnd.calls, postChange.calls);
    assert.equal(firstEnd.platform.canceled, postChange.platform.canceled + 1);
  }
  const output = await p.evaluate(({ renders, refreshes }) => ({ spoken: __activePlayback.spoken.slice(),
    detached: __activePlayback.detachedScroll.slice(), renderedAt: __activePlayback.quizEvents.slice(renders),
    revision: __activePlayback.projectionEvents.slice(refreshes).filter(x => x.reason === 'gb:quiz-rendered') }), preChange);
  if (kind !== 'learning') assert.deepEqual(output.renderedAt, [postChange.calls]);
  // For the rate scenario, omit the canceled original from the one-row-per-index
  // comparison. The actual extra speak() call is retained separately in rateChange.
  const reads = output.spoken.filter((_, i) => !row.rateChange || i !== postChange.calls - 1);
  const cached = summarize(reads, before, { afterOrdinal: postChange.calls - Number(!!row.rateChange), prefix: stop });
  if (!stop) assert.deepEqual([done.index, done.partCount], [cached.total, cached.total]);
  else assert.deepEqual(cached.quiz, []);
  assert.equal(cached.quiz.filter(x => !x.afterChange).length, kind === 'paused-next' ? 2 : kind === 'rate-next' ? 1 : 0);
  if (kind === 'next' || kind === 'retry') {
    assert.deepEqual(output.detached.map(x => x.text), oldRefs.map((_, i) => b.quiz[i]));
  } else assert.equal(output.detached.length, 0);
  assert.equal(firstEnd.platform.started, output.spoken.length);
  assert.equal(firstEnd.platform.ended, cached.total - Number(stop));
  assert.equal(firstEnd.platform.canceled, Number(!!row.rateChange || stop));
  const replay = await begin(p, ...(stop ? ['Озвучка', 'Озвучить статью'] : ['Прослушать статью снова']));
  assert.equal(replay.offset, output.spoken.length);
  const doneReplay = await drive(p, null);
  assert.equal(doneReplay.phase, 'complete'); assert.equal(doneReplay.progress, 1);
  assert.equal(doneReplay.index, doneReplay.partCount);
  const afterReplay = await metrics(p);
  assert.equal(afterReplay.doc, initial.doc);
  const secondRows = await p.evaluate(n => __activePlayback.spoken.slice(n), replay.offset);
  const fresh = summarize(secondRows, after);
  assert.equal(afterReplay.platform.started, output.spoken.length + fresh.total);
  assert.equal(afterReplay.platform.ended, firstEnd.platform.ended + fresh.total);
  assert.equal(fresh.total, doneReplay.partCount);
  assert.equal(afterReplay.live, null); assert.ok(afterReplay.rings.every(r => r === 1));
  if (stop) assert.deepEqual(secondRows.slice(0, cached.total), output.spoken);
  else assert.equal(cached.bodySha256, fresh.bodySha256);
  if (kind === 'learning') assert.equal(cached.sha256, fresh.sha256);
  else assert.notEqual(cached.sha256, fresh.sha256);
  row.projection = { atPlay: b, afterChange: a };
  const point = ({ state, live, calls, platform, rings }) => ({ ...state, live, calls, platform, rings });
  row.witness = { before: point(preChange), after: point(postChange), firstEnd: point(firstEnd), afterBoth: point(afterReplay),
    initialPlayLabel: start.action, firstSubmissionAfterChange: output.spoken[postChange.calls],
    sameDocument: afterReplay.doc === initial.doc, hashAfterChange: postChange.at, oldQuizNodes: oldRefs,
    quizRenderedAt: output.renderedAt, projectionRefresh: output.revision, newPlayLabel: replay.action, detachedScrollIntoView: output.detached };
  row.streams = { inFlight: { ...cached, complete: !stop }, fresh };
}

const { base, server } = await serve();
const assets = new Set(), results = [];
let browser;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const [id, route, width, kind, motion] of selected) {
    const viewport = { width, height: width === 390 ? 844 : 900 };
    const context = await browser.newContext({ viewport, reducedMotion: motion, colorScheme: 'light', serviceWorkers: 'block' });
    const errors = { page: [], localHttp: [], localRequests: [] };
    const row = { id, route, viewport, motion, kind, errors };
    results.push(row);
    try {
      await context.addInitScript(holdWebSpeech, motion === 'no-preference');
      await context.route('**/*', r => {
        const u = new URL(r.request().url());
        return u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' ? r.continue() : r.abort();
      });
      const p = await context.newPage(); p.setDefaultTimeout(10000);
      p.on('pageerror', e => errors.page.push(e.message.replaceAll(base, 'LOCAL')));
      p.on('requestfailed', req => {
        const u = new URL(req.url()), reason = req.failure()?.errorText;
        if (u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' && reason !== 'net::ERR_ABORTED') errors.localRequests.push([u.pathname, reason]);
      });
      p.on('response', res => {
        const u = new URL(res.url()); if (u.origin !== base) return;
        if (res.status() >= 400) errors.localHttp.push([res.status(), u.pathname]);
        if (res.ok() && ['document', 'script', 'stylesheet'].includes(res.request().resourceType())) {
          assets.add(u.pathname.slice(1) + (u.pathname.endsWith('/') ? 'index.html' : ''));
        }
      });
      await startPage(p, base, route);
      await exercise(p, row);
      assert.ok(Object.values(errors).every(x => x.length === 0));
      row.ok = true;
      console.log('OK', id, row.streams.inFlight.total, '→', row.streams.fresh.total,
        'quiz', row.streams.inFlight.quiz.length, '→', row.streams.fresh.quiz.length,
        'detached follow', row.witness.detachedScrollIntoView.length);
    } catch (e) { row.ok = false; row.error = String(e.stack || e).replaceAll(base, 'LOCAL'); console.error('FAIL', id, row.error); }
    finally { await context.close(); }
  }
  const data = { anchor, chromium: browser.version(), playwright: req('playwright/package.json').version, node: process.versions.node,
    distSha256: Object.fromEntries([...assets].sort().map(f => [f, hash(fs.readFileSync(path.join(product, 'dist', f)))])), results };
  fs.writeFileSync(path.join(out, 'active-playback-witness.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(`${results.filter(r => r.ok).length}/${results.length} completed, ${assets.size} dist pins`);
  if (results.some(r => !r.ok)) process.exitCode = 1;
} finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
}
