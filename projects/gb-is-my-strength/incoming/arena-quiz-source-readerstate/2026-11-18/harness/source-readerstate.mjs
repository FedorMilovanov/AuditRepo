// Independently created ReaderState records; follow the real homepage / article
// Continue controls or an explicit fragment. No storage, scroll, or focus API writes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node source-readerstate.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const ROUTE = '/articles/dzhon-gill-chast-2-uchenyi/', KEY = ROUTE.slice(0, -1);
const SOURCE = 'sec-canticles', PRIOR = 'sec-hebrew', OTHER = '/hard-texts/genesis-6/';
const STORAGE_KEY = 'gb:reader-state:v1:gb-strength:' + KEY;
const TOAST = '.gbs2-resume', HOME = '#resumeReadingBlock';
const cases = ['home', 'toast'].flatMap(surface => ['learning', 'native', 'wheel'].map(mode => [surface, mode]));
cases.push(['fragment', 'learning'], ['library-bridge', 'wheel']);
const jobs = [390, 1440].flatMap(width => cases.map(([surface, mode]) => ({ id: `${surface}-${mode}-${width}`,
  surface, mode, viewport: { width, height: width === 390 ? 844 : 900 },
}))).filter(({ id }) => !only || id.includes(only));
assert.ok(jobs.length);
fs.mkdirSync(out, { recursive: true });
assert.ok(!fs.existsSync(path.join(out, 'source-readerstate-witness.json')), 'use fresh output directory');
const hash = s => createHash('sha256').update(s).digest('hex');
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();

async function openLibrary(p) {
  await p.locator('#gb-hl-fab').click();
  await p.locator('#gb-hl-backdrop.is-open').waitFor();
}
async function addReading(p) {
  await openLibrary(p);
  await p.locator('[data-research-action="start-current"]').click();
  await p.waitForFunction(({ key, storage }) => JSON.parse(localStorage.getItem(storage) ?? '{}')[key]?.state === 'reading',
    { key: KEY, storage: 'gb-library-reading-v1' });
  await p.locator('#gb-hl-close').click();
  await p.locator('#gb-hl-backdrop:not(.is-open)').waitFor({ state: 'attached' });
}
async function reachAnswer(p, native) {
  if (native) {
    const q = await p.evaluate(() => SITE_CONFIG.quiz.questions[0]);
    await p.locator('#quizLaunch').click();
    await p.locator('#quizPlaceholder .quiz-option').nth((Number(q.correct) + 1) % q.options.length).click();
    assert.equal(await p.locator('#quizPlaceholder .quiz-feedback strong').innerText(), 'Неверно');
    return p.locator('#quizPlaceholder .quiz-feedback a[href]');
  }
  const wide = p.locator('#railSettingsBtn');
  await (await wide.isVisible() ? wide : p.locator('#mobSettingsBtn')).click();
  await p.locator('#mobLearningBtn').click();
  await p.locator('#tabQuiz').click();
  const deck = JSON.parse(await p.locator('#gillQuizData').getAttribute('data-quiz'));
  for (let i = 0; i < deck.length; i++) {
    const prompt = norm(await p.locator('#glsQuizQuestion').innerText());
    const matches = deck.filter(q => norm(q.question) === prompt);
    assert.equal(matches.length, 1);
    const item = matches[0];
    await p.locator('#glsQuizConfRow [data-conf="sure"]').click();
    await p.locator('#glsQuizOptions').getByRole('button', { name: item.answers[(item.correctIndex + 1) % item.answers.length], exact: true }).click();
    await p.locator('#glsQuizVerdict:not([hidden])').waitFor();
    if (item.id === 'gill.scholar.canticles') {
      assert.match(await p.locator('#glsQuizVerdict').innerText(), /^Неверно/u);
      return p.locator('#glsQuizSource');
    }
    await p.locator('#glsQuizNext').click();
  }
  throw new Error('target never appeared in a real deck');
}
const quiz = (p, native) => p.locator(native ? '#quizPlaceholder .quiz-wrapper' : '#panelQuiz').evaluate((el, native) => ({
  question: el.querySelector(native ? '#quizQuestion' : '#glsQuizQuestion').textContent.trim(),
  seen: el.querySelector(native ? '.quiz-progress' : '#glsQuizStreak')?.textContent.trim(),
  text: el.textContent.replace(/\s+/gu, ' ').trim(),
  options: [...el.querySelectorAll('.quiz-option')].map(b => [b.textContent.trim(), b.className, b.disabled]),
}), native);
async function stable(p) {
  await p.evaluate(async () => {
    await document.fonts.ready;
    let sameSince = performance.now(), last = null;
    const began = sameSince;
    while (performance.now() - began < 4500) {
      await new Promise(requestAnimationFrame);
      const next = [scrollY, document.documentElement.scrollHeight, document.getElementById('sec-canticles')?.getBoundingClientRect().top].join('/');
      const now = performance.now();
      if (next !== last) { sameSince = now; last = next; }
      if (now - sameSince >= 160) return;
    }
    throw new Error('article scroll/geometry did not settle');
  });
}

const saved = p => p.evaluate(({ storageKey, key }) => {
  const raw = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
  const library = JSON.parse(localStorage.getItem('gb-library-reading-v1') ?? '{}')[key];
  const { sectionId, sectionTitle, scrollY, progress, source } = raw ?? {};
  return { reader: raw ? { sectionId, sectionTitle, scrollY, progress, source } : null,
    library: library ? { anchor: library.anchor, ratio: library.ratio, state: library.state } : null };
}, { storageKey: STORAGE_KEY, key: KEY });

async function measure(p) {
  await stable(p);
  return p.evaluate(({ source, prior, toast }) => {
    const heading = id => {
      const e = document.getElementById(id);
      const b = e.getBoundingClientRect(), x = b.x + b.width / 2, y = b.y + b.height / 2;
      const inView = b.top >= 0 && b.bottom <= innerHeight && b.height > 0 && x >= 0 && x < innerWidth;
      return { id, text: e.textContent.replace(/\s+/gu, ' ').trim(), top: Math.round(b.top),
        bottom: Math.round(b.bottom), inView, hit: inView && e.contains(document.elementFromPoint(x, y)),
        focused: document.activeElement === e };
    };
    const current = window.GBReaderState.getSnapshot();
    return { doc: performance.timeOrigin, nav: performance.getEntriesByType('navigation')[0]?.type,
      url: location.pathname + location.search + location.hash, scrollY: Math.round(scrollY),
      target: document.querySelector(':target')?.id ?? null,
      source: heading(source), preceding: heading(prior),
      sheetOpen: Boolean(document.querySelector('#gillLearningOverlay.is-open')),
      locked: getComputedStyle(document.body).overflowY === 'hidden',
      toastOn: Boolean(document.querySelector(toast + '.gbs2-on')),
      state: { sectionId: current.sectionId, sectionTitle: current.sectionTitle, scrollY: current.scrollY,
        readingLine: current.readingLine, progress: current.progress },
    };
  }, { source: SOURCE, prior: PRIOR, toast: TOAST });
}
const withoutDoc = ({ doc, ...v }) => v;

async function exercise(p, base, row) {
  const native = row.mode === 'native', bridge = row.surface === 'library-bridge';
  const target = ROUTE + '#' + SOURCE;
  assert.equal((await p.goto(base + ROUTE, { waitUntil: 'load' })).status(), 200);
  assert.deepEqual(await saved(p), { reader: null, library: null });
  if (bridge) await addReading(p);
  const firstDoc = await p.evaluate(() => performance.timeOrigin);
  const link = await reachAnswer(p, native), raw = await link.getAttribute('href');
  assert.equal(new URL(raw, p.url()).href, base + target);
  const before = await quiz(p, native);
  assert.ok(before.options.length === 4 && before.options.every(x => x[2]));
  await Promise.all([p.waitForURL(base + target, { waitUntil: 'commit' }), link.click()]);
  const landed = await measure(p);
  assert.equal(landed.doc, firstDoc);
  assert.ok(landed.source.hit && !landed.locked && !landed.sheetOpen);
  if (!native) assert.ok(landed.source.focused);
  assert.deepEqual(await quiz(p, native), before);
  row.quiz = { question: before.question, progress: before.seen, href: raw, retainedOnHandoff: true };
  row.click = withoutDoc(landed);
  if (row.mode === 'wheel') {
    const dy = landed.source.top - 300;
    assert.ok(dy > 0);
    await p.mouse.move(row.viewport.width / 2, Math.round((landed.source.top + landed.source.bottom) / 2));
    await p.mouse.wheel(0, dy);
    await p.waitForFunction(id => {
      const top = document.getElementById(id).getBoundingClientRect().top;
      return top > 250 && top <= GBReaderState.getReadingLine();
    }, SOURCE);
    const v = await measure(p);
    assert.ok(v.source.hit && v.doc === firstDoc && v.url === target);
    assert.ok(v.source.top > 250 && v.source.top < v.state.readingLine);
    row.wheel = { dy, ...withoutDoc(v) };
  }
  const leave = row.wheel || row.click;
  // Leave while actually at the source; navigating the address directly avoids
  // scrolling the source document to a non-sticky header home link first.
  assert.equal((await p.goto(base + '/', { waitUntil: 'load' })).status(), 200);
  const homeDoc = await p.evaluate(() => performance.timeOrigin);
  assert.notEqual(homeDoc, firstDoc);
  const { reader, library } = await saved(p);
  assert.ok(reader?.source === 'reader-state-v1' && Boolean(library) === bridge);
  assert.equal(reader.scrollY, leave.scrollY);
  assert.equal(reader.sectionId, leave.state.sectionId);
  row.recordAtHome = { ...reader, library };
  let arrived, entry;
  if (row.surface === 'home' || bridge) {
    const card = p.locator(HOME), resume = p.locator('#resumeReadingLink');
    await card.waitFor();
    const href = await resume.getAttribute('href');
    assert.equal(await resume.innerText(), 'Продолжить');
    assert.equal(href, KEY + '#' + reader.sectionId);
    row.control = { href, meta: norm(await p.locator('#resumeReadingMeta').innerText()), title: norm(await p.locator('#resumeReadingTitle').innerText()) };
    if (row.id === 'home-learning-390') {
      await resume.click({ trial: true }); // make the home card visible for the viewport receipt
      await p.screenshot({ path: path.join(out, 'home-resume-390.png') });
    }
    if (bridge) {
      assert.equal(library.state, 'reading');
      assert.equal((await p.goto(base + OTHER, { waitUntil: 'load' })).status(), 200);
      assert.deepEqual(await saved(p), { reader, library });
      await openLibrary(p);
      const libraryResume = p.locator(`[data-research-action="resume"][data-value="${KEY}"]`);
      assert.equal(await libraryResume.innerText(), 'Продолжить');
      await Promise.all([p.waitForURL(base + KEY, { waitUntil: 'load' }), libraryResume.click()]);
      await p.waitForFunction(() => scrollY > 500 && sessionStorage.getItem('gb-library-resume-once') === null);
      arrived = await measure(p);
      entry = KEY;
      row.bridge = { sameBothRecordsOnOtherRoute: true, libraryButton: 'Продолжить' };
    } else {
      await Promise.all([p.waitForURL(base + href, { waitUntil: 'load' }), resume.click()]);
      arrived = await measure(p);
      entry = href.split('#')[0];
    }
  } else if (row.surface === 'toast') {
    assert.equal((await p.goto(base + ROUTE, { waitUntil: 'load' })).status(), 200);
    const toast = p.locator(TOAST + '.gbs2-on');
    await toast.waitFor();
    const v = await measure(p);
    assert.ok(v.toastOn && v.url === ROUTE && v.scrollY <= 200 && !v.source.hit);
    row.control = { text: norm(await toast.locator('span').innerText()), before: withoutDoc(v) };
    await toast.locator('.gbs2-resume-go').click();
    await p.locator(TOAST).waitFor({ state: 'detached' });
    arrived = await measure(p);
    assert.equal(arrived.doc, v.doc, 'toast must act in the existing document');
    entry = ROUTE;
  } else {
    assert.equal((await p.goto(base + target, { waitUntil: 'load' })).status(), 200);
    arrived = await measure(p);
    entry = ROUTE;
  }
  assert.notEqual(arrived.doc, firstDoc);
  assert.notEqual(arrived.doc, homeDoc);
  assert.ok(!arrived.sheetOpen && !arrived.locked && arrived.nav === 'navigate');
  assert.ok(arrived.source.hit || arrived.preceding.hit, 'verify a visible section, not just a URL');
  row.returned = { newDocumentAfterDeparture: true, ...withoutDoc(arrived) };
  if (row.id === 'home-learning-390') await p.screenshot({ path: path.join(out, 'home-resumed-390.png') });
  const expected = [ROUTE, '/', ...(bridge ? [OTHER] : []), entry];
  assert.deepEqual(row.requests, expected);
  assert.deepEqual(row.responses, expected.map(path => ({ path, status: 200 })));
}

const { base, server } = await serve();
let browser;
const assets = new Set(), results = [];
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const job of jobs) {
    const row = { ...job, requests: [], responses: [], errors: [] };
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
        if (u.origin === base && r.resourceType() === 'document') row.requests.push(u.pathname + u.search);
      });
      context.on('requestfailed', r => {
        const u = new URL(r.url()), reason = r.failure()?.errorText;
        if (u.origin === base && u.pathname !== '/js/vosk-tts-engine.js' && reason !== 'net::ERR_ABORTED') row.errors.push(['request', u.pathname, reason]);
      });
      context.on('response', r => {
        const u = new URL(r.url());
        if (u.origin !== base) return;
        const type = r.request().resourceType(), status = r.status();
        if (type === 'document') row.responses.push({ path: u.pathname + u.search, status });
        if (status >= 400) row.errors.push(['http', u.pathname, status]);
        if (r.ok() && ['document', 'script', 'stylesheet'].includes(type)) {
          let rel = u.pathname.slice(1).replace(/\/*$/u, '');
          if (type === 'document' && !rel.endsWith('.html')) rel = rel ? rel + '/index.html' : 'index.html';
          assets.add(rel);
        }
      });
      await exercise(await context.newPage(), base, row);
      assert.equal(context.pages().length, 1);
      assert.deepEqual(row.errors, []);
      row.ok = true;
      const left = row.wheel || row.click;
      console.log('OK', row.id, `save=${row.recordAtHome.sectionId}@${left.scrollY} sourceTop=${left.source.top}`,
        `return=${row.returned.url} y=${row.returned.scrollY} srcHit=${row.returned.source.hit} prevHit=${row.returned.preceding.hit} toast=${row.returned.toastOn}`);
    } catch (e) { row.ok = false; row.error = e.stack?.replaceAll(base, 'LOCAL') ?? String(e); console.error('FAIL', row.id, row.error); }
    finally { await context.close(); }
  }
  const witness = { anchor, chromium: browser.version(), playwright: req('playwright/package.json').version, node: process.versions.node,
    method: { reducedMotion: 'reduce', colorScheme: 'light', storage: 'actual writes after pagehide; library reading mark only in library-bridge; no seeding',
      entry: 'actual homepage link, article toast, and library; direct URL for explicit fragment control' },
    distSha256: Object.fromEntries([...assets].sort().map(f => [f, hash(fs.readFileSync(path.join(product, 'dist', f)))])), results,
  };
  fs.writeFileSync(path.join(out, 'source-readerstate-witness.json'), JSON.stringify(witness, null, 2) + '\n');
  console.log(`${results.filter(r => r.ok).length}/${results.length} measured, ${assets.size} dist pins`);
  if (results.some(r => !r.ok)) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
