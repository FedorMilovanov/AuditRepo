// Answer, navigate to the authored source, leave, and resume through the real library.
// No storage writes, scroll APIs, seeded attempts, or link changes from this harness.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const [pArg, oArg, executablePath, only] = process.argv.slice(2);
assert.ok(pArg && oArg && executablePath, 'node source-resume.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(pArg), out = path.resolve(oArg);
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const ROUTE = '/articles/dzhon-gill-chast-2-uchenyi/', KEY = ROUTE.slice(0, -1);
const OTHER = '/hard-texts/genesis-6/', SOURCE = 'sec-canticles';
const LIBRARY = 'gb-library-reading-v1', SESSION = 'gb-library-resume-once';
const modes = ['native', 'learning', 'learning-wheel'];
const jobs = [390, 1440].flatMap(width => modes.map(mode => ({ id: `${mode}-${width}`, mode,
  viewport: { width, height: width === 390 ? 844 : 900 },
}))).filter(({ id }) => !only || id.includes(only));
assert.ok(jobs.length);
fs.mkdirSync(out, { recursive: true });
assert.ok(!fs.existsSync(path.join(out, 'source-resume-witness.json')), 'use fresh output directory');
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
    { key: KEY, storage: LIBRARY });
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
const stored = p => p.evaluate(({ key, storage }) => {
  const lib = JSON.parse(localStorage.getItem(storage) ?? '{}')[key];
  if (!lib) return null;
  const { state, anchor, ratio, updatedAt } = lib;
  return { state, anchor, ratio, updatedAt };
}, { key: KEY, storage: LIBRARY });

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
async function measure(p, savedId = null) {
  await stable(p);
  return p.evaluate(({ key, source, savedId, storage }) => {
    const heading = id => {
      const e = id ? document.getElementById(id) : null;
      if (!e) return null;
      const b = e.getBoundingClientRect(), x = b.x + b.width / 2, y = b.y + b.height / 2;
      const inView = b.top >= 0 && b.bottom <= innerHeight && b.height > 0 && x >= 0 && x < innerWidth;
      return { id, tag: e.tagName, text: e.textContent.replace(/\s+/gu, ' ').trim(), top: Math.round(b.top),
        bottom: Math.round(b.bottom), inView, hit: inView && e.contains(document.elementFromPoint(x, y)),
        focused: document.activeElement === e };
    };
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const rec = JSON.parse(localStorage.getItem(storage) ?? '{}')[key];
    const stateKey = Object.keys(localStorage).find(k => k.startsWith('gb:reader-state:v1:') && k.endsWith(':' + key));
    const st = stateKey ? JSON.parse(localStorage.getItem(stateKey)) : null;
    const current = window.GBReaderState?.getSnapshot();
    const q = s => s ? { sectionId: s.sectionId, scrollY: s.scrollY, progress: s.progress } : null;
    return { document: performance.timeOrigin, nav: performance.getEntriesByType('navigation')[0]?.type,
      route: location.pathname + location.search + location.hash,
      scrollY: Math.round(scrollY), maxScroll: max, libraryCutoff: Math.max(90, Math.min(innerHeight * .35, 250)),
      unlocked: getComputedStyle(document.body).overflowY !== 'hidden',
      source: heading(source), savedHeading: heading(savedId ?? rec?.anchor),
      library: rec ? { anchor: rec.anchor, state: rec.state, ratio: rec.ratio } : null,
      readerState: { current: q(current), saved: q(st), readingLine: current?.readingLine ?? null },
    };
  }, { key: KEY, source: SOURCE, savedId, storage: LIBRARY });
}
async function awaitSave(p, updatedAfter) {
  await p.waitForFunction(({ key, storage, updatedAfter }) => {
    const record = JSON.parse(localStorage.getItem(storage) ?? '{}')[key];
    const liveRatio = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    return record?.state === 'reading' && record.updatedAt > updatedAfter && Math.abs(record.ratio - liveRatio) < 0.0001;
  }, { key: KEY, storage: LIBRARY, updatedAfter }, { timeout: 5000 });
}

async function exercise(p, context, base, row) {
  const native = row.mode === 'native';
  assert.equal((await p.goto(base + ROUTE, { waitUntil: 'load' })).status(), 200);
  assert.equal(await stored(p), null, 'start with an unmarked article in an empty context');
  await addReading(p);
  const link = await reachAnswer(p, native), raw = await link.getAttribute('href');
  assert.equal(new URL(raw, p.url()).href, base + ROUTE + '#' + SOURCE);
  const before = await quiz(p, native);
  assert.equal(before.options.length, 4);
  assert.ok(before.options.every(opt => opt[2]));
  const docStart = await p.evaluate(() => performance.timeOrigin);
  const oldSave = (await stored(p)).updatedAt;
  await Promise.all([p.waitForURL(base + ROUTE + '#' + SOURCE, { waitUntil: 'commit' }), link.click()]);
  await awaitSave(p, oldSave);
  const arrived = await measure(p);
  assert.equal(arrived.document, docStart);
  assert.ok(arrived.source.hit && arrived.unlocked);
  if (!native) assert.ok(arrived.source.focused);
  assert.deepEqual(await quiz(p, native), before);
  row.quiz = { question: before.question, seen: before.seen, retainedOnHandoff: true, href: raw };
  const { document: _, ...click } = arrived;
  row.click = click;
  if (row.mode === 'learning-wheel') {
    const prior = (await stored(p)).updatedAt;
    const wheel = Math.round(arrived.source.top - 145);
    assert.ok(wheel > 0);
    await p.mouse.move(row.viewport.width / 2, Math.round((arrived.source.top + arrived.source.bottom) / 2));
    await p.mouse.wheel(0, wheel);
    await p.waitForFunction(id => document.getElementById(id).getBoundingClientRect().top < 250, SOURCE);
    await awaitSave(p, prior);
    const adjusted = await measure(p);
    assert.equal(adjusted.document, docStart);
    assert.ok(adjusted.source.hit && adjusted.source.top < adjusted.libraryCutoff);
    const { document: __, ...rest } = adjusted;
    row.wheel = { deltaY: wheel, ...rest };
  }
  const left = row.wheel || row.click;
  if (row.id === 'learning-390') await p.screenshot({ path: path.join(out, 'gill-visible-before-leave.png') });
  // Open another actual reader route. The way back is through the library's
  // button, not goto, reload, browser history, or a prewritten session flag.
  assert.equal((await p.goto(base + OTHER, { waitUntil: 'load' })).status(), 200);
  assert.notEqual(await p.evaluate(() => performance.timeOrigin), docStart);
  await openLibrary(p);
  const record = await stored(p);
  assert.equal(record.state, left.library.state);
  assert.equal(record.anchor, left.library.anchor);
  assert.equal(record.ratio, left.library.ratio);
  // Read the other owner after navigation: ReaderState flushes on pagehide,
  // so this does not confuse a pending debounce with a missing saved record.
  const canonical = await p.evaluate(key => {
    const k = Object.keys(localStorage).find(k => k.startsWith('gb:reader-state:v1:') && k.endsWith(':' + key));
    const v = k ? JSON.parse(localStorage.getItem(k)) : null;
    return v ? { key: k, sectionId: v.sectionId, scrollY: v.scrollY, progress: v.progress, source: v.source } : null;
  }, KEY);
  assert.ok(canonical?.source === 'reader-state-v1');
  assert.equal(canonical.scrollY, left.scrollY);
  row.other = { path: OTHER, readingStillMarked: true, sameAnchorAndRatio: true, canonicalAfterPagehide: canonical };
  const resume = p.locator(`[data-research-action="resume"][data-value="${KEY}"]`);
  assert.equal(await resume.innerText(), 'Продолжить');
  await Promise.all([p.waitForURL(u => u.pathname.replace(/\/+$/u, '') === KEY, { waitUntil: 'load' }), resume.click()]);
  await p.waitForFunction(({ session }) => scrollY > 500 && sessionStorage.getItem(session) === null, { session: SESSION });
  const returned = await measure(p, record.anchor);
  assert.notEqual(returned.document, docStart);
  assert.equal(returned.nav, 'navigate');
  assert.equal(returned.route.replace(/\/+$/u, ''), KEY);
  assert.ok(returned.savedHeading?.hit && returned.unlocked, 'resume must show the stored heading, not just use the correct URL');
  assert.ok(!(await p.locator('#gb-hl-backdrop.is-open, #gillLearningOverlay.is-open').count()));
  if (row.id === 'learning-390') await p.screenshot({ path: path.join(out, 'gill-resumed-previous-heading.png') });
  const { document: __, ...rest } = returned;
  row.resumed = { separateDocument: true, ...rest };
  row.pageCount = context.pages().length;
  assert.equal(row.pageCount, 1);
  const expected = [ROUTE, OTHER, returned.route];
  assert.deepEqual(row.documentRequests, expected);
  assert.deepEqual(row.documentResponses, expected.map(path => ({ path, status: 200 })));
}

const { base, server } = await serve();
let browser;
const assets = new Set(), results = [];
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  for (const job of jobs) {
    const row = { ...job, documentRequests: [], documentResponses: [], errors: [] };
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
        if (type === 'document') row.documentResponses.push({ path: u.pathname + u.search, status });
        if (status >= 400) row.errors.push(['http', u.pathname, status]);
        if (r.ok() && ['document', 'script', 'stylesheet'].includes(type)) {
          let rel = u.pathname.slice(1);
          if (type === 'document' && !rel.endsWith('.html')) rel = rel.replace(/\/*$/u, '') + '/index.html';
          assets.add(rel);
        }
      });
      await exercise(await context.newPage(), context, base, row);
      assert.deepEqual(row.errors, []);
      row.ok = true;
      const save = row.wheel || row.click;
      console.log('OK', row.id, `source top=${row.click.source.top} -> saved top=${save.source.top} anchor=${save.library.anchor}`,
        `resume y=${row.resumed.scrollY} source top=${row.resumed.source.top} hit=${row.resumed.source.hit}`,
        `ReaderState=${save.readerState.saved?.sectionId}@${save.readerState.saved?.scrollY}`);
    } catch (e) { row.ok = false; row.error = e.stack?.replaceAll(base, 'LOCAL') ?? String(e); console.error('FAIL', row.id, row.error); }
    finally { await context.close(); }
  }
  const witness = { anchor, chromium: browser.version(), playwright: req('playwright/package.json').version, node: process.versions.node,
    method: { reducedMotion: 'reduce', colorScheme: 'light', warm: 'same origin, fresh documents on departure and resume',
      storage: 'observed durable writes by Product only; no seeding', cutover: 'real wheel on one arm' },
    distSha256: Object.fromEntries([...assets].sort().map(f => [f, hash(fs.readFileSync(path.join(product, 'dist', f)))])),
    results,
  };
  fs.writeFileSync(path.join(out, 'source-resume-witness.json'), JSON.stringify(witness, null, 2) + '\n');
  console.log(`${results.filter(r => r.ok).length}/${results.length} measured, ${assets.size} dist pins`);
  if (results.some(r => !r.ok)) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
