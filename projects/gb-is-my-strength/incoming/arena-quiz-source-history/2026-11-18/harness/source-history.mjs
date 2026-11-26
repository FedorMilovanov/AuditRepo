// Same-document history traversal after a real quiz-source click. No fake popstate,
// script navigation/scroll/focus, modified href, or seeded quiz state.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node source-history.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const G = '/articles/dzhon-gill-chast-2-uchenyi/', A = '/articles/anatomiya-padeniya-pyat-stadiy/';
const SHEET = '#gillLearningOverlay', LINK = '#glsQuizSource', PANEL = '#panelQuiz', NATIVE = '#quizPlaceholder';
const jobs = [390, 1440].flatMap(width => ['native', 'closed', 'close-before', 'reopen-dismiss', 'reopen-link'].map(mode => ({
  id: `${mode}-${width}`, mode, viewport: { width, height: width === 390 ? 844 : 900 },
}))).filter(({ id }) => !only || id.includes(only));
assert.ok(jobs.length);
fs.mkdirSync(out, { recursive: true });
assert.ok(!fs.existsSync(path.join(out, 'source-history-witness.json')), 'use a fresh output directory');
const hash = s => createHash('sha256').update(s).digest('hex');
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const route = href => href === 'about:blank' ? href : href.replace(/^https?:\/\/[^/]+/, '');

function observe(linkSelector) {
  const events = [];
  const url = () => location.pathname + location.search + location.hash;
  for (const type of ['pageshow', 'pagehide', 'popstate', 'hashchange']) {
    window.addEventListener(type, e => events.push({ type, url: url(), ...('persisted' in e ? { persisted: e.persisted } : {}) }));
  }
  document.addEventListener('click', e => {
    const link = e.target instanceof Element ? e.target.closest(linkSelector) : null;
    if (!link) return;
    const item = { type: 'source-click', url: url(), href: link.getAttribute('href'), trusted: e.isTrusted, prevented: null };
    events.push(item);
    setTimeout(() => { item.prevented = e.defaultPrevented; }, 0);
  }, true);
  window.__sourceHistory = events;
}

async function openQuiz(p) {
  const desk = p.locator('#railSettingsBtn');
  await (await desk.isVisible() ? desk : p.locator('#mobSettingsBtn')).click();
  await p.locator('#mobLearningBtn').click();
  const tab = p.locator('#tabQuiz');
  if (await tab.getAttribute('aria-selected') !== 'true') await tab.click();
  await p.locator(`${SHEET}.is-open ${PANEL}`).waitFor();
}

async function answer(p, native) {
  if (native) {
    const q = await p.evaluate(() => SITE_CONFIG.quiz.questions[0]);
    await p.locator('#quizLaunch').click();
    await p.locator(`${NATIVE} .quiz-option`).nth((Number(q.correct) + 1) % q.options.length).click();
    return p.locator(`${NATIVE} .quiz-feedback a[href]`);
  }
  await openQuiz(p);
  const cards = JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for (let i = 0; i < cards.length; i++) {
    const prompt = norm(await p.locator('#glsQuizQuestion').innerText());
    const matches = cards.filter(q => norm(q.question) === prompt);
    assert.equal(matches.length, 1, prompt);
    const q = matches[0];
    await p.locator('#glsQuizConfRow [data-conf="sure"]').click();
    await p.locator('#glsQuizOptions').getByRole('button', { name: q.answers[(q.correctIndex + 1) % q.answers.length], exact: true }).click();
    await p.locator('#glsQuizVerdict:not([hidden])').waitFor();
    if (q.id === 'gill.scholar.canticles') return p.locator(LINK);
    await p.locator('#glsQuizNext').click();
  }
  throw new Error('target card not reached in one actual shuffled deck');
}

const quizSnapshot = (p, native) => p.locator(native ? `${NATIVE} .quiz-wrapper` : PANEL).evaluate((root, isNative) => {
  const get = (n, g) => root.querySelector(isNative ? n : g);
  const text = el => el?.textContent.replace(/\s+/gu, ' ').trim() ?? null;
  return {
    question: text(get('#quizQuestion', '#glsQuizQuestion')),
    seen: text(get('.quiz-progress', '#glsQuizStreak')),
    verdict: text(get('.quiz-feedback strong', '#glsQuizVerdict')),
    explanation: text(get('.quiz-explanation--full', '#glsQuizExplanation')),
    source: get('.quiz-feedback a', '#glsQuizSource')?.getAttribute('href'),
    options: [...root.querySelectorAll('.quiz-option')].map(btn => [text(btn), btn.disabled, btn.className]),
    calibration: text(root.querySelector('#glsQuizCalibPct')),
    confidence: root.querySelector('#glsQuizConfRow .is-picked')?.getAttribute('data-conf') ?? null,
  };
}, native);

const measure = (p, id) => p.evaluate(async id => {
  // Traversal can resolve before the browser applies persisted scroll. Require
  // stable rect + scroll on animation frames, without sending any scroll input.
  const heading = document.getElementById(id), overlay = document.getElementById('gillLearningOverlay');
  const start = performance.now();
  let lastChange = start, last = '';
  for (;;) {
    await new Promise(requestAnimationFrame);
    const geometry = [scrollX, scrollY, heading.getBoundingClientRect().top, document.documentElement.scrollHeight].join('/');
    const now = performance.now();
    if (geometry !== last) { last = geometry; lastChange = now; }
    if (now - lastChange >= 125 && now - start >= 180) break;
    if (now - start >= 4000) throw new Error('heading geometry did not settle');
  }
  const r = heading.getBoundingClientRect(), y = r.y + r.height / 2;
  const inViewport = r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && r.right > 0 && r.left < innerWidth;
  const describe = el => el ? el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.classList[0] ? '.' + el.classList[0] : '') : null;
  const samples = inViewport ? [0.25, 0.5, 0.75].map(t => {
    const x = Math.max(0, r.left) + t * (Math.min(r.right, innerWidth) - Math.max(0, r.left));
    const stack = document.elementsFromPoint(x, y);
    return { hit: heading.contains(stack[0]), under: stack.some(el => heading.contains(el)),
      layer: stack[0]?.closest('#gillLearningOverlay') ? 'learning' : null, topmost: describe(stack[0]) };
  }) : [];
  return {
    url: location.pathname + location.search + location.hash, doc: performance.timeOrigin, scrollY: Math.round(scrollY),
    scrollRestoration: history.scrollRestoration, historyLength: history.length, focus: describe(document.activeElement),
    sheet: { open: overlay?.classList.contains('is-open') ?? false, hidden: overlay?.getAttribute('aria-hidden') ?? null,
      lock: getComputedStyle(document.body).overflowY === 'hidden', activeQuiz: document.getElementById('tabQuiz')?.getAttribute('aria-selected') === 'true' },
    heading: { id, text: heading.textContent.replace(/\s+/gu, ' ').trim(), top: Math.round(r.top), bottom: Math.round(r.bottom),
      inViewport, hit: samples.some(s => s.hit), focus: document.activeElement === heading, samples },
  };
}, id);

async function exercise(p, context, base, row) {
  const native = row.mode === 'native', reopen = row.mode.startsWith('reopen-');
  const closeBefore = row.mode === 'close-before';
  const dismiss = () => p.locator(`${SHEET} button[aria-label="Закрыть"][data-overlay-close]`).click();
  const initial = native ? A + '#sec-quiz' : G, id = native ? 'metod' : 'sec-canticles';
  const target = (native ? A : G) + '#' + id;
  await context.addInitScript(observe, native ? `${NATIVE} .quiz-feedback a[href]` : LINK);
  assert.equal((await p.goto(base + initial, { waitUntil: 'load' })).status(), 200);
  await p.evaluate(() => document.fonts.ready);
  const source = await answer(p, native);
  const href = await source.getAttribute('href');
  assert.equal(new URL(href, p.url()).href, base + target);
  const state = await quizSnapshot(p, native);
  assert.match(state.verdict, /^Неверно/u);
  assert.ok(state.explanation && state.options.length === 4 && state.options.every(option => option[1]));
  if (!native) assert.ok(state.calibration && state.confidence === 'sure' && /^Пройдено: [1-9]/u.test(state.seen));
  row.quiz = { question: state.question, seen: state.seen, calibration: state.calibration,
    verdict: state.verdict, href, sha256: hash(JSON.stringify(state)) };
  const cdp = await context.newCDPSession(p);
  const steps = row.steps = {};
  const snap = async (step, url) => {
    const v = await measure(p, id);
    const { currentIndex, entries } = await cdp.send('Page.getNavigationHistory');
    assert.equal(v.url, url);
    assert.equal(v.historyLength, entries.length);
    assert.equal(route(entries[currentIndex].url), v.url);
    assert.deepEqual(await quizSnapshot(p, native), state, `answer after ${step}`);
    const { doc, ...compact } = v;
    if (step !== 'answered') assert.equal(doc, docBefore, 'history must keep original document');
    steps[step] = { ...compact, currentIndex, entries: entries.map(({ url }) => route(url)), sameAnswer: true };
    return { doc, entries: entries.map(({ id }) => id) };
  };
  const { doc: docBefore } = await snap('answered', initial);
  if (!native) assert.deepEqual(steps.answered.sheet, { open: true, hidden: 'false', lock: true, activeQuiz: true });
  await Promise.all([p.waitForURL(base + target, { waitUntil: 'commit' }), source.click()]);
  const { entries: afterClickIds } = await snap('click', target);
  assert.ok(steps.click.heading.hit && !steps.click.sheet.open && !steps.click.sheet.lock, 'ordinary handoff must land');
  if (!native) assert.ok(steps.click.heading.focus);
  assert.equal(steps.click.historyLength, steps.answered.historyLength + 1);
  assert.equal(steps.click.currentIndex, steps.answered.currentIndex + 1);
  if (row.id === 'reopen-link-390') await p.screenshot({ path: path.join(out, 'gill-click-390.png') });
  assert.equal(await p.goBack({ waitUntil: 'commit' }), null);
  assert.deepEqual((await snap('back', initial)).entries, afterClickIds);
  if (reopen || closeBefore) {
    await openQuiz(p);
    assert.deepEqual((await snap('reopen', initial)).entries, afterClickIds);
    assert.ok(steps.reopen.sheet.open && steps.reopen.sheet.lock && steps.reopen.sheet.activeQuiz);
  }
  if (closeBefore) {
    await dismiss();
    assert.deepEqual((await snap('dismissBeforeForward', initial)).entries, afterClickIds);
    assert.ok(!steps.dismissBeforeForward.sheet.open && !steps.dismissBeforeForward.sheet.lock);
  }
  assert.equal(await p.goForward({ waitUntil: 'commit' }), null);
  assert.deepEqual((await snap('forward', target)).entries, afterClickIds);
  if (row.id === 'reopen-link-390') await p.screenshot({ path: path.join(out, 'gill-forward-390.png') });
  if (reopen) {
    if (row.mode === 'reopen-dismiss') await dismiss();
    else await source.click();
    assert.deepEqual((await snap('recovery', target)).entries, afterClickIds);
    assert.ok(!steps.recovery.sheet.open && !steps.recovery.sheet.lock);
    if (row.id === 'reopen-link-390') await p.screenshot({ path: path.join(out, 'gill-reclick-390.png') });
  }
  if (!native) {
    await openQuiz(p);
    assert.deepEqual(await quizSnapshot(p, native), state);
    assert.ok(await p.locator(`${SHEET}.is-open #glsQuizVerdict:not([hidden])`).isVisible());
  }
  row.events = await p.evaluate(() => window.__sourceHistory.slice());
  const clicks = row.events.filter(e => e.type === 'source-click');
  assert.equal(clicks.length, row.mode === 'reopen-link' ? 2 : 1);
  assert.ok(clicks.every(c => c.trusted && c.prevented === !native && c.href === href));
  assert.deepEqual(row.events.filter(e => e.type === 'pageshow' || e.type === 'pagehide'), [{ type: 'pageshow', url: initial, persisted: false }]);
  for (const type of ['hashchange', 'popstate']) {
    assert.deepEqual(row.events.filter(e => e.type === type).map(e => e.url), native ? [target, initial, target] : [initial, target]);
  }
  assert.deepEqual(row.documentRequests, [initial.split('#')[0]]);
  assert.deepEqual(row.docs, [{ path: initial.split('#')[0], status: 200 }]);
  assert.equal(context.pages().length, 1);
  row.sameDocument = true;
  row.sameHistoryEntriesOnTraversalAndRecovery = true;
  row.quiz.retainedViaUi = true;
}

const { base, server } = await serve();
const assets = new Set(), results = [];
let browser;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const job of jobs) {
    const row = { ...job, documentRequests: [], docs: [], errors: [] };
    results.push(row);
    const context = await browser.newContext({ viewport: row.viewport, colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block' });
    context.setDefaultTimeout(8500);
    try {
      await context.route('**/*', r => {
        const u = new URL(r.request().url());
        return u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' ? r.continue() : r.abort();
      });
      context.on('weberror', e => row.errors.push(['pageerror', e.error().message.replaceAll(base, 'LOCAL')]));
      context.on('request', r => {
        const u = new URL(r.url());
        if (u.origin === base && r.resourceType() === 'document') row.documentRequests.push(u.pathname + u.search);
      });
      context.on('requestfailed', r => {
        const u = new URL(r.url()), reason = r.failure()?.errorText;
        if (u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' && reason !== 'net::ERR_ABORTED') row.errors.push(['request', u.pathname, reason]);
      });
      context.on('response', r => {
        const u = new URL(r.url());
        if (u.origin !== base) return;
        const type = r.request().resourceType(), status = r.status();
        if (type === 'document') row.docs.push({ path: u.pathname + u.search, status });
        if (status >= 400) row.errors.push(['http', u.pathname, status]);
        if (r.ok() && ['document', 'script', 'stylesheet'].includes(type)) assets.add(u.pathname.slice(1) + (u.pathname.endsWith('/') ? 'index.html' : ''));
      });
      const p = await context.newPage();
      await exercise(p, context, base, row);
      assert.deepEqual(row.errors, []);
      row.ok = true;
      const f = row.steps.forward, r = row.steps.recovery;
      console.log('OK', row.id, `forward y=${f.scrollY} top=${f.heading.top} hit=${f.heading.hit} sheet=${f.sheet.open} lock=${f.sheet.lock} focus=${f.focus}`,
        r ? `recovery y=${r.scrollY} top=${r.heading.top} hit=${r.heading.hit} focus=${r.focus}` : '');
    } catch (e) { row.ok = false; row.error = e.stack?.replaceAll(base, 'LOCAL') ?? String(e); console.error('FAIL', row.id, row.error); }
    finally { await context.close(); }
  }
  const data = { anchor, chromium: browser.version(), playwright: req('playwright/package.json').version, node: process.versions.node,
    method: { navigation: 'Chromium history traversal via page.goBack/goForward', reducedMotion: 'reduce', colorScheme: 'light',
      scope: 'same-document; no BFCache claim', geometry: '>=125 ms stable scroll/heading geometry; no explicit scroll or focus commands' },
    distSha256: Object.fromEntries([...assets].sort().map(f => [f, hash(fs.readFileSync(path.join(product, 'dist', f)))])), results };
  fs.writeFileSync(path.join(out, 'source-history-witness.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(`${results.filter(r => r.ok).length}/${results.length} measured, ${assets.size} dist pins`);
  if (results.some(r => !r.ok)) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
