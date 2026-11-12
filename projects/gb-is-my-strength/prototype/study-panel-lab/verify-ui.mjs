/** Continuation smoke: original SVG/CSS wiring + new real-text instruments. */
import { launch } from './browser.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:4321/';
const browser = await launch();
const errors = [];
const p = await browser.newPage();
await p.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
await p.evaluateOnNewDocument(() => { try { localStorage.removeItem('arena-study-lab:theme'); } catch (e) {} });
p.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
p.on('pageerror', e => errors.push('[pageerror] ' + e.message));
p.on('request', r => { if (!r.url().startsWith(BASE) && !r.url().startsWith('data:')) errors.push('[external] ' + r.url()); });
await p.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
await p.waitForFunction(() => document.documentElement.dataset.labReady === '1', { timeout: 20000 });
await new Promise(r => setTimeout(r, 500));
const wait = (ms = 300) => new Promise(r => setTimeout(r, ms));
const j = (label, v) => console.log(label + ':', JSON.stringify(v));

j('ready/theme', await p.evaluate(() => document.documentElement.dataset.labTheme));
j('original markup', await p.evaluate(() => ({
  ember: !!document.querySelector('#labPlay.gb-ember'),
  ring: document.querySelectorAll('#labPlay .gb-ember__ring-svg circle').length,
  glyphs: document.querySelectorAll('#labPlay > svg').length,
  sunMoon: document.querySelectorAll('.gb-theme-toggle .theme-icon-sun, .gb-theme-toggle .theme-icon-moon').length,
  toggles: document.querySelectorAll('.gb-theme-toggle').length,
  pill: document.querySelectorAll('#labRatePop.gb-ember-expand .gb-ember-expand__btn').length,
  hrailButtons: document.querySelectorAll('.hrail-bottom-btn').length,
  back: document.querySelector('#labBack svg path')?.getAttribute('d'),
  menu: document.querySelector('#labLeftCollapse svg path')?.getAttribute('d'),
  pdf: document.querySelector('#labPrintBtn svg polyline')?.getAttribute('points'),
})));
j('original CSS active', await p.evaluate(() => {
  const e = document.querySelector('#labPlay');
  const t = document.querySelector('#labThemeRight');
  return {
    emberW: getComputedStyle(e).width,
    ringOpacity: getComputedStyle(document.querySelector('#labPlay .gb-ember__ring-svg')).opacity,
    ringDash: getComputedStyle(document.querySelector('#labPlay .gb-ember__ring-progress')).strokeDasharray,
    themeOverflow: getComputedStyle(t).overflow,
    moonOpacity: getComputedStyle(document.querySelector('#labThemeRight .theme-icon-moon')).opacity,
    pillVisibility: getComputedStyle(document.querySelector('#labRatePop')).visibility,
  };
}));
j('notes built', await p.evaluate(() => ({
  total: window.__labProbe ? window.__labProbe : null,
  brief: document.querySelector('#labBriefMeta')?.textContent,
  apparatus: document.querySelector('#labApparatusNote')?.textContent.slice(0, 120),
  briefStats: document.querySelectorAll('.lab-brief__stats button').length,
  readPct: document.querySelector('#labReadPct')?.textContent,
})));

// theme morph
await p.click('#labThemeRight'); await p.click('#labThemeRight'); await wait();
j('dark morph', await p.evaluate(() => ({
  theme: document.documentElement.dataset.labTheme,
  sun: getComputedStyle(document.querySelector('#labThemeRight .theme-icon-sun')).opacity,
  moon: getComputedStyle(document.querySelector('#labThemeRight .theme-icon-moon')).opacity,
  emberColor: getComputedStyle(document.querySelector('#labPlay')).color,
})));
await p.click('#labThemeRight'); await wait();

// speed pill
await p.click('#labRate'); await wait();
j('pill open', await p.evaluate(() => ({
  cls: document.querySelector('#labRatePop').className,
  vis: getComputedStyle(document.querySelector('#labRatePop')).visibility,
  expanded: document.querySelector('#labPlay').getAttribute('aria-expanded'),
  hScroll: document.documentElement.scrollWidth > innerWidth,
})));
await p.click('#labRatePop button[data-rate="1.5"]'); await wait();
j('rate', await p.evaluate(() => ({ label: document.querySelector('#labRate').textContent, active: document.querySelector('#labRatePop .is-active')?.dataset.rate })));

// TOC search
await p.type('#labTocSearch', 'Заключение'); await wait();
j('toc filter', await p.evaluate(() => ({
  visible: [...document.querySelectorAll('#labToc li:not(.hrail-track-slot)')].filter(li => li.style.display !== 'none').length,
  empty: document.querySelector('#labTocEmpty').hidden,
})));
await p.$eval('#labTocSearch', e => { e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); }); await wait();

// section overview
await p.click('[data-mode="section"]'); await wait();
j('section mode', await p.evaluate(() => ({
  label: document.querySelector('#labDeskLabel').textContent,
  title: document.querySelector('.lab-desk__title')?.textContent,
  stats: [...document.querySelectorAll('.lab-desk__stats b')].map(e => e.textContent),
  chips: document.querySelectorAll('.lab-desk .lab-chip').length,
})));

// notes list + open a note
await p.click('[data-mode="notes"]'); await wait();
j('notes mode', await p.evaluate(() => ({
  label: document.querySelector('#labDeskLabel').textContent,
  rows: document.querySelectorAll('.lab-note-row').length,
  input: !!document.querySelector('#labNotesInput'),
})));
await p.type('#labNotesInput', 'Hirsch'); await wait();
j('notes search', await p.evaluate(() => ({ rows: document.querySelectorAll('.lab-note-row').length, first: document.querySelector('.lab-note-row__text')?.textContent.slice(0, 70) })));
const row = await p.$('.lab-note-row');
if (row) { await row.click(); await wait(); }
j('note mode', await p.evaluate(() => ({
  label: document.querySelector('#labDeskLabel').textContent,
  title: document.querySelector('.lab-desk__title')?.textContent,
  body: document.querySelector('.lab-verse')?.textContent.slice(0, 80),
  source: document.querySelector('.lab-source')?.textContent.slice(0, 80),
})));

// help keyboard
await p.keyboard.press('Escape'); await wait();
await p.keyboard.press('?'); await wait();
j('help mode', await p.evaluate(() => ({ label: document.querySelector('#labDeskLabel').textContent, rows: document.querySelectorAll('.lab-help__row').length })));

// index notes group
await p.keyboard.press('/'); await wait();
j('index groups', await p.evaluate(() => ({ subs: [...document.querySelectorAll('.lab-results .lab-sub')].map(e => e.textContent.trim()), results: document.querySelectorAll('.lab-result').length })));
await p.keyboard.press('Escape'); await wait();

// context footnote rows at a paragraph with fn-marker
await p.evaluate(() => {
  const m = document.querySelector('.article-body .fn-marker');
  const el = m?.closest('p') || document.querySelector('.article-body p');
  document.querySelector('#labCenter').scrollTo({ top: el.getBoundingClientRect().top - document.querySelector('#labCenter').getBoundingClientRect().top + document.querySelector('#labCenter').scrollTop - 120, behavior: 'instant' });
});
await wait(700);
j('context', await p.evaluate(() => ({
  meta: document.querySelector('#labContextMeta').textContent,
  noteRows: document.querySelectorAll('.lab-ctx-row[data-type="note"]').length,
  counts: document.querySelector('.lab-ctx-counts')?.textContent,
  section: document.querySelector('#labCurrentSection').textContent,
  brief: document.querySelector('#labBriefMeta').textContent,
})));

// widths
for (const w of [1920, 1440, 1280, 1200, 1024, 768, 390]) {
  await p.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
  await wait(250);
  j('width ' + w, await p.evaluate(() => ({
    hScroll: document.documentElement.scrollWidth > innerWidth,
    sw: document.documentElement.scrollWidth,
    iw: innerWidth,
  })));
}
await browser.close();
console.log('\nERRORS (' + errors.length + ')');
errors.slice(0, 30).forEach(e => console.log('  ' + e));
