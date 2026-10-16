// bref-tooltip-live.mjs — what does a reader actually see in a Bible-reference tooltip?
//
// The runtime builds the tip client-side (createScriptureTip) and looks the verse up in
// window.SCRIPTURE_DATA, falling back to a placeholder sentence when the lookup misses.
// This probe opens the tip on the live page and reads the painted text. It opens the tip
// through the element's own click handler (dispatch), so a probe-side geometry problem
// cannot silently turn into a false "does not work" claim, and it separately reports what
// element actually sits on top of each reference at its centre point.
//
// Usage: node bref-tooltip-live.mjs     (needs :8099 serving /home/user/gbs-src/dist)
// Output: /home/user/arena-harness/out/bref-tooltip-live.json
import { chromium } from 'playwright-core';
import { writeFileSync } from 'fs';

const EXE = '/tmp/gbchrome/chrome.sh', BASE = 'http://127.0.0.1:8099';
const CASES = [
  { route: '/articles/krajne-li-isporcheno-serdce/', ref: 'Иезекииль 36:26', note: 'book corpus file empty (synodal/iizikil.json, 0 bytes)' },
  { route: '/articles/krajne-li-isporcheno-serdce/', ref: 'Иеремия 17:5–10', note: 'book corpus populated' },
  { route: '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/', ref: '1 Коринфянам 10:6', note: 'book corpus populated' },
  { route: '/articles/kod-da-vinchi/', ref: 'Луки 1:1–4', note: 'book corpus populated' },
];

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const out = {};
for (const c of CASES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  await p.goto(BASE + c.route, { waitUntil: 'load' });
  await p.waitForTimeout(1500);

  const info = await p.evaluate((ref) => {
    const el = document.querySelector(`.bref[data-ref="${ref}"]`);
    if (!el) return { found: false };
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    return {
      found: true,
      projectionKeys: Object.keys(window.SCRIPTURE_DATA || {}).length,
      hasScriptureDataGlobal: !!window.SCRIPTURE_DATA,
      lookupValue: (window.SCRIPTURE_DATA || {})[ref] || null,
      rect: [Math.round(r.width), Math.round(r.height), Math.round(r.top)],
      topElementAtCentre: top ? top.tagName + '.' + String(top.className || '').split(' ')[0] + (top === el || el.contains(top) ? ' (это сам .bref)' : ' ← ДРУГОЙ ЭЛЕМЕНТ НАД .bref') : null,
    };
  }, c.ref);

  // open through the element's own handler
  const opened = await p.evaluate((ref) => {
    const el = document.querySelector(`.bref[data-ref="${ref}"]`);
    el.focus(); el.click();
    return true;
  }, c.ref);
  await p.waitForTimeout(600);

  const tip = await p.evaluate(() => {
    const t = document.querySelector('body > .btip') || document.querySelector('.bref .btip');
    if (!t) return { open: false };
    const r = t.getBoundingClientRect();
    const cs = getComputedStyle(t);
    return { open: true, cls: t.className, generated: t.dataset.generatedScriptureTip || null,
             box: [Math.round(r.width), Math.round(r.height)], display: cs.display, visibility: cs.visibility,
             visibleText: t.innerText.trim().replace(/\s+/g, ' ').slice(0, 300) };
  });
  const ariaState = await p.evaluate((ref) => {
    const el = document.querySelector(`.bref[data-ref="${ref}"]`);
    return { describedby: el.getAttribute('aria-describedby'), expanded: el.getAttribute('aria-expanded'), role: el.getAttribute('role') };
  }, c.ref);

  let shot = null;
  if (tip.open) {
    const box = await p.evaluate(() => {
      const t = document.querySelector('body > .btip') || document.querySelector('.bref .btip');
      const r = t.getBoundingClientRect();
      return { x: Math.max(0, r.x - 6), y: Math.max(0, r.y - 6), width: Math.min(r.width + 12, 1400), height: r.height + 12 };
    });
    const name = c.ref.replace(/[^A-Za-zА-Яа-я0-9]/g, '_');
    await p.screenshot({ path: `/home/user/arena-harness/out/bref-${name}.png`, clip: box });
    shot = `bref-${name}.png`;
  }
  out[c.ref] = { route: c.route, note: c.note, info, opened, tip, ariaState, screenshot: shot, consoleErrors: errs.slice(0, 3) };
  await p.close();
}
await b.close();
writeFileSync('/home/user/arena-harness/out/bref-tooltip-live.json', JSON.stringify(out, null, 1));
for (const [ref, v] of Object.entries(out)) {
  console.log('===', ref, '—', v.note);
  console.log('   найдена:', v.info.found, '| ключей проекции:', v.info.projectionKeys, '| значение по data-ref:', JSON.stringify(v.info.lookupValue));
  console.log('   элемент под центром:', v.info.topElementAtCentre);
  console.log('   тултип:', JSON.stringify(v.tip));
  console.log('   aria:', JSON.stringify(v.ariaState));
}
