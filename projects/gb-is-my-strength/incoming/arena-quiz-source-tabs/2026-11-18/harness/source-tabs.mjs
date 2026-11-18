// Real pointer / keyboard activation; observe browser pages and network, not just click cancellation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node source-tabs.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const A = '/articles/anatomiya-padeniya-pyat-stadiy/', G = '/articles/dzhon-gill-chast-2-uchenyi/';
const G1 = '/articles/dzhon-gill-chast-1-chelovek/';
const Q = '#quizPlaceholder', PANE = '#panelQuiz', SHEET = '#gillLearningOverlay';
const LINK = `${Q} .quiz-feedback a[href], #glsQuizSource[href]`;
const TRACK = '?utm_source=reader';
const specs = [
  ...['click', 'ctrl', 'middle', 'ctrl-enter'].map(input => [`anatomy-${input}`, 'native', input, input === 'click' ? 'parent' : 'child']),
  ...['click', 'ctrl', 'middle', 'ctrl-enter'].map(input => [`learning-local-${input}`, 'local', input, input === 'middle' ? 'child' : 'parent']),
  ['learning-cross-ctrl', 'cross', 'ctrl', 'child'],
  ['learning-tracked-ctrl', 'tracked', 'ctrl', 'child'],
  ['learning-play-ctrl', 'local', 'ctrl', 'parent', true],
  ['learning-play-middle', 'local', 'middle', 'child', true],
];
const jobs = specs.filter(([id]) => !only || id.includes(only));
assert.ok(jobs.length);
fs.mkdirSync(out, { recursive: true });
assert.ok(!fs.existsSync(path.join(out, 'source-tabs-witness.json')), 'use a fresh output folder');
const hash = s => createHash('sha256').update(s).digest('hex');
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const L = (p, s) => p.locator(s);
const route = url => { const u = new URL(url); return u.pathname + u.search + u.hash; };

function observe(links) {
  const events = [];
  let playback = { spoke: 0, canceled: 0, text: null };
  // In two controls only, keep the established Web Speech session from ending.
  // No Product handler or focus/navigation API is replaced.
  if (links.playing) {
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class {
      constructor(text) { this.text = String(text); }
    } });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [{ name: 'Controlled capture', lang: 'ru-RU', localService: true }],
      addEventListener() {}, removeEventListener() {}, pause() {}, resume() {},
      cancel() { playback.canceled++; playback.text = null; },
      speak(u) { playback.spoke++; playback.text = u.text; queueMicrotask(() => u.onstart?.()); },
    } });
  }
  for (const type of ['click', 'auxclick']) document.addEventListener(type, e => {
    const a = e.target instanceof Element && e.target.closest(links.selector);
    if (!a || !a.closest('#quizPlaceholder, #panelQuiz')) return;
    const record = { type, button: e.button, detail: e.detail, trusted: e.isTrusted, ctrl: e.ctrlKey, shift: e.shiftKey,
      alt: e.altKey, meta: e.metaKey, target: a.getAttribute('href'), prevented: null };
    events.push(record);
    // Read cancellation after dispatch (capture alone would run before the target handler).
    setTimeout(() => { record.prevented = e.defaultPrevented; }, 0);
  }, true);
  window.__sourceTabs = { events, playback };
}

function probeHeading(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const inside = r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight;
  const x = Math.min(innerWidth - 1, Math.max(0, r.x + r.width / 2));
  const y = r.y + r.height / 2;
  return { id, tag: el.tagName, text: el.textContent.replace(/\s+/gu, ' ').trim(), top: Math.round(r.top),
    bottom: Math.round(r.bottom), hit: inside && el.contains(document.elementFromPoint(x, y)),
    focused: document.activeElement === el };
}
const snapshot = p => p.evaluate(() => ({
  url: location.pathname + location.search + location.hash, doc: performance.timeOrigin, historyLength: history.length,
  focus: document.activeElement?.id || document.activeElement?.tagName, open: !!document.querySelector('#gillLearningOverlay.is-open'),
  sheetHidden: document.querySelector('#gillLearningOverlay')?.getAttribute('aria-hidden') ?? null,
  locked: getComputedStyle(document.body).overflowY === 'hidden',
  queue: window.GBReaderTTS ? { phase: GBReaderTTS.getState().phase, index: GBReaderTTS.getState().index } : null,
  playback: window.__sourceTabs.playback,
}));
async function startPlayback(p) {
  const controls = L(p, 'button[data-fc-action="play"]:visible:not(:disabled)');
  const idx = await controls.evaluateAll(nodes => nodes.findIndex(el => {
    const r = el.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
    return x > 0 && x < innerWidth && y > 0 && y < innerHeight && el.contains(document.elementFromPoint(x, y));
  }));
  assert.ok(idx >= 0, 'need an in-view Play button');
  const btn = controls.nth(idx), label = await btn.getAttribute('aria-label');
  assert.ok(['Озвучка', 'Озвучить статью'].includes(label));
  await btn.click();
  await p.waitForFunction(() => __sourceTabs.playback.spoke === 1 && GBReaderTTS.getState().phase === 'playing');
  return label;
}
async function openLearning(p) {
  await L(p, '#railSettingsBtn').click();
  await L(p, '#mobLearningBtn').click();
  if (await L(p, '#tabQuiz').getAttribute('aria-selected') !== 'true') await L(p, '#tabQuiz').click();
  await L(p, PANE).waitFor();
}
async function reachAnswer(p, kind) {
  if (kind === 'native') {
    const item = await p.evaluate(() => SITE_CONFIG.quiz.questions[0]);
    await L(p, '#quizLaunch').click();
    await L(p, `${Q} .quiz-option`).nth((Number(item.correct) + 1) % item.options.length).click();
    assert.equal(await L(p, `${Q} .quiz-feedback strong`).innerText(), 'Неверно');
    return L(p, `${Q} .quiz-feedback a[href]`);
  }
  const wanted = kind === 'cross' ? 'gill.man.horsleydown.years' : 'gill.scholar.canticles';
  await openLearning(p);
  const deck = JSON.parse(await L(p, '#gillQuizData').getAttribute('data-quiz'));
  for (let i = 0; i < deck.length; i++) {
    const label = norm(await L(p, '#glsQuizQuestion').innerText());
    const matches = deck.filter(q => norm(q.question) === label);
    assert.equal(matches.length, 1, label);
    const item = matches[0];
    const wrong = item.answers[(item.correctIndex + 1) % item.answers.length];
    await L(p, '#glsQuizConfRow [data-conf="sure"]').click();
    await L(p, '#glsQuizOptions').getByRole('button', { name: wrong, exact: true }).click();
    await L(p, '#glsQuizVerdict:not([hidden])').waitFor();
    if (item.id === wanted) {
      assert.match(await L(p, '#glsQuizVerdict').innerText(), /^Неверно/u);
      return L(p, '#glsQuizSource');
    }
    await L(p, '#glsQuizNext').click();
  }
  throw new Error(`target card not reached in one shuffled deck: ${wanted}`);
}
async function answerState(p, native) {
  return L(p, native ? `${Q} .quiz-wrapper` : PANE).evaluate((el, native) => {
    const txt = s => el.querySelector(s)?.textContent.replace(/\s+/gu, ' ').trim();
    return { question: txt(native ? '#quizQuestion' : '#glsQuizQuestion'), seen: txt(native ? '.quiz-progress' : '#glsQuizStreak'),
      verdict: txt(native ? '.quiz-feedback strong' : '#glsQuizVerdict'),
      explanation: txt(native ? '.quiz-explanation--full' : '#glsQuizExplanation'),
      source: el.querySelector(native ? '.quiz-feedback a' : '#glsQuizSource')?.getAttribute('href'),
      options: [...el.querySelectorAll('button.quiz-option')].map(b => [b.textContent.trim(), b.disabled, b.className]),
    };
  }, native);
}
async function keyboardReach(p, link, native) {
  const key = native ? 'Shift+Tab' : 'Tab';
  for (let n = 0; n <= 30; n++) {
    if (await link.evaluate(a => document.activeElement === a)) return { key, steps: n };
    await p.keyboard.press(key);
  }
  throw new Error(`source was not reached with ${key}`);
}
async function achieveLanding(p, id) {
  await p.waitForLoadState('load');
  // Actual fragment location, measured rather than scrolled by the test.
  const until = Date.now() + 4500;
  do {
    const h = await p.evaluate(probeHeading, id);
    if (h?.hit) return h;
    await p.evaluate(() => new Promise(r => requestAnimationFrame(r)));
  } while (Date.now() < until);
  throw new Error(`fragment ${id} is not in view: ` + JSON.stringify(await p.evaluate(probeHeading, id)));
}

async function exercise(p, context, base, row, expects) {
  const { kind, input, playing } = row, native = kind === 'native';
  const initial = native ? A + '#sec-quiz' : G + (kind === 'tracked' ? TRACK : '');
  const target = native ? A + '#metod' : kind === 'cross' ? G1 + '#part-pastor' : G + '#sec-canticles';
  assert.equal((await p.goto(base + initial, { waitUntil: 'load', timeout: 30000 })).status(), 200);
  await p.waitForFunction(() => window.GBReaderTTS?.getState().phase === 'idle' && document.getElementById('quizLaunch'));
  if (playing) row.play = await startPlayback(p);
  const link = await reachAnswer(p, kind);
  const label = norm(await link.innerText()), raw = await link.getAttribute('href');
  assert.equal(new URL(raw, p.url()).href, base + target);
  assert.equal(await link.getAttribute('target'), null);
  const quiz = await answerState(p, native);
  assert.equal(quiz.options.length, 4);
  assert.ok(quiz.options.every(x => x[1]));
  if (input === 'ctrl-enter') row.keyboard = await keyboardReach(p, link, native);
  else if (native) {
    // Settle the native link before delivering a mouse chord; Playwright would
    // otherwise auto-scroll from the quiz option just before pressing it.
    await link.scrollIntoViewIfNeeded();
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    assert.ok(await link.evaluate(a => {
      const r = a.getBoundingClientRect();
      return a.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    }), 'link centre must be hittable as a real pointer target');
  } else await link.click({ trial: true }); // use Playwright's visible hit point for the dialog link
  await p.bringToFront();
  const b = await snapshot(p);
  assert.equal(b.url, initial);
  if (!native) assert.ok(b.open && b.sheetHidden === 'false' && b.locked);
  assert.equal(b.queue.phase, playing ? 'playing' : 'idle');
  assert.equal(b.playback.spoke, Number(playing));
  const newPages = [];
  context.on('page', page => newPages.push(page));
  // Browser pass-through and getting a new page are separate measurements.
  // A valid unprevented activation may produce no observable new context in
  // Headless Shell; record that outcome instead of treating it as interception.
  const action = () => input === 'ctrl-enter' ? p.keyboard.press('Control+Enter') :
    link.click({ button: input === 'middle' ? 'middle' : 'left', modifiers: input === 'ctrl' ? ['Control'] : [] });
  let dest;
  let incompletePage = null;
  try {
    if (expects === 'child') {
      await action();
      dest = newPages[0] ?? await context.waitForEvent('page', { timeout: 3500 }).catch(e => {
        if (e.name !== 'TimeoutError') throw e;
        return null;
      });
    } else {
      await Promise.all([p.waitForURL(base + target, { waitUntil: 'commit' }), action()]);
      dest = p;
    }
    if (dest) await dest.waitForURL(base + target, { waitUntil: 'commit', timeout: 4500 });
  } catch (e) {
    if (e.name === 'TimeoutError' && expects === 'child' && dest?.url() === 'about:blank') {
      incompletePage = { url: 'about:blank' };
    } else {
      row.failedAction = { parent: route(p.url()), pages: context.pages().map(x => x.url().replace(base, 'LOCAL')),
        ...(await p.evaluate(() => ({ events: window.__sourceTabs?.events, focus: document.activeElement?.outerHTML.slice(0, 700), y: scrollY }))),
      };
      console.error('action diagnostic:', row.failedAction);
      throw e;
    }
  }
  const heading = dest && !incompletePage ? await achieveLanding(dest, decodeURIComponent(new URL(base + target).hash.slice(1))) : null;
  await p.waitForFunction(() => __sourceTabs.events.some(e => e.prevented !== null));
  const events = await p.evaluate(() => __sourceTabs.events);
  const a = await snapshot(p);
  assert.equal(events.length, 1);
  const [e] = events;
  assert.deepEqual([e.type, e.button, e.ctrl, e.trusted],
    [input === 'middle' ? 'auxclick' : 'click', input === 'middle' ? 1 : 0, input.startsWith('ctrl'), true]);
  assert.equal(e.target, raw);
  assert.ok(!e.shift && !e.alt && !e.meta);
  if (input === 'ctrl-enter') assert.equal(e.detail, 0);
  assert.equal(e.prevented, expects === 'parent' && !native);
  assert.equal(a.doc, b.doc);
  assert.deepEqual(a.queue, b.queue);
  assert.deepEqual(a.playback, b.playback);
  let reopened = false;
  let child = null;
  if (expects === 'child') {
    assert.equal(newPages.length, Number(!!dest));
    assert.equal(context.pages().length, 1 + Number(!!dest));
    assert.equal(a.url, b.url);
    assert.equal(a.historyLength, b.historyLength);
    assert.deepEqual([a.open, a.sheetHidden, a.locked], [b.open, b.sheetHidden, b.locked]);
    if (dest && !incompletePage) {
      const d = await snapshot(dest);
      assert.notEqual(d.doc, b.doc);
      assert.equal(d.url, target);
      assert.equal(d.open, false);
      assert.equal(d.locked, false);
      assert.deepEqual(d.queue, { phase: 'idle', index: 0 });
      assert.equal(d.playback.spoke, 0);
      child = { url: d.url, separateDocument: d.doc !== b.doc, openSheet: d.open, locked: d.locked, queue: d.queue };
    }
  } else {
    // Observe through the settled fragment/focus; both context page count and
    // context-level document requests are checked (including any child load).
    assert.equal(newPages.length, 0);
    assert.equal(context.pages().length, 1);
    assert.equal(a.url, target);
    assert.equal(a.historyLength, b.historyLength + 1);
    if (!native) {
      assert.ok(!a.open && a.sheetHidden === 'true' && !a.locked && heading.focused);
      await openLearning(p);
      reopened = true;
    }
  }
  const retained = await answerState(p, native);
  assert.deepEqual(retained, quiz);
  const compact = ({ doc, ...m }) => m;
  row.link = { label, raw, target };
  row.quiz = { question: quiz.question, seen: quiz.seen, verdict: quiz.verdict,
    sha256: hash(JSON.stringify(quiz)), retained: true, reopenNeeded: reopened };
  row.witness = { expected: expects, outcome: expects === 'parent' ? 'parent-fragment' :
    child ? 'new-page' : incompletePage ? 'blank-context' : 'no-page-observed',
    newPages: newPages.length, pageCount: context.pages().length, action: e,
    before: compact(b), parent: compact(a), parentSameDocument: true, child, incompletePage, heading };
}

const { base, server } = await serve();
const assets = new Set(), results = [];
let browser;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const [id, kind, input, expects, playing = false] of jobs) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce',
      colorScheme: 'light', serviceWorkers: 'block' });
    context.setDefaultTimeout(8500);
    const row = { id, kind, input, playing, errors: { page: [], localHttp: [], localRequests: [] }, docs: [] };
    results.push(row);
    try {
      await context.addInitScript(observe, { selector: LINK, playing });
      await context.route('**/*', r => {
        const u = new URL(r.request().url());
        return u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' ? r.continue() : r.abort();
      });
      context.on('weberror', e => row.errors.page.push(e.error().message.replaceAll(base, 'LOCAL')));
      context.on('requestfailed', req => {
        const u = new URL(req.url()), error = req.failure()?.errorText;
        if (u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' && error !== 'net::ERR_ABORTED') row.errors.localRequests.push([u.pathname, error]);
      });
      context.on('response', res => {
        const u = new URL(res.url()); if (u.origin !== base) return;
        const type = res.request().resourceType();
        if (type === 'document') row.docs.push({ path: u.pathname + u.search, status: res.status() });
        if (res.status() >= 400) row.errors.localHttp.push([res.status(), u.pathname]);
        if (res.ok() && ['document', 'script', 'stylesheet'].includes(type)) assets.add(u.pathname.slice(1) + (u.pathname.endsWith('/') ? 'index.html' : ''));
      });
      const p = await context.newPage();
      await exercise(p, context, base, row, expects);
      const before = row.witness.before.url.split('#')[0];
      const after = row.link.target.split('#')[0];
      const observedResponse = row.docs.length === 2;
      if (expects === 'child' && !row.witness.child && !row.witness.incompletePage && observedResponse) {
        row.witness.outcome = 'document-response-without-page';
      }
      const expectedResponse = row.witness.child || row.witness.outcome === 'document-response-without-page' ||
        (row.witness.outcome === 'blank-context' && observedResponse);
      assert.deepEqual(row.docs, [before, ...(expectedResponse ? [after] : [])].map(path => ({ path, status: 200 })));
      assert.ok(Object.values(row.errors).every(x => x.length === 0));
      row.ok = true;
      console.log('OK', id, row.witness.action.type, `prevented=${row.witness.action.prevented}`, row.witness.outcome, `newPages=${row.witness.newPages}`,
        `parent=${row.witness.parent.url}`, row.keyboard ? `keyboard=${row.keyboard.steps}` : '');
    } catch (error) { row.ok = false; row.error = String(error.stack || error).replaceAll(base, 'LOCAL'); console.error('FAIL', id, row.error); }
    finally { await context.close(); }
  }
  const data = { anchor, chromium: browser.version(), playwright: req('playwright/package.json').version, node: process.versions.node,
    viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', passThroughObservationMs: 3500,
    distSha256: Object.fromEntries([...assets].sort().map(f => [f, hash(fs.readFileSync(path.join(product, 'dist', f)))])), results };
  fs.writeFileSync(path.join(out, 'source-tabs-witness.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(`${results.filter(r => r.ok).length}/${results.length} completed, ${assets.size} dist pins`);
  if (results.some(r => !r.ok)) process.exitCode = 1;
} finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
}
