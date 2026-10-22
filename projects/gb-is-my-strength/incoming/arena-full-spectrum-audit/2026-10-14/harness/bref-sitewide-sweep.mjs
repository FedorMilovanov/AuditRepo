// bref-sitewide-sweep.mjs — every Bible-reference button on the built site: what does its
// tooltip actually contain?
//
// For each page that carries .bref: counts the buttons, reads the projection the page
// received (window.SCRIPTURE_DATA), opens one tooltip through the element's own handler and
// records the painted text, plus the trigger's ARIA state after opening.
//
// Usage: node bref-sitewide-sweep.mjs    (needs :8099 serving /home/user/gbs-src/dist)
// Output: /home/user/arena-harness/out/bref-sitewide.json
import { chromium } from 'playwright-core';
import { writeFileSync } from 'fs';

const EXE = '/tmp/gbchrome/chrome.sh', BASE = 'http://127.0.0.1:8099';
const ROUTES = [
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/articles/kod-da-vinchi/',
  '/articles/krajne-li-isporcheno-serdce/',
  '/articles/podrostok-za-kadrom-chto-delat-tserkvi/',
  '/articles/podrostok-za-kadrom-dvoynaya-zhizn/',
  '/articles/podrostok-za-kadrom-roditelyam-posle-razoblacheniya/',
  '/articles/vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti/',
  '/articles/vzroslyy-rebenok-doma-dengi-pomoshch-posledstviya/',
  '/articles/vzroslyy-rebenok-ushel-kontakt-pokayanie-vozvrashchenie/',
  '/articles/sovershennoletie-roditelskaya-vlast-chto-menyaetsya/',
];

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const rows = [];
let shotDone = false;
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 110)); });
  await p.goto(BASE + route, { waitUntil: 'load' });
  await p.waitForTimeout(1400);
  const counts = await p.evaluate(() => ({
    buttons: document.querySelectorAll('.bref[data-ref]').length,
    tipsPresentAfterLoad: document.querySelectorAll('.bref .btip').length,   // создаются рантаймом при загрузке; в исходном HTML их нет
    projectionKeys: Object.keys(window.SCRIPTURE_DATA || {}).length,
    hasGlobal: !!window.SCRIPTURE_DATA,
  }));
  const first = await p.evaluate(() => {
    const el = document.querySelector('.bref[data-ref]');
    return el ? { ref: el.dataset.ref, visible: el.textContent.trim() } : null;
  });
  let tip = null, aria = null;
  if (first) {
    await p.evaluate(() => { const el = document.querySelector('.bref[data-ref]'); el.focus(); el.click(); });
    await p.waitForTimeout(500);
    tip = await p.evaluate(() => {
      const t = document.querySelector('body > .btip') || document.querySelector('.bref .btip');
      if (!t) return { open: false };
      const r = t.getBoundingClientRect();
      return { open: true, box: [Math.round(r.width), Math.round(r.height)],
               text: t.innerText.trim().replace(/\s+/g, ' ').slice(0, 160) };
    });
    aria = await p.evaluate(() => {
      const el = document.querySelector('.bref[data-ref]');
      return { describedby: el.getAttribute('aria-describedby'), expanded: el.getAttribute('aria-expanded') };
    });
    if (!shotDone && tip?.open) {
      const box = await p.evaluate(() => {
        const t = document.querySelector('body > .btip');
        const r = t.getBoundingClientRect();
        return { x: Math.max(0, r.x - 6), y: Math.max(0, r.y - 6), width: Math.min(r.width + 12, 1400), height: r.height + 12 };
      });
      await p.screenshot({ path: '/home/user/arena-harness/out/bref-placeholder.png', clip: box });
      shotDone = true;
    }
  }
  rows.push({ route, ...counts, first, tip, aria, consoleErrors: errs.slice(0, 2) });
  await p.close();
}
await b.close();
const tot = rows.reduce((a, r) => ({ b: a.b + r.buttons, t: a.t + r.tipsPresentAfterLoad, ph: a.ph + (r.tip?.open && /Ссылка на указанное место/.test(r.tip.text || '') ? 1 : 0) }), { b: 0, t: 0, ph: 0 });
writeFileSync('/home/user/arena-harness/out/bref-sitewide.json', JSON.stringify({ rows, totals: tot }, null, 1));
console.log(`страниц: ${rows.length} | всего кнопок .bref: ${tot.b} | с готовым .btip в HTML: ${tot.t} | показали заглушку: ${tot.ph}`);
for (const r of rows) {
  console.log("  " + String(r.buttons).padStart(3) + " кнопок | проекция: " + r.projectionKeys + " ключей | первая: " + (r.first ? r.first.ref : "-") + " -> " + JSON.stringify(r.tip ? r.tip.text : null).slice(0, 90) + " | describedby=" + (r.aria ? r.aria.describedby : null) + " expanded=" + (r.aria ? r.aria.expanded : null));
}
