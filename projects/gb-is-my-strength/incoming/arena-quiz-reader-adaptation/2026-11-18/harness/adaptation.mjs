// UI witness for an in-flight quiz; run against the unmodified exact Product dist.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , productArg, outArg, executablePath, axeFile, filter] = process.argv;
if (!productArg || !outArg || !executablePath || !axeFile) throw new Error('Usage: node adaptation.mjs PRODUCT OUT CHROMIUM AXE_MIN_JS [scenario-filter]');
const product = path.resolve(productArg), out = path.resolve(outArg);
const requireProduct = createRequire(path.join(product, 'package.json'));
const { chromium } = requireProduct('playwright');
const { serve } = await import(pathToFileURL(path.join(product, 'scripts/lib/a04-contract.mjs')));
const sha256 = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const axeSha = '880970c081707360e64f34cea25ff91892f5bc95675b0776925b9709dd8a68bb';
assert.equal(sha256(axeFile), axeSha, 'use the pinned axe-core@4.10.3');
const G1 = '/articles/dzhon-gill-chast-1-chelovek/';
const A = '/articles/otstuplenie-chto-govorit-bibliya/';
const N = '/articles/anatomiya-padeniya-pyat-stadiy/';
const sheet = '#gillLearningOverlay', settings = '#gillSettingsOverlay';
const dialog = `${sheet} [role="dialog"]`, scroller = `${dialog} .toc-sheet__body`;
const tab = '#tabQuiz', quizPanel = '#panelQuiz', source = '#glsQuizSource', next = '#glsQuizNext';
const sure = '#glsQuizConfRow [data-conf="sure"]';
const close = `${sheet} .toc-sheet__head button[data-overlay-close]`;
const native = '#quizPlaceholder .quiz-wrapper', feedback = `${native} .quiz-feedback`;
const opt = '#glsQuizOptions .quiz-option';
const prose = {
  [G1]: ['main article[data-pagefind-body] p', 'Джон Гилл родился 23 ноября 1697 года'],
  [A]: ['main article[data-pagefind-body] p', 'Слово «отступник» звучит окончательно'],
};
const desktop = (width = 1359, height = 900) => ({ viewport: { width, height } });
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const press = (page, sel, touch = false) => touch ? page.locator(sel).tap() : page.locator(sel).click();
const resize = async (page, width, height) => {
  await page.setViewportSize({ width, height });
  await page.waitForFunction(([w, h]) => innerWidth === w && innerHeight === h, [width, height]);
  await page.waitForTimeout(500); // settle responsive sheet transitions before measuring hit targets
};
const seekTab = async (page, locator) => {
  for (let n = 0; n <= 28; n++) {
    if (await locator.evaluate(e => e === document.activeElement)) return n;
    if (n < 28) await page.keyboard.press('Tab');
  }
  throw new Error(`No Tab stop reached: ${locator}`);
};

async function openSettings(page, touch) {
  const opener = (await page.locator('#railSettingsBtn').isVisible()) ? '#railSettingsBtn' : '#mobSettingsBtn';
  await press(page, opener, touch);
  await page.locator(`${settings}.is-open`).waitFor();
  return opener;
}
async function enterQuiz(page, touch, first = false) {
  await press(page, '#mobLearningBtn', touch);
  await page.locator(`${sheet}.is-open`).waitFor();
  if (first) await press(page, tab, touch);
  assert.equal(await page.locator(tab).getAttribute('aria-selected'), 'true');
  await page.locator(quizPanel).waitFor();
}
async function start(page, touch) {
  await openSettings(page, touch);
  await enterQuiz(page, touch, true);
}

async function sheetState(page) {
  return page.evaluate(() => {
    const id = s => document.getElementById(s);
    const text = s => id(s).textContent.trim();
    const deck = JSON.parse(id('gillQuizData').dataset.quiz);
    const item = deck.find(q => q.question === text('glsQuizQuestion'));
    const buttons = [...id('glsQuizOptions').querySelectorAll('button')].map(b => ({
      text: b.textContent.trim(), disabled: b.disabled, correct: b.classList.contains('is-correct'), wrong: b.classList.contains('is-wrong'),
    }));
    const a = id('glsQuizSource');
    return { id: item.id, question: item.question, correctText: item.answers[item.correctIndex], options: buttons,
      picked: id('glsQuizConfRow').querySelector('.is-picked')?.dataset.conf ?? null,
      confidenceHidden: id('glsQuizConf').hidden, verdict: text('glsQuizVerdict'), explanation: text('glsQuizExplanation'),
      live: text('glsQuizLive'), seen: text('glsQuizStreak'), calibration: text('glsQuizCalibPct'),
      source: a.hidden ? null : { href: a.getAttribute('href'), label: a.textContent.trim() } };
  });
}
const wrongIndex = state => state.options.findIndex(x => x.text !== state.correctText);
function missed(state) {
  assert.equal(state.picked, 'sure');
  assert.equal(state.confidenceHidden, true);
  assert.ok(state.options.every(x => x.disabled));
  assert.equal(state.options.filter(x => x.wrong).length, 1);
  assert.equal(state.options.filter(x => x.correct).length, 1);
  assert.match(state.verdict, /^Неверно — а уверенность была высокой/u);
  assert.equal(state.seen, 'Пройдено: 1');
  assert.equal(state.calibration, '0%');
  assert.ok(state.explanation.length > 30);
  assert.ok(state.source?.href.includes('#'));
}
function pressLocator(locator, touch) { return touch ? locator.tap() : locator.click(); }
async function prefs(page) {
  return page.evaluate(() => {
    const r = document.documentElement;
    return { state: window.GBReaderPreferences.get(), theme: r.dataset.readerTheme, mode: r.dataset.readerTextMode,
      darkClass: r.classList.contains('dark'), scale: Number(getComputedStyle(r).getPropertyValue('--gb-reader-font-scale')) };
  });
}
async function choice(page, selector, field, value, touch) {
  await press(page, `${settings} ${selector}`, touch);
  assert.equal(await page.locator(`${settings} ${selector}`).getAttribute('aria-pressed'), 'true');
  assert.equal((await prefs(page)).state[field], value);
}
const theme = (page, value, touch) => choice(page, `[data-gill-theme-btn][data-theme="${value}"]`, 'theme', value, touch);
const mode = (page, value, touch) => choice(page, `[data-text-mode="${value}"]`, 'textMode', value, touch);
const fontUp = async (page, n, touch) => {
  for (let i = 0; i < n; i++) await press(page, `${settings} [data-fc-action="font-up"]`, touch);
};
const done = (page, touch) => press(page, `${settings} .gill-settings-done`, touch);
const typography = (page, route) => page.evaluate(([selector, prefix]) => {
  const p = [...document.querySelectorAll(selector)].find(el => el.textContent.trim().startsWith(prefix));
  const size = node => parseFloat(getComputedStyle(node).fontSize);
  return { prose: size(p), quiz: Object.fromEntries(Object.entries({ question: '#glsQuizQuestion',
    choice: '#glsQuizOptions button', verdict: '#glsQuizVerdict', explanation: '#glsQuizExplanation', source: '#glsQuizSource',
  }).map(([k, s]) => [k, size(document.querySelector(s))])) };
}, prose[route]);

async function geometry(page, index) {
  return page.evaluate(({ sheet, settings, dialog, scroller, source, next, sure, opt, close, index }) => {
    const el = s => document.querySelector(s), round = n => Math.round(n * 10) / 10;
    const rect = e => { const b = e.getBoundingClientRect(); return { x: round(b.x), y: round(b.y), w: round(b.width), h: round(b.height), bottom: round(b.bottom) }; };
    const hit = (e, b) => b.w > 0 && b.h > 0 && e.contains(document.elementFromPoint(b.x + b.w / 2, b.y + b.h / 2));
    const measure = e => { const b = rect(e); return { ...b, hit: hit(e, b), focused: e === document.activeElement }; };
    const a = document.activeElement, body = el(scroller), box = el(dialog);
    const target = (s, i = 0) => measure(document.querySelectorAll(s)[i]);
    const sc = e => ({ ...rect(e), top: round(e.scrollTop), client: e.clientHeight, extent: e.scrollHeight, overflowY: getComputedStyle(e).overflowY });
    return { viewport: [innerWidth, innerHeight], fine: matchMedia('(pointer:fine)').matches, touchPoints: navigator.maxTouchPoints,
      mq64: matchMedia('(min-width:64em)').matches, mq85: matchMedia('(min-width:85em)').matches,
      overlay: el(sheet).getAttribute('aria-hidden'), settings: el(settings).getAttribute('aria-hidden'), expanded: el('#mobLearningBtn').getAttribute('aria-expanded'),
      lock: getComputedStyle(document.body).overflowY, pageY: round(scrollY), active: { tag: a.tagName, id: a.id, inside: el(sheet).contains(a) },
      body: sc(body), box: sc(box), targets: { source: target(source), next: target(next), confidence: target(sure), option: target(opt, index), close: target(close) } };
  }, { sheet, settings, dialog, scroller, source, next, sure, opt, close, index });
}
const point = b => ({ x: Math.round(b.x + b.w / 2), y: Math.round(b.y + b.h / 2) });
async function inputPoint(page, g) {
  const clippedBottom = Math.min(g.body.bottom, g.box.bottom, g.viewport[1]);
  const clippedTop = Math.max(g.body.y, g.box.y, 0);
  const v = { x: Math.round(g.body.x + g.body.w / 2), top: Math.ceil(clippedTop + 8), bottom: Math.floor(clippedBottom - 8), y: Math.round((clippedTop + clippedBottom) / 2) };
  assert.ok(v.bottom > v.top);
  assert.equal(await page.locator(scroller).evaluate((e, { x, y }) => e.contains(document.elementFromPoint(x, y)), v), true);
  return v;
}
async function wheel(page, g) {
  const { x, y } = await inputPoint(page, g);
  await page.mouse.move(x, y);
  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(300);
}
async function tapOrClickAt(page, box, touch) {
  assert.equal(box.hit, true, 'center must be hit-testable without Playwright auto-scroll');
  const { x, y } = point(box);
  if (touch) await page.touchscreen.tap(x, y);
  else await page.mouse.click(x, y);
}
async function swipe(page, cdp, g, down) {
  const { x, top, bottom } = await inputPoint(page, g);
  const [from, to] = down ? [bottom, top] : [top, bottom];
  const touch = (type, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await touch('touchStart', from);
  for (let n = 1; n <= 9; n++) {
    await touch('touchMove', Math.round(from + (to - from) * n / 9));
    await page.waitForTimeout(18);
  }
  await touch('touchEnd');
  await page.waitForTimeout(290);
}
function assertOpen(g) { assert.deepEqual([g.overlay, g.settings, g.expanded, g.lock], ['false', 'true', 'true', 'hidden']); }
function assertClosed(g) { assert.deepEqual([g.overlay, g.settings, g.expanded], ['true', 'true', 'false']); assert.notEqual(g.lock, 'hidden'); }

const jobs = [];
const job = (name, route, profile, fn) => jobs.push({ name, route, profile, fn });
for (const [route, profile] of [[G1, mobile], [A, desktop()]]) {
  job('sheet-preferences-after-miss', route, profile, async (page, rec) => {
    const touch = Boolean(profile.hasTouch);
    await start(page, touch);
    await press(page, sure, touch);
    const armed = await sheetState(page);
    await pressLocator(page.locator(opt).nth(wrongIndex(armed)), touch);
    const before = await sheetState(page);
    missed(before);
    rec.state = before;
    rec.checkpoints = [];
    async function capture(label, expectedTheme, expectedMode, scale) {
      const p = await prefs(page);
      assert.deepEqual([p.theme, p.mode, p.scale, p.darkClass], [expectedTheme, expectedMode, scale, expectedTheme === 'dark']);
      assert.deepEqual(await sheetState(page), before);
      assert.equal(await page.locator(source).isVisible(), true);
      rec.checkpoints.push({ label, prefs: p, sameState: true, typography: await typography(page, route),
        colors: await page.locator('#glsQuizExplanation').evaluate(e => ({ text: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor })) });
    }
    await capture('initial', 'light', 'rich', 1);
    async function change(label, action, t, m, s) {
      await press(page, close, touch);
      assertClosed(await geometry(page, 0));
      await openSettings(page, touch);
      await action();
      await enterQuiz(page, touch);
      await capture(label, t, m, s);
    }
    await change('night', () => theme(page, 'dark', touch), 'dark', 'rich', 1);
    await change('plain', () => mode(page, 'plain', touch), 'dark', 'plain', 1);
    await change('five A+', () => fontUp(page, 5, touch), 'dark', 'plain', 1.25);
    await change('sepia', () => theme(page, 'sepia', touch), 'sepia', 'plain', 1.25);
    await change('rich again', () => mode(page, 'rich', touch), 'sepia', 'rich', 1.25);
    const [first, night, plain, large, sepia] = rec.checkpoints;
    assert.notEqual(first.colors.text, night.colors.text);
    assert.notEqual(night.colors.text, sepia.colors.text);
    assert.equal(large.typography.prose / plain.typography.prose, 1.25);
    assert.deepEqual(large.typography.quiz, plain.typography.quiz);
    await press(page, next, touch);
    const after = await sheetState(page);
    assert.notEqual(after.id, before.id);
    assert.equal(after.seen, before.seen);
    rec.next = { id: after.id, seen: after.seen };
  });
}

for (const route of [G1, A]) {
  job('wide-clip-after-resize', route, desktop(), async (page, rec) => {
    await start(page, false);
    await press(page, sure);
    const armed = await sheetState(page), index = wrongIndex(armed);
    rec.tabsToOption = await seekTab(page, page.locator(opt).nth(index));
    const c = rec.checkpoints = {};
    c.compactArmed = await geometry(page, index);
    await resize(page, 1360, 900);
    c.wideArmed = await geometry(page, index);
    assert.deepEqual(await sheetState(page), armed);
    await resize(page, 1359, 900);
    c.compactArmedAgain = await geometry(page, index);
    assert.deepEqual(await sheetState(page), armed);
    for (const g of [c.compactArmed, c.wideArmed, c.compactArmedAgain]) {
      assertOpen(g);
      assert.ok(g.fine && g.touchPoints === 0 && g.targets.option.focused);
    }
    assert.deepEqual([c.compactArmed.targets.next.h, c.wideArmed.targets.next.h > 0, c.compactArmedAgain.targets.next.h], [0, true, 0]);
    await page.keyboard.press('Enter');
    const before = await sheetState(page);
    missed(before);
    rec.state = before;
    await resize(page, 1359, 320);
    c.shortBeforeWheel = await geometry(page, index);
    await wheel(page, c.shortBeforeWheel);
    c.shortAfterWheel = await geometry(page, index);
    assert.ok(c.shortAfterWheel.body.top > c.shortBeforeWheel.body.top, 'wheel scrolls the compact sheet');
    assert.ok(c.shortAfterWheel.targets.source.hit && c.shortAfterWheel.targets.next.hit);
    rec.tabsToNext = await seekTab(page, page.locator(next));
    c.shortFocused = await geometry(page, index);
    assert.equal(c.shortFocused.targets.next.hit, true);
    if (route === A) await page.screenshot({ path: path.join(out, 'compact-short-quiz.png'), animations: 'disabled' });
    await resize(page, 1360, 320);
    c.wideBeforeWheel = await geometry(page, index);
    await wheel(page, c.wideBeforeWheel);
    c.wideAfterWheel = await geometry(page, index);
    assert.deepEqual(await sheetState(page), before);
    for (const g of [c.shortAfterWheel, c.wideBeforeWheel, c.wideAfterWheel]) {
      assertOpen(g);
      assert.ok(g.fine && g.touchPoints === 0);
      assert.equal(g.pageY, c.shortBeforeWheel.pageY);
    }
    const w = c.wideAfterWheel;
    assert.ok(w.mq85 && !c.shortFocused.mq85 && w.targets.next.focused && w.targets.close.hit);
    assert.deepEqual([w.body.overflowY, w.box.overflowY, w.body.client, w.body.top, w.box.top],
      ['visible', 'hidden', w.body.extent, c.wideBeforeWheel.body.top, c.wideBeforeWheel.box.top]);
    for (const b of [w.targets.source, w.targets.next]) assert.ok(!b.hit && b.y >= w.box.bottom, 'action is beyond the clipped box');
    if (route === A) await page.screenshot({ path: path.join(out, 'wide-short-quiz.png'), animations: 'disabled' });
    // Keep the width change separate from touch emulation and from the 64em lifecycle handler.
    if (route === G1) {
      await page.keyboard.press('Enter'); // focus here is real but its control is not painted
      const after = await sheetState(page);
      assert.notEqual(after.id, before.id);
      assert.equal(after.seen, before.seen);
      rec.activation = { kind: 'Enter on retained Next', after: after.id, seen: after.seen };
    } else {
      await resize(page, 1359, 320);
      c.shortReturned = await geometry(page, index);
      await wheel(page, c.shortReturned);
      c.shortReturnedAfterWheel = await geometry(page, index);
      assert.deepEqual(await sheetState(page), before);
      const restored = c.shortReturnedAfterWheel;
      assert.ok(restored.targets.source.hit && restored.targets.next.hit);
      await tapOrClickAt(page, restored.targets.source, false);
      const hash = new URL(before.source.href, page.url()).hash;
      const target = decodeURIComponent(hash.slice(1));
      await page.waitForFunction(id => document.activeElement.id === id, target);
      assert.equal(new URL(page.url()).hash, hash);
      assertClosed(await geometry(page, index));
      await openSettings(page, false);
      await enterQuiz(page, false);
      assert.deepEqual(await sheetState(page), before);
      await wheel(page, await geometry(page, index));
      await tapOrClickAt(page, (await geometry(page, index)).targets.next, false);
      const after = await sheetState(page);
      assert.notEqual(after.id, before.id);
      assert.equal(after.seen, before.seen);
      rec.activation = { kind: 'pointer source + reopen + pointer Next', target, after: after.id, seen: after.seen };
    }
  });
}

job('short-touch-resize', A, mobile, async (page, rec) => {
  await start(page, true);
  await press(page, sure, true);
  const armed = await sheetState(page), index = wrongIndex(armed);
  rec.armed = armed;
  rec.portrait = await geometry(page, index);
  await resize(page, 844, 390);
  assert.deepEqual(await sheetState(page), armed);
  const cdp = await page.context().newCDPSession(page);
  const stages = rec.landscape = [];
  for (let i = 0; i <= 6; i++) {
    const g = await geometry(page, index);
    assertOpen(g);
    assert.ok(!g.fine && g.touchPoints === rec.portrait.touchPoints && g.touchPoints > 0 && !g.mq64);
    stages.push(g);
    if (g.targets.option.hit) break;
    assert.ok(i < 6, 'reach the option by swiping inside the sheet');
    await swipe(page, cdp, g, g.targets.option.y >= g.body.y);
  }
  await tapOrClickAt(page, stages.at(-1).targets.option, true);
  const before = await sheetState(page);
  missed(before);
  rec.state = before;
  const answered = rec.answered = [];
  for (let i = 0; i <= 8; i++) {
    const g = await geometry(page, index);
    assertOpen(g);
    answered.push(g);
    if (g.targets.next.hit && g.targets.source.hit) break;
    assert.ok(i < 8, 'reach both source and Next by swiping');
    await swipe(page, cdp, g, true);
  }
  const last = answered.at(-1);
  assert.ok(last.body.top > answered[0].body.top && last.body.extent > last.body.client);
  assert.ok([...stages, ...answered].every(g => g.pageY === rec.portrait.pageY));
  await resize(page, 390, 844);
  assert.deepEqual(await sheetState(page), before);
  rec.portraitAgain = await geometry(page, index);
  await resize(page, 844, 390);
  let returned = await geometry(page, index);
  for (let i = 0; !returned.targets.next.hit && i < 8; i++) {
    await swipe(page, cdp, returned, true);
    returned = await geometry(page, index);
  }
  rec.returned = returned;
  await tapOrClickAt(page, returned.targets.next, true);
  const after = await sheetState(page);
  assert.notEqual(after.id, before.id);
  assert.equal(after.seen, before.seen);
  rec.next = after.id;
  await cdp.detach();
});

job('lifecycle-64em-crossing', G1, desktop(1024), async (page, rec) => {
  await start(page, false);
  await press(page, sure);
  const index = wrongIndex(await sheetState(page));
  await page.locator(opt).nth(index).click();
  const before = await sheetState(page);
  missed(before);
  rec.state = before;
  rec.transitions = [];
  for (const width of [1023, 1024]) {
    const tabs = await seekTab(page, page.locator(next));
    const open = await geometry(page, index);
    assertOpen(open);
    await resize(page, width, 900);
    const closed = await geometry(page, index);
    assertClosed(closed);
    assert.ok(closed.fine && closed.mq64 !== open.mq64 && !closed.mq85);
    assert.deepEqual(closed.active, { tag: 'BODY', id: '', inside: false });
    assert.deepEqual(await sheetState(page), before);
    const opener = await openSettings(page, false);
    await enterQuiz(page, false);
    assert.deepEqual(await sheetState(page), before);
    const reopened = await geometry(page, index);
    assertOpen(reopened);
    rec.transitions.push({ tabs, open, closed, opener, reopened, sameState: true });
  }
});

async function nativeState(page) {
  return page.locator(native).evaluate(e => ({ question: e.querySelector('#quizQuestion').textContent.trim(),
    progress: e.querySelector('.quiz-progress').textContent.trim(), verdict: e.querySelector('.quiz-feedback strong').textContent,
    explanations: [...e.querySelectorAll('.quiz-explanation')].map(n => n.textContent.trim()),
    options: [...e.querySelectorAll('.quiz-option')].map(n => ({ text: n.textContent.trim(), className: n.className, disabled: n.disabled })),
    source: [...e.querySelectorAll('.quiz-feedback > a')].map(a => ({ href: a.getAttribute('href'), label: a.textContent.trim() })) }));
}
// WCAG luminance bounds for a translucent card and feedback block. Use both extreme
// underlays; an unseen gradient behind these layers cannot move the ratio outside this range.
function rgba(css) {
  const nums = css.match(/[-+]?[\d.]+/gu).map(Number);
  const factor = css.startsWith('color(srgb ') ? 255 : 1;
  assert.ok((/^rgba?\(/u.test(css) || factor === 255) && (nums.length === 3 || nums.length === 4), css);
  return [...nums.slice(0, 3).map(n => n * factor), nums[3] ?? 1];
}
const composite = (bottom, [r, g, b, a]) => [r, g, b].map((n, i) => n * a + bottom[i] * (1 - a));
const luminance = rgb => rgb.reduce((y, n, i) => {
  const v = n / 255;
  return y + [0.2126, 0.7152, 0.0722][i] * (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
}, 0);
function bounds(heading) {
  const color = rgba(heading.color);
  assert.equal(color[3], 1);
  assert.ok(heading.directLayers && heading.normalComposition && heading.hit);
  const layers = heading.backgrounds.map(rgba);
  const [lo, hi] = [0, 255].map(v => luminance(layers.reduce(composite, [v, v, v])));
  const fg = luminance(color.slice(0, 3));
  const ratios = [lo, hi].map(bg => (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05));
  const min = lo <= fg && fg <= hi ? 1 : Math.min(...ratios);
  return [Math.floor(min * 100) / 100, Math.ceil(Math.max(...ratios) * 100) / 100];
}
async function contrast(page) {
  await page.locator(`${feedback} > strong`).scrollIntoViewIfNeeded(); // not used to test wheel reachability
  const heading = await page.locator(`${feedback} > strong`).evaluate(e => {
    const ancestors = [];
    for (let n = e; n; n = n.parentElement) ancestors.push(n);
    const r = e.getBoundingClientRect(), gs = getComputedStyle(e);
    const layers = [e.closest('.quiz-wrapper'), e.parentElement, e];
    const directLayers = e.parentElement.parentElement === layers[0] && layers.every(n =>
      getComputedStyle(n).backgroundImage === 'none' && ['::before', '::after'].every(p =>
        ['none', 'normal'].includes(getComputedStyle(n, p).content)));
    return { text: e.textContent, color: gs.color, fontSize: gs.fontSize, directLayers,
      hit: e.contains(document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2)),
      backgrounds: layers.map(n => getComputedStyle(n).backgroundColor),
      normalComposition: ancestors.every(n => { const s = getComputedStyle(n); return s.mixBlendMode === 'normal' && s.filter === 'none' && s.opacity === '1'; }) };
  });
  const axe = await page.evaluate(async sel => {
    const { violations, passes, incomplete } = await window.axe.run(sel, { runOnly: ['color-contrast'] });
    return Object.fromEntries(Object.entries({ violations, passes, incomplete }).map(([status, rows]) => [status,
      rows.flatMap(v => v.nodes.map(n => ({ target: n.target, data: n.any.find(x => x.id === 'color-contrast')?.data ?? null }))) ]));
  }, feedback);
  const axeHeading = Object.entries(axe).flatMap(([status, rows]) => rows.filter(n => n.target.some(s => s.includes('strong'))).map(n => ({ status, ...n.data })));
  assert.equal(axeHeading.length, 1);
  return { heading, wcagBounds: bounds(heading), axeHeading: axeHeading[0], axe };
}
for (const profile of [mobile, desktop(1440)]) {
  job('native-feedback-preferences', N, profile, async (page, rec) => {
    const touch = Boolean(profile.hasTouch);
    await page.addScriptTag({ path: path.resolve(axeFile) });
    await press(page, '#quizLaunch', touch);
    rec.steps = [];
    // Anchored first two Anatomy questions: wrong Q1 (key 2) and correct Q2 (key 0), 0-based.
    for (const [q, index, verdict, href, themes] of [
      [1, 0, 'Неверно', '#metod', ['light', 'dark', 'sepia']],
      [2, 0, 'Верно', '#lichnoe-sistemnoe', ['sepia', 'dark', 'light']],
    ]) {
      await pressLocator(page.locator(`${native} .quiz-option`).nth(index), touch);
      const before = await nativeState(page);
      assert.equal(before.verdict, verdict);
      assert.equal(before.progress, `Вопрос ${q} из 8`);
      assert.equal(before.source[0].href, href);
      assert.ok(before.options.every(o => o.disabled) && before.explanations.length > 0);
      rec.steps.push({ state: before, themes: [] });
      for (const t of themes) {
        if ((await prefs(page)).theme !== t) {
          await openSettings(page, touch);
          await theme(page, t, touch);
          await done(page, touch);
          await page.locator(`${settings}.is-open`).waitFor({ state: 'hidden' });
          await page.waitForTimeout(300);
        }
        assert.equal((await prefs(page)).theme, t);
        assert.deepEqual(await nativeState(page), before);
        const x = await contrast(page);
        const { axeHeading: ax, wcagBounds: [lower, upper] } = x;
        assert.equal(ax.expectedContrastRatio, '4.5:1');
        assert.ok(t === 'dark' ? upper < 4.5 : lower >= 4.5);
        if (ax.status === 'incomplete') {
          assert.ok(!touch && ax.messageKey === 'bgGradient', 'gradient ambiguity is reported, not counted as axe pass');
        } else {
          assert.equal(ax.status, t === 'dark' ? 'violations' : 'passes');
          assert.ok(t === 'dark' ? ax.contrastRatio < 4.5 : ax.contrastRatio >= 4.5);
        }
        rec.steps.at(-1).themes.push({ theme: t, sameState: true, ...x });
      }
      if (q === 1) await press(page, `${native} button.quiz-next`, touch);
    }
  });
}

fs.mkdirSync(out, { recursive: true });
const selected = jobs.filter(j => !filter || `${j.name} ${j.route} ${j.profile.viewport.width}`.includes(filter));
assert.ok(selected.length, `no scenario matches ${filter}`);
const { server, base } = await serve();
const assets = new Set();
const result = { anchor: '9edef94ece08012223c1364bec7ddcd561cf5713', node: process.versions.node,
  playwright: requireProduct('playwright/package.json').version, axe: { version: '4.10.3', sha256: axeSha }, records: [] };
let browser;
try {
  browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'] });
  result.chromium = browser.version();
  for (const { name, route, profile, fn } of selected) {
    const r = { scenario: name, route, profile, pageErrors: [], localHttpFailures: [] };
    const ctx = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block', ...profile });
    try {
      const page = await ctx.newPage();
      page.setDefaultTimeout(6500);
      page.on('pageerror', e => r.pageErrors.push(e.message));
      page.on('response', x => {
        if (!x.url().startsWith(`${base}/`)) return;
        const p = new URL(x.url()).pathname;
        if (x.status() >= 400) r.localHttpFailures.push([p, x.status()]);
        if (x.status() === 200 && (/^\/(?:css|js)\/(?:floating-cluster|reader-preferences|site)/u.test(p) || /^\/_astro\/(?:GillLearningSheet|GillReaderSettingsSheet|ReaderActionsRuntime)/u.test(p))) assets.add(p.slice(1));
      });
      await page.goto(base + route + (route === N ? '#sec-quiz' : ''), { waitUntil: 'load' });
      const timeOrigin = await page.evaluate(() => performance.timeOrigin);
      assets.add(`${route.slice(1)}index.html`);
      await fn(page, r);
      assert.equal(await page.evaluate(() => performance.timeOrigin), timeOrigin, 'no document reload during the scenario');
      r.sameDocument = true;
      assert.deepEqual(r.pageErrors, []);
      assert.deepEqual(r.localHttpFailures, []);
      r.ok = true;
      console.log(`PASS ${name} ${route} ${profile.viewport.width}`);
    } catch (e) {
      r.ok = false;
      r.error = String(e.stack ?? e).replaceAll(base, 'LOCAL');
      console.error(`FAIL ${name} ${route} ${profile.viewport.width}\n${r.error}`);
    } finally {
      result.records.push(r);
      await ctx.close();
    }
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
result.distSha256 = Object.fromEntries([...assets].sort().map(f => [f, sha256(path.join(product, 'dist', f))]));
result.total = result.records.length;
result.passed = result.records.filter(r => r.ok).length;
if (result.records.some(r => r.scenario === 'wide-clip-after-resize' && r.route === A && r.ok)) {
  result.screenshots = ['compact-short-quiz.png', 'wide-short-quiz.png'].map(file => ({ file, sha256: sha256(path.join(out, file)) }));
}
fs.writeFileSync(path.join(out, 'adaptation-witness.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(`${result.passed}/${result.total} scenario expectations (includes reproduced defects); ${assets.size} dist files pinned`);
if (result.passed !== result.total) process.exitCode = 1;
