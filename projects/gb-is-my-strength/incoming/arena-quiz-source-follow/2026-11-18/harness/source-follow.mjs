// Actual linked quiz source + actual viewport. The clock of Web Speech alone is controlled.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node source-follow.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const A = '/articles/anatomiya-padeniya-pyat-stadiy/', G = '/articles/dzhon-gill-chast-2-uchenyi/';
const N = '#quizPlaceholder', PANE = '#panelQuiz';
const jobs = [
  ['anatomy-narrow-idle', A, 390, 'no-preference', 'idle'],
  ['anatomy-narrow-on', A, 390, 'no-preference', 'on'],
  ['anatomy-wide-on', A, 1440, 'no-preference', 'on'],
  ['anatomy-narrow-reduce', A, 390, 'reduce', 'on'],
  ['gill-learning-narrow-idle', G, 390, 'no-preference', 'idle'],
  ['gill-learning-narrow-on', G, 390, 'no-preference', 'on'],
  ['gill-learning-narrow-reduce', G, 390, 'reduce', 'on'],
  ['gill-learning-wide-pause', G, 1440, 'no-preference', 'pause'],
].filter(([id]) => !only || id.includes(only));
assert.ok(jobs.length);
fs.mkdirSync(out, { recursive: true });
assert.equal(fs.readdirSync(out).length, 0, 'use an empty output directory');
const norm = text => String(text ?? '').replace(/\s+/gu, ' ').trim();
const hash = data => createHash('sha256').update(data).digest('hex');
const L = (p, s) => p.locator(s);

function platformProbe() {
  let utterance = null, paused = false;
  const calls = [], scroll = [], counts = { canceled: 0, paused: 0, resumed: 0, started: 0, ended: 0 };
  const hit = (element) => {
    if (!element) return null;
    const r = element.getBoundingClientRect();
    const x = (Math.max(0, r.left) + Math.min(innerWidth - 1, r.right)) / 2;
    const y = (Math.max(0, r.top) + Math.min(innerHeight - 1, r.bottom)) / 2;
    const painted = r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0;
    return { id: element.id, tag: element.tagName, top: Math.round(r.top), bottom: Math.round(r.bottom),
      connected: element.isConnected, painted, hit: painted && element.contains(document.elementFromPoint(x, y)) };
  };
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class {
    constructor(text) { this.text = String(text); }
  } });
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
    getVoices: () => [{ name: 'Controlled Web Speech capture', lang: 'ru-RU', localService: true }],
    addEventListener() {}, removeEventListener() {},
    cancel() { utterance = null; paused = false; counts.canceled++; },
    pause() { paused = true; counts.paused++; },
    resume() { paused = false; counts.resumed++; },
    speak(u) {
      if (utterance) throw new Error('unexpected overlapping speech');
      utterance = u;
      calls.push({ index: window.GBReaderTTS.getState().index, text: u.text, lang: u.lang, rate: u.rate });
      queueMicrotask(() => { if (u === utterance) { counts.started++; u.onstart?.(); } });
    },
  } });
  // The native scroll still runs for every caller. Observe target identity and actual later rects.
  const browserScroll = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (...args) {
    const key = window.GBReaderTTS?.getState();
    scroll.push({ el: this, from: hit(this), hash: location.hash, count: calls.length, phase: key?.phase,
      index: key?.index, quiz: !!this.closest('#quizPlaceholder, #gillLearningOverlay'),
      text: this.textContent.replace(/\s+/gu, ' ').trim().slice(0, 130), options: args[0] });
    return Reflect.apply(browserScroll, this, args);
  };
  window.__sourceFollow = {
    hit, counts, calls, scroll, active: () => utterance?.text ?? null,
    boundary() {
      if (!utterance || paused) throw new Error('no unpaused utterance');
      const offset = utterance.text.indexOf(' ') + 1;
      if (offset) utterance.onboundary?.({ charIndex: offset, name: 'word' });
      return offset;
    },
    end() {
      if (!utterance || paused) throw new Error('no unpaused utterance');
      const old = utterance;
      utterance = null;
      counts.ended++;
      old.onend?.();
    },
  };
}

async function settle(p) {
  // Native smooth scroll is not instantaneous. Allow it to run and require an idle rAF window.
  await p.evaluate(() => new Promise((resolve, reject) => {
    const since = performance.now();
    let stableSince = since, y = scrollY;
    function frame(now) {
      if (scrollY !== y) { y = scrollY; stableSince = now; }
      if (now - since > 5500) reject(new Error('scroll did not settle'));
      else if (now - since >= 320 && now - stableSince >= 160) resolve();
      else requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }));
}

async function play(p, expected, mayHome = false) {
  const controls = L(p, 'button[data-fc-action="play"]:visible:not(:disabled)');
  const spot = () => controls.evaluateAll(nodes => nodes.findIndex(el => {
    const r = el.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
    return x > 0 && x < innerWidth && y > 0 && y < innerHeight && el.contains(document.elementFromPoint(x, y));
  }));
  let i = await spot();
  if (i < 0 && mayHome) { await p.keyboard.press('Home'); await settle(p); i = await spot(); }
  assert.ok(i >= 0, 'no hittable Play control at the viewport');
  const control = controls.nth(i), label = await control.getAttribute('aria-label');
  assert.ok(expected.includes(label), `unexpected label ${label}`);
  await control.click();
  return label;
}

const landing = (p, id) => p.evaluate(id => {
  const probe = window.__sourceFollow, el = document.getElementById(id);
  return { url: location.pathname + location.search + location.hash, y: Math.round(scrollY),
    source: { ...probe.hit(el), text: el.textContent.replace(/\s+/gu, ' ').trim(), focus: document.activeElement === el, highlight: el.classList.contains('is-search-target') },
    active: document.activeElement?.id || document.activeElement?.tagName,
    dialog: document.querySelector('#gillLearningOverlay')?.getAttribute('aria-hidden') ?? null,
    overflow: getComputedStyle(document.body).overflowY, doc: performance.timeOrigin,
    phase: window.GBReaderTTS.getState().phase, index: window.GBReaderTTS.getState().index,
    engine: window.GBReaderTTS.getState().engine, offset: window.GBReaderTTS.getState().offset,
    progress: window.GBReaderTTS.getState().progress, calls: probe.calls.length, live: probe.active(),
    platform: { ...probe.counts }, scrollCalls: probe.scroll.length };
}, id);

async function nativeMiss(p) {
  const item = await p.evaluate(() => SITE_CONFIG.quiz.questions[0]);
  await L(p, '#quizLaunch').click();
  await L(p, `${N} .quiz-option`).nth((Number(item.correct) + 1) % item.options.length).click();
  assert.equal(await L(p, `${N} .quiz-feedback strong`).innerText(), 'Неверно');
  return L(p, `${N} .quiz-feedback a`);
}
async function openLearning(p) {
  const s = await L(p, '#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn';
  await L(p, s).click();
  await L(p, '#mobLearningBtn').click();
  if (await L(p, '#tabQuiz').getAttribute('aria-selected') !== 'true') await L(p, '#tabQuiz').click();
  await L(p, PANE).waitFor();
}
async function learningMiss(p) {
  await openLearning(p);
  const deck = JSON.parse(await L(p, '#gillQuizData').getAttribute('data-quiz'));
  const question = L(p, '#glsQuizQuestion');
  for (let i = 0; i < deck.length; i++) {
    const label = norm(await question.innerText());
    const items = deck.filter(x => norm(x.question) === label);
    assert.equal(items.length, 1, label);
    const item = items[0];
    await L(p, '#glsQuizConfRow [data-conf="sure"]').click();
    // Learning randomizes both card order and option order. Click the known
    // wrong answer by its rendered accessible name, not the bank's position.
    const wrong = item.answers[(item.correctIndex + 1) % item.answers.length];
    await L(p, '#glsQuizOptions').getByRole('button', { name: wrong, exact: true }).click();
    await L(p, '#glsQuizVerdict:not([hidden])').waitFor();
    if (item.id === 'gill.scholar.canticles') {
      assert.match(await L(p, '#glsQuizVerdict').innerText(), /^Неверно/u);
      assert.equal(norm(await L(p, '#glsQuizExplanation').innerText()), norm(item.explanation));
      return L(p, '#glsQuizSource');
    }
    await L(p, '#glsQuizNext').click();
  }
  throw new Error('target card not reached within one real deck');
}

async function quizState(p, native) {
  return L(p, native ? `${N} .quiz-wrapper` : PANE).evaluate((el, native) => {
    const txt = s => el.querySelector(s)?.textContent.replace(/\s+/gu, ' ').trim();
    return {
      question: txt(native ? '#quizQuestion' : '#glsQuizQuestion'),
      verdict: txt(native ? '.quiz-feedback strong' : '#glsQuizVerdict'),
      explanation: txt(native ? '.quiz-explanation--full' : '#glsQuizExplanation'),
      seen: txt(native ? '.quiz-progress' : '#glsQuizStreak'),
      source: el.querySelector(native ? '.quiz-feedback a' : '#glsQuizSource')?.getAttribute('href'),
      options: [...el.querySelectorAll('button.quiz-option')].map(b => [b.textContent.trim(), b.disabled, b.className]),
    };
  }, native);
}

async function run(p, row, base) {
  const native = row.route === A, id = native ? 'metod' : 'sec-canticles';
  const startHash = native ? '#sec-quiz' : '';
  const active = row.mode !== 'idle', paused = row.mode === 'pause';
  const expectedLeave = active && row.motion === 'no-preference';
  assert.equal((await p.goto(base + row.route + startHash, { waitUntil: 'load', timeout: 30000 })).status(), 200);
  await p.waitForFunction(() => window.GBReaderProjection?.getRoot() && window.GBReaderTTS?.getState().phase === 'idle');
  await p.evaluate(() => document.fonts.ready);
  await settle(p);
  if (active) {
    row.play = await play(p, ['Озвучка', 'Озвучить статью'], true);
    await p.waitForFunction(() => window.__sourceFollow.calls.length === 1 && window.GBReaderTTS.getState().phase === 'playing');
    await settle(p);
    if (paused) row.pause = await play(p, ['Пауза']);
  }
  const link = native ? await nativeMiss(p) : await learningMiss(p);
  const target = new URL(await link.getAttribute('href'), p.url());
  assert.equal(target.href, base + row.route + '#' + id);
  row.link = { label: norm(await link.innerText()), fragment: target.hash };
  const quiz = await quizState(p, native);
  assert.equal(quiz.options.length, 4); assert.ok(quiz.options.every(x => x[1]));
  const before = await landing(p, id);
  assert.equal(before.phase, paused ? 'paused' : active ? 'playing' : 'idle');
  assert.equal(before.calls, Number(active));
  assert.equal(before.source.painted, false);
  await Promise.all([p.waitForURL(target.href, { waitUntil: 'commit' }), link.click()]);
  await p.waitForFunction(id => window.__sourceFollow.hit(document.getElementById(id))?.hit, id);
  await settle(p);
  const arrived = await landing(p, id);
  assert.equal(arrived.url, row.route + '#' + id);
  assert.equal(arrived.doc, before.doc);
  assert.ok(arrived.source.hit && arrived.source.top >= 0 && arrived.source.bottom <= row.viewport.height);
  assert.deepEqual([arrived.phase, arrived.calls, arrived.index, arrived.live], [before.phase, before.calls, before.index, before.live]);
  assert.deepEqual(arrived.platform, before.platform);
  if (!native) {
    assert.equal(arrived.dialog, 'true'); assert.notEqual(arrived.overflow, 'hidden');
    assert.ok(arrived.source.focus);
  }
  const picture = row.id === 'anatomy-narrow-on';
  if (picture) await p.screenshot({ path: path.join(out, 'anatomy-at-source.png') });
  await settle(p);
  const held = await landing(p, id);
  assert.equal(held.y, arrived.y);
  assert.ok(held.source.hit);
  assert.deepEqual(held.platform, before.platform);
  let resumed = null;
  if (paused) {
    // Do not use Home, scrolling or a Product API to resume after landing.
    row.resume = await play(p, ['Продолжить озвучку']);
    resumed = await landing(p, id);
    assert.equal(resumed.phase, 'playing');
    assert.equal(resumed.y, held.y);
    assert.equal(resumed.calls, held.calls);
    assert.equal(resumed.platform.resumed, held.platform.resumed + 1);
  }
  let wordOffset = null;
  if (active) wordOffset = await p.evaluate(() => window.__sourceFollow.boundary());
  await settle(p);
  const atBoundary = await landing(p, id);
  assert.equal(atBoundary.y, arrived.y);
  assert.equal(atBoundary.calls, held.calls);
  assert.equal(atBoundary.scrollCalls, held.scrollCalls);
  assert.ok(atBoundary.source.hit);
  if (active) {
    assert.ok(wordOffset > 0);
    assert.equal(atBoundary.offset, wordOffset);
    await p.evaluate(() => window.__sourceFollow.end());
  }
  await settle(p);
  const next = await landing(p, id);
  if (picture) await p.screenshot({ path: path.join(out, 'anatomy-after-next-phrase.png') });
  assert.equal(next.url, arrived.url);
  assert.equal(next.doc, arrived.doc);
  const speech = await p.evaluate(() => window.__sourceFollow.calls.slice());
  const trails = await p.evaluate(({ i, j }) => {
    const w = window.__sourceFollow;
    return w.scroll.slice(i, j).map(({ el, ...call }) => ({ ...call, atSettle: w.hit(el) }));
  }, { i: atBoundary.scrollCalls, j: next.scrollCalls });
  assert.equal(speech.length, active ? 2 : 0);
  assert.deepEqual(speech.map(s => [s.index, s.lang]), active ? [[0, 'ru-RU'], [1, 'ru-RU']] : []);
  assert.equal(next.index, Number(active));
  assert.equal(next.platform.ended, Number(active));
  assert.equal(next.platform.started, speech.length);
  assert.equal(next.platform.canceled, 0);
  assert.equal(next.phase, active ? 'playing' : 'idle');
  assert.equal(next.engine, active ? 'webspeech' : null);
  if (expectedLeave) {
    assert.equal(trails.length, 1);
    const [follow] = trails;
    assert.equal(follow.hash, target.hash);
    assert.equal(follow.index, next.index);
    assert.equal(follow.count, atBoundary.calls);
    assert.equal(follow.quiz, false);
    assert.ok(follow.from.connected && follow.atSettle.hit);
    assert.ok(speech[1].text.startsWith(follow.text.slice(0, 40)));
    assert.deepEqual(follow.options, { behavior: 'smooth', block: 'center' });
    assert.equal(next.source.painted, false);
    assert.notEqual(next.y, arrived.y);
    if (!native && !paused) assert.equal(next.source.focus, true);
  } else {
    assert.equal(trails.length, 0);
    assert.ok(next.source.hit);
    assert.equal(next.y, arrived.y);
  }
  const response = await p.goBack({ waitUntil: 'commit' });
  const back = await landing(p, id);
  assert.equal(response, null);
  assert.equal(back.doc, before.doc);
  assert.equal(back.url, row.route + startHash);
  if (!native) await openLearning(p);
  const retained = await quizState(p, native);
  assert.deepEqual(retained, quiz);
  const snapshot = ({ doc, ...a }) => a;
  row.quiz = { ...quiz, hash: hash(JSON.stringify(quiz)), sameAfterBack: true };
  row.measurement = { before: snapshot(before), arrived: snapshot(arrived), held: snapshot(held),
    resumed: resumed && snapshot(resumed), boundary: snapshot(atBoundary), next: snapshot(next), sameDocument: true, back: { url: back.url, phase: back.phase },
    deltaY: next.y - arrived.y, sourceLeft: !next.source.painted, wordOffset, speech, callsAfterBoundary: trails };
}

const { base, server } = await serve();
const assets = new Set(), results = [];
let browser;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const [id, route, width, motion, mode] of jobs) {
    const viewport = { width, height: width === 390 ? 844 : 900 };
    const context = await browser.newContext({ viewport, reducedMotion: motion, colorScheme: 'light', serviceWorkers: 'block' });
    const errors = { page: [], localHttp: [], localRequests: [] }, documentRequests = [];
    const row = { id, route, viewport, motion, mode, errors, documentRequests };
    results.push(row);
    try {
      await context.addInitScript(platformProbe);
      await context.route('**/*', r => {
        const u = new URL(r.request().url());
        return u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' ? r.continue() : r.abort();
      });
      const p = await context.newPage(); p.setDefaultTimeout(11000);
      p.on('pageerror', e => errors.page.push(e.message.replaceAll(base, 'LOCAL')));
      p.on('requestfailed', request => {
        const u = new URL(request.url()), reason = request.failure()?.errorText;
        if (u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' && reason !== 'net::ERR_ABORTED') errors.localRequests.push([u.pathname, reason]);
      });
      p.on('response', res => {
        const u = new URL(res.url()); if (u.origin !== base) return;
        if (res.status() >= 400) errors.localHttp.push([res.status(), u.pathname]);
        const type = res.request().resourceType();
        if (type === 'document') documentRequests.push(u.pathname);
        if (res.ok() && ['document', 'script', 'stylesheet'].includes(type)) assets.add(u.pathname.slice(1) + (u.pathname.endsWith('/') ? 'index.html' : ''));
      });
      await run(p, row, base);
      assert.deepEqual(documentRequests, [route]);
      assert.ok(Object.values(errors).every(x => x.length === 0));
      row.ok = true;
      const m = row.measurement;
      console.log('OK', id, `scroll ${m.arrived.y}→${m.next.y}`, `source top ${m.arrived.source.top}→${m.next.source.top}`,
        `focus ${m.next.source.focus}`, `calls ${m.speech.length}`);
    } catch (error) { row.ok = false; row.error = String(error.stack || error).replaceAll(base, 'LOCAL'); console.error('FAIL', id, row.error); }
    finally { await context.close(); }
  }
  const file = name => fs.existsSync(path.join(out, name)) ? hash(fs.readFileSync(path.join(out, name))) : null;
  const witness = { anchor, chromium: browser.version(), playwright: req('playwright/package.json').version, node: process.versions.node,
    distSha256: Object.fromEntries([...assets].sort().map(f => [f, hash(fs.readFileSync(path.join(product, 'dist', f)))])),
    images: Object.fromEntries(['anatomy-at-source.png', 'anatomy-after-next-phrase.png'].map(name => [name, file(name)]).filter(x => x[1])), results };
  fs.writeFileSync(path.join(out, 'source-follow-witness.json'), JSON.stringify(witness, null, 2) + '\n');
  console.log(`${results.filter(r => r.ok).length}/${results.length} completed, ${assets.size} dist pins`);
  if (results.some(r => !r.ok)) process.exitCode = 1;
} finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
}
