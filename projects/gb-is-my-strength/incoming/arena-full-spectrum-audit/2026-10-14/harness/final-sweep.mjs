// final-sweep.mjs — (1) количественная оценка доступности узлов атласа, (2) axe по 6 маршрутам, (3) LCP/CLS.
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8099';
const OUT = process.env.OUT || './out';
mkdirSync(OUT, { recursive: true });
const EXEC = process.env.CHROME_PATH || '/tmp/gbchrome/chrome.sh';
const AXE = existsSync('./axe.min.js') ? readFileSync(process.env.AXE || './axe.min.js', 'utf8') : null;
const ROUTES = ['/', '/articles/', '/rodosloviye/', '/baptisty-rossii/', '/articles/dzhon-gill-chast-1-chelovek/', '/hard-texts/genesis-6/'];
const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const report = { axe: {}, metrics: {}, atlas: null };

// (1) атлас: точная количественная оценка
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', locale: 'ru-RU' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/rodosloviye/', { waitUntil: 'load' });
  await page.waitForTimeout(7000);
  const cdp = await page.context().newCDPSession(page);
  const ax = await cdp.send('Accessibility.getFullAXTree');
  const axNamed = ax.nodes.filter(n => /открыть сведения и семью/.test(n.name?.value || ''));
  const data = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('.react-flow__node')];
    const rows = nodes.map(n => {
      const r = n.getBoundingClientRect();
      const card = n.querySelector('.genealogy-node');
      const cr = card ? card.getBoundingClientRect() : null;
      const hit = (() => { const x = r.x + r.width / 2, y = r.y + r.height / 2; if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return 'off-screen'; const el = document.elementFromPoint(x, y); return el ? (n.contains(el) ? 'own-subtree' : 'other:' + el.tagName) : 'none'; })();
      return {
        id: n.getAttribute('data-id'), nodeBox: `${Math.round(r.width)}x${Math.round(r.height)}`,
        cardBox: cr ? `${Math.round(cr.width)}x${Math.round(cr.height)}` : null,
        cardVisible: cr ? (cr.width >= 20 && cr.height >= 10) : false,
        tabindex: n.getAttribute('tabindex'), aria: n.getAttribute('aria-label'),
        hit,
      };
    });
    const focusable = [...document.querySelectorAll('#genealogy-tree [tabindex="0"], #genealogy-tree a[href], #genealogy-tree button')].length;
    return {
      total: rows.length,
      cardVisible: rows.filter(r => r.cardVisible).length,
      cardHidden: rows.filter(r => !r.cardVisible).length,
      tabindex0: rows.filter(r => r.tabindex === '0').length,
      withAria: rows.filter(r => r.aria).length,
      hitOwn: rows.filter(r => r.hit === 'own-subtree').length,
      hitOther: rows.filter(r => r.hit.startsWith('other')).length,
      focusableInGraph: focusable,
      hiddenExamples: rows.filter(r => !r.cardVisible).slice(0, 3),
      visibleExamples: rows.filter(r => r.cardVisible).slice(0, 6).map(r => `${r.id}:card=${r.cardBox},node=${r.nodeBox},tab=${r.tabindex},hit=${r.hit}`),
    };
  });
  data.axNodesNamed = axNamed.length;
  data.axRoles = [...new Set(axNamed.map(n => n.role?.value))];
  data.axIgnored = axNamed.filter(n => n.ignored).length;
  report.atlas = data;
  await ctx.close();
}

// (2+3) axe и метрики по маршрутам
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'light', locale: 'ru-RU' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  await page.goto(BASE + route, { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  const metrics = await page.evaluate(async () => {
    const lcp = await new Promise(resolve => {
      let v = 0;
      try {
        new PerformanceObserver(l => { for (const e of l.getEntries()) v = Math.max(v, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(Math.round(v)), 2500);
      } catch { resolve(null); }
    });
    const cls = await new Promise(resolve => {
      let sum = 0;
      try {
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) sum += e.value; }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(+sum.toFixed(4)), 2500);
      } catch { resolve(null); }
    });
    return { lcp, cls };
  });
  if (AXE) {
    await page.addScriptTag({ content: AXE });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
      return r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 4).map(n => n.target.join(' ').slice(0, 70)) }));
    });
    report.axe[route] = axe;
  }
  report.metrics[route] = { ...metrics, consoleErrors: errs.length };
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/final-sweep.json`, JSON.stringify(report, null, 1));
console.log('=== АТЛАС ===');
console.log(JSON.stringify(report.atlas, null, 1));
console.log('\n=== AXE (390px) ===');
for (const [r, v] of Object.entries(report.axe)) console.log(`${r}\n   ` + (v.length ? v.map(x => `${x.id}(${x.impact})×${x.nodes} → ${x.targets[0]}`).join('\n   ') : 'нарушений нет'));
console.log('\n=== МЕТРИКИ (390px) ===');
for (const [r, v] of Object.entries(report.metrics)) console.log(`${r.padEnd(50)} LCP=${v.lcp}ms CLS=${v.cls} consoleErrors=${v.consoleErrors}`);
