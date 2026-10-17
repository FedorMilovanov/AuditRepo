import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const EXEC = process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh';
const AXE = readFileSync(process.env.AXE || './axe.min.js', 'utf8');
const b = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
// (1) герой-поиск на главной: детали label-content-name-mismatch
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'light', locale: 'ru-RU' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8099/', { waitUntil: 'load' });
  await p.waitForTimeout(3000);
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ['label-content-name-mismatch'] });
    const v = res.violations[0];
    const bar = document.querySelector('#heroSearchBar');
    return { count: v ? v.nodes.length : 0, nodes: v ? v.nodes.map(n => ({ target: n.target.join(' '), html: (n.html || '').slice(0, 200), msg: (n.any?.[0]?.message || '').slice(0, 200) })) : [],
      heroSearch: bar ? { tag: bar.tagName, type: bar.getAttribute('type'), ariaLabel: bar.getAttribute('aria-label'), placeholder: bar.getAttribute('placeholder'), visibleText: (bar.value || ''), id: bar.id, outer: bar.outerHTML.slice(0, 300) } : null };
  });
  console.log('=== герой-поиск (главная, 390px) ===');
  console.log(JSON.stringify(r, null, 1));
  await ctx.close();
}
// (2) genesis-6: наложение крошек и бренда, точные прямоугольники + проверка попадания клика
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'light', locale: 'ru-RU' });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8099/hard-texts/genesis-6/', { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const R = el => { const x = el.getBoundingClientRect(); return { x: Math.round(x.x), y: Math.round(x.y), w: Math.round(x.width), h: Math.round(x.height) }; };
    const brand = document.querySelector('header a[href="/"], .h-brand, [class*="brand"]');
    const crumb = document.querySelector('.genesis6-hub__breadcrumb');
    const a = brand ? R(brand) : null, c = crumb ? R(crumb) : null;
    let overlap = null;
    if (a && c) {
      const ox = Math.max(0, Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x));
      const oy = Math.max(0, Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y));
      overlap = { ox, oy, px: ox * oy };
    }
    const brandHit = (() => { if (!a) return null; const el = document.elementFromPoint(a.x + 40, a.y + a.h / 2); return el ? `${el.tagName}.${(el.className||'').toString().slice(0,40)}` : null; })();
    const brandText = brand ? brand.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) : null;
    const crumbText = crumb ? crumb.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : null;
    const crumbZ = crumb ? getComputedStyle(crumb).zIndex : null, brandZ = brand ? getComputedStyle(brand).zIndex : null;
    // доступность крошек: есть ли aria
    return { brand: a, crumb: c, overlap, brandText, crumbText, brandHitAt40px: brandHit, crumbZ, brandZ, crumbTag: crumb ? crumb.tagName : null, crumbAria: crumb ? crumb.getAttribute('aria-label') : null, crumbRole: crumb ? crumb.getAttribute('role') : null };
  });
  console.log('\n=== genesis-6 шапка на 390px ===');
  console.log(JSON.stringify(r, null, 1));
  await p.screenshot({ path: './out/genesis6-header-zoom.png', clip: { x: 0, y: 0, width: 390, height: 120 } });
  await ctx.close();
}
await b.close();
