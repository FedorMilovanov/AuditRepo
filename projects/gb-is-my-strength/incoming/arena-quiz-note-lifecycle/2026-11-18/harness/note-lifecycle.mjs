// Two real tabs, one origin/profile, and real Library exports against exact production-like dist.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , productArg, outArg, executablePath, filter] = process.argv;
if (!productArg || !outArg || !executablePath) throw new Error('Usage: node note-lifecycle.mjs PRODUCT OUT CHROMIUM [filter]');
const product = path.resolve(productArg), out = path.resolve(outArg), dist = path.join(product, 'dist');
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const { server, base } = await serve();
const A = '/articles/otstuplenie-chto-govorit-bibliya/';
const G = '/articles/dzhon-gill-chast-2-uchenyi/';
const C = '/hard-texts/genesis-6/';
const heading = '#gillLearningOverlay', library = '#gb-hl-backdrop', panel = '#gb-hl-panel';
const editor = '#gb-hl-editor', field = '#gb-hl-note-text', status = '#gb-hl-status';
const native = '#quizPlaceholder .quiz-wrapper';
const firstText = 'Первое наблюдение: сверить ответ с разделом источника.';
const draftText = 'Моя правка: перечитать абзац и уточнить вывод.';
const peerText = 'Уточнение из другой вкладки: сравнить два объяснения.';
const noteText = 'Цитата нужна для проверки ответа.\nНе смешивать наблюдение и вывод.';
const excerpt = 'Кумранские фрагменты';
const s = (p, selector) => p.locator(selector);
const click = (p, selector) => s(p, selector).click();
const plain = x => String(x ?? '').replace(/\s+/gu, ' ').trim();
const inner = async (p, selector) => plain(await s(p, selector).innerText());
const clock = p => p.evaluate(() => performance.timeOrigin);
const sha = data => createHash('sha256').update(data).digest('hex');
const screen = (p, file) => s(p, panel).screenshot({ path: path.join(out, file), animations: 'disabled' });
const goto = (p, route) => p.goto(base + route, { waitUntil: 'load' });
const wait = p => p.waitForTimeout(475);
const data = p => p.evaluate(() => {
  const raw = key => JSON.parse(localStorage.getItem(key) || '[]');
  const record = x => ({ id: x.id, text: x.text, quoteText: x.quoteText || '', title: x.articleTitle,
    url: x.url ? new URL(x.url, location.href).href.slice(location.origin.length) : '', savedAt: x.savedAt });
  return { notes: raw('gb-reader-notes-v1').map(record), quotes: raw('gb-highlights-v1').map(record) };
});
const empty = { notes: [], quotes: [] };
const cards = '#gb-hl-list .gb-hl-item';
const card = (p, type, id) => s(p, `${cards}[data-type="${type}"][data-id="${id}"]`);
const editorOpen = p => s(p, editor).isVisible();
const action = (p, name) => s(p, `[data-research-action="${name}"]`);

async function openLearning(p, tab) {
  const opener = await s(p, '#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn';
  await click(p, opener);
  await click(p, '#mobLearningBtn');
  await s(p, `${heading}.is-open`).waitFor();
  await click(p, tab);
}
async function libraryReady(p) {
  await s(p, `${library}.is-open`).waitFor();
  await s(p, `#gb-hl-list .gb-hl-empty-title, ${cards}`).first().waitFor({ state: 'attached' });
}
async function manage(p) {
  await openLearning(p, '#tabNotes');
  await click(p, '#manageNotesBtn');
  await libraryReady(p);
}
async function fab(p) { await click(p, '#gb-hl-fab'); await libraryReady(p); }
async function close(p) { await click(p, '#gb-hl-close'); await s(p, `${library}.is-open`).waitFor({ state: 'hidden' }); }
async function save(p) { await s(p, `${editor} button[type=submit]`).click(); }
async function statusText(p) { await s(p, `${status}.is-visible`).waitFor(); return inner(p, status); }
async function awaitNote(p, text) {
  return p.waitForFunction(t => window.GBHighlights.getNotes().some(x => x.text === t), text);
}
async function createNote(p, text) {
  await click(p, '#gb-hl-new-note');
  await s(p, field).fill(text);
  await save(p);
  assert.equal(await statusText(p), 'Заметка сохранена.');
  const row = (await data(p)).notes.find(x => x.text === text);
  assert.ok(row);
  await card(p, 'note', row.id).waitFor();
  return row;
}
async function startEdit(p, row, next) {
  await card(p, 'note', row.id).locator('[data-library-action=edit-note]').click();
  assert.ok(await editorOpen(p));
  assert.equal(await s(p, field).inputValue(), row.text);
  await s(p, field).fill(next);
}
const verifyItems = async (p, expected) => assert.deepEqual(await data(p), expected);
const deleteItem = (p, type, row) => card(p, type, row.id).locator('[data-library-action=delete]').click();

async function quizState(p, route) {
  if (route === G) return s(p, native).evaluate(box => {
    const text = s => box.querySelector(s)?.textContent.trim();
    const a = box.querySelector('.quiz-feedback > a');
    return { question: text('#quizQuestion'), verdict: text('.quiz-feedback strong'), progress: text('.quiz-progress'),
      explanations: [...box.querySelectorAll('.quiz-explanation')].map(x => x.textContent.trim()),
      options: [...box.querySelectorAll('.quiz-option')].map(b => [b.textContent.trim(), b.className, b.disabled]),
      source: a ? [a.getAttribute('href'), a.textContent.trim()] : null };
  });
  return p.evaluate(() => {
    const id = s => document.getElementById(s), text = s => id(s).textContent.trim();
    const q = text('glsQuizQuestion');
    const pool = JSON.parse(id('gillQuizData').dataset.quiz);
    const x = pool.find(i => i.question === q);
    const a = id('glsQuizSource');
    return { question: q, id: x.id, count: pool.length, key: x.answers[x.correctIndex],
      options: [...id('glsQuizOptions').querySelectorAll('button')].map(b => [b.textContent.trim(), b.className, b.disabled]),
      confidence: id('glsQuizConfRow').querySelector('.is-picked')?.dataset.conf ?? null,
      verdict: text('glsQuizVerdict'), explanation: text('glsQuizExplanation'), progress: text('glsQuizStreak'),
      calibration: text('glsQuizCalibPct'), live: text('glsQuizLive'), source: a.hidden ? null : [a.getAttribute('href'), a.textContent.trim()] };
  });
}
async function beginFromQuiz(p, route) {
  await goto(p, route);
  await verifyItems(p, empty);
  const doc = await clock(p);
  let state;
  if (route === G) {
    await click(p, '#quizLaunch');
    await s(p, `${native} .quiz-option`).first().click();
    state = await quizState(p, route);
    assert.equal(state.verdict, 'Неверно');
  } else {
    await openLearning(p, '#tabQuiz');
    for (let i = 0, q = await quizState(p, route); i < q.count; i++, q = await quizState(p, route)) {
      const isTarget = q.id === 'apostasy.p1.lexeme';
      await click(p, '#glsQuizConfRow [data-conf=sure]');
      const pick = q.options.findIndex(([value]) => isTarget ? value !== q.key : value === q.key);
      assert.ok(pick >= 0);
      await s(p, '#glsQuizOptions button').nth(pick).click();
      if (isTarget) { state = await quizState(p, route); break; }
      await click(p, '#glsQuizNext');
    }
    assert.match(state.verdict, /^Неверно — а уверенность была высокой/u);
  }
  const hash = route === G ? '#sec-canticles' : '#odno-slovo';
  assert.equal(new URL(state.source[0], p.url()).hash, hash);
  await click(p, route === G ? `${native} .quiz-feedback > a` : '#glsQuizSource');
  await p.waitForURL(u => u.hash === hash);
  await wait(p);
  const hit = await s(p, hash).evaluate(el => {
    const b = el.getBoundingClientRect();
    const x = (Math.max(b.left, 0) + Math.min(b.right, innerWidth)) / 2;
    const y = (Math.max(b.top, 0) + Math.min(b.bottom, innerHeight)) / 2;
    return b.bottom > 0 && b.top < innerHeight && el.contains(document.elementFromPoint(x, y));
  });
  assert.ok(hit);
  assert.equal(await clock(p), doc);
  await manage(p);
  return { doc, hash, state, hit };
}
async function returnToQuiz(p, route, before) {
  await close(p);
  if (route === A) await openLearning(p, '#tabQuiz');
  else await s(p, `${native} .quiz-feedback`).scrollIntoViewIfNeeded();
  assert.deepEqual(await quizState(p, route), before.state);
  assert.equal(await clock(p), before.doc);
  return true;
}

async function download(p, target, suggested) {
  const [file] = await Promise.all([p.waitForEvent('download'), target.click()]);
  assert.equal(file.suggestedFilename(), suggested);
  assert.equal(await file.failure(), null);
  return { name: suggested, body: fs.readFileSync(await file.path()) };
}
async function markdown(p, expected) {
  const { name, body } = await download(p, s(p, '#gb-hl-export'), 'gb-moya-biblioteka.md');
  const raw = new TextDecoder('utf-8', { fatal: true }).decode(body);
  const sections = raw.split('\n## ').slice(1);
  assert.ok(raw.startsWith('# Моя библиотека · Господь Бог — Сила Моя\n'));
  assert.equal(sections.length, expected.notes.length + expected.quotes.length);
  for (const [type, rows] of [['Заметка', expected.notes], ['Цитата', expected.quotes]]) {
    for (const item of rows) {
      const label = `${type} — ${item.title}`;
      const itemBody = type === 'Цитата' ? '> ' + item.text.replaceAll('\n', '\n> ') : item.text;
      const full = label + '\n\n' + itemBody + (item.quoteText ? '\n\nК цитате: ' + item.quoteText : '') + '\n\nИсточник: ' + base + item.url + '\n';
      assert.ok(sections.some(x => x.trim() === full.trim()), full.replaceAll(base, 'LOCAL'));
    }
  }
  const normalized = raw.replaceAll(base, 'http://local.invalid');
  return { name, bytes: body.length, rawSha256: sha(body), normalizedSha256: sha(normalized), text: normalized };
}
async function toggleBackup(p, shouldShow) {
  const button = s(p, '#gb-hl-manage');
  await button.waitFor();
  if ((await button.getAttribute('aria-expanded') === 'true') !== shouldShow) await button.click();
}
async function backup(p) {
  await toggleBackup(p, true);
  const file = await download(p, action(p, 'export-json'), 'gb-library-backup.json');
  const value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(file.body));
  assert.equal(value.version, 3);
  assert.equal(await statusText(p), 'Полная резервная копия сохранена.');
  await toggleBackup(p, false);
  return { file, value, sha256: sha(file.body) };
}
async function importBackup(p, file) {
  await toggleBackup(p, true);
  const [chooser] = await Promise.all([p.waitForEvent('filechooser'), action(p, 'import-json').click()]);
  await chooser.setFiles({ name: file.name, mimeType: 'application/json', buffer: file.body });
  await s(p, '#gb-hl-import-confirm').waitFor();
  const prompt = await inner(p, '#gb-hl-import-confirm p');
  await action(p, 'confirm-import').click();
  const message = await statusText(p);
  assert.equal(message, 'Импорт завершён без замены существующих записей.');
  await toggleBackup(p, false);
  return { prompt, message };
}

async function saveQuote(p) {
  // Range only reads coordinates; actual text selection from pointer input.
  const para = s(p, 'article.genesis6-card--planned p').filter({ hasText: excerpt });
  await para.scrollIntoViewIfNeeded();
  await p.waitForTimeout(365);
  const coords = await para.evaluate((el, quote) => {
    const r = document.createRange();
    const off = el.firstChild.data.indexOf(quote);
    r.setStart(el.firstChild, off); r.setEnd(el.firstChild, off + quote.length);
    const rects = [...r.getClientRects()];
    const a = rects[0], b = rects.at(-1);
    return [a.left + .45, a.top + a.height / 2, b.right - .45, b.top + b.height / 2];
  }, excerpt);
  await p.mouse.move(coords[0], coords[1]); await p.mouse.down();
  await p.mouse.move(coords[2], coords[3], { steps: 14 }); await p.mouse.up();
  await wait(p);
  assert.equal(await p.evaluate(() => String(getSelection())), excerpt);
  await click(p, '#ss-save');
  const quote = (await data(p)).quotes[0];
  assert.equal(quote.text, excerpt);
  assert.match(quote.url, /:~:text=/u);
  return quote;
}

const scenarios = [];
const add = (name, viewport, fn) => scenarios.push({ name, viewport, fn });
const small = { width: 390, height: 844 }, wide = { width: 1359, height: 900 };
for (const [route, viewport] of [[A, small], [G, wide]]) {
  add('delete-while-editing', viewport, async ({ a, b, r }) => {
    const before = await beginFromQuiz(a, route); r.quizBefore = before.state; r.source = before.hash;
    const baseNote = await createNote(a, firstText); r.initial = baseNote;
    await startEdit(a, baseNote, draftText);
    await goto(b, route === A ? G : A); await fab(b);
    const bClock = await clock(b);
    await card(b, 'note', baseNote.id).waitFor();
    await verifyItems(b, { notes: [baseNote], quotes: [] });
    await deleteItem(b, 'note', baseNote);
    r.peerDeleteMessage = await statusText(b);
    assert.match(r.peerDeleteMessage, /Запись удалена/u);
    // The storage update and hidden list rebuild are already visible in A.
    await s(a, cards).waitFor({ state: 'detached' });
    await verifyItems(a, empty);
    await verifyItems(b, empty);
    r.staleEditor = { open: await editorOpen(a), draft: await s(a, field).inputValue(), submit: await s(a, `${editor} button[type=submit]`).isEnabled() };
    assert.deepEqual(r.staleEditor, { open: true, draft: draftText, submit: true });
    await save(a);
    r.claimedUpdate = { message: await statusText(a), editorOpen: await editorOpen(a), storeA: await data(a), storeB: await data(b) };
    assert.deepEqual(r.claimedUpdate, { message: 'Заметка обновлена.', editorOpen: false, storeA: empty, storeB: empty });
    if (route === A) {
      await screen(a, 'updated-note-is-absent.png');
      await click(b, `${status} [data-library-action=undo]`);
      r.undoMessage = await statusText(b);
      assert.equal(r.undoMessage, 'Запись восстановлена.');
      await card(a, 'note', baseNote.id).waitFor();
      await verifyItems(a, { notes: [baseNote], quotes: [] });
      await verifyItems(b, { notes: [baseNote], quotes: [] });
      r.afterUndo = await data(a);
      r.exportAfterUndo = await markdown(a, r.afterUndo);
      assert.ok(!r.exportAfterUndo.text.includes(draftText));
      assert.equal(await clock(b), bClock);
    } else {
      await b.reload({ waitUntil: 'load' });
      assert.notEqual(await clock(b), bClock);
      await fab(b);
      await verifyItems(b, empty);
      const downloads = [];
      const listener = d => downloads.push(d.suggestedFilename());
      b.on('download', listener);
      await click(b, '#gb-hl-export');
      const message = await statusText(b);
      await wait(b);
      b.off('download', listener);
      r.emptyExportAfterReload = { message, downloads };
      assert.deepEqual(r.emptyExportAfterReload, { message: 'Библиотека пуста.', downloads: [] });
    }
    r.quizUnchanged = await returnToQuiz(a, route, before);
  });
}

add('same-note-concurrent-edits', wide, async ({ a, b, r, newIsolatedPage }) => {
  const before = await beginFromQuiz(a, A); r.quizBefore = before.state; r.source = before.hash;
  const start = await createNote(a, firstText); r.initial = start;
  await startEdit(a, start, draftText);
  await goto(b, G); await fab(b); const bClock = await clock(b);
  await startEdit(b, start, peerText);
  await save(b);
  assert.equal(await statusText(b), 'Заметка обновлена.');
  await awaitNote(a, peerText);
  const other = { ...start, text: peerText };
  await verifyItems(a, { notes: [other], quotes: [] });
  r.peerExport = await markdown(b, { notes: [other], quotes: [] });
  const earlier = await backup(b);
  assert.equal(earlier.value.data.notes.length, 1);
  assert.equal(earlier.value.data.notes[0].id, start.id);
  assert.equal(earlier.value.data.notes[0].text, peerText);
  r.backupBeforeOverwrite = { sha256: earlier.sha256, version: earlier.value.version, text: peerText };
  await card(a, 'note', start.id).getByText(peerText, { exact: true }).waitFor({ state: 'attached' });
  r.editorAfterRemoteEdit = { open: await editorOpen(a), text: await s(a, field).inputValue(),
    status: await s(a, status).evaluate(e => ({ text: e.textContent.trim(), notice: e.classList.contains('is-visible'), error: e.classList.contains('is-error') })),
    store: await data(a) };
  assert.equal(r.editorAfterRemoteEdit.open, true);
  assert.equal(r.editorAfterRemoteEdit.text, draftText);
  assert.equal(r.editorAfterRemoteEdit.status.error, false);
  await save(a);
  r.finalMessage = await statusText(a);
  assert.equal(r.finalMessage, 'Заметка обновлена.');
  assert.equal(await editorOpen(a), false);
  await card(b, 'note', start.id).getByText(draftText, { exact: true }).waitFor();
  const final = { notes: [{ ...start, text: draftText }], quotes: [] };
  await verifyItems(a, final); await verifyItems(b, final);
  r.final = await data(b);
  r.afterOverwrite = await markdown(b, final);
  assert.ok(!r.afterOverwrite.text.includes(peerText));
  r.importOnExistingId = { ...await importBackup(b, earlier.file), after: await data(b), sameDocument: (await clock(b)) === bClock };
  assert.equal(r.importOnExistingId.sameDocument, true);
  assert.deepEqual(r.importOnExistingId.after, final);
  const fresh = await newIsolatedPage(); await goto(fresh, G); await fab(fresh); await verifyItems(fresh, empty);
  r.importOnEmpty = { ...await importBackup(fresh, earlier.file), after: await data(fresh) };
  assert.deepEqual(r.importOnEmpty.after, { notes: [other], quotes: [] });
  await card(fresh, 'note', start.id).getByText(peerText, { exact: true }).waitFor();
  r.quizUnchanged = await returnToQuiz(a, A, before);
});

add('distinct-notes-and-quote-context', wide, async ({ a, b, r }) => {
  const before = await beginFromQuiz(a, A); r.quizBefore = before.state; r.source = before.hash;
  const start = await createNote(a, firstText);
  await startEdit(a, start, draftText);
  await goto(b, C);
  const quote = await saveQuote(b); r.quote = quote;
  await fab(b);
  await card(b, 'quote', quote.id).locator('[data-library-action=note-for-quote]').click();
  r.linkedEditorContext = await inner(b, '#gb-hl-note-context');
  assert.equal(r.linkedEditorContext, 'К цитате: «' + excerpt + '»');
  await s(b, field).fill(noteText);
  await save(b);
  assert.equal(await statusText(b), 'Заметка сохранена.');
  await awaitNote(a, noteText);
  r.noteBeforeUpdate = (await data(b)).notes.find(x => x.text === noteText);
  assert.equal(r.noteBeforeUpdate.url, quote.url);
  assert.equal(r.noteBeforeUpdate.quoteText, excerpt);
  assert.equal(await s(a, field).inputValue(), draftText);
  await save(a);
  assert.equal(await statusText(a), 'Заметка обновлена.');
  await awaitNote(b, draftText);
  const after = await data(b);
  assert.equal(after.notes.length, 2);
  assert.deepEqual(after.notes.find(x => x.id === start.id), { ...start, text: draftText });
  assert.deepEqual(after.notes.find(x => x.id !== start.id), r.noteBeforeUpdate);
  assert.deepEqual(after.quotes, [quote]);
  await click(a, '[data-library-tab=note]');
  await s(a, '#gb-hl-search').fill('уточнить');
  r.visibleWhileFiltered = await s(a, cards).evaluateAll(rows => rows.map(e => ({ id: e.dataset.id, type: e.dataset.type })));
  assert.deepEqual(r.visibleWhileFiltered, [{ id: start.id, type: 'note' }]);
  r.exportWhileFiltered = await markdown(a, after);
  await click(b, '[data-library-tab=all]');
  await deleteItem(b, 'quote', quote);
  await a.waitForFunction(() => window.GBHighlights.getAll().length === 0);
  await s(a, '#gb-hl-search').fill('');
  await card(a, 'note', r.noteBeforeUpdate.id).getByText('К цитате: «' + excerpt + '»', { exact: true }).waitFor();
  r.afterDeletingQuote = await data(a);
  assert.deepEqual(r.afterDeletingQuote, { notes: after.notes, quotes: [] });
  r.exportAfterDeletingQuote = await markdown(a, r.afterDeletingQuote);
  assert.ok(r.exportAfterDeletingQuote.text.includes('К цитате: ' + excerpt));
  assert.ok(!r.exportAfterDeletingQuote.text.includes('## Цитата —'));
  r.quizUnchanged = await returnToQuiz(a, A, before);
});

const files = new Set();
const pins = /^\/(?:js\/(?:highlights|reader-library-[^/]+|site|floating-cluster-controller)\.js|css\/(?:highlights-runtime|floating-cluster)\.css|_astro\/(?:ReaderActionsRuntime|GillLearningSheet))/u;
const png = 'updated-note-is-absent.png';
fs.mkdirSync(out, { recursive: true });
fs.rmSync(path.join(out, png), { force: true });
const jobs = scenarios.filter(j => !filter || `${j.name} ${j.viewport.width}`.includes(filter));
assert.ok(jobs.length);
const result = { anchor: '9edef94ece08012223c1364bec7ddcd561cf5713', node: process.versions.node,
  playwright: req('playwright/package.json').version, scope: 'real UI, same browser context and origin except explicit fresh import control', scenarios: [] };
const args = ['--no-sandbox', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'];
let browser;
try {
  browser = await chromium.launch({ executablePath, args });
  result.chromium = browser.version();
  for (const { name, viewport, fn } of jobs) {
    const options = { viewport, colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block', acceptDownloads: true };
    const ctx = await browser.newContext(options), contexts = [ctx];
    const r = { name, viewport, pageErrors: [], localHttp: [] };
    async function page(context, tab) {
      const p = await context.newPage();
      p.setDefaultTimeout(6900);
      p.on('pageerror', e => r.pageErrors.push({ tab, error: e.message.replaceAll(base, 'LOCAL') }));
      p.on('response', res => {
        if (!res.url().startsWith(base + '/')) return;
        const u = new URL(res.url()).pathname;
        if (res.status() >= 400) r.localHttp.push({ tab, path: u, status: res.status() });
        if (res.ok() && res.request().isNavigationRequest()) files.add(u.slice(1) + 'index.html');
        if (res.ok() && pins.test(u)) files.add(u.slice(1));
      });
      return p;
    }
    async function newIsolatedPage() {
      const isolated = await browser.newContext(options); contexts.push(isolated);
      return page(isolated, 'fresh-import-control');
    }
    try {
      await fn({ a: await page(ctx, 'A'), b: await page(ctx, 'B'), r, newIsolatedPage });
      assert.deepEqual(r.pageErrors, []); assert.deepEqual(r.localHttp, []);
      r.ok = true; console.log('PASS', name, viewport.width);
    } catch (e) {
      r.ok = false; r.error = String(e.stack ?? e).replaceAll(base, 'LOCAL'); console.error('FAIL', name, viewport.width, r.error);
    } finally {
      result.scenarios.push(r);
      for (const context of contexts) await context.close();
    }
  }
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
result.distSha256 = Object.fromEntries([...files].sort().map(f => [f, sha(fs.readFileSync(path.join(dist, f)))]));
if (fs.existsSync(path.join(out, png))) result.screenshot = { file: png, sha256: sha(fs.readFileSync(path.join(out, png))) };
result.passed = result.scenarios.filter(r => r.ok).length;
result.total = result.scenarios.length;
fs.writeFileSync(path.join(out, 'note-lifecycle-witness.json'), JSON.stringify(result, null, 2) + '\n');
console.log(`${result.passed}/${result.total} expected outcomes; ${files.size} dist pins`);
if (result.passed !== result.total) process.exitCode = 1;
