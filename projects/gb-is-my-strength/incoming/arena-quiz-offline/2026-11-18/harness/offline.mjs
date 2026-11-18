// Quiz-to-source and Pagefind witness, with the actual worker and unmodified dist.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const [, , productArg, outputArg, executablePath, filter] = process.argv;
if (!productArg || !outputArg || !executablePath) throw new Error('Usage: node offline.mjs PRODUCT OUT CHROMIUM [scenario-filter]');
const dist = path.join(path.resolve(productArg), 'dist'), out = path.resolve(outputArg);
const req = createRequire(path.resolve(productArg, 'package.json'));
const { chromium } = req('playwright');
const anchor = '9edef94ece08012223c1364bec7ddcd561cf5713';
const A = '/articles/otstuplenie-chto-govorit-bibliya/';
const G2 = '/articles/dzhon-gill-chast-2-uchenyi/';
const G1 = '/articles/dzhon-gill-chast-1-chelovek/';
const lexeme = 'apostasy.p1.lexeme', pastor = 'gill.man.horsleydown.years';
const sheet = '#gillLearningOverlay', library = '#gb-hl-backdrop', toast = '#gb-sw-toast';
const globalBox = '#cp-listbox', globalEmpty = `${globalBox} .cp-empty-title`;
const globalQuery = 'Грэнтем', localQuery = 'Лексема — доказательство';
const sampleNote = 'Офлайн: перечитать раздел и сверить объяснение теста.';
const take = (file) => path.join(dist, file);
const sha = body => createHash('sha256').update(body).digest('hex');
const fallbackHash = sha(fs.readFileSync(take('404.html')));
const navHash = route => sha(fs.readFileSync(take(route.replace(/^\//u, '') + 'index.html')));
const urlPart = value => { const u = new URL(value); return u.pathname + u.search + u.hash; };
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const sel = (p, s) => p.locator(s);
const click = (p, s) => sel(p, s).click();
const text = async (p, s) => norm(await sel(p, s).innerText());
const ready = p => p.waitForFunction(() => navigator.serviceWorker.controller?.state === 'activated', undefined, { timeout: 14000 });
const settle = p => p.waitForTimeout(480);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.ico': 'image/x-icon' };
let phase = 'initial', reachable = true;
const traffic = [];
const server = createServer(async (req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');
  const entry = { phase, method: req.method, path: u.pathname + u.search, status: null };
  traffic.push(entry);
  // In addition to context offline mode, forbid the origin from serving any bytes
  // while offline, including fetches from the worker itself.
  if (!reachable) { entry.denied = true; req.socket.destroy(); return; }
  try {
    let f = path.resolve(dist, decodeURIComponent(u.pathname).replace(/^\/+/, ''));
    if (f !== dist && !f.startsWith(dist + path.sep)) throw new Error('not a dist file');
    if ((await stat(f)).isDirectory()) f = path.join(f, 'index.html');
    const body = await readFile(f);
    res.writeHead(entry.status = 200, { 'Content-Type': mime[path.extname(f)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(entry.status = 404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end('not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

async function setOnline(context, p, value, name) {
  reachable = value; phase = name;
  await context.setOffline(!value);
  await p.waitForFunction(v => navigator.onLine === v, value);
}
const clock = p => p.evaluate(() => performance.timeOrigin);
async function workerState(p) {
  return p.evaluate(async () => {
    const controller = navigator.serviceWorker.controller;
    const names = await caches.keys();
    const payloads = {};
    for (const name of names) {
      const type = name.slice(name.lastIndexOf('-') + 1);
      if (!['static', 'content', 'pagefind', 'data'].includes(type)) continue;
      const cache = await caches.open(name);
      payloads[type] = (await cache.keys()).map(r => {
        const u = new URL(r.url);
        return u.pathname + u.search;
      }).sort();
    }
    return { online: navigator.onLine, controller: controller ? new URL(controller.scriptURL).pathname : null,
      controllerState: controller?.state ?? null, names: names.sort(), payloads };
  });
}
async function waitCached(p, target) {
  await p.waitForFunction(x => caches.match(location.origin + x).then(Boolean), target);
}
async function load(p, route) {
  return p.goto(base + route, { waitUntil: 'load' });
}
async function toastText(p, pattern) {
  await p.waitForFunction(([s, prefix]) => {
    const t = document.querySelector(s);
    return t?.classList.contains('visible') && t.textContent.startsWith(prefix);
  }, [toast, pattern]);
  return text(p, `${toast} .toast-message`);
}
async function documentReceipt(p, res) {
  assert.ok(res, 'expected new-document response');
  return { url: urlPart(p.url()), status: res.status(), response: urlPart(res.url()), serviceWorker: res.fromServiceWorker(),
    sha256: sha(await res.body()), title: await p.title(), h1: await text(p, 'h1'),
    worker: await p.evaluate(() => ({ online: navigator.onLine, controller: new URL(navigator.serviceWorker.controller.scriptURL).pathname })),
    type: await p.evaluate(() => performance.getEntriesByType('navigation')[0]?.type) };
}
function verifyDocument(rep, digest, offline) {
  assert.equal(rep.status, 200);
  assert.ok(rep.serviceWorker);
  assert.deepEqual(rep.worker, { online: !offline, controller: '/sw.js' });
  assert.equal(rep.sha256, digest);
}
async function sourceTarget(p, id) {
  return p.locator(`#${id}`).evaluate(el => {
    const b = el.getBoundingClientRect();
    const x = (Math.max(0, b.left) + Math.min(innerWidth, b.right)) / 2;
    const y = (Math.max(0, b.top) + Math.min(innerHeight, b.bottom)) / 2;
    const hit = b.bottom > 0 && b.top < innerHeight && el.contains(document.elementFromPoint(x, y));
    return { id: el.id, text: el.innerText.replace(/\s+/gu, ' ').trim(), hit,
      top: Math.round(b.top), bottom: Math.round(b.bottom), scroll: Math.round(scrollY), viewport: innerHeight,
      visible: el.checkVisibility({ opacityProperty: true, visibilityProperty: true }), focused: el === document.activeElement,
      learningHidden: document.querySelector('#gillLearningOverlay').getAttribute('aria-hidden'),
      overflow: getComputedStyle(document.body).overflowY };
  });
}
async function openLearning(p, tab) {
  const trigger = await sel(p, '#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn';
  await click(p, trigger);
  await click(p, '#mobLearningBtn');
  await p.locator(`${sheet}.is-open`).waitFor();
  await click(p, tab);
}
async function quiz(p) {
  return p.evaluate(() => {
    const id = s => document.getElementById(s);
    const tx = s => id(s).textContent.trim();
    const shown = s => id(s).hidden ? null : tx(s);
    const pool = JSON.parse(id('gillQuizData').dataset.quiz), question = tx('glsQuizQuestion');
    const item = pool.find(x => x.question === question), source = id('glsQuizSource');
    return { id: item.id, total: pool.length, question, key: item.answers[item.correctIndex],
      confidence: id('glsQuizConfRow').querySelector('.is-picked')?.dataset.conf ?? null,
      choices: [...id('glsQuizOptions').querySelectorAll('button')].map(b => ({ text: b.textContent.trim(), className: b.className, disabled: b.disabled })),
      verdict: shown('glsQuizVerdict'), explanation: shown('glsQuizExplanation'), live: tx('glsQuizLive'), seen: tx('glsQuizStreak'),
      calibration: shown('glsQuizCalib') === null ? null : tx('glsQuizCalibPct'), source: source.hidden ? null : { href: source.getAttribute('href'), label: source.textContent.trim() } };
  });
}
async function miss(p, id) {
  await openLearning(p, '#tabQuiz');
  let s = await quiz(p);
  for (let i = 0; i < s.total; i++) {
    await click(p, '#glsQuizConfRow [data-conf=sure]');
    const selected = s.choices.findIndex(b => id && s.id !== id ? b.text === s.key : b.text !== s.key);
    assert.ok(selected >= 0);
    await sel(p, '#glsQuizOptions button').nth(selected).click();
    s = await quiz(p);
    if (!id || s.id === id) {
      assert.match(s.verdict, /^Неверно — а уверенность была высокой/u);
      assert.ok(s.explanation && s.source);
      return s;
    }
    await click(p, '#glsQuizNext');
    s = await quiz(p);
  }
  throw new Error('Did not reach ' + id);
}
async function freshQuiz(p) {
  await openLearning(p, '#tabQuiz');
  const state = await quiz(p);
  assert.deepEqual([state.confidence, state.verdict, state.explanation, state.live, state.seen, state.calibration, state.source], [null, null, null, '', '', null, null]);
  assert.ok(state.choices.every(b => b.disabled && b.className === 'quiz-option'));
  return state;
}
async function openLibrary(p, fromPanel = false) {
  if (fromPanel) await click(p, '#tabNotes');
  else await openLearning(p, '#tabNotes');
  await click(p, '#manageNotesBtn');
  await p.locator(`${library}.is-open`).waitFor();
  await p.locator('#gb-hl-list .gb-hl-empty-title, #gb-hl-list .gb-hl-item').first().waitFor();
}
const noteCard = p => p.locator('#gb-hl-list .gb-hl-item[data-type=note]');
async function noteSnapshot(p) {
  const card = noteCard(p);
  await card.getByText(sampleNote, { exact: true }).waitFor();
  return card.evaluate(el => ({ text: el.querySelector('.gb-hl-note').textContent, href: el.querySelector('.gb-hl-meta a').getAttribute('href') }));
}
async function runLocalSearch(p) {
  await openLearning(p, '#tabSearch');
  await sel(p, '#learningSearchInput').fill(localQuery);
  await p.waitForFunction(() => document.querySelector('#learningSearchStatus').textContent.startsWith('Найдено: '));
  const matches = p.locator('#learningSearchResults .gill-search-result');
  const shown = await matches.allInnerTexts();
  assert.ok(shown.length && shown.some(x => x.includes(localQuery)));
  await matches.first().click();
  // The prior quiz heading can still have transient highlight CSS.
  const target = p.locator('.is-search-target:not(#odno-slovo)');
  await target.waitFor();
  const id = await target.getAttribute('id');
  const landed = await sourceTarget(p, id);
  assert.ok(landed.hit && landed.visible);
  assert.equal(landed.learningHidden, 'true');
  return { query: localQuery, matches: shown.map(norm), landed };
}
async function openGlobal(p, fromPanel = false) {
  if (fromPanel) await click(p, '#tabSearch');
  else await openLearning(p, '#tabSearch');
  await click(p, '#globalSearchBtn');
  const field = p.getByRole('combobox', { name: 'Поиск', exact: true });
  await field.waitFor();
  assert.equal(await field.inputValue(), '');
  return field;
}
async function findGlobal(p, expectHit, fromPanel = false) {
  const field = await openGlobal(p, fromPanel);
  await field.fill(globalQuery);
  const found = p.locator(`${globalBox} [role=option]`).filter({ hasText: 'Томас Грэнтем' }).first();
  if (expectHit) await found.waitFor();
  else {
    await p.waitForFunction(() => window.__pagefindFailed__ === true, undefined, { timeout: 9000 });
    await p.locator(globalEmpty).waitFor();
    await p.waitForTimeout(580); // exceed debounce after retry; don't count the first empty render
  }
  const probe = await p.evaluate(() => ({ finderReady: Boolean(window.__pagefindReady__), finderFailed: Boolean(window.__pagefindFailed__), online: navigator.onLine }));
  const report = { ...probe, q: await field.inputValue(), hit: expectHit ? norm(await found.innerText()) : null,
    empty: await p.locator(globalEmpty).isVisible() ? await text(p, globalEmpty) : null,
    results: await p.locator(`${globalBox} [role=option]`).count() };
  assert.equal(report.finderReady, expectHit);
  assert.equal(report.finderFailed, !expectHit);
  if (expectHit) assert.match(report.hit, /Часть II: Учёный.*было бы неточно/u);
  else { assert.equal(report.empty, 'Ничего не найдено'); assert.equal(report.results, 0); }
  return report;
}
async function leaveGlobal(p) {
  await p.keyboard.press('Escape');
  await p.getByRole('combobox', { name: 'Поиск', exact: true }).waitFor({ state: 'hidden' });
}
const recordables = /^\/(?:pagefind\/|data\/search-manifest\.json|js\/(?:search|sw-register|highlights|reader-library-[a-z0-9-]+)\.js|sw\.js|404\.html)/u;
function attach(p, r, tag, files) {
  p.setDefaultTimeout(7500);
  p.on('pageerror', e => r.pageErrors.push({ phase, tag, error: e.message.replaceAll(base, 'LOCAL') }));
  p.on('requestfailed', q => {
    if (q.url().startsWith(base + '/') && recordables.test(urlPart(q.url())))
      r.events.push({ phase, tag, method: q.method(), path: urlPart(q.url()), error: q.failure()?.errorText });
  });
  p.on('response', res => {
    if (!res.url().startsWith(base + '/')) return;
    const q = res.request(), u = new URL(res.url());
    if (q.isNavigationRequest() || recordables.test(u.pathname) || res.status() >= 400)
      r.events.push({ phase, tag, method: q.method(), path: urlPart(res.url()), status: res.status(), serviceWorker: res.fromServiceWorker() });
    if (!res.ok()) return;
    const rel = u.pathname.replace(/^\//u, '') + (u.pathname.endsWith('/') ? 'index.html' : '');
    if ((q.isNavigationRequest() || recordables.test(u.pathname)) && fs.existsSync(take(rel)) && fs.statSync(take(rel)).isFile()) files.add(rel);
  });
}
function coldFallback(p) {
  return p.evaluate(() => ({ code: document.querySelector('.not-found-code').textContent.trim(),
    wording: document.querySelector('.not-found-text').textContent.trim(),
    hasQuiz: Boolean(document.getElementById('gillLearningOverlay')),
    hasRetry: Boolean([...document.querySelectorAll('.not-found-card button, .not-found-card a')].find(e => /повтор|попробовать снова|соедин/i.test(e.textContent))),
    notice: document.getElementById('gb-sw-toast')?.textContent.trim() ?? '', y: Math.round(scrollY) }));
}

const jobs = [];
const add = (name, viewport, run) => jobs.push({ name, viewport, run });
const small = { width: 390, height: 844 }, wide = { width: 1359, height: 900 };
for (const [warm, viewport] of [[false, small], [true, wide]]) {
  add(warm ? 'controlled-visit-offline-reload' : 'first-visit-offline-reload', viewport, async (p, ctx, r) => {
    const initial = await load(p, A);
    r.firstLoadControlled = initial.fromServiceWorker();
    assert.equal(r.firstLoadControlled, false);
    await ready(p);
    r.firstCache = await workerState(p);
    assert.equal(r.firstCache.controller, '/sw.js');
    assert.ok(r.firstCache.payloads.static.includes('/404.html'));
    assert.ok(!(r.firstCache.payloads.content ?? []).includes(A));
    if (warm) {
      const res = await p.reload({ waitUntil: 'load' });
      await waitCached(p, A);
      r.controlledVisit = await documentReceipt(p, res);
      verifyDocument(r.controlledVisit, navHash(A), false);
    }
    r.before = await miss(p, lexeme);
    r.priorCache = await workerState(p);
    assert.equal((r.priorCache.payloads.content ?? []).includes(A), warm);
    const doc = await clock(p);
    await setOnline(ctx, p, false, 'offline');
    r.toast = await toastText(p, 'Вы офлайн — эта страница');
    assert.equal(r.toast, warm ? 'Вы офлайн — эта страница доступна' : 'Вы офлайн — эта страница не сохранена');
    await click(p, '#glsQuizSource');
    await p.waitForURL(`${base}${A}#odno-slovo`);
    await settle(p);
    r.source = await sourceTarget(p, 'odno-slovo');
    assert.ok(r.source.hit && r.source.visible && r.source.focused);
    assert.equal(r.source.learningHidden, 'true');
    assert.notEqual(r.source.overflow, 'hidden');
    r.localSearch = await runLocalSearch(p);
    await openLibrary(p);
    await click(p, '#gb-hl-new-note');
    await sel(p, '#gb-hl-note-text').fill(sampleNote);
    await sel(p, '#gb-hl-editor button[type=submit]').click();
    r.offlineNote = await noteSnapshot(p);
    assert.deepEqual(r.offlineNote, { text: sampleNote, href: A });
    await click(p, '#gb-hl-close');
    await openLearning(p, '#tabQuiz');
    assert.deepEqual(await quiz(p), r.before);
    r.sameDocument = (await clock(p)) === doc;
    assert.ok(r.sameDocument);
    const reloaded = await p.reload({ waitUntil: 'load' });
    r.offlineReload = await documentReceipt(p, reloaded);
    verifyDocument(r.offlineReload, warm ? navHash(A) : fallbackHash, true);
    assert.ok((await clock(p)) !== doc);
    if (!warm) {
      r.offlineFallback = await coldFallback(p);
      r.offlineOpenUrl = urlPart(p.url());
      await setOnline(ctx, p, true, 'restored');
      const online = await p.reload({ waitUntil: 'load' });
      r.retry = await documentReceipt(p, online);
      verifyDocument(r.retry, navHash(A), false);
    }
    r.quizAfterReload = await freshQuiz(p);
    await openLibrary(p, true);
    r.noteAfterReload = await noteSnapshot(p);
    assert.deepEqual(r.noteAfterReload, r.offlineNote);
  });
}
for (const warm of [false, true]) {
  add(warm ? 'quiz-cross-source-visited' : 'quiz-cross-source-unvisited', small, async (p, ctx, r, createPage) => {
    await load(p, G2);
    await ready(p);
    if (warm) {
      const res = await load(p, G1);
      await waitCached(p, G1);
      r.previsit = await documentReceipt(p, res);
      verifyDocument(r.previsit, navHash(G1), false);
    }
    const active = await load(p, G2);
    await waitCached(p, G2);
    verifyDocument(await documentReceipt(p, active), navHash(G2), false);
    r.priorCache = await workerState(p);
    assert.equal(r.priorCache.payloads.content.includes(G1), warm);
    r.before = await miss(p, pastor);
    const href = new URL(r.before.source.href, p.url());
    assert.equal(urlPart(href.href), G1 + '#part-pastor');
    const doc = await clock(p);
    await setOnline(ctx, p, false, 'offline');
    const [res] = await Promise.all([
      p.waitForResponse(res => res.request().isNavigationRequest() && new URL(res.url()).pathname === G1),
      p.waitForURL(href.href, { waitUntil: 'load' }), click(p, '#glsQuizSource'),
    ]);
    await settle(p);
    r.landing = await documentReceipt(p, res);
    verifyDocument(r.landing, warm ? navHash(G1) : fallbackHash, true);
    assert.ok((await clock(p)) !== doc);
    if (warm) {
      r.boundTarget = await sourceTarget(p, 'part-pastor');
      assert.ok(r.boundTarget.hit && r.boundTarget.visible);
    } else {
      r.fallback = await coldFallback(p);
      assert.equal(r.fallback.code, '404');
      assert.match(r.fallback.wording, /ссылка устарела.*адрес введён с ошибкой/u);
      assert.equal(r.fallback.hasRetry, false);
      assert.equal(r.fallback.hasQuiz, false);
      await p.screenshot({ path: path.join(out, 'offline-source-404.png'), animations: 'disabled' });
      await setOnline(ctx, p, true, 'restored');
      r.noticeAfterRestore = await toastText(p, 'Соединение восстановлено');
      assert.ok(await sel(p, '.not-found-card').isVisible());
      const reload = await p.reload({ waitUntil: 'load' });
      r.onRetry = await documentReceipt(p, reload);
      verifyDocument(r.onRetry, navHash(G1), false);
      await settle(p);
      r.retryTargetBeforeIntervention = await sourceTarget(p, 'part-pastor');
      // Reload can keep a scroll position under an unchanged hash. Verify real
      // route recovery above, and use a new navigation for the anchor control.
      const control = await createPage('online-control');
      const direct = await load(control, G1 + '#part-pastor');
      r.onlineNewNavigation = await documentReceipt(control, direct);
      verifyDocument(r.onlineNewNavigation, navHash(G1), false);
      await settle(control);
      r.boundTarget = await sourceTarget(control, 'part-pastor');
      assert.ok(r.boundTarget.hit && r.boundTarget.visible);
    }
  });
}

add('global-search-reconnect-after-offline-open', wide, async (p, ctx, r, createPage) => {
  await load(p, G2);
  await ready(p);
  await load(p, G2); // controlled page and lazily fetched search bits are distinct
  r.onlineSearch = await findGlobal(p, true);
  await leaveGlobal(p);
  r.warm = await workerState(p);
  assert.ok(r.warm.payloads.static.includes('/pagefind/pagefind.js'));
  assert.ok(r.warm.payloads.pagefind.some(p => p.startsWith('/pagefind/index/')));
  assert.ok(r.warm.payloads.pagefind.some(p => p.startsWith('/pagefind/fragment/')));
  assert.ok(r.warm.payloads.static.some(p => p.startsWith('/js/search.js?v=')));
  assert.ok(r.warm.payloads.content.includes(G2));
  const warmClock = await clock(p);
  await setOnline(ctx, p, false, 'offline');
  r.sameDocOfflineSearch = await findGlobal(p, true);
  assert.equal(r.sameDocOfflineSearch.online, false);
  assert.equal(await clock(p), warmClock);
  const q = await createPage('fresh');
  r.offlineNewDocument = await documentReceipt(q, await load(q, G2));
  verifyDocument(r.offlineNewDocument, navHash(G2), true);
  const answered = await miss(q, null), doc = await clock(q);
  r.freshDocOfflineSearch = await findGlobal(q, false, true);
  assert.equal(r.freshDocOfflineSearch.online, false);
  await leaveGlobal(q);
  r.offlineCache = await workerState(q);
  assert.deepEqual(r.offlineCache.payloads.pagefind, r.warm.payloads.pagefind);
  r.cachedBootstrapSha256 = await q.evaluate(async () => {
    const res = await caches.match(location.origin + '/pagefind/pagefind.js');
    if (!res) return null;
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256', await res.arrayBuffer()))].map(x => x.toString(16).padStart(2, '0')).join('');
  });
  assert.equal(r.cachedBootstrapSha256, sha(fs.readFileSync(take('pagefind/pagefind.js'))));
  const deferredSearch = await createPage('deferred');
  verifyDocument(await documentReceipt(deferredSearch, await load(deferredSearch, G2)), navHash(G2), true);
  const deferredClock = await clock(deferredSearch);
  await setOnline(ctx, q, true, 'restored');
  r.reconnectedToast = await toastText(q, 'Соединение восстановлено');
  r.retrySearch = await findGlobal(q, false);
  assert.equal(r.retrySearch.online, true);
  assert.equal(await clock(q), doc);
  // Record the actual UI after network recovery, not an empty/loading frame.
  await q.locator('.cp-backdrop.is-open .cp-left').screenshot({ path: path.join(out, 'reconnected-search-empty.png'), animations: 'disabled' });
  const field = q.getByRole('combobox', { name: 'Поиск', exact: true });
  await field.fill('Джон Гилл');
  const titleHits = q.locator(`${globalBox} [role=option]`).filter({ hasText: 'Джон Гилл' });
  await titleHits.first().waitFor();
  r.metadataFallbackAtRestore = { q: await field.inputValue(), count: await titleHits.count(), firstHit: norm(await titleHits.first().innerText()) };
  assert.equal(await q.evaluate(() => window.__pagefindFailed__), true);
  await leaveGlobal(q);
  await openLearning(q, '#tabQuiz');
  assert.deepEqual(await quiz(q), answered);
  r.quizPreservedUntilReload = true;
  r.delayedFirstSearch = await findGlobal(deferredSearch, true);
  assert.equal(r.delayedFirstSearch.online, true);
  assert.equal(await clock(deferredSearch), deferredClock);
  phase = 'restored-reload';
  const res = await q.reload({ waitUntil: 'load' });
  verifyDocument(await documentReceipt(q, res), navHash(G2), false);
  assert.ok(await clock(q) !== doc);
  r.onlineAfterReload = await findGlobal(q, true);
  await leaveGlobal(q);
  r.freshQuiz = await freshQuiz(q);
  assert.ok(r.events.some(e => e.tag === 'fresh' && e.phase === 'offline' && e.method === 'HEAD' && e.path === '/pagefind/pagefind.js' && e.error));
  assert.ok(!r.events.some(e => e.tag === 'fresh' && e.phase === 'restored' && e.method === 'HEAD' && e.path === '/pagefind/pagefind.js'));
  assert.ok(r.events.some(e => e.tag === 'deferred' && e.phase === 'restored' && e.method === 'HEAD' && e.path === '/pagefind/pagefind.js' && e.status === 200));
  assert.ok(r.events.some(e => e.tag === 'fresh' && e.phase === 'restored-reload' && e.method === 'HEAD' && e.path === '/pagefind/pagefind.js' && e.status === 200));
});

const chosen = jobs.filter(j => !filter || j.name.includes(filter));
assert.ok(chosen.length);
fs.mkdirSync(out, { recursive: true });
const pngs = ['offline-source-404.png', 'reconnected-search-empty.png'];
for (const f of pngs) fs.rmSync(path.join(out, f), { force: true });
const result = { anchor, node: process.versions.node, playwright: req('playwright/package.json').version,
  workerGeneration: fs.readFileSync(take('sw.js'), 'utf8').match(/const CACHE_VERSION = '([^']+)'/u)[1],
  method: { noStoreServer: true, blockServerWhenOffline: true, realServiceWorker: true, noCacheSeeding: true, bfcache: 'Playwright default disabled' },
  scenarios: [] };
const files = new Set(['sw.js', '404.html', 'js/sw-register.js', 'pagefind/pagefind.js']);
let browser;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
  result.chromium = browser.version();
  for (const j of chosen) {
    phase = 'online'; reachable = true; const offset = traffic.length;
    const r = { name: j.name, viewport: j.viewport, events: [], pageErrors: [] };
    const ctx = await browser.newContext({ viewport: j.viewport, reducedMotion: 'reduce', serviceWorkers: 'allow' });
    const newPage = async (tag) => { const p = await ctx.newPage(); attach(p, r, tag, files); return p; };
    try {
      await j.run(await newPage('primary'), ctx, r, newPage);
      assert.deepEqual(r.pageErrors, []);
      assert.deepEqual(r.events.filter(e => e.phase !== 'offline' && e.status >= 400), []);
      r.ok = true;
      console.log('PASS', j.name);
    } catch (e) {
      r.ok = false; r.error = String(e.stack ?? e).replaceAll(base, 'LOCAL');
      console.error('FAIL', j.name, r.error);
    } finally {
      await ctx.close();
      const span = traffic.slice(offset);
      r.origin = { servedOffline: span.filter(e => e.phase === 'offline' && e.status).length,
        deniedOffline: span.filter(e => e.phase === 'offline' && e.denied).length,
        navigation: span.filter(e => e.path === A || e.path === G1 || e.path === G2),
        pagefindHead: span.filter(e => e.method === 'HEAD' && e.path === '/pagefind/pagefind.js') };
      if (r.origin.servedOffline) { r.ok = false; console.error('FAIL origin served bytes offline:', j.name); }
      result.scenarios.push(r);
    }
  }
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
result.distSha256 = Object.fromEntries([...files].sort().map(f => [f, sha(fs.readFileSync(take(f)))]));
result.screenshots = pngs.filter(f => fs.existsSync(path.join(out, f))).map(f => ({ file: f, sha256: sha(fs.readFileSync(path.join(out, f))) }));
result.passed = result.scenarios.filter(r => r.ok).length;
result.total = result.scenarios.length;
fs.writeFileSync(path.join(out, 'offline-witness.json'), JSON.stringify(result, null, 2) + '\n');
console.log(`${result.passed}/${result.total} scenario expectations; ${files.size} dist pins`);
if (result.passed !== result.total) process.exitCode = 1;
