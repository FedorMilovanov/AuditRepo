/** Local browser capture + interaction smoke test. No external network. */
import { launch } from './browser.mjs';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:4321/';
const OUT = 'screenshots';
fs.mkdirSync(OUT, { recursive: true });
const browser = await launch();

const errors = [];
async function page(width, height) {
  const p = await browser.newPage();
  await p.setViewport({ width, height, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
  // Each capture starts from the intended light theme; explicit theme shots cycle it themselves.
  await p.evaluateOnNewDocument(() => { try { localStorage.removeItem('arena-study-lab:theme'); } catch (e) {} });
  p.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
  p.on('pageerror', e => errors.push('[pageerror] ' + e.message));
  p.on('requestfailed', r => { const u = r.url(); if (u.startsWith(BASE)) errors.push('[request] ' + u + ' ' + r.failure()?.errorText); });
  await p.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => document.documentElement.dataset.labReady === '1', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 700));
  return p;
}
const shot = async (p, name) => { await p.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name); };
const text = async (p, sel) => p.$eval(sel, e => e.textContent.trim().replace(/\s+/g, ' '));
const click = async (p, sel) => { await p.click(sel); await new Promise(r => setTimeout(r, 450)); };

// ------------------------------------------------------------------ desktop
let p = await page(1920, 1080);
await shot(p, '01-desktop-1920-light');

// hover a real scripture reference → tooltip
await p.hover('.article-body button.bref[data-ref="2 Тимофею 2:14–15"]');
await new Promise(r => setTimeout(r, 350));
console.log('tooltip visible:', await p.$eval('#labTip', e => !e.hidden && e.dataset.visible === 'true'));
await shot(p, '02-hover-verse-tooltip');

// click it → full passage on the right
await click(p, '.article-body button.bref[data-ref="2 Тимофею 2:14–15"]');
console.log('desk:', await text(p, '#labDeskLabel'), '|', (await text(p, '.lab-desk__title')));
console.log('trail items:', await p.$$eval('.lab-trail__item', n => n.length));
await shot(p, '03-verse-open');

// expand real neighbouring verses
const ctxToggle = await p.$('[data-lab-action="context-toggle"]');
if (ctxToggle) { await ctxToggle.click(); await new Promise(r => setTimeout(r, 300)); }
console.log('context verses:', await p.$$eval('.lab-ctxverses p', n => n.length));
await shot(p, '04-verse-context-expanded');

// pin, then open a term and pin it too
await click(p, '[data-lab-action="pin"]');
console.log('pinned count:', await text(p, '#labPinnedCount'));
const term = await p.$('.article-body button.lab-term');
if (term) { await term.click(); await new Promise(r => setTimeout(r, 400)); }
console.log('term desk:', await text(p, '#labDeskLabel'), '|', await text(p, '.lab-desk__title'));
await click(p, '[data-lab-action="pin"]');
await shot(p, '05-term-and-pinned');

// comparison mode, graph, index, thread
await click(p, '[data-mode="compare"]');
await shot(p, '06-compare');
await click(p, '[data-mode="graph"]');
await shot(p, '07-concept-graph');
await click(p, '[data-mode="index"]');
await p.type('#labIndexInput', 'Луки 24');
await new Promise(r => setTimeout(r, 350));
console.log('index results:', await p.$$eval('.lab-result', n => n.length));
await shot(p, '08-index-search');

// theme cycle + dark desktop
await click(p, '#labThemeRight'); await click(p, '#labThemeRight');
console.log('theme:', await p.evaluate(() => document.documentElement.dataset.labTheme));
await click(p, '[data-mode="thread"]');
await shot(p, '09-desktop-1920-dark');

// collapse right panel and left panel independently
await click(p, '#labRightClose');
console.log('right closed:', await p.$eval('#labShell', e => e.dataset.right));
await shot(p, '10-right-collapsed');
await click(p, '#labRightRestore');
await click(p, '#labLeftCollapse');
console.log('left closed:', await p.$eval('#labShell', e => e.dataset.left));
await shot(p, '11-left-collapsed');

// laptop
await p.close();
p = await page(1440, 900);
await shot(p, '12-laptop-1440-light');
await click(p, '[data-mode="thread"]');
await p.evaluate(() => document.querySelector('#labCenter').scrollTo({ top: 3200, behavior: 'instant' }));
await new Promise(r => setTimeout(r, 700));
console.log('section after scroll:', await text(p, '#labCurrentSection'));
await shot(p, '13-laptop-scrolled-autofollow');
await p.close();

// 1280 / 1024
for (const [w, h, name] of [[1280, 860, '14-1280'], [1024, 820, '15-1024']]) {
  const q = await page(w, h);
  console.log(name, 'hScroll:', await q.evaluate(() => document.documentElement.scrollWidth > window.innerWidth));
  await shot(q, name);
  await q.close();
}

// tablet: right panel as drawer
p = await page(768, 1024);
console.log('768 right initially:', await p.$eval('#labShell', e => e.dataset.right));
await click(p, '.lab-mobile-bar [data-action="study"]');
await p.$eval('.article-body button.bref', e => e.click());
await new Promise(r => setTimeout(r, 500));
await shot(p, '16-tablet-768-drawer');
console.log('768 hScroll:', await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth));
await p.close();

// mobile: bottom sheet + sepia / dark
p = await page(390, 844);
await shot(p, '17-mobile-390-article');
await click(p, '.lab-mobile-bar [data-action="study"]');
await p.$eval('.article-body button.bref', e => e.click());
await new Promise(r => setTimeout(r, 500));
await shot(p, '18-mobile-390-sheet');
await click(p, '.lab-mobile-bar [data-action="theme"]');
await shot(p, '19-mobile-390-sheet-sepia');
await click(p, '.lab-mobile-bar [data-action="theme"]');
await shot(p, '20-mobile-390-sheet-dark');
console.log('390 hScroll:', await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth));
await p.close();

// ------------------------------------------------------------ continuation: original-SVG controls + real footnotes
p = await page(1600, 1000);
await click(p, '#labRate');
console.log('bloom pill:', await p.$eval('#labRatePop', e => e.classList.contains('is-open')));
await shot(p, '22-desktop-speed-pill');
await click(p, '#labRate');
await click(p, '[data-mode="notes"]');
await p.type('#labNotesInput', 'Hirsch');
await new Promise(r => setTimeout(r, 400));
console.log('note rows:', await p.$$eval('.lab-note-row', n => n.length));
await shot(p, '23-desktop-notes-desk');
await p.$eval('.lab-note-row', e => e.click());
await new Promise(r => setTimeout(r, 500));
console.log('note opened:', await text(p, '#labDeskLabel'));
await shot(p, '24-desktop-note-verbatim');
await p.evaluate(() => { const a = [...document.querySelectorAll('#labToc a')].find(x => /Оценка христоцентричной/.test(x.textContent)); a?.click(); });
await new Promise(r => setTimeout(r, 1200));
await click(p, '[data-mode="section"]');
console.log('section stats:', await p.$$eval('.lab-desk__stats b', n => n.map(e => e.textContent).join('/')));
await shot(p, '25-desktop-section-overview');
await p.keyboard.press('?');
await new Promise(r => setTimeout(r, 500));
await shot(p, '26-desktop-help');
await p.close();

// ------------------------------------------------------------ article / series / book
p = await page(1600, 1000);
await p.evaluate(() => document.querySelector('#labInstruments [data-mode="edition"]').click());
await new Promise(r => setTimeout(r, 700));
console.log('edition cards:', await p.$$eval('.lab-ed-card', n => n.length));
await shot(p, '27-edition-article');
await p.evaluate(() => document.querySelector('#labSeriesChip').click());
await p.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="heart"]').click());
await new Promise(r => setTimeout(r, 700));
console.log('book chip:', await text(p, '#labSeriesChipText'));
await shot(p, '28-edition-book-switcher');
await p.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="baptisty"]').click());
await new Promise(r => setTimeout(r, 600));
console.log('series theme:', await p.evaluate(() => document.body.dataset.labSeriesTheme));
await shot(p, '29-edition-samizdat-margins');
await p.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="article"]').click());
await p.close();

// ---------------------------------------------------------------- band accordion
p = await page(1600, 1000);
await p.evaluate(() => { try { localStorage.removeItem('arena-study-lab:bands'); } catch (e) {} });
await p.evaluate(() => { document.querySelector('#labQuiet').click(); });
await new Promise(r => setTimeout(r, 3600)); // wait out the toast, keep it out of the frame
console.log('folded rows:', await p.$$eval('.lab-band:not(.lab-band--pinned)', ns => ns.map(n => Math.round(n.getBoundingClientRect().height)).join('/')));
await shot(p, '30-bands-folded');
await p.evaluate(() => document.querySelector('[data-band="desk"] .lab-band__toggle').click());
await new Promise(r => setTimeout(r, 3600)); // let the "свёрнуто" toast fade out of the shot
await shot(p, '31-band-desk-open');
await p.close();

// ------------------------------------------------- first visit + learning surface
p = await page(1600, 1000);
await p.evaluate(() => { try { localStorage.removeItem('arena-study-lab:coach'); } catch (e) {} });
await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await new Promise(r => setTimeout(r, 800));
console.log('coach visible:', await p.$eval('#labCoach', e => !e.hidden));
await shot(p, '32-first-visit-coach');
await p.evaluate(() => document.querySelector('#labCoachMore').click());
await new Promise(r => setTimeout(r, 800));
// bring the glyph legend into the frame: that is the point of this figure
await p.evaluate(() => { const sc = document.querySelector('#labRightScroll'); sc.scrollTop = 430; });
await new Promise(r => setTimeout(r, 400));
await shot(p, '33-help-legend');
await p.close();

// ------------------------------------------------------------- left rail + memory
p = await page(1600, 1000);
await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await new Promise(r => setTimeout(r, 600));
console.log('toc rows:', await p.$$eval('.lab-toc__row', n => n.length),
  '| subs:', await p.$$eval('.lab-toc__sub', n => n.length));
await shot(p, '34-toc-sections-as-rows');
await p.evaluate(() => { const c = document.querySelector('#labCenter'); const h = document.getElementById('sec-assessment'); c.scrollTo({ top: h.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 40, behavior: 'instant' }); });
await new Promise(r => setTimeout(r, 900));
await shot(p, '35-toc-follows-reading');
await p.evaluate(() => document.querySelector('#labLeftQuiet').click());
await new Promise(r => setTimeout(r, 700));
await shot(p, '36-toc-quiet-rail');
await p.evaluate(() => document.querySelector('#labLeftQuiet').click());
await new Promise(r => setTimeout(r, 500));
// memory: open the overview of the section being read, pin its whole apparatus
await p.evaluate(() => document.querySelector('#labInstruments [data-mode="section"]').click());
await new Promise(r => setTimeout(r, 700));
await p.evaluate(() => document.querySelector('[data-lab-action="pinall"]')?.click());
await new Promise(r => setTimeout(r, 600));
console.log('pins before reload:', await p.$$eval('.lab-pin', n => n.length));
await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await new Promise(r => setTimeout(r, 700));
console.log('pins after reload:', await p.$$eval('.lab-pin', n => n.length));
await shot(p, '37-pins-survive-reload');
await p.close();

// ------------------------------------------------------ compare: the whole shelf
p = await page(1600, 1000);
await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await new Promise(r => setTimeout(r, 600));
await p.evaluate(() => { const c = document.querySelector('#labCenter'); const h = document.getElementById('sec-why'); c.scrollTo({ top: h.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 40, behavior: 'instant' }); });
await new Promise(r => setTimeout(r, 700));
await p.evaluate(() => document.querySelector('#labInstruments [data-mode="section"]').click());
await new Promise(r => setTimeout(r, 600));
await p.evaluate(() => document.querySelector('[data-lab-action="pinall"]')?.click());
await new Promise(r => setTimeout(r, 400));
await p.evaluate(() => document.querySelector('#labInstruments [data-mode="compare"]').click());
await new Promise(r => setTimeout(r, 900));
await shot(p, '38-compare-whole-shelf');
await p.evaluate(() => { document.querySelector('.lab-pairbox').open = true; document.querySelector('.lab-right-scroll').scrollTop = 520; });
await new Promise(r => setTimeout(r, 500));
await shot(p, '39-compare-manual-pair');
await p.close();

// ------------------------------------------------------------ series: real parts
p = await page(1600, 1000);
await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await new Promise(r => setTimeout(r, 600));
await p.evaluate(() => document.querySelector('#labSeriesChip').click());
await new Promise(r => setTimeout(r, 220));
await p.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="heart"]').click());
await new Promise(r => setTimeout(r, 700));
await shot(p, '40-book-form-headline');
await p.evaluate(() => document.querySelector('#labInstruments [data-mode="edition"]').click());
await new Promise(r => setTimeout(r, 700));
await shot(p, '41-book-parts-picker');
await p.evaluate(() => document.querySelectorAll('.lab-ed-part')[4]?.click());
await new Promise(r => setTimeout(r, 600));
await shot(p, '42-book-part-chosen');
await p.evaluate(() => { document.querySelector('#labSeriesChip').click(); });
await new Promise(r => setTimeout(r, 200));
await p.evaluate(() => document.querySelector('#labSeriesSwitch [data-lab-series="article"]').click());
await new Promise(r => setTimeout(r, 500));
await p.close();

// ------------------------------------------------ mobile: edition card + compact empty shelf
p = await page(390, 844);
await p.evaluate(() => {
  try { localStorage.clear(); localStorage.setItem('arena-study-lab:edition', JSON.stringify({ key: 'heart', item: 'krajne' })); } catch (e) {}
});
await p.reload({ waitUntil: 'networkidle0' });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1');
await new Promise(r => setTimeout(r, 500));
await p.click('.lab-mobile-bar [data-action="study"]');
await new Promise(r => setTimeout(r, 400));
await p.click('#labInstruments [data-mode="edition"]');
await new Promise(r => setTimeout(r, 800));
await shot(p, '43-mobile-edition-card');
await p.close();

// sepia desktop
p = await page(1600, 1000);
await click(p, '#labThemeRight');
await click(p, '[data-lab-action="openterm"]').catch(() => {});
await shot(p, '21-desktop-sepia');
await p.close();

await browser.close();
console.log('\nERRORS (' + errors.length + '):');
errors.slice(0, 30).forEach(e => console.log('  ' + e));
fs.writeFileSync('screenshots/console-errors.txt', errors.join('\n') || 'none');
