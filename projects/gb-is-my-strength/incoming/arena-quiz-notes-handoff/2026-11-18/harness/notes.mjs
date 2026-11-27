// Browser witness for taking/retrieving a note after quiz feedback. Use untouched production-like dist.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , productArg, outputArg, executablePath, filter] = process.argv;
if (!productArg || !outputArg || !executablePath) throw new Error('Usage: node notes.mjs PRODUCT OUT CHROMIUM [scenario-filter]');
const product = path.resolve(productArg), out = path.resolve(outputArg), dist = path.join(product, 'dist');
const req = createRequire(path.join(product, 'package.json'));
const { chromium } = req('playwright');
const { parse } = req('parse5');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const A = '/articles/otstuplenie-chto-govorit-bibliya/';
const G = '/articles/dzhon-gill-chast-2-uchenyi/';
const C = '/hard-texts/genesis-6/';
const head = '9edef94ece08012223c1364bec7ddcd561cf5713';
const sheet = '#gillLearningOverlay', library = '#gb-hl-backdrop';
const noteCard = '#notesList .note-card', libraryCard = '#gb-hl-list .gb-hl-item';
const list = '#gb-hl-list', nativeQuiz = '#quizPlaceholder .quiz-wrapper';
const sampleNote = 'Тестовая заметка: сверить объяснение с абзацем источника.';
const legacyQuote = 'Кумранские фрагменты';
const citeP = 'article.genesis6-card--planned p';
const compact = { width: 390, height: 844 }, wide = { width: 1359, height: 900 };
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const localHref = s => { const u = new URL(s, 'https://example.invalid'); return u.pathname + u.search + u.hash; };
const noteLink = `${libraryCard}[data-type=note] .gb-hl-meta a`;
const emptyNotes = 'Сохранённых заметок пока нет.';
const follow = async (page, locator, predicate) => {
  await Promise.all([page.waitForURL(predicate, { waitUntil: 'load' }), locator.click()]);
};
const sha = f => createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const args = ['--no-sandbox', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'];
const stateClock = page => page.evaluate(() => performance.timeOrigin);
const settle = page => page.waitForTimeout(520); // product transitions + deferred selection menu
const click = (p, sel) => p.locator(sel).click();
const text = async (p, sel) => norm(await p.locator(sel).textContent());

function markupCensus(dir) {
  const files = [];
  function visit(root) {
    for (const d of fs.readdirSync(root, { withFileTypes: true })) {
      const next = path.join(root, d.name);
      if (d.isDirectory()) visit(next);
      if (d.isFile() && d.name.endsWith('.html')) files.push(next);
    }
  }
  visit(dir);
  const rows = [];
  for (const f of files.sort()) {
    const ids = new Set(), paths = [];
    const walk = node => {
      const attr = Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]));
      if (attr.id) ids.add(attr.id);
      if (node.tagName === 'script' && attr.src) paths.push(new URL(attr.src, 'https://example.invalid/' + path.relative(dir, f)).pathname);
      node.childNodes?.forEach(walk);
    };
    walk(parse(fs.readFileSync(f, 'utf8')));
    if (ids.has('gillLearningOverlay')) rows.push({ file: path.relative(dir, f), quiz: ids.has('tabQuiz'),
      libraryScript: paths.includes('/js/highlights.js'), legacyScript: paths.includes('/js/site.js'), inlineMenu: ids.has('selection-share-popup') });
  }
  return { html: files.length, rows };
}

async function openLearning(page, tab) {
  const sel = await page.locator('#railSettingsBtn').isVisible() ? '#railSettingsBtn' : '#mobSettingsBtn';
  await click(page, sel);
  await click(page, '#mobLearningBtn');
  await page.locator(`${sheet}.is-open`).waitFor();
  if (tab) await click(page, tab);
  return sel;
}
async function waitLibrary(page) {
  await page.locator(`${library}.is-open`).waitFor();
  await page.locator(`${list} .gb-hl-empty-title, ${libraryCard}`).first().waitFor({ state: 'attached' });
}
async function manage(page) { await click(page, '#manageNotesBtn'); await waitLibrary(page); }
async function closeLibrary(page) { await click(page, '#gb-hl-close'); await page.locator(`${library}.is-open`).waitFor({ state: 'hidden' }); }
async function seekTab(page, locator) {
  for (let n = 0; n < 40; n++) {
    if (await locator.evaluate(el => el === document.activeElement)) return n;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Tab did not reach ${locator}`);
}
async function view(page) {
  return page.evaluate(() => {
    const l = document.querySelector('#gillLearningOverlay'), h = document.querySelector('#gb-hl-backdrop');
    const a = document.activeElement;
    return { focus: { tag: a.tagName, id: a.id, text: a.matches('a,button') ? a.textContent.trim().slice(0, 80) : '' },
      learning: l?.getAttribute('aria-hidden') ?? null, library: h.getAttribute('aria-hidden'), inert: h.inert,
      selectedTab: l?.querySelector('[role=tab][aria-selected=true]')?.id ?? null, overflow: getComputedStyle(document.body).overflowY,
      y: Math.round(scrollY), hash: location.hash, navType: performance.getEntriesByType('navigation')[0]?.type ?? null };
  });
}
async function items(page) {
  return page.evaluate(() => {
    const relative = raw => { const x = new URL(raw, location.href); return x.pathname + x.search + x.hash; };
    const serial = x => ({ text: x.text, quoteText: x.quoteText || '', title: x.articleTitle || '', url: relative(x.url) });
    const q = window.GBHighlights.getAll(), n = window.GBHighlights.getNotes();
    return { quotes: q.map(serial), notes: n.map(serial), count: window.GBHighlights.getLibrary().length };
  });
}
async function locationOf(locator) {
  return locator.evaluate(e => {
    const b = e.getBoundingClientRect(), y = (Math.max(0, b.top) + Math.min(innerHeight, b.bottom)) / 2, x = (Math.max(0, b.left) + Math.min(innerWidth, b.right)) / 2;
    const inViewport = b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth;
    return { text: e.textContent.replace(/\s+/gu, ' ').trim().slice(0, 175), id: e.id, y: Math.round(scrollY),
      top: Math.round(b.top), bottom: Math.round(b.bottom), inViewport,
      hit: inViewport && e.checkVisibility({ opacityProperty: true, visibilityProperty: true })
        && e.contains(document.elementFromPoint(x, y)), focused: e === document.activeElement };
  });
}

async function dragPhrase(page, loc, phrase) {
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(360); // ensure any scroll-triggered reveal and popup-hide has completed
  const pos = await loc.evaluate((el, str) => {
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const i = n.data.indexOf(str);
      if (i < 0) continue;
      const range = document.createRange(); // read geometry; never write a browser Selection
      range.setStart(n, i); range.setEnd(n, i + str.length);
      const rs = [...range.getClientRects()];
      if (!rs.length) continue;
      const p = rs[0], q = rs.at(-1);
      const a = { x: p.left + .45, y: (p.top + p.bottom) / 2 };
      const b = { x: q.right - .45, y: (q.top + q.bottom) / 2 };
      if (!el.contains(document.elementFromPoint(a.x, a.y)) || !el.contains(document.elementFromPoint(b.x, b.y))) continue;
      return { a, b, rects: rs.length, nearest: n.parentElement.id || n.parentElement.closest('[id]')?.id || '', text: str };
    }
    return null;
  }, phrase);
  assert.ok(pos, `visible geometric text range not found for ${phrase}`);
  await page.mouse.move(pos.a.x, pos.a.y);
  await page.mouse.down();
  await page.mouse.move(pos.b.x, pos.b.y, { steps: 14 });
  await page.mouse.up();
  await settle(page);
  const evidence = await loc.evaluate(el => ({ selected: String(getSelection()).replace(/\s+/gu, ' ').trim(),
    selectedInside: el.contains(getSelection().anchorNode) && el.contains(getSelection().focusNode),
    legacyScript: [...document.scripts].some(s => /\/js\/site\.js(?:\?|$)/u.test(s.src)),
    libraryVersion: window.GBHighlights?.libraryVersion ?? null,
    popupCount: document.querySelectorAll('#selection-share-popup').length,
    popupOpen: Boolean(document.querySelector('#selection-share-popup.ss-visible')),
    savePresent: Boolean(document.getElementById('ss-save')), notePresent: Boolean(document.getElementById('ss-note')) }));
  assert.equal(evidence.selected, phrase);
  assert.ok(evidence.selectedInside);
  return { ...evidence, nearest: pos.nearest, rects: pos.rects };
}
function assertMenu(d, present) {
  assert.equal(d.libraryVersion, 2);
  assert.deepEqual([d.legacyScript, d.popupCount, d.popupOpen, d.savePresent, d.notePresent], [present, Number(present), present, present, present]);
}
const legacyParagraph = page => page.locator(citeP).filter({ hasText: legacyQuote });

async function learningState(page) {
  return page.evaluate(() => {
    const id = s => document.getElementById(s), tx = s => id(s).textContent.trim();
    const question = tx('glsQuizQuestion');
    const deck = JSON.parse(id('gillQuizData').dataset.quiz);
    const row = deck.find(i => i.question === question);
    const shown = s => id(s).hidden ? null : tx(s);
    const source = id('glsQuizSource');
    return { id: row.id, total: deck.length, question, correct: row.answers[row.correctIndex],
      choices: [...id('glsQuizOptions').querySelectorAll('button')].map(b => ({ text: b.textContent.trim(), className: b.className, disabled: b.disabled })),
      confidence: id('glsQuizConfRow').querySelector('.is-picked')?.dataset.conf ?? null,
      verdict: shown('glsQuizVerdict'), explanation: shown('glsQuizExplanation'), live: tx('glsQuizLive'),
      seen: tx('glsQuizStreak'), calibration: id('glsQuizCalib').hidden ? null : tx('glsQuizCalibPct'),
      source: source.hidden ? null : { href: source.getAttribute('href'), label: source.textContent.trim() } };
  });
}
async function missLearning(page, target) {
  await openLearning(page, '#tabQuiz');
  let s = await learningState(page);
  for (let i = 0; i < s.total; i++) {
    await click(page, '#glsQuizConfRow [data-conf=sure]');
    const idx = s.choices.findIndex(c => target && target !== s.id ? c.text === s.correct : c.text !== s.correct);
    assert.ok(idx >= 0);
    await page.locator('#glsQuizOptions button').nth(idx).click();
    s = await learningState(page);
    if (!target || s.id === target) {
      assert.match(s.verdict, /^Неверно — а уверенность была высокой/u);
      assert.ok(s.source && s.explanation && s.seen && s.calibration);
      return s;
    }
    await click(page, '#glsQuizNext');
    s = await learningState(page);
  }
  throw new Error(`${target} not reached within one deck pass`);
}
async function nativeState(page) {
  return page.locator(nativeQuiz).evaluate(el => {
    const txt = s => el.querySelector(s)?.textContent.trim();
    const a = el.querySelector('.quiz-feedback > a');
    return { progress: txt('.quiz-progress'), question: txt('#quizQuestion'), verdict: txt('.quiz-feedback strong'),
      explanation: [...el.querySelectorAll('.quiz-explanation')].map(e => e.textContent.trim()),
      choices: [...el.querySelectorAll('.quiz-option')].map(b => ({ text: b.textContent.trim(), className: b.className, disabled: b.disabled })),
      source: a ? { href: a.getAttribute('href'), label: a.textContent.trim() } : null };
  });
}

async function savedNoteUi(page, expected) {
  await page.locator(`${libraryCard}[data-type=note]`).getByText(sampleNote, { exact: true }).waitFor();
  assert.deepEqual(await items(page), expected);
}
async function inspectEmptyNotes(page) {
  assert.equal((await view(page)).selectedTab, 'tabNotes');
  const result = { cards: await page.locator(noteCard).count(), message: await text(page, '#notesList') };
  assert.deepEqual(result, { cards: 0, message: emptyNotes });
  return result;
}
async function freshQuiz(page, fromSheet) {
  if (fromSheet) {
    await openLearning(page, '#tabQuiz');
    const s = await learningState(page);
    assert.deepEqual([s.confidence, s.verdict, s.explanation, s.source, s.live, s.seen, s.calibration],
      [null, null, null, null, '', '', null]);
    assert.ok(s.choices.length >= 2 && s.choices.every(c => c.disabled && c.className === 'quiz-option'));
    assert.ok(await page.locator('#glsQuizConfRow [data-conf=sure]').isEnabled());
    return s;
  }
  assert.ok(await page.locator('#quizLaunch').isVisible());
  assert.ok(await page.locator(nativeQuiz).isHidden());
  await click(page, '#quizLaunch');
  const s = await nativeState(page);
  assert.deepEqual([s.progress, s.verdict, s.explanation, s.source], ['Вопрос 1 из 4', undefined, [], null]);
  assert.ok(s.choices.length === 4 && s.choices.every(c => !c.disabled && c.className === 'quiz-option'));
  return s;
}

const jobs = [];
const job = (scenario, route, viewport, fn) => jobs.push({ scenario, route, viewport, fn });
for (const [route, viewport] of [[A, wide], [G, compact]]) {
  job('source-to-free-note', route, viewport, async (p, r, base) => {
    await p.goto(base + route, { waitUntil: 'load' });
    const doc = await stateClock(p), fromSheet = route === A;
    r.entryPoint = fromSheet ? 'learning-quiz' : 'native-article-quiz';
    assert.deepEqual(await items(p), { notes: [], quotes: [], count: 0 });
    const readQuiz = fromSheet ? learningState : nativeState;
    if (!fromSheet) {
      await click(p, '#quizLaunch');
      await p.locator(`${nativeQuiz} .quiz-option`).first().click();
    }
    r.quiz = fromSheet ? await missLearning(p, 'apostasy.p1.lexeme') : await readQuiz(p);
    const target = fromSheet ? 'odno-slovo' : 'sec-canticles';
    if (!fromSheet) assert.equal(r.quiz.verdict, 'Неверно');
    assert.equal(new URL(r.quiz.source.href, p.url()).hash, '#' + target);
    await click(p, fromSheet ? '#glsQuizSource' : `${nativeQuiz} .quiz-feedback > a`);
    await p.waitForURL(u => u.hash === '#' + target);
    await settle(p);
    r.sourceLanding = await locationOf(p.locator('#' + target));
    assert.ok(r.sourceLanding.hit);
    if (fromSheet) assert.ok(r.sourceLanding.focused);
    assert.equal(await stateClock(p), doc);
    const phrase = fromSheet ? 'Лексема — доказательство' : 'Среди всех трудов Гилла';
    const pSel = fromSheet ? 'main article blockquote strong' : 'main article p';
    const passage = p.locator(pSel).filter({ hasText: phrase }).first();
    r.passageAtSource = await locationOf(passage);
    r.selection = await dragPhrase(p, passage, phrase);
    assertMenu(r.selection, false);
    await openLearning(p, '#tabNotes');
    r.notesBefore = await inspectEmptyNotes(p);
    await manage(p);
    await click(p, '#gb-hl-new-note');
    r.editorContext = await text(p, '#gb-hl-note-context');
    assert.equal(r.editorContext, 'Мысли во время чтения');
    await p.locator('#gb-hl-note-text').fill(sampleNote);
    await p.locator('#gb-hl-editor button[type=submit]').click();
    await p.locator(`${libraryCard}[data-type=note]`).getByText(sampleNote, { exact: true }).waitFor();
    r.saved = await items(p);
    assert.equal(r.saved.count, 1);
    assert.equal(r.saved.notes[0].url, route);
    assert.equal(r.saved.notes[0].quoteText, '');
    await closeLibrary(p);
    if (fromSheet) await openLearning(p, '#tabQuiz');
    else await p.locator(`${nativeQuiz} .quiz-feedback`).scrollIntoViewIfNeeded(); // return to visible article quiz
    assert.equal(await stateClock(p), doc);
    assert.deepEqual(await readQuiz(p), r.quiz);
    r.sameQuizAfterClosing = true;
    if (fromSheet) await click(p, '#tabNotes');
    else await openLearning(p, '#tabNotes');
    r.notesAfterExplicitActivation = await inspectEmptyNotes(p);
    await manage(p);
    await click(p, '[data-library-tab=note]');
    await savedNoteUi(p, r.saved);
    if (route === G) await p.locator('#gb-hl-panel').screenshot({ path: path.join(out, 'free-note-in-library.png'), animations: 'disabled' });
    const link = p.locator(noteLink);
    r.openNoteHref = localHref(await link.getAttribute('href'));
    assert.equal(r.openNoteHref, route);
    await follow(p, link, u => u.pathname === route && u.hash === '');
    await settle(p);
    r.openNoteLanding = { docChanged: (await stateClock(p)) !== doc, heading: await locationOf(p.locator('#' + target)),
      passage: await locationOf(passage), view: await view(p) };
    assert.ok(r.openNoteLanding.docChanged);
    assert.equal(r.openNoteLanding.view.y, 0);
    assert.equal(r.openNoteLanding.view.navType, 'navigate');
    assert.equal(r.openNoteLanding.heading.inViewport || r.openNoteLanding.passage.inViewport, false);
    assert.deepEqual(await items(p), r.saved);
    r.quizAfterNoteLink = await freshQuiz(p, fromSheet);

    // Reload the still-answered fixture independently of the note link: whatever the
    // first shuffled question is, answer it through the UI and reload that document.
    if (fromSheet) await click(p, '#glsQuizConfRow [data-conf=sure]');
    const options = p.locator(fromSheet ? '#glsQuizOptions button' : `${nativeQuiz} .quiz-option`);
    await options.first().click();
    r.quizBeforeReload = await readQuiz(p);
    assert.ok(r.quizBeforeReload.verdict);
    const beforeReload = await stateClock(p);
    await p.reload({ waitUntil: 'load' });
    r.reload = { docChanged: (await stateClock(p)) !== beforeReload, stored: await items(p), view: await view(p) };
    assert.ok(r.reload.docChanged);
    assert.equal(r.reload.view.navType, 'reload');
    assert.deepEqual(r.reload.stored, r.saved);
    r.reload.quiz = await freshQuiz(p, fromSheet);
    if (fromSheet) await click(p, '#tabNotes');
    else await openLearning(p, '#tabNotes');
    await inspectEmptyNotes(p);
    await manage(p);
    await savedNoteUi(p, r.saved);
  });
}

// Same stored text is read through two UI surfaces. Only the canonical library writes/deletes it.
for (const [route, viewport] of [[A, compact], [G, wide]]) {
  job('delete-quote-then-reopen-notes', route, viewport, async (p, r, base) => {
    await p.goto(base + C, { waitUntil: 'load' });
    r.selection = await dragPhrase(p, legacyParagraph(p), legacyQuote);
    assertMenu(r.selection, true);
    await click(p, '#ss-save');
    await p.waitForFunction(() => window.GBHighlights?.getAll().length === 1);
    const initial = await items(p);
    r.initial = initial;
    assert.equal(initial.count, 1);
    assert.equal(initial.quotes[0].text, legacyQuote);
    await p.goto(base + route, { waitUntil: 'load' });
    const doc = await stateClock(p);
    r.quiz = await missLearning(p);
    await click(p, '#tabNotes');
    assert.equal(await text(p, `${noteCard} blockquote`), legacyQuote);
    await manage(p);
    const del = `${libraryCard}[data-type=quote] [data-library-action=delete]`;
    await click(p, del);
    assert.equal((await items(p)).count, 0);
    await click(p, '#gb-hl-status [data-library-action=undo]');
    assert.deepEqual(await items(p), initial);
    r.undo = await text(p, '#gb-hl-status');
    await click(p, del);
    r.deleted = { status: await text(p, '#gb-hl-status'), store: await items(p), libraryCards: await p.locator(libraryCard).count() };
    assert.match(r.deleted.status, /Запись удалена/u);
    assert.equal(r.deleted.store.count, 0);
    assert.equal(r.deleted.libraryCards, 0);
    await closeLibrary(p);
    await openLearning(p);
    assert.equal((await view(p)).selectedTab, 'tabNotes');
    const open = p.locator(noteCard).getByRole('button', { name: 'Открыть место' });
    r.stale = { count: await p.locator(noteCard).count(), text: await text(p, `${noteCard} blockquote`), openEnabled: await open.isEnabled(),
      openVisible: await open.isVisible(), canonicalCount: (await items(p)).count };
    assert.deepEqual(r.stale, { count: 1, text: legacyQuote, openEnabled: true, openVisible: true, canonicalCount: 0 });
    assert.equal(await stateClock(p), doc);
    assert.deepEqual(await learningState(p), r.quiz);
    if (route === A) {
      await p.locator(`${sheet} [role=dialog]`).screenshot({ path: path.join(out, 'deleted-quote-still-listed.png'), animations: 'disabled' });
      await click(p, '#tabQuiz');
      assert.deepEqual(await learningState(p), r.quiz);
      await click(p, '#tabNotes');
      r.afterTabActivation = await inspectEmptyNotes(p);
      assert.equal(await stateClock(p), doc);
    } else {
      const href = initial.quotes[0].url;
      await follow(p, open, u => u.pathname === C && u.hash.includes(':~:text='));
      r.staleAction = { href: localHref(p.url()), docChanged: (await stateClock(p)) !== doc, store: await items(p) };
      assert.equal(r.staleAction.href, href);
      assert.ok(r.staleAction.docChanged);
      assert.equal(r.staleAction.store.count, 0);
    }
  });
}

for (const [route, viewport] of [[A, compact], [G, wide]]) {
  job('manage-notes-focus-after-escape', route, viewport, async (p, r, base) => {
    await p.goto(base + route, { waitUntil: 'load' });
    r.quiz = await missLearning(p);
    const doc = await stateClock(p);
    await click(p, '#tabNotes');
    r.tabSteps = await seekTab(p, p.locator('#manageNotesBtn'));
    r.from = await view(p);
    assert.equal(r.from.focus.id, 'manageNotesBtn');
    await p.keyboard.press('Enter');
    await waitLibrary(p);
    r.managing = await view(p);
    assert.equal(r.managing.learning, 'true');
    assert.equal(r.managing.focus.id, 'gb-hl-close');
    assert.equal(r.managing.overflow, 'hidden');
    await p.keyboard.press('Escape');
    await settle(p);
    r.closedFromManage = await view(p);
    assert.deepEqual([r.closedFromManage.learning, r.closedFromManage.library, r.closedFromManage.inert], ['true', 'true', true]);
    assert.notEqual(r.closedFromManage.overflow, 'hidden');
    assert.equal(r.closedFromManage.focus.tag, 'BODY');
    r.tabsAfterEscape = [];
    for (let i = 0; i < 3; i++) {
      await p.keyboard.press('Tab');
      r.tabsAfterEscape.push((await view(p)).focus);
    }
    await click(p, '#gb-hl-fab');
    await waitLibrary(p);
    assert.equal((await view(p)).focus.id, 'gb-hl-close');
    await p.keyboard.press('Escape');
    await settle(p);
    r.closedFromFab = await view(p);
    assert.equal(r.closedFromFab.focus.id, 'gb-hl-fab');
    await openLearning(p, '#tabQuiz');
    assert.deepEqual(await learningState(p), r.quiz);
    assert.equal(await stateClock(p), doc);
  });
}

job('contextual-note-landing-control', C, wide, async (p, r, base) => {
  await p.goto(base + C, { waitUntil: 'load' });
  r.plainLanding = await locationOf(legacyParagraph(p));
  assert.equal(r.plainLanding.inViewport, false);
  r.selection = await dragPhrase(p, legacyParagraph(p), legacyQuote);
  assertMenu(r.selection, true);
  await click(p, '#ss-note');
  await waitLibrary(p);
  await p.locator('#gb-hl-editor').waitFor();
  r.editorContext = await text(p, '#gb-hl-note-context');
  assert.equal(r.editorContext, `К цитате: «${legacyQuote}»`);
  await p.locator('#gb-hl-note-text').fill(sampleNote);
  await p.locator('#gb-hl-editor button[type=submit]').click();
  await p.locator(`${libraryCard}[data-type=note]`).getByText(sampleNote, { exact: true }).waitFor();
  r.saved = await items(p);
  assert.equal(r.saved.quotes.length, 0);
  assert.equal(r.saved.notes[0].quoteText, legacyQuote);
  assert.match(r.saved.notes[0].url, /:~:text=/u);
  await p.goto(base + A, { waitUntil: 'load' });
  const originDoc = await stateClock(p);
  r.originQuiz = await missLearning(p);
  assert.deepEqual(await items(p), r.saved);
  await click(p, '#tabNotes');
  r.learningNotes = await inspectEmptyNotes(p);
  await manage(p);
  await click(p, '[data-library-tab=note]');
  await savedNoteUi(p, r.saved);
  assert.equal(await text(p, `${libraryCard} .gb-hl-related`), `К цитате: «${legacyQuote}»`);
  const link = p.locator(noteLink);
  r.href = localHref(await link.getAttribute('href'));
  assert.equal(r.href, r.saved.notes[0].url);
  await follow(p, link, u => u.pathname === C);
  await p.waitForTimeout(2250);
  r.linkLanding = { ...await locationOf(legacyParagraph(p)), url: localHref(p.url()), docChanged: (await stateClock(p)) !== originDoc,
    browser: await p.evaluate(() => ({ hash: location.hash, target: document.querySelector(':target')?.id ?? null })) };
  assert.ok(r.linkLanding.docChanged);
  assert.equal(r.linkLanding.url, r.href);
  assert.deepEqual(await items(p), r.saved);
  await p.goBack({ waitUntil: 'load' }); // default Playwright launch: BFCache disabled, no claim about a warm Back
  await p.waitForURL(u => u.pathname === A);
  r.back = { docChanged: (await stateClock(p)) !== originDoc, view: await view(p) };
  assert.ok(r.back.docChanged);
  assert.equal(r.back.view.navType, 'back_forward');
  assert.deepEqual(await items(p), r.saved);
  r.back.quiz = await freshQuiz(p, true);
});

// Minimal same-origin control (no Product JS/CSS): a browser that misses it cannot
// distinguish a Product text-fragment bug from a browser/environment limitation.
job('html-fragment-calibration', '/control', wide, async (p, r) => {
  const htmlServer = createServer((req, res) => {
    const start = `<a id="text-link" href="/control#main-content:~:text=${encodeURIComponent(legacyQuote)}">Text fragment</a>
      <a id="anchor-link" href="/control#target">Element anchor</a>`;
    const control = `<main id="main-content"><div style="height:3000px">Top</div>
      <p id="target">${legacyQuote}, контроль.</p><div style="height:1600px"></div></main>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end('<!doctype html><meta charset="utf-8">' + (req.url === '/control' ? control : start));
  });
  await new Promise(resolve => htmlServer.listen(0, '127.0.0.1', resolve));
  const start = `http://127.0.0.1:${htmlServer.address().port}/entry`;
  try {
    await p.goto(start);
    await follow(p, p.locator('#text-link'), u => u.pathname === '/control');
    await p.waitForTimeout(2250);
    r.textDirective = { ...await locationOf(p.locator('#target')), url: localHref(p.url()),
      browser: await p.evaluate(() => ({ hash: location.hash, target: document.querySelector(':target')?.id ?? null })) };
    await p.goto(start);
    await follow(p, p.locator('#anchor-link'), u => u.pathname === '/control');
    await settle(p);
    r.elementAnchor = { ...await locationOf(p.locator('#target')), url: localHref(p.url()) };
    assert.equal(r.textDirective.inViewport, false);
    assert.equal(r.elementAnchor.hit, true);
  } finally { await new Promise(resolve => htmlServer.close(resolve)); }
});

const selected = jobs.filter(j => !filter || `${j.scenario} ${j.route} ${j.viewport.width}`.includes(filter));
assert.ok(selected.length);
fs.mkdirSync(out, { recursive: true });
assert.equal(fs.readdirSync(out).length, 0, 'use an empty output directory');
const pngs = ['deleted-quote-still-listed.png', 'free-note-in-library.png'];
const result = { anchor: head, node: process.versions.node, playwright: req('playwright/package.json').version,
  protocol: { headless: true, pointer: 'fine / mouse even at 390px', bfcache: 'Playwright default disabled', reducedMotion: 'reduce', serviceWorkers: 'block' },
  markup: markupCensus(dist), records: [] };
assert.equal(result.markup.html, 117);
assert.equal(result.markup.rows.length, 68);
assert.equal(result.markup.rows.filter(row => row.quiz).length, 11);
assert.ok(result.markup.rows.every(row => row.libraryScript && !row.legacyScript && !row.inlineMenu));
const files = new Set();
const { server, base } = await serve();
let browser;
try {
  browser = await chromium.launch({ executablePath, args });
  result.chromium = browser.version();
  for (const { scenario, route, viewport, fn } of selected) {
    const r = { scenario, route, viewport, pageErrors: [], localHttp: [] };
    const ctx = await browser.newContext({ viewport, colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block' });
    try {
      const p = await ctx.newPage();
      p.setDefaultTimeout(6800);
      p.on('pageerror', e => r.pageErrors.push(e.message));
      p.on('response', x => {
        if (!x.url().startsWith(base + '/')) return;
        const u = new URL(x.url()).pathname;
        if (x.status() >= 400) r.localHttp.push([u, x.status()]);
        if (x.status() === 200 && x.request().resourceType() === 'document') files.add(u.slice(1) + 'index.html');
        if (x.status() === 200 && (/^\/(?:css|js)\/(?:site\.js|highlights(?:-runtime)?\.|reader-library-|floating-cluster(?:-controller)?\.)/u.test(u)
          || /^\/_astro\/(?:GillLearningSheet|ReaderActionsRuntime)/u.test(u))) files.add(u.slice(1));
      });
      await fn(p, r, base);
      assert.deepEqual(r.pageErrors, []);
      assert.deepEqual(r.localHttp, []);
      r.ok = true;
      console.log(`PASS ${scenario} ${route} ${viewport.width}`);
    } catch (e) {
      r.ok = false;
      r.error = String(e.stack ?? e).replaceAll(base, 'LOCAL');
      console.error(`FAIL ${scenario} ${route} ${viewport.width}\n${r.error}`);
    } finally { result.records.push(r); await ctx.close(); }
  }
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
result.distSha256 = Object.fromEntries([...files].sort().map(f => [f, sha(path.join(dist, f))]));
result.screenshots = pngs
  .filter(f => fs.existsSync(path.join(out, f))).map(f => ({ file: f, sha256: sha(path.join(out, f)) }));
result.total = result.records.length;
result.passed = result.records.filter(r => r.ok).length;
fs.writeFileSync(path.join(out, 'notes-witness.json'), JSON.stringify(result, null, 2) + '\n');
console.log(`${result.passed}/${result.total} scenario expectations; ${files.size} dist files pinned`);
if (result.passed !== result.total) process.exitCode = 1;
