// mobile-icons-sweep.mjs — мобильные/планшетные иконки-кнопки: геометрия, выход за экран, иконки.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const EXEC = process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh';

const ROUTES = ['/', '/articles/', '/articles/dzhon-gill-chast-1-chelovek/', '/articles/kod-da-vinchi/', '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/', '/hard-texts/genesis-6/'];
const VIEWPORTS = [
  { label: '390', width: 390, height: 844, isMobile: true },
  { label: '768', width: 768, height: 900, isMobile: false },
];

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const report = {};
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.isMobile, colorScheme: 'light', locale: 'ru-RU' });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    const data = await page.evaluate(() => {
      const norm = s => (s || '').replace(/\s+/g, ' ').trim();
      const vw = window.innerWidth, vh = window.innerHeight;
      const items = [];
      document.querySelectorAll('button, a[role=button], .gb-icon, [class*="icon-btn"], [class*="fab"]').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) return;
        const cs = getComputedStyle(el);
        const svg = el.querySelector('svg');
        const visible = cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < vh;
        if (!visible) return;
        items.push({
          tag: el.tagName, id: el.id || null, cls: (el.className || '').toString().slice(0, 50),
          aria: el.getAttribute('aria-label'), text: norm(el.textContent).slice(0, 14),
          x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
          offRight: Math.round(r.right - vw), offLeft: Math.round(r.left), offBottom: Math.round(r.bottom - vh),
          svg: svg ? svg.getAttribute('viewBox') : null,
          labelInsideSvg: svg ? norm(svg.textContent).slice(0, 10) : null,
          hasTextChild: el.childElementCount === 0 && norm(el.textContent).length > 0,
          outsideViewport: r.right > vw + 0.5 || r.left < -0.5 || r.bottom > vh + 0.5,
          minTap: Math.min(r.width, r.height) < 24,
        });
      });
      return { vw, vh, scrollW: document.documentElement.scrollWidth, items };
    });
    const key = `${vp.label}${route}`;
    // сохранить только те, что вызывают вопросы + все «круглые» иконки
    report[key] = {
      vw: data.vw, scrollW: data.scrollW,
      problematic: data.items.filter(i => i.outsideViewport || i.minTap),
      icons: data.items.filter(i => i.svg || i.aria).slice(0, 20),
    };
    if (data.scrollW > data.vw) report[key].hScroll = true;
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/mobile-icons-sweep.json`, JSON.stringify(report, null, 1));
for (const [k, v] of Object.entries(report)) {
  console.log(`\n== ${k} | scrollW=${v.scrollW} (vw ${v.vw})${v.hScroll ? ' ⚠ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ' : ''}`);
  for (const p of v.problematic) console.log(`   ⚠ ${p.tag}#${p.id || '-'} .${p.cls} aria=${p.aria} rect=(${p.x},${p.y},${p.w}x${p.h}) offRight=${p.offRight} minTap=${p.minTap}`);
  console.log('   иконки:', v.icons.map(i => `${i.aria || i.text || i.cls}(${i.w}x${i.h})`).join(', ').slice(0, 240));
}
