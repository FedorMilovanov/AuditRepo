/** Accessibility, keyboard, isolation and state-integrity audit of the lab. */
import { launch } from './browser.mjs';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:4321/';
const OUT = 'screenshots/audit-report.txt';
const browser = await launch();
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };
let failures = 0;
const check = (ok, label, detail = '') => {
  log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

async function newPage(w, h, opts = {}) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
  if (opts.reducedMotion) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  p.on('pageerror', e => { failures++; log('FAIL  pageerror — ' + e.message); });
  p.on('console', m => { if (m.type() === 'error') { failures++; log('FAIL  console.error — ' + m.text()); } });
  p.on('request', r => {
    const u = r.url();
    if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) {
      failures++; log('FAIL  external request — ' + u);
    }
  });
  await p.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => document.documentElement.dataset.labReady === '1', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 350));
  return p;
}
const wait = (ms = 320) => new Promise(r => setTimeout(r, ms));
const text = (p, s) => p.$eval(s, e => e.textContent.trim().replace(/\s+/g, ' '));

// ------------------------------------------------------------------ desktop states
let p = await newPage(1920, 1080);
log('\n== DESKTOP 1920 ==');

// All buttons have an accessible name.
const unnamed = await p.$$eval('button', bs => bs.filter(b => {
  const name = (b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent || '').trim();
  return !name || b.getAttribute('aria-hidden') === 'true';
}).map(b => b.outerHTML.slice(0, 120)));
check(unnamed.length === 0, 'accessible names on all buttons', unnamed.length ? unnamed[0] : '');

// Contrast of key text against its effective background in all three themes.
const contrast = await p.evaluate(() => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
    if (!m) return null;
    return [+m[1], +m[2], +m[3]].map(v => {
      v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
    });
  };
  const lum = (rgb) => .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  const bg = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      const v = parse(c);
      if (v && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return v;
      n = n.parentElement;
    }
    return [1, 1, 1];
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };
  const sels = ['.article-body p', '.lab-ctx-row__snippet', '.lab-desk__title', '.lab-band__label', '.lab-pin__label', '.lab-result__title'];
  const out = {};
  for (const s of sels) {
    const el = document.querySelector(s);
    if (!el) continue;
    const cs = getComputedStyle(el), fg = parse(cs.color);
    if (fg) out[s] = +ratio(fg, bg(el)).toFixed(2);
  }
  return out;
});
log('light contrast ratios: ' + JSON.stringify(contrast));
check(Object.values(contrast).filter(v => v >= 4.5).length === Object.values(contrast).length, 'light theme text contrast ≥ 4.5:1');
await p.click('#labThemeRight');
await p.click('#labThemeRight');
const darkContrast = await p.evaluate(() => {
  const el = document.querySelector('.article-body p');
  const cs = getComputedStyle(el);
  const toRgb = (c) => { const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/); return m ? [+m[1], +m[2], +m[3]].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }) : null; };
  const lum = (rgb) => .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  let bg = toRgb(getComputedStyle(document.querySelector('.lab-center')).backgroundColor);
  if (!bg || /rgba\(0, 0, 0, 0\)|transparent/.test(getComputedStyle(document.querySelector('.lab-center')).backgroundColor)) bg = [0.006, 0.008, 0.011];
  const fg = toRgb(cs.color);
  return +(((Math.max(lum(fg), lum(bg)) + .05) / (Math.min(lum(fg), lum(bg)) + .05))).toFixed(2);
});
log('dark article contrast ratio: ' + darkContrast);
check(darkContrast >= 4.5, 'dark theme article contrast ≥ 4.5:1');
await p.click('#labThemeRight'); // back to light

// Keyboard: '/', Escape, Alt+1/2, [ ] verse navigation.
await p.keyboard.press('/');
await wait();
check(await p.$('#labIndexInput') !== null, 'keyboard "/" opens article index');
await p.type('#labIndexInput', '2 Тимофею 2:14');
await wait();
check((await p.$$eval('.lab-result', n => n.length)) > 0, 'index keyboard search returns real refs');
await p.keyboard.press('Escape');
await wait();
check(await p.$('#labIndexInput') === null, 'Escape closes index and restores the desk');
await p.keyboard.down('Alt'); await p.keyboard.press('1'); await p.keyboard.up('Alt');
await wait();
check(await p.$eval('#labShell', e => e.dataset.left) === 'closed', 'Alt+1 collapses left rail');
await p.keyboard.down('Alt'); await p.keyboard.press('1'); await p.keyboard.up('Alt');
await p.keyboard.down('Alt'); await p.keyboard.press('2'); await p.keyboard.up('Alt');
await wait();
check(await p.$eval('#labShell', e => e.dataset.right) === 'closed', 'Alt+2 collapses right panel');
await p.keyboard.down('Alt'); await p.keyboard.press('2'); await p.keyboard.up('Alt');
await wait();

// Tab order: focused elements remain at least partly in the viewport.
const obscured = await p.evaluate(async () => {
  const focusables = [...document.querySelectorAll('a[href], button:not([disabled]), input, [tabindex="0"]')]
    .filter(el => el.offsetParent !== null && !el.closest('[inert]'));
  const bad = [];
  for (let i = 0; i < Math.min(40, focusables.length); i++) {
    const el = focusables[i];
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    await new Promise(r => requestAnimationFrame(r));
    const r = el.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) bad.push(el.outerHTML.slice(0, 90));
  }
  return bad;
});
check(obscured.length === 0, 'focus not fully obscured (first 40 focusables)', obscured[0] || '');

// Pinned material survives section changes and auto-follow.
await p.click('.article-body button.bref[data-ref="2 Тимофею 2:14–15"]'); await wait();
await p.click('[data-lab-action="pin"]'); await wait();
const pinnedBefore = await text(p, '#labPinned');
await p.evaluate(() => {
  const el = document.getElementById('sec-assessment') || document.querySelector('h2[id]');
  document.querySelector('#labCenter').scrollTo({ top: el.getBoundingClientRect().top - document.querySelector('#labCenter').getBoundingClientRect().top + document.querySelector('#labCenter').scrollTop, behavior: 'instant' });
});
await wait(700);
const pinnedAfter = await text(p, '#labPinned');
const section = await text(p, '#labCurrentSection');
check(pinnedBefore === pinnedAfter, 'pin survives section change and auto-follow', 'section now: ' + section);
check((await p.$eval('#labToolCompare', e => e.disabled)) === true, 'compare stays locked with one pin');

// Add a term pin, then compare; auto-follow band must not overwrite the desk.
const term = await p.$('.article-body button.lab-term');
if (term) { await term.click(); await wait(); await p.click('[data-lab-action="pin"]'); await wait(); }
check((await p.$eval('#labToolCompare', e => e.disabled)) === false, 'compare unlocks after two pins');
await p.click('[data-mode="compare"]'); await wait();
check((await p.$$eval('.lab-compare__col', n => n.length)) === 2, 'comparison shows two pinned materials');
await p.evaluate(() => document.querySelector('#labCenter').scrollTo({ top: 9000, behavior: 'instant' }));
await wait(700);
check((await p.$$eval('.lab-compare__col', n => n.length)) === 2, 'auto-follow does not replace manual «Разбор»');

// ---------------------------------------------------------- compare: overview shell
log('\n== COMPARE: WHOLE SHELF, NOT TWO COLUMNS ==');
// A shelf of eight: pin the apparatus of the section being read in one action.
await p.evaluate(async () => {
  document.querySelector('#labInstruments [data-mode="section"]').click();
  await new Promise(r => setTimeout(r, 500));
  document.querySelector('[data-lab-action="pinall"]')?.click();
});
await wait(600);
const cmp = await p.evaluate(async () => {
  document.querySelector('#labInstruments [data-mode="compare"]').click();
  await new Promise(r => setTimeout(r, 700));
  const title = document.querySelector('.lab-desk__title')?.textContent || '';
  const groups = [...document.querySelectorAll('.lab-shelfmap__row')].length;
  const chips = new Set([...document.querySelectorAll('.lab-shelfmap__items .lab-chip')].map(c => c.dataset.key + '|' + c.dataset.type)).size;
  const placements = document.querySelectorAll('.lab-shelfmap__items .lab-chip').length;
  const stats = [...document.querySelectorAll('.lab-compare__meta b')].map(b => +b.textContent);
  const pairs = [...document.querySelectorAll('.lab-pair__names')].map(e => e.textContent.replace(/\s+/g, ' '));
  const details = document.querySelector('.lab-pairbox');
  const box = document.querySelector('#labDesk').getBoundingClientRect();
  return { title, groups, chips, placements, stats, pairs, hasDetails: !!details, detailsOpen: details?.open, h: box.height };
});
check(/Вся полка/.test(cmp.title) && cmp.groups >= 1 && cmp.chips === cmp.stats[0] && cmp.placements >= cmp.chips,
  'compare opens with an overview of the whole shelf, grouped by the sections it really occurs in',
  JSON.stringify({ title: cmp.title, groups: cmp.groups, chips: cmp.chips, stats: cmp.stats }));
check(cmp.stats[0] > 2 && cmp.chips > 2, 'the overview covers more than the old two-material ceiling', JSON.stringify(cmp.stats));
check(cmp.hasDetails && cmp.detailsOpen === false,
  'the manual two-material pair is available but folded, so the overview stays on one screen', String(cmp.hasDetails));
check(cmp.pairs.length !== 3 || new Set(cmp.pairs).size === cmp.pairs.length,
  '«where materials meet» never repeats the same pair three times', JSON.stringify(cmp.pairs));

const cmpPick = await p.evaluate(async () => {
  document.querySelector('.lab-pairbox').open = true;
  await new Promise(r => setTimeout(r, 200));
  const sels = [...document.querySelectorAll('.lab-pairpick select')];
  sels[1].value = '0'; sels[1].dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(r => setTimeout(r, 200));
  const same = document.querySelector('#labCompareOut .lab-empty')?.textContent || '';
  sels[1].value = '1'; sels[1].dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(r => setTimeout(r, 250));
  const cols = document.querySelectorAll('#labCompareOut .lab-compare__col').length;
  const verdict = document.querySelector('#labCompareOut .lab-pair__verdict')?.textContent || '';
  const secs = [...document.querySelectorAll('#labCompareOut .lab-compare__col .lab-source')].map(e => e.textContent);
  return { same: /одинаковых/.test(same), options: sels[0].options.length, cols, verdict, secs };
});
check(cmpPick.same && cmpPick.options === cmp.stats[0],
  'the manual pair takes any two of the eight materials, and refuses to pair one with itself',
  JSON.stringify({ same: cmpPick.same, options: cmpPick.options }));
check(cmpPick.cols === 2 && /Общ/.test(cmpPick.verdict) && cmpPick.secs.filter(s => /^Разделы: /.test(s)).length === 2,
  'the pair prints both materials verbatim and names the sections of each', JSON.stringify(cmpPick).slice(0, 240));

const cmpJump = await p.evaluate(async () => {
  const btn = document.querySelector('.lab-shelfmap__sec');
  const label = btn.textContent;
  btn.click();
  await new Promise(r => setTimeout(r, 900));
  const sec = document.querySelector('.lab-head__section')?.textContent || '';
  return { label, sec, toast: document.querySelector('#labToast').textContent, opened: !document.querySelector('#labRight').hasAttribute('data-hidden') };
});
check(/К разделу/.test(cmpJump.toast) && cmpJump.label.length > 3,
  'a section name in the overview leads back to the text', JSON.stringify(cmpJump));
check((await p.$eval('[data-band="pinned"]', e => { const r = e.getBoundingClientRect(); return r.bottom <= innerHeight && r.top >= 0; })), 'pinned shelf remains in viewport');

// ---------------------------------------------------- labels: no duplicates, no cuts
log('\n== LABELS AND DOCUMENTED SHORTCUTS ==');
// The pinned-shelf block above re-rendered the desk, so nothing is open here:
// the instrument rail is the only way in, and it is always present.
const labels = await p.evaluate(async () => {
  document.querySelector('#labInstruments [data-mode="graph"]')?.click();
  await new Promise(r => setTimeout(r, 400));
  const names = [...document.querySelectorAll('.node-label')].map(t => t.textContent.trim());
  const kickEl = document.querySelector('.lab-desk__kicker');
  const kicker = kickEl && !kickEl.hidden ? kickEl.textContent.trim() : '';
  const band = document.querySelector('#labDeskLabel')?.textContent.trim() || '';
  return { names, dupes: names.filter((n, i) => names.indexOf(n) !== i), ellipsis: names.filter(n => n.includes('…')), kicker, band };
});
check(labels.dupes.length === 0, 'no two graph nodes carry the same label', JSON.stringify(labels.dupes));
check(labels.ellipsis.length === 0, 'no graph label is cut to an ellipsis', JSON.stringify(labels.ellipsis));
check(labels.kicker.toLowerCase() !== labels.band.toLowerCase(),
  'the material kicker never repeats the band name', labels.kicker + ' / ' + labels.band);

const bandKeys = await p.evaluate(async () => {
  const out = [];
  for (const mode of ['thread', 'section', 'notes', 'index', 'graph', 'edition', 'compare']) {
    document.querySelector(`#labInstruments [data-mode="${mode}"]`)?.click();
    await new Promise(r => setTimeout(r, 260));
    const kick = document.querySelector('.lab-desk__kicker');
    out.push({ mode,
      kicker: kick && !kick.hidden ? kick.textContent.trim() : '',
      band: (document.querySelector('#labDeskLabel')?.textContent || '').trim() });
  }
  document.querySelector('#labHelpBtn')?.click();
  await new Promise(r => setTimeout(r, 300));
  const kick = document.querySelector('.lab-desk__kicker');
  out.push({ mode: 'help', kicker: kick && !kick.hidden ? kick.textContent.trim() : '',
    band: (document.querySelector('#labDeskLabel')?.textContent || '').trim() });
  return out;
});
check(bandKeys.every(x => !x.kicker || x.kicker.toLowerCase() !== x.band.toLowerCase()),
  'every instrument names its material differently from its band', JSON.stringify(bandKeys));

// -------------------------------------------- typography: a bracket never dangles
const dangling = await p.evaluate(() => {
  // The check is geometric, not textual: for every bracket+reference pair the
  // bracket must sit on the same visual line as the reference text.
  const wraps = [...document.querySelectorAll('.lab-nb')];
  const bad = [];
  for (const w of wraps) {
    const r = w.getBoundingClientRect();
    const btn = w.querySelector('.bref').getBoundingClientRect();
    if (Math.abs(r.top - btn.top) > 4) bad.push(w.textContent.trim().slice(0, 22));
  }
  return { wraps: wraps.length, bad: bad.slice(0, 3) };
});
check(dangling.wraps > 20 && dangling.bad.length === 0,
  'an opening bracket and its scripture reference never split across lines',
  JSON.stringify(dangling));

// ---------------------------------------------------- series: pick a part, real titles
log('\n== SERIES: PICKING A PART IS A REAL STEP ==');
const edPick = await p.evaluate(async () => {
  document.querySelector('#labSeriesChip').click();
  await new Promise(r => setTimeout(r, 200));
  document.querySelector('#labSeriesSwitch [data-lab-series="heart"]').click();
  await new Promise(r => setTimeout(r, 600));
  document.querySelector('#labInstruments [data-mode="edition"]').click();
  await new Promise(r => setTimeout(r, 500));
  const parts = [...document.querySelectorAll('.lab-ed-part')];
  const titles = parts.map(x => x.querySelector('.lab-ed-part__title').textContent.trim());
  const marks = parts.map(x => x.querySelector('.lab-ed-part__mark').textContent.trim());
  const groups = [...document.querySelectorAll('.lab-ed-group')];
  const groupHeads = groups.map(g => g.querySelector('.lab-ed-group__head span').textContent.trim());
  const before = { head: document.querySelector('#labCurrentSection').textContent, pos: document.querySelector('#labHeadPos').textContent };
  parts[5]?.click();
  await new Promise(r => setTimeout(r, 500));
  return {
    count: parts.length, titles, marks, groupHeads,
    groupCount: groups.length,
    slugLike: titles.filter(t => /^[a-z0-9-]+$/i.test(t)).length,
    before,
    after: { head: document.querySelector('#labCurrentSection').textContent,
      pos: document.querySelector('#labHeadPos').textContent,
      current: document.querySelector('.lab-ed-part.is-current .lab-ed-part__title')?.textContent,
      toast: document.querySelector('#labToast')?.textContent },
  };
});
check(edPick.count === 22 && edPick.slugLike === 0,
  'the book form lists all 22 articles with their real titles, not their slug ids',
  JSON.stringify({ count: edPick.count, slugLike: edPick.slugLike, sample: edPick.titles.slice(0, 3) }));
check(edPick.groupCount === 4 && edPick.groupHeads.every(h => /^Глава [IVXLC]+\. /.test(h))
  && edPick.marks.join(' ') === Array.from({ length: 22 }, (_, i) => String(i + 1)).join(' '),
  'the book picker shows its two tiers: 4 chapter groups, and one running number per article',
  JSON.stringify({ groups: edPick.groupHeads, marks: edPick.marks.slice(0, 8) }));

check(/^Книга · /.test(edPick.after.pos) && / 6 \/ 22$/.test(edPick.after.pos) && edPick.after.current === edPick.after.head,
  'picking a part changes the margin headline and its chapter/position line',
  JSON.stringify({ before: edPick.before, after: edPick.after }));
check(/Глава I\. Диагноз сердца · 6 \/ 22/.test(edPick.after.toast || ''),
  'the picker confirmation names the chapter and whole-book position', edPick.after.toast || 'no toast');

await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(600);
const edPersist = await p.evaluate(() => ({
  pos: document.querySelector('#labHeadPos').textContent,
  head: document.querySelector('#labCurrentSection').textContent,
  stored: (() => { try { return JSON.parse(localStorage.getItem('arena-study-lab:edition') || 'null'); } catch (e) { return null; } })(),
  hidden: document.querySelector('#labHeadPos').hidden,
}));
check(!edPersist.hidden && / 6 \/ 22$/.test(edPersist.pos) && edPersist.head === edPick.after.head && edPersist.stored?.key === 'heart',
  'the chosen part of the book survives a reload, like the pins', JSON.stringify(edPersist));

// Keyboard/screen-reader path: choosing a part rebuilds the list, so the focus
// must land back on the chosen row instead of falling to <body>.
const edFocus = await p.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  document.querySelector('.lab-instruments [data-mode="edition"]')?.click();
  await wait(500);
  const row = document.querySelectorAll('.lab-ed-part')[4];
  row.focus(); row.click();
  await wait(600);
  const a = document.activeElement;
  const chosen = document.querySelector('.lab-ed-part.is-current');
  const viewport = document.querySelector('#labRightScroll');
  const r = chosen?.getBoundingClientRect(), v = viewport?.getBoundingClientRect();
  return { tag: a?.tagName, cls: a?.className, current: chosen?.contains(a),
    fullyVisible: !!(r && v && r.top >= v.top && r.bottom <= v.bottom - 8),
    row: r && { top: Math.round(r.top), bottom: Math.round(r.bottom) },
    viewport: v && { top: Math.round(v.top), bottom: Math.round(v.bottom) } };
});
check(edFocus.tag === 'BUTTON' && /lab-ed-part/.test(edFocus.cls || '') && edFocus.current === true && edFocus.fullyVisible === true,
  'choosing a part keeps keyboard focus on the chosen row and scrolls it above the pinned shelf', JSON.stringify(edFocus));

// A chosen part is a live read, not a chip: the article under the margins must
// actually change, and choosing the first part must come back to the start.
const edRead = await p.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // the reload above rebuilt the margins with the default tool, so reopen «Издание»
  document.querySelector('.lab-instruments [data-mode="edition"]')?.click();
  await wait(500);
  document.querySelectorAll('.lab-ed-part')[0]?.click();
  await wait(700);
  const b0 = document.querySelector('.lab-band--desk .lab-ed-part.is-current .lab-ed-part__title')?.textContent.trim();
  const here = document.querySelector('.lab-band--desk .lab-ed-part.is-current .lab-ed-part__meta')?.textContent.trim();
  return { title: b0, meta: here, pos: document.querySelector('#labHeadPos').textContent,
    head: document.querySelector('#labCurrentSection').textContent,
    inText: !!document.querySelector('.lab-article h1') };
});
check(/ 1 \/ 22$/.test(edRead.pos || '') && edRead.head === edRead.title && /^Испорчено ли сердце\?$/.test(edRead.head || ''),
  'going back to the first part resets the place line to 1 / 22', JSON.stringify(edRead));

const edFlat = await p.evaluate(async () => {
  document.querySelector('#labSeriesChip').click();
  await new Promise(r => setTimeout(r, 200));
  document.querySelector('#labSeriesSwitch [data-lab-series="gill"]').click();
  await new Promise(r => setTimeout(r, 600));
  document.querySelector('#labInstruments [data-mode="edition"]').click();
  await new Promise(r => setTimeout(r, 500));
  const parts = [...document.querySelectorAll('.lab-ed-part')];
  parts[2]?.click();
  await new Promise(r => setTimeout(r, 500));
  return { count: parts.length, head: document.querySelector('#labCurrentSection').textContent,
    pos: document.querySelector('#labHeadPos').textContent,
    place: document.querySelector('.lab-ed-now__place')?.textContent.trim(),
    toast: document.querySelector('#labToast').textContent };
});
check(edFlat.count === 6 && /^Серия · /.test(edFlat.pos) && / 3 \/ 6$/.test(edFlat.pos) && !/не найдена/.test(edFlat.toast)
  && /Часть · 3 \/ 6/.test(edFlat.place || ''),
  'a flat series is pickable too, and its current part is shown in the open-edition card', JSON.stringify(edFlat));

await p.evaluate(async () => {
  document.querySelector('#labSeriesChip').click();
  await new Promise(r => setTimeout(r, 200));
  document.querySelector('#labSeriesSwitch [data-lab-series="article"]').click();
  await new Promise(r => setTimeout(r, 500));
});
const backArticle = await p.evaluate(() => ({ head: document.querySelector('#labCurrentSection').textContent,
  posHidden: document.querySelector('#labHeadPos').hidden }));
check(backArticle.posHidden && backArticle.head.length > 2,
  'back in the article the headline is a section again, with no series line', JSON.stringify(backArticle));

const arrows = await p.evaluate(async () => {
  const toggles = [...document.querySelectorAll('#labRight .lab-band__toggle')]
    .filter(b => b.getAttribute('aria-expanded') === 'true');
  toggles[0].focus();
  const seen = [document.activeElement.closest('.lab-band').dataset.band];
  for (let i = 0; i < toggles.length - 1; i++) {
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise(r => setTimeout(r, 120));
    seen.push(document.activeElement.closest('.lab-band')?.dataset.band || 'body');
  }
  return { seen, expected: toggles.map(b => b.closest('.lab-band').dataset.band) };
});
check(JSON.stringify(arrows.seen) === JSON.stringify(arrows.expected),
  'the documented ↑/↓ walk the expanded band headings in order', JSON.stringify(arrows.seen));

// A closed popover is clipped to a 40 px circle but still occupies 299 px: it used
// to sit on top of the article and swallow clicks in the left third of a paragraph.
const hitTest = await p.evaluate(async () => {
  const pop = document.querySelector('#labRatePop');
  pop.classList.remove('is-open');
  const prose = document.querySelector('.article-body p');
  prose.scrollIntoView({ block: 'center' });
  await new Promise(r => setTimeout(r, 200));
  const pr = prose.getBoundingClientRect();
  const probes = [0.05, 0.2, 0.4].map(f => {
    const x = pr.left + pr.width * f, y = pr.top + Math.min(pr.height / 2, 10);
    const el = document.elementFromPoint(x, y);
    return { f, tag: el?.tagName, inProse: !!el?.closest('.article-body') };
  });
  return { probes, pe: getComputedStyle(pop).pointerEvents };
});
check(hitTest.probes.every(x => x.inProse),
  'a closed speed popover does not intercept clicks on the article text', JSON.stringify(hitTest));

const rateFlow = await p.evaluate(async () => {
  const btn = document.querySelector('#labRate');
  btn.click();
  await new Promise(r => setTimeout(r, 300));
  const pop = document.querySelector('#labRatePop');
  const open = pop.classList.contains('is-open');
  const pe = getComputedStyle(pop).pointerEvents;
  const hits = (() => {
    const b1 = document.querySelector('.gb-ember-expand__btn.is-active').getBoundingClientRect();
    const el = document.elementFromPoint(b1.x + b1.width / 2, b1.y + b1.height / 2);
    return !!el?.closest('#labRatePop');
  })();
  document.querySelector('.gb-ember-expand__btn[data-rate="1.5"]').click();
  await new Promise(r => setTimeout(r, 250));
  return { open, pe, hits, label: btn.textContent.trim(), expanded: btn.getAttribute('aria-expanded') };
});
check(rateFlow.open && rateFlow.pe === 'auto' && rateFlow.hits && /^1[.,]5×$/.test(rateFlow.label),
  'the speed popover opens, takes the click and sets the rate', JSON.stringify(rateFlow));

const bead = await p.evaluate(async () => {
  document.querySelector('#labInstruments [data-mode="thread"]')?.click();
  await new Promise(r => setTimeout(r, 500));
  const b = document.querySelector('#labThreadBead');
  const row = document.querySelector('.lab-thread__row[data-lab-active="true"]') || document.querySelector('.lab-thread__row');
  if (!b || !row) return { ok: false };
  const br = b.getBoundingClientRect(), rr = row.getBoundingClientRect();
  return { ok: true, w: Math.round(br.width), h: Math.round(br.height),
    round: Math.abs(br.width - br.height) <= 1,
    inRow: br.top + br.height / 2 > rr.top && br.top + br.height / 2 < rr.top + Math.min(rr.height, 90),
    html: b.tagName === 'SPAN' };
});
check(bead.ok && bead.round && bead.inRow && bead.html,
  'the «thread» bead is a round dot inside the current row, not a stretched SVG ellipse',
  JSON.stringify(bead));

const helpCount = await p.evaluate(async () => {
  document.querySelector('#labHelpBtn')?.click();
  await new Promise(r => setTimeout(r, 300));
  const heading = [...document.querySelectorAll('.lab-sub')].map(e => e.textContent).find(t => /внизу полей/.test(t)) || '';
  return { heading, linked: document.querySelectorAll('.lab-help__tool').length, shortcuts: [...document.querySelectorAll('.lab-help__row kbd')].length };
});
check(/^7 инструментов/.test(helpCount.heading) && helpCount.linked === 7,
  'the help names exactly the tools that exist (count from the list, not from prose)',
  JSON.stringify(helpCount));
check(helpCount.shortcuts >= 9, 'help lists every documented keyboard shortcut', String(helpCount.shortcuts));
// A band taller than the scroll area must align to the top when opened, or the
// material it opens stays below the fold while its head is on screen.
const tallReveal = await p.evaluate(() => {
  const sc = document.querySelector('.lab-right-scroll').getBoundingClientRect();
  const band = document.querySelector('[data-band="desk"]').getBoundingClientRect();
  const body = document.querySelector('#labDesk')?.getBoundingClientRect();
  return { gap: Math.round(band.top - sc.top), bodyTop: body ? Math.round(body.top - sc.top) : null, vh: Math.round(sc.height) };
});
check(tallReveal.gap <= 40 && tallReveal.bodyTop !== null && tallReveal.bodyTop < 160,
  'opening a tall instrument scrolls its body into view, not just its title', JSON.stringify(tallReveal));
// The shelf is limited to 8 and persisted: later checks must start from an empty
// one, otherwise they would measure the limit instead of the feature.
await p.evaluate(() => { try { Object.keys(localStorage).filter(k => /pins/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) {} });
await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(400);

// Independent collapse / restore, no horizontal scroll.
await p.click('#labRightClose'); await wait();
check(await p.$eval('#labShell', e => e.dataset.right) === 'closed', 'right collapses independently');
await p.click('#labRightRestore'); await wait();
await p.click('#labLeftCollapse'); await wait();
check(await p.$eval('#labShell', e => e.dataset.left) === 'closed', 'left collapses independently');
check(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'no horizontal page scroll at 1920');

// Font scaling and reduced motion (separate page).
await p.close();
p = await newPage(1440, 900, { reducedMotion: true });
log('\n== REDUCED MOTION + TYPE ==');
await p.click('#labSettingsBtn'); await wait();
await p.click('#labFontUp'); await p.click('#labFontUp'); await wait();
const fs1 = await p.$eval('#labFontValue', e => e.textContent);
const reduced = await p.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
check(fs1 === '110%', 'font scaling control works', fs1);
check(reduced, 'prefers-reduced-motion emulation active');
const animation = await p.evaluate(() => getComputedStyle(document.querySelector('.lab-lyasse')).transitionDuration);
log('reduced-motion ribbon transition-duration: ' + animation);
check(animation === '0s' || animation === '0.01s', 'motion suppressed under reduced-motion');
await p.close();

// Responsive widths: no h-scroll, no clipped critical panels.
log('\n== RESPONSIVE WIDTHS ==');
for (const [w, h] of [[1920,1080],[1440,900],[1280,860],[1024,820],[768,1024],[390,844]]) {
  const q = await newPage(w, h);
  const r = await q.evaluate(() => ({
    hScroll: document.documentElement.scrollWidth > innerWidth,
    centerW: document.querySelector('#labCenter').clientWidth,
    articleW: document.querySelector('.article-body').clientWidth,
    left: document.documentElement.dataset.labTheme,
    shellLeft: document.querySelector('#labShell').dataset.left,
    shellRight: document.querySelector('#labShell').dataset.right,
  }));
  check(!r.hScroll, `${w}px: no horizontal scroll`, JSON.stringify(r));
  check(r.centerW > 300 && r.articleW <= r.centerW, `${w}px: article fits its reading column`);
  if (w <= 1199) check(r.shellLeft === 'closed' && r.shellRight === 'closed', `${w}px: side panels start as drawers`);
  await q.close();
}


// ------------------------------------------------------------------ continuation fidelity + new instruments
log('\n== ORIGINAL SVG / CSS FIDELITY + REAL-TEXT INSTRUMENTS ==');
let q = await newPage(1600, 1000);
const fid = await q.evaluate(() => ({
  ember: !!document.querySelector('#labPlay.gb-ember'),
  glyph: document.querySelector('#labPlay .gb-ember__glyph path')?.getAttribute('d'),
  pause: document.querySelector('#labPlay .gb-ember__pause path')?.getAttribute('d'),
  check: document.querySelector('#labPlay .gb-ember__check path')?.getAttribute('d'),
  ringCircles: document.querySelectorAll('#labPlay .gb-ember__ring-svg circle').length,
  ringOpacity: getComputedStyle(document.querySelector('#labPlay .gb-ember__ring-svg')).opacity,
  dashArray: getComputedStyle(document.querySelector('#labPlay .gb-ember__ring-progress')).strokeDasharray,
  sun: document.querySelector('#labThemeRight .theme-icon-sun path')?.getAttribute('d'),
  moon: document.querySelector('#labThemeRight .theme-icon-moon path')?.getAttribute('d'),
  toggles: document.querySelectorAll('.gb-theme-toggle').length,
  overflow: getComputedStyle(document.querySelector('#labThemeRight')).overflow,
  back: document.querySelector('#labBack svg path')?.getAttribute('d'),
  menu: document.querySelector('#labLeftQuiet svg path')?.getAttribute('d'),
  collapse: document.querySelector('#labLeftCollapse svg path')?.getAttribute('d'),
  pdf: document.querySelector('#labPrintBtn svg polyline')?.getAttribute('points'),
  search: document.querySelector('#labIndexBtn svg circle')?.getAttribute('r'),
  pill: document.querySelectorAll('#labRatePop.gb-ember-expand__btn, #labRatePop .gb-ember-expand__btn').length,
  apparatus: document.querySelector('#labApparatusNote').textContent.trim().replace(/\s+/g, ' '),
}));
check(fid.ember && fid.ringCircles === 2 && fid.ringOpacity === '1' && fid.dashArray === '283px', 'original PlayEmber SVG + ring CSS active', JSON.stringify({ ring: fid.ringCircles, opacity: fid.ringOpacity, dash: fid.dashArray }));
check(fid.glyph === 'M7 4.8v14.4L18.5 12 7 4.8z' && fid.pause === 'M9 6v12M15 6v12' && fid.check === 'M5 12.5l4.2 4.1L19 7', 'PlayEmber glyph paths byte-for-byte original');
check(fid.sun === 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' && fid.moon === 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' && fid.toggles === 3 && fid.overflow === 'hidden', 'original sun/moon SVG + morph CSS on all three toggles');
check(fid.back === 'M19 12H5M12 19l-7-7 7-7' && fid.menu === 'M4 7h16M4 12h16M4 17h16' && fid.collapse === 'M14 6l-6 6 6 6'
  && fid.pdf === '7 10 12 15 17 10' && fid.search === '7', 'original rail SVG paths survive the two-switch header');
check(fid.pill === 5 && /116 сносок/.test(fid.apparatus) && /244 упоминаний/.test(fid.apparatus), 'canonical 5-speed bloom pill + honest apparatus counts', fid.apparatus);

// Day/night morph actually swaps the original glyphs.
await q.click('#labThemeRight'); await q.click('#labThemeRight'); await wait(500);
const morph = await q.evaluate(() => ({
  theme: document.documentElement.dataset.labTheme,
  sun: +getComputedStyle(document.querySelector('#labThemeRight .theme-icon-sun')).opacity,
  moon: +getComputedStyle(document.querySelector('#labThemeRight .theme-icon-moon')).opacity,
}));
check(morph.theme === 'dark' && morph.sun < .1 && morph.moon > .9, 'dark theme shows original moon, hides sun', JSON.stringify(morph));
await q.click('#labThemeRight'); await wait();

// Speed pill: opens, selects, closes, no horizontal overflow at compact desktop.
await q.click('#labRate'); await wait();
check(await q.$eval('#labRatePop', e => e.classList.contains('is-open') && getComputedStyle(e).visibility === 'visible'), 'original bloom pill opens');
await q.click('#labRatePop button[data-rate="1.5"]'); await wait();
check(await q.$eval('#labRate', e => e.textContent) === '1,5×', 'speed selection uses the site canonical values');
await q.click('#labRate'); await wait();

// TOC filter (original mobile-sheet pattern) searches real headings only.
await q.type('#labTocSearch', 'Заключение'); await wait();
const toc = await q.evaluate(() => {
  // «Заключение» is a real h4, so the filter has to surface it as a subsection
  // of the section that owns it — not as a top-level row.
  const subs = [...document.querySelectorAll('.lab-toc__sub a')].map(a => a.textContent.trim());
  const rows = [...document.querySelectorAll('.lab-toc__row')].map(r => (r.querySelector('.lab-toc__label') || {}).textContent || '');
  return {
    hitSub: subs.filter(t => /Заключение/.test(t)).length,
    hitRow: rows.filter(t => /Заключение/.test(t)).length,
    rowsShown: rows.length,
    empty: document.querySelector('#labTocEmpty').hidden,
  };
});
check(toc.hitSub === 1 && toc.hitRow === 0 && toc.empty, 'TOC filter finds the real «Заключение» heading as a subsection', JSON.stringify(toc));
await q.evaluate(() => { const i = document.querySelector('#labTocSearch'); i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); });
await wait(200);
await q.$eval('#labTocSearch', e => { e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); }); await wait();

// Real footnotes, section overview, help and index groups.
await q.click('[data-mode="notes"]'); await wait();
const notesCount = await q.$$eval('.lab-note-row', n => n.length);
check(notesCount >= 40, 'real footnotes are listed from the article DOM', String(notesCount));
await q.type('#labNotesInput', 'Hirsch'); await wait();
check(await q.$$eval('.lab-note-row', n => n.length) === 1, 'footnote search filters real bibliographic text');
await q.click('.lab-note-row'); await wait();
const note = await q.evaluate(() => ({
  label: document.querySelector('#labDeskLabel').textContent,
  body: document.querySelector('.lab-verse')?.textContent || '',
  source: document.querySelector('.lab-source')?.textContent || '',
}));
check(note.label === 'Сноска' && /Hirsch/.test(note.body) && /дословно/.test(note.source), 'footnote opens verbatim with honest provenance', note.label);
await q.click('[data-lab-action="pin"]'); await wait();
check(/Примечание/.test(await text(q, '#labPinned')), 'a real footnote can be pinned');
await q.evaluate(() => {
  const link = [...document.querySelectorAll('#labToc a')].find(a => /Оценка христоцентричной/.test(a.textContent));
  link?.click();
});
await wait(1200);
await q.click('[data-mode="section"]'); await wait(600);
const sec = await q.evaluate(() => ({
  label: document.querySelector('#labDeskLabel').textContent,
  title: document.querySelector('.lab-desk__title')?.textContent,
  stats: [...document.querySelectorAll('.lab-desk__stats b')].map(e => +e.textContent),
  noteRows: document.querySelectorAll('.lab-note-row').length,
  refs: document.querySelectorAll('.lab-desk [data-lab-action="openref"]').length,
}));
check(sec.label === 'Раздел' && /Оценка/.test(sec.title || '') && sec.stats.length === 3 && sec.stats.every(n => n >= 0) && sec.stats[0] > 0 && sec.stats[2] > 0 && sec.noteRows + sec.refs > 0, 'section overview counts a heading span including its nested subsections', JSON.stringify(sec));
await q.keyboard.press('?'); await wait();
check(await q.$eval('#labDeskLabel', e => e.textContent) === 'Как пользоваться' && await q.$$eval('.lab-help__row', n => n.length) >= 6 && await q.$$eval('.lab-help__tool', n => n.length) === 7, '? opens honest shortcut help plus a legend for all seven glyphs');
await q.keyboard.press('/'); await wait();
const groups = await q.$$eval('.lab-results .lab-sub', ns => ns.map(n => n.textContent.trim()));
check(groups.some(g => /Сноски и источники/.test(g)) && groups.some(g => /Разделы/.test(g)), 'index groups real notes and sections', groups.join(' | '));
await q.keyboard.press('Escape'); await wait();

// Auto-follow band now includes real footnotes of the paragraph.
await q.evaluate(() => {
  const m = document.querySelector('.article-body .fn-marker');
  const el = m?.closest('p') || document.querySelector('.article-body p');
  const c = document.querySelector('#labCenter');
  c.scrollTo({ top: el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 120, behavior: 'instant' });
});
await wait(700);
const ctx = await q.evaluate(() => ({
  noteRows: document.querySelectorAll('.lab-ctx-row[data-type="note"]').length,
  brief: document.querySelector('#labBriefMeta').textContent,
  read: document.querySelector('#labReadPct').textContent,
}));
check(ctx.noteRows >= 1 && /стих/.test(ctx.brief) && /снос/.test(ctx.brief) && /%$/.test(ctx.read), 'context band + section digest + reading progress are real', JSON.stringify(ctx));
await q.close();

// Bloom pill must never create horizontal overflow, desktop or mobile drawer.
for (const w of [1200, 390]) {
  const r = await newPage(w, 900);
  if (w <= 1199) { await r.click('.lab-mobile-bar [data-action="toc"]'); await wait(600); }
  await r.click('#labRate'); await wait();
  const over = await r.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  check(!over, `${w}px: open speed pill does not overflow the viewport`);
  await r.close();
}


// ------------------------------------------------------- article / series / book
log('\n== ARTICLE / SERIES / BOOK: ONE MARGIN ARCHITECTURE ==');
q = await newPage(1600, 1000);
const seriesData = await q.evaluate(async () => {
  const idx = await fetch('/data/series/index.json').then(r => r.json());
  const all = {};
  for (const [k, m] of Object.entries(idx)) all[k] = await fetch('/data/series/' + m.file).then(r => r.json());
  return { keys: Object.keys(idx), all };
});
check(seriesData.keys.length === 3, 'real series registry loaded (3 forms of edition)', seriesData.keys.join(', '));
check(seriesData.all.heart.shape === 'book' && seriesData.all.heart.items.filter(i => i.tier === 'chapter').length === 4
  && seriesData.all.heart.items.filter(i => i.tier === 'article').length === 22,
  'book form keeps two tiers: 4 chapters + 22 real articles');
check(seriesData.all.gill.shape === 'flat' && seriesData.all.gill.items.length === 6
  && seriesData.all.baptisty.theme === 'samizdat' && seriesData.all.baptisty.items.length === 10,
  'flat forms keep their real parts and the authentic samizdat theme');
check(seriesData.all.heart.totalMin === seriesData.all.heart.items.filter(i => i.tier !== 'chapter')
  .reduce((n, i) => n + i.minutes, 0) && seriesData.all.heart.items.filter(i => i.tier === 'front').every(i => i.minutes > 0),
  'book reading time is the sum of the real pages (front matter included, chapter headings add none)');

await q.evaluate(() => document.querySelector('#labInstruments [data-mode="edition"]').click());
await wait(500);
const ed = await q.evaluate(() => ({
  label: document.querySelector('#labDeskLabel').textContent,
  cards: document.querySelectorAll('.lab-ed-card').length,
  chapters: document.querySelectorAll('.lab-ed-chapter').length,
  rules: document.querySelectorAll('.lab-ed-rules div').length,
  now: document.querySelector('.lab-ed-now__sub')?.textContent || '',
}));
check(ed.label === 'Издание' && ed.cards === 3 && ed.chapters === 4 && ed.rules === 3,
  'edition desk shows all three real forms and what changes between them', JSON.stringify(ed));

// switching forms must move the margins, not the article
await q.evaluate(() => document.querySelector('#labSeriesChip').click());
await q.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="heart"]').click());
await wait(500);
const book = await q.evaluate(() => ({
  body: document.body.dataset.labEdition,
  mark: document.querySelector('#labEditionMark').textContent,
  chipText: document.querySelector('#labSeriesChipText').textContent,
  accent: getComputedStyle(document.querySelector('#labRight')).getPropertyValue('--lab-accent').trim(),
  articleUnchanged: document.querySelectorAll('.article-body p').length,
}));
check(book.body === 'heart' && book.mark === 'КН' && /Глава/.test(book.chipText) && book.articleUnchanged > 50,
  'book form names the chapter in the chip and leaves the article untouched', JSON.stringify(book));

await q.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="baptisty"]').click());
await wait(500);
const samizdat = await q.evaluate(() => ({
  theme: document.body.dataset.labSeriesTheme,
  accent: getComputedStyle(document.querySelector('#labRight')).getPropertyValue('--lab-accent').trim(),
  paper: getComputedStyle(document.querySelector('#labRight')).getPropertyValue('--lab-paper').trim(),
}));
check(samizdat.theme === 'samizdat' && samizdat.accent === '#5b3a86' && samizdat.paper === '#f2eadc',
  'the authentic samizdat skin recolours the margins', JSON.stringify(samizdat));

await q.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="article"]').click());
await wait(400);
const back = await q.evaluate(() => ({
  theme: document.body.dataset.labSeriesTheme,
  mark: document.querySelector('#labEditionMark').textContent,
  accent: getComputedStyle(document.querySelector('#labRight')).getPropertyValue('--lab-accent').trim(),
}));
check(back.theme === 'none' && back.mark === 'СТ' && back.accent === '#7a2e2e',
  'returning to a standalone article restores the base tokens', JSON.stringify(back));

// the three margin instruments must still work under every form
for (const key of ['heart', 'baptisty', 'gill']) {
  await q.evaluate(k => document.querySelector(`#labSeriesSwitch [data-lab-series="${k}"]`).click(), key);
  await wait(300);
  await q.evaluate(() => document.querySelector('[data-mode="notes"]').click());
  await wait(250);
  const ok = await q.evaluate(() => ({
    notes: document.querySelectorAll('.lab-note-row').length,
    hScroll: document.documentElement.scrollWidth > innerWidth,
    pin: !!document.querySelector('#labPinned'),
    context: !!document.querySelector('#labContextMeta'),
    index: !!document.querySelector('#labInstruments [data-mode="index"]'),
  }));
  check(ok.notes > 0 && !ok.hScroll && ok.pin && ok.context && ok.index,
    `${key}: footnotes, pin shelf, context band and index all survive the form switch`, JSON.stringify(ok));
}
await q.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="article"]').click());

// =====================================================================
// ================ MARGIN BANDS: ONE ACCORDION, ICON RAIL ==============
// =====================================================================
log('\n== MARGIN BANDS: ONE ACCORDION, ICONS ONLY WHEN FOLDED ==');
await q.evaluate(() => { try { localStorage.removeItem('arena-study-lab:bands'); } catch (e) {} });
await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(400);
const bands0 = await q.evaluate(() => ({
  quiet: document.body.dataset.labQuiet,
  pressed: document.querySelector('#labQuiet').getAttribute('aria-pressed'),
  state: [...document.querySelectorAll('.lab-band')].map(b => b.dataset.band + ':' + b.dataset.collapsed).join(' '),
}));
check(bands0.quiet === 'false' && bands0.pressed === 'false' && bands0.state === 'context:true brief:true desk:false pinned:undefined',
  'a fresh margin opens with ONE instrument and two icon rows, quiet switch honestly off', JSON.stringify(bands0));

// Move into a section that really carries apparatus, then fold: a folded row
// must show a real figure, not an empty placeholder.
await q.evaluate(() => {
  const a = document.querySelector('#labToc a[href^="#"]');
  const links = [...document.querySelectorAll('#labToc a')];
  (links[3] || a)?.click();
  const c = document.querySelector('#labCenter');
  c.scrollTo({ top: c.scrollTop + 1200, behavior: 'instant' });
});
await wait(900);
const quiet = await q.evaluate(async () => {
  document.querySelector('#labQuiet').click();
  await new Promise(r => setTimeout(r, 520));
  const rows = [...document.querySelectorAll('.lab-band')].filter(b => b.dataset.band !== 'pinned');
  return {
    rows: rows.map(b => ({
      key: b.dataset.band, collapsed: b.dataset.collapsed,
      h: Math.round(b.getBoundingClientRect().height),
      glyph: !!b.querySelector('.lab-band__glyph'),
      label: (b.querySelector('.lab-band__label') || {}).textContent,
      short: (b.querySelector('.band-meta-short') || {}).textContent || '',
      shortShown: !!b.querySelector('.band-meta-short') && getComputedStyle(b.querySelector('.band-meta-short')).display !== 'none',
      bodyH: Math.round(b.querySelector('.lab-band__body').getBoundingClientRect().height),
    })),
    quiet: document.body.dataset.labQuiet,
    pressed: document.querySelector('#labQuiet').getAttribute('aria-pressed'),
    toolButtons: document.querySelectorAll('#labInstruments button').length,
    railH: Math.round(document.querySelector('#labInstruments').getBoundingClientRect().height),
    inertControls: [...document.querySelectorAll('[data-band="context"] .lab-follow')]
      .every(el => getComputedStyle(el).pointerEvents === 'none'),
    noStack: document.querySelectorAll('.lab-right-foot, .lab-instruments').length === 1,
  };
});
check(quiet.rows.every(r => r.collapsed === 'true' && r.glyph && r.h <= 48 && r.bodyH <= 2),
  'every folded band is ONE iconic row of at most 48 px, body fully gone',
  quiet.rows.map(r => `${r.key}:${r.h}/${r.bodyH}`).join(' '));
check(quiet.rows.filter(r => r.key !== 'desk').every(r => r.shortShown && r.short.trim().length > 0)
  && quiet.rows.some(r => /\d+ (стих|сноск|понят)/.test(r.short)),
  'a folded row still shows one honest count, not the three-part sentence', quiet.rows.map(r => r.short).filter(Boolean).join(' | '));
check(quiet.quiet === 'true' && quiet.pressed === 'true' && quiet.inertControls,
  'the quiet switch reports the folded state and secondary controls stop intercepting clicks', JSON.stringify({ q: quiet.quiet, p: quiet.pressed }));
check(quiet.toolButtons === 7 && quiet.noStack && quiet.railH <= 52,
  'seven instruments live in ONE glyph rail (no 3x2 button grid, no second toolbar)', JSON.stringify({ n: quiet.toolButtons, h: quiet.railH }));

const acc = await q.evaluate(async () => {
  const click = sel => document.querySelector(sel).click();
  click('[data-band="desk"] .lab-band__toggle');
  await new Promise(r => setTimeout(r, 480));
  const afterDesk = [...document.querySelectorAll('.lab-band')].map(b => b.dataset.band + ':' + b.dataset.collapsed).join(' ');
  const deskOpen = Math.round(document.querySelector('.lab-band--desk').getBoundingClientRect().height);
  click('[data-band="context"] .lab-band__toggle');
  await new Promise(r => setTimeout(r, 480));
  const afterCtx = [...document.querySelectorAll('.lab-band')].map(b => b.dataset.band + ':' + b.dataset.collapsed).join(' ');
  return { afterDesk, deskOpen, afterCtx };
});
check(acc.afterDesk === 'context:true brief:true desk:false pinned:undefined' && acc.deskOpen > 200
  && acc.afterCtx === 'context:false brief:true desk:true pinned:undefined',
  'opening a band folds the others (one big band at a time), pinned shelf untouched', JSON.stringify(acc));

const persist = await q.evaluate(async () => {
  document.querySelector('#labQuiet').click();
  await new Promise(r => setTimeout(r, 400));
  return localStorage.getItem('arena-study-lab:bands');
});
await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(400);
const restored = await q.evaluate(() => ({
  state: [...document.querySelectorAll('.lab-band')].map(b => b.dataset.band + ':' + b.dataset.collapsed).join(' '),
  quiet: document.body.dataset.labQuiet,
}));
check(!!persist && restored.state === 'context:true brief:true desk:true pinned:undefined' && restored.quiet === 'true',
  'the folded layout is remembered across a reload (like theme and type)', JSON.stringify({ persist, ...restored }));

const railOpen = await q.evaluate(async () => {
  document.querySelector('#labInstruments [data-mode="edition"]').click();
  await new Promise(r => setTimeout(r, 560));
  return {
    label: document.querySelector('#labDeskLabel').textContent,
    cards: document.querySelectorAll('.lab-ed-card').length,
    desk: document.querySelector('[data-band="desk"]').dataset.collapsed,
    pressed: document.querySelector('#labInstruments [data-mode="edition"]').getAttribute('aria-pressed'),
    others: [...document.querySelectorAll('#labInstruments button')]
      .filter(b => b.dataset.mode !== 'edition' && !b.disabled)
      .every(b => b.getAttribute('aria-pressed') === 'false'),
  };
});
check(railOpen.label === 'Издание' && railOpen.cards === 3 && railOpen.desk === 'false' && railOpen.pressed === 'true' && railOpen.others,
  'a glyph in the rail opens its instrument even from the folded strip, and only it shows as active', JSON.stringify(railOpen));

const afterFold = await q.evaluate(async () => {
  document.querySelector('#labInstruments [data-mode="thread"]').click();
  await new Promise(r => setTimeout(r, 400));
  const first = document.querySelector('#labDeskLabel').textContent;
  document.querySelector('#labInstruments [data-mode="graph"]').click();
  await new Promise(r => setTimeout(r, 400));
  return { first, second: document.querySelector('#labDeskLabel').textContent };
});
check(afterFold.first === 'Ход статьи' && afterFold.second === 'Сеть понятий',
  'switching instruments in the rail never loses the last click', JSON.stringify(afterFold));

const mobile = await q.evaluate(() => {
  const rail = document.querySelector('#labInstruments');
  const r = rail.getBoundingClientRect();
  // the tooltips are absolutely positioned and must never widen the rail
  const tipW = Math.max(...[...rail.querySelectorAll('.lab-rail__tip')].map(t => t.getBoundingClientRect().width));
  return { h: Math.round(r.height), overflow: rail.scrollWidth > Math.ceil(r.width) + 1, tipW: Math.round(tipW),
    clipped: [...rail.querySelectorAll('.lab-rail__tip')].some(t => { const b = t.getBoundingClientRect(); return b.left < 0 || b.right > innerWidth + 1; }) };
});
check(!mobile.overflow, 'the instrument rail never overflows', JSON.stringify(mobile));

// ---------------------------------------------------------------- a11y sweep
log('\n== A11Y: CONTRAST, TARGETS, NAMES, HEAD STRIP ==');
const a11y = await q.evaluate(() => {
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const parse = s => { const m = String(s).match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };
  const bgOf = el => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return parse(c);
      n = n.parentElement;
    }
    return [255, 255, 255];
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };
  const sels = ['.lab-band__meta', '.lab-band__label', '.lab-instruments button', '.lab-apparatus__links button',
    '.lab-ctx-counts', '.lab-follow', '.lab-head__strip', '.lab-apparatus__note', '.lab-note', '.lab-sub'];
  const contrast = {};
  for (const sel of sels) {
    const el = document.querySelector(sel);
    if (!el) { contrast[sel] = null; continue; }
    contrast[sel] = +ratio(parse(getComputedStyle(el).color), bgOf(el)).toFixed(2);
  }
  // every glyph in the rail: a name, a description and a real target
  const rail = [...document.querySelectorAll('#labInstruments button')].map(b => {
    const r = b.getBoundingClientRect();
    return { name: (b.getAttribute('aria-label') || '').trim(), desc: (b.getAttribute('aria-description') || '').trim(),
      w: Math.round(r.width), h: Math.round(r.height), controls: b.getAttribute('aria-controls') };
  });
  const unnamed = [...document.querySelectorAll('button')]
    .filter(b => !(b.getAttribute('aria-label') || b.textContent || '').trim())
    .map(b => b.id || b.className);
  const danglingControls = [...document.querySelectorAll('[aria-controls]')]
    .filter(e => !document.getElementById(e.getAttribute('aria-controls'))).map(e => e.id);
  return { contrast, rail, unnamed, danglingControls };
});
const lowContrast = Object.entries(a11y.contrast).filter(([, v]) => v !== null && v < 4.5);
check(lowContrast.length === 0, 'every small caption keeps WCAG AA contrast (>= 4.5:1)',
  JSON.stringify(a11y.contrast));
check(a11y.rail.length === 7 && a11y.rail.every(b => b.name && b.desc && b.w >= 40 && b.h >= 32 && b.controls === 'labDesk'),
  'all seven glyphs carry a name, an explanation, aria-controls and a 40x32 target',
  JSON.stringify(a11y.rail));
check(a11y.unnamed.length === 0 && a11y.danglingControls.length === 0,
  'no unnamed button and no aria-controls pointing at a missing node', JSON.stringify(a11y));

const strip = await q.evaluate(async () => {
  document.querySelector('#labRightClose').click();
  await new Promise(r => setTimeout(r, 320));
  document.querySelector('[data-action="study"]').click();
  await new Promise(r => setTimeout(r, 420));
  const before = { hidden: document.querySelector('#labHeadStrip').hidden, text: document.querySelector('#labHeadStrip').textContent.trim().replace(/\s+/g, ' ') };
  document.querySelector('#labQuiet').click();
  await new Promise(r => setTimeout(r, 520));
  const folded = { hidden: document.querySelector('#labHeadStrip').hidden, text: document.querySelector('#labHeadStrip').textContent.trim().replace(/\s+/g, ' '),
    label: document.querySelector('#labHeadStrip').getAttribute('aria-label'), follow: document.querySelector('#labHeadStrip').dataset.follow };
  document.querySelector('#labHeadStrip').click();
  await new Promise(r => setTimeout(r, 520));
  const reopened = { contextCollapsed: document.querySelector('[data-band="context"]').dataset.collapsed, hidden: document.querySelector('#labHeadStrip').hidden };
  return { before, folded, reopened };
});
check(strip.folded.hidden === false && /материал|абзац/.test(strip.folded.text) && !!strip.folded.label && strip.folded.follow === 'true',
  'folded margins put a truthful status line in the header (count, section, follow state)',
  JSON.stringify(strip.folded));
check(strip.reopened.contextCollapsed === 'false' && strip.reopened.hidden === true,
  'the status line is also the way back into the context band', JSON.stringify(strip.reopened));

const kb = await q.evaluate(async () => {
  const toggles = [...document.querySelectorAll('.lab-band__toggle')];
  toggles[0].focus();
  const seen = [];
  // ↑ from the first row must stay put, so the sequence is: ↓ ↓ ↑ ↑ End Home
  for (const key of ['ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowUp', 'End', 'Home']) {
    const ev = new KeyboardEvent('keydown', { key, bubbles: true });
    document.activeElement.dispatchEvent(ev);
    seen.push(document.activeElement.closest('.lab-band')?.dataset.band);
  }
  return seen;
});
check(kb.join(',') === 'brief,desk,brief,context,pinned,context',
  'band headers behave like an accordion for the keyboard (arrows, Home, End)', kb.join(' '));

const helpLegend = await q.evaluate(async () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: '?', shiftKey: true, bubbles: true }));
  await new Promise(r => setTimeout(r, 420));
  return { tools: document.querySelectorAll('.lab-help__tool').length, rows: document.querySelectorAll('.lab-help__row').length,
    hasAltQ: /Alt \+ Q|Alt/.test(document.querySelector('.lab-help').textContent) };
});
check(helpLegend.tools === 7 && helpLegend.rows >= 8 && helpLegend.hasAltQ,
  'the help sheet explains every glyph and the new keyboard shortcuts', JSON.stringify(helpLegend));

const coach = await q.evaluate(async () => {
  try { localStorage.removeItem('arena-study-lab:coach'); } catch (e) {}
  document.querySelector('#labRightClose').click();
  await new Promise(r => setTimeout(r, 320));
  return true;
});
await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(400);
const coachState = await q.evaluate(async () => {
  const el = document.querySelector('#labCoach');
  const first = { visible: !el.hidden, text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 40),
    fits: el.scrollWidth <= el.clientWidth + 1 };
  document.querySelector('#labCoachOk').click();
  await new Promise(r => setTimeout(r, 200));
  const closed = el.hidden;
  return { first, closed, stored: localStorage.getItem('arena-study-lab:coach') };
});
await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(350);
const coachAgain = await q.evaluate(() => document.querySelector('#labCoach').hidden);
check(coachState.first.visible && /Поля следуют/.test(coachState.first.text) && coachState.first.fits
  && coachState.closed && coachState.stored === '1' && coachAgain === true,
  'the margin explains its three gestures once on the first visit, then stays quiet', JSON.stringify({ ...coachState, coachAgain }));

const altQ = await q.evaluate(async () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', altKey: true, bubbles: true }));
  await new Promise(r => setTimeout(r, 520));
  const folded = document.body.dataset.labQuiet;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'q', altKey: true, bubbles: true }));
  await new Promise(r => setTimeout(r, 520));
  return { folded, unfolded: document.body.dataset.labQuiet };
});
check(altQ.folded === 'true' && altQ.unfolded === 'false', 'Alt + Q folds and unfolds the whole margin', JSON.stringify(altQ));

// ---------------------------------------------------------------- left rail TOC
log('\n== LEFT RAIL: SECTIONS AS ROWS, ONE UNFOLDED ==');
await q.evaluate(() => { try { localStorage.removeItem('arena-study-lab:toc'); } catch (e) {} });
await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(500);
const toc0 = await q.evaluate(() => {
  const rows = [...document.querySelectorAll('.lab-toc__row')];
  return {
    rows: rows.length,
    subs: rows.reduce((n, r) => n + r.querySelectorAll('.lab-toc__sub').length, 0),
    heights: rows.map(r => Math.round(r.getBoundingClientRect().height)),
    open: rows.filter(r => r.classList.contains('is-open')).map(r => r.dataset.tocRow),
    listH: Math.round(document.querySelector('#labToc').getBoundingClientRect().height),
    scrollH: Math.round(document.querySelector('#labTocScroll').getBoundingClientRect().height),
    count: document.querySelector('#labTocCount').textContent,
    nestedLeft: Math.round((document.querySelector('.lab-toc__sub a')?.getBoundingClientRect().left || 0)),
    dotLeft: Math.round((document.querySelector('.lab-toc__dot')?.getBoundingClientRect().left || 0)),
  };
});
check(toc0.rows === 5 && toc0.subs === 10 && toc0.open.length === 0,
  'the flat 15-item list became 5 section rows holding 10 real subsections', JSON.stringify(toc0));
check(toc0.listH < toc0.scrollH && toc0.heights.every(h => h <= 60),
  'the whole table of contents fits above the audio pill instead of scrolling', `${toc0.listH}/${toc0.scrollH} ${toc0.heights}`);
check(toc0.nestedLeft > toc0.dotLeft + 20 && /^\d+ \/ 5$/.test(toc0.count),
  'subsections are visibly nested and the counter counts sections, not headings', JSON.stringify({ n: toc0.nestedLeft, d: toc0.dotLeft, c: toc0.count }));

const tocFollow = await q.evaluate(async () => {
  const c = document.querySelector('#labCenter');
  const h = document.getElementById('sec-assessment');
  c.scrollTo({ top: h.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 80, behavior: 'instant' });
  await new Promise(r => setTimeout(r, 700));
  const row = document.querySelector('.lab-toc__row.is-current');
  return { current: row?.dataset.tocRow, open: [...document.querySelectorAll('.lab-toc__row.is-open')].map(r => r.dataset.tocRow),
    subCurrent: [...document.querySelectorAll('.lab-toc__sub.is-current a')].map(a => a.textContent.trim()).length,
    passed: document.querySelectorAll('.lab-toc__row.is-passed').length,
    count: document.querySelector('#labTocCount').textContent };
});
check(tocFollow.current === 'sec-explanation' && tocFollow.open.join() === 'sec-explanation' && tocFollow.passed >= 1,
  'the rail follows the reading position: current row highlighted, its subsections unfolded', JSON.stringify(tocFollow));

const tocQuiet = await q.evaluate(async () => {
  document.querySelector('#labLeftQuiet').click();
  await new Promise(r => setTimeout(r, 420));
  const quiet = {
    flag: document.documentElement.dataset.labToc,
    pressed: document.querySelector('#labLeftQuiet').getAttribute('aria-pressed'),
    labels: getComputedStyle(document.querySelector('.lab-toc__label')).display,
    search: getComputedStyle(document.querySelector('.lab-toc-search')).display,
    meta: getComputedStyle(document.querySelector('.hrail-meta')).display,
    rowH: Math.round(document.querySelector('.lab-toc__row').getBoundingClientRect().height),
    stored: localStorage.getItem('arena-study-lab:toc'),
    railW: Math.round(document.querySelector('#labLeft').getBoundingClientRect().width),
  };
  document.querySelector('#labLeftQuiet').click();
  await new Promise(r => setTimeout(r, 400));
  return { ...quiet, restored: document.documentElement.dataset.labToc };
});
check(tocQuiet.flag === 'quiet' && tocQuiet.pressed === 'true' && tocQuiet.meta === 'none'
  && tocQuiet.rowH <= 30 && !!tocQuiet.stored && tocQuiet.restored === 'full'
  && tocQuiet.labels !== 'none' && tocQuiet.search === 'none',
  'the quiet switch strips the rail to a calm reading index (names kept, search gone) and remembers it',
  JSON.stringify(tocQuiet));

const tocSearch = await q.evaluate(async () => {
  const input = document.querySelector('#labTocSearch');
  input.value = 'исключени';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 260));
  const hit = { rows: document.querySelectorAll('.lab-toc__row').length, subs: document.querySelectorAll('.lab-toc__sub').length,
    empty: document.querySelector('#labTocEmpty').hidden };
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise(r => setTimeout(r, 260));
  return { hit, back: document.querySelectorAll('.lab-toc__row').length };
});
check(tocSearch.hit.subs >= 2 && tocSearch.hit.empty === true && tocSearch.back === 5,
  'TOC search filters real headings and restores the full rail', JSON.stringify(tocSearch));

// ---------------------------------------------------------------- pinned memory
log('\n== PINNED SHELF: PERSISTED, PER EDITION, BATCH PIN ==');
// A short phone sheet still needs to show the active edition card above its
// pinned shelf; an empty shelf should teach its use without taking over the view.
await q.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
await q.evaluate(() => {
  localStorage.setItem('arena-study-lab:edition', JSON.stringify({ key: 'heart', item: 'krajne' }));
});
await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(450);
const mobileEdition = await q.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  document.querySelector('.lab-mobile-bar [data-action="study"]')?.click();
  await wait(350);
  document.querySelector('#labInstruments [data-mode="edition"]')?.click();
  await wait(500);
  const card = document.querySelector('.lab-ed-now')?.getBoundingClientRect();
  const scroll = document.querySelector('#labRightScroll')?.getBoundingClientRect();
  const shelf = document.querySelector('.lab-band--pinned')?.getBoundingClientRect();
  return { noHScroll: document.documentElement.scrollWidth <= innerWidth,
    cardVisible: !!(card && scroll && card.top >= scroll.top && card.bottom <= scroll.bottom),
    shelfHeight: shelf ? Math.round(shelf.height) : null,
    scTop: document.querySelector('#labRightScroll')?.scrollTop,
    bandTop: Math.round(document.querySelector('.lab-band--desk').getBoundingClientRect().top),
    right: (() => { const r = document.querySelector('.lab-right').getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), transform: getComputedStyle(document.querySelector('.lab-right')).transform }; })(),
    cardParent: document.querySelector('.lab-ed-now')?.parentElement?.className,
    card: card && { top: Math.round(card.top), bottom: Math.round(card.bottom) },
    scroll: scroll && { top: Math.round(scroll.top), bottom: Math.round(scroll.bottom) } };
});
check(mobileEdition.noHScroll && mobileEdition.cardVisible && mobileEdition.shelfHeight <= 145,
  'on a phone, the open-edition card fits above the empty pinned shelf without horizontal overflow', JSON.stringify(mobileEdition));

await q.click('.lab-mobile-bar [data-action="theme"]'); await wait(220);
await q.click('.lab-mobile-bar [data-action="theme"]'); await wait(220);
const mobileTheme = await q.evaluate(() => ({
  theme: document.documentElement.dataset.labTheme,
  right: document.querySelector('#labShell').dataset.right,
}));
check(mobileTheme.theme === 'dark' && mobileTheme.right === 'open',
  'the mobile theme control changes to night without the open sheet dismissing', JSON.stringify(mobileTheme));

await q.evaluate(() => { try { Object.keys(localStorage).filter(k => /pins|edition|theme/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) {} });
await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(500);
const pinFlow = await q.evaluate(async () => {
  const c = document.querySelector('#labCenter');
  const h = document.getElementById('sec-why');
  c.scrollTo({ top: h.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 40, behavior: 'instant' });
  await new Promise(r => setTimeout(r, 800));
  document.querySelector('#labInstruments [data-mode="section"]').click();
  await new Promise(r => setTimeout(r, 600));
  const batch = document.querySelector('[data-lab-action="pinall"]');
  const label = batch?.textContent.trim();
  batch?.click();
  await new Promise(r => setTimeout(r, 500));
  return {
    hasBatch: !!batch, label,
    pins: document.querySelectorAll('.lab-pin').length,
    count: document.querySelector('#labPinnedCount').textContent,
    stored: JSON.parse(localStorage.getItem('arena-study-lab:pins:article') || '[]').length,
    note: (document.querySelector('#labPinned')?.textContent || '').replace(/\s+/g, ' ').slice(0, 90),
  };
});
check(pinFlow.hasBatch && /Закрепить/.test(pinFlow.label) && pinFlow.pins >= 2 && pinFlow.pins === pinFlow.stored
  && new RegExp(`^${pinFlow.pins} / 8$`).test(pinFlow.count),
  'one button pins the whole apparatus of the section, and the shelf keeps every one',
  JSON.stringify(pinFlow));

await q.reload({ waitUntil: 'networkidle0' });
await q.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await wait(600);
const afterReload = await q.evaluate(() => ({
  pins: document.querySelectorAll('.lab-pin').length,
  count: document.querySelector('#labPinnedCount').textContent,
  labels: [...document.querySelectorAll('.lab-pin__label')].slice(0, 3).map(b => b.textContent),
}));
check(afterReload.pins === pinFlow.pins && afterReload.labels.length > 0,
  'the shelf survives a reload exactly as it was left', JSON.stringify(afterReload));

const perEdition = await q.evaluate(async () => {
  document.querySelector('#labSeriesChip').click();
  await new Promise(r => setTimeout(r, 240));
  document.querySelector('#labSeriesSwitch [data-lab-series="heart"]').click();
  await new Promise(r => setTimeout(r, 520));
  const heart = { pins: document.querySelectorAll('.lab-pin').length, note: (document.querySelector('#labPinned')?.textContent || '').replace(/\s+/g, ' ').slice(0, 60) };
  document.querySelector('#labSeriesSwitch [data-lab-series="article"]').click();
  await new Promise(r => setTimeout(r, 520));
  return { heart, back: document.querySelectorAll('.lab-pin').length, keys: Object.keys(localStorage).filter(k => /pins/.test(k)).sort() };
});
// one key per visited edition (the book gets its own, even while empty)
check(perEdition.heart.pins === 0 && perEdition.back === pinFlow.pins && perEdition.keys.includes('arena-study-lab:pins:article'),
  'each edition has its own shelf: switching to the book shows an empty one, coming back restores the article',
  JSON.stringify(perEdition));

const unpin = await q.evaluate(async () => {
  const before = document.querySelectorAll('.lab-pin').length;
  document.querySelector('[data-lab-action="unpin"]').click();
  await new Promise(r => setTimeout(r, 320));
  return { before, after: document.querySelectorAll('.lab-pin').length,
    stored: JSON.parse(localStorage.getItem('arena-study-lab:pins:article') || '[]').length };
});
check(unpin.after === unpin.before - 1 && unpin.stored === unpin.after,
  'unpinning updates the stored shelf immediately, not only the screen', JSON.stringify(unpin));

await q.evaluate(() => { try { Object.keys(localStorage).filter(k => /pins/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) {} });
await q.evaluate(() => { try { localStorage.removeItem('arena-study-lab:bands'); localStorage.removeItem('arena-study-lab:toc'); } catch (e) {} });
await q.close();

await browser.close();
log('\nTOTAL FAILURES: ' + failures);
fs.writeFileSync(OUT, lines.join('\n') + '\n');
console.log('report: ' + OUT);
