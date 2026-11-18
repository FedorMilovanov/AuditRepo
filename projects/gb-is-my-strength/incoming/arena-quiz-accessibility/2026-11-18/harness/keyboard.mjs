// Read-only traces of quiz keyboard events and Chromium AX nodes. See ../REPORT.md.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [productArg, outArg, executablePath, filter] = process.argv.slice(2);
if (!productArg || !outArg || !executablePath) throw new Error('Usage: node keyboard.mjs PRODUCT OUT CHROMIUM [scenario-substring]');
const product = path.resolve(productArg), out = path.resolve(outArg);
const requireProduct = createRequire(path.join(product, 'package.json'));
const { chromium } = requireProduct('playwright');
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'));
const { article, map } = read('question-corpus.json');
const { sheet } = read('census.json');
const desktop = { viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' };
const mobile = { viewport: { width: 390, height: 844 }, colorScheme: 'dark', reducedMotion: 'reduce', isMobile: true, hasTouch: true };
const profiles = {
  desktop, mobile, forced: { ...desktop, forcedColors: 'active' },
  w1359: { ...desktop, viewport: { width: 1359, height: 900 } },
  w1360: { ...desktop, viewport: { width: 1360, height: 900 } },
};
const gil = '/articles/dzhon-gill-chast-1-chelovek/';
const apo = '/articles/otstuplenie-chto-govorit-bibliya/';
const ana = '/articles/anatomiya-padeniya-pyat-stadiy/';
const heart = '/articles/krajne-li-isporcheno-serdce/';
const dio = '/articles/diotrefy-nashego-vremeni/';
const mapp = '/konfessii/russkij-baptizm/';
const mapInner = `${mapp}_app/index.html`;
const decks = sheet.filter(r => r.questions.length).map(r => r.route);
assert.equal(decks.length, 11);
const args = ['--no-sandbox', '--disable-dev-shm-usage', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'];
const norm = s => String(s ?? '').replace(/\s+/gu, ' ').trim();
const relative = url => { const u = new URL(url); return u.pathname + u.search + u.hash; };
const jobs = [];
const job = (scenario, route, profile, run) => jobs.push({ scenario, route, profile, run });
const focus = root => root.evaluate(() => {
  const e = document.activeElement;
  const href = e.getAttribute('href');
  return {
    tag: e.tagName, id: e.id, cls: e.getAttribute('class') ?? '',
    label: (e.getAttribute('aria-label') ?? (e === document.body ? '' : e.textContent)).replace(/\s+/gu, ' ').trim().slice(0, 125),
    inside: e.closest('#quizPlaceholder,#gillLearningOverlay,#gillSettingsOverlay,#quiz')?.id ?? null,
    hidden: e.hidden, disabled: e.disabled ?? null,
    href: href?.match(/^(?:mailto|tel):/i)?.[0] ?? href, conf: e.getAttribute('data-conf'),
  };
});
const paint = root => root.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
function keyboard(page, rec, world = page) {
  const trace = rec.keys = [];
  const note = async phase => { const active = await focus(world); trace.push({ phase, active }); return active; };
  const key = async (key, phase = key) => {
    await page.keyboard.press(key);
    await paint(world);
    const active = await focus(world);
    trace.push({ phase, key, active });
    return active;
  };
  const seek = async (selector, phase, limit = 12, direction = 'Tab') => {
    for (let steps = 0; steps <= limit; steps++) {
      if (await world.evaluate(selector => document.activeElement.matches(selector), selector)) return steps;
      if (steps < limit) await key(direction, phase);
    }
    assert.fail(`${phase}: ${selector} not reached within ${limit} × ${direction}`);
  };
  return { key, seek, note };
}
async function axProbe(context, page, inMap = false) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Accessibility.enable');
  return async selector => {
    const root = inMap ? "document.querySelector('#appframe').contentDocument" : 'document';
    const { result } = await cdp.send('Runtime.evaluate', { expression: `${root}.querySelector(${JSON.stringify(selector)})` });
    if (!result.objectId) return null;
    try {
      const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { objectId: result.objectId, fetchRelatives: false });
      const node = nodes[0];
      if (!node) return null;
      return {
        role: node.role?.value ?? null, name: node.name?.value ?? null, ignored: node.ignored,
        description: node.description?.value ?? null,
        props: Object.fromEntries((node.properties ?? []).filter(p => ['live', 'atomic', 'modal', 'disabled', 'expanded', 'selected', 'checked', 'pressed', 'focusable', 'focused'].includes(p.name)).map(p => [p.name, p.value.value])),
      };
    } finally { await cdp.send('Runtime.releaseObject', { objectId: result.objectId }); }
  };
}
const noAnswerState = o => ['pressed', 'checked', 'selected'].every(k => !(k in o.props)) && o.description === null;
const optionStyle = locator => locator.evaluateAll(options => options.map(e => {
  const css = getComputedStyle(e);
  return {
    text: e.innerText.replace(/\s+/gu, ' ').trim(), class: e.className,
    color: css.color, background: css.backgroundColor, border: css.borderTopColor, weight: css.fontWeight,
    before: getComputedStyle(e, '::before').content, after: getComputedStyle(e, '::after').content,
  };
}));

// Reader heading fragment is the fixture; every quiz control is reached with real keys.
const native = '#quizPlaceholder .quiz-wrapper';
const nativeOption = `${native} button.quiz-option`;
const nativeNext = `${native} button.quiz-next`;
async function nativeOpen(page, route, keys) {
  const item = article.find(r => r.route === route).questions[0];
  const startTabs = await keys.seek('#quizLaunch', 'reach launch from #sec-quiz', 8);
  const afterStart = await keys.key('Enter', 'launch');
  await page.locator(`${native} .quiz-options`).waitFor();
  const firstTab = await keys.key('Tab', 'first Tab after launch');
  assert.equal(firstTab.inside, 'quizPlaceholder');
  assert.ok(firstTab.cls.includes('quiz-option'));
  return { startTabs, afterStart, firstTab, dataKey: item.correct + 1 };
}
async function nativeMiss(page, rec, ctx, route) {
  const keys = keyboard(page, rec);
  rec.entry = await nativeOpen(page, route, keys);
  if (rec.entry.dataKey === 1) await keys.key('Tab', 'select second option, intentionally wrong');
  const beforeAnswer = await keys.note('option before wrong answer');
  assert.ok(beforeAnswer.cls.includes('quiz-option'));
  const focusedAfterAnswer = await keys.key('Enter', 'submit wrong answer');
  assert.ok(focusedAfterAnswer.cls.includes('quiz-next'));
  const panel = page.locator(native);
  assert.equal(await panel.locator('.quiz-feedback > strong').textContent(), 'Неверно');
  const ax = await axProbe(ctx, page);
  const opts = await panel.locator('button.quiz-option').count();
  rec.feedback = {
    snapshot: await panel.ariaSnapshot(), live: await ax(native), group: await ax(`${native} .quiz-options`),
    options: await Promise.all(Array.from({ length: opts }, (_, i) => ax(`${nativeOption}:nth-child(${i + 1})`))),
    styles: await optionStyle(panel.locator('button.quiz-option')),
    sourceCount: await panel.locator('.quiz-feedback a[href]').count(),
    forcedColors: await page.evaluate(() => matchMedia('(forced-colors: active)').matches),
  };
  assert.equal(rec.feedback.live.props.live, 'polite');
  assert.equal(rec.feedback.group.role, 'group');
  assert.equal(rec.feedback.group.name, norm(await panel.locator('#quizQuestion').textContent()));
  assert.ok(rec.feedback.options.every(o => o.role === 'button' && o.props.disabled === true && noAnswerState(o)));
  return keys;
}
job('native-keyboard-through-result', `${ana}#sec-quiz`, 'desktop', async (page, rec, ctx) => {
  const keys = await nativeMiss(page, rec, ctx, ana);
  assert.equal(rec.feedback.sourceCount, 1);
  rec.forwardFromNext = await keys.key('Tab', 'forward from automatically focused Next');
  assert.notEqual(rec.forwardFromNext.inside, 'quizPlaceholder');
  rec.reverseToSource = await keys.seek(`${native} .quiz-feedback a[href]`, 'reverse to source', 5, 'Shift+Tab');
  assert.equal(rec.reverseToSource, 2);
  const doc = await page.evaluate(() => performance.timeOrigin);
  await keys.key('Enter', 'open source');
  await page.waitForURL('**/#metod');
  rec.followed = await page.evaluate(() => {
    const r = document.getElementById('metod').getBoundingClientRect();
    return { hash: location.hash, viewport: r.top < innerHeight && r.bottom > 0, document: performance.timeOrigin };
  });
  assert.ok(rec.followed.viewport && rec.followed.document === doc);
  await page.goBack({ waitUntil: 'commit' }); // browser history button; no DOM focus helper
  await page.waitForURL('**/#sec-quiz');
  await keys.note('after native Back');
  const panel = page.locator(native);
  rec.returnToNext = await keys.seek(nativeNext, 'recover Next after source and Back', 8);
  assert.equal(await panel.locator('.quiz-feedback > strong').textContent(), 'Неверно');
  await keys.key('Enter', 'advance to Q2');
  rec.firstAfterNext = await keys.key('Tab', 'first Tab in Q2');
  assert.ok(rec.firstAfterNext.cls.includes('quiz-option'));
  const data = article.find(r => r.route === ana).questions;
  rec.progress = [];
  for (let i = 1; i < data.length; i++) {
    assert.equal((await panel.locator('.quiz-progress').textContent()).trim(), `Вопрос ${i + 1} из ${data.length}`);
    rec.progress.push(i + 1);
    // Choose the first focused option; no lookups that focus a later answer.
    const next = await keys.key('Enter', `submit Q${i + 1}`);
    assert.ok(next.cls.includes('quiz-next'));
    await keys.key('Enter', `advance Q${i + 1}`);
    if (i + 1 < data.length) {
      const active = await keys.key('Tab', `first Tab in Q${i + 2}`);
      assert.ok(active.cls.includes('quiz-option'));
    }
  }
  rec.result = await panel.locator('.quiz-progress').textContent();
  assert.match(rec.result, /Результат: \d+ из 8/u);
  rec.firstAfterResult = await keys.key('Tab', 'first Tab after result');
  assert.equal(rec.firstAfterResult.label, 'Пройти ещё раз');
  await keys.key('Enter', 'retry');
  rec.firstAfterRetry = await keys.key('Tab', 'first Tab after retry');
  assert.ok(rec.firstAfterRetry.cls.includes('quiz-option'));
  assert.equal(await panel.locator('.quiz-progress').textContent(), 'Вопрос 1 из 8');
});
job('native-wrong-forced-colors', `${ana}#sec-quiz`, 'forced', async (page, rec, ctx) => {
  await nativeMiss(page, rec, ctx, ana);
  assert.ok(rec.feedback.forcedColors);
  const [wrong, key] = ['is-incorrect', 'is-correct'].map(cls => rec.feedback.styles.find(s => s.class.includes(cls)));
  assert.equal(wrong.border, key.border);
  assert.ok(rec.feedback.styles.every(s => s.before === 'none' && s.after === 'none'));
});
job('native-no-source-tab-control', `${heart}#sec-quiz`, 'mobile', async (page, rec, ctx) => {
  const keys = await nativeMiss(page, rec, ctx, heart);
  assert.equal(rec.feedback.sourceCount, 0);
  rec.reverseFromNext = await keys.key('Shift+Tab', 'no-source control: reverse from Next');
  assert.notEqual(rec.reverseFromNext.inside, 'quizPlaceholder');
});

// One state census of the 11 deployed decks: pre-answer Next at two standard sizes plus two boundary pairs.
const settingsSelector = profile => ['desktop', 'w1360'].includes(profile) ? '#railSettingsBtn' : '#mobSettingsBtn';
const nextSheet = '#glsQuizNext';
const sheetPane = '#panelQuiz';
async function sheetState(page) {
  return page.locator(sheetPane).evaluate(p => {
    const get = id => p.querySelector(`#${id}`);
    const txt = n => (n?.textContent ?? '').replace(/\s+/gu, ' ').trim();
    const q = get('glsQuizQuestion');
    const b = get('glsQuizNext'), css = getComputedStyle(b), r = b.getBoundingClientRect();
    const source = get('glsQuizSource');
    const icon = p.querySelector('#glsQuizConf .quiz-conf__q svg').getBoundingClientRect();
    return {
      width: innerWidth, mediaCompact: matchMedia('(max-width: 84.999em)').matches,
      question: txt(q), seen: txt(get('glsQuizStreak')), verdict: txt(get('glsQuizVerdict')),
      calibrationHidden: get('glsQuizCalib').hidden,
      confidenceChoice: p.querySelector('[data-conf].is-picked')?.getAttribute('data-conf') ?? null,
      confidenceIcon: { width: Math.round(icon.width), height: Math.round(icon.height) },
      enabledOptions: p.querySelectorAll('#glsQuizOptions button:not(:disabled)').length,
      next: { classVisible: b.classList.contains('is-visible'), hidden: b.hidden, disabled: b.disabled, display: css.display, rendered: r.width > 0 && r.height > 0 && css.visibility === 'visible' },
      source: { hidden: source.hidden, text: txt(source), href: source.getAttribute('href'), display: getComputedStyle(source).display },
    };
  });
}
async function checkGate(page, rec, desktopWidth) {
  await page.locator(settingsSelector(rec.profile)).click();
  await page.locator('#mobLearningBtn').click();
  await page.locator('#tabQuiz').click();
  await page.locator(sheetPane).waitFor();
  rec.before = await sheetState(page);
  rec.nextAX = await page.locator(nextSheet).ariaSnapshot();
  assert.ok(rec.before.question && !rec.before.seen && !rec.before.verdict);
  assert.equal(rec.before.enabledOptions, 0);
  assert.equal(rec.before.confidenceChoice, null);
  assert.equal(rec.before.next.classVisible, false);
  assert.equal(rec.before.next.rendered, desktopWidth);
  assert.equal(rec.before.mediaCompact, !desktopWidth);
  if (!desktopWidth) {
    assert.deepEqual(rec.before.confidenceIcon, { width: 13, height: 13 });
    assert.equal(rec.before.next.display, 'none');
    assert.equal(rec.nextAX.trim(), '');
    return;
  }
  assert.ok(rec.before.confidenceIcon.height > 300);
  assert.equal(rec.before.next.disabled, false);
  assert.match(rec.nextAX, /button "Следующий вопрос"/u);
  if (rec.profile === 'desktop' && rec.route === gil) {
    await page.locator(nextSheet).scrollIntoViewIfNeeded();
    await page.locator('#gillLearningOverlay [role="dialog"]').screenshot({ path: path.join(out, 'next-before-answer.png'), animations: 'disabled' });
  }
  await page.locator(nextSheet).click(); // genuine, non-forced click before choosing confidence or answering
  rec.after = await sheetState(page);
  assert.notEqual(rec.after.question, rec.before.question);
  assert.equal(rec.after.seen, '');
  assert.equal(rec.after.verdict, '');
  assert.equal(rec.after.enabledOptions, 0);
  assert.equal(rec.after.calibrationHidden, true);
}
for (const route of decks) {
  job('sheet-unanswered-wide-census', route, 'desktop', (p, r) => checkGate(p, r, true));
  job('sheet-unanswered-compact-control', route, 'mobile', (p, r) => checkGate(p, r, false));
}
for (const route of [gil, apo]) {
  job('sheet-boundary-1359', route, 'w1359', (p, r) => checkGate(p, r, false));
  job('sheet-boundary-1360', route, 'w1360', (p, r) => checkGate(p, r, true));
}

const overlayState = page => page.evaluate(() => {
  const bits = id => {
    const d = document.getElementById(id);
    return { open: d.classList.contains('is-open'), ariaHidden: d.getAttribute('aria-hidden'), inert: d.inert };
  };
  return {
    settings: bits('gillSettingsOverlay'), learning: bits('gillLearningOverlay'),
    bodyOverflow: getComputedStyle(document.body).overflowY,
    launcherInClosedSettings: document.getElementById('mobLearningBtn').closest('[inert]')?.id ?? null,
    overlayCount: document.documentElement.getAttribute('data-overlay-count'),
  };
});
async function enterSheetWithKeys(page, rec, ctx, settingsControl = false) {
  const keys = keyboard(page, rec);
  const ax = await axProbe(ctx, page);
  const start = settingsSelector(rec.profile);
  await page.locator(start).focus(); // fixture only: start at the exposed Settings opener
  await keys.note('initial settings opener');
  await keys.key('Enter', 'open Settings');
  await page.locator('#gillSettingsOverlay.is-open').waitFor();
  if (settingsControl) {
    await keys.key('Escape', 'Settings-only control');
    await page.waitForFunction(s => document.activeElement.matches(s), start);
    rec.settingsEscape = { active: await keys.note('focus returned to real opener'), overlay: await overlayState(page) };
    await keys.key('Enter', 'open Settings again without script focus');
  }
  assert.ok(await keys.seek('#mobLearningBtn', 'through Settings to Learning', 24) > 0);
  await keys.key('Enter', 'switch Settings → Learning');
  await page.waitForFunction(() => document.activeElement?.id === 'tabTerms');
  rec.dialogAX = await ax('#gillLearningOverlay [role="dialog"]');
  rec.tabs = [await keys.note('entry tab')];
  rec.tabs.push(await keys.key('ArrowRight', 'select Outline'), await keys.key('ArrowRight', 'select Quiz'));
  assert.deepEqual(rec.tabs.map(t => t.id), ['tabTerms', 'tabOutline', 'tabQuiz']);
  rec.activeTabAX = await ax('#tabQuiz');
  assert.equal(rec.activeTabAX.props.selected, true);
  rec.tabPanelAX = await ax(sheetPane);
  assert.equal(rec.tabPanelAX.name, 'Тест');
  return { keys, ax, start };
}
async function sheetKeyboard(page, rec, ctx) {
  const { keys, ax } = await enterSheetWithKeys(page, rec, ctx);
  rec.before = await sheetState(page);
  assert.equal(rec.before.enabledOptions, 0);
  await keys.seek('[data-conf="sure"]', 'to confidence', 8);
  await keys.key('Enter', 'choose certain confidence');
  assert.equal((await sheetState(page)).enabledOptions, 4);
  rec.forwardAfterConfidence = await keys.key('Tab', 'first Tab after confidence');
  if (rec.profile === 'mobile') {
    assert.equal(rec.forwardAfterConfidence.id, 'glsQuizSource');
    rec.ghostAX = await ax('#glsQuizSource');
    assert.equal(rec.ghostAX.role, 'link');
    assert.equal(rec.ghostAX.name, '');
    assert.equal(rec.ghostAX.ignored, false);
    assert.equal(rec.forwardAfterConfidence.href, '#');
    assert.equal(rec.before.source.hidden, true);
  } else {
    assert.equal(rec.forwardAfterConfidence.id, 'glsQuizNext');
    assert.ok(rec.before.next.rendered && !rec.before.next.classVisible);
  }
  rec.extraTabsToAnAnswer = await keys.seek('#glsQuizOptions button', 'forward-only wrap to enabled option', 12);
  const item = await page.locator('#gillQuizData').evaluate(el => {
    const q = document.getElementById('glsQuizQuestion').textContent.trim();
    return JSON.parse(el.getAttribute('data-quiz')).find(x => x.question === q);
  });
  assert.ok(item);
  const first = await page.locator('#glsQuizOptions button:focus').textContent();
  if (norm(first) === norm(item.answers[item.correctIndex])) await keys.key('Tab', 'move from key to a distractor');
  await keys.key('Enter', 'submit confident miss');
  const live = page.locator('#glsQuizLive');
  rec.answered = { state: await sheetState(page), live: norm(await live.textContent()), liveAX: await ax('#glsQuizLive') };
  assert.equal(rec.answered.liveAX.props.live, 'polite');
  assert.ok(rec.answered.live.startsWith('Неверно. '));
  assert.equal(rec.answered.state.seen, 'Пройдено: 1');
  assert.equal((await keys.key('Tab', 'read available source next')).id, 'glsQuizSource');
  assert.equal((await keys.key('Tab', 'next button after source')).id, 'glsQuizNext');
  await keys.key('Enter', 'show next question');
  rec.afterAdvance = await sheetState(page);
  assert.notEqual(rec.afterAdvance.question, rec.before.question);
  assert.equal(rec.afterAdvance.enabledOptions, 0);
  assert.equal(rec.afterAdvance.verdict, '');
  rec.modalAfterNext = await overlayState(page);
  assert.ok(rec.modalAfterNext.learning.open);
  assert.equal(rec.modalAfterNext.bodyOverflow, 'hidden');
  rec.firstAfterNext = await keys.key('Tab', 'first Tab after Next');
  if (rec.profile === 'mobile') {
    rec.tabsUntilLand = [rec.firstAfterNext];
    for (let i = 0; i < 4 && rec.tabsUntilLand.at(-1).tag === 'BODY'; i++) {
      rec.tabsUntilLand.push(await keys.key('Tab', 'real Tab, not a focus recovery helper'));
    }
    rec.firstControlAfterNext = rec.tabsUntilLand.at(-1);
    assert.notEqual(rec.firstControlAfterNext.tag, 'BODY');
    rec.modalAtFirstControl = await overlayState(page);
    rec.firstControlAX = await ax(':focus');
    assert.ok(rec.modalAtFirstControl.learning.open);
    assert.equal(rec.modalAtFirstControl.bodyOverflow, 'hidden');
    assert.equal(rec.firstControlAfterNext.href, '#main-content');
    assert.notEqual(rec.firstControlAfterNext.inside, 'gillLearningOverlay');
    assert.equal(rec.firstControlAX.ignored, false);
  } else {
    rec.tabsToNewConfidence = await keys.seek('[data-conf="sure"]', 'reach confidence of second question', 12);
  }
}
job('sheet-keyboard-mobile-gill', gil, 'mobile', sheetKeyboard);
job('sheet-keyboard-mobile-adapter', apo, 'mobile', sheetKeyboard);
job('sheet-keyboard-desktop-adapter', apo, 'desktop', sheetKeyboard);
job('sheet-wide-keyboard-skips-before-confidence', apo, 'desktop', async (page, rec, ctx) => {
  const { keys } = await enterSheetWithKeys(page, rec, ctx);
  rec.before = await sheetState(page);
  assert.ok(await keys.seek(nextSheet, 'Tab to Next without choosing confidence', 10) > 0);
  await keys.key('Enter', 'skip the unanswered question');
  rec.after = await sheetState(page);
  assert.notEqual(rec.before.question, rec.after.question);
  assert.equal(rec.after.confidenceChoice, null);
  assert.equal(rec.after.seen, '');
  assert.equal(rec.after.verdict, '');
});
async function sheetEscape(page, rec, ctx) {
  const { keys, start } = await enterSheetWithKeys(page, rec, ctx, true);
  await keys.seek('[data-conf="sure"]', 'reach confidence for exit test', 8);
  rec.beforeEscape = await keys.note('valid focus inside Learning before Escape');
  await keys.key('Escape', 'close Learning');
  await page.waitForFunction(() => !document.getElementById('gillLearningOverlay').classList.contains('is-open'));
  // The shared owner retries every 60ms for eight attempts; observe after that window (420ms total).
  await page.evaluate(() => new Promise(r => setTimeout(r, 520)));
  rec.learningEscape = { focused: await keys.note('after bounded restoration window'), overlay: await overlayState(page) };
  assert.equal(rec.learningEscape.focused.tag, 'BODY');
  assert.equal(rec.learningEscape.overlay.overlayCount, '0');
  assert.equal(rec.learningEscape.overlay.launcherInClosedSettings, 'gillSettingsOverlay');
  assert.notEqual(rec.learningEscape.overlay.bodyOverflow, 'hidden');
  rec.firstAfterEscape = await keys.key('Tab', 'first Tab after closing Learning');
  assert.notEqual(rec.firstAfterEscape.id, start.slice(1));
}
job('sheet-escape-mobile-gill', gil, 'mobile', sheetEscape);
job('sheet-escape-desktop-adapter', apo, 'desktop', sheetEscape);

// The actual wrapper/frame, not the static text projection. Compare the same item under opposite outcomes.
const optionsMap = '#quiz h3 + div > button';
const scoreMap = '.chip-accent';
job('map-keyboard-and-programmatic-answer', mapp, 'desktop', async (page, rec, ctx) => {
  const quiz = page.frameLocator('#appframe').locator('#quiz');
  const all = quiz.getByRole('button', { name: 'Все темы', exact: true });
  await all.waitFor();
  const frame = page.frames().find(f => relative(f.url()) === mapInner);
  assert.ok(frame);
  const keys = keyboard(page, rec, frame);
  const ax = await axProbe(ctx, page, true);
  await all.focus(); // fixture: first topic control in the real iframe; no refocus inside the flow
  await keys.note('initial All topics button');
  const origins = map.filter(q => q.topic === 'origins');
  const theme = '#quiz .filter-pill-active';
  rec.topicBefore = await ax(theme);
  assert.equal((await keys.key('Tab', 'select Origins')).label, 'Истоки');
  await keys.key('Enter', 'apply Origins');
  await quiz.getByText('1 / 4', { exact: true }).waitFor(); // await React AnimatePresence hand-off, not the reused Q1 wording
  rec.topicAfter = await ax(theme);
  assert.equal(rec.topicAfter.name, 'Истоки');
  assert.ok(noAnswerState(rec.topicBefore) && noAnswerState(rec.topicAfter));
  assert.ok(await keys.seek(optionsMap, 'past topic pills to first answer', 12) > 0);
  await keys.key('Tab', 'select second answer, intentionally wrong');
  async function capture(mark) {
    const { id, options } = origins[0];
    const next = await keys.key('Enter', `submit ${mark} o1`);
    await quiz.getByText('Объяснение:', { exact: true }).waitFor();
    const body = frame.locator(optionsMap);
    const opts = await Promise.all(options.map((_, i) => ax(`${optionsMap}:nth-child(${i + 1})`)));
    const snap = await quiz.ariaSnapshot();
    assert.ok(opts.every(o => o.role === 'button' && o.props.disabled === true && noAnswerState(o)));
    return {
      id, focusAfterAnswer: next, optionsAX: opts, snapshot: snap,
      icons: await body.evaluateAll(xs => xs.map(b => b.querySelector('svg')?.getAttribute('class') ?? null)),
      statusNodes: await quiz.locator('[aria-live], [role="status"], [role="alert"], [role="log"]').count(),
      score: norm(await quiz.locator(scoreMap).textContent()),
      explanation: norm(await quiz.getByText('Объяснение:', { exact: true }).locator('..').innerText()),
    };
  }
  const mapNext = '#quiz button:not(:disabled)';
  rec.wrong = await capture('wrong');
  assert.equal(rec.wrong.score, '0 правильно');
  assert.equal(rec.wrong.icons.filter(Boolean).length, 2);
  assert.equal(rec.wrong.statusNodes, 0);
  for (let i = 0; i < origins.length; i++) {
    if (i > 0) {
      assert.equal((await keys.key('Tab', `focus answer Q${i + 1}`)).inside, 'quiz');
      assert.ok(await frame.evaluate(s => document.activeElement.matches(s), optionsMap));
      await keys.key('Enter', `answer Q${i + 1}`);
    }
    const next = await keys.key('Tab', 'advance or finish');
    assert.match(next.label, /^(Следующий вопрос|Посмотреть результат)/u);
    assert.ok(await frame.evaluate(s => document.activeElement.matches(s), mapNext));
    await keys.key('Enter', `next after Q${i + 1}`);
    if (i + 1 < origins.length) await quiz.getByText(`${i + 2} / 4`, { exact: true }).waitFor();
  }
  await quiz.getByText('Результат', { exact: true }).waitFor();
  rec.resultAX = await quiz.ariaSnapshot();
  rec.firstAfterResult = await keys.key('Tab', 'first Tab after map result');
  assert.equal(rec.firstAfterResult.label, 'Пройти снова');
  await keys.key('Enter', 'retry map topic');
  // A 1 / 4 score on the old result is not the progress label of a mounted first question.
  await quiz.getByRole('heading', { name: origins[0].question, exact: true }).waitFor();
  await frame.locator(optionsMap).first().waitFor();
  await keys.note('restarted Q1 mounted');
  rec.firstAfterRetry = await keys.key('Tab', 'first Tab after mounted map retry');
  assert.ok(await frame.evaluate(s => document.activeElement.matches(s), `${optionsMap}:first-child`));
  rec.correct = await capture('correct');
  assert.equal(rec.correct.score, '1 правильно');
  assert.equal(rec.correct.icons.filter(Boolean).length, 1);
  assert.equal(rec.correct.statusNodes, 0);
  assert.deepEqual(rec.wrong.optionsAX, rec.correct.optionsAX);
  assert.equal(rec.wrong.explanation, rec.correct.explanation);
});

job('diotrophes-native-disclosures-and-key', `${dio}#quiz`, 'desktop', async (page, rec, ctx) => {
  const keys = keyboard(page, rec);
  const ax = await axProbe(ctx, page);
  const selector = '#quiz > details';
  const n = await page.locator(selector).count();
  assert.equal(n, 10);
  rec.cards = [];
  assert.ok(await keys.seek(`${selector} summary`, 'reach first summary from quiz fragment', 10) > 0);
  for (let i = 0; i < n; i++) {
    const details = page.locator(selector).nth(i);
    const sum = `${selector}:nth-of-type(${i + 1}) > summary`;
    // Selector is the concrete owner, not a synthetic focus action.
    assert.ok(await page.evaluate(s => document.activeElement.matches(s), sum));
    const closed = await ax(sum);
    const short = await details.ariaSnapshot();
    await keys.key('Enter', `open disclosure ${i + 1}`);
    const open = await ax(sum);
    const options = await details.locator('li').evaluateAll(xs => xs.map(e => {
      const css = getComputedStyle(e);
      return { text: e.innerText.trim(), dataKey: e.dataset.correct, style: [css.color, css.fontWeight, css.textDecorationLine, getComputedStyle(e, '::before').content, getComputedStyle(e, '::after').content] };
    }));
    const body = await details.ariaSnapshot();
    assert.equal(closed.props.expanded, false);
    assert.equal(open.props.expanded, true);
    assert.equal(options.filter(x => x.dataKey === 'true').length, 1);
    assert.equal(new Set(options.map(x => JSON.stringify(x.style))).size, 1);
    assert.equal((body.match(/listitem:/gu) ?? []).length, 4);
    assert.doesNotMatch(body, /правильный вариант|верный ответ/u);
    rec.cards.push({ n: i + 1, closed, open, closedSnapshot: short, options, openedSnapshot: body });
    await keys.key('Enter', `close disclosure ${i + 1}`);
    if (i + 1 < n) await keys.key('Tab', `advance to disclosure ${i + 2}`);
  }
});

const selected = jobs.filter(j => !filter || j.scenario.includes(filter));
assert.ok(selected.length, 'No selected scenarios');
const routes = [...new Set(selected.map(x => x.route.split('#')[0]).concat(selected.some(x => x.route === mapp) ? [mapInner] : []))].sort();
const result = {
  auditedCommit: '9edef94ece08012223c1364bec7ddcd561cf5713', node: process.version,
  playwright: requireProduct('playwright/package.json').version, profiles, args,
  context: { serviceWorkers: 'block' },
  artifactSha256: Object.fromEntries(routes.map(route => [route, createHash('sha256').update(fs.readFileSync(path.join(product, 'dist', route.endsWith('/') ? `${route}index.html` : route))).digest('hex')])),
  runs: new Array(selected.length),
};
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const { server, base } = await serve();
let browser;
try {
  browser = await chromium.launch({ executablePath, headless: true, args });
  result.browser = browser.version();
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(selected.length, 4) }, async () => {
    while (cursor < selected.length) {
      const i = cursor++;
      const { scenario, route, profile, run } = selected[i];
      const rec = result.runs[i] = { scenario, route, profile, pageErrors: [], localHttpErrors: [] };
      const ctx = await browser.newContext({ ...profiles[profile], ...result.context });
      try {
        const page = await ctx.newPage();
        page.setDefaultTimeout(12000);
        page.on('pageerror', error => rec.pageErrors.push(String(error).replaceAll(base, 'LOCAL_ORIGIN')));
        page.on('response', r => { if (r.url().startsWith(`${base}/`) && r.status() >= 400) rec.localHttpErrors.push([r.status(), relative(r.url())]); });
        await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await run(page, rec, ctx);
        assert.deepEqual(rec.pageErrors, []);
        assert.deepEqual(rec.localHttpErrors, []);
        rec.ok = true;
      } catch (e) { rec.ok = false; rec.error = String(e).replaceAll(base, 'LOCAL_ORIGIN'); }
      finally { await ctx.close(); }
      console.log(`${rec.ok ? 'PASS' : 'FAIL'} ${scenario} ${route}${rec.error ? ` — ${rec.error}` : ''}`);
    }
  }));
  const ok = result.runs.filter(r => r.ok).length;
  console.log(`${ok}/${result.runs.length} reproduced; Chromium ${result.browser}, Playwright ${result.playwright}`);
  if (ok !== result.runs.length) process.exitCode = 1;
} finally {
  fs.writeFileSync(path.join(out, 'keyboard-witness.json'), JSON.stringify(result, null, 2) + '\n');
  await browser?.close();
  await new Promise(r => server.close(r));
}
