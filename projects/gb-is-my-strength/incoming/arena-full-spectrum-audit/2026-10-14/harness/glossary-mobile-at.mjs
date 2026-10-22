// glossary-mobile-at.mjs — closes the "unchecked" item from continuation 5:
// is the glossary definition announced with its trigger on a 390 px touch device?
//
// Tested for both marker shapes: a keyed marker (dictionary term) and a keyless
// authored one (historical document, e.g. «Братский листок»). Method: touch tap,
// keyboard focus and CDP Accessibility.getFullAXTree, comparing the trigger's
// accessible name/description against the actual definition text.
//
// Usage: node glossary-mobile-at.mjs        (needs :8099 serving /home/user/gbs-src/dist)
// Output: /home/user/arena-harness/out/glossary-mobile-at.json
import { chromium } from 'playwright-core';
import { writeFileSync } from 'fs';

const EXE = '/tmp/gbchrome/chrome.sh', BASE = 'http://127.0.0.1:8099';
const CASES = [
  { route: '/baptisty-rossii/podpolnaya-pechat/', marker: 'keyless', text: 'Братский листок' },
  { route: '/articles/krajne-li-isporcheno-serdce/', marker: 'keyed', text: 'Кархемише' },
];

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const out = {};
for (const c of CASES) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 110)); });
  await p.goto(BASE + c.route, { waitUntil: 'load' });
  await p.waitForTimeout(1800);

  const idx = await p.evaluate((t) => [...document.querySelectorAll('.gterm')]
    .findIndex(g => g.textContent.trim().startsWith(t)), c.text);
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Accessibility.enable');
  const readAx = async () => {
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const btn = nodes.find(n => n.role?.value === 'button' && (n.name?.value || '').startsWith(c.text.slice(0, 14)));
    const def = nodes.filter(n => n.role?.value === 'StaticText' && /—|информационный|Битва|движение|термин/.test(n.name?.value || '')).slice(0, 2);
    return { trigger: btn ? { name: (btn.name.value || '').slice(0, 60), desc: (btn.description?.value || '').slice(0, 80), expanded: (btn.properties || []).find(x => x.name === 'expanded')?.value?.value ?? null } : null,
             definitionNodes: def.map(n => (n.name.value || '').slice(0, 60)) };
  };

  await p.evaluate((i) => document.querySelectorAll('.gterm')[i].focus(), idx);
  await p.waitForTimeout(700);
  const onFocus = await readAx();
  const domAfterFocus = await p.evaluate((i) => {
    const g = document.querySelectorAll('.gterm')[i];
    const tip = document.querySelector('body > .gb-floating-tip');
    return { describedby: g.getAttribute('aria-describedby'), expanded: g.getAttribute('aria-expanded'),
             tipInBody: !!tip, tipText: tip ? tip.innerText.trim().slice(0, 70) : null };
  }, idx);

  const el = p.locator('.gterm').nth(idx);
  await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  const box = await el.boundingBox();
  await p.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await p.waitForTimeout(800);
  const onTap = await p.evaluate(() => {
    const tip = document.querySelector('body > .gb-floating-tip');
    if (!tip) return { tipInBody: false };
    const r = tip.getBoundingClientRect();
    return { tipInBody: true, box: [Math.round(r.width), Math.round(r.height)], top: Math.round(r.top),
             text: tip.innerText.trim().slice(0, 70) };
  });
  const afterTapAx = await readAx();

  out[c.route + ' ' + c.marker] = { text: c.text, found: idx >= 0, onFocus, domAfterFocus, onTap, afterTapAx, consoleErrors: errs.slice(0, 3) };
  await ctx.close();
}
await b.close();
writeFileSync('/home/user/arena-harness/out/glossary-mobile-at.json', JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) {
  console.log('===', k, '| найден:', v.found);
  console.log('  focus: trigger=', JSON.stringify(v.onFocus.trigger), '\n         dom:', JSON.stringify(v.domAfterFocus));
  console.log('  tap  :', JSON.stringify(v.onTap));
  console.log('  определения отдельными узлами:', JSON.stringify(v.onFocus.definitionNodes));
}
